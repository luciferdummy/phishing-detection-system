export interface AnalysisResult {
  url: string
  isPhishing: boolean
  riskScore: number // 0-100
  riskLevel: "safe" | "suspicious" | "dangerous"
  reasons: string[]
  details: {
    label: string
    status: "safe" | "warning" | "danger"
    description: string
  }[]
}

// Known suspicious TLDs commonly used in phishing
const SUSPICIOUS_TLDS = [
  ".tk",
  ".ml",
  ".ga",
  ".cf",
  ".gq",
  ".xyz",
  ".top",
  ".club",
  ".work",
  ".click",
  ".link",
  ".buzz",
  ".rest",
  ".surf",
]

// Known legitimate domains
const TRUSTED_DOMAINS = [
  "google.com",
  "facebook.com",
  "amazon.com",
  "apple.com",
  "microsoft.com",
  "github.com",
  "twitter.com",
  "x.com",
  "linkedin.com",
  "youtube.com",
  "wikipedia.org",
  "reddit.com",
  "instagram.com",
  "netflix.com",
  "paypal.com",
  "vercel.com",
  "stackoverflow.com",
]

// Brands commonly impersonated in phishing
const IMPERSONATED_BRANDS = [
  "google",
  "facebook",
  "amazon",
  "apple",
  "microsoft",
  "paypal",
  "netflix",
  "instagram",
  "whatsapp",
  "linkedin",
  "twitter",
  "dropbox",
  "chase",
  "wellsfargo",
  "bankofamerica",
  "citibank",
  "usps",
  "fedex",
  "dhl",
  "ups",
]

// Suspicious keywords in URLs
const SUSPICIOUS_KEYWORDS = [
  "login",
  "signin",
  "verify",
  "account",
  "update",
  "secure",
  "banking",
  "confirm",
  "password",
  "credential",
  "suspend",
  "locked",
  "urgent",
  "alert",
  "validate",
  "wallet",
  "recover",
]

function normalizeUrl(input: string): string {
  let url = input.trim()
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = `https://${url}`
  }
  return url
}

function extractDomain(url: string): string {
  try {
    const parsed = new URL(url)
    return parsed.hostname.toLowerCase()
  } catch {
    return url.toLowerCase()
  }
}

function getBaseDomain(domain: string): string {
  const parts = domain.split(".")
  if (parts.length >= 2) {
    return parts.slice(-2).join(".")
  }
  return domain
}

