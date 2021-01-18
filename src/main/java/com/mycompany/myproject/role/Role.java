package com.mycompany.myproject.role;

import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.hibernate.annotations.GenericGenerator;

import com.mycompany.myproject.menu.Menu;

@Entity
@Table(name = "DCV_ROLE")
public class Role {

	private static final long serialVersionUID = 1L;
	
	@Id
	@Column(name="ROLE_CODE", nullable = false)
	private String roleCode;
	
	@Column(name="ROLE_NAME")
	private String roleName;
	
	@Column(name="ROLE_TYPE")
	private String roleType;
	
	@Column(name="BAGIAN")
	private String bagian;
	
	@Transient
	private List<Menu> menuList;
	
	@Transient
	private List<String> menus;

	public String getRoleCode() {
		return roleCode;
	}

	public void setRoleCode(String roleCode) {
		this.roleCode = roleCode;
	}

	public String getRoleName() {
		return roleName;
	}

	public void setRoleName(String roleName) {
		this.roleName = roleName;
	}

	public String getRoleType() {
		return roleType;
	}

	public void setRoleType(String roleType) {
		this.roleType = roleType;
	}

	public String getBagian() {
		return bagian;
	}

	public void setBagian(String bagian) {
		this.bagian = bagian;
	}

	public List<Menu> getMenuList() {
		return menuList;
	}

	public void setMenuList(List<Menu> menuList) {
		this.menuList = menuList;
	}

	public List<String> getMenus() {
		return menus;
	}

	public void setMenus(List<String> menus) {
		this.menus = menus;
	}
}
