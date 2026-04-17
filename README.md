# 📌 Sistema de Chamados de TI

## 📖 Sobre o Projeto

Este projeto consiste em um sistema de chamados de Tecnologia da Informação (TI), desenvolvido para gerenciar solicitações, incidentes e demandas internas de forma organizada e eficiente.

A aplicação possui integração com banco de dados e uma API desenvolvida em Python utilizando o framework FastAPI, permitindo comunicação entre frontend e backend de forma rápida e escalável.

---

## 🚀 Funcionalidades

* Abertura de chamados
* Listagem de chamados
* Atualização de status (Aberto, Em andamento, Finalizado)
* Cadastro de usuários
* Associação de chamados a setores
* Integração com banco de dados
* API REST para comunicação entre sistemas

---

## 🛠️ Tecnologias Utilizadas

### Backend

* Python
* FastAPI
* Uvicorn

### Banco de Dados

* PostgreSQL ou SQLite

### Frontend (opcional)

* React (ou outro de sua preferência)

---

## ⚙️ Estrutura do Projeto

```
/projeto
 ├── app
 │   ├── main.py
 │   ├── models.py
 │   ├── database.py
 │   ├── routes
 │   │   └── chamados.py
 │   └── schemas.py
 ├── requirements.txt
 └── README.md
```

---

## 🔌 Instalação e Execução

### 1. Clonar o repositório

```
git clone <url-do-repositorio>
cd nome-do-projeto
```

### 2. Criar ambiente virtual

```
python -m venv venv
```

### 3. Ativar ambiente virtual

Windows:

```
venv\Scripts\activate
```

Linux/Mac:

```
source venv/bin/activate
```

### 4. Instalar dependências

```
pip install -r requirements.txt
```

### 5. Executar o projeto

```
uvicorn app.main:app --reload
```

A API estará disponível em:

```
http://127.0.0.1:8000
```

Documentação automática:

```
http://127.0.0.1:8000/docs
```

---

## 🧩 Integração com Banco de Dados

O sistema utiliza um banco de dados relacional para armazenar informações como:

* Usuários
* Chamados
* Status
* Setores

A conexão é configurada no arquivo `database.py`, onde são definidos os parâmetros de acesso ao banco.

---

## 📡 Endpoints Principais

### Chamados

* `GET /chamados` → Lista todos os chamados
* `POST /chamados` → Cria um novo chamado
* `PUT /chamados/{id}` → Atualiza um chamado
* `DELETE /chamados/{id}` → Remove um chamado

### Usuários

* `GET /usuarios`
* `POST /usuarios`

---

## 💡 Possíveis Melhorias

* Autenticação com JWT
* Upload de anexos
* Notificações por e-mail
* Dashboard com métricas
* Controle de permissões por nível de acesso

---

## 👨‍💻 Autor

Desenvolvido como projeto de estudo para aplicação prática de conceitos de API REST, banco de dados e desenvolvimento backend com Python.

---

## 📄 Licença

Este projeto é de uso livre para fins acadêmicos e de aprendizado.
