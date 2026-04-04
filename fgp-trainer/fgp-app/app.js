/* ═══════════════════════════════════════════════════════
   FGP TRAINING APP — v1.0
   Flash Gordon Pool Training System
   Based on Capelle's Practicing Pool — All 14 Chapters
   "The comeback nobody saw coming"
═══════════════════════════════════════════════════════ */

'use strict';

/* ──────────────────────────────────────────
   SVG TABLE GENERATOR
   All diagrams built from data descriptors
────────────────────────────────────────── */
function makeSVG(cfg) {
  const portrait = cfg.portrait || false;
  // Portrait: tall table (long axis vertical), W≈215 H≈340
  // Landscape: wide table (long axis horizontal), W≈340 H≈215
  const W = cfg.W || (portrait ? 215 : 340);
  const H = cfg.H || (portrait ? 340 : 215);
  const rx = cfg.rx || 20, ry = cfg.ry || 20;
  const rw = cfg.rw || (W - rx*2), rh = cfg.rh || (H - ry*2);
  const cx = rx, cy = ry; // felt origin

  const maxW = portrait ? 340 : 520;
  let s = `<svg viewBox="0 0 ${W} ${H}" width="100%" class="table-svg" style="max-width:${maxW}px" xmlns="http://www.w3.org/2000/svg">`;
  // Rail
  s += `<rect x="4" y="4" width="${W-8}" height="${H-8}" rx="6" fill="#111111" stroke="#1e1e1e" stroke-width="2.5"/>`;
  // Felt
  s += `<rect x="${cx}" y="${cy}" width="${rw}" height="${rh}" rx="2" fill="#1B6CA8" stroke="#144f7a" stroke-width="1"/>`;
  // Grid lines
  if (portrait) {
    // Portrait: vertical center line + horizontal quarters
    const gx = cx + rw*.5;
    const gy1=cy+rh*.25, gy2=cy+rh*.5, gy3=cy+rh*.75;
    s += `<line x1="${gx}"  y1="${cy}" x2="${gx}"  y2="${cy+rh}" stroke="#1a5e93" stroke-width=".5" opacity=".6"/>`;
    s += `<line x1="${cx}"  y1="${gy1}" x2="${cx+rw}" y2="${gy1}" stroke="#1a5e93" stroke-width=".5" opacity=".6"/>`;
    s += `<line x1="${cx}"  y1="${gy2}" x2="${cx+rw}" y2="${gy2}" stroke="#1a5e93" stroke-width=".5" opacity=".6"/>`;
    s += `<line x1="${cx}"  y1="${gy3}" x2="${cx+rw}" y2="${gy3}" stroke="#1a5e93" stroke-width=".5" opacity=".6"/>`;
  } else {
    const gx1=cx+rw*.25, gx2=cx+rw*.5, gx3=cx+rw*.75;
    const gy1=cy+rh*.5;
    s += `<line x1="${gx1}" y1="${cy}" x2="${gx1}" y2="${cy+rh}" stroke="#1a5e93" stroke-width=".5" opacity=".6"/>`;
    s += `<line x1="${gx2}" y1="${cy}" x2="${gx2}" y2="${cy+rh}" stroke="#1a5e93" stroke-width=".5" opacity=".6"/>`;
    s += `<line x1="${gx3}" y1="${cy}" x2="${gx3}" y2="${cy+rh}" stroke="#1a5e93" stroke-width=".5" opacity=".6"/>`;
    s += `<line x1="${cx}"  y1="${gy1}" x2="${cx+rw}" y2="${gy1}" stroke="#1a5e93" stroke-width=".5" opacity=".6"/>`;
  }
  // Pockets
  // Landscape: A=TL, B=TC(side), C=TR, D=BL, E=BC(side), F=BR
  // Portrait:  A=TL, B=ML(side), C=BL, D=TR, E=MR(side), F=BR  (left col top→bot, right col top→bot)
  let px;
  if (portrait) {
    px = {
      A:[cx,      cy],       // TL corner
      B:[cx,      cy+rh*.5], // ML side pocket
      C:[cx,      cy+rh],    // BL corner
      D:[cx+rw,   cy],       // TR corner
      E:[cx+rw,   cy+rh*.5], // MR side pocket
      F:[cx+rw,   cy+rh],    // BR corner
    };
  } else {
    px = { A:[cx,cy], B:[cx+rw*.5,cy], C:[cx+rw,cy], D:[cx,cy+rh], E:[cx+rw*.5,cy+rh], F:[cx+rw,cy+rh] };
  }
  for (const [k,[x,y]] of Object.entries(px)) {
    const isSide = portrait ? ['B','E'].includes(k) : ['B','E'].includes(k);
    if (isSide) {
      s += `<ellipse cx="${x}" cy="${y}" rx="${portrait?5:6}" ry="${portrait?6:5}" fill="#050508" stroke="#1a1a1a" stroke-width="1"/>`;
    } else {
      s += `<circle cx="${x}" cy="${y}" r="7" fill="#050508" stroke="#1a1a1a" stroke-width="1.2"/>`;
    }
    const hl = (cfg.highlightPockets || []).includes(k);
    if (hl) {
      s += `<text x="${x+9}" y="${y+3}" fill="#00BFFF" font-size="8" font-family="Courier New">${k}</text>`;
    }
  }
  // Diamond dots
  let ddots;
  if (portrait) {
    ddots = [
      // top rail
      [cx+rw*.5, cy],
      // bottom rail
      [cx+rw*.5, cy+rh],
      // left rail (4 dots)
      [cx, cy+rh*.25],[cx, cy+rh*.75],
      // right rail (4 dots)
      [cx+rw, cy+rh*.25],[cx+rw, cy+rh*.75],
    ];
  } else {
    ddots = [
      [cx+rw*.25,cy],[cx+rw*.75,cy],[cx+rw*.25,cy+rh],[cx+rw*.75,cy+rh],
      [cx,cy+rh*.33],[cx,cy+rh*.67],[cx+rw,cy+rh*.33],[cx+rw,cy+rh*.67]
    ];
  }
  ddots.forEach(([x,y]) => s += `<circle cx="${x}" cy="${y}" r="1.5" fill="#2a6090"/>`);

  // Pocket labels (if requested)
  if (cfg.pocketLabels) {
    s += `<text x="${cx+2}" y="${cy-5}" fill="#2a6090" font-size="7" font-family="Courier New">A</text>`;
    s += `<text x="${cx+rw*.5-2}" y="${cy-5}" fill="#2a6090" font-size="7" font-family="Courier New">B</text>`;
    s += `<text x="${cx+rw-6}" y="${cy-5}" fill="#2a6090" font-size="7" font-family="Courier New">C</text>`;
    s += `<text x="${cx+2}" y="${cy+rh+10}" fill="#2a6090" font-size="7" font-family="Courier New">D</text>`;
    s += `<text x="${cx+rw*.5-2}" y="${cy+rh+10}" fill="#2a6090" font-size="7" font-family="Courier New">E</text>`;
    s += `<text x="${cx+rw-6}" y="${cy+rh+10}" fill="#2a6090" font-size="7" font-family="Courier New">F</text>`;
  }

  // Balls
  if (cfg.balls) {
    const ballColors = {
      'CB':'#e8e8e8','1':'#f5f5dc','2':'#1144cc','3':'#cc2211','4':'#660099',
      '5':'#ff8800','6':'#116622','7':'#990000','8':'#111111','9':'#f5f5dc',
      '10':'#1144cc','11':'#cc2211','12':'#660099','13':'#ff8800','14':'#116622','15':'#990000',
      'G':'none'
    };
    cfg.balls.forEach(b => {
      const col = ballColors[b.n] || '#888';
      if (b.n === 'G') {
        s += `<circle cx="${b.x}" cy="${b.y}" r="8" fill="none" stroke="#888" stroke-width="1" stroke-dasharray="3,2" opacity=".6"/>`;
      } else {
        s += `<circle cx="${b.x}" cy="${b.y}" r="8" fill="${col}" stroke="${col==='#e8e8e8'?'#aaa':'#333'}" stroke-width="1"/>`;
        const tc = (col==='#e8e8e8'||col==='#f5f5dc') ? '#222' : '#fff';
        const fs = b.n.length > 2 ? 5 : 6;
        const tx = b.x - (b.n.length>1?4:3);
        s += `<text x="${tx}" y="${b.y+2}" fill="${tc}" font-size="${fs}" font-family="Courier New" font-weight="bold">${b.n}</text>`;
      }
    });
  }

  // Lines/arrows
  if (cfg.lines) {
    cfg.lines.forEach(l => {
      const dash = l.dash ? 'stroke-dasharray="4,3"' : '';
      const op = l.op ? `opacity="${l.op}"` : '';
      s += `<line x1="${l.x1}" y1="${l.y1}" x2="${l.x2}" y2="${l.y2}" stroke="${l.col||'#fff'}" stroke-width="${l.w||1}" ${dash} ${op}/>`;
    });
  }

  // Zones (filled areas)
  if (cfg.zones) {
    cfg.zones.forEach(z => {
      s += `<rect x="${z.x}" y="${z.y}" width="${z.w}" height="${z.h}" fill="${z.fill||'#00E67622'}" stroke="${z.stroke||'#00E67666'}" stroke-width="1" rx="2"/>`;
    });
  }

  // Labels
  if (cfg.labels) {
    cfg.labels.forEach(l => {
      if (l.box) {
        s += `<rect x="${l.x-2}" y="${l.y-9}" width="${l.bw||40}" height="13" rx="1" fill="${l.bg||'#08081a'}" stroke="${l.bc||'#333355'}" stroke-width="1"/>`;
      }
      s += `<text x="${l.x}" y="${l.y}" fill="${l.col||'#aaa'}" font-size="${l.fs||7}" font-family="Courier New">${l.t}</text>`;
    });
  }

  // Donuts (ball placement target rings)
  if (cfg.donuts) {
    cfg.donuts.forEach(d => {
      s += `<circle cx="${d.x}" cy="${d.y}" r="${d.r||5}" fill="none" stroke="${d.col||'#F5C400'}" stroke-width="1.2" stroke-dasharray="2,1"/>`;
    });
  }

  // Shot Picture indicators — cue ball contact point diagram
  // Each: { x, y, r=10, dx=0, dy=0, col='#fff', label='' }
  // Outer circle = cue ball face; inner dot at (dx,dy) offset = tip contact point
  // dx/dy range: -1..1 (fraction of r), e.g. dy=-0.6 = top spin, dy=0.6 = draw
  if (cfg.shotPics) {
    cfg.shotPics.forEach(p => {
      const r = p.r || 10, x = p.x, y = p.y;
      const dotX = x + (p.dx||0)*r, dotY = y + (p.dy||0)*r;
      const col = p.col || '#cccccc';
      // Outer circle (cue ball silhouette)
      s += `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${col}" stroke-width="1.2"/>`;
      // Crosshairs
      s += `<line x1="${x-r}" y1="${y}" x2="${x+r}" y2="${y}" stroke="${col}" stroke-width=".4" opacity=".4"/>`;
      s += `<line x1="${x}" y1="${y-r}" x2="${x}" y2="${y+r}" stroke="${col}" stroke-width=".4" opacity=".4"/>`;
      // Contact dot
      s += `<circle cx="${dotX}" cy="${dotY}" r="2" fill="${col}"/>`;
      // Optional label below
      if (p.label) {
        s += `<text x="${x}" y="${y+r+9}" fill="${col}" font-size="6" font-family="Courier New" text-anchor="middle">${p.label}</text>`;
      }
    });
  }

  s += '</svg>';
  return s;
}

// Helper: felt coordinates from table fractions (0-1)
// For landscape: fc(0.5) = horizontal center, fr(0.5) = vertical center
// For portrait:  fc(0.5) = horizontal center, fr(0.5) = vertical center (long axis)
function fc(f, W=340, rx=20) { return rx + f*(W-rx*2); }
function fr(f, H=215, ry=20) { return ry + f*(H-ry*2); }
// Portrait variants (pass cfg.W=215, cfg.H=340)
function fcp(f) { return fc(f, 215, 20); }  // portrait x (width=175)
function frp(f) { return fr(f, 340, 20); }  // portrait y (height=300)

