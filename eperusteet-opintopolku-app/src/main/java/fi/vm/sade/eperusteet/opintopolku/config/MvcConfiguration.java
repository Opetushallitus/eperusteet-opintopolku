package fi.vm.sade.eperusteet.opintopolku.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.PathMatchConfigurer;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class MvcConfiguration implements WebMvcConfigurer {

//    @Override
//    public void configurePathMatch(PathMatchConfigurer matcher) {
//        matcher.setUseRegisteredSuffixPatternMatch(true);
//    }

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
//        registry.addViewController("/testi/").setViewName("forward:/testi/index.html");
//        registry.addRedirectViewController("/testi", "/testi/");

//        registry.addViewController("").setViewName("forward:/index.html");
//        registry.addRedirectViewController("", "/");

//        registry.addRedirectViewController("/swagger", "/swagger/index.html");
    }
}