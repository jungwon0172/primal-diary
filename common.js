// 공용 데이터 / 헬퍼 - 모든 페이지에서 <script src="common.js"></script>로 불러옵니다.

const CATS = [
  { id: 'survival', label: '생존', color: 'var(--lv1)' },
  { id: 'homeo', label: '항상성', color: 'var(--lv2)' },
  { id: 'growth', label: '성장', color: 'var(--lv3)' },
  { id: 'connect', label: '연결', color: 'var(--lv4)' },
  { id: 'defocus', label: '탈집중', color: 'var(--lv5)' },
];

const DEFAULT_ROUTINES = [
  { title: '수면 (7시간 이상)', cat: 'survival' },
  { title: '물 적정량 마시기', cat: 'survival' },
  { title: '심호흡 5분', cat: 'survival' },
  { title: '아침 햇빛 쐬기', cat: 'homeo' },
  { title: '걷기 / 러닝', cat: 'homeo' },
  { title: '영양 챙기기', cat: 'homeo' },
  { title: '의도된 불편함 (냉수 샤워 등)', cat: 'growth' },
  { title: '근력 운동', cat: 'growth' },
  { title: '고강도 운동 (전력질주 등)', cat: 'growth' },
  { title: '눈맞춤 대화', cat: 'connect' },
  { title: '친구와 대면 만남', cat: 'connect' },
  { title: '사회적 기여', cat: 'connect' },
  { title: '파트너와 친밀한 시간', cat: 'connect' },
  { title: '몰입 활동 (책/악기/그림 등)', cat: 'defocus' },
  { title: '포르노 안 보기', cat: 'defocus' },
  { title: '멍때리기', cat: 'defocus' },
];

const ROUTINES_KEY = 'pd_routines_v2';
const LOGS_KEY = 'pd_logs_v2';

function catInfo(id) {
  return CATS.find((c) => c.id === id) || CATS[0];
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function escapeHtml(s) {
  if (s == null) return '';
  return String(s).replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
}

function loadRoutines() {
  try {
    const raw = localStorage.getItem(ROUTINES_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('루틴을 불러오지 못했어요', e);
  }
  const seeded = DEFAULT_ROUTINES.map((r) => ({ id: uid(), ...r }));
  saveRoutines(seeded);
  return seeded;
}

function saveRoutines(routines) {
  try {
    localStorage.setItem(ROUTINES_KEY, JSON.stringify(routines));
  } catch (e) {
    console.error('루틴을 저장하지 못했어요', e);
  }
}

function loadLogs() {
  try {
    const raw = localStorage.getItem(LOGS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('기록을 불러오지 못했어요', e);
    return [];
  }
}

function saveLogs(logs) {
  try {
    localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
  } catch (e) {
    console.error('기록을 저장하지 못했어요', e);
  }
}

// 토스트 알림
let toastTimer = null;
function showToast(msg) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2200);
}

// 벽화(mural) 렌더링 - #mural-root 요소가 있는 페이지에서 사용
function renderMural(logs) {
  const root = document.getElementById('mural-root');
  if (!root) return;
  const counts = {};
  CATS.forEach((c) => (counts[c.id] = 0));
  logs.forEach((l) => {
    if (counts[l.cat] !== undefined) counts[l.cat]++;
  });
  const max = Math.max(1, ...Object.values(counts));

  const cols = CATS.map((c) => {
    const n = counts[c.id];
    const h = 100 / Math.max(n, Math.ceil(max));
    const marks = Array.from({ length: n })
      .map((_, i) => `<div class="mural-mark" style="height:${h}%; background:${c.color}; ${i % 2 ? 'filter:brightness(.85);' : ''}"></div>`)
      .join('');
    return `<div class="mural-col">${marks}</div>`;
  }).join('');

  const labels = CATS.map((c) => `<span>${c.label}</span>`).join('');

  root.innerHTML = `<div class="mural">${cols}</div><div class="mural-label">${labels}</div>`;
}
