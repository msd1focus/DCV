package com.mycompany.myproject.persist.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mycompany.myproject.persist.entity.DocumentAction;


public interface DocumentActionRepo extends JpaRepository<DocumentAction, Long>{
	
	List<DocumentAction> findByBagian(String bagian);
	

}
