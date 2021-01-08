package com.mycompany.myproject.persist.entity;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.NamedStoredProcedureQueries;
import javax.persistence.NamedStoredProcedureQuery;
import javax.persistence.ParameterMode;
import javax.persistence.StoredProcedureParameter;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;

@Entity
@NamedStoredProcedureQueries({
	@NamedStoredProcedureQuery(name = "collect_libur", procedureName = "dcv_pkg.collect_libur",
			resultClasses = Holiday.class, parameters = {
					@StoredProcedureParameter(mode = ParameterMode.REF_CURSOR, type = void.class)
			}
	)
})
@Table(name = "HOLIDAY")
public class Holiday {

	private static final long serialVersionUID = 1L;
	
	@Id
	@GenericGenerator(name = "DCV_SEQ", strategy = "increment")
	@GeneratedValue(generator = "DCV_SEQ")
	@Column(name = "ID", nullable = false)
	private Long id;
	
	@Column(name="TGL_LIBUR")
	private Date tglLibur;
	
	@Column(name="DESCRIPTION")
	private String keterangan;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Date getTglLibur() {
		return tglLibur;
	}

	public void setTglLibur(Date tglLibur) {
		this.tglLibur = tglLibur;
	}

	public String getKeterangan() {
		return keterangan;
	}

	public void setKeterangan(String keterangan) {
		this.keterangan = keterangan;
	}
}
