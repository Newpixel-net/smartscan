# SmartScan - AI-Powered Security Vulnerability Scanner

SmartScan is a modern web application that uses AI-powered analysis to detect security vulnerabilities in web applications. It provides detailed reports with actionable remediation steps.

## Features

- **URL Scanning**: Scan any public website URL to detect security vulnerabilities
- **Code Analysis**: Paste source code directly for deep vulnerability analysis
- **File Upload**: Upload code files for comprehensive scanning
- **AI-Powered Detection**: Advanced pattern matching and AI analysis for accurate detection
- **Detailed Reports**: Comprehensive reports with severity ratings and fix recommendations
- **Security Score**: 0-100 scoring system with letter grades (A+ to F)
- **Export Options**: Export reports as JSON (PDF coming soon)

## Security Features

This application is built with security as a top priority:

- **Strong Content Security Policy (CSP)** headers
- **HTTPS enforcement** with HSTS
- **XSS protection** through input sanitization
- **CSRF protection** tokens
- **Rate limiting** on API endpoints
- **Input validation** using Zod schemas
- **Secure authentication** with Firebase Auth
- **SSRF protection** blocking localhost and private IPs

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Firebase project

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/smartscan.git
   cd smartscan
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Then fill in your Firebase configuration in `.env.local`

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin (Server-side)
FIREBASE_ADMIN_PROJECT_ID=your_project_id
FIREBASE_ADMIN_CLIENT_EMAIL=your_service_account_email
FIREBASE_ADMIN_PRIVATE_KEY="your_private_key"

# AI Configuration (optional)
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
```

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   └── scan/              # Scanner page
├── components/            # React components
│   ├── auth/              # Authentication components
│   ├── layout/            # Layout components
│   ├── ui/                # UI components
│   └── scanner/           # Scanner components
├── hooks/                 # Custom React hooks
├── lib/                   # Library code
│   ├── firebase.ts        # Firebase client config
│   ├── firebase-admin.ts  # Firebase admin config
│   ├── ai-analyzer.ts     # AI analysis engine
│   └── vulnerability-patterns.ts
├── types/                 # TypeScript types
└── utils/                 # Utility functions
    ├── cn.ts              # Class name utility
    └── security.ts        # Security utilities
```

## Vulnerability Detection

SmartScan detects a wide range of security vulnerabilities including:

- **XSS (Cross-Site Scripting)**: innerHTML, document.write, eval()
- **Injection**: SQL injection, Command injection
- **Data Exposure**: Hardcoded API keys, passwords, AWS keys
- **Authentication Issues**: Weak JWT secrets, missing auth checks
- **Cryptography**: Weak hashing (MD5, SHA1), insecure random
- **Configuration**: CORS wildcards, debug mode enabled
- **CSRF**: Missing CSRF tokens in forms
- **And more...**

## API Endpoints

### POST /api/scan
Start a new security scan

**Request Body:**
```json
{
  "type": "url" | "code" | "file",
  "url": "https://example.com",
  "code": "// your code here",
  "language": "javascript",
  "fileName": "app.js"
}
```

### GET /api/scan?id={scanId}
Get scan results

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Security

If you discover a security vulnerability, please email security@smartscan.io instead of using the issue tracker.

## Acknowledgments

- OWASP for vulnerability classifications
- CWE for weakness enumeration
- The security research community
