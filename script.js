document.addEventListener('DOMContentLoaded', function () {
    // Inisialisasi carousel
    initCarousel();

    // Smooth scrolling untuk navigasi
    setupSmoothScrolling();

    // Aktifkan animasi scroll
    setupScrollAnimations();

    initThemeToggle();

    initAchievementsCarousel();
    setupPdfModal();
});

/**
 * Inisialisasi carousel untuk bagian sertifikat
 */
/**
 * Inisialisasi carousel untuk bagian sertifikat
 */
function initCarousel() {
    const carousel = document.querySelector('#certificates .carousel');
    const carouselItems = document.querySelectorAll('#certificates .carousel-item');
    const prevBtn = document.querySelector('#certificates .prev-btn');
    const nextBtn = document.querySelector('#certificates .next-btn');
    const dotsContainer = document.querySelector('#certificates .carousel-dots');

    if (!carousel) return;

    let currentIndex = 0;
    const itemCount = carouselItems.length;

    // Buat dots untuk navigasi carousel
    for (let i = 0; i < itemCount; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.setAttribute('data-index', i);
        dot.addEventListener('click', () => {
            goToSlide(i);
        });
        dotsContainer.appendChild(dot);
    }

    // Event listener untuk tombol prev dan next
    prevBtn.addEventListener('click', () => {
        goToSlide(currentIndex - 1);
    });

    nextBtn.addEventListener('click', () => {
        goToSlide(currentIndex + 1);
    });

    // Fungsi untuk pindah ke slide tertentu
    function goToSlide(index) {
        // Handling loop
        if (index < 0) {
            index = itemCount - 1;
        } else if (index >= itemCount) {
            index = 0;
        }

        currentIndex = index;
        updateCarousel();
    }

    // Update posisi carousel dan status dots
    function updateCarousel() {
        // Update posisi carousel
        carousel.style.transform = `translateX(-${currentIndex * 100}%)`;

        // Update status dots
        const dots = document.querySelectorAll('#certificates .dot');
        dots.forEach((dot, index) => {
            if (index === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    // Auto slide setiap 5 detik
    let autoSlideInterval = setInterval(() => {
        goToSlide(currentIndex + 1);
    }, 5000);

    // Hentikan auto slide ketika user berinteraksi dengan carousel
    const carouselContainer = document.querySelector('#certificates .carousel-container');
    carouselContainer.addEventListener('mouseenter', () => {
        clearInterval(autoSlideInterval);
    });

    carouselContainer.addEventListener('mouseleave', () => {
        autoSlideInterval = setInterval(() => {
            goToSlide(currentIndex + 1);
        }, 5000);
    });

    // Inisialisasi swipe gesture untuk mobile
    let touchStartX = 0;
    let touchEndX = 0;

    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    });

    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].clientX;
        handleSwipe();
    });

    function handleSwipe() {
        const minSwipeDistance = 50;
        const swipeDistance = touchEndX - touchStartX;

        if (swipeDistance > minSwipeDistance) {
            // Swipe kanan, pergi ke slide sebelumnya
            goToSlide(currentIndex - 1);
        } else if (swipeDistance < -minSwipeDistance) {
            // Swipe kiri, pergi ke slide berikutnya
            goToSlide(currentIndex + 1);
        }
    }
}

/**
 * Setup smooth scrolling untuk link navigasi
 */
function setupSmoothScrolling() {
    const navLinks = document.querySelectorAll('nav a');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            window.scrollTo({
                top: targetSection.offsetTop - 80, // Offset untuk header
                behavior: 'smooth'
            });
        });
    });
}

/**
 * Setup animasi scroll untuk elemen-elemen
 */
function setupScrollAnimations() {
    // Tentukan elemen-elemen yang akan dianimasikan
    const animatedElements = [
        ...document.querySelectorAll('.bio-content, .project-item, .certificate')
    ];

    // Fungsi untuk mengecek apakah elemen terlihat dalam viewport
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
            rect.bottom >= 0
        );
    }

    // Fungsi untuk menambahkan class 'animate' ke elemen yang terlihat
    function checkVisibility() {
        animatedElements.forEach(element => {
            if (isElementInViewport(element) && !element.classList.contains('animate')) {
                element.classList.add('animate');
            }
        });
    }

    // Tambahkan class 'animated' ke semua elemen yang akan dianimasikan
    animatedElements.forEach(element => {
        element.classList.add('animated');
    });

    // Jalankan checkVisibility saat scroll dan saat load
    window.addEventListener('scroll', checkVisibility);
    window.addEventListener('resize', checkVisibility);

    // Initial check
    checkVisibility();
}

