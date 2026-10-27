/**
 * Alex Rivera - Portfolio Script
 * Features:
 * - Dynamic Neural Network Canvas Background with mouse interaction
 * - Animated Typing & Hero Metrics counter
 * - Interactive AI Lab 1: NLP Sentiment Analysis Engine
 * - Interactive AI Lab 2: Interactive Ordinary Least Squares Linear Regression Canvas
 * - Interactive AI Lab 3: Multi-Layer Perceptron (MLP) Forward Pass Visualizer
 * - Multi-category Filter for Skills & Projects
 * - Sticky Navbar, Smooth Navigation & Mobile Menu
 */

document.addEventListener('DOMContentLoaded', () => {
  initNeuralCanvas();
  initTypingEffect();
  initCounterMetrics();
  initNavbar();
  initSkillFilters();
  initProjectFilters();
  initInteractiveLab();
  initContactForm();
});

/* ===================================================================
   1. NEURAL NETWORK CANVAS ANIMATION
=================================================================== */
function initNeuralCanvas() {
  const canvas = document.getElementById('neural-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const mouse = { x: null, y: null, radius: 140 };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  const nodes = [];
  const nodeCount = Math.floor((width * height) / 18000);

  class Node {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.75;
      this.vy = (Math.random() - 0.5) * 0.75;
      this.radius = Math.random() * 2 + 1.5;
      this.baseColor = Math.random() > 0.4 ? 'rgba(99, 102, 241, ' : 'rgba(6, 182, 212, ';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse avoidance / attraction
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.hypot(dx, dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 2.5;
          this.y -= (dy / dist) * force * 2.5;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.baseColor + '0.7)';
      ctx.shadowBlur = 8;
      ctx.shadowColor = this.baseColor + '0.5)';
      ctx.fill();
    }
  }

  for (let i = 0; i < Math.max(nodeCount, 45); i++) {
    nodes.push(new Node());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw lines between proximate nodes
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.hypot(dx, dy);

        if (dist < 130) {
          const alpha = 1 - dist / 130;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(99, 102, 241, ${alpha * 0.22})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    nodes.forEach((node) => {
      node.update();
      node.draw();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

/* ===================================================================
   2. TYPING EFFECT IN HERO
=================================================================== */
function initTypingEffect() {
  const target = document.getElementById('typing-role');
  if (!target) return;

  const roles = [
    'Artificial Intelligence',
    'Predictive Data Science',
    'Full-Stack Web Systems',
    'Deep Neural Networks',
    'Generative AI & LLMs'
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typingDelay = 100;

  function type() {
    const current = roles[roleIdx];
    if (isDeleting) {
      target.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      typingDelay = 50;
    } else {
      target.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      typingDelay = 110;
    }

    if (!isDeleting && charIdx === current.length) {
      typingDelay = 1800; // Pause at end of word
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      typingDelay = 400;
    }

    setTimeout(type, typingDelay);
  }

  type();
}

/* ===================================================================
   3. ANIMATED METRICS COUNTER
=================================================================== */
function initCounterMetrics() {
  const metrics = document.querySelectorAll('.metric-val');
  let animated = false;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !animated) {
          animated = true;
          metrics.forEach((metric) => {
            const target = parseFloat(metric.getAttribute('data-target'));
            const isFloat = target % 1 !== 0;
            let current = 0;
            const duration = 1800;
            const stepTime = 25;
            const increment = target / (duration / stepTime);

            const timer = setInterval(() => {
              current += increment;
              if (current >= target) {
                metric.textContent = isFloat ? target.toFixed(1) : Math.floor(target);
                clearInterval(timer);
              } else {
                metric.textContent = isFloat ? current.toFixed(1) : Math.floor(current);
              }
            }, stepTime);
          });
        }
      });
    },
    { threshold: 0.3 }
  );

  const heroSection = document.querySelector('.hero-section');
  if (heroSection) observer.observe(heroSection);
}

/* ===================================================================
   4. NAVBAR SCROLL & MOBILE TOGGLE
=================================================================== */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const toggle = document.getElementById('mobile-toggle');
  const menu = document.getElementById('nav-menu');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      menu.classList.toggle('open');
    });

    menu.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        menu.classList.remove('open');
      });
    });
  }

  // Active section indicator on scroll
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach((section) => {
      const top = section.offsetTop - 120;
      const height = section.offsetHeight;
      if (window.scrollY >= top && window.scrollY < top + height) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ===================================================================
   5. SKILLS & PROJECT CATEGORY FILTERS
=================================================================== */
function initSkillFilters() {
  const filterBtns = document.querySelectorAll('.skills-filter .filter-btn');
  const skillItems = document.querySelectorAll('.skills-grid .skill-item');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');

      skillItems.forEach((item) => {
        const cat = item.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });
}

function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.project-filters .proj-filter');
  const projectCards = document.querySelectorAll('.projects-grid .project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const tag = btn.getAttribute('data-tag');

      projectCards.forEach((card) => {
        const cardTags = card.getAttribute('data-tags').split(' ');
        if (tag === 'all' || cardTags.includes(tag)) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/* ===================================================================
   6. INTERACTIVE AI & DATA LAB (3 EXPERIMENTS)
=================================================================== */
function initInteractiveLab() {
  // Tabs switching
  const tabBtns = document.querySelectorAll('.lab-tab-btn');
  const tabContents = document.querySelectorAll('.lab-content');

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      tabBtns.forEach((b) => b.classList.remove('active'));
      tabContents.forEach((c) => c.classList.remove('active'));

      btn.classList.add('active');
      const tabId = `tab-${btn.getAttribute('data-tab')}`;
      const content = document.getElementById(tabId);
      if (content) content.classList.add('active');

      // Refresh regression canvas rendering if opened
      if (btn.getAttribute('data-tab') === 'regression') {
        drawRegression();
      }
    });
  });

  /* -------------------------------------------------------------
     Experiment 1: NLP Sentiment Analysis Engine
  ------------------------------------------------------------- */
  const sentimentText = document.getElementById('sentiment-text');
  const sentimentScoreEl = document.getElementById('sentiment-score');
  const sentimentIndicator = document.getElementById('sentiment-indicator');
  const sentimentVerdict = document.getElementById('sentiment-verdict');
  const sentimentTokens = document.getElementById('sentiment-tokens');
  const promptPills = document.querySelectorAll('.prompt-pill');

  const positiveLexicon = {
    revolutionary: 3, outstanding: 3, extraordinary: 3, brilliant: 2.5,
    flawless: 2.5, excellent: 2, great: 1.5, good: 1, fast: 1, speed: 0.8,
    breathtaking: 2.8, accurate: 1.8, accuracy: 1.5, love: 2, innovative: 2,
    clean: 1, robust: 1.5, optimal: 1.5, efficient: 1.8, peak: 1.4
  };

  const negativeLexicon = {
    frustrating: -3, failure: -2.8, failures: -2.8, crash: -3, crashes: -3,
    terrible: -3, awful: -2.5, bad: -1.5, slow: -1.8, latency: -1,
    unreliable: -2.5, broken: -2.5, bug: -1.5, error: -1.8, lag: -1.5,
    spikes: -0.8, hate: -2.5, poor: -2, glitch: -1.5, bottleneck: -2
  };

  function analyzeSentiment(text) {
    if (!text || text.trim() === '') {
      updateSentimentUI(0, 'Neutral (No Input)', []);
      return;
    }

    const words = text.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
    let score = 0;
    const detectedWords = [];

    words.forEach((word) => {
      if (positiveLexicon[word]) {
        score += positiveLexicon[word];
        detectedWords.push(`${word} (+${positiveLexicon[word]})`);
      } else if (negativeLexicon[word]) {
        score += negativeLexicon[word];
        detectedWords.push(`${word} (${negativeLexicon[word]})`);
      }
    });

    // Normalize between -1.0 and 1.0 using tanh-like scaling
    let normalized = words.length > 0 ? score / (Math.sqrt(Math.abs(score) + 2) * 1.5) : 0;
    normalized = Math.max(-1, Math.min(1, normalized));

    let verdict = 'Neutral';
    let statusClass = 'neutral';
    if (normalized > 0.25) {
      verdict = normalized > 0.6 ? 'Strongly Positive' : 'Positive';
      statusClass = 'positive';
    } else if (normalized < -0.25) {
      verdict = normalized < -0.6 ? 'Strongly Negative' : 'Negative';
      statusClass = 'negative';
    }

    updateSentimentUI(normalized, verdict, statusClass, detectedWords);
  }

  function updateSentimentUI(score, verdict, statusClass, detected) {
    sentimentScoreEl.textContent = (score >= 0 ? '+' : '') + score.toFixed(2);

    // Position indicator: -1 -> 0%, 0 -> 50%, 1 -> 100%
    const percentage = ((score + 1) / 2) * 100;
    sentimentIndicator.style.left = `${percentage}%`;

    sentimentVerdict.className = `badge-status ${statusClass}`;
    sentimentVerdict.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${verdict}`;

    sentimentTokens.textContent = detected && detected.length > 0
      ? `Key Tokens: ${detected.slice(0, 5).join(', ')}`
      : 'Key Tokens: Neutral semantic distribution';
  }

  if (sentimentText) {
    sentimentText.addEventListener('input', (e) => analyzeSentiment(e.target.value));
  }

  promptPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      const text = pill.getAttribute('data-text');
      sentimentText.value = text;
      analyzeSentiment(text);
    });
  });

  // Run initial sentiment
  analyzeSentiment("The revolutionary neural model delivered outstanding accuracy and extraordinary efficiency!");

  /* -------------------------------------------------------------
     Experiment 2: Interactive Linear Regression (OLS)
  ------------------------------------------------------------- */
  const regCanvas = document.getElementById('regression-canvas');
  const regSlopeEl = document.getElementById('reg-slope');
  const regInterceptEl = document.getElementById('reg-intercept');
  const regR2El = document.getElementById('reg-r2');
  const btnClearPlot = document.getElementById('btn-clear-plot');
  const btnSampleData = document.getElementById('btn-sample-data');

  let points = [
    { x: 50, y: 220 }, { x: 120, y: 200 }, { x: 210, y: 170 },
    { x: 300, y: 140 }, { x: 390, y: 120 }, { x: 480, y: 80 }, { x: 580, y: 60 }
  ];

  function calculateRegression() {
    if (points.length < 2) {
      regSlopeEl.textContent = '0.00';
      regInterceptEl.textContent = '0.00';
      regR2El.textContent = '0.00';
      return null;
    }

    const n = points.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0, sumYY = 0;

    points.forEach((p) => {
      sumX += p.x;
      sumY += p.y;
      sumXY += p.x * p.y;
      sumXX += p.x * p.x;
      sumYY += p.y * p.y;
    });

    const m = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const b = (sumY - m * sumX) / n;

    // R^2 calculation
    const meanY = sumY / n;
    let ssTotal = 0;
    let ssRes = 0;

    points.forEach((p) => {
      const predY = m * p.x + b;
      ssTotal += Math.pow(p.y - meanY, 2);
      ssRes += Math.pow(p.y - predY, 2);
    });

    const r2 = ssTotal === 0 ? 1 : Math.max(0, 1 - (ssRes / ssTotal));

    // Convert display slope so standard mathematical coordinate conventions feel natural
    regSlopeEl.textContent = (-m).toFixed(3);
    regInterceptEl.textContent = b.toFixed(1);
    regR2El.textContent = r2.toFixed(3);

    return { m, b };
  }

  function drawRegression() {
    if (!regCanvas) return;
    const ctx = regCanvas.getContext('2d');
    const w = regCanvas.width;
    const h = regCanvas.height;

    ctx.clearRect(0, 0, w, h);

    // Draw Grid Lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    const reg = calculateRegression();

    // Draw Best Fit Line
    if (reg) {
      ctx.beginPath();
      const y0 = reg.m * 0 + reg.b;
      const y1 = reg.m * w + reg.b;
      ctx.moveTo(0, y0);
      ctx.lineTo(w, y1);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#06b6d4';
      ctx.stroke();
      ctx.shadowBlur = 0; // reset
    }

    // Draw Data Points
    points.forEach((p, index) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 6.5, 0, Math.PI * 2);
      ctx.fillStyle = '#ec4899';
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'rgba(236, 72, 153, 0.8)';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.shadowBlur = 0;
    });
  }

  if (regCanvas) {
    regCanvas.addEventListener('click', (e) => {
      const rect = regCanvas.getBoundingClientRect();
      const scaleX = regCanvas.width / rect.width;
      const scaleY = regCanvas.height / rect.height;
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;
      points.push({ x, y });
      drawRegression();
    });

    btnClearPlot?.addEventListener('click', () => {
      points = [];
      drawRegression();
    });

    btnSampleData?.addEventListener('click', () => {
      points = [];
      const count = 10;
      for (let i = 0; i < count; i++) {
        const x = 50 + i * 60 + (Math.random() - 0.5) * 35;
        const y = 240 - i * 18 + (Math.random() - 0.5) * 45;
        points.push({ x, y });
      }
      drawRegression();
    });

    drawRegression();
  }

  /* -------------------------------------------------------------
     Experiment 3: Neural Node Forward Pass Simulator
  ------------------------------------------------------------- */
  const inX1 = document.getElementById('input-x1');
  const inX2 = document.getElementById('input-x2');
  const inW1 = document.getElementById('input-w1');
  const inBias = document.getElementById('input-bias');

  const valX1 = document.getElementById('val-x1');
  const valX2 = document.getElementById('val-x2');
  const valW1 = document.getElementById('val-w1');
  const valBias = document.getElementById('val-bias');

  const nodeX1 = document.getElementById('node-x1');
  const nodeX2 = document.getElementById('node-x2');
  const nodeHidden = document.getElementById('node-hidden');
  const nodeOutput = document.getElementById('node-output');

  function updateNeuralSim() {
    const x1 = parseFloat(inX1.value);
    const x2 = parseFloat(inX2.value);
    const w1 = parseFloat(inW1.value);
    const bias = parseFloat(inBias.value);

    valX1.textContent = x1.toFixed(1);
    valX2.textContent = x2.toFixed(1);
    valW1.textContent = w1.toFixed(1);
    valBias.textContent = bias.toFixed(1);

    nodeX1.textContent = `X1: ${x1.toFixed(1)}`;
    nodeX2.textContent = `X2: ${x2.toFixed(1)}`;

    // Hidden layer with ReLU: z = (x1 * w1) + (x2 * 0.8) + bias
    const z = x1 * w1 + x2 * 0.8 + bias;
    const relu = Math.max(0, z);
    nodeHidden.textContent = `z: ${relu.toFixed(2)}`;

    // Output layer with Sigmoid: σ(relu)
    const sigmoid = 1 / (1 + Math.exp(-relu));
    nodeOutput.textContent = sigmoid.toFixed(3);
  }

  [inX1, inX2, inW1, inBias].forEach((slider) => {
    slider?.addEventListener('input', updateNeuralSim);
  });

  updateNeuralSim();
}

/* ===================================================================
   7. CONTACT FORM SUBMISSION HANDLING
=================================================================== */
function initContactForm() {
  const form = document.getElementById('portfolio-contact-form');
  const feedback = document.getElementById('form-feedback');
  const submitBtn = document.getElementById('btn-submit-message');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Processing Dispatch...`;
    submitBtn.disabled = true;

    // Simulate async network submission
    setTimeout(() => {
      submitBtn.innerHTML = `<i class="fa-solid fa-check"></i> Message Dispatched!`;
      submitBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';

      feedback.className = 'form-feedback success';
      feedback.innerHTML = `<strong>Thank you!</strong> Your message was securely routed. Alex Rivera will connect with you within 24 hours.`;
      feedback.classList.remove('hidden');

      form.reset();

      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.style.background = '';
        submitBtn.disabled = false;
      }, 4000);
    }, 1200);
  });
}
