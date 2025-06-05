// utils/idleReload.ts
export function setupAutoReload(minutes = 0.1) {
  console.log("🚀 ~ setupAutoReload ~ minutes:", minutes)
  let lastActivity = Date.now();
  const reset = () => (lastActivity = Date.now());
  ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'].forEach((event) =>
    window.addEventListener(event, reset)
  );

  console.log("🚀 ~ setInterval ~ lastActivity:", lastActivity)
  setInterval(() => {
    if (Date.now() - lastActivity > minutes * 60 * 1000) {
      window.location.reload();
      console.log("Auto-reload setup for", minutes, "minutes of inactivity");
    }
  }, 30 * 1000);
}