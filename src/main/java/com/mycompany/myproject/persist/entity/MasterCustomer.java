package com.mycompany.myproject.persist.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "MASTER_CUSTOMER")
public class MasterCustomer {
	private static final long serialVersionUID = 1L;
	
	@Id
	@Column(name="CUST_ID")
	private Integer custId;
	
	@Column(name="CUST_CODE")
	private String custCode;
	
	@Column(name="CUST_NAME")
	private String custName;
	
	@Column(name="CUST_FULLNAME")
	private String custFullName;
	
	@Column(name="REGION_CODE")
	private String regionCode;
	
	@Column(name="REGION_NAME")
	private String regionName;
	
	@Column(name="REGION_FULLNAME")
	private String regionFullName;
	
	@Column(name="AREA_CODE")
	private String areaCode;
	
	@Column(name="AREA_NAME")
	private String areaName;
	
	@Column(name="AREA_FULLNAME")
	private String areaFullName;
	
	@Column(name="LOCATION_CODE")
	private String locationCode;
	
	@Column(name="LOCATION_NAME")
	private String locationName;
	
	@Column(name="LOCATION_FULLNAME")
	private String locationFullName;
	
	@Column(name="TYPE_CODE")
	private String typeCode;
	
	@Column(name="TYPE_NAME")
	private String typeName;
	
	@Column(name="TYPE_FULLNAME")
	private String typeFullName;
	
	@Column(name="GROUP_CODE")
	private String groupCode;
	
	@Column(name="GROUP_NAME")
	private String groupName;
	
	@Column(name="GROUP_FULLNAME")
	private String groupFullName;
	
	@Column(name="CUST_STATUS")
	private String custStatus;

	public Integer getCustId() {
		return custId;
	}

	public void setCustId(Integer custId) {
		this.custId = custId;
	}

	public String getCustCode() {
		return custCode;
	}

	public void setCustCode(String custCode) {
		this.custCode = custCode;
	}

	public String getCustName() {
		return custName;
	}

	public void setCustName(String custName) {
		this.custName = custName;
	}

	public String getCustFullName() {
		return custFullName;
	}

	public void setCustFullName(String custFullName) {
		this.custFullName = custFullName;
	}

	public String getRegionCode() {
		return regionCode;
	}

	public void setRegionCode(String regionCode) {
		this.regionCode = regionCode;
	}

	public String getRegionName() {
		return regionName;
	}

	public void setRegionName(String regionName) {
		this.regionName = regionName;
	}

	public String getRegionFullName() {
		return regionFullName;
	}

	public void setRegionFullName(String regionFullName) {
		this.regionFullName = regionFullName;
	}

	public String getAreaCode() {
		return areaCode;
	}

	public void setAreaCode(String areaCode) {
		this.areaCode = areaCode;
	}

	public String getAreaName() {
		return areaName;
	}

	public void setAreaName(String areaName) {
		this.areaName = areaName;
	}

	public String getAreaFullName() {
		return areaFullName;
	}

	public void setAreaFullName(String areaFullName) {
		this.areaFullName = areaFullName;
	}

	public String getLocationCode() {
		return locationCode;
	}

	public void setLocationCode(String locationCode) {
		this.locationCode = locationCode;
	}

	public String getLocationName() {
		return locationName;
	}

	public void setLocationName(String locationName) {
		this.locationName = locationName;
	}

	public String getLocationFullName() {
		return locationFullName;
	}

	public void setLocationFullName(String locationFullName) {
		this.locationFullName = locationFullName;
	}

	public String getTypeCode() {
		return typeCode;
	}

	public void setTypeCode(String typeCode) {
		this.typeCode = typeCode;
	}

	public String getTypeName() {
		return typeName;
	}

	public void setTypeName(String typeName) {
		this.typeName = typeName;
	}

	public String getTypeFullName() {
		return typeFullName;
	}

	public void setTypeFullName(String typeFullName) {
		this.typeFullName = typeFullName;
	}

	public String getGroupCode() {
		return groupCode;
	}

	public void setGroupCode(String groupCode) {
		this.groupCode = groupCode;
	}

	public String getGroupName() {
		return groupName;
	}

	public void setGroupName(String groupName) {
		this.groupName = groupName;
	}

	public String getGroupFullName() {
		return groupFullName;
	}

	public void setGroupFullName(String groupFullName) {
		this.groupFullName = groupFullName;
	}

	public String getCustStatus() {
		return custStatus;
	}

	public void setCustStatus(String custStatus) {
		this.custStatus = custStatus;
	}
	
}