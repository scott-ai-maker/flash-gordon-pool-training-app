/* =====================================================
   BU RUNOUT DRILL SYSTEM — merged into FGP Training PWA
   Based on Dr. Dave & Bob Jewett's RDS system
   All functions namespaced with rds prefix to avoid conflicts.
   ===================================================== */

/* ── LEVEL DATA ───────────────────────────────────────── */
const LEVELS = [
  { num:1,  title:'6 Balls — No Cue Ball',              grade:'Novice (Lower)',    gradeCode:'NOV', fargo:[100,174], fargoMid:137, abcd:'D--',      color:'#7a8a7a', balls:6,  bihExtra:999, order:false, ruleType:'none',           desc:'Break 6 balls, remove the cue ball, and pocket each object ball directly — no CB used.',                                            rules:['Break a rack of 6 balls','Remove the cue ball from the table','Pocket each object ball directly (push or roll by hand), in any order','Wipe chalk marks off balls when done'] },
  { num:2,  title:'6 Balls — BIH Every Shot',           grade:'Novice (Mid)',      gradeCode:'NOV', fargo:[150,199], fargoMid:175, abcd:'D--',      color:'#7a8a7a', balls:6,  bihExtra:999, order:false, ruleType:'any',            desc:'Break 6 balls. Take cue ball in hand for every shot. Pocket each ball in any order.',                                               rules:['Break a rack of 6 balls','Take cue ball in hand (BIH) before every single shot','Pocket each ball in any order','No misses or scratches allowed after placing CB'] },
  { num:3,  title:'6 Balls — 3 Extra BIHs',             grade:'Novice (Upper)',    gradeCode:'NOV', fargo:[175,199], fargoMid:187, abcd:'D--',      color:'#7a8a7a', balls:6,  bihExtra:3,   order:false, ruleType:'any',            desc:'Break 6 balls. BIH after the break, plus 3 more anytime. Pocket each ball in any order.',                                          rules:['Break a rack of 6 balls','BIH automatically after the break','3 additional BIHs — use anytime during the run','Pocket each ball in any order','A miss or scratch (when no BIH remains) ends the run'] },
  { num:4,  title:'6 Balls — 2 Extra BIHs',             grade:'Lower Beginner',    gradeCode:'D−',  fargo:[200,249], fargoMid:225, abcd:'D-',       color:'#b87830', balls:6,  bihExtra:2,   order:false, ruleType:'any',            desc:'Break 6 balls. BIH after break, plus 2 more anytime. Pocket each ball in any order.',                                              rules:['Break a rack of 6 balls','BIH automatically after the break','2 additional BIHs — use anytime during the run','Pocket each ball in any order','A miss or scratch (when no BIH remains) ends the run'] },
  { num:5,  title:'6 Balls — 1 Extra BIH',              grade:'Mid Beginner',      gradeCode:'D',   fargo:[250,299], fargoMid:275, abcd:'D',        color:'#c88030', balls:6,  bihExtra:1,   order:false, ruleType:'any',            desc:'Break 6 balls. BIH after break, plus 1 more anytime. Pocket each ball in any order.',                                              rules:['Break a rack of 6 balls','BIH automatically after the break','1 additional BIH — use it anytime during the run','Pocket each ball in any order','A miss or scratch (after BIH used) ends the run'] },
  { num:6,  title:'7 Balls (3+3+8) — 8-Ball, 1 Extra BIH', grade:'Upper Beginner', gradeCode:'D+', fargo:[300,349], fargoMid:325, abcd:'D+',       color:'#d09038', balls:7,  bihExtra:1,   order:false, ruleType:'8ball',          desc:'Break 7 balls (3 solids, 3 stripes, 8). 8-ball rules. BIH after break + 1 more.',                                                  rules:['Break: 6 balls (3 solids, 3 stripes) with the 8-ball added in the center or back','BIH automatically after the break','1 additional BIH — use it anytime during the run','Standard 8-ball rules: pocket your group (solids or stripes), then pocket the 8','Must call pockets — slop does not count','If you pocket the 8 early it is a loss (re-rack or end run)'] },
  { num:7,  title:'9 Balls — 1 Extra BIH',              grade:'Lower Intermediate',gradeCode:'C−',  fargo:[350,399], fargoMid:375, abcd:'C-',       color:'#1a7a8a', balls:9,  bihExtra:1,   order:false, ruleType:'any',            desc:'Break 9 balls. BIH after break + 1 more anytime. Pocket each ball in any order.',                                                  rules:['Break a rack of 9 balls','BIH automatically after the break','1 additional BIH — use it anytime during the run','Pocket each ball in any order','A miss or scratch (after BIH used) ends the run'] },
  { num:8,  title:'9 Balls (4+4+8) — 8-Ball, 1 Extra BIH', grade:'Mid Intermediate', gradeCode:'C', fargo:[400,449], fargoMid:425, abcd:'C',       color:'#1a8090', balls:9,  bihExtra:1,   order:false, ruleType:'8ball',          desc:'Break 9 balls (4 solids, 4 stripes, 8 in center). 8-ball rules. BIH after break + 1 more.',                                        rules:['Break 9 balls — 4 solids, 4 stripes, 8-ball in center','BIH automatically after the break','1 additional BIH — use it anytime during the run','Standard 8-ball rules: pocket your group, then pocket the 8','Must call pockets — slop does not count'] },
  { num:9,  title:'15 Balls — 2 Extra BIHs',            grade:'Upper Intermediate',gradeCode:'C+',  fargo:[450,499], fargoMid:475, abcd:'C+',       color:'#0e8898', balls:15, bihExtra:2,   order:false, ruleType:'any',            desc:'Break 15 balls. BIH after break + 2 more anytime. Pocket each ball in any order.',                                                 rules:['Break a full rack of 15 balls','BIH automatically after the break','2 additional BIHs — use anytime during the run','Pocket each ball in any order','A miss or scratch (when no BIH remains) ends the run'] },
  { num:10, title:'6 Balls — In Order (Rotation)',       grade:'Lower Advanced',    gradeCode:'B−',  fargo:[500,549], fargoMid:525, abcd:'B-',       color:'#b8a010', balls:6,  bihExtra:0,   order:true,  ruleType:'rotation',       desc:'Break 6 balls. BIH after break only. Shoot balls in rotation — always hit the lowest ball first.',                                 rules:['Break a rack of 6 balls','BIH after the break only — no additional BIHs','Shoot balls in rotation — must always contact the lowest-numbered ball first','Combos are allowed; slop counts','A miss or scratch ends the run immediately'] },
  { num:11, title:'15 Balls — Any Order',                grade:'Mid Advanced',      gradeCode:'B',   fargo:[550,599], fargoMid:575, abcd:'B',        color:'#c8aa10', balls:15, bihExtra:0,   order:false, ruleType:'any',            desc:'Break 15 balls. BIH after break only. Pocket each ball in any order.',                                                             rules:['Break a full rack of 15 balls','BIH after the break only — no additional BIHs','Pocket each ball in any order','A miss or scratch ends the run immediately'] },
  { num:12, title:'15 Balls — 8-Ball Rules',             grade:'Upper Advanced',    gradeCode:'B+',  fargo:[600,649], fargoMid:625, abcd:'B+',       color:'#c8b020', balls:15, bihExtra:0,   order:false, ruleType:'8ball',          desc:'Break 15 balls. BIH after break only. Standard 8-ball rules.',                                                                     rules:['Break a full rack of 15 balls','BIH after the break only — no additional BIHs','Standard 8-ball rules: pocket your group (solids or stripes), then pocket the 8','Must call pockets — slop does not count','A miss, foul, or wrong-group ball ends the run'] },
  { num:13, title:'9 Balls (4+4+8) — 8-Ball + Remaining In Order', grade:'Lower Shortstop', gradeCode:'A−', fargo:[650,689], fargoMid:670, abcd:'A-/A', color:'#b82020', balls:9, bihExtra:0, order:true, ruleType:'8ball+rotation', desc:'Break 9 balls (4+4+8). BIH after break only. 8-ball rules, then remaining balls in rotation.', rules:['Break 9 balls — 4 solids, 4 stripes, 8-ball in center','BIH after the break only — no additional BIHs','8-ball rules: pocket your group, then pocket the 8','Then pocket the remaining balls in rotation (lowest first)','Must call pockets throughout — slop does not count'] },
  { num:14, title:'9 Balls — 9-Ball Rules',              grade:'Upper Shortstop',   gradeCode:'A',   fargo:[690,729], fargoMid:710, abcd:'A/AA',     color:'#c82828', balls:9,  bihExtra:0,   order:true,  ruleType:'9ball',          desc:'Break 9 balls. BIH after break only. 9-ball rules — hit lowest ball first, 9 wins anytime.',                                      rules:['Break a rack of 9 balls','BIH after the break only — no additional BIHs','9-ball rules: must always contact the lowest-numbered ball first','Pocketing the 9-ball legally at any time (including on the break) wins the rack — all balls credited','Combos and slop count; a miss or foul ends the run'] },
  { num:15, title:'15 Balls — 8-Ball + Remaining In Order', grade:'Semipro / Pro', gradeCode:'AA',  fargo:[730,769], fargoMid:750, abcd:'A++/AAA',  color:'#7820c0', balls:15, bihExtra:0,   order:true,  ruleType:'8ball+rotation', desc:'Break 15 balls. BIH after break only. 8-ball rules, then remaining balls in rotation.', rules:['Break a full rack of 15 balls','BIH after the break only — no additional BIHs','8-ball rules: pocket your group, then pocket the 8','Then pocket remaining balls in rotation (lowest first)','Must call pockets throughout — slop does not count'] },
  { num:16, title:'15 Balls — In Order (Full Rotation)',  grade:'World Class Pro',   gradeCode:'A++', fargo:[770,900], fargoMid:810, abcd:'A++/AAAA', color:'#9030e0', balls:15, bihExtra:0,   order:true,  ruleType:'rotation',       desc:'Break 15 balls. BIH after break only. Shoot all 15 balls in rotation — lowest ball first.', rules:['Break a full rack of 15 balls','BIH after the break only — no additional BIHs','Shoot all 15 balls in rotation — always contact the lowest-numbered ball first','A miss, foul, or wrong-ball contact ends the run immediately'] },
];

