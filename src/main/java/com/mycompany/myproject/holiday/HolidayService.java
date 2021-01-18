package com.mycompany.myproject.holiday;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.StoredProcedureQuery;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mycompany.myproject.service.DataDCVServices;

@Service
public class HolidayService {
	
	private static final Logger logger = LoggerFactory.getLogger(DataDCVServices.class);
	
	@PersistenceContext
	private EntityManager em;
	
	@Autowired
	private HolidayRepo holidayRepo;
	
	 // Example: Calling Store Procedure Oracle with Ref_CURSOR OUT
		@SuppressWarnings("unchecked")
	    public List<Holiday> getListHoliday() {
	    	List<Holiday> liburList = new ArrayList<Holiday>();
	    	StoredProcedureQuery proc = em.createNamedStoredProcedureQuery("collect_libur");
	    	proc.execute();

	    	List<Object[]> postComments = proc.getResultList();
	    	
	    	for(Object liburX: postComments) {
	    		liburList.add((Holiday) liburX);
	    	}
	    	
	    	return liburList;
	    }
		
		public Map<String, Object> saveHoliday (Holiday param) {
			Map<String, Object> result = new HashMap<String, Object>();
	    	try {
	    		holidayRepo.save(param);
			} catch (Exception e) {
				logger.error("Save Holiday Failed : ",e);
			}
	    	
	    	result.put("result", "OK");
	    	return result;  
	    }
		
		public Map<String, Object> updateHoliday (Holiday param) {
			Map<String, Object> result = new HashMap<String, Object>();
	    	try {
	    		holidayRepo.findOne(param.getId());
	    		holidayRepo.save(param);
			} catch (Exception e) {
				logger.error("Update Holiday Failed : ",e);
			}
	    	
	    	result.put("result", "OK");
	    	return result;  
	    }
		
		public Map<String, Object> deleteHoliday (Holiday param) {
			Map<String, Object> result = new HashMap<String, Object>();
	    	try {
	    		holidayRepo.findOne(param.getId());
	    		holidayRepo.delete(param);
			} catch (Exception e) {
				logger.error("Delete Holiday Failed : ",e);
			}
	    	
	    	result.put("result", "OK");
	    	return result;  
	    }

}
