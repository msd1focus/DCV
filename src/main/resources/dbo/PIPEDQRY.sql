CREATE OR REPLACE PACKAGE            "PIPEDQRY" AS 

TYPE po_typ IS RECORD (
    no_po VARCHAR2(100),
    po_id NUMBER,
    po_desc VARCHAR2(100),
    poline_id NUMBER,
    supplier_code VARCHAR2(50),
    site_code VARCHAR2(50),
    kode_prod VARCHAR2(50),
    nama_prod VARCHAR2(70),
    flag_budget VARCHAR2(10),
    qty NUMBER,
    uom VARCHAR2(15),
    unit_price NUMBER,
    total_price NUMBER,
    po_ppn NUMBER,
    pc_pengganti VARCHAR2(30),
    pc_ganti_ppid NUMBER,
    pc_tambahan VARCHAR2(300),
    pc_tambah_ppid NUMBER
    );

TYPE dcv_typ IS RECORD (
    no_dcv VARCHAR2(15),
    cust_code VARCHAR2(100),
    cust_name VARCHAR2(200),
    region VARCHAR2(50),
    area VARCHAR2(50),
    location VARCHAR2(50),
    no_pc VARCHAR2(100),
    appv_val NUMBER,
    no_kwitansi VARCHAR2(50),
    no_fp VARCHAR2(50),
    po_no VARCHAR2(50),
    gr_no VARCHAR2(50),
    task_id NUMBER,
    note VARCHAR2(500)
);

TYPE action_typ IS RECORD (
     task_Id NUMBER, 
     no_dcv VARCHAR2(30),
     role_code VARCHAR2(30), 
     node_id VARCHAR2(30),
     pilihan NUMBER, 
     description VARCHAR2(500)
);

TYPE stm_report IS RECORD (
    tanggal NUMBER,
    status VARCHAR2(50)
    );

TYPE dcv_complete_typ IS RECORD (
    dcvh_id NUMBER,
    no_dcv VARCHAR2(30),
    submit_time DATE,
    cust_code VARCHAR2(10),
    cust_name VARCHAR2(100),
    company VARCHAR2(10),
    no_pc  VARCHAR2(20),
    region VARCHAR2(30),
    area VARCHAR2(60),
    location VARCHAR2(100),
    periode_pc_start DATE,
    periode_pc_end DATE,
    pc_kategori VARCHAR2(50),
    pc_tipe VARCHAR2(50),
    dcvh_status VARCHAR2(30),
    dcvh_value NUMBER,
    appv_value NUMBER,
    ppn NUMBER,
    pph NUMBER,
    nofaktur VARCHAR2(100),
    nokwitansi VARCHAR2(100),
    no_po VARCHAR2(100),
    gr_no VARCHAR2(100),
    total_bayar NUMBER,
    sisa_bayar NUMBER,
    last_step VARCHAR2(100),
    current_step VARCHAR2(100),
    taskid NUMBER,
    nodecode VARCHAR2(10),
    bagian VARCHAR2(30),
    sla NUMBER
);

TYPE po_typ_tab IS TABLE OF po_typ ;
TYPE string_tab IS TABLE OF VARCHAR2(100);
TYPE stm_rep_tab IS TABLE OF stm_report;
TYPE date_tab IS TABLE OF DATE;
TYPE dcv_typ_tab IS TABLE OF dcv_typ;
TYPE action_typ_tab IS TABLE OF action_typ;
TYPE dcv_complete_tab IS TABLE OF dcv_complete_typ;

FUNCTION get_uom_stm (ppid NUMBER) RETURN string_tab PIPELINED;
FUNCTION stm_validation (pCustCode VARCHAR2) RETURN stm_rep_tab PIPELINED;
FUNCTION get_workday_between (dt1 DATE, dt2 DATE) RETURN date_tab PIPELINED;
FUNCTION get_batch_doc(pBagian VARCHAR2, pNodeCode VARCHAR2) RETURN dcv_typ_tab PIPELINED;
FUNCTION get_action_list (pDcvNo VARCHAR2, pRole IN VARCHAR2) RETURN action_typ_tab PIPELINED;
FUNCTION get_active_dcv (pUser VARCHAR, pwfType VARCHAR2) RETURN dcv_complete_tab PIPELINED;

END pipedqry;


/


CREATE OR REPLACE PACKAGE BODY            "PIPEDQRY" AS

