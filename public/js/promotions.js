// Load all promotions
async function loadPromotions() {
    try {
        const response = await fetch('/api/promotions');
        const promotions = await response.json();

        const container = document.getElementById('promotionsList');

        if (promotions.length === 0) {
            container.innerHTML = '<div class="card"><p style="text-align: center; color: var(--text-muted);">Hozircha aksiyalar yo\'q</p></div>';
            return;
        }

        container.innerHTML = promotions.map(promo => {
            let scheduleInfo = '';

            if (promo.pattern_type === 'weekly' && promo.pattern_data && promo.pattern_data.weekDays) {
                const dayNames = ['Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'];
                const days = promo.pattern_data.weekDays.map(d => dayNames[d]).join(', ');
                scheduleInfo = `<div><strong>📆 Haftalik:</strong> <span style="color: var(--text-muted);">${days}</span></div>`;
            } else if (promo.start_date && promo.end_date) {
                scheduleInfo = `
                    <div><strong>Boshlanish:</strong> <span style="color: var(--text-muted);">${formatDate(promo.start_date)}</span></div>
                    <div><strong>Tugash:</strong> <span style="color: var(--text-muted);">${formatDate(promo.end_date)}</span></div>
                `;
            }

            return `
            <div class="card">
                <div class="card-header">
                    <div>
                        <h3 class="card-title">🎁 ${promo.name}</h3>
                        ${promo.description ? `<p style="color: var(--text-muted); margin-top: 0.5rem;">${promo.description}</p>` : ''}
                    </div>
                    <div class="card-actions">
                        <button class="btn-small" onclick="editPromotion(${promo.id})">Tahrirlash</button>
                        <button class="btn-small btn-danger" onclick="deletePromotion(${promo.id})">O'chirish</button>
                    </div>
                </div>
                <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-top: 1rem;">
                    ${scheduleInfo}
                    <div>
                        ${promo.is_active
                    ? '<span class="badge badge-active">Aktiv</span>'
                    : '<span class="badge badge-blocked">Nofaol</span>'
                }
                    </div>
                </div>
            </div>
        `;
        }).join('');
    } catch (error) {
        console.error('Load promotions error:', error);
        document.getElementById('promotionsList').innerHTML =
            '<div class="card"><p style="text-align: center; color: #f5576c;">Xatolik yuz berdi</p></div>';
    }
}

// Select promotion type (card-based UI)
function selectPromoType(type) {
    // Update radio button
    document.querySelector(`input[name="promotionType"][value="${type}"]`).checked = true;

    // Update card states
    document.querySelectorAll('.promo-type-card').forEach(card => {
        card.classList.remove('selected');
    });
    document.querySelector(`.promo-type-card[data-type="${type}"]`).classList.add('selected');

    // Toggle fields
    togglePromotionType();
}

// Toggle promotion type fields
function togglePromotionType() {
    const type = document.querySelector('input[name="promotionType"]:checked').value;
    const dateRangeFields = document.getElementById('dateRangeFields');
    const weeklyFields = document.getElementById('weeklyFields');

    if (type === 'date_range') {
        dateRangeFields.style.display = 'block';
        weeklyFields.style.display = 'none';
        document.getElementById('promotionStartDate').required = true;
        document.getElementById('promotionEndDate').required = true;
    } else {
        dateRangeFields.style.display = 'none';
        weeklyFields.style.display = 'block';
        document.getElementById('promotionStartDate').required = false;
        document.getElementById('promotionEndDate').required = false;
    }
}

// Create new promotion
const promotionForm = document.getElementById('promotionForm');
if (promotionForm) {
    promotionForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('promotionName').value;
        const description = document.getElementById('promotionDescription').value;
        const type = document.querySelector('input[name="promotionType"]:checked').value;

        let promotionData = {
            name,
            description,
            pattern_type: type
        };

        if (type === 'date_range') {
            const start_date = document.getElementById('promotionStartDate').value;
            const end_date = document.getElementById('promotionEndDate').value;

            if (!start_date || !end_date) {
                alert('Boshlanish va tugash sanalarini kiriting');
                return;
            }

            promotionData.start_date = start_date;
            promotionData.end_date = end_date;
        } else {
            // Weekly schedule
            const checkedDays = Array.from(document.querySelectorAll('input[name="weekDays"]:checked'))
                .map(cb => parseInt(cb.value));

            if (checkedDays.length === 0) {
                alert('Kamida bitta kunni tanlang');
                return;
            }

            promotionData.pattern_data = JSON.stringify({ weekDays: checkedDays });
        }

        const submitBtn = e.target.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="loading"></span> Yuborilmoqda...';

        try {
            const response = await fetch('/api/promotions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(promotionData)
            });

            const data = await response.json();

            if (response.ok) {
                alert('✅ Aksiya yaratildi va barcha foydalanuvchilarga xabar yuborildi!');
                promotionForm.reset();
                togglePromotionType(); // Reset form display
                loadPromotions();
            } else {
                alert(data.error || 'Xatolik yuz berdi');
            }
        } catch (error) {
            console.error('Create promotion error:', error);
            alert('Xatolik yuz berdi');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Aksiya yaratish va xabar yuborish';
        }
    });
}

// Edit promotion
async function editPromotion(promotionId) {
    try {
        const response = await fetch('/api/promotions');
        const promotions = await response.json();
        const promo = promotions.find(p => p.id === promotionId);

        if (!promo) return;

        document.getElementById('editPromotionId').value = promo.id;
        document.getElementById('editPromotionName').value = promo.name;
        document.getElementById('editPromotionDescription').value = promo.description || '';
        document.getElementById('editPromotionStartDate').value = promo.start_date || '';
        document.getElementById('editPromotionEndDate').value = promo.end_date || '';

        document.getElementById('editPromotionModal').classList.add('show');
    } catch (error) {
        console.error('Edit promotion error:', error);
        alert('Xatolik yuz berdi');
    }
}

// Save edited promotion
const editPromotionForm = document.getElementById('editPromotionForm');
if (editPromotionForm) {
    editPromotionForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const promotionId = document.getElementById('editPromotionId').value;
        const name = document.getElementById('editPromotionName').value;
        const description = document.getElementById('editPromotionDescription').value;
        const start_date = document.getElementById('editPromotionStartDate').value;
        const end_date = document.getElementById('editPromotionEndDate').value;

        try {
            const response = await fetch(`/api/promotions/${promotionId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    description,
                    start_date: start_date || null,
                    end_date: end_date || null
                })
            });

            if (response.ok) {
                document.getElementById('editPromotionModal').classList.remove('show');
                loadPromotions();
            } else {
                const data = await response.json();
                alert(data.error || 'Xatolik yuz berdi');
            }
        } catch (error) {
            console.error('Update promotion error:', error);
            alert('Xatolik yuz berdi');
        }
    });
}

// Delete promotion
async function deletePromotion(promotionId) {
    if (!confirm('Haqiqatan ham bu aksiyani o\'chirmoqchimisiz?')) {
        return;
    }

    try {
        const response = await fetch(`/api/promotions/${promotionId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            loadPromotions();
        } else {
            const data = await response.json();
            alert(data.error || 'Xatolik yuz berdi');
        }
    } catch (error) {
        console.error('Delete promotion error:', error);
        alert('Xatolik yuz berdi');
    }
}

// Helper function to format date
function formatDate(dateStr) {
    const date = new Date(dateStr);
    const months = [
        'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
        'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'
    ];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}
