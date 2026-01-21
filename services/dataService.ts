import { GameStats, WormColor } from "../types";
import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  increment, 
  onSnapshot 
} from "firebase/firestore";
import { firebaseConfig } from "./firebaseConfig";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Collection and Doc references
const COLLECTION_NAME = "evolution_game";
const DOC_ID = "global_stats_v1";
const statsRef = doc(db, COLLECTION_NAME, DOC_ID);

const INITIAL_STATS: GameStats = {
  totalGreen: 0,
  caughtGreen: 0,
  totalOthers: 0,
  caughtOthers: 0,
  roundsPlayed: 0
};

export const DataService = {
  // Đăng ký nhận dữ liệu Realtime
  subscribeToStats: (callback: (stats: GameStats) => void) => {
    return onSnapshot(statsRef, (docSnap) => {
      if (docSnap.exists()) {
        callback(docSnap.data() as GameStats);
      } else {
        // Nếu chưa có dữ liệu trên server, tạo mới
        setDoc(statsRef, INITIAL_STATS);
        callback(INITIAL_STATS);
      }
    }, (error) => {
      console.error("Lỗi kết nối Firebase:", error);
      // Fallback nếu lỗi (mất mạng, sai config)
      callback(INITIAL_STATS);
    });
  },

  // Gọi khi bắt đầu game: Cộng dồn số lượng sâu vào database
  registerRound: async (greenCount: number, othersCount: number) => {
    try {
      await updateDoc(statsRef, {
        totalGreen: increment(greenCount),
        totalOthers: increment(othersCount),
        roundsPlayed: increment(1)
      });
    } catch (e) {
      // Nếu doc chưa tồn tại (lần đầu tiên chạy app), tạo mới
      try {
        await setDoc(statsRef, {
          ...INITIAL_STATS,
          totalGreen: greenCount,
          totalOthers: othersCount,
          roundsPlayed: 1
        });
      } catch (err) {
        console.error("Lỗi khởi tạo dữ liệu:", err);
      }
    }
  },

  // Gọi NGAY LẬP TỨC khi bắt được sâu
  recordCatch: async (color: WormColor) => {
    try {
      if (color === WormColor.GREEN) {
        await updateDoc(statsRef, {
          caughtGreen: increment(1)
        });
      } else {
        await updateDoc(statsRef, {
          caughtOthers: increment(1)
        });
      }
    } catch (e) {
      console.error("Lỗi lưu điểm:", e);
    }
  },

  // Xóa sạch dữ liệu trên Server
  resetData: async () => {
    try {
      await setDoc(statsRef, INITIAL_STATS);
    } catch (e) {
      console.error("Lỗi reset dữ liệu:", e);
    }
  }
};