import { createClient } from '@supabase/supabase-js'

// --- CẤU HÌNH SUPABASE ---
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Verification (Password Simple)
const ACCESS_PASSWORD = 'admin';

// Map địa điểm từ code sang tên đầy đủ
const LOCATION_MAP = {
    'hn': 'Hà Nội',
    'hp': 'Hải Phòng',
    'dn': 'Đà Nẵng',
    'bn': 'Bắc Ninh',
    'hy': 'Hưng Yên'
};

async function fetchApplications() {
    const tableBody = document.getElementById('tableBody');
    const totalCountEl = document.getElementById('totalCount');
    const todayCountEl = document.getElementById('todayCount');
    const lastUpdatedEl = document.getElementById('lastUpdated');

    try {
        // Fetch all applications sorted by date (desc)
        const { data, error } = await supabase
            .from('applications')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Statistics
        totalCountEl.innerText = data.length;
        
        const today = new Date().toISOString().split('T')[0];
        const todayApplications = data.filter(app => app.created_at.startsWith(today));
        todayCountEl.innerText = todayApplications.length;

        lastUpdatedEl.innerText = `Cập nhật lúc: ${new Date().toLocaleTimeString()}`;

        // Render Table
        if (data.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="5" class="empty-state">Chưa có ứng viên nào ứng tuyển.</td></tr>`;
            return;
        }

        tableBody.innerHTML = data.map(app => {
            const date = new Date(app.created_at).toLocaleString('vi-VN');
            
            // Chuyển đổi mã (hn, hp...) sang tên đầy đủ (Hà Nội, Hải Phòng...)
            const locationsHtml = (app.locations || []).map(locCode => {
                const fullName = LOCATION_MAP[locCode] || locCode;
                return `<span class="location-tag">${fullName}</span>`;
            }).join('');
            
            return `
                <tr>
                    <td class="date-cell">${date}</td>
                    <td style="font-weight: 600;">${app.full_name}</td>
                    <td><a href="tel:${app.phone}" style="color: #2563eb; font-weight: 500;">${app.phone}</a></td>
                    <td>${app.address || '-'}</td>
                    <td>${locationsHtml || '-'}</td>
                </tr>
            `;
        }).join('');

    } catch (error) {
        console.error('Error fetching data:', error.message);
        tableBody.innerHTML = `<tr><td colspan="5" class="empty-state" style="color: #ef4444;">Lỗi khi tải dữ liệu. Vui lòng kiểm tra cấu hình Supabase.</td></tr>`;
    }
}

// Initial Loading
document.addEventListener('DOMContentLoaded', () => {
    // Simple Auth (Password Prompt)
    // if (prompt('Vui lòng nhập mật khẩu Quản trị để tiếp tục:') !== ACCESS_PASSWORD) {
    //     alert('Mật khẩu không đúng!');
    //     window.location.href = 'index.html';
    //     return;
    // }

    fetchApplications();

    const refreshBtn = document.getElementById('refreshBtn');
    if(refreshBtn) {
        refreshBtn.addEventListener('click', fetchApplications);
    }
});
