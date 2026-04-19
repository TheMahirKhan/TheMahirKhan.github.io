/**
 * canvas.js
 * Draws a subtle animated dot-grid / particle network on the background canvas.
 * Completely self-contained — no external dependencies.
 */

(function () {
  'use strict';

  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');

  // ── Config ───────────────────────────────────────────────
  const CONFIG = {
    dotCount: 80,
    dotRadius: 1.2,
    dotColor: 'rgba(124, 106, 255, 0.55)',
    lineColor: 'rgba(124, 106, 255, 0.08)',
    maxLineLength: 160,
    speed: 0.35,
  };

  // ── State ────────────────────────────────────────────────
  let W, H, dots, animId;

  // ── Dot class ────────────────────────────────────────────
  class Dot {
    constructor() {
      this.reset(true);
    }

    reset(randomY = false) {
      this.x = Math.random() * W;
      this.y = randomY ? Math.random() * H : H + 5;
      this.vx = (Math.random() - 0.5) * CONFIG.speed;
      this.vy = (Math.random() - 0.5) * CONFIG.speed;
      this.r = CONFIG.dotRadius;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Wrap around edges
      if (this.x < 0) this.x = W;
      if (this.x > W) this.x = 0;
      if (this.y < 0) this.y = H;
      if (this.y > H) this.y = 0;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = CONFIG.dotColor;
      ctx.fill();
    }
  }

  // ── Init ────────────────────────────────────────────────
  function init() {
    resize();
    dots = Array.from({ length: CONFIG.dotCount }, () => new Dot());
    if (animId) cancelAnimationFrame(animId);
    loop();
  }

  // ── Resize ──────────────────────────────────────────────
  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  // ── Draw connections between nearby dots ────────────────
  function drawLines() {
    for (let i = 0; i < dots.length; i++) {
      for (let j = i + 1; j < dots.length; j++) {
        const dx = dots[i].x - dots[j].x;
        const dy = dots[i].y - dots[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONFIG.maxLineLength) {
          const alpha = (1 - dist / CONFIG.maxLineLength) * 0.4;
          ctx.beginPath();
          ctx.moveTo(dots[i].x, dots[i].y);
          ctx.lineTo(dots[j].x, dots[j].y);
          ctx.strokeStyle = `rgba(124, 106, 255, ${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
  }

  // ── Animation loop ──────────────────────────────────────
  function loop() {
    ctx.clearRect(0, 0, W, H);

    dots.forEach(d => d.update());
    drawLines();
    dots.forEach(d => d.draw());

    animId = requestAnimationFrame(loop);
  }

  // ── Event Listeners ─────────────────────────────────────
  window.addEventListener('resize', () => {
    resize();
    // Re-position dots within new bounds
    dots.forEach(d => d.reset(true));
  });

  // ── Boot ────────────────────────────────────────────────
  window.addEventListener('DOMContentLoaded', init);

}());