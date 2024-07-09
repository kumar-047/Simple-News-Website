(function() {
    const themeSwitch = document.getElementById('themeSwitch');
    const body = document.body;
    // Menu
    const menuIcon = document.querySelector('.menu-icon');
    const navLinks = document.querySelector('.nav-links');

    menuIcon.addEventListener('click', function() {
        navLinks.classList.toggle('active');
    });

    // Main-Title
    const navItems = document.querySelectorAll('.nav-item');
    const heading = document.getElementById('heading');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove 'active' class from all items
            navItems.forEach(nav => nav.classList.remove('active'));
            // Add 'active' class to clicked item
            this.classList.add('active');
            // Update heading text
            heading.textContent = this.textContent;
        });
    });

    // Check if a theme preference is stored
    const currentTheme = localStorage.getItem('theme') || 'light';
    setTheme(currentTheme);

    themeSwitch.addEventListener('click', toggleTheme);

    function toggleTheme() {
        const newTheme = body.classList.contains('dark-theme') ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    }

    function setTheme(theme) {
        if (theme === 'dark') {
            body.classList.add('dark-theme');
            body.style.backgroundColor = '#333';
            body.style.color = '#fff';
            themeSwitch.textContent ='☀️';
        } else {
            body.classList.remove('dark-theme');
            body.style.backgroundColor = '#fff';
            body.style.color = '#333';
            themeSwitch.textContent = '🌙';
        }
    }
})();