const root = document.documentElement;
const toggleBtn = document.getElementById('toggle-theme');
toggleBtn.onclick = () => {
  const isDark = root.getAttribute('data-theme') === 'dark';
  root.setAttribute('data-theme', isDark ? 'light' : 'dark');
  toggleBtn.textContent = isDark ? '🌙' : '🌞';
};

document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = link.getAttribute('data-page');
    showPage(target);
    document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
    link.classList.add('active');
  });
});

function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
  document.getElementById(pageId).classList.remove('hidden');
}

document.getElementById('show-signup').onclick = () => {
  document.getElementById('login-form').classList.add('hidden');
  document.getElementById('signup-form').classList.remove('hidden');
};
document.getElementById('show-login').onclick = () => {
  document.getElementById('signup-form').classList.add('hidden');
  document.getElementById('login-form').classList.remove('hidden');
};

document.getElementById('login-form').onsubmit =
document.getElementById('signup-form').onsubmit = e => {
  e.preventDefault();
  document.getElementById('auth').classList.add('hidden');
  document.getElementById('app').classList.remove('hidden');
  showPage('home');
};

// === DATA ===
const topics = [
  { name: 'Kinematics – Wheels', formulas: ['v = s/t', 'a = Δv/Δt'] },
  { name: 'Dynamics – Rear wing', formulas: ['F = ma', 'p = mv'] },
  { name: 'Thermodynamics – Exhaust pipe', formulas: ['Q = mcΔT'] },
  { name: 'Electricity – Light indicators', formulas: ['V = IR', 'I = q/t'] },
  { name: 'Optics – Helmet visor', formulas: ['n = c/v'] },
  { name: 'Quantum Physics – Carbon panels', formulas: ['E = hf'] },
];
const progress = JSON.parse(localStorage.getItem('deepformula-progress')) || Array(6).fill(false);

const carParts = document.querySelectorAll('.part');
function updateParts() {
  carParts.forEach((el, i) => {
    if (progress[i]) el.classList.add('unlocked');
    else el.classList.remove('unlocked');
  });
}
updateParts();

const topicsDiv = document.getElementById('topics');
topics.forEach(t => {
  const card = document.createElement('div');
  card.className = 'card';
  const h = document.createElement('h3');
  h.textContent = t.name;
  card.appendChild(h);
  t.formulas.forEach(f => {
    const p = document.createElement('p');
    p.textContent = f;
    card.appendChild(p);
  });
  topicsDiv.appendChild(card);
});

// === QUIZ SYSTEM ===
const quizzesDiv = document.getElementById('quizzes');
topics.forEach((t, i) => {
  const card = document.createElement('div');
  card.className = 'card';
  const h = document.createElement('h3');
  h.textContent = t.name;
  const btn = document.createElement('button');
  btn.textContent = 'Start Quiz';
  btn.onclick = () => startQuiz(i);
  card.append(h, btn);
  quizzesDiv.appendChild(card);
});

let currentQuizIndex = null;
let currentQuestionIndex = 0;

const stage = document.getElementById('quiz-stage');
const quizTitle = document.getElementById('quiz-title');
const quizLabel = document.getElementById('quiz-label');
const quizInput = document.getElementById('quiz-input');
const quizFeedback = document.getElementById('quiz-feedback');
const btnCheck = document.getElementById('quiz-check');
const btnNext = document.getElementById('quiz-next');

function startQuiz(index) {
  currentQuizIndex = index;
  currentQuestionIndex = 0;
  stage.classList.remove('hidden');
  showQuestion();
}

function showQuestion() {
  const q = topics[currentQuizIndex].formulas[currentQuestionIndex];
  quizTitle.textContent = topics[currentQuizIndex].name;
  quizLabel.textContent = `Enter the formula for: ${q.split('=')[0].trim()}`;
  quizInput.value = '';
  quizFeedback.textContent = '';
  btnCheck.classList.remove('hidden');
  btnNext.classList.add('hidden');
}

btnCheck.onclick = () => {
  const correct = quizInput.value.trim() === topics[currentQuizIndex].formulas[currentQuestionIndex];
  quizFeedback.textContent = correct ? '✅ Correct!' : '❌ Try again';
  if (correct) {
    btnCheck.classList.add('hidden');
    btnNext.classList.remove('hidden');
  }
};

btnNext.onclick = () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < topics[currentQuizIndex].formulas.length) {
    showQuestion();
  } else {
    stage.classList.add('hidden');
    progress[currentQuizIndex] = true;
    localStorage.setItem('deepformula-progress', JSON.stringify(progress));
    updateParts();
  }
};