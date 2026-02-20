document.addEventListener('DOMContentLoaded', () => {
    console.log('The Smug Saver loaded');

    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.nav-list');

    if (menuToggle && navList) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            navList.style.display = isExpanded ? 'none' : 'flex';

            if (!isExpanded) {
                navList.style.flexDirection = 'column';
                navList.style.position = 'absolute';
                navList.style.top = '100%';
                navList.style.left = '0';
                navList.style.right = '0';
                navList.style.backgroundColor = 'var(--color-bg)';
                navList.style.padding = 'var(--spacing-md)';
                navList.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
            } else {
                navList.style = ''; // Reset inline styles
            }
        });
    }
});
