import React from "react";

type Theme = "light" | "dark";

type ThemeContextValue = {
    theme: Theme;
    setTheme: (value: Theme | ((prev: Theme) => Theme)) => void;
    toggleTheme: () => void;
};

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "theme";

function getPreferredTheme(): Theme {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "dark" || stored === "light") {
        return stored;
    }

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
}

function applyTheme(theme: Theme) {
    if (typeof document === "undefined") return;

    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.style.colorScheme = theme;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = React.useState<Theme>(getPreferredTheme);

    const setTheme = React.useCallback((value: Theme | ((prev: Theme) => Theme)) => {
        setThemeState((prev) => {
            const next = typeof value === "function" ? value(prev) : value;

            if (typeof window !== "undefined") {
                window.localStorage.setItem(STORAGE_KEY, next);
            }

            return next;
        });
    }, []);

    const toggleTheme = React.useCallback(() => {
        setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    }, [setTheme]);

    React.useEffect(() => {
        applyTheme(theme);
    }, [theme]);

    const value = React.useMemo(
        () => ({ theme, setTheme, toggleTheme }),
        [theme, setTheme, toggleTheme]
    );

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
    const ctx = React.useContext(ThemeContext);
    if (!ctx) {
        throw new Error("useTheme must be used within ThemeProvider");
    }

    return ctx;
}