FUNCTION hitung_pct_target (pAssign DATE, pTarget DATE) RETURN NUMBER
AS
    vTarget NUMBER;
    vElapse NUMBER;
    vSla NUMBER;
BEGIN
    vTarget := TRUNC(pTarget) - TRUNC(pAssign);
    IF vTarget = 0 THEN vTarget := 1; END IF;
    vElapse := TRUNC(SYSDATE) - TRUNC(pAssign);
    RETURN ROUND(vElapse / vTarget * 100);
END hitung_pct_target;

FUNCTION get_uom_stm (ppid NUMBER) RETURN string_tab PIPELINED
AS
    vUom1 VARCHAR2(10);
    vUom2 VARCHAR2(10);
    vUom3 VARCHAR2(10);
    cnt NUMBER := 0;
    vPp focuspp.promo_produk%ROWTYPE; 
    vPv focuspp.produk_variant%ROWTYPE;
BEGIN
    SELECT * INTO vPp FROM focuspp.promo_produk WHERE promo_produk_id = ppid;

    cnt := 0;
    FOR i in (
        SELECT uom_primary, uomctn, uomanalysis
        FROM fmv_mip
        WHERE prod_code IN (SELECT prod_item FROM focuspp.produk_item WHERE promo_produk_id = ppid) 
    ) LOOP
        IF i.uom_primary IS NOT NULL THEN PIPE ROW (i.uom_primary); END IF;
        IF i.uomctn IS NOT NULL THEN PIPE ROW (i.uomctn); END IF;
        IF i.uomanalysis IS NOT NULL THEN PIPE ROW (i.uomanalysis); END IF;
        cnt := cnt + 1;
    END LOOP;

    IF cnt = 0 THEN
        FOR i in (
            SELECT uom_primary, uomctn, uomanalysis
            FROM fmv_mip
            WHERE prod_category_desc = DECODE(vPp.product_category,'CT001','Food','Non Food') 
            AND prod_class_desc = DECODE(vPp.product_class_desc,'ALL',prod_class_desc, vPp.product_class_desc )
            AND prod_brand_desc = DECODE(vPp.product_brand_desc,'ALL',prod_brand_desc, vPp.product_brand_desc ) 
            AND prod_extention_desc = DECODE(vPp.product_ext_desc,'ALL',prod_extention_desc, vPp.product_ext_desc ) 
            AND prod_packaging_desc = DECODE(vPp.product_pack_desc,'ALL',prod_packaging_desc, vPp.product_pack_desc ) 
            AND prod_variant_desc IN (
                SELECT DECODE(variant_desc,'ALL',prod_variant_desc, variant_desc)  
                FROM focuspp.produk_variant WHERE promo_produk_id = ppid
            )
        ) LOOP
            IF i.uom_primary IS NOT NULL THEN PIPE ROW (i.uom_primary);
            END IF;
            IF i.uomctn IS NOT NULL THEN PIPE ROW (i.uomctn);
            END IF;
            IF i.uomanalysis IS NOT NULL THEN PIPE ROW (i.uomanalysis);
            END IF;
            cnt:= cnt + 1;
        END LOOP;

    END IF;

    IF cnt=0 THEN PIPE ROW ('-KOSONG-');
    END IF;
EXCEPTION WHEN NO_DATA_FOUND THEN NULL;
END get_uom_stm;

/*
FUNCTION get_po_list (ppId NUMBER, pVendorCode VARCHAR2) 
RETURN po_typ_tab PIPELINED 
AS
    cList SYS_REFCURSOR;
    vPo po_typ;
    vPpId NUMBER;
    vPoList po_typ_tab;
    vPpIdList pp_typ_tab;
    supplier VARCHAR2(30);
    supplierList string_tab := string_tab();
BEGIN

    vPpIdList := get_related_ppid (ppId);
    supplierList := get_vendors(pVendorCode);

    FOR i IN vPpIdList.FIRST..vPpIdList.LAST LOOP

        apps.fcs_dcv_generate_gr_pkg.get_po_list (vPpIdList(i).promo_produk_id, cList);

        LOOP
            FETCH cList INTO 
                vPo.po_id,
                vPo.no_po ,
                vPo.supplier_code ,
                vPo.site_code ,
                vPo.poline_id ,
                vPo.po_desc ,
                vPpId,
                vPo.kode_prod ,
                vPo.nama_prod,
                vPo.flag_budget ,
                vPo.unit_price ,
                vPo.qty,
                vPo.uom,
                vPo.total_price,
                vPo.po_ppn ;

            EXIT WHEN cList%NOTFOUND;

            IF vPpIdList(i).jns_pc = 'PENGGANTI' THEN 
                vPo.pc_pengganti := vPpIdList(i).no_pc;
                vPo.pc_ganti_ppid := vPpIdList(i).promo_produk_id;
            ELSIF vPpIdList(i).jns_pc = 'TAMBAHAN' THEN  
                vPo.pc_tambahan := vPpIdList(i).no_pc;
                vPo.pc_tambah_ppid := vPpIdList(i).promo_produk_id;
            END IF;

            IF vPo.supplier_code MEMBER OF supplierList THEN
                PIPE ROW (vpo);  
            END IF;
        END LOOP;

    END LOOP;

    RETURN;
END get_po_list;
*/

