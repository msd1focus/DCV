package com.mycompany.myproject.rolemenu;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleMenuRepo extends JpaRepository<RoleMenu, Integer> {
	
	public List<RoleMenu> findByRoleCode(String roleCode);
	
	public List<RoleMenu> findByMenuId(Integer menuId);
	
}
