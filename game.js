
class GameState {
    constructor() {
        this.cookies = 0;
        this.totalCookiesEarned = 0;
        this.cookiesPerSecond = 0;
        this.clickPower = 1;
        this.totalClicks = 0;
        this.buildings = {};
        this.upgrades = {};
        this.currentTheme = 'default';
        this.unlockedThemes = ['default'];
        this.startTime = Date.now();
        this.activeEvent = null;
    }

    addCookies(amount) {
        this.cookies += amount;
        this.totalCookiesEarned += amount;
    }

    spendCookies(amount) {
        if (this.cookies >= amount) {
            this.cookies -= amount;
            return true;
        }
        return false;
    }

    save() {
        const saveData = {
            cookies: this.cookies,
            totalCookiesEarned: this.totalCookiesEarned,
            cookiesPerSecond: this.cookiesPerSecond,
            clickPower: this.clickPower,
            totalClicks: this.totalClicks,
            buildings: this.buildings,
            upgrades: this.upgrades,
            currentTheme: this.currentTheme,
            unlockedThemes: this.unlockedThemes,
            startTime: this.startTime
        };
        localStorage.setItem('cookieClickerSave', JSON.stringify(saveData));
    }

    load() {
        const saveData = localStorage.getItem('cookieClickerSave');
        if (saveData) {
            const data = JSON.parse(saveData);
            this.cookies = data.cookies || 0;
            this.totalCookiesEarned = data.totalCookiesEarned || 0;
            this.cookiesPerSecond = data.cookiesPerSecond || 0;
            this.clickPower = data.clickPower || 1;
            this.totalClicks = data.totalClicks || 0;
            this.buildings = data.buildings || {};
            this.upgrades = data.upgrades || {};
            this.currentTheme = data.currentTheme || 'default';
            this.unlockedThemes = data.unlockedThemes || ['default'];
            this.startTime = data.startTime || Date.now();
            return true;
        }
        return false;
    }

    reset() {
        localStorage.removeItem('cookieClickerSave');
        location.reload();
    }
}

// BUILDING CLASS
class Building {
    constructor(id, name, baseCost, baseProduction, icon, description) {
        this.id = id;
        this.name = name;
        this.baseCost = baseCost;
        this.baseProduction = baseProduction;
        this.icon = icon;
        this.description = description;
        this.count = 0;
        this.productionMultiplier = 1;
    }

    getCost() {
        return Math.floor(this.baseCost * Math.pow(1.15, this.count));
    }

    getProduction() {
        return this.baseProduction * this.count * this.productionMultiplier;
    }

    buy() {
        this.count++;
    }

    applyUpgrade(multiplier) {
        this.productionMultiplier *= multiplier;
    }
}

// UPGRADE CLASS
class Upgrade {
    constructor(id, name, cost, icon, description, effect, requirement) {
        this.id = id;
        this.name = name;
        this.cost = cost;
        this.icon = icon;
        this.description = description;
        this.effect = effect;
        this.requirement = requirement;
        this.purchased = false;
    }

    isAvailable(gameState) {
        if (this.purchased) return false;
        return this.requirement(gameState);
    }

    purchase(gameState) {
        if (!this.isAvailable(gameState)) return false;
        if (gameState.spendCookies(this.cost)) {
            this.purchased = true;
            this.effect(gameState);
            return true;
        }
        return false;
    }
}

// THEME CLASS
class Theme {
    constructor(id, name, icon, requirement, colors) {
        this.id = id;
        this.name = name;
        this.icon = icon;
        this.requirement = requirement;
        this.colors = colors;
    }

    isUnlocked(gameState) {
        return this.requirement(gameState);
    }

    apply() {
        document.body.className = `bg-gradient-to-br ${this.colors.background} min-h-screen theme-${this.id}`;
    }
}

// SPECIAL EVENT CLASS
class SpecialEvent {
    constructor(id, title, description, duration, effect, icon) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.duration = duration;
        this.effect = effect;
        this.icon = icon;
        this.startTime = null;
        this.active = false;
    }

    start(gameState) {
        this.active = true;
        this.startTime = Date.now();
        this.effect.start(gameState);
    }

    end(gameState) {
        this.active = false;
        this.effect.end(gameState);
    }

    getRemainingTime() {
        if (!this.active) return 0;
        const elapsed = Date.now() - this.startTime;
        return Math.max(0, this.duration - elapsed);
    }
}

