Parte 1: O Novo README.md
Markdown
# 📚 Biblioteca Getúlio Vargas (BGV)

O **BGV** é um sistema moderno de gerenciamento e agendamento presencial de retirada de livros. Desenvolvido para otimizar o fluxo de empréstimos físicos de uma biblioteca, o software permite que os usuários explorem o acervo completo, gerenciem suas seleções de leitura e agendem um horário para a retirada física dos exemplares diretamente na instituição.

---

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído utilizando o estado da arte do ecossistema Frontend moderno:

- **Core:** [React 19](https://react.dev/) & [TypeScript](https://www.typescriptlang.org/) (~6.0)
- **Build Tool:** [Vite](https://vite.dev/) (v8)
- **Estilização:** [Tailwind CSS v4](https://tailwindcss.com/) (utilizando a nova engine `@tailwindcss/vite`)
- **Roteamento:** [React Router Dom v7](https://reactrouter.com/home)
- **Backend as a Service (BaaS):** [Supabase](https://supabase.com/) (`@supabase/supabase-js` para autenticação e persistência)

---

## 🚀 Como Executar o Projeto Localmente

Siga os passos abaixo para clonar, configurar e rodar a aplicação em sua máquina:

### 1. Pré-requisitos
Certifique-se de ter o [Node.js](https://nodejs.org/) instalado em seu computador.

### 2. Instalar as Dependências
No terminal, acesse a pasta raiz do projeto e execute o comando abaixo para baixar os pacotes necessários:
```bash
npm install
3. Configurar as Variáveis de Ambiente
O projeto se integra ao Supabase para autenticação e banco de dados.

Duplique o arquivo .env.example na raiz do projeto.

Renomeie a cópia para .env.

Preencha as variáveis com as credenciais do seu projeto Supabase:

Snippet de código
VITE_SUPABASE_URL=[https://seu-projeto.supabase.co](https://seu-projeto.supabase.co)
VITE_SUPABASE_ANON_KEY=sua-chave-anonima-aqui
4. Executar em Modo de Desenvolvimento
Para iniciar o servidor local com Hot Module Replacement (HMR):

Bash
npm run dev
O terminal indicará o endereço local (geralmente http://localhost:5173). Abra-o no seu navegador.

5. Validar a Compilação (Build de Produção)
Para garantir que todos os tipos do TypeScript e arquivos estejam corretos para a entrega, você pode simular o build final de produção:

Bash
npm run build
🗺️ Estrutura de Rotas da Aplicação
A navegação da aplicação foi projetada de forma semântica e responsiva:

/ — Início: Painel principal com destaques do acervo.

/books — Acervo: Listagem completa com filtros, busca e sistema de seleção rápida para agendamento.

/books/:codigoLivro — Detalhes do Livro: Informações minuciosas, sinopse e disponibilidade de exemplares.

/appointments — Agendamentos: Gerenciamento das reservas de retirada de livros solicitadas pelo usuário.

/profile — Perfil: Dados da conta do usuário autenticado.

/login & /signup — Autenticação: Telas de entrada e registro integradas ao Supabase.

🎨 Design e UI/UX
A interface conta com suporte nativo a Light e Dark Mode baseado nas preferências do sistema ou escolha do usuário, utilizando variáveis customizadas injetadas no ecossistema do Tailwind CSS v4 para garantir consistência visual e alta acessibilidade.


---

Assim que você atualizar o arquivo no seu projeto e estiver pronto, mande um **ok** aqu
### 2. Instalar as Dependências
No terminal, acesse a pasta raiz do projeto e execute o comando abaixo para baixar os pacotes necessários:
```bash
npm install
