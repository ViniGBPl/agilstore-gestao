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

  //  Adicionar Produto 
  async adicionar(dados) {
    const novoProduto = new Produto(dados.nome, dados.categoria, dados.quantidade, dados.preco);
    this.produtos.push(novoProduto);
    await this.storage.salvar(this.produtos); // Salvamento automático 
  }

  // Listar Produtos 
  listar() {
    return this.produtos;
  }

  buscar(termo) {
    const termoBusca = termo.toLowerCase();

    // Tenta encontrar um match EXATO (por ID ou Nome completo)
    const matchExato = this.produtos.filter(p => 
        p.id === termo || p.nome.toLowerCase() === termoBusca
    );

    // Se encontrou o produto específico exato, retorna apenas ele
    if (matchExato.length > 0) {
        return matchExato;
    }

    // 2. Se não houver match exato, retorna por parte do nome 
    return this.produtos.filter(p => 
        p.nome.toLowerCase().includes(termoBusca)
    );
}

 
  // Atualizar informações de um produto existente 
  async atualizar(id, novosDados) {
    const index = this.produtos.findIndex(p => p.id === id);
    if (index !== -1) {
      // Validação dos novos dados antes de salvar 
      const produtoAtualizado = {
        ...this.produtos[index],
        nome: novosDados.nome,
        categoria: novosDados.categoria,
        quantidade: parseInt(novosDados.quantidade),
        preco: parseFloat(novosDados.preco)
      };
      
      this.produtos[index] = produtoAtualizado;
      await this.storage.salvar(this.produtos); // Persistência automática 
      return true;
    }
    return false;
  }

  //Remover um produto do inventário 
  async excluir(id) {
    const index = this.produtos.findIndex(p => p.id === id);
    if (index !== -1) {
      this.produtos.splice(index, 1); // Remover o produto 
      await this.storage.salvar(this.produtos); // Persistência automática 
      return true;
    }
    return false;
  }
}

