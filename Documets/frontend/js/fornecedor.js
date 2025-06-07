document.getElementById('form-fornecedor').addEventListener('submit', async (e) => {
  e.preventDefault();

  const dados = {
    nome: e.target.nome.value,
    cnpj: e.target.cnpj.value,
    endereco: e.target.endereco.value,
    telefone: e.target.telefone.value,
    email: e.target.email.value,
    contato: e.target.contato.value,
  };

  const resposta = await fetch('http://localhost:3001/fornecedores', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dados)
  });

  const resultado = await resposta.json();
  alert(resultado.mensagem || 'Fornecedor cadastrado com sucesso!');
  e.target.reset();
});