FUNCTION stm_validation (pCustCode VARCHAR2) 
RETURN stm_rep_tab PIPELINED
AS
    vStm VARCHAR2(100);
    vNum NUMBER;
    vRow stm_report;
BEGIN
    FOR i IN (
        SELECT *
        FROM stm
        WHERE TRIM(kode_weborder) = TRIM(pCustCode)
    ) LOOP
        vRow.tanggal := TO_NUMBER(TRIM(i.period)||'01');
        vRow.status := i.d1;
        IF UPPER(TRIM(i.d1)) LIKE 'KIRIM%' THEN PIPE ROW (vRow); END IF; 
        vRow.tanggal := TO_NUMBER(TRIM(i.period)||'02');
        vRow.status := i.d2;
        IF UPPER(TRIM(i.d2)) LIKE 'KIRIM%' THEN PIPE ROW (vRow); END IF; 
        vRow.tanggal := TO_NUMBER(TRIM(i.period)||'03');
        vRow.status := i.d3;
        IF UPPER(TRIM(i.d3)) LIKE 'KIRIM%' THEN PIPE ROW (vRow); END IF; 
        vRow.tanggal := TO_NUMBER(TRIM(i.period)||'04');
        vRow.status := i.d4;
        IF UPPER(TRIM(i.d4)) LIKE 'KIRIM%' THEN PIPE ROW (vRow); END IF; 
        vRow.tanggal := TO_NUMBER(TRIM(i.period)||'05');
        vRow.status := i.d5;
        IF UPPER(TRIM(i.d5)) LIKE 'KIRIM%' THEN PIPE ROW (vRow); END IF; 
        vRow.tanggal := TO_NUMBER(TRIM(i.period)||'06');
        vRow.status := i.d6;
        IF UPPER(TRIM(i.d6)) LIKE 'KIRIM%' THEN PIPE ROW (vRow); END IF; 
        vRow.tanggal := TO_NUMBER(TRIM(i.period)||'07');
        vRow.status := i.d7;
        IF UPPER(TRIM(i.d7)) LIKE 'KIRIM%' THEN PIPE ROW (vRow); END IF; 
        vRow.tanggal := TO_NUMBER(TRIM(i.period)||'08');
        vRow.status := i.d8;
        IF UPPER(TRIM(i.d8)) LIKE 'KIRIM%' THEN PIPE ROW (vRow); END IF; 
        vRow.tanggal := TO_NUMBER(TRIM(i.period)||'09');
        vRow.status := i.d9;
        IF UPPER(TRIM(i.d9)) LIKE 'KIRIM%' THEN PIPE ROW (vRow); END IF; 
        vRow.tanggal := TO_NUMBER(TRIM(i.period)||'10');
        vRow.status := i.d10;
        IF UPPER(TRIM(i.d10)) LIKE 'KIRIM%' THEN PIPE ROW (vRow); END IF; 
        vRow.tanggal := TO_NUMBER(TRIM(i.period)||'11');
        vRow.status := i.d11;
        IF UPPER(TRIM(i.d11)) LIKE 'KIRIM%' THEN PIPE ROW (vRow); END IF; 
        vRow.tanggal := TO_NUMBER(TRIM(i.period)||'12');
        vRow.status := i.d12;
        IF UPPER(TRIM(i.d12)) LIKE 'KIRIM%' THEN PIPE ROW (vRow); END IF; 
        vRow.tanggal := TO_NUMBER(TRIM(i.period)||'13');
        vRow.status := i.d13;
        IF UPPER(TRIM(i.d13)) LIKE 'KIRIM%' THEN PIPE ROW (vRow); END IF; 
        vRow.tanggal := TO_NUMBER(TRIM(i.period)||'14');
        vRow.status := i.d14;
        IF UPPER(TRIM(i.d14)) LIKE 'KIRIM%' THEN PIPE ROW (vRow); END IF; 
        vRow.tanggal := TO_NUMBER(TRIM(i.period)||'15');
        vRow.status := i.d15;
        IF UPPER(TRIM(i.d15)) LIKE 'KIRIM%' THEN PIPE ROW (vRow); END IF; 
        vRow.tanggal := TO_NUMBER(TRIM(i.period)||'16');
        vRow.status := i.d16;
        IF UPPER(TRIM(i.d16)) LIKE 'KIRIM%' THEN PIPE ROW (vRow); END IF; 
        vRow.tanggal := TO_NUMBER(TRIM(i.period)||'17');
        vRow.status := i.d17;
        IF UPPER(TRIM(i.d17)) LIKE 'KIRIM%' THEN PIPE ROW (vRow); END IF; 
        vRow.tanggal := TO_NUMBER(TRIM(i.period)||'18');
        vRow.status := i.d18;
        IF UPPER(TRIM(i.d18)) LIKE 'KIRIM%' THEN PIPE ROW (vRow); END IF; 
        vRow.tanggal := TO_NUMBER(TRIM(i.period)||'19');
        vRow.status := i.d19;
        IF UPPER(TRIM(i.d19)) LIKE 'KIRIM%' THEN PIPE ROW (vRow); END IF; 
        vRow.tanggal := TO_NUMBER(TRIM(i.period)||'20');
        vRow.status := i.d20;
        IF UPPER(TRIM(i.d20)) LIKE 'KIRIM%' THEN PIPE ROW (vRow); END IF; 
        vRow.tanggal := TO_NUMBER(TRIM(i.period)||'21');
        vRow.status := i.d21;
        IF UPPER(TRIM(i.d21)) LIKE 'KIRIM%' THEN PIPE ROW (vRow); END IF; 
        vRow.tanggal := TO_NUMBER(TRIM(i.period)||'22');
        vRow.status := i.d22;
        IF UPPER(TRIM(i.d22)) LIKE 'KIRIM%' THEN PIPE ROW (vRow); END IF; 
        vRow.tanggal := TO_NUMBER(TRIM(i.period)||'23');
        vRow.status := i.d23;
        IF UPPER(TRIM(i.d23)) LIKE 'KIRIM%' THEN PIPE ROW (vRow); END IF; 
        vRow.tanggal := TO_NUMBER(TRIM(i.period)||'24');
        vRow.status := i.d24;
        IF UPPER(TRIM(i.d24)) LIKE 'KIRIM%' THEN PIPE ROW (vRow); END IF; 
        vRow.tanggal := TO_NUMBER(TRIM(i.period)||'25');
        vRow.status := i.d25;
        IF UPPER(TRIM(i.d25)) LIKE 'KIRIM%' THEN PIPE ROW (vRow); END IF; 
        vRow.tanggal := TO_NUMBER(TRIM(i.period)||'26');
        vRow.status := i.d26;
        IF UPPER(TRIM(i.d26)) LIKE 'KIRIM%' THEN PIPE ROW (vRow); END IF; 
        vRow.tanggal := TO_NUMBER(TRIM(i.period)||'27');
        vRow.status := i.d27;
        IF UPPER(TRIM(i.d27)) LIKE 'KIRIM%' THEN PIPE ROW (vRow); END IF; 
        vRow.tanggal := TO_NUMBER(TRIM(i.period)||'28');
        vRow.status := i.d28;
        IF UPPER(TRIM(i.d28)) LIKE 'KIRIM%' THEN PIPE ROW (vRow); END IF; 
        vRow.tanggal := TO_NUMBER(TRIM(i.period)||'29');
        vRow.status := i.d29;
        IF UPPER(TRIM(i.d29)) LIKE 'KIRIM%' THEN PIPE ROW (vRow); END IF; 
        vRow.tanggal := TO_NUMBER(TRIM(i.period)||'30');
        vRow.status := i.d30;
        IF UPPER(TRIM(i.d30)) LIKE 'KIRIM%' THEN PIPE ROW (vRow); END IF; 
        vRow.tanggal := TO_NUMBER(TRIM(i.period)||'31');
        vRow.status := i.d31;
        IF UPPER(TRIM(i.d31)) LIKE 'KIRIM%' THEN PIPE ROW (vRow); END IF; 
    END LOOP;
    RETURN;
