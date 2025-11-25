'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import {
  Shield,
  Scan,
  FileCode2,
  Globe,
  Zap,
  Lock,
  FileText,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Code2,
  AlertTriangle,
  Activity,
} from 'lucide-react';

const features = [
  {
    icon: Globe,
    title: 'URL Scanning',
    description: 'Scan any public website URL to detect security vulnerabilities in the client-side code, headers, and configurations.',
  },
  {
    icon: Code2,
    title: 'Code Analysis',
    description: 'Paste your source code directly for deep analysis. Supports HTML, JavaScript, TypeScript, and more.',
  },
  {
    icon: FileCode2,
    title: 'File Upload',
    description: 'Upload your code files for comprehensive scanning. Perfect for reviewing entire pages or components.',
  },
  {
    icon: Zap,
    title: 'AI-Powered Detection',
    description: 'Advanced AI analyzes your code contextually, understanding not just patterns but actual vulnerabilities.',
  },
  {
    icon: FileText,
    title: 'Detailed Reports',
    description: 'Get comprehensive reports with severity ratings, code locations, and actionable remediation steps.',
  },
  {
    icon: TrendingUp,
    title: 'Security Score',
    description: 'Track your security posture with our 0-100 scoring system and grade ratings from A+ to F.',
  },
];

const vulnerabilityTypes = [
  'Cross-Site Scripting (XSS)',
  'SQL Injection Patterns',
  'Exposed API Keys & Secrets',
  'Insecure Authentication',
  'Missing Security Headers',
  'Outdated Dependencies',
  'CSRF Vulnerabilities',
  'Insecure Data Storage',
];

const stats = [
  { value: '50K+', label: 'Scans Completed' },
  { value: '99.2%', label: 'Detection Accuracy' },
  { value: '< 30s', label: 'Average Scan Time' },
  { value: '24/7', label: 'Availability' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-dark-950">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-hero-pattern opacity-50" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-full text-primary-400 text-sm font-medium mb-6">
              <Shield className="w-4 h-4" />
              AI-Powered Security Scanner
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-dark-50 mb-6 leading-tight">
              Find Security Vulnerabilities
              <br />
              <span className="gradient-text">Before Hackers Do</span>
            </h1>

            <p className="text-lg sm:text-xl text-dark-300 max-w-3xl mx-auto mb-10">
              SmartScan uses advanced AI to analyze your web applications and detect
              security vulnerabilities. Get detailed reports with actionable fixes
              in seconds.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/scan">
                <Button size="lg" icon={<Scan className="w-5 h-5" />}>
                  Start Free Scan
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="secondary" size="lg" icon={<ArrowRight className="w-5 h-5" />} iconPosition="right">
                  Create Account
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Hero visual */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-16 relative"
          >
            <div className="relative mx-auto max-w-4xl">
              <Card className="overflow-hidden">
                <div className="bg-dark-800 px-4 py-3 flex items-center gap-2 border-b border-dark-700">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <span className="text-sm text-dark-400 ml-2">SmartScan Report</span>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-dark-100">Security Scan Results</h3>
                      <p className="text-sm text-dark-400">example.com</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-green-400">85</div>
                      <div className="text-sm text-dark-400">Security Score</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-5 gap-4 mb-6">
                    {[
                      { label: 'Critical', count: 0, color: 'bg-red-500' },
                      { label: 'High', count: 1, color: 'bg-orange-500' },
                      { label: 'Medium', count: 3, color: 'bg-yellow-500' },
                      { label: 'Low', count: 5, color: 'bg-blue-500' },
                      { label: 'Info', count: 8, color: 'bg-gray-500' },
                    ].map((item) => (
                      <div key={item.label} className="text-center">
                        <div className={`w-full h-2 ${item.color} rounded-full mb-2 opacity-80`} />
                        <div className="text-lg font-semibold text-dark-100">{item.count}</div>
                        <div className="text-xs text-dark-400">{item.label}</div>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-orange-400" />
                      <div>
                        <p className="text-sm font-medium text-dark-100">Missing Content Security Policy Header</p>
                        <p className="text-xs text-dark-400">Headers &bull; Line N/A</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-yellow-400" />
                      <div>
                        <p className="text-sm font-medium text-dark-100">jQuery 2.1.4 has known vulnerabilities</p>
                        <p className="text-xs text-dark-400">Dependencies &bull; CVE-2020-11022</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/20 via-accent-500/20 to-primary-500/20 rounded-2xl blur-xl -z-10" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-dark-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-3xl sm:text-4xl font-bold text-primary-400 mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-dark-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-dark-50 mb-4">
              Comprehensive Security Analysis
            </h2>
            <p className="text-lg text-dark-400 max-w-2xl mx-auto">
              Multiple ways to scan your code with AI-powered analysis that understands context
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card hover className="h-full">
                  <CardContent>
                    <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-primary-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-dark-100 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-dark-400 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Detect Section */}
      <section className="py-20 px-4 bg-dark-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-dark-50 mb-6">
                Detect Vulnerabilities
                <br />
                <span className="text-primary-400">Before They&apos;re Exploited</span>
              </h2>
              <p className="text-lg text-dark-400 mb-8">
                Our AI-powered scanner detects a wide range of security vulnerabilities
                across your web applications, giving you actionable insights to fix them.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {vulnerabilityTypes.map((type) => (
                  <div key={type} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-dark-200 text-sm">{type}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <Card>
                <CardContent className="p-0">
                  <div className="p-6 border-b border-dark-700">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-dark-100">XSS Vulnerability Detected</h4>
                        <p className="text-sm text-red-400">Critical Severity</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <p className="text-sm text-dark-400 mb-2">Vulnerable Code:</p>
                      <pre className="bg-dark-800 rounded-lg p-4 text-sm overflow-x-auto">
                        <code className="text-red-400">
                          {`element.innerHTML = userInput;`}
                        </code>
                      </pre>
                    </div>
                    <div>
                      <p className="text-sm text-dark-400 mb-2">Fixed Code:</p>
                      <pre className="bg-dark-800 rounded-lg p-4 text-sm overflow-x-auto">
                        <code className="text-green-400">
                          {`element.textContent = userInput;`}
                        </code>
                      </pre>
                    </div>
                    <div className="pt-4 border-t border-dark-700">
                      <p className="text-sm text-dark-300">
                        <strong>Impact:</strong> Attackers could inject malicious scripts
                        that execute in users&apos; browsers, stealing sensitive data.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-500/10 mb-6">
              <Activity className="w-8 h-8 text-primary-400" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-dark-50 mb-4">
              Ready to Secure Your Application?
            </h2>
            <p className="text-lg text-dark-400 mb-8">
              Start scanning for free. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/scan">
                <Button size="lg" icon={<Lock className="w-5 h-5" />}>
                  Start Free Scan
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="outline" size="lg">
                  Create Free Account
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
