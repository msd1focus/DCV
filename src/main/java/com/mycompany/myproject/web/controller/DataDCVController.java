package com.mycompany.myproject.web.controller;

import java.io.IOException;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;


import com.mycompany.myproject.persist.entity.DcvDokumen;
import com.mycompany.myproject.persist.entity.DetailDCV;
import com.mycompany.myproject.persist.entity.ExportExcel;
import com.mycompany.myproject.persist.entity.InformationPC;
import com.mycompany.myproject.persist.entity.MasterCustomer;
import com.mycompany.myproject.persist.entity.NewDCVDetail;
import com.mycompany.myproject.persist.entity.PPHList;
import com.mycompany.myproject.persist.entity.TcApproval;
import com.mycompany.myproject.persist.entity.UiDcvRequest;
import com.mycompany.myproject.persist.entity.UiDcvRequestDetail;
import com.mycompany.myproject.persist.repo.DetailDCVRepo;
import com.mycompany.myproject.persist.repo.NewDCVDetailRepo;
import com.mycompany.myproject.privs.Privs;
import com.mycompany.myproject.privs.PrivsRepo;
import com.mycompany.myproject.role.Role;
import com.mycompany.myproject.roletps.RoleTPS;
import com.mycompany.myproject.roletps.RoleTPSRepo;
import com.mycompany.myproject.service.DataDCVServices;
import com.mycompany.myproject.service.dto.ActionListDto;
import com.mycompany.myproject.service.dto.DcvListDto;
import com.mycompany.myproject.service.dto.DocumentBatchDto;
import com.mycompany.myproject.service.dto.InformationPCDto;
import com.mycompany.myproject.service.dto.NewDcvDetailDto;
import com.mycompany.myproject.service.dto.POListDto;
import com.mycompany.myproject.service.dto.PaymentEbsHistDto;
import com.mycompany.myproject.service.dto.ProsesPODto;
import com.mycompany.myproject.service.dto.UomListDto;
import com.mycompany.myproject.service.dto.UploadDocListDto;
import com.mycompany.myproject.service.dto.WorkFlowDto;
import com.mycompany.myproject.wfnode.WFNode;
import com.mycompany.myproject.wfroute.WFRoute;
import com.mycompany.myproject.wfroute.WFRouteRepo;
import com.mycompany.myproject.wftask.WFTask;
import com.mycompany.myproject.wftask.WFTaskRepo;

import io.swagger.annotations.Api;

@RestController
@Api(description = "DCV Management API")
public class DataDCVController {
	
	private static final Logger logger = LoggerFactory.getLogger(DataDCVController.class);
	
	@Autowired
	private DetailDCVRepo detailDCVRepo;
	@Autowired
	private PrivsRepo privsRepo;
	@Autowired
	private RoleTPSRepo roleTPSRepo; 
	@Autowired
	private NewDCVDetailRepo newDCVDetailRepo;
	@Autowired
	private DataDCVServices dataDCVServices;
	@Autowired
	private WFRouteRepo wFRouteRepo;
	@Autowired
	private WFTaskRepo wFTaskRepo;
//	@Autowired
//	private ProdUOMRepo prodUOMRepo;
	
	
	
	
	/*Service 
	 * tanggal Server*/
	@RequestMapping(value = "/serverDate", method = RequestMethod.GET)
	public @ResponseBody List<Timestamp> serverDate() {
		List<Timestamp> allTimeServer = new ArrayList<Timestamp>();
		
		Timestamp timestampFirst = new Timestamp(new Date().getTime());
	    Calendar cal = Calendar.getInstance();
		cal.setTimeInMillis(timestampFirst.getTime());
	    cal.add(Calendar.MONTH, -3);
	    timestampFirst = new Timestamp(cal.getTime().getTime());
	    allTimeServer.add(timestampFirst);
	    
	    Timestamp timestampLate = new Timestamp(System.currentTimeMillis());
	    allTimeServer.add(timestampLate);
	    
		return allTimeServer;
	}

	
	/*Service 
	 * Find Like for Action Privs DCV*/
//	@RequestMapping(value = "/privs", method = RequestMethod.POST)
//	public @ResponseBody List<Privs> getActionLike(@RequestBody String privName) {
//		return privsRepo.findByPrivNameStartsWith(privName);
//	}
	
