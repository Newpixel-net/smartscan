'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { cn } from '@/utils/cn';
import { ScanReport, Vulnerability, VulnerabilitySeverity } from '@/types';
import {
  ArrowLeft,
  Download,
  Shield,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Code2,
  FileText,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
} from 'lucide-react';
import toast from 'react-hot-toast';

const severityConfig: Record<VulnerabilitySeverity, { color: string; bg: string; label: string }> = {
  critical: { color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30', label: 'Critical' },
  high: { color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/30', label: 'High' },
  medium: { color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/30', label: 'Medium' },
  low: { color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30', label: 'Low' },
  info: { color: 'text-gray-400', bg: 'bg-gray-500/10 border-gray-500/30', label: 'Info' },
};

function VulnerabilityCard({ vulnerability }: { vulnerability: Vulnerability }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const config = severityConfig[vulnerability.severity];

  const copyFix = () => {
    if (vulnerability.codeExample?.fixed) {
      navigator.clipboard.writeText(vulnerability.codeExample.fixed);
      setCopied(true);
      toast.success('Fixed code copied!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('border rounded-xl overflow-hidden', config.bg)}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-start justify-between text-left"
      >
        <div className="flex items-start gap-3">
          <AlertTriangle className={cn('w-5 h-5 mt-0.5', config.color)} />
          <div>
            <h3 className="font-medium text-dark-100">{vulnerability.title}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={cn('text-xs px-2 py-0.5 rounded-full', config.bg, config.color)}>
                {config.label}
              </span>
              {vulnerability.location.file && (
                <span className="text-xs text-dark-400">
                  {vulnerability.location.file}
                  {vulnerability.location.line && `:${vulnerability.location.line}`}
                </span>
              )}
              {vulnerability.cwe && (
                <span className="text-xs text-dark-500">{vulnerability.cwe}</span>
              )}
            </div>
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-dark-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-dark-400" />
        )}
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-dark-700/50 pt-4">
          <div>
            <h4 className="text-sm font-medium text-dark-200 mb-2">Description</h4>
            <p className="text-sm text-dark-400">{vulnerability.description}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-dark-200 mb-2">Impact</h4>
            <p className="text-sm text-dark-400">{vulnerability.impact}</p>
          </div>

          {vulnerability.location.snippet && (
            <div>
              <h4 className="text-sm font-medium text-dark-200 mb-2">Vulnerable Code</h4>
              <pre className="bg-dark-900 rounded-lg p-4 text-xs overflow-x-auto font-mono">
                <code className="text-red-300">{vulnerability.location.snippet}</code>
              </pre>
            </div>
          )}

          <div>
            <h4 className="text-sm font-medium text-dark-200 mb-2">Remediation</h4>
            <p className="text-sm text-dark-400">{vulnerability.remediation}</p>
          </div>

          {vulnerability.codeExample && (
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-dark-200 mb-2">Vulnerable</h4>
                <pre className="bg-dark-900 rounded-lg p-4 text-xs overflow-x-auto font-mono">
                  <code className="text-red-300">{vulnerability.codeExample.vulnerable}</code>
                </pre>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-dark-200">Fixed</h4>
                  <button
                    onClick={copyFix}
                    className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1"
                  >
                    {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <pre className="bg-dark-900 rounded-lg p-4 text-xs overflow-x-auto font-mono">
                  <code className="text-green-300">{vulnerability.codeExample.fixed}</code>
                </pre>
              </div>
            </div>
          )}

          {vulnerability.references.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-dark-200 mb-2">References</h4>
              <ul className="space-y-1">
                {vulnerability.references.map((ref, index) => (
                  <li key={index}>
                    <a
                      href={ref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      {ref.length > 60 ? `${ref.substring(0, 60)}...` : ref}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}

export default function ScanReportPage() {
  const params = useParams();
  const router = useRouter();
  const scanId = params.scanId as string;
  const [report, setReport] = useState<ScanReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<VulnerabilitySeverity | 'all'>('all');

  useEffect(() => {
    async function fetchReport() {
      try {
        const response = await fetch(`/api/scan?id=${scanId}`);
        const result = await response.json();

        if (result.success) {
          setReport(result.data.report);
        } else {
          toast.error('Failed to load scan report');
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('Error fetching report:', error);
        toast.error('Failed to load scan report');
      } finally {
        setLoading(false);
      }
    }

    fetchReport();
  }, [scanId, router]);

  const exportReport = (format: 'json' | 'pdf') => {
    if (!report) return;

    if (format === 'json') {
      const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `smartscan-report-${scanId}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Report exported as JSON');
    } else {
      toast.error('PDF export coming soon!');
    }
  };

  const filteredVulnerabilities = report?.vulnerabilities.filter(
    (v) => activeFilter === 'all' || v.severity === activeFilter
  ) || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-dark-400">Loading report...</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-dark-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-dark-200 mb-2">Report Not Found</h2>
          <p className="text-dark-400 mb-6">The scan report could not be found.</p>
          <Link href="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 text-dark-400 hover:text-dark-200 transition-colors mb-4"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Link>
              <h1 className="text-2xl sm:text-3xl font-bold text-dark-50">
                Security Scan Report
              </h1>
              <p className="text-dark-400 mt-1">
                {report.scannedResources.url || report.scannedResources.files[0] || 'Code Analysis'}
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                icon={<Download className="w-4 h-4" />}
                onClick={() => exportReport('json')}
              >
                Export JSON
              </Button>
              <Button
                icon={<FileText className="w-4 h-4" />}
                onClick={() => exportReport('pdf')}
              >
                Export PDF
              </Button>
            </div>
          </div>

          {/* Score Overview */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Main Score */}
            <Card className="md:col-span-1">
              <CardContent className="text-center py-8">
                <div className="relative inline-block">
                  <div className={cn('text-6xl font-bold', getScoreColor(report.score.overall))}>
                    {report.score.overall}
                  </div>
                  <div className={cn('text-2xl font-semibold mt-2', getGradeColor(report.score.grade))}>
                    Grade {report.score.grade}
                  </div>
                </div>
                <p className="text-dark-400 mt-4">Security Score</p>
              </CardContent>
            </Card>

            {/* Vulnerability Summary */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Vulnerability Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-4">
                  {(Object.entries(report.summary) as [string, number][])
                    .filter(([key]) => key !== 'total')
                    .map(([severity, count]) => (
                      <button
                        key={severity}
                        onClick={() => setActiveFilter(severity as VulnerabilitySeverity)}
                        className={cn(
                          'p-4 rounded-xl text-center transition-all',
                          activeFilter === severity
                            ? severityConfig[severity as VulnerabilitySeverity].bg + ' ring-2 ring-offset-2 ring-offset-dark-900'
                            : 'bg-dark-800/30 hover:bg-dark-800/50'
                        )}
                      >
                        <div className={cn('text-2xl font-bold', severityConfig[severity as VulnerabilitySeverity].color)}>
                          {count}
                        </div>
                        <div className="text-xs text-dark-400 mt-1 capitalize">{severity}</div>
                      </button>
                    ))}
                </div>
                <button
                  onClick={() => setActiveFilter('all')}
                  className={cn(
                    'mt-4 w-full py-2 rounded-lg text-sm transition-colors',
                    activeFilter === 'all'
                      ? 'bg-primary-500/10 text-primary-400'
                      : 'text-dark-400 hover:text-dark-200'
                  )}
                >
                  Show All ({report.summary.total})
                </button>
              </CardContent>
            </Card>
          </div>

          {/* Vulnerabilities List */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  Vulnerabilities
                  {activeFilter !== 'all' && (
                    <span className="ml-2 text-sm font-normal text-dark-400">
                      (Showing {activeFilter} only)
                    </span>
                  )}
                </CardTitle>
                <span className="text-sm text-dark-400">
                  {filteredVulnerabilities.length} issues
                </span>
              </div>
            </CardHeader>
            <CardContent>
              {filteredVulnerabilities.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-dark-200 mb-2">
                    {activeFilter === 'all' ? 'No vulnerabilities found!' : `No ${activeFilter} vulnerabilities`}
                  </h3>
                  <p className="text-dark-400">
                    {activeFilter === 'all'
                      ? 'Great job! Your code passed all security checks.'
                      : 'Try selecting a different severity level.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredVulnerabilities.map((vuln) => (
                    <VulnerabilityCard key={vuln.id} vulnerability={vuln} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recommendations */}
          {report.recommendations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {report.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary-400 mt-0.5 flex-shrink-0" />
                      <span className="text-dark-300">{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