/* ──────────────────────────────────────────
   CHAPTER DATA — ALL 14 CHAPTERS
────────────────────────────────────────── */
const CHAPTERS = [

/* ═══════════════════════════════════════
   CHAPTER 1 — LEARNING TO LEARN
═══════════════════════════════════════ */
{
  id:'ch01', num:1, title:'Learning to Learn',
  subtitle:'The foundation of deliberate improvement',
  color:'cyan', drillCount:6,
  sections:[
    {
      id:'s1-framework', title:'LEARNING FRAMEWORK',
      desc:'How champions approach skill development. The L-P-M model and the pyramid of excellence.',
      drills:[
        {
          id:'d-lpm', name:'THE L-P-M MODEL', accent:'cyan', tags:['FRAMEWORK'],
          cure:'Understanding how skills move from conscious effort to automatic execution.',
          objective:'Learn the three-phase model that guides all practice decisions.',
          steps:[
            'LEARN: Study the basic mechanics of the skill. Work with a coach if possible. Use mirrors, video, and deliberate slow-motion repetition.',
            'PERFECT: Lock in the skill through focused drill repetition until it becomes automatic under normal practice conditions.',
            'MAINTAIN: Once perfected, keep the skill sharp with regular inclusion in your practice sessions. A skill can regress if neglected.'
          ],
          review:'Ask of every skill: Am I in the L, P, or M phase? This determines how much time the skill should get in your sessions.',
          tip:'Phil says: Your game is a unique blend of skills. To maximize your practice time, you need to develop, monitor, and adjust your agenda so you can systematically improve all the components of your game.',
          scoring:{ type:'checklist', id:'d-lpm', items:['I understand the Learn phase','I understand the Perfect phase','I understand the Maintain phase','I can place each of my current skills in L, P, or M'] }
        },
        {
          id:'d-champions', name:"CHAMPION'S CHECKLIST", accent:'gold', tags:['ASSESSMENT'],
          cure:'Identify exactly which areas of your game need the most work.',
          objective:'Conduct a complete, honest assessment of all skill areas.',
          steps:[
            'Rate each fundamental on a 1-3 scale: 1=Needs major work, 2=Needs polishing, 3=In good shape.',
            'Rate your shotmaking accuracy at various distances and angles.',
            'Rate your position play: follow, draw, stun, rail shots.',
            'Rate your safety play, kicking game, and break shot.',
            'Rate your mental game: focus, pressure, routine consistency.',
            'Identify the 3 weakest areas. These become your primary training focus.'
          ],
          review:'Be brutally honest. Most players overestimate certain skills and underestimate others. The assessment is only useful if it is accurate.',
          tip:'Assign a rating to every area at least once per month. Track how your ratings change over time.',
          scoring:{ type:'qual', id:'d-champions', labels:{ 1:'NEEDS MAJOR WORK', 2:'IDENTIFIED GAPS', 3:'COMPLETE & HONEST' } }
        },
        {
          id:'d-pyramid', name:'PYRAMID OF EXCELLENCE', accent:'cyan', tags:['FRAMEWORK'],
          cure:'Understanding the hierarchy of pool skills prevents practicing the wrong things at the wrong time.',
          objective:'Learn how the six levels of the pyramid relate to your current skill level.',
          steps:[
            'LEVEL 1 — FUNDAMENTALS: Stance, stroke, cueing, shot routine. The base of everything.',
            'LEVEL 2 — SHOTMAKING: Pocket accuracy at all distances and angles. Without this, nothing else matters.',
            'LEVEL 3 — POSITION PLAY: Controlling the cue ball after contact. Follow, draw, stun, stop shots.',
            'LEVEL 4 — PATTERN PLAY: Reading and running sequences of balls. Planning and execution.',
            'LEVEL 5 — DEFENSE: Safety play, kicking, and strategic decision-making.',
            'LEVEL 6 — MENTAL GAME: Pressure, focus, pre-shot routine, competition preparation.'
          ],
          review:'Which level is your current ceiling? Focus primarily on building that level before moving to higher levels.',
          tip:'For Fargo 640→750: Your primary ceiling is likely at Level 4 (Pattern Play) and Level 5 (Defense). Fundamentals and shotmaking should be in Maintain mode.',
          scoring:{ type:'checklist', id:'d-pyramid', items:['Level 1 Fundamentals — rated','Level 2 Shotmaking — rated','Level 3 Position Play — rated','Level 4 Pattern Play — rated','Level 5 Defense — rated','Level 6 Mental Game — rated'] }
        },
        {
          id:'d-planning', name:'PLANNING YOUR SESSIONS', accent:'gold', tags:['PLANNING'],
          cure:'Unstructured practice produces uneven, slow improvement.',
          objective:'Build a structured practice agenda that addresses your current needs.',
          steps:[
            'Set aside specific time blocks: Warm-up (10-15 min), Heart of Session (30-45 min), Cool-down (5-10 min).',
            'Warm-up: Loosen up with stop shots and easy straight shots. Build confidence and get into the groove.',
            'Heart of Session: Work on L and P phase skills — the hard drills that produce real improvement.',
            'Cool-down: End with something fun or a game you enjoy. Finish feeling confident.',
            'Assign time to each skill according to L/P/M phase. L and P skills get the most time.',
            'Write your session agenda before you start. Stick to it.'
          ],
          review:'After the session, note which drills felt productive and which did not. Adjust the next session accordingly.',
          scoring:{ type:'qual', id:'d-planning', labels:{ 1:'NO PLAN TODAY', 2:'PARTIAL PLAN', 3:'FULL AGENDA FOLLOWED' } }
        }
      ]
    },
    {
      id:'s1-mental', title:'MENTAL APPROACH',
      desc:'Learning how to learn. Practice environment, focused repetition, and managing your progress.',
      drills:[
        {
          id:'d-focused', name:'FOCUSED REPETITION', accent:'green', tags:['MENTAL','PRACTICE'],
          cure:'Mindless repetition builds bad habits as easily as good ones.',
          objective:'Learn to practice with full attention on every single shot.',
          steps:[
            'Before each shot: state your exact intention (pocket, speed, cue ball target zone).',
            'Execute your full pre-shot routine on every practice shot — no shortcuts.',
            'After each shot: evaluate. Did the result match your intention? Why or why not?',
            'If distracted mid-shot, step away and restart your routine.',
            'Practice maximum 60-90 minutes with full focus before taking a break.'
          ],
          review:'Quality reps beat quantity every time. Twenty shots with complete focus beat 200 mechanical repetitions.',
          tip:'The champion practices as if every shot counts. The average player practices to pass time.',
          scoring:{ type:'qual', id:'d-focused', labels:{ 1:'MOSTLY MINDLESS', 2:'SOMETIMES FOCUSED', 3:'FULLY INTENTIONAL' } }
        },
        {
          id:'d-video', name:'VIDEO SELF-ANALYSIS', accent:'red', tags:['ANALYSIS'],
          cure:'Without objective feedback, players often practice flaws rather than fix them.',
          objective:'Use video to identify stroke and setup errors invisible from your playing position.',
          steps:[
            'Set your phone to record from the side — camera at table height, perpendicular to your cue.',
            'Record 10 shots on a simple straight-in shot.',
            'Review: Is your elbow dropping? Is your head moving? Is your cue moving laterally?',
            'Set camera from the end rail looking down your line of aim.',
            'Review: Is your cue tracking straight? Does your elbow swing out?',
            'Identify the most glaring error. Drill specifically on correcting it.'
          ],
          review:'Most stroke flaws are invisible from the playing position but obvious on video. This is the cheapest coaching tool available.',
          scoring:{ type:'checklist', id:'d-video', items:['Recorded side view — reviewed','Recorded end rail view — reviewed','Identified primary error to correct','Noted in training log'] }
        }
      ]
    }
  ]
},

/* ═══════════════════════════════════════
   CHAPTER 2 — FAST START
═══════════════════════════════════════ */
{
  id:'ch02', num:2, title:'Fast Start',
  subtitle:'Rapid assessment and quick improvement strategies',
  color:'gold', drillCount:8,
  sections:[
    {
      id:'s2-assess', title:'RAPID ASSESSMENT',
      desc:'Quickly identify your biggest opportunities for improvement.',
      drills:[
        {
          id:'d-fast-shotmaking', name:'SHOTMAKING QUICK TEST', accent:'cyan', tags:['ASSESSMENT'],
          cure:'Quickly identifying your shotmaking accuracy baseline.',
          objective:'Get an accurate snapshot of your current pocketing ability across all shot types.',
          setup:'Set up 10 balls around the table: 2 short straight shots, 2 medium cuts, 2 long cuts, 2 rail shots, 2 side pocket shots.',
          steps:[
            'Shoot each of the 10 balls in sequence, using your normal playing routine.',
            'Record makes and misses on the scorecard.',
            'Repeat for 3 rounds.',
            'Calculate your percentage for each shot type.',
            'Identify the shot types where your percentage falls below 60%.'
          ],
          review:'Shots below 60% are costing you games. These become immediate priorities. Shots above 80% are in Maintain mode.',
          diagram: makeSVG({ W:340, H:215, pocketLabels:true,
            balls:[
              {n:'CB',x:fc(.5),y:fr(.6)},{n:'1',x:fc(.5),y:fr(.1)},
              {n:'2',x:fc(.15),y:fr(.3)},{n:'3',x:fc(.85),y:fr(.3)},
              {n:'4',x:fc(.25),y:fr(.7)},{n:'5',x:fc(.75),y:fr(.7)},
              {n:'6',x:fc(.1),y:fr(.5)},{n:'7',x:fc(.9),y:fr(.5)},
              {n:'8',x:fc(.4),y:fr(.15)},{n:'9',x:fc(.6),y:fr(.15)}
            ]
          }),
          scoring:{ type:'hitMiss', id:'d-fast-shotmaking', label:'FAST TEST SHOTS', showPct:true }
        },
        {
          id:'d-fast-position', name:'POSITION PLAY QUICK TEST', accent:'gold', tags:['ASSESSMENT'],
          cure:'Determining how reliably you can control the cue ball.',
          objective:'Assess your position play ability on the five basic shot types.',
          setup:'Set up 5 shots using the diagrams from Chapter 5: follow shot, stop shot, draw shot, stun shot, and a two-rail route.',
          steps:[
            'Shoot each position play shot 3 times.',
            'Rate how often the cue ball lands in the target zone: 1=Rarely, 2=Sometimes, 3=Reliably.',
            'For follow: aim to land within 1 diamond of target position.',
            'For draw: aim to pull back at least half a table length from close range.',
            'For stun: aim to stop within 6 inches of contact point.',
            'For two-rail: aim to land within one diamond of target zone.'
          ],
          review:'Any position route rated 1 is an immediate priority. These missed positions are the primary reason runouts break down.',
          scoring:{ type:'qual', id:'d-fast-position', labels:{ 1:'MAJOR GAPS', 2:'INCONSISTENT', 3:'RELIABLE' } }
        },
        {
          id:'d-fast-safety', name:'SAFETY PLAY QUICK TEST', accent:'green', tags:['ASSESSMENT'],
          cure:'Most C-level players ignore safeties. That ends here.',
          objective:'Assess your current defensive capability across basic safety types.',
          steps:[
            'Full-table safety: Send the OB to end rail and hide CB behind another ball. Rate success rate.',
            'Short safety: Send OB to rail near pocket but leave CB in traffic. Rate success rate.',
            'Tuck safety: Send OB close behind obstacle ball. Rate success rate.',
            'Run 5 attempts of each type. Record how many meet the safety objective.'
          ],
          review:'Every safety success is a potential win. Opponents who give up easy shots are opponents you can beat.',
          scoring:{ type:'hitMiss', id:'d-fast-safety', label:'SAFETY SUCCESSES', showPct:true }
        },
        {
          id:'d-fast-mental', name:'PRE-SHOT ROUTINE ASSESSMENT', accent:'red', tags:['ASSESSMENT','MENTAL'],
          cure:'An inconsistent pre-shot routine is the #1 cause of unforced errors under pressure.',
          objective:'Honestly rate the consistency of your pre-shot routine.',
          steps:[
            'Play a rack of nine balls with a partner observing.',
            'After each shot, partner notes: Did you follow a consistent routine?',
            'Routine should include: approach, bridge setup, warm-up strokes, aiming lock, trigger.',
            'Count how many of the 9 shots used a consistent, complete routine.',
            'Rate your routine consistency based on the count.'
          ],
          review:'Target: 8 or 9 out of 9 shots using full routine. In competition this number will drop — practice at 9/9 so you compete at 7/9.',
          scoring:{ type:'qual', id:'d-fast-mental', labels:{ 1:'ROUTINE? WHAT ROUTINE', 2:'PARTIAL ROUTINE', 3:'CONSISTENT ROUTINE' } }
        }
      ]
    },
    {
      id:'s2-quick-wins', title:'QUICK WINS',
      desc:"Improvements that pay off immediately in your next game.",
      drills:[
        {
          id:'d-stop-shot', name:'THE STOP SHOT MASTER', accent:'cyan', tags:['POSITION','FUNDAMENTAL'],
          cure:'The stop shot is the most versatile position play available. Master it and countless position problems disappear.',
          objective:'Reliably execute the stop shot from multiple distances.',
          setup:'Place CB and OB in a straight-in configuration at various distances.',
          steps:[
            'SHORT (1 ball apart): Hit the OB dead center with a firm stroke. CB should stop dead.',
            'MEDIUM (3 balls apart): Use a crisp center ball hit. CB stops at contact point.',
            'LONG (5+ balls): Use a slightly firmer stroke, still dead center. Slight stun effect is acceptable.',
            'Run 5 shots at each distance. Record how many CB stops dead vs. rolls forward.'
          ],
          review:'A CB that rolls forward means you hit too high. A CB that draws back means you hit below center. Dead center gives a dead stop.',
          diagram: makeSVG({ W:340, H:215,
            balls:[
              {n:'CB',x:fc(.5),y:fr(.75)},{n:'1',x:fc(.5),y:fr(.55)},
              {n:'CB',x:fc(.5),y:fr(.55)},{n:'2',x:fc(.5),y:fr(.3)},
            ],
            labels:[{t:'Short',x:fc(.55),y:fr(.67),col:'#aaa'},{t:'Medium',x:fc(.55),y:fr(.43),col:'#aaa'}]
          }),
          scoring:{ type:'hitMiss', id:'d-stop-shot', label:'DEAD STOPS', showPct:true }
        },
        {
          id:'d-cut-15', name:'15-DEGREE CUT MASTERY', accent:'gold', tags:['SHOTMAKING'],
          cure:'The 15-degree cut is the most common offensive shot in pool. Master it and your pocketing percentage skyrockets.',
          objective:'Achieve 80%+ on 15-degree cuts from all areas of the table.',
          steps:[
            'Set up a 15-degree cut (1 ball width offset) from 2 feet, then 4 feet, then 6 feet.',
            'Shoot 10 balls at each distance.',
            'Focus on a consistent, repeatable stroke — same warm-ups, same aim reference.',
            'Track makes per distance level.'
          ],
          review:'If you make 8/10 at 2 feet but only 5/10 at 6 feet, your problem is stroke mechanics at distance, not aim.',
          scoring:{ type:'hitMiss', id:'d-cut-15', label:'15° CUT MAKES', showPct:true }
        },
        {
          id:'d-rail-bridge', name:'RAIL BRIDGE BASICS', accent:'green', tags:['FUNDAMENTALS'],
          cure:'Fear of the rail bridge causes players to avoid it and miss easy shots as a result.',
          objective:'Build comfort and confidence with the mechanical rail bridge.',
          steps:[
            'Place CB frozen to the long rail. Set up a shot to the corner pocket.',
            'Use the mechanical bridge (also called the "rake"). Grips the table rail for stability.',
            'Take 5 slow, deliberate warm-up strokes. Keep cue level, parallel to rail.',
            'Shoot 10 balls from rail-frozen position.',
            'Progress to CB 1 inch off rail, then 3 inches — where the bridge is most awkward.',
          ],
          review:'The rail bridge feels awkward until you practice it. Once grooved, it becomes reliable under pressure.',
          scoring:{ type:'hitMiss', id:'d-rail-bridge', label:'RAIL BRIDGE MAKES', showPct:true }
        }
      ]
    }
  ]
},

/* ═══════════════════════════════════════
   CHAPTER 3 — FUNDAMENTALS FIRST
   (Full implementation — matches approved prototype)
═══════════════════════════════════════ */
{
  id:'ch03', num:3, title:'Fundamentals First',
  subtitle:'Your entire game rests on your fundamentals',
  color:'cyan', drillCount:22,
  sections:[
    {
      id:'s3-overview', title:'OVERVIEW',
      desc:'Rate your fundamentals across all 12 areas using Capelle\'s 1-2-3 system.',
      drills:[] // Overview section — rendered specially
    },
    {
      id:'s3-setup', title:'SET UP',
      desc:'A consistent approach reduces time and effort making adjustments once down over the shot.',
      drills:[
        {
          id:'d-stance', name:'CONSISTENT STANCE', accent:'cyan', tags:['SETUP'],
          cure:'Inconsistency and poor balance.',
          objective:'Reduce in-stance adjustments by landing in the same position every time.',
          steps:[
            'Take your best stance and set yourself into what feels like the perfect position.',
            'Have a partner mark the position of your feet with Post-it notes or tape.',
            'Assume your stance 5–10 times. This will show how consistently you position yourself over a shot.'
          ],
          review:'Notice how comfortable you feel with your best stance, and what it feels like when your feet are out of position. Strive to emulate the perfect stance over and over.',
          scoring:{ type:'qual', id:'d-stance', labels:{ 1:'1 — NEEDS WORK', 2:'2 — POLISHING', 3:'3 — SOLID' } }
        },
        {
          id:'d-landline', name:'LAND IN LINE', accent:'gold', tags:['ALIGNMENT'],
          cure:'Identifies if you are consistently aiming left or right, and whether errors are big or small.',
          objective:'Reduce in-stance adjustments by landing as close to perfectly aligned as possible.',
          setup:'Part A: CB and 1-ball near the head string, 1-ball near rail. Part B: CB and OB near the side pocket.',
          steps:[
            'PART A — AIM ASSESSMENT: Take your stance. Aim for a full ball hit. Take a couple of warm-up strokes and shoot. Do not make any adjustments to your aim. Note which direction the cue ball goes after contact.',
            'PART B — LAND AND SHOOT: Take your stance. Use your best final stroke and shoot. No warm-up strokes or in-stance adjustments allowed. This tests how precisely you land on the line.'
          ],
          review:'Record your misses (left or right of the pocket) and your makes. Close misses would be pocketed with fine-tuned aim. Missing wide means your line-up while landing needs work.',
          diagram: makeSVG({ portrait:true, balls:[{n:'CB',x:fcp(0.22),y:frp(0.12)},{n:'1',x:fcp(0.73),y:frp(0.27)},{n:'G',x:fcp(0.43),y:frp(0.63)},{n:'G',x:fcp(0.55),y:frp(0.63)}], shotPics:[{x:fcp(0.25),y:frp(0.87),r:13,dx:0.2,dy:0},{x:fcp(0.63),y:frp(0.87),r:13,dx:0.2,dy:0}], lines:[{x1:fcp(0.22),y1:frp(0.12),x2:fcp(1.0),y2:frp(0.0),col:'#fff8',w:1},{x1:fcp(0.43),y1:frp(0.02),x2:fcp(0.43),y2:frp(0.63),col:'#fff5',w:1,dash:true},{x1:fcp(0.55),y1:frp(0.02),x2:fcp(0.55),y2:frp(0.63),col:'#fff5',w:1,dash:true}]}),
          scoring:{ type:'landLine', id:'d-landline' }
        },
        {
          id:'d-refpoints', name:'REFERENCE POINTS EXERCISE', accent:'green', tags:['ALIGNMENT'],
          cure:'Consistently assume a correct stance and establish the correct position in the next exercise.',
          steps:[
            'Place the 1-ball as shown. Face it as if going to shoot it into the right corner pocket.',
            'When you land, your tip should be lined up with the 1-ball. Your cue should be parallel to the rail.',
            'Extend your cue down the line of aim. Your body will follow it to near-perfect position.',
            'Expect to make minor adjustments once you take your stance to feel completely comfortable.'
          ],
          review:'Record your misses (left or right of pocket) and your makes. It is okay to miss, as long as you are missing very close. Close misses would be pocketed with fine-tuned aim.',
          tip:'A partner is recommended. Have them record misses and makes and note the direction.',
          diagram: makeSVG({ balls:[{n:'CB',x:fc(0.07),y:fr(0.72)}], lines:[{x1:fc(0.07),y1:fr(0.72),x2:fc(0.52),y2:fr(0.08),col:'#fff6',w:1},{x1:fc(0.07),y1:fr(0.85),x2:fc(0.07),y2:fr(0.20),col:'#fff8',w:2}]}),
          scoring:{ type:'hitMiss', id:'d-refpoints', showPct:true }
        }
      ]
    },
    {
      id:'s3-shotcycle', title:'SHOT CYCLE',
      desc:'Plan → Execute → Evaluate. Once in execution mode, follow your routine to completion.',
      drills:[
        {
          id:'d-execmode', name:'MASTERING THE EXECUTION MODE', accent:'cyan', tags:['SHOT CYCLE'],
          cure:'Eliminate the tendency to plan while in execution mode.',
          objective:'Ingrain 100% separation between planning and execution phases.',
          setup:'Break open a rack of 15 balls or spread them across the table at random. Play 4–5 racks.',
          steps:[
            'PLANNING: Plan each position route carefully. Become completely absorbed in the detail for a perfect shot: target zone, route to get there, cueing, speed.',
            'Make your preparations and commit 100% to the shot, then switch totally into execution mode.',
            'No looking around the table and changing plans. Just smoothly follow your routine and shoot.',
            'Time in preparation = only as long as it takes to: 1) get settled in, 2) feel speed and groove stroke, 3) lock in aim.'
          ],
          scoring:{ type:'rackTracker', id:'d-execmode', racks:5 }
        },
        {
          id:'d-mission', name:'MISSION ABORTED', accent:'gold', tags:['DISCIPLINE'],
          cure:'Eliminate the tendency to shoot when you are not completely prepared to pull the trigger.',
          objective:'Build the habit of getting up when something feels wrong.',
          setup:'Set up the 8-ball and 9-ball. Play from Cue Ball A to pocket the 8, then from Cue Ball B to pocket the 9.',
          steps:[
            'If you don\'t feel ready after setting up for the shot — get up and start your routine all over.',
            'Practice making this your habit until getting up feels completely natural.',
            'Key rule: Get up when you know you are set up way off line, when you are not sure of the shot, or when near-table-height view changes your mind.'
          ],
          review:'The goal is to never shoot when not ready. In competition, this habit will save you many frames.',
          scoring:{ type:'qual', id:'d-mission', labels:{ 1:'SHOT ANYWAY', 2:'SOMETIMES', 3:'GOT UP PROPERLY' } }
        }
      ]
    },
    {
      id:'s3-stroke', title:'STROKE',
      desc:'Each part of the stroke is best learned separately. Forged into habit, execute with little conscious thought.',
      drills:[
        {
          id:'d-superslow', name:'THE SUPER SLOW STROKE', accent:'cyan', tags:['PACE'],
          cure:'Discover and eliminate any uneven spots in your stroke. The "glitch" is the fatal moment when a smooth stroke develops a power grab.',
          objective:'Better understand exactly what you are trying to accomplish with your stroke.',
          steps:[
            'Execute practice strokes that take at least 20 seconds to complete from the beginning of the backstroke to the end of the follow through.',
            'Your goal is to maintain a smooth and even pace with just a slight acceleration.',
            'Do NOT make an actual shot — this is warm-up stroke practice only.'
          ],
          review:'How smooth was your action? Was there a "hurry up" moment in the forward stroke? Or were you able to maintain a smooth and even pace with just a slight acceleration?',
          scoring:{ type:'qual', id:'d-superslow', labels:{ 1:'1 — GLITCHY', 2:'2 — MOSTLY SMOOTH', 3:'3 — BUTTER' } }
        },
        {
          id:'d-slowdown', name:'SLOOOW WAY DOWN', accent:'gold', tags:['PACE'],
          cure:'Discover and eliminate any uneven spots in your stroke by playing actual shots in super slow motion.',
          objective:'Play actual shots at Speed 2-3, maintaining smoothness all the way through.',
          steps:[
            'Speed: Very Soft (2) to Soft (3). Go through your usual routine.',
            'Take several warm-up strokes, but make them slower and more deliberate than usual.',
            'The final stroke should be very long, very soft, as slow and smooth as possible.',
            'Use just enough force to roll the object ball into the front of the pocket. Your accuracy may suffer a little due to the very soft stroke.'
          ],
          review:'Were you able to keep it slow and smooth all the way to the completion of your follow through? Did you have a hurry-up moment in the forward stroke?',
          diagram: makeSVG({ portrait:true, balls:[{n:'CB',x:fcp(0.62),y:frp(0.37)},{n:'1',x:fcp(0.55),y:frp(0.77)}], shotPics:[{x:fcp(0.27),y:frp(0.47),r:13,dx:0,dy:-0.4}], lines:[{x1:fcp(0.62),y1:frp(0.37),x2:fcp(0.55),y2:frp(0.77),col:'#fff8',w:1},{x1:fcp(0.55),y1:frp(0.77),x2:fcp(1.0),y2:frp(1.0),col:'#fff8',w:1},{x1:fcp(0.62),y1:frp(0.37),x2:fcp(1.0),y2:frp(0.0),col:'#fff5',w:1,dash:true}]}),
          scoring:{ type:'qual', id:'d-slowdown', labels:{ 1:'1 — RUSHED', 2:'2 — ALMOST', 3:'3 — SMOOTH' } }
        },
        {
          id:'d-onehanded', name:'THE ONE HANDED STROKE', accent:'green', tags:['STROKE'],
          cure:'Expose any tendencies to poke at the shot. Shooting without a bridge forces you to slow down or lose control of your cue.',
          objective:'Build awareness of lateral stroke movement by removing the bridge.',
          setup:'Set up the shot with ball on top of donuts. Hold your cue and place Post-it notes against the bottom of the shaft where your bridge hand rests, about ¼" apart.\n\nPart A: Notes parallel. Part B: Notes angled so only part of cue touches them.',
          steps:[
            'Your stroke must be smooth and straight throughout or you will lose control of the cue.',
            'Take 3-4 warm-up strokes. They must be slow and smooth.',
            'Shoot with a deliberate, controlled final stroke.',
            'If you lose control of the cue — that\'s the flaw. Slow down more.'
          ],
          diagram: makeSVG({ balls:[{n:'1',x:fc(0.27),y:fr(0.27)},{n:'2',x:fc(0.62),y:fr(0.27)},{n:'G',x:fc(0.27),y:fr(0.82)},{n:'G',x:fc(0.62),y:fr(0.82)}], lines:[{x1:fc(0.27),y1:fr(0.82),x2:fc(0.05),y2:fr(0.82),col:'#fff6',w:1},{x1:fc(0.62),y1:fr(0.82),x2:fc(0.88),y2:fr(0.82),col:'#fff6',w:1},{x1:fc(0.49),y1:fr(0.05),x2:fc(0.49),y2:fr(0.95),col:'#fff4',w:1,dash:true}]}),
          scoring:{ type:'dotsAB', id:'d-onehanded', dotsA:10, dotsB:10 }
        },
        {
          id:'d-cuecheck', name:'CHECKING FOR CUEING ERRORS', accent:'red', tags:['CUEING'],
          cure:'Discover and eliminate any cueing errors during the set up procedure.',
          objective:'Verify you are hitting dead center when you think you are hitting dead center.',
          steps:[
            'TEST 1 — VERTICAL AXIS CHECK: Set up the 1-ball with the "1" facing straight at you. Assume your stance with the top of your tip about halfway down the 1. The top of your tip should be right on the 1. If not, you are setting up with unintended english.',
            'TEST 2 — CHALK MARK TEST: Place the 1-ball as the cue ball. Apply a nice layer of chalk to your tip. Set up to hit the 1 in the middle. Play a stop shot. Examine the cue ball to see if the chalk mark covers the middle of the 1, or is off to either side.'
          ],
          diagram: makeSVG({ balls:[{n:'CB',x:fc(0.49),y:fr(0.22)},{n:'1',x:fc(0.49),y:fr(0.52)}], shotPics:[{x:fc(0.14),y:fr(0.25),r:13,dx:0,dy:0},{x:fc(0.14),y:fr(0.60),r:13,dx:0.55,dy:0},{x:fc(0.72),y:fr(0.42),r:18,dx:0,dy:0}], lines:[{x1:fc(0.49),y1:fr(0.22),x2:fc(0.49),y2:fr(0.52),col:'#fff8',w:1}]}),
          scoring:{ type:'qualChecklist', id:'d-cuecheck',
            items:['Test 1: Tip lands on the "1" — vertical axis confirmed','Test 2: Chalk mark is centered on the 1-ball face','No unintended english detected on either test'],
            qual:{ id:'d-cuecheck-q', labels:{ 1:'1 — ERRORS FOUND', 2:'2 — MINOR ERRORS', 3:'3 — DEAD CENTER' } }
          }
        }
      ]
    },
    {
      id:'s3-warmup', title:'WARM UP',
      desc:'A big part of the shooting routine makes exacting execution possible.',
      drills:[
        {
          id:'d-gosignal', name:'PREPARING FOR THE GO SIGNAL', accent:'cyan', tags:['WARM UP'],
          cure:'V1: End the mistake of shooting when not 100% confident. V2: Quit the mechanical approach of using the same number of warm-up strokes on every shot.',
          objective:'Learn to let the GO SIGNAL determine when to shoot, not a fixed count of strokes.',
          setup:'Four shots (A, B, C, D) varying significantly in difficulty. A is easiest, D is hardest.',
          steps:[
            'VERSION 1: Shoot the easiest shot first (A), then medium (B and C), then hardest (D). Take as many warm-up strokes as needed until the GO SIGNAL fires.',
            'VERSION 2: Shoot shots A and C only. Take 6 warm-up strokes on A. Take only 2 warm-up strokes on C. Did either shot feel right?'
          ],
          review:'The wrong number of warm-up strokes is just as bad as no warm-up strokes. Let the feel determine the count.',
          tip:'The 5 GO SIGNALS: 1) Fine-tuned alignment and cueing, 2) Fine-tuned aim, 3) Grooved stroke on the perfect path, 4) Felt the speed, 5) Locked on to the object ball.',
          diagram: makeSVG({ portrait:true, balls:[{n:'CB',x:fcp(0.27),y:frp(0.30)},{n:'1',x:fcp(0.83),y:frp(0.27)},{n:'2',x:fcp(0.38),y:frp(0.47)},{n:'3',x:fcp(0.25),y:frp(0.62)},{n:'4',x:fcp(0.54),y:frp(0.72)}], lines:[{x1:fcp(0.27),y1:frp(0.30),x2:fcp(0.83),y2:frp(0.27),col:'#fff7',w:1},{x1:fcp(0.27),y1:frp(0.30),x2:fcp(0.38),y2:frp(0.47),col:'#fff7',w:1,dash:true},{x1:fcp(0.27),y1:frp(0.30),x2:fcp(0.25),y2:frp(0.62),col:'#fff7',w:1,dash:true},{x1:fcp(0.27),y1:frp(0.30),x2:fcp(0.54),y2:frp(0.72),col:'#fff7',w:1,dash:true}]}),
          scoring:{ type:'dotsABCD', id:'d-gosignal' }
        }
      ]
    },
    {
      id:'s3-transition', title:'TRANSITION',
      desc:'The unhurried reversal from backstroke to forward stroke. The most important moment.',
      drills:[
        {
          id:'d-transition', name:'SLOOOW DOWN YOUR TRANSITION', accent:'cyan', tags:['TRANSITION'],
          cure:'A hurried transition creates a jerky, off-line forward stroke that leads to misses and miscuing.',
          objective:'Feel the difference between a rushed and a smooth transition.',
          steps:[
            'Using Speed 3 (Soft) practice strokes, focus exclusively on the transition moment.',
            'At the peak of your backstroke, pause for a full second before beginning the forward stroke.',
            'Gradually reduce the pause until the backstroke flows naturally into the forward stroke.',
            'The transition should feel like water flowing around a corner — no abrupt reversal.'
          ],
          scoring:{ type:'speedProg', id:'d-transition', speeds:[3,4,5,6,7] }
        },
        {
          id:'d-nothing', name:'NOTHING SHOTS', accent:'gold', tags:['TRANSITION'],
          cure:'Discover if you have a "hit" mentality rather than a "stroke" mentality.',
          objective:'Practice shooting without the cue ball, eliminating any forward surge impulse.',
          steps:[
            'PART A: Place a donut at the tip position with no ball on it. Take your full routine — warm-up strokes, transition, forward stroke, follow through. The cue should glide through the donut as if it were a ghost shot.',
            'PART B: Add the cue ball but no object ball. Stroke through the cue ball position as if pocketing a ghost ball.'
          ],
          review:'Does your stroke change when a ball is present? If so, you have a "hit" mentality. The stroke should feel identical whether a ball is there or not.',
          diagram: makeSVG({ portrait:true, balls:[{n:'CB',x:fcp(0.25),y:frp(0.18)},{n:'1',x:fcp(0.25),y:frp(0.62)},{n:'CB',x:fcp(0.73),y:frp(0.20)},{n:'2',x:fcp(0.73),y:frp(0.62)}], shotPics:[{x:fcp(0.25),y:frp(0.87),r:13,dx:0,dy:0},{x:fcp(0.67),y:frp(0.87),r:13,dx:0,dy:0}], lines:[{x1:fcp(0.25),y1:frp(0.18),x2:fcp(0.0),y2:frp(0.0),col:'#fff7',w:1},{x1:fcp(0.73),y1:frp(0.20),x2:fcp(1.0),y2:frp(0.0),col:'#fff7',w:1},{x1:fcp(0.49),y1:frp(0.02),x2:fcp(0.49),y2:frp(0.80),col:'#fff4',w:1,dash:true}]}),
          scoring:{ type:'dotsAB', id:'d-nothing', dotsA:8, dotsB:8 }
        }
      ]
    },
    {
      id:'s3-forward', title:'FORWARD STROKE',
      desc:'The forward stroke is the business end of your shot. Straight, relaxed, accelerating smoothly.',
      drills:[
        {
          id:'d-allstraight', name:'ALL SHOTS ARE STRAIGHT', accent:'cyan', tags:['STROKE'],
          cure:'Understand that every pool shot is essentially a straight shot, with the ghost ball as your target.',
          objective:'Train your mind to always aim at the ghost ball center, not the object ball edge.',
          steps:[
            'PART A: Set up 5 cut shots at varying angles. For each, visualize and mark the ghost ball position with a coin. Aim at the coin, not the object ball.',
            'PART B: Remove the coin. Shoot the same shots using your newly trained ghost ball visualization.'
          ],
          review:'Did you see the ghost ball clearly before removing the coin? Did your aim shift back to the object ball edge after removing it?',
          tip:'Phil says: The ghost ball is always your true target. Train your eyes to see it automatically.',
          diagram: makeSVG({ portrait:true, balls:[{n:'CB',x:fcp(0.15),y:frp(0.93)},{n:'1',x:fcp(0.55),y:frp(0.90)},{n:'G',x:fcp(0.73),y:frp(0.90)}], shotPics:[{x:fcp(0.27),y:frp(0.55),r:13,dx:0,dy:0},{x:fcp(0.27),y:frp(0.73),r:13,dx:0,dy:0}], lines:[{x1:fcp(0.15),y1:frp(0.93),x2:fcp(0.55),y2:frp(0.90),col:'#fff8',w:1,dash:true},{x1:fcp(0.55),y1:frp(0.90),x2:fcp(1.0),y2:frp(0.0),col:'#fff8',w:1},{x1:fcp(0.15),y1:frp(0.93),x2:fcp(0.0),y2:frp(0.78),col:'#fff5',w:1,dash:true}]}),
          scoring:{ type:'qual', id:'d-allstraight', labels:{ 1:'STILL AIMING AT OB EDGE', 2:'SOMETIMES SEE GHOST BALL', 3:'GHOST BALL IS CLEAR' } }
        },
        {
          id:'d-acceleration', name:'THE FAST PART — ACCELERATION', accent:'gold', tags:['STROKE'],
          cure:'A stroke with no acceleration produces weak, inaccurate shots. A stroke with too much too soon produces a jab.',
          objective:'Learn to accelerate smoothly through the contact zone, starting slowly and finishing firmly.',
          steps:[
            'Set up a straight-in shot at medium distance. Use Speed 5 (Medium) for the shot.',
            'Begin your forward stroke very slowly — much slower than feels natural.',
            'Accelerate smoothly through the ball, reaching maximum speed just after contact.',
            'Think of it like a golf swing or a baseball swing: the power comes from acceleration, not from starting fast.'
          ],
          review:'Did the acceleration feel smooth or jerky? A smooth acceleration produces a solid hit and a predictable cue ball path.',
          scoring:{ type:'qual', id:'d-acceleration', labels:{ 1:'JERKY / POKING', 2:'PARTIAL SMOOTHNESS', 3:'SMOOTH THROUGH THE BALL' } }
        },
        {
          id:'d-shortadd', name:'START SHORT AND ADD LENGTH', accent:'green', tags:['STROKE'],
          cure:'Many players use a full stroke on every shot, creating power they do not need and control they cannot achieve.',
          objective:'Match your backswing length to the required shot speed.',
          steps:[
            'Speed 3: Use a very short backstroke — 4 inches. Execute cleanly.',
            'Speed 5: Use a medium backstroke — 8 inches.',
            'Speed 7: Use a full backstroke — 12 inches.',
            'Practice 5 shots at each speed, matching backswing to required speed.'
          ],
          review:'Using too long a backstroke for soft shots forces you to decelerate, which kills accuracy. Match the tool to the task.',
          diagram: makeSVG({ portrait:true, balls:[{n:'CB',x:fcp(0.12),y:frp(0.67)},{n:'1',x:fcp(0.55),y:frp(0.56)}], lines:[{x1:fcp(0.12),y1:frp(0.67),x2:fcp(0.55),y2:frp(0.56),col:'#fff8',w:1,dash:true},{x1:fcp(0.50),y1:frp(0.60),x2:fcp(0.50),y2:frp(0.82),col:'#fff6',w:1}]}),
          scoring:{ type:'qual', id:'d-shortadd', labels:{ 1:'ONE SIZE FITS ALL', 2:'SOME VARIATION', 3:'MATCHING BACKSWING' } }
        }
      ]
    },
    {
      id:'s3-followthru', title:'FOLLOW THROUGH',
      desc:'The follow through is the finish line of your stroke. It reveals everything about what happened before it.',
      drills:[
        {
          id:'d-posing', name:'POSING FOR A PICTURE', accent:'cyan', tags:['FOLLOW THRU'],
          cure:'Players who pull up after the shot never develop a reliable follow through.',
          objective:'Hold your follow-through position long enough to establish the habit.',
          steps:[
            'After each shot, hold your follow-through position as if you are posing for a photograph.',
            'Your cue should be pointing straight at where the cue ball was. Your head should be down.',
            'Hold the pose until the object ball drops into the pocket.',
            'Only then allow yourself to stand up.'
          ],
          review:'If your cue is drifting left or right during the hold, your arm swing is off-line. If your tip is rising, you pulled up.',
          tip:'Watch top professionals on YouTube. Notice how long they hold their follow-through position. This is not a coincidence.',
          scoring:{ type:'qual', id:'d-posing', labels:{ 1:'PULLING UP EARLY', 2:'SOMETIMES HOLDING', 3:'POSING EVERY SHOT' } }
        },
        {
          id:'d-raisingup', name:'RAISING UP FROM THE TABLE', accent:'gold', tags:['FOLLOW THRU'],
          cure:'Raising your head or upper body before the cue ball is struck is one of the most common causes of misses.',
          objective:'Identify if raising up is a problem in your game and eliminate it.',
          steps:[
            'Set up a straight-in shot at 4 feet. Have a partner watch your head and shoulder position.',
            'Shoot normally and ask: Did I raise up before or during the stroke?',
            'Repeat 10 times, having partner indicate "early" or "stayed down" for each shot.',
            'Focus specifically on keeping your chin touching or near the cue throughout the stroke.'
          ],
          review:'Even a one-inch rise of the head will change the cue ball impact point enough to cause a miss.',
          scoring:{ type:'qual', id:'d-raisingup', labels:{ 1:'RAISING UP REGULARLY', 2:'OCCASIONAL RAISE', 3:'STAYING DOWN' } }
        }
      ]
    },
    {
      id:'s3-straight', title:'STRAIGHTNESS',
      desc:'A straight stroke is a prerequisite for consistent pocketing. Test and groove it.',
      drills:[
        {
          id:'d-diamond', name:'CUE OVER THE DIAMOND', accent:'cyan', tags:['STRAIGHTNESS'],
          cure:'Prove to yourself that your stroke is (or is not) tracking straight.',
          objective:'Verify that your cue travels in a perfectly straight path during the stroke.',
          setup:'Place a donut on a diamond marker on the long rail. Hover your cue directly over the diamond, tip just past it.\n\nVersion 1: Open bridge, 8" bridge length\nVersion 2: Closed bridge, 8" bridge length\nVersion 3: Extended bridge, 12" bridge length',
          steps:[
            'Take your normal stance with the cue positioned directly over the diamond.',
            'Execute practice strokes. Your tip should remain directly over the diamond throughout the stroke.',
            'Have a partner watch from the side rail to confirm your tip is tracking straight.',
            'Advance to the next version only after 4 consecutive clean passes on the current version.'
          ],
          review:'Does your cue drift to the left or right during the stroke? This indicates an arm swing or wrist rotation problem.',
          diagram: makeSVG({ balls:[{n:'CB',x:fc(0.18),y:fr(0.48)}], shotPics:[{x:fc(0.20),y:fr(0.17),r:13,dx:0,dy:-0.4}], lines:[{x1:fc(0.18),y1:fr(0.48),x2:fc(0.95),y2:fr(0.48),col:'#fff6',w:1,dash:true},{x1:fc(0.18),y1:fr(0.48),x2:fc(0.95),y2:fr(0.18),col:'#fff8',w:1}]}),
          scoring:{ type:'streakVersions', id:'d-diamond', versions:3, target:4 }
        }
      ]
    },
    {
      id:'s3-feel', title:'FEEL',
      desc:'Feel is the highest level of stroke awareness. It cannot be taught directly — only developed.',
      drills:[
        {
          id:'d-feelweight', name:'FEEL THE WEIGHT', accent:'cyan', tags:['FEEL'],
          cure:'Players who grip tightly never develop feel. A light grip transmits force more precisely.',
          objective:'Learn to feel the weight of the cue at the end of the backstroke.',
          steps:[
            'VERSION 1: Hold the cue with the lightest possible grip. Take 10 practice strokes, feeling the weight of the cue at the balance point. Let the weight guide the stroke.',
            'VERSION 2: Shoot the same exercise with an actual shot. Maintain the light grip.'
          ],
          review:'Most players hold the cue 3-4 times tighter than necessary. Loosen the grip and feel increases dramatically.',
          scoring:{ type:'qualAB', id:'d-feelweight', labels:{ 1:'STILL GRIPPING TIGHT', 2:'LIGHTER GRIP', 3:'FEATHER LIGHT' } }
        },
        {
          id:'d-armonly', name:'ARM ONLY', accent:'gold', tags:['FEEL'],
          cure:'Many players use shoulder and wrist motion that interferes with a straight stroke.',
          objective:'Isolate the forearm pendulum motion that is the heart of the orthodox stroke.',
          steps:[
            'Consciously lock your wrist and shoulder. Allow only the forearm to swing.',
            'Take 20 practice strokes. Feel the pendulum motion from the elbow.',
            'This is the purest form of the orthodox pendulum stroke at 60 BPM cadence.',
            'Now shoot a ball with this arm-only feeling as the baseline.'
          ],
          review:'The arm-only stroke tends to be slower and more accurate. As you add back natural wrist motion, try to maintain this accuracy.',
          scoring:{ type:'qual', id:'d-armonly', labels:{ 1:'CAN\'T ISOLATE ARM', 2:'PARTIAL ISOLATION', 3:'PURE PENDULUM' } }
        },
        {
          id:'d-openbridge', name:'OPEN BRIDGE MAGIC', accent:'green', tags:['FEEL','BRIDGE'],
          cure:'The open bridge gives superior feel and cue elevation feedback. Many pros prefer it.',
          objective:'Learn to use the open bridge effectively on all standard shots.',
          steps:[
            'VERSION 1: Shoot 10 straight-in shots using only the open bridge. Bridge length: 8 inches.',
            'VERSION 2: Shoot 10 cut shots using the open bridge. Focus on maintaining consistent bridge height.'
          ],
          review:'Did the open bridge change your feel of the stroke? Most players find it gives more feedback and control, despite initial awkwardness.',
          scoring:{ type:'qualAB', id:'d-openbridge', labels:{ 1:'UNCOMFORTABLE', 2:'ADJUSTING', 3:'COMFORTABLE' } }
        },
        {
          id:'d-eyesclosed', name:'EYES CLOSED EXERCISE', accent:'red', tags:['FEEL'],
          cure:'Trains proprioceptive awareness — knowing where the cue is without visual feedback.',
          objective:'Develop stroke muscle memory so deep it works without visual guidance.',
          steps:[
            'Set up a straight-in shot. Take your normal stance and warm-up strokes.',
            'On the final stroke, close your eyes at the moment you begin your backswing.',
            'Complete the full stroke — backstroke, transition, forward stroke, follow through — with eyes closed.',
            'Open eyes and check result. Shoot 10 balls this way.'
          ],
          review:'If you make most of these shots, your stroke alignment is genuine. If you miss wildly, your sighting is compensating for a stroke problem.',
          scoring:{ type:'hitMiss', id:'d-eyesclosed', showPct:true }
        },
        {
          id:'d-trusting', name:'TRUSTING YOUR AMAZING POWERS', accent:'cyan', tags:['MENTAL','FEEL'],
          cure:'Over-controlling the stroke destroys the natural feedback loop between eye and arm.',
          objective:'Practice "letting it happen" rather than "making it happen."',
          steps:[
            'Set up a medium-difficulty cut shot.',
            'Look at the ghost ball. Lock in your aim. Then shift 100% focus to the feel of the stroke — not the aim.',
            'Trust that your aim is correct and just execute a smooth, free stroke.',
            'Shoot 10 balls this way.'
          ],
          review:'Many of the best shots in pool history were played by players who stopped "thinking" and just played. Trust the system you have built.',
          scoring:{ type:'qual', id:'d-trusting', labels:{ 1:'STILL OVER-CONTROLLING', 2:'PARTIALLY LETTING GO', 3:'FULL TRUST' } }
        }
      ]
    },
    {
      id:'s3-grooving', title:'GROOVING',
      desc:'The final step: ingraining your technique through perfect repetition until it is automatic.',
      drills:[
        {
          id:'d-fivedonuts', name:'5 DONUTS IN A ROW', accent:'cyan', tags:['GROOVING'],
          cure:'The ultimate test of groove — making 5 consecutive shots with perfect form, proving the technique is truly ingrained.',
          objective:'Achieve 4 consecutive perfect executions on three progressively harder setups.',
          setup:'Place the CB on a donut at the 1st diamond from the head rail, on the center line. Place OB on a donut directly in line with pocket A.\n\nV1: Easy straight shot, 2 feet apart.\nV2: Medium straight shot, 4 feet apart.\nV3: Angled shot 15°, 3 feet apart.',
          steps:[
            'V1 GOAL: 4 consecutive makes with the following: full pre-shot routine, perfect follow-through pose, eyes closed on 1 of the 4 shots.',
            'V2 GOAL: 4 consecutive makes. Do not advance until V1 is achieved.',
            'V3 GOAL: 4 consecutive makes. This is your graduation test.'
          ],
          review:'The streak breaks your routine and exposes weaknesses you cannot hide. Each missed consecutive is data.',
          tip:'Phil says: When practicing shots in small increments, look for the subtle nuances from shot to shot. When you can gain some meaning from minute distinctions like this, your game is heading for a whole new level of precision.',
          diagram: makeSVG({ balls:[{n:'CB',x:fc(0.47),y:fr(0.57)},{n:'1',x:fc(0.83),y:fr(0.25)},{n:'G',x:fc(0.42),y:fr(0.57)},{n:'G',x:fc(0.52),y:fr(0.57)}], shotPics:[{x:fc(0.12),y:fr(0.22),r:12,dx:0,dy:0},{x:fc(0.28),y:fr(0.22),r:12,dx:0.2,dy:0},{x:fc(0.72),y:fr(0.60),r:12,dx:0,dy:0}], lines:[{x1:fc(0.47),y1:fr(0.57),x2:fc(0.83),y2:fr(0.25),col:'#fff8',w:1}]}),
          scoring:{ type:'streak', id:'d-fivedonuts', versions:3, target:4 }
        }
      ]
    }
  ]
},

/* ═══════════════════════════════════════
   CHAPTER 4 — SHOTMAKING & AIMING
═══════════════════════════════════════ */
{
  id:'ch04', num:4, title:'Shotmaking & Aiming',
  subtitle:'Natural aiming, shot pictures, cuts, rails, and distraction shots',
  color:'gold', drillCount:28,
  sections:[
    {
      id:'s4-natural', title:'NATURAL AIMING',
      desc:'The 6-step process and shot pictures. How champions develop a reliable aiming system.',
      drills:[
        {
          id:'d-6step', name:'THE 6-STEP AIMING PROCESS', accent:'cyan', tags:['REFERENCE','AIMING'],
          cure:'Aiming without a process leads to inconsistent shot selection and poor accuracy.',
          objective:'Learn and apply Capelle\'s natural 6-step aiming process on every shot.',
          steps:[
            'STEP 1 — IDENTIFY THE POCKET: Choose the target pocket before thinking about the shot.',
            'STEP 2 — IDENTIFY THE GHOST BALL: Visualize the ghost ball (the position where the CB must be when it contacts the OB).',
            'STEP 3 — CONSTRUCT THE SHOT PICTURE: See both balls as a unit — the CB traveling to the ghost ball, the OB going to the pocket.',
            'STEP 4 — APPROACH THE SHOT: Walk to the shot with your eyes on the line of aim.',
            'STEP 5 — TAKE YOUR STANCE: Land on the line of aim. Your cue should extend down the line naturally.',
            'STEP 6 — EXECUTE: Fine-tune aim, feel the speed, fire on the GO SIGNAL.'
          ],
          review:'This process should become as automatic as walking. In competition you should not need to consciously run through the steps.',
          tip:'Phil says: The Shot Picture is your mental image of the completed shot. The stronger and more vivid the picture, the more reliably your subconscious can execute it.',
          scoring:{ type:'checklist', id:'d-6step', items:['Step 1: Identify pocket','Step 2: Identify ghost ball','Step 3: Construct Shot Picture','Step 4: Approach on line of aim','Step 5: Stance on line of aim','Step 6: Execute on GO SIGNAL'] }
        },
        {
          id:'d-closure', name:'CLOSURE EXERCISE', accent:'gold', tags:['AIMING','SHOTPICTURE'],
          cure:'Develop the ability to close your eyes and still see the complete Shot Picture.',
          objective:'Build a vivid internal Shot Picture that does not require continuous visual reference.',
          steps:[
            'PART A: Set up a 30-degree cut shot. Study the shot for 10 seconds, building the complete Shot Picture.',
            'Close your eyes. Hold the Shot Picture for 3 seconds. Open eyes. Did the picture match?',
            'Shoot the shot. Did the execution match the picture?',
            'PART B: Set up a 45-degree cut shot. Repeat the process.'
          ],
          review:'If your Shot Picture is weak or blurry, your brain cannot execute the shot reliably. Train the picture before training the stroke.',
          diagram: makeSVG({ balls:[{n:'1',x:fc(0.33),y:fr(0.43)},{n:'2',x:fc(0.62),y:fr(0.43)},{n:'CB',x:fc(0.48),y:fr(0.57)},{n:'G',x:fc(0.48),y:fr(0.30)}], lines:[{x1:fc(0.33),y1:fr(0.43),x2:fc(0.50),y2:fr(0.02),col:'#fff8',w:1},{x1:fc(0.62),y1:fr(0.43),x2:fc(0.50),y2:fr(0.02),col:'#fff8',w:1},{x1:fc(0.48),y1:fr(0.57),x2:fc(0.33),y2:fr(0.43),col:'#fff6',w:1,dash:true},{x1:fc(0.48),y1:fr(0.57),x2:fc(0.62),y2:fr(0.43),col:'#fff6',w:1,dash:true},{x1:fc(0.49),y1:fr(0.05),x2:fc(0.49),y2:fr(0.95),col:'#fff4',w:1,dash:true}]}),
          scoring:{ type:'hitMissAB', id:'d-closure', labelA:'PART A MAKES', labelB:'PART B MAKES', shots:10 }
        },
        {
          id:'d-twocuts', name:'A TALE OF TWO CUT SHOTS', accent:'cyan', tags:['AIMING','CUT ANGLES'],
          cure:'Understanding why two shots that look similar require completely different aim points.',
          objective:'Compare make rates on two shots that appear similar but have very different Shot Pictures.',
          setup:'Part A: Short-range 30° cut into corner pocket (easy Shot Picture, compact path).\nPart B: Long-range 30° cut across the table into opposite corner (extended Shot Picture, tests peripheral vision).',
          steps:[
            'Shoot 10 balls from Part A position. Record makes.',
            'Shoot 10 balls from Part B position. Record makes.',
            'Compare results. Which position had a higher make rate?'
          ],
          review:'If Part A is significantly higher than Part B, your Shot Picture weakens with distance. This is the skill to train.',
          diagram: makeSVG({ portrait:true, balls:[{n:'CB',x:fcp(0.38),y:frp(0.57)},{n:'1',x:fcp(0.23),y:frp(0.80)},{n:'CB',x:fcp(0.73),y:frp(0.57)},{n:'2',x:fcp(0.60),y:frp(0.80)}], lines:[{x1:fcp(0.23),y1:frp(0.80),x2:fcp(0.0),y2:frp(1.0),col:'#fff8',w:1},{x1:fcp(0.60),y1:frp(0.80),x2:fcp(1.0),y2:frp(1.0),col:'#fff8',w:1},{x1:fcp(0.38),y1:frp(0.57),x2:fcp(0.23),y2:frp(0.80),col:'#fff6',w:1,dash:true},{x1:fcp(0.73),y1:frp(0.57),x2:fcp(0.60),y2:frp(0.80),col:'#fff6',w:1,dash:true}]}),
          scoring:{ type:'hitMissAB', id:'d-twocuts', labelA:'PART A (SHORT)', labelB:'PART B (LONG)', shots:10 }
        },
        {
          id:'d-straight-near', name:'STRAIGHT AND NEAR-STRAIGHT SHOTS', accent:'green', tags:['AIMING'],
          cure:'Near-straight shots are more difficult than they appear because players fight the temptation to overcut.',
          objective:'Achieve consistent makes on shots from dead straight to 10-degree cuts.',
          steps:[
            'PART A: Dead straight-in from 3 feet. Shoot 10 balls. Use the vertical axis cue position.',
            'PART B: 5-degree cut (half-ball width offset) from 3 feet. Shoot 10 balls. Aim at ghost ball center.',
            'Note: Near-straight shots require a slight tangent away from straight-in. Do not fight it.'
          ],
          review:'Most players make dead straight shots at a higher rate than near-straight shots. If this is you, practice the 5-degree cut specifically.',
          diagram: makeSVG({ portrait:true, balls:[{n:'CB',x:fcp(0.25),y:frp(0.28)},{n:'1',x:fcp(0.25),y:frp(0.52)},{n:'CB',x:fcp(0.73),y:frp(0.28)},{n:'2',x:fcp(0.73),y:frp(0.52)}], shotPics:[{x:fcp(0.30),y:frp(0.84),r:14,dx:0,dy:0},{x:fcp(0.65),y:frp(0.84),r:14,dx:0,dy:0}], lines:[{x1:fcp(0.25),y1:frp(0.28),x2:fcp(0.25),y2:frp(0.52),col:'#fff6',w:1,dash:true},{x1:fcp(0.25),y1:frp(0.52),x2:fcp(0.0),y2:frp(1.0),col:'#fff8',w:1},{x1:fcp(0.73),y1:frp(0.28),x2:fcp(0.73),y2:frp(0.52),col:'#fff6',w:1,dash:true},{x1:fcp(0.73),y1:frp(0.52),x2:fcp(1.0),y2:frp(1.0),col:'#fff8',w:1},{x1:fcp(0.49),y1:frp(0.02),x2:fcp(0.49),y2:frp(0.78),col:'#fff4',w:1,dash:true}]}),
          scoring:{ type:'hitMissAB', id:'d-straight-near', labelA:'STRAIGHT-IN', labelB:'5° CUT', shots:10 }
        },
        {
          id:'d-crossover', name:'THE CROSSOVER POINT', accent:'gold', tags:['AIMING','CUT ANGLES'],
          cure:'Understanding the crossover from "aim fuller" to "aim thinner" as cut angle increases.',
          objective:'Identify your personal crossover point and build accuracy on both sides of it.',
          steps:[
            '10° CUT: Place OB at 10° to pocket. Shoot 5 from Cue Ball A, then from B. The Shot Picture extends to the near side of the pocket.',
            '20° CUT: Same setup at 20°. Notice the Shot Picture changes. The ghost ball "jumps" to the far side of the pocket.',
            'Record makes at each angle from each cue ball position.'
          ],
          review:'The crossover point is where your natural aim shifts from fuller to thinner. Most players have it between 20-35 degrees.',
          diagram: makeSVG({ portrait:true, balls:[{n:'CB',x:fcp(0.55),y:frp(0.43)},{n:'G',x:fcp(0.38),y:frp(0.78)},{n:'G',x:fcp(0.52),y:frp(0.78)}], lines:[{x1:fcp(0.55),y1:frp(0.43),x2:fcp(0.38),y2:frp(0.78),col:'#fff8',w:1},{x1:fcp(0.55),y1:frp(0.43),x2:fcp(0.52),y2:frp(0.78),col:'#fff8',w:1,dash:true}]}),
          scoring:{ type:'hitMissMulti', id:'d-crossover', groups:['10° CUT', '20° CUT'], shots:5 }
        },
        {
          id:'d-cutting-rail', name:'CUTTING INTO AND AWAY FROM RAIL', accent:'red', tags:['AIMING','RAIL'],
          cure:'Rail shots require different aim adjustments depending on direction relative to the rail.',
          objective:'Compare accuracy cutting into vs. away from the rail at the same cut angle.',
          steps:[
            'PART A — BACK CUTS (cutting away from rail): OB near long rail, cut back toward the near pocket. Shoot 10 shots.',
            'PART B — FORWARD CUTS (cutting toward opposite rail): Same setup, pocket is the far pocket. Shoot 10 shots.',
            'Compare results. Which direction is stronger?'
          ],
          review:'Most players find back cuts easier because the cue ball path is shorter and more predictable.',
          diagram: makeSVG({ balls:[{n:'CB',x:fc(0.33),y:fr(0.60)},{n:'1',x:fc(0.50),y:fr(0.45)},{n:'CB',x:fc(0.21),y:fr(0.37)},{n:'2',x:fc(0.65),y:fr(0.38)}], lines:[{x1:fc(0.33),y1:fr(0.60),x2:fc(0.50),y2:fr(0.45),col:'#fff6',w:1,dash:true},{x1:fc(0.50),y1:fr(0.45),x2:fc(0.0),y2:fr(0.62),col:'#fff8',w:1},{x1:fc(0.21),y1:fr(0.37),x2:fc(0.65),y2:fr(0.38),col:'#fff6',w:1,dash:true},{x1:fc(0.65),y1:fr(0.38),x2:fc(1.0),y2:fr(0.25),col:'#fff8',w:1},{x1:fc(0.12),y1:fr(0.95),x2:fc(0.88),y2:fr(0.05),col:'#fff4',w:1,dash:true}]}),
          scoring:{ type:'hitMissAB', id:'d-cutting-rail', labelA:'BACK CUTS', labelB:'FORWARD CUTS', shots:10 }
        },
        {
          id:'d-identical', name:'BOTH SIDES OF "IDENTICAL" SHOTS', accent:'cyan', tags:['AIMING','COMPARISON'],
          cure:'Discover whether you have a stronger side (left-to-pocket vs. right-to-pocket cuts).',
          objective:'Compare make rates on mirror-image shots from both sides of the table.',
          setup:'Four shot setups (A, B, C, D). Each shot has a left-side and right-side version. 5 shots per side.',
          steps:[
            'Set up Shot A from the left side. Shoot 5 balls. Record makes.',
            'Set up Shot A from the right side (mirror image). Shoot 5 balls. Record makes.',
            'Repeat for Shots B, C, and D.',
            'Identify which side consistently performs worse. That becomes a training priority.'
          ],
          review:'A significant difference between sides (more than 2 balls in 5) indicates a dominant eye, shoulder, or alignment bias that can be corrected.',
          diagram: makeSVG({ portrait:true, balls:[{n:'CB',x:fcp(0.18),y:frp(0.32)},{n:'CB',x:fcp(0.78),y:frp(0.32)},{n:'1',x:fcp(0.46),y:frp(0.40)},{n:'2',x:fcp(0.46),y:frp(0.52)},{n:'3',x:fcp(0.46),y:frp(0.63)},{n:'4',x:fcp(0.46),y:frp(0.73)}], lines:[{x1:fcp(0.18),y1:frp(0.32),x2:fcp(0.46),y2:frp(0.40),col:'#fff8',w:1},{x1:fcp(0.18),y1:frp(0.32),x2:fcp(0.46),y2:frp(0.73),col:'#fff5',w:1,dash:true},{x1:fcp(0.78),y1:frp(0.32),x2:fcp(0.46),y2:frp(0.40),col:'#fff8',w:1},{x1:fcp(0.78),y1:frp(0.32),x2:fcp(0.46),y2:frp(0.73),col:'#fff5',w:1,dash:true}]}),
          scoring:{ type:'bothSides', id:'d-identical', shots:['A','B','C','D'], shotsEach:5 }
        }
      ]
    },
    {
      id:'s4-sidepocket', title:'SIDE POCKET PLAY',
      desc:'Side pockets are among the most important — and neglected — shots in pool.',
      drills:[
        {
          id:'d-side-bonanza', name:'SIDE POCKET BONANZA', accent:'gold', tags:['SIDE POCKET','PROGRESSIVE'],
          cure:'Side pocket shots are underpracticed. They account for significant offensive opportunities in all games.',
          objective:'Master all relevant side pocket shots from all cue ball positions.',
          setup:'Mark a piece of string in three places: 0 (base), 16", and 32". Tape to the side pocket opening. Place donuts on the 16" and 32" marks on the rail. Place CB and OBs on appropriate donuts as shown in the score sheet.',
          steps:[
            'Use the cueing and speed that gives you the best chance of making each ball.',
            'On thin cut shots, aim for the middle of the pocket. Use medium hard to hard stroke.',
            'Track which shots you\'ve played on the Side Pocket Scorecard.',
            'Perfect score with 1-3s only: 61 points. With 1-4s: 85 points.'
          ],
          review:'The two biggest factors: 1) cut angle, 2) effective pocket opening. The two balls together tell you what you can make.',
          tip:'Phil says: Advise that you photo-copy the scorecard so you can use it over and over again.',
          scoring:{ type:'pointTracker', id:'d-side-bonanza', maxPts:61, label:'SIDE POCKET BONANZA SCORE' }
        },
        {
          id:'d-corner-short', name:'CORNER POCKETS — SHORT SIDE', accent:'cyan', tags:['CORNER POCKET','PROGRESSIVE'],
          cure:'Short side shots cover a wide variety of angles and are essential in Eight Ball and Straight Pool.',
          objective:'Master all short-side corner pocket shots from 5 cue ball positions.',
          setup:'32 shots on each side (64 total). 5 object ball positions, multiple cue ball positions.\nPerfect score (1-3s): 50 points per side.',
          steps:[
            'PART A: Shoot all 32 shots from the left side.',
            'PART B: Shoot all 32 shots from the right side.',
            'Track each shot result: 1=Miss, 2=Almost (barely missed), 3=Made.',
            'Focus on imprinting the Shot Picture for each unique angle.'
          ],
          review:'These shots appear regularly in competition. A player who has drilled them all will have superior confidence on each one.',
          scoring:{ type:'pointTrackerAB', id:'d-corner-short', maxPtsA:50, maxPtsB:50, label:'SHORT SIDE SCORE' }
        },
        {
          id:'d-side-short', name:'SIDE POCKETS — SHORT SIDE', accent:'gold', tags:['SIDE POCKET','PROGRESSIVE'],
          cure:'Short-side shots at the side pocket are among the most common offensive plays.',
          objective:'Master 54 shots to the side pocket from the short side.',
          setup:'7 cue ball positions, 8-16 object ball positions per cue ball. Total 54 shots (57 with 4-point extensions).\nPerfect score (1-3s): 103 points.',
          steps:[
            'Shoot the exercise from start to right side.',
            'Use a start at the left end and go to the right, or start in the middle.',
            'Track results: 1=Miss, 2=Almost, 3=Made.',
            'For extended version, add 4-point shots.'
          ],
          review:'When you are skilled at shooting in the side pockets, you see the table differently. You will play position for them more often.',
          scoring:{ type:'pointTracker', id:'d-side-short', maxPts:103, label:'SIDE POCKET SHORT SIDE SCORE' }
        }
      ]
    },
    {
      id:'s4-english', title:'ENGLISH MASTERY',
      desc:'When, why, and how to use english. The matrix approach.',
      drills:[
        {
          id:'d-english-seq', name:'MASTERING ENGLISH IN SEQUENCE', accent:'cyan', tags:['ENGLISH','REFERENCE'],
          cure:'Using english incorrectly causes more misses than it prevents. Learn when it helps and when it hurts.',
          objective:'Understand the rules for when english is appropriate.',
          steps:[
            'RULE 1: Never use more than half a tip of english unless you are an experienced player.',
            'RULE 2: Avoid english on straight shots and very thin cuts.',
            'RULE 3: Use english primarily to control cue ball path after contact, not to alter cut angle.',
            'RULE 4: Compensate for throw (aim fuller when using outside english, thinner with inside).',
            'RULE 5: At high speeds, english has less effect on trajectory but more on speed.'
          ],
          tip:'The primary components of a shot are the correct speed, cueing to control direction, and pocketing the ball. English can help any or all of these components on occasion, but you can play far more shots successfully without ever using it.',
          scoring:{ type:'checklist', id:'d-english-seq', items:['Rule 1: Half tip max (unless experienced)','Rule 2: Avoid on straight/thin shots','Rule 3: For CB path control after contact','Rule 4: Compensate for throw','Rule 5: Speed affects english efficiency'] }
        },
        {
          id:'d-straight-side', name:'STRAIGHT IN THE SIDE — ENGLISH EFFECTS', accent:'gold', tags:['ENGLISH'],
          cure:'The shot that looks like a gimme teaches you everything about throw and deflection.',
          objective:'Experience throw and deflection firsthand on the same straight-in shot.',
          steps:[
            'PART A — THROW: Play 2-3 soft follow shots with left english from CB1. Did the ball go left? Play same with right english. The ball will go right (throw).',
            'PART B — DEFLECTION: Aim straight at OB from CB1 with full left english, medium stroke. Did you miss left? Play from CBs 2 and 3. All shots likely missed left (deflection counteracts).',
            'PART C — FIVE POINTS OF LIGHT: Play the shot with center, half left, full left, half right, full right english. Mark CB ending positions.'
          ],
          review:'Parts A and B show opposite effects that partially cancel each other. Part C shows you your cue\'s personal deflection characteristics.',
          diagram: makeSVG({ balls:[{n:'G',x:fc(0.49),y:fr(0.20)},{n:'1',x:fc(0.49),y:fr(0.38)},{n:'2',x:fc(0.49),y:fr(0.52)},{n:'3',x:fc(0.49),y:fr(0.65)},{n:'CB',x:fc(0.49),y:fr(0.82)},{n:'CB',x:fc(0.22),y:fr(0.27)},{n:'4',x:fc(0.73),y:fr(0.27)},{n:'5',x:fc(0.73),y:fr(0.52)}], lines:[{x1:fc(0.49),y1:fr(0.82),x2:fc(0.49),y2:fr(0.65),col:'#fff8',w:1},{x1:fc(0.22),y1:fr(0.27),x2:fc(0.0),y2:fr(0.0),col:'#fff8',w:1},{x1:fc(0.73),y1:fr(0.27),x2:fc(0.73),y2:fr(0.52),col:'#fff6',w:1,dash:true},{x1:fc(0.73),y1:fr(0.52),x2:fc(1.0),y2:fr(0.0),col:'#fff8',w:1},{x1:fc(0.33),y1:fr(0.05),x2:fc(0.33),y2:fr(0.95),col:'#fff3',w:1,dash:true},{x1:fc(0.66),y1:fr(0.05),x2:fc(0.66),y2:fr(0.95),col:'#fff3',w:1,dash:true}]}),
          scoring:{ type:'hitMissMulti', id:'d-straight-side', groups:['PART A (SOFT/ENGLISH)', 'PART B (MED/DEFLECTION)', 'PART C (5 POSITIONS)'], shots:5 }
        }
      ]
    },
    {
      id:'s4-banks', title:'BANK SHOTS',
      desc:'Skill at bank shots depends on understanding angles, speed, and english. ~28% of pro position plays involve a bank.',
      drills:[
        {
          id:'d-bank-basics', name:'BANK SHOT SPEED AND PATHS', accent:'cyan', tags:['BANKS'],
          cure:'Speed changes the rebound angle on banks. Understanding this lets you control the bank.',
          objective:'Learn how speed affects bank angle by shooting the same bank at three different speeds.',
          steps:[
            'Set up a simple cross-table bank shot.',
            'Shoot with a Medium stroke (5). Mark where the OB ends up.',
            'Shoot with a Hard stroke (7). Mark where the OB ends up. Note: it rebounded at a shallower angle.',
            'Shoot with a Soft stroke (3). Note: it rebounded at a steeper angle.',
            'Repeat from multiple positions to learn your table\'s speed-angle relationship.'
          ],
          review:'Most bank shots are made with a medium stroke. Soft and hard strokes are used to alter the rebound angle intentionally.',
          diagram: makeSVG({ balls:[{n:'G',x:fc(0.16),y:fr(0.20)},{n:'1',x:fc(0.47),y:fr(0.82)}], shotPics:[{x:fc(0.56),y:fr(0.27),r:12,dx:0,dy:0},{x:fc(0.69),y:fr(0.27),r:12,dx:0,dy:0},{x:fc(0.82),y:fr(0.27),r:12,dx:0,dy:0}], lines:[{x1:fc(0.16),y1:fr(0.20),x2:fc(0.47),y2:fr(0.82),col:'#fff7',w:1},{x1:fc(0.47),y1:fr(0.82),x2:fc(0.10),y2:fr(1.0),col:'#fff8',w:1},{x1:fc(0.47),y1:fr(0.82),x2:fc(0.35),y2:fr(1.0),col:'#fff7',w:1,dash:true},{x1:fc(0.47),y1:fr(0.82),x2:fc(0.58),y2:fr(1.0),col:'#fff6',w:1,dash:true}]}),
          scoring:{ type:'hitMiss', id:'d-bank-basics', showPct:true }
        },
        {
          id:'d-bank-english', name:'ENGLISH AND BANK SHOTS', accent:'gold', tags:['BANKS','ENGLISH'],
          cure:'English changes the rebound angle at contact. Understanding this is the key to advanced banking.',
          objective:'Learn to use english to widen or narrow bank angles.',
          steps:[
            'Shoot a cross-table bank using centerball. Note the result.',
            'Shoot the same bank with a half tip of inside (right) english. Note: shallower rebound (widens angle).',
            'Shoot with outside (left) english. Note: steeper rebound (narrows angle).',
            'Practice from the positions in Parts A and B. Track which english helps each shot.',
            'Spin to Win version: use outside english on short banks to sharpen the angle into the pocket.'
          ],
          diagram: makeSVG({ balls:[{n:'G',x:fc(0.16),y:fr(0.20)},{n:'1',x:fc(0.47),y:fr(0.75)}], shotPics:[{x:fc(0.55),y:fr(0.22),r:12,dx:0,dy:0},{x:fc(0.68),y:fr(0.22),r:12,dx:-0.5,dy:0},{x:fc(0.82),y:fr(0.22),r:12,dx:0.5,dy:0}], lines:[{x1:fc(0.16),y1:fr(0.20),x2:fc(0.47),y2:fr(0.75),col:'#fff7',w:1},{x1:fc(0.47),y1:fr(0.75),x2:fc(0.10),y2:fr(1.0),col:'#fff8',w:1},{x1:fc(0.47),y1:fr(0.75),x2:fc(0.35),y2:fr(1.0),col:'#fff7',w:1,dash:true},{x1:fc(0.47),y1:fr(0.75),x2:fc(0.58),y2:fr(1.0),col:'#fff6',w:1,dash:true}]}),
          scoring:{ type:'hitMissMulti', id:'d-bank-english', groups:['CENTER BALL', 'INSIDE ENGLISH', 'OUTSIDE ENGLISH'], shots:5 }
        },
        {
          id:'d-crossover-bank', name:'CROSSOVER BANKS', accent:'red', tags:['BANKS'],
          cure:'Crossover banks travel long distances and require extra allowance for Contact Induced Throw.',
          objective:'Build confidence and accuracy on the most difficult bank type.',
          steps:[
            'PART A: The object ball must cross the path of the cue ball traveling toward it. Set up as shown.',
            'PART B: A double kiss is likely from certain positions — use english to avoid it.',
            'Use a hard stroke — the OB must be hit fairly thinly on crossover banks.',
            'Shoot 5 from Part A positions, then 5 from Part B.'
          ],
          diagram: makeSVG({ balls:[{n:'G',x:fc(0.20),y:fr(0.50)},{n:'1',x:fc(0.22),y:fr(0.60)},{n:'2',x:fc(0.22),y:fr(0.65)},{n:'3',x:fc(0.22),y:fr(0.70)},{n:'CB',x:fc(0.48),y:fr(0.78)},{n:'CB',x:fc(0.78),y:fr(0.43)},{n:'4',x:fc(0.57),y:fr(0.55)}], lines:[{x1:fc(0.48),y1:fr(0.78),x2:fc(0.20),y2:fr(0.50),col:'#fff6',w:1,dash:true},{x1:fc(0.20),y1:fr(0.50),x2:fc(0.50),y2:fr(0.02),col:'#fff8',w:1},{x1:fc(0.50),y1:fr(0.02),x2:fc(0.95),y2:fr(0.43),col:'#fff8',w:1},{x1:fc(0.78),y1:fr(0.43),x2:fc(0.57),y2:fr(0.55),col:'#fff6',w:1,dash:true},{x1:fc(0.57),y1:fr(0.55),x2:fc(0.95),y2:fr(0.95),col:'#fff8',w:1},{x1:fc(0.49),y1:fr(0.05),x2:fc(0.49),y2:fr(0.95),col:'#fff3',w:1,dash:true}]}),
          scoring:{ type:'hitMissAB', id:'d-crossover-bank', labelA:'PART A', labelB:'PART B', shots:5 }
        }
      ]
    },
    {
      id:'s4-rail', title:'RAIL SHOTS',
      desc:'Rail shots account for ~28% of all offensive shots. They deserve significant practice time.',
      drills:[
        {
          id:'d-rail-across', name:'RAIL SHOTS ACROSS THE TABLE', accent:'cyan', tags:['RAIL SHOTS'],
          cure:'The vast majority of rail shots are played across the width of the table, not down its length.',
          objective:'Build accuracy and confidence on the most common rail shot type.',
          setup:'Place CB and 1-ball near the long rail. Shoot toward the far corner pocket. This is a cross-table rail shot.',
          steps:[
            'PART A — NO ENGLISH: Shoot 5 balls from 3 feet off the corner. Use center ball.',
            'PART B — WITH ENGLISH: Repeat with a half tip of outside english (away from rail). Does accuracy improve?',
            'Keep cue as level as possible. Use a short (6") stroke and accelerate smoothly.',
            'Advance: progress from easier setups to harder setups, closer to the rail.'
          ],
          review:'Keep the cue level. When the CB is close to the rail, the cue angle drops, making control harder.',
          diagram: makeSVG({ portrait:true, balls:[{n:'CB',x:fcp(0.13),y:frp(0.43)},{n:'1',x:fcp(0.36),y:frp(0.27)},{n:'CB',x:fcp(0.65),y:frp(0.78)},{n:'2',x:fcp(0.13),y:frp(0.90)}], lines:[{x1:fcp(0.13),y1:frp(0.43),x2:fcp(0.36),y2:frp(0.27),col:'#fff6',w:1,dash:true},{x1:fcp(0.36),y1:frp(0.27),x2:fcp(1.0),y2:frp(0.0),col:'#fff8',w:1},{x1:fcp(0.65),y1:frp(0.78),x2:fcp(0.13),y2:frp(0.90),col:'#fff6',w:1,dash:true},{x1:fcp(0.13),y1:frp(0.90),x2:fcp(1.0),y2:frp(1.0),col:'#fff8',w:1}]}),
          scoring:{ type:'hitMissAB', id:'d-rail-across', labelA:'NO ENGLISH', labelB:'WITH ENGLISH', shots:5 }
        },
        {
          id:'d-rail-length', name:'TABLE LENGTH RAIL SHOTS', accent:'gold', tags:['RAIL SHOTS'],
          cure:'Table-length rail shots test your ability to stay level with the cue over a long distance.',
          objective:'Build accuracy on end-to-end rail shots, essential in Nine Ball and Straight Pool.',
          steps:[
            'PART A: Progressive exercise. Start with CB #1 and proceed to CB #5. Keep cue level, use a short stroke, and accelerate smoothly. Use Speed 5 (medium).',
            'PART B: Mirror exercise from the opposite end.',
            'Focus on staying down on the shot — these long shots punish any head or body movement.'
          ],
          diagram: makeSVG({ portrait:true, balls:[{n:'CB',x:fcp(0.26),y:frp(0.53)},{n:'CB',x:fcp(0.73),y:frp(0.53)},{n:'G',x:fcp(0.25),y:frp(0.82)},{n:'G',x:fcp(0.63),y:frp(0.82)}], lines:[{x1:fcp(0.26),y1:frp(0.53),x2:fcp(0.0),y2:frp(1.0),col:'#fff8',w:1},{x1:fcp(0.0),y1:frp(1.0),x2:fcp(0.0),y2:frp(0.0),col:'#fff6',w:1,dash:true},{x1:fcp(0.73),y1:frp(0.53),x2:fcp(1.0),y2:frp(1.0),col:'#fff8',w:1},{x1:fcp(1.0),y1:frp(1.0),x2:fcp(1.0),y2:frp(0.0),col:'#fff6',w:1,dash:true},{x1:fcp(0.49),y1:frp(0.02),x2:fcp(0.49),y2:frp(0.95),col:'#fff4',w:1,dash:true}]}),
          scoring:{ type:'hitMissAB', id:'d-rail-length', labelA:'PART A', labelB:'PART B', shots:5 }
        }
      ]
    },
    {
      id:'s4-distraction', title:'DISTRACTION SHOTS',
      desc:'Learn to see only what matters and ignore what does not.',
      drills:[
        {
          id:'d-distractors', name:'THE DISTRACTORS', accent:'cyan', tags:['MENTAL','DISTRACTION'],
          cure:'Visual distractions can pull your eye away from the critical aiming elements.',
          objective:'Build the ability to maintain focus on the Shot Picture regardless of surrounding balls.',
          steps:[
            'PART A: Set up the 4-ball shot as shown. Play it a couple of times. Now set up the 11-ball and 2-ball (distracters). Shoot the 4-ball again. Did the distracters cause a problem?',
            'PART B: The 7-ball shot in Part B is moderately challenging, made more difficult by four nearby balls. Set up and shoot normally first, then add the distracting balls.'
          ],
          review:'Did you begin to see the distractors as "part of the shot" or were you able to block them out? Blocking them out is the skill.',
          diagram: makeSVG({ portrait:true, balls:[{n:'CB',x:fcp(0.15),y:frp(0.54)},{n:'4',x:fcp(0.78),y:frp(0.28)},{n:'2',x:fcp(0.35),y:frp(0.55)},{n:'CB',x:fcp(0.09),y:frp(0.83)},{n:'7',x:fcp(0.55),y:frp(0.75)},{n:'6',x:fcp(0.30),y:frp(0.88)},{n:'2',x:fcp(0.48),y:frp(0.90)},{n:'14',x:fcp(0.78),y:frp(0.92)}], lines:[{x1:fcp(0.15),y1:frp(0.54),x2:fcp(0.78),y2:frp(0.28),col:'#fff8',w:1},{x1:fcp(0.09),y1:frp(0.83),x2:fcp(0.78),y2:frp(0.92),col:'#fff7',w:1,dash:true},{x1:fcp(0.49),y1:frp(0.68),x2:fcp(0.49),y2:frp(0.98),col:'#fff4',w:1,dash:true}]}),
          scoring:{ type:'hitMissAB', id:'d-distractors', labelA:'PART A', labelB:'PART B', shots:5 }
        },
        {
          id:'d-zen-master', name:'ZEN MASTER DISTRACTION SHOTS', accent:'gold', tags:['MENTAL','CONCENTRATION'],
          cure:'Build Zen-like powers of concentration — see only what you need to see.',
          objective:'Execute shots cleanly in heavily congested visual fields.',
          steps:[
            'PART A — RUNNING THE GAUNTLET: Place CB and OB on donuts. Place several balls along the channel from the CB to the pocket. As close to the edge as you dare. After mastering the basic version, move distractors slightly into the channel.',
            'PART B — CUTTING THROUGH THE FOG: A cut shot where distractors seriously encroach on your field of vision. Every effort must focus on: CB, OB, and pocket only.'
          ],
          review:'The trick is not to ignore the other balls — it is to accept that they have no effect on the shot as long as it is shot down the line to the pocket.',
          diagram: makeSVG({ portrait:true, balls:[{n:'5',x:fcp(0.35),y:frp(0.12)},{n:'9',x:fcp(0.57),y:frp(0.13)},{n:'7',x:fcp(0.72),y:frp(0.17)},{n:'2',x:fcp(0.35),y:frp(0.28)},{n:'10',x:fcp(0.55),y:frp(0.30)},{n:'8',x:fcp(0.22),y:frp(0.40)},{n:'6',x:fcp(0.58),y:frp(0.48)},{n:'CB',x:fcp(0.35),y:frp(0.57)},{n:'3',x:fcp(0.25),y:frp(0.68)},{n:'1',x:fcp(0.17),y:frp(0.70)},{n:'4',x:fcp(0.17),y:frp(0.78)}], shotPics:[{x:fcp(0.13),y:frp(0.18),r:12,dx:0,dy:0},{x:fcp(0.48),y:frp(0.87),r:12,dx:0,dy:0}], lines:[{x1:fcp(0.35),y1:frp(0.57),x2:fcp(0.72),y2:frp(0.17),col:'#fff8',w:1},{x1:fcp(0.35),y1:frp(0.57),x2:fcp(0.17),y2:frp(0.78),col:'#fff8',w:1}]}),
          scoring:{ type:'hitMissAB', id:'d-zen-master', labelA:'RUNNING THE GAUNTLET', labelB:'CUTTING THROUGH FOG', shots:5 }
        }
      ]
    }
  ]
},

/* ═══════════════════════════════════════
   CHAPTER 5 — POSITION PLAY
═══════════════════════════════════════ */
{
  id:'ch05', num:5, title:'Position Play',
  subtitle:'Controlling the cue ball from shot to shot',
  color:'cyan', drillCount:26,
  sections:[
    {
      id:'s5-foundation', title:'FOUNDATION ROUTES',
      desc:'The five primary position routes. The building blocks of all position play.',
      drills:[
        {
          id:'d-follow-shots', name:'THE FOLLOW SHOT', accent:'cyan', tags:['FOLLOW','FOUNDATION'],
          cure:'Follow shots are the most common position route. Mastery of soft follow creates precision position.',
          objective:'Control follow shot distance across all speeds from 2 to 5.',
          steps:[
            'PART A — SOFT FOLLOW SHOTS: Place CB and OB near each other, straight in for Pocket A. Use a half tip of follow. Speed 2 to 4. Shoot 5 shots. Goal: CB barely touches the rail.',
            'PART B — STRAIGHT DOWN THE RAIL: CB and OB aligned for Pocket A. Both near the rail. Use a half tip of follow, Speed 4-5. CB should advance down the rail to the next position.'
          ],
          review:'The key is to develop sensitivity for how follow speed changes with small increments of stroke force.',
          scoring:{ type:'hitMissAB', id:'d-follow-shots', labelA:'PART A (SOFT FOLLOW)', labelB:'PART B (RAIL FOLLOW)', shots:5 }
        },
        {
          id:'d-stop-shots', name:'THE STOP SHOT', accent:'gold', tags:['STOP SHOT','FOUNDATION'],
          cure:'The stop shot is the most precise position tool. Dead center ball, firm stroke.',
          objective:'Execute reliable stop shots at short, medium, and long distance.',
          steps:[
            'PART A — SHORT DISTANCE (1 foot): Dead center hit, firm stroke. CB should stop dead at contact.',
            'PART B — LONG DISTANCE (3-4 feet): Dead center hit, medium stroke. CB stops or barely rolls.',
            'Run 5 shots at each distance. Track clean stops vs. rolls forward or draws back.'
          ],
          review:'A CB that rolls forward means you hit too high. A CB that draws back means you hit below center. Dead center = dead stop.',
          scoring:{ type:'hitMissAB', id:'d-stop-shots', labelA:'SHORT DISTANCE', labelB:'LONG DISTANCE', shots:5 }
        },
        {
          id:'d-draw-shots', name:'THE DRAW SHOT', accent:'red', tags:['DRAW','FOUNDATION'],
          cure:'Draw is one of the most powerful position tools. Learn to control draw distance with speed.',
          objective:'Develop reliable draw control from short to long distance at speeds 4-6.',
          steps:[
            'PART A — SHORT DISTANCE DRAW: CB 2 feet from OB. Use a full tip below center, Medium Soft (4). CB should draw back 1-2 feet. Increase speed each shot to increase draw distance.',
            'PART B — ADDING SPEED: CB is further (65% further from OB). Overcome cloth friction with more speed, same full tip below.',
            'PART C — ANGLED DRAW: CB at a slight cut angle. Draw back to the right. Note: the angled draw path is wider than the straight draw.'
          ],
          review:'Short distance draw is much easier than long distance draw because friction is not yet acting against the draw spin.',
          diagram: makeSVG({ W:340, H:215, pocketLabels:true,
            balls:[
              {n:'CB',x:fc(.5),y:fr(.65)},{n:'1',x:fc(.5),y:fr(.45)},
              {n:'CB',x:fc(.5),y:fr(.85)},{n:'2',x:fc(.5),y:fr(.45)},
              {n:'CB',x:fc(.35),y:fr(.75)},{n:'3',x:fc(.5),y:fr(.45)}
            ],
            labels:[
              {t:'Part A',x:fc(.55),y:fr(.57),col:'#00BFFF',box:true,bw:35},
              {t:'Part B',x:fc(.55),y:fr(.77),col:'#F5C400',box:true,bw:35},
              {t:'Part C',x:fc(.18),y:fr(.72),col:'#FF3D57',box:true,bw:35}
            ]
          }),
          scoring:{ type:'hitMissMulti', id:'d-draw-shots', groups:['PART A (SHORT)', 'PART B (LONG)', 'PART C (ANGLED)'], shots:5 }
        },
        {
          id:'d-half-diamond', name:'THE HALF DIAMOND SHOT', accent:'cyan', tags:['POSITION ROUTE'],
          cure:'The half diamond shot appears repeatedly in almost all pool games. Master it and you have a universal position tool.',
          objective:'Control the half diamond route (into rail, back up table) from multiple positions.',
          steps:[
            'VERSION 1 — INTO THE RAIL WITH DRAW: Use a full tip of draw and a medium speed. CB will head directly into the side rail and back up the table. Mark CB ending positions for CBs 2-5.',
            'VERSION 2 — ACROSS THE TABLE DRAW SHOT: Shot at a slight angle. CB goes across the table via the draw path. Note: the path for CB 5 will be closest to the left side rail.'
          ],
          review:'The half diamond is particularly reliable because the CB is traveling a relatively short distance to the rail before rebounding.',
          scoring:{ type:'hitMissAB', id:'d-half-diamond', labelA:'V1 (INTO RAIL)', labelB:'V2 (ACROSS TABLE)', shots:5 }
        },
        {
          id:'d-stun-shots', name:'STUN SHOTS', accent:'gold', tags:['STUN','POSITION ROUTE'],
          cure:'The stun shot sends the CB predictably to the opposite side of the table — one of the most practical position plays.',
          objective:'Reliably execute the stun shot from three cue ball positions.',
          steps:[
            'Strike the CB in the center and use Medium (5) speed for all three cue ball positions.',
            'CB should hit the target ball from Cue Balls A and B. It will hit rail between the target ball and Pocket B.',
            'From Cue Ball C, the shot requires a stun/follow combination. Note the path difference.'
          ],
          review:'The stun shot is one of the most practical position plays in pool. Once you know it, countless positions simplify dramatically.',
          scoring:{ type:'hitMiss', id:'d-stun-shots', showPct:true }
        },
        {
          id:'d-dead-scratch', name:'THE DEAD SCRATCH', accent:'red', tags:['POSITION ROUTE'],
          cure:'Practice the dead scratch (long stun shot) and you will perfect your stun shot technique.',
          objective:'Make the CB scratch in Pocket A using a stun/follow line — a useful precision drill.',
          steps:[
            'Place a ball one diamond in from the side pocket. Place CB one diamond in from the opposite side.',
            'Strike the CB dead center, Medium Hard (6) or higher. After contact, CB follows the tangent line directly into Pocket A.',
            'If you can consistently make the CB scratch from long range, shorter versions become simple.'
          ],
          scoring:{ type:'hitMiss', id:'d-dead-scratch', showPct:true }
        }
      ]
    },
    {
      id:'s5-speed', title:'SPEED CONTROL',
      desc:'The surgeon\'s touch. Fine increments of speed separate good players from great ones.',
      drills:[
        {
          id:'d-zeroing-in', name:'ZEROING IN', accent:'cyan', tags:['SPEED CONTROL'],
          cure:'Inability to judge fine speed differences prevents precision position play.',
          objective:'Develop sensitivity to small speed increments within the Speed 4-6 range.',
          steps:[
            'Place CB on the head string, OB at the foot spot. Shoot a follow shot.',
            'Start with Speed 4. Mark CB ending location.',
            'Add a tiny amount of speed each shot. Record where CB stops each time.',
            'Goal: 5 equally spaced CB endings between start and end rail.'
          ],
          review:'If your speed jumps instead of progressing smoothly, your stroke is inconsistent. Focus on feeling the acceleration change, not just striking harder.',
          scoring:{ type:'hitMiss', id:'d-zeroing-in', showPct:true, label:'CB LANDS IN ZONE' }
        },
        {
          id:'d-piano-scales', name:'PIANO SCALES', accent:'gold', tags:['SPEED CONTROL'],
          cure:'Speed control is like a musical scale — it must be practiced in sequence to develop precise gradation.',
          objective:'Build fine speed control by playing sequences of equally spaced distance shots.',
          steps:[
            'Place 7 target balls in a line down the center of the table, spaced one diamond apart.',
            'From CB position, shoot follow shots to hit each target ball in sequence.',
            'The ball furthest away requires Speed 5, the closest requires Speed 2.',
            'Try to make each target ball land exactly on the next one\'s position marker.'
          ],
          review:'Like piano scales, the value is not in this specific exercise but in developing smooth gradations across the full speed range.',
          scoring:{ type:'hitMiss', id:'d-piano-scales', showPct:true, label:'ON TARGET' }
        },
        {
          id:'d-surgeons-touch', name:"THE SURGEON'S TOUCH", accent:'red', tags:['SPEED CONTROL','ADVANCED'],
          cure:'Top players can place the cue ball anywhere within 4 inches of a target. This precision separates B+ from A players.',
          objective:'Control soft shot position to the pocket speed — the minimum force needed.',
          steps:[
            'PART A — SOFT CUT AT POCKET SPEED: Set up a thin cut. Use just enough speed to get the OB into the front of the pocket. Any faster and position suffers.',
            'PART B — THIN CUT POCKET HANGERS: A pocket hanger. Use a very soft stroke. These shots test your ability to be gentle under pressure.',
            'PART C — SCRATCH IF YOU CAN: Pocket the ball extremely thin and get enough draw spin to reverse the CB back up the table. Speed: Medium Soft (4).'
          ],
          scoring:{ type:'hitMissMulti', id:'d-surgeons-touch', groups:['PART A (POCKET SPEED)', 'PART B (HANGERS)', 'PART C (THIN + DRAW)'], shots:5 }
        }
      ]
    },
    {
      id:'s5-cueaftercontact', title:'CUE BALL AFTER CONTACT',
      desc:'Phase 4: The path of the cue ball after contact is the key to position play mastery.',
      drills:[
        {
          id:'d-angle-departure', name:'THE ANGLE OF DEPARTURE', accent:'cyan', tags:['CB PATH','POSITION'],
          cure:'Understanding the 90-degree rule and how cut angle determines CB direction.',
          objective:'Experience and internalize how the CB\'s departure angle changes with cut angle.',
          steps:[
            'Set up 4 cut shots: 10°, 20°, 30°, 45° cuts. All played with soft follow (Speed 3).',
            'For 10° cut: CB departs at ~100° from the OB\'s path.',
            'For 45° cut: CB departs at ~135° from the OB\'s path.',
            'Mark each CB ending position. Notice the pattern.'
          ],
          review:'The 90-degree rule (for stun shots, CB goes 90° to OB path) is your baseline. Follow adds angle forward, draw reverses it.',
          scoring:{ type:'hitMiss', id:'d-angle-departure', showPct:true, label:'IN POSITION ZONE' }
        },
        {
          id:'d-rebound', name:'THE REBOUND', accent:'gold', tags:['CB PATH','RAILS','POSITION'],
          cure:'Rail rebounds are predictable if you understand how english and speed affect them. Unpredictability comes from not knowing what to expect.',
          objective:'Learn to predict cue ball rebound paths from various angles and speeds.',
          steps:[
            'PART A — STUN REBOUND: The CB hits the rail near Pocket B after a stun shot. Study where it goes.',
            'PART B — FOLLOW REBOUND: Same setup with follow. Note how the CB picks up counterclockwise sidespin at the rail, shortening its rebound angle vs. the theoretical path.',
            'Shoot from multiple positions to map out the differences between stun and follow rebound paths.'
          ],
          review:'The CB never obeys the pure geometry law because it always picks up some sidespin at the rail. Factor this into your position plans.',
          scoring:{ type:'hitMiss', id:'d-rebound', showPct:true, label:'CB IN TARGET ZONE' }
        }
      ]
    },
    {
      id:'s5-multirail', title:'MULTI-RAIL ROUTES',
      desc:'Top pros use 2+ rail position plays on 28% of shots. These routes provide many more options.',
      drills:[
        {
          id:'d-inside-3rail', name:'INSIDE THREE RAILER', accent:'red', tags:['MULTI-RAIL','ADVANCED'],
          cure:'The inside three-railer causes more grief than almost any other shot. Learn it and it disappears as a threat.',
          objective:'Control the inside three-rail route from both typical positions.',
          steps:[
            'The inside three-railer: CB goes into the side rail, then the end rail, then the opposite side rail.',
            'Medium Hard (6) stroke with a half tip of inside english (toward the direction of the cut).',
            'From the position in the diagram, shoot twice to get a feel, then try to send CB to marker position.'
          ],
          review:'Allowing sufficiently for deflection is the main challenge. Inside english counters throw, which is a positive, but deflection compensation is tricky.',
          scoring:{ type:'hitMiss', id:'d-inside-3rail', showPct:true, label:'CB IN ZONE' }
        },
        {
          id:'d-side-3rail', name:'SIDE POCKET 3-RAILER', accent:'cyan', tags:['MULTI-RAIL'],
          cure:'One of the most commonly used multi-rail routes. Appears regularly when the OB is in front of the side pocket.',
          objective:'Control the side pocket 3-rail route to various ending positions.',
          steps:[
            'OB in front of side pocket. CB position as shown.',
            'Use top right english and a medium hard stroke. CB goes: right side rail → end rail → left side rail.',
            'Try stopping CB at Marker A. Then shoot same shot aiming for Marker B (using harder stroke with half tip of follow and no english).',
            'Notice the big difference in the CB\'s path between the two shots.'
          ],
          scoring:{ type:'hitMissAB', id:'d-side-3rail', labelA:'WITH ENGLISH (MARKER A)', labelB:'NO ENGLISH (MARKER B)', shots:5 }
        }
      ]
    },
    {
      id:'s5-advanced', title:'ADVANCED POSITION',
      desc:'Pro-level exercises for the advanced practitioner.',
      drills:[
        {
          id:'d-zig-zag', name:'ZIG ZAG DRILL', accent:'gold', tags:['ADVANCED','POSITION'],
          cure:'Zig zag position play combines follow and draw in alternating sequences — the heart of fluid runout play.',
          objective:'Execute a zig-zag sequence of position plays down the length of the table.',
          steps:[
            'Set 7 balls in a zig-zag pattern down the table, alternating left and right of center.',
            'Play follow on odd-numbered balls to go left. Play draw on even-numbered balls to go right.',
            'Score: 1 point per ball pocketed in correct position. Perfect score = 7.',
            'If you miss position but make the ball, take half a point. If you miss the ball, stop that rack and start again.'
          ],
          review:'Zig-zag patterns appear constantly in Nine Ball. The player who can execute them in sequence while controlling shape has a huge advantage.',
          scoring:{ type:'pointTracker', id:'d-zig-zag', maxPts:7, label:'ZIG ZAG SCORE' }
        },
        {
          id:'d-special-l', name:'THE SPECIAL "L"', accent:'cyan', tags:['ADVANCED','RUNOUT'],
          cure:'The Special L combines position and pattern planning on a deceptively simple-looking layout.',
          objective:'Execute the L runout in order, maintaining shape through the turn.',
          steps:[
            'EASY VERSION: Balls set in L-shape (4 across, then 4 down). Shoot in any order. Score: balls pocketed.',
            'HARD VERSION: Balls must be shot in order as if playing Ten Ball. The hardest part: turning the corner between the 4th and 5th ball.',
            'Score 1 point per ball in the easy version. In the hard version, score only if you complete the full runout.'
          ],
          review:'The Special L is a final exam in position play. To A+ it, you must run the balls without hitting a rail on any position play. A witness required.',
          scoring:{ type:'pointTracker', id:'d-special-l', maxPts:8, label:'L DRILL SCORE' }
        },
        {
          id:'d-pro-target', name:'PRO TARGET BALL', accent:'red', tags:['ADVANCED','POSITION'],
          cure:'If you can consistently hit 3-4 of 6 target balls with a realistic layout, you know position play.',
          objective:'Test position play under realistic Nine Ball conditions.',
          steps:[
            'Place the CB and OB in positions where they might realistically appear in Nine Ball.',
            'Place several numbered balls as targets around the table.',
            'Shoot OB balls 1-6 in order. After each shot, try to land the CB as close to the next OB as possible.',
            'Score 1 point per OB pocketed, 1 point per target ball hit with the CB after the shot.',
            'Maximum score: 12 points (6 makes + 6 CB targets hit).'
          ],
          review:'This exercise brings together pocketing, position, and decision-making in a game-realistic format.',
          scoring:{ type:'pointTracker', id:'d-pro-target', maxPts:12, label:'PRO TARGET SCORE' }
        }
      ]
    }
  ]
},

/* ═══════════════════════════════════════
   CHAPTER 6 — PATTERN PLAY
═══════════════════════════════════════ */
{
  id:'ch06', num:6, title:'Pattern Play',
  subtitle:'Reading and running sequences of balls',
  color:'gold', drillCount:16,
  sections:[
    {
      id:'s6-beginning', title:'BEGINNING PATTERN PLAY',
      desc:'Getting into the right frame of mind for pattern planning and execution.',
      drills:[
        {
          id:'d-prog-a', name:'PROGRAMMING A', accent:'cyan', tags:['PATTERN','NINE BALL'],
          cure:'Starting a runout from unfamiliar positions causes mental freeze. Pre-program your response.',
          objective:'Practice the specific thought process for planning a runout before touching a ball.',
          steps:[
            'Set up the diagram (Nine Ball end game with 4-5 balls). Balls placed as shown.',
            'WHERE is the 8-ball (or key ball)? WHAT is the key ball 2 before it?',
            'Which is the first ball? Which is second? How do they link together?',
            'Plan the complete sequence BEFORE touching any ball.',
            'Execute the plan. Note where position errors occurred.'
          ],
          review:'Programming is a thinking skill. The more layouts you analyze, the faster and more accurate your planning becomes.',
          scoring:{ type:'rackTracker', id:'d-prog-a', racks:5 }
        },
        {
          id:'d-prog-b', name:'PROGRAMMING B', accent:'gold', tags:['PATTERN','EIGHT BALL'],
          cure:'Eight Ball end game positions are decided by planning, not by ball-making ability.',
          objective:'Develop the ability to read and plan Eight Ball end game positions.',
          steps:[
            'Set up the Eight Ball end-game position from the diagram.',
            'Position zone for the 8-ball shot: reasonably narrow (aim accurately).',
            'Identify: 1) The position zone (#1 importance — speed control), 2) Obstacles to avoid (#2), 3) Best first ball and its direction.',
            'Execute the planned sequence. Record balls pocketed.'
          ],
          review:'Speed control is the key component. The other principles played supporting roles. Always rank the principles before shooting.',
          scoring:{ type:'rackTracker', id:'d-prog-b', racks:5 }
        }
      ]
    },
    {
      id:'s6-preset', title:'PRESET LAYOUTS',
      desc:'Recurring patterns that appear regularly in competition. Learn them by heart.',
      drills:[
        {
          id:'d-8ball-endgame', name:'EIGHT-BALL END GAME RUNOUTS', accent:'cyan', tags:['PATTERN','EIGHT BALL'],
          cure:'End game losses in Eight Ball are almost always due to planning failures, not ball-making failures.',
          objective:'Learn to identify the key ball and build the runout sequence from it backwards.',
          setup:'4-5 balls from one group plus the 8-ball. Scatter at random, then mark with donuts.',
          steps:[
            'Place 4 or 5 balls from one group and the 8-ball at random. Mark positions with donuts.',
            'Take ball in hand and choose the best first shot. Know the key ball.',
            'Plan the complete sequence. Know your last shot before the 8-ball.',
            'Execute the plan. Evaluate: where did position break down?',
            'If runout successful, set up a new, harder layout.',
            'Repeat 5 times. Score = number of successful runouts.'
          ],
          review:'The easiest runout is: 6, 5, 3, 1, 8-ball. But the correct sequence for the layout given may be completely different.',
          scoring:{ type:'rackTracker', id:'d-8ball-endgame', racks:5 }
        },
        {
          id:'d-balls-middle', name:'BALLS IN THE MIDDLE', accent:'gold', tags:['PATTERN','ADVANCED'],
          cure:'Balls in the middle area create difficult position plays and demand creative pattern reading.',
          objective:'Practice running layouts where most balls occupy the challenging middle table zone.',
          steps:[
            'Set 15 balls in the rectangular middle area of the table (as shown in diagram).',
            'RANDOM RUNOUT: Run all 15 in any order. Score = balls pocketed before a miss.',
            'NO CONTACT VERSION: Run 15 without hitting another ball. Much harder.',
            'EIGHT BALL: Run solids (1-7) then stripes (9-15) then 8-ball.',
            'Score 1 point per ball in the random version.'
          ],
          review:'When the OB is in the rectangular area covered by other balls, there is a good chance you are facing a difficult position play.',
          scoring:{ type:'rackTracker', id:'d-balls-middle', racks:3 }
        }
      ]
    },
    {
      id:'s6-random', title:'RANDOM LAYOUTS',
      desc:'Adapting pattern play to the unpredictable real-world situations you face in competition.',
      drills:[
        {
          id:'d-doing-cosmo', name:'DOING THE COSMO', accent:'cyan', tags:['PATTERN','RUNOUT'],
          cure:'Many players can run balls from easy layouts but freeze on anything unfamiliar.',
          objective:'Practice running the simplest shots exceptionally well on any layout.',
          steps:[
            'Rack 15 balls. Break. Play from the resulting layout — no reracking.',
            'Run balls in order of easiness. Always choose the simplest next shot.',
            'SCORE: 1 point per ball pocketed in a single run before a miss.',
            'Track the best run per session. Goal: improve your average run over time.'
          ],
          review:'Like a skater doing a flawless routine, Doing the Cosmo means executing the simple shots flawlessly first, then building to the hard shots.',
          scoring:{ type:'rackTracker', id:'d-doing-cosmo', racks:5 }
        },
        {
          id:'d-runout-power', name:'BUILDING YOUR RUNOUT POWER', accent:'gold', tags:['RUNOUT','SELF-ASSESSMENT'],
          cure:'You cannot improve your runout game unless you have an honest measure of it.',
          objective:'Establish your current runout ability using the Capelle runout scale.',
          steps:[
            'Play a rack of Nine Ball. Run as far as possible before missing.',
            'Track how many balls you ran before the rack ended.',
            'After 5 racks, identify your average runout.',
            'Use the scale: Last 3=C/C, Last 4=C+, Last 5=B-, Last 6=B, Last 7=B+, Last 8=A-, All 9=A/A+.'
          ],
          review:'A 640 Fargo should average Last 4-5 consistently. A 750 Fargo should average Last 6-7. This gives you a concrete target.',
          scoring:{ type:'rackTracker', id:'d-runout-power', racks:5 }
        }
      ]
    },
    {
      id:'s6-advanced', title:'ADVANCED PATTERN PLAY',
      desc:'PEP (Process of Elimination Planning) and the most difficult layouts.',
      drills:[
        {
          id:'d-pep', name:'RUNNING OUT IN SECTIONS USING PEP', accent:'red', tags:['ADVANCED','PEP'],
          cure:'PEP (Process of Elimination Planning) is the fastest way to analyze a Nine Ball rack for a runout.',
          objective:'Learn and apply the three-step PEP process to any Nine Ball layout.',
          steps:[
            'STEP 1 — WHERE IS THE 8-BALL? What is the Key Ball 2 (KB2)? These define the ending.',
            'STEP 2 — WHAT IS THE FIRST BALL? What is the second? How can you "tie the beginning and end together" using the remaining balls?',
            'STEP 3 — HOW CAN YOU TIE THE BEGINNING AND END TOGETHER using the remaining balls?',
            'Apply PEP to the layout in the diagram. Time yourself — how fast can you plan it?'
          ],
          review:'In the example: 8-ball goes to Pocket F. KB2 is the 2-ball. Start with the 1-ball to build the bridge.',
          scoring:{ type:'rackTracker', id:'d-pep', racks:5 }
        },
        {
          id:'d-nine-patterns', name:'NINE-BALL PATTERNS IN A PATTERN', accent:'cyan', tags:['NINE BALL','ADVANCED'],
          cure:'Every Nine Ball rack has 2-3 "mini-patterns" within the full sequence. Identify them and link them with Linking Balls.',
          objective:'Learn to see the sub-patterns within a Nine Ball rack.',
          steps:[
            'Study Diagram 1: identify the 3 mini-patterns and the Linking Ball between each.',
            'In Diagram 2: the 3-ball is the Linking Ball. After pocketing the 2-ball, use the 3-ball to set up the next mini-pattern.',
            'In Diagram 3: the 6-ball is the Linking Ball. Use it to bridge the end of the second pattern to the final pattern.',
            'Apply this analysis to 5 live racks. Score: number of racks where you correctly identified all patterns before shooting.'
          ],
          scoring:{ type:'rackTracker', id:'d-nine-patterns', racks:5 }
        },
        {
          id:'d-vertical-axis', name:'VERTICAL AXIS ONLY', accent:'gold', tags:['ADVANCED','NO ENGLISH'],
          cure:'Playing without english forces you to use precision position routes based on speed and angle alone.',
          objective:'Run a complete rack of Eight Ball (or Nine Ball) without using any english.',
          steps:[
            'VERTICAL AXIS ONLY — PART A: Run solids in Eight Ball without any side spin. Use only follow, draw, and stun. Score: balls pocketed before a miss.',
            'VERTICAL AXIS ONLY — PART B: Send the CB back up the table for each position play. A 1-rail follow shot does the job. No english allowed.',
            'SUPER ADVANCED VERSION: An open rack of Eight Ball, balls at random. No english. Track runout length.'
          ],
          review:'Many shots that seem to require english can be played with pure vertical axis cueing and correct speed. This exercise reveals all of them.',
          scoring:{ type:'rackTracker', id:'d-vertical-axis', racks:3 }
        }
      ]
    }
  ]
},

/* ═══════════════════════════════════════
   CHAPTER 7 — SAFETY PLAY
═══════════════════════════════════════ */
{
  id:'ch07', num:7, title:'Safety Play',
  subtitle:'Turning losses into victories through precision defense',
  color:'green', drillCount:18,
  sections:[
    {
      id:'s7-basics', title:'THE 5 BASIC SAFETIES',
      desc:'The fundamental safety patterns that appear in every game.',
      drills:[
        {
          id:'d-5-basics', name:'THE 5 BASIC HITS', accent:'cyan', tags:['SAFETY','BASICS'],
          cure:'Most B-level players know only 1-2 types of safeties. Expanding your defensive vocabulary is an immediate win.',
          objective:'Learn and practice all 5 basic safety hit types.',
          steps:[
            'SAFETY 1 — FULL BALL HIT: Contact OB full in the face. OB travels to end rail. CB stops near original OB position or slightly beyond.',
            'SAFETY 2 — HALF BALL HIT: Contact OB half-and-half. OB goes ~45° from line. CB deflects the opposite direction.',
            'SAFETY 3 — THIN HIT: Contact OB at ~1/4 or thinner. OB barely moves, CB continues forward.',
            'SAFETY 4 — DOUBLE KISS AVOIDANCE: Plan the shot so CB does not follow OB into trouble.',
            'SAFETY 5 — FOLLOW THE PATHWAY: CB follows a rail path behind an obstacle ball.'
          ],
          review:'Memorize all 5. In competition, having 5 options versus 2 options gives you 2-3x the safety opportunities per game.',
          scoring:{ type:'checklist', id:'d-5-basics', items:['Safety 1: Full ball hit (practiced)','Safety 2: Half ball hit (practiced)','Safety 3: Thin hit (practiced)','Safety 4: Double kiss avoidance (practiced)','Safety 5: Follow the pathway (practiced)'] }
        },
        {
          id:'d-off-rail', name:'OFF THE RAIL AND INTO JAIL', accent:'gold', tags:['SAFETY','CB CONTROL'],
          cure:'Safeties that send the CB behind the OB after it comes off a rail create two-way traps.',
          objective:'Execute the rail safety — send OB to far rail while CB rolls behind obstacle.',
          steps:[
            'Place OB near the long rail. CB in position to play a safety.',
            'Hit OB with a follow stroke, using right english if CB is left of center. OB goes to far rail. CB follows rail backward.',
            'Goal: CB comes to rest behind the cluster of balls at center table.',
            'Run 5 attempts from the positions shown.'
          ],
          scoring:{ type:'hitMiss', id:'d-off-rail', showPct:true, label:'SUCCESSFUL SAFETIES' }
        }
      ]
    },
    {
      id:'s7-skills', title:'SAFETY SKILLS',
      desc:'Advanced safety techniques for the serious player.',
      drills:[
        {
          id:'d-skimming', name:'SKIMMING THE CREAM', accent:'cyan', tags:['SAFETY SKILLS','THIN HIT'],
          cure:'The ability to shave the edge of the object ball is a skill that separates good defensive players from great ones.',
          objective:'Master the thin hit safety at short, medium, and long range.',
          steps:[
            'PART A — SHORT VERSION: Hit the 1-ball a thousandth thin. CB should strike the rail at Position A. OB goes into the 2-ball as a target marker.',
            'PART B — LONGER VERSION: Same concept from 2 diamonds back. If you can consistently hit the 3-ball target, you are doing excellent work.',
            'PART C — THE FAN VERSION: CB hits the 1-ball a thousandth thin and proceeds as close to parallel with the rail as possible.',
            'Run 5 from each position. Track how many CB lands behind the 2-ball marker.'
          ],
          review:'The target ball is both a marker for aim and an indicator of success. If you hit the target on most attempts, you are already a skilled safety player.',
          scoring:{ type:'hitMissMulti', id:'d-skimming', groups:['PART A (SHORT)', 'PART B (LONGER)', 'PART C (PARALLEL)'], shots:5 }
        },
        {
          id:'d-thin-hit', name:'THE THIN HIT DIVERSION', accent:'gold', tags:['SAFETY SKILLS'],
          cure:'The thin hit sends the OB away, the CB goes in a completely different direction — a two-way shot.',
          objective:'Use thin hit technique to simultaneously hide the CB and send OB to safety.',
          steps:[
            'PART A: Hit OB very thin (less than 1/8 ball). OB barely moves. CB continues forward into rail.',
            'PART B: A slightly thicker hit where CB stops near the OB. OB rolls a short distance.',
            'In both cases, the goal is: opponent faces a difficult or impossible shot.'
          ],
          scoring:{ type:'hitMissAB', id:'d-thin-hit', labelA:'PART A (ULTRA THIN)', labelB:'PART B (THIN+STOP)', shots:5 }
        },
        {
          id:'d-chess-pieces', name:'MOVING THE CHESS PIECES', accent:'red', tags:['SAFETY SKILLS','ADVANCED'],
          cure:'The best safeties move both balls — yours ends up hidden, theirs ends up awkward.',
          objective:'Develop the ability to control both the OB and CB in a single defensive shot.',
          steps:[
            'PART A: First shot — play a soft crossover bank to send the 1-ball a diamond up from Pocket F. CB comes to rest near center table. Run from 3 different positions as shown.',
            'PART B: Bank the 1-ball into each target ball (2, 3, 4-balls positioned as targets) as softly as possible.',
            'Score: 1 point per successful OB placement, 1 point per CB in good defensive position.'
          ],
          review:'The ability to move specific balls to specific locations on safeties is a particularly valuable skill in Eight Ball.',
          scoring:{ type:'hitMissMulti', id:'d-chess-pieces', groups:['PART A (CROSSOVER)', 'PART B (TARGET BANK)'], shots:5 }
        },
        {
          id:'d-ob-distance', name:'OBJECT BALL DISTANCE CONTROL', accent:'cyan', tags:['SAFETY SKILLS'],
          cure:'Failing to control the OB\'s ending position is the most common safety error.',
          objective:'Land the OB consistently in a specific target zone across multiple safety shots.',
          steps:[
            'Set up 5 different safety scenarios. For each, define a target zone for the OB.',
            'Execute the safety. Did the OB land in the target zone?',
            'Common targets: frozen to end rail, frozen to side rail, in a cluster, behind the 8-ball.',
            'Track success rate across 5 attempts per scenario.'
          ],
          scoring:{ type:'hitMiss', id:'d-ob-distance', showPct:true, label:'OB IN TARGET ZONE' }
        }
      ]
    },
    {
      id:'s7-finesse', title:'FINESSE SAFETIES',
      desc:'Float and hook — the elite level of safety play.',
      drills:[
        {
          id:'d-float-hook', name:'FLOAT AND HOOK', accent:'gold', tags:['FINESSE','ADVANCED'],
          cure:'Float and hook safeties place CB behind an obstacle so precisely that opponent has no viable shot.',
          objective:'Execute precision hook safeties from the positions in the exercise.',
          steps:[
            'PART A — FLOAT: CB travels to end rail and floats back, stopping precisely behind a specific ball.',
            'PART B — HOOK: CB travels around an obstacle ball and comes to rest behind it, leaving no legal shot for opponent.',
            'Run 5 attempts each. Score: number where opponent would truly have no shot.'
          ],
          scoring:{ type:'hitMissAB', id:'d-float-hook', labelA:'FLOAT', labelB:'HOOK', shots:5 }
        },
        {
          id:'d-split-atom', name:'SPLIT THE ATOM', accent:'red', tags:['FINESSE','ADVANCED'],
          cure:'The most precise safety: send the OB between two tightly packed balls. Almost impossible to return from.',
          objective:'Execute the atom split — sending the OB into a narrow gap between two closely packed balls.',
          steps:[
            'Place two balls 2-3 inches apart near the end rail. These are the "atom."',
            'CB must send OB into the gap between them. If executed correctly, opponent faces an impossible shot.',
            'Use a thin hit with precise aim on the OB. Speed: Medium Soft (4).',
            'Run 5 attempts. Score: number where OB actually splits the atom.'
          ],
          review:'This shot requires exceptional thin-hit precision. Start with a wider gap and gradually reduce it as your skill improves.',
          scoring:{ type:'hitMiss', id:'d-split-atom', showPct:true, label:'ATOM SPLITS' }
        }
      ]
    }
  ]
},

/* ═══════════════════════════════════════
   CHAPTER 8 — KICKING PRACTICE
═══════════════════════════════════════ */
{
  id:'ch08', num:8, title:'Kicking Practice',
  subtitle:'Hit the ball. Don\'t give your opponent ball in hand.',
  color:'red', drillCount:12,
  sections:[
    {
      id:'s8-short', title:'SHORT RAIL MASTERY',
      desc:'Close-range kick shots. The foundation of the kicking game.',
      drills:[
        {
          id:'d-short-rail', name:'SHORT RAIL MASTERY', accent:'cyan', tags:['KICKING','SHORT RAIL'],
          cure:'A hundred times easier to kick a ball parked within a ball\'s width of the rail than one out in the open.',
          objective:'Master kick shots to balls frozen or near-frozen to the rail.',
          steps:[
            'PART A: Place 7 balls in a row near the long rail. CB at various positions.',
            'Kick for Ball 1 first, then 2, etc. One ball on the table at a time.',
            'Try to be as precise as possible — these should be easy.',
            'From CB positions A, B, C — repeat the exercise.',
            'PART B: Object balls are near the side pockets. Kick from CB C going rail-first.'
          ],
          diagram: makeSVG({ W:340, H:215,
            balls:[
              {n:'1',x:fc(.1),y:fr(.05)},{n:'2',x:fc(.22),y:fr(.05)},{n:'3',x:fc(.34),y:fr(.05)},
              {n:'4',x:fc(.46),y:fr(.05)},{n:'5',x:fc(.58),y:fr(.05)},{n:'6',x:fc(.7),y:fr(.05)},
              {n:'7',x:fc(.82),y:fr(.05)},
              {n:'CB',x:fc(.2),y:fr(.85)},{n:'CB',x:fc(.5),y:fr(.85)},{n:'CB',x:fc(.8),y:fr(.85)}
            ],
            labels:[{t:'A',x:fc(.18),y:fr(.92),col:'#aaa'},{t:'B',x:fc(.48),y:fr(.92),col:'#aaa'},{t:'C',x:fc(.78),y:fr(.92),col:'#aaa'}]
          }),
          scoring:{ type:'hitMissAB', id:'d-short-rail', labelA:'PART A (LONG RAIL)', labelB:'PART B (SIDE POCKET)', shots:7 }
        },
        {
          id:'d-english-pickup', name:'ENGLISH PICK UP', accent:'gold', tags:['KICKING','ENGLISH'],
          cure:'The angle of incidence equals the angle of reflection — in theory. English changes this law dramatically.',
          objective:'Learn to use english to widen or narrow kick shot angles.',
          steps:[
            'Kick the 1-ball from CB position. Note where it goes.',
            'Place a marker at the rebound point. Now kick with a half tip of running english (english that widens the angle).',
            'Note how much the rebound angle changed.',
            'Practice from all 5 positions shown (A-E at 30°, 40°, 45°, 50°, 60°). Running english allows you to make kicks you cannot make with center ball.'
          ],
          scoring:{ type:'hitMissMulti', id:'d-english-pickup', groups:['30°','45°','60°'], shots:5 }
        }
      ]
    },
    {
      id:'s8-advanced', title:'ADVANCED KICKS',
      desc:'Long rail kicks, corner pocket gaps, and real-world kick scenarios.',
      drills:[
        {
          id:'d-corner-gap', name:'THE CORNER POCKET GAP', accent:'cyan', tags:['KICKING','CORNER'],
          cure:'The corner pocket gap makes many kick shots to near-corner balls surprisingly difficult.',
          objective:'Learn to navigate the corner pocket gap using reverse english.',
          steps:[
            'Ball near the corner. Direct kick on Path A would miss because of the corner pocket gap.',
            'You must use reverse (inside) english to change the CB\'s direction at the rail and bypass the pocket.',
            'Reverse english: aim slightly fuller on the OB, use inside english to bring CB onto Path B.',
            'Practice from 3 positions. Track how many successful kicks (contact the OB).'
          ],
          review:'Reversing the CB\'s direction with inside english is a necessary skill for kick shots near corner pockets.',
          scoring:{ type:'hitMiss', id:'d-corner-gap', showPct:true, label:'CONTACT KICKS' }
        },
        {
          id:'d-stick-hook', name:'STICK AND HOOK', accent:'gold', tags:['KICKING','STRATEGY'],
          cure:'When the OB is close to the rail, the kick shot becomes partially strategic. Hit it cleanly and park the CB.',
          objective:'Learn to kick cleanly when OB is close to rail AND control the CB afterward.',
          steps:[
            'PART A: OB close to rail. Use Medium Hard stroke, half tip of follow from CB positions A, B, and C. CB should stop near dead after OB contact, or head to opposite end.',
            'PART B: Two-rail kick. OB near rail, go two rails to hit it from the back side. CB will stop after contact because OB absorbs most energy.'
          ],
          scoring:{ type:'hitMissAB', id:'d-stick-hook', labelA:'PART A (RAIL KICK)', labelB:'PART B (2-RAIL)', shots:5 }
        },
        {
          id:'d-treadmill', name:'THE TREADMILL', accent:'red', tags:['KICKING','DRILL'],
          cure:'Builds systematic kicking ability across all angles and distances.',
          objective:'Practice kicking from 8 progressively harder positions.',
          steps:[
            'Place the 8-ball near Pocket F (bottom right). CB positions 1-8 progress around the table.',
            'Kick the 8-ball from each position using appropriate strategy.',
            'Position 1 (closest, easiest) to Position 8 (longest, hardest).',
            'Score 1 point for each successful kick. Maximum: 8 points per round.',
            'Advanced: Try 3 consecutive rounds and track total score (max 24).'
          ],
          review:'The kick shot to the 8-ball is one of the most troublesome shots in Nine Ball. Mastering it is a significant advantage.',
          scoring:{ type:'pointTracker', id:'d-treadmill', maxPts:8, label:'TREADMILL SCORE' }
        },
        {
          id:'d-real-kicks', name:'REAL WORLD KICK SHOTS', accent:'cyan', tags:['KICKING','GAME SIMULATION'],
          cure:'Isolated kick drills don\'t capture the pressure of game-situation kicks.',
          objective:'Practice game-realistic kick scenarios that simulate actual competition situations.',
          steps:[
            'Set up situations where you are snookered behind a ball.',
            'Case 1: OB behind a cluster. Kick to hit it and leave CB in safe position.',
            'Case 2: OB near far corner. Must kick from close range, long distance.',
            'Case 3: OB in traffic. Kick to hit it and avoid leaving position for opponent.',
            'Rate each kick: 1=Missed OB, 2=Hit OB but left easy shot, 3=Hit OB and left safe.'
          ],
          scoring:{ type:'qual', id:'d-real-kicks', labels:{ 1:'MISSED OB', 2:'HIT OB/LEFT EASY', 3:'HIT OB/LEFT SAFE' } }
        }
      ]
    }
  ]
},

/* ═══════════════════════════════════════
   CHAPTER 9 — BREAK SHOT PRACTICE
═══════════════════════════════════════ */
{
  id:'ch09', num:9, title:'Break Shot Practice',
  subtitle:'Power, precision, and cue ball control on the break',
  color:'gold', drillCount:10,
  sections:[
    {
      id:'s9-basics', title:'BREAK FUNDAMENTALS',
      desc:'Understanding break shot mechanics before practicing them.',
      drills:[
        {
          id:'d-break-decision', name:'SHOULD I PRACTICE THE BREAK?', accent:'cyan', tags:['BREAK','REFERENCE'],
          cure:'Break shot practice is either a great expenditure of practice time or a complete waste — it depends entirely on your level.',
          objective:'Make an honest decision about whether break practice is appropriate for your current level.',
          steps:[
            'C to C+ Players: You are better off practicing other skills. When you become a runout player, then practice the break.',
            'B- to B Players: If your main strength is the ability to run out at least occasionally, spend time on the break.',
            'B+ to A+ Players: A good break separates you from the pack. The break is worth significant practice investment.'
          ],
          review:'Fargo 640: You are in the B- to B range. Break practice is appropriate — perhaps 10-15 minutes per session on break mechanics.',
          tip:'Phil says: Practicing break shots is either a great expenditure of your practice or a complete waste. It all depends on your level of skill.',
          scoring:{ type:'qual', id:'d-break-decision', labels:{ 1:'C LEVEL — SKIP BREAK PRACTICE', 2:'B LEVEL — SOME BREAK WORK', 3:'B+ LEVEL — REGULAR BREAK WORK' } }
        },
        {
          id:'d-sp-break', name:'STRAIGHT POOL BREAK PRACTICE', accent:'gold', tags:['BREAK','STRAIGHT POOL'],
          cure:'Straight Pool break shots require precision over power — the opposite of Nine Ball.',
          objective:'Learn the Straight Pool safety break shot and execute it reliably.',
          steps:[
            'Place CB near head rail on the side opposite your designated pocket.',
            'Use Medium Hard (6) speed. Aim at 1/3 of the rack from the side. CB should follow Path A.',
            'Goal: hit 2 balls (front-rack ball and 1 other), CB returns to safe area near head rail.',
            'If CB stops short of head rail, you hit too softly. If CB goes past and into traffic, too hard.'
          ],
          review:'Speed of Stroke Study: Most Straight Pool breaks are played at Speed 6 (Medium Hard) — 40% of the time. Hard (7) = 20%. Medium (5) = 20%.',
          scoring:{ type:'hitMiss', id:'d-sp-break', showPct:true, label:'BREAK TO SAFE ZONE' }
        }
      ]
    },
    {
      id:'s9-nineball', title:'NINE BALL BREAK',
      desc:'Power and precision on the Nine Ball break shot.',
      drills:[
        {
          id:'d-break-angles', name:'BREAK SHOT ANGLES', accent:'cyan', tags:['BREAK','NINE BALL'],
          cure:'The angle you approach the rack from determines whether you make balls and where the CB ends up.',
          objective:'Master break shots from the three most common Nine Ball break positions.',
          steps:[
            'POSITION A (Side Rail): Use Medium Hard (6). Aim about 1/3 of the diamond from the pocket corner. This is the standard Nine Ball break.',
            'POSITION B (Slight Angle): Uses shallow cut angle. Requires firm stroke. CB escapes from the rack area.',
            'POSITION C (From Center): Shoot with Hard (7). Pure power break. Goal: drive two corner balls into corner pockets.'
          ],
          review:'The goal of the Nine Ball break is to drive the two corner balls to the rails and back. If they go in, bonus. The CB should end up near center table.',
          diagram: makeSVG({ W:340, H:215, pocketLabels:true,
            balls:[
              {n:'1',x:fc(.5),y:fr(.2)},{n:'2',x:fc(.44),y:fr(.27)},{n:'3',x:fc(.56),y:fr(.27)},
              {n:'4',x:fc(.38),y:fr(.34)},{n:'9',x:fc(.5),y:fr(.34)},{n:'5',x:fc(.62),y:fr(.34)},
              {n:'6',x:fc(.44),y:fr(.41)},{n:'7',x:fc(.56),y:fr(.41)},{n:'8',x:fc(.5),y:fr(.48)}
            ],
            labels:[{t:'A',x:fc(.1),y:fr(.92)},{t:'B',x:fc(.25),y:fr(.92)},{t:'C',x:fc(.5),y:fr(.92)}]
          }),
          scoring:{ type:'hitMissMulti', id:'d-break-angles', groups:['POSITION A', 'POSITION B', 'POSITION C'], shots:5 }
        },
        {
          id:'d-follow-back-out', name:'FOLLOW BACK OUT', accent:'gold', tags:['BREAK','CB CONTROL'],
          cure:'CB control on the break determines whether you have a shot after. Learning to send CB back out is crucial.',
          objective:'Consistently execute a break where the CB follows back toward center table.',
          steps:[
            'Break from the side rail with Medium Hard (6) stroke and top-left (inside) english.',
            'CB hits the rack and follows the exit path back through center table.',
            'Goal: CB ends up somewhere in the center third of the table — not scratching, not hiding behind balls.',
            'Allow for deflection by aiming slightly fuller on the hit.'
          ],
          scoring:{ type:'hitMiss', id:'d-follow-back-out', showPct:true, label:'CB TO CENTER TABLE' }
        },
        {
          id:'d-1pocket-break', name:'1-POCKET BREAK SHOT', accent:'red', tags:['BREAK','1-POCKET'],
          cure:'The 1-Pocket break is entirely about sending two corner balls to the rails and controlling the CB position.',
          objective:'Execute the 1-Pocket break with reliable CB and corner ball control.',
          steps:[
            'CB placed near the rail on the side opposite the breaker\'s designated pocket.',
            'Use Medium Soft (4) stroke with a half tip of inside english.',
            'Aim at the second ball behind the head ball (not the head ball directly).',
            'CB should follow a similar path to the diagram and stop at or near Position X.',
            'Run 5 breaks from each preferred side.'
          ],
          review:'The 1-Pocket break is worth significant practice time because every player in 1-Pocket has a break responsibility.',
          scoring:{ type:'hitMissAB', id:'d-1pocket-break', labelA:'LEFT SIDE', labelB:'RIGHT SIDE', shots:5 }
        }
      ]
    }
  ]
},

/* ═══════════════════════════════════════
   CHAPTER 10 — SCORING GAMES
═══════════════════════════════════════ */
{
  id:'ch10', num:10, title:'Scoring Games',
  subtitle:'Games that measure your improvement objectively',
  color:'cyan', drillCount:12,
  sections:[
    {
      id:'s10-ghost', title:'PLAY THE GHOST',
      desc:'Practice games designed to simulate competition pressure with measurable scores.',
      drills:[
        {
          id:'d-ghost-nine', name:'PLAY THE GHOST — NINE BALL', accent:'cyan', tags:['GHOST BALL','NINE BALL'],
          cure:'Solo practice with no pressure metric does not prepare you for competition pressure.',
          objective:'Play a match against "the ghost" — an invisible opponent who wins every rack you do not run out.',
          setup:'Rack Nine Balls. Break. Play the rack exactly as if in a real match. The Ghost wins every rack you do not run out in a single inning. First to 5 racks wins.',
          steps:[
            'Rack Nine Balls and break.',
            'If you miss — The Ghost wins that rack. Next player breaks.',
            'If you run out — You win that rack.',
            'First to 5 racks wins the match.',
            'Track your win/loss record over multiple matches.'
          ],
          review:'Ghost Scorecard: Record racks run, balls made, position misses, and shot misses. Calculate your "balls made / total possible balls" percentage.',
          scoring:{ type:'ghostGame', id:'d-ghost-nine' }
        },
        {
          id:'d-ghost-eight', name:'PLAY THE GHOST — EIGHT BALL', accent:'gold', tags:['GHOST BALL','EIGHT BALL'],
          cure:'Eight Ball runout practice against a "ghost" opponent creates more productive solo practice than hitting balls randomly.',
          objective:'Play Eight Ball solo with a score to improve.',
          steps:[
            'Rack 15 balls. Break.',
            'Choose solids or stripes after the break (don\'t "call" on the break).',
            'Run your group completely, then the 8-ball. If successful: you win.',
            'Miss for any reason: The Ghost wins that rack.',
            'Play to 5 racks. Track win percentage over multiple sessions.'
          ],
          scoring:{ type:'ghostGame', id:'d-ghost-eight' }
        }
      ]
    },
    {
      id:'s10-kickpool', title:'KICK POOL',
      desc:'A game designed to improve your kicking skill with competitive pressure.',
      drills:[
        {
          id:'d-kick-pool', name:'KICK POOL', accent:'red', tags:['KICK POOL','GAME'],
          cure:'Kick Pool puts competitive pressure on kick shots — the only way to truly improve under pressure.',
          objective:'Play a game of Kick Pool to sharpen your kicking under simulated competition.',
          setup:'Rules of Kick Pool:\n• Rack balls as in Nine Ball.\n• You can shoot any ball at any time.\n• Break the rack wide open. If a ball is made on break, it is spotted.\n• The way you score is to pocket balls on kick shots only.\n• First player to 5 wins.',
          steps:[
            'Always play kick shots into a designated pocket.',
            'Kick shots must be made into the designated pocket to score.',
            'No penalty for failure to hit ball (unlike in regular pool).',
            'One point penalty for scratching. Opponent gets ball in hand anywhere.'
          ],
          review:'This game teaches you to assess which kick shots are "on" and which to avoid — the key strategic skill in kicking.',
          scoring:{ type:'pointTracker', id:'d-kick-pool', maxPts:5, label:'KICK POOL SCORE' }
        },
        {
          id:'d-soft-touch', name:'SOFT TOUCH INCREMENTS CONTEST', accent:'cyan', tags:['SPEED CONTROL','GAME'],
          cure:'The surgeon\'s touch (ultra-fine speed control) is the skill that makes champion position players.',
          objective:'Score as many points as possible by hitting the cue ball further each shot.',
          setup:'Place the cue ball on the head string. Object is to hit the cue ball a little further on each successive attempt until it finally hits the end rail.',
          steps:[
            'Score 1 point each time the CB exceeds the previous shot.',
            'Lose 1 point when the CB comes up short of the previous shot.',
            'When the CB reaches the end rail, your turn is over.',
            'Score = the number of points accumulated prior to your last shot.',
            'Average score of most players: 8-15 points. Phil\'s score: 22.'
          ],
          review:'The first few shots pack closely (first diamond). Increments widen as speed increases. When the CB reaches the third square, don\'t get greedy.',
          scoring:{ type:'pointTracker', id:'d-soft-touch', maxPts:22, label:'SOFT TOUCH SCORE' }
        }
      ]
    },
    {
      id:'s10-games', title:'MORE SCORING GAMES',
      desc:'Additional games for measuring and improving specific skills.',
      drills:[
        {
          id:'d-straight-pool', name:'STRAIGHT POOL GAME', accent:'gold', tags:['STRAIGHT POOL','GAME'],
          cure:'Straight Pool is the ultimate measuring stick for all pool skills combined.',
          objective:'Track your high run and average run in Straight Pool over multiple sessions.',
          steps:[
            'Rack 15 balls. Break safety (Straight Pool break).',
            'Play until you miss or get ball in hand.',
            'When only 1 ball remains, rack the other 14.',
            'Track: High run this session, total balls pocketed, number of innings.',
            'Calculate average run: total balls / number of innings.'
          ],
          review:'Fargo 640 target: Average run of 3-5 per inning. High run of 10-20 per session. These metrics improve directly with better fundamentals and position.',
          scoring:{ type:'pointTracker', id:'d-straight-pool', maxPts:150, label:'HIGH RUN' }
        },
        {
          id:'d-backgammon-8ball', name:'BACKGAMMON EIGHT BALL', accent:'red', tags:['EIGHT BALL','GAME'],
          cure:'A scoring game that rewards both runout ability and safety play.',
          objective:'Play Backgammon Eight Ball and track your score improvement.',
          steps:[
            'Rules: Rack 15 balls. Break. Play Eight Ball with standard rules.',
            'SCORING: Win the rack = 1 point. Win without opponent pocketing any balls = 2 points (gammon). Win before opponent pockets 8-ball = 3 points (backgammon).',
            'Play to 7 points.',
            'Penalty: Scratching on 8-ball = opponent wins the rack (scored as 1).'
          ],
          review:'Backgammon scoring rewards dominant wins and penalizes safe-but-slow play. Track your average score per rack over time.',
          scoring:{ type:'pointTracker', id:'d-backgammon-8ball', maxPts:7, label:'BACKGAMMON SCORE' }
        }
      ]
    }
  ]
},

/* ═══════════════════════════════════════
   CHAPTER 11 — PRACTICING WITH A PARTNER
═══════════════════════════════════════ */
{
  id:'ch11', num:11, title:'Practicing with a Partner',
  subtitle:'Games and drills that are best done with a training partner',
  color:'gold', drillCount:8,
  sections:[
    {
      id:'s11-partner', title:'PARTNER DRILLS',
      desc:'How to make the most of time with a training partner.',
      drills:[
        {
          id:'d-nine-analysis', name:'NINE BALL ANALYSIS', accent:'cyan', tags:['ANALYSIS','PARTNER'],
          cure:'Without analysis, partner practice is just playing pool. With analysis, it becomes coaching.',
          objective:'Study and analyze a partner\'s game, then receive the same analysis in return.',
          steps:[
            'Watch the first 5 turns of your partner\'s game without comment.',
            'After each turn, note: Did the run end because of a missed shot, missed position, or incorrect pattern?',
            'After 5 turns: discuss findings. Be specific: "On the 4-ball in rack 2, the position on the 5-ball..."',
            'Partner returns the same service to you.',
            'Use the 5 questions for Eight Ball analysis after each rack: Which is the key ball? Where will the run likely end? What was the first and second ball? Could they tie beginning and end together?'
          ],
          review:'The quality of partner analysis depends on asking the right questions. Use Capelle\'s questions as a framework.',
          scoring:{ type:'checklist', id:'d-nine-analysis', items:['Analyzed partner\'s pattern decisions','Identified run-ending causes (shot vs. position vs. pattern)','Gave specific, constructive feedback','Received analysis in return','Applied one specific insight to my next rack'] }
        },
        {
          id:'d-two-stop', name:'PLAY "TWO AND STOP" EIGHT BALL', accent:'gold', tags:['PARTNER','GAME'],
          cure:'Making two consecutive balls before stopping forces you to think two balls ahead — the beginning of runout thinking.',
          objective:'Build the habit of thinking two shots ahead on every visit to the table.',
          steps:[
            'Standard Eight Ball rules, except: each player must pocket 2 consecutive balls per turn or their turn ends.',
            'If you pocket ball 1 but scratch on ball 2, opponent gets ball in hand.',
            'If you pocket only 1, turn ends (no penalty).',
            'This rule forces planning: you must have position on ball 2 before shooting ball 1.'
          ],
          review:'After mastering "Two and Stop," progress to "Three and Stop," which requires planning 3 balls in advance — the heart of runout play.',
          scoring:{ type:'rackTracker', id:'d-two-stop', racks:5 }
        },
        {
          id:'d-better-player', name:'BETTER PLAYER vs. WEAKER PLAYER', accent:'red', tags:['PARTNER','CHALLENGE'],
          cure:'Challenge games force the stronger player to practice consistency and the weaker player to compete harder.',
          objective:'Use handicap games to challenge both players appropriately.',
          steps:[
            'HANDICAP: Stronger player spots weaker player 2 balls per game in Eight Ball, or gives last 2 balls in Nine Ball.',
            'Stronger player rule: You must name the specific pocket for every shot before shooting.',
            'Weaker player rule: You get ball-in-hand after any missed safety by the stronger player.',
            'Track win/loss record. Adjust handicap so both players win approximately 50% of the time.'
          ],
          review:'Games where both players win 50% of the time provide the maximum learning for both. Too easy = boredom. Too hard = frustration.',
          scoring:{ type:'qual', id:'d-better-player', labels:{ 1:'HANDICAP TOO EASY', 2:'COMPETITIVE', 3:'HANDICAP TOO HARD' } }
        }
      ]
    }
  ]
},

/* ═══════════════════════════════════════
   CHAPTER 12 — LEAGUE TEAM PRACTICE
═══════════════════════════════════════ */
{
  id:'ch12', num:12, title:'League Team Practice',
  subtitle:'Making team practice sessions productive and enjoyable',
  color:'cyan', drillCount:6,
  sections:[
    {
      id:'s12-team', title:'TEAM SESSIONS',
      desc:'How to structure productive team practice sessions.',
      drills:[
        {
          id:'d-team-warmup', name:'TEAM WARM-UP ROUTINE', accent:'cyan', tags:['TEAM','WARM-UP'],
          cure:'Unstructured team warmups waste the most productive minutes of practice time.',
          objective:'Build a consistent team warm-up protocol that gets everyone in the zone quickly.',
          steps:[
            'Minutes 1-5: Everyone warms up on their own key stroke shot (straight in, medium distance).',
            'Minutes 5-10: Partner mirror drill — both players shoot the same shot simultaneously and compare results.',
            'Minutes 10-15: Focus exercise — everyone shoots the same 5-ball sequence, no coaching, full focus.',
            'Debrief: Each player shares their best result and identifies what they were working on.'
          ],
          scoring:{ type:'qual', id:'d-team-warmup', labels:{ 1:'UNSTRUCTURED', 2:'PARTIAL ROUTINE', 3:'FULL PROTOCOL' } }
        },
        {
          id:'d-review-games', name:'REVIEW PREVIOUS GAMES', accent:'gold', tags:['TEAM','ANALYSIS'],
          cure:'Games are the ultimate source of data for practice priorities. Most teams never review them.',
          objective:'Systematically review recent games or matches to identify patterns and priorities.',
          steps:[
            'Each player brings one "problem situation" from a recent game: a pattern they misread, a safety they failed, a missed shot.',
            'Present it on the table using the exact ball positions.',
            'Team discusses: What were the options? What should have been played?',
            'The most knowledgeable player demonstrates the correct play.',
            'Each player shoots the correct shot 3 times.'
          ],
          review:'Using blank pool table diagrams to recreate positions makes this exercise much more valuable.',
          scoring:{ type:'checklist', id:'d-review-games', items:['Brought 1 problem situation to review','Participated in team discussion','Identified 1 correction to practice this week','Shot the correct solution 3 times'] }
        },
        {
          id:'d-pair-compete', name:'PAIR OFF AND COMPETE', accent:'red', tags:['TEAM','COMPETITION'],
          cure:'Competition is the ultimate test of skill. Without it, practice has no pressure.',
          objective:'Use intra-team competition to simulate match pressure.',
          steps:[
            'Pair up by skill level (closest players compete). Play standard game format.',
            'Observers use the Eight Ball Analysis Questions to study both players.',
            'After match: brief debrief. Observer shares 1 specific observation per player.',
            'Rotate pairs. Everyone plays everyone at least once per session.'
          ],
          scoring:{ type:'qual', id:'d-pair-compete', labels:{ 1:'TOO CASUAL', 2:'COMPETITIVE', 3:'MATCH INTENSITY' } }
        }
      ]
    }
  ]
},

/* ═══════════════════════════════════════
   CHAPTER 13 — MENTAL GAME PRACTICE
═══════════════════════════════════════ */
{
  id:'ch13', num:13, title:'Mental Game Practice',
  subtitle:'Visualization, concentration, and competitive mindset',
  color:'cyan', drillCount:8,
  sections:[
    {
      id:'s13-mental', title:'MENTAL GAME EXERCISES',
      desc:'The exercises that train your mind off and on the table.',
      drills:[
        {
          id:'d-visualization', name:'VISUALIZATION PRACTICE', accent:'cyan', tags:['MENTAL','VISUALIZATION'],
          cure:'Players who don\'t visualize are not using half the brain that\'s available to them.',
          objective:'Develop the ability to play pool vividly in your mind away from the table.',
          steps:[
            'Away from the table: Set aside 5 minutes. Close your eyes.',
            'Imagine yourself standing at your table at home. See the balls, the cloth color, the pockets.',
            'Set up a specific shot in your mind. See the Shot Picture clearly.',
            'Execute the shot in your mind. Follow the CB path to the target zone.',
            'Replay the shot 3 times with 3 different speeds. Note which speed gives best position.',
            'At the table: Set up the exact shot from your visualization and execute it.'
          ],
          review:'If your visualization at home matches your execution at the table, your mental imagery is accurate and powerful.',
          tip:'Phil says: Some of the most important practice you do will be away from the table. When you have a quiet moment, play pool in your mind. See yourself making shots.',
          scoring:{ type:'qual', id:'d-visualization', labels:{ 1:'STILL ABSTRACT', 2:'CLEAR IMAGES', 3:'VIVID & ACCURATE' } }
        },
        {
          id:'d-thinking-persons', name:'THINKING PERSONS EXERCISES', accent:'gold', tags:['MENTAL','FUNDAMENTALS'],
          cure:'Translating technical thoughts from practice into automatic execution in a game requires specific training.',
          objective:'Practice incorporating a key technical thought into your game while playing a full rack.',
          steps:[
            'Choose ONE technical thought from the list below.',
            'Play a complete rack (or 5 racks of Nine Ball). Focus on applying that ONE thought to every shot.',
            'Do not try to fix multiple things. One thought at a time.',
            'Technical thoughts to choose from: Stay down longer, Smooth transition, Pose the follow-through, Ghost ball aiming, Speed sensitivity, Follow full-shot routine, Open bridge feel.'
          ],
          review:'By focusing on one technical element during live game play, you build the habit of carrying technical improvement into competition.',
          scoring:{ type:'qual', id:'d-thinking-persons', labels:{ 1:'FORGOT MY THOUGHT', 2:'APPLIED SOMETIMES', 3:'CONSISTENT APPLICATION' } }
        },
        {
          id:'d-competitive-event', name:'"PRACTICING" AT A COMPETITIVE EVENT', accent:'red', tags:['MENTAL','COMPETITION'],
          cure:'The best players use tournaments as practice — a mindset that eliminates performance anxiety.',
          objective:'Reframe competition as a form of practice to reduce pressure and increase learning.',
          steps:[
            'Before your next match: set a specific technical goal (not a win/loss goal).',
            'During the match: focus on executing your technical goal on every shot.',
            'After the match: evaluate only the technical goal. Did you follow your pre-shot routine? Did you stay down? Did you trust your aim?',
            'Win or loss is data. Execution of your technical goal is the real score.'
          ],
          review:'When you can execute your technical goals under pressure, your Fargo rating will reflect the improvement automatically.',
          scoring:{ type:'qual', id:'d-competitive-event', labels:{ 1:'RESULTS-FOCUSED ONLY', 2:'MIXED FOCUS', 3:'PROCESS-FOCUSED' } }
        },
        {
          id:'d-pressure-prep', name:'PRESSURE PREPARATION', accent:'cyan', tags:['MENTAL','PRESSURE'],
          cure:'Players who practice without pressure are not prepared for competition. Simulate it.',
          objective:'Create practice conditions that simulate the pressure of competition.',
          steps:[
            'SELF-BETTING: Before each shot, commit to a consequence if you miss (5 push-ups, etc.).',
            'AUDIENCE: Have someone watch you practice. Their presence creates real pressure.',
            'STREAK TRACKING: Make it publicly known that you are going for a 10-in-a-row streak.',
            'VIDEO RECORDING: Record yourself playing. Self-consciousness is a form of pressure.',
            'Run 3 sessions using these methods. Rate how well you maintained performance under pressure.'
          ],
          scoring:{ type:'qual', id:'d-pressure-prep', labels:{ 1:'PRESSURE CAUSED DECLINE', 2:'SLIGHT PERFORMANCE DROP', 3:'SAME UNDER PRESSURE' } }
        }
      ]
    }
  ]
},

/* ═══════════════════════════════════════
   CHAPTER 14 — PRACTICE PROGRAMS
═══════════════════════════════════════ */
{
  id:'ch14', num:14, title:'Practice Programs',
  subtitle:'Structured sessions built from Capelle\'s recommended programs',
  color:'gold', drillCount:0, // Programs are in the Programs tab
  sections:[
    {
      id:'s14-overview', title:'OVERVIEW',
      desc:'Pre-built practice programs from Chapter 14. Use the Programs tab to load and follow these sessions.',
      drills:[
        {
          id:'d-session-structure', name:'STRUCTURING A PRACTICE SESSION', accent:'cyan', tags:['REFERENCE'],
          cure:'Unstructured practice produces random, slow improvement.',
          objective:'Understand the anatomy of a productive practice session.',
          steps:[
            'THE WARM-UP (10-15 min): Shoot easy shots to loosen up. Stop shots, straight-ins. Build confidence.',
            'HEART OF THE SESSION (30-45 min): Work on L and P skills. The drills that are hard. This is where improvement happens.',
            'COOL DOWN (5-10 min): Finish with something fun or a game you enjoy. End feeling confident.',
            'TIPS FOR SOLITARY PRACTICE: Choose the same practice table if possible. Remove distractions. Set your practice agenda before starting.'
          ],
          tip:'Phil says: Your game is a unique blend of skills. To maximize your practice time, you need to develop, monitor, and adjust your agenda.',
          scoring:{ type:'checklist', id:'d-session-structure', items:['Warm-up completed','Primary drill worked','Secondary drill worked','Cool-down completed','Session notes recorded'] }
        }
      ]
    }
  ]
}

]; // END CHAPTERS

