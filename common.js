// 공용 데이터 / 헬퍼 - 모든 페이지에서 불러옵니다.

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
const DOW = ['일', '월', '화', '수', '목', '금', '토'];

function catInfo(id) {
  return CATS.find((c) => c.id === id) || CATS[0];
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// ----- 날짜 헬퍼 (한국 시간 등 "내 기기의 현재 날짜" 기준) -----
function pad2(n) {
  return String(n).padStart(2, '0');
}
function dateToStr(d) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}
function todayStr() {
  return dateToStr(new Date());
}
function parseDateStr(s) {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}
function isValidDateStr(s) {
  return typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s) && !isNaN(parseDateStr(s).getTime());
}
function shiftDate(s, delta) {
  const d = parseDateStr(s);
  d.setDate(d.getDate() + delta);
  return dateToStr(d);
}
function formatKoreanDate(s) {
  const d = parseDateStr(s);
  return `${d.getMonth() + 1}월 ${d.getDate()}일 (${DOW[d.getDay()]})`;
}

function escapeHtml(s) {
  if (s == null) return '';
  return String(s).replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
}

// ----- 저장소 -----
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

// ----- 토스트 -----
let toastTimer = null;
function showToast(msg) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2200);
}

// ----- 진행도 (선택한 날짜 기준, 카테고리별 완료 비율) -----
function renderProgress(routines, logs, date) {
  const root = document.getElementById('progress-root');
  if (!root) return;
  const doneIds = new Set(logs.filter((l) => l.date === date).map((l) => l.routineId));
  const total = routines.length;
  const done = routines.filter((r) => doneIds.has(r.id)).length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  const rows = CATS.map((c) => {
    const items = routines.filter((r) => r.cat === c.id);
    if (!items.length) return '';
    const d = items.filter((r) => doneIds.has(r.id)).length;
    const p = Math.round((d / items.length) * 100);
    return `<div class="cat-row">
      <span class="cat-label"><span class="lv-dot" style="background:${c.color}"></span>${c.label}</span>
      <div class="track"><div class="fill" style="width:${p}%; background:${c.color}"></div></div>
      <span class="cat-count">${d}/${items.length}</span>
    </div>`;
  }).join('');

  root.innerHTML = `
    <div class="progress">
      <div class="progress-head"><span><b>${done}/${total}</b>완료</span><span>${pct}%</span></div>
      <div class="progress-total"><div style="width:${pct}%"></div></div>
      ${rows}
    </div>`;
}

// ----- 루틴 이름 변경 (기존 기록의 제목도 같이 바꿔서 기록 탭과 맞춰요) -----
function applyRename(routines, logs, id, newTitle) {
  const title = String(newTitle || '').trim().slice(0, 60);
  const r = routines.find((x) => x.id === id);
  if (!r || !title) return false;
  r.title = title;
  logs.forEach((l) => { if (l.routineId === id) l.title = title; });
  saveRoutines(routines);
  saveLogs(logs);
  return true;
}

// ----- 수면 시간 설정 -----
const SLEEP_KEY = 'pd_sleep_v1';

function loadSleep() {
  try {
    const raw = localStorage.getItem(SLEEP_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function saveSleep(s) {
  try {
    localStorage.setItem(SLEEP_KEY, JSON.stringify(s));
  } catch (e) {
    console.error('수면 설정을 저장하지 못했어요', e);
  }
}

function isValidTime(s) {
  return typeof s === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(s);
}

// 취침→기상까지 걸리는 분 (기상이 더 이르면 다음 날로 계산)
function sleepMinutes(bed, wake) {
  const [bh, bm] = bed.split(':').map(Number);
  const [wh, wm] = wake.split(':').map(Number);
  return ((wh * 60 + wm) - (bh * 60 + bm) + 1440) % 1440;
}

function formatDuration(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m ? `${h}시간 ${m}분` : `${h}시간`;
}

// 설정한 시간으로 '수면' 루틴 이름을 바꿔요. 수면 루틴이 없으면 새로 만들어요.
function applySleepRoutine(bed, wake) {
  const routines = loadRoutines();
  const logs = loadLogs();
  const title = `수면 ${formatDuration(sleepMinutes(bed, wake))} (${bed}~${wake})`;
  const saved = loadSleep();

  let r = saved && saved.routineId ? routines.find((x) => x.id === saved.routineId) : null;
  if (!r) r = routines.find((x) => x.cat === 'survival' && x.title.startsWith('수면'));

  let created = false;
  if (r) {
    r.title = title;
    logs.forEach((l) => { if (l.routineId === r.id) l.title = title; });
  } else {
    r = { id: uid(), title, cat: 'survival' };
    routines.unshift(r);
    created = true;
  }
  saveRoutines(routines);
  saveLogs(logs);
  saveSleep({ bed, wake, routineId: r.id });
  return { title, created };
}
