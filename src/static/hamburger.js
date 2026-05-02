document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('nav ul');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            // 1. ANIME LE BOUTON (Ajoute/Enlève la classe 'active' pour le CSS)
            hamburger.classList.toggle('active');

            // 2. AFFICHE/CACHE LE MENU (Tes classes Tailwind existantes)
            navLinks.classList.toggle('hidden');
            navLinks.classList.toggle('flex');
            navLinks.classList.toggle('flex-col');
            navLinks.classList.toggle('absolute');
            navLinks.classList.toggle('top-16');
            navLinks.classList.toggle('left-0');
            navLinks.classList.toggle('w-full');
            navLinks.classList.toggle('bg-gray-900');
            navLinks.classList.toggle('p-6');
            navLinks.classList.toggle('border-b');
            navLinks.classList.toggle('border-gray-800');
            navLinks.classList.toggle('z-50');
        });
    }
});