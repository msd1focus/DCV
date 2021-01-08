package com.mycompany.myproject.persist.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;

@Entity
@Table(name = "data_dcv_detail_pc")
public class DetailDCV {

	@Id
	@GenericGenerator(name = "generator", strategy = "increment")
	@GeneratedValue(generator = "generator")
	@Column(name = "id", nullable = false)
	private Long id;
	
	@Column(name="line_pc")
	private String linePc;
	
	@Column(name="prod_class")
	private String prodClass;
	
	@Column(name="prod_brand")
	private String prodBrand;
	
	@Column(name="prod_ext")
	private String prodExt;
	
	@Column(name="prod_packaging")
	private String prodPackaging;
	
	@Column(name="prod_variant")
	private String prodVariant;
	
	@Column(name="prod_item")
	private String prodItem;
	
	@Column(name="dcv_qty")
	private String dcvQty;
	
	@Column(name="satuan")
	private String satuan;
	
	@Column(name="dcv_value_excl")
	private String dcvValueExcl;
	
	@Column(name="notes")
	private String notes;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getLinePc() {
		return linePc;
	}

	public void setLinePc(String linePc) {
		this.linePc = linePc;
	}

	public String getProdClass() {
		return prodClass;
	}

	public void setProdClass(String prodClass) {
		this.prodClass = prodClass;
	}

	public String getProdBrand() {
		return prodBrand;
	}

	public void setProdBrand(String prodBrand) {
		this.prodBrand = prodBrand;
	}

	public String getProdExt() {
		return prodExt;
	}

	public void setProdExt(String prodExt) {
		this.prodExt = prodExt;
	}

	public String getProdPackaging() {
		return prodPackaging;
	}

	public void setProdPackaging(String prodPackaging) {
		this.prodPackaging = prodPackaging;
	}

	public String getProdVariant() {
		return prodVariant;
	}

	public void setProdVariant(String prodVariant) {
		this.prodVariant = prodVariant;
	}

	public String getProdItem() {
		return prodItem;
	}

	public void setProdItem(String prodItem) {
		this.prodItem = prodItem;
	}

	public String getDcvQty() {
		return dcvQty;
	}

	public void setDcvQty(String dcvQty) {
		this.dcvQty = dcvQty;
	}

	public String getSatuan() {
		return satuan;
	}

	public void setSatuan(String satuan) {
		this.satuan = satuan;
	}

	public String getDcvValueExcl() {
		return dcvValueExcl;
	}

	public void setDcvValueExcl(String dcvValueExcl) {
		this.dcvValueExcl = dcvValueExcl;
	}

	public String getNotes() {
		return notes;
	}

	public void setNotes(String notes) {
		this.notes = notes;
	}

}
