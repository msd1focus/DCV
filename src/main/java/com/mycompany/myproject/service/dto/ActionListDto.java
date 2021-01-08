package com.mycompany.myproject.service.dto;

import java.math.BigDecimal;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

public class ActionListDto {

	private BigDecimal taskId;
	private String noDcv;
	private String roleCode;
	private String nodeId;
	private BigDecimal pilihan;
	private String description;
	
	public ActionListDto() {}
	
	public ActionListDto(Object[] data) {
		super();
		
		this.taskId 		= data[0] != null ? (BigDecimal) data[0] : null;
		this.noDcv 			= data[1] != null ? (String) data[1] : "";
		this.roleCode 		= data[2] != null ? (String) data[2] : "";
		this.nodeId 		= data[3] != null ? (String) data[3] : "";
		this.pilihan 		= data[4] != null ? (BigDecimal) data[4] : null;
		this.description 	= data[5] != null ? (String) data[5] : "";
	}
	
	public BigDecimal getTaskId() {
		return taskId;
	}
	public void setTaskId(BigDecimal taskId) {
		this.taskId = taskId;
	}
	public String getNoDcv() {
		return noDcv;
	}
	public void setNoDcv(String noDcv) {
		this.noDcv = noDcv;
	}
	public String getRoleCode() {
		return roleCode;
	}
	public void setRoleCode(String roleCode) {
		this.roleCode = roleCode;
	}
	public String getNodeId() {
		return nodeId;
	}
	public void setNodeId(String nodeId) {
		this.nodeId = nodeId;
	}
	public BigDecimal getPilihan() {
		return pilihan;
	}
	public void setPilihan(BigDecimal pilihan) {
		this.pilihan = pilihan;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}	
	
}
