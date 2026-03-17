// tests/demo/helpers/hud.js

/**
 * Inject a HUD overlay into the bottom-left corner of the page.
 */
async function showHUD(page, { title, subtitle }) {
  await page.evaluate(
    ({ title, subtitle }) => {
      const existing = document.getElementById('demo-hud');
      if (existing) existing.remove();

      const hud = document.createElement('div');
      hud.id = 'demo-hud';

      const titleEl = document.createElement('div');
      Object.assign(titleEl.style, { fontSize: '20px', fontWeight: '600', color: 'white', lineHeight: '1.3' });
      titleEl.textContent = title;

      const subtitleEl = document.createElement('div');
      Object.assign(subtitleEl.style, { fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginTop: '4px' });
      subtitleEl.textContent = subtitle;

      hud.appendChild(titleEl);
      hud.appendChild(subtitleEl);

      Object.assign(hud.style, {
        position: 'fixed',
        bottom: '24px',
        left: '24px',
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        borderRadius: '12px',
        padding: '16px 24px',
        zIndex: '9999',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        opacity: '0',
        transform: 'translateY(10px)',
        transition: 'opacity 300ms ease, transform 300ms ease',
        maxWidth: '400px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
      });
      document.body.appendChild(hud);

      // Double-rAF to ensure initial state is painted before animating
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          hud.style.opacity = '1';
          hud.style.transform = 'translateY(0)';
        });
      });
    },
    { title, subtitle }
  );
}

/**
 * Fade out and remove the HUD overlay.
 */
async function removeHUD(page) {
  await page.evaluate(() => {
    const hud = document.getElementById('demo-hud');
    if (!hud) return;
    hud.style.opacity = '0';
    hud.style.transform = 'translateY(10px)';
    setTimeout(() => hud.remove(), 300);
  });
  await page.waitForTimeout(350);
}

/**
 * Add a pulsing highlight ring around a target element.
 */
async function highlightElement(page, selector) {
  await page.evaluate((sel) => {
    const existing = document.getElementById('demo-highlight');
    if (existing) existing.remove();

    const target = document.querySelector(sel);
    if (!target) return;

    const rect = target.getBoundingClientRect();
    const highlight = document.createElement('div');
    highlight.id = 'demo-highlight';

    const style = document.createElement('style');
    style.id = 'demo-highlight-style';
    style.textContent = `
      @keyframes demo-pulse {
        0%, 100% { box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.6); }
        50% { box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.3); }
      }
    `;
    document.head.appendChild(style);

    Object.assign(highlight.style, {
      position: 'fixed',
      top: `${rect.top - 4}px`,
      left: `${rect.left - 4}px`,
      width: `${rect.width + 8}px`,
      height: `${rect.height + 8}px`,
      borderRadius: '8px',
      animation: 'demo-pulse 1.5s ease-in-out infinite',
      zIndex: '9998',
      pointerEvents: 'none',
    });
    document.body.appendChild(highlight);
  }, selector);
}

/**
 * Remove the highlight ring.
 */
async function removeHighlight(page) {
  await page.evaluate(() => {
    const highlight = document.getElementById('demo-highlight');
    if (highlight) highlight.remove();
    const style = document.getElementById('demo-highlight-style');
    if (style) style.remove();
  });
}

/**
 * Show a full-screen centered overlay for the tech stack outro.
 */
