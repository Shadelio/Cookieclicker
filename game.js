// Game state
let cookies = 0;
let cookiesPerSecond = 0;
let cookiesPerClick = 1;
let clickMultiplier = 1;
let autoClickers = [];
let upgrades = [];
let gameVersion = '1.0.0';
let totalClicks = 0;
let totalCookiesEarned = 0;
let achievements = [];

// DOM elements
let scoreElement;
let cpsElement;
let cookieButton;
let lastSave = Date.now();
const SAVE_INTERVAL = 10000; // 10 seconds

// Auto-clicker definitions
const AUTO_CLICKERS = [
    {
        id: 'cursor',
        name: 'Cursor',
        description: 'Automatically clicks for you',
        baseCost: 15,
        baseCps: 0.1,
        icon: 'mouse'
    },
    {
        id: 'grandma',
        name: 'Grandma',
        description: 'A nice grandma to bake more cookies',
        baseCost: 100,
        baseCps: 0.5,
        icon: 'elderly'
    },
    {
        id: 'farm',
        name: 'Farm',
        description: 'Grows cookie plants from cookie seeds',
        baseCost: 1100,
        baseCps: 4,
        icon: 'agriculture'
    },
    {
        id: 'mine',
        name: 'Mine',
        description: 'Mines out cookie dough and chocolate chips',
        baseCost: 12000,
        baseCps: 10,
        icon: 'terrain'
    },
    {
        id: 'factory',
        name: 'Factory',
        description: 'Produces cookies at an industrial scale',
        baseCost: 130000,
        baseCps: 40,
        icon: 'factory'
    },
    {
        id: 'bank',
        name: 'Bank',
        description: 'Generates cookies from interest',
        baseCost: 1400000,
        baseCps: 100,
        icon: 'account_balance'
    },
    {
        id: 'temple',
        name: 'Temple',
        description: 'Pray to the cookie gods',
        baseCost: 20000000,
        baseCps: 400,
        icon: 'temple_buddhist'
    },
    {
        id: 'wizard',
        name: 'Wizard',
        description: 'Magically summons cookies from another dimension',
        baseCost: 330000000,
        baseCps: 1000,
        icon: 'auto_awesome'
    }
];

// Upgrade definitions
const UPGRADES = [
    {
        id: 'better_mouse',
        name: 'Better Mouse',
        description: 'Double your clicking power',
        cost: 100,
        icon: 'mouse',
        effect: () => { cookiesPerClick *= 2; }
    },
    {
        id: 'sharpened_fingers',
        name: 'Sharpened Fingers',
        description: 'Double your clicking power again',
        cost: 500,
        icon: 'touch_app',
        effect: () => { cookiesPerClick *= 2; },
        requirement: () => upgrades.some(u => u.id === 'better_mouse' && u.owned)
    },
    {
        id: 'reinforced_clicker',
        name: 'Reinforced Clicker',
        description: 'Double the production of all auto-clickers',
        cost: 5000,
        icon: 'build',
        effect: () => {
            autoClickers.forEach(ac => {
                ac.baseCps *= 2;
            });
        }
    },
    {
        id: 'cookie_power',
        name: 'Cookie Power',
        description: 'Double the production of ALL cookies',
        cost: 50000,
        icon: 'bolt',
        effect: () => {
            cookiesPerClick *= 2;
            autoClickers.forEach(ac => {
                ac.baseCps *= 2;
            });
        }
    },
    {
        id: 'lucky_cookie',
        name: 'Lucky Cookie',
        description: 'Chance for critical hits that give 10x more cookies',
        cost: 100000,
        icon: 'casino',
        effect: () => {}
    }
];

