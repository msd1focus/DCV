package com.mycompany.myproject.persist.entity;

import java.math.BigDecimal;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;

@Entity
@Table(name = "ROLE_PRIVS")
public class RolePrivs {

	private static final long serialVersionUID = 1L;
	
	@Id
	@Column(name="ID")
	private Integer idPriv;
	
	@Column(name="ROLE_CODE")
	private String roleCode;
	
	@Column(name="PRIV_CODE")
	private String privCode;

	public Integer getIdPriv() {
		return idPriv;
	}

	public void setIdPriv(Integer idPriv) {
		this.idPriv = idPriv;
	}

	public String getRoleCode() {
		return roleCode;
	}

	public void setRoleCode(String roleCode) {
		this.roleCode = roleCode;
	}

	public String getPrivCode() {
		return privCode;
	}

	public void setPrivCode(String privCode) {
		this.privCode = privCode;
	}

}