const RDS_FARGO_MIN = 100;
const RDS_FARGO_MAX = 900;

function rdsFargoToGauge(f) {
  return ((f - RDS_FARGO_MIN) / (RDS_FARGO_MAX - RDS_FARGO_MIN)) * 100;
}

function rdsBihLabel(lv) {
  if (lv.bihExtra >= 999) return 'BIH every shot';
  if (lv.bihExtra === 0)  return 'BIH after break only';
  return `BIH after break + ${lv.bihExtra} more`;
}

/* ── STATE ────────────────────────────────────────────── */
let RDS_S = {
  tab: 'play',
  session: null,
  rds100: null,
  history: [],
  guideOpen: {},
  rds100BallsSel: null,
};

/* ── STORAGE ──────────────────────────────────────────── */
function rdsLoadHistory() {
  try { RDS_S.history = JSON.parse(localStorage.getItem('rds_hist_v1') || '[]'); } catch(e) {}
}
function rdsSaveHistory() {
  try { localStorage.setItem('rds_hist_v1', JSON.stringify(RDS_S.history.slice(0, 50))); } catch(e) {}
}
function rdsLoadPrefs() {
  try { return JSON.parse(localStorage.getItem('rds_prefs_v1') || '{}'); } catch(e) { return {}; }
}
function rdsSavePrefs(p) {
  try { localStorage.setItem('rds_prefs_v1', JSON.stringify(p)); } catch(e) {}
}

