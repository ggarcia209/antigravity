---
description: This workflow performs a security incident forensic analysis, remediation, and incident reporting on macOS systems.
---

# Security Incident Forensics - macOS

This workflow performs a structured security incident forensic analysis on macOS systems. It guides the agent through 8 phases: incident intake, initial detection, macOS security scan, log collection, immediate triage, deep security analysis, final remediation, and incident report generation.

## Role: Security Analyst -- your job is to investigate a suspected or confirmed security incident on a macOS system, perform forensic analysis, guide the user through remediation, and produce a detailed incident report.

## Context: The user suspects or has identified a system compromise and needs a thorough forensic investigation with documented evidence, actionable remediation steps, and a final incident report.

## Prerequisites:
* You must follow all rules defined in `.agent/rules/`.
* macOS system with access to `log show`, `lsof`, `netstat`, `find`, `stat`, and standard shell utilities.
* User must provide an incident description and time window for investigation.

## Constraints:
* **CRITICAL: No destructive actions.** You must NEVER delete files, revoke credentials, kill processes, or take any destructive/irreversible action. All destructive remediation must be performed manually by the user.
* **CRITICAL: No reading secrets.** You must NOT read the contents of files that may contain secrets (`~/.ssh/id_*`, `~/.aws/credentials`, `.env`, `~/.npmrc`, `~/.docker/config.json`, etc.). You may only check if these files **exist** (with user permission).
* You must not proceed if the workflow encounters a critical failure that can't be resolved (ex: authentication failures, system command unavailable).
* You must document every terminal command executed. Each log file must include the exact command used as a header comment for repeatability.
* Empty command results must still produce a file with a header line showing "no records".
* Retry retryable terminal command failures up to 3 times. Prompt user for assistance on persistent or non-retryable failures.

## Step 1: Incident Intake
* Collect detailed incident description from the user.
* Prompt user for the following if not provided:
  * **Time window**: When did the suspected incident occur? (start and end timestamps)
  * **Suspected source**: What triggered the suspicion? (e.g., suspicious file, unexpected network activity, compromised API key)
  * **Scope**: What systems/repos/services may be affected?
* Establish the output directory for forensic evidence files. Default: `remediation/` in the relevant project directory.
* Create subdirectories for each forensic phase:
  * `2_initial_detection/`
  * `3_macos_security_scan/`
  * `4_log_collection/`

## Step 2: Initial Detection (if threat not yet identified)
* If the user has already identified the threat source, document it and proceed to Step 3.
* If the threat source is unknown, scan for common attack vectors based on the user's incident description:
  * Review recently opened/cloned repositories for suspicious configuration files
  * Check for recently installed packages or tools
  * Review recent downloads
  * Check browser history for suspicious URLs (if user provides access)
* Save all terminal output to files in `2_initial_detection/` subdirectory.
* **Document every command run**: each log file must include the exact command used as a header comment, so the investigation is repeatable.
* Present all findings to the user before proceeding.

## Step 3: Forensic Analysis - macOS Security Scan
* Inform the user of the specific attack vectors and persistence mechanisms being checked before proceeding.
* Scan for macOS-specific attack vectors and persistence mechanisms.
* Save all terminal output to files in `3_macos_security_scan/` subdirectory.
* **Document every command run**: each log file must include the exact command used as a header comment, so the investigation is repeatable.

### macOS Attack Vector Checklist
Check the following in any suspicious repositories or recently accessed projects:
* `.vscode/tasks.json` with `runOn: folderOpen` -- auto-executes shell commands on folder open
* `.vscode/settings.json` -- terminal profile manipulation (custom shell paths)
* `package.json` npm lifecycle hooks (`prepare`, `postinstall`, `preinstall`) -- executes on `npm install`
* `package-lock.json` / `yarn.lock` -- check for known compromised package versions
* Python `setup.py` -- malicious install commands
* Homebrew tap tampering -- unauthorized taps or formulas
* macOS TCC bypass attempts -- scripts requesting elevated permissions

### macOS Persistence Mechanism Checklist
Run the following commands and save output to the specified files:

