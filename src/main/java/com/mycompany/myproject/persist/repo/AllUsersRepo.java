package com.mycompany.myproject.persist.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mycompany.myproject.persist.entity.AllUsers;

public interface AllUsersRepo extends JpaRepository<AllUsers, Long> {

	List<AllUsers> findByUserNameAndPassword(String userName, String password);
	
	List<AllUsers> findByUserNameAndUserType(String userName, String userType);
	
	List<AllUsers> findByUserNameAndPasswordAndUserType(String userName, String password, String userType);
}
