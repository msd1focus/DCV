package com.mycompany.myproject.service.dto;

import java.math.BigDecimal;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.dozer.Mapping;

import com.mycompany.myproject.persist.entity.DcvDokumen;
import com.mycompany.myproject.persist.entity.UiDcvRequestDetail;

public class DcvListDto {

	@Mapping("dcvh_id")
	private BigDecimal dcvhId;
	
    @Mapping("dcvh_no_dcv")
	private String noDcv;
    
//    @Mapping("dcvh_periode_dcv_start")
//	private Date periodDCVFrom;
//    
//    @Mapping("dcvh_periode_dcv_end")
//	private Date periodDCVTo;
    
    @Mapping("dcvh_submit_time")
	private Date submitTime;
	
    @Mapping("dcvh_cust_code")
	private String custCode;
    
    @Mapping("dcvh_cust_name")
	private String custName;
    
    @Mapping("dcvh_company")
    private String company;
    
    @Mapping("dcvh_no_pc")
	private String noPC;
    
    @Mapping("dcvh_region")
	private String region;
    
    @Mapping("dcvh_area")
	private String area;
    
    @Mapping("dcvh_location")
	private String location;
    
    @Mapping("dcvh_periode_pc_start")
	private Date periodPCFrom;
    
    @Mapping("dcvh_periode_pc_end")
	private Date periodPCTo;
    
    @Mapping("dcvh_pc_kategori")
	private String kategoriPC;
    
    @Mapping("dcvh_pc_tipe")
	private String tipePC;
    
    @Mapping("dcvh_value")
	private BigDecimal value;
    
    @Mapping("dcvh_appv_value")
	private BigDecimal appvValue;
    
    @Mapping("nofaktur")
	private String noFaktur;
    
    @Mapping("nokwitansi")
	private String nokwitansi;
    
    @Mapping("dcvh_last_step")
	private String lasStep;
    
    @Mapping("dcvh_current_step")
	private String currentStep;
    
    @Mapping("taskid")
	private BigDecimal taskId;
    
    @Mapping("return_task")
	private String returnTask;
    
    @Mapping("nodecode")
	private String nodecode;
    
    @Mapping("dcvh_status")
	private String status;
    
    @Mapping("sla")
	private BigDecimal sla;
    
    private String periodDCVFromString;
    private String periodDCVToString;
    private String submitTimeString;
    private String periodPCFromString;
    private String periodPCToString;
    
    private BigDecimal totalAppvQty;
	private BigDecimal totalAppvValExcl;
	private BigDecimal totalSelisih;
	private BigDecimal grandTotalAppvValExcl;
	private BigDecimal totalPpnVal;
	private BigDecimal totalPphVal;
	private BigDecimal totalAppvNet;
	
	private List<DcvDokumen> dcvDokumenDetail = new ArrayList<DcvDokumen>();
	private List<UiDcvRequestDetail> dcvRequestDetail = new ArrayList<UiDcvRequestDetail>();
    
    public DcvListDto() {}
    
