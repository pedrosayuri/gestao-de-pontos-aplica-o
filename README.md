# Gestão de Pontos de Jornada de Trabalho

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
