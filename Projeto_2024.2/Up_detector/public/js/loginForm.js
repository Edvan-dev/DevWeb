document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Impede o envio padrão do formulário

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (result.success) {
            // Armazena o token retornado no localStorage para usar nas requisições autenticadas
            localStorage.setItem('token', result.token);
            window.location.href = '/dashboard'; // Redireciona para o dashboard
        } else {
            document.getElementById('errorMessage').style.display = 'block'; // Exibe a mensagem de erro
        }
    } catch (error) {
        console.error('Erro ao realizar login:', error);
    }
});