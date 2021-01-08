package com.mycompany.myproject.persist.repo;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mycompany.myproject.persist.entity.RolePrivs;

public interface RolePrivsRepo extends JpaRepository<RolePrivs, Integer> {
	
	public List<RolePrivs> findByRoleCode(String roleCode);
	
	public List<RolePrivs> findByPrivCode(String privCode);
}
