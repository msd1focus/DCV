package com.mycompany.myproject.service.dto;

import java.math.BigDecimal;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;



import org.dozer.Mapping;

public class ProsesPODto {
	
	private String noPo;
	private BigDecimal poId;
	private String poDesc;
	private BigDecimal poLineId;
	private String supplierCode;
	private String siteCode;
	private BigDecimal noPr;
	private BigDecimal linePr;
	private String pcTambahan;
	private BigDecimal pcTambahanPpId;
	private String pcPengganti;
	private BigDecimal pcPenggantiPpId;
	private String kodeProd;
	private String namaProd;
	private String flagBudget;
	private BigDecimal qty;
	private String uom;
	private BigDecimal unitPrice;
	private BigDecimal totalPrice;
	private BigDecimal poPpn;
	
	public ProsesPODto() {}
	public ProsesPODto(Object[] data) {
		super();
		
		this.noPo 			= (String) data[0];
		this.poId			= (BigDecimal) data[1];
		this.poDesc			= (String) data[2];
		this.poLineId		= (BigDecimal) data[3];
		this.supplierCode	= String.valueOf(data[4]);
		this.siteCode		= String.valueOf(data[5]);
		this.noPr			= (BigDecimal) data[6];
		this.linePr			= (BigDecimal) data[7];
		this.pcTambahan		= data[8] != null ? (String) data[8] : "";
		this.pcTambahanPpId	= (BigDecimal) data[9];
		this.pcPengganti	= data[10] != null ? (String) data[10] : "";
		this.pcPenggantiPpId= (BigDecimal) data[11];
		this.kodeProd		= data[12] != null ? (String) data[12] : "";
		this.namaProd		= (String) data[13];
		this.flagBudget		= (String) data[14];
		this.qty			= (BigDecimal) data[15];
		this.uom			= (String) data[16];
		this.unitPrice		= (BigDecimal) data[17];
		this.totalPrice		= (BigDecimal) data[18];
		this.poPpn			= (BigDecimal) data[19];
	}
	
	public String getNoPo() {
		return noPo;
	}
	public void setNoPo(String noPO) {
		this.noPo = noPO;
	}
	public BigDecimal getPoId() {
		return poId;
	}
	public void setPoId(BigDecimal poId) {
		this.poId = poId;
	}
	public String getPoDesc() {
		return poDesc;
	}
	public void setPoDesc(String poDesc) {
		this.poDesc = poDesc;
	}
	public BigDecimal getPoLineId() {
		return poLineId;
	}
	public void setPoLineId(BigDecimal poLineId) {
		this.poLineId = poLineId;
	}
	public String getSupplierCode() {
		return supplierCode;
	}
	public void setSupplierCode(String supplierCode) {
		this.supplierCode = supplierCode;
	}
	public String getSiteCode() {
		return siteCode;
	}
	public void setSiteCode(String siteCode) {
		this.siteCode = siteCode;
	}
	public BigDecimal getNoPr() {
		return noPr;
	}
	public void setNoPr(BigDecimal noPr) {
		this.noPr = noPr;
	}
	public BigDecimal getLinePr() {
		return linePr;
	}
	public void setLinePr(BigDecimal linePr) {
		this.linePr = linePr;
	}
	public String getPcTambahan() {
		return pcTambahan;
	}
	public void setPcTambahan(String pcTambahan) {
		this.pcTambahan = pcTambahan;
	}
	public BigDecimal getPcTambahanPpId() {
		return pcTambahanPpId;
	}
	public void setPcTambahanPpId(BigDecimal pcTambahanPpId) {
		this.pcTambahanPpId = pcTambahanPpId;
	}
	public String getPcPengganti() {
		return pcPengganti;
	}
	public void setPcPengganti(String pcPengganti) {
		this.pcPengganti = pcPengganti;
	}
	public BigDecimal getPcPenggantiPpId() {
		return pcPenggantiPpId;
	}
	public void setPcPenggantiPpId(BigDecimal pcPenggantiPpId) {
		this.pcPenggantiPpId = pcPenggantiPpId;
	}
	public String getKodeProd() {
		return kodeProd;
	}
	public void setKodeProd(String kodeProd) {
		this.kodeProd = kodeProd;
	}
	public String getNamaProd() {
		return namaProd;
	}
	public void setNamaProd(String namaProd) {
		this.namaProd = namaProd;
	}
	public String getFlagBudget() {
		return flagBudget;
	}
	public void setFlagBudget(String flagBudget) {
		this.flagBudget = flagBudget;
	}
	public BigDecimal getQty() {
		return qty;
	}
	public void setQty(BigDecimal qty) {
		this.qty = qty;
	}
	public String getUom() {
		return uom;
	}
	public void setUom(String uom) {
		this.uom = uom;
	}
	public BigDecimal getUnitPrice() {
		return unitPrice;
	}
	public void setUnitPrice(BigDecimal unitPrice) {
		this.unitPrice = unitPrice;
	}
	public BigDecimal getTotalPrice() {
		return totalPrice;
	}
	public void setTotalPrice(BigDecimal totalPrice) {
		this.totalPrice = totalPrice;
	}
	public BigDecimal getPoPpn() {
		return poPpn;
	}
	public void setPoPpn(BigDecimal poPpn) {
		this.poPpn = poPpn;
	}

}
