CREATE OR REPLACE PACKAGE            "WF_PKG" AS
    gvUser VARCHAR2(30);
    gvBagian VARCHAR2(20);
PROCEDURE post_action (pTaskId IN NUMBER, pActionId IN NUMBER, pUser IN VARCHAR2,
                      pNote IN VARCHAR2, pResponseCode OUT NUMBER, pResponseMsg OUT VARCHAR2) ;

PROCEDURE qry_open_batch_document (pBagian VARCHAR2, pNodeCode VARCHAR2, tList OUT SYS_REFCURSOR);
PROCEDURE qry_hist_batch_document (pBagian VARCHAR2, tgl DATE, pNodeCode VARCHAR2, 
                        pilihan NUMBER, tList OUT SYS_REFCURSOR);

--PROCEDURE show_action_list (pDcvNo VARCHAR2, pUser IN VARCHAR2, PLIST OUT SYS_REFCURSOR);
PROCEDURE show_action_list (pDcvNo VARCHAR2, pUser IN VARCHAR2, pBagian IN VARCHAR2, PLIST OUT SYS_REFCURSOR) ;
--PROCEDURE hitung_sla;

END WF_PKG;


/


CREATE OR REPLACE PACKAGE BODY            "WF_PKG" AS
   
--bvLockedTask wf_task%ROWTYPE;
bvDcvRequest dcv_request%ROWTYPE;
vResponseCode NUMBER;
vResponseMsg VARCHAR2(500);

FUNCTION newTask (vNextNode wf_node%ROWTYPE, pNoDcv VARCHAR2, pDcvhId NUMBER, pPrevTask NUMBER) 
RETURN NUMBER AS
    vTargetSelesai DATE;
    vSla NUMBER;
    newId NUMBER;
    vReturn VARCHAR2(20);
BEGIN
    BEGIN
        SELECT id INTO newId
        FROM wf_task
        WHERE no_dcv = pNoDcv
        AND nodecode = vNextNode.nodecode
        AND progress_status = 'WAIT'
        AND bagian = vNextNode.bagian;

    EXCEPTION WHEN NO_DATA_FOUND THEN        

        INSERT INTO wf_task (id, no_dcv, dcvh_id, task_type, assign_time, bagian, progress_status, nodecode,
                        prev_task, tahapan, execscript, prime_route,  target_selesai)
            VALUES (dcv_seq.nextval, pNoDcv, pDcvhId, vNextNode.nodetype, SYSDATE, vNextNode.bagian, 'WAIT',
            vNextNode.nodecode, pPrevTask, vNextNode.node_desc, vNextNode.execscript,
            NVL(vNextNode.prime_route,'Y'),
            TRUNC(util_pkg.next_working_day(SYSDATE,vNextNode.sla1)))
            RETURNING id into newId;
    END;
    RETURN (newId);

END newTask;

