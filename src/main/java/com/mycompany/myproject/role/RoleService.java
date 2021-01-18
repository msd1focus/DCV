package com.mycompany.myproject.role;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mycompany.myproject.service.DataDCVServices;

@Service
public class RoleService {
	
	private static final Logger logger = LoggerFactory.getLogger(DataDCVServices.class);
	
	@Autowired
	private RoleRepo roleRepo;
	
	public Role getRole(String userRole) {
		logger.info("Find data table Role by user role");
		Role result = roleRepo.findByRoleCode(userRole);
		return result;
	}
	
	public List<Role> getList(){
		List<Role> result = new ArrayList<>();
		result = roleRepo.findAll();
		return result;
	}
	
	public Map<String, Object> save (Role param) {
		Map<String, Object> result = new HashMap<String, Object>();
		Role role = roleRepo.findByRoleCode(param.getRoleCode());
		if(role == null) {
			try {
	    		roleRepo.save(param);
			} catch (Exception e) {
				logger.error("Save DCV Role Failed : ",e);
			}
			result.put("result", "OK");
		}else {
			result.put("result", "FAILED");
		}  	
    	
    	return result;  
    }
	
	public Map<String, Object> update (Role param) {
		Map<String, Object> result = new HashMap<String, Object>(); 
		try {
			roleRepo.findByRoleCode(param.getRoleCode());
    		roleRepo.save(param);
		} catch (Exception e) {
			logger.error("Update DCV Role Failed : ",e);
		}
		result.put("result", "OK");    	
    	return result;  
    }
	
	public Map<String, Object> delete (Role param) {
		Map<String, Object> result = new HashMap<String, Object>(); 
		try {
			roleRepo.findByRoleCode(param.getRoleCode());
    		roleRepo.delete(param);
		} catch (Exception e) {
			logger.error("Delete DCV Role Failed : ",e);
		}
		result.put("result", "OK");    	
    	return result;  
    }
}
