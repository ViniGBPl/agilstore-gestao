import { v4 as uuidv4 } from 'uuid';

export class Produto {
  constructor(nome, categoria, quantidade, preco, id = null) {
    this.id = id || uuidv4().substring(0, 8); // Gera ID único 
    this.nome = nome; // [cite: 13]
    this.categoria = categoria; // [cite: 14]
    this.quantidade = parseInt(quantidade); // [cite: 15]
    this.preco = parseFloat(preco); // [cite: 16]
  }
}