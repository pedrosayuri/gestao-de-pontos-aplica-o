SET timezone TO 'America/Sao_Paulo';

DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users') THEN
        INSERT INTO users (username, password, email, user_role, work_regime, created_at, modified_at)
        VALUES ('admin', '$2a$12$XELjoL44dWmdMqKYup0Ore8TRzaONBCYS//Ie2M82XTwww8aJtvr2', 'admin@admin.com', '0', '1', NOW(), NOW());
    ELSE
        RAISE NOTICE 'A tabela "users" não existe. Crie a tabela antes de adicionar o usuário administrador.';
    END IF;
END $$;
