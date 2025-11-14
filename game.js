// Object-Oriented Cookie Clicker Game

// AutoClicker Class
class AutoClicker {
    constructor(id, name, description, baseCost, baseCps, icon) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.baseCost = baseCost;
        this.baseCps = baseCps;
        this.icon = icon;
        this.count = 0;
    }

    getCost() {
        return Math.floor(this.baseCost * Math.pow(1.15, this.count));
    }

    getCurrentCps() {
        return this.baseCps * this.count;
    }

    buy() {
        const cost = this.getCost();
        if (game.cookies >= cost) {
            game.cookies -= cost;
            this.count++;
            game.updateCookiesPerSecond();
            game.ui.updateAutoClickerUI(this);
            game.ui.updateShopButtons();
            game.ui.showNotification(`${this.name} purchased!`);
            game.storage.saveGameState();
            return true;
        }
        return false;
    }

    toJSON() {
        return {
            id: this.id,
            count: this.count,
            baseCost: this.baseCost,
            baseCps: this.baseCps
        };
    }
}

// Upgrade Class
class Upgrade {
    constructor(id, name, description, cost, icon, effect, requirement = null) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.cost = cost;
        this.icon = icon;
        this.effect = effect;
        this.requirement = requirement;
        this.owned = false;
    }

    canBuy() {
        return !this.owned && 
               game.cookies >= this.cost && 
               (!this.requirement || this.requirement());
    }

    buy() {
        if (this.canBuy()) {
            game.cookies -= this.cost;
            this.owned = true;
            
            if (this.effect) {
                this.effect();
            }
            
            game.ui.updateUpgradeUI(this);
            game.ui.updateShopButtons();
            game.ui.showNotification(`${this.name} purchased!`);
            game.storage.saveGameState();
            return true;
        }
        return false;
    }

    toJSON() {
        return {
            id: this.id,
            owned: this.owned
        };
    }
}

// Achievement Class
class Achievement {
    constructor(id, name, description, icon, requirement, reward) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.icon = icon;
        this.requirement = requirement;
        this.reward = reward;
        this.unlocked = false;
    }

    check() {
        if (!this.unlocked && this.requirement()) {
            this.unlocked = true;
            game.ui.showEvent(
                'Achievement Unlocked!', 
                `${this.name}: ${this.description}<br>Reward: ${this.reward}`
            );
            return true;
        }
        return false;
    }
}

// UI Management Class
class UI {
    constructor() {
        this.scoreElement = null;
        this.cpsElement = null;
        this.cookieButton = null;
    }

    init() {
        this.scoreElement = document.getElementById('score');
        this.cpsElement = document.getElementById('cps');
        this.cookieButton = document.getElementById('cookie');
        
        this.initThemeSwitcher();
        this.initTooltips();
        this.setupEventListeners();
    }

