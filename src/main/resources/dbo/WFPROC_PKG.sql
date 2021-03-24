CREATE OR REPLACE PACKAGE            "WFPROC_PKG" AS
    FUNCTION terminate_dcv (pTaskId NUMBER) RETURN NUMBER;
    FUNCTION dist_serah_kwa (pTaskId NUMBER) RETURN NUMBER;
    FUNCTION back2_sales_tc (pTaskId NUMBER) RETURN NUMBER;
    FUNCTION tc_reset (pTaskId NUMBER) RETURN NUMBER;
    FUNCTION ap_email_to_dist (pTaskId NUMBER) RETURN NUMBER;
    FUNCTION ap_disposisi (pTaskId NUMBER) RETURN NUMBER;
    FUNCTION post_ap_done (pTaskId NUMBER) RETURN NUMBER;
    FUNCTION post_pr_grfail (pTaskId NUMBER) RETURN NUMBER;


    PROCEDURE validate_tc1_1 (pDcvNo VARCHAR2, pCode OUT VARCHAR2, pMsg OUT VARCHAR2) ;

    -- Distributor sudah upload kwitansi dan faktur pajak (jika ppn)
    PROCEDURE validate_d2_1 (pDcvNo VARCHAR2, pCode OUT VARCHAR2, pMsg OUT VARCHAR2);

    -- Distributor Serah Kwitansi Asli ke TC, cek input no resi
    PROCEDURE validate_d3_1 (pDcvNo VARCHAR2, pCode OUT VARCHAR2, pMsg OUT VARCHAR2);

    -- cek Distributor sudah serahkan kwitansi asli
    PROCEDURE validate_tc3_1 (pDcvNo VARCHAR2, pCode OUT VARCHAR2, pMsg OUT VARCHAR2);

    -- TC serah PO, GR, Kwitansi, Kwitansi Asli & FP ke AP
    PROCEDURE validate_tc4_1 (pDcvNo VARCHAR2, pCode OUT VARCHAR2, pMsg OUT VARCHAR2);

    -- Tax sudah upload BP PPh jika flag pph 
    PROCEDURE validate_tx2_1 (pDcvNo VARCHAR2, pCode OUT VARCHAR2, pMsg OUT VARCHAR2) ;

    -- Promo sudah bikin GR
    PROCEDURE validate_pr3_1 (pDcvNo VARCHAR2, pCode OUT VARCHAR2, pMsg OUT VARCHAR2) ;
    PROCEDURE validate_pr3_2 (pDcvNo VARCHAR2, pCode OUT VARCHAR2, pMsg OUT VARCHAR2) ;

END wfproc_pkg;


/


CREATE OR REPLACE PACKAGE BODY            "WFPROC_PKG" AS

    vNoDCV  dcv_request.dcvh_no_dcv%TYPE;
    vDcv dcv_request%ROWTYPE;

FUNCTION post_ap_done (pTaskId NUMBER) RETURN NUMBER
AS
BEGIN
    UPDATE dcv_request SET dcvh_status = 'PAYABLE'
    WHERE dcvh_id = (SELECT dcvh_id FROM wf_task WHERE id= pTaskId);

    RETURN (0);
EXCEPTION 
WHEN OTHERS THEN RETURN (-1);
END post_ap_done;

FUNCTION post_pr_grfail (pTaskId NUMBER) RETURN NUMBER
AS
    d3Id NUMBER;
    oriTask wf_task%ROWTYPE;
    vrowid ROWID;
BEGIN
    SELECT * INTO oriTask FROM wf_task WHERE id = pTaskId;

    BEGIN
        SELECT rowid INTO vrowid FROM wf_task
        WHERE dcvh_id = oriTask.dcvh_id
        AND nodecode = 'D3'
        AND progress_status = 'WAIT' 
        FOR UPDATE NOWAIT;

        UPDATE wf_task SET progress_status = 'DONE', process_time = SYSDATE,
                process_by = 'SYSTEM-'||pTaskId,
                note = 'Gagal proses GR'
        WHERE rowid = vrowid;
    EXCEPTION WHEN OTHERS THEN NULL;
    END;
    RETURN (0);

