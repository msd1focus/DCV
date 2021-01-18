package com.mycompany.myproject.holiday;

import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;



import io.swagger.annotations.Api;

@RestController
@Api(description = "DCV Management API")
@RequestMapping("/holiday")
public class HolidayController {

	private static final Logger logger = LoggerFactory.getLogger(HolidayController.class);

	@Autowired
	private HolidayService holidayService;

	/*Service 
	 * Hari Libur DCV*/
	@RequestMapping(value = "/getList", method = RequestMethod.GET)
	public @ResponseBody List<Holiday> getListHoliday() {
		return holidayService.getListHoliday();
	}
	
	@RequestMapping(value = "/save", method = RequestMethod.POST)
	public @ResponseBody Map<String, Object> saveHoliday(@RequestBody Holiday param) {
		return holidayService.saveHoliday(param);
	}
	
	@RequestMapping(value = "/update", method = RequestMethod.POST)
	public @ResponseBody Map<String, Object> updateHoliday(@RequestBody Holiday param) {
		return holidayService.updateHoliday(param);
	}
	
	@RequestMapping(value = "/delete", method = RequestMethod.POST)
	public @ResponseBody Map<String, Object> deleteHoliday(@RequestBody Holiday param) {
		return holidayService.deleteHoliday(param);
	}
}
