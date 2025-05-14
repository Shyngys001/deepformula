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

document.getElementById('login-form').onsubmit = e => {
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

// === Update car parts
const carParts = document.querySelectorAll('.part');
function updateParts() {
  carParts.forEach((el, i) => {
    el.classList.toggle('unlocked', progress[i]);
  });
}
updateParts();

// === Learn
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

// === Quiz topic selector
const selectedTopics = new Set();
const checkboxesDiv = document.getElementById('topic-checkboxes');
topics.forEach((t, i) => {
  const label = document.createElement('label');
  label.innerHTML = `<input type="checkbox" data-index="${i}"> ${t.name}`;
  checkboxesDiv.appendChild(label);
});

checkboxesDiv.addEventListener('change', e => {
  const index = +e.target.dataset.index;
  if (e.target.checked) selectedTopics.add(index);
  else selectedTopics.delete(index);
  document.getElementById('start-custom-quiz').disabled = selectedTopics.size === 0;
});

// === Quiz runtime
let quizQueue = [];
let currentQuestionIndex = 0;

const stage = document.getElementById('quiz-stage');
const quizTitle = document.getElementById('quiz-title');
const quizLabel = document.getElementById('quiz-label');
const quizInput = document.getElementById('quiz-input');
const quizFeedback = document.getElementById('quiz-feedback');
const btnCheck = document.getElementById('quiz-check');
const btnNext = document.getElementById('quiz-next');

document.getElementById('start-custom-quiz').onclick = () => {
  quizQueue = [];
  selectedTopics.forEach(i => {
    topics[i].formulas.forEach(f => {
      quizQueue.push({ topic: topics[i].name, formula: f, topicIndex: i });
    });
  });
  currentQuestionIndex = 0;
  document.getElementById('quiz-selection').classList.add('hidden');
  stage.classList.remove('hidden');
  showCustomQuestion();
};

function showCustomQuestion() {
  const q = quizQueue[currentQuestionIndex];
  quizTitle.textContent = q.topic;
  quizLabel.textContent = `Enter the formula for: ${q.formula.split('=')[0].trim()}`;
  quizInput.value = '';
  quizFeedback.textContent = '';
  btnCheck.classList.remove('hidden');
  btnNext.classList.add('hidden');
}

btnCheck.onclick = () => {
  const q = quizQueue[currentQuestionIndex];
  const correct = quizInput.value.trim() === q.formula;
  quizFeedback.textContent = correct ? '✅ Correct!' : '❌ Try again';
  if (correct) {
    btnCheck.classList.add('hidden');
    btnNext.classList.remove('hidden');
  }
};

btnNext.onclick = () => {
  const q = quizQueue[currentQuestionIndex];
  progress[q.topicIndex] = true;
  currentQuestionIndex++;
  if (currentQuestionIndex < quizQueue.length) {
    showCustomQuestion();
  } else {
    stage.classList.add('hidden');
    document.getElementById('quiz-selection').classList.remove('hidden');
    alert('✅ Test completed!');
  }
  localStorage.setItem('deepformula-progress', JSON.stringify(progress));
  updateParts();
};