/* Smottie site - renders every page from window.SMOTTIE (js/data.js). */
(function () {
  var D = window.SMOTTIE;
  var page = document.body.getAttribute('data-page') || 'home';
  var root = document.getElementById('app');
  var lang = 'bg';
  try { lang = localStorage.getItem('smottie-lang') || 'bg'; } catch (e) {}
  var q = /[?&]lang=(bg|en)/.exec(location.search);
  if (q) lang = q[1];

  function L(o) { return o ? (o[lang] != null ? o[lang] : o.bg) || '' : ''; }
  function t(k) { return L(D.t[k]); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function img(src, alt, cls) { return src ? '<img' + (cls ? ' class="' + cls + '"' : '') + ' src="' + src + '" alt="' + esc(alt || '') + '" loading="lazy">' : ''; }
  function num(n, d) { return Number(n).toLocaleString(lang === 'bg' ? 'bg-BG' : 'en-GB', { minimumFractionDigits: d || 0, maximumFractionDigits: d || 0 }); }

  /* colour of a drink: the first ingredient in this list that it contains */
  var TINT = [['beetroot', '#9B2D4E'], ['pomegranate', '#B23A48'], ['spinach', '#6F9A4B'], ['parsley', '#7DA552'], ['raspberry', '#C8696F'], ['strawberry', '#D77B80'],
    ['avocado', '#A9BC68'], ['kiwi', '#9DB85C'], ['cucumber', '#B5CDA0'], ['carrot', '#E88A3A'], ['grapefruit', '#EE8E78'], ['mango', '#EFB640'], ['orange', '#F2A93B'],
    ['pineapple', '#EFD467'], ['celery', '#C7D796'], ['mint', '#BCD6A4'], ['lime', '#CFDD8A'], ['ginger', '#E3D08E'], ['lemon', '#EFE08C'], ['apple', '#D6DA8E']];
  var KIND = { coffee: '#B08968', icecream: '#F1E7D2', treats: '' };
  function tint(it) {
    if (it.keys) { for (var i = 0; i < TINT.length; i++) if (it.keys.indexOf(TINT[i][0]) > -1) return TINT[i][1]; }
    return KIND[it.kind] || '';
  }

  /* ---------- shared parts ---------- */
  function header(over) {
    function a(href, key, id) { return '<a href="' + href + '"' + (page === id ? ' aria-current="page"' : '') + '>' + t(key) + '</a>'; }
    return '<header class="hd' + (over ? ' hd--over' : '') + '">' +
      '<a class="logo logo--word" href="index.html" aria-label="smottie"></a>' +
      '<nav class="nav" id="nav">' + a('menu.html', 'nav_menu', 'menu') + a('about.html', 'nav_about', 'about') + a('visit.html', 'nav_visit', 'visit') + '</nav>' +
      '<div class="lang">' + ['bg', 'en'].map(function (l) { return '<button data-lang="' + l + '" aria-pressed="' + (l === lang) + '">' + l + '</button>'; }).join('') + '</div>' +
      '<button class="burger" aria-label="' + esc(t('open_menu')) + '" aria-controls="nav" aria-expanded="false"></button></header>';
  }
  function hours() {
    return '<div class="hours">' + D.contact.hours.map(function (h) { return '<span>' + L(h) + '</span><span>' + (h.time || (lang === 'bg' ? h.time_bg : h.time_en)) + '</span>'; }).join('') + '</div>';
  }
  function footer() {
    var c = D.contact;
    return '<footer class="ft"><span class="logo logo--full"></span><p class="ft__line">' + t('footer_line') + '</p>' +
      '<div class="ft__links"><a href="menu.html">' + t('nav_menu') + '</a><a href="about.html">' + t('nav_about') + '</a><a href="visit.html">' + t('nav_visit') + '</a>' +
      '<a href="' + c.instagram + '" target="_blank" rel="noopener">instagram</a><a href="' + c.facebook + '" target="_blank" rel="noopener">facebook</a></div>' +
      '<p class="ft__meta">' + t('address') + '<br><a href="tel:' + c.phone_link + '">' + c.phone + '</a><br>&copy; ' + new Date().getFullYear() + ' smottie</p></footer>';
  }
  function visitBlock(withImg) {
    var c = D.contact;
    return '<div><p class="label">' + t('nav_visit') + '</p><h2 class="h-lg" style="margin-top:10px">' + t('visit_h') + '</h2><p class="body" style="margin-top:14px">' + t('visit_p') + '</p>' +
      '<div class="info"><div><span class="label">' + t('address_h') + '</span>' + t('address') + '<br><span class="small">' + t('address_note') + '</span></div>' +
      '<div><span class="label">' + t('hours_h') + '</span>' + hours() + '</div>' +
      '<div><span class="label">' + t('phone_h') + '</span><a href="tel:' + c.phone_link + '">' + c.phone + '</a></div></div>' +
      '<a class="btn" href="' + c.maps + '" target="_blank" rel="noopener">' + t('open_maps') + '</a></div>' +
      (withImg ? img(D.images.visit, 'smottie', 'visit__img') : '');
  }

  /* ---------- home ---------- */
  function home() {
    var I = D.images;
    var tiles = D.cats.map(function (c) {
      return '<a class="tile-link" href="menu.html#' + c.id + '">' + img(c.cover, L(c.name)) + '<span>' + L(c.name) + '</span></a>';
    }).join('');
    return '<section class="hero">' + header(true) +
      '<div class="hero__in"><h1 class="sr">smottie</h1><span class="logo logo--full"></span><p class="hero__line">' + t('hero_line') + '</p><p class="hero__sub">' + t('hero_sub') + '</p>' +
      '<a class="btn btn--light" href="menu.html">' + t('hero_cta') + '</a></div>' +
      '<div class="hero__media" style="background-image:url(' + I.hero + ')">' +
      (D.video ? '<video muted loop playsinline preload="metadata" poster="' + I.hero + '" data-src="' + D.video + '"></video>' : '') + '</div></section>' +
      '<section class="sec intro center"><div class="wrap"><p class="h-xl">' + t('intro_big') + '</p><p class="body">' + t('intro_small') + '</p></div></section>' +
      '<section class="sec--tight"><div class="wrap duo">' +
      '<div>' + img(I.story, t('home_story_h'), 'duo__img') + '<h2 class="h-md">' + t('home_story_h') + '</h2><p class="body">' + t('home_story_p') + '</p><a class="btn" href="about.html">' + t('learn_more') + '</a></div>' +
      '<div>' + img(I.bottles, t('home_juice_h'), 'duo__img') + '<h2 class="h-md">' + t('home_juice_h') + '</h2><p class="body">' + t('home_juice_p') + '</p><a class="btn" href="menu.html">' + t('hero_cta') + '</a></div>' +
      '</div></section>' +
      '<section class="band" style="margin-top:clamp(64px,10vw,130px)"><p class="label">' + t('credo_label') + '</p><p class="band__words">' + t('credo_words') + '</p><p class="band__sub">' + t('credo_sub') + '</p></section>' +
      '<section class="sec"><div class="wrap"><h2 class="h-lg center">' + t('cats_h') + '</h2><div class="tiles">' + tiles + '</div></div></section>' +
      reviews() +
      '<section class="sec visit"><div class="wrap visit__grid">' + visitBlock(true) + '</div></section>';
  }
  function reviews() {
    if (!D.reviews || !D.reviews.length) return '';
    var q = lang === 'bg' ? ['&bdquo;', '&ldquo;'] : ['&ldquo;', '&rdquo;'];
    var items = D.reviews.map(function (r) {
      return '<figure class="rev"><blockquote>' + q[0] + esc(L(r)) + q[1] + '</blockquote><figcaption>' + esc(r.name) + '</figcaption></figure>';
    }).join('');
    return '<section class="sec center" style="padding-top:0"><div class="wrap"><p class="label">' + t('reviews_label') + '</p>' +
      '<h2 class="h-lg" style="margin:10px 0 14px">' + t('reviews_h') + '</h2>' +
      '<p class="stars" aria-hidden="true">★★★★★</p><p class="small">' + t('reviews_meta') + '</p>' +
      '<div class="revs">' + items + '</div>' +
      (t('reviews_translated') ? '<p class="small" style="margin-bottom:26px">' + t('reviews_translated') + '</p>' : '') +
      '<a class="btn" href="' + D.contact.maps + '" target="_blank" rel="noopener">' + t('reviews_all') + '</a></div></section>';
  }

  /* ---------- menu ---------- */
  function nutrition(it) {
    var n = it.nut, g = ' ' + t('g'), mg = ' ' + t('mg');
    if (!n) {
      if (it.kcal100) return '<div class="nf"><div class="nf__top"><span class="label">' + t('nutrition') + '</span></div><p class="nf__row"><span>' + t('n_kcal') + '</span><span>' + t('kcal100').replace('{n}', it.kcal100) + '</span></p></div>';
      return '<p class="nf__note">' + t('nut_pending') + '</p>';
    }
    function row(k, v, sub) { return '<div class="nf__row' + (sub ? ' nf__row--sub' : '') + '"><span>' + t(k) + '</span><span>' + v + '</span></div>'; }
    var drink = it.kind === 'drink';
    var size = drink ? t('serving') + ': ' + it.serving_ml + ' ' + t('ml') : (it.serving_g ? t('serving') + ': ' + it.serving_g + g : t('per100'));
    return '<div class="nf"><div class="nf__top"><span class="label">' + t('nutrition') + '</span><span class="small">' + size + '</span></div><div class="nf__cols"><div>' +
      row('n_kcal', num(n.kcal) + ' kcal') + row('n_fat', num(n.fat, 1) + g) + row('n_carbs', num(n.carbs, 1) + g) + row('n_sugars', num(n.sugars, 1) + g, true) + '</div><div>' +
      row('n_fibre', num(n.fibre, 1) + g) + row('n_protein', num(n.protein, 1) + g) + (n.vitc != null ? row('n_vitc', num(n.vitc) + mg) + row('n_potassium', num(n.potassium) + mg) : '') +
      '</div></div><p class="nf__note">' + t(!drink ? 'approx_treat' : (it.added_sugar ? 'approx_added' : 'approx')) + '</p></div>';
  }
  function card(it, grpName) {
    var c = tint(it), name = L(it.name);
    var al = it.allergens ? it.allergens.map(function (k) { return t(k); }) : (it.all ? L(it.all) : []);
    var pic = it.img ? '<span class="pic">' + img(it.img, name) + '</span>' : (c ? '<span class="pic"><i class="bowl"></i></span>' : '<span class="pic pic--plain"></span>');
    return '<article class="card" id="' + it.id + '" style="' + (c ? '--c:' + c : '') + '">' +
      '<button class="card__h" aria-expanded="false" aria-controls="b-' + it.id + '">' + pic +
      '<span class="card__name">' + (c ? '<i class="dot"></i>' : '') + '<span>' + esc(name) + '</span></span>' +
      '<span class="card__more"' + (c ? '' : ' style="padding-left:0"') + '><span>' + esc(it.serving_g ? it.serving_g + ' ' + t('g') : grpName) + '</span><i class="plus"></i></span></button>' +
      '<div class="card__b" id="b-' + it.id + '" hidden><p class="desc">' + esc(L(it.desc)) + '</p>' +
      '<span class="label">' + t('ingredients') + '</span><div class="chips">' + L(it.ing).map(function (x) { return '<span class="chip">' + esc(x) + '</span>'; }).join('') + '</div>' +
      '<p class="allerg"><b>' + t('allergens') + '</b>' + (al.length ? esc(al.join(', ')) : t('no_allergens')) + '</p>' + nutrition(it) + '</div></article>';
  }
  function menu() {
    var sub = D.cats.map(function (c) { return '<a href="#' + c.id + '">' + L(c.name) + '</a>'; }).join('');
    var cats = D.cats.map(function (c) {
      var groups = c.groups.map(function (g) {
        var title = c.groups.length > 1 ? '<h3 class="label grp__name">' + L(g.name) + '</h3>' : '';
        return '<div class="grp">' + title + '<div class="grid">' + g.items.map(function (it) { return card(it, L(g.name)); }).join('') + '</div></div>';
      }).join('');
      return '<section class="cat" id="' + c.id + '"><div class="wrap"><div class="cat__head"><h2 class="h-lg">' + L(c.name) + '</h2><p class="body">' + L(c.intro) + '</p></div>' + groups + '</div></section>';
    }).join('');
    return header() + '<div class="ph"><h1 class="h-lg">' + t('menu_h') + '</h1><p class="body">' + t('menu_p') + '</p></div>' +
      '<div class="subnav"><div class="subnav__in">' + sub + '</div></div>' + cats + '<div style="height:clamp(60px,9vw,120px)"></div>';
  }

  /* ---------- about ---------- */
  function about() {
    var I = D.images;
    var credo = D.t.credo.map(function (c) { return '<div class="credo__i"><p class="credo__w">' + c.w + '</p>' + (L(c) ? '<p class="credo__d">' + L(c) + '</p>' : '') + '</div>'; }).join('');
    return header() + '<div class="ph"><h1 class="h-lg">' + t('about_h') + '</h1></div>' +
      '<div class="wrap">' + img(I.about_hero, 'smottie', 'wide-img') + '</div>' +
      '<section class="sec--tight"><div class="wrap"><p class="lead">' + t('about_lead') + '</p></div></section>' +
      '<section><div class="wrap prose"><p>' + t('about_p1') + '</p><p>' + t('home_story_p') + '</p><p>' + t('about_p2') + '</p><p>' + t('about_p3') + '</p></div></section>' +
      '<section class="sec--tight"><div class="wrap pair">' + img(I.about_door, 'smottie') + img(I.about_bottles, 'smottie') + '</div></section>' +
      '<section class="sec--tight"><div class="wrap"><h2 class="h-lg center">' + t('credo_h') + '</h2><div class="credo">' + credo + '</div></div></section>' +
      '<section class="band" style="margin-top:clamp(40px,6vw,80px)"><p class="quote">&bdquo;' + t('ice_quote') + '&ldquo;</p><p class="band__sub" style="margin-top:14px">' + t('ice_quote_by') + '</p></section>' +
      '<section class="sec"><div class="wrap duo"><div>' + img(I.about_ice, t('ice_h'), 'duo__img') + '</div><div><h2 class="h-lg">' + t('ice_h') + '</h2><p class="body" style="margin:22px 0 18px">' + t('ice_p1') + '</p><p class="body" style="margin-bottom:28px">' + t('ice_p2') + '</p><a class="btn" href="menu.html#icecream">' + t('hero_cta') + '</a></div></div></section>';
  }

  /* ---------- visit ---------- */
  function visit() {
    var c = D.contact;
    return header() + '<section class="sec--tight"><div class="wrap visit__grid">' + visitBlock(true) + '</div></section>' +
      '<section class="sec--tight center"><div class="wrap"><p class="small">' + t('hours_note') + '</p><p class="label" style="margin:34px 0 12px">' + t('follow_h') + '</p>' +
      '<div class="ft__links" style="margin:0"><a href="' + c.instagram + '" target="_blank" rel="noopener">instagram</a><a href="' + c.facebook + '" target="_blank" rel="noopener">facebook</a></div></div></section>' +
      '<div class="wrap">' + img(D.images.about_inside, 'smottie', 'wide-img') + '</div>';
  }

  /* ---------- behaviour ---------- */
  function openCard(card, scroll) {
    var was = card.classList.contains('open');
    Array.prototype.forEach.call(root.querySelectorAll('.card.open'), function (c) {
      c.classList.remove('open'); c.querySelector('.card__b').hidden = true; c.querySelector('.card__h').setAttribute('aria-expanded', 'false');
    });
    if (!was) {
      card.classList.add('open'); card.querySelector('.card__b').hidden = false; card.querySelector('.card__h').setAttribute('aria-expanded', 'true');
      if (scroll !== false) card.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }
  }
  function render() {
    document.documentElement.lang = lang;
    var pages = { home: home, menu: menu, about: about, visit: visit };
    root.innerHTML = '<main>' + (pages[page] || home)() + '</main>' + footer();
    document.body.classList.remove('nav-open');
    var titles = { home: 'smottie', menu: t('nav_menu') + ' · smottie', about: t('nav_about') + ' · smottie', visit: t('nav_visit') + ' · smottie' };
    document.title = titles[page] || 'smottie';
    var v = root.querySelector('.hero video');
    if (v && !(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)) {
      v.src = v.getAttribute('data-src');
      var p = v.play(); if (p && p.catch) p.catch(function () {});
    } else if (v) { v.remove(); }
    if (page === 'menu') spy();
  }
  function spy() {
    if (!('IntersectionObserver' in window)) return;
    var links = root.querySelectorAll('.subnav a');
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        Array.prototype.forEach.call(links, function (a) {
          var on = a.getAttribute('href') === '#' + e.target.id; a.classList.toggle('on', on);
          if (on && a.parentNode.scrollWidth > a.parentNode.clientWidth) a.parentNode.scrollLeft = a.offsetLeft - 20;
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Array.prototype.forEach.call(root.querySelectorAll('.cat'), function (s) { io.observe(s); });
  }
  function toHash() {
    var id = decodeURIComponent(location.hash.slice(1)); if (!id) return;
    var el = document.getElementById(id); if (!el) return;
    if (el.classList.contains('card')) { if (!el.classList.contains('open')) openCard(el); }
    else el.scrollIntoView({ block: 'start' });
  }

  root.addEventListener('click', function (e) {
    var b = e.target.closest('[data-lang]');
    if (b) { lang = b.getAttribute('data-lang'); try { localStorage.setItem('smottie-lang', lang); } catch (x) {} var y = window.scrollY; render(); window.scrollTo(0, y); return; }
    if (e.target.closest('.burger')) { var on = document.body.classList.toggle('nav-open'); e.target.closest('.burger').setAttribute('aria-expanded', on); return; }
    var h = e.target.closest('.card__h');
    if (h) openCard(h.parentNode);
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') document.body.classList.remove('nav-open'); });
  window.addEventListener('hashchange', toHash);

  render();
  if (location.hash) setTimeout(toHash, 60);
})();
