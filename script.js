const modal = document.querySelector('.modal-container')
const tbody = document.querySelector('tbody')
const sNome = document.querySelector('#m-nome')
const sPosicao = document.querySelector('#m-posicao')
const sIdade = document.querySelector('#m-idade') // NOVO
const sNacionalidade = document.querySelector('#m-nacionalidade') // NOVO
const sSalario = document.querySelector('#m-salario')
const sTransferencia = document.querySelector('#m-transferencia') // NOVO
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
    sSalario.value = itens[index].salario
    sTransferencia.value = itens[index].transferencia // NOVO
    id = index
  } else {
    // Limpar todos os campos ao abrir para novo registro
    sNome.value = ''
    sPosicao.value = ''
    sIdade.value = '' // NOVO
    sNacionalidade.value = '' // NOVO
    sSalario.value = ''
    sTransferencia.value = '' // NOVO
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

// Função utilitária para formatar valores monetários
const formatCurrency = (value) => {
    if (value === null || value === undefined || value === '') return 'R$ 0';
    return `R$ ${parseFloat(value).toLocaleString('pt-BR', { minimumFractionDigits: 0 })}`;
}


function insertItem(item, index) {
  let tr = document.createElement('tr')

  tr.innerHTML = `
    <td>${item.nome}</td>
    <td>${item.posicao}</td>
    <td>${item.idade}</td>
    <td>${item.nacionalidade}</td>
    <td class="data-numeric">${formatCurrency(item.salario)}</td>
    <td class="data-numeric">${formatCurrency(item.transferencia)}</td>
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
  
  if (sNome.value === '' || sPosicao.value === '' || sIdade.value === '' || sNacionalidade.value === '' || sSalario.value === '' || sTransferencia.value === '') {
    alert('Preencha todos os campos obrigatórios.');
    return
  }

  e.preventDefault();

  const novoItem = {
    nome: sNome.value,
    posicao: sPosicao.value,
    idade: sIdade.value, // NOVO
    nacionalidade: sNacionalidade.value, // NOVO
    salario: sSalario.value,
    transferencia: sTransferencia.value, // NOVO
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