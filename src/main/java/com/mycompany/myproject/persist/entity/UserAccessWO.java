package com.mycompany.myproject.persist.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.hibernate.annotations.GenericGenerator;

@Entity
@Table(name = "WO_USERS")
public class UserAccessWO {

	private static final long serialVersionUID = 1L;
	
	@Id
	@GenericGenerator(name = "generator", strategy = "increment")
	@GeneratedValue(generator = "generator")
	@Column(name = "USER_ID", nullable = false)
	private Long id;
	
	@Column(name="USERNAME")
	private String userName;
	
	@Column(name="COMPANY")
	private String company;
	
	@Column(name="NAME")
	private String fullName;
	
	@Column(name="EMAIL")
	private String email;
	
	@Column(name="PASSWORD")
	private String password;
	
	@Column(name="CUST_ID")
	private Integer custId;
	
	@Column(name="ACTIVE")
	private Integer active;
	
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinTable(name="DCV_USER_ROLE", joinColumns = { @JoinColumn(name = "USER_ID", referencedColumnName = "USER_ID") }, 
		inverseJoinColumns = { @JoinColumn(name = "ROLE_CODE", referencedColumnName = "ROLE_CODE") } )
	private Role role;
	
	@Transient
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

	public String getCompany() {
		return company;
	}

	public void setCompany(String company) {
		this.company = company;
	}

	public String getFullName() {
		return fullName;
	}

	public void setFullName(String fullName) {
		this.fullName = fullName;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public Integer getCustId() {
		return custId;
	}

	public void setCustId(Integer custId) {
		this.custId = custId;
	}

	public Integer getActive() {
		return active;
	}

	public void setActive(Integer active) {
		this.active = active;
	}

	public Role getRole() {
		return role;
	}

	public void setRole(Role role) {
		this.role = role;
	}

	public String getJenisUser() {
		return jenisUser;
	}

	public void setJenisUser(String jenisUser) {
		this.jenisUser = jenisUser;
	}
}
