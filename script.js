// script.js - Código Final Consolidado com CRUD, Vitrine Dinâmica e Modal de Compra
// script.js - CÓDIGO FINAL CONSOLIDADO COM CRUD, VITRINE E MODAL

document.addEventListener('DOMContentLoaded', () => {
    // Selectors para o CRUD
    const formProduto = document.getElementById('form-produto');
    const tabelaProdutosBody = document.querySelector('#tabela-produtos tbody');
    const mainAdmin = document.querySelector('main'); // Seleciona o conteúdo principal do CRUD

    // Selectors para o Modal e Vitrine
    const listaProdutosContainer = document.getElementById('lista-produtos');
    const modal = document.getElementById('modal-compra');
    const fecharBtn = document.querySelector('.fechar-btn');
    const formPedidoModal = document.getElementById('form-pedido-modal');
    
    let produtoSelecionado = {}; 

    // Dados estáticos para os destaques do index.html
    const produtosEstaticos = {
        101: { nome: 'Regata NBA - Houston Rockets', preco: 399.90, id: 101 },
        102: { nome: 'Calção FC Barcelona - 25/26', preco: 129.90, id: 102 },
        103: { nome: 'Boné New Era - Baltimore Ravens', preco: 175.00, id: 103 },
    };

    // --- LÓGICA DE PROTEÇÃO POR SENHA ---
    
    // DEFINA A SENHA AQUI:
    const SENHA_CORRETA = "admin123"; 

    function protegerAdminCrud() {
        if (!mainAdmin || !formProduto) return; // Se não estiver na página CRUD, ignora

        // Oculta o conteúdo principal por padrão
        mainAdmin.style.display = 'none';

        let senhaDigitada = prompt("⚠️ Esta é uma área restrita. Digite a senha de administrador para continuar:");

        // Verifica a senha
        if (senhaDigitada === SENHA_CORRETA) {
            mainAdmin.style.display = 'block'; // Exibe o conteúdo se a senha estiver correta
            renderTabelaProdutos(); // Renderiza a tabela do CRUD
        } else {
            alert("Senha incorreta ou cancelada. Acesso negado.");
            // Redireciona para a página inicial (index.html)
            window.location.href = 'index.html'; 
        }
    }

    // --- FUNÇÕES BÁSICAS DE LOCALSTORAGE ---

    function getProdutos() {
        const produtos = localStorage.getItem('znh_produtos');
        return produtos ? JSON.parse(produtos) : [];
    }

    function saveProdutos(produtos) {
        localStorage.setItem('znh_produtos', JSON.stringify(produtos));
    }

    // --- LÓGICA DO CRUD (crud-produtos.html) ---

    function renderTabelaProdutos() {
        // Esta função só é chamada após a autenticação bem-sucedida
        const produtos = getProdutos();
        tabelaProdutosBody.innerHTML = '';

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
            
            const btnEditar = document.createElement('button');
            btnEditar.textContent = 'Editar';
            btnEditar.className = 'btn-crud btn-editar';
            btnEditar.onclick = () => carregarProduto(produto.id);
            cellAcoes.appendChild(btnEditar);

            const btnExcluir = document.createElement('button');
            btnExcluir.textContent = 'Excluir';
            btnExcluir.className = 'btn-crud btn-excluir';
            btnExcluir.onclick = () => excluirProduto(produto.id);
            cellAcoes.appendChild(btnExcluir);
        });
    }

    if (formProduto) {
        // O restante da lógica de CRUD permanece a mesma
        formProduto.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const id = document.getElementById('produto-id').value;
            const nome = document.getElementById('nome').value;
            const preco = document.getElementById('preco').value;
            const imagemUrl = document.getElementById('imagem-url').value;
            const descricao = document.getElementById('descricao').value;

            if (!nome || !preco || !imagemUrl || !descricao) {
                alert('Por favor, preencha todos os campos!');
                return;
            }

            const produtoData = { nome, preco, imagemUrl, descricao };
            let produtos = getProdutos();

            if (id) {
                const index = produtos.findIndex(p => p.id == id);
                if (index !== -1) {
                    produtos[index] = { id: parseInt(id), ...produtoData };
                }
            } else {
                const novoId = produtos.length > 0 ? Math.max(...produtos.map(p => p.id)) + 1 : 1;
                produtos.push({ id: novoId, ...produtoData });
            }

            saveProdutos(produtos);
            formProduto.reset();
            document.getElementById('produto-id').value = ''; 
            document.getElementById('btn-salvar').textContent = 'Salvar Produto';
            renderTabelaProdutos(); 
            alert(`Produto ${id ? 'atualizado' : 'cadastrado'} com sucesso!`);
        });

        window.carregarProduto = function(id) {
            const produtos = getProdutos();
            const produto = produtos.find(p => p.id == id);
            
            if (produto) {
                document.getElementById('produto-id').value = produto.id;
                document.getElementById('nome').value = produto.nome;
                document.getElementById('preco').value = produto.preco;
                document.getElementById('imagem-url').value = produto.imagemUrl;
                document.getElementById('descricao').value = produto.descricao;
                document.getElementById('btn-salvar').textContent = 'Atualizar Produto';
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }

        window.excluirProduto = function(id) { 
            if (confirm('Tem certeza que deseja excluir este produto?')) {
                let produtos = getProdutos();
                produtos = produtos.filter(p => p.id != id);
                saveProdutos(produtos);
                renderTabelaProdutos();
                alert('Produto excluído!');
            }
        }

        document.getElementById('btn-cancelar').addEventListener('click', () => {
            document.getElementById('produto-id').value = '';
            document.getElementById('btn-salvar').textContent = 'Salvar Produto';
            formProduto.reset();
        });

        // CHAMA A FUNÇÃO DE PROTEÇÃO AQUI
        protegerAdminCrud();
    }


    // --- LÓGICA DA VITRINE E MODAL (NÃO REQUER SENHA) ---

    function renderProdutosNaVitrine() {
        if (!listaProdutosContainer) return; 

        const produtos = getProdutos();
        listaProdutosContainer.innerHTML = '';

        if (produtos.length === 0) {
            listaProdutosContainer.innerHTML = '<p style="text-align: center; width: 100%;">Nenhum produto cadastrado no momento.</p>';
            return;
        }

        produtos.forEach(produto => {
            const card = document.createElement('div');
            card.className = 'card-produto';
            
            card.innerHTML = `
                <div class="espaco-imagem">
                    <img src="${produto.imagemUrl}" alt="${produto.nome}">
                </div>
                <h3>${produto.nome}</h3>
                <p>${produto.descricao}</p>
                <p class="preco">R$ ${parseFloat(produto.preco).toFixed(2)}</p>
                <button class="btn-detalhes" onclick="abrirModal(${produto.id})">Comprar/Avaliar</button>
            `;
            
            listaProdutosContainer.appendChild(card);
        });
    }

    if (listaProdutosContainer) {
        renderProdutosNaVitrine();
    }


    // Lógica do Modal (abrirModal, fechar modal e enviar WhatsApp)
    
    window.abrirModal = function(id) {
        let produto;
        const produtosSalvos = getProdutos();
        
        // 1. Tenta encontrar no LocalStorage (produtos dinâmicos)
        produto = produtosSalvos.find(p => p.id == id);
        
        // 2. Se não encontrar, tenta usar os dados estáticos (produtos do index.html)
        if (!produto) {
             produto = produtosEstaticos[id];
        }
        
        if (produto && modal) {
            produtoSelecionado = { 
                nome: produto.nome, 
                preco: parseFloat(produto.preco) 
            };
            
            document.getElementById('modal-titulo').textContent = produto.nome;
            document.getElementById('modal-preco').textContent = `Preço: R$ ${produtoSelecionado.preco.toFixed(2)}`;
            
            document.getElementById('avaliacoes-espaco').innerHTML = '<p>⭐ ⭐ ⭐ ⭐ (4.0) | Baseado em 12 avaliações (Simulação).</p><p>As avaliações completas apareceriam aqui.</p>';

            modal.style.display = 'block';
        } else if (modal) {
             alert('Produto não encontrado no cadastro ou nos destaques.');
        }
    }

    if (modal) {
        fecharBtn.onclick = function() {
            modal.style.display = 'none';
            formPedidoModal.reset();
        }

        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = 'none';
                formPedidoModal.reset();
            }
        }
    }
    
    if (formPedidoModal) {
        formPedidoModal.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const tamanho = document.getElementById('tamanho-modal').value.trim();
            const cep = document.getElementById('cep-modal').value.trim();
            const obs = document.getElementById('observacao-modal').value.trim();
            
            const numero = '55XX9XXXXXXXX'; 
            
            let mensagem = `Olá, gostaria de finalizar a compra do produto:\n\n`;
            mensagem += `*Produto:* ${produtoSelecionado.nome}\n`;
            mensagem += `*Preço:* R$ ${produtoSelecionado.preco.toFixed(2)}\n`;
            mensagem += `*Tamanho/Opção:* ${tamanho}\n`;
            mensagem += `*CEP (Frete):* ${cep}\n`;
            
            if (obs) {
                mensagem += `*Obs:* ${obs}\n`;
            }
            
            mensagem += `\nAguardo confirmação de estoque e valor do frete.`;

            const link = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
            window.open(link, '_blank');
            
            modal.style.display = 'none'; 
            formPedidoModal.reset();
        });
    }
});