    showNotification(message, duration = 3000) {
        const notification = document.getElementById('notification');
        if (!notification) return;
        
        notification.textContent = message;
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, duration);
    }

    showEvent(title, message, duration = 5000) {
        const eventNotification = document.getElementById('event-notification');
        if (!eventNotification) return;
        
        eventNotification.innerHTML = `<strong>${title}</strong><br>${message}`;
        eventNotification.classList.add('show');
        
        setTimeout(() => {
            eventNotification.classList.remove('show');
        }, duration);
    }

    initThemeSwitcher() {
        const themeSwitch = document.createElement('button');
        themeSwitch.className = 'theme-switch';
        themeSwitch.innerHTML = '<span class="material-icons">palette</span>';
        themeSwitch.title = 'Cycle themes';
        document.body.appendChild(themeSwitch);
        
        const themes = [
            { id: 'light', name: 'Light', icon: 'light_mode' },
            { id: 'dark', name: 'Dark', icon: 'dark_mode' },
            { id: 'ocean', name: 'Ocean', icon: 'water_drop' },
            { id: 'forest', name: 'Forest', icon: 'park' },
            { id: 'sunset', name: 'Sunset', icon: 'wb_sunny' },
            { id: 'thunder', name: 'Thunder', icon: 'flash_on' }
        ];
        
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        let currentThemeIndex = themes.findIndex(theme => theme.id === savedTheme);
        if (currentThemeIndex === -1) currentThemeIndex = 0;
        
        themeSwitch.addEventListener('click', () => {
            currentThemeIndex = (currentThemeIndex + 1) % themes.length;
            const newTheme = themes[currentThemeIndex];
            
            document.documentElement.setAttribute('data-theme', newTheme.id);
            localStorage.setItem('theme', newTheme.id);
            
            const icon = themeSwitch.querySelector('.material-icons');
            icon.textContent = newTheme.icon;
            
            this.showNotification(`Switched to ${newTheme.name} theme`);
        });
        
        const currentTheme = themes[currentThemeIndex];
        const icon = themeSwitch.querySelector('.material-icons');
        icon.textContent = currentTheme.icon;
    }

    initTooltips() {
        const tooltips = document.querySelectorAll('.tooltip');
        tooltips.forEach(tooltip => {
            tooltip.addEventListener('mouseenter', this.showTooltip);
            tooltip.addEventListener('mouseleave', this.hideTooltip);
        });
    }

    initTabs() {
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabPanels = document.querySelectorAll('.tab-panel');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.dataset.tab;

                // Remove active class from all buttons and panels
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabPanels.forEach(panel => panel.classList.remove('active'));

                // Add active class to clicked button and corresponding panel
                button.classList.add('active');
                const targetPanel = document.getElementById(`${targetTab}-tab`);
                if (targetPanel) {
                    targetPanel.classList.add('active');
                }
            });
        });
    }

    showTooltip() {
        const tooltip = this.querySelector('.tooltiptext');
        if (tooltip) {
            tooltip.style.visibility = 'visible';
            tooltip.style.opacity = '1';
        }
    }

    hideTooltip() {
        const tooltip = this.querySelector('.tooltiptext');
        if (tooltip) {
            tooltip.style.visibility = 'hidden';
            tooltip.style.opacity = '0';
        }
    }

    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    updateAutoClickerUI(autoClicker) {
        const element = document.getElementById(`auto-clicker-${autoClicker.id}`);
        if (!element) return;
        
        const cost = autoClicker.getCost();
        const cps = autoClicker.getCurrentCps().toFixed(1);
        
        element.querySelector('.item-owned').textContent = `${autoClicker.count} owned`;
        element.querySelector('.item-cps').textContent = `${cps} per second`;
        
        const button = element.querySelector('.buy-auto-clicker');
        button.textContent = `Buy (${cost})`;
        button.dataset.cost = cost;
    }

    updateUpgradeUI(upgrade) {
        const element = document.getElementById(`upgrade-${upgrade.id}`);
        if (!element) return;
        
        element.classList.add('owned');
        const button = element.querySelector('.buy-upgrade');
        if (button) {
            button.textContent = 'Purchased';
            button.disabled = true;
        }
    }

    updateShopButtons() {
        document.querySelectorAll('.buy-auto-clicker').forEach(button => {
            const cost = parseFloat(button.dataset.cost);
            button.disabled = game.cookies < cost;
        });

        document.querySelectorAll('.buy-upgrade:not(:disabled)').forEach(button => {
            const cost = parseFloat(button.dataset.cost);
            button.disabled = game.cookies < cost;
        });
    }

    updateStatistics() {
        const totalCookiesEl = document.getElementById('total-cookies');
        const totalCpsEl = document.getElementById('total-cps');
        const totalClicksEl = document.getElementById('total-clicks');
        const autoclickersOwnedEl = document.getElementById('autoclickers-owned');
        const upgradesOwnedEl = document.getElementById('upgrades-owned');
        
        if (totalCookiesEl) totalCookiesEl.textContent = Math.floor(game.totalCookiesEarned).toLocaleString();
        if (totalCpsEl) totalCpsEl.textContent = game.cookiesPerSecond.toFixed(1);
        if (totalClicksEl) totalClicksEl.textContent = game.totalClicks.toLocaleString();
        if (autoclickersOwnedEl) {
            const totalAutoclickers = game.autoClickers.reduce((total, ac) => total + ac.count, 0);
            autoclickersOwnedEl.textContent = totalAutoclickers;
        }
        if (upgradesOwnedEl) {
            const totalUpgrades = game.upgrades.filter(upgrade => upgrade.owned).length;
            upgradesOwnedEl.textContent = totalUpgrades;
        }
    }

    createAutoClickerElement(autoClicker) {
        const element = document.createElement('div');
        element.className = 'shop-item';
        element.id = `auto-clicker-${autoClicker.id}`;
        
        const cost = autoClicker.getCost();
        const cps = autoClicker.getCurrentCps().toFixed(1);
        
        element.innerHTML = `
            <div class="item-info">
                <div class="item-name">
                    <span class="material-icons">${autoClicker.icon}</span>
                    ${autoClicker.name}
                </div>
                <div class="item-description">${autoClicker.description}</div>
                <div class="item-stats">
                    <span class="item-owned">${autoClicker.count} owned</span>
                    <span class="item-cps">${cps} per second</span>
                </div>
            </div>
            <button class="buy-button buy-auto-clicker" data-id="${autoClicker.id}" data-cost="${cost}">
                Buy (${cost})
            </button>
        `;
        
        const button = element.querySelector('.buy-auto-clicker');
        button.addEventListener('click', () => autoClicker.buy());
        
        return element;
    }

    createUpgradeElement(upgrade) {
        const element = document.createElement('div');
        element.className = `shop-item ${upgrade.owned ? 'owned' : ''}`;
        element.id = `upgrade-${upgrade.id}`;
        
        element.innerHTML = `
            <div class="item-info">
                <div class="item-name">
                    <span class="material-icons">${upgrade.icon}</span>
                    ${upgrade.name}
                </div>
                <div class="item-description">${upgrade.description}</div>
            </div>
            <button class="buy-button buy-upgrade" data-id="${upgrade.id}" data-cost="${upgrade.cost}">
                ${upgrade.owned ? 'Purchased' : `Buy (${upgrade.cost})`}
            </button>
        `;
        
        if (!upgrade.owned) {
            const button = element.querySelector('.buy-upgrade');
            button.addEventListener('click', () => upgrade.buy());
        }
        
        return element;
    }

    showClickEffect() {
        this.cookieButton.classList.add('pulse');
        setTimeout(() => this.cookieButton.classList.remove('pulse'), 200);
    }

    addClickEffect(amount) {
        if (amount >= 1) {
            const effect = document.createElement('div');
            effect.className = 'click-effect';
            effect.textContent = `+${Math.floor(amount)}`;
            effect.style.left = `${Math.random() * 60 + 20}%`;
            effect.style.top = `${Math.random() * 60 + 20}%`;
            this.cookieButton.appendChild(effect);
            setTimeout(() => effect.remove(), 1000);
        }
    }

    setupEventListeners() {
        // Cookie click
        this.cookieButton.addEventListener('click', () => {
            game.clickCookie();
        });

        // Keyboard shortcut (spacebar)
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && e.target === document.body) {
                e.preventDefault();
                this.cookieButton.click();
            }
        });

        // Save before page unload
        window.addEventListener('beforeunload', () => game.storage.saveGameState());
    }

    render() {
        // Update score display
        this.scoreElement.textContent = Math.floor(game.cookies).toLocaleString();
        this.cpsElement.textContent = game.cookiesPerSecond.toFixed(1);

        // Update statistics
        this.updateStatistics();
        
        // Update button states
        this.updateShopButtons();
    }

