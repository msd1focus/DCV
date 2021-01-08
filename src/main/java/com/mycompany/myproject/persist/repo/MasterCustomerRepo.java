package com.mycompany.myproject.persist.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.mycompany.myproject.persist.entity.MasterCustomer;
import com.mycompany.myproject.persist.entity.WFNode;

public interface MasterCustomerRepo extends JpaRepository<MasterCustomer, Integer>{
	
	MasterCustomer findAreaByCustCode (String custCode);
	List<MasterCustomer> findAreaByRegionFullName (String regionFullName);
	List<MasterCustomer> findRegionCodeByRegionFullName (String regionFullName);
	List<MasterCustomer> findAreaByRegionCode (String regionCode);
	List<MasterCustomer> findLocationByAreaFullName (String areaFullName);
	List<MasterCustomer> findAreaCodeByAreaFullName (String areaFullName);
	List<MasterCustomer> findLocationByAreaCode (String areaCode);
	
	@Query("SELECT DISTINCT g.regionFullName FROM MasterCustomer g")
	public List<MasterCustomer> findAllRegion();
	
	@Query("SELECT DISTINCT j.areaFullName FROM MasterCustomer j WHERE j.regionFullName=?1")
	public List<MasterCustomer> findAllAreaByRegionFullName(String regionFullName);
	
	@Query("SELECT DISTINCT m.locationFullName FROM MasterCustomer m WHERE m.regionFullName=?1 AND m.areaFullName=?2")
	public List<MasterCustomer> findAllLocationByRegionFullNameAndAreaFullName(String regionFullName, String areaFullName);
}
