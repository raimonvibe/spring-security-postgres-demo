// src/main/java/com/example/demo/web/AuthController.java
@RestController
public class AuthController {
  @GetMapping("/me")
  public Map<String,Object> me(Principal p) {
    return Map.of("authenticated", p != null, "username", p != null ? p.getName() : null);
  }
}