// Storage Management Class
class Storage {
    constructor() {
        this.saveInterval = 10000; // 10 seconds
    }

    saveGameState() {
        const gameState = {
            cookies: game.cookies,
            cookiesPerSecond: game.cookiesPerSecond,
            cookiesPerClick: game.cookiesPerClick,
            clickMultiplier: game.clickMultiplier,
            totalClicks: game.totalClicks,
            totalCookiesEarned: game.totalCookiesEarned,
            achievements: game.achievements.filter(a => a.unlocked).map(a => a.id),
            autoClickers: game.autoClickers.map(ac => ac.toJSON()),
            upgrades: game.upgrades.map(upgrade => upgrade.toJSON()),
            version: game.version
        };

        localStorage.setItem('cookieClickerSave', JSON.stringify(gameState));
    }

    loadGameState() {
        try {
            const savedData = localStorage.getItem('cookieClickerSave');
            if (savedData) {
                const gameState = JSON.parse(savedData);
                
                game.cookies = gameState.cookies || 0;
                game.cookiesPerSecond = gameState.cookiesPerSecond || 0;
                game.cookiesPerClick = gameState.cookiesPerClick || 1;
                game.clickMultiplier = gameState.clickMultiplier || 1;
                game.totalClicks = gameState.totalClicks || 0;
                game.totalCookiesEarned = gameState.totalCookiesEarned || 0;
                
                // Load auto-clickers
                if (gameState.autoClickers) {
                    gameState.autoClickers.forEach(savedAc => {
                        const autoClicker = game.autoClickers.find(ac => ac.id === savedAc.id);
                        if (autoClicker) {
                            autoClicker.count = savedAc.count || 0;
                        }
                    });
                }
                
                // Load upgrades
                if (gameState.upgrades) {
                    gameState.upgrades.forEach(savedUpgrade => {
                        const upgrade = game.upgrades.find(u => u.id === savedUpgrade.id);
                        if (upgrade) {
                            upgrade.owned = savedUpgrade.owned || false;
                            if (upgrade.owned && upgrade.effect) {
                                upgrade.effect();
                            }
                        }
                    });
                }

                // Load achievements
                if (gameState.achievements) {
                    gameState.achievements.forEach(achievementId => {
                        const achievement = game.achievements.find(a => a.id === achievementId);
                        if (achievement) {
                            achievement.unlocked = true;
                        }
                    });
                }
                
                game.ui.showNotification('Game loaded!');
                return true;
            }
        } catch (e) {
            console.error('Error loading game:', e);
        }
        return false;
    }
}

