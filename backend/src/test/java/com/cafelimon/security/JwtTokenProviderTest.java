package com.cafelimon.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.Authentication;
import org.springframework.test.util.ReflectionTestUtils;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class JwtTokenProviderTest {

    private JwtTokenProvider tokenProvider;
    private String testSecret = "testSecretKeyMustBeAtLeast32CharactersLong12345678901234567890";
    private long testExpiration = 86400000L;

    @BeforeEach
    void setUp() {
        tokenProvider = new JwtTokenProvider();
        ReflectionTestUtils.setField(tokenProvider, "jwtSecret", testSecret);
        ReflectionTestUtils.setField(tokenProvider, "jwtExpiration", testExpiration);
    }

    @Test
    void generateToken_ShouldReturnValidToken() {
        Authentication authentication = mock(Authentication.class);
        when(authentication.getName()).thenReturn("testuser");

        String token = tokenProvider.generateToken(authentication);

        assertThat(token).isNotNull();
        assertThat(token).isNotEmpty();
    }

    @Test
    void getUsernameFromToken_ShouldReturnCorrectUsername() {
        Authentication authentication = mock(Authentication.class);
        when(authentication.getName()).thenReturn("testuser");

        String token = tokenProvider.generateToken(authentication);
        String username = tokenProvider.getUsernameFromToken(token);

        assertThat(username).isEqualTo("testuser");
    }

    @Test
    void validateToken_WithValidToken_ShouldReturnTrue() {
        Authentication authentication = mock(Authentication.class);
        when(authentication.getName()).thenReturn("testuser");

        String token = tokenProvider.generateToken(authentication);
        boolean isValid = tokenProvider.validateToken(token);

        assertThat(isValid).isTrue();
    }

    @Test
    void validateToken_WithInvalidToken_ShouldReturnFalse() {
        String invalidToken = "invalid.jwt.token";

        boolean isValid = tokenProvider.validateToken(invalidToken);

        assertThat(isValid).isFalse();
    }

    @Test
    void validateToken_WithMalformedToken_ShouldReturnFalse() {
        String malformedToken = "malformed-token";

        boolean isValid = tokenProvider.validateToken(malformedToken);

        assertThat(isValid).isFalse();
    }

    @Test
    void validateToken_WithEmptyToken_ShouldReturnFalse() {
        String emptyToken = "";

        boolean isValid = tokenProvider.validateToken(emptyToken);

        assertThat(isValid).isFalse();
    }

    @Test
    void validateToken_WithNullToken_ShouldReturnFalse() {
        boolean isValid = tokenProvider.validateToken(null);

        assertThat(isValid).isFalse();
    }

    @Test
    void generateToken_ForDifferentUsers_ShouldGenerateDifferentTokens() {
        Authentication auth1 = mock(Authentication.class);
        when(auth1.getName()).thenReturn("user1");

        Authentication auth2 = mock(Authentication.class);
        when(auth2.getName()).thenReturn("user2");

        String token1 = tokenProvider.generateToken(auth1);
        String token2 = tokenProvider.generateToken(auth2);

        assertThat(token1).isNotEqualTo(token2);
    }

    @Test
    void getUsernameFromToken_WithDifferentTokens_ShouldReturnCorrectUsernames() {
        Authentication auth1 = mock(Authentication.class);
        when(auth1.getName()).thenReturn("user1");

        Authentication auth2 = mock(Authentication.class);
        when(auth2.getName()).thenReturn("user2");

        String token1 = tokenProvider.generateToken(auth1);
        String token2 = tokenProvider.generateToken(auth2);

        String username1 = tokenProvider.getUsernameFromToken(token1);
        String username2 = tokenProvider.getUsernameFromToken(token2);

        assertThat(username1).isEqualTo("user1");
        assertThat(username2).isEqualTo("user2");
    }
}
