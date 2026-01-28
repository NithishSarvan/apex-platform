package com.apexplatform.api.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

  private final JwtService jwtService;
  private final TokenRevocationService tokenRevocationService;

  public JwtAuthFilter(JwtService jwtService, TokenRevocationService tokenRevocationService) {
    this.jwtService = jwtService;
    this.tokenRevocationService = tokenRevocationService;
  }

  @Override
  protected void doFilterInternal(
      HttpServletRequest request,
      HttpServletResponse response,
      FilterChain filterChain
  ) throws ServletException, IOException {

    String auth = request.getHeader(HttpHeaders.AUTHORIZATION);
    if (auth != null && auth.startsWith("Bearer ")) {
      String token = auth.substring("Bearer ".length()).trim();
      try {
        ApexPrincipal principal = jwtService.parse(token);
        if (tokenRevocationService.isRevoked(principal.jti())) {
          filterChain.doFilter(request, response);
          return;
        }
        var authorities = List.of(new SimpleGrantedAuthority("ROLE_" + principal.role()));
        var authentication = new UsernamePasswordAuthenticationToken(principal, null, authorities);
        SecurityContextHolder.getContext().setAuthentication(authentication);
      } catch (Exception ignored) {
        // If token is invalid/expired, continue without auth; endpoint security will block.
      }
    }

    filterChain.doFilter(request, response);
  }
}

