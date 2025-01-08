package fi.vm.sade.eperusteet.opintopolku.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.FilterConfig;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

public class ExpiresHeaderFilter extends HttpFilter {

    @Override
    protected void doFilter(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        
        String contentType = request.getContentType();

        if (contentType != null) {
            if (contentType.startsWith("image")) {
                response.setHeader("Cache-Control", "max-age=" + 60 * 60 * 24 * 365); // 1 year
            } else if (contentType.equals("text/css")) {
                response.setHeader("Cache-Control", "max-age=" + 60 * 60 * 24 * 365); // 1 year
            } else if (contentType.equals("application/javascript")) {
                response.setHeader("Cache-Control", "max-age=" + 60 * 60 * 24 * 365); // 1 year
            } else if (contentType.equals("text/html")) {
                response.setHeader("Cache-Control", "max-age=0, no-store, must-revalidate"); // No cache
            }
        }

        chain.doFilter(request, response);
    }

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        // Initialization logic if needed
    }

    @Override
    public void destroy() {

    }
}
