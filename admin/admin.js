/* ============================================
   RAVI ESPORTS - Admin Panel JavaScript
   ============================================ */

// ============================================
// GLOBAL STATE
// ============================================
const adminState = {
    teams: [],
    players: [],
    achievements: [],
    gallery: [],
    requests: [],
    settings: null,
    currentSection: 'overview'
};

// ============================================
// AUTHENTICATION
// ============================================
async function checkAuth() {
    const { data: { session } } = await window.supabaseClient.auth.getSession();
    if (!session) {
        window.location.href = './index.html';
        return false;
    }
    return true;
}

async function logout() {
    await window.supabaseClient.auth.signOut();
    window.location.href = './index.html';
}

// ============================================
// TOAST NOTIFICATIONS
// ============================================
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// ============================================
// NAVIGATION
// ============================================
function showSection(sectionId) {
    // Update nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.section === sectionId) {
            item.classList.add('active');
        }
    });
    
    // Update sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(`section-${sectionId}`).classList.add('active');
    
    adminState.currentSection = sectionId;
    
    // Close mobile menu
    document.getElementById('sidebar').classList.remove('active');
}

function setupNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            showSection(item.dataset.section);
        });
    });
    
    // Mobile menu toggle
    document.getElementById('mobile-menu-toggle').addEventListener('click', () => {
        document.getElementById('sidebar').classList.toggle('active');
    });
    
    // Logout
    document.getElementById('logout-btn').addEventListener('click', logout);
}

// ============================================
// MODAL FUNCTIONS
// ============================================
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
    // Reset form if exists
    const modal = document.getElementById(modalId);
    const form = modal.querySelector('form');
    if (form) form.reset();
    
    // Clear previews
    modal.querySelectorAll('.preview').forEach(p => p.innerHTML = '');
}

// ============================================
// IMAGE PREVIEW & UPLOAD
// ============================================
function previewImage(input, previewId) {
    const preview = document.getElementById(previewId);
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
        };
        reader.readAsDataURL(input.files[0]);
    }
}

