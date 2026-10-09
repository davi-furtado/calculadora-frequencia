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
  const erros = []
  const adicionarErro = (campo, mensagem) => erros.push({ campo, mensagem })

  if (!Number.isFinite(faltadas)) {
    adicionarErro(faltadasInput, 'Informe a quantidade de aulas faltadas.')
  } else if (faltadas < 0) {
    adicionarErro(faltadasInput, 'As faltas não podem ser negativas.')
  }

  if (!Number.isFinite(maxFaltas)) {
    adicionarErro(maxFaltasInput, 'Informe a porcentagem máxima de faltas.')
  } else if (maxFaltas < 0 || maxFaltas > 100) {
    adicionarErro(
      maxFaltasInput,
      'A porcentagem máxima deve estar entre 0% e 100%.'
    )
  }

  if (!Number.isFinite(dadas) && !Number.isFinite(totais)) {
    adicionarErro(dadasInput, 'Informe as aulas dadas ou as aulas totais.')
    adicionarErro(totaisInput, 'Informe as aulas dadas ou as aulas totais.')
  }
  if (Number.isFinite(dadas) && dadas <= 0) {
    adicionarErro(dadasInput, 'As aulas dadas devem ser maiores que zero.')
  }
  if (Number.isFinite(totais) && totais <= 0) {
    adicionarErro(totaisInput, 'As aulas totais devem ser maiores que zero.')
  }
  if (Number.isFinite(dadas) && Number.isFinite(totais) && dadas > totais) {
    adicionarErro(
      dadasInput,
      'As aulas dadas não podem ser maiores que as aulas totais.'
    )
  }
  if (Number.isFinite(faltadas) && Number.isFinite(dadas) && faltadas > dadas) {
    adicionarErro(
      faltadasInput,
      'As faltas não podem ser maiores que as aulas dadas.'
    )
  }
  if (
    Number.isFinite(faltadas) &&
    Number.isFinite(totais) &&
    faltadas > totais
  ) {
    adicionarErro(
      faltadasInput,
      'As faltas não podem ser maiores que as aulas totais.'
    )
  }

  return erros
}

function limparValidacao() {
  formulario.classList.remove('was-validated')
  ;[faltadasInput, dadasInput, totaisInput, maxFaltasInput].forEach((campo) => {
    campo.classList.remove('is-invalid', 'is-valid')
    campo.setCustomValidity('')
  })
}

function aplicarValidacao(erros) {
  const errosPorCampo = new Map()
  erros.forEach(({ campo, mensagem }) => {
    if (!errosPorCampo.has(campo)) errosPorCampo.set(campo, mensagem)
  })

  ;[faltadasInput, dadasInput, totaisInput, maxFaltasInput].forEach((campo) => {
    const mensagem = errosPorCampo.get(campo)
    campo.setCustomValidity(mensagem || '')
    campo.classList.toggle('is-invalid', Boolean(mensagem))
    campo.classList.toggle(
      'is-valid',
      !mensagem && (campo.required || campo.value)
    )
  })
  formulario.classList.add('was-validated')

  return erros[0] || null
}

function mostrarResultado(tipo, titulo, conteudo) {
  const selos = {
    sucesso: 'Dentro do limite',
    aviso: 'Atenção',
    erro: 'Verifique os dados'
  }
  resultado.className = `resultado resultado-${tipo} mt-4`
  resultado.innerHTML = `
    <div class="d-flex flex-wrap align-items-start justify-content-between gap-3 mb-3">
      <div>
        <span class="resultado-rotulo">Resumo da frequência</span>
        <h2 class="h5 mb-0 mt-1">${titulo}</h2>
      </div>
      <span class="resultado-selo">${selos[tipo]}</span>
    </div>
    <div class="quadros row g-3">
      ${conteudo}
    </div>
  `
}

