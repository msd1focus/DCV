package com.mycompany.myproject.role;

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
@RequestMapping("/role")
public class RoleController {
	
	@Autowired
	private RoleService roleService;
	
	@RequestMapping(value = "/getRole", method = RequestMethod.POST)
	public @ResponseBody Role getRole(@RequestBody String userRole) {
		return roleService.getRole(userRole);
	}
	
	@RequestMapping(value = "/getList", method = RequestMethod.GET)
	public @ResponseBody List<Role> getList() {
		return roleService.getList();
	}
	
	@RequestMapping(value = "/save", method = RequestMethod.POST)
	public @ResponseBody Map<String, Object> save(@RequestBody Role param) {
		return roleService.save(param);
	}
	
	@RequestMapping(value = "/update", method = RequestMethod.POST)
	public @ResponseBody Map<String, Object> update(@RequestBody Role param) {
		return roleService.update(param);
	}
	
	@RequestMapping(value = "/delete", method = RequestMethod.POST)
	public @ResponseBody Map<String, Object> delete(@RequestBody Role param) {
		return roleService.delete(param);
	}

}
