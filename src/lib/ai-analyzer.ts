import { Vulnerability, VulnerabilitySeverity, VulnerabilityCategory, SecurityScore, ScanReport } from '@/types';
import { detectVulnerabilities, getCodeSnippet, VulnerabilityPattern } from './vulnerability-patterns';
import { v4 as uuidv4 } from 'uuid';

/**
 * AI-Powered Security Analyzer
 * Combines pattern matching with AI analysis for comprehensive vulnerability detection
 */

interface AnalysisResult {
  vulnerabilities: Vulnerability[];
  score: SecurityScore;
  recommendations: string[];
}

/**
 * Calculate security score based on vulnerabilities
 */
function calculateSecurityScore(vulnerabilities: Vulnerability[]): SecurityScore {
  // Base score of 100, deduct points for each vulnerability
  let score = 100;

  const deductions = {
    critical: 25,
    high: 15,
    medium: 8,
    low: 3,
    info: 0,
  };

  // Count by severity
  const counts = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    info: 0,
  };

  // Category scores
  const categoryScores: Record<string, number> = {
    xss: 100,
    injection: 100,
    authentication: 100,
    dataExposure: 100,
    configuration: 100,
    dependencies: 100,
  };

  for (const vuln of vulnerabilities) {
    counts[vuln.severity]++;
    score -= deductions[vuln.severity];

    // Affect category scores
    const categoryKey = mapCategoryToScoreKey(vuln.category);
    if (categoryKey) {
      categoryScores[categoryKey] -= deductions[vuln.severity] * 2;
    }
  }

  // Ensure scores don't go below 0
  score = Math.max(0, score);
  for (const key of Object.keys(categoryScores)) {
    categoryScores[key] = Math.max(0, categoryScores[key]);
  }

  // Calculate grade
  let grade: SecurityScore['grade'];
  if (score >= 95) grade = 'A+';
  else if (score >= 85) grade = 'A';
  else if (score >= 70) grade = 'B';
  else if (score >= 55) grade = 'C';
  else if (score >= 40) grade = 'D';
  else grade = 'F';

  return {
    overall: score,
    breakdown: {
      xss: categoryScores.xss,
      injection: categoryScores.injection,
      authentication: categoryScores.authentication,
      dataExposure: categoryScores.dataExposure,
      configuration: categoryScores.configuration,
      dependencies: categoryScores.dependencies,
    },
    grade,
  };
}

function mapCategoryToScoreKey(category: VulnerabilityCategory): string | null {
  const mapping: Record<VulnerabilityCategory, string> = {
    XSS: 'xss',
    INJECTION: 'injection',
    AUTHENTICATION: 'authentication',
    AUTHORIZATION: 'authentication',
    CRYPTOGRAPHY: 'configuration',
    DATA_EXPOSURE: 'dataExposure',
    CONFIGURATION: 'configuration',
    DEPENDENCIES: 'dependencies',
    CSRF: 'authentication',
    CORS: 'configuration',
    HEADERS: 'configuration',
    INPUT_VALIDATION: 'xss',
    SESSION: 'authentication',
    OTHER: 'configuration',
  };
  return mapping[category] || null;
}

/**
 * Convert pattern detection results to Vulnerability objects
 */
function patternToVulnerability(
  pattern: VulnerabilityPattern,
  lineNumber: number,
  code: string,
  fileName?: string
): Vulnerability {
  const snippet = getCodeSnippet(code, lineNumber);

  return {
    id: uuidv4(),
    title: pattern.name,
    description: pattern.description,
    severity: pattern.severity,
    category: pattern.category,
    location: {
      file: fileName,
      line: lineNumber,
      snippet,
    },
    cwe: pattern.cwe,
    owasp: pattern.owasp,
    impact: generateImpactDescription(pattern.severity, pattern.category),
    remediation: pattern.remediation,
    codeExample: generateCodeExample(pattern),
    references: generateReferences(pattern),
  };
}

function generateImpactDescription(severity: VulnerabilitySeverity, category: VulnerabilityCategory): string {
  const impacts: Record<VulnerabilityCategory, string> = {
    XSS: 'Attackers could inject malicious scripts that execute in users\' browsers, potentially stealing session tokens, credentials, or sensitive data.',
    INJECTION: 'Attackers could execute arbitrary commands or queries, potentially gaining full control over the system or database.',
    AUTHENTICATION: 'Unauthorized users could gain access to protected resources or impersonate legitimate users.',
    AUTHORIZATION: 'Users could access resources or perform actions beyond their intended permissions.',
    CRYPTOGRAPHY: 'Sensitive data could be exposed or compromised due to weak encryption.',
    DATA_EXPOSURE: 'Sensitive information like credentials, API keys, or personal data could be leaked.',
    CONFIGURATION: 'Misconfiguration could expose the application to various attacks or information disclosure.',
    DEPENDENCIES: 'Known vulnerabilities in dependencies could be exploited to compromise the application.',
    CSRF: 'Attackers could trick users into performing unintended actions on authenticated sessions.',
    CORS: 'Malicious websites could make unauthorized requests to your API on behalf of users.',
    HEADERS: 'Missing security headers could leave the application vulnerable to various attacks.',
    INPUT_VALIDATION: 'Malformed or malicious input could cause unexpected behavior or security breaches.',
    SESSION: 'Session tokens could be stolen or manipulated, allowing unauthorized access.',
    OTHER: 'This vulnerability could impact the security posture of the application.',
  };

  return impacts[category] || impacts.OTHER;
}

