CREATE OR REPLACE PACKAGE "DCV_GRANT" AS 

PROCEDURE revokerole (rolename VARCHAR2);
PROCEDURE grant_sales (rolename VARCHAR2);
PROCEDURE grant_tc (rolename VARCHAR2);
PROCEDURE grant_tc_spv (rolename VARCHAR2);
PROCEDURE grant_tax (rolename VARCHAR2);
PROCEDURE grant_promo (rolename VARCHAR2);
PROCEDURE grant_ap (rolename VARCHAR2);
PROCEDURE grant_admin (rolename VARCHAR2);

END DCV_GRANT;
/


CREATE OR REPLACE PACKAGE BODY "DCV_GRANT" AS
  maxId NUMBER;

  PROCEDURE revokerole (rolename VARCHAR2) AS
  BEGIN
    DELETE dcv_role_menu WHERE role_code = rolename;
    DELETE role_privs WHERE role_code = rolename;
  END revokerole;

  PROCEDURE grant_sales (rolename VARCHAR2) AS
  BEGIN
--    BEGIN
--        INSERT INTO dcv_role (role_code, role_name, role_type, bagian)
--        VALUES (rolename, rolename, 'WF', 'Sales');
--    EXCEPTION WHEN DUP_VAL_ON_INDEX THEN 
--        UPDATE dcv_role SET bagian = 'Sales' WHERE role_code = rolename;
--    END;

    revokerole(rolename);

    -- grant menu
    INSERT INTO dcv_role_menu (role_code, menu_id) VALUES (rolename, 2);
    INSERT INTO dcv_role_menu (role_code, menu_id) VALUES (rolename, 6);

    SELECT MAX(id) INTO maxId FROM role_privs;

    -- role privs
    maxId := maxId + 1;
    INSERT INTO role_privs (role_code, priv_code, id) VALUES (rolename, 'SLACT', maxId);

    -- grant actions
    maxId := maxId + 1;
    INSERT INTO role_privs (role_code, priv_code, id) VALUES (rolename, 'SL1-1', maxId);
    maxId := maxId + 1;
    INSERT INTO role_privs (role_code, priv_code, id) VALUES (rolename, 'SL1-2', maxId);
  END grant_sales;

  PROCEDURE grant_tc (rolename VARCHAR2) AS
  BEGIN
--    BEGIN
--        INSERT INTO dcv_role (role_code, role_name, role_type, bagian)
--        VALUES (rolename, rolename, 'WF', 'TC');
--    EXCEPTION WHEN DUP_VAL_ON_INDEX THEN 
--        UPDATE dcv_role SET bagian = 'TC' WHERE role_code = rolename;
--    END;

    revokerole(rolename);

    -- grant menu
    INSERT INTO dcv_role_menu (role_code, menu_id) VALUES (rolename, 2);
    INSERT INTO dcv_role_menu (role_code, menu_id) VALUES (rolename, 6);
    INSERT INTO dcv_role_menu (role_code, menu_id) VALUES (rolename, 28);
    INSERT INTO dcv_role_menu (role_code, menu_id) VALUES (rolename, 29);
    INSERT INTO dcv_role_menu (role_code, menu_id) VALUES (rolename, 32);

    SELECT MAX(id) INTO maxId FROM role_privs;

    -- role privs
    maxId := maxId + 1;
    INSERT INTO role_privs (role_code, priv_code, id) VALUES (rolename, 'TCACT', maxId);
    maxId := maxId + 1;
    INSERT INTO role_privs (role_code, priv_code, id) VALUES (rolename, 'TCAPPV', maxId);

    -- grant actions
    maxId := maxId + 1;
    INSERT INTO role_privs (role_code, priv_code, id) VALUES (rolename, 'TC1-3', maxId);
    maxId := maxId + 1;
    INSERT INTO role_privs (role_code, priv_code, id) VALUES (rolename, 'TC1-4', maxId);
    maxId := maxId + 1;
    INSERT INTO role_privs (role_code, priv_code, id) VALUES (rolename, 'TC2-1', maxId);
    maxId := maxId + 1;
    INSERT INTO role_privs (role_code, priv_code, id) VALUES (rolename, 'TC2-2', maxId);
    maxId := maxId + 1;
    INSERT INTO role_privs (role_code, priv_code, id) VALUES (rolename, 'TC3-1', maxId);
    maxId := maxId + 1;
    INSERT INTO role_privs (role_code, priv_code, id) VALUES (rolename, 'TC3-2', maxId);
    maxId := maxId + 1;
    INSERT INTO role_privs (role_code, priv_code, id) VALUES (rolename, 'TC3-3', maxId);
    maxId := maxId + 1;
    INSERT INTO role_privs (role_code, priv_code, id) VALUES (rolename, 'TC4-1', maxId);
    maxId := maxId + 1;
    INSERT INTO role_privs (role_code, priv_code, id) VALUES (rolename, 'TC4-2', maxId);
    maxId := maxId + 1;
    INSERT INTO role_privs (role_code, priv_code, id) VALUES (rolename, 'TC5-3', maxId);

  END grant_tc;

  PROCEDURE grant_tc_spv (rolename VARCHAR2) AS
  BEGIN
    grant_tc(rolename);
    maxId := maxId + 1;
    INSERT INTO role_privs (role_code, priv_code, id) VALUES (rolename, 'TC1-1', maxId);
    maxId := maxId + 1;
    INSERT INTO role_privs (role_code, priv_code, id) VALUES (rolename, 'TC1-2', maxId);

  END grant_tc_spv;

  PROCEDURE grant_tax (rolename VARCHAR2) AS
  BEGIN
