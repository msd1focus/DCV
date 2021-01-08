package com.mycompany.myproject.persist.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "TERM")
public class Term {

	@Id
	@Column(name = "ID_TERM", nullable = false)
	private Integer termId;
	
	@Column(name="DESCRIPTION_TERM")
	private String desc;

	public Integer getTermId() {
		return termId;
	}

	public void setTermId(Integer termId) {
		this.termId = termId;
	}

	public String getDesc() {
		return desc;
	}

	public void setDesc(String desc) {
		this.desc = desc;
	}
	
}