--FUNCTION post_merge (pNextNode wf_node%ROWTYPE)
--    RETURN NUMBER AS
--        vcnt NUMBER;
--        newId NUMBER;
--        vMergeTask wf_task%ROWTYPE;
--        vNextNode wf_node%ROWTYPE;
--        vTargetSelesai NUMBER;
--BEGIN
--    -- cari task yg M1 jika sudah ada
--    SELECT t.* INTO vMergeTask
--      FROM wf_task t
--      WHERE t.no_dcv = bvDcvRequest.dcvh_no_dcv
--      AND t.nodecode = pNextNode.nodecode
--      AND t.progress_status = 'WAIT' FOR UPDATE;
----dbms_output.put_line('Sisa rotue '||vMergeTask.decision);
--    UPDATE wf_task SET
--        decision = decision -1,
--        progress_status = DECODE(decision, 1, 'DONE', 'WAIT'),
--        process_time = SYSDATE,
--        process_by = 'SYSTEM'
--      WHERE id = vMergeTask.id
--      RETURNING decision INTO vcnt;
--
--    IF vcnt = 0 THEN       -- merge sudah komplit
--
--        --cek node selanjutnya apa
--        SELECT n.* INTO vNextNode
--        FROM wf_node n
--        WHERE n.nodecode = (SELECT o.refnode FROM wf_route o
--                          WHERE o.node_id = pNextNode.nodecode);
--
--       newId := newTask (vNextNode, bvDcvRequest.dcvh_no_dcv, bvDcvRequest.dcvh_id,  vMergeTask.id); 
--
--       UPDATE wf_task SET
--                decision = vcnt,
--                progress_status = 'DONE',
--                next_task = newId,
--                next_node = vNextNode.nodecode,
--                process_by = 'SYSTEM',
--                process_time = SYSDATE
--            WHERE id = vMergeTask.id;
--        RETURN (newId);
--
--      ELSE
--        RETURN (vMergeTask.id);
--      END IF;
--
--    EXCEPTION WHEN NO_DATA_FOUND THEN
--        INSERT INTO wf_task (id, no_dcv, task_type, bagian, assign_time, progress_status, nodecode, decision,
--                target_selesai, dcvh_id)
--                VALUES (dcv_seq.nextval, bvDcvRequest.dcvh_no_dcv, pNextNode.nodetype, pNextNode.bagian,
--                SYSDATE, 'WAIT', pNextNode.nodecode, pNextNode.merge_count-1, TRUNC(SYSDATE), bvDcvRequest.dcvh_id)
--        RETURNING id INTO newId;
--        RETURN (newId);
--END post_merge;


FUNCTION post_action (pTask_id NUMBER, pAction_id NUMBER, pPesan VARCHAR2) 
  RETURN NUMBER AS
    CURSOR cSplit(thenode VARCHAR2) IS
            SELECT * FROM wf_route WHERE node_id = thenode;
    newTaskId NUMBER;
    vTask wf_task%ROWTYPE;
    vLockedTask wf_task%ROWTYPE;
    vOption wf_route%ROWTYPE;
    vNextNode wf_node%ROWTYPE;
    vSplitNode wf_node%ROWTYPE;
    vTargetSelesai NUMBER;
    vscript VARCHAR2(200);
    vRoute NUMBER;
--    vSortTag VARCHAR2(1);
    exec_res NUMBER;
    post_script_error exception;
    row_locked exception;
    pragma   exception_init(row_locked, -54); 

BEGIN

    -- retrieve & lock current dcv and task
    SELECT t.* INTO vLockedTask
    FROM wf_task t
    WHERE t.id = pTask_id FOR UPDATE NOWAIT;

    IF vLockedTask.task_type = 'Script' THEN
            vscript := 'Begin :a := '|| vLockedTask.execscript || '(:id); End;';
            EXECUTE IMMEDIATE vscript USING OUT vRoute, pTask_id;
    ELSE
      vRoute := pAction_id;
    END IF;

    SELECT * INTO vOption
    FROM wf_route
    WHERE node_id = vLockedTask.nodecode
    AND pilihan = vRoute;

    -- retrieve option & next node, kecuali STOP
        SELECT n.* INTO vNextNode
        FROM wf_node n
        WHERE nodecode = vOption.refnode;

    -- create new task based on next node type
    IF vNextNode.nodetype = 'End' THEN NULL;  -- jika stop do nothing
        newTaskId := 0;
        IF NVL(vLockedTask.prime_route,'Y') = 'Y' THEN
                UPDATE dcv_request
                SET dcvh_current_step = '',
                    dcvh_last_step = vOption.description ||' - '||gvBagian,
                    dcvh_status = 'END',
                    modified_dt = SYSDATE,
                    modified_by = gvUser
                WHERE dcvh_id = bvDcvRequest.dcvh_id;
        END IF;

    ELSIF vNextNode.nodetype = 'Split' THEN
