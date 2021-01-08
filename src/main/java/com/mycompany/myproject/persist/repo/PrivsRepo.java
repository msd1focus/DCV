package com.mycompany.myproject.persist.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mycompany.myproject.persist.entity.Privs;

public interface PrivsRepo extends JpaRepository<Privs, String> {
	
//	public List<Privs> findByPrivNameStartsWith(String privName);
//	
//	public List<Privs> findByPrivNameContains(String privName);
	
	public List<Privs> findByPrivCode(String privCode);
	
	public List<Privs> findByRefId1(String refId);
}