/* ── RENDER ───────────────────────────────────────────── */
function rdsRender() {
  const root = document.getElementById('rds-app-root');
  if (!root) return;
  root.innerHTML = '<div class="rds-tab">' + rdsBuildContent() + rdsBuildSubNav() + '</div>';
  rdsAttachEvents();
}

function rdsBuildSubNav() {
  const tabs = [
    { id:'play',    label:'PLAY',    icon:'<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 100 20A10 10 0 0012 2zm-2 4.5l6 3.5-6 3.5v-7z"/></svg>' },
    { id:'rds100',  label:'RDS-100', icon:'<svg viewBox="0 0 24 24"><path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm-7 14H7v-2h5v2zm5-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>' },
    { id:'history', label:'HISTORY', icon:'<svg viewBox="0 0 24 24"><path d="M13 3a9 9 0 00-9 9H1l4 4 4-4H6a7 7 0 117 7c-1.86 0-3.54-.73-4.76-1.9L6.8 19.46A9 9 0 1013 3zm-1 5v5l4 2.5-.75 1.3L11 14V8h1z"/></svg>' },
    { id:'guide',   label:'GUIDE',   icon:'<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/></svg>' },
  ];
  return `<div class="rds-bottom-nav">${tabs.map(t => `
    <button class="rds-nav-btn${RDS_S.tab === t.id ? ' active' : ''}" data-action="rdstab" data-val="${t.id}">
      ${t.icon}<span>${t.label}</span>
    </button>`).join('')}</div>`;
}

function rdsBuildContent() {
  if (RDS_S.tab === 'play')    return rdsBuildPlayTab();
  if (RDS_S.tab === 'rds100')  return rdsBuildRds100Tab();
  if (RDS_S.tab === 'history') return rdsBuildHistoryTab();
  if (RDS_S.tab === 'guide')   return rdsBuildGuideTab();
  return '';
}

/* ── PLAY TAB ─────────────────────────────────────────── */
function rdsBuildPlayTab() {
  if (RDS_S.session && RDS_S.session.pendingVerdict) return rdsBuildVerdictScreen();
  if (RDS_S.session) return rdsBuildRackScreen();
  return rdsBuildHomeScreen();
}

function rdsBuildHomeScreen() {
  const prefs = rdsLoadPrefs();
  const suggestLv = prefs.lastLevel || 8;
  const lastSession = RDS_S.history[0];
  let lastChip = '';
  if (lastSession) {
    const lv = LEVELS[lastSession.endLevel - 1];
    lastChip = `<div class="rds-last-chip">
      <span class="rds-last-label">Last session ended at Level ${lastSession.endLevel}</span>
      <span class="rds-last-val" style="color:${lv.color}">~${lv.fargoMid} Fargo</span>
    </div>`;
  }
  return `
    <div class="rds-home-hdr">
      <div class="rds-home-title">RUNOUT DRILL SYSTEM</div>
      <div class="rds-home-sub">Break and run challenges at 16 increasing difficulty levels. Your ending level estimates your Fargo rating.<br>Run 2 of 3 racks → advance · 1 of 3 → stay · 0 of 3 → drop.</div>
    </div>
    ${lastChip}
    <button class="rds-btn-primary" data-action="rdsStartSession" data-val="${suggestLv}" style="margin-bottom:10px">▶ START SESSION — Level ${suggestLv}</button>
    <button class="rds-btn-secondary" data-action="rdsShowLevelPicker" style="margin-bottom:20px">Choose a different starting level</button>
    <div class="rds-sect-lbl">PICK YOUR STARTING LEVEL</div>
    <div class="rds-picker-grid">
      ${LEVELS.map(lv => `
        <div class="rds-picker-cell" data-action="rdsStartSession" data-val="${lv.num}" style="border-color:${lv.color}20">
          <div class="rds-picker-num" style="color:${lv.color}">${lv.num}</div>
          <div class="rds-picker-grade" style="color:${lv.color}99">${lv.gradeCode}</div>
        </div>`).join('')}
    </div>
    <div class="spacer16"></div>
    <div class="rds-sect-lbl">LEVEL REFERENCE</div>
    <div class="rds-info-box">
      Levels 1–3: Novice (&lt;200 Fargo)<br>
      Levels 4–6: Beginner D (200–349)<br>
      Levels 7–9: Intermediate C (350–499)<br>
      Levels 10–12: Advanced B (500–649)<br>
      Levels 13–14: Shortstop A (650–729)<br>
      Levels 15–16: Pro AA+ (730+)
    </div>`;
}

