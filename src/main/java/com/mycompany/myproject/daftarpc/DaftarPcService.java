package com.mycompany.myproject.daftarpc;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.datatables.mapping.DataTablesInput;
import org.springframework.data.jpa.datatables.parameter.ColumnParameter;

import javax.persistence.Query;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mycompany.myproject.holiday.HolidayRepo;
import com.mycompany.myproject.service.dto.DcvListDto;
import com.mycompany.myproject.service.dto.DaftarPcDTO;
import com.mycompany.myproject.wfnode.WFNode;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.StoredProcedureQuery;

@Service
@Transactional
public class DaftarPcService {

	@PersistenceContext
	private EntityManager em;
	
	public String cekField (String str) {
		
		StringBuilder sb = new StringBuilder(str);
		
		for (int i = 0; i < str.length(); i++){
		    char c = str.charAt(i);        
		    if(Character.isUpperCase(c)) {
		    	System.out.println(c);
		    	
		        sb.insert(i, "_");
		        str= sb.toString();
		        str = str.toLowerCase();
		    }
		}
		return str;
		
	}
	
	
	public  List<DaftarPc> findcAllExternal(DaftarPcDTO input,String sessionId){
		
		Integer length = input.getDataSearch().getLength();
		Integer start = input.getDataSearch().getStart();
		Integer end = start+length;
		
		//Cek Filter Datatable
		String search = " AND ( ";
		
		String OrderBy = "";
		
		Integer index = 0;
		for(ColumnParameter data: input.getDataSearch().getColumns()) {
			if(data != null) {
				if (!data.getSearch().getValue().equals("")) {
					
					if (!data.getSearch().getValue().equals("")) {
						
						if(search.equals(" AND ( ")){
							
							if(data.getData().equals("distributedDate") || data.getData().equals("periodeStart") ||data.getData().equals("periodeEnd")) {
								search += "  to_char(pl."+data.getData()+", 'dd-mm-yyyy') LIKE :"+data.getData();
							}else {
								search += "  lower(cast(pl."+data.getData() +" as string)) LIKE :"+data.getData();
							}
							
						}else {
							if(data.getData().equals("distributedDate") || data.getData().equals("periodeStart") ||data.getData().equals("periodeEnd")) {
								search += " and  to_char(pl."+data.getData() +", 'dd-mm-yyyy') LIKE :"+data.getData();
							}else {
								search += " and  lower(cast(pl."+data.getData() +" as string)) LIKE :"+data.getData();
							}
						}
						
					}
					
				}
				
				if(input.getDataSearch().getOrder().get(0).getColumn() == index) {
					OrderBy = "order by pl." + data.getData() +" "+ input.getDataSearch().getOrder().get(0).getDir();
				}
				
			}			
		   
		   index++;
			
		}
		
		
		search += " ) ";
		
		String queryStr = "";
		queryStr += "SELECT pl FROM DaftarPc pl where pl.sessionId = :sessionId ";
		
		if(!search.equals(" AND (  ) ")){
			queryStr +=search;
		}
		
		if(!OrderBy.equals("")){
			queryStr +=OrderBy;
		}
		
		Query query = em.createQuery(queryStr);
		query.setParameter("sessionId", sessionId);	
		
		for(ColumnParameter data: input.getDataSearch().getColumns()) {
			
			if (!data.getSearch().getValue().equals("")) {
				query.setParameter(data.getData(),"%"+data.getSearch().getValue().toLowerCase()+"%");	
			}	
		}
		query.setFirstResult(start);
		query.setMaxResults(length);
		
		List<DaftarPc> list = query.getResultList();
        return list;
	}
	
	public  Integer countAllRowsExternal(DaftarPcDTO input,String sessionId){
		
		Integer length = input.getDataSearch().getLength();
		Integer start = input.getDataSearch().getStart();
		Integer end = start+length;
		
		//Cek Filter Datatable
		String search = " AND ( ";
		
		for(ColumnParameter data: input.getDataSearch().getColumns()) {
			if(data != null) {
				if (!data.getSearch().getValue().equals("")) {
					
					if(search.equals(" AND ( ")){
						
						if(data.getData().equals("distributedDate") || data.getData().equals("periodeStart") ||data.getData().equals("periodeEnd")) {
							search += "  to_char(pl."+data.getData()+", 'dd-mm-yyyy') LIKE :"+data.getData();
						}else {
							search += "  lower(cast(pl."+data.getData() +" as string)) LIKE :"+data.getData();
						}
						
					}else {
						if(data.getData().equals("distributedDate") || data.getData().equals("periodeStart") ||data.getData().equals("periodeEnd")) {
							search += " and  to_char(pl."+data.getData() +", 'dd-mm-yyyy') LIKE :"+data.getData();
						}else {
							search += " and  lower(cast(pl."+data.getData() +" as string)) LIKE :"+data.getData();
						}
					}
					
				}
			}
		}
		
		search += " ) ";
		
		String queryStr = "";
		
		//Jika User external
		queryStr += "SELECT COUNT(pl) FROM DaftarPc pl where pl.sessionId = :sessionId ";
		
		
		if(!search.equals(" AND (  ) ")){
			queryStr +=search;
		}
		
		Query query = em.createQuery(queryStr);
		query.setParameter("sessionId", sessionId);	
		
		for(ColumnParameter data: input.getDataSearch().getColumns()) {
			
			if (!data.getSearch().getValue().equals("")) {
				query.setParameter(data.getData(), "%"+data.getSearch().getValue().toLowerCase()+"%");	
			}	
		}

		Object resultQuery = query.getSingleResult();
		if (resultQuery != null) {
			Long a = (Long) resultQuery;
			 return a.intValue();
		}
		return 0;
	}
	
	public String getSession(String username,String periode) {
		
		StoredProcedureQuery proc = em.createNamedStoredProcedureQuery("populate_pc_list");
		
		proc.setParameter("username", username);
		proc.setParameter("periode", Integer.parseInt(periode));
		proc.execute();
		
		/* OUT params */
		String contextId = (String) proc.getOutputParameterValue("contextId");
		
		return contextId;
	}
	
	
}
