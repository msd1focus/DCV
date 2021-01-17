package com.mycompany.myproject.service;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.sql.SQLException;
import java.text.DateFormat;
import java.text.DecimalFormat;
import java.text.DecimalFormatSymbols;
import java.text.NumberFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collector;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.StoredProcedureQuery;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;
import org.springframework.util.WeakReferenceMonitor.ReleaseListener;
import org.springframework.web.bind.annotation.RequestBody;

import com.mycompany.myproject.persist.entity.ActionList;
import com.mycompany.myproject.persist.entity.AllUsers;
import com.mycompany.myproject.persist.entity.DcvDokumen;
import com.mycompany.myproject.persist.entity.DocumentAction;
import com.mycompany.myproject.persist.entity.DokumenRealisasi;
import com.mycompany.myproject.persist.entity.ExportExcel;
import com.mycompany.myproject.persist.entity.Holiday;
import com.mycompany.myproject.persist.entity.LookupCode;
import com.mycompany.myproject.persist.entity.MasterCustomer;
import com.mycompany.myproject.persist.entity.Menu;
import com.mycompany.myproject.persist.entity.PPHList;
import com.mycompany.myproject.persist.entity.Privs;
import com.mycompany.myproject.persist.entity.Role;
import com.mycompany.myproject.persist.entity.RoleMenu;
import com.mycompany.myproject.persist.entity.RolePrivs;
import com.mycompany.myproject.persist.entity.TcApproval;
import com.mycompany.myproject.persist.entity.UiDcvRequest;
import com.mycompany.myproject.persist.entity.UiDcvRequestDetail;
import com.mycompany.myproject.persist.entity.WFNode;
import com.mycompany.myproject.persist.entity.WFRoute;
import com.mycompany.myproject.persist.entity.WFTask;
import com.mycompany.myproject.persist.repo.ActionListRepo;
import com.mycompany.myproject.persist.repo.AllUsersRepo;
import com.mycompany.myproject.persist.repo.DcvDokumenRepo;
import com.mycompany.myproject.persist.repo.DocumentActionRepo;
import com.mycompany.myproject.persist.repo.DokumenRealisasiRepo;
import com.mycompany.myproject.persist.repo.HolidayRepo;
import com.mycompany.myproject.persist.repo.LookupCodeRepo;
import com.mycompany.myproject.persist.repo.MasterCustomerRepo;
import com.mycompany.myproject.persist.repo.MenuRepo;
import com.mycompany.myproject.persist.repo.PPHListRepo;
import com.mycompany.myproject.persist.repo.PrivsRepo;
import com.mycompany.myproject.persist.repo.RoleMenuRepo;
import com.mycompany.myproject.persist.repo.RolePrivsRepo;
import com.mycompany.myproject.persist.repo.RoleRepo;
import com.mycompany.myproject.persist.repo.TcApprovalRepo;
import com.mycompany.myproject.persist.repo.TermRepo;
import com.mycompany.myproject.persist.repo.UiDcvRequestDetailRepo;
import com.mycompany.myproject.persist.repo.UiDcvRequestRepo;
import com.mycompany.myproject.persist.repo.WFNodeRepo;
import com.mycompany.myproject.persist.repo.WFRouteRepo;
import com.mycompany.myproject.persist.repo.WFTaskRepo;
import com.mycompany.myproject.service.dto.ActionListDto;
import com.mycompany.myproject.service.dto.CopyDcvDto;
import com.mycompany.myproject.service.dto.DcvListDto;
import com.mycompany.myproject.service.dto.DocumentBatchDto;
import com.mycompany.myproject.service.dto.ExportExcelDto;
import com.mycompany.myproject.service.dto.InformationPCDto;
import com.mycompany.myproject.service.dto.NewDcvDetailDto;
import com.mycompany.myproject.service.dto.POListDto;
import com.mycompany.myproject.service.dto.PaymentEbsHistDto;
import com.mycompany.myproject.service.dto.PaymentSummaryDto;
import com.mycompany.myproject.service.dto.PropCustMappingDto;
import com.mycompany.myproject.service.dto.ProsesPODto;
import com.mycompany.myproject.service.dto.UomListDto;
import com.mycompany.myproject.service.dto.UploadDocListDto;
import com.mycompany.myproject.service.dto.WorkFlowDto;

@Service
public class DataDCVServices {
	
	private static final Logger logger = LoggerFactory.getLogger(DataDCVServices.class);
	private static String[] HARI = {"Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"};
	private SimpleDateFormat tanggal = new SimpleDateFormat("dd-MMM-yy");
	private SimpleDateFormat waktu = new SimpleDateFormat("HH:mm:ss");
	private SimpleDateFormat jam = new SimpleDateFormat("HH");
	private SimpleDateFormat menit = new SimpleDateFormat("mm");
	private SimpleDateFormat detik = new SimpleDateFormat("ss");
	private String distCode = "DISTRIBUTOR";
	
	@PersistenceContext
	private EntityManager em;
	
	@Autowired
	private MenuRepo menuRepo;
	@Autowired
	private PrivsRepo privsRepo;
	@Autowired
	private AllUsersRepo allUsersRepo;
	@Autowired
	private RoleRepo roleRepo;
	@Autowired
//	private UserAccessDCVRepo userAccessDCVRepo;
//	@Autowired
	private UiDcvRequestRepo uiDcvRequestRepo;
	@Autowired
	private UiDcvRequestDetailRepo uiDcvRequestDetailRepo;
	@Autowired
	private DcvDokumenRepo dcvDokumenRepo;
	@Autowired
	private TermRepo termRepo;
	@Autowired
	private WFNodeRepo wFNodeRepo;
	@Autowired
	private WFTaskRepo wfTaskRepo;
	@Autowired
	private WFRouteRepo wfRouteRepo;
	@Autowired
	private ActionListRepo actionListRepo;
	@Autowired
	private LookupCodeRepo lookupCodeRepo;
//	@Autowired 
//	private DcvAdjustmentRepo dcvAdjustmentRepo;
	@Autowired
	private TcApprovalRepo tcApprovalRepo;
	@Autowired
	private DocumentActionRepo documentActionRepo;
//	@Autowired
//	private DisposisiRepo disposisiRepo;
	@Autowired
	private PPHListRepo pphListRepo;
	@Autowired
	private DokumenRealisasiRepo dokumenRealisasiRepo;
	@Autowired
	private RoleMenuRepo roleMenuRepo;
	@Autowired
	private RolePrivsRepo rolePrivsRepo;
	@Autowired
	private MasterCustomerRepo masterCustomerRepo;
	@Autowired
	private HolidayRepo holidayRepo;
	
	
	public Map<String, Object> setForUserLogin(String userName, String password) {
		Map<String, Object> hasil = new HashMap<String, Object>();
		List<AllUsers> userExisting = new ArrayList<AllUsers>();
		AllUsers userProfile = new AllUsers();
		
		if(userName != null && password != null) {
			if(!userName.equals("") && !password.equals("")) {
				
				userExisting = allUsersRepo.findByUserNameAndPassword(userName, password);
				if(userExisting.size() == 0) {
					
					List<AllUsers> woUsers = allUsersRepo.findByUserNameAndUserType(userName, "Distributor");
					if(woUsers.size() > 0) {
						
						for(AllUsers user: woUsers) {
							
							String hashPass = BCrypt.hashpw(password, user.getPassword());
							userExisting = allUsersRepo.findByUserNameAndPasswordAndUserType(userName, hashPass, "Distributor");
							if(userExisting.size() > 0 ) {
								
//								userExisting.get(0).setRole(roleRepo.findByRoleCode(userExisting.get(0).getUserRole().toString()));
								userProfile = this.userTree(userExisting.get(0));
								hasil.put("userProfile", userProfile);
								break;
							}
						}
					}
				} else {
					userExisting.get(0).setRole(roleRepo.findByRoleCode(userExisting.get(0).getUserRole().toString()));
					userProfile = this.userTree(userExisting.get(0));
			        hasil.put("userProfile", userProfile);
				}
			}
		}
		
		return hasil;
	}
	
	public Role signToUserRole (String userRole, String userType) {
		//MenuList Colect
		List<String> menus = new ArrayList<String>();
		List<Menu> allMenuList = new ArrayList<Menu>();
		List<Menu> menuList = new ArrayList<Menu>();
		List<Integer> menuIdList = new ArrayList<Integer>();
		Role role = new Role();
		
		// Find menuId in RoleMenu
		List<RoleMenu> roleMenu = roleMenuRepo.findByRoleCode(userRole);
		for(RoleMenu rolMenu: roleMenu) {
			
			// Find data in Menu
			List<Menu> men = menuRepo.findByMenuId(rolMenu.getMenuId());
			for(Menu mn : men) {
				
				allMenuList.add(mn);
				Menu menuOnTop = menuRepo.findOne(mn.getParent());
				if(menuIdList.size() > 0) {
					
					if(!menuIdList.contains(menuOnTop.getMenuId())) {
						menuList.add(menuOnTop);
						menuIdList.add(menuOnTop.getMenuId());
					}
				}else {
					menuList.add(menuOnTop);
					menuIdList.add(menuOnTop.getMenuId());
				}
				
			}
		}
		if(menuList.size() > 0) {
			
			for(Menu parent : menuList) {
				parent.setChildren(new ArrayList<Menu>());
				
				for(Menu menu : allMenuList) {
					if(menu.getParent() == parent.getMenuId()) {
						parent.getChildren().add(menu);
						menus.add(menu.getUrl());
					}
				}
				
				// Sort by sequence
				Collections.sort(parent.getChildren(), new Comparator<Menu>() {
					@Override
					public int compare(Menu u1, Menu u2) {
						return u1.getSequence().compareTo(u2.getSequence());
					}
				});
				
				// Menus Action Collect
				List<Menu> menuDatas = menuRepo.findByNotUrlAndParentIsNull("#");
				for(Menu collect : menuDatas) {
					menus.add(collect.getUrl());
				}
				
				// Set Menu in role
				role.setMenuList(menuList);
				role.setMenus(menus);
				role.setBagian(userType);
			}
		}
		
		
		return role;
	}
	
	public AllUsers userTree(AllUsers user) {
		Role role = this.signToUserRole(user.getUserRole(), user.getUserType());
		user.setRole(role);
		
		return user;
	}
	
//	public List<Privs> getPrivDataForTerimaDok(List<String> privNames) {
//		List<Privs> dataHasil = new ArrayList<Privs>();
//		for(String privName: privNames) {
//			List<Privs> dataPrivs = privsRepo.findByPrivNameStartsWith(privName);
//			if(dataPrivs.size() > 0) {
//				for(Privs dataPriv: dataPrivs) {
//					dataHasil.add(dataPriv);
//				}
//			}
//		}
//		return dataHasil;
//	}
	
	public void exportToExcel(List<Map<String, String>> bodyData, List<String> headerData, String fileName) {
		try {
			// Create a Workbook
			Workbook workbook = new XSSFWorkbook();
			// Create a Sheet
			String sheetName = fileName.substring(0, 20);
	        Sheet sheet = workbook.createSheet(sheetName);
	        
	        // Create a Font for styling header cells
	        Font headerFont = workbook.createFont();
	        //headerFont.setBoldweight(true);
	        headerFont.setFontHeightInPoints((short) 13);
	        headerFont.setColor(IndexedColors.BLACK.getIndex());
	        
	        // Create a CellStyle with the font
	        CellStyle headerCellStyle = workbook.createCellStyle();
	        headerCellStyle.setFont(headerFont);
	        
	        // Create a Row
	        Row headerRow = sheet.createRow(0);
	        for(int i = 0; i < headerData.size(); i++) {
	            Cell cell = headerRow.createCell(i);
	            cell.setCellValue(headerData.get(i));
	            cell.setCellStyle(headerCellStyle);
	        }
	        
	        int rowNum = 1;
	        for(Map<String, String> map: bodyData) {
	        	Row row = sheet.createRow(rowNum++);
	        	int colNum = 0;
	        	for (Map.Entry<String, String> entry : map.entrySet()) {
	        		row.createCell(colNum).setCellValue(map.get(entry.getKey()));
	        		colNum++;
	        	}
	        }
        
        
        	FileOutputStream fileOut = new FileOutputStream("C:/Users/HP-PC/Downloads/"+fileName);
            workbook.write(fileOut);
            fileOut.close();
            
        } catch (IOException e) {
            logger.error("write excel fail ",e);
        } catch (Exception e) {
            logger.error("write excel fail ",e);
        }
	}
	
