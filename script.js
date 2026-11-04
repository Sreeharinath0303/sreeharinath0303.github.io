/* =============================================
   CINEMATIC PORTFOLIO SCRIPT — Sree Harinath K
   ============================================= */

/* ══════════════════════════════════════════════
   01. INTRO SEQUENCE
══════════════════════════════════════════════ */
(function introSequence() {
  const intro  = document.getElementById('cinematic-intro');
  const main   = document.getElementById('mainSite');
  const skip   = document.getElementById('introSkip');
  const canvas = document.getElementById('introCanvas');
  const ctx    = canvas ? canvas.getContext('2d') : null;

  if (!intro || !ctx) return;

  // Resize intro canvas
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  // Star field for intro
  const stars = Array.from({length:200}, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.5,
    a: Math.random() * 0.8 + 0.1,
    speed: Math.random() * 0.3 + 0.05
  }));

  let introRunning = true;
  function drawIntro() {
    if (!introRunning) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => {
      s.y -= s.speed;
      if (s.y < 0) { s.y = canvas.height; s.x = Math.random() * canvas.width; }
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(245,158,11,${s.a})`;
      ctx.fill();
    });
    requestAnimationFrame(drawIntro);
  }
  drawIntro();

  // Open letterboxes after short delay
  setTimeout(() => {
    document.querySelector('.letterbox.top').classList.add('open');
    document.querySelector('.letterbox.bottom').classList.add('open');
  }, 2200);

  function exitIntro() {
    introRunning = false;
    intro.classList.add('exit');
    main.classList.remove('hidden');
    requestAnimationFrame(() => { main.style.opacity='0'; });
    setTimeout(() => {
      main.style.transition = 'opacity 0.8s ease';
      main.style.opacity = '1';
      main.classList.add('visible');
      intro.style.display = 'none';
      initMainSite();
    }, 1200);
  }

  // Auto exit after animation
  setTimeout(exitIntro, 4200);

  // Skip on keypress / click
  document.addEventListener('keydown', exitIntro, {once:true});
  skip.addEventListener('click', exitIntro, {once:true});
  intro.addEventListener('click', exitIntro, {once:true});
})();

/* ══════════════════════════════════════════════
   02. MAIN SITE INIT
══════════════════════════════════════════════ */
function initMainSite() {

  /* — Cursor — */
  const dot  = document.getElementById('curDot');
  const ring = document.getElementById('curRing');
  let mx=0, my=0, rx=0, ry=0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx+'px'; dot.style.top = my+'px';
    // Ambient light follows cursor
    const al = document.getElementById('ambientLight');
    if (al) { al.style.left = mx+'px'; al.style.top = my+'px'; }
  });

  (function animRing() {
    rx += (mx-rx)*0.1; ry += (my-ry)*0.1;
    ring.style.left = rx+'px'; ring.style.top = ry+'px';
    requestAnimationFrame(animRing);
  })();

  // Universal interactive hover delegation (works inside modals, vaults, and dynamic elements)
  document.addEventListener('mouseover', e => {
    if (e.target.closest('a, button, .pcg-card, .pcg-3d-deck, .p3d-trigger, .award-cin, .cert-cin-card, .hex-cell, .cl-item, .amc, .wf-step, .vault-close-btn, .vtech-pill, .btn-cin')) {
      dot.classList.add('hov');
      ring.classList.add('hov');
    }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest('a, button, .pcg-card, .pcg-3d-deck, .p3d-trigger, .award-cin, .cert-cin-card, .hex-cell, .cl-item, .amc, .wf-step, .vault-close-btn, .vtech-pill, .btn-cin')) {
      dot.classList.remove('hov');
      ring.classList.remove('hov');
    }
  });

  /* — Star Canvas (hero background) — */
  (function starField() {
    const c = document.getElementById('starCanvas');
    if (!c) return;
    const ctx = c.getContext('2d');
    let W, H;

    function resize() { W = c.width = window.innerWidth; H = c.height = window.innerHeight; }
    resize();
    window.addEventListener('resize', resize);

    // Three layers: distant, mid, near
    const layers = [
      { count:120, speed:0.08, maxR:1,   alpha:0.4,  color:'255,255,255' },
      { count:60,  speed:0.2,  maxR:1.5, alpha:0.6,  color:'245,158,11' },
      { count:30,  speed:0.4,  maxR:2,   alpha:0.5,  color:'139,92,246' },
    ];
    const stars = [];
    layers.forEach(l => {
      for (let i=0; i<l.count; i++) {
        stars.push({
          x: Math.random()*W, y: Math.random()*H,
          r: Math.random()*l.maxR+0.3,
          a: Math.random()*l.alpha+0.1,
          speed: l.speed + Math.random()*l.speed,
          color: l.color,
          twinkle: Math.random()*2*Math.PI
        });
      }
    });

    // Nebula particles (bokeh)
    const bokeh = Array.from({length:20}, ()=>({
      x: Math.random()*W, y: Math.random()*H,
      r: Math.random()*80+30,
      a: Math.random()*0.04+0.01,
      color: Math.random()>0.5?'245,158,11':'139,92,246',
      drift: (Math.random()-0.5)*0.3
    }));

    let scrollY = 0;
    window.addEventListener('scroll', () => { scrollY = window.scrollY; }, {passive:true});

    let t = 0;
    function loop() {
      ctx.clearRect(0,0,W,H);
      t += 0.01;

      // Bokeh
      bokeh.forEach(b => {
        ctx.beginPath();
        const g = ctx.createRadialGradient(b.x,b.y,0,b.x,b.y,b.r);
        g.addColorStop(0, `rgba(${b.color},${b.a})`);
        g.addColorStop(1, 'transparent');
        ctx.fillStyle = g;
        ctx.arc(b.x,b.y,b.r,0,Math.PI*2);
        ctx.fill();
        b.x += b.drift;
        if (b.x<-b.r) b.x=W+b.r;
        if (b.x>W+b.r) b.x=-b.r;
      });

      // Stars with parallax
      stars.forEach(s => {
        s.twinkle += 0.03;
        const alpha = s.a*(0.7+0.3*Math.sin(s.twinkle));
        ctx.beginPath();
        ctx.arc(s.x, s.y - scrollY*s.speed*0.1, s.r, 0, Math.PI*2);
        ctx.fillStyle = `rgba(${s.color},${alpha})`;
        ctx.fill();

        // Subtle drift
        s.x += s.drift||0;
        if (s.x<0) s.x=W; if (s.x>W) s.x=0;
      });

      requestAnimationFrame(loop);
    }
    loop();
  })();

  /* — Contact canvas (wave effect) — */
  (function contactCanvas() {
    const c = document.getElementById('contactCanvas');
    if (!c) return;
    const ctx = c.getContext('2d');
    function resize() { c.width = c.offsetWidth; c.height = c.offsetHeight; }
    resize();
    window.addEventListener('resize', resize);
    let t = 0;
    function loop() {
      ctx.clearRect(0,0,c.width,c.height);
      for (let w=0;w<3;w++) {
        ctx.beginPath();
        ctx.moveTo(0, c.height/2);
        for (let x=0;x<c.width;x++) {
          const y = c.height/2 + Math.sin((x*0.008)+(t*0.5)+(w*1.2))*30*(1-w*0.2);
          ctx.lineTo(x,y);
        }
        ctx.strokeStyle = `rgba(245,158,11,${0.03-w*0.008})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      t++;
      requestAnimationFrame(loop);
    }
    loop();
  })();

  /* — Scroll progress — */
  const prog = document.getElementById('scrollProgress');
  const btt  = document.getElementById('bttBtn');
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    const max = document.body.scrollHeight - window.innerHeight;
    if (prog) prog.style.width = (sy/max*100)+'%';
    if (btt)  btt.classList.toggle('vis', sy>400);
    if (navbar) navbar.classList.toggle('scrolled', sy>60);

    // Active scene nav
    document.querySelectorAll('.scene[id]').forEach(sec => {
      const top = sec.offsetTop - 150;
      const bot = top + sec.offsetHeight;
      if (sy >= top && sy < bot) {
        document.querySelectorAll('.scene-item').forEach(i=>i.classList.remove('active'));
        document.querySelectorAll('.nav-link').forEach(i=>i.classList.remove('active'));
        const si = document.querySelector(`.scene-item[href="#${sec.id}"]`);
        const nl = document.querySelector(`.nav-link[href="#${sec.id}"]`);
        if (si) si.classList.add('active');
        if (nl) nl.classList.add('active');
      }
    });
  }, {passive:true});

  /* — Hamburger — */
  const ham = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (ham) ham.addEventListener('click', ()=>navLinks.classList.toggle('open'));
  document.querySelectorAll('.nav-link').forEach(l=>l.addEventListener('click',()=>navLinks.classList.remove('open')));

  /* — Typed text — */
  const roles = [
    'Website Developer',
    'Java Developer',
    'Prompt Engineer',
    'MERN & MongoDB',
    'IoT Solutions',
    'DSA in Java',
    'Full-Stack Products',
    'Digital Experiences'
  ];
  let ri=0, ci=0, del=false;
  const typedEl = document.getElementById('typed');
  function typeEffect() {
    if (!typedEl) return;
    const cur = roles[ri];
    const chars = Array.from(cur);
    typedEl.textContent = del ? chars.slice(0,ci-1).join('') : chars.slice(0,ci+1).join('');
    del ? ci-- : ci++;
    if (!del && ci===chars.length) { del=true; setTimeout(typeEffect,2000); return; }
    if (del && ci===0) { del=false; ri=(ri+1)%roles.length; }
    setTimeout(typeEffect, del?55:85);
  }
  setTimeout(typeEffect, 500);

  /* — Hero stat counters — */
  function countUp(el, target) {
    let n=0, step=target/50;
    const id = setInterval(()=>{
      n = Math.min(n+step, target);
      el.textContent = Math.floor(n);
      if (n>=target) clearInterval(id);
    }, 35);
  }

  /* — INTERSECTION OBSERVER (all reveals) — */
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;

      // Generic reveals
      if (el.classList.contains('cin-reveal')||el.classList.contains('cin-left')||
          el.classList.contains('cin-right')||el.classList.contains('cin-up')) {
        el.classList.add('vis');
      }

      // Cinematic word-by-word hero title
      if (el.classList.contains('ht-word')) {
        const delay = parseFloat(el.closest('.ht-line')?.dataset.delay||0);
        el.style.transitionDelay = delay+'s';
        el.classList.add('vis');
      }

      // Skill bars
      if (el.classList.contains('csk-item')) {
        const fill = el.querySelector('.csk-fill');
        if (fill && !fill.dataset.done) {
          fill.dataset.done='1';
          setTimeout(()=>fill.classList.add('ani'), 100);
        }
      }

      // Hero stat counters
      if (el.classList.contains('hstat')) {
        const num = el.querySelector('.hstat-n');
        if (num && !num.dataset.done) {
          num.dataset.done='1';
          countUp(num, parseInt(num.dataset.to));
        }
      }

      obs.unobserve(el);
    });
  }, {threshold:0.15});

  // Register all animated elements
  ['.cin-reveal','.cin-left','.cin-right','.cin-up',
   '.ht-word','.csk-item','.hstat'].forEach(sel => {
    document.querySelectorAll(sel).forEach((el,i)=>{
      if (sel==='.cin-up'||sel==='.cin-reveal') {
        if (!el.style.getPropertyValue('--d')) el.style.setProperty('--d',`${i*0.07}s`);
      }
      obs.observe(el);
    });
  });

  // Immediately activate hero scene elements (never wait for scroll above the fold)
  document.querySelectorAll('#hero .cin-reveal, #hero .ht-word, #hero .cin-line').forEach(el => {
    el.classList.add('vis');
  });
  document.querySelectorAll('#hero .hstat').forEach(el => {
    const num = el.querySelector('.hstat-n');
    if (num && !num.dataset.done) {
      num.dataset.done = '1';
      countUp(num, parseInt(num.dataset.to));
    }
  });

  /* — Project filter — */
  document.querySelectorAll('.pf-btn').forEach(btn => {
    btn.addEventListener('click', ()=>{
      document.querySelectorAll('.pf-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.f;
      document.querySelectorAll('.pcg-card').forEach((card,i)=>{
        const show = f==='all'||card.dataset.cat===f;
        card.style.display = show?'flex':'none';
        if (show) {
          card.style.opacity='0'; card.style.transform='translateY(24px)';
          setTimeout(()=>{
            card.style.transition='opacity 0.5s ease,transform 0.5s ease';
            card.style.opacity='1'; card.style.transform='none';
          }, i*80);
        }
      });
    });
  });

  /* — Magnetic buttons — */
  document.querySelectorAll('.mag-btn,.nav-cta').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width/2) * 0.3;
      const y = (e.clientY - r.top  - r.height/2) * 0.3;
      btn.style.transform = `translate(${x}px,${y}px)`;
    });
    btn.addEventListener('mouseleave', ()=>{ btn.style.transform=''; });
  });

  /* — 3D card tilt — */
  document.querySelectorAll('.pcg-card,.award-cin,.cert-cin-card,.exp-cin-card,.profile-card-cin').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX-r.left)/r.width  - 0.5;
      const y = (e.clientY-r.top) /r.height - 0.5;
      card.style.transform = `perspective(700px) rotateX(${-y*8}deg) rotateY(${x*8}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', ()=>{ card.style.transform=''; });
  });

  /* — Button glow spotlight — */
  document.querySelectorAll('.btn-cin.primary').forEach(btn => {
    const glow = btn.querySelector('.btn-glow');
    if (!glow) return;
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = ((e.clientX-r.left)/r.width*100)+'%';
      const y = ((e.clientY-r.top)/r.height*100)+'%';
      glow.style.setProperty('--bx',x);
      glow.style.setProperty('--by',y);
    });
  });

  /* — Avatar 3D parallax (hero) — */
  const avatarCin = document.getElementById('avatarCinema');
  document.addEventListener('mousemove', e => {
    if (!avatarCin) return;
    const cx = window.innerWidth/2, cy = window.innerHeight/2;
    const rx = ((e.clientY-cy)/cy)*-8;
    const ry = ((e.clientX-cx)/cx)*8;
    avatarCin.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  });

  /* — Contact form — */
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn  = form.querySelector('.submit-cin');
      const icon = btn.querySelector('i');
      const span = btn.querySelector('span:last-child');
      btn.disabled = true;
      icon.className = 'fas fa-spinner fa-spin';
      span.textContent = 'Sending...';
      setTimeout(()=>{
        icon.className = 'fas fa-check';
        span.textContent = 'Message Sent!';
        btn.style.background = 'linear-gradient(135deg,#10b981,#059669)';
        btn.style.color = '#fff';
        form.reset();
        setTimeout(()=>{
          icon.className = 'fas fa-paper-plane';
          span.textContent = 'Send Message';
          btn.style.background = '';
          btn.style.color = '';
          btn.disabled = false;
        }, 4000);
      }, 1800);
    });
  }

  /* — Smooth anchor scroll — */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({behavior:'smooth'}); }
    });
  });

  /* — Cinematic section entrance (subtle bg shift) — */
  const sections = document.querySelectorAll('.scene');
  const sectionColors = {
    'hero':         'rgba(245,158,11,0.03)',
    'about':        'rgba(139,92,246,0.03)',
    'skills':       'rgba(6,182,212,0.03)',
    'projects':     'rgba(245,158,11,0.03)',
    'achievements': 'rgba(16,185,129,0.03)',
    'contact':      'rgba(139,92,246,0.03)'
  };
  const bgObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const id = e.target.id;
        document.body.style.transition = 'background-color 1s ease';
        const tint = sectionColors[id];
        if (tint) document.body.style.background = `radial-gradient(ellipse at 50% 50%,${tint} 0%,#04040a 70%)`;
      }
    });
  }, {threshold:0.4});
  sections.forEach(s => bgObs.observe(s));

  /* ══════════════════════════════════════════════
     03. CINEMATIC PROJECT GATE / VAULT LOGIC
  ══════════════════════════════════════════════ */
  const projectsData = {
    'phone-repair': {
      title: 'Phone Repair Portal',
      badge: 'Java Full Stack · Enterprise Web',
      icon: '📱',
      tagline: 'End-to-End Service Booking, Diagnostics & Live Ticket Tracking Portal',
      checklist: [
        '<strong>Architected Full Lifecycle Portal:</strong> Designed a service booking, diagnostic ticketing, and real-time repair progress tracking platform using Java and SQL database.',
        '<strong>Dual-Portal Dashboards:</strong> Built dedicated views for customers (booking appointments, viewing repair timeline, invoice downloads) and technicians (updating diagnostic stages, spare part consumption, labor costs).',
        '<strong>Automated Stage Transition Alerts:</strong> Implemented state machine trigger notifications (Received ➔ Inspection ➔ Repairing ➔ QA Tested ➔ Ready for Pickup) with email/SMS status hooks.',
        '<strong>SQL Query Optimization:</strong> Structured normalized relational schemas with indexes on customer phone/ticket ID, reducing database lookup latency by 35% under peak loads.'
      ],
      tech: ['Java', 'SQL / MySQL', 'JDBC', 'HTML5 / CSS3', 'JavaScript', 'REST APIs', 'Spring Architecture'],
      impact: [
        { num: '35%', label: 'Query Latency Reduction' },
        { num: '5-Stage', label: 'Live Tracking Lifecycle' },
        { num: '100%', label: 'Automated Status Audits' }
      ],
      flow: [
        { step: '01', title: 'Customer Booking & Intake', desc: 'Customer submits device model, issue description, and preferred appointment slot via responsive portal.' },
        { step: '02', title: 'Java Controller & Input Sanitization', desc: 'Backend validates payload, assigns unique UUID ticket, and persists initial record into database.' },
        { step: '03', title: 'Technician Diagnosis & Part Allocation', desc: 'Technician opens ticket console, records fault analysis, and reserves required spare components.' },
        { step: '04', title: 'Live State Machine Updates', desc: 'Each stage shift triggers asynchronous notifications and updates the live customer progress bar.' },
        { step: '05', title: 'Billing, Quality Sign-Off & Pickup', desc: 'Automated invoice generation with itemized parts & labor; customer receives pickup verification OTP.' }
      ],
      demoUrl: '#',
      codeUrl: '#'
    },

    'crm-lms': {
      title: 'CRM & LMS Suite',
      badge: 'MERN Stack · Cloud Web App',
      icon: '🏢',
      tagline: 'Unified Customer Relationship Management & Course Learning Management Suite',
      checklist: [
        '<strong>Full-Stack Architecture:</strong> Engineered an integrated dual-purpose platform combining CRM (lead pipelines, deals, sales analytics) and LMS (course catalog, video modules, student grading).',
        '<strong>MERN RESTful Services:</strong> Designed high-performance REST APIs in Node.js & Express with MongoDB aggregation pipelines for deep student engagement analytics.',
        '<strong>Secure Role-Based Access (RBAC):</strong> Integrated JWT authentication with multi-tier authorization layers for Admins, Instructors, Corporate Clients, and Students.',
        '<strong>Interactive Course Delivery:</strong> Created responsive React interface with interactive video players, chapter bookmarks, quiz evaluators, and auto-generated PDF completion certificates.'
      ],
      tech: ['MongoDB', 'Express.js', 'React.js', 'Node.js', 'JWT', 'REST APIs', 'Tailwind CSS', 'Redux'],
      impact: [
        { num: '2-in-1', label: 'Integrated CRM + LMS Platform' },
        { num: 'RBAC', label: 'Multi-Role Security Middleware' },
        { num: 'Real-time', label: 'Progress Tracking & Analytics' }
      ],
      flow: [
        { step: '01', title: 'Lead & Student Onboarding', desc: 'Prospective students register or are ingested via CRM lead forms into MongoDB database.' },
        { step: '02', title: 'JWT Authentication & Role Check', desc: 'Express middleware verifies token claims and routes user to their custom dashboard.' },
        { step: '03', title: 'LMS Engine & Content Streaming', desc: 'React frontend requests curriculum modules; backend streams lessons and tracks playback timestamps.' },
        { step: '04', title: 'Interactive Assessments & Grades', desc: 'Automated quiz evaluations score attempts and update progress bars in MongoDB in real time.' },
        { step: '05', title: 'CRM Analytics & Certificate Issuance', desc: 'Upon course completion, system triggers celebratory certificate generation and notifies instructor.' }
      ],
      demoUrl: '#',
      codeUrl: '#'
    },

    'lingua': {
      title: 'Lingua Circle Platform',
      badge: 'React · Interactive UI/UX · EdTech',
      icon: '🌐',
      tagline: 'Interactive, Gamified Language-Learning Platform with Adaptive UI/UX',
      checklist: [
        '<strong>Intuitive Learning Interface:</strong> Designed from scratch a modern, accessible user interface optimized for high engagement, retention streaks, and spaced repetition.',
        '<strong>Modular Component Library:</strong> Built custom React components for flip vocabulary flashcards, pronunciation listening checks, and matching challenges.',
        '<strong>State Management & Persistence:</strong> Leveraged React Context API and local caching to deliver instant lesson transitions and offline practice continuity.',
        '<strong>Accessibility & Performance:</strong> Built with semantic HTML, fluid typography, and CSS micro-interactions, hitting 95+ performance scores on Lighthouse.'
      ],
      tech: ['React.js', 'JavaScript (ES6+)', 'CSS3 Modules', 'Web Audio API', 'Figma UX/UI', 'Context API'],
      impact: [
        { num: '95+', label: 'Lighthouse Performance Score' },
        { num: '0ms', label: 'Instant Offline Lesson Cache' },
        { num: 'Gamified', label: 'Daily Streak & Quiz System' }
      ],
      flow: [
        { step: '01', title: 'User Level Placement Quiz', desc: 'Learner selects target language and completes a short interactive proficiency calibration.' },
        { step: '02', title: 'Dynamic Lesson Dispatcher', desc: 'React router dispatches bite-sized modular exercises (vocabulary, grammar, listening).' },
        { step: '03', title: 'Audio & Interactive Response', desc: 'Web Audio API provides native pronunciation audio; interactive widgets validate answers on the fly.' },
        { step: '04', title: 'Streak & Score Calculation', desc: 'Context state recalculates accuracy percentages, awarding experience points and streak bonuses.' },
        { step: '05', title: 'Milestone Badges & Next Step', desc: 'Animated confetti and visual achievements unlock the next progressive difficulty tier.' }
      ],
      demoUrl: '#',
      codeUrl: '#'
    },

    'kulur': {
      title: 'Business Development — Kulur Project',
      badge: 'Strategy · Growth Engineering · Analytics',
      icon: '📈',
      tagline: 'Strategic Business Expansion, Funnel Optimization & Market Automation',
      checklist: [
        '<strong>Growth & Outreach Operations:</strong> Spearheaded strategic growth planning for the Kulur Project, mapping customer acquisition channels and conversion touchpoints.',
        '<strong>Data-Driven Market Research:</strong> Analyzed demographic target segments, competitive landscape offerings, and customer retention metrics to guide product pricing tiers.',
        '<strong>Workflow Automation:</strong> Built automated spreadsheet models and lead qualification pipelines, cutting manual client outreach prep time by 40%.',
        '<strong>Cross-Functional Collaboration:</strong> Acted as the technical liaison connecting marketing initiatives with software development deliverables to prioritize high-ROI features.'
      ],
      tech: ['Market Strategy', 'Funnel Analytics', 'Lead Generation', 'Workflow Automation', 'Data Visualization', 'SQL Reporting'],
      impact: [
        { num: '40%', label: 'Manual Prep Time Saved' },
        { num: 'Targeted', label: 'Segment Pricing Architecture' },
        { num: 'High-ROI', label: 'Feature Priority Framework' }
      ],
      flow: [
        { step: '01', title: 'Market Demographics Discovery', desc: 'Analyzed competitive landscape and customer behavior data to define target segments.' },
        { step: '02', title: 'Funnel Blueprinting & Mapping', desc: 'Designed multi-tier acquisition funnel from initial awareness touchpoints to qualified leads.' },
        { step: '03', title: 'Automated Pipeline Ingestion', desc: 'Integrated automated workflows to log, score, and categorize inbound stakeholder inquiries.' },
        { step: '04', title: 'Conversion Analytics & Pitching', desc: 'Delivered tailored value propositions with empirical ROI metrics to partner organizations.' },
        { step: '05', title: 'Feedback Loop & Strategy Iteration', desc: 'Continuous weekly performance tracking to calibrate messaging and accelerate market penetration.' }
      ],
      demoUrl: '#',
      codeUrl: '#'
    },

    'braille': {
      title: 'Braille Keyboard (Raspberry Pi)',
      badge: 'IoT · Assistive Hardware · Python',
      icon: '⌨️',
      tagline: 'Inclusive Hardware-Software Keyboard for Visually Impaired Computer Access',
      checklist: [
        '<strong>Assistive Hardware Innovation:</strong> Developed an inclusive tactile input system using a Raspberry Pi microprocessor to allow visually impaired users to type and navigate computers.',
        '<strong>Python Chording Algorithm:</strong> Engineered a custom chord-to-character parser in Python that interprets simultaneous 6-key Braille combinations into ASCII text and commands.',
        '<strong>Text-to-Speech (TTS) Verification:</strong> Integrated real-time auditory feedback through an audio synthesis engine, pronouncing each typed letter or word through headphones/speaker.',
        '<strong>Plug-and-Play USB HID Emulation:</strong> Programmed the Raspberry Pi to act as a standard USB Human Interface Device (HID), requiring zero drivers on host PCs.'
      ],
      tech: ['Raspberry Pi', 'Python', 'Linux / Raspbian', 'GPIO Architecture', 'TTS Audio Engine', 'Hardware Prototyping'],
      impact: [
        { num: '6-Key', label: 'Tactile Braille Input Array' },
        { num: 'Real-time', label: 'Voice Audio Feedback (TTS)' },
        { num: 'Plug & Play', label: 'Universal USB HID Support' }
      ],
      flow: [
        { step: '01', title: 'Tactile Braille Switch Press', desc: 'User presses combinations across the ergonomic 6-button Braille switch matrix.' },
        { step: '02', title: 'GPIO Signal Interception', desc: 'Raspberry Pi GPIO pins detect pin transitions with debouncing hardware algorithms.' },
        { step: '03', title: 'Python Chord Mapping Parser', desc: 'Parser decodes the 6-bit binary matrix into the corresponding Braille alphanumeric character.' },
        { step: '04', title: 'Text-to-Speech Auditory Output', desc: 'Internal synthesis module speaks the character aloud for immediate user verification.' },
        { step: '05', title: 'Host Machine Keystroke Injection', desc: 'Emulated USB HID transmits the key event to connected PC or laptop transparently.' }
      ],
      demoUrl: '#',
      codeUrl: '#'
    },

    'bike-parking': {
      title: 'Automated Bike Parking System',
      badge: 'Embedded IoT · Arduino · Smart Cities',
      icon: '🏍️',
      tagline: 'IoT Smart Slot Detection, RFID Security & Real-Time Parking Automation',
      checklist: [
        '<strong>Embedded Automation:</strong> Designed and programmed an autonomous smart two-wheeler parking management unit powered by Arduino Uno microcontroller.',
        '<strong>Sensor-Driven Slot Detection:</strong> Configured ultrasonic and infrared (IR) sensor arrays over parking bays to detect occupancy and trigger real-time slot vacancy updates.',
        '<strong>Automated Servo Gate Actuation:</strong> Built servo-motor barrier controls that permit vehicle entry only when verified parking bays are available and authorization succeeds.',
        '<strong>Live LCD & Status Indicator:</strong> Integrated an I2C 16x2 LCD display and multi-color status LEDs at the entrance to guide riders directly to vacant slots.'
      ],
      tech: ['Arduino Uno', 'Embedded C / C++', 'Ultrasonic Sensors', 'Servo Motors', 'RFID Sensors', 'I2C LCD Display'],
      impact: [
        { num: '100%', label: 'Autonomous Slot Allocation' },
        { num: 'Real-time', label: 'Sensor Space Detection' },
        { num: 'Zero', label: 'Entry Congestion / Overflow' }
      ],
      flow: [
        { step: '01', title: 'Rider Entry & RFID Tap', desc: 'Vehicle rider taps registered RFID token at entrance reader to initiate access check.' },
        { step: '02', title: 'Arduino Slot Availability Check', desc: 'Microcontroller queries ultrasonic bay sensors to confirm at least one vacant bay exists.' },
        { step: '03', title: 'Servo Barrier Gate Lift', desc: 'Upon verification, Arduino pulses the servo motor to rotate the barrier arm 90 degrees.' },
        { step: '04', title: 'Bay Parking & Sensor Lock', desc: 'Ultrasonic sensor confirms vehicle has parked, changing bay status LED from Green to Red.' },
        { step: '05', title: 'Live I2C Display Recalculation', desc: 'Entrance LCD display decrements available slot count and resets barrier arm securely.' }
      ],
      demoUrl: '#',
      codeUrl: '#'
    }
  };

  const vaultModal = document.getElementById('projectVault');
  const vaultBackdrop = document.getElementById('vaultBackdrop');
  const vaultCloseBtn = document.getElementById('vaultCloseBtn');

  function openProjectVault(projectId) {
    const data = projectsData[projectId];
    if (!data || !vaultModal) return;

    // Populate modal elements
    document.getElementById('vProjectBadge').textContent = data.badge;
    document.getElementById('vProjectIcon').textContent = data.icon;
    document.getElementById('vProjectTitle').textContent = data.title;
    document.getElementById('vProjectTagline').textContent = data.tagline;

    // Checklist
    const clContainer = document.getElementById('vProjectChecklist');
    clContainer.innerHTML = data.checklist.map(item => `<li><i class="fas fa-check-circle"></i><span>${item}</span></li>`).join('');

    // Tech Stack
    const techContainer = document.getElementById('vProjectTech');
    techContainer.innerHTML = data.tech.map(t => `<span class="vtech-pill"><i class="fas fa-cube"></i>${t}</span>`).join('');

    // Impact
    const impactContainer = document.getElementById('vProjectImpact');
    impactContainer.innerHTML = data.impact.map(imp => `
      <div class="vimpact-box">
        <span class="vib-num">${imp.num}</span>
        <span class="vib-desc">${imp.label}</span>
      </div>
    `).join('');

    // Workflow Timeline
    const wfContainer = document.getElementById('vWorkflowTimeline');
    wfContainer.innerHTML = data.flow.map((item, idx) => `
      <div class="wf-step">
        <div class="wf-node">${item.step}</div>
        <div class="wf-info">
          <div class="wf-header">
            <span class="wf-title">${item.title}</span>
            ${idx < data.flow.length - 1 ? '<i class="fas fa-arrow-down wf-arrow"></i>' : '<i class="fas fa-flag-checkered wf-arrow"></i>'}
          </div>
          <p class="wf-desc">${item.desc}</p>
        </div>
      </div>
    `).join('');

    // Action links
    const demoBtn = document.getElementById('vActionDemo');
    const codeBtn = document.getElementById('vActionCode');
    if (demoBtn) demoBtn.href = data.demoUrl;
    if (codeBtn) codeBtn.href = data.codeUrl;

    // Reset door animation state
    vaultModal.classList.remove('vault-open', 'vault-fully-open');
    vaultModal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Cinematic gate unlock sequence
    setTimeout(() => {
      vaultModal.classList.add('vault-open');
    }, 180);

    setTimeout(() => {
      vaultModal.classList.add('vault-fully-open');
    }, 1000);
  }

  function closeProjectVault() {
    if (!vaultModal) return;
    vaultModal.classList.remove('vault-fully-open');
    vaultModal.classList.remove('vault-open');

    // Doors slam back together
    setTimeout(() => {
      vaultModal.classList.remove('active');
      document.body.style.overflow = '';
    }, 750);
  }

  // Attach card click handlers
  document.querySelectorAll('.pcg-card').forEach(card => {
    card.addEventListener('click', (e) => {
      // If clicking external link, let it navigate normally
      if (e.target.closest('a')) return;
      const projId = card.dataset.project;
      if (projId) {
        e.preventDefault();
        openProjectVault(projId);
      }
    });
  });

  // Attach button click handlers
  document.querySelectorAll('.open-vault-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const projId = btn.dataset.project;
      if (projId) openProjectVault(projId);
    });
  });

  if (vaultCloseBtn) vaultCloseBtn.addEventListener('click', closeProjectVault);
  if (vaultBackdrop) vaultBackdrop.addEventListener('click', closeProjectVault);

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && vaultModal && vaultModal.classList.contains('active')) {
      closeProjectVault();
    }
  });

  /* — Keyboard shortcut easter egg — */
  const keys = [];
  document.addEventListener('keydown', e => {
    keys.push(e.key.toLowerCase());
    if (keys.slice(-4).join('')==='hari') {
      document.body.style.transition = 'filter 0.5s';
      document.body.style.filter = 'hue-rotate(180deg)';
      setTimeout(()=>{ document.body.style.filter=''; }, 2000);
      console.log('%c🎬 You found the easter egg! Hari mode activated!', 'color:#f59e0b;font-size:16px;font-weight:900;');
    }
  });

  console.log('%c🎬 SREE HARINATH K — CINEMATIC PORTFOLIO', 'color:#f59e0b;font-size:20px;font-weight:900;font-family:Bebas Neue,sans-serif;letter-spacing:4px;');
  console.log('%c📧 rkumar0151966@gmail.com  |  📱 +91 6379796639', 'color:#94a3b8;font-size:12px;');
  console.log('%cTip: Type "hari" anywhere for a surprise 🎉', 'color:#8b5cf6;font-size:11px;');
}
