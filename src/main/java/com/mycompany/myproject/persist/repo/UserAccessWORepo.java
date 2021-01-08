package com.mycompany.myproject.persist.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mycompany.myproject.persist.entity.UserAccessWO;

public interface UserAccessWORepo extends JpaRepository<UserAccessWO, Long> {

	List<UserAccessWO> findByUserNameAndPassword(String userName, String password);
	
	List<UserAccessWO> findByUserName(String userName);
}
