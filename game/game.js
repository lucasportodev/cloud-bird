// ─────────────────────────────────────────
//  CLOUD BIRD — game.js
//  HTML5 Canvas, zero dependências
// ─────────────────────────────────────────

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// ── Canvas: proporção mobile (9:16) ───────
const GAME_WIDTH  = 400;
const GAME_HEIGHT = 700;
canvas.width  = GAME_WIDTH;
canvas.height = GAME_HEIGHT;

// Escala para caber na tela mantendo proporção
function resizeCanvas() {
  const scaleX = window.innerWidth  / GAME_WIDTH;
  const scaleY = window.innerHeight / GAME_HEIGHT;
  const scale  = Math.min(scaleX, scaleY);
  canvas.style.width  = GAME_WIDTH  * scale + 'px';
  canvas.style.height = GAME_HEIGHT * scale + 'px';
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// ── Estados ───────────────────────────────
const STATE = { MENU: 'MENU', PLAYING: 'PLAYING', DEAD: 'DEAD' };
let state = STATE.MENU;

// ── Constantes de física ──────────────────
const GRAVITY      = 0.35;
const JUMP_FORCE   = -7.5;
const GROUND_Y     = GAME_HEIGHT - 60;
const BIRD_RADIUS  = 18;
const HITBOX_SHRINK = 6;   // colisão perdoa essa margem

// ── Constantes de dificuldade ─────────────
function getDifficulty(score) {
  if (score < 5)  return { speed: 2.2, gap: 200, interval: 1800 };
  if (score < 10) return { speed: 2.6, gap: 185, interval: 1600 };
  if (score < 20) return { speed: 3.0, gap: 170, interval: 1400 };
  return             { speed: 3.4, gap: 155, interval: 1300 };
}

// ── Pontuação ─────────────────────────────
let score = 0;
let highScore = parseInt(localStorage.getItem('cloudbird_hs') || '0');

// ── Pássaro ───────────────────────────────
const bird = {
  x: 100,
  y: GAME_HEIGHT / 2,
  vy: 0,
  angle: 0,
  flapAnim: 0,   // 0..1, anima a asa
  deadTimer: 0,

  reset() {
    this.y  = GAME_HEIGHT / 2;
    this.vy = 0;
    this.angle = 0;
    this.flapAnim = 0;
    this.deadTimer = 0;
  },

  jump() {
    this.vy = JUMP_FORCE;
    this.flapAnim = 1;
  },

  update() {
    this.vy += GRAVITY;
    this.y  += this.vy;

    // Rotação visual
    const targetAngle = this.vy < 0 ? -25 : Math.min(this.vy * 4, 70);
    this.angle += (targetAngle - this.angle) * 0.15;

    // Animação da asa
    if (this.flapAnim > 0) this.flapAnim -= 0.12;

    // Morreu no chão ou saiu pelo topo
    if (this.y + BIRD_RADIUS >= GROUND_Y || this.y - BIRD_RADIUS <= 0) {
      die();
    }
  },

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle * Math.PI / 180);

    const r = BIRD_RADIUS;

    // Sombra suave
    ctx.shadowColor = 'rgba(0,0,0,0.15)';
    ctx.shadowBlur  = 6;
    ctx.shadowOffsetY = 3;

    // Corpo (círculo amarelo)
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fillStyle = '#FFD43B';
    ctx.fill();
    ctx.strokeStyle = '#E6A817';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    // Asa (elipse, flap animada)
    const wingY = -2 + Math.sin(this.flapAnim * Math.PI) * -8;
    ctx.beginPath();
    ctx.ellipse(-4, wingY, r * 0.65, r * 0.35, -0.3, 0, Math.PI * 2);
    ctx.fillStyle = '#FFC107';
    ctx.fill();

    // Barriga (mais clara)
    ctx.beginPath();
    ctx.arc(4, 3, r * 0.55, 0, Math.PI * 2);
    ctx.fillStyle = '#FFE57A';
    ctx.fill();

    // Bico
    ctx.beginPath();
    ctx.moveTo(r - 2, -3);
    ctx.lineTo(r + 10, 0);
    ctx.lineTo(r - 2, 4);
    ctx.closePath();
    ctx.fillStyle = '#FF8C00';
    ctx.fill();

    // Olho
    ctx.beginPath();
    ctx.arc(6, -5, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(7, -5, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = '#222';
    ctx.fill();
    // brilho
    ctx.beginPath();
    ctx.arc(8, -6, 1, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();

    ctx.restore();
  },

  getHitbox() {
    const s = HITBOX_SHRINK;
    return {
      x: this.x - BIRD_RADIUS + s,
      y: this.y - BIRD_RADIUS + s,
      w: (BIRD_RADIUS - s) * 2,
      h: (BIRD_RADIUS - s) * 2,
    };
  }
};

// ── Obstáculos (par de nuvens) ─────────────
const CLOUD_WIDTH = 80;

class CloudPipe {
  constructor(x, gapY, gapSize, speed) {
    this.x       = x;
    this.gapY    = gapY;
    this.gapSize = gapSize;
    this.speed   = speed;
    this.scored  = false;
  }

  update() {
    this.x -= this.speed;
  }

  isOffscreen() {
    return this.x + CLOUD_WIDTH < 0;
  }

  // Verifica colisão com o pássaro
  collides(hb) {
    const topBottom  = this.gapY - this.gapSize / 2;
    const botTop     = this.gapY + this.gapSize / 2;
    const pipeLeft   = this.x - CLOUD_WIDTH / 2;
    const pipeRight  = this.x + CLOUD_WIDTH / 2;

    const bRight  = hb.x + hb.w;
    const bBottom = hb.y + hb.h;
    const bLeft   = hb.x;
    const bTop    = hb.y;

    if (bRight < pipeLeft || bLeft > pipeRight) return false;
    if (bTop < topBottom || bBottom > botTop) return true;
    return false;
  }

  draw() {
    const topBottom = this.gapY - this.gapSize / 2;
    const botTop    = this.gapY + this.gapSize / 2;

    // nuvem de cima (bloco do topo até o gap)
    drawCloud(this.x, topBottom, true);

    // nuvem de baixo (gap até o chão)
    drawCloud(this.x, botTop, false);
  }
}

// Desenha uma nuvem bloqueando a passagem
// Se `top`, a nuvem preenche de cima até `edgeY`
// Se `!top`, preenche de `edgeY` até o chão
function drawCloud(cx, edgeY, top) {
  ctx.save();

  // Recorte: área que a nuvem ocupa
  ctx.beginPath();
  if (top) {
    ctx.rect(cx - CLOUD_WIDTH / 2 - 10, 0, CLOUD_WIDTH + 20, edgeY);
  } else {
    ctx.rect(cx - CLOUD_WIDTH / 2 - 10, edgeY, CLOUD_WIDTH + 20, GROUND_Y - edgeY);
  }
  ctx.clip();

  // Sombra suave
  ctx.shadowColor = 'rgba(0,0,0,0.12)';
  ctx.shadowBlur  = 8;

  ctx.fillStyle = '#fff';

  if (top) {
    // bolas de nuvem na borda inferior (top)
    const y = edgeY;
    ctx.beginPath(); ctx.arc(cx - 25, y - 10, 28, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx,       y - 18, 32, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx + 25,  y - 10, 28, 0, Math.PI * 2); ctx.fill();
    // preenchimento sólido acima
    ctx.shadowBlur = 0;
    ctx.fillRect(cx - CLOUD_WIDTH / 2 - 5, 0, CLOUD_WIDTH + 10, y - 10);
  } else {
    // bolas de nuvem na borda superior (bottom)
    const y = edgeY;
    ctx.beginPath(); ctx.arc(cx - 25, y + 10, 28, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx,       y + 18, 32, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx + 25,  y + 10, 28, 0, Math.PI * 2); ctx.fill();
    // preenchimento sólido abaixo
    ctx.shadowBlur = 0;
    ctx.fillRect(cx - CLOUD_WIDTH / 2 - 5, y + 10, CLOUD_WIDTH + 10, GROUND_Y - y);
  }

  ctx.restore();
}

// ── Spawner ────────────────────────────────
let pipes = [];
let spawnTimer = 0;

function spawnPipe() {
  const diff    = getDifficulty(score);
  const margin  = 80;
  const gapY    = margin + Math.random() * (GROUND_Y - margin * 2 - diff.gap);
  pipes.push(new CloudPipe(GAME_WIDTH + 60, gapY + diff.gap / 2, diff.gap, diff.speed));
}

// ── Nuvens de fundo (parallax) ─────────────
const bgClouds = Array.from({ length: 8 }, (_, i) => ({
  x: Math.random() * GAME_WIDTH,
  y: 60 + Math.random() * (GROUND_Y * 0.55),
  r: 20 + Math.random() * 25,
  speed: 0.3 + Math.random() * 0.3,
}));

function updateBgClouds() {
  bgClouds.forEach(c => {
    c.x -= c.speed;
    if (c.x + c.r * 2 < 0) {
      c.x = GAME_WIDTH + c.r;
      c.y = 60 + Math.random() * (GROUND_Y * 0.55);
    }
  });
}

function drawBgClouds() {
  bgClouds.forEach(c => {
    ctx.save();
    ctx.globalAlpha = 0.55;
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(c.x,          c.y,          c.r,        0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(c.x + c.r,    c.y - c.r * 0.4, c.r * 0.7, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(c.x - c.r * 0.6, c.y + c.r * 0.1, c.r * 0.6, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  });
}

// ── Partículas (ponto marcado) ─────────────
let particles = [];

function spawnParticles(x, y) {
  for (let i = 0; i < 8; i++) {
    particles.push({
      x, y,
      vx: (Math.random() - 0.5) * 4,
      vy: -2 - Math.random() * 3,
      life: 1,
      r: 4 + Math.random() * 4,
      color: ['#FFD43B','#FF8C00','#fff','#87CEEB'][Math.floor(Math.random()*4)],
    });
  }
}

function updateParticles() {
  particles = particles.filter(p => p.life > 0);
  particles.forEach(p => {
    p.x  += p.vx;
    p.y  += p.vy;
    p.vy += 0.15;
    p.life -= 0.04;
  });
}

function drawParticles() {
  particles.forEach(p => {
    ctx.save();
    ctx.globalAlpha = p.life;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
}

// ── Animação do menu (pintinho bobbing) ────
let menuBobT = 0;

// ── Background ────────────────────────────
function drawBackground() {
  const grad = ctx.createLinearGradient(0, 0, 0, GROUND_Y);
  grad.addColorStop(0,   '#5BB8F5');
  grad.addColorStop(1,   '#B8E0FF');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
}

// ── Chão ──────────────────────────────────
function drawGround() {
  // Grama
  ctx.fillStyle = '#7BC67A';
  ctx.fillRect(0, GROUND_Y, GAME_WIDTH, GAME_HEIGHT - GROUND_Y);
  // Linha de grama mais escura
  ctx.fillStyle = '#5DA85C';
  ctx.fillRect(0, GROUND_Y, GAME_WIDTH, 8);
}

// ── Morte ─────────────────────────────────
let justDied = false;

function die() {
  if (state === STATE.DEAD) return;
  state = STATE.DEAD;
  justDied = true;
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('cloudbird_hs', highScore);
  }
  setTimeout(() => { justDied = false; }, 600);
}

// ── Reset ─────────────────────────────────
function resetGame() {
  score = 0;
  pipes = [];
  spawnTimer = 0;
  particles = [];
  bird.reset();
  state = STATE.PLAYING;
  spawnPipe();
}

// ── Input ─────────────────────────────────
function handleInput() {
  if (state === STATE.MENU) {
    resetGame();
  } else if (state === STATE.PLAYING) {
    bird.jump();
  } else if (state === STATE.DEAD && !justDied) {
    resetGame();
  }
}

canvas.addEventListener('mousedown', handleInput);
canvas.addEventListener('touchstart', (e) => {
  e.preventDefault();
  handleInput();
}, { passive: false });

// ── Update ────────────────────────────────
let lastTime = 0;

function update(ts) {
  const dt = Math.min(ts - lastTime, 50); // cap em 50ms
  lastTime = ts;

  if (state === STATE.MENU) {
    menuBobT += 0.04;
    updateBgClouds();
    return;
  }

  updateBgClouds();
  updateParticles();
  bird.update();

  if (state === STATE.PLAYING) {
    // Spawner
    const diff = getDifficulty(score);
    spawnTimer += dt;
    if (spawnTimer >= diff.interval) {
      spawnTimer = 0;
      spawnPipe();
    }

    // Atualizar e checar pipes
    const hb = bird.getHitbox();
    pipes.forEach(p => {
      p.update();

      // Colisão
      if (p.collides(hb)) die();

      // Ponto
      if (!p.scored && p.x < bird.x) {
        p.scored = true;
        score++;
        spawnParticles(bird.x + 30, bird.y);
      }
    });

    // Remover pipes fora da tela
    pipes = pipes.filter(p => !p.isOffscreen());
  }
}

// ── Draw ──────────────────────────────────
function draw() {
  drawBackground();
  drawBgClouds();

  if (state === STATE.MENU) {
    drawGround();
    drawMenu();
    return;
  }

  // Pipes
  pipes.forEach(p => p.draw());

  drawGround();
  drawParticles();
  bird.draw();

  if (state === STATE.PLAYING) {
    drawHUD();
  }

  if (state === STATE.DEAD) {
    drawGameOver();
  }
}

// ── HUD ───────────────────────────────────
function drawHUD() {
  ctx.save();
  ctx.font = 'bold 48px Arial';
  ctx.fillStyle = '#fff';
  ctx.strokeStyle = 'rgba(0,0,0,0.3)';
  ctx.lineWidth = 4;
  ctx.textAlign = 'center';
  ctx.strokeText(score, GAME_WIDTH / 2, 70);
  ctx.fillText(score, GAME_WIDTH / 2, 70);
  ctx.restore();
}

// ── Tela de menu ──────────────────────────
function drawMenu() {
  // Título
  ctx.save();
  ctx.textAlign = 'center';

  ctx.font = 'bold 56px Arial';
  ctx.fillStyle = '#fff';
  ctx.strokeStyle = 'rgba(0,100,200,0.4)';
  ctx.lineWidth = 6;
  ctx.strokeText('Cloud Bird', GAME_WIDTH / 2, 180);
  ctx.fillText('Cloud Bird', GAME_WIDTH / 2, 180);

  // Subtítulo
  ctx.font = '22px Arial';
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.fillText('☁️  Voe pelas nuvens!  ☁️', GAME_WIDTH / 2, 220);

  ctx.restore();

  // Pintinho bobbing no centro
  const bobY = GAME_HEIGHT / 2 - 20 + Math.sin(menuBobT) * 12;
  ctx.save();
  ctx.translate(GAME_WIDTH / 2, bobY);
  ctx.scale(1.6, 1.6);
  bird.draw.call({ x: 0, y: 0, angle: Math.sin(menuBobT * 0.5) * 10, flapAnim: (Math.sin(menuBobT * 2) + 1) / 2 });
  ctx.restore();

  // Recorde
  if (highScore > 0) {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.font = '20px Arial';
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.fillText(`🏆 Recorde: ${highScore}`, GAME_WIDTH / 2, GAME_HEIGHT / 2 + 80);
    ctx.restore();
  }

  // Botão
  drawButton(GAME_WIDTH / 2, GAME_HEIGHT - 180, 200, 60, '▶  Jogar', '#4CAF50', '#388E3C');
}

// ── Tela de game over ─────────────────────
function drawGameOver() {
  // Overlay
  ctx.fillStyle = 'rgba(0,0,0,0.45)';
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  // Painel
  const pw = 300, ph = 260;
  const px = (GAME_WIDTH - pw) / 2;
  const py = (GAME_HEIGHT - ph) / 2 - 30;
  roundRect(px, py, pw, ph, 20, '#fff', null);

  ctx.save();
  ctx.textAlign = 'center';

  ctx.font = 'bold 32px Arial';
  ctx.fillStyle = '#E53935';
  ctx.fillText('Você bateu! 😢', GAME_WIDTH / 2, py + 55);

  ctx.font = 'bold 52px Arial';
  ctx.fillStyle = '#333';
  ctx.fillText(score, GAME_WIDTH / 2, py + 125);

  ctx.font = '18px Arial';
  ctx.fillStyle = '#888';
  ctx.fillText('pontos', GAME_WIDTH / 2, py + 152);

  const newRecord = score >= highScore && score > 0;
  if (newRecord) {
    ctx.font = 'bold 20px Arial';
    ctx.fillStyle = '#FF8C00';
    ctx.fillText('🏆 Novo recorde!', GAME_WIDTH / 2, py + 185);
  } else {
    ctx.font = '18px Arial';
    ctx.fillStyle = '#aaa';
    ctx.fillText(`Recorde: ${highScore}`, GAME_WIDTH / 2, py + 185);
  }

  ctx.restore();

  drawButton(GAME_WIDTH / 2, py + ph + 45, 220, 60, '↩  Tentar de novo', '#2196F3', '#1565C0');
}

// ── Helpers de desenho ────────────────────
function drawButton(cx, cy, w, h, label, color, shadow) {
  const x = cx - w / 2;
  const y = cy - h / 2;
  // sombra
  roundRect(x + 2, y + 4, w, h, 14, shadow, null);
  // fundo
  roundRect(x, y, w, h, 14, color, null);
  ctx.save();
  ctx.textAlign = 'center';
  ctx.font = 'bold 22px Arial';
  ctx.fillStyle = '#fff';
  ctx.fillText(label, cx, cy + 8);
  ctx.restore();
}

function roundRect(x, y, w, h, r, fill, stroke) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  if (fill)   { ctx.fillStyle = fill;     ctx.fill();   }
  if (stroke) { ctx.strokeStyle = stroke; ctx.stroke(); }
}

// ── Loop principal ────────────────────────
function loop(ts) {
  update(ts);
  draw();
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
