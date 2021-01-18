package com.mycompany.myproject.wfroute;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;

@Entity
@Table(name = "WF_ROUTE")
public class WFRoute {
	
	private static final long serialVersionUID = 1L;
	
	@Id
	@GenericGenerator(name = "WFRoute_SEQ", strategy = "increment")
	@GeneratedValue(generator = "WFRoute_SEQ")
	@Column(name = "ID", nullable = false)
	private Long id;
	
	@Column(name = "NODE_ID")
	private String nodeId;
	
	@Column(name = "PILIHAN")
	private Integer pilihan;
	
	@Column(name = "DESCRIPTION")
	private String desc;
	
	@Column(name = "REFNODE")
	private String refNode;
	
	@Column(name = "RETURN_TASK")
	private String returnTask;
	
	@Column(name = "DOCUMENT_TASK")
	private String docTask;
	
	@Column(name = "POST_SCRIPT")
	private String postScript;

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

	public Integer getPilihan() {
		return pilihan;
	}

	public void setPilihan(Integer pilihan) {
		this.pilihan = pilihan;
	}

	public String getDesc() {
		return desc;
	}

	public void setDesc(String desc) {
		this.desc = desc;
	}

	public String getRefNode() {
		return refNode;
	}

	public void setRefNode(String refNode) {
		this.refNode = refNode;
	}

	public String getReturnTask() {
		return returnTask;
	}

	public void setReturnTask(String returnTask) {
		this.returnTask = returnTask;
	}

	public String getDocTask() {
		return docTask;
	}

	public void setDocTask(String docTask) {
		this.docTask = docTask;
	}

	public String getPostScript() {
		return postScript;
	}

	public void setPostScript(String postScript) {
		this.postScript = postScript;
	}
}