export function analyzeUrl(input: string): AnalysisResult {
  const url = normalizeUrl(input)
  const domain = extractDomain(url)
  const baseDomain = getBaseDomain(domain)
  const reasons: string[] = []
  const details: AnalysisResult["details"] = []
  let riskScore = 0

  // Check if it's a known trusted domain
  if (TRUSTED_DOMAINS.includes(baseDomain)) {
    return {
      url,
      isPhishing: false,
      riskScore: 5,
      riskLevel: "safe",
      reasons: ["This is a known, trusted domain"],
      details: [
        {
          label: "Domain Trust",
          status: "safe",
          description: "Verified trusted domain",
        },
        {
          label: "SSL Certificate",
          status: "safe",
          description: "HTTPS protocol detected",
        },
        {
          label: "URL Structure",
          status: "safe",
          description: "Clean URL pattern",
        },
        {
          label: "Brand Check",
          status: "safe",
          description: "Official domain verified",
        },
      ],
    }
  }

  // 1. Check for IP address in URL
  const ipPattern = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/
  if (ipPattern.test(domain)) {
    riskScore += 30
    reasons.push("URL contains IP address instead of domain name")
    details.push({
      label: "IP Address",
      status: "danger",
      description: "Uses raw IP instead of domain name",
    })
  }

  // 2. Check for suspicious TLD
  const hasSuspiciousTld = SUSPICIOUS_TLDS.some((tld) => domain.endsWith(tld))
  if (hasSuspiciousTld) {
    riskScore += 20
    reasons.push("Uses a suspicious top-level domain")
    details.push({
      label: "Domain TLD",
      status: "warning",
      description: "Suspicious top-level domain detected",
    })
  } else {
    details.push({
      label: "Domain TLD",
      status: "safe",
      description: "Common top-level domain",
    })
  }

  // 3. Check for brand impersonation
  const domainLower = domain.toLowerCase()
  const impersonatedBrand = IMPERSONATED_BRANDS.find((brand) => {
    return domainLower.includes(brand) && !TRUSTED_DOMAINS.some((td) => td.includes(brand) && baseDomain === td)
  })
  if (impersonatedBrand) {
    riskScore += 25
    reasons.push(`Possible impersonation of "${impersonatedBrand}"`)
    details.push({
      label: "Brand Check",
      status: "danger",
      description: `Appears to impersonate ${impersonatedBrand}`,
    })
  } else {
    details.push({
      label: "Brand Check",
      status: "safe",
      description: "No brand impersonation detected",
    })
  }

  // 4. Check for excessive subdomains
  const subdomainCount = domain.split(".").length - 2
  if (subdomainCount >= 3) {
    riskScore += 15
    reasons.push("Excessive number of subdomains")
    details.push({
      label: "Subdomains",
      status: "warning",
      description: `${subdomainCount} subdomains detected`,
    })
  } else {
    details.push({
      label: "Subdomains",
      status: "safe",
      description: "Normal subdomain structure",
    })
  }

  // 5. Check for suspicious characters (homograph attack)
  const hasUnicode = /[^\x00-\x7F]/.test(domain)
  if (hasUnicode) {
    riskScore += 25
    reasons.push("Contains non-ASCII characters (possible homograph attack)")
    details.push({
      label: "Characters",
      status: "danger",
      description: "Non-ASCII characters detected",
    })
  }

  // 6. Check for excessive hyphens
  const hyphenCount = (domain.match(/-/g) || []).length
  if (hyphenCount >= 3) {
    riskScore += 15
    reasons.push("Excessive hyphens in domain name")
    details.push({
      label: "URL Pattern",
      status: "warning",
      description: "Too many hyphens in domain",
    })
  }

  // 7. Check URL length
  if (url.length > 75) {
    riskScore += 10
    reasons.push("Unusually long URL")
    details.push({
      label: "URL Length",
      status: "warning",
      description: `URL is ${url.length} characters long`,
    })
  } else {
    details.push({
      label: "URL Length",
      status: "safe",
      description: "Normal URL length",
    })
  }

  // 8. Check for suspicious keywords
  const pathAndQuery = url.replace(`https://${domain}`, "").replace(`http://${domain}`, "")
  const suspiciousKeywordsFound = SUSPICIOUS_KEYWORDS.filter((kw) => pathAndQuery.toLowerCase().includes(kw))
  if (suspiciousKeywordsFound.length >= 2) {
    riskScore += 15
    reasons.push(`Suspicious keywords in URL: ${suspiciousKeywordsFound.join(", ")}`)
    details.push({
      label: "Keywords",
      status: "warning",
      description: "Multiple suspicious keywords found",
    })
  } else {
    details.push({
      label: "Keywords",
      status: "safe",
      description: "No suspicious keywords detected",
    })
  }

  // 9. Check protocol
  if (url.startsWith("http://")) {
    riskScore += 10
    reasons.push("Uses insecure HTTP protocol")
    details.push({
      label: "SSL Certificate",
      status: "warning",
      description: "No HTTPS encryption",
    })
  } else {
    details.push({
      label: "SSL Certificate",
      status: "safe",
      description: "HTTPS encryption active",
    })
  }

  // 10. Check for @ symbol (credential injection)
  if (url.includes("@")) {
    riskScore += 20
    reasons.push("URL contains @ symbol (possible credential injection)")
    details.push({
      label: "Injection",
      status: "danger",
      description: "@ symbol detected in URL",
    })
  }

  // Cap the score
  riskScore = Math.min(riskScore, 100)

  // Determine risk level
  let riskLevel: AnalysisResult["riskLevel"]
  if (riskScore >= 50) {
    riskLevel = "dangerous"
  } else if (riskScore >= 25) {
    riskLevel = "suspicious"
  } else {
    riskLevel = "safe"
  }

  if (reasons.length === 0) {
    reasons.push("No obvious phishing indicators detected")
  }

  return {
    url,
    isPhishing: riskScore >= 50,
    riskScore,
    riskLevel,
    reasons,
    details: details.slice(0, 6),
  }
}

export const DEMO_SITES = [
  {
    url: "https://google.com",
    label: "Google",
    description: "Official Google search engine",
    expected: "safe" as const,
  },
  {
    url: "https://github.com",
    label: "GitHub",
    description: "Developer platform",
    expected: "safe" as const,
  },
  {
    url: "http://g00gle-login.secure-verify.tk/signin",
    label: "Fake Google Login",
    description: "Phishing page mimicking Google",
    expected: "dangerous" as const,
  },
  {
    url: "http://192.168.1.1/paypal-verify/login/account",
    label: "Fake PayPal",
    description: "IP-based PayPal phishing",
    expected: "dangerous" as const,
  },
  {
    url: "https://amaz0n-secure.login.verify-account.xyz/update",
    label: "Fake Amazon",
    description: "Amazon impersonation with suspicious TLD",
    expected: "dangerous" as const,
  },
  {
    url: "https://netflix.com",
    label: "Netflix",
    description: "Official streaming platform",
    expected: "safe" as const,
  },
  {
    url: "http://microsoft-support.account-locked.ml/credential",
    label: "Fake Microsoft",
    description: "Microsoft support phishing",
    expected: "dangerous" as const,
  },
  {
    url: "https://stackoverflow.com",
    label: "Stack Overflow",
    description: "Developer Q&A community",
    expected: "safe" as const,
  },
]