| # | Category | Command | Output File |
|---|---|---|---|
| 1 | LaunchAgents (user) | `ls -la ~/Library/LaunchAgents/` | `3_macos_security_scan/launchagents_user.md` |
| 2 | LaunchAgents (system) | `ls -la /Library/LaunchAgents/` | `3_macos_security_scan/launchagents_system.md` |
| 3 | LaunchDaemons | `ls -la /Library/LaunchDaemons/` | `3_macos_security_scan/launchdaemons.md` |
| 4 | Cron jobs | `crontab -l` | `3_macos_security_scan/cron_jobs.md` |
| 5 | Shell config timestamps | `stat -f "%Sm %N" ~/.zshrc ~/.bash_profile ~/.zprofile 2>/dev/null` | `3_macos_security_scan/shell_config_timestamps.md` |
| 6 | Git config | `git config --global --list` | `3_macos_security_scan/git_config.md` |
| 7 | Kernel extensions | `ls -la /Library/Extensions/` | `3_macos_security_scan/kernel_extensions.md` |

* **CRITICAL**: Any malicious persistence mechanisms found (e.g., unauthorized LaunchAgents, modified shell configs, suspicious cron jobs) must be reported to the user **immediately** for manual removal before continuing.

## Step 4: Forensic Analysis - Log Collection
* Run the following terminal commands to capture forensic data.
* Save each output to a separate file in the `4_log_collection/` subdirectory.
* Empty results must still produce a file with a header line and "no records".
* Retry retryable errors up to 3 times; prompt user on persistent or non-retryable failures.
* **Document every command run**: each log file must include the exact command used as a header comment, so the investigation is repeatable.
* Replace `START` and `END` with the user-provided time window timestamps.
* Commands may be adjusted based on the specific incident. All adjustments must be documented.

### Log Collection Commands

| # | Category | Command | Output File |
|---|---|---|---|
| 1 | Network connections | `lsof -i -nP +c0` | `4_log_collection/network_logs.md` |
| 2 | All network processes | `netstat -anp tcp && netstat -anp udp` | `4_log_collection/all_network_processes.md` |
| 3 | DNS queries (full) | `log show --predicate 'process == "mDNSResponder"' --start "START" --end "END" --style compact` | `4_log_collection/dns_responder.md` |
| 4 | DNS filtered (attacker domain) | Grep dns_responder.md for known attacker domains | `4_log_collection/[domain]_dns.md` |
| 5 | DNS unusual domains | Grep dns_responder.md for unusual query patterns | `4_log_collection/unusual_dns_domains.md` |
| 6 | networkd DNS subsystem | `log show --predicate 'subsystem == "com.apple.networkd" AND category == "dns"' --start "START" --end "END" --style compact` | `4_log_collection/network_mdns.md` |
| 7 | Process network activity | `log show --predicate 'processImagePath CONTAINS "lsof" OR processImagePath CONTAINS "netstat"' --start "START" --end "END"` | `4_log_collection/network_processes.md` |
| 8 | curl/wget history | `log show --predicate 'process == "curl" OR process == "wget"' --start "START" --end "END" --style compact` | `4_log_collection/curl_history.md` |
| 9 | Node.js activity | `log show --predicate 'process == "node"' --start "START" --end "END" --style compact` | `4_log_collection/node_activity.md` |
| 10 | Python activity | `log show --predicate 'process == "python" OR process == "python3"' --start "START" --end "END" --style compact` | `4_log_collection/python_activity.md` |
| 11 | New/modified files | `find ~ -maxdepth 3 -mmin -N -ls 2>/dev/null` | `4_log_collection/new_files.md` |
| 12 | IDE task logs | `log show --predicate 'process CONTAINS "Code" OR process CONTAINS "Antigravity"' --start "START" --end "END" --style compact` | `4_log_collection/vs_code_tasks.md` |

## Step 5: Immediate Triage
* Analyze all collected logs and scan results from Steps 2-4 for indicators of compromise (IOCs).
* **If a potential attack vector is identified**: immediately prompt user to rotate credentials and take containment actions.
* **STOP and wait for user confirmation** that immediate remediation steps have been completed before continuing.
* Credential check list -- check **existence only**, do NOT read contents. With user's permission, verify if these files/directories exist:
  * `~/.ssh/` (SSH keys)
  * `~/.aws/` (AWS credentials)
  * `~/.npmrc` (npm tokens)
  * `~/.docker/config.json` (Docker registry credentials)
  * `~/.kube/config` (Kubernetes config)
  * `~/.gitconfig` and git credential store
  * `~/.zsh_history`, `~/.bash_history` (shell history potentially containing secrets)
  * `~/.env`, `~/.netrc`