async function showOutro(page, lines) {
  await page.evaluate((lines) => {
    const existing = document.getElementById('demo-hud');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'demo-hud';

    const container = document.createElement('div');
    Object.assign(container.style, { textAlign: 'center' });

    const builtWith = document.createElement('div');
    Object.assign(builtWith.style, { fontSize: '16px', color: 'rgba(255,255,255,0.6)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '2px' });
    builtWith.textContent = 'Built with';
    container.appendChild(builtWith);

    lines.forEach((line) => {
      const lineEl = document.createElement('div');
      Object.assign(lineEl.style, { fontSize: '22px', fontWeight: '600', color: 'white', lineHeight: '1.6' });
      lineEl.textContent = line;
      container.appendChild(lineEl);
    });

    overlay.appendChild(container);

    Object.assign(overlay.style, {
      position: 'fixed',
      inset: '0',
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      zIndex: '9999',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      opacity: '0',
      transition: 'opacity 500ms ease',
    });
    document.body.appendChild(overlay);

    requestAnimationFrame(() => {
      overlay.style.opacity = '1';
    });
  }, lines);
}

/**
 * Brief dark overlay transition between scenes.
 * Fades in, holds briefly, then fades out — gives the viewer a visual breath.
 */
async function sceneTransition(page, { holdMs = 600 } = {}) {
  await page.evaluate(() => {
    const curtain = document.createElement('div');
    curtain.id = 'demo-curtain';
    Object.assign(curtain.style, {
      position: 'fixed',
      inset: '0',
      background: 'rgba(0, 0, 0, 0.85)',
      zIndex: '10000',
      opacity: '0',
      transition: 'opacity 400ms ease',
      pointerEvents: 'none',
    });
    document.body.appendChild(curtain);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        curtain.style.opacity = '1';
      });
    });
  });
  // Wait for fade-in + hold
  await page.waitForTimeout(400 + holdMs);
  // Fade out
  await page.evaluate(() => {
    const curtain = document.getElementById('demo-curtain');
    if (!curtain) return;
    curtain.style.opacity = '0';
    setTimeout(() => curtain.remove(), 400);
  });
  await page.waitForTimeout(450);
}

/**
 * Inject a fake cursor into the page that tracks mouse movements.
 * Playwright doesn't render the real cursor in video recordings.
 * Shows a click ripple animation on mousedown.
 */
async function initCursor(page) {
  await page.evaluate(() => {
    if (document.getElementById('demo-cursor')) return;

    const style = document.createElement('style');
    style.id = 'demo-cursor-style';
    style.textContent = `
      @keyframes demo-click-ripple {
        0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0.6; }
        100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
      }
      #demo-cursor {
        position: fixed;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: rgba(0, 0, 0, 0.6);
        border: 2px solid rgba(255, 255, 255, 0.9);
        z-index: 99999;
        pointer-events: none;
        transition: transform 80ms ease, left 120ms ease, top 120ms ease;
        transform: translate(-50%, -50%);
        box-shadow: 0 1px 4px rgba(0,0,0,0.3);
      }
      #demo-cursor.clicking {
        transform: translate(-50%, -50%) scale(0.75);
      }
      .demo-click-ripple {
        position: fixed;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 2px solid rgba(59, 130, 246, 0.5);
        pointer-events: none;
        z-index: 99998;
        animation: demo-click-ripple 400ms ease-out forwards;
      }
    `;
    document.head.appendChild(style);

    const cursor = document.createElement('div');
    cursor.id = 'demo-cursor';
    cursor.style.left = '-100px';
    cursor.style.top = '-100px';
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    });

    document.addEventListener('mousedown', (e) => {
      cursor.classList.add('clicking');
      const ripple = document.createElement('div');
      ripple.className = 'demo-click-ripple';
      ripple.style.left = e.clientX + 'px';
      ripple.style.top = e.clientY + 'px';
      document.body.appendChild(ripple);
      setTimeout(() => ripple.remove(), 400);
    });

    document.addEventListener('mouseup', () => {
      cursor.classList.remove('clicking');
    });
  });
}

/**
 * Smoothly animate the fake cursor to a target element before clicking.
 * Moves the mouse in a natural arc, pauses briefly, then clicks.
 */
async function moveCursorTo(page, locator, { pauseMs = 300 } = {}) {
  const box = await locator.boundingBox();
  if (!box) return;

  // Target the center of the element
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;

  // Move mouse smoothly to the target
  await page.mouse.move(x, y, { steps: 15 });
  await page.waitForTimeout(pauseMs);
}

module.exports = { showHUD, removeHUD, highlightElement, removeHighlight, showOutro, sceneTransition, initCursor, moveCursorTo };
