package com.mycompany.myproject.wftask;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.NamedStoredProcedureQueries;
import javax.persistence.NamedStoredProcedureQuery;
import javax.persistence.ParameterMode;
import javax.persistence.StoredProcedureParameter;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.hibernate.annotations.GenericGenerator;

@Entity
@NamedStoredProcedureQueries({
	@NamedStoredProcedureQuery(
			name = "post_action", procedureName = "wf_pkg.post_action",
			parameters = {
					@StoredProcedureParameter(mode = ParameterMode.IN, name = "pTaskId", type = Integer.class),
					@StoredProcedureParameter(mode = ParameterMode.IN, name = "pActionId", type = Integer.class),
					@StoredProcedureParameter(mode = ParameterMode.IN, name = "pUser", type = String.class),
					@StoredProcedureParameter(mode = ParameterMode.IN, name = "pNote", type = String.class),
					@StoredProcedureParameter(mode = ParameterMode.OUT, name = "pResponseCode", type = Integer.class),
					@StoredProcedureParameter(mode = ParameterMode.OUT, name = "pResponseMsg", type = String.class)
			}
	),
	@NamedStoredProcedureQuery(
			name = "qry_open_batch_document", procedureName = "wf_pkg.qry_open_batch_document",
			parameters = {
					@StoredProcedureParameter(mode = ParameterMode.IN, name = "pBagian", type = String.class),
					@StoredProcedureParameter(mode = ParameterMode.IN, name = "pNodeCode", type = String.class),
					@StoredProcedureParameter(mode = ParameterMode.REF_CURSOR, name = "tList", type = Class.class)
			}
	),
	@NamedStoredProcedureQuery(
			name = "qry_hist_batch_document", procedureName = "wf_pkg.qry_hist_batch_document",
			parameters = {
					@StoredProcedureParameter(mode = ParameterMode.IN, name = "pBagian", type = String.class),
					@StoredProcedureParameter(mode = ParameterMode.IN, name = "tgl", type = Date.class),
					@StoredProcedureParameter(mode = ParameterMode.IN, name = "pNodeCode", type = String.class),
					@StoredProcedureParameter(mode = ParameterMode.IN, name = "pilihan", type = Integer.class),
					@StoredProcedureParameter(mode = ParameterMode.REF_CURSOR, name = "tList", type = Class.class)
			}
	),
})
@Table(name = "WF_TASK")
public class WFTask {

	private static final long serialVersionUID = 1L;
	
	@Id
	@GenericGenerator(name = "WFTask_SEQ", strategy = "increment")
	@GeneratedValue(generator = "WFTask_SEQ")
	@Column(name = "ID", nullable = false)
	private Long id;
	
	@Column(name = "DCVH_ID", nullable = false)
	private Long dcvhId;
	
	@Column(name = "NO_DCV")
	private String noDCV;
	
	@Column(name = "TASK_TYPE")
	private String taskType;
	
	@Column(name = "ASSIGN_TIME")
	private Date assignTime;
	
	@Column(name = "BAGIAN")
	private String bagian;
	
	@Column(name = "PROGRESS_STATUS")
	private String progressStatus;
	
	@Column(name = "NODECODE")
	private String nodeCode;
	
	@Column(name = "PREV_TASK")
	private Long prevTask;
	
	@Column(name = "TAHAPAN")
	private String tahapan;
	
	@Column(name = "DECISION")
	private Integer decision;
	
	@Column(name = "EXECSCRIPT")
	private String execscript;
	
	@Column(name = "NEXT_TASK")
	private Long nextTask;
	
	@Column(name = "NEXT_NODE")
	private String nextNode;
	
	@Column(name = "NOTE")
	private String note;
	
	@Column(name = "PRIME_ROUTE")
	private String primeRoute;
	
	@Column(name = "RETURN_TASK")
	private String returnTask;
	
	@Column(name = "PROCESS_BY")
	private String processBy;
	
	@Column(name = "PROCESS_TIME")
	private Date processTime;
	
	@Column(name = "SLA")
	private Integer sla;
	
	@Column(name = "ROLLBACK_TASK")
	private String rollbackTask;
	
	@Column(name = "ROLLBACK_ID")
	private Long rollbackId;
	
	@Column(name = "BEBAN_SLA")
	private String bebanSla;
	
	@Column(name = "SORTING_TAG")
	private String sortingTag;
	
	@Column(name = "TARGET_SELESAI")
	private Date targetSelesai;
	
	@Transient
	private Integer index;
	@Transient
	private String hari;
	@Transient
	private String tanggal;
	@Transient
	private String waktu;
	@Transient
	private Integer jmlHari;
	@Transient
	private Integer jmlJam;
	@Transient
	private Integer jmlMenit;
	@Transient
	private Integer jmlDetik;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getDcvhId() {
		return dcvhId;
	}

