package com.mycompany.myproject.daftarpc;

import java.math.BigDecimal;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Immutable;

@Entity
@Immutable
@Table(name = "PCLIST_PREQRY")
public class DaftarPc {
	
	@Id
	@Column(name="NO_PC")
	private String noPc;
	
	@Column(name="USERNAME")
	private String userName;
	
	@Column(name="CREATED_BY")
	private String createdBy;
	
	@Column(name="DISTRIBUTED_DATE")
	private Date distributedDate;
	
	@Column(name="PERIODE_FROM")
	private Date periodeStart;
	
	@Column(name="PERIODE_TO")
	private Date periodeEnd;
	
	@Column(name="PROPOSAL_TYPE")
	private String proposalType;
	
	@Column(name="DISCOUNT_TYPE")
	private String discountType;
	
	@Column(name="MEKANISME_PENAGIHAN")
	private String mekanismePenagihan;
	
	@Column(name="PROG_PROMO")
	private String progPromo;
	
	@Column(name="STATUS")
	private String status;
	
	@Column(name="CLAIM")
	private String claim;
	
	@Column(name="PROPOSAL_ID")
	private String proposalId;
	
	@Column(name="SESSION_ID")
	private String sessionId;
	
	public DaftarPc() {}
    
    public DaftarPc(Object[] data) {
    	super();
    	
    	this.noPc				= (String) data[0];
    	this.userName  			= (String) data[1];
    	this.createdBy  		= (String) data[2];
    	this.distributedDate  	= (Date) data[3];
    	this.periodeStart  		= (Date) data[4];
    	this.periodeEnd  		= (Date) data[5];
    	this.proposalType		= (String) data[6];
    	this.discountType		= (String) data[7];
    	this.mekanismePenagihan	= (String) data[8];
    	this.progPromo			= (String) data[9];
    	this.status				= (String) data[10];
    	this.claim				= (String) data[11];
    	this.proposalId			= (String) data[12];
    	this.sessionId			= (String) data[13];

    }

	public String getNoPc() {
		return noPc;
	}

	public void setNoPc(String noPc) {
		this.noPc = noPc;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getCreatedBy() {
		return createdBy;
	}

	public void setCreatedBy(String createdBy) {
		this.createdBy = createdBy;
	}

	public Date getDistributedDate() {
		return distributedDate;
	}

	public void setDistributedDate(Date distributedDate) {
		this.distributedDate = distributedDate;
	}

	public Date getPeriodeStart() {
		return periodeStart;
	}

	public void setPeriodeStart(Date periodeStart) {
		this.periodeStart = periodeStart;
	}

	public Date getPeriodeEnd() {
		return periodeEnd;
	}

	public void setPeriodeEnd(Date periodeEnd) {
		this.periodeEnd = periodeEnd;
	}

	public String getProposalType() {
		return proposalType;
	}

	public void setProposalType(String proposalType) {
		this.proposalType = proposalType;
	}

	public String getDiscountType() {
		return discountType;
	}

	public void setDiscountType(String discountType) {
		this.discountType = discountType;
	}

	public String getMekanismePenagihan() {
		return mekanismePenagihan;
	}

	public void setMekanismePenagihan(String mekanismePenagihan) {
		this.mekanismePenagihan = mekanismePenagihan;
	}

	public String getProgPromo() {
		return progPromo;
	}

	public void setProgPromo(String progPromo) {
		this.progPromo = progPromo;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getClaim() {
		return claim;
	}

	public void setClaim(String claim) {
		this.claim = claim;
	}

	public String getProposalId() {
		return proposalId;
	}

	public void setProposalId(String proposalId) {
		this.proposalId = proposalId;
	}

	public String getSessionId() {
		return sessionId;
	}

	public void setSessionId(String sessionId) {
		this.sessionId = sessionId;
	}
	
}