EXCEPTION WHEN OTHERS THEN RETURN (-1);
END post_pr_grfail;


FUNCTION terminate_dcv (pTaskId NUMBER) RETURN NUMBER
AS
BEGIN
    UPDATE dcv_request SET dcvh_status = 'TERMINATED'
    WHERE dcvh_id = (SELECT dcvh_id FROM wf_task WHERE id= pTaskId);

    RETURN (0);

EXCEPTION 
WHEN OTHERS THEN RETURN (-1);
END;

FUNCTION back2_sales_tc (pTaskId NUMBER) RETURN NUMBER
AS
    vNodeAsal VARCHAR2(6);
BEGIN
    SELECT nodecode INTO vNodeAsal
    FROM wf_task
    WHERE id = (
        SELECT prev_task FROM wf_task WHERE id= (
            SELECT prev_task FROM wf_task WHERE id = pTaskId
        )
    );

    IF vNodeAsal = 'SL1' THEN RETURN (1);
    ELSE RETURN (2);
    END IF;

EXCEPTION 
WHEN OTHERS THEN RETURN (-1);
END;

FUNCTION tc_reset (pTaskId NUMBER) RETURN NUMBER
AS
    vNodeAsal VARCHAR2(6);
    vErrorMsg VARCHAR2(100);
BEGIN

    SELECT * INTO vDcv FROM dcv_request 
    WHERE dcvh_no_dcv = (SELECT no_dcv FROM wf_task WHERE id = pTaskId);

    DELETE tc_approval WHERE dcvl_id IN (
    SELECT dcvl_id FROM request_dtl WHERE dcvh_id = vDcv.dcvh_id);
    dcv_pkg.sync_dcv_value (vDcv.dcvh_no_dcv, vErrorMsg) ;

    return(1);

EXCEPTION 
WHEN OTHERS THEN RETURN (-1);
END tc_reset;

FUNCTION dist_serah_kwa (pTaskId NUMBER) RETURN NUMBER
AS
    vNodeAsal VARCHAR2(6);
    vTask wf_task%ROWTYPE;
BEGIN
    SELECT * INTO vDcv FROM dcv_request 
    WHERE dcvh_no_dcv = (SELECT no_dcv FROM wf_task WHERE id = pTaskId);

    IF vTask.return_task = 'Y' THEN
        RETURN (2);
    ELSE
        BEGIN
            SELECT * INTO vTask FROM wf_task
            WHERE no_dcv = vDcv.dcvh_no_dcv
            AND (nodecode, decision) IN (('TC3',3));
            RETURN (2);
        EXCEPTION WHEN NO_DATA_FOUND THEN RETURN (1);
        END;

    END IF;
EXCEPTION
WHEN OTHERS THEN RETURN (-1);
END dist_serah_kwa;

FUNCTION ap_email_to_dist (pTaskId NUMBER) RETURN NUMBER
AS
    vNodeAsal VARCHAR2(6);
BEGIN

    SELECT * INTO vDcv FROM dcv_request 
    WHERE dcvh_no_dcv = (SELECT no_dcv FROM wf_task WHERE id = pTaskId);
    -- kirim email ke distributor   
    return(1);

EXCEPTION 
WHEN OTHERS THEN RETURN (-1);
END;

FUNCTION ap_disposisi (pTaskId NUMBER) RETURN NUMBER
AS
BEGIN
    SELECT * INTO vDcv FROM dcv_request 
    WHERE dcvh_no_dcv = (SELECT no_dcv FROM wf_task WHERE id = pTaskId);
    IF NVL(vDcv.dcvh_proses_bayar,'NORMAL') IN ('NORMAL', 'BAYAR') THEN RETURN 1;
    ELSE RETURN 2;
    END IF;
