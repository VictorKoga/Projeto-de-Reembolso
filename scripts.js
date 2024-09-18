// Projeto Refund

// Seleciona os elementos do formulario DOM ou HTML
const form = document.querySelector("form")
const amount = document.getElementById("amount")
const expense = document.getElementById("expense")
const category = document.getElementById("category")
// Seleciona os elementos da lista
const expenseList = document.querySelector("ul")
const expensesTotals = document.querySelector("aside header h2")
const expensesQuantity = document.querySelector("aside header p span")
// Captura o evento de input para formatar o valor
amount.oninput = () =>{ // esse evento observa toda vez que entrar um conteudo no input e dispara esse evento
  // Removendo as letras dentro do input e aceita somente numeros. Obetendo o valor atual do input
  let value = amount.value.replace(/\D/g, "")// replace para remover as letras
  // Transformar o valor em centavos(exemplo: 150 / 100 = 1.50)
  value = Number(value) / 100
  // Atualiza o valor do input
  amount.value = formatCurrencyBRL(value)
}
// Formatando a moeda
function formatCurrencyBRL(value){
  // Utiliza o toLocaleStrin para formatar para o Brasil
  value = value.toLocaleString("pt-BR", {
    // Formata o valor no padrao BRL (Real Brasileiro)
    style: "currency",
    currency: "BRL",
  })
  // retorna o valor obtido na function formatCurrencyBRL para o amount.value
  return value
}
// Obtendo os dados do formulario

// Captura o evento de submit do formulario para obter os valores
form.onsubmit = (event) => {
  // Previne o comportamento padrao de recarregar a pagina
  event.preventDefault()// nao deixa recarregar a pagina
  // Cria um novo objeto com os detalhes da nova despesa
  const newExpense = {
    // pegar o timestamp desse momento
    id: new Date().getTime(), 
    // pegando o valor do proprio input declaro no topo
    expense: expense.value, 
    // o valor ID da categoria
    category_id: category.value, 
    // pega o valor nome da categoria name
    category_name: category.options[category.selectedIndex].text,
    amount: amount.value,
    created_at: new Date(),
  }
  // Chama a função que ira adicionar o item na lista
  expenseAdd(newExpense) 
}
// Criando a função para adicionar uma nova despesa
// Esse metodo adiciona um novo item na lista
function expenseAdd(newExpense){
  try {
    // Cria o elemento de li que é nosso item para adicionar o item na lista(ul)
    const expenseItem = document.createElement("li")
    // Adiciona a class expense ao item para dar estilo
    expenseItem.classList.add("expense")
    // Cria o icone da categoria
    const expenseIcon = document.createElement("img")
    // Define a imagem do icone da categoria
    expenseIcon.setAttribute("src",`img/${newExpense.category_id}.svg`)
    // Define o alt da imagem do icone da categoria
    expenseIcon.setAttribute("alt", newExpense.category_name)
    // Cria a info da despesa 
    const expenseInfo = document.createElement("div")
    // Cria a class expense-info dentro da div
    expenseInfo.classList.add("expense-info") 
    // Cria o nome da despesa
    const expenseName = document.createElement("strong")
    // passa para o elemento strong qual o nome da despesa
    expenseName.textContent = newExpense.expense 
    // Cria a categoria da despesa
    const expenseCategory = document.createElement("span")
    // passa para o elemento span qual a categoria da despesa
    expenseCategory.textContent = newExpense.category_name 
    // Adiciona nome e categoria na div das informações em expense-info
    expenseInfo.append(expenseName, expenseCategory)
    // Cria o valor da despesa
    const expenseAmount = document.createElement("span")
    // Cria a class expense-amount dentro do span
    expenseAmount.classList.add("expense-amount")
    // passa para o elemento span a cifra qual o valor da despesa
    expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount.toUpperCase().replace("R$", "")}`
    // Cria o icone de remover
    const removeIcon = document.createElement("img")
    // Adiciona a class remove-icon do HTML
    removeIcon.classList.add("remove-icon")
    // Atribui a class removeIcon o caminho da imagem
    removeIcon.setAttribute("src", "img/remove.svg")
    // Atribui a alt da imagem para informar o que significa
    removeIcon.setAttribute("alt", "remover")    
    // Adiciona as informações no item / ja temos o icon, a info, e o valor
    expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon)
    // Adiciona o item na lista
    expenseList.append(expenseItem)  
    //Limpa o formumario para adicionar um novo item
    formClear()
    // Atualiza os totais / Depois que passar todos os itens da nossa lista retorna
    updateTotals()
    
  } catch (error) {
    alert("Não foi possivel atualizar a lista de despesas...")
    console.log(error)    
  }  
}
// Atualiza os totais
function updateTotals(){
  try {
    //Recupera todos os itens que são (li) da lista (ul)
    const items = expenseList.children    
    // Atualiza a quantidade de itens da lista (li) fazendo uma interpolação 
    expensesQuantity.textContent = `${items.length} ${items.length > 1 ? "Despesas" : " Despesa"}`
    //Criar uma variavel pra incrementar o total. Calcular o total das despesas
    let total = 0     
    // Para cada item, verifica se ele é um li (item da lista) da lista (ul)
    for (let item = 0; item < items.length; item++) {
      const itemAmount = items[item].querySelector(".expense-amount");
      // Se o itemAmount existir, converte a string para um numero e adiciona ao total. O replace esta removendo os caracteres não numericos e substitui a virgula pelo ponto
      let value = itemAmount.textContent.replace(/[^\d,]/g, "").replace(",", ".")
      // Converte o valor para float
      value = parseFloat(value)

      // Verificar se é um numero valido
      if (isNaN(value)) {// Se nao for um numero ele da a mensagem se nao sai do if
        return alert("Não foi possivel calcular o total. O valor não parece ser um número")        
      }
      // Soma o valor ao total
      total += Number(value)
    }
    //Criar a span para adicionar o R$ formatado
    const symbolBRL = document.createElement("small")
    symbolBRL.textContent = "R$" 
    // formata o valor e remove o R$ que sera exibido pela small com um estilo customizado
    total = formatCurrencyBRL(total).toUpperCase().replace("R$", "")
    // Limpa o conteudo do elemento
    expensesTotals.innerHTML = ""
    // Adiciona o simbolo da moeda e o valor total formatado
    expensesTotals.append(symbolBRL, total)
  } catch (error) {
    alert("Não foi possivel atualizar os totais...")
    console.log(error)    
  }
}
// Evento que captura click nos items da lista
expenseList.addEventListener("click", function(event) {
  // Verificar se o elemento clicado é o icone de remover
  if (event.target.classList.contains("remove-icon")) {
    // Obtém a li pai do elemento clicado
    const item = event.target.closest(".expense")
    // Remove o item da lista
    item.remove()
  }
  // Atualiza os totais novamente
  updateTotals()
})
// Metodo para limpar os campos depois de inserido
function formClear(){
  // limpa os inputs
  expense.value = ""
  category.value = ""
  amount.value = ""
  // Coloca o foco no input de amount
  expense.focus()
}