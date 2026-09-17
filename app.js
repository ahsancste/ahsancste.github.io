const body = document.body;
const themeButton = document.querySelector('.theme-toggle');
const themeIcon = document.querySelector('.theme-icon');
const storedTheme = localStorage.getItem('portfolio-theme');

const startsDark = storedTheme === 'dark';
body.classList.toggle('light', !startsDark);
themeIcon.textContent = startsDark ? '☀' : '☾';

themeButton.addEventListener('click', () => {
  body.classList.toggle('light');
  const isLight = body.classList.contains('light');
  localStorage.setItem('portfolio-theme', isLight ? 'light' : 'dark');
  themeIcon.textContent = isLight ? '☾' : '☀';
});

const editorScroll = document.querySelector('#editor-scroll');
const sections = [...document.querySelectorAll('.code-section[id]')];
const links = [...document.querySelectorAll('.nav-link')];
const activeFileName = document.querySelector('.active-file-name');
const breadcrumbFile = document.querySelector('.breadcrumb-file');
const statusFile = document.querySelector('.idea-statusbar > strong');
const navObserver = new IntersectionObserver((entries) => {
  const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (!visible) return;
  const activeId = `#${visible.target.id}`;
  const activeLink = links.find((link) => link.getAttribute('href') === activeId);
  links.forEach((link) => link.classList.toggle('active', link === activeLink));
  const fileName = visible.target.dataset.file || 'AhsanHabib.java';
  activeFileName.textContent = fileName;
  breadcrumbFile.textContent = fileName;
  statusFile.textContent = fileName;
}, { root: window.innerWidth > 780 ? editorScroll : null, rootMargin: '-18% 0px -65% 0px', threshold: [0.05, 0.2, 0.45] });

sections.forEach((section) => navObserver.observe(section));

document.querySelectorAll('[data-scroll]').forEach((button) => button.addEventListener('click', () => {
  document.querySelector(button.dataset.scroll)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}));

const workbench = document.querySelector('.idea-workbench');
document.querySelectorAll('.assistant-open').forEach((button) => button.addEventListener('click', () => {
  workbench.classList.add('ai-open');
  window.setTimeout(() => document.querySelector('#chat-input')?.focus(), 280);
}));
document.querySelector('.assistant-close')?.addEventListener('click', () => workbench.classList.remove('ai-open'));

const chatForm = document.querySelector('#chat-form');
const chatInput = document.querySelector('#chat-input');
const chatLog = document.querySelector('#chat-log');
const promptButtons = document.querySelectorAll('[data-question]');

