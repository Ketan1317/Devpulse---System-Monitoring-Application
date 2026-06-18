package com.Project.Devpulse.Services;

import com.Project.Devpulse.Models.Provider;
import com.Project.Devpulse.Models.RefreshToken;
import com.Project.Devpulse.Models.User;
import com.Project.Devpulse.Repositories.RefreshTokenRepository;
import com.Project.Devpulse.Repositories.UserRepository;
import com.Project.Devpulse.security.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final RefreshTokenService refreshTokenService;
    private final CookieService cookieService;
    private final JwtService jwtService;

    @Value("${spring.app.auth.frontend.success-url}")
    private String frontendSuccessUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {

        OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();

        String registrationId = ((OAuth2AuthenticationToken) authentication).getAuthorizedClientRegistrationId();

        User user;

        switch (registrationId) {

            case "google" -> {

                String email = oauthUser.getAttribute("email");

                String name = oauthUser.getAttribute("name");

                String picture = oauthUser.getAttribute("picture");

                user = userRepository.findByEmail(email).orElseGet(() -> {

                            User newUser = User.builder()
                                    .email(email)
                                    .fullName(name)
                                    .avatarUrl(picture)
                                    .provider(Provider.GOOGLE)
                                    .active(true)
                                    .build();

                            return userRepository.save(newUser);
                        });
            }

            case "github" -> {

                String email = oauthUser.getAttribute("email");

                String name = oauthUser.getAttribute("name");

                String picture = oauthUser.getAttribute("avatar_url");

                if (email == null) {
                    email = oauthUser.getAttribute("login") + "@github.local";
                }

                if (name == null) {
                    name = oauthUser.getAttribute("login");
                }
                final String finalEmail = email;
                final String finalName = name;

                user = userRepository.findByEmail(email).orElseGet(() -> {

                            User newUser = User.builder()
                                    .email(finalEmail)
                                    .fullName(finalName)
                                    .avatarUrl(picture)
                                    .provider(Provider.GITHUB)
                                    .active(true)
                                    .build();

                            return userRepository.save(newUser);
                        });
            }

            default ->
                    throw new RuntimeException("Unsupported provider");
        }

        String accessToken = jwtService.generateJwtToken(user);

        RefreshToken refreshToken = refreshTokenService.create(user);

        cookieService.attachRefreshTokenToCookie(
                refreshToken.getJti(),
                response,
                (int) jwtService.getRefreshExpirationTime()
        );

        response.sendRedirect(frontendSuccessUrl + "?token=" + accessToken);
    }
}