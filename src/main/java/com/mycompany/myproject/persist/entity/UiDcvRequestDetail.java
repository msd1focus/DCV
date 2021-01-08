package com.mycompany.myproject.persist.entity;

import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.hibernate.annotations.GenericGenerator;

@Entity
@Table(name = "REQUEST_DTL")
public class UiDcvRequestDetail {

	private static final long serialVersionUID = 1L;
	
	@Id
	@GenericGenerator(name = "DCV_DETAIL_SEQ", strategy = "increment")
	@GeneratedValue(generator = "DCV_DETAIL_SEQ")
	@Column(name = "DCVL_ID", nullable = false)
	private Long dcvlId;
	
	@Column(name="DCVH_ID", nullable = false)
	private Long dcvhId;
	
	@Column(name="DCVL_PROMO_PRODUCT_ID")
	private Integer promoProdId;
	
	@Column(name="DCVL_PROD_CLASS")
	private String prodClass;
	
	@Column(name="DCVL_PROD_CLASS_DESC")
	private String prodClassDesc;
	
	@Column(name="DCVL_PROD_BRAND")
	private String prodBrand;
	
	@Column(name="DCVL_PROD_BRAND_DESC")
	private String prodBrandDesc;
	
	@Column(name="DCVL_PROD_EXT")
	private String prodExt;
	
	@Column(name="DCVL_PROD_EXT_DESC")
	private String prodExtDesc;
	
	@Column(name="DCVL_PROD_PACKAGING")
	private String prodPack;
	
	@Column(name="DCVL_PROD_PACKAGING_DESC")
	private String prodPackDesc;
	
	@Column(name="DCVL_PROD_VARIANT")
	private String prodVariant;
	
	@Column(name="DCVL_PROD_VARIANT_DESC")
	private String prodVariantDesc;
	
	@Column(name="DCVL_PROD_ITEM")
	private String prodItem;
	
	@Column(name="DCVL_PROD_ITEM_DESC")
	private String prodItemDesc;
	
	@Column(name="DCVL_QTY")
	private BigDecimal qyt;
	
	@Column(name="DCVL_UOM")
	private String uom;
	
	@Column(name="DCVL_VAL_EXC")
	private BigDecimal valExc;
	
	@Column(name="DCVL_CATATAN_DISTRIBUTOR")
	private String catatanDist;
	
	@Column(name="DCVL_APPV_VAL_EXC")
	private BigDecimal appvValExc;
	
	@Column(name="DCVL_PPN_CODE")
	private String ppnCode;
	
	@Column(name="DCVL_PPN_VAL")
	private BigDecimal ppnVal;
	
	@Column(name="DCVL_PPH_CODE")
	private String pphCode;
	
	@Column(name="DCVL_PPH_VAL")
	private BigDecimal pphVal;
	
	@Column(name="DCVL_TOTAL_VAL_APPV_INC")
	private BigDecimal totalValAppvInc;
	
	@Column(name="DCVL_SELISIH")
	private BigDecimal selisih;
	
	@Column(name="DCVL_CATATAN_TC")
	private String catatanTC;
	
	@Column(name="MODIFIED_DT")
	private Date modifiedDt;
	
	@Column(name="MODIFIED_BY")
	private String modifiedBy;
	
	@Column(name="DCVL_APPV_QTY")
	private BigDecimal appvQty;
	
	@Column(name="DCVL_APPV_UOM")
	private String appvUom;
	
	@Column(name="DCVL_PPN_NAME")
	private String ppnName;
	
	@Column(name="DCVL_PPH_NAME")
	private String pphName;
	
	@Column(name="DCVL_PCLINE")
	private String pcLine;
	
	@Transient
	private String noLinePC;
	
	@Transient
	private String custCode;

	public Long getDcvlId() {
		return dcvlId;
	}

	public void setDcvlId(Long dcvlId) {
		this.dcvlId = dcvlId;
	}

	public Long getDcvhId() {
		return dcvhId;
	}

	public void setDcvhId(Long dcvhId) {
		this.dcvhId = dcvhId;
	}

	public Integer getPromoProdId() {
		return promoProdId;
	}

