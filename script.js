/**
 * ==========================================================================
 * GTK4 & LIBADWAITA DESKTOP ENGINE (GNOME 47 WEB SHELL)
 * Crafted for Shabas T P — Full-Stack Web Developer & UI Craftsman
 * ==========================================================================
 */

(function () {
    'use strict';

    // Global App State & Media Query
    const systemDarkQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const AppState = {
        themeMode: localStorage.getItem('gtk-theme-mode') || localStorage.getItem('gtk-theme') || 'system',
        accent: 'teal',
        soundEnabled: localStorage.getItem('gtk-sound') !== 'false',
        volume: parseInt(localStorage.getItem('gtk-volume') || '80', 10),
        activeTab: 'overview',
        isWindowMaximized: false,
        isWindowMinimized: false,
        isAuthenticated: sessionStorage.getItem('adw-auth') === 'true' || sessionStorage.getItem('adw-admin-auth') === 'true'
    };

    /* ==========================================================================
       SYNTHESIZED WEB AUDIO ENGINE (ZERO EXTERNAL SOUND ASSETS)
       ========================================================================== */
    class AudioEngine {
        constructor() {
            this.ctx = null;
            this.lastSoundTime = 0;
        }

        initContext() {
            if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                this.ctx = new AudioCtx();
            }
        }

        ensureContext() {
            this.initContext();
            if (!this.ctx) return Promise.resolve(false);
            if (this.ctx.state === 'suspended') {
                return this.ctx.resume().then(() => true).catch(() => false);
            }
            return Promise.resolve(true);
        }

        playClick() {
            if (!AppState.soundEnabled) return;
            const nowMs = performance.now();
            if (nowMs - this.lastSoundTime < 45) return;
            this.lastSoundTime = nowMs;

            this.ensureContext().then(ready => {
                if (!ready || !this.ctx) return;
                try {
                    const now = Math.max(this.ctx.currentTime, 0.001) + 0.005;
                    const osc = this.ctx.createOscillator();
                    const gain = this.ctx.createGain();
                    const masterGain = (AppState.volume / 100) * 0.12;

                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(820, now);
                    osc.frequency.exponentialRampToValueAtTime(320, now + 0.035);

                    gain.gain.setValueAtTime(masterGain, now);
                    gain.gain.linearRampToValueAtTime(0, now + 0.035);

                    osc.connect(gain);
                    gain.connect(this.ctx.destination);

                    osc.start(now);
                    osc.stop(now + 0.04);
                } catch (e) {
                    // Ignore audio context errors
                }
            });
        }

        playSwitch() {
            if (!AppState.soundEnabled) return;
            this.lastSoundTime = performance.now();

            this.ensureContext().then(ready => {
                if (!ready || !this.ctx) return;
                try {
                    const now = Math.max(this.ctx.currentTime, 0.001) + 0.005;
                    const osc = this.ctx.createOscillator();
                    const gain = this.ctx.createGain();
                    const masterGain = (AppState.volume / 100) * 0.15;

                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(520, now);
                    osc.frequency.exponentialRampToValueAtTime(960, now + 0.05);

                    gain.gain.setValueAtTime(masterGain, now);
                    gain.gain.linearRampToValueAtTime(0, now + 0.05);

                    osc.connect(gain);
                    gain.connect(this.ctx.destination);

                    osc.start(now);
                    osc.stop(now + 0.055);
                } catch (e) {
                    // Ignore audio context errors
                }
            });
        }

        playChime() {
            if (!AppState.soundEnabled) return;
            this.lastSoundTime = performance.now();

            this.ensureContext().then(ready => {
                if (!ready || !this.ctx) return;
                try {
                    const now = Math.max(this.ctx.currentTime, 0.001) + 0.005;
                    const masterGain = (AppState.volume / 100) * 0.16;

                    // Tone 1: D5 (587.33 Hz)
                    const osc1 = this.ctx.createOscillator();
                    const gain1 = this.ctx.createGain();
                    osc1.type = 'sine';
                    osc1.frequency.setValueAtTime(587.33, now);
                    gain1.gain.setValueAtTime(masterGain, now);
                    gain1.gain.linearRampToValueAtTime(0, now + 0.22);
                    osc1.connect(gain1);
                    gain1.connect(this.ctx.destination);
                    osc1.start(now);
                    osc1.stop(now + 0.23);

                    // Tone 2: A5 (880 Hz)
                    const osc2 = this.ctx.createOscillator();
                    const gain2 = this.ctx.createGain();
                    osc2.type = 'sine';
                    osc2.frequency.setValueAtTime(880, now + 0.09);
                    gain2.gain.setValueAtTime(masterGain, now + 0.09);
                    gain2.gain.linearRampToValueAtTime(0, now + 0.35);
                    osc2.connect(gain2);
                    gain2.connect(this.ctx.destination);
                    osc2.start(now + 0.09);
                    osc2.stop(now + 0.36);
                } catch (e) {
                    // Ignore audio errors
                }
            });
        }
    }

    const sound = new AudioEngine();

    /* ==========================================================================
       THEME MANAGEMENT (3-WAY: SYSTEM -> LIGHT -> DARK)
       ========================================================================== */
    function resolveTheme(mode = AppState.themeMode) {
        if (mode === 'system') {
            return systemDarkQuery.matches ? 'dark' : 'light';
        }
        return mode;
    }

    function updateDOMTheme(mode, effectiveTheme) {
        AppState.themeMode = mode;
        localStorage.setItem('gtk-theme-mode', mode);
        localStorage.setItem('gtk-theme', mode);
        document.documentElement.setAttribute('data-theme', effectiveTheme);

        const themeBtn = document.getElementById('window-theme-toggle');
        const themeBtnIcon = document.getElementById('theme-btn-icon');
        if (themeBtn && themeBtnIcon) {
            if (AppState.themeMode === 'system') {
                const subLabel = effectiveTheme === 'dark' ? 'Dark' : 'Light';
                themeBtn.setAttribute('title', `Theme: System (${subLabel})`);
                themeBtn.setAttribute('aria-label', `Theme: Follow System (currently ${subLabel})`);
                themeBtnIcon.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M20 18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z"/></svg>`;
            } else if (AppState.themeMode === 'dark') {
                themeBtn.setAttribute('title', 'Theme: Dark');
                themeBtn.setAttribute('aria-label', 'Theme: Dark');
                themeBtnIcon.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/></svg>`;
            } else {
                themeBtn.setAttribute('title', 'Theme: Light');
                themeBtn.setAttribute('aria-label', 'Theme: Light');
                themeBtnIcon.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;
            }
        }
    }

    function applyThemeMode(mode, animated = false) {
        const effectiveTheme = resolveTheme(mode);
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const shouldAnimate = animated && (currentTheme !== effectiveTheme);

        if (shouldAnimate && document.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.startViewTransition(() => {
                updateDOMTheme(mode, effectiveTheme);
            });
        } else if (shouldAnimate) {
            document.documentElement.classList.add('theme-transitioning');
            updateDOMTheme(mode, effectiveTheme);
            setTimeout(() => {
                document.documentElement.classList.remove('theme-transitioning');
            }, 320);
        } else {
            updateDOMTheme(mode, effectiveTheme);
        }
    }

    function cycleTheme() {
        const modes = ['system', 'light', 'dark'];
        const currentIndex = modes.indexOf(AppState.themeMode);
        const nextIndex = (currentIndex + 1) % modes.length;
        applyThemeMode(modes[nextIndex], true);
    }

    // Dynamic OS Theme Change Listener
    if (systemDarkQuery.addEventListener) {
        systemDarkQuery.addEventListener('change', () => {
            if (AppState.themeMode === 'system') {
                applyThemeMode('system', true);
            }
        });
    } else if (systemDarkQuery.addListener) {
        systemDarkQuery.addListener(() => {
            if (AppState.themeMode === 'system') {
                applyThemeMode('system', true);
            }
        });
    }

    /* ==========================================================================
       VIEW & NAVIGATION SWITCHER
       ========================================================================== */
    function switchTab(tabId) {
        AppState.activeTab = tabId;

        // Update View Switcher Buttons in HeaderBar
        document.querySelectorAll('.view-switcher-button').forEach(btn => {
            if (btn.dataset.tab === tabId) {
                btn.classList.add('active');
                btn.setAttribute('aria-selected', 'true');
            } else {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
            }
        });

        // Update Pages
        document.querySelectorAll('.view-page').forEach(page => {
            page.classList.remove('active');
        });
        const targetPage = document.getElementById(`page-${tabId}`);
        if (targetPage) {
            targetPage.classList.add('active');
        }

        const titleMap = {
            overview: 'Overview',
            projects: 'Projects',
            skills: 'Skills',
            contact: 'Contact'
        };
        document.title = `Shabas T P — ${titleMap[tabId] || 'Portfolio'}`;

        // Scroll view stack to top
        const viewStack = document.getElementById('view-stack');
        if (viewStack) viewStack.scrollTop = 0;
    }






    /* ==========================================================================
       SYSTEM DIAGNOSTIC BENCHMARK
       ========================================================================== */
    function setupBenchmark() {
        const runBtn = document.getElementById('run-benchmark-btn');
        const resultsBox = document.getElementById('benchmark-results');
        const statusText = document.getElementById('benchmark-status-text');
        const opsEl = document.getElementById('bench-ops');
        const timeEl = document.getElementById('bench-time');
        const scoreEl = document.getElementById('bench-score');

        if (!runBtn) return;

        runBtn.addEventListener('click', () => {
            runBtn.disabled = true;
            runBtn.textContent = '⏳ Running Diagnostics...';
            statusText.textContent = 'Executing 1,000,000 mathematical transformations & memory allocations...';

            setTimeout(() => {
                const t0 = performance.now();
                let sum = 0;
                for (let i = 0; i < 1000000; i++) {
                    sum += Math.sqrt(i) * Math.sin(i);
                }
                const t1 = performance.now();
                const elapsed = (t1 - t0).toFixed(2);
                const score = Math.max(90, (100 - (elapsed / 4))).toFixed(1);

                runBtn.disabled = false;
                runBtn.textContent = '▶ Re-run Diagnostic';
                statusText.textContent = 'Benchmark completed. Host browser engine operating at peak responsiveness.';
                resultsBox.style.display = 'flex';

                if (opsEl) opsEl.innerHTML = `Operations: <strong>1,000,000</strong>`;
                if (timeEl) timeEl.innerHTML = `Execution: <strong>${elapsed} ms</strong>`;
                if (scoreEl) scoreEl.innerHTML = `Rating: <strong class="accent-text">${score} / 100 (Optimal)</strong>`;
            }, 60);
        });
    }

    /* ==========================================================================
       PROJECTS FILTER & SEARCH
       ========================================================================== */
    function setupProjectsFilter() {
        const filterPills = document.querySelectorAll('.filter-pill');
        const searchInput = document.getElementById('project-search-input');

        function filterProjects() {
            const activeFilter = document.querySelector('.filter-pill.active')?.dataset.filter || 'all';
            const query = (searchInput?.value || '').toLowerCase().trim();
            const cards = document.querySelectorAll('.software-card');

            cards.forEach(card => {
                const category = card.dataset.category || '';
                const text = card.textContent.toLowerCase();

                const matchesCategory = (activeFilter === 'all') || category.includes(activeFilter);
                const matchesQuery = !query || text.includes(query);

                if (matchesCategory && matchesQuery) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        }

        filterPills.forEach(pill => {
            pill.addEventListener('click', () => {
                filterPills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                filterProjects();
            });
        });

        if (searchInput) {
            searchInput.addEventListener('input', filterProjects);
        }
    }

    /* ==========================================================================
       CONTACT FORM & INTERACTION
       ========================================================================== */
    function setupContact() {
        const form = document.getElementById('contact-form');
        const copyEmailBtn = document.getElementById('btn-copy-email');
        const copyEmailRow = document.getElementById('row-copy-email');

        function copyEmail() {
            const email = 'iamshabastp@gmail.com';
            function onCopied() {
                if (copyEmailBtn) {
                    const originalText = copyEmailBtn.textContent;
                    copyEmailBtn.textContent = 'Copied! ✓';
                    setTimeout(() => { copyEmailBtn.textContent = originalText; }, 2000);
                }
            }

            if (navigator.clipboard) {
                navigator.clipboard.writeText(email).then(onCopied).catch(() => {
                    fallbackCopy(email);
                    onCopied();
                });
            } else {
                fallbackCopy(email);
                onCopied();
            }
        }

        function fallbackCopy(text) {
            const temp = document.createElement('textarea');
            temp.value = text;
            document.body.appendChild(temp);
            temp.select();
            document.execCommand('copy');
            document.body.removeChild(temp);
        }

        if (copyEmailBtn) copyEmailBtn.onclick = (e) => { e.stopPropagation(); copyEmail(); };
        if (copyEmailRow) copyEmailRow.onclick = copyEmail;

        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                sound.playChime();

                const name = document.getElementById('contact-name').value;
                const email = document.getElementById('contact-email').value;
                const subject = document.getElementById('contact-subject').value;
                const message = document.getElementById('contact-message').value;

                const submitBtn = form.querySelector('button[type="submit"]');
                if (submitBtn) {
                    submitBtn.textContent = 'Opening Mail Client...';
                    setTimeout(() => { submitBtn.textContent = 'Send Message'; }, 3000);
                }

                // Formulate mailto link
                const mailtoUrl = `mailto:iamshabastp@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`From: ${name} (${email})\n\n${message}`)}`;
                setTimeout(() => {
                    window.location.href = mailtoUrl;
                }, 500);

                form.reset();
            });
        }
    }



    /* ==========================================================================
       HEADER CONTROLS (SOUND & THEME)
       ========================================================================== */
    function setupHeaderControls() {
        const soundBtn = document.getElementById('header-sound-btn');
        const soundIcon = document.getElementById('header-sound-icon');
        const themeBtn = document.getElementById('window-theme-toggle');

        function updateSoundIcon() {
            if (!soundIcon) return;
            if (AppState.soundEnabled) {
                soundIcon.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>`;
            } else {
                soundIcon.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>`;
            }
        }

        updateSoundIcon();

        if (soundBtn) {
            soundBtn.addEventListener('click', () => {
                AppState.soundEnabled = !AppState.soundEnabled;
                localStorage.setItem('gtk-sound', AppState.soundEnabled);
                updateSoundIcon();
                if (AppState.soundEnabled) {
                    sound.playClick();
                }
            });
        }

        if (themeBtn) {
            themeBtn.addEventListener('click', cycleTheme);
        }
    }

    /* ==========================================================================
       UTILITIES
       ========================================================================== */
    function escapeHtml(str) {
        return str.replace(/&/g, '&amp;')
                  .replace(/</g, '&lt;')
                  .replace(/>/g, '&gt;')
                  .replace(/"/g, '&quot;')
                  .replace(/'/g, '&#039;');
    }

    /* ==========================================================================
       PROJECTS DATA & UNIFIED STORE
       ========================================================================== */
    const DEFAULT_PROJECTS = [];

    let currentProjects = [];
    let deletingProjectId = null;
    let pendingActionCallback = null;
    let openAddProjectModal = function () {};
    let openEditModalForProject = function () {};
    let openDeleteModalForProject = function () {};
    let openTokenModal = function () {};

    /* ==========================================================================
       JUST-IN-TIME TOKEN GATEKEEPER
       ========================================================================== */
    function requireGitHubToken(actionCallback) {
        const token = (localStorage.getItem('shaabas_github_pat') || '').trim();
        if (token) {
            actionCallback();
            return;
        }
        pendingActionCallback = actionCallback;
        openTokenModal();
    }

    /* ==========================================================================
       TOAST NOTIFICATIONS
       ========================================================================== */
    function showToast(msg, duration = 3500) {
        const overlay = document.getElementById('adw-toast-overlay');
        if (!overlay) return;
        const toast = document.createElement('div');
        toast.className = 'adw-toast';
        toast.textContent = msg;
        overlay.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('hiding');
            setTimeout(() => toast.remove(), 260);
        }, duration);
    }

    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function saveProjectsDataLocally(projects) {
        try {
            localStorage.setItem('shaabas_projects_data', JSON.stringify(projects));
        } catch (e) {
            console.warn('LocalStorage save failed:', e);
        }
    }

    /* ==========================================================================
       AUTOMATED GITHUB CONTENTS API SYNC
       ========================================================================== */
    async function syncProjectsToGitHub(projects, commitMessage) {
        const token = (localStorage.getItem('shaabas_github_pat') || '').trim();
        if (!token) {
            showToast('✓ Saved locally.');
            return;
        }

        showToast('⏳ Syncing to GitHub...');

        try {
            const repo = 'Shaabas/shaabas.github.io';
            const path = 'projects.json';
            const apiUrl = `https://api.github.com/repos/${repo}/contents/${path}`;

            // 1. Get current file SHA
            const getRes = await fetch(apiUrl, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (getRes.status === 401 || getRes.status === 403) {
                showToast('⚠️ GitHub authentication failed. Please update your token.');
                openTokenModal();
                return;
            }

            let sha = null;
            if (getRes.ok) {
                const fileData = await getRes.json();
                sha = fileData.sha;
            }

            // 2. Base64 payload encoding with UTF-8 support
            const contentStr = JSON.stringify(projects, null, 2);
            const contentBase64 = btoa(unescape(encodeURIComponent(contentStr)));

            const putBody = {
                message: commitMessage || 'chore(projects): update portfolio projects',
                content: contentBase64
            };
            if (sha) {
                putBody.sha = sha;
            }

            const putRes = await fetch(apiUrl, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(putBody)
            });

            if (putRes.ok) {
                const resJson = await putRes.json();
                const commitSha = resJson.commit?.sha?.substring(0, 7) || 'latest';
                showToast(`✓ Committed to GitHub (${commitSha})! Live in ~30s.`);
                sound.playChime();
            } else if (putRes.status === 401 || putRes.status === 403) {
                showToast('⚠️ GitHub authentication failed. Please update your token.');
                openTokenModal();
            } else {
                const errJson = await putRes.json().catch(() => ({}));
                console.error('GitHub API error:', errJson);
                showToast(`⚠️ GitHub push failed: ${errJson.message || putRes.statusText}`);
            }
        } catch (err) {
            console.error('Sync error:', err);
            showToast('⚠️ Network error while syncing to GitHub.');
        }
    }

    /* ==========================================================================
       RENDER PROJECTS LIST
       ========================================================================== */
    function renderProjects(list) {
        const container = document.getElementById('projects-container');
        if (!container) return;
        container.innerHTML = '';

        if (!list || list.length === 0) {
            container.innerHTML = `
                <div class="empty-projects-state" style="grid-column: 1 / -1; text-align: center; padding: 48px 16px; color: var(--dim-label-color);">
                    <div style="font-size: 2.5rem; margin-bottom: 12px;">📦</div>
                    <div style="font-size: 1.1rem; font-weight: 600; color: var(--window-fg-color); margin-bottom: 6px;">No Projects Yet</div>
                    <div style="font-size: 0.88rem; max-width: 380px; margin: 0 auto;">Projects added through the website will appear here.</div>
                </div>
            `;
            return;
        }

        list.forEach(p => {
            const card = document.createElement('div');
            card.className = 'software-card';
            card.dataset.id = p.id;
            card.dataset.category = p.category || 'web';

            const iconHtml = p.iconType === 'svg'
                ? (p.iconContent || '')
                : `<span class="icon-emoji">${escapeHtml(p.iconContent || p.iconEmoji || '🚀')}</span>`;

            const badgeHtml = p.badge
                ? `<span class="${escapeHtml(p.badgeClass || 'app-tag-pill')}">${escapeHtml(p.badge)}</span>`
                : '';

            const tagsHtml = (p.tags || []).map(t => `<span class="tech-tag">${escapeHtml(t)}</span>`).join('');

            card.innerHTML = `
                <div class="software-card-top">
                    <div class="software-icon-box ${escapeHtml(p.iconGradient || 'app-blue-gradient')}">
                        ${iconHtml}
                    </div>
                    <div class="software-card-meta">
                        <div class="software-card-title">${escapeHtml(p.title)}</div>
                        <div class="software-card-dev">${escapeHtml(p.dev || 'by Shabas T P • v1.0')}</div>
                        <div class="rating-stars">${escapeHtml(p.ratingStars || '★★★★★')} <span class="rating-num">${escapeHtml(p.ratingNum || '')}</span></div>
                    </div>
                    ${badgeHtml}
                    <div class="card-admin-actions" style="display: ${AppState.isAuthenticated ? 'inline-flex' : 'none'};">
                        <button type="button" class="adw-icon-btn card-edit-btn" title="Edit Project" data-id="${escapeHtml(p.id)}">
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                            </svg>
                        </button>
                        <button type="button" class="adw-icon-btn card-delete-btn" title="Delete Project" data-id="${escapeHtml(p.id)}">
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                            </svg>
                        </button>
                    </div>
                </div>
                <p class="software-card-desc">
                    ${escapeHtml(p.desc)}
                </p>
                <div class="software-tech-tags">
                    ${tagsHtml}
                </div>
                <div class="software-card-actions">
                    <a href="${escapeHtml(p.actionUrl)}" target="_blank" rel="noopener noreferrer" class="adw-btn adw-suggested-action">
                        ${escapeHtml(p.actionText || 'Source Code')}
                    </a>
                </div>
            `;
            container.appendChild(card);
        });

        // Wire edit and delete buttons on each card (guarded by token gatekeeper)
        container.querySelectorAll('.card-edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.dataset.id;
                requireGitHubToken(() => openEditModalForProject(id));
            });
        });

        container.querySelectorAll('.card-delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.dataset.id;
                requireGitHubToken(() => openDeleteModalForProject(id));
            });
        });
    }

    /* ==========================================================================
       LOAD PROJECTS STORE
       ========================================================================== */
    function loadProjectsData() {
        currentProjects = [];
        try {
            const cached = localStorage.getItem('shaabas_projects_data');
            if (cached) {
                const parsed = JSON.parse(cached);
                if (Array.isArray(parsed) && parsed.length) {
                    currentProjects = parsed;
                }
            }
        } catch (e) {}

        renderProjects(currentProjects);

        // Fetch latest projects.json asynchronously
        fetch('projects.json')
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                if (Array.isArray(data)) {
                    currentProjects = data;
                    saveProjectsDataLocally(currentProjects);
                    renderProjects(currentProjects);
                }
            })
            .catch(() => {});
    }

    /* ==========================================================================
       PROJECT MODAL (ADD & EDIT)
       ========================================================================== */
    function setupProjectModal() {
        const addBtn = document.getElementById('add-project-btn');
        const modalBackdrop = document.getElementById('add-project-modal-backdrop');
        const cancelBtn = document.getElementById('add-project-cancel-btn');
        const form = document.getElementById('add-project-form');
        const modalTitle = document.getElementById('project-modal-title');
        const modalSubtitle = document.getElementById('project-modal-subtitle');
        const submitBtn = document.getElementById('add-project-submit-btn');
        const editIdInput = document.getElementById('edit-project-id');

        if (!modalBackdrop || !form) return;

        function openModal(isEdit = false, project = null) {
            modalBackdrop.classList.add('open');
            modalBackdrop.setAttribute('aria-hidden', 'false');

            if (isEdit && project) {
                if (modalTitle) modalTitle.textContent = 'Edit Project';
                if (modalSubtitle) modalSubtitle.textContent = 'Update software details and publish changes';
                if (submitBtn) submitBtn.textContent = 'Save Changes';
                if (editIdInput) editIdInput.value = project.id;

                if (document.getElementById('new-project-title')) document.getElementById('new-project-title').value = project.title || '';
                if (document.getElementById('new-project-dev')) document.getElementById('new-project-dev').value = project.dev || '';
                if (document.getElementById('new-project-category')) document.getElementById('new-project-category').value = project.category || 'web';
                if (document.getElementById('new-project-desc')) document.getElementById('new-project-desc').value = project.desc || '';
                if (document.getElementById('new-project-tags')) document.getElementById('new-project-tags').value = (project.tags || []).join(', ');
                if (document.getElementById('new-project-url')) document.getElementById('new-project-url').value = project.actionUrl || '';
                if (document.getElementById('new-project-btn-text')) document.getElementById('new-project-btn-text').value = project.actionText || 'Source Code';
                if (document.getElementById('new-project-gradient')) document.getElementById('new-project-gradient').value = project.iconGradient || 'app-blue-gradient';
                if (document.getElementById('new-project-emoji')) document.getElementById('new-project-emoji').value = project.iconContent || project.iconEmoji || '🚀';
            } else {
                if (modalTitle) modalTitle.textContent = 'Add New Project';
                if (modalSubtitle) modalSubtitle.textContent = 'Configure software details to add to your portfolio';
                if (submitBtn) submitBtn.textContent = 'Add Project';
                if (editIdInput) editIdInput.value = '';
                form.reset();
            }

            const titleInput = document.getElementById('new-project-title');
            if (titleInput) setTimeout(() => titleInput.focus(), 80);
            sound.playChime();
        }

        function closeModal() {
            modalBackdrop.classList.remove('open');
            modalBackdrop.setAttribute('aria-hidden', 'true');
        }

        openAddProjectModal = function () {
            openModal(false);
        };

        openEditModalForProject = function (id) {
            const project = currentProjects.find(p => p.id === id);
            if (project) {
                openModal(true, project);
            }
        };

        if (addBtn) {
            addBtn.addEventListener('click', () => {
                requireGitHubToken(() => openModal(false));
            });
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', closeModal);
        }

        modalBackdrop.addEventListener('click', (e) => {
            if (e.target === modalBackdrop) {
                closeModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modalBackdrop.classList.contains('open')) {
                closeModal();
            }
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const editId = (editIdInput?.value || '').trim();
            const title = (document.getElementById('new-project-title')?.value || '').trim();
            const dev = (document.getElementById('new-project-dev')?.value || '').trim() || 'by Shabas T P • v1.0';
            const category = document.getElementById('new-project-category')?.value || 'web';
            const desc = (document.getElementById('new-project-desc')?.value || '').trim();
            const tagsRaw = (document.getElementById('new-project-tags')?.value || '').trim();
            const url = (document.getElementById('new-project-url')?.value || '').trim();
            const btnText = (document.getElementById('new-project-btn-text')?.value || '').trim() || 'Source Code';
            const gradient = document.getElementById('new-project-gradient')?.value || 'app-blue-gradient';
            const emoji = (document.getElementById('new-project-emoji')?.value || '').trim() || '🚀';

            if (!title || !desc || !url) return;

            const tags = tagsRaw ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean) : ['Web'];

            if (editId) {
                // Edit existing project
                const index = currentProjects.findIndex(p => p.id === editId);
                if (index !== -1) {
                    currentProjects[index] = {
                        ...currentProjects[index],
                        title,
                        dev,
                        category,
                        desc,
                        tags,
                        actionUrl: url,
                        actionText: btnText,
                        iconGradient: gradient,
                        iconContent: emoji,
                        iconEmoji: emoji
                    };
                    saveProjectsDataLocally(currentProjects);
                    renderProjects(currentProjects);
                    syncProjectsToGitHub(currentProjects, `feat(projects): update ${title}`);
                    showToast(`✓ Project "${title}" updated.`);
                }
            } else {
                // Add new project
                const newProject = {
                    id: 'proj-' + Date.now(),
                    title,
                    dev,
                    category,
                    desc,
                    tags,
                    actionUrl: url,
                    actionText: btnText,
                    iconGradient: gradient,
                    iconType: 'emoji',
                    iconContent: emoji,
                    iconEmoji: emoji,
                    ratingStars: '★★★★★',
                    ratingNum: '(New)',
                    badge: 'New',
                    badgeClass: 'app-tag-pill'
                };

                currentProjects.unshift(newProject);
                saveProjectsDataLocally(currentProjects);
                renderProjects(currentProjects);
                syncProjectsToGitHub(currentProjects, `feat(projects): add ${title}`);
                showToast(`✓ Project "${title}" added.`);
            }

            // Re-apply filter so changes are instantly visible
            const activeFilter = document.querySelector('.filter-pill.active')?.dataset.filter || 'all';
            if (activeFilter !== 'all' && !category.includes(activeFilter)) {
                const allPill = document.querySelector('.filter-pill[data-filter="all"]');
                if (allPill) allPill.click();
            }

            sound.playChime();
            closeModal();
        });
    }

    /* ==========================================================================
       DELETE PROJECT CONFIRMATION
       ========================================================================== */
    function setupDeleteModal() {
        const modalBackdrop = document.getElementById('delete-project-modal-backdrop');
        const cancelBtn = document.getElementById('delete-cancel-btn');
        const confirmBtn = document.getElementById('delete-confirm-btn');
        const msgEl = document.getElementById('delete-project-msg');

        if (!modalBackdrop || !confirmBtn) return;

        function closeModal() {
            modalBackdrop.classList.remove('open');
            modalBackdrop.setAttribute('aria-hidden', 'true');
            deletingProjectId = null;
        }

        openDeleteModalForProject = function (id) {
            const project = currentProjects.find(p => p.id === id);
            if (!project) return;

            deletingProjectId = id;
            if (msgEl) {
                msgEl.innerHTML = `Are you sure you want to remove <strong>"${escapeHtml(project.title)}"</strong> from your portfolio?`;
            }
            modalBackdrop.classList.add('open');
            modalBackdrop.setAttribute('aria-hidden', 'false');
            sound.playChime();
        };

        if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

        modalBackdrop.addEventListener('click', (e) => {
            if (e.target === modalBackdrop) closeModal();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modalBackdrop.classList.contains('open')) closeModal();
        });

        confirmBtn.addEventListener('click', () => {
            if (!deletingProjectId) return;
            const project = currentProjects.find(p => p.id === deletingProjectId);
            const title = project ? project.title : 'Project';

            // Find card and animate removal
            const card = document.querySelector(`.software-card[data-id="${deletingProjectId}"]`);
            if (card) {
                card.classList.add('removing');
            }

            currentProjects = currentProjects.filter(p => p.id !== deletingProjectId);
            saveProjectsDataLocally(currentProjects);

            setTimeout(() => {
                if (card) card.remove();
                if (currentProjects.length === 0) {
                    renderProjects(currentProjects);
                }
            }, 260);

            syncProjectsToGitHub(currentProjects, `feat(projects): delete ${title}`);
            showToast(`✓ Project "${title}" deleted.`);
            sound.playClick();
            closeModal();
        });
    }

    /* ==========================================================================
       GITHUB TOKEN SETTINGS MODAL
       ========================================================================== */
    function setupTokenSettings() {
        const modalBackdrop = document.getElementById('token-modal-backdrop');
        const cancelBtn = document.getElementById('token-cancel-btn');
        const clearBtn = document.getElementById('token-clear-btn');
        const form = document.getElementById('token-form');
        const input = document.getElementById('github-token-input');
        const statusBox = document.getElementById('token-status-box');

        if (!modalBackdrop || !form) return;

        function refreshStatus() {
            const saved = localStorage.getItem('shaabas_github_pat');
            if (saved) {
                if (statusBox) {
                    statusBox.className = 'token-status-box configured';
                    statusBox.innerHTML = '<span>✓ Personal Access Token configured in this browser.</span>';
                }
                if (clearBtn) clearBtn.style.display = 'inline-flex';
                if (input) input.placeholder = '•••••••••••••••••••••••• (Leave blank to keep current)';
            } else {
                if (statusBox) {
                    statusBox.className = 'token-status-box';
                    statusBox.innerHTML = '<span>No token configured. A token is required to publish portfolio updates.</span>';
                }
                if (clearBtn) clearBtn.style.display = 'none';
                if (input) input.placeholder = 'ghp_... or github_pat_...';
            }
            if (input) input.value = '';
        }

        function openModal() {
            refreshStatus();
            modalBackdrop.classList.add('open');
            modalBackdrop.setAttribute('aria-hidden', 'false');
            if (input) setTimeout(() => input.focus(), 80);
            sound.playChime();
        }

        function closeModal() {
            modalBackdrop.classList.remove('open');
            modalBackdrop.setAttribute('aria-hidden', 'true');
            pendingActionCallback = null;
        }

        openTokenModal = openModal;

        if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

        modalBackdrop.addEventListener('click', (e) => {
            if (e.target === modalBackdrop) closeModal();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modalBackdrop.classList.contains('open')) closeModal();
        });

        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                localStorage.removeItem('shaabas_github_pat');
                sound.playClick();
                showToast('GitHub Personal Access Token cleared.');
                closeModal();
            });
        }

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const val = (input?.value || '').trim();
            const existing = localStorage.getItem('shaabas_github_pat');

            if (!val && !existing) {
                if (input) input.focus();
                return;
            }

            if (val) {
                localStorage.setItem('shaabas_github_pat', val);
                showToast('✓ GitHub Personal Access Token saved locally!');
                sound.playChime();
            }

            const actionToRun = pendingActionCallback;
            pendingActionCallback = null;

            modalBackdrop.classList.remove('open');
            modalBackdrop.setAttribute('aria-hidden', 'true');

            if (actionToRun) {
                setTimeout(() => actionToRun(), 120);
            }
        });
    }

    /* ==========================================================================
       AUTHENTICATED SESSION MANAGEMENT (AVATAR 5-CLICK TRIGGER)
       ========================================================================== */
    let openAuthDialog = function () {};

    function updateSessionUI(active) {
        AppState.isAuthenticated = active;
        const addBtn = document.getElementById('add-project-btn');
        if (addBtn) addBtn.style.display = active ? 'inline-flex' : 'none';

        document.querySelectorAll('.card-admin-actions').forEach(el => {
            el.style.display = active ? 'inline-flex' : 'none';
        });
    }

    function setupAuthDialog() {
        const backdrop = document.getElementById('auth-modal-backdrop');
        const dialog = backdrop ? backdrop.querySelector('.adw-dialog') : null;
        const authForm = document.getElementById('auth-form');
        const deauthView = document.getElementById('deauth-view');
        const input = document.getElementById('auth-phrase-input');
        const statusMsg = document.getElementById('auth-status-msg');
        const authCancelBtn = document.getElementById('auth-cancel-btn');
        const deauthCancelBtn = document.getElementById('deauth-cancel-btn');
        const deauthConfirmBtn = document.getElementById('deauth-confirm-btn');
        const sessionClearTokenBtn = document.getElementById('session-clear-token-btn');
        const avatar = document.getElementById('hero-avatar');

        let clickCount = 0;
        let clickTimer = null;

        function openModal() {
            if (!backdrop) return;
            backdrop.classList.add('open');
            backdrop.setAttribute('aria-hidden', 'false');

            if (AppState.isAuthenticated) {
                // If authenticated, show Deauthenticate view
                if (authForm) authForm.style.display = 'none';
                if (deauthView) deauthView.style.display = 'block';
            } else {
                // If not authenticated, show password prompt
                if (authForm) authForm.style.display = 'flex';
                if (deauthView) deauthView.style.display = 'none';
                if (statusMsg) {
                    statusMsg.textContent = '';
                    statusMsg.className = 'dialog-status-message';
                }
                if (dialog) dialog.classList.remove('shake');
                if (input) {
                    input.value = '';
                    setTimeout(() => input.focus(), 80);
                }
            }
            sound.playChime();
        }

        function closeModal() {
            if (!backdrop) return;
            backdrop.classList.remove('open');
            backdrop.setAttribute('aria-hidden', 'true');
            if (input) input.blur();
        }

        openAuthDialog = openModal;

        // Trigger on 5 clicks within 2.5 seconds
        if (avatar) {
            avatar.style.cursor = 'pointer';
            avatar.addEventListener('click', () => {
                clickCount++;
                clearTimeout(clickTimer);

                if (clickCount >= 5) {
                    clickCount = 0;
                    openModal();
                } else {
                    clickTimer = setTimeout(() => {
                        clickCount = 0;
                    }, 2500);
                }
            });
        }

        // Cancel buttons
        if (authCancelBtn) authCancelBtn.addEventListener('click', closeModal);
        if (deauthCancelBtn) deauthCancelBtn.addEventListener('click', closeModal);

        // Deauthenticate action button
        if (deauthConfirmBtn) {
            deauthConfirmBtn.addEventListener('click', () => {
                sessionStorage.removeItem('adw-auth');
                sessionStorage.removeItem('adw-admin-auth');
                updateSessionUI(false);
                sound.playClick();
                closeModal();
                showToast('Session ended.');
            });
        }

        // Clear Token link inside deauth view
        if (sessionClearTokenBtn) {
            sessionClearTokenBtn.addEventListener('click', () => {
                localStorage.removeItem('shaabas_github_pat');
                sound.playClick();
                showToast('GitHub Token cleared from browser.');
                closeModal();
            });
        }

        // Close on clicking backdrop outside dialog
        if (backdrop) {
            backdrop.addEventListener('click', (e) => {
                if (e.target === backdrop) closeModal();
            });
        }

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && backdrop && backdrop.classList.contains('open')) {
                closeModal();
            }
        });

        // Form submit & password verification
        if (authForm && input) {
            authForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const phrase = input.value.trim();

                if (phrase === 'pd1703') {
                    sessionStorage.setItem('adw-auth', 'true');
                    updateSessionUI(true);

                    if (statusMsg) {
                        statusMsg.textContent = '✓ Access Granted';
                        statusMsg.className = 'dialog-status-message success';
                    }
                    sound.playChime();

                    setTimeout(() => {
                        closeModal();
                        showToast('✓ Access Granted');
                    }, 800);
                } else {
                    if (statusMsg) {
                        statusMsg.textContent = 'Incorrect password. Access denied.';
                        statusMsg.className = 'dialog-status-message error';
                    }
                    if (dialog) {
                        dialog.classList.remove('shake');
                        void dialog.offsetWidth; // Force CSS reflow
                        dialog.classList.add('shake');
                    }
                    input.value = '';
                    input.focus();
                }
            });
        }
    }

    /* ==========================================================================
       INITIALIZATION
       ========================================================================== */
    function init() {
        // Apply saved theme mode
        applyThemeMode(AppState.themeMode);

        // Setup Header Controls
        setupHeaderControls();
        loadProjectsData();
        setupProjectsFilter();
        setupBenchmark();
        setupContact();

        // View Switcher clicks
        document.querySelectorAll('.view-switcher-button').forEach(btn => {
            btn.addEventListener('click', () => switchTab(btn.dataset.tab));
        });

        // Hero button clicks
        const heroContactBtn = document.getElementById('hero-contact-btn');
        const heroProjectsBtn = document.getElementById('hero-projects-btn');
        if (heroContactBtn) heroContactBtn.onclick = () => switchTab('contact');
        if (heroProjectsBtn) heroProjectsBtn.onclick = () => switchTab('projects');

        // Overview clickable action rows
        const rowSoft = document.getElementById('row-launch-software');
        const rowSkill = document.getElementById('row-launch-skills');
        const rowContact = document.getElementById('row-launch-contact');
        if (rowSoft) rowSoft.onclick = () => switchTab('projects');
        if (rowSkill) rowSkill.onclick = () => switchTab('skills');
        if (rowContact) rowContact.onclick = () => switchTab('contact');

        // Global Press-Down Sound Feedback (Fires on PRESS, Never on Release)
        document.addEventListener('pointerdown', (e) => {
            if (!AppState.soundEnabled && !e.target.closest('#header-sound-btn')) return;
            const interactive = e.target.closest(
                'button, a, [role="button"], [role="tab"], .clickable-row, .adw-action-row.clickable-row, .filter-pill, .view-switcher-button, .btn-card-action, .social-badge-btn, .contact-method-card, #hero-avatar, .adw-avatar'
            );
            if (!interactive) return;

            // Specialized sounds on press down
            if (interactive.id === 'window-theme-toggle') {
                sound.playSwitch();
                return;
            }

            if (interactive.id === 'header-sound-btn') {
                if (AppState.soundEnabled) {
                    sound.playClick();
                }
                return;
            }

            if (interactive.id === 'contact-submit-btn') {
                sound.playClick();
                return;
            }

            sound.playClick();
        }, { passive: true });

        // Keyboard press feedback (Enter / Space on focused interactive elements)
        document.addEventListener('keydown', (e) => {
            if (!AppState.soundEnabled) return;
            if (e.key === 'Enter' || e.key === ' ') {
                const target = document.activeElement;
                if (target && target.matches('button, [role="button"], [role="tab"], .filter-pill, .view-switcher-button')) {
                    if (target.id === 'window-theme-toggle') {
                        sound.playSwitch();
                    } else {
                        sound.playClick();
                    }
                }
            }
        });

        // Warm up AudioContext on very first interaction to eliminate initial latency
        const warmAudio = () => {
            sound.ensureContext();
            window.removeEventListener('pointerdown', warmAudio, true);
            window.removeEventListener('touchstart', warmAudio, true);
            window.removeEventListener('keydown', warmAudio, true);
        };
        window.addEventListener('pointerdown', warmAudio, { capture: true, passive: true });
        window.addEventListener('touchstart', warmAudio, { capture: true, passive: true });
        window.addEventListener('keydown', warmAudio, { capture: true, passive: true });

        // Banner close
        const bannerClose = document.getElementById('banner-close-btn');
        const banner = document.getElementById('announcement-banner');
        if (bannerClose && banner) {
            bannerClose.onclick = () => {
                banner.classList.add('dismissed');
            };
        }

        // Setup Secret Authentication Dialog, Projects CRUD & Token Settings
        setupAuthDialog();
        setupProjectModal();
        setupDeleteModal();
        setupTokenSettings();

        // Restore Session UI if previously authenticated in this session
        if (AppState.isAuthenticated) {
            updateSessionUI(true);
        }

        // Export globals for inline HTML triggers
        window.PortfolioApp = {
            switchTab,
            cycleTheme,
            toggleTheme: cycleTheme,
            openAuthDialog
        };
    }

    // Launch on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