function rdsBuildRackScreen() {
  const ses = RDS_S.session;
  const lv = LEVELS[ses.currentLevel - 1];
  const results = ses.rackResults;
  const done = results.length >= 3;

  const dots = [0,1,2].map(i => {
    if (i >= results.length) return `<div class="rds-rack-dot rds-pending">${i+1}</div>`;
    return `<div class="rds-rack-dot ${results[i] ? 'rds-run' : 'rds-miss'}">${results[i] ? '✓' : '✗'}</div>`;
  }).join('');

  const gaugeLeft  = rdsFargoToGauge(lv.fargo[0]);
  const gaugeRight = rdsFargoToGauge(lv.fargo[1]);
  const gaugeWidth = gaugeRight - gaugeLeft;
  const thumbPct   = rdsFargoToGauge(lv.fargoMid);

  const logHtml = ses.log.length ? `
    <div class="spacer16"></div>
    <div class="rds-sect-lbl">SESSION LOG</div>
    <div class="rds-log-list">
      ${[...ses.log].reverse().map(e => {
        const d = e.results.map(r => `<span class="rds-ld ${r?'r':'m'}">${r?'✓':'✗'}</span>`).join('');
        const v = e.verdict==='advance'?'▲ ADV':e.verdict==='drop'?'▼ DRP':'→ STAY';
        return `<div class="rds-log-row">
          <span class="rds-log-lv" style="color:${LEVELS[e.level-1].color}">${e.level}</span>
          <span class="rds-log-dots">${d}</span>
          <span class="rds-log-verdict ${e.verdict}">${v}</span>
        </div>`;
      }).join('')}
    </div>` : '';

  return `
    <div class="rds-play-layout fade-up">
      <div class="rds-play-sidebar">
        <div class="rds-card">
          <div class="rds-level-row">
            <div class="rds-lv-badge" style="color:${lv.color}">
              <div class="rds-lv-num">${lv.num}</div>
              <div class="rds-lv-of">of 16</div>
            </div>
            <div class="rds-lv-info">
              <div class="rds-lv-grade" style="color:${lv.color}">${lv.grade}</div>
              <div class="rds-lv-code">${lv.abcd} · ${lv.balls} balls · ${rdsBihLabel(lv)}</div>
              <div class="rds-lv-fargo">Fargo ~${lv.fargo[0]}–${lv.fargo[1]}</div>
            </div>
          </div>
          <div class="rds-gauge-wrap">
            <div class="rds-gauge-track">
              <div style="background:${lv.color};width:${gaugeRight}%;opacity:.2;position:absolute;left:0;top:0;height:100%;border-radius:4px"></div>
              <div class="rds-gauge-fill" style="background:${lv.color};width:${gaugeWidth}%;margin-left:${gaugeLeft}%"></div>
              <div class="rds-gauge-thumb" style="left:${thumbPct}%;background:${lv.color};border-color:${lv.color}"></div>
            </div>
            <div class="rds-gauge-labels"><span>200</span><span>400</span><span>500</span><span>600</span><span>800</span></div>
          </div>
          <div class="rds-sect-lbl">FORMAT</div>
          <ul class="rds-rules-ul">${lv.rules.map(r => `<li>${r}</li>`).join('')}</ul>
        </div>
      </div>
      <div class="rds-play-main">
        <div class="rds-card">
          <div class="rds-sect-lbl">RACK RESULTS — ${results.length} of 3</div>
          <div class="rds-rack-dots">${dots}</div>
          <div class="rds-action-row">
            <button class="rds-btn-run"  data-action="rdsRecordRack" data-val="run"  ${done?'disabled':''}>RUN ✓</button>
            <button class="rds-btn-miss" data-action="rdsRecordRack" data-val="miss" ${done?'disabled':''}>MISS ✗</button>
          </div>
          <div style="text-align:center;margin-top:8px">
            <button class="rds-btn-secondary" data-action="rdsUndoRack" ${results.length===0?'disabled':''} style="opacity:${results.length===0?'.3':'1'};font-size:11px;padding:6px 18px">↩ UNDO LAST</button>
          </div>
        </div>
        <button class="rds-btn-secondary" data-action="rdsEndSession">End Session &amp; Save</button>
        ${logHtml}
      </div>
    </div>`;
}