function criarMetrica(rotulo, valor, destaque = false) {
  return `
    <div class="col-6">
      <div class="metrica${destaque ? ' metrica-destaque' : ''}">
        <span class="metrica-rotulo">${rotulo}</span>
        <strong class="metrica-valor">${valor}</strong>
      </div>
    </div>
  `
}

function calcularUsoDoLimite(usado, maximo) {
  if (maximo > 0) {
    return (usado / maximo) * 100
  }
  return usado > 0 ? 100 : 0
}

function definirTom(usado, maximo) {
  if (usado > maximo) return 'erro'
  if (usado === maximo) return 'aviso'
  return 'sucesso'
}

function criarBarra(usoDoLimite, tom, legenda) {
  const largura = Math.min(100, Math.max(0, usoDoLimite))
  return `
    <div
      class="barra barra-${tom}"
      role="progressbar"
      aria-label="Parcela do limite de faltas já utilizada"
      aria-valuemin="0"
      aria-valuemax="100"
      aria-valuenow="${Math.round(largura)}"
    >
      <div class="barra-preenchimento" style="width: ${largura}%"></div>
    </div>
    <p class="barra-legenda">${legenda}</p>
  `
}

function formatarNumero(valor, casas = 1) {
  return valor.toLocaleString('pt-BR', {
    minimumFractionDigits: casas,
    maximumFractionDigits: casas
  })
}

function formatarQuantidade(quantidade, singular, plural = `${singular}s`) {
  switch (quantidade) {
    case 0:
      return `nenhuma ${singular}`
    case 1:
      return `uma ${singular}`
    default:
      return `${formatarNumero(quantidade, 0)} ${plural}`
  }
}

