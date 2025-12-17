/**
 * main.js - Entry Point
 * Initialize game and start
 */

import { Game } from './game.js';

// ===== Responsive Scaling System =====
const GAME_WIDTH = 1600;
const GAME_HEIGHT = 900;
const ASPECT_RATIO = GAME_WIDTH / GAME_HEIGHT;

let currentScale = 1;
let gameContainer = null;

/**
 * Calculate and apply optimal scale based on window size
 */
function updateGameScale() {
    if (!gameContainer) {
        gameContainer = document.getElementById('game-container');
    }
    if (!gameContainer) return;

    // Get available viewport size with padding
    const padding = 20; // Padding from edges
    const availableWidth = window.innerWidth - (padding * 2);
    const availableHeight = window.innerHeight - (padding * 2);

    // Calculate scale to fit both dimensions
    const scaleX = availableWidth / GAME_WIDTH;
    const scaleY = availableHeight / GAME_HEIGHT;

    // Use the smaller scale to ensure game fits completely
    currentScale = Math.min(scaleX, scaleY, 1); // Cap at 1 to prevent upscaling

    // Apply minimum scale to keep game playable
    currentScale = Math.max(currentScale, 0.25);

    // Apply the transform
    gameContainer.style.transform = `scale(${currentScale})`;

    // Store scale for other modules (e.g., input handling)
    if (window.game) {
        window.game.currentScale = currentScale;
    }

    console.log(`📐 Game scaled to: ${(currentScale * 100).toFixed(1)}%`);
}

/**
 * Debounce function to limit resize event frequency
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Debounced resize handler
const debouncedResize = debounce(updateGameScale, 100);

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎮 Nexus Tower Defender - Starting...');

    // Get canvas
    const canvas = document.getElementById('gameCanvas');

    if (!canvas) {
        console.error('Canvas element not found!');
        return;
    }

    // Create game instance
    window.game = new Game(canvas);

    // Apply initial scale
    updateGameScale();

    console.log('✅ Game initialized successfully!');
    console.log('📋 Controls:');
    console.log('  - W A S D: Move');
    console.log('  - SPACE / Click: Shoot');
    console.log('  - Shift: Dash');
    console.log('  - ESC: Pause');
    console.log('  - G: Toggle Grid (Debug)');

    // Prevent context menu on canvas
    canvas.addEventListener('contextmenu', (e) => e.preventDefault());

    // Prevent spacebar scrolling
    window.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && e.target === document.body) {
            e.preventDefault();
        }
    });
});

// Handle window resize with debouncing
window.addEventListener('resize', debouncedResize);

// Also update on orientation change (mobile devices)
window.addEventListener('orientationchange', () => {
    setTimeout(updateGameScale, 100);
});

// Handle visibility change (pause when tab is hidden)
document.addEventListener('visibilitychange', () => {
    if (window.game) {
        if (document.hidden) {
            // Tab is hidden - could auto-pause here
            if (window.game.state === 'playing') {
                window.game.pauseGame();
            }
        }
    }
});

// Export scale getter for other modules
export function getCurrentScale() {
    return currentScale;
}

console.log('🚀 Nexus Tower Defender loaded!');
