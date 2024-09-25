package fi.vm.sade.eperusteet.opintopolku.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class MvcConfiguration implements WebMvcConfigurer {

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
//        registry.addRedirectViewController("/testi", "/testi/index.html");
        registry.addViewController("/testi").setViewName("forward:/testi/index.html");
//        registry.addRedirectViewController("/testi", "/testi/");
    }

}