--    BEGIN
--        INSERT INTO dcv_role (role_code, role_name, role_type, bagian)
--        VALUES (rolename, rolename, 'WF', 'Tax');
--    EXCEPTION WHEN DUP_VAL_ON_INDEX THEN 
--        UPDATE dcv_role SET bagian = 'Tax' WHERE role_code = rolename;
--    END;

    revokerole(rolename);

    -- grant menu
    INSERT INTO dcv_role_menu (role_code, menu_id) VALUES (rolename, 2);
    INSERT INTO dcv_role_menu (role_code, menu_id) VALUES (rolename, 6);
    INSERT INTO dcv_role_menu (role_code, menu_id) VALUES (rolename, 28);
    INSERT INTO dcv_role_menu (role_code, menu_id) VALUES (rolename, 29);

    SELECT MAX(id) INTO maxId FROM role_privs;

    -- role privs
    maxId := maxId + 1;
    INSERT INTO role_privs (role_code, priv_code, id) VALUES (rolename, 'TAXACT', maxId);
    maxId := maxId + 1;
    INSERT INTO role_privs (role_code, priv_code, id) VALUES (rolename, 'TAXITM', maxId);

    -- grant actions
    maxId := maxId + 1;
    INSERT INTO role_privs (role_code, priv_code, id) VALUES (rolename, 'TX1-1', maxId);
    maxId := maxId + 1;
    INSERT INTO role_privs (role_code, priv_code, id) VALUES (rolename, 'TX1-2', maxId);
    maxId := maxId + 1;
    INSERT INTO role_privs (role_code, priv_code, id) VALUES (rolename, 'TX2-1', maxId);

  END grant_tax;

  PROCEDURE grant_promo (rolename VARCHAR2) AS
  BEGIN
