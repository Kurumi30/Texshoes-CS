# Tex Shoes - E-commerce de Calçados 👟

![Tex Shoes Logo](./wwwroot/src/images/logo-without-bg.png)

Bem-vindo ao repositório oficial do projeto **Tex Shoes**, um e-commerce de calçados feitos sob encomenda. Esta aplicação web full-stack foi construída com .NET, com foco em ser uma plataforma robusta, performática e de fácil manutenção.

## ✨ Funcionalidades Principais

- **Catálogo de Produtos Dinâmico:** Os produtos são carregados a partir de um banco de dados, permitindo a fácil adição, remoção e edição de itens.
- **Carrinho de Compras Interativo:** Os utilizadores podem adicionar produtos ao carrinho, ajustar quantidades e ver o resumo do pedido em tempo real.
- **Painel de Administrador:** Uma área dedicada para a gestão de produtos, permitindo uma visão clara do stock e a edição de informações dos calçados.
- **Frontend Responsivo:** A interface foi construída para se adaptar a diferentes tamanhos de ecrã, desde desktops a dispositivos móveis.

## 🛠️ Tecnologias Utilizadas

- **Backend:** C# com **.NET 9** e ASP.NET Core Web API
- **Banco de Dados:** **SQLite** com Entity Framework Core (Code-First)
- **Frontend:** HTML5, CSS3 e JavaScript (ES6+)
- **Versionamento:** Git e GitHub

## 🚀 Como Começar (Guia de Instalação)

Siga os passos abaixo para configurar e executar o projeto no seu ambiente de desenvolvimento local.

### Pré-requisitos

- **SDK do .NET 9:** [Faça o download e instale a partir do site oficial da Microsoft](https://dotnet.microsoft.com/download/dotnet/9.0).

### Passos de Instalação

1.  **Clone o Repositório**

    ```sh
    git clone https://github.com/Kurumi30/Texshoes-CS.git
    cd Texshoes-CS

    ```

2.  **Restaure as Dependências**

    Antes de mais nada, restaure os pacotes do NuGet necessários para o projeto.

    ```sh
    dotnet restore
    ```

3.  **Inicialize o Banco de Dados**

    Com as dependências instaladas, crie e povoe o banco de dados. Para isso, criámos scripts de inicialização que preparam o ambiente para você. Execute o comando apropriado para o seu sistema operativo:

    - **No Windows:**
      ```bat
      reset-database.bat
      ```

    - **No Linux ou macOS:**
      ```sh
      ./reset-database.sh
      ```

    Este comando irá criar o ficheiro `texshoes.db` na raiz do projeto, pronto para ser usado.

4.  **Execute a Aplicação**

    Use o seguinte comando para iniciar o servidor de desenvolvimento. A aplicação será iniciada e ficará a observar alterações nos ficheiros.

    ```sh
    dotnet watch
    ```

    Após a execução, a aplicação estará disponível no endereço indicado no terminal (geralmente `http://localhost:5251` ou similar).

## 🗂️ Estrutura do Projeto

- **/Controllers:** Contém os controladores da API que gerem as requisições HTTP.
- **/Data:** Contém o `DbContext` do Entity Framework, as migrações e a classe `SeedData` para popular o banco de dados.
- **/Models:** Contém as classes de modelo (entidades) que representam os dados da aplicação.
- **/wwwroot:** Contém todos os ficheiros do frontend (HTML, CSS, JS, imagens).
- **reset-database.sh:** Script para recriar e inicializar a base de dados (Linux/macOS).
- **reset-database.bat:** Script para recriar e inicializar a base de dados (Windows).
- **texshoes.csproj:** Ficheiro de projeto do .NET que define as configurações e dependências (como a versão `net9.0`).
