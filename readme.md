# Instalação e Execução

Este guia contém as instruções para configurar e executar a aplicação após descompactar os arquivos.

## Pré-requisitos

* [Node.js]
* Um servidor de banco de dados [MySQL] rodando via XAMPP.

---

## 1. Configurar o Backend

1. **Adicione "user.csv" na pasta "backend":

    # backend/users.csv

2.  **Acesse a pasta `backend` e instale as dependências:**
    ```bash
    cd backend
    npm i
    ```

3.  **Crie e configure o arquivo de ambiente:**
    Crie um arquivo chamado `.env` na pasta `backend` e cole o conteúdo abaixo, ajustando com suas informações.
    ```env
    # backend/.env

    # Altere com suas credenciais do MySQL (se não tiver senha, deixe em branco depois de 'root:')
    DATABASE_URL_DEV=mysql://root:sua_senha_aqui@localhost:3306/gerenciador_usuarios
    
    # Crie uma conta gratuita em [https://www.weatherapi.com/](https://www.weatherapi.com/) e cole sua chave aqui
    WEATHER_API_KEY=SUA_CHAVE_DA_WEATHERAPI_AQUI
    ```

4.  **Crie e Popule o Banco de Dados:**
    Este comando único irá preparar todo o seu banco de dados (criar, construir as tabelas e popular com os dados).
    ```bash
    npm run start:fresh

    ou 

    npm run db:reset
    ```

## 2. Configurar o Frontend

1.  **Acesse a pasta `frontend` e instale as dependências:**
    ```bash
    cd ../frontend
    npm i
    ```

## 2. Executar a Aplicação

Para rodar o projeto, você precisará de **dois terminais abertos**.

* **No Terminal 1 (para o Backend):**
    ```bash
    cd backend
    npm start
    ```

* **No Terminal 2 (para o Frontend):**
    ```bash
    cd frontend
    npm start
    ```