/* ──────────────────────────────────────────
   PRACTICE PROGRAMS DATA
────────────────────────────────────────── */
const PROGRAMS = [
  {
    id:'prog-50-essentials', name:'THE 50 ESSENTIALS',
    desc:'Capelle\'s core exercises that every player at every level should know.',
    duration:'90 min', difficulty:'All Levels',
    drills:[
      { ch:3, id:'d-stance',    name:'Consistent Stance' },
      { ch:3, id:'d-landline',  name:'Land In Line' },
      { ch:3, id:'d-superslow', name:'Super Slow Stroke' },
      { ch:3, id:'d-slowdown',  name:'Slooow Way Down' },
      { ch:3, id:'d-transition',name:'Slow Down Your Transition' },
      { ch:3, id:'d-posing',    name:'Posing for a Picture' },
      { ch:3, id:'d-diamond',   name:'Cue Over the Diamond' },
      { ch:3, id:'d-fivedonuts',name:'5 Donuts in a Row' },
      { ch:4, id:'d-6step',     name:'6-Step Aiming Process' },
      { ch:5, id:'d-follow-shots', name:'The Follow Shot' },
      { ch:5, id:'d-stop-shots', name:'The Stop Shot' },
      { ch:5, id:'d-draw-shots', name:'The Draw Shot' },
      { ch:5, id:'d-stun-shots', name:'Stun Shots' },
      { ch:7, id:'d-5-basics',  name:'The 5 Basic Safeties' },
    ]
  },
  {
    id:'prog-fundamentals', name:'FUNDAMENTALS BUILDER',
    desc:'A complete fundamentals session based on Chapter 3.',
    duration:'60 min', difficulty:'All Levels',
    drills:[
      { ch:3, id:'d-stance',    name:'Consistent Stance' },
      { ch:3, id:'d-landline',  name:'Land In Line' },
      { ch:3, id:'d-superslow', name:'Super Slow Stroke' },
      { ch:3, id:'d-transition',name:'Slow Down Your Transition' },
      { ch:3, id:'d-posing',    name:'Posing for a Picture' },
      { ch:3, id:'d-diamond',   name:'Cue Over the Diamond' },
      { ch:3, id:'d-fivedonuts',name:'5 Donuts in a Row' },
    ]
  },
  {
    id:'prog-nine-ball', name:'20 FOR NINE BALL',
    desc:'Capelle\'s 20-exercise program targeting the most important Nine Ball skills.',
    duration:'75 min', difficulty:'B Level',
    drills:[
      { ch:4, id:'d-6step',     name:'6-Step Aiming Process' },
      { ch:4, id:'d-twocuts',   name:'A Tale of Two Cut Shots' },
      { ch:4, id:'d-identical', name:'Both Sides of Identical Shots' },
      { ch:5, id:'d-follow-shots', name:'The Follow Shot' },
      { ch:5, id:'d-stop-shots', name:'The Stop Shot' },
      { ch:5, id:'d-draw-shots', name:'The Draw Shot' },
      { ch:5, id:'d-half-diamond', name:'The Half Diamond Shot' },
      { ch:5, id:'d-stun-shots', name:'Stun Shots' },
      { ch:6, id:'d-prog-a',    name:'Programming A' },
      { ch:6, id:'d-nine-patterns', name:'Nine-Ball Patterns' },
      { ch:7, id:'d-5-basics',  name:'The 5 Basic Safeties' },
      { ch:8, id:'d-treadmill', name:'The Treadmill (Kicking)' },
      { ch:9, id:'d-break-angles', name:'Nine Ball Break Angles' },
      { ch:10, id:'d-ghost-nine', name:'Play the Ghost' },
    ]
  },
  {
    id:'prog-eight-ball', name:'EIGHT BALL PROGRAM',
    desc:'Focused Eight Ball practice targeting pattern play and end-game runouts.',
    duration:'75 min', difficulty:'B Level',
    drills:[
      { ch:4, id:'d-6step',       name:'6-Step Aiming Process' },
      { ch:5, id:'d-follow-shots', name:'The Follow Shot' },
      { ch:5, id:'d-draw-shots',  name:'The Draw Shot' },
      { ch:6, id:'d-prog-b',      name:'Programming B' },
      { ch:6, id:'d-8ball-endgame', name:'Eight-Ball End Game Runouts' },
      { ch:7, id:'d-5-basics',    name:'The 5 Basic Safeties' },
      { ch:10, id:'d-ghost-eight', name:'Play the Ghost (Eight Ball)' },
    ]
  },
  {
    id:'prog-position', name:'BASIC POSITION PLAY',
    desc:'The foundation position routes. Follow, draw, stun, half diamond.',
    duration:'60 min', difficulty:'B- Level',
    drills:[
      { ch:5, id:'d-follow-shots', name:'The Follow Shot' },
      { ch:5, id:'d-stop-shots', name:'The Stop Shot' },
      { ch:5, id:'d-draw-shots', name:'The Draw Shot' },
      { ch:5, id:'d-half-diamond', name:'The Half Diamond Shot' },
      { ch:5, id:'d-stun-shots', name:'Stun Shots' },
      { ch:5, id:'d-dead-scratch', name:'The Dead Scratch' },
      { ch:5, id:'d-angle-departure', name:'The Angle of Departure' },
      { ch:5, id:'d-rebound', name:'The Rebound' },
    ]
  },
  {
    id:'prog-soft-strokes', name:'SOFT STROKES PROGRAM',
    desc:'Developing the surgeon\'s touch. Fine speed control is the mark of the pro.',
    duration:'45 min', difficulty:'B Level',
    drills:[
      { ch:3, id:'d-slowdown',   name:'Slooow Way Down' },
      { ch:5, id:'d-zeroing-in', name:'Zeroing In' },
      { ch:5, id:'d-piano-scales', name:'Piano Scales' },
      { ch:5, id:'d-surgeons-touch', name:"The Surgeon's Touch" },
      { ch:10, id:'d-soft-touch', name:'Soft Touch Increments Contest' },
    ]
  },
  {
    id:'prog-mental', name:'THINKING PERSONS PROGRAM',
    desc:'Mental game exercises from Chapters 13 & 3. Apply technical focus during live play.',
    duration:'60 min', difficulty:'All Levels',
    drills:[
      { ch:3, id:'d-execmode',     name:'Mastering Execution Mode' },
      { ch:3, id:'d-mission',      name:'Mission Aborted' },
      { ch:13, id:'d-visualization', name:'Visualization Practice' },
      { ch:13, id:'d-thinking-persons', name:'Thinking Persons Exercises' },
      { ch:13, id:'d-pressure-prep', name:'Pressure Preparation' },
    ]
  }
];

