/**
 * PHONECHIT INTHASONE — 4D Modern Interactive Engine
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    if (window.lucide) {
        lucide.createIcons();
    }

    initLoader();
    initCustomCursor();
    initParticleCanvas();
    init3DTilt();
    initScrollEngine();
    initLanguageEngine();
    initThemeToggle();
    initMobileMenu();
});

/* --------------------------------------------------------------------------
   1. INTRO LOADING SCREEN
   -------------------------------------------------------------------------- */
function initLoader() {
    const loader = document.getElementById('loader');
    const fill = document.getElementById('loader-fill');
    const counter = document.getElementById('loader-counter');
    let progress = 0;

    const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 15) + 5;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setTimeout(() => {
                if (loader) loader.classList.add('fade-out');
            }, 300);
        }
        if (fill) fill.style.width = `${progress}%`;
        if (counter) counter.textContent = `${progress}%`;
    }, 60);
}

/* --------------------------------------------------------------------------
   2. CUSTOM CURSOR
   -------------------------------------------------------------------------- */
function initCustomCursor() {
    const dot = document.getElementById('cursor-dot');
    const outline = document.getElementById('cursor-outline');

    if (!dot || !outline || window.innerWidth <= 768) return;

    window.addEventListener('mousemove', (e) => {
        const { clientX: x, clientY: y } = e;
        dot.style.left = `${x}px`;
        dot.style.top = `${y}px`;

        outline.animate({
            left: `${x}px`,
            top: `${y}px`
        }, { duration: 250, fill: 'forwards' });
    });
}

/* --------------------------------------------------------------------------
   3. BACKGROUND 4D PARTICLE CANVAS (CONSTELLATION EFFECT)
   -------------------------------------------------------------------------- */
function initParticleCanvas() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const particles = [];
    const count = window.innerWidth < 768 ? 35 : 75;

    for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 2 + 1,
            vx: (Math.random() - 0.5) * 1.2,
            vy: (Math.random() - 0.5) * 1.2
        });
    }

    function render() {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
            let p = particles[i];
            p.x += p.vx;
            p.y += p.vy;

            // ເດັ້ງກັບເມື່ອຊົນຂອບໜ້າຈໍ
            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;

            // ແຕ້ມເມັດດາວ
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.x < width / 2 ? 'rgba(255, 60, 100, 0.7)' : 'rgba(0, 200, 255, 0.7)';
            ctx.fill();

            // ແຕ້ມເສັ້ນເຊື່ອມໂຍງດາວ
            for (let j = i + 1; j < particles.length; j++) {
                let p2 = particles[j];
                let dx = p.x - p2.x;
                let dy = p.y - p2.y;
                let dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 110) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    let strokeColor = (p.x + p2.x) / 2 < width / 2 
                        ? `rgba(200, 30, 80, ${1 - dist / 110})` 
                        : `rgba(0, 180, 230, ${1 - dist / 110})`;
                    ctx.strokeStyle = strokeColor;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(render);
    }

    render();

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });
}

/* --------------------------------------------------------------------------
   4. 3D CARD TILT EXPERIENCE (PROFILE & LICENSE)
   -------------------------------------------------------------------------- */
function init3DTilt() {
    const profileCard = document.getElementById('profile-card');
    const licenseCard = document.getElementById('license-card');

    function applyTilt(card) {
        if (!card) return;
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            const rotateX = -(y / rect.height) * 20;
            const rotateY = (x / rect.width) * 20;

            card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'rotateX(0deg) rotateY(0deg) translateZ(0px)';
        });
    }

    applyTilt(profileCard);
    applyTilt(licenseCard);
}

/* --------------------------------------------------------------------------
   5. SCROLL ENGINE & PROGRESS & REVEAL
   -------------------------------------------------------------------------- */
