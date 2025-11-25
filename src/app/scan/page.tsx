'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { cn } from '@/utils/cn';
import { useAuthContext } from '@/components/auth/AuthProvider';
import {
  Globe,
  Code2,
  FileUp,
  Scan,
  AlertCircle,
  Shield,
  Loader2,
} from 'lucide-react';
import toast from 'react-hot-toast';

type ScanMode = 'url' | 'code' | 'file';

const scanModes = [
  {
    id: 'url' as ScanMode,
    icon: Globe,
    title: 'URL Scan',
    description: 'Scan a public website URL',
  },
  {
    id: 'code' as ScanMode,
    icon: Code2,
    title: 'Code Paste',
    description: 'Paste your source code',
  },
  {
    id: 'file' as ScanMode,
    icon: FileUp,
    title: 'File Upload',
    description: 'Upload code files',
  },
];

const supportedLanguages = [
  { value: 'html', label: 'HTML' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'jsx', label: 'JSX/React' },
  { value: 'vue', label: 'Vue' },
  { value: 'php', label: 'PHP' },
  { value: 'python', label: 'Python' },
];

export default function ScanPage() {
  const router = useRouter();
  const { user } = useAuthContext();
  const [mode, setMode] = useState<ScanMode>('url');
  const [url, setUrl] = useState('');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [file, setFile] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file size (max 1MB)
      if (selectedFile.size > 1024 * 1024) {
        toast.error('File size must be less than 1MB');
        return;
      }
      // Validate file type
      const allowedTypes = ['.html', '.htm', '.js', '.jsx', '.ts', '.tsx', '.vue', '.php', '.py'];
      const ext = selectedFile.name.toLowerCase().slice(selectedFile.name.lastIndexOf('.'));
      if (!allowedTypes.includes(ext)) {
        toast.error('Unsupported file type');
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  };

  const validateInput = (): boolean => {
    setError('');

    if (mode === 'url') {
      if (!url) {
        setError('Please enter a URL');
        return false;
      }
      try {
        const parsed = new URL(url);
        if (!['http:', 'https:'].includes(parsed.protocol)) {
          setError('URL must use HTTP or HTTPS protocol');
          return false;
        }
        // Block localhost/private IPs
        const hostname = parsed.hostname.toLowerCase();
        if (hostname === 'localhost' || hostname.startsWith('127.') || hostname.startsWith('192.168.')) {
          setError('Cannot scan localhost or private addresses');
          return false;
        }
      } catch {
        setError('Invalid URL format');
        return false;
      }
    }

    if (mode === 'code') {
      if (!code.trim()) {
        setError('Please enter some code to scan');
        return false;
      }
      if (code.length > 500000) {
        setError('Code is too large (max 500KB)');
        return false;
      }
    }

    if (mode === 'file') {
      if (!file) {
        setError('Please select a file to upload');
        return false;
      }
    }

    return true;
  };

  const handleScan = async () => {
    if (!validateInput()) return;

    setIsScanning(true);

    try {
      let scanData: Record<string, unknown> = { type: mode };

      if (mode === 'url') {
        scanData.url = url;
      } else if (mode === 'code') {
        scanData.code = code;
        scanData.language = language;
      } else if (mode === 'file' && file) {
        const content = await file.text();
        scanData.code = content;
        scanData.fileName = file.name;
        scanData.language = language;
      }

      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scanData),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Scan completed!');
        router.push(`/dashboard/scans/${result.data.scanId}`);
      } else {
        toast.error(result.error?.message || 'Scan failed');
        setError(result.error?.message || 'Scan failed');
      }
    } catch (err) {
      console.error('Scan error:', err);
      toast.error('An error occurred while scanning');
      setError('An error occurred while scanning');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950">
      <Header />

      <main className="pt-24 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-500/10 mb-6">
              <Shield className="w-8 h-8 text-primary-400" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-dark-50 mb-4">
              Security Vulnerability Scanner
            </h1>
            <p className="text-lg text-dark-400 max-w-2xl mx-auto">
              Choose how you want to scan your code. Our AI will analyze it for security
              vulnerabilities and provide detailed remediation steps.
            </p>
          </motion.div>

          {/* Scan Mode Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-3 gap-4 mb-8"
          >
            {scanModes.map((scanMode) => (
              <button
                key={scanMode.id}
                onClick={() => {
                  setMode(scanMode.id);
                  setError('');
                }}
                disabled={isScanning}
                className={cn(
                  'p-4 rounded-xl border-2 transition-all duration-300 text-left',
                  mode === scanMode.id
                    ? 'bg-primary-500/10 border-primary-500 text-primary-400'
                    : 'bg-dark-900/50 border-dark-700 text-dark-400 hover:border-dark-600'
                )}
              >
                <scanMode.icon className="w-6 h-6 mb-2" />
                <h3 className="font-semibold text-dark-100 text-sm sm:text-base">
                  {scanMode.title}
                </h3>
                <p className="text-xs text-dark-400 hidden sm:block">
                  {scanMode.description}
                </p>
              </button>
            ))}
          </motion.div>

          {/* Scan Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>
                  {mode === 'url' && 'Enter Website URL'}
                  {mode === 'code' && 'Paste Your Code'}
                  {mode === 'file' && 'Upload File'}
                </CardTitle>
                <CardDescription>
                  {mode === 'url' && 'Enter the full URL of the website you want to scan'}
                  {mode === 'code' && 'Paste the source code you want to analyze'}
                  {mode === 'file' && 'Select a code file to upload and scan'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AnimatePresence mode="wait">
                  {/* URL Input */}
                  {mode === 'url' && (
                    <motion.div
                      key="url"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                    >
                      <Input
                        type="url"
                        placeholder="https://example.com"
                        value={url}
                        onChange={(e) => {
                          setUrl(e.target.value);
                          setError('');
                        }}
                        icon={<Globe className="w-5 h-5" />}
                        disabled={isScanning}
                        error={error}
                      />
                      <p className="mt-3 text-sm text-dark-500">
                        We&apos;ll analyze the HTML, JavaScript, and security headers of this URL.
                      </p>
                    </motion.div>
                  )}

                  {/* Code Input */}
                  {mode === 'code' && (
                    <motion.div
                      key="code"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-medium text-dark-200 mb-2">
                          Language
                        </label>
                        <select
                          value={language}
                          onChange={(e) => setLanguage(e.target.value)}
                          disabled={isScanning}
                          className="w-full bg-dark-800/50 border border-dark-600 rounded-xl px-4 py-3 text-dark-100 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500"
                        >
                          {supportedLanguages.map((lang) => (
                            <option key={lang.value} value={lang.value}>
                              {lang.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-dark-200 mb-2">
                          Source Code
                        </label>
                        <textarea
                          value={code}
                          onChange={(e) => {
                            setCode(e.target.value);
                            setError('');
                          }}
                          placeholder="Paste your code here..."
                          disabled={isScanning}
                          rows={12}
                          className={cn(
                            'w-full bg-dark-800/50 border rounded-xl px-4 py-3 text-dark-100 font-mono text-sm',
                            'placeholder-dark-500 resize-none',
                            'focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500',
                            error ? 'border-red-500' : 'border-dark-600'
                          )}
                        />
                        {error && (
                          <p className="mt-2 text-sm text-red-400 flex items-center gap-1.5">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* File Upload */}
                  {mode === 'file' && (
                    <motion.div
                      key="file"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-medium text-dark-200 mb-2">
                          Language
                        </label>
                        <select
                          value={language}
                          onChange={(e) => setLanguage(e.target.value)}
                          disabled={isScanning}
                          className="w-full bg-dark-800/50 border border-dark-600 rounded-xl px-4 py-3 text-dark-100 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500"
                        >
                          {supportedLanguages.map((lang) => (
                            <option key={lang.value} value={lang.value}>
                              {lang.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div
                        className={cn(
                          'border-2 border-dashed rounded-xl p-8 text-center transition-colors',
                          file ? 'border-primary-500 bg-primary-500/5' : 'border-dark-600 hover:border-dark-500',
                          error && 'border-red-500'
                        )}
                      >
                        <input
                          type="file"
                          onChange={handleFileChange}
                          accept=".html,.htm,.js,.jsx,.ts,.tsx,.vue,.php,.py"
                          disabled={isScanning}
                          className="hidden"
                          id="file-upload"
                        />
                        <label htmlFor="file-upload" className="cursor-pointer">
                          <FileUp className={cn('w-10 h-10 mx-auto mb-4', file ? 'text-primary-400' : 'text-dark-500')} />
                          {file ? (
                            <div>
                              <p className="text-dark-100 font-medium">{file.name}</p>
                              <p className="text-sm text-dark-400 mt-1">
                                {(file.size / 1024).toFixed(1)} KB
                              </p>
                            </div>
                          ) : (
                            <div>
                              <p className="text-dark-300">
                                Click to upload or drag and drop
                              </p>
                              <p className="text-sm text-dark-500 mt-1">
                                HTML, JS, TS, JSX, Vue, PHP, Python (max 1MB)
                              </p>
                            </div>
                          )}
                        </label>
                      </div>
                      {error && (
                        <p className="text-sm text-red-400 flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4" />
                          {error}
                        </p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Scan Button */}
                <div className="mt-8">
                  <Button
                    onClick={handleScan}
                    disabled={isScanning}
                    className="w-full"
                    size="lg"
                    icon={isScanning ? <Loader2 className="w-5 h-5 animate-spin" /> : <Scan className="w-5 h-5" />}
                  >
                    {isScanning ? 'Scanning...' : 'Start Security Scan'}
                  </Button>
                </div>

                {/* Guest notice */}
                {!user && (
                  <p className="mt-4 text-center text-sm text-dark-500">
                    <a href="/signup" className="text-primary-400 hover:underline">
                      Create an account
                    </a>{' '}
                    to save your scan history and get more scans per month.
                  </p>
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