--dbms_output.put_line('Harus split disini node: '||vNextNode.nodecode);
        FOR i IN cSplit(vNextNode.nodecode) LOOP
            SELECT * INTO vSplitNode FROM wf_node WHERE nodecode = i.refnode;
--            IF (i.return_task = 'N') OR (vSplitNode.prime_route = 'Y') THEN
--                IF i.refnode IN ('D3','TC3') THEN vSortTag := 'B';
--                ELSIF i.refnode IN ('TC4','AP1','AP2','AP3','AP4','AR1') THEN vSortTag := 'C';
--                ELSE vSortTag := 'A';
--                END IF;
--            END IF;

            newTaskId := newTask (vSplitNode, bvDcvRequest.dcvh_no_dcv, bvDcvRequest.dcvh_id, pTask_id); 

            IF vSplitNode.prime_route = 'Y' THEN
                    UPDATE dcv_request
                        SET dcvh_current_step = DECODE(vSplitNode.nodetype,'Script',dcvh_current_step, vSplitNode.node_desc),
                            dcvh_last_step = DECODE(vLockedTask.task_type,'Script',dcvh_last_step,vOption.description ||' - '||gvBagian),
                            dcvh_status = 'ON-PROGRESS',
                            modified_dt = SYSDATE,
                            modified_by = gvUser
                        WHERE dcvh_id = bvDcvRequest.dcvh_id;
            END IF;

        END LOOP;

--    ELSIF vNextNode.nodetype = 'Merge' THEN
--       newTaskId := post_merge (vNextNode);

    ELSE
        dbms_output.put_line('Akan newTask');
        /* untuk kepentingan report history workflow */
--        IF vNextNode.nodecode IN ('D3','TC3') THEN vSortTag := 'B';
--        ELSIF vNextNode.nodecode IN ('TC4','AP1','AP2','AP3','AP4','AR1') THEN vSortTag := 'C';
--        ELSE vSortTag := 'A';
--        END IF;
        UPDATE wf_task SET progress_status = 'DONE' WHERE id = vLockedTask.id;

        newTaskId := newTask (vNextNode, bvDcvRequest.dcvh_no_dcv, bvDcvRequest.dcvh_id, pTask_id); 
        dbms_output.put_line('New Task: '||newTaskid);
        dbms_output.put_line('update return task: '||vOption.return_task);
        UPDATE wf_task SET return_task = vOption.return_task WHERE id = newTaskId;

        IF vLockedTask.prime_route = 'Y' THEN
            UPDATE dcv_request
                SET dcvh_current_step = DECODE(vNextNode.nodetype,'Script',dcvh_current_step, vNextNode.node_desc),
                    dcvh_last_step = DECODE(vLockedTask.task_type,'Script',dcvh_last_step,vOption.description ||' - '||gvBagian),
                    dcvh_status = 'ON-PROGRESS',
                    modified_dt = SYSDATE,
                    modified_by = gvUser
                WHERE dcvh_id = bvDcvRequest.dcvh_id;
            SELECT * INTO bvDcvRequest FROM dcv_request WHERE dcvh_id = bvDcvRequest.dcvh_id;
        END IF;
    END IF;

    UPDATE wf_task SET
        decision = vRoute,
        note = pPesan,
        progress_status = 'DONE',
        next_task = DECODE(vNextNode.nodetype,'Split','','End','',newTaskId),
        next_node = DECODE(vNextNode.nodetype,'Split','','End','',vNextNode.nodecode),
        tahapan = vOption.description || ' - '||gvBagian,
        process_by = gvUser,
        process_time = SYSDATE
    WHERE id = vLockedTask.id;

    IF vOption.post_script IS NOT NULL THEN
--            vscript := 'Begin :a := '|| vOption.post_script || '(:id); End;';
--            EXECUTE IMMEDIATE vscript USING OUT exec_res, vLockedTask.id;

        vscript := 'Begin :a := '|| vOption.post_script || '(:id); End;';
        EXECUTE IMMEDIATE vscript USING OUT vResponseCode, IN vLockedTask.id ;
        IF vResponseCode <0 THEN
            raise post_script_error;
        END IF;

    END IF;

    IF vNextNode.nodetype = 'Script' THEN
