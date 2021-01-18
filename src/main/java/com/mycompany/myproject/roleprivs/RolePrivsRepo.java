package com.mycompany.myproject.roleprivs;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface RolePrivsRepo extends JpaRepository<RolePrivs, Integer> {
	
	public List<RolePrivs> findByRoleCode(String roleCode);
	
	public List<RolePrivs> findByPrivCode(String privCode);
}
