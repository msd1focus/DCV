package com.mycompany.myproject.persist.entity;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;

@Entity
@Table(name = "INFORMATION_PC") /*Table VIEW*/
public class InformationPC {

	@Id
	@Column(name = "PROPOSAL_ID", nullable = false)
	private Integer propId;
	
	@Column(name="NO_PC")
	private String noPC;
	
	@Column(name="KEY_PC")
	private String keyPC;
	
	@Column(name="PERIODE_PC_FROM")
	private Date periodPCFrom;
	
	@Column(name="PERIODE_PC_TO")
	private Date periodPCTo;
	
	@Column(name="KATEGORI_PC")
	private String kategoriPC;
	
	@Column(name="TIPE_PC")
	private String tipePC;
	
	@Column(name="SYARAT_1")
	private String syarat1;
	
	@Column(name="SYARAT_2")
	private Integer syarat2;
	
	@Column(name="PROPOSAL_NO")
	private String propNo;
	
	@Transient
	private Term term1;
	
	@Transient
	private Term term2;
	
	@Transient
	private Date periodDCVFrom;
	
	@Transient
	private Date periodDCVTo;
	
	@Transient
	private String response;
	
	@Transient
	private String message;
	
	@Transient
	private String custCode;

	public Integer getPropId() {
		return propId;
	}

	public void setPropId(Integer propId) {
		this.propId = propId;
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

	public Integer getSyarat2() {
		return syarat2;
	}

	public void setSyarat2(Integer syarat2) {
		this.syarat2 = syarat2;
	}

	public String getPropNo() {
		return propNo;
	}

	public void setPropNo(String propNo) {
		this.propNo = propNo;
	}

	public Term getTerm1() {
		return term1;
	}

	public void setTerm1(Term term1) {
		this.term1 = term1;
	}

	public Term getTerm2() {
		return term2;
	}

	public void setTerm2(Term term2) {
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

	public String getCustCode() {
		return custCode;
	}

	public void setCustCode(String custCode) {
		this.custCode = custCode;
	}
	
	
}
