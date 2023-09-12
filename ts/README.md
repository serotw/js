# ts
ts is simple XMLHttpRequest

### 繁體中文

> ts 是我的希望和自定義的 XMLHttpRequest，`ts` 的一些代碼和功能來自 `jQuery` 和 `axios`.  
> 我希望這只是一個簡單的 XMLHttpRequest，沒有太多未使用的Code.  
> 所以我撰寫它供我的網站使用並分享給需要此功能的設計人員.  
> 目前仍在修改更新中!

### English

> ts is my hope and custom the XMLHttpRequest, ts some code and function is from jQuery and axios.  
> i hope it's just a simple XMLHttpRequest without too much unused code.  
> so i make it for me website use and share for need this function design people.  
> currently still being revised and updated!

## CDN

Using `jsDelivr` CDN (ES5 UMD browser module):

```html
<script src="https://cdn.jsdelivr.net/gh/serotw/js-code/ts/ts.min.js"></script>
```

Using `Github.io` url:

```html
<script src="http://serotw.github.io/js-code/ts/ts.min.js"></script>
```


## Example

```js
// Make a request for a user with a given id
ts('/user?id=demo')
  .then(function(response) {
    // handle success
    console.log(response);
  })
  .catch(function(error) {
    // handle error
    console.log(error);
  })
  .finally(function() {
    // always executed
  });
```

```js
// or you can setting on config
ts('/user', {
  // variable name can use loadend or done
  done: function(response) {
    // handle success
    console.log(response);
  },
  // variable name can use error or fail
  fail: function(error) {
    // handle error
    console.log(error);
  }
});
```

```js
// Optionally the request above could also be done as
ts('/user', {
    data: {
      id: 'demo'
    }
  })
  .then(function(response) {
    console.log(response);
  })
  .catch(function(error) {
    console.log(error);
  })
  .finally(function() {
    // always executed
  });
```

```js
// or you can setting on config
ts('/user', {
  data: {
    id: 'demo'
  },
  // variable name can use loadend or done
  done: function(response) {
    // handle success
    console.log(response);
  },
  // variable name can use error or fail
  fail: function(error) {
    // handle error
    console.log(error);
  }
});
```

```js
// Want to use async/await? Add the `async` keyword to your outer function/method.
async function getUser() {
  try {
    const response = await ts('/user?id=demo');
    console.log(response);
  }catch(error) {
    console.error(error);
  }
}
```

## ts API

Requests can be made by passing the relevant config to `ts`.

##### ts(url)

```js
// Send a request (default method)
ts('/user');
```

##### ts(config)

```js
// Send a POST request
ts({
  method: 'post',
  url: '/user',
  data: {
    id: 'demo',
    from: 'Taiwan'
  }
});
```

##### ts(url[, method])

```js
// Send a POST request
ts('/user', 'POST');
```

##### ts(url[, config])

```js
// Send a POST request (default method)
ts('/user', {
  method: 'post',
  data: {
    id: 'demo',
    from: 'Taiwan'
  }
});
```

##### ts(url[, FormData])

```js
// Send a use FormData request
var formData = new FormData();
formData.append('id', 'demo');
formData.append('from', 'Taiwan');
ts('/user', formData);
```

##### ts(url[, method[, config]])

```js
// Send a DELETE request
ts('/user', 'DELETE', {
  data: {
    id: 'demo'
  }
});
```

##### ts(url[, method[, FormData]])

```js
// Send a POST and use FormData request
var formData = new FormData();
formData.append('id', 'demo');
formData.append('from', 'Taiwan');
ts('/user', 'POST', formData);
```

### Request method aliases

For convenience, aliases have been provided for all common request methods.

```js
ts(url)
```

```js
ts(config)
```

```js
ts(url[, method])
```

```js
ts(url[, config])
```

```js
ts(url[, FormData])
```

```js
ts(url[, method[, config]])
```

```js
ts(url[, method[, FormData]])
```

```js
ts.options(url[, config])
```

```js
ts.get(url[, config])
```

```js
ts.head(url[, config])
```

```js
ts.patch(url[, data[, config]])
```

```js
ts.post(url[, data[, config]])
```

```js
ts.put(url[, data[, config]])
```

```js
ts.delete(url[, config])
```

### Creating an instance

You can create a new instance of `ts` with a custom config.

##### ts.create([config])

```js
const instance = ts.create({
  baseURL: 'https://example.com/api/',
  timeout: '30s',
  headers: {
  	'X-Custom-Header': 'hello!'
  }
});
```

### Instance methods

The available instance methods are listed below. The specified config will be merged with the instance config.

```js
ts(config)
```

```js
ts.options(url[, config])
```

```js
ts.get(url[, config])
```

```js
ts.head(url[, config])
```

```js
ts.patch(url[, data[, config]])
```

