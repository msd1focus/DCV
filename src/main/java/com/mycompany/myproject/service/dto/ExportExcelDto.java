package com.mycompany.myproject.service.dto;

import java.math.BigDecimal;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.dozer.Mapping;

public class ExportExcelDto {
	@Mapping("dcvh_company")
	private String dcvhCompany;

	@Mapping("dcvh_cust_code")
	private String dcvhCustCode;

	@Mapping("dcvh_cust_name")
	private String dcvhCustName;

	@Mapping("dcvh_region")
	private String dcvhRegion;

	@Mapping("dcvh_area")
	private String dcvhArea;

	@Mapping("dcvh_location")
	private String dcvhLocation;

	@Mapping("dcvh_no_dcv")
	private String dcvhNoDcv;

	@Mapping("dcvh_submit_time")
	private String dcvhSubmitTime;   // langsung konvert ke string

	@Mapping("dcvh_no_pc")
	private String dcvhNoPc;

	@Mapping("dcvh_key_pc")
	private String dcvhKeyPc;

	@Mapping("dcvh_periode_pc_start")
	private String dcvhPeriodPcStart;   // langsung konvert ke string

	@Mapping("dcvh_periode_pc_end")
	private String dcvhPeriodPcEnd;     // langsung konvert ke string

	@Mapping("dcvh_pc_tipe")
	private String dcvhPcType;

	@Mapping("dcvh_pc_kategori")
	private String dcvhPcKategory;

	@Mapping("dcvh_value")
	private String dcvhValue;          // dari bigDec langsung konvert ke string

	@Mapping("dcvh_appv_value")
	private String dcvhAppvValue;      // dari bigDec langsung konvert ke string

	@Mapping("dcvh_dcv_status")
	private String dcvhStatus;       
	
	// masuk bagian req dtl
//	private String spaceDtl;
	//

	@Mapping("dcvl_prod_class_desc")
	private String dcvlProdClassDesc;

	@Mapping("dcvl_prod_brand_desc")
	private String dcvlProdBrandDesc;

	@Mapping("dcvl_prod_ext_desc")
	private String dcvlProdExtDesc;

	@Mapping("dcvl_qty")
	private String dcvlQty;         // langsung konvert ke string dari bigDec

	@Mapping("dcvl_uom")
	private String dcvlUom;

	@Mapping("dcvl_val_exc")
	private String dcvlValExc;      // langsung konvert ke string dari bgiDec
	
	// bagian tc_approval
//	private String spacetcApp1;
	//

	@Mapping("dcvl_appv_val_exc")
	private String dcvlAppvValExc;   // langsung konvert ke string dari bgiDec

	@Mapping("dcvl_selisih")
	private String dcvlSelisih;	// langsung konvert ke string dari bgiDec

	@Mapping("dcvl_catatan_tc")
	private String dcvlCatatanTc;

	@Mapping("dcvl_ppn_val")    
	private String dcvlPpnVal;      // langsung konvert ke string dari bgiDec

	@Mapping("dcvl_pph_val")
	private String dcvlPphVal;      // langsung konvert ke string dari bgiDec

	@Mapping("dcvl_total_val_appv_inc")
	private String dcvlTotalValAppvInc;     // langsung konvert ke string dari bgiDec
	
	// bagian tc_approval
//	private String spacetcApp2;
	//	
	
	@Mapping("prod_code")
	private String prodCode;

	@Mapping("prod_name")
	private String prodName;

	@Mapping("qty")
	private String qty;        // langsung konvert ke string dari bgiDec

	@Mapping("harga_satuan")
	private String hargaSatuan;        // langsung konvert ke string dari bgiDec

	@Mapping("nilai_total")
	private String nilaiTotal;			// langsung konvert ke string dari bgiDec
	
	@Mapping("notes")
	private String notes;

	public ExportExcelDto(){
		
	}
	
