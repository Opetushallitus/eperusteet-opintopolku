package fi.vm.sade.eperusteet.opintopolku.controller;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Controller
@Slf4j
public class DigiOsaaminenController {

    @Autowired
    private RestTemplate restTemplate;

    @GetMapping("/digitesti")
    @ResponseBody
    public String getDigiOsaaminenTest() {
        return "digiOsaaminen";
    }

    @GetMapping("/digiosaaminen")
    public String getDigiOsaaminen(HttpServletRequest request, HttpServletResponse response) {
        log.debug("Redirecting to digiosaaminen");

        String url = request.getRequestURL().toString().replace(request.getRequestURI(), "");
        String apiUrl = url + "/eperusteet-service/api/perusteet/julkaisut?tyyppi=digitaalinen_osaaminen";

        JsonNode digiOsaamiset = restTemplate.getForObject(apiUrl, JsonNode.class);

        if (digiOsaamiset == null && digiOsaamiset.get("data").size() != 1) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }

        long digiOsaaminenId = digiOsaamiset.get("data").get(0).get("id").asLong();
        return "redirect:" + url + "/#/fi/digiosaaminen/" + digiOsaaminenId;
    }
}