function initScrollEngine() {
    const progressBar = document.getElementById('scroll-progress');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        // Scroll Progress
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        if (progressBar) progressBar.style.width = `${progress}%`;

        // Active Nav Link
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            if (scrollTop >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // IntersectionObserver for Scroll Reveal & Skill Bar Fill
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');

                // Trigger skill bar filling
                if (entry.target.classList.contains('skills-section')) {
                    document.querySelectorAll('.skill-fill').forEach(fill => {
                        const target = fill.getAttribute('data-target');
                        fill.style.width = `${target}%`;
                    });
                }
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('[data-scroll], .skills-section').forEach(el => observer.observe(el));
}

/* --------------------------------------------------------------------------
   6. MULTI-LANGUAGE ENGINE (EN, LA, TH)
   -------------------------------------------------------------------------- */
const translations = {
    en: {
        nav_home: "HOME", nav_about: "ABOUT", nav_skills: "SKILLS",
        nav_education: "EDUCATION", nav_experience: "EXPERIENCE", nav_license: "LICENSE", nav_contact: "CONTACT",
        hero_badge: "DIGITAL PROFILE & WORKS", hero_greeting: "HELLO, I'M",
        hero_subtitle: "Warehouse Management / Audit & KPI • Sales & Marketing Document Storage",
        hero_bio: "Dedicated worker with expertise in stock control, operational audit, KPI tracking, basic graphic design, web development, and document archiving.",
        hero_cta_explore: "EXPLORE MY CV", hero_cta_pdf: "DOWNLOAD / PRINT PDF",
        card_role: "Warehouse Management / Audit & KPI / Sales / Document Storage", card_status: "Available for Job Opportunities",
        about_tag: "DISCOVER", about_title: "ABOUT PHONECHIT", about_heading: "Personal Profile",
        about_p1: "My name is Phonechit INTHASONE, born on November 27, 2004, in Yor Village, Beng District, Oudomxay Province. I am detail-oriented, a team player, and have strong foundations in warehouse auditing, KPI tracking, sales strategies, and creative design.",
        about_p2: "By combining operational discipline with modern digital technology, I optimize STOCK management systems, monitor performance metrics, and create outstanding graphic media.",
        about_full_name: "Full Name", about_location: "Address", about_education_label: "Education", about_license_label: "Driving License",
        about_core_competencies: "Core Competencies",
        comp_1: "Warehouse Management & Stock Audit", comp_2: "KPI Tracking & Operations Analysis",
        comp_3: "Sales Strategies & Client Marketing", comp_4: "Basic Graphic Design & Web Development",
        comp_5: "Effective Application of AI Tools", comp_6: "Proficiency in Microsoft Office Programs",
        skills_tag: "CAPABILITIES", skills_title: "SKILLS & LANGUAGES", skills_technical: "Technical Skills",
        languages_title: "Language Proficiency Level", lang_lao: "Lao Language", lang_thai: "Thai Language", lang_english: "English Language",
        edu_tag: "ACADEMICS", edu_title: "EDUCATION HISTORY",
        edu_desc_quest: "Major: Information Technology Management.",
        edu_desc_school: "Graduated with basic secondary to upper secondary education diploma.",
        exp_tag: "CAREER", exp_title: "WORK EXPERIENCE",
        exp_title_sales: "Houng Aloun Huatongta Motor Co., Ltd.", exp_org_sales: "Sales & Marketing Assistant — Commercial Operations",
        exp_sales_1: "Prepare sales documents for the sales team, summarize meeting minutes, track internal inventory across company and factory.",
        exp_sales_2: "Engage clients, plan client acquisition strategies, present sales proposals, analyze market trends to tailor products to client needs.",
        exp_sales_3: "Coordinate the sales funnel and manage customer relationship tracking systems.",
        exp_title_audit: "Chokthavy Trading Import-Export Sole Co., Ltd.", exp_org_audit: "Warehouse Management / Audit & KPI",
        exp_audit_1: "Audit inventory stock balances, perform physical stock counting, and prepare audit sheets.",
        exp_audit_2: "Track operational KPI indicators to enhance operational efficiency.",
        exp_audit_3: "Prepare stock summary balance reports and analyze variances for management.",
        exp_title_intern: "Department of Enterprise Registration and Management, Ministry of Industry and Commerce", exp_org_intern: "Student Intern",
        exp_intern_1: "Assisted officers in document filing and sectoral administrative operations.",
        exp_intern_2: "Gained real-world experience in official workflows and state reporting systems.",
        lic_tag: "CERTIFICATE", lic_title: "DRIVING LICENSE", lic_desc: "Light Truck / 4-Wheel Vehicle",
        contact_tag: "CONTACT METHODS", contact_title: "CONTACT ME", contact_subtitle: "Direct Contact",
        contact_lead: "Open to job offers, sales collaborations, warehouse management, or design work.",
        contact_email: "Email", contact_phone: "Phone Number", contact_location_label: "Address",
        form_label_name: "Your Name", form_label_email: "Your Email", form_label_subject: "Subject", form_label_msg: "Message", form_send: "SEND MESSAGE"
    },
    la: {
        nav_home: "ໜ້າຫຼັກ", nav_about: "ກ່ຽວກັບ", nav_skills: "ທັກສະ",
        nav_education: "ການສຶກສາ", nav_experience: "ປະສົບການ", nav_license: "ໃບຂັບຂີ່", nav_contact: "ຕິດຕໍ່",
        hero_badge: "ຂໍ້ມູນສ່ວນຕົວ DIGITAL & ຜົນງານ", hero_greeting: "ສະບາຍດີ, ຂ້ອຍຊື່",
        hero_subtitle: "ເຮັດວຽກດ້ານ ບໍລິຫານຄັງສິນຄ້າ/ກວດສອບ & KPI • ຈັດເກັບເອກະສານ ຝ່າຍຂາຍ ແລະ ການຕະຫຼາດ",
        hero_bio: "ມຸ່ງໝັ້ນໃນການເຮັດວຽກ ດ້ວຍຄວາມຊຳນານດ້ານການຄວບຄຸມສະຕ໊ອກ, ກວດສອບການດຳເນີນງານ, ຕິດຕາມ KPI, ພື້ນຖານການອອກແບບກຣາບຟິກ, ພັດທະນາເວັບໄຊ ແລະ ຈັດເກັບເອກະສານ.",
        hero_cta_explore: "ເບິ່ງ CV ຂອງຂ້ອຍ", hero_cta_pdf: "ດາວໂຫຼດ / ພິມ PDF",
        card_role: "ບໍລິຫານຄັງສິນຄ້າ / ກວດສອບ & KPI / ຝ່າຍຂາຍ / ຈັດເກັບເອກະສານ", card_status: "ພ້ອມຮັບໂອກາດການເຮັດວຽກ",
        about_tag: "ຄົ້ນຫາ", about_title: "ກ່ຽວກັບ ພອນຈິດ", about_heading: "ປະວັດສ່ວນຕົວ",
        about_p1: "ຂ້າພະເຈົ້າ ຊື່ ພອນຈິດ ອິນທະສອນ (Phonechit INTHASONE)ເກີດເມື່ອວັນທີ 27 ພະຈິກ 2004 ທີ່ບ້ານຍໍ້, ເມືອງແບງ, ແຂວງອຸດົມໄຊ. ເປັນຄົນທີ່ໃສ່ໃຈໃນລາຍລະອຽດ,ສາມາດເຮັດວຽກເປັນທີມໄດ້ ມີພື້ນຖານດ້ານການກວດສອບຄັງສິນຄ້າ, ການຕິດຕາມຕົວຊີ້ວັດ KPI, ກົນລະຍຸດການຂາຍ ແລະ ການອອກແບບສ້າງສັນ.",
        about_p2: "ດ້ວຍການປະສົມປະສານລະຫວ່າງລະບຽບການດຳເນີນງານ ແລະ ເທັກໂນໂລຢີດິຈິຕ້ອນທີ່ທັນສະໄໝ, ຂ້ອຍສາມາດເພີ່ມປະສິດທິພາບລະບົບການຈັດການ STOCK, ຕິດຕາມຕົວຊີ້ວັດຜົນງານ ແລະ ສ້າງສັນສື່ກຣາຟິກທີ່ໂດດເດັ່ນ.",
        about_full_name: "ຊື່ ແລະ ນາມສະກຸນ", about_location: "ທີ່ຢູ່", about_education_label: "ການສຶກສາ", about_license_label: "ໃບຂັບຂີ່",
        about_core_competencies: "ຄວາມສາມາດຫຼັກ",
        comp_1: "ການຈັດການ ແລະ ກວດສອບຄັງສິນຄ້າ", comp_2: "ການຕິດຕາມ KPI ແລະ ວິເຄາະການດຳເນີນງານ",
        comp_3: "ກົນລະຍຸດການຂາຍ ແລະ ການຕະຫຼາດລູກຄ້າ", comp_4: "ພື້ນຖານການອອກແບບກຣາຟິກ ແລະ ການສ້າງເວັບໄຊນ໌",
        comp_5: "ການນຳໃຊ້ AI ຢ່າງມີປະສິດພິພາບ", comp_6: "ການໃຊ້ງານໂປຣແກຣມ Microsoft Office",
        skills_tag: "ຄວາມສາມາດ", skills_title: "ທັກສະ & ພາສາ", skills_technical: "ທັກສະດ້ານເຕັກນິກ",
        languages_title: "ລະດັບຄວາມສາມາດດ້ານພາສາ", lang_lao: "ພາສາລາວ", lang_thai: "ພາສາໄທ", lang_english: "ພາສາອັງກິດ",
        edu_tag: "ດ້ານການສຶກສາ", edu_title: "ປະວັດການສຶກສາ",
        edu_desc_quest: "ສາຂາ: ບໍລິຫານຂໍ້ມູນຂ່າວສານ ເຕັກໂນໂລຊີ.",
        edu_desc_school: "ສຳເລັດການສຶກສາຂັ້ນພື້ນຖານຕາມຫຼັກສູດມັດທະຍົມຕົ້ນ-ມັດທະຍົມປາຍ.",
        exp_tag: "ປະສົບການ", exp_title: "ປະສົບການເຮັດວຽກ",
        exp_title_sales: "ບໍລິສັດ ຮຸ່ງອາລຸນ ຫົວທົ່ງຕ້າມໍເຕີ ຈຳກັດ", exp_org_sales: "ຜູ້ຊ່ວຍຝ່າຍຂາຍ ແລະ ການຕະຫຼາດ Commercial Operations",
        exp_sales_1: "ຈັດກຽມເອກະສານການຂາຍໄຫ້ທີມຂາຍ,ສະຫຼຸບວຽກການປະຊຸມ,ຕິດຕາມສະຕ໊ອກພາຍໃນບໍລິສັດ ແລະ ໂຮງງານ",
        exp_sales_2: "ດຳເນີນການຕິດຕໍ່ຫາລູກຄ້າ, ວາງກົນລະຍຸດການຈັດຫາລູກຄ້າໃໝ່ ແລະ ນຳສະເໜີແຜນການຂາຍ.ວິເຄາະແນວໂນ້ມຄວາມຕ້ອງການຂອງຕະຫຼາດ ເພື່ອປັບຜະລິດຕະພັນໃຫ້ກົງກັບຄວາມຕ້ອງການຂອງລູກຄ້າ.",
        exp_sales_3: "ປະສານງານ funnel ການຂາຍ ແລະ ດູແລລະບົບຕິດຕາມຄວາມສໍາພັນກັບລູກຄ້າ.",
        exp_title_audit: "ບໍລິສັດ ໂຊກທະວີການຄ້າ ຂາອອກ-ຂາເຂົ້າ ຈຳກັດຜູ້ດຽວ", exp_org_audit: "ບໍລິຫານຄັງສິນຄ້າ/ກວດສອບ & KPI",
        exp_audit_1: "ຈັດການກວດສອບຍອດສະຕ໊ອກສິນຄ້າ, ກວດນັບສິນຄ້າຕົວຈິງ ແລະ ເຮັດບັນຊີກວດສອບ.",
        exp_audit_2: "ຕິດຕາມຕົວຊີ້ວັດ KPI ການດຳເນີນງານ ເພື່ອເພີ່ມປະສິດທິພາບໃນການເຮັດວຽກ.",
        exp_audit_3: "ຈັດເຮັດລາຍງານສະຫຼຸບຍອດຄັງສິນຄ້າ ແລະ ວິເຄາະຜົນຕ່າງສົ່ງໃຫ້ຝ່າຍບໍລິຫານ.",
        exp_title_intern: "ກົມຄຸ້ມຄອງທະບຽນວິສາຫະກິດ,ກະຊວງອຸດສາຫະກຳ ແລະ ການຄ້າ", exp_org_intern: "ນັກສຶກສາຝຶກງານ",
        exp_intern_1: "ຊ່ວຍເຫຼືອເຈົ້າໜ້າທີ່ໃນການຈັດເກັບເອກະສານ ແລະ ການດຳເນີນງານດ້ານຂະແໜງການ.",
        exp_intern_2: "ໄດ້ຮັບປະສົບການຕົວຈິງກ່ຽວກັບຂັ້ນຕອນການເຮັດວຽກ ແລະ ລະບົບການລາຍງານຂອງລັດ.",
        lic_tag: "ໃບຢັ້ງຢືນ", lic_title: "ໃບຂັບຂີ່", lic_desc: "ລົດບັນທຸກເບົາ / ລົດ 4 ລໍ້",
        contact_tag: "ຊ່ອງທາງຕິດຕໍ່", contact_title: "ຕິດຕໍ່ຫາຂ້ອຍ", contact_subtitle: "ຕິດຕໍ່ໂດຍກົງ",
        contact_lead: "ຍິນດີຮັບຂໍ້ສະເໜີວຽກ, ການຮ່ວມມືດ້ານການຂາຍ, ວຽກບໍລິຫານຄັງສິນຄ້າ ຫຼື ວຽກອອກແບບ.",
        contact_email: "ອີເມວ", contact_phone: "ເບີໂທລະສັບ", contact_location_label: "ທີ່ຢູ່",
        form_label_name: "ຊື່ຂອງທ່ານ", form_label_email: "ອີເມວຂອງທ່ານ", form_label_subject: "ຫົວຂໍ້", form_label_msg: "ຂໍ້ຄວາມ", form_send: "ສົ່ງຂໍ້ຄວາມ"
    },
    th: {
        nav_home: "หน้าแรก", nav_about: "เกี่ยวกับ", nav_skills: "ทักษะ",
        nav_education: "การศึกษา", nav_experience: "ประสบการณ์", nav_license: "ใบขับขี่", nav_contact: "ติดต่อ",
        hero_badge: "ดิจิทัลโปรไฟล์ & ผลงาน", hero_greeting: "สวัสดี, ผมชื่อ",
        hero_subtitle: "บริหารคลังสินค้า/ตรวจสอบ & KPI • จัดเก็บเอกสาร ฝ่ายขายและการตลาด",
        hero_bio: "มุ่งมั่นในการทำงานด้วยความเชี่ยวชาญด้านการควบคุมสต็อก, ตรวจสอบการปฏิบัติงาน, ติดตาม KPI, พื้นฐานการออกแบบกราฟิก, พัฒนาเว็บไซต์ และจัดเก็บเอกสาร",
        hero_cta_explore: "ดู CV ของผม", hero_cta_pdf: "ดาวน์โหลด / พิมพ์ PDF",
        card_role: "บริหารคลังสินค้า / ตรวจสอบ & KPI / ฝ่ายขาย / จัดเก็บเอกสาร", card_status: "พร้อมรับโอกาสในการทำงาน",
        about_tag: "ค้นพบ", about_title: "เกี่ยวกับ โพนจิด", about_heading: "ประวัติส่วนตัว",
        about_p1: "ผมชื่อ โพนจิด อินทะสอน (Phonechit INTHASONE) เกิดเมื่อวันที่ 27 พฤศจิกายน 2004 ที่บ้านย้อ, เมืองแบง, แขวงอุดมไซ เป็นคนที่ใส่ใจในรายละเอียด สามารถทำงานเป็นทีมได้ มีพื้นฐานด้านการตรวจสอบคลังสินค้า, การติดตามตัวชี้วัด KPI, กลยุทธ์การขาย และการออกแบบสร้างสรรค์",
        about_p2: "ด้วยการผสมผสานระหว่างระเบียบการปฏิบัติงานและเทคโนโลยีดิจิทัลที่ทันสมัย ผมสามารถเพิ่มประสิทธิภาพระบบการจัดการ STOCK, ติดตามตัวชี้วัดผลงาน และสร้างสรรค์สื่อกราฟิกที่โดดเด่น",
        about_full_name: "ชื่อ-นามสกุล", about_location: "ที่อยู่", about_education_label: "การศึกษา", about_license_label: "ใบขับขี่",
        about_core_competencies: "ความสามารถหลัก",
        comp_1: "การจัดการและตรวจสอบคลังสินค้า", comp_2: "การติดตาม KPI และวิเคราะห์การปฏิบัติงาน",
        comp_3: "กลยุทธ์การขายและการตลาดลูกค้า", comp_4: "พื้นฐานการออกแบบกราฟิกและการสร้างเว็บไซต์",
        comp_5: "การใช้ AI อย่างมีประสิทธิภาพ", comp_6: "การใช้งานโปรแกรม Microsoft Office",
        skills_tag: "ความสามารถ", skills_title: "ทักษะ & ภาษา", skills_technical: "ทักษะทางเทคนิค",
        languages_title: "ระดับความสามารถด้านภาษา", lang_lao: "ภาษาลาว", lang_thai: "ภาษาไทย", lang_english: "ภาษาอังกฤษ",
        edu_tag: "การศึกษา", edu_title: "ประวัติการศึกษา",
        edu_desc_quest: "สาขา: บริหารเทคโนโลยีสารสนเทศ",
        edu_desc_school: "สำเร็จการศึกษาระดับมัธยมศึกษาตอนต้น-มัธยมศึกษาตอนปลาย",
        exp_tag: "ประสบการณ์", exp_title: "ประสบการณ์ทำงาน",
        exp_title_sales: "บริษัท รุ่งอรุณ หัวทุ่งต้ามอเตอร์ จำกัด", exp_org_sales: "ผู้ช่วยฝ่ายขายและการตลาด Commercial Operations",
        exp_sales_1: "จัดเตรียมเอกสารการขายให้ทีมขาย, สรุปการประชุม, ติดตามสต็อกภายในบริษัทและโรงงาน",
        exp_sales_2: "ติดต่อลูกค้า, วางกลยุทธ์การหาลูกค้าใหม่ และนำเสนอแผนการขาย วิเคราะห์แนวโน้มความต้องการของตลาดเพื่อปรับผลิตภัณฑ์ให้ตรงความต้องการของลูกค้า",
        exp_sales_3: "ประสานงาน sales funnel และดูแลระบบติดตามความสัมพันธ์กับลูกค้า",
        exp_title_audit: "บริษัท โชคทวีการค้า ขาออก-ขาเข้า จำกัดผู้เดียว", exp_org_audit: "บริหารคลังสินค้า/ตรวจสอบ & KPI",
        exp_audit_1: "ตรวจสอบยอดสต็อกสินค้า, ตรวจนับสินค้าจริง และทำบัญชีตรวจสอบ",
        exp_audit_2: "ติดตามตัวชี้วัด KPI การปฏิบัติงานเพื่อเพิ่มประสิทธิภาพในการทำงาน",
        exp_audit_3: "จัดทำรายงานสรุปยอดคลังสินค้าและวิเคราะห์ผลต่างส่งให้ฝ่ายบริหาร",
        exp_title_intern: "กรมทะเบียนและบริหารจัดการวิสาหกิจ, กระทรวงอุตสาหกรรมและการค้า", exp_org_intern: "นักศึกษาฝึกงาน",
        exp_intern_1: "ช่วยเจ้าหน้าที่ในการจัดเก็บเอกสารและการดำเนินงานด้านขอบเขตงาน",
        exp_intern_2: "ได้รับประสบการณ์จริงเกี่ยวกับขั้นตอนการทำงานและระบบการรายงานของรัฐ",
        lic_tag: "ใบรับรอง", lic_title: "ใบขับขี่", lic_desc: "รถบรรทุกเล็ก / รถ 4 ล้อ",
        contact_tag: "ช่องทางการติดต่อ", contact_title: "ติดต่อผม", contact_subtitle: "ติดต่อโดยตรง",
        contact_lead: "ยินดีรับข้อเสนองาน, การร่วมมือด้านการขาย, งานบริหารคลังสินค้า หรือ งานออกแบบ",
        contact_email: "อีเมล", contact_phone: "เบอร์โทรศัพท์", contact_location_label: "ที่อยู่",
        form_label_name: "ชื่อของคุณ", form_label_email: "อีเมลของคุณ", form_label_subject: "หัวข้อ", form_label_msg: "ข้อความ", form_send: "ส่งข้อความ"
    }
};

function initLanguageEngine() {
    const btns = document.querySelectorAll('.lang-btn');

    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            btns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.getAttribute('data-i18n');
                if (translations[lang] && translations[lang][key]) {
                    el.textContent = translations[lang][key];
                }
            });
        });
    });
}

/* --------------------------------------------------------------------------
   7. THEME TOGGLE (DARK / LIGHT)
   -------------------------------------------------------------------------- */
function initThemeToggle() {
    const toggle = document.getElementById('theme-toggle');
    const icon = document.getElementById('theme-icon');

    if (!toggle) return;

    toggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', nextTheme);

        if (icon) {
            if (nextTheme === 'light') {
                icon.setAttribute('data-lucide', 'sun');
            } else {
                icon.setAttribute('data-lucide', 'moon');
            }
        }
        if (window.lucide) lucide.createIcons();
    });
}

/* --------------------------------------------------------------------------
   8. MOBILE HAMBURGER MENU
   -------------------------------------------------------------------------- */
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const menu = document.getElementById('nav-menu');

    if (!hamburger || !menu) return;

    hamburger.addEventListener('click', () => {
        menu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('active');
        });
    });
}