// Achievement definitions
const ACHIEVEMENTS = [
    {
        id: 'first_click',
        name: 'First Click',
        description: 'Click the cookie for the first time',
        icon: 'mouse',
        requirement: () => totalClicks >= 1,
        reward: 'Unlock Ocean Theme'
    },
    {
        id: 'hundred_clicks',
        name: 'Clicking Master',
        description: 'Click 100 times',
        icon: 'touch_app',
        requirement: () => totalClicks >= 100,
        reward: 'Unlock Forest Theme'
    },
    {
        id: 'thousand_cookies',
        name: 'Cookie Collector',
        description: 'Earn 1,000 cookies',
        icon: 'cookie',
        requirement: () => totalCookiesEarned >= 1000,
        reward: 'Unlock Sunset Theme'
    },
    {
        id: 'first_autoclicker',
        name: 'Automation',
        description: 'Buy your first auto-clicker',
        icon: 'auto_awesome',
        requirement: () => autoClickers.some(ac => (ac.count || 0) > 0),
        reward: 'Unlock Thunder Theme'
    },
    {
        id: 'ten_autoclickers',
        name: 'Mass Production',
        description: 'Own 10 auto-clickers total',
        icon: 'factory',
        requirement: () => autoClickers.reduce((total, ac) => total + (ac.count || 0), 0) >= 10,
        reward: 'Unlock Golden Cookie Skin'
    },
    {
        id: 'all_upgrades',
        name: 'Perfectionist',
        description: 'Buy all upgrades',
        icon: 'star',
        requirement: () => upgrades.every(upgrade => upgrade.owned),
        reward: 'Unlock Rainbow Cookie Skin'
    }
];

// UI Functions
function showNotification(message, duration = 3000) {
    const notification = document.getElementById('notification');
    if (!notification) return;
    
    notification.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, duration);
}

function showEvent(title, message, duration = 5000) {
    const eventNotification = document.getElementById('event-notification');
    if (!eventNotification) return;
    
    eventNotification.innerHTML = `<strong>${title}</strong><br>${message}`;
    eventNotification.classList.add('show');
    
    setTimeout(() => {
        eventNotification.classList.remove('show');
    }, duration);
}

function initThemeSwitcher() {
    const themeSwitch = document.createElement('button');
    themeSwitch.className = 'theme-switch';
    themeSwitch.innerHTML = '<span class="material-icons">palette</span>';
    themeSwitch.title = 'Cycle themes';
    document.body.appendChild(themeSwitch);
    
    // Define all available themes with their icons and names
    const themes = [
        { id: 'light', name: 'Light', icon: 'light_mode' },
        { id: 'dark', name: 'Dark', icon: 'dark_mode' },
        { id: 'ocean', name: 'Ocean', icon: 'water_drop' },
        { id: 'forest', name: 'Forest', icon: 'park' },
        { id: 'sunset', name: 'Sunset', icon: 'wb_sunny' },
        { id: 'thunder', name: 'Thunder', icon: 'flash_on' }
    ];
    
    // Load saved theme or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    let currentThemeIndex = themes.findIndex(theme => theme.id === savedTheme);
    if (currentThemeIndex === -1) currentThemeIndex = 0;
    
    themeSwitch.addEventListener('click', () => {
        // Cycle to next theme
        currentThemeIndex = (currentThemeIndex + 1) % themes.length;
        const newTheme = themes[currentThemeIndex];
        
        // Update theme
        document.documentElement.setAttribute('data-theme', newTheme.id);
        localStorage.setItem('theme', newTheme.id);
        
        // Update icon
        const icon = themeSwitch.querySelector('.material-icons');
        icon.textContent = newTheme.icon;
        
        // Show notification
        showNotification(`Switched to ${newTheme.name} theme`);
    });
    
    // Set initial icon
    const currentTheme = themes[currentThemeIndex];
    const icon = themeSwitch.querySelector('.material-icons');
    icon.textContent = currentTheme.icon;
}

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

function initTooltips() {
    const tooltips = document.querySelectorAll('.tooltip');
    tooltips.forEach(tooltip => {
        tooltip.addEventListener('mouseenter', showTooltip);
        tooltip.addEventListener('mouseleave', hideTooltip);
    });
}

function showTooltip() {
    const tooltip = this.querySelector('.tooltiptext');
    if (tooltip) {
        tooltip.style.visibility = 'visible';
        tooltip.style.opacity = '1';
    }
}

function hideTooltip() {
    const tooltip = this.querySelector('.tooltiptext');
    if (tooltip) {
        tooltip.style.visibility = 'hidden';
        tooltip.style.opacity = '0';
    }
}

// Game Functions
function calculateCost(baseCost, owned) {
    return Math.floor(baseCost * Math.pow(1.15, owned));
}

