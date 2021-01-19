package com.mycompany.myproject.wftask;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.StoredProcedureQuery;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class WFTaskService {
	
	@PersistenceContext
	private EntityManager em;
	
	@Autowired
	private WFTaskRepo wfTaskRepo;
	
    public Map<String, Object> updateWFTaskFromAction(Map<String, Object> param) {
    	Map<String, Object> hasil = new HashMap<>();
    	
    	/* Call @NamedStoredProcedureQuery at Model */
		StoredProcedureQuery proc = em.createNamedStoredProcedureQuery("post_action");
		
		/* IN params */
		/*proc.setParameter("pTaskId", Integer.valueOf(param.get("pTaskId").toString()));
		proc.setParameter("pActionId", Integer.valueOf(param.get("pActionId").toString()));
		proc.setParameter("pUser", param.get("pUser").toString());
		proc.setParameter("pNote", param.get("pNote") != null ? param.get("pNote").toString() : "");*/
		
		proc.setParameter("pTaskId", Integer.valueOf(param.get("pTaskId").toString()));
		proc.setParameter("pActionId",  param.get("pActionId") != null ? Integer.valueOf(param.get("pActionId").toString()) : 0);
		proc.setParameter("pUser", param.get("pUser").toString());
		proc.setParameter("pNote", param.get("pNote") != null ? param.get("pNote").toString() : "");
		
		proc.execute();
		
		/* OUT params */
		Integer resCode = (Integer) proc.getOutputParameterValue("pResponseCode");
		String resMsg = (String) proc.getOutputParameterValue("pResponseMsg");
    	
		hasil.put("code", resCode);
		hasil.put("message", resMsg);
//    	hasil.put("code", 0);
//		hasil.put("message", "sukses");
    	return hasil;
    }
    
    
    public WFTask getWfTaskByNoDcv(String noDcv) {
		List<WFTask> wfTaskList = wfTaskRepo.findByNoDCVOrderByIdDesc(noDcv);
		
		return wfTaskList.get(0);
	}
    
    public WFTask getWfTaskByIdAndNoDcv(Map<String, Object> param) {
		WFTask wfTask = new WFTask();
		Long id = Long.valueOf(param.get("pTaskId") != null ? param.get("pTaskId").toString() : "0");
		String noDcv = param.get("pDcvNo")!= null ? param.get("pDcvNo").toString() : "";
	    wfTask = wfTaskRepo.findByIdAndNoDCV(id, noDcv);
		// TODO Auto-generated method stub
		return wfTask;
	}
}
