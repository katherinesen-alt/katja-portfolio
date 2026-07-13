/* Shared site header — one component, two states.
   Usage: <script src="header.js" data-state="home"></script>  (index)
          <script src="header.js" data-state="back"></script>  (case pages)
   Edit this file once; the header updates everywhere. */
(function () {
  var state = (document.currentScript && document.currentScript.dataset.state) || 'home';

  // ── Styles (injected once) ──────────────────────────────
  if (!document.getElementById('site-header-styles')) {
    var style = document.createElement('style');
    style.id = 'site-header-styles';
    style.textContent = [
      "#site-header{position:fixed;top:0;left:0;right:0;z-index:50;padding:24px 48px;pointer-events:none;display:flex;justify-content:space-between;align-items:center;background:#ffffff;font-family:'Onest',system-ui,sans-serif;}",
      "#site-header .hdr-side{pointer-events:auto;display:flex;align-items:center;gap:24px;}",
      "#site-header a{font-size:16px;font-weight:500;color:#040002;text-decoration:none;transition:color 200ms ease;}",
      "#site-header .hdr-nav a:hover,#site-header .hdr-back:hover{color:#1E35FF;}",
      "#site-header .cta-pill{display:inline-flex;align-items:center;justify-content:center;height:48px;padding:0 32px;border:none;border-radius:9999px;font-size:16px;font-weight:500;color:#ffffff;background:#040002;transition:background 200ms ease,color 200ms ease;}",
      "#site-header .cta-pill:hover{background:#1E35FF;color:#ffffff;}",
      "#mobile-menu-btn{display:none;width:40px;height:40px;flex-shrink:0;flex-direction:column;align-items:center;justify-content:center;gap:6px;background:transparent;border:none;padding:0;cursor:pointer;}",
      "#mobile-menu-btn .burger-line{display:block;width:24px;height:2.5px;background:#040002;border-radius:2px;transform-origin:center;transition:transform 350ms cubic-bezier(.65,0,.35,1),opacity 200ms ease;}",
      "#mobile-menu-btn.open .burger-line:nth-child(1){transform:translateY(8.5px) rotate(45deg);}",
      "#mobile-menu-btn.open .burger-line:nth-child(2){opacity:0;transform:scaleX(.4);}",
      "#mobile-menu-btn.open .burger-line:nth-child(3){transform:translateY(-8.5px) rotate(-45deg);}",
      "#mobile-menu{position:fixed;inset:0;background:#ffffff;z-index:60;display:flex;flex-direction:column;padding:100px 24px 32px;opacity:0;visibility:hidden;pointer-events:none;transition:opacity 320ms ease,visibility 320ms;}",
      "#mobile-menu.open{opacity:1;visibility:visible;pointer-events:auto;}",
      "#mobile-menu a{font-family:'Onest',system-ui,sans-serif;font-size:32px;font-weight:500;color:#040002;text-decoration:none;padding:16px 0;letter-spacing:-.01em;transition:color 200ms ease;}",
      "#mobile-menu a:hover{color:#1E35FF;}",
      "#site-header .hdr-back-icon{display:none;width:40px;height:40px;flex-shrink:0;align-items:center;justify-content:center;color:#040002;}",
      "#site-header .hdr-back-icon:hover{color:#1E35FF;}",
      "@media(max-width:768px){#site-header{padding:14px 16px;z-index:70;}#site-header .hdr-nav{display:none;}#site-header .cta-pill{height:40px;padding:0 20px;font-size:14px;}#mobile-menu-btn{display:flex;}}",
      // Case pages get the same mobile header as home: icon on the left, CTA stretched.
      // The arrow replaces the burger; the desktop '← Back' text link steps aside.
      // !important because each case page ships its own !important CTA sizing.
      "@media(max-width:768px){" +
        "#site-header.is-back .hdr-back-wrap{display:none !important;}" +
        "#site-header.is-back .hdr-side:last-child{width:100% !important;gap:24px !important;flex-direction:row-reverse !important;}" +
        "#site-header.is-back .cta-pill{flex:1 !important;height:56px !important;padding:0 16px !important;font-size:16px !important;}" +
        "#site-header.is-back .hdr-back-icon{display:flex !important;}" +
      "}"
    ].join('');
    document.head.appendChild(style);
  }

  var CTA = '<a class="cta-pill" href="https://tally.so/r/VLQD1l" target="_blank">Work with me</a>';

  var BACK_ICON = '<a class="hdr-back-icon" href="index.html" aria-label="Back">' +
    '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
    '<path d="M23 11.9951H2"/><path d="M12.5 22.5 2 12 12.5 1.5"/></svg></a>';

  var left, extra = '';
  if (state === 'back') {
    left = '<div class="hdr-side hdr-back-wrap"><a class="hdr-back" href="index.html">← Back</a></div>';
  } else {
    left = '<div class="hdr-side hdr-nav">' +
           '<a href="index.html#selected-work">Work</a>' +
           '<a href="https://www.linkedin.com/in/jekaterina-senina/" target="_blank">LinkedIn</a>' +
           '<a href="https://www.instagram.com/kathsenin/" target="_blank">Instagram</a></div>';
  }

  var rightInner = CTA;
  if (state === 'back') {
    // Sits where the burger sits on home — row-reverse floats it to the left edge.
    rightInner += BACK_ICON;
  } else {
    rightInner += '<button id="mobile-menu-btn" aria-label="Toggle menu" aria-expanded="false">' +
                  '<span class="burger-line"></span><span class="burger-line"></span><span class="burger-line"></span></button>';
    extra = '<div id="mobile-menu" aria-hidden="true">' +
            '<a href="index.html#selected-work">Work</a>' +
            '<a href="https://www.linkedin.com/in/jekaterina-senina/" target="_blank">LinkedIn</a>' +
            '<a href="https://www.instagram.com/kathsenin/" target="_blank">Instagram</a></div>';
  }

  var html = '<header id="site-header"' + (state === 'back' ? ' class="is-back"' : '') + '>' + left +
             '<div class="hdr-side">' + rightInner + '</div></header>' + extra;

  document.body.insertAdjacentHTML('afterbegin', html);

  // ── Mobile menu toggle (home state) ─────────────────────
  var btn = document.getElementById('mobile-menu-btn');
  var menu = document.getElementById('mobile-menu');
  if (btn && menu) {
    function setOpen(open) {
      btn.classList.toggle('open', open);
      menu.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open);
      menu.setAttribute('aria-hidden', !open);
      document.body.style.overflow = open ? 'hidden' : '';
    }
    btn.addEventListener('click', function () { setOpen(!btn.classList.contains('open')); });
    Array.prototype.forEach.call(menu.querySelectorAll('a'), function (a) {
      a.addEventListener('click', function () { setOpen(false); });
    });
  }
})();
