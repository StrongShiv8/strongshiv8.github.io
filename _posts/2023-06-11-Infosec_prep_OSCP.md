---
title: InfoSec Prep OSCP
categories: [VulnHub]
tags: [PrivEsc, Recon, SUIDs, Wordpress]
image:
  path: https://i.ytimg.com/vi/hL-gSSs20Gc/maxresdefault.jpg
  alt: InfoSec Prep OSCP Machine !
---


## **Description ⤵️**


>💡 [InfoSec Prep: OSCP](https://vulnhub.com/entry/infosec-prep-oscp,508/) ⤵️
>
>This box should be **easy**. This machine was created for the InfoSec Prep Discord Server ([https://discord.gg/RRgKaep](https://discord.gg/RRgKaep)) as a give way for a 30d voucher to the OSCP Lab, Lab materials, and an exam attempt.
>
>The box was created with *VMWare Workstation*, but it should work with VMWare Player and Virtualbox. Upon booting up it should display an IP address. This is the target address based on whatever settings you have. You should verify the address just incase.
>
>Find the ***flag.txt*** in **/root/** and submit it to the TryHarder bot on Discord to enter the give away. The command is only available for so long. So if you are just joining the server or doing the box for fun, the command would not be there any longer at a later time.
>
>Please do not publish any write ups for this box until August 7, 2020 as this is probably when the give away will end. After that, fair game!
>
>A big thanks to Offensive Security for providing the OSCP voucher.
>
>Box created by FalconSpy with the support of the staff at InfoSec Prep Discord Server
>
>This works better with VirtualBox rather than VMware. 
>\## Changelog 2020/07/10 - v1.0.1 - Fixed IP issue 2020/07/11 - v1.0.0
{: .prompt-info }


### **Let’s find the IP Address first >>**

![77-1.png](/Vulnhub-Files/img/Infosec_prep_OSCP/77-1.png)

```bash
IP : 10.0.2.20
```
{: .nolineno}

## Port Scan Results ➡️

![89-1.png](/Vulnhub-Files/img/Infosec_prep_OSCP/89-1.png)

![89-2.png](/Vulnhub-Files/img/Infosec_prep_OSCP/89-2.png)

```bash
OPEN PORTS >
22    SSH
80    HTTP
33060 mysql
```
{: .nolineno}

---

## Web Enumeration ⤵️

![90-1.png](/Vulnhub-Files/img/Infosec_prep_OSCP/90-1.png)

![90-2.png](/Vulnhub-Files/img/Infosec_prep_OSCP/90-2.png)

![90-3.png](/Vulnhub-Files/img/Infosec_prep_OSCP/90-3.png)

This is base64 lets see what it says →

I get a private key →

![90-4.png](/Vulnhub-Files/img/Infosec_prep_OSCP/90-4.png)

Now lets try Shell with this private key →

```bash
Commands →  ssh oscp@10.0.2.21 -i private_key_openssl
```
{: .nolineno}

![91-1.png](/Vulnhub-Files/img/Infosec_prep_OSCP/91-1.png)

I checked the configuration file of the wordpress site that is `wp-config.php` file.

![91-2.png](/Vulnhub-Files/img/Infosec_prep_OSCP/91-2.png)

```bash
wordpress : Oscp12345!
```
{: .nolineno}

Lets check the mysql database from the victim machine and look for some interesting data.

![91-3.png](/Vulnhub-Files/img/Infosec_prep_OSCP/91-3.png)

As found in SGID →

![91-4.png](/Vulnhub-Files/img/Infosec_prep_OSCP/91-4.png)

As I got bash as SUID permission so it is easier said then done to be a root now that will allow me to have `EUID(Effective User Identity) as 0` you can check with `id` command that makes me root privileged user.

![91-5.png](/Vulnhub-Files/img/Infosec_prep_OSCP/91-5.png)

![91-6.png](/Vulnhub-Files/img/Infosec_prep_OSCP/91-6.png)

```bash
flag.txt → d73b04b0e696b0945283defa3eee4538
```

> If you have any questions or suggestions, please leave a comment below.
Thank You ! 
{: .prompt-tip }