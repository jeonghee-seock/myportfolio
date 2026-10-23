// =========================================================
// 1) TERMINAL TYPING INTRO + PHOTO REVEAL
// =========================================================
const terminalLines = [
  { type: 'cmd', text: 'whoami' },
  { type: 'out', text: '석정희 (Seok Jeong Hee)', cls: 'highlight-name' },
  { type: 'gap' },
  { type: 'cmd', text: 'cat introduction.txt' },
  { type: 'out', text: 'Python을 중심으로 소프트웨어를 설계하고 구현하며' },
  { type: 'out', text: '개발 경험을 쌓고 있는 고등학생 개발자입니다.' },
  { type: 'gap' },
  { type: 'cmd', text: 'ls interests/' },
  { type: 'out', text: 'cloud/   data-collection/', cls: 'highlight-role' },
];

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const body = document.getElementById('terminalBody');
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function typeLine(el, text, speed) {
  for (const ch of text) {
    el.textContent += ch;
    await sleep(speed);
  }
}

async function renderTerminal(animate) {
  body.innerHTML = '';

  // 증명사진: 움직임 줄이기 설정이면 바로 보여주고,
  // 아니면 이름(whoami 결과)이 타이핑된 직후에 나타나게 함
  const photo = document.querySelector('.hero-photo');
  if (!animate && photo) photo.classList.add('show');

  for (const line of terminalLines) {
    if (line.type === 'gap') {
      body.appendChild(document.createElement('br'));
      continue;
    }

    const div = document.createElement('div');
    const span = document.createElement('span');

    if (line.type === 'cmd') {
      div.innerHTML = '<span class="prompt">$</span> ';
    } else {
      span.className = 'prompt-out ' + (line.cls || '');
    }
    div.appendChild(span);
    body.appendChild(div);

    if (animate) {
      await typeLine(span, line.text, line.type === 'cmd' ? 32 : 14);
      if (line.type === 'cmd') await sleep(180);
    } else {
      span.textContent = line.text;
    }

    if (animate && photo && line.cls === 'highlight-name') {
      photo.classList.add('show');
    }
  }

  const cursor = document.createElement('span');
  cursor.className = 'cursor';
  body.appendChild(cursor);
}

renderTerminal(!reduceMotion);

// =========================================================
// 2) SCROLLSPY — highlight active file in sidebar + tabbar
// =========================================================
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.file-tree a, .tab');

const spy = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;

      navLinks.forEach(link => {
        const isActive = link.dataset.target === id;
        link.classList.toggle('active', isActive);

        // 모바일 탭바: 활성 탭이 화면 가운데로 오도록 (페이지 전체는 안 움직임)
        if (isActive && link.classList.contains('tab')) {
          link.scrollIntoView({ inline: 'center', block: 'nearest' });
        }
      });
    });
  },
  { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
);

sections.forEach(sec => spy.observe(sec));
