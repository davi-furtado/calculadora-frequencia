const formulario = document.querySelector("#formulario");
const faltadasInput = document.querySelector("#faltadas");
const dadasInput = document.querySelector("#dadas");
const totaisInput = document.querySelector("#totais");
const maxFaltasInput = document.querySelector("#maxFaltas");
const resultado = document.querySelector("#resultado");

function calcularPorcentagem(faltadas, aulas) {
	return (faltadas / aulas) * 100;
}

function calcularMaximoDeFaltas(totais, limite) {
	return Math.floor(totais * limite);
}

function calcularFaltasRestantes(faltadas, totais, limite) {
	const maximo = calcularMaximoDeFaltas(totais, limite);
	return Math.max(0, maximo - faltadas);
}

function calcularFaltasPossiveis(faltadas, dadas, limite) {
	if (limite >= 1) {
		return Infinity;
	}
	return Math.max(0, Math.floor((limite * dadas - faltadas) / (1 - limite)));
}

function validarDados(faltadas, dadas, totais, maxFaltas) {
	if (!Number.isFinite(faltadas)) {
		return "Informe a quantidade de aulas faltadas.";
	}
	if (!Number.isFinite(maxFaltas)) {
		return "Informe a porcentagem máxima de faltas.";
	}
	if (!Number.isFinite(dadas) && !Number.isFinite(totais)) {
		return "Informe as aulas dadas ou as aulas totais.";
	}
	if (faltadas < 0) {
		return "As faltas não podem ser negativas.";
	}
	if (Number.isFinite(dadas) && dadas <= 0) {
		return "As aulas dadas devem ser maiores que zero.";
	}
	if (Number.isFinite(totais) && totais <= 0) {
		return "As aulas totais devem ser maiores que zero.";
	}
	if (Number.isFinite(dadas) && Number.isFinite(totais) && dadas > totais) {
		return "As aulas dadas não podem ser maiores que as aulas totais.";
	}
	if (Number.isFinite(dadas) && faltadas > dadas) {
		return "As faltas não podem ser maiores que as aulas dadas.";
	}
	if (Number.isFinite(totais) && faltadas > totais) {
		return "As faltas não podem ser maiores que as aulas totais.";
	}
	if (maxFaltas < 0 || maxFaltas > 100) {
		return "A porcentagem máxima deve estar entre 0% e 100%.";
	}
	return null;
}

function mostrarResultado(tipo, titulo, conteudo) {
	resultado.className = `resultado ${tipo}`;
	resultado.innerHTML = `
    <div class="resultado-cabecalho">
      <div>
        <span class="resultado-etiqueta">Resumo da frequência</span>
        <h2>${titulo}</h2>
      </div>
      <span class="resultado-status">${tipo === "sucesso" ? "Dentro do limite" : tipo === "aviso" ? "Atenção" : "Verifique os dados"}</span>
    </div>
    ${conteudo}
  `;
}

function criarMetrica(rotulo, valor, destaque = false) {
	return `
    <div class="metrica${destaque ? " metrica-destaque" : ""}">
      <span>${rotulo}</span>
      <strong>${valor}</strong>
    </div>
  `;
}

function formatarNumero(valor, casas = 0) {
	return valor.toLocaleString("pt-BR", {
		minimumFractionDigits: casas,
		maximumFractionDigits: casas,
	});
}

formulario.addEventListener("submit", (event) => {
	event.preventDefault();
	const faltadas = Number(faltadasInput.value);
	const dadas = dadasInput.value ? Number(dadasInput.value) : null;
	const totais = totaisInput.value ? Number(totaisInput.value) : null;
	const maxFaltas = Number(maxFaltasInput.value);
	const erro = validarDados(faltadas, dadas, totais, maxFaltas);
	if (erro) {
		mostrarResultado(
			"erro",
			"Dados inválidos",
			`<p class="erro-texto">${erro}</p>
       <p class="resultado-ajuda">Revise os campos informados e tente novamente.</p>`,
		);
		return;
	}
	const limite = maxFaltas / 100;
	let conteudo = "";
	let porcentagemAtual = null;

	/*
	 * MODO 1:
	 * Aulas dadas informadas.
	 */
	if (Number.isFinite(dadas)) {
		porcentagemAtual = calcularPorcentagem(faltadas, dadas);
		conteudo += `
      <div class="resultado-metricas">
        ${criarMetrica("Faltas atuais", formatarNumero(faltadas))}
        ${criarMetrica("Aulas dadas", formatarNumero(dadas))}
        ${criarMetrica("Frequência de faltas", `${formatarNumero(porcentagemAtual, 2)}%`, true)}
        ${criarMetrica("Limite permitido", `${formatarNumero(maxFaltas, 2)}%`)}
      </div>
    `;
		if (porcentagemAtual > maxFaltas) {
			mostrarResultado(
				"erro",
				"Limite ultrapassado",
				`${conteudo}
        <p class="resultado-ajuda">
          Você está com <strong>${formatarNumero(porcentagemAtual, 2)}%</strong>
          de faltas, acima do limite de <strong>${formatarNumero(maxFaltas, 2)}%</strong>.
        </p>`,
			);
			return;
		}
		if (porcentagemAtual === maxFaltas) {
			conteudo += `
        <p class="resultado-ajuda">
          Você atingiu o limite de <strong>${formatarNumero(maxFaltas, 2)}%</strong>.
          Não há margem para novas faltas sem ultrapassá-lo.
        </p>
      `;
		} else {
			const faltasPossiveis = calcularFaltasPossiveis(faltadas, dadas, limite);
			conteudo += `
        <div class="resultado-destaque">
          <span>Margem para novas faltas</span>
          <strong>${formatarNumero(faltasPossiveis)} ${faltasPossiveis === 1 ? "aula" : "aulas"}</strong>
          <small>considerando as aulas já dadas</small>
        </div>
      `;
		}
	}

	/*
	 * MODO 2:
	 * Aulas totais informadas.
	 */
	if (Number.isFinite(totais)) {
		const maximoDeFaltas = calcularMaximoDeFaltas(totais, limite);
		const faltasRestantes = calcularFaltasRestantes(faltadas, totais, limite);
		const aulasRestantes = Number.isFinite(dadas) ? totais - dadas : null;
		conteudo += `
      <div class="resultado-metricas resultado-metricas-totais">
        ${criarMetrica("Aulas totais", formatarNumero(totais))}
        ${criarMetrica("Máximo de faltas", formatarNumero(maximoDeFaltas))}
        ${criarMetrica("Faltas restantes", formatarNumero(faltasRestantes), true)}
        ${Number.isFinite(aulasRestantes) ? criarMetrica("Aulas restantes", formatarNumero(aulasRestantes)) : ""}
      </div>
    `;
		if (Number.isFinite(aulasRestantes)) {
			conteudo += `
        <p class="resultado-ajuda">
          Ainda há <strong>${formatarNumero(aulasRestantes)}</strong>
          aula(s) previstas para a disciplina.
        </p>
      `;
		}
	}

	/*
	 * Define o tipo visual do resultado.
	 */
	let tipo = "sucesso";
	if (porcentagemAtual !== null && porcentagemAtual >= maxFaltas) {
		tipo = "aviso";
	}
	mostrarResultado(tipo, "Resultado", conteudo);
});
