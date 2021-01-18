package com.mycompany.myproject.holiday;

import org.springframework.data.jpa.repository.JpaRepository;

public interface HolidayRepo extends JpaRepository<Holiday, Long> {

}
