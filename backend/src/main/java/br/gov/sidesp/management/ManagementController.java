package br.gov.sidesp.management;

import br.gov.sidesp.auth.AuthService;
import jakarta.validation.Valid;
import java.util.*;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/** A segurança HTTP confere o perfil antes de chamar os cadastros. */
@RestController
@RequestMapping("/api/v1")
public class ManagementController {
  private final ManagementService service;

  /** Recebe o serviço de cadastros. */
  public ManagementController(ManagementService service) {
    this.service = service;
  }

  /** Cria administrador total ou parcial; rota exclusiva do total. */
  @PostMapping("/admin/administradores")
  @ResponseStatus(HttpStatus.CREATED)
  public AuthService.Registered administrator(
      @Valid @RequestBody ManagementRequests.Professional r, Authentication a) {
    return service.professional(r, true, (Integer) a.getPrincipal());
  }

  /** Lista administradores sem credenciais. */
  @GetMapping("/admin/administradores")
  public List<Map<String, Object>> administrators() {
    return service.professionals(true);
  }

  /** Inativa ou reativa administrador. */
  @PatchMapping("/admin/administradores/{id}/situacao")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void administratorStatus(
      @PathVariable int id, @Valid @RequestBody ManagementRequests.Status r, Authentication a) {
    service.professionalStatus(id, r.ativo(), true, (Integer) a.getPrincipal());
  }

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

  /** Cadastra polo e endereço. */
  @PostMapping("/admin/polos")
  @ResponseStatus(HttpStatus.CREATED)
  public Map<String, Object> hub(@Valid @RequestBody ManagementRequests.Hub r) {
    return service.hub(r);
  }

  /** Busca polos com filtro opcional; ativo=true serve para seletores. */
  @GetMapping("/admin/polos")
  public List<Map<String, Object>> hubs(
      @RequestParam(defaultValue = "") String busca,
      @RequestParam(required = false) Boolean ativo) {
    return service.hubs(busca, ativo);
  }

  /** Altera situação do polo sem excluir. */
  @PatchMapping("/admin/polos/{id}/situacao")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void hubStatus(@PathVariable int id, @Valid @RequestBody ManagementRequests.Status r) {
    service.hubStatus(id, r.ativo());
  }

  /** Cadastra modalidade em polo ativo. */
  @PostMapping("/admin/modalidades")
  @ResponseStatus(HttpStatus.CREATED)
  public Map<String, Object> modality(@Valid @RequestBody ManagementRequests.Modality r) {
    return service.modality(r);
  }

  /** Retorna modalidades conforme a situação solicitada. */
  @GetMapping("/admin/modalidades")
  public List<Map<String, Object>> modalities(@RequestParam(required = false) Boolean ativo) {
    return service.modalities(ativo);
  }

  /** Inativa ou reativa modalidade. */
  @PatchMapping("/admin/modalidades/{id}/situacao")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void modalityStatus(
      @PathVariable int id, @Valid @RequestBody ManagementRequests.Status r) {
    service.modalityStatus(id, r.ativo());
  }

  /** Vincula dependente apenas ao titular da sessão. */
  @PostMapping("/responsavel/dependentes")
  @ResponseStatus(HttpStatus.CREATED)
  public AuthService.Registered child(
      @Valid @RequestBody ManagementRequests.Child r, Authentication a) {
    return service.child(r, (Integer) a.getPrincipal());
  }

  /** Consulta ficha após conferir perfil e vínculo no serviço. */
  @GetMapping("/fichas-medicas/{id}")
  public ManagementRequests.Medical medical(@PathVariable int id, Authentication a) {
    boolean admin =
        a.getAuthorities().stream()
            .anyMatch(r -> r.getAuthority().startsWith("ROLE_ADMINISTRADOR_"));
    return service.medical(id, (Integer) a.getPrincipal(), admin);
  }
}