/* ──────────────────────────────────────────
   STATE MANAGEMENT — IndexedDB
────────────────────────────────────────── */
const DB_NAME = 'fgp-training';
const DB_VER = 4;
let db = null;

async function initDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VER);
    req.onupgradeneeded = (e) => {
      const d = e.target.result;
      if (!d.objectStoreNames.contains('scores'))   d.createObjectStore('scores',   { keyPath: 'id' });
      if (!d.objectStoreNames.contains('sessions'))  d.createObjectStore('sessions', { keyPath: 'id' });
      if (!d.objectStoreNames.contains('profile'))   d.createObjectStore('profile',  { keyPath: 'key' });
      if (!d.objectStoreNames.contains('ratings'))   d.createObjectStore('ratings',  { keyPath: 'id' });
      if (!d.objectStoreNames.contains('history'))    d.createObjectStore('history',    { keyPath: 'id' });
      if (!d.objectStoreNames.contains('notes'))      d.createObjectStore('notes',      { keyPath: 'id' });
      if (!d.objectStoreNames.contains('bookmarks'))  d.createObjectStore('bookmarks',  { keyPath: 'drillId' });
    };
    req.onsuccess = (e) => { db = e.target.result; resolve(); };
    req.onerror = reject;
  });
}

async function dbGet(store, key) {
  return new Promise((res, rej) => {
    const tx = db.transaction(store, 'readonly');
    const req = tx.objectStore(store).get(key);
    req.onsuccess = () => res(req.result);
    req.onerror = rej;
  });
}