function updateAutoClickerUI(ac) {
    const element = document.getElementById(`auto-clicker-${ac.id}`);
    if (!element) return;
    
    const cost = calculateCost(ac.baseCost, ac.count || 0);
    const cps = (ac.baseCps * (ac.count || 0)).toFixed(1);
    const count = ac.count || 0;
    
    element.querySelector('.item-owned').textContent = `${count} owned`;
    element.querySelector('.item-cps').textContent = `${cps} per second`;
    
    const button = element.querySelector('.buy-auto-clicker');
    button.textContent = `Buy (${cost})`;
    button.dataset.cost = cost;
}

function buyAutoClicker(id) {
    const ac = autoClickers.find(a => a.id === id);
    if (!ac) return;
    
    const cost = calculateCost(ac.baseCost, ac.count || 0);
    
    if (cookies >= cost) {
        cookies -= cost;
        ac.count = (ac.count || 0) + 1;
        updateCookiesPerSecond();
        updateAutoClickerUI(ac);
        updateShopButtons();
        showNotification(`${ac.name} purchased!`);
        saveGameState();
    }
}

function createAutoClickerElement(ac) {
    const element = document.createElement('div');
    element.className = 'shop-item';
    element.id = `auto-clicker-${ac.id}`;
    
    const cost = calculateCost(ac.baseCost, ac.count || 0);
    const cps = (ac.baseCps * (ac.count || 0)).toFixed(1);
    
    element.innerHTML = `
        <div class="item-info">
            <div class="item-name">
                <span class="material-icons">${ac.icon}</span>
                ${ac.name}
            </div>
            <div class="item-description">${ac.description}</div>
            <div class="item-stats">
                <span class="item-owned">${ac.count || 0} owned</span>
                <span class="item-cps">${cps} per second</span>
            </div>
        </div>
        <button class="buy-button buy-auto-clicker" data-id="${ac.id}" data-cost="${cost}">
            Buy (${cost})
        </button>
    `;
    
    const button = element.querySelector('.buy-auto-clicker');
    button.addEventListener('click', () => buyAutoClicker(ac.id));
    
    return element;
}

function createUpgradeElement(upgrade) {
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
        button.addEventListener('click', () => buyUpgrade(upgrade.id));
    }
    
    return element;
}

function buyUpgrade(id) {
    const upgrade = upgrades.find(u => u.id === id);
    if (!upgrade || upgrade.owned) return;
    
    if (cookies >= upgrade.cost) {
        cookies -= upgrade.cost;
        upgrade.owned = true;
        
        if (upgrade.effect) {
            upgrade.effect();
        }
        
        updateUpgradeUI(upgrade);
        updateShopButtons();
        showNotification(`${upgrade.name} purchased!`);
        saveGameState();
    }
}

function updateUpgradeUI(upgrade) {
    const element = document.getElementById(`upgrade-${upgrade.id}`);
    if (!element) return;
    
    element.classList.add('owned');
    const button = element.querySelector('.buy-upgrade');
    if (button) {
        button.textContent = 'Purchased';
        button.disabled = true;
    }
}

function checkUpgradeRequirements() {
    upgrades.forEach(upgrade => {
        if (upgrade.requirement && !upgrade.requirement() && !upgrade.owned) {
            const element = document.getElementById(`upgrade-${upgrade.id}`);
            if (element) {
                element.style.opacity = '0.5';
                element.style.pointerEvents = 'none';
            }
        }
    });
}

function checkCriticalHit() {
    const luckyCookie = upgrades.find(u => u.id === 'lucky_cookie' && u.owned);
    if (luckyCookie && Math.random() < 0.1) {
        return 10;
    }
    return 1;
}

function updateCookiesPerSecond() {
    cookiesPerSecond = autoClickers.reduce((total, ac) => {
        return total + (ac.baseCps * (ac.count || 0));
    }, 0);
}