EXCEPTION 
WHEN OTHERS THEN RETURN (-1);
END ap_disposisi;

PROCEDURE validate_tc1_1 (pDcvNo VARCHAR2, pCode OUT VARCHAR2, pMsg OUT VARCHAR2) 
AS
    vDcv dcv_request%ROWTYPE;
BEGIN
    SELECT * into vDcv FROM dcv_request WHERE dcvh_no_dcv = pDcvNo;
    IF NVL(vDcv.dcvh_appv_value,0) > 0 THEN
        pCode := 0;
        pMsg := 'PASSED';
    ELSE
        pCode := -1;
        pMsg := 'Pastikan Value Approval > 0, Informasi Kwitansi sudah terisi';
    END IF;

EXCEPTION WHEN OTHERS THEN pCode := -1; pMsg:= 'Error';
END validate_tc1_1;

PROCEDURE validate_d2_1 (pDcvNo VARCHAR2, pCode OUT VARCHAR2, pMsg OUT VARCHAR2) 
AS
    vDcv dcv_request%ROWTYPE;
    vDoc dcv_documents%ROWTYPE;
    bPpn BOOLEAN := false;
    CURSOR cDtl(id NUMBER) IS 
            SELECT * FROM request_dtl WHERE dcvh_id = id;
BEGIN
    SELECT * into vDcv FROM dcv_request WHERE dcvh_no_dcv = pDcvNo;
    -- check kuitansi
    BEGIN
        SELECT * INTO vDoc FROM dcv_documents
        WHERE dcvh_id = vDcv.dcvh_id AND doc_type = 'KW';

        pCode := 0;
        pMsg := 'PASSED';
    EXCEPTION WHEN NO_DATA_FOUND THEN 
        pCode := -1; pMsg := 'Pastikan Attachment Kwitansi sudah dilakukan.';
    END;

    IF pCode = 0 THEN
        FOR i IN cDtl(vDcv.dcvh_id) LOOP
            IF i.dcvl_ppn_code = 'PPN' THEN
                bPpn := true;            
                EXIT;
            END IF;
        END LOOP;

        IF bPpn THEN
            BEGIN
                    SELECT * INTO vDoc FROM dcv_documents
                    WHERE dcvh_id = vDcv.dcvh_id AND doc_type = 'FP';
                    pCode := 0; pMsg := 'PASSED';
            EXCEPTION WHEN NO_DATA_FOUND THEN 
                    pCode := -1; pMsg := 'Pastikan Attachment Faktur Pajak sudah dilakukan.';
            END;
        END IF;
    END IF;

EXCEPTION WHEN OTHERS THEN pCode := -1; pMsg:= 'Error';
END validate_d2_1;

PROCEDURE validate_d3_1 (pDcvNo VARCHAR2, pCode OUT VARCHAR2, pMsg OUT VARCHAR2) 
AS
    vDcv dcv_request%ROWTYPE;
    vDoc dcv_documents%ROWTYPE;
    bPpn BOOLEAN := false;
    CURSOR cDtl(id NUMBER) IS 
            SELECT * FROM request_dtl WHERE dcvh_id = id;
BEGIN
    SELECT * into vDcv FROM dcv_request WHERE dcvh_no_dcv = pDcvNo;
    -- check kuitansi
    BEGIN
        SELECT * INTO vDoc FROM dcv_documents
        WHERE dcvh_id = vDcv.dcvh_id AND doc_type = 'RK';

        pCode := 0;
        pMsg := 'PASSED';
    EXCEPTION WHEN NO_DATA_FOUND THEN 
        pCode := -1; pMsg := 'Pastikan Attachment No.Resi Kwitansi sudah dilakukan.';
    END;

EXCEPTION WHEN OTHERS THEN pCode := -1; pMsg:= 'Error';
END validate_d3_1;

