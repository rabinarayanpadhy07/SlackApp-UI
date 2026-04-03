import { CheckCircle2, MailIcon, ShieldCheckIcon, TriangleAlert } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useForgotPassword } from '@/hooks/apis/auth/useForgotPassword';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [localError, setLocalError] = useState('');
  const { forgotPasswordMutation, isPending, isSuccess, error } = useForgotPassword();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email.trim()) {
      setLocalError('Email is required');
      return;
    }

    setLocalError('');
    await forgotPasswordMutation({ email: email.trim() });
  };

  return (
    <Card className="w-full overflow-hidden border-white/50 shadow-[0_20px_60px_-30px_rgba(97,31,105,0.45)]">
      <CardHeader>
        <div className="inline-flex w-fit items-center gap-2 rounded-full bg-[#f4e8f7] px-3 py-1 text-xs font-medium text-[#611f69]">
          <MailIcon className="size-3.5" />
          Account recovery
        </div>
        <CardTitle className="mt-3">Forgot password</CardTitle>
        <CardDescription>
          Enter your email and we&apos;ll send a reset link if the account exists.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {(localError || error) ? (
            <div className="flex items-center gap-2 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
              <TriangleAlert className="size-4" />
              <p>{localError || getApiErrorMessage(error)}</p>
            </div>
          ) : null}

          {isSuccess ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-500/10 p-4 text-sm text-emerald-700">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
                <div>
                  <p className="font-medium">Check your inbox</p>
                  <p className="mt-1">
                    If an account exists for that email, a reset link has been sent. It will expire in 1 hour.
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          <Input
            type="email"
            placeholder="Email"
            value={email}
            disabled={isPending}
            onChange={(event) => setEmail(event.target.value)}
          />
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? 'Sending...' : 'Send reset link'}
          </Button>
        </form>

        <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
          <div className="flex items-center gap-2 font-medium text-slate-900">
            <ShieldCheckIcon className="size-4 text-[#611f69]" />
            Recovery tips
          </div>
          <ul className="mt-2 space-y-1.5">
            <li>Use the email address you signed up with.</li>
            <li>Check spam or promotions if the message does not arrive quickly.</li>
            <li>The reset link expires in 1 hour for security.</li>
          </ul>
        </div>

        <p className="mt-4 text-sm text-muted-foreground">
          Remembered your password?{' '}
          <Link className="text-sky-600 hover:underline" to="/auth/signin">
            Back to sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};
