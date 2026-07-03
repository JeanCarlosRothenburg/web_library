
# 🤖 Registro de Uso de Inteligência Artificial (IA)

Este documento cumpre a exigência de transparência tecnológica descrita no checklist de avaliação, detalhando as ferramentas de Inteligência Artificial utilizadas no ciclo de desenvolvimento e documentação da **Biblioteca Getúlio Vargas (BGV)**.

---

## 🛠️ 1. Ferramenta Utilizada
* **IA:** Google Gemini.
* **Propósito Principal:** Assistência na resolução de problemas de ambiente, validação de arquitetura frontend e aceleração da escrita de documentações técnicas de conformidade.

---

## 🎯 2. Para que foi Utilizada?

A IA foi integrada como um copiloto técnico em três frentes principais:

1. **Diagnóstico de Compilação:** Resolução do erro crítico de escopo do compilador TypeScript (`Cannot find module 'react'`), gerado por desalinhamento de cache e configurações de resolução de módulos em estruturas baseadas em referências de projeto (`tsconfig.json`).
2. **Engenharia de Prompt para Documentação:** Geração automatizada de diagramas de tabelas em Markdown para o dicionário de dados do Supabase (`DATABASE.md`), traduzindo as interfaces em TypeScript existentes em esquemas SQL relacionais válidos.
3. **Análise de Riscos (Plano de Contingência):** Estruturação do fluxo de mitigação de problemas para a apresentação ao vivo (como falhas de conexão de rede ou perda de dados do banco de dados).

---

## ✅ 3. O que foi Aproveitado?

* **Configurações do Compilador:** A diretiva de configuração strita do TypeScript (`"moduleResolution": "bundler"` junto ao `"jsx": "react-jsx"`) sugerida para manter a compatibilidade com a pipeline moderna do Vite e React 19.
* **Modelagem Relacional:** A estrutura de mapeamento de chaves estrangeiras (`REFERENCES`) e tipos UUID utilizados na documentação de banco de dados, que refletem fielmente as tabelas consumidas pelo SDK do Supabase.
* **Estrutura de Scripts de Contingência:** A estratégia de build estático prévio combinado ao servidor de testes (`npm run build && npm run preview`) como alternativa segura ao modo de desenvolvimento em tempo real.

---

## ❌ 4. O que foi Descartado?

* **Configurações Obsoletas:** Sugestões iniciais baseadas no ecossistema do React 18 e Vite v5 (como o uso do parâmetro antigo `moduleResolution: "node"`), que geravam alertas de depreciação com o uso das ferramentas mais recentes do projeto (TypeScript ~6.0 e Vite v8).
* **Estruturas de Importação de Estilos:** Códigos gerados baseados em diretivas `@import` complexas do Tailwind CSS v3, descartados por completo devido à nova arquitetura simplificada e nativa da engine do Tailwind CSS v4 configurada na aplicação.
