package com.mycompany.myproject.persist.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "PARAMETER")
public class ParameterDCV {

	@Id
	@Column(name = "ID", nullable = false)
	private Integer id;
	
	@Column(name="TITLE")
	private String title;
	
	@Column(name="VALUE")
	private String value;
	
	@Column(name="DESCR")
	private String descr;

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}

	public String getDescr() {
		return descr;
	}

	public void setDescr(String descr) {
		this.descr = descr;
	}
}