// Main Game Class
class Game {
    constructor() {
        this.cookies = 0;
        this.cookiesPerSecond = 0;
        this.cookiesPerClick = 1;
        this.clickMultiplier = 1;
        this.totalClicks = 0;
        this.totalCookiesEarned = 0;
        this.version = '2.0.0';
        this.lastUpdate = Date.now();
        
        this.autoClickers = [];
        this.upgrades = [];
        this.achievements = [];
        
        this.ui = new UI();
        this.storage = new Storage();
        
        this.initializeGameData();
    }

    initializeGameData() {
        // Initialize auto-clickers
        const autoClickerData = [
            { id: 'cursor', name: 'Cursor', description: 'Automatically clicks for you', baseCost: 15, baseCps: 0.1, icon: 'mouse' },
            { id: 'grandma', name: 'Grandma', description: 'A nice grandma to bake more cookies', baseCost: 100, baseCps: 0.5, icon: 'elderly' },
            { id: 'farm', name: 'Farm', description: 'Grows cookie plants from cookie seeds', baseCost: 1100, baseCps: 4, icon: 'agriculture' },
            { id: 'mine', name: 'Mine', description: 'Mines out cookie dough and chocolate chips', baseCost: 12000, baseCps: 10, icon: 'terrain' },
            { id: 'factory', name: 'Factory', description: 'Produces cookies at an industrial scale', baseCost: 130000, baseCps: 40, icon: 'factory' },
            { id: 'bank', name: 'Bank', description: 'Generates cookies from interest', baseCost: 1400000, baseCps: 100, icon: 'account_balance' },
            { id: 'temple', name: 'Temple', description: 'Pray to the cookie gods', baseCost: 20000000, baseCps: 400, icon: 'temple_buddhist' },
            { id: 'wizard', name: 'Wizard', description: 'Magically summons cookies from another dimension', baseCost: 330000000, baseCps: 1000, icon: 'auto_awesome' }
        ];

        this.autoClickers = autoClickerData.map(data => 
            new AutoClicker(data.id, data.name, data.description, data.baseCost, data.baseCps, data.icon)
        );

        // Initialize upgrades
        this.upgrades = [
            new Upgrade('better_mouse', 'Better Mouse', 'Double your clicking power', 100, 'mouse', 
                () => { this.cookiesPerClick *= 2; }),
            new Upgrade('sharpened_fingers', 'Sharpened Fingers', 'Double your clicking power again', 500, 'touch_app', 
                () => { this.cookiesPerClick *= 2; }, 
                () => this.upgrades.some(u => u.id === 'better_mouse' && u.owned)),
            new Upgrade('reinforced_clicker', 'Reinforced Clicker', 'Double the production of all auto-clickers', 5000, 'build', 
                () => { this.autoClickers.forEach(ac => { ac.baseCps *= 2; }); }),
            new Upgrade('cookie_power', 'Cookie Power', 'Double the production of ALL cookies', 50000, 'bolt', 
                () => { 
                    this.cookiesPerClick *= 2; 
                    this.autoClickers.forEach(ac => { ac.baseCps *= 2; }); 
                }),
            new Upgrade('lucky_cookie', 'Lucky Cookie', 'Chance for critical hits that give 10x more cookies', 100000, 'casino', 
                () => {})
        ];

        // Initialize achievements
        this.achievements = [
            new Achievement('first_click', 'First Click', 'Click the cookie for the first time', 'mouse', 
                () => this.totalClicks >= 1, 'Unlock Ocean Theme'),
            new Achievement('hundred_clicks', 'Clicking Master', 'Click 100 times', 'touch_app', 
                () => this.totalClicks >= 100, 'Unlock Forest Theme'),
            new Achievement('thousand_cookies', 'Cookie Collector', 'Earn 1,000 cookies', 'cookie', 
                () => this.totalCookiesEarned >= 1000, 'Unlock Sunset Theme'),
            new Achievement('first_autoclicker', 'Automation', 'Buy your first auto-clicker', 'auto_awesome', 
                () => this.autoClickers.some(ac => ac.count > 0), 'Unlock Thunder Theme'),
            new Achievement('ten_autoclickers', 'Mass Production', 'Own 10 auto-clickers total', 'factory', 
                () => this.autoClickers.reduce((total, ac) => total + ac.count, 0) >= 10, 'Unlock Golden Cookie Skin'),
            new Achievement('all_upgrades', 'Perfectionist', 'Buy all upgrades', 'star', 
                () => this.upgrades.every(upgrade => upgrade.owned), 'Unlock Rainbow Cookie Skin')
        ];
    }

