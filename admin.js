// Store API Key basically (In real app, use token)
let currentApiKey = "";

// Helper to escape HTML and prevent XSS
function escapeHTML(str) {
    if (!str) return "";
    return str.toString().replace(/[&<>"']/g, function(m) {
        return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[m];
    });
}

// Check Login
function checkLogin() {
    const api_key = document.getElementById('adminPassword').value;
    currentApiKey = api_key;

    // Verify API Key by attempting to load data with X-API-Key header
    fetch(`http://localhost:8000/api/admin/data`, {
        headers: {
            'X-API-Key': api_key
        }
    })
    .then(response => {
        if (response.ok) {
            document.getElementById('loginScreen').style.display = 'none';
            return response.json();
        } else {
            throw new Error('Unauthorized');
        }
    })
    .then(data => {
        renderData(data);
    })
    .catch(error => {
        alert('ログインできません。認証キーが違うか、サーバーが起動していません。');
    });
}

// Logout
function logout() {
    location.reload();
}

// Switch Tabs
function switchTab(tabName) {
    document.querySelectorAll('.data-table-container').forEach(el => {
        el.classList.remove('active');
    });
    document.getElementById(tabName).classList.add('active');

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.currentTarget.classList.add('active');
}

// Load and Render Data
function loadData() {
    if (!currentApiKey) return;

    fetch(`http://localhost:8000/api/admin/data`, {
        headers: {
            'X-API-Key': currentApiKey
        }
    })
    .then(response => response.json())
    .then(data => {
        renderData(data);
    })
    .catch(error => console.error('Error:', error));
}

function renderData(data) {
    // --- Inquiries ---
    const inquiries = data.inquiries;
    const inquiriesBody = document.getElementById('inquiriesBody');

    if (inquiries.length === 0) {
        inquiriesBody.innerHTML = '<tr><td colspan="6" style="text-align:center;">データがありません</td></tr>';
    } else {
        // Security Fix: Use escapeHTML for all user-submitted fields to prevent XSS
        inquiriesBody.innerHTML = inquiries.map(item => `
            <tr>
                <td>${escapeHTML(item.created_at)}</td>
                <td style="font-weight:bold;">${escapeHTML(item.name)}</td>
                <td>${escapeHTML(item.email)}<br><small>${escapeHTML(item.phone || '')}</small></td>
                <td><span class="status-badge status-new">${escapeHTML(item.subject)}</span></td>
                <td>${escapeHTML(item.message)}</td>
                <td>未対応</td>
            </tr>
        `).join('');
    }

    // --- Applications ---
    const applications = data.applications;
    const applicationsBody = document.getElementById('applicationsBody');

    if (applications.length === 0) {
        applicationsBody.innerHTML = '<tr><td colspan="6" style="text-align:center;">データがありません</td></tr>';
    } else {
        // Security Fix: Use escapeHTML for all user-submitted fields to prevent XSS
        applicationsBody.innerHTML = applications.map(item => `
            <tr>
                <td>${escapeHTML(item.created_at)}</td>
                <td style="font-weight:bold;">${escapeHTML(item.name)}</td>
                <td>${escapeHTML(item.age)}歳</td>
                <td>${escapeHTML(item.email)}<br><small>${escapeHTML(item.phone)}</small></td>
                <td>${escapeHTML(getExperienceLabel(item.experience))}</td>
                <td>${escapeHTML(item.message)}</td>
            </tr>
        `).join('');
    }
}

// Helper for labels
function getExperienceLabel(key) {
    const map = {
        'none': '未経験',
        'cafe': 'カフェ経験あり',
        'maid': 'メイドカフェ経験あり',
        'other': 'その他接客'
    };
    return map[key] || key;
}

// Set Date
document.getElementById('currentDate').textContent = new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' });