--    BEGIN
--        INSERT INTO dcv_role (role_code, role_name, role_type, bagian)
--        VALUES (rolename, rolename, 'WF', 'Promo');
--    EXCEPTION WHEN DUP_VAL_ON_INDEX THEN 
--        UPDATE dcv_role SET bagian = 'Promo' WHERE role_code = rolename;
--    END;

    revokerole(rolename);

     -- grant menu
    INSERT INTO dcv_role_menu (role_code, menu_id) VALUES (rolename, 2);
    INSERT INTO dcv_role_menu (role_code, menu_id) VALUES (rolename, 6);
    INSERT INTO dcv_role_menu (role_code, menu_id) VALUES (rolename, 28);
    INSERT INTO dcv_role_menu (role_code, menu_id) VALUES (rolename, 29);

    SELECT MAX(id) INTO maxId FROM role_privs;

    -- role privs
    maxId := maxId + 1;
    INSERT INTO role_privs (role_code, priv_code, id) VALUES (rolename, 'PRACT', maxId);

    -- grant actions
    maxId := maxId + 1;
    INSERT INTO role_privs (role_code, priv_code, id) VALUES (rolename, 'PR1-1', maxId);
     maxId := maxId + 1;
    INSERT INTO role_privs (role_code, priv_code, id) VALUES (rolename, 'PR1-2', maxId);
    maxId := maxId + 1;
    INSERT INTO role_privs (role_code, priv_code, id) VALUES (rolename, 'PR2-1', maxId);
    maxId := maxId + 1;
    INSERT INTO role_privs (role_code, priv_code, id) VALUES (rolename, 'PR2-2', maxId);
    maxId := maxId + 1;
    INSERT INTO role_privs (role_code, priv_code, id) VALUES (rolename, 'PR3-1', maxId);
    maxId := maxId + 1;
    INSERT INTO role_privs (role_code, priv_code, id) VALUES (rolename, 'PR3-2', maxId);
    maxId := maxId + 1;
    INSERT INTO role_privs (role_code, priv_code, id) VALUES (rolename, 'PR4-1', maxId);

  END grant_promo;

  PROCEDURE grant_ap (rolename VARCHAR2) AS
  BEGIN
--    BEGIN
--        INSERT INTO dcv_role (role_code, role_name, role_type, bagian)
--        VALUES (rolename, rolename, 'WF', 'AP');
--    EXCEPTION WHEN DUP_VAL_ON_INDEX THEN 
--        UPDATE dcv_role SET bagian = 'AP' WHERE role_code = rolename;
--    END;

    revokerole(rolename);

     -- grant menu
    INSERT INTO dcv_role_menu (role_code, menu_id) VALUES (rolename, 2);
    INSERT INTO dcv_role_menu (role_code, menu_id) VALUES (rolename, 6);
    INSERT INTO dcv_role_menu (role_code, menu_id) VALUES (rolename, 28);
    INSERT INTO dcv_role_menu (role_code, menu_id) VALUES (rolename, 29);

    SELECT MAX(id) INTO maxId FROM role_privs;

    -- grant privs
    maxId := maxId + 1;
    INSERT INTO role_privs (role_code, priv_code, id) VALUES (rolename, 'APACT', maxId);

    -- grant actions
    maxId := maxId + 1;
    INSERT INTO role_privs (role_code, priv_code, id) VALUES (rolename, 'AP1-1', maxId);
     maxId := maxId + 1;
    INSERT INTO role_privs (role_code, priv_code, id) VALUES (rolename, 'AP1-2', maxId);
  END grant_ap;

  PROCEDURE grant_admin (rolename VARCHAR2) AS
  BEGIN
