package com.mycompany.myproject.service.dto;

import java.math.BigDecimal;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.dozer.Mapping;

public class WorkFlowDto {
	@Mapping("no")
	private BigDecimal no;
	
	@Mapping("tahapan")
	private String tahapan;
	
	@Mapping("username")
	private String username;
	
	@Mapping("submit_date")
	private Date submitDate;
	
	@Mapping("target_date")
	private Date targetDate;
	
	@Mapping("process_date")
	private Date processDate;
	
	@Mapping("note")
	private String note;
	
	@Mapping("target_sla")
	private BigDecimal jmlTargetSla;
	
	@Mapping("duration_days")
	private BigDecimal durationDays;
	
	@Mapping("duration_hours")
	private BigDecimal durationHours;
	
	@Mapping("duration_minutes")
	private BigDecimal durationMinutes;
	
	@Mapping("duration_seconds")
	private BigDecimal durationSeconds ;
	
	@Mapping("flag1")
	private String flag1 ;
	
	private String targetDateStr;
	private String proDateDay;
	private String proDate;
	private String proDateHour;
	
	public WorkFlowDto() {};	
	public WorkFlowDto(Object[] data) {
		super();
		
		DateFormat f1 = new SimpleDateFormat("dd/MM/yyyy");
		String[] day = {"Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"};
		DateFormat time = new SimpleDateFormat("HH:mm:ss");
		
		Date datee = (Date)data[5];
		String dayofString = "";
		if(datee != null) {
			int uu = datee.getDay();
			dayofString = day[uu];
		}else {
			dayofString = "";
		}
		
		this.no				= data[0] != null ? new BigDecimal(data[0].toString()) : null;
		this.tahapan		= data[1] != null ? data[1].toString() : "";
		this.username		= data[2] != null ? data[2].toString() : "";
		this.submitDate		= data[3] != null ? (Date)data[3] : null;
		this.targetDate		= data[4] != null ? (Date)data[4] : null;
		this.targetDateStr	= data[4] != null ? f1.format(data[4]) : null;
		this.processDate	= data[5] != null ? (Date)data[5] : null;
		this.proDate		= data[5] != null ? f1.format(data[5]) : null;
		this.proDateHour	= data[5] != null ? time.format(data[5]) : null;
		this.proDateDay		= dayofString;
		this.note			= data[6] != null ? data[6].toString() : "";
		this.jmlTargetSla	= data[7] != null ? new BigDecimal(data[7].toString())  : null;
		this.durationDays	= data[8] != null ? new BigDecimal(data[8].toString())  : null;
		this.durationHours	= data[9] != null ? new BigDecimal(data[9].toString())  : null;
		this.durationMinutes= data[10] != null ? new BigDecimal(data[10].toString())  : null;
		this.durationSeconds= data[11] != null ? new BigDecimal(data[11].toString())  : null;
		this.flag1			= data[12] != null ? data[12].toString() : "";
	}

	public BigDecimal getNo() {
		return no;
	}

	public void setNo(BigDecimal no) {
		this.no = no;
	}

	public String getTahapan() {
		return tahapan;
	}

	public void setTahapan(String tahapan) {
		this.tahapan = tahapan;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public Date getSubmitDate() {
		return submitDate;
	}

	public void setSubmitDate(Date submitDate) {
		this.submitDate = submitDate;
	}

	public Date getTargetDate() {
		return targetDate;
	}

	public void setTargetDate(Date targetDate) {
		this.targetDate = targetDate;
	}

	public Date getProcessDate() {
		return processDate;
	}

	public void setProcessDate(Date processDate) {
		this.processDate = processDate;
	}

	public String getNote() {
		return note;
	}

	public void setNote(String note) {
		this.note = note;
	}

	public BigDecimal getJmlTargetSla() {
		return jmlTargetSla;
	}

	public void setJmlTargetSla(BigDecimal jmlTargetSla) {
		this.jmlTargetSla = jmlTargetSla;
	}

	public BigDecimal getDurationDays() {
		return durationDays;
	}

	public void setDurationDays(BigDecimal durationDays) {
		this.durationDays = durationDays;
	}

	public BigDecimal getDurationHours() {
		return durationHours;
	}

	public void setDurationHours(BigDecimal durationHours) {
		this.durationHours = durationHours;
	}

	public BigDecimal getDurationMinutes() {
		return durationMinutes;
	}

	public void setDurationMinutes(BigDecimal durationMinutes) {
		this.durationMinutes = durationMinutes;
	}

	public BigDecimal getDurationSeconds() {
		return durationSeconds;
	}

	public void setDurationSeconds(BigDecimal durationSeconds) {
		this.durationSeconds = durationSeconds;
	}

	public String getTargetDateStr() {
		return targetDateStr;
	}
	public void setTargetDateStr(String targetDateStr) {
		this.targetDateStr = targetDateStr;
	}
	public String getProDateDay() {
		return proDateDay;
	}

	public void setProDateDay(String proDateDay) {
		this.proDateDay = proDateDay;
	}

	public String getProDate() {
		return proDate;
	}

	public void setProDate(String proDate) {
		this.proDate = proDate;
	}

	public String getProDateHour() {
		return proDateHour;
	}

	public void setProDateHour(String proDateHour) {
		this.proDateHour = proDateHour;
	}
	
	public String getFlag1() {
		return flag1;
	}
	
	public void setFlag1(String flag1) {
		this.flag1 = flag1;
	}	
	
}