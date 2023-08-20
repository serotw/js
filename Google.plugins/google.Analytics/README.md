# executeGa.js

### 繁體中文

> 這是 Google Analytics 自動生成的腳本代碼以供網站使用。
> 只需要放入ID，它就會自動生成。

### English

> This is generated automatically Google Analytics script code to website use.
> Just put in the ID and it will be generated automatically.

## CDN

Using `jsDelivr` CDN (ES5 UMD browser module):

```html
<script src="https://cdn.jsdelivr.net/gh/serotw/js-code/Google.plugins/google.Analytics/executeGa.min.js"></script>
```

Using `Github.io` url:

```html
<script src="https://serotw.github.io/js-code/Google.plugins/google.Analytics/executeGa.min.js"></script>
```

## Example

Add code in html>head:

```html
<html lang="en">
<head>
  <meta http-equiv="content-type" content="text/html; charset=utf-8">
  <title>Example</title>
  <script src="https://cdn.jsdelivr.net/gh/serotw/js-code/Google.plugins/google.Analytics/executeGa.min.js"></script>
  <script type="text/javascript">
    executeGa && executeGa('YOU_ARE_ID');
  </script>
</head>
<body>
  ...
</body>
</html>
```

### Original code provided by Google

```html
<!-- Analytics (analytics.js) -->
<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
  ga('create', 'YOU_ARE_ID', 'auto');
  ga('send', 'pageview');
</script>

<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=YOU_ARE_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'YOU_ARE_ID');
</script>
```