	public String encriptData(String data) {
		return BCrypt.hashpw(data, BCrypt.gensalt());
	}
	
	public String simpanDCV(UiDcvRequest data) {
		List<UiDcvRequestDetail> dataDetails = data.getDcvRequestDetail();
		List<DcvDokumen> dokDetails = data.getDcvDokumenDetail();
		BigDecimal value = new BigDecimal(0);
		BigDecimal valueExc = new BigDecimal(0);
		
		// Random no.DCV from FUNCTION/PROCEDURE in DB
		String noDCV = uiDcvRequestRepo.getDCVNo();
		data.setNoDCV(noDCV);
		// ====================================================================================
		
		data.setModifiedDt(new Date());
		data.setStatus("ON-PROGRESS");
		data.setSubmitTime(new Date());
		for(UiDcvRequestDetail dataDetail : dataDetails) {
			value = value.add(dataDetail.getValExc());
			valueExc = valueExc.add(dataDetail.getValExc());
		}
		data.setValue(value);
		UiDcvRequest dataSimpan = uiDcvRequestRepo.save(data);
		
		for(UiDcvRequestDetail dataDetail : dataDetails) {
			dataDetail.setDcvhId(dataSimpan.getDcvhId());
			dataDetail.setModifiedDt(new Date());
			uiDcvRequestDetailRepo.save(dataDetail);
		}
		for(DcvDokumen dokDetail : dokDetails) {
			dokDetail.setDcvhId(dataSimpan.getDcvhId());
			dokDetail.setModifiedDt(new Date());
			dcvDokumenRepo.save(dokDetail);
		}
		
		// Update Old DCV Request
		if(data.getCopyFrom() != null) {
			this.updateDCVReq(Long.parseLong(data.getCopyFrom()));
		}
		
		return dataSimpan.getNoDCV();
	}
	
	public String updateDCVForSales(DcvListDto data) {
		UiDcvRequest dcvReq = uiDcvRequestRepo.findOne(data.getDcvhId().longValue());
		dcvReq.setCurrentStep(data.getCurrentStep());
		UiDcvRequest dataUpdate = uiDcvRequestRepo.save(dcvReq);
		
		return dataUpdate.getNoDCV();
	}
	
	public List<UiDcvRequest> findDcvByCustCode(String custCode) {
		List<UiDcvRequest> listDcv = uiDcvRequestRepo.findByCustCode(custCode);
		for(UiDcvRequest dcv : listDcv) {
			dcv.setDcvRequestDetail(uiDcvRequestDetailRepo.findByDcvhId(dcv.getDcvhId()));
			dcv.setDcvDokumenDetail(dcvDokumenRepo.findByDcvhId(dcv.getDcvhId()));
		}
		
		return listDcv;
	}
	
	public List<UiDcvRequest> findDcvByNoPC(String noPc) {
		List<UiDcvRequest> listDcv = uiDcvRequestRepo.findByNoPC(noPc);
		for(UiDcvRequest dcv : listDcv) {
			dcv.setDcvRequestDetail(uiDcvRequestDetailRepo.findByDcvhId(dcv.getDcvhId()));
			dcv.setDcvDokumenDetail(dcvDokumenRepo.findByDcvhId(dcv.getDcvhId()));
		}
		
		return listDcv;
	}
	
	public UiDcvRequest findByDcvId(Long dcvhId) {
		UiDcvRequest dcv = uiDcvRequestRepo.findOne(dcvhId);
		dcv.setDcvRequestDetail(uiDcvRequestDetailRepo.findByDcvhId(dcv.getDcvhId()));
		dcv.setDcvDokumenDetail(dcvDokumenRepo.findByDcvhId(dcv.getDcvhId()));
		
		return dcv;
	}
	
	public List<UiDcvRequest> findAllDcv() {
		List<UiDcvRequest> listDcv = uiDcvRequestRepo.findAll();
		for(UiDcvRequest dcv : listDcv) {
			dcv.setDcvRequestDetail(uiDcvRequestDetailRepo.findByDcvhId(dcv.getDcvhId()));
			dcv.setDcvDokumenDetail(dcvDokumenRepo.findByDcvhId(dcv.getDcvhId()));
		}
		
		return listDcv;
	}
	
	public List<TcApproval> getTcApprovalById(Long dcvlId){
		List<TcApproval> listTc = tcApprovalRepo.findByDcvlId(dcvlId);
		return listTc;
	}
	
	public WFTask getWfTaskByNoDcv(String noDcv) {
		List<WFTask> wfTaskList = wfTaskRepo.findByNoDCVOrderByIdDesc(noDcv);
		
		return wfTaskList.get(0);
	}
	
	public WFTask getWfTaskByIdAndNoDcv(Map<String, Object> param) {
		WFTask wfTask = new WFTask();
		Long id = Long.valueOf(param.get("pTaskId") != null ? param.get("pTaskId").toString() : "0");
		String noDcv = param.get("pDcvNo")!= null ? param.get("pDcvNo").toString() : "";
	    wfTask = wfTaskRepo.findByIdAndNoDCV(id, noDcv);
		// TODO Auto-generated method stub
		return wfTask;
	}
	
	// Example: Calling Store Procedure Oracle with Multiple and Ref_CURSOR OUT
	@SuppressWarnings("unchecked")
	public InformationPCDto validatePC(String nopc, String keypc, Date period1, Date period2, String custCode) {
		InformationPCDto hasilQuery = new InformationPCDto();
		
		/* Call @NamedStoredProcedureQuery at Model */
		StoredProcedureQuery proc = em.createNamedStoredProcedureQuery("validate_pc");
		
		/* IN params */
		proc.setParameter("nopc", nopc);
		proc.setParameter("keypc", keypc);
		/*proc.setParameter("period1", period1);    // dihilangkan
		proc.setParameter("period2", period2);*/
		proc.setParameter("pcust_code", custCode);
		proc.execute();
		
		/* OUT params */
		String res1 = (String) proc.getOutputParameterValue("response");
		String res2 = (String) proc.getOutputParameterValue("message");
		
		/* Ref_CURSOR OUT params */
		if(res1 != null && res1.equalsIgnoreCase("passed")) {
	    	List<Object[]> postComments = proc.getResultList();
	    	for(Object[] infPC: postComments) {
	    		hasilQuery = new InformationPCDto(infPC);
	    		/*hasilQuery.setTerm1(termRepo.findOne(Integer.parseInt(hasilQuery.getSyarat1())));
	    		hasilQuery.setTerm2(termRepo.findOne(hasilQuery.getSyarat2().intValue()));*/
	    		hasilQuery.setTerm1(lookupCodeRepo.findByTitleAndValue("TERM", hasilQuery.getSyarat1()));
	    		hasilQuery.setTerm2(lookupCodeRepo.findByTitleAndValue("TERM", hasilQuery.getSyarat2()));
	    	}
		} else {
			hasilQuery.setResponse(res1);
			hasilQuery.setMessage(res2);
		}
		
		return hasilQuery;
	}
	
	// Example: Calling Store Procedure Oracle with Ref_CURSOR OUT
//	@SuppressWarnings("unchecked")
//    public List<UserAccessDCV> findAllWithOrder() {
//    	StoredProcedureQuery proc = em.createNamedStoredProcedureQuery("collect_users");
//    	proc.execute();
//
//		List<UserAccessDCV> postComments = proc.getResultList(); //masih gagal
//    	
//    	return postComments;
//    }
    
    // Example: Calling Store Procedure Oracle with Ref_CURSOR OUT
	@SuppressWarnings("unchecked")
    public List<Holiday> getHoliday() {
    	List<Holiday> liburList = new ArrayList<Holiday>();
    	StoredProcedureQuery proc = em.createNamedStoredProcedureQuery("collect_libur");
    	proc.execute();

    	List<Object[]> postComments = proc.getResultList();
    	
    	for(Object liburX: postComments) {
    		liburList.add((Holiday) liburX);
    	}
    	
    	return liburList;
    }
    
    // Example: Calling Store Procedure Oracle with Multiple and Ref_CURSOR OUT
	@SuppressWarnings("unchecked")
    public Map<String, Object> findCopyDcvDetailByNoDcv(String noDcv, String custCode) {
    	Map<String, Object> hasil = new HashMap<>();
    	List<CopyDcvDto> listData = new ArrayList<>();
    	
    	/* Call @NamedStoredProcedureQuery at Model */
		StoredProcedureQuery proc = em.createNamedStoredProcedureQuery("copy_dcv");
		
		/* IN params */
		proc.setParameter("no_dcv", noDcv);
		proc.setParameter("cust_code", custCode);
		proc.execute();
		
		UiDcvRequest dataDcv = uiDcvRequestRepo.findByNoDCV(noDcv);
		
		/* OUT params */
		String res1 = (String) proc.getOutputParameterValue("message");
		//List<Object> res2 = (List<Object>) proc.getOutputParameterValue("tCopy_DCV_DETAIL");
		hasil.put("message", res1);
		
		/* Ref_CURSOR OUT params */
		if(res1 != null && res1.equalsIgnoreCase("Pass")) {
	    	List<Object[]> postComments = proc.getResultList();
	    	for(Object[] infPC: postComments) {
	    		CopyDcvDto copyDcvDto = new CopyDcvDto(infPC);
	    		listData.add(copyDcvDto);
	    	}
	    	hasil.put("listDetail", listData);
	    	
	    	hasil.put("dcvReq", this.findByDcvId(dataDcv.getDcvhId()));
		}
		
		return hasil;
    }
    
	@SuppressWarnings("unchecked")
    public void updateDCVReq(Long dcvId) {
    	List<UiDcvRequest> listData = new ArrayList<>();
    	
    	/* Call @NamedStoredProcedureQuery at Model */
		StoredProcedureQuery proc = em.createNamedStoredProcedureQuery("update_copied_dcv");
		
		/* IN params */
		proc.setParameter("vdcvh_id", String.valueOf(dcvId));
		proc.execute();
		
		/* Ref_CURSOR OUT params */
    	List<Object[]> postComments = proc.getResultList();
    	for(Object dataDcv: postComments) {
    		listData.add((UiDcvRequest) dataDcv);
    	}
    }
    
    @SuppressWarnings("unchecked")
    public List<DcvListDto> findDcvListByParam(Map<String, Object> param) {
    	Date tgl1 = null;
		Date tgl2 = null;
		SimpleDateFormat inputFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
    	List<DcvListDto> listData = new ArrayList<>();
    	Map<String, String> jenisMap = (Map<String, String>) param.get("pJenis");
		
		if(param.get("from") != null) {
			tgl1 = new Date((long) param.get("pPeriode1")); 
			tgl2 = new Date((long) param.get("pPeriode2"));  
		} else {
			try {
				String string1 = param.get("pPeriode1").toString();
				String string2 = param.get("pPeriode2").toString();
				tgl1 = inputFormat.parse(string1);
				tgl2 = inputFormat.parse(string2);
			} catch (ParseException e) {
				e.printStackTrace();
			}
		}
		
    	
    	/* Call @NamedStoredProcedureQuery at Model */
		StoredProcedureQuery proc = em.createNamedStoredProcedureQuery("DCV_TASK_LIST");
		
		/* IN params */
		proc.setParameter("pBagian", param.get("pBagian").toString());
		proc.setParameter("pUserName", param.get("pUserName").toString());
		proc.setParameter("pJenis", jenisMap.get("PARAM_NAME"));
		proc.setParameter("pPeriode1", tgl1);
		proc.setParameter("pPeriode2", tgl2);
		proc.execute();
		
		/* Ref_CURSOR OUT params */
    	List<Object[]> postComments = proc.getResultList();
    	for(Object[] dataDcv: postComments) {
    		DcvListDto hasil = new DcvListDto(dataDcv);
    		
    		if(hasil.getNodecode() != null) {
    			WFNode wfNode = wFNodeRepo.findOne(hasil.getNodecode());
    			if(wfNode != null) {
    				hasil.setCurrentStep(wfNode.getDesc());
    			}
    		}
    		
    		listData.add(hasil);
    	}
		
		
    	return listData; 
    }
    