	/*Service 
	 * Find Satuan for Input Detail DCV*/
//	@RequestMapping(value = "/getSatuan", method = RequestMethod.POST)
//	public @ResponseBody List<String> getSatuan() {
//		return prodUOMRepo.findProdUOMDistinct();
//	}
	
	
	/*Service 
	 * Find In for Action Privs DCV*/
//	@RequestMapping(value = "/privsForTerimaDok", method = RequestMethod.POST)
//	public @ResponseBody List<Privs> getActionIn(@RequestBody List<String> privNames) {
//		return dataDCVServices.getPrivDataForTerimaDok(privNames);
//	}

	/*Service 
	 * Find Prop_cust_mapping for no.PC new DCV*/
	@RequestMapping(value = "/findNoPCByCustCode", method = RequestMethod.POST)
	public @ResponseBody List<String> findNoPCByCustCode(@RequestBody String custCode) {
		return dataDCVServices.findNoPCByCustCode(custCode);
	}
	
	/*Service 
	 * Find Information PC for Term & Condition new DCV*/
	@RequestMapping(value = "/findInformationPCByNoPC", method = RequestMethod.POST)
	public @ResponseBody InformationPCDto findInformationPCByNoPC(@RequestBody InformationPC infoPC) {
		logger.info("KEY PC : "+infoPC.getKeyPC());
		logger.info("NO PC : "+infoPC.getNoPC());
		logger.info("START DATE : "+infoPC.getPeriodDCVFrom());
		logger.info("END DATE : "+infoPC.getPeriodDCVTo());
		logger.info("CUST CODE : "+infoPC.getCustCode());
		return dataDCVServices.validatePC(infoPC.getNoPC(), infoPC.getKeyPC(), infoPC.getPeriodDCVFrom(), infoPC.getPeriodDCVTo(), infoPC.getCustCode());
	}
	
	/*Service 
	 * Find Detail for List input new DCV*/
	@RequestMapping(value = "/findDetailForNewDCV", method = RequestMethod.POST)
	public @ResponseBody List<NewDCVDetail> findDetailForNewDCV(@RequestBody Integer propId) {
		List<NewDCVDetail> data = new ArrayList<NewDCVDetail>();
		data = newDCVDetailRepo.findByPropId(propId);
		System.out.println(data);
		return data;
		
	}
	
	@RequestMapping(value = "/findDetailForNewDCVSP", method = RequestMethod.POST)
	public @ResponseBody List<NewDcvDetailDto> findDetailForNewDCVSP(@RequestBody Integer propId) throws SQLException, IOException {
		List<NewDcvDetailDto> data = new ArrayList<NewDcvDetailDto>();
		data = dataDCVServices.findDetailForNewDCVSP(propId);
		
		return data;
		
	}
	
	/*Service 
	 * save input new DCV*/
	@RequestMapping(value = "/saveNewDCV", method = RequestMethod.POST)
	public @ResponseBody String saveNewDCV(@RequestBody UiDcvRequest data) {
		return dataDCVServices.simpanDCV(data);
	}
	
	/*Service 
	 * update to DCV Request for Sales Action*/
	@RequestMapping(value = "/updateDCVForSales", method = RequestMethod.POST)
	public @ResponseBody String updateDCVForSales(@RequestBody DcvListDto data) {
		return dataDCVServices.updateDCVForSales(data);
	}
	
	/*Service 
	 * get All DCV List for Monitoring*/
	@RequestMapping(value = "/getAllDCV", method = RequestMethod.POST)
	public @ResponseBody List<UiDcvRequest> getAllDCV() {
		return dataDCVServices.findAllDcv();
	}
	
	@RequestMapping(value = "/getTcApprovalById", method = RequestMethod.POST)
	public @ResponseBody List<TcApproval> getTcApprovalById(@RequestBody Long dcvlId) {
		return dataDCVServices.getTcApprovalById(dcvlId);
	}
	
	/*Service 
	 * get DCV List by Cust Code for Monitoring*/
	@RequestMapping(value = "/getAllDCVByCustCode", method = RequestMethod.POST)
	public @ResponseBody List<UiDcvRequest> getAllDCVByCustCode(@RequestBody String custCode) {
		return dataDCVServices.findDcvByCustCode(custCode);
	}
	
	/*Service 
	 * get DCV List by DCV No for Monitoring*/
	@RequestMapping(value = "/getAllDCVByNoPc", method = RequestMethod.POST)
	public @ResponseBody List<UiDcvRequest> getAllDCVByNoPc(@RequestBody String noPc) {
		return dataDCVServices.findDcvByNoPC(noPc);
	}
	
