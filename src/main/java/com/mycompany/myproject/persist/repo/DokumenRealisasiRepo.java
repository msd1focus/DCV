package com.mycompany.myproject.persist.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.mycompany.myproject.persist.entity.DokumenRealisasi;

public interface DokumenRealisasiRepo extends JpaRepository<DokumenRealisasi, Long>{
	
	@Query("SELECT u FROM DokumenRealisasi u WHERE u.tahapanRealisasi = ?1 and u.dcvhId = ?2 order by u.docDt desc")
	List<DokumenRealisasi> findByTahapanAndDcvhIdOrderByDocNo(String tahapanRealisasi , Long dcvhId);
	
	
}