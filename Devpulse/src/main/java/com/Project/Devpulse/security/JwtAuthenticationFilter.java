package com.Project.Devpulse.security;

import com.Project.Devpulse.Models.User;
import com.Project.Devpulse.Repositories.UserRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    @Override
protected void doFilterInternal(
        HttpServletRequest request,
        HttpServletResponse response,
        FilterChain filterChain
) throws ServletException, IOException {

    // Always allow CORS preflight
    if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
        filterChain.doFilter(request, response);
        return;
    }

    String path = request.getServletPath();

    // Auth endpoints don't require JWT
    if (path.startsWith("/api/auth")) {
        filterChain.doFilter(request, response);
        return;
    }

    String header = request.getHeader("Authorization");

    if (header != null && header.startsWith("Bearer ")) {

        String token = header.substring(7);

        try {

            if (jwtService.isAccessToken(token)) {

                Jws<Claims> parsedToken = jwtService.parse(token);

                String userId = parsedToken.getPayload().getSubject();

                UUID uuid = UUID.fromString(userId);

                userRepository.findById(uuid).ifPresent(user -> {

                    if (user.isActive()
                            && SecurityContextHolder
                                .getContext()
                                .getAuthentication() == null) {

                        UsernamePasswordAuthenticationToken auth =
                                new UsernamePasswordAuthenticationToken(
                                        user,
                                        null,
                                        Collections.emptyList()
                                );

                        auth.setDetails(
                                new WebAuthenticationDetailsSource()
                                        .buildDetails(request)
                        );

                        SecurityContextHolder
                                .getContext()
                                .setAuthentication(auth);
                    }
                });
            }

        } catch (JwtException ignored) {
        }
    }

    filterChain.doFilter(request, response);
}

}