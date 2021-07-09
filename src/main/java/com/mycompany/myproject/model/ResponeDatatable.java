package com.mycompany.myproject.model;

import java.util.List;

import org.apache.poi.ss.formula.functions.T;

import com.mycompany.myproject.daftarpc.DaftarPc;

public class ResponeDatatable {
	
	private Integer draw;
	
	private Integer recordsTotal;
	
	private Integer recordsFiltered;

    private List<DaftarPc> data;

    private Error error;

	public Integer getDraw() {
		return draw;
	}

	public void setDraw(Integer draw) {
		this.draw = draw;
	}

	public Integer getRecordsTotal() {
		return recordsTotal;
	}

	public void setRecordsTotal(Integer recordsTotal) {
		this.recordsTotal = recordsTotal;
	}

	public Integer getRecordsFiltered() {
		return recordsFiltered;
	}

	public void setRecordsFiltered(Integer recordsFiltered) {
		this.recordsFiltered = recordsFiltered;
	}

	public List<DaftarPc> getData() {
		return data;
	}

	public void setData(List<DaftarPc> list) {
		this.data = list;
	}

	public Error getError() {
		return error;
	}

	public void setError(Error error) {
		this.error = error;
	}
    
    
}
