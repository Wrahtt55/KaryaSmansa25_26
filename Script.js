document.addEventListener('DOMContentLoaded', function() {

    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    const themeToggle = document.querySelector('.theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    const body = document.body;
    
    const savedTheme = localStorage.getItem('theme') || 
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    body.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
    
    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            themeIcon.classList.replace('fa-moon', 'fa-sun');
        } else {
            themeIcon.classList.replace('fa-sun', 'fa-moon');
        }
    }
    
    if (document.querySelector('.slider-container')) {
        const slides = document.querySelectorAll('.slide');
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        const dotsContainer = document.querySelector('.slider-dots');
        let currentSlide = 0;
        
        slides.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });
        
        const dots = document.querySelectorAll('.dot');
        
        showSlide(currentSlide);
        
        let slideInterval = setInterval(nextSlide, 5000);
        
        function showSlide(index) {
            slides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));
            
            slides[index].classList.add('active');
            dots[index].classList.add('active');
            currentSlide = index;
            
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 5000);
        }
        
        function nextSlide() {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }
        
        function prevSlide() {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(currentSlide);
        }
        
        function goToSlide(index) {
            showSlide(index);
        }
        
        nextBtn.addEventListener('click', nextSlide);
        prevBtn.addEventListener('click', prevSlide);
    }
    
    if (document.querySelector('.filter-buttons')) {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const infoCards = document.querySelectorAll('.info-card');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                const filterValue = button.getAttribute('data-filter');
                
                infoCards.forEach(card => {
                    const cardCategory = card.getAttribute('data-category');
                    
                    if (filterValue === 'all' || cardCategory === filterValue) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }
    
    if (document.getElementById('gallery-container')) {
        const galleryContainer = document.getElementById('gallery-container');
        const loadMoreBtn = document.getElementById('load-more');
        let currentPage = 1;
        const itemsPerPage = 6;
        
        loadKaryaItems(currentPage);
        
        loadMoreBtn.addEventListener('click', () => {
            currentPage++;
            loadKaryaItems(currentPage);
        });
        
        async function loadKaryaItems(page) {
            try {
                const response = await fetch('karya.json');
                const data = await response.json();
                
                const startIndex = (page - 1) * itemsPerPage;
                const endIndex = startIndex + itemsPerPage;
                const itemsToShow = data.slice(0, endIndex);
                
                renderKaryaItems(itemsToShow);
                
                if (endIndex >= data.length) {
                    loadMoreBtn.style.display = 'none';
                }
            } catch (error) {
                console.error('Error loading karya data:', error);
            }
        }
        
        function renderKaryaItems(items) {
            galleryContainer.innerHTML = '';
            
            items.forEach(item => {
                const karyaItem = document.createElement('div');
                karyaItem.className = 'gallery-item';
                karyaItem.setAttribute('data-category', item.category);
                karyaItem.setAttribute('data-aos', 'zoom-in');
                
                karyaItem.innerHTML = `
                    <img src="${item.image}" alt="${item.title}">
                    <div class="gallery-info">
                        <h3>${item.title}</h3>
                        <p>Oleh: ${item.author}</p>
                        <span class="gallery-category">${item.category}</span>
                    </div>
                `;
                
                karyaItem.addEventListener('click', () => openLightbox(item));
                galleryContainer.appendChild(karyaItem);
            });
            
            initAOS();
            
            if (document.querySelector('.filter-buttons')) {
                const filterButtons = document.querySelectorAll('.filter-btn');
                const galleryItems = document.querySelectorAll('.gallery-item');
                
                filterButtons.forEach(button => {
                    button.addEventListener('click', () => {
                        filterButtons.forEach(btn => btn.classList.remove('active'));
                        button.classList.add('active');
                        
                        const filterValue = button.getAttribute('data-filter');
                        
                        galleryItems.forEach(item => {
                            const itemCategory = item.getAttribute('data-category');
                            
                            if (filterValue === 'all' || itemCategory === filterValue) {
                                item.style.display = 'block';
                            } else {
                                item.style.display = 'none';
                            }
                        });
                    });
                });
            }
        }
    }
    
    function openLightbox(item) {
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        const lightboxTitle = document.getElementById('lightbox-title');
        const lightboxAuthor = document.getElementById('lightbox-author');
        const lightboxCategory = document.getElementById('lightbox-category');
        const lightboxDesc = document.getElementById('lightbox-desc');
        const closeBtn = document.querySelector('.close-btn');
        
        lightboxImg.src = item.image;
        lightboxImg.alt = item.title;
        lightboxTitle.textContent = item.title;
        lightboxAuthor.textContent = `Oleh: ${item.author}`;
        lightboxCategory.textContent = `Kategori: ${item.category}`;
        lightboxDesc.textContent = item.description || 'Tidak ada deskripsi tersedia';
        
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        
        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }
    
    function initAOS() {
        const elements = document.querySelectorAll('[data-aos]');
        
        function checkPosition() {
            elements.forEach(element => {
                const position = element.getBoundingClientRect();
                
                if (position.top < window.innerHeight * 0.8 && position.bottom >= 0) {
                    element.classList.add('aos-animate');
                }
            });
        }
        
        checkPosition();
        
        window.addEventListener('scroll', checkPosition);
    }
    
    initAOS();
});
