package com.project.fitness.apigateway.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.ReactiveJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusReactiveJwtDecoder;
import org.springframework.security.web.server.SecurityWebFilterChain;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(
            ServerHttpSecurity http) {

        return http
                // Disable CSRF because this is a REST API
                .csrf(ServerHttpSecurity.CsrfSpec::disable)

                // Enable CORS support
                .cors(cors -> {})

                .authorizeExchange(exchange -> exchange

                        // IMPORTANT: allow browser CORS preflight
                        .pathMatchers(HttpMethod.OPTIONS, "/**")
                        .permitAll()

                        // Login and registration don't need JWT
                        .pathMatchers(
                                "/api/users/register",
                                "/api/users/login"
                        )
                        .permitAll()

                        // Everything else requires JWT
                        .anyExchange()
                        .authenticated()
                )

                .oauth2ResourceServer(oauth2 ->
                        oauth2.jwt(jwt -> {})
                )

                .build();
    }

    @Bean
    public ReactiveJwtDecoder jwtDecoder() {

        SecretKey key = new SecretKeySpec(
                jwtSecret.getBytes(StandardCharsets.UTF_8),
                "HmacSHA384"
        );

        return NimbusReactiveJwtDecoder
                .withSecretKey(key)
                .macAlgorithm(MacAlgorithm.HS384)
                .build();
    }
}