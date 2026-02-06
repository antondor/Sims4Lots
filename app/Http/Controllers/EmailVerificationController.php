<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Inertia\Inertia;

class EmailVerificationController extends Controller
{
    // 1. Показать страницу "Пожалуйста, подтвердите почту"
    public function notice(Request $request)
    {
        // Если уже подтвержден, редиректим на дашборд
        return $request->user()->hasVerifiedEmail()
            ? redirect()->intended(route('dashboard'))
            : Inertia::render('auth/verify-email', [
                'status' => session('status'),
            ]);
    }

    // 2. Обработка клика по ссылке из письма
    public function verify(EmailVerificationRequest $request)
    {
        $request->fulfill();

        return redirect()->route('dashboard');
    }

    // 3. Отправить письмо повторно
    public function send(Request $request)
    {
        if ($request->user()->hasVerifiedEmail()) {
            return redirect()->intended(route('dashboard'));
        }

        $request->user()->sendEmailVerificationNotification();

        return back()->with('status', 'verification-link-sent');
    }
}
