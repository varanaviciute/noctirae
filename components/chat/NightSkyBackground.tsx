import { Moon, Star, Sparkles, CloudMoon, Eye, Zap } from "lucide-react";

const ICONS = [
  { Icon: Star,      x: "4%",  y: "5%",  size: 18, opacity: 0.10, rotate: 20  },
  { Icon: Sparkles,  x: "14%", y: "3%",  size: 20, opacity: 0.09, rotate: -10 },
  { Icon: Star,      x: "28%", y: "7%",  size: 14, opacity: 0.11, rotate: 45  },
  { Icon: Moon,      x: "45%", y: "4%",  size: 24, opacity: 0.08, rotate: 10  },
  { Icon: Star,      x: "62%", y: "6%",  size: 16, opacity: 0.10, rotate: -30 },
  { Icon: Sparkles,  x: "78%", y: "3%",  size: 22, opacity: 0.09, rotate: 15  },
  { Icon: Moon,      x: "90%", y: "8%",  size: 26, opacity: 0.08, rotate: -15 },
  { Icon: Star,      x: "7%",  y: "18%", size: 20, opacity: 0.09, rotate: 60  },
  { Icon: CloudMoon, x: "20%", y: "22%", size: 32, opacity: 0.07, rotate: 5   },
  { Icon: Star,      x: "38%", y: "19%", size: 14, opacity: 0.11, rotate: -20 },
  { Icon: Zap,       x: "55%", y: "17%", size: 18, opacity: 0.08, rotate: -5  },
  { Icon: Sparkles,  x: "70%", y: "21%", size: 20, opacity: 0.10, rotate: 30  },
  { Icon: Star,      x: "84%", y: "18%", size: 16, opacity: 0.09, rotate: 15  },
  { Icon: Eye,       x: "93%", y: "24%", size: 20, opacity: 0.08, rotate: -10 },
  { Icon: Moon,      x: "3%",  y: "35%", size: 22, opacity: 0.07, rotate: 20  },
  { Icon: Star,      x: "16%", y: "38%", size: 18, opacity: 0.10, rotate: -45 },
  { Icon: Sparkles,  x: "32%", y: "33%", size: 22, opacity: 0.08, rotate: 10  },
  { Icon: Star,      x: "50%", y: "36%", size: 14, opacity: 0.11, rotate: 30  },
  { Icon: CloudMoon, x: "65%", y: "32%", size: 30, opacity: 0.07, rotate: -8  },
  { Icon: Star,      x: "80%", y: "37%", size: 16, opacity: 0.10, rotate: 50  },
  { Icon: Zap,       x: "10%", y: "50%", size: 18, opacity: 0.08, rotate: -15 },
  { Icon: Moon,      x: "25%", y: "52%", size: 24, opacity: 0.07, rotate: 12  },
  { Icon: Star,      x: "42%", y: "48%", size: 16, opacity: 0.10, rotate: -30 },
  { Icon: Eye,       x: "58%", y: "53%", size: 20, opacity: 0.08, rotate: 5   },
  { Icon: Sparkles,  x: "74%", y: "49%", size: 22, opacity: 0.09, rotate: -20 },
  { Icon: Star,      x: "88%", y: "52%", size: 14, opacity: 0.11, rotate: 40  },
  { Icon: Star,      x: "5%",  y: "65%", size: 20, opacity: 0.09, rotate: 25  },
  { Icon: CloudMoon, x: "18%", y: "68%", size: 28, opacity: 0.07, rotate: -5  },
  { Icon: Sparkles,  x: "35%", y: "63%", size: 20, opacity: 0.09, rotate: 15  },
  { Icon: Moon,      x: "52%", y: "67%", size: 22, opacity: 0.08, rotate: -12 },
  { Icon: Star,      x: "68%", y: "64%", size: 16, opacity: 0.10, rotate: 35  },
  { Icon: Zap,       x: "82%", y: "68%", size: 18, opacity: 0.08, rotate: -25 },
  { Icon: Star,      x: "94%", y: "63%", size: 14, opacity: 0.11, rotate: 10  },
  { Icon: Moon,      x: "8%",  y: "80%", size: 24, opacity: 0.07, rotate: 18  },
  { Icon: Star,      x: "22%", y: "83%", size: 18, opacity: 0.10, rotate: -40 },
  { Icon: Eye,       x: "40%", y: "78%", size: 20, opacity: 0.08, rotate: 5   },
  { Icon: Sparkles,  x: "56%", y: "82%", size: 22, opacity: 0.09, rotate: -15 },
  { Icon: Star,      x: "72%", y: "79%", size: 16, opacity: 0.10, rotate: 55  },
  { Icon: CloudMoon, x: "86%", y: "83%", size: 28, opacity: 0.07, rotate: -8  },
  { Icon: Star,      x: "12%", y: "92%", size: 16, opacity: 0.09, rotate: 20  },
  { Icon: Sparkles,  x: "30%", y: "94%", size: 20, opacity: 0.08, rotate: -10 },
  { Icon: Star,      x: "48%", y: "91%", size: 14, opacity: 0.11, rotate: 30  },
  { Icon: Moon,      x: "64%", y: "93%", size: 22, opacity: 0.07, rotate: 15  },
  { Icon: Star,      x: "80%", y: "90%", size: 18, opacity: 0.10, rotate: -35 },
  { Icon: Zap,       x: "95%", y: "88%", size: 16, opacity: 0.08, rotate: 10  },
];

export function NightSkyBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {ICONS.map(({ Icon, x, y, size, opacity, rotate }, i) => (
        <div
          key={i}
          className="absolute text-dream-300"
          style={{ left: x, top: y, opacity, transform: `rotate(${rotate}deg)` }}
        >
          <Icon size={size} />
        </div>
      ))}
    </div>
  );
}