END stm_validation;

FUNCTION get_workday_between (dt1 DATE, dt2 DATE) 
RETURN date_tab PIPELINED
AS
    j1Dt NUMBER;
    j2Dt NUMBER;
    vRow stm_report;
    holidayList date_tab;
BEGIN
    holidayList := date_tab();
    FOR i IN (SELECT TRUNC(tgl_libur) tgl FROM holiday 
                WHERE TRUNC(tgl_libur) BETWEEN TRUNC(dt1) AND TRUNC(dt2))
    LOOP
        holidayList.EXTEND;
        holidayList(holidayList.LAST) := i.tgl;
    END LOOP;
    j1Dt := TO_CHAR(dt1,'J');
    j2Dt := TO_CHAR(dt2,'J');
dbms_output.put_line('get_workday_between ' || dt1);
    FOR i IN j1Dt .. j2Dt LOOP
        IF TO_CHAR(TO_DATE(i,'J'),'DY') IN ('SAT','SUN') THEN NULL;
        ELSIF TO_DATE(i,'J') MEMBER OF holidayList THEN NULL;
        ELSE PIPE ROW (TO_DATE(i,'J'));
        END IF;
    END LOOP;
    RETURN;

END get_workday_between;

FUNCTION get_action_list (pDcvNo VARCHAR2, pRole IN VARCHAR2)
RETURN action_typ_tab PIPELINED
AS
  vBagian VARCHAR2(20);
  vAct action_typ;
  vjml NUMBER;
  vTask wf_task%ROWTYPE;
  bTC2exist BOOLEAN := false;
  bTC4exist BOOLEAN := false;
  bTC5exist BOOLEAN := false;
  firstChoice VARCHAR2(5);
  CURSOR c_opt(pRole varchar2, pNode VARCHAR2) IS 
                    SELECT r.node_id, r.pilihan, r.description 
                    FROM wf_route r
                    JOIN dcv_privs p ON p.ref_id2 = r.id AND p.priv_type = 'WF_ROUTE'
                    JOIN role_privs pr ON pr.priv_code = p.priv_code
                    WHERE pr.role_code = pRole
                    AND r.node_id = pNode;

