'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Shield, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const { resetPassword, loading } = useAuthContext();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Email is required');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Invalid email format');
      return;
    }

    const result = await resetPassword(email);

    if (result.success) {
      setSent(true);
      toast.success('Password reset email sent!');
    } else {
      toast.error(result.error || 'Failed to send reset email');
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col">
      {/* Background effects */}
      <div className="fixed inset-0 bg-hero-pattern opacity-30" />
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-accent-500/5 rounded-full blur-3xl" />

      {/* Header */}
      <header className="relative z-10 p-6">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-dark-400 hover:text-dark-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to login
        </Link>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2">
              <Shield className="w-10 h-10 text-primary-400" />
              <span className="text-2xl font-bold text-dark-50">
                Smart<span className="text-primary-400">Scan</span>
              </span>
            </Link>
          </div>

          <Card>
            {sent ? (
              <CardContent className="py-12 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', duration: 0.5 }}
                  className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </motion.div>
                <h2 className="text-xl font-semibold text-dark-100 mb-2">Check your email</h2>
                <p className="text-dark-400 mb-6">
                  We&apos;ve sent a password reset link to
                  <br />
                  <span className="text-dark-200 font-medium">{email}</span>
                </p>
                <p className="text-sm text-dark-500 mb-6">
                  Didn&apos;t receive the email? Check your spam folder or try again.
                </p>
                <Button
                  variant="secondary"
                  onClick={() => setSent(false)}
                  className="w-full"
                >
                  Try another email
                </Button>
              </CardContent>
            ) : (
              <>
                <CardHeader className="text-center">
                  <CardTitle as="h1" className="text-2xl">Reset Password</CardTitle>
                  <CardDescription>
                    Enter your email address and we&apos;ll send you a link to reset your password
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                      type="email"
                      label="Email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      error={error}
                      icon={<Mail className="w-5 h-5" />}
                      autoComplete="email"
                      disabled={loading}
                    />

                    <Button type="submit" className="w-full" loading={loading}>
                      Send Reset Link
                    </Button>
                  </form>

                  <div className="mt-6 text-center">
                    <p className="text-sm text-dark-400">
                      Remember your password?{' '}
                      <Link
                        href="/login"
                        className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
                      >
                        Sign in
                      </Link>
                    </p>
                  </div>
                </CardContent>
              </>
            )}
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
