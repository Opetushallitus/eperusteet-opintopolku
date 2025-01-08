package fi.vm.sade.eperusteet.opintopolku;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration;
import org.springframework.boot.autoconfigure.web.servlet.error.ErrorMvcAutoConfiguration;
import org.springframework.boot.web.servlet.ServletComponentScan;

@SpringBootApplication
@ServletComponentScan
public class EperusteetOpintopolkuApplication {
	public static void main(String[] args) {
		SpringApplication.run(EperusteetOpintopolkuApplication.class, args);
	}
}