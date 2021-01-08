package com.mycompany.myproject.persist.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.mycompany.myproject.persist.entity.UiDcvRequestDetail;

public interface UiDcvRequestDetailRepo extends JpaRepository<UiDcvRequestDetail, Long> {

	List<UiDcvRequestDetail> findByDcvhId(Long dcvhId);
	
	UiDcvRequestDetail findByDcvhIdAndDcvlId(Long dcvhId, Long dcvlId);
	
	@Query("select sum(u.appvValExc) from UiDcvRequestDetail u where u.dcvhId=?1")
	Long countTotalAppvValExcByDcvhId(Long dcvhId);
}
