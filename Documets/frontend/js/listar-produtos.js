const tabela = document.getElementById('tabela-produtos').querySelector('tbody');
// "async" (assíncrono) significa que uma função pode executar antes de carregar completamente
async function carregarProdutos() {
  tabela.innerHTML = '';
  try {
    const resposta = await fetch('http://localhost:3001/produtos');
    const produtos = await resposta.json();

    produtos.forEach(p => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${p.id}</td>
        <td>${p.nome}</td>
        <td>${p.codigoBarras}</td>
        <td>${p.descricao}</td>
        <td>${p.quantidade}</td>
        <td>${p.categoria}</td>
        <td>${p.validade || '-'}</td>
        <td>${p.imagem || '-'}</td>
        <td>
          <button onclick="editarProduto(${p.id})">Editar</button>
          <button onclick="excluirProduto(${p.id})">Excluir</button>
        </td>
      `;
      tabela.appendChild(tr);
    });
  } catch (erro) {
    tabela.innerHTML = '<tr><td colspan="9">Erro ao carregar produtos.</td></tr>';
    console.error(erro);
  }
}

async function excluirProduto(id) {
  if (confirm('Deseja realmente excluir este produto?')) {
    await fetch(`http://localhost:3001/produtos/${id}`, {
      method: 'DELETE'
    });
    carregarProdutos();
  }
}

function editarProduto(id) {
  window.location.href = `produto.html?id=${id}`;
}

carregarProdutos();
