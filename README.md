# Calculadora de Frequência

Calculadora web para analisar a frequência escolar a partir da quantidade de faltas, aulas dadas e/ou aulas totais.

[Acesse a calculadora](https://davi-furtado.github.io/calculadora-frequencia/)

O sistema permite utilizar diferentes informações disponíveis sem precisar escolher manualmente um "modo".

## Funcionalidades

* Cálculo da porcentagem atual de faltas.
* Definição personalizada do limite máximo de faltas.
* Cálculo de faltas possíveis considerando as aulas já dadas.
* Cálculo do máximo de faltas permitido durante toda a disciplina.
* Cálculo das faltas restantes.
* Cálculo das aulas restantes quando as aulas dadas e totais são informadas.
* Resultado adaptado aos dados fornecidos.
* Validação dos valores informados.
* Interface responsiva em modo escuro.
* Não utiliza bibliotecas ou frameworks externos.

## Como usar

O formulário possui quatro informações:

### Aulas faltadas

Quantidade de aulas que o aluno já faltou.
Esse campo é obrigatório.

### Aulas dadas

Quantidade de aulas que já foram ministradas.
É opcional, mas deve ser informado caso as aulas totais não sejam conhecidas.

### Aulas totais

Quantidade total de aulas previstas para a disciplina.
Também é opcional, mas pelo menos uma entre **aulas dadas** e **aulas totais** deve ser informada.

### Porcentagem máxima de faltas

Limite de faltas permitido.
O valor padrão é `25%`, mas pode ser alterado.

## Formas de utilização

### Apenas aulas dadas

Exemplo:

```text
Faltas: 8
Aulas dadas: 40
Limite: 25%
```

O sistema calcula a porcentagem atual:

$$
\frac{8}{40} \cdot 100 = 20\%
$$

E calcula quantas novas faltas podem ser adicionadas sem ultrapassar o limite considerando as aulas já dadas.

### Apenas aulas totais

Exemplo:

```text
Faltas: 8
Aulas totais: 80
Limite: 25%
```

O máximo permitido é:

$$
80 \cdot 0.25 = 20 \text{ faltas}
$$

Portanto:

$$
20 - 8 = 12 \text{ faltas restantes}
$$

### Aulas dadas e aulas totais

Quando os dois valores são informados, o sistema consegue apresentar uma visão mais completa:

* porcentagem atual de faltas;
* máximo de faltas permitido;
* faltas restantes na disciplina;
* quantidade de aulas que ainda serão dadas.

Exemplo:

```text
Faltas: 8
Aulas dadas: 40
Aulas totais: 80
Limite: 25%
```

Resultado:

```text
Porcentagem atual: 20%
Máximo de faltas: 20
Faltas restantes: 12
Aulas restantes: 40
```

## Cálculos

### Porcentagem atual

Quando as aulas dadas são conhecidas:

$$
\frac{\text{faltas}}{\text{aulas dadas}} \cdot 100
$$

### Máximo de faltas

Quando as aulas totais são conhecidas:

$$
\text{aulas totais} \cdot \text{limite}
$$

### Faltas restantes

$$
\text{máximo de faltas} - \text{faltas atuais}
$$

### Faltas possíveis considerando aulas já dadas

Quando o limite é L:

$$
\frac{L \cdot \text{aulas dadas} - \text{faltas}}{1 - L}
$$

O resultado é arredondado para baixo para garantir que o limite não seja ultrapassado.

Para o limite tradicional de 25%, essa fórmula é equivalente a:

$$
\frac{\text{aulas dadas} - 4 \cdot \text{faltas}}{3}
$$

## Validações

O sistema impede:

* faltas negativas;
* quantidade de aulas dadas igual ou menor que zero;
* quantidade de aulas totais igual ou menor que zero;
* faltas maiores que aulas dadas;
* faltas maiores que aulas totais;
* aulas dadas maiores que aulas totais;
* limite de faltas menor que 0%;
* limite de faltas maior que 100%;
* ausência simultânea de aulas dadas e aulas totais.

## Tecnologias

* HTML5
* CSS3
* JavaScript

Não são utilizadas dependências externas.

## Estrutura

```text
calculadora-frequencia/
│
├── index.html
├── LICENSE
├── README.md
├── script.js
└── style.css
```

## Como executar

Não é necessário instalar dependências.

Clone o repositório:

```bash
git clone https://github.com/davi-furtado/calculadora-frequencia.git
```

Depois abra index.html no navegador.

Também é possível utilizar o Live Server do VS Code.

## Objetivo

Projeto desenvolvido para praticar:

* HTML semântico;
* CSS responsivo;
* JavaScript;
* manipulação do DOM;
* eventos de formulário;
* validação de dados;
* funções;
* separação entre lógica e interface;
* resolução de problemas matemáticos com programação.

## Licença

Este projeto está disponível sob a licença MIT.
Acesse o arquivo [LICENSE](LICENSE) para mais informações.
