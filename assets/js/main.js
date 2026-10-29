// CMCI Picardie — interactions du site
(function () {
  // En-tête : fond au défilement
  var header = document.querySelector('.header');
  if (header && !header.classList.contains('header--solid')) {
    var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 40); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Menu mobile
  var burger = document.querySelector('.burger');
  var nav = document.querySelector('.nav');
  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', open);
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { nav.classList.remove('is-open'); });
    });
  }

  // Carrousel du hero
  var slides = document.querySelectorAll('.slide');
  var dotsWrap = document.querySelector('.hero__dots');
  if (slides.length && dotsWrap) {
    var current = 0, timer;
    slides.forEach(function (_, i) {
      var b = document.createElement('button');
      b.setAttribute('aria-label', 'Diapositive ' + (i + 1));
      b.addEventListener('click', function () { go(i); restart(); });
      dotsWrap.appendChild(b);
    });
    var dots = dotsWrap.querySelectorAll('button');
    function go(i) {
      slides[current].classList.remove('is-active');
      dots[current].classList.remove('is-active');
      current = (i + slides.length) % slides.length;
      slides[current].classList.add('is-active');
      dots[current].classList.add('is-active');
    }
    function restart() { clearInterval(timer); timer = setInterval(function () { go(current + 1); }, 6500); }
    document.querySelector('.hero__arrow--prev').addEventListener('click', function () { go(current - 1); restart(); });
    document.querySelector('.hero__arrow--next').addEventListener('click', function () { go(current + 1); restart(); });
    go(0);
    restart();
  }

  // Carrousel de la littérature : défilement automatique, flèches, glisser au doigt
  var track = document.querySelector('.books-track');
  if (track) {
    var books = track.querySelectorAll('.book');
    var counter = document.querySelector('[data-books-current]');
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var paused = false, autoTimer;
    function step() { return books.length > 1 ? books[1].offsetLeft - books[0].offsetLeft : track.clientWidth; }
    function atEnd() { return track.scrollLeft + track.clientWidth >= track.scrollWidth - 4; }
    function move(dir) {
      if (dir > 0 && atEnd()) track.scrollTo({ left: 0 });
      else if (dir < 0 && track.scrollLeft <= 4) track.scrollTo({ left: track.scrollWidth });
      else track.scrollBy({ left: dir * step() });
    }
    document.querySelector('[data-books-prev]').addEventListener('click', function () { move(-1); restartAuto(); });
    document.querySelector('[data-books-next]').addEventListener('click', function () { move(1); restartAuto(); });
    track.addEventListener('scroll', function () {
      if (counter) counter.textContent = Math.min(books.length, Math.round(track.scrollLeft / step()) + 1);
    }, { passive: true });
    ['mouseenter', 'focusin', 'touchstart'].forEach(function (ev) {
      track.addEventListener(ev, function () { paused = true; }, { passive: true });
    });
    ['mouseleave', 'focusout'].forEach(function (ev) {
      track.addEventListener(ev, function () { paused = false; });
    });
    track.addEventListener('touchend', function () { setTimeout(function () { paused = false; }, 4000); }, { passive: true });
    function restartAuto() {
      clearInterval(autoTimer);
      if (reduceMotion) return;
      autoTimer = setInterval(function () { if (!paused && !document.hidden) move(1); }, 3500);
    }
    restartAuto();
  }

  // Apparition au défilement
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // Année du pied de page
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
