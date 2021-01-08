package com.mycompany.myproject.persist.entity;


import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;

@Entity
@Table(name = "users")
public class User {

	/*@Id
	@GenericGenerator(name = "generator", strategy = "increment")
	@GeneratedValue(generator = "generator")
	@Column(name = "id", nullable = false)
	private Long id;*/

	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(name="user_id")
	private String userId;
	
	@Column(name="password")
	private String password;
	
	@Column(name="full_name")
	private String fullName;
	
	@Column(name="nip")
	private String nip;
	
	@Column(name="email")
	private String email;
	
	@Column(name="contact_number")
	private String contactNumber;
	
	@Column(name="mobile_number")
	private String mobileNumber;
	
	@Column(name="enabled", columnDefinition="boolean default false")
	private Boolean enabled;
	
	@Column(name="account_expired", columnDefinition="boolean default false")
	private Boolean accountExpired;
	
	@Column(name="account_locked", columnDefinition="boolean default false")
	private Boolean accountLocked;
	
	@Column(name="credential_expired", columnDefinition="boolean default false")
	private Boolean credentialExpired;
	
	@Column(name="force_change_password", columnDefinition="boolean default true")
	private Boolean forceChangePassword;
	
	@Column(name="account_inactive", columnDefinition="boolean default true")
	private Boolean accountInactive;
	
	@Column(name="is_admin", columnDefinition="boolean default false")
	private Boolean isAdmin;
	
	@Column(name="deleted", columnDefinition="boolean default false")
	private Boolean deleted;
	
	@Column(name="is_login", columnDefinition="boolean default false")
	private Boolean isLogin = false;
	
	@Column(name="additional_note")
	private String additionalNote;
	
	@Column(name="last_notification_id")
	private Long lastNotificationId;
	
	@Column(name="retry_password_count", columnDefinition="int4 default 0")
	private Integer retryPasswordCount;
	
	@Column(name="language", columnDefinition="default en")
	private String language;

	@Column(name="last_login")
	private Date lastLogin;

	@Column(name="last_logout")
	private Date lastLogout;

	@Column(name="credential_modified")
	private Date credentialModified;

	@Column(name = "company_id")
	private String companyId;

	@Column(name = "group_id")
	private Long groupId;

	@Column(name = "work_unit_id")
	private Integer workUnitId;
	
	@Transient
	private boolean selected;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getFullName() {
		return fullName;
	}

	public void setFullName(String fullName) {
		this.fullName = fullName;
	}

	public String getNip() {
		return nip;
	}

	public void setNip(String nip) {
		this.nip = nip;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getContactNumber() {
		return contactNumber;
	}

	public void setContactNumber(String contactNumber) {
		this.contactNumber = contactNumber;
	}

	public String getMobileNumber() {
		return mobileNumber;
	}

	public void setMobileNumber(String mobileNumber) {
		this.mobileNumber = mobileNumber;
	}

	public Boolean getEnabled() {
		return enabled;
	}

	public void setEnabled(Boolean enabled) {
		this.enabled = enabled;
	}

	public Boolean getAccountExpired() {
		return accountExpired;
	}

	public void setAccountExpired(Boolean accountExpired) {
		this.accountExpired = accountExpired;
	}

	public Boolean getAccountLocked() {
		return accountLocked;
	}

	public void setAccountLocked(Boolean accountLocked) {
		this.accountLocked = accountLocked;
	}

	public Boolean getCredentialExpired() {
		return credentialExpired;
	}

	public void setCredentialExpired(Boolean credentialExpired) {
		this.credentialExpired = credentialExpired;
	}

	public Boolean getForceChangePassword() {
		return forceChangePassword;
	}

	public void setForceChangePassword(Boolean forceChangePassword) {
		this.forceChangePassword = forceChangePassword;
	}

	public Boolean getAccountInactive() {
		return accountInactive;
	}

	public void setAccountInactive(Boolean accountInactive) {
		this.accountInactive = accountInactive;
	}

	public Boolean getIsAdmin() {
		return isAdmin;
	}

	public void setIsAdmin(Boolean isAdmin) {
		this.isAdmin = isAdmin;
	}

	public Boolean getDeleted() {
		return deleted;
	}

	public void setDeleted(Boolean deleted) {
		this.deleted = deleted;
	}

	public Boolean getIsLogin() {
		return isLogin;
	}

	public void setIsLogin(Boolean isLogin) {
		this.isLogin = isLogin;
	}

	public String getAdditionalNote() {
		return additionalNote;
	}

	public void setAdditionalNote(String additionalNote) {
		this.additionalNote = additionalNote;
	}

	public Long getLastNotificationId() {
		return lastNotificationId;
	}

	public void setLastNotificationId(Long lastNotificationId) {
		this.lastNotificationId = lastNotificationId;
	}

	public Integer getRetryPasswordCount() {
		return retryPasswordCount;
	}

	public void setRetryPasswordCount(Integer retryPasswordCount) {
		this.retryPasswordCount = retryPasswordCount;
	}

	public String getLanguage() {
		return language;
	}

	public void setLanguage(String language) {
		this.language = language;
	}

	public Date getLastLogin() {
		return lastLogin;
	}

	public void setLastLogin(Date lastLogin) {
		this.lastLogin = lastLogin;
	}

	public Date getLastLogout() {
		return lastLogout;
	}

	public void setLastLogout(Date lastLogout) {
		this.lastLogout = lastLogout;
	}

	public Date getCredentialModified() {
		return credentialModified;
	}

	public void setCredentialModified(Date credentialModified) {
		this.credentialModified = credentialModified;
	}

	public String getCompanyId() {
		return companyId;
	}

	public void setCompanyId(String companyId) {
		this.companyId = companyId;
	}

	public Long getGroupId() {
		return groupId;
	}

	public void setGroupId(Long groupId) {
		this.groupId = groupId;
	}

	public Integer getWorkUnitId() {
		return workUnitId;
	}

	public void setWorkUnitId(Integer workUnitId) {
		this.workUnitId = workUnitId;
	}

	public boolean isSelected() {
		return selected;
	}

	public void setSelected(boolean selected) {
		this.selected = selected;
	}
	
	


}
