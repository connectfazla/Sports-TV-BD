/* Scroll choreography (GSAP + ScrollTrigger).
   Every animation earns its place:
   - hero lines stagger in: establishes hierarchy on arrival
   - reveals lift sections as you reach them: pacing, one idea at a time
   - image parallax: depth cue that separates media from chrome
   - counters: the stats read as earned, not printed */
(function () {
  if (typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) {
    document.querySelectorAll('[data-count]').forEach(function (el) {
      el.textContent = el.dataset.count;
    });
    return;
  }

  /* ---- Hero entrance ---- */
  gsap.from('[data-hero-line]', {
    y: 48,
    opacity: 0,
    duration: 1.1,
    ease: 'power3.out',
    stagger: 0.09,
    delay: 0.15
  });

  /* ---- Section reveals ---- */
  document.querySelectorAll('[data-reveal]').forEach(function (el) {
    gsap.from(el, {
      y: 56,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        once: true
      }
    });
  });

  /* ---- Project image parallax ---- */
  document.querySelectorAll('[data-parallax]').forEach(function (img) {
    gsap.fromTo(img,
      { yPercent: -8 },
      {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: {
          trigger: img.closest('.project__media'),
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      }
    );
  });

  /* ---- Stat counters ---- */
  document.querySelectorAll('[data-count]').forEach(function (el) {
    var end = parseInt(el.dataset.count, 10);
    var obj = { n: 0 };
    gsap.to(obj, {
      n: end,
      duration: 1.6,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      onUpdate: function () { el.textContent = Math.round(obj.n); }
    });
  });

  /* ---- Nav hides on scroll down, returns on scroll up ---- */
  var nav = document.querySelector('[data-nav]');
  if (nav) {
    ScrollTrigger.create({
      start: 'top top',
      end: 'max',
      onUpdate: function (self) {
        if (self.scroll() < 80) {
          nav.classList.remove('is-hidden');
        } else {
          nav.classList.toggle('is-hidden', self.direction === 1);
        }
      }
    });
  }
})();