// Tambahkan efek parallax pada header
window.addEventListener('scroll', function () {
    const scrollPosition = window.scrollY;
    const header = document.querySelector('header');

    // Jika scroll lebih dari 100px, tambahkan class 'scrolled' ke header
    if (scrollPosition > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    // Highlight menu aktif berdasarkan posisi scroll
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('nav ul li a');

    sections.forEach((section, i) => {
        const sectionTop = section.offsetTop - 100;
        const sectionBottom = sectionTop + section.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            navItems.forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('href').substring(1) === section.id) {
                    item.classList.add('active');
                }
            });
        }
    });
});

function initThemeToggle() {
    const checkbox = document.getElementById("checkbox");

    // Periksa preferensi tema
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "light") {
        document.body.classList.remove("dark");
        checkbox.checked = true; // light mode → tombol di kanan
    } else {
        document.body.classList.add("dark");
        checkbox.checked = false; // dark mode → tombol di kiri
    }

    checkbox.addEventListener("change", function () {
        if (this.checked) {
            // Posisi kanan = light mode
            document.body.classList.remove("dark");
            localStorage.setItem("theme", "light");
        } else {
            // Posisi kiri = dark mode
            document.body.classList.add("dark");
            localStorage.setItem("theme", "dark");
        }
    });
}

// Fungsi baru untuk achievements carousel
function initAchievementsCarousel() {
    const carousel = document.querySelector('#achievements .carousel');
    const carouselItems = document.querySelectorAll('#achievements .carousel-item');
    const prevBtn = document.querySelector('#achievements .prev-btn');
    const nextBtn = document.querySelector('#achievements .next-btn');
    const dotsContainer = document.querySelector('#achievements .carousel-dots');

    if (!carousel) return;

    let currentIndex = 0;
    const itemCount = carouselItems.length;

    // Buat dots untuk navigasi carousel
    for (let i = 0; i < itemCount; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.setAttribute('data-index', i);
        dot.addEventListener('click', () => {
            goToSlide(i);
        });
        dotsContainer.appendChild(dot);
    }

    // Event listener untuk tombol prev dan next
    prevBtn.addEventListener('click', () => {
        goToSlide(currentIndex - 1);
    });

    nextBtn.addEventListener('click', () => {
        goToSlide(currentIndex + 1);
    });

    // Fungsi untuk pindah ke slide tertentu
    function goToSlide(index) {
        // Handling loop
        if (index < 0) {
            index = itemCount - 1;
        } else if (index >= itemCount) {
            index = 0;
        }

        currentIndex = index;
        updateCarousel();
    }

    // Update posisi carousel dan status dots
    function updateCarousel() {
        // Update posisi carousel
        carousel.style.transform = `translateX(-${currentIndex * 100}%)`;

        // Update status dots
        const dots = document.querySelectorAll('#achievements .dot');
        dots.forEach((dot, index) => {
            if (index === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    // Auto slide setiap 5 detik
    let autoSlideInterval = setInterval(() => {
        goToSlide(currentIndex + 1);
    }, 5000);

    // Hentikan auto slide ketika user berinteraksi dengan carousel
    const carouselContainer = document.querySelector('#achievements .carousel-container');
    carouselContainer.addEventListener('mouseenter', () => {
        clearInterval(autoSlideInterval);
    });

    carouselContainer.addEventListener('mouseleave', () => {
        autoSlideInterval = setInterval(() => {
            goToSlide(currentIndex + 1);
        }, 5000);
    });
}

// Fungsi untuk modal PDF
function setupPdfModal() {
    const modal = document.getElementById('pdfModal');
    const closeBtn = document.querySelector('.close-btn');
    const achievementItems = document.querySelectorAll('.achievement-item');

    achievementItems.forEach(item => {
        item.addEventListener('click', () => {
            const pdfPath = item.getAttribute('data-pdf');
            const pdfViewer = document.getElementById('pdfViewer');
            pdfViewer.src = pdfPath;
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Enable scrolling
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Enable scrolling
        }
    });
}