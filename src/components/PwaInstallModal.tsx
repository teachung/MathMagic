import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, Share, PlusSquare, CheckCircle2, Wifi, WifiOff, X, Sparkles } from 'lucide-react';

interface PwaInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PwaInstallModal({ isOpen, onClose }: PwaInstallModalProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Check if standalone
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    setIsInstalled(isStandalone);

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // Handle beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
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
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-md bg-gradient-to-b from-[#e0f4ff] via-[#c2e9fb] to-[#99d9f9] rounded-3xl p-5 sm:p-6 shadow-2xl border-4 border-white text-slate-800 overflow-hidden"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-white/80 hover:bg-white text-slate-500 hover:text-slate-800 transition-colors shadow-xs"
          >
            <X className="w-5 h-5" />
          </button>

          {/* App Icon & Header */}
          <div className="flex items-center gap-3.5 mb-4">
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
                <span className="text-xs bg-sky-200 text-sky-800 px-2 py-0.5 rounded-full font-bold">PWA</span>
              </h3>
              <p className="text-xs font-bold text-sky-800">
                可離線隨時遊玩・免網絡連線
              </p>
            </div>
          </div>

          {/* Online/Offline Status Banner */}
          <div className={`p-2.5 rounded-2xl border mb-4 flex items-center gap-2 text-xs font-bold ${
            isOnline
              ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
              : 'bg-amber-50 text-amber-900 border-amber-300'
          }`}>
            {isOnline ? (
              <>
                <Wifi className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>網絡狀態正常，離線快取資料已就緒 ❄️</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>目前處於離線模式，仍可完整正常遊玩！🎉</span>
              </>
            )}
          </div>

          {/* Installation Instructions / Button */}
          {isInstalled ? (
            <div className="bg-white/80 rounded-2xl p-4 text-center border border-sky-200 mb-4">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-1.5" />
              <p className="font-black text-sm text-sky-950">已成功安裝為桌面 / 手機 App！</p>
              <p className="text-xs text-sky-700 mt-1">您可以隨時從桌面圖示直接開啟遊戲。</p>
            </div>
          ) : deferredPrompt ? (
            <div className="space-y-3 mb-4">
              <p className="text-xs font-bold text-sky-900 text-center">
                點擊下方按鈕，即可將《冰雪魔法數學》新增至您的電腦桌面或手機主畫面！
              </p>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleInstallClick}
                className="w-full py-3 bg-gradient-to-r from-sky-500 via-blue-600 to-cyan-500 text-white font-black text-sm sm:text-base rounded-2xl shadow-lg border-2 border-white flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-5 h-5" />
                <span>立即新增至桌面 (一鍵安裝)</span>
              </motion.button>
            </div>
          ) : isIOS ? (
            <div className="bg-white/85 rounded-2xl p-4 border border-sky-200 space-y-2 mb-4">
              <div className="flex items-center gap-1.5 text-xs font-black text-sky-950">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>iOS / iPad 安裝至桌面步驟：</span>
              </div>
              <ol className="text-xs font-bold text-sky-800 space-y-1.5 list-decimal list-inside">
                <li className="flex items-center gap-1.5">
                  <span>1. 點擊 Safari 下方或頂部的</span>
                  <span className="inline-flex items-center gap-0.5 bg-sky-100 px-1.5 py-0.5 rounded text-sky-900 font-black">
                    <Share className="w-3.5 h-3.5" /> 分享按鈕
                  </span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span>2. 向下滑動並選擇</span>
                  <span className="inline-flex items-center gap-0.5 bg-sky-100 px-1.5 py-0.5 rounded text-sky-900 font-black">
                    <PlusSquare className="w-3.5 h-3.5" /> 加入主畫面
                  </span>
                </li>
                <li>3. 點擊右上角「新增」即完成！</li>
              </ol>
            </div>
          ) : (
            <div className="bg-white/85 rounded-2xl p-4 border border-sky-200 space-y-2 mb-4 text-xs font-bold text-sky-800">
              <p className="font-black text-sky-950 text-sm">💡 電腦瀏覽器安裝方式：</p>
              <p>點擊網址列右側的 <strong>「安裝 App ⊕」</strong> 或瀏覽器右上角選單中的 <strong>「安裝 冰雪魔法數學」</strong>，即可擁有獨立視窗與專屬桌面圖示！</p>
            </div>
          )}

          {/* Features Highlights */}
          <div className="bg-white/60 rounded-2xl p-3 text-[11px] font-bold text-sky-900 grid grid-cols-2 gap-2">
            <div className="flex items-center gap-1">
              <span>❄️ 100% 離線可用</span>
            </div>
            <div className="flex items-center gap-1">
              <span>🏰 進度自動儲存</span>
            </div>
            <div className="flex items-center gap-1">
              <span>⚡ 即開即玩無延遲</span>
            </div>
            <div className="flex items-center gap-1">
              <span>👑 專屬精美桌面圖示</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full mt-4 py-2 bg-white hover:bg-sky-50 text-sky-900 text-xs font-black rounded-xl border border-sky-200 transition-colors shadow-2xs"
          >
            關閉視窗
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
