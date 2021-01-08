package com.mycompany.myproject.persist.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.mycompany.myproject.persist.entity.WFNode;

public interface WFNodeRepo extends JpaRepository<WFNode, String> {
	
	WFNode findByNodeCode(String nodeCode);
	
	@Query("SELECT e FROM WFNode e WHERE e.bagian = ?1 ORDER BY e.nodeCode ASC")
	public List<WFNode> findByBagian(String bagian);
	
//	@Query("SELECT e FROM WFNode e WHERE e.bagian = ?1 ORDER BY e.nodeType ASC")
//	public List<WFNode> findByBagian2(String bagian);
//	
//	@Query("SELECT d FROM WFNode d WHERE d.noUrut = ?1 ORDER BY d.bagian ASC")
//	public List<WFNode> findByUrut(String noUrut);
	
	@Query("SELECT c FROM WFNode c WHERE c.nodeType = ?1 ORDER BY c.bagian ASC")
	public List<WFNode> findByType(String nodeType);
	
}
