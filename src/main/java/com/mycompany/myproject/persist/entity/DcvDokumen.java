package com.mycompany.myproject.persist.entity;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;

@Entity
@Table(name = "DCV_DOCUMENTS")
public class DcvDokumen {
	
	private static final long serialVersionUID = 1L;

	@Id
	@GenericGenerator(name = "DCV_DOK_SEQ", strategy = "increment")
	@GeneratedValue(generator = "DCV_DOK_SEQ")
	@Column(name = "ID", nullable = false)
	private Long id;
	
	@Column(name = "DCVH_ID", nullable = false)
	private Long dcvhId;
	
	@Column(name="DOC_TYPE")
	private String docType;
	
	@Column(name="DOC_NO")
	private String docNo;
	
	@Column(name="DOC_DATE")
	private Date docDate;
	
	@Column(name="UPLOAD_TIME")
	private Date uploadTime;
	
	@Column(name="UPLOAD_BY")
	private String uploadBy;
	
	@Column(name="DOWNLOAD_ADDR")
	private String downloadAddr;
	
	@Column(name="MODIFIED_BY")
	private String modifiedBy;
	
	@Column(name="MODIFIED_DT")
	private Date modifiedDt;
	
	@Column(name="DESCRIPTION")
	private String description;

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

	public String getDocType() {
		return docType;
	}

	public void setDocType(String docType) {
		this.docType = docType;
	}

	public String getDocNo() {
		return docNo;
	}

	public void setDocNo(String docNo) {
		this.docNo = docNo;
	}

	public Date getDocDate() {
		return docDate;
	}

	public void setDocDate(Date docDate) {
		this.docDate = docDate;
	}

	public Date getUploadTime() {
		return uploadTime;
	}

	public void setUploadTime(Date uploadTime) {
		this.uploadTime = uploadTime;
	}

	public String getUploadBy() {
		return uploadBy;
	}

	public void setUploadBy(String uploadBy) {
		this.uploadBy = uploadBy;
	}

	public String getDownloadAddr() {
		return downloadAddr;
	}

	public void setDownloadAddr(String downloadAddr) {
		this.downloadAddr = downloadAddr;
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

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}
}