BEGIN
    SELECT bagian INTO vBagian FROM dcv_role WHERE role_code = pRole;

    BEGIN
        SELECT * INTO vTask FROM wf_task 
                WHERE no_dcv = pDcvNo 
                AND progress_status = 'WAIT'
                AND bagian = vBagian;

        vAct.task_Id := vTask.id;
        vAct.no_dcv := pDcvNo;
        vAct.role_code := pRole;
--        FOR j IN (SELECT node_id, pilihan, description FROM wf_route WHERE node_id = vTask.nodecode) 
        FOR j IN c_opt(pRole, vTask.nodecode) 
        LOOP
            vAct.node_id := j.node_id;
            vAct.pilihan := j.pilihan;
            vAct.description := j.description;
            PIPE ROW (vAct);
        END LOOP;

    EXCEPTION WHEN TOO_MANY_ROWS THEN

        FOR x IN (SELECT * FROM wf_task WHERE no_dcv = pDcvNo AND progress_status = 'WAIT')
        LOOP
            IF x.nodecode = 'TC2' THEN bTC2exist := TRUE;
            ELSIF x.nodecode = 'TC4' THEN bTC4exist := TRUE;
            ELSIF x.nodecode = 'TC5' THEN bTC5exist := TRUE;
            END IF;
        END LOOP;

        IF bTC2exist THEN firstChoice := 'TC2';
        ELSIF bTC4exist THEN firstChoice := 'TC4';
        ELSE firstChoice := 'TC45';
        END IF;
dbms_output.put_line(firstchoice);
        SELECT * INTO vTask FROM wf_task 
        WHERE no_dcv = pDcvNo
        AND progress_status = 'WAIT'
        AND nodecode = firstChoice;

        vAct.task_Id := vTask.id;
        vAct.no_dcv := pDcvNo;
        vAct.role_code := pRole;
--        FOR j IN (SELECT node_id, pilihan, description FROM wf_route WHERE node_id = vTask.nodecode) 
        FOR j IN c_opt(pRole, vTask.nodecode) 
        LOOP
            vAct.node_id := j.node_id;
            vAct.pilihan := j.pilihan;
            vAct.description := j.description;

            PIPE ROW (vAct);
        END LOOP;

    END;
    RETURN;
