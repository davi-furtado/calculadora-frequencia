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
		return { campo: faltadasInput, mensagem: "Informe a quantidade de aulas faltadas." };
	}
	if (!Number.isFinite(maxFaltas)) {
		return { campo: maxFaltasInput, mensagem: "Informe a porcentagem máxima de faltas." };
	}
	if (!Number.isFinite(dadas) && !Number.isFinite(totais)) {
		return { campo: dadasInput, mensagem: "Informe as aulas dadas ou as aulas totais." };
	}
	if (faltadas < 0) {
		return { campo: faltadasInput, mensagem: "As faltas não podem ser negativas." };
	}
	if (Number.isFinite(dadas) && dadas <= 0) {
		return { campo: dadasInput, mensagem: "As aulas dadas devem ser maiores que zero." };
	}
	if (Number.isFinite(totais) && totais <= 0) {
		return { campo: totaisInput, mensagem: "As aulas totais devem ser maiores que zero." };
	}
	if (Number.isFinite(dadas) && Number.isFinite(totais) && dadas > totais) {
		return { campo: dadasInput, mensagem: "As aulas dadas não podem ser maiores que as aulas totais." };
	}
	if (Number.isFinite(dadas) && faltadas > dadas) {
		return { campo: faltadasInput, mensagem: "As faltas não podem ser maiores que as aulas dadas." };
	}
	if (Number.isFinite(totais) && faltadas > totais) {
		return { campo: faltadasInput, mensagem: "As faltas não podem ser maiores que as aulas totais." };
	}
	if (maxFaltas < 0 || maxFaltas > 100) {
		return { campo: maxFaltasInput, mensagem: "A porcentagem máxima deve estar entre 0% e 100%." };
	}
	return null;
}

function limparValidacao() {
	[faltadasInput, dadasInput, totaisInput, maxFaltasInput].forEach((campo) => {
		campo.classList.remove("is-invalid", "is-valid");
	});
}

function aplicarValidacao(erro) {
	if (!erro) {
		[faltadasInput, dadasInput, totaisInput, maxFaltasInput].forEach((campo) => {
			if (campo.required || campo.value) {
				campo.classList.add("is-valid");
			}
		});
		return;
	}
	erro.campo.classList.add("is-invalid");
}

function mostrarResultado(tipo, titulo, conteudo) {
	resultado.className = `resultado ${tipo} mt-4`;
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
    <div class="col-12 col-sm-6">
      <div class="metrica h-100${destaque ? " metrica-destaque" : ""}">
        <span>${rotulo}</span>
        <strong>${valor}</strong>
      </div>
    </div>
  `;
}

function formatarNumero(valor, casas = 0) {
	return valor.toLocaleString("pt-BR", {
		minimumFractionDigits: casas,
		maximumFractionDigits: casas,
	});
}

function formatarQuantidade(quantidade, singular, plural = `${singular}s`) {
	switch (quantidade) {
		case 0:
			return `nenhuma ${singular}`;
		case 1:
			return `uma ${singular}`;
		default:
			return `${formatarNumero(quantidade)} ${plural}`;
	}
}

formulario.addEventListener("submit", (event) => {
	event.preventDefault();
	limparValidacao();
	const faltadas = Number(faltadasInput.value);
	const dadas = dadasInput.value ? Number(dadasInput.value) : null;
	const totais = totaisInput.value ? Number(totaisInput.value) : null;
	const maxFaltas = Number(maxFaltasInput.value);
	const erro = validarDados(faltadas, dadas, totais, maxFaltas);
	aplicarValidacao(erro);
	if (erro) {
		mostrarResultado(
			"erro",
			"Dados inválidos",
			`<p class="erro-texto">${erro.mensagem}</p>
       <p class="resultado-ajuda">Revise os campos informados e tente novamente.</p>`,
		);
		return;
	}
	const limite = maxFaltas / 100;
	let conteudo = "";
	let porcentagemAtual = null;
	let limiteUltrapassado = false;

	/*
	 * MODO 1:
	 * Aulas dadas informadas.
	 */
	if (Number.isFinite(dadas)) {
		porcentagemAtual = calcularPorcentagem(faltadas, dadas);
		limiteUltrapassado = porcentagemAtual > maxFaltas;
		conteudo += `
      <section class="resultado-secao">
        <h3>Considerando as aulas dadas</h3>
        <div class="resultado-metricas row g-3">
          ${criarMetrica("Faltas atuais", formatarNumero(faltadas))}
          ${criarMetrica("Aulas dadas", formatarNumero(dadas))}
          ${criarMetrica("Frequência de faltas", `${formatarNumero(porcentagemAtual, 2)}%`, true)}
          ${criarMetrica("Limite permitido", `${formatarNumero(maxFaltas, 2)}%`)}
        </div>
    `;
		if (limiteUltrapassado) {
			conteudo += `
        <p class="resultado-ajuda">
          A porcentagem atual está acima do limite. Não há margem para novas faltas.
        </p>
      `;
		} else if (porcentagemAtual === maxFaltas) {
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
          <strong>${formatarQuantidade(faltasPossiveis, "aula")}</strong>
          <small>considerando as aulas já dadas</small>
        </div>
      `;
		}
		conteudo += "</section>";
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
      <section class="resultado-secao">
        <h3>Considerando as aulas totais</h3>
        <div class="resultado-metricas resultado-metricas-totais row g-3">
          ${criarMetrica("Aulas totais", formatarNumero(totais))}
          ${criarMetrica("Máximo de faltas", formatarNumero(maximoDeFaltas))}
          ${criarMetrica("Faltas restantes", formatarNumero(faltasRestantes), true)}
          ${Number.isFinite(aulasRestantes) ? criarMetrica("Aulas restantes", formatarNumero(aulasRestantes)) : ""}
        </div>
    `;
		if (Number.isFinite(aulasRestantes)) {
			let mensagemAulasRestantes;
			switch (aulasRestantes) {
				case 0:
					mensagemAulasRestantes = "Não há aulas restantes previstas para a disciplina.";
					break;
				case 1:
					mensagemAulasRestantes = "Ainda há uma aula prevista para a disciplina.";
					break;
				default:
					mensagemAulasRestantes = `Ainda há ${formatarQuantidade(aulasRestantes, "aula")} previstas para a disciplina.`;
			}
			conteudo += `
        <p class="resultado-ajuda">
          ${mensagemAulasRestantes}
        </p>
      `;
		}
		conteudo += "</section>";
	}

	/*
	 * Define o tipo visual do resultado.
	 */
	let tipo = "sucesso";
	let titulo = "Resultado completo";
	if (limiteUltrapassado) {
		tipo = "erro";
		titulo = "Limite ultrapassado";
	} else if (porcentagemAtual !== null && porcentagemAtual >= maxFaltas) {
		tipo = "aviso";
		titulo = "Limite atingido";
	}
	mostrarResultado(tipo, titulo, conteudo);
});
