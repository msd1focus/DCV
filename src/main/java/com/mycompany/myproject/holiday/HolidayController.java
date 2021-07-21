package com.mycompany.myproject.holiday;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
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
	
	@RequestMapping(value = "/getYesterday", method = RequestMethod.GET)
	public @ResponseBody Holiday getYesterday() throws ParseException {
		
		Date date = new Date();

		Date yesterday = this.cekYesterday(date);
		
		DateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy");  
        String strDate = dateFormat.format(yesterday);  
		
        Holiday holiday =  new Holiday();
        holiday.setKeterangan(strDate);
		return holiday;
	}
	
	public Boolean cekHoliday(Date date) {
		
		List<Holiday> holidayList = holidayService.getListHoliday();
        
        for(Holiday data:holidayList) {
        	
        	if(data.getTglLibur().compareTo(date) == 0) {
        		return true;
        	}
        }
        return false;
		
	}
	
	public Date cekYesterday(Date date) {
		
		Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        cal.add(Calendar.DATE, Integer.valueOf(-1));

        Date yesterday = cal.getTime();
		
        Integer day = yesterday.getDay();
        
        if(day != 6 && day != 0) {
        	Boolean holidayStaus = this.cekHoliday(yesterday);
        	
        	if(holidayStaus) {
        		return this.cekYesterday(yesterday);
        	}else {
        		return yesterday;
        	}
        }else {
        	return this.cekYesterday(yesterday);
        }

		
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