// GAME MANAGER CLASS
class GameManager {
    constructor() {
        this.state = new GameState();
        this.buildings = this.initializeBuildings();
        this.upgrades = this.initializeUpgrades();
        this.themes = this.initializeThemes();
        this.events = this.initializeEvents();
        this.ui = new UIManager(this);
        
        // Load saved game
        if (this.state.load()) {
            this.loadBuildingsFromState();
            this.loadUpgradesFromState();
        }
        
        this.startGameLoop();
        this.startEventSystem();
    }

    initializeBuildings() {
        return [
            new Building('cursor', 'Cursor', 15, 0.1, 'fa-hand-pointer', 'Automatische klik'),
            new Building('grandma', 'Oma', 100, 1, 'fa-person-cane', 'Een vriendelijke oma die cookies bakt'),
            new Building('farm', 'Boerderij', 1100, 8, 'fa-tractor', 'Groeit cookie planten'),
            new Building('mine', 'Mijn', 12000, 47, 'fa-gem', 'Delft cookie erts'),
            new Building('factory', 'Fabriek', 130000, 260, 'fa-industry', 'Massaproductie van cookies'),
            new Building('bank', 'Bank', 1400000, 1400, 'fa-building-columns', 'Investeert in cookies'),
            new Building('temple', 'Tempel', 20000000, 7800, 'fa-place-of-worship', 'Cookie offers aan de goden'),
            new Building('wizard', 'Tovenaar', 330000000, 44000, 'fa-hat-wizard', 'Tovert cookies uit het niets'),
            new Building('spaceship', 'Ruimteschip', 5100000000, 260000, 'fa-rocket', 'Haalt cookies uit de ruimte'),
            new Building('portal', 'Portaal', 75000000000, 1600000, 'fa-portal', 'Verbindt met cookie dimensies')
        ];
    }

    initializeUpgrades() {
        return [
            new Upgrade(
                'click1',
                'Versterkte Vingers',
                100,
                'fa-hand-fist',
                'Klik kracht +1',
                (state) => { state.clickPower += 1; },
                (state) => state.totalClicks >= 100
            ),
            new Upgrade(
                'click2',
                'Titanium Muisknoppen',
                500,
                'fa-computer-mouse',
                'Klik kracht +2',
                (state) => { state.clickPower += 2; },
                (state) => state.totalClicks >= 1000
            ),
            new Upgrade(
                'cursor1',
                'Dubbele Cursors',
                1000,
                'fa-arrows-split-up-and-left',
                'Cursor productie x2',
                (state) => { 
                    const building = game.buildings.find(b => b.id === 'cursor');
                    if (building) building.applyUpgrade(2);
                },
                (state) => (state.buildings.cursor || 0) >= 10
            ),
            new Upgrade(
                'grandma1',
                'Oma\'s Geheim Recept',
                5000,
                'fa-book',
                'Oma productie x2',
                (state) => {
                    const building = game.buildings.find(b => b.id === 'grandma');
                    if (building) building.applyUpgrade(2);
                },
                (state) => (state.buildings.grandma || 0) >= 10
            ),
            new Upgrade(
                'farm1',
                'Genetisch Gemodificeerde Cookies',
                55000,
                'fa-dna',
                'Boerderij productie x2',
                (state) => {
                    const building = game.buildings.find(b => b.id === 'farm');
                    if (building) building.applyUpgrade(2);
                },
                (state) => (state.buildings.farm || 0) >= 10
            ),
            new Upgrade(
                'global1',
                'Cookie Imperium',
                500000,
                'fa-crown',
                'Alle productie x1.5',
                (state) => {
                    game.buildings.forEach(b => b.applyUpgrade(1.5));
                },
                (state) => state.totalCookiesEarned >= 1000000
            ),
            new Upgrade(
                'click3',
                'Mega Klik',
                50000,
                'fa-burst',
                'Klik kracht +5',
                (state) => { state.clickPower += 5; },
                (state) => state.totalClicks >= 5000
            ),
            new Upgrade(
                'factory1',
                'Industriële Revolutie',
                650000,
                'fa-gears',
                'Fabriek productie x2',
                (state) => {
                    const building = game.buildings.find(b => b.id === 'factory');
                    if (building) building.applyUpgrade(2);
                },
                (state) => (state.buildings.factory || 0) >= 10
            )
        ];
    }

