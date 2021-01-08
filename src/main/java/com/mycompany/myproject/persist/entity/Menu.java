package com.mycompany.myproject.persist.entity;

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
@Table(name = "DCV_MENU")
public class Menu {

	private static final long serialVersionUID = 1L;
	
	@Id
	@Column(name="MENU_ID")
	private Integer menuId;
	
	@Column(name="ENABLE")
	private Integer enabled;
	
	@Column(name="ICON")
	private String icon;
	
	@Column(name="TITLE")
	private String title;
	
	@Column(name="URL")
	private String url;
	
	@Column(name="SEQUENCE")
	private Integer sequence;
	
	@Column(name="PARENT")
	private Integer parent;
	
//	@ManyToOne(fetch = FetchType.EAGER)
//	@JoinTable(name="DCV_ROLE_MENU", joinColumns = { @JoinColumn(name = "MENU_ID", referencedColumnName = "MENU_ID") }, 
//		inverseJoinColumns = { @JoinColumn(name = "ROLE_CODE", referencedColumnName = "ROLE_CODE") } )
//	private Role role;
	
	@Transient
	private List<Menu> children;

	public Integer getMenuId() {
		return menuId;
	}

	public void setMenuId(Integer menuId) {
		this.menuId = menuId;
	}

	public Integer getEnabled() {
		return enabled;
	}

	public void setEnabled(Integer enabled) {
		this.enabled = enabled;
	}

	public String getIcon() {
		return icon;
	}

	public void setIcon(String icon) {
		this.icon = icon;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public Integer getSequence() {
		return sequence;
	}

	public void setSequence(Integer sequence) {
		this.sequence = sequence;
	}

	public Integer getParent() {
		return parent;
	}

	public void setParent(Integer parent) {
		this.parent = parent;
	}

	public List<Menu> getChildren() {
		return children;
	}

	public void setChildren(List<Menu> children) {
		this.children = children;
	}

//	public Role getRole() {
//		return role;
//	}
//
//	public void setRole(Role role) {
//		this.role = role;
//	}
}
