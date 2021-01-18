package com.mycompany.myproject.privs;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.mycompany.myproject.role.RoleService;

import io.swagger.annotations.Api;

@RestController
@Api(description = "DCV Management API")
@RequestMapping("/privs")
public class PrivsController {
	
	@Autowired
	private PrivsService privsService;
	
	@RequestMapping(value = "/getPrivs", method = RequestMethod.POST)
	public @ResponseBody Map<String, Object> getPrivs(@RequestBody Map<String, Object> param){
		return privsService.getPrivs(param);
	}

}
