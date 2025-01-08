package fi.vm.sade.eperusteet.opintopolku.servlet;

import com.fasterxml.jackson.databind.JsonNode;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;

@WebServlet(urlPatterns = {"/digiosaaminen"}, loadOnStartup = 1)
public class DigiOsaaminenServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String url = "https://" + request.getServerName();
        JsonNode digiOsaamiset = new RestTemplate().getForObject(url + "/eperusteet-service/api/perusteet/julkaisut?tyyppi=digitaalinen_osaaminen", JsonNode.class);

        if (digiOsaamiset.get("data").size() != 1) {
            response.sendError(HttpStatus.NOT_FOUND.value());
            return;
        }

        long digiOsaaminenId = digiOsaamiset.get("data").get(0).get("id").asLong();
        response.sendRedirect(url + "/#/fi/digiosaaminen/" + digiOsaaminenId);
    }

}



