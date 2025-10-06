// Game variables
let score = 0;

// Get elements
const scoreElement = document.getElementById('score');
const cookieBtn = document.getElementById('cookieBtn');

// Cookie click function
function clickCookie() {
    score++;
    scoreElement.textContent = score;
    
    // Add click animation
    cookieBtn.style.transform = 'scale(0.9)';
    setTimeout(() => {
        cookieBtn.style.transform = 'scale(1)';
    }, 100);
}

// Add click event listener
cookieBtn.addEventListener('click', clickCookie);

// Optional: Add keyboard support (spacebar)
document.addEventListener('keydown', function(event) {
    if (event.code === 'Space') {
        event.preventDefault();
        clickCookie();
    }
});
