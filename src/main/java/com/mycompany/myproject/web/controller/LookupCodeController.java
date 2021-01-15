package com.mycompany.myproject.web.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.mycompany.myproject.persist.entity.Holiday;
import com.mycompany.myproject.persist.entity.LookupCode;
import com.mycompany.myproject.persist.entity.User;
import com.mycompany.myproject.persist.repo.UserRepo;
import com.mycompany.myproject.service.DataDCVServices;
import com.mycompany.myproject.service.LookupCodeService;

import io.swagger.annotations.Api;

@RestController
@Api(description = "DCV Management API")
public class LookupCodeController {

	private static final Logger logger = LoggerFactory.getLogger(LookupCodeController.class);

	@Autowired
	private LookupCodeService lookupService;

	/*Service
	 *LookUp Code DCV*/	
	@RequestMapping(value = "/getListLookupCode", method = RequestMethod.GET)
	public @ResponseBody List<LookupCode> getListLookupCode() {
		return lookupService.findAll();
	}
	
	@RequestMapping(value = "/saveLookupCode", method = RequestMethod.POST)
	public @ResponseBody LookupCode saveLookupCode(@RequestBody LookupCode data) {
		return lookupService.save(data);
	}
}