function rdsBuildVerdictScreen() {
  const ses = RDS_S.session;
  const v   = ses.pendingVerdict;
  const lv  = LEVELS[ses.currentLevel - 1];
  const icons = {advance:'▲', stay:'→', drop:'▼'};
  const words = {advance:'ADVANCE', stay:'STAY', drop:'DROP'};
  const runCount = v.results.filter(Boolean).length;
  const gaugeThumb = rdsFargoToGauge(lv.fargoMid);

  return `
    <div class="rds-verdict-wrap fade-up">
      <div class="rds-verdict-sub">Level ${v.fromLevel} · ${runCount} of 3 runs</div>
      <div class="rds-verdict-circle ${v.verdict} pop-in">
        <div class="rds-verdict-arrow">${icons[v.verdict]}</div>
        <div class="rds-verdict-word">${words[v.verdict]}</div>
      </div>
      <div class="rds-verdict-level">
        ${v.verdict === 'stay'
          ? `Staying at <strong>Level ${v.fromLevel}</strong>`
          : `Level ${v.fromLevel} → <strong>Level ${ses.currentLevel}</strong>`}
      </div>
      <div class="rds-verdict-fargo-box" style="border-color:${lv.color}55">
        <div class="rds-vf-label">FARGO ESTIMATE</div>
        <div class="rds-vf-val" style="color:${lv.color}">~${lv.fargoMid}</div>
        <div class="rds-vf-grade">${lv.fargo[0]}–${lv.fargo[1]} · ${lv.abcd} · ${lv.grade}</div>
      </div>
      <div class="rds-card" style="text-align:left;margin-bottom:14px">
        <div class="rds-gauge-wrap">
          <div class="rds-gauge-track">
            <div style="background:${lv.color};width:${rdsFargoToGauge(lv.fargo[1])}%;opacity:.2;position:absolute;left:0;top:0;height:100%;border-radius:4px"></div>
            <div class="rds-gauge-fill" style="background:${lv.color};width:${rdsFargoToGauge(lv.fargo[1])-rdsFargoToGauge(lv.fargo[0])}%;margin-left:${rdsFargoToGauge(lv.fargo[0])}%;position:relative"></div>
            <div class="rds-gauge-thumb" style="left:${gaugeThumb}%;background:${lv.color}"></div>
          </div>
          <div class="rds-gauge-labels"><span>200</span><span>400</span><span>500</span><span>600</span><span>800</span></div>
        </div>
        <ul class="rds-rules-ul">${lv.rules.map(r => `<li>${r}</li>`).join('')}</ul>
      </div>
      <button class="rds-btn-primary" data-action="rdsContinueAfterVerdict">
        ${v.verdict === 'advance' ? '▶ Play Level ' + ses.currentLevel
        : v.verdict === 'drop'   ? '▼ Play Level ' + ses.currentLevel
        : '→ Play Level ' + ses.currentLevel + ' Again'}
      </button>
      <div class="spacer8"></div>
      <button class="rds-btn-secondary" data-action="rdsEndSession">End Session &amp; Save</button>
    </div>`;
}

/* ── RDS-100 ──────────────────────────────────────────── */
function rdsBuildRds100Tab() {
  if (!RDS_S.rds100) return rdsBuildRds100Home();
  if (RDS_S.rds100.done) return rdsBuildRds100Complete();
  return rdsBuildRds100Active();
}

function rdsBuildRds100Home() {
  return `
    <div class="rds-home-hdr">
      <div class="rds-home-title">RDS-100</div>
      <div class="rds-home-sub">Attempt one rack at each of 16 levels in sequence. Start with 100 points. Deduct the number of balls remaining on the table after a miss or foul. Your final score estimates your Fargo rating.</div>
    </div>
    <div class="rds-card rds-card-sm" style="margin-bottom:14px">
      <div class="rds-sect-lbl">SCORING</div>
      <ul class="rds-rules-ul">
        <li>Start with 100 points</li>
        <li>Run the rack clean → no deduction</li>
        <li>Miss or foul → deduct balls still on table</li>
        <li>Proceed through all 16 levels regardless of result</li>
        <li>Score can go below zero</li>
      </ul>
    </div>
    <button class="rds-btn-primary" data-action="rdsStartRds100">▶ START RDS-100</button>`;
}

