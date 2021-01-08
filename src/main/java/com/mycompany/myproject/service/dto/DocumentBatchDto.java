package com.mycompany.myproject.service.dto;

import java.math.BigDecimal;
import java.util.Date;

import org.dozer.Mapping;

public class DocumentBatchDto {
	
	@Mapping("no_dcv")
	private String noDcv;
	
	@Mapping("cust_code")
	private String custCode;
	
	@Mapping("cust_name")
	private String custName;
	
	@Mapping("region")
	private String region;
	
	@Mapping("area")
	private String area;
	
	@Mapping("location")
	private String location;
	
	@Mapping("no_pc")
	private String noPc;
	
	@Mapping("appv_val")
	private BigDecimal appvVal;
	
	@Mapping("no_kwitansi")
	private String noKwitansi;
	
	@Mapping("no_fp")
	private String noFp;
	
	@Mapping("po_no")
	private String poNo;
	
	@Mapping("gr_no")
	private String grNo;
	
	@Mapping("task_id")
	private BigDecimal taskId ;
	
	@Mapping("note")
	private String note;
	
	public DocumentBatchDto() {}
		
	public DocumentBatchDto(Object[] data) {
		super();
		this.noDcv			= data[0] != null ? data[0].toString() : "";
		this.custCode		= data[1] != null ? data[1].toString() : "";
		this.custName		= data[2] != null ? data[2].toString() : "";
		this.region			= data[3] != null ? data[3].toString() : "";
		this.area			= data[4] != null ? data[4].toString() : "";
		this.location		= data[5] != null ? data[5].toString() : "";
		this.noPc			= data[6] != null ? data[6].toString() : "";
		this.appvVal		= data[7] != null ? new BigDecimal(data[7].toString())  : null;
		this.noKwitansi		= data[8] != null ? data[8].toString() : "";
		this.noFp			= data[9] != null ? data[9].toString() : "";
		this.poNo			= data[10] != null ? data[10].toString() : "";
		this.grNo			= data[11] != null ? data[11].toString() : "";
		this.taskId			= data[12] != null ? new BigDecimal(data[12].toString()) : null;
		this.note			= data[13] != null ? data[13].toString() : "";
	}

	public String getNoDcv() {
		return noDcv;
	}

	public void setNoDcv(String noDcv) {
		this.noDcv = noDcv;
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

	public String getRegion() {
		return region;
	}

	public void setRegion(String region) {
		this.region = region;
	}

	public String getArea() {
		return area;
	}

	public void setArea(String area) {
		this.area = area;
	}

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}

	public String getNoPc() {
		return noPc;
	}

	public void setNoPc(String noPc) {
		this.noPc = noPc;
	}

	public BigDecimal getAppvVal() {
		return appvVal;
	}

	public void setAppvVal(BigDecimal appvVal) {
		this.appvVal = appvVal;
	}

	public String getNoKwitansi() {
		return noKwitansi;
	}

	public void setNoKwitansi(String noKwitansi) {
		this.noKwitansi = noKwitansi;
	}

	public String getNoFp() {
		return noFp;
	}

	public void setNoFp(String noFp) {
		this.noFp = noFp;
	}

	public String getPoNo() {
		return poNo;
	}

	public void setPoNo(String poNo) {
		this.poNo = poNo;
	}

	public String getGrNo() {
		return grNo;
	}

	public void setGrNo(String grNo) {
		this.grNo = grNo;
	}

	public BigDecimal getTaskId() {
		return taskId;
	}

	public void setTaskId(BigDecimal taskId) {
		this.taskId = taskId;
	}

	public String getNote() {
		return note;
	}

	public void setNote(String note) {
		this.note = note;
	}

}




