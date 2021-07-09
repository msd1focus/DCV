package com.mycompany.myproject.persist.entity;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.NamedStoredProcedureQueries;
import javax.persistence.NamedStoredProcedureQuery;
import javax.persistence.ParameterMode;
import javax.persistence.StoredProcedureParameter;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.hibernate.annotations.GenericGenerator;

import com.mycompany.myproject.service.dto.PropCustMappingDto;

@Entity
@NamedStoredProcedureQueries({
	@NamedStoredProcedureQuery(
		name = "update_copied_dcv", procedureName = "dcv_pkg.update_copied_dcv", resultClasses = UiDcvRequest.class,
		parameters = {
				@StoredProcedureParameter(mode = ParameterMode.IN, name = "vdcvh_id", type = String.class),
				@StoredProcedureParameter(mode = ParameterMode.REF_CURSOR, name = "tdcv_request", type = Class.class)
		}
	),
	@NamedStoredProcedureQuery(
			name = "validate_pc", procedureName = "dcv_pkg.validate_pc",
			parameters = {
					@StoredProcedureParameter(mode = ParameterMode.IN, name = "nopc", type = String.class),
					@StoredProcedureParameter(mode = ParameterMode.IN, name = "keypc", type = String.class),
					@StoredProcedureParameter(mode = ParameterMode.IN, name = "pcust_code", type = String.class),
					@StoredProcedureParameter(mode = ParameterMode.OUT, name = "response", type = String.class),
					@StoredProcedureParameter(mode = ParameterMode.OUT, name = "message", type = String.class),
					@StoredProcedureParameter(mode = ParameterMode.REF_CURSOR, name = "tInformation_pc", type = Class.class)
			}
	),
	@NamedStoredProcedureQuery(
			name = "populate_pc_list", procedureName = "populate_pc_list",
			parameters = {
					@StoredProcedureParameter(mode = ParameterMode.IN, name = "username", type = String.class),
					@StoredProcedureParameter(mode = ParameterMode.IN, name = "periode", type = Integer.class),
					@StoredProcedureParameter(mode = ParameterMode.OUT, name = "contextId", type = String.class)
			}		
	),
	@NamedStoredProcedureQuery(
		name = "DCV_TASK_LIST", procedureName = "dcv_pkg.DCV_TASK_LIST",
		parameters = {
				@StoredProcedureParameter(mode = ParameterMode.IN, name = "pBagian", type = String.class),
				@StoredProcedureParameter(mode = ParameterMode.IN, name = "pUserName", type = String.class),
				@StoredProcedureParameter(mode = ParameterMode.IN, name = "pJenis", type = String.class),
				@StoredProcedureParameter(mode = ParameterMode.IN, name = "pPeriode1", type = Date.class),
				@StoredProcedureParameter(mode = ParameterMode.IN, name = "pPeriode2", type = Date.class),
				@StoredProcedureParameter(mode = ParameterMode.REF_CURSOR, name = "pList", type = Class.class)
		}
	),
	@NamedStoredProcedureQuery(
		name = "copy_dcv", procedureName = "dcv_pkg.copy_dcv", 
		parameters = {
				@StoredProcedureParameter(mode = ParameterMode.IN, name = "no_dcv", type = String.class),
				@StoredProcedureParameter(mode = ParameterMode.IN, name = "cust_code", type = String.class),
				@StoredProcedureParameter(mode = ParameterMode.OUT, name = "message", type = String.class),
				@StoredProcedureParameter(mode = ParameterMode.REF_CURSOR, name = "tCopy_DCV_DETAIL", type = Class.class)
		}
	),
	@NamedStoredProcedureQuery(
		name = "find_all_by_dcvid", procedureName = "dcv_pkg.find_all_by_dcvid",
		parameters = {
				@StoredProcedureParameter(mode = ParameterMode.IN, name = "vdcvhid", type = Long.class),
				@StoredProcedureParameter(mode = ParameterMode.REF_CURSOR, name = "tFind", type = Class.class)
		}
	),
	@NamedStoredProcedureQuery(
		name = "proposal_cust_mapping", procedureName = "dcv_pkg.proposal_cust_mapping",
		parameters = {
				@StoredProcedureParameter(mode = ParameterMode.IN, name = "pcust_code", type = String.class),
				@StoredProcedureParameter(mode = ParameterMode.REF_CURSOR, name = "tproposal_cust_mapping", type = Class.class)
		}
	),
	@NamedStoredProcedureQuery(
		name = "dcv_po_list", procedureName = "dcv_pkg.dcv_po_list",
		parameters = {
				@StoredProcedureParameter(mode = ParameterMode.IN, name = "pDcvLine", type = Integer.class),
				@StoredProcedureParameter(mode = ParameterMode.REF_CURSOR, name = "pList", type = Class.class)
		}
	),
	@NamedStoredProcedureQuery(
			name = "sync_dcv_value", procedureName = "dcv_pkg.sync_dcv_value",
			parameters = {
					@StoredProcedureParameter(mode = ParameterMode.IN, name = "pNoDcv", type = String.class),
					@StoredProcedureParameter(mode = ParameterMode.OUT, name = "vErrorMsg", type = String.class)
			}
		),
	@NamedStoredProcedureQuery(
			name = "wf_hist", procedureName = "rpt_pkg.wf_hist",
			parameters = {
					@StoredProcedureParameter(mode = ParameterMode.IN, name = "pbagian", type = String.class),
					@StoredProcedureParameter(mode = ParameterMode.IN, name = "pNoDcv", type = String.class),
					@StoredProcedureParameter(mode = ParameterMode.REF_CURSOR, name = "pList", type = Class.class)
			}
	),
	@NamedStoredProcedureQuery(
			name = "download_dcv", procedureName = "rpt_pkg.download_dcv",
			parameters = {
						@StoredProcedureParameter(mode = ParameterMode.IN, name = "pDistributor", type = String.class),
			            @StoredProcedureParameter(mode = ParameterMode.IN, name = "pFilterType", type = String.class),
			            @StoredProcedureParameter(mode = ParameterMode.IN, name = "pBagian", type = String.class),
			            @StoredProcedureParameter(mode = ParameterMode.IN, name = "pPeriodeSubmitStart", type = Date.class),
			            @StoredProcedureParameter(mode = ParameterMode.IN, name = "pPeriodeSubmitEnd", type = Date.class),
			            @StoredProcedureParameter(mode = ParameterMode.IN, name = "pNoDcv", type = String.class),
			            @StoredProcedureParameter(mode = ParameterMode.IN, name = "pPeriodeSubmit", type = String.class),
			            @StoredProcedureParameter(mode = ParameterMode.IN, name = "pCustCode", type = String.class),
			            @StoredProcedureParameter(mode = ParameterMode.IN, name = "pNamaCustomer", type = String.class), 
			            @StoredProcedureParameter(mode = ParameterMode.IN, name = "pRegion", type = String.class),
			            @StoredProcedureParameter(mode = ParameterMode.IN, name = "pArea", type = String.class),
			            @StoredProcedureParameter(mode = ParameterMode.IN, name = "pLocation", type = String.class),
			            @StoredProcedureParameter(mode = ParameterMode.IN, name = "pNoPc", type = String.class),
			            @StoredProcedureParameter(mode = ParameterMode.IN, name = "pPeriodePcStart", type = String.class),
			            @StoredProcedureParameter(mode = ParameterMode.IN, name = "pPeriodePcEnd", type = String.class), 
			            @StoredProcedureParameter(mode = ParameterMode.IN, name = "pKategoriPc", type = String.class),
			            @StoredProcedureParameter(mode = ParameterMode.IN, name = "pTipePc", type = String.class), 
			            @StoredProcedureParameter(mode = ParameterMode.IN, name = "pDcvValue" , type = String.class),
			            @StoredProcedureParameter(mode = ParameterMode.IN, name = "pDcvApprValue", type = String.class),
			            @StoredProcedureParameter(mode = ParameterMode.IN, name = "pDisposisi", type = String.class), 
			            @StoredProcedureParameter(mode = ParameterMode.IN, name = "pNoSeri", type = String.class),
			            @StoredProcedureParameter(mode = ParameterMode.IN, name = "pLastAction", type = String.class),
			            @StoredProcedureParameter(mode = ParameterMode.IN, name = "pCurrentAction", type = String.class),
			            @StoredProcedureParameter(mode = ParameterMode.IN, name = "pSortBy1", type = String.class),
			            @StoredProcedureParameter(mode = ParameterMode.IN, name = "pOrder1", type = String.class),
			            @StoredProcedureParameter(mode = ParameterMode.IN, name = "pSortBy2", type = String.class), 
			            @StoredProcedureParameter(mode = ParameterMode.IN, name = "pOrder2", type = String.class),
			            @StoredProcedureParameter(mode = ParameterMode.IN, name = "pSortBy3", type = String.class), 
			            @StoredProcedureParameter(mode = ParameterMode.IN, name = "pOrder3", type = String.class),
			            @StoredProcedureParameter(mode = ParameterMode.IN, name = "pSortBy4", type = String.class),
			            @StoredProcedureParameter(mode = ParameterMode.IN, name = "pOrder4", type = String.class),
			            @StoredProcedureParameter(mode = ParameterMode.IN, name = "pSortBy5", type = String.class),
			            @StoredProcedureParameter(mode = ParameterMode.IN, name = "pOrder5", type = String.class), 
			            @StoredProcedureParameter(mode = ParameterMode.IN, name = "pSortBy6", type = String.class),
			            @StoredProcedureParameter(mode = ParameterMode.IN, name = "pOrder6", type = String.class),
			            @StoredProcedureParameter(mode = ParameterMode.IN, name = "pSortBy7", type = String.class),
			            @StoredProcedureParameter(mode = ParameterMode.IN, name = "pOrder7", type = String.class),
			            @StoredProcedureParameter(mode = ParameterMode.IN, name = "pSortBy8", type = String.class),
			            @StoredProcedureParameter(mode = ParameterMode.IN, name = "pOrder8", type = String.class),
			            @StoredProcedureParameter(mode = ParameterMode.IN, name = "pSortBy9", type = String.class),
			            @StoredProcedureParameter(mode = ParameterMode.IN, name = "pOrder9", type = String.class),
			            @StoredProcedureParameter(mode = ParameterMode.IN, name = "pSortBy10", type = String.class),
			            @StoredProcedureParameter(mode = ParameterMode.IN, name = "pOrder10", type = String.class),
					@StoredProcedureParameter(mode = ParameterMode.REF_CURSOR, name = "pList", type = Class.class)
			}
	),
	@NamedStoredProcedureQuery(
			name = "terbilang", procedureName = "util_pkg.terbilang",
			parameters = {
					@StoredProcedureParameter(mode = ParameterMode.IN, name = "angka", type = BigDecimal.class),
					@StoredProcedureParameter(mode = ParameterMode.OUT, name = "dataOut", type = String.class)
			}
	),
	@NamedStoredProcedureQuery(
			name = "get_prod_details", procedureName = "dcv_pkg.get_prod_details", 
			parameters = {
					@StoredProcedureParameter(mode = ParameterMode.IN, name = "pId", type = Integer.class),
					@StoredProcedureParameter(mode = ParameterMode.REF_CURSOR, name = "pList", type = Class.class)
			}
		),
	@NamedStoredProcedureQuery(
			name = "get_uom_stm", procedureName = "dcv_pkg.get_uom_stm", 
			parameters = {
					@StoredProcedureParameter(mode = ParameterMode.IN, name = "ppid", type = Integer.class),
					@StoredProcedureParameter(mode = ParameterMode.REF_CURSOR, name = "pList", type = Class.class)
			}
		),
	@NamedStoredProcedureQuery(
			name = "show_action_list", procedureName = "wf_pkg.show_action_list", 
			parameters = {
					@StoredProcedureParameter(mode = ParameterMode.IN, name = "pDcvNo", type = String.class),
					@StoredProcedureParameter(mode = ParameterMode.IN, name = "pUser", type = String.class),
					@StoredProcedureParameter(mode = ParameterMode.IN, name = "pBagian", type = String.class),
					@StoredProcedureParameter(mode = ParameterMode.REF_CURSOR, name = "PLIST", type = Class.class)
			}
		),
	@NamedStoredProcedureQuery(
			name = "payment_summary", procedureName = "ebs_pkg.payment_summary", 
			parameters = {
					@StoredProcedureParameter(mode = ParameterMode.IN, name = "pDcvNo", type = String.class),
					@StoredProcedureParameter(mode = ParameterMode.REF_CURSOR, name = "pList", type = Class.class)
			}
		),
	@NamedStoredProcedureQuery(
			name = "payment_ebs_hist", procedureName = "ebs_pkg.payment_ebs_hist", 
			parameters = {
					@StoredProcedureParameter(mode = ParameterMode.IN, name = "pDcvNo", type = String.class),
					@StoredProcedureParameter(mode = ParameterMode.REF_CURSOR, name = "pList", type = Class.class)
			}
		),
	@NamedStoredProcedureQuery(
			name = "upload_dok_list", procedureName = "dcv_pkg.upload_dok_list", 
			parameters = {
					@StoredProcedureParameter(mode = ParameterMode.IN, name = "pTaskId", type = Integer.class),
					@StoredProcedureParameter(mode = ParameterMode.IN, name = "pBagian", type = String.class),
					@StoredProcedureParameter(mode = ParameterMode.REF_CURSOR, name = "pList", type = Class.class)
			}
		),
	@NamedStoredProcedureQuery(
			name = "po_list", procedureName = "ebs_pkg.po_list",
			parameters = {
					@StoredProcedureParameter(mode = ParameterMode.IN, name = "pNoDcv", type = String.class),
					@StoredProcedureParameter(mode = ParameterMode.IN, name = "ppId", type = Integer.class),
					@StoredProcedureParameter(mode = ParameterMode.REF_CURSOR, name = "pList", type = Class.class)	
			}		
			),
	@NamedStoredProcedureQuery(
			name = "cek_invoice", procedureName = "ebs_pkg.cek_invoice" ,
			parameters = {
					@StoredProcedureParameter(mode = ParameterMode.IN, name = "dcvNo", type = String.class),
					@StoredProcedureParameter(mode = ParameterMode.OUT, name = "invoiceNo", type = String.class),
					@StoredProcedureParameter(mode = ParameterMode.OUT, name = "invoiceDate", type = Date.class)
			}
			),
	@NamedStoredProcedureQuery(
			name = "generate_gr", procedureName = "ebs_pkg.generate_gr" ,
			parameters = {
					@StoredProcedureParameter(mode = ParameterMode.IN, name = "dcvNo", type = String.class),
					@StoredProcedureParameter(mode = ParameterMode.OUT, name = "grNo", type = String.class),
					@StoredProcedureParameter(mode = ParameterMode.OUT, name = "grStatus", type = String.class)
			}
			),
	@NamedStoredProcedureQuery(
			name = "dokpembayaran_list", procedureName = "ebs_pkg.dokpembayaran_list",
			parameters = {
					@StoredProcedureParameter(mode = ParameterMode.IN, name = "pDcvNo", type = String.class),
					@StoredProcedureParameter(mode = ParameterMode.REF_CURSOR, name = "pList", type = Class.class)	
			}		
			),
})
@Table(name = "DCV_REQUEST") 
public class UiDcvRequest {
	