    initializeThemes() {
        return [
            new Theme(
                'default',
                'Klassiek',
                'fa-cookie',
                () => true,
                { background: 'from-amber-50 to-orange-100' }
            ),
            new Theme(
                'dark',
                'Donker',
                'fa-moon',
                (state) => state.totalCookiesEarned >= 1000,
                { background: 'from-gray-800 to-gray-900' }
            ),
            new Theme(
                'pink',
                'Roze Droom',
                'fa-heart',
                (state) => state.totalCookiesEarned >= 10000,
                { background: 'from-pink-200 to-pink-300' }
            ),
            new Theme(
                'blue',
                'Ocean Breeze',
                'fa-water',
                (state) => state.totalCookiesEarned >= 50000,
                { background: 'from-blue-200 to-blue-300' }
            ),
            new Theme(
                'green',
                'Natuur',
                'fa-leaf',
                (state) => state.totalCookiesEarned >= 100000,
                { background: 'from-green-200 to-green-300' }
            ),
            new Theme(
                'purple',
                'Mystiek',
                'fa-wand-magic-sparkles',
                (state) => state.totalCookiesEarned >= 500000,
                { background: 'from-purple-200 to-purple-300' }
            )
        ];
    }

    initializeEvents() {
        return [
            new SpecialEvent(
                'goldenCookie',
                'Gouden Cookie!',
                'Klik kracht x7 voor 30 seconden',
                30000,
                {
                    start: (state) => { 
                        state.clickPower *= 7;
                    },
                    end: (state) => {
                        state.clickPower /= 7;
                    }
                },
                'fa-star'
            ),
            new SpecialEvent(
                'frenzy',
                'Cookie Frenzy!',
                'Alle productie x3 voor 60 seconden',
                60000,
                {
                    start: (state) => {
                        game.buildings.forEach(b => b.applyUpgrade(3));
                    },
                    end: (state) => {
                        game.buildings.forEach(b => b.productionMultiplier /= 3);
                    }
                },
                'fa-fire'
            ),
            new SpecialEvent(
                'lucky',
                'Gelukscookie!',
                'Ontvang 10% van je totale cookies',
                1000,
                {
                    start: (state) => {
                        const bonus = Math.floor(state.cookies * 0.1);
                        state.addCookies(bonus);
                    },
                    end: () => {}
                },
                'fa-clover'
            )
        ];
    }

    loadBuildingsFromState() {
        for (let building of this.buildings) {
            if (this.state.buildings[building.id]) {
                building.count = this.state.buildings[building.id].count || 0;
                building.productionMultiplier = this.state.buildings[building.id].multiplier || 1;
            }
        }
    }

    loadUpgradesFromState() {
        for (let upgrade of this.upgrades) {
            if (this.state.upgrades[upgrade.id]) {
                upgrade.purchased = true;
            }
        }
    }

    clickCookie(x, y) {
        this.state.addCookies(this.state.clickPower);
        this.state.totalClicks++;
        this.ui.showClickEffect(x, y, this.state.clickPower);
        this.updateDisplay();
    }

    buyBuilding(buildingId) {
        const building = this.buildings.find(b => b.id === buildingId);
        if (!building) return false;

        const cost = building.getCost();
        if (this.state.spendCookies(cost)) {
            building.buy();
            this.state.buildings[buildingId] = {
                count: building.count,
                multiplier: building.productionMultiplier
            };
            this.calculateCPS();
            this.updateDisplay();
            this.state.save();
            return true;
        }
        return false;
    }

    buyUpgrade(upgradeId) {
        const upgrade = this.upgrades.find(u => u.id === upgradeId);
        if (!upgrade) return false;

        if (upgrade.purchase(this.state)) {
            this.state.upgrades[upgradeId] = true;
            this.calculateCPS();
            this.updateDisplay();
            this.state.save();
            return true;
        }
        return false;
    }

    calculateCPS() {
        let total = 0;
        for (let building of this.buildings) {
            total += building.getProduction();
        }
        this.state.cookiesPerSecond = total;
    }

    changeTheme(themeId) {
        const theme = this.themes.find(t => t.id === themeId);
        if (!theme) return;

        if (!this.state.unlockedThemes.includes(themeId)) {
            if (theme.isUnlocked(this.state)) {
                this.state.unlockedThemes.push(themeId);
            } else {
                return;
            }
        }

        this.state.currentTheme = themeId;
        theme.apply();
        this.state.save();
    }

    triggerRandomEvent() {
        if (this.state.activeEvent) return;

        const event = this.events[Math.floor(Math.random() * this.events.length)];
        event.start(this.state);
        this.state.activeEvent = event;
        this.ui.showEvent(event);

        setTimeout(() => {
            event.end(this.state);
            this.state.activeEvent = null;
            this.ui.hideEvent();
            this.calculateCPS();
        }, event.duration);
    }

