package com.mycompany.myproject.persist.repo;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.mycompany.myproject.persist.entity.UiDcvRequest;

public interface UiDcvRequestRepo extends JpaRepository<UiDcvRequest, Long> {

	List<UiDcvRequest> findByCustCode(String custCode);
	
	UiDcvRequest findByNoDCV(String noDCV);
	
	List<UiDcvRequest> findByNoPC(String noPC);
	
	@Query("SELECT u FROM UiDcvRequest u WHERE u.noPC = ?1 AND u.custCode = ?2 AND u.dcvhId <> ?3")
	List<UiDcvRequest> findByNoPCAndCustCode(String noPC, String custCode, Long dcvhId);
	
	// Example: Calling Function Oracle with Multiple OUT
	@Query(value = "select dcv_pkg.get_dcv_no from dual", nativeQuery = true)
	public String getDCVNo();
	
	
}
