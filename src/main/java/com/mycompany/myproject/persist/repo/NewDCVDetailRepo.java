package com.mycompany.myproject.persist.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mycompany.myproject.persist.entity.NewDCVDetail;

public interface NewDCVDetailRepo extends JpaRepository<NewDCVDetail, String> {

	List<NewDCVDetail> findByPropId(Integer propId);
}