    public Map<String, Object> getPOListByDcvId(Map<String, Object> param) {
    	List<ProsesPODto> allPOLine = new ArrayList<>();
    	Map<String, ProsesPODto> linePOContent = new HashMap<>();
    	Map<String, Object> result = new HashMap<>();
    	Map<String, List<String>> KodeProdukPO = new HashMap<>();
    	
    	StoredProcedureQuery proc = em.createNamedStoredProcedureQuery("po_list");
		
		/* IN params */
		proc.setParameter("pDcvLine", param.get("pDcvLine"));
		proc.execute();
    	
		/* Ref_CURSOR OUT params */
    	List<Object[]> postComments = proc.getResultList();
    	for(Object[] dataDcv: postComments) {
    		ProsesPODto hasil = new ProsesPODto(dataDcv);
    		
    		allPOLine.add(hasil);
    	}
    	
    	//
    	
    	List<String> pOList = new ArrayList<>();
    	List<String> kodeProdukList = new ArrayList<>();
    	
		
		/* Ref_CURSOR OUT params */

    	
    	//Mapping for no.PO List 
    	for(ProsesPODto po: allPOLine) {
    		if(pOList.size() > 0) {
    			if(!pOList.contains(po.getNoPo())) {
    				pOList.add(po.getNoPo());
    			}
    		} else {
    			pOList.add(po.getNoPo());
    		}
    	}
    	
    	//Mapping for Line PO List connect to no.PO
    	for(String po: pOList) {
    		for(ProsesPODto pos: allPOLine) {
    			if(po.contentEquals(pos.getNoPo())) {
    				//linePOList.add(pos.getLinePo().toString());
    				//linePOContent.put(pos.getLinePo().toString(), pos);
    				kodeProdukList.add(pos.getKodeProd().toString());
    				linePOContent.put(pos.getKodeProd().toString(), pos);
    			}
    		}
    		KodeProdukPO.put(po, kodeProdukList);
    		kodeProdukList = new ArrayList<>();
    	}
    	
    	result.put("noPOList", pOList);
    	result.put("kodeProdukPOList", KodeProdukPO);
    	result.put("linePOContent", linePOContent);
    	//
    	
    	
		return result;
	}
    
    @SuppressWarnings("unchecked")
    public List<ProsesPODto> getPoListByid(Map<String, Object> param){
    	List<ProsesPODto> listData = new ArrayList<>();
    	
    	StoredProcedureQuery proc = em.createNamedStoredProcedureQuery("po_list");
		proc.setParameter("pDcvLine", param.get("pDcvLine"));
		proc.execute();
		
		List<Object[]> postComments = proc.getResultList();
		for(Object[] dataDcv: postComments) {
			ProsesPODto result = new ProsesPODto(dataDcv);
			listData.add(result);
		}
		
    	return listData;
    }
    
    public Map<String, Object> getBodyFromDcvReq(Map<String, Object> param) {
    	Map<String, Object> hasil = new HashMap<>();
    	Map<String, String> detailBayar = new HashMap<>();
    	Map<String, String> dataLookUpAdj = new HashMap<>();
    	//Long dataAdjTotal = Long.valueOf(0);
    	
    	String noDcv 	= param.get("noDcv").toString();
    	String roleCode = param.get("roleCode").toString();
    	
    	UiDcvRequest dcvReq = uiDcvRequestRepo.findByNoDCV(noDcv);
    	List<UiDcvRequestDetail> dcvReqDtls = uiDcvRequestDetailRepo.findByDcvhId(dcvReq.getDcvhId());
    	List<DcvDokumen> dcvDoks = dcvDokumenRepo.findByDcvhId(dcvReq.getDcvhId());
//    	List<UiDcvRequest> dcvReqTerkait = uiDcvRequestRepo.findByNoPCAndCustCode(dcvReq.getNoPC(), dcvReq.getCustCode(), dcvReq.getDcvhId());
    	// tambahan untuk dcvAdjustment
    	//List<DcvAdjustment> dcvAdj = dcvAdjustmentRepo.findByDcvhId(dcvReq.getDcvhId());    // get data adjustment
    	//List<LookupCode> lookAdj = lookupCodeRepo.findByTitle("ADJUSTMENT");    // get data untuk adjustment type 
 
    	//dataAdjTotal = dcvAdjustmentRepo.countNilaiByDcvhId(dcvReq.getDcvhId());  // get total adj
    	
    	/*for(LookupCode lookupCode : lookAdj){
    		dataLookUpAdj.put(lookupCode.getDesc(), lookupCode.getValue());
    	}*/
    	
    	// Mapping berdasarkan dataViewDetail.json
    	for(UiDcvRequestDetail dtl : dcvReqDtls) {
    		dtl.setNoLinePC(dtl.getPromoProdId().toString().concat(dcvReq.getNoPC()));
    		dtl.setCustCode(dcvReq.getCustCode());
    	}
    	
    	// get doc rincian pendukung
    	StoredProcedureQuery proc = em.createNamedStoredProcedureQuery("dokpembayaran_list");
		
		/* IN params */
		proc.setParameter("pDcvNo", noDcv);
		proc.execute();
		
		/* Ref_CURSOR OUT params */
    	List<String> docPendukung = (List<String>)proc.getResultList();
    	
    	// Get Privs		
    	Privs privs = new Privs();
    	Privs privAdminSales = new Privs();
    	Privs privAdminTC = new Privs();
    	Privs privAdminTAX = new Privs();
    	Privs privAdminPromo = new Privs();
    	Privs privAdminAP = new Privs();
    	String privsTcApp = "";
    	String privTaxItem = "";
    	
    	List<RolePrivs> rolP = rolePrivsRepo.findByRoleCode(roleCode);
    	for (RolePrivs rol : rolP) {
    		
			Privs findPrivs = privsRepo.findOne(rol.getPrivCode());
			if(findPrivs != null) {
				if(findPrivs.getRefId1() != null) {
					String refId1 = findPrivs.getRefId1();
					if(refId1.equals("TCACT_BTN") || refId1.equals("SLSACT_BTN") || refId1.equals("DISTACT_BTN") || refId1.equals("PRACT_BTN") || refId1.equals("APACT_BTN") || refId1.equals("TAXACT_BTN")) {
						
						privs = findPrivs;
						if(refId1.equals("SLSACT_BTN")) {
							privAdminSales = findPrivs;
						}else if(refId1.equals("TCACT_BTN")) {
							privAdminTC = findPrivs;
						}else if(refId1.equals("TAXACT_BTN")) {
							privAdminTAX = findPrivs;
						}else if(refId1.equals("PRACT_BTN")) {
							privAdminPromo = findPrivs;
						}else if(refId1.equals("APACT_BTN")) {
							privAdminAP = findPrivs;
						}						
					}else if(refId1.equals("TCAPPV_BTN")) {
						privsTcApp = findPrivs.getRefId1();
					}else if(refId1.equals("TAX_ITEM")) {
						privTaxItem = findPrivs.getRefId1();
					}
				}
			}
		}
    	
    	// Get Master Customer
    	MasterCustomer masterCust = masterCustomerRepo.findAreaByCustCode(param.get("custCode").toString());
    	
    	//Detail Pembayaran
    /*	detailBayar.put("metBayar", dcvReq.getMetodeBayar() != null ? dcvReq.getMetodeBayar() : "");
    	detailBayar.put("proBayar", dcvReq.getProsesBayar() != null ? dcvReq.getProsesBayar() : "");
    	detailBayar.put("note", dcvReq.getNoteBayar() != null ? dcvReq.getNoteBayar() : "");*/
    	
    	hasil.put("kwitansi", null);
    	hasil.put("pembayaran", detailBayar);
//    	hasil.put("dcv_terkait", dcvReqTerkait);
    	hasil.put("attchment", dcvDoks);
    	//hasil.put("dcvAdjustment", dcvAdj);
    	hasil.put("lookupAdj", dataLookUpAdj);
    	hasil.put("dokumen_pendukung", docPendukung);
    	hasil.put("dcv_lines", dcvReqDtls);
    	hasil.put("privs", privs);
    	hasil.put("privAdminSales", privAdminSales);
    	hasil.put("privAdminTC", privAdminTC);
    	hasil.put("privAdminTAX", privAdminTAX);
    	hasil.put("privAdminPromo", privAdminPromo);
    	hasil.put("privAdminAP", privAdminAP);
    	hasil.put("privTC", privsTcApp);
    	hasil.put("privTaxItem", privTaxItem);
    	hasil.put("masterCustomer", masterCust);
    
    	//hasil.put("totalAdjustmentValue", String.valueOf(dataAdjTotal != null ? dataAdjTotal : "0"));
    	
    	return hasil;
    }
    
    public Map<String, Object> findWfByNoDcv(String noDcv) {
    	int number = 0;
    	Map<String, Object> hasil = new HashMap<>();
    	BigDecimal totalPayment = new BigDecimal(0);
    	
    	UiDcvRequest dcvReq = uiDcvRequestRepo.findByNoDCV(noDcv);
    	List<WFTask> wfTaskList = wfTaskRepo.findByNoDCVOrderByIdAsc(noDcv);
    	
    	for(WFTask wfT : wfTaskList) {
    		number += 1;
    		wfT.setIndex(number);
    		wfT.setTanggal(tanggal.format(wfT.getAssignTime()));
    		wfT.setWaktu(waktu.format(wfT.getAssignTime()));
    		
    		int dayofInt = wfT.getAssignTime().getDay();
    		String dayofString = HARI[dayofInt];
	        wfT.setHari(dayofString);
	        
	        wfT.setJmlHari(10);
	        wfT.setJmlJam(Integer.valueOf(jam.format(wfT.getProcessTime())));
	        wfT.setJmlMenit(Integer.valueOf(menit.format(wfT.getProcessTime())));
	        wfT.setJmlDetik(Integer.valueOf(detik.format(wfT.getProcessTime())));
    	}
    	
    	hasil.put("workFlow", wfTaskList);
    	hasil.put("totalDcv", dcvReq.getValue());
    	hasil.put("totalPayment", totalPayment);
    	hasil.put("sisa", dcvReq.getValue().subtract(totalPayment));
    	
    	return hasil;
    }
    
    @SuppressWarnings("unchecked")
    public Map<String, Object> findAllByDcvId(String noDcv) {
    	Map<String, Object> hasil = new HashMap<>();
    	UiDcvRequest dcvReq = uiDcvRequestRepo.findByNoDCV(noDcv);
    	
    	/* Call @NamedStoredProcedureQuery at Model */
		StoredProcedureQuery proc = em.createNamedStoredProcedureQuery("find_all_by_dcvid");
		
		/* IN params */
		proc.setParameter("vdcvhid", dcvReq.getDcvhId());
		proc.execute();
		
		/* Ref_CURSOR OUT params */
    	List<Object[]> postComments = proc.getResultList();
    	
    	return hasil;
    }
    
    public DcvDokumen saveDcvDoc(DcvDokumen dcvDoc) {
    	DcvDokumen existingDoc = dcvDokumenRepo.findByDcvhIdAndDocType(dcvDoc.getDcvhId(), dcvDoc.getDocType());
    	if(existingDoc != null) {
    		dcvDoc.setId(existingDoc.getId());
    	}
    	dcvDoc.setModifiedDt(new Date());
    	return dcvDokumenRepo.save(dcvDoc);
    }
    
