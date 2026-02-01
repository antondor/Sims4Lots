<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Laravel + Inertia</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=SN+Pro:ital,wght@0,200..900;1,200..900&display=swap" rel="stylesheet">
    @viteReactRefresh
    @routes

    @vite(['resources/css/app.css', 'resources/js/app.tsx'])

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
<body class="font-sans antialiased">
    @inertia
</body>
</html>