	private static final long serialVersionUID = 1L;

	@Id
	@GenericGenerator(name = "DCV_SEQ", strategy = "increment")
	@GeneratedValue(generator = "DCV_SEQ")
	@Column(name = "DCVH_ID", nullable = false)
	private Long dcvhId;
	
	@Column(name="DCVH_NO_DCV")
	private String noDCV;
	
	@Column(name="DCVH_CUST_CODE")
	private String custCode;
	
	@Column(name="DCVH_CUST_NAME")
	private String custName;
	
	@Column(name="DCVH_COMPANY")
	private String company;
	
	@Column(name="DCVH_NO_PC")
	private String noPC;
	
	@Column(name="DCVH_KEY_PC")
	private String keyPC;
	
	@Column(name="DCVH_NO_PP")
	private String noPP;
	
	@Column(name="DCVH_NO_PP_ID")
	private Long noPPId;
	
//	@Column(name="DCVH_PERIODE_DCV_START")
//	private Date periodDCVFrom;
//	
//	@Column(name="DCVH_PERIODE_DCV_END")
//	private Date periodDCVTo;
	
	@Column(name="DCVH_PC_KATEGORI")
	private String kategoriPC;
	
	@Column(name="DCVH_PC_TIPE")
	private String tipePC;
	
	@Column(name="DCVH_PERIODE_PC_START")
	private Date periodPCFrom;
	