function rdsBuildRds100Active() {
  const r   = RDS_S.rds100;
  const lvIdx = r.currentLevelIdx;
  const lv  = LEVELS[lvIdx];
  const fargo = rdsRds100FargoEst(r.score);
  const sel = RDS_S.rds100BallsSel;

  const ballBtns = Array.from({length: lv.balls + 1}, (_, i) => `
    <button class="rds-balls-btn${sel===i&&i===0?' sel-run':sel===i?' sel':''}" data-action="rdsRds100BallsSel" data-val="${i}">
      ${i === 0 ? 'RUN' : i}
    </button>`).join('');

  const resultRows = r.results.map((res, i) => {
    const rlv = LEVELS[i];
    return `<div class="rds100-row">
      <span class="rds100-lv" style="color:${rlv.color}">${rlv.num}</span>
      <span class="rds100-desc">${rlv.gradeCode} · ${rlv.balls}b</span>
      <span class="rds100-pts ${res.ballsLeft===0?'run':'deduct'}">
        ${res.ballsLeft===0 ? '✓ RUN' : `−${res.ballsLeft}`}
      </span>
    </div>`;
  }).join('');

  return `
    <div class="rds100-layout">
      <div class="rds100-left">
        <div class="rds100-score-card">
          <div class="rds100-label">SCORE</div>
          <div class="rds100-score" style="color:#5dc85d">${r.score}</div>
          <div class="rds100-prog">Level ${lvIdx+1} of 16</div>
          <div class="rds100-fargo-est">≈ ${fargo} Fargo</div>
        </div>
        ${r.results.length ? `
          <div class="rds-sect-lbl" style="margin-top:12px">COMPLETED LEVELS</div>
          <div class="rds100-result-list">${resultRows}</div>` : ''}
      </div>
      <div class="rds100-right">
        <div class="rds-card">
          <div class="rds-level-row">
            <div class="rds-lv-badge" style="color:${lv.color}">
              <div class="rds-lv-num">${lv.num}</div>
            </div>
            <div class="rds-lv-info">
              <div class="rds-lv-grade" style="color:${lv.color}">${lv.grade}</div>
              <div class="rds-lv-code">${lv.balls} balls · ${rdsBihLabel(lv)}</div>
            </div>
          </div>
          <ul class="rds-rules-ul">${lv.rules.map(r => `<li>${r}</li>`).join('')}</ul>
        </div>
        <div class="rds-card">
          <div class="rds-sect-lbl">BALLS REMAINING AFTER MISS (0 = ran clean)</div>
          <div class="balls-grid">${ballBtns}</div>
          <button class="rds-btn-primary" data-action="rdsRds100Submit" ${sel===null?'disabled style="opacity:.4"':''}>
            ${sel===0 ? 'RUN — No Deduction ✓' : sel!==null ? `MISS — Deduct ${sel} pts` : 'Select result above'}
          </button>
        </div>
        <div class="spacer8"></div>
        <button class="rds-btn-secondary" data-action="rdsCancelRds100">Cancel RDS-100</button>
      </div>
    </div>`;
}

function rdsBuildRds100Complete() {
  const r = RDS_S.rds100;
  const fargo   = rdsRds100FargoEst(r.score);
  const lvMatch = rdsRds100LevelEst(r.score);
  const lv = LEVELS[lvMatch - 1];

  const rows = r.results.map((res, i) => {
    const rlv = LEVELS[i];
    return `<div class="rds100-row">
      <span class="rds100-lv" style="color:${rlv.color}">${rlv.num}</span>
      <span class="rds100-desc">${rlv.gradeCode} · ${rlv.balls}b</span>
      <span class="rds100-pts ${res.ballsLeft===0?'run':'deduct'}">
        ${res.ballsLeft===0 ? '✓' : `−${res.ballsLeft}`}
      </span>
    </div>`;
  }).join('');

  return `
    <div class="rds100-score-card">
      <div class="rds100-label">FINAL SCORE</div>
      <div class="rds100-score" style="color:${lv.color}">${r.score}</div>
      <div class="rds100-fargo-est">≈ ${fargo} Fargo · ${lv.grade} · ${lv.abcd}</div>
    </div>
    <div class="rds-card rds-card-sm" style="margin-bottom:12px">
      <div class="rds-gauge-wrap" style="margin-bottom:0">
        <div class="rds-gauge-track">
          <div style="background:${lv.color};width:${rdsFargoToGauge(lv.fargo[1])}%;opacity:.2;position:absolute;left:0;top:0;height:100%;border-radius:4px"></div>
          <div class="rds-gauge-fill" style="background:${lv.color};width:${rdsFargoToGauge(lv.fargo[1])-rdsFargoToGauge(lv.fargo[0])}%;margin-left:${rdsFargoToGauge(lv.fargo[0])}%;position:relative"></div>
          <div class="rds-gauge-thumb" style="left:${rdsFargoToGauge(fargo)}%;background:${lv.color}"></div>
        </div>
        <div class="rds-gauge-labels"><span>200</span><span>400</span><span>500</span><span>600</span><span>800</span></div>
      </div>
    </div>
    <div class="rds-sect-lbl">BREAKDOWN</div>
    <div class="rds100-result-list">${rows}</div>
    <div class="spacer16"></div>
    <button class="rds-btn-primary" data-action="rdsSaveRds100" style="margin-bottom:10px">Save to History</button>
    <button class="rds-btn-secondary" data-action="rdsCancelRds100">Done</button>`;
}

function rdsRds100FargoEst(score) {
  if (score >= 90) return 770;
  if (score >= 80) return 730;
  if (score >= 70) return 690;
  if (score >= 60) return 650;
  if (score >= 50) return 600;
  if (score >= 40) return 550;
  if (score >= 30) return 500;
  if (score >= 20) return 450;
  if (score >= 10) return 400;
  if (score >=  0) return 350;
  if (score >= -10) return 300;
  if (score >= -20) return 250;
  return 200;
}