async function dbPut(store, val) {
  return new Promise((res, rej) => {
    const tx = db.transaction(store, 'readwrite');
    tx.objectStore(store).put(val);
    tx.oncomplete = res;
    tx.onerror = rej;
  });
}

async function dbGetAll(store) {
  return new Promise((res, rej) => {
    const tx = db.transaction(store, 'readonly');
    const req = tx.objectStore(store).getAll();
    req.onsuccess = () => res(req.result || []);
    req.onerror = rej;
  });
}

async function dbClear(store) {
  return new Promise((res, rej) => {
    const tx = db.transaction(store, 'readwrite');
    tx.objectStore(store).clear();
    tx.oncomplete = res;
    tx.onerror = rej;
  });
}

async function saveScore(id, val) {
  await dbPut('scores', { id, val, ts: Date.now() });
  // Append normalized value to sparkline history
  let sv = null;
  if (typeof val === 'number') sv = val;
  else if (val && typeof val === 'object') {
    if (typeof val.pct   === 'number') sv = val.pct;
    else if (typeof val.score === 'number') sv = val.score;
    else if (typeof val.best  === 'number') sv = val.best;
  }
  if (sv !== null) {
    const hist = (await dbGet('history', id)) || { id, entries: [] };
    hist.entries.push({ v: sv, ts: Date.now() });
    if (hist.entries.length > 30) hist.entries = hist.entries.slice(-30);
    await dbPut('history', hist);
  }
}

