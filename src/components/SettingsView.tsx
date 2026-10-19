import React, { useState } from 'react';
import {
  Bell,
  Moon,
  Sun,
  Palette,
  Cloud,
  CloudOff,
  RefreshCw,
  Download,
  Upload,
  Volume2,
  HelpCircle,
  Clock,
  Plus,
  Trash2,
  Check,
} from 'lucide-react';
import { AppSettings, ReminderSetting, ThemeAccent } from '../types';
import { soundEffects } from '../utils/audio';

interface SettingsViewProps {
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
  reminders: ReminderSetting[];
  onUpdateReminders: (reminders: ReminderSetting[]) => void;
  lastSyncTime: string;
  onManualSync: () => void;
  onExportData: () => void;
  onImportData: (jsonStr: string) => boolean;
  onOpenBeginnerGuide: () => void;
  isOnline: boolean;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  reminders,
  onUpdateReminders,
  lastSyncTime,
  onManualSync,
  onExportData,
  onImportData,
  onOpenBeginnerGuide,
  isOnline,
}) => {
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncSuccess, setSyncSuccess] = useState<boolean>(false);
  const [newReminderTitle, setNewReminderTitle] = useState<string>('');
  const [newReminderTime, setNewReminderTime] = useState<string>('07:00');
  const [isAddReminderOpen, setIsAddReminderOpen] = useState<boolean>(false);
  const [notificationStatus, setNotificationStatus] = useState<string>(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default'
  );

  const accentColors: { id: ThemeAccent; label: string; colorClass: string }[] = [
    { id: 'emerald', label: 'Emerald Hijau', colorClass: 'bg-emerald-500' },
    { id: 'lime', label: 'Neon Lime', colorClass: 'bg-lime-500' },
    { id: 'orange', label: 'Sunset Coral', colorClass: 'bg-orange-500' },
    { id: 'cyan', label: 'Electric Cyan', colorClass: 'bg-cyan-500' },
    { id: 'violet', label: 'Royal Violet', colorClass: 'bg-violet-500' },
  ];

  const handleTriggerSync = () => {
    setIsSyncing(true);
    soundEffects.playTick();
    setTimeout(() => {
      onManualSync();
      setIsSyncing(false);
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 2500);
    }, 1200);
  };

  const handleRequestNotification = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const permission = await Notification.requestPermission();
        setNotificationStatus(permission);
        if (permission === 'granted') {
          soundEffects.playStart();
          new Notification('BugarKu: Notifikasi Aktif!', {
            body: 'Pengingat latihan harian Anda sekarang aktif. Waktunya bergerak sehat!',
          });
        }
      } catch (e) {
        console.warn('Notification permission error:', e);
      }
    }
  };

  const handleToggleReminder = (id: string) => {
    const updated = reminders.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r));
    onUpdateReminders(updated);
  };

  const handleDeleteReminder = (id: string) => {
    const updated = reminders.filter((r) => r.id !== id);
    onUpdateReminders(updated);
  };

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReminderTitle.trim()) return;

    const newRem: ReminderSetting = {
      id: 'rem-' + Date.now(),
      title: newReminderTitle.trim(),
      time: newReminderTime,
      enabled: true,
      type: 'latihan',
      message: `Waktunya: ${newReminderTitle.trim()}! Ayo luangkan waktu untuk tubuh Anda.`,
      days: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
    };

    onUpdateReminders([...reminders, newRem]);
    setNewReminderTitle('');
    setIsAddReminderOpen(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const ok = onImportData(content);
        if (ok) {
          alert('Data cadangan berhasil dipulihkan!');
        } else {
          alert('Format file cadangan tidak valid.');
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Pengaturan, Notifikasi & Sinkronisasi
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Sesuaikan kenyamanan tampilan tema, jadwal pengingat latihan harian, dan kelola cadangan cloud otomatis.
        </p>
      </div>

      {/* Online/Offline Status Banner */}
      <div className={`p-4 rounded-2xl border flex items-center justify-between text-xs transition-colors ${
        isOnline
          ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300'
          : 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-300'
      }`}>
        <div className="flex items-center gap-2.5">
          {isOnline ? (
            <Cloud className="w-5 h-5 text-emerald-500" />
          ) : (
            <CloudOff className="w-5 h-5 text-amber-500" />
          )}
          <div>
            <span className="font-bold text-sm block">
              {isOnline ? 'Terhubung Online & Siap Sinkron' : 'Mode Offline Aktif'}
            </span>
            <span>
              {isOnline
                ? 'Semua data tersimpan otomatis di perangkat dan sinkron dengan cloud cadangan.'
                : 'Aplikasi berjalan penuh tanpa internet! Data tetap tersimpan aman di penyimpanan lokal.'}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleTriggerSync}
          disabled={isSyncing}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold shadow-xs hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-emerald-500' : ''}`} />
          <span>{syncSuccess ? 'Tersinkron!' : isSyncing ? 'Menyinkronkan...' : 'Sinkronkan Sekarang'}</span>
        </button>
      </div>

      {/* Section 1: Personalized Daily Reminders */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-emerald-500" />
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Notifikasi Pengingat Latihan Harian
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Bangun disiplin tanpa lupa dengan alarm dan pesan motivasi terpersonalisasi.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {notificationStatus !== 'granted' && (
              <button
                type="button"
                onClick={handleRequestNotification}
                className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
              >
                Izinkan Notifikasi Sistem
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsAddReminderOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Jam Baru</span>
            </button>
          </div>
        </div>

        {/* Reminders List */}
        <div className="space-y-3">
          {reminders.map((rem) => (
            <div
              key={rem.id}
              className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleToggleReminder(rem.id)}
                  className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors cursor-pointer ${
                    rem.enabled
                      ? 'bg-emerald-500 border-emerald-600 text-white'
                      : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700'
                  }`}
                  aria-label={rem.enabled ? 'Nonaktifkan pengingat' : 'Aktifkan pengingat'}
                >
                  {rem.enabled && <Check className="w-3.5 h-3.5" />}
                </button>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-white font-mono tabular-nums">
                      {rem.time}
                    </span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {rem.title}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {rem.message}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400 hidden sm:inline">
                  {rem.days.join(', ')}
                </span>
                <button
                  type="button"
                  onClick={() => handleDeleteReminder(rem.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg transition-colors cursor-pointer"
                  title="Hapus pengingat"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Reminder Modal */}
      {isAddReminderOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <form
            onSubmit={handleAddReminder}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-xs"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Tambah Jadwal Pengingat
              </h3>
              <button
                type="button"
                onClick={() => setIsAddReminderOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                Judul Pengingat
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Sesi Peregangan Malam"
                value={newReminderTitle}
                onChange={(e) => setNewReminderTitle(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                Waktu Alarm (Jam : Menit)
              </label>
              <input
                type="time"
                required
                value={newReminderTime}
                onChange={(e) => setNewReminderTime(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setIsAddReminderOpen(false)}
                className="flex-1 py-2.5 font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 font-semibold rounded-xl bg-emerald-500 text-white shadow-xs"
              >
                Simpan Alarm
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Section 2: Appearance & Theme Customization */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <Palette className="w-5 h-5 text-emerald-500" />
          <h3 className="font-bold text-slate-900 dark:text-white text-base">
            Penyesuaian Tema & Mode Gelap
          </h3>
        </div>

        {/* Dark Mode Switch */}
        <div className="flex items-center justify-between">
          <div>
            <span className="font-semibold text-sm text-slate-900 dark:text-white block">
              Mode Gelap (Dark Mode)
            </span>
            <span className="text-xs text-slate-500">
              Meringankan kelelahan mata saat penggunaan malam hari serta menghemat konsumsi baterai OLED.
            </span>
          </div>

          <button
            type="button"
            onClick={() => onUpdateSettings({ ...settings, isDarkMode: !settings.isDarkMode })}
            className={`p-2 rounded-xl border flex items-center gap-2 text-xs font-semibold transition-all cursor-pointer ${
              settings.isDarkMode
                ? 'bg-slate-800 border-slate-700 text-white'
                : 'bg-slate-100 border-slate-200 text-slate-700'
            }`}
          >
            {settings.isDarkMode ? (
              <>
                <Moon className="w-4 h-4 text-emerald-400" />
                <span>Aktif</span>
              </>
            ) : (
              <>
                <Sun className="w-4 h-4 text-amber-500" />
                <span>Terang</span>
              </>
            )}
          </button>
        </div>

        {/* Accent Color Selection */}
        <div>
          <span className="font-semibold text-sm text-slate-900 dark:text-white block mb-1">
            Warna Aksen Antarmuka
          </span>
          <span className="text-xs text-slate-500 block mb-3">
            Pilih warna dominan yang paling nyaman untuk mata dan motivasi Anda.
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {accentColors.map((ac) => (
              <button
                key={ac.id}
                type="button"
                onClick={() => onUpdateSettings({ ...settings, accentColor: ac.id })}
                className={`p-3 rounded-2xl border flex items-center gap-2 text-xs font-semibold transition-all cursor-pointer ${
                  settings.accentColor === ac.id
                    ? 'border-slate-900 dark:border-white bg-slate-50 dark:bg-slate-800 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <span className={`w-3.5 h-3.5 rounded-full ${ac.colorClass} shrink-0`} />
                <span className="text-slate-800 dark:text-slate-200 truncate">{ac.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Audio Effects Toggle */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
          <div>
            <span className="font-semibold text-sm text-slate-900 dark:text-white block">
              Efek Suara Audio Countdown
            </span>
            <span className="text-xs text-slate-500">
              Bunyi detak hitung mundur, peluit mulai, dan musik kemenangan latihan.
            </span>
          </div>

          <button
            type="button"
            onClick={() => onUpdateSettings({ ...settings, soundEffects: !settings.soundEffects })}
            className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
              settings.soundEffects ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <span
              className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                settings.soundEffects ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Section 3: Cloud Backup & Data Portability */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Cadangan Cloud & Portabilitas Data
            </h3>
            <p className="text-xs text-slate-500">
              Terakhir dicadangkan: <span className="font-medium text-slate-700 dark:text-slate-300">{lastSyncTime}</span>
            </p>
          </div>
          <Cloud className="w-5 h-5 text-emerald-500" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <button
            type="button"
            onClick={onExportData}
            className="p-3.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2 font-semibold text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-500" />
            <span>Unduh Cadangan JSON (Ekspor)</span>
          </button>

          <label className="p-3.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2 font-semibold text-slate-800 dark:text-slate-200 transition-colors cursor-pointer">
            <Upload className="w-4 h-4 text-blue-500" />
            <span>Pulihkan Data Cadangan (Impor)</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Section 4: Beginner Quickstart Guide Trigger */}
      <div className="p-6 bg-slate-900 text-white rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-base">
            Baru Pertama Kali Memulai Olahraga?
          </h4>
          <p className="text-xs text-slate-400 mt-1 max-w-md">
            Buka panduan ramah pemula untuk mempelajari teknik pernapasan, postur awal yang aman, dan tips membangun kebiasaan tanpa cedera.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenBeginnerGuide}
          className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
        >
          <HelpCircle className="w-4 h-4" />
          <span>Buka Panduan Pemula</span>
        </button>
      </div>
    </div>
  );
};
