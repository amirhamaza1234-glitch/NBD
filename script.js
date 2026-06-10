/**
 * ═══════════════════════════════════════════════
 * Birthday Website for Nisha Mondal
 * Interactive effects, confetti, particles & animations
 * ═══════════════════════════════════════════════
 */

document.addEventListener('DOMContentLoaded', () => {
  initConfetti();
  initParticles();
  initScrollReveal();
  initParallax();
  initFooterStars();
  initSmoothScroll();
});

/* ══════════════════════════════════════════════
   CONFETTI ON PAGE LOAD
   ══════════════════════════════════════════════ */
function initConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  let W, H;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const colors = [
    '#6C63FF', '#FFB6C1', '#FFD700', '#A78BFA',
    '#FF8FAB', '#FFE44D', '#8B85FF', '#FFD1DA',
    '#F5F3FF', '#FFFFFF'
  ];

  const confettiCount = 200;
  const pieces = [];

  class ConfettiPiece {
    constructor() {
      this.reset();
      this.y = Math.random() * -H;
    }

    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * -100 - 50;
      this.w = Math.random() * 10 + 5;
      this.h = Math.random() * 6 + 3;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.vy = Math.random() * 3 + 1.5;
      this.vx = (Math.random() - 0.5) * 2;
      this.angle = Math.random() * 360;
      this.angleSpeed = (Math.random() - 0.5) * 8;
      this.opacity = Math.random() * 0.6 + 0.4;
      this.life = 1;
    }

    update() {
      this.y += this.vy;
      this.x += this.vx;
      this.angle += this.angleSpeed;
      this.vx += (Math.random() - 0.5) * 0.1;

      if (this.y > H + 50) {
        this.life -= 0.02;
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.angle * Math.PI) / 180);
      ctx.globalAlpha = this.opacity * Math.max(0, this.life);
      ctx.fillStyle = this.color;
      ctx.fillRect(-this.w / 2, -this.h / 2, this.w, this.h);
      ctx.restore();
    }
  }

  for (let i = 0; i < confettiCount; i++) {
    pieces.push(new ConfettiPiece());
  }

  let frameCount = 0;
  const maxFrames = 400; // ~6.6 seconds at 60fps

  function animateConfetti() {
    frameCount++;
    ctx.clearRect(0, 0, W, H);

    const globalFade = frameCount > maxFrames - 100
      ? Math.max(0, (maxFrames - frameCount) / 100)
      : 1;

    for (const piece of pieces) {
      piece.update();
      piece.opacity = piece.opacity * globalFade;
      piece.draw();
    }

    if (frameCount < maxFrames) {
      requestAnimationFrame(animateConfetti);
    } else {
      ctx.clearRect(0, 0, W, H);
      canvas.style.display = 'none';
    }
  }

  animateConfetti();
}

/* ══════════════════════════════════════════════
   FLOATING PARTICLES
   ══════════════════════════════════════════════ */
function initParticles() {
  const container = document.getElementById('particles-container');
  const particleCount = 25;
  const colors = [
    'rgba(108, 99, 255, 0.3)',
    'rgba(255, 182, 193, 0.3)',
    'rgba(255, 215, 0, 0.2)',
    'rgba(167, 139, 250, 0.25)',
  ];

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');

    const size = Math.random() * 12 + 4;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.background = colors[Math.floor(Math.random() * colors.length)];
    particle.style.animationDelay = Math.random() * 10 + 's';
    particle.style.animationDuration = (Math.random() * 15 + 10) + 's';

    container.appendChild(particle);
  }
}

/* ══════════════════════════════════════════════
   SCROLL REVEAL
   ══════════════════════════════════════════════ */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');

  // Initially check for elements in viewport
  checkReveals();

  // Use IntersectionObserver for smooth reveals
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Stagger the reveal animation
          const delay = entry.target.dataset.revealDelay || 0;
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach((el, i) => {
      // Add stagger delay based on sibling index for grid items
      const parent = el.parentElement;
      if (parent && (parent.classList.contains('memories-grid') || parent.classList.contains('wishes-grid'))) {
        const siblings = Array.from(parent.children);
        const index = siblings.indexOf(el);
        el.dataset.revealDelay = index * 100;
      }
      observer.observe(el);
    });
  } else {
    // Fallback for older browsers
    reveals.forEach(el => el.classList.add('visible'));
  }

  function checkReveals() {
    reveals.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.85) {
        el.classList.add('visible');
      }
    });
  }
}

/* ══════════════════════════════════════════════
   PARALLAX EFFECTS
   ══════════════════════════════════════════════ */
function initParallax() {
  const heroShapes = document.querySelector('.hero-bg-shapes');
  const balloons = document.querySelector('.balloons-container');
  const sparkles = document.querySelector('.sparkles');

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.pageYOffset;

        // Parallax hero background shapes
        if (heroShapes) {
          heroShapes.style.transform = `translateY(${scrollY * 0.3}px)`;
        }

        // Parallax balloons
        if (balloons) {
          balloons.style.transform = `translateY(${scrollY * 0.15}px)`;
        }

        // Parallax sparkles
        if (sparkles) {
          sparkles.style.transform = `translateY(${scrollY * 0.1}px)`;
        }

        ticking = false;
      });
      ticking = true;
    }
  });

  // 3D mouse tilt on about card
  const aboutCard = document.querySelector('.about-card');
  if (aboutCard) {
    aboutCard.addEventListener('mousemove', (e) => {
      const rect = aboutCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      aboutCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    });

    aboutCard.addEventListener('mouseleave', () => {
      aboutCard.style.transform = 'rotateX(0) rotateY(0) translateY(0)';
    });
  }

  // 3D tilt for wish cards
  const wishCards = document.querySelectorAll('.wish-card-inner');
  wishCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `translateY(-8px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // 3D tilt for polaroid cards
  const polaroids = document.querySelectorAll('.polaroid-inner');
  polaroids.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ══════════════════════════════════════════════
   FOOTER STARS
   ══════════════════════════════════════════════ */
function initFooterStars() {
  const starsContainer = document.querySelector('.footer-stars');
  if (!starsContainer) return;

  const starCount = 60;

  for (let i = 0; i < starCount; i++) {
    const star = document.createElement('div');
    star.style.position = 'absolute';
    star.style.width = (Math.random() * 3 + 1) + 'px';
    star.style.height = star.style.width;
    star.style.background = '#fff';
    star.style.borderRadius = '50%';
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    star.style.opacity = Math.random() * 0.6 + 0.2;
    star.style.animation = `starTwinkle ${Math.random() * 3 + 2}s ease-in-out ${Math.random() * 3}s infinite`;

    starsContainer.appendChild(star);
  }

  // Inject the twinkle animation
  if (!document.getElementById('star-twinkle-style')) {
    const style = document.createElement('style');
    style.id = 'star-twinkle-style';
    style.textContent = `
      @keyframes starTwinkle {
        0%, 100% { opacity: 0.2; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.5); }
      }
    `;
    document.head.appendChild(style);
  }
}

/* ══════════════════════════════════════════════
   SMOOTH SCROLL
   ══════════════════════════════════════════════ */
function initSmoothScroll() {
  const ctaBtn = document.getElementById('hero-cta-btn');
  if (ctaBtn) {
    ctaBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(ctaBtn.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }
}
