import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';

// Load the HTML file
const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');
const { window } = new JSDOM(html);
global.window = window;
global.document = window.document;

// Import the game after setting up the DOM
import '../game.js';

describe('Cookie Clicker Game', () => {
  beforeEach(() => {
    // Reset game state before each test
    if (window.game) {
      window.game.resetGame();
    } else {
      window.game = new Game();
      window.game.init();
    }
  });

  describe('Initialization', () => {
    test('game initializes with 0 cookies', () => {
      expect(window.game.cookies).toBe(0);
    });

    test('clicking cookie increases cookie count', () => {
      const initialCookies = window.game.cookies;
      window.game.clickCookie();
      expect(window.game.cookies).toBeGreaterThan(initialCookies);
    });
  });

  describe('AutoClicker', () => {
    test('can purchase autoclicker', () => {
      // Give enough cookies to buy an autoclicker
      const autoClicker = window.game.autoClickers[0];
      const cost = autoClicker.getCost();
      window.game.addCookies(cost);
      
      const initialCount = autoClicker.count;
      const purchaseResult = autoClicker.buy();
      
      expect(purchaseResult).toBe(true);
      expect(autoClicker.count).toBe(initialCount + 1);
    });

    test('autoclicker generates cookies over time', () => {
      const autoClicker = window.game.autoClickers[0];
      window.game.addCookies(1000); // Give enough cookies to buy
      
      // Buy an autoclicker
      autoClicker.buy();
      
      // Simulate game tick
      const initialCookies = window.game.cookies;
      window.game.update();
      
      expect(window.game.cookies).toBeGreaterThan(initialCookies);
    });
  });

  describe('Game State', () => {
    test('game state can be saved and loaded', () => {
      // Modify game state
      window.game.addCookies(100);
      window.game.autoClickers[0].buy();
      
      // Save and get the saved state
      window.game.storage.saveGameState();
      const savedState = JSON.parse(localStorage.getItem('cookieClickerSave'));
      
      // Reset game
      window.game.resetGame();
      
      // Load saved state
      window.game.storage.loadGameState();
      
      // Verify state was loaded correctly
      expect(window.game.cookies).toBe(100);
      expect(window.game.autoClickers[0].count).toBe(1);
    });
  });

  describe('UI Updates', () => {
    test('score updates when cookies are added', () => {
      const scoreElement = document.getElementById('score');
      window.game.addCookies(10);
      expect(scoreElement.textContent).toContain('10');
    });
  });
});