    public DcvListDto(Object[] data) {
    	super();
    	
    	DateFormat f1 = new SimpleDateFormat("dd/MM/yyyy");
    	DateFormat f2 = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
    	
    	this.dcvhId				= (BigDecimal) data[0];
    	this.noDcv				= (String) data[1];
    	this.submitTime			= (Date) data[2];
    	this.submitTimeString	= f2.format(data[2]);
    	this.custCode			= (String) data[3];
    	this.custName			= (String) data[4];
    	this.company			= (String) data[5];
    	this.noPC				= (String) data[6];
    	this.region				= (String) data[7];
    	this.area				= (String) data[8];
    	this.location			= (String) data[9];
    	this.periodPCFrom		= (Date) data[10];
    	this.periodPCFromString	= f1.format(data[10]);
    	this.periodPCTo			= (Date) data[11];
    	this.periodPCToString	= f1.format(data[11]);
    	this.kategoriPC			= (String) data[12];
    	this.tipePC				= (String) data[13];
    	this.value				= (BigDecimal) data[14];
    	this.appvValue			= (BigDecimal) data[15];
    	this.noFaktur			= (String) data[16];
    	this.nokwitansi			= (String) data[17];
    	this.lasStep			= (String) data[18];
    	this.currentStep		= (String) data[19];
    	this.taskId				= (BigDecimal) data[20];
    	this.returnTask			= (String) data[21];
    	this.nodecode			= (String) data[22];
    	this.status				= (String) data[23];
    	this.sla				= (BigDecimal) data[24];
    	
//    	this.dcvhId				= (BigDecimal) data[0];
//    	this.noDcv				= (String) data[1];
//    	this.periodDCVFrom		= (Date) data[2];
//    	this.periodDCVFromString= f1.format(data[2]);
//    	this.periodDCVTo		= (Date) data[3];
//    	this.periodDCVToString	= f1.format(data[3]);
//    	this.submitTime			= (Date) data[4];
//    	this.submitTimeString	= f2.format(data[4]);
//    	this.custCode			= (String) data[5];
//    	this.custName			= (String) data[6];
//    	this.company			= (String) data[7];
//    	this.noPC				= (String) data[8];
//    	this.region				= (String) data[9];
//    	this.area				= (String) data[10];
//    	this.location			= (String) data[11];
//    	this.periodPCFrom		= (Date) data[12];
//    	this.periodPCFromString	= f1.format(data[12]);
//    	this.periodPCTo			= (Date) data[13];
//    	this.periodPCToString	= f1.format(data[13]);
//    	this.kategoriPC			= (String) data[14];
//    	this.tipePC				= (String) data[15];
//    	this.value				= (BigDecimal) data[16];
//    	this.appvValue			= (BigDecimal) data[17];
//    	this.noFaktur			= (String) data[18];
//    	this.nokwitansi			= (String) data[19];
//    	this.lasStep			= (String) data[20];
//    	this.currentStep		= (String) data[21];
//    	this.taskId				= (BigDecimal) data[22];
//    	this.returnTask			= (String) data[23];
//    	this.nodecode			= (String) data[24];
//    	this.status				= (String) data[25];
//    	this.sla				= (BigDecimal) data[26];
    }

	public BigDecimal getDcvhId() {
		return dcvhId;
	}

	public void setDcvhId(BigDecimal dcvhId) {
		this.dcvhId = dcvhId;
	}

	public String getNoDcv() {
		return noDcv;
	}

	public void setNoDcv(String noDcv) {
		this.noDcv = noDcv;
	}

//	public Date getPeriodDCVFrom() {
//		return periodDCVFrom;
//	}
//
//	public void setPeriodDCVFrom(Date periodDCVFrom) {
//		this.periodDCVFrom = periodDCVFrom;
//	}
//
//	public Date getPeriodDCVTo() {
//		return periodDCVTo;
//	}
//
//	public void setPeriodDCVTo(Date periodDCVTo) {
//		this.periodDCVTo = periodDCVTo;
//	}

	public Date getSubmitTime() {
		return submitTime;
	}

