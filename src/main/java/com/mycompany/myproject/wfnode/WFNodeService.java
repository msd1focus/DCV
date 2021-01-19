package com.mycompany.myproject.wfnode;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mycompany.myproject.holiday.HolidayRepo;
import com.mycompany.myproject.service.DataDCVServices;

@Service
public class WFNodeService {
	
	private static final Logger logger = LoggerFactory.getLogger(WFNodeService.class);
	
	@Autowired
	private WFNodeRepo wFNodeRepo;
	
	public List<WFNode> getWfNode(){
		List<WFNode> result = wFNodeRepo.findByType("Human");
		return result;
	}
	
	public Map<String, Object> updateWfNode (List<LinkedHashMap<String, Object>> param) {
		String nodeCode = "";
		BigDecimal sla1 = new BigDecimal(0);
		Map<String, Object> result = new HashMap<String, Object>();
    	
    	for (LinkedHashMap<String, Object> dataParam : param) {
    		nodeCode = dataParam.get("nodeCode").toString();
    		sla1 = dataParam.get("sla1") != null ? new BigDecimal(dataParam.get("sla1").toString()) : null;
        	try {
        		WFNode wfNode = new WFNode(); 
            	wfNode = wFNodeRepo.findByNodeCode(nodeCode);
            	wfNode.setSla1(sla1);
            	wFNodeRepo.save(wfNode);
			} catch (Exception e) {
				logger.error("Update WF NODE Failed : ",e);
			}
		}
    	result.put("result", "OK");
    	return result;  
    }

}
