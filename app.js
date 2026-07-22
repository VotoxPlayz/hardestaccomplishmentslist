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

    // Fill Calculator Fields
    document.getElementById('c-mental').value = activeAchievement.zetaComponents.mental;
    document.getElementById('c-consistency').value = activeAchievement.zetaComponents.consistency;
    document.getElementById('c-learning').value = activeAchievement.zetaComponents.learning;
    document.getElementById('c-pressure').value = activeAchievement.zetaComponents.pressure;
    document.getElementById('c-time').value = activeAchievement.zetaComponents.time;
    document.getElementById('c-mechanical').value = activeAchievement.zetaComponents.mechanical;

    // Reflection
    document.getElementById('view-reflection').innerText = activeAchievement.reflection;
}

// Live Dynamic Recalculation inside detail panel
function recalculateZeta() {
    const m = Number(document.getElementById('c-mental').value) || 0;
    const c = Number(document.getElementById('c-consistency').value) || 0;
    const l = Number(document.getElementById('c-learning').value) || 0;
    const p = Number(document.getElementById('c-pressure').value) || 0;
    const t = Number(document.getElementById('c-time').value) || 0;
    const mech = Number(document.getElementById('c-mechanical').value) || 0;

    const sum = m + c + l + p + t + mech;
    document.getElementById('m-zeta-total').innerText = sum.toLocaleString() + ' ζ';

    if (activeAchievement) {
        activeAchievement.zetaComponents = { mental: m, consistency: c, learning: l, pressure: p, time: t, mechanical: mech };
        renderSidebar(achievements);
    }
}

// Initialize App
window.addEventListener('DOMContentLoaded', loadAchievements);
