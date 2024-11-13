Descrição

UP DETECTOR é uma aplicação desenvolvida para monitorar a disponibilidade de ativos de rede em tempo real utilizando ping ICMP. 
Ideal para equipes de TI e administradores de redes, a aplicação conta com uma interface frontend em HTML5 que permite visualizar 
o status dos ativos de forma intuitiva. O backend, implementado em Node.js, é responsável por realizar as verificações e atualizar o frontend.

Funcionalidades
    • Monitoramento ICMP (Ping): Verifica a disponibilidade dos dispositivos de rede por meio de pings ICMP.
    • Notificações de Falha: Exibe alertas no frontend em caso de indisponibilidade dos ativos.
    • Interface de Status em Tempo Real: Mostra o status de cada ativo em uma página web responsiva.
    • Logs de Eventos: Registra históricos de disponibilidade para consulta.
    • Configuração Fácil: Permite adicionar e remover ativos diretamente no arquivo de configuração.
Requisitos
    • Node.js 14+
    • Frontend: HTML5, CSS3, JavaScript (fetch API)
    • Dependências Node.js: ping, express
Instalação
    1. Clone o repositório:
       bash
       git clone https://github.com/Edvan-dev/DevWeb
       cd network-asset-monitoring
    2. Instale as dependências:
       bash
       npm install
    3. Inicie o servidor:
       bash
       node server.js
Como Usar
    • Acessando o Dashboard: Abra o navegador e vá para http://localhost:3000 para visualizar o dashboard em tempo real.
    • Adicionando Ativos: No dashboard, você encontrará um campo para adicionar novos ativos de rede. Insira o IP ou o nome de host e clique em "Adicionar". O novo ativo será incluído na lista e monitorado imediatamente.
    • Removendo Ativos: Para remover um ativo, clique no botão de exclusão ao lado do ativo desejado na lista. Isso interromperá o monitoramento do dispositivo em questão.
    • Visualizando o Status: A interface exibe o status de cada ativo em tempo real, indicando se está "Online" ou "Offline".
Executando o Software: Inicie o servidor Node.js e acesse a interface frontend para visualizar o status dos ativos monitorados.

Estrutura do Projeto

Up_detector/
├── public/
│   ├── index.html       # Interface frontend
│   ├── styles.css       # Estilos CSS
│   └── script.js        # Lógica frontend
├── config.json          # Configuração de ativos de rede
├── server.js            # Servidor backend em Node.js
└── README.md            # Documentação do projeto

Contribuição
Sinta-se à vontade para contribuir com este projeto! Basta seguir os passos abaixo:
    1. Fork este repositório.
    2. Crie uma nova branch: git checkout -b minha-feature.
    3. Faça commit das suas mudanças: git commit -m 'Minha nova feature'.
    4. Faça push para a branch: git push origin minha-feature.
    5. Abra um Pull Request.
    
Licença
Este projeto está licenciado sob a MIT License.

Contato
Para dúvidas ou sugestões, entre em contato com edvsplus@gmail.com



