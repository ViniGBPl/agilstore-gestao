import { v4 as uuidv4 } from 'uuid';

export class Produto {
  constructor(nome, categoria, quantidade, preco, id = null) {
    this.id = id || uuidv4().substring(0, 8); // Gera ID único 
    this.nome = nome; 
    this.categoria = categoria; 
    this.quantidade = parseInt(quantidade); 
    this.preco = parseFloat(preco); 
  }
}