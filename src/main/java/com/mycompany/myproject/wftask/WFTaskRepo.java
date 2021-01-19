package com.mycompany.myproject.wftask;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface WFTaskRepo extends JpaRepository<WFTask, Long> {

	List<WFTask> findByNoDCV(String noDcv);
	
	List<WFTask> findByNoDCVOrderByIdDesc(String noDcv);
	
	WFTask findByIdAndNoDCV(Long id, String noDcv);
	
	List<WFTask> findByNoDCVOrderByIdAsc(String noDcv);
}