	/*Service 
	 * get DCV List by DCV No for Copy DCV Menu*/
	@RequestMapping(value = "/getAllCopyDCVByNoDCV", method = RequestMethod.POST)
	public @ResponseBody Map<String, Object> getAllCopyDCVByNoDCV(@RequestBody UiDcvRequest dcvReq) {
		return dataDCVServices.findCopyDcvDetailByNoDcv(dcvReq.getNoDCV(), dcvReq.getCustCode());
	}
	
	@RequestMapping(value = "/searchDocHistoryBySp", method = RequestMethod.POST) 
	public @ResponseBody List<DocumentBatchDto> searchDocHistoryBySp(@RequestBody Map<String, Object> param) {
		return dataDCVServices.searchDocHistoryBySp(param);
	}
	
	/*Service 
	 * get DCV List for Monitoring*/
	@RequestMapping(value = "/getDcvList", method = RequestMethod.POST)
	public @ResponseBody List<DcvListDto> getDcvList(@RequestBody Map<String, Object> param) {
		return dataDCVServices.findDcvListByParam(param);
	}
	
	@RequestMapping(value = "/getPOListByDcvId", method = RequestMethod.POST)
	public @ResponseBody Map<String, Object> getPOListByDcvId(@RequestBody Map<String, Object> param){
		return dataDCVServices.getPOListByDcvId(param);
	}
	
	@RequestMapping(value = "/getPoListById", method = RequestMethod.POST)
	public @ResponseBody List<ProsesPODto> getPoListById(@RequestBody Map<String, Object> param){
		return dataDCVServices.getPoListByid(param);
	}
	
	/*Service 
	 * get DCV Body List for View Detail DCV Monitoring*/
//	@RequestMapping(value = "/getDcvBodyListForViewDetail", method = RequestMethod.POST)
//	public @ResponseBody Map<String, Object> getDcvBodyListForViewDetail(@RequestBody String noDcv) {
//		return dataDCVServices.getBodyFromDcvReq(noDcv);
//	}
	@RequestMapping(value = "/getDcvBodyListForViewDetail", method = RequestMethod.POST)
	public @ResponseBody Map<String, Object> getDcvBodyListForViewDetail(@RequestBody Map<String, Object> param) {
		return dataDCVServices.getBodyFromDcvReq(param);
	}
	
	/*Service 
	 * get DCV Body List for View Work Flow DCV Monitoring*/
	@RequestMapping(value = "/getDcvBodyListForViewWorflow", method = RequestMethod.POST)
	public @ResponseBody Map<String, Object> getDcvBodyListForViewWorflow(@RequestBody String noDcv) {
		return dataDCVServices.findWfByNoDcv(noDcv);
	}
	
	/*Service
	 * Save add doc file for Action Distributor*/
	@RequestMapping(value = "/savingDcvDoc", method = RequestMethod.POST)
	public @ResponseBody DcvDokumen savingDcvDoc(@RequestBody DcvDokumen dcvDoc) {
		return dataDCVServices.saveDcvDoc(dcvDoc);
	}
	
	/*Service
	 * Save or Update DCV Request(Header) for Action*/
	@RequestMapping(value = "/savingDcvReq", method = RequestMethod.POST)
	public @ResponseBody UiDcvRequest savingDcvReq(@RequestBody UiDcvRequest dcvReq) {
		UiDcvRequest hasil = new UiDcvRequest();
		if(dcvReq.getActionButton().equalsIgnoreCase("tc")) {
			hasil = dataDCVServices.savingDcvReqForTC(dcvReq);
		}
		return hasil;
	}
	
//	@RequestMapping(value = "/savingDcvAdjustment", method = RequestMethod.POST)
//	public @ResponseBody DcvAdjustment savingDcvAdjustment(@RequestBody List<LinkedHashMap<String, Object>> param) {
//		return dataDCVServices.savingDcvAdjustForTC(param);
//		 
//	}
	
//	@RequestMapping(value = "/deleteDcvAdjustment", method = RequestMethod.POST)
//	public @ResponseBody DcvAdjustment deleteDcvAdjustment(@RequestBody Map<String, Object> param) {
//		return dataDCVServices.deleteDcvAdjustForTC(param);
//		 
//	}
//	
	
	
	/*Service
	 * Save or Update DCV Request Detail for TCApproval*/
	@RequestMapping(value = "/savingDcvReqDtlForTcAppv", method = RequestMethod.POST)
	public @ResponseBody UiDcvRequestDetail savingDcvReqDtlForTcAppv(@RequestBody List<LinkedHashMap<String, Object>> param) {
		return dataDCVServices.savingDcvReqDtlForTcAppv(param);
	}
	
