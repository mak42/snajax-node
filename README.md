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

client.login()
    .then(function (token) {
        var scope = "d98af49e0f023200547906ace1050e74";
        var script = "gs.print('test')";
        return client.evalScript(script, scope);
    }).then(function(res) {
        console.log(res);
    });

client.login()
    .then(function (token) {
        var incidentSysId = "e98af49e0f0245204547906ace1200e8";
        var params = {
            'sysparm_sys_id': incidentSysId
        };
        return client.glideAjax('SPScriptEval', 'evaljs');
    }).then(function(answer) {
        console.log(answer);
    });

```