--    BEGIN
--        INSERT INTO dcv_role (role_code, role_name, role_type, bagian)
--        VALUES (rolename, rolename, 'WF', 'Admin');
--    EXCEPTION WHEN DUP_VAL_ON_INDEX THEN 
--        UPDATE dcv_role SET bagian = 'Admin' WHERE role_code = rolename;
--    END;

    revokerole(rolename);

    -- grant menu
    INSERT INTO dcv_role_menu (role_code, menu_id) VALUES (rolename, 2);
    INSERT INTO dcv_role_menu (role_code, menu_id) VALUES (rolename, 6);
    INSERT INTO dcv_role_menu (role_code, menu_id) VALUES (rolename, 28);
    INSERT INTO dcv_role_menu (role_code, menu_id) VALUES (rolename, 29);
    INSERT INTO dcv_role_menu (role_code, menu_id) VALUES (rolename, 32);

    SELECT MAX(id) INTO maxId FROM role_privs;

    -- grant privs
    maxId := maxId + 1;
    INSERT INTO role_privs (role_code, priv_code, id) VALUES (rolename, 'SLACT', maxId);
    maxId := maxId + 1;
    INSERT INTO role_privs (role_code, priv_code, id) VALUES (rolename, 'TCACT', maxId);
    maxId := maxId + 1;
    INSERT INTO role_privs (role_code, priv_code, id) VALUES (rolename, 'TCAPPV', maxId);
    maxId := maxId + 1;
    INSERT INTO role_privs (role_code, priv_code, id) VALUES (rolename, 'TAXACT', maxId);
    maxId := maxId + 1;
    INSERT INTO role_privs (role_code, priv_code, id) VALUES (rolename, 'TAXITM', maxId);
    maxId := maxId + 1;
    INSERT INTO role_privs (role_code, priv_code, id) VALUES (rolename, 'PRACT', maxId);
    maxId := maxId + 1;
    INSERT INTO role_privs (role_code, priv_code, id) VALUES (rolename, 'APACT', maxId);

    -- grant actions
    maxId := maxId + 1;
    INSERT INTO role_privs (role_code, priv_code, id) VALUES (rolename, 'SL1-1', maxId);
    maxId := maxId + 1;
    INSERT INTO role_privs (role_code, priv_code, id) VALUES (rolename, 'SL1-2', maxId);
    maxId := maxId + 1;
    INSERT INTO role_privs (role_code, priv_code, id) VALUES (rolename, 'TC1-1', maxId);
    maxId := maxId + 1;
    INSERT INTO role_privs (role_code, priv_code, id) VALUES (rolename, 'TC1-2', maxId);
    maxId := maxId + 1;
    INSERT INTO role_privs (role_code, priv_code, id) VALUES (rolename, 'TC1-3', maxId);
    maxId := maxId + 1;
    INSERT INTO role_privs (role_code, priv_code, id) VALUES (rolename, 'TC1-4', maxId);
    maxId := maxId + 1;
    INSERT INTO role_privs (role_code, priv_code, id) VALUES (rolename, 'TC2-1', maxId);
    maxId := maxId + 1;
    INSERT INTO role_privs (role_code, priv_code, id) VALUES (rolename, 'TC2-2', maxId);
    maxId := maxId + 1;
    INSERT INTO role_privs (role_code, priv_code, id) VALUES (rolename, 'TC3-1', maxId);
    maxId := maxId + 1;
    INSERT INTO role_privs (role_code, priv_code, id) VALUES (rolename, 'TC3-2', maxId);
    maxId := maxId + 1;
    INSERT INTO role_privs (role_code, priv_code, id) VALUES (rolename, 'TC3-3', maxId);
    maxId := maxId + 1;
    INSERT INTO role_privs (role_code, priv_code, id) VALUES (rolename, 'TC4-1', maxId);
    maxId := maxId + 1;
    INSERT INTO role_privs (role_code, priv_code, id) VALUES (rolename, 'TC4-2', maxId);
    maxId := maxId + 1;
    INSERT INTO role_privs (role_code, priv_code, id) VALUES (rolename, 'TC5-3', maxId);
    maxId := maxId + 1;
    INSERT INTO role_privs (role_code, priv_code, id) VALUES (rolename, 'TX1-1', maxId);
    maxId := maxId + 1;
    INSERT INTO role_privs (role_code, priv_code, id) VALUES (rolename, 'TX1-2', maxId);
    maxId := maxId + 1;
    INSERT INTO role_privs (role_code, priv_code, id) VALUES (rolename, 'TX2-1', maxId);
    maxId := maxId + 1;
    INSERT INTO role_privs (role_code, priv_code, id) VALUES (rolename, 'PR1-1', maxId);
     maxId := maxId + 1;
    INSERT INTO role_privs (role_code, priv_code, id) VALUES (rolename, 'PR1-2', maxId);
    maxId := maxId + 1;
    INSERT INTO role_privs (role_code, priv_code, id) VALUES (rolename, 'PR2-1', maxId);
    maxId := maxId + 1;
    INSERT INTO role_privs (role_code, priv_code, id) VALUES (rolename, 'PR2-2', maxId);
    maxId := maxId + 1;
    INSERT INTO role_privs (role_code, priv_code, id) VALUES (rolename, 'PR3-1', maxId);
    maxId := maxId + 1;
    INSERT INTO role_privs (role_code, priv_code, id) VALUES (rolename, 'PR3-2', maxId);
    maxId := maxId + 1;
    INSERT INTO role_privs (role_code, priv_code, id) VALUES (rolename, 'PR4-1', maxId);
    maxId := maxId + 1;
    INSERT INTO role_privs (role_code, priv_code, id) VALUES (rolename, 'AP1-1', maxId);
     maxId := maxId + 1;
    INSERT INTO role_privs (role_code, priv_code, id) VALUES (rolename, 'AP1-2', maxId);

  END grant_admin;


END DCV_GRANT;
/
