import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Play, RotateCcw, Users, Leaf, Info, Globe, Trash2, WifiOff, Lock } from 'lucide-react';
import { Worm, WormColor, GameState, GameStats } from './types';
import { Worm as WormComponent } from './components/Worm';
import { ResultsChart } from './components/ResultsChart';
import { DataService } from './services/dataService';

// Constants
const GAME_DURATION = 10; // seconds
const GREEN_COUNT = 25;
const OTHERS_COUNT = 25;
const ADMIN_PASSWORD = "admin"; // Mật khẩu đơn giản để giáo viên xóa dữ liệu

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [worms, setWorms] = useState<Worm[]>([]);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  
  // Stats for the current user's session only
  const [sessionStats, setSessionStats] = useState({
    caughtGreen: 0,
    caughtOthers: 0
  });

  // Global stats (Real-time from Firebase)
  const [globalStats, setGlobalStats] = useState<GameStats>({
    totalGreen: 0,
    caughtGreen: 0,
    totalOthers: 0,
    caughtOthers: 0,
    roundsPlayed: 0
  });

  const timerRef = useRef<number | null>(null);

  // Connect to Firebase Realtime Stream on Mount
  useEffect(() => {
    // Hàm này sẽ được gọi mỗi khi DB trên server thay đổi
    const unsubscribe = DataService.subscribeToStats((newStats) => {
      setGlobalStats(newStats);
    });

    // Cleanup khi đóng app
    return () => unsubscribe();
  }, []);

  // Initialize Worms
  const initializeWorms = useCallback(() => {
    const newWorms: Worm[] = [];
    
    // Create Green Worms (Camouflaged)
    for (let i = 0; i < GREEN_COUNT; i++) {
      const requiresTwoClicks = Math.random() < 0.65;
      newWorms.push({
        id: `g-${i}`,
        x: Math.random() * 90 + 5,
        y: Math.random() * 80 + 10,
        color: WormColor.GREEN,
        isCaught: false,
        rotation: Math.random() * 360,
        requiredClicks: requiresTwoClicks ? 2 : 1,
        clickCount: 0
      });
    }

    // Create Other Worms
    for (let i = 0; i < OTHERS_COUNT; i++) {
      newWorms.push({
        id: `o-${i}`,
        x: Math.random() * 90 + 5,
        y: Math.random() * 80 + 10,
        color: Math.random() > 0.5 ? WormColor.RED : WormColor.YELLOW,
        isCaught: false,
        rotation: Math.random() * 360,
        requiredClicks: 1,
        clickCount: 0
      });
    }

    setWorms(newWorms.sort(() => Math.random() - 0.5));
    setSessionStats({ caughtGreen: 0, caughtOthers: 0 });
  }, []);

  const startGame = () => {
    initializeWorms();
    setTimeLeft(GAME_DURATION);
    setGameState(GameState.PLAYING);

    // Register to Cloud Database (Async)
    DataService.registerRound(GREEN_COUNT, OTHERS_COUNT);
  };

  const catchWorm = (id: string) => {
    if (gameState !== GameState.PLAYING) return;
    
    setWorms(prev => {
      const wormIndex = prev.findIndex(w => w.id === id);
      if (wormIndex === -1) return prev;
      
      const targetWorm = prev[wormIndex];
      if (targetWorm.isCaught) return prev;

      const newClickCount = targetWorm.clickCount + 1;
      const isCaught = newClickCount >= targetWorm.requiredClicks;

      const newWorms = [...prev];
      newWorms[wormIndex] = { ...targetWorm, clickCount: newClickCount, isCaught: isCaught };

      if (isCaught) {
        // Send catch to Cloud Database
        DataService.recordCatch(targetWorm.color);

        setSessionStats(curr => ({
          ...curr,
          caughtGreen: targetWorm.color === WormColor.GREEN ? curr.caughtGreen + 1 : curr.caughtGreen,
          caughtOthers: targetWorm.color !== WormColor.GREEN ? curr.caughtOthers + 1 : curr.caughtOthers
        }));
      }

      return newWorms;
    });
  };

  const finishGame = useCallback(() => {
    setGameState(GameState.FINISHED);
  }, []);

  // Timer Logic
  useEffect(() => {
    if (gameState === GameState.PLAYING) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            finishGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, finishGame]);

  const handleResetData = () => {
    const password = window.prompt("Nhập mật khẩu Admin để xóa dữ liệu máy chủ (Mật khẩu mặc định: admin):");
    if (password === ADMIN_PASSWORD) {
      if (window.confirm("CẢNH BÁO CUỐI CÙNG: Bạn đang xóa dữ liệu của TOÀN BỘ người chơi trên hệ thống. Hành động này không thể hoàn tác.")) {
        DataService.resetData();
        setGameState(GameState.MENU);
      }
    } else if (password !== null) {
      alert("Sai mật khẩu!");
    }
  };

  const resetGame = () => {
    setGameState(GameState.MENU);
  };

  return (
    <div className="min-h-screen bg-stone-100 font-sans text-slate-800 flex flex-col items-center p-4">
      {/* Header */}
      <header className="w-full max-w-4xl flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-green-100 p-2 rounded-lg text-green-700">
            <Leaf size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Tìm sâu</h1>
            <p className="text-xs text-slate-500">
              Server: <span className="text-green-600 font-semibold">{window.location.hostname || 'Localhost'}</span>
            </p>
          </div>
        </div>
        <div className="flex gap-4 text-sm font-semibold">
          <div className="flex flex-col items-end">
            <span className="text-slate-400 text-xs">THỜI GIAN</span>
            <span className={`text-2xl ${timeLeft <= 5 && gameState === GameState.PLAYING ? 'text-red-500 animate-pulse' : 'text-slate-700'}`}>
              {timeLeft}s
            </span>
          </div>
        </div>
      </header>

      {/* Main Game Area */}
      <main className="relative w-full max-w-4xl aspect-[4/3] md:aspect-[16/9] bg-white rounded-2xl shadow-xl overflow-hidden border-4 border-white">
        
        {/* The Leaf Background */}
        <div className={`w-full h-full relative overflow-hidden transition-colors duration-500 leaf-texture ${gameState === GameState.PLAYING ? 'predator-cursor' : ''}`}>
           {/* Veins */}
           <div className="absolute top-1/2 left-0 w-full h-1 bg-white/10 -translate-y-1/2 rounded-full blur-[1px]"></div>
           <div className="absolute top-1/2 left-1/2 w-1 h-full bg-white/5 -translate-x-1/2 rounded-full blur-[1px] rotate-45"></div>
           <div className="absolute top-1/2 left-1/2 w-1 h-full bg-white/5 -translate-x-1/2 rounded-full blur-[1px] -rotate-45"></div>

           {/* Worms */}
           {gameState === GameState.PLAYING && worms.map(worm => (
             <WormComponent key={worm.id} worm={worm} onCatch={catchWorm} />
           ))}

           {/* Start Overlay */}
           {gameState === GameState.MENU && (
             <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center z-10 text-white p-6 text-center">
               <h2 className="text-4xl font-bold mb-4 drop-shadow-md">Sẵn sàng săn mồi?</h2>
               <p className="max-w-md mb-8 text-lg opacity-90">
                 Tìm và bắt sâu trong {GAME_DURATION} giây.
                 <br/>
                 <span className="text-sm text-green-300 mt-2 block font-semibold flex items-center justify-center gap-2">
                   <Globe size={16}/> Đồng bộ dữ liệu: {window.location.hostname}
                 </span>
               </p>
               
               {globalStats.roundsPlayed === 0 && (
                  <div className="mb-4 text-yellow-300 bg-yellow-900/50 p-2 rounded text-sm max-w-xs animate-pulse">
                    <WifiOff className="inline mr-2" size={16}/>
                    Đang chờ kết nối dữ liệu từ máy chủ...
                  </div>
               )}

               <div className="flex flex-col items-center gap-4">
                 <button 
                   onClick={startGame}
                   className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white px-8 py-3 rounded-full font-bold text-lg shadow-lg hover:shadow-green-500/30 transition-all transform hover:-translate-y-1"
                 >
                   <Play size={24} fill="currentColor" />
                   Bắt đầu chơi
                 </button>
                 
                 <div className="mt-4 p-3 bg-white/10 rounded-lg text-sm text-white/80">
                   Tổng số người tham gia quần thể: <strong>{globalStats.roundsPlayed}</strong>
                 </div>
               </div>
             </div>
           )}

           {/* Results Overlay */}
           {gameState === GameState.FINISHED && (
             <div className="absolute inset-0 bg-white/95 backdrop-blur-md z-20 p-6 md:p-12 overflow-y-auto">
                <div className="max-w-2xl mx-auto">
                  <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold text-slate-800">Dữ Liệu Toàn Cầu</h2>
                    <div className="flex items-center justify-center gap-2 text-green-600 mt-1 font-medium">
                      <Globe size={16} />
                      <p>Cập nhật thời gian thực từ {globalStats.roundsPlayed} lượt chơi</p>
                    </div>
                  </div>

                  <ResultsChart stats={globalStats} />

                  <div className="mt-6 flex flex-col gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex gap-3 text-sm text-blue-900">
                       <Info className="shrink-0 text-blue-500" />
                       <div>
                         <p className="font-semibold mb-1">Kết quả của bạn:</p>
                         <p>
                           Sâu xanh: {sessionStats.caughtGreen}/{GREEN_COUNT} | 
                           Sâu khác: {sessionStats.caughtOthers}/{OTHERS_COUNT}
                         </p>
                         <p className="text-blue-700/70 text-xs mt-1">
                           Đã tải lên máy chủ {window.location.hostname} thành công.
                         </p>
                       </div>
                    </div>

                    <div className="flex flex-col items-center gap-3 mt-4">
                      <button 
                        onClick={resetGame}
                        className="w-full md:w-auto flex justify-center items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-8 py-3 rounded-lg font-bold shadow-md transition-all"
                      >
                        <RotateCcw size={18} />
                        Về Menu Chính
                      </button>
                      
                      <button 
                        onClick={handleResetData}
                        className="text-red-400 text-xs hover:text-red-600 hover:bg-red-50 px-4 py-2 rounded transition-colors flex items-center gap-2 mt-4 opacity-60 hover:opacity-100"
                        title="Chức năng dành cho giáo viên"
                      >
                        <Lock size={12} />
                        Reset Database (Admin)
                      </button>
                    </div>
                  </div>
                </div>
             </div>
           )}
        </div>
      </main>
      
      <footer className="mt-8 text-center text-slate-400 text-sm max-w-2xl">
        <p>
          Game sử dụng công nghệ Real-time Database. Mọi kết quả được lưu trữ tại: {window.location.hostname}
        </p>
      </footer>
    </div>
  );
};

export default App;