function rdsRds100LevelEst(score) {
  if (score >= 90) return 16;
  if (score >= 80) return 15;
  if (score >= 70) return 14;
  if (score >= 60) return 13;
  if (score >= 50) return 12;
  if (score >= 40) return 11;
  if (score >= 30) return 10;
  if (score >= 20) return 9;
  if (score >= 10) return 8;
  if (score >=  0) return 7;
  if (score >= -10) return 6;
  if (score >= -20) return 5;
  return 4;
}

/* ── HISTORY TAB ──────────────────────────────────────── */
function rdsBuildHistoryTab() {
  if (!RDS_S.history.length) {
    return `<div class="rds-empty">No sessions saved yet.<br>Complete a session to see your history.</div>`;
  }
  const cards = RDS_S.history.map(h => {
    const lv = LEVELS[h.endLevel - 1];
    const dateStr = new Date(h.ts).toLocaleDateString('en-US', {month:'short',day:'numeric',year:'numeric'});
    const chips = (h.log||[]).map(e => {
      const cls = e.verdict === 'advance' ? 'advance' : e.verdict === 'drop' ? 'drop' : 'stay';
      const sym = e.verdict === 'advance' ? '▲' : e.verdict === 'drop' ? '▼' : '→';
      return `<span class="rds-hlc ${cls}">${sym}${e.level}</span>`;
    }).join('');
    return `
      <div class="rds-hist-item">
        <div class="rds-hist-top">
          <span class="rds-hist-date">${dateStr}${h.mode==='rds100'?' · RDS-100':''}</span>
          <span class="rds-hist-fargo">~${lv.fargoMid}</span>
        </div>
        <div class="rds-hist-lvl">Level ${h.endLevel} · ${lv.grade} · ${lv.abcd}</div>
        ${chips ? `<div class="rds-hist-log-row">${chips}</div>` : ''}
      </div>`;
  }).join('');
  return `
    <div class="rds-sect-lbl">SESSION HISTORY</div>
    <div class="rds-hist-grid">${cards}</div>
    <div class="spacer16"></div>
    <button class="rds-btn-secondary" data-action="rdsClearHistory">Clear History</button>`;
}

/* ── GUIDE TAB ────────────────────────────────────────── */
function rdsBuildGuideTab() {
  const items = LEVELS.map(lv => {
    const open = RDS_S.guideOpen[lv.num];
    return `
      <div class="rds-guide-item">
        <div class="rds-guide-hdr" data-action="rdsToggleGuide" data-val="${lv.num}">
          <div class="rds-g-badge" style="color:${lv.color}">${lv.num}</div>
          <div class="rds-g-info">
            <div class="rds-g-title">${lv.title}</div>
            <div class="rds-g-meta">${lv.grade} · ${lv.abcd} · Fargo ~${lv.fargo[0]}–${lv.fargo[1]}</div>
          </div>
          <span class="rds-g-chevron${open?' open':''}">▶</span>
        </div>
        <div class="rds-guide-body${open?' open':''}">
          <ul>${lv.rules.map(r => `<li>${r}</li>`).join('')}</ul>
          <button class="rds-guide-start-btn" data-action="rdsStartSession" data-val="${lv.num}">▶ Start Session at Level ${lv.num}</button>
        </div>
      </div>`;
  }).join('');
  return `
    <div class="rds-sect-lbl">ALL 16 LEVELS — QUICK REFERENCE</div>
    <div style="font-size:.72rem;color:#4a6080;margin-bottom:14px;line-height:1.5">Tap any level to expand. Use "Start Session" to jump directly to that level.</div>
    <div class="rds-guide-grid">${items}</div>
    <div class="spacer16"></div>
    <div class="rds-sect-lbl">HOW THE SYSTEM WORKS</div>
    <div class="rds-info-box">
      <strong>Standard RDS:</strong> Play 3 racks at your current level. Run 2 of 3 → advance. Run 1 of 3 → stay. Run 0 of 3 → drop. Your stable ending level estimates your Fargo rating.<br><br>
      <strong>RDS-100:</strong> Play one rack at each of the 16 levels in sequence. Start with 100 points. After each miss, subtract the number of balls remaining on the table. Your final score maps to a Fargo estimate.<br><br>
      <strong>Fargo ranges</strong> sourced from the official BU Rating Comparison chart (BilliardUniversity.org).
    </div>
    <div class="spacer16"></div>`;
}

/* ── EVENTS ───────────────────────────────────────────── */
function rdsAttachEvents() {
  const root = document.getElementById('rds-app-root');
  if (!root) return;
  root.querySelectorAll('[data-action]').forEach(el => {
    el.addEventListener('click', rdsHandleAction);
  });
}

