package com.mycompany.myproject.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mycompany.myproject.persist.entity.LookupCode;
import com.mycompany.myproject.persist.repo.LookupCodeRepo;

@Service
public class LookupCodeService {
	
	
	@Autowired
	private LookupCodeRepo lookupCodeRepo;
	
	public List<LookupCode> findByTitle(String title){
		return lookupCodeRepo.findByTitle(title);
	}
	
	public LookupCode findByTitleAndValue(String title, String value) {	
		return lookupCodeRepo.findByTitleAndValue(title,value);
	}
	
	public List<LookupCode> findAll(){
		
		return lookupCodeRepo.findAll();
	}
	
	public LookupCode save (LookupCode lookupCode) {
		return lookupCodeRepo.save(lookupCode);
	}

}
