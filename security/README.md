# Security Tools & Scanning Guidelines

This directory contains configuration files and documentation for static security analysis, vulnerability scanning, and infrastructure auditing tools used within the repository.

---

## Trivy

[Trivy](https://aquasecurity.github.io/trivy/) is a comprehensive, multi-target security scanner by Aqua Security.

### What Trivy Scans

- **Filesystem Vulnerabilities**: Identifies known CVEs in application dependencies, language packages, and OS libraries.
- **Container Images**: Scans container image layers and base images for OS package and software dependencies vulnerabilities.
- **IaC Misconfigurations**: Audits Infrastructure-as-Code (Terraform, Dockerfile, Kubernetes, Helm) for security misconfigurations.
- **Exposed Secrets**: Detects accidentally committed API keys, tokens, credentials, and certificates in code and configuration files.

### Installation Instructions

#### macOS (Homebrew)
```bash
brew install trivy
```

#### Linux

**Debian / Ubuntu (apt):**
```bash
sudo apt-get install wget apt-transport-https gnupg lsb-release
wget -qO - https://aquasecurity.github.io/trivy-repo/deb/public.key | gpg --dearmor | sudo tee /usr/share/keyrings/trivy.gpg > /dev/null
echo "deb [signed-by=/usr/share/keyrings/trivy.gpg] https://aquasecurity.github.io/trivy-repo/deb $(lsb_release -sc) main" | sudo tee -a /etc/apt/sources.list.d/trivy.list
sudo apt-get update
sudo apt-get install trivy
```

**RHEL / CentOS / Fedora (yum/dnf):**
```bash
sudo rpm --import https://aquasecurity.github.io/trivy-repo/rpm/public.key
sudo curl -s https://aquasecurity.github.io/trivy-repo/rpm/releases.repo -o /etc/yum.repos.d/trivy.repo
sudo yum install trivy
```

#### Direct Binary Download
Download the latest pre-compiled binary release from GitHub:
[https://github.com/aquasecurity/trivy/releases](https://github.com/aquasecurity/trivy/releases)

```bash
# Example for Linux amd64
curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh -s -- -b /usr/local/bin
```

### Usage with `trivy.yaml` Config

The repository includes a pre-configured [`security/trivy.yaml`](file:///Users/bertog/go/src/github.com/ggarcia209/antigravity/security/trivy.yaml) file specifying directory exclusions (e.g., `.git`, `node_modules`), secret exclusions, severity thresholds (`HIGH`, `CRITICAL`), and dependency options.

To run a filesystem scan using the configuration file:
```bash
trivy fs --config trivy.yaml .
```

### Example Commands for Different Scan Types

- **Filesystem Scan**:
  ```bash
  trivy fs --config trivy.yaml .
  ```
- **Container Image Scan**:
  ```bash
  trivy image my-app:latest
  ```
- **Infrastructure as Code (IaC) Scan**:
  ```bash
  trivy iac ./deploy
  ```
- **Repository Secret Scanning**:
  ```bash
  trivy repository --scanners secret .
  ```

### Official Documentation

Official Trivy documentation: [https://aquasecurity.github.io/trivy/](https://aquasecurity.github.io/trivy/)

---

## Semgrep

[Semgrep](https://semgrep.dev/docs/) is a fast, open-source static analysis engine for searching code, enforcing coding standards, and finding security bugs at build or commit time.

### What Semgrep Does

- **Static Application Security Testing (SAST)**: Scans source code for security vulnerabilities, code smells, and logic flaws using syntax-aware pattern matching.
- **Pattern-Based Analysis**: Matches rules against Abstract Syntax Trees (ASTs), providing precise detection without needing complex compiler setups or external build steps.

### Installation Instructions

#### macOS (Homebrew)
```bash
brew install semgrep
```

#### Python (pip)
```bash
pip install semgrep
```

### Basic CLI Usage

- **Scan with Semgrep's recommended registry ruleset**:
  ```bash
  semgrep scan --config p/default
  ```
- **Scan with the auto-config** (registry auto-detection):
  ```bash
  semgrep scan --config auto
  ```
- **Scan using the project's custom rules file**:
  ```bash
  semgrep scan --config security/.semgrep/semgrep.yaml
  ```
- **Combine custom rules with registry rulesets**:
  ```bash
  semgrep scan --config security/.semgrep/semgrep.yaml --config p/default --config p/owasp-top-ten
  ```
- **CI / Continuous Integration Mode**:
  ```bash
  semgrep ci
  ```

### Customization Note

The repository includes a starter custom rules file at [`security/.semgrep/semgrep.yaml`](./security/.semgrep/semgrep.yaml).
This file contains a commented-out example rule demonstrating the Semgrep rule schema. Add your project-specific rules to this file, and combine it with registry rulesets (such as `p/default`, `p/owasp-top-ten`, `p/golang`, `p/typescript`, `p/python`) via the `--config` flag.

### Official Documentation

Official Semgrep documentation: [https://semgrep.dev/docs/](https://semgrep.dev/docs/)
