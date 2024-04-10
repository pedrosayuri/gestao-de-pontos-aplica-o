# Gestão de Pontos de Jornada de Trabalho

## Índice
- [Desafios do Projeto](#desafios-do-projeto)
- [Tecnologias Usadas](#tecnologias-usadas)
- [Funcionalidades do Projeto](#funcionalidades-do-projeto)
- [Execução do Projeto em um ambiente local](#execução-do-projeto-em-um-ambiente-local)
- [Execução do Projeto em um ambiente produção](#execução-do-Projeto-em-um-ambiente-produção)
- [Diagrama de entidade e relacionamento](#diagrama-de-entidade-erelacionamento)

## Desafios do Projeto

- [x] O sistema deve ser protegido por login e senha, e somente após autenticado o usuário poderá visualizar os dados;

- [x] Os dados de usuários e pontos devem ser persistidos em banco de dados;

- [x] Um ponto representa o registro de entrada ou saída de expediente durante a jornada de trabalho de um usuário (colaborador);

- [x] O sistema deve ter suporte a dois tipos de regimes de jornadas de trabalho, são eles:
     ° Regime de 6 horas contínuas de trabalho, sem previsão de pausas;
     ° Regime de 8 horas de trabalho, com previsão de pausa mínima de 1 hora para almoço;

- [x] O sistema deve ter flexibilidade para aceitar entradas de registros de pontos em qualquer horário, dada a situações de imprevistos, atrasos ou cargas extras de trabalho;

- [x] O sistema deve ter suporte para múltiplos registros de pontos em um dia, não se restringindo ao limite de quatro pontos. 
     ° Por exemplo: 08:28 (início de expediente)
                    12:15 (pausa para almoço)
                    13:15 (retorno da pausa para almoço)
                    15:30 (saída esporádica)
                    16:30 (retorno da saída esporádica)
                    18:28 (fim de expediente);

- [x] O sistema deve ter suporte para dois tipos de usuários: Usuário Administrador e Usuário Comum;

- [x] O usuário administrador terá permissão para cadastro de novos usuários (usuário comum);

- [x] Ao cadastrar um novo usuário comum, o administrador deverá informar o tipo de regime de jornada de trabalho daquele colaborador;

- [x] O usuário comum não poderá cadastrar novos usuários;

- O usuário comum terá acesso as seguintes funcionalidades:
     - [x] Registrar ponto: O usuário poderá informar a data/hora para registro de um novo ponto de trabalho na jornada;
     - [x] Resumo de jornada do dia atual: Com base nos pontos cadastrados para o dia, o usuário poderá verificar quais pontos foram contemplados, bem como se a jornada prevista para o dia está completa ou não (entende-se completa quando a duração do expediente com base nos pontos atende o regime de jornada de trabalho do colaborador);
     - [x] Previsão para completar jornada: O sistema deverá apresentar, com base nos pontos, resumo de jornada e regime de jornada do colaborador, a quantidade de horas restantes para completar a jornada do dia;
     - [x] Horas excedidas da jornada: O sistemas deverá apresentar, com base nos pontos, resumo de jornada e regime de jornada do colaborador, a quantidade de horas excedidas (extras) na jornada do dia;

- [x] Implemente módulos de testes unitários, principalmente para validação de fluxos de processamento das datas dos pontos;

- [x] O projeto deverá ser entregue com o link do repositório no Github ou Gitlab contendo o projeto versionado e acessível publicamente;

- [x] O projeto deverá vir documentado no repositório (arquivo README.md) contendo as versões das linguagens, principais bibliotecas/frameworks, como executar o projeto, funcionalidades implementadas e funcionalidades idealizadas, mesmo que não desenvolvidas.

- [x] Implemente módulos de testes unitários, principalmente para validação de fluxos de processamento das datas dos pontos;

- [x] Se possível, disponibilize o sistema desenvolvido em algum serviço cloud e que esteja acessível para avaliação prévia;

- [x] Junto às documentações, apresente diagrama de entidade/relacionamento (DER) que reflete a arquitetura de dados aplicada na solução;


## Tecnologias Usadas

     - Linguagens: 
          - [Java](https://www.java.com/) - Versão 17
          - [TypeScript](https://www.typescriptlang.org/) - Versão 5.4.3

     - Framework: 
          - [Spring Boot](https://spring.io/projects/spring-boot) - Versão

     - Ferramentas de Desenvolvimento:
          - [Maven](https://maven.apache.org/)
          - [Vite](https://pt.vitejs.dev/guide/)
          - [React](https://react.dev/)

     -Dependências:
          - [Lombok] - Versão 1.18.30
          - [Spring Boot Starter Validation]
          - [Spring Boot Starter Data JPA]
          - [Spring Boot Starter Security]
          - [Spring Boot Starter Web]
          - [Spring Boot DevTools]
          - [Spring Boot Starter Test]
          - [SpringDoc OpenAPI Starter] -  Versão 2.3.0
          - [PostgreSQL Driver] - Versão 42.7.2
          - [Java JWT] - Versão 4.4.0
          - [JJWT API] - Versão 0.11.2
          - [JJWT Implementation] - Versão 0.11.2
          - [JWT Jackson:] - Versão 0.11.2
          - [React Router Dom]
          - [Mui/material]
          - [ZOD]
          - [React Hook Form]
          - [Jwt Decode]
          - [Axios]
          - [Date FNS]

     - Sistema de Gerenciamento de Banco de Dados Relacional:
          - [PostgreSQL](https://www.postgresql.org/)

     - Framework de Mapeamento Objeto-Relacional:
          - [Hibernate](https://hibernate.org/)

## Funcionalidades do Projeto
 
### Usuário Administrador
     - Criação de Usuários

     - Listagem de Usuários

     - Edição de Usuários

     - Remoção de Usuários

     - Listagem de Pontos

### Usuário Comum
     - Bater Pontos

     - Listar Pontos

## Execução do Projeto em um ambiente local

     - O projeto Frontend foi desenvolvido em React e está configurado para ser executado com Vite. Para iniciar o projeto, siga as seguintes etapas:

          1 ° Baixe o repositório e navegue até o diretório gestao-de-pontos-aplicacao/gestao_de_pontos_react.
          
          2 ° Use o comando npm install para instalar todas as dependências necessárias.
          
          3 ° Após a conclusão da instalação, execute o comando npm run dev para iniciar o projeto Frontend.

          4 ° Após seguir essas etapas, o projeto Frontend estará configurado e pronto para ser usado.

     - O projeto Backend foi desenvolvido com Java SpringBoot enquanto que o banco de dados PostgreSQL é utilizado como o sistema de gerenciamento de banco de dados relacional, e a integração com o Hibernate facilita a interação entre o aplicativo e o banco de dados. O Backend, juntamente com o banco de dados, está configurado para ser executado em contêineres usando Docker e Docker Compose est Siga as seguintes etapas:
          
          1 ° Entre no arquivo "aplication.properties" que fica em "gestao-de-pontos-aplica-o/gestao_de_pontos/src/main/resources" e descomente as linhas relacionadas a "Credenciais do banco de dados local" e comente as linhas relacionadas a "Credenciais do banco de dados na nuvem".
          
          2 ° Entre no arquivo "docker-compose.yml" que fica em "gestao-de-pontos-aplica-o" e descomente as linhas relacionadas a "Credenciais do banco de dados local" e comente as linhas relacionadas a "Credenciais do banco de dados na nuvem".

          3 ° Entre no aquivo Dockerfile que fica em "gestao-de-pontos-aplica-o/gestao_de_pontos" e descomente as linhas relacionadas a "Dockerfile para rodar a aplicação localmente" e comente as linhas relacionadas a Dockerfile para rodar a aplicação em produção"

          4 ° Após realizar essas alterações, execute o comando "docker compose up -d --build" para construir e iniciar o container.

          5 ° Abra a sua ferramenta de administração de banco de dados e execute o seguinte comando para criar o usuário admin:
               INSERT INTO users (username, password, email, user_role, work_regime, created_at, modified_at)
                    VALUES ('admin', '$2a$12$XELjoL44dWmdMqKYup0Ore8TRzaONBCYS//Ie2M82XTwww8aJtvr2', 'admin@admin.com', '0', '1', NOW(), NOW());

          6 ° Após seguir essas etapas, o projeto Backend estará configurado e pronto para ser usado.

     - Observação: Não há preferências específicas de execução do projeto, no entanto, é recomendável começar executando o backend e, em seguida, o frontend. Para fazer login, utilize o seguinte email: admin@admin.com e a senha: 12345678.

## Execução do Projeto em um ambiente produção

     - O projeto de Frontend está hospedado na plataforma Vercel, enquanto o banco de dados e o projeto Backend estão hospedados na plataforma Render. Para acessar o sistema, basta visitar o seguinte link: https://pontofacil.vercel.app

     - Por favor, tenha em mente que, devido ao fato de o projeto estar hospedado em sistemas gratuitos (Vercel - Frontend e Render - Backend), pode haver um atraso na utilização do site. Especificamente, a primeira solicitação de login pode demorar alguns minutos, pois o Render monitora a atividade do backend. Se o backend não receber consultas por um período, ele entra em um estado de suspensão. Assim, quando a primeira consulta é feita, o Render precisa reativar o projeto e reconstruí-lo, o que pode resultar em um atraso até que o processo seja concluído.

     - Portanto, peço gentilmente que aguarde até que a operação seja concluída. Durante esse tempo de espera, você pode explorar a documentação Swagger do projeto em https://gestao-de-pontos-aplicacao.onrender.com/swagger-ui/index.html

     - Login: admin@admin.com
     - Senha: 12345678

## Diagrama de entidade e relacionamento

![Diagrama de entidade/relacionamento](https://github.com/pedrosayuri/gestao-de-pontos-aplica-o/blob/main/Producao_DER.png)