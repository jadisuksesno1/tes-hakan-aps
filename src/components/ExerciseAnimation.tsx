import React, { useState, useEffect } from 'react';
import { Play, Pause, FastForward, Activity } from 'lucide-react';

interface ExerciseAnimationProps {
  animationKey: string;
  primaryMuscle: string;
  isPlaying?: boolean;
}

export const ExerciseAnimation: React.FC<ExerciseAnimationProps> = ({
  animationKey,
  primaryMuscle,
  isPlaying = true,
}) => {
  const [localPlaying, setLocalPlaying] = useState(isPlaying);
  const [speed, setSpeed] = useState<number>(1.0);
  const [frame, setFrame] = useState<number>(0);

  useEffect(() => {
    setLocalPlaying(isPlaying);
  }, [isPlaying]);

  useEffect(() => {
    if (!localPlaying) return;

    let animId: number;
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      setFrame((prev) => (prev + delta * speed * 2) % (Math.PI * 2));
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [localPlaying, speed]);

  // Sine factor oscillating smoothly between 0 and 1
  const t = (Math.sin(frame) + 1) / 2;
  const isEccentric = Math.sin(frame) > 0;

  // Render SVG based on animationKey
  const renderFigure = () => {
    switch (animationKey) {
      case 'jumping-jacks': {
        // Legs spread: 0 -> closed, 1 -> wide
        const legSpread = 15 + t * 45;
        // Arms: 0 -> at sides (down), 1 -> overhead
        const armAngle = -30 + t * 190;
        const leftArmX = 140 - Math.sin((armAngle * Math.PI) / 180) * 45;
        const leftArmY = 110 - Math.cos((armAngle * Math.PI) / 180) * 45;
        const rightArmX = 160 + Math.sin((armAngle * Math.PI) / 180) * 45;
        const rightArmY = 110 - Math.cos((armAngle * Math.PI) / 180) * 45;

        return (
          <g>
            {/* Ground shadow */}
            <ellipse cx="150" cy="245" rx={35 + t * 15} ry="6" className="fill-slate-200 dark:fill-slate-800" />
            {/* Head */}
            <circle cx="150" cy="70" r="14" className="fill-emerald-500 stroke-emerald-600 dark:stroke-emerald-400 stroke-2" />
            {/* Torso */}
            <line x1="150" y1="84" x2="150" y2="150" className="stroke-slate-700 dark:stroke-slate-200 stroke-[7] stroke-linecap-round" />
            {/* Arms */}
            <line x1="150" y1="100" x2={leftArmX} y2={leftArmY} className="stroke-emerald-500 stroke-[5] stroke-linecap-round" />
            <line x1="150" y1="100" x2={rightArmX} y2={rightArmY} className="stroke-emerald-500 stroke-[5] stroke-linecap-round" />
            {/* Legs */}
            <line x1="150" y1="150" x2={150 - legSpread} y2="235" className="stroke-slate-700 dark:stroke-slate-200 stroke-[6] stroke-linecap-round" />
            <line x1="150" y1="150" x2={150 + legSpread} y2="235" className="stroke-slate-700 dark:stroke-slate-200 stroke-[6] stroke-linecap-round" />
          </g>
        );
      }

      case 'push-ups': {
        // Body lowers: 0 -> high, 1 -> low chest near floor
        const chestY = 140 + t * 35;
        const headX = 90;
        const headY = chestY - 10;
        const hipX = 175;
        const hipY = chestY + 12;
        const feetX = 230;
        const feetY = 190;

        return (
          <g>
            {/* Floor mat */}
            <line x1="50" y1="195" x2="260" y2="195" className="stroke-slate-300 dark:stroke-slate-700 stroke-2 stroke-linecap-round" />
            {/* Target muscle chest glow */}
            <circle cx={headX + 25} cy={chestY} r={14 + t * 4} className="fill-emerald-500/20" />
            {/* Head */}
            <circle cx={headX} cy={headY} r="12" className="fill-emerald-500 stroke-emerald-600 dark:stroke-emerald-400 stroke-2" />
            {/* Torso & Spine */}
            <line x1={headX + 10} y1={chestY} x2={feetX} y2={feetY} className="stroke-slate-700 dark:stroke-slate-200 stroke-[7] stroke-linecap-round" />
            {/* Arm (bends when lowering) */}
            <polyline
              points={`115,${chestY} ${125 + (1 - t) * 8},${(chestY + 195) / 2} 115,195`}
              className="stroke-emerald-500 fill-none stroke-[5] stroke-linecap-round stroke-linejoin-round"
            />
            {/* Leg */}
            <line x1={hipX} y1={hipY} x2={feetX} y2={feetY} className="stroke-slate-600 dark:stroke-slate-300 stroke-[6] stroke-linecap-round" />
          </g>
        );
      }

      case 'squats': {
        // Squat: 0 -> Standing, 1 -> Deep 90-deg squat
        const hipY = 135 + t * 42;
        const kneeY = 185;
        const kneeX = 145 + t * 16;
        const chestY = 90 + t * 38;
        const chestX = 148 - t * 12;

        return (
          <g>
            {/* Floor */}
            <line x1="80" y1="240" x2="220" y2="240" className="stroke-slate-300 dark:stroke-slate-700 stroke-2" />
            {/* Head */}
            <circle cx={chestX} cy={chestY - 22} r="13" className="fill-emerald-500 stroke-emerald-600 dark:stroke-emerald-400 stroke-2" />
            {/* Torso */}
            <line x1={chestX} y1={chestY} x2="148" y2={hipY} className="stroke-slate-700 dark:stroke-slate-200 stroke-[7] stroke-linecap-round" />
            {/* Arms forward for counterbalance */}
            <polyline
              points={`${chestX},${chestY + 10} ${chestX + 35},${chestY + 8} ${chestX + 60},${chestY + 12}`}
              className="stroke-slate-500 fill-none stroke-[4] stroke-linecap-round"
            />
            {/* Thigh (Quadriceps & Glutes) highlighted */}
            <line x1="148" y1={hipY} x2={kneeX} y2={kneeY} className="stroke-emerald-500 stroke-[8] stroke-linecap-round" />
            {/* Calf / Shin */}
            <line x1={kneeX} y1={kneeY} x2="148" y2="240" className="stroke-slate-700 dark:stroke-slate-200 stroke-[6] stroke-linecap-round" />
            {/* Foot */}
            <line x1="140" y1="240" x2="160" y2="240" className="stroke-slate-800 dark:stroke-slate-100 stroke-[5] stroke-linecap-round" />
          </g>
        );
      }

      case 'plank': {
        // Steady core tension with micro breathing oscillation
        const breathY = Math.sin(frame * 2) * 2;
        return (
          <g>
            <line x1="40" y1="185" x2="260" y2="185" className="stroke-slate-300 dark:stroke-slate-700 stroke-2" />
            {/* Core glow */}
            <ellipse cx="145" cy={140 + breathY} rx="26" ry="14" className="fill-emerald-500/25 animate-pulse" />
            {/* Head */}
            <circle cx="85" cy={130 + breathY} r="12" className="fill-emerald-500 stroke-emerald-600 stroke-2" />
            {/* Spine & Body line */}
            <line x1="95" y1={135 + breathY} x2="235" y2="180" className="stroke-slate-700 dark:stroke-slate-200 stroke-[7] stroke-linecap-round" />
            {/* Forearm support */}
            <polyline points={`105,${140 + breathY} 105,185 85,185`} className="stroke-slate-600 dark:stroke-slate-300 fill-none stroke-[5] stroke-linecap-round" />
            {/* Feet */}
            <line x1="235" y1="180" x2="235" y2="185" className="stroke-slate-800 dark:stroke-slate-100 stroke-[6] stroke-linecap-round" />
          </g>
        );
      }

      case 'lunges': {
        // 0 -> Standing, 1 -> Deep lunge
        const stepProg = t;
        const frontKneeX = 120;
        const frontKneeY = 170 + stepProg * 25;
        const backKneeX = 190;
        const backKneeY = 170 + stepProg * 35;
        const hipY = 130 + stepProg * 35;

        return (
          <g>
            <line x1="60" y1="240" x2="240" y2="240" className="stroke-slate-300 dark:stroke-slate-700 stroke-2" />
            {/* Head */}
            <circle cx="150" cy={hipY - 55} r="13" className="fill-emerald-500 stroke-emerald-600 stroke-2" />
            {/* Spine */}
            <line x1="150" y1={hipY - 42} x2="150" y2={hipY} className="stroke-slate-700 dark:stroke-slate-200 stroke-[7] stroke-linecap-round" />
            {/* Front Leg */}
            <polyline
              points={`150,${hipY} ${frontKneeX},${frontKneeY} ${frontKneeX - 10},240`}
              className="stroke-emerald-500 fill-none stroke-[7] stroke-linecap-round stroke-linejoin-round"
            />
            {/* Back Leg */}
            <polyline
              points={`150,${hipY} ${backKneeX},${backKneeY} ${backKneeX + 15},238`}
              className="stroke-slate-600 dark:stroke-slate-400 fill-none stroke-[5] stroke-linecap-round stroke-linejoin-round"
            />
          </g>
        );
      }

      case 'mountain-climbers': {
        const legFlip = Math.sin(frame * 2.5);
        const knee1X = 115 + legFlip * 22;
        const knee2X = 145 - legFlip * 22;

        return (
          <g>
            <line x1="40" y1="195" x2="260" y2="195" className="stroke-slate-300 dark:stroke-slate-700 stroke-2" />
            <circle cx="85" cy="130" r="12" className="fill-emerald-500 stroke-emerald-600 stroke-2" />
            <line x1="95" y1="135" x2="160" y2="145" className="stroke-slate-700 dark:stroke-slate-200 stroke-[7] stroke-linecap-round" />
            {/* Arms */}
            <line x1="100" y1="140" x2="100" y2="195" className="stroke-slate-600 dark:stroke-slate-300 stroke-[5] stroke-linecap-round" />
            {/* Knee 1 driving up */}
            <polyline points={`160,145 ${knee1X},165 220,195`} className="stroke-emerald-500 fill-none stroke-[6] stroke-linecap-round stroke-linejoin-round" />
            {/* Knee 2 extending */}
            <polyline points={`160,145 ${knee2X},175 235,195`} className="stroke-slate-500 fill-none stroke-[5] stroke-linecap-round stroke-linejoin-round" />
          </g>
        );
      }

      case 'glute-bridge': {
        // Hip lifts up to straight line: 0 -> down on floor, 1 -> lifted
        const hipLiftY = 185 - t * 45;
        return (
          <g>
            <line x1="50" y1="195" x2="250" y2="195" className="stroke-slate-300 dark:stroke-slate-700 stroke-2" />
            {/* Shoulders & Head on floor */}
            <circle cx="80" cy="180" r="12" className="fill-emerald-500 stroke-emerald-600 stroke-2" />
            {/* Glute highlight */}
            <circle cx="150" cy={hipLiftY} r="16" className="fill-emerald-500/25" />
            {/* Torso & Thigh */}
            <polyline
              points={`90,185 150,${hipLiftY} 205,150 205,195`}
              className="stroke-emerald-500 fill-none stroke-[7] stroke-linecap-round stroke-linejoin-round"
            />
          </g>
        );
      }

      case 'cobra-stretch': {
        // Torso bends backward gently
        const arch = 135 - t * 25;
        return (
          <g>
            <line x1="50" y1="190" x2="250" y2="190" className="stroke-slate-300 dark:stroke-slate-700 stroke-2" />
            <circle cx="95" cy={arch - 20} r="12" className="fill-emerald-500 stroke-emerald-600 stroke-2" />
            {/* Arched spine */}
            <path
              d={`M 95,${arch} Q 130,175 220,188`}
              className="stroke-emerald-500 fill-none stroke-[7] stroke-linecap-round"
            />
            {/* Supporting arms */}
            <line x1="110" y1={arch + 5} x2="110" y2="190" className="stroke-slate-600 dark:stroke-slate-300 stroke-[5] stroke-linecap-round" />
          </g>
        );
      }

      default: {
        // Standard full body rhythmic pulse
        return (
          <g>
            <ellipse cx="150" cy="245" rx="35" ry="6" className="fill-slate-200 dark:fill-slate-800" />
            <circle cx="150" cy="70" r="14" className="fill-emerald-500 stroke-emerald-600 stroke-2" />
            <line x1="150" y1="84" x2="150" y2="155" className="stroke-slate-700 dark:stroke-slate-200 stroke-[7] stroke-linecap-round" />
            <line x1="150" y1="105" x2={110 + t * 20} y2={135 - t * 15} className="stroke-emerald-500 stroke-[5] stroke-linecap-round" />
            <line x1="150" y1="105" x2={190 - t * 20} y2={135 - t * 15} className="stroke-emerald-500 stroke-[5] stroke-linecap-round" />
            <line x1="150" y1="155" x2="130" y2="240" className="stroke-slate-700 dark:stroke-slate-200 stroke-[6] stroke-linecap-round" />
            <line x1="150" y1="155" x2="170" y2="240" className="stroke-slate-700 dark:stroke-slate-200 stroke-[6] stroke-linecap-round" />
          </g>
        );
      }
    }
  };

  return (
    <div className="flex flex-col items-center bg-slate-900/5 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 w-full">
      {/* Visual Canvas Area */}
      <div className="relative w-full max-w-xs h-64 flex items-center justify-center">
        <svg
          viewBox="0 0 300 270"
          className="w-full h-full drop-shadow-sm select-none"
        >
          {renderFigure()}
        </svg>

        {/* Phase Badge */}
        <div className="absolute top-2 left-2 flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border border-slate-200 dark:border-slate-800 px-2.5 py-1 rounded-md">
          <Activity className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
          <span>{isEccentric ? 'Fase Kontraksi / Tarik' : 'Fase Relaksasi / Lepas'}</span>
        </div>

        {/* Target muscle highlight */}
        <div className="absolute bottom-2 right-2 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 px-2.5 py-1 rounded-md">
          Target: {primaryMuscle}
        </div>
      </div>

      {/* Animation Controls Bar */}
      <div className="flex items-center justify-between w-full mt-3 pt-3 border-t border-slate-200/80 dark:border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setLocalPlaying(!localPlaying)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors cursor-pointer"
            aria-label={localPlaying ? 'Jeda animasi' : 'Putar animasi'}
          >
            {localPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
                <span>Jeda</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500" />
                <span>Putar</span>
              </>
            )}
          </button>
        </div>

        {/* Speed Selector */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-0.5 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
          {[0.5, 1.0, 1.5].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSpeed(s)}
              className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                speed === s
                  ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
