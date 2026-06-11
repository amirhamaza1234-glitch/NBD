/**
 * ═══════════════════════════════════════════════════
 * Birthday Website — Nisha Mondal
 * Confetti · Scroll Reveal · Parallax · Footer Stars
 * ═══════════════════════════════════════════════════
 */

document.addEventListener('DOMContentLoaded', () => {
  initConfetti();
  initScrollReveal();
  initSmoothScroll();
  initFooterStars();
  initWishCardTilt();
});

/* ══════════════════════════════════════════════
   CONFETTI
   ══════════════════════════════════════════════ */
function initConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const COLORS = [
    '#a78bfa', '#f9a8d4', '#fbbf24',
    '#c4b5fd', '#fde68a', '#7c3aed',
    '#ffffff', '#ec4899'
  ];

  class Piece {
    constructor() { this.init(true); }

    init(firstLoad = false) {
      this.x  = Math.random() * W;
      this.y  = firstLoad ? Math.random() * -H : Math.random() * -80 - 20;
      this.w  = Math.random() * 10 + 5;
      this.h  = Math.random() * 5 + 3;
      this.vx = (Math.random() - 0.5) * 2;
      this.vy = Math.random() * 3 + 1.5;
      this.angle      = Math.random() * 360;
      this.angleSpeed = (Math.random() - 0.5) * 7;
      this.color      = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.opacity    = Math.random() * 0.6 + 0.4;
      this.life       = 1;
    }

    update() {
      this.y     += this.vy;
      this.x     += this.vx;
      this.angle += this.angleSpeed;
      this.vx    += (Math.random() - 0.5) * 0.08;
      if (this.y > H + 40) this.life -= 0.04;
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.angle * Math.PI) / 180);
      ctx.globalAlpha = this.opacity * Math.max(0, this.life);
      ctx.fillStyle   = this.color;
      ctx.fillRect(-this.w / 2, -this.h / 2, this.w, this.h);
      ctx.restore();
    }
  }

  const pieces = Array.from({ length: 180 }, () => new Piece());
  const MAX = 380;
  let frame = 0;

  (function animate() {
    frame++;
    ctx.clearRect(0, 0, W, H);

    const fade = frame > MAX - 80 ? Math.max(0, (MAX - frame) / 80) : 1;

    pieces.forEach(p => {
      p.update();
      p.opacity = Math.min(p.opacity, fade * 0.9);
      p.draw();
    });

    if (frame < MAX) {
      requestAnimationFrame(animate);
    } else {
      ctx.clearRect(0, 0, W, H);
      canvas.style.display = 'none';
    }
  })();
}

/* ══════════════════════════════════════════════
   SCROLL REVEAL
   ══════════════════════════════════════════════ */
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal');

  if (!('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('visible'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (!entry.isIntersecting) return;

      // stagger cards inside grids
      const parent = entry.target.parentElement;
      const isGrid = parent && (
        parent.classList.contains('wishes-grid')
      );
      const delay = isGrid
        ? Array.from(parent.children).indexOf(entry.target) * 80
        : 0;

      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);

      io.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => io.observe(el));
}

/* ══════════════════════════════════════════════
   SMOOTH SCROLL
   ══════════════════════════════════════════════ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ══════════════════════════════════════════════
   FOOTER STARS
   ══════════════════════════════════════════════ */
function initFooterStars() {
  const container = document.querySelector('.footer-stars');
  if (!container) return;

  for (let i = 0; i < 55; i++) {
    const s = document.createElement('div');
    const size = Math.random() * 2.5 + 0.8;
    Object.assign(s.style, {
      position:  'absolute',
      width:     size + 'px',
      height:    size + 'px',
      background:'#fff',
      borderRadius: '50%',
      left:      Math.random() * 100 + '%',
      top:       Math.random() * 100 + '%',
      opacity:   Math.random() * 0.5 + 0.1,
      animation: `twinkle ${(Math.random() * 3 + 2).toFixed(1)}s ease-in-out ${(Math.random() * 4).toFixed(1)}s infinite`,
    });
    container.appendChild(s);
  }

  if (!document.getElementById('twinkle-kf')) {
    const style = document.createElement('style');
    style.id = 'twinkle-kf';
    style.textContent = `
      @keyframes twinkle {
        0%, 100% { opacity: 0.1; transform: scale(1); }
        50%       { opacity: 0.8; transform: scale(1.6); }
      }
    `;
    document.head.appendChild(style);
  }
}

/* ══════════════════════════════════════════════
   WISH CARD 3-D TILT
   ══════════════════════════════════════════════ */
function initWishCardTilt() {
  document.querySelectorAll('.wish-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transform = `translateY(-8px) rotateX(${-y * 10}deg) rotateY(${x * 10}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}
