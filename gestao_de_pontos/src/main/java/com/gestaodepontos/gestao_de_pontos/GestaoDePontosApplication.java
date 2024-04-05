package com.gestaodepontos.gestao_de_pontos;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;

@SpringBootApplication
@OpenAPIDefinition(
	info = @io.swagger.v3.oas.annotations.info.Info(
		title = "Gestão de Pontos -  API",
		version = "1.0",
		description = "API para gerenciamento de pontos de funcionários."
	)

)
public class GestaoDePontosApplication {

	public static void main(String[] args) {
		SpringApplication.run(GestaoDePontosApplication.class, args);
	}

}
