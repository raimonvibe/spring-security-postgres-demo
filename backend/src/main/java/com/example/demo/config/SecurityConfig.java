// src/main/java/com/example/demo/config/SecurityConfig.java
package com.example.demo.config;

import com.example.demo.service.UserService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    // Loads users from DB
    private final UserService userService;
    public SecurityConfig(UserService userService) { this.userService = userService; }

    @Bean
    public SecurityFilterChain security(HttpSecurity http) throws Exception {
        http
            // CORS + CSRF (disable CSRF for SPA login; re-enable later with token flow)
            .cors(c -> {})
            .csrf(csrf -> csrf.disable())

            // Auth rules
            .authorizeHttpRequests(auth -> auth
                // allow the login/logout endpoints themselves
                .requestMatchers("/perform_login", "/perform_logout", "/error").permitAll()
                // allow more if needed:
                // .requestMatchers("/public/**", "/actuator/**").permitAll()
                .anyRequest().authenticated()
            )

            // Form login that returns status codes instead of redirects
            .formLogin(login -> login
                .loginProcessingUrl("/perform_login")
                .successHandler((req, res, auth) -> res.setStatus(200))                  // 200 on success
                .failureHandler((req, res, ex) -> res.sendError(401, "Bad credentials")) // 401 on fail
                .permitAll()
            )

            // When unauthenticated user hits protected resource → 401 (no redirect)
            .exceptionHandling(e -> e
                .authenticationEntryPoint((req, res, ex) -> res.sendError(401))
            )

            // Logout endpoint for SPA
            .logout(l -> l
                .logoutUrl("/perform_logout")
                .clearAuthentication(true)
                .invalidateHttpSession(true)
                .deleteCookies("JSESSIONID")
                .permitAll()
            );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration cfg = new CorsConfiguration();
        cfg.setAllowedOrigins(List.of("http://localhost:3000"));
        cfg.setAllowedMethods(List.of("GET","POST","PUT","DELETE","OPTIONS"));
        cfg.setAllowedHeaders(List.of("Content-Type","Authorization","X-Requested-With"));
        cfg.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", cfg);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        // Delegating encoder handles {bcrypt}, {noop}, etc.
        return PasswordEncoderFactories.createDelegatingPasswordEncoder();
    }
}

