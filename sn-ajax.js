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

function SnAjaxClient (config) {
    var self = this;
    self.token = "";
    self.config = config;
    self.request = require("request");
    self.uri = "https://" + config.host + "/";
    self.jar = self.request.jar();
    self.reqOptions = {
		followAllRedirects : true,
		headers : HEADERS,
        gzip: true,
		jar : self.jar
	};
}
SnAjaxClient.prototype.login = function (cb) {
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
    self.executeRequest(options, function(err, response, body) {
        var ck = body.split("var g_ck = '")[1].split('\'')[0];
        self.token = ck;
        cb(ck);
    });
};
SnAjaxClient.prototype.glideAjax = function (proc, name, params, cb) {
    var self = this;
    params.sysparm_processor = proc;
    params.sysparm_name = name;
    this.xmlhttp(proc, params, cb);
};
SnAjaxClient.prototype.xmlhttp = function (proc, params, cb) {
    var self = this;
    params.sysparm_processor = proc;
    var options = {
        method: "POST",
        form: params,
        uri: self.uri + 'xmlhttp.do'
    };
    self.executeRequest(options, function(err, response, body) {
        parseString(body, function (e, result) {
            console.log(body);
            cb(result.xml.$.answer);
		});
    });
};
SnAjaxClient.prototype.executeRequest = function (options, cb) {
    var self = this;
    options = self._getOptions(options);
    self.request(options, function(err, response, body) {
        cb(err, response, body);
    });
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
