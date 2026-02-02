// Load all clients
async function loadClients() {
    try {
        const response = await fetch('/api/clients');
        const clients = await response.json();

        const container = document.getElementById('clientsList');

        if (clients.length === 0) {
            container.innerHTML = '<div class="card"><p style="text-align: center; color: var(--text-muted);">Hozircha klientlar yo\'q</p></div>';
            return;
        }

        container.innerHTML = clients.map(client => `
            <div class="card">
                <div class="card-header">
                    <div>
                        <h3 class="card-title">${client.first_name} ${client.last_name}</h3>
                        <p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 0.25rem;">
                            📱 ${client.phone_number}
                            ${client.telegram_username ? `| @${client.telegram_username}` : ''}
                        </p>
                    </div>
                    <div class="card-actions">
                        ${client.is_blocked
                ? `<button class="btn-small btn-success" onclick="toggleBlock(${client.id}, false)">Blokdan chiqarish</button>`
                : `<button class="btn-small btn-danger" onclick="toggleBlock(${client.id}, true)">Bloklash</button>`
            }
                        <button class="btn-small" onclick="editClient(${client.id})">Tahrirlash</button>
                        <button class="btn-small btn-danger" onclick="deleteClient(${client.id})">O'chirish</button>
                    </div>
                </div>
                <div>
                    <h4 style="margin-bottom: 0.75rem; font-size: 1rem;">👶 Farzandlar:</h4>
                    ${client.children && client.children.length > 0
                ? `<div style="display: grid; gap: 0.5rem;">
                            ${client.children.map(child => `
                                <div style="display: flex; justify-content: space-between; padding: 0.75rem; background: rgba(255,255,255,0.05); border-radius: 8px;">
                                    <span>${child.first_name}</span>
                                    <span style="color: var(--text-muted);">
                                        🎂 ${child.birth_day}.${child.birth_month}.${child.birth_year}
                                        (${new Date().getFullYear() - child.birth_year} yosh)
                                    </span>
                                </div>
                            `).join('')}
                           </div>`
                : '<p style="color: var(--text-muted);">Farzandlar kiritilmagan</p>'
            }
                </div>
                ${client.is_blocked
                ? '<div class="badge badge-blocked" style="margin-top: 1rem;">🚫 Bloklangan</div>'
                : '<div class="badge badge-active" style="margin-top: 1rem;">✅ Aktiv</div>'
            }
            </div>
        `).join('');
    } catch (error) {
        console.error('Load clients error:', error);
        document.getElementById('clientsList').innerHTML =
            '<div class="card"><p style="text-align: center; color: #f5576c;">Xatolik yuz berdi</p></div>';
    }
}

// Show add client modal
function showAddClientModal() {
    document.getElementById('addClientModal').classList.add('show');
    document.getElementById('addChildrenContainer').innerHTML = '';
    document.getElementById('addClientForm').reset();
}

// Add child field to add client form
let childFieldCounter = 0;
function addChildField() {
    const container = document.getElementById('addChildrenContainer');
    const index = childFieldCounter++;

    const fieldHtml = `
        <div class="form-group" style="background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 8px; margin-bottom: 1rem;" data-child-index="${index}">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <label>Farzand ${index + 1}</label>
                <button type="button" class="btn-small btn-danger" onclick="removeChildField(${index})">O'chirish</button>
            </div>
            <input type="text" class="add-child-name" placeholder="Ismi" data-index="${index}" style="margin-bottom: 0.5rem;">
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.5rem;">
                <input type="number" class="add-child-year" placeholder="Yil" data-index="${index}">
                <input type="number" class="add-child-month" placeholder="Oy" min="1" max="12" data-index="${index}">
                <input type="number" class="add-child-day" placeholder="Kun" min="1" max="31" data-index="${index}">
            </div>
        </div>
    `;

    container.insertAdjacentHTML('beforeend', fieldHtml);
}

// Remove child field
function removeChildField(index) {
    const field = document.querySelector(`[data-child-index="${index}"]`);
    if (field) {
        field.remove();
    }
}

