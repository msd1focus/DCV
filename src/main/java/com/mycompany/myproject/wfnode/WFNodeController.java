package com.mycompany.myproject.wfnode;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.mycompany.myproject.holiday.HolidayController;

import io.swagger.annotations.Api;

@RestController
@Api(description = "DCV Management API")
@RequestMapping("/wfnode")
public class WFNodeController {
	
	private static final Logger logger = LoggerFactory.getLogger(HolidayController.class);
	
	@Autowired 
	WFNodeService wfNodeService;
	
	@RequestMapping(value = "/getWfNode", method = RequestMethod.POST)
	public @ResponseBody List<WFNode> getWfNode() {
		return wfNodeService.getWfNode();
	}
	
	@RequestMapping(value = "/updateWfNode", method = RequestMethod.POST)
	public @ResponseBody Map<String, Object> updateWfNode(@RequestBody List<LinkedHashMap<String, Object>> param) {
		return wfNodeService.updateWfNode(param);
	}
}
