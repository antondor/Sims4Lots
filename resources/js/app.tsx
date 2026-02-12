import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { ThemeProvider } from "@/components/theme-provider";
import "../css/app.css";

const appName = import.meta.env.VITE_APP_NAME || 'PlotPalette';

createInertiaApp({
    title: (title) => `${title} | ${appName}`,
    progress: { color: "#6366f1" },
    resolve: async (name) => {
        const mod: any = await resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob("./pages/**/*.tsx")
        );

        const Page = mod.default;

        return mod;
    },
    setup({ el, App, props }) {
        createRoot(el).render(
            <ThemeProvider defaultTheme="light" storageKey="theme">
                <App {...props} />
            </ThemeProvider>,
        );
    },
});
