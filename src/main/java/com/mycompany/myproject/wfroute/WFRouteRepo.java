package com.mycompany.myproject.wfroute;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface WFRouteRepo extends JpaRepository<WFRoute, Long> {
	
	List<WFRoute> findByNodeId(String nodeId);
	
	@Query("SELECT f FROM WFRoute f WHERE f.nodeId = ?1 AND f.pilihan = ?2")
	WFRoute findByNodeIdPilihan(String nodeId, Integer pilihan);
}
