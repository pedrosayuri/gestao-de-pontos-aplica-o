package com.gestaodepontos.gestao_de_pontos.providers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.gestaodepontos.gestao_de_pontos.exceptions.InvalidTokenException;

@Service
public class JWTProvider {
    
    @Value("${security.token.secret}")
    private String secretKey;

    public DecodedJWT validateToken(String token) {
        try {
            DecodedJWT decodedJWT = decodeJWT(token);
            return decodedJWT;
        } catch (Exception e) {
            throw new InvalidTokenException("Token invalido");
        }
    }
    
    private DecodedJWT decodeJWT(String token) throws JWTVerificationException {
        Algorithm algorithm = Algorithm.HMAC256(secretKey);
        return JWT.require(algorithm).build().verify(token.replace("Bearer ", ""));
    }

}
