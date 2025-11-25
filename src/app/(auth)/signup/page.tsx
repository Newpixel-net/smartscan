'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Shield, Mail, Lock, User, ArrowLeft, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const passwordRequirements = [
  { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
  { label: 'One uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'One lowercase letter', test: (p: string) => /[a-z]/.test(p) },
  { label: 'One number', test: (p: string) => /[0-9]/.test(p) },
  { label: 'One special character', test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

export default function SignupPage() {
  const router = useRouter();
  const { signUp, loading } = useAuthContext();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPasswordHints, setShowPasswordHints] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    } else if (name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else {
      const failedRequirements = passwordRequirements.filter((req) => !req.test(password));
      if (failedRequirements.length > 0) {
        newErrors.password = 'Password does not meet requirements';
      }
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const result = await signUp(email, password, name);

    if (result.success) {
      toast.success('Account created! Please check your email to verify.');
      router.push('/dashboard');
    } else {
      toast.error(result.error || 'Sign up failed');
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
              <CardTitle as="h1" className="text-2xl">Create Account</CardTitle>
              <CardDescription>Start securing your applications today</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                  type="text"
                  label="Full Name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  error={errors.name}
                  icon={<User className="w-5 h-5" />}
                  autoComplete="name"
                  disabled={loading}
                />

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
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setShowPasswordHints(true)}
                    error={errors.password}
                    icon={<Lock className="w-5 h-5" />}
                    autoComplete="new-password"
                    disabled={loading}
                  />
                  {showPasswordHints && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-3 space-y-1.5"
                    >
                      {passwordRequirements.map((req) => (
                        <div
                          key={req.label}
                          className={`flex items-center gap-2 text-xs ${
                            req.test(password) ? 'text-green-400' : 'text-dark-400'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {req.label}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </div>

                <Input
                  type="password"
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={errors.confirmPassword}
                  icon={<Lock className="w-5 h-5" />}
                  autoComplete="new-password"
                  disabled={loading}
                />

                <Button type="submit" className="w-full" loading={loading}>
                  Create Account
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-dark-400">
                  Already have an account?{' '}
                  <Link
                    href="/login"
                    className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
                  >
                    Sign in
                  </Link>
                </p>
              </div>

              <p className="mt-4 text-xs text-center text-dark-500">
                By creating an account, you agree to our{' '}
                <Link href="/terms" className="text-primary-400 hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-primary-400 hover:underline">
                  Privacy Policy
                </Link>
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
