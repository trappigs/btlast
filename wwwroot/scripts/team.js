// Team Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Team member data - YENİ: Her üyeye 'linkedin' alanı eklendi
    const teamData = {
        1: {
            name: "Bilal Aktaş",
            title: "Kurucu & Genel Müdür",
            image: "/media/y3qnyrg5/img_8930.jpg",
            bio: "Uludağ Üniversitesi Mekatronik öğrencisi Furkan, Bosch’taki süreç ve kalite yönetimi deneyimini Bereketli Topraklar’da strateji ve operasyonel mükemmelliğe dönüştürüyor. Disiplinli organizasyon yeteneği, ekip sinerjisini ve iş süreçlerindeki etkililiği artırıyor.",
            linkedin: "https://www.linkedin.com/in/bilalaktas/" // Örnek URL
        },
        2: {
            name: "Furkan Hoşgör",
            title: "Genel Yönetici Asistanı",
            image: "/media/abrlq0cs/furkan-ekip-foto.webp",
            bio: "Uludağ Üniversitesi Mekatronik öğrencisi Furkan, Bosch’taki süreç ve kalite yönetimi deneyimini Bereketli Topraklar’da strateji ve operasyonel mükemmelliğe dönüştürüyor. Disiplinli organizasyon yeteneği, ekip sinerjisini ve iş süreçlerindeki etkililiği artırıyor.",
            linkedin: "https://www.linkedin.com/in/furkan-hosgor" // Örnek URL
        },
        3: {
            name: "Halime Uçan",
            title: "Finans Uzmanı",
            image: "/media/dkahwv4a/halime-wp-pp.png",
            bio: "Ali Kaya, şirketin kurucusu ve vizyonerıdır. 25 yıllık sektör deneyimi ile Türkiye'nin en prestijli projelerinde yer almıştır. Modern mimari anlayışı ve kaliteli yaşam alanları yaratma konusundaki tutkusu ile sektöre yön vermektedir.",
            linkedin: "https://www.linkedin.com/in/halime-u%C3%A7an-92485b267/" // Örnek URL
        },
        4: {
            name: "Semih Aygün",
            title: "Yatırım Uzmanı",
            image: "/media/jhkfyqea/whatsapp-image-2025-02-18-at-113204-1.jpeg",
            bio: "Fatma Özkan, şirketin yaratıcı vizyonunu yönlendirmektedir. Mimarlık ve iç mimarlık alanındaki uzmanlığı ile modern tasarım trendlerini projelerimize yansıtmaktadır. Avrupa'daki çeşitli tasarım firmalarında çalışmış deneyimli bir profesyoneldir.",
            linkedin: "https://www.linkedin.com/in/semih-a-a212891b4/" // Örnek URL
        },
        5: {
            name: "Hasan Uysal",
            title: "Operasyon Koordinatörü",
            image: "/media/j3vlurbd/dscf4348.jpg",
            bio: "Hasan Çelik, şirketin stratejik planlamasından ve pazar analizinden sorumludur. İnşaat sektöründe 18 yıllık deneyimi bulunmaktadır. Pazar trendleri ve rekabet analizi konularında uzmanlaşmış, şirketin büyüme stratejilerini yönetmektedir.",
            linkedin: "https://www.linkedin.com/in/hasanuysall/" // Örnek URL
        },
        6: {
            name: "Hayati Uçan",
            title: "Saha Operasyon Koordinatörü",
            image: "/media/fy1l0o0a/hayati-ucan-wp-pp.png",
            bio: "Emre Şahin, şirketin insan kaynakları politikalarını yönetir ve yetenek gelişimi programlarını koordine eder. 14 yıllık HR deneyimi ile ekip yönetimi, performans değerlendirme ve çalışan gelişimi konularında uzmandır.",
            linkedin: "https://www.linkedin.com/company/bereketlitopraklar/posts/?feedView=all" // Örnek URL
        },
        7: {
            name: "Memet Emin Aktaş",
            title: "Dijital Pazarlama Departman Müdürü",
            image: "/media/xl1nbywg/memet-emin-aktas-1-wp-pp.png",
            bio: "Selin Yıldız, şirketin finansal stratejilerini yönetir ve mali raporlamasını koordine eder. Muhasebe ve finans alanında 16 yıllık deneyime sahiptir. Risk yönetimi ve bütçe planlaması konularında uzmanlaşmıştır.",
            linkedin: "https://www.linkedin.com/company/bereketlitopraklar/posts/?feedView=all" // Örnek URL
        },
        8: {
            name: "Hakan Yant",
            title: "Yatırım Uzmanı",
            image: "/media/v43cfwi5/şşimg_3761.jpg",
            bio: "Selin Yıldız, şirketin finansal stratejilerini yönetir ve mali raporlamasını koordine eder. Muhasebe ve finans alanında 16 yıllık deneyime sahiptir. Risk yönetimi ve bütçe planlaması konularında uzmanlaşmıştır.",
            linkedin: "https://www.linkedin.com/company/bereketlitopraklar/posts/?feedView=all" // Örnek URL
        },
        9: {
            name: "Muhammed Hatay",
            title: "Yazılım Geliştirici",
            image: "/media/nt0n5w3h/mami-wp.png",
            bio: "Selin Yıldız, şirketin finansal stratejilerini yönetir ve mali raporlamasını koordine eder. Muhasebe ve finans alanında 16 yıllık deneyime sahiptir. Risk yönetimi ve bütçe planlaması konularında uzmanlaşmıştır.",
            linkedin: "https://www.linkedin.com/in/muhammed-hatay-0196a5204/" // Örnek URL
        },
        10: {
            name: "Mehmet Arslan",
            title: "Satış Pazarlama Uzmanı",
            image: "/media/ecqohpw3/mehmet-arslan-ekip.jpg",
            bio: "Selin Yıldız, şirketin finansal stratejilerini yönetir ve mali raporlamasını koordine eder. Muhasebe ve finans alanında 16 yıllık deneyime sahiptir. Risk yönetimi ve bütçe planlaması konularında uzmanlaşmıştır.",
            linkedin: "https://www.linkedin.com/in/mehmet-arslan-484754324" // Örnek URL
        }
    };

    // Modal elements
    const modal = document.getElementById('memberModal');
    const modalImage = document.getElementById('modalImage');
    const modalName = document.getElementById('modalName');
    const modalTitle = document.getElementById('modalTitle');
    const modalBio = document.getElementById('modalBio');
    const closeBtn = document.querySelector('.modal-close');
    const linkedinBtn = document.querySelector('.twitter-btn'); // Butonu seçiyoruz

    // Team member click handlers
    const teamMembers = document.querySelectorAll('.team-member');
    
    teamMembers.forEach(member => {
        member.addEventListener('click', function() {
            const memberId = this.dataset.member;
            const memberData = teamData[memberId];
            
            if (memberData) {
                showMemberModal(memberData);
            }
        });
    });

    // Show member modal - YENİ: LinkedIn butonunu dinamik olarak günceller
    function showMemberModal(data) {
        modalImage.src = data.image;
        modalImage.alt = data.name;
        modalName.textContent = data.name;
        modalTitle.textContent = data.title;
        modalBio.textContent = data.bio;
        
        // LinkedIn butonunu güncelle
        if (linkedinBtn) {
            if (data.linkedin && data.linkedin.trim() !== "") {
                const link = document.createElement('a');
                link.href = data.linkedin;
                link.target = "_blank"; // Yeni sekmede aç
                link.rel = "noopener noreferrer";
                link.innerHTML = '<span><i class="fab fa-linkedin-in"></i> Linkedin\'de Takip Et</span>';
                
                // Butonun içini temizleyip yeni linki ekliyoruz
                linkedinBtn.innerHTML = '';
                linkedinBtn.appendChild(link);
                
                linkedinBtn.style.display = 'flex'; // Butonu görünür yap
            } else {
                linkedinBtn.style.display = 'none'; // LinkedIn linki yoksa butonu gizle
            }
        }
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Close modal
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    // Close button click
    closeBtn.addEventListener('click', closeModal);

    // Click outside modal to close
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Escape key to close
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Smooth animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe team members for animation
    teamMembers.forEach((member, index) => {
        member.style.opacity = '0';
        member.style.transform = 'translateY(30px)';
        member.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(member);
    });
});