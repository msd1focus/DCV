package com.mycompany.myproject.rolemenu;

import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;

@Entity
@Table(name = "DCV_ROLE_MENU")
public class RoleMenu {

	private static final long serialVersionUID = 1L;
	
	@Id
	@Column(name="MENU_ID")
	private Integer menuId;
	
	@Column(name="ROLE_CODE")
	private String roleCode;

	public Integer getMenuId() {
		return menuId;
	}

	public void setMenuId(Integer menuId) {
		this.menuId = menuId;
	}

	public String getRoleCode() {
		return roleCode;
	}

	public void setRoleCode(String roleCode) {
		this.roleCode = roleCode;
	}	

}
