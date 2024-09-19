package fi.vm.sade.eperusteet.opintopolku.servlet;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

//@WebServlet(urlPatterns = {"/beta/*", "/vanha-ui/*"}, loadOnStartup = 1)
public class RedirectServlet extends HttpServlet {

    private static final List<String> redirects = Arrays.asList("/beta", "/vanha-ui");

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String requestUri = request.getRequestURI();

        for (String redirect : redirects) {
            if (requestUri.contains(redirect)) {
                response.sendRedirect(requestUri.substring(requestUri.indexOf(redirect) + redirect.length()));
            }
        }
    }
}
