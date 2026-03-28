import { createClient } from '@supabase/supabase-js'

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Adjusting for the fixed header
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
                window.scrollTo({
                     top: offsetPosition,
                     behavior: 'smooth'
                });
            }
        });
    });

    // --- CẤU HÌNH API (VITE ENV) ---
    const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
    const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
    const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL;
    const _supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Form submission processing
    const form = document.getElementById('applyForm');
    if(form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
                alert('Lỗi: Cấu hình API chưa hoàn thiện.');
                return;
            }

            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerText;
            
            try {
                // Show loading state
                submitBtn.innerText = 'ĐANG GỬI...';
                submitBtn.disabled = true;

                const formData = new FormData(form);
                
                // Ánh xạ mã vùng sang tên tiếng Việt hiển thị rõ ràng trên Google Sheets/Email
                const locationLabels = {
                    'hn': 'Hà Nội',
                    'hp': 'Hải Phòng',
                    'dn': 'Đà Nẵng',
                    'bn': 'Bắc Ninh',
                    'hy': 'Hưng Yên'
                };
                const locations = formData.getAll('location').map(code => locationLabels[code] || code);

                const data = {
                    full_name: formData.get('full_name'),
                    phone: formData.get('phone'),
                    address: formData.get('address'),
                    locations: locations
                };

                // 1. GỬI ĐẾN SUPABASE (DATABASE CHÍNH)
                const { error } = await _supabase
                    .from('applications')
                    .insert([data]);

                if (error) throw error;

                // 2. GỬI ĐẾN GOOGLE SHEETS & EMAIL (THÔNG BÁO)
                if (GOOGLE_SCRIPT_URL && GOOGLE_SCRIPT_URL !== "") {
                    try {
                        // Khi dùng 'no-cors', cần để Content-Type là 'text/plain' 
                        // để tránh trình duyệt chặn request do vi phạm CORS preflight.
                        // Google Script vẫn nhận được chuỗi JSON trong e.postData.contents.
                        await fetch(GOOGLE_SCRIPT_URL, {
                            method: 'POST',
                            mode: 'no-cors',
                            headers: {
                                'Content-Type': 'text/plain',
                            },
                            body: JSON.stringify(data),
                        });
                        console.log('Đã gửi dữ liệu sang Google Sheets & Email.');
                    } catch (err) {
                        console.error('Google Script Error:', err);
                    }
                }

                alert('Cảm ơn bạn đã ứng tuyển! Chúng tôi đã nhận được thông tin và sẽ liên hệ lại sớm nhất.');
                form.reset();
            } catch (error) {
                console.error('Error submitting form:', error.message);
                alert('Có lỗi xảy ra khi gửi thông tin. Vui lòng thử lại sau hoặc liên hệ Hotline.');
            } finally {
                // Restore button state
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }

    // Toggle Khóa học Đào tạo
    const trainingToggle = document.getElementById('trainingToggle');
    const trainingAccordion = document.getElementById('trainingAccordion');
    
    if (trainingToggle && trainingAccordion) {
        trainingToggle.addEventListener('click', function() {
            trainingAccordion.classList.toggle('active');
        });
    }

    // Thiết lập độ trễ (Stagger) cho hiệu ứng Punch Impact
    document.querySelectorAll('.apply-box').forEach((btn, index) => {
        btn.style.setProperty('--delay', `${index * 0.25}s`);
        
        // Thêm click effect cho cảm giác nút vật lý
        btn.addEventListener('mousedown', function() {
            this.style.transform = 'scale(0.9)';
            this.style.transition = 'transform 0.1s';
        });
        btn.addEventListener('mouseup', function() {
            this.style.transform = '';
            this.style.transition = '';
        });
    });

    // Toggle Trụ sở ở Footer
    document.querySelectorAll('.toggle-hq').forEach(btn => {
        btn.addEventListener('click', function() {
            const footerCol = this.parentElement;
            footerCol.classList.toggle('expanded');
            this.textContent = footerCol.classList.contains('expanded') ? 'THU GỌN' : '...';
        });
    });
});
