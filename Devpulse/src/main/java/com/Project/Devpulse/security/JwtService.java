package com.Project.Devpulse.security;

import com.Project.Devpulse.Models.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
//@RequiredArgsConstructor
public class JwtService {
    private final SecretKey secretKey;
    private final long accessTtlSeconds;
    private final long refreshTtlSeconds;
    private final String issuer;

    // We are using @Autowired here instead of @RequiredArgsConstructor because we need to inject values from application.properties file,
    // and those values are not available at the time of object creation, so we cannot use constructor injection for those values, we have to use field injection for those values, and for that we need to use @Autowired on the constructor and @Value on the parameters of the constructor to inject those values from application.properties file.
    @Autowired
    public JwtService(@Value("${spring.security.jwt.secret}") String secretKey,
                      @Value("${spring.security.jwt.access-ttl-seconds}") long accessTtlSeconds,
                      @Value("${spring.security.jwt.refresh-ttl-seconds}") long refreshTtlSeconds,
                      @Value("${spring.security.jwt.issuer}") String issuer) {

        this.secretKey = Keys.hmacShaKeyFor(secretKey.getBytes());
        this.accessTtlSeconds = accessTtlSeconds;
        this.refreshTtlSeconds = refreshTtlSeconds;
        this.issuer = issuer;

    }

    public String generateJwtToken(User user) {

        Instant now = Instant.now();

        return Jwts.builder()
                .id(UUID.randomUUID().toString())
                .subject(user.getId().toString())
                .issuer(issuer)
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plusSeconds(accessTtlSeconds)))
                .claims(
                        Map.of(
                                "email", user.getEmail(),
                                "name", user.getFullName(),
                                "typ", "access"
                        )
                )
                .signWith(secretKey)
                .compact();
    }

    public String generateRefreshToken(User user,String jti){
        Instant now = Instant.now();
        return Jwts.builder()
                .id(jti)
                .subject(user.getId().toString())
                .issuer(issuer)
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plusSeconds(refreshTtlSeconds)))
                .claims(Map.of("email" , user.getEmail(), "typ" ,"refresh"))
                .signWith(secretKey)
                .compact();
    }

    public Jws<Claims> parse(String token){
        try{
            return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token);
        }
        catch (JwtException e){
            throw e;
        }
    }

    public boolean isAccessToken(String token){
        try{
            Claims c = parse(token).getPayload();
            return c.get("typ", String.class).equals("access");
        }
        catch (JwtException e){
            return false;
        }
    }

    public boolean isRefreshToken(String token){
        try{
            Claims c = parse(token).getPayload();
            return c.get("typ", String.class).equals("refresh");
        }
        catch (JwtException e){
            return false;
        }
    }

    public UUID getUserIdFromToken(String token){
        Claims c = parse(token).getPayload();
        return UUID.fromString(c.getSubject());
    }

    public String getJti(String token){
        Claims c = parse(token).getPayload();
        return c.getId();
    }


    public long getExpirationTime() {
        return accessTtlSeconds;
    }

    public long getRefreshExpirationTime() {
        return refreshTtlSeconds;
    }


}
