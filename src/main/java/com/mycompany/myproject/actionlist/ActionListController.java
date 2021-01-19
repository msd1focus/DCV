package com.mycompany.myproject.actionlist;

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
import com.mycompany.myproject.service.dto.ActionListDto;

import io.swagger.annotations.Api;

@RestController
@Api(description = "DCV Management API")
@RequestMapping("/actionlist")
public class ActionListController {
	
	private static final Logger logger = LoggerFactory.getLogger(HolidayController.class);
	
	@Autowired
	ActionListService actionListService;
	
	@RequestMapping(value = "/getActionList", method = RequestMethod.POST)
	public @ResponseBody List<ActionListDto> getActionList(@RequestBody Map<String, Object> param){
		return actionListService.findActionList(param);
	}
	
	/*Service 
	 * Find Like for Action from Action_List*/
	@RequestMapping(value = "/findActionListByDcvAndBagianAndNodeCode", method = RequestMethod.POST)
	public @ResponseBody List<ActionList> findActionListByDcvAndBagianAndNodeCode(@RequestBody ActionList actList) {
		return actionListService.findActionListByDcvAndBagianAndNodeCode(actList);
	}
}
