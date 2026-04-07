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
  subtitle:'Build your stroke and start pocketing balls quickly',
  color:'gold', drillCount:10,
  sections:[
    {
      id:'s2-stroke', title:'THE STROKE',
      desc:'Build a fundamentally sound stroke from the ground up — setup, timing, and full follow-through.',
      drills:[
        {
          id:'d-setup', name:'THE SET UP', accent:'cyan', tags:['SETUP','STROKE'],
          cure:'A poor setup makes a good stroke nearly impossible before you even pull the cue back.',
          objective:'Establish a correct, repeatable setup: 8" bridge length with the cue parallel to the table.',
          steps:[
            'Place a ball on the table. Take your stance and form your bridge 8 inches from the cue tip.',
            'Check that your cue is level and parallel to the table surface — not elevated at the butt.',
            'Your tip should be aimed at the vertical center of the ball.',
            'Repeat 10 times, resetting completely between each attempt.'
          ],
          review:'The setup is the foundation. If your bridge length and cue angle are inconsistent, every shot starts from a different place.',
          diagram: `<img loading="lazy" src="diagrams/d-setup.png" alt="The Set Up diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'qual', id:'d-setup', labels:{ 1:'1 — INCONSISTENT', 2:'2 — CLOSE', 3:'3 — SOLID SETUP' } }
        },
        {
          id:'d-stroketime', name:'STROKE TIME', accent:'gold', tags:['STROKE','PACE'],
          cure:'Rushing the stroke or using an inconsistent rhythm prevents you from delivering the cue on the correct path.',
          objective:'Develop a smooth, rhythmic stroke with consistent timing from backstroke to follow-through. (Part A)',
          setup:'Place ball 1 near the left long rail. Set up as shown. Use pocket E (left side) as the target.',
          steps:[
            'PART A: Take your stance near the long rail. Focus only on the timing and rhythm of the stroke — not the result.',
            'Execute 10 practice strokes without shooting. Feel the backstroke pause and smooth forward delivery.',
            'Now shoot 5 balls. Rate how consistent your rhythm felt stroke to stroke.'
          ],
          review:'Timing is the engine of a good stroke. A smooth, repeatable rhythm produces repeatable results.',
          diagram: `<img loading="lazy" src="diagrams/d-stroketime.png" alt="Stroke Time diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'qual', id:'d-stroketime', labels:{ 1:'1 — RUSHED / CHOPPY', 2:'2 — IMPROVING', 3:'3 — SMOOTH RHYTHM' } }
        },
        {
          id:'d-completestroke', name:'THE COMPLETE STROKE', accent:'green', tags:['STROKE','FOLLOW-THROUGH'],
          cure:'An incomplete follow-through kills speed control and causes the cue to deflect at contact.',
          objective:'Execute a full stroke with complete follow-through, finishing with the tip near the cloth. (Part B)',
          setup:'Line up 3–4 balls near the right rail leading toward pocket F (bottom right corner), as shown.',
          steps:[
            'PART B: Shoot each ball in sequence toward pocket F.',
            'After each shot, hold your finish position — tip near the cloth, cue still, body quiet.',
            'Do not pull back or stand up before the ball reaches the pocket.',
            'Shoot all balls, resetting after each. Record how many you held the complete finish.'
          ],
          review:'The follow-through is not decorative — it ensures the cue travels through the ball rather than at it. Hold the pose.',
          diagram: `<img loading="lazy" src="diagrams/d-completestroke.png" alt="The Complete Stroke diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMiss', id:'d-completestroke', label:'COMPLETE FOLLOW-THROUGHS', showPct:true }
        }
      ]
    },
    {
      id:'s2-pocketing', title:'POCKETING',
      desc:'Apply your stroke to pocketing balls — from the pocket jaws out to longer positions.',
      drills:[
        {
          id:'d-goalposts', name:'SPLITTING THE GOAL POSTS', accent:'cyan', tags:['AIMING','ACCURACY'],
          cure:'Players who do not visualize the full pocket opening leave easy balls short or miss wide.',
          objective:'Train your eye to aim at the center of the pocket opening, not the near jaw.',
          setup:'Place a ball near the center of the table as shown. The target is the corner pocket.',
          steps:[
            'Before every shot, consciously identify both pocket jaws — the full goal post width.',
            'Aim for dead center of the opening, not the near jaw.',
            'Shoot 10 balls from the setup position.',
            'Rate how clearly you saw the full pocket opening before pulling the trigger.'
          ],
          review:'The pocket is wider than it looks from the table. Players who aim for the center of the opening make far more balls than those aiming at an edge.',
          diagram: `<img loading="lazy" src="diagrams/d-goalposts.png" alt="Splitting the Goal Posts diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMiss', id:'d-goalposts', label:'CENTER-POCKET MAKES', showPct:true }
        },
        {
          id:'d-targetpractice', name:'TARGET PRACTICE', accent:'gold', tags:['ACCURACY','SPEED'],
          cure:'Without a target zone, practice becomes aimless. Every shot needs a defined success condition.',
          objective:'Pocket balls while controlling the cue ball to land in a defined target zone.',
          setup:'Place 3 balls on the left side (Medium Soft, Speed 4). Target zones are Line A and Line B on the right side of the table, as shown.',
          steps:[
            'Shoot each of the 3 balls toward the corner pocket.',
            'Your goal: land the CB in the Line A zone after contact.',
            'Repeat for Line B zone.',
            'Track how many CBs land in each target zone.'
          ],
          review:'If you can make the ball and land in the zone 6/10 times, your speed control is developing. Below that, focus on matching speed to distance.',
          diagram: `<img loading="lazy" src="diagrams/d-targetpractice.png" alt="Target Practice diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMissAB', id:'d-targetpractice', labelA:'LINE A MAKES', labelB:'LINE B MAKES', shots:10 }
        },
        {
          id:'d-intopocket', name:'INTO THE POCKET', accent:'red', tags:['POCKETING','SHOTMAKING'],
          cure:'Short-range pocketing builds confidence and grooves the mechanics before moving to longer shots.',
          objective:'Reliably pocket balls from close range, building distance progressively. (Part A)',
          setup:'Part A: Place OB near pocket A (top-left corner). CB at medium distance, as shown. Speed: Medium (5).',
          steps:[
            'PART A: Shoot 10 balls from the setup position into pocket A.',
            'Use your full routine on every shot — no casual strokes.',
            'Focus on a smooth stroke and a complete finish.'
          ],
          review:'If you are missing from this close range, the problem is in your setup or stroke — not your aim. Go back to The Set Up drill.',
          diagram: `<img loading="lazy" src="diagrams/d-intopocket.png" alt="Into the Pocket diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMiss', id:'d-intopocket', label:'PART A MAKES', showPct:true }
        },
        {
          id:'d-followin', name:'FOLLOW IT IN EXERCISE', accent:'green', tags:['POCKETING','FOLLOW-THROUGH'],
          cure:'Players who look up early or pull back the cue lose the shot at the moment of truth.',
          objective:'Keep your eyes and cue on the line until the ball drops. (Part B)',
          setup:'Part B: Line up balls near the right rail toward pocket C/F. Use Medium (5) speed.',
          steps:[
            'Shoot each ball toward the pocket.',
            'After contact, keep your eyes on the object ball — follow it visually all the way into the pocket.',
            'Hold your finish position until you hear the ball drop.',
            'Shoot all balls. Rate how consistently you followed through and kept your head down.'
          ],
          review:'The "follow it in" habit prevents peeking — the single most common cause of misses at all levels.',
          diagram: `<img loading="lazy" src="diagrams/d-followin.png" alt="Follow It In Exercise diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMiss', id:'d-followin', label:'PART B MAKES', showPct:true }
        }
      ]
    },
    {
      id:'s2-speed', title:'SPEED OF STROKE',
      desc:'Learn to feel and repeat different speeds — the foundation of cue ball control.',
      drills:[
        {
          id:'d-secondcb', name:'THE SECOND CUEBALL', accent:'cyan', tags:['SPEED','POSITION'],
          cure:'Players who ignore the cue ball after contact never develop reliable position play.',
          objective:'Treat the cue ball as a second object ball — know where it will go before you shoot.',
          setup:'Place OB and CB as shown. Mark a target zone 2½ inches from contact point. Use Medium (5) speed.',
          steps:[
            'Before each shot, predict where the CB will travel after contact.',
            'Shoot the OB and observe the CB path.',
            'Did the CB go where you predicted? If not, adjust your mental model.',
            'Shoot 10 balls. Rate how accurately you predicted CB direction.'
          ],
          review:'Position play begins with predicting CB direction. You cannot control what you cannot predict.',
          diagram: `<img loading="lazy" src="diagrams/d-secondcb.png" alt="The Second Cueball diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'qual', id:'d-secondcb', labels:{ 1:'1 — UNPREDICTABLE', 2:'2 — ROUGHLY RIGHT', 3:'3 — ACCURATE PREDICTION' } }
        },
        {
          id:'d-shootdonut', name:'SHOOTING THE DONUT', accent:'gold', tags:['ACCURACY','AIMING'],
          cure:'Aiming at a small target sharpens focus and exposes stroke errors that a full pocket opening hides.',
          objective:'Pocket balls aimed at a donut target rather than the full pocket opening.',
          setup:'Place donuts as shown — two setups on the table, one left, one right. Use the donut as your aiming target.',
          steps:[
            'LEFT SETUP: Shoot 5 balls, aiming to pass through the donut on the way to the pocket.',
            'RIGHT SETUP: Shoot 5 balls, same concept.',
            'The donut is a smaller target than the pocket. Any miss reveals aiming or stroke inconsistency.'
          ],
          review:'When you can consistently aim through a donut, a full-size pocket feels huge. Use this drill to sharpen a drifting aim.',
          diagram: `<img loading="lazy" src="diagrams/d-shootdonut.png" alt="Shooting the Donut diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMissAB', id:'d-shootdonut', labelA:'LEFT SETUP', labelB:'RIGHT SETUP', shots:5 }
        },
        {
          id:'d-feelspeed', name:'FEELING YOUR SPEED OF STROKE', accent:'green', tags:['SPEED','CONTROL'],
          cure:'Players who cannot vary speed reliably are forced to play position only on accidental routes.',
          objective:'Develop feel for three distinct speed levels — soft, medium, and firm — on command.',
          setup:'CB at bottom of table. Positions A (short), B (medium), C (long) marked up the table, as shown.',
          steps:[
            'POSITION A — SOFT: Send CB to the A zone using the softest stroke that still reaches.',
            'POSITION B — MEDIUM: Send CB to the B zone with a smooth medium stroke.',
            'POSITION C — FIRM: Send CB to the C zone with a controlled firm stroke.',
            'Shoot 3 attempts at each position. Rate how consistently the CB lands in the correct zone.'
          ],
          review:'Speed control is a feel skill — you develop it through repetition, not thinking. If a speed level is inconsistent, isolate it and practice only that level for a full session.',
          diagram: `<img loading="lazy" src="diagrams/d-feelspeed.png" alt="Feeling Your Speed of Stroke diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'qual', id:'d-feelspeed', labels:{ 1:'1 — ONE SPEED', 2:'2 — TWO SPEEDS', 3:'3 — ALL THREE DISTINCT' } }
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
  color:'cyan', drillCount:24,
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
          diagram: `<img loading="lazy" src="diagrams/d-landline.png" alt="Land in Line diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
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
          diagram: `<img loading="lazy" src="diagrams/d-refpoints.png" alt="Reference Points Exercise diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
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
          diagram: `<img loading="lazy" src="diagrams/d-mission.png" alt="Mission Aborted diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
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
          diagram: `<img loading="lazy" src="diagrams/d-slowdown.png" alt="Slooow Way Down diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
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
          diagram: `<img loading="lazy" src="diagrams/d-onehanded.png" alt="The One Handed Stroke diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
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
          diagram: `<img loading="lazy" src="diagrams/d-cuecheck.png" alt="Checking for Cueing Errors diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
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
          diagram: `<img loading="lazy" src="diagrams/d-gosignal.png" alt="Preparing for the Go Signal diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
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
          diagram: `<img loading="lazy" src="diagrams/d-transition.png" alt="Slooow Down Your Transition diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
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
          diagram: `<img loading="lazy" src="diagrams/d-nothing.png" alt="Nothing Shots diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
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
          diagram: `<img loading="lazy" src="diagrams/d-allstraight.png" alt="All Shots Are Straight diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
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
          diagram: `<img loading="lazy" src="diagrams/d-fastpart.png" alt="The Fast Part — Acceleration diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
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
          diagram: `<img loading="lazy" src="diagrams/d-startshort.png" alt="Start Short and Add Length diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
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
          diagram: `<img loading="lazy" src="diagrams/d-cuediamond.png" alt="Cue Over the Diamond diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
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
          diagram: `<img loading="lazy" src="diagrams/d-5donuts.png" alt="5 Donuts in a Row diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
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
  color:'gold', drillCount:55,
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
          diagram: `<img loading="lazy" src="diagrams/d-closure-a.png" alt="Closure Exercise Part A" style="width:100%;border-radius:8px;margin-top:8px"><img loading="lazy" src="diagrams/d-closure-b.png" alt="Closure Exercise Part B" style="width:100%;border-radius:8px;margin-top:4px">`,
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
          diagram: `<img loading="lazy" src="diagrams/d-twocuts.png" alt="A Tale of Two Cut Shots diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
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
          diagram: `<img loading="lazy" src="diagrams/d-straight-near.png" alt="Straight and Near-Straight Shots diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
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
          diagram: `<img loading="lazy" src="diagrams/d-crossover.png" alt="The Crossover Point diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
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
          diagram: `<img loading="lazy" src="diagrams/d-cutting-rail.png" alt="Cutting Into and Away From Rail diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
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
          diagram: `<img loading="lazy" src="diagrams/d-identical.png" alt="Both Sides of Identical Shots diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'bothSides', id:'d-identical', shots:['A','B','C','D'], shotsEach:5 }
        },
        {
          id:'d-shotpicture', name:'THE SHOT PICTURE', accent:'cyan', tags:['REFERENCE','AIMING','SHOTPICTURE'],
          cure:'Players who cannot construct a clear Shot Picture before pulling the trigger are shooting blind.',
          objective:'Understand and apply the Shot Picture — the complete mental image of CB path, OB path, and pocket.',
          steps:[
            'Set up a cut shot. Before getting down, stand behind the shot and build the Shot Picture: see the CB traveling to the ghost ball, the OB rolling to the pocket.',
            'The Shot Picture includes: the angle of the cut, the speed of the CB, the path of the OB, and the target pocket.',
            'Get down on the shot. Execute only when the Shot Picture is clear and complete.',
            'Repeat on 5 different shots — straight-in, 20°, 30°, 45°, 60° cuts. Rate Shot Picture clarity on each.'
          ],
          review:'A weak or blurry Shot Picture is a warning sign. Do not shoot until the picture is clear. Reset if it fades during warm-up strokes.',
          tip:'Phil says: The Shot Picture is your mental image of the completed shot. The stronger and more vivid the picture, the more reliably your subconscious can execute it.',
          diagram: `<img loading="lazy" src="diagrams/d-shotpicture.png" alt="The Shot Picture diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'qual', id:'d-shotpicture', labels:{ 1:'BLURRY / NO PICTURE', 2:'PARTIAL PICTURE', 3:'CLEAR SHOT PICTURE' } }
        },
        {
          id:'d-narrowfocus', name:'NARROWING YOUR FOCUS', accent:'gold', tags:['AIMING','CONCENTRATION'],
          cure:'Players who look at too many things during the shot lose their aim point and introduce errors.',
          objective:'Train yourself to narrow visual focus to the single most important aiming element at each stage of the shot.',
          steps:[
            'PLANNING PHASE: Look at the pocket, then the OB, then the ghost ball position. Build the Shot Picture.',
            'APPROACH: Walk in with eyes on the line of aim between CB and ghost ball.',
            'WARM-UP STROKES: Focus on the contact point on the OB — not the pocket, not the CB.',
            'FINAL STROKE: Lock gaze on the OB contact point. The pocket is in your peripheral vision.',
            'Practice 10 shots, deliberately cycling through each focus phase.'
          ],
          review:'The most common focus error is switching back to the pocket during warm-up strokes. Once you are down, the OB contact point is your only visual anchor.',
          diagram: `<img loading="lazy" src="diagrams/d-narrowfocus.png" alt="Narrowing Your Focus diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'qual', id:'d-narrowfocus', labels:{ 1:'FOCUS ALL OVER', 2:'SOMETIMES LOCKED', 3:'FOCUSED EVERY SHOT' } }
        },
        {
          id:'d-cutangle', name:'THE CUT ANGLE AND THE SHOOTING ANGLE', accent:'red', tags:['AIMING','CUT ANGLES'],
          cure:'Confusing the cut angle with the shooting angle leads to systematic aiming errors on all cut shots.',
          objective:'Understand the difference between cut angle (OB to pocket) and shooting angle (CB to OB) and how they relate.',
          steps:[
            'Set up a 30° cut shot. Identify the cut angle — the angle the OB must travel to reach the pocket.',
            'Now identify the shooting angle — the angle your CB must approach the OB to produce that cut.',
            'The shooting angle is always different from the cut angle. The ghost ball shows you where to aim.',
            'Practice on 5 cut angles (15°, 30°, 45°, 60°, 75°). For each, explicitly identify both angles before shooting.'
          ],
          review:'This distinction clears up the most common aiming confusion. Once you understand that you aim at the ghost ball (not the pocket), the geometry becomes intuitive.',
          diagram: `<img loading="lazy" src="diagrams/d-cutangle.png" alt="The Cut Angle and the Shooting Angle diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMissMulti', id:'d-cutangle', groups:['15°','30°','45°','60°','75°'], shots:5 }
        },
        {
          id:'d-pocketspeed', name:'FIND YOUR BEST POCKETING SPEED', accent:'green', tags:['SPEED','POCKETING'],
          cure:'Using the wrong speed reduces effective pocket size and increases deflection errors.',
          objective:'Identify and train with the speed that gives you the highest pocketing percentage on each shot type.',
          steps:[
            'Set up a medium-length cut shot. Shoot 5 balls at Speed 3 (soft). Record makes.',
            'Shoot 5 balls at Speed 5 (medium). Record makes.',
            'Shoot 5 balls at Speed 7 (firm). Record makes.',
            'Compare results. Your best pocketing speed is where the pocket "feels biggest." Use that speed as your default for similar shots.'
          ],
          review:'Most players have a speed comfort zone where their accuracy peaks. Find yours and practice expanding it in both directions.',
          diagram: `<img loading="lazy" src="diagrams/d-pocketspeed.png" alt="Find Your Best Pocketing Speed diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMissMulti', id:'d-pocketspeed', groups:['SPEED 3','SPEED 5','SPEED 7'], shots:5 }
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
          diagram: `<img loading="lazy" src="diagrams/d-side-bonanza.png" alt="Side Pocket Bonanza diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'pointTracker', id:'d-side-bonanza', maxPts:61, label:'SIDE POCKET BONANZA SCORE' }
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
          diagram: `<img loading="lazy" src="diagrams/d-side-short.png" alt="Side Pockets Short Side diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'pointTracker', id:'d-side-short', maxPts:103, label:'SIDE POCKET SHORT SIDE SCORE' }
        }
      ]
    },
    {
      id:'s4-corner', title:'CORNER POCKET PLAY',
      desc:'Corner pockets are the primary target in most pool games. Master every angle from both sides.',
      drills:[
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
          diagram: `<img loading="lazy" src="diagrams/d-short-side.png" alt="Corner Pockets Short Side diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'pointTrackerAB', id:'d-corner-short', maxPtsA:50, maxPtsB:50, label:'SHORT SIDE SCORE' }
        },
        {
          id:'d-longdistance', name:'LONG DISTANCE', accent:'red', tags:['CORNER POCKET','PROGRESSIVE'],
          cure:'Long distance shots demand maximum Shot Picture clarity and expose any stroke or aim inconsistency.',
          objective:'Build accuracy on long-distance shotmaking from all positions.',
          steps:[
            'Set up shots as shown at long distance across the table.',
            'Use your full routine — Shot Picture first, then approach, then execute.',
            'Shoot 5 from each position. Track makes by position.'
          ],
          review:'Long distance accuracy is the clearest indicator of stroke quality. If your close-range percentage is much higher, the stroke is the problem.',
          diagram: `<img loading="lazy" src="diagrams/d-longdistance.png" alt="Long Distance diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMiss', id:'d-longdistance', label:'LONG DISTANCE MAKES', showPct:true }
        },
        {
          id:'d-longmiddle', name:'THE LONG MIDDLE', accent:'cyan', tags:['CORNER POCKET','PROGRESSIVE'],
          cure:'Long middle-table shots are frequently encountered but rarely drilled — a costly gap in most players\' games.',
          objective:'Build accuracy on long shots through the middle of the table.',
          steps:[
            'Set up shots as shown through the middle of the table at full length.',
            'Aim carefully — middle table shots have no rail to anchor your aim.',
            'Shoot 5 from each position. Note which angles give the most trouble.'
          ],
          review:'The long middle is a confidence builder. Consistent makes here indicate your stroke and aim system are working together.',
          diagram: `<img loading="lazy" src="diagrams/d-longmiddle.png" alt="The Long Middle diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMiss', id:'d-longmiddle', label:'LONG MIDDLE MAKES', showPct:true }
        },
        {
          id:'d-sixdiamonds', name:'SIX DIAMONDS', accent:'gold', tags:['CORNER POCKET','PROGRESSIVE'],
          cure:'Covering all six diamonds systematically ensures no area of the table becomes a blind spot.',
          objective:'Shoot accurately to each of the six diamond positions across the table.',
          steps:[
            'Set up the drill as shown, with target positions at each diamond.',
            'Work through each diamond position in sequence.',
            'Shoot 3 from each position. Track makes by diamond number.'
          ],
          review:'The six diamonds cover every major lateral position on the table. Consistent results across all six means no table area intimidates you.',
          diagram: `<img loading="lazy" src="diagrams/d-sixdiamonds.png" alt="Six Diamonds diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMiss', id:'d-sixdiamonds', label:'SIX DIAMONDS MAKES', showPct:true }
        },
        {
          id:'d-unusual', name:'UNUSUAL SHOTS ACROSS THE TABLE', accent:'green', tags:['CORNER POCKET','ADVANCED'],
          cure:'Unusual cross-table angles appear in every game. Players who avoid them give up easy points.',
          objective:'Build confidence on atypical cross-table shots that most players never practice.',
          steps:[
            'Set up the unusual cross-table shots as shown.',
            'These shots often feature awkward angles or uncomfortable CB positions.',
            'Use your full routine. Do not rush — these shots reward patience.',
            'Shoot 5 from each position.'
          ],
          review:'The unusual shot that beats you in a match is almost always one you\'ve never practiced. This drill closes that gap.',
          diagram: `<img loading="lazy" src="diagrams/d-unusual.png" alt="Unusual Shots Across the Table diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMiss', id:'d-unusual', label:'UNUSUAL SHOT MAKES', showPct:true }
        },
        {
          id:'d-downtable', name:'DOWN THE TABLE', accent:'red', tags:['CORNER POCKET','PROGRESSIVE'],
          cure:'Down-table shots at full length are among the most difficult in pool — and among the most common in nine ball.',
          objective:'Build accuracy on straight and near-straight shots played down the full length of the table.',
          steps:[
            'Set up CB and OB as shown, aligned down the table.',
            'Use a smooth, level stroke. Any elevation kills accuracy at this distance.',
            'Shoot 5 from each position. Stay down on every shot.'
          ],
          review:'If your down-table percentage drops significantly compared to short shots, return to the Super Slow Stroke drill and rebuild from there.',
          diagram: `<img loading="lazy" src="diagrams/d-downtable.png" alt="Down the Table diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMiss', id:'d-downtable', label:'DOWN-TABLE MAKES', showPct:true }
        },
        {
          id:'d-yesmaybeno', name:'YES, MAYBE, NO', accent:'gold', tags:['CORNER POCKET','DECISION MAKING'],
          cure:'Attempting shots you cannot make reliably is one of the fastest ways to lose frames.',
          objective:'Learn to accurately classify shots as Yes (high make rate), Maybe (50/50), or No (low make rate).',
          steps:[
            'Set up the shots shown. Before each one, call it: YES, MAYBE, or NO based on your honest assessment.',
            'Shoot 5 attempts at each shot. Record actual make percentage.',
            'Compare your prediction to the result. Were your YES shots really 80%+? Were your NO shots under 30%?',
            'Recalibrate your assessments based on the data.'
          ],
          review:'Accurate self-assessment is a strategic skill. Players who know what they can and cannot make choose better shots under pressure.',
          diagram: `<img loading="lazy" src="diagrams/d-yesmaybeno.png" alt="Yes Maybe No diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMissMulti', id:'d-yesmaybeno', groups:['YES SHOTS','MAYBE SHOTS','NO SHOTS'], shots:5 }
        },
        {
          id:'d-downrail', name:'DOWN THE RAIL SHOTS', accent:'cyan', tags:['CORNER POCKET','RAIL SHOTS'],
          cure:'Rail shots down the length of the table are among the most common shots in straight pool and nine ball.',
          objective:'Build accuracy on progressive down-the-rail shots from short to full table length.',
          steps:[
            'Place OB near the rail. CB at varying distances behind it, shooting toward the far corner pocket.',
            'Start close (2 feet) and progressively move CB back in one-diamond increments.',
            'Keep cue level, use a short bridge (6"), and accelerate smoothly through the ball.',
            'Shoot 5 from each distance. Record makes.'
          ],
          review:'The most common error on down-rail shots is elevating the cue as the CB gets closer to the rail. Stay level.',
          diagram: `<img loading="lazy" src="diagrams/d-downrail.png" alt="Down the Rail Shots diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMiss', id:'d-downrail', label:'DOWN-RAIL MAKES', showPct:true }
        },
        {
          id:'d-thinrail', name:'THIN CUTS DOWN THE RAIL', accent:'gold', tags:['CORNER POCKET','CUT ANGLES'],
          cure:'Thin rail cuts require a different aim point and stroke than standard rail shots — most players undercut them.',
          objective:'Develop accuracy on thin-angle cuts where the OB is near the rail.',
          steps:[
            'Place OB near the long rail. CB positioned for a thin cut (30° or less) toward the far pocket.',
            'Aim thinner than feels natural — the rail reduces the effective pocket opening.',
            'Use a medium-firm stroke. Too soft and the OB hugs the rail and misses; too hard and it kicks off.',
            'Shoot 10 balls. Track makes and note your aim adjustment.'
          ],
          review:'Thin cuts along the rail are deceptive. The closer to the rail, the thinner you must aim to account for rail interference.',
          diagram: `<img loading="lazy" src="diagrams/d-thinrail.png" alt="Thin Cuts Down the Rail diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMiss', id:'d-thinrail', label:'THIN RAIL MAKES', showPct:true }
        },
        {
          id:'d-fullthinrail', name:'FULL TO THIN RAIL SHOTS', accent:'green', tags:['CORNER POCKET','PROGRESSIVE'],
          cure:'Rail shots cover a wide range of cut angles. Practicing the full spectrum builds complete rail shot competence.',
          objective:'Progress through rail shots from full-ball hits to thin cuts, building accuracy at every angle.',
          steps:[
            'FULL HIT: OB near the rail, CB directly behind it. Straight-in shot down the rail. Shoot 5.',
            'HALF BALL: Move CB slightly off-line for a half-ball cut. Shoot 5.',
            'QUARTER BALL (THIN): Move CB further for a thin cut along the rail. Shoot 5.',
            'Compare makes at each angle. Identify where your accuracy drops and focus practice there.'
          ],
          review:'Most players are strongest at the angle they practice most. This drill forces you to cover the entire rail shot spectrum.',
          diagram: `<img loading="lazy" src="diagrams/d-fullthinrail.png" alt="Full to Thin Rail Shots diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMissMulti', id:'d-fullthinrail', groups:['FULL HIT','HALF BALL','THIN CUT'], shots:5 }
        },
        {
          id:'d-limbo', name:'THE LIMBO', accent:'red', tags:['CORNER POCKET','TECHNIQUE'],
          cure:'When the CB is very close to the rail, the cue must clear the rail — players either miscue or elevate too much.',
          objective:'Execute clean strokes when the CB is frozen or near-frozen to the long rail.',
          steps:[
            'Place CB frozen to the long rail. OB 2 feet ahead along the rail toward the corner pocket.',
            'Use a mechanical bridge or an elevated rail bridge. Keep the stroke as level as possible.',
            'Do not force the shot — a smooth, level stroke is required. Power kills accuracy here.',
            'Shoot 10 balls. Rate stroke smoothness and make percentage.'
          ],
          review:'The Limbo tests your ability to execute technically difficult positions. Players who practice this shot gain a significant advantage on balls near the rail.',
          diagram: `<img loading="lazy" src="diagrams/d-limbo.png" alt="The Limbo diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMiss', id:'d-limbo', label:'LIMBO MAKES', showPct:true }
        },
        {
          id:'d-longrail', name:'LONG DISTANCE DOWN THE RAIL SHOTS', accent:'gold', tags:['CORNER POCKET','ADVANCED'],
          cure:'Long rail shots are among the most difficult in the game — they expose every flaw in level of stroke and aim.',
          objective:'Build accuracy on full-table-length rail shots from both the left and right rails.',
          steps:[
            'Place OB near the corner pocket. CB at the opposite end of the table near the same rail.',
            'The shot is nearly straight with the OB tight to the rail — aim must be precise.',
            'Use a firm stroke (Speed 6-7). Keep the cue absolutely level.',
            'Shoot 5 from the left rail, 5 from the right rail. Track makes and misses by direction.'
          ],
          review:'Missing wide on this shot usually means a cue elevation problem. Missing into the rail means you aimed too full. Both are common and correctable.',
          diagram: `<img loading="lazy" src="diagrams/d-longrail.png" alt="Long Distance Down the Rail Shots diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMissAB', id:'d-longrail', labelA:'LEFT RAIL', labelB:'RIGHT RAIL', shots:5 }
        },
        {
          id:'d-back-fwd-cuts', name:'BACK CUTS AND FORWARD CUTS', accent:'cyan', tags:['CORNER POCKET','CUT ANGLES'],
          cure:'Back cuts and forward cuts near the rail require different aim adjustments and different CB paths afterward.',
          objective:'Build equal proficiency on both back cuts (cutting away from rail) and forward cuts (cutting toward opposite rail).',
          steps:[
            'BACK CUTS: OB near the long rail, cut it back toward the near pocket. The CB stays near the rail. Shoot 5.',
            'FORWARD CUTS: Same OB position, but cut toward the far pocket across the table. The CB travels away from the rail. Shoot 5.',
            'Compare results. Note how the CB path differs dramatically between the two cuts.',
            'Advance to positions closer to the rail where the margin shrinks.'
          ],
          review:'Most players are significantly stronger at one direction. Once you know your weak cut, practice it 3-to-1 over your strong cut.',
          diagram: `<img loading="lazy" src="diagrams/d-cutting-rail-b.png" alt="Back Cuts and Forward Cuts diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMissAB', id:'d-back-fwd-cuts', labelA:'BACK CUTS', labelB:'FORWARD CUTS', shots:5 }
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
        },
        {
          id:'d-what-english', name:'WHAT ENGLISH DOES', accent:'cyan', tags:['ENGLISH','REFERENCE'],
          cure:'Most players misuse english because they don\'t fully understand its three effects.',
          objective:'Experience and identify throw, deflection, and rail rebound change from english.',
          steps:[
            'Study the diagram — it illustrates all three english effects from a single CB position.',
            'THROW: Spin rotates the OB off the aim line. Noticeable at slow speeds.',
            'DEFLECTION: CB veers off its path due to tip offset. Increases with speed.',
            'RAIL CHANGE: English alters the CB\'s rebound angle at the rail.',
            'Shoot 5 shots emphasizing each effect and confirm you observed it.'
          ],
          review:'Once you can predict all three effects, english becomes a precision tool instead of a source of misses.',
          diagram: `<img loading="lazy" src="diagrams/d-what-english.png" alt="What English Does" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'checklist', id:'d-what-english', items:['Experienced throw','Experienced deflection','Experienced rail rebound change','Can predict all three on a new shot'] }
        },
        {
          id:'d-frozen-english', name:'FROZEN SHOTS WITH ENGLISH', accent:'gold', tags:['ENGLISH','TECHNIQUE'],
          cure:'When the OB is frozen to the rail, english has unusual and often counterintuitive effects on both OB direction and CB path.',
          objective:'Learn how english behaves when the OB is frozen to the cushion.',
          steps:[
            'Freeze the OB against the long rail as shown.',
            'PART A — INSIDE ENGLISH: OB throws away from the rail. CB path changes predictably.',
            'PART B — OUTSIDE ENGLISH: OB stays tight to the rail. CB angles out.',
            'Shoot 5 of each. The key insight: inside english is usually safer on frozen balls.'
          ],
          review:'Frozen ball shots punish english errors more than open-table shots. Master the safe options first before experimenting.',
          diagram: `<img loading="lazy" src="diagrams/d-frozen-english.png" alt="Frozen Shots with English" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMissAB', id:'d-frozen-english', labelA:'INSIDE ENGLISH', labelB:'OUTSIDE ENGLISH', shots:5 }
        },
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
          diagram: `<img loading="lazy" src="diagrams/d-bank-basics.png" alt="Speed and Bank Shots diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
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
          diagram: `<img loading="lazy" src="diagrams/d-bank-english.png" alt="English and Bank Shots diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
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
          diagram: `<img loading="lazy" src="diagrams/d-crossover-bank.png" alt="Crossover Bank Shots diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMissAB', id:'d-crossover-bank', labelA:'PART A', labelB:'PART B', shots:5 }
        },
        {
          id:'d-bank-shortrail', name:'TYPICAL SHORT RAIL BANK SHOTS', accent:'cyan', tags:['BANKS','RAIL'],
          cure:'Short rail banks are the most common bank shots in the game yet most players have no systematic approach to them.',
          objective:'Build a reliable short-rail bank system from the most common positions.',
          steps:[
            'Set up the typical short rail bank positions as shown.',
            'Use a medium stroke as your default. Adjust speed only when the angle demands it.',
            'Shoot 5 from each position. Track makes by position.'
          ],
          review:'Short rail banks are makeable shots. A player with a reliable short-rail bank is a dangerous opponent at any skill level.',
          diagram: `<img loading="lazy" src="diagrams/d-bank-shortrail.png" alt="Typical Short Rail Bank Shots diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMiss', id:'d-bank-shortrail', label:'SHORT RAIL BANK MAKES', showPct:true }
        },
        {
          id:'d-bank-spin', name:'SPINNING IN BANK SHOTS', accent:'gold', tags:['BANKS','ENGLISH'],
          cure:'Outside english (spin) can "spin in" a bank that appears to be going long — a powerful weapon when mastered.',
          objective:'Learn to use outside english to tighten bank angles and spin balls into pockets.',
          steps:[
            'Set up the bank shots as shown. Shoot each with center ball first and note where OB finishes.',
            'Repeat with a half tip of outside english (spin away from pocket side). Note the tighter angle.',
            'Experiment with the amount of spin needed for each shot to spin it into the pocket.',
            'Shoot 5 center ball, then 5 with spin. Compare make rates.'
          ],
          review:'Spinning in bank shots requires precision — too much spin and the ball overshoots. The correct amount turns a near-miss into a make.',
          diagram: `<img loading="lazy" src="diagrams/d-bank-spin.png" alt="Spinning In Bank Shots diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMissAB', id:'d-bank-spin', labelA:'CENTER BALL', labelB:'WITH SPIN', shots:5 }
        },
        {
          id:'d-bank-longrail', name:'TYPICAL LONG RAIL BANK SHOTS', accent:'red', tags:['BANKS','RAIL'],
          cure:'Long rail banks travel across the full table width and require a different speed and aim than short rail banks.',
          objective:'Build accuracy on typical long-rail bank shot positions.',
          steps:[
            'Set up the typical long rail bank positions as shown.',
            'Long rail banks generally require a firmer stroke than short rail banks.',
            'Compensate for table roll — long rail banks are affected more by table conditions.',
            'Shoot 5 from each position.'
          ],
          review:'Long rail banks are high-reward shots. A player who can make them consistently has a significant strategic advantage.',
          diagram: `<img loading="lazy" src="diagrams/d-bank-longrail.png" alt="Typical Long Rail Bank Shots diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMiss', id:'d-bank-longrail', label:'LONG RAIL BANK MAKES', showPct:true }
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
          diagram: `<img loading="lazy" src="diagrams/d-rail-across.png" alt="Rail Shots Across and Down Table diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
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
          diagram: `<img loading="lazy" src="diagrams/d-rail-length.png" alt="Table Length Rail Shots diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMissAB', id:'d-rail-length', labelA:'PART A', labelB:'PART B', shots:5 }
        },
        {
          id:'d-breadbutter', name:'BREAD AND BUTTER RAIL SHOTS', accent:'gold', tags:['RAIL SHOTS','FUNDAMENTAL'],
          cure:'The bread and butter rail shots are the ones you will face every single session — they must be automatic.',
          objective:'Master the most common rail shot positions until they are fully automatic.',
          steps:[
            'Set up the bread and butter positions as shown — these are the rail shots you encounter constantly.',
            'Shoot each position 10 times. Use your full routine on every single shot.',
            'Track your make percentage. Target 80%+ on all positions before considering these "owned."'
          ],
          review:'These are the shots you cannot afford to miss in competition. If your percentage on any position is below 70%, it becomes your top practice priority.',
          diagram: `<img loading="lazy" src="diagrams/d-breadbutter.png" alt="Bread and Butter Rail Shots diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMiss', id:'d-breadbutter', label:'B&B RAIL MAKES', showPct:true }
        },
        {
          id:'d-jackingup', name:'JACKING UP', accent:'red', tags:['RAIL SHOTS','TECHNIQUE'],
          cure:'When the CB is very close to the rail, the cue must be elevated — most players either avoid these shots or miscue badly.',
          objective:'Develop a reliable elevated-cue technique for CB positions frozen or near-frozen to the rail.',
          steps:[
            'Place CB frozen to the long rail as shown. You must elevate the cue to clear the rail cushion.',
            'Raise the butt of the cue to the required elevation. Keep your bridge as low and stable as possible.',
            'Use a smooth, controlled stroke. Elevation increases draw and reduces follow — adjust aim accordingly.',
            'Shoot 10 balls from the setup. Rate stroke smoothness and make percentage.'
          ],
          review:'Jacking up is a necessary skill, not a last resort. Players who own this technique gain shots that others must pass on.',
          diagram: `<img loading="lazy" src="diagrams/d-jackingup.png" alt="Jacking Up diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMiss', id:'d-jackingup', label:'JACKING UP MAKES', showPct:true }
        }
      ]
    },
    {
      id:'s4-mag11', title:'THE MAGNIFICENT 11',
      desc:'11 progressive shotmaking positions covering every area of the table. Three difficulty levels per shot — Beginner, Average/Intermediate, and Advanced.',
      drills:[
        {
          id:'d-mag-1', name:'#1 — THE FOUNDATION SHOTS', accent:'cyan', tags:['MAGNIFICENT 11','SHOTMAKING'],
          cure:'The foundation shots establish your baseline accuracy across the most common table positions.',
          objective:'Pocket balls from the foundation CB positions at the correct speed for your level.',
          setup:'Beginners: Medium (5). Average/Intermediate: Medium Soft (4) to Medium Hard (6). Advanced: Speed & cueing your choice.',
          steps:[
            'Set up the OB at position 1 as shown. Select CB positions appropriate for your level.',
            'Shoot each CB position in sequence. Use your full pre-shot routine on every shot.',
            'Record makes and misses. Do not move on until you are comfortable at your current level.'
          ],
          review:'These foundation shots appear constantly in real games. Mastery here pays dividends in every session.',
          diagram: `<img loading="lazy" src="diagrams/d-mag-1.png" alt="Magnificent 11 — Shot 1: The Foundation Shots" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMiss', id:'d-mag-1', label:'SHOT 1 MAKES', showPct:true }
        },
        {
          id:'d-mag-2', name:'#2 — LOWER OFF RAIL', accent:'gold', tags:['MAGNIFICENT 11','RAIL SHOTS'],
          cure:'Off-rail shots in the lower half of the table demand precise aim and a level stroke.',
          objective:'Pocket balls from CB positions in the lower area, with the OB off the rail.',
          setup:'Beginners: Medium (5). Average/Intermediate: Medium Soft (4) to Medium Hard (6). Advanced: Speed & cueing your choice.',
          steps:[
            'Set up the OB at position 2 (lower off rail) as shown.',
            'Work through the CB positions for your skill level.',
            'Focus on keeping the cue level — off-rail angles punish any cue elevation.'
          ],
          review:'Off-rail shots require extra attention to aim point. The rail changes the effective pocket opening on thin cuts.',
          diagram: `<img loading="lazy" src="diagrams/d-mag-2.png" alt="Magnificent 11 — Shot 2: Lower Off Rail" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMiss', id:'d-mag-2', label:'SHOT 2 MAKES', showPct:true }
        },
        {
          id:'d-mag-3', name:'#3 — OFF END RAIL', accent:'green', tags:['MAGNIFICENT 11','RAIL SHOTS'],
          cure:'End rail shots are among the longest in the game and expose every flaw in stroke mechanics.',
          objective:'Pocket balls from CB positions with the OB near the end rail.',
          setup:'Beginners: Medium (5). Average/Intermediate: Medium Soft (4) to Medium Hard (6). Advanced: Speed & cueing your choice.',
          steps:[
            'Set up the OB at position 3 (off end rail) as shown.',
            'The end rail shot often requires a near-full table stroke. Stay down on the shot.',
            'Work through CB positions for your level. Prioritize staying level over power.'
          ],
          review:'End rail proximity changes the shot geometry. Practice these frequently — they appear in critical moments.',
          diagram: `<img loading="lazy" src="diagrams/d-mag-3.png" alt="Magnificent 11 — Shot 3: Off End Rail" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMiss', id:'d-mag-3', label:'SHOT 3 MAKES', showPct:true }
        },
        {
          id:'d-mag-4', name:'#4 — LOWER MIDDLE', accent:'red', tags:['MAGNIFICENT 11','SHOTMAKING'],
          cure:'Lower middle shots cover the most heavily-trafficked area of the table in nine ball and eight ball.',
          objective:'Build accuracy from CB positions shooting into the lower middle zone.',
          setup:'Beginners: Medium (5). Average/Intermediate: Medium Soft (4) to Medium Hard (6). Advanced: Speed & cueing your choice.',
          steps:[
            'Set up the OB at position 4 (lower middle) as shown.',
            'This area generates a wide variety of cut angles. Work through all CB positions.',
            'Note which angles give you the most trouble and return to those specifically.'
          ],
          review:'Lower middle competence is a direct predictor of nine ball runout ability. Own this area.',
          diagram: `<img loading="lazy" src="diagrams/d-mag-4.png" alt="Magnificent 11 — Shot 4: Lower Middle" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMiss', id:'d-mag-4', label:'SHOT 4 MAKES', showPct:true }
        },
        {
          id:'d-mag-5', name:'#5 — LOWER', accent:'cyan', tags:['MAGNIFICENT 11','SHOTMAKING'],
          cure:'Lower table positions generate the cut angles most commonly encountered at the opening of a rack.',
          objective:'Pocket balls from all lower-table CB positions at controlled speed.',
          setup:'Beginners: Medium (5). Average/Intermediate: Medium Soft (4) to Medium Hard (6). Advanced: Speed & cueing your choice.',
          steps:[
            'Set up the OB at position 5 (lower) as shown.',
            'Work through the CB positions appropriate for your level.',
            'Pay attention to speed — lower table shots often travel further to the pocket than they appear.'
          ],
          review:'A make percentage below 70% on lower table shots indicates a stroke or aim issue that will compound on longer shots.',
          diagram: `<img loading="lazy" src="diagrams/d-mag-5.png" alt="Magnificent 11 — Shot 5: Lower" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMiss', id:'d-mag-5', label:'SHOT 5 MAKES', showPct:true }
        },
        {
          id:'d-mag-6', name:'#6 — UPPER OFF RAIL', accent:'gold', tags:['MAGNIFICENT 11','RAIL SHOTS'],
          cure:'Upper off-rail shots cross significant table distance and demand both accuracy and speed control.',
          objective:'Pocket balls from CB positions with the OB near the upper rail.',
          setup:'Beginners: Medium (5). Average/Intermediate: Medium Soft (4) to Medium Hard (6). Advanced: Speed & cueing your choice.',
          steps:[
            'Set up the OB at position 6 (upper off rail) as shown.',
            'The distance from the CB to the OB increases on these shots. Calibrate your speed carefully.',
            'Work through CB positions. Note how the required aim point shifts with distance.'
          ],
          review:'Upper off-rail shots are often underestimated. The long-distance rail line requires extra attention to cue levelness.',
          diagram: `<img loading="lazy" src="diagrams/d-mag-6.png" alt="Magnificent 11 — Shot 6: Upper Off Rail" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMiss', id:'d-mag-6', label:'SHOT 6 MAKES', showPct:true }
        },
        {
          id:'d-mag-7', name:'#7 — MIDDLE — 1 DIAMOND', accent:'green', tags:['MAGNIFICENT 11','SHOTMAKING'],
          cure:'Middle table shots at the 1-diamond mark are a cornerstone of position play in all pool games.',
          objective:'Build accuracy from all CB positions at the middle of the table, 1 diamond from the rail.',
          setup:'Beginners: Medium (5). Average/Intermediate: Medium Soft (4) to Medium Hard (6). Advanced: Speed & cueing your choice.',
          steps:[
            'Set up the OB at position 7 (middle, 1 diamond) as shown.',
            'From this position, cut angles range from very thin to near-straight. Practice the full range.',
            'Focus on ghost ball visualization — the variety of angles here trains your natural aim system.'
          ],
          review:'Middle table proficiency separates intermediate players from advanced players. Every angle that appears difficult becomes routine with enough repetition.',
          diagram: `<img loading="lazy" src="diagrams/d-mag-7.png" alt="Magnificent 11 — Shot 7: Middle 1 Diamond" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMiss', id:'d-mag-7', label:'SHOT 7 MAKES', showPct:true }
        },
        {
          id:'d-mag-8', name:'#8 — UPPER — 1 DIAMOND', accent:'red', tags:['MAGNIFICENT 11','SHOTMAKING'],
          cure:'Upper table 1-diamond shots require long-distance accuracy and strong Shot Picture construction.',
          objective:'Pocket balls from CB positions shooting to the upper table, 1 diamond from the rail.',
          setup:'Beginners: Medium (5). Average/Intermediate: Medium Soft (4) to Medium Hard (6). Advanced: Speed & cueing your choice.',
          steps:[
            'Set up the OB at position 8 (upper, 1 diamond) as shown.',
            'These are longer shots — build your Shot Picture carefully before getting down.',
            'Work through CB positions. Beginners should prioritize consistent form over power.'
          ],
          review:'Long-distance accuracy above the midline is a defining skill of upper-level players. Do not neglect these shots.',
          diagram: `<img loading="lazy" src="diagrams/d-mag-8.png" alt="Magnificent 11 — Shot 8: Upper 1 Diamond" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMiss', id:'d-mag-8', label:'SHOT 8 MAKES', showPct:true }
        },
        {
          id:'d-mag-9', name:'#9 — THE HEAD SPOT', accent:'cyan', tags:['MAGNIFICENT 11','SHOTMAKING'],
          cure:'Head spot shots are among the most common in nine ball and straight pool — yet frequently underpracticed.',
          objective:'Pocket balls from CB positions shooting to the head spot area.',
          setup:'Beginners: Medium (5). Average/Intermediate: Medium Soft (4) to Medium Hard (6). Advanced: Speed & cueing your choice.',
          steps:[
            'Set up the OB at position 9 (head spot) as shown.',
            'The head spot is a natural CB landing zone — you will encounter this shot constantly in play.',
            'Work through CB positions. Advanced players: practice with english as position play demands.'
          ],
          review:'Make rate on head spot shots is a reliable indicator of overall game level. Target 80%+ from beginner CB positions before advancing.',
          diagram: `<img loading="lazy" src="diagrams/d-mag-9.png" alt="Magnificent 11 — Shot 9: The Head Spot" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMiss', id:'d-mag-9', label:'SHOT 9 MAKES', showPct:true }
        },
        {
          id:'d-mag-10', name:'#10 — UPPER', accent:'gold', tags:['MAGNIFICENT 11','SHOTMAKING'],
          cure:'Upper table shots demand maximum Shot Picture clarity and the most disciplined stroke mechanics.',
          objective:'Pocket balls from CB positions at the upper end of the table.',
          setup:'Beginners: Medium (5). Average/Intermediate: Medium Soft (4) to Medium Hard (6). Advanced: Speed & cueing your choice.',
          steps:[
            'Set up the OB at position 10 (upper) as shown.',
            'These are the longest shots in the Magnificent 11. Stay down, stay level, stay smooth.',
            'Work through CB positions. Accuracy at this distance requires complete trust in your stroke.'
          ],
          review:'If you are missing upper table shots consistently, return to the stroke drills in Chapter 3. The problem is almost always mechanical, not visual.',
          diagram: `<img loading="lazy" src="diagrams/d-mag-10.png" alt="Magnificent 11 — Shot 10: Upper" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMiss', id:'d-mag-10', label:'SHOT 10 MAKES', showPct:true }
        },
        {
          id:'d-mag-11', name:'#11 — UPPER MIDDLE', accent:'green', tags:['MAGNIFICENT 11','SHOTMAKING'],
          cure:'The upper middle zone is the final test — combining long distance, varied angles, and precise speed control.',
          objective:'Complete the Magnificent 11 by mastering CB positions shooting to the upper middle zone.',
          setup:'Beginners: Medium (5). Average/Intermediate: Medium Soft (4) to Medium Hard (6). Advanced: Speed & cueing your choice.',
          steps:[
            'Set up the OB at position 11 (upper middle) as shown.',
            'This is the graduation shot of the Magnificent 11. Apply everything practiced in shots 1–10.',
            'Work through all CB positions. Advanced players: play for position after each make.'
          ],
          review:'Completing all 11 shots at 70%+ across beginner positions marks a genuine competence milestone. Track your progress over multiple sessions.',
          tip:'Run all 11 shots in a single session periodically as a full assessment. Your score across all 11 tells you exactly where to focus next.',
          diagram: `<img loading="lazy" src="diagrams/d-mag-11.png" alt="Magnificent 11 — Shot 11: Upper Middle" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMiss', id:'d-mag-11', label:'SHOT 11 MAKES', showPct:true }
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
          diagram: `<img loading="lazy" src="diagrams/d-distractors.png" alt="The Distractors diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
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
          diagram: `<img loading="lazy" src="diagrams/d-zen-master.png" alt="Zen Master Distraction Shots diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMissAB', id:'d-zen-master', labelA:'RUNNING THE GAUNTLET', labelB:'CUTTING THROUGH FOG', shots:5 }
        },
        {
          id:'d-inmoment', name:'IN THE MOMENT', accent:'gold', tags:['MENTAL','CONCENTRATION'],
          cure:'Players who cannot stay present — dwelling on the last miss or worrying about the next shot — lose execution quality.',
          objective:'Train the ability to be 100% present on each shot, regardless of what happened before.',
          steps:[
            'Set up the shots as shown. Before each shot, consciously clear your mind of the previous result.',
            'Use a reset phrase or breath before each routine — something that signals "this shot only."',
            'Shoot 10 balls. After each shot, rate 1-3 how present you were (1=thinking about last shot, 3=fully in the moment).',
            'Average your presence score across all 10 shots.'
          ],
          review:'In the Moment is a trainable skill. Players who practice deliberate presence improve faster and perform better under pressure.',
          diagram: `<img loading="lazy" src="diagrams/d-inmoment.png" alt="In the Moment diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'qual', id:'d-inmoment', labels:{ 1:'PAST/FUTURE FOCUSED', 2:'MOSTLY PRESENT', 3:'FULLY IN THE MOMENT' } }
        },
        {
          id:'d-prosfanatics', name:'PROS AND FANATICS ONLY', accent:'red', tags:['MENTAL','ADVANCED','DISTRACTION'],
          cure:'The highest level of distraction training — reserved for players who have mastered the earlier distraction drills.',
          objective:'Execute difficult shots in extreme visual conditions that would overwhelm most players.',
          steps:[
            'Set up the maximum-distraction scenario as shown.',
            'Use your complete routine. Do not skip steps because the table is busy.',
            'Focus exclusively on CB, OB, and pocket — everything else is noise.',
            'Shoot 5 attempts. Rate your ability to block out the surrounding balls.'
          ],
          review:'If you can execute cleanly in this environment, competition conditions will feel calm by comparison. This is the ultimate concentration drill.',
          tip:'Phil says: Only attempt this drill after you have achieved a rating of 3 on both The Distractors and Zen Master consistently.',
          diagram: `<img loading="lazy" src="diagrams/d-prosfanatics.png" alt="Pros and Fanatics Only diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'qual', id:'d-prosfanatics', labels:{ 1:'OVERWHELMED', 2:'PARTIAL FOCUS', 3:'BLOCKED IT ALL OUT' } }
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
  color:'cyan', drillCount:47,
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
          diagram: `<img loading="lazy" src="diagrams/d-follow-shots.png" alt="The Follow Shot diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
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
          diagram: `<img loading="lazy" src="diagrams/d-stop-shots.png" alt="The Stop Shot diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
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
          diagram: `<img loading="lazy" src="diagrams/d-draw-shots-a.png" alt="The Draw Shot Part A" style="width:100%;border-radius:8px;margin-top:8px"><img loading="lazy" src="diagrams/d-draw-shots-b.png" alt="The Draw Shot Part B" style="width:100%;border-radius:8px;margin-top:8px"><img loading="lazy" src="diagrams/d-draw-shots-c.png" alt="The Draw Shot Part C" style="width:100%;border-radius:8px;margin-top:8px">`,
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
          diagram: `<img loading="lazy" src="diagrams/d-half-diamond.png" alt="The Half Diamond Shot diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
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
          diagram: `<img loading="lazy" src="diagrams/d-stun-shots.png" alt="Stun Shots diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
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
          diagram: `<img loading="lazy" src="diagrams/d-dead-scratch.png" alt="The Dead Scratch diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMiss', id:'d-dead-scratch', showPct:true }
        },
        {
          id:'d-slight-stop', name:'THE SLIGHT ANGLE STOP SHOT', accent:'gold', tags:['STOP SHOT','TECHNIQUE'],
          cure:'The slight angle stop shot is more difficult than the straight stop shot and appears far more often in actual play.',
          objective:'Execute reliable stop shots at slight cut angles using a touch of draw.',
          steps:[
            'Set up a slight cut angle (5–10°) at medium distance.',
            'A straight-in stop uses dead center. For a slight angle, use a tiny touch below center to counteract the natural follow induced by the cut.',
            'Shoot 5 from each position shown. Goal: CB freezes at contact point.',
            'The most common error is the CB drifting toward the pocket — you need slightly more draw than feels natural.'
          ],
          review:'Once you can stop the CB on slight angles, you gain a precision position tool that most players never develop.',
          diagram: `<img loading="lazy" src="diagrams/d-slight-stop.png" alt="Slight Angle Stop Shot diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMiss', id:'d-slight-stop', showPct:true, label:'CLEAN STOPS' }
        },
        {
          id:'d-beauty-cuts', name:'THE BEAUTY OF CUT ANGLES', accent:'cyan', tags:['CB PATH','POSITION'],
          cure:'Most players think in terms of where the OB goes. The top players think in terms of where the CB goes.',
          objective:'Internalize how different cut angles send the CB to dramatically different positions.',
          steps:[
            'Set up the shots as shown at various cut angles.',
            'Before each shot, predict where the CB will go after contact.',
            'Shoot with a stun/center hit. Compare your prediction to the result.',
            'Repeat with follow and draw. Note how adding spin changes the CB path off each cut angle.'
          ],
          review:'Cut angle is the CB\'s built-in steering system. Once you see this, position play becomes geometry instead of guesswork.',
          diagram: `<img loading="lazy" src="diagrams/d-beauty-cuts.png" alt="The Beauty of Cut Angles diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'qual', id:'d-beauty-cuts', labels:{ 1:'STILL GUESSING', 2:'SEEING PATTERNS', 3:'PREDICTING ACCURATELY' } }
        },
        {
          id:'d-discovery', name:'THE DISCOVERY SHOT', accent:'red', tags:['CB PATH','EXPLORATION'],
          cure:'You can read about CB paths for years without truly owning the knowledge. Discovery forces you to feel it.',
          objective:'Explore and map the CB\'s path from a single position using all spin types.',
          steps:[
            'Place CB and OB as shown. Mark the OB position with a dot.',
            'Shoot the shot with: center ball, top right, top left, bottom right, bottom left, right only, left only.',
            'Mark where the CB ends for each spin type on a paper diagram.',
            'Build a mental map of the CB\'s range of motion from this position.'
          ],
          review:'This is one of the most revealing exercises in the book. After doing this from 5 positions, your position play intuition jumps dramatically.',
          diagram: `<img loading="lazy" src="diagrams/d-discovery.png" alt="The Discovery Shot diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'checklist', id:'d-discovery', items:['Center ball mapped','Top spin mapped','Draw mapped','Right english mapped','Left english mapped','Full map drawn for this position'] }
        },
        {
          id:'d-in-and-out', name:'IN AND OUT', accent:'green', tags:['CB PATH','RAILS','POSITION'],
          cure:'The CB going "into" a rail and coming back "out" is a fundamental position route that players use constantly without realizing it.',
          objective:'Master the in-and-out route from multiple positions and angles.',
          steps:[
            'PART A — IN: CB travels to the side rail after contact. Note the angle it enters the rail.',
            'PART B — OUT: CB rebounds away from the rail at the mirror angle (modified by english/speed).',
            'Shoot the positions as shown. For each, predict the CB exit angle before shooting.',
            'Adjust spin to send the CB to specific target zones after the rebound.'
          ],
          review:'The in-and-out route is one of the safest position plays in pool — it gives the CB a predictable path that\'s easy to control with speed.',
          diagram: `<img loading="lazy" src="diagrams/d-in-and-out.png" alt="In and Out diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMissAB', id:'d-in-and-out', labelA:'PART A (IN)', labelB:'PART B (OUT)', shots:5 }
        },
        {
          id:'d-bend', name:'THE BEND', accent:'gold', tags:['CB PATH','ENGLISH','ADVANCED'],
          cure:'English bends the CB\'s path after contact in a way that straight-line thinking misses. Learning the bend unlocks advanced position routes.',
          objective:'Experience and quantify how english bends the CB\'s departure path.',
          steps:[
            'Set up the shot as shown. Shoot with center ball first — note CB path.',
            'Shoot same shot with running english (outside english relative to the pocket direction). CB bends further in the direction of spin.',
            'Shoot with reverse english. CB bends the other way.',
            'Repeat from 3 positions. Build a feel for how much bend each amount of english adds at different speeds.'
          ],
          review:'The bend is a precision tool. A skilled player uses it to reach position zones that would otherwise require two shots.',
          diagram: `<img loading="lazy" src="diagrams/d-bend.png" alt="The Bend diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'qual', id:'d-bend', labels:{ 1:'BEND UNPREDICTABLE', 2:'FEEL THE BEND', 3:'CONTROLLING THE BEND' } }
        },
        {
          id:'d-mid-follow', name:'MID-RANGE FOLLOW SHOTS', accent:'cyan', tags:['FOLLOW','POSITION'],
          cure:'Follow shots at medium distance are the most common position play in the game. Most players over-hit them.',
          objective:'Control follow shot position from mid-table distances at speeds 3–5.',
          steps:[
            'Place OB at the center of the table. CB 2–3 feet away at various angles.',
            'Use a half tip above center and Speed 4. Goal: CB travels to a specific target zone after contact.',
            'Shoot 5 shots from each position shown. Track whether CB lands short, long, or on target.',
            'Adjust only the speed — not the tip position — between shots to find the right touch.'
          ],
          review:'Mid-range follow is a precision skill. Small speed errors cause large position errors. Develop the feel for each distance.',
          diagram: `<img loading="lazy" src="diagrams/mid_range_follow_shots.png" alt="Mid-Range Follow Shots diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMiss', id:'d-mid-follow', showPct:true, label:'CB IN ZONE' }
        },
        {
          id:'d-mid-draw', name:'MID-RANGE DRAW SHOTS', accent:'red', tags:['DRAW','POSITION'],
          cure:'Draw at medium distance requires more speed and more tip than beginners expect. The cloth eats spin quickly.',
          objective:'Control draw distance from mid-table at speeds 4–6.',
          steps:[
            'Place OB at the center of the table. CB 2–3 feet away, slight cut angle.',
            'Use a full tip below center. Start at Speed 4. Mark CB ending position.',
            'Shoot 5 shots incrementally increasing speed. Goal: consistent draw arc that ends in target zone.',
            'From each position, predict where the CB will stop before shooting.'
          ],
          review:'Mid-range draw is the most underestimated shot in pool. Players who master it gain full control of the lower half of the table.',
          diagram: `<img loading="lazy" src="diagrams/mid_range_draw_shots.png" alt="Mid-Range Draw Shots diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMiss', id:'d-mid-draw', showPct:true, label:'CB IN ZONE' }
        },
        {
          id:'d-across-draw', name:'ACROSS THE TABLE DRAW SHOTS', accent:'red', tags:['DRAW','POSITION','CB PATH'],
          cure:'The across-the-table draw is a unique route — CB goes wide and comes back. Players who don\'t know it leave position regularly.',
          objective:'Execute draw shots that send the CB across the table using side rail angles.',
          steps:[
            'Set up an angled cut shot with the OB near the rail. CB in center-table.',
            'Apply draw and cut the ball so the CB travels across the table toward the opposite long rail.',
            'PART A — SHORT CROSS: CB hits near rail and stays on the playing half.',
            'PART B — LONG CROSS: More draw and speed sends CB to far rail. Target: upper-left zone.',
            'Shoot 5 of each. The key is predicting the CB\'s departure angle from the cut.'
          ],
          review:'Across-the-table draw is a versatile route used on many corner pocket and side pocket shots. It requires true mastery of draw technique.',
          diagram: `<img loading="lazy" src="diagrams/across_the_table_draw_shots.png" alt="Across the Table Draw Shots diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMissAB', id:'d-across-draw', labelA:'SHORT CROSS', labelB:'LONG CROSS', shots:5 }
        },
        {
          id:'d-draw-stun', name:'DRAW STUN SHOTS', accent:'gold', tags:['DRAW','STUN','COMBINATION'],
          cure:'The draw-stun shot requires precise tip placement between full draw and dead center. Most players hit too high or too low.',
          objective:'Control the draw-stun combination to execute precise position plays.',
          steps:[
            'Place CB and OB as shown. The target requires neither a full draw nor a full stun, but something between.',
            'Begin with dead center (stun). Note CB position. Then try full draw. Note CB position.',
            'Now find the exact tip height that splits the difference — this is the draw-stun zone.',
            'Shoot 5 from each position in the diagram. Goal: CB ends in the shaded target zone.'
          ],
          review:'The draw-stun combination gives you fine control over a wide range of CB positions. It\'s harder to control than either pure shot but doubles your options.',
          diagram: `<img loading="lazy" src="diagrams/draw_stun_shots.png" alt="Draw Stun Shots diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMiss', id:'d-draw-stun', showPct:true, label:'CB IN ZONE' }
        },
        {
          id:'d-short-draw', name:'THE SHORT DRAW SHOT', accent:'red', tags:['DRAW','TECHNIQUE'],
          cure:'Short distance draw is technically different from long draw — the cloth has not yet had time to kill the spin. Many players over-hit it.',
          objective:'Master draw from very close distance with precise speed control.',
          steps:[
            'Place OB and CB just 6–12 inches apart. Slight cut angle.',
            'Use a full tip below center but a very soft stroke (Speed 2–3). The CB will draw back even with minimal force.',
            'Progressively move CB further away in 6-inch increments. Note how much more speed is needed each time.',
            'Goal: CB returns to within 6 inches of starting position after the shot.'
          ],
          review:'Short draw tests your ability to apply spin without power. Players who rely on speed for draw struggle on close shots. Learn the low-force version first.',
          diagram: `<img loading="lazy" src="diagrams/short_draw_shot.png" alt="The Short Draw Shot diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMiss', id:'d-short-draw', showPct:true, label:'CB RETURNS TO ZONE' }
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
          diagram: `<img loading="lazy" src="diagrams/d-zeroing-in.jpg" alt="Zeroing In diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
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
          diagram: `<img loading="lazy" src="diagrams/d-piano-scales.jpg" alt="Piano Scales diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
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
          diagram: `<img loading="lazy" src="diagrams/d-surgeons-touch.jpg" alt="The Surgeon's Touch diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMissMulti', id:'d-surgeons-touch', groups:['PART A (POCKET SPEED)', 'PART B (HANGERS)', 'PART C (THIN + DRAW)'], shots:5 }
        },
        {
          id:'d-speed-control', name:'SPEED CONTROL', accent:'cyan', tags:['SPEED CONTROL','REFERENCE'],
          cure:'Speed control is the single most important position skill. Without it, all position knowledge is useless.',
          objective:'Develop a personal speed scale from 1–10 and learn to repeat each increment reliably.',
          steps:[
            'Shoot a straight-in shot at Speed 1 (barely pocketed). Mark CB final position.',
            'Shoot the same shot at Speed 3, 5, 7, and 10. Mark each CB position.',
            'Your goal: 5 clearly distinct and consistently repeatable CB zones from a single setup.',
            'Repeat the entire scale in one session until you can call your speed before each shot and be right 80%+ of the time.'
          ],
          review:'A reliable internal speed scale is the foundation of all position play. Build this scale over time with consistent practice.',
          diagram: `<img loading="lazy" src="diagrams/speed_control.png" alt="Speed Control diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'qual', id:'d-speed-control', labels:{ 1:'NO SCALE YET', 2:'PARTIAL SCALE', 3:'CONSISTENT SCALE' } }
        },
        {
          id:'d-soft-pocket', name:'SOFT STROKES AT POCKET SPEEDS', accent:'gold', tags:['SPEED CONTROL','TECHNIQUE'],
          cure:'Playing at the minimum speed needed to pocket a ball is the hardest speed to repeat. Most players play too fast.',
          objective:'Develop reliable stroke control at pocket speed — the slowest effective speed for each shot.',
          steps:[
            'Set up a straight-in shot from 3 feet. Use only enough speed to pocket the ball.',
            'Count your strokes: a pocket-speed shot should need just 1–2 practice strokes, not a power stroke.',
            'Now try a cut shot at pocket speed. The slower the speed, the more the CB comes off the tangent line.',
            'Shoot 5 from each position shown. Score: pocketed AND CB within 12 inches of target.'
          ],
          review:'Pocket-speed shots are the quietest but most controlled shots in pool. A player who can always choose minimum speed has maximum position options.',
          diagram: `<img loading="lazy" src="diagrams/soft_strokes_at_pocket_speeds.png" alt="Soft Strokes at Pocket Speeds diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMiss', id:'d-soft-pocket', showPct:true, label:'POCKETED + CB ON TARGET' }
        },
        {
          id:'d-thin-hangers', name:'THIN CUT POCKET HANGERS', accent:'red', tags:['SPEED CONTROL','THIN CUT'],
          cure:'Pocket hangers demand maximum delicacy. Any excess force sends the CB far from position, or worse, rattles out the OB.',
          objective:'Pocket thin-cut hangers with soft speed while landing the CB in the position zone.',
          steps:[
            'Place an OB on the lip of the pocket — a true hanger. CB at various angles.',
            'Use the absolute minimum force to drop the ball. Practice the stroke without a ball first.',
            'PART A — STRAIGHT-ISH HANGER: CB near-straight. Apply draw to bring CB back for next ball.',
            'PART B — THIN CUT HANGER: CB at a wide angle. Natural CB path should send it away from the pocket zone.',
            'Shoot 5 of each. Score only if both the OB is pocketed and CB ends in the target zone.'
          ],
          review:'Thin cut hangers are a test of touch and nerve. Missing them due to over-force is a habit, not a lack of skill. Train the softer stroke.',
          diagram: `<img loading="lazy" src="diagrams/thin_cut_pocket_hangers.png" alt="Thin Cut Pocket Hangers diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMissAB', id:'d-thin-hangers', labelA:'STRAIGHT HANGER', labelB:'THIN CUT HANGER', shots:5 }
        },
        {
          id:'d-power-stun', name:'POWER STUN WORKOUT', accent:'gold', tags:['STUN','POWER','SPEED CONTROL'],
          cure:'Most players can stun the CB softly. Fewer can do it hard. Power stun shots demand precise dead-center contact under stroke pressure.',
          objective:'Execute reliable stun shots at Medium Hard (6–7) and Hard (8) speeds.',
          steps:[
            'Set up a straight-in shot, OB at the center, CB at 4 feet.',
            'Strike dead center at Speed 6. CB should stop at contact point. If it rolls forward, you hit too high.',
            'Repeat at Speed 7, then Speed 8. Each increment reveals your accuracy at that power level.',
            'Shoot 5 at each speed. Track clean stops vs. partial rolls.'
          ],
          review:'Power stun is the foundation of long-range position control. It requires a level stroke and true dead-center contact — harder than it sounds at Speed 8.',
          diagram: `<img loading="lazy" src="diagrams/power_stun_workout.png" alt="Power Stun Workout diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMissMulti', id:'d-power-stun', groups:['SPEED 6', 'SPEED 7', 'SPEED 8'], shots:5 }
        },
        {
          id:'d-power-follow', name:'POWER FOLLOW SHOTS', accent:'cyan', tags:['FOLLOW','POWER','POSITION'],
          cure:'Power follow shots are hard to control because the CB travels much farther than players expect. Learn the distances at each power level.',
          objective:'Control CB distance on power follow shots at speeds 6–8 from multiple positions.',
          steps:[
            'Place CB at one end of the table, OB at center. Full tip above center.',
            'Shoot at Speed 6. Mark CB final resting position.',
            'Repeat at Speed 7 and Speed 8. Track the CB stopping zones for each speed.',
            'Goal: three clearly separated zones — one for each speed increment.'
          ],
          review:'Power follow shots travel 3–5 feet beyond what softer players expect. Build a reliable speed map for each power level and stop guessing.',
          diagram: `<img loading="lazy" src="diagrams/power_follow_shots.png" alt="Power Follow Shots diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMissMulti', id:'d-power-follow', groups:['SPEED 6 ZONE', 'SPEED 7 ZONE', 'SPEED 8 ZONE'], shots:5 }
        },
        {
          id:'d-power-draw', name:'THE POWER DRAW', accent:'red', tags:['DRAW','POWER','TECHNIQUE'],
          cure:'The power draw looks impressive but is rarely needed — and when it is needed, players miss it because they haven\'t trained it.',
          objective:'Execute full power draw shots that pull the CB back 4+ feet from long distance.',
          steps:[
            'Place OB at the center of the table. CB at the opposite end — long distance draw.',
            'Use a full tip below center, Speed 7–8. Follow through fully through the CB.',
            'The CB must pull back at least 4 feet after contact. Anything less means the cloth killed the spin.',
            'Shoot 5 attempts. Count only those where CB reverses more than 4 feet.'
          ],
          review:'The power draw requires a sharp, clean below-center hit with full follow-through. Players who poke or decelerate lose the spin before it can work.',
          diagram: `<img loading="lazy" src="diagrams/the_power_draw.png" alt="The Power Draw diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMiss', id:'d-power-draw', showPct:true, label:'4+ FT DRAW ACHIEVED' }
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
          diagram: `<img loading="lazy" src="diagrams/d-angle-departure.png" alt="Angle of Departure / Tangent Line diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
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
          diagram: `<img loading="lazy" src="diagrams/d-rebound.png" alt="The Rebound diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
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
          diagram: `<img loading="lazy" src="diagrams/inside_three_railer.png" alt="Inside Three Railer diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
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
          diagram: `<img loading="lazy" src="diagrams/side_pocket_three_railer.png" alt="Side Pocket 3-Railer diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMissAB', id:'d-side-3rail', labelA:'WITH ENGLISH (MARKER A)', labelB:'NO ENGLISH (MARKER B)', shots:5 }
        },
        {
          id:'d-multi-mastery', name:'MULTI-RAIL MASTERY', accent:'cyan', tags:['MULTI-RAIL','REFERENCE'],
          cure:'Multi-rail position routes appear on 28% of pro position plays. Players who never practice them are leaving easy positions on the table.',
          objective:'Understand and catalog the primary multi-rail routes available from any table position.',
          steps:[
            'Study the diagram — it shows the most common multi-rail routes from the center of the table.',
            'For each route shown, identify: 1) which rail is first, 2) how many rails total, 3) what english is required.',
            'Shoot one of each route from the diagram positions. Note which routes feel natural vs. forced.',
            'Identify one route you avoid in real games and commit to practicing it this session.'
          ],
          review:'Multi-rail routes are not "fancy shots" — they are practical position plays that create more options. Pro players use them regularly because they\'ve practiced them.',
          diagram: `<img loading="lazy" src="diagrams/d-multi-mastery.png" alt="Multi-Rail Mastery diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'checklist', id:'d-multi-mastery', items:['Identified all routes in diagram','Shot a 2-railer to the left','Shot a 2-railer to the right','Shot a 3-railer','Identified my weakest route'] }
        },
        {
          id:'d-two-railer', name:'THE CLASSIC TWO-RAILER — DOUBLING THE CORNERS', accent:'gold', tags:['MULTI-RAIL','POSITION'],
          cure:'The corner two-railer (CB into end rail, back up to the other end) is one of the most useful position routes in Nine Ball.',
          objective:'Control the classic corner-to-corner two-rail route from both sides.',
          steps:[
            'OB near the side pocket. CB in position for a cut toward the corner.',
            'Use a half tip of running english (same direction as the OB\'s path). CB hits end rail then comes back up the table.',
            'Left side: use left (running) english. Right side: use right english.',
            'Shoot 5 from each side. Target zone: CB ends up in upper half of table.'
          ],
          review:'The classic two-railer is predictable because the CB is going into an end rail at a consistent angle. Speed control determines how far up the table it comes back.',
          diagram: `<img loading="lazy" src="diagrams/d-two-railer.png" alt="Classic Two-Railer diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMissAB', id:'d-two-railer', labelA:'LEFT SIDE', labelB:'RIGHT SIDE', shots:5 }
        },
        {
          id:'d-inside-2rail', name:'INSIDE ENGLISH TWO-RAILER', accent:'red', tags:['MULTI-RAIL','ADVANCED'],
          cure:'The inside english two-railer travels away from the end rail — it\'s one of the most missed position plays because players don\'t know it exists.',
          objective:'Learn and execute the inside english two-rail route that moves away from the end rail.',
          steps:[
            'Set up the shot as shown — OB in front of a pocket, CB at a cut angle.',
            'Use inside english (opposite to running) and a medium stroke. CB hits the side rail first, then the long rail.',
            'The CB travels away from the end rail, creating position on the upper half of the table.',
            'Shoot 5 attempts. The CB path is longer and requires precise speed control.'
          ],
          review:'Inside english two-railers are counterintuitive — the CB initially moves toward trouble before coming back. Once you know the route, it becomes a reliable weapon.',
          diagram: `<img loading="lazy" src="diagrams/d-inside-2rail.png" alt="Inside English Two-Railer diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMiss', id:'d-inside-2rail', showPct:true, label:'CB IN ZONE' }
        },
        {
          id:'d-across-table', name:'ACROSS THE TABLE', accent:'green', tags:['MULTI-RAIL','POSITION'],
          cure:'The across-the-table route sends the CB straight across the width of the table — a short, controllable two-rail play that\'s used constantly.',
          objective:'Control the across-the-table CB route using follow and draw.',
          steps:[
            'OB near one long rail. CB on the other side of the table for a cut shot.',
            'PART A — WITH FOLLOW: CB crosses the table and hits both long rails. Target: CB ends near the foot of the table.',
            'PART B — WITH DRAW: CB pulls back and hits the near rail only. Target: CB stays on shooting side.',
            'Shoot 5 of each. Across-the-table routes are common in both Nine Ball and Eight Ball.'
          ],
          review:'Controlling the across-the-table route is one of the clearest signs of a developing player. It requires both skill and understanding of cut angles.',
          diagram: `<img loading="lazy" src="diagrams/accross_and_down_table.png" alt="Across and Down Table diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMissAB', id:'d-across-table', labelA:'WITH FOLLOW', labelB:'WITH DRAW', shots:5 }
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
          diagram: `<img loading="lazy" src="diagrams/zig_zag_revisited.png" alt="Zig Zag Drill diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'pointTracker', id:'d-zig-zag', maxPts:7, label:'ZIG ZAG SCORE' }
        },
        {
          id:'d-zig-rotation', name:'ZIG ZAG ROTATION', accent:'gold', tags:['ADVANCED','POSITION','PATTERN'],
          cure:'The zig-zag rotation adds a rotating sequence to the classic zig-zag — each ball requires a different route to the next.',
          objective:'Execute a rotating zig-zag sequence where each ball requires a different position route.',
          steps:[
            'Set 6 balls in a zig-zag pattern. Each pair requires a different position route: follow, draw, stun, two-rail.',
            'Plan the full sequence before shooting — identify which route is needed for each transition.',
            'Execute the sequence. Score 1 point per ball, bonus point if you complete the full run.',
            'Reset and repeat. Track your best consecutive run.'
          ],
          review:'The rotation variant forces you to switch mental gears every shot — the way real games actually play. This is one of the best runout simulators.',
          diagram: `<img loading="lazy" src="diagrams/zig_zag_rotation.png" alt="Zig Zag Rotation diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'pointTracker', id:'d-zig-rotation', maxPts:7, label:'ZIG ZAG ROTATION SCORE' }
        },
        {
          id:'d-side-circle', name:'SIDE POCKET CIRCLE', accent:'cyan', tags:['ADVANCED','POSITION','SIDE POCKET'],
          cure:'Side pocket shots require very different CB paths than corner shots. Players who only practice corners are lost when the side comes up.',
          objective:'Control CB position from side pocket shots in a full-circle pattern around the table.',
          steps:[
            'Set OB in front of the side pocket. CB at Position 1 (straight in).',
            'Shoot and land CB in Zone A (near corner pocket). Now move CB to Position 2.',
            'Each subsequent CB position is 30° around the table. Each requires a different spin and speed combination.',
            'Score 1 point per shot where CB lands in the correct zone.'
          ],
          review:'The side pocket circle reveals whether you can control the CB from every angle — not just your favorite few. It is a complete position test.',
          diagram: `<img loading="lazy" src="diagrams/side_pocket_circle.png" alt="Side Pocket Circle diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'pointTracker', id:'d-side-circle', maxPts:12, label:'CIRCLE SCORE' }
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
          diagram: `<img loading="lazy" src="diagrams/the_special_l.png" alt="The Special L diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
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
          diagram: `<img loading="lazy" src="diagrams/ultra_fine_target_ball.png" alt="Pro Target Ball diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'pointTracker', id:'d-pro-target', maxPts:12, label:'PRO TARGET SCORE' }
        }
      ]
    },
    {
      id:'s5-english', title:'ENGLISH IN POSITION PLAY',
      desc:'Applying english to control cue ball position. The SDP system and advanced english drills.',
      drills:[
        {
          id:'d-escape-english', name:'THE ESCAPE SHOT — DRAW WITH ENGLISH', accent:'red', tags:['ENGLISH','ADVANCED'],
          cure:'Draw combined with english creates the escape shot — a CB path that gets out of trouble in ways neither draw nor english alone can achieve.',
          objective:'Execute the escape route using draw + running english from the positions shown.',
          steps:[
            'Place CB near a cluster that blocks the normal escape path.',
            'Use a full tip of draw and running english (one tip). The CB spins wide of the obstacle.',
            'PART A: Escape to the left using draw + left english.',
            'PART B: Escape to the right using draw + right english.',
            'Shoot 5 of each. Control the exit angle with the ratio of draw to english.'
          ],
          review:'The escape shot is a specialty play. Learn it for specific positions — it\'s not a substitute for good position planning.',
          diagram: `<img loading="lazy" src="diagrams/d-escape-english.png" alt="The Escape Shot — Draw with English" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMissAB', id:'d-escape-english', labelA:'ESCAPE LEFT', labelB:'ESCAPE RIGHT', shots:5 }
        },
        {
          id:'d-magic-spin', name:'THE MAGIC OF QUALITY SPIN AND A SOFTER STROKE', accent:'green', tags:['ENGLISH','TECHNIQUE'],
          cure:'Most players apply too much english and too much speed, which defeats both. Quality spin at softer speeds is more effective and more controllable.',
          objective:'Discover the sweet spot where quality spin and softer speed work together for maximum CB control.',
          steps:[
            'Set up the shot as shown. Use a full tip of side english at Speed 5 (medium). Note CB result.',
            'Repeat at Speed 3 (soft) with the same full tip of english. Note how the english takes more effect.',
            'The softer stroke allows the cloth friction to convert spin into CB direction change more efficiently.',
            'Shoot 5 at each speed. Identify the speed where spin feels most controllable.'
          ],
          review:'Quality spin at the right speed is far more effective than more spin at higher speed. This is one of the most important english discoveries a player can make.',
          diagram: `<img loading="lazy" src="diagrams/d-magic-spin.png" alt="Quality Spin and Softer Stroke" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'qual', id:'d-magic-spin', labels:{ 1:'SPIN UNPREDICTABLE', 2:'FEELING THE SWEET SPOT', 3:'CONTROLLING SPIN PRECISELY' } }
        },
        {
          id:'d-horiz-axis', name:'THE OVERLOOKED HORIZONTAL AXIS', accent:'cyan', tags:['ENGLISH','REFERENCE'],
          cure:'Most players think only about left/right english. The horizontal axis (top and bottom) is equally important and often overlooked.',
          objective:'Experience how the horizontal axis (follow/draw) interacts with side english to create combined spin.',
          steps:[
            'STEP 1: Shoot with pure follow. Note CB path after contact.',
            'STEP 2: Shoot with follow + right english. Note how the CB path curves differently vs. pure follow.',
            'STEP 3: Shoot with draw + right english. Note how draw sends CB one way while spin takes it the other.',
            'Map out the 9 possible combinations: center/follow/draw × center/left/right english.'
          ],
          review:'The full spin matrix gives you 9 CB destination zones from any shot. Understanding this matrix is the foundation of advanced position play.',
          diagram: `<img loading="lazy" src="diagrams/d-horiz-axis.png" alt="The Overlooked Horizontal Axis" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'checklist', id:'d-horiz-axis', items:['Mapped pure vertical axis (center/follow/draw)','Mapped left column (left+center/follow/draw)','Mapped right column (right+center/follow/draw)','Can predict combined spin result from any position'] }
        },
        {
          id:'d-three-comp', name:'THE THREE COMPONENTS OF A SHOT WITH ENGLISH', accent:'gold', tags:['ENGLISH','REFERENCE'],
          cure:'Using english without understanding its three components leads to inconsistency. Master each component separately first.',
          objective:'Learn and apply the three components: direction compensation, speed compensation, and rail compensation.',
          steps:[
            'PART A — DIRECTION: With left english, aim slightly right to compensate for deflection. The amount depends on your cue\'s pivot point.',
            'PART B — SPEED: Left english at a rail shortens rebound angle. Compensate by adjusting where on the rail you target.',
            'PART C — COMBINED: Now put both compensations together on a single shot that uses english and hits a rail.',
            'Shoot 5 of each part separately, then 5 combined shots.'
          ],
          review:'The three-component system is the framework used by top players. Once internalized, compensating for english becomes automatic.',
          diagram: `<img loading="lazy" src="diagrams/d-three-comp-a.png" alt="Three Components Part A" style="width:100%;border-radius:8px;margin-top:8px"><img loading="lazy" src="diagrams/d-three-comp-bc.png" alt="Three Components Parts B and C" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMissMulti', id:'d-three-comp', groups:['PART A (DIRECTION)', 'PART B (SPEED)', 'PART C (COMBINED)'], shots:5 }
        },
        {
          id:'d-primary-emphasis', name:'THE PRIMARY EMPHASIS', accent:'red', tags:['ENGLISH','TECHNIQUE'],
          cure:'When using english, the primary emphasis must be on pocketing the ball first — everything else is secondary.',
          objective:'Practice using english while keeping pocketing accuracy as the #1 priority.',
          steps:[
            'Set up the shots as shown. You will use english on each one.',
            'Before each shot, visualize the aim compensation needed for deflection.',
            'Shoot with the compensated aim as if the english does not exist. The pocketing must be primary.',
            'Track makes (pocketing) separately from CB ending position. Both matter — but pocketing matters more.'
          ],
          review:'Many players start missing when they add english because they shift focus to the CB. The ball still has to go in. Primary emphasis = pocketing.',
          diagram: `<img loading="lazy" src="diagrams/d-primary-emphasis.png" alt="The Primary Emphasis diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMiss', id:'d-primary-emphasis', showPct:true, label:'POCKETED WITH ENGLISH' }
        },
        {
          id:'d-sdp-errors', name:'SDP ERRORS', accent:'gold', tags:['ENGLISH','TECHNIQUE'],
          cure:'Spin, Deflection, and Pivot (SDP) each create a different aiming error. Knowing which error you made tells you exactly how to fix it.',
          objective:'Identify and correct the three types of english aiming errors: spin, deflection, and pivot.',
          steps:[
            'SPIN ERROR: Ball misses in the direction of spin. Caused by throw at low speed.',
            'DEFLECTION ERROR: Ball misses opposite to spin. Caused by pivot at high speed.',
            'PIVOT ERROR: Ball misses due to bridge movement during stroke.',
            'Shoot the test shots shown. When you miss, diagnose WHICH type of error caused it.',
            'Adjust aim for next shot based on your diagnosis.'
          ],
          review:'Self-diagnosis of english errors is a skill in itself. Once you can name the error, you can correct it shot by shot instead of randomly guessing.',
          diagram: `<img loading="lazy" src="diagrams/d-sdp-errors.png" alt="SDP Errors diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'qual', id:'d-sdp-errors', labels:{ 1:'CANNOT DIAGNOSE ERRORS', 2:'SOMETIMES IDENTIFYING', 3:'DIAGNOSING CONSISTENTLY' } }
        },
        {
          id:'d-viz-zone', name:'VISUALIZING THE ZONE', accent:'cyan', tags:['ENGLISH','MENTAL'],
          cure:'English without a target zone is randomness with spin. You must visualize the CB\'s target zone before you apply english.',
          objective:'Practice visualizing the specific CB zone you want before using english to reach it.',
          steps:[
            'Set up the shot as shown. Choose a target zone for the CB.',
            'Determine what english (if any) gets the CB to that zone from this shot.',
            'Visualize the CB traveling to the zone before you address the ball.',
            'Shoot. Compare CB landing to the visualized zone.',
            'Do 10 shots from different positions. Rate your visualization accuracy.'
          ],
          review:'Visualization before english is what separates intentional spin from accidental spin. The zone must be clear in your mind before you pull back.',
          diagram: `<img loading="lazy" src="diagrams/d-viz-zone.png" alt="Visualizing the Zone diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'qual', id:'d-viz-zone', labels:{ 1:'NO TARGET ZONE', 2:'ZONE IS VAGUE', 3:'ZONE IS PRECISE AND HIT' } }
        },
        {
          id:'d-no-circles', name:'WHY CIRCLES AND SQUARES DON\'T WORK', accent:'red', tags:['ENGLISH','REFERENCE'],
          cure:'Circle and square aiming systems for english compensation fail under real conditions because they ignore speed, cue, and table variables.',
          objective:'Understand why fixed geometric compensation systems are unreliable and what to use instead.',
          steps:[
            'Study the diagram — it shows where circle/square systems predict the CB to go vs. where it actually goes.',
            'Shoot the test shots using the circle system\'s prescribed aim. Record results.',
            'Shoot same shots using feel and experience-based compensation. Compare results.',
            'Note: the correct compensation varies by speed, tip, and table. No fixed system works universally.'
          ],
          review:'The only reliable english compensation system is a personalized one built through practice. These drills build yours.',
          diagram: `<img loading="lazy" src="diagrams/d-no-circles.png" alt="Why Circles and Squares Don't Work" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'checklist', id:'d-no-circles', items:['Tested circle system — recorded results','Tested feel-based system — recorded results','Identified my cue\'s personal pivot point','Committed to building experience-based compensation'] }
        },
        {
          id:'d-string-along', name:'STRING ALONG', accent:'gold', tags:['ENGLISH','DRILL'],
          cure:'String Along is the best english training drill in the book. It forces precise english control over a sequence of identical shots.',
          objective:'Use english to string 5 consecutive shots to landing positions in a straight line.',
          steps:[
            'Place 5 OBs in a line down the table. Shoot each toward the same pocket.',
            'The goal: use english to land the CB in the same zone after each shot despite different distances.',
            'Closer OBs need less english. Farther OBs need more. The adjustment must be precise.',
            'Score: 1 point for each CB that lands within one ball width of the target zone.'
          ],
          review:'String Along exposes your english consistency better than any other single drill. If CB landings vary widely, your english application is inconsistent.',
          diagram: `<img loading="lazy" src="diagrams/d-string-along.png" alt="String Along drill" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMiss', id:'d-string-along', showPct:true, label:'CB IN ZONE' }
        },
        {
          id:'d-correct-mistakes', name:'CORRECTING YOUR MISTAKES', accent:'green', tags:['ENGLISH','TECHNIQUE'],
          cure:'Most players make the same english mistakes repeatedly because they don\'t have a correction protocol. This drill establishes one.',
          objective:'Develop a systematic approach to diagnosing and correcting english errors in real time.',
          steps:[
            'Set up the shots as shown. Shoot each with your chosen english.',
            'After each miss or poor CB position: STOP. Ask: Was it throw, deflection, or too much/little?',
            'Make ONE specific adjustment — never two at once. Re-shoot.',
            'Record: what was the error, what was the fix, did the fix work?',
            'Build a personal error-fix log. After 10 sessions, patterns emerge.'
          ],
          review:'The ability to self-correct in real time is what separates improving players from plateaued ones. This drill builds that muscle.',
          diagram: `<img loading="lazy" src="diagrams/d-correct-mistakes.png" alt="Correcting Your Mistakes diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'qual', id:'d-correct-mistakes', labels:{ 1:'GUESSING AT FIXES', 2:'SOMETIMES DIAGNOSING', 3:'SYSTEMATIC CORRECTION' } }
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
  color:'gold', drillCount:9,
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
          diagram: `<img loading="lazy" src="diagrams/d-prog-a.png" alt="Programming A — nine ball end game layout" style="width:100%;border-radius:8px;margin-top:8px"><img loading="lazy" src="diagrams/d-prog-a-routes.png" alt="Programming A — runout routes" style="width:100%;border-radius:8px;margin-top:4px">`,
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
          diagram: `<img loading="lazy" src="diagrams/d-prog-b.png" alt="Programming B — eight ball layout" style="width:100%;border-radius:8px;margin-top:8px"><img loading="lazy" src="diagrams/d-prog-b-zone.png" alt="Programming B — position zone" style="width:100%;border-radius:8px;margin-top:4px">`,
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
          diagram: `<img loading="lazy" src="diagrams/d-8ball-endgame.png" alt="Eight Ball End Game diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
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
          diagram: `<img loading="lazy" src="diagrams/d-balls-middle.png" alt="Balls in the Middle diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
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
          diagram: `<img loading="lazy" src="diagrams/d-doing-cosmo.png" alt="Doing the Cosmo diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
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
          diagram: `<img loading="lazy" src="diagrams/d-runout-power.png" alt="Building Your Runout Power diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
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
          diagram: `<img loading="lazy" src="diagrams/d-pep.png" alt="PEP — nine ball rack layout" style="width:100%;border-radius:8px;margin-top:8px"><img loading="lazy" src="diagrams/d-pep-2.png" alt="PEP — three steps analysis" style="width:100%;border-radius:8px;margin-top:4px">`,
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
          diagram: `<img loading="lazy" src="diagrams/d-nine-patterns-1.png" alt="Nine Ball Patterns — Diagram 1" style="width:100%;border-radius:8px;margin-top:8px"><img loading="lazy" src="diagrams/d-nine-patterns-2.png" alt="Nine Ball Patterns — Diagram 2" style="width:100%;border-radius:8px;margin-top:4px"><img loading="lazy" src="diagrams/d-nine-patterns-3.png" alt="Nine Ball Patterns — Diagram 3" style="width:100%;border-radius:8px;margin-top:4px">`,
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
          diagram: `<img loading="lazy" src="diagrams/d-vertical-axis-a.png" alt="Vertical Axis Only — Part A and B" style="width:100%;border-radius:8px;margin-top:8px"><img loading="lazy" src="diagrams/d-vertical-axis.png" alt="Vertical Axis Only — advanced layout" style="width:100%;border-radius:8px;margin-top:4px">`,
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
          diagram: `<img loading="lazy" src="diagrams/d-5-basics.png" alt="The 5 Basic Safety Hits" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'checklist', id:'d-5-basics', items:['Safety 1: Full ball hit (practiced)','Safety 2: Half ball hit (practiced)','Safety 3: Thin hit (practiced)','Safety 4: Double kiss avoidance (practiced)','Safety 5: Follow the pathway (practiced)'] }
        },
        {
          id:'d-follow-pathway', name:'FOLLOW THE PATHWAY', accent:'cyan', tags:['SAFETY','CB CONTROL'],
          cure:'Sending the CB along a rail path behind an obstacle is one of the most reliable safeties in pool.',
          objective:'Master the pathway safety — CB travels rail to rail and parks behind a blocking ball.',
          steps:[
            'PART A — NEAR FULL HIT (3/4): Contact OB at 3/4 fullness. CB deflects to the rail and follows the pathway back, landing behind the cluster.',
            'PART B — LONGER ROUTE: From lower table, same concept. CB travels more rail distance and stops in a more distant hiding spot.',
            'Run 5 from each position. Score: how many times CB ends up behind a ball with no clear shot for opponent.'
          ],
          review:'This safety works because the CB hugs the rail on its return trip, making it very predictable and controllable once you practice the speed.',
          diagram: `<img loading="lazy" src="diagrams/d-follow-pathway.png" alt="Follow the Pathway diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMissAB', id:'d-follow-pathway', labelA:'PART A (3/4 HIT)', labelB:'PART B (LONG ROUTE)', shots:5 }
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
          diagram: `<img loading="lazy" src="diagrams/d-off-rail.png" alt="Off the Rail and Into Jail diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMiss', id:'d-off-rail', showPct:true, label:'SUCCESSFUL SAFETIES' }
        }
      ]
    },
    {
      id:'s7-skills', title:'SAFETY SKILLS',
      desc:'Advanced safety techniques for the serious player.',
      drills:[
        {
          id:'d-spin-to-win', name:'SPIN TO WIN', accent:'cyan', tags:['SAFETY SKILLS','ENGLISH'],
          cure:'Most players play safeties with center ball and leave results to chance. Adding english gives you directional control over the CB.',
          objective:'Learn to use outside english, inside english, and no english to control CB destination on safety shots.',
          steps:[
            'PART A: Set up the safety with CB on left side. Hit OB with outside english → CB travels wider. Hit with no english → CB travels natural angle. Hit thin → CB continues forward.',
            'PART B: Mirror the same exercise from the right side. Note how english effects reverse.',
            'Practice half ball and thin hits from both positions. Score: CB ends in target zone.'
          ],
          review:'Outside (running) english widens the CB\'s exit angle after contact. Inside (reverse) english narrows it. Choosing correctly turns a random CB path into a controlled one.',
          diagram: `<img loading="lazy" src="diagrams/d-spin-to-win.png" alt="Spin to Win — english safety diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMissAB', id:'d-spin-to-win', labelA:'PART A (LEFT SIDE)', labelB:'PART B (RIGHT SIDE)', shots:5 }
        },
        {
          id:'d-tangent-line', name:'TANGENT LINE SAFETIES', accent:'gold', tags:['SAFETY SKILLS','CB CONTROL'],
          cure:'The CB always leaves at 90° to the OB\'s path on a stun shot. Knowing this lets you predict exactly where the CB goes.',
          objective:'Use the 90° tangent line to predict CB destination and engineer precise safety outcomes.',
          steps:[
            'PART A: Set CB and OB at 45° angle. Stun the OB. The CB should travel 90° from the OB\'s path — straight across the table. Mark where it lands.',
            'PART B: Change the cut angle. The tangent line shifts. Practice predicting CB destination before each shot.',
            'Run 5 attempts per angle. Goal: CB lands within 6 inches of predicted spot.'
          ],
          review:'The tangent line is the most reliable CB path predictor in pool. Master it and you can engineer the CB to any rail on safety shots.',
          diagram: `<img loading="lazy" src="diagrams/d-tangent-line.png" alt="Tangent Line Safeties diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMissAB', id:'d-tangent-line', labelA:'PART A (45°)', labelB:'PART B (VARIED ANGLES)', shots:5 }
        },
        {
          id:'d-angle-departure', name:'ANGLE OF DEPARTURE', accent:'red', tags:['SAFETY SKILLS','CB CONTROL'],
          cure:'At common cut angles, the CB departure angle is predictable. Knowing it lets you engineer the CB to any position.',
          objective:'Learn the CB departure angles at 15°, 30°, 45°, and 60° cut shots with a stun stroke.',
          steps:[
            'Place OB at center table. CB at position A (30° cut angle). Stun the shot — CB should travel at 90° from OB path.',
            'Move CB to position B (different angle). Repeat.',
            'Practice all 4 angles shown: 15°, 30°, 45°, 60°. Note how the tangent line rotates with each angle.',
            'Score: predict the landing zone before each shot, check if CB lands there.'
          ],
          review:'At 30° cut, CB goes wide. At 45°, CB goes cross-table. At 60°, CB goes nearly back toward you. These are fixed laws — memorize them.',
          diagram: `<img loading="lazy" src="diagrams/d-angle-departure.png" alt="Angle of Departure diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMiss', id:'d-angle-departure', showPct:true, label:'CB LANDED IN PREDICTED ZONE' }
        },
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
          diagram: `<img loading="lazy" src="diagrams/d-skimming.png" alt="Skimming the Cream diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
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
          diagram: `<img loading="lazy" src="diagrams/d-thin-hit.png" alt="The Thin Hit Diversion diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
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
          diagram: `<img loading="lazy" src="diagrams/d-chess-pieces.png" alt="Moving the Chess Pieces diagram" style="width:100%;border-radius:8px;margin-top:8px"><img loading="lazy" src="diagrams/d-both-balls-key.png" alt="Controlling Both Balls — key positions" style="width:100%;border-radius:8px;margin-top:4px">`,
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
          diagram: `<img loading="lazy" src="diagrams/d-ob-distance.png" alt="Object Ball Distance Control diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMiss', id:'d-ob-distance', showPct:true, label:'OB IN TARGET ZONE' }
        }
      ]
    },
    {
      id:'s7-planning', title:'SAFETY PLANNING & ROUTES',
      desc:'How to read, plan, and execute safeties from any position on the table.',
      drills:[
        {
          id:'d-plan-safety', name:'PLANNING THE PERFECT SAFETY', accent:'cyan', tags:['SAFETY','PLANNING'],
          cure:'Most players play safeties reactively. Planning before you shoot triples your success rate.',
          objective:'Apply a 3-step pre-shot safety plan to every defensive shot.',
          steps:[
            'STEP 1 — WHERE do I want the OB to end up? Pick a target zone (S = safe zone).',
            'STEP 2 — WHERE do I want the CB to end up? Behind a ball, against a rail, or at maximum distance.',
            'STEP 3 — WHICH hit type gets both balls there? Full, half, thin, or rail first?',
            'PART A: Apply the plan to the top-table layout. PART B: Apply to the bottom layout.',
            'Score: 1 point if OB in target zone, 1 point if CB leaves opponent no shot. Max 2 per attempt.'
          ],
          review:'The 3-step plan takes 5 seconds. Players who skip it leave both balls in mediocre positions 80% of the time.',
          diagram: `<img loading="lazy" src="diagrams/d-plan-safety.png" alt="Planning the Perfect Safety diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMissAB', id:'d-plan-safety', labelA:'PART A (TOP TABLE)', labelB:'PART B (BOTTOM TABLE)', shots:5 }
        },
        {
          id:'d-bulls-eye', name:"BULL'S EYE", accent:'gold', tags:['SAFETY','CB CONTROL'],
          cure:'CB destination control on safeties is a trainable skill. Most players never practice it in isolation.',
          objective:'Land the CB in a specific corner zone (A, B, C, or D) using different hit types and speeds.',
          steps:[
            'Place the OB at center table. Target corner zones are labeled A (top-left), B (top-right), C (bottom-left), D (bottom-right).',
            'Call your target corner BEFORE shooting. Execute the safety to land OB safely while parking CB in the called zone.',
            'Run 5 attempts per corner. Score: CB within 1 diamond of the called corner pocket.'
          ],
          review:'This drill trains spatial awareness and speed control simultaneously. Start with the two easiest corners, then add the harder ones.',
          diagram: `<img loading="lazy" src="diagrams/d-bulls-eye.png" alt="Bull's Eye CB placement drill" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMiss', id:'d-bulls-eye', showPct:true, label:"CB IN CALLED ZONE" }
        },
        {
          id:'d-safety-routes', name:'POSITION ROUTES FOR A SAFETY', accent:'red', tags:['SAFETY','PLANNING'],
          cure:'There are 2-3 viable CB routes on every safety. Knowing which to choose before shooting separates good safety players from great ones.',
          objective:'Identify and execute the A-route (preferred) and B-route (alternate) for a given safety.',
          steps:[
            'Study the diagram. Route A (position route) uses a specific hit type to land CB behind the cluster.',
            'Route B is the alternate when Route A is blocked.',
            'Set up the layout. Execute Route A first from 5 positions. Then run Route B from same positions.',
            'Score: OB in safe zone AND CB on the preferred route = 2 pts. OB safe only = 1 pt.'
          ],
          review:'Having two planned routes prevents panic decisions. The A-route is your first choice; B-route is your safety valve when something unexpected occurs.',
          diagram: `<img loading="lazy" src="diagrams/d-safety-routes.png" alt="Position Routes for a Safety diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMissAB', id:'d-safety-routes', labelA:'ROUTE A (PREFERRED)', labelB:'ROUTE B (ALTERNATE)', shots:5 }
        },
        {
          id:'d-long-safety', name:'LONG DISTANCE SAFETY ROUTES', accent:'cyan', tags:['SAFETY','CB CONTROL'],
          cure:'Long distance safeties are often the best option in Nine Ball but most players avoid them because they seem too hard.',
          objective:'Execute rail-length safety routes where CB travels 3+ rails to hide behind the OB.',
          steps:[
            'Set up OB at one end of the table. CB near the opposite end.',
            'Play a safety that sends OB softly to the far rail while CB travels rail-to-rail and parks at maximum distance from OB.',
            'Speed is critical — too hard and CB travels past the hiding spot. Too soft and OB doesn\'t reach the far rail.',
            'Run 5 attempts. Score: OB on far rail AND CB 3+ diamonds away from OB.'
          ],
          review:'Long distance safeties work because the opponent must travel the entire table to play a shot. Even a mediocre long safety is often better than a perfect short one.',
          diagram: `<img loading="lazy" src="diagrams/d-long-safety.png" alt="Long Distance Safety Routes diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMiss', id:'d-long-safety', showPct:true, label:'SUCCESSFUL LONG SAFETIES' }
        },
        {
          id:'d-both-balls', name:'CONTROLLING BOTH BALLS', accent:'gold', tags:['SAFETY SKILLS','ADVANCED'],
          cure:'Amateur safeties control one ball. Professional safeties control both — OB goes to jail, CB goes to maximum distance.',
          objective:'Develop the ability to simultaneously place both balls in ideal defensive positions.',
          steps:[
            'PART A: CB shoots OB toward the end rail while CB angle sends it to the opposite end. Both balls at maximum distance from each other.',
            'PART B: CB sends OB into a cluster while CB parks behind the opposite cluster. Opponent faces a blocked OB with no escape route.',
            'Run 5 from each setup. 2 pts = both balls in ideal zones. 1 pt = one ball in ideal zone.'
          ],
          review:'The best safeties make the opponent\'s situation progressively worse with each exchange. Controlling both balls is the key to this.',
          diagram: `<img loading="lazy" src="diagrams/d-both-balls.png" alt="Controlling Both Balls diagram" style="width:100%;border-radius:8px;margin-top:8px"><img loading="lazy" src="diagrams/d-both-balls-2.png" alt="Controlling Both Balls — alternate positions" style="width:100%;border-radius:8px;margin-top:4px">`,
          scoring:{ type:'hitMissAB', id:'d-both-balls', labelA:'PART A (SPLIT)', labelB:'PART B (CLUSTER)', shots:5 }
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
          diagram: `<img loading="lazy" src="diagrams/d-float-hook.png" alt="Float and Hook diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
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
          diagram: `<img loading="lazy" src="diagrams/d-split-atom.png" alt="Split the Atom diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
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
  color:'red', drillCount:11,
  sections:[
    {
      id:'s8-fundamentals', title:'KICKING FUNDAMENTALS',
      desc:'The core mechanics and geometry of kick shots.',
      drills:[
        {
          id:'d-kick-basics', name:'BASICS OF KICKING', accent:'cyan', tags:['KICKING','BASICS'],
          cure:'Most players kick by guessing. Understanding the geometry of rail reflection makes kick shots learnable and repeatable.',
          objective:'Master the fundamental 1-rail kick from both sides of the table at medium speed.',
          steps:[
            'PART A: CB at center-left. Kick target balls A-1, A-2, A-3 using a medium stroke. Note the mirror-image reflection angle off the rail.',
            'PART B: CB at center-right. Same exercise mirrored. Kick target balls A-1 and A-2.',
            'Use Medium (5) speed for all attempts. Speed consistency is the key to repeatable kick angles.',
            'Score: number of targets contacted out of 5 attempts per side.'
          ],
          review:'The angle in equals the angle out — but only with center ball and consistent speed. Once you add english or change speed, the angles shift predictably.',
          diagram: `<img loading="lazy" src="diagrams/d-kick-basics.png" alt="Basics of Kicking diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMissAB', id:'d-kick-basics', labelA:'PART A (LEFT SIDE)', labelB:'PART B (RIGHT SIDE)', shots:5 }
        },
        {
          id:'d-short-rail', name:'SHORT RAIL MASTERY', accent:'gold', tags:['KICKING','SHORT RAIL'],
          cure:'Balls near the rail are far easier to kick than balls in the open. Start here and build confidence.',
          objective:'Master kick shots to balls frozen or near-frozen to the rail from multiple CB positions.',
          steps:[
            'PART A: Balls 1-6 lined along the top rail. CB at positions A, B, C on the left side. Kick each ball in sequence.',
            'PART B: Balls near the side pockets (positions 1-6 along right rail). Kick from CB positions along the bottom.',
            'One ball on the table at a time. Score: contact made on the target ball.'
          ],
          review:'Rail balls are kick-shot training wheels. Once you can hit them reliably, extend to balls a diamond off the rail.',
          diagram: `<img loading="lazy" src="diagrams/d-short-rail.png" alt="Short Rail Mastery diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMissAB', id:'d-short-rail', labelA:'PART A (TOP RAIL)', labelB:'PART B (SIDE RAIL)', shots:6 }
        },
        {
          id:'d-english-pickup', name:'ENGLISH PICK UP', accent:'red', tags:['KICKING','ENGLISH'],
          cure:'Center ball kicks miss predictably at certain angles. Running english "picks up" the angle and rescues unmakeable kicks.',
          objective:'Learn how much each degree of running english shifts the CB rebound angle at 19°, 31°, 45°, and 60°.',
          steps:[
            'Set CB at center table. OB near the corner. Kick with center ball first — note where CB rebounds to.',
            'Now kick with a half tip of running (outside) english. Note how the rebound angle widens.',
            'Practice all 4 angles: A 60°, B 45°, C 40°, D 19°. At each angle, compare center ball vs. running english rebound.',
            'Score: how many kicks successfully contact the OB using english correction.'
          ],
          review:'Running english widens the rebound angle; reverse english narrows it. At 45°, a half tip of english shifts the landing point by nearly a diamond.',
          diagram: `<img loading="lazy" src="diagrams/d-english-pickup.png" alt="English Pick Up diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMissMulti', id:'d-english-pickup', groups:['60°','45°','31°','19°'], shots:5 }
        }
      ]
    },
    {
      id:'s8-advanced', title:'ADVANCED KICKS',
      desc:'Gaps, corners, long rails, and precision kick-to-make shots.',
      drills:[
        {
          id:'d-kick-gaps', name:'THE GAPS', accent:'cyan', tags:['KICKING','GAPS'],
          cure:'The gap between two balls creates a narrow target zone for kick shots. Knowing how to aim through gaps is essential.',
          objective:'Kick the CB through specific gaps between obstacle balls to contact the target.',
          steps:[
            'PART A: Obstacle balls create a gap at center table. CB must travel through the gap to reach the target. Use running english to widen the angle as needed.',
            'PART B: Gap is near the side pocket. CB must split the gap from a different angle.',
            'Start with a wider gap (2 balls apart), then close it to 1 ball apart for the advanced version.',
            'Score: CB passes through the gap AND contacts the target.'
          ],
          review:'Gap kicks require precise aim at the entry point of the gap, not the target ball. Aim at the gap first, the ball second.',
          diagram: `<img loading="lazy" src="diagrams/d-kick-gaps.png" alt="The Gaps diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMissAB', id:'d-kick-gaps', labelA:'PART A (CENTER GAP)', labelB:'PART B (SIDE GAP)', shots:5 }
        },
        {
          id:'d-corner-gap', name:'THE CORNER POCKET GAP', accent:'gold', tags:['KICKING','CORNER'],
          cure:'The corner pocket gap makes direct kick shots to near-corner balls miss on the pocket side.',
          objective:'Navigate the corner pocket gap using reverse english to swing the CB onto Path B.',
          steps:[
            'OB near the corner pocket. A direct kick on Path A misses into the pocket gap.',
            'Use reverse (inside) english to narrow the CB rebound angle onto Path B, bypassing the pocket.',
            'Aim slightly fuller on the OB to compensate for the english-induced deflection.',
            'Practice from the positions shown. Score: CB contacts OB without falling into the pocket gap.'
          ],
          review:'Inside english narrows the CB rebound. This is the one situation where reverse english is almost always the right call.',
          diagram: `<img loading="lazy" src="diagrams/d-corner-gap.png" alt="The Corner Pocket Gap diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMiss', id:'d-corner-gap', showPct:true, label:'CONTACT KICKS' }
        },
        {
          id:'d-stick-hook', name:'STICK AND HOOK', accent:'red', tags:['KICKING','CB CONTROL'],
          cure:'A kick shot that contacts the OB but leaves an easy shot for opponent is only half a success.',
          objective:'Kick the OB cleanly AND control where the CB ends up after contact.',
          steps:[
            'PART A: OB near the rail. Use Medium Hard (8) stroke with half tip of follow. CB should stick near the contact point or travel to the opposite end.',
            'PART B: Two-rail kick to hit OB from the back side. CB stops after contact — OB absorbs the energy.',
            'Run 5 from each position. Score: OB contacted AND CB in safe position = 2 pts, OB only = 1 pt.'
          ],
          review:'CB destination after a kick is just as important as hitting the OB. The best kick shots hide the CB while contacting the OB.',
          diagram: `<img loading="lazy" src="diagrams/d-stick-hook.png" alt="Stick and Hook diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMissAB', id:'d-stick-hook', labelA:'PART A (1-RAIL)', labelB:'PART B (2-RAIL)', shots:5 }
        },
        {
          id:'d-kick-to-make', name:'KICK TO MAKE', accent:'cyan', tags:['KICKING','POCKETING'],
          cure:'Most players kick just to touch the OB. A small percentage of kicks are actually makeable — knowing which ones transforms a defensive situation into an offensive one.',
          objective:'Identify and execute kick shots where the OB can actually be pocketed.',
          steps:[
            'PART A: OB near the pocket. CB angle and rail geometry allow the OB to be kicked in. Identify the line and execute.',
            'PART B: OB at a different position. Two possible kick-to-make routes — choose the higher percentage one.',
            'Before each attempt: evaluate whether kick-to-make is realistic. If not, play for safety instead.',
            'Score: OB pocketed = 2 pts, OB contacted and safe = 1 pt, miss = 0.'
          ],
          review:'A kick-to-make opportunity occurs when the OB is within about 1 diamond of a pocket and the CB approach angle is favorable. Recognize it instantly.',
          diagram: `<img loading="lazy" src="diagrams/d-kick-to-make.png" alt="Kick to Make diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMissAB', id:'d-kick-to-make', labelA:'PART A', labelB:'PART B', shots:5 }
        },
        {
          id:'d-makeable-kicks', name:'MAKEABLE KICK SHOTS', accent:'gold', tags:['KICKING','POCKETING'],
          cure:'There is a predictable set of kick shot positions where pocketing the OB is genuinely achievable. Drilling them trains your eye to spot them in competition.',
          objective:'Execute kick shots from the makeable positions shown, pocketing the OB at Medium (5) speed.',
          steps:[
            'PART A: Balls 1-6 at positions shown (lower table). All shots at Medium (5). Kick each ball in sequence from the CB position.',
            'PART B: Balls 1-6 at positions shown (upper table). Mirror of Part A.',
            'Score: number of balls actually pocketed out of 6 per part.',
            'Advanced: reduce speed to Medium Soft (4) for tighter control.'
          ],
          review:'The makeable kick shot zone extends from the pocket to about 1.5 diamonds along the rail and 0.5 diamonds off the rail. Outside this zone, play safe.',
          diagram: `<img loading="lazy" src="diagrams/d-makeable-kicks.png" alt="Makeable Kick Shots diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMissAB', id:'d-makeable-kicks', labelA:'PART A (LOWER)', labelB:'PART B (UPPER)', shots:6 }
        },
        {
          id:'d-long-railers', name:'LONG RAILERS', accent:'red', tags:['KICKING','LONG RAIL'],
          cure:'Long rail kicks are the hardest to master but the most common kick-snooker situation in Nine Ball.',
          objective:'Execute 1-rail long kick shots to balls positioned at A, B, and C along the far rail.',
          steps:[
            'CB at bottom-center. Target balls A, B, C are progressively farther along the far rail.',
            'Ball A (closest) — use center ball with medium speed. Angle in = angle out.',
            'Ball B (middle) — may require a touch of running english to reach.',
            'Ball C (farthest, hardest) — running english required to stretch the rebound angle.',
            'Run 5 per target. Score: contact made.'
          ],
          review:'Long rail kicks fail because of speed inconsistency. Every attempt at the same speed. Once your speed is locked, adjust aim for english correction.',
          diagram: `<img loading="lazy" src="diagrams/d-long-railers.png" alt="Long Railers diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMissMulti', id:'d-long-railers', groups:['BALL A','BALL B','BALL C'], shots:5 }
        },
        {
          id:'d-treadmill', name:'THE TREADMILL', accent:'cyan', tags:['KICKING','DRILL'],
          cure:'Systematic kicking practice across all angles and distances in a single session.',
          objective:'Kick target balls from 8 progressively harder CB positions around the table.',
          steps:[
            'Place target balls near the top rail as shown. CB positions 1-8 progress from easy angles to long-distance kicks.',
            'Kick each target from its corresponding CB position.',
            'Position 1 (short, easy angle) to Position 8 (full table length).',
            'Score 1 point per contact. Maximum: 8 points per round.',
            'Advanced: run 3 consecutive rounds. Track total (max 24).'
          ],
          review:'The treadmill exposes exactly which kick angles need work. Your weakest positions will show up quickly — focus extra practice there.',
          diagram: `<img loading="lazy" src="diagrams/d-treadmill.png" alt="The Treadmill diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'pointTracker', id:'d-treadmill', maxPts:8, label:'TREADMILL SCORE' }
        },
        {
          id:'d-real-kicks', name:'REAL WORLD KICK SHOTS', accent:'gold', tags:['KICKING','GAME SIMULATION'],
          cure:'Isolated kick drills don\'t capture game pressure. Random layouts train adaptability.',
          objective:'Practice kick shots from game-realistic layouts using rectangles to define the snooker zones.',
          steps:[
            'The diagram shows two snooker zone rectangles — CB is inside one, OB inside the other.',
            'Set up the layout and kick to contact the OB. Evaluate: did you hit it, and where did CB end up?',
            'After each kick, reset to a new random snooker situation.',
            'Rate each kick: 1=Missed OB, 2=Hit OB/left easy, 3=Hit OB/left safe.'
          ],
          review:'In real games you rarely get the same kick twice. The ability to quickly assess and execute an unfamiliar kick angle is the true skill.',
          diagram: `<img loading="lazy" src="diagrams/d-real-kicks.png" alt="Real World Kick Shots diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
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
  color:'gold', drillCount:24,
  sections:[
    {
      id:'s9-basics', title:'BREAK FUNDAMENTALS',
      desc:'Understanding break shot mechanics and game-specific strategy.',
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
          id:'d-break-angles', name:'NINE BALL BREAK', accent:'cyan', tags:['BREAK','NINE BALL'],
          cure:'The angle you approach the rack from determines whether you make balls and where the CB ends up.',
          objective:'Master break shots from the standard Nine Ball break position with consistent CB control.',
          steps:[
            'Place CB near the side rail at the head string. Use Hard (7-8) stroke.',
            'Goal: drive the two corner balls to the rails. CB should finish near center table.',
            'Track per session: balls made, CB ending position, scratches.',
            'Run 5 breaks. Compare results to the diagram zones.'
          ],
          review:'The Nine Ball break from the side rail is the most common at the professional level. Power + CB control is the formula.',
          diagram: `<img loading="lazy" src="diagrams/d-nine-break.png" alt="Nine Ball Break diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMissMulti', id:'d-break-angles', groups:['BALLS MADE', 'CB CENTER TABLE', 'NO SCRATCH'], shots:5 }
        },
        {
          id:'d-eight-break', name:'EIGHT BALL BREAK SHOT', accent:'gold', tags:['BREAK','EIGHT BALL'],
          cure:'Eight Ball break strategy is different from Nine Ball — the goal is to make a ball and control the CB, not just scatter.',
          objective:'Develop a consistent Eight Ball break with reliable CB control.',
          steps:[
            'Break from just inside the side rail. Hit the 1-ball full, Hard (7-8). Goal: make a corner ball.',
            'CB should rebound to near center table. Avoid table-length scratches.',
            'Run 5 breaks. Track: balls made, CB ending position, scratches.'
          ],
          review:'An Eight Ball break that scatters all balls but ends up in a terrible CB position is worse than a controlled break that makes only one ball.',
          diagram: `<img loading="lazy" src="diagrams/d-eight-break.png" alt="Eight Ball Break diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMiss', id:'d-eight-break', showPct:true, label:'BALL MADE ON BREAK' }
        },
        {
          id:'d-follow-back-out', name:'FOLLOW BACK OUT', accent:'red', tags:['BREAK','CB CONTROL'],
          cure:'CB control on the break determines whether you have a shot after. Learning to send CB back to center is crucial.',
          objective:'Consistently execute a break where the CB follows back toward center table.',
          steps:[
            'Break from the side rail. Use Medium Hard (6), Medium Hard to Hard (7), or Hard (7) stroke depending on distance.',
            'CB hits the rack and follows the exit path back through center table.',
            'Goal: CB ends up somewhere in the center third of the table — not scratching, not hiding behind balls.',
            'Run 5 breaks from each speed. Identify which speed gives best CB placement for your stroke.'
          ],
          review:'Most professional Nine Ball players use a Medium Hard break with a slight follow stroke to control CB placement.',
          diagram: `<img loading="lazy" src="diagrams/d-follow-back-out.png" alt="Follow Back Out diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMiss', id:'d-follow-back-out', showPct:true, label:'CB TO CENTER TABLE' }
        },
        {
          id:'d-1pocket-break', name:'1-POCKET BREAK SHOT', accent:'cyan', tags:['BREAK','1-POCKET'],
          cure:'The 1-Pocket break is entirely about sending corner balls toward your pocket while keeping the CB safe.',
          objective:'Execute the 1-Pocket break with reliable CB and corner ball control.',
          steps:[
            'CB placed near the side rail at head string. Aim to clip the corner ball of the rack.',
            'Goal: corner balls travel toward your designated pocket. CB returns safely toward the head rail.',
            'Run 5 breaks from each side.'
          ],
          review:'The 1-Pocket break is worth significant practice time. Every exchange of the break in 1-Pocket is a strategic moment.',
          diagram: `<img loading="lazy" src="diagrams/d-1pocket-break.png" alt="1-Pocket Break Shot diagram" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMissAB', id:'d-1pocket-break', labelA:'LEFT SIDE', labelB:'RIGHT SIDE', shots:5 }
        },
        {
          id:'d-sp-break', name:'STRAIGHT POOL OPENING BREAK', accent:'gold', tags:['BREAK','STRAIGHT POOL'],
          cure:'The Straight Pool opening break is a safety shot — the goal is to hit two balls and return the CB to the head rail.',
          objective:'Execute the Straight Pool safety break reliably to positions A, B, C, or D.',
          steps:[
            'Place CB near head rail on the side opposite your designated pocket.',
            'Use Medium Hard (6) speed. Aim to clip the corner ball of the rack.',
            'CB should follow Path B (to position B) — or aim for A, C, D depending on opponent position.',
            'Goal: hit exactly 2 balls, CB returns safely to head rail area.'
          ],
          review:'Speed of Stroke: Most Straight Pool breaks are Medium Hard (6) — 40% of the time. Hard (7) = 20%. Medium (5) = 20%.',
          diagram: `<img loading="lazy" src="diagrams/d-sp-break.png" alt="Straight Pool Opening Break" style="width:100%;border-radius:8px;margin-top:8px"><img loading="lazy" src="diagrams/d-sp-break-practice.png" alt="Practicing Straight Pool Break" style="width:100%;border-radius:8px;margin-top:4px">`,
          scoring:{ type:'hitMiss', id:'d-sp-break', showPct:true, label:'CB TO SAFE ZONE' }
        },
        {
          id:'d-break-power', name:'DEVELOPING BREAK POWER', accent:'red', tags:['BREAK','POWER'],
          cure:'Break power comes from transferring body weight into the shot — not from arm strength alone.',
          objective:'Build and measure your break power using the speed-of-scatter metric.',
          steps:[
            'Break from center of the head string. Hard (7-8) stroke.',
            'POWER INDICATORS: Corner balls reaching the rails = good power. 1-ball bouncing back past the head string = great power.',
            'POWER BUILDING: Work on weight transfer. Plant your back foot. Drive hips forward on the swing.',
            'Run 5 breaks. Count: how many times does the 1-ball clear the third diamond?'
          ],
          review:'For a 640 Fargo, break consistency is more important than raw power. Master accuracy first, then build power gradually.',
          scoring:{ type:'hitMiss', id:'d-break-power', showPct:true, label:'POWERFUL BREAKS' }
        }
      ]
    },
    {
      id:'s9-141-basic', title:'14.1 BREAK — BACK CUTS & ANGLES',
      desc:'Straight Pool break shots using back cut angles to control CB destination.',
      drills:[
        {
          id:'d-141-setup', name:'HOW TO PRACTICE THE 14.1 BREAK', accent:'cyan', tags:['BREAK','STRAIGHT POOL','14.1'],
          cure:'Most players never isolate break shot practice in Straight Pool. The break is the most important recurring shot in the game.',
          objective:'Set up and execute isolated 14.1 break shot practice using the rack without a full game.',
          steps:[
            'Rack 15 balls in the triangle as shown. Place CB at your preferred break position.',
            'Execute the break shot to your target CB destination.',
            'After each break, re-rack and repeat from the same position.',
            'Focus session: 10-20 consecutive breaks from one position before moving to the next.'
          ],
          review:'Isolating the break shot in practice — separate from playing Straight Pool — accelerates improvement dramatically. 20 dedicated breaks per session builds real consistency.',
          diagram: `<img loading="lazy" src="diagrams/d-141-setup.png" alt="How to Practice the 14.1 Break" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMiss', id:'d-141-setup', showPct:true, label:'CB TO TARGET ZONE' }
        },
        {
          id:'d-back-cut-blaster', name:'BACK CUT RACK BLASTER', accent:'gold', tags:['BREAK','14.1','BACK CUT'],
          cure:'The back cut break sends the CB around the rack for maximum ball scatter with safe CB positioning.',
          objective:'Execute the back cut rack blaster from the corner, sending CB safely away after contact.',
          steps:[
            'CB positioned near the bottom corner. Use Medium Hard (8) stroke.',
            'Aim to cut the corner ball of the rack. CB travels back and away from the rack area.',
            'Goal: rack scatters, CB lands in safe open area away from the cluster.',
            'Run 5 breaks. Score: CB in open area (not in or behind rack debris).'
          ],
          review:'The back cut gives the CB a natural exit path away from the rack. This keeps you from scratching and gives a cleaner CB position.',
          diagram: `<img loading="lazy" src="diagrams/d-back-cut-blaster.png" alt="Back Cut Rack Blaster" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMiss', id:'d-back-cut-blaster', showPct:true, label:'CB TO SAFE ZONE' }
        },
        {
          id:'d-rail-back-cuts', name:'CLOSE TO THE RAIL BACK CUT SHOTS', accent:'red', tags:['BREAK','14.1','BACK CUT'],
          cure:'When CB is close to the rail, the back cut angles change. Knowing the 57° and 40° angles gives you exact aim points.',
          objective:'Execute back cut break shots at 57° and 40° with CB close to the long rail.',
          steps:[
            'POSITION A & B: CB tight to the long rail. Use Medium Hard (8) for both angles.',
            'At 57°: fuller hit, CB travels further back after contact.',
            'At 40°: thinner hit, CB takes a sharper exit angle.',
            'Run 5 from each angle. Score: rack disturbed AND CB to safe zone.'
          ],
          review:'Rail position shots are among the most accurate break shots in 14.1 because the rail gives you a consistent reference point for CB placement.',
          diagram: `<img loading="lazy" src="diagrams/d-rail-back-cuts.png" alt="Rail Back Cut Shots" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMissAB', id:'d-rail-back-cuts', labelA:'57° ANGLE', labelB:'40° ANGLE', shots:5 }
        },
        {
          id:'d-shallow-cuts', name:'SHALLOW CUT ANGLES', accent:'cyan', tags:['BREAK','14.1'],
          cure:'Shallow cut breaks send the CB forward along the rail — a completely different CB path from back cuts.',
          objective:'Execute shallow cut break shots from two CB positions, landing CB in the forward target zone.',
          steps:[
            'CB at Position A (farther from rack). Use Medium Hard (8). Aim for shallow cut on corner ball.',
            'CB at Position B (closer to rack). Same speed and angle. Compare CB destinations.',
            'Both positions: CB should travel forward along or near the rail to target zone.',
            'Run 5 from each position.'
          ],
          review:'Shallow cuts are the safer option when the back cut would risk CB going into the rack cluster. The forward CB path is very predictable.',
          diagram: `<img loading="lazy" src="diagrams/d-shallow-cuts.png" alt="Shallow Cut Angles" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMissAB', id:'d-shallow-cuts', labelA:'POSITION A', labelB:'POSITION B', shots:5 }
        },
        {
          id:'d-behind-rack-cuts', name:'BEHIND THE RACK BACK CUTS', accent:'gold', tags:['BREAK','14.1','BACK CUT'],
          cure:'Breaking from directly behind the rack forces a specific back cut angle that many players never practice.',
          objective:'Execute back cut breaks from center position behind the rack with CB returning to center table.',
          steps:[
            'CB positioned directly behind the rack at center table. Use Medium Hard (8).',
            'Cut the corner ball. CB should angle back and return toward center-lower table.',
            'This is a symmetrical break — practice from both the left corner and right corner.',
            'Run 5. Score: CB returns to center table, not lodged in rack debris.'
          ],
          review:'The center-behind-rack position is common in actual 14.1 play. Mastering this break shot saves you from having to play a difficult safety instead.',
          diagram: `<img loading="lazy" src="diagrams/d-behind-rack-cuts.png" alt="Behind the Rack Back Cuts" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMiss', id:'d-behind-rack-cuts', showPct:true, label:'CB TO CENTER TABLE' }
        }
      ]
    },
    {
      id:'s9-141-advanced', title:'14.1 BREAK — RAIL & ADVANCED SHOTS',
      desc:'Rail breaks, escape shots, and specialized 14.1 break positions.',
      drills:[
        {
          id:'d-side-rail-smasher', name:'SIDE RAIL RACK SMASHER', accent:'cyan', tags:['BREAK','14.1','RAIL'],
          cure:'Breaking from the side rail creates a powerful perpendicular hit on the rack with excellent CB control.',
          objective:'Execute the side rail rack smasher with CB traveling to the target zone.',
          steps:[
            'CB tight against or near the long rail, level with the rack. Use Medium Hard (8).',
            'Drive into the side of the rack. CB follows path straight back along or near the rail.',
            'Goal: rack scatters forward, CB rolls back to safe position near the rail.',
            'Run 5. Score: CB stays within a diamond of the side rail.'
          ],
          review:'The side rail break is highly controllable because the CB path after contact is nearly linear. The rail acts as a guide.',
          diagram: `<img loading="lazy" src="diagrams/d-side-rail-smasher.png" alt="Side Rail Rack Smasher" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMiss', id:'d-side-rail-smasher', showPct:true, label:'CB TO RAIL ZONE' }
        },
        {
          id:'d-rail-cushion', name:'RAIL OFF THE CUSHION', accent:'gold', tags:['BREAK','14.1','RAIL'],
          cure:'Breaking off the cushion gives the CB a natural soft landing with minimal post-contact travel.',
          objective:'Execute break shots off the side cushion with CB positions A and B.',
          steps:[
            'CB at positions A and B — both close to the long rail but at different distances from the rack.',
            'Use Medium Hard (8) for both. Hit the rack, rebound off the cushion.',
            'CB should come to rest in the near-rail zone after cushion contact.',
            'Run 5 from each position.'
          ],
          review:'The cushion absorbs energy from the CB, making this one of the softest-landing break positions. Ideal when you need the CB to stay short.',
          diagram: `<img loading="lazy" src="diagrams/d-rail-cushion.png" alt="Rail Off the Cushion" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMissAB', id:'d-rail-cushion', labelA:'POSITION A', labelB:'POSITION B', shots:5 }
        },
        {
          id:'d-end-rail', name:'END RAIL BREAK', accent:'red', tags:['BREAK','14.1','RAIL'],
          cure:'The end rail break sends CB all the way to the far end of the table — maximizing distance from the rack.',
          objective:'Execute end rail break shots at Hard (7) and Medium Hard (8), controlling CB to far end.',
          steps:[
            'POSITION A — Hard (7): CB travels through rack and to the end rail. Maximum distance.',
            'POSITION B — Medium Hard (8): CB travels to end rail but with slightly less energy.',
            'Both: CB should finish near the far end rail, as far as possible from the rack debris.',
            'Run 5 from each speed. Track: CB distance from far rail.'
          ],
          review:'End rail breaks are aggressive — the CB goes far but also gets into the most open position. Use when you need to avoid getting trapped near the rack.',
          diagram: `<img loading="lazy" src="diagrams/d-end-rail.png" alt="End Rail Break" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMissAB', id:'d-end-rail', labelA:'HARD (7)', labelB:'MEDIUM HARD (8)', shots:5 }
        },
        {
          id:'d-three-rail-escape', name:'THREE RAIL ESCAPE SHOT', accent:'cyan', tags:['BREAK','14.1','ADVANCED'],
          cure:'The three-rail escape sends the CB on a banking path that lands it in a completely different table zone from where it started.',
          objective:'Execute the three-rail break shot with CB traveling the full three-rail path to target zone.',
          steps:[
            'POSITION A — Medium Hard (8): CB travels three rails and lands in far open zone.',
            'POSITION B — Hard (7): Same three-rail path at higher speed. CB carries further.',
            'Aim: CB enters first rail at precise angle to complete the three-rail path.',
            'Run 5 from each speed. Score: CB completes three-rail path to target zone.'
          ],
          review:'The three-rail escape is the most complex break shot in 14.1. It requires consistent speed and precise entry angle. Master the two-rail version first.',
          diagram: `<img loading="lazy" src="diagrams/d-three-rail-escape.png" alt="Three Rail Escape Shot" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMissAB', id:'d-three-rail-escape', labelA:'MEDIUM HARD (8)', labelB:'HARD (7)', shots:5 }
        },
        {
          id:'d-into-corner-ball', name:'INTO THE CORNER BALL', accent:'gold', tags:['BREAK','14.1'],
          cure:'Shooting directly into the corner ball of the rack creates a predictable CB path and reliable rack scatter.',
          objective:'Execute break shots aimed at the corner ball with CB going to target zone at Medium Hard (8).',
          steps:[
            'CB at positions shown. Use Medium Hard (8) for all attempts.',
            'Aim directly at the corner ball of the rack (not the head ball).',
            'CB should deflect off the corner ball and travel to the near open zone.',
            'Run 5. Score: rack scattered + CB to open zone.'
          ],
          review:'The corner ball hit creates a defined CB deflection angle. Once you know the angle, this is one of the most reliable break shots.',
          diagram: `<img loading="lazy" src="diagrams/d-into-corner-ball.png" alt="Into the Corner Ball" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMiss', id:'d-into-corner-ball', showPct:true, label:'CB TO TARGET ZONE' }
        },
        {
          id:'d-bih-break', name:'BALL IN HAND BREAK SHOTS', accent:'red', tags:['BREAK','14.1','BALL IN HAND'],
          cure:'With ball in hand behind the line, you have maximum flexibility for break position. Most players waste this advantage.',
          objective:'Develop 3 reliable ball-in-hand break positions (A, B, C) for different rack situations.',
          steps:[
            'POSITION A — Hard (5 from center): Direct center break. Maximum power, less CB control.',
            'POSITION B — Medium Hard (8): Side angle break. Good scatter, controlled CB.',
            'POSITION C — Medium Hard (8): Far side angle. Corner ball focus, CB to near zone.',
            'Run 5 from each position. Identify which gives best CB position for your next shot.'
          ],
          review:'Ball in hand means you choose the break. Having 3 practiced options lets you select based on where the break ball is positioned.',
          diagram: `<img loading="lazy" src="diagrams/d-bih-break.png" alt="Ball in Hand Break Shots" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMissMulti', id:'d-bih-break', groups:['POSITION A','POSITION B','POSITION C'], shots:5 }
        },
        {
          id:'d-center-smasher', name:'CENTER TABLE RACK SMASHER', accent:'cyan', tags:['BREAK','14.1'],
          cure:'Breaking from center table is the most powerful option — maximum energy into the rack with the CB traveling straight through.',
          objective:'Execute center table rack smashers from positions A and B with Hard (7) stroke.',
          steps:[
            'POSITION A & B: CB at center table, directly in line with the rack. Hard (7) stroke.',
            'Hit the head ball full. CB continues straight through or slightly off the side ball.',
            'Goal: maximum rack scatter. CB stops near far end of table or side rail.',
            'Run 5 from each. Track balls scattered to rails.'
          ],
          review:'The center smasher sacrifices some CB control for maximum power. Use it when the rack position is difficult and you need the balls spread wide.',
          diagram: `<img loading="lazy" src="diagrams/d-center-smasher.png" alt="Center Table Rack Smasher" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMissAB', id:'d-center-smasher', labelA:'POSITION A', labelB:'POSITION B', shots:5 }
        },
        {
          id:'d-backdoor-break', name:'BACKDOOR', accent:'gold', tags:['BREAK','14.1','ADVANCED'],
          cure:'The backdoor break sends the CB through the rack and out the back side — giving maximum table spread.',
          objective:'Execute the backdoor break shot with CB exiting through the back of the rack at Hard (7).',
          steps:[
            'CB at the position shown. Use Hard (7) stroke.',
            'Aim to drive through the rack so CB exits out the back and continues to the far open zone.',
            'The rack scatters forward while CB goes backward — opposite directions.',
            'Run 5. Score: CB exits rack on the far side and reaches open table.'
          ],
          review:'The backdoor break is high risk, high reward. When it works, CB and balls end up in ideal positions. When it misses, CB can get buried. Practice before attempting in competition.',
          diagram: `<img loading="lazy" src="diagrams/d-backdoor-break.png" alt="Backdoor Break Shot" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMiss', id:'d-backdoor-break', showPct:true, label:'CB EXITS THROUGH RACK' }
        },
        {
          id:'d-sidepocket-hanger', name:'SIDE POCKET HANGER', accent:'red', tags:['BREAK','14.1','SIDE POCKET'],
          cure:'The side pocket hanger sets up a specific break ball position that leaves a hanger in the side pocket after the rack is broken.',
          objective:'Break the rack with the CB traveling to leave a ball hanging in the side pocket for a money ball.',
          steps:[
            'CB at the position shown. Use Hard (7) stroke.',
            'Drive into the rack from the angle shown. A rack ball should travel toward and stop near the side pocket.',
            'CB continues to center-table area.',
            'Run 5. Score: a ball within 1 diamond of the side pocket after break.'
          ],
          review:'Creating a side pocket hanger on the break is a high-percentage way to ensure your next shot is easy. Professional 14.1 players engineer this frequently.',
          diagram: `<img loading="lazy" src="diagrams/d-sidepocket-hanger.png" alt="Side Pocket Hanger Break" style="width:100%;border-radius:8px;margin-top:8px">`,
          scoring:{ type:'hitMiss', id:'d-sidepocket-hanger', showPct:true, label:'HANGER CREATED' }
        }
      ]
    },
    {
      id:'s9-consistency', title:'BREAK CONSISTENCY',
      desc:'Repeating the break with the same setup and execution every time.',
      drills:[
        {
          id:'d-break-setup', name:'BREAK SHOT SETUP ROUTINE', accent:'cyan', tags:['BREAK','ROUTINE'],
          cure:'Inconsistent break results are usually caused by inconsistent setup — different position, different grip, different approach.',
          objective:'Develop and follow a specific pre-break routine to maximize consistency.',
          steps:[
            'STEP 1: Choose your exact break position (rail, half diamond, center). Always place CB in the same spot.',
            'STEP 2: Walk into the shot from the same angle every time.',
            'STEP 3: Use the same stance width, same grip pressure, same backswing length.',
            'STEP 4: Before breaking, take one slow warm-up stroke to feel the stroke.',
            'Run 5 breaks following the routine strictly. Compare to 5 breaks without the routine.'
          ],
          review:'Professional players break from the same exact spot within an inch every time. This consistency is trained, not innate.',
          scoring:{ type:'qual', id:'d-break-setup', labels:{ 1:'DIFFERENT EVERY TIME', 2:'MOSTLY CONSISTENT', 3:'EXACT SAME ROUTINE' } }
        },
        {
          id:'d-break-cb-zone', name:'CB ZONE AFTER BREAK', accent:'gold', tags:['BREAK','CB CONTROL'],
          cure:'The most common break mistake: the CB ends up in a terrible position with no clear shot.',
          objective:'Consistently land the CB within a defined zone after the break.',
          steps:[
            'Define 3 target zones: A (center table), B (left of center), C (near head rail).',
            'Before each break: declare your target zone.',
            'Run 5 breaks per zone. Score: how many times does CB land in declared zone?',
            'For Nine Ball: Zone A is ideal — away from the rack area, near the 1-ball.'
          ],
          review:'Controlling the CB on the break is a skill entirely separate from power. Many top players sacrifice 15% power for 50% more CB control.',
          scoring:{ type:'hitMissMulti', id:'d-break-cb-zone', groups:['ZONE A (CENTER)', 'ZONE B (LEFT)', 'ZONE C (HEAD RAIL)'], shots:5 }
        },
        {
          id:'d-break-analysis', name:'BREAK SHOT SELF-ANALYSIS', accent:'red', tags:['BREAK','ANALYSIS'],
          cure:'Without measuring break results, you cannot know whether you are improving.',
          objective:'Establish your break statistics baseline and set improvement targets.',
          steps:[
            'Run 10 Nine Ball breaks. Record for each: balls made, CB ending quadrant (1-4), scratch (yes/no).',
            'CALCULATE: Balls made per break, scratch %, CB in center table %.',
            'TARGETS for a 640 Fargo: 0.8+ balls per break, <10% scratch, 50%+ CB center table.',
            'Run this analysis once per month to track progress.'
          ],
          review:'Most players dramatically overestimate the quality of their break. Honest statistics are the foundation of targeted improvement.',
          scoring:{ type:'checklist', id:'d-break-analysis', items:['Ran 10 breaks with ball-count tracking','Calculated balls-per-break average','Calculated scratch percentage','Calculated CB-center-table percentage','Set 30-day improvement target'] }
        }
      ]
    }
  ]
},


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
    applyTrendBadge(id, hist.entries);
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
  renderQueuePanel();
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

async function computeFargoSuggestion(session) {
  const profile = await getProfile();
  const currentFargo = profile.fargo || 550;

  const drills = session.drills || [];
  const scoredDrills = drills.filter(d => d.scoreType === 'hitMiss' || d.scoreType === 'points');
  if (scoredDrills.length < 3) return null;

  const allHistory = await dbGetAll('history');
  const histMap = {};
  allHistory.forEach(h => { histMap[h.id] = h; });

  const pcts = [];
  for (const d of scoredDrills) {
    const hist = histMap[d.drillId];
    if (!hist?.entries?.length) continue;
    const sessionEntries = hist.entries.filter(e => e.ts >= session.id);
    if (!sessionEntries.length) continue;
    const avg = sessionEntries.reduce((s, e) => s + e.v, 0) / sessionEntries.length;
    pcts.push(avg);
  }
  if (pcts.length < 3) return null;

  const avgPct = Math.round(pcts.reduce((s, v) => s + v, 0) / pcts.length);
  let delta = 0;
  if      (avgPct > 80) delta =  3;
  else if (avgPct > 72) delta =  1;
  else if (avgPct < 35) delta = -3;
  else if (avgPct < 45) delta = -1;
  if (delta === 0) return null;

  const suggested = Math.max(200, Math.min(1000, currentFargo + delta));
  return { currentFargo, suggested, avgPct, delta };
}

async function acceptFargoSuggestion(newFargo) {
  await saveProfile({ fargo: newFargo });
  document.getElementById('navFargo').textContent = 'FARGO ' + newFargo;
  const sbCur = document.getElementById('sbFargoCur');
  if (sbCur) sbCur.textContent = newFargo;
  const btn = document.querySelector('.ss-fargo-btn');
  if (btn) { btn.textContent = '✓ UPDATED'; btn.disabled = true; btn.style.background = 'var(--green)'; }
}

async function endSession() {
  if (!activeSession) return;
  if (!confirm('End this session?')) return;
  pauseTimer();
  activeSession.ended = Date.now();
  await dbPut('sessions', activeSession);
  const finished = { ...activeSession };
  activeSession = null;
  updateSessionTab();
  const fargoSuggestion = await computeFargoSuggestion(finished);
  showSessionSummary(finished, fargoSuggestion);
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

  // Tag filter chips
  const tagChips = document.getElementById('tagChips');
  if (tagChips) {
    const tags = ['CORNER POCKET','RAIL SHOTS','ENGLISH','BANKS','SHOTMAKING','PROGRESSIVE','ADVANCED','REFERENCE'];
    tagChips.innerHTML = tags.map(t =>
      `<button class="tag-chip" data-tag="${escHtml(t)}" onclick="toggleTagFilter('${escHtml(t)}')">${escHtml(t)}</button>`
    ).join('');
  }
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
          <span class="dc-trend" id="trend-${drill.id}"></span>
          <span class="dc-spark" id="spark-${drill.id}"></span>
          <button class="bk-btn" id="bk-${drill.id}" onclick="event.stopPropagation();toggleBookmark('${drill.id}',${chNum},'${escHtml(drill.name)}')" title="Bookmark">☆</button>
          <button class="q-add-btn" id="q-${drill.id}" data-drill-id="${drill.id}" onclick="event.stopPropagation();addToQueue('${drill.id}',${chNum},'${escHtml(drill.name)}')" title="Add to queue">+</button>
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
  const t = HM[id].h + HM[id].m;
  const pct = t > 0 ? Math.round(HM[id].h / t * 100) : null;
  if (pct !== null) {
    dbGet('history', id).then(hist => {
      hist = hist || { id, entries: [] };
      hist.entries.push({ v: pct, ts: Date.now() });
      if (hist.entries.length > 30) hist.entries = hist.entries.slice(-30);
      dbPut('history', hist);
      applyTrendBadge(id, hist.entries);
    });
  }
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
  PT_VALS[id] = Math.min(PT_VALS[id] + Number(val), Number(max));
  const el = document.getElementById('pt-'+id);
  if (el) el.textContent = PT_VALS[id];
  const pct = Math.round(PT_VALS[id] / Number(max) * 100);
  dbGet('history', id).then(hist => {
    hist = hist || { id, entries: [] };
    hist.entries.push({ v: pct, ts: Date.now() });
    if (hist.entries.length > 30) hist.entries = hist.entries.slice(-30);
    dbPut('history', hist);
    applyTrendBadge(id, hist.entries);
  });
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

  if (tab === 'progress') { refreshProgress(); if (typeof renderFargo === 'function') renderFargo(); }
  if (tab === 'settings') loadSettingsForm();
  if (tab === 'programs') renderPrograms();
  if (tab === 'cadence') {
    if (typeof renderCadenceStats === 'function') renderCadenceStats();
  }
  if (tab === 'coach') {
    if (typeof renderRecent === 'function') renderRecent();
    if (typeof initCoachTab === 'function') initCoachTab();
  }
  if (tab === 'rds') {
    if (typeof rdsInit === 'function') rdsInit();
  }
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
  const fargo = profile.fargo || 550;
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

  // Streak calculations
  const { current, best, thisWeek } = calcStreaks(sessions);
  document.getElementById('statStreak').textContent = current > 0 ? '🔥' + current : current;
  document.getElementById('statBest').textContent   = best;
  document.getElementById('statWeek').textContent   = thisWeek;

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
  renderCalendarHeatmap();
  renderWeakAreaReport();
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
    fargo: parseInt(document.getElementById('sf-fargo')?.value) || 550,
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

function calcStreaks(sessions) {
  if (!sessions.length) return { current: 0, best: 0, thisWeek: 0 };

  const msPerDay = 86400000;
  const todayNum = Math.floor(Date.now() / msPerDay);

  // Build set of unique day numbers from session dates
  const dayNums = new Set();
  for (const s of sessions) {
    if (!s.date) continue;
    const d = new Date(s.date);
    if (!isNaN(d)) dayNums.add(Math.floor(d.getTime() / msPerDay));
  }
  if (!dayNums.size) return { current: 0, best: 0, thisWeek: 0 };

  // This week: unique training days Sun–Sat of current week
  const dowOffset = new Date().getDay(); // 0=Sun
  const weekStartNum = todayNum - dowOffset;
  let thisWeek = 0;
  for (const dn of dayNums) {
    if (dn >= weekStartNum && dn <= todayNum) thisWeek++;
  }

  // Current streak: consecutive days ending today or yesterday
  let current = 0;
  let check = dayNums.has(todayNum) ? todayNum : todayNum - 1;
  while (dayNums.has(check)) { current++; check--; }

  // Best streak: longest consecutive run in history
  const sorted = [...dayNums].sort((a, b) => a - b);
  let best = 0, run = 0;
  for (let i = 0; i < sorted.length; i++) {
    run = (i === 0 || sorted[i] === sorted[i - 1] + 1) ? run + 1 : 1;
    if (run > best) best = run;
  }

  return { current, best, thisWeek };
}

async function exportCSV() {
  const [allScores, allHistory] = await Promise.all([dbGetAll('scores'), dbGetAll('history')]);

  const histMap = {};
  allHistory.forEach(h => { histMap[h.id] = h; });

  const rows = [['Drill Name','Chapter','Section','Tags','Times Logged','Last Score','Last Trained','Trend']];

  for (const ch of CHAPTERS) {
    for (const sec of ch.sections) {
      for (const drill of sec.drills) {
        if (!drill.scoring) continue;
        const sid     = drill.scoring.id || drill.id;
        const entries = histMap[sid]?.entries || [];
        const last    = entries[entries.length - 1];
        const prev    = entries[entries.length - 2];

        const lastScore = last ? last.v.toFixed(1) : '';
        const lastDate  = last ? new Date(last.ts).toLocaleDateString() : '';
        let trend = '';
        if (last && prev) {
          const d = last.v - prev.v;
          trend = d > 0 ? '↑' + d.toFixed(1) : d < 0 ? '↓' + Math.abs(d).toFixed(1) : '→';
        }

        rows.push([
          drill.name,
          ch.num,
          sec.title,
          (drill.tags || []).join('; '),
          entries.length,
          lastScore,
          lastDate,
          trend
        ]);
      }
    }
  }

  const csv = rows.map(row =>
    row.map(cell => {
      const s = String(cell);
      return (s.includes(',') || s.includes('"') || s.includes('\n'))
        ? `"${s.replace(/"/g, '""')}"` : s;
    }).join(',')
  ).join('\n');

  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url;
  a.download = `fgp-scores-${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

async function exportData() {
  const [scores, sessions, ratings, history, notes, bookmarks] = await Promise.all([
    dbGetAll('scores'), dbGetAll('sessions'), dbGetAll('ratings'),
    dbGetAll('history'), dbGetAll('notes'), dbGetAll('bookmarks')
  ]);
  const profile = await getProfile();
  const data = { exportDate: new Date().toISOString(), version: 2, profile, scores, sessions, ratings, history, notes, bookmarks };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `fgp-backup-${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

async function importData(input) {
  const file = input.files[0];
  if (!file) return;
  try {
    const text = await file.text();
    const data = JSON.parse(text);
    if (!confirm(`Restore backup from ${data.exportDate?.slice(0,10) || 'unknown date'}?\nThis merges over current data.`)) return;
    const stores = ['scores','sessions','ratings','history','notes','bookmarks'];
    for (const store of stores) {
      if (!Array.isArray(data[store])) continue;
      for (const item of data[store]) await dbPut(store, item);
    }
    if (data.profile) await saveProfile(data.profile);
    alert('Backup restored. Reload to see updated data.');
    location.reload();
  } catch(e) {
    alert('Failed to restore: ' + e.message);
  }
}

async function clearData() {
  if (!confirm('Clear ALL session data? This cannot be undone.')) return;
  await Promise.all([dbClear('scores'), dbClear('sessions'), dbClear('ratings'), dbClear('history'), dbClear('notes'), dbClear('bookmarks')]);
  activeSession = null;
  Object.keys(SCORES).forEach(k => delete SCORES[k]);
  Object.keys(HM).forEach(k => delete HM[k]);
  alert('All data cleared.');
}

async function forceUpdate() {
  if ('serviceWorker' in navigator) {
    const regs = await navigator.serviceWorker.getRegistrations();
    await Promise.all(regs.map(r => r.unregister()));
    // Delete all caches
    const keys = await caches.keys();
    await Promise.all(keys.map(k => caches.delete(k)));
  }
  window.location.reload(true);
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

// Returns a need boost (0-30) based on how relevant a chapter is for the player's Fargo level.
// Primary focus chapters get +25, secondary get +10, others get 0.
function getFargoChapterBoost(chNum, fargo) {
  let primary, secondary;
  if      (fargo < 500) { primary = [1,2];     secondary = [3]; }
  else if (fargo < 560) { primary = [1,2,3];   secondary = [4]; }
  else if (fargo < 620) { primary = [3,4,5];   secondary = [2,6]; }
  else if (fargo < 680) { primary = [4,5,6];   secondary = [3,7]; }
  else if (fargo < 730) { primary = [5,6,7];   secondary = [4,8]; }
  else                  { primary = [6,7,8,9]; secondary = [5]; }
  if (primary.includes(chNum))   return 25;
  if (secondary.includes(chNum)) return 10;
  return 0;
}

async function buildDailyPlan(minutes) {
  const allHistory = await dbGetAll('history');
  const histMap = {};
  allHistory.forEach(h => { histMap[h.id] = h; });

  const profile = await getProfile();
  const fargo = profile.fargo || 550;

  const now = Date.now();
  const candidates = [];

  for (const ch of CHAPTERS) {
    for (const sec of ch.sections) {
      for (const drill of sec.drills) {
        if (!drill.scoring) continue;
        const sid   = drill.scoring.id || drill.id;
        const isAB  = drill.scoring.type === 'hitMissAB' || drill.scoring.type === 'pointTrackerAB';
        let entries, lastVal, lastTs, daysSince;
        if (isAB) {
          const eA = histMap[sid + '-a']?.entries || [];
          const eB = histMap[sid + '-b']?.entries || [];
          const lA = eA[eA.length - 1];
          const lB = eB[eB.length - 1];
          lastVal = (lA && lB) ? Math.round((lA.v + lB.v) / 2)
                  : (lA?.v ?? lB?.v ?? null);
          lastTs  = Math.max(lA?.ts || 0, lB?.ts || 0);
          daysSince = lastTs ? (now - lastTs) / 86400000 : 999;
          entries = [...eA, ...eB].sort((a, b) => a.ts - b.ts);
        } else {
          const hist = histMap[sid];
          entries = hist?.entries || [];
          const last = entries[entries.length - 1];
          lastTs  = last?.ts || 0;
          lastVal = last?.v ?? null;
          daysSince = lastTs ? (now - lastTs) / 86400000 : 999;
        }

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

        need += getFargoChapterBoost(ch.num, fargo);

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

  return { drills: plan.sort((a, b) => a.chNum - b.chNum), totalMin: used, fargo };
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
      <div class="sh-desc">Drills selected based on your score history, recency, and improvement trends — weighted for Fargo ${result.fargo} focus areas. Weakest areas prioritized first.</div>
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
  const allHistory = await dbGetAll('history');
  const histMap = {};
  allHistory.forEach(h => { histMap[h.id] = h; });

  for (const d of drills) {
    const el = document.getElementById('spark-' + d.id);
    if (!el) continue;
    const sid   = d.scoring?.id || d.id;
    const isAB  = d.scoring?.type === 'hitMissAB' || d.scoring?.type === 'pointTrackerAB';
    const entries = isAB
      ? [...(histMap[sid+'-a']?.entries||[]), ...(histMap[sid+'-b']?.entries||[])].sort((a,b)=>a.ts-b.ts)
      : (histMap[sid]?.entries || []);
    if (entries.length < 2) continue;
    el.innerHTML = makeSpark(entries);
    applyTrendBadge(d.id, entries);
  }
}

async function renderCalendarHeatmap() {
  const container = document.getElementById('calHeatmap');
  if (!container) return;

  const sessions = await dbGetAll('sessions');
  const dayMap = {};
  for (const sess of sessions) {
    const d = new Date(sess.id);
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    dayMap[key] = (dayMap[key] || 0) + (sess.drills?.length || 1);
  }

  const today = new Date(); today.setHours(0,0,0,0);
  const WEEKS = 16;
  // Start on the Monday before 16 weeks ago
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - WEEKS * 7 + 1);
  const dow = startDate.getDay();
  startDate.setDate(startDate.getDate() - (dow === 0 ? 6 : dow - 1));

  const weeks = [];
  const cur = new Date(startDate);
  for (let w = 0; w < WEEKS; w++) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      const key = `${cur.getFullYear()}-${String(cur.getMonth()+1).padStart(2,'0')}-${String(cur.getDate()).padStart(2,'0')}`;
      week.push({ key, count: dayMap[key] || 0, future: cur > today });
      cur.setDate(cur.getDate() + 1);
    }
    weeks.push(week);
  }

  function col(count, future) {
    if (future || count === 0) return 'var(--border)';
    if (count <= 2) return 'rgba(0,191,255,.25)';
    if (count <= 5) return 'rgba(0,191,255,.6)';
    return 'var(--cyan)';
  }

  const DAY_LBLS = ['M','T','W','T','F','S','S'];
  container.innerHTML = `
    <div class="cal-wrap">
      <div class="cal-day-col">${DAY_LBLS.map(l=>`<div class="cal-lbl">${l}</div>`).join('')}</div>
      <div class="cal-weeks-col">
        ${weeks.map(week=>`<div class="cal-week-col">${week.map(c=>`<div class="cal-cell" style="background:${col(c.count,c.future)}" title="${c.key}${c.count?' — '+c.count+' drills':''}"></div>`).join('')}</div>`).join('')}
      </div>
    </div>
    <div class="cal-legend">
      <span class="cal-leg-lbl">LESS</span>
      <div class="cal-cell" style="background:var(--border)"></div>
      <div class="cal-cell" style="background:rgba(0,191,255,.25)"></div>
      <div class="cal-cell" style="background:rgba(0,191,255,.6)"></div>
      <div class="cal-cell" style="background:var(--cyan)"></div>
      <span class="cal-leg-lbl">MORE</span>
    </div>`;
}

async function renderWeakAreaReport() {
  const container = document.getElementById('weakAreaList');
  if (!container) return;

  const allHistory = await dbGetAll('history');
  const histMap = {};
  allHistory.forEach(h => { histMap[h.id] = h; });

  const scored = [];
  for (const ch of CHAPTERS) {
    for (const sec of ch.sections) {
      for (const drill of sec.drills) {
        if (!drill.scoring) continue;
        const sid  = drill.scoring.id || drill.id;
        const isAB = drill.scoring.type === 'hitMissAB' || drill.scoring.type === 'pointTrackerAB';
        const entries = isAB
          ? [...(histMap[sid+'-a']?.entries||[]), ...(histMap[sid+'-b']?.entries||[])].sort((a,b)=>a.ts-b.ts)
          : (histMap[sid]?.entries || []);
        if (entries.length < 3) continue;
        const recent = entries.slice(-5);
        const avg = Math.round(recent.reduce((s, e) => s + e.v, 0) / recent.length);
        scored.push({ drill, chNum: ch.num, chTitle: ch.title, avg, entries });
      }
    }
  }

  const weak = scored.filter(s => s.avg < 70).sort((a, b) => a.avg - b.avg).slice(0, 8);

  if (weak.length === 0) {
    container.innerHTML = '<div style="text-align:center;padding:16px;font-size:11px;color:var(--dim);letter-spacing:1px">KEEP TRAINING TO BUILD HISTORY</div>';
    return;
  }

  container.innerHTML = weak.map(item => `
    <div class="wa-item" onclick="navigateToDrill(${item.chNum},'${item.drill.id}')">
      <div class="wa-left">
        <div class="wa-ch">CH.${String(item.chNum).padStart(2,'0')} // ${escHtml(item.chTitle.toUpperCase())}</div>
        <div class="wa-name">${escHtml(item.drill.name)}</div>
      </div>
      <div class="wa-right">
        <div class="wa-score" style="color:${item.avg<40?'var(--red)':item.avg<55?'var(--gold)':'var(--text)'}">${item.avg}%</div>
        ${makeSpark(item.entries)}
      </div>
    </div>`).join('');
}

function applyTrendBadge(id, entries) {
  const el = document.getElementById('trend-' + id);
  if (!el || !entries || entries.length < 2) return;
  const prev = entries[entries.length - 2].v;
  const last = entries[entries.length - 1].v;
  const delta = last - prev;
  if (delta > 0) {
    const d = Number.isInteger(delta) ? delta : delta.toFixed(1);
    el.className = 'dc-trend up';
    el.textContent = '↑' + d;
  } else if (delta < 0) {
    const d = Number.isInteger(delta) ? Math.abs(delta) : Math.abs(delta).toFixed(1);
    el.className = 'dc-trend down';
    el.textContent = '↓' + d;
  } else {
    el.className = 'dc-trend flat';
    el.textContent = '→';
  }
}

async function updateTrendBadge(id) {
  const hist = await dbGet('history', id);
  if (!hist || !hist.entries) return;
  applyTrendBadge(id, hist.entries);
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
function showSessionSummary(session, fargoSuggestion) {
  const old = document.getElementById('session-summary');
  if (old) old.remove();

  const durationMs  = (session.ended || Date.now()) - session.id;
  const mins        = Math.max(1, Math.round(durationMs / 60000));
  const drillCount  = session.drills?.length || 0;
  const progTotal   = session.programDrills?.length || 0;
  const pct         = progTotal ? Math.round(drillCount / progTotal * 100) : null;

  const fargoHtml = fargoSuggestion ? `
    <div class="ss-fargo">
      <div class="ss-fargo-title">FARGO ESTIMATE</div>
      <div class="ss-fargo-detail">Avg drill score: ${fargoSuggestion.avgPct}%</div>
      <div class="ss-fargo-change">${fargoSuggestion.currentFargo} → ${fargoSuggestion.suggested} (${fargoSuggestion.delta > 0 ? '+' : ''}${fargoSuggestion.delta})</div>
      <button class="ss-fargo-btn" onclick="acceptFargoSuggestion(${fargoSuggestion.suggested})">ACCEPT UPDATE</button>
    </div>` : '';

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
      ${fargoHtml}
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
      .then(reg => {
        console.log('SW registered:', reg.scope);
        // When a new SW takes control, reload once to get fresh assets
        reg.addEventListener('updatefound', () => {
          const newSW = reg.installing;
          newSW && newSW.addEventListener('statechange', () => {
            if (newSW.state === 'activated' && navigator.serviceWorker.controller) {
              window.location.reload();
            }
          });
        });
      })
      .catch(err => console.warn('SW registration failed:', err));
    // Also reload when controller changes (skipWaiting path)
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      window.location.reload();
    });
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
   SESSION TIMER
────────────────────────────────────────── */
let timerSec = 0, timerRunning = false, _timerInterval = null;

function toggleTimer() {
  timerRunning ? pauseTimer() : startTimer();
}

function startTimer() {
  if (timerRunning) return;
  timerRunning = true;
  _timerInterval = setInterval(() => { timerSec++; updateTimerDisplay(); }, 1000);
  document.querySelectorAll('.timer-widget').forEach(w => w.classList.add('running'));
}

function pauseTimer() {
  timerRunning = false;
  clearInterval(_timerInterval);
  document.querySelectorAll('.timer-widget').forEach(w => w.classList.remove('running'));
}

function resetTimer() {
  pauseTimer();
  timerSec = 0;
  updateTimerDisplay();
}

function updateTimerDisplay() {
  const m = String(Math.floor(timerSec / 60)).padStart(2, '0');
  const s = String(timerSec % 60).padStart(2, '0');
  document.querySelectorAll('.timer-display').forEach(el => el.textContent = m + ':' + s);
}

/* ──────────────────────────────────────────
   DRILL SEARCH / TAG FILTER
────────────────────────────────────────── */
let _activeSearchTag = null, _activeSearchQuery = '';

function onDrillSearch(query) {
  _activeSearchQuery = query.trim().toLowerCase();
  runDrillSearch();
}

function toggleTagFilter(tag) {
  _activeSearchTag = _activeSearchTag === tag ? null : tag;
  document.querySelectorAll('.tag-chip').forEach(c =>
    c.classList.toggle('active', c.dataset.tag === _activeSearchTag));
  runDrillSearch();
}

function runDrillSearch() {
  const results    = document.getElementById('search-results');
  const chGrid     = document.getElementById('chapterGrid');
  const secHdr     = document.querySelector('#chapter-list-view > .sec-hdr');
  const bkPanel    = document.getElementById('bookmarks-panel');
  const dpWidget   = document.getElementById('daily-plan-widget');
  if (!results) return;

  const hasFilter = _activeSearchQuery || _activeSearchTag;

  if (!hasFilter) {
    results.style.display = 'none';
    if (chGrid)   chGrid.style.display = '';
    if (secHdr)   secHdr.style.display = '';
    if (bkPanel)  bkPanel.style.display = '';
    if (dpWidget) dpWidget.style.display = '';
    return;
  }

  if (chGrid)   chGrid.style.display = 'none';
  if (secHdr)   secHdr.style.display = 'none';
  if (bkPanel)  bkPanel.style.display = 'none';
  if (dpWidget) dpWidget.style.display = 'none';
  results.style.display = 'block';

  const all = [];
  CHAPTERS.forEach(ch => ch.sections.forEach((sec, secIdx) =>
    sec.drills.forEach(d => all.push({ drill: d, chNum: ch.num, secIdx, secTitle: sec.title }))));

  const filtered = all.filter(({ drill }) => {
    const matchTag   = !_activeSearchTag || (drill.tags || []).includes(_activeSearchTag);
    const matchQuery = !_activeSearchQuery ||
      drill.name.toLowerCase().includes(_activeSearchQuery) ||
      (drill.tags || []).some(t => t.toLowerCase().includes(_activeSearchQuery));
    return matchTag && matchQuery;
  });

  if (!filtered.length) {
    results.innerHTML = `<div class="search-empty">NO DRILLS FOUND</div>`;
    return;
  }

  results.innerHTML = `
    <div class="search-count">${filtered.length} DRILL${filtered.length !== 1 ? 'S' : ''} FOUND</div>
    ${filtered.map(({ drill, chNum, secIdx, secTitle }) => `
      <div class="search-result-item" onclick="clearDrillSearch();openSection(${chNum},${secIdx});setTimeout(()=>{const b=document.getElementById('body-${drill.id}');if(b&&!b.classList.contains('open'))toggleDrill('${drill.id}');},250)">
        <div class="sri-name">${escHtml(drill.name)}</div>
        <div class="sri-meta">CH.${String(chNum).padStart(2,'0')} · ${escHtml(secTitle)}</div>
        <div class="sri-tags">${(drill.tags||[]).map(t=>`<span class="sri-tag">${escHtml(t)}</span>`).join('')}</div>
      </div>`).join('')}`;
}

function clearDrillSearch() {
  _activeSearchQuery = '';
  _activeSearchTag = null;
  const input = document.getElementById('drillSearchInput');
  if (input) input.value = '';
  document.querySelectorAll('.tag-chip').forEach(c => c.classList.remove('active'));
  runDrillSearch();
}

/* ──────────────────────────────────────────
   PRACTICE QUEUE
────────────────────────────────────────── */
let practiceQueue = [];
let _queueCurrentIdx = 0;

function addToQueue(drillId, chNum, name) {
  const existing = practiceQueue.findIndex(q => q.drillId === drillId);
  if (existing >= 0) {
    practiceQueue.splice(existing, 1);
  } else {
    const ch = CHAPTERS.find(c => c.num === chNum);
    let secIdx = 0;
    if (ch) {
      for (let i = 0; i < ch.sections.length; i++) {
        if (ch.sections[i].drills.find(d => d.id === drillId)) { secIdx = i; break; }
      }
    }
    practiceQueue.push({ drillId, chNum, secIdx, name });
  }
  _syncQueueButtons();
  renderQueuePanel();
  _updateQueueBadge();
}

function removeFromQueue(drillId) {
  practiceQueue = practiceQueue.filter(q => q.drillId !== drillId);
  _syncQueueButtons();
  renderQueuePanel();
  _updateQueueBadge();
}

function clearQueue() {
  practiceQueue = [];
  _queueCurrentIdx = 0;
  _syncQueueButtons();
  renderQueuePanel();
  _updateQueueBadge();
}

function startQueue() {
  if (!practiceQueue.length) return;
  _queueCurrentIdx = 0;
  switchTab('train');
  _goToQueueDrill(0);
}

function _goToQueueDrill(idx) {
  if (idx < 0 || idx >= practiceQueue.length) return;
  _queueCurrentIdx = idx;
  const q = practiceQueue[idx];
  openSection(q.chNum, q.secIdx);
  setTimeout(() => {
    const card = document.getElementById('card-' + q.drillId);
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', block: 'start' });
      const body = document.getElementById('body-' + q.drillId);
      if (body && !body.classList.contains('open')) toggleDrill(q.drillId);
    }
  }, 200);
}

function _syncQueueButtons() {
  const inQueue = new Set(practiceQueue.map(q => q.drillId));
  document.querySelectorAll('.q-add-btn').forEach(btn => {
    const on = inQueue.has(btn.dataset.drillId);
    btn.classList.toggle('q-on', on);
    btn.title = on ? 'Remove from queue' : 'Add to queue';
  });
}

function _updateQueueBadge() {
  const badge = document.getElementById('queueBadge');
  if (!badge) return;
  if (practiceQueue.length > 0) {
    badge.textContent = practiceQueue.length;
    badge.classList.add('show');
  } else {
    badge.classList.remove('show');
  }
}

function renderQueuePanel() {
  const container = document.getElementById('queue-panel-container');
  if (!container) return;

  if (!practiceQueue.length) {
    container.innerHTML = `
      <div class="queue-panel-empty">
        <div style="font-family:'Courier New',monospace;font-size:8px;letter-spacing:3px;color:var(--dim2);margin-bottom:8px">PRACTICE QUEUE — EMPTY</div>
        <div style="font-size:13px;color:var(--dim2);line-height:1.7">Tap <strong style="color:var(--green)">+</strong> on any drill card to add it to your queue, then start your custom session here.</div>
      </div>`;
    return;
  }

  container.innerHTML = `
    <div class="queue-panel">
      <div class="queue-panel-hdr">
        <div class="queue-panel-title">PRACTICE QUEUE (${practiceQueue.length})</div>
        <div class="queue-panel-actions">
          <button class="queue-start-btn" onclick="startQueue()">▶ START</button>
          <button class="queue-clear-btn" onclick="clearQueue()">CLEAR</button>
        </div>
      </div>
      ${practiceQueue.map((q, i) => `
        <div class="queue-item${i === _queueCurrentIdx ? ' q-current' : ''}"
             onclick="switchTab('train');_goToQueueDrill(${i})">
          <span class="qi-num">${String(i+1).padStart(2,'0')}</span>
          <span class="qi-name">${escHtml(q.name)}</span>
          <span class="qi-ch">CH.${String(q.chNum).padStart(2,'0')}</span>
          <button class="qi-remove" onclick="event.stopPropagation();removeFromQueue('${q.drillId}')" title="Remove">✕</button>
        </div>`).join('')}
    </div>`;
}

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
    const fargo  = profile.fargo || 550;
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
