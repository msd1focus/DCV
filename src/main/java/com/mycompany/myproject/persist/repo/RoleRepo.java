package com.mycompany.myproject.persist.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mycompany.myproject.persist.entity.Role;

public interface RoleRepo extends JpaRepository<Role, String> {

	Role findByRoleCode(String roleCode);
}
