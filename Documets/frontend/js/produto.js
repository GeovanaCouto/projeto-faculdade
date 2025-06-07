// Obtém o elemento do formulário e os parâmetros da URL.
const form = document.getElementById('form-produto');
const params = new URLSearchParams(window.location.search);
const id = params.get('id');

/**
 * Busca os dados de um produto na API e preenche o formulário para edição.
 * @param {string} id - O ID do produto a ser carregado.
 */
async function carregarProduto(id) {
  try {
    // Otimização sugerida: criar um endpoint na API para buscar um produto por ID.
    const resposta = await fetch(`http://localhost:3001/produtos`);
    const produtos = await resposta.json();
    const produto = produtos.find(p => p.id == id);

    if (produto) {
      // Preenche os campos do formulário com os dados do produto encontrado.
      form.nome.value = produto.nome;
      form.codigoBarras.value = produto.codigoBarras;
      form.descricao.value = produto.descricao;
      form.quantidade.value = produto.quantidade;
      form.categoria.value = produto.categoria;
      form.validade.value = produto.validade || '';
    }
  } catch (erro) {
    console.error('Erro ao carregar produto para edição:', erro);
  }
}

/**
 * Adiciona um ouvinte de evento para o envio do formulário.
 */
form.addEventListener('submit', async (e) => {
  // Impede o recarregamento padrão da página ao enviar o formulário.
  e.preventDefault(); 

  // Cria um objeto com os dados dos campos do formulário.
  const dados = {
    nome: form.nome.value,
    codigoBarras: form.codigoBarras.value,
    descricao: form.descricao.value,
    quantidade: Number(form.quantidade.value),
    categoria: form.categoria.value,
    validade: form.validade.value || null,
  };

  // Define a URL e o método (PUT para editar, POST para criar) com base na existência do ID.
  const url = id
    ? `http://localhost:3001/produtos/${id}`   // URL para ATUALIZAR
    : `http://localhost:3001/produtos`;        // URL para CRIAR

  const metodo = id ? 'PUT' : 'POST';

  try {
    // Realiza a requisição para a API.
    const resposta = await fetch(url, {
      method: metodo,
      headers: {
        'Content-Type': 'application/json' // Especifica que o corpo da requisição é JSON.
      },
      body: JSON.stringify(dados) // Converte o objeto de dados para uma string JSON.
    });

    const contentType = resposta.headers.get("content-type");

    // Verifica se a requisição falhou (ex: status 400, 500).
    if (!resposta.ok) {
        if (contentType && contentType.indexOf("text/html") !== -1) {
            throw new Error('Erro na API: O servidor retornou uma página HTML em vez de um erro JSON. Verifique o terminal do seu backend.');
        }
        const errorData = await resposta.json();
        throw new Error(errorData.message || 'Falha ao processar a requisição.');
    }
    
    // Verifica se a resposta da API é de fato JSON.
    if (!contentType || contentType.indexOf("application/json") === -1) {
      throw new Error('Resposta inesperada da API. O conteúdo não está em formato JSON.');
    }

    // Converte a resposta da API para um objeto JavaScript.
    const resultado = await resposta.json();

    // Linha para depuração: mostra a resposta da API no console.
    console.log('API respondeu com:', resultado);

    // Lógica de redirecionamento após o sucesso.
    if (id) {
      // Se estava editando, exibe alerta e redireciona para a lista.
      alert('Produto atualizado com sucesso!');
      window.location.href = 'listar-produtos.html';
    } else {
      // Se estava cadastrando, verifica se a API retornou um ID.
      if (resultado && resultado.id) {
        alert('Produto cadastrado com sucesso! Agora vamos associar os fornecedores.');
        // Redireciona para a página de associação com o ID do novo produto.
        window.location.href = `associar.html?produto_id=${resultado.id}`;
      } else {
        alert('Produto cadastrado, mas a API não retornou o ID. Não é possível redirecionar.');
      }
    }

  } catch (erro) {
    // Captura e exibe qualquer erro que ocorra durante o processo.
    console.error('Erro na requisição:', erro);
    alert(erro.message || 'Erro ao se conectar com o servidor.');
  }
});

/**
 * Bloco de inicialização do script.
 */
if (id) {
  // Se um ID existe na URL, configura a página para o modo de edição.
  document.querySelector('h2').textContent = 'Editar Produto';
  form.querySelector('button').textContent = 'Atualizar Produto';
  // Chama a função para carregar os dados do produto.
  carregarProduto(id);
}
