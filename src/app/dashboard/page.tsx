'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { cn } from '@/utils/cn';
import {
  Scan,
  Shield,
  Clock,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  ExternalLink,
  Plus,
  FileText,
  Globe,
  Code2,
} from 'lucide-react';

// Mock data for demonstration
const mockScans = [
  {
    id: '1',
    type: 'url',
    target: 'https://example.com',
    status: 'completed',
    score: 85,
    grade: 'B',
    vulnerabilities: { critical: 0, high: 1, medium: 3, low: 5, info: 8 },
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: '2',
    type: 'code',
    target: 'auth-handler.js',
    status: 'completed',
    score: 72,
    grade: 'C',
    vulnerabilities: { critical: 1, high: 2, medium: 4, low: 3, info: 5 },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: '3',
    type: 'url',
    target: 'https://myapp.dev',
    status: 'completed',
    score: 95,
    grade: 'A',
    vulnerabilities: { critical: 0, high: 0, medium: 1, low: 2, info: 4 },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
];

const getGradeColor = (grade: string) => {
  switch (grade) {
    case 'A+':
    case 'A':
      return 'text-green-400';
    case 'B':
      return 'text-blue-400';
    case 'C':
      return 'text-yellow-400';
    case 'D':
      return 'text-orange-400';
    default:
      return 'text-red-400';
  }
};

const getScoreColor = (score: number) => {
  if (score >= 90) return 'text-green-400';
  if (score >= 70) return 'text-blue-400';
  if (score >= 50) return 'text-yellow-400';
  return 'text-red-400';
};

export default function DashboardPage() {
  const router = useRouter();
  const { user, userProfile, loading } = useAuthContext();
  const [scans, setScans] = useState(mockScans);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const totalVulnerabilities = scans.reduce(
    (acc, scan) => ({
      critical: acc.critical + scan.vulnerabilities.critical,
      high: acc.high + scan.vulnerabilities.high,
      medium: acc.medium + scan.vulnerabilities.medium,
      low: acc.low + scan.vulnerabilities.low,
      info: acc.info + scan.vulnerabilities.info,
    }),
    { critical: 0, high: 0, medium: 0, low: 0, info: 0 }
  );

  const averageScore = Math.round(
    scans.reduce((acc, scan) => acc + scan.score, 0) / scans.length
  );

  return (
    <div className="min-h-screen bg-dark-950">
      <Header />

      <main className="pt-24 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
          >
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-dark-50">
                Welcome back, {user.displayName || 'User'}
              </h1>
              <p className="text-dark-400 mt-1">
                Here&apos;s an overview of your security scans
              </p>
            </div>
            <Link href="/scan">
              <Button icon={<Plus className="w-5 h-5" />}>New Scan</Button>
            </Link>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          >
            <Card>
              <CardContent className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center">
                  <Scan className="w-6 h-6 text-primary-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-dark-50">{scans.length}</p>
                  <p className="text-sm text-dark-400">Total Scans</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <p className={cn('text-2xl font-bold', getScoreColor(averageScore))}>
                    {averageScore}
                  </p>
                  <p className="text-sm text-dark-400">Avg Score</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-400">
                    {totalVulnerabilities.critical + totalVulnerabilities.high}
                  </p>
                  <p className="text-sm text-dark-400">Critical/High</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-dark-50">
                    {userProfile?.scansRemaining ?? 3}
                  </p>
                  <p className="text-sm text-dark-400">Scans Left</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Scans */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Scans</CardTitle>
                <Link
                  href="/dashboard/scans"
                  className="text-sm text-primary-400 hover:text-primary-300 transition-colors"
                >
                  View all
                </Link>
              </CardHeader>
              <CardContent>
                {scans.length === 0 ? (
                  <div className="text-center py-12">
                    <Shield className="w-12 h-12 text-dark-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-dark-200 mb-2">
                      No scans yet
                    </h3>
                    <p className="text-dark-400 mb-6">
                      Start your first security scan to see results here
                    </p>
                    <Link href="/scan">
                      <Button>Start First Scan</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {scans.map((scan) => (
                      <Link
                        key={scan.id}
                        href={`/dashboard/scans/${scan.id}`}
                        className="block"
                      >
                        <div className="flex items-center justify-between p-4 rounded-xl bg-dark-800/30 hover:bg-dark-800/50 border border-dark-700/50 transition-all">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-dark-700/50 flex items-center justify-center">
                              {scan.type === 'url' ? (
                                <Globe className="w-5 h-5 text-primary-400" />
                              ) : (
                                <Code2 className="w-5 h-5 text-accent-400" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-dark-100">{scan.target}</p>
                              <div className="flex items-center gap-3 mt-1">
                                <span className="text-xs text-dark-500 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {new Date(scan.createdAt).toLocaleDateString()}
                                </span>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-dark-700 text-dark-300">
                                  {scan.type}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-6">
                            {/* Vulnerability summary */}
                            <div className="hidden sm:flex items-center gap-2">
                              {scan.vulnerabilities.critical > 0 && (
                                <span className="text-xs px-2 py-1 rounded bg-red-500/10 text-red-400">
                                  {scan.vulnerabilities.critical} Critical
                                </span>
                              )}
                              {scan.vulnerabilities.high > 0 && (
                                <span className="text-xs px-2 py-1 rounded bg-orange-500/10 text-orange-400">
                                  {scan.vulnerabilities.high} High
                                </span>
                              )}
                              {scan.vulnerabilities.critical === 0 && scan.vulnerabilities.high === 0 && (
                                <span className="text-xs px-2 py-1 rounded bg-green-500/10 text-green-400 flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" />
                                  No critical issues
                                </span>
                              )}
                            </div>

                            {/* Score */}
                            <div className="text-right">
                              <p className={cn('text-xl font-bold', getScoreColor(scan.score))}>
                                {scan.score}
                              </p>
                              <p className={cn('text-sm font-medium', getGradeColor(scan.grade))}>
                                Grade {scan.grade}
                              </p>
                            </div>

                            <ExternalLink className="w-4 h-4 text-dark-500" />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 grid sm:grid-cols-3 gap-4"
          >
            <Link href="/scan">
              <Card hover className="h-full">
                <CardContent className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center">
                    <Globe className="w-6 h-6 text-primary-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-dark-100">URL Scan</h3>
                    <p className="text-sm text-dark-400">Scan a website URL</p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/scan">
              <Card hover className="h-full">
                <CardContent className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent-500/10 flex items-center justify-center">
                    <Code2 className="w-6 h-6 text-accent-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-dark-100">Code Scan</h3>
                    <p className="text-sm text-dark-400">Paste code to analyze</p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard/scans">
              <Card hover className="h-full">
                <CardContent className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-dark-100">View Reports</h3>
                    <p className="text-sm text-dark-400">Browse all scan reports</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