function addCookies(amount, showEffect = true) {
    const multiplier = checkCriticalHit();
    const actualAmount = amount * multiplier;
    cookies += actualAmount;
    totalCookiesEarned += actualAmount;
    
    if (showEffect && amount >= 1) {
        const effect = document.createElement('div');
        effect.className = 'click-effect';
        effect.textContent = `+${Math.floor(actualAmount)}`;
        effect.style.left = `${Math.random() * 60 + 20}%`;
        effect.style.top = `${Math.random() * 60 + 20}%`;
        document.querySelector('.cookie-button').appendChild(effect);
        setTimeout(() => effect.remove(), 1000);
    }
}

function showClickEffect() {
    cookieButton.classList.add('pulse');
    setTimeout(() => cookieButton.classList.remove('pulse'), 200);
}

function updateShopButtons() {
    document.querySelectorAll('.buy-auto-clicker').forEach(button => {
        const cost = parseFloat(button.dataset.cost);
        button.disabled = cookies < cost;
    });

    document.querySelectorAll('.buy-upgrade:not(:disabled)').forEach(button => {
        const cost = parseFloat(button.dataset.cost);
        button.disabled = cookies < cost;
    });
}

function triggerRandomEvent() {
    const events = [
        {
            name: "Cookie Storm!",
            message: "A cookie storm! Get 2x cookies for 10 seconds!",
            duration: 10000,
            effect: () => { clickMultiplier *= 2; },
            revert: () => { clickMultiplier /= 2; }
        },
        {
            name: "Lucky Day",
            message: "It's your lucky day! Get a 100 cookie bonus!",
            effect: () => { addCookies(100); }
        },
        {
            name: "Productivity Boost",
            message: "Your auto-clickers are 50% more productive for 30 seconds!",
            duration: 30000,
            effect: () => { cookiesPerSecond *= 1.5; },
            revert: () => { cookiesPerSecond /= 1.5; }
        }
    ];

    const event = events[Math.floor(Math.random() * events.length)];
    showEvent(event.name, event.message);
    
    if (event.effect) event.effect();
    
    if (event.duration && event.revert) {
        setTimeout(() => {
            event.revert();
            showEvent(`${event.name} over`, "The event has ended.");
        }, event.duration);
    }
}

// Storage Functions
function saveGameState() {
    const gameState = {
        cookies,
        cookiesPerSecond,
        cookiesPerClick,
        clickMultiplier,
        totalClicks,
        totalCookiesEarned,
        achievements,
        autoClickers: autoClickers.map(ac => ({
            id: ac.id,
            count: ac.count || 0,
            baseCost: ac.baseCost,
            baseCps: ac.baseCps
        })),
        upgrades: upgrades.map(upgrade => ({
            id: upgrade.id,
            owned: upgrade.owned || false
        })),
        version: gameVersion
    };

    localStorage.setItem('cookieClickerSave', JSON.stringify(gameState));
}

function loadGameState() {
    try {
        const savedData = localStorage.getItem('cookieClickerSave');
        if (savedData) {
            const gameState = JSON.parse(savedData);
            
            cookies = gameState.cookies || 0;
            cookiesPerSecond = gameState.cookiesPerSecond || 0;
            cookiesPerClick = gameState.cookiesPerClick || 1;
            clickMultiplier = gameState.clickMultiplier || 1;
            totalClicks = gameState.totalClicks || 0;
            totalCookiesEarned = gameState.totalCookiesEarned || 0;
            achievements = gameState.achievements || [];
            
            // Load auto-clickers
            if (gameState.autoClickers) {
                autoClickers = AUTO_CLICKERS.map(ac => {
                    const savedAc = gameState.autoClickers.find(a => a.id === ac.id) || {};
                    return { ...ac, count: savedAc.count || 0 };
                });
            }
            
            // Load upgrades
            if (gameState.upgrades) {
                upgrades = UPGRADES.map(upgrade => {
                    const savedUpgrade = gameState.upgrades.find(u => u.id === upgrade.id) || {};
                    return { ...upgrade, owned: savedUpgrade.owned || false };
                });
            }
            
            showNotification('Game loaded!');
            return true;
        }
    } catch (e) {
        console.error('Error loading game:', e);
    }
    return false;
}

// Game Loop
function gameLoop(timestamp) {
    updateGame();
    render();
    requestAnimationFrame(gameLoop);
}

