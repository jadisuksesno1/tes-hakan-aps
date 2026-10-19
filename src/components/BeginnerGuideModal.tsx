import React, { useState } from 'react';
import { X, CheckCircle, ChevronRight, ChevronLeft, Heart, Flame, Shield, Sparkles } from 'lucide-react';

interface BeginnerGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BeginnerGuideModal: React.FC<BeginnerGuideModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState<number>(0);

  if (!isOpen) return null;

  const steps = [
    {
      title: 'Selamat Datang di BugarKu ID!',
      subtitle: 'Memulai perjalanan kebugaran tanpa rasa takut atau bingung.',
      content:
        'Anda tidak perlu langsung berlatih 1 jam atau mengangkat beban berat. Kunci keberhasilan tubuh sehat jangka panjang adalah konsistensi mikro: cukup 10-15 menit gerakan per hari yang dilakukan secara teratur!',
      icon: <Sparkles className="w-8 h-8 text-emerald-500" />,
      tips: [
        'Mulai dari gerakan berlabel "Pemula" di katalog olahraga.',
        'Pemanasan dinamis dan pendinginan wajib dilakukan setiap sesi.',
        'Dengarkan sinyal tubuh Anda jika merasa pusing atau terlalu lelah.',
      ],
    },
    {
      title: 'Teknik Pernapasan & Postur Tubuh',
      subtitle: 'Kunci kekuatan inti dan pencegah cedera.',
      content:
        'Prinsip emas pernapasan saat berolahraga: Tarik napas saat fase relaksasi atau saat menurunkan tubuh, dan hembuskan napas kuat dari mulut saat fase kontraksi atau mendorong beban.',
      icon: <Shield className="w-8 h-8 text-blue-500" />,
      tips: [
        'Jangan pernah menahan napas (Valsalva maneuver) saat gerakan pemula.',
        'Jaga tulang belakang tetap netral dan kunci otot perut (core).',
        'Gunakan cermin atau video kamera depan ponsel untuk mencocokkan pose dengan animasi di layar.',
      ],
    },
    {
      title: 'Pola Makan & Kebutuhan Kalori',
      subtitle: '70% transformasi tubuh ditentukan di meja makan.',
      content:
        'Anda tidak perlu kelaparan atau pantang makan nasi secara ekstrem. Cukup gunakan kalkulator BMR & TDEE di tab Nutrisi untuk mengetahui batas kalori harian Anda.',
      icon: <Flame className="w-8 h-8 text-orange-500" />,
      tips: [
        'Perbanyak protein berkualitas: tempe, tahu, dada ayam, ikan, telur.',
        'Minum air putih minimal 2.000 - 2.500 ml setiap hari.',
        'Gunakan resep menu sehat khas Indonesia yang telah kami sediakan.',
      ],
    },
    {
      title: 'Pantau Detak Jantung & Progres Bertahap',
      subtitle: 'Zona pembakaran lemak & konsistensi mingguan.',
      content:
        'Latihan kardio terbaik untuk membakar lemak bukanlah yang membuat Anda kehabisan napas sampai mau pingsan, melainkan berada di Zona 2 (100 - 135 BPM) di mana Anda masih bisa berbicara santai.',
      icon: <Heart className="w-8 h-8 text-rose-500" />,
      tips: [
        'Gunakan simulator wearable atau hubungkan smartwatch Anda.',
        'Timbang berat badan 1 minggu sekali di pagi hari setelah bangun tidur.',
        'Bagikan pencapaian Anda ke forum komunitas untuk saling memotivasi!',
      ],
    },
  ];

  const current = steps[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              Langkah {currentStep + 1} dari {steps.length}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shrink-0">
              {current.icon}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
                {current.title}
              </h3>
              <p className="text-xs text-slate-500">{current.subtitle}</p>
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {current.content}
          </p>

          <div className="p-4 bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/60 rounded-2xl space-y-2">
            <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300 block">
              💡 Tips Penting:
            </span>
            <ul className="space-y-1.5 text-xs text-emerald-800 dark:text-emerald-200/90">
              {current.tips.map((t, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Navigation Step Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            disabled={currentStep === 0}
            onClick={() => setCurrentStep((prev) => prev - 1)}
            className={`flex items-center gap-1 px-3 py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer ${
              currentStep === 0
                ? 'opacity-30 cursor-not-allowed text-slate-400'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Sebelumnya</span>
          </button>

          {currentStep < steps.length - 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => prev + 1)}
              className="flex items-center gap-1 px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white shadow-xs cursor-pointer"
            >
              <span>Selanjutnya</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-xs font-semibold rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white shadow-xs cursor-pointer"
            >
              Saya Siap Mulai!
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
