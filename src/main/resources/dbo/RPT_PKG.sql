CREATE OR REPLACE PACKAGE "RPT_PKG" AS 
   
    TYPE sla_typ IS RECORD (
        periode NUMBER,
        custcode VARCHAR2(50),
        custname VARCHAR2(100),
        no_dcv VARCHAR2(50),
        tgl_dcv DATE,
        due_dt DATE,
        last_pymt DATE,
        od_num NUMBER,
        sisa_bayar NUMBER,
        nilai_denda NUMBER,
        distr_hari NUMBER,
        distr_denda NUMBER,
        focus_hari NUMBER,
        focus_denda NUMBER,
        sales_hari NUMBER,
        sales_denda NUMBER(9,2),
        tc_hari NUMBER,
        tc_denda NUMBER(9,2),
        tax_hari NUMBER,
        tax_denda NUMBER(9,2),
        promo_hari NUMBER,
        promo_denda NUMBER(9,2),
        ap_hari NUMBER,
        ap_denda NUMBER(9,2)
    );


    TYPE sla_typ_tab IS TABLE OF sla_typ ;

    PROCEDURE wf_hist (pbagian VARCHAR, pNoDcv VARCHAR2, pList OUT SYS_REFCURSOR);

    PROCEDURE download_dcv (pDistributor VARCHAR2,
                        pFilterType VARCHAR2,
                        pBagian VARCHAR2,
                        pPeriodeSubmitStart DATE,
                        pPeriodeSubmitEnd DATE,
                        pNoDcv VARCHAR2,
                        pPeriodeSubmit  VARCHAR2,
                        pCustCode  VARCHAR2,
                        pNamaCustomer VARCHAR2,
                        pRegion VARCHAR2,
                        pArea VARCHAR2,
                        pLocation VARCHAR2,
                        pNoPc VARCHAR2,
                        pPeriodePcStart  VARCHAR2,
                        pPeriodePcEnd  VARCHAR2,
                        pKategoriPc VARCHAR2,
                        pTipePc VARCHAR2,
                        pDcvValue  VARCHAR2,
                        pDcvApprValue VARCHAR2,
                        pDisposisi VARCHAR2,
                        pNoSeri VARCHAR2,
                        pLastAction VARCHAR2,
                        pCurrentAction VARCHAR2,
                        pSortBy1 VARCHAR2,
                        pOrder1 VARCHAR2,
                        pSortBy2 VARCHAR2,
                        pOrder2 VARCHAR2,
                        pSortBy3 VARCHAR2,
                        pOrder3 VARCHAR2,
                        pSortBy4 VARCHAR2,
                        pOrder4 VARCHAR2,
                        pSortBy5 VARCHAR2,
                        pOrder5 VARCHAR2,
                        pSortBy6 VARCHAR2,
                        pOrder6 VARCHAR2,
                        pOrder7 VARCHAR2,
                        pSortBy7 VARCHAR2,
                        pOrder8 VARCHAR2,
                        pSortBy8 VARCHAR2,
                        pOrder9 VARCHAR2,                        
                        pSortBy9 VARCHAR2,
                        pOrder10 VARCHAR2,
                        pSortBy10 VARCHAR2,
                        pList OUT SYS_REFCURSOR
                        );

    FUNCTION get_sla_payment (pPeriode NUMBER, 
                                        pDivisi VARCHAR2,
                                        pCust1 VARCHAR,
                                        pCust2 VARCHAR2,
                                        pRegion VARCHAR2,
                                        pArea VARCHAR2,
                                        pLocation VARCHAR2,
                                    pFormula VARCHAR2
                                    ) RETURN sla_typ_tab PIPELINED;
    FUNCTION get_sla_late (pPeriode NUMBER,
                                        pDivisi VARCHAR2,
                                        pCust1 VARCHAR,
                                        pCust2 VARCHAR2,
                                        pRegion VARCHAR2,
                                        pArea VARCHAR2,
                                        pLocation VARCHAR2,
                                    pFormula VARCHAR2
                                        ) RETURN sla_typ_tab PIPELINED;

    FUNCTION get_sla_rpt ( pPeriodType VARCHAR2  -- pelunasan/kterlambatan
                            ,pPeriode NUMBER     -- yyyymm
                            ,pDivisi VARCHAR2    -- food nonfood
                            ,pCust1 VARCHAR
                            ,pCust2 VARCHAR2
                            ,pRegion VARCHAR2
                            ,pArea VARCHAR2
                            ,pLocation VARCHAR2
                                    ,pFormula VARCHAR2
                        ) RETURN sla_typ_tab PIPELINED;



END RPT_PKG;
/


CREATE OR REPLACE PACKAGE BODY "RPT_PKG" AS

vcontextId VARCHAR2(50);
vpctdenda NUMBER;

PROCEDURE wf_hist (pbagian VARCHAR, pNoDcv VARCHAR2, pList OUT SYS_REFCURSOR) 
AS
    CURSOR cDist IS
        select t.id, t.no_dcv, t.tahapan, t.process_by, t.assign_time, t.target_selesai, 
        t.process_time, t.note, t.progress_status,
