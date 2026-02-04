fetch('/.env')
    .then(response => response.text())
    .text(response => response.split('=').pop())
    .then(main)

async function main(api_key) {
    
}

