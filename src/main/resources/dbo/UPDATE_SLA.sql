--------------------------------------------------------
--  File created - Wednesday-March-24-2021   
--------------------------------------------------------
--------------------------------------------------------
--  DDL for Procedure UPDATE_SLA
--------------------------------------------------------
set define off;

  CREATE OR REPLACE EDITIONABLE PROCEDURE "FOCUSDCV"."UPDATE_SLA" AS
    CURSOR c1 IS select * from wf_task WHERE progress_status = 'WAIT' ;
    vc1 c1%ROWTYPE;
    vTarget NUMBER;
    vElapse NUMBER;
    vSla NUMBER;
BEGIN
    OPEN c1;
    LOOP
      FETCH c1 INTO vc1;
      EXIT WHEN c1%NOTFOUND;

          vTarget := TRUNC(vc1.target_selesai) - TRUNC(vc1.assign_time);
          vElapse := TRUNC(SYSDATE) - TRUNC(vc1.assign_time);
          vSla := vElapse / vTarget;
          UPDATE wf_task SET sla = vSla WHERE id = vc1.id;
    END LOOP;
END;


/