function rdsHandleAction(e) {
  const el = e.currentTarget;
  const action = el.dataset.action;
  const val    = el.dataset.val;

  switch(action) {
    case 'rdstab':
      RDS_S.tab = val;
      if (val !== 'play') RDS_S.session = null;
      rdsRender(); break;

    case 'rdsStartSession': {
      const lvNum = parseInt(val);
      RDS_S.tab = 'play';
      RDS_S.session = { currentLevel:lvNum, startLevel:lvNum, rackResults:[], log:[], pendingVerdict:null };
      rdsSavePrefs({ lastLevel: lvNum });
      rdsRender(); break;
    }

    case 'rdsShowLevelPicker':
      rdsRender(); break;

    case 'rdsUndoRack':
      RDS_S.session.rackResults.pop();
      rdsRender(); break;

    case 'rdsRecordRack': {
      const ran = val === 'run';
      RDS_S.session.rackResults.push(ran);
      if (RDS_S.session.rackResults.length === 3) rdsEvaluateLevel();
      else rdsRender();
      break;
    }

    case 'rdsContinueAfterVerdict':
      RDS_S.session.pendingVerdict = null;
      RDS_S.session.rackResults = [];
      rdsRender(); break;

    case 'rdsEndSession':
      rdsSaveSessionData();
      RDS_S.session = null;
      RDS_S.tab = 'history';
      rdsRender(); break;

    case 'rdsStartRds100':
      RDS_S.tab = 'rds100';
      RDS_S.rds100 = { currentLevelIdx:0, score:100, results:[], done:false };
      RDS_S.rds100BallsSel = null;
      rdsRender(); break;

    case 'rdsRds100BallsSel':
      RDS_S.rds100BallsSel = parseInt(val);
      rdsRender(); break;

    case 'rdsRds100Submit': {
      const balls = RDS_S.rds100BallsSel;
      if (balls === null) return;
      RDS_S.rds100.score -= balls;
      RDS_S.rds100.results.push({ levelIdx: RDS_S.rds100.currentLevelIdx, ballsLeft: balls });
      RDS_S.rds100.currentLevelIdx++;
      RDS_S.rds100BallsSel = null;
      if (RDS_S.rds100.currentLevelIdx >= 16) RDS_S.rds100.done = true;
      rdsRender(); break;
    }

    case 'rdsSaveRds100': {
      const r = RDS_S.rds100;
      const lvMatch = rdsRds100LevelEst(r.score);
      const lv = LEVELS[lvMatch - 1];
      const fargoEst = rdsRds100FargoEst(r.score);
      RDS_S.history.unshift({ ts:Date.now(), mode:'rds100', endLevel:lvMatch, fargoMid:fargoEst, score:r.score, log:[] });
      rdsSaveHistory();
      // Auto-log Fargo estimate to unified tracker
      if (typeof logFargoEstimate === 'function') {
        logFargoEstimate(fargoEst, 'RDS-100', 'Score ' + r.score + ' · ' + lv.grade);
      }
      RDS_S.rds100 = null;
      RDS_S.tab = 'history';
      rdsRender(); break;
    }

    case 'rdsCancelRds100':
      RDS_S.rds100 = null;
      RDS_S.rds100BallsSel = null;
      rdsRender(); break;

    case 'rdsToggleGuide':
      RDS_S.guideOpen[val] = !RDS_S.guideOpen[val];
      rdsRender(); break;

    case 'rdsClearHistory':
      if (confirm('Clear all RDS session history?')) {
        RDS_S.history = [];
        rdsSaveHistory();
        rdsRender();
      }
      break;
  }
}

/* ── GAME LOGIC ───────────────────────────────────────── */
function rdsEvaluateLevel() {
  const ses = RDS_S.session;
  const results = ses.rackResults.slice();
  const runs = results.filter(Boolean).length;
  let verdict = runs >= 2 ? 'advance' : runs === 0 ? 'drop' : 'stay';
  const fromLevel = ses.currentLevel;
  ses.log.push({ level: fromLevel, results, verdict });
  if (verdict === 'advance' && ses.currentLevel < 16) ses.currentLevel++;
  else if (verdict === 'drop' && ses.currentLevel > 1) ses.currentLevel--;
  ses.pendingVerdict = { verdict, fromLevel, results };
  rdsRender();
}

function rdsSaveSessionData() {
  const ses = RDS_S.session;
  if (!ses || !ses.log.length) return;
  const lv = LEVELS[ses.currentLevel - 1];
  RDS_S.history.unshift({
    ts: Date.now(), mode: 'rds',
    startLevel: ses.startLevel,
    endLevel: ses.currentLevel,
    fargoMid: lv.fargoMid,
    log: ses.log.map(e => ({ level:e.level, verdict:e.verdict, runs:e.results.filter(Boolean).length }))
  });
  rdsSaveHistory();
  rdsSavePrefs({ lastLevel: ses.currentLevel });
  // Auto-log Fargo estimate to unified tracker
  if (typeof logFargoEstimate === 'function') {
    logFargoEstimate(lv.fargoMid, 'RDS', 'Level ' + ses.currentLevel + ' · ' + lv.grade);
  }
}

/* ── INIT ─────────────────────────────────────────────── */
function rdsInit() {
  rdsLoadHistory();
  rdsRender();
}
