// Load upcoming birthdays
async function loadBirthdays() {
    try {
        const response = await fetch('/api/birthdays/upcoming');
        const birthdays = await response.json();

        const container = document.getElementById('birthdaysList');

        if (birthdays.length === 0) {
            container.innerHTML = '<div class="card"><p style="text-align: center; color: var(--text-muted);">Yaqin kunlarda tug\'ilgan kunlar yo\'q</p></div>';
            return;
        }

        // Group by days until birthday
        const today = birthdays.filter(b => b.days_until_birthday === 0);
        const upcoming = birthdays.filter(b => b.days_until_birthday > 0);

        let html = '';

        // Today's birthdays section
        if (today.length > 0) {
            html += `
                <div class="card" style="border: 2px solid #4facfe; background: linear-gradient(135deg, rgba(79, 172, 254, 0.1) 0%, rgba(0, 242, 254, 0.1) 100%);">
                    <div class="card-header">
                        <h2 class="card-title">🎉 Bugun tug'ilgan kunlar (${today.length})</h2>
                        <button class="btn-small btn-success" onclick="sendTodayInvitations()">
                            📨 Barchaga xabar yuborish
                        </button>
                    </div>
                    <div class="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>Ota-ona</th>
                                    <th>Telefon</th>
                                    <th>Farzand</th>
                                    <th>Yosh</th>
                                    <th>Tug'ilgan kun</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${today.map(item => `
                                    <tr>
                                        <td>${item.parent_first_name} ${item.parent_last_name}</td>
                                        <td>${item.phone_number}</td>
                                        <td><strong>${item.first_name}</strong></td>
                                        <td>${item.age} yosh</td>
                                        <td>🎂 ${item.birth_day}.${item.birth_month}.${item.birth_year}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        }

        // Upcoming birthdays section
        if (upcoming.length > 0) {
            html += `
                <div class="card">
                    <div class="card-header">
                        <h2 class="card-title">📅 Yaqinlashayotgan tug'ilgan kunlar (${upcoming.length})</h2>
                    </div>
                    <div class="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>Ota-ona</th>
                                    <th>Telefon</th>
                                    <th>Farzand</th>
                                    <th>Yosh</th>
                                    <th>Tug'ilgan kun</th>
                                    <th>Qolgan kunlar</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${upcoming.map(item => `
                                    <tr>
                                        <td>${item.parent_first_name} ${item.parent_last_name}</td>
                                        <td>${item.phone_number}</td>
                                        <td><strong>${item.first_name}</strong></td>
                                        <td>${item.age} yosh</td>
                                        <td>🎂 ${item.birth_day}.${item.birth_month}.${item.birth_year}</td>
                                        <td>
                                            <span class="badge badge-active">
                                                ${item.days_until_birthday} kun
                                            </span>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        }

        container.innerHTML = html;
    } catch (error) {
        console.error('Load birthdays error:', error);
        document.getElementById('birthdaysList').innerHTML =
            '<div class="card"><p style="text-align: center; color: #f5576c;">Xatolik yuz berdi</p></div>';
    }
}

// Send invitation messages to today's birthday parents
async function sendTodayInvitations() {
    if (!confirm('Bugun tug\'ilgan kuni bo\'lgan barcha ota-onalarga "Sizni kutib qolamiz" xabarini yubormoqchimisiz?')) {
        return;
    }

    try {
        const response = await fetch('/api/birthdays/send-invitations', {
            method: 'POST'
        });

        const data = await response.json();

        if (response.ok) {
            alert(`✅ ${data.sent_count} ta xabar yuborildi!`);
        } else {
            alert(data.error || 'Xatolik yuz berdi');
        }
    } catch (error) {
        console.error('Send invitations error:', error);
        alert('Xatolik yuz berdi');
    }
}
