package com.Project.Devpulse.Services;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

@Service
public class CookieService {
    private final String COOKIE_NAME;
    private final boolean COOKIE_SECURE;
    private final boolean COOKIE_HTTP_ONLY;
    private final String COOKIE_SAME_SITE;
    private final String COOKIE_DOMAIN;

    @Autowired
    public CookieService(
            @Value("${spring.security.jwt.refresh-token-cookie-name}") String cookieName,
            @Value("${spring.security.jwt.cookie-secure}") boolean cookieSecure,
            @Value("${spring.security.jwt.cookie-http-only}") boolean cookieHttpOnly,
            @Value("${spring.security.jwt.cookie-same-site}") String cookieSameSite,
            @Value("${spring.security.jwt.cookie-domain:}") String cookieDomain
    ) {
        this.COOKIE_NAME = cookieName;
        this.COOKIE_SECURE = cookieSecure;
        this.COOKIE_HTTP_ONLY = cookieHttpOnly;
        this.COOKIE_SAME_SITE = cookieSameSite;
        this.COOKIE_DOMAIN = cookieDomain;
    }

    public void attachRefreshTokenToCookie(String refreshToken, HttpServletResponse response, int maxAge) {
        var resCookie = ResponseCookie.from(COOKIE_NAME, refreshToken)
                .secure(COOKIE_SECURE)
                .httpOnly(COOKIE_HTTP_ONLY)
                .sameSite(COOKIE_SAME_SITE)
                .path("/")
                .maxAge(maxAge);

        if (COOKIE_DOMAIN != null && !COOKIE_DOMAIN.isEmpty()) {
            resCookie.domain(COOKIE_DOMAIN);
        }

        ResponseCookie cookie = resCookie.build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    public void clearRefreshCookie(HttpServletResponse response) {
        var resCookie = ResponseCookie.from(COOKIE_NAME, "")
                .secure(COOKIE_SECURE)
                .httpOnly(COOKIE_HTTP_ONLY)
                .sameSite(COOKIE_SAME_SITE)
                .path("/")
                .maxAge(0);

        if (COOKIE_DOMAIN != null && !COOKIE_DOMAIN.isEmpty()) {
            resCookie.domain(COOKIE_DOMAIN);
        }

        ResponseCookie cookie = resCookie.build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }
}