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

  // Requisito 1: Adicionar Produto 
  async adicionar(dados) {
    const novoProduto = new Produto(dados.nome, dados.categoria, dados.quantidade, dados.preco);
    this.produtos.push(novoProduto);
    await this.storage.salvar(this.produtos); // Salvamento automático 
  }

  // Requisito 2: Listar Produtos [cite: 18]
  listar() {
    return this.produtos;
  }

  buscar(termo) {
    const termoBusca = termo.toLowerCase();

    // 1. Tenta encontrar um match EXATO (por ID ou Nome completo)
    const matchExato = this.produtos.filter(p => 
        p.id === termo || p.nome.toLowerCase() === termoBusca
    );

    // Se encontrou o produto específico exato, retorna apenas ele
    if (matchExato.length > 0) {
        return matchExato;
    }

    // 2. Se não houver match exato, retorna por parte do nome (conforme requisito 5)
    return this.produtos.filter(p => 
        p.nome.toLowerCase().includes(termoBusca)
    );
}

 
  // REQUISITO 3: Atualizar informações de um produto existente [cite: 31]
  async atualizar(id, novosDados) {
    const index = this.produtos.findIndex(p => p.id === id);
    if (index !== -1) {
      // Validação dos novos dados antes de salvar [cite: 34]
      const produtoAtualizado = {
        ...this.produtos[index],
        nome: novosDados.nome,
        categoria: novosDados.categoria,
        quantidade: parseInt(novosDados.quantidade),
        preco: parseFloat(novosDados.preco)
      };
      
      this.produtos[index] = produtoAtualizado;
      await this.storage.salvar(this.produtos); // Persistência automática [cite: 45]
      return true;
    }
    return false;
  }

  // REQUISITO 4: Remover um produto do inventário [cite: 35]
  async excluir(id) {
    const index = this.produtos.findIndex(p => p.id === id);
    if (index !== -1) {
      this.produtos.splice(index, 1); // Remover o produto 
      await this.storage.salvar(this.produtos); // Persistência automática [cite: 45]
      return true;
    }
    return false;
  }
}

