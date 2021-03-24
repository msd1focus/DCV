CREATE OR REPLACE PACKAGE            "DCV_PKG" AS
    TYPE string_tab IS TABLE OF VARCHAR2(100);

    FUNCTION get_dcv_no RETURN VARCHAR2;
    PROCEDURE get_dcv_no (dcvNo OUT VARCHAR2);
    FUNCTION get_proposal_id_by_pcno (pPcNo VARCHAR2) RETURN NUMBER;
    PROCEDURE validate_pc (nopc VARCHAR2, keypc VARCHAR2, pcust_code varchar2,
                                response OUT varchar2, 
                                message OUT VARCHAR2, 
                                tInformation_pc OUT SYS_REFCURSOR);
--    PROCEDURE collect_users (user_list_o OUT SYS_REFCURSOR);
    PROCEDURE collect_libur (libur_list_o OUT SYS_REFCURSOR);
    PROCEDURE copy_dcv (no_dcv VARCHAR2, cust_code VARCHAR2, MESSAGE OUT VARCHAR2, tCopy_DCV_DETAIL OUT SYS_REFCURSOR);
    PROCEDURE update_copied_dcv (vdcvh_id VARCHAR2, tdcv_request OUT SYS_REFCURSOR);
    PROCEDURE dcv_task_list (pBagian IN VARCHAR2, pUserName IN VARCHAR2, pJenis IN VARCHAR2, pPeriode1 IN DATE, pPeriode2 IN DATE, pList OUT SYS_REFCURSOR);
    PROCEDURE upload_dok_list (pTaskId IN NUMBER, pBagian IN VARCHAR2, pList OUT SYS_REFCURSOR) ;
    PROCEDURE find_all_by_dcvid ( vdcvhid IN number, tFind OUT SYS_REFCURSOR);
    PROCEDURE proposal_cust_mapping (pcust_code VARCHAR2, tproposal_cust_mapping OUT SYS_REFCURSOR);
    PROCEDURE sync_dcv_value (pNoDcv IN VARCHAR2, vErrorMsg OUT VARCHAR2) ;

    PROCEDURE get_prod_details (pId IN NUMBER, pList OUT SYS_REFCURSOR);
    PROCEDURE get_uom_stm (ppId IN NUMBER, pList OUT SYS_REFCURSOR);

    FUNCTION hitung_sla (pAssign DATE, pTarget DATE) RETURN NUMBER;

--    PROCEDURE populate_sales_mapping (pdcvid NUMBER);
END DCV_PKG;


/


CREATE OR REPLACE PACKAGE BODY            "DCV_PKG" AS

  FUNCTION get_dcv_no RETURN VARCHAR2 AS
    lnumber NUMBER;
    vDcvno VARCHAR2(15);
    PRAGMA AUTONOMOUS_TRANSACTION;
  BEGIN
    SELECT lastnum INTO lnumber
    FROM dcv_number
    WHERE period = to_number(to_char(sysdate,'YYYYMM'))
    FOR UPDATE;

    lnumber := lnumber+1;
    UPDATE dcv_number SET lastnum = lnumber, modified_dt = SYSDATE
    WHERE period = to_number(to_char(SYSDATE,'YYYYMM'));
    vDcvNo := TO_CHAR(SYSDATE,'YYYYMM')||TO_CHAR(lnumber,'fm000009');
    COMMIT;
    RETURN (vDcvNo);
  END get_dcv_no;

  PROCEDURE get_dcv_no (dcvNo OUT VARCHAR2) AS
  BEGIN
     dcvNo := get_dcv_no;
  END;

  FUNCTION get_proposal_id_by_pcno (pPcNo VARCHAR2) RETURN NUMBER AS
    vPropId focuspp.proposal.proposal_id%TYPE;
    vNoPc focuspp.proposal.confirm_no%TYPE;
    vNoAdd focuspp.proposal.addendum_ke%TYPE;
    vDashPos NUMBER;
  BEGIN
    vDashPos := INSTR(pPCNo,'-');

    BEGIN
        IF vDashPos > 0 THEN
            vNoPc := SUBSTR(pPcNo,1, vDashPos-1);
            vNoAdd := SUBSTR(pPcNo, vDashPos+1);

            SELECT proposal_id INTO vPropId
            FROM focuspp.proposal
            WHERE confirm_no = vNoPc
            AND addendum_ke = vNoAdd;
        ELSE
            vNoPc := pPcNo;

            SELECT proposal_id INTO vPropId
            FROM focuspp.proposal
            WHERE confirm_no = vNoPc
            AND addendum_ke IS NULL;
        END IF;

        RETURN (vPropId);
    EXCEPTION WHEN NO_DATA_FOUND THEN RETURN (-1);
    END;

  END;