--        SELECT * INTO vLockedTask FROM wf_task WHERE id = newTaskId;
        newTaskId := post_action (newTaskId, null, '');--, pUser);
    ELSIF vNextNode.nodetype = 'End' THEN 
        newTaskId := 0;
    END IF;
  --  COMMIT;
    RETURN (newTaskId);

EXCEPTION 
WHEN row_locked THEN
dbms_output.put_line('DCV tersebut sedang di-update orang lain');
    RETURN (-1);
WHEN post_script_error THEN RETURN (-2);
END post_action;

PROCEDURE post_action (pTaskId IN NUMBER, pActionId IN NUMBER, pUser IN VARCHAR2,
                      pNote IN VARCHAR2, pResponseCode OUT NUMBER, pResponseMsg OUT VARCHAR2) AS
   vDcvId NUMBER;
   vDeptId VARCHAR2(25);
   vTask wf_task%ROWTYPE;
   vRoute wf_route%ROWTYPE;
   vDcv dcv_request%ROWTYPE;
   vErrMsg VARCHAR2 (100);
   vNewTask NUMBER;
   vScript VARCHAR2(500);
   empty_note exception;
   no_open_task exception;
   invalid_validation exception;
   pragma   exception_init(empty_note, -20101); 

BEGIN
    vErrMsg := 'User tidak ditemukan';
    gvUser := pUser;
    SELECT user_type INTO gvBagian
    FROM user_access
    WHERE user_name = pUser;

    SELECT * INTO vTask FROM wf_task WHERE id = pTaskId;
    IF (vTask.task_type <> 'Human') OR (vTask.progress_status <> 'WAIT') THEN
        vErrMsg := 'Task tidak ditemukan';
        raise no_open_task;
    END IF;

    vErrMsg := 'Validate';

    SELECT * INTO vRoute FROM wf_route WHERE node_id = vTask.nodecode AND pilihan = pActionId;
    IF vRoute.validate_script IS NOT NULL THEN
    dbms_output.put_line(vRoute.validate_script);
        vscript := 'Begin '|| vRoute.validate_script || '(:nodcv, :pcode, :pmsg); End;';
        EXECUTE IMMEDIATE vscript USING IN vTask.no_dcv, OUT vResponseCode, OUT vResponseMsg;
    dbms_output.put_line(vResponseMsg);
        IF vResponseCode <0 THEN
        dbms_output.put_line(vscript);
            vErrMsg := vResponseMsg;
            raise invalid_validation;
        END IF;
    END IF;

    vErrMsg := 'DCV '||vTask.no_dcv||' tidak ditemukan';
    SELECT * INTO bvDcvRequest FROM dcv_request WHERE dcvh_no_dcv = vTask.no_dcv FOR UPDATE NOWAIT;
    SELECT * INTO vRoute FROM wf_route WHERE node_id = vTask.nodecode AND pilihan = pActionId;

    IF vRoute.return_task = 'Y' AND RTRIM(pNote) IS NULL THEN 
        raise_application_error (-20101, 'Note field kosong');
    END IF;

    -- post_action
    dbms_output.put_line('Akan execute post-action : ');
    vNewTask := post_action (pTaskId, pActionId, pNote);
    dbms_output.put_line(vNewTask);

    IF vNewTask > 0 THEN
        vResponseMsg := 'Current Status: '|| bvDcvRequest.dcvh_current_step;

    ELSIF vNewTask = 0 THEN
        vResponseMsg := 'Sukses: '|| vTask.tahapan;

    ELSIF vNewTask = -1 THEN
        vResponseMsg := 'No DCV '|| vTask.no_dcv || ' sedang diupdate orang lain.';
    ELSIF vNewTask = -2 THEN
        vResponseMsg := 'No DCV '|| vTask.no_dcv || ' ada error post_script.';
   END IF;

    pResponseMsg := vResponseMsg;
    pResponseCode := 0;

