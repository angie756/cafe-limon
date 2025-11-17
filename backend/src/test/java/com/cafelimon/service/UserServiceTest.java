package com.cafelimon.service;

import com.cafelimon.exception.ResourceNotFoundException;
import com.cafelimon.model.User;
import com.cafelimon.model.UserRole;
import com.cafelimon.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private User user;

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
    }

    @Test
    void loadUserByUsername_WhenUserExists_ShouldReturnUserDetails() {
        when(userRepository.findByUsername("admin")).thenReturn(Optional.of(user));

        UserDetails result = userService.loadUserByUsername("admin");

        assertThat(result).isNotNull();
        assertThat(result.getUsername()).isEqualTo("admin");
        assertThat(result.getPassword()).isEqualTo("encodedPassword");
        verify(userRepository, times(1)).findByUsername("admin");
    }

    @Test
    void loadUserByUsername_WhenUserNotFound_ShouldThrowException() {
        when(userRepository.findByUsername("invalid")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.loadUserByUsername("invalid"))
                .isInstanceOf(UsernameNotFoundException.class)
                .hasMessageContaining("Usuario no encontrado: invalid");
    }

    @Test
    void loadUserByUsername_WhenUserInactive_ShouldThrowException() {
        user.setActive(false);
        when(userRepository.findByUsername("admin")).thenReturn(Optional.of(user));

        assertThatThrownBy(() -> userService.loadUserByUsername("admin"))
                .isInstanceOf(UsernameNotFoundException.class)
                .hasMessageContaining("Usuario inactivo: admin");
    }

    @Test
    void getUserByUsername_WhenUserExists_ShouldReturnUser() {
        when(userRepository.findByUsername("admin")).thenReturn(Optional.of(user));

        User result = userService.getUserByUsername("admin");

        assertThat(result).isNotNull();
        assertThat(result.getUsername()).isEqualTo("admin");
        verify(userRepository, times(1)).findByUsername("admin");
    }

    @Test
    void getUserByUsername_WhenUserNotFound_ShouldThrowException() {
        when(userRepository.findByUsername("invalid")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.getUserByUsername("invalid"))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Usuario no encontrado: invalid");
    }

    @Test
    void getUserById_WhenUserExists_ShouldReturnUser() {
        when(userRepository.findById("user-1")).thenReturn(Optional.of(user));

        User result = userService.getUserById("user-1");

        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo("user-1");
        verify(userRepository, times(1)).findById("user-1");
    }

    @Test
    void getUserById_WhenUserNotFound_ShouldThrowException() {
        when(userRepository.findById("invalid-id")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.getUserById("invalid-id"))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Usuario no encontrado con ID: invalid-id");
    }

    @Test
    void createUser_WithValidData_ShouldCreateUser() {
        User newUser = User.builder()
                .username("newuser")
                .password("password123")
                .email("newuser@test.com")
                .role(UserRole.ADMIN)
                .active(true)
                .build();

        when(userRepository.existsByUsername("newuser")).thenReturn(false);
        when(userRepository.existsByEmail("newuser@test.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(newUser);

        User result = userService.createUser(newUser);

        assertThat(result).isNotNull();
        verify(userRepository, times(1)).existsByUsername("newuser");
        verify(userRepository, times(1)).existsByEmail("newuser@test.com");
        verify(passwordEncoder, times(1)).encode("password123");
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void createUser_WithExistingUsername_ShouldThrowException() {
        User newUser = User.builder()
                .username("admin")
                .password("password123")
                .email("newemail@test.com")
                .build();

        when(userRepository.existsByUsername("admin")).thenReturn(true);

        assertThatThrownBy(() -> userService.createUser(newUser))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Ya existe un usuario con ese nombre: admin");

        verify(userRepository, never()).save(any());
    }

    @Test
    void createUser_WithExistingEmail_ShouldThrowException() {
        User newUser = User.builder()
                .username("newuser")
                .password("password123")
                .email("admin@test.com")
                .build();

        when(userRepository.existsByUsername("newuser")).thenReturn(false);
        when(userRepository.existsByEmail("admin@test.com")).thenReturn(true);

        assertThatThrownBy(() -> userService.createUser(newUser))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Ya existe un usuario con ese email: admin@test.com");

        verify(userRepository, never()).save(any());
    }

    @Test
    void deleteUser_WhenUserExists_ShouldDeleteUser() {
        when(userRepository.findById("user-1")).thenReturn(Optional.of(user));

        userService.deleteUser("user-1");

        verify(userRepository, times(1)).delete(user);
    }

    @Test
    void deleteUser_WhenUserNotFound_ShouldThrowException() {
        when(userRepository.findById("invalid-id")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.deleteUser("invalid-id"))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void existsByUsername_ShouldReturnTrue() {
        when(userRepository.existsByUsername("admin")).thenReturn(true);

        boolean result = userService.existsByUsername("admin");

        assertThat(result).isTrue();
        verify(userRepository, times(1)).existsByUsername("admin");
    }

    @Test
    void existsByUsername_ShouldReturnFalse() {
        when(userRepository.existsByUsername("nonexistent")).thenReturn(false);

        boolean result = userService.existsByUsername("nonexistent");

        assertThat(result).isFalse();
    }

    @Test
    void existsByEmail_ShouldReturnTrue() {
        when(userRepository.existsByEmail("admin@test.com")).thenReturn(true);

        boolean result = userService.existsByEmail("admin@test.com");

        assertThat(result).isTrue();
        verify(userRepository, times(1)).existsByEmail("admin@test.com");
    }

    @Test
    void existsByEmail_ShouldReturnFalse() {
        when(userRepository.existsByEmail("nonexistent@test.com")).thenReturn(false);

        boolean result = userService.existsByEmail("nonexistent@test.com");

        assertThat(result).isFalse();
    }
}
