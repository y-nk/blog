---
title: pushover.net and notifications
description: Get to know who's trying to use your VPN
timestamp: 1346857200000
---
<disclaimer>The original article has been retrieved from the internet archive machine and edited for fluidity.</disclaimer>

Recently i’ve been trying to set up a web server at home. I've also set-up a private vpn (to access some NAS) and am a little concerned about being poked around so I was wondering if it was possible for me to be notified of any kind of harassment on my vpn port.

I discovered pushover, a push notification service which is free for receivers and also free for senders at with a rate limit of 7500 messages/month. It looked perfect since the android app is cheap (~1€), and i could create a personal application that would easy fit in this 7500 messages per month free plan.

### Monitoring connections

The vpn server is running on a Linksys WRT54G router flash with a DDWRT firmware.
After configured the vpn server with the highest log level possible, it was possible to monitor the log file to see if a new connection was made with some shell.

```
$ tail /var/log/messages

Sep  6 04:43:57 router daemon.info [21643]: CTRL: Client XXX.XXX.XXX.XXX control connection started
Sep  6 04:43:57 router daemon.info [21643]: CTRL: Client XXX.XXX.XXX.XXX control connection finished
```

I then used `awk` to filter out the logs, and put it in a simple loop to call pushover whenever a new line was added to the log

```
tail -f /var/log/messages | awk '/CTRL: Client/ { print $9"-"$12 }' | while read -r args; do
  wget "http://129.168.0.XXX:8080/someProxyToPushover.php?arguments=vpn-$args";
done
```

So now, anytime a new line appears into the log file, it will be monitored by `tail`, evaluated by `awk`, and if it matches, `wget` will call the webservice with the ip and the status of the connection.

### Calling pushover

Here’s a small script i first crafted. I takes the full example from pushover’s index page, with a small parser before.

```
<?php
  $split = explode("-", $_GET["arguments"]);
  $message = "";

  switch($split[0]) {
    case "vpn":
      $message = "Connection ".$split[1]." from ".$split[2];
      break;
  
    default:
      die('');
  }

  curl_setopt_array (
    $curl = curl_init(), array (
      CURLOPT_URL => "https://api.pushover.net/1/messages.json",
      CURLOPT_POSTFIELDS => array (
        "token" => "APP_SECRET",
        "user" => "USER_SECRET",
        "message" => $message,
      )
    )
  );
  
  curl_exec($curl);
  curl_close($curl);
  
  die('');
?>
```

I wanted to fancy it a little, so i decided to crawl a country-to-ip website that would display the country and the city of the ip, so i could have more infos about who’s connected.
I modified the vpn case that way:

```
case "vpn":
    $ip = $split[1];
    $status = $split[2];

    // i'm crawling the web incognito 8)
    $useragent = "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10.6; fr; rv:1.9.2.6) Gecko/20100625 Firefox/3.6.6";
      
    $curl = curl_init("http://whatismyipaddress.com/ip/".$ip);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, TRUE);
    curl_setopt($curl, CURLOPT_NOBODY, FALSE);
    curl_setopt($curl, CURLOPT_FORBID_REUSE, TRUE);
    curl_setopt($curl, CURLOPT_FOLLOWLOCATION, TRUE);
    curl_setopt($curl, CURLOPT_USERAGENT, $useragent);
    $data = curl_exec($curl);
    curl_close($curl);
    
    // it's a html parser lib called "simplehtmldom" (basically php's SizzleJS)
    require_once("html.php");
      
    $html = str_get_html($data);
    $country = $html->find("table", 1)->find("td", 0)->text();
    $city = $html->find("table", 1)->find("td", 2)->text();
     
    $message = "Connection ".$status." from ".$ip." (".trim($country).", ".trim($city).")";
    break;
```

I added the shell script part is to the startup from the WebUI of DDWRT.

Thanks a lot to Danetag for staying late at night, helping me with testing from Vancouver :)

Btw, I know the regex in `awk` is not perfect since it monitors only a successfull connection from the vpn.
I could also have made an [iptables](http://www.delafond.org/traducmanfr/man/man8/iptables.8.html) rule to monitor any connection, and adapt the awk regex.

```
iptables -t nat -I PREROUTING -p tcp --dport $VPNPORT -j LOG --log-prefix=VPNTICKLE
```

It was just easier this way :)
