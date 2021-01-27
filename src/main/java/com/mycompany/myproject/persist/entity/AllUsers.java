package com.mycompany.myproject.persist.entity;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.mycompany.myproject.role.Role;

@Entity
@Table(name = "USER_ACCESS") /*Table VIEW*/
public class AllUsers {
	
	@Id
	@Column(name="USER_ID")
	private String userId;
	
	@Column(name="USER_NAME")
	private String userName;
	
	@Column(name="PASSWORD")
	private String password;
	
	@Column(name="FULL_NAME")
	private String fullName;
	
	@Column(name="ACTIVE_PERIOD_FROM")
	private Date activePeriodFrom;
	
	@Column(name="ACTIVE_PERIOD_TO")
	private Date activePeriodTo;
	
	@Column(name="USER_DIVISION")
	private String userDivision;
	
	@Column(name="DIRECT_SPV")
	private String directSpv;
	
	@Column(name="EMAIL")
	private String email;
	
	@Column(name="USER_TYPE")
	private String userType;
	
	@Column(name="CUST_LOCATION")
	private String location;
	
	@Column(name="CUST_REGION")
	private String region;
	
	@Column(name="CUST_AREA")
	private String area;
	
	@Column(name="USER_ROLE")
	private String userRole;
	
	@Transient
	private Role role;

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
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

	public String getFullName() {
		return fullName;
	}

	public void setFullName(String fullName) {
		this.fullName = fullName;
	}

	public Date getActivePeriodFrom() {
		return activePeriodFrom;
	}

	public void setActivePeriodFrom(Date activePeriodFrom) {
		this.activePeriodFrom = activePeriodFrom;
	}

	public Date getActivePeriodTo() {
		return activePeriodTo;
	}

	public void setActivePeriodTo(Date activePeriodTo) {
		this.activePeriodTo = activePeriodTo;
	}

	public String getUserDivision() {
		return userDivision;
	}

	public void setUserDivision(String userDivision) {
		this.userDivision = userDivision;
	}

	public String getDirectSpv() {
		return directSpv;
	}

	public void setDirectSpv(String directSpv) {
		this.directSpv = directSpv;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getUserType() {
		return userType;
	}

	public void setUserType(String userType) {
		this.userType = userType;
	}

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}

	public String getRegion() {
		return region;
	}

	public void setRegion(String region) {
		this.region = region;
	}

	public String getArea() {
		return area;
	}

	public void setArea(String area) {
		this.area = area;
	}

	public String getUserRole() {
		return userRole;
	}

	public void setUserRole(String userRole) {
		this.userRole = userRole;
	}

	public Role getRole() {
		return role;
	}

	public void setRole(Role role) {
		this.role = role;
	}
}
