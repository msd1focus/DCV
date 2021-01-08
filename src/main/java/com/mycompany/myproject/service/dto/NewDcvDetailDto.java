package com.mycompany.myproject.service.dto;

import java.io.IOException;
import java.io.Reader;
import java.math.BigDecimal;
import java.sql.Clob;
import java.sql.SQLException;

import javax.persistence.Column;
import javax.persistence.Id;
import javax.persistence.Lob;

import org.dozer.Mapping;

public class NewDcvDetailDto {
	
	
	@Mapping("NO_LINEPC")
	private String noLinePC;
	
	@Mapping("PROPOSAL_ID")
	private BigDecimal propId;
	
	@Mapping("PRODUCT_CLASS")  
	private String prodClass;
	
	@Mapping("PRODUCT_CLASS_DESC") 
	private String prodClassDesc;
	
	@Mapping("PRODUCT_BRAND")  
	private String prodBrand;
	
	@Mapping("PRODUCT_BRAND_DESC")  
	private String prodBrandDesc;
	
	@Mapping("PRODUCT_EXT")  
	private String prodExt;
	
	@Mapping("PRODUCT_EXT_DESC")  
	private String prodExtDesc;
	
	@Mapping("PRODUCT_PACK") 
	private String prodPack;
	
	@Mapping("PRODUCT_PACK_DESC") 
	private String prodPackDesc;
	
	@Mapping("VARIANT") 
	private String prodVariantDesc;
	
	@Mapping("PROD_VARIANT") 
	private String prodVariant;
	
	@Mapping("ITEM")
	private String prodItemDesc;
	
	@Mapping("PROD_ITEM") 
	private String prodItem;
	
	@Mapping("PROMO_PRODUK_ID")
	private BigDecimal promoProdId;
	
	public NewDcvDetailDto() {};
	
	public NewDcvDetailDto(Object[] data) throws SQLException, IOException{
		super();
		
		this.propId = (BigDecimal) data[0];
		this.noLinePC = (String) data[1];
		this.prodVariantDesc = data[2] != null ? convertAuto( data[2])  : "" ;
		this.prodVariant = data[3] != null ? convertAuto( data[3]) : "" ;
		this.prodItem = data[4] != null ? convertAuto( data[4]) : "" ;
		this.prodItemDesc = data[5] != null ?  convertAuto( data[5]) : "";
		this.prodClass = data[6] != null ?  (String) data[6] : "";
		this.prodClassDesc = data[7] != null ? (String) data[7] : "";
		this.prodBrand = data[8] != null ? (String) data[8] : "";
		this.prodBrandDesc = data[9] != null ? (String) data[9] : "";
		this.prodExt = data[10] != null ? (String) data[10] : "";
		this.prodExtDesc = data[11] != null ? (String) data[11] : "";
		this.prodPack = data[12] != null ? (String) data[12] : "";
		this.prodPackDesc = data[13] != null ? (String) data[13] : "";
		this.promoProdId = (BigDecimal) data[14];
		
		
		
	}

	public String getNoLinePC() {
		return noLinePC;
	}

	public void setNoLinePC(String noLinePC) {
		this.noLinePC = noLinePC;
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

	public BigDecimal getPropId() {
		return propId;
	}

	public void setPropId(BigDecimal propId) {
		this.propId = propId;
	}

	public BigDecimal getPromoProdId() {
		return promoProdId;
	}

	public void setPromoProdId(BigDecimal promoProdId) {
		this.promoProdId = promoProdId;
	}
	
	public static String convertAuto(Object dataObj) throws SQLException, IOException {
		String result = "";
		if (dataObj instanceof String){
			result = (String) dataObj;
		} else if (dataObj instanceof Clob){
			result = readClob((Clob) dataObj );
		} else {
			// do nothing
		}
		
		return result;
	}
	
	public static String readClob(Clob clob) throws SQLException, IOException {
	    StringBuilder sb = new StringBuilder((int) clob.length());
	    Reader r = clob.getCharacterStream();
	    char[] cbuf = new char[2048];
	    int n;
	    while ((n = r.read(cbuf, 0, cbuf.length)) != -1) {
	        sb.append(cbuf, 0, n);
	    }
	    return sb.toString();
	}

	
	
	

}
