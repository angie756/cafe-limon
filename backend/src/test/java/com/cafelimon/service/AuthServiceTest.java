package com.cafelimon.service;

import com.cafelimon.dto.auth.LoginRequest;
import com.cafelimon.dto.auth.LoginResponse;
import com.cafelimon.dto.auth.RegisterRequest;
import com.cafelimon.model.User;
import com.cafelimon.model.UserRole;
import com.cafelimon.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private UserService userService;

    @Mock
    private JwtTokenProvider tokenProvider;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private AuthService authService;

    private User user;
    private LoginRequest loginRequest;

    @BeforeEach
    void setUp() {
        user = User.builder()
                .username("admin")
                .password("encodedPassword")
                .email("admin@test.com")
                .role(UserRole.ADMIN)
                .active(true)
                .build();
        org.springframework.test.util.ReflectionTestUtils.setField(user, "id", "user-1");

        loginRequest = new LoginRequest("admin", "admin123");
    }

    @Test
    void login_WithValidCredentials_ShouldReturnLoginResponse() {
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(tokenProvider.generateToken(authentication)).thenReturn("jwt-token-123");
        when(userService.getUserByUsername("admin")).thenReturn(user);

        LoginResponse response = authService.login(loginRequest);

        assertThat(response).isNotNull();
        assertThat(response.getToken()).isEqualTo("jwt-token-123");
        assertThat(response.getType()).isEqualTo("Bearer");
        assertThat(response.getUsername()).isEqualTo("admin");
        assertThat(response.getEmail()).isEqualTo("admin@test.com");
        assertThat(response.getRole()).isEqualTo(UserRole.ADMIN);

        verify(authenticationManager, times(1)).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(tokenProvider, times(1)).generateToken(authentication);
        verify(userService, times(1)).getUserByUsername("admin");
    }

    @Test
    void login_WithInvalidCredentials_ShouldThrowException() {
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new org.springframework.security.core.AuthenticationException("Bad credentials") {});

        assertThatThrownBy(() -> authService.login(loginRequest))
                .isInstanceOf(org.springframework.security.core.AuthenticationException.class);

        verify(authenticationManager, times(1)).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(tokenProvider, never()).generateToken(any());
    }

    @Test
    void register_WithValidData_ShouldCreateUser() {
        RegisterRequest request = new RegisterRequest("newuser", "password123", "newuser@test.com", UserRole.ADMIN);

        User newUser = User.builder()
                .username("newuser")
                .password("password123")
                .email("newuser@test.com")
                .role(UserRole.ADMIN)
                .active(true)
                .build();
        org.springframework.test.util.ReflectionTestUtils.setField(newUser, "id", "user-2");

        when(userService.existsByUsername("newuser")).thenReturn(false);
        when(userService.existsByEmail("newuser@test.com")).thenReturn(false);
        when(userService.createUser(any(User.class))).thenReturn(newUser);

        User result = authService.register(request);

        assertThat(result).isNotNull();
        assertThat(result.getUsername()).isEqualTo("newuser");
        assertThat(result.getEmail()).isEqualTo("newuser@test.com");

        verify(userService, times(1)).existsByUsername("newuser");
        verify(userService, times(1)).existsByEmail("newuser@test.com");
        verify(userService, times(1)).createUser(any(User.class));
    }

    @Test
    void register_WithExistingUsername_ShouldThrowException() {
        RegisterRequest request = new RegisterRequest("admin", "password123", "newemail@test.com", UserRole.ADMIN);

        when(userService.existsByUsername("admin")).thenReturn(true);

        assertThatThrownBy(() -> authService.register(request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("El nombre de usuario ya existe");

        verify(userService, times(1)).existsByUsername("admin");
        verify(userService, never()).createUser(any());
    }

    @Test
    void register_WithExistingEmail_ShouldThrowException() {
        RegisterRequest request = new RegisterRequest("newuser", "password123", "admin@test.com", UserRole.ADMIN);

        when(userService.existsByUsername("newuser")).thenReturn(false);
        when(userService.existsByEmail("admin@test.com")).thenReturn(true);

        assertThatThrownBy(() -> authService.register(request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("El email ya está registrado");

        verify(userService, times(1)).existsByUsername("newuser");
        verify(userService, times(1)).existsByEmail("admin@test.com");
        verify(userService, never()).createUser(any());
    }
}
