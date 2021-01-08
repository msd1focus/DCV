package com.mycompany.myproject.service.dto;

import java.math.BigDecimal;

import org.dozer.Mapping;

public class UomListDto {
	
	@Mapping("PROMO_PRODUK_ID" )
	private BigDecimal promoProdukId;
	
	@Mapping("UOM" )
	private String uom;
	
	public UomListDto () {}
	
	public UomListDto (Object[] data) {
		this.promoProdukId = data[0] != null ? (BigDecimal) data[0] : null;
		this.uom = data[1] != null ? (String) data[1] : "";
	}

	public BigDecimal getPromoProdukId() {
		return promoProdukId;
	}

	public void setPromoProdukId(BigDecimal promoProdukId) {
		this.promoProdukId = promoProdukId;
	}

	public String getUom() {
		return uom;
	}

	public void setUom(String uom) {
		this.uom = uom;
	};
	
	
	
	
	

}
