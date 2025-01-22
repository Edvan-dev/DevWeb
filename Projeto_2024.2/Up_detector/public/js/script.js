async function registerUser() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });
    const result = await response.json();
    alert(result.message);
    if (response.ok) window.location.href = 'login.html';
}

async function checkLogin() {
    const username = document.getElementById('id-user').value;
    const password = document.getElementById('id-passwd').value;
    const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });
    const result = await response.json();
    alert(result.message);
    if (response.ok) window.location.href = 'dashboard.html';
}

async function addURL() {
    const url = document.getElementById('ip').value;
    const response = await fetch('/api/urls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
    });
    const result = await response.json();
    alert(result.message);
    if (response.ok) document.getElementById('ipList').innerHTML += `<li>${url}</li>`;
}