    startGameLoop() {
        setInterval(() => {
            // Add cookies from production
            const cps = this.state.cookiesPerSecond / 10; // Divided by 10 because we run 10 times per second
            this.state.addCookies(cps);
            
            this.updateDisplay();
            
            // Auto-save every 10 seconds
            if (Date.now() % 10000 < 100) {
                this.state.save();
            }
        }, 100);
    }

    startEventSystem() {
        setInterval(() => {
            // 5% chance every 30 seconds to trigger an event
            if (Math.random() < 0.05 && this.state.totalCookiesEarned > 100) {
                this.triggerRandomEvent();
            }
        }, 30000);
    }

    updateDisplay() {
        this.ui.updateCookieCount();
        this.ui.updateCPS();
        this.ui.updateClickPower();
        this.ui.updateShop();
        this.ui.updateUpgrades();
        this.ui.updateOwned();
    }

    getStats() {
        const playTime = Math.floor((Date.now() - this.state.startTime) / 1000);
        const hours = Math.floor(playTime / 3600);
        const minutes = Math.floor((playTime % 3600) / 60);
        const seconds = playTime % 60;

        return {
            'Totaal Cookies Verdiend': this.formatNumber(this.state.totalCookiesEarned),
            'Huidige Cookies': this.formatNumber(this.state.cookies),
            'Cookies per Seconde': this.formatNumber(this.state.cookiesPerSecond),
            'Totaal Aantal Kliks': this.formatNumber(this.state.totalClicks),
            'Klik Kracht': this.formatNumber(this.state.clickPower),
            'Speeltijd': `${hours}u ${minutes}m ${seconds}s`,
            'Gebouwen Gekocht': Object.values(this.state.buildings).reduce((sum, b) => sum + (b.count || 0), 0),
            'Upgrades Gekocht': Object.keys(this.state.upgrades).length
        };
    }

    formatNumber(num) {
        if (num >= 1e12) return (num / 1e12).toFixed(2) + ' T';
        if (num >= 1e9) return (num / 1e9).toFixed(2) + ' B';
        if (num >= 1e6) return (num / 1e6).toFixed(2) + ' M';
        if (num >= 1e3) return (num / 1e3).toFixed(2) + ' K';
        return Math.floor(num).toString();
    }
}

// UI MANAGER CLASS
class UIManager {
    constructor(gameManager) {
        this.game = gameManager;
        this.initializeEventListeners();
        this.renderShop();
        this.renderUpgrades();
        this.renderThemes();
        
        // Apply saved theme
        const theme = this.game.themes.find(t => t.id === this.game.state.currentTheme);
        if (theme) theme.apply();
    }

