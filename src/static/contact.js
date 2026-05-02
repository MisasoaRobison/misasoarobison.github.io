async function toggleContactModal() {
    const modal = document.getElementById('contactModal');
    const content = document.getElementById('modalContent');
    
    if (!modal || !content) return;

    // Si on veut ouvrir la modale
    if (modal.classList.contains('opacity-0')) {
        try {
            // Liste des chemins possibles
            const paths = ['src/data/perso.json', '../src/data/perso.json'];
            let response = null;

            // On cherche quel chemin est le bon
            for (const path of paths) {
                const check = await fetch(path);
                if (check.ok) {
                    response = check;
                    break; 
                }
            }

            if (!response) throw new Error("Impossible de trouver le fichier perso.json");

            const data = await response.json();
            const perso = data.personnal[0];

            // Injection des données
            const emailLink = document.getElementById('modalEmail');
            const emailText = document.getElementById('modalEmailText');
            const linkedinLink = document.getElementById('modalLinkedin');
            const githubLink = document.getElementById('modalGithub');

            if (emailLink) emailLink.href = `mailto:${perso.mail}`;
            if (emailText) emailText.textContent = perso.mail;
            if (linkedinLink) linkedinLink.href = perso.linkedin;
            if (githubLink) githubLink.href = perso.github;

            // Affichage (On retire les classes qui cachent)
            modal.classList.remove('opacity-0', 'pointer-events-none');
            content.classList.remove('scale-95', 'opacity-0');
            content.classList.add('scale-100', 'opacity-100');
            document.body.style.overflow = 'hidden';

        } catch (error) {
            console.error("Erreur de chargement des données :", error);
            alert("Erreur : Impossible de charger les informations de contact.");
        }
    } else {
        // Fermeture
        modal.classList.add('opacity-0', 'pointer-events-none');
        content.classList.remove('scale-100', 'opacity-100');
        content.classList.add('scale-95', 'opacity-0');
        document.body.style.overflow = 'auto';
    }
}

// Fermeture au clic sur le fond noir
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('contactModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) toggleContactModal();
        });
    }
});