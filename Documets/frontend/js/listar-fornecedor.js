const tabela = document.getElementById('tabela-fornecedores').querySelector('tbody');
console.log('Script carregado ✅');

async function carregarFornecedores() {
  tabela.innerHTML = '';
  try {
    const resposta = await fetch('http://localhost:3001/fornecedores');
    const fornecedores = await resposta.json();

    if (fornecedores.length === 0) {
      tabela.innerHTML = '<tr><td colspan="7">Nenhum fornecedor encontrado.</td></tr>';
      return;
    }

    fornecedores.forEach(f => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${f.id}</td>
        <td>${f.nome}</td>
        <td>${f.cnpj}</td>
        <td>${f.endereco}</td>
        <td>${f.telefone}</td>
        <td>${f.email}</td>
        <td>${f.contato}</td>
      `;
      tabela.appendChild(tr);
    });

  } catch (erro) {
    console.error('Erro ao carregar fornecedores:', erro);
    tabela.innerHTML = '<tr><td colspan="7">Erro ao carregar fornecedores.</td></tr>';
  }
}

carregarFornecedores();
