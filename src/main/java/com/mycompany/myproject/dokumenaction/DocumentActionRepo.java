package com.mycompany.myproject.dokumenaction;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;


public interface DocumentActionRepo extends JpaRepository<DocumentAction, Long>{
	
	List<DocumentAction> findByBagian(String bagian);
	

}
