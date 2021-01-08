package com.mycompany.myproject.service.dto;

import java.math.BigDecimal;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.dozer.Mapping;

public class CopyDcvDto {

	
	@Mapping("no_linepc" )
	private String noLinePc;
	
	@Mapping("product_class")
	private String productClass;
	
	@Mapping("product_class_desc")
	private String productClassDesc;
	
	@Mapping("product_brand")
	private String productBrand;
	
	@Mapping("product_brand_desc")
	private String productBrandDesc;
	
	@Mapping("product_ext")
	private String productExt;
	
	@Mapping("product_ext_desc")
	private String productExtDesc;
	
	@Mapping("product_pack")
	private String productPack;
	
	@Mapping("product_pack_desc")
	private String productPackDesc;
	
	@Mapping("product_variant")
	private String productVariant;
	
	@Mapping("product_variant_desc")
	private String productVariantDesc;
	
	@Mapping("product_item")
	private String productItem;
	
	@Mapping("product_item_desc")
	private String productItemDesc;
	
	@Mapping("qty")
	private BigDecimal qty;
	
	@Mapping("satuan")
	private String satuan;
	
	@Mapping("value_ext")
	private BigDecimal valueExt;
	
	@Mapping("notes")
	private String notes;
	
	@Mapping("promo_produk_id")
	private BigDecimal promoProdId;
	
	
	
	public CopyDcvDto() {
		
	}

	public CopyDcvDto(Object[] data) {
		super();

		DateFormat f1 = new SimpleDateFormat("dd/MM/yyyy");
		DateFormat f2 = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
		
		this.noLinePc = data[0] != null ? (String) data[0] : "";
		this.productClass = data[1] != null ? (String) data[1] : "";
    	this.productClassDesc = data[2] != null ? (String) data[2] : "";
    	this.productBrand =data[3] != null ? (String) data[3] : "";
    	this.productBrandDesc = data[4] != null ? (String) data[4] : "";
    	this.productExt = data[5] != null ? (String) data[5] : "";
    	this.productExtDesc = data[6] != null ? (String) data[6] : "";
    	this.productPack = data[7] != null ? (String) data[7] : "";
    	this.productPackDesc = data[8] != null ? (String) data[8] : "";
    	this.productVariant = data[9] != null ? (String) data[9] : "";
    	this.productVariantDesc = data[10] != null ? (String) data[10] : "";
    	this.productItem = data[11] != null ? (String) data[11] : "";
    	this.productItemDesc = data[12] != null ? (String) data[12] : "";
    	this.qty = data[13] != null ? new BigDecimal(data[13].toString()) : null;
    	this.satuan = data[14] != null ? (String) data[14] : "";
    	this.valueExt = data[15] != null ? new BigDecimal(data[15].toString()) : null;
    	this.notes =  data[16] != null ? (String) data[16] : "";
    	this.promoProdId = data[17] != null ? new BigDecimal(data[17].toString()) : null;
		
		
		
	}
	
	

	public String getProductClass() {
		return productClass;
	}

	public void setProductClass(String productClass) {
		this.productClass = productClass;
	}

	public String getProductClassDesc() {
		return productClassDesc;
	}

	public void setProductClassDesc(String productClassDesc) {
		this.productClassDesc = productClassDesc;
	}

	public String getNoLinePc() {
		return noLinePc;
	}

	public void setNoLinePc(String noLinePc) {
		this.noLinePc = noLinePc;
	}


	public String getProductBrand() {
		return productBrand;
	}

	public void setProductBrand(String productBrand) {
		this.productBrand = productBrand;
	}

	public String getProductBrandDesc() {
		return productBrandDesc;
	}

	public void setProductBrandDesc(String productBrandDesc) {
		this.productBrandDesc = productBrandDesc;
	}

	public String getProductExt() {
		return productExt;
	}

	public void setProductExt(String productExt) {
		this.productExt = productExt;
	}

	public String getProductExtDesc() {
		return productExtDesc;
	}

	public void setProductExtDesc(String productExtDesc) {
		this.productExtDesc = productExtDesc;
	}

	public String getProductPack() {
		return productPack;
	}

	public void setProductPack(String productPack) {
		this.productPack = productPack;
	}

	public String getProductPackDesc() {
		return productPackDesc;
	}

	public void setProductPackDesc(String productPackDesc) {
		this.productPackDesc = productPackDesc;
	}

	public String getProductVariant() {
		return productVariant;
	}

	public void setProductVariant(String productVariant) {
		this.productVariant = productVariant;
	}

	public String getProductVariantDesc() {
		return productVariantDesc;
	}

	public void setProductVariantDesc(String productVariantDesc) {
		this.productVariantDesc = productVariantDesc;
	}

	public String getProductItem() {
		return productItem;
	}

	public void setProductItem(String productItem) {
		this.productItem = productItem;
	}

	public String getProductItemDesc() {
		return productItemDesc;
	}

	public void setProductItemDesc(String productItemDesc) {
		this.productItemDesc = productItemDesc;
	}

	

	public String getSatuan() {
		return satuan;
	}

	public void setSatuan(String satuan) {
		this.satuan = satuan;
	}

	

	public String getNotes() {
		return notes;
	}

	public void setNotes(String notes) {
		this.notes = notes;
	}

	public BigDecimal getQty() {
		return qty;
	}

	public void setQty(BigDecimal qty) {
		this.qty = qty;
	}

	public BigDecimal getValueExt() {
		return valueExt;
	}

	public void setValueExt(BigDecimal valueExt) {
		this.valueExt = valueExt;
	}

	public BigDecimal getPromoProdId() {
		return promoProdId;
	}

	public void setPromoProdId(BigDecimal promoProdId) {
		this.promoProdId = promoProdId;
	}
	
	
	
	
	
	

}
