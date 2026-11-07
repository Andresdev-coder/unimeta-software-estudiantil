package com.unimeta.registro_estudiantes.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.beans.factory.annotation.Value;

import lombok.RequiredArgsConstructor;

import java.util.List;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private static final Logger log = LoggerFactory.getLogger(SecurityConfig.class);

    private final JwtAuthFilter jwtAuthFilter;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of(frontendUrl));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(errors -> errors.accessDeniedHandler((request, response, exception) -> {
                    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                    log.warn("Acceso denegado: {} {} usuario={} roles={}", request.getMethod(), request.getRequestURI(),
                            authentication == null ? "anónimo" : authentication.getName(),
                            authentication == null ? "ninguno" : authentication.getAuthorities());
                    response.sendError(HttpServletResponse.SC_FORBIDDEN, "Permiso insuficiente para esta operación");
                }))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/uploads/**").permitAll()
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/estudiante/**").hasRole("ESTUDIANTE")
                        .requestMatchers("/api/profesor/**").hasRole("PROFESOR")
                        .requestMatchers("/api/chat/**").hasRole("ESTUDIANTE")
                        .requestMatchers(HttpMethod.GET, "/api/estudiantes/**").hasAnyRole("ADMIN", "COORDINADOR")
                        .requestMatchers(HttpMethod.POST, "/api/estudiantes/**").hasAnyRole("ADMIN", "COORDINADOR")
                        .requestMatchers(HttpMethod.PUT, "/api/estudiantes/**").hasAnyRole("ADMIN", "COORDINADOR")
                        .requestMatchers(HttpMethod.DELETE, "/api/estudiantes/**").hasAnyRole("ADMIN", "COORDINADOR")
                        .requestMatchers("/api/cursos/**", "/api/materias/**", "/api/matriculas/**", "/api/ingresos/**", "/api/dashboard/**")
                                .hasAnyRole("ADMIN", "COORDINADOR")
                        .anyRequest().authenticated())
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
