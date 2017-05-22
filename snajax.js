var Promise = require('promise');
var h2p = require('html2plaintext');
var parseString = require('xml2js').parseString;
var HEADERS = {
    "Accept": "*/*",
    "Connection": "keep-alive",
    "Cache-Control": "max-age=0",
    "User-Agent": "SN-Node Client",
    "Accept-Encoding": "gzip, deflate",
    "Accept-Language": "en-US,en;q=0.8",
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
};

function SnAjaxClient(config) {
    var self = this;
    self.token = "";
    self.config = config;
    self.request = require('request-promise');
    self.uri = "https://" + config.host + "/";
    self.jar = self.request.jar();
    self.reqOptions = {
        followAllRedirects: true,
        headers: HEADERS,
        gzip: true,
        jar: self.jar
    };
}
SnAjaxClient.prototype.login = function () {
    var self = this;
    var loginData = {
        "user_name": self.config.user,
        "user_password": self.config.pass,
        "remember_me": "true",
        "sys_action": "sysverb_login"
    };
    var options = {
        method: "POST",
        form: loginData,
        uri: self.uri + 'login.do'
    };
    return this.executeRequest(options).then(function (body) {
        var ck = body.split("var g_ck = '")[1].split('\'')[0];
        self.token = ck;
        return self.token;
    });
};
SnAjaxClient.prototype.evalScript = function (script, scope) {
    var options = {
        'method': 'POST',
        'form': {
            "script": script,
            "sysparm_ck": this.token,
            "sys_scope": scope,
            "runscript": "Run script",
            "quota_managed_transaction": "on"
        },
        'uri': this.uri + 'sys.scripts.do'
    };
    return this.executeRequest(options).then(function(b) {
        return h2p(b);
    });
};
SnAjaxClient.prototype.glideAjax = function (proc, name, params) {
    var self = this;
    params.sysparm_processor = proc;
    params.sysparm_name = name;
    return this.xmlhttp(proc, params);
};
SnAjaxClient.prototype.xmlhttp = function (proc, params) {
    var self = this;
    params.sysparm_processor = proc;
    var options = {
        method: "POST",
        form: params,
        uri: self.uri + 'xmlhttp.do'
    };
    return this.executeRequest(options).then(function (body) {
        return new Promise(function (resolve, reject) {
            parseString(body, function (err, result) {
                if (err) reject(err);
                else resolve(result.xml.$.answer);
            });
        });
    });
};
SnAjaxClient.prototype.executeRequest = function (options) {
    options = this._getOptions(options);
    return this.request(options);
};
SnAjaxClient.prototype._getOptions = function (customOptions, customHeaders) {
    var self = this;
    var newOptions = {};
    for (var i in self.reqOptions) {
        newOptions[i] = self.reqOptions[i];
    }
    for (i in customOptions) {
        newOptions[i] = customOptions[i];
    }
    for (i in customHeaders) {
        newOptions.headers[i] = customHeaders[i];
    }
    newOptions.headers['X-UserToken'] = self.token;
    return newOptions;
};
module.exports.SnAjaxClient = SnAjaxClient;