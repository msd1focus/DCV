package com.mycompany.myproject.persist.entity;

import java.math.BigDecimal;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;


@Entity
@Table(name = "PPH_V")
public class PPHList {
	@Id
	@Column(name = "KODE_PPH", nullable = true)
	private String kodePPH;
	
	@Column(name = "FLAT")
	private Character flat;
	
	@Column(name = "PERSENTASE")
	private BigDecimal persentase;

	public String getKodePPH() {
		return kodePPH;
	}

	public void setKodePPH(String kodePPH) {
		this.kodePPH = kodePPH;
	}

	public Character getFlat() {
		return flat;
	}

	public void setFlat(Character flat) {
		this.flat = flat;
	}

	public BigDecimal getPersentase() {
		return persentase;
	}

	public void setPersentase(BigDecimal persentase) {
		this.persentase = persentase;
	}
}
