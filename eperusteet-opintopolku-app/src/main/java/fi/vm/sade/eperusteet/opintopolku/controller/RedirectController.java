package fi.vm.sade.eperusteet.opintopolku.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;

//@Controller
//@RequestMapping({"/beta/*", "/vanha-ui/*"})
public class RedirectController {

    private static final List<String> redirects = Arrays.asList("/beta", "/vanha-ui");

    @GetMapping
    public void handleRedirect(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String requestUri = request.getRequestURI();

        for (String redirect : redirects) {
            if (requestUri.contains(redirect)) {
                String newUri = requestUri.substring(requestUri.indexOf(redirect) + redirect.length());
                response.sendRedirect(newUri);
                return;
            }
        }
    }
}