* If user denies permission to check credential files, skip and note in the final report.
* Add any existing credential files to the remediation requirements (rotation/review).

## Step 6: Deep Security Analysis
* Parse all collected log files for:
  * Suspicious process names or PIDs not associated with known system/user processes
  * Outbound connections to unknown or suspicious domains
  * DNS exfiltration patterns (unusually long subdomain queries, burst patterns to a single domain)
  * Non-standard processes making DNS queries (anything other than browser, system daemons)
  * curl/wget/node/python activity originating from unexpected sources or processes
* Source code analysis of suspicious repositories (if applicable):
  * Review all imported modules and dependencies
  * Verify application code is clean vs. weaponized configuration files
  * Identify if repository is a fork/trojan of a legitimate open-source project
* Dependency auditing (package.json, package-lock.json, yarn.lock, requirements.txt):
  * Check for known compromised package versions
  * Flag deprecated or vulnerable dependencies with known CVEs
  * Identify incoherent dependency graphs (social engineering indicator -- e.g., mixing unrelated frameworks)
* Identify potentially compromised API keys/secrets from:
  * Repository config files (`.env.example`, `config.js`, `config.yaml`, etc.)
  * IDE settings files (`.vscode/settings.json`, etc.)
  * **Do NOT read actual `.env` files or files likely containing real secrets**
* **Critical findings discovered during deep analysis must alert the user immediately -- do not batch critical issues.**

## Step 7: Final Remediation
* Present all remaining remediation steps not already addressed in Step 5.
* Categorize recommendations as:
  * **Immediate**: Actions that should be taken now (credential rotation, file deletion, config changes)
  * **Preventive**: Actions to prevent future incidents (settings changes, security hardening, process improvements)
* Include specific files/directories/credentials that need attention, with rationale for each.
* **STOP and wait for user confirmation** that all remediation steps have been completed before generating the incident report.

## Step 8: Incident Report
* Generate the incident report only after the user confirms all remediation steps from Step 7 are complete.
* Save the report to the output directory as `incident_report.md`.
* The report must include ALL of the following sections in this order:

### Incident Report Template

```
# Security Incident Report

**Date**: [Date of incident]
**Reported By**: [How the incident was detected]
**Classification**: [Type of attack]
**Severity**: [Critical/High/Medium/Low] (potential), [Impact level] (actual)
**Status**: [Resolved/Open/Monitoring]

---

## 1. Executive Summary
[1-2 paragraph overview of what happened, what was found, and the outcome]

---

## 2. Timeline
| Time | Event |
|---|---|
| [timestamp] | [event description] |

---

## 3. Attack Vectors
[For each identified attack vector: description, code samples, mechanism, and result (blocked/executed/unknown)]

---

## 4. Attack Surface
[What was exposed or could have been accessed if the attack succeeded]
- TCC-protected resources (Documents, Desktop, etc.)
- Non-TCC-protected resources (~/.ssh, ~/.aws, etc.)
- Network exposure
- What protections were in place (sandbox, TCC denials, Workspace Trust, etc.)

---

## 5. Source Code Analysis
[If a suspicious repository was involved: file-by-file analysis results, dependency audit, key insights]

---

## 6. Forensic Evidence
[Each subsection MUST include the exact terminal command(s) used to produce the evidence, formatted as code blocks alongside the findings.]

### 6.1 DNS Analysis
[Commands used and findings]

### 6.2 Network Analysis
[Commands used and findings]

### 6.3 Process Activity Analysis
[Commands used and findings]

### 6.4 Persistence Check
[Commands used and findings]

---

## 7. Why the Attack Succeeded/Failed
[Analysis of what prevented or allowed the compromise, ranked by likelihood]

---

## 8. Indicators of Compromise (IOCs)
| Indicator | Value |
|---|---|
| [type] | [value] |

---

## 9. Remediation Actions Taken
[Numbered list of all remediation actions performed during the investigation]

---

## 10. Recommendations
### Immediate
- [ ] [Action items]

### Preventive
- [ ] [Action items]

---

## 11. Commands Executed
[Table of every terminal command run during the investigation]
| Command | Purpose | Output File | Timestamp |
|---|---|---|---|
| [command] | [why it was run] | [output file path] | [when it was run] |

---

## 12. Evidence Files
[Index of all forensic log files with file sizes]
| File | Contents | Size |
|---|---|---|
| [file path] | [description] | [size] |

---

**Conclusion**: [Final assessment of the incident]
```
