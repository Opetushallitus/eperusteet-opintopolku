package fi.vm.sade.eperusteet.opintopolku.config;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class RootController {

    @GetMapping(value = {"/", "//"})
    public String handleIndex() {
        return "forward:/index.html";
    }
}