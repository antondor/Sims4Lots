import React from "react";
import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import MainLayout from "@/layouts/main-layout";
import "../css/app.css";

createInertiaApp({
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
        createRoot(el).render(<App {...props} />);
    },
});