async function loadScore(id) {
  const r = await dbGet('scores', id);
  return r ? r.val : null;
}

async function getProfile() {
  const keys = ['name','persona','table','cloth','cue','shaft','fargo','fargoGoal','hand','bridge','fontSize'];
  const profile = {};
  for (const k of keys) {
    const r = await dbGet('profile', k);
    profile[k] = r ? r.val : null;
  }
  return profile;
}

async function saveProfile(data) {
  for (const [k, v] of Object.entries(data)) {
    await dbPut('profile', { key: k, val: v });
  }
}

/* ──────────────────────────────────────────
   SCORE STATE (in-memory + IndexedDB sync)
────────────────────────────────────────── */
const SCORES = {};        // In-memory score cache
const DRILL_REGISTRY = {}; // id → { drill, chNum } for keyboard shortcuts
let activeDrill = null;    // currently open drill { drill, chNum }

async function getScore(id) {
  if (SCORES[id] !== undefined) return SCORES[id];
  const v = await loadScore(id);
  SCORES[id] = v;
  return v;
}

async function setScore(id, val) {
  SCORES[id] = val;
  await saveScore(id, val);
}

/* ──────────────────────────────────────────
   SESSION TRACKING
────────────────────────────────────────── */
let activeSession = null;

async function logSessionDrill(chNum, drillId, scoreType, value) {
  if (!activeSession) {
    activeSession = { id: Date.now(), date: new Date().toLocaleDateString(), drills: [] };
  }
  const existing = activeSession.drills.find(d => d.drillId === drillId);
  const isNew = !existing;
  if (!existing) {
    activeSession.drills.push({ chNum, drillId, scoreType, value, ts: Date.now() });
  } else {
    existing.value = value;
    existing.ts = Date.now();
  }
  await dbPut('sessions', activeSession);
  updateSessionTab();

  // Auto-advance to next drill in program (only on first score, not re-scores)
  if (isNew && activeSession.programDrills && activeSession.programDrills.length > 0) {
    const idx = activeSession.programDrills.findIndex(d => d.id === drillId);
    if (idx >= 0 && idx < activeSession.programDrills.length - 1) {
      showNextDrillToast(activeSession.programDrills[idx + 1]);
    } else if (idx === activeSession.programDrills.length - 1) {
      showProgramCompleteToast();
    }
  }
}

function updateSessionTab() {
  const noView    = document.getElementById('no-session-view');
  const activeView = document.getElementById('active-session-view');
  if (!activeSession) {
    noView.style.display = '';
    activeView.style.display = 'none';
    return;
  }
  noView.style.display = 'none';
  activeView.style.display = '';
  document.getElementById('sessionProgramName').textContent = activeSession.programName || 'FREE SESSION';

  const list = document.getElementById('sessionDrillList');
  const programDrills = activeSession.programDrills || [];

  if (programDrills.length > 0) {
    // Program session: show full drill list with completion state
    const loggedIds = new Set((activeSession.drills || []).map(d => d.drillId));
    const done = loggedIds.size;
    document.getElementById('sessionProgress').textContent =
      `${done} / ${programDrills.length} DRILLS COMPLETE`;
    list.innerHTML = programDrills.map(d => {
      const isDone = loggedIds.has(d.id);
      return `
        <div class="sess-drill${isDone ? ' done' : ''}" id="sess-drill-${d.id}"
             onclick="navigateToDrill(${d.ch},'${d.id}')">
          <div class="sess-drill-name">${escHtml(d.name)}</div>
          <div class="sess-drill-check" id="sess-check-${d.id}">${isDone ? '✓' : '→'}</div>
        </div>`;
    }).join('');
  } else {
    // Free session: show logged drills
    const logged = activeSession.drills || [];
    document.getElementById('sessionProgress').textContent =
      `${logged.length} DRILL${logged.length !== 1 ? 'S' : ''} LOGGED`;
    list.innerHTML = logged.map(d => `
      <div class="sess-drill done">
        <span class="sess-drill-name">${getDrillName(d.chNum, d.drillId)}</span>
        <div class="sess-drill-check">✓</div>
      </div>`).join('');
  }
}

/* ──────────────────────────────────────────
   PROGRAM AUTO-ADVANCE TOAST
────────────────────────────────────────── */
let _toastTimer = null;

function showNextDrillToast(drill) {
  clearInterval(_toastTimer);
  const old = document.getElementById('prog-toast');
  if (old) old.remove();

  const el = document.createElement('div');
  el.id = 'prog-toast';
  el.innerHTML = `
    <div class="pt-check">✓ DRILL COMPLETE</div>
    <div class="pt-label">NEXT UP</div>
    <div class="pt-name">${escHtml(drill.name)}</div>
    <div class="pt-btns">
      <button class="pt-next" onclick="toastAdvance()">NEXT DRILL →</button>
      <button class="pt-stay" onclick="toastDismiss()">STAY HERE</button>
    </div>
    <div class="pt-count" id="pt-count">Auto-advancing in 5s</div>
  `;
  el._drill = drill;
  document.body.appendChild(el);

  let secs = 5;
  _toastTimer = setInterval(() => {
    secs--;
    const c = document.getElementById('pt-count');
    if (c) c.textContent = `Auto-advancing in ${secs}s`;
    if (secs <= 0) { clearInterval(_toastTimer); toastAdvance(); }
  }, 1000);
}

function showProgramCompleteToast() {
  clearInterval(_toastTimer);
  const old = document.getElementById('prog-toast');
  if (old) old.remove();

  const el = document.createElement('div');
  el.id = 'prog-toast';
  el.innerHTML = `
    <div class="pt-check" style="color:var(--gold)">⚡ PROGRAM COMPLETE</div>
    <div class="pt-label">ALL DRILLS FINISHED</div>
    <div class="pt-name">${escHtml(activeSession.programName || '')}</div>
    <div class="pt-btns">
      <button class="pt-next" onclick="toastDismiss();switchTab('progress')">VIEW PROGRESS →</button>
      <button class="pt-stay" onclick="toastDismiss()">CLOSE</button>
    </div>
  `;
  document.body.appendChild(el);
}

function toastAdvance() {
  clearInterval(_toastTimer);
  const el = document.getElementById('prog-toast');
  if (!el) return;
  const drill = el._drill;
  el.remove();
  if (drill) navigateToDrill(drill.ch, drill.id);
}

function toastDismiss() {
  clearInterval(_toastTimer);
  const el = document.getElementById('prog-toast');
  if (el) el.remove();
}

function getDrillName(chNum, drillId) {
  const ch = CHAPTERS.find(c => c.num === chNum);
  if (!ch) return drillId;
  for (const sec of ch.sections) {
    const dr = sec.drills.find(d => d.id === drillId);
    if (dr) return dr.name;
  }
  return drillId;
}

async function endSession() {
  if (!activeSession) return;
  if (!confirm('End this session?')) return;
  activeSession.ended = Date.now();
  await dbPut('sessions', activeSession);
  const finished = { ...activeSession };
  activeSession = null;
  updateSessionTab();
  showSessionSummary(finished);
}

/* ──────────────────────────────────────────
   RENDER: CHAPTER GRID
────────────────────────────────────────── */
function renderChapterGrid() {
  // Daily plan widget
  document.getElementById('daily-plan-widget').innerHTML = `
    <div class="dp-widget">
      <div class="dp-header">
        <span class="dp-title">DAILY PLAN GENERATOR</span>
        <div class="dp-times">
          <button class="dp-t" data-min="30" onclick="selectPlanTime(30)">30m</button>
          <button class="dp-t active" data-min="60" onclick="selectPlanTime(60)">60m</button>
          <button class="dp-t" data-min="90" onclick="selectPlanTime(90)">90m</button>
        </div>
      </div>
      <button class="dp-build-btn" id="dpBuildBtn" onclick="buildAndShowPlan()">⚡ BUILD TODAY'S SESSION</button>
    </div>`;

  const grid = document.getElementById('chapterGrid');
  grid.innerHTML = CHAPTERS.map(ch => `
    <div class="ch-card" onclick="openChapter(${ch.num})">
      <div class="ch-num">CH.${String(ch.num).padStart(2,'0')} // CAPELLE</div>
      <div class="ch-title">${ch.title}</div>
      <div class="ch-meta">
        <span>${ch.drillCount > 0 ? ch.drillCount + ' drills' : ch.sections.length + ' sections'}</span>
        <span class="ch-pct" id="ch-pct-${ch.num}"></span>
      </div>
    </div>
  `).join('');

  // Async loaders (non-blocking)
  loadChapterCompletion();
  renderBookmarksPanel();
}

