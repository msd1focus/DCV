package com.mycompany.myproject.role;

import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepo extends JpaRepository<Role, String> {

	Role findByRoleCode(String roleCode);
}
