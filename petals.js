document.addEventListener('DOMContentLoaded', function () {
  const container = document.createElement('div');
  container.id = 'petal-container';
  document.body.appendChild(container);

  let petalCount = 0;
  const maxPetals = 40;

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function createPetal() {
    if (petalCount >= maxPetals) return;

    const petal = document.createElement('div');
    petal.className = 'petal';

    const inner = document.createElement('div');
    inner.className = 'petal-inner';

    const left = rand(0, 100);
    const size = Math.round(rand(8, 26));
    const duration = rand(8, 18); // fall duration (s)
    const delay = -rand(0, duration); // negative delay so some are mid-fall on load
    const swayRange = Math.round(rand(10, 120));
    const swayDuration = rand(2.5, 6);

    petal.style.left = left + 'vw';
    petal.style.setProperty('--size', size);
    petal.style.setProperty('--d', duration + 's');
    petal.style.setProperty('--delay', delay + 's');
    petal.style.setProperty('--s', swayRange + 'px');
    petal.style.setProperty('--sD', swayDuration + 's');

    petal.appendChild(inner);
    container.appendChild(petal);
    petalCount++;

    // When fall animation ends, remove the petal
    petal.addEventListener('animationend', function (e) {
      if (e.animationName === 'fall') {
        if (petal.parentNode) petal.parentNode.removeChild(petal);
        petalCount = Math.max(0, petalCount - 1);
      }
    });
  }

  // Create an initial burst
  for (let i = 0; i < 24; i++) createPetal();

  // Then keep spawning new petals periodically
  setInterval(() => {
    createPetal();
  }, 700);
});
