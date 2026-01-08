import { Produto } from '../models/Produto.js';

export class GerenciadorEstoque {
  constructor(storageService) {
    this.produtos = [];
    this.storage = storageService;
  }

  // Carrega os produtos do arquivo JSON ao iniciar a aplicação 
  async carregarDados() {
    const dadosBrutos = await this.storage.ler();
    // Transforma os dados puros do JSON de volta em instâncias da classe Produto
    this.produtos = dadosBrutos.map(p => new Produto(p.nome, p.categoria, p.quantidade, p.preco, p.id));
  }

  // Requisito 1: Adicionar Produto [cite: 11]
  async adicionar(dados) {
    const novoProduto = new Produto(dados.nome, dados.categoria, dados.quantidade, dados.preco);
    this.produtos.push(novoProduto);
    await this.storage.salvar(this.produtos); // Salvamento automático 
  }

  // Requisito 2: Listar Produtos [cite: 18]
  listar() {
    return this.produtos;
  }

  // Requisito 5: Buscar Produto [cite: 39]
  buscar(termo) {
    return this.produtos.filter(p => 
      p.id.includes(termo) || 
      p.nome.toLowerCase().includes(termo.toLowerCase())
    );
  }

  // Métodos para Excluir e Atualizar virão aqui conforme avançarmos [cite: 31, 35]
}