(function() {
    const themeSwitch = document.getElementById('themeSwitch');
    const body = document.body;
    const menuIcon = document.querySelector('.menu-icon');
    const navLinks = document.querySelector('.nav-links');
    
    // Add transition class for smooth theme changes
    document.documentElement.classList.add('theme-transition');

    // Prevent transition on page load
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            document.documentElement.classList.remove('theme-transition');
        }, 500);
    });

    // Enhanced menu toggle with animation and accessibility
    let isMenuOpen = false;

    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
        navLinks.classList.toggle('active');
        menuIcon.classList.toggle('active');
        menuIcon.setAttribute('aria-expanded', isMenuOpen);
        menuIcon.innerHTML = isMenuOpen ? '✕' : '☰';
        
        // Prevent body scroll when menu is open on mobile
        document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    }

    menuIcon.addEventListener('click', toggleMenu);

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (isMenuOpen && !navLinks.contains(e.target) && !menuIcon.contains(e.target)) {
            toggleMenu();
        }
    });

    // Close menu when pressing escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isMenuOpen) {
            toggleMenu();
        }
    });

    // Close menu when window is resized beyond mobile breakpoint
    window.addEventListener('resize', () => {
        if (window.innerWidth > 678 && isMenuOpen) {
            toggleMenu();
        }
    });

    // Improved navigation handling
    const navItems = document.querySelectorAll('.nav-item');
    const heading = document.getElementById('heading');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            const newTitle = this.textContent.trim();
            heading.textContent = newTitle;
            
            // Close mobile menu after selection
            if (window.innerWidth <= 678) {
                navLinks.classList.remove('active');
                menuIcon.innerHTML = '☰';
            }
        });
    });

    // Enhanced theme handling
    function setTheme(theme) {
        const isDark = theme === 'dark';
        
        body.style.setProperty('--bg-color', isDark ? '#333' : '#fff');
        body.style.setProperty('--text-color', isDark ? '#fff' : '#333');
        body.classList.toggle('dark-theme', isDark);
        
        themeSwitch.textContent = isDark ? '☀️' : '🌙';
        localStorage.setItem('theme', theme);
    }

    function toggleTheme() {
        const newTheme = body.classList.contains('dark-theme') ? 'light' : 'dark';
        setTheme(newTheme);
    }

    // Initialize theme
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme') || (prefersDark ? 'dark' : 'light');
    setTheme(savedTheme);

    themeSwitch.addEventListener('click', toggleTheme);
})();