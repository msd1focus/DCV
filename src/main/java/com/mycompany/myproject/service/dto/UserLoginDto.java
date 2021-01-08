package com.mycompany.myproject.service.dto;

import org.dozer.Mapping;

public class UserLoginDto {

	@Mapping("id")
    private Long id;
	
	@Mapping("userName")
    private String userName;
	
	@Mapping("password")
    private String password;
	
	@Mapping("jenisUser")
    private String jenisUser;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getJenisUser() {
		return jenisUser;
	}

	public void setJenisUser(String jenisUser) {
		this.jenisUser = jenisUser;
	}
}