async function uploadImage(file, folder) {
    try {
        const fileName = `${folder}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
        
        const { data, error } = await window.supabaseClient.storage
            .from('images')
            .upload(fileName, file);
        
        if (error) throw error;
        
        // Get public URL
        const { data: urlData } = window.supabaseClient.storage
            .from('images')
            .getPublicUrl(fileName);
        
        return urlData.publicUrl;
    } catch (error) {
        console.error('Upload error:', error);
        showToast('Error uploading image', 'error');
        return null;
    }
}

// ============================================
// FETCH DATA
// ============================================
async function fetchAllData() {
    await Promise.all([
        fetchTeams(),
        fetchPlayers(),
        fetchAchievements(),
        fetchGallery(),
        fetchRequests(),
        fetchSettings()
    ]);
    updateOverviewStats();
}

async function fetchTeams() {
    try {
        const { data, error } = await window.supabaseClient
            .from('teams')
            .select('*')
            .order('display_order');
        
        if (error) throw error;
        adminState.teams = data || [];
        renderTeamsTable();
    } catch (error) {
        console.error('Error fetching teams:', error);
    }
}

async function fetchPlayers() {
    try {
        const { data, error } = await window.supabaseClient
            .from('players')
            .select('*, teams(name)')
            .order('display_order');
        
        if (error) throw error;
        adminState.players = data || [];
        renderPlayersTable();
    } catch (error) {
        console.error('Error fetching players:', error);
    }
}

async function fetchAchievements() {
    try {
        const { data, error } = await window.supabaseClient
            .from('achievements')
            .select('*')
            .order('year', { ascending: false });
        
        if (error) throw error;
        adminState.achievements = data || [];
        renderAchievementsTable();
    } catch (error) {
        console.error('Error fetching achievements:', error);
    }
}

async function fetchGallery() {
    try {
        const { data, error } = await window.supabaseClient
            .from('gallery')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        adminState.gallery = data || [];
        renderGalleryTable();
    } catch (error) {
        console.error('Error fetching gallery:', error);
    }
}

async function fetchRequests() {
    try {
        const { data, error } = await window.supabaseClient
            .from('join_requests')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        adminState.requests = data || [];
        renderRequestsTable();
        renderRecentRequests();
        updateRequestsBadge();
    } catch (error) {
        console.error('Error fetching requests:', error);
    }
}

async function fetchSettings() {
    try {
        const { data, error } = await window.supabaseClient
            .from('guild_settings')
            .select('*')
            .single();
        
        if (error) throw error;
        adminState.settings = data;
        populateSettingsForm(data);
    } catch (error) {
        console.error('Error fetching settings:', error);
    }
}

// ============================================
// UPDATE OVERVIEW
// ============================================
function updateOverviewStats() {
    document.getElementById('overview-teams').textContent = adminState.teams.length;
    document.getElementById('overview-players').textContent = adminState.players.length;
    document.getElementById('overview-achievements').textContent = adminState.achievements.length;
    
    const pendingRequests = adminState.requests.filter(r => r.status === 'pending').length;
    document.getElementById('overview-requests').textContent = pendingRequests;
}

function updateRequestsBadge() {
    const pending = adminState.requests.filter(r => r.status === 'pending').length;
    const badge = document.getElementById('requests-badge');
    badge.textContent = pending;
    badge.style.display = pending > 0 ? 'inline' : 'none';
}

// ============================================
// RENDER TABLES
// ============================================
function renderTeamsTable() {
    const tbody = document.getElementById('teams-table-body');
    
    if (adminState.teams.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4">
                    <div class="empty-state">
                        <i class="fas fa-users"></i>
                        <h4>No teams yet</h4>
                        <p>Add your first team to get started</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = adminState.teams.map(team => {
        const playerCount = adminState.players.filter(p => p.team_id === team.id).length;
        const date = new Date(team.created_at).toLocaleDateString();
        
        return `
            <tr>
                <td><strong>${team.name}</strong></td>
                <td>${playerCount} players</td>
                <td>${date}</td>
                <td class="actions">
                    <button class="btn btn-secondary btn-sm" onclick="editTeam('${team.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteTeam('${team.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function renderPlayersTable() {
    const tbody = document.getElementById('players-table-body');
    
    if (adminState.players.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6">
                    <div class="empty-state">
                        <i class="fas fa-user-ninja"></i>
                        <h4>No players yet</h4>
                        <p>Add players to your teams</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = adminState.players.map(player => {
        const photoUrl = player.photo_url || 'https://placehold.co/40x40/1a1a1a/ff4500?text=P';
        const teamName = player.teams?.name || 'No Team';
        const roleClass = (player.role || '').toLowerCase();
        
        return `
            <tr>
                <td>
                    <div class="player-info">
                        <img src="${photoUrl}" alt="${player.name}" class="player-avatar" onerror="this.src='https://placehold.co/40x40/1a1a1a/ff4500?text=P'">
                        <span class="player-name">${player.name}</span>
                    </div>
                </td>
                <td>${player.uid || 'N/A'}</td>
                <td>${teamName}</td>
                <td><span class="role-badge ${roleClass}">${player.role || 'N/A'}</span></td>
                <td>${player.kd_ratio || '0.0'}</td>
                <td class="actions">
                    <button class="btn btn-secondary btn-sm" onclick="editPlayer('${player.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deletePlayer('${player.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function renderAchievementsTable() {
    const tbody = document.getElementById('achievements-table-body');
    
    if (adminState.achievements.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5">
                    <div class="empty-state">
                        <i class="fas fa-trophy"></i>
                        <h4>No achievements yet</h4>
                        <p>Add your tournament wins and achievements</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = adminState.achievements.map(a => `
        <tr>
            <td><strong>${a.title}</strong></td>
            <td>${a.position || 'N/A'}</td>
            <td>${a.year || 'N/A'}</td>
            <td>${a.prize || '-'}</td>
            <td class="actions">
                <button class="btn btn-secondary btn-sm" onclick="editAchievement('${a.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-danger btn-sm" onclick="deleteAchievement('${a.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function renderGalleryTable() {
    const tbody = document.getElementById('gallery-table-body');
    
    if (adminState.gallery.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5">
                    <div class="empty-state">
                        <i class="fas fa-images"></i>
                        <h4>Gallery is empty</h4>
                        <p>Add screenshots and video clips</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = adminState.gallery.map(item => {
        const thumbUrl = item.thumbnail_url || item.url || 'https://placehold.co/60x60/1a1a1a/ff4500?text=IMG';
        const date = new Date(item.created_at).toLocaleDateString();
        
        return `
            <tr>
                <td>
                    <img src="${thumbUrl}" alt="${item.title || 'Gallery'}" 
                         style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;"
                         onerror="this.src='https://placehold.co/60x60/1a1a1a/ff4500?text=IMG'">
                </td>
                <td>${item.title || 'Untitled'}</td>
                <td>
                    <span class="status-badge ${item.type === 'video' ? 'pending' : 'accepted'}">
                        ${item.type || 'image'}
                    </span>
                </td>
                <td>${date}</td>
                <td class="actions">
                    <button class="btn btn-danger btn-sm" onclick="deleteGalleryItem('${item.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function renderRequestsTable() {
    const tbody = document.getElementById('requests-table-body');
    
    if (adminState.requests.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7">
                    <div class="empty-state">
                        <i class="fas fa-user-plus"></i>
                        <h4>No join requests</h4>
                        <p>When players apply, they'll appear here</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = adminState.requests.map(r => `
        <tr>
            <td><strong>${r.name}</strong></td>
            <td>${r.uid}</td>
            <td>${r.rank || 'N/A'}</td>
            <td>${r.role || 'N/A'}</td>
            <td>${r.kd_ratio || 'N/A'}</td>
            <td><span class="status-badge ${r.status}">${r.status}</span></td>
            <td class="actions">
                <button class="btn btn-secondary btn-sm" onclick="viewRequest('${r.id}')">
                    <i class="fas fa-eye"></i>
                </button>
                ${r.status === 'pending' ? `
                    <button class="btn btn-success btn-sm" onclick="updateRequestStatus('${r.id}', 'accepted')">
                        <i class="fas fa-check"></i>
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="updateRequestStatus('${r.id}', 'rejected')">
                        <i class="fas fa-times"></i>
                    </button>
                ` : ''}
            </td>
        </tr>
    `).join('');
}

function renderRecentRequests() {
    const tbody = document.getElementById('recent-requests-body');
    const recent = adminState.requests.slice(0, 5);
    
    if (recent.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; color: var(--text-muted); padding: 30px;">
                    No requests yet
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = recent.map(r => {
        const date = new Date(r.created_at).toLocaleDateString();
        return `
            <tr>
                <td>${r.name}</td>
                <td>${r.uid}</td>
                <td>${r.role || 'N/A'}</td>
                <td><span class="status-badge ${r.status}">${r.status}</span></td>
                <td>${date}</td>
            </tr>
        `;
    }).join('');
}

// ============================================
// TEAMS CRUD
// ============================================
function openPlayerModal() {
    // Populate teams dropdown
    const teamSelect = document.getElementById('player-team');
    teamSelect.innerHTML = '<option value="">Select Team</option>' + 
        adminState.teams.map(t => `<option value="${t.id}">${t.name}</option>`).join('');
    
    openModal('player-modal');
}

async function saveTeam() {
    const id = document.getElementById('team-id').value;
    const name = document.getElementById('team-name').value;
    const order = document.getElementById('team-order').value;
    
    if (!name) {
        showToast('Team name is required', 'error');
        return;
    }
    
    try {
        if (id) {
            // Update
            const { error } = await window.supabaseClient
                .from('teams')
                .update({ name, display_order: parseInt(order) || 1 })
                .eq('id', id);
            
            if (error) throw error;
            showToast('Team updated successfully');
        } else {
            // Create
            const { error } = await window.supabaseClient
                .from('teams')
                .insert([{ name, display_order: parseInt(order) || 1 }]);
            
            if (error) throw error;
            showToast('Team created successfully');
        }
        
        closeModal('team-modal');
        await fetchTeams();
        updateOverviewStats();
    } catch (error) {
        console.error('Error saving team:', error);
        showToast('Error saving team', 'error');
    }
}

function editTeam(id) {
    const team = adminState.teams.find(t => t.id === id);
    if (!team) return;
    
    document.getElementById('team-id').value = team.id;
    document.getElementById('team-name').value = team.name;
    document.getElementById('team-order').value = team.display_order || 1;
    document.getElementById('team-modal-title').textContent = 'Edit Team';
    
    openModal('team-modal');
}

async function deleteTeam(id) {
    if (!confirm('Are you sure? This will also delete all players in this team.')) return;
    
    try {
        const { error } = await window.supabaseClient
            .from('teams')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
        
        showToast('Team deleted successfully');
        await fetchTeams();
        await fetchPlayers();
        updateOverviewStats();
    } catch (error) {
        console.error('Error deleting team:', error);
        showToast('Error deleting team', 'error');
    }
}

// ============================================
// PLAYERS CRUD
// ============================================
async function savePlayer() {
    const id = document.getElementById('player-id').value;
    const photoFile = document.getElementById('player-photo').files[0];
    
    let photoUrl = null;
    if (photoFile) {
        photoUrl = await uploadImage(photoFile, 'players');
    }
    
    const playerData = {
        name: document.getElementById('player-name').value,
        uid: document.getElementById('player-uid').value,
        team_id: document.getElementById('player-team').value,
        role: document.getElementById('player-role').value,
        kd_ratio: parseFloat(document.getElementById('player-kd').value) || null,
        total_kills: parseInt(document.getElementById('player-kills').value) || 0,
        current_rank: document.getElementById('player-rank').value,
        instagram_url: document.getElementById('player-instagram').value
    };
    
    if (photoUrl) {
        playerData.photo_url = photoUrl;
    }
    
    if (!playerData.name || !playerData.team_id || !playerData.role) {
        showToast('Name, Team, and Role are required', 'error');
        return;
    }
    
    try {
        if (id) {
            const { error } = await window.supabaseClient
                .from('players')
                .update(playerData)
                .eq('id', id);
            
            if (error) throw error;
            showToast('Player updated successfully');
        } else {
            const { error } = await window.supabaseClient
                .from('players')
                .insert([playerData]);
            
            if (error) throw error;
            showToast('Player added successfully');
        }
        
        closeModal('player-modal');
        await fetchPlayers();
        updateOverviewStats();
    } catch (error) {
        console.error('Error saving player:', error);
        showToast('Error saving player', 'error');
    }
}

function editPlayer(id) {
    const player = adminState.players.find(p => p.id === id);
    if (!player) return;
    
    // Populate teams dropdown first
    const teamSelect = document.getElementById('player-team');
    teamSelect.innerHTML = '<option value="">Select Team</option>' + 
        adminState.teams.map(t => `<option value="${t.id}">${t.name}</option>`).join('');
    
    document.getElementById('player-id').value = player.id;
    document.getElementById('player-name').value = player.name || '';
    document.getElementById('player-uid').value = player.uid || '';
    document.getElementById('player-team').value = player.team_id || '';
    document.getElementById('player-role').value = player.role || '';
    document.getElementById('player-kd').value = player.kd_ratio || '';
    document.getElementById('player-kills').value = player.total_kills || '';
    document.getElementById('player-rank').value = player.current_rank || '';
    document.getElementById('player-instagram').value = player.instagram_url || '';
    
    if (player.photo_url) {
        document.getElementById('player-photo-preview').innerHTML = 
            `<img src="${player.photo_url}" alt="Preview">`;
    }
    
    document.getElementById('player-modal-title').textContent = 'Edit Player';
    openModal('player-modal');
}

async function deletePlayer(id) {
    if (!confirm('Are you sure you want to delete this player?')) return;
    
    try {
        const { error } = await window.supabaseClient
            .from('players')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
        
        showToast('Player deleted successfully');
        await fetchPlayers();
        updateOverviewStats();
    } catch (error) {
        console.error('Error deleting player:', error);
        showToast('Error deleting player', 'error');
    }
}

// ============================================
// ACHIEVEMENTS CRUD
// ============================================
async function saveAchievement() {
    const id = document.getElementById('achievement-id').value;
    
    const data = {
        title: document.getElementById('achievement-title').value,
        position: document.getElementById('achievement-position').value,
        year: parseInt(document.getElementById('achievement-year').value) || null,
        prize: document.getElementById('achievement-prize').value
    };
    
    if (!data.title || !data.position) {
        showToast('Title and Position are required', 'error');
        return;
    }
    
    try {
        if (id) {
            const { error } = await window.supabaseClient
                .from('achievements')
                .update(data)
                .eq('id', id);
            
            if (error) throw error;
            showToast('Achievement updated successfully');
        } else {
            const { error } = await window.supabaseClient
                .from('achievements')
                .insert([data]);
            
            if (error) throw error;
            showToast('Achievement added successfully');
        }
        
        closeModal('achievement-modal');
        await fetchAchievements();
        updateOverviewStats();
    } catch (error) {
        console.error('Error saving achievement:', error);
        showToast('Error saving achievement', 'error');
    }
}

function editAchievement(id) {
    const achievement = adminState.achievements.find(a => a.id === id);
    if (!achievement) return;
    
    document.getElementById('achievement-id').value = achievement.id;
    document.getElementById('achievement-title').value = achievement.title || '';
    document.getElementById('achievement-position').value = achievement.position || '';
    document.getElementById('achievement-year').value = achievement.year || '';
    document.getElementById('achievement-prize').value = achievement.prize || '';
    document.getElementById('achievement-modal-title').textContent = 'Edit Achievement';
    
    openModal('achievement-modal');
}

async function deleteAchievement(id) {
    if (!confirm('Are you sure you want to delete this achievement?')) return;
    
    try {
        const { error } = await window.supabaseClient
            .from('achievements')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
        
        showToast('Achievement deleted successfully');
        await fetchAchievements();
        updateOverviewStats();
    } catch (error) {
        console.error('Error deleting achievement:', error);
        showToast('Error deleting achievement', 'error');
    }
}

// ============================================
// GALLERY CRUD
// ============================================
function toggleGalleryUpload() {
    const type = document.getElementById('gallery-type').value;
    document.getElementById('gallery-file-group').style.display = type === 'image' ? 'block' : 'none';
    document.getElementById('gallery-url-group').style.display = type === 'video' ? 'block' : 'none';
    document.getElementById('gallery-thumb-group').style.display = type === 'video' ? 'block' : 'none';
}

async function saveGalleryItem() {
    const type = document.getElementById('gallery-type').value;
    const title = document.getElementById('gallery-title').value;
    
    let url = '';
    let thumbnailUrl = '';
    
    if (type === 'image') {
        const file = document.getElementById('gallery-file').files[0];
        if (!file) {
            showToast('Please select an image', 'error');
            return;
        }
        url = await uploadImage(file, 'gallery');
        if (!url) return;
    } else {
        url = document.getElementById('gallery-url').value;
        thumbnailUrl = document.getElementById('gallery-thumbnail').value;
        if (!url) {
            showToast('Please enter video URL', 'error');
            return;
        }
    }
    
    try {
        const { error } = await window.supabaseClient
            .from('gallery')
            .insert([{
                title,
                type,
                url,
                thumbnail_url: thumbnailUrl || null
            }]);
        
        if (error) throw error;
        
        showToast('Added to gallery successfully');
        closeModal('gallery-modal');
        await fetchGallery();
    } catch (error) {
        console.error('Error adding to gallery:', error);
        showToast('Error adding to gallery', 'error');
    }
}

async function deleteGalleryItem(id) {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    try {
        const { error } = await window.supabaseClient
            .from('gallery')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
        
        showToast('Deleted successfully');
        await fetchGallery();
    } catch (error) {
        console.error('Error deleting gallery item:', error);
        showToast('Error deleting item', 'error');
    }
}

// ============================================
// JOIN REQUESTS
// ============================================
function viewRequest(id) {
    const request = adminState.requests.find(r => r.id === id);
    if (!request) return;
    
    const date = new Date(request.created_at).toLocaleString();
    
    document.getElementById('request-details').innerHTML = `
        <div style="display: grid; gap: 15px;">
            <div><strong>Name:</strong> ${request.name}</div>
            <div><strong>UID:</strong> ${request.uid}</div>
            <div><strong>Rank:</strong> ${request.rank || 'N/A'}</div>
            <div><strong>Role:</strong> ${request.role || 'N/A'}</div>
            <div><strong>K/D Ratio:</strong> ${request.kd_ratio || 'N/A'}</div>
            <div><strong>Discord:</strong> ${request.discord_id || 'N/A'}</div>
            <div><strong>Reason:</strong><br>${request.reason || 'No reason provided'}</div>
            <div><strong>Applied:</strong> ${date}</div>
            <div><strong>Status:</strong> <span class="status-badge ${request.status}">${request.status}</span></div>
        </div>
    `;
    
    document.getElementById('request-actions').innerHTML = request.status === 'pending' ? `
        <button class="btn btn-danger" onclick="updateRequestStatus('${request.id}', 'rejected'); closeModal('request-modal');">
            <i class="fas fa-times"></i> Reject
        </button>
        <button class="btn btn-success" onclick="updateRequestStatus('${request.id}', 'accepted'); closeModal('request-modal');">
            <i class="fas fa-check"></i> Accept
        </button>
    ` : `
        <button class="btn btn-secondary" onclick="closeModal('request-modal')">Close</button>
    `;
    
    openModal('request-modal');
}

async function updateRequestStatus(id, status) {
    try {
        const { error } = await window.supabaseClient
            .from('join_requests')
            .update({ 
                status, 
                reviewed_at: new Date().toISOString() 
            })
            .eq('id', id);
        
        if (error) throw error;
        
        showToast(`Request ${status} successfully`);
        await fetchRequests();
        updateOverviewStats();
    } catch (error) {
        console.error('Error updating request:', error);
        showToast('Error updating request', 'error');
    }
}

// ============================================
// SETTINGS
// ============================================
function populateSettingsForm(settings) {
    if (!settings) return;
    
    document.getElementById('guild-name').value = settings.guild_name || '';
    document.getElementById('guild-tagline').value = settings.tagline || '';
    document.getElementById('guild-about').value = settings.about_text || '';
    document.getElementById('total-kills').value = settings.total_kills || 0;
    document.getElementById('total-wins').value = settings.total_wins || 0;
    document.getElementById('total-members').value = settings.total_members || 0;
    document.getElementById('total-trophies').value = settings.total_trophies || 0;
    document.getElementById('discord-link').value = settings.discord_link || '';
    document.getElementById('youtube-link').value = settings.youtube_link || '';
    document.getElementById('instagram-link').value = settings.instagram_link || '';
    document.getElementById('facebook-link').value = settings.facebook_link || '';
    document.getElementById('whatsapp-link').value = settings.whatsapp_link || '';
    
    if (settings.logo_url) {
        document.getElementById('logo-preview').innerHTML = `<img src="${settings.logo_url}" alt="Logo">`;
    }
    if (settings.banner_url) {
        document.getElementById('banner-preview').innerHTML = `<img src="${settings.banner_url}" alt="Banner">`;
    }
}

async function saveSettings(e) {
    e.preventDefault();
    
    const btn = document.getElementById('save-settings-btn');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
    
    try {
        // Upload images if selected
        let logoUrl = adminState.settings?.logo_url;
        let bannerUrl = adminState.settings?.banner_url;
        
        const logoFile = document.getElementById('logo-file').files[0];
        const bannerFile = document.getElementById('banner-file').files[0];
        
        if (logoFile) {
            logoUrl = await uploadImage(logoFile, 'logos');
        }
        if (bannerFile) {
            bannerUrl = await uploadImage(bannerFile, 'banners');
        }
        
        const settingsData = {
            guild_name: document.getElementById('guild-name').value,
            tagline: document.getElementById('guild-tagline').value,
            about_text: document.getElementById('guild-about').value,
            total_kills: parseInt(document.getElementById('total-kills').value) || 0,
            total_wins: parseInt(document.getElementById('total-wins').value) || 0,
            total_members: parseInt(document.getElementById('total-members').value) || 0,
            total_trophies: parseInt(document.getElementById('total-trophies').value) || 0,
            discord_link: document.getElementById('discord-link').value,
            youtube_link: document.getElementById('youtube-link').value,
            instagram_link: document.getElementById('instagram-link').value,
            facebook_link: document.getElementById('facebook-link').value,
            whatsapp_link: document.getElementById('whatsapp-link').value,
            logo_url: logoUrl,
            banner_url: bannerUrl,
            updated_at: new Date().toISOString()
        };
        
        const { error } = await window.supabaseClient
            .from('guild_settings')
            .update(settingsData)
            .eq('id', adminState.settings.id);
        
        if (error) throw error;
        
        adminState.settings = { ...adminState.settings, ...settingsData };
        showToast('Settings saved successfully');
    } catch (error) {
        console.error('Error saving settings:', error);
        showToast('Error saving settings', 'error');
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-save"></i> Save Settings';
    }
}

// ============================================
// INITIALIZE
// ============================================
async function initAdmin() {
    console.log('🔐 Initializing Admin Panel...');
    
    // Check authentication
    const isAuth = await checkAuth();
    if (!isAuth) return;
    
    // Setup navigation
    setupNavigation();
    
    // Setup settings form
    document.getElementById('settings-form').addEventListener('submit', saveSettings);
    
    // Fetch all data
    await fetchAllData();
    
    console.log('✅ Admin Panel Ready!');
}

// Start
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAdmin);
} else {
    initAdmin();
}