EXCEPTION 
WHEN NO_DATA_FOUND THEN
    pResponseMsg := vErrMsg;
    pResponseCode := -1;
WHEN no_open_task THEN
    pResponseMsg := vErrMsg;
    pResponseCode := -4;
WHEN empty_note THEN
    pResponseMsg := 'Notes harus diisi';
    pResponseCode := -3;
WHEN invalid_validation THEN
    pResponseMsg := vErrMsg;
    pResponseCode := -2;
END post_action;

PROCEDURE get_action_list (pDcvNo VARCHAR2, pRole IN VARCHAR2, PLIST OUT SYS_REFCURSOR) 
AS 
 vJml NUMBER;
 vList SYS_REFCURSOR;
BEGIN
    SELECT COUNT(*) INTO vJml
    FROM wf_task
    WHERE no_dcv = pDcvNo
    AND progress_status= 'WAIT'
    AND bagian = (SELECT bagian FROM dcv_role WHERE role_code = pRole);

    IF vJml = 1 THEN 

        OPEN pList FOR
            WITH qry AS (
                SELECT pr.role_code, p.priv_code, r.node_id, r.pilihan, r.description
                FROM wf_route r
                JOIN wf_node n ON n.nodecode = r.node_id AND n.nodetype = 'Human'
                JOIN dcv_privs p ON p.ref_id2 = r.id AND p.priv_type = 'WF_ROUTE'
                JOIN role_privs pr ON pr.priv_code = p.priv_code
            )
            SELECT t.id task_id, t.no_dcv, qry.role_code, qry.node_id, 
                qry.pilihan, qry.description
            FROM qry, wf_task t
            WHERE t.nodecode = qry.node_id 
            AND t.task_type = 'Human' 
            AND t.progress_status = 'WAIT'
            AND t.no_dcv = pDcvNo
            AND qry.role_code = pRole;

    ELSIF vJml > 1 THEN
        OPEN pList FOR
            WITH qry AS (
                SELECT pr.role_code, p.priv_code, r.node_id, r.pilihan, r.description
                FROM wf_route r
                JOIN wf_node n ON n.nodecode = r.node_id AND n.nodetype = 'Human'
                JOIN dcv_privs p ON p.ref_id2 = r.id AND p.priv_type = 'WF_ROUTE'
                JOIN role_privs pr ON pr.priv_code = p.priv_code
            )
            SELECT t.id task_id, t.no_dcv, qry.role_code, qry.node_id, 
                qry.pilihan, qry.description
            FROM qry, wf_task t
            WHERE t.nodecode = qry.node_id 
            AND t.task_type = 'Human' 
            AND t.progress_status = 'WAIT'
            AND t.no_dcv = pDcvNo
            AND t.prime_route = 'Y'
            AND qry.role_code = pRole;
    ELSE 
       OPEN pList FOR
            SELECT 0 task_id, 0 no_dcv, 0 role_code, 0 node_id, 
            0 pilihan, 0 description
            from dual
            where rownum < 1;
    END IF;
END get_action_list;

--PROCEDURE show_action_list (pDcvNo VARCHAR2, pUser IN VARCHAR2, pBagian IN VARCHAR2, PLIST OUT SYS_REFCURSOR) 
--AS 
--    vRole VARCHAR2(50);
--    vList SYS_REFCURSOR;
--BEGIN
--
--    IF pBagian = 'Admin' THEn
--        SELECT role_code INTO vRole FROM dcv_role WHERE bagian=pBagian AND rownum =1;
--    ELSE
--        SELECT user_role INTO vRole FROM user_access WHERE user_name = TRIM(pUser);
--    END IF;
--    get_action_list (pDcvNo, vRole, vList);
--    pList := vList;
--EXCEPTION WHEN NO_DATA_FOUND THEN
--    OPEN vList FOR
--    SELECT object_id task_id, object_name no_dcv, object_type role_code, object_id node_id, 
--                1 pilihan, object_name description
--    FROM user_objects WHERE ROWNUM < 1;
--    pList := vList;
--END show_action_list;

