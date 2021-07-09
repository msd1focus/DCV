package com.mycompany.myproject.service.dto;

import java.math.BigDecimal;

import org.springframework.data.jpa.datatables.mapping.DataTablesInput;

public class DaftarPcDTO {

	private String jenisPc;
	private DataTablesInput dataSearch;
	private String userName;
	private String userType;
	private String periode;
	
	public String getJenisPc() {
		return jenisPc;
	}
	public void setJenisPc(String jenisPc) {
		this.jenisPc = jenisPc;
	}
	public DataTablesInput getDataSearch() {
		return dataSearch;
	}
	public void setDataSearch(DataTablesInput dataSearch) {
		this.dataSearch = dataSearch;
	}
	public String getUserName() {
		return userName;
	}
	public void setUserName(String userName) {
		this.userName = userName;
	}
	public String getUserType() {
		return userType;
	}
	public void setUserType(String userType) {
		this.userType = userType;
	}
	public String getPeriode() {
		return periode;
	}
	public void setPeriode(String periode) {
		this.periode = periode;
	}
	
}