    public List<DcvDokumen> getDcvDocList(Map <String, Object> param) {
    	List<DcvDokumen> result = new ArrayList<>();
    	List<DcvDokumen> record = dcvDokumenRepo.findByDcvhId(Long.valueOf(param.get("dcvhId").toString()));
    	for (DcvDokumen dcvDokumen : record) {
    		if(dcvDokumen.getDocType() != null) {
    			if(dcvDokumen.getDocType().equals(param.get("docType").toString())) {
    				result.add(dcvDokumen);
    			}
    		}
		}
    	return result;
    }
    
    public UiDcvRequest savingDcvReqForTC(UiDcvRequest dcvReq) {
    	UiDcvRequest existingDcvReq = uiDcvRequestRepo.findByNoDCV(dcvReq.getNoDCV());
    	if(existingDcvReq != null) {
    		existingDcvReq.setMetodeBayar(dcvReq.getMetodeBayar());
    		existingDcvReq.setProsesBayar(dcvReq.getProsesBayar());
    		existingDcvReq.setNoteBayar(dcvReq.getNoteBayar());
    		existingDcvReq.setBebanSla(dcvReq.getBebanSla());
    	}
    	existingDcvReq.setModifiedDt(new Date());
    	return uiDcvRequestRepo.save(existingDcvReq);
    }
    
//    public DcvAdjustment savingDcvAdjustForTC(List<LinkedHashMap<String, Object>> param) {
//    	DcvAdjustment dcvAdjustment = new DcvAdjustment();
//    	
//    	String notes = null;
//    	String adjType = null;
//    	Long dcvhId = new Long(0);
//    	Long nilai = new Long(0);
//    	Long totalAdjustment = new Long(0);
//    	Long toalAppvValExc = new Long(0);
//    	UiDcvRequest uiDcvRequest = new UiDcvRequest();
//    	
//    	for(LinkedHashMap<String, Object> maps: param) {
//    		dcvAdjustment = new DcvAdjustment();
//    		dcvhId = Long.valueOf(maps.get("dcvhId").toString());
//    		adjType = String.valueOf(maps.get("adjType").toString());
//    		nilai = Long.valueOf(maps.get("nilai").toString());
//    		notes = String.valueOf(maps.get("notes")!= null ? maps.get("notes").toString() : "");
//    		dcvAdjustment.setDcvhId(dcvhId);
//    		dcvAdjustment.setAdjType(adjType);
//    		dcvAdjustment.setNilai(nilai);
//    		dcvAdjustment.setNotes(notes);
//    		
//    		dcvAdjustmentRepo.save(dcvAdjustment);
//    	}
//    	// call store procedure for sync data kalkulasi
//    	StoredProcedureQuery proc = em.createNamedStoredProcedureQuery("sync_dcv_value");
//    	
//    	UiDcvRequest dataDcv = uiDcvRequestRepo.findOne(dcvhId);
//		
//		/* IN params */
//		proc.setParameter("pNoDcv", dataDcv.getNoDCV());
//		proc.execute();
//    	// until here
//    	
//    	// count hasil data dcv_adjustment 
//    	
//    	/*Long dataCountAdj = dcvAdjustmentRepo.countNilaiByDcvhId(dcvhId);
//    	totalAdjustment = dataCountAdj != null ? dataCountAdj : Long.valueOf(0);
//    	Long dataCountDtl = uiDcvRequestDetailRepo.countTotalAppvValExcByDcvhId(dcvhId);
//    	toalAppvValExc = dataCountDtl != null ? dataCountDtl : Long.valueOf(0); 
//  
//    	Long dataResult = toalAppvValExc - totalAdjustment;
//    	
//    	
//    	UiDcvRequest dcvReq = uiDcvRequestRepo.findOne(dcvhId);
//    	dcvReq.setAppvValue(new BigDecimal(dataResult));
//    	uiDcvRequestRepo.save(dcvReq);*/
//    	
//    	
//    	return dcvAdjustment;
//    	
//    }
    
//    public DcvAdjustment deleteDcvAdjustForTC(Map<String, Object> param) {
//    	DcvAdjustment dcvAdjustment = new DcvAdjustment();
//    	Long totalAdjustment = new Long(0);
//    	Long toalAppvValExc = new Long(0);
//    	Long dcvhId = new Long(0);
//    	//UiDcvRequest uiDcvRequest = new UiDcvRequest();
//    	dcvhId = Long.valueOf(param.get("dcvhId").toString());
//    	dcvAdjustment.setId(Long.valueOf(param.get("adjId").toString()));
//    	
//    	dcvAdjustmentRepo.delete(dcvAdjustment);
//    	
//    	// call store procedure for sync data kalkulasi
//    	StoredProcedureQuery proc = em.createNamedStoredProcedureQuery("sync_dcv_value");
//    	
//    	UiDcvRequest dataDcv = uiDcvRequestRepo.findOne(dcvhId);
//		
//		/* IN params */
//		proc.setParameter("pNoDcv", dataDcv.getNoDCV());
//		proc.execute();
//    	// until here
//    	
//    	
//    /*	Long dataCountAdj = dcvAdjustmentRepo.countNilaiByDcvhId(dcvhId);
//    	totalAdjustment = dataCountAdj != null ? dataCountAdj : Long.valueOf(0);
//    	Long dataCountDtl = uiDcvRequestDetailRepo.countTotalAppvValExcByDcvhId(dcvhId);
//    	toalAppvValExc = dataCountDtl != null ? dataCountDtl : Long.valueOf(0); 
//  
//    	Long dataResult = toalAppvValExc - totalAdjustment;
//    	
//    	
//    	UiDcvRequest dcvReq = uiDcvRequestRepo.findOne(dcvhId);
//    	dcvReq.setAppvValue(new BigDecimal(dataResult));
//    	uiDcvRequestRepo.save(dcvReq);*/
//    	
//    	return dcvAdjustment;
//    	
//    }
    
    
    
    public UiDcvRequestDetail savingDcvReqDtlForTcAppv(List<LinkedHashMap<String, Object>> param) {
    	String noPo 		= "";
    	String pcPengganti 	= "";
    	String pcTambahan 	= "";
    	String kodeProd 	= "";
    	String namaProd		= "";
    	String flagBudget 	= "";
    	String uom 			= "";
    	String note			= "";
    	String supplierCode	= "";
    	String poDesc		= "";
    	String kodeSite		= "";
    	String noPr			= "";
    	String modifiedBy	= "";
    	
    	Long dcvhId 		= new Long(0);
    	Long dcvlId 		= new Long(0);
    	Long poLineId 		= new Long(0);
    	Long unitPrice 		= new Long(0);
    	Long poId 			= new Long(0);
    	Long linePr			= new Long(0);
    	Long pcPenggantiPPId= new Long(0);
    	Long pcTambahanPPId	= new Long(0);
    	
    	BigDecimal qty 			= new BigDecimal(0);
    	BigDecimal totalPrice 	= new BigDecimal(0);
    	BigDecimal qtyPo 		= new BigDecimal(0);
    	BigDecimal poPpn		= new BigDecimal(0);
    	
    	TcApproval tcApproval = new TcApproval();
    	
    	// Delete same data before save
    	for(LinkedHashMap<String, Object> maps : param) {
    		dcvlId = Long.valueOf(maps.get("dcvlId").toString());
    		List<TcApproval> listTcApproval = tcApprovalRepo.findByDcvlId(dcvlId);
    		for (TcApproval tc : listTcApproval) {
				tcApproval.setId(tc.getId());
	    		tcApprovalRepo.delete(tcApproval);
			}
    	}
    	
    	// save data to tc_approval
    	for(LinkedHashMap<String, Object> maps: param) {
    		dcvhId = Long.valueOf(maps.get("dcvhId").toString());
    		dcvlId = Long.valueOf(maps.get("dcvlId").toString());
    		if(maps.size() > 2 && !maps.get("noPo").toString().isEmpty() && !maps.get("noPo").toString().equals("null") && maps.get("noPo") != null) {        		
        		noPo 		= maps.get("noPo").toString();
        		poLineId	= maps.get("poLineId").toString().isEmpty() || maps.get("poLineId") == null || maps.get("poLineId").toString().equals("null") ? null : Long.valueOf(maps.get("poLineId").toString());
        		pcPengganti = maps.get("pcPengganti").toString();
        		pcTambahan 	= maps.get("pcTambahan").toString();
        		kodeProd 	= maps.get("kodeProd").toString();
        		namaProd 	= maps.get("namaProd").toString();
        		flagBudget 	= maps.get("flagBudget").toString();
        		uom 		= maps.get("uom").toString();
        		note		= maps.get("note").toString();
        		supplierCode= maps.get("supplierCode").toString();
        		poDesc		= maps.get("poDesc").toString();
        		kodeSite	= maps.get("siteCode").toString();
        		noPr		= maps.get("noPr").toString();
        		modifiedBy	= maps.get("modifiedBy").toString();
        		qty 		= maps.get("qty").toString().isEmpty() || maps.get("qty") == null || maps.get("qty").toString().equals("null") ? null : new BigDecimal(maps.get("qty").toString());
        		unitPrice 	= maps.get("unitPrice").toString().isEmpty() || maps.get("unitPrice") == null || maps.get("unitPrice").toString().equals("null") ? null : Long.valueOf(maps.get("unitPrice").toString());
        		totalPrice 	= maps.get("totalPrice").toString().isEmpty() || maps.get("totalPrice") == null || maps.get("totalPrice").toString().equals("null") ? null : new BigDecimal(maps.get("totalPrice").toString());
        		poId 		= maps.get("poId").toString().isEmpty() || maps.get("poId") == null || maps.get("poId").toString().equals("null") ? null : Long.valueOf(maps.get("poId").toString());
        		linePr	 	= maps.get("linePr").toString().isEmpty() || maps.get("linePr") == null || maps.get("linePr").toString().equals("null") ? null : Long.valueOf(maps.get("linePr").toString());
        		pcPenggantiPPId = maps.get("pcPenggantiPpId").toString().isEmpty() || maps.get("pcPenggantiPpId") == null || maps.get("pcPenggantiPpId").toString().equals("null") ? null : Long.valueOf(maps.get("pcPenggantiPpId").toString());
        		pcTambahanPPId = maps.get("pcTambahanPpId").toString().isEmpty() || maps.get("pcTambahanPpId") == null || maps.get("pcTambahanPpId").toString().equals("null") ? null : Long.valueOf(maps.get("pcTambahanPpId").toString());
        		poPpn	 	= maps.get("poPpn").toString().isEmpty() || maps.get("poPpn") == null || maps.get("poPpn").toString().equals("null") ? null : new BigDecimal(maps.get("poPpn").toString());
        		qtyPo 		= maps.get("qtyPo").toString().isEmpty() || maps.get("qtyPo") == null || maps.get("qtyPo").toString().equals("null") ? null : new BigDecimal(maps.get("qtyPo").toString());
        		
        		tcApproval.setDcvlId(dcvlId);
        		tcApproval.setNoPo(noPo);
        		tcApproval.setPoLineId(poLineId);
        		tcApproval.setPcPengganti(pcPengganti);
        		tcApproval.setPcTambahan(pcTambahan);
        		tcApproval.setProdCode(kodeProd);
        		tcApproval.setProdName(namaProd);
        		tcApproval.setFlagBudget(flagBudget);
        		tcApproval.setQty(qty);
        		tcApproval.setUom(uom);
        		tcApproval.setHargaSatuan(unitPrice);
        		tcApproval.setNilaiTotal(totalPrice);
        		tcApproval.setNotes(note);
        		tcApproval.setKodeSuplier(supplierCode);
        		tcApproval.setPoId(poId);
        		tcApproval.setPoDesc(poDesc);
        		tcApproval.setKodeSite(kodeSite);
        		tcApproval.setNoPr(noPr);
        		tcApproval.setLinePr(linePr);
        		tcApproval.setPcPenggantiPPId(pcPenggantiPPId);
        		tcApproval.setPcTambahanPPId(pcTambahanPPId);
        		tcApproval.setPoPpn(poPpn);
        		tcApproval.setModifiedDt(new Date());
        		tcApproval.setModifiedBy(modifiedBy);
        		tcApproval.setQtyPo(qtyPo);
        		tcApprovalRepo.save(tcApproval);
        		tcApproval = new TcApproval();
    		}
    	}
    	
    	// call store procedure for sync data kalkulasi
    	StoredProcedureQuery proc = em.createNamedStoredProcedureQuery("sync_dcv_value");
    	UiDcvRequest dataDcv = uiDcvRequestRepo.findOne(dcvhId);
		// Params
		proc.setParameter("pNoDcv", dataDcv.getNoDCV());
		proc.execute();
		UiDcvRequestDetail hasil = uiDcvRequestDetailRepo.findByDcvhIdAndDcvlId(dcvhId, dcvlId);    	
    	
		return hasil;
		
    }
    