	@Column(name="DCVH_PERIODE_PC_END")
	private Date periodPCTo;
	
	@Column(name="DCVH_REGION")
	private String region;
	
	@Column(name="DCVH_AREA")
	private String area;
	
	@Column(name="DCVH_LOCATION")
	private String location;
	
	@Column(name="DCVH_SUBMIT_TIME")
	private Date submitTime;
	
	@Column(name="DCVH_SELISIH_HARI")
	private Integer selisihHari;
	
	@Column(name="DCVH_VALUE")
	private BigDecimal value;
	
	@Column(name="DCVH_APPV_VALUE")
	private BigDecimal appvValue;
	
	@Column(name="DCVH_KETR_KWITANSI")
	private String ketrKwitansi;
	
	@Column(name="DCVH_METODE_BAYAR")
	private String metodeBayar;
	
	@Column(name="DCVH_STATUS")
	private String status;
	
	@Column(name="DCVH_LAST_STEP")
	private String lasStep;
	
	@Column(name="DCVH_CURRENT_STEP")
	private String currentStep;
	
	@Column(name="MODIFIED_DT")
	private Date modifiedDt;
	
	@Column(name="MODIFIED_BY")
	private String ModifiedBy;
	
	@Column(name = "COPY_FROM")
	private String copyFrom;
	