--PROCEDURE show_action_list (pDcvNo VARCHAR2, pUser IN VARCHAR2, PLIST OUT SYS_REFCURSOR) 
PROCEDURE show_action_list (pDcvNo VARCHAR2, pUser IN VARCHAR2, pBagian IN VARCHAR2, PLIST OUT SYS_REFCURSOR)
AS 
    vRole VARCHAR2(50);
    vUserType VARCHAR2(50);
    vUser user_access%ROWTYPE;
    vList SYS_REFCURSOR;
BEGIN
    dbms_output.put_line('akan select' ||pUser||'xx');
    SELECT user_type INTO vUserType FROM user_access WHERE user_name = TRIM(pUser);
    IF vUserType = 'Admin' THEN
        IF pBagian = 'TC' THEN vRole := 'TC-Supervisor';
        ELSE
            SELECT role_code INTO vRole FROM dcv_role WHERE bagian=pBagian AND rownum =1;
        END IF;
    ELSE
        SELECT user_role INTO vRole FROM user_access WHERE user_name = TRIM(pUser);
    END IF;

    OPEN pList FOR
        SELECT * FROM TABLE(pipedqry.get_action_list(pDcvNo, vRole));
EXCEPTION WHEN OTHERS THEN null;

END show_action_list;


PROCEDURE qry_open_batch_document (pBagian VARCHAR2, pNodeCode VARCHAR2, tList OUT SYS_REFCURSOR)
AS
BEGIN

    OPEN tList FOR
        WITH qPo AS (
            SELECT dcv.dcvh_no_dcv, 
            LISTAGG(tc.no_po, ', ') WITHIN GROUP (ORDER BY tc.no_po) AS no_po
            FROM tc_approval tc
            JOIN request_dtl dtl ON dtl.dcvl_id = tc.dcvl_id
            JOIN dcv_request dcv ON dcv.dcvh_id = dtl.dcvh_id
            GROUP BY dcv.dcvh_no_dcv
        )
        SELECT dcv.dcvh_no_dcv as no_dcv, dcv.dcvh_cust_code as cust_code, dcv.dcvh_cust_name as cust_name, 
        dcv.dcvh_region as region, dcv.dcvh_area as area, dcv.dcvh_location as location,
        dcv.dcvh_no_pc as no_pc, dcv.dcvh_appv_value as appv_val, kw.doc_no as no_kwitansi, 
        fp.doc_no as no_fp, qpo.no_po as po_no, gr.doc_no as gr_no, t.id as task_id, t.note as note
        FROM dcv_request dcv
        INNER JOIN wf_task t ON t.no_dcv = dcv.dcvh_no_dcv AND t.progress_status = 'WAIT'
        LEFT OUTER JOIN dcv_documents kw ON kw.dcvh_id = dcv.dcvh_id AND kw.doc_type = 'KW'
        LEFT OUTER JOIN dcv_documents fp ON fp.dcvh_id = dcv.dcvh_id AND fp.doc_type = 'FP'
        LEFT OUTER JOIN dokumen_realisasi gr ON gr.dcvh_id = dcv.dcvh_id AND gr.tahapan_realisasi = 'GR'
        LEFT OUTER JOIN qPo ON qPo.dcvh_no_dcv = dcv.dcvh_no_dcv
        WHERE t.nodecode = pNodeCode
        AND CASE WHEN t.nodecode IN ('TC4','TC5') AND EXISTS (select 'x' from wf_task t2                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
                                                    where t2.no_dcv = t.no_dcv                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
                                                    and t2.progress_status = 'WAIT'                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
                                                    and t2.id <> t.id                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
                                                    and t2.nodecode = 'TC2') THEN 2                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
                 WHEN t.nodecode = 'TC5' AND EXISTS (select 'x' from wf_task t2                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
                                                    where t2.no_dcv = t.no_dcv                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
                                                    and t2.progress_status = 'WAIT'                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
                                                    and t2.id <> t.id                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
                                                    and t2.nodecode = 'TC4') THEN 2                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
                 ELSE 1                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
            END =1;  

