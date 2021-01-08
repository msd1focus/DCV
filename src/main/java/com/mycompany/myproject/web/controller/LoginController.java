package com.mycompany.myproject.web.controller;

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

import com.mycompany.myproject.persist.entity.AllUsers;
import com.mycompany.myproject.persist.entity.User;
import com.mycompany.myproject.persist.repo.UserRepo;
import com.mycompany.myproject.service.DataDCVServices;

import io.swagger.annotations.Api;

@RestController
@Api(description = "DCV Management API")
public class LoginController {
	private static final Logger logger = LoggerFactory.getLogger(UserController.class);

	@Autowired
    private UserRepo userRepo;
	@Autowired
	private DataDCVServices dataDCVServices;
//	@Autowired
//    private UserAccessDCVRepo userAccessDCVRepo;
	
	@RequestMapping(value = "/login", method = RequestMethod.POST)
    public @ResponseBody Boolean login(@RequestBody User user) {
        Boolean authenticated = false;
        List<User> userExisting = userRepo.findByUserIdAndPassword(user.getUserId(), user.getPassword());
        if(userExisting.size() > 0) {
        	authenticated = true;
        }
        logger.info("Login leak : "+authenticated);
        return authenticated;
    }
	
//	@RequestMapping(value = "/loginOrcl", method = RequestMethod.POST)
//    public @ResponseBody Boolean loginOrcl(@RequestBody UserAccessDCV user) {
//        Boolean authenticated = false;
//        List<UserAccessDCV> userExisting = userAccessDCVRepo.findByUserNameAndPassword(user.getUserName(), user.getPassword());
//        
//        if(userExisting.size() > 0) {
//        	authenticated = true;
//        }
//        return authenticated;
//    }
	
	@RequestMapping(value = "/loginDCV", method = RequestMethod.POST)
    public @ResponseBody Map<String, Object> loginDCV(@RequestBody AllUsers user) {
		Map<String, Object> hasil = dataDCVServices.setForUserLogin(user.getUserName(), user.getPassword());
		
        return hasil;
    }
}
