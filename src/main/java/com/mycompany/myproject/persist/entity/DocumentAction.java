package com.mycompany.myproject.persist.entity;

import java.math.BigDecimal;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "DOCUMENT_ACTION")
public class DocumentAction {
	
	
	@Id
	@Column(name="ID")
	private Long id;
	
	@Column(name="NODE_ID")
	private String nodeId;
	
	@Column(name="PILIHAN")
	private BigDecimal pilihan;
	
	@Column(name="DESCRIPTION")
	private String desc;
	
	@Column(name="REFNODE")
	private String refnode;
	
	@Column(name="BAGIAN")
	private String bagian;
	
	

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
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

	public String getDesc() {
		return desc;
	}

	public void setDesc(String desc) {
		this.desc = desc;
	}

	public String getRefnode() {
		return refnode;
	}

	public void setRefnode(String refnode) {
		this.refnode = refnode;
	}

	public String getBagian() {
		return bagian;
	}

	public void setBagian(String bagian) {
		this.bagian = bagian;
	}
	
	
	
	

}
