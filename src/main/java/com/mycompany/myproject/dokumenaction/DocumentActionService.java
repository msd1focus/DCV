package com.mycompany.myproject.dokumenaction;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DocumentActionService {
	
	@Autowired
	DocumentActionRepo documentActionRepo;
	
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
	
	public List<DocumentAction> getListActionDocBatch(String bagian) {
		List<DocumentAction> dataListAction = new ArrayList<DocumentAction>();
		
		dataListAction = documentActionRepo.findByBagian(bagian);
		
	
		return dataListAction;
	}
}
