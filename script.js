/**
 * Autoclicker class - Manages individual autoclicker upgrades
 */
class Autoclicker {
    constructor(name, cost, cps, description, emoji = '🖱️') {
        this.name = name;
        this.cost = cost;
        this.baseCost = cost;
        this.cps = cps;
        this.count = 0;
        this.description = description;
        this.emoji = emoji;
    }

    buy() {
        this.count++;
        this.cost = Math.floor(this.baseCost * Math.pow(1.15, this.count));
    }

    getTotalCps() {
        return this.cps * this.count;
    }

    getFormattedCost() {
        return this.cost >= 1000000 ? 
            (this.cost / 1000000).toFixed(1) + 'M' : 
            this.cost >= 1000 ? 
            (this.cost / 1000).toFixed(1) + 'K' : 
            this.cost.toString();
    }
}


/**
 * Theme class - Manages visual themes and styling
 */
class Theme {
    constructor(name, background, colors, particles = false) {
        this.name = name;
        this.background = background;
        this.colors = colors;
        this.particles = particles;
    }

    apply() {
        document.body.style.background = this.background;
        document.body.className = `theme-${this.name.toLowerCase()}`;
        
        Object.keys(this.colors).forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                Object.assign(el.style, this.colors[selector]);
            });
        });

        if (this.particles) {
            this.createParticles();
        }
    }

    createParticles() {
        const existingParticles = document.querySelector('.particles');
        if (existingParticles) existingParticles.remove();
        
        const particleContainer = document.createElement('div');
        particleContainer.className = 'particles';
        document.body.appendChild(particleContainer);
    }
}


/**
 * SpecialEvent class - Manages temporary boosts and events
 */
class SpecialEvent {
    constructor(name, description, duration, multiplier, emoji = '✨') {
        this.name = name;
        this.description = description;
        this.duration = duration;
        this.multiplier = multiplier;
        this.emoji = emoji;
        this.active = false;
        this.timeLeft = 0;
    }

    activate() {
        this.active = true;
        this.timeLeft = this.duration;
    }

    update() {
        if (this.active && this.timeLeft > 0) {
            this.timeLeft--;
            if (this.timeLeft <= 0) {
                this.active = false;
            }
        }
    }

    getTimeLeftFormatted() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        return minutes > 0 ? `${minutes}:${seconds.toString().padStart(2, '0')}` : `${seconds}s`;
    }
}

class CookieClicker {
    constructor() {
        this.score = 0;
        this.animationDuration = 100;
        this.cookiesPerSecond = 0;
        
        
        this.scoreElement = document.getElementById('score');
        this.cookieBtn = document.getElementById('cookieBtn');
        this.cpsElement = document.getElementById('cps');
        
        
        this.initAutoclickers();
        this.initThemes();
        this.initEvents();
        this.init();
    }
    
    initAutoclickers() {
        this.autoclickers = [
            new Autoclicker('Cursor', 15, 0.1, 'Automatisch klikken', '👆'),
            new Autoclicker('Grandma', 100, 1, 'Oma bakt koekjes', '👵'),
            new Autoclicker('Farm', 1100, 8, 'Koekjes kweken', '🚜'),
            new Autoclicker('Mine', 12000, 47, 'Koekjes delven', '⛏️'),
            new Autoclicker('Factory', 130000, 260, 'Koekjes produceren', '🏭'),
            new Autoclicker('Bank', 1400000, 1400, 'Koekjes investeren', '🏦'),
            new Autoclicker('Temple', 20000000, 7800, 'Koekjes aanbidden', '🏛️'),
            new Autoclicker('Wizard', 330000000, 44000, 'Koekjes toveren', '🧙‍♂️')
        ];
    }

    initThemes() {
        this.themes = {
            space: new Theme('Space', 
                'radial-gradient(ellipse at center, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)',
                {
                    '.game-title, .score-display, .cps-display': { 
                        color: '#00ffff', 
                        textShadow: '0 0 15px #00ffff, 0 0 30px #0080ff' 
                    },
                    '.cookie-btn': { 
                        background: 'radial-gradient(circle, #2c3e50, #1a252f)', 
                        boxShadow: '0 0 30px #00ffff, inset 0 0 20px rgba(0,255,255,0.2)' 
                    }
                }, true
            ),
            rainy: new Theme('Rainy',
                'linear-gradient(135deg, #4b6cb7 0%, #182848 50%, #0f3460 100%)',
                {
                    '.game-title, .score-display, .cps-display': { 
                        color: '#87ceeb', 
                        textShadow: '2px 2px 8px rgba(0,0,0,0.8)' 
                    },
                    '.cookie-btn': { 
                        background: 'linear-gradient(145deg, #5f7c8a, #4a6572)', 
                        filter: 'brightness(0.9) drop-shadow(0 5px 15px rgba(0,0,0,0.3))' 
                    }
                }
            )
        };
        this.currentTheme = 'default';
    }

