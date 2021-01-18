package com.mycompany.myproject.wfroute;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class WFRouteService {
	
	@Autowired
	private WFRouteRepo wFRouteRepo;
	

    public List<WFRoute> findByNodeId (String nodeId) {
    	
    	return wFRouteRepo.findByNodeId(nodeId);
    }
	
    // Get Return Task WFRoute
    public WFRoute getReturnTask (Map<String, Object> param) {
    	WFRoute result = new WFRoute();
    	result = wFRouteRepo.findByNodeIdPilihan(param.get("nodeId").toString(), Integer.parseInt(param.get("pilihan").toString()));
    	return result;
    }
	
}
