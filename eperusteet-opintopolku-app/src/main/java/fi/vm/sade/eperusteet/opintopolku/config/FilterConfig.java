package fi.vm.sade.eperusteet.opintopolku.config;

import fi.vm.sade.eperusteet.opintopolku.filter.ExpiresHeaderFilter;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FilterConfig {

    @Bean
    public FilterRegistrationBean<ExpiresHeaderFilter> expiresHeaderFilter() {
        FilterRegistrationBean<ExpiresHeaderFilter> registrationBean = new FilterRegistrationBean<>();
        registrationBean.setFilter(new ExpiresHeaderFilter());
        registrationBean.addUrlPatterns("/*"); // Apply to all URL patterns
        registrationBean.setName("ExpiresHeaderFilter");
        return registrationBean;
    }
}