    initEvents() {
        this.events = [
            new SpecialEvent('Golden Cookie', 'Dubbele punten!', 30, 2, '🪙'),
            new SpecialEvent('Cookie Storm', 'Triple punten!', 15, 3, '🌪️'),
            new SpecialEvent('Lucky Day', '5x punten!', 10, 5, '🍀'),
            new SpecialEvent('Cookie Rain', 'Koekjes regenen!', 20, 4, '🌧️'),
            new SpecialEvent('Magic Hour', 'Toverpunten!', 25, 3, '🔮')
        ];
        this.activeEvent = null;
    }
    
    init() {
        this.setupEventListeners();
        this.updateScoreDisplay();
        this.createUI();
        this.startGameLoop();
    }
    
    createUI() {
        this.updateShop();
        this.createThemeSelector();
        this.setupTabSwitching();
        this.updateClickCounter();
    }

    setupTabSwitching() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabPanels = document.querySelectorAll('.tab-panel');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.dataset.tab;
                
                // Remove active class from all tabs and panels
                tabBtns.forEach(b => b.classList.remove('active'));
                tabPanels.forEach(p => p.classList.remove('active'));
                
                // Add active class to clicked tab and corresponding panel
                btn.classList.add('active');
                document.getElementById(`${targetTab}-panel`).classList.add('active');
            });
        });
    }

    updateClickCounter() {
        const multiplier = this.activeEvent ? this.activeEvent.multiplier : 1;
        const counter = document.getElementById('clickCounter');
        if (counter) {
            counter.textContent = `+${multiplier}`;
        }
    }

    updateShop() {
        const shop = document.getElementById('autoclicker-shop');
        shop.innerHTML = this.autoclickers.map((ac, index) => `
            <div class="autoclicker-item ${this.score >= ac.cost ? 'affordable' : 'expensive'}">
                <div class="autoclicker-info">
                    <span class="autoclicker-emoji">${ac.emoji}</span>
                    <div class="autoclicker-details">
                        <div class="autoclicker-name">${ac.name} <span class="count">(${ac.count})</span></div>
                        <div class="autoclicker-production">${(ac.cps * ac.count).toFixed(1)}/s</div>
                    </div>
                </div>
                <button onclick="cookieGame.buyAutoclicker(${index})" 
                        class="buy-btn ${this.score < ac.cost ? 'disabled' : ''}"
                        ${this.score < ac.cost ? 'disabled' : ''}>
                    ${ac.getFormattedCost()}
                </button>
            </div>
        `).join('');
    }

    createThemeSelector() {
        const selector = document.getElementById('theme-selector');
        selector.innerHTML = Object.keys(this.themes).map(theme => `
            <button onclick="cookieGame.changeTheme('${theme}')" class="theme-btn">
                <i class="fas fa-palette"></i>
                ${theme.charAt(0).toUpperCase() + theme.slice(1)}
            </button>
        `).join('') + `
            <button onclick="cookieGame.changeTheme('default')" class="theme-btn">
                <i class="fas fa-undo"></i>
                Default
            </button>
        `;
    }
    
    setupEventListeners() {
        this.cookieBtn.addEventListener('click', () => this.clickCookie());
        document.addEventListener('keydown', (event) => this.handleKeyPress(event));
    }
    
    clickCookie() {
        const multiplier = this.activeEvent ? this.activeEvent.multiplier : 1;
        this.score += multiplier;
        this.updateScoreDisplay();
        this.animateCookie();
        this.updateClickCounter();
        this.showClickEffect(multiplier);
    }

    showClickEffect(multiplier) {
        // Create floating text effect
        const effect = document.createElement('div');
        effect.textContent = `+${multiplier}`;
        effect.style.cssText = `
            position: absolute;
            color: #ffd700;
            font-weight: bold;
            font-size: 2rem;
            pointer-events: none;
            z-index: 1000;
            text-shadow: 0 0 10px #ffd700;
            animation: floatUp 1s ease-out forwards;
        `;
        
        // Position near the cookie
        const cookieBtn = document.getElementById('cookieBtn');
        const rect = cookieBtn.getBoundingClientRect();
        effect.style.left = (rect.left + rect.width/2) + 'px';
        effect.style.top = (rect.top + rect.height/2) + 'px';
        
        document.body.appendChild(effect);
        
        // Remove after animation
        setTimeout(() => effect.remove(), 1000);
        
        // Add CSS for the animation if not exists
        if (!document.querySelector('#floatUpStyle')) {
            const style = document.createElement('style');
            style.id = 'floatUpStyle';
            style.textContent = `
                @keyframes floatUp {
                    0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
                    100% { transform: translate(-50%, -150px) scale(1.5); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    buyAutoclicker(index) {
        const ac = this.autoclickers[index];
        if (this.score >= ac.cost) {
            this.score -= ac.cost;
            ac.buy();
            this.updateCookiesPerSecond();
            this.updateScoreDisplay();
            this.updateShop();
        }
    }

    changeTheme(themeName) {
        if (themeName === 'default') {
            location.reload();
            return;
        }
        if (this.themes[themeName]) {
            this.themes[themeName].apply();
            this.currentTheme = themeName;
        }
    }

    updateCookiesPerSecond() {
        this.cookiesPerSecond = this.autoclickers.reduce((total, ac) => total + ac.getTotalCps(), 0);
    }
    
    updateScoreDisplay() {
        const formattedScore = this.formatNumber(Math.floor(this.score));
        this.scoreElement.textContent = formattedScore;
        if (this.cpsElement) {
            this.cpsElement.textContent = this.formatNumber(this.cookiesPerSecond, 1);
        }
    }

    formatNumber(num, decimals = 0) {
        if (num >= 1000000000) return (num / 1000000000).toFixed(decimals) + 'B';
        if (num >= 1000000) return (num / 1000000).toFixed(decimals) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(decimals) + 'K';
        return decimals > 0 ? num.toFixed(decimals) : num.toString();
    }
    
    animateCookie() {
        this.cookieBtn.style.transform = 'scale(0.9)';
        setTimeout(() => {
            this.cookieBtn.style.transform = 'scale(1)';
        }, this.animationDuration);
    }
    
    handleKeyPress(event) {
        if (event.code === 'Space') {
            event.preventDefault();
            this.clickCookie();
        }
    }

    triggerRandomEvent() {
        if (Math.random() < 0.02 && !this.activeEvent) { 
            const event = this.events[Math.floor(Math.random() * this.events.length)];
            event.activate();
            this.activeEvent = event;
            this.showEventNotification(event);
        }
    }

    showEventNotification(event) {
        const notification = document.createElement('div');
        notification.className = 'event-notification';
        notification.textContent = `${event.name}: ${event.description}`;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }

    updateEvents() {
        if (this.activeEvent) {
            this.activeEvent.update();
            if (!this.activeEvent.active) {
                this.activeEvent = null;
            }
        }
        this.updateEventDisplay();
        this.updateClickCounter();
    }

    updateEventDisplay() {
        const display = document.getElementById('event-display');
        if (this.activeEvent && this.activeEvent.active) {
            display.innerHTML = `
                <div class="active-event">
                    <span class="event-emoji">${this.activeEvent.emoji}</span>
                    <div class="event-info">
                        <div class="event-name">${this.activeEvent.name}</div>
                        <div class="event-time">${this.activeEvent.getTimeLeftFormatted()}</div>
                    </div>
                    <div class="event-multiplier">${this.activeEvent.multiplier}x</div>
                </div>
            `;
        } else {
            display.innerHTML = '';
        }
    }

    startGameLoop() {
        setInterval(() => {
            
            this.score += this.cookiesPerSecond / 10; 
            this.updateScoreDisplay();
            this.updateShop();
        }, 100);

        setInterval(() => {
            this.triggerRandomEvent();
            this.updateEvents();
        }, 1000);
    }
    
    getScore() {
        return this.score;
    }
    
    resetGame() {
        this.score = 0;
        this.autoclickers.forEach(ac => {
            ac.count = 0;
            ac.cost = ac.baseCost;
        });
        this.updateCookiesPerSecond();
        this.updateScoreDisplay();
        this.updateShop();
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const game = new CookieClicker();
    
    
    window.cookieGame = game;
});
