'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Shield, Mail, Lock, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const { signIn, loading } = useAuthContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const result = await signIn(email, password);

    if (result.success) {
      toast.success('Welcome back!');
      router.push('/dashboard');
    } else {
      toast.error(result.error || 'Sign in failed');
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
          href="/"
          className="inline-flex items-center gap-2 text-dark-400 hover:text-dark-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
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
            <CardHeader className="text-center">
              <CardTitle as="h1" className="text-2xl">Welcome Back</CardTitle>
              <CardDescription>Sign in to your account to continue</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  type="email"
                  label="Email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={errors.email}
                  icon={<Mail className="w-5 h-5" />}
                  autoComplete="email"
                  disabled={loading}
                />

                <div>
                  <Input
                    type="password"
                    label="Password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={errors.password}
                    icon={<Lock className="w-5 h-5" />}
                    autoComplete="current-password"
                    disabled={loading}
                  />
                  <div className="mt-2 text-right">
                    <Link
                      href="/forgot-password"
                      className="text-sm text-primary-400 hover:text-primary-300 transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                </div>

                <Button type="submit" className="w-full" loading={loading}>
                  Sign In
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-dark-400">
                  Don&apos;t have an account?{' '}
                  <Link
                    href="/signup"
                    className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Security notice */}
          <p className="mt-6 text-center text-xs text-dark-500">
            Protected by industry-standard encryption.
            <br />
            Your data is safe with us.
          </p>
        </motion.div>
      </main>
    </div>
  );
}
