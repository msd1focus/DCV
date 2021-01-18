package com.mycompany.myproject.lookupcode;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface LookupCodeRepo extends JpaRepository<LookupCode, Long> {

	List<LookupCode> findByTitle(String title);
	
	LookupCode findByTitleAndValue(String title, String value);
	
	List<LookupCode> findAll();
	
	LookupCode save(LookupCode ookupCode);
}
