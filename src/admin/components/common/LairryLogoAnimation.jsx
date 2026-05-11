import { useEffect, useRef, useState, useCallback } from "react";

function getColor(char, index) {
  if (char === ".") return "#FF6B6B";
  if (char === "R") return index === 5 ? "#E8453C" : "#F5B800";
  return { L: "#F5B800", A: "#E8453C", I: "#4A90D9", Y: "#2ECC71" }[char] || "#fff";
}

const CHARS   = ["L", ".", "A", "I", ".", "R", "R", "Y"];
const FINAL_X = [49, 67, 80, 96, 112, 126, 147, 166];
const SPAWN_X  = 310;
const GROUND_Y = 33;
const WALK_MS  = 5000;   // slow & struggling
const LIMB_CLR = "#1a1a1a";

// ─── SIDE-VIEW CHARACTER ──────────────────────────────────────────────────────
// stepPhase 0→1 is one full walk cycle
// At stepPhase 0.0→0.5: right foot forward  → facing ~70% front (scaleX near 1, slight squeeze)
// At stepPhase 0.5→1.0: left foot forward   → facing ~70% back  (scaleX flips to show back)
function SideChar({ char, charIndex, cx, phase, morphPct, stepPhase, restPose }) {
  const isDot   = char === ".";
  const color   = getColor(char, charIndex);
  const isWalk  = phase === "walking";
  const isSit   = phase === "waiting" && restPose === "sitting";
  const alive   = phase !== "hidden" && phase !== "done";
  const growScale = alive ? (1 + (1 - morphPct) * 0.28) : 1;
  const fontSize  = 25 * growScale;
  const limbOp  = Math.max(0, 1 - morphPct * 2.5);
  const eyeOp   = Math.max(0, 1 - morphPct * 2.0);
  const glowId  = `glow-${charIndex}`;
  const glowBlur = alive ? (3 + (1 - morphPct) * 4) : 0;

  // ── Perspective skew based on step phase ──
  // stepPhase 0→0.5: right foot leads → body faces left (toward logo) → front visible
  // stepPhase 0.5→1: left foot leads  → body turns away slightly → back visible
  // We simulate with scaleX on the letter: front = 1.0, side = 0.55, back = -0.7
  const cycle = stepPhase * 2 * Math.PI;
  // perspective: 1 = full front, -1 = full back. oscillates with walk.
  const perspective = isWalk ? Math.cos(cycle) : 1; // 1=front,-1=back
  // scaleX: front shows letter normally, turning away squishes then flips
  const letterScaleX = isWalk ? (perspective >= 0 ? 0.55 + perspective * 0.45 : 0.55 + perspective * 0.3) : 1;
  // Eye visibility: eyes hidden when we see the back
  const eyeVisible = isWalk ? Math.max(0, perspective) : 1;

  // ── Leg swing (side view — one leg in front, one behind) ──
  const legSwing = isWalk ? Math.sin(cycle) * 18 : 0; // degrees
  // Front leg angle (toward logo = negative x direction)
  const frontLegAngle = -legSwing;
  const backLegAngle  =  legSwing;

  // Leg endpoints from hip
  const hipY = GROUND_Y - 10;
  const legLen = 14;
  const frontLegX2 = cx + Math.sin((frontLegAngle * Math.PI) / 180) * legLen;
  const frontLegY2 = hipY + Math.cos((frontLegAngle * Math.PI) / 180) * legLen * 0.72;
  const backLegX2  = cx + Math.sin((backLegAngle  * Math.PI) / 180) * legLen;
const backLegY2  = hipY + Math.cos((backLegAngle  * Math.PI) / 180) * legLen * 0.72;

  // Foot horizontal extension (points left = toward logo)
  const footLen = 7;
  const frontFootX = frontLegX2 - footLen; // always points toward logo (left)
  const backFootX  = backLegX2  - footLen;

  // ── Arm swing (opposite to legs) ──
  const armSwing   = isWalk ? -Math.sin(cycle) * 16 : 0;
  const armLen     = 7;
  const shoulderY  = GROUND_Y - 22;
  const frontArmX2 = cx + Math.sin((armSwing * Math.PI) / 180) * armLen;
  const frontArmY2 = shoulderY + armLen * 0.6;
  // back arm is just slightly different
  const backArmX2  = cx - Math.sin((armSwing * Math.PI) / 180) * armLen * 0.6;
  const backArmY2  = shoulderY + armLen * 0.5;

  if (isDot) {
    // Dots: tiny side-view pill that "rolls" in
    const r = 4 * growScale;
    return (
      <g>
        <defs>
          <filter id={glowId} x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation={glowBlur} result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <circle cx={cx} cy={GROUND_Y - 8} r={r} fill={color} filter={`url(#${glowId})`} />
        <g opacity={eyeOp * eyeVisible}>
          <circle cx={cx - 1.2} cy={GROUND_Y - 8.5} r="0.85" fill="white" />
          <circle cx={cx + 1.2} cy={GROUND_Y - 8.5} r="0.85" fill="white" />
          <circle cx={cx - 1.2} cy={GROUND_Y - 8.5} r="0.45" fill="#111" />
          <circle cx={cx + 1.2} cy={GROUND_Y - 8.5} r="0.45" fill="#111" />
        </g>
      </g>
    );
  }

  return (
    <g>
      <defs>
        <filter id={glowId} x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation={glowBlur} result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Back arm (drawn first so it's behind letter) */}
      {isWalk && (
        <g opacity={Math.max(0.2, limbOp * 0.6)}>
          <line x1={cx} y1={shoulderY} x2={backArmX2} y2={backArmY2}
            stroke={LIMB_CLR} strokeWidth="1.4" strokeLinecap="round" strokeDasharray="0"/>
        </g>
      )}

      {/* Back leg (drawn behind letter) */}
      {isWalk && (
        <g opacity={Math.max(0.2, limbOp * 0.55)}>
          <line x1={cx} y1={hipY} x2={backLegX2}  y2={backLegY2}
            stroke={LIMB_CLR} strokeWidth="1.5" strokeLinecap="round" />
          <line x1={backLegX2} y1={backLegY2} x2={backFootX} y2={backLegY2}
            stroke={LIMB_CLR} strokeWidth="1.5" strokeLinecap="round" />
        </g>
      )}

{/* Arrived — feet planted on ground line */}
{(phase === "waiting" || phase === "morphing") && (
  <g opacity={limbOp}>
    <line x1={cx - 4} y1={GROUND_Y - 10} x2={cx - 4} y2={GROUND_Y} stroke={LIMB_CLR} strokeWidth="2.5" strokeLinecap="round" />
    <line x1={cx + 4} y1={GROUND_Y - 10} x2={cx + 4} y2={GROUND_Y} stroke={LIMB_CLR} strokeWidth="2.5" strokeLinecap="round" />
    {/* Feet — thick horizontal bars sitting ON the cyan line */}
    <line x1={cx - 8} y1={GROUND_Y} x2={cx - 1} y2={GROUND_Y} stroke={LIMB_CLR} strokeWidth="3" strokeLinecap="round" />
    <line x1={cx + 1} y1={GROUND_Y} x2={cx + 8} y2={GROUND_Y} stroke={LIMB_CLR} strokeWidth="3" strokeLinecap="round" />
  </g>
)}

      {/* Morphing — standing */}
      {phase === "morphing" && (
        <g opacity={limbOp}>
          <line x1={cx - 3} y1={GROUND_Y - 10} x2={cx - 4} y2={GROUND_Y} stroke={LIMB_CLR} strokeWidth="1.8" strokeLinecap="round" />
          <line x1={cx - 4} y1={GROUND_Y}       x2={cx - 8} y2={GROUND_Y} stroke={LIMB_CLR} strokeWidth="1.8" strokeLinecap="round" />
          <line x1={cx + 3} y1={GROUND_Y - 10} x2={cx + 4} y2={GROUND_Y} stroke={LIMB_CLR} strokeWidth="1.8" strokeLinecap="round" />
          <line x1={cx + 4} y1={GROUND_Y}       x2={cx + 8} y2={GROUND_Y} stroke={LIMB_CLR} strokeWidth="1.8" strokeLinecap="round" />
        </g>
      )}

      {/* ── Letter — perspective-squeezed ── */}
      <g transform={`translate(${cx}, 0) scale(${letterScaleX}, 1) translate(${-cx}, 0)`}
         style={{ transition: isWalk ? "none" : "transform 0.4s ease" }}>
        <text
          x={cx}
          y={GROUND_Y - 2}
          textAnchor="middle"
          fontSize={fontSize}
          fontWeight="900"
          fontFamily="'Courier New', monospace"
          fill={color}
          filter={`url(#${glowId})`}
        >
          {char}
        </text>

        {/* Eyes inside letter — fade when seeing back */}
        <g opacity={eyeOp * eyeVisible} style={{ transition: "opacity 0.1s" }}>
          <ellipse cx={cx - 3.2} cy={GROUND_Y - 20} rx="2.3" ry="2.3" fill="white" fillOpacity="0.95" />
          <ellipse cx={cx + 3.2} cy={GROUND_Y - 20} rx="2.3" ry="2.3" fill="white" fillOpacity="0.95" />
          {/* pupils always look left (toward logo) */}
          <circle  cx={cx - 3.2 - 1.0} cy={GROUND_Y - 20} r="1.2" fill="#111" />
          <circle  cx={cx + 3.2 - 1.0} cy={GROUND_Y - 20} r="1.2" fill="#111" />
          <circle  cx={cx - 3.2 - 0.3} cy={GROUND_Y - 20.7} r="0.45" fill="white" />
          <circle  cx={cx + 3.2 - 0.3} cy={GROUND_Y - 20.7} r="0.45" fill="white" />
        </g>

        {/* Waiting eyes look right (toward incoming) */}
        {(phase === "waiting" || phase === "morphing") && (
          <g opacity={eyeOp}>
            <ellipse cx={cx - 3.2} cy={GROUND_Y - 20} rx="2.3" ry="2.3" fill="white" fillOpacity="0.95" />
            <ellipse cx={cx + 3.2} cy={GROUND_Y - 20} rx="2.3" ry="2.3" fill="white" fillOpacity="0.95" />
            <circle  cx={cx - 3.2 + 1.0} cy={GROUND_Y - 20} r="1.2" fill="#111" />
            <circle  cx={cx + 3.2 + 1.0} cy={GROUND_Y - 20} r="1.2" fill="#111" />
            <circle  cx={cx - 3.2 + 1.7} cy={GROUND_Y - 20.7} r="0.45" fill="white" />
            <circle  cx={cx + 3.2 + 1.7} cy={GROUND_Y - 20.7} r="0.45" fill="white" />
          </g>
        )}
      </g>

      {/* Front arm (drawn in front of letter) */}
      {isWalk && (
        <g opacity={limbOp}>
          <line x1={cx} y1={shoulderY} x2={frontArmX2} y2={frontArmY2}
            stroke={LIMB_CLR} strokeWidth="1.6" strokeLinecap="round" />
        </g>
      )}

      {/* Front leg (drawn in front) */}
      {isWalk && (
        <g opacity={limbOp}>
          <line x1={cx} y1={hipY} x2={frontLegX2} y2={frontLegY2}
            stroke={LIMB_CLR} strokeWidth="3" strokeLinecap="round" />
          <line x1={frontLegX2} y1={frontLegY2} x2={frontFootX} y2={frontLegY2}
            stroke={LIMB_CLR} strokeWidth="3" strokeLinecap="round" />
        </g>
      )}

      {/* Sitting arms */}
      {isSit && (
        <g opacity={limbOp}>
          <line x1={cx} y1={GROUND_Y - 18} x2={cx - 9} y2={GROUND_Y - 9} stroke={LIMB_CLR} strokeWidth="1.6" strokeLinecap="round" />
          <line x1={cx} y1={GROUND_Y - 18} x2={cx + 9} y2={GROUND_Y - 9} stroke={LIMB_CLR} strokeWidth="1.6" strokeLinecap="round" />
        </g>
      )}

      {/* Standing arms */}
      {phase === "waiting" && !isSit && (
        <g opacity={limbOp}>
          <line x1={cx} y1={GROUND_Y - 18} x2={cx - 6} y2={GROUND_Y - 13} stroke={LIMB_CLR} strokeWidth="1.6" strokeLinecap="round" />
          <line x1={cx} y1={GROUND_Y - 18} x2={cx + 6} y2={GROUND_Y - 13} stroke={LIMB_CLR} strokeWidth="1.6" strokeLinecap="round" />
        </g>
      )}

      {/* Morphing arms */}
      {phase === "morphing" && (
        <g opacity={limbOp}>
          <line x1={cx} y1={GROUND_Y - 18} x2={cx - 6} y2={GROUND_Y - 13} stroke={LIMB_CLR} strokeWidth="1.6" strokeLinecap="round" />
          <line x1={cx} y1={GROUND_Y - 18} x2={cx + 6} y2={GROUND_Y - 13} stroke={LIMB_CLR} strokeWidth="1.6" strokeLinecap="round" />
        </g>
      )}
    </g>
  );
}

// ─── MAIN ────────────────────────────────────────────────────────────────────
export default function LairryLogoAnimation() {
const initState = () =>
  CHARS.map((ch, i) => ({ 
    phase: "hidden", 
    x: ch === "." ? FINAL_X[i] : SPAWN_X, 
    morphPct: 0, 
    stepPhase: 0, 
    restPose: "standing" 
  }));

  const [chars,       setChars]       = useState(initState);
  const [logoVisible, setLogoVisible] = useState(true);
  const [showClean,   setShowClean]   = useState(true);
  const timersRef = useRef([]);
  const rafRef    = useRef({});

  const after    = (fn, ms) => { const id = setTimeout(fn, ms); timersRef.current.push(id); };
  const clearAll = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    Object.values(rafRef.current).forEach(cancelAnimationFrame);
    rafRef.current = {};
  };

  const patchChar = useCallback((i, patch) =>
  setChars(p => {
    const n = [...p];
    const x = patch.x;
    if (x !== undefined && (isNaN(x) || !isFinite(x))) return p; // reject bad values
    n[i] = { ...n[i], ...patch };
    return n;
  }), []);

  const startWalkCycle = useCallback((i) => {
    let start = null;
    const PERIOD = 900; // ms per step cycle — slower = struggling feel
    function tick(ts) {
      if (!start) start = ts;
      const stepPhase = ((ts - start) % PERIOD) / PERIOD;
      patchChar(i, { stepPhase });
      rafRef.current[i] = requestAnimationFrame(tick);
    }
    rafRef.current[i] = requestAnimationFrame(tick);
  }, [patchChar]);

  const stopWalkCycle = useCallback((i) => {
    if (rafRef.current[i]) { cancelAnimationFrame(rafRef.current[i]); delete rafRef.current[i]; }
  }, []);

  const runAnim = useCallback(() => {
    clearAll();
    setShowClean(false);
    setLogoVisible(false);
    setChars(initState());

    after(() => setLogoVisible(true), 300);

    let cursor = 900;
    CHARS.forEach((ch, i) => {
      const isDot    = ch === ".";

      // Dots: completely hidden during animation, skip walk-in
      if (isDot) return;

      const spawnAt  = cursor;
      const arriveAt = spawnAt + WALK_MS;
      cursor = arriveAt + 300;

      after(() => {
        patchChar(i, { phase: "walking", x: SPAWN_X, morphPct: 0, stepPhase: 0 });
        startWalkCycle(i);

        // X movement — slow ease with tiny stutter (struggling feel)
        const dist  = SPAWN_X - FINAL_X[i];
        const steps = 80;
        for (let s = 1; s <= steps; s++) {
          const frac = s / steps;
          // Slightly uneven ease — struggle feel
          const jitter = Math.sin(frac * Math.PI * 8) * 0.012;
          const ease   = Math.min(1, 1 - Math.pow(1 - frac + jitter, 2.5));
          after(() => patchChar(i, { x: SPAWN_X - dist * ease }), frac * WALK_MS);
        }
      }, spawnAt);

      const restPose = (i % 4 === 0) ? "sitting" : "standing";
      after(() => {
        stopWalkCycle(i);
        patchChar(i, { phase: "waiting", x: FINAL_X[i], stepPhase: 0, restPose });
      }, arriveAt);

      if (i === CHARS.length - 1) {
        const morphStart = arriveAt + 800;
        const morphDur   = 750;
        after(() => setChars(p => p.map(c => ({ ...c, phase: "morphing" }))), morphStart);
        for (let s = 1; s <= 35; s++) {
          const pct = s / 35;
          after(() => setChars(p => p.map(c => ({ ...c, morphPct: pct }))), morphStart + morphDur * pct);
        }
        after(() => {
          setChars(p => p.map(c => ({ ...c, phase: "done", morphPct: 1 })));
          setShowClean(true);
        }, morphStart + morphDur + 100);
      }
    });
  }, []); // eslint-disable-line

  useEffect(() => {
    if (!showClean) return;
    const id = setTimeout(runAnim, 6000);
    return () => clearTimeout(id);
  }, [showClean, runAnim]);

useEffect(() => {
  const id = setTimeout(runAnim, 2500);
  return () => clearTimeout(id);
}, []);// eslint-disable-line

  return (
    <>
      <style>{`
        @keyframes logoPop {
          0%  {opacity:0;transform:scale(0.4) rotate(-10deg)}
          65% {opacity:1;transform:scale(1.15) rotate(3deg)}
          100%{opacity:1;transform:scale(1) rotate(0deg)}
        }
        @keyframes cleanFade {
          from{opacity:0;filter:blur(3px);transform:translateY(5px)}
          to  {opacity:1;filter:blur(0);  transform:translateY(0)}
        }
        @keyframes dotPop {
          0%  {opacity:0;transform:scale(0)}
          70% {transform:scale(1.4)}
          100%{opacity:1;transform:scale(1)}
        }
          @keyframes lineToText {
  0%   { opacity:0; transform: scaleX(0.3); letter-spacing: 0.5em; filter: blur(2px); }
  60%  { opacity:1; filter: blur(0); }
  100% { opacity:1; transform: scaleX(1); letter-spacing: 0.15em; }
}
      `}</style>

<div className="inline-flex items-center gap-2 sm:gap-2.5 py-2 px-2 sm:px-3 rounded-xl
  bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700/50
  hover:border-cyan-500/30 transition-all duration-200 flex-shrink-0"
  style={{ height: "44px", overflow: "hidden" }}>

        <div style={{
          flexShrink: 0,
          opacity: logoVisible ? 1 : 0,
          animation: logoVisible ? "logoPop 0.55s cubic-bezier(0.34,1.56,0.64,1) forwards" : "none",
        }}>
          <img src="/images/logo.png" alt="LAIRRY Logo"
            className="h-6 w-6 lg:h-8 lg:w-8 object-contain block" />
        </div>

        <div className="hidden sm:flex" style={{ position: "relative", width: "152px", overflow: "hidden", flexShrink: 0 }}>
          {!showClean && (
            <svg width="152" height="60" viewBox="34 -6 152 54" overflow="visible" style={{ display: "block" }}>
              {chars.map((cs, i) => {
                if (cs.phase === "hidden") return null;
                // Dots hidden during animation entirely
                if (CHARS[i] === "." && cs.phase !== "done") return null;
                return (
                 <g key={i} transform={`translate(${isNaN(cs.x) || cs.x == null ? 0 : cs.x - FINAL_X[i]}, 0)`}>
                    <SideChar
                      char={CHARS[i]}
                      charIndex={i}
                      cx={FINAL_X[i]}
                      phase={cs.phase}
                      morphPct={cs.morphPct}
                      stepPhase={cs.stepPhase}
                      restPose={cs.restPose}
                    />
                  </g>
                );
              })}
              {/* Ground line */}
<line
  x1={34} y1={35}
  x2={186} y2={35}
  stroke="#22d3ee"
  strokeWidth="1.5"
  strokeOpacity="0.7"
/>
            </svg>
          )}

          {showClean && (
            <div style={{ animation: "cleanFade 0.45s ease forwards" }}>
              <div className="text-base lg:text-lg font-bold leading-tight whitespace-nowrap"
                style={{ fontFamily: "'Courier New', monospace" }}>
                <span style={{ color: "#F5B800" }}>L</span>
                <span style={{ color: "#FF6B6B" }}>.</span>
                <span style={{ color: "#E8453C" }}>A</span>
                <span style={{ color: "#4A90D9" }}>I</span>
                <span style={{ color: "#FF6B6B" }}>.</span>
                <span style={{ color: "#E8453C" }}>R</span>
                <span style={{ color: "#F5B800" }}>R</span>
                <span style={{ color: "#2ECC71" }}>Y</span>
              </div>
            <div
  className="text-[9px] font-semibold text-cyan-500 dark:text-cyan-400 tracking-widest leading-tight -mt-0.5 whitespace-nowrap"
  style={{ animation: "lineToText 0.6s 0.3s ease forwards", opacity: 0 }}
>
  SYS.ONLINE
</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}