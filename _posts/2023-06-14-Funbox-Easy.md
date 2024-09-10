---
title: "Funbox : Easy"
categories: [Proving Grounds, Play, Funbox]
tags: [PrivEsc, Sqlmap, timedatectl, File Upload, time]
image:
  path: https://www.piratemoo.com/content/images/2022/12/funboxeasy.png
  alt:  Funbox-Easy Machine 🖥️
---

| Machine     | <center>Details</center>                                                  |
| ----------- | ------------------------------------------------------------------------- |
| **Vulnhub** | https://www.vulnhub.com/entry/funbox-easy,526/                            |
| **Level**   | <center>script-kiddies</center>                                           |
| **Creator** | <center><a href="https://www.vulnhub.com/author/0815r2d2,714/">0815R2d2</a></center> |


## **Description ⤵️**

>
💡 Boot2Root ! Easy going, but with this Funbox you have to spend a bit more time. Much more, if you stuck in good traps. But most of the traps have hints, that they are traps.
<br>
If you need hints, call me on twitter: @0815R2d2
<br>
Have fun...
<br>
This works better with VirtualBox rather than VMware
<br>
This works better with VirtualBox rather than VMware.
<br>
{: .prompt-info }

### Let’s find the IP Address first >>

![164-1.png](/Vulnhub-Files/img/Funbox-Easy/164-1.png)

```bash
IP : 10.0.2.17
```
{: .nolineno}

## Port Scan Results ➡️

![164-2.png](/Vulnhub-Files/img/Funbox-Easy/164-2.png)

```bash
OPEN PORTS >
22     SSH
80     HTTP
33060  mysql
```
{: .nolineno}



## Web Enumeration ⤵️

![164-3.png](/Vulnhub-Files/img/Funbox-Easy/164-3.png)

![164-4.png](/Vulnhub-Files/img/Funbox-Easy/164-4.png)

![164-5.png](/Vulnhub-Files/img/Funbox-Easy/164-5.png)

So with sql injection on store site I got this →

```bash
command :
sqlmap -u "<URL>" --risk 3 --level 5
```
{: .nolineno}

![164-6.png](/Vulnhub-Files/img/Funbox-Easy/164-6.png)

![164-7.png](/Vulnhub-Files/img/Funbox-Easy/164-7.png)

```bash
admin : admin
```
{: .nolineno}

![164-8.png](/Vulnhub-Files/img/Funbox-Easy/164-8.png)

Got access →

![164-9.png](/Vulnhub-Files/img/Funbox-Easy/164-9.png)

After accessing that page I got this →

![164-10.png](/Vulnhub-Files/img/Funbox-Easy/164-10.png)

---

## SHELL ➡️

Got something →

![164-11.png](/Vulnhub-Files/img/Funbox-Easy/164-11.png)

![164-12.png](/Vulnhub-Files/img/Funbox-Easy/164-12.png)

Now lets check the `sudo -l` for root access through tony →

![164-13.png](/Vulnhub-Files/img/Funbox-Easy/164-13.png)

Now I got too much options so lets try least interesting one time →

```bash
command : sudo /usr/bin/time /bin/sh
```
{: .nolineno}

![164-14.png](/Vulnhub-Files/img/Funbox-Easy/164-14.png)

![164-15.png](/Vulnhub-Files/img/Funbox-Easy/164-15.png)

---

> If you have any questions or suggestions, please leave a comment below.
Thank You ! 
{: .prompt-tip }