/* ──────────────────────────────────────────
   RENDER: CHAPTER DETAIL
────────────────────────────────────────── */
function openChapter(num) {
  const ch = CHAPTERS.find(c => c.num === num);
  if (!ch) return;
  document.getElementById('chapter-list-view').style.display = 'none';
  document.getElementById('section-detail-view').style.display = 'none';
  const view = document.getElementById('chapter-detail-view');
  view.style.display = '';
  document.getElementById('navContext').textContent = `CH.${num} // ${ch.title.toUpperCase()}`;
  updateSectionNav(ch);

  view.innerHTML = `
    <button class="back-btn" onclick="showChapterList()">← ALL CHAPTERS</button>
    <div class="sec-hdr">
      <div class="sh-tag">CH.${String(num).padStart(2,'0')} // CAPELLE'S PRACTICING POOL</div>
      <div class="sh-name">${ch.title.toUpperCase()}</div>
      <div class="sh-desc">${ch.subtitle}</div>
    </div>
    <div style="margin-bottom:12px">
      ${ch.sections.map((sec, i) => `
        <div class="drill-card" style="cursor:pointer" onclick="openSection(${num}, ${i})">
          <div class="dc-hdr" style="cursor:pointer">
            <div>
              <div class="dc-name">${sec.title}</div>
              <div style="font-size:12px;color:var(--dim2);margin-top:3px">${sec.desc}</div>
            </div>
            <div class="dc-right">
              <span class="dc-tag">${sec.drills.length} DRILLS</span>
              <span class="dc-chev">▶</span>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function updateSectionNav(ch) {
  // Mobile horizontal nav
  const snav = document.getElementById('sectionNav');
  snav.style.display = 'flex';
  snav.innerHTML = `
    <button class="snav-btn" onclick="showChapterList()">◀ CHAPTERS</button>
    ${ch.sections.map((sec, i) => `
      <button class="snav-btn" onclick="openSection(${ch.num}, ${i})">${sec.title}</button>
    `).join('')}
  `;
  // Desktop sidebar vertical nav
  const sbSnav = document.getElementById('sbSectionNav');
  if (sbSnav) {
    sbSnav.innerHTML = `
      <div class="sb-snav-title">CH.${String(ch.num).padStart(2,'0')} SECTIONS</div>
      <button class="sb-snav-btn" onclick="showChapterList()">◀ ALL CHAPTERS</button>
      ${ch.sections.map((sec, i) => `
        <button class="sb-snav-btn" onclick="openSection(${ch.num}, ${i})">${sec.title}</button>
      `).join('')}
    `;
  }
}

/* ──────────────────────────────────────────
   RENDER: SECTION DETAIL (drill list)
────────────────────────────────────────── */
function openSection(chNum, secIdx) {
  const ch = CHAPTERS.find(c => c.num === chNum);
  if (!ch) return;
  const sec = ch.sections[secIdx];
  if (!sec) return;

  document.getElementById('chapter-list-view').style.display = 'none';
  document.getElementById('chapter-detail-view').style.display = 'none';
  const view = document.getElementById('section-detail-view');
  view.style.display = '';
  document.getElementById('navContext').textContent = sec.title;

  // Update snav active state
  const snavBtns = document.querySelectorAll('.snav-btn');
  snavBtns.forEach((b, i) => { if (i === secIdx + 1) b.classList.add('active'); else b.classList.remove('active'); });

  // Special handling for Ch3 overview
  if (chNum === 3 && sec.id === 's3-overview') {
    renderCh3Overview(view, chNum);
    return;
  }

  // Register drills for keyboard shortcuts
  sec.drills.forEach(d => { DRILL_REGISTRY[d.id] = { drill: d, chNum }; });

  const drillsHTML = sec.drills.map(d => renderDrillCard(d, chNum)).join('');

  view.innerHTML = `
    <button class="back-btn" onclick="openChapter(${chNum})">← ${ch.title.toUpperCase()}</button>
    <div class="sec-hdr">
      <div class="sh-tag">CH.${String(chNum).padStart(2,'0')} // ${ch.title.toUpperCase()}</div>
      <div class="sh-name">${sec.title}</div>
      <div class="sh-desc">${sec.desc}</div>
    </div>
    ${drillsHTML}
  `;

  // Restore scores, sparklines, notes, bookmarks
  sec.drills.forEach(d => restoreDrillScores(d));
  loadSparklines(sec.drills);
  loadNotes(sec.drills);
  loadBookmarkStates(sec.drills.map(d => d.id));
}

/* ──────────────────────────────────────────
   RENDER: INDIVIDUAL DRILL CARD
────────────────────────────────────────── */
function renderDrillCard(drill, chNum) {
  const accent = drill.accent || 'cyan';
  const tagsHTML = (drill.tags || []).map(t => `<span class="dc-tag">${t}</span>`).join('');

  let bodyHTML = '';

  if (drill.cure) {
    bodyHTML += `<div class="cure"><span class="cure-lbl">THE CURE</span>${escHtml(drill.cure)}</div>`;
  }
  if (drill.objective) {
    bodyHTML += `<div class="stitle">OBJECTIVE</div><p class="body-t">${escHtml(drill.objective)}</p>`;
  }
  if (drill.setup) {
    bodyHTML += `<div class="stitle">SETUP</div><p class="body-t">${escHtml(drill.setup).replace(/\n/g,'<br>')}</p>`;
  }
  if (drill.diagram) {
    bodyHTML += `<div class="diag-wrap"><div class="diag-lbl">TABLE DIAGRAM // ${escHtml(drill.name)}</div>${drill.diagram}</div>`;
  }
  if (drill.steps && drill.steps.length) {
    bodyHTML += `<div class="stitle">EXECUTION</div><ol class="steps">${drill.steps.map(s=>`<li>${escHtml(s)}</li>`).join('')}</ol>`;
  }
  if (drill.correct || drill.flaws) {
    bodyHTML += `<div class="cf-grid">`;
    if (drill.correct) bodyHTML += `<div class="cf-box correct"><div class="cf-lbl">CORRECT</div>${drill.correct.map(c=>`<div class="cf-item">• ${escHtml(c)}</div>`).join('')}</div>`;
    if (drill.flaws) bodyHTML += `<div class="cf-box flaw"><div class="cf-lbl">FLAWS</div>${drill.flaws.map(f=>`<div class="cf-item">• ${escHtml(f)}</div>`).join('')}</div>`;
    bodyHTML += `</div>`;
  }
  if (drill.review) {
    bodyHTML += `<div class="stitle">REVIEW</div><p class="body-t" style="font-style:italic">${escHtml(drill.review)}</p>`;
  }

  const scoreHTML = renderScoringBlock(drill, chNum);
  const tipHTML   = drill.tip ? `<div class="tip">${escHtml(drill.tip)}</div>` : '';

  // Note textarea appended to info col
  const noteHTML = `
    <div class="note-wrap">
      <label class="note-lbl" for="note-${drill.id}">SESSION NOTES</label>
      <textarea class="drill-note" id="note-${drill.id}"
        placeholder="Capture observations, cues, what worked…"
        oninput="noteSave('${drill.id}')"></textarea>
    </div>`;

  const finalBody = scoreHTML
    ? `<div class="dc-info">${bodyHTML}${noteHTML}</div><div class="dc-score-col">${scoreHTML}${tipHTML}</div>`
    : `<div class="dc-info">${bodyHTML}${noteHTML}${tipHTML}</div>`;

  return `
    <div class="drill-card ${accent}" id="card-${drill.id}">
      <div class="dc-hdr" id="hdr-${drill.id}" onclick="toggleDrill('${drill.id}')">
        <div class="dc-name">${escHtml(drill.name)}</div>
        <div class="dc-right">
          ${tagsHTML}
          <span class="note-ind" id="note-ind-${drill.id}" title="Has note"></span>
          <span class="dc-spark" id="spark-${drill.id}"></span>
          <button class="bk-btn" id="bk-${drill.id}" onclick="event.stopPropagation();toggleBookmark('${drill.id}',${chNum},'${escHtml(drill.name)}')" title="Bookmark">☆</button>
          <span class="dc-chev" id="chev-${drill.id}">▼</span>
        </div>
      </div>
      <div class="dc-body" id="body-${drill.id}">${finalBody}</div>
    </div>`;
}

function toggleDrill(id) {
  const body = document.getElementById('body-'+id);
  const chev = document.getElementById('chev-'+id);
  const hdr  = document.getElementById('hdr-'+id);
  if (!body) return;
  const isOpen = body.classList.contains('open');
  body.classList.toggle('open', !isOpen);
  chev && chev.classList.toggle('open', !isOpen);
  hdr  && hdr.classList.toggle('open', !isOpen);
  activeDrill = !isOpen ? (DRILL_REGISTRY[id] || null) : null;
}

/* ──────────────────────────────────────────
   RENDER: SCORING BLOCKS
────────────────────────────────────────── */
function renderScoringBlock(drill, chNum) {
  if (!drill.scoring) return '';
  const s = drill.scoring;
  const id = s.id;

  switch (s.type) {
    case 'qual':
      return `
        <div class="score-block">
          <div class="score-title">SESSION SCORE // RATE YOUR PERFORMANCE</div>
          <div class="qual-score" id="qs-${id}">
            ${Object.entries(s.labels).map(([v,l])=>`<button class="q-btn" onclick="qualScore('${id}',${v},'${chNum}')">${escHtml(l)}<kbd class="sc-key">${v}</kbd></button>`).join('')}
          </div>
          <button class="btn-reset" onclick="qualReset('${id}')">[ RESET ] <kbd class="sc-key">R</kbd></button>
        </div>`;

    case 'qualAB':
      return `
        <div class="score-block">
          <div class="score-title">SESSION SCORE</div>
          <div class="stitle">VERSION A</div>
          <div class="qual-score" id="qs-${id}-a">
            ${Object.entries(s.labels).map(([v,l])=>`<button class="q-btn" onclick="qualScore('${id}-a',${v},'${chNum}')">${escHtml(l)}</button>`).join('')}
          </div>
          <div class="stitle">VERSION B</div>
          <div class="qual-score" id="qs-${id}-b">
            ${Object.entries(s.labels).map(([v,l])=>`<button class="q-btn" onclick="qualScore('${id}-b',${v},'${chNum}')">${escHtml(l)}</button>`).join('')}
          </div>
          <button class="btn-reset" onclick="qualReset('${id}-a');qualReset('${id}-b')">[ RESET ]</button>
        </div>`;

    case 'hitMiss':
      return `
        <div class="score-block">
          <div class="score-title">${escHtml(s.label||'MAKES VS MISSES')}</div>
          <div class="hm-row">
            <button class="hm-btn hit-btn" onclick="hmScore('${id}','hit','${chNum}')">+ HIT <kbd class="sc-key">H</kbd></button>
            <button class="hm-btn miss-btn" onclick="hmScore('${id}','miss','${chNum}')">+ MISS <kbd class="sc-key">M</kbd></button>
            <button class="hm-undo-btn" onclick="hmUndo('${id}')">UNDO <kbd class="sc-key">U</kbd></button>
            <div class="tally"><span class="big" id="${id}-hits">0</span> / <span id="${id}-total">0</span>${s.showPct?` = <span id="${id}-pct">—</span>`:''}</div>
          </div>
          <button class="btn-reset" onclick="hmReset('${id}')">[ RESET ] <kbd class="sc-key">R</kbd></button>
        </div>`;

    case 'hitMissAB':
      return `
        <div class="score-block">
          <div class="score-title">${escHtml(s.labelA||'PART A')} vs ${escHtml(s.labelB||'PART B')}</div>
          <div class="stitle">${escHtml(s.labelA||'PART A')}</div>
          <div class="hm-row">
            <button class="hm-btn hit-btn" onclick="hmScore('${id}-a','hit','${chNum}')">+ HIT</button>
            <button class="hm-btn miss-btn" onclick="hmScore('${id}-a','miss','${chNum}')">+ MISS</button>
            <div class="tally"><span class="big" id="${id}-a-hits">0</span> / <span id="${id}-a-total">0</span> = <span id="${id}-a-pct">—</span></div>
          </div>
          <div class="stitle">${escHtml(s.labelB||'PART B')}</div>
          <div class="hm-row">
            <button class="hm-btn hit-btn" onclick="hmScore('${id}-b','hit','${chNum}')">+ HIT</button>
            <button class="hm-btn miss-btn" onclick="hmScore('${id}-b','miss','${chNum}')">+ MISS</button>
            <div class="tally"><span class="big" id="${id}-b-hits">0</span> / <span id="${id}-b-total">0</span> = <span id="${id}-b-pct">—</span></div>
          </div>
          <button class="btn-reset" onclick="hmReset('${id}-a');hmReset('${id}-b')">[ RESET ]</button>
        </div>`;

    case 'hitMissMulti':
      return `
        <div class="score-block">
          <div class="score-title">MAKES VS MISSES BY GROUP</div>
          ${s.groups.map((g,i) => `
            <div class="stitle">${escHtml(g)}</div>
            <div class="hm-row">
              <button class="hm-btn hit-btn" onclick="hmScore('${id}-g${i}','hit','${chNum}')">+ HIT</button>
              <button class="hm-btn miss-btn" onclick="hmScore('${id}-g${i}','miss','${chNum}')">+ MISS</button>
              <div class="tally"><span class="big" id="${id}-g${i}-hits">0</span> / <span id="${id}-g${i}-total">0</span> = <span id="${id}-g${i}-pct">—</span></div>
            </div>`).join('')}
          <button class="btn-reset" onclick="${s.groups.map((_,i)=>`hmReset('${id}-g${i}')`).join(';')}">[ RESET ALL ]</button>
        </div>`;

    case 'streak':
      return `
        <div class="score-block">
          <div class="score-title">CONSECUTIVE STREAK TRACKER</div>
          ${[1,2,3].map(v=>`
            <div class="stitle">VERSION ${v} ${v===1?'(CYAN)':v===2?'(GREEN)':'(RED)'}</div>
            <div class="score-row">
              <div class="score-lbl">SHOTS</div>
              <div class="dots-row" id="dots-${id}-v${v}"></div>
            </div>
            <div class="streak-row">
              <div class="streak-num" id="streak-${id}-v${v}">0</div>
              <div><div class="streak-info">Best consecutive streak</div>
              <div class="streak-goal">TARGET: ${s.target || 4} IN A ROW</div></div>
            </div>`).join('')}
          <button class="btn-reset" onclick="streakReset('${id}')">[ RESET ALL ]</button>
        </div>`;

    case 'streakVersions':
      return `
        <div class="score-block">
          <div class="score-title">VERSION PROGRESSION — HIT ${s.target||4} IN A ROW TO ADVANCE</div>
          ${[1,2,3].slice(0,s.versions||3).map(v=>`
            <div class="stitle" style="color:${v===1?'var(--cyan)':v===2?'var(--green)':'var(--red)'}">VERSION ${v}</div>
            <div class="score-row">
              <div class="score-lbl">SHOTS</div>
              <div class="dots-row" id="dots-${id}-v${v}"></div>
            </div>
            <div class="streak-row">
              <div class="streak-num" id="streak-${id}-v${v}">0</div>
              <div><div class="streak-info">Best streak</div>
              <div class="streak-goal">GOAL: ${s.target||4} IN A ROW</div></div>
            </div>`).join('')}
          <button class="btn-reset" onclick="streakReset('${id}')">[ RESET ]</button>
        </div>`;

    case 'rackTracker':
      const racks = s.racks || 5;
      return `
        <div class="score-block">
          <div class="score-title">RACK SCORE // BALLS POCKETED PER RACK</div>
          ${Array.from({length:racks},(_,i)=>`
            <div class="score-row">
              <div class="score-lbl">RACK ${i+1}</div>
              <div class="dots-row" id="dots-${id}-r${i+1}"></div>
            </div>`).join('')}
          <button class="btn-reset" onclick="racksReset('${id}',${racks})">[ RESET ]</button>
        </div>`;

    case 'dotsAB':
      return `
        <div class="score-block">
          <div class="score-title">MAKES VS MISSES — PARTS A & B</div>
          <div class="score-row"><div class="score-lbl">PART A</div><div class="dots-row" id="dots-${id}-a"></div></div>
          <div class="score-row"><div class="score-lbl">PART B</div><div class="dots-row" id="dots-${id}-b"></div></div>
          <button class="btn-reset" onclick="dotsReset('${id}-a',${s.dotsA||10});dotsReset('${id}-b',${s.dotsB||10})">[ RESET ]</button>
        </div>`;

    case 'dotsABCD':
      return `
        <div class="score-block">
          <div class="score-title">GO SIGNAL — SHOTS A, B, C, D</div>
          ${['A','B','C','D'].map(l=>`<div class="score-row"><div class="score-lbl">SHOT ${l}</div><div class="dots-row" id="dots-${id}-${l.toLowerCase()}"></div></div>`).join('')}
          <div class="stitle" style="margin-top:10px">VERSION 2 RATING</div>
          <div class="qual-score" id="qs-${id}-v2">
            <button class="q-btn" onclick="qualScore('${id}-v2',1,'${chNum}')">SHOT ANYWAY</button>
            <button class="q-btn" onclick="qualScore('${id}-v2',2,'${chNum}')">FELT OFF</button>
            <button class="q-btn" onclick="qualScore('${id}-v2',3,'${chNum}')">GO SIGNAL CORRECT</button>
          </div>
          <button class="btn-reset" onclick="['a','b','c','d'].forEach(l=>dotsReset('${id}-'+l,8));qualReset('${id}-v2')">[ RESET ]</button>
        </div>`;

    case 'speedProg':
      return `
        <div class="score-block">
          <div class="score-title">SPEED PROGRESSION // SMOOTHNESS RATING PER SPEED</div>
          ${(s.speeds||[3,4,5,6,7]).map(sp=>`
            <div class="score-row">
              <div class="score-lbl">SPEED ${sp}</div>
              <div class="qual-score" id="qs-${id}-sp${sp}" style="margin-top:0">
                <button class="q-btn" style="font-size:8px;padding:5px 8px" onclick="qualScore('${id}-sp${sp}',1,'${chNum}')">CHOPPY</button>
                <button class="q-btn" style="font-size:8px;padding:5px 8px" onclick="qualScore('${id}-sp${sp}',2,'${chNum}')">SMOOTH</button>
                <button class="q-btn" style="font-size:8px;padding:5px 8px" onclick="qualScore('${id}-sp${sp}',3,'${chNum}')">BUTTER</button>
              </div>
            </div>`).join('')}
          <button class="btn-reset" onclick="${(s.speeds||[3,4,5,6,7]).map(sp=>`qualReset('${id}-sp${sp}')`).join(';')}">[ RESET ]</button>
        </div>`;

    case 'checklist':
      return `
        <div class="score-block">
          <div class="score-title">DRILL CHECKLIST</div>
          <div class="checklist">
            ${s.items.map((item,i)=>`
              <label class="chk" id="chk-${id}-${i}">
                <input type="checkbox" onchange="chkChange('${id}',${i},this.checked,'${chNum}')">
                <span class="chk-box"></span>
                <span class="chk-txt">${escHtml(item)}</span>
              </label>`).join('')}
          </div>
        </div>`;

    case 'qualChecklist':
      return `
        <div class="score-block">
          <div class="score-title">DRILL CHECKLIST</div>
          <div class="checklist">
            ${s.items.map((item,i)=>`
              <label class="chk">
                <input type="checkbox" onchange="chkChange('${id}-c${i}',0,this.checked,'${chNum}')">
                <span class="chk-box"></span>
                <span class="chk-txt">${escHtml(item)}</span>
              </label>`).join('')}
          </div>
          <div class="stitle">OVERALL RATING</div>
          <div class="qual-score" id="qs-${s.qual.id}">
            ${Object.entries(s.qual.labels).map(([v,l])=>`<button class="q-btn" onclick="qualScore('${s.qual.id}',${v},'${chNum}')">${escHtml(l)}</button>`).join('')}
          </div>
          <button class="btn-reset" onclick="qualReset('${s.qual.id}')">[ RESET ]</button>
        </div>`;

    case 'bothSides':
      return `
        <div class="score-block">
          <div class="score-title">LEFT SIDE vs RIGHT SIDE COMPARISON</div>
          ${s.shots.map(shot=>`
            <div class="stitle">SHOT ${shot}</div>
            <div class="both-sides">
              <div class="side-box side-left">
                <div class="side-lbl">LEFT SIDE</div>
                <div class="hm-row" style="margin-top:0">
                  <button class="hm-btn hit-btn" style="font-size:9px;padding:6px 10px;min-height:40px" onclick="hmScore('${id}-${shot}-l','hit','${chNum}')">HIT</button>
                  <button class="hm-btn miss-btn" style="font-size:9px;padding:6px 10px;min-height:40px" onclick="hmScore('${id}-${shot}-l','miss','${chNum}')">MISS</button>
                </div>
                <div class="tally" style="margin-top:5px"><span id="${id}-${shot}-l-hits">0</span>/${s.shotsEach||5}</div>
              </div>
              <div class="side-box side-right">
                <div class="side-lbl">RIGHT SIDE</div>
                <div class="hm-row" style="margin-top:0">
                  <button class="hm-btn hit-btn" style="font-size:9px;padding:6px 10px;min-height:40px" onclick="hmScore('${id}-${shot}-r','hit','${chNum}')">HIT</button>
                  <button class="hm-btn miss-btn" style="font-size:9px;padding:6px 10px;min-height:40px" onclick="hmScore('${id}-${shot}-r','miss','${chNum}')">MISS</button>
                </div>
                <div class="tally" style="margin-top:5px"><span id="${id}-${shot}-r-hits">0</span>/${s.shotsEach||5}</div>
              </div>
            </div>`).join('')}
          <button class="btn-reset" onclick="${s.shots.flatMap(sh=>[`hmReset('${id}-${sh}-l')`,`hmReset('${id}-${sh}-r')`]).join(';')}">[ RESET ]</button>
        </div>`;

    case 'landLine':
      return `
        <div class="score-block">
          <div class="score-title">PART A — CUE BALL DIRECTION AFTER CONTACT</div>
          <div class="score-row"><div class="score-lbl">STRAIGHT</div><div class="dots-row" id="dots-${id}-straight"></div></div>
          <div class="score-row"><div class="score-lbl">LEFT MISS</div><div class="dots-row" id="dots-${id}-left"></div></div>
          <div class="score-row"><div class="score-lbl">RIGHT MISS</div><div class="dots-row" id="dots-${id}-right"></div></div>
          <div class="score-title" style="margin-top:12px">PART B — MAKES VS MISSES</div>
          <div class="hm-row">
            <button class="hm-btn hit-btn" onclick="hmScore('${id}-b','hit','${chNum}')">+ HIT</button>
            <button class="hm-btn miss-btn" onclick="hmScore('${id}-b','miss','${chNum}')">+ MISS</button>
            <div class="tally"><span class="big" id="${id}-b-hits">0</span> / <span id="${id}-b-total">0</span></div>
          </div>
          <button class="btn-reset" onclick="dotsReset('${id}-straight',8);dotsReset('${id}-left',8);dotsReset('${id}-right',8);hmReset('${id}-b')">[ RESET ]</button>
        </div>`;

    case 'pointTracker':
      return `
        <div class="score-block">
          <div class="score-title">${escHtml(s.label||'POINTS')}</div>
          <div class="score-row" style="gap:14px;margin-top:4px">
            <button class="hm-btn hit-btn" style="padding:8px 14px;min-height:44px" onclick="ptAdd('${id}',1,'${s.maxPts||100}','${chNum}')">+1</button>
            <button class="hm-btn hit-btn" style="padding:8px 14px;min-height:44px" onclick="ptAdd('${id}',2,'${s.maxPts||100}','${chNum}')">+2</button>
            <button class="hm-btn hit-btn" style="padding:8px 14px;min-height:44px" onclick="ptAdd('${id}',3,'${s.maxPts||100}','${chNum}')">+3</button>
            <button class="hm-undo-btn" onclick="ptUndo('${id}')">UNDO</button>
          </div>
          <div class="streak-row" style="margin-top:10px">
            <div class="streak-num" id="pt-${id}">0</div>
            <div><div class="streak-info">Score</div><div class="streak-goal">PERFECT: ${s.maxPts||'—'}</div></div>
          </div>
          <button class="btn-reset" onclick="ptReset('${id}')">[ RESET ]</button>
        </div>`;

    case 'pointTrackerAB':
      return `
        <div class="score-block">
          <div class="score-title">${escHtml(s.label||'SCORE')}</div>
          <div class="stitle">PART A — MAX ${s.maxPtsA}</div>
          <div class="score-row" style="gap:10px">
            <button class="hm-btn hit-btn" style="padding:6px 10px;min-height:40px;font-size:9px" onclick="ptAdd('${id}-a',1,'${s.maxPtsA}','${chNum}')">+1</button>
            <button class="hm-btn hit-btn" style="padding:6px 10px;min-height:40px;font-size:9px" onclick="ptAdd('${id}-a',2,'${s.maxPtsA}','${chNum}')">+2</button>
            <button class="hm-btn hit-btn" style="padding:6px 10px;min-height:40px;font-size:9px" onclick="ptAdd('${id}-a',3,'${s.maxPtsA}','${chNum}')">+3</button>
            <span class="streak-num" id="pt-${id}-a" style="font-size:24px">0</span>
          </div>
          <div class="stitle">PART B — MAX ${s.maxPtsB}</div>
          <div class="score-row" style="gap:10px">
            <button class="hm-btn hit-btn" style="padding:6px 10px;min-height:40px;font-size:9px" onclick="ptAdd('${id}-b',1,'${s.maxPtsB}','${chNum}')">+1</button>
            <button class="hm-btn hit-btn" style="padding:6px 10px;min-height:40px;font-size:9px" onclick="ptAdd('${id}-b',2,'${s.maxPtsB}','${chNum}')">+2</button>
            <button class="hm-btn hit-btn" style="padding:6px 10px;min-height:40px;font-size:9px" onclick="ptAdd('${id}-b',3,'${s.maxPtsB}','${chNum}')">+3</button>
            <span class="streak-num" id="pt-${id}-b" style="font-size:24px">0</span>
          </div>
          <button class="btn-reset" onclick="ptReset('${id}-a');ptReset('${id}-b')">[ RESET ]</button>
        </div>`;

    case 'ghostGame':
      return `
        <div class="score-block">
          <div class="score-title">GHOST SCORECARD</div>
          <table class="ghost-table">
            <thead><tr><th>RACK</th><th>BALLS RUN</th><th>POSSIBLE</th><th>MISS POS</th><th>MISS SHOT</th></tr></thead>
            <tbody id="ghost-${id}-body">
              ${Array.from({length:5},(_,i)=>`
                <tr>
                  <td>${i+1}</td>
                  <td><input type="number" min="0" max="9" placeholder="—" onchange="ghostUpdate('${id}',${i},'run',this.value,'${chNum}')" id="gh-${id}-${i}-run"/></td>
                  <td id="gh-${id}-${i}-pos">—</td>
                  <td><select onchange="ghostUpdate('${id}',${i},'mp',this.value,'${chNum}')" style="background:var(--panel2);border:1px solid var(--border);color:var(--text);font-size:11px;padding:4px"><option value="">—</option><option>Yes</option><option>No</option></select></td>
                  <td><select onchange="ghostUpdate('${id}',${i},'ms',this.value,'${chNum}')" style="background:var(--panel2);border:1px solid var(--border);color:var(--text);font-size:11px;padding:4px"><option value="">—</option><option>Yes</option><option>No</option></select></td>
                </tr>`).join('')}
            </tbody>
          </table>
          <div class="pt-row"><span>TOTAL BALLS RUN</span><span class="pt-val" id="gh-${id}-total">0</span></div>
          <div class="pt-row"><span>PERCENTAGE</span><span class="pt-val" id="gh-${id}-pct">—</span></div>
          <button class="btn-reset" onclick="ghostReset('${id}')">[ RESET ]</button>
        </div>`;

    default:
      return '';
  }
}

/* ──────────────────────────────────────────
   CH3 OVERVIEW (Special Section)
────────────────────────────────────────── */
function renderCh3Overview(view, chNum) {
  const ratingsData = [
    {id:'setup',label:'SET UP'},
    {id:'cycle',label:'COMPLETE SHOT CYCLE'},
    {id:'pace',label:'STROKE PACE'},
    {id:'warmup',label:'WARM UP STROKES'},
    {id:'transition',label:'TRANSITION'},
    {id:'forward',label:'FORWARD STROKE'},
    {id:'contact',label:'CONTACT / THE HIT'},
    {id:'followthru',label:'FOLLOW THROUGH'},
    {id:'straight',label:'STRAIGHTNESS'},
    {id:'feel',label:'FEEL'},
    {id:'groove',label:'GROOVING TECHNIQUE'},
    {id:'length',label:'LENGTH OF STROKE'}
  ];

  view.innerHTML = `
    <button class="back-btn" onclick="openChapter(3)">← FUNDAMENTALS FIRST</button>
    <div class="sec-hdr">
      <div class="sh-tag">CH.03 // OVERVIEW</div>
      <div class="sh-name">FUNDAMENTALS RATINGS</div>
      <div class="sh-desc">Rate each fundamental area using Capelle's 1-2-3 scale. These ratings update as you complete drill sections.</div>
    </div>
    <div class="info-box">
      <span class="ib-lbl">RATING SCALE</span>
      1 = Needs lots of work (possibly a complete overhaul)<br>
      2 = Needs polishing<br>
      3 = In very good shape — maintain and fine-tune
    </div>
    <div class="stitle">YOUR FUNDAMENTAL RATINGS // TAP TO RATE</div>
    <div class="ratings-grid" id="ratingsGrid">
      ${ratingsData.map(r=>`
        <div class="rating-card">
          <span class="rc-label">${r.label}</span>
          <div class="rc-stars" id="rstar-${r.id}">
            <div class="star" onclick="setRating('${r.id}',1)">1</div>
            <div class="star" onclick="setRating('${r.id}',2)">2</div>
            <div class="star" onclick="setRating('${r.id}',3)">3</div>
          </div>
        </div>`).join('')}
    </div>
    <div class="stitle">CAPELLE SPEED SCALE // REFERENCE</div>
    <div class="speed-scale">
      ${[[1,'Extremely Soft'],[2,'Very Soft'],[3,'Soft'],[4,'Med Soft'],[5,'Medium'],[6,'Med Hard'],[7,'Hard'],[8,'Very Hard'],[9,'Extr Hard'],[10,'The Break']].map(([n,l])=>`
        <div class="ss-item"><div class="ss-num">${n}</div><div class="ss-lbl">${l}</div></div>`).join('')}
    </div>
  `;

  // Load saved ratings
  ratingsData.forEach(r => loadRating(r.id));
}

async function setRating(id, val) {
  await dbPut('ratings', { id, val });
  loadRating(id);
  refreshProgressRatings();
}

async function loadRating(id) {
  const r = await dbGet('ratings', id);
  const stars = document.querySelectorAll(`#rstar-${id} .star`);
  const val = r ? r.val : 0;
  stars.forEach((s, i) => {
    s.className = 'star';
    if (i+1 <= val) s.classList.add(`on${val}`);
  });
}

async function refreshProgressRatings() {
  const container = document.getElementById('progressRatings');
  if (!container) return;
  const ratingIds = ['setup','cycle','pace','warmup','transition','forward','contact','followthru','straight','feel','groove','length'];
  const labels    = ['SET UP','SHOT CYCLE','STROKE PACE','WARM UP','TRANSITION','FORWARD STROKE','CONTACT','FOLLOW THRU','STRAIGHTNESS','FEEL','GROOVING','STROKE LENGTH'];
  const ratingsObj = {};
  let html = '';
  for (let i = 0; i < ratingIds.length; i++) {
    const r = await dbGet('ratings', ratingIds[i]);
    const val = r ? r.val : 0;
    ratingsObj[ratingIds[i]] = val;
    const col = val===3?'var(--green)':val===2?'var(--gold)':val===1?'var(--red)':'var(--dim)';
    html += `
      <div class="rating-card">
        <span class="rc-label">${labels[i]}</span>
        <div style="font-family:'Rajdhani',sans-serif;font-size:20px;font-weight:700;color:${col}">${val||'—'}</div>
      </div>`;
  }
  container.innerHTML = html;
  // Render radar chart
  const radarWrap = document.getElementById('radarWrap');
  if (radarWrap) radarWrap.innerHTML = renderRadarChart(ratingsObj, ratingIds, labels);
}

/* ──────────────────────────────────────────
   SCORING ENGINES
────────────────────────────────────────── */
// HIT/MISS
const HM = {};
function hmScore(id, type, chNum) {
  if (!HM[id]) HM[id] = { h:0, m:0 };
  if (type === 'hit') HM[id].h++;
  else HM[id].m++;
  HM[id].last = type;
  updateHM(id);
  if (chNum) logSessionDrill(Number(chNum), id, 'hitMiss', HM[id]);
  setScore(id+'-hm', HM[id]);
}

function hmUndo(id) {
  if (!HM[id]) return;
  const last = HM[id].last;
  if (last === 'hit' && HM[id].h > 0) HM[id].h--;
  else if (last === 'miss' && HM[id].m > 0) HM[id].m--;
  HM[id].last = null;
  updateHM(id);
  setScore(id+'-hm', HM[id]);
}

function updateHM(id) {
  const h = HM[id]?.h || 0;
  const t = (HM[id]?.h || 0) + (HM[id]?.m || 0);
  const pct = t > 0 ? Math.round(h/t*100) : null;
  const hEl = document.getElementById(id+'-hits');
  const tEl = document.getElementById(id+'-total');
  const pEl = document.getElementById(id+'-pct');
  if (hEl) hEl.textContent = h;
  if (tEl) tEl.textContent = t;
  if (pEl && pct !== null) {
    pEl.textContent = pct+'%';
    pEl.className = pct >= 70 ? 'pct-hi' : pct >= 50 ? 'pct-mid' : 'pct-lo';
  }
}

function hmReset(id) {
  HM[id] = { h:0, m:0 };
  updateHM(id);
  setScore(id+'-hm', HM[id]);
}

// QUALITATIVE SCORE
async function qualScore(id, val, chNum) {
  const btns = document.querySelectorAll(`#qs-${id} .q-btn`);
  btns.forEach((b, i) => {
    b.className = 'q-btn';
    if (i+1 === Number(val)) b.classList.add('sel-'+val);
  });
  await setScore(id+'-qual', val);
  if (chNum) logSessionDrill(Number(chNum), id, 'qual', val);
}

function qualReset(id) {
  const btns = document.querySelectorAll(`#qs-${id} .q-btn`);
  btns.forEach(b => b.className = 'q-btn');
  setScore(id+'-qual', null);
}

// CHECKLIST
async function chkChange(id, idx, checked, chNum) {
  await setScore(`${id}-chk-${idx}`, checked);
  if (chNum) logSessionDrill(Number(chNum), id, 'checklist', { idx, checked });
}

// DOTS (tap cycle: null → hit → miss → null)
const DOTS_STATE = {};
function initDots(id, count) {
  const container = document.getElementById('dots-'+id);
  if (!container) return;
  if (!DOTS_STATE[id]) DOTS_STATE[id] = Array(count).fill(null);
  container.innerHTML = DOTS_STATE[id].map((s,i)=>`
    <div class="dot ${s||''}" onclick="dotTap('${id}',${i})"></div>`).join('');
}

function dotTap(id, idx) {
  if (!DOTS_STATE[id]) return;
  const cur = DOTS_STATE[id][idx];
  DOTS_STATE[id][idx] = cur === null ? 'hit' : cur === 'hit' ? 'miss' : null;
  const dot = document.querySelector(`#dots-${id} .dot:nth-child(${idx+1})`);
  if (dot) { dot.className = 'dot ' + (DOTS_STATE[id][idx]||''); }
  setScore(id+'-dots', DOTS_STATE[id]);
}

function dotsReset(id, count) {
  DOTS_STATE[id] = Array(count).fill(null);
  const container = document.getElementById('dots-'+id);
  if (container) container.querySelectorAll('.dot').forEach(d => d.className = 'dot');
  setScore(id+'-dots', null);
}

// STREAK
const STREAK_STATE = {};
function streakDotTap(id, version, idx) {
  const key = `${id}-v${version}`;
  if (!STREAK_STATE[key]) STREAK_STATE[key] = { dots:[], best:0, current:0 };
  const st = STREAK_STATE[key];
  const cur = st.dots[idx];
  st.dots[idx] = cur === null ? 'hit' : cur === 'hit' ? 'miss' : null;
  // recalculate streak
  let best = 0, cur2 = 0;
  for (const d of st.dots) {
    if (d === 'hit') { cur2++; best = Math.max(best, cur2); }
    else cur2 = 0;
  }
  st.best = best;
  renderStreakUI(id, version);
  setScore(id+'-v'+version+'-streak', st);
}

function renderStreakUI(id, version) {
  const key = `${id}-v${version}`;
  const st = STREAK_STATE[key];
  const container = document.getElementById(`dots-${id}-v${version}`);
  const numEl = document.getElementById(`streak-${id}-v${version}`);
  if (container && st) {
    container.innerHTML = st.dots.map((d,i)=>`<div class="dot ${d||''}" onclick="streakDotTap('${id}',${version},${i})"></div>`).join('');
  }
  if (numEl && st) numEl.textContent = st.best;
}

function streakReset(id) {
  for (let v = 1; v <= 3; v++) {
    const key = `${id}-v${v}`;
    STREAK_STATE[key] = { dots:Array(10).fill(null), best:0, current:0 };
    renderStreakUI(id, v);
    setScore(id+'-v'+v+'-streak', null);
  }
}

// Initialize streak dots
function initStreak(id, versions) {
  for (let v = 1; v <= versions; v++) {
    const key = `${id}-v${v}`;
    if (!STREAK_STATE[key]) STREAK_STATE[key] = { dots:Array(10).fill(null), best:0, current:0 };
    const container = document.getElementById(`dots-${id}-v${v}`);
    if (container) {
      container.innerHTML = STREAK_STATE[key].dots.map((d,i)=>`<div class="dot ${d||''}" onclick="streakDotTap('${id}',${v},${i})"></div>`).join('');
    }
  }
}

// RACK TRACKER
const RACK_STATE = {};
function initRacks(id, numRacks) {
  for (let r = 1; r <= numRacks; r++) {
    if (!RACK_STATE[id+'-r'+r]) RACK_STATE[id+'-r'+r] = Array(15).fill(null);
    initDots(id+'-r'+r, 15);
  }
}

function racksReset(id, numRacks) {
  for (let r = 1; r <= numRacks; r++) dotsReset(id+'-r'+r, 15);
}

// POINTS
const PT_VALS = {};
function ptAdd(id, val, max, chNum) {
  if (!PT_VALS[id]) PT_VALS[id] = 0;
  PT_VALS[id] = Math.min(PT_VALS[id] + val, max);
  const el = document.getElementById('pt-'+id);
  if (el) el.textContent = PT_VALS[id];
  setScore(id+'-pts', PT_VALS[id]);
  if (chNum) logSessionDrill(Number(chNum), id, 'points', PT_VALS[id]);
}

function ptUndo(id) {
  if (!PT_VALS[id] || PT_VALS[id] <= 0) return;
  PT_VALS[id]--;
  const el = document.getElementById('pt-'+id);
  if (el) el.textContent = PT_VALS[id];
  setScore(id+'-pts', PT_VALS[id]);
}

function ptReset(id) {
  PT_VALS[id] = 0;
  const el = document.getElementById('pt-'+id);
  if (el) el.textContent = '0';
  setScore(id+'-pts', 0);
}

// GHOST GAME
const GHOST_DATA = {};
function ghostUpdate(id, rack, field, value, chNum) {
  if (!GHOST_DATA[id]) GHOST_DATA[id] = Array(5).fill(null).map(()=>({run:0,mp:'',ms:''}));
  GHOST_DATA[id][rack][field] = field==='run' ? parseInt(value)||0 : value;
  // update possible (assuming 9-ball: max 9 per rack)
  const posEl = document.getElementById(`gh-${id}-${rack}-pos`);
  const run = GHOST_DATA[id][rack].run;
  if (posEl) posEl.textContent = run > 0 ? (run * 2 - 1) : '—';
  // totals
  const total = GHOST_DATA[id].reduce((s,r)=>s+(r.run||0),0);
  const possible = total * 2; // rough estimate
  const pct = possible > 0 ? Math.round(total/possible*100) : null;
  const tEl = document.getElementById(`gh-${id}-total`);
  const pEl = document.getElementById(`gh-${id}-pct`);
  if (tEl) tEl.textContent = total;
  if (pEl) pEl.textContent = pct !== null ? pct+'%' : '—';
  setScore(id+'-ghost', GHOST_DATA[id]);
  if (chNum) logSessionDrill(Number(chNum), id, 'ghost', GHOST_DATA[id]);
}

function ghostReset(id) {
  GHOST_DATA[id] = Array(5).fill(null).map(()=>({run:0,mp:'',ms:''}));
  ['total','pct'].forEach(k => { const el = document.getElementById(`gh-${id}-${k}`); if(el) el.textContent = k==='total'?'0':'—'; });
}

/* ──────────────────────────────────────────
   RESTORE DRILL SCORES (after render)
────────────────────────────────────────── */
async function restoreDrillScores(drill) {
  const s = drill.scoring;
  if (!s) return;
  const id = s.id;

  // Initialize dot containers
  if (s.type === 'streak' || s.type === 'streakVersions') {
    setTimeout(() => initStreak(id, s.versions || 3), 50);
  }
  if (s.type === 'rackTracker') {
    setTimeout(() => initRacks(id, s.racks || 5), 50);
  }
  if (s.type === 'dotsAB') {
    setTimeout(() => { initDots(id+'-a', s.dotsA||10); initDots(id+'-b', s.dotsB||10); }, 50);
  }
  if (s.type === 'dotsABCD') {
    setTimeout(() => { ['a','b','c','d'].forEach(l => initDots(id+'-'+l, 8)); }, 50);
  }
  if (s.type === 'landLine') {
    setTimeout(() => { ['straight','left','right'].forEach(d => initDots(id+'-'+d, 8)); }, 50);
  }

  // Restore HM scores
  if (['hitMiss','hitMissAB','hitMissMulti','bothSides','landLine'].includes(s.type)) {
    // These restore from SCORES cache — would need full restore logic
    // For now, just ensure UI is initialized
  }
}

/* ──────────────────────────────────────────
   NAVIGATION
────────────────────────────────────────── */
let currentTab = 'train';

function switchTab(tab) {
  currentTab = tab;
  document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tb-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.sb-btn').forEach(b => b.classList.remove('active'));
  const pane = document.getElementById('tab-'+tab);
  const btn  = document.getElementById('tb-'+tab);
  const sbBtn = document.getElementById('sb-'+tab);
  if (pane)  pane.classList.add('active');
  if (btn)   btn.classList.add('active');
  if (sbBtn) sbBtn.classList.add('active');

  const snav = document.getElementById('sectionNav');
  if (tab === 'train') {
    // Show snav if in chapter/section view
  } else {
    snav.style.display = 'none';
    document.getElementById('navContext').textContent = tab.toUpperCase();
  }

  if (tab === 'progress') refreshProgress();
  if (tab === 'settings') loadSettingsForm();
  if (tab === 'programs') renderPrograms();
}

function showChapterList() {
  document.getElementById('chapter-list-view').style.display = '';
  document.getElementById('chapter-detail-view').style.display = 'none';
  document.getElementById('section-detail-view').style.display = 'none';
  document.getElementById('navContext').textContent = 'TRAINING SYSTEM';
  const snav = document.getElementById('sectionNav');
  snav.style.display = 'none';
  const sbSnav = document.getElementById('sbSectionNav');
  if (sbSnav) sbSnav.innerHTML = '';
}

/* ──────────────────────────────────────────
   PROGRESS TAB
────────────────────────────────────────── */
async function refreshProgress() {
  const profile = await getProfile();
  const fargo = profile.fargo || 640;
  const goal = profile.fargoGoal || 750;
  const pct = Math.max(0, Math.min(100, ((fargo - 400) / (goal - 400)) * 100));

  document.getElementById('fargoDisplay').textContent = fargo;
  document.getElementById('fargoGoalDisplay').textContent = goal;
  document.getElementById('fargoFill').style.width = pct + '%';
  document.getElementById('fargoGap').textContent = (goal - fargo) + ' TO GO';
  document.getElementById('navFargo').textContent = 'FARGO ' + fargo;
  // Sync sidebar fargo
  const sbCur  = document.getElementById('sbFargoCur');
  const sbGoal = document.getElementById('sbFargoGoal');
  const sbFill = document.getElementById('sbFargoFill');
  if (sbCur)  sbCur.textContent = fargo;
  if (sbGoal) sbGoal.textContent = goal;
  if (sbFill) sbFill.style.width = pct + '%';

  const sessions = await dbGetAll('sessions');
  document.getElementById('statSessions').textContent = sessions.length;
  const drillCount = sessions.reduce((s,sess) => s + (sess.drills?.length||0), 0);
  document.getElementById('statDrills').textContent = drillCount;

  // Day streak
  const today = new Date().toLocaleDateString();
  const dates = [...new Set(sessions.map(s => s.date))].sort();
  document.getElementById('statStreak').textContent = dates.includes(today) ? '🔥' + (dates.length) : dates.length;

  // History
  const histEl = document.getElementById('sessionHistory');
  if (sessions.length === 0) {
    histEl.innerHTML = '<div class="empty-state">NO SESSIONS YET<br>START TRAINING TO SEE HISTORY</div>';
  } else {
    histEl.innerHTML = sessions.slice(-10).reverse().map(sess => `
      <div class="hist-item">
        <div>
          <div class="hist-drills">${sess.programName || 'Free Session'}</div>
          <div class="hist-date">${sess.date || 'Unknown date'}</div>
        </div>
        <div class="hist-score">${sess.drills?.length||0} DRILLS</div>
      </div>`).join('');
  }

  refreshProgressRatings();
}

/* ──────────────────────────────────────────
   SETTINGS TAB
────────────────────────────────────────── */
async function loadSettingsForm() {
  const profile = await getProfile();
  const fields = { name:'sf-name', persona:'sf-persona', table:'sf-table', cloth:'sf-cloth',
    cue:'sf-cue', shaft:'sf-shaft', fargo:'sf-fargo', fargoGoal:'sf-fargoGoal',
    hand:'sf-hand', bridge:'sf-bridge', fontSize:'sf-fontSize' };
  for (const [k, elId] of Object.entries(fields)) {
    const el = document.getElementById(elId);
    if (el && profile[k]) el.value = profile[k];
  }
}

async function saveSettings() {
  const data = {
    name: document.getElementById('sf-name')?.value,
    persona: document.getElementById('sf-persona')?.value,
    table: document.getElementById('sf-table')?.value,
    cloth: document.getElementById('sf-cloth')?.value,
    cue: document.getElementById('sf-cue')?.value,
    shaft: document.getElementById('sf-shaft')?.value,
    fargo: parseInt(document.getElementById('sf-fargo')?.value) || 640,
    fargoGoal: parseInt(document.getElementById('sf-fargoGoal')?.value) || 750,
    hand: document.getElementById('sf-hand')?.value,
    bridge: document.getElementById('sf-bridge')?.value,
    fontSize: document.getElementById('sf-fontSize')?.value
  };
  await saveProfile(data);

  // Update font size
  applyFontSize(data.fontSize);

  // Update fargo display
  document.getElementById('navFargo').textContent = 'FARGO ' + data.fargo;

  // Feedback
  const btn = document.querySelector('.sf-save-btn');
  const orig = btn.textContent;
  btn.textContent = '✓ SAVED';
  btn.style.background = 'var(--green)';
  setTimeout(() => { btn.textContent = orig; btn.style.background = ''; }, 1500);
}

function applyFontSize(size) {
  const root = document.documentElement;
  if (size === 'large') {
    root.style.setProperty('--base-fs', '16px');
    document.body.style.fontSize = '16px';
  } else if (size === 'xlarge') {
    root.style.setProperty('--base-fs', '18px');
    document.body.style.fontSize = '18px';
  } else {
    root.style.setProperty('--base-fs', '14px');
    document.body.style.fontSize = '14px';
  }
}

async function exportData() {
  const [scores, sessions, ratings] = await Promise.all([
    dbGetAll('scores'), dbGetAll('sessions'), dbGetAll('ratings'), dbGetAll('history'), dbGetAll('notes'), dbGetAll('bookmarks')
  ]);
  const data = { exportDate: new Date().toISOString(), scores, sessions, ratings };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'fgp-training-export.json'; a.click();
  URL.revokeObjectURL(url);
}

async function clearData() {
  if (!confirm('Clear ALL session data? This cannot be undone.')) return;
  await Promise.all([dbClear('scores'), dbClear('sessions'), dbClear('ratings'), dbClear('history'), dbClear('notes'), dbClear('bookmarks')]);
  activeSession = null;
  Object.keys(SCORES).forEach(k => delete SCORES[k]);
  Object.keys(HM).forEach(k => delete HM[k]);
  alert('All data cleared.');
}

/* ──────────────────────────────────────────
   PROGRAMS TAB
────────────────────────────────────────── */
function renderPrograms() {
  const container = document.getElementById('programs-list');
  container.innerHTML = PROGRAMS.map(prog => `
    <div class="program-card" onclick="startProgram('${prog.id}')">
      <div class="pc-name">${escHtml(prog.name)}</div>
      <div class="pc-meta">${prog.drills.length} DRILLS // ${prog.duration} // ${prog.difficulty}</div>
      <div class="pc-desc">${escHtml(prog.desc)}</div>
      <div style="margin-top:10px">
        ${prog.drills.slice(0,5).map(d=>`<div style="font-size:11px;color:var(--dim2);padding:2px 0">→ ${escHtml(d.name)}</div>`).join('')}
        ${prog.drills.length > 5 ? `<div style="font-size:11px;color:var(--dim)">... and ${prog.drills.length-5} more</div>` : ''}
      </div>
      <button class="prog-start-btn" onclick="event.stopPropagation();startProgram('${prog.id}')">START PROGRAM</button>
    </div>`).join('');
}

function startProgram(progId) {
  const prog = PROGRAMS.find(p => p.id === progId);
  if (!prog) return;
  activeSession = {
    id: Date.now(),
    date: new Date().toLocaleDateString(),
    programName: prog.name,
    programId: progId,
    programDrills: prog.drills,
    drills: []
  };
  dbPut('sessions', activeSession);
  switchTab('session');
  updateSessionTab();
}

function navigateToDrill(chNum, drillId) {
  switchTab('train');
  openChapter(chNum);
  const ch = CHAPTERS.find(c => c.num === chNum);
  if (!ch) return;
  for (let i = 0; i < ch.sections.length; i++) {
    if (ch.sections[i].drills.find(d => d.id === drillId)) {
      openSection(chNum, i);
      setTimeout(() => {
        const card = document.getElementById('card-'+drillId);
        if (card) { card.scrollIntoView({ behavior:'smooth', block:'start' }); toggleDrill(drillId); }
      }, 100);
      break;
    }
  }
}

/* ──────────────────────────────────────────
   ICONS (SVG-based, no external images needed)
────────────────────────────────────────── */
function generateIcons() {
  // Generate app icons as canvas data URLs for PWA
  const sizes = [192, 512];
  sizes.forEach(size => {
    const canvas = document.createElement('canvas');
    canvas.width = size; canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#0A0A0F';
    ctx.fillRect(0,0,size,size);
    ctx.fillStyle = '#00BFFF';
    ctx.font = `bold ${size*0.4}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = '#00BFFF';
    ctx.shadowBlur = size * 0.05;
    ctx.fillText('⚡', size/2, size/2);
    // Cache in service worker
  });
}

/* ──────────────────────────────────────────
   WEAKNESS RADAR CHART
────────────────────────────────────────── */
function renderRadarChart(ratingsObj, ids, labels) {
  const N  = ids.length;
  const CX = 145, CY = 145, R = 105, MAX = 3;
  const W  = 290, H = 290;
  const angle = i => (Math.PI * 2 * i / N) - Math.PI / 2;

  // Background rings
  let rings = '';
  for (let ring = 1; ring <= MAX; ring++) {
    const pts = ids.map((_, i) => {
      const r = (ring / MAX) * R;
      const a = angle(i);
      return `${(CX + Math.cos(a) * r).toFixed(1)},${(CY + Math.sin(a) * r).toFixed(1)}`;
    }).join(' ');
    const isOuter = ring === MAX;
    rings += `<polygon points="${pts}" fill="${isOuter ? '#00BFFF05' : 'none'}" stroke="${isOuter ? '#1a1a30' : '#111122'}" stroke-width="${isOuter ? 1 : 0.5}"/>`;
  }

  // Axis lines
  const axes = ids.map((_, i) => {
    const a = angle(i);
    return `<line x1="${CX}" y1="${CY}" x2="${(CX + Math.cos(a)*R).toFixed(1)}" y2="${(CY + Math.sin(a)*R).toFixed(1)}" stroke="#111122" stroke-width="0.5"/>`;
  }).join('');

  // Data polygon
  const dataPts = ids.map((id, i) => {
    const val = ratingsObj[id] || 0;
    const r   = (val / MAX) * R;
    const a   = angle(i);
    return `${(CX + Math.cos(a)*r).toFixed(1)},${(CY + Math.sin(a)*r).toFixed(1)}`;
  }).join(' ');

  const hasAny = ids.some(id => ratingsObj[id] > 0);
  const polygon = hasAny
    ? `<polygon points="${dataPts}" fill="#00BFFF18" stroke="var(--cyan)" stroke-width="1.5" stroke-linejoin="round"/>`
    : '';

  // Dots on each axis
  const dots = ids.map((id, i) => {
    const val = ratingsObj[id] || 0;
    if (!val) return '';
    const r   = (val / MAX) * R;
    const a   = angle(i);
    const col = val===3?'#00E676':val===2?'#F5C400':'#FF3D57';
    return `<circle cx="${(CX + Math.cos(a)*r).toFixed(1)}" cy="${(CY + Math.sin(a)*r).toFixed(1)}" r="3.5" fill="${col}" stroke="#0A0A0F" stroke-width="1"/>`;
  }).join('');

  // Labels
  const labelEls = ids.map((id, i) => {
    const a  = angle(i);
    const lr = R + 24;
    const x  = CX + Math.cos(a) * lr;
    const y  = CY + Math.sin(a) * lr;
    const anchor = x < CX - 8 ? 'end' : x > CX + 8 ? 'start' : 'middle';
    const val = ratingsObj[id] || 0;
    const col = val===3?'#00E676':val===2?'#F5C400':val===1?'#FF3D57':'#3a3a5a';
    return `<text x="${x.toFixed(1)}" y="${(y + 3.5).toFixed(1)}" text-anchor="${anchor}" font-family="'Courier New',monospace" font-size="7" letter-spacing="0.5" fill="${col}">${labels[i]}</text>`;
  }).join('');

  // Center label
  const ratedCount = ids.filter(id => ratingsObj[id] > 0).length;
  const avgVal = ratedCount > 0 ? (ids.reduce((s,id) => s + (ratingsObj[id]||0), 0) / ratedCount).toFixed(1) : '—';

  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="overflow:visible;display:block">
    ${rings}${axes}${polygon}${dots}${labelEls}
    <text x="${CX}" y="${CY - 6}" text-anchor="middle" font-family="'Rajdhani',sans-serif" font-size="20" font-weight="700" fill="var(--cyan)">${avgVal}</text>
    <text x="${CX}" y="${CY + 9}" text-anchor="middle" font-family="'Courier New',monospace" font-size="7" letter-spacing="2" fill="var(--dim2)">AVG RATING</text>
  </svg>`;
}

/* ──────────────────────────────────────────
   CHAPTER COMPLETION
────────────────────────────────────────── */
async function loadChapterCompletion() {
  const allScores = await dbGetAll('scores');
  const scoredIds = new Set(allScores.map(s => s.id));
  CHAPTERS.forEach(ch => {
    const scorable = ch.sections.flatMap(s => s.drills.filter(d => d.scoring));
    if (!scorable.length) return;
    const done = scorable.filter(d => scoredIds.has(d.scoring.id || d.id)).length;
    const pct  = Math.round(done / scorable.length * 100);
    const el   = document.getElementById('ch-pct-' + ch.num);
    if (!el) return;
    if (pct === 0) { el.textContent = ''; return; }
    el.textContent = pct + '%';
    el.style.color = pct === 100 ? 'var(--green)' : 'var(--gold)';
  });
}

/* ──────────────────────────────────────────
   BOOKMARKS
────────────────────────────────────────── */
async function toggleBookmark(drillId, chNum, drillName) {
  const existing = await dbGet('bookmarks', drillId);
  if (existing) {
    await new Promise((res, rej) => {
      const tx = db.transaction('bookmarks', 'readwrite');
      tx.objectStore('bookmarks').delete(drillId);
      tx.oncomplete = res; tx.onerror = rej;
    });
  } else {
    await dbPut('bookmarks', { drillId, chNum, drillName, ts: Date.now() });
  }
  const btn = document.getElementById('bk-' + drillId);
  if (btn) { btn.textContent = existing ? '☆' : '★'; btn.classList.toggle('bk-on', !existing); }
  renderBookmarksPanel();
}

async function loadBookmarkStates(drillIds) {
  for (const id of drillIds) {
    const bk  = await dbGet('bookmarks', id);
    const btn = document.getElementById('bk-' + id);
    if (btn) { btn.textContent = bk ? '★' : '☆'; btn.classList.toggle('bk-on', !!bk); }
  }
}

async function renderBookmarksPanel() {
  const panel = document.getElementById('bookmarks-panel');
  if (!panel) return;
  const all = await dbGetAll('bookmarks');
  if (!all.length) { panel.innerHTML = ''; return; }
  all.sort((a, b) => b.ts - a.ts);
  panel.innerHTML = `
    <div class="bk-panel">
      <div class="bk-panel-hdr">
        <span>★ FAVORITES</span>
        <span style="font-size:8px;color:var(--dim)">${all.length} DRILL${all.length!==1?'S':''}</span>
      </div>
      <div class="bk-list">
        ${all.map(bk => `
          <div class="bk-item" onclick="navigateToDrill(${bk.chNum},'${bk.drillId}')">
            <span class="bk-item-ch">CH.${String(bk.chNum).padStart(2,'0')}</span>
            <span class="bk-item-name">${escHtml(bk.drillName)}</span>
            <button class="bk-remove" onclick="event.stopPropagation();toggleBookmark('${bk.drillId}',${bk.chNum},'${escHtml(bk.drillName)}')" title="Remove">✕</button>
          </div>`).join('')}
      </div>
    </div>`;
}

/* ──────────────────────────────────────────
   DAILY PLAN GENERATOR
────────────────────────────────────────── */
let planTime = 60;

function selectPlanTime(mins) {
  planTime = mins;
  document.querySelectorAll('.dp-t').forEach(b => {
    b.classList.toggle('active', parseInt(b.dataset.min) === mins);
  });
}

async function buildAndShowPlan() {
  const btn = document.getElementById('dpBuildBtn');
  if (btn) { btn.textContent = 'ANALYZING…'; btn.disabled = true; }
  try {
    const result = await buildDailyPlan(planTime);
    showPlanResult(result);
  } finally {
    if (btn) { btn.textContent = '⚡ BUILD TODAY\'S SESSION'; btn.disabled = false; }
  }
}

async function buildDailyPlan(minutes) {
  const allHistory = await dbGetAll('history');
  const histMap = {};
  allHistory.forEach(h => { histMap[h.id] = h; });

  const now = Date.now();
  const candidates = [];

  for (const ch of CHAPTERS) {
    for (const sec of ch.sections) {
      for (const drill of sec.drills) {
        if (!drill.scoring) continue;
        const sid   = drill.scoring.id || drill.id;
        const hist  = histMap[sid];
        const entries = hist?.entries || [];
        const last  = entries[entries.length - 1];
        const lastTs  = last?.ts || 0;
        const lastVal = last?.v ?? null;
        const daysSince = lastTs ? (now - lastTs) / 86400000 : 999;

        let need = 0;
        if (!lastTs) {
          need = 75 + Math.random() * 15; // never done
        } else {
          if (lastVal !== null) {
            if      (lastVal < 35) need += 60;
            else if (lastVal < 55) need += 40;
            else if (lastVal < 70) need += 20;
            else                   need += 5;
          }
          need += Math.min(28, daysSince * 2.5);
          if (entries.length >= 3) {
            const recent = entries.slice(-3).map(e => e.v);
            if (recent[2] < recent[0]) need += 15; // declining trend
          }
        }

        candidates.push({
          drill, chNum: ch.num, chTitle: ch.title, secTitle: sec.title,
          need, dur: getDrillDuration(drill),
          isStrong: lastVal !== null && lastVal >= 70,
          lastVal, daysSince
        });
      }
    }
  }

  candidates.sort((a, b) => b.need - a.need);

  const plan = [];
  let used = 0;

  // Always include 1 confidence (strong) drill
  const strongPool = candidates.filter(c => c.isStrong);
  if (strongPool.length) {
    const pick = strongPool[Math.floor(Math.random() * Math.min(3, strongPool.length))];
    plan.push({ ...pick, tag: 'CONFIDENCE' });
    used += pick.dur;
  }

  // Fill with highest-need drills
  for (const c of candidates) {
    if (used >= minutes) break;
    if (plan.find(p => p.drill.id === c.drill.id)) continue;
    if (used + c.dur > minutes + 8) continue;
    plan.push(c);
    used += c.dur;
  }

  return { drills: plan.sort((a, b) => a.chNum - b.chNum), totalMin: used };
}

function getDrillDuration(drill) {
  switch (drill.scoring?.type) {
    case 'checklist': case 'qual': case 'qualChecklist': return 5;
    case 'hitMiss': case 'hitMissAB': return 8;
    case 'streak': case 'streakVersions': return 10;
    case 'rackTracker': return 10;
    case 'ghostGame': return 15;
    case 'pointTracker': case 'pointTrackerAB': return 8;
    default: return 7;
  }
}

function showPlanResult(result) {
  const { drills, totalMin } = result;
  document.getElementById('chapter-list-view').style.display = 'none';
  const view = document.getElementById('plan-result-view');
  view.style.display = '';

  // Store for start button
  window._planDrills = drills;

  view.innerHTML = `
    <button class="back-btn" onclick="hidePlanResult()">← BACK TO CHAPTERS</button>
    <div class="sec-hdr" style="margin-bottom:16px">
      <div class="sh-tag">DAILY PLAN // ~${totalMin} MINUTES // ${drills.length} DRILLS</div>
      <div class="sh-name">TODAY'S SESSION</div>
      <div class="sh-desc">Drills selected based on your score history, recency, and improvement trends. Weakest areas prioritized first.</div>
    </div>
    ${drills.map(item => `
      <div class="plan-drill-card" onclick="navigateToDrill(${item.chNum},'${item.drill.id}')">
        <div class="pdc-left">
          <div class="pdc-ch">CH.${String(item.chNum).padStart(2,'0')} // ${escHtml(item.chTitle.toUpperCase())}</div>
          <div class="pdc-name">${escHtml(item.drill.name)}</div>
          <div class="pdc-sec">${escHtml(item.secTitle)}</div>
        </div>
        <div class="pdc-right">
          ${item.tag ? `<div class="pdc-tag pdc-confidence">★ ${item.tag}</div>` : ''}
          ${item.lastVal !== null
            ? `<div class="pdc-score" style="color:${item.lastVal>=70?'var(--green)':item.lastVal>=50?'var(--gold)':'var(--red)'}">${Math.round(item.lastVal)}%</div>`
            : '<div class="pdc-score" style="color:var(--dim)">NEW</div>'}
          <div class="pdc-dur">~${item.dur}m</div>
        </div>
      </div>`).join('')}
    <button class="sf-save-btn" style="margin-top:16px" onclick="startPlanAsSession()">START THIS SESSION ▶</button>
  `;
}

function hidePlanResult() {
  document.getElementById('plan-result-view').style.display = 'none';
  document.getElementById('chapter-list-view').style.display = '';
}

function startPlanAsSession() {
  const drills = window._planDrills || [];
  const progDrills = drills.map(d => ({ id: d.drill.id, ch: d.chNum, name: d.drill.name }));
  activeSession = {
    id: Date.now(),
    date: new Date().toLocaleDateString(),
    programName: 'DAILY PLAN',
    programId: 'daily-plan',
    programDrills: progDrills,
    drills: []
  };
  dbPut('sessions', activeSession);
  hidePlanResult();
  switchTab('session');
  updateSessionTab();
}

/* ──────────────────────────────────────────
   SPARKLINES
────────────────────────────────────────── */
function makeSpark(entries) {
  if (!entries || entries.length < 2) return '';
  const pts  = entries.slice(-10);
  const vals = pts.map(e => typeof e.v === 'number' ? e.v : 0);
  const min  = Math.min(...vals);
  const max  = Math.max(...vals);
  const range = max - min || 1;
  const W = 52, H = 18;
  const coords = vals.map((v, i) => {
    const x = (1 + (i / (vals.length - 1)) * (W - 2)).toFixed(1);
    const y = (H - 2 - ((v - min) / range) * (H - 4)).toFixed(1);
    return `${x},${y}`;
  });
  const [lx, ly] = coords[coords.length - 1].split(',');
  const trend = vals[vals.length - 1] - vals[0];
  const col   = trend > 0 ? 'var(--green)' : trend < 0 ? 'var(--red)' : 'var(--cyan)';
  return `<svg class="spark-svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <polyline points="${coords.join(' ')}" fill="none" stroke="${col}" stroke-width="1.5" stroke-linejoin="round"/>
    <circle cx="${lx}" cy="${ly}" r="2.5" fill="${col}"/>
  </svg>`;
}

async function loadSparklines(drills) {
  for (const d of drills) {
    const hist = await dbGet('history', d.id);
    if (!hist || !hist.entries || hist.entries.length < 2) continue;
    const el = document.getElementById('spark-' + d.id);
    if (el) el.innerHTML = makeSpark(hist.entries);
  }
}

/* ──────────────────────────────────────────
   DRILL NOTES
────────────────────────────────────────── */
const _noteTimers = {};

function noteSave(id) {
  clearTimeout(_noteTimers[id]);
  _noteTimers[id] = setTimeout(async () => {
    const ta  = document.getElementById('note-' + id);
    if (!ta) return;
    const text = ta.value;
    await dbPut('notes', { id, text, ts: Date.now() });
    const ind = document.getElementById('note-ind-' + id);
    if (ind) ind.style.display = text.trim() ? 'inline-block' : 'none';
  }, 600);
}

async function loadNotes(drills) {
  for (const d of drills) {
    const note = await dbGet('notes', d.id);
    if (!note || !note.text) continue;
    const ta = document.getElementById('note-' + d.id);
    if (ta) ta.value = note.text;
    const ind = document.getElementById('note-ind-' + d.id);
    if (ind) ind.style.display = 'inline-block';
  }
}

/* ──────────────────────────────────────────
   SESSION SUMMARY
────────────────────────────────────────── */
function showSessionSummary(session) {
  const old = document.getElementById('session-summary');
  if (old) old.remove();

  const durationMs  = (session.ended || Date.now()) - session.id;
  const mins        = Math.max(1, Math.round(durationMs / 60000));
  const drillCount  = session.drills?.length || 0;
  const progTotal   = session.programDrills?.length || 0;
  const pct         = progTotal ? Math.round(drillCount / progTotal * 100) : null;

  const wrap = document.createElement('div');
  wrap.id = 'session-summary';
  wrap.innerHTML = `
    <div class="ss-modal">
      <div class="ss-check">⚡ SESSION COMPLETE</div>
      ${session.programName ? `<div class="ss-progname">${escHtml(session.programName)}</div>` : '<div class="ss-progname">FREE SESSION</div>'}
      <div class="ss-stats">
        <div class="ss-stat">
          <div class="ss-num">${drillCount}</div>
          <div class="ss-lbl">DRILLS</div>
        </div>
        <div class="ss-stat">
          <div class="ss-num">${mins}m</div>
          <div class="ss-lbl">TIME</div>
        </div>
        ${pct !== null ? `
        <div class="ss-stat">
          <div class="ss-num">${pct}%</div>
          <div class="ss-lbl">COMPLETE</div>
        </div>` : ''}
      </div>
      <div class="ss-btns">
        <button class="ss-btn-primary" onclick="dismissSummary('progress')">VIEW PROGRESS →</button>
        <button class="ss-btn-secondary" onclick="dismissSummary('train')">BACK TO TRAINING</button>
      </div>
    </div>`;
  document.body.appendChild(wrap);
}

function dismissSummary(tab) {
  const el = document.getElementById('session-summary');
  if (el) el.remove();
  if (tab) switchTab(tab);
}

/* ──────────────────────────────────────────
   KEYBOARD SHORTCUTS
────────────────────────────────────────── */
function initKeyboardShortcuts() {
  document.addEventListener('keydown', e => {
    // Skip when typing
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;

    const key = e.key;

    // Global: N = next drill in program
    if (key === 'n' || key === 'N') { toastAdvance(); return; }

    if (!activeDrill) return;
    const { drill, chNum } = activeDrill;
    const s = drill.scoring;

    switch (key) {
      case 'h': case 'H':
        if (s && ['hitMiss','hitMissAB','hitMissMulti'].includes(s.type)) hmScore(s.id, 'hit', chNum);
        break;
      case 'm': case 'M':
        if (s && ['hitMiss','hitMissAB','hitMissMulti'].includes(s.type)) hmScore(s.id, 'miss', chNum);
        break;
      case 'u': case 'U':
        if (s && ['hitMiss','hitMissAB'].includes(s.type)) hmUndo(s.id);
        break;
      case '1':
        if (s && ['qual','qualAB','qualChecklist'].includes(s.type)) qualScore(s.id, 1, chNum);
        break;
      case '2':
        if (s && ['qual','qualAB','qualChecklist'].includes(s.type)) qualScore(s.id, 2, chNum);
        break;
      case '3':
        if (s && ['qual','qualAB','qualChecklist'].includes(s.type)) qualScore(s.id, 3, chNum);
        break;
      case 'r': case 'R':
        if (!s) break;
        if (['hitMiss','hitMissAB'].includes(s.type)) hmReset(s.id);
        else if (['qual','qualAB','qualChecklist'].includes(s.type)) qualReset(s.id);
        break;
      case ' ':
        e.preventDefault();
        toggleDrill(drill.id);
        break;
    }
  });
}

/* ──────────────────────────────────────────
   UTILITY
────────────────────────────────────────── */
function escHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* ──────────────────────────────────────────
   PWA: SERVICE WORKER + INSTALL PROMPT
────────────────────────────────────────── */
let deferredPrompt = null;

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('SW registered:', reg.scope))
      .catch(err => console.warn('SW registration failed:', err));
  });
}

