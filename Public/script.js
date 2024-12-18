document.getElementById('submitBtn').addEventListener('click', function() {
    const names = document.getElementById('nameInput').value.split(',').map(name => name.trim()).filter(name => name);
    
    fetch('/generate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ names })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById('output').innerHTML = `
                <p>Excel file generated: <a href="${data.excelUrl}" target="_blank">Download Excel</a></p>
                <p>Text output: <pre>${data.textOutput}</pre></p>
            `;
        } else {
            document.getElementById('output').innerHTML = `<p>Error: ${data.message}</p>`;
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});