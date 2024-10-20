document.getElementById('searchForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const cardName = document.getElementById('cardName').value;
    searchCards(cardName);
});

function searchCards(cardName) {
    fetch(`https://api.scryfall.com/cards/search?q=${encodeURIComponent(cardName)}`)
        .then(response => response.json())
        .then(data => {
            const resultDiv = document.getElementById('result');
            resultDiv.innerHTML = '';

            data.data.forEach(card => {
                const cardElement = document.createElement('div');
                cardElement.className = 'card';
                cardElement.innerHTML = `
                    <h2>${card.name}</h2>
                    <img src="${card.image_uris ? card.image_uris.normal : 'placeholder-image-url'}" alt="${card.name}">
                    <p>${card.oracle_text}</p>
                    <button class="addToCollection">Add to Collection</button>
                `;
                cardElement.querySelector('.addToCollection').onclick = () => addToCollection(card);
                resultDiv.appendChild(cardElement);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('result').innerHTML = 'No cards found or an error occurred.';
        });
}

function addToCollection(card) {
    let collection = JSON.parse(localStorage.getItem('mtgCollection')) || [];
    collection.push(card);
    localStorage.setItem('mtgCollection', JSON.stringify(collection));
    alert(`${card.name} has been added to your collection!`);
}