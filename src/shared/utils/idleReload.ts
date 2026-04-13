// utils/idleReload.ts
export function setupAutoReload(minutes = 0.1) {
  let lastActivity = Date.now();
  const reset = () => (lastActivity = Date.now());
  ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'].forEach((event) =>
    window.addEventListener(event, reset)
  );

  setInterval(() => {
    if (Date.now() - lastActivity > minutes * 60 * 1000) {
      window.location.reload();
    }
  }, 30 * 1000);
}