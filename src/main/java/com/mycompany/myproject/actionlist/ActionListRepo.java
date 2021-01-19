package com.mycompany.myproject.actionlist;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ActionListRepo extends JpaRepository<ActionList, Long> {
	
	List<ActionList> findByNoDcv(String noDcv);
	
	List<ActionList> findByNoDcvAndBagianAndNodeCode(String noDcv, String bagian, String nodeCode);
	
	@Query("SELECT u FROM ActionList u WHERE u.noDcv = ?1 AND u.bagian = ?2 AND u.nodeCode = ?3 AND u.pilihan = ?4")
	ActionList findByPilihan(String noDcv, String bagian, String nodeCode, BigDecimal pilihan);
}
