---
title: The discovery of C-Sharp
description: Debriefing on lessons learnt while learning a new language
timestamp: 1320591600000
---
<disclaimer>The original article has been retrieved from the internet archive machine and edited for fluidity.</disclaimer>

I’m proud to say i’ve finished a [cool website](http://lesabonnesfontcourt.com/) with a gifted artistic director known as [urbanplastic](http://cargocollective.com/urbanplastic). My current company having only IIS Servers, it was decided to build it in C# and so I had to adapt since I was coding backend and _frontend_ (is that a word?)

### The good

List of the good things I found in C#. It's worth nothing that all of these points will seem trivial for C# devs, but trust me that you don't know what it is to work with php (or maybe you do and that's why you changed to C#).

1- **Bracket-based object initializators**. After typing new and your class name, add {} and define some of its property.

```
SomeObject obj = new SomeObject() {
  someProp1 = "foo"
  someProp2 = "bar"
}
```

2- This fucking awesome technology which is **the lamdba expression system**. It a kind of inline delegation declaration system, but strongly typed and highly flexible. I still don’t get _all_ the power of it but damn this is good! It's like a javascript callback, but without gibberish syntax around.

in JS:

```
var strings = ['My', 'rAnDomlY', 'caSEd', 'sTRInG'];

for (var i = 0; i < strings.length; i++)
  strings[i] = strings[i].toUpperCase();
```

C# Lambda made:

```
List<String> strings = new List<String>{ "My", "rAnDomlY", "caSEd", "sTRInG" };
strings.ConvertAll(i => i.ToLower()); // "i" is typed as String! 
```

It’s **D.A.M.N cool.**

3- **Linq**, which is also an amazing thing. A strongly typed ORM is something I never worked with before. I didn’t had to use it directly because I wasn’t involved in the database design and its related queries, but I’ve been seduced by the clarity of it. The way of chaining maps, filters and sorting is truely something inspiring. Best thing is to have a look on an introduction to Linq [there](http://msdn.microsoft.com/en-us/library/bb397906.aspx)

### The bad

Saying that, i feel some cons. Most of the time, shortcuts like Lambda and so on are decreasing the time of development ; sometimes, a strongly typed language can be long and fastidious (hear me, Java).

Have a look at this PHP Post request:

```
$c = curl_init();
curl_setopt($c, CURLOPT_URL, "http://some.distant.url");
curl_setopt($c, CURLOPT_RETURNTRANSFER, true);
curl_setopt($c, CURLOPT_HEADER, false);
curl_setopt($c, CURLOPT_POST, true);
curl_setopt($c, CURLOPT_POSTFIELDS, array('param0' => 'value0','param1' => 'value1'));
$output = curl_exec($c);
var_dump($output);
curl_close($c);
```

See how easy it is ? I’m sure it can even be shorter quite easily.  

Same in C#:  

```
WebRequest request = WebRequest.Create ("http://some.distant.url");
request.Method = "POST";

string postData = "param0=value0&param1=value1"; // there aren't encoded magically
byte[] byteArray = Encoding.UTF8.GetBytes(postData);

request.ContentType = "application/x-www-form-urlencoded";
request.ContentLength = byteArray.Length;

Stream dataStream = request.GetRequestStream();
dataStream.Write(byteArray, 0, byteArray.Length);
dataStream.Close();

WebResponse response = request.GetResponse();
Console.WriteLine(((HttpWebResponse)response).StatusDescription);

dataStream = response.GetResponseStream();

StreamReader reader = new StreamReader(dataStream);
string responseFromServer = reader.ReadToEnd();

Console.WriteLine(responseFromServer);

reader.Close();
dataStream.Close();
response.Close();
```

Do you get it?

Otherwise, it’s not a big deal... as long as you're on Windows. Visual Studio is the smartest IDE i ever seen so far, tons of features, and a great memory management. I recognize more than ever FlashDevelop’s influences now :) 

### The ugly

There's no ugly, c'mon :)

### I worked with the .NET MVC framework

It’s also a great tool and well designed, with simplicity in mind. Although, there’s nothing special around it when you know how great are tools like the Zend Framework or Symfony.

By the way, one of its very good feature is its templating engine, named Razor. It’s pretty simple and all the calls are easily findable since they’re prefixed with an `@`. You can even type strong C# embedded in a `@{}` block. I didn't feel so impressed at first as it’s not something new for php devs since there are dozen of templating engines out there, but it's apparently a very good improvement since the last version (according to C# devs).

I also loved of the routing system of MVC. I had to deal with it very deeply with it and since I had needs like regex and custom validation on urls, I appreciated how simple it is to manage those in a single line of code.

---

I took a big look and adapted some concepts in my own AS3 library. More to come on this soon ;)
