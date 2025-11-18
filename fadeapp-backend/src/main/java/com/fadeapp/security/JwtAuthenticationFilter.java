package com.fadeapp.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserDetailsService userDetailsService;

    /**
     * ✅ Filtro que intercepta cada petición HTTP.
     * Valida si el token JWT es válido y autentica al usuario cuando corresponde.
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getServletPath();
        System.out.println("Request path: " + path);

        // 🔹 Ignorar rutas públicas (no requieren token)
        if (
                path != null && (
                        path.startsWith("/api/auth") ||
                                path.startsWith("/api/users/login") ||   // ✅ Permitir login
                                path.startsWith("/api/users/register") || // ✅ Permitir registro
                                path.startsWith("/api/barbershops") ||
                                path.startsWith("/api/clients/register") ||
                                path.startsWith("/api/barbers/register") ||
                                path.startsWith("/v3/api-docs") ||
                                path.startsWith("/swagger-ui")
                )
        )

        {
            System.out.println("🟢 Saltando filtro JWT para ruta pública: " + path);
            filterChain.doFilter(request, response);
            return;
        }

        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        // 🔹 Si no hay token o no comienza con 'Bearer ', continúa sin autenticar
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        jwt = authHeader.substring(7); // Elimina "Bearer "
        userEmail = jwtUtils.extractEmail(jwt);

        // 🔹 Si tenemos un email y no hay autenticación previa
        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(userEmail);

            // Verificamos que el token sea válido
            if (jwtUtils.isTokenValid(jwt, userDetails.getUsername())) {
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );

                authToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );

                // Establecemos la autenticación en el contexto de seguridad
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        // 🔹 Continuamos con la cadena de filtros
        filterChain.doFilter(request, response);
    }
}
