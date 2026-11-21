  // 1. DATA: every mood has colours, quotes and music search links
  const yt = q => 'https://www.youtube.com/results?search_query=' + encodeURIComponent(q);
  const MOODS = {
    happy: {
      name: 'Happy', bg1: '#fff3c4', bg2: '#ffb59a', ink: '#3b2a14', accent: '#ff7a59',
      quotes: [
        'Good days are made of small things noticed on purpose.',
        'Let today be loud with gratitude.',
        'Joy is contagious, so pass it on before lunch.',
        'You’re allowed to enjoy this without earning it first.'
      ],
      music: [['Feel-good pop hits', yt('feel good pop playlist')], ['Sunny day acoustic', yt('happy acoustic playlist')], ['Dance and sing along', yt('upbeat dance playlist')]]
    },
    stressed: {
      name: 'Stressed', bg1: '#d9f2ec', bg2: '#8fd3c8', ink: '#0f3b36', accent: '#1f8a7d',
      quotes: [
        'One thing at a time is still moving forward.',
        'You don’t have to solve the whole week tonight.',
        'Breathe out slowly; the list will still be there.',
        'Calm isn’t the absence of work, it’s a steady pace.'
      ],
      music: [['Calming piano', yt('calming piano music stress relief')], ['Rain and soft ambient', yt('rain ambient relaxing music')], ['Guided breathing music', yt('breathing exercise relaxing music')]]
    },
    sleepy: {
      name: 'Sleepy', bg1: '#2b2d5e', bg2: '#5a4f9a', ink: '#ece8ff', accent: '#b9a8ff',
      quotes: [
        'Rest is part of the work, not a break from it.',
        'Dim the lights and soften the day.',
        'Tomorrow can wait; your body can’t.',
        'A slow evening is a gift to your future self.'
      ],
      music: [['Lo-fi to wind down', yt('lofi sleep music')], ['Soft lullaby instrumentals', yt('sleep instrumental music')], ['Night sounds', yt('night nature sounds sleep')]]
    },
    sad: {
      name: 'Sad', bg1: '#dfe6f1', bg2: '#9fb0cc', ink: '#1d2b44', accent: '#4a6a9e',
      quotes: [
        'Feeling it fully is how it passes.',
        'You don’t have to be okay to be worthy.',
        'Be as gentle with yourself as you would be with a friend.',
        'Hard days end, even the long ones.'
      ],
      music: [['Comforting acoustic songs', yt('comforting acoustic songs playlist')], ['Mellow rainy-day mix', yt('mellow rainy day playlist')], ['Healing instrumentals', yt('healing instrumental music')]]
    },
    motivated: {
      name: 'Motivated', bg1: '#e6f7c9', bg2: '#7cc47a', ink: '#12331a', accent: '#e8590c',
      quotes: [
        'Start messy and polish later.',
        'Small steps, taken daily, add up fast.',
        'Future you is watching, so make them proud.',
        'Discipline is a kindness to your tomorrow.'
      ],
      music: [['Workout energy', yt('workout motivation playlist')], ['Deep focus beats', yt('focus study beats')], ['Power-up rock', yt('motivational rock playlist')]]
    }
  };

  // 2. STATE
  let currentMood = 'happy';
  let currentQuote = '';
  let saved = [];
  try { saved = JSON.parse(localStorage.getItem('moodboard-saved')) || []; } catch (e) { saved = []; }

  // 3. FUNCTIONS
  function setMood(key) {
    currentMood = key;
    const m = MOODS[key];
    const root = document.documentElement.style;
    root.setProperty('--bg1', m.bg1);
    root.setProperty('--bg2', m.bg2);
    root.setProperty('--ink', m.ink);
    root.setProperty('--accent', m.accent);

    document.querySelectorAll('#moods button').forEach(b =>
      b.setAttribute('aria-pressed', b.dataset.mood === key));

    document.getElementById('playlists').innerHTML = m.music
      .map(([label, url]) => `<li><a href="${url}" target="_blank" rel="noopener">${label}</a></li>`)
      .join('');

    newQuote();
  }

  function newQuote() {
    const list = MOODS[currentMood].quotes;
    let next;
    do { next = list[Math.floor(Math.random() * list.length)]; }
    while (next === currentQuote && list.length > 1);
    currentQuote = next;
    document.getElementById('quote').textContent = '“' + next + '”';
  }

  function renderSaved() {
    const ul = document.getElementById('saved');
    if (!saved.length) {
      ul.innerHTML = '<li class="empty">Nothing saved yet. Tap “Save quote” on one you like.</li>';
      return;
    }
    ul.innerHTML = saved
      .map((q, i) => `<li><span>${q}</span><button data-i="${i}">Remove</button></li>`)
      .join('');
  }

  function persist() {
    try { localStorage.setItem('moodboard-saved', JSON.stringify(saved)); } catch (e) {}
  }

  function flash(btn, text) {
    const old = btn.textContent;
    btn.textContent = text;
    setTimeout(() => (btn.textContent = old), 1200);
  }

  // 4. EVENTS
  const moodsBox = document.getElementById('moods');
  Object.entries(MOODS).forEach(([key, m]) => {
    const b = document.createElement('button');
    b.textContent = m.name;
    b.dataset.mood = key;
    b.addEventListener('click', () => setMood(key));
    moodsBox.appendChild(b);
  });

  document.getElementById('newBtn').addEventListener('click', newQuote);

  document.getElementById('saveBtn').addEventListener('click', e => {
    if (!saved.includes(currentQuote)) {
      saved.push(currentQuote);
      persist();
      renderSaved();
      flash(e.target, 'Saved');
    } else {
      flash(e.target, 'Already saved');
    }
  });

  document.getElementById('copyBtn').addEventListener('click', e => {
    const done = () => flash(e.target, 'Copied');
    if (navigator.clipboard) navigator.clipboard.writeText(currentQuote).then(done, () => flash(e.target, 'Copy failed'));
    else flash(e.target, 'Copy failed');
  });

  document.getElementById('saved').addEventListener('click', e => {
    if (e.target.dataset.i !== undefined) {
      saved.splice(Number(e.target.dataset.i), 1);
      persist();
      renderSaved();
    }
  });

  // Breathing text: swaps every 4 seconds, matching the 8s CSS animation
  const circle = document.getElementById('circle');
  let inhale = true;
  setInterval(() => {
    inhale = !inhale;
    circle.textContent = inhale ? 'Breathe in' : 'Breathe out';
  }, 4000);

  // 5. START
  renderSaved();
  setMood('happy');
