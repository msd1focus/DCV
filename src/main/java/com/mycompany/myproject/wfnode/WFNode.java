package com.mycompany.myproject.wfnode;

import java.math.BigDecimal;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;

@Entity
@Table(name = "WF_NODE")
public class WFNode {

private static final long serialVersionUID = 1L;
	
	@Id
	@GenericGenerator(name = "WFNode_SEQ", strategy = "increment")
	@GeneratedValue(generator = "WFNode_SEQ")
	@Column(name = "NODECODE", nullable = false)
	private String nodeCode;
	
	@Column(name = "NODE_DESC")
	private String desc;
	
	@Column(name = "NODETYPE")
	private String nodeType;
	
	@Column(name = "NO_URUT")
	private Long noUrut;
	
	@Column(name = "BAGIAN")
	private String bagian;
	
	@Column(name = "EXECSCRIPT")
	private String execScrpt;
	
	@Column(name = "PRIME_ROUTE")
	private String primeRoute;
	
	@Column(name = "MERGE_COUNT")
	private Long mergeCount;
	
	@Column(name = "SLA1")
	private BigDecimal sla1;
	
	@Column(name = "SLA2")
	private BigDecimal sla2;

	public String getNodeCode() {
		return nodeCode;
	}

	public void setNodeCode(String nodeCode) {
		this.nodeCode = nodeCode;
	}

	public String getDesc() {
		return desc;
	}

	public void setDesc(String desc) {
		this.desc = desc;
	}

	public String getNodeType() {
		return nodeType;
	}

	public void setNodeType(String nodeType) {
		this.nodeType = nodeType;
	}

	public Long getNoUrut() {
		return noUrut;
	}

	public void setNoUrut(Long noUrut) {
		this.noUrut = noUrut;
	}

	public String getBagian() {
		return bagian;
	}

	public void setBagian(String bagian) {
		this.bagian = bagian;
	}

	public String getExecScrpt() {
		return execScrpt;
	}

	public void setExecScrpt(String execScrpt) {
		this.execScrpt = execScrpt;
	}

	public String getPrimeRoute() {
		return primeRoute;
	}

	public void setPrimeRoute(String primeRoute) {
		this.primeRoute = primeRoute;
	}

	public Long getMergeCount() {
		return mergeCount;
	}

	public void setMergeCount(Long mergeCount) {
		this.mergeCount = mergeCount;
	}

	public BigDecimal getSla1() {
		return sla1;
	}

	public void setSla1(BigDecimal sla1) {
		this.sla1 = sla1;
	}

	public BigDecimal getSla2() {
		return sla2;
	}

	public void setSla2(BigDecimal sla2) {
		this.sla2 = sla2;
	}
}