	@RequestMapping(value = "/updateCatatanPPH", method = RequestMethod.POST)
	public @ResponseBody UiDcvRequestDetail updateCatatanPPH(@RequestBody Map<String, Object> param) {
		return dataDCVServices.updateCatatanPPH(param);
	}
	
	/*Service
	 * get PO Line by DCV Line for TC Approval View*/
	@RequestMapping(value = "/findPOLineByDcvLine", method = RequestMethod.POST)
	public @ResponseBody Map<String, Object> findPOLineByDcvLine(@RequestBody Integer dcvLine) {
		return dataDCVServices.findPOLineByDcvLine(dcvLine);
	}
	
	
	/*Service
	 * Export to Excel for Global param*/
	@SuppressWarnings("unchecked")
	@RequestMapping(value = "/exportToExcel", method = RequestMethod.POST)
	public @ResponseBody List<String> exportToExcel(@RequestBody Map<String, Object> postData) throws Exception {
		List<String> listPesan = new ArrayList<String>();
		String pesan = "Tidak berhasil export data, silahkan ulangi lagi beberapa waktu";
		
		try {
			List<Map<String, String>> bodyData = (List<Map<String, String>>) postData.get("bodyData");
			List<String> headerData = (List<String>) postData.get("headerData");
			dataDCVServices.exportToExcel(bodyData, headerData, (String) postData.get("namaWorkbook"));
			pesan = "File "+postData.get("namaWorkbook")+" ada di folder Downloads";
		} catch (Exception e) {
            logger.error("write excel fail ",e);
        }
        
		listPesan.add(pesan);
        return listPesan;
	}
	
	@RequestMapping(value = "/generateInvoice", method = RequestMethod.POST)
	public @ResponseBody Map<String, Object> generateInvoice(@RequestBody Map<String, Object> param) {
		return dataDCVServices.generateInvoice(param);
	}
	
	@RequestMapping(value = "/generateGr", method = RequestMethod.POST)
	public @ResponseBody Map<String, Object> generateGr(@RequestBody Map<String, Object> param) {
		return dataDCVServices.generateGr(param);
	}

	@RequestMapping(value = "/getDocumentBatchList", method = RequestMethod.POST)
	public @ResponseBody List<DocumentBatchDto> getDocumentBatchList(@RequestBody Map<String, Object> param) {
		return dataDCVServices.findDocumentBatchList(param);
	}
	
	@RequestMapping(value = "/saveDocumentBacth", method = RequestMethod.POST)
	public @ResponseBody Map<String, Object> saveDocumentBacth(@RequestBody List<LinkedHashMap<String, Object>> param) {
		return dataDCVServices.saveDocumentBacth(param);
	}
	
//	@RequestMapping(value = "/getPoListById2", method = RequestMethod.POST)
//	public @ResponseBody List<ProsesPODto> getPoListById2(@RequestBody List<LinkedHashMap<String, Object>> param){
//		return dataDCVServices.getPoListByid2(param);
//	}
	
//	@RequestMapping(value = "/getDisposisiData", method = RequestMethod.POST)
//	public @ResponseBody List<Disposisi> getDisposisiData(@RequestBody Map<String, Object> param) {
//		return dataDCVServices.getDisposisiData(param);
//	}
	
	@RequestMapping(value = "/getDcvBodyListForViewWorflow2", method = RequestMethod.POST)
	public @ResponseBody Map<String, Object> getDcvBodyListForViewWorflow2(@RequestBody Map<String, Object> param) {
		return dataDCVServices.getListViewWorflow(param);
	}
	
	@RequestMapping(value = "/downloadExportExcel", method = RequestMethod.POST)
	public @ResponseBody Map<String, Object> downloadExportExcel(@RequestBody ExportExcel exportExcel) {
		return dataDCVServices.downloadExportExcel(exportExcel);
	}
	
	@RequestMapping(value = "/getUrlLinkExternal", method = RequestMethod.POST)
	public @ResponseBody Map<String, Object> getUrlLinkExternal(@RequestBody Map<String, Object> param) {
		return dataDCVServices.getUrlLinkExternal(param);
	}
	
