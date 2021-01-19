package com.mycompany.myproject.dokumenrealisasi;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.annotations.Api;

@RestController
@Api(description = "DCV Management API")
@RequestMapping("/dokumenrealisasi")
public class DokumenRealisasiController {

	@Autowired
	DokumenRealisasiService dokumenRealisasiService;
	
	@RequestMapping(value = "/getGRbyDcvhId", method = RequestMethod.POST)
	public @ResponseBody DokumenRealisasi getGRbyDcvhId(@RequestBody DokumenRealisasi doc){
		return dokumenRealisasiService.getGRbyDcvhId(doc);
	}
}
