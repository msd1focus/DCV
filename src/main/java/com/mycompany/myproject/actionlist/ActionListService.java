package com.mycompany.myproject.actionlist;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.StoredProcedureQuery;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mycompany.myproject.service.dto.ActionListDto;

@Service
public class ActionListService {
	
	private static final Logger logger = LoggerFactory.getLogger(ActionListService.class);
	
	@PersistenceContext
	private EntityManager em;
	
	@Autowired
	ActionListRepo actionListRepo;
	
	// Get Action List
    @SuppressWarnings("unchecked")
    public List<ActionListDto> findActionList(Map<String, Object> param) {
    	List<ActionListDto> listData 	= new ArrayList<>();
    	
    	StoredProcedureQuery proc = em.createNamedStoredProcedureQuery("show_action_list");
    	proc.setParameter("pDcvNo", param.get("pDcvNo").toString());
    	proc.setParameter("pUser", param.get("pUser").toString());
    	proc.setParameter("pBagian", param.get("pBagian").toString());
		proc.execute();
		
		List<Object[]> postComments = proc.getResultList();
		for(Object[] dataProc: postComments) {
			ActionListDto result = new ActionListDto(dataProc);
			listData.add(result);
		}
    	
    	return listData;
    }
    
    public List<ActionList> findActionListByDcvAndBagianAndNodeCode(ActionList actList) {
    	List<ActionList> hasil = new ArrayList<>();
    	List<ActionList> termList = actionListRepo.findByNoDcvAndBagianAndNodeCode(actList.getNoDcv(), actList.getBagian(), actList.getNodeCode());
    	
    	for(int i=0; i<termList.size(); i++) {
    		ActionList term = actionListRepo.findByPilihan(termList.get(i).getNoDcv(), termList.get(i).getBagian(), termList.get(i).getNodeCode(), new BigDecimal(i).add(new BigDecimal(1)));
    		if(term != null) {
    			hasil.add(term);
    		}
    	}
    	
    	return hasil;
    }
}
