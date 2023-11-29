# App

GymPass style app.

## Run app

1 - Run `docker.compose.yaml`

```sh
docker compose up -d
```

2 - Run migrations

```sh
npx prisma migrate dev
```

## RFs

- [] Deve ser possivel se cadastrar
- [] Deve ser possivel se autenticar
- [] Deve ser possivel obter o perfil de um usuario logado
- [] Deve ser possivel obter o numero de check-ins realizados pelo usuario logado
- [] Deve ser possivel que o usuario obtenha seu historico de check-ins
- [] Deve ser possivel que o usuario busque academias proximas
- [] Deve ser possivel que o usuario busque academias pelo nome
- [] Deve ser possivel que o usuario realize check-in em uma academia
- [] Deve ser possivel validar o check-in de um usuario
- [] Deve ser possivel cadastrar uma academia

## RNs

- [] Usuario nao deve poder se cadastrar com email duplicado
- [] Usuario nao pode fazer 2 check-ins no mesmo dia
- [] Usuario nao pode fazer check-in a mais de 100 metros da academia
- [] Check-in so pode ser validado ate 20 minutos apos criado
- [] Check-in so pode ser validado por administradores
- [] A academia so pode ser criada por administradores

## RNFs

- [] As senhas devem ser criptografadas
- [] Dados devem ser persistidos num banco PostgreSQL
- [] Todas as listas devem ser paginadas em listas de 20 items
- [] O usuario deve ser identificado por um JWT