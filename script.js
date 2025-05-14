// --- Theme toggle ---
const root = document.documentElement;
const toggleBtn = document.getElementById('toggle-theme');
toggleBtn.onclick = () => {
  const isDark = root.getAttribute('data-theme') === 'dark';
  root.setAttribute('data-theme', isDark ? 'light' : 'dark');
  toggleBtn.textContent = isDark ? '🌙' : '🌞';
};

// --- Page navigation ---
document.querySelectorAll('nav a').forEach(link => {
  link.onclick = e => {
    e.preventDefault();
    const page = link.dataset.page;
    showPage(page);
    document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
    link.classList.add('active');
  };
});
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
}

// --- Fake login ---
document.getElementById('login-form').onsubmit = e => {
  e.preventDefault();
  document.getElementById('auth').classList.add('hidden');
  document.getElementById('app').classList.remove('hidden');
  showPage('home');
};

// --- Data ---
const topics = [
  { name: 'Kinematics – Wheels', formulas: ['v = s/t', 'a = Δv/Δt'] },
  { name: 'Dynamics – Rear wing', formulas: ['F = ma', 'p = mv'] },
  { name: 'Thermodynamics – Exhaust pipe', formulas: ['Q = mcΔT'] },
  { name: 'Electricity – Light indicators', formulas: ['V = IR', 'I = q/t'] },
  { name: 'Optics – Helmet visor', formulas: ['n = c/v'] },
  { name: 'Quantum Physics – Carbon panels', formulas: ['E = hf'] },
];
const progress = JSON.parse(localStorage.getItem('deepformula-progress')) 
               || Array(topics.length).fill(false);

// --- Home: render parts & update ---
const carParts = document.getElementById('car-parts');
topics.forEach((_, i) => {
  const d = document.createElement('div');
  d.className = 'part';
  d.dataset.index = i;
  d.textContent = ['🛞','🚩','💨','💡','👁️','🔬'][i];
  carParts.append(d);
});
function updateParts() {
  document.querySelectorAll('.part').forEach((el, i) => {
    el.classList.toggle('unlocked', progress[i]);
  });
}
updateParts();

// --- Learn: filter buttons & render ---
const filterDiv = document.getElementById('filter-buttons');
const topicsDiv = document.getElementById('topics');
topics.forEach((t, i) => {
  const btn = document.createElement('button');
  btn.textContent = t.name;
  btn.onclick = () => {
    btn.classList.toggle('active');
    renderTopics();
  };
  filterDiv.append(btn);
});
function renderTopics() {
  topicsDiv.innerHTML = '';
  document.querySelectorAll('#filter-buttons button.active').forEach(btn => {
    const idx = topics.findIndex(t => t.name === btn.textContent);
    const t = topics[idx];
    const card = document.createElement('div');
    card.className = 'card';
    const h = document.createElement('h3');
    h.textContent = t.name;
    card.append(h);
    t.formulas.forEach(f => {
      const p = document.createElement('p');
      p.textContent = f;
      card.append(p);
    });
    topicsDiv.append(card);
  });
}

// --- Quiz: setup selection ---
const selectedTopics = new Set();
const cbDiv = document.getElementById('topic-checkboxes');
topics.forEach((t,i) => {
  const lbl = document.createElement('label');
  lbl.innerHTML = `<input type="checkbox" data-index="${i}"> ${t.name}`;
  cbDiv.append(lbl);
});
cbDiv.onchange = e => {
  const i = +e.target.dataset.index;
  if (e.target.checked) selectedTopics.add(i);
  else selectedTopics.delete(i);
  document.getElementById('start-custom-quiz').disabled = selectedTopics.size === 0;
};

// --- Quiz runtime ---
let quizQueue = [], qi = 0;
const stage = document.getElementById('quiz-stage');
const qt = document.getElementById('quiz-title');
const ql = document.getElementById('quiz-label');
const qiInput = document.getElementById('quiz-input');
const qf = document.getElementById('quiz-feedback');
const cBtn = document.getElementById('quiz-check');
const nBtn = document.getElementById('quiz-next');

document.getElementById('start-custom-quiz').onclick = () => {
  quizQueue = [];
  selectedTopics.forEach(i => {
    topics[i].formulas.forEach(f => {
      quizQueue.push({ topic: topics[i].name, formula: f, idx: i });
    });
  });
  qi = 0;
  document.getElementById('quiz-selection').classList.add('hidden');
  stage.classList.remove('hidden');
  showQuestion();
};

function showQuestion() {
  const q = quizQueue[qi];
  qt.textContent = q.topic;
  ql.textContent = `Enter formula for: ${q.formula.split('=')[0].trim()}`;
  qiInput.value = '';
  qf.textContent = '';
  cBtn.classList.remove('hidden');
  nBtn.classList.add('hidden');
}

cBtn.onclick = () => {
  const q = quizQueue[qi];
  if (qiInput.value.trim() === q.formula) {
    qf.textContent = '✅ Correct!';
    cBtn.classList.add('hidden');
    nBtn.classList.remove('hidden');
  } else {
    qf.textContent = '❌ Try again';
  }
};

nBtn.onclick = () => {
  const q = quizQueue[qi];
  progress[q.idx] = true;
  updateParts();
  qi++;
  if (qi < quizQueue.length) {
    showQuestion();
  } else {
    stage.classList.add('hidden');
    document.getElementById('quiz-selection').classList.remove('hidden');
    document.getElementById('stats').classList.remove('hidden');
    showStats();
  }
  localStorage.setItem('deepformula-progress', JSON.stringify(progress));
};

function showStats() {
  const ul = document.getElementById('stats-list');
  ul.innerHTML = '';
  topics.forEach((t,i) => {
    const li = document.createElement('li');
    li.textContent = `${t.name}: ${progress[i] ? 'Passed' : 'Not passed'}`;
    ul.append(li);
  });
}