END get_action_list;

FUNCTION get_active_dcv (pUser VARCHAR, pwfType VARCHAR2)
RETURN dcv_complete_tab PIPELINED
AS
    cList SYS_REFCURSOR;
    vBagian VARCHAR2(30);

    CURSOR c1 IS
        SELECT dcv.dcvh_id, dcv.dcvh_no_dcv as no_dcv, 
            dcv.dcvh_submit_time, dcv.dcvh_company, 
            dcv.dcvh_periode_pc_start, dcv.dcvh_periode_pc_end,
            dcv.dcvh_pc_kategori, dcv.dcvh_pc_tipe,
            dcv.dcvh_cust_code as cust_code, dcv.dcvh_cust_name as cust_name, 
            dcv.dcvh_region as region, dcv.dcvh_area as area, dcv.dcvh_location as location,
            dcv.dcvh_no_pc as no_pc, dcv.dcvh_status,
            dcv.dcvh_value, dcv.dcvh_appv_value as appv_val, 
            dcv.dcvh_last_step, dcv.dcvh_current_step,
            kw.doc_no as no_kwitansi, fp.doc_no as no_fp, gr.doc_no as gr_no, 
            t.id as task_id, t.note as note, t.bagian as bagian, t.nodecode,
            t.tahapan, t.target_selesai, t.return_task
        FROM dcv_request dcv
        LEFT OUTER JOIN wf_task t ON t.no_dcv = dcv.dcvh_no_dcv 
                                    AND t.progress_status = 'WAIT'
                                    AND t.bagian = DECODE(vBagian,'Admin',t.bagian,vBagian)
        LEFT OUTER JOIN dcv_documents kw ON kw.dcvh_id = dcv.dcvh_id AND kw.doc_type = 'KW'
        LEFT OUTER JOIN dcv_documents fp ON fp.dcvh_id = dcv.dcvh_id AND fp.doc_type = 'FP'
        LEFT OUTER JOIN dokumen_realisasi gr ON gr.dcvh_id = dcv.dcvh_id AND gr.tahapan_realisasi = 'GR'
        WHERE CASE WHEN vBagian = 'Distributor' THEN dcv.dcvh_cust_code
                   ELSE pUser
              END = pUser;

    vDcv dcv_complete_typ;
    kosong dcv_complete_typ;
    vNilaiDcv NUMBER;
    vX VARCHAR2(1);
    bPipe BOOLEAN := TRUE;
BEGIN

    SELECT user_type INTO vBagian FROM user_access WHERE user_name = pUser;
    FOR i IN c1 LOOP
        bPipe := TRUE;
        vDcv := kosong;

        IF pWfType = 'Return Task' AND NVL(i.return_task,'N') = 'N' THEN bPipe := FALSE;
        END IF;

        vDcv.dcvh_id := i.dcvh_id;
        vDcv.no_dcv := i.no_dcv;
        vDcv.submit_time := i.dcvh_submit_time;
        vDcv.cust_code := i.cust_code;
        vDcv.cust_name := i.cust_name;
        vDcv.company := i.dcvh_company;
        vDcv.no_pc := i.no_pc;
        vDcv.region := i.region;
        vDcv.area := i.area;
        vDcv.location := i.location;
        vDcv.periode_pc_start := i.dcvh_periode_pc_start;
        vDcv.periode_pc_end := i.dcvh_periode_pc_end;
        vDcv.pc_kategori := i.dcvh_pc_kategori;
        vDcv.pc_tipe := i.dcvh_pc_tipe;
        vDcv.dcvh_value := i.dcvh_value;
        vDcv.appv_value := i.appv_val;
        vDcv.nofaktur := i.no_fp;
        vDcv.nokwitansi := i.no_kwitansi;
        vDcv.gr_no := i.gr_no;
