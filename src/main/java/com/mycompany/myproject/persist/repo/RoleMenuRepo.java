package com.mycompany.myproject.persist.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mycompany.myproject.persist.entity.RoleMenu;

public interface RoleMenuRepo extends JpaRepository<RoleMenu, Integer> {
	
	public List<RoleMenu> findByRoleCode(String roleCode);
	
	public List<RoleMenu> findByMenuId(Integer menuId);
	
}
