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

import com.mycompany.myproject.persist.entity.User;
import com.mycompany.myproject.persist.repo.UserRepo;
import com.mycompany.myproject.service.DataDCVServices;

import io.swagger.annotations.Api;

@RestController
@Api(description = "DCV Management API")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserRepo userRepo;
//    @Autowired
//    private UserAccessDCVRepo userAccessDCVRepo;
    
    @Autowired
    private DataDCVServices dataDCVServices;

    @RequestMapping(value = "/users", method = RequestMethod.GET)
    public @ResponseBody List<User> usersList() {
        logger.debug("get users list");
        List<User> list = userRepo.findAll();
        return list;
    }

    @RequestMapping(value = "/users/{userId}", method = RequestMethod.GET)
    public @ResponseBody User getUser(@PathVariable Long userId) {
        logger.debug("get user");
        return userRepo.findOne(userId);
    }

    @RequestMapping(value = "/users", method = RequestMethod.POST)
    public @ResponseBody User saveUser(@RequestBody User user) {
        logger.debug("save user");
        userRepo.save(user);
        return user;
    }
    
//    @RequestMapping(value = "/dcvUsers", method = RequestMethod.POST)
//    public @ResponseBody List<UserAccessDCV> dcvUsersList() {
//        logger.debug("get DCV users list");
//        List<UserAccessDCV> list = userAccessDCVRepo.findAll();
//        return list;
//    }
//
//    @RequestMapping(value = "/getUserByUserName", method = RequestMethod.POST)
//    public @ResponseBody List<UserAccessDCV> getUserByUserName(@RequestBody UserAccessDCV user) {
//    	List<UserAccessDCV> userlist = new ArrayList<>();
//    	if(user.getUserName() != null && !user.getUserName().equalsIgnoreCase("")) {
//    		userlist = userAccessDCVRepo.findByUserNameContaining(user.getUserName());
//    	} else {
//    		userlist = userAccessDCVRepo.findAll();
//    	}
//    	return userlist;
//    }
}

 
