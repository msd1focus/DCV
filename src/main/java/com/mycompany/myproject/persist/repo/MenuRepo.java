package com.mycompany.myproject.persist.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.mycompany.myproject.persist.entity.Menu;
import com.mycompany.myproject.persist.entity.Role;

public interface MenuRepo extends JpaRepository<Menu, Integer> {
	
	public List<Menu> findByMenuId(Integer menuId);
	
	@Query("SELECT m FROM Menu m WHERE m.url <> ?1 and m.parent is null and m.icon is null")
	public List<Menu> findByNotUrlAndParentIsNull(String url);
	
//	public List<Menu> findByRole(Role role);
//	
//	public List<Menu> findByParentOrderBySequenceAsc(Integer menuId);
//	
//	public List<Menu> findByRoleAndIconIsNotNullAndParentIsNull(Role role);
//	
//	public List<Menu> findByRoleAndUrlAndParentIsNotNull(Role role, String url);
//	
//	@Query("SELECT m FROM Menu m WHERE m.url <> ?1 and m.parent is null and m.icon is null")
//	public List<Menu> findByNotUrlAndParentIsNull(String url);
//	
//	@Query("SELECT m FROM Menu m WHERE m.url <> '#'")
//	public List<Menu> getMenuUrlNotTaggar();
}
