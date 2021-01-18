package com.mycompany.myproject.lookupcode;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
