package com.mycompany.myproject.wftask;

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
@RequestMapping("/wftask")
public class WFTaskController {
	
	private static final Logger logger = LoggerFactory.getLogger(HolidayController.class);
	
	@Autowired
	WFTaskService wfTaskService;
	
	/*Service 
	 * update WF_Task for submit Action*/
	@RequestMapping(value = "/updateWFTaskFromAction", method = RequestMethod.POST)
	public @ResponseBody Map<String, Object> updateWFTaskFromAction(@RequestBody Map<String, Object> param) {
		return wfTaskService.updateWFTaskFromAction(param);
	}
	
	/*Service 
	 * get Work Flow Task by No.DCV for View Detail Action*/
	@RequestMapping(value = "/getWfTaskByNoDcv", method = RequestMethod.POST)
	public @ResponseBody WFTask getWfTaskByNoDcv(@RequestBody String noDcv) {
		return wfTaskService.getWfTaskByNoDcv(noDcv);
	}
	
	@RequestMapping(value = "/getWfTaskByIdAndNoDcv", method = RequestMethod.POST)
	public @ResponseBody WFTask getWfTaskByIdAndNoDcv(@RequestBody Map<String, Object> param) {
		return wfTaskService.getWfTaskByIdAndNoDcv(param);
	}
	
}
