package com.mycompany.myproject.persist.repo;

import com.mycompany.myproject.persist.entity.User;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;


public interface UserRepo extends JpaRepository<User, Long> {
    
	User findByUserId(String login);
	
	List<User> findByUserIdAndPassword(String userId, String password);

}
