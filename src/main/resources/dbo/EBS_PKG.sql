CREATE OR REPLACE PACKAGE            "EBS_PKG" AS 

TYPE po_typ IS RECORD (
    no_po VARCHAR2(50),
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

TYPE pymt_typ IS RECORD (
    no_gr   VARCHAR2(50),
    dcv_no  VARCHAR2(50),
    jenis_trx VARCHAR2(50),
    doc_number VARCHAR2(50),
    tgl_mulai DATE,
    tgl_bayar DATE,
    nilai_bayar NUMBER,
    sisa_bayar NUMBER,
    username VARCHAR2(50)
);

TYPE po_typ_tab IS TABLE OF po_typ ;
TYPE pymt_typ_tab IS TABLE OF pymt_typ;

    TYPE pp_typ IS RECORD (
        no_pc VARCHAR2(50),
        promo_produk_id NUMBER,
        jns_pc VARCHAR2(15)   -- pc pengganti atau tambahan
        );

    TYPE pp_typ_tab IS TABLE OF pp_typ;

PROCEDURE generate_gr (dcvNo VARCHAR2, grNo OUT VARCHAR2, grStatus OUT VARCHAR2 );

FUNCTION get_payment_hist (pDcvNo VARCHAR2) RETURN pymt_typ_tab PIPELINED ;

PROCEDURE dokpembayaran_list (pDcvNo IN VARCHAR2, pList OUT SYS_REFCURSOR);
FUNCTION get_po_list (ppId NUMBER, pCustCode VARCHAR2) RETURN po_typ_tab PIPELINED ;
PROCEDURE po_list (pNoDcv VARCHAR2, ppId IN NUMBER, pList OUT SYS_REFCURSOR);
FUNCTION get_related_ppid (ppid NUMBER) RETURN pp_typ_tab;

PROCEDURE payment_summary (pDcvNo IN VARCHAR2, pList OUT SYS_REFCURSOR);
--PROCEDURE payment_hist (pDcvNo IN VARCHAR2, pList OUT SYS_REFCURSOR) ;
PROCEDURE payment_ebs_hist (pDcvNo IN VARCHAR2, pList OUT SYS_REFCURSOR) ;

FUNCTION validate_po (poId NUMBER, poLineId NUMBER, nilai NUMBER) RETURN VARCHAR2;

END EBS_PKG;
/


CREATE OR REPLACE PACKAGE BODY "EBS_PKG" AS
    vDcv dcv_request%ROWTYPE;
    vTcAppr tc_approval%ROWTYPE;
    vcontextId NUMBER;
    TYPE string_tab IS TABLE OF VARCHAR2(25);
    too_many_pganti   EXCEPTION;

-- gabungan pc pengganti atau tambahan
FUNCTION get_related_ppid (ppid NUMBER) RETURN pp_typ_tab
AS
    dcvdtl request_dtl%ROWTYPE;
    noDcv dcv_request.dcvh_no_dcv%TYPE;
    noPc dcv_request.dcvh_no_pc%TYPE;
    propNo dcv_request.dcvh_no_pp%TYPE;
    add_pcno VARCHAR2(50);
    add_propid NUMBER;
--    add_ppId NUMBER;
    ppidList pp_typ_tab := pp_typ_tab();
BEGIN
    SELECT DECODE(p.addendum_ke, null,p.confirm_no, confirm_no||'-'||p.addendum_ke), p.proposal_no
    INTO noPc, propNo
    FROM focuspp.promo_produk pp
    JOIN focuspp.proposal p ON p.proposal_id = pp.proposal_id
    WHERE pp.promo_produk_id = ppid;

    --cari pc pengganti
    BEGIN
        SELECT p.confirm_no, p.proposal_id 
        INTO add_pcno, add_propid
        FROM focuspp.proposal p
        WHERE p.copy_type = 'PENGGANTI'
        AND p.proposal_reference = propNo;
        
        FOR cPgt IN (
                SELECT pp.promo_produk_id 
                FROM focuspp.promo_produk pp
                WHERE pp.proposal_id = add_propid) 
        LOOP
            ppidList.EXTEND;
            ppidList(ppIdList.LAST).no_pc := add_pcno;
            ppidList(ppIdList.LAST).promo_produk_id := cPgt.promo_produk_id;
            ppidList(ppIdList.LAST).jns_pc := 'PENGGANTI';
        END LOOP;
        
    EXCEPTION 
    WHEN NO_DATA_FOUND THEN 
        ppidList.EXTEND;
        ppidList(ppIdList.LAST).no_pc := noPc;
        ppidList(ppIdList.LAST).promo_produk_id := ppid;
        ppidList(ppIdList.LAST).jns_pc := 'ORIGINAL';
    WHEN TOO_MANY_ROWS THEN RAISE too_many_pganti;
    END;

    --cari pc tambahan
    IF ppidList(ppidList.LAST).promo_produk_id = ppid THEN
        FOR cTmb IN (
                SELECT pp.promo_produk_id 
                FROM focuspp.promo_produk pp
                JOIN focuspp.proposal p ON p.proposal_id = pp.proposal_id
                WHERE p.copy_type = 'TAMBAHAN'
                AND p.proposal_reference = propNo) LOOP
            ppidList.EXTEND;
            ppidList(ppIdList.LAST).promo_produk_id  := cTmb.promo_produk_id;
            ppidList(ppIdList.LAST).jns_pc := 'TAMBAHAN';
        END LOOP;
    END IF;

    RETURN ppidList;
END get_related_ppid;

FUNCTION get_vendors (pCustCode VARCHAR2) 
RETURN string_tab
AS
    cList SYS_REFCURSOR;
    v VARCHAR2(20);
    suppList string_tab := string_tab();
BEGIN
    fcs_dcv_generate_gr_pkg.get_vendor_code(pCustCode, cList);
    LOOP
        FETCH cList INTO v;
        EXIT WHEN cList%NOTFOUND;
        suppList.EXTEND;
        suppList(suppList.LAST) := v;
    END LOOP;
    RETURN suppList;
END;

FUNCTION validate_po (poId NUMBER, poLineId NUMBER, nilai NUMBER) 
RETURN VARCHAR2
AS
    vStatus VARCHAR2(50);
    vQty NUMBER;
    vAmount NUMBER;
    vList SYS_REFCURSOR;
    vPo po_typ;
    vAuthStatus VARCHAR2(100);
    hCancel VARCHAR2(100);
    lCancel VARCHAR2(100);
    closedCode VARCHAR2(100);
    ppId NUMBER;
    passed BOOLEAN := TRUE;
    bKurang BOOLEAN := FALSE;
    vCount NUMBER;
BEGIN
    -- SELECT KE EBS
    fcs_dcv_generate_gr_pkg.get_po(poId, poLineId, vList);
    vCount := 0;
    LOOP
        FETCH vList INTO 
                     vpo.po_id
                    ,vpo.no_po
                    ,vpo.supplier_code
                    ,vpo.site_code 
                    ,vpo.poline_id
                    ,vAuthStatus
                    ,hCancel
                    ,lCancel
                    ,closedCode
                    ,vpo.po_desc
                    ,ppId
--                    ,vpo.kode_prod 
--                    ,vpo.nama_prod 
                    ,vpo.unit_price 
                    ,vpo.qty
                    ,vpo.uom
                    ,vpo.total_price 
                    ,vpo.po_ppn;
        EXIT WHEN vList%NOTFOUND;
        dbms_output.put_line('Nilai PO '||vpo.total_price);
        vCount := vCount + 1;
        IF vpo.total_price < nilai THEN 
            passed := FALSE; 
            bKurang := TRUE;
        ELSIF vAuthStatus <> 'APPROVED' THEN passed := FALSE; 
        ELSIF hCancel <> 'N' THEN passed := FALSE; 
        ELSIF lCancel <> 'N' THEN passed := FALSE; 
        ELSIF closedCode <> 'OPEN' THEN passed := FALSE; 
        END IF;

    END LOOP;
    UPDATE tc_approval SET line_pr = vpo.unit_price 
    WHERE po_id = vpo.po_id AND poline_id = vpo.poline_id;

    IF vCount=0 THEN RETURN ('PO_NOTFOUND'); 
    ELSIF bKurang THEN RETURN ('PO_KURANG');
    ELSIF NOT passed THEN RETURN ('NOTOK');
    ELSE RETURN ('OK');
    END IF;
END validate_po;

PROCEDURE generate_gr (dcvNo VARCHAR2, grNo OUT VARCHAR2, grStatus OUT VARCHAR2 ) 
AS
    CURSOR cta (dcvId NUMBER) IS 
            SELECT ta.po_id, ta.no_po, ta.poline_id, ta.line_pr,
                        dt.dcvl_promo_product_id pp_id, SUM(ta.qty) QTY, SUM(ta.nilai_total) TOTALNILAI
            FROM tc_approval ta
            JOIN request_dtl dt ON ta.dcvl_id = dt.dcvl_id
            AND dt.dcvh_id = dcvId
            GROUP BY ta.po_id, ta.no_po, ta.poline_id, ta.line_pr, dt.dcvl_promo_product_id;
    vta cta%ROWTYPE;
    vNo NUMBER;
    vGrNo VARCHAR2(100);
    vGrDt DATE;
    lanjut BOOLEAN := TRUE;
    vhasil VARCHAR2(10) := 'OK';
    vTask wf_task%ROWTYPE;
    vNoPo VARCHAR2(50);
    vQtyTotal NUMBER;
    validate_fail   EXCEPTION;
    po_kurang       EXCEPTION;
    po_notfound    EXCEPTION;
    getGrNo_fail    EXCEPTION;
    genGr_fail    EXCEPTION;
BEGIN
    dbms_output.put_line('Start SP ');
    SELECT * into vDcv FROM dcv_request WHERE dcvh_no_dcv = dcvNo;

    -- cek dulu status workflow sudh boleh bikin gr ?
    BEGIN
        SELECT * INTO vTask FROM wf_task 
        WHERE nodecode = 'PR3'
        AND no_dcv = vDcv.dcvh_no_dcv
        AND progress_status = 'WAIT';
    EXCEPTION WHEN NO_DATA_FOUND THEN raise genGr_fail;
    END ;

-- a. validasi dulu semua po
    FOR i IN cta (vDcv.dcvh_id) LOOP
        vhasil := validate_po (i.po_id, i.poline_id, i.totalnilai);
        vNoPo := i.no_po;
        IF vhasil = 'PO_KURANG' THEN
            RAISE po_kurang;
        ELSIF vhasil = 'PO_NOTFOUND' THEN
            RAISE po_notfound;
        ELSIF vhasil = 'NOTOK' THEN 
            RAISE validate_fail;
        END IF;
    END LOOP;

--b. get nomor GR dengan call function di EBS
    dbms_output.put_line('Akan call generate GR');
    vGrDt := SYSDATE;
    vGrNo := fcs_dcv_generate_gr_pkg.generate_receipt_number(vNoPo, vGrDt);
    dbms_output.put_line('disini 5040223d ' || vNoPo||'-'||vGrNo);

    IF (vGrNO IS NULL) OR (vGrNO = 'Error') THEN RAISE getGrNo_fail;
    END IF;

    dbms_output.put_line('dapat no gr: '|| vGrNo);

    INSERT INTO dokumen_realisasi (id, dcvh_id, tahapan_realisasi, doc_no, doc_dt, descr, create_dt)
    VALUES (dcv_seq.nextval, vDcv.dcvh_id, 'GR', vGrNo, SYSDATE, 'Create GR', sysdate);

--c. insert ke table staging
    FOR i IN cta (vDcv.dcvh_id) LOOP 
        -- ini untuk kasus jika unit price diubah jadi 1
        IF i.line_pr = 1 THEN vQtyTotal := i.totalnilai;
        ELSE vQtyTotal := i.qty;
        END IF;
        INSERT INTO fcs_rcv_dcv_stg (
                DCV_ID
                ,DCV_NO
                ,PC_NO
                ,RECEIPT_NUM
                ,RECEIPT_CREATION_DATE
                ,PO_HEADER_ID
                ,PO_LINE_ID
                ,PROMO_PRODUK_ID
                ,QTY
                ,TOTAL)
        VALUES (vDcv.dcvh_id, vDcv.dcvh_no_dcv, vDcv.dcvh_no_pc, vGrNo, vGrDt,
             i.po_id, i.poline_id, i.pp_id, 
            vqtytotal, i.totalnilai);
    END LOOP;
    dbms_output.put_line('sudah insert table staging');

--d. call init_concurrent
    fcs_dcv_generate_gr_pkg.call_concurrent(vDcv.dcvh_id);
    dbms_output.put_line('sudah call concurrent');

    grNo := vGrNo;

EXCEPTION 
WHEN po_notfound THEN 
    rollback;
    grNo := '';
    grStatus := 'Gagal untuk Generate GR, PO tidak ditemukan.';
WHEN po_kurang THEN 
    rollback;
    grNo := '';
    grStatus := 'Gagal untuk Generate GR, nilai PO kurang.';
WHEN validate_fail THEN 
    rollback;
    grNo := '';
    grStatus := 'Gagal untuk validasi PO';
WHEN getGrNo_fail THEN 
    rollback;
    grNo := '';
    grStatus := 'Gagal dapat no GR dari Oracle';
WHEN genGr_fail THEN
    rollback;
    grNo := '';
    grStatus := 'Tidak bisa generate GR';
WHEN others THEN 
    rollback;
    grNo := '';
    grStatus := 'Gagal untuk Generate GR di Oracle, Unexpected error.';
END generate_gr;

FUNCTION get_payment_hist (pDcvNo VARCHAR2) 
RETURN pymt_typ_tab PIPELINED 
AS
    cList SYS_REFCURSOR;
    vPymt pymt_typ;
    vTglMulai DATE;
BEGIN
    SELECT MAX(assign_time) INTO vTglMulai
    FROM wf_task 
    WHERE no_dcv = pDcvNo AND nodecode = 'AP1';
    vTglMulai := TRUNC(vTglMulai);   -- karena di EBS ngembaliin cuma tgl doank

    fcs_dcv_generate_gr_pkg.get_payment_dtl(pDcvNo, clist);
    LOOP
        FETCH cList INTO 
                vPymt.no_gr,
                vPymt.dcv_no ,
                vPymt.jenis_trx ,
                vPymt.doc_number,
                vPymt.tgl_bayar ,
                vPymt.nilai_bayar , 
                vPymt.username,
                vPymt.sisa_bayar;
        EXIT WHEN cList%NOTFOUND;

        vPymt.tgl_mulai := vTglMulai;
        PIPE ROW (vPymt);  
        vTglMulai := vPymt.tgl_bayar;
    END LOOP;
END get_payment_hist;

PROCEDURE dokpembayaran_list (pDcvNo IN VARCHAR2, pList OUT SYS_REFCURSOR) AS
        c_list SYS_REFCURSOR;
        vDcv dcv_request%ROWTYPE;
BEGIN
    OPEN c_list FOR
    WITH 
    QINV AS (
        SELECT ROWNUM no, doc_number no_invoice
        FROM TABLE(ebs_pkg.get_payment_hist(pDcvNo))
        WHERE jenis_trx = 'INVOICE'
    ),
    QPYM AS (
        SELECT ROWNUM no, doc_number no_payment
        FROM TABLE(ebs_pkg.get_payment_hist(pDcvNo))
        WHERE jenis_trx = 'PAYMENT'
    ),
    QPO AS (
        SELECT rownum no, ta.no_po
        FROM tc_approval ta 
        JOIN request_dtl dtl ON ta.dcvl_id = dtl.dcvl_id
        JOIN dcv_request dcv ON dtl.dcvh_id = dcv.dcvh_id
        WHERE dcv.dcvh_no_dcv = pDcvNo
    ),
    QGR AS (
        SELECT rownum no, doc_no no_gr
        FROM dokumen_realisasi gr 
        JOIN dcv_request dcv ON gr.dcvh_id = dcv.dcvh_id AND tahapan_realisasi = 'GR'
        WHERE dcv.dcvh_no_dcv = pDcvNo
    )
    SELECT NVL(qpo.NO_PO,'....................................') || ' - ' || NVL(no_gr,'....................................' )
            || ' - ' || NVL(no_invoice,'....................................') || ' - ' || no_payment dokbayar
    FROM QPO
    FULL JOIN QGR ON QGR.NO = QPO.NO
    FULL JOIN QINV ON QINV.NO = QPO.NO
    FULL JOIN QPYM ON QPYM.NO = QINV.NO;

    pList := c_list;
EXCEPTION WHEN NO_DATA_FOUND THEN 
    pList := null;
END dokpembayaran_list;

FUNCTION get_po_list (ppId NUMBER, pCustCode VARCHAR2) 
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
    dbms_output.put_line('Jumlah : ');
    supplierList := get_vendors(pCustCode);

    FOR i IN vPpIdList.FIRST..vPpIdList.LAST LOOP

        fcs_dcv_generate_gr_pkg.get_po_list (vPpIdList(i).promo_produk_id, cList);

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

EXCEPTION WHEN too_many_pganti THEN
    vPo.po_id := 0;
    vPo.no_po := 'ERROR';
    vPo.nama_prod := 'Error: ada banyak PC Pengganti. Mesti diperbaiki.';
    PIPE ROW (vpo);  
END get_po_list;

PROCEDURE po_list (pNoDcv VARCHAR2, ppId IN NUMBER, pList OUT SYS_REFCURSOR) 
AS
    c_list SYS_REFCURSOR;
    dcvId NUMBER;
    propId NUMBER;
    cDtl request_dtl%ROWTYPE;
    vPcTambahan NUMBER;
    vDcv dcv_request%ROWTYPE;
    vCustCode VARCHAR2(25);
BEGIN
    SELECT * INTO vDcv FROM dcv_request WHERE dcvh_no_dcv = pNoDcv;
    OPEN c_list FOR SELECT
               no_po,
               po_id,
               po_desc,
               poline_id,
               supplier_code,
               site_code, 
               0 no_pr,
               0 line_pr,
               pc_tambahan,
               pc_tambah_ppid  pc_tambahan_pp_id,
               pc_pengganti,
               pc_ganti_ppid pc_pganti_pp_id,
               kode_prod,
               nama_prod, 
               flag_budget,
               qty,
               uom,
               unit_price,
               total_price,
                po_ppn
        FROM   TABLE(ebs_pkg.get_po_list(ppId, vDcv.dcvh_cust_code));
        pList := c_list;
EXCEPTION WHEN NO_DATA_FOUND THEN 
    OPEN c_list FOR SELECT
               no_po,
               po_id,
               po_desc,
               poline_id,
               supplier_code,
               site_code, 
               0 no_pr,
               0 line_pr,
               pc_tambahan,
               pc_tambah_ppid  pc_tambahan_pp_id,
               pc_pengganti,
               pc_ganti_ppid pc_pganti_pp_id,
               kode_prod,
               nama_prod, 
               flag_budget,
               qty,
               uom,
               unit_price,
               total_price,
                po_ppn
        FROM   TABLE(ebs_pkg.get_po_list(0, 'x'));
    pList := c_list;
END po_list;

PROCEDURE payment_summary (pDcvNo IN VARCHAR2, pList OUT SYS_REFCURSOR) AS
    c_list SYS_REFCURSOR;
    vTotalDcv NUMBER;
    vNilai NUMBER;
    vSisa NUMBER;
    vTotPph NUMBER;
BEGIN
    SELECT * INTO vDcv FROM dcv_request WHERE dcvh_no_dcv = pDcvNo;
--    SELECT SUM(nilai_bayar) INTO vTotalDcv
--    FROM TABLE(ebs_pkg.get_payment_hist(pDcvNo))
--    WHERE jenis_trx = 'INVOICE';

    SELECT NVL(SUM(dcvl_pph_val),0) INTO vTotPph
    FROM request_dtl
    WHERE dcvh_id = vDcv.dcvh_id;

    vNilai := 0;
    FOR i IN (
        SELECT nilai_bayar, sisa_bayar 
        FROM TABLE(ebs_pkg.get_payment_hist(pDcvNo))
        WHERE jenis_trx = 'PAYMENT')
    LOOP
        vNilai := vNilai + i.nilai_bayar;
        vSisa := NVL(i.sisa_bayar,0);
    END LOOP;

    IF NVL(vNilai,0) = 0 THEN
        vSisa := NVL(vDcv.dcvh_appv_value-vTotPph,0);
    END IF;
    dbms_output.put_line('Disini');
    OPEN c_list FOR
       SELECT   NVL(vDcv.dcvh_appv_value-vTotPph,0) total_dcv,
                NVL(vNilai,0) total_payment, 
                NVL(vSisa,0) nilai_sisa
       FROM dual ;
    pList := c_list;

EXCEPTION WHEN NO_DATA_FOUND THEN 
        dbms_output.put_line('disana' || pDcvNo);
    OPEN c_list FOR
           SELECT   100000 total_dcv,
                    60000 total_payment, 
                    40000 nilai_sisa
           FROM dual WHERE ROWNUM<1;    
           pList := c_list;
END payment_summary;

PROCEDURE payment_ebs_hist (pDcvNo IN VARCHAR2, pList OUT SYS_REFCURSOR) AS
    c_list SYS_REFCURSOR;
    vSla NUMBER;
BEGIN
    BEGIN
        SELECT * INTO vDcv FROM dcv_request WHERE dcvh_no_dcv = pDcvNo;
        SELECT NVL(sla1,1) INTO vSla FROM wf_node WHERE nodecode = 'AP1';
    EXCEPTION WHEN NO_DATA_FOUND THEN vSla := 1;
    END;

    OPEN c_list FOR
    SELECT 
        ROWNUM no,        
        jenis_trx step,
        username,
        vSla sla_hari,
        to_char(tgl_bayar,'Day') hari,
        tgl_bayar tanggal,
        TO_CHAR(tgl_bayar,'HH24:MM') jam,
        tgl_mulai + vSla target_date,
        DECODE(jenis_trx,'PAYMENT','Bayar '|| nilai_bayar) catatan,
        EXTRACT(DAY FROM NUMTODSINTERVAL(tgl_bayar - tgl_mulai, 'DAY')) AS jml_hari,
        EXTRACT(HOUR FROM NUMTODSINTERVAL(tgl_bayar - tgl_mulai, 'DAY')) AS jml_jam,
        EXTRACT(MINUTE FROM NUMTODSINTERVAL(tgl_bayar - tgl_mulai, 'DAY')) AS jml_menit,
        EXTRACT(SECOND FROM NUMTODSINTERVAL(tgl_bayar - tgl_mulai, 'DAY')) AS jml_detik
--           mod(object_id,6) jml_hari,
--           mod(object_id,20) jml_jam,
--           mod(object_id,59) jml_menit,
--           mod(object_id,59) jml_detik
        FROM TABLE(ebs_pkg.get_payment_hist(pDcvNo));
        pList := c_list;

END payment_ebs_hist;

BEGIN  
    SELECT userenv('SESSIONID') into vcontextId from dual;
END EBS_PKG;


/