function updateGame() {
    // Update cookies based on auto-clickers
    const now = Date.now();
    const deltaTime = (now - lastSave) / 1000;
    lastSave = now;

    if (deltaTime < 1) {
        const cookiesToAdd = cookiesPerSecond * deltaTime;
        if (cookiesToAdd > 0) {
            addCookies(cookiesToAdd, false);
        }
    }

    // Random events
    if (Math.random() < 0.0005) {
        triggerRandomEvent();
    }
}

function updateStatistics() {
    const totalCookiesEl = document.getElementById('total-cookies');
    const totalCpsEl = document.getElementById('total-cps');
    const totalClicksEl = document.getElementById('total-clicks');
    const autoclickersOwnedEl = document.getElementById('autoclickers-owned');
    const upgradesOwnedEl = document.getElementById('upgrades-owned');
    
    if (totalCookiesEl) totalCookiesEl.textContent = Math.floor(totalCookiesEarned).toLocaleString();
    if (totalCpsEl) totalCpsEl.textContent = cookiesPerSecond.toFixed(1);
    if (totalClicksEl) totalClicksEl.textContent = totalClicks.toLocaleString();
    if (autoclickersOwnedEl) {
        const totalAutoclickers = autoClickers.reduce((total, ac) => total + (ac.count || 0), 0);
        autoclickersOwnedEl.textContent = totalAutoclickers;
    }
    if (upgradesOwnedEl) {
        const totalUpgrades = upgrades.filter(upgrade => upgrade.owned).length;
        upgradesOwnedEl.textContent = totalUpgrades;
    }
}

function checkAchievements() {
    ACHIEVEMENTS.forEach(achievement => {
        if (!achievements.includes(achievement.id) && achievement.requirement()) {
            achievements.push(achievement.id);
            showEvent(`Achievement Unlocked!`, `${achievement.name}: ${achievement.description}<br>Reward: ${achievement.reward}`);
        }
    });
}

function render() {
    // Update score display
    scoreElement.textContent = Math.floor(cookies).toLocaleString();
    cpsElement.textContent = cookiesPerSecond.toFixed(1);

    // Update statistics
    updateStatistics();
    
    // Check achievements
    checkAchievements();

    // Update button states
    updateShopButtons();
}

// Initialize the game
function initGame() {
    // Get DOM elements
    scoreElement = document.getElementById('score');
    cpsElement = document.getElementById('cps');
    cookieButton = document.getElementById('cookie');

    // Initialize auto-clickers
    if (autoClickers.length === 0) {
        autoClickers = AUTO_CLICKERS.map(ac => ({ ...ac, count: 0 }));
    }

    // Initialize upgrades
    if (upgrades.length === 0) {
        upgrades = UPGRADES.map(upgrade => ({ ...upgrade, owned: false }));
    }

    // Load saved game
    loadGameState();

    // Set up auto-clickers UI
    const autoClickersContainer = document.getElementById('auto-clickers');
    autoClickers.forEach(ac => {
        autoClickersContainer.appendChild(createAutoClickerElement(ac));
    });

    // Set up upgrades UI
    const upgradesContainer = document.getElementById('upgrades');
    upgrades.forEach(upgrade => {
        upgradesContainer.appendChild(createUpgradeElement(upgrade));
    });

    // Set up event listeners
    setupEventListeners();

    // Initialize UI components
    initThemeSwitcher();
    initTooltips();

    // Start game loop
    requestAnimationFrame(gameLoop);

    // Auto-save periodically
    setInterval(saveGameState, SAVE_INTERVAL);

    // Show welcome message
    showNotification('Welcome to Cookie Clicker! Click the cookie to begin.');
}

function setupEventListeners() {
    // Cookie click
    cookieButton.addEventListener('click', () => {
        totalClicks++;
        addCookies(cookiesPerClick * clickMultiplier);
        showClickEffect();
    });

    // Keyboard shortcut (spacebar)
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && e.target === document.body) {
            e.preventDefault();
            cookieButton.click();
        }
    });

    // Save before page unload
    window.addEventListener('beforeunload', saveGameState);
}

// Expose functions to global scope for HTML event handlers
window.buyAutoClicker = buyAutoClicker;
window.buyUpgrade = buyUpgrade;
window.saveGameState = saveGameState;

// Start the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', initGame);