--        util_pkg.working_days_between(t.assign_time, t.process_time) as durasi,
        DECODE(lag(t.bagian,1) over (order by t.id),'Distributor','D','F')||'-'||
        DECODE(t.bagian,'Distributor','D','F') ||'-'||
        DECODE(lead(t.bagian,1) over (order by t.id),'Distributor','D','F') as bracket,
        wd.sla1 as target_sla
        from wf_task t
        LEFT OUTER JOIN wf_node wd ON wd.nodecode = t.nodecode
        where t.no_dcv = pNoDcv
        and t.task_type in ('Human', 'Start')
        order by t.id;

    CURSOR c2 IS 
        SELECT * FROM tmp_processing_rpt WHERE context_id = vcontextId ORDER BY task_id DESC;
    vc cDist%ROWTYPE;
    vstart DATE;
    vend DATE;
    vLastDate DATE;
    vtahapan VARCHAR2(200);
    vList SYS_REFCURSOR;
    vUser VARCHAR2(200);
    first BOOLEAN;
    vDurDy NUMBER;
    vDurHh NUMBER;
    vDurMi NUMBER;
    vDurSs NUMBER;
    totSeconds NUMBER;
    runtotsla NUMBER := 0;
    rownumcnt NUMBER := 0;
    slaAp NUMBER;
    totDaysDist NUMBER := 0;
    totSecsDist NUMBER := 0;
    totDaysFocus NUMBER := 0;
    totSecsFocus NUMBER := 0;
    dayProsesBayar NUMBER := 0;
    lastTglBayar DATE;
    startTglAP DATE;

  BEGIN
    SELECT SYS_GUID() into vcontextId FROM dual;
    DELETE tmp_processing_rpt WHERE context_id = vcontextId;

    IF pbagian = 'Distributor' THEN
        OPEN cDist;
        LOOP
            FETCH cDist into vc;
            EXIT WHEN cDist%NOTFOUND;

            IF (vc.bracket = 'F-F-F') THEN
                vstart := NVL(vend, vc.assign_time);
                vtahapan := 'Proses Internal Focus';
                vUser := 'Focus';
            ELSE
                vstart := vc.assign_time;
                vend := vc.process_time;
                vtahapan := vc.tahapan;
                vUser := vc.process_by;
                runtotsla := 0;
            END IF;

            INSERT INTO tmp_processing_rpt (context_id, no_dcv, task_id, submit_date, process_date, target_date, 
                tahapan, username, note, target_sla, flag1)
            VALUES (vcontextId, pNoDcv, vc.id, vstart, vc.process_time, vc.target_selesai, 
                vtahapan, vUser, vc.note, vc.target_sla + runtotsla, 'A');

            vLastDate := vc.process_time;
            IF (vc.bracket = 'F-F-F') THEN
                runtotsla := runtotsla + vc.target_sla;
            END IF;
        END LOOP;

        vend := vLastDate;
        FOR i IN c2 LOOP
            IF (i.tahapan = 'Proses Internal Focus') THEN
                UPDATE tmp_processing_rpt SET process_date = vend 
                WHERE context_id = vcontextId
                AND task_id = i.task_id;
            ELSE vend := i.submit_date;
            END IF;
        END LOOP;

        first:=true;
        FOR i IN c2 LOOP
            IF (first AND (i.tahapan = 'Proses Internal Focus')) THEN
                first := false;
            ELSIF NOT first AND (i.tahapan = 'Proses Internal Focus') THEN
               DELETE tmp_processing_rpt WHERE context_id = vcontextId AND task_id = i.task_id;
             ELSIF NOT first AND (i.tahapan != 'Proses Internal Focus') THEN
               first := true;
          END IF;
        END LOOP;    

    ELSE

        INSERT INTO tmp_processing_rpt (context_id, no_dcv, task_id, tahapan, submit_date, 
            process_date, target_date, username, note, target_sla, flag1)
        SELECT vcontextId, no_dcv, id, tahapan, assign_time, process_time, target_selesai, 
            process_by, note, wd.sla1 as target_sla, 'A'
        FROM wf_task t 
        LEFT OUTER JOIN wf_node wd ON wd.nodecode = t.nodecode
        where no_dcv = pNoDcv
        and task_type in ('Human', 'Start')
        order by id;

    END IF;

    -- update duration
    FOR i IN c2 LOOP
        vDurDy := util_pkg.working_days_between(i.submit_date, NVL(i.process_date,sysdate));

        vStart := TO_DATE('01012020'||TO_CHAR(i.submit_date,'HH24MISS'),'DDMMYYYYHH24MISS');
        vEnd   := TO_DATE('01012020'||TO_CHAR(NVL(i.process_date,SYSDATE),'HH24MISS'),'DDMMYYYYHH24MISS');
        IF (vStart > vEnd) THEN vDurDy := vDurDy -1; vEnd := vEnd +1; END IF;
        totSeconds := (vEnd-vStart) * 86400;
        vDurHh := extract(HOUR from (NUMTODSINTERVAL(totSeconds, 'SECOND')));
        vDurMi := extract(MINUTE from (NUMTODSINTERVAL(totSeconds, 'SECOND')));
        vDurSs := extract(SECOND from (NUMTODSINTERVAL(totSeconds, 'SECOND')));
        UPDATE tmp_processing_rpt SET
            duration_days = vDurDy,
            duration_hours = vDurHh,
            duration_minutes = vDurMi,
            duration_seconds = vDurSs
        WHERE context_id = vcontextid AND task_id = i.task_id;
        IF i.tahapan LIKE '%- Distributor' THEN
            totDaysDist := totDaysDist + vDurDy;
            totSecsDist := totSecsDist + totSeconds;
        ELSE
            totDaysFocus := totDaysFocus + vDurDy;
            totSecsFocus := totSecsFocus + totSeconds;
        END IF;

    END LOOP;

    SELECT COUNT(*) INTO rownumcnt FROM tmp_processing_rpt WHERE context_id = vcontextid;
    BEGIN
        SELECT NVL(sla1,1) INTO slaAp FROM wf_node WHERE nodecode = 'AP2';
    EXCEPTION WHEN NO_DATA_FOUND THEN slaAp := 1;
    END;

    SELECT NVL(MAX(tgl_bayar),SYSDATE), NVL(MIN(tgl_mulai),SYSDATE) 
    INTO lastTglBayar, startTglAP
    FROM TABLE(ebs_pkg.get_payment_hist(pNoDcv));
    dayProsesBayar := util_pkg.working_days_between(startTglAP, lastTglBayar);
    dbms_output.put_line('--> ' || lastTglBayar || ' - ' || startTglAP || '--' || dayProsesBayar);

    OPEN vList FOR 
        SELECT rownum no, tahapan, username, submit_date, target_date, 
            process_date, note,
            target_sla,
            duration_days, duration_hours, 
            duration_minutes, duration_seconds,
            flag1
            FROM (SELECT * FROM tmp_processing_rpt 
                    where context_id = vcontextid AND no_dcv = pNoDcv ORDER BY task_id)
        UNION
        SELECT ROWNUM + rownumcnt no,        
        jenis_trx tahapan,
        username,
        tgl_mulai submit_date,
        util_pkg.next_working_day(tgl_mulai,slaAp) target_date,
        tgl_bayar process_date,
        DECODE(jenis_trx,'PAYMENT','Bayar '|| nilai_bayar) note,
        slaAp target_sla,
        EXTRACT(DAY FROM NUMTODSINTERVAL(util_pkg.working_days_between(tgl_mulai,tgl_bayar), 'DAY')) AS duration_days,
        EXTRACT(HOUR FROM NUMTODSINTERVAL(tgl_bayar - tgl_mulai, 'DAY')) AS duration_hours,
        EXTRACT(MINUTE FROM NUMTODSINTERVAL(tgl_bayar - tgl_mulai, 'DAY')) AS duration_minutes,
        EXTRACT(SECOND FROM NUMTODSINTERVAL(tgl_bayar - tgl_mulai, 'DAY')) AS duration_seconds,
        'C' flag1
        FROM TABLE(ebs_pkg.get_payment_hist(pNoDcv))
        UNION
        SELECT ROWNUM no,        
        '' tahapan,
        '' username,
        null submit_date,
        null target_date,
        null process_date,
        DECODE(rownum,1,'Total Durasi - Distributor ', 'Total Durasi - Focus') note,
        null target_sla,
        CASE ROWNUM 
            WHEN 1 THEN totDaysDist + EXTRACT(DAY FROM NUMTODSINTERVAL(totSecsDist, 'SECOND')) 
            WHEN 2 THEN dayProsesBayar + totDaysFocus + EXTRACT(DAY FROM NUMTODSINTERVAL(totSecsFocus, 'SECOND')) 
        END AS duration_days,
        CASE ROWNUM 
            WHEN 1 THEN EXTRACT(HOUR FROM NUMTODSINTERVAL(totSecsDist, 'SECOND')) 
            WHEN 2 THEN EXTRACT(HOUR FROM NUMTODSINTERVAL(totSecsFocus, 'SECOND')) 
        END AS duration_hours,
        EXTRACT(MINUTE FROM NUMTODSINTERVAL(DECODE(ROWNUM,1,totSecsDist,totSecsFocus), 'SECOND')) AS duration_minutes,
        EXTRACT(SECOND FROM NUMTODSINTERVAL(DECODE(ROWNUM,1,totSecsDist,totSecsFocus), 'SECOND')) AS duration_seconds,
        'D' flag1
        FROM user_objects
        WHERE rownum < 3
        ORDER BY flag1, no;

    pList := vList;

