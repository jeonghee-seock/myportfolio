// =========================================================
// 1) TERMINAL TYPING INTRO
// =========================================================
const terminalLines = [
  { type: 'cmd', text: 'whoami' },
  { type: 'out', text: '석정희 (Seok Jeong Hee) — Software Engineer', cls: 'highlight-name' },
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

function renderStatic() {
  body.innerHTML = '';
  terminalLines.forEach(line => {
    if (line.type === 'gap') { body.appendChild(document.createElement('br')); return; }
    const div = document.createElement('div');
    if (line.type === 'cmd') {
      div.innerHTML = `<span class="prompt">$</span> ${line.text}`;
    } else {
      div.innerHTML = `<span class="prompt-out ${line.cls || ''}">${line.text}</span>`;
    }
    body.appendChild(div);
  });
  const cursor = document.createElement('span');
  cursor.className = 'cursor';
  body.appendChild(cursor);
}

async function typeLine(el, text, speed) {
  for (let i = 0; i < text.length; i++) {
    el.textContent += text[i];
    await new Promise(r => setTimeout(r, speed));
  }
}

async function playIntro() {
  body.innerHTML = '';
  const cursor = document.createElement('span');
  cursor.className = 'cursor';

  for (const line of terminalLines) {
    if (line.type === 'gap') {
      body.appendChild(document.createElement('br'));
      continue;
    }
    const div = document.createElement('div');
    body.appendChild(div);

    if (line.type === 'cmd') {
      const promptSpan = document.createElement('span');
      promptSpan.className = 'prompt';
      promptSpan.textContent = '$ ';
      div.appendChild(promptSpan);
      const textSpan = document.createElement('span');
      div.appendChild(textSpan);
      await typeLine(textSpan, line.text, 32);
      await new Promise(r => setTimeout(r, 180));
    } else {
      const outSpan = document.createElement('span');
      outSpan.className = `prompt-out ${line.cls || ''}`;
      div.appendChild(outSpan);
      await typeLine(outSpan, line.text, 14);
    }
  }
  body.appendChild(cursor);
}

if (reduceMotion) {
  renderStatic();
} else {
  playIntro();
}

// =========================================================
// 2) SCROLLSPY — highlight active file in sidebar + tabbar
// =========================================================
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.file-tree a, .tab');

const spy = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.dataset.target === id);
        });
      }
    });
  },
  { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
);

sections.forEach(sec => spy.observe(sec));
