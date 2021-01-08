package com.mycompany.myproject.service;

import java.text.DateFormat;
import java.text.SimpleDateFormat;

import org.springframework.stereotype.Service;

@Service
public class DtoDataServices {

	DateFormat f1 = new SimpleDateFormat("dd/MM/yyyy");
	DateFormat f2 = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
}