	@Column(name = "DCVH_PROSES_BAYAR")
	private String prosesBayar;
	
	@Column(name = "DCVH_NOTE_BAYAR")
	private String noteBayar;
	
	@Column(name = "DCVH_BEBAN_SLA")
	private String bebanSla;
	
	@Transient
	@ManyToMany(fetch = FetchType.LAZY, mappedBy = "dcvhId")
	private List<DcvDokumen> dcvDokumenDetail = new ArrayList<DcvDokumen>();
	
	@Transient
	@ManyToMany(fetch = FetchType.LAZY, mappedBy = "dcvhId")
	private List<UiDcvRequestDetail> dcvRequestDetail = new ArrayList<UiDcvRequestDetail>();
	
	@Transient
	private BigDecimal totalAppvQty;
	
	@Transient
	private BigDecimal totalAppvValExcl;
	
	@Transient
	private BigDecimal totalSelisih;
	
	@Transient
	private BigDecimal grandTotalAppvValExcl;
	
	@Transient
	private BigDecimal totalPpnVal;
	
	@Transient
	private BigDecimal totalPphVal;
	
	@Transient
	private BigDecimal totalAppvNet;
	
	@Transient
	private String actionButton;

	public Long getDcvhId() {
		return dcvhId;
	}

	public void setDcvhId(Long dcvhId) {
		this.dcvhId = dcvhId;
	}

