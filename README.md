# 🚀 MeuSiteJá

> Crie e compartilhe seu portfólio profissional em poucos minutos.

O **MeuSiteJá** é uma plataforma web desenvolvida em **React + Firebase** que permite criar um portfólio online de forma prática e intuitiva. O usuário preenche suas informações, escolhe um tema e gera uma página pública para divulgar seu trabalho.

---

## 📖 Sobre o Projeto

O objetivo do projeto é facilitar a criação de portfólios digitais para estudantes, profissionais e freelancers, sem a necessidade de conhecimentos em programação.

Com poucos passos, é possível montar uma página contendo informações pessoais, formação, experiências, habilidades e formas de contato.

---

## ✨ Funcionalidades

- 👤 Cadastro de informações pessoais
- 📖 Seção "Sobre Mim"
- 💼 Experiências profissionais
- 🎓 Formação acadêmica
- 🛠️ Lista de habilidades
- 📞 Contatos e redes sociais
- 🎨 Escolha de paleta de cores
- 🖼️ Foto de perfil
- 🌐 Geração de página pública
- 🔥 Armazenamento em Firebase
- 📂 Galeria de portfólios publicados

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Função |
|------------|--------|
| React 19 | Interface da aplicação |
| Vite | Ambiente de desenvolvimento |
| React Router DOM | Gerenciamento de rotas |
| Firebase Firestore | Banco de dados |
| JavaScript ES6+ | Lógica da aplicação |
| CSS3 | Estilização |

---

## 📁 Estrutura do Projeto

```
src
│
├── components
│   ├── Header
│   ├── Footer
│   ├── Sobre
│   ├── Foto
│   ├── Formação
│   ├── Experiência
│   ├── Habilidades
│   ├── Contato
│   ├── Paleta
│   └── ...
│
├── pages
│   ├── Hero
│   ├── Formulario
│   ├── PortfolioView
│   ├── PortfolioPublico
│   └── Galeria
│
├── config
│   └── firebase.js
│
├── App.jsx
└── main.jsx
```

---

## ⚙️ Instalação

### Clone o repositório

```bash
git clone https://github.com/SEU-USUARIO/meusiteja.git
```

### Entre na pasta

```bash
cd meusiteja
```

### Instale as dependências

```bash
npm install
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
| `/` | Página inicial |
| `/criar` | Cadastro do portfólio |
| `/preview` | Visualização antes da publicação |
| `/galeria` | Lista de portfólios públicos |
| `/portfolio/:subdominio` | Página pública do usuário |

---

## 🔥 Configuração do Firebase

Crie um projeto no Firebase e configure o arquivo:

```
src/config/firebase.js
```

Exemplo:

```javascript
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};

export const app = initializeApp(firebaseConfig);
```

---

## 💡 Próximas Funcionalidades

- ✅ Login com Google
- ✅ Upload de imagem para Firebase Storage
- ✅ Edição de portfólio
- ✅ Exportação em PDF
- ✅ Temas personalizados
- ✅ Responsividade aprimorada
- ✅ Compartilhamento por QR Code

---

## 📸 Demonstração

Adicione aqui algumas imagens do projeto.

```
docs/

├── home.png
├── formulario.png
├── portfolio.png
└── galeria.png
```

Depois utilize:

```markdown
## Página Inicial

![Home](docs/home.png)

## Formulário

![Formulario](docs/formulario.png)

## Portfólio

![Portfolio](docs/portfolio.png)
```

---

## 🤝 Contribuição

Contribuições são bem-vindas!

1. Faça um Fork
2. Crie uma branch

```bash
git checkout -b minha-feature
```

3. Commit

```bash
git commit -m "Minha nova funcionalidade"
```

4. Push

```bash
git push origin minha-feature
```

5. Abra um Pull Request.

---

## 👨‍💻 Desenvolvedores

Projeto desenvolvido como **Projeto Integrador (PI) 2026**.

Equipe:
- Kauan Balestrin
- Lorenzo Farina
- Gabriel Pereira
- Breno Farina
- Miguel Gasperini

---

## 📄 Licença

Este projeto foi desenvolvido para fins acadêmicos.

---

# ⭐ Se este projeto foi útil para você, deixe uma estrela no repositório!
