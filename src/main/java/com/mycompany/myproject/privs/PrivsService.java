package com.mycompany.myproject.privs;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

@Service
public class PrivsService {
	
	@Autowired
	private PrivsRepo privsRepo;
	
	public Map<String, Object> getPrivs(@RequestBody Map<String, Object> param){
		Map<String, Object> result = new HashMap<String, Object>();
		List<Privs> privsList = privsRepo.findByPrivCode("TCAPPV");
		
		Privs privs = privsRepo.findOne("TCAPPV");
		result.put("privs", privs);
		return result;
	}
}
