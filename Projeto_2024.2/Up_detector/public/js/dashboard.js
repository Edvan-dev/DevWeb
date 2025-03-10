const ctx = document.getElementById('pingChart').getContext('2d');
const chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Tempo de Ping (ms)',
            data: [],
            borderColor: 'blue',
            fill: false
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

// Objeto para rastrear o estado do ping
const pingStates = {};

async function pingIP(ip) {
    // Se já houver um ping ativo para este IP, não faça nada
    if (pingStates[ip] && pingStates[ip].intervalId) {
        return;
    }

    // Limpar o gráfico antes de iniciar um novo ping
    chart.data.labels = [];
    chart.data.datasets[0].data = [];
    chart.update();

    // Função para realizar o ping (executada a cada 1 segundo)
    async function performPing() {
        try {
            const response = await fetch(`/dashboard/ping/${ip}`);
            const data = await response.json();
            if (data.success) {
                console.log(`Ping para ${ip}: ${data.time}ms`);
                updateChart(new Date().toLocaleTimeString(), data.time);
                updatePingTimes(ip, data.time);
            } else {
                console.error('Erro ao realizar Ping');
                stopPing(ip); // Parar o ping em caso de erro
            }
        } catch (error) {
            console.error('Erro ao realizar Ping:', error);
            stopPing(ip); // Parar o ping em caso de erro
        }
    }

    // Iniciar o intervalo
    const intervalId = setInterval(performPing, 1000);
    
    // Armazenar o estado do ping
    pingStates[ip] = {
        intervalId: intervalId,
        active: true
    };
    
    // Desabilitar o botão "Ping" e habilitar o botão "Parar"
    const pingButton = document.querySelector(`.ping-button[data-ip="${ip}"]`);
    if (pingButton) {
        pingButton.disabled = true;
        const stopButton = document.querySelector(`.stop-ping-button[data-ip="${ip}"]`);
        if (!stopButton) {
            console.error("Botão 'Parar' não encontrado.");
        }
        if (stopButton) {
            stopButton.disabled = false;
        }
    }
}

function stopPing(ip) {
    if (pingStates[ip] && pingStates[ip].intervalId) {
        clearInterval(pingStates[ip].intervalId);
        pingStates[ip].intervalId = null;
        // Reabilitar os botões, se necessário.
        const pingButton = document.querySelector(`.ping-button[data-ip="${ip}"]`);
        if (pingButton) pingButton.disabled = false;
        const stopButton = document.querySelector(`.stop-ping-button[data-ip="${ip}"]`);
        if (stopButton) stopButton.disabled = true;
    }
}

function updateChart(label, dataValue) {
    chart.data.labels.push(label);
    chart.data.datasets[0].data.push(dataValue);
    chart.update();
}

function updatePingTimes(ip, pingValue) {
    const tbody = document.getElementById("pingTimesBody");
    let row = document.getElementById(`pingRow-${ip}`);
    if (!row) {
        row = document.createElement("tr");
        row.id = `pingRow-${ip}`;
        const ipCell = document.createElement("td");
        ipCell.innerText = ip;
        ipCell.className = "ipCell";
        const pingCell = document.createElement("td");
        pingCell.innerText = pingValue;
        pingCell.className = "pingValue";
        row.appendChild(ipCell);
        row.appendChild(pingCell);
        tbody.appendChild(row);
    } else {
        // Atualiza a célula de ping com o último valor
        const pingCell = row.querySelector(".pingValue");
        if (pingCell) {
            pingCell.innerText = pingValue;
        }
    }
}
async function loadIPs() {
    const response = await fetch('/dashboard/get-ips');
    const ips = await response.json();
    const ipList = document.getElementById('ip-list');
    ipList.innerHTML = '';

    ips.forEach(ip => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${ip.ip_address}
            <button class="ping-button" data-ip="${ip.ip_address}">Ping</button>
            <button class="stop-ping-button" data-ip="${ip.ip_address}" disabled>Parar</button>
            <button class="delete-button" data-ip-id="${ip.id}">Deletar</button>
        `;
        ipList.appendChild(li);
    });
}

// Carregar IPs ao carregar a página
window.onload = loadIPs;

// Event delegation para os botões dinâmicos
document.getElementById('ip-list').addEventListener('click', (event) => {
    if (event.target.classList.contains('ping-button')) {
        const ip = event.target.dataset.ip;
        pingIP(ip);
    } else if (event.target.classList.contains('stop-ping-button')) {
        const ip = event.target.dataset.ip;
        stopPing(ip);
    } else if (event.target.classList.contains('delete-button')) { // Verificação do clique no botão "Deletar"
        const ipId = event.target.dataset.ipId;
        deleteIP(ipId);
    }
});

// Adicionar IP
document.getElementById('addIPForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Impede o envio padrão do formulário

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('/dashboard/add-ip', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            loadIPs(); // Recarrega a lista de IPs após adicionar
        } else {
            console.error('Erro ao adicionar IP');
        }
    } catch (error) {
        console.error('Erro ao adicionar IP:', error);
    }
});

async function deleteIP(ipId) {
    try {
        const response = await fetch('/dashboard/delete-ip', { // Ajuste a rota se necessário
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: ipId }), // Envia o ID do IP no corpo da requisição
        });

        if (response.ok) {
            loadIPs(); // Recarrega a lista de IPs após deletar
        } else {
            console.error('Erro ao deletar IP');
            // Adicione tratamento de erro mais específico aqui, se necessário (ex: exibir mensagem para o usuário)
        }
    } catch (error) {
        console.error('Erro ao deletar IP:', error);
        // Adicione tratamento de erro mais específico aqui, se necessário (ex: exibir mensagem para o usuário)
    }

}

// Verifica se há query string com erro
const params = new URLSearchParams(window.location.search);
const error = params.get('error');
if (error === 'usuario ja existe' || error === 'usuario+ja+existe') {
  document.getElementById('errorContainer').innerHTML = `
    <div class="alert alert-danger" role="alert">
      Usuário já existe
    </div>
  `;
}

// Função para buscar e atualizar os últimos tempos de ping de cada IP
async function updateLastPingTimes() {
    try {
      const response = await fetch('/dashboard/last-ping-times');
      const ips = await response.json();
    
      const tbody = document.getElementById("pingTimesBody");
      tbody.innerHTML = ""; // Limpa o conteúdo atual da tabela
    
      ips.forEach(ip => {
        const lastPing = ip.pingTimes && ip.pingTimes.length > 0 ? ip.pingTimes[0].time : "-";
        const row = document.createElement("tr");
      
        const ipCell = document.createElement("td");
        ipCell.innerText = ip.ip_address;
        row.appendChild(ipCell);
      
        const pingCell = document.createElement("td");
        pingCell.innerText = lastPing;
        row.appendChild(pingCell);
      
        tbody.appendChild(row);
      });
    } catch (error) {
      console.error("Erro ao atualizar os últimos tempos de ping:", error);
    }
  }

  // Atualiza a tabela a cada 5 segundos e também realiza uma chamada inicial
  setInterval(updateLastPingTimes, 5000);
  updateLastPingTimes();