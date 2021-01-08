package com.mycompany.myproject.service.dto;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

public class HolidayDto {

	private Long id;
	private Date date;
	private String stringDate;
	private String description;
	
	public HolidayDto() {};	
	public HolidayDto(Object[] data) {
		super();
		DateFormat f1 = new SimpleDateFormat("dd/MM/yyyy");
		
		this.id = data[0] != null ? Long.valueOf(data[0].toString()) : null;
		this.date = data[1] != null ? (Date)data[1] : null;
		this.stringDate	= data[1] != null ? f1.format(data[1]) : null;
		this.description	= data[2] != null ? data[2].toString() : null;
	}
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public Date getDate() {
		return date;
	}
	public void setDate(Date date) {
		this.date = date;
	}
	public String getStringDate() {
		return stringDate;
	}
	public void setStringDate(String stringDate) {
		this.stringDate = stringDate;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	
}