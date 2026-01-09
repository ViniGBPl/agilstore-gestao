import inquirer from 'inquirer';
import chalk from 'chalk';
import { GerenciadorEstoque } from './services/EstoqueService.js';
import { JsonStorage } from './data/JsonStorage.js';

const storage = new JsonStorage('./inventory.json');
const estoque = new GerenciadorEstoque(storage);

async function iniciarApp() {
    await estoque.carregarDados(); 
    await menuPrincipal();
}

function mostrarCabecalho() {
    console.clear();
    console.log(chalk.bold.green('========================================='));
    console.log(chalk.bold.green('       AGILSTORE - GESTÃO DE ESTOQUE    '));
    console.log(chalk.bold.green('=========================================\n'));
}

async function menuPrincipal() {
    mostrarCabecalho();
    
    console.log('1. Adicionar Produto');
    console.log('2. Listar Produtos');
    console.log('3. Atualizar Produto');
    console.log('4. Excluir Produto');
    console.log('5. Buscar Produto');
    console.log('0. Sair\n');

    const { escolha } = await inquirer.prompt([
        {
            type: 'input',
            name: 'escolha',
            message: 'Digite o número da opção desejada:'
        }
    ]);

    switch (escolha) {
        case '1':
            await telaAdicionar(); 
            break;
        case '2':
            await telaListar(); 
            break;
        case '3':
            await telaAtualizar(); 
            break;
        case '4':
            await telaExcluir(); 
            break;
        case '5':
            await telaBuscar(); 
            break;
        case '0':
            console.log(chalk.yellow('\nSaindo... Dados salvos em JSON.'));
            process.exit();
            break;
        default:
            console.log(chalk.red('\nOpção inválida! Tente novamente.'));
            await new Promise(res => setTimeout(res, 1000));
    }

    await menuPrincipal(); 
}

async function telaAdicionar() {
    console.log(chalk.cyan('\n--- Cadastro de Novo Produto ---'));
    const dados = await inquirer.prompt([
        { name: 'nome', message: 'Nome do Produto:' }, 
        { name: 'categoria', message: 'Categoria:' }, 
        { name: 'quantidade', message: 'Quantidade:', type: 'number' }, 
        { name: 'preco', message: 'Preço:', type: 'number' } 
    ]);

    await estoque.adicionar(dados);
    console.log(chalk.green('\n✔ Produto adicionado com sucesso!'));
    await inquirer.prompt([{ type: 'input', name: 'p', message: 'Pressione Enter para voltar...' }]);
}

//Listar Produtos com Filtro e Ordenação [cite: 17, 30]
async function telaListar() {
    console.log(chalk.cyan('\n--- Opções de Listagem ---'));
    const { acao } = await inquirer.prompt([
        {
            type: 'input',
            name: 'acao',
            message: 'Deseja: (1) Listar tudo, (2) Filtrar por Categoria ou (3) Ordenar?',
            default: '1'
        }
    ]);

    let produtosParaExibir = [...estoque.listar()]; 

    if (acao === '2') {
        const { categoria } = await inquirer.prompt([{ name: 'categoria', message: 'Digite a categoria para filtrar:' }]);
        produtosParaExibir = produtosParaExibir.filter(p => p.categoria.toLowerCase() === categoria.toLowerCase());
    } else if (acao === '3') {
        const { criterio } = await inquirer.prompt([
            {
                type: 'input',
                name: 'criterio',
                message: 'Ordenar por: (1) Nome, (2) Quantidade ou (3) Preço?',
                default: '1'
            }
        ]);
        
        produtosParaExibir.sort((a, b) => {
            if (criterio === '2') return a.quantidade - b.quantidade;
            if (criterio === '3') return a.preco - b.preco;
            return a.nome.localeCompare(b.nome);
        });
    }

    if (produtosParaExibir.length === 0) {
        console.log(chalk.red('\nNenhum produto encontrado.'));
    } else {
        console.log('\n');
        // Exibe a tabela com as colunas exigidas: ID, Nome, Categoria, Qtd e Preço 
        console.table(produtosParaExibir.map(p => ({
            ID: p.id,
            'Nome do Produto': p.nome,
            'Categoria': p.categoria,
            'Qtd Estoque': p.quantidade,
            'Preço': `R$ ${p.preco.toFixed(2)}`
        })));
    }

    await inquirer.prompt([{ type: 'input', name: 'p', message: 'Pressione Enter para voltar ao menu...' }]);
}

