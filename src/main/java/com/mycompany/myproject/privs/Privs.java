package com.mycompany.myproject.privs;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "DCV_PRIVS")
public class Privs {

	private static final long serialVersionUID = 1L;
	
	@Id
	@Column(name="PRIV_CODE")
	private String privCode;
	
	@Column(name="DESCR")
	private String descr;
	
	@Column(name="PRIV_TYPE")
	private String privType;
	
	@Column(name="REF_ID1")
	private String refId1;
	
	@Column(name="REF_ID2")
	private Integer refId2;

	public String getPrivCode() {
		return privCode;
	}

	public void setPrivCode(String privCode) {
		this.privCode = privCode;
	}

	public String getDescr() {
		return descr;
	}

	public void setDescr(String descr) {
		this.descr = descr;
	}

	public String getPrivType() {
		return privType;
	}

	public void setPrivType(String privType) {
		this.privType = privType;
	}

	public String getRefId1() {
		return refId1;
	}

	public void setRefId1(String refId1) {
		this.refId1 = refId1;
	}

	public Integer getRefId2() {
		return refId2;
	}

	public void setRefId2(Integer refId2) {
		this.refId2 = refId2;
	}

	public static long getSerialversionuid() {
		return serialVersionUID;
	}

}
