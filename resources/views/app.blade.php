<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Laravel + Inertia</title>
    @viteReactRefresh
    @routes
    @vite(['resources/js/app.tsx'])
    @inertiaHead
    <meta name="csrf-token" content="{{ csrf_token() }}">
</head>
<body>
@inertia
</body>
</html>