--        WHERE CASE WHEN (pNodeCode = 'TC3') AND (t.nodecode IN ('TC3','TC4','TC5')) THEN 1
--                    WHEN (t.nodecode = pNodeCode) THEN 1
--                    ELSE 0
--              END = 1;
--        AND t.nodecode = pNodeCode;

END qry_open_batch_document;

PROCEDURE qry_hist_batch_document (pBagian VARCHAR2, tgl DATE, pNodeCode VARCHAR2, pilihan NUMBER, tList OUT SYS_REFCURSOR)
AS
BEGIN
    OPEN tList FOR
        WITH qPo AS (
            SELECT dcv.dcvh_no_dcv, 
            LISTAGG(tc.no_po, ', ') WITHIN GROUP (ORDER BY tc.no_po) AS no_po
            FROM tc_approval tc
            JOIN request_dtl dtl ON dtl.dcvl_id = tc.dcvl_id
            JOIN dcv_request dcv ON dcv.dcvh_id = dtl.dcvh_id
            GROUP BY dcv.dcvh_no_dcv
        )
        SELECT dcv.dcvh_no_dcv as no_dcv, dcv.dcvh_cust_code as cust_code, dcv.dcvh_cust_name as cust_name, 
        dcv.dcvh_region as region, dcv.dcvh_area as area, dcv.dcvh_location as location,
        dcv.dcvh_no_pc as no_pc, dcv.dcvh_appv_value as appv_val, kw.doc_no as no_kwitansi, 
        fp.doc_no as no_fp, qpo.no_po as po_no, gr.doc_no as gr_no, t.id as task_id, t.note as note
        FROM dcv_request dcv
        INNER JOIN wf_task t ON t.no_dcv = dcv.dcvh_no_dcv
        LEFT OUTER JOIN dcv_documents kw ON kw.dcvh_id = dcv.dcvh_id AND kw.doc_type = 'KW'
        LEFT OUTER JOIN dcv_documents fp ON fp.dcvh_id = dcv.dcvh_id AND fp.doc_type = 'FP'
        LEFT OUTER JOIN dokumen_realisasi gr ON gr.dcvh_id = dcv.dcvh_id AND gr.tahapan_realisasi = 'GR'
        LEFT OUTER JOIN qPo ON qPo.dcvh_no_dcv = dcv.dcvh_no_dcv
--        WHERE t.bagian = pBagian
        WHERE CASE WHEN t.nodecode IN ('TC4','TC5') AND EXISTS (select 'x' from wf_task t2                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
                                                    where t2.no_dcv = t.no_dcv                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
                                                    and t2.progress_status = 'WAIT'                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
                                                    and t2.id <> t.id                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
                                                    and t2.nodecode = 'TC2') THEN 2                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
                 WHEN t.nodecode = 'TC5' AND EXISTS (select 'x' from wf_task t2                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
                                                    where t2.no_dcv = t.no_dcv                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
                                                    and t2.progress_status = 'WAIT'                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
                                                    and t2.id <> t.id                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
                                                    and t2.nodecode = 'TC4') THEN 2                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
                 ELSE 1                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
            END =1  
        AND TRUNC(t.process_time) = TRUNC(tgl)
--        AND t.nodecode = pNodeCode
        AND t.decision = pilihan
        AND t.progress_status = 'DONE';

END qry_hist_batch_document;

END WF_PKG;
/
