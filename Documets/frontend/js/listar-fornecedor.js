const tabela = document.getElementById('tabela-fornecedores').querySelector('tbody');
console.log('Script carregado ✅');

async function carregarFornecedores() {
  tabela.innerHTML = ''; // Limpa a tabela antes de carregar
  try {
    const resposta = await fetch('http://localhost:3001/fornecedores');

    if (!resposta.ok) {
      throw new Error(`Erro na requisição: ${resposta.statusText}`);
    }

    // --- CORREÇÃO AQUI ---
    const dados = await resposta.json();
    const fornecedores = dados.fornecedores;
    // ---------------------

    if (!fornecedores || fornecedores.length === 0) {
      tabela.innerHTML = '<tr><td colspan="7">Nenhum fornecedor encontrado.</td></tr>';
      return;
    }

    fornecedores.forEach(f => {
      const tr = document.createElement('tr');
        tr.innerHTML = `
        <td>${p.id}</td>
        <td>${p.NomedaEmpresa}</td>
        <td>${p.cnpj}</td>
        <td>${p.Endereço}</td>
        <td>${p.Telefone}</td>
        <td>${p.Email}</td>
        <td>${p.Contato}</td>
        <td>
          <button onclick="editarFornecedor(${p.id})">Editar</button>
          <button onclick="excluirFornecedor(${p.id})">Excluir</button>
        </td>
      `;
      tabela.appendChild(tr);
    });

  } catch (erro) {
    console.error('Erro ao carregar fornecedores:', erro);
    tabela.innerHTML = '<tr><td colspan="7">Erro ao carregar fornecedores. Verifique o console.</td></tr>';
  }
}

async function excluirFornecedor(id) {
  if (confirm('Deseja realmente excluir este fornecedor?')) {
    await fetch(`http://localhost:3001/fornecedores/${id}`, {
      method: 'DELETE'
    });
    carregarProdutos();
  }
}

function editarFornecedor(id) {
  window.location.href = `fornecedor.html?id=${id}`;
}

carregarFornecedores();