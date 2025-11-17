<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Laravel + Inertia</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    @viteReactRefresh
    @routes
    @vite(['resources/js/app.tsx'])
    @inertiaHead
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <script>
        (() => {
            const storageKey = "theme";
            try {
                const stored = localStorage.getItem(storageKey);
                const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
                const theme = stored === "dark" || stored === "light" ? stored : prefersDark ? "dark" : "light";
                const root = document.documentElement;
                root.classList.toggle("dark", theme === "dark");
                root.style.colorScheme = theme;
            } catch (e) {
                // ignore
            }
        })();
    </script>
</head>
<body>
@inertia
</body>
</html>
