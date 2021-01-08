package com.mycompany.myproject.service.dto;

public class UploadDocListDto {
	private String docCode;
	private String docDesc;
	
	public UploadDocListDto() {}
	public UploadDocListDto(Object[] data) {
		super();
		
		this.docCode = data[0] != null ? (String) data[0] : "";
		this.docDesc = data[1] != null ? (String) data[1] : "";
	}
	public String getDocCode() {
		return docCode;
	}
	public void setDocCode(String docCode) {
		this.docCode = docCode;
	}
	public String getDocDesc() {
		return docDesc;
	}
	public void setDocDesc(String docDesc) {
		this.docDesc = docDesc;
	}

}
