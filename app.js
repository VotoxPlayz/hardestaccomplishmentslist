let achievements = [];
let activeAchievement = null;

// Fetch data from local JSON file
async function loadAchievements() {
    try {
        const response = await fetch('./data/achievements.json');
        achievements = await response.json();
        
        // Sort achievements by rank
        achievements.sort((a, b) => a.rank - b.rank);
        
        renderSidebar(achievements);
        
        if (achievements.length > 0) {
            selectAchievement(achievements[0].id);
        }
    } catch (err) {
        console.error("Failed loading achievements data:", err);
    }
}

// Render Left Sidebar List
function renderSidebar(data) {
    const listContainer = document.getElementById('sidebar-list');
    listContainer.innerHTML = '';

    data.forEach(item => {
        const totalZeta = Object.values(item.zetaComponents).reduce((a, b) => a + Number(b), 0);
        
        const div = document.createElement('div');
        div.className = `list-item ${activeAchievement?.id === item.id ? 'active' : ''}`;
        div.onclick = () => selectAchievement(item.id);
        
        div.innerHTML = `
            <div class="rank-num">#${item.rank}</div>
            <div class="item-info">
                <h4>${item.title}</h4>
                <p class="mono"><span class="accent">${totalZeta.toLocaleString()} ζ</span> | List% ${item.listPercent}%</p>
            </div>
        `;
        listContainer.appendChild(div);
    });
}

// Select & Populate Detail View
function selectAchievement(id) {
    activeAchievement = achievements.find(a => a.id === id);
    if (!activeAchievement) return;

    // Refresh Active State in Sidebar
    renderSidebar(achievements);

    // Populate Main Section Text
    document.getElementById('view-title').innerText = `#${activeAchievement.rank} ${activeAchievement.title}`;
    document.getElementById('view-subtitle').innerText = `Category: ${activeAchievement.category} • Completed on ${activeAchievement.completionDate}`;

    // Tags
    const tagsContainer = document.getElementById('view-tags');
    tagsContainer.innerHTML = activeAchievement.tags.map(t => `<span class="tag-pill">${t}</span>`).join('');

    // Media
    const imgEl = document.getElementById('view-media-img');
    imgEl.src = activeAchievement.thumbnail;
    imgEl.style.display = 'block';

    // Fill 10 Metric Boxes
    const totalZeta = Object.values(activeAchievement.zetaComponents).reduce((a, b) => a + Number(b), 0);
    document.getElementById('m-zeta-total').innerText = totalZeta.toLocaleString() + ' ζ';
    document.getElementById('m-list-percent').innerText = activeAchievement.listPercent + '%';
    document.getElementById('m-date').innerText = activeAchievement.completionDate;
    document.getElementById('m-time').innerText = activeAchievement.timeTakenHours + 'h';
    document.getElementById('m-attempts').innerText = activeAchievement.attempts.toLocaleString();
    document.getElementById('m-peak-hr').innerText = activeAchievement.peakHeartRate ? activeAchievement.peakHeartRate + ' BPM' : 'N/A';
    document.getElementById('m-avg-hr').innerText = activeAchievement.avgHeartRate ? activeAchievement.avgHeartRate + ' BPM' : 'N/A';
    document.getElementById('m-enjoyment').innerText = activeAchievement.enjoyment + '/10';
    document.getElementById('m-impact').innerText = activeAchievement.personalImpact + '/10';
    document.getElementById('m-worth').innerText = activeAchievement.wasItWorthIt;

    // Fill Non-Editable Zeta Breakdown Values
    document.getElementById('c-mental').innerText = activeAchievement.zetaComponents.mental.toLocaleString() + ' ζ';
    document.getElementById('c-consistency').innerText = activeAchievement.zetaComponents.consistency.toLocaleString() + ' ζ';
    document.getElementById('c-learning').innerText = activeAchievement.zetaComponents.learning.toLocaleString() + ' ζ';
    document.getElementById('c-pressure').innerText = activeAchievement.zetaComponents.pressure.toLocaleString() + ' ζ';
    document.getElementById('c-time').innerText = activeAchievement.zetaComponents.time.toLocaleString() + ' ζ';
    document.getElementById('c-mechanical').innerText = activeAchievement.zetaComponents.mechanical.toLocaleString() + ' ζ';

    // Reflection
    document.getElementById('view-reflection').innerText = activeAchievement.reflection;
}

// Search and Filter Logic
document.getElementById('search-input')?.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    const filtered = achievements.filter(a => a.title.toLowerCase().includes(q) || a.tags.some(t => t.toLowerCase().includes(q)));
    renderSidebar(filtered);
});

document.getElementById('category-filter')?.addEventListener('change', (e) => {
    const cat = e.target.value;
    const filtered = cat === 'ALL' ? achievements : achievements.filter(a => a.category === cat);
    renderSidebar(filtered);
});

// Initialize App
window.addEventListener('DOMContentLoaded', loadAchievements);
