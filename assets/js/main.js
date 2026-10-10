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

  // Filtres de la littérature
  var filterBtns = document.querySelectorAll('.filters button');
  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) { b.classList.remove('is-active'); });
      btn.classList.add('is-active');
      var f = btn.dataset.filter;
      document.querySelectorAll('.book').forEach(function (book) {
        book.style.display = (f === 'all' || book.classList.contains('book--' + f)) ? '' : 'none';
      });
    });
  });

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

  // Formulaires : si aucun service d'envoi n'est configuré (attribut action vide),
  // on affiche simplement un message de confirmation.
  document.querySelectorAll('form[data-demo]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      if (form.getAttribute('action')) return;
      e.preventDefault();
      form.reset();
      var ok = form.querySelector('.form__success');
      if (ok) ok.classList.add('is-visible');
    });
  });

  // Année du pied de page
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