const answers = [
  {
    keys: ['what do you do', 'what does ahsan do', 'help me', 'about ahsan', 'who are you', 'profile', 'আপনি কি করেন', 'আহসান সম্পর্কে', 'পরিচয়'],
    en: 'Ahsan is a Senior Software Engineer focused on banking technology and FinTech. He turns complex financial rules into dependable Java, Spring and Oracle systems—from core banking workflows to field operations and digital recovery channels.',
    bn: 'আহসান একজন Senior Software Engineer—মূলত Banking Technology ও FinTech নিয়ে কাজ করেন। তিনি জটিল financial rules-কে Java, Spring ও Oracle-ভিত্তিক নির্ভরযোগ্য software system-এ রূপ দেন।',
    actions: [['See banking impact', '#work'], ['Download CV', 'Ahsan_Habib_CV.pdf']]
  },
  {
    keys: ['experience', 'career', 'years', 'banking', 'bank', 'islami bank', 'pubali', 'rds', 'core banking', 'অভিজ্ঞতা', 'ব্যাংকিং', 'চাকরি'],
    en: 'He has 13+ years in software engineering and 8+ years inside banking technology, including Islami Bank Bangladesh PLC and Pubali Bank PLC. His work covers Islamic investment, core banking, microfinance operations, recovery APIs, payments, payroll, GL mapping and enterprise workflows.',
    bn: 'তার Software Engineering-এ ১৩+ বছর এবং Banking Technology-তে ৮+ বছরের অভিজ্ঞতা আছে। Islami Bank Bangladesh PLC ও Pubali Bank PLC-তে Islamic investment, core banking, microfinance operations, recovery API, payment, payroll ও GL workflow নিয়ে কাজ করেছেন।',
    actions: [['Explore experience', '#work']]
  },
  {
    keys: ['skill', 'stack', 'technology', 'java', 'spring', 'oracle', 'postgres', 'technical', 'দক্ষতা', 'টেকনোলজি', 'স্কিল'],
    en: 'His core stack includes Java 21, Spring Boot 4, Spring, Struts, Hibernate, Oracle, PostgreSQL, REST APIs and Thymeleaf. He also works with React, Node.js, C# and ASP.NET, with particular strength in transaction-heavy enterprise systems and legacy modernization.',
    bn: 'তার মূল stack হলো Java 21, Spring Boot 4, Spring, Struts, Hibernate, Oracle, PostgreSQL, REST API ও Thymeleaf। পাশাপাশি React, Node.js, C# ও ASP.NET নিয়েও কাজ করেন। Transaction-heavy enterprise system ও legacy modernization তার বিশেষ দক্ষতা।',
    actions: [['View technical stack', '#stack']]
  },
  {
    keys: ['product', 'project', 'built', 'cosmos', 'cosmos ui', 'pos', 'encoretrade', 'independent', 'প্রজেক্ট', 'প্রোডাক্ট', 'কসমস', 'পস'],
    en: 'Ahsan’s independent products include Cosmos UI—a Spring Boot 4 admin dashboard and reusable Thymeleaf component library—and EncoreTrade POS, a multi-company, multi-branch point-of-sale platform built with Spring Boot and PostgreSQL.',
    bn: 'আহসানের independent product-এর মধ্যে আছে Cosmos UI—Spring Boot 4 admin dashboard ও reusable Thymeleaf component library; এবং EncoreTrade POS—Spring Boot ও PostgreSQL-ভিত্তিক multi-company, multi-branch point-of-sale system।',
    actions: [['Cosmos UI', 'https://ahsancster.gumroad.com/l/cosmos-ui'], ['EncoreTrade POS', 'https://pos.encoretradebd.com/'], ['All products', '#independent']]
  },
  {
    keys: ['education', 'degree', 'msc', 'master', 'bsc', 'university', 'study', 'শিক্ষা', 'ডিগ্রি', 'মাস্টার্স', 'বিশ্ববিদ্যালয়'],
    en: 'He completed an M.Sc. in Computer Science from the University of South Asia in 2023 with a CGPA of 3.51/4.00, and a B.Sc. Engineering in CSE from Noakhali Science & Technology University in 2011.',
    bn: 'তিনি ২০২৩ সালে University of South Asia থেকে Computer Science-এ M.Sc. সম্পন্ন করেছেন—CGPA 3.51/4.00। এর আগে ২০১১ সালে Noakhali Science & Technology University থেকে CSE-তে B.Sc. Engineering সম্পন্ন করেন।',
    actions: [['View credentials', '#credentials']]
  },
  {
    keys: ['certificate', 'certification', 'oracle certified', 'oca', 'ocp', 'সার্টিফিকেট', 'সার্টিফিকেশন'],
    en: 'Ahsan holds Oracle Certified Professional: Java SE 11 Developer and Oracle Certified Associate: Java SE 8 Programmer credentials. He also completed C# .NET full-stack certification.',
    bn: 'আহসানের Oracle Certified Professional: Java SE 11 Developer এবং Oracle Certified Associate: Java SE 8 Programmer certification আছে। তার C# .NET full-stack certification-ও রয়েছে।',
    actions: [['View certifications', '#credentials']]
  },
  {
    keys: ['contact', 'email', 'phone', 'linkedin', 'hire', 'available', 'opportunity', 'cv', 'resume', 'যোগাযোগ', 'ইমেইল', 'ফোন', 'নিয়োগ', 'সিভি'],
    en: 'Ahsan is based in Dhaka, Bangladesh and is open to senior Java, Spring Boot, banking technology and FinTech opportunities—locally and internationally. You can email him, connect on LinkedIn or download his full CV.',
    bn: 'আহসান ঢাকায় অবস্থান করছেন এবং দেশি-বিদেশি Senior Java, Spring Boot, Banking Technology ও FinTech opportunity-তে আগ্রহী। ইমেইল, LinkedIn অথবা তার পূর্ণ CV-এর মাধ্যমে যোগাযোগ করতে পারেন।',
    actions: [['Email Ahsan', 'mailto:ahsancste@gmail.com'], ['LinkedIn', 'https://linkedin.com/in/ahsancste'], ['Download CV', 'Ahsan_Habib_CV.pdf']]
  },
  {
    keys: ['hello', 'hi', 'hey', 'good morning', 'assalamu', 'salam', 'হ্যালো', 'হাই', 'সালাম', 'আসসালামু'],
    en: 'Hello! I can help you explore Ahsan’s experience, banking work, technical skills, independent products, education, certifications and contact details. What would you like to know?',
    bn: 'আসসালামু আলাইকুম! আহসানের experience, banking work, technical skills, products, education, certifications ও contact information সম্পর্কে আমাকে প্রশ্ন করতে পারেন। কী জানতে চান?',
    actions: []
  }
];

