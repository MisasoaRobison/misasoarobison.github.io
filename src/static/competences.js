document.addEventListener('DOMContentLoaded', () => {
    // Vérifie bien que tes fichiers s'appellent exactement comme ça dans le dossier data
    const urls = [
        '../src/data/competences.json',
        '../src/data/technologies.json'
    ];

    axios.all(urls.map(url => axios.get(url)))
        .then(axios.spread((resCompetences, resTech) => {
            renderExpertise(resCompetences.data);
            renderTechStack(resTech.data);
            
            // On lance l'observation après l'injection du HTML
            initRevealAnimation();
        }))
        .catch(err => {
            console.error("Erreur lors du chargement :", err);
            // Petit message d'erreur visuel si Axios échoue
            const container = document.getElementById('expertise-container');
            if(container) container.innerHTML = `<p class="text-red-500">Erreur : Vérifiez les chemins des fichiers JSON.</p>`;
        });
});

function renderExpertise(data) {
    const container = document.getElementById('expertise-container');
    if (!container) return;

    container.innerHTML = data.map(item => `
        <div class="reveal group p-8 rounded-2xl bg-slate-900 border border-slate-800 
                    flex flex-col items-start cursor-default
                    transition-all duration-500 transform 
                    hover:scale-[1.02] hover:z-50 hover:shadow-2xl hover:border-sky-500/50">
            
            <div class="mb-6">
                <span class="text-[10px] font-black uppercase tracking-widest text-sky-400 bg-sky-400/10 px-2 py-1 rounded">
                    ${item.category}
                </span>
            </div>

            <p class="text-slate-400 text-sm leading-relaxed">
                ${item.description}
            </p>
        </div>
    `).join('');
}

function renderTechStack(data) {
    const summaryContainer = document.getElementById('tech-summary-container');
    const detailsContainer = document.getElementById('tech-details-container');
    if (!summaryContainer || !detailsContainer) return;

    summaryContainer.innerHTML = data.map(cat => `
        <div class="reveal px-5 py-2.5 bg-slate-900/50 border border-slate-800 rounded-full flex items-center gap-3 hover:bg-slate-800 transition-colors cursor-default">
            <span class="text-[10px] font-black uppercase tracking-widest text-slate-400">${cat.category}</span>
            <span class="bg-sky-500 text-gray-950 text-[10px] font-bold px-2 py-0.5 rounded-full">
                ${cat.contents.length}
            </span>
        </div>
    `).join('');

    detailsContainer.innerHTML = data.map(cat => `
        <div class="reveal flex flex-col gap-5">
            <div class="flex items-center gap-2">
                <div class="w-1.5 h-1.5 rounded-full bg-sky-500"></div>
                <h4 class="text-sm font-bold text-white uppercase tracking-wider">${cat.category}</h4>
            </div>
            <div class="flex flex-wrap gap-2">
                ${cat.contents.map(tech => `
                    <span class="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-300 hover:text-sky-400 hover:border-sky-500/30 transition-all">
                        ${tech}
                    </span>
                `).join('')}
            </div>
        </div>
    `).join('');
}

// LA FONCTION QUI MANQUAIT :
function initRevealAnimation() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}