	public void setPromoProdId(Integer promoProdId) {
		this.promoProdId = promoProdId;
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

	public String getProdVariant() {
		return prodVariant;
	}

	public void setProdVariant(String prodVariant) {
		this.prodVariant = prodVariant;
	}

	public String getProdVariantDesc() {
		return prodVariantDesc;
	}

	public void setProdVariantDesc(String prodVariantDesc) {
		this.prodVariantDesc = prodVariantDesc;
	}

	public String getProdItem() {
		return prodItem;
	}

	public void setProdItem(String prodItem) {
		this.prodItem = prodItem;
	}

	public String getProdItemDesc() {
		return prodItemDesc;
	}

	public void setProdItemDesc(String prodItemDesc) {
		this.prodItemDesc = prodItemDesc;
	}

	public BigDecimal getQyt() {
		return qyt;
	}

	public void setQyt(BigDecimal qyt) {
		this.qyt = qyt;
	}

	public String getUom() {
		return uom;
	}

	public void setUom(String uom) {
		this.uom = uom;
	}

	public BigDecimal getValExc() {
		return valExc;
	}

	public void setValExc(BigDecimal valExc) {
		this.valExc = valExc;
	}

	public String getCatatanDist() {
		return catatanDist;
	}

	public void setCatatanDist(String catatanDist) {
		this.catatanDist = catatanDist;
	}

	public BigDecimal getAppvValExc() {
		return appvValExc;
	}

	public void setAppvValExc(BigDecimal appvValExc) {
		this.appvValExc = appvValExc;
	}

	public String getPpnCode() {
		return ppnCode;
	}

	public void setPpnCode(String ppnCode) {
		this.ppnCode = ppnCode;
	}

	public BigDecimal getPpnVal() {
		return ppnVal;
	}

	public void setPpnVal(BigDecimal ppnVal) {
		this.ppnVal = ppnVal;
	}

	public String getPphCode() {
		return pphCode;
	}

	public void setPphCode(String pphCode) {
		this.pphCode = pphCode;
	}

	public BigDecimal getPphVal() {
		return pphVal;
	}

	public void setPphVal(BigDecimal pphVal) {
		this.pphVal = pphVal;
	}

	public BigDecimal getTotalValAppvInc() {
		return totalValAppvInc;
	}

	public void setTotalValAppvInc(BigDecimal totalValAppvInc) {
		this.totalValAppvInc = totalValAppvInc;
	}

	public BigDecimal getSelisih() {
		return selisih;
	}

	public void setSelisih(BigDecimal selisih) {
		this.selisih = selisih;
	}

	public String getCatatanTC() {
		return catatanTC;
	}

	public void setCatatanTC(String catatanTC) {
		this.catatanTC = catatanTC;
	}

	public Date getModifiedDt() {
		return modifiedDt;
	}

	public void setModifiedDt(Date modifiedDt) {
		this.modifiedDt = modifiedDt;
	}

	public String getModifiedBy() {
		return modifiedBy;
	}

	public void setModifiedBy(String modifiedBy) {
		this.modifiedBy = modifiedBy;
	}

	public BigDecimal getAppvQty() {
		return appvQty;
	}

	public void setAppvQty(BigDecimal appvQty) {
		this.appvQty = appvQty;
	}

	public String getAppvUom() {
		return appvUom;
	}

	public void setAppvUom(String appvUom) {
		this.appvUom = appvUom;
	}

	public String getPpnName() {
		return ppnName;
	}

	public void setPpnName(String ppnName) {
		this.ppnName = ppnName;
	}

	public String getPphName() {
		return pphName;
	}

	public void setPphName(String pphName) {
		this.pphName = pphName;
	}

	public String getNoLinePC() {
		return noLinePC;
	}

	public void setNoLinePC(String noLinePC) {
		this.noLinePC = noLinePC;
	}

	public String getCustCode() {
		return custCode;
	}

	public void setCustCode(String custCode) {
		this.custCode = custCode;
	}

	public String getPcLine() {
		return pcLine;
	}

	public void setPcLine(String pcLine) {
		this.pcLine = pcLine;
	}
	
	
}
