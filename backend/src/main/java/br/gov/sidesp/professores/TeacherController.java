package br.gov.sidesp.professores;
import br.gov.sidesp.auth.AuthService;
import br.gov.sidesp.management.ManagementRequests;
import br.gov.sidesp.profissionais.ProfessionalService;
import jakarta.validation.Valid;
import java.util.*;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/** Endpoints da funcionalidade; autorização permanece na configuração de segurança. */
@RestController
@RequestMapping("/api/v1")
public class TeacherController {
  private final ProfessionalService service;
  public TeacherController(ProfessionalService service) { this.service = service; }

  /** Cria professor sem conceder acesso a turmas. */
  @PostMapping("/admin/professores")
  @ResponseStatus(HttpStatus.CREATED)
  public AuthService.Registered teacher(
      @Valid @RequestBody ManagementRequests.Professional r, Authentication a) {
    return service.professional(r, false, (Integer) a.getPrincipal());
  }

  /** Lista os professores cadastrados. */
  @GetMapping("/admin/professores")
  public List<Map<String, Object>> teachers() {
    return service.professionals(false);
  }

  /** Preserva o registro do professor e altera sua situação. */
  @PatchMapping("/admin/professores/{id}/situacao")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void teacherStatus(
      @PathVariable int id, @Valid @RequestBody ManagementRequests.Status r, Authentication a) {
    service.professionalStatus(id, r.ativo(), false, (Integer) a.getPrincipal());
  }

}
