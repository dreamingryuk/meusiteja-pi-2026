# 🚀 MeuSiteJá

> Crie e compartilhe seu portfólio profissional em poucos minutos.

O **MeuSiteJá** é uma plataforma web que permite criar um portfólio online de forma prática, sem necessidade de programação. O usuário preenche suas informações, escolhe um tema e gera uma página pública para divulgar seu trabalho.
---

## 📖 Sobre o Projeto

O objetivo do projeto é facilitar a criação de portfólios digitais para estudantes, profissionais e freelancers, sem a necessidade de conhecimentos em programação.

Com poucos passos, é possível montar uma página contendo informações pessoais, formação, experiências, habilidades e formas de contato.

---

## ✨ Funcionalidades

- Cadastro de informações pessoais
- Seção "Sobre Mim"
- Experiências profissionais
- Formação acadêmica
- Lista de habilidades
- Contatos e redes sociais
- Escolha de paleta de cores
- Foto de perfil
- Geração de página pública
- Armazenamento no Firebase
- Galeria de portfólios publicados

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Função |
|------------|--------|
| React 19 | Interface |
| Vite | Ambiente de desenvolvimento |
| React Router DOM | Gerenciamento de rotas |
| Firebase Firestore | Banco de dados |
| JavaScript | Lógica da aplicação |
| CSS3 / Tailwind | Estilização |

---

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── Abilidades.jsx
│   ├── Carreira.jsx
│   ├── Contato.jsx
│   ├── Experiencia.jsx
│   ├── Footer.jsx
│   ├── Formacao.jsx
│   ├── Foto.jsx
│   ├── Header.jsx
│   └── Login.jsx[reference:3]
├── pages/
│   ├── Formulario.jsx
│   ├── Galeria.jsx
│   ├── Hero.jsx
│   ├── PortfolioPublico.jsx
│   └── Preview.jsx[reference:4]
├── config/
│   └── firebase.js
│   └── serviceAccountKey.json
├── services/
├── App.jsx
└── main.jsx
```

---

## ⚙️ Instalação

### Clone o repositório

```bash
git clone https://github.com/dreamingryuk/meusiteja-pi-2026.git
```

### Entre na pasta

```bash
cd meusiteja-pi-2026
```

### Instale as dependências

```bash
npm install
```

### Configure as variáveis no ambiente

- Adicione um arquivo '.env' sem aspas na pasta raiz do projeto. Ele deve conter "VITE_GROQ_API_KEY=sua-chave-groq" sem aspas.
- Adicione um arquivo 'serviceAccountKey.js' sem aspas na pasta 'meusiteja-pi-2025\src\config' com seu Config SDK do seu banco de dados web app do firebase. Ex:

```
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "...",
  measurementId: "..."
};
```

### Execute o projeto

```bash
npm run dev
```

A aplicação estará disponível em:

```
http://localhost:5173
```

---

## 🛣️ Rotas

| Rota | Descrição |
|------|-----------|
| `/` | Página inicial (Hero) |
| `/criar` | Cadastro do portfólio |
| `/preview` | Visualização antes da publicação |
| `/galeria` | Lista de portfólios públicos |
| `/portfolio/:subdominio` | Página pública do usuário |

## 👨‍💻 Desenvolvedores

Projeto desenvolvido como **Projeto Integrador (PI) 2026**.

Equipe:
- Kauan Balestrin
- Lorenzo Farina
- Gabriel Silva
- Breno Farina
- Miguel Gasperini

---

## 📄 Licença

Este projeto foi desenvolvido para fins acadêmicos.