PROCEDURE validate_pc (nopc VARCHAR2, keypc VARCHAR2, pcust_code varchar2,
                                response OUT varchar2, 
                                message OUT VARCHAR2, 
                                tInformation_pc OUT SYS_REFCURSOR) AS
    vProposalId NUMBER;
    vProposal focuspp.proposal%ROWTYPE;
    vDcv1 dcv_request%ROWTYPE;
    vCountSTM number;
    vProposalidTAMBAHAN varchar2(200);
    vInformation_PC Information_PC%ROWTYPE;
    tgl_akhir_periode DATE;
    vKeypc varchar2(200);
    vHariPC number;

    business_failure   EXCEPTION;

  BEGIN
    vKeypc := replace(keypc,'''');
    
  /* jika sukses : response = 1, message = nomor proposal */
  /* jika error : response < 0, message = error information */
    vProposalId := dcv_pkg.get_proposal_id_by_pcno(nopc);
    dbms_output.put_line(vProposalId);
    IF vProposalId = -1 THEN
            message := 'No PC '||nopc||' tidak ada.';
            RAISE business_failure;
    END IF;

    SELECT * INTO vProposal FROM focuspp.proposal WHERE proposal_id = vProposalId;
    tgl_akhir_periode := vProposal.periode_prog_to;

    SELECT VALUE INTO vHariPC FROM LOOKUP_CODE where title = 'VALIDATE.PC.HARI';

    -- validasi 1
    IF vProposal.mekanisme_penagihan != 'OFFINVOICE' THEN
       message := 'Mekanisme Penagihan PC Harus Off Invoices';
       RAISE business_failure;
    END IF;

     -- validasi 2
    IF vProposal.STATUS != 'ACTIVE' THEN
       message := 'Status PC tidak aktif';
       RAISE business_failure;
    END IF;

    -- validasi 3
    IF vProposal.report_run_number != vKeypc THEN
       message := 'No Key PC tidak sesuai  dengan no PC';
       RAISE business_failure;
    END IF;

    --validasi ke 4
    IF tgl_akhir_periode + vHariPC > sysdate THEN
      message := 'Klaim PC harus di atas' || vHariPC || ' hari dihitung dari tanggal berakhirnya periode PC';
      RAISE business_failure;
    END IF;


    --validasi ke 5
    IF sysdate <= tgl_akhir_periode THEN
      message := 'Klaim PC tidak bisa ketika periode promo masih atau belum berjalan';
      RAISE business_failure;
    END IF;

    -- validasi 8
    BEGIN 
      SELECT * INTO vDcv1 FROM dcv_request
      WHERE dcvh_no_pp_id = vProposalId
      AND DCVH_CUST_CODE = pcust_code
      AND dcvh_status != 'TERMINATED';
      
      message := 'Hanya bisa 1x Klaim untuk nomor PC ' || nopc;
      RAISE business_failure;

    EXCEPTION
    WHEN NO_DATA_FOUND THEN NULL;
    WHEN TOO_MANY_ROWS THEN
      message := 'Hanya bisa 1x Klaim untuk nomor PC ' || nopc;
      RAISE business_failure;
    END;

    -- validasi 9
    BEGIN
        select count(*) INTO vCountSTM 
        from table(pipedqry.stm_validation(pcust_code)) , focuspp.proposal pa
        where 
        tanggal between to_char(pa.periode_prog_from,'YYYYMMDD') 
        and to_char(pa.periode_prog_to,'YYYYMMDD')
        and proposal_id =vProposalId;

        IF vCountSTM < 1 THEN 
            message := 'Data STM tidak ada atau belum terdafar';
            RAISE business_failure;
        END IF;
    EXCEPTION WHEN OTHERS THEN
        message := 'Internal Error: Gagal cek data STM';
        RAISE business_failure;
    END;

    -- validasi 10
    BEGIN
        Select proposal_id INTO vProposalidTAMBAHAN  from focuspp.proposal
        where proposal_id = vProposalId
        and (COPY_TYPE = 'TAMBAHAN' OR COPY_TYPE = 'PENGGANTI');
        
        message := 'PC yang ditagih tidak boleh merupakah PC Pengganti atau PC Tambahan';
        RAISE business_failure;

    EXCEPTION 
    WHEN NO_DATA_FOUND THEN NULL;
    WHEN TOO_MANY_ROWS THEN
        message := 'PC yang ditagih tidak boleh merupakah PC Pengganti atau PC Tambahan';
        RAISE business_failure;
    END;

    -- sukses
    response := 'PASSED';

    OPEN tInformation_pc FOR 
        SELECT proposal_id,
           proposal_no		 AS proposal_no,
           DECODE(addendum_ke,null,confirm_no,confirm_no||'-'||addendum_ke) AS no_pc,
           report_run_number AS key_pc,
           periode_prog_from AS periode_pc_from,
           periode_prog_to   AS periode_pc_to,
           proposal_type       AS kategori_pc,
           discount_type           AS tipe_pc,
           CAST(1 AS varchar2(50)) AS SYARAT_1,
           case 
            when (select sysdate from dual)-periode_prog_to > 45 then CAST(2 AS varchar2(50))
            when (select sysdate from dual)-periode_prog_to <= 45 then CAST(3 AS varchar2(50))
           end as SYARAT_2 
           FROM focuspp.proposal a
           WHERE proposal_id = vProposalId;

EXCEPTION 
WHEN NO_DATA_FOUND THEN
    response := 'FAILED';
    message := 'Internal Error: NO_DATA_FOUND';
WHEN business_failure THEN
    response := 'FAILED';

END validate_pc;


PROCEDURE get_uom_stm (ppid NUMBER, plist OUT SYS_REFCURSOR)
AS
    vUom1 VARCHAR2(15);
    vUom2 VARCHAR2(15);
    vUom3 VARCHAR2(15);
BEGIN
    OPEN plist FOR
--        SELECT DISTINCT ppid AS promo_produk_id, COLUMN_VALUE AS uom 
--        FROM TABLE(get_uom_stm(ppid));
        SELECT DISTINCT ppid AS promo_produk_id, COLUMN_VALUE AS uom 
        FROM TABLE(pipedqry.get_uom_stm(ppid));
END get_uom_stm;

PROCEDURE get_prod_details (pId IN NUMBER, pList OUT SYS_REFCURSOR)
AS
    vpp focuspp.promo_produk%ROWTYPE;
    vList SYS_REFCURSOR;
BEGIN

    OPEN vList FOR
        WITH q_variant as(
            select promo_produk_id, 
                listagg( prod_variant,', ') within group (order by variant_desc) as prod_variant,
                listagg( variant_desc,', ') within group (order by variant_desc) as variant_desc
            from focuspp.produk_variant 
            group by promo_produk_id
        ),
        q_item as (
            select promo_produk_id
            ,RTRIM(XMLAGG(XMLELEMENT(E,prod_item,',').EXTRACT('//text()') ORDER BY ITEM_DESC).GetClobVal(),',') AS prod_item
            ,RTRIM(XMLAGG(XMLELEMENT(E,ITEM_DESC,',').EXTRACT('//text()') ORDER BY ITEM_DESC).GetClobVal(),',') AS item_desc
            from focuspp.produk_item
            group by promo_produk_id
        )
        SELECT 
                proposal_id
              , TO_CHAR(rownum) as no_linepc
              , variant
              , prod_variant
              , prod_item
              , item
              , PRODUCT_CLASS
              , PRODUCT_CLASS_DESC
              , PRODUCT_BRAND
              , PRODUCT_BRAND_DESC
              , PRODUCT_EXT
              , PRODUCT_EXT_DESC
              , PRODUCT_PACK
              , PRODUCT_PACK_DESC
              , promo_produk_id
        FROM (
            SELECT p.proposal_id
              , SUBSTR(pv.variant_desc,1,2000) as variant
              , SUBSTR(pv.prod_variant,1,2000) AS prod_variant
              , SUBSTR(pi.prod_item,1,500) as prod_item
              , SUBSTR(pi.item_desc,1,500) as item
              , pp.PRODUCT_CLASS
              , pp.PRODUCT_CLASS_DESC
              , pp.PRODUCT_BRAND
              , pp.PRODUCT_BRAND_DESC
              , pp.PRODUCT_EXT
              , pp.PRODUCT_EXT_DESC
              , pp.PRODUCT_PACK
              , pp.PRODUCT_PACK_DESC
              , pp.promo_produk_id
            FROM focuspp.promo_produk pp 
            JOIN focuspp.proposal p on p.proposal_id = pp.proposal_id
            LEFT OUTER JOIN q_variant pv on pv.promo_produk_id = pp.promo_produk_id
            LEFT OUTER JOIN q_item pi on pi.promo_produk_id = pp.promo_produk_id
            WHERE p.proposal_id = pId
            AND pp.product_approval = 'Y'
            order by pp.promo_produk_id
        );
    pList := vList;
EXCEPTION WHEN NO_DATA_FOUND THEN null;
END get_prod_details;

--  PROCEDURE collect_users (user_list_o OUT SYS_REFCURSOR) AS
--  BEGIN 
--    OPEN user_list_o FOR SELECT * FROM dcv_user_access ORDER BY id; 
--  END collect_users;
--
  PROCEDURE collect_libur (libur_list_o OUT SYS_REFCURSOR) AS
  BEGIN 
    OPEN libur_list_o FOR SELECT * FROM holiday ORDER BY tgl_libur DESC; 
  END collect_libur;

  PROCEDURE copy_dcv (no_dcv VARCHAR2, cust_code VARCHAR2, MESSAGE OUT VARCHAR2, tCopy_DCV_DETAIL OUT SYS_REFCURSOR) AS
   vDcv dcv_request%ROWTYPE;
   vmsg VARCHAR2(100) := 'Pass';
  BEGIN

    BEGIN
        SELECT * INTO vDcv FROM dcv_request WHERE dcvh_no_dcv = no_dcv;
        IF vDcv.dcvh_status <> 'TERMINATED' THEN
            vmsg := 'DCV tersebut belum Terminated';
        ELSIF vDcv.dcvh_cust_code <> cust_code THEN
          vmsg := 'No DCV tersebut tidak ada, atau sudah pernah dicopy';
        ELSIF vDcv.copy_from IS NOT NULL THEN
          vmsg := 'No DCV tersebut tidak ada, atau sudah pernah dicopy';
        END IF;
    EXCEPTION WHEN NO_DATA_FOUND THEN
        vmsg := 'DCV tersebut tidak ada';
    END;

    IF vmsg = 'Pass' THEN
        OPEN tCopy_DCV_DETAIL FOR
            SELECT no_linepc, 
                    product_class, product_class_desc,
                    product_brand, product_brand_desc,
                    product_ext, product_ext_desc,
                    product_pack, product_pack_desc,
                    variant as product_variant, prod_variant as product_variant_desc,
                    prod_item as product_item, 
                    dbms_lob.substr(item,4000,1) as product_item_desc,
                    r.dcvl_qty as qty,
                    r.dcvl_uom as satuan,
                    r.dcvl_val_exc as value_ext,
                    r.dcvl_catatan_distributor as notes,
                    n.promo_produk_id
            FROM new_dcv_detail n 
            LEFT OUTER JOIN request_dtl r ON n.promo_produk_id = r.dcvl_promo_product_id
            WHERE n.proposal_id = vDcv.dcvh_no_pp_id
            ORDER BY no_linepc;
    END IF;
    message := vmsg;
  END copy_dcv;

  PROCEDURE update_copied_dcv (vdcvh_id VARCHAR2, tdcv_request OUT SYS_REFCURSOR) AS
    BEGIN
    update dcv_request
    set copy_from = 'COPIED'
    where dcvh_id = vdcvh_id;

    OPEN tdcv_request FOR
      SELECT *
        FROM dcv_request
       WHERE dcvh_id = vdcvh_id;
    END update_copied_dcv;

    FUNCTION hitung_sla (pAssign DATE, pTarget DATE) RETURN NUMBER
    AS
        vTarget NUMBER;
        vElapse NUMBER;
        vSla NUMBER;
    BEGIN
        vTarget := TRUNC(pTarget) - TRUNC(pAssign);
        IF vTarget = 0 THEN vTarget := 1; END IF;
        vElapse := TRUNC(SYSDATE) - TRUNC(pAssign);
        RETURN ROUND(vElapse / vTarget * 100);
    END;

PROCEDURE task_list_distributor (pUserName IN VARCHAR2,
                          pJenis IN VARCHAR2,
                          pPeriode1 IN DATE,
                          pPeriode2 IN DATE,
                          pList OUT SYS_REFCURSOR)
AS
     c_list SYS_REFCURSOR;
BEGIN

    IF pJenis = 'DCV All' THEN

        OPEN c_list FOR
            WITH
                task_qry AS
                (SELECT t1.id, t1.dcvh_id, t1.no_dcv, t1.bagian, t1.nodecode, t1.return_task, 
                hitung_sla(t1.assign_time,t1.target_selesai) sla,
                t1.assign_time, t1.target_selesai
                FROM wf_task t1
                WHERE t1.task_type = 'Human'
                AND t1.bagian = 'Distributor'
                AND t1.progress_status = 'WAIT'
                AND CASE
                    WHEN t1.prime_route = 'N' AND EXISTS (select 'x' from wf_task t2
                                                    where t1.no_dcv = t2.no_dcv
                                                    and t2.progress_status = 'WAIT'
                                                    and t2.bagian = t1.bagian
                                                    and t2.id <> t1.id
                                                    and t2.prime_route = 'Y') THEN 2
                    ELSE 1
                    END =1
                )
             SELECT
                r.dcvh_id
                ,r.dcvh_no_dcv
                ,r.dcvh_submit_time
                ,r.dcvh_cust_code
                ,r.dcvh_cust_name
                ,r.dcvh_company
                ,r.dcvh_no_pc
                ,r.dcvh_region
                ,r.dcvh_area
                ,r.dcvh_location
                ,r.dcvh_periode_pc_start
                ,r.dcvh_periode_pc_end
                ,r.dcvh_pc_kategori
                ,r.dcvh_pc_tipe
                ,r.dcvh_value
                ,r.dcvh_appv_value
                ,fp.doc_no AS nofaktur
                ,kw.doc_no AS nokwitansi
                ,r.dcvh_last_step
                ,r.dcvh_current_step
                ,t.id as taskid
                ,t.return_task
                ,t.nodecode
                ,r.dcvh_status
                ,t.sla
            FROM dcv_request r
            LEFT OUTER JOIN dcv_documents fp ON fp.dcvh_id = r.dcvh_id AND fp.doc_type = 'RF'
            LEFT OUTER JOIN dcv_documents kw ON fp.dcvh_id = r.dcvh_id AND fp.doc_type = 'KW'
            LEFT OUTER JOIN task_qry t ON t.dcvh_id = r.dcvh_id
            WHERE r.dcvh_cust_code = pUserName
            AND r.dcvh_submit_time BETWEEN TRUNC(pPeriode1) AND TRUNC(pPeriode2+1)
            AND r.dcvh_status <> 'TERMINATED'
            ORDER BY NVL(t.sla,0) DESC, r.dcvh_id;

    ELSE

        OPEN c_list FOR
            WITH
                task_qry AS
                (SELECT t1.id, t1.dcvh_id, t1.no_dcv, t1.bagian, t1.nodecode, t1.return_task, 
                    hitung_sla(t1.assign_time,t1.target_selesai) sla,
                    t1.assign_time, t1.target_selesai
                FROM wf_task t1
                WHERE t1.task_type = 'Human'
                AND t1.bagian = 'Distributor'
                AND t1.progress_status = 'WAIT'
                AND CASE
                    WHEN pJenis = 'Return Task' AND NVL(t1.return_task,'N') = 'Y' THEN 0
                    WHEN pJenis = 'New Task' AND NVL(t1.return_task,'N') = 'N' THEN 0
                    ELSE 1
                    END = 0
                AND CASE
                    WHEN t1.prime_route = 'N' AND EXISTS (select 'x' from wf_task t2
                                                    where t1.no_dcv = t2.no_dcv
                                                    and t2.progress_status = 'WAIT'
                                                    and t2.bagian = t1.bagian
                                                    and t2.id <> t1.id
                                                    and t2.prime_route = 'Y') THEN 2
                    ELSE 1
                    END =1
                )
             SELECT
                r.dcvh_id
                ,r.dcvh_no_dcv
                ,r.dcvh_submit_time
                ,r.dcvh_cust_code
                ,r.dcvh_cust_name
                ,r.dcvh_company
                ,r.dcvh_no_pc
                ,r.dcvh_region
                ,r.dcvh_area
                ,r.dcvh_location
                ,r.dcvh_periode_pc_start
                ,r.dcvh_periode_pc_end
                ,r.dcvh_pc_kategori
                ,r.dcvh_pc_tipe
                ,r.dcvh_value
                ,r.dcvh_appv_value
                ,fp.doc_no AS nofaktur
                ,kw.doc_no AS nokwitansi
                ,r.dcvh_last_step
                ,r.dcvh_current_step
                ,t.id as taskid
                ,t.return_task
                ,t.nodecode
                ,r.dcvh_status
                ,t.sla
            FROM dcv_request r
            LEFT OUTER JOIN dcv_documents fp ON fp.dcvh_id = r.dcvh_id AND fp.doc_type = 'RF'
            LEFT OUTER JOIN dcv_documents kw ON fp.dcvh_id = r.dcvh_id AND fp.doc_type = 'KW'
            INNER JOIN task_qry t ON t.dcvh_id = r.dcvh_id
            WHERE r.dcvh_cust_code = pUserName
            AND r.dcvh_submit_time BETWEEN TRUNC(pPeriode1) AND TRUNC(pPeriode2+1)
            AND r.dcvh_status <> 'TERMINATED'
            ORDER BY NVL(t.sla,0) DESC, r.dcvh_id;

    END IF;

    pList := c_list;
END task_list_distributor;

PROCEDURE task_list_admin (pUserName IN VARCHAR2,
                          pJenis IN VARCHAR2,
                          pPeriode1 IN DATE,
                          pPeriode2 IN DATE,
                          pList OUT SYS_REFCURSOR)
AS
     c_list SYS_REFCURSOR;
     vDivisi VARCHAR2(50);
BEGIN
    IF pJenis = 'DCV All' THEN
        OPEN c_list FOR
            WITH
                task_qry AS
                (SELECT t1.id, t1.dcvh_id, t1.no_dcv, t1.bagian, t1.nodecode, t1.return_task, 
                        hitung_sla(t1.assign_time,t1.target_selesai) sla,
                t1.assign_time, t1.target_selesai
                FROM wf_task t1
                WHERE t1.task_type = 'Human'
                AND t1.bagian <> 'Distributor'
                AND t1.progress_status = 'WAIT'
                AND CASE WHEN t1.nodecode IN ('TC4','TC5') AND EXISTS (select 'x' from wf_task t2                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
                                                    where t1.no_dcv = t2.no_dcv                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
                                                    and t2.progress_status = 'WAIT'                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
                                                    and t2.id <> t1.id                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
                                                    and t2.nodecode = 'TC2') THEN 2                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
                        WHEN t1.nodecode = 'TC5' AND EXISTS (select 'x' from wf_task t2                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
                                                    where t1.no_dcv = t2.no_dcv                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
                                                    and t2.progress_status = 'WAIT'                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
                                                    and t2.id <> t1.id                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
                                                    and t2.nodecode = 'TC4') THEN 2                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
                        ELSE 1                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
                    END =1    
                )
            SELECT
            r.dcvh_id
            ,r.dcvh_no_dcv
            ,r.dcvh_submit_time
            ,r.dcvh_cust_code
            ,r.dcvh_cust_name
            ,r.dcvh_company
            ,r.dcvh_no_pc
            ,r.dcvh_region
            ,r.dcvh_area
            ,r.dcvh_location
            ,r.dcvh_periode_pc_start
            ,r.dcvh_periode_pc_end
            ,r.dcvh_pc_kategori
            ,r.dcvh_pc_tipe
            ,r.dcvh_value
            ,r.dcvh_appv_value
            ,fp.doc_no AS nofaktur
            ,kw.doc_no AS nokwitansi
            ,r.dcvh_last_step
            ,r.dcvh_current_step
            ,t.id as taskid
            ,t.return_task
            ,t.nodecode
            ,r.dcvh_status
            ,t.sla
            FROM dcv_request r
            LEFT OUTER JOIN dcv_documents fp ON fp.dcvh_id = r.dcvh_id AND fp.doc_type = 'RF'
            LEFT OUTER JOIN dcv_documents kw ON fp.dcvh_id = r.dcvh_id AND fp.doc_type = 'KW'
            LEFT OUTER JOIN task_qry t ON t.dcvh_id = r.dcvh_id
            WHERE r.dcvh_status <> 'TERMINATED'
                AND r.dcvh_submit_time BETWEEN TRUNC(pPeriode1) AND TRUNC(pPeriode2+1)
            ORDER BY NVL(t.sla,0) DESC, r.dcvh_id;

    ELSE

        OPEN c_list FOR
             WITH
                task_qry AS
                (SELECT t1.id, t1.dcvh_id, t1.no_dcv, t1.bagian, t1.nodecode, t1.return_task, 
                        hitung_sla(t1.assign_time,t1.target_selesai) sla,
                t1.assign_time, t1.target_selesai
                FROM wf_task t1
                WHERE t1.task_type = 'Human'
                AND t1.bagian <> 'Distributor'
                AND t1.progress_status = 'WAIT'
                AND CASE
                    WHEN pJenis = 'Return Task' AND NVL(t1.return_task,'N') = 'Y' THEN 0
                    WHEN pJenis = 'New Task' AND NVL(t1.return_task,'N') = 'N' THEN 0
                    ELSE 1
                    END = 0
                AND CASE WHEN t1.nodecode IN ('TC4','TC5') AND EXISTS (select 'x' from wf_task t2                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
                                                    where t1.no_dcv = t2.no_dcv                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
                                                    and t2.progress_status = 'WAIT'                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
                                                    and t2.id <> t1.id                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
                                                    and t2.nodecode = 'TC2') THEN 2                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
                        WHEN t1.nodecode = 'TC5' AND EXISTS (select 'x' from wf_task t2                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
                                                    where t1.no_dcv = t2.no_dcv                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
                                                    and t2.progress_status = 'WAIT'                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
                                                    and t2.id <> t1.id                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
                                                    and t2.nodecode = 'TC4') THEN 2                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
                        ELSE 1                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
                    END =1    
                )
             SELECT
            r.dcvh_id
            ,r.dcvh_no_dcv
            ,r.dcvh_submit_time
            ,r.dcvh_cust_code
            ,r.dcvh_cust_name
            ,r.dcvh_company
            ,r.dcvh_no_pc
            ,r.dcvh_region
            ,r.dcvh_area
            ,r.dcvh_location
            ,r.dcvh_periode_pc_start
            ,r.dcvh_periode_pc_end
            ,r.dcvh_pc_kategori
            ,r.dcvh_pc_tipe
            ,r.dcvh_value
            ,r.dcvh_appv_value
            ,fp.doc_no AS nofaktur
            ,kw.doc_no AS nokwitansi
            ,r.dcvh_last_step
            ,r.dcvh_current_step
            ,t.id as taskid
            ,t.return_task
            ,t.nodecode
            ,r.dcvh_status
            ,t.sla
            FROM dcv_request r
            LEFT OUTER JOIN dcv_documents fp ON fp.dcvh_id = r.dcvh_id AND fp.doc_type = 'RF'
            LEFT OUTER JOIN dcv_documents kw ON fp.dcvh_id = r.dcvh_id AND fp.doc_type = 'KW'
            JOIN task_qry t ON t.dcvh_id = r.dcvh_id
            WHERE r.dcvh_status <> 'TERMINATED'
                AND r.dcvh_submit_time BETWEEN TRUNC(pPeriode1) AND TRUNC(pPeriode2+1)
            ORDER BY NVL(t.sla,0) DESC, r.dcvh_id;
    END IF;

    pList := c_list;


END task_list_admin;

PROCEDURE task_list_sales (pUserName IN VARCHAR2,
                          pJenis IN VARCHAR2,
                          pPeriode1 IN DATE,
                          pPeriode2 IN DATE,
                          pList OUT SYS_REFCURSOR)
AS
     c_list SYS_REFCURSOR;
     vDivisi VARCHAR2(50);
BEGIN
    SELECT user_division INTO vDivisi 
    FROM focuspp.app_user_access WHERE user_name = pUserName;

    IF pJenis = 'DCV All' THEN 

        OPEN c_list FOR
            WITH task_qry AS (
                SELECT t1.id, t1.dcvh_id, t1.no_dcv, t1.bagian, t1.nodecode, t1.return_task, 
                        hitung_sla(t1.assign_time,t1.target_selesai) sla,
                        t1.assign_time, t1.target_selesai
                FROM wf_task t1
                WHERE t1.task_type = 'Human'
                AND t1.bagian = 'Sales'
                AND t1.progress_status = 'WAIT'
            )
            SELECT
            r.dcvh_id
            ,r.dcvh_no_dcv
            ,r.dcvh_submit_time
            ,r.dcvh_cust_code
            ,r.dcvh_cust_name
            ,r.dcvh_company
            ,r.dcvh_no_pc
            ,r.dcvh_region
            ,r.dcvh_area
            ,r.dcvh_location
            ,r.dcvh_periode_pc_start
            ,r.dcvh_periode_pc_end
            ,r.dcvh_pc_kategori
            ,r.dcvh_pc_tipe
            ,r.dcvh_value
            ,r.dcvh_appv_value
            ,fp.doc_no AS nofaktur
            ,kw.doc_no AS nokwitansi
            ,r.dcvh_last_step
            ,r.dcvh_current_step
            ,t.id as taskid
            ,t.return_task
            ,t.nodecode
            ,r.dcvh_status
            ,t.sla
            FROM dcv_request r
            JOIN user_restriction_v res ON res.cust_code = r.dcvh_cust_code AND res.user_name = pUserName
            LEFT OUTER JOIN dcv_documents fp ON fp.dcvh_id = r.dcvh_id AND fp.doc_type = 'RF'
            LEFT OUTER JOIN dcv_documents kw ON fp.dcvh_id = r.dcvh_id AND fp.doc_type = 'KW'
            LEFT OUTER JOIN task_qry t ON t.dcvh_id = r.dcvh_id
            WHERE r.dcvh_status <> 'TERMINATED'
             AND CASE vDivisi WHEN 'ALL' THEN 1
                            WHEN r.dcvh_pc_kategori THEN 1
                            ELSE 0 
                END = 1
           AND r.dcvh_submit_time BETWEEN TRUNC(pPeriode1) AND TRUNC(pPeriode2+1)
            ORDER BY NVL(t.sla,0) DESC, r.dcvh_id;

    ELSIF pJenis IN ('New Task', 'Return Task') THEN -- Sales

         OPEN c_list FOR
             WITH task_qry AS
                (SELECT t1.id, t1.dcvh_id, t1.no_dcv, t1.bagian, t1.nodecode, t1.return_task, 
                    hitung_sla(t1.assign_time,t1.target_selesai) sla,
                    t1.assign_time, t1.target_selesai
                FROM wf_task t1
                WHERE t1.task_type = 'Human'
                AND t1.progress_status = 'WAIT'
                AND t1.bagian = 'Sales'
                AND CASE
                    WHEN pJenis = 'Return Task' AND NVL(t1.return_task,'N') = 'Y' THEN 0
                    WHEN pJenis = 'New Task' AND NVL(t1.return_task,'N') = 'N' THEN 0
                    ELSE 1
                    END = 0
                )
             SELECT
                r.dcvh_id
                ,r.dcvh_no_dcv
                ,r.dcvh_submit_time
                ,r.dcvh_cust_code
                ,r.dcvh_cust_name
                ,r.dcvh_company
                ,r.dcvh_no_pc
                ,r.dcvh_region
                ,r.dcvh_area
                ,r.dcvh_location
                ,r.dcvh_periode_pc_start
                ,r.dcvh_periode_pc_end
                ,r.dcvh_pc_kategori
                ,r.dcvh_pc_tipe
                ,r.dcvh_value
                ,r.dcvh_appv_value
                ,fp.doc_no AS nofaktur
                ,kw.doc_no AS nokwitansi
                ,r.dcvh_last_step
                ,r.dcvh_current_step
                ,t.id as taskid
                ,t.return_task
                ,t.nodecode
                ,r.dcvh_status
                ,t.sla
            FROM dcv_request r
            JOIN user_restriction_v res ON res.cust_code = r.dcvh_cust_code AND res.user_name = pUserName
            LEFT OUTER JOIN dcv_documents fp ON fp.dcvh_id = r.dcvh_id AND fp.doc_type = 'RF'
            LEFT OUTER JOIN dcv_documents kw ON fp.dcvh_id = r.dcvh_id AND fp.doc_type = 'KW'
            INNER JOIN task_qry t ON t.dcvh_id = r.dcvh_id
            WHERE r.dcvh_status <> 'TERMINATED'
            AND CASE vDivisi WHEN 'ALL' THEN 1
                            WHEN r.dcvh_pc_kategori THEN 1
                            ELSE 0 
                END = 1
            AND r.dcvh_submit_time BETWEEN TRUNC(pPeriode1) AND TRUNC(pPeriode2+1)
           ORDER BY NVL(t.sla,0) DESC, r.dcvh_id;
    END IF;
    pList := c_list;
END task_list_sales;

PROCEDURE dcv_task_list (pBagian IN VARCHAR2,
                          pUserName IN VARCHAR2,
                          pJenis IN VARCHAR2,
                          pPeriode1 IN DATE,
                          pPeriode2 IN DATE,
                          pList OUT SYS_REFCURSOR)
  AS
     vDivisi VARCHAR2(50);
     c_list SYS_REFCURSOR;
     vRestriction user_restriction_v%ROWTYPE;
  BEGIN

    IF pBagian = 'Distributor' THEN
        task_list_distributor (pUserName, pJenis, pPeriode1, pPeriode2, c_list );

    ELSIF pBagian = 'Sales' THEN
        task_list_sales (pUserName, pJenis, pPeriode1, pPeriode2, c_List);

    ELSIF pBagian = 'Admin' THEN
        task_list_admin (pUserName, pJenis, pPeriode1, pPeriode2, c_List);

    ELSIF pJenis = 'DCV All' THEN  -- selain Distributor
        SELECT user_division INTO vDivisi 
        FROM focuspp.app_user_access WHERE user_name = pUserName;

            OPEN c_list FOR
             WITH
                task_qry AS
                (SELECT t1.id, t1.dcvh_id, t1.no_dcv, t1.bagian, t1.nodecode, t1.return_task, 
                        hitung_sla(t1.assign_time,t1.target_selesai) sla,
                t1.assign_time, t1.target_selesai
                FROM wf_task t1
                WHERE t1.task_type = 'Human'
                AND t1.bagian = pBagian
                AND t1.progress_status = 'WAIT'
                AND CASE WHEN t1.nodecode IN ('TC4','TC5') AND EXISTS (select 'x' from wf_task t2
                                                    where t1.no_dcv = t2.no_dcv
                                                    and t2.progress_status = 'WAIT'
                                                    and t2.id <> t1.id
                                                    and t2.nodecode = 'TC2') THEN 2
                        WHEN t1.nodecode = 'TC5' AND EXISTS (select 'x' from wf_task t2
                                                    where t1.no_dcv = t2.no_dcv
                                                    and t2.progress_status = 'WAIT'
                                                    and t2.id <> t1.id
                                                    and t2.nodecode = 'TC4') THEN 2
                        ELSE 1
                    END =1
                )
             SELECT
            r.dcvh_id
            ,r.dcvh_no_dcv
            ,r.dcvh_submit_time
            ,r.dcvh_cust_code
            ,r.dcvh_cust_name
            ,r.dcvh_company
            ,r.dcvh_no_pc
            ,r.dcvh_region
            ,r.dcvh_area
            ,r.dcvh_location
            ,r.dcvh_periode_pc_start
            ,r.dcvh_periode_pc_end
            ,r.dcvh_pc_kategori
            ,r.dcvh_pc_tipe
            ,r.dcvh_value
            ,r.dcvh_appv_value
            ,fp.doc_no AS nofaktur
            ,kw.doc_no AS nokwitansi
            ,r.dcvh_last_step
            ,r.dcvh_current_step
            ,t.id as taskid
            ,t.return_task
            ,t.nodecode
            ,r.dcvh_status
            ,t.sla
            FROM dcv_request r
            LEFT OUTER JOIN dcv_documents fp ON fp.dcvh_id = r.dcvh_id AND fp.doc_type = 'RF'
            LEFT OUTER JOIN dcv_documents kw ON fp.dcvh_id = r.dcvh_id AND fp.doc_type = 'KW'
            LEFT OUTER JOIN task_qry t ON t.dcvh_id = r.dcvh_id
            WHERE r.dcvh_status <> 'TERMINATED'
            AND CASE vDivisi WHEN 'ALL' THEN 1
                            WHEN r.dcvh_pc_kategori THEN 1
                            ELSE 0 
                END = 1
            AND r.dcvh_submit_time BETWEEN TRUNC(pPeriode1) AND TRUNC(pPeriode2+1)
            ORDER BY NVL(t.sla,0) DESC, r.dcvh_id;

    ELSIF pJenis IN ('New Task', 'Return Task') THEN -- selain Distributor

        SELECT user_division INTO vDivisi 
        FROM focuspp.app_user_access WHERE user_name = pUserName;

        OPEN c_list FOR
             WITH task_qry AS
                (SELECT t1.id, t1.dcvh_id, t1.no_dcv, t1.bagian, t1.nodecode, t1.return_task, 
                    hitung_sla(t1.assign_time,t1.target_selesai) sla,
                    t1.assign_time, t1.target_selesai
                FROM wf_task t1
                WHERE t1.task_type = 'Human'
                AND t1.progress_status = 'WAIT'
                AND t1.bagian = pBagian
                AND CASE
                    WHEN pJenis = 'Return Task' AND NVL(t1.return_task,'N') = 'Y' THEN 0
                    WHEN pJenis = 'New Task' AND NVL(t1.return_task,'N') = 'N' THEN 0
                    ELSE 1
                    END = 0
                AND CASE WHEN t1.nodecode IN ('TC4','TC5') AND EXISTS (select 'x' from wf_task t2
                                                    where t1.no_dcv = t2.no_dcv
                                                    and t2.progress_status = 'WAIT'
                                                    and t2.id <> t1.id
                                                    and t2.nodecode = 'TC2') THEN 2
                        WHEN t1.nodecode = 'TC5' AND EXISTS (select 'x' from wf_task t2
                                                    where t1.no_dcv = t2.no_dcv
                                                    and t2.progress_status = 'WAIT'
                                                    and t2.id <> t1.id
                                                    and t2.nodecode = 'TC4') THEN 2
                        ELSE 1
                    END =1
                )
             SELECT
                r.dcvh_id
                ,r.dcvh_no_dcv
                ,r.dcvh_submit_time
                ,r.dcvh_cust_code
                ,r.dcvh_cust_name
                ,r.dcvh_company
                ,r.dcvh_no_pc
                ,r.dcvh_region
                ,r.dcvh_area
                ,r.dcvh_location
                ,r.dcvh_periode_pc_start
                ,r.dcvh_periode_pc_end
                ,r.dcvh_pc_kategori
                ,r.dcvh_pc_tipe
                ,r.dcvh_value
                ,r.dcvh_appv_value
                ,fp.doc_no AS nofaktur
                ,kw.doc_no AS nokwitansi
                ,r.dcvh_last_step
                ,r.dcvh_current_step
                ,t.id as taskid
                ,t.return_task
                ,t.nodecode
                ,r.dcvh_status
                ,t.sla
            FROM dcv_request r
            LEFT OUTER JOIN dcv_documents fp ON fp.dcvh_id = r.dcvh_id AND fp.doc_type = 'RF'
            LEFT OUTER JOIN dcv_documents kw ON fp.dcvh_id = r.dcvh_id AND fp.doc_type = 'KW'
            INNER JOIN task_qry t ON t.dcvh_id = r.dcvh_id
            WHERE r.dcvh_status <> 'TERMINATED'
            AND CASE vDivisi WHEN 'ALL' THEN 1
                            WHEN r.dcvh_pc_kategori THEN 1
                            ELSE 0 
                END = 1
            AND r.dcvh_submit_time BETWEEN TRUNC(pPeriode1) AND TRUNC(pPeriode2+1)
           ORDER BY NVL(t.sla,0) DESC, r.dcvh_id;

    END IF;

    pList := c_list;

  EXCEPTION WHEN NO_DATA_FOUND THEN 
    pList := c_list;
  END dcv_task_list;


  PROCEDURE find_all_by_dcvid ( vdcvhid IN number, tFind OUT SYS_REFCURSOR) AS
  BEGIN
    OPEN tFind FOR
    select * from dcv_request a, request_dtl b, dcv_documents c
    where a.dcvh_id = b.dcvh_id (+)
    and a.dcvh_id = c.dcvh_id (+)
    and a.dcvh_id = vdcvhid;
  END find_all_by_dcvid;

 PROCEDURE proposal_cust_mapping (
       pcust_code              VARCHAR2,
      -- MESSAGE            OUT VARCHAR2,
       tproposal_cust_mapping   OUT SYS_REFCURSOR)
    AS
    BEGIN
    Open tproposal_cust_mapping for
        select prop_id, cust_name, no_pc 
        from map_cust_proposal mcp, focuspp.proposal pa
        where mcp.prop_id = pa.proposal_id
        and cust_name = pcust_code
 --       and rownum < 21
        order by creation_date desc;
    --EXCEPTION
    --    WHEN NO_DATA_FOUND THEN null; message := 'Tidak ada proposal yang bisa di klaim';
    END;

PROCEDURE sync_dcv_value (pNoDcv IN VARCHAR2, vErrorMsg OUT VARCHAR2) 
    AS 
        vDcv dcv_request%ROWTYPE;
        CURSOR cdtl(pdcvid VARCHAR2) IS 
                SELECT * FROM request_dtl WHERE dcvh_id = pdcvid;
        vJmlApproval NUMBER := 0;
        vPpnCode VARCHAR2(5);
        vPpnVal NUMBER;
        vQtyConv Number;
        runtotal NUMBER := 0;
        cekdistinct VARCHAR2(100);
        po_excp EXCEPTION;
        vKetrKwitansi VARCHAR2(300);
    BEGIN
        SELECT * INTO vDcv FROM dcv_request WHERE dcvh_no_dcv = pNoDcv;
dbms_output.put_line('Posisi 2454');
        BEGIN
            SELECT DISTINCT kode_suplier||kode_site INTO cekdistinct
            FROM tc_approval
            WHERE dcvl_id IN (SELECT dcvl_id FROM request_dtl 
                            WHERE dcvh_id = vDcv.dcvh_id);
        EXCEPTION 
        WHEN TOO_MANY_ROWS THEN 
            vErrorMsg := 'Error: PO tidak bisa dari supplier/site yang berbeda';
            RAISE po_excp;
        WHEN NO_DATA_FOUND THEN NULL;
        END;

  dbms_output.put_line('Posisi 3434');
      BEGIN
            SELECT no_po|| poline_id|| prod_code INTO cekdistinct
            FROM tc_approval
            WHERE dcvl_id IN (SELECT dcvl_id FROM request_dtl 
                            WHERE dcvh_id = vDcv.dcvh_id)
            GROUP BY no_po|| poline_id|| prod_code
            HAVING COUNT(*) > 1;
            vErrorMsg := 'Error: PO yang sama dipakai berulang';
            RAISE po_excp;
        EXCEPTION WHEN NO_DATA_FOUND THEN NULL;
        END;

dbms_output.put_line('Posisi 1754');
            dbms_output.put_line ('Totalrun awal: ' || runtotal);
        FOR i IN cdtl(vDcv.dcvh_id) LOOP
            SELECT NVL(SUM(nilai_total),0), 
                   NVL(SUM(po_ppn*qty/qty_po),0)
            INTO vJmlApproval, vPpnVal
            FROM tc_approval WHERE dcvl_id = i.dcvl_id;

            UPDATE request_dtl SET 
                dcvl_appv_val_exc = vJmlApproval,
                dcvl_ppn_code = CASE WHEN vPpnVal > 0 THEN 'PPN' ELSE '' END, --vPpnCode,
                dcvl_ppn_val = NVL(vPpnVal,0),
                dcvl_appv_val_inc_ppn = vJmlApproval + NVL(vPpnVal,0),
                dcvl_total_val_appv_inc = vJmlApproval + NVL(vPpnVal,0) + NVL(dcvl_pph_val,0),
                dcvl_selisih = NVL(dcvl_val_exc,0) - vJmlApproval,
                dcvl_appv_qty = vQtyCOnv,
                dcvl_appv_uom = dcvl_uom
            WHERE dcvl_id = i.dcvl_id;
dbms_output.put_line(vJmlApproval);
            runtotal := runtotal + NVL(vJmlApproval,0) + NVL(vPpnVal,0);
            dbms_output.put_line ('Totalrun: ' || runtotal);
        END LOOP;

        BEGIN
            SELECT po_desc INTO vKetrKwitansi
            FROM tc_approval
            WHERE dcvl_id IN (SELECT dcvl_id FROM request_dtl 
                            WHERE dcvh_id = vDcv.dcvh_id)
            AND ROWNUM < 2;
        EXCEPTION WHEN NO_DATA_FOUND THEN vKetrKwitansi := '';
        END;

        UPDATE dcv_request SET dcvh_appv_value = runtotal, dcvh_ketr_kwitansi = vKetrKwitansi
        WHERE dcvh_no_dcv = pNoDcv;

EXCEPTION 
    WHEN po_excp THEN NULL;
    WHEN NO_DATA_FOUND THEN vErrorMsg := 'Error: DCV tidak ditemukan';
END sync_dcv_value;

PROCEDURE upload_dok_list (pTaskId IN NUMBER, pBagian IN VARCHAR2, pList OUT SYS_REFCURSOR) 
AS
    cList SYS_REFCURSOR;
    vTask wf_task%ROWTYPE;
    vDcv dcv_request%ROWTYPE;
    vPph VARCHAR2(20);
    vPpn VARCHAR2(20);
    bPpn BOOLEAN := false;
    bPph BOOLEAN := false;
BEGIN
        SELECT * INTO vTask FROM wf_task WHERE id = pTaskId;
        SELECT * INTO vDcv FROM dcv_request WHERE dcvh_id = vTask.dcvh_id;

    FOR i IN (SELECT dcvl_ppn_code, dcvl_pph_code
                FROM request_dtl WHERE dcvh_id = vDcv.dcvh_id)
        LOOP
            IF i.dcvl_pph_code IS NOT NULL THEN bPph := true; END IF;
            IF i.dcvl_ppn_code IS NOT NULL THEN bPpn := true; END IF;
        END LOOP;

    IF pBagian = 'Distributor' AND vTask.nodecode = 'D1' THEN
        OPEN cList FOR
           SELECT 'BA' doc_code, 'Berita Acara' doc_desc
           FROM DUAL
           UNION 
           SELECT 'RF' doc_code, 'Rekap Faktur' doc_desc
           FROM DUAL;
    ELSIF pBagian = 'Distributor' AND vTask.nodecode = 'D2' AND bPpn THEN
        OPEN cList FOR
           SELECT 'FP' doc_code, 'Faktur Pajak' doc_desc
           FROM DUAL
           UNION 
           SELECT 'KW' doc_code, 'Kwitansi' doc_desc
           FROM DUAL;
    ELSIF pBagian = 'Distributor' AND vTask.nodecode = 'D2' AND NOT bPpn THEN
        OPEN cList FOR
           SELECT 'KW' doc_code, 'Kwitansi' doc_desc
           FROM DUAL;
    ELSIF pBagian = 'Distributor' AND vTask.nodecode = 'D3' THEN
        OPEN cList FOR
           SELECT 'RK' doc_code, 'Resi Kwitansi' doc_desc
           FROM DUAL;

    ELSIF pBagian = 'Tax' THEN

        IF bPpn AND bPph THEN
            OPEN cList FOR
               SELECT 'FP' doc_code, 'Faktur Pajak' doc_desc
               FROM DUAL
               UNION 
               SELECT 'BP' doc_code, 'Bukti Potong' doc_desc
               FROM DUAL;
        ELSIF bPpn AND NOT bPph THEN
            OPEN cList FOR
               SELECT 'FP' doc_code, 'Faktur Pajak' doc_desc
               FROM DUAL;
        ELSIF Not bPpn AND bPph THEN
            OPEN cList FOR
               SELECT 'BP' doc_code, 'Bukti Potong' doc_desc
               FROM DUAL;
        ELSE 
            OPEN cList FOR
               SELECT 'BP' doc_code, 'Bukti Potong' doc_desc
               FROM DUAL WHERE ROWNUM<1;
        END IF;

    END IF;

    pList := cList;
EXCEPTION WHEN NO_DATA_FOUND THEN
    IF pBagian = 'Tax' THEN
        OPEN cList FOR
            SELECT 'BP' doc_code, 'Bukti Potong' doc_desc FROM DUAL;
    ELSE
        OPEN cList FOR
            SELECT 'FP' doc_code, 'Faktur Pajak' doc_desc FROM DUAL WHERE ROWNUM < 1;
    END IF;
    pList := cList;
END upload_dok_list;

END DCV_PKG;
/