    public List<ActionList> findActionListByDcvAndBagianAndNodeCode(ActionList actList) {
    	List<ActionList> hasil = new ArrayList<>();
    	List<ActionList> termList = actionListRepo.findByNoDcvAndBagianAndNodeCode(actList.getNoDcv(), actList.getBagian(), actList.getNodeCode());
    	
    	for(int i=0; i<termList.size(); i++) {
    		ActionList term = actionListRepo.findByPilihan(termList.get(i).getNoDcv(), termList.get(i).getBagian(), termList.get(i).getNodeCode(), new BigDecimal(i).add(new BigDecimal(1)));
    		if(term != null) {
    			hasil.add(term);
    		}
    	}
    	
    	return hasil;
    }
    
    @SuppressWarnings("unchecked")
    public List<String> findNoPCByCustCode(String custCode) {
    	List<String> hasil = new ArrayList<>();
    	
    	/* Call @NamedStoredProcedureQuery at Model */
		StoredProcedureQuery proc = em.createNamedStoredProcedureQuery("proposal_cust_mapping");
		
		/* IN params */
		proc.setParameter("pcust_code", custCode);
		proc.execute();
		
		/* Ref_CURSOR OUT params */
    	List<Object[]> postComments = proc.getResultList();
    	for(Object[] dataProp: postComments) {
    		PropCustMappingDto hasilProp = new PropCustMappingDto(dataProp);
    		hasil.add(hasilProp.getNoPC());
    	}
    	
    	return hasil;
    }
    
    @SuppressWarnings("unchecked")
    public Map<String, Object> findPOLineByDcvLine(Integer dcvLine) {
    	Map<String, Object> hasil = new HashMap<>();
    	Map<String, List<String>> PO2linePO = new HashMap<>();
    	Map<String, POListDto> linePOContent = new HashMap<>();
    	List<POListDto> allPOLine = new ArrayList<>();
    	List<String> pOList = new ArrayList<>();
    	List<String> linePOList = new ArrayList<>();
    	
    	/* Call @NamedStoredProcedureQuery at Model */
		StoredProcedureQuery proc = em.createNamedStoredProcedureQuery("dcv_po_list");
		
		/* IN params */
		proc.setParameter("pDcvLine", dcvLine);
		proc.execute();
		
		/* Ref_CURSOR OUT params */
    	List<Object[]> postComments = proc.getResultList();
    	for(Object[] dataPO: postComments) {
    		allPOLine.add((POListDto) new POListDto(dataPO));
    	}
    	
    	//Mapping for no.PO List 
    	for(POListDto po: allPOLine) {
    		if(pOList.size() > 0) {
    			if(!pOList.contains(po.getNoPO())) {
    				pOList.add(po.getNoPO());
    			}
    		} else {
    			pOList.add(po.getNoPO());
    		}
    	}
    	
    	//Mapping for Line PO List connect to no.PO
    	for(String po: pOList) {
    		for(POListDto pos: allPOLine) {
    			if(po.contentEquals(pos.getNoPO())) {
    				linePOList.add(pos.getPoLineId().toString());
    				linePOContent.put(pos.getPoLineId().toString(), pos);
    			}
    		}
    		PO2linePO.put(po, linePOList);
    		linePOList = new ArrayList<>();
    	}
    	
    	hasil.put("noPOList", pOList);
    	hasil.put("linePOList", PO2linePO);
    	hasil.put("linePOContent", linePOContent);
    	
    	return hasil;
    }
    
    public Map<String, Object> updateWFTaskFromAction(Map<String, Object> param) {
    	Map<String, Object> hasil = new HashMap<>();
    	
    	/* Call @NamedStoredProcedureQuery at Model */
		StoredProcedureQuery proc = em.createNamedStoredProcedureQuery("post_action");
		
		/* IN params */
		/*proc.setParameter("pTaskId", Integer.valueOf(param.get("pTaskId").toString()));
		proc.setParameter("pActionId", Integer.valueOf(param.get("pActionId").toString()));
		proc.setParameter("pUser", param.get("pUser").toString());
		proc.setParameter("pNote", param.get("pNote") != null ? param.get("pNote").toString() : "");*/
		
		proc.setParameter("pTaskId", Integer.valueOf(param.get("pTaskId").toString()));
		proc.setParameter("pActionId",  param.get("pActionId") != null ? Integer.valueOf(param.get("pActionId").toString()) : 0);
		proc.setParameter("pUser", param.get("pUser").toString());
		proc.setParameter("pNote", param.get("pNote") != null ? param.get("pNote").toString() : "");
		
		proc.execute();
		
		/* OUT params */
		Integer resCode = (Integer) proc.getOutputParameterValue("pResponseCode");
		String resMsg = (String) proc.getOutputParameterValue("pResponseMsg");
    	
		hasil.put("code", resCode);
		hasil.put("message", resMsg);
//    	hasil.put("code", 0);
//		hasil.put("message", "sukses");
    	return hasil;
    }

	public Map<String, Object> generateInvoice(Map<String, Object> param) {
		Map<String, Object> hasil = new HashMap<>();
		DateFormat f1 = new SimpleDateFormat("dd/MM/yyyy");
		StoredProcedureQuery proc = em.createNamedStoredProcedureQuery("cek_invoice");
		
		proc.setParameter("dcvNo" , param.get("dcvNo").toString());
		
		proc.execute();
		
		Date resDate = (Date) proc.getOutputParameterValue("invoiceDate");
		String resInvoice = (String) proc.getOutputParameterValue("invoiceNo");
		
		hasil.put("resInvoice", resInvoice);
		hasil.put("resDate", f1.format(resDate));
		
		return hasil;
		
	}

	public Map<String, Object> generateGr(Map<String, Object> param) {
		Map<String, Object> hasil = new HashMap<>();
		DateFormat f1 = new SimpleDateFormat("dd/MM/yyyy");
		String dateNow = "";
		StoredProcedureQuery proc = em.createNamedStoredProcedureQuery("generate_gr");
		
		
		proc.setParameter("dcvNo" , param.get("dcvNo").toString());
		
		proc.execute();
		
		String grStatus = (String) proc.getOutputParameterValue("grStatus");
		String grNo = (String) proc.getOutputParameterValue("grNo");
		if(null != grNo){
			dateNow = f1.format(new Date());
			hasil.put("dateNow", dateNow);
		}
		
		hasil.put("grNo", grNo);
		hasil.put("grStatus", grStatus);
		
		return hasil;
	}

	public List<DocumentAction> getListActionDocBatch(String bagian) {
		List<DocumentAction> dataListAction = new ArrayList<DocumentAction>();
		
		dataListAction = documentActionRepo.findByBagian(bagian);
		
	
		return dataListAction;
	}