formulario.addEventListener('submit', (event) => {
  event.preventDefault()
  limparValidacao()
  const faltadas = Number(faltadasInput.value)
  const dadas = dadasInput.value ? Number(dadasInput.value) : null
  const totais = totaisInput.value ? Number(totaisInput.value) : null
  const maxFaltas = Number(maxFaltasInput.value)
  const erros = validarDados(faltadas, dadas, totais, maxFaltas)
  const erro = aplicarValidacao(erros)
  if (erro) {
    mostrarResultado(
      'erro',
      'Dados inválidos',
      `<section class="quadro quadro-erro col-md-12">
         <p class="resultado-erro-msg mb-2">${erro.mensagem}</p>
         <p class="resultado-texto mt-0 mb-0">Revise os campos informados e tente novamente.</p>
       </section>`
    )
    return
  }
  const limite = maxFaltas / 100
  let conteudo = ''
  let porcentagemAtual = null
  let limiteUltrapassado = false

  /*
   * MODO 1:
   * Aulas dadas informadas.
   */
  if (Number.isFinite(dadas)) {
    porcentagemAtual = calcularPorcentagem(faltadas, dadas)
    limiteUltrapassado = porcentagemAtual > maxFaltas
    const usoDoLimite = calcularUsoDoLimite(porcentagemAtual, maxFaltas)
    const tomDadas = definirTom(porcentagemAtual, maxFaltas)
    conteudo += `
      <section class="quadro quadro-${tomDadas} col-md-6">
        <h3 class="secao-titulo">Considerando as aulas dadas</h3>
        <div class="row g-3">
          ${criarMetrica('Faltas atuais', formatarNumero(faltadas, 0))}
          ${criarMetrica('Aulas dadas', formatarNumero(dadas, 0))}
          ${criarMetrica('Frequência de faltas', `${formatarNumero(porcentagemAtual)}%`, true)}
          ${criarMetrica('Limite permitido', `${formatarNumero(maxFaltas)}%`)}
        </div>
        ${criarBarra(usoDoLimite, tomDadas, `${formatarNumero(usoDoLimite, 0)}% do limite de faltas utilizado`)}
    `
    if (limiteUltrapassado) {
      conteudo += `
        <p class="resultado-texto">
          A porcentagem atual está acima do limite. Não há margem para novas faltas.
        </p>
      `
    } else if (porcentagemAtual === maxFaltas) {
      conteudo += `
        <p class="resultado-texto">
          Você atingiu o limite de <strong>${formatarNumero(maxFaltas)}%</strong>.
          Não há margem para novas faltas sem ultrapassá-lo.
        </p>
      `
    } else {
      const faltasPossiveis = calcularFaltasPossiveis(faltadas, dadas, limite)
      conteudo += `
        <div class="margem">
          <span class="margem-rotulo">Margem para novas faltas</span>
          <strong class="margem-valor">${formatarQuantidade(faltasPossiveis, 'aula')}</strong>
          <small>considerando as aulas já dadas</small>
        </div>
      `
    }
    conteudo += '</section>'
  }

  /*
   * MODO 2:
   * Aulas totais informadas.
   */
  if (Number.isFinite(totais)) {
    const maximoDeFaltas = calcularMaximoDeFaltas(totais, limite)
    const faltasRestantes = calcularFaltasRestantes(faltadas, totais, limite)
    const aulasRestantes = Number.isFinite(dadas) ? totais - dadas : null
    const usoDasFaltas = calcularUsoDoLimite(faltadas, maximoDeFaltas)
    const tomTotais = definirTom(faltadas, maximoDeFaltas)
    conteudo += `
      <section class="quadro quadro-${tomTotais} col-md-6">
        <h3 class="secao-titulo">Considerando as aulas totais</h3>
        <div class="row g-3">
          ${criarMetrica('Aulas totais', formatarNumero(totais, 0))}
          ${criarMetrica('Máximo de faltas', formatarNumero(maximoDeFaltas, 0))}
          ${criarMetrica('Faltas restantes', formatarNumero(faltasRestantes, 0), true)}
          ${Number.isFinite(aulasRestantes) ? criarMetrica('Aulas restantes', formatarNumero(aulasRestantes, 0)) : ''}
        </div>
        ${criarBarra(usoDasFaltas, tomTotais, `${formatarNumero(faltadas, 0)} de ${formatarNumero(maximoDeFaltas, 0)} faltas permitidas utilizadas`)}
    `
    if (Number.isFinite(aulasRestantes)) {
      let mensagemAulasRestantes
      switch (aulasRestantes) {
        case 0:
          mensagemAulasRestantes =
            'Não há aulas restantes previstas para a disciplina.'
          break
        case 1:
          mensagemAulasRestantes =
            'Ainda há uma aula prevista para a disciplina.'
          break
        default:
          mensagemAulasRestantes = `Ainda há ${formatarQuantidade(aulasRestantes, 'aula')} previstas para a disciplina.`
      }
      conteudo += `
        <p class="resultado-texto mb-0">
          ${mensagemAulasRestantes}
        </p>
      `
    }
    conteudo += '</section>'
  }

  /*
   * Define o tipo visual do resultado.
   */
  let tipo = 'sucesso'
  let titulo = 'Resultado completo'
  if (limiteUltrapassado) {
    tipo = 'erro'
    titulo = 'Limite ultrapassado'
  } else if (porcentagemAtual !== null && porcentagemAtual >= maxFaltas) {
    tipo = 'aviso'
    titulo = 'Limite atingido'
  }
  mostrarResultado(tipo, titulo, conteudo)
})

;[faltadasInput, dadasInput, totaisInput, maxFaltasInput].forEach((campo) => {
  campo.addEventListener('input', () => {
    if (formulario.classList.contains('was-validated')) {
      const faltadas = Number(faltadasInput.value)
      const dadas = dadasInput.value ? Number(dadasInput.value) : null
      const totais = totaisInput.value ? Number(totaisInput.value) : null
      const maxFaltas = Number(maxFaltasInput.value)
      aplicarValidacao(validarDados(faltadas, dadas, totais, maxFaltas))
    }
  })
})
