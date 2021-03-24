CREATE OR REPLACE PACKAGE            "PYM_PKG" AS 
  
    PROCEDURE update_payment_j;
    PROCEDURE overdue_dcv_j;  -- RUNNING tiap jam 1 malam

END PYM_PKG;


/


CREATE OR REPLACE PACKAGE BODY "PYM_PKG" AS

vDcv dcv_request%ROWTYPE;

FUNCTION get_remain_pymt (pDcvNo VARCHAR2) 
RETURN NUMBER
AS
    sisa NUMBER;
BEGIN
    FOR i IN (SELECT sisa_bayar FROM TABLE(ebs_pkg.get_payment_hist(pDcvNo))) LOOP
        sisa := i.sisa_bayar;
    END LOOP;
    RETURN sisa;
END get_remain_pymt;

FUNCTION get_od_bagian (dcvId NUMBER, pBagian VARCHAR2) RETURN NUMBER
AS
    jmltelat NUMBER;
BEGIN
    SELECT SUM(
        CASE WHEN NVL(process_time,SYSDATE) > target_selesai THEN 
            util_pkg.working_days_between(target_selesai, NVL(process_time,SYSDATE))
            ELSE 0
        END) 
    INTO jmltelat
    FROM wf_task
    WHERE dcvh_id = dcvId
    AND bagian = pBagian
    AND task_type = 'Human';

    RETURN jmltelat;
END get_od_bagian;

PROCEDURE overdue_dcv_j AS
  CURSOR cNewOD(n NUMBER) IS SELECT * FROM dcv_request
                WHERE dcvh_status <> 'PAID'
                AND TRUNC(dcvh_submit_time) < TRUNC(SYSDATE)-20-n;
  vOverdueDays NUMBER;
  vRemainingAmt NUMBER;
  vTotRemain NUMBER;
  vFinePct NUMBER;
  vMinOutstd NUMBER;
BEGIN
    BEGIN
        SELECT value INTO vOverdueDays FROM lookup_code WHERE title = 'SLA.PYMTDUE.HARI';
    EXCEPTION WHEN NO_DATA_FOUND THEN vOverdueDays := 42;
    END;

    -- Cari dan initialize DCV yang baru overdue 
    FOR i IN cNewOD(vOverdueDays) LOOP
        BEGIN
            INSERT INTO dcv_overdue (dcvh_id, no_dcv, cust_code, cust_name, tgl_dcv,
                dcv_value, due_dt, remain_pymt, create_dt, 
                dcv_type, dcv_region, dcv_area, dcv_location)
            VALUES (i.dcvh_id, i.dcvh_no_dcv, i.dcvh_cust_code, i.dcvh_cust_name, 
                TRUNC(i.dcvh_submit_time), i.dcvh_appv_value, 
                TRUNC(i.dcvh_submit_time + vOverdueDays),
                vRemainingAmt,
                TO_CHAR(SYSDATE,'YYYYMMDD'),
                i.dcvh_pc_kategori, i.dcvh_region, i.dcvh_area, i.dcvh_location);
        EXCEPTION WHEN DUP_VAL_ON_INDEX THEN NULL;
        END;
    END LOOP;   
END overdue_dcv_j;

PROCEDURE update_payment_j
AS
    CURSOR c1 IS SELECT * FROM dcv_request WHERE dcvh_status = 'PAYABLE';
    vSisa NUMBER;
    vTglByr DATE;
BEGIN
    FOR i IN c1 LOOP

        FOR j IN (SELECT * 
                FROM TABLE (ebs_pkg.get_payment_hist(i.dcvh_no_dcv))
                WHERE jenis_trx = 'PAYMENT' ) LOOP
            vSisa := j.sisa_bayar;
            vTglByr := j.tgl_bayar;
        END LOOP;

        UPDATE dcv_overdue SET last_pymt_dt = TO_NUMBER(TO_CHAR(vTglByr,'YYYYMMDD')), 
                                remain_pymt = vSisa,
                                modifiy_dt = to_char(sysdate,'YYYYMMDD')
        WHERE dcvh_id = i.dcvh_id;
        IF vSisa = 0 THEN
            UPDATE dcv_request SET dcvh_status = 'PAID',
                                modified_dt = sysdate,
                                modified_by = 'SYSTEM'
            WHERE dcvh_id = i.dcvh_id;
        END IF;
    END LOOP;
END;

END PYM_PKG;
/
