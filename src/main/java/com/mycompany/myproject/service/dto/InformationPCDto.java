package com.mycompany.myproject.service.dto;

import java.math.BigDecimal;
import java.util.Date;

import org.dozer.Mapping;

import com.mycompany.myproject.lookupcode.LookupCode;
import com.mycompany.myproject.persist.entity.Term;

public class InformationPCDto {

	@Mapping("propId")
	private BigDecimal propId;
	
	@Mapping("propNo")
	private String propNo;
	
	@Mapping("noPC")
	private String noPC;
	
	@Mapping("keyPC")
	private String keyPC;
	
	@Mapping("periodPCFrom")
	private Date periodPCFrom;
	
	@Mapping("periodPCTo")
	private Date periodPCTo;
	
	@Mapping("kategoriPC")
	private String kategoriPC;
	
	@Mapping("tipePC")
	private String tipePC;
	
	@Mapping("syarat1")
	private String syarat1;
	
	@Mapping("syarat2")
	private String syarat2;
	
	
	private LookupCode term1;
	private LookupCode term2;
	private Date periodDCVFrom;
	private Date periodDCVTo;
	private String response;
	private String message;
	
	public InformationPCDto() {}
	
	public InformationPCDto(Object[] data) {
		super();
		this.propId			= (BigDecimal) data[0];
		this.propNo			= (String) data[1];
		this.noPC			= (String) data[2];
		this.keyPC			= (String) data[3];
		this.periodPCFrom	= (Date) data[4];
		this.periodPCTo		= (Date) data[5];
		this.kategoriPC		= (String) data[6];
		this.tipePC			= (String) data[7];
		this.syarat1		= (String) data[8];
		this.syarat2		= (String) data[9];
	}

	public BigDecimal getPropId() {
		return propId;
	}

	public void setPropId(BigDecimal propId) {
		this.propId = propId;
	}

	public String getPropNo() {
		return propNo;
	}

	public void setPropNo(String propNo) {
		this.propNo = propNo;
	}

	public String getNoPC() {
		return noPC;
	}

	public void setNoPC(String noPC) {
		this.noPC = noPC;
	}

	public String getKeyPC() {
		return keyPC;
	}

	public void setKeyPC(String keyPC) {
		this.keyPC = keyPC;
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

	public String getSyarat1() {
		return syarat1;
	}

	public void setSyarat1(String syarat1) {
		this.syarat1 = syarat1;
	}

	public String getSyarat2() {
		return syarat2;
	}

	public void setSyarat2(String syarat2) {
		this.syarat2 = syarat2;
	}

	public LookupCode getTerm1() {
		return term1;
	}

	public void setTerm1(LookupCode term1) {
		this.term1 = term1;
	}

	public LookupCode getTerm2() {
		return term2;
	}

	public void setTerm2(LookupCode term2) {
		this.term2 = term2;
	}

	public Date getPeriodDCVFrom() {
		return periodDCVFrom;
	}

	public void setPeriodDCVFrom(Date periodDCVFrom) {
		this.periodDCVFrom = periodDCVFrom;
	}

	public Date getPeriodDCVTo() {
		return periodDCVTo;
	}

	public void setPeriodDCVTo(Date periodDCVTo) {
		this.periodDCVTo = periodDCVTo;
	}

	public String getResponse() {
		return response;
	}

	public void setResponse(String response) {
		this.response = response;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}
}
