package com.mycompany.myproject.daftarpc;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.datatables.mapping.DataTablesInput;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.mycompany.myproject.lookupcode.LookupCode;
import com.mycompany.myproject.lookupcode.LookupCodeController;
import com.mycompany.myproject.lookupcode.LookupCodeService;
import com.mycompany.myproject.model.ResponeDatatable;
import com.mycompany.myproject.service.DataDCVServices;
import com.mycompany.myproject.service.dto.DaftarPcDTO;

import io.swagger.annotations.Api;

@RestController
@Api(description = "DCV Management API")
@RequestMapping("/daftarpc")
public class DaftarPcController {

	private static final Logger logger = LoggerFactory.getLogger(LookupCodeController.class);

	@Autowired
	private DaftarPcService daftarPcService;
	
	@Autowired
	private DataDCVServices dataDCVServices;
	
	@RequestMapping(value = "/getList", method = RequestMethod.POST ,produces = "application/json")
	public @ResponseBody ResponeDatatable getList(@Valid @RequestBody DaftarPcDTO input,HttpServletRequest request) {
		
		ResponeDatatable data =  new ResponeDatatable();
		
		List<DaftarPc>  list = new ArrayList<DaftarPc>();
		Integer countAllRows = 0;
		
		HttpSession session = request.getSession();
		String periode = "";
		String usermame = "";
	
		System.out.println("username :" + session.getAttribute("pur")+ " | "+ input.getUserName());
		System.out.println("periode :" + session.getAttribute("periode")+ " | "+ input.getPeriode());
		System.out.println("sesss :" + session.getAttribute("sessId"));
		
		if(session.getAttribute("periode") != null) {
			periode = (String)session.getAttribute("periode"); 
		}
		
		if(session.getAttribute("pur") != null) {
			usermame = (String)session.getAttribute("pur"); 
		}
		
		String sessId = "";
		
		if(periode.equals(input.getPeriode()) && usermame.equals(input.getUserName())) {
			
			System.out.println("Session New : No");
			sessId = (String)session.getAttribute("sessId");
		}else {
			sessId = daftarPcService.getSession(input.getUserName(),input.getPeriode());
			session.setAttribute("periode", input.getPeriode());
			session.setAttribute("pur", input.getUserName());
			session.setAttribute("sessId", sessId);
			System.out.println("Session New : Yes");
			
		}
		
		list = daftarPcService.findcAllExternal(input,sessId);
	 	countAllRows = daftarPcService.countAllRowsExternal(input,sessId);
		
		data.setData(list);
		data.setDraw(input.getDataSearch().getDraw());
		data.setRecordsFiltered(countAllRows);
		data.setRecordsTotal(countAllRows);
		
		return data;
	}
	
	@RequestMapping(value = "/report", method = RequestMethod.POST)
	public @ResponseBody Map<String, Object> report(@RequestBody Map<String, Object> param) {
		return dataDCVServices.getUrlLinkExternalReport(param);
	}
	
}
