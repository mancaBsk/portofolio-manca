document.addEventListener('DOMContentLoaded', () => {
  const audio = document.getElementById('bg-music');
  const toggle = document.getElementById('music-toggle');
  const upload = document.getElementById('music-upload');
  const fileInput = document.getElementById('music-file');
  const filenameEl = document.getElementById('music-filename');
  const storageKey = 'porto-manca-music-playing';
  const storageSrcKey = 'porto-manca-music-src';

  // Load saved state (true means user wanted music playing)
  const saved = localStorage.getItem(storageKey) === 'true';

  function setPlaying(playing) {
    toggle.textContent = playing ? '▮▮' : '▶';
    toggle.setAttribute('aria-pressed', playing ? 'true' : 'false');
    localStorage.setItem(storageKey, playing ? 'true' : 'false');
  }

  // Attempt to play if saved true — browsers may block until user gesture
  if (saved) {
    // try to play; ignore errors
    audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  } else {
    setPlaying(false);
  }

  // Toggle when clicking the control
  toggle.addEventListener('click', () => {
    if (audio.paused) {
      audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    } else {
      audio.pause();
      setPlaying(false);
    }
  });

  // Upload button opens file picker
  if (upload && fileInput) {
    upload.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (e) => {
      const f = e.target.files && e.target.files[0];
      if (!f) return;
      const url = URL.createObjectURL(f);
      // revoke previous object URL if any
      const prev = localStorage.getItem(storageSrcKey);
      try { if (prev && prev.startsWith('blob:')) URL.revokeObjectURL(prev); } catch (err) {}
      audio.src = url;
      try { localStorage.setItem(storageSrcKey, url); } catch (err) {}
      if (filenameEl) filenameEl.textContent = f.name;
      audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    });

    // Show saved src filename if available (best-effort, blob URLs usually don't persist across reloads)
    const savedSrc = localStorage.getItem(storageSrcKey);
    if (savedSrc && filenameEl) filenameEl.textContent = savedSrc.startsWith('blob:') ? 'local music' : savedSrc;
  }

  // If the user interacts anywhere on the page, and saved requested play earlier,
  // attempt to start playback (useful if autoplay was blocked before)
  function resumeOnGesture() {
    if (localStorage.getItem(storageKey) === 'true' && audio.paused) {
      audio.play().then(() => setPlaying(true)).catch(() => {});
    }
    window.removeEventListener('click', resumeOnGesture);
    window.removeEventListener('touchstart', resumeOnGesture);
  }
  window.addEventListener('click', resumeOnGesture);
  window.addEventListener('touchstart', resumeOnGesture);

  // Update button if playback ends
  audio.addEventListener('ended', () => setPlaying(false));
});