	public ExportExcelDto(Object[] data){
		super();

		DateFormat f1 = new SimpleDateFormat("dd/MM/yyyy");
		DateFormat f2 = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
		this.dcvhCompany = data[0] != null ? (String) data[0] : "";
		this.dcvhCustCode = data[1] != null ? (String) data[1] : "";
		this.dcvhCustName = data[2] != null ? (String) data[2] : "";
		this.dcvhRegion = data[3] != null ? (String) data[3] : "";
		this.dcvhArea = data[4] != null ? (String) data[4] : "";
		this.dcvhLocation = data[5] != null ? (String) data[5] : "";
		this.dcvhNoDcv = data[6] != null ? (String) data[6] : "";
		this.dcvhSubmitTime = data[7] != null ? f1.format(data[7]) : "";
		this.dcvhNoPc =  data[8] != null ? (String) data[8] : "";
		this.dcvhKeyPc =   data[9] != null ? (String) data[9] : "";
		this.dcvhPeriodPcStart = data[10] != null ? f1.format(data[10]) : "";
		this.dcvhPeriodPcEnd = data[11] != null ? f1.format(data[11]) : "";
		this.dcvhPcType = data[12] != null ? (String) data[12] : "";
		this.dcvhPcKategory = data[13] != null ? (String) data[13] : "";
		this.dcvhValue = data[14] != null ? data[14].toString() : "";
		this.dcvhAppvValue = data[15] != null ? data[15].toString() : "";
		this.dcvhStatus = data[16] != null ? (String) data[16] : "";
		// buat empty data
//		this.spaceDtl = "";
		// empty until here
		this.dcvlProdClassDesc = data[17] != null ? (String) data[17] : "";
		this.dcvlProdBrandDesc = data[18] != null ? (String) data[18] : "";
		this.dcvlProdExtDesc =  data[19] != null ? (String) data[19] : "";
		this.dcvlQty =  data[20] != null ? data[20].toString() : "";
		this.dcvlUom = data[21] != null ? (String) data[21] : "";
		this.dcvlValExc = data[22] != null ? data[22].toString() : "";
		// buat empty data
//		this.spacetcApp1 = "";
		//
		this.dcvlAppvValExc = data[23] != null ? data[23].toString() : "";
		this.dcvlSelisih = data[24] != null ? data[24].toString() : "";
		this.dcvlCatatanTc  = data[25] != null ? (String) data[25] : "";
		this.dcvlPpnVal = data[26] != null ? data[26].toString() : "";
		this.dcvlPphVal = data[27] != null ? data[27].toString() : "";
		this.dcvlTotalValAppvInc = data[28] != null ? data[28].toString() : "";
		// buat empty data
//		this.spacetcApp2 = "";
		//
		this.prodCode = data[29] != null ? (String) data[29] : "";
		this.prodName = data[30] != null ? (String) data[30] : "";
		this.qty = data[31] != null ? data[31].toString() : "";
		this.hargaSatuan = data[32] != null ? data[32].toString() : "";
		this.nilaiTotal = data[33] != null ? data[33].toString() : "";
		this.notes = data[34] != null ? (String) data[34] : "";
		
	}

	public String getDcvhCompany() {
		return dcvhCompany;
	}

	public void setDcvhCompany(String dcvhCompany) {
		this.dcvhCompany = dcvhCompany;
	}

	public String getDcvhCustCode() {
		return dcvhCustCode;
	}

	public void setDcvhCustCode(String dcvhCustCode) {
		this.dcvhCustCode = dcvhCustCode;
	}

	public String getDcvhCustName() {
		return dcvhCustName;
	}

	public void setDcvhCustName(String dcvhCustName) {
		this.dcvhCustName = dcvhCustName;
	}

	public String getDcvhRegion() {
		return dcvhRegion;
	}

	public void setDcvhRegion(String dcvhRegion) {
		this.dcvhRegion = dcvhRegion;
	}

	public String getDcvhArea() {
		return dcvhArea;
	}

	public void setDcvhArea(String dcvhArea) {
		this.dcvhArea = dcvhArea;
	}

	public String getDcvhLocation() {
		return dcvhLocation;
	}

	public void setDcvhLocation(String dcvhLocation) {
		this.dcvhLocation = dcvhLocation;
	}

	public String getDcvhNoDcv() {
		return dcvhNoDcv;
	}

	public void setDcvhNoDcv(String dcvhNoDcv) {
		this.dcvhNoDcv = dcvhNoDcv;
	}

	public String getDcvhSubmitTime() {
		return dcvhSubmitTime;
	}

	public void setDcvhSubmitTime(String dcvhSubmitTime) {
		this.dcvhSubmitTime = dcvhSubmitTime;
	}

	public String getDcvhNoPc() {
		return dcvhNoPc;
	}

	public void setDcvhNoPc(String dcvhNoPc) {
		this.dcvhNoPc = dcvhNoPc;
	}

	public String getDcvhKeyPc() {
		return dcvhKeyPc;
	}

	public void setDcvhKeyPc(String dcvhKeyPc) {
		this.dcvhKeyPc = dcvhKeyPc;
	}

	public String getDcvhPeriodPcStart() {
		return dcvhPeriodPcStart;
	}

	public void setDcvhPeriodPcStart(String dcvhPeriodPcStart) {
		this.dcvhPeriodPcStart = dcvhPeriodPcStart;
	}

	public String getDcvhPeriodPcEnd() {
		return dcvhPeriodPcEnd;
	}

	public void setDcvhPeriodPcEnd(String dcvhPeriodPcEnd) {
		this.dcvhPeriodPcEnd = dcvhPeriodPcEnd;
	}

	public String getDcvhPcType() {
		return dcvhPcType;
	}

