(function () {
  const PREFERS_REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const IS_TOUCH = window.matchMedia('(pointer: coarse)').matches;
  if (PREFERS_REDUCED_MOTION || IS_TOUCH) {
    return;
  }

  const SPRITE_SRC = '/images/pixel-bot-sprite.png';
  const FRAME_SIZE = 32;
  const CANVAS_ID = 'pixel-bot-canvas';
  const BOT_SCALE = 2;
  const SPEED = 0.14;
  const STOP_DISTANCE = 72;
  const HOME_OFFSET = { x: 50, y: 20 };
  const EYE_MAX_OFFSET = 3;
  const state = {
    mouseX: window.innerWidth / 2,
    mouseY: window.innerHeight / 2,
    botX: window.innerWidth / 2,
    botY: window.innerHeight / 2,
    active: true,
    frame: 0,
    direction: 0,
    lastFrameTime: 0,
    frameInterval: 120,
    imageLoaded: false,
    show: true,
  };

  const canvas = document.createElement('canvas');
  canvas.id = CANVAS_ID;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.setAttribute('aria-hidden', 'true');
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  const sprite = new Image();
  sprite.src = SPRITE_SRC;
  sprite.onload = () => {
    state.imageLoaded = true;
    requestAnimationFrame(renderLoop);
  };

  const homeAnchor = document.querySelector('.home-info');
  const startPoint = homeAnchor ? homeAnchor.getBoundingClientRect() : null;
  const home = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  };
  if (startPoint) {
    home.x = startPoint.right - FRAME_SIZE * BOT_SCALE - HOME_OFFSET.x;
    home.y = startPoint.bottom - FRAME_SIZE * BOT_SCALE - HOME_OFFSET.y;
    state.botX = home.x;
    state.botY = home.y;
    state.mouseX = home.x;
    state.mouseY = home.y;
  }

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  window.addEventListener('pointermove', (event) => {
    // Keep the companion just off the pointer so it never obscures the UI.
    state.mouseX = event.clientX + 22;
    state.mouseY = event.clientY + 18;
  });

  window.addEventListener('blur', () => {
    state.mouseX = home.x;
    state.mouseY = home.y;
  });

  document.addEventListener('mouseleave', () => {
    state.mouseX = home.x;
    state.mouseY = home.y;
  });

  window.addEventListener('keydown', (event) => {
    if (event.key.toLowerCase() === 'c' && event.altKey) {
      state.show = !state.show;
      canvas.classList.toggle('is-hidden', !state.show);
    }
  });

  function getDirection(dx, dy) {
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);
    if (absX > absY) {
      return dx > 0 ? 2 : 1;
    }
    return dy > 0 ? 0 : 3;
  }

  function updateBot(delta) {
    if (!state.active || !state.imageLoaded) {
      return;
    }

    const dx = state.mouseX - state.botX;
    const dy = state.mouseY - state.botY;
    const distance = Math.hypot(dx, dy);
    const targetX = state.mouseX;
    const targetY = state.mouseY;
    const speed = Math.min(delta * SPEED, distance);

    if (distance > STOP_DISTANCE) {
      state.botX += (dx / distance) * speed;
      state.botY += (dy / distance) * speed;
    }

    state.direction = getDirection(dx, dy);
    if (Date.now() - state.lastFrameTime > state.frameInterval) {
      state.frame = (state.frame + 1) % 4;
      state.lastFrameTime = Date.now();
    }
  }

  function drawBot() {
    if (!state.show || !state.imageLoaded) {
      return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const dx = state.mouseX - state.botX;
    const dy = state.mouseY - state.botY;
    const distance = Math.hypot(dx, dy);

    const spriteRow = state.direction;
    const spriteCol = state.frame;
    const drawX = state.botX;
    const drawY = state.botY;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(
      sprite,
      spriteCol * FRAME_SIZE,
      spriteRow * FRAME_SIZE,
      FRAME_SIZE,
      FRAME_SIZE,
      Math.round(drawX),
      Math.round(drawY),
      FRAME_SIZE * BOT_SCALE,
      FRAME_SIZE * BOT_SCALE
    );

    if (distance <= STOP_DISTANCE) {
      const eyeOffsetX = Math.round((dx / Math.max(distance, 1)) * EYE_MAX_OFFSET);
      const eyeOffsetY = Math.round((dy / Math.max(distance, 1)) * EYE_MAX_OFFSET);
      // A tiny cyan gaze gives the idle bot a clear, pointer-aware expression.
      ctx.fillStyle = '#72e6ff';
      ctx.fillRect(Math.round(drawX + 10 * BOT_SCALE + eyeOffsetX), Math.round(drawY + 11 * BOT_SCALE + eyeOffsetY), 3, 3);
      ctx.fillRect(Math.round(drawX + 17 * BOT_SCALE + eyeOffsetX), Math.round(drawY + 11 * BOT_SCALE + eyeOffsetY), 3, 3);
    }
  }

  let lastTime = performance.now();
  function renderLoop(now) {
    const delta = now - lastTime;
    lastTime = now;
    updateBot(delta);
    drawBot();
    requestAnimationFrame(renderLoop);
  }
})();
