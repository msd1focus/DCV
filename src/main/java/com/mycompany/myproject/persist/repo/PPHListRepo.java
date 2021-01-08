package com.mycompany.myproject.persist.repo;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mycompany.myproject.persist.entity.PPHList;

public interface PPHListRepo extends JpaRepository<PPHList, String>{
	
	List<PPHList> findByKodePPH (String codePPH);
}