--        vDcv.no_po VARCHAR2(100),
        vDcv.taskid := i.task_id;
        vDcv.last_step := i.dcvh_last_step;
        IF i.task_id IS NULL THEN
            vDcv.current_step := i.dcvh_current_step;
        ELSE
            vDcv.current_step := i.tahapan;
            vDcv.nodecode := i.nodecode;
            vDcv.sla := hitung_pct_target(i.dcvh_submit_time, i.target_selesai);
            vDcv.bagian := i.bagian;
        END IF;
        vDcv.dcvh_status := i.dcvh_status;
        IF i.dcvh_status IN ('PAYABLE','PAID') THEN
            ebs_pkg.payment_summary(i.no_dcv, cList);
            LOOP
                FETCH cList INTO vNilaiDcv, vDcv.total_bayar, vDcv.sisa_bayar;
                EXIT WHEN cList%NOTFOUND;
            END LOOP;
        END IF;

        IF i.nodecode = 'TC4' THEN
            BEGIN
                SELECT 'x' INTO vX from wf_task t2
                where t2.no_dcv = i.no_dcv
                and t2.progress_status = 'WAIT'
                and t2.id <> i.task_id
                and t2.nodecode = 'TC2';
                bPipe := FALSE;
            EXCEPTION WHEN NO_DATA_FOUND THEN NULL;
            END;
        ELSIF i.nodecode = 'TC5' THEN
            BEGIN
                SELECT 'x' INTO vX from wf_task t2
                where t2.no_dcv = i.no_dcv
                and t2.progress_status = 'WAIT'
                and t2.id <> i.task_id
                and t2.nodecode IN ('TC2','TC4');
                bPipe := FALSE;
            EXCEPTION WHEN NO_DATA_FOUND THEN NULL;
            END;
        END IF;

        IF bPipe THEN PIPE ROW(vDcv);
        END IF;

    END LOOP;
    RETURN;
EXCEPTION WHEN NO_DATA_FOUND THEN
    RETURN;
END get_active_dcv;


FUNCTION get_batch_doc (pBagian VARCHAR2, pNodeCode VARCHAR2)
RETURN dcv_typ_tab PIPELINED
AS
    CURSOR c1 IS
        SELECT dcv.dcvh_id, dcv.dcvh_no_dcv as no_dcv, 
        dcv.dcvh_cust_code as cust_code, dcv.dcvh_cust_name as cust_name, 
        dcv.dcvh_region as region, dcv.dcvh_area as area, dcv.dcvh_location as location,
        dcv.dcvh_no_pc as no_pc, dcv.dcvh_appv_value as appv_val, 
        kw.doc_no as no_kwitansi, fp.doc_no as no_fp, gr.doc_no as gr_no, 
        t.id as task_id, t.note as note, t.bagian as bagian
        FROM dcv_request dcv
        INNER JOIN wf_task t ON t.no_dcv = dcv.dcvh_no_dcv AND t.progress_status = 'WAIT'
        INNER JOIN wf_route wr ON wr.node_id = t.nodecode AND NVL(wr.document_task,'N') = 'Y'
        LEFT OUTER JOIN dcv_documents kw ON kw.dcvh_id = dcv.dcvh_id AND kw.doc_type = 'KW'
        LEFT OUTER JOIN dcv_documents fp ON fp.dcvh_id = dcv.dcvh_id AND fp.doc_type = 'FP'
        LEFT OUTER JOIN dokumen_realisasi gr ON gr.dcvh_id = dcv.dcvh_id AND gr.tahapan_realisasi = 'GR';

    vDcv dcv_typ;

BEGIN

    FOR i IN c1 LOOP
        IF i.bagian = 'TC3' THEN null;
        ELSE
            CONTINUE;
        END IF;

        IF pBagian = 'Admin' THEN NULL;
        ELSIF pBagian = i.bagian THEN NULL;
        ELSE CONTINUE;
        END IF;

        vDcv.no_dcv := i.no_dcv;
        vDcv.cust_code := i.cust_code;
        vDcv.cust_name := i.cust_name;
        vDcv.region := i.region;
        vDcv.area := i.area;
        vDcv.location := i.location;
        vDcv.no_pc := i.no_pc;
        vDcv.appv_val := i.appv_val;
        vDcv.no_kwitansi := i.no_kwitansi;
        vDcv.no_fp := i.no_fp;
        vDcv.gr_no := i.gr_no;
        vDcv.task_id := i.task_id;
        vDcv.note := i.note;

        SELECT LISTAGG(tc.no_po, ', ') WITHIN GROUP (ORDER BY tc.no_po) 
        INTO vDcv.po_no
        FROM tc_approval tc
        WHERE dcvl_id IN (SELECT dcvl_id FROM request_dtl WHERE dcvh_id = i.dcvh_id);

        PIPE ROW(vDcv);
    END LOOP;
END get_batch_doc;

END pipedqry;
/
