const modal = document.querySelector('.modal-container')
const tbody = document.querySelector('tbody')
const sNome = document.querySelector('#m-nome')
const sPosicao = document.querySelector('#m-posicao')
const sIdade = document.querySelector('#m-idade') // NOVO
const sNacionalidade = document.querySelector('#m-nacionalidade') // NOVO
const sAltura = document.querySelector('#m-altura') // ANTIGO sSalario
const sPeso = document.querySelector('#m-peso') // ANTIGO sTransferencia
const btnSalvar = document.querySelector('#btnSalvar')

let itens
let id

function openModal(edit = false, index = 0) {
  modal.classList.add('active')

  modal.onclick = e => {
    if (e.target.className.indexOf('modal-container') !== -1) {
      modal.classList.remove('active')
    }
  }

  if (edit) {
    sNome.value = itens[index].nome
    sPosicao.value = itens[index].posicao
    sIdade.value = itens[index].idade // NOVO
    sNacionalidade.value = itens[index].nacionalidade // NOVO
    sAltura.value = itens[index].altura // ALTERADO
    sPeso.value = itens[index].peso // ALTERADO
    id = index
  } else {
    // Limpar todos os campos ao abrir para novo registro
    sNome.value = ''
    sPosicao.value = ''
    sIdade.value = '' // NOVO
    sNacionalidade.value = '' // NOVO
    sAltura.value = '' // ALTERADO
    sPeso.value = '' // ALTERADO
    id = undefined
  }
  
}

function editItem(index) {
  openModal(true, index)
}

function deleteItem(index) {
  itens.splice(index, 1)
  setItensBD()
  loadItens()
}

// REMOVIDA A FUNÇÃO formatCurrency
/*
// Função utilitária para formatar valores monetários
const formatCurrency = (value) => {
    if (value === null || value === undefined || value === '') return 'R$ 0';
    return `R$ ${parseFloat(value).toLocaleString('pt-BR', { minimumFractionDigits: 0 })}`;
}
*/


function insertItem(item, index) {
  let tr = document.createElement('tr')
  
  // Função para formatar números com casas decimais (para Altura)
  const formatDecimal = (value) => {
      if (value === null || value === undefined || value === '') return 'N/A';
      return parseFloat(value).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  tr.innerHTML = `
    <td>${item.nome}</td>
    <td>${item.posicao}</td>
    <td>${item.idade}</td>
    <td>${item.nacionalidade}</td>
    <td class="data-numeric">${formatDecimal(item.altura)}</td>
    <td class="data-numeric">${item.peso}</td>
    <td class="acao">
      <button onclick="editItem(${index})"><i class='bx bx-edit' ></i></button>
    </td>
    <td class="acao">
      <button onclick="deleteItem(${index})"><i class='bx bx-trash'></i></button>
    </td>
  `
  tbody.appendChild(tr)
}

btnSalvar.onclick = e => {
  
  if (sNome.value === '' || sPosicao.value === '' || sIdade.value === '' || sNacionalidade.value === '' || sAltura.value === '' || sPeso.value === '') {
    alert('Preencha todos os campos obrigatórios.');
    return
  }

  e.preventDefault();

  const novoItem = {
    nome: sNome.value,
    posicao: sPosicao.value,
    idade: sIdade.value, // NOVO
    nacionalidade: sNacionalidade.value, // NOVO
    altura: sAltura.value, // ALTERADO
    peso: sPeso.value, // ALTERADO
  }

  if (id !== undefined) {
    // Edição
    itens[id] = novoItem;
  } else {
    // Inclusão
    itens.push(novoItem)
  }

  setItensBD()

  modal.classList.remove('active')
  loadItens()
  id = undefined
}

function loadItens() {
  itens = getItensBD()
  tbody.innerHTML = ''
  itens.forEach((item, index) => {
    insertItem(item, index)
  })

}

const getItensBD = () => JSON.parse(localStorage.getItem('dbfunc')) ?? []
const setItensBD = () => localStorage.setItem('dbfunc', JSON.stringify(itens))

loadItens()
// REMOVIDA A CHAVE EXTRA }