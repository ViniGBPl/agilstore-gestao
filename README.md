# 📦 AgilStore - Sistema de Gestão de Inventário

O **AgilStore** é uma aplicação de linha de comando (CLI) desenvolvida em Node.js para automatizar o controlo de stock de uma loja de eletrónicos. O sistema permite o gerenciamento completo do ciclo de vida dos produtos, garantindo organização, persistência de dados e facilidade na localização de itens.

## 🚀 Funcionalidades Principais

O projeto foi construído para atender rigorosamente aos requisitos do desafio:

1.  **Adicionar Produto:** Cadastro de Nome, Categoria, Quantidade e Preço com geração automática de **ID único** (UUID).
2.  **Listar Produtos:** Visualização em tabela formatada com suporte a:
    * Filtro por categoria.
    * Ordenação por Nome, Quantidade ou Preço.
3.  **Atualizar Produto:** Edição seletiva de campos (Nome, Categoria, Quantidade ou Preço) com validação de entradas.
4.  **Excluir Produto:** Remoção de itens do inventário com verificação de ID e confirmação de segurança.
5.  **Buscar Produto:** Pesquisa detalhada por ID exato ou por parte do nome, exibindo informações completas.

## 💾 Persistência de Dados

Para cumprir os requisitos extras, o sistema utiliza salvamento automático em arquivo **JSON** (`inventory.json`). Isto garante que os dados não sejam perdidos ao encerrar a aplicação, sendo carregados automaticamente sempre que o programa é iniciado.

## 🛠️ Tecnologias Utilizadas

As principais ferramentas e bibliotecas utilizadas foram:
* **Node.js** (Ambiente de execução)
* **Inquirer.js:** Para a criação de menus interativos e captação de dados via terminal.
* **Chalk:** Para estilização de cores e feedback visual (sucesso/erro) no console.
* **UUID:** Para a geração de identificadores únicos para cada produto.
* **FS Promises:** Para a manipulação assíncrona do ficheiro de dados.

## 📁 Estrutura do Projeto

O código foi organizado seguindo princípios de **Orientação a Objetos**:
* `src/models/`: Contém a classe `Produto`.
* `src/services/`: Contém o `GerenciadorEstoque` (lógica de negócio).
* `src/data/`: Contém o `JsonStorage` (camada de persistência).
* `src/index.js`: Ponto de entrada que gere o menu e a interface com o utilizador.

## 📋 Como Rodar a Aplicação Localmente

### Pré-requisitos
Certifique-se de que tem o **Node.js** instalado na sua máquina.

### Instalação
1. Clone este repositório:
   ```bash
   git clone https://github.com/ViniGBPl/agilstore-gestao.git
   
   ```
2. Entre na pasta do projeto:
    ```bash
   cd agilstore-gestao
   ```
3. Instale as dependências necessárias:
   ```bash
   npm install
   ```
### Execução
Para iniciar o sistema, utilize o comando padrão:
 ```bash
  npm start
 ```



