package com.mycompany.myproject.persist.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mycompany.myproject.persist.entity.ParameterDCV;

public interface ParameterDCVRepo extends JpaRepository<ParameterDCV, Integer> {

	ParameterDCV findByTitle(String title);
}