	public void setDcvhPcType(String dcvhPcType) {
		this.dcvhPcType = dcvhPcType;
	}

	public String getDcvhPcKategory() {
		return dcvhPcKategory;
	}

	public void setDcvhPcKategory(String dcvhPcKategory) {
		this.dcvhPcKategory = dcvhPcKategory;
	}

	public String getDcvhValue() {
		return dcvhValue;
	}

	public void setDcvhValue(String dcvhValue) {
		this.dcvhValue = dcvhValue;
	}

	public String getDcvhAppvValue() {
		return dcvhAppvValue;
	}

	public void setDcvhAppvValue(String dcvhAppvValue) {
		this.dcvhAppvValue = dcvhAppvValue;
	}

	public String getDcvhStatus() {
		return dcvhStatus;
	}

	public void setDcvhStatus(String dcvhStatus) {
		this.dcvhStatus = dcvhStatus;
	}

	public String getDcvlProdClassDesc() {
		return dcvlProdClassDesc;
	}

	public void setDcvlProdClassDesc(String dcvlProdClassDesc) {
		this.dcvlProdClassDesc = dcvlProdClassDesc;
	}

	public String getDcvlProdBrandDesc() {
		return dcvlProdBrandDesc;
	}

	public void setDcvlProdBrandDesc(String dcvlProdBrandDesc) {
		this.dcvlProdBrandDesc = dcvlProdBrandDesc;
	}

	public String getDcvlProdExtDesc() {
		return dcvlProdExtDesc;
	}

	public void setDcvlProdExtDesc(String dcvlProdExtDesc) {
		this.dcvlProdExtDesc = dcvlProdExtDesc;
	}

	public String getDcvlQty() {
		return dcvlQty;
	}

	public void setDcvlQty(String dcvlQty) {
		this.dcvlQty = dcvlQty;
	}

	public String getDcvlUom() {
		return dcvlUom;
	}

	public void setDcvlUom(String dcvlUom) {
		this.dcvlUom = dcvlUom;
	}

	public String getDcvlValExc() {
		return dcvlValExc;
	}

	public void setDcvlValExc(String dcvlValExc) {
		this.dcvlValExc = dcvlValExc;
	}

	public String getDcvlAppvValExc() {
		return dcvlAppvValExc;
	}

	public void setDcvlAppvValExc(String dcvlAppvValExc) {
		this.dcvlAppvValExc = dcvlAppvValExc;
	}

	public String getDcvlSelisih() {
		return dcvlSelisih;
	}

	public void setDcvlSelisih(String dcvlSelisih) {
		this.dcvlSelisih = dcvlSelisih;
	}

	public String getDcvlCatatanTc() {
		return dcvlCatatanTc;
	}

	public void setDcvlCatatanTc(String dcvlCatatanTc) {
		this.dcvlCatatanTc = dcvlCatatanTc;
	}

	public String getDcvlPpnVal() {
		return dcvlPpnVal;
	}

	public void setDcvlPpnVal(String dcvlPpnVal) {
		this.dcvlPpnVal = dcvlPpnVal;
	}

	public String getDcvlPphVal() {
		return dcvlPphVal;
	}

	public void setDcvlPphVal(String dcvlPphVal) {
		this.dcvlPphVal = dcvlPphVal;
	}

	public String getDcvlTotalValAppvInc() {
		return dcvlTotalValAppvInc;
	}

	public void setDcvlTotalValAppvInc(String dcvlTotalValAppvInc) {
		this.dcvlTotalValAppvInc = dcvlTotalValAppvInc;
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

	public String getQty() {
		return qty;
	}

	public void setQty(String qty) {
		this.qty = qty;
	}

	public String getHargaSatuan() {
		return hargaSatuan;
	}

	public void setHargaSatuan(String hargaSatuan) {
		this.hargaSatuan = hargaSatuan;
	}

	public String getNilaiTotal() {
		return nilaiTotal;
	}

	public void setNilaiTotal(String nilaiTotal) {
		this.nilaiTotal = nilaiTotal;
	}

	public String getNotes() {
		return notes;
	}

	public void setNotes(String notes) {
		this.notes = notes;
	}

//	public String getSpaceDtl() {
//		return spaceDtl;
//	}
//
//	public void setSpaceDtl(String spaceDtl) {
//		this.spaceDtl = spaceDtl;
//	}
//	
//	public String getSpacetcApp1() {
//		return spacetcApp1;
//	}
//
//	public void setSpacetcApp1(String spacetcApp1) {
//		this.spacetcApp1 = spacetcApp1;
//	}
//
//	public String getSpacetcApp2() {
//		return spacetcApp2;
//	}
//
//	public void setSpacetcApp2(String spacetcApp2) {
//		this.spacetcApp2 = spacetcApp2;
//	}

}
