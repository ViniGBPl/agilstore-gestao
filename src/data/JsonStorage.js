import fs from 'fs/promises';

export class JsonStorage {
  constructor(filePath) {
    this.filePath = filePath;
  }

  // Lê os dados do arquivo ou retorna um array vazio se não existir
  async ler() {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      // Se o arquivo não existir, retorna array vazio para o inventário
      return [];
    }
  }

  // Salva os dados no arquivo formatados para fácil leitura humana
  async salvar(dados) {
    try {
      await fs.writeFile(this.filePath, JSON.stringify(dados, null, 2));
    } catch (error) {
      console.error("Erro ao salvar os dados:", error);
    }
  }
}