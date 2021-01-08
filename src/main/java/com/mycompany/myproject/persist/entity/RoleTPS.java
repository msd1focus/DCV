package com.mycompany.myproject.persist.entity;

import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "ADM_ROLE")
public class RoleTPS {
	
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name="ROLE_ID")
	private String ROLE_ID;
	
	@Column(name="ROLE_NAME")
	private String ROLE_NAME;
	
	@Column(name="ROLE_PARENT_ID")
	private String ROLE_PARENT_ID;
	
	@Column(name="ROLE_DESC")
	private String ROLE_DESC;
	
	@Column(name="CTL_INS_BY")
	private String CTL_INS_BY;
	
	@Column(name="CTL_INS_DTM")
	private Timestamp CTL_INS_DTM;
	
	@Column(name="CTL_UPD_BY")
	private String CTL_UPD_BY;
	
	@Column(name="CTL_UPD_DTM")
	private Timestamp CTL_UPD_DTM;

	public String getROLE_ID() {
		return ROLE_ID;
	}

	public void setROLE_ID(String rOLE_ID) {
		ROLE_ID = rOLE_ID;
	}

	public String getROLE_NAME() {
		return ROLE_NAME;
	}

	public void setROLE_NAME(String rOLE_NAME) {
		ROLE_NAME = rOLE_NAME;
	}

	public String getROLE_PARENT_ID() {
		return ROLE_PARENT_ID;
	}

	public void setROLE_PARENT_ID(String rOLE_PARENT_ID) {
		ROLE_PARENT_ID = rOLE_PARENT_ID;
	}

	public String getROLE_DESC() {
		return ROLE_DESC;
	}

	public void setROLE_DESC(String rOLE_DESC) {
		ROLE_DESC = rOLE_DESC;
	}

	public String getCTL_INS_BY() {
		return CTL_INS_BY;
	}

	public void setCTL_INS_BY(String cTL_INS_BY) {
		CTL_INS_BY = cTL_INS_BY;
	}

	public Timestamp getCTL_INS_DTM() {
		return CTL_INS_DTM;
	}

	public void setCTL_INS_DTM(Timestamp cTL_INS_DTM) {
		CTL_INS_DTM = cTL_INS_DTM;
	}

	public String getCTL_UPD_BY() {
		return CTL_UPD_BY;
	}

	public void setCTL_UPD_BY(String cTL_UPD_BY) {
		CTL_UPD_BY = cTL_UPD_BY;
	}

	public Timestamp getCTL_UPD_DTM() {
		return CTL_UPD_DTM;
	}

	public void setCTL_UPD_DTM(Timestamp cTL_UPD_DTM) {
		CTL_UPD_DTM = cTL_UPD_DTM;
	}
}
