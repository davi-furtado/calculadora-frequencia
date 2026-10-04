const formulario = document.querySelector('#formulario')
const faltadasInput = document.querySelector('#faltadas')
const dadasInput = document.querySelector('#dadas')
const totaisInput = document.querySelector('#totais')
const maxFaltasInput = document.querySelector('#maxFaltas')
const resultado = document.querySelector('#resultado')

function calcularPorcentagem(faltadas, aulas) {
  return (faltadas / aulas) * 100
}

function calcularMaximoDeFaltas(totais, limite) {
  return Math.floor(totais * limite)
}

function calcularFaltasRestantes(faltadas, totais, limite) {
  const maximo = calcularMaximoDeFaltas(totais, limite)
  return Math.max(0, maximo - faltadas)
}

function calcularFaltasPossiveis(faltadas, dadas, limite) {
  if (limite >= 1) {
    return Infinity
  }
  return Math.max(0, Math.floor((limite * dadas - faltadas) / (1 - limite)))
}

function validarDados(faltadas, dadas, totais, maxFaltas) {
  if (!Number.isFinite(faltadas)) {
    return 'Informe a quantidade de aulas faltadas.'
  }
  if (!Number.isFinite(maxFaltas)) {
    return 'Informe a porcentagem máxima de faltas.'
  }
  if (!Number.isFinite(dadas) && !Number.isFinite(totais)) {
    return 'Informe as aulas dadas ou as aulas totais.'
  }
  if (faltadas < 0) {
    return 'As faltas não podem ser negativas.'
  }
  if (Number.isFinite(dadas) && dadas <= 0) {
    return 'As aulas dadas devem ser maiores que zero.'
  }
  if (Number.isFinite(totais) && totais <= 0) {
    return 'As aulas totais devem ser maiores que zero.'
  }
  if (Number.isFinite(dadas) && Number.isFinite(totais) && dadas > totais) {
    return 'As aulas dadas não podem ser maiores que as aulas totais.'
  }
  if (Number.isFinite(dadas) && faltadas > dadas) {
    return 'As faltas não podem ser maiores que as aulas dadas.'
  }
  if (Number.isFinite(totais) && faltadas > totais) {
    return 'As faltas não podem ser maiores que as aulas totais.'
  }
  if (maxFaltas < 0 || maxFaltas > 100) {
    return 'A porcentagem máxima deve estar entre 0% e 100%.'
  }
  return null
}

function mostrarResultado(tipo, titulo, conteudo) {
  resultado.className = `resultado ${tipo}`
  resultado.innerHTML = `
        <h2>${titulo}</h2>
        ${conteudo}
    `
}

formulario.addEventListener('submit', (event) => {
  event.preventDefault()
  const faltadas = Number(faltadasInput.value)
  const dadas = dadasInput.value ? Number(dadasInput.value) : null
  const totais = totaisInput.value ? Number(totaisInput.value) : null
  const maxFaltas = Number(maxFaltasInput.value)
  const erro = validarDados(faltadas, dadas, totais, maxFaltas)
  if (erro) {
    mostrarResultado(
      'erro',
      'Dados inválidos',
      `<p class="erro-texto">${erro}</p>`
    )
    return
  }
  const limite = maxFaltas / 100
  let conteudo = ''

  /*
   * MODO 1:
   * Aulas dadas informadas.
   */
  if (Number.isFinite(dadas)) {
    const porcentagemAtual = calcularPorcentagem(faltadas, dadas)
    conteudo += `
              <p>
                <strong>Porcentagem atual:</strong>
                ${porcentagemAtual.toFixed(2)}%
              </p>
        `
    if (porcentagemAtual > maxFaltas) {
      mostrarResultado(
        'erro',
        'Limite ultrapassado',
        `<p>
          Você está com
          <strong>${porcentagemAtual.toFixed(2)}%</strong>
          de faltas.
        </p>
        <p>
          O limite é de
          <strong>${maxFaltas}%</strong>.
        </p>`
      )
      return
    }
    if (porcentagemAtual === maxFaltas) {
      conteudo += `
                <p>
                  Você atingiu o limite atual de
                  <strong>${maxFaltas}%</strong>.
                </p>
            `
    } else {
      const faltasPossiveis = calcularFaltasPossiveis(faltadas, dadas, limite)
      switch (faltasPossiveis) {
        case 0:
          conteudo += `
                    <p>
                      Considerando as aulas já dadas,
                      você não pode mais faltar.
                    </p>
                `
          break
        case 1:
          conteudo += `
                    <p>
                      Considerando as aulas já dadas,
                      você só pode faltar
                      <strong>UMA</strong>
                      aula.
                    </p>
                `
          break
        default:
          conteudo += `
                    <p>
                      Considerando as aulas já dadas,
                      você ainda pode faltar
                      <strong>${faltasPossiveis}</strong>
                      aula(s).
                    </p>
            `
      }
    }
  }

  /*
   * MODO 2:
   * Aulas totais informadas.
   */
  if (Number.isFinite(totais)) {
    const maximoDeFaltas = calcularMaximoDeFaltas(totais, limite)
    const faltasRestantes = calcularFaltasRestantes(faltadas, totais, limite)
    const aulasRestantes = Number.isFinite(dadas) ? totais - dadas : null
    conteudo += `
            <hr>
            <p>
                <strong>Aulas totais:</strong>
                ${totais}
            </p>
            <p>
                <strong>Máximo de faltas:</strong>
                ${maximoDeFaltas}
            </p>
            <p>
                <strong>Faltas restantes:</strong>
                ${faltasRestantes}
            </p>
        `
    if (Number.isFinite(aulasRestantes)) {
      conteudo += `
                <p>
                    <strong>Aulas restantes:</strong>
                    ${aulasRestantes}
                </p>
      `
    }
  }

  /*
   * Define o tipo visual do resultado.
   */
  const porcentagemAtual = Number.isFinite(dadas)
    ? calcularPorcentagem(faltadas, dadas)
    : null
  let tipo = 'sucesso'
  if (porcentagemAtual !== null && porcentagemAtual >= maxFaltas) {
    tipo = 'aviso'
  }
  mostrarResultado(tipo, 'Resultado', conteudo)
})
