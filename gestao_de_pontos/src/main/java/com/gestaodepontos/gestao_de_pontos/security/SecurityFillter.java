package com.gestaodepontos.gestao_de_pontos.security;

import java.io.IOException;
import java.io.PrintWriter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.gestaodepontos.gestao_de_pontos.exceptions.InvalidTokenException;
import com.gestaodepontos.gestao_de_pontos.providers.JWTProvider;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class SecurityFillter extends OncePerRequestFilter {

    @Autowired
    private JWTProvider jwtProvider;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String header = request.getHeader("Authorization");
        
        try {
            if (!request.getRequestURI().startsWith("/freelancers/auth/v1/")) {
                if (header != null) {
                    var subjectToken = this.jwtProvider.validateToken(header);
        
                    if (subjectToken == null) {
                        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                        return;
                    }
        
                    request.setAttribute("user_id", subjectToken.getSubject());
    
                    var roles = subjectToken.getClaim("roles").asList(Object.class);
    
                    var grants = roles.stream()
                        .map(role -> new SimpleGrantedAuthority("ROLE_" + role.toString().toUpperCase()))
                        .toList();
    
                    UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(subjectToken.getSubject(), null, grants);
                    SecurityContextHolder.getContext().setAuthentication(auth);
                }
            }
            
        } catch (InvalidTokenException e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            PrintWriter writer = response.getWriter();
            writer.println(e.toJson());
            return;
        }

        filterChain.doFilter(request, response);

    }
    
}