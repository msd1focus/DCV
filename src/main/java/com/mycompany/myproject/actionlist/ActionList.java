package com.mycompany.myproject.actionlist;

import java.math.BigDecimal;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;


@Entity
@Table(name = "ACTION_LIST_V") /*Table VIEW*/
public class ActionList {

	@Id
	@Column(name="TASK_ID", nullable = false)
	private Long taskId;
	
	@Column(name="NO_DCV")
	private String noDcv;
	
	@Column(name="BAGIAN")
	private String bagian;
	
	@Column(name="DESCRIPTION")
	private String description;
	
	@Column(name="NODECODE")
	private String nodeCode;
	
	@Column(name="PILIHAN")
	private BigDecimal pilihan;

	public Long getTaskId() {
		return taskId;
	}

	public void setTaskId(Long taskId) {
		this.taskId = taskId;
	}

	public String getNoDcv() {
		return noDcv;
	}

	public void setNoDcv(String noDcv) {
		this.noDcv = noDcv;
	}

	public String getBagian() {
		return bagian;
	}

	public void setBagian(String bagian) {
		this.bagian = bagian;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getNodeCode() {
		return nodeCode;
	}

	public void setNodeCode(String nodeCode) {
		this.nodeCode = nodeCode;
	}

	public BigDecimal getPilihan() {
		return pilihan;
	}

	public void setPilihan(BigDecimal pilihan) {
		this.pilihan = pilihan;
	}
}
