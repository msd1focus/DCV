package com.mycompany.myproject.web.controller;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.jcraft.jsch.JSchException;
import com.jcraft.jsch.SftpException;
import com.mycompany.myproject.service.UtilDCVServices;

import io.swagger.annotations.Api;

@RestController
@Api(description = "DCV Management API")
public class UtilDCVController {

	private static final Logger logger = LoggerFactory.getLogger(UtilDCVController.class);
	
	@Autowired
	private UtilDCVServices utilDCVServices;
	
	
	/*Service 
	 * Generics for Upload Doc to SSH SFTP DCV*/
	@RequestMapping(value = "/uploadFileSSH", method = RequestMethod.POST, consumes = {"multipart/form-data"})
	public @ResponseBody void uploadFileSSH(@RequestParam(value = "file") MultipartFile file, @RequestParam(value = "fileName") String fileName) throws JSchException, SftpException {
		utilDCVServices.whenUploadFileUsingJsch_thenSuccess(file, fileName);
	}
	
	/*Service 
	 * Generics for Upload Doc to Local Server*/
	@RequestMapping(value = "/uploadFileToServer", method = RequestMethod.POST, consumes = {"multipart/form-data"}) 
	public @ResponseBody Map<String, String> uploadFileToServer(@RequestParam(value = "file") MultipartFile file, @RequestParam(value = "fileName") String fileName,
			@RequestParam(value = "custCode") String dir) {
		return utilDCVServices.usualUploadFile(file, fileName, dir);
	}
	
	/*Service 
	 * Generics for Download Doc from Local Server*/
	@RequestMapping(value = "/downloadFileAddr", method = RequestMethod.POST) 
	public @ResponseBody Map<String, String> downloadFileAddr(@RequestParam(value = "custCode") String dir) {
		return utilDCVServices.downloadAddr(dir);
	}
	
}