	public String getNoDCV() {
		return noDCV;
	}

	public void setNoDCV(String noDCV) {
		this.noDCV = noDCV;
	}

	public String getCustCode() {
		return custCode;
	}

	public void setCustCode(String custCode) {
		this.custCode = custCode;
	}

	public String getCustName() {
		return custName;
	}

	public void setCustName(String custName) {
		this.custName = custName;
	}

	public String getCompany() {
		return company;
	}

	public void setCompany(String company) {
		this.company = company;
	}

	public String getNoPC() {
		return noPC;
	}

	public void setNoPC(String noPC) {
		this.noPC = noPC;
	}

	public String getKeyPC() {
		return keyPC;
	}

	public void setKeyPC(String keyPC) {
		this.keyPC = keyPC;
	}

	public String getNoPP() {
		return noPP;
	}

	public void setNoPP(String noPP) {
		this.noPP = noPP;
	}

	public Long getNoPPId() {
		return noPPId;
	}

	public void setNoPPId(Long noPPId) {
		this.noPPId = noPPId;
	}

//	public Date getPeriodDCVFrom() {
//		return periodDCVFrom;
//	}
//
//	public void setPeriodDCVFrom(Date periodDCVFrom) {
//		this.periodDCVFrom = periodDCVFrom;
//	}
//
//	public Date getPeriodDCVTo() {
//		return periodDCVTo;
//	}
//
//	public void setPeriodDCVTo(Date periodDCVTo) {
//		this.periodDCVTo = periodDCVTo;
//	}

	public String getKategoriPC() {
		return kategoriPC;
	}

	public void setKategoriPC(String kategoriPC) {
		this.kategoriPC = kategoriPC;
	}

	public String getTipePC() {
		return tipePC;
	}

	public void setTipePC(String tipePC) {
		this.tipePC = tipePC;
	}

	public Date getPeriodPCFrom() {
		return periodPCFrom;
	}

	public void setPeriodPCFrom(Date periodPCFrom) {
		this.periodPCFrom = periodPCFrom;
	}

	public Date getPeriodPCTo() {
		return periodPCTo;
	}

	public void setPeriodPCTo(Date periodPCTo) {
		this.periodPCTo = periodPCTo;
	}

	public String getRegion() {
		return region;
	}

	public void setRegion(String region) {
		this.region = region;
	}

	public String getArea() {
		return area;
	}

