export type ThemeMode = 'light' | 'dark' | 'system';

export class ThemeService {
  private currentMode: ThemeMode = 'system';
  private mediaQuery: MediaQueryList | null = null;
  private listeners: Array<(mode: ThemeMode, isDark: boolean) => void> = [];

  constructor() {
    if (typeof window !== 'undefined') {
      this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      this.mediaQuery.addEventListener('change', () => {
        if (this.currentMode === 'system') {
          this.applyTheme();
        }
      });
    }
  }

  init() {
    const saved = localStorage.getItem('procheck_theme') as ThemeMode;
    if (saved === 'light' || saved === 'dark' || saved === 'system') {
      this.currentMode = saved;
    } else {
      this.currentMode = 'system';
    }
    this.applyTheme();
  }

  getTheme(): ThemeMode {
    return this.currentMode;
  }

  isDark(): boolean {
    if (this.currentMode === 'dark') return true;
    if (this.currentMode === 'light') return false;
    return this.mediaQuery ? this.mediaQuery.matches : false;
  }

  setTheme(mode: ThemeMode) {
    this.currentMode = mode;
    localStorage.setItem('procheck_theme', mode);
    this.applyTheme();
  }

  private applyTheme() {
    const dark = this.isDark();
    if (typeof document !== 'undefined') {
      if (dark) {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.add('p-dark');
        document.documentElement.setAttribute('data-theme', 'dark');
        document.body.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.remove('p-dark');
        document.documentElement.setAttribute('data-theme', 'light');
        document.body.classList.remove('dark');
      }
    }
    this.listeners.forEach(cb => cb(this.currentMode, dark));
  }

  onThemeChange(cb: (mode: ThemeMode, isDark: boolean) => void) {
    this.listeners.push(cb);
  }
}

export default new ThemeService();
