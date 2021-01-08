package com.mycompany.myproject.service.dto;

import java.math.BigDecimal;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.dozer.Mapping;

public class PaymentEbsHistDto {
	@Mapping("no")
	private BigDecimal no;
	
	@Mapping("step")
	private String step;
	
	@Mapping("username")
	private String username;
	
	@Mapping("sla_hari")
	private String slaHari;
	
	@Mapping("hari")
	private String hari;
	
	@Mapping("tanggal")
	private Date tanggal;
	
	@Mapping("jam")
	private String jam;
	
	@Mapping("target_date")
	private Date targetDate;
	
	@Mapping("catatan")
	private String catatan;
	
	@Mapping("jml_hari")
	private BigDecimal jmlHari;
	
	@Mapping("jml_jam")
	private BigDecimal jmlJam;
	
	@Mapping("jml_menit")
	private BigDecimal jmlMenit;
	
	@Mapping("jml_detik")
	private BigDecimal jmlDetik ;
	
	private String formatTanggal;
	private String formatTargetDate;
	
	public PaymentEbsHistDto() {};	
	public PaymentEbsHistDto(Object[] data) {
		super();
		DateFormat f1 = new SimpleDateFormat("dd/MM/yyyy");
		this.no = data[0] != null ? new BigDecimal(data[0].toString()) : null;
		this.step = data[1] != null ? data[1].toString() : "";
		this.username = data[2] != null ? data[2].toString() : "";
		this.slaHari = data[3] != null ? data[3].toString() : "";
		this.hari = data[4] != null ? data[4].toString() : "";
		this.tanggal = data[5] != null ? (Date)data[5] : null;
		this.formatTanggal = data[5] != null ? f1.format(data[5]) : null;
		this.jam = data[6] != null ? data[6].toString() : null;
		this.targetDate	= data[7] != null ? (Date)data[7] : null;
		this.formatTargetDate = data[7] != null ? f1.format(data[7]) : null;
		this.catatan = data[8] != null ? data[8].toString() : "";
		this.jmlHari = data[9] != null ? new BigDecimal(data[9].toString()) : null;
		this.jmlJam	= data[10] != null ? new BigDecimal(data[10].toString()) : null;
		this.jmlMenit = data[11] != null ? new BigDecimal(data[11].toString()) : null;
		this.jmlDetik = data[12] != null ? new BigDecimal(data[12].toString()) : null;
	}
	
	public BigDecimal getNo() {
		return no;
	}
	public void setNo(BigDecimal no) {
		this.no = no;
	}
	public String getStep() {
		return step;
	}
	public void setStep(String step) {
		this.step = step;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getSlaHari() {
		return slaHari;
	}
	public void setSlaHari(String slaHari) {
		this.slaHari = slaHari;
	}
	public String getHari() {
		return hari;
	}
	public void setHari(String hari) {
		this.hari = hari;
	}
	public Date getTanggal() {
		return tanggal;
	}
	public void setTanggal(Date tanggal) {
		this.tanggal = tanggal;
	}
	public String getJam() {
		return jam;
	}
	public void setJam(String jam) {
		this.jam = jam;
	}
	public Date getTargetDate() {
		return targetDate;
	}
	public void setTargetDate(Date targetDate) {
		this.targetDate = targetDate;
	}
	public String getCatatan() {
		return catatan;
	}
	public void setCatatan(String catatan) {
		this.catatan = catatan;
	}
	public BigDecimal getJmlHari() {
		return jmlHari;
	}
	public void setJmlHari(BigDecimal jmlHari) {
		this.jmlHari = jmlHari;
	}
	public BigDecimal getJmlJam() {
		return jmlJam;
	}
	public void setJmlJam(BigDecimal jmlJam) {
		this.jmlJam = jmlJam;
	}
	public BigDecimal getJmlMenit() {
		return jmlMenit;
	}
	public void setJmlMenit(BigDecimal jmlMenit) {
		this.jmlMenit = jmlMenit;
	}
	public BigDecimal getJmlDetik() {
		return jmlDetik;
	}
	public void setJmlDetik(BigDecimal jmlDetik) {
		this.jmlDetik = jmlDetik;
	}
	public String getFormatTanggal() {
		return formatTanggal;
	}
	public void setFormatTanggal(String formatTanggal) {
		this.formatTanggal = formatTanggal;
	}
	public String getFormatTargetDate() {
		return formatTargetDate;
	}
	public void setFormatTargetDate(String formatTargetDate) {
		this.formatTargetDate = formatTargetDate;
	}
	
}