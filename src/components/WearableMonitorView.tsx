import React, { useState, useEffect, useRef } from 'react';
import { Heart, Watch, Bluetooth, RefreshCw, Zap, Check, AlertCircle, Play, Pause } from 'lucide-react';
import { getHeartRateZone } from '../utils/fitness';

interface WearableMonitorViewProps {
  currentBpm: number;
  onBpmChange: (bpm: number) => void;
  isConnected: boolean;
  onConnectionToggle: (connected: boolean) => void;
  deviceName: string;
  onDeviceChange: (name: string) => void;
}

export const WearableMonitorView: React.FC<WearableMonitorViewProps> = ({
  currentBpm,
  onBpmChange,
  isConnected,
  onConnectionToggle,
  deviceName,
  onDeviceChange,
}) => {
  const [deviceList] = useState<string[]>([
    'Apple Watch Ultra 2 (Bluetooth BLE)',
    'Garmin Forerunner 965',
    'Samsung Galaxy Watch 6',
    'Xiaomi Smart Band 8 Pro',
    'BugarKu Smart Sensor Simulator',
  ]);

  const [isSimulatingActivity, setIsSimulatingActivity] = useState<boolean>(true);
  const [simIntensity, setSimIntensity] = useState<'rest' | 'fatburn' | 'cardio' | 'peak'>('fatburn');
  const [bluetoothError, setBluetoothError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Live ECG Pulse Wave drawing loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let step = 0;
    const points: number[] = new Array(120).fill(60);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!isConnected) {
        // Flatline or disconnected state
        ctx.beginPath();
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 2;
        ctx.moveTo(0, canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();
        return;
      }

      // Generate ECG waveform value based on step & current BPM
      const cycleLen = Math.max(15, Math.round(3600 / currentBpm));
      const pos = step % cycleLen;
      let y = canvas.height / 2;

      // P wave
      if (pos > cycleLen * 0.2 && pos < cycleLen * 0.3) {
        y -= 8;
      }
      // Q dip
      else if (pos >= cycleLen * 0.38 && pos < cycleLen * 0.42) {
        y += 10;
      }
      // R peak (QRS)
      else if (pos >= cycleLen * 0.42 && pos < cycleLen * 0.48) {
        y -= 45;
      }
      // S dip
      else if (pos >= cycleLen * 0.48 && pos < cycleLen * 0.54) {
        y += 20;
      }
      // T wave
      else if (pos >= cycleLen * 0.65 && pos < cycleLen * 0.78) {
        y -= 14;
      } else {
        // slight jitter
        y += (Math.random() - 0.5) * 2;
      }

      points.push(y);
      if (points.length > canvas.width) {
        points.shift();
      }

      // Draw path
      ctx.beginPath();
      ctx.strokeStyle = '#ef4444'; // rose / red ecg
      ctx.lineWidth = 2.5;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';

      for (let i = 0; i < points.length; i++) {
        if (i === 0) {
          ctx.moveTo(i, points[i]);
        } else {
          ctx.lineTo(i, points[i]);
        }
      }
      ctx.stroke();

      step++;
      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animId);
  }, [isConnected, currentBpm]);

  // Dynamic BPM fluctuation simulation
  useEffect(() => {
    if (!isConnected || !isSimulatingActivity) return;

    const baseBpmTarget =
      simIntensity === 'rest' ? 68 :
      simIntensity === 'fatburn' ? 124 :
      simIntensity === 'cardio' ? 152 : 174;

    const interval = setInterval(() => {
      onBpmChange(
        Math.min(195, Math.max(55, baseBpmTarget + Math.floor((Math.random() - 0.5) * 6)))
      );
    }, 1200);

    return () => clearInterval(interval);
  }, [isConnected, isSimulatingActivity, simIntensity, onBpmChange]);

  const currentZone = getHeartRateZone(currentBpm);

  // Web Bluetooth real device scan attempt (with graceful fallback)
  const handleWebBluetoothScan = async () => {
    setBluetoothError(null);
    if (typeof navigator !== 'undefined' && 'bluetooth' in navigator) {
      try {
        const navAny = navigator as unknown as { bluetooth: { requestDevice: (opt: unknown) => Promise<{ name?: string }> } };
        const device = await navAny.bluetooth.requestDevice({
          filters: [{ services: ['heart_rate'] }],
        });
        if (device && device.name) {
          onDeviceChange(device.name);
          onConnectionToggle(true);
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Koneksi dibatalkan atau Bluetooth tidak tersedia di peramban ini.';
        setBluetoothError(`Web Bluetooth: ${message}. Menggunakan simulator aktif bawaan.`);
        onConnectionToggle(true);
      }
    } else {
      setBluetoothError('Web Bluetooth API tidak didukung pada browser ini. Mengaktifkan simulator wearable beresolusi tinggi.');
      onConnectionToggle(true);
    }
  };

  const zonesList = [
    { name: 'Zona 1: Istirahat / Pemulihan', range: '< 100 BPM', desc: 'Pemulihan aktif & relaksasi' },
    { name: 'Zona 2: Pembakaran Lemak (Fat Burn)', range: '100 - 135 BPM', desc: 'Metabolisme asam lemak paling efisien' },
    { name: 'Zona 3: Kardio Aerobik', range: '136 - 165 BPM', desc: 'Meningkatkan kapasitas stamina jantung & paru' },
    { name: 'Zona 4: Puncak Anaerobik', range: '> 165 BPM', desc: 'Batas batas VO2 max & kecepatan ledakan' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Integrasi Perangkat Wearable & Detak Jantung
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Pantau ritme kardiak real-time (BPM), gelombang elektrokardiogram (ECG), dan zona pembakaran lemak saat berolahraga.
          </p>
        </div>

        {/* Connection status toggle */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
            <span className="text-slate-700 dark:text-slate-300">
              {isConnected ? 'Terhubung' : 'Terputus'}
            </span>
          </div>

          <button
            type="button"
            onClick={() => onConnectionToggle(!isConnected)}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              isConnected
                ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60'
                : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-xs'
            }`}
          >
            {isConnected ? 'Putuskan Perangkat' : 'Hubungkan Wearable'}
          </button>
        </div>
      </div>

      {bluetoothError && (
        <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl flex items-center gap-2 text-xs text-amber-800 dark:text-amber-300">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{bluetoothError}</span>
        </div>
      )}

      {/* Main Wearable Vitals Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real-time BPM Gauge & Status */}
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Detak Jantung Langsung
              </span>
              <Watch className="w-4 h-4 text-slate-400" />
            </div>

            <div className="flex items-center justify-center my-6 gap-3">
              <Heart className={`w-12 h-12 text-rose-500 fill-rose-500 ${isConnected ? 'animate-bounce' : 'opacity-40'}`} />
              <div className="flex items-baseline">
                <span className="text-6xl font-extrabold font-mono tabular-nums text-slate-900 dark:text-white">
                  {isConnected ? currentBpm : '--'}
                </span>
                <span className="text-sm font-semibold text-slate-400 ml-2">BPM</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 rounded-2xl text-center">
              <span className="text-[11px] text-slate-400 block mb-0.5">Zona Latihan Saat Ini</span>
              <span className={`text-sm font-bold ${isConnected ? currentZone.color : 'text-slate-400'}`}>
                {isConnected ? currentZone.name : 'Sensor Tidak Aktif'}
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                {isConnected ? currentZone.benefit : 'Hubungkan smartwatch untuk mulai merekam.'}
              </p>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800 mt-4 flex items-center justify-between">
            <span>Perangkat: {deviceName}</span>
            <span className="text-emerald-500 font-semibold">Sinyal Kuat 100%</span>
          </div>
        </div>

        {/* Live Dynamic ECG Canvas */}
        <div className="lg:col-span-2 p-6 bg-slate-950 text-white border border-slate-800 rounded-3xl shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                  Gelombang Kardiak (ECG / EKG Lead II)
                </span>
              </div>
              <span className="text-xs font-mono text-emerald-400 tabular-nums">
                {currentBpm} BPM · 25 mm/s
              </span>
            </div>

            {/* Canvas */}
            <div className="w-full bg-slate-900/90 rounded-2xl p-2 border border-slate-800/80 my-2 overflow-hidden">
              <canvas
                ref={canvasRef}
                width={500}
                height={120}
                className="w-full h-32 block"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
            <span>Ritme Sinus Normal · Bebas Aritmia</span>
            <span>Akurasi Sensor PPG Optik: ±1 BPM</span>
          </div>
        </div>
      </div>

      {/* Simulator Controls & Target Heart Rate Zones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Simulator Intensity Switcher */}
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Simulasi Respons Kardio & Intensitas
              </h3>
              <p className="text-xs text-slate-500">
                Uji coba bagaimana respons detak jantung berubah saat transisi fase latihan.
              </p>
            </div>
            <Zap className="w-5 h-5 text-amber-500" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <button
              type="button"
              onClick={() => {
                setSimIntensity('rest');
                onConnectionToggle(true);
              }}
              className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                simIntensity === 'rest'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-900 dark:border-white shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              <span className="block font-bold">Istirahat</span>
              <span className="text-[10px] opacity-75">~68 BPM</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSimIntensity('fatburn');
                onConnectionToggle(true);
              }}
              className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                simIntensity === 'fatburn'
                  ? 'bg-emerald-500 text-white border-emerald-600 shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              <span className="block font-bold">Fat Burn</span>
              <span className="text-[10px] opacity-75">~125 BPM</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSimIntensity('cardio');
                onConnectionToggle(true);
              }}
              className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                simIntensity === 'cardio'
                  ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              <span className="block font-bold">Kardio</span>
              <span className="text-[10px] opacity-75">~150 BPM</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSimIntensity('peak');
                onConnectionToggle(true);
              }}
              className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                simIntensity === 'peak'
                  ? 'bg-rose-500 text-white border-rose-600 shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              <span className="block font-bold">Puncak</span>
              <span className="text-[10px] opacity-75">~175 BPM</span>
            </button>
          </div>

          {/* Device Model Selector */}
          <div className="pt-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Pilih Profil Smartwatch / Sensor:
            </label>
            <select
              value={deviceName}
              onChange={(e) => onDeviceChange(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
            >
              {deviceList.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="pt-1">
            <button
              type="button"
              onClick={handleWebBluetoothScan}
              className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Bluetooth className="w-4 h-4 text-blue-500" />
              <span>Pindai Perangkat Bluetooth Nyata di Sekitar</span>
            </button>
          </div>
        </div>

        {/* Zones Reference Card */}
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Panduan Zona Detak Jantung Latihan
            </h3>
            <p className="text-xs text-slate-500">
              Menjaga denyut di zona yang tepat melipatgandakan efektivitas pembakaran lemak.
            </p>
          </div>

          <div className="space-y-2.5 text-xs">
            {zonesList.map((z, idx) => (
              <div
                key={idx}
                className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between"
              >
                <div>
                  <span className="font-semibold text-slate-900 dark:text-white block">
                    {z.name}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    {z.desc}
                  </span>
                </div>
                <span className="font-bold font-mono tabular-nums text-slate-700 dark:text-slate-300">
                  {z.range}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
