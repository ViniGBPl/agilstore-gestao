import inquirer from 'inquirer';
import chalk from 'chalk';
import { GerenciadorEstoque } from './services/EstoqueService.js';
import { JsonStorage } from './data/JsonStorage.js';

const storage = new JsonStorage('./inventory.json');
const estoque = new GerenciadorEstoque(storage);

async function iniciarApp() {
    await estoque.carregarDados();
    mostrarBoasVindas();
    await menuPrincipal(); // Inicia o loop
}

function mostrarBoasVindas() {
    console.clear();
    console.log(chalk.bold.green('========================================='));
    console.log(chalk.bold.green('       AGILSTORE - GESTÃO DE ESTOQUE    '));
    console.log(chalk.bold.green('=========================================\n'));
}

async function menuPrincipal() {
    const { opcao } = await inquirer.prompt([
        {
            type: 'list',
            name: 'opcao',
            message: 'Selecione uma opção:',
            choices: [
                '1. Adicionar Produto',
                '2. Listar Produtos',
                '3. Atualizar Produto',
                '4. Excluir Produto',
                '5. Buscar Produto',
                new inquirer.Separator(),
                'Sair'
            ]
        }
    ]);

    switch (opcao) {
        case '1. Adicionar Produto':
            await telaAdicionar();
            break;
        case '2. Listar Produtos':
            await telaListar();
            break;
        case '5. Buscar Produto':
            await telaBuscar();
            break;
        case 'Sair':
            console.log(chalk.yellow('\nSaindo... Dados salvos com segurança. '));
            process.exit();
            break;
    }

    // Chama o menu novamente para manter o app rodando
    await menuPrincipal();
}

async function telaAdicionar() {
    console.log(chalk.cyan('\n--- Cadastro de Novo Produto [cite: 11] ---'));
    const dados = await inquirer.prompt([
        { name: 'nome', message: 'Nome do Produto: [cite: 13]' },
        { name: 'categoria', message: 'Categoria: [cite: 14]' },
        { name: 'quantidade', message: 'Quantidade em Estoque: [cite: 15]', type: 'number' },
        { name: 'preco', message: 'Preço: [cite: 16]', type: 'number' }
    ]);

    await estoque.adicionar(dados);
    console.log(chalk.green('\n✔ Produto adicionado com sucesso!'));
}

async function telaListar() {
    console.log(chalk.cyan('\n--- Inventário Atual [cite: 17] ---'));
    const produtos = estoque.listar();
    if (produtos.length === 0) {
        console.log(chalk.red('O estoque está vazio no momento. [cite: 42]'));
    } else {
        console.table(produtos); // Exibe colunas ID, Nome, Categoria, Qtd e Preço [cite: 18, 19, 20, 21, 22, 29]
    }
    await inquirer.prompt([{ type: 'input', name: 'p', message: 'Pressione Enter para continuar...' }]);
}

async function telaBuscar() {
    const { termo } = await inquirer.prompt([{ name: 'termo', message: 'Buscar por ID ou Nome: [cite: 40]' }]);
    const resultados = estoque.buscar(termo);
    if (resultados.length > 0) {
        console.table(resultados);
    } else {
        console.log(chalk.red('\nNenhum produto encontrado. [cite: 42]'));
    }
    await inquirer.prompt([{ type: 'input', name: 'p', message: 'Pressione Enter para continuar...' }]);
}

iniciarApp();