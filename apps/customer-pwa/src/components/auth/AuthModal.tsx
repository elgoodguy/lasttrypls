import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@repo/ui/components/ui/dialog';
import { Button } from '@repo/ui/components/ui/button';
import { Input } from '@repo/ui/components/ui/input';
import { Label } from '@repo/ui/components/ui/label';
import { useSupabase } from '@/providers/SupabaseProvider';
import { useAuth } from '@/providers/AuthProvider';
import { Provider } from '@supabase/supabase-js';
import { useTranslation } from 'react-i18next';

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ open, onOpenChange }) => {
  const supabase = useSupabase();
  const { isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const { t } = useTranslation();

  const handleEmailPasswordAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    try {
      let response;
      if (isSigningUp) {
        // Sign Up
        response = await supabase.auth.signUp({ email, password });
        if (response.error) throw response.error;
        // Check if user needs confirmation email (default Supabase setting)
        if (response.data.user && response.data.user.identities?.length === 0) {
          setMessage(t('auth.messages.verificationNeeded'));
        } else if (response.data.session) {
          setMessage(t('auth.messages.signupSuccess'));
          onOpenChange(false); // Close modal on successful signup
        } else {
          setMessage(t('auth.messages.checkEmail'));
        }
      } else {
        // Sign In
        response = await supabase.auth.signInWithPassword({ email, password });
        if (response.error) throw response.error;
        setMessage(t('auth.messages.loginSuccess'));
        onOpenChange(false); // Close modal on success
      }
    } catch (err: any) {
      console.error('Auth Error:', err);
      setError(err.message || t('auth.messages.unexpectedError'));
    }
  };

  const handleOAuthLogin = async (provider: Provider) => {
    setError(null);
    setMessage(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
      });
      if (error) throw error;
    } catch (err: any) {
      console.error('OAuth Error:', err);
      setError(err.message || `${t('auth.messages.oauthError')} ${provider}.`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isSigningUp ? t('auth.signup.title') : t('auth.login.title')}</DialogTitle>
          <DialogDescription>
            {isSigningUp ? t('auth.signup.description') : t('auth.login.description')}
          </DialogDescription>
        </DialogHeader>

        {error && <p className="text-red-500 text-sm px-6">{error}</p>}
        {message && <p className="text-green-500 text-sm px-6">{message}</p>}

        {/* Email/Password Form */}
        <form onSubmit={handleEmailPasswordAuth} className="grid gap-4 px-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="email">{t('auth.form.email')}</Label>
            <Input
              id="email"
              type="email"
              placeholder={t('auth.form.emailPlaceholder')}
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">{t('auth.form.password')}</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              required
              minLength={6}
              disabled={isLoading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? t('auth.form.processing') : isSigningUp ? t('auth.signup.button') : t('auth.login.button')}
          </Button>
        </form>

        {/* Separator */}
        <div className="relative px-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              {t('auth.oauth.continueWith')}
            </span>
          </div>
        </div>

        {/* OAuth Buttons */}
        <div className="grid gap-4 px-6 py-4">
          <Button variant="outline" onClick={() => handleOAuthLogin('google')} disabled={isLoading}>
            <svg
              className="mr-2 h-4 w-4"
              aria-hidden="true"
              focusable="false"
              data-prefix="fab"
              data-icon="google"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 488 512"
            >
              <path
                fill="currentColor"
                d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 23.4 172.9 61.9l-76.7 60.5c-19.7-17.8-47.4-28.8-78.2-28.8-66.8 0-120.9 54.2-120.9 120.9s54.1 120.9 120.9 120.9c76.3 0 104.2-52.4 109.3-78.5H248v-68.6h239.8c4.7 25.5 7.2 52.9 7.2 81.8z"
              ></path>
            </svg>
            {t('auth.oauth.google')}
          </Button>
          <Button variant="outline" disabled={true}>
            📱 {t('auth.oauth.phone')}
          </Button>
        </div>

        {/* Toggle Login/Signup */}
        <DialogFooter className="px-6 pb-4">
          <p className="text-sm text-muted-foreground">
            {isSigningUp ? t('auth.login.haveAccount') : t('auth.signup.noAccount')}{' '}
            <Button
              variant="link"
              className="p-0 h-auto"
              onClick={() => {
                setIsSigningUp(!isSigningUp);
                setError(null);
                setMessage(null);
              }}
            >
              {isSigningUp ? t('auth.login.button') : t('auth.signup.button')}
            </Button>
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
