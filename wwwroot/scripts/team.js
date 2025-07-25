// Team Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Team member data
    const teamData = {
        1: {
            name: "Bilal Aktaş",
            title: "Kurucu & Genel Müdür",
            image: "/media/y3qnyrg5/img_8930.jpg",
            bio: "Uludağ Üniversitesi Mekatronik öğrencisi Furkan, Bosch’taki süreç ve kalite yönetimi deneyimini Bereketli Topraklar’da strateji ve operasyonel mükemmelliğe dönüştürüyor. Disiplinli organizasyon yeteneği, ekip sinerjisini ve iş süreçlerindeki etkililiği artırıyor."
        },
        2: {
            name: "Furkan Hoşgör",
            title: "Genel Yönetici Asistanı",
            image: "/media/abrlq0cs/furkan-ekip-foto.webp",
            bio: "Uludağ Üniversitesi Mekatronik öğrencisi Furkan, Bosch’taki süreç ve kalite yönetimi deneyimini Bereketli Topraklar’da strateji ve operasyonel mükemmelliğe dönüştürüyor. Disiplinli organizasyon yeteneği, ekip sinerjisini ve iş süreçlerindeki etkililiği artırıyor."
        },
        3: {
            name: "Halime Uçan",
            title: "Finans Uzmanı",
            image: "/media/dkahwv4a/halime-wp-pp.png",
            bio: "Ali Kaya, şirketin kurucusu ve vizyonerıdır. 25 yıllık sektör deneyimi ile Türkiye'nin en prestijli projelerinde yer almıştır. Modern mimari anlayışı ve kaliteli yaşam alanları yaratma konusundaki tutkusu ile sektöre yön vermektedir."
        },
        4: {
            name: "Semih Aygün",
            title: "Yatırım Uzmanı",
            image: "/media/jhkfyqea/whatsapp-image-2025-02-18-at-113204-1.jpeg",
            bio: "Fatma Özkan, şirketin yaratıcı vizyonunu yönlendirmektedir. Mimarlık ve iç mimarlık alanındaki uzmanlığı ile modern tasarım trendlerini projelerimize yansıtmaktadır. Avrupa'daki çeşitli tasarım firmalarında çalışmış deneyimli bir profesyoneldir."
        },
        5: {
            name: "Hasan Uysal",
            title: "Operasyon Koordinatörü",
            image: "/media/j3vlurbd/dscf4348.jpg",
            bio: "Hasan Çelik, şirketin stratejik planlamasından ve pazar analizinden sorumludur. İnşaat sektöründe 18 yıllık deneyimi bulunmaktadır. Pazar trendleri ve rekabet analizi konularında uzmanlaşmış, şirketin büyüme stratejilerini yönetmektedir."
        },
        6: {
            name: "Bahar Bil",
            title: "Satış Pazarlama Uzmanı",
            image: "/media/ofdd52hr/whatsapp-image-2025-01-08-at-134658.jpeg",
            bio: "Zeynep Arslan, marka iletişimi ve pazarlama stratejilerinden sorumludur. Dijital pazarlama ve marka yönetimi alanında 12 yıllık deneyime sahiptir. Müşteri deneyimi ve satış süreçlerini optimize ederek şirketin pazar payını artırmaktadır."
        },
        7: {
            name: "Hayati Uçan",
            title: "Saha Operasyon Koordinatörü",
            image: "/media/fy1l0o0a/hayati-ucan-wp-pp.png",
            bio: "Emre Şahin, şirketin insan kaynakları politikalarını yönetir ve yetenek gelişimi programlarını koordine eder. 14 yıllık HR deneyimi ile ekip yönetimi, performans değerlendirme ve çalışan gelişimi konularında uzmandır."
        },
        8: {
            name: "Memet Emin Aktaş",
            title: "Dijital Pazarlama Departman Müdürü",
            image: "/media/xl1nbywg/memet-emin-aktas-1-wp-pp.png",
            bio: "Selin Yıldız, şirketin finansal stratejilerini yönetir ve mali raporlamasını koordine eder. Muhasebe ve finans alanında 16 yıllık deneyime sahiptir. Risk yönetimi ve bütçe planlaması konularında uzmanlaşmıştır."
        },
        9: {
            name: "Hakan Yant",
            title: "Yatırım Uzmanı",
            image: "/media/v43cfwi5/şşimg_3761.jpg",
            bio: "Selin Yıldız, şirketin finansal stratejilerini yönetir ve mali raporlamasını koordine eder. Muhasebe ve finans alanında 16 yıllık deneyime sahiptir. Risk yönetimi ve bütçe planlaması konularında uzmanlaşmıştır."
        },
        10: {
            name: "Muhammed Hatay",
            title: "Yazılım Geliştirici",
            image: "/media/nt0n5w3h/mami-wp.png",
            bio: "Selin Yıldız, şirketin finansal stratejilerini yönetir ve mali raporlamasını koordine eder. Muhasebe ve finans alanında 16 yıllık deneyime sahiptir. Risk yönetimi ve bütçe planlaması konularında uzmanlaşmıştır."
        },
        11: {
            name: "Mehmet Arslan",
            title: "Satış Pazarlama Uzmanı",
            image: "/media/ecqohpw3/mehmet-arslan-ekip.jpg",
            bio: "Selin Yıldız, şirketin finansal stratejilerini yönetir ve mali raporlamasını koordine eder. Muhasebe ve finans alanında 16 yıllık deneyime sahiptir. Risk yönetimi ve bütçe planlaması konularında uzmanlaşmıştır."
        }
    };

    // Modal elements
    const modal = document.getElementById('memberModal');
    const modalImage = document.getElementById('modalImage');
    const modalName = document.getElementById('modalName');
    const modalTitle = document.getElementById('modalTitle');
    const modalBio = document.getElementById('modalBio');
    const closeBtn = document.querySelector('.modal-close');

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

    // Show member modal
    function showMemberModal(data) {
        modalImage.src = data.image;
        modalImage.alt = data.name;
        modalName.textContent = data.name;
        modalTitle.textContent = data.title;
        modalBio.textContent = data.bio;
        
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

    // Twitter button functionality
    const twitterBtn = document.querySelector('.twitter-btn');
    if (twitterBtn) {
        twitterBtn.addEventListener('click', function() {
            // Twitter follow functionality can be added here
            alert('Linkedin sayfamızı ziyaret edin!');
        });
    }

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