    initializeEventListeners() {
        // Cookie click
        document.getElementById('cookieBtn').addEventListener('click', (e) => {
            this.game.clickCookie(e.clientX, e.clientY);
        });

        // Tab switching
        document.getElementById('tabAutoclickers').addEventListener('click', () => {
            this.switchTab('autoclickers');
        });

        document.getElementById('tabUpgrades').addEventListener('click', () => {
            this.switchTab('upgrades');
        });

        // Theme button
        document.getElementById('themeBtn').addEventListener('click', () => {
            document.getElementById('themeModal').classList.remove('hidden');
        });

        // Stats button
        document.getElementById('statsBtn').addEventListener('click', () => {
            this.showStats();
            document.getElementById('statsModal').classList.remove('hidden');
        });

        // Reset button
        document.getElementById('resetBtn').addEventListener('click', () => {
            if (confirm('Weet je zeker dat je het spel wilt resetten? Alle voortgang gaat verloren!')) {
                this.game.state.reset();
            }
        });

        // Close modals
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.target.closest('.modal').classList.add('hidden');
            });
        });

        // Close modal on background click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.add('hidden');
                }
            });
        });
    }

    switchTab(tabName) {
        // Remove active class from all tabs
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active');
        });

        // Hide all tab contents
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.add('hidden');
        });

        // Activate selected tab
        if (tabName === 'autoclickers') {
            document.getElementById('tabAutoclickers').classList.add('active');
            document.getElementById('contentAutoclickers').classList.remove('hidden');
        } else if (tabName === 'upgrades') {
            document.getElementById('tabUpgrades').classList.add('active');
            document.getElementById('contentUpgrades').classList.remove('hidden');
        }
    }

    showClickEffect(x, y, amount) {
        const effect = document.createElement('div');
        effect.className = 'click-effect';
        effect.textContent = '+' + this.game.formatNumber(amount);
        effect.style.left = x + 'px';
        effect.style.top = y + 'px';
        document.getElementById('clickEffects').appendChild(effect);

        setTimeout(() => effect.remove(), 1000);
    }

    updateCookieCount() {
        document.getElementById('cookieCount').textContent = this.game.formatNumber(this.game.state.cookies);
    }

    updateCPS() {
        document.getElementById('cookiesPerSecond').textContent = this.game.formatNumber(this.game.state.cookiesPerSecond);
    }

    updateClickPower() {
        document.getElementById('clickPower').textContent = this.game.formatNumber(this.game.state.clickPower);
    }

    renderShop() {
        const container = document.getElementById('shopContainer');
        container.innerHTML = '';

        for (let building of this.game.buildings) {
            const item = document.createElement('div');
            const cost = building.getCost();
            const canAfford = this.game.state.cookies >= cost;
            
            item.className = `shop-item ${!canAfford ? 'disabled' : ''}`;
            item.innerHTML = `
                <div class="flex items-start gap-3">
                    <div class="shop-item-icon">
                        <i class="fas ${building.icon}"></i>
                    </div>
                    <div class="flex-1">
                        <div class="shop-item-name">${building.name}</div>
                        <div class="shop-item-cost">
                            <i class="fas fa-cookie-bite"></i> ${this.game.formatNumber(cost)}
                        </div>
                        <div class="shop-item-production">
                            <i class="fas fa-arrow-up"></i> ${this.game.formatNumber(building.baseProduction)}/s
                        </div>
                        <div class="text-xs text-gray-600 mt-1">${building.description}</div>
                    </div>
                </div>
            `;

            if (canAfford) {
                item.addEventListener('click', () => {
                    this.game.buyBuilding(building.id);
                });
            }

            container.appendChild(item);
        }
    }

    renderUpgrades() {
        const container = document.getElementById('upgradesContainer');
        container.innerHTML = '';

        for (let upgrade of this.game.upgrades) {
            const item = document.createElement('div');
            const canAfford = this.game.state.cookies >= upgrade.cost;
            const isAvailable = upgrade.isAvailable(this.game.state);
            const isLocked = !isAvailable && !upgrade.purchased;
            
            item.className = `upgrade-item ${upgrade.purchased ? 'purchased' : (isLocked || !canAfford ? 'disabled' : '')}`;
            
            let statusText = '';
            if (upgrade.purchased) {
                statusText = '<div class="text-xs text-green-600 mt-1 font-bold">✓ Gekocht</div>';
            } else {
                statusText = `<div class="text-xs ${isLocked ? 'text-gray-500' : 'text-gray-600'} mt-1">
                    <i class="fas fa-cookie-bite"></i> ${this.game.formatNumber(upgrade.cost)}
                </div>`;
                if (isLocked) {
                    statusText += `<div class="text-xs text-red-600 mt-1 font-semibold">🔒 ${this.getUpgradeRequirement(upgrade)}</div>`;
                } else if (!canAfford) {
                    statusText += '<div class="text-xs text-orange-600 mt-1">💰 Te duur</div>';
                } else {
                    statusText += '<div class="text-xs text-green-600 mt-1">✓ Klik om te kopen</div>';
                }
            }
            
            item.innerHTML = `
                <div class="upgrade-icon">
                    <i class="fas ${upgrade.icon}"></i>
                </div>
                <div class="text-xs font-semibold text-gray-700">${upgrade.name}</div>
                <div class="text-xs text-gray-500 mt-1">${upgrade.description}</div>
                ${statusText}
            `;

            if (!upgrade.purchased && canAfford && isAvailable) {
                item.addEventListener('click', () => {
                    this.game.buyUpgrade(upgrade.id);
                });
            }

            container.appendChild(item);
        }
    }

    getUpgradeRequirement(upgrade) {
        // Return human-readable requirement text
        if (upgrade.id === 'click1') return '100 kliks';
        if (upgrade.id === 'click2') return '1000 kliks';
        if (upgrade.id === 'click3') return '5000 kliks';
        if (upgrade.id === 'cursor1') return '10 Cursors';
        if (upgrade.id === 'grandma1') return '10 Oma\'s';
        if (upgrade.id === 'farm1') return '10 Boerderijen';
        if (upgrade.id === 'factory1') return '10 Fabrieken';
        if (upgrade.id === 'global1') return '1M totale cookies';
        return 'Onbekend';
    }

    updateShop() {
        this.renderShop();
    }

    updateUpgrades() {
        this.renderUpgrades();
    }

    updateOwned() {
        const container = document.getElementById('ownedContainer');
        container.innerHTML = '';

        let hasBuildings = false;
        for (let building of this.game.buildings) {
            if (building.count > 0) {
                hasBuildings = true;
                const item = document.createElement('div');
                item.className = 'owned-item';
                item.innerHTML = `
                    <div class="owned-item-name">
                        <i class="fas ${building.icon}"></i> ${building.name}
                    </div>
                    <div class="owned-item-count">${building.count}</div>
                `;
                container.appendChild(item);
            }
        }

        if (!hasBuildings) {
            container.innerHTML = '<div class="text-center text-gray-500 text-sm py-4">Nog geen gebouwen gekocht</div>';
        }
    }

    renderThemes() {
        const container = document.getElementById('themesContainer');
        container.innerHTML = '';

        console.log('Total Cookies Earned:', this.game.state.totalCookiesEarned);
        console.log('Current Cookies:', this.game.state.cookies);

        for (let theme of this.game.themes) {
            // Check if theme meets requirements and auto-unlock it
            let isUnlocked = this.game.state.unlockedThemes.includes(theme.id);
            const meetsRequirement = theme.isUnlocked(this.game.state);
            console.log(`Theme ${theme.id}: unlocked=${isUnlocked}, meetsRequirement=${meetsRequirement}`);
            
            if (!isUnlocked && meetsRequirement) {
                console.log(`Unlocking theme: ${theme.id}`);
                this.game.state.unlockedThemes.push(theme.id);
                isUnlocked = true;
                this.game.state.save();
            }
            
            const isActive = this.game.state.currentTheme === theme.id;
            
            const card = document.createElement('div');
            card.className = `theme-card ${isActive ? 'active' : ''} ${!isUnlocked ? 'locked' : ''}`;
            
            let requirementText = '';
            if (!isUnlocked) {
                if (theme.id === 'dark') requirementText = 'Vereist: 1K totale cookies';
                else if (theme.id === 'pink') requirementText = 'Vereist: 10K totale cookies';
                else if (theme.id === 'blue') requirementText = 'Vereist: 50K totale cookies';
                else if (theme.id === 'green') requirementText = 'Vereist: 100K totale cookies';
                else if (theme.id === 'purple') requirementText = 'Vereist: 500K totale cookies';
            }

            card.innerHTML = `
                <div class="theme-icon">
                    <i class="fas ${theme.icon}"></i>
                </div>
                <div class="theme-name">${theme.name}</div>
                ${!isUnlocked ? `<div class="theme-requirement">🔒 ${requirementText}</div>` : 
                  (isActive ? '<div class="text-blue-600 font-semibold text-sm">✓ Actief</div>' : '')}
            `;

            if (isUnlocked) {
                card.addEventListener('click', () => {
                    this.game.changeTheme(theme.id);
                    this.renderThemes();
                });
            }

            container.appendChild(card);
        }
    }

    showStats() {
        const container = document.getElementById('statsContent');
        const stats = this.game.getStats();
        
        container.innerHTML = '';
        for (let [label, value] of Object.entries(stats)) {
            const item = document.createElement('div');
            item.className = 'stat-item';
            item.innerHTML = `
                <div class="stat-label">${label}</div>
                <div class="stat-value">${value}</div>
            `;
            container.appendChild(item);
        }
    }

    showEvent(event) {
        const banner = document.getElementById('eventBanner');
        const title = document.getElementById('eventTitle');
        const description = document.getElementById('eventDescription');
        const timer = document.getElementById('eventTimer');

        title.textContent = event.title;
        description.textContent = event.description;
        banner.classList.remove('hidden');

        const updateTimer = setInterval(() => {
            const remaining = event.getRemainingTime();
            if (remaining <= 0) {
                clearInterval(updateTimer);
                return;
            }
            const seconds = Math.ceil(remaining / 1000);
            timer.textContent = `${seconds}s`;
        }, 100);
    }

    hideEvent() {
        document.getElementById('eventBanner').classList.add('hidden');
    }
}

// Initialize game
let game;
window.addEventListener('DOMContentLoaded', () => {
    game = new GameManager();
});
