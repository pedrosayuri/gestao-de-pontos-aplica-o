package com.gestaodepontos.gestao_de_pontos.modules.users.entities;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.validator.constraints.Length;

import com.gestaodepontos.gestao_de_pontos.modules.users.enums.UserRegime;
import com.gestaodepontos.gestao_de_pontos.modules.users.enums.UserType;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "users")
public class UserEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Preencha o com o nome completo.")
    private String username;

    @Email(message = "O email deve ser válido.")
    private String email;

    @Length(min = 8, max = 100, message = "A senha deve ter entre 8 e 100 caracteres.")
    private String password;

    @NotNull(message = "Informe o tipo de usuário.")
    private UserType userRole;

    @NotNull(message = "Informe o regime de trabalho.")
    private UserRegime workRegime;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @CreationTimestamp
    private LocalDateTime modifiedAt;

}