const fallbackAnswer = {
  en: 'I’m focused on Ahsan’s professional portfolio. Try asking about his banking experience, Java and Spring skills, Cosmos UI, EncoreTrade POS, education, certifications, availability or contact details.',
  bn: 'আমি আহসানের professional portfolio সম্পর্কিত তথ্য দিতে পারি। তার banking experience, Java/Spring skills, Cosmos UI, EncoreTrade POS, education, certification, availability অথবা contact নিয়ে প্রশ্ন করুন।',
  actions: [['Explore portfolio', '#story'], ['Contact Ahsan', '#contact']]
};

const isBangla = (text) => /[\u0980-\u09FF]/.test(text);
const normalize = (text) => text.toLowerCase().replace(/[^a-z0-9\u0980-\u09FF+#. ]/g, ' ').replace(/\s+/g, ' ').trim();

function findAnswer(question) {
  const query = normalize(question);
  let best = null;
  let bestScore = 0;
  answers.forEach((answer) => {
    let score = 0;
    answer.keys.forEach((key) => {
      const normalizedKey = normalize(key);
      if (query.includes(normalizedKey)) score += normalizedKey.includes(' ') ? 4 : 2;
      else normalizedKey.split(' ').forEach((word) => { if (word.length > 2 && query.includes(word)) score += 1; });
    });
    if (score > bestScore) { best = answer; bestScore = score; }
  });
  return bestScore > 0 ? best : fallbackAnswer;
}

function scrollChat() { chatLog.scrollTop = chatLog.scrollHeight; }

function addUserMessage(text) {
  const row = document.createElement('div');
  row.className = 'chat-row user-row';
  const bubble = document.createElement('div');
  bubble.className = 'chat-bubble user-bubble';
  bubble.textContent = text;
  row.appendChild(bubble);
  chatLog.appendChild(row);
  scrollChat();
}

function addTyping() {
  const row = document.createElement('div');
  row.className = 'chat-row assistant-row typing-row';
  row.innerHTML = '<div class="chat-avatar" aria-hidden="true">AH</div><div class="chat-bubble assistant-bubble"><span class="typing-dots" aria-label="Preparing answer"><i></i><i></i><i></i></span></div>';
  chatLog.appendChild(row);
  scrollChat();
  return row;
}

function addAssistantMessage(answer, bangla) {
  const row = document.createElement('div');
  row.className = 'chat-row assistant-row';
  const avatar = document.createElement('div');
  avatar.className = 'chat-avatar';
  avatar.setAttribute('aria-hidden', 'true');
  avatar.textContent = 'AH';
  const bubble = document.createElement('div');
  bubble.className = 'chat-bubble assistant-bubble';
  const copy = document.createElement('div');
  copy.textContent = bangla ? answer.bn : answer.en;
  bubble.appendChild(copy);
  if (answer.actions?.length) {
    const actions = document.createElement('div');
    actions.className = 'chat-actions';
    answer.actions.forEach(([label, href]) => {
      const link = document.createElement('a');
      link.href = href;
      link.textContent = `${label} ↗`;
      if (href.startsWith('http')) { link.target = '_blank'; link.rel = 'noreferrer'; }
      if (href.endsWith('.pdf')) link.setAttribute('download', '');
      actions.appendChild(link);
    });
    bubble.appendChild(actions);
  }
  row.append(avatar, bubble);
  chatLog.appendChild(row);
  scrollChat();
}

function askPortfolio(question) {
  const cleanQuestion = question.trim();
  if (!cleanQuestion) { chatInput.focus(); return; }
  addUserMessage(cleanQuestion);
  chatInput.value = '';
  chatInput.disabled = true;
  chatForm.querySelector('button').disabled = true;
  const typing = addTyping();
  window.setTimeout(() => {
    typing.remove();
    addAssistantMessage(findAnswer(cleanQuestion), isBangla(cleanQuestion));
    chatInput.disabled = false;
    chatForm.querySelector('button').disabled = false;
    chatInput.focus();
  }, 520);
}

chatForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  askPortfolio(chatInput.value);
});

promptButtons.forEach((button) => button.addEventListener('click', () => askPortfolio(button.dataset.question)));
