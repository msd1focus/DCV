package com.mycompany.myproject.persist.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.mycompany.myproject.persist.entity.TcApproval;


public interface TcApprovalRepo extends JpaRepository<TcApproval, Long> {
	
	List<TcApproval> findByDcvlId(Long dcvlId); 
	
	@Query("SELECT sum(u.nilaiTotal) FROM TcApproval u WHERE u.dcvlId = ?1 ")
	Long countNilaiTotalByDcvhl(Long dcvlId);
	
	
	

}
