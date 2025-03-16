const params = new URLSearchParams(window.location.search);
        if (params.has('error') && params.get('error') === 'usuario ja existe') {
          document.getElementById('errorMessage').style.display = 'block';
        }