	public void setDcvhId(Long dcvhId) {
		this.dcvhId = dcvhId;
	}

	public String getNoDCV() {
		return noDCV;
	}

	public void setNoDCV(String noDCV) {
		this.noDCV = noDCV;
	}

	public String getTaskType() {
		return taskType;
	}

	public void setTaskType(String taskType) {
		this.taskType = taskType;
	}

	public Date getAssignTime() {
		return assignTime;
	}

	public void setAssignTime(Date assignTime) {
		this.assignTime = assignTime;
	}

	public String getBagian() {
		return bagian;
	}

	public void setBagian(String bagian) {
		this.bagian = bagian;
	}

	public String getProgressStatus() {
		return progressStatus;
	}

	public void setProgressStatus(String progressStatus) {
		this.progressStatus = progressStatus;
	}

	public String getNodeCode() {
		return nodeCode;
	}

	public void setNodeCode(String nodeCode) {
		this.nodeCode = nodeCode;
	}

	public Long getPrevTask() {
		return prevTask;
	}

	public void setPrevTask(Long prevTask) {
		this.prevTask = prevTask;
	}

	public String getTahapan() {
		return tahapan;
	}

	public void setTahapan(String tahapan) {
		this.tahapan = tahapan;
	}

	public Integer getDecision() {
		return decision;
	}

	public void setDecision(Integer decision) {
		this.decision = decision;
	}

	public String getExecscript() {
		return execscript;
	}

	public void setExecscript(String execscript) {
		this.execscript = execscript;
	}

	public Long getNextTask() {
		return nextTask;
	}

	public void setNextTask(Long nextTask) {
		this.nextTask = nextTask;
	}

	public String getNextNode() {
		return nextNode;
	}

	public void setNextNode(String nextNode) {
		this.nextNode = nextNode;
	}

	public String getNote() {
		return note;
	}

	public void setNote(String note) {
		this.note = note;
	}

	public String getPrimeRoute() {
		return primeRoute;
	}

	public void setPrimeRoute(String primeRoute) {
		this.primeRoute = primeRoute;
	}

	public String getReturnTask() {
		return returnTask;
	}

	public void setReturnTask(String returnTask) {
		this.returnTask = returnTask;
	}

	public String getProcessBy() {
		return processBy;
	}

	public void setProcessBy(String processBy) {
		this.processBy = processBy;
	}

	public Date getProcessTime() {
		return processTime;
	}

	public void setProcessTime(Date processTime) {
		this.processTime = processTime;
	}

	public Integer getSla() {
		return sla;
	}

	public void setSla(Integer sla) {
		this.sla = sla;
	}

	public String getRollbackTask() {
		return rollbackTask;
	}

	public void setRollbackTask(String rollbackTask) {
		this.rollbackTask = rollbackTask;
	}

	public Long getRollbackId() {
		return rollbackId;
	}

	public void setRollbackId(Long rollbackId) {
		this.rollbackId = rollbackId;
	}

	public String getBebanSla() {
		return bebanSla;
	}

	public void setBebanSla(String bebanSla) {
		this.bebanSla = bebanSla;
	}

	public String getSortingTag() {
		return sortingTag;
	}

	public void setSortingTag(String sortingTag) {
		this.sortingTag = sortingTag;
	}

	public Date getTargetSelesai() {
		return targetSelesai;
	}

	public void setTargetSelesai(Date targetSelesai) {
		this.targetSelesai = targetSelesai;
	}

	public String getHari() {
		return hari;
	}

	public void setHari(String hari) {
		this.hari = hari;
	}

	public String getTanggal() {
		return tanggal;
	}

	public void setTanggal(String tanggal) {
		this.tanggal = tanggal;
	}

	public String getWaktu() {
		return waktu;
	}

	public void setWaktu(String waktu) {
		this.waktu = waktu;
	}

	public Integer getIndex() {
		return index;
	}

	public void setIndex(Integer index) {
		this.index = index;
	}

	public Integer getJmlHari() {
		return jmlHari;
	}

	public void setJmlHari(Integer jmlHari) {
		this.jmlHari = jmlHari;
	}

	public Integer getJmlJam() {
		return jmlJam;
	}

	public void setJmlJam(Integer jmlJam) {
		this.jmlJam = jmlJam;
	}

	public Integer getJmlMenit() {
		return jmlMenit;
	}

	public void setJmlMenit(Integer jmlMenit) {
		this.jmlMenit = jmlMenit;
	}

	public Integer getJmlDetik() {
		return jmlDetik;
	}

	public void setJmlDetik(Integer jmlDetik) {
		this.jmlDetik = jmlDetik;
	}
}
