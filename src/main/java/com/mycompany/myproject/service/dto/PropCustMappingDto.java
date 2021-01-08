package com.mycompany.myproject.service.dto;

import java.math.BigDecimal;

import org.dozer.Mapping;

public class PropCustMappingDto {
	
	@Mapping("proposal_id")
	private BigDecimal proposalId;
	
	@Mapping("cust_code")
	private String custCode;
	
	@Mapping("pc_no")
	private String noPC;
	
	public PropCustMappingDto() {}
	
	public PropCustMappingDto(Object[] data) {
		super();
		
		this.proposalId = (BigDecimal) data[0];
		this.custCode	= (String) data[1];
		this.noPC		= (String) data[2];
	}
	

	public BigDecimal getProposalId() {
		return proposalId;
	}

	public void setProposalId(BigDecimal proposalId) {
		this.proposalId = proposalId;
	}

	public String getCustCode() {
		return custCode;
	}

	public void setCustCode(String custCode) {
		this.custCode = custCode;
	}

	public String getNoPC() {
		return noPC;
	}

	public void setNoPC(String noPC) {
		this.noPC = noPC;
	}
}
