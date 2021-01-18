package com.mycompany.myproject.wfroute;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.annotations.Api;

@RestController
@Api(description = "DCV Management API")
@RequestMapping("/wfroute")
public class WFRouteController {
	
	@Autowired
	private WFRouteService wfRouteService;
	
	/*Service 
	 * Find Like for Action from WF_Route*/
	@RequestMapping(value = "/findWfRouteByNode", method = RequestMethod.POST)
	public @ResponseBody List<WFRoute> findWfRouteByNode(@RequestBody String nodeId) {
		return wfRouteService.findByNodeId(nodeId);
	}
	
	/*Service 
	 * Find Return Task for Action from WFRoute*/
	@RequestMapping(value = "/getReturnTask", method = RequestMethod.POST)
	public @ResponseBody WFRoute getReturnTask(@RequestBody Map<String, Object> param) {
		return wfRouteService.getReturnTask(param);
	}
}
