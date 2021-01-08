package com.mycompany.myproject.persist.entity;

import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;

@Entity
@Table(name = "TC_APPROVAL")
public class TcApproval {
	
	private static final long serialVersionUID = 1L;
	
	@Id
	@GenericGenerator(name = "DCV_SEQ", strategy = "increment")
	@GeneratedValue(generator = "DCV_SEQ")
	@Column(name = "ID", nullable = false)
	private Long id;
	
	@Column(name = "DCVL_ID", nullable = false)
	private Long dcvlId;
	
	@Column(name="NO_PO" )
	private String noPo;
	
	@Column(name="PO_ID")
	private Long poId;
	
	@Column(name="PO_DESC" )
	private String poDesc;
	
	@Column(name="POLINE_ID")
	private Long poLineId;
	
	@Column(name="KODE_SUPLIER" )
	private String kodeSuplier;
	
	@Column(name="KODE_SITE" )
	private String kodeSite;
	
	@Column(name="NO_PR")
	private String noPr;
	
	@Column(name="LINE_PR")
	private Long linePr;
	
	@Column(name="PC_PENGGANTI")
	private String pcPengganti;
	
	@Column(name="PC_PENGGANTI_PP_ID")
	private Long pcPenggantiPPId;
	
	@Column(name="PC_TAMBAHAN")
	private String pcTambahan;
	
	@Column(name="PC_TAMBAHAN_PP_ID")
	private Long pcTambahanPPId;
	
	@Column(name="PROD_CODE")
	private String prodCode; 
	
	@Column(name="PROD_NAME")
	private String prodName; 
	
	@Column(name="FLAG_BUDGET")
	private String flagBudget;
	
	@Column(name="QTY")
	private BigDecimal qty;
	
	@Column(name="UOM")
	private String uom;
	
	@Column(name="HARGA_SATUAN")
	private Long hargaSatuan;
	
	@Column(name="NILAI_TOTAL")
	private BigDecimal nilaiTotal;
	
	@Column(name="NOTES")
	private String notes;
	
	@Column(name="PO_PPN")
	private BigDecimal poPpn;
	
	@Column(name="MODIFIED_DT")
	private Date modifiedDt;
	
	@Column(name="MODIFIED_BY")
	private String modifiedBy;
	
	@Column(name="QTY_PO")
	private BigDecimal qtyPo;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getDcvlId() {
		return dcvlId;
	}

	public void setDcvlId(Long dcvlId) {
		this.dcvlId = dcvlId;
	}

	public String getNoPo() {
		return noPo;
	}

	public void setNoPo(String noPo) {
		this.noPo = noPo;
	}

	public Long getPoId() {
		return poId;
	}

	public void setPoId(Long poId) {
		this.poId = poId;
	}

	public String getPoDesc() {
		return poDesc;
	}

	public void setPoDesc(String poDesc) {
		this.poDesc = poDesc;
	}

	public Long getPoLineId() {
		return poLineId;
	}

	public void setPoLineId(Long poLineId) {
		this.poLineId = poLineId;
	}

	public String getKodeSuplier() {
		return kodeSuplier;
	}

	public void setKodeSuplier(String kodeSuplier) {
		this.kodeSuplier = kodeSuplier;
	}

	public String getKodeSite() {
		return kodeSite;
	}

	public void setKodeSite(String kodeSite) {
		this.kodeSite = kodeSite;
	}

	public String getNoPr() {
		return noPr;
	}

	public void setNoPr(String noPr) {
		this.noPr = noPr;
	}

	public Long getLinePr() {
		return linePr;
	}

	public void setLinePr(Long linePr) {
		this.linePr = linePr;
	}

	public String getPcPengganti() {
		return pcPengganti;
	}

	public void setPcPengganti(String pcPengganti) {
		this.pcPengganti = pcPengganti;
	}

	public Long getPcPenggantiPPId() {
		return pcPenggantiPPId;
	}

	public void setPcPenggantiPPId(Long pcPenggantiPPId) {
		this.pcPenggantiPPId = pcPenggantiPPId;
	}

	public String getPcTambahan() {
		return pcTambahan;
	}

	public void setPcTambahan(String pcTambahan) {
		this.pcTambahan = pcTambahan;
	}

	public Long getPcTambahanPPId() {
		return pcTambahanPPId;
	}

	public void setPcTambahanPPId(Long pcTambahanPPId) {
		this.pcTambahanPPId = pcTambahanPPId;
	}

	public String getProdCode() {
		return prodCode;
	}

	public void setProdCode(String prodCode) {
		this.prodCode = prodCode;
	}

	public String getProdName() {
		return prodName;
	}

	public void setProdName(String prodName) {
		this.prodName = prodName;
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

	public Long getHargaSatuan() {
		return hargaSatuan;
	}

	public void setHargaSatuan(Long hargaSatuan) {
		this.hargaSatuan = hargaSatuan;
	}

	public BigDecimal getNilaiTotal() {
		return nilaiTotal;
	}

	public void setNilaiTotal(BigDecimal nilaiTotal) {
		this.nilaiTotal = nilaiTotal;
	}

	public String getNotes() {
		return notes;
	}

	public void setNotes(String notes) {
		this.notes = notes;
	}

	public BigDecimal getPoPpn() {
		return poPpn;
	}

	public void setPoPpn(BigDecimal poPpn) {
		this.poPpn = poPpn;
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

	public BigDecimal getQtyPo() {
		return qtyPo;
	}

	public void setQtyPo(BigDecimal qtyPo) {
		this.qtyPo = qtyPo;
	}

}
