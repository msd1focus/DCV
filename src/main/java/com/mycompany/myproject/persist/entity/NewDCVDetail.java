package com.mycompany.myproject.persist.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.Table;

@Entity
@Table(name = "NEW_DCV_DETAIL") /*Table VIEW*/
public class NewDCVDetail {

	@Id
	@Column(name = "NO_LINEPC", nullable = false)
	private String noLinePC;
	
	@Column(name = "PROPOSAL_ID")
	private Integer propId;
	
	@Column(name="PRODUCT_CLASS")  
	private String prodClass;
	
	@Column(name="PRODUCT_CLASS_DESC") 
	private String prodClassDesc;
	
	@Column(name="PRODUCT_BRAND")  
	private String prodBrand;
	
	@Column(name="PRODUCT_BRAND_DESC")  
	private String prodBrandDesc;
	
	@Column(name="PRODUCT_EXT")  
	private String prodExt;
	
	@Column(name="PRODUCT_EXT_DESC")  
	private String prodExtDesc;
	
	@Column(name="PRODUCT_PACK") 
	private String prodPack;
	
	@Column(name="PRODUCT_PACK_DESC") 
	private String prodPackDesc;
	
	@Column(name="VARIANT") 
	private String prodVariantDesc;
	
	@Column(name="PROD_VARIANT") 
	private String prodVariant;
	
	@Lob
	@Column(name = "ITEM")
	private String prodItemDesc;
	
	@Column(name="PROD_ITEM") 
	private String prodItem;
	
	@Column(name="PROMO_PRODUK_ID")
	private Integer promoProdId;

	public String getNoLinePC() {
		return noLinePC;
	}

	public void setNoLinePC(String noLinePC) {
		this.noLinePC = noLinePC;
	}

	public Integer getPropId() {
		return propId;
	}

	public void setPropId(Integer propId) {
		this.propId = propId;
	}

	public String getProdClass() {
		return prodClass;
	}

	public void setProdClass(String prodClass) {
		this.prodClass = prodClass;
	}

	public String getProdClassDesc() {
		return prodClassDesc;
	}

	public void setProdClassDesc(String prodClassDesc) {
		this.prodClassDesc = prodClassDesc;
	}

	public String getProdBrand() {
		return prodBrand;
	}

	public void setProdBrand(String prodBrand) {
		this.prodBrand = prodBrand;
	}

	public String getProdBrandDesc() {
		return prodBrandDesc;
	}

	public void setProdBrandDesc(String prodBrandDesc) {
		this.prodBrandDesc = prodBrandDesc;
	}

	public String getProdExt() {
		return prodExt;
	}

	public void setProdExt(String prodExt) {
		this.prodExt = prodExt;
	}

	public String getProdExtDesc() {
		return prodExtDesc;
	}

	public void setProdExtDesc(String prodExtDesc) {
		this.prodExtDesc = prodExtDesc;
	}

	public String getProdPack() {
		return prodPack;
	}

	public void setProdPack(String prodPack) {
		this.prodPack = prodPack;
	}

	public String getProdPackDesc() {
		return prodPackDesc;
	}

	public void setProdPackDesc(String prodPackDesc) {
		this.prodPackDesc = prodPackDesc;
	}

	public String getProdVariantDesc() {
		return prodVariantDesc;
	}

	public void setProdVariantDesc(String prodVariantDesc) {
		this.prodVariantDesc = prodVariantDesc;
	}

	public String getProdVariant() {
		return prodVariant;
	}

	public void setProdVariant(String prodVariant) {
		this.prodVariant = prodVariant;
	}

	public String getProdItemDesc() {
		return prodItemDesc;
	}

	public void setProdItemDesc(String prodItemDesc) {
		this.prodItemDesc = prodItemDesc;
	}

	public String getProdItem() {
		return prodItem;
	}

	public void setProdItem(String prodItem) {
		this.prodItem = prodItem;
	}

	public Integer getPromoProdId() {
		return promoProdId;
	}

	public void setPromoProdId(Integer promoProdId) {
		this.promoProdId = promoProdId;
	}
	
	
	
	
	
	


}