	public List<DocumentBatchDto> searchDocHistoryBySp(Map<String, Object> param) {
		//Map<String, Object> hasil = new HashMap<>();
		List<DocumentBatchDto> hasil = new ArrayList<DocumentBatchDto>();
		Calendar cal = Calendar.getInstance();
		
		Date tgl1 = null;
		//Date tgl2 = null;
		SimpleDateFormat inputFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
		String string1 = param.get("tglProses").toString();
		try {
			tgl1 = inputFormat.parse(string1);
			cal.setTime(tgl1);
			cal.add(Calendar.DAY_OF_MONTH, 1);
			tgl1 = cal.getTime();
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		//DocumentAction dataAction = (DocumentAction) param.get("action");
		
		
		StoredProcedureQuery proc = em.createNamedStoredProcedureQuery("qry_hist_batch_document");
		
		proc.setParameter("pBagian" , param.get("bagian").toString());
		proc.setParameter("tgl", tgl1);
		proc.setParameter("pNodeCode", param.get("node").toString());
		proc.setParameter("pilihan", Integer.valueOf(param.get("pilihan").toString()));
		
		proc.execute();
		
		List<Object[]> postComments = proc.getResultList();
    	for(Object[] dataBatchHistori: postComments) {
    		DocumentBatchDto data = new DocumentBatchDto(dataBatchHistori);
    		
    		hasil.add(data); 
    	}
		
		
		
		
		
		
		return hasil;
	}
	
	public List<DocumentAction> getDocumentAction(String bagian) {
		List<DocumentAction> result = new ArrayList<DocumentAction>();
		List<DocumentAction> dataDocAction = documentActionRepo.findByBagian(bagian);
		if(dataDocAction.size() > 0) {
			for(DocumentAction dataDoc: dataDocAction) {
				result.add(dataDoc);
			}
		}
		return result;
	}
	
	public List<DocumentBatchDto> findDocumentBatchList(Map<String, Object> param){
		List<DocumentBatchDto> listDoc = new ArrayList<DocumentBatchDto>();
		
		StoredProcedureQuery proc = em.createNamedStoredProcedureQuery("qry_open_batch_document");
		
		proc.setParameter("pBagian", param.get("actionBagian").toString());
		proc.setParameter("pNodeCode", param.get("nodeCode").toString());
		proc.execute();
		
		List<Object[]> postComments = proc.getResultList();
		for(Object[] dataDoc : postComments) {
			DocumentBatchDto result = new DocumentBatchDto(dataDoc);
			listDoc.add(result);
		}
		return listDoc;
	} 	
	
	public Map<String, Object> saveDocumentBacth(List<LinkedHashMap<String, Object>> param) {
		Map<String, Object> result 			= new HashMap<>();
		Map<String, List<String>> record 	= new HashMap<>();
		List<String> taskid		 			= new ArrayList<>();
		List<String> code		 			= new ArrayList<>();
		List<String> msg		 			= new ArrayList<>();
		int success = 0;
		int fail = 0;
		
		
		for(LinkedHashMap<String, Object> prm : param) {
			try {
//				/* Call @NamedStoredProcedureQuery at Model */
				StoredProcedureQuery proc = em.createNamedStoredProcedureQuery("post_action");
				
//				/* IN params */
				
				proc.setParameter("pTaskId", Integer.valueOf(prm.get("pTaskId").toString()));
				proc.setParameter("pActionId",  prm.get("pActionId") != null ? Integer.valueOf(prm.get("pActionId").toString()) : 0);
				proc.setParameter("pUser", prm.get("pUser").toString());
				proc.setParameter("pNote", prm.get("pNote") != null ? prm.get("pNote").toString() : "");
				
				proc.execute();
				
//				/* OUT params */
				Integer resCode = (Integer) proc.getOutputParameterValue("pResponseCode");
				String resMsg = (String) proc.getOutputParameterValue("pResponseMsg");
				
				if(resCode == 0) {
					success += 1;
				}else {
					fail += 1;
				}
				
//				result.put("taskid", taskid);
//				result.put("msg", msg);
				 
			
			}
			catch(Exception ex) {
				result.put("code", "err"+prm.get("pTaskId").toString());
				result.put("message", ex.getMessage());
			}
		}
		
		result.put("success", success);
		result.put("fail", fail);
		
    	return result;
	}

//	public List<Disposisi> getDisposisiData(Map<String, Object> param) {
//		List<Disposisi> resultList = new ArrayList<Disposisi>();
//		String custCode = null;
//		String disposisi = null;
//		Date start = null;
//		Date end = null;
//		
//		Calendar calStart = Calendar.getInstance();
//		Calendar calEnd = Calendar.getInstance();
//		SimpleDateFormat inputFormat = new SimpleDateFormat("yyyy-MM-dd");
//		String stringStart = param.get("start").toString();
//		String stringEnd = param.get("end").toString();
//		try {
//					start = inputFormat.parse(stringStart);
//					calStart.setTime(start);
//					calStart.add(Calendar.DAY_OF_MONTH, 1);
//					start = calStart.getTime();
//					
//					end = inputFormat.parse(stringEnd);
//					calEnd.setTime(end);
//					calEnd.add(Calendar.DAY_OF_MONTH, 1);
//					end = calEnd.getTime();
//					
//				} catch (ParseException e) {
//					// TODO Auto-generated catch block
//					e.printStackTrace();
//				}
//		
//		custCode = param.get("custCode") != null ? param.get("custCode").toString() : null;
//		disposisi = param.get("disposisi") != null ? param.get("disposisi").toString() : "ALL";
//		
//		if(custCode!= null){       // jika login user distibutor
//			if(disposisi.equalsIgnoreCase("ALL")) {
//				resultList = disposisiRepo.findDispByCustAndStartAndDate(custCode, start, end);
//			} else {
//				resultList = disposisiRepo.findDispByCustAndDistAndStartAndDate(custCode, disposisi, start, end);
//			}	
//		} else {
//			if(disposisi.equalsIgnoreCase("ALL")) {
//				resultList = disposisiRepo.findDispByStartAndDate(start, end);
//			} else {
//				resultList = disposisiRepo.findDispByDistAndStartAndDate(disposisi ,start, end);
//			}
//		}
//		
//		for(Disposisi dis : resultList){
//			DateFormat f1 = new SimpleDateFormat("dd/MM/yyyy");
//			if(dis.getTglInvoice() != null){
//				dis.setTglInvoiceString(f1.format(dis.getTglInvoice()));
//			}
//			if(dis.getTglOpenDisposisi() != null){
//				dis.setTglOpenDisposisiString(f1.format(dis.getTglOpenDisposisi()));
//			}
//			if(dis.getTglActionTC() != null){
//				dis.setTglActionTCString(f1.format(dis.getTglActionTC()));
//			}
//			
//		}
//		
//		return resultList;
//	}
	
	@SuppressWarnings("unchecked")
	public Map<String, Object> getListViewWorflow(Map<String, Object> param){
		Map<String, Object> result = new HashMap<String, Object>();
		List<WorkFlowDto> flagA = new ArrayList<WorkFlowDto>();
		List<WorkFlowDto> flagC = new ArrayList<WorkFlowDto>();
		List<WorkFlowDto> flagD = new ArrayList<WorkFlowDto>();
		
		//UiDcvRequest dcvReq = uiDcvRequestRepo.findByNoDCV(param.get("pNoDcv").toString());
		StoredProcedureQuery proc = em.createNamedStoredProcedureQuery("wf_hist");
		proc.setParameter("pbagian", param.get("pbagian").toString());
		proc.setParameter("pNoDcv", param.get("pNoDcv").toString());
		proc.execute();
		
		List<Object[]> postComments = proc.getResultList();
		for(Object[] dataDoc : postComments) {
			WorkFlowDto record = new WorkFlowDto(dataDoc);
			if(record.getFlag1().equals("A")) {
				flagA.add(record);
			}else if(record.getFlag1().equals("C")) {
				flagC.add(record);
			}else if(record.getFlag1().equals("D")) {
				flagD.add(record);
			}
		}
		result.put("flagA",flagA);
		result.put("flagC",flagC);
		result.put("flagD",flagD);
		return result;
	}
	
	@SuppressWarnings("unchecked")
	public Map<String, Object> downloadExportExcel(ExportExcel exportExcel) {
		Map<String, Object> hasil = new HashMap<String, Object>();
		List<ExportExcelDto> resultFinalData = new ArrayList<ExportExcelDto>();
		
		logger.info("Excecute SP download_dcv");
		StoredProcedureQuery proc = em.createNamedStoredProcedureQuery("download_dcv");
		proc.setParameter("pDistributor", exportExcel.getDist());
        proc.setParameter("pFilterType", exportExcel.getFilterype());
        proc.setParameter("pBagian", exportExcel.getBagian());
        proc.setParameter("pPeriodeSubmitStart", exportExcel.getPeriodSubmitStart());
        proc.setParameter("pPeriodeSubmitEnd", exportExcel.getPeriodSubmitEnd());
        proc.setParameter("pNoDcv", exportExcel.getNoDcv());
        proc.setParameter("pPeriodeSubmit", exportExcel.getPeriodSubmit());
        proc.setParameter("pCustCode", exportExcel.getCustCode());
        proc.setParameter("pNamaCustomer", exportExcel.getNamaCustomer()); 
        proc.setParameter("pRegion", exportExcel.getRegion());
        proc.setParameter("pArea", exportExcel.getArea());
        proc.setParameter("pLocation", exportExcel.getLocation());
        proc.setParameter("pNoPc", exportExcel.getNoPc());
        proc.setParameter("pPeriodePcStart", exportExcel.getPeriodPcStart());
        proc.setParameter("pPeriodePcEnd", exportExcel.getPeriodPcEnd());
        proc.setParameter("pKategoriPc", exportExcel.getKategoryPc());
        proc.setParameter("pTipePc", exportExcel.getTipePc());
        proc.setParameter("pDcvValue" , exportExcel.getValue());
        proc.setParameter("pDcvApprValue", exportExcel.getApprValue());
        proc.setParameter("pDisposisi", exportExcel.getDisposisi());
        proc.setParameter("pNoSeri", exportExcel.getNoSeri());
        proc.setParameter("pLastAction", exportExcel.getLastAction());
        proc.setParameter("pCurrentAction", exportExcel.getCurrentAction());
        proc.setParameter("pSortBy1", exportExcel.getSortBy1());
        proc.setParameter("pOrder1", exportExcel.getOrderBy1());
        proc.setParameter("pSortBy2", exportExcel.getSortBy2()); 
        proc.setParameter("pOrder2", exportExcel.getOrderBy2());
        proc.setParameter("pSortBy3", exportExcel.getSortBy3()); 
        proc.setParameter("pOrder3", exportExcel.getOrderBy3());
        proc.setParameter("pSortBy4", exportExcel.getSortBy4());
        proc.setParameter("pOrder4", exportExcel.getOrderBy4());
        proc.setParameter("pSortBy5", exportExcel.getSortBy5());
        proc.setParameter("pOrder5", exportExcel.getOrderBy5());
        proc.setParameter("pSortBy6", exportExcel.getSortBy6());
        proc.setParameter("pOrder6", exportExcel.getOrderBy6());
        proc.setParameter("pSortBy7", exportExcel.getSortBy7());
        proc.setParameter("pOrder7", exportExcel.getOrderBy7());
        proc.setParameter("pSortBy8", exportExcel.getSortBy8());
        proc.setParameter("pOrder8", exportExcel.getOrderBy8());
        proc.setParameter("pSortBy9", exportExcel.getSortBy9());
        proc.setParameter("pOrder9", exportExcel.getOrderBy9());
        proc.setParameter("pSortBy10", exportExcel.getSortBy10());
        proc.setParameter("pOrder10", exportExcel.getOrderBy10());
		
        proc.execute();
        
        List<Object[]> postComments = proc.getResultList();
		for(Object[] dataDoc : postComments) {
			ExportExcelDto result = new ExportExcelDto(dataDoc);
			resultFinalData.add(result);
		}
		
		hasil.put("data", resultFinalData); // simpan hasil di sini
		hasil.put("totalsp", postComments.size());
		
		return hasil;
	}

	public Map<String, Object> getUrlLinkExternal(Map<String, Object> param) {
		Map<String, Object> hasil = new HashMap<String, Object>();
		List<LookupCode> dataLookUpList = new ArrayList<LookupCode>();
		String urlData = "";
		String result = "";
		String propId = "";
		
		//propId = param.get("propId") != null ? param.get("propId").toString() : null;
		UiDcvRequest dataDcvReq = uiDcvRequestRepo.findOne(Long.valueOf(param.get("dcvhId").toString()));
		propId = dataDcvReq.getNoPPId() != null ?dataDcvReq.getNoPPId().toString() : "not_found_propId";
		
		dataLookUpList = lookupCodeRepo.findByTitle("REPORT.EXT");
		
		
		
		if(null != dataLookUpList && dataLookUpList.size() > 0){
			LookupCode data = dataLookUpList.get(0);
			urlData = data.getValue();
			result = urlData.replace("PARAM", propId);
		}
		
		hasil.put("urlExt", result);
		
		return hasil;
	}

	public Map<String, Object> getDataKwitansi(Map<String, Object> param) {
		Map<String, Object> hasil = new HashMap<String, Object>();
		Long dcvhId = null;
		String terima = "";
		String terbilang = "";
		String desc = "";
		String jumlah = "";
		String materai = "";
		
		dcvhId = Long.valueOf(param.get("dcvhId").toString());
		
		UiDcvRequest dataDcv = uiDcvRequestRepo.findOne(dcvhId);
		
		if(null != dataDcv){
			if(null != dataDcv.getAppvValue()){
				StoredProcedureQuery proc = em.createNamedStoredProcedureQuery("terbilang");
				proc.setParameter("angka", dataDcv.getAppvValue());	
				 proc.execute();	 
				 terbilang = (String) proc.getOutputParameterValue("dataOut");
				 if(dataDcv.getAppvValue().compareTo(new BigDecimal("1000000")) >= 0){
					materai = "materai Rp.6000,-"; 
				 } else if (dataDcv.getAppvValue().compareTo(new BigDecimal("1000000")) == -1){
					 materai = "materai Rp.3000,-";
				 } else {
					 materai = "materai ";
				 }
				 List<LookupCode> dataLookupList = lookupCodeRepo.findByTitle("KWITANSI.DARI");
				 for (LookupCode lookupCode : dataLookupList) {
					 terima = lookupCode.getValue().toString();
				 }
				
				 DecimalFormat kurIndo = (DecimalFormat) DecimalFormat.getCurrencyInstance();
				 DecimalFormatSymbols formatRp = new DecimalFormatSymbols();
				 formatRp.setCurrencySymbol("Rp. ");
				 formatRp.setMonetaryDecimalSeparator(',');
				 formatRp.setGroupingSeparator('.');
				 kurIndo.setDecimalFormatSymbols(formatRp);
				 jumlah = kurIndo.format(dataDcv.getAppvValue());
				 desc = dataDcv.getKetrKwitansi() != null ? dataDcv.getKetrKwitansi() : "";
			}
			
		}
		
		hasil.put("terima", terima);
		hasil.put("terbilang", terbilang);
		hasil.put("materai", materai);
		hasil.put("desc", desc);
		hasil.put("jumlah", jumlah);
		
		
		return hasil;
	} 	
	
	public List<PPHList> PPHList(){
		List<PPHList> pphLIst = pphListRepo.findAll();
		return pphLIst;
	}
	
	public UiDcvRequestDetail updateCatatanPPH (Map<String, Object> param) {
    	Long dcvhId = new Long(0);
    	Long dcvlId = new Long(0);
    	String pphCode = "";
    	BigDecimal pphValue = new BigDecimal(0);
    	String catatanTC = "";
    	
		dcvhId = Long.valueOf(param.get("dcvhId").toString());
		dcvlId = Long.valueOf(param.get("dcvlId").toString());
		pphCode  = param.get("pphCode") != null ? param.get("pphCode").toString() : null;
//		pphValue = new BigDecimal(param.get("pphVal") != null ? param.get("pphVal").toString() : null);
		pphValue = param.get("pphVal") != null ? new BigDecimal(param.get("pphVal").toString()) : null;
		catatanTC = param.get("catatan") != null ? param.get("catatan").toString() : null; 
    	
    	UiDcvRequestDetail result = uiDcvRequestDetailRepo.findByDcvhIdAndDcvlId(dcvhId, dcvlId);
    	if(catatanTC == null) {
    		result.setPphCode(pphCode);
        	result.setPphVal(pphValue);
    	}else {
    		result.setCatatanTC(catatanTC);
    	}
    	uiDcvRequestDetailRepo.save(result);
    	
    	return result;  // temporary
    }

	public Map<String, Object> getDownloadData(Map<String, Object> param) throws IOException {
		// TODO Auto-generated method stub
		Map<String, Object> hasil = new HashMap<String, Object>();
		
		if (param.get("fileOriginal") != null) {
			// Map<String, Object> hasil = new HashMap<String, Object>();
			String dataReportAsli = param.get("fileOriginal").toString(); // nama
																			// file
																			// tersimpan
			String custCode = param.get("custCode").toString(); // folder per
																// user

			String lokasiPath = "";

			lokasiPath = getTitleFromParam("PATH").concat(getTitleFromParam("REMOTE.DIR")).concat(custCode).concat("/");

			String urlReport_data = lokasiPath.concat(dataReportAsli);

			FileInputStream in = null;

			File file = new File(urlReport_data);
			byte[] fileContent = new byte[(int) file.length()];

			in = new FileInputStream(file);

			in.read(fileContent);

			if (in != null) {
				in.close();
			}
			hasil.put("byte",fileContent );

		}
		
		return hasil;
		
		
		
		
	}
	
	private String getTitleFromParam(String title) {
		String hasil = "";
		List<LookupCode> param = lookupCodeRepo.findByTitle(title);
		
		if(null != param && param.size() > 0){
			hasil = param.get(0).getValue();
		}
		return hasil;
	}
	
	// Get PO List with Exception
	@SuppressWarnings("unchecked")
    public List<ProsesPODto> getPoListByidEx( List<LinkedHashMap<String, Object>> param){
    	List<ProsesPODto> listData 	= new ArrayList<>();
    	List<String> dataExc 		= new ArrayList<>();
    	List<String> dataSplrSite	= new ArrayList<>();
    	Boolean splrSiteEmpty		= true;
    	// Set PO, ProdCode in list string
    	for (LinkedHashMap<String, Object> prm : param) {
    		dataExc.add(prm.get("noPo").toString()+prm.get("prodCode").toString());
    		dataSplrSite.add(prm.get("supplier").toString()+prm.get("siteCode").toString());
    	}
    	
    	// Find dataSplrSite is empty
    	for(int i=0; i < dataSplrSite.size(); i++) {
			if(!dataSplrSite.get(i).isEmpty()) {
				splrSiteEmpty = false;
				break;
			}
		}
    	
    	// Set data in list object
    	for (LinkedHashMap<String, Object> prm : param) {
    		// From SP
			StoredProcedureQuery proc = em.createNamedStoredProcedureQuery("po_list");
    		proc.setParameter("pNoDcv", prm.get("pNoDcv"));
    		proc.setParameter("ppId", prm.get("ppId"));
    		proc.execute();
    		
    		List<Object[]> postComments = proc.getResultList();
    		for(Object[] dataDcv: postComments) {
    			ProsesPODto result = new ProsesPODto(dataDcv);    			
    			
    			if(result.getNoPo().toString().equals("ERROR")) {
    				listData.add(result);
    				break;
    			}else {
    				if(splrSiteEmpty == true) {
            			listData.add(result);	
        			}else {
        				// Find data suplier & site not same
        				String SuplierSite = result.getSupplierCode().toString()+result.getSiteCode().toString();
        				if(dataSplrSite.contains(SuplierSite)) {
            				
            				//Find data not same
                			String NoCodeProd = result.getNoPo().toString()+result.getKodeProd().toString();
                			if(!dataExc.contains(NoCodeProd)) {
                				listData.add(result);
                			}
            			}
        			}
    			}
    		}
    		break;
    	}
    	
    	return listData;
    }

	public DokumenRealisasi getGRbyDcvhId(DokumenRealisasi doc) {
	
		List<DokumenRealisasi> dataDocInDb = dokumenRealisasiRepo.findByTahapanAndDcvhIdOrderByDocNo("GR",doc.getDcvhId());
		
		if(null != dataDocInDb && dataDocInDb.size() > 0){
			return dataDocInDb.get(0);
		}
		
		return null;
	}

	public List<NewDcvDetailDto> findDetailForNewDCVSP(Integer propId) throws SQLException, IOException {
		// TODO Auto-generated method stub
		List<NewDcvDetailDto> dataResult = new ArrayList<NewDcvDetailDto>();
		
		StoredProcedureQuery proc = em.createNamedStoredProcedureQuery("get_prod_details");
		
		proc.setParameter("pId", propId);
		proc.execute();
		
		List<Object[]> postComments = proc.getResultList();
		for(Object[] dataDoc : postComments) {
			NewDcvDetailDto result = new NewDcvDetailDto(dataDoc);
			dataResult.add(result);
		}
		
		
		return dataResult;
	}

	public List<String> getUomByPpId(Map<String, Object> param) {
		//List<UomListDto> dataResultSp = new ArrayList<UomListDto>();
		List<String> resultListUom = new ArrayList<String>();
		Integer input = null;
		StoredProcedureQuery proc = em.createNamedStoredProcedureQuery("get_uom_stm");
		
		input = (Integer) param.get("ppid");
		if (null != input) {
			proc.setParameter("ppid", input);
			proc.execute();

			List<Object[]> postComments = proc.getResultList();
			for (Object[] dataUom : postComments) {
				UomListDto result = new UomListDto(dataUom);
				resultListUom.add(result.getUom());
			}

		}
		
		
		
		return resultListUom;
	}
	
	// Get Action List
    @SuppressWarnings("unchecked")
    public List<ActionListDto> findActionList(Map<String, Object> param) {
    	List<ActionListDto> listData 	= new ArrayList<>();
    	
    	StoredProcedureQuery proc = em.createNamedStoredProcedureQuery("show_action_list");
    	proc.setParameter("pDcvNo", param.get("pDcvNo").toString());
    	proc.setParameter("pUser", param.get("pUser").toString());
    	proc.setParameter("pBagian", param.get("pBagian").toString());
		proc.execute();
		
		List<Object[]> postComments = proc.getResultList();
		for(Object[] dataProc: postComments) {
			ActionListDto result = new ActionListDto(dataProc);
			listData.add(result);
		}
    	
    	return listData;
    }
    
    // Get Return Task WFRoute
    public WFRoute getReturnTask (Map<String, Object> param) {
    	WFRoute result = new WFRoute();
    	result = wfRouteRepo.findByNodeIdPilihan(param.get("nodeId").toString(), Integer.parseInt(param.get("pilihan").toString()));
    	return result;
    }
    
	public Map<String, Object> getPrivs(@RequestBody Map<String, Object> param){
		Map<String, Object> result = new HashMap<String, Object>();
		List<Privs> privsList = privsRepo.findByPrivCode("TCAPPV");
		
		Privs privs = privsRepo.findOne("TCAPPV");
		result.put("privs", privs);
		return result;
	}
	
	@SuppressWarnings("unchecked")
	public Map<String, Object> getPaymentSummary(String noDcv){
		Map<String, Object> result = new HashMap<String, Object>();
		
		StoredProcedureQuery proc = em.createNamedStoredProcedureQuery("payment_summary");
		proc.setParameter("pDcvNo", noDcv);
		proc.execute();
		
		List<Object[]> postComments = proc.getResultList();
		for(Object[] dataProc: postComments) {
			PaymentSummaryDto data = new PaymentSummaryDto(dataProc);
			result.put("dataPay", data);
		}
		return result;
	}
	
	public Map<String, Object> getUrlLinkReportSla(Map<String, Object> param) {
		Map<String, Object> result = new HashMap<String, Object>();
		List<LookupCode> dataLookUpList = new ArrayList<LookupCode>();
		String urlData 		= "";
		String urlResult 	= "";
//		String urlRegion 	= "";
//		String urlArea 		= "";
//		String urlLocation 	= "";
		String urlDistStart = "";
		String urlDistEnd 	= "";
		String urlJnsformula= "";
		String urlJnsPeriode= "";
		String urlPerdStart	= "";
//		String urlPerdEnd	= "";
		String urlLayout	= "";
//		String urlDevisi	= "";
//		String urlperdStartDist	= "";
		
//		String region 		= param.get("region") != null ? param.get("region").toString() : "";
//		String area 		= param.get("area") != null ? param.get("area").toString() : "";
//		String location 	= param.get("location") != null ? param.get("location").toString() : "";
		String distStart 	= param.get("distributorstart") != null ? param.get("distributorstart").toString() : "";
		String distEnd 		= param.get("distributorend") != null ? param.get("distributorend").toString() : "";
		String jenisFormula = param.get("jenisformula") != null ? param.get("jenisformula").toString() : "";
		String jenisPeriode = param.get("jenisperiode") != null ? param.get("jenisperiode").toString() : "";
		String periodeStart = param.get("periodestart") != null ? param.get("periodestart").toString() : "";
//		String periodeEnd 	= param.get("periodeend") != null ? param.get("periodeend").toString().substring(0, 7) : "";
		String layout	 	= param.get("layout") != null ? param.get("layout").toString() : "";
		String devisi	 	= param.get("devisi") != null ? param.get("devisi").toString() : "";
		String perdStartDist= param.get("periodestartdist") != null ? param.get("periodestartdist").toString() : "";
		//String perdEndDist	= param.get("periodeenddist") != null ? param.get("periodeenddist").toString() : "";
		
		dataLookUpList = lookupCodeRepo.findByTitle("REPORTSLA.EXT");
		
		if(null != dataLookUpList && dataLookUpList.size() > 0){
			LookupCode data = dataLookUpList.get(0);
			urlData 	= data.getValue();
			if(perdStartDist != "") {
				urlDistStart= urlData.replace("distStart", distStart);
				urlDistEnd 	= urlDistStart.replace("distEnd", distEnd);
				urlJnsformula = urlDistEnd.replace("jenisFormula", jenisFormula);
				urlJnsPeriode = urlJnsformula.replace("jenisPeriode", jenisPeriode);
				urlPerdStart  = urlJnsPeriode.replace("periodeStart", perdStartDist);
				urlLayout  = urlPerdStart.replace("layoutDcv", layout);
				if(!devisi.equals("NONFOOD") || !devisi.equals("FOOD")) {
					urlResult 	= urlLayout.replace("devisi", "All");
				}else {
					urlResult 	= urlLayout.replace("devisi", devisi);
				}
			}else {
				urlDistStart= urlData.replace("distStart", distStart);
				urlDistEnd = urlDistStart.replace("distEnd", distEnd);
				urlJnsformula = urlDistEnd.replace("jenisFormula", jenisFormula);
				urlJnsPeriode = urlJnsformula.replace("jenisPeriode", jenisPeriode);
				urlPerdStart = urlJnsPeriode.replace("periodeStart", periodeStart);
				urlLayout = urlPerdStart.replace("layoutDcv", layout);
				urlResult = urlLayout.replace("devisi", devisi);
			}
		}
		
		result.put("urlExt", urlResult);
		
		return result;
	}
	
	public Map<String, Object> DataRegionSla(){
		Map<String, Object> result 	= new HashMap<String, Object>();
		List<MasterCustomer> data = masterCustomerRepo.findAllRegion();		
		result.put("record", data);
		return result;
	}
	
	public Map<String, Object> DataAreaSla(String regionFullName){
		Map<String, Object> result	= new HashMap<String, Object>();
//		List<String> record			= new ArrayList<String>();
//		List<MasterCustomer> rCode	= masterCustomerRepo.findRegionCodeByRegionFullName(regionFullName);
//		for (MasterCustomer regionCode : rCode) {
//			List<MasterCustomer> data = masterCustomerRepo.findAreaByRegionCode(regionCode.getRegionCode());
//			for (MasterCustomer customer : data) {
//				record.add(customer.getAreaFullName());
//			}
//			break;
//		}
		List<MasterCustomer> data = masterCustomerRepo.findAllAreaByRegionFullName(regionFullName);
		result.put("record", data);
		return result;
	}
	
	public Map<String, Object> DataLocationSla(Map<String, Object> param){
		Map<String, Object> result	= new HashMap<String, Object>();
//		List<String> record			= new ArrayList<String>();
//		List<MasterCustomer> aCode	= masterCustomerRepo.findAreaCodeByAreaFullName(areaFullName);
//		for (MasterCustomer areaCode : aCode) {
//			List<MasterCustomer> data	= masterCustomerRepo.findLocationByAreaCode(areaCode.getAreaCode());
//			for (MasterCustomer customer : data) {
//				record.add(customer.getLocationFullName());
//			}
//			break;
//		}
		List<MasterCustomer> data = masterCustomerRepo.findAllLocationByRegionFullNameAndAreaFullName(param.get("region").toString(), param.get("area").toString());
		result.put("record", data);
		return result;
	}
	
	public Map<String, Object> DataDistributorSla(){
		Map<String, Object> result	= new HashMap<String, Object>();
		List<String> record			= new ArrayList<String>();
		List<MasterCustomer> data	= masterCustomerRepo.findAll();
		for (MasterCustomer customer : data) {
			record.add(customer.getCustCode());
		}
		result.put("record", record);
		return result;
	}
	
	@SuppressWarnings("unchecked")
	public List<PaymentEbsHistDto> getPaymentEbsHist(String noDcv){
		List<PaymentEbsHistDto> listPaymentEbsHist = new ArrayList<PaymentEbsHistDto>();
		logger.info("Execute stored procedure payment_ebs_hist");
		StoredProcedureQuery proc = em.createNamedStoredProcedureQuery("payment_ebs_hist");
		proc.setParameter("pDcvNo", noDcv);
		proc.execute();
		List<Object[]> postProc = proc.getResultList();
		for(Object[] data : postProc) {
			PaymentEbsHistDto result = new PaymentEbsHistDto(data);
			listPaymentEbsHist.add(result);
		}
		return listPaymentEbsHist;
	}
	
	@SuppressWarnings("unchecked")
    public List<DcvListDto> findDcvListByParamAfterAction(Map<String, Object> param) {
    	Date tgl1 = null;
		Date tgl2 = null;
		SimpleDateFormat inputFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
    	List<DcvListDto> listData = new ArrayList<>();
    	Map<String, String> jenisMap = (Map<String, String>) param.get("pJenis");
		
		if(param.get("from") != null) {
			tgl1 = new Date((long) param.get("pPeriode1")); 
			tgl2 = new Date((long) param.get("pPeriode2"));  
		} else {
			try {
				String string1 = param.get("pPeriode1").toString();
				String string2 = param.get("pPeriode2").toString();
				tgl1 = inputFormat.parse(string1);
				tgl2 = inputFormat.parse(string2);
			} catch (ParseException e) {
				e.printStackTrace();
			}
		}
		    	
    	/* Call @NamedStoredProcedureQuery at Model */
		StoredProcedureQuery proc = em.createNamedStoredProcedureQuery("DCV_TASK_LIST");
		/* IN params */
		proc.setParameter("pBagian", param.get("pBagian").toString());
		proc.setParameter("pUserName", param.get("pUserName").toString());
		proc.setParameter("pJenis", jenisMap.get("PARAM_NAME"));
		proc.setParameter("pPeriode1", tgl1);
		proc.setParameter("pPeriode2", tgl2);
		proc.execute();
		
		/* Ref_CURSOR OUT params */
    	List<Object[]> postComments = proc.getResultList();
    	for(Object[] dataDcv: postComments) {
    		DcvListDto hasil = new DcvListDto(dataDcv);
    		if(hasil.getNodecode() != null) {
    			WFNode wfNode = wFNodeRepo.findOne(hasil.getNodecode());
    			if(wfNode != null) {
    				hasil.setCurrentStep(wfNode.getDesc());
    			}
    		}
    		if(hasil.getNoDcv().equals(param.get("noDcv").toString())) {
    			listData.add(hasil);
    		}
    	}
    	return listData; 
    }
	
	// Get Header and Body after action
	@SuppressWarnings("unchecked")
    public Map<String, Object> getHeaderBodyListAfterAction(Map<String, Object> param) {
		Map<String, Object> returnAll = new HashMap<>();
		Map<String, Object> bodyList = new HashMap<>();
		List<DcvListDto> headerList = new ArrayList<>();
		Map<String, String> jenisMap = (Map<String, String>) param.get("pJenis");
		
		// Get list header
    	Date tgl1 = null;
		Date tgl2 = null;
		SimpleDateFormat inputFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
		
		if(param.get("from") != null) {
			tgl1 = new Date((long) param.get("pPeriode1")); 
			tgl2 = new Date((long) param.get("pPeriode2"));  
		} else {
			try {
				String string1 = param.get("pPeriode1").toString();
				String string2 = param.get("pPeriode2").toString();
				tgl1 = inputFormat.parse(string1);
				tgl2 = inputFormat.parse(string2);
			} catch (ParseException e) {
				e.printStackTrace();
			}
		}
		    	
		StoredProcedureQuery proc = em.createNamedStoredProcedureQuery("DCV_TASK_LIST");
		proc.setParameter("pBagian", param.get("pBagian").toString());
		proc.setParameter("pUserName", param.get("pUserName").toString());
		proc.setParameter("pJenis", jenisMap.get("PARAM_NAME"));
		proc.setParameter("pPeriode1", tgl1);
		proc.setParameter("pPeriode2", tgl2);
		proc.execute();
		
    	List<Object[]> postComments = proc.getResultList();
    	for(Object[] dataDcv: postComments) {
    		DcvListDto dcvList = new DcvListDto(dataDcv);
    		if(dcvList.getNodecode() != null) {
    			WFNode wfNode = wFNodeRepo.findOne(dcvList.getNodecode());
    			if(wfNode != null) {
    				dcvList.setCurrentStep(wfNode.getDesc());
    			}
    		}
    		if(dcvList.getNoDcv().equals(param.get("noDcv").toString())) {
    			headerList.add(dcvList);
    		}
    	}
    	
    	// Get list body
    	bodyList = getBodyFromDcvReq(param);
    	
    	returnAll.put("header",headerList);
    	returnAll.put("body",bodyList);
    	return  returnAll;
    }
	
	public Role getRole(String userRole) {
		logger.info("Find data table Role by user role");
		Role result = roleRepo.findByRoleCode(userRole);
		return result;
	}
	
	@SuppressWarnings("unchecked")
    public Map<String, Object> findUploadDocList(Map<String, Object> param) {
		Map<String, Object> result = new HashMap<String, Object>();
		List<UploadDocListDto> uploadDocList = new ArrayList<>();

    	// Upload Doc List
		StoredProcedureQuery proc = em.createNamedStoredProcedureQuery("upload_dok_list");
		proc.setParameter("pTaskId", param.get("pTaskId") == null || param.get("pTaskId").toString().equals("null") || param.get("pTaskId").toString().equals("") ? 0 : param.get("pTaskId"));
		proc.setParameter("pBagian", param.get("pBagian").toString());
		proc.execute();
		
    	List<Object[]> postComments = proc.getResultList();
    	for(Object[] dataDcv: postComments) {
    		UploadDocListDto resultDto = new UploadDocListDto(dataDcv);
    		uploadDocList.add(resultDto);
    	}
    	result.put("docList",uploadDocList);
    	
    	// Data Description Kwitansi
    	if(param.get("pBagian").toString().equals("Tax")) {
    		String desc = "";
    		
    		Long dcvhId = Long.valueOf(param.get("dcvhId").toString());
    		UiDcvRequest dataDcv = uiDcvRequestRepo.findOne(dcvhId);
    		
    		if(null != dataDcv){
    			if(null != dataDcv.getAppvValue()){    				
    				 desc = dataDcv.getKetrKwitansi() != null ? dataDcv.getKetrKwitansi() : "";
    			}
    		}
    		result.put("desc", desc);
    	}
    	return result; 
    }
	
	public List<WFNode> getWfNode(){
		List<WFNode> result = wFNodeRepo.findByType("Human");
		return result;
	}
	
	public Map<String, Object> updateWfNode (List<LinkedHashMap<String, Object>> param) {
		String nodeCode = "";
		BigDecimal sla1 = new BigDecimal(0);
		Map<String, Object> result = new HashMap<String, Object>();
    	
    	for (LinkedHashMap<String, Object> dataParam : param) {
    		nodeCode = dataParam.get("nodeCode").toString();
    		sla1 = dataParam.get("sla1") != null ? new BigDecimal(dataParam.get("sla1").toString()) : null;
        	try {
        		WFNode wfNode = new WFNode(); 
            	wfNode = wFNodeRepo.findByNodeCode(nodeCode);
            	wfNode.setSla1(sla1);
            	wFNodeRepo.save(wfNode);
			} catch (Exception e) {
				logger.error("Update WF NODE Failed : ",e);
			}
		}
    	result.put("result", "OK");
    	return result;  
    }
	
	public Map<String, Object> saveHoliday (Holiday param) {
		Map<String, Object> result = new HashMap<String, Object>();
    	try {
    		holidayRepo.save(param);
		} catch (Exception e) {
			logger.error("Save Holiday Failed : ",e);
		}
    	
    	result.put("result", "OK");
    	return result;  
    }
	
	public Map<String, Object> updateHoliday (Holiday param) {
		Map<String, Object> result = new HashMap<String, Object>();
    	try {
    		holidayRepo.findOne(param.getId());
    		holidayRepo.save(param);
		} catch (Exception e) {
			logger.error("Update Holiday Failed : ",e);
		}
    	
    	result.put("result", "OK");
    	return result;  
    }
	
	public Map<String, Object> deleteHoliday (Holiday param) {
		Map<String, Object> result = new HashMap<String, Object>();
    	try {
    		holidayRepo.findOne(param.getId());
    		holidayRepo.delete(param);
		} catch (Exception e) {
			logger.error("Delete Holiday Failed : ",e);
		}
    	
    	result.put("result", "OK");
    	return result;  
    }
	
	public List<Role> getDcvRole(){
		List<Role> result = new ArrayList<>();
		result = roleRepo.findAll();
		return result;
	}
	
	public Map<String, Object> saveRole (Role param) {
		Map<String, Object> result = new HashMap<String, Object>();
		Role role = roleRepo.findByRoleCode(param.getRoleCode());
		if(role == null) {
			try {
	    		roleRepo.save(param);
			} catch (Exception e) {
				logger.error("Save DCV Role Failed : ",e);
			}
			result.put("result", "OK");
		}else {
			result.put("result", "FAILED");
		}  	
    	
    	return result;  
    }
	
	public Map<String, Object> updateRole (Role param) {
		Map<String, Object> result = new HashMap<String, Object>(); 
		try {
			roleRepo.findByRoleCode(param.getRoleCode());
    		roleRepo.save(param);
		} catch (Exception e) {
			logger.error("Update DCV Role Failed : ",e);
		}
		result.put("result", "OK");    	
    	return result;  
    }
	
	public Map<String, Object> deleteRole (Role param) {
		Map<String, Object> result = new HashMap<String, Object>(); 
		try {
			roleRepo.findByRoleCode(param.getRoleCode());
    		roleRepo.delete(param);
		} catch (Exception e) {
			logger.error("Delete DCV Role Failed : ",e);
		}
		result.put("result", "OK");    	
    	return result;  
    }
	
}
