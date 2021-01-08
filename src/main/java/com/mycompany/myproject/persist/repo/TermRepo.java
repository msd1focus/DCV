package com.mycompany.myproject.persist.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mycompany.myproject.persist.entity.Term;

public interface TermRepo extends JpaRepository<Term, Integer> {

}