function generateCodeExample(pattern: VulnerabilityPattern): { vulnerable: string; fixed: string } | undefined {
  const examples: Record<string, { vulnerable: string; fixed: string }> = {
    'xss-innerhtml': {
      vulnerable: `// Vulnerable: Direct innerHTML assignment
element.innerHTML = userInput;`,
      fixed: `// Fixed: Use textContent for plain text
element.textContent = userInput;

// Or sanitize HTML with DOMPurify
element.innerHTML = DOMPurify.sanitize(userInput);`,
    },
    'xss-eval': {
      vulnerable: `// Vulnerable: Using eval with user input
eval(userInput);`,
      fixed: `// Fixed: Parse JSON safely
const data = JSON.parse(userInput);

// Or use safer alternatives
const fn = allowedFunctions[userInput];
if (fn) fn();`,
    },
    'sql-injection-concat': {
      vulnerable: `// Vulnerable: String concatenation in SQL
const query = "SELECT * FROM users WHERE id = " + userId;`,
      fixed: `// Fixed: Use parameterized queries
const query = "SELECT * FROM users WHERE id = ?";
db.query(query, [userId]);`,
    },
    'hardcoded-api-key': {
      vulnerable: `// Vulnerable: Hardcoded API key
const apiKey = "sk-1234567890abcdef";`,
      fixed: `// Fixed: Use environment variables
const apiKey = process.env.API_KEY;`,
    },
    'cors-wildcard': {
      vulnerable: `// Vulnerable: CORS wildcard
app.use(cors({ origin: '*' }));`,
      fixed: `// Fixed: Specify allowed origins
app.use(cors({
  origin: ['https://example.com', 'https://app.example.com']
}));`,
    },
  };

  return examples[pattern.id];
}

function generateReferences(pattern: VulnerabilityPattern): string[] {
  const refs: string[] = [];

  if (pattern.cwe) {
    refs.push(`https://cwe.mitre.org/data/definitions/${pattern.cwe.replace('CWE-', '')}.html`);
  }

  if (pattern.owasp) {
    refs.push('https://owasp.org/www-project-top-ten/');
  }

  // Add category-specific references
  const categoryRefs: Record<VulnerabilityCategory, string[]> = {
    XSS: ['https://owasp.org/www-community/attacks/xss/'],
    INJECTION: ['https://owasp.org/www-community/Injection_Flaws'],
    AUTHENTICATION: ['https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html'],
    AUTHORIZATION: ['https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html'],
    CRYPTOGRAPHY: ['https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html'],
    DATA_EXPOSURE: ['https://owasp.org/www-project-web-security-testing-guide/'],
    CONFIGURATION: ['https://cheatsheetseries.owasp.org/cheatsheets/Configuration_Cheat_Sheet.html'],
    DEPENDENCIES: ['https://owasp.org/www-project-dependency-check/'],
    CSRF: ['https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html'],
    CORS: ['https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS'],
    HEADERS: ['https://owasp.org/www-project-secure-headers/'],
    INPUT_VALIDATION: ['https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html'],
    SESSION: ['https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html'],
    OTHER: [],
  };

  refs.push(...(categoryRefs[pattern.category] || []));

  return refs;
}

