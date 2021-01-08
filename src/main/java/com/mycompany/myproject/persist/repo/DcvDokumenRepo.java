package com.mycompany.myproject.persist.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mycompany.myproject.persist.entity.DcvDokumen;

public interface DcvDokumenRepo extends JpaRepository<DcvDokumen, Long> {

	List<DcvDokumen> findByDcvhId(Long dcvhId);
	
	DcvDokumen findByDcvhIdAndDocType(Long dcvhId, String docType);
}
