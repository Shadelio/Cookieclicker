// Mock localStorage for testing
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

// Mock requestAnimationFrame for testing
window.requestAnimationFrame = (callback) => setTimeout(callback, 0);

// Mock document for testing
document.body.innerHTML = `
  <div id="game">
    <div id="cookie"></div>
    <div id="score">0</div>
    <div id="cps">0</div>
    <div id="shop"></div>
    <div id="upgrades"></div>
    <div id="notifications"></div>
  </div>
`;

global.localStorage = localStorageMock;
global.game = null; // Will be set in each test file
