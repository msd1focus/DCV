package com.mycompany.myproject.persist.entity;


import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.hibernate.annotations.GenericGenerator;

@Entity
@Table(name = "DOKUMEN_REALISASI")
public class DokumenRealisasi {
	
	@Id
	@GenericGenerator(name = "DCV_SEQ", strategy = "increment")
	@GeneratedValue(generator = "DCV_SEQ")
	@Column(name = "ID", nullable = false)
	private Long id;
	
	@Column(name="DCVH_ID")
	private Long dcvhId;
	
	@Column(name="TAHAPAN_REALISASI")
	private String tahapanRealisasi;
	
	@Column(name="DOC_NO")
	private String docNo;
	
	@Column(name="DOC_DT")
	private Date docDt;
	
	@Column(name="DESCR")
	private String descr;
	
	@Column(name="TRX_VALUE")
	private Long trxValue;
	
	@Column(name="REMAINING_VAL")
	private Long remainingVal;
	
	@Column(name="CREATE_BY")
	private String createdBy;
	
	@Column(name="CREATE_DT")
	private Date createdDt;
	
	@Column(name="MODIFIED_BY")
	private String modifiedBy;
	
	@Column(name="MODIFIED_DT")
	private Date modifiedDt;
	
	@Transient
	private String docDtString;
	
	

	public String getDocDtString() {
		DateFormat f1 = new SimpleDateFormat("dd/MM/yyyy");
		if(docDt != null) {
			docDtString = f1.format(docDt);
		}
		return docDtString;
	}

	public void setDocDtString(String docDtString) {
		this.docDtString = docDtString;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getDcvhId() {
		return dcvhId;
	}

	public void setDcvhId(Long dcvhId) {
		this.dcvhId = dcvhId;
	}

	public String getTahapanRealisasi() {
		return tahapanRealisasi;
	}

	public void setTahapanRealisasi(String tahapanRealisasi) {
		this.tahapanRealisasi = tahapanRealisasi;
	}

	public String getDocNo() {
		return docNo;
	}

	public void setDocNo(String docNo) {
		this.docNo = docNo;
	}

	public Date getDocDt() {
		return docDt;
	}

	public void setDocDt(Date docDt) {
		this.docDt = docDt;
	}

	public String getDescr() {
		return descr;
	}

	public void setDescr(String descr) {
		this.descr = descr;
	}

	public Long getTrxValue() {
		return trxValue;
	}

	public void setTrxValue(Long trxValue) {
		this.trxValue = trxValue;
	}

	public Long getRemainingVal() {
		return remainingVal;
	}

	public void setRemainingVal(Long remainingVal) {
		this.remainingVal = remainingVal;
	}

	public String getCreatedBy() {
		return createdBy;
	}

	public void setCreatedBy(String createdBy) {
		this.createdBy = createdBy;
	}

	public Date getCreatedDt() {
		return createdDt;
	}

	public void setCreatedDt(Date createdDt) {
		this.createdDt = createdDt;
	}

	public String getModifiedBy() {
		return modifiedBy;
	}

	public void setModifiedBy(String modifiedBy) {
		this.modifiedBy = modifiedBy;
	}

	public Date getModifiedDt() {
		return modifiedDt;
	}

	public void setModifiedDt(Date modifiedDt) {
		this.modifiedDt = modifiedDt;
	}
	
	
	
	
	
	
	
	

}