END wf_hist;

PROCEDURE download_dcv (pDistributor VARCHAR2,
                        pFilterType VARCHAR2,
                        pBagian VARCHAR2,
                        pPeriodeSubmitStart DATE,
                        pPeriodeSubmitEnd DATE,
                        pNoDcv VARCHAR2,
                        pPeriodeSubmit  VARCHAR2,
                        pCustCode  VARCHAR2,
                        pNamaCustomer VARCHAR2,
                        pRegion VARCHAR2,
                        pArea VARCHAR2,
                        pLocation VARCHAR2,
                        pNoPc VARCHAR2,
                        pPeriodePcStart  VARCHAR2,
                        pPeriodePcEnd  VARCHAR2,
                        pKategoriPc VARCHAR2,
                        pTipePc VARCHAR2,
                        pDcvValue  VARCHAR2,
                        pDcvApprValue VARCHAR2,
                        pDisposisi VARCHAR2,
                        pNoSeri VARCHAR2,
                        pLastAction VARCHAR2,
                        pCurrentAction VARCHAR2,
                        pSortBy1 VARCHAR2,
                        pOrder1 VARCHAR2,
                        pSortBy2 VARCHAR2,
                        pOrder2 VARCHAR2,
                        pSortBy3 VARCHAR2,
                        pOrder3 VARCHAR2,
                        pSortBy4 VARCHAR2,
                        pOrder4 VARCHAR2,
                        pSortBy5 VARCHAR2,
                        pOrder5 VARCHAR2,
                        pSortBy6 VARCHAR2,
                        pOrder6 VARCHAR2,
                        pOrder7 VARCHAR2,
                        pSortBy7 VARCHAR2,
                        pOrder8 VARCHAR2,
                        pSortBy8 VARCHAR2,
                        pOrder9 VARCHAR2,                        
                        pSortBy9 VARCHAR2,
                        pOrder10 VARCHAR2,
                        pSortBy10 VARCHAR2,
                        pList OUT SYS_REFCURSOR
                        )
AS
    vList SYS_REFCURSOR;
    vSelect VARCHAR2(4000);
    vStart VARCHAR2(20);
    vEnd VARCHAR2(20);
    vWhere VARCHAR2 (1000) := 'Where 1=1 ';
    vOrder VARCHAR2 (1000) := '';
    vdocno VARCHAR2(100);
    CURSOR cTmp(pCtxId VARCHAR2) IS 
            SELECT t.tahapan, t.task_id, dcv.* 
            FROM dcv_request dcv
            INNER JOIN tmp_processing_rpt t ON t.dcvh_id = dcv.dcvh_id
            WHERE t.context_id = pCtxId;
    vTmp cTmp%ROWTYPE;
    bdel BOOLEAN;
    vDivisi VARCHAR2(50);
    numFilter NUMBER := 0;
    filtermatch NUMBER := 0;
    vTahapan wf_task.tahapan%TYPE;
    vFilterText VARCHAR2(200);