async function telaBuscar() {
    // Permitir a busca por id ou por parte do nome do produto 
    const { termo } = await inquirer.prompt([{ name: 'termo', message: 'Buscar por ID ou Nome:' }]); 
    
    const resultados = estoque.buscar(termo);

    if (resultados.length > 0) {
        console.log(chalk.green(`\n${resultados.length} produto(s) encontrado(s):`));
        
        // Exibir todas as informações detalhadas do produto encontrado 
        // Mapeamos os dados 
        console.table(resultados.map(p => ({
            'ID': p.id,
            'Nome do Produto': p.nome,
            'Categoria': p.categoria,
            'Quantidade em Estoque': p.quantidade,
            'Preço': `R$ ${p.preco.toFixed(2)}`
        })));
    } else {
        // Exibir mensagem apropriada se nenhum produto for encontrado 
        console.log(chalk.red('\nNenhum produto encontrado com o termo informado. Verifique o ID ou o nome.')); 
    }

    await inquirer.prompt([{ type: 'input', name: 'p', message: 'Pressione Enter para voltar...' }]);
}

// Atualizar Produto
async function telaAtualizar() {
    const { id } = await inquirer.prompt([{ name: 'id', message: 'Digite o ID do produto que deseja atualizar:' }]);
    
    const resultados = estoque.buscar(id);
    const produto = resultados.find(p => p.id === id);

    if (!produto) {
        console.log(chalk.red('\nID não encontrado no inventário. [cite: 32]'));
    } else {
        console.log(chalk.cyan(`\nEditando: ${produto.nome}`));
        
        // Solicitar quais campos deseja atualizar 
        const { campos } = await inquirer.prompt([
            {
                type: 'checkbox',
                name: 'campos',
                message: 'Selecione os campos que deseja alterar:',
                choices: [
                    { name: 'Nome', value: 'nome' },
                    { name: 'Categoria', value: 'categoria' },
                    { name: 'Quantidade', value: 'quantidade' },
                    { name: 'Preço', value: 'preco' }
                ]
            }
        ]);

        if (campos.length === 0) {
            console.log(chalk.yellow('\nNenhuma alteração selecionada.'));
        } else {
            const perguntasEdicao = [];
            
            if (campos.includes('nome')) {
                perguntasEdicao.push({ name: 'nome', message: 'Novo Nome:', default: produto.nome });
            }
            if (campos.includes('categoria')) {
                perguntasEdicao.push({ name: 'categoria', message: 'Nova Categoria:', default: produto.categoria });
            }
            if (campos.includes('quantidade')) {
                perguntasEdicao.push({ 
                    name: 'quantidade', 
                    message: 'Nova Quantidade:', 
                    type: 'number', 
                    default: produto.quantidade,
                    validate: (v) => v >= 0 || 'A quantidade não pode ser negativa.' // Requisito: Validar dados 
                });
            }
            if (campos.includes('preco')) {
                perguntasEdicao.push({ 
                    name: 'preco', 
                    message: 'Novo Preço:', 
                    type: 'number', 
                    default: produto.preco,
                    validate: (v) => v >= 0 || 'O preço não pode ser negativo.' // Requisito: Validar dados 
                });
            }

            const novosDados = await inquirer.prompt(perguntasEdicao);
            
            // Mescla os dados antigos com os novos
            const produtoFinal = { ...produto, ...novosDados };
            
            await estoque.atualizar(id, produtoFinal); 
            console.log(chalk.green('\n✔ Produto atualizado com sucesso! '));
        }
    }
    await inquirer.prompt([{ type: 'input', name: 'p', message: 'Pressione Enter para continuar...' }]);
}
// Excluir Produto 
async function telaExcluir() {
    const { id } = await inquirer.prompt([{ name: 'id', message: 'Digite o ID do produto para remover:' }]);
    
    const resultados = estoque.buscar(id);
    const produto = resultados.find(p => p.id === id);

    if (!produto) {
        console.log(chalk.red('\nID não encontrado.'));
    } else {
        const { confirmar } = await inquirer.prompt([
            { type: 'confirm', name: 'confirmar', message: `Tem certeza que deseja excluir "${produto.nome}"?`, default: false }
        ]);

        if (confirmar) {
            await estoque.excluir(id); 
            console.log(chalk.green('\n✔ Produto removido com sucesso!'));
        } else {
            console.log(chalk.yellow('\nOperação cancelada.'));
        }
    }
    await inquirer.prompt([{ type: 'input', name: 'p', message: 'Pressione Enter para continuar...' }]);
}

iniciarApp();