PROCEDURE validate_tc3_1 (pDcvNo VARCHAR2, pCode OUT VARCHAR2, pMsg OUT VARCHAR2) 
AS
    vDcv dcv_request%ROWTYPE;
    vTask wf_task%ROWTYPE;
    vNo NUMBER;
BEGIN
    SELECT * into vDcv FROM dcv_request WHERE dcvh_no_dcv = pDcvNo;
    -- check kuitansi

        BEGIN
            SELECT 1 INTO vNo FROM dcv_documents 
            WHERE dcvh_id = vDcv.dcvh_id
            AND doc_type = 'RK';

            pCode := 0; pMsg := 'PASSED';

--            SELECT * INTO vTask FROM wf_task
--            WHERE no_dcv = vDcv.dcvh_no_dcv
--            AND nodecode = 'D3' AND decision=1;
--            IF vTask.progress_status = 'DONE' THEN
--                pCode := 0; pMsg := 'PASSED';
--            ELSE
--                pCode := -1; pMsg := 'Distributor belum submit Kwitansi Asli';
--            END IF;
        EXCEPTION WHEN NO_DATA_FOUND THEN
                pCode := -1; pMsg := 'Distributor belum submit Kwitansi Asli';
        WHEN TOO_MANY_ROWS THEN
            pCode := 0; pMsg := 'PASSED';
        END;
--EXCEPTION WHEN OTHERS THEN pCode := -1; pMsg:= 'Error';
END validate_tc3_1;

PROCEDURE validate_tc3_3 (pDcvNo VARCHAR2, pCode OUT VARCHAR2, pMsg OUT VARCHAR2) 
AS
    vDcv dcv_request%ROWTYPE;
    vTask wf_task%ROWTYPE;
BEGIN
    SELECT * into vDcv FROM dcv_request WHERE dcvh_no_dcv = pDcvNo;
    -- check kuitansi
    BEGIN
       SELECT * INTO vTask FROM wf_task
       WHERE no_dcv = vDcv.dcvh_no_dcv
       AND nodecode = 'D3' AND decision=1;
    EXCEPTION WHEN NO_DATA_FOUND THEN NULL;
    END;

    pCode := 0; pMsg := 'PASSED';
END validate_tc3_3;

PROCEDURE validate_tc4_1 (pDcvNo VARCHAR2, pCode OUT VARCHAR2, pMsg OUT VARCHAR2) 
AS
    vDcv dcv_request%ROWTYPE;
    vTask wf_task%ROWTYPE;
    lastTaskId NUMBER;
BEGIN
    SELECT * into vDcv FROM dcv_request WHERE dcvh_no_dcv = pDcvNo;
    -- check kuitansi

    BEGIN
        SELECT MAX(id) INTO lastTaskId FROM wf_task
        WHERE nodecode = 'TC4' AND no_dcv = vDcv.dcvh_no_dcv;
        
        IF lastTaskId IS NULL THEN
            pCode := -1; pMsg := 'Harus sudah terima kwitansi asli';
        
        ELSE
            SELECT * INTO vTask FROM wf_task WHERE id = lastTaskId;
            IF vTask.progress_status = 'DONE' AND vTask.decision=1 THEN 
                pCode := 0; pMsg := 'PASSED';
            ELSE 
                pCode := -1; pMsg := 'Harus sudah terima kwitansi asli';
            END IF;
        END IF;
    EXCEPTION WHEN NO_DATA_FOUND THEN
            pCode := -1; pMsg := 'Penerimaan Kwitansi Asli harus sudah terisi';
    END;
    
    IF pCode = 0 THEN
        BEGIN
            SELECT MAX(id) INTO lastTaskId FROM wf_task
            WHERE nodecode = 'TC2' AND no_dcv = vDcv.dcvh_no_dcv;
            IF lastTaskId IS NULL THEN
                pCode := -1; pMsg := 'Harus sudah terima dari Promo';
            ELSE
                SELECT * INTO vTask FROM wf_task WHERE id = lastTaskId;
                IF vTask.progress_status = 'DONE' AND vTask.decision=1 THEN 
                    pCode := 0; pMsg := 'PASSED';
                ELSE 
                    pCode := -1; pMsg := 'Harus sudah terima dari Promo';
                END IF;
            END IF;
        END;
    END IF;        