window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredPrompt = e;
  const banner = document.getElementById('installBanner');
  if (banner) banner.classList.add('show');
});

document.getElementById('installBtn')?.addEventListener('click', async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  if (outcome === 'accepted') {
    document.getElementById('installBanner')?.classList.remove('show');
  }
  deferredPrompt = null;
});

document.getElementById('installClose')?.addEventListener('click', () => {
  document.getElementById('installBanner')?.classList.remove('show');
});

/* ──────────────────────────────────────────
   WAKE LOCK API
────────────────────────────────────────── */
let wakeLock = null;
async function requestWakeLock() {
  if ('wakeLock' in navigator) {
    try { wakeLock = await navigator.wakeLock.request('screen'); }
    catch(e) { console.log('Wake lock not available'); }
  }
}

document.addEventListener('visibilitychange', async () => {
  if (document.visibilityState === 'visible' && wakeLock !== null) {
    try { wakeLock = await navigator.wakeLock.request('screen'); }
    catch(e) {}
  }
});

/* ──────────────────────────────────────────
   SPLASH SCREEN
────────────────────────────────────────── */
async function boot() {
  const bar = document.getElementById('splashBar');
  let progress = 0;
  const tick = () => {
    progress = Math.min(progress + Math.random() * 20, 90);
    bar.style.width = progress + '%';
  };
  const iv = setInterval(tick, 150);

  try {
    await initDB();
    clearInterval(iv);
    bar.style.width = '100%';
    await new Promise(r => setTimeout(r, 300));

    // Load profile and apply settings
    const profile = await getProfile();
    if (profile.fargo) document.getElementById('navFargo').textContent = 'FARGO ' + profile.fargo;
    if (profile.fontSize) applyFontSize(profile.fontSize);
    // Init sidebar fargo
    const sbCur  = document.getElementById('sbFargoCur');
    const sbGoal = document.getElementById('sbFargoGoal');
    const sbFill = document.getElementById('sbFargoFill');
    const fargo  = profile.fargo || 640;
    const goal   = profile.fargoGoal || 750;
    const pct    = Math.max(0, Math.min(100, ((fargo - 400) / (goal - 400)) * 100));
    if (sbCur)  sbCur.textContent = fargo;
    if (sbGoal) sbGoal.textContent = goal;
    if (sbFill) sbFill.style.width = pct + '%';

    // Render UI
    renderChapterGrid();
    renderPrograms();
    updateSessionTab();

    // Keyboard shortcuts
    initKeyboardShortcuts();

    // Request wake lock
    requestWakeLock();

    // Hide splash
    const splash = document.getElementById('splash');
    splash.classList.add('hidden');
    setTimeout(() => { splash.style.display = 'none'; }, 500);

  } catch(err) {
    console.error('Boot error:', err);
    clearInterval(iv);
    bar.style.width = '100%';
    bar.style.background = 'var(--red)';
    document.getElementById('splash').innerHTML += `<div style="color:var(--red);font-size:11px;margin-top:10px">ERROR: ${err.message}</div>`;
  }
}

// Start the app
boot();
