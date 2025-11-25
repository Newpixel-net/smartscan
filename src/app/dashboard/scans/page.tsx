'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { cn } from '@/utils/cn';
import {
  Search,
  Plus,
  Shield,
  Clock,
  Globe,
  Code2,
  FileUp,
  ExternalLink,
  Filter,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

// Mock data
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
  {
    id: '4',
    type: 'file',
    target: 'components/Login.tsx',
    status: 'completed',
    score: 88,
    grade: 'B',
    vulnerabilities: { critical: 0, high: 0, medium: 2, low: 4, info: 6 },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
  },
  {
    id: '5',
    type: 'code',
    target: 'api-routes.js',
    status: 'completed',
    score: 45,
    grade: 'D',
    vulnerabilities: { critical: 2, high: 4, medium: 6, low: 3, info: 2 },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72),
  },
];

type ScanType = 'all' | 'url' | 'code' | 'file';

const typeIcons = {
  url: Globe,
  code: Code2,
  file: FileUp,
};

export default function ScansPage() {
  const router = useRouter();
  const { user, loading } = useAuthContext();
  const [scans, setScans] = useState(mockScans);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<ScanType>('all');

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

  const filteredScans = scans.filter((scan) => {
    const matchesSearch = scan.target.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || scan.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 70) return 'text-blue-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getGradeColor = (grade: string) => {
    if (grade === 'A+' || grade === 'A') return 'text-green-400';
    if (grade === 'B') return 'text-blue-400';
    if (grade === 'C') return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-dark-950">
      <Header />

      <main className="pt-24 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
          >
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-dark-50">
                All Scans
              </h1>
              <p className="text-dark-400 mt-1">
                View and manage all your security scans
              </p>
            </div>
            <Link href="/scan">
              <Button icon={<Plus className="w-5 h-5" />}>New Scan</Button>
            </Link>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col sm:flex-row gap-4 mb-6"
          >
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search scans..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search className="w-5 h-5" />}
              />
            </div>
            <div className="flex gap-2">
              {(['all', 'url', 'code', 'file'] as ScanType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setTypeFilter(type)}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                    typeFilter === type
                      ? 'bg-primary-500/10 text-primary-400 border border-primary-500/30'
                      : 'bg-dark-800/50 text-dark-400 hover:text-dark-200 border border-dark-700'
                  )}
                >
                  {type === 'all' ? (
                    <span className="flex items-center gap-2">
                      <Filter className="w-4 h-4" />
                      All
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      {type === 'url' && <Globe className="w-4 h-4" />}
                      {type === 'code' && <Code2 className="w-4 h-4" />}
                      {type === 'file' && <FileUp className="w-4 h-4" />}
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Scans List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardContent className="p-0">
                {filteredScans.length === 0 ? (
                  <div className="text-center py-16">
                    <Shield className="w-12 h-12 text-dark-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-dark-200 mb-2">
                      No scans found
                    </h3>
                    <p className="text-dark-400 mb-6">
                      {searchQuery || typeFilter !== 'all'
                        ? 'Try adjusting your search or filters'
                        : 'Start your first security scan'}
                    </p>
                    {!searchQuery && typeFilter === 'all' && (
                      <Link href="/scan">
                        <Button>Start First Scan</Button>
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="divide-y divide-dark-700/50">
                    {filteredScans.map((scan, index) => {
                      const TypeIcon = typeIcons[scan.type as keyof typeof typeIcons];
                      return (
                        <Link
                          key={scan.id}
                          href={`/dashboard/scans/${scan.id}`}
                          className="block"
                        >
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-center justify-between p-4 hover:bg-dark-800/30 transition-colors"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-lg bg-dark-700/50 flex items-center justify-center">
                                <TypeIcon className="w-5 h-5 text-primary-400" />
                              </div>
                              <div>
                                <p className="font-medium text-dark-100">{scan.target}</p>
                                <div className="flex items-center gap-3 mt-1">
                                  <span className="text-xs text-dark-500 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {new Date(scan.createdAt).toLocaleDateString()} at{' '}
                                    {new Date(scan.createdAt).toLocaleTimeString([], {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}
                                  </span>
                                  <span className="text-xs px-2 py-0.5 rounded-full bg-dark-700 text-dark-300 capitalize">
                                    {scan.type}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-6">
                              {/* Vulnerability counts */}
                              <div className="hidden md:flex items-center gap-2">
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
                                {scan.vulnerabilities.critical === 0 &&
                                  scan.vulnerabilities.high === 0 && (
                                    <span className="text-xs px-2 py-1 rounded bg-green-500/10 text-green-400 flex items-center gap-1">
                                      <CheckCircle2 className="w-3 h-3" />
                                      Secure
                                    </span>
                                  )}
                              </div>

                              {/* Score */}
                              <div className="text-right min-w-[60px]">
                                <p className={cn('text-xl font-bold', getScoreColor(scan.score))}>
                                  {scan.score}
                                </p>
                                <p className={cn('text-xs font-medium', getGradeColor(scan.grade))}>
                                  Grade {scan.grade}
                                </p>
                              </div>

                              <ExternalLink className="w-4 h-4 text-dark-500" />
                            </div>
                          </motion.div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
