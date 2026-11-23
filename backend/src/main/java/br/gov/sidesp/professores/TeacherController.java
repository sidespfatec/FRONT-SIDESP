
package br.gov.sidesp.professores;

import br.gov.sidesp.auth.AuthService;
import br.gov.sidesp.management.ManagementRequests;
import br.gov.sidesp.profissionais.ProfessionalService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
public class TeacherController {

    private final ProfessionalService service;

    public TeacherController(ProfessionalService service) {
        this.service = service;
    }

    @PostMapping("/admin/professores")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthService.Registered teacher(
            @Valid @RequestBody ManagementRequests.Teacher r,
            Authentication a) {

        return service.teacher(
                r,
                (Integer) a.getPrincipal());
    }

    @GetMapping("/admin/professores")
    public List<Map<String, Object>> teachers() {
        return service.professionals(false);
    }

    @PatchMapping("/admin/professores/{id}/situacao")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void teacherStatus(
            @PathVariable int id,
            @Valid @RequestBody ManagementRequests.Status r,
            Authentication a) {

        service.professionalStatus(
                id,
                r.ativo(),
                false,
                (Integer) a.getPrincipal());
    }
}
