package fi.vm.sade.eperusteet.opintopolku;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.web.servlet.ServletComponentScan;

@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class })
@ServletComponentScan
public class EperusteetOpintopolkuApplication {
	public static void main(String[] args) {
		SpringApplication.run(EperusteetOpintopolkuApplication.class, args);
	}
}