package com.mycompany.myproject.dokumenrealisasi;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DokumenRealisasiService {

	@Autowired
	DokumenRealisasiRepo dokumenRealisasiRepo;
	
	public DokumenRealisasi getGRbyDcvhId(DokumenRealisasi doc) {
		
		List<DokumenRealisasi> dataDocInDb = dokumenRealisasiRepo.findByTahapanAndDcvhIdOrderByDocNo("GR",doc.getDcvhId());
		
		if(null != dataDocInDb && dataDocInDb.size() > 0){
			return dataDocInDb.get(0);
		}
		
		return null;
	}
}
