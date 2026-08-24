import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, Share, PlusSquare, CheckCircle2, Wifi, WifiOff, X, Sparkles, MoreVertical, Smartphone, Monitor } from 'lucide-react';

interface PwaInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PwaInstallModal({ isOpen, onClose }: PwaInstallModalProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>((window as any).__pwaInstallPrompt || null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Check if standalone
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    setIsInstalled(isStandalone);

    // Device detection
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    const isAndroidDevice = /android/.test(userAgent);
    setIsIOS(isIosDevice);
    setIsAndroid(isAndroidDevice);

    // Capture install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      (window as any).__pwaInstallPrompt = e;
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleInstallClick = async () => {
    const promptEvent = deferredPrompt || (window as any).__pwaInstallPrompt;
    if (promptEvent) {
      promptEvent.prompt();
      const { outcome } = await promptEvent.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
      (window as any).__pwaInstallPrompt = null;
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-md bg-gradient-to-b from-[#e0f4ff] via-[#c2e9fb] to-[#99d9f9] rounded-3xl p-4 sm:p-6 shadow-2xl border-4 border-white text-slate-800 overflow-hidden max-h-[90vh] overflow-y-auto"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-white/80 hover:bg-white text-slate-500 hover:text-slate-800 transition-colors shadow-xs z-10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* App Icon & Header */}
          <div className="flex items-center gap-3.5 mb-3">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden shadow-lg border-2 border-white bg-sky-500 flex-shrink-0">
              <img
                src="/icon.svg"
                alt="冰雪魔法數學 Icon"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-sky-950 flex items-center gap-1.5">
                <span>冰雪魔法數學</span>
                <span className="text-xs bg-sky-200 text-sky-800 px-2 py-0.5 rounded-full font-bold">App</span>
              </h3>
              <p className="text-xs font-bold text-sky-800">
                可離線隨時遊玩・免網絡連線
              </p>
            </div>
          </div>

          {/* Online/Offline Status Banner */}
          <div className={`p-2 rounded-2xl border mb-3 flex items-center gap-2 text-xs font-bold ${
            isOnline
              ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
              : 'bg-amber-50 text-amber-900 border-amber-300'
          }`}>
            {isOnline ? (
              <>
                <Wifi className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>網絡已就緒，離線快取資料可供隨時遊玩 ❄️</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>目前處於離線模式，依然可完整正常遊玩！🎉</span>
              </>
            )}
          </div>

          {/* Installation Instructions / Direct Button */}
          {isInstalled ? (
            <div className="bg-white/90 rounded-2xl p-4 text-center border border-sky-200 mb-3 shadow-xs">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-1.5" />
              <p className="font-black text-sm text-sky-950">已成功安裝為桌面 / 手機 App！</p>
              <p className="text-xs text-sky-700 mt-1">您可以隨時從手機桌面圖示直接開啟遊戲。</p>
            </div>
          ) : (
            <div className="space-y-3 mb-3">
              {/* If browser triggered install prompt */}
              {deferredPrompt && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleInstallClick}
                  className="w-full py-3 bg-gradient-to-r from-sky-500 via-blue-600 to-cyan-500 text-white font-black text-sm sm:text-base rounded-2xl shadow-lg border-2 border-white flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-5 h-5" />
                  <span>立即點此安裝至主畫面</span>
                </motion.button>
              )}

              {/* Android Chrome Explicit Guide */}
              {isAndroid && (
                <div className="bg-white/90 rounded-2xl p-3.5 border-2 border-amber-300 shadow-xs space-y-2 text-left">
                  <div className="flex items-center gap-1.5 text-xs font-black text-amber-950">
                    <Smartphone className="w-4 h-4 text-amber-600" />
                    <span>Android (Chrome) 安裝步驟：</span>
                  </div>
                  <ol className="text-xs font-bold text-slate-800 space-y-2 list-decimal list-inside">
                    <li className="flex items-start gap-1">
                      <span className="font-black text-amber-700">1.</span>
                      <span>
                        點擊 Chrome 瀏覽器右上角的 <strong>三個點點選單「<MoreVertical className="w-3.5 h-3.5 inline text-slate-700" />」</strong>
                      </span>
                    </li>
                    <li className="flex items-start gap-1">
                      <span className="font-black text-amber-700">2.</span>
                      <span>
                        在選單中點選 <strong>「安裝應用程式」</strong> 或 <strong>「加到主螢幕」</strong>
                      </span>
                    </li>
                    <li className="flex items-start gap-1">
                      <span className="font-black text-amber-700">3.</span>
                      <span>
                        點擊 <strong>「安裝」</strong>，桌面上就會出現《冰雪魔法數學》專屬圖示！
                      </span>
                    </li>
                  </ol>
                </div>
              )}

              {/* iOS Safari Guide */}
              {isIOS && (
                <div className="bg-white/90 rounded-2xl p-3.5 border border-sky-200 space-y-2 text-left shadow-xs">
                  <div className="flex items-center gap-1.5 text-xs font-black text-sky-950">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>iPhone / iPad (Safari) 安裝步驟：</span>
                  </div>
                  <ol className="text-xs font-bold text-sky-900 space-y-1.5 list-decimal list-inside">
                    <li className="flex items-center gap-1.5">
                      <span>1. 點擊 Safari 底部的</span>
                      <span className="inline-flex items-center gap-0.5 bg-sky-100 px-1.5 py-0.5 rounded text-sky-900 font-black">
                        <Share className="w-3.5 h-3.5" /> 分享
                      </span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span>2. 點選</span>
                      <span className="inline-flex items-center gap-0.5 bg-sky-100 px-1.5 py-0.5 rounded text-sky-900 font-black">
                        <PlusSquare className="w-3.5 h-3.5" /> 加到主畫面
                      </span>
                    </li>
                    <li>3. 點右上角「新增」即完成！</li>
                  </ol>
                </div>
              )}

              {/* Desktop Browser Guide */}
              {!isAndroid && !isIOS && (
                <div className="bg-white/90 rounded-2xl p-3.5 border border-sky-200 space-y-2 text-xs font-bold text-sky-800 shadow-xs">
                  <div className="flex items-center gap-1 text-sky-950 font-black text-sm">
                    <Monitor className="w-4 h-4 text-sky-600" />
                    <span>電腦瀏覽器安裝方式：</span>
                  </div>
                  <p>
                    請點擊網址列最右邊的 <strong>「安裝 App ⊕」</strong> 圖示，或點瀏覽器右上角選單 <strong>「⋮」 → 「儲存並分享」 → 「安裝 冰雪魔法數學」</strong> 即可！
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Features Highlights */}
          <div className="bg-white/70 rounded-2xl p-2.5 text-[11px] font-bold text-sky-900 grid grid-cols-2 gap-1.5 mb-3">
            <div className="flex items-center gap-1">
              <span>❄️ 100% 離線可用</span>
            </div>
            <div className="flex items-center gap-1">
              <span>🏰 進度永久儲存</span>
            </div>
            <div className="flex items-center gap-1">
              <span>⚡ 即點即開全螢幕</span>
            </div>
            <div className="flex items-center gap-1">
              <span>👑 專屬冰雪城堡圖示</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2 bg-white hover:bg-sky-50 text-sky-900 text-xs font-black rounded-xl border border-sky-200 transition-colors shadow-xs cursor-pointer"
          >
            我知道了，關閉視窗
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