	public void setArea(String area) {
		this.area = area;
	}

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}

	public Date getSubmitTime() {
		return submitTime;
	}

	public void setSubmitTime(Date submitTime) {
		this.submitTime = submitTime;
	}

	public Integer getSelisihHari() {
		return selisihHari;
	}

	public void setSelisihHari(Integer selisihHari) {
		this.selisihHari = selisihHari;
	}

	public BigDecimal getValue() {
		return value;
	}

	public void setValue(BigDecimal value) {
		this.value = value;
	}

	public BigDecimal getAppvValue() {
		return appvValue;
	}

	public void setAppvValue(BigDecimal appvValue) {
		this.appvValue = appvValue;
	}

	public String getKetrKwitansi() {
		return ketrKwitansi;
	}

	public void setKetrKwitansi(String ketrKwitansi) {
		this.ketrKwitansi = ketrKwitansi;
	}

	public String getMetodeBayar() {
		return metodeBayar;
	}

	public void setMetodeBayar(String metodeBayar) {
		this.metodeBayar = metodeBayar;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getLasStep() {
		return lasStep;
	}

	public void setLasStep(String lasStep) {
		this.lasStep = lasStep;
	}

	public String getCurrentStep() {
		return currentStep;
	}

	public void setCurrentStep(String currentStep) {
		this.currentStep = currentStep;
	}

	public Date getModifiedDt() {
		return modifiedDt;
	}

	public void setModifiedDt(Date modifiedDt) {
		this.modifiedDt = modifiedDt;
	}

	public String getModifiedBy() {
		return ModifiedBy;
	}

	public void setModifiedBy(String modifiedBy) {
		ModifiedBy = modifiedBy;
	}

	public String getCopyFrom() {
		return copyFrom;
	}

	public void setCopyFrom(String copyFrom) {
		this.copyFrom = copyFrom;
	}

	public String getProsesBayar() {
		return prosesBayar;
	}

	public void setProsesBayar(String prosesBayar) {
		this.prosesBayar = prosesBayar;
	}

	public String getNoteBayar() {
		return noteBayar;
	}

	public void setNoteBayar(String noteBayar) {
		this.noteBayar = noteBayar;
	}

	public List<DcvDokumen> getDcvDokumenDetail() {
		return dcvDokumenDetail;
	}

	public void setDcvDokumenDetail(List<DcvDokumen> dcvDokumenDetail) {
		this.dcvDokumenDetail = dcvDokumenDetail;
	}

	public List<UiDcvRequestDetail> getDcvRequestDetail() {
		return dcvRequestDetail;
	}

	public void setDcvRequestDetail(List<UiDcvRequestDetail> dcvRequestDetail) {
		this.dcvRequestDetail = dcvRequestDetail;
	}

	public BigDecimal getTotalAppvQty() {
		return totalAppvQty;
	}

	public void setTotalAppvQty(BigDecimal totalAppvQty) {
		this.totalAppvQty = totalAppvQty;
	}

	public BigDecimal getTotalAppvValExcl() {
		return totalAppvValExcl;
	}

	public void setTotalAppvValExcl(BigDecimal totalAppvValExcl) {
		this.totalAppvValExcl = totalAppvValExcl;
	}

	public BigDecimal getTotalSelisih() {
		return totalSelisih;
	}

	public void setTotalSelisih(BigDecimal totalSelisih) {
		this.totalSelisih = totalSelisih;
	}

	public BigDecimal getGrandTotalAppvValExcl() {
		return grandTotalAppvValExcl;
	}

	public void setGrandTotalAppvValExcl(BigDecimal grandTotalAppvValExcl) {
		this.grandTotalAppvValExcl = grandTotalAppvValExcl;
	}

	public BigDecimal getTotalPpnVal() {
		return totalPpnVal;
	}

	public void setTotalPpnVal(BigDecimal totalPpnVal) {
		this.totalPpnVal = totalPpnVal;
	}

	public BigDecimal getTotalPphVal() {
		return totalPphVal;
	}

	public void setTotalPphVal(BigDecimal totalPphVal) {
		this.totalPphVal = totalPphVal;
	}

	public BigDecimal getTotalAppvNet() {
		return totalAppvNet;
	}

	public void setTotalAppvNet(BigDecimal totalAppvNet) {
		this.totalAppvNet = totalAppvNet;
	}

	public String getActionButton() {
		return actionButton;
	}

	public void setActionButton(String actionButton) {
		this.actionButton = actionButton;
	}

	public String getBebanSla() {
		return bebanSla;
	}

	public void setBebanSla(String bebanSla) {
		this.bebanSla = bebanSla;
	}
	
	
}
