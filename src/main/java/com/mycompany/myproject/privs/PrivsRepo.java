package com.mycompany.myproject.privs;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PrivsRepo extends JpaRepository<Privs, String> {
	
//	public List<Privs> findByPrivNameStartsWith(String privName);
//	
//	public List<Privs> findByPrivNameContains(String privName);
	
	public List<Privs> findByPrivCode(String privCode);
	
	public List<Privs> findByRefId1(String refId);
}
