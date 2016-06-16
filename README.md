# sn-ajax
NodeJS Service-Now Ajax Library
This Library can make GlideAjax Requests, with this possibilty you can execute Server-Side Code.

**Example Usage**

```javascript
var snajax = require('./sn-ajax.js');
var client = new snajax.SnAjaxClient({
    host: 'demo.service-now.com',
    user: 'admin',
    pass: 'admin'
});
client.login(function (token) {
    console.log(token);

    var script = 'gs.log("test")';
    var params = {
        'sysparm_script': script
    };
    client.glideAjax('SPScriptEval', 'evaljs', params, function (err, res) {
        console.log(res);
    });
});

```
