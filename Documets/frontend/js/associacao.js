// Aguarda o carregamento completo do DOM para executar o script
document.addEventListener('DOMContentLoaded', () => {
  
  // Elementos do DOM que vamos manipular
  const nomeProdutoEl = document.getElementById('nome-produto');
  const listaFornecedoresEl = document.getElementById('lista-fornecedores');
  const formAssociacao = document.getElementById('form-associacao');

  // 1. PEGAR O ID DO PRODUTO DA URL
  const urlParams = new URLSearchParams(window.location.search);
  const produtoId = urlParams.get('produto_id');

  // Se não houver ID na URL, exibe um erro e para a execução
  if (!produtoId) {
    nomeProdutoEl.textContent = 'Erro: ID do produto não encontrado na URL.';
    return;
  }

  // Função principal para carregar todos os dados necessários
  async function carregarDados() {
    try {
      // 2. BUSCAR TODOS OS DADOS EM PARALELO
      const [produtoResponse, todosFornecedoresResponse, fornecedoresAssociadosResponse] = await Promise.all([
        fetch(`/produtos/${produtoId}`),
        fetch('/fornecedores'),
        fetch(`/produtos/${produtoId}/fornecedores`)
      ]);

      // Verifica se todas as respostas da API foram bem-sucedidas
      if (!produtoResponse.ok || !todosFornecedoresResponse.ok || !fornecedoresAssociadosResponse.ok) {
        throw new Error('Falha ao buscar dados da API.');
      }

      // Converte as respostas para JSON
      const produto = await produtoResponse.json();
      const todosFornecedores = await todosFornecedoresResponse.json();
      const fornecedoresAssociados = await fornecedoresAssociadosResponse.json();

      // 3. ATUALIZAR A INTERFACE COM OS DADOS
      nomeProdutoEl.textContent = produto.nome; // Exibe o nome do produto
      renderizarListaFornecedores(todosFornecedores, fornecedoresAssociados);

    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      listaFornecedoresEl.innerHTML = '<p style="color: red;">Não foi possível carregar os dados. Verifique o console para mais detalhes.</p>';
    }
  }

  // Função para criar a lista de checkboxes na tela
  function renderizarListaFornecedores(todos, associados) {
    // Cria um Set com os IDs dos fornecedores já associados para busca rápida (O(1))
    const idsAssociados = new Set(associados.map(f => f.id));
    
    // Limpa a mensagem "Carregando..."
    listaFornecedoresEl.innerHTML = ''; 

    // Para cada fornecedor disponível...
    todos.forEach(fornecedor => {
      // Verifica se o fornecedor atual já está associado
      const isChecked = idsAssociados.has(fornecedor.id);
      
      // Cria o HTML para o item da lista
      const itemHTML = `
        <label class="fornecedor-item">
          <input type="checkbox" name="fornecedor" value="${fornecedor.id}" ${isChecked ? 'checked' : ''}>
          ${fornecedor.nome} (ID: ${fornecedor.id})
        </label>
      `;
      // Adiciona o item na div
      listaFornecedoresEl.insertAdjacentHTML('beforeend', itemHTML);
    });
  }
  
  // 4. LIDAR COM O ENVIO DO FORMULÁRIO (SALVAR)
  formAssociacao.addEventListener('submit', async (event) => {
    event.preventDefault(); // Impede o recarregamento da página

    // Pega todos os checkboxes que estão marcados
    const checkboxesMarcados = document.querySelectorAll('input[name="fornecedor"]:checked');
    
    // Extrai os IDs (que estão no atributo 'value') e converte para número
    const idsSelecionados = Array.from(checkboxesMarcados).map(cb => parseInt(cb.value));

    try {
      // Envia os dados para a API
      const response = await fetch(`/produtos/${produtoId}/fornecedores`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fornecedores_ids: idsSelecionados })
      });

      if (!response.ok) {
        throw new Error('Falha ao salvar as associações.');
      }

      alert('Associações salvas com sucesso!');
      // Opcional: redirecionar para a página de detalhes do produto
      // window.location.href = `/detalhes-produto.html?id=${produtoId}`;

    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Ocorreu um erro ao salvar. Tente novamente.');
    }
  });

  // Inicia todo o processo ao carregar a página
  carregarDados();
});