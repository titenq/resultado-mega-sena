const drawNumber = document.getElementById('drawNumber');
const search = document.getElementById('search');

const formatNumber = number => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(number);
};

const removeChilds = () => {
  const container = document.getElementById('container');
  const contestDiv = document.getElementById('contest');
  const resultDiv = document.getElementById('result');
  const winnersDiv = document.getElementById('winners');
  const errorMessageDiv = document.getElementById('errorMessage');

  contestDiv && container.removeChild(contestDiv);
  resultDiv && container.removeChild(resultDiv);
  winnersDiv && container.removeChild(winnersDiv);
  errorMessageDiv && container.removeChild(errorMessageDiv);
};

const fetchApi = async (number = '') => {
  try {
    const url = `https://servicebus2.caixa.gov.br/portaldeloterias/api/megasena/${number}`;
    const response = await fetch(url);
    const data = await response.json();

    removeChilds();

    const contest = document.createElement('div');
    contest.id = 'contest';
    contest.classList.add('contest');

    const contestText = document.createTextNode(`Concurso ${data.numero} `);
    const dateSpan = document.createElement('span');

    dateSpan.classList.add('date');
    dateSpan.textContent = `(${data.dataApuracao})`;

    contest.append(contestText, dateSpan);
    container.appendChild(contest);

    const result = document.createElement('div');
    result.id = 'result';
    result.classList.add('result');

    const fragment = document.createDocumentFragment();
    
    data.listaDezenas.forEach(item => {
      const ball = document.createElement('div');
      ball.classList.add('ball');
      ball.textContent = item;
      
      fragment.appendChild(ball);
    });

    result.appendChild(fragment);
    container.appendChild(result);

    const winners = document.createElement('div');
    winners.id = 'winners';
    winners.classList.add('winners');

    const accumulated = document.createElement('p');
    accumulated.classList.add('accumulated');

    const value = document.createElement('p');
    value.classList.add('value');

    if (data.acumulado) {
      accumulated.textContent = 'Acumulou';

      value.textContent = `Valor acumulado: R$ ${formatNumber(data.valorAcumuladoProximoConcurso)}`;

      winners.append(accumulated, value);

      container.appendChild(winners);

      return;
    }

    const numeroDeGanhadores = data.listaRateioPremio[0].numeroDeGanhadores;
    const valorPremio = data.listaRateioPremio[0].valorPremio;

    accumulated.textContent = `Ganhadores: ${numeroDeGanhadores}`;

    value.textContent = `Prêmio: R$ ${formatNumber(valorPremio)}`;

    winners.append(accumulated, value);

    container.appendChild(winners);
  } catch (error) {
    removeChilds();
    
    const errorMessage = document.createElement('p');
    errorMessage.id = 'errorMessage';
    errorMessage.classList.add('errorMessage');
    errorMessage.textContent = 'Ocorreu um erro inesperado, por favor tente mais tarde.';

    container.appendChild(errorMessage);
  }
};

fetchApi();

drawNumber.addEventListener('input', () => {
  drawNumber.value = drawNumber.value.replace(/\D/g, '');
});

search.addEventListener('submit', event => {
  event.preventDefault();

  const drawNumberValue = drawNumber.value;

  fetchApi(drawNumberValue);

  drawNumber.value = '';
});