// Save new client
const addClientForm = document.getElementById('addClientForm');
if (addClientForm) {
    addClientForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const first_name = document.getElementById('addFirstName').value;
        const last_name = document.getElementById('addLastName').value;
        const phone_number = document.getElementById('addPhone').value;

        // Collect children data
        const children = [];
        const childNames = document.querySelectorAll('.add-child-name');
        childNames.forEach((input, idx) => {
            const index = input.dataset.index;
            const yearInput = document.querySelector(`.add-child-year[data-index="${index}"]`);
            const monthInput = document.querySelector(`.add-child-month[data-index="${index}"]`);
            const dayInput = document.querySelector(`.add-child-day[data-index="${index}"]`);

            if (input.value && yearInput.value && monthInput.value && dayInput.value) {
                children.push({
                    first_name: input.value,
                    birth_year: parseInt(yearInput.value),
                    birth_month: parseInt(monthInput.value),
                    birth_day: parseInt(dayInput.value)
                });
            }
        });

        try {
            const response = await fetch('/api/clients', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ first_name, last_name, phone_number, children })
            });

            const data = await response.json();

            if (response.ok) {
                document.getElementById('addClientModal').classList.remove('show');
                addClientForm.reset();
                document.getElementById('addChildrenContainer').innerHTML = '';
                childFieldCounter = 0;
                loadClients();
                alert('✅ Klient muvaffaqiyatli qo\'shildi!');
            } else {
                alert(data.error || 'Xatolik yuz berdi');
            }
        } catch (error) {
            console.error('Create client error:', error);
            alert('Xatolik yuz berdi');
        }
    });
}

// Edit client
async function editClient(clientId) {
    try {
        const response = await fetch(`/api/clients/${clientId}`);
        const client = await response.json();

        document.getElementById('editClientId').value = client.id;
        document.getElementById('editFirstName').value = client.first_name;
        document.getElementById('editLastName').value = client.last_name;
        document.getElementById('editPhone').value = client.phone_number;

        // Populate children
        const childrenContainer = document.getElementById('childrenContainer');
        childrenContainer.innerHTML = '<h4 style="margin: 1.5rem 0 1rem;">Farzandlar:</h4>';

        if (client.children && client.children.length > 0) {
            client.children.forEach((child, index) => {
                childrenContainer.innerHTML += `
                    <div class="form-group" style="background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                        <label>Farzand ${index + 1} ismi</label>
                        <input type="text" class="child-name" value="${child.first_name}" data-index="${index}">
                        <label style="margin-top: 0.5rem;">Tug'ilgan yil</label>
                        <input type="number" class="child-year" value="${child.birth_year}" data-index="${index}">
                        <label style="margin-top: 0.5rem;">Tug'ilgan oy</label>
                        <input type="number" class="child-month" value="${child.birth_month}" min="1" max="12" data-index="${index}">
                        <label style="margin-top: 0.5rem;">Tug'ilgan kun</label>
                        <input type="number" class="child-day" value="${child.birth_day}" min="1" max="31" data-index="${index}">
                    </div>
                `;
            });
        }

        document.getElementById('editClientModal').classList.add('show');
    } catch (error) {
        console.error('Edit client error:', error);
        alert('Xatolik yuz berdi');
    }
}

// Save edited client
const editClientForm = document.getElementById('editClientForm');
if (editClientForm) {
    editClientForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const clientId = document.getElementById('editClientId').value;
        const first_name = document.getElementById('editFirstName').value;
        const last_name = document.getElementById('editLastName').value;
        const phone_number = document.getElementById('editPhone').value;

        // Collect children data
        const children = [];
        const childNames = document.querySelectorAll('.child-name');
        childNames.forEach((input, index) => {
            const yearInput = document.querySelector(`.child-year[data-index="${index}"]`);
            const monthInput = document.querySelector(`.child-month[data-index="${index}"]`);
            const dayInput = document.querySelector(`.child-day[data-index="${index}"]`);

            if (input.value && yearInput.value && monthInput.value && dayInput.value) {
                children.push({
                    first_name: input.value,
                    birth_year: parseInt(yearInput.value),
                    birth_month: parseInt(monthInput.value),
                    birth_day: parseInt(dayInput.value)
                });
            }
        });

        try {
            const response = await fetch(`/api/clients/${clientId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ first_name, last_name, phone_number, children })
            });

            if (response.ok) {
                document.getElementById('editClientModal').classList.remove('show');
                loadClients();
            } else {
                const data = await response.json();
                alert(data.error || 'Xatolik yuz berdi');
            }
        } catch (error) {
            console.error('Update client error:', error);
            alert('Xatolik yuz berdi');
        }
    });
}

// Delete client
async function deleteClient(clientId) {
    if (!confirm('Haqiqatan ham bu klientni o\'chirmoqchimisiz?')) {
        return;
    }

    try {
        const response = await fetch(`/api/clients/${clientId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            loadClients();
        } else {
            const data = await response.json();
            alert(data.error || 'Xatolik yuz berdi');
        }
    } catch (error) {
        console.error('Delete client error:', error);
        alert('Xatolik yuz berdi');
    }
}

// Toggle block status
async function toggleBlock(clientId, shouldBlock) {
    try {
        const response = await fetch(`/api/clients/${clientId}/block`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ is_blocked: shouldBlock })
        });

        if (response.ok) {
            loadClients();
        } else {
            const data = await response.json();
            alert(data.error || 'Xatolik yuz berdi');
        }
    } catch (error) {
        console.error('Toggle block error:', error);
        alert('Xatolik yuz berdi');
    }
}