BEGIN
    SELECT SYS_GUID() into vcontextId FROM dual;
    DELETE tmp_processing_rpt WHERE context_id = vcontextId;

    SELECT user_division INTO vDivisi 
        FROM user_access WHERE user_name = pDistributor;

    IF pBagian = 'Distributor' AND pFilterType = 'DCV All' THEN
        INSERT INTO tmp_processing_rpt (context_id, dcvh_id, no_dcv, tahapan, task_id)
        SELECT vcontextId, r.dcvh_id, r.dcvh_no_dcv, 
            NVL(t.tahapan, r.dcvh_current_step), NVL(t.id,0)
        FROM dcv_request r
        LEFT OUTER JOIN wf_task t 
            ON t.no_dcv = r.dcvh_no_dcv
            AND t.progress_status = 'WAIT'
            AND t.bagian = pBagian
        WHERE dcvh_cust_code = pDistributor
        AND dcvh_status <> 'TERMINATED'
        AND dcvh_submit_time BETWEEN TRUNC(pPeriodeSubmitStart) AND TRUNC(pPeriodeSubmitEnd+1);

    ELSIF pBagian = 'Distributor' THEN
        INSERT INTO tmp_processing_rpt (context_id, dcvh_id, no_dcv, tahapan, task_id)
        SELECT DISTINCT vcontextId, dcv.dcvh_id, dcv.dcvh_no_dcv, 
            wf.tahapan, wf.id
        FROM dcv_request dcv
        INNER JOIN wf_task wf 
            ON wf.dcvh_id = dcv.dcvh_id 
            AND wf.progress_status = 'WAIT' 
            AND wf.bagian = pBagian
        WHERE dcvh_cust_code = pDistributor
        AND dcv.dcvh_status <> 'TERMINATED'
        AND CASE
            WHEN pFilterType = 'Return Task' AND NVL(wf.return_task,'N') = 'Y' THEN 0
            WHEN pFilterType = 'New Task' AND NVL(wf.return_task,'N') = 'N' THEN 0
            ELSE 1
            END = 0
        AND dcv.dcvh_submit_time BETWEEN TRUNC(pPeriodeSubmitStart) AND TRUNC(pPeriodeSubmitEnd+1)
        AND CASE
            WHEN pFilterType = 'Return Task' AND NVL(wf.return_task,'N') = 'N' THEN 2
            ELSE 1
            END = 1;

    ELSIF pBagian = 'Sales' AND pFilterType = 'DCV All' THEN
        INSERT INTO tmp_processing_rpt (context_id, dcvh_id, no_dcv, tahapan, task_id)
        SELECT vcontextId, r.dcvh_id, r.dcvh_no_dcv, 
            NVL(t.tahapan, r.dcvh_current_step), NVL(t.id,0)
        FROM dcv_request r
        JOIN user_restriction_v res 
            ON res.cust_code = r.dcvh_cust_code 
            AND res.user_name = pDistributor
        LEFT OUTER JOIN wf_task t 
            ON t.no_dcv = r.dcvh_no_dcv
            AND t.bagian = pBagian
            AND t.progress_status = 'WAIT'
        WHERE r.dcvh_status <> 'TERMINATED'
        AND CASE vDivisi WHEN 'ALL' THEN 1
                            WHEN r.dcvh_pc_kategori THEN 1
                            ELSE 0 
                END = 1
       AND r.dcvh_submit_time BETWEEN TRUNC(pPeriodeSubmitStart) AND TRUNC(pPeriodeSubmitEnd+1);

    ELSIF pBagian = 'Sales' THEN
        INSERT INTO tmp_processing_rpt (context_id, dcvh_id, no_dcv, tahapan, task_id)
        SELECT vcontextId, r.dcvh_id, r.dcvh_no_dcv, wf.tahapan, wf.id
        FROM dcv_request r
        JOIN user_restriction_v res 
            ON res.cust_code = r.dcvh_cust_code 
            AND res.user_name = pDistributor
        JOIN wf_task wf 
            ON wf.dcvh_id = r.dcvh_id
            AND wf.task_type = 'Human'
            AND wf.progress_status = 'WAIT'
            AND wf.bagian = 'Sales'
        WHERE r.dcvh_status <> 'TERMINATED'
        AND CASE
            WHEN pFilterType = 'Return Task' AND NVL(wf.return_task,'N') = 'Y' THEN 0
            WHEN pFilterType = 'New Task' AND NVL(wf.return_task,'N') = 'N' THEN 0
            ELSE 1
            END = 0
        AND CASE WHEN pFilterType = 'Return Task' AND NVL(wf.return_task,'N') = 'N' THEN 2
                    ELSE 1
                    END = 1
        AND CASE vDivisi WHEN 'ALL' THEN 1
                            WHEN r.dcvh_pc_kategori THEN 1
                            ELSE 0 
                END = 1
       AND r.dcvh_submit_time BETWEEN TRUNC(pPeriodeSubmitStart) AND TRUNC(pPeriodeSubmitEnd+1);

    ELSIF pBagian IN ('TC','Admin') AND pFilterType = 'DCV All'  THEN

        INSERT INTO tmp_processing_rpt (context_id, dcvh_id, no_dcv, tahapan, task_id)
        SELECT vcontextId, r.dcvh_id, r.dcvh_no_dcv,
            NVL(t.tahapan, r.dcvh_current_step), NVL(t.id,0)
        FROM dcv_request r
        LEFT OUTER JOIN wf_task t 
            ON t.no_dcv = r.dcvh_no_dcv
            AND t.bagian = DECODE(pBagian,'Admin',t.bagian,pBagian)
            AND t.progress_status = 'WAIT'
        WHERE r.dcvh_status <> 'TERMINATED'
        AND dcvh_submit_time BETWEEN TRUNC(pPeriodeSubmitStart) AND TRUNC(pPeriodeSubmitEnd+1)
        AND CASE vDivisi 
            WHEN 'ALL' THEN 1
            WHEN r.dcvh_pc_kategori THEN 1
            ELSE 0 
            END = 1
        AND CASE 
            WHEN pBagian = 'Admin' AND t.bagian <> 'Distributor' THEN 1
            WHEN pBagian = 'TC' THEN 1
            ELSE 0
            END = 1;

    ELSIF pBagian IN ('TC','Admin') THEN

        INSERT INTO tmp_processing_rpt (context_id, dcvh_id, no_dcv, tahapan, task_id)
        SELECT vcontextId, r.dcvh_id, r.dcvh_no_dcv,
            NVL(t.tahapan, r.dcvh_current_step), NVL(t.id,0)
        FROM dcv_request r
        LEFT OUTER JOIN wf_task t 
            ON t.no_dcv = r.dcvh_no_dcv
            AND t.progress_status = 'WAIT'
            AND t.bagian = DECODE(pBagian,'Admin',t.bagian, pBagian)
        WHERE r.dcvh_status <> 'TERMINATED'
        AND dcvh_submit_time BETWEEN TRUNC(pPeriodeSubmitStart) AND TRUNC(pPeriodeSubmitEnd+1)
        AND CASE vDivisi 
            WHEN 'ALL' THEN 1
            WHEN r.dcvh_pc_kategori THEN 1
            ELSE 0 
            END = 1
        AND CASE
            WHEN pFilterType = 'Return Task' AND NVL(t.return_task,'N') = 'Y' THEN 0
            WHEN pFilterType = 'New Task' AND NVL(t.return_task,'N') = 'N' THEN 0
            ELSE 1
            END = 0
        AND CASE 
            WHEN pBagian = 'Admin' AND t.bagian <> 'Distributor' THEN 1
            WHEN pBagian = 'TC' THEN 1
            ELSE 0
            END = 1;

    ELSIF pFilterType = 'DCV All' THEN
        INSERT INTO tmp_processing_rpt (context_id, dcvh_id, no_dcv, tahapan, task_id)
        SELECT vcontextId, r.dcvh_id, r.dcvh_no_dcv, 
            NVL(r.dcvh_current_step, t.tahapan), NVL(t.id,0)
        FROM dcv_request r
        LEFT OUTER JOIN wf_task t 
            ON t.no_dcv = r.dcvh_no_dcv
            AND t.progress_status = 'WAIT'
            AND t.bagian = pBagian
        WHERE r.dcvh_status <> 'TERMINATED'
        AND dcvh_submit_time BETWEEN TRUNC(pPeriodeSubmitStart) AND TRUNC(pPeriodeSubmitEnd+1)
        AND CASE vDivisi 
            WHEN 'ALL' THEN 1
            WHEN r.dcvh_pc_kategori THEN 1
            ELSE 0 
            END = 1;

    ELSE
        INSERT INTO tmp_processing_rpt (context_id, dcvh_id, no_dcv, tahapan, task_id)
        SELECT vcontextId, r.dcvh_id, r.dcvh_no_dcv, wf.tahapan, wf.id
        FROM dcv_request r
        JOIN wf_task wf 
            ON wf.dcvh_id = r.dcvh_id 
            AND wf.progress_status = 'WAIT' 
            AND wf.bagian = pBagian
        WHERE r.dcvh_status <> 'TERMINATED'
        AND dcvh_submit_time BETWEEN TRUNC(pPeriodeSubmitStart) AND TRUNC(pPeriodeSubmitEnd+1)
        AND CASE
            WHEN pFilterType = 'Return Task' AND NVL(wf.return_task,'N') = 'Y' THEN 0
            WHEN pFilterType = 'New Task' AND NVL(wf.return_task,'N') = 'N' THEN 0
            ELSE 1
            END = 0
        AND CASE vDivisi 
            WHEN 'ALL' THEN 1
            WHEN r.dcvh_pc_kategori THEN 1
            ELSE 0 
            END = 1;

    END IF;


    FOR i IN cTmp(vcontextId) LOOP
        numFilter := 0;
        filtermatch := 0;

        IF RTRIM(pNoDcv||pPeriodeSubmit||pCustCode||pNamaCustomer||pRegion||pArea||pLocation||pNoPc||
            pPeriodePcStart||pPeriodePcEnd||pKategoriPc||pTipePc||pDcvValue||pDcvApprValue||
            pDisposisi||pNoSeri||pLastAction||pCurrentAction) IS NULL THEN
            bdel := false;
        ELSE 
            bdel := true;
        END IF;

        IF pNoDcv IS NOT NULL THEN numFilter := numFilter + 1;
            IF i.dcvh_no_dcv LIKE '%'||pNoDcv||'%' THEN filtermatch := filtermatch+1;
            END IF;
        END IF;
        IF pPeriodeSubmit IS NOT NULL THEN numFilter := numFilter + 1;
            IF TO_CHAR(i.dcvh_submit_time,'DD/MM/YYYY HH24:MI:SS') LIKE '%'||pPeriodeSubmit||'%' THEN
                filtermatch := filtermatch+1;
            END IF;
        END IF;
        IF pCustCode IS NOT NULL THEN numFilter := numFilter + 1;
            IF UPPER(i.dcvh_cust_code) LIKE '%'|| UPPER(pCustCode) ||'%' THEN filtermatch := filtermatch+1;
            END IF;
        END IF;
        IF pNamaCustomer IS NOT NULL THEN numFilter := numFilter + 1;
            IF UPPER(i.dcvh_cust_name) LIKE '%'|| UPPER(pNamaCustomer) ||'%' THEN filtermatch := filtermatch+1;
            END IF;
        END IF;
        IF pRegion IS NOT NULL  THEN numFilter := numFilter + 1;
            IF UPPER(i.dcvh_region) LIKE '%'|| UPPER(pRegion) ||'%' THEN filtermatch := filtermatch+1;
            END IF;
        END IF;
        IF pArea IS NOT NULL THEN numFilter := numFilter + 1; 
            IF UPPER(i.dcvh_area) LIKE '%'|| UPPER(pArea) ||'%' THEN filtermatch := filtermatch+1;
            END IF;
        END IF;
        IF pLocation IS NOT NULL THEN numFilter := numFilter + 1; 
            IF UPPER(i.dcvh_location) LIKE '%'|| UPPER(pLocation) ||'%' THEN filtermatch := filtermatch+1;
            END IF;
        END IF;
        IF pNoPc IS NOT NULL THEN numFilter := numFilter + 1; 
            IF UPPER(i.dcvh_no_pc) LIKE '%'|| UPPER(pNoPc) ||'%' THEN filtermatch := filtermatch+1;
            END IF;
        END IF;
        IF pPeriodePcStart IS NOT NULL THEN numFilter := numFilter + 1;
            IF TO_CHAR(i.dcvh_periode_pc_start,'DD/MM/YYYY') LIKE '%'|| pPeriodePcStart ||'%' THEN
                filtermatch := filtermatch+1;
            END IF;
        END IF;
        IF pPeriodePcEnd IS NOT NULL THEN numFilter := numFilter + 1; 
            IF TO_CHAR(i.dcvh_periode_pc_end,'DD/MM/YYYY')  LIKE '%'|| pPeriodePcEnd ||'%' THEN
                filtermatch := filtermatch+1;
            END IF;
        END IF;
        IF pKategoriPc IS NOT NULL  THEN numFilter := numFilter + 1; 
            IF UPPER(i.dcvh_pc_kategori) LIKE '%'|| UPPER(pKategoriPc) ||'%' THEN
                 filtermatch := filtermatch+1;
            END IF;
        END IF;
        IF pTipePc IS NOT NULL  THEN numFilter := numFilter + 1;
            IF UPPER(i.dcvh_pc_tipe) LIKE '%'|| UPPER(pTipePc) ||'%' THEN
                 filtermatch := filtermatch+1;
            END IF;
        END IF;
        IF pDcvValue IS NOT NULL THEN numFilter := numFilter + 1; 
            IF TO_CHAR(i.dcvh_value) LIKE '%'|| pDcvValue ||'%' THEN
                 filtermatch := filtermatch+1;
            END IF;
        END IF;
        IF pDcvApprValue IS NOT NULL THEN numFilter := numFilter + 1; 
            IF TO_CHAR(i.dcvh_appv_value) LIKE '%'|| pDcvApprValue ||'%' THEN
                 filtermatch := filtermatch+1;
            END IF;
        END IF;
        IF pDisposisi IS NOT NULL THEN numFilter := numFilter + 1;
            IF UPPER(i.dcvh_proses_bayar) LIKE '%'|| UPPER(pDisposisi) ||'%' THEN
                 filtermatch := filtermatch+1;
            END IF;
        END IF;
        IF pNoSeri IS NOT NULL THEN
            numFilter := numFilter + 1;
            BEGIN
                SELECT doc_no INTO vdocno FROM dcv_documents WHERE dcvh_id = i.dcvh_id AND doc_type = 'RK';
                IF UPPER(vdocno) LIKE '%'||UPPER(pNoSeri)||'%' THEN filtermatch := filtermatch+1;
                END IF;
            EXCEPTION WHEN NO_DATA_FOUND THEN filtermatch := filtermatch+1;
            END;
        END IF;

        IF pLastAction IS NOT NULL THEN numFilter := numFilter + 1;
            IF UPPER(i.dcvh_last_step) LIKE '%'|| UPPER(pLastAction) ||'%' THEN
                 filtermatch := filtermatch+1;
            END IF;
        END IF;

        IF pCurrentAction IS NOT NULL THEN numFilter := numFilter + 1;
            vFilterText := UPPER(REPLACE(pCurrentAction,' ','%'));
            IF UPPER(i.tahapan) LIKE '%'|| vFilterText ||'%' THEN
                 filtermatch := filtermatch+1;
            END IF;
        END IF;

        IF (numFilter <> filtermatch) THEN
          DELETE tmp_processing_rpt WHERE context_id = vContextId AND dcvh_id = i.dcvh_id
          AND task_id = i.task_id;
        END IF;

    END LOOP;

    vSelect := 'SELECT dcv.dcvh_company' ||
                    ', dcv.dcvh_cust_code' ||
                    ', dcv.dcvh_cust_name' ||
                    ', dcv.dcvh_region' ||
                    ', dcv.dcvh_area' ||
                    ', dcv.dcvh_location' ||
                    ', dcv.dcvh_no_dcv' ||
                    ', dcv.dcvh_submit_time' ||
                    ', dcv.dcvh_no_pc' ||
                    ', dcv.dcvh_key_pc' ||
                    ', dcv.dcvh_periode_pc_start' ||
                    ', dcv.dcvh_periode_pc_end' ||
                    ', dcv.dcvh_pc_tipe' ||
                    ', dcv.dcvh_pc_kategori' ||
                    ', dcv.dcvh_value' ||
                    ', dcv.dcvh_appv_value' ||
                    ', dcv.dcvh_status as dcvh_dcv_status' ||
                    ', dtl.dcvl_prod_class_desc' ||
                    ', dtl.dcvl_prod_brand_desc' ||
                    ', dtl.dcvl_prod_ext_desc' ||
                    ', dtl.dcvl_qty' ||
                    ', dtl.dcvl_uom' ||
                    ', dtl.dcvl_val_exc' ||
                    ', dtl.dcvl_appv_val_exc' ||
                    ', dtl.dcvl_selisih' ||
                    ', dtl.dcvl_catatan_tc' ||
                    ', dtl.dcvl_ppn_val' ||
                    ', dtl.dcvl_pph_val' ||
                    ', dtl.dcvl_total_val_appv_inc' ||
                    ', tc.prod_code' ||
                    ', tc.prod_name' ||
                    ', tc.qty' ||
                    ', tc.harga_satuan' ||
                    ', tc.nilai_total' ||
                    ', tc.notes ' ||
                    'FROM dcv_request dcv ' ||
                    'INNER JOIN tmp_processing_rpt t ON t.dcvh_id = dcv.dcvh_id AND t.context_id = '''||vContextId||''' '||
                    'LEFT OUTER JOIN request_dtl dtl on dcv.dcvh_id = dtl.dcvh_id ' ||
                    'LEFT OUTER JOIN tc_approval tc on tc.dcvl_id = dtl.dcvl_id ';


    IF pSortBy1 IS NOT NULL THEN 
        vOrder := ', '|| pSortBy1 || ' ' || pOrder1 || ',';
    END IF;
    IF pSortBy2 IS NOT NULL THEN 
        vOrder := TRIM(TRAILING ',' FROM TRIM(vOrder)) || ', ' || pSortBy2 || ' ' || pOrder2 ||',';
    END IF;
    IF pSortBy3 IS NOT NULL THEN 
        vOrder := TRIM(TRAILING ',' FROM TRIM(vOrder)) || ', ' || pSortBy3 || ' ' || pOrder3 ||',';
    END IF;
    IF pSortBy4 IS NOT NULL THEN 
        vOrder := TRIM(TRAILING ',' FROM TRIM(vOrder)) || ', ' || pSortBy4 || ' ' || pOrder4 ||',';
    END IF;
    IF pSortBy5 IS NOT NULL THEN 
        vOrder := TRIM(TRAILING ',' FROM TRIM(vOrder)) || ', ' || pSortBy5 || ' ' || pOrder5 ||',';
    END IF;
    IF pSortBy6 IS NOT NULL THEN 
        vOrder := TRIM(TRAILING ',' FROM TRIM(vOrder)) || ', ' || pSortBy6 || ' ' || pOrder6 ||',';
    END IF;
    IF pSortBy7 IS NOT NULL THEN 
        vOrder := TRIM(TRAILING ',' FROM TRIM(vOrder)) || ', ' || pSortBy7 || ' ' || pOrder7 ||',';
    END IF;
    IF pSortBy8 IS NOT NULL THEN 
        vOrder := TRIM(TRAILING ',' FROM TRIM(vOrder)) || ', ' || pSortBy8 || ' ' || pOrder8 ||',';
    END IF;
    IF pSortBy9 IS NOT NULL THEN 
        vOrder := TRIM(TRAILING ',' FROM TRIM(vOrder)) || ', ' || pSortBy9 || ' ' || pOrder9 ||',';
    END IF;
    IF pSortBy10 IS NOT NULL THEN 
        vOrder := TRIM(TRAILING ',' FROM TRIM(vOrder)) || ', ' || pSortBy10 || ' ' || pOrder10 ||',';
    END IF;
    IF RTRIM(vOrder) IS NULL THEN
        vOrder := ' ORDER BY dcv.dcvh_no_dcv ';
    ELSE
        vOrder := TRIM(LEADING ',' FROM TRIM(vOrder));
        vOrder := ' ORDER BY ' || TRIM(TRAILING ',' FROM TRIM(vOrder));
    END IF;
    dbms_output.put_line(vSelect||vOrder);
    OPEN vList FOR vSelect||vOrder;

    pList := vList;
EXCEPTION WHEN NO_DATA_FOUND THEN 
    pList := vList;

END download_dcv;

FUNCTION get_sla_payment (pPeriode NUMBER
                                   ,pDivisi VARCHAR2    -- food nonfood
                                   ,pCust1 VARCHAR
                                   ,pCust2 VARCHAR2
                                    ,pRegion VARCHAR2
                                    ,pArea VARCHAR2
                                    ,pLocation VARCHAR2
                                    ,pFormula VARCHAR2
                                   )
RETURN sla_typ_tab PIPELINED
AS
    CURSOR ctelat IS SELECT *
                    FROM dcv_overdue do
                    WHERE do.remain_pymt = 0 
                    AND cust_code BETWEEN NVL(pCust1,'A') AND NVL(pCust2,'zzzzzzz')
                    AND do.dcv_type = DECODE(pDivisi,'All',do.dcv_type,pDivisi)
                    AND FLOOR(do.last_pymt_dt/100) = pPeriode;

    CURSOR cwf (pdcvid NUMBER) IS SELECT t.id, t.assign_time, t.bagian, t.nodecode, t.tahapan, t.process_time,
                        TRUNC(util_pkg.next_working_day(t.assign_time, n.sla1)) target_selesai
                FROM wf_task t
                JOIN wf_node n ON n.nodecode = t.nodecode
                WHERE t.dcvh_id = pdcvid AND t.task_type = 'Human'
                AND TRUNC(NVL(t.process_time,SYSDATE)) > TRUNC(util_pkg.next_working_day(t.assign_time, n.sla1))
                ORDER BY t.id;

    vSla     sla_typ ;
    vDendaHarian NUMBER;
    vDistOD NUMBER := 0;
    vFocusOD NUMBER := 0;
    vSalesOD NUMBER(9,2) := 0;
    vTcOD NUMBER(9,2) := 0;
    vTaxOD NUMBER(9,2) := 0;
    vPromoOD NUMBER(9,2) := 0;
    vApOD NUMBER(9,2) := 0;
    dayBetween NUMBER;
    vLastWfDt DATE;
    vTargetPaymentDt NUMBER;
    vSlaBayar NUMBER;
BEGIN
    BEGIN
        SELECT sla1 INTO vSlaBayar FROM wf_node WHERE nodecode = 'AP2';
    EXCEPTION WHEN NO_DATA_FOUND THEN vSlaBayar := 2;
    END;

    FOR i IN ctelat LOOP

        IF NVL(pRegion,i.dcv_region) <> i.dcv_region THEN CONTINUE; END IF; 
        IF NVL(pArea,i.dcv_area) <> i.dcv_area THEN CONTINUE; END IF; 
        IF NVL(pLocation,i.dcv_location) <> i.dcv_location THEN CONTINUE; END IF; 

        vDistOD := 0;
        vFocusOD := 0;
        vSalesOD := 0;
        vTcOD := 0;
        vTaxOD := 0;
        vPromoOD := 0;
        vApOD := 0;

        FOR j IN cwf(i.dcvh_id) 
--        FOR j IN (SELECT * FROM wf_task t
--                WHERE t.dcvh_id = i.dcvh_id AND t.task_type = 'Human'
--                AND TRUNC(NVL(t.process_time,SYSDATE)) > TRUNC(t.target_selesai)
--                ORDER BY t.id) 
        LOOP
            vLastWfDt := j.process_time;     -- unt tgl proses terakhir tercatat di wf_task
            dayBetween := util_pkg.working_days_between( j.target_selesai, NVL(j.process_time,SYSDATE));
            IF j.bagian = 'Distributor' THEN
                vDistOD := vDistOD + dayBetween;
            ELSIF j.bagian = 'Sales' THEN
                vSalesOD := vSalesOD + dayBetween;
                vFocusOD := vFocusOD + dayBetween;
            ELSIF j.bagian = 'TC' THEN
                vTcOD := vTcOD + dayBetween;
                vFocusOD := vFocusOD + dayBetween;
            ELSIF j.bagian = 'Tax' THEN
                vTaxOD := vTaxOD + dayBetween;
                vFocusOD := vFocusOD + dayBetween;
            ELSIF j.bagian = 'Promo' THEN
                vPromoOD := vPromoOD + dayBetween;
                vFocusOD := vFocusOD + dayBetween;
            ELSIF j.bagian = 'AP' THEN
            dbms_output.put_line(dayBetween);
                vApOD := vApOD + dayBetween;
                vFocusOD := vFocusOD + dayBetween;
            END IF;
        END LOOP;

        -- cek riwayat pembayaran     
        dbms_output.put_line('vLastwfdt '||vLastWfDt || ' vslabayar '|| vslabayar);
        vTargetPaymentDt := TO_NUMBER(TO_CHAR(util_pkg.next_working_day(vLastWfDt, vSlaBayar),'YYYYMMDD'));
        IF i.last_Pymt_dt > vTargetPaymentDt THEN
            dayBetween := util_pkg.working_days_between( TO_DATE(vTargetPaymentDt,'YYYYMMDD'), TO_DATE(i.last_pymt_dt,'YYYYMMDD'));
            vApOD := vApOD + dayBetween;
            dbms_output.put_line('ah : ' || vapod ||' - ' || dayBetween);
            vFocusOD := vFocusOD + dayBetween;
        END IF;

        IF vDistOD + vFocusOD = 0 THEN CONTINUE;
        END IF;


        vDendaHarian := vpctdenda * i.dcv_value;

        vSla.periode := pPeriode;
        vSla.custcode := i.cust_code;
        vSla.custname := i.cust_name;
        vSla.no_dcv := i.no_dcv;
        vSla.tgl_dcv := i.tgl_dcv;
        vSla.due_dt := i.due_dt;
        vSla.last_pymt := TO_DATE(i.last_pymt_dt,'YYYYMMDD');
        vSla.od_num := TO_DATE(i.last_pymt_dt,'YYYYMMDD') - TRUNC(i.due_dt);
        vSla.sisa_bayar := i.remain_pymt;
        vSla.nilai_denda := vDendaHarian * vSla.od_num;

        vSla.distr_hari := vDistOD;
        vSla.distr_denda := vDistOD * vDendaHarian;

        vSla.focus_hari := vFocusOD;
        vSla.sales_hari := vSalesOD;
        vSla.tc_hari := vTcOD;
        vSla.tax_hari := vTaxOD;
        vSla.promo_hari := vPromoOD;
        vSla.ap_hari := vApOD;

        IF pFormula = 'Distributor' THEN

            vSla.focus_denda := vSla.nilai_denda - vSla.distr_denda;
            vSla.sales_denda := vSalesOD/vFocusOD * vSla.focus_denda;
            vSla.tc_denda := vTcOD/vFocusOD * vSla.focus_denda;
            vSla.tax_denda := vTaxOD/vFocusOD * vSla.focus_denda;
            vSla.promo_denda := vPromoOD/vFocusOD * vSla.focus_denda;
            vSla.ap_denda := vApOD/vFocusOD * vSla.focus_denda;
        ELSE
            vSla.focus_denda := vFocusOD * vDendaHarian;
            vSla.sales_denda := vSalesOD* vDendaHarian;
            vSla.tc_denda := vTcOD * vDendaHarian;
            vSla.tax_denda := vTaxOD * vDendaHarian;
            vSla.promo_denda := vPromoOD * vDendaHarian;
            vSla.ap_denda := vApOD * vDendaHarian;
       END IF;

       PIPE ROW (vSla);

    END LOOP;
    RETURN;
END get_sla_payment;

FUNCTION get_sla_late (pPeriode NUMBER
                                ,pDivisi VARCHAR2    -- food nonfood
                                   ,pCust1 VARCHAR
                                   ,pCust2 VARCHAR2
                                    ,pRegion VARCHAR2
                                    ,pArea VARCHAR2
                                    ,pLocation VARCHAR2
                                    ,pFormula VARCHAR2
)
RETURN sla_typ_tab PIPELINED
AS
    CURSOR cDcv IS  
            SELECT do.no_dcv, do.cust_code, do.dcv_value, do.cust_name, do.tgl_dcv,
                    do.due_dt, do.last_pymt_dt, do.dcv_region, do.dcv_area, do.dcv_location
            FROM dcv_overdue do
            WHERE do.remain_pymt = 0
            AND cust_code BETWEEN NVL(pCust1,'A') AND NVL(pCust2,'zzzzzzz')
            AND do.dcv_type = DECODE(pDivisi,'All',do.dcv_type,pDivisi)
            AND TO_CHAR(do.tgl_dcv,'YYYYMM') <= pPeriode
            AND FLOOR(last_pymt_dt/100) >= pPeriode;

    CURSOR ctelat (vDcv VARCHAR2) IS
            WITH 
            qry1 AS(
                SELECT w.bagian, w.process_time, util_pkg.next_working_day(w.assign_time, n.sla1) target_selesai
                FROM wf_task w
                JOIN wf_node n ON n.nodecode = w.nodecode
                WHERE w.no_dcv = vDcv
                AND w.process_time > w.target_selesai
                AND TRUNC(NVL(w.process_time,SYSDATE)) > TRUNC(util_pkg.next_working_day(w.assign_time, n.sla1))
            )
            SELECT bagian, count(pp.column_value) jml
            FROM qry1, table(pipedqry.get_workday_between(qry1.target_selesai+1, qry1.process_time)) pp
            WHERE to_char(pp.column_value,'YYYYMM') = pPeriode
            GROUP BY bagian;

    vSla     sla_typ ;
    vDendaHarian NUMBER;
    vDistOD NUMBER := 0;
    vFocusOD NUMBER := 0;
    vSalesOD NUMBER(9,2) := 0;
    vTcOD NUMBER(9,2) := 0;
    vTaxOD NUMBER(9,2) := 0;
    vPromoOD NUMBER(9,2) := 0;
    vApOD NUMBER(9,2) := 0;
    dayBetween NUMBER;
    vLastWfDt DATE;
    vTargetPaymentDt NUMBER;
    vSlaBayar NUMBER;

BEGIN
    BEGIN
        SELECT sla1 INTO vSlaBayar FROM wf_node WHERE nodecode = 'AP2';
    EXCEPTION WHEN NO_DATA_FOUND THEN vSlaBayar := 2;
    END;

    FOR i IN cDcv LOOP
        IF NVL(pRegion,i.dcv_region) <> i.dcv_region THEN CONTINUE; END IF; 
        IF NVL(pArea,i.dcv_area) <> i.dcv_area THEN CONTINUE; END IF; 
        IF NVL(pLocation,i.dcv_location) <> i.dcv_location THEN CONTINUE; END IF; 

        vDistOD := 0;
        vFocusOD := 0;
        vSalesOD := 0;
        vTcOD := 0;
        vTaxOD := 0;
        vPromoOD := 0;
        vApOD := 0;

        FOR j IN cTelat (i.no_dcv) LOOP
--            vLastWfDt := j.process_time;     -- unt tgl proses terakhir tercatat di wf_task
            IF j.bagian = 'Distributor' THEN
                vDistOD := vDistOD + j.jml;
            ELSIF j.bagian = 'Sales' THEN
                vSalesOD := vSalesOD + j.jml;
                vFocusOD := vFocusOD + j.jml;
            ELSIF j.bagian = 'TC' THEN
                vTcOD := vTcOD + j.jml;
                vFocusOD := vFocusOD + j.jml;
            ELSIF j.bagian = 'Tax' THEN
                vTaxOD := vTaxOD + j.jml;
                vFocusOD := vFocusOD + j.jml;
            ELSIF j.bagian = 'Promo' THEN
                vPromoOD := vPromoOD + j.jml;
                vFocusOD := vFocusOD + j.jml;
            ELSIF j.bagian = 'AP' THEN
                vApOD := vApOD + j.jml;
                vFocusOD := vFocusOD + j.jml;
            END IF;

        END LOOP;

        -- cek riwayat pembayaran        
        SELECT MAX(process_time) INTO vLastWfDt FROM wf_task WHERE no_dcv = i.no_dcv;
        vTargetPaymentDt := TO_NUMBER(TO_CHAR(util_pkg.next_working_day(vLastWfDt, vSlaBayar),'YYYYMMDD'));
        IF i.last_Pymt_dt > vTargetPaymentDt THEN
            SELECT COUNT(*) INTO dayBetween
            FROM table(pipedqry.get_workday_between(TO_DATE(vTargetPaymentDt,'YYYYMMDD'), TO_DATE(i.last_pymt_dt,'YYYYMMDD')))
            WHERE to_char(column_value,'YYYYMM') = pPeriode;

            vApOD := vApOD + dayBetween;
            vFocusOD := vFocusOD + dayBetween;
        END IF;

        IF vDistOD + vFocusOD = 0 THEN CONTINUE;
        END IF;

        vDendaHarian := vpctdenda * i.dcv_value;

        vSla.periode := pPeriode;
        vSla.custcode := i.cust_code;
        vSla.custname := i.cust_name;
        vSla.no_dcv := i.no_dcv;
        vSla.tgl_dcv := i.tgl_dcv;
        vSla.due_dt := i.due_dt;
        vSla.last_pymt := TO_DATE(i.last_pymt_dt,'YYYYMMDD');
        vSla.od_num := TO_DATE(i.last_pymt_dt,'YYYYMMDD') - TRUNC(i.due_dt);
        vSla.sisa_bayar := 0;
        vSla.nilai_denda := vDendaHarian * vSla.od_num;

        vSla.distr_hari := vDistOD;
        vSla.distr_denda := vDistOD * vDendaHarian;

        vSla.focus_hari := vFocusOD;
        vSla.sales_hari := vSalesOD;
        vSla.tc_hari := vTcOD;
        vSla.tax_hari := vTaxOD;
        vSla.promo_hari := vPromoOD;
        vSla.ap_hari := vApOD;

        IF pFormula = 'Distributor' THEN

            vSla.focus_denda := vSla.nilai_denda - vSla.distr_denda;
            vSla.sales_denda := vSalesOD/vFocusOD * vSla.focus_denda;
            vSla.tc_denda := vTcOD/vFocusOD * vSla.focus_denda;
            vSla.tax_denda := vTaxOD/vFocusOD * vSla.focus_denda;
            vSla.promo_denda := vPromoOD/vFocusOD * vSla.focus_denda;
            vSla.ap_denda := vApOD/vFocusOD * vSla.focus_denda;
        ELSE
            vSla.focus_denda := vFocusOD * vDendaHarian;
            vSla.sales_denda := vSalesOD* vDendaHarian;
            vSla.tc_denda := vTcOD * vDendaHarian;
            vSla.tax_denda := vTaxOD * vDendaHarian;
            vSla.promo_denda := vPromoOD * vDendaHarian;
            vSla.ap_denda := vApOD * vDendaHarian;
        END IF;

        PIPE ROW (vSla);

    END LOOP;
    RETURN;
END get_sla_late;

FUNCTION get_sla_rpt ( pPeriodType VARCHAR2  -- pelunasan/kterlambatan
                            ,pPeriode NUMBER     -- yyyymm
                            ,pDivisi VARCHAR2    -- food nonfood
                            ,pCust1 VARCHAR
                            ,pCust2 VARCHAR2
                            ,pRegion VARCHAR2
                            ,pArea VARCHAR2
                            ,pLocation VARCHAR2
                            ,pFormula VARCHAR2
                        ) 
RETURN sla_typ_tab PIPELINED
AS
  c1 SYS_REFCURSOR;
  vSla     sla_typ ;
BEGIN

    BEGIN
      SELECT value INTO vpctdenda FROM lookup_code
      WHERE title = 'SLA.FINEPCT';
    EXCEPTION WHEN OTHERS THEN vpctdenda := 0.001;
    END;

    IF pPeriodType = 'Pelunasan' THEN
        OPEN c1 FOR
            SELECT * FROM TABLE(get_sla_payment (pPeriode
                                                        ,pDivisi 
                                                       ,pCust1 
                                                       ,pCust2 
                                                        ,pRegion 
                                                        ,pArea 
                                                        ,pLocation
                                                        ,pFormula));

    ELSE
        OPEN c1 FOR
            SELECT * FROM TABLE(get_sla_late (pPeriode
                                                        ,pDivisi 
                                                       ,pCust1 
                                                       ,pCust2 
                                                        ,pRegion 
                                                        ,pArea 
                                                        ,pLocation
                                                        ,pFormula));
    END IF;

    LOOP
        FETCH c1 INTO vSla;
        EXIT WHEN c1%NOTFOUND;
        PIPE ROW (vSla);
    END LOOP;

END get_sla_rpt;

END RPT_PKG;
/
