package fi.vm.sade.eperusteet.opintopolku.controller;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Controller
@Slf4j
public class DigiOsaaminenController {

    @Autowired
    private RestTemplate restTemplate;

    @GetMapping("/digiosaaminen")
    public void getDigiOsaaminen(HttpServletRequest request, HttpServletResponse response) throws IOException {
        log.debug("Redirecting to digiosaaminen");

        String url = request.getRequestURL().toString().replace(request.getRequestURI(), "");
        String apiUrl = url + "/eperusteet-service/api/perusteet/julkaisut?tyyppi=digitaalinen_osaaminen";

        log.debug("API URL: {}", apiUrl);
        try {
            // Make the API call to fetch data
            JsonNode digiOsaamiset = restTemplate.getForObject(apiUrl, JsonNode.class);

            log.debug("API response: {}", digiOsaamiset);

            // Check if the response contains exactly one "digiOsaaminen"
            if (digiOsaamiset == null || digiOsaamiset.get("data").size() != 1) {
                log.debug("No digiOsaaminen found");
                response.sendError(HttpStatus.NOT_FOUND.value());
                return;
            }

            // Extract the ID and redirect
            long digiOsaaminenId = digiOsaamiset.get("data").get(0).get("id").asLong();

            log.debug("Redirecting to /#/fi/digiosaaminen/{}", digiOsaaminenId);

            response.sendRedirect(url + "/#/fi/digiosaaminen/" + digiOsaaminenId);
        } catch(HttpClientErrorException.NotFound ex) {
            response.sendError(HttpStatus.NOT_FOUND.value());
        }
    }
}
