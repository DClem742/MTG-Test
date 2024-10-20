document.addEventListener('DOMContentLoaded', function() {
    displayCollection();
});
function displayCollection() {
    const collection = JSON.parse(localStorage.getItem('mtgCollection')) || [];
    const collectionDiv = document.getElementById('collection');
    
    // Clear existing content
    collectionDiv.innerHTML = '';

    if (collection.length === 0) {
        collectionDiv.innerHTML = '<p>Your collection is empty. Start adding cards!</p>';
        return;
    }

    const table = document.createElement('table');
    table.innerHTML = `
        <thead>
            <tr>
                <th>Card Name</th>
                <th>Quantity</th>
                <th>Condition</th>
                <th>Set</th>
                <th>Foil</th>
                <th>For Trade</th>
                <th>Actions</th>
                <th>Remove</th>
            </tr>
        </thead>
        <tbody id="collectionBody">
        </tbody>
    `;
    collectionDiv.appendChild(table);

    const tableBody = document.getElementById('collectionBody');
    collection.forEach((card, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><a href="${card.scryfall_uri}" target="_blank">${card.name}</a></td>
            <td>
                <select onchange="updateCardQuantity(${index}, this.value)">
                    ${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => 
                        `<option value="${num}" ${card.quantity == num ? 'selected' : ''}>${num}</option>`
                    ).join('')}
                </select>
            </td>
            <td>
                <select>
                    <option value="M/NM" ${card.condition === 'M/NM' ? 'selected' : ''}>Mint/Near Mint (M/NM)</option>
                    <option value="SP" ${card.condition === 'SP' ? 'selected' : ''}>Slightly Played (SP)</option>
                    <option value="PL" ${card.condition === 'PL' ? 'selected' : ''}>Played (PL)</option>
                    <option value="HP" ${card.condition === 'HP' ? 'selected' : ''}>Heavily Played (HP)</option>
                    <option value="Poor" ${card.condition === 'Poor' ? 'selected' : ''}>Poor</option>
                </select>
            </td>
            <td>
                <select>
                    ${card.all_sets ? card.all_sets.map(set => `<option value="${set}" ${card.set === set ? 'selected' : ''}>${set}</option>`).join('') : `<option value="${card.set}">${card.set}</option>`}
                </select>
            </td>
            <td>
                <select>
                    <option value="true" ${card.foil ? 'selected' : ''}>Yes</option>
                    <option value="false" ${!card.foil ? 'selected' : ''}>No</option>
                </select>
            </td>
            <td>
                <select>
                    <option value="true" ${card.for_trade ? 'selected' : ''}>Yes</option>
                    <option value="false" ${!card.for_trade ? 'selected' : ''}>No</option>
                </select>
            </td>
            <td><button onclick="updateCard(${index})">Update</button></td>
            <td><button onclick="removeCard(${index})">Remove</button></td>
        `;
        tableBody.appendChild(row);
    });
}
function updateCardQuantity(index, newQuantity) {
    let collection = JSON.parse(localStorage.getItem('mtgCollection')) || [];
    if (newQuantity == '0') {
        collection.splice(index, 1);
    } else {
        collection[index].quantity = parseInt(newQuantity);
    }
    localStorage.setItem('mtgCollection', JSON.stringify(collection));
    displayCollection(); // Refresh the table
}

function removeCard(index) {
    console.log('Removing card at index:', index);
    let collection = JSON.parse(localStorage.getItem('mtgCollection')) || [];
    console.log('Collection before removal:', collection);
    collection.splice(index, 1);
    console.log('Collection after removal:', collection);
    localStorage.setItem('mtgCollection', JSON.stringify(collection));
    displayCollection(); // Refresh the table
}
function updateCard(index) {
    const collection = JSON.parse(localStorage.getItem('mtgCollection')) || [];
    const row = document.querySelectorAll('#collectionBody tr')[index];
    const card = collection[index];

    card.quantity = row.querySelector('input[type="number"]').value;
    card.condition = row.querySelectorAll('select')[0].value;
    card.set = row.querySelectorAll('select')[1].value;
    card.foil = row.querySelectorAll('select')[2].value === 'true';
    card.for_trade = row.querySelectorAll('select')[3].value === 'true';

    localStorage.setItem('mtgCollection', JSON.stringify(collection));
    alert('Card updated successfully!');
}

function deleteCard(index) {
    const collection = JSON.parse(localStorage.getItem('mtgCollection')) || [];
    collection.splice(index, 1);
    localStorage.setItem('mtgCollection', JSON.stringify(collection));
    displayCollection(); // Refresh the table
};
