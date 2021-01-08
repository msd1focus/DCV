package com.mycompany.myproject.persist.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mycompany.myproject.persist.entity.InformationPC;

public interface InformationPCRepo extends JpaRepository<InformationPC, Integer> {

	InformationPC findByNoPCAndKeyPC(String noPC, String keyPC);
}