	@RequestMapping(value = "/getUrlLinkExternalKwitansi", method = RequestMethod.POST)
	public @ResponseBody Map<String, Object> getUrlLinkExternalKwitansi(@RequestBody Map<String, Object> param) {
		return dataDCVServices.getUrlLinkExternalKwitansi(param);
	}
	
	@RequestMapping(value = "/getDataKwitansi", method = RequestMethod.POST)
	public @ResponseBody Map<String, Object> getDataKwitansi(@RequestBody Map<String, Object> param) {
		return dataDCVServices.getDataKwitansi(param);
	}
	
	@RequestMapping(value = "/getAllPPHList", method = RequestMethod.POST)
	public @ResponseBody List<PPHList> getAllPPHList() {
		return dataDCVServices.PPHList();
	}
	
	@RequestMapping(value = "/getDownloadData", method = RequestMethod.POST)
	public @ResponseBody Map<String, Object> getDownloadData(@RequestBody Map<String, Object> param) throws IOException {
		return dataDCVServices.getDownloadData(param);
	}
	
	@RequestMapping(value = "/getPoListByIdEx", method = RequestMethod.POST)
	public @ResponseBody List<ProsesPODto> getPoListByIdEx(@RequestBody List<LinkedHashMap<String, Object>> param){
		return dataDCVServices.getPoListByidEx(param);
	}

	@RequestMapping(value = "/getUomByPpId", method = RequestMethod.POST)
	public @ResponseBody List<String> getUomByPpId(@RequestBody Map<String, Object> param){
		return dataDCVServices.getUomByPpId(param);
	}
	
	@RequestMapping(value = "/getPaymentSummary", method = RequestMethod.POST)
	public @ResponseBody Map<String, Object> getPaymentSummary(@RequestBody String noDcv) {
		return dataDCVServices.getPaymentSummary(noDcv);
	}
	
	@RequestMapping(value = "/getUrlLinkReportSla", method = RequestMethod.POST)
	public @ResponseBody Map<String, Object> getUrlLinkReportSla(@RequestBody Map<String, Object> param) {
		return dataDCVServices.getUrlLinkReportSla(param);
	}
	
	@RequestMapping(value = "/getRegion", method = RequestMethod.POST)
	public @ResponseBody Map<String, Object> getRegion(){
		return dataDCVServices.DataRegionSla();
	}
	
	@RequestMapping(value = "/getArea", method = RequestMethod.POST)
	public @ResponseBody Map<String, Object> getArea(@RequestBody String regionFullName){
		return dataDCVServices.DataAreaSla(regionFullName);
	}
	
	@RequestMapping(value = "/getLocation", method = RequestMethod.POST)
	public @ResponseBody Map<String, Object> getLocation(@RequestBody Map<String, Object> param){
		return dataDCVServices.DataLocationSla(param);
	}
	
	@RequestMapping(value = "/getDistributorSla", method = RequestMethod.POST)
	public @ResponseBody Map<String, Object> getDistributorSla(){
		return dataDCVServices.DataDistributorSla();
	}
	
	@RequestMapping(value = "/getPaymentEbsHist", method = RequestMethod.POST)
	public @ResponseBody List<PaymentEbsHistDto> getPaymentEbsHist(@RequestBody String noDcv) {
		return dataDCVServices.getPaymentEbsHist(noDcv);
	}
	
	/* get DCV List for Monitoring after action*/
	@RequestMapping(value = "/getDcvListAfterAction", method = RequestMethod.POST)
	public @ResponseBody List<DcvListDto> getDcvListAfterAction(@RequestBody Map<String, Object> param) {
		return dataDCVServices.findDcvListByParamAfterAction(param);
	}
	
	// Get Header and Body list after action
	@RequestMapping(value = "/getHeaderBodyListAfterAction", method = RequestMethod.POST)
	public @ResponseBody Map<String, Object> getHeaderBodyListAfterAction(@RequestBody Map<String, Object> param) {
		return dataDCVServices.getHeaderBodyListAfterAction(param);
	}

	
	@RequestMapping(value = "/getUploadDocList", method = RequestMethod.POST)
	public @ResponseBody Map<String, Object> getUploadDocList(@RequestBody Map<String, Object> param) {
		return dataDCVServices.findUploadDocList(param);
	}
	
	@RequestMapping(value = "/getDcvDocList", method = RequestMethod.POST)
	public @ResponseBody List<DcvDokumen> getDcvDocList(@RequestBody Map<String, Object> param) {
		return dataDCVServices.getDcvDocList(param);
	}
	
}