    clickCookie() {
        this.totalClicks++;
        const multiplier = this.checkCriticalHit();
        const amount = this.cookiesPerClick * this.clickMultiplier * multiplier;
        this.addCookies(amount);
        this.ui.showClickEffect();
    }

    addCookies(amount, showEffect = true) {
        this.cookies += amount;
        this.totalCookiesEarned += amount;
        
        if (showEffect) {
            this.ui.addClickEffect(amount);
        }
    }

    checkCriticalHit() {
        const luckyCookie = this.upgrades.find(u => u.id === 'lucky_cookie' && u.owned);
        if (luckyCookie && Math.random() < 0.1) {
            return 10;
        }
        return 1;
    }

    updateCookiesPerSecond() {
        this.cookiesPerSecond = this.autoClickers.reduce((total, ac) => {
            return total + ac.getCurrentCps();
        }, 0);
    }

    triggerRandomEvent() {
        const events = [
            {
                name: "Cookie Storm!",
                message: "A cookie storm! Get 2x cookies for 10 seconds!",
                duration: 10000,
                effect: () => { this.clickMultiplier *= 2; },
                revert: () => { this.clickMultiplier /= 2; }
            },
            {
                name: "Lucky Day",
                message: "It's your lucky day! Get a 100 cookie bonus!",
                effect: () => { this.addCookies(100); }
            },
            {
                name: "Productivity Boost",
                message: "Your auto-clickers are 50% more productive for 30 seconds!",
                duration: 30000,
                effect: () => { this.cookiesPerSecond *= 1.5; },
                revert: () => { this.cookiesPerSecond /= 1.5; }
            }
        ];

        const event = events[Math.floor(Math.random() * events.length)];
        this.ui.showEvent(event.name, event.message);
        
        if (event.effect) event.effect();
        
        if (event.duration && event.revert) {
            setTimeout(() => {
                event.revert();
                this.ui.showEvent(`${event.name} over`, "The event has ended.");
            }, event.duration);
        }
    }