EXCEPTION WHEN OTHERS THEN pCode := -1; pMsg:= 'Error';
END validate_tc4_1;

PROCEDURE validate_pr3_1 (pDcvNo VARCHAR2, pCode OUT VARCHAR2, pMsg OUT VARCHAR2) 
AS
    vDcv dcv_request%ROWTYPE;
    vTask wf_task%ROWTYPE;
    vdata NUMBER;
BEGIN
    SELECT * into vDcv FROM dcv_request WHERE dcvh_no_dcv = pDcvNo;
    -- cek GR
    BEGIN
        SELECT 1 into vdata FROM dokumen_realisasi 
        WHERE dcvh_id = vDcv.dcvh_id 
        AND tahapan_realisasi = 'GR';
        pCode := 0; pMsg := 'PASSED';
    EXCEPTION 
    WHEN NO_DATA_FOUND THEN
        pCode := -1; pMsg := 'Belum ada GR.';
    WHEN TOO_MANY_ROWS THEN
        pCode := 0; pMsg := 'PASSED';
    END;

END validate_pr3_1;

PROCEDURE validate_pr3_2 (pDcvNo VARCHAR2, pCode OUT VARCHAR2, pMsg OUT VARCHAR2) 
AS
    vDcv dcv_request%ROWTYPE;
    vTask wf_task%ROWTYPE;
    vdata NUMBER;
BEGIN
    SELECT * into vDcv FROM dcv_request WHERE dcvh_no_dcv = pDcvNo;
    -- cek GR
    BEGIN
        SELECT 1 into vdata FROM dokumen_realisasi 
        WHERE dcvh_id = vDcv.dcvh_id 
        AND tahapan_realisasi = 'GR';
        pCode := -1; pMsg := 'Tidak bisa karena sudah ada GR.';
    EXCEPTION 
    WHEN NO_DATA_FOUND THEN
        pCode := 0; pMsg := 'PASSED';
    WHEN TOO_MANY_ROWS THEN
        pCode := 0; pMsg := 'PASSED';
    END;

END validate_pr3_2;

PROCEDURE validate_tx2_1 (pDcvNo VARCHAR2, pCode OUT VARCHAR2, pMsg OUT VARCHAR2) 
AS
    CURSOR cDtl(id NUMBER) IS SELECT * FROM request_dtl WHERE dcvh_id = id;
    vDcv dcv_request%ROWTYPE;
    vDoc dcv_documents%ROWTYPE;
    vTask wf_task%ROWTYPE;
    bPph BOOLEAN := false;
BEGIN
    SELECT * into vDcv FROM dcv_request WHERE dcvh_no_dcv = pDcvNo;
    -- check PPN
    FOR i IN cDtl(vDcv.dcvh_id) LOOP
            IF i.dcvl_pph_code IS NOT NULL THEN
                bPph := true;            
                EXIT;
            END IF;
    END LOOP;
    IF bPph THEN
            BEGIN
                    SELECT * INTO vDoc FROM dcv_documents
                    WHERE dcvh_id = vDcv.dcvh_id AND doc_type = 'BP';
                    pCode := 0; pMsg := 'PASSED';
            EXCEPTION WHEN NO_DATA_FOUND THEN 
                    pCode := -1; pMsg := 'Pastikan Attachment Bukti Potong PPH sudah dilakukan.';
            END;
    ELSE
        pCode := 0; pMsg := 'PASSED';
    END IF;

EXCEPTION WHEN OTHERS THEN pCode := -1; pMsg:= 'Error';
END validate_tx2_1;


END wfproc_pkg;
/
