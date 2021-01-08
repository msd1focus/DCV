package com.mycompany.myproject.service.dto;

import java.math.BigDecimal;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.dozer.Mapping;

public class PaymentSummaryDto {
	@Mapping("total_dcv")
	private BigDecimal totalDcv;
	
	@Mapping("total_payment")
	private BigDecimal totalPayment;
	
	@Mapping("nilai_sisa")
	private BigDecimal nilaiSisa;
	
	public PaymentSummaryDto() {}
	public PaymentSummaryDto(Object[] data) {
		super();
		this.totalDcv = data[0] != null ? new BigDecimal(data[0].toString()) : null;
		this.totalPayment = data[1] != null ? new BigDecimal(data[1].toString()) : null;
		this.nilaiSisa = data[2] != null ? new BigDecimal(data[2].toString()) : null;
	}
	public BigDecimal getTotalDcv() {
		return totalDcv;
	}
	public void setTotalDcv(BigDecimal totalDcv) {
		this.totalDcv = totalDcv;
	}
	public BigDecimal getTotalPayment() {
		return totalPayment;
	}
	public void setTotalPayment(BigDecimal totalPayment) {
		this.totalPayment = totalPayment;
	}
	public BigDecimal getNilaiSisa() {
		return nilaiSisa;
	}
	public void setNilaiSisa(BigDecimal nilaiSisa) {
		this.nilaiSisa = nilaiSisa;
	}	
}