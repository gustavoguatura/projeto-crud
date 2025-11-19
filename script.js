// script.js
document.addEventListener('DOMContentLoaded', () => {
  const formProduto = document.getElementById('form-produto');
  const tabelaProdutosBody = document.querySelector('#tabela-produtos tbody');
  
  // 1. Função para Obter Produtos do LocalStorage
  function getProdutos() {
      const produtos = localStorage.getItem('znh_produtos');
      return produtos ? JSON.parse(produtos) : [];
  }

  // 2. Função para Salvar Produtos no LocalStorage
  function saveProdutos(produtos) {
      localStorage.setItem('znh_produtos', JSON.stringify(produtos));
  }

  // 3. Função de Renderização (READ)
  function renderProdutos() {
      const produtos = getProdutos();
      tabelaProdutosBody.innerHTML = ''; // Limpa a tabela antes de preencher

      if (produtos.length === 0) {
          tabelaProdutosBody.innerHTML = '<tr><td colspan="4" style="text-align: center;">Nenhum produto cadastrado.</td></tr>';
          return;
      }

      produtos.forEach(produto => {
          const row = tabelaProdutosBody.insertRow();
          row.insertCell().textContent = produto.id;
          row.insertCell().textContent = produto.nome;
          row.insertCell().textContent = `R$ ${parseFloat(produto.preco).toFixed(2)}`;
          
          const cellAcoes = row.insertCell();
          
          // Botão Editar
          const btnEditar = document.createElement('button');
          btnEditar.textContent = 'Editar';
          btnEditar.className = 'btn-crud btn-editar';
          btnEditar.onclick = () => carregarProduto(produto.id);
          cellAcoes.appendChild(btnEditar);

          // Botão Excluir
          const btnExcluir = document.createElement('button');
          btnExcluir.textContent = 'Excluir';
          btnExcluir.className = 'btn-crud btn-excluir';
          btnExcluir.onclick = () => excluirProduto(produto.id);
          cellAcoes.appendChild(btnExcluir);
      });
  }

  // 4. Função para Cadastrar/Atualizar (CREATE/UPDATE)
  formProduto.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const id = document.getElementById('produto-id').value;
      const nome = document.getElementById('nome').value;
      const preco = document.getElementById('preco').value;
      const imagemUrl = document.getElementById('imagem-url').value;
      const descricao = document.getElementById('descricao').value;

      const produtoData = { nome, preco, imagemUrl, descricao };
      let produtos = getProdutos();

      if (id) {
          // Se tem ID, é uma ATUALIZAÇÃO
          const index = produtos.findIndex(p => p.id == id);
          if (index !== -1) {
              produtos[index] = { ...produtos[index], ...produtoData };
          }
      } else {
          // Se não tem ID, é um NOVO CADASTRO
          const novoId = produtos.length > 0 ? Math.max(...produtos.map(p => p.id)) + 1 : 1;
          produtos.push({ id: novoId, ...produtoData });
      }

      saveProdutos(produtos);
      formProduto.reset();
      document.getElementById('produto-id').value = ''; // Limpa o ID após salvar
      renderProdutos();
      alert(`Produto ${id ? 'atualizado' : 'cadastrado'} com sucesso!`);
  });

  // 5. Função para Carregar Produto para Edição
  function carregarProduto(id) {
      const produtos = getProdutos();
      const produto = produtos.find(p => p.id == id);
      
      if (produto) {
          document.getElementById('produto-id').value = produto.id;
          document.getElementById('nome').value = produto.nome;
          document.getElementById('preco').value = produto.preco;
          document.getElementById('imagem-url').value = produto.imagemUrl;
          document.getElementById('descricao').value = produto.descricao;
          document.getElementById('btn-salvar').textContent = 'Atualizar Produto';
          window.scrollTo({ top: 0, behavior: 'smooth' }); // Volta ao topo para editar
      }
  }

  // 6. Função para Excluir (DELETE)
  window.excluirProduto = function(id) { // Colocamos no window para ser acessível pelo onclick
      if (confirm('Tem certeza que deseja excluir este produto?')) {
          let produtos = getProdutos();
          produtos = produtos.filter(p => p.id != id);
          saveProdutos(produtos);
          renderProdutos();
          alert('Produto excluído!');
      }
  }

  // 7. Evento para Limpar/Cancelar Edição
  document.getElementById('btn-cancelar').addEventListener('click', () => {
      document.getElementById('produto-id').value = '';
      document.getElementById('btn-salvar').textContent = 'Salvar Produto';
  });

  // Renderiza a lista inicial ao carregar a página
  renderProdutos();
});