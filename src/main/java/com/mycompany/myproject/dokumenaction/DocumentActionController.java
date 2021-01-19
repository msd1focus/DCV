package com.mycompany.myproject.dokumenaction;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.annotations.Api;

@RestController
@Api(description = "DCV Management API")
@RequestMapping("/dokumenaction")
public class DocumentActionController {

	@Autowired
	DocumentActionService documentActionService;
	
	@RequestMapping(value = "/getDocumentAction", method = RequestMethod.POST)
	public @ResponseBody List<DocumentAction> getDocumentAction(@RequestBody String bagian) {
		return documentActionService.getDocumentAction(bagian);
	}
	
	@RequestMapping(value = "/getListActionDocBatch", method = RequestMethod.POST)
	public @ResponseBody List<DocumentAction> getListActionDocBatch(@RequestBody String bagian) {
		return documentActionService.getListActionDocBatch(bagian);
	}
}
