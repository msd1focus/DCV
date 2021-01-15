package com.mycompany.myproject.persist.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mycompany.myproject.persist.entity.LookupCode;

public interface LookupCodeRepo extends JpaRepository<LookupCode, Long> {

	List<LookupCode> findByTitle(String title);
	
	LookupCode findByTitleAndValue(String title, String value);
	
	List<LookupCode> findAll();
	
	LookupCode save(LookupCode ookupCode);
}
