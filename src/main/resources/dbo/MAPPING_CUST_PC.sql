--------------------------------------------------------
--  File created - Wednesday-March-24-2021   
--------------------------------------------------------
--------------------------------------------------------
--  DDL for Procedure MAPPING_CUST_PC
--------------------------------------------------------
set define off;

  CREATE OR REPLACE EDITIONABLE PROCEDURE "FOCUSDCV"."MAPPING_CUST_PC" 
AS
    CURSOR c1 IS 
        SELECT DISTINCT p.proposal_id, p.confirm_no, p.addendum_ke, 
                        pca.cust_reg_flg, pca.region_code, pca.area_code, pca.loc_code
        FROM focuspp.proposal p, focuspp.promo_customer_area pca
        WHERE p.proposal_id = pca.proposal_id
        AND pca.cust_reg_flg IS NOT NULL
        AND p.confirm_no <> 'Auto Generated'
        AND TRUNC(p.confirm_date) >= TRUNC(SYSDATE-3)
        UNION
        SELECT DISTINCT p.proposal_id, p.confirm_no, p.addendum_ke, 
                        pch.cust_reg_flg, pch.region_code, pch.area_code, pch.loc_code
        FROM focuspp.proposal p, focuspp.promo_produk pp, focuspp.promo_customer_ho pch
        WHERE p.proposal_id = pp.proposal_id
        AND pch.cust_reg_flg IS NOT NULL
        AND pp.promo_produk_id = pch.promo_produk_id
        AND p.confirm_no <> 'Auto Generated'
        AND TRUNC(p.confirm_date) >= TRUNC(SYSDATE-3);

BEGIN

    FOR i IN c1 LOOP
        BEGIN    
            INSERT INTO map_cust_proposal (cust_name, prop_id, no_pc)
            SELECT mc.cust_code, i.proposal_id,
                DECODE(i.addendum_ke,NULL, i.confirm_no, i.confirm_no||'-'||i.addendum_ke)         
            FROM focuspp.master_customer mc
            WHERE CASE WHEN i.cust_reg_flg = 'LOCATION' AND mc.location_code = i.loc_code THEN 1
                WHEN i.cust_reg_flg = 'AREA' AND mc.area_code = i.area_code THEN 1
                WHEN i.cust_reg_flg = 'REGION' AND mc.region_code = i.region_code THEN 1
                ELSE 0
              END = 1;

        EXCEPTION WHEN DUP_VAL_ON_INDEX THEN NULL;
        END;
    END LOOP;

END mapping_cust_pc;

/