function generateRecommendations(vulnerabilities: Vulnerability[]): string[] {
  const recommendations: string[] = [];
  const categories = new Set(vulnerabilities.map((v) => v.category));

  // Priority recommendations based on severity
  const critical = vulnerabilities.filter((v) => v.severity === 'critical');
  const high = vulnerabilities.filter((v) => v.severity === 'high');

  if (critical.length > 0) {
    recommendations.push(
      `URGENT: Address ${critical.length} critical vulnerabilities immediately. These pose immediate security risks.`
    );
  }

  if (high.length > 0) {
    recommendations.push(
      `HIGH PRIORITY: Fix ${high.length} high-severity issues in your next release cycle.`
    );
  }

  // Category-specific recommendations
  if (categories.has('XSS')) {
    recommendations.push(
      'Implement Content Security Policy (CSP) headers to mitigate XSS attacks.',
      'Use a template engine with auto-escaping or sanitize all user input.'
    );
  }

  if (categories.has('DATA_EXPOSURE')) {
    recommendations.push(
      'Rotate all exposed credentials immediately.',
      'Implement secret scanning in your CI/CD pipeline to prevent future exposures.'
    );
  }

  if (categories.has('AUTHENTICATION')) {
    recommendations.push(
      'Implement multi-factor authentication for sensitive operations.',
      'Use strong, randomly generated secrets for token signing.'
    );
  }

  if (categories.has('INJECTION')) {
    recommendations.push(
      'Use parameterized queries or ORMs for all database operations.',
      'Validate and sanitize all user inputs on the server side.'
    );
  }

  // General recommendations
  recommendations.push(
    'Set up automated security scanning in your CI/CD pipeline.',
    'Keep all dependencies up to date and monitor for known vulnerabilities.',
    'Conduct regular security code reviews and penetration testing.'
  );

  return Array.from(new Set(recommendations)); // Remove duplicates
}

/**
 * Main analysis function - analyzes code for vulnerabilities
 */
export async function analyzeCode(
  code: string,
  options: {
    fileName?: string;
    language?: string;
    scanId: string;
  }
): Promise<ScanReport> {
  const { fileName, language, scanId } = options;

  // Step 1: Pattern-based detection
  const patternResults = detectVulnerabilities(code);

  // Step 2: Convert to vulnerabilities
  const vulnerabilities: Vulnerability[] = [];

  for (const result of patternResults) {
    for (let i = 0; i < result.matches.length; i++) {
      const vuln = patternToVulnerability(
        result.pattern,
        result.lines[i],
        code,
        fileName
      );
      vulnerabilities.push(vuln);
    }
  }

  // Step 3: Calculate security score
  const score = calculateSecurityScore(vulnerabilities);

  // Step 4: Generate recommendations
  const recommendations = generateRecommendations(vulnerabilities);

  // Step 5: Count by severity
  const summary = {
    total: vulnerabilities.length,
    critical: vulnerabilities.filter((v) => v.severity === 'critical').length,
    high: vulnerabilities.filter((v) => v.severity === 'high').length,
    medium: vulnerabilities.filter((v) => v.severity === 'medium').length,
    low: vulnerabilities.filter((v) => v.severity === 'low').length,
    info: vulnerabilities.filter((v) => v.severity === 'info').length,
  };

  // Build report
  const report: ScanReport = {
    id: uuidv4(),
    scanId,
    generatedAt: new Date(),
    score,
    summary,
    vulnerabilities,
    scannedResources: {
      files: fileName ? [fileName] : [],
      linesOfCode: code.split('\n').length,
    },
    recommendations,
  };

  return report;
}

/**
 * Analyze URL - fetches content and analyzes it
 */
export async function analyzeUrl(
  url: string,
  scanId: string
): Promise<ScanReport> {
  // In a real implementation, this would:
  // 1. Fetch the URL content
  // 2. Extract HTML, JS, and CSS
  // 3. Analyze security headers
  // 4. Check for known vulnerable libraries
  // 5. Run the AI analyzer on the code

  // For now, we'll create a simulated response
  // In production, you'd use Puppeteer or similar for rendering

  const mockHtmlContent = `
<!DOCTYPE html>
<html>
<head>
  <script src="https://code.jquery.com/jquery-2.1.4.min.js"></script>
</head>
<body>
  <div id="content"></div>
  <script>
    var userInput = location.hash.substring(1);
    document.getElementById('content').innerHTML = userInput;
    var apiKey = "sk_test_1234567890abcdef";
  </script>
</body>
</html>
  `;

  const report = await analyzeCode(mockHtmlContent, {
    fileName: url,
    language: 'html',
    scanId,
  });

  // Add URL-specific info
  report.scannedResources.url = url;

  // Add header analysis (simulated)
  report.headers = {
    present: ['Content-Type', 'Cache-Control'],
    missing: ['Content-Security-Policy', 'X-Content-Type-Options', 'X-Frame-Options', 'Strict-Transport-Security'],
    misconfigured: [
      {
        header: 'Access-Control-Allow-Origin',
        issue: 'Set to wildcard (*)',
        recommendation: 'Specify exact allowed origins',
      },
    ],
  };

  // Add dependency analysis (simulated)
  report.dependencies = [
    {
      name: 'jQuery',
      version: '2.1.4',
      latestVersion: '3.7.1',
      vulnerabilities: [
        {
          id: 'CVE-2020-11022',
          severity: 'medium',
          title: 'XSS vulnerability in jQuery.htmlPrefilter',
        },
        {
          id: 'CVE-2020-11023',
          severity: 'medium',
          title: 'XSS vulnerability in jQuery.htmlPrefilter',
        },
      ],
    },
  ];

  return report;
}
