# Tex Shoes - E-commerce de Calçados

Este é o repositório do projeto Tex Shoes, um e-commerce de calçados desenvolvido com .NET 9 e SQLite. A aplicação permite a visualização de produtos, gestão de carrinho de compras e um painel de administrador para gestão de stock.

## Tecnologias Utilizadas

- **Backend:** C# com .NET 9 e ASP.NET Core Web API
- **Banco de Dados:** SQLite com Entity Framework Core
- **Frontend:** HTML5, CSS3 e JavaScript (vanilla)

## Como Começar

Este projeto está configurado para ser executado facilmente no Firebase Studio ou em qualquer máquina com o SDK do .NET instalado. Abaixo estão os passos para configurar o ambiente de desenvolvimento.

### 1. Iniciar o Servidor

O servidor deve iniciar automaticamente quando o workspace é aberto no Firebase Studio. Se precisar de o iniciar manually, execute o seguinte comando no terminal:

```sh
dotnet watch
```

### 2. Inicializar o Banco de Dados

Para garantir que o seu ambiente comece com uma base de dados limpa e pronta a usar, criámos scripts de inicialização. Eles irão apagar qualquer banco de dados existente e criar um novo com os dados iniciais (produtos, etc.).

Escolha o comando apropriado para o seu sistema operativo:

**Para Windows:**

Abra o `cmd` ou `PowerShell` e execute o seguinte comando:

```bat
reset-database.bat
```

**Para Linux e macOS:**

Abra o terminal e execute o seguinte comando:

```sh
./reset-database.sh
```

Após a execução do script, o banco de dados `texshoes.db` será criado (ou recriado) na raiz do projeto, já populado com os dados necessários para começar a desenvolver. A aplicação pode então ser iniciada.

## Estrutura do Projeto

- **/Controllers:** Contém os controladores da API para sapatos, carrinho, etc.
- **/Data:** Contém o `DbContext` do Entity Framework, as migrações e o script de `SeedData`.
- **/Models:** Contém os modelos de dados (entidades) da aplicação.
- **/wwwroot:** Contém todos os ficheiros do frontend (HTML, CSS, JS, imagens).
- **reset-database.sh:** Script para recriar e inicializar a base de dados (Linux/macOS).
- **reset-database.bat:** Script para recriar e inicializar a base de dados (Windows).
