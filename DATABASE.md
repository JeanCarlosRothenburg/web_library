Parte 2: Arquivo DATABASE.md
Markdown
# 🗄️ Modelagem do Banco de Dados & Integração (Supabase)

Este documento descreve a estrutura de dados (entidades, campos e relacionamentos) e a arquitetura de comunicação utilizada na **Biblioteca Getúlio Vargas (BGV)** através do Supabase.

---

## 👥 1. Tabela: `profiles`
Armazena as informações adicionais dos usuários autenticados. Esta tabela possui uma relação de `1:1` com a tabela nativa de autenticação do Supabase (`auth.users`).

| Campo | Tipo | Regras / Restrições | Descrição |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | `PRIMARY KEY`, `REFERENCES auth.users(id)` | ID único do usuário (vinculado ao Auth) |
| `fullName` | `text` | `NOT NULL` | Nome completo do usuário |
| `updated_at`| `timestamp` | `DEFAULT now()` | Data da última atualização dos dados |

---

## 📚 2. Tabela: `books`
Contém o acervo de livros disponíveis na biblioteca para consulta e agendamento.

| Campo | Tipo | Regras / Restrições | Descrição |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | ID único do livro |
| `codigoLivro` | `text` | `UNIQUE`, `NOT NULL` | Código identificador (ex: BGV-101) |
| `title` | `text` | `NOT NULL` | Título do livro |
| `author` | `text` | `NOT NULL` | Autor da obra |
| `synopsis` | `text` | | Sinopse/Resumo do livro |
| `genre` | `text` | `NOT NULL` | Gênero literário (ex: Ficção, Técnico) |
| `publishedYear`| `integer`| `NOT NULL` | Ano de publicação |
| `pages` | `integer`| `NOT NULL` | Quantidade de páginas |
| `totalCopies` | `integer`| `NOT NULL`, `DEFAULT 1` | Quantidade total de cópias físicas |
| `availableCopies`| `integer`| `NOT NULL` | Cópias disponíveis para retirada no momento |
| `coverUrl` | `text` | `NULLABLE` | URL da imagem de capa (se houver) |
| `featuredRank` | `integer`| `DEFAULT 0` | Rank de destaque para exibição em carrosséis |

---

## 🗓️ 3. Tabela: `appointments`
Gerencia as solicitações de reservas e agendamentos de retiradas presenciais feitas pelos usuários.

| Campo | Tipo | Regras / Restrições | Descrição |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | ID único do agendamento |
| `user_id` | `uuid` | `REFERENCES profiles(id)`, `NOT NULL` | Usuário que solicitou a reserva |
| `book_id` | `uuid` | `REFERENCES books(id)`, `NOT NULL` | O livro que será retirado |
| `appointment_date`| `date` | `NOT NULL` | Data escolhida para a retirada presencial |
| `status` | `text` | `DEFAULT 'pending'` | Estado do agendamento (`pending`, `approved`, `completed`, `canceled`) |
| `created_at` | `timestamp`| `DEFAULT now()` | Data e hora em que a reserva foi feita |

---

## 🔄 Consumo de Dados (Contrato Equivalente de API)

A comunicação com o banco de dados ocorre diretamente via SDK do Supabase em TypeScript. As principais operações mapeadas na interface são:

### Autenticação (`src/hooks/useAuth.tsx`)
* **Cadastro:** `supabase.auth.signUp({ email, password })` seguido de um insert na tabela `profiles`.
* **Login:** `supabase.auth.signInWithPassword({ email, password })`.

### Acervo (`src/pages/BooksPage.tsx`)
* **Listagem Completa:** ```ts
  supabase.from('books').select('*').order('title');
Filtro por Código: ```ts
supabase.from('books').select('*').eq('codigoLivro', codigoLivro).single();


Agendamentos (src/pages/AppointmentsPage.tsx)
Criação de Reserva:

TypeScript
supabase.from('appointments').insert([{ user_id, book_id, appointment_date, status: 'pending' }]);
Listagem do Usuário:

TypeScript
supabase.from('appointments').select('*, books(*)').eq('user_id', currentUser.id);

---

Salve o arquivo `DATABASE.md`. Quando estiver pronto, mande o próximo **ok** para passarm
