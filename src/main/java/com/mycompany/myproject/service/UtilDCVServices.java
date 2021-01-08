package com.mycompany.myproject.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletContext;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.jcraft.jsch.ChannelSftp;
import com.jcraft.jsch.JSch;
import com.jcraft.jsch.JSchException;
import com.jcraft.jsch.Session;
import com.jcraft.jsch.SftpException;
import com.mycompany.myproject.persist.entity.LookupCode;
import com.mycompany.myproject.persist.entity.ParameterDCV;
import com.mycompany.myproject.persist.repo.LookupCodeRepo;
import com.mycompany.myproject.persist.repo.ParameterDCVRepo;

@Service
public class UtilDCVServices {

	private static final Logger logger = LoggerFactory.getLogger(UtilDCVServices.class);
	
	@Autowired
	ServletContext context;
	
	@Autowired
	private ParameterDCVRepo parameterRepo;
	@Autowired
	private LookupCodeRepo lookupCodeRepo;
	
	private String remoteDir;
	private String remoteHost;
	private String username;
	private String password;
	private int port;
	
	private String getTitleFromParam(String title) {
		String hasil = "";
		List<LookupCode> param = lookupCodeRepo.findByTitle(title);
		
		if(null != param && param.size() > 0){
			hasil = param.get(0).getValue();
		}
		/*ParameterDCV param = parameterRepo.findByTitle(title);
		if(param != null) {
			hasil = param.getValue();
		}*/
		return hasil;
	}
	
	private ChannelSftp setupJsch() throws JSchException {
		remoteHost = this.getTitleFromParam("REMOTE.HOST");
		username = this.getTitleFromParam("USER.HOST.TOMCAT");
		password = this.getTitleFromParam("PASS.HOST.TOMCAT");
		port = Integer.parseInt(this.getTitleFromParam("PORT.HOST.TOMCAT"));
		
	    JSch jsch = new JSch();
	    
	    Session jschSession = jsch.getSession(username, remoteHost, port);
	    jschSession.setPassword(password);
	    jschSession.setConfig("StrictHostKeyChecking", "no");
	    jschSession.connect();
	    return (ChannelSftp) jschSession.openChannel("sftp");
	}
	
	public void whenUploadFileUsingJsch_thenSuccess(MultipartFile file, String fileName) throws JSchException, SftpException {
		remoteDir = this.getTitleFromParam("REMOTE.DIR");
		
	    ChannelSftp channelSftp = setupJsch();
	    channelSftp.connect();
	  
	    try {
	    	String originalName = fileName;
	    	InputStream inputStream = file.getInputStream();
	    	channelSftp.put(inputStream, remoteDir.concat(originalName));
	    	
		    logger.info("Berhasil koneksi ke SSH:"+remoteHost);
		  
		    channelSftp.exit();
	    } catch (IOException ex) {
            System.out.println("Error: " + ex.getMessage());
            ex.printStackTrace();
        }
	    
	}
	
	public Map<String, String> usualUploadFile(MultipartFile file, String fileName, String dir) {
		Map<String, String> hasil = new HashMap<>();
		try {
	    	InputStream inputStream = file.getInputStream();
	    	remoteDir = this.getTitleFromParam("PATH").concat(this.getTitleFromParam("REMOTE.DIR")).concat(dir);
	    	
	    	File fileToSave = new File(remoteDir);
	    	if (!fileToSave.exists()) {
	    		fileToSave.mkdirs();
	    	}
	    	fileToSave = new File(remoteDir.concat("/") + fileName);
	    	logger.info("Taro File di :"+fileToSave);
			Files.copy(inputStream, fileToSave.toPath(), StandardCopyOption.REPLACE_EXISTING);
			
			//create output HTML that uses the 
			hasil.put("message", "Berhasil Upload File "+fileToSave);
	    } catch (IOException ex) {
            System.out.println("Error: " + ex.getMessage());
            ex.printStackTrace();
        }
		return hasil;
	}
	
	public Map<String, String> downloadAddr(String dir) {
		Map<String, String> hasil = new HashMap<>();
		String remoteDir = this.getTitleFromParam("REMOTE.DIR").concat(dir).concat("/");
		
		hasil.put("alamat", remoteDir);
		return hasil;
	}
}
