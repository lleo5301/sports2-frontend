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

module.exports = { showHUD, removeHUD, highlightElement, removeHighlight, showOutro };
