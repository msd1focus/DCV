package com.mycompany.myproject.persist.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mycompany.myproject.persist.entity.Holiday;

public interface HolidayRepo extends JpaRepository<Holiday, Long> {

}
