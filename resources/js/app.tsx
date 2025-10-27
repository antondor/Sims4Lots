import React from 'react';
import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import '../css/app.css'

createInertiaApp({
    resolve: (name) => {
        const pages = import.meta.glob('./pages/**/*.tsx', { eager: true });
        const page = pages[`./pages/${name}.tsx`] as any;

        if (!page) {
            throw new Error(`Page ${name} not found`);
        }

        return page.default; // важно вернуть default
    },
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },
}).catch((err) => {
    console.error('Inertia app failed to load:', err);
});
