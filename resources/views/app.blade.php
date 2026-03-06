<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link rel="icon" type="image/svg+xml" href="/logo.svg">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=SN+Pro:ital,wght@0,200..900;1,200..900&display=swap" rel="stylesheet">

    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-D5JGFXNY7D"></script>
    <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'G-D5JGFXNY7D');
    </script>

    @viteReactRefresh
    @routes

    @vite(['resources/css/app.css', 'resources/js/app.tsx'])

    @inertiaHead
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <script>
        (() => {
            try {
                const stored = localStorage.getItem("theme");
                const prefersDark = window.matchMedia &&
                    window.matchMedia("(prefers-color-scheme: dark)").matches;

                let theme = "light";

                if (stored === "dark" || stored === "light") {
                    theme = stored;
                } else if (stored === "system") {
                    theme = prefersDark ? "dark" : "light";
                } else {
                    theme = prefersDark ? "dark" : "light";
                }

                const root = document.documentElement;
                root.classList.remove("light", "dark");
                root.classList.add(theme);
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
