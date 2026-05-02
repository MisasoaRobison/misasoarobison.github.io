document.addEventListener('DOMContentLoaded', () => {
    // Vérifie bien ces deux chemins dans ton explorateur de fichiers
    const urlGeneral = '../src/data/perso.json';    
    const urlParcours = '../src/data/parcours.json'; 

    axios.all([
        axios.get(urlGeneral),
        axios.get(urlParcours)
    ])
    .then(axios.spread((resGeneral, resParcours) => {
        console.log("Données Générales reçues:", resGeneral.data);
        console.log("Données Parcours reçues:", resParcours.data);

        const dataGeneral = resGeneral.data;
        const dataParcours = resParcours.data;

        // 1. Rendu des infos personnelles
        if (dataGeneral.personnal && dataGeneral.personnal.length > 0) {
            renderInfos(dataGeneral.personnal[0]);
        }

        // 2. Rendu des langues
        if (dataGeneral.languages) {
            renderLanguages(dataGeneral.languages);
        }

        // 3. Rendu du parcours (La frise)
        // Note: On passe dataParcours directement s'il s'agit d'un tableau []
        renderTimeline(dataParcours);

        initReveal();
    }))
    .catch(err => {
        console.error("Erreur critique lors du chargement des JSON:", err);
    });
});

function renderInfos(p) {
    const container = document.getElementById('infos-personnelles');
    if (!container) return;

    // Utilisation de la clé exacte du JSON : "disponibility"
    const isAvailable = p.disponibility === "true" || p.disponibility === true;

    const fields = [
        { label: 'Niveau', val: p.niveau || 'Non défini', icon: '🎓' },
        { label: 'Pays', val: p.Pays || 'France', icon: '📍' },
        { 
            label: 'Disponibilité', 
            val: isAvailable ? 'Disponible' : 'En poste', 
            color: isAvailable ? 'text-emerald-400' : 'text-orange-400',
            icon: '💼' 
        }
    ];

    container.innerHTML = fields.map(f => `
        <div class="flex items-center gap-3 p-3 bg-gray-900/50 border border-gray-800 rounded-xl">
            <span class="text-lg">${f.icon}</span>
            <div class="flex flex-col">
                <span class="text-sky-500 font-bold uppercase text-[9px] tracking-wider">${f.label}</span>
                <span class="text-slate-200 text-sm font-medium ${f.color || ''}">${f.val}</span>
            </div>
        </div>
    `).join('');
}

function renderTimeline(parcours) {
    const container = document.getElementById('parcours-timeline');
    if (!container) return;

    container.innerHTML = parcours.map(item => {
        const isCurrent = item.status === "in progress";
        const dotColor = isCurrent ? "bg-sky-500 animate-pulse shadow-[0_0_10px_rgba(14,165,233,0.5)]" : "bg-slate-700";
        
        return `
        <div class="reveal timeline-item relative grid grid-cols-1 md:grid-cols-[100px_1fr] gap-4 md:gap-10 mb-12">
            
            <div class="hidden md:block text-right pt-1">
                <span class="text-[11px] font-black uppercase tracking-tighter text-slate-500">
                    ${item.period}
                </span>
            </div>

            <div class="relative pl-8 md:pl-0">
                <div class="absolute -left-[21px] md:-left-[29px] top-1.5 h-4 w-4 rounded-full border-4 border-gray-950 ${dotColor} z-10"></div>
                
                <div class="group p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-sky-500/50 transition-all duration-500 shadow-xl">
                    
                    <div class="md:hidden mb-4">
                         <span class="text-[10px] font-bold text-slate-500 bg-slate-800/50 px-2 py-1 rounded">
                            ${item.period}
                        </span>
                    </div>

                    <div class="flex flex-wrap gap-2 mb-4">
                        <span class="text-[10px] font-black uppercase tracking-widest text-sky-400 bg-sky-400/10 px-2 py-1 rounded">
                            ${item.diploma || item.diplome}
                        </span>
                        <span class="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-400/10 px-2 py-1 rounded">
                            ${item.level}
                        </span>
                    </div>

                    <h3 class="text-xl font-bold text-white mb-1 group-hover:text-sky-400 transition-colors">${item.title}</h3>
                    <p class="text-sky-500/90 text-sm font-bold italic mb-1">${item.parcours}</p>
                    <p class="text-slate-500 text-xs mb-4">${item.etablissement} — ${item.pays}</p>
                    <p class="text-slate-400 text-sm leading-relaxed border-t border-slate-800/50 pt-4 text-justify">${item.description}</p>
                </div>
            </div>
        </div>`;
    }).join('');
}

function renderLanguages(languages) {
    const container = document.getElementById('langues-container');
    if (!container) return;

    // Définition des couleurs (Les clés sont maintenant alignées ou gérées par le .toUpperCase())
    const colorMap = {
        'MATERNELLE': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        'BILLINGUE': 'bg-sky-500/20 text-sky-400 border-sky-500/30',
        'C2': 'bg-sky-500/20 text-sky-400 border-sky-500/30',
        'C1': 'bg-sky-500/20 text-sky-400 border-sky-500/30',
        'B2': 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
        'B1-B2': 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
        'B1': 'bg-slate-500/20 text-slate-400 border-slate-500/30',
        'A2': 'bg-orange-500/20 text-orange-400 border-orange-500/30'
    };

    container.innerHTML = languages.map(lang => {
        // 1. On transforme le niveau du JSON en MAJUSCULE pour la comparaison
        const levelUpper = lang.level.toUpperCase();
        
        // 2. On récupère la couleur correspondante
        const colorClass = colorMap[levelUpper] || 'bg-slate-500/20 text-slate-400 border-slate-500/30';

        return `
        <div class="reveal px-5 py-2.5 bg-slate-900/50 border border-slate-800 rounded-full flex items-center justify-between gap-4 hover:bg-slate-800 transition-all duration-300 cursor-default group">
            <span class="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white transition-colors">
                ${lang.title}
            </span>
            
            <span class="text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${colorClass}">
                ${levelUpper}
            </span>
        </div>
        `;
    }).join('');
}

function initReveal() {
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