```js
ts.post(url[, data[, config]])
```

```js
ts.put(url[, data[, config]])
```

```js
ts.delete(url[, config])
```

## Request Configs

### Generally Setting Configs

the some config setting Type:
> `Boolean` or `Numeric`: you can set value: `ture`, `false`, `0`, `1`

`timeouts` can be set using the following format:
> `1` ~ `99` = 1 ~ 99 Seconds  
> `1000` = 1 Seconds  
> `60000` = 1 Minutes  
> `3600000` = 1 Hours  
> `1s` = 1 Seconds  
> `1m` = 1 Minutes  
> `1h` = 1 Hours

| Variable | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| async | Boolean or Numeric | true | An optional Boolean parameter, defaulting to `true`, indicating whether or not to perform the operation asynchronously. If this value is `false`, the `send()` method does not return until the response is received. If `true`, notification of a completed transaction is provided using event listeners. This must be true if the `multipart` attribute is `true`, or an exception will be thrown. |
| autoContentType | Boolean or Numeric | true | Automatically check url filename as set request content type |
| baseURL | String or Null | null | will be prepended to `url` unless `url` is absolute. It can be convenient to set `baseURL` for an instance of `ts` to pass relative URLs to methods of that instance |
| cache | Boolean or Numeric | false | Whether to use cache when sending requests to the server |
| data | Object or FormData | {} | the data to be sent as the request body |
| encryption | Boolean or Numeric | false | Whether to use BASE64 encrypted data to request data from the server, if is `true` will encode base64 data and send to server in headers |
| headers | Object | {} | custom headers to be sent |
| logRecord | Boolean or Numeric | true | Whether to record all requested information, if is `ture` can use `ts.logShow()` for devtools console saw all log |
| method | String or Null | get | The HTTP request method to use, such as `"OPTIONS"`, `"GET"`, `"HEAD"`, `"PATCH"`, `"POST"`, `"PUT"`, `"DELETE"`, etc. Ignored for non-HTTP(S) URLs. |
| responseType | String or Null | text | The `XMLHttpRequest` property `responseType` is an enumerated string value specifying the type of data contained in the response. It also lets the author change the response type. If an empty string is set as the value of `responseType`, the default value of `text` is used. allow value: `""`, `"arraybuffer"`, `"blob"`, `"document"`, `"json"`, `"text"` |
| timeouts | String or Numeric | 0 | specifies the number of milliseconds before the request times out. If the request takes longer than `timeout`, the request will be aborted, default is `0` (no timeout) |
| url | String or Null | null | A string or any other object with a stringifier — including a URL object — that provides the URL of the resource to send the request to. |
| withCredentials | Boolean or Numeric | false | The `XMLHttpRequest.withCredentials` property is a boolean value that indicates whether or not cross-site `Access-Control` requests should be made using credentials such as cookies, authorization headers or TLS client certificates. Setting `withCredentials` has no effect on same-origin requests. |

### Custom Callback Function Configs

> If you don't want to use then to callback to process the data, you can set it like using jQuery.ajax set

| Variable | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| done | Function or Null | Null | setting for function in callback, can use this or `loadend` |
| fail | Function or Null | Null | setting for function in callback, can use this or `error` |
| cancel | Function or Null | Null | setting for function in callback, can use this or `abort` |
| abort | Function or Null | Null | setting for function in callback, can use this or `cancel` |
| error | Function or Null | Null | setting for function in callback, can use this or `fail`|
| loadend | Function or Null | Null | setting for function in callback, can use this or `done` |
| readystatechange | Function or Null | Null | setting for function in callback |
| timeout | Function or Null | Null | setting for function in callback |
| download | Function or Null | Null | setting for function in callback |
| downloadProgress | Function or Null | Null | setting for function in progress callback |
| upload | Function or Null | Null | setting for function in callback |
| uploadProgress | Function or Null | Null | setting for function in progress callback |

## Response Schema

| Property | Definition |
| -------- | ---------- |
| url | the this time request full url |
| data | the response that was provided by the server |
| headers | the HTTP headers that the server responded with all header names are lowercase and can be accessed using the bracket notation. Example: `response.headers['content-type']` |
| status | HTTP response status code. See [here](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes) for common HTTP response status code meanings. |
| statusText | XMLHttpRequest response statusText. See [here](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/statusText) for common XMLHttpRequest response statusText meanings. |

## Errors Schema

| Property | Definition |
| -------- | ---------- |
| message | A quick summary of the error message and the status it failed with. |
| name | This defines where the error originated from. For ts |
| stack | Provides the stack trace of the error. |
| fn | An function name. |
| configs | An ts config object with specific instance configurations defined by the user from when the request was made |
| url | An request url. |
| status | HTTP response status code. See [here](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes) for common HTTP response status code meanings. |

## More

> Coming soon