    checkAchievements() {
        this.achievements.forEach(achievement => {
            achievement.check();
        });
    }

    update() {
        // Update cookies based on auto-clickers
        const now = Date.now();
        const deltaTime = (now - this.lastUpdate) / 1000;
        this.lastUpdate = now;

        if (deltaTime < 1) {
            const cookiesToAdd = this.cookiesPerSecond * deltaTime;
            if (cookiesToAdd > 0) {
                this.addCookies(cookiesToAdd, false);
            }
        }

        // Random events
        if (Math.random() < 0.0005) {
            this.triggerRandomEvent();
        }

        // Check achievements
        this.checkAchievements();
    }

    render() {
        this.ui.render();
    }

    gameLoop(timestamp) {
        this.update();
        this.render();
        requestAnimationFrame((ts) => this.gameLoop(ts));
    }

    resetGame() {
        if (confirm('Are you sure you want to reset your game? This will delete all your progress!')) {
            // Reset game state
            this.cookies = 0;
            this.cookiesPerSecond = 0;
            this.cookiesPerClick = 1;
            this.clickMultiplier = 1;
            this.totalClicks = 0;
            this.totalCookiesEarned = 0;
            
            // Reset auto-clickers
            this.autoClickers.forEach(autoClicker => {
                autoClicker.count = 0;
            });
            
            // Cookie selector functionality
            this.setupCookieSelector();

            // Reset upgrades
            this.upgrades.forEach(upgrade => {
                upgrade.owned = false;
            });
            
            // Clear saved game from localStorage
            localStorage.removeItem('cookieClickerSave');
            
            // Update UI
            this.updateCookiesPerSecond();
            this.ui.updateStatistics();
            this.ui.showNotification('Game has been reset!');
            
            // Re-render UI elements
            this.ui.updateShopButtons();
            this.ui.render();
        }
    }

    // Setup cookie selector functionality
    setupCookieSelector() {
        const cookieOptions = document.querySelectorAll('.cookie-option');
        const cookieImage = document.querySelector('.cookie-image');
        
        // Load saved cookie selection or use default
        const savedCookie = localStorage.getItem('selectedCookie') || 'cookie1';
        
        // Set initial cookie
        cookieOptions.forEach(option => {
            const cookieType = option.getAttribute('data-cookie');
            if (cookieType === savedCookie) {
                option.classList.add('active');
                if (cookieImage) {
                    cookieImage.src = `images/${cookieType}.png`;
                }
            }
            
            // Add click event for each cookie option
            option.addEventListener('click', () => {
                const cookieType = option.getAttribute('data-cookie');
                
                // Update active state
                cookieOptions.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
                
                // Change cookie image
                if (cookieImage) {
                    cookieImage.src = `images/${cookieType}.png`;
                }
                
                // Save selection to localStorage
                localStorage.setItem('selectedCookie', cookieType);
                
                // Show notification
                this.ui.showNotification(`Cookie skin changed to ${option.getAttribute('title')}!`);
            });
        });
    }

    init() {
        // Initialize UI
        this.ui.init();

        // Set up cookie selector
        this.setupCookieSelector();

        // Load saved game
        this.storage.loadGameState();
        this.updateCookiesPerSecond();

        // Set up auto-clickers UI
        const autoClickersContainer = document.getElementById('auto-clickers');
        this.autoClickers.forEach(ac => {
            autoClickersContainer.appendChild(this.ui.createAutoClickerElement(ac));
        });

        // Set up upgrades UI
        const upgradesContainer = document.getElementById('upgrades');
        this.upgrades.forEach(upgrade => {
            upgradesContainer.appendChild(this.ui.createUpgradeElement(upgrade));
        });

        // Initialize tabs after DOM elements are created
        this.ui.initTabs();

        // Add reset button event listener
        document.getElementById('reset-btn').addEventListener('click', () => this.resetGame());

        // Start game loop
        this.gameLoop();

        // Auto-save periodically
        setInterval(() => this.storage.saveGameState(), this.storage.saveInterval);

        // Show welcome message
        this.ui.showNotification('Welcome to Cookie Clicker OOP! Click the cookie to begin.');
    }
}

// Global game instance
let game;

// Start the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    game = new Game();
    game.init();
});
