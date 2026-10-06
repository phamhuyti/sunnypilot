# Security Policy

## Supported Versions

Use this section to tell people about which versions of your project are
currently being supported with security updates.

| Version | Supported          |
| ------- | ------------------ |
| 5.1.x   | :white_check_mark: |
| 5.0.x   | :x:                |
| 4.0.x   | :white_check_mark: |
| < 4.0   | :x:                |

## Reporting a Vulnerability

Use this section to tell people how to report a vulnerability.

Tell them where to go, how often they can expect to get an update on a
reported vulnerability, what to expect if the vulnerability is accepted or
declined, etc.


### Vulnerability Disclosure Process

We follow a coordinated disclosure process:

1. **Initial Report**: Email your vulnerability report to security@sunnylink.dev with:
   - Detailed description of the vulnerability
   - Steps to reproduce (if applicable)
   - Potential impact assessment
   - Your contact information

2. **Acknowledgment**: We acknowledge receipt of your report within 48 hours

3. **Investigation**: We investigate and determine severity within 5 business days

4. **Timeline**:
   - **Critical (CVSS 9.0-10.0)**: Fixed and released within 7 days
   - **High (CVSS 7.0-8.9)**: Fixed and released within 14 days
   - **Medium (CVSS 4.0-6.9)**: Fixed and released within 30 days
   - **Low (CVSS 0.1-3.9)**: Fixed in next scheduled release

5. **Coordination**: We'll keep you informed throughout the process and request you keep the vulnerability confidential until we've released a fix

6. **Credit**: With your permission, we'll acknowledge your contribution in release notes

## Supported Versions

Only the following versions receive security updates:

| Version | Status              | Support Until  |
|---------|---------------------|----------------|
| 5.1.x   | Active Support      | -              |
| 5.0.x   | Security Fixes Only | 2024-12-31     |
| 4.x.x   | Unsupported         | 2024-06-30     |
| < 4.0   | Unsupported         | End of Life    |

## Security Best Practices

### For Users

- Always update to the latest supported version
- Use HTTPS for all connections
- Keep your API keys and credentials secure
- Use strong, unique passwords
- Enable multi-factor authentication where available
- Monitor your account activity regularly
- Don't share credentials via email or insecure channels

### For Developers

- Follow OWASP Top 10 guidelines
- Perform regular code reviews
- Use dependency scanning tools (e.g., npm audit, Dependabot)
- Keep dependencies up to date
- Use static code analysis
- Implement proper input validation
- Use parameterized queries to prevent SQL injection
- Implement rate limiting and DDOS protection
- Encrypt sensitive data at rest and in transit
- Use secure defaults
- Log and monitor security events

## Security Headers

All responses from SunnyLink include the following security headers:

```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'
Referrer-Policy: strict-origin-when-cross-origin
```

## Dependencies

We maintain a list of dependencies in `package.json` and `requirements.txt`. Regular security audits are performed to ensure:

- No known vulnerabilities exist in dependencies
- Dependencies are kept up to date
- Unused dependencies are removed
- License compliance is maintained

## Incident Response

If we detect a security incident:

1. We immediately assess the scope and impact
2. We contain the incident
3. We notify affected users within 24 hours
4. We provide guidance on remediation steps
5. We release security updates as needed
6. We conduct a post-incident review
7. We implement preventive measures

## Compliance

SunnyLink is committed to compliance with:

- GDPR (General Data Protection Regulation)
- CCPA (California Consumer Privacy Act)
- OWASP guidelines
- CWE/SANS Top 25 mitigation
- Industry security standards

## Acknowledgments

We are grateful to security researchers and the community who report vulnerabilities responsibly. Your contributions help make SunnyLink more secure for everyone.

## Contact

- **Security Issues**: security@sunnylink.dev
- **General Questions**: support@sunnylink.dev
- **Website**: https://sunnylink.dev

---

*Last Updated: January 2026*