	public void setSubmitTime(Date submitTime) {
		this.submitTime = submitTime;
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

	public String getCompany() {
		return company;
	}

	public void setCompany(String company) {
		this.company = company;
	}

	public String getNoPC() {
		return noPC;
	}

	public void setNoPC(String noPC) {
		this.noPC = noPC;
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

	public Date getPeriodPCFrom() {
		return periodPCFrom;
	}

	public void setPeriodPCFrom(Date periodPCFrom) {
		this.periodPCFrom = periodPCFrom;
	}

	public Date getPeriodPCTo() {
		return periodPCTo;
	}

	public void setPeriodPCTo(Date periodPCTo) {
		this.periodPCTo = periodPCTo;
	}

	public String getKategoriPC() {
		return kategoriPC;
	}

	public void setKategoriPC(String kategoriPC) {
		this.kategoriPC = kategoriPC;
	}

	public String getTipePC() {
		return tipePC;
	}

	public void setTipePC(String tipePC) {
		this.tipePC = tipePC;
	}

	public BigDecimal getValue() {
		return value;
	}

	public void setValue(BigDecimal value) {
		this.value = value;
	}

	public BigDecimal getAppvValue() {
		return appvValue;
	}

	public void setAppvValue(BigDecimal appvValue) {
		this.appvValue = appvValue;
	}

	public String getNoFaktur() {
		return noFaktur;
	}

	public void setNoFaktur(String noFaktur) {
		this.noFaktur = noFaktur;
	}

	public String getNokwitansi() {
		return nokwitansi;
	}

	public void setNokwitansi(String nokwitansi) {
		this.nokwitansi = nokwitansi;
	}

	public String getLasStep() {
		return lasStep;
	}

	public void setLasStep(String lasStep) {
		this.lasStep = lasStep;
	}

	public String getCurrentStep() {
		return currentStep;
	}

	public void setCurrentStep(String currentStep) {
		this.currentStep = currentStep;
	}

	public BigDecimal getTaskId() {
		return taskId;
	}

	public void setTaskId(BigDecimal taskId) {
		this.taskId = taskId;
	}

	public String getReturnTask() {
		return returnTask;
	}

	public void setReturnTask(String returnTask) {
		this.returnTask = returnTask;
	}

	public String getNodecode() {
		return nodecode;
	}

	public void setNodecode(String nodecode) {
		this.nodecode = nodecode;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public BigDecimal getSla() {
		return sla;
	}

	public void setSla(BigDecimal sla) {
		this.sla = sla;
	}

	public String getPeriodDCVFromString() {
		return periodDCVFromString;
	}

	public void setPeriodDCVFromString(String periodDCVFromString) {
		this.periodDCVFromString = periodDCVFromString;
	}

	public String getPeriodDCVToString() {
		return periodDCVToString;
	}

	public void setPeriodDCVToString(String periodDCVToString) {
		this.periodDCVToString = periodDCVToString;
	}

	public String getSubmitTimeString() {
		return submitTimeString;
	}

	public void setSubmitTimeString(String submitTimeString) {
		this.submitTimeString = submitTimeString;
	}

	public String getPeriodPCFromString() {
		return periodPCFromString;
	}

	public void setPeriodPCFromString(String periodPCFromString) {
		this.periodPCFromString = periodPCFromString;
	}

	public String getPeriodPCToString() {
		return periodPCToString;
	}

	public void setPeriodPCToString(String periodPCToString) {
		this.periodPCToString = periodPCToString;
	}

	public BigDecimal getTotalAppvQty() {
		return totalAppvQty;
	}

	public void setTotalAppvQty(BigDecimal totalAppvQty) {
		this.totalAppvQty = totalAppvQty;
	}

	public BigDecimal getTotalAppvValExcl() {
		return totalAppvValExcl;
	}

	public void setTotalAppvValExcl(BigDecimal totalAppvValExcl) {
		this.totalAppvValExcl = totalAppvValExcl;
	}

	public BigDecimal getTotalSelisih() {
		return totalSelisih;
	}

	public void setTotalSelisih(BigDecimal totalSelisih) {
		this.totalSelisih = totalSelisih;
	}

	public BigDecimal getGrandTotalAppvValExcl() {
		return grandTotalAppvValExcl;
	}

	public void setGrandTotalAppvValExcl(BigDecimal grandTotalAppvValExcl) {
		this.grandTotalAppvValExcl = grandTotalAppvValExcl;
	}

	public BigDecimal getTotalPpnVal() {
		return totalPpnVal;
	}

	public void setTotalPpnVal(BigDecimal totalPpnVal) {
		this.totalPpnVal = totalPpnVal;
	}

	public BigDecimal getTotalPphVal() {
		return totalPphVal;
	}

	public void setTotalPphVal(BigDecimal totalPphVal) {
		this.totalPphVal = totalPphVal;
	}

	public BigDecimal getTotalAppvNet() {
		return totalAppvNet;
	}

	public void setTotalAppvNet(BigDecimal totalAppvNet) {
		this.totalAppvNet = totalAppvNet;
	}

	public List<DcvDokumen> getDcvDokumenDetail() {
		return dcvDokumenDetail;
	}

	public void setDcvDokumenDetail(List<DcvDokumen> dcvDokumenDetail) {
		this.dcvDokumenDetail = dcvDokumenDetail;
	}

	public List<UiDcvRequestDetail> getDcvRequestDetail() {
		return dcvRequestDetail;
	}

	public void setDcvRequestDetail(List<UiDcvRequestDetail> dcvRequestDetail) {
		this.dcvRequestDetail = dcvRequestDetail;
	}
}
