---
categories: [proving-ground-play]
tags: [proving-ground,walkthrough,pentest]
---

## **Description [⤵️](https://www.vulnhub.com/entry/funbox-easy,526/)**

>
💡 Boot2Root ! Easy going, but with this Funbox you have to spend a bit more time. Much more, if you stuck in good traps. But most of the traps have hints, that they are traps.

If you need hints, call me on twitter: @0815R2d2

Have fun...

This works better with VirtualBox rather than VMware

This works better with VirtualBox rather than VMware.

{: .prompt-info }

Let’s find the IP Address first >>

![164-1.png](/Vulnhub-Files/img/Funbox-Easy/164-1.png)

```bash
IP : 10.0.2.17
```

## Port Scan Results ➡️

![164-2.png](/Vulnhub-Files/img/Funbox-Easy/164-2.png)

```bash
OPEN PORTS >
22     SSH
80     HTTP
33060  mysql
```

---

## Web Enumeration ⤵️

![164-3.png](/Vulnhub-Files/img/Funbox-Easy/164-3.png)

![164-4.png](/Vulnhub-Files/img/Funbox-Easy/164-4.png)

![164-5.png](/Vulnhub-Files/img/Funbox-Easy/164-5.png)

So with sql injection on store site I got this →

```
command :
sqlmap -u "<URL>" --risk 3 --level 5
```

![164-6.png](/Vulnhub-Files/img/Funbox-Easy/164-6.png)

![164-7.png](/Vulnhub-Files/img/Funbox-Easy/164-7.png)

```bash
admin : admin
```

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

![164-14.png](/Vulnhub-Files/img/Funbox-Easy/164-14.png)

![164-15.png](/Vulnhub-Files/img/Funbox-Easy/164-15.png)

---