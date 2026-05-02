axios.get('../src/data/projects.json')
    .then(response => {
        const projects = response.data;
        const container = document.getElementById('projects-container');
        
        if (!container) return;

        projects.sort((a, b) => b.id - a.id).forEach(project => {
            const card = document.createElement('div');
            // Ajout de h-fit pour permettre l'extension verticale au survol
            card.className = "reveal group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden transition-all duration-500 flex flex-col hover:scale-[1.02] hover:z-50 hover:shadow-2xl hover:border-blue-500 h-fit";
            
            const urlLink = Array.isArray(project.url) ? project.url[0] : project.url;
            const images = Array.isArray(project.image) ? project.image : [project.image];

            card.innerHTML = `
                <div class="relative h-48 w-full overflow-hidden bg-white/5 flex items-center justify-center">
                    ${images.map((img, index) => `
                        <img src="${img}" 
                            class="js-slide absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${index === 0 ? 'opacity-100' : 'opacity-0'}" 
                            alt="${project.title}">
                    `).join('')}
                    <div class="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
                </div>

                <div class="p-6 flex flex-col flex-grow">
                    <div class="flex justify-between items-center mb-3">
                        <span class="text-[10px] font-black uppercase tracking-widest text-blue-400 bg-blue-400/10 px-2 py-1 rounded">${project.category}</span>
                        <span class="text-[10px] text-slate-500 font-bold">${project.status === 'completed' ? 'TERMINE' : 'EN COURS'}</span>
                    </div>
                    
                    <h3 class="text-xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">${project.title}</h3>
                    <p class="text-xs text-slate-400 mb-4 italic">${project.organization}</p>
                    
                    <p class="text-slate-300 text-sm leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all duration-500 text-justify">
                        ${project.description}
                    </p>

                    <div class="flex flex-wrap gap-2 my-6">
                        ${project.technologies.map(tech => `
                            <span class="px-2 py-1 text-[10px] bg-slate-800 text-slate-300 rounded-md border border-slate-700">
                                ${tech}
                            </span>
                        `).join('')}
                    </div>

                    <div class="flex gap-3 mt-auto">
                        ${urlLink ? `<a href="${urlLink}" target="_blank" class="flex-1 text-center bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2.5 rounded-lg transition-all shadow-lg shadow-blue-900/20">Explorer</a>` : ''}
                        ${project.demo ? `<a href="${project.demo}" target="_blank" class="flex-1 text-center border border-slate-700 hover:bg-slate-800 text-white text-xs font-bold py-2.5 rounded-lg transition-all">Démo</a>` : ''}
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
        observeElements();
        initDiapo();
    })
    .catch(err => {
        console.error("Erreur : ", err);
        document.getElementById('projects-container').innerHTML = `<p class="text-red-500">Impossible de charger les projets.</p>`;
    });

function initDiapo() {
    const allCards = document.querySelectorAll('.group');
    allCards.forEach(card => {
        const slides = card.querySelectorAll('.js-slide');
        if (slides.length < 2) return;
        let currentIndex = 0;
        setInterval(() => {
            slides[currentIndex].classList.replace('opacity-100', 'opacity-0');
            currentIndex = (currentIndex + 1) % slides.length;
            slides[currentIndex].classList.replace('opacity-0', 'opacity-100');
        }, 4000);
    });
}

function observeElements() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optionnel : on arrête d'observer une fois l'animation jouée
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1 // Déclenche l'animation quand 10% de la carte est visible
    });

    // On cible toutes les cartes avec la classe reveal
    document.querySelectorAll('.reveal').forEach(card => {
        observer.observe(card);
    });
}