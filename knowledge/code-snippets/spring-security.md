# Spring Security — Code Snippets

> Code interviewers ask you to write from memory. Short, commented, ready to explain.

### 1. Stateless JWT API config (resource server)
```java
@Configuration
@EnableMethodSecurity
class SecurityConfig {
  @Bean
  SecurityFilterChain api(HttpSecurity http) throws Exception {
    return http
      .csrf(csrf -> csrf.disable())                                  // bearer tokens, no cookies
      .cors(Customizer.withDefaults())
      .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
      .authorizeHttpRequests(auth -> auth
        .requestMatchers("/auth/**", "/actuator/health").permitAll()
        .requestMatchers(HttpMethod.DELETE, "/api/**").hasRole("ADMIN")
        .anyRequest().authenticated())
      .oauth2ResourceServer(o -> o.jwt(Customizer.withDefaults()))  // validates signature + expiry
      .build();
  }
}
// application.yml: spring.security.oauth2.resourceserver.jwt.issuer-uri: https://auth.example.com
```

### 2. Custom JWT filter (when you issue your own tokens)
```java
@Component
@RequiredArgsConstructor
class JwtFilter extends OncePerRequestFilter {
  private final JwtService jwt;
  private final UserDetailsService users;

  @Override
  protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
      throws ServletException, IOException {
    String header = req.getHeader("Authorization");
    if (header != null && header.startsWith("Bearer ")) {
      String username = jwt.validateAndGetSubject(header.substring(7));   // throws if invalid/expired
      UserDetails user = users.loadUserByUsername(username);
      var auth = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
      SecurityContextHolder.getContext().setAuthentication(auth);
    }
    chain.doFilter(req, res);
  }
}
// http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
```

### 3. Loading users + password encoder
```java
@Bean PasswordEncoder passwordEncoder() { return PasswordEncoderFactories.createDelegatingPasswordEncoder(); } // bcrypt by default

@Service
class DbUserDetailsService implements UserDetailsService {
  private final UserRepository repo;
  DbUserDetailsService(UserRepository repo) { this.repo = repo; }
  public UserDetails loadUserByUsername(String email) {
    AppUser u = repo.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException(email));
    return User.withUsername(u.email()).password(u.passwordHash()).roles(u.role()).build();
  }
}
```

### 4. Method-level rules
```java
@PreAuthorize("hasRole('ADMIN') or #userId == authentication.name")
public Profile getProfile(String userId) { … }
```

### 5. CORS for a frontend
```java
@Bean
CorsConfigurationSource cors() {
  var config = new CorsConfiguration();
  config.setAllowedOrigins(List.of("https://app.example.com"));
  config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE"));
  config.setAllowedHeaders(List.of("Authorization", "Content-Type"));
  var source = new UrlBasedCorsConfigurationSource();
  source.registerCorsConfiguration("/api/**", config);
  return source;
}
```

### 6. Testing secured endpoints
```java
@Test @WithMockUser(roles = "ADMIN")
void adminCanDelete() throws Exception {
  mockMvc.perform(delete("/api/users/1")).andExpect(status().isNoContent());
}
@Test
void anonymousGets401() throws Exception {
  mockMvc.perform(get("/api/users")).andExpect(status().isUnauthorized());
}
```
