(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["elastic-apm-rum"] = factory();
	else
		root["elastic-apm-rum"] = factory();
})(self, function() {
return /******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "../rum-core/dist/es/bootstrap.js":
/*!****************************************!*\
  !*** ../rum-core/dist/es/bootstrap.js ***!
  \****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   bootstrap: function() { return /* binding */ bootstrap; }
/* harmony export */ });
/* harmony import */ var _common_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./common/utils */ "../rum-core/dist/es/common/utils.js");
/* harmony import */ var _common_patching__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./common/patching */ "../rum-core/dist/es/common/patching/index.js");
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./state */ "../rum-core/dist/es/state.js");



var enabled = false;
function bootstrap() {
  if ((0,_common_utils__WEBPACK_IMPORTED_MODULE_0__.isPlatformSupported)()) {
    (0,_common_patching__WEBPACK_IMPORTED_MODULE_1__.patchAll)();
    _state__WEBPACK_IMPORTED_MODULE_2__.state.bootstrapTime = (0,_common_utils__WEBPACK_IMPORTED_MODULE_0__.now)();
    enabled = true;
  } else if (_common_utils__WEBPACK_IMPORTED_MODULE_0__.isBrowser) {
    console.log('[Elastic APM] platform is not supported!');
  }

  return enabled;
}

/***/ }),

/***/ "../rum-core/dist/es/common/after-frame.js":
/*!*************************************************!*\
  !*** ../rum-core/dist/es/common/after-frame.js ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ afterFrame; }
/* harmony export */ });
var RAF_TIMEOUT = 100;
function afterFrame(callback) {
  var handler = function handler() {
    clearTimeout(timeout);
    cancelAnimationFrame(raf);
    setTimeout(callback);
  };

  var timeout = setTimeout(handler, RAF_TIMEOUT);
  var raf = requestAnimationFrame(handler);
}

/***/ }),

/***/ "../rum-core/dist/es/common/apm-server.js":
/*!************************************************!*\
  !*** ../rum-core/dist/es/common/apm-server.js ***!
  \************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _queue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./queue */ "../rum-core/dist/es/common/queue.js");
/* harmony import */ var _throttle__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./throttle */ "../rum-core/dist/es/common/throttle.js");
/* harmony import */ var _ndjson__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./ndjson */ "../rum-core/dist/es/common/ndjson.js");
/* harmony import */ var _truncate__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./truncate */ "../rum-core/dist/es/common/truncate.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./constants */ "../rum-core/dist/es/common/constants.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "../rum-core/dist/es/common/utils.js");
/* harmony import */ var _polyfills__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./polyfills */ "../rum-core/dist/es/common/polyfills.js");
/* harmony import */ var _compress__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./compress */ "../rum-core/dist/es/common/compress.js");
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../state */ "../rum-core/dist/es/state.js");
/* harmony import */ var _http_fetch__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./http/fetch */ "../rum-core/dist/es/common/http/fetch.js");
/* harmony import */ var _http_xhr__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./http/xhr */ "../rum-core/dist/es/common/http/xhr.js");











var THROTTLE_INTERVAL = 60000;

var ApmServer = function () {
  function ApmServer(configService, loggingService) {
    this._configService = configService;
    this._loggingService = loggingService;
    this.queue = undefined;
    this.throttleEvents = _utils__WEBPACK_IMPORTED_MODULE_0__.noop;
  }

  var _proto = ApmServer.prototype;

  _proto.init = function init() {
    var _this = this;

    var queueLimit = this._configService.get('queueLimit');

    var flushInterval = this._configService.get('flushInterval');

    var limit = this._configService.get('eventsLimit');

    var onFlush = function onFlush(events) {
      var promise = _this.sendEvents(events);

      if (promise) {
        promise.catch(function (reason) {
          _this._loggingService.warn('Failed sending events!', _this._constructError(reason));
        });
      }
    };

    this.queue = new _queue__WEBPACK_IMPORTED_MODULE_1__["default"](onFlush, {
      queueLimit: queueLimit,
      flushInterval: flushInterval
    });
    this.throttleEvents = (0,_throttle__WEBPACK_IMPORTED_MODULE_2__["default"])(this.queue.add.bind(this.queue), function () {
      return _this._loggingService.warn('Dropped events due to throttling!');
    }, {
      limit: limit,
      interval: THROTTLE_INTERVAL
    });

    this._configService.observeEvent(_constants__WEBPACK_IMPORTED_MODULE_3__.QUEUE_FLUSH, function () {
      _this.queue.flush();
    });
  };

  _proto._postJson = function _postJson(endPoint, payload) {
    var _this2 = this;

    var headers = {
      'Content-Type': 'application/x-ndjson'
    };

    var apmRequest = this._configService.get('apmRequest');

    var params = {
      payload: payload,
      headers: headers,
      beforeSend: apmRequest
    };
    return (0,_compress__WEBPACK_IMPORTED_MODULE_4__.compressPayload)(params).catch(function (error) {
      if (_state__WEBPACK_IMPORTED_MODULE_5__.__DEV__) {
        _this2._loggingService.debug('Compressing the payload using CompressionStream API failed', error.message);
      }

      return params;
    }).then(function (result) {
      return _this2._makeHttpRequest('POST', endPoint, result);
    }).then(function (_ref) {
      var responseText = _ref.responseText;
      return responseText;
    });
  };

  _proto._constructError = function _constructError(reason) {
    var url = reason.url,
        status = reason.status,
        responseText = reason.responseText;

    if (typeof status == 'undefined') {
      return reason;
    }

    var message = url + ' HTTP status: ' + status;

    if (_state__WEBPACK_IMPORTED_MODULE_5__.__DEV__ && responseText) {
      try {
        var serverErrors = [];
        var response = JSON.parse(responseText);

        if (response.errors && response.errors.length > 0) {
          response.errors.forEach(function (err) {
            return serverErrors.push(err.message);
          });
          message += ' ' + serverErrors.join(',');
        }
      } catch (e) {
        this._loggingService.debug('Error parsing response from APM server', e);
      }
    }

    return new Error(message);
  };

  _proto._makeHttpRequest = function _makeHttpRequest(method, url, _temp) {
    var _ref2 = _temp === void 0 ? {} : _temp,
        _ref2$timeout = _ref2.timeout,
        timeout = _ref2$timeout === void 0 ? _constants__WEBPACK_IMPORTED_MODULE_3__.HTTP_REQUEST_TIMEOUT : _ref2$timeout,
        payload = _ref2.payload,
        headers = _ref2.headers,
        beforeSend = _ref2.beforeSend;

    var sendCredentials = this._configService.get('sendCredentials');

    if (!beforeSend && (0,_http_fetch__WEBPACK_IMPORTED_MODULE_6__.shouldUseFetchWithKeepAlive)(method, payload)) {
      return (0,_http_fetch__WEBPACK_IMPORTED_MODULE_6__.sendFetchRequest)(method, url, {
        keepalive: true,
        timeout: timeout,
        payload: payload,
        headers: headers,
        sendCredentials: sendCredentials
      }).catch(function (reason) {
        if (reason instanceof TypeError) {
          return (0,_http_xhr__WEBPACK_IMPORTED_MODULE_7__.sendXHR)(method, url, {
            timeout: timeout,
            payload: payload,
            headers: headers,
            beforeSend: beforeSend,
            sendCredentials: sendCredentials
          });
        }

        throw reason;
      });
    }

    return (0,_http_xhr__WEBPACK_IMPORTED_MODULE_7__.sendXHR)(method, url, {
      timeout: timeout,
      payload: payload,
      headers: headers,
      beforeSend: beforeSend,
      sendCredentials: sendCredentials
    });
  };

  _proto.fetchConfig = function fetchConfig(serviceName, environment) {
    var _this3 = this;

    var _this$getEndpoints = this.getEndpoints(),
        configEndpoint = _this$getEndpoints.configEndpoint;

    if (!serviceName) {
      return _polyfills__WEBPACK_IMPORTED_MODULE_8__.Promise.reject('serviceName is required for fetching central config.');
    }

    configEndpoint += "?service.name=" + serviceName;

    if (environment) {
      configEndpoint += "&service.environment=" + environment;
    }

    var localConfig = this._configService.getLocalConfig();

    if (localConfig) {
      configEndpoint += "&ifnonematch=" + localConfig.etag;
    }

    var apmRequest = this._configService.get('apmRequest');

    return this._makeHttpRequest('GET', configEndpoint, {
      timeout: 5000,
      beforeSend: apmRequest
    }).then(function (xhr) {
      var status = xhr.status,
          responseText = xhr.responseText;

      if (status === 304) {
        return localConfig;
      } else {
        var remoteConfig = JSON.parse(responseText);
        var etag = xhr.getResponseHeader('etag');

        if (etag) {
          remoteConfig.etag = etag.replace(/["]/g, '');

          _this3._configService.setLocalConfig(remoteConfig, true);
        }

        return remoteConfig;
      }
    }).catch(function (reason) {
      var error = _this3._constructError(reason);

      return _polyfills__WEBPACK_IMPORTED_MODULE_8__.Promise.reject(error);
    });
  };

  _proto.createMetaData = function createMetaData() {
    var cfg = this._configService;
    var metadata = {
      service: {
        name: cfg.get('serviceName'),
        version: cfg.get('serviceVersion'),
        agent: {
          name: 'rum-js',
          version: cfg.version
        },
        language: {
          name: 'javascript'
        },
        environment: cfg.get('environment')
      },
      labels: cfg.get('context.tags')
    };
    return (0,_truncate__WEBPACK_IMPORTED_MODULE_9__.truncateModel)(_truncate__WEBPACK_IMPORTED_MODULE_9__.METADATA_MODEL, metadata);
  };

  _proto.addError = function addError(error) {
    var _this$throttleEvents;

    this.throttleEvents((_this$throttleEvents = {}, _this$throttleEvents[_constants__WEBPACK_IMPORTED_MODULE_3__.ERRORS] = error, _this$throttleEvents));
  };

  _proto.addTransaction = function addTransaction(transaction) {
    var _this$throttleEvents2;

    this.throttleEvents((_this$throttleEvents2 = {}, _this$throttleEvents2[_constants__WEBPACK_IMPORTED_MODULE_3__.TRANSACTIONS] = transaction, _this$throttleEvents2));
  };

  _proto.ndjsonErrors = function ndjsonErrors(errors, compress) {
    var key = compress ? 'e' : 'error';
    return errors.map(function (error) {
      var _NDJSON$stringify;

      return _ndjson__WEBPACK_IMPORTED_MODULE_10__["default"].stringify((_NDJSON$stringify = {}, _NDJSON$stringify[key] = compress ? (0,_compress__WEBPACK_IMPORTED_MODULE_4__.compressError)(error) : error, _NDJSON$stringify));
    });
  };

  _proto.ndjsonMetricsets = function ndjsonMetricsets(metricsets) {
    return metricsets.map(function (metricset) {
      return _ndjson__WEBPACK_IMPORTED_MODULE_10__["default"].stringify({
        metricset: metricset
      });
    }).join('');
  };

  _proto.ndjsonTransactions = function ndjsonTransactions(transactions, compress) {
    var _this4 = this;

    var key = compress ? 'x' : 'transaction';
    return transactions.map(function (tr) {
      var _NDJSON$stringify2;

      var spans = '',
          breakdowns = '';

      if (!compress) {
        if (tr.spans) {
          spans = tr.spans.map(function (span) {
            return _ndjson__WEBPACK_IMPORTED_MODULE_10__["default"].stringify({
              span: span
            });
          }).join('');
          delete tr.spans;
        }

        if (tr.breakdown) {
          breakdowns = _this4.ndjsonMetricsets(tr.breakdown);
          delete tr.breakdown;
        }
      }

      return _ndjson__WEBPACK_IMPORTED_MODULE_10__["default"].stringify((_NDJSON$stringify2 = {}, _NDJSON$stringify2[key] = compress ? (0,_compress__WEBPACK_IMPORTED_MODULE_4__.compressTransaction)(tr) : tr, _NDJSON$stringify2)) + spans + breakdowns;
    });
  };

  _proto.sendEvents = function sendEvents(events) {
    var _payload, _NDJSON$stringify3;

    if (events.length === 0) {
      return;
    }

    var transactions = [];
    var errors = [];

    for (var i = 0; i < events.length; i++) {
      var event = events[i];

      if (event[_constants__WEBPACK_IMPORTED_MODULE_3__.TRANSACTIONS]) {
        transactions.push(event[_constants__WEBPACK_IMPORTED_MODULE_3__.TRANSACTIONS]);
      }

      if (event[_constants__WEBPACK_IMPORTED_MODULE_3__.ERRORS]) {
        errors.push(event[_constants__WEBPACK_IMPORTED_MODULE_3__.ERRORS]);
      }
    }

    if (transactions.length === 0 && errors.length === 0) {
      return;
    }

    var cfg = this._configService;
    var payload = (_payload = {}, _payload[_constants__WEBPACK_IMPORTED_MODULE_3__.TRANSACTIONS] = transactions, _payload[_constants__WEBPACK_IMPORTED_MODULE_3__.ERRORS] = errors, _payload);
    var filteredPayload = cfg.applyFilters(payload);

    if (!filteredPayload) {
      this._loggingService.warn('Dropped payload due to filtering!');

      return;
    }

    var apiVersion = cfg.get('apiVersion');
    var compress = apiVersion > 2;
    var ndjson = [];
    var metadata = this.createMetaData();
    var metadataKey = compress ? 'm' : 'metadata';
    ndjson.push(_ndjson__WEBPACK_IMPORTED_MODULE_10__["default"].stringify((_NDJSON$stringify3 = {}, _NDJSON$stringify3[metadataKey] = compress ? (0,_compress__WEBPACK_IMPORTED_MODULE_4__.compressMetadata)(metadata) : metadata, _NDJSON$stringify3)));
    ndjson = ndjson.concat(this.ndjsonErrors(filteredPayload[_constants__WEBPACK_IMPORTED_MODULE_3__.ERRORS], compress), this.ndjsonTransactions(filteredPayload[_constants__WEBPACK_IMPORTED_MODULE_3__.TRANSACTIONS], compress));
    var ndjsonPayload = ndjson.join('');

    var _this$getEndpoints2 = this.getEndpoints(),
        intakeEndpoint = _this$getEndpoints2.intakeEndpoint;

    return this._postJson(intakeEndpoint, ndjsonPayload);
  };

  _proto.getEndpoints = function getEndpoints() {
    var serverUrl = this._configService.get('serverUrl');

    var apiVersion = this._configService.get('apiVersion');

    var serverUrlPrefix = this._configService.get('serverUrlPrefix') || "/intake/v" + apiVersion + "/rum/events";
    var intakeEndpoint = serverUrl + serverUrlPrefix;
    var configEndpoint = serverUrl + "/config/v1/rum/agents";
    return {
      intakeEndpoint: intakeEndpoint,
      configEndpoint: configEndpoint
    };
  };

  return ApmServer;
}();

/* harmony default export */ __webpack_exports__["default"] = (ApmServer);

/***/ }),

/***/ "../rum-core/dist/es/common/compress.js":
/*!**********************************************!*\
  !*** ../rum-core/dist/es/common/compress.js ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   compressError: function() { return /* binding */ compressError; },
/* harmony export */   compressMetadata: function() { return /* binding */ compressMetadata; },
/* harmony export */   compressMetricsets: function() { return /* binding */ compressMetricsets; },
/* harmony export */   compressPayload: function() { return /* binding */ compressPayload; },
/* harmony export */   compressTransaction: function() { return /* binding */ compressTransaction; }
/* harmony export */ });
/* harmony import */ var _polyfills__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./polyfills */ "../rum-core/dist/es/common/polyfills.js");
/* harmony import */ var _performance_monitoring_navigation_marks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../performance-monitoring/navigation/marks */ "../rum-core/dist/es/performance-monitoring/navigation/marks.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils */ "../rum-core/dist/es/common/utils.js");




function compressStackFrames(frames) {
  return frames.map(function (frame) {
    return {
      ap: frame.abs_path,
      f: frame.filename,
      fn: frame.function,
      li: frame.lineno,
      co: frame.colno
    };
  });
}

function compressResponse(response) {
  return {
    ts: response.transfer_size,
    ebs: response.encoded_body_size,
    dbs: response.decoded_body_size
  };
}

function compressHTTP(http) {
  var compressed = {};
  var method = http.method,
      status_code = http.status_code,
      url = http.url,
      response = http.response;
  compressed.url = url;

  if (method) {
    compressed.mt = method;
  }

  if (status_code) {
    compressed.sc = status_code;
  }

  if (response) {
    compressed.r = compressResponse(response);
  }

  return compressed;
}

function compressContext(context) {
  if (!context) {
    return null;
  }

  var compressed = {};
  var page = context.page,
      http = context.http,
      response = context.response,
      destination = context.destination,
      user = context.user,
      custom = context.custom;

  if (page) {
    compressed.p = {
      rf: page.referer,
      url: page.url
    };
  }

  if (http) {
    compressed.h = compressHTTP(http);
  }

  if (response) {
    compressed.r = compressResponse(response);
  }

  if (destination) {
    var service = destination.service;
    compressed.dt = {
      se: {
        n: service.name,
        t: service.type,
        rc: service.resource
      },
      ad: destination.address,
      po: destination.port
    };
  }

  if (user) {
    compressed.u = {
      id: user.id,
      un: user.username,
      em: user.email
    };
  }

  if (custom) {
    compressed.cu = custom;
  }

  return compressed;
}

function compressMarks(marks) {
  if (!marks) {
    return null;
  }

  var compressedNtMarks = compressNavigationTimingMarks(marks.navigationTiming);
  var compressed = {
    nt: compressedNtMarks,
    a: compressAgentMarks(compressedNtMarks, marks.agent)
  };
  return compressed;
}

function compressNavigationTimingMarks(ntMarks) {
  if (!ntMarks) {
    return null;
  }

  var compressed = {};
  _performance_monitoring_navigation_marks__WEBPACK_IMPORTED_MODULE_0__.COMPRESSED_NAV_TIMING_MARKS.forEach(function (mark, index) {
    var mapping = _performance_monitoring_navigation_marks__WEBPACK_IMPORTED_MODULE_0__.NAVIGATION_TIMING_MARKS[index];
    compressed[mark] = ntMarks[mapping];
  });
  return compressed;
}

function compressAgentMarks(compressedNtMarks, agentMarks) {
  var compressed = {};

  if (compressedNtMarks) {
    compressed = {
      fb: compressedNtMarks.rs,
      di: compressedNtMarks.di,
      dc: compressedNtMarks.dc
    };
  }

  if (agentMarks) {
    var fp = agentMarks.firstContentfulPaint;
    var lp = agentMarks.largestContentfulPaint;

    if (fp) {
      compressed.fp = fp;
    }

    if (lp) {
      compressed.lp = lp;
    }
  }

  if (Object.keys(compressed).length === 0) {
    return null;
  }

  return compressed;
}

function compressMetadata(metadata) {
  var service = metadata.service,
      labels = metadata.labels;
  var agent = service.agent,
      language = service.language;
  return {
    se: {
      n: service.name,
      ve: service.version,
      a: {
        n: agent.name,
        ve: agent.version
      },
      la: {
        n: language.name
      },
      en: service.environment
    },
    l: labels
  };
}
function compressTransaction(transaction) {
  var spans = transaction.spans.map(function (span) {
    var spanData = {
      id: span.id,
      n: span.name,
      t: span.type,
      s: span.start,
      d: span.duration,
      c: compressContext(span.context),
      o: span.outcome,
      sr: span.sample_rate
    };

    if (span.parent_id !== transaction.id) {
      spanData.pid = span.parent_id;
    }

    if (span.sync === true) {
      spanData.sy = true;
    }

    if (span.subtype) {
      spanData.su = span.subtype;
    }

    if (span.action) {
      spanData.ac = span.action;
    }

    return spanData;
  });
  var tr = {
    id: transaction.id,
    tid: transaction.trace_id,
    n: transaction.name,
    t: transaction.type,
    d: transaction.duration,
    c: compressContext(transaction.context),
    k: compressMarks(transaction.marks),
    me: compressMetricsets(transaction.breakdown),
    y: spans,
    yc: {
      sd: spans.length
    },
    sm: transaction.sampled,
    sr: transaction.sample_rate,
    o: transaction.outcome
  };

  if (transaction.experience) {
    var _transaction$experien = transaction.experience,
        cls = _transaction$experien.cls,
        fid = _transaction$experien.fid,
        tbt = _transaction$experien.tbt,
        longtask = _transaction$experien.longtask;
    tr.exp = {
      cls: cls,
      fid: fid,
      tbt: tbt,
      lt: longtask
    };
  }

  if (transaction.session) {
    var _transaction$session = transaction.session,
        id = _transaction$session.id,
        sequence = _transaction$session.sequence;
    tr.ses = {
      id: id,
      seq: sequence
    };
  }

  return tr;
}
function compressError(error) {
  var exception = error.exception;
  var compressed = {
    id: error.id,
    cl: error.culprit,
    ex: {
      mg: exception.message,
      st: compressStackFrames(exception.stacktrace),
      t: error.type
    },
    c: compressContext(error.context)
  };
  var transaction = error.transaction;

  if (transaction) {
    compressed.tid = error.trace_id;
    compressed.pid = error.parent_id;
    compressed.xid = error.transaction_id;
    compressed.x = {
      t: transaction.type,
      sm: transaction.sampled
    };
  }

  return compressed;
}
function compressMetricsets(breakdowns) {
  return breakdowns.map(function (_ref) {
    var span = _ref.span,
        samples = _ref.samples;
    return {
      y: {
        t: span.type
      },
      sa: {
        ysc: {
          v: samples['span.self_time.count'].value
        },
        yss: {
          v: samples['span.self_time.sum.us'].value
        }
      }
    };
  });
}
function compressPayload(params, type) {
  if (type === void 0) {
    type = 'gzip';
  }

  var isCompressionStreamSupported = typeof CompressionStream === 'function';
  return new _polyfills__WEBPACK_IMPORTED_MODULE_1__.Promise(function (resolve) {
    if (!isCompressionStreamSupported) {
      return resolve(params);
    }

    if ((0,_utils__WEBPACK_IMPORTED_MODULE_2__.isBeaconInspectionEnabled)()) {
      return resolve(params);
    }

    var payload = params.payload,
        headers = params.headers,
        beforeSend = params.beforeSend;
    var payloadStream = new Blob([payload]).stream();
    var compressedStream = payloadStream.pipeThrough(new CompressionStream(type));
    return new Response(compressedStream).blob().then(function (payload) {
      headers['Content-Encoding'] = type;
      return resolve({
        payload: payload,
        headers: headers,
        beforeSend: beforeSend
      });
    });
  });
}

/***/ }),

/***/ "../rum-core/dist/es/common/config-service.js":
/*!****************************************************!*\
  !*** ../rum-core/dist/es/common/config-service.js ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "../rum-core/dist/es/common/utils.js");
/* harmony import */ var _event_handler__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./event-handler */ "../rum-core/dist/es/common/event-handler.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./constants */ "../rum-core/dist/es/common/constants.js");
function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}





function getConfigFromScript() {
  var script = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.getCurrentScript)();
  var config = getDataAttributesFromNode(script);
  return config;
}

function getDataAttributesFromNode(node) {
  if (!node) {
    return {};
  }

  var dataAttrs = {};
  var dataRegex = /^data-([\w-]+)$/;
  var attrs = node.attributes;

  for (var i = 0; i < attrs.length; i++) {
    var attr = attrs[i];

    if (dataRegex.test(attr.nodeName)) {
      var key = attr.nodeName.match(dataRegex)[1];
      var camelCasedkey = key.split('-').map(function (value, index) {
        return index > 0 ? value.charAt(0).toUpperCase() + value.substring(1) : value;
      }).join('');
      dataAttrs[camelCasedkey] = attr.value || attr.nodeValue;
    }
  }

  return dataAttrs;
}

var Config = function () {
  function Config() {
    this.config = {
      serviceName: '',
      serviceVersion: '',
      environment: '',
      serverUrl: 'http://localhost:8200',
      serverUrlPrefix: '',
      active: true,
      instrument: true,
      disableInstrumentations: [],
      logLevel: 'warn',
      breakdownMetrics: false,
      ignoreTransactions: [],
      eventsLimit: 80,
      queueLimit: -1,
      flushInterval: 500,
      distributedTracing: true,
      distributedTracingOrigins: [],
      distributedTracingHeaderName: 'traceparent',
      pageLoadTraceId: '',
      pageLoadSpanId: '',
      pageLoadSampled: false,
      pageLoadTransactionName: '',
      propagateTracestate: false,
      transactionSampleRate: 1.0,
      centralConfig: false,
      monitorLongtasks: true,
      apiVersion: 2,
      context: {},
      session: false,
      apmRequest: null,
      sendCredentials: false
    };
    this.events = new _event_handler__WEBPACK_IMPORTED_MODULE_1__["default"]();
    this.filters = [];
    this.version = '';
  }

  var _proto = Config.prototype;

  _proto.init = function init() {
    var scriptData = getConfigFromScript();
    this.setConfig(scriptData);
  };

  _proto.setVersion = function setVersion(version) {
    this.version = version;
  };

  _proto.addFilter = function addFilter(cb) {
    if (typeof cb !== 'function') {
      throw new Error('Argument to must be function');
    }

    this.filters.push(cb);
  };

  _proto.applyFilters = function applyFilters(data) {
    for (var i = 0; i < this.filters.length; i++) {
      data = this.filters[i](data);

      if (!data) {
        return;
      }
    }

    return data;
  };

  _proto.get = function get(key) {
    return key.split('.').reduce(function (obj, objKey) {
      return obj && obj[objKey];
    }, this.config);
  };

  _proto.setUserContext = function setUserContext(userContext) {
    if (userContext === void 0) {
      userContext = {};
    }

    var context = {};
    var _userContext = userContext,
        id = _userContext.id,
        username = _userContext.username,
        email = _userContext.email;

    if (typeof id === 'number' || typeof id === 'string') {
      context.id = id;
    }

    if (typeof username === 'string') {
      context.username = username;
    }

    if (typeof email === 'string') {
      context.email = email;
    }

    this.config.context.user = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.extend)(this.config.context.user || {}, context);
  };

  _proto.setCustomContext = function setCustomContext(customContext) {
    if (customContext === void 0) {
      customContext = {};
    }

    this.config.context.custom = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.extend)(this.config.context.custom || {}, customContext);
  };

  _proto.addLabels = function addLabels(tags) {
    var _this = this;

    if (!this.config.context.tags) {
      this.config.context.tags = {};
    }

    var keys = Object.keys(tags);
    keys.forEach(function (k) {
      return (0,_utils__WEBPACK_IMPORTED_MODULE_0__.setLabel)(k, tags[k], _this.config.context.tags);
    });
  };

  _proto.setConfig = function setConfig(properties) {
    if (properties === void 0) {
      properties = {};
    }

    var _properties = properties,
        transactionSampleRate = _properties.transactionSampleRate,
        serverUrl = _properties.serverUrl;

    if (serverUrl) {
      properties.serverUrl = serverUrl.replace(/\/+$/, '');
    }

    if (!(0,_utils__WEBPACK_IMPORTED_MODULE_0__.isUndefined)(transactionSampleRate)) {
      if (transactionSampleRate < 0.0001 && transactionSampleRate > 0) {
        transactionSampleRate = 0.0001;
      }

      properties.transactionSampleRate = Math.round(transactionSampleRate * 10000) / 10000;
    }

    (0,_utils__WEBPACK_IMPORTED_MODULE_0__.merge)(this.config, properties);
    this.events.send(_constants__WEBPACK_IMPORTED_MODULE_2__.CONFIG_CHANGE, [this.config]);
  };

  _proto.validate = function validate(properties) {
    if (properties === void 0) {
      properties = {};
    }

    var requiredKeys = ['serviceName', 'serverUrl'];
    var allKeys = Object.keys(this.config);
    var errors = {
      missing: [],
      invalid: [],
      unknown: []
    };
    Object.keys(properties).forEach(function (key) {
      if (requiredKeys.indexOf(key) !== -1 && !properties[key]) {
        errors.missing.push(key);
      }

      if (allKeys.indexOf(key) === -1) {
        errors.unknown.push(key);
      }
    });

    if (properties.serviceName && !/^[a-zA-Z0-9 _-]+$/.test(properties.serviceName)) {
      errors.invalid.push({
        key: 'serviceName',
        value: properties.serviceName,
        allowed: 'a-z, A-Z, 0-9, _, -, <space>'
      });
    }

    var sampleRate = properties.transactionSampleRate;

    if (typeof sampleRate !== 'undefined' && (typeof sampleRate !== 'number' || isNaN(sampleRate) || sampleRate < 0 || sampleRate > 1)) {
      errors.invalid.push({
        key: 'transactionSampleRate',
        value: sampleRate,
        allowed: 'Number between 0 and 1'
      });
    }

    return errors;
  };

  _proto.getLocalConfig = function getLocalConfig() {
    var storage = sessionStorage;

    if (this.config.session) {
      storage = localStorage;
    }

    var config = storage.getItem(_constants__WEBPACK_IMPORTED_MODULE_2__.LOCAL_CONFIG_KEY);

    if (config) {
      return JSON.parse(config);
    }
  };

  _proto.setLocalConfig = function setLocalConfig(config, merge) {
    if (config) {
      if (merge) {
        var prevConfig = this.getLocalConfig();
        config = _extends({}, prevConfig, config);
      }

      var storage = sessionStorage;

      if (this.config.session) {
        storage = localStorage;
      }

      storage.setItem(_constants__WEBPACK_IMPORTED_MODULE_2__.LOCAL_CONFIG_KEY, JSON.stringify(config));
    }
  };

  _proto.dispatchEvent = function dispatchEvent(name, args) {
    this.events.send(name, args);
  };

  _proto.observeEvent = function observeEvent(name, fn) {
    return this.events.observe(name, fn);
  };

  return Config;
}();

/* harmony default export */ __webpack_exports__["default"] = (Config);

/***/ }),

/***/ "../rum-core/dist/es/common/constants.js":
/*!***********************************************!*\
  !*** ../rum-core/dist/es/common/constants.js ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ADD_EVENT_LISTENER_STR: function() { return /* binding */ ADD_EVENT_LISTENER_STR; },
/* harmony export */   AFTER_EVENT: function() { return /* binding */ AFTER_EVENT; },
/* harmony export */   APM_SERVER: function() { return /* binding */ APM_SERVER; },
/* harmony export */   BEFORE_EVENT: function() { return /* binding */ BEFORE_EVENT; },
/* harmony export */   CLICK: function() { return /* binding */ CLICK; },
/* harmony export */   CONFIG_CHANGE: function() { return /* binding */ CONFIG_CHANGE; },
/* harmony export */   CONFIG_SERVICE: function() { return /* binding */ CONFIG_SERVICE; },
/* harmony export */   ERROR: function() { return /* binding */ ERROR; },
/* harmony export */   ERRORS: function() { return /* binding */ ERRORS; },
/* harmony export */   ERROR_LOGGING: function() { return /* binding */ ERROR_LOGGING; },
/* harmony export */   EVENT: function() { return /* binding */ EVENT; },
/* harmony export */   EVENT_TARGET: function() { return /* binding */ EVENT_TARGET; },
/* harmony export */   FETCH: function() { return /* binding */ FETCH; },
/* harmony export */   FIRST_CONTENTFUL_PAINT: function() { return /* binding */ FIRST_CONTENTFUL_PAINT; },
/* harmony export */   FIRST_INPUT: function() { return /* binding */ FIRST_INPUT; },
/* harmony export */   HISTORY: function() { return /* binding */ HISTORY; },
/* harmony export */   HTTP_REQUEST_TIMEOUT: function() { return /* binding */ HTTP_REQUEST_TIMEOUT; },
/* harmony export */   HTTP_REQUEST_TYPE: function() { return /* binding */ HTTP_REQUEST_TYPE; },
/* harmony export */   INVOKE: function() { return /* binding */ INVOKE; },
/* harmony export */   KEYWORD_LIMIT: function() { return /* binding */ KEYWORD_LIMIT; },
/* harmony export */   LARGEST_CONTENTFUL_PAINT: function() { return /* binding */ LARGEST_CONTENTFUL_PAINT; },
/* harmony export */   LAYOUT_SHIFT: function() { return /* binding */ LAYOUT_SHIFT; },
/* harmony export */   LOCAL_CONFIG_KEY: function() { return /* binding */ LOCAL_CONFIG_KEY; },
/* harmony export */   LOGGING_SERVICE: function() { return /* binding */ LOGGING_SERVICE; },
/* harmony export */   LONG_TASK: function() { return /* binding */ LONG_TASK; },
/* harmony export */   MAX_SPAN_DURATION: function() { return /* binding */ MAX_SPAN_DURATION; },
/* harmony export */   MEASURE: function() { return /* binding */ MEASURE; },
/* harmony export */   NAME_UNKNOWN: function() { return /* binding */ NAME_UNKNOWN; },
/* harmony export */   NAVIGATION: function() { return /* binding */ NAVIGATION; },
/* harmony export */   OUTCOME_FAILURE: function() { return /* binding */ OUTCOME_FAILURE; },
/* harmony export */   OUTCOME_SUCCESS: function() { return /* binding */ OUTCOME_SUCCESS; },
/* harmony export */   OUTCOME_UNKNOWN: function() { return /* binding */ OUTCOME_UNKNOWN; },
/* harmony export */   PAGE_EXIT: function() { return /* binding */ PAGE_EXIT; },
/* harmony export */   PAGE_LOAD: function() { return /* binding */ PAGE_LOAD; },
/* harmony export */   PAGE_LOAD_DELAY: function() { return /* binding */ PAGE_LOAD_DELAY; },
/* harmony export */   PAINT: function() { return /* binding */ PAINT; },
/* harmony export */   PERFORMANCE_MONITORING: function() { return /* binding */ PERFORMANCE_MONITORING; },
/* harmony export */   QUEUE_ADD_TRANSACTION: function() { return /* binding */ QUEUE_ADD_TRANSACTION; },
/* harmony export */   QUEUE_FLUSH: function() { return /* binding */ QUEUE_FLUSH; },
/* harmony export */   REMOVE_EVENT_LISTENER_STR: function() { return /* binding */ REMOVE_EVENT_LISTENER_STR; },
/* harmony export */   RESOURCE: function() { return /* binding */ RESOURCE; },
/* harmony export */   RESOURCE_INITIATOR_TYPES: function() { return /* binding */ RESOURCE_INITIATOR_TYPES; },
/* harmony export */   REUSABILITY_THRESHOLD: function() { return /* binding */ REUSABILITY_THRESHOLD; },
/* harmony export */   ROUTE_CHANGE: function() { return /* binding */ ROUTE_CHANGE; },
/* harmony export */   SCHEDULE: function() { return /* binding */ SCHEDULE; },
/* harmony export */   SESSION_TIMEOUT: function() { return /* binding */ SESSION_TIMEOUT; },
/* harmony export */   TEMPORARY_TYPE: function() { return /* binding */ TEMPORARY_TYPE; },
/* harmony export */   TRANSACTIONS: function() { return /* binding */ TRANSACTIONS; },
/* harmony export */   TRANSACTION_END: function() { return /* binding */ TRANSACTION_END; },
/* harmony export */   TRANSACTION_IGNORE: function() { return /* binding */ TRANSACTION_IGNORE; },
/* harmony export */   TRANSACTION_SERVICE: function() { return /* binding */ TRANSACTION_SERVICE; },
/* harmony export */   TRANSACTION_START: function() { return /* binding */ TRANSACTION_START; },
/* harmony export */   TRANSACTION_TYPE_ORDER: function() { return /* binding */ TRANSACTION_TYPE_ORDER; },
/* harmony export */   TRUNCATED_TYPE: function() { return /* binding */ TRUNCATED_TYPE; },
/* harmony export */   TYPE_CUSTOM: function() { return /* binding */ TYPE_CUSTOM; },
/* harmony export */   USER_INTERACTION: function() { return /* binding */ USER_INTERACTION; },
/* harmony export */   USER_TIMING_THRESHOLD: function() { return /* binding */ USER_TIMING_THRESHOLD; },
/* harmony export */   XMLHTTPREQUEST: function() { return /* binding */ XMLHTTPREQUEST; }
/* harmony export */ });
var SCHEDULE = 'schedule';
var INVOKE = 'invoke';
var ADD_EVENT_LISTENER_STR = 'addEventListener';
var REMOVE_EVENT_LISTENER_STR = 'removeEventListener';
var RESOURCE_INITIATOR_TYPES = ['link', 'css', 'script', 'img', 'xmlhttprequest', 'fetch', 'beacon', 'iframe'];
var REUSABILITY_THRESHOLD = 5000;
var MAX_SPAN_DURATION = 5 * 60 * 1000;
var PAGE_LOAD_DELAY = 1000;
var PAGE_LOAD = 'page-load';
var ROUTE_CHANGE = 'route-change';
var TYPE_CUSTOM = 'custom';
var USER_INTERACTION = 'user-interaction';
var HTTP_REQUEST_TYPE = 'http-request';
var TEMPORARY_TYPE = 'temporary';
var NAME_UNKNOWN = 'Unknown';
var PAGE_EXIT = 'page-exit';
var TRANSACTION_TYPE_ORDER = [PAGE_LOAD, ROUTE_CHANGE, USER_INTERACTION, HTTP_REQUEST_TYPE, TYPE_CUSTOM, TEMPORARY_TYPE];
var OUTCOME_SUCCESS = 'success';
var OUTCOME_FAILURE = 'failure';
var OUTCOME_UNKNOWN = 'unknown';
var USER_TIMING_THRESHOLD = 60;
var TRANSACTION_START = 'transaction:start';
var TRANSACTION_END = 'transaction:end';
var CONFIG_CHANGE = 'config:change';
var QUEUE_FLUSH = 'queue:flush';
var QUEUE_ADD_TRANSACTION = 'queue:add_transaction';
var TRANSACTION_IGNORE = 'transaction:ignore';
var XMLHTTPREQUEST = 'xmlhttprequest';
var FETCH = 'fetch';
var HISTORY = 'history';
var EVENT_TARGET = 'eventtarget';
var CLICK = 'click';
var ERROR = 'error';
var BEFORE_EVENT = ':before';
var AFTER_EVENT = ':after';
var LOCAL_CONFIG_KEY = 'elastic_apm_config';
var LONG_TASK = 'longtask';
var PAINT = 'paint';
var MEASURE = 'measure';
var NAVIGATION = 'navigation';
var RESOURCE = 'resource';
var FIRST_CONTENTFUL_PAINT = 'first-contentful-paint';
var LARGEST_CONTENTFUL_PAINT = 'largest-contentful-paint';
var FIRST_INPUT = 'first-input';
var LAYOUT_SHIFT = 'layout-shift';
var EVENT = 'event';
var ERRORS = 'errors';
var TRANSACTIONS = 'transactions';
var CONFIG_SERVICE = 'ConfigService';
var LOGGING_SERVICE = 'LoggingService';
var TRANSACTION_SERVICE = 'TransactionService';
var APM_SERVER = 'ApmServer';
var PERFORMANCE_MONITORING = 'PerformanceMonitoring';
var ERROR_LOGGING = 'ErrorLogging';
var TRUNCATED_TYPE = '.truncated';
var KEYWORD_LIMIT = 1024;
var SESSION_TIMEOUT = 30 * 60000;
var HTTP_REQUEST_TIMEOUT = 10000;


/***/ }),

/***/ "../rum-core/dist/es/common/context.js":
/*!*********************************************!*\
  !*** ../rum-core/dist/es/common/context.js ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addSpanContext: function() { return /* binding */ addSpanContext; },
/* harmony export */   addTransactionContext: function() { return /* binding */ addTransactionContext; },
/* harmony export */   getPageContext: function() { return /* binding */ getPageContext; }
/* harmony export */ });
/* harmony import */ var _url__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./url */ "../rum-core/dist/es/common/url.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./constants */ "../rum-core/dist/es/common/constants.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "../rum-core/dist/es/common/utils.js");
var _excluded = ["tags"];

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}




var LEFT_SQUARE_BRACKET = 91;
var RIGHT_SQUARE_BRACKET = 93;
var EXTERNAL = 'external';
var RESOURCE = 'resource';
var HARD_NAVIGATION = 'hard-navigation';

function getPortNumber(port, protocol) {
  if (port === '') {
    port = protocol === 'http:' ? '80' : protocol === 'https:' ? '443' : '';
  }

  return port;
}

function getResponseContext(perfTimingEntry) {
  var transferSize = perfTimingEntry.transferSize,
      encodedBodySize = perfTimingEntry.encodedBodySize,
      decodedBodySize = perfTimingEntry.decodedBodySize,
      serverTiming = perfTimingEntry.serverTiming;
  var respContext = {
    transfer_size: transferSize,
    encoded_body_size: encodedBodySize,
    decoded_body_size: decodedBodySize
  };
  var serverTimingStr = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.getServerTimingInfo)(serverTiming);

  if (serverTimingStr) {
    respContext.headers = {
      'server-timing': serverTimingStr
    };
  }

  return respContext;
}

function getDestination(parsedUrl) {
  var port = parsedUrl.port,
      protocol = parsedUrl.protocol,
      hostname = parsedUrl.hostname;
  var portNumber = getPortNumber(port, protocol);
  var ipv6Hostname = hostname.charCodeAt(0) === LEFT_SQUARE_BRACKET && hostname.charCodeAt(hostname.length - 1) === RIGHT_SQUARE_BRACKET;
  var address = hostname;

  if (ipv6Hostname) {
    address = hostname.slice(1, -1);
  }

  return {
    service: {
      resource: hostname + ':' + portNumber,
      name: '',
      type: ''
    },
    address: address,
    port: Number(portNumber)
  };
}

function getResourceContext(data) {
  var entry = data.entry,
      url = data.url;
  var parsedUrl = new _url__WEBPACK_IMPORTED_MODULE_1__.Url(url);
  var destination = getDestination(parsedUrl);
  return {
    http: {
      url: url,
      response: getResponseContext(entry)
    },
    destination: destination
  };
}

function getExternalContext(data) {
  var url = data.url,
      method = data.method,
      target = data.target,
      response = data.response;
  var parsedUrl = new _url__WEBPACK_IMPORTED_MODULE_1__.Url(url);
  var destination = getDestination(parsedUrl);
  var context = {
    http: {
      method: method,
      url: parsedUrl.href
    },
    destination: destination
  };
  var statusCode;

  if (target && typeof target.status !== 'undefined') {
    statusCode = target.status;
  } else if (response) {
    statusCode = response.status;
  }

  context.http.status_code = statusCode;
  return context;
}

function getNavigationContext(data) {
  var url = data.url;
  var parsedUrl = new _url__WEBPACK_IMPORTED_MODULE_1__.Url(url);
  var destination = getDestination(parsedUrl);
  return {
    destination: destination
  };
}

function getPageContext() {
  return {
    page: {
      referer: document.referrer,
      url: location.href
    }
  };
}
function addSpanContext(span, data) {
  if (!data) {
    return;
  }

  var type = span.type;
  var context;

  switch (type) {
    case EXTERNAL:
      context = getExternalContext(data);
      break;

    case RESOURCE:
      context = getResourceContext(data);
      break;

    case HARD_NAVIGATION:
      context = getNavigationContext(data);
      break;
  }

  span.addContext(context);
}
function addTransactionContext(transaction, _temp) {
  var _ref = _temp === void 0 ? {} : _temp,
      tags = _ref.tags,
      configContext = _objectWithoutPropertiesLoose(_ref, _excluded);

  var pageContext = getPageContext();
  var responseContext = {};

  if (transaction.type === _constants__WEBPACK_IMPORTED_MODULE_2__.PAGE_EXIT) {
    transaction.ensureContext();

    if (transaction.context.page && transaction.context.page.url) {
      pageContext.page.url = transaction.context.page.url;
    }
  } else if (transaction.type === _constants__WEBPACK_IMPORTED_MODULE_2__.PAGE_LOAD && (0,_utils__WEBPACK_IMPORTED_MODULE_0__.isPerfTimelineSupported)()) {
    var entries = _utils__WEBPACK_IMPORTED_MODULE_0__.PERF.getEntriesByType(_constants__WEBPACK_IMPORTED_MODULE_2__.NAVIGATION);

    if (entries && entries.length > 0) {
      responseContext = {
        response: getResponseContext(entries[0])
      };
    }
  }

  transaction.addContext(pageContext, responseContext, configContext);
}

/***/ }),

/***/ "../rum-core/dist/es/common/event-handler.js":
/*!***************************************************!*\
  !*** ../rum-core/dist/es/common/event-handler.js ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants */ "../rum-core/dist/es/common/constants.js");


var EventHandler = function () {
  function EventHandler() {
    this.observers = {};
  }

  var _proto = EventHandler.prototype;

  _proto.observe = function observe(name, fn) {
    var _this = this;

    if (typeof fn === 'function') {
      if (!this.observers[name]) {
        this.observers[name] = [];
      }

      this.observers[name].push(fn);
      return function () {
        var index = _this.observers[name].indexOf(fn);

        if (index > -1) {
          _this.observers[name].splice(index, 1);
        }
      };
    }
  };

  _proto.sendOnly = function sendOnly(name, args) {
    var obs = this.observers[name];

    if (obs) {
      obs.forEach(function (fn) {
        try {
          fn.apply(undefined, args);
        } catch (error) {
          console.log(error, error.stack);
        }
      });
    }
  };

  _proto.send = function send(name, args) {
    this.sendOnly(name + _constants__WEBPACK_IMPORTED_MODULE_0__.BEFORE_EVENT, args);
    this.sendOnly(name, args);
    this.sendOnly(name + _constants__WEBPACK_IMPORTED_MODULE_0__.AFTER_EVENT, args);
  };

  return EventHandler;
}();

/* harmony default export */ __webpack_exports__["default"] = (EventHandler);

/***/ }),

/***/ "../rum-core/dist/es/common/http/fetch.js":
/*!************************************************!*\
  !*** ../rum-core/dist/es/common/http/fetch.js ***!
  \************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BYTE_LIMIT: function() { return /* binding */ BYTE_LIMIT; },
/* harmony export */   isFetchSupported: function() { return /* binding */ isFetchSupported; },
/* harmony export */   sendFetchRequest: function() { return /* binding */ sendFetchRequest; },
/* harmony export */   shouldUseFetchWithKeepAlive: function() { return /* binding */ shouldUseFetchWithKeepAlive; }
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants */ "../rum-core/dist/es/common/constants.js");
/* harmony import */ var _response_status__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./response-status */ "../rum-core/dist/es/common/http/response-status.js");
function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}



var BYTE_LIMIT = 60 * 1000;
function shouldUseFetchWithKeepAlive(method, payload) {
  if (!isFetchSupported()) {
    return false;
  }

  var isKeepAliveSupported = ('keepalive' in new Request(''));

  if (!isKeepAliveSupported) {
    return false;
  }

  var size = calculateSize(payload);
  return method === 'POST' && size < BYTE_LIMIT;
}
function sendFetchRequest(method, url, _ref) {
  var _ref$keepalive = _ref.keepalive,
      keepalive = _ref$keepalive === void 0 ? false : _ref$keepalive,
      _ref$timeout = _ref.timeout,
      timeout = _ref$timeout === void 0 ? _constants__WEBPACK_IMPORTED_MODULE_0__.HTTP_REQUEST_TIMEOUT : _ref$timeout,
      payload = _ref.payload,
      headers = _ref.headers,
      sendCredentials = _ref.sendCredentials;
  var timeoutConfig = {};

  if (typeof AbortController === 'function') {
    var controller = new AbortController();
    timeoutConfig.signal = controller.signal;
    setTimeout(function () {
      return controller.abort();
    }, timeout);
  }

  var fetchResponse;
  return window.fetch(url, _extends({
    body: payload,
    headers: headers,
    method: method,
    keepalive: keepalive,
    credentials: sendCredentials ? 'include' : 'omit'
  }, timeoutConfig)).then(function (response) {
    fetchResponse = response;
    return fetchResponse.text();
  }).then(function (responseText) {
    var bodyResponse = {
      url: url,
      status: fetchResponse.status,
      responseText: responseText
    };

    if (!(0,_response_status__WEBPACK_IMPORTED_MODULE_1__.isResponseSuccessful)(fetchResponse.status)) {
      throw bodyResponse;
    }

    return bodyResponse;
  });
}
function isFetchSupported() {
  return typeof window.fetch === 'function' && typeof window.Request === 'function';
}

function calculateSize(payload) {
  if (!payload) {
    return 0;
  }

  if (payload instanceof Blob) {
    return payload.size;
  }

  return new Blob([payload]).size;
}

/***/ }),

/***/ "../rum-core/dist/es/common/http/response-status.js":
/*!**********************************************************!*\
  !*** ../rum-core/dist/es/common/http/response-status.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isResponseSuccessful: function() { return /* binding */ isResponseSuccessful; }
/* harmony export */ });
function isResponseSuccessful(status) {
  if (status === 0 || status > 399 && status < 600) {
    return false;
  }

  return true;
}

/***/ }),

/***/ "../rum-core/dist/es/common/http/xhr.js":
/*!**********************************************!*\
  !*** ../rum-core/dist/es/common/http/xhr.js ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   sendXHR: function() { return /* binding */ sendXHR; }
/* harmony export */ });
/* harmony import */ var _patching_patch_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../patching/patch-utils */ "../rum-core/dist/es/common/patching/patch-utils.js");
/* harmony import */ var _response_status__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./response-status */ "../rum-core/dist/es/common/http/response-status.js");
/* harmony import */ var _polyfills__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../polyfills */ "../rum-core/dist/es/common/polyfills.js");



function sendXHR(method, url, _ref) {
  var _ref$timeout = _ref.timeout,
      timeout = _ref$timeout === void 0 ? HTTP_REQUEST_TIMEOUT : _ref$timeout,
      payload = _ref.payload,
      headers = _ref.headers,
      beforeSend = _ref.beforeSend,
      sendCredentials = _ref.sendCredentials;
  return new _polyfills__WEBPACK_IMPORTED_MODULE_0__.Promise(function (resolve, reject) {
    var xhr = new window.XMLHttpRequest();
    xhr[_patching_patch_utils__WEBPACK_IMPORTED_MODULE_1__.XHR_IGNORE] = true;
    xhr.open(method, url, true);
    xhr.timeout = timeout;
    xhr.withCredentials = sendCredentials;

    if (headers) {
      for (var header in headers) {
        if (headers.hasOwnProperty(header)) {
          xhr.setRequestHeader(header, headers[header]);
        }
      }
    }

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        var status = xhr.status,
            responseText = xhr.responseText;

        if ((0,_response_status__WEBPACK_IMPORTED_MODULE_2__.isResponseSuccessful)(status)) {
          resolve(xhr);
        } else {
          reject({
            url: url,
            status: status,
            responseText: responseText
          });
        }
      }
    };

    xhr.onerror = function () {
      var status = xhr.status,
          responseText = xhr.responseText;
      reject({
        url: url,
        status: status,
        responseText: responseText
      });
    };

    var canSend = true;

    if (typeof beforeSend === 'function') {
      canSend = beforeSend({
        url: url,
        method: method,
        headers: headers,
        payload: payload,
        xhr: xhr
      });
    }

    if (canSend) {
      xhr.send(payload);
    } else {
      reject({
        url: url,
        status: 0,
        responseText: 'Request rejected by user configuration.'
      });
    }
  });
}

/***/ }),

/***/ "../rum-core/dist/es/common/instrument.js":
/*!************************************************!*\
  !*** ../rum-core/dist/es/common/instrument.js ***!
  \************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getInstrumentationFlags: function() { return /* binding */ getInstrumentationFlags; }
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants */ "../rum-core/dist/es/common/constants.js");

function getInstrumentationFlags(instrument, disabledInstrumentations) {
  var _flags;

  var flags = (_flags = {}, _flags[_constants__WEBPACK_IMPORTED_MODULE_0__.XMLHTTPREQUEST] = false, _flags[_constants__WEBPACK_IMPORTED_MODULE_0__.FETCH] = false, _flags[_constants__WEBPACK_IMPORTED_MODULE_0__.HISTORY] = false, _flags[_constants__WEBPACK_IMPORTED_MODULE_0__.PAGE_LOAD] = false, _flags[_constants__WEBPACK_IMPORTED_MODULE_0__.ERROR] = false, _flags[_constants__WEBPACK_IMPORTED_MODULE_0__.EVENT_TARGET] = false, _flags[_constants__WEBPACK_IMPORTED_MODULE_0__.CLICK] = false, _flags);

  if (!instrument) {
    return flags;
  }

  Object.keys(flags).forEach(function (key) {
    if (disabledInstrumentations.indexOf(key) === -1) {
      flags[key] = true;
    }
  });
  return flags;
}

/***/ }),

/***/ "../rum-core/dist/es/common/logging-service.js":
/*!*****************************************************!*\
  !*** ../rum-core/dist/es/common/logging-service.js ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "../rum-core/dist/es/common/utils.js");


var LoggingService = function () {
  function LoggingService(spec) {
    if (spec === void 0) {
      spec = {};
    }

    this.levels = ['trace', 'debug', 'info', 'warn', 'error'];
    this.level = spec.level || 'warn';
    this.prefix = spec.prefix || '';
    this.resetLogMethods();
  }

  var _proto = LoggingService.prototype;

  _proto.shouldLog = function shouldLog(level) {
    return this.levels.indexOf(level) >= this.levels.indexOf(this.level);
  };

  _proto.setLevel = function setLevel(level) {
    if (level === this.level) {
      return;
    }

    this.level = level;
    this.resetLogMethods();
  };

  _proto.resetLogMethods = function resetLogMethods() {
    var _this = this;

    this.levels.forEach(function (level) {
      _this[level] = _this.shouldLog(level) ? log : _utils__WEBPACK_IMPORTED_MODULE_0__.noop;

      function log() {
        var normalizedLevel = level;

        if (level === 'trace' || level === 'debug') {
          normalizedLevel = 'info';
        }

        var args = arguments;
        args[0] = this.prefix + args[0];

        if (console) {
          var realMethod = console[normalizedLevel] || console.log;

          if (typeof realMethod === 'function') {
            realMethod.apply(console, args);
          }
        }
      }
    });
  };

  return LoggingService;
}();

/* harmony default export */ __webpack_exports__["default"] = (LoggingService);

/***/ }),

/***/ "../rum-core/dist/es/common/ndjson.js":
/*!********************************************!*\
  !*** ../rum-core/dist/es/common/ndjson.js ***!
  \********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var NDJSON = function () {
  function NDJSON() {}

  NDJSON.stringify = function stringify(object) {
    return JSON.stringify(object) + '\n';
  };

  return NDJSON;
}();

/* harmony default export */ __webpack_exports__["default"] = (NDJSON);

/***/ }),

/***/ "../rum-core/dist/es/common/observers/page-clicks.js":
/*!***********************************************************!*\
  !*** ../rum-core/dist/es/common/observers/page-clicks.js ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   observePageClicks: function() { return /* binding */ observePageClicks; }
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants */ "../rum-core/dist/es/common/constants.js");

var INTERACTIVE_SELECTOR = 'a[data-transaction-name], button[data-transaction-name]';
function observePageClicks(transactionService) {
  var clickHandler = function clickHandler(event) {
    if (event.target instanceof Element) {
      createUserInteractionTransaction(transactionService, event.target);
    }
  };

  var eventName = 'click';
  var useCapture = true;
  window.addEventListener(eventName, clickHandler, useCapture);
  return function () {
    window.removeEventListener(eventName, clickHandler, useCapture);
  };
}

function createUserInteractionTransaction(transactionService, target) {
  var _getTransactionMetada = getTransactionMetadata(target),
      transactionName = _getTransactionMetada.transactionName,
      context = _getTransactionMetada.context;

  var tr = transactionService.startTransaction("Click - " + transactionName, _constants__WEBPACK_IMPORTED_MODULE_0__.USER_INTERACTION, {
    managed: true,
    canReuse: true,
    reuseThreshold: 300
  });

  if (tr && context) {
    tr.addContext(context);
  }
}

function getTransactionMetadata(target) {
  var metadata = {
    transactionName: null,
    context: null
  };
  metadata.transactionName = buildTransactionName(target);
  var classes = target.getAttribute('class');

  if (classes) {
    metadata.context = {
      custom: {
        classes: classes
      }
    };
  }

  return metadata;
}

function buildTransactionName(target) {
  var dtName = findCustomTransactionName(target);

  if (dtName) {
    return dtName;
  }

  var tagName = target.tagName.toLowerCase();
  var name = target.getAttribute('name');

  if (!!name) {
    return tagName + "[\"" + name + "\"]";
  }

  return tagName;
}

function findCustomTransactionName(target) {
  var trCustomNameAttribute = 'data-transaction-name';
  var fallbackName = target.getAttribute(trCustomNameAttribute);

  if (target.closest) {
    var element = target.closest(INTERACTIVE_SELECTOR);
    return element ? element.getAttribute(trCustomNameAttribute) : fallbackName;
  }

  return fallbackName;
}

/***/ }),

/***/ "../rum-core/dist/es/common/observers/page-visibility.js":
/*!***************************************************************!*\
  !*** ../rum-core/dist/es/common/observers/page-visibility.js ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   observePageVisibility: function() { return /* binding */ observePageVisibility; }
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../constants */ "../rum-core/dist/es/common/constants.js");
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../state */ "../rum-core/dist/es/state.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils */ "../rum-core/dist/es/common/utils.js");
/* harmony import */ var _performance_monitoring_metrics_inp_report__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../performance-monitoring/metrics/inp/report */ "../rum-core/dist/es/performance-monitoring/metrics/inp/report.js");




function observePageVisibility(configService, transactionService) {
  if (document.visibilityState === 'hidden') {
    _state__WEBPACK_IMPORTED_MODULE_0__.state.lastHiddenStart = 0;
  }

  var visibilityChangeHandler = function visibilityChangeHandler() {
    if (document.visibilityState === 'hidden') {
      onPageHidden(configService, transactionService);
    }
  };

  var pageHideHandler = function pageHideHandler() {
    return onPageHidden(configService, transactionService);
  };

  var useCapture = true;
  window.addEventListener('visibilitychange', visibilityChangeHandler, useCapture);
  window.addEventListener('pagehide', pageHideHandler, useCapture);
  return function () {
    window.removeEventListener('visibilitychange', visibilityChangeHandler, useCapture);
    window.removeEventListener('pagehide', pageHideHandler, useCapture);
  };
}

function onPageHidden(configService, transactionService) {
  var inpTr = (0,_performance_monitoring_metrics_inp_report__WEBPACK_IMPORTED_MODULE_1__.reportInp)(transactionService);

  if (inpTr) {
    var unobserve = configService.observeEvent(_constants__WEBPACK_IMPORTED_MODULE_2__.QUEUE_ADD_TRANSACTION, function () {
      endManagedTransaction(configService, transactionService);
      unobserve();
    });
  } else {
    endManagedTransaction(configService, transactionService);
  }
}

function endManagedTransaction(configService, transactionService) {
  var tr = transactionService.getCurrentTransaction();

  if (tr) {
    var unobserveDiscard = configService.observeEvent(_constants__WEBPACK_IMPORTED_MODULE_2__.TRANSACTION_IGNORE, function () {
      _state__WEBPACK_IMPORTED_MODULE_0__.state.lastHiddenStart = (0,_utils__WEBPACK_IMPORTED_MODULE_3__.now)();
      unobserveDiscard();
      unobserveQueueAdd();
    });
    var unobserveQueueAdd = configService.observeEvent(_constants__WEBPACK_IMPORTED_MODULE_2__.QUEUE_ADD_TRANSACTION, function () {
      configService.dispatchEvent(_constants__WEBPACK_IMPORTED_MODULE_2__.QUEUE_FLUSH);
      _state__WEBPACK_IMPORTED_MODULE_0__.state.lastHiddenStart = (0,_utils__WEBPACK_IMPORTED_MODULE_3__.now)();
      unobserveQueueAdd();
      unobserveDiscard();
    });
    tr.end();
  } else {
    configService.dispatchEvent(_constants__WEBPACK_IMPORTED_MODULE_2__.QUEUE_FLUSH);
    _state__WEBPACK_IMPORTED_MODULE_0__.state.lastHiddenStart = (0,_utils__WEBPACK_IMPORTED_MODULE_3__.now)();
  }
}

/***/ }),

/***/ "../rum-core/dist/es/common/patching/fetch-patch.js":
/*!**********************************************************!*\
  !*** ../rum-core/dist/es/common/patching/fetch-patch.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   patchFetch: function() { return /* binding */ patchFetch; }
/* harmony export */ });
/* harmony import */ var _polyfills__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../polyfills */ "../rum-core/dist/es/common/polyfills.js");
/* harmony import */ var _patch_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./patch-utils */ "../rum-core/dist/es/common/patching/patch-utils.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../constants */ "../rum-core/dist/es/common/constants.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils */ "../rum-core/dist/es/common/utils.js");
/* harmony import */ var _http_fetch__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../http/fetch */ "../rum-core/dist/es/common/http/fetch.js");





function patchFetch(callback) {
  if (!(0,_http_fetch__WEBPACK_IMPORTED_MODULE_0__.isFetchSupported)()) {
    return;
  }

  function scheduleTask(task) {
    task.state = _constants__WEBPACK_IMPORTED_MODULE_1__.SCHEDULE;
    callback(_constants__WEBPACK_IMPORTED_MODULE_1__.SCHEDULE, task);
  }

  function invokeTask(task) {
    task.state = _constants__WEBPACK_IMPORTED_MODULE_1__.INVOKE;
    callback(_constants__WEBPACK_IMPORTED_MODULE_1__.INVOKE, task);
  }

  function handleResponseError(task, error) {
    task.data.aborted = isAbortError(error);
    task.data.error = error;
    invokeTask(task);
  }

  function readStream(stream, task) {
    var reader = stream.getReader();

    var read = function read() {
      reader.read().then(function (_ref) {
        var done = _ref.done;

        if (done) {
          invokeTask(task);
        } else {
          read();
        }
      }, function (error) {
        handleResponseError(task, error);
      });
    };

    read();
  }

  var nativeFetch = window.fetch;

  window.fetch = function (input, init) {
    var fetchSelf = this;
    var args = arguments;
    var request, url;
    var isURL = input instanceof URL;

    if (typeof input === 'string' || isURL) {
      request = new Request(input, init);

      if (isURL) {
        url = request.url;
      } else {
        url = input;
      }
    } else if (input) {
      request = input;
      url = request.url;
    } else {
      return nativeFetch.apply(fetchSelf, args);
    }

    var task = {
      source: _constants__WEBPACK_IMPORTED_MODULE_1__.FETCH,
      state: '',
      type: 'macroTask',
      data: {
        target: request,
        method: request.method,
        url: url,
        aborted: false
      }
    };
    return new _polyfills__WEBPACK_IMPORTED_MODULE_2__.Promise(function (resolve, reject) {
      _patch_utils__WEBPACK_IMPORTED_MODULE_3__.globalState.fetchInProgress = true;
      scheduleTask(task);
      var promise;

      try {
        promise = nativeFetch.apply(fetchSelf, [request]);
      } catch (error) {
        reject(error);
        task.data.error = error;
        invokeTask(task);
        _patch_utils__WEBPACK_IMPORTED_MODULE_3__.globalState.fetchInProgress = false;
        return;
      }

      promise.then(function (response) {
        var clonedResponse = response.clone ? response.clone() : {};
        resolve(response);
        (0,_utils__WEBPACK_IMPORTED_MODULE_4__.scheduleMicroTask)(function () {
          task.data.response = response;
          var body = clonedResponse.body;

          if (body) {
            readStream(body, task);
          } else {
            invokeTask(task);
          }
        });
      }, function (error) {
        reject(error);
        (0,_utils__WEBPACK_IMPORTED_MODULE_4__.scheduleMicroTask)(function () {
          handleResponseError(task, error);
        });
      });
      _patch_utils__WEBPACK_IMPORTED_MODULE_3__.globalState.fetchInProgress = false;
    });
  };
}

function isAbortError(error) {
  return error && error.name === 'AbortError';
}

/***/ }),

/***/ "../rum-core/dist/es/common/patching/history-patch.js":
/*!************************************************************!*\
  !*** ../rum-core/dist/es/common/patching/history-patch.js ***!
  \************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   patchHistory: function() { return /* binding */ patchHistory; }
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants */ "../rum-core/dist/es/common/constants.js");

function patchHistory(callback) {
  if (!window.history) {
    return;
  }

  var nativePushState = history.pushState;

  if (typeof nativePushState === 'function') {
    history.pushState = function (state, title, url) {
      var task = {
        source: _constants__WEBPACK_IMPORTED_MODULE_0__.HISTORY,
        data: {
          state: state,
          title: title,
          url: url
        }
      };
      callback(_constants__WEBPACK_IMPORTED_MODULE_0__.INVOKE, task);
      nativePushState.apply(this, arguments);
    };
  }
}

/***/ }),

/***/ "../rum-core/dist/es/common/patching/index.js":
/*!****************************************************!*\
  !*** ../rum-core/dist/es/common/patching/index.js ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   patchAll: function() { return /* binding */ patchAll; },
/* harmony export */   patchEventHandler: function() { return /* binding */ patchEventHandler; }
/* harmony export */ });
/* harmony import */ var _xhr_patch__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./xhr-patch */ "../rum-core/dist/es/common/patching/xhr-patch.js");
/* harmony import */ var _fetch_patch__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./fetch-patch */ "../rum-core/dist/es/common/patching/fetch-patch.js");
/* harmony import */ var _history_patch__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./history-patch */ "../rum-core/dist/es/common/patching/history-patch.js");
/* harmony import */ var _event_handler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../event-handler */ "../rum-core/dist/es/common/event-handler.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../constants */ "../rum-core/dist/es/common/constants.js");





var patchEventHandler = new _event_handler__WEBPACK_IMPORTED_MODULE_0__["default"]();
var alreadyPatched = false;

function patchAll() {
  if (!alreadyPatched) {
    alreadyPatched = true;
    (0,_xhr_patch__WEBPACK_IMPORTED_MODULE_1__.patchXMLHttpRequest)(function (event, task) {
      patchEventHandler.send(_constants__WEBPACK_IMPORTED_MODULE_2__.XMLHTTPREQUEST, [event, task]);
    });
    (0,_fetch_patch__WEBPACK_IMPORTED_MODULE_3__.patchFetch)(function (event, task) {
      patchEventHandler.send(_constants__WEBPACK_IMPORTED_MODULE_2__.FETCH, [event, task]);
    });
    (0,_history_patch__WEBPACK_IMPORTED_MODULE_4__.patchHistory)(function (event, task) {
      patchEventHandler.send(_constants__WEBPACK_IMPORTED_MODULE_2__.HISTORY, [event, task]);
    });
  }

  return patchEventHandler;
}



/***/ }),

/***/ "../rum-core/dist/es/common/patching/patch-utils.js":
/*!**********************************************************!*\
  !*** ../rum-core/dist/es/common/patching/patch-utils.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   XHR_IGNORE: function() { return /* binding */ XHR_IGNORE; },
/* harmony export */   XHR_METHOD: function() { return /* binding */ XHR_METHOD; },
/* harmony export */   XHR_SYNC: function() { return /* binding */ XHR_SYNC; },
/* harmony export */   XHR_URL: function() { return /* binding */ XHR_URL; },
/* harmony export */   apmSymbol: function() { return /* binding */ apmSymbol; },
/* harmony export */   globalState: function() { return /* binding */ globalState; },
/* harmony export */   patchMethod: function() { return /* binding */ patchMethod; }
/* harmony export */ });
var globalState = {
  fetchInProgress: false
};
function apmSymbol(name) {
  return '__apm_symbol__' + name;
}

function isPropertyWritable(propertyDesc) {
  if (!propertyDesc) {
    return true;
  }

  if (propertyDesc.writable === false) {
    return false;
  }

  return !(typeof propertyDesc.get === 'function' && typeof propertyDesc.set === 'undefined');
}

function attachOriginToPatched(patched, original) {
  patched[apmSymbol('OriginalDelegate')] = original;
}

function patchMethod(target, name, patchFn) {
  var proto = target;

  while (proto && !proto.hasOwnProperty(name)) {
    proto = Object.getPrototypeOf(proto);
  }

  if (!proto && target[name]) {
    proto = target;
  }

  var delegateName = apmSymbol(name);
  var delegate;

  if (proto && !(delegate = proto[delegateName])) {
    delegate = proto[delegateName] = proto[name];
    var desc = proto && Object.getOwnPropertyDescriptor(proto, name);

    if (isPropertyWritable(desc)) {
      var patchDelegate = patchFn(delegate, delegateName, name);

      proto[name] = function () {
        return patchDelegate(this, arguments);
      };

      attachOriginToPatched(proto[name], delegate);
    }
  }

  return delegate;
}
var XHR_IGNORE = apmSymbol('xhrIgnore');
var XHR_SYNC = apmSymbol('xhrSync');
var XHR_URL = apmSymbol('xhrURL');
var XHR_METHOD = apmSymbol('xhrMethod');

/***/ }),

/***/ "../rum-core/dist/es/common/patching/xhr-patch.js":
/*!********************************************************!*\
  !*** ../rum-core/dist/es/common/patching/xhr-patch.js ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   patchXMLHttpRequest: function() { return /* binding */ patchXMLHttpRequest; }
/* harmony export */ });
/* harmony import */ var _patch_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./patch-utils */ "../rum-core/dist/es/common/patching/patch-utils.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants */ "../rum-core/dist/es/common/constants.js");


function patchXMLHttpRequest(callback) {
  var XMLHttpRequestPrototype = XMLHttpRequest.prototype;

  if (!XMLHttpRequestPrototype || !XMLHttpRequestPrototype[_constants__WEBPACK_IMPORTED_MODULE_0__.ADD_EVENT_LISTENER_STR]) {
    return;
  }

  var READY_STATE_CHANGE = 'readystatechange';
  var LOAD = 'load';
  var ERROR = 'error';
  var TIMEOUT = 'timeout';
  var ABORT = 'abort';

  function invokeTask(task, status) {
    if (task.state !== _constants__WEBPACK_IMPORTED_MODULE_0__.INVOKE) {
      task.state = _constants__WEBPACK_IMPORTED_MODULE_0__.INVOKE;
      task.data.status = status;
      callback(_constants__WEBPACK_IMPORTED_MODULE_0__.INVOKE, task);
    }
  }

  function scheduleTask(task) {
    if (task.state === _constants__WEBPACK_IMPORTED_MODULE_0__.SCHEDULE) {
      return;
    }

    task.state = _constants__WEBPACK_IMPORTED_MODULE_0__.SCHEDULE;
    callback(_constants__WEBPACK_IMPORTED_MODULE_0__.SCHEDULE, task);
    var target = task.data.target;

    function addListener(name) {
      target[_constants__WEBPACK_IMPORTED_MODULE_0__.ADD_EVENT_LISTENER_STR](name, function (_ref) {
        var type = _ref.type;

        if (type === READY_STATE_CHANGE) {
          if (target.readyState === 4 && target.status !== 0) {
            invokeTask(task, 'success');
          }
        } else {
          var status = type === LOAD ? 'success' : type;
          invokeTask(task, status);
        }
      });
    }

    addListener(READY_STATE_CHANGE);
    addListener(LOAD);
    addListener(TIMEOUT);
    addListener(ERROR);
    addListener(ABORT);
  }

  var openNative = (0,_patch_utils__WEBPACK_IMPORTED_MODULE_1__.patchMethod)(XMLHttpRequestPrototype, 'open', function () {
    return function (self, args) {
      if (!self[_patch_utils__WEBPACK_IMPORTED_MODULE_1__.XHR_IGNORE]) {
        self[_patch_utils__WEBPACK_IMPORTED_MODULE_1__.XHR_METHOD] = args[0];
        self[_patch_utils__WEBPACK_IMPORTED_MODULE_1__.XHR_URL] = args[1];
        self[_patch_utils__WEBPACK_IMPORTED_MODULE_1__.XHR_SYNC] = args[2] === false;
      }

      return openNative.apply(self, args);
    };
  });
  var sendNative = (0,_patch_utils__WEBPACK_IMPORTED_MODULE_1__.patchMethod)(XMLHttpRequestPrototype, 'send', function () {
    return function (self, args) {
      if (self[_patch_utils__WEBPACK_IMPORTED_MODULE_1__.XHR_IGNORE]) {
        return sendNative.apply(self, args);
      }

      var task = {
        source: _constants__WEBPACK_IMPORTED_MODULE_0__.XMLHTTPREQUEST,
        state: '',
        type: 'macroTask',
        data: {
          target: self,
          method: self[_patch_utils__WEBPACK_IMPORTED_MODULE_1__.XHR_METHOD],
          sync: self[_patch_utils__WEBPACK_IMPORTED_MODULE_1__.XHR_SYNC],
          url: self[_patch_utils__WEBPACK_IMPORTED_MODULE_1__.XHR_URL],
          status: ''
        }
      };

      try {
        scheduleTask(task);
        return sendNative.apply(self, args);
      } catch (e) {
        invokeTask(task, ERROR);
        throw e;
      }
    };
  });
}

/***/ }),

/***/ "../rum-core/dist/es/common/polyfills.js":
/*!***********************************************!*\
  !*** ../rum-core/dist/es/common/polyfills.js ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Promise: function() { return /* binding */ Promise; }
/* harmony export */ });
/* harmony import */ var promise_polyfill__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! promise-polyfill */ "../../node_modules/promise-polyfill/src/index.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ "../rum-core/dist/es/common/utils.js");


var local = {};

if (_utils__WEBPACK_IMPORTED_MODULE_1__.isBrowser) {
  local = window;
} else if (typeof self !== 'undefined') {
  local = self;
}

var Promise = 'Promise' in local ? local.Promise : promise_polyfill__WEBPACK_IMPORTED_MODULE_0__["default"];


/***/ }),

/***/ "../rum-core/dist/es/common/queue.js":
/*!*******************************************!*\
  !*** ../rum-core/dist/es/common/queue.js ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var Queue = function () {
  function Queue(onFlush, opts) {
    if (opts === void 0) {
      opts = {};
    }

    this.onFlush = onFlush;
    this.items = [];
    this.queueLimit = opts.queueLimit || -1;
    this.flushInterval = opts.flushInterval || 0;
    this.timeoutId = undefined;
  }

  var _proto = Queue.prototype;

  _proto._setTimer = function _setTimer() {
    var _this = this;

    this.timeoutId = setTimeout(function () {
      return _this.flush();
    }, this.flushInterval);
  };

  _proto._clear = function _clear() {
    if (typeof this.timeoutId !== 'undefined') {
      clearTimeout(this.timeoutId);
      this.timeoutId = undefined;
    }

    this.items = [];
  };

  _proto.flush = function flush() {
    this.onFlush(this.items);

    this._clear();
  };

  _proto.add = function add(item) {
    this.items.push(item);

    if (this.queueLimit !== -1 && this.items.length >= this.queueLimit) {
      this.flush();
    } else {
      if (typeof this.timeoutId === 'undefined') {
        this._setTimer();
      }
    }
  };

  return Queue;
}();

/* harmony default export */ __webpack_exports__["default"] = (Queue);

/***/ }),

/***/ "../rum-core/dist/es/common/service-factory.js":
/*!*****************************************************!*\
  !*** ../rum-core/dist/es/common/service-factory.js ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ServiceFactory: function() { return /* binding */ ServiceFactory; },
/* harmony export */   serviceCreators: function() { return /* binding */ serviceCreators; }
/* harmony export */ });
/* harmony import */ var _apm_server__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./apm-server */ "../rum-core/dist/es/common/apm-server.js");
/* harmony import */ var _config_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./config-service */ "../rum-core/dist/es/common/config-service.js");
/* harmony import */ var _logging_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./logging-service */ "../rum-core/dist/es/common/logging-service.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants */ "../rum-core/dist/es/common/constants.js");
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../state */ "../rum-core/dist/es/state.js");
var _serviceCreators;






var serviceCreators = (_serviceCreators = {}, _serviceCreators[_constants__WEBPACK_IMPORTED_MODULE_0__.CONFIG_SERVICE] = function () {
  return new _config_service__WEBPACK_IMPORTED_MODULE_1__["default"]();
}, _serviceCreators[_constants__WEBPACK_IMPORTED_MODULE_0__.LOGGING_SERVICE] = function () {
  return new _logging_service__WEBPACK_IMPORTED_MODULE_2__["default"]({
    prefix: '[Elastic APM] '
  });
}, _serviceCreators[_constants__WEBPACK_IMPORTED_MODULE_0__.APM_SERVER] = function (factory) {
  var _factory$getService = factory.getService([_constants__WEBPACK_IMPORTED_MODULE_0__.CONFIG_SERVICE, _constants__WEBPACK_IMPORTED_MODULE_0__.LOGGING_SERVICE]),
      configService = _factory$getService[0],
      loggingService = _factory$getService[1];

  return new _apm_server__WEBPACK_IMPORTED_MODULE_3__["default"](configService, loggingService);
}, _serviceCreators);

var ServiceFactory = function () {
  function ServiceFactory() {
    this.instances = {};
    this.initialized = false;
  }

  var _proto = ServiceFactory.prototype;

  _proto.init = function init() {
    if (this.initialized) {
      return;
    }

    this.initialized = true;
    var configService = this.getService(_constants__WEBPACK_IMPORTED_MODULE_0__.CONFIG_SERVICE);
    configService.init();

    var _this$getService = this.getService([_constants__WEBPACK_IMPORTED_MODULE_0__.LOGGING_SERVICE, _constants__WEBPACK_IMPORTED_MODULE_0__.APM_SERVER]),
        loggingService = _this$getService[0],
        apmServer = _this$getService[1];

    configService.events.observe(_constants__WEBPACK_IMPORTED_MODULE_0__.CONFIG_CHANGE, function () {
      var logLevel = configService.get('logLevel');
      loggingService.setLevel(logLevel);
    });
    apmServer.init();
  };

  _proto.getService = function getService(name) {
    var _this = this;

    if (typeof name === 'string') {
      if (!this.instances[name]) {
        if (typeof serviceCreators[name] === 'function') {
          this.instances[name] = serviceCreators[name](this);
        } else if (_state__WEBPACK_IMPORTED_MODULE_4__.__DEV__) {
          console.log('Cannot get service, No creator for: ' + name);
        }
      }

      return this.instances[name];
    } else if (Array.isArray(name)) {
      return name.map(function (n) {
        return _this.getService(n);
      });
    }
  };

  return ServiceFactory;
}();



/***/ }),

/***/ "../rum-core/dist/es/common/throttle.js":
/*!**********************************************!*\
  !*** ../rum-core/dist/es/common/throttle.js ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ throttle; }
/* harmony export */ });
function throttle(fn, onThrottle, opts) {
  var context = this;
  var limit = opts.limit;
  var interval = opts.interval;
  var counter = 0;
  var timeoutId;
  return function () {
    counter++;

    if (typeof timeoutId === 'undefined') {
      timeoutId = setTimeout(function () {
        counter = 0;
        timeoutId = undefined;
      }, interval);
    }

    if (counter > limit && typeof onThrottle === 'function') {
      return onThrottle.apply(context, arguments);
    } else {
      return fn.apply(context, arguments);
    }
  };
}

/***/ }),

/***/ "../rum-core/dist/es/common/truncate.js":
/*!**********************************************!*\
  !*** ../rum-core/dist/es/common/truncate.js ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ERROR_MODEL: function() { return /* binding */ ERROR_MODEL; },
/* harmony export */   METADATA_MODEL: function() { return /* binding */ METADATA_MODEL; },
/* harmony export */   RESPONSE_MODEL: function() { return /* binding */ RESPONSE_MODEL; },
/* harmony export */   SPAN_MODEL: function() { return /* binding */ SPAN_MODEL; },
/* harmony export */   TRANSACTION_MODEL: function() { return /* binding */ TRANSACTION_MODEL; },
/* harmony export */   truncate: function() { return /* binding */ truncate; },
/* harmony export */   truncateModel: function() { return /* binding */ truncateModel; }
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants */ "../rum-core/dist/es/common/constants.js");

var METADATA_MODEL = {
  service: {
    name: [_constants__WEBPACK_IMPORTED_MODULE_0__.KEYWORD_LIMIT, true],
    version: true,
    agent: {
      version: [_constants__WEBPACK_IMPORTED_MODULE_0__.KEYWORD_LIMIT, true]
    },
    environment: true
  },
  labels: {
    '*': true
  }
};
var RESPONSE_MODEL = {
  '*': true,
  headers: {
    '*': true
  }
};
var DESTINATION_MODEL = {
  address: [_constants__WEBPACK_IMPORTED_MODULE_0__.KEYWORD_LIMIT],
  service: {
    '*': [_constants__WEBPACK_IMPORTED_MODULE_0__.KEYWORD_LIMIT, true]
  }
};
var CONTEXT_MODEL = {
  user: {
    id: true,
    email: true,
    username: true
  },
  tags: {
    '*': true
  },
  http: {
    response: RESPONSE_MODEL
  },
  destination: DESTINATION_MODEL,
  response: RESPONSE_MODEL
};
var SPAN_MODEL = {
  name: [_constants__WEBPACK_IMPORTED_MODULE_0__.KEYWORD_LIMIT, true],
  type: [_constants__WEBPACK_IMPORTED_MODULE_0__.KEYWORD_LIMIT, true],
  id: [_constants__WEBPACK_IMPORTED_MODULE_0__.KEYWORD_LIMIT, true],
  trace_id: [_constants__WEBPACK_IMPORTED_MODULE_0__.KEYWORD_LIMIT, true],
  parent_id: [_constants__WEBPACK_IMPORTED_MODULE_0__.KEYWORD_LIMIT, true],
  transaction_id: [_constants__WEBPACK_IMPORTED_MODULE_0__.KEYWORD_LIMIT, true],
  subtype: true,
  action: true,
  context: CONTEXT_MODEL
};
var TRANSACTION_MODEL = {
  name: true,
  parent_id: true,
  type: [_constants__WEBPACK_IMPORTED_MODULE_0__.KEYWORD_LIMIT, true],
  id: [_constants__WEBPACK_IMPORTED_MODULE_0__.KEYWORD_LIMIT, true],
  trace_id: [_constants__WEBPACK_IMPORTED_MODULE_0__.KEYWORD_LIMIT, true],
  span_count: {
    started: [_constants__WEBPACK_IMPORTED_MODULE_0__.KEYWORD_LIMIT, true]
  },
  context: CONTEXT_MODEL
};
var ERROR_MODEL = {
  id: [_constants__WEBPACK_IMPORTED_MODULE_0__.KEYWORD_LIMIT, true],
  trace_id: true,
  transaction_id: true,
  parent_id: true,
  culprit: true,
  exception: {
    type: true
  },
  transaction: {
    type: true
  },
  context: CONTEXT_MODEL
};

function truncate(value, limit, required, placeholder) {
  if (limit === void 0) {
    limit = _constants__WEBPACK_IMPORTED_MODULE_0__.KEYWORD_LIMIT;
  }

  if (required === void 0) {
    required = false;
  }

  if (placeholder === void 0) {
    placeholder = 'N/A';
  }

  if (required && isEmpty(value)) {
    value = placeholder;
  }

  if (typeof value === 'string') {
    return value.substring(0, limit);
  }

  return value;
}

function isEmpty(value) {
  return value == null || value === '' || typeof value === 'undefined';
}

function replaceValue(target, key, currModel) {
  var value = truncate(target[key], currModel[0], currModel[1]);

  if (isEmpty(value)) {
    delete target[key];
    return;
  }

  target[key] = value;
}

function truncateModel(model, target, childTarget) {
  if (model === void 0) {
    model = {};
  }

  if (childTarget === void 0) {
    childTarget = target;
  }

  var keys = Object.keys(model);
  var emptyArr = [];

  var _loop = function _loop(i) {
    var currKey = keys[i];
    var currModel = model[currKey] === true ? emptyArr : model[currKey];

    if (!Array.isArray(currModel)) {
      truncateModel(currModel, target, childTarget[currKey]);
    } else {
      if (currKey === '*') {
        Object.keys(childTarget).forEach(function (key) {
          return replaceValue(childTarget, key, currModel);
        });
      } else {
        replaceValue(childTarget, currKey, currModel);
      }
    }
  };

  for (var i = 0; i < keys.length; i++) {
    _loop(i);
  }

  return target;
}



/***/ }),

/***/ "../rum-core/dist/es/common/url.js":
/*!*****************************************!*\
  !*** ../rum-core/dist/es/common/url.js ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Url: function() { return /* binding */ Url; },
/* harmony export */   slugifyUrl: function() { return /* binding */ slugifyUrl; }
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "../rum-core/dist/es/common/utils.js");


function isDefaultPort(port, protocol) {
  switch (protocol) {
    case 'http:':
      return port === '80';

    case 'https:':
      return port === '443';
  }

  return true;
}

var RULES = [['#', 'hash'], ['?', 'query'], ['/', 'path'], ['@', 'auth', 1], [NaN, 'host', undefined, 1]];
var PROTOCOL_REGEX = /^([a-z][a-z0-9.+-]*:)?(\/\/)?([\S\s]*)/i;
var Url = function () {
  function Url(url) {
    var _this$extractProtocol = this.extractProtocol(url || ''),
        protocol = _this$extractProtocol.protocol,
        address = _this$extractProtocol.address,
        slashes = _this$extractProtocol.slashes;

    var relative = !protocol && !slashes;
    var location = this.getLocation();
    var instructions = RULES.slice();
    address = address.replace('\\', '/');

    if (!slashes) {
      instructions[2] = [NaN, 'path'];
    }

    var index;

    for (var i = 0; i < instructions.length; i++) {
      var instruction = instructions[i];
      var parse = instruction[0];
      var key = instruction[1];

      if (typeof parse === 'string') {
        index = address.indexOf(parse);

        if (~index) {
          var instLength = instruction[2];

          if (instLength) {
            var newIndex = address.lastIndexOf(parse);
            index = Math.max(index, newIndex);
            this[key] = address.slice(0, index);
            address = address.slice(index + instLength);
          } else {
            this[key] = address.slice(index);
            address = address.slice(0, index);
          }
        }
      } else {
        this[key] = address;
        address = '';
      }

      this[key] = this[key] || (relative && instruction[3] ? location[key] || '' : '');
      if (instruction[3]) this[key] = this[key].toLowerCase();
    }

    if (relative && this.path.charAt(0) !== '/') {
      this.path = '/' + this.path;
    }

    this.relative = relative;
    this.protocol = protocol || location.protocol;
    this.hostname = this.host;
    this.port = '';

    if (/:\d+$/.test(this.host)) {
      var value = this.host.split(':');
      var port = value.pop();
      var hostname = value.join(':');

      if (isDefaultPort(port, this.protocol)) {
        this.host = hostname;
      } else {
        this.port = port;
      }

      this.hostname = hostname;
    }

    this.origin = this.protocol && this.host && this.protocol !== 'file:' ? this.protocol + '//' + this.host : 'null';
    this.href = this.toString();
  }

  var _proto = Url.prototype;

  _proto.toString = function toString() {
    var result = this.protocol;
    result += '//';

    if (this.auth) {
      var REDACTED = '[REDACTED]';
      var userpass = this.auth.split(':');
      var username = userpass[0] ? REDACTED : '';
      var password = userpass[1] ? ':' + REDACTED : '';
      result += username + password + '@';
    }

    result += this.host;
    result += this.path;
    result += this.query;
    result += this.hash;
    return result;
  };

  _proto.getLocation = function getLocation() {
    var globalVar = {};

    if (_utils__WEBPACK_IMPORTED_MODULE_0__.isBrowser) {
      globalVar = window;
    }

    return globalVar.location;
  };

  _proto.extractProtocol = function extractProtocol(url) {
    var match = PROTOCOL_REGEX.exec(url);
    return {
      protocol: match[1] ? match[1].toLowerCase() : '',
      slashes: !!match[2],
      address: match[3]
    };
  };

  return Url;
}();
function slugifyUrl(urlStr, depth) {
  if (depth === void 0) {
    depth = 2;
  }

  var parsedUrl = new Url(urlStr);
  var query = parsedUrl.query,
      path = parsedUrl.path;
  var pathParts = path.substring(1).split('/');
  var redactString = ':id';
  var wildcard = '*';
  var specialCharsRegex = /\W|_/g;
  var digitsRegex = /[0-9]/g;
  var lowerCaseRegex = /[a-z]/g;
  var upperCaseRegex = /[A-Z]/g;
  var redactedParts = [];
  var redactedBefore = false;

  for (var index = 0; index < pathParts.length; index++) {
    var part = pathParts[index];

    if (redactedBefore || index > depth - 1) {
      if (part) {
        redactedParts.push(wildcard);
      }

      break;
    }

    var numberOfSpecialChars = (part.match(specialCharsRegex) || []).length;

    if (numberOfSpecialChars >= 2) {
      redactedParts.push(redactString);
      redactedBefore = true;
      continue;
    }

    var numberOfDigits = (part.match(digitsRegex) || []).length;

    if (numberOfDigits > 3 || part.length > 3 && numberOfDigits / part.length >= 0.3) {
      redactedParts.push(redactString);
      redactedBefore = true;
      continue;
    }

    var numberofUpperCase = (part.match(upperCaseRegex) || []).length;
    var numberofLowerCase = (part.match(lowerCaseRegex) || []).length;
    var lowerCaseRate = numberofLowerCase / part.length;
    var upperCaseRate = numberofUpperCase / part.length;

    if (part.length > 5 && (upperCaseRate > 0.3 && upperCaseRate < 0.6 || lowerCaseRate > 0.3 && lowerCaseRate < 0.6)) {
      redactedParts.push(redactString);
      redactedBefore = true;
      continue;
    }

    part && redactedParts.push(part);
  }

  var redacted = '/' + (redactedParts.length >= 2 ? redactedParts.join('/') : redactedParts.join('')) + (query ? '?{query}' : '');
  return redacted;
}

/***/ }),

/***/ "../rum-core/dist/es/common/utils.js":
/*!*******************************************!*\
  !*** ../rum-core/dist/es/common/utils.js ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PERF: function() { return /* binding */ PERF; },
/* harmony export */   baseExtend: function() { return /* binding */ baseExtend; },
/* harmony export */   bytesToHex: function() { return /* binding */ bytesToHex; },
/* harmony export */   checkSameOrigin: function() { return /* binding */ checkSameOrigin; },
/* harmony export */   extend: function() { return /* binding */ extend; },
/* harmony export */   find: function() { return /* binding */ find; },
/* harmony export */   generateRandomId: function() { return /* binding */ generateRandomId; },
/* harmony export */   getCurrentScript: function() { return /* binding */ getCurrentScript; },
/* harmony export */   getDtHeaderValue: function() { return /* binding */ getDtHeaderValue; },
/* harmony export */   getDuration: function() { return /* binding */ getDuration; },
/* harmony export */   getEarliestSpan: function() { return /* binding */ getEarliestSpan; },
/* harmony export */   getElasticScript: function() { return /* binding */ getElasticScript; },
/* harmony export */   getLatestNonXHRSpan: function() { return /* binding */ getLatestNonXHRSpan; },
/* harmony export */   getLatestXHRSpan: function() { return /* binding */ getLatestXHRSpan; },
/* harmony export */   getServerTimingInfo: function() { return /* binding */ getServerTimingInfo; },
/* harmony export */   getTSHeaderValue: function() { return /* binding */ getTSHeaderValue; },
/* harmony export */   getTime: function() { return /* binding */ getTime; },
/* harmony export */   getTimeOrigin: function() { return /* binding */ getTimeOrigin; },
/* harmony export */   isBeaconInspectionEnabled: function() { return /* binding */ isBeaconInspectionEnabled; },
/* harmony export */   isBrowser: function() { return /* binding */ isBrowser; },
/* harmony export */   isCORSSupported: function() { return /* binding */ isCORSSupported; },
/* harmony export */   isDtHeaderValid: function() { return /* binding */ isDtHeaderValid; },
/* harmony export */   isFunction: function() { return /* binding */ isFunction; },
/* harmony export */   isObject: function() { return /* binding */ isObject; },
/* harmony export */   isPerfInteractionCountSupported: function() { return /* binding */ isPerfInteractionCountSupported; },
/* harmony export */   isPerfTimelineSupported: function() { return /* binding */ isPerfTimelineSupported; },
/* harmony export */   isPerfTypeSupported: function() { return /* binding */ isPerfTypeSupported; },
/* harmony export */   isPlatformSupported: function() { return /* binding */ isPlatformSupported; },
/* harmony export */   isRedirectInfoAvailable: function() { return /* binding */ isRedirectInfoAvailable; },
/* harmony export */   isUndefined: function() { return /* binding */ isUndefined; },
/* harmony export */   merge: function() { return /* binding */ merge; },
/* harmony export */   noop: function() { return /* binding */ noop; },
/* harmony export */   now: function() { return /* binding */ now; },
/* harmony export */   parseDtHeaderValue: function() { return /* binding */ parseDtHeaderValue; },
/* harmony export */   removeInvalidChars: function() { return /* binding */ removeInvalidChars; },
/* harmony export */   rng: function() { return /* binding */ rng; },
/* harmony export */   scheduleMacroTask: function() { return /* binding */ scheduleMacroTask; },
/* harmony export */   scheduleMicroTask: function() { return /* binding */ scheduleMicroTask; },
/* harmony export */   setLabel: function() { return /* binding */ setLabel; },
/* harmony export */   setRequestHeader: function() { return /* binding */ setRequestHeader; },
/* harmony export */   stripQueryStringFromUrl: function() { return /* binding */ stripQueryStringFromUrl; }
/* harmony export */ });
/* harmony import */ var _polyfills__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./polyfills */ "../rum-core/dist/es/common/polyfills.js");

var slice = [].slice;
var isBrowser = typeof window !== 'undefined';
var PERF = isBrowser && typeof performance !== 'undefined' ? performance : {};

function isCORSSupported() {
  var xhr = new window.XMLHttpRequest();
  return 'withCredentials' in xhr;
}

var byteToHex = [];

for (var i = 0; i < 256; ++i) {
  byteToHex[i] = (i + 0x100).toString(16).substr(1);
}

function bytesToHex(buffer) {
  var hexOctets = [];

  for (var _i = 0; _i < buffer.length; _i++) {
    hexOctets.push(byteToHex[buffer[_i]]);
  }

  return hexOctets.join('');
}

var destination = new Uint8Array(16);

function rng() {
  if (typeof crypto != 'undefined' && typeof crypto.getRandomValues == 'function') {
    return crypto.getRandomValues(destination);
  } else if (typeof msCrypto != 'undefined' && typeof msCrypto.getRandomValues == 'function') {
    return msCrypto.getRandomValues(destination);
  }

  return destination;
}

function generateRandomId(length) {
  var id = bytesToHex(rng());
  return id.substr(0, length);
}

function getDtHeaderValue(span) {
  var dtVersion = '00';
  var dtUnSampledFlags = '00';
  var dtSampledFlags = '01';

  if (span && span.traceId && span.id && span.parentId) {
    var flags = span.sampled ? dtSampledFlags : dtUnSampledFlags;
    var id = span.sampled ? span.id : span.parentId;
    return dtVersion + '-' + span.traceId + '-' + id + '-' + flags;
  }
}

function parseDtHeaderValue(value) {
  var parsed = /^([\da-f]{2})-([\da-f]{32})-([\da-f]{16})-([\da-f]{2})$/.exec(value);

  if (parsed) {
    var flags = parsed[4];
    var sampled = flags !== '00';
    return {
      traceId: parsed[2],
      id: parsed[3],
      sampled: sampled
    };
  }
}

function isDtHeaderValid(header) {
  return /^[\da-f]{2}-[\da-f]{32}-[\da-f]{16}-[\da-f]{2}$/.test(header) && header.slice(3, 35) !== '00000000000000000000000000000000' && header.slice(36, 52) !== '0000000000000000';
}

function getTSHeaderValue(_ref) {
  var sampleRate = _ref.sampleRate;

  if (typeof sampleRate !== 'number' || String(sampleRate).length > 256) {
    return;
  }

  var NAMESPACE = 'es';
  var SEPARATOR = '=';
  return "" + NAMESPACE + SEPARATOR + "s:" + sampleRate;
}

function setRequestHeader(target, name, value) {
  if (typeof target.setRequestHeader === 'function') {
    target.setRequestHeader(name, value);
  } else if (target.headers && typeof target.headers.append === 'function') {
    target.headers.append(name, value);
  } else {
    target[name] = value;
  }
}

function checkSameOrigin(source, target) {
  var isSame = false;

  if (typeof target === 'string') {
    isSame = source === target;
  } else if (target && typeof target.test === 'function') {
    isSame = target.test(source);
  } else if (Array.isArray(target)) {
    target.forEach(function (t) {
      if (!isSame) {
        isSame = checkSameOrigin(source, t);
      }
    });
  }

  return isSame;
}

function isPlatformSupported() {
  return isBrowser && typeof Set === 'function' && typeof JSON.stringify === 'function' && PERF && typeof PERF.now === 'function' && isCORSSupported();
}

function setLabel(key, value, obj) {
  if (!obj || !key) return;
  var skey = removeInvalidChars(key);
  var valueType = typeof value;

  if (value != undefined && valueType !== 'boolean' && valueType !== 'number') {
    value = String(value);
  }

  obj[skey] = value;
  return obj;
}

function getServerTimingInfo(serverTimingEntries) {
  if (serverTimingEntries === void 0) {
    serverTimingEntries = [];
  }

  var serverTimingInfo = [];
  var entrySeparator = ', ';
  var valueSeparator = ';';

  for (var _i2 = 0; _i2 < serverTimingEntries.length; _i2++) {
    var _serverTimingEntries$ = serverTimingEntries[_i2],
        name = _serverTimingEntries$.name,
        duration = _serverTimingEntries$.duration,
        description = _serverTimingEntries$.description;
    var timingValue = name;

    if (description) {
      timingValue += valueSeparator + 'desc=' + description;
    }

    if (duration) {
      timingValue += valueSeparator + 'dur=' + duration;
    }

    serverTimingInfo.push(timingValue);
  }

  return serverTimingInfo.join(entrySeparator);
}

function getTimeOrigin() {
  return PERF.timing.fetchStart;
}

function stripQueryStringFromUrl(url) {
  return url && url.split('?')[0];
}

function isObject(value) {
  return value !== null && typeof value === 'object';
}

function isFunction(value) {
  return typeof value === 'function';
}

function baseExtend(dst, objs, deep) {
  for (var i = 0, ii = objs.length; i < ii; ++i) {
    var obj = objs[i];
    if (!isObject(obj) && !isFunction(obj)) continue;
    var keys = Object.keys(obj);

    for (var j = 0, jj = keys.length; j < jj; j++) {
      var key = keys[j];
      var src = obj[key];

      if (deep && isObject(src)) {
        if (!isObject(dst[key])) dst[key] = Array.isArray(src) ? [] : {};
        baseExtend(dst[key], [src], false);
      } else {
        dst[key] = src;
      }
    }
  }

  return dst;
}

function getElasticScript() {
  if (typeof document !== 'undefined') {
    var scripts = document.getElementsByTagName('script');

    for (var i = 0, l = scripts.length; i < l; i++) {
      var sc = scripts[i];

      if (sc.src.indexOf('elastic') > 0) {
        return sc;
      }
    }
  }
}

function getCurrentScript() {
  if (typeof document !== 'undefined') {
    var currentScript = document.currentScript;

    if (!currentScript) {
      return getElasticScript();
    }

    return currentScript;
  }
}

function extend(dst) {
  return baseExtend(dst, slice.call(arguments, 1), false);
}

function merge(dst) {
  return baseExtend(dst, slice.call(arguments, 1), true);
}

function isUndefined(obj) {
  return typeof obj === 'undefined';
}

function noop() {}

function find(array, predicate, thisArg) {
  if (array == null) {
    throw new TypeError('array is null or not defined');
  }

  var o = Object(array);
  var len = o.length >>> 0;

  if (typeof predicate !== 'function') {
    throw new TypeError('predicate must be a function');
  }

  var k = 0;

  while (k < len) {
    var kValue = o[k];

    if (predicate.call(thisArg, kValue, k, o)) {
      return kValue;
    }

    k++;
  }

  return undefined;
}

function removeInvalidChars(key) {
  return key.replace(/[.*"]/g, '_');
}

function getLatestSpan(spans, typeFilter) {
  var latestSpan = null;

  for (var _i3 = 0; _i3 < spans.length; _i3++) {
    var span = spans[_i3];

    if (typeFilter && typeFilter(span.type) && (!latestSpan || latestSpan._end < span._end)) {
      latestSpan = span;
    }
  }

  return latestSpan;
}

function getLatestNonXHRSpan(spans) {
  return getLatestSpan(spans, function (type) {
    return String(type).indexOf('external') === -1;
  });
}

function getLatestXHRSpan(spans) {
  return getLatestSpan(spans, function (type) {
    return String(type).indexOf('external') !== -1;
  });
}

function getEarliestSpan(spans) {
  var earliestSpan = spans[0];

  for (var _i4 = 1; _i4 < spans.length; _i4++) {
    var span = spans[_i4];

    if (earliestSpan._start > span._start) {
      earliestSpan = span;
    }
  }

  return earliestSpan;
}

function now() {
  return PERF.now();
}

function getTime(time) {
  return typeof time === 'number' && time >= 0 ? time : now();
}

function getDuration(start, end) {
  if (isUndefined(end) || isUndefined(start)) {
    return null;
  }

  return parseInt(end - start);
}

function scheduleMacroTask(callback) {
  setTimeout(callback, 0);
}

function scheduleMicroTask(callback) {
  _polyfills__WEBPACK_IMPORTED_MODULE_0__.Promise.resolve().then(callback);
}

function isPerfTimelineSupported() {
  return typeof PERF.getEntriesByType === 'function';
}

function isPerfTypeSupported(type) {
  return typeof PerformanceObserver !== 'undefined' && PerformanceObserver.supportedEntryTypes && PerformanceObserver.supportedEntryTypes.indexOf(type) >= 0;
}

function isPerfInteractionCountSupported() {
  return 'interactionCount' in performance;
}

function isBeaconInspectionEnabled() {
  var flagName = '_elastic_inspect_beacon_';

  if (sessionStorage.getItem(flagName) != null) {
    return true;
  }

  if (!window.URL || !window.URLSearchParams) {
    return false;
  }

  try {
    var parsedUrl = new URL(window.location.href);
    var isFlagSet = parsedUrl.searchParams.has(flagName);

    if (isFlagSet) {
      sessionStorage.setItem(flagName, true);
    }

    return isFlagSet;
  } catch (e) {}

  return false;
}

function isRedirectInfoAvailable(timing) {
  return timing.redirectStart > 0;
}



/***/ }),

/***/ "../rum-core/dist/es/error-logging/error-logging.js":
/*!**********************************************************!*\
  !*** ../rum-core/dist/es/error-logging/error-logging.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _stack_trace__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./stack-trace */ "../rum-core/dist/es/error-logging/stack-trace.js");
/* harmony import */ var _common_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../common/utils */ "../rum-core/dist/es/common/utils.js");
/* harmony import */ var _common_context__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common/context */ "../rum-core/dist/es/common/context.js");
/* harmony import */ var _common_truncate__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../common/truncate */ "../rum-core/dist/es/common/truncate.js");
/* harmony import */ var error_stack_parser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! error-stack-parser */ "../../node_modules/error-stack-parser/error-stack-parser.js");
/* harmony import */ var error_stack_parser__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(error_stack_parser__WEBPACK_IMPORTED_MODULE_0__);
var _excluded = ["tags"];

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}






var IGNORE_KEYS = ['stack', 'message'];
var PROMISE_REJECTION_PREFIX = 'Unhandled promise rejection: ';

function getErrorProperties(error) {
  var propertyFound = false;
  var properties = {};
  Object.keys(error).forEach(function (key) {
    if (IGNORE_KEYS.indexOf(key) >= 0) {
      return;
    }

    var val = error[key];

    if (val == null || typeof val === 'function') {
      return;
    }

    if (typeof val === 'object') {
      if (typeof val.toISOString !== 'function') return;
      val = val.toISOString();
    }

    properties[key] = val;
    propertyFound = true;
  });

  if (propertyFound) {
    return properties;
  }
}

var ErrorLogging = function () {
  function ErrorLogging(apmServer, configService, transactionService) {
    this._apmServer = apmServer;
    this._configService = configService;
    this._transactionService = transactionService;
  }

  var _proto = ErrorLogging.prototype;

  _proto.createErrorDataModel = function createErrorDataModel(errorEvent) {
    var frames = (0,_stack_trace__WEBPACK_IMPORTED_MODULE_1__.createStackTraces)((error_stack_parser__WEBPACK_IMPORTED_MODULE_0___default()), errorEvent);
    var filteredFrames = (0,_stack_trace__WEBPACK_IMPORTED_MODULE_1__.filterInvalidFrames)(frames);
    var culprit = '(inline script)';
    var lastFrame = filteredFrames[filteredFrames.length - 1];

    if (lastFrame && lastFrame.filename) {
      culprit = lastFrame.filename;
    }

    var message = errorEvent.message,
        error = errorEvent.error;
    var errorMessage = message;
    var errorType = '';
    var errorContext = {};

    if (error && typeof error === 'object') {
      errorMessage = errorMessage || error.message;
      errorType = error.name;
      var customProperties = getErrorProperties(error);

      if (customProperties) {
        errorContext.custom = customProperties;
      }
    }

    if (!errorType) {
      if (errorMessage && errorMessage.indexOf(':') > -1) {
        errorType = errorMessage.split(':')[0];
      }
    }

    var currentTransaction = this._transactionService.getCurrentTransaction();

    var transactionContext = currentTransaction ? currentTransaction.context : {};

    var _this$_configService$ = this._configService.get('context'),
        tags = _this$_configService$.tags,
        configContext = _objectWithoutPropertiesLoose(_this$_configService$, _excluded);

    var pageContext = (0,_common_context__WEBPACK_IMPORTED_MODULE_2__.getPageContext)();
    var context = (0,_common_utils__WEBPACK_IMPORTED_MODULE_3__.merge)({}, pageContext, transactionContext, configContext, errorContext);
    var errorObject = {
      id: (0,_common_utils__WEBPACK_IMPORTED_MODULE_3__.generateRandomId)(),
      culprit: culprit,
      exception: {
        message: errorMessage,
        stacktrace: filteredFrames,
        type: errorType
      },
      context: context
    };

    if (currentTransaction) {
      errorObject = (0,_common_utils__WEBPACK_IMPORTED_MODULE_3__.extend)(errorObject, {
        trace_id: currentTransaction.traceId,
        parent_id: currentTransaction.id,
        transaction_id: currentTransaction.id,
        transaction: {
          type: currentTransaction.type,
          sampled: currentTransaction.sampled
        }
      });
    }

    return (0,_common_truncate__WEBPACK_IMPORTED_MODULE_4__.truncateModel)(_common_truncate__WEBPACK_IMPORTED_MODULE_4__.ERROR_MODEL, errorObject);
  };

  _proto.logErrorEvent = function logErrorEvent(errorEvent) {
    if (typeof errorEvent === 'undefined') {
      return;
    }

    var errorObject = this.createErrorDataModel(errorEvent);

    if (typeof errorObject.exception.message === 'undefined') {
      return;
    }

    this._apmServer.addError(errorObject);
  };

  _proto.registerListeners = function registerListeners() {
    var _this = this;

    window.addEventListener('error', function (errorEvent) {
      return _this.logErrorEvent(errorEvent);
    });
    window.addEventListener('unhandledrejection', function (promiseRejectionEvent) {
      return _this.logPromiseEvent(promiseRejectionEvent);
    });
  };

  _proto.logPromiseEvent = function logPromiseEvent(promiseRejectionEvent) {
    var reason = promiseRejectionEvent.reason;

    if (reason == null) {
      reason = '<no reason specified>';
    }

    var errorEvent;

    if (typeof reason.message === 'string') {
      var name = reason.name ? reason.name + ': ' : '';
      errorEvent = {
        error: reason,
        message: PROMISE_REJECTION_PREFIX + name + reason.message
      };
    } else {
      errorEvent = this._parseRejectReason(reason);
    }

    this.logErrorEvent(errorEvent);
  };

  _proto.logError = function logError(messageOrError) {
    var errorEvent = {};

    if (typeof messageOrError === 'string') {
      errorEvent.message = messageOrError;
    } else {
      errorEvent.error = messageOrError;
    }

    return this.logErrorEvent(errorEvent);
  };

  _proto._parseRejectReason = function _parseRejectReason(reason) {
    var errorEvent = {
      message: PROMISE_REJECTION_PREFIX
    };

    if (Array.isArray(reason)) {
      errorEvent.message += '<object>';
    } else if (typeof reason === 'object') {
      try {
        errorEvent.message += JSON.stringify(reason);
        errorEvent.error = reason;
      } catch (error) {
        errorEvent.message += '<object>';
      }
    } else if (typeof reason === 'function') {
      errorEvent.message += '<function>';
    } else {
      errorEvent.message += reason;
    }

    return errorEvent;
  };

  return ErrorLogging;
}();

/* harmony default export */ __webpack_exports__["default"] = (ErrorLogging);

/***/ }),

/***/ "../rum-core/dist/es/error-logging/index.js":
/*!**************************************************!*\
  !*** ../rum-core/dist/es/error-logging/index.js ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   registerServices: function() { return /* binding */ registerServices; }
/* harmony export */ });
/* harmony import */ var _error_logging__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./error-logging */ "../rum-core/dist/es/error-logging/error-logging.js");
/* harmony import */ var _common_constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/constants */ "../rum-core/dist/es/common/constants.js");
/* harmony import */ var _common_service_factory__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/service-factory */ "../rum-core/dist/es/common/service-factory.js");




function registerServices() {
  _common_service_factory__WEBPACK_IMPORTED_MODULE_0__.serviceCreators[_common_constants__WEBPACK_IMPORTED_MODULE_1__.ERROR_LOGGING] = function (serviceFactory) {
    var _serviceFactory$getSe = serviceFactory.getService([_common_constants__WEBPACK_IMPORTED_MODULE_1__.APM_SERVER, _common_constants__WEBPACK_IMPORTED_MODULE_1__.CONFIG_SERVICE, _common_constants__WEBPACK_IMPORTED_MODULE_1__.TRANSACTION_SERVICE]),
        apmServer = _serviceFactory$getSe[0],
        configService = _serviceFactory$getSe[1],
        transactionService = _serviceFactory$getSe[2];

    return new _error_logging__WEBPACK_IMPORTED_MODULE_2__["default"](apmServer, configService, transactionService);
  };
}



/***/ }),

/***/ "../rum-core/dist/es/error-logging/stack-trace.js":
/*!********************************************************!*\
  !*** ../rum-core/dist/es/error-logging/stack-trace.js ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createStackTraces: function() { return /* binding */ createStackTraces; },
/* harmony export */   filterInvalidFrames: function() { return /* binding */ filterInvalidFrames; }
/* harmony export */ });
function filePathToFileName(fileUrl) {
  var origin = window.location.origin || window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '');

  if (fileUrl.indexOf(origin) > -1) {
    fileUrl = fileUrl.replace(origin + '/', '');
  }

  return fileUrl;
}

function cleanFilePath(filePath) {
  if (filePath === void 0) {
    filePath = '';
  }

  if (filePath === '<anonymous>') {
    filePath = '';
  }

  return filePath;
}

function isFileInline(fileUrl) {
  if (fileUrl) {
    return window.location.href.indexOf(fileUrl) === 0;
  }

  return false;
}

function normalizeStackFrames(stackFrames) {
  return stackFrames.map(function (frame) {
    if (frame.functionName) {
      frame.functionName = normalizeFunctionName(frame.functionName);
    }

    return frame;
  });
}

function normalizeFunctionName(fnName) {
  var parts = fnName.split('/');

  if (parts.length > 1) {
    fnName = ['Object', parts[parts.length - 1]].join('.');
  } else {
    fnName = parts[0];
  }

  fnName = fnName.replace(/.<$/gi, '.<anonymous>');
  fnName = fnName.replace(/^Anonymous function$/, '<anonymous>');
  parts = fnName.split('.');

  if (parts.length > 1) {
    fnName = parts[parts.length - 1];
  } else {
    fnName = parts[0];
  }

  return fnName;
}

function isValidStackTrace(stackTraces) {
  if (stackTraces.length === 0) {
    return false;
  }

  if (stackTraces.length === 1) {
    var stackTrace = stackTraces[0];
    return 'lineNumber' in stackTrace;
  }

  return true;
}

function createStackTraces(stackParser, errorEvent) {
  var error = errorEvent.error,
      filename = errorEvent.filename,
      lineno = errorEvent.lineno,
      colno = errorEvent.colno;
  var stackTraces = [];

  if (error) {
    try {
      stackTraces = stackParser.parse(error);
    } catch (e) {}
  }

  if (!isValidStackTrace(stackTraces)) {
    stackTraces = [{
      fileName: filename,
      lineNumber: lineno,
      columnNumber: colno
    }];
  }

  var normalizedStackTraces = normalizeStackFrames(stackTraces);
  return normalizedStackTraces.map(function (stack) {
    var fileName = stack.fileName,
        lineNumber = stack.lineNumber,
        columnNumber = stack.columnNumber,
        _stack$functionName = stack.functionName,
        functionName = _stack$functionName === void 0 ? '<anonymous>' : _stack$functionName;

    if (!fileName && !lineNumber) {
      return {};
    }

    if (!columnNumber && !lineNumber) {
      return {};
    }

    var filePath = cleanFilePath(fileName);
    var cleanedFileName = filePathToFileName(filePath);

    if (isFileInline(filePath)) {
      cleanedFileName = '(inline script)';
    }

    return {
      abs_path: fileName,
      filename: cleanedFileName,
      function: functionName,
      lineno: lineNumber,
      colno: columnNumber
    };
  });
}
function filterInvalidFrames(frames) {
  return frames.filter(function (_ref) {
    var filename = _ref.filename,
        lineno = _ref.lineno;
    return typeof filename !== 'undefined' && typeof lineno !== 'undefined';
  });
}

/***/ }),

/***/ "../rum-core/dist/es/index.js":
/*!************************************!*\
  !*** ../rum-core/dist/es/index.js ***!
  \************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   APM_SERVER: function() { return /* reexport safe */ _common_constants__WEBPACK_IMPORTED_MODULE_8__.APM_SERVER; },
/* harmony export */   CLICK: function() { return /* reexport safe */ _common_constants__WEBPACK_IMPORTED_MODULE_8__.CLICK; },
/* harmony export */   CONFIG_SERVICE: function() { return /* reexport safe */ _common_constants__WEBPACK_IMPORTED_MODULE_8__.CONFIG_SERVICE; },
/* harmony export */   ERROR: function() { return /* reexport safe */ _common_constants__WEBPACK_IMPORTED_MODULE_8__.ERROR; },
/* harmony export */   ERROR_LOGGING: function() { return /* reexport safe */ _common_constants__WEBPACK_IMPORTED_MODULE_8__.ERROR_LOGGING; },
/* harmony export */   EVENT_TARGET: function() { return /* reexport safe */ _common_constants__WEBPACK_IMPORTED_MODULE_8__.EVENT_TARGET; },
/* harmony export */   LOGGING_SERVICE: function() { return /* reexport safe */ _common_constants__WEBPACK_IMPORTED_MODULE_8__.LOGGING_SERVICE; },
/* harmony export */   PAGE_LOAD: function() { return /* reexport safe */ _common_constants__WEBPACK_IMPORTED_MODULE_8__.PAGE_LOAD; },
/* harmony export */   PAGE_LOAD_DELAY: function() { return /* reexport safe */ _common_constants__WEBPACK_IMPORTED_MODULE_8__.PAGE_LOAD_DELAY; },
/* harmony export */   PERFORMANCE_MONITORING: function() { return /* reexport safe */ _common_constants__WEBPACK_IMPORTED_MODULE_8__.PERFORMANCE_MONITORING; },
/* harmony export */   ServiceFactory: function() { return /* reexport safe */ _common_service_factory__WEBPACK_IMPORTED_MODULE_2__.ServiceFactory; },
/* harmony export */   TRANSACTION_SERVICE: function() { return /* reexport safe */ _common_constants__WEBPACK_IMPORTED_MODULE_8__.TRANSACTION_SERVICE; },
/* harmony export */   afterFrame: function() { return /* reexport safe */ _common_after_frame__WEBPACK_IMPORTED_MODULE_7__["default"]; },
/* harmony export */   bootstrap: function() { return /* reexport safe */ _bootstrap__WEBPACK_IMPORTED_MODULE_10__.bootstrap; },
/* harmony export */   createServiceFactory: function() { return /* binding */ createServiceFactory; },
/* harmony export */   createTracer: function() { return /* reexport safe */ _opentracing__WEBPACK_IMPORTED_MODULE_6__.createTracer; },
/* harmony export */   getInstrumentationFlags: function() { return /* reexport safe */ _common_instrument__WEBPACK_IMPORTED_MODULE_5__.getInstrumentationFlags; },
/* harmony export */   isBrowser: function() { return /* reexport safe */ _common_utils__WEBPACK_IMPORTED_MODULE_4__.isBrowser; },
/* harmony export */   isPlatformSupported: function() { return /* reexport safe */ _common_utils__WEBPACK_IMPORTED_MODULE_4__.isPlatformSupported; },
/* harmony export */   observePageClicks: function() { return /* reexport safe */ _common_observers__WEBPACK_IMPORTED_MODULE_12__.observePageClicks; },
/* harmony export */   observePageVisibility: function() { return /* reexport safe */ _common_observers__WEBPACK_IMPORTED_MODULE_11__.observePageVisibility; },
/* harmony export */   observeUserInteractions: function() { return /* reexport safe */ _performance_monitoring__WEBPACK_IMPORTED_MODULE_9__.observeUserInteractions; },
/* harmony export */   patchAll: function() { return /* reexport safe */ _common_patching__WEBPACK_IMPORTED_MODULE_3__.patchAll; },
/* harmony export */   patchEventHandler: function() { return /* reexport safe */ _common_patching__WEBPACK_IMPORTED_MODULE_3__.patchEventHandler; },
/* harmony export */   scheduleMacroTask: function() { return /* reexport safe */ _common_utils__WEBPACK_IMPORTED_MODULE_4__.scheduleMacroTask; },
/* harmony export */   scheduleMicroTask: function() { return /* reexport safe */ _common_utils__WEBPACK_IMPORTED_MODULE_4__.scheduleMicroTask; }
/* harmony export */ });
/* harmony import */ var _error_logging__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./error-logging */ "../rum-core/dist/es/error-logging/index.js");
/* harmony import */ var _performance_monitoring__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./performance-monitoring */ "../rum-core/dist/es/performance-monitoring/index.js");
/* harmony import */ var _performance_monitoring__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./performance-monitoring */ "../rum-core/dist/es/performance-monitoring/metrics/inp/process.js");
/* harmony import */ var _common_service_factory__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./common/service-factory */ "../rum-core/dist/es/common/service-factory.js");
/* harmony import */ var _common_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./common/utils */ "../rum-core/dist/es/common/utils.js");
/* harmony import */ var _common_patching__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./common/patching */ "../rum-core/dist/es/common/patching/index.js");
/* harmony import */ var _common_observers__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./common/observers */ "../rum-core/dist/es/common/observers/page-visibility.js");
/* harmony import */ var _common_observers__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./common/observers */ "../rum-core/dist/es/common/observers/page-clicks.js");
/* harmony import */ var _common_constants__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./common/constants */ "../rum-core/dist/es/common/constants.js");
/* harmony import */ var _common_instrument__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./common/instrument */ "../rum-core/dist/es/common/instrument.js");
/* harmony import */ var _common_after_frame__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./common/after-frame */ "../rum-core/dist/es/common/after-frame.js");
/* harmony import */ var _bootstrap__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./bootstrap */ "../rum-core/dist/es/bootstrap.js");
/* harmony import */ var _opentracing__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./opentracing */ "../rum-core/dist/es/opentracing/index.js");












function createServiceFactory() {
  (0,_performance_monitoring__WEBPACK_IMPORTED_MODULE_0__.registerServices)();
  (0,_error_logging__WEBPACK_IMPORTED_MODULE_1__.registerServices)();
  var serviceFactory = new _common_service_factory__WEBPACK_IMPORTED_MODULE_2__.ServiceFactory();
  return serviceFactory;
}



/***/ }),

/***/ "../rum-core/dist/es/opentracing/index.js":
/*!************************************************!*\
  !*** ../rum-core/dist/es/opentracing/index.js ***!
  \************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Span: function() { return /* reexport safe */ _span__WEBPACK_IMPORTED_MODULE_2__["default"]; },
/* harmony export */   Tracer: function() { return /* reexport safe */ _tracer__WEBPACK_IMPORTED_MODULE_1__["default"]; },
/* harmony export */   createTracer: function() { return /* binding */ createTracer; }
/* harmony export */ });
/* harmony import */ var _tracer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./tracer */ "../rum-core/dist/es/opentracing/tracer.js");
/* harmony import */ var _span__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./span */ "../rum-core/dist/es/opentracing/span.js");
/* harmony import */ var _common_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/constants */ "../rum-core/dist/es/common/constants.js");




function createTracer(serviceFactory) {
  var performanceMonitoring = serviceFactory.getService(_common_constants__WEBPACK_IMPORTED_MODULE_0__.PERFORMANCE_MONITORING);
  var transactionService = serviceFactory.getService(_common_constants__WEBPACK_IMPORTED_MODULE_0__.TRANSACTION_SERVICE);
  var errorLogging = serviceFactory.getService(_common_constants__WEBPACK_IMPORTED_MODULE_0__.ERROR_LOGGING);
  var loggingService = serviceFactory.getService(_common_constants__WEBPACK_IMPORTED_MODULE_0__.LOGGING_SERVICE);
  return new _tracer__WEBPACK_IMPORTED_MODULE_1__["default"](performanceMonitoring, transactionService, loggingService, errorLogging);
}



/***/ }),

/***/ "../rum-core/dist/es/opentracing/span.js":
/*!***********************************************!*\
  !*** ../rum-core/dist/es/opentracing/span.js ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var opentracing_lib_span__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! opentracing/lib/span */ "../../node_modules/opentracing/lib/span.js");
/* harmony import */ var _common_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common/utils */ "../rum-core/dist/es/common/utils.js");
/* harmony import */ var _performance_monitoring_transaction__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../performance-monitoring/transaction */ "../rum-core/dist/es/performance-monitoring/transaction.js");
function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;

  _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}





var Span = function (_otSpan) {
  _inheritsLoose(Span, _otSpan);

  function Span(tracer, span) {
    var _this;

    _this = _otSpan.call(this) || this;
    _this.__tracer = tracer;
    _this.span = span;
    _this.isTransaction = span instanceof _performance_monitoring_transaction__WEBPACK_IMPORTED_MODULE_1__["default"];
    _this.spanContext = {
      id: span.id,
      traceId: span.traceId,
      sampled: span.sampled
    };
    return _this;
  }

  var _proto = Span.prototype;

  _proto._context = function _context() {
    return this.spanContext;
  };

  _proto._tracer = function _tracer() {
    return this.__tracer;
  };

  _proto._setOperationName = function _setOperationName(name) {
    this.span.name = name;
  };

  _proto._addTags = function _addTags(keyValuePairs) {
    var tags = (0,_common_utils__WEBPACK_IMPORTED_MODULE_2__.extend)({}, keyValuePairs);

    if (tags.type) {
      this.span.type = tags.type;
      delete tags.type;
    }

    if (this.isTransaction) {
      var userId = tags['user.id'];
      var username = tags['user.username'];
      var email = tags['user.email'];

      if (userId || username || email) {
        this.span.addContext({
          user: {
            id: userId,
            username: username,
            email: email
          }
        });
        delete tags['user.id'];
        delete tags['user.username'];
        delete tags['user.email'];
      }
    }

    this.span.addLabels(tags);
  };

  _proto._log = function _log(log, timestamp) {
    if (log.event === 'error') {
      if (log['error.object']) {
        this.__tracer.errorLogging.logError(log['error.object']);
      } else if (log.message) {
        this.__tracer.errorLogging.logError(log.message);
      }
    }
  };

  _proto._finish = function _finish(finishTime) {
    this.span.end();

    if (finishTime) {
      this.span._end = finishTime - (0,_common_utils__WEBPACK_IMPORTED_MODULE_2__.getTimeOrigin)();
    }
  };

  return Span;
}(opentracing_lib_span__WEBPACK_IMPORTED_MODULE_0__.Span);

/* harmony default export */ __webpack_exports__["default"] = (Span);

/***/ }),

/***/ "../rum-core/dist/es/opentracing/tracer.js":
/*!*************************************************!*\
  !*** ../rum-core/dist/es/opentracing/tracer.js ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var opentracing_lib_tracer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! opentracing/lib/tracer */ "../../node_modules/opentracing/lib/tracer.js");
/* harmony import */ var opentracing_lib_constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! opentracing/lib/constants */ "../../node_modules/opentracing/lib/constants.js");
/* harmony import */ var opentracing_lib_span__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! opentracing/lib/span */ "../../node_modules/opentracing/lib/span.js");
/* harmony import */ var _common_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../common/utils */ "../rum-core/dist/es/common/utils.js");
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../state */ "../rum-core/dist/es/state.js");
/* harmony import */ var _span__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./span */ "../rum-core/dist/es/opentracing/span.js");
function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;

  _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}








var Tracer = function (_otTracer) {
  _inheritsLoose(Tracer, _otTracer);

  function Tracer(performanceMonitoring, transactionService, loggingService, errorLogging) {
    var _this;

    _this = _otTracer.call(this) || this;
    _this.performanceMonitoring = performanceMonitoring;
    _this.transactionService = transactionService;
    _this.loggingService = loggingService;
    _this.errorLogging = errorLogging;
    return _this;
  }

  var _proto = Tracer.prototype;

  _proto._startSpan = function _startSpan(name, options) {
    var spanOptions = {
      managed: true
    };

    if (options) {
      spanOptions.timestamp = options.startTime;

      if (options.childOf) {
        spanOptions.parentId = options.childOf.id;
      } else if (options.references && options.references.length > 0) {
        if (options.references.length > 1) {
          if (_state__WEBPACK_IMPORTED_MODULE_3__.__DEV__) {
            this.loggingService.debug('Elastic APM OpenTracing: Unsupported number of references, only the first childOf reference will be recorded.');
          }
        }

        var childRef = (0,_common_utils__WEBPACK_IMPORTED_MODULE_4__.find)(options.references, function (ref) {
          return ref.type() === opentracing_lib_constants__WEBPACK_IMPORTED_MODULE_1__.REFERENCE_CHILD_OF;
        });

        if (childRef) {
          spanOptions.parentId = childRef.referencedContext().id;
        }
      }
    }

    var span;
    var currentTransaction = this.transactionService.getCurrentTransaction();

    if (currentTransaction) {
      span = this.transactionService.startSpan(name, undefined, spanOptions);
    } else {
      span = this.transactionService.startTransaction(name, undefined, spanOptions);
    }

    if (!span) {
      return new opentracing_lib_span__WEBPACK_IMPORTED_MODULE_2__.Span();
    }

    if (spanOptions.timestamp) {
      span._start = spanOptions.timestamp - (0,_common_utils__WEBPACK_IMPORTED_MODULE_4__.getTimeOrigin)();
    }

    var otSpan = new _span__WEBPACK_IMPORTED_MODULE_5__["default"](this, span);

    if (options && options.tags) {
      otSpan.addTags(options.tags);
    }

    return otSpan;
  };

  _proto._inject = function _inject(spanContext, format, carrier) {
    switch (format) {
      case opentracing_lib_constants__WEBPACK_IMPORTED_MODULE_1__.FORMAT_TEXT_MAP:
      case opentracing_lib_constants__WEBPACK_IMPORTED_MODULE_1__.FORMAT_HTTP_HEADERS:
        this.performanceMonitoring.injectDtHeader(spanContext, carrier);
        break;

      case opentracing_lib_constants__WEBPACK_IMPORTED_MODULE_1__.FORMAT_BINARY:
        if (_state__WEBPACK_IMPORTED_MODULE_3__.__DEV__) {
          this.loggingService.debug('Elastic APM OpenTracing: binary carrier format is not supported.');
        }

        break;
    }
  };

  _proto._extract = function _extract(format, carrier) {
    var ctx;

    switch (format) {
      case opentracing_lib_constants__WEBPACK_IMPORTED_MODULE_1__.FORMAT_TEXT_MAP:
      case opentracing_lib_constants__WEBPACK_IMPORTED_MODULE_1__.FORMAT_HTTP_HEADERS:
        ctx = this.performanceMonitoring.extractDtHeader(carrier);
        break;

      case opentracing_lib_constants__WEBPACK_IMPORTED_MODULE_1__.FORMAT_BINARY:
        if (_state__WEBPACK_IMPORTED_MODULE_3__.__DEV__) {
          this.loggingService.debug('Elastic APM OpenTracing: binary carrier format is not supported.');
        }

        break;
    }

    if (!ctx) {
      ctx = null;
    }

    return ctx;
  };

  return Tracer;
}(opentracing_lib_tracer__WEBPACK_IMPORTED_MODULE_0__.Tracer);

/* harmony default export */ __webpack_exports__["default"] = (Tracer);

/***/ }),

/***/ "../rum-core/dist/es/performance-monitoring/breakdown.js":
/*!***************************************************************!*\
  !*** ../rum-core/dist/es/performance-monitoring/breakdown.js ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   captureBreakdown: function() { return /* binding */ captureBreakdown; }
/* harmony export */ });
/* harmony import */ var _common_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/utils */ "../rum-core/dist/es/common/utils.js");
/* harmony import */ var _common_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/constants */ "../rum-core/dist/es/common/constants.js");


var pageLoadBreakdowns = [['domainLookupStart', 'domainLookupEnd', 'DNS'], ['connectStart', 'connectEnd', 'TCP'], ['requestStart', 'responseStart', 'Request'], ['responseStart', 'responseEnd', 'Response'], ['domLoading', 'domComplete', 'Processing'], ['loadEventStart', 'loadEventEnd', 'Load']];

function getValue(value) {
  return {
    value: value
  };
}

function calculateSelfTime(transaction) {
  var spans = transaction.spans,
      _start = transaction._start,
      _end = transaction._end;

  if (spans.length === 0) {
    return transaction.duration();
  }

  spans.sort(function (span1, span2) {
    return span1._start - span2._start;
  });
  var span = spans[0];
  var spanEnd = span._end;
  var spanStart = span._start;
  var lastContinuousEnd = spanEnd;
  var selfTime = spanStart - _start;

  for (var i = 1; i < spans.length; i++) {
    span = spans[i];
    spanStart = span._start;
    spanEnd = span._end;

    if (spanStart > lastContinuousEnd) {
      selfTime += spanStart - lastContinuousEnd;
      lastContinuousEnd = spanEnd;
    } else if (spanEnd > lastContinuousEnd) {
      lastContinuousEnd = spanEnd;
    }
  }

  if (lastContinuousEnd < _end) {
    selfTime += _end - lastContinuousEnd;
  }

  return selfTime;
}

function groupSpans(transaction) {
  var spanMap = {};
  var transactionSelfTime = calculateSelfTime(transaction);
  spanMap['app'] = {
    count: 1,
    duration: transactionSelfTime
  };
  var spans = transaction.spans;

  for (var i = 0; i < spans.length; i++) {
    var span = spans[i];
    var duration = span.duration();

    if (duration === 0 || duration == null) {
      continue;
    }

    var type = span.type,
        subtype = span.subtype;
    var key = type.replace(_common_constants__WEBPACK_IMPORTED_MODULE_0__.TRUNCATED_TYPE, '');

    if (subtype) {
      key += '.' + subtype;
    }

    if (!spanMap[key]) {
      spanMap[key] = {
        duration: 0,
        count: 0
      };
    }

    spanMap[key].count++;
    spanMap[key].duration += duration;
  }

  return spanMap;
}

function getSpanBreakdown(transactionDetails, _ref) {
  var details = _ref.details,
      _ref$count = _ref.count,
      count = _ref$count === void 0 ? 1 : _ref$count,
      duration = _ref.duration;
  return {
    transaction: transactionDetails,
    span: details,
    samples: {
      'span.self_time.count': getValue(count),
      'span.self_time.sum.us': getValue(duration * 1000)
    }
  };
}

function captureBreakdown(transaction, timings) {
  if (timings === void 0) {
    timings = _common_utils__WEBPACK_IMPORTED_MODULE_1__.PERF.timing;
  }

  var breakdowns = [];
  var name = transaction.name,
      type = transaction.type,
      sampled = transaction.sampled;
  var transactionDetails = {
    name: name,
    type: type
  };

  if (!sampled) {
    return breakdowns;
  }

  if (type === _common_constants__WEBPACK_IMPORTED_MODULE_0__.PAGE_LOAD && timings) {
    for (var i = 0; i < pageLoadBreakdowns.length; i++) {
      var current = pageLoadBreakdowns[i];
      var start = timings[current[0]];
      var end = timings[current[1]];
      var duration = (0,_common_utils__WEBPACK_IMPORTED_MODULE_1__.getDuration)(start, end);

      if (duration === 0 || duration == null) {
        continue;
      }

      breakdowns.push(getSpanBreakdown(transactionDetails, {
        details: {
          type: current[2]
        },
        duration: duration
      }));
    }
  } else {
    var spanMap = groupSpans(transaction);
    Object.keys(spanMap).forEach(function (key) {
      var _key$split = key.split('.'),
          type = _key$split[0],
          subtype = _key$split[1];

      var _spanMap$key = spanMap[key],
          duration = _spanMap$key.duration,
          count = _spanMap$key.count;
      breakdowns.push(getSpanBreakdown(transactionDetails, {
        details: {
          type: type,
          subtype: subtype
        },
        duration: duration,
        count: count
      }));
    });
  }

  return breakdowns;
}

/***/ }),

/***/ "../rum-core/dist/es/performance-monitoring/index.js":
/*!***********************************************************!*\
  !*** ../rum-core/dist/es/performance-monitoring/index.js ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   observeUserInteractions: function() { return /* reexport safe */ _metrics_inp_process__WEBPACK_IMPORTED_MODULE_4__.observeUserInteractions; },
/* harmony export */   registerServices: function() { return /* binding */ registerServices; },
/* harmony export */   reportInp: function() { return /* reexport safe */ _metrics_inp_report__WEBPACK_IMPORTED_MODULE_5__.reportInp; }
/* harmony export */ });
/* harmony import */ var _performance_monitoring__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./performance-monitoring */ "../rum-core/dist/es/performance-monitoring/performance-monitoring.js");
/* harmony import */ var _transaction_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./transaction-service */ "../rum-core/dist/es/performance-monitoring/transaction-service.js");
/* harmony import */ var _common_constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/constants */ "../rum-core/dist/es/common/constants.js");
/* harmony import */ var _common_service_factory__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/service-factory */ "../rum-core/dist/es/common/service-factory.js");
/* harmony import */ var _metrics_inp_process__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./metrics/inp/process */ "../rum-core/dist/es/performance-monitoring/metrics/inp/process.js");
/* harmony import */ var _metrics_inp_report__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./metrics/inp/report */ "../rum-core/dist/es/performance-monitoring/metrics/inp/report.js");







function registerServices() {
  _common_service_factory__WEBPACK_IMPORTED_MODULE_0__.serviceCreators[_common_constants__WEBPACK_IMPORTED_MODULE_1__.TRANSACTION_SERVICE] = function (serviceFactory) {
    var _serviceFactory$getSe = serviceFactory.getService([_common_constants__WEBPACK_IMPORTED_MODULE_1__.LOGGING_SERVICE, _common_constants__WEBPACK_IMPORTED_MODULE_1__.CONFIG_SERVICE]),
        loggingService = _serviceFactory$getSe[0],
        configService = _serviceFactory$getSe[1];

    return new _transaction_service__WEBPACK_IMPORTED_MODULE_2__["default"](loggingService, configService);
  };

  _common_service_factory__WEBPACK_IMPORTED_MODULE_0__.serviceCreators[_common_constants__WEBPACK_IMPORTED_MODULE_1__.PERFORMANCE_MONITORING] = function (serviceFactory) {
    var _serviceFactory$getSe2 = serviceFactory.getService([_common_constants__WEBPACK_IMPORTED_MODULE_1__.APM_SERVER, _common_constants__WEBPACK_IMPORTED_MODULE_1__.CONFIG_SERVICE, _common_constants__WEBPACK_IMPORTED_MODULE_1__.LOGGING_SERVICE, _common_constants__WEBPACK_IMPORTED_MODULE_1__.TRANSACTION_SERVICE]),
        apmServer = _serviceFactory$getSe2[0],
        configService = _serviceFactory$getSe2[1],
        loggingService = _serviceFactory$getSe2[2],
        transactionService = _serviceFactory$getSe2[3];

    return new _performance_monitoring__WEBPACK_IMPORTED_MODULE_3__["default"](apmServer, configService, loggingService, transactionService);
  };
}



/***/ }),

/***/ "../rum-core/dist/es/performance-monitoring/metrics/inp/process.js":
/*!*************************************************************************!*\
  !*** ../rum-core/dist/es/performance-monitoring/metrics/inp/process.js ***!
  \*************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   calculateInp: function() { return /* binding */ calculateInp; },
/* harmony export */   inpState: function() { return /* binding */ inpState; },
/* harmony export */   interactionCount: function() { return /* binding */ interactionCount; },
/* harmony export */   observeUserInteractions: function() { return /* binding */ observeUserInteractions; },
/* harmony export */   processUserInteractions: function() { return /* binding */ processUserInteractions; },
/* harmony export */   restoreINPState: function() { return /* binding */ restoreINPState; }
/* harmony export */ });
/* harmony import */ var _common_constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../common/constants */ "../rum-core/dist/es/common/constants.js");
/* harmony import */ var _common_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../common/utils */ "../rum-core/dist/es/common/utils.js");
/* harmony import */ var _metrics__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../metrics */ "../rum-core/dist/es/performance-monitoring/metrics/metrics.js");



var INP_THRESHOLD = 40;
var MAX_INTERACTIONS_TO_CONSIDER = 10;
var inpState = {
  minInteractionId: Infinity,
  maxInteractionId: 0,
  interactionCount: 0,
  longestInteractions: []
};
function observeUserInteractions(recorder) {
  if (recorder === void 0) {
    recorder = new _metrics__WEBPACK_IMPORTED_MODULE_0__.PerfEntryRecorder(processUserInteractions);
  }

  var isPerfCountSupported = (0,_common_utils__WEBPACK_IMPORTED_MODULE_1__.isPerfInteractionCountSupported)();
  var durationThreshold = isPerfCountSupported ? INP_THRESHOLD : 16;
  recorder.start(_common_constants__WEBPACK_IMPORTED_MODULE_2__.EVENT, {
    buffered: true,
    durationThreshold: durationThreshold
  });

  if (!isPerfCountSupported) {
    recorder.start(_common_constants__WEBPACK_IMPORTED_MODULE_2__.FIRST_INPUT);
  }
}
function processUserInteractions(list) {
  var entries = list.getEntries();
  entries.forEach(function (entry) {
    if (!entry.interactionId) {
      return;
    }

    updateInteractionCount(entry);

    if (entry.duration < INP_THRESHOLD) {
      return;
    }

    storeUserInteraction(entry);
  });
}
function calculateInp() {
  if (inpState.longestInteractions.length === 0) {
    if (interactionCount() > 0) {
      return 0;
    }

    return;
  }

  var interactionIndex = Math.min(inpState.longestInteractions.length - 1, Math.floor(interactionCount() / 50));
  var inp = inpState.longestInteractions[interactionIndex].duration;
  return inp;
}
function interactionCount() {
  return performance.interactionCount || inpState.interactionCount;
}
function restoreINPState() {
  inpState.minInteractionId = Infinity;
  inpState.maxInteractionId = 0;
  inpState.interactionCount = 0;
  inpState.longestInteractions = [];
}

function storeUserInteraction(entry) {
  var leastSlow = inpState.longestInteractions[inpState.longestInteractions.length - 1];

  if (typeof leastSlow !== 'undefined' && entry.duration <= leastSlow.duration && entry.interactionId != leastSlow.id) {
    return;
  }

  var filteredInteraction = inpState.longestInteractions.filter(function (interaction) {
    return interaction.id === entry.interactionId;
  });

  if (filteredInteraction.length > 0) {
    var foundInteraction = filteredInteraction[0];
    foundInteraction.duration = Math.max(foundInteraction.duration, entry.duration);
  } else {
    inpState.longestInteractions.push({
      id: entry.interactionId,
      duration: entry.duration
    });
  }

  inpState.longestInteractions.sort(function (a, b) {
    return b.duration - a.duration;
  });
  inpState.longestInteractions.splice(MAX_INTERACTIONS_TO_CONSIDER);
}

function updateInteractionCount(entry) {
  if ((0,_common_utils__WEBPACK_IMPORTED_MODULE_1__.isPerfInteractionCountSupported)()) {
    return;
  }

  inpState.minInteractionId = Math.min(inpState.minInteractionId, entry.interactionId);
  inpState.maxInteractionId = Math.max(inpState.maxInteractionId, entry.interactionId);
  inpState.interactionCount = (inpState.maxInteractionId - inpState.minInteractionId) / 7 + 1;
}

/***/ }),

/***/ "../rum-core/dist/es/performance-monitoring/metrics/inp/report.js":
/*!************************************************************************!*\
  !*** ../rum-core/dist/es/performance-monitoring/metrics/inp/report.js ***!
  \************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   reportInp: function() { return /* binding */ reportInp; }
/* harmony export */ });
/* harmony import */ var _process__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./process */ "../rum-core/dist/es/performance-monitoring/metrics/inp/process.js");
/* harmony import */ var _common_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../common/utils */ "../rum-core/dist/es/common/utils.js");
/* harmony import */ var _common_constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../common/constants */ "../rum-core/dist/es/common/constants.js");



function reportInp(transactionService) {
  var inp = (0,_process__WEBPACK_IMPORTED_MODULE_0__.calculateInp)();

  if (inp >= 0) {
    var startTime = (0,_common_utils__WEBPACK_IMPORTED_MODULE_1__.now)();
    var inpTr = transactionService.startTransaction(_common_constants__WEBPACK_IMPORTED_MODULE_2__.PAGE_EXIT, _common_constants__WEBPACK_IMPORTED_MODULE_2__.PAGE_EXIT, {
      startTime: startTime
    });
    var navigations = performance.getEntriesByType('navigation');

    if (navigations.length > 0) {
      var hardNavigationUrl = navigations[0].name;
      inpTr.addContext({
        page: {
          url: hardNavigationUrl
        }
      });
    }

    inpTr.addLabels({
      inp_value: inp
    });
    var endTime = startTime + inp + 1;
    inpTr.end(endTime);
    (0,_process__WEBPACK_IMPORTED_MODULE_0__.restoreINPState)();
    return inpTr;
  }
}

/***/ }),

/***/ "../rum-core/dist/es/performance-monitoring/metrics/metrics.js":
/*!*********************************************************************!*\
  !*** ../rum-core/dist/es/performance-monitoring/metrics/metrics.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PerfEntryRecorder: function() { return /* binding */ PerfEntryRecorder; },
/* harmony export */   calculateCumulativeLayoutShift: function() { return /* binding */ calculateCumulativeLayoutShift; },
/* harmony export */   calculateTotalBlockingTime: function() { return /* binding */ calculateTotalBlockingTime; },
/* harmony export */   captureObserverEntries: function() { return /* binding */ captureObserverEntries; },
/* harmony export */   createFirstInputDelaySpan: function() { return /* binding */ createFirstInputDelaySpan; },
/* harmony export */   createLongTaskSpans: function() { return /* binding */ createLongTaskSpans; },
/* harmony export */   createTotalBlockingTimeSpan: function() { return /* binding */ createTotalBlockingTimeSpan; },
/* harmony export */   metrics: function() { return /* binding */ metrics; }
/* harmony export */ });
/* harmony import */ var _common_constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../common/constants */ "../rum-core/dist/es/common/constants.js");
/* harmony import */ var _common_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../common/utils */ "../rum-core/dist/es/common/utils.js");
/* harmony import */ var _span__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../span */ "../rum-core/dist/es/performance-monitoring/span.js");
function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}




var metrics = {
  fid: 0,
  fcp: 0,
  tbt: {
    start: Infinity,
    duration: 0
  },
  cls: {
    score: 0,
    firstEntryTime: Number.NEGATIVE_INFINITY,
    prevEntryTime: Number.NEGATIVE_INFINITY,
    currentSessionScore: 0
  },
  longtask: {
    count: 0,
    duration: 0,
    max: 0
  }
};
var LONG_TASK_THRESHOLD = 50;
function createLongTaskSpans(longtasks, agg) {
  var spans = [];

  for (var i = 0; i < longtasks.length; i++) {
    var _longtasks$i = longtasks[i],
        name = _longtasks$i.name,
        startTime = _longtasks$i.startTime,
        duration = _longtasks$i.duration,
        attribution = _longtasks$i.attribution;
    var end = startTime + duration;
    var span = new _span__WEBPACK_IMPORTED_MODULE_0__["default"]("Longtask(" + name + ")", _common_constants__WEBPACK_IMPORTED_MODULE_1__.LONG_TASK, {
      startTime: startTime
    });
    agg.count++;
    agg.duration += duration;
    agg.max = Math.max(duration, agg.max);

    if (attribution.length > 0) {
      var _attribution$ = attribution[0],
          _name = _attribution$.name,
          containerType = _attribution$.containerType,
          containerName = _attribution$.containerName,
          containerId = _attribution$.containerId;
      var customContext = {
        attribution: _name,
        type: containerType
      };

      if (containerName) {
        customContext.name = containerName;
      }

      if (containerId) {
        customContext.id = containerId;
      }

      span.addContext({
        custom: customContext
      });
    }

    span.end(end);
    spans.push(span);
  }

  return spans;
}
function createFirstInputDelaySpan(fidEntries) {
  var firstInput = fidEntries[0];

  if (firstInput) {
    var startTime = firstInput.startTime,
        processingStart = firstInput.processingStart;
    var span = new _span__WEBPACK_IMPORTED_MODULE_0__["default"]('First Input Delay', _common_constants__WEBPACK_IMPORTED_MODULE_1__.FIRST_INPUT, {
      startTime: startTime
    });
    span.end(processingStart);
    return span;
  }
}
function createTotalBlockingTimeSpan(tbtObject) {
  var start = tbtObject.start,
      duration = tbtObject.duration;
  var tbtSpan = new _span__WEBPACK_IMPORTED_MODULE_0__["default"]('Total Blocking Time', _common_constants__WEBPACK_IMPORTED_MODULE_1__.LONG_TASK, {
    startTime: start
  });
  tbtSpan.end(start + duration);
  return tbtSpan;
}
function calculateTotalBlockingTime(longtaskEntries) {
  longtaskEntries.forEach(function (entry) {
    var name = entry.name,
        startTime = entry.startTime,
        duration = entry.duration;

    if (startTime < metrics.fcp) {
      return;
    }

    if (name !== 'self' && name.indexOf('same-origin') === -1) {
      return;
    }

    metrics.tbt.start = Math.min(metrics.tbt.start, startTime);
    var blockingTime = duration - LONG_TASK_THRESHOLD;

    if (blockingTime > 0) {
      metrics.tbt.duration += blockingTime;
    }
  });
}
function calculateCumulativeLayoutShift(clsEntries) {
  clsEntries.forEach(function (entry) {
    if (!entry.hadRecentInput && entry.value) {
      var shouldCreateNewSession = entry.startTime - metrics.cls.firstEntryTime > 5000 || entry.startTime - metrics.cls.prevEntryTime > 1000;

      if (shouldCreateNewSession) {
        metrics.cls.firstEntryTime = entry.startTime;
        metrics.cls.currentSessionScore = 0;
      }

      metrics.cls.prevEntryTime = entry.startTime;
      metrics.cls.currentSessionScore += entry.value;
      metrics.cls.score = Math.max(metrics.cls.score, metrics.cls.currentSessionScore);
    }
  });
}
function captureObserverEntries(list, _ref) {
  var isHardNavigation = _ref.isHardNavigation,
      trStart = _ref.trStart;
  var longtaskEntries = list.getEntriesByType(_common_constants__WEBPACK_IMPORTED_MODULE_1__.LONG_TASK).filter(function (entry) {
    return entry.startTime >= trStart;
  });
  var longTaskSpans = createLongTaskSpans(longtaskEntries, metrics.longtask);
  var result = {
    spans: longTaskSpans,
    marks: {}
  };

  if (!isHardNavigation) {
    return result;
  }

  var lcpEntries = list.getEntriesByType(_common_constants__WEBPACK_IMPORTED_MODULE_1__.LARGEST_CONTENTFUL_PAINT);
  var lastLcpEntry = lcpEntries[lcpEntries.length - 1];

  if (lastLcpEntry) {
    var lcp = parseInt(lastLcpEntry.startTime);
    metrics.lcp = lcp;
    result.marks.largestContentfulPaint = lcp;
  }

  var timing = _common_utils__WEBPACK_IMPORTED_MODULE_2__.PERF.timing;
  var unloadDiff = timing.fetchStart - timing.navigationStart;

  if ((0,_common_utils__WEBPACK_IMPORTED_MODULE_2__.isRedirectInfoAvailable)(timing)) {
    unloadDiff = 0;
  }

  var fcpEntry = list.getEntriesByName(_common_constants__WEBPACK_IMPORTED_MODULE_1__.FIRST_CONTENTFUL_PAINT)[0];

  if (fcpEntry) {
    var fcp = parseInt(unloadDiff >= 0 ? fcpEntry.startTime - unloadDiff : fcpEntry.startTime);
    metrics.fcp = fcp;
    result.marks.firstContentfulPaint = fcp;
  }

  var fidEntries = list.getEntriesByType(_common_constants__WEBPACK_IMPORTED_MODULE_1__.FIRST_INPUT);
  var fidSpan = createFirstInputDelaySpan(fidEntries);

  if (fidSpan) {
    metrics.fid = fidSpan.duration();
    result.spans.push(fidSpan);
  }

  calculateTotalBlockingTime(longtaskEntries);
  var clsEntries = list.getEntriesByType(_common_constants__WEBPACK_IMPORTED_MODULE_1__.LAYOUT_SHIFT);
  calculateCumulativeLayoutShift(clsEntries);
  return result;
}
var PerfEntryRecorder = function () {
  function PerfEntryRecorder(callback) {
    this.po = {
      observe: _common_utils__WEBPACK_IMPORTED_MODULE_2__.noop,
      disconnect: _common_utils__WEBPACK_IMPORTED_MODULE_2__.noop
    };

    if (window.PerformanceObserver) {
      this.po = new PerformanceObserver(callback);
    }
  }

  var _proto = PerfEntryRecorder.prototype;

  _proto.start = function start(type, options) {
    if (options === void 0) {
      options = {
        buffered: true
      };
    }

    try {
      if (!(0,_common_utils__WEBPACK_IMPORTED_MODULE_2__.isPerfTypeSupported)(type)) {
        return;
      }

      this.po.observe(_extends({
        type: type
      }, options));
    } catch (_) {}
  };

  _proto.stop = function stop() {
    this.po.disconnect();
  };

  return PerfEntryRecorder;
}();

/***/ }),

/***/ "../rum-core/dist/es/performance-monitoring/navigation/capture-navigation.js":
/*!***********************************************************************************!*\
  !*** ../rum-core/dist/es/performance-monitoring/navigation/capture-navigation.js ***!
  \***********************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   captureNavigation: function() { return /* binding */ captureNavigation; },
/* harmony export */   createNavigationTimingSpans: function() { return /* reexport safe */ _navigation_timing__WEBPACK_IMPORTED_MODULE_2__.createNavigationTimingSpans; },
/* harmony export */   createResourceTimingSpans: function() { return /* reexport safe */ _resource_timing__WEBPACK_IMPORTED_MODULE_4__.createResourceTimingSpans; },
/* harmony export */   createUserTimingSpans: function() { return /* reexport safe */ _user_timing__WEBPACK_IMPORTED_MODULE_6__.createUserTimingSpans; },
/* harmony export */   getPageLoadMarks: function() { return /* reexport safe */ _marks__WEBPACK_IMPORTED_MODULE_3__.getPageLoadMarks; }
/* harmony export */ });
/* harmony import */ var _common_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../common/utils */ "../rum-core/dist/es/common/utils.js");
/* harmony import */ var _common_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/constants */ "../rum-core/dist/es/common/constants.js");
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../state */ "../rum-core/dist/es/state.js");
/* harmony import */ var _navigation_timing__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./navigation-timing */ "../rum-core/dist/es/performance-monitoring/navigation/navigation-timing.js");
/* harmony import */ var _user_timing__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./user-timing */ "../rum-core/dist/es/performance-monitoring/navigation/user-timing.js");
/* harmony import */ var _resource_timing__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./resource-timing */ "../rum-core/dist/es/performance-monitoring/navigation/resource-timing.js");
/* harmony import */ var _marks__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./marks */ "../rum-core/dist/es/performance-monitoring/navigation/marks.js");








function captureNavigation(transaction) {
  if (!transaction.captureTimings) {
    if (transaction.type === _common_constants__WEBPACK_IMPORTED_MODULE_0__.PAGE_LOAD) {
      transaction._start = 0;
    }

    return;
  }

  var trEnd = transaction._end;

  if (transaction.type === _common_constants__WEBPACK_IMPORTED_MODULE_0__.PAGE_LOAD) {
    if (transaction.marks && transaction.marks.custom) {
      var customMarks = transaction.marks.custom;
      Object.keys(customMarks).forEach(function (key) {
        customMarks[key] += transaction._start;
      });
    }

    var trStart = 0;
    transaction._start = trStart;
    var timings = _common_utils__WEBPACK_IMPORTED_MODULE_1__.PERF.timing;
    var baseTime = (0,_common_utils__WEBPACK_IMPORTED_MODULE_1__.isRedirectInfoAvailable)(timings) ? timings.redirectStart : timings.fetchStart;
    (0,_navigation_timing__WEBPACK_IMPORTED_MODULE_2__.createNavigationTimingSpans)(timings, baseTime, trStart, trEnd).forEach(function (span) {
      span.traceId = transaction.traceId;
      span.sampled = transaction.sampled;

      if (span.pageResponse && transaction.options.pageLoadSpanId) {
        span.id = transaction.options.pageLoadSpanId;
      }

      transaction.spans.push(span);
    });
    transaction.addMarks((0,_marks__WEBPACK_IMPORTED_MODULE_3__.getPageLoadMarks)(timings));
  }

  if ((0,_common_utils__WEBPACK_IMPORTED_MODULE_1__.isPerfTimelineSupported)()) {
    var _trStart = transaction._start;
    var resourceEntries = _common_utils__WEBPACK_IMPORTED_MODULE_1__.PERF.getEntriesByType(_common_constants__WEBPACK_IMPORTED_MODULE_0__.RESOURCE);
    (0,_resource_timing__WEBPACK_IMPORTED_MODULE_4__.createResourceTimingSpans)(resourceEntries, _state__WEBPACK_IMPORTED_MODULE_5__.state.bootstrapTime, _trStart, trEnd).forEach(function (span) {
      return transaction.spans.push(span);
    });
    var userEntries = _common_utils__WEBPACK_IMPORTED_MODULE_1__.PERF.getEntriesByType(_common_constants__WEBPACK_IMPORTED_MODULE_0__.MEASURE);
    (0,_user_timing__WEBPACK_IMPORTED_MODULE_6__.createUserTimingSpans)(userEntries, _trStart, trEnd).forEach(function (span) {
      return transaction.spans.push(span);
    });
  }
}



/***/ }),

/***/ "../rum-core/dist/es/performance-monitoring/navigation/marks.js":
/*!**********************************************************************!*\
  !*** ../rum-core/dist/es/performance-monitoring/navigation/marks.js ***!
  \**********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   COMPRESSED_NAV_TIMING_MARKS: function() { return /* binding */ COMPRESSED_NAV_TIMING_MARKS; },
/* harmony export */   NAVIGATION_TIMING_MARKS: function() { return /* binding */ NAVIGATION_TIMING_MARKS; },
/* harmony export */   getPageLoadMarks: function() { return /* binding */ getPageLoadMarks; }
/* harmony export */ });
/* harmony import */ var _common_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/utils */ "../rum-core/dist/es/common/utils.js");

var NAVIGATION_TIMING_MARKS = ['fetchStart', 'domainLookupStart', 'domainLookupEnd', 'connectStart', 'connectEnd', 'requestStart', 'responseStart', 'responseEnd', 'domLoading', 'domInteractive', 'domContentLoadedEventStart', 'domContentLoadedEventEnd', 'domComplete', 'loadEventStart', 'loadEventEnd'];
var COMPRESSED_NAV_TIMING_MARKS = ['fs', 'ls', 'le', 'cs', 'ce', 'qs', 'rs', 're', 'dl', 'di', 'ds', 'de', 'dc', 'es', 'ee'];

function getPageLoadMarks(timing) {
  var marks = getNavigationTimingMarks(timing);

  if (marks == null) {
    return null;
  }

  return {
    navigationTiming: marks,
    agent: {
      timeToFirstByte: marks.responseStart,
      domInteractive: marks.domInteractive,
      domComplete: marks.domComplete
    }
  };
}

function getNavigationTimingMarks(timing) {
  var redirectStart = timing.redirectStart,
      fetchStart = timing.fetchStart,
      navigationStart = timing.navigationStart,
      responseStart = timing.responseStart,
      responseEnd = timing.responseEnd;

  if (fetchStart >= navigationStart && responseStart >= fetchStart && responseEnd >= responseStart) {
    var marks = {};
    NAVIGATION_TIMING_MARKS.forEach(function (timingKey) {
      var m = timing[timingKey];

      if (m && m >= fetchStart) {
        if ((0,_common_utils__WEBPACK_IMPORTED_MODULE_0__.isRedirectInfoAvailable)(timing)) {
          marks[timingKey] = parseInt(m - redirectStart);
        } else {
          marks[timingKey] = parseInt(m - fetchStart);
        }
      }
    });
    return marks;
  }

  return null;
}



/***/ }),

/***/ "../rum-core/dist/es/performance-monitoring/navigation/navigation-timing.js":
/*!**********************************************************************************!*\
  !*** ../rum-core/dist/es/performance-monitoring/navigation/navigation-timing.js ***!
  \**********************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createNavigationTimingSpans: function() { return /* binding */ createNavigationTimingSpans; }
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "../rum-core/dist/es/performance-monitoring/navigation/utils.js");
/* harmony import */ var _span__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../span */ "../rum-core/dist/es/performance-monitoring/span.js");


var eventPairs = [['redirectStart', 'redirectEnd', 'Redirect'], ['domainLookupStart', 'domainLookupEnd', 'Domain lookup'], ['connectStart', 'connectEnd', 'Making a connection to the server'], ['requestStart', 'responseEnd', 'Requesting and receiving the document'], ['domLoading', 'domInteractive', 'Parsing the document, executing sync. scripts'], ['domContentLoadedEventStart', 'domContentLoadedEventEnd', 'Fire "DOMContentLoaded" event'], ['loadEventStart', 'loadEventEnd', 'Fire "load" event']];

function createNavigationTimingSpans(timings, baseTime, trStart, trEnd) {
  var spans = [];

  for (var i = 0; i < eventPairs.length; i++) {
    var start = timings[eventPairs[i][0]];
    var end = timings[eventPairs[i][1]];

    if (!(0,_utils__WEBPACK_IMPORTED_MODULE_0__.shouldCreateSpan)(start, end, trStart, trEnd, baseTime)) {
      continue;
    }

    var span = new _span__WEBPACK_IMPORTED_MODULE_1__["default"](eventPairs[i][2], 'hard-navigation.browser-timing');
    var data = null;

    if (eventPairs[i][0] === 'requestStart') {
      span.pageResponse = true;
      data = {
        url: location.origin
      };
    }

    span._start = start - baseTime;
    span.end(end - baseTime, data);
    spans.push(span);
  }

  return spans;
}



/***/ }),

/***/ "../rum-core/dist/es/performance-monitoring/navigation/resource-timing.js":
/*!********************************************************************************!*\
  !*** ../rum-core/dist/es/performance-monitoring/navigation/resource-timing.js ***!
  \********************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createResourceTimingSpans: function() { return /* binding */ createResourceTimingSpans; }
/* harmony export */ });
/* harmony import */ var _common_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/utils */ "../rum-core/dist/es/common/utils.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils */ "../rum-core/dist/es/performance-monitoring/navigation/utils.js");
/* harmony import */ var _common_constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../common/constants */ "../rum-core/dist/es/common/constants.js");
/* harmony import */ var _span__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../span */ "../rum-core/dist/es/performance-monitoring/span.js");





function createResourceTimingSpan(resourceTimingEntry) {
  var name = resourceTimingEntry.name,
      initiatorType = resourceTimingEntry.initiatorType,
      startTime = resourceTimingEntry.startTime,
      responseEnd = resourceTimingEntry.responseEnd;
  var kind = 'resource';

  if (initiatorType) {
    kind += '.' + initiatorType;
  }

  var spanName = (0,_common_utils__WEBPACK_IMPORTED_MODULE_0__.stripQueryStringFromUrl)(name);
  var span = new _span__WEBPACK_IMPORTED_MODULE_1__["default"](spanName, kind);
  span._start = startTime;
  span.end(responseEnd, {
    url: name,
    entry: resourceTimingEntry
  });
  return span;
}

function isCapturedByPatching(resourceStartTime, requestPatchTime) {
  return requestPatchTime != null && resourceStartTime > requestPatchTime;
}

function isIntakeAPIEndpoint(url) {
  return /intake\/v\d+\/rum\/events/.test(url);
}

function createResourceTimingSpans(entries, requestPatchTime, trStart, trEnd) {
  var spans = [];

  for (var i = 0; i < entries.length; i++) {
    var _entries$i = entries[i],
        initiatorType = _entries$i.initiatorType,
        name = _entries$i.name,
        startTime = _entries$i.startTime,
        responseEnd = _entries$i.responseEnd;

    if (_common_constants__WEBPACK_IMPORTED_MODULE_2__.RESOURCE_INITIATOR_TYPES.indexOf(initiatorType) === -1 || name == null) {
      continue;
    }

    if ((initiatorType === 'xmlhttprequest' || initiatorType === 'fetch') && (isIntakeAPIEndpoint(name) || isCapturedByPatching(startTime, requestPatchTime))) {
      continue;
    }

    if ((0,_utils__WEBPACK_IMPORTED_MODULE_3__.shouldCreateSpan)(startTime, responseEnd, trStart, trEnd)) {
      spans.push(createResourceTimingSpan(entries[i]));
    }
  }

  return spans;
}



/***/ }),

/***/ "../rum-core/dist/es/performance-monitoring/navigation/user-timing.js":
/*!****************************************************************************!*\
  !*** ../rum-core/dist/es/performance-monitoring/navigation/user-timing.js ***!
  \****************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createUserTimingSpans: function() { return /* binding */ createUserTimingSpans; }
/* harmony export */ });
/* harmony import */ var _common_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/constants */ "../rum-core/dist/es/common/constants.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ "../rum-core/dist/es/performance-monitoring/navigation/utils.js");
/* harmony import */ var _span__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../span */ "../rum-core/dist/es/performance-monitoring/span.js");




function createUserTimingSpans(entries, trStart, trEnd) {
  var userTimingSpans = [];

  for (var i = 0; i < entries.length; i++) {
    var _entries$i = entries[i],
        name = _entries$i.name,
        startTime = _entries$i.startTime,
        duration = _entries$i.duration;
    var end = startTime + duration;

    if (duration <= _common_constants__WEBPACK_IMPORTED_MODULE_0__.USER_TIMING_THRESHOLD || !(0,_utils__WEBPACK_IMPORTED_MODULE_1__.shouldCreateSpan)(startTime, end, trStart, trEnd)) {
      continue;
    }

    var kind = 'app';
    var span = new _span__WEBPACK_IMPORTED_MODULE_2__["default"](name, kind);
    span._start = startTime;
    span.end(end);
    userTimingSpans.push(span);
  }

  return userTimingSpans;
}



/***/ }),

/***/ "../rum-core/dist/es/performance-monitoring/navigation/utils.js":
/*!**********************************************************************!*\
  !*** ../rum-core/dist/es/performance-monitoring/navigation/utils.js ***!
  \**********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   shouldCreateSpan: function() { return /* binding */ shouldCreateSpan; }
/* harmony export */ });
/* harmony import */ var _common_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/constants */ "../rum-core/dist/es/common/constants.js");


function shouldCreateSpan(start, end, trStart, trEnd, baseTime) {
  if (baseTime === void 0) {
    baseTime = 0;
  }

  return typeof start === 'number' && typeof end === 'number' && start >= baseTime && end > start && start - baseTime >= trStart && end - baseTime <= trEnd && end - start < _common_constants__WEBPACK_IMPORTED_MODULE_0__.MAX_SPAN_DURATION && start - baseTime < _common_constants__WEBPACK_IMPORTED_MODULE_0__.MAX_SPAN_DURATION && end - baseTime < _common_constants__WEBPACK_IMPORTED_MODULE_0__.MAX_SPAN_DURATION;
}



/***/ }),

/***/ "../rum-core/dist/es/performance-monitoring/performance-monitoring.js":
/*!****************************************************************************!*\
  !*** ../rum-core/dist/es/performance-monitoring/performance-monitoring.js ***!
  \****************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   adjustTransaction: function() { return /* binding */ adjustTransaction; },
/* harmony export */   "default": function() { return /* binding */ PerformanceMonitoring; },
/* harmony export */   groupSmallContinuouslySimilarSpans: function() { return /* binding */ groupSmallContinuouslySimilarSpans; }
/* harmony export */ });
/* harmony import */ var _common_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../common/utils */ "../rum-core/dist/es/common/utils.js");
/* harmony import */ var _common_url__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../common/url */ "../rum-core/dist/es/common/url.js");
/* harmony import */ var _common_patching__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/patching */ "../rum-core/dist/es/common/patching/index.js");
/* harmony import */ var _common_patching_patch_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common/patching/patch-utils */ "../rum-core/dist/es/common/patching/patch-utils.js");
/* harmony import */ var _common_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/constants */ "../rum-core/dist/es/common/constants.js");
/* harmony import */ var _common_truncate__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../common/truncate */ "../rum-core/dist/es/common/truncate.js");
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../state */ "../rum-core/dist/es/state.js");







var SIMILAR_SPAN_TO_TRANSACTION_RATIO = 0.05;
var TRANSACTION_DURATION_THRESHOLD = 60000;
function groupSmallContinuouslySimilarSpans(originalSpans, transDuration, threshold) {
  originalSpans.sort(function (spanA, spanB) {
    return spanA._start - spanB._start;
  });
  var spans = [];
  var lastCount = 1;
  originalSpans.forEach(function (span, index) {
    if (spans.length === 0) {
      spans.push(span);
    } else {
      var lastSpan = spans[spans.length - 1];
      var isContinuouslySimilar = lastSpan.type === span.type && lastSpan.subtype === span.subtype && lastSpan.action === span.action && lastSpan.name === span.name && span.duration() / transDuration < threshold && (span._start - lastSpan._end) / transDuration < threshold;
      var isLastSpan = originalSpans.length === index + 1;

      if (isContinuouslySimilar) {
        lastCount++;
        lastSpan._end = span._end;
      }

      if (lastCount > 1 && (!isContinuouslySimilar || isLastSpan)) {
        lastSpan.name = lastCount + 'x ' + lastSpan.name;
        lastCount = 1;
      }

      if (!isContinuouslySimilar) {
        spans.push(span);
      }
    }
  });
  return spans;
}
function adjustTransaction(transaction) {
  if (transaction.sampled) {
    var filterdSpans = transaction.spans.filter(function (span) {
      return span.duration() > 0 && span._start >= transaction._start && span._end <= transaction._end;
    });

    if (transaction.isManaged()) {
      var duration = transaction.duration();
      var similarSpans = groupSmallContinuouslySimilarSpans(filterdSpans, duration, SIMILAR_SPAN_TO_TRANSACTION_RATIO);
      transaction.spans = similarSpans;
    } else {
      transaction.spans = filterdSpans;
    }
  } else {
    transaction.resetFields();
  }

  return transaction;
}

var PerformanceMonitoring = function () {
  function PerformanceMonitoring(apmServer, configService, loggingService, transactionService) {
    this._apmServer = apmServer;
    this._configService = configService;
    this._logginService = loggingService;
    this._transactionService = transactionService;
  }

  var _proto = PerformanceMonitoring.prototype;

  _proto.init = function init(flags) {
    var _this = this;

    if (flags === void 0) {
      flags = {};
    }

    this._configService.events.observe(_common_constants__WEBPACK_IMPORTED_MODULE_0__.TRANSACTION_END + _common_constants__WEBPACK_IMPORTED_MODULE_0__.AFTER_EVENT, function (tr) {
      var payload = _this.createTransactionPayload(tr);

      if (payload) {
        _this._apmServer.addTransaction(payload);

        _this._configService.dispatchEvent(_common_constants__WEBPACK_IMPORTED_MODULE_0__.QUEUE_ADD_TRANSACTION);
      }
    });

    if (flags[_common_constants__WEBPACK_IMPORTED_MODULE_0__.HISTORY]) {
      _common_patching__WEBPACK_IMPORTED_MODULE_1__.patchEventHandler.observe(_common_constants__WEBPACK_IMPORTED_MODULE_0__.HISTORY, this.getHistorySub());
    }

    if (flags[_common_constants__WEBPACK_IMPORTED_MODULE_0__.XMLHTTPREQUEST]) {
      _common_patching__WEBPACK_IMPORTED_MODULE_1__.patchEventHandler.observe(_common_constants__WEBPACK_IMPORTED_MODULE_0__.XMLHTTPREQUEST, this.getXHRSub());
    }

    if (flags[_common_constants__WEBPACK_IMPORTED_MODULE_0__.FETCH]) {
      _common_patching__WEBPACK_IMPORTED_MODULE_1__.patchEventHandler.observe(_common_constants__WEBPACK_IMPORTED_MODULE_0__.FETCH, this.getFetchSub());
    }
  };

  _proto.getHistorySub = function getHistorySub() {
    var transactionService = this._transactionService;
    return function (event, task) {
      if (task.source === _common_constants__WEBPACK_IMPORTED_MODULE_0__.HISTORY && event === _common_constants__WEBPACK_IMPORTED_MODULE_0__.INVOKE) {
        transactionService.startTransaction(task.data.title, 'route-change', {
          managed: true,
          canReuse: true
        });
      }
    };
  };

  _proto.getXHRSub = function getXHRSub() {
    var _this2 = this;

    return function (event, task) {
      if (task.source === _common_constants__WEBPACK_IMPORTED_MODULE_0__.XMLHTTPREQUEST && !_common_patching_patch_utils__WEBPACK_IMPORTED_MODULE_2__.globalState.fetchInProgress) {
        _this2.processAPICalls(event, task);
      }
    };
  };

  _proto.getFetchSub = function getFetchSub() {
    var _this3 = this;

    return function (event, task) {
      if (task.source === _common_constants__WEBPACK_IMPORTED_MODULE_0__.FETCH) {
        _this3.processAPICalls(event, task);
      }
    };
  };

  _proto.processAPICalls = function processAPICalls(event, task) {
    var configService = this._configService;
    var transactionService = this._transactionService;

    if (task.data && task.data.url) {
      var endpoints = this._apmServer.getEndpoints();

      var isOwnEndpoint = Object.keys(endpoints).some(function (endpoint) {
        return task.data.url.indexOf(endpoints[endpoint]) !== -1;
      });

      if (isOwnEndpoint) {
        return;
      }
    }

    if (event === _common_constants__WEBPACK_IMPORTED_MODULE_0__.SCHEDULE && task.data) {
      var data = task.data;
      var requestUrl = new _common_url__WEBPACK_IMPORTED_MODULE_3__.Url(data.url);
      var spanName = data.method + ' ' + (requestUrl.relative ? requestUrl.path : (0,_common_utils__WEBPACK_IMPORTED_MODULE_4__.stripQueryStringFromUrl)(requestUrl.href));

      if (!transactionService.getCurrentTransaction()) {
        transactionService.startTransaction(spanName, _common_constants__WEBPACK_IMPORTED_MODULE_0__.HTTP_REQUEST_TYPE, {
          managed: true
        });
      }

      var span = transactionService.startSpan(spanName, 'external.http', {
        blocking: true
      });

      if (!span) {
        return;
      }

      var isDtEnabled = configService.get('distributedTracing');
      var dtOrigins = configService.get('distributedTracingOrigins');
      var currentUrl = new _common_url__WEBPACK_IMPORTED_MODULE_3__.Url(window.location.href);
      var isSameOrigin = (0,_common_utils__WEBPACK_IMPORTED_MODULE_4__.checkSameOrigin)(requestUrl.origin, currentUrl.origin) || (0,_common_utils__WEBPACK_IMPORTED_MODULE_4__.checkSameOrigin)(requestUrl.origin, dtOrigins);
      var target = data.target;

      if (isDtEnabled && isSameOrigin && target) {
        this.injectDtHeader(span, target);
        var propagateTracestate = configService.get('propagateTracestate');

        if (propagateTracestate) {
          this.injectTSHeader(span, target);
        }
      } else if (_state__WEBPACK_IMPORTED_MODULE_5__.__DEV__) {
        this._logginService.debug("Could not inject distributed tracing header to the request origin ('" + requestUrl.origin + "') from the current origin ('" + currentUrl.origin + "')");
      }

      if (data.sync) {
        span.sync = data.sync;
      }

      data.span = span;
    } else if (event === _common_constants__WEBPACK_IMPORTED_MODULE_0__.INVOKE) {
      var _data = task.data;

      if (_data && _data.span) {
        var _span = _data.span,
            response = _data.response,
            _target = _data.target;
        var status;

        if (response) {
          status = response.status;
        } else {
          status = _target.status;
        }

        var outcome;

        if (_data.status != 'abort' && !_data.aborted) {
          if (status >= 400 || status == 0) {
            outcome = _common_constants__WEBPACK_IMPORTED_MODULE_0__.OUTCOME_FAILURE;
          } else {
            outcome = _common_constants__WEBPACK_IMPORTED_MODULE_0__.OUTCOME_SUCCESS;
          }
        } else {
          outcome = _common_constants__WEBPACK_IMPORTED_MODULE_0__.OUTCOME_UNKNOWN;
        }

        _span.outcome = outcome;
        var tr = transactionService.getCurrentTransaction();

        if (tr && tr.type === _common_constants__WEBPACK_IMPORTED_MODULE_0__.HTTP_REQUEST_TYPE) {
          tr.outcome = outcome;
        }

        transactionService.endSpan(_span, _data);
      }
    }
  };

  _proto.injectDtHeader = function injectDtHeader(span, target) {
    var headerName = this._configService.get('distributedTracingHeaderName');

    var headerValue = (0,_common_utils__WEBPACK_IMPORTED_MODULE_4__.getDtHeaderValue)(span);
    var isHeaderValid = (0,_common_utils__WEBPACK_IMPORTED_MODULE_4__.isDtHeaderValid)(headerValue);

    if (isHeaderValid && headerValue && headerName) {
      (0,_common_utils__WEBPACK_IMPORTED_MODULE_4__.setRequestHeader)(target, headerName, headerValue);
    }
  };

  _proto.injectTSHeader = function injectTSHeader(span, target) {
    var headerValue = (0,_common_utils__WEBPACK_IMPORTED_MODULE_4__.getTSHeaderValue)(span);

    if (headerValue) {
      (0,_common_utils__WEBPACK_IMPORTED_MODULE_4__.setRequestHeader)(target, 'tracestate', headerValue);
    }
  };

  _proto.extractDtHeader = function extractDtHeader(target) {
    var configService = this._configService;
    var headerName = configService.get('distributedTracingHeaderName');

    if (target) {
      return (0,_common_utils__WEBPACK_IMPORTED_MODULE_4__.parseDtHeaderValue)(target[headerName]);
    }
  };

  _proto.filterTransaction = function filterTransaction(tr) {
    var duration = tr.duration();

    if (!duration) {
      if (_state__WEBPACK_IMPORTED_MODULE_5__.__DEV__) {
        var message = "transaction(" + tr.id + ", " + tr.name + ") was discarded! ";

        if (duration === 0) {
          message += "Transaction duration is 0";
        } else {
          message += "Transaction wasn't ended";
        }

        this._logginService.debug(message);
      }

      return false;
    }

    if (tr.isManaged()) {
      if (duration > TRANSACTION_DURATION_THRESHOLD) {
        if (_state__WEBPACK_IMPORTED_MODULE_5__.__DEV__) {
          this._logginService.debug("transaction(" + tr.id + ", " + tr.name + ") was discarded! Transaction duration (" + duration + ") is greater than managed transaction threshold (" + TRANSACTION_DURATION_THRESHOLD + ")");
        }

        return false;
      }

      if (tr.sampled && tr.spans.length === 0) {
        if (_state__WEBPACK_IMPORTED_MODULE_5__.__DEV__) {
          this._logginService.debug("transaction(" + tr.id + ", " + tr.name + ") was discarded! Transaction does not have any spans");
        }

        return false;
      }
    }

    return true;
  };

  _proto.createTransactionDataModel = function createTransactionDataModel(transaction) {
    var transactionStart = transaction._start;
    var spans = transaction.spans.map(function (span) {
      var spanData = {
        id: span.id,
        transaction_id: transaction.id,
        parent_id: span.parentId || transaction.id,
        trace_id: transaction.traceId,
        name: span.name,
        type: span.type,
        subtype: span.subtype,
        action: span.action,
        sync: span.sync,
        start: parseInt(span._start - transactionStart),
        duration: span.duration(),
        context: span.context,
        outcome: span.outcome,
        sample_rate: span.sampleRate
      };
      return (0,_common_truncate__WEBPACK_IMPORTED_MODULE_6__.truncateModel)(_common_truncate__WEBPACK_IMPORTED_MODULE_6__.SPAN_MODEL, spanData);
    });
    var transactionData = {
      id: transaction.id,
      trace_id: transaction.traceId,
      session: transaction.session,
      name: transaction.name,
      type: transaction.type,
      duration: transaction.duration(),
      spans: spans,
      context: transaction.context,
      marks: transaction.marks,
      breakdown: transaction.breakdownTimings,
      span_count: {
        started: spans.length
      },
      sampled: transaction.sampled,
      sample_rate: transaction.sampleRate,
      experience: transaction.experience,
      outcome: transaction.outcome
    };
    return (0,_common_truncate__WEBPACK_IMPORTED_MODULE_6__.truncateModel)(_common_truncate__WEBPACK_IMPORTED_MODULE_6__.TRANSACTION_MODEL, transactionData);
  };

  _proto.createTransactionPayload = function createTransactionPayload(transaction) {
    var adjustedTransaction = adjustTransaction(transaction);
    var filtered = this.filterTransaction(adjustedTransaction);

    if (filtered) {
      return this.createTransactionDataModel(transaction);
    }

    this._configService.dispatchEvent(_common_constants__WEBPACK_IMPORTED_MODULE_0__.TRANSACTION_IGNORE);
  };

  return PerformanceMonitoring;
}();



/***/ }),

/***/ "../rum-core/dist/es/performance-monitoring/span-base.js":
/*!***************************************************************!*\
  !*** ../rum-core/dist/es/performance-monitoring/span-base.js ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _common_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/utils */ "../rum-core/dist/es/common/utils.js");
/* harmony import */ var _common_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/constants */ "../rum-core/dist/es/common/constants.js");



var SpanBase = function () {
  function SpanBase(name, type, options) {
    if (options === void 0) {
      options = {};
    }

    if (!name) {
      name = _common_constants__WEBPACK_IMPORTED_MODULE_0__.NAME_UNKNOWN;
    }

    if (!type) {
      type = _common_constants__WEBPACK_IMPORTED_MODULE_0__.TYPE_CUSTOM;
    }

    this.name = name;
    this.type = type;
    this.options = options;
    this.id = options.id || (0,_common_utils__WEBPACK_IMPORTED_MODULE_1__.generateRandomId)(16);
    this.traceId = options.traceId;
    this.sampled = options.sampled;
    this.sampleRate = options.sampleRate;
    this.timestamp = options.timestamp;
    this._start = (0,_common_utils__WEBPACK_IMPORTED_MODULE_1__.getTime)(options.startTime);
    this._end = undefined;
    this.ended = false;
    this.outcome = undefined;
    this.onEnd = options.onEnd;
  }

  var _proto = SpanBase.prototype;

  _proto.ensureContext = function ensureContext() {
    if (!this.context) {
      this.context = {};
    }
  };

  _proto.addLabels = function addLabels(tags) {
    this.ensureContext();
    var ctx = this.context;

    if (!ctx.tags) {
      ctx.tags = {};
    }

    var keys = Object.keys(tags);
    keys.forEach(function (k) {
      return (0,_common_utils__WEBPACK_IMPORTED_MODULE_1__.setLabel)(k, tags[k], ctx.tags);
    });
  };

  _proto.addContext = function addContext() {
    for (var _len = arguments.length, context = new Array(_len), _key = 0; _key < _len; _key++) {
      context[_key] = arguments[_key];
    }

    if (context.length === 0) return;
    this.ensureContext();
    _common_utils__WEBPACK_IMPORTED_MODULE_1__.merge.apply(void 0, [this.context].concat(context));
  };

  _proto.end = function end(endTime) {
    if (this.ended) {
      return;
    }

    this.ended = true;
    this._end = (0,_common_utils__WEBPACK_IMPORTED_MODULE_1__.getTime)(endTime);
    this.callOnEnd();
  };

  _proto.callOnEnd = function callOnEnd() {
    if (typeof this.onEnd === 'function') {
      this.onEnd(this);
    }
  };

  _proto.duration = function duration() {
    return (0,_common_utils__WEBPACK_IMPORTED_MODULE_1__.getDuration)(this._start, this._end);
  };

  return SpanBase;
}();

/* harmony default export */ __webpack_exports__["default"] = (SpanBase);

/***/ }),

/***/ "../rum-core/dist/es/performance-monitoring/span.js":
/*!**********************************************************!*\
  !*** ../rum-core/dist/es/performance-monitoring/span.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _span_base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./span-base */ "../rum-core/dist/es/performance-monitoring/span-base.js");
/* harmony import */ var _common_context__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/context */ "../rum-core/dist/es/common/context.js");
function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;

  _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}




var Span = function (_SpanBase) {
  _inheritsLoose(Span, _SpanBase);

  function Span(name, type, options) {
    var _this;

    _this = _SpanBase.call(this, name, type, options) || this;
    _this.parentId = _this.options.parentId;
    _this.subtype = undefined;
    _this.action = undefined;

    if (_this.type.indexOf('.') !== -1) {
      var fields = _this.type.split('.', 3);

      _this.type = fields[0];
      _this.subtype = fields[1];
      _this.action = fields[2];
    }

    _this.sync = _this.options.sync;
    return _this;
  }

  var _proto = Span.prototype;

  _proto.end = function end(endTime, data) {
    _SpanBase.prototype.end.call(this, endTime);

    (0,_common_context__WEBPACK_IMPORTED_MODULE_0__.addSpanContext)(this, data);
  };

  return Span;
}(_span_base__WEBPACK_IMPORTED_MODULE_1__["default"]);

/* harmony default export */ __webpack_exports__["default"] = (Span);

/***/ }),

/***/ "../rum-core/dist/es/performance-monitoring/transaction-service.js":
/*!*************************************************************************!*\
  !*** ../rum-core/dist/es/performance-monitoring/transaction-service.js ***!
  \*************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _common_polyfills__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../common/polyfills */ "../rum-core/dist/es/common/polyfills.js");
/* harmony import */ var _transaction__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./transaction */ "../rum-core/dist/es/performance-monitoring/transaction.js");
/* harmony import */ var _metrics_metrics__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./metrics/metrics */ "../rum-core/dist/es/performance-monitoring/metrics/metrics.js");
/* harmony import */ var _common_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../common/utils */ "../rum-core/dist/es/common/utils.js");
/* harmony import */ var _navigation_capture_navigation__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./navigation/capture-navigation */ "../rum-core/dist/es/performance-monitoring/navigation/capture-navigation.js");
/* harmony import */ var _common_constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/constants */ "../rum-core/dist/es/common/constants.js");
/* harmony import */ var _common_context__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../common/context */ "../rum-core/dist/es/common/context.js");
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../state */ "../rum-core/dist/es/state.js");
/* harmony import */ var _common_url__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../common/url */ "../rum-core/dist/es/common/url.js");










var TransactionService = function () {
  function TransactionService(logger, config) {
    var _this = this;

    this._config = config;
    this._logger = logger;
    this.currentTransaction = undefined;
    this.respIntervalId = undefined;
    this.recorder = new _metrics_metrics__WEBPACK_IMPORTED_MODULE_0__.PerfEntryRecorder(function (list) {
      var tr = _this.getCurrentTransaction();

      if (tr && tr.captureTimings) {
        var _tr$spans;

        var isHardNavigation = tr.type === _common_constants__WEBPACK_IMPORTED_MODULE_1__.PAGE_LOAD;

        var _captureObserverEntri = (0,_metrics_metrics__WEBPACK_IMPORTED_MODULE_0__.captureObserverEntries)(list, {
          isHardNavigation: isHardNavigation,
          trStart: isHardNavigation ? 0 : tr._start
        }),
            spans = _captureObserverEntri.spans,
            marks = _captureObserverEntri.marks;

        (_tr$spans = tr.spans).push.apply(_tr$spans, spans);

        tr.addMarks({
          agent: marks
        });
      }
    });
  }

  var _proto = TransactionService.prototype;

  _proto.createCurrentTransaction = function createCurrentTransaction(name, type, options) {
    var tr = new _transaction__WEBPACK_IMPORTED_MODULE_2__["default"](name, type, options);
    this.currentTransaction = tr;
    return tr;
  };

  _proto.getCurrentTransaction = function getCurrentTransaction() {
    if (this.currentTransaction && !this.currentTransaction.ended) {
      return this.currentTransaction;
    }
  };

  _proto.createOptions = function createOptions(options) {
    var config = this._config.config;
    var presetOptions = {
      transactionSampleRate: config.transactionSampleRate
    };
    var perfOptions = (0,_common_utils__WEBPACK_IMPORTED_MODULE_3__.extend)(presetOptions, options);

    if (perfOptions.managed) {
      perfOptions = (0,_common_utils__WEBPACK_IMPORTED_MODULE_3__.extend)({
        pageLoadTraceId: config.pageLoadTraceId,
        pageLoadSampled: config.pageLoadSampled,
        pageLoadSpanId: config.pageLoadSpanId,
        pageLoadTransactionName: config.pageLoadTransactionName
      }, perfOptions);
    }

    return perfOptions;
  };

  _proto.startManagedTransaction = function startManagedTransaction(name, type, perfOptions) {
    var tr = this.getCurrentTransaction();
    var isRedefined = false;

    if (!tr) {
      tr = this.createCurrentTransaction(name, type, perfOptions);
    } else if (tr.canReuse() && perfOptions.canReuse) {
      var redefineType = tr.type;
      var currentTypeOrder = _common_constants__WEBPACK_IMPORTED_MODULE_1__.TRANSACTION_TYPE_ORDER.indexOf(tr.type);
      var redefineTypeOrder = _common_constants__WEBPACK_IMPORTED_MODULE_1__.TRANSACTION_TYPE_ORDER.indexOf(type);

      if (currentTypeOrder >= 0 && redefineTypeOrder < currentTypeOrder) {
        redefineType = type;
      }

      if (_state__WEBPACK_IMPORTED_MODULE_4__.__DEV__) {
        this._logger.debug("redefining transaction(" + tr.id + ", " + tr.name + ", " + tr.type + ")", 'to', "(" + (name || tr.name) + ", " + redefineType + ")", tr);
      }

      tr.redefine(name, redefineType, perfOptions);
      isRedefined = true;
    } else {
      if (_state__WEBPACK_IMPORTED_MODULE_4__.__DEV__) {
        this._logger.debug("ending previous transaction(" + tr.id + ", " + tr.name + ")", tr);
      }

      tr.end();
      tr = this.createCurrentTransaction(name, type, perfOptions);
    }

    if (tr.type === _common_constants__WEBPACK_IMPORTED_MODULE_1__.PAGE_LOAD) {
      if (!isRedefined) {
        this.recorder.start(_common_constants__WEBPACK_IMPORTED_MODULE_1__.LARGEST_CONTENTFUL_PAINT);
        this.recorder.start(_common_constants__WEBPACK_IMPORTED_MODULE_1__.PAINT);
        this.recorder.start(_common_constants__WEBPACK_IMPORTED_MODULE_1__.FIRST_INPUT);
        this.recorder.start(_common_constants__WEBPACK_IMPORTED_MODULE_1__.LAYOUT_SHIFT);
      }

      if (perfOptions.pageLoadTraceId) {
        tr.traceId = perfOptions.pageLoadTraceId;
      }

      if (perfOptions.pageLoadSampled) {
        tr.sampled = perfOptions.pageLoadSampled;
      }

      if (tr.name === _common_constants__WEBPACK_IMPORTED_MODULE_1__.NAME_UNKNOWN && perfOptions.pageLoadTransactionName) {
        tr.name = perfOptions.pageLoadTransactionName;
      }
    }

    if (!isRedefined && this._config.get('monitorLongtasks')) {
      this.recorder.start(_common_constants__WEBPACK_IMPORTED_MODULE_1__.LONG_TASK);
    }

    if (tr.sampled) {
      tr.captureTimings = true;
    }

    return tr;
  };

  _proto.startTransaction = function startTransaction(name, type, options) {
    var _this2 = this;

    var perfOptions = this.createOptions(options);
    var tr;
    var fireOnstartHook = true;

    if (perfOptions.managed) {
      var current = this.currentTransaction;
      tr = this.startManagedTransaction(name, type, perfOptions);

      if (current === tr) {
        fireOnstartHook = false;
      }
    } else {
      tr = new _transaction__WEBPACK_IMPORTED_MODULE_2__["default"](name, type, perfOptions);
    }

    tr.onEnd = function () {
      return _this2.handleTransactionEnd(tr);
    };

    if (fireOnstartHook) {
      if (_state__WEBPACK_IMPORTED_MODULE_4__.__DEV__) {
        this._logger.debug("startTransaction(" + tr.id + ", " + tr.name + ", " + tr.type + ")");
      }

      this._config.events.send(_common_constants__WEBPACK_IMPORTED_MODULE_1__.TRANSACTION_START, [tr]);
    }

    return tr;
  };

  _proto.handleTransactionEnd = function handleTransactionEnd(tr) {
    var _this3 = this;

    this.recorder.stop();
    var currentUrl = window.location.href;
    return _common_polyfills__WEBPACK_IMPORTED_MODULE_5__.Promise.resolve().then(function () {
      var name = tr.name,
          type = tr.type;
      var lastHiddenStart = _state__WEBPACK_IMPORTED_MODULE_4__.state.lastHiddenStart;

      if (lastHiddenStart >= tr._start) {
        if (_state__WEBPACK_IMPORTED_MODULE_4__.__DEV__) {
          _this3._logger.debug("transaction(" + tr.id + ", " + name + ", " + type + ") was discarded! The page was hidden during the transaction!");
        }

        _this3._config.dispatchEvent(_common_constants__WEBPACK_IMPORTED_MODULE_1__.TRANSACTION_IGNORE);

        return;
      }

      if (_this3.shouldIgnoreTransaction(name) || type === _common_constants__WEBPACK_IMPORTED_MODULE_1__.TEMPORARY_TYPE) {
        if (_state__WEBPACK_IMPORTED_MODULE_4__.__DEV__) {
          _this3._logger.debug("transaction(" + tr.id + ", " + name + ", " + type + ") is ignored");
        }

        _this3._config.dispatchEvent(_common_constants__WEBPACK_IMPORTED_MODULE_1__.TRANSACTION_IGNORE);

        return;
      }

      if (type === _common_constants__WEBPACK_IMPORTED_MODULE_1__.PAGE_LOAD) {
        var pageLoadTransactionName = _this3._config.get('pageLoadTransactionName');

        if (name === _common_constants__WEBPACK_IMPORTED_MODULE_1__.NAME_UNKNOWN && pageLoadTransactionName) {
          tr.name = pageLoadTransactionName;
        }

        if (tr.captureTimings) {
          var cls = _metrics_metrics__WEBPACK_IMPORTED_MODULE_0__.metrics.cls,
              fid = _metrics_metrics__WEBPACK_IMPORTED_MODULE_0__.metrics.fid,
              tbt = _metrics_metrics__WEBPACK_IMPORTED_MODULE_0__.metrics.tbt,
              longtask = _metrics_metrics__WEBPACK_IMPORTED_MODULE_0__.metrics.longtask;

          if (tbt.duration > 0) {
            tr.spans.push((0,_metrics_metrics__WEBPACK_IMPORTED_MODULE_0__.createTotalBlockingTimeSpan)(tbt));
          }

          tr.experience = {};

          if ((0,_common_utils__WEBPACK_IMPORTED_MODULE_3__.isPerfTypeSupported)(_common_constants__WEBPACK_IMPORTED_MODULE_1__.LONG_TASK)) {
            tr.experience.tbt = tbt.duration;
          }

          if ((0,_common_utils__WEBPACK_IMPORTED_MODULE_3__.isPerfTypeSupported)(_common_constants__WEBPACK_IMPORTED_MODULE_1__.LAYOUT_SHIFT)) {
            tr.experience.cls = cls.score;
          }

          if (fid > 0) {
            tr.experience.fid = fid;
          }

          if (longtask.count > 0) {
            tr.experience.longtask = {
              count: longtask.count,
              sum: longtask.duration,
              max: longtask.max
            };
          }
        }

        _this3.setSession(tr);
      }

      if (tr.name === _common_constants__WEBPACK_IMPORTED_MODULE_1__.NAME_UNKNOWN) {
        tr.name = (0,_common_url__WEBPACK_IMPORTED_MODULE_6__.slugifyUrl)(currentUrl);
      }

      (0,_navigation_capture_navigation__WEBPACK_IMPORTED_MODULE_7__.captureNavigation)(tr);

      _this3.adjustTransactionTime(tr);

      var breakdownMetrics = _this3._config.get('breakdownMetrics');

      if (breakdownMetrics) {
        tr.captureBreakdown();
      }

      var configContext = _this3._config.get('context');

      (0,_common_context__WEBPACK_IMPORTED_MODULE_8__.addTransactionContext)(tr, configContext);

      _this3._config.events.send(_common_constants__WEBPACK_IMPORTED_MODULE_1__.TRANSACTION_END, [tr]);

      if (_state__WEBPACK_IMPORTED_MODULE_4__.__DEV__) {
        _this3._logger.debug("end transaction(" + tr.id + ", " + tr.name + ", " + tr.type + ")", tr);
      }
    }, function (err) {
      if (_state__WEBPACK_IMPORTED_MODULE_4__.__DEV__) {
        _this3._logger.debug("error ending transaction(" + tr.id + ", " + tr.name + ")", err);
      }
    });
  };

  _proto.setSession = function setSession(tr) {
    var session = this._config.get('session');

    if (session) {
      if (typeof session == 'boolean') {
        tr.session = {
          id: (0,_common_utils__WEBPACK_IMPORTED_MODULE_3__.generateRandomId)(16),
          sequence: 1
        };
      } else {
        if (session.timestamp && Date.now() - session.timestamp > _common_constants__WEBPACK_IMPORTED_MODULE_1__.SESSION_TIMEOUT) {
          tr.session = {
            id: (0,_common_utils__WEBPACK_IMPORTED_MODULE_3__.generateRandomId)(16),
            sequence: 1
          };
        } else {
          tr.session = {
            id: session.id,
            sequence: session.sequence ? session.sequence + 1 : 1
          };
        }
      }

      var sessionConfig = {
        session: {
          id: tr.session.id,
          sequence: tr.session.sequence,
          timestamp: Date.now()
        }
      };

      this._config.setConfig(sessionConfig);

      this._config.setLocalConfig(sessionConfig, true);
    }
  };

  _proto.adjustTransactionTime = function adjustTransactionTime(transaction) {
    var spans = transaction.spans;
    var earliestSpan = (0,_common_utils__WEBPACK_IMPORTED_MODULE_3__.getEarliestSpan)(spans);

    if (earliestSpan && earliestSpan._start < transaction._start) {
      transaction._start = earliestSpan._start;
    }

    var latestSpan = (0,_common_utils__WEBPACK_IMPORTED_MODULE_3__.getLatestNonXHRSpan)(spans) || {};
    var latestSpanEnd = latestSpan._end || 0;

    if (transaction.type === _common_constants__WEBPACK_IMPORTED_MODULE_1__.PAGE_LOAD) {
      var transactionEndWithoutDelay = transaction._end - _common_constants__WEBPACK_IMPORTED_MODULE_1__.PAGE_LOAD_DELAY;
      var lcp = _metrics_metrics__WEBPACK_IMPORTED_MODULE_0__.metrics.lcp || 0;
      var latestXHRSpan = (0,_common_utils__WEBPACK_IMPORTED_MODULE_3__.getLatestXHRSpan)(spans) || {};
      var latestXHRSpanEnd = latestXHRSpan._end || 0;
      transaction._end = Math.max(latestSpanEnd, latestXHRSpanEnd, lcp, transactionEndWithoutDelay);
    } else if (latestSpanEnd > transaction._end) {
      transaction._end = latestSpanEnd;
    }

    this.truncateSpans(spans, transaction._end);
  };

  _proto.truncateSpans = function truncateSpans(spans, transactionEnd) {
    for (var i = 0; i < spans.length; i++) {
      var span = spans[i];

      if (span._end > transactionEnd) {
        span._end = transactionEnd;
        span.type += _common_constants__WEBPACK_IMPORTED_MODULE_1__.TRUNCATED_TYPE;
      }

      if (span._start > transactionEnd) {
        span._start = transactionEnd;
      }
    }
  };

  _proto.shouldIgnoreTransaction = function shouldIgnoreTransaction(transactionName) {
    var ignoreList = this._config.get('ignoreTransactions');

    if (ignoreList && ignoreList.length) {
      for (var i = 0; i < ignoreList.length; i++) {
        var element = ignoreList[i];

        if (typeof element.test === 'function') {
          if (element.test(transactionName)) {
            return true;
          }
        } else if (element === transactionName) {
          return true;
        }
      }
    }

    return false;
  };

  _proto.startSpan = function startSpan(name, type, options) {
    var tr = this.getCurrentTransaction();

    if (!tr) {
      tr = this.createCurrentTransaction(undefined, _common_constants__WEBPACK_IMPORTED_MODULE_1__.TEMPORARY_TYPE, this.createOptions({
        canReuse: true,
        managed: true
      }));
    }

    var span = tr.startSpan(name, type, options);

    if (_state__WEBPACK_IMPORTED_MODULE_4__.__DEV__) {
      this._logger.debug("startSpan(" + name + ", " + span.type + ")", "on transaction(" + tr.id + ", " + tr.name + ")");
    }

    return span;
  };

  _proto.endSpan = function endSpan(span, context) {
    if (!span) {
      return;
    }

    if (_state__WEBPACK_IMPORTED_MODULE_4__.__DEV__) {
      var tr = this.getCurrentTransaction();
      tr && this._logger.debug("endSpan(" + span.name + ", " + span.type + ")", "on transaction(" + tr.id + ", " + tr.name + ")");
    }

    span.end(null, context);
  };

  return TransactionService;
}();

/* harmony default export */ __webpack_exports__["default"] = (TransactionService);

/***/ }),

/***/ "../rum-core/dist/es/performance-monitoring/transaction.js":
/*!*****************************************************************!*\
  !*** ../rum-core/dist/es/performance-monitoring/transaction.js ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _span__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./span */ "../rum-core/dist/es/performance-monitoring/span.js");
/* harmony import */ var _span_base__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./span-base */ "../rum-core/dist/es/performance-monitoring/span-base.js");
/* harmony import */ var _common_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/utils */ "../rum-core/dist/es/common/utils.js");
/* harmony import */ var _common_constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/constants */ "../rum-core/dist/es/common/constants.js");
/* harmony import */ var _breakdown__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./breakdown */ "../rum-core/dist/es/performance-monitoring/breakdown.js");
function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;

  _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}







var Transaction = function (_SpanBase) {
  _inheritsLoose(Transaction, _SpanBase);

  function Transaction(name, type, options) {
    var _this;

    _this = _SpanBase.call(this, name, type, options) || this;
    _this.traceId = (0,_common_utils__WEBPACK_IMPORTED_MODULE_0__.generateRandomId)();
    _this.marks = undefined;
    _this.spans = [];
    _this._activeSpans = {};
    _this._activeTasks = new Set();
    _this.blocked = false;
    _this.captureTimings = false;
    _this.breakdownTimings = [];
    _this.sampleRate = _this.options.transactionSampleRate;
    _this.sampled = Math.random() <= _this.sampleRate;
    return _this;
  }

  var _proto = Transaction.prototype;

  _proto.addMarks = function addMarks(obj) {
    this.marks = (0,_common_utils__WEBPACK_IMPORTED_MODULE_0__.merge)(this.marks || {}, obj);
  };

  _proto.mark = function mark(key) {
    var skey = (0,_common_utils__WEBPACK_IMPORTED_MODULE_0__.removeInvalidChars)(key);

    var markTime = (0,_common_utils__WEBPACK_IMPORTED_MODULE_0__.now)() - this._start;

    var custom = {};
    custom[skey] = markTime;
    this.addMarks({
      custom: custom
    });
  };

  _proto.canReuse = function canReuse() {
    var threshold = this.options.reuseThreshold || _common_constants__WEBPACK_IMPORTED_MODULE_1__.REUSABILITY_THRESHOLD;
    return !!this.options.canReuse && !this.ended && (0,_common_utils__WEBPACK_IMPORTED_MODULE_0__.now)() - this._start < threshold;
  };

  _proto.redefine = function redefine(name, type, options) {
    if (name) {
      this.name = name;
    }

    if (type) {
      this.type = type;
    }

    if (options) {
      this.options.reuseThreshold = options.reuseThreshold;
      (0,_common_utils__WEBPACK_IMPORTED_MODULE_0__.extend)(this.options, options);
    }
  };

  _proto.startSpan = function startSpan(name, type, options) {
    var _this2 = this;

    if (this.ended) {
      return;
    }

    var opts = (0,_common_utils__WEBPACK_IMPORTED_MODULE_0__.extend)({}, options);

    opts.onEnd = function (trc) {
      _this2._onSpanEnd(trc);
    };

    opts.traceId = this.traceId;
    opts.sampled = this.sampled;
    opts.sampleRate = this.sampleRate;

    if (!opts.parentId) {
      opts.parentId = this.id;
    }

    var span = new _span__WEBPACK_IMPORTED_MODULE_2__["default"](name, type, opts);
    this._activeSpans[span.id] = span;

    if (opts.blocking) {
      this.addTask(span.id);
    }

    return span;
  };

  _proto.isFinished = function isFinished() {
    return !this.blocked && this._activeTasks.size === 0;
  };

  _proto.detectFinish = function detectFinish() {
    if (this.isFinished()) this.end();
  };

  _proto.end = function end(endTime) {
    if (this.ended) {
      return;
    }

    this.ended = true;
    this._end = (0,_common_utils__WEBPACK_IMPORTED_MODULE_0__.getTime)(endTime);

    for (var sid in this._activeSpans) {
      var span = this._activeSpans[sid];
      span.type = span.type + _common_constants__WEBPACK_IMPORTED_MODULE_1__.TRUNCATED_TYPE;
      span.end(endTime);
    }

    this.callOnEnd();
  };

  _proto.captureBreakdown = function captureBreakdown() {
    this.breakdownTimings = (0,_breakdown__WEBPACK_IMPORTED_MODULE_3__.captureBreakdown)(this);
  };

  _proto.block = function block(flag) {
    this.blocked = flag;

    if (!this.blocked) {
      this.detectFinish();
    }
  };

  _proto.addTask = function addTask(taskId) {
    if (!taskId) {
      taskId = 'task-' + (0,_common_utils__WEBPACK_IMPORTED_MODULE_0__.generateRandomId)(16);
    }

    this._activeTasks.add(taskId);

    return taskId;
  };

  _proto.removeTask = function removeTask(taskId) {
    var deleted = this._activeTasks.delete(taskId);

    deleted && this.detectFinish();
  };

  _proto.resetFields = function resetFields() {
    this.spans = [];
    this.sampleRate = 0;
  };

  _proto._onSpanEnd = function _onSpanEnd(span) {
    this.spans.push(span);
    delete this._activeSpans[span.id];
    this.removeTask(span.id);
  };

  _proto.isManaged = function isManaged() {
    return !!this.options.managed;
  };

  return Transaction;
}(_span_base__WEBPACK_IMPORTED_MODULE_4__["default"]);

/* harmony default export */ __webpack_exports__["default"] = (Transaction);

/***/ }),

/***/ "../rum-core/dist/es/state.js":
/*!************************************!*\
  !*** ../rum-core/dist/es/state.js ***!
  \************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __DEV__: function() { return /* binding */ __DEV__; },
/* harmony export */   state: function() { return /* binding */ state; }
/* harmony export */ });
var __DEV__ = "development" !== 'production';

var state = {
  bootstrapTime: null,
  lastHiddenStart: Number.MIN_SAFE_INTEGER
};


/***/ }),

/***/ "./src/apm-base.js":
/*!*************************!*\
  !*** ./src/apm-base.js ***!
  \*************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ ApmBase; }
/* harmony export */ });
/* harmony import */ var _elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @elastic/apm-rum-core */ "../rum-core/dist/es/common/constants.js");
/* harmony import */ var _elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @elastic/apm-rum-core */ "../rum-core/dist/es/common/instrument.js");
/* harmony import */ var _elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @elastic/apm-rum-core */ "../rum-core/dist/es/common/observers/page-visibility.js");
/* harmony import */ var _elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @elastic/apm-rum-core */ "../rum-core/dist/es/common/observers/page-clicks.js");
/* harmony import */ var _elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @elastic/apm-rum-core */ "../rum-core/dist/es/performance-monitoring/metrics/inp/process.js");


var ApmBase = function () {
  function ApmBase(serviceFactory, disable) {
    this._disable = disable;
    this.serviceFactory = serviceFactory;
    this._initialized = false;
  }

  var _proto = ApmBase.prototype;

  _proto.isEnabled = function isEnabled() {
    return !this._disable;
  };

  _proto.isActive = function isActive() {
    var configService = this.serviceFactory.getService(_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.CONFIG_SERVICE);
    return this.isEnabled() && this._initialized && configService.get('active');
  };

  _proto.init = function init(config) {
    var _this = this;

    if (this.isEnabled() && !this._initialized) {
      this._initialized = true;

      var _this$serviceFactory$ = this.serviceFactory.getService([_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.CONFIG_SERVICE, _elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.LOGGING_SERVICE, _elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.TRANSACTION_SERVICE]),
          configService = _this$serviceFactory$[0],
          loggingService = _this$serviceFactory$[1],
          transactionService = _this$serviceFactory$[2];

      configService.setVersion('5.16.1');
      this.config(config);
      var logLevel = configService.get('logLevel');
      loggingService.setLevel(logLevel);
      var isConfigActive = configService.get('active');

      if (isConfigActive) {
        this.serviceFactory.init();
        var flags = (0,_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_1__.getInstrumentationFlags)(configService.get('instrument'), configService.get('disableInstrumentations'));
        var performanceMonitoring = this.serviceFactory.getService(_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.PERFORMANCE_MONITORING);
        performanceMonitoring.init(flags);

        if (flags[_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.ERROR]) {
          var errorLogging = this.serviceFactory.getService(_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.ERROR_LOGGING);
          errorLogging.registerListeners();
        }

        if (configService.get('session')) {
          var localConfig = configService.getLocalConfig();

          if (localConfig && localConfig.session) {
            configService.setConfig({
              session: localConfig.session
            });
          }
        }

        var sendPageLoad = function sendPageLoad() {
          return flags[_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.PAGE_LOAD] && _this._sendPageLoadMetrics();
        };

        if (configService.get('centralConfig')) {
          this.fetchCentralConfig().then(sendPageLoad);
        } else {
          sendPageLoad();
        }

        (0,_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_2__.observePageVisibility)(configService, transactionService);

        if (flags[_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.EVENT_TARGET] && flags[_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.CLICK]) {
          (0,_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_3__.observePageClicks)(transactionService);
        }

        (0,_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_4__.observeUserInteractions)();
      } else {
        this._disable = true;
        loggingService.warn('RUM agent is inactive');
      }
    }

    return this;
  };

  _proto.fetchCentralConfig = function fetchCentralConfig() {
    var _this$serviceFactory$2 = this.serviceFactory.getService([_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.APM_SERVER, _elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.LOGGING_SERVICE, _elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.CONFIG_SERVICE]),
        apmServer = _this$serviceFactory$2[0],
        loggingService = _this$serviceFactory$2[1],
        configService = _this$serviceFactory$2[2];

    return apmServer.fetchConfig(configService.get('serviceName'), configService.get('environment')).then(function (config) {
      var transactionSampleRate = config['transaction_sample_rate'];

      if (transactionSampleRate) {
        transactionSampleRate = Number(transactionSampleRate);
        var _config2 = {
          transactionSampleRate: transactionSampleRate
        };

        var _configService$valida = configService.validate(_config2),
            invalid = _configService$valida.invalid;

        if (invalid.length === 0) {
          configService.setConfig(_config2);
        } else {
          var _invalid$ = invalid[0],
              key = _invalid$.key,
              value = _invalid$.value,
              allowed = _invalid$.allowed;
          loggingService.warn("invalid value \"" + value + "\" for " + key + ". Allowed: " + allowed + ".");
        }
      }

      return config;
    }).catch(function (error) {
      loggingService.warn('failed fetching config:', error);
    });
  };

  _proto._sendPageLoadMetrics = function _sendPageLoadMetrics() {
    var tr = this.startTransaction(undefined, _elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.PAGE_LOAD, {
      managed: true,
      canReuse: true
    });

    if (!tr) {
      return;
    }

    tr.addTask(_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.PAGE_LOAD);

    var sendPageLoadMetrics = function sendPageLoadMetrics() {
      setTimeout(function () {
        return tr.removeTask(_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.PAGE_LOAD);
      }, _elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.PAGE_LOAD_DELAY);
    };

    if (document.readyState === 'complete') {
      sendPageLoadMetrics();
    } else {
      window.addEventListener('load', sendPageLoadMetrics);
    }
  };

  _proto.observe = function observe(name, fn) {
    var configService = this.serviceFactory.getService(_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.CONFIG_SERVICE);
    configService.events.observe(name, fn);
  };

  _proto.config = function config(_config) {
    var _this$serviceFactory$3 = this.serviceFactory.getService([_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.CONFIG_SERVICE, _elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.LOGGING_SERVICE]),
        configService = _this$serviceFactory$3[0],
        loggingService = _this$serviceFactory$3[1];

    var _configService$valida2 = configService.validate(_config),
        missing = _configService$valida2.missing,
        invalid = _configService$valida2.invalid,
        unknown = _configService$valida2.unknown;

    if (unknown.length > 0) {
      var message = 'Unknown config options are specified for RUM agent: ' + unknown.join(', ');
      loggingService.warn(message);
    }

    if (missing.length === 0 && invalid.length === 0) {
      configService.setConfig(_config);
    } else {
      var separator = ', ';
      var _message = "RUM agent isn't correctly configured. ";

      if (missing.length > 0) {
        _message += missing.join(separator) + ' is missing';

        if (invalid.length > 0) {
          _message += separator;
        }
      }

      invalid.forEach(function (_ref, index) {
        var key = _ref.key,
            value = _ref.value,
            allowed = _ref.allowed;
        _message += key + " \"" + value + "\" contains invalid characters! (allowed: " + allowed + ")" + (index !== invalid.length - 1 ? separator : '');
      });
      loggingService.error(_message);
      configService.setConfig({
        active: false
      });
    }
  };

  _proto.setUserContext = function setUserContext(userContext) {
    var configService = this.serviceFactory.getService(_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.CONFIG_SERVICE);
    configService.setUserContext(userContext);
  };

  _proto.setCustomContext = function setCustomContext(customContext) {
    var configService = this.serviceFactory.getService(_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.CONFIG_SERVICE);
    configService.setCustomContext(customContext);
  };

  _proto.addLabels = function addLabels(labels) {
    var configService = this.serviceFactory.getService(_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.CONFIG_SERVICE);
    configService.addLabels(labels);
  };

  _proto.setInitialPageLoadName = function setInitialPageLoadName(name) {
    var configService = this.serviceFactory.getService(_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.CONFIG_SERVICE);
    configService.setConfig({
      pageLoadTransactionName: name
    });
  };

  _proto.startTransaction = function startTransaction(name, type, options) {
    if (this.isEnabled()) {
      var transactionService = this.serviceFactory.getService(_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.TRANSACTION_SERVICE);
      return transactionService.startTransaction(name, type, options);
    }
  };

  _proto.startSpan = function startSpan(name, type, options) {
    if (this.isEnabled()) {
      var transactionService = this.serviceFactory.getService(_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.TRANSACTION_SERVICE);
      return transactionService.startSpan(name, type, options);
    }
  };

  _proto.getCurrentTransaction = function getCurrentTransaction() {
    if (this.isEnabled()) {
      var transactionService = this.serviceFactory.getService(_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.TRANSACTION_SERVICE);
      return transactionService.getCurrentTransaction();
    }
  };

  _proto.captureError = function captureError(error) {
    if (this.isEnabled()) {
      var errorLogging = this.serviceFactory.getService(_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.ERROR_LOGGING);
      return errorLogging.logError(error);
    }
  };

  _proto.addFilter = function addFilter(fn) {
    var configService = this.serviceFactory.getService(_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.CONFIG_SERVICE);
    configService.addFilter(fn);
  };

  return ApmBase;
}();



/***/ }),

/***/ "../../node_modules/error-stack-parser/error-stack-parser.js":
/*!*******************************************************************!*\
  !*** ../../node_modules/error-stack-parser/error-stack-parser.js ***!
  \*******************************************************************/
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function(root, factory) {
    'use strict';
    // Universal Module Definition (UMD) to support AMD, CommonJS/Node.js, Rhino, and browsers.

    /* istanbul ignore next */
    if (true) {
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! stackframe */ "../../node_modules/stackframe/stackframe.js")], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else {}
}(this, function ErrorStackParser(StackFrame) {
    'use strict';

    var FIREFOX_SAFARI_STACK_REGEXP = /(^|@)\S+\:\d+/;
    var CHROME_IE_STACK_REGEXP = /^\s*at .*(\S+\:\d+|\(native\))/m;
    var SAFARI_NATIVE_CODE_REGEXP = /^(eval@)?(\[native code\])?$/;

    function _map(array, fn, thisArg) {
        if (typeof Array.prototype.map === 'function') {
            return array.map(fn, thisArg);
        } else {
            var output = new Array(array.length);
            for (var i = 0; i < array.length; i++) {
                output[i] = fn.call(thisArg, array[i]);
            }
            return output;
        }
    }

    function _filter(array, fn, thisArg) {
        if (typeof Array.prototype.filter === 'function') {
            return array.filter(fn, thisArg);
        } else {
            var output = [];
            for (var i = 0; i < array.length; i++) {
                if (fn.call(thisArg, array[i])) {
                    output.push(array[i]);
                }
            }
            return output;
        }
    }

    function _indexOf(array, target) {
        if (typeof Array.prototype.indexOf === 'function') {
            return array.indexOf(target);
        } else {
            for (var i = 0; i < array.length; i++) {
                if (array[i] === target) {
                    return i;
                }
            }
            return -1;
        }
    }

    return {
        /**
         * Given an Error object, extract the most information from it.
         *
         * @param {Error} error object
         * @return {Array} of StackFrames
         */
        parse: function ErrorStackParser$$parse(error) {
            if (typeof error.stacktrace !== 'undefined' || typeof error['opera#sourceloc'] !== 'undefined') {
                return this.parseOpera(error);
            } else if (error.stack && error.stack.match(CHROME_IE_STACK_REGEXP)) {
                return this.parseV8OrIE(error);
            } else if (error.stack) {
                return this.parseFFOrSafari(error);
            } else {
                throw new Error('Cannot parse given Error object');
            }
        },

        // Separate line and column numbers from a string of the form: (URI:Line:Column)
        extractLocation: function ErrorStackParser$$extractLocation(urlLike) {
            // Fail-fast but return locations like "(native)"
            if (urlLike.indexOf(':') === -1) {
                return [urlLike];
            }

            var regExp = /(.+?)(?:\:(\d+))?(?:\:(\d+))?$/;
            var parts = regExp.exec(urlLike.replace(/[\(\)]/g, ''));
            return [parts[1], parts[2] || undefined, parts[3] || undefined];
        },

        parseV8OrIE: function ErrorStackParser$$parseV8OrIE(error) {
            var filtered = _filter(error.stack.split('\n'), function(line) {
                return !!line.match(CHROME_IE_STACK_REGEXP);
            }, this);

            return _map(filtered, function(line) {
                if (line.indexOf('(eval ') > -1) {
                    // Throw away eval information until we implement stacktrace.js/stackframe#8
                    line = line.replace(/eval code/g, 'eval').replace(/(\(eval at [^\()]*)|(\)\,.*$)/g, '');
                }
                var tokens = line.replace(/^\s+/, '').replace(/\(eval code/g, '(').split(/\s+/).slice(1);
                var locationParts = this.extractLocation(tokens.pop());
                var functionName = tokens.join(' ') || undefined;
                var fileName = _indexOf(['eval', '<anonymous>'], locationParts[0]) > -1 ? undefined : locationParts[0];

                return new StackFrame(functionName, undefined, fileName, locationParts[1], locationParts[2], line);
            }, this);
        },

        parseFFOrSafari: function ErrorStackParser$$parseFFOrSafari(error) {
            var filtered = _filter(error.stack.split('\n'), function(line) {
                return !line.match(SAFARI_NATIVE_CODE_REGEXP);
            }, this);

            return _map(filtered, function(line) {
                // Throw away eval information until we implement stacktrace.js/stackframe#8
                if (line.indexOf(' > eval') > -1) {
                    line = line.replace(/ line (\d+)(?: > eval line \d+)* > eval\:\d+\:\d+/g, ':$1');
                }

                if (line.indexOf('@') === -1 && line.indexOf(':') === -1) {
                    // Safari eval frames only have function names and nothing else
                    return new StackFrame(line);
                } else {
                    var tokens = line.split('@');
                    var locationParts = this.extractLocation(tokens.pop());
                    var functionName = tokens.join('@') || undefined;
                    return new StackFrame(functionName,
                        undefined,
                        locationParts[0],
                        locationParts[1],
                        locationParts[2],
                        line);
                }
            }, this);
        },

        parseOpera: function ErrorStackParser$$parseOpera(e) {
            if (!e.stacktrace || (e.message.indexOf('\n') > -1 &&
                e.message.split('\n').length > e.stacktrace.split('\n').length)) {
                return this.parseOpera9(e);
            } else if (!e.stack) {
                return this.parseOpera10(e);
            } else {
                return this.parseOpera11(e);
            }
        },

        parseOpera9: function ErrorStackParser$$parseOpera9(e) {
            var lineRE = /Line (\d+).*script (?:in )?(\S+)/i;
            var lines = e.message.split('\n');
            var result = [];

            for (var i = 2, len = lines.length; i < len; i += 2) {
                var match = lineRE.exec(lines[i]);
                if (match) {
                    result.push(new StackFrame(undefined, undefined, match[2], match[1], undefined, lines[i]));
                }
            }

            return result;
        },

        parseOpera10: function ErrorStackParser$$parseOpera10(e) {
            var lineRE = /Line (\d+).*script (?:in )?(\S+)(?:: In function (\S+))?$/i;
            var lines = e.stacktrace.split('\n');
            var result = [];

            for (var i = 0, len = lines.length; i < len; i += 2) {
                var match = lineRE.exec(lines[i]);
                if (match) {
                    result.push(
                        new StackFrame(
                            match[3] || undefined,
                            undefined,
                            match[2],
                            match[1],
                            undefined,
                            lines[i]
                        )
                    );
                }
            }

            return result;
        },

        // Opera 10.65+ Error.stack very similar to FF/Safari
        parseOpera11: function ErrorStackParser$$parseOpera11(error) {
            var filtered = _filter(error.stack.split('\n'), function(line) {
                return !!line.match(FIREFOX_SAFARI_STACK_REGEXP) && !line.match(/^Error created at/);
            }, this);

            return _map(filtered, function(line) {
                var tokens = line.split('@');
                var locationParts = this.extractLocation(tokens.pop());
                var functionCall = (tokens.shift() || '');
                var functionName = functionCall
                        .replace(/<anonymous function(: (\w+))?>/, '$2')
                        .replace(/\([^\)]*\)/g, '') || undefined;
                var argsRaw;
                if (functionCall.match(/\(([^\)]*)\)/)) {
                    argsRaw = functionCall.replace(/^[^\(]+\(([^\)]*)\)$/, '$1');
                }
                var args = (argsRaw === undefined || argsRaw === '[arguments not available]') ?
                    undefined : argsRaw.split(',');
                return new StackFrame(
                    functionName,
                    args,
                    locationParts[0],
                    locationParts[1],
                    locationParts[2],
                    line);
            }, this);
        }
    };
}));



/***/ }),

/***/ "../../node_modules/opentracing/lib/constants.js":
/*!*******************************************************!*\
  !*** ../../node_modules/opentracing/lib/constants.js ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * The FORMAT_BINARY format represents SpanContexts in an opaque binary
 * carrier.
 *
 * Tracer.inject() will set the buffer field to an Array-like (Array,
 * ArrayBuffer, or TypedBuffer) object containing the injected binary data.
 * Any valid Object can be used as long as the buffer field of the object
 * can be set.
 *
 * Tracer.extract() will look for `carrier.buffer`, and that field is
 * expected to be an Array-like object (Array, ArrayBuffer, or
 * TypedBuffer).
 */
exports.FORMAT_BINARY = 'binary';
/**
 * The FORMAT_TEXT_MAP format represents SpanContexts using a
 * string->string map (backed by a Javascript Object) as a carrier.
 *
 * NOTE: Unlike FORMAT_HTTP_HEADERS, FORMAT_TEXT_MAP places no restrictions
 * on the characters used in either the keys or the values of the map
 * entries.
 *
 * The FORMAT_TEXT_MAP carrier map may contain unrelated data (e.g.,
 * arbitrary gRPC metadata); as such, the Tracer implementation should use
 * a prefix or other convention to distinguish Tracer-specific key:value
 * pairs.
 */
exports.FORMAT_TEXT_MAP = 'text_map';
/**
 * The FORMAT_HTTP_HEADERS format represents SpanContexts using a
 * character-restricted string->string map (backed by a Javascript Object)
 * as a carrier.
 *
 * Keys and values in the FORMAT_HTTP_HEADERS carrier must be suitable for
 * use as HTTP headers (without modification or further escaping). That is,
 * the keys have a greatly restricted character set, casing for the keys
 * may not be preserved by various intermediaries, and the values should be
 * URL-escaped.
 *
 * The FORMAT_HTTP_HEADERS carrier map may contain unrelated data (e.g.,
 * arbitrary HTTP headers); as such, the Tracer implementation should use a
 * prefix or other convention to distinguish Tracer-specific key:value
 * pairs.
 */
exports.FORMAT_HTTP_HEADERS = 'http_headers';
/**
 * A Span may be the "child of" a parent Span. In a “child of” reference,
 * the parent Span depends on the child Span in some capacity.
 *
 * See more about reference types at https://github.com/opentracing/specification
 */
exports.REFERENCE_CHILD_OF = 'child_of';
/**
 * Some parent Spans do not depend in any way on the result of their child
 * Spans. In these cases, we say merely that the child Span “follows from”
 * the parent Span in a causal sense.
 *
 * See more about reference types at https://github.com/opentracing/specification
 */
exports.REFERENCE_FOLLOWS_FROM = 'follows_from';
//# sourceMappingURL=constants.js.map

/***/ }),

/***/ "../../node_modules/opentracing/lib/functions.js":
/*!*******************************************************!*\
  !*** ../../node_modules/opentracing/lib/functions.js ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var Constants = __webpack_require__(/*! ./constants */ "../../node_modules/opentracing/lib/constants.js");
var reference_1 = __webpack_require__(/*! ./reference */ "../../node_modules/opentracing/lib/reference.js");
var span_1 = __webpack_require__(/*! ./span */ "../../node_modules/opentracing/lib/span.js");
/**
 * Return a new REFERENCE_CHILD_OF reference.
 *
 * @param {SpanContext} spanContext - the parent SpanContext instance to
 *        reference.
 * @return a REFERENCE_CHILD_OF reference pointing to `spanContext`
 */
function childOf(spanContext) {
    // Allow the user to pass a Span instead of a SpanContext
    if (spanContext instanceof span_1.default) {
        spanContext = spanContext.context();
    }
    return new reference_1.default(Constants.REFERENCE_CHILD_OF, spanContext);
}
exports.childOf = childOf;
/**
 * Return a new REFERENCE_FOLLOWS_FROM reference.
 *
 * @param {SpanContext} spanContext - the parent SpanContext instance to
 *        reference.
 * @return a REFERENCE_FOLLOWS_FROM reference pointing to `spanContext`
 */
function followsFrom(spanContext) {
    // Allow the user to pass a Span instead of a SpanContext
    if (spanContext instanceof span_1.default) {
        spanContext = spanContext.context();
    }
    return new reference_1.default(Constants.REFERENCE_FOLLOWS_FROM, spanContext);
}
exports.followsFrom = followsFrom;
//# sourceMappingURL=functions.js.map

/***/ }),

/***/ "../../node_modules/opentracing/lib/noop.js":
/*!**************************************************!*\
  !*** ../../node_modules/opentracing/lib/noop.js ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var span_1 = __webpack_require__(/*! ./span */ "../../node_modules/opentracing/lib/span.js");
var span_context_1 = __webpack_require__(/*! ./span_context */ "../../node_modules/opentracing/lib/span_context.js");
var tracer_1 = __webpack_require__(/*! ./tracer */ "../../node_modules/opentracing/lib/tracer.js");
exports.tracer = null;
exports.spanContext = null;
exports.span = null;
// Deferred initialization to avoid a dependency cycle where Tracer depends on
// Span which depends on the noop tracer.
function initialize() {
    exports.tracer = new tracer_1.default();
    exports.span = new span_1.default();
    exports.spanContext = new span_context_1.default();
}
exports.initialize = initialize;
//# sourceMappingURL=noop.js.map

/***/ }),

/***/ "../../node_modules/opentracing/lib/reference.js":
/*!*******************************************************!*\
  !*** ../../node_modules/opentracing/lib/reference.js ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var span_1 = __webpack_require__(/*! ./span */ "../../node_modules/opentracing/lib/span.js");
/**
 * Reference pairs a reference type constant (e.g., REFERENCE_CHILD_OF or
 * REFERENCE_FOLLOWS_FROM) with the SpanContext it points to.
 *
 * See the exported childOf() and followsFrom() functions at the package level.
 */
var Reference = /** @class */ (function () {
    /**
     * Initialize a new Reference instance.
     *
     * @param {string} type - the Reference type constant (e.g.,
     *        REFERENCE_CHILD_OF or REFERENCE_FOLLOWS_FROM).
     * @param {SpanContext} referencedContext - the SpanContext being referred
     *        to. As a convenience, a Span instance may be passed in instead
     *        (in which case its .context() is used here).
     */
    function Reference(type, referencedContext) {
        this._type = type;
        this._referencedContext = (referencedContext instanceof span_1.default ?
            referencedContext.context() :
            referencedContext);
    }
    /**
     * @return {string} The Reference type (e.g., REFERENCE_CHILD_OF or
     *         REFERENCE_FOLLOWS_FROM).
     */
    Reference.prototype.type = function () {
        return this._type;
    };
    /**
     * @return {SpanContext} The SpanContext being referred to (e.g., the
     *         parent in a REFERENCE_CHILD_OF Reference).
     */
    Reference.prototype.referencedContext = function () {
        return this._referencedContext;
    };
    return Reference;
}());
exports["default"] = Reference;
//# sourceMappingURL=reference.js.map

/***/ }),

/***/ "../../node_modules/opentracing/lib/span.js":
/*!**************************************************!*\
  !*** ../../node_modules/opentracing/lib/span.js ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var noop = __webpack_require__(/*! ./noop */ "../../node_modules/opentracing/lib/noop.js");
/**
 * Span represents a logical unit of work as part of a broader Trace. Examples
 * of span might include remote procedure calls or a in-process function calls
 * to sub-components. A Trace has a single, top-level "root" Span that in turn
 * may have zero or more child Spans, which in turn may have children.
 */
var Span = /** @class */ (function () {
    function Span() {
    }
    // ---------------------------------------------------------------------- //
    // OpenTracing API methods
    // ---------------------------------------------------------------------- //
    /**
     * Returns the SpanContext object associated with this Span.
     *
     * @return {SpanContext}
     */
    Span.prototype.context = function () {
        return this._context();
    };
    /**
     * Returns the Tracer object used to create this Span.
     *
     * @return {Tracer}
     */
    Span.prototype.tracer = function () {
        return this._tracer();
    };
    /**
     * Sets the string name for the logical operation this span represents.
     *
     * @param {string} name
     */
    Span.prototype.setOperationName = function (name) {
        this._setOperationName(name);
        return this;
    };
    /**
     * Sets a key:value pair on this Span that also propagates to future
     * children of the associated Span.
     *
     * setBaggageItem() enables powerful functionality given a full-stack
     * opentracing integration (e.g., arbitrary application data from a web
     * client can make it, transparently, all the way into the depths of a
     * storage system), and with it some powerful costs: use this feature with
     * care.
     *
     * IMPORTANT NOTE #1: setBaggageItem() will only propagate baggage items to
     * *future* causal descendants of the associated Span.
     *
     * IMPORTANT NOTE #2: Use this thoughtfully and with care. Every key and
     * value is copied into every local *and remote* child of the associated
     * Span, and that can add up to a lot of network and cpu overhead.
     *
     * @param {string} key
     * @param {string} value
     */
    Span.prototype.setBaggageItem = function (key, value) {
        this._setBaggageItem(key, value);
        return this;
    };
    /**
     * Returns the value for a baggage item given its key.
     *
     * @param  {string} key
     *         The key for the given trace attribute.
     * @return {string}
     *         String value for the given key, or undefined if the key does not
     *         correspond to a set trace attribute.
     */
    Span.prototype.getBaggageItem = function (key) {
        return this._getBaggageItem(key);
    };
    /**
     * Adds a single tag to the span.  See `addTags()` for details.
     *
     * @param {string} key
     * @param {any} value
     */
    Span.prototype.setTag = function (key, value) {
        // NOTE: the call is normalized to a call to _addTags()
        this._addTags((_a = {}, _a[key] = value, _a));
        return this;
        var _a;
    };
    /**
     * Adds the given key value pairs to the set of span tags.
     *
     * Multiple calls to addTags() results in the tags being the superset of
     * all calls.
     *
     * The behavior of setting the same key multiple times on the same span
     * is undefined.
     *
     * The supported type of the values is implementation-dependent.
     * Implementations are expected to safely handle all types of values but
     * may choose to ignore unrecognized / unhandle-able values (e.g. objects
     * with cyclic references, function objects).
     *
     * @return {[type]} [description]
     */
    Span.prototype.addTags = function (keyValueMap) {
        this._addTags(keyValueMap);
        return this;
    };
    /**
     * Add a log record to this Span, optionally at a user-provided timestamp.
     *
     * For example:
     *
     *     span.log({
     *         size: rpc.size(),  // numeric value
     *         URI: rpc.URI(),  // string value
     *         payload: rpc.payload(),  // Object value
     *         "keys can be arbitrary strings": rpc.foo(),
     *     });
     *
     *     span.log({
     *         "error.description": someError.description(),
     *     }, someError.timestampMillis());
     *
     * @param {object} keyValuePairs
     *        An object mapping string keys to arbitrary value types. All
     *        Tracer implementations should support bool, string, and numeric
     *        value types, and some may also support Object values.
     * @param {number} timestamp
     *        An optional parameter specifying the timestamp in milliseconds
     *        since the Unix epoch. Fractional values are allowed so that
     *        timestamps with sub-millisecond accuracy can be represented. If
     *        not specified, the implementation is expected to use its notion
     *        of the current time of the call.
     */
    Span.prototype.log = function (keyValuePairs, timestamp) {
        this._log(keyValuePairs, timestamp);
        return this;
    };
    /**
     * DEPRECATED
     */
    Span.prototype.logEvent = function (eventName, payload) {
        return this._log({ event: eventName, payload: payload });
    };
    /**
     * Sets the end timestamp and finalizes Span state.
     *
     * With the exception of calls to Span.context() (which are always allowed),
     * finish() must be the last call made to any span instance, and to do
     * otherwise leads to undefined behavior.
     *
     * @param  {number} finishTime
     *         Optional finish time in milliseconds as a Unix timestamp. Decimal
     *         values are supported for timestamps with sub-millisecond accuracy.
     *         If not specified, the current time (as defined by the
     *         implementation) will be used.
     */
    Span.prototype.finish = function (finishTime) {
        this._finish(finishTime);
        // Do not return `this`. The Span generally should not be used after it
        // is finished so chaining is not desired in this context.
    };
    // ---------------------------------------------------------------------- //
    // Derived classes can choose to implement the below
    // ---------------------------------------------------------------------- //
    // By default returns a no-op SpanContext.
    Span.prototype._context = function () {
        return noop.spanContext;
    };
    // By default returns a no-op tracer.
    //
    // The base class could store the tracer that created it, but it does not
    // in order to ensure the no-op span implementation has zero members,
    // which allows V8 to aggressively optimize calls to such objects.
    Span.prototype._tracer = function () {
        return noop.tracer;
    };
    // By default does nothing
    Span.prototype._setOperationName = function (name) {
    };
    // By default does nothing
    Span.prototype._setBaggageItem = function (key, value) {
    };
    // By default does nothing
    Span.prototype._getBaggageItem = function (key) {
        return undefined;
    };
    // By default does nothing
    //
    // NOTE: both setTag() and addTags() map to this function. keyValuePairs
    // will always be an associative array.
    Span.prototype._addTags = function (keyValuePairs) {
    };
    // By default does nothing
    Span.prototype._log = function (keyValuePairs, timestamp) {
    };
    // By default does nothing
    //
    // finishTime is expected to be either a number or undefined.
    Span.prototype._finish = function (finishTime) {
    };
    return Span;
}());
exports.Span = Span;
exports["default"] = Span;
//# sourceMappingURL=span.js.map

/***/ }),

/***/ "../../node_modules/opentracing/lib/span_context.js":
/*!**********************************************************!*\
  !*** ../../node_modules/opentracing/lib/span_context.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * SpanContext represents Span state that must propagate to descendant Spans
 * and across process boundaries.
 *
 * SpanContext is logically divided into two pieces: the user-level "Baggage"
 * (see setBaggageItem and getBaggageItem) that propagates across Span
 * boundaries and any Tracer-implementation-specific fields that are needed to
 * identify or otherwise contextualize the associated Span instance (e.g., a
 * <trace_id, span_id, sampled> tuple).
 */
var SpanContext = /** @class */ (function () {
    function SpanContext() {
    }
    return SpanContext;
}());
exports.SpanContext = SpanContext;
exports["default"] = SpanContext;
//# sourceMappingURL=span_context.js.map

/***/ }),

/***/ "../../node_modules/opentracing/lib/tracer.js":
/*!****************************************************!*\
  !*** ../../node_modules/opentracing/lib/tracer.js ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var Functions = __webpack_require__(/*! ./functions */ "../../node_modules/opentracing/lib/functions.js");
var Noop = __webpack_require__(/*! ./noop */ "../../node_modules/opentracing/lib/noop.js");
var span_1 = __webpack_require__(/*! ./span */ "../../node_modules/opentracing/lib/span.js");
/**
 * Tracer is the entry-point between the instrumentation API and the tracing
 * implementation.
 *
 * The default object acts as a no-op implementation.
 *
 * Note to implementators: derived classes can choose to directly implement the
 * methods in the "OpenTracing API methods" section, or optionally the subset of
 * underscore-prefixed methods to pick up the argument checking and handling
 * automatically from the base class.
 */
var Tracer = /** @class */ (function () {
    function Tracer() {
    }
    // ---------------------------------------------------------------------- //
    // OpenTracing API methods
    // ---------------------------------------------------------------------- //
    /**
     * Starts and returns a new Span representing a logical unit of work.
     *
     * For example:
     *
     *     // Start a new (parentless) root Span:
     *     var parent = Tracer.startSpan('DoWork');
     *
     *     // Start a new (child) Span:
     *     var child = Tracer.startSpan('load-from-db', {
     *         childOf: parent.context(),
     *     });
     *
     *     // Start a new async (FollowsFrom) Span:
     *     var child = Tracer.startSpan('async-cache-write', {
     *         references: [
     *             opentracing.followsFrom(parent.context())
     *         ],
     *     });
     *
     * @param {string} name - the name of the operation (REQUIRED).
     * @param {SpanOptions} [options] - options for the newly created span.
     * @return {Span} - a new Span object.
     */
    Tracer.prototype.startSpan = function (name, options) {
        if (options === void 0) { options = {}; }
        // Convert options.childOf to fields.references as needed.
        if (options.childOf) {
            // Convert from a Span or a SpanContext into a Reference.
            var childOf = Functions.childOf(options.childOf);
            if (options.references) {
                options.references.push(childOf);
            }
            else {
                options.references = [childOf];
            }
            delete (options.childOf);
        }
        return this._startSpan(name, options);
    };
    /**
     * Injects the given SpanContext instance for cross-process propagation
     * within `carrier`. The expected type of `carrier` depends on the value of
     * `format.
     *
     * OpenTracing defines a common set of `format` values (see
     * FORMAT_TEXT_MAP, FORMAT_HTTP_HEADERS, and FORMAT_BINARY), and each has
     * an expected carrier type.
     *
     * Consider this pseudocode example:
     *
     *     var clientSpan = ...;
     *     ...
     *     // Inject clientSpan into a text carrier.
     *     var headersCarrier = {};
     *     Tracer.inject(clientSpan.context(), Tracer.FORMAT_HTTP_HEADERS, headersCarrier);
     *     // Incorporate the textCarrier into the outbound HTTP request header
     *     // map.
     *     Object.assign(outboundHTTPReq.headers, headersCarrier);
     *     // ... send the httpReq
     *
     * @param  {SpanContext} spanContext - the SpanContext to inject into the
     *         carrier object. As a convenience, a Span instance may be passed
     *         in instead (in which case its .context() is used for the
     *         inject()).
     * @param  {string} format - the format of the carrier.
     * @param  {any} carrier - see the documentation for the chosen `format`
     *         for a description of the carrier object.
     */
    Tracer.prototype.inject = function (spanContext, format, carrier) {
        // Allow the user to pass a Span instead of a SpanContext
        if (spanContext instanceof span_1.default) {
            spanContext = spanContext.context();
        }
        return this._inject(spanContext, format, carrier);
    };
    /**
     * Returns a SpanContext instance extracted from `carrier` in the given
     * `format`.
     *
     * OpenTracing defines a common set of `format` values (see
     * FORMAT_TEXT_MAP, FORMAT_HTTP_HEADERS, and FORMAT_BINARY), and each has
     * an expected carrier type.
     *
     * Consider this pseudocode example:
     *
     *     // Use the inbound HTTP request's headers as a text map carrier.
     *     var headersCarrier = inboundHTTPReq.headers;
     *     var wireCtx = Tracer.extract(Tracer.FORMAT_HTTP_HEADERS, headersCarrier);
     *     var serverSpan = Tracer.startSpan('...', { childOf : wireCtx });
     *
     * @param  {string} format - the format of the carrier.
     * @param  {any} carrier - the type of the carrier object is determined by
     *         the format.
     * @return {SpanContext}
     *         The extracted SpanContext, or null if no such SpanContext could
     *         be found in `carrier`
     */
    Tracer.prototype.extract = function (format, carrier) {
        return this._extract(format, carrier);
    };
    // ---------------------------------------------------------------------- //
    // Derived classes can choose to implement the below
    // ---------------------------------------------------------------------- //
    // NOTE: the input to this method is *always* an associative array. The
    // public-facing startSpan() method normalizes the arguments so that
    // all N implementations do not need to worry about variations in the call
    // signature.
    //
    // The default behavior returns a no-op span.
    Tracer.prototype._startSpan = function (name, fields) {
        return Noop.span;
    };
    // The default behavior is a no-op.
    Tracer.prototype._inject = function (spanContext, format, carrier) {
    };
    // The default behavior is to return a no-op SpanContext.
    Tracer.prototype._extract = function (format, carrier) {
        return Noop.spanContext;
    };
    return Tracer;
}());
exports.Tracer = Tracer;
exports["default"] = Tracer;
//# sourceMappingURL=tracer.js.map

/***/ }),

/***/ "../../node_modules/promise-polyfill/src/finally.js":
/*!**********************************************************!*\
  !*** ../../node_modules/promise-polyfill/src/finally.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/**
 * @this {Promise}
 */
function finallyConstructor(callback) {
  var constructor = this.constructor;
  return this.then(
    function(value) {
      // @ts-ignore
      return constructor.resolve(callback()).then(function() {
        return value;
      });
    },
    function(reason) {
      // @ts-ignore
      return constructor.resolve(callback()).then(function() {
        // @ts-ignore
        return constructor.reject(reason);
      });
    }
  );
}

/* harmony default export */ __webpack_exports__["default"] = (finallyConstructor);


/***/ }),

/***/ "../../node_modules/promise-polyfill/src/index.js":
/*!********************************************************!*\
  !*** ../../node_modules/promise-polyfill/src/index.js ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _finally__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./finally */ "../../node_modules/promise-polyfill/src/finally.js");


// Store setTimeout reference so promise-polyfill will be unaffected by
// other code modifying setTimeout (like sinon.useFakeTimers())
var setTimeoutFunc = setTimeout;

function isArray(x) {
  return Boolean(x && typeof x.length !== 'undefined');
}

function noop() {}

// Polyfill for Function.prototype.bind
function bind(fn, thisArg) {
  return function() {
    fn.apply(thisArg, arguments);
  };
}

/**
 * @constructor
 * @param {Function} fn
 */
function Promise(fn) {
  if (!(this instanceof Promise))
    throw new TypeError('Promises must be constructed via new');
  if (typeof fn !== 'function') throw new TypeError('not a function');
  /** @type {!number} */
  this._state = 0;
  /** @type {!boolean} */
  this._handled = false;
  /** @type {Promise|undefined} */
  this._value = undefined;
  /** @type {!Array<!Function>} */
  this._deferreds = [];

  doResolve(fn, this);
}

function handle(self, deferred) {
  while (self._state === 3) {
    self = self._value;
  }
  if (self._state === 0) {
    self._deferreds.push(deferred);
    return;
  }
  self._handled = true;
  Promise._immediateFn(function() {
    var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
    if (cb === null) {
      (self._state === 1 ? resolve : reject)(deferred.promise, self._value);
      return;
    }
    var ret;
    try {
      ret = cb(self._value);
    } catch (e) {
      reject(deferred.promise, e);
      return;
    }
    resolve(deferred.promise, ret);
  });
}

function resolve(self, newValue) {
  try {
    // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
    if (newValue === self)
      throw new TypeError('A promise cannot be resolved with itself.');
    if (
      newValue &&
      (typeof newValue === 'object' || typeof newValue === 'function')
    ) {
      var then = newValue.then;
      if (newValue instanceof Promise) {
        self._state = 3;
        self._value = newValue;
        finale(self);
        return;
      } else if (typeof then === 'function') {
        doResolve(bind(then, newValue), self);
        return;
      }
    }
    self._state = 1;
    self._value = newValue;
    finale(self);
  } catch (e) {
    reject(self, e);
  }
}

function reject(self, newValue) {
  self._state = 2;
  self._value = newValue;
  finale(self);
}

function finale(self) {
  if (self._state === 2 && self._deferreds.length === 0) {
    Promise._immediateFn(function() {
      if (!self._handled) {
        Promise._unhandledRejectionFn(self._value);
      }
    });
  }

  for (var i = 0, len = self._deferreds.length; i < len; i++) {
    handle(self, self._deferreds[i]);
  }
  self._deferreds = null;
}

/**
 * @constructor
 */
function Handler(onFulfilled, onRejected, promise) {
  this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
  this.onRejected = typeof onRejected === 'function' ? onRejected : null;
  this.promise = promise;
}

/**
 * Take a potentially misbehaving resolver function and make sure
 * onFulfilled and onRejected are only called once.
 *
 * Makes no guarantees about asynchrony.
 */
function doResolve(fn, self) {
  var done = false;
  try {
    fn(
      function(value) {
        if (done) return;
        done = true;
        resolve(self, value);
      },
      function(reason) {
        if (done) return;
        done = true;
        reject(self, reason);
      }
    );
  } catch (ex) {
    if (done) return;
    done = true;
    reject(self, ex);
  }
}

Promise.prototype['catch'] = function(onRejected) {
  return this.then(null, onRejected);
};

Promise.prototype.then = function(onFulfilled, onRejected) {
  // @ts-ignore
  var prom = new this.constructor(noop);

  handle(this, new Handler(onFulfilled, onRejected, prom));
  return prom;
};

Promise.prototype['finally'] = _finally__WEBPACK_IMPORTED_MODULE_0__["default"];

Promise.all = function(arr) {
  return new Promise(function(resolve, reject) {
    if (!isArray(arr)) {
      return reject(new TypeError('Promise.all accepts an array'));
    }

    var args = Array.prototype.slice.call(arr);
    if (args.length === 0) return resolve([]);
    var remaining = args.length;

    function res(i, val) {
      try {
        if (val && (typeof val === 'object' || typeof val === 'function')) {
          var then = val.then;
          if (typeof then === 'function') {
            then.call(
              val,
              function(val) {
                res(i, val);
              },
              reject
            );
            return;
          }
        }
        args[i] = val;
        if (--remaining === 0) {
          resolve(args);
        }
      } catch (ex) {
        reject(ex);
      }
    }

    for (var i = 0; i < args.length; i++) {
      res(i, args[i]);
    }
  });
};

Promise.resolve = function(value) {
  if (value && typeof value === 'object' && value.constructor === Promise) {
    return value;
  }

  return new Promise(function(resolve) {
    resolve(value);
  });
};

Promise.reject = function(value) {
  return new Promise(function(resolve, reject) {
    reject(value);
  });
};

Promise.race = function(arr) {
  return new Promise(function(resolve, reject) {
    if (!isArray(arr)) {
      return reject(new TypeError('Promise.race accepts an array'));
    }

    for (var i = 0, len = arr.length; i < len; i++) {
      Promise.resolve(arr[i]).then(resolve, reject);
    }
  });
};

// Use polyfill for setImmediate for performance gains
Promise._immediateFn =
  // @ts-ignore
  (typeof setImmediate === 'function' &&
    function(fn) {
      // @ts-ignore
      setImmediate(fn);
    }) ||
  function(fn) {
    setTimeoutFunc(fn, 0);
  };

Promise._unhandledRejectionFn = function _unhandledRejectionFn(err) {
  if (typeof console !== 'undefined' && console) {
    console.warn('Possible Unhandled Promise Rejection:', err); // eslint-disable-line no-console
  }
};

/* harmony default export */ __webpack_exports__["default"] = (Promise);


/***/ }),

/***/ "../../node_modules/stackframe/stackframe.js":
/*!***************************************************!*\
  !*** ../../node_modules/stackframe/stackframe.js ***!
  \***************************************************/
/***/ (function(module, exports) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (root, factory) {
    'use strict';
    // Universal Module Definition (UMD) to support AMD, CommonJS/Node.js, Rhino, and browsers.

    /* istanbul ignore next */
    if (true) {
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else {}
}(this, function () {
    'use strict';
    function _isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    function StackFrame(functionName, args, fileName, lineNumber, columnNumber, source) {
        if (functionName !== undefined) {
            this.setFunctionName(functionName);
        }
        if (args !== undefined) {
            this.setArgs(args);
        }
        if (fileName !== undefined) {
            this.setFileName(fileName);
        }
        if (lineNumber !== undefined) {
            this.setLineNumber(lineNumber);
        }
        if (columnNumber !== undefined) {
            this.setColumnNumber(columnNumber);
        }
        if (source !== undefined) {
            this.setSource(source);
        }
    }

    StackFrame.prototype = {
        getFunctionName: function () {
            return this.functionName;
        },
        setFunctionName: function (v) {
            this.functionName = String(v);
        },

        getArgs: function () {
            return this.args;
        },
        setArgs: function (v) {
            if (Object.prototype.toString.call(v) !== '[object Array]') {
                throw new TypeError('Args must be an Array');
            }
            this.args = v;
        },

        // NOTE: Property name may be misleading as it includes the path,
        // but it somewhat mirrors V8's JavaScriptStackTraceApi
        // https://code.google.com/p/v8/wiki/JavaScriptStackTraceApi and Gecko's
        // http://mxr.mozilla.org/mozilla-central/source/xpcom/base/nsIException.idl#14
        getFileName: function () {
            return this.fileName;
        },
        setFileName: function (v) {
            this.fileName = String(v);
        },

        getLineNumber: function () {
            return this.lineNumber;
        },
        setLineNumber: function (v) {
            if (!_isNumber(v)) {
                throw new TypeError('Line Number must be a Number');
            }
            this.lineNumber = Number(v);
        },

        getColumnNumber: function () {
            return this.columnNumber;
        },
        setColumnNumber: function (v) {
            if (!_isNumber(v)) {
                throw new TypeError('Column Number must be a Number');
            }
            this.columnNumber = Number(v);
        },

        getSource: function () {
            return this.source;
        },
        setSource: function (v) {
            this.source = String(v);
        },

        toString: function() {
            var functionName = this.getFunctionName() || '{anonymous}';
            var args = '(' + (this.getArgs() || []).join(',') + ')';
            var fileName = this.getFileName() ? ('@' + this.getFileName()) : '';
            var lineNumber = _isNumber(this.getLineNumber()) ? (':' + this.getLineNumber()) : '';
            var columnNumber = _isNumber(this.getColumnNumber()) ? (':' + this.getColumnNumber()) : '';
            return functionName + args + fileName + lineNumber + columnNumber;
        }
    };

    return StackFrame;
}));


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
!function() {
"use strict";
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ApmBase: function() { return /* reexport safe */ _apm_base__WEBPACK_IMPORTED_MODULE_0__["default"]; },
/* harmony export */   apm: function() { return /* binding */ apmBase; },
/* harmony export */   apmBase: function() { return /* binding */ apmBase; },
/* harmony export */   init: function() { return /* binding */ init; }
/* harmony export */ });
/* harmony import */ var _elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @elastic/apm-rum-core */ "../rum-core/dist/es/common/utils.js");
/* harmony import */ var _elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @elastic/apm-rum-core */ "../rum-core/dist/es/bootstrap.js");
/* harmony import */ var _elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @elastic/apm-rum-core */ "../rum-core/dist/es/index.js");
/* harmony import */ var _apm_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./apm-base */ "./src/apm-base.js");



function getApmBase() {
  if (_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_1__.isBrowser && window.elasticApm) {
    return window.elasticApm;
  }

  var enabled = (0,_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_2__.bootstrap)();
  var serviceFactory = (0,_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_3__.createServiceFactory)();
  var apmBase = new _apm_base__WEBPACK_IMPORTED_MODULE_0__["default"](serviceFactory, !enabled);

  if (_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_1__.isBrowser) {
    window.elasticApm = apmBase;
  }

  return apmBase;
}

var apmBase = getApmBase();
var init = apmBase.init.bind(apmBase);
/* harmony default export */ __webpack_exports__["default"] = (init);

}();
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWxhc3RpYy1hcG0tcnVtLnVtZC5qcyIsIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7OztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBRkE7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7O0FBS0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBREE7O0FBSUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQUtBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUFBO0FBQUE7O0FBSUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBT0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFMQTtBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTEE7QUFPQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTEE7QUFPQTs7QUFFQTtBQUNBOztBQUVBO0FBQUE7O0FBR0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBRkE7QUFJQTtBQUFBOztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFEQTtBQUdBO0FBVkE7QUFZQTtBQWJBO0FBZUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUFBOztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUdBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFBQTs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFJQTs7QUFFQTtBQUNBOztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDcFdBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTEE7QUFPQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQUtBOztBQUVBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUlBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBT0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUlBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQUtBO0FBQ0E7QUFQQTtBQVNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQUtBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFJQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBS0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQUE7QUFFQTtBQUFBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFEQTtBQUdBO0FBVkE7QUFZQTtBQWJBO0FBZUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBUkE7O0FBV0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUdBO0FBQ0E7QUFDQTtBQWZBOztBQWtCQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFNQTs7QUFFQTtBQUNBO0FBQUE7QUFBQTtBQUdBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBS0E7QUFSQTtBQVVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFJQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFFQTtBQUNBO0FBQ0E7QUFEQTtBQUdBO0FBQ0E7QUFDQTtBQURBO0FBR0E7QUFDQTtBQURBO0FBSkE7QUFKQTtBQWFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUFBO0FBQUE7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFLQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7OztBQzFVQTtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTs7QUFBQTtBQUFBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUE5QkE7QUFnQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQUE7QUFBQTtBQUFBOztBQUtBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQUE7QUFBQTs7QUFJQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFLQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFLQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFLQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDN1FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN6REE7O0FBRUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBS0E7O0FBRUE7QUFDQTtBQUNBO0FBREE7QUFHQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFBQTtBQUFBO0FBR0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFLQTtBQUNBO0FBUEE7QUFTQTs7QUFFQTtBQUNBO0FBQUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBTEE7QUFPQTs7QUFFQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFJQTtBQUxBO0FBT0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUFHQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFEQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBWEE7O0FBY0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBOztBQUlBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQURBO0FBR0E7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDM0tBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNuREE7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7O0FBQUE7QUFBQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQU9BOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTEE7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUhBOztBQU1BO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7OztBQzNFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFBQTs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBS0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFBQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFLQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUxBO0FBT0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQUtBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7OztBQzFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDaEJBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7O0FDM0RBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFBQTtBQUFBOztBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7O0FBTUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQURBO0FBS0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDL0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFKQTtBQVdBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7O0FDekhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBRkE7QUFRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN2QkE7QUFDQTtBQURBO0FBR0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN6REE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUxBO0FBSkE7O0FBYUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDN0ZBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7Ozs7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNyREE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUdBO0FBQ0E7QUFBQTtBQUFBOztBQUlBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFBQTtBQUFBOztBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN0RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUdBO0FBTkE7QUFRQTtBQUNBO0FBREE7QUFUQTtBQWFBO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUFGQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUFGQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQUtBO0FBQ0E7QUFEQTtBQUdBO0FBQ0E7QUFEQTtBQUdBO0FBQ0E7QUFiQTtBQWVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBVEE7QUFXQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUFHQTtBQVRBO0FBV0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBR0E7QUFDQTtBQURBO0FBR0E7QUFaQTs7QUFlQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN2SkE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUxBOztBQVFBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFBQTs7QUFLQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQUtBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2xNQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBS0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBSUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNwWEE7O0FBRUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFBQTtBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQUE7QUFBQTs7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQUtBO0FBUkE7O0FBV0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBSkE7QUFTQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBREE7O0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzFNQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUFBOztBQUtBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDYkE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUlBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBS0E7O0FBRUE7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBTUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFMQTtBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUVBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN0SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNqQkE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7OztBQ1ZBO0FBQUE7QUFBQTs7QUFBQTtBQUFBOztBQUVBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQUtBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQURBO0FBT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzNGQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTs7QUFFQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFEQTs7QUFJQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBWEE7QUFhQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFYQTs7QUFjQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7OztBQzNIQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBREE7QUFHQTs7QUFFQTtBQUNBO0FBQUE7QUFBQTs7QUFJQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUlBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFBQTtBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBSEE7QUFRQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQUE7QUFBQTtBQUdBO0FBQ0E7QUFDQTtBQUZBOztBQUtBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQURBO0FBR0E7QUFKQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBOztBQUlBO0FBQUE7QUFBQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFJQTtBQUNBO0FBTkE7QUFRQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDaEtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFBQTtBQUFBOztBQUlBO0FBQ0E7O0FBRUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQU1BO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUZBOztBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFJQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNyR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBR0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBREE7QUFLQTs7QUFFQTtBQUNBO0FBREE7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM5QkE7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7O0FBQUE7QUFBQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFKQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFiQTtBQW1CQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBS0E7QUFDQTtBQUNBO0FBREE7QUFHQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBS0E7QUFDQTtBQUNBO0FBRkE7O0FBS0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBREE7QUFHQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUFBO0FBRUE7QUFDQTtBQURBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFFQTtBQUNBO0FBREE7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBOztBQUlBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTs7QUFLQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUZBOztBQUtBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUFHQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBREE7QUFHQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzlOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN2REE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBRkE7QUFRQTs7QUFFQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBTUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzdDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUdBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQy9CQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBSUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQU1BO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMxREE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUlBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDMUJBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFJQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQURBO0FBR0E7O0FBRUE7QUFDQTtBQURBOztBQUlBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQUE7QUFBQTtBQUdBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBZEE7QUFnQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQWpCQTtBQW1CQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7O0FDL1ZBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7QUN2RkE7QUFBQTtBQUFBOztBQUFBO0FBQUE7O0FBRUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFGQTtBQUFBO0FBQUE7O0FBT0E7O0FBRUE7QUFDQTtBQURBO0FBR0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBR0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFNQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUFBO0FBQUE7QUFBQTs7QUFLQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBS0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBREE7O0FBUUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFJQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDcFpBO0FBQUE7QUFBQTs7QUFBQTtBQUFBOztBQUVBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBR0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7QUMxS0E7O0FBRUE7QUFDQTtBQUNBO0FBRkE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3VCQTs7QUFrQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQUE7O0FBQ0E7QUFDQTs7QUFDQTtBQUFBO0FBQUE7QUFBQTs7QUFZQTtBQUNBO0FBSUE7QUFDQTtBQUlBOztBQUNBO0FBQ0E7QUFFQTtBQUtBO0FBR0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUdBO0FBQ0E7O0FBRUE7QUFBQTtBQUFBOztBQUdBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBQ0E7QUFDQTtBQUNBOztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQTtBQUNBOztBQU9BO0FBQ0E7QUFBQTtBQUFBO0FBQUE7O0FBVUE7QUFNQTs7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBOztBQUNBO0FBQUE7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUdBO0FBQ0E7O0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUtBO0FBQ0E7QUFDQTtBQUZBOztBQUtBO0FBQ0E7QUFDQTs7QUFFQTs7QUFDQTtBQU9BO0FBQUE7QUFBQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFpQkE7QUFDQTtBQUFBO0FBQUE7O0FBSUE7QUFBQTtBQUFBO0FBQUE7O0FBQ0E7QUFDQTtBQUdBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBR0E7O0FBRUE7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7QUN4VUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUN4TkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7OztBQzlEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7OztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7O0FDOU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDbEpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7QUMzUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUMxR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUNQQTs7Ozs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ21CQTtBQUtBOztBQU1BO0FBQ0E7QUFDQTtBQUNBOztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUVBO0FBRUEiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9AZWxhc3RpYy9hcG0tcnVtL3dlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIndlYnBhY2s6Ly9AZWxhc3RpYy9hcG0tcnVtLy4uL3J1bS1jb3JlL2Rpc3QvZXMvYm9vdHN0cmFwLmpzIiwid2VicGFjazovL0BlbGFzdGljL2FwbS1ydW0vLi4vcnVtLWNvcmUvZGlzdC9lcy9jb21tb24vYWZ0ZXItZnJhbWUuanMiLCJ3ZWJwYWNrOi8vQGVsYXN0aWMvYXBtLXJ1bS8uLi9ydW0tY29yZS9kaXN0L2VzL2NvbW1vbi9hcG0tc2VydmVyLmpzIiwid2VicGFjazovL0BlbGFzdGljL2FwbS1ydW0vLi4vcnVtLWNvcmUvZGlzdC9lcy9jb21tb24vY29tcHJlc3MuanMiLCJ3ZWJwYWNrOi8vQGVsYXN0aWMvYXBtLXJ1bS8uLi9ydW0tY29yZS9kaXN0L2VzL2NvbW1vbi9jb25maWctc2VydmljZS5qcyIsIndlYnBhY2s6Ly9AZWxhc3RpYy9hcG0tcnVtLy4uL3J1bS1jb3JlL2Rpc3QvZXMvY29tbW9uL2NvbnN0YW50cy5qcyIsIndlYnBhY2s6Ly9AZWxhc3RpYy9hcG0tcnVtLy4uL3J1bS1jb3JlL2Rpc3QvZXMvY29tbW9uL2NvbnRleHQuanMiLCJ3ZWJwYWNrOi8vQGVsYXN0aWMvYXBtLXJ1bS8uLi9ydW0tY29yZS9kaXN0L2VzL2NvbW1vbi9ldmVudC1oYW5kbGVyLmpzIiwid2VicGFjazovL0BlbGFzdGljL2FwbS1ydW0vLi4vcnVtLWNvcmUvZGlzdC9lcy9jb21tb24vaHR0cC9mZXRjaC5qcyIsIndlYnBhY2s6Ly9AZWxhc3RpYy9hcG0tcnVtLy4uL3J1bS1jb3JlL2Rpc3QvZXMvY29tbW9uL2h0dHAvcmVzcG9uc2Utc3RhdHVzLmpzIiwid2VicGFjazovL0BlbGFzdGljL2FwbS1ydW0vLi4vcnVtLWNvcmUvZGlzdC9lcy9jb21tb24vaHR0cC94aHIuanMiLCJ3ZWJwYWNrOi8vQGVsYXN0aWMvYXBtLXJ1bS8uLi9ydW0tY29yZS9kaXN0L2VzL2NvbW1vbi9pbnN0cnVtZW50LmpzIiwid2VicGFjazovL0BlbGFzdGljL2FwbS1ydW0vLi4vcnVtLWNvcmUvZGlzdC9lcy9jb21tb24vbG9nZ2luZy1zZXJ2aWNlLmpzIiwid2VicGFjazovL0BlbGFzdGljL2FwbS1ydW0vLi4vcnVtLWNvcmUvZGlzdC9lcy9jb21tb24vbmRqc29uLmpzIiwid2VicGFjazovL0BlbGFzdGljL2FwbS1ydW0vLi4vcnVtLWNvcmUvZGlzdC9lcy9jb21tb24vb2JzZXJ2ZXJzL3BhZ2UtY2xpY2tzLmpzIiwid2VicGFjazovL0BlbGFzdGljL2FwbS1ydW0vLi4vcnVtLWNvcmUvZGlzdC9lcy9jb21tb24vb2JzZXJ2ZXJzL3BhZ2UtdmlzaWJpbGl0eS5qcyIsIndlYnBhY2s6Ly9AZWxhc3RpYy9hcG0tcnVtLy4uL3J1bS1jb3JlL2Rpc3QvZXMvY29tbW9uL3BhdGNoaW5nL2ZldGNoLXBhdGNoLmpzIiwid2VicGFjazovL0BlbGFzdGljL2FwbS1ydW0vLi4vcnVtLWNvcmUvZGlzdC9lcy9jb21tb24vcGF0Y2hpbmcvaGlzdG9yeS1wYXRjaC5qcyIsIndlYnBhY2s6Ly9AZWxhc3RpYy9hcG0tcnVtLy4uL3J1bS1jb3JlL2Rpc3QvZXMvY29tbW9uL3BhdGNoaW5nL2luZGV4LmpzIiwid2VicGFjazovL0BlbGFzdGljL2FwbS1ydW0vLi4vcnVtLWNvcmUvZGlzdC9lcy9jb21tb24vcGF0Y2hpbmcvcGF0Y2gtdXRpbHMuanMiLCJ3ZWJwYWNrOi8vQGVsYXN0aWMvYXBtLXJ1bS8uLi9ydW0tY29yZS9kaXN0L2VzL2NvbW1vbi9wYXRjaGluZy94aHItcGF0Y2guanMiLCJ3ZWJwYWNrOi8vQGVsYXN0aWMvYXBtLXJ1bS8uLi9ydW0tY29yZS9kaXN0L2VzL2NvbW1vbi9wb2x5ZmlsbHMuanMiLCJ3ZWJwYWNrOi8vQGVsYXN0aWMvYXBtLXJ1bS8uLi9ydW0tY29yZS9kaXN0L2VzL2NvbW1vbi9xdWV1ZS5qcyIsIndlYnBhY2s6Ly9AZWxhc3RpYy9hcG0tcnVtLy4uL3J1bS1jb3JlL2Rpc3QvZXMvY29tbW9uL3NlcnZpY2UtZmFjdG9yeS5qcyIsIndlYnBhY2s6Ly9AZWxhc3RpYy9hcG0tcnVtLy4uL3J1bS1jb3JlL2Rpc3QvZXMvY29tbW9uL3Rocm90dGxlLmpzIiwid2VicGFjazovL0BlbGFzdGljL2FwbS1ydW0vLi4vcnVtLWNvcmUvZGlzdC9lcy9jb21tb24vdHJ1bmNhdGUuanMiLCJ3ZWJwYWNrOi8vQGVsYXN0aWMvYXBtLXJ1bS8uLi9ydW0tY29yZS9kaXN0L2VzL2NvbW1vbi91cmwuanMiLCJ3ZWJwYWNrOi8vQGVsYXN0aWMvYXBtLXJ1bS8uLi9ydW0tY29yZS9kaXN0L2VzL2NvbW1vbi91dGlscy5qcyIsIndlYnBhY2s6Ly9AZWxhc3RpYy9hcG0tcnVtLy4uL3J1bS1jb3JlL2Rpc3QvZXMvZXJyb3ItbG9nZ2luZy9lcnJvci1sb2dnaW5nLmpzIiwid2VicGFjazovL0BlbGFzdGljL2FwbS1ydW0vLi4vcnVtLWNvcmUvZGlzdC9lcy9lcnJvci1sb2dnaW5nL2luZGV4LmpzIiwid2VicGFjazovL0BlbGFzdGljL2FwbS1ydW0vLi4vcnVtLWNvcmUvZGlzdC9lcy9lcnJvci1sb2dnaW5nL3N0YWNrLXRyYWNlLmpzIiwid2VicGFjazovL0BlbGFzdGljL2FwbS1ydW0vLi4vcnVtLWNvcmUvZGlzdC9lcy9pbmRleC5qcyIsIndlYnBhY2s6Ly9AZWxhc3RpYy9hcG0tcnVtLy4uL3J1bS1jb3JlL2Rpc3QvZXMvb3BlbnRyYWNpbmcvaW5kZXguanMiLCJ3ZWJwYWNrOi8vQGVsYXN0aWMvYXBtLXJ1bS8uLi9ydW0tY29yZS9kaXN0L2VzL29wZW50cmFjaW5nL3NwYW4uanMiLCJ3ZWJwYWNrOi8vQGVsYXN0aWMvYXBtLXJ1bS8uLi9ydW0tY29yZS9kaXN0L2VzL29wZW50cmFjaW5nL3RyYWNlci5qcyIsIndlYnBhY2s6Ly9AZWxhc3RpYy9hcG0tcnVtLy4uL3J1bS1jb3JlL2Rpc3QvZXMvcGVyZm9ybWFuY2UtbW9uaXRvcmluZy9icmVha2Rvd24uanMiLCJ3ZWJwYWNrOi8vQGVsYXN0aWMvYXBtLXJ1bS8uLi9ydW0tY29yZS9kaXN0L2VzL3BlcmZvcm1hbmNlLW1vbml0b3JpbmcvaW5kZXguanMiLCJ3ZWJwYWNrOi8vQGVsYXN0aWMvYXBtLXJ1bS8uLi9ydW0tY29yZS9kaXN0L2VzL3BlcmZvcm1hbmNlLW1vbml0b3JpbmcvbWV0cmljcy9pbnAvcHJvY2Vzcy5qcyIsIndlYnBhY2s6Ly9AZWxhc3RpYy9hcG0tcnVtLy4uL3J1bS1jb3JlL2Rpc3QvZXMvcGVyZm9ybWFuY2UtbW9uaXRvcmluZy9tZXRyaWNzL2lucC9yZXBvcnQuanMiLCJ3ZWJwYWNrOi8vQGVsYXN0aWMvYXBtLXJ1bS8uLi9ydW0tY29yZS9kaXN0L2VzL3BlcmZvcm1hbmNlLW1vbml0b3JpbmcvbWV0cmljcy9tZXRyaWNzLmpzIiwid2VicGFjazovL0BlbGFzdGljL2FwbS1ydW0vLi4vcnVtLWNvcmUvZGlzdC9lcy9wZXJmb3JtYW5jZS1tb25pdG9yaW5nL25hdmlnYXRpb24vY2FwdHVyZS1uYXZpZ2F0aW9uLmpzIiwid2VicGFjazovL0BlbGFzdGljL2FwbS1ydW0vLi4vcnVtLWNvcmUvZGlzdC9lcy9wZXJmb3JtYW5jZS1tb25pdG9yaW5nL25hdmlnYXRpb24vbWFya3MuanMiLCJ3ZWJwYWNrOi8vQGVsYXN0aWMvYXBtLXJ1bS8uLi9ydW0tY29yZS9kaXN0L2VzL3BlcmZvcm1hbmNlLW1vbml0b3JpbmcvbmF2aWdhdGlvbi9uYXZpZ2F0aW9uLXRpbWluZy5qcyIsIndlYnBhY2s6Ly9AZWxhc3RpYy9hcG0tcnVtLy4uL3J1bS1jb3JlL2Rpc3QvZXMvcGVyZm9ybWFuY2UtbW9uaXRvcmluZy9uYXZpZ2F0aW9uL3Jlc291cmNlLXRpbWluZy5qcyIsIndlYnBhY2s6Ly9AZWxhc3RpYy9hcG0tcnVtLy4uL3J1bS1jb3JlL2Rpc3QvZXMvcGVyZm9ybWFuY2UtbW9uaXRvcmluZy9uYXZpZ2F0aW9uL3VzZXItdGltaW5nLmpzIiwid2VicGFjazovL0BlbGFzdGljL2FwbS1ydW0vLi4vcnVtLWNvcmUvZGlzdC9lcy9wZXJmb3JtYW5jZS1tb25pdG9yaW5nL25hdmlnYXRpb24vdXRpbHMuanMiLCJ3ZWJwYWNrOi8vQGVsYXN0aWMvYXBtLXJ1bS8uLi9ydW0tY29yZS9kaXN0L2VzL3BlcmZvcm1hbmNlLW1vbml0b3JpbmcvcGVyZm9ybWFuY2UtbW9uaXRvcmluZy5qcyIsIndlYnBhY2s6Ly9AZWxhc3RpYy9hcG0tcnVtLy4uL3J1bS1jb3JlL2Rpc3QvZXMvcGVyZm9ybWFuY2UtbW9uaXRvcmluZy9zcGFuLWJhc2UuanMiLCJ3ZWJwYWNrOi8vQGVsYXN0aWMvYXBtLXJ1bS8uLi9ydW0tY29yZS9kaXN0L2VzL3BlcmZvcm1hbmNlLW1vbml0b3Jpbmcvc3Bhbi5qcyIsIndlYnBhY2s6Ly9AZWxhc3RpYy9hcG0tcnVtLy4uL3J1bS1jb3JlL2Rpc3QvZXMvcGVyZm9ybWFuY2UtbW9uaXRvcmluZy90cmFuc2FjdGlvbi1zZXJ2aWNlLmpzIiwid2VicGFjazovL0BlbGFzdGljL2FwbS1ydW0vLi4vcnVtLWNvcmUvZGlzdC9lcy9wZXJmb3JtYW5jZS1tb25pdG9yaW5nL3RyYW5zYWN0aW9uLmpzIiwid2VicGFjazovL0BlbGFzdGljL2FwbS1ydW0vLi4vcnVtLWNvcmUvZGlzdC9lcy9zdGF0ZS5qcyIsIndlYnBhY2s6Ly9AZWxhc3RpYy9hcG0tcnVtLy4vc3JjL2FwbS1iYXNlLmpzIiwid2VicGFjazovL0BlbGFzdGljL2FwbS1ydW0vLi4vLi4vbm9kZV9tb2R1bGVzL2Vycm9yLXN0YWNrLXBhcnNlci9lcnJvci1zdGFjay1wYXJzZXIuanMiLCJ3ZWJwYWNrOi8vQGVsYXN0aWMvYXBtLXJ1bS8uLi8uLi9ub2RlX21vZHVsZXMvb3BlbnRyYWNpbmcvbGliL2NvbnN0YW50cy5qcyIsIndlYnBhY2s6Ly9AZWxhc3RpYy9hcG0tcnVtLy4uLy4uL25vZGVfbW9kdWxlcy9vcGVudHJhY2luZy9saWIvZnVuY3Rpb25zLmpzIiwid2VicGFjazovL0BlbGFzdGljL2FwbS1ydW0vLi4vLi4vbm9kZV9tb2R1bGVzL29wZW50cmFjaW5nL2xpYi9ub29wLmpzIiwid2VicGFjazovL0BlbGFzdGljL2FwbS1ydW0vLi4vLi4vbm9kZV9tb2R1bGVzL29wZW50cmFjaW5nL2xpYi9yZWZlcmVuY2UuanMiLCJ3ZWJwYWNrOi8vQGVsYXN0aWMvYXBtLXJ1bS8uLi8uLi9ub2RlX21vZHVsZXMvb3BlbnRyYWNpbmcvbGliL3NwYW4uanMiLCJ3ZWJwYWNrOi8vQGVsYXN0aWMvYXBtLXJ1bS8uLi8uLi9ub2RlX21vZHVsZXMvb3BlbnRyYWNpbmcvbGliL3NwYW5fY29udGV4dC5qcyIsIndlYnBhY2s6Ly9AZWxhc3RpYy9hcG0tcnVtLy4uLy4uL25vZGVfbW9kdWxlcy9vcGVudHJhY2luZy9saWIvdHJhY2VyLmpzIiwid2VicGFjazovL0BlbGFzdGljL2FwbS1ydW0vLi4vLi4vbm9kZV9tb2R1bGVzL3Byb21pc2UtcG9seWZpbGwvc3JjL2ZpbmFsbHkuanMiLCJ3ZWJwYWNrOi8vQGVsYXN0aWMvYXBtLXJ1bS8uLi8uLi9ub2RlX21vZHVsZXMvcHJvbWlzZS1wb2x5ZmlsbC9zcmMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vQGVsYXN0aWMvYXBtLXJ1bS8uLi8uLi9ub2RlX21vZHVsZXMvc3RhY2tmcmFtZS9zdGFja2ZyYW1lLmpzIiwid2VicGFjazovL0BlbGFzdGljL2FwbS1ydW0vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vQGVsYXN0aWMvYXBtLXJ1bS93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly9AZWxhc3RpYy9hcG0tcnVtL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9AZWxhc3RpYy9hcG0tcnVtL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vQGVsYXN0aWMvYXBtLXJ1bS93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL0BlbGFzdGljL2FwbS1ydW0vLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiZWxhc3RpYy1hcG0tcnVtXCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcImVsYXN0aWMtYXBtLXJ1bVwiXSA9IGZhY3RvcnkoKTtcbn0pKHNlbGYsIGZ1bmN0aW9uKCkge1xucmV0dXJuICIsImltcG9ydCB7IGlzUGxhdGZvcm1TdXBwb3J0ZWQsIGlzQnJvd3Nlciwgbm93IH0gZnJvbSAnLi9jb21tb24vdXRpbHMnO1xuaW1wb3J0IHsgcGF0Y2hBbGwgfSBmcm9tICcuL2NvbW1vbi9wYXRjaGluZyc7XG5pbXBvcnQgeyBzdGF0ZSB9IGZyb20gJy4vc3RhdGUnO1xudmFyIGVuYWJsZWQgPSBmYWxzZTtcbmV4cG9ydCBmdW5jdGlvbiBib290c3RyYXAoKSB7XG4gIGlmIChpc1BsYXRmb3JtU3VwcG9ydGVkKCkpIHtcbiAgICBwYXRjaEFsbCgpO1xuICAgIHN0YXRlLmJvb3RzdHJhcFRpbWUgPSBub3coKTtcbiAgICBlbmFibGVkID0gdHJ1ZTtcbiAgfSBlbHNlIGlmIChpc0Jyb3dzZXIpIHtcbiAgICBjb25zb2xlLmxvZygnW0VsYXN0aWMgQVBNXSBwbGF0Zm9ybSBpcyBub3Qgc3VwcG9ydGVkIScpO1xuICB9XG5cbiAgcmV0dXJuIGVuYWJsZWQ7XG59IiwidmFyIFJBRl9USU1FT1VUID0gMTAwO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gYWZ0ZXJGcmFtZShjYWxsYmFjaykge1xuICB2YXIgaGFuZGxlciA9IGZ1bmN0aW9uIGhhbmRsZXIoKSB7XG4gICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKHJhZik7XG4gICAgc2V0VGltZW91dChjYWxsYmFjayk7XG4gIH07XG5cbiAgdmFyIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGhhbmRsZXIsIFJBRl9USU1FT1VUKTtcbiAgdmFyIHJhZiA9IHJlcXVlc3RBbmltYXRpb25GcmFtZShoYW5kbGVyKTtcbn0iLCJpbXBvcnQgUXVldWUgZnJvbSAnLi9xdWV1ZSc7XG5pbXBvcnQgdGhyb3R0bGUgZnJvbSAnLi90aHJvdHRsZSc7XG5pbXBvcnQgTkRKU09OIGZyb20gJy4vbmRqc29uJztcbmltcG9ydCB7IHRydW5jYXRlTW9kZWwsIE1FVEFEQVRBX01PREVMIH0gZnJvbSAnLi90cnVuY2F0ZSc7XG5pbXBvcnQgeyBFUlJPUlMsIEhUVFBfUkVRVUVTVF9USU1FT1VULCBRVUVVRV9GTFVTSCwgVFJBTlNBQ1RJT05TIH0gZnJvbSAnLi9jb25zdGFudHMnO1xuaW1wb3J0IHsgbm9vcCB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHsgUHJvbWlzZSB9IGZyb20gJy4vcG9seWZpbGxzJztcbmltcG9ydCB7IGNvbXByZXNzTWV0YWRhdGEsIGNvbXByZXNzVHJhbnNhY3Rpb24sIGNvbXByZXNzRXJyb3IsIGNvbXByZXNzUGF5bG9hZCB9IGZyb20gJy4vY29tcHJlc3MnO1xuaW1wb3J0IHsgX19ERVZfXyB9IGZyb20gJy4uL3N0YXRlJztcbmltcG9ydCB7IHNlbmRGZXRjaFJlcXVlc3QsIHNob3VsZFVzZUZldGNoV2l0aEtlZXBBbGl2ZSB9IGZyb20gJy4vaHR0cC9mZXRjaCc7XG5pbXBvcnQgeyBzZW5kWEhSIH0gZnJvbSAnLi9odHRwL3hocic7XG52YXIgVEhST1RUTEVfSU5URVJWQUwgPSA2MDAwMDtcblxudmFyIEFwbVNlcnZlciA9IGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gQXBtU2VydmVyKGNvbmZpZ1NlcnZpY2UsIGxvZ2dpbmdTZXJ2aWNlKSB7XG4gICAgdGhpcy5fY29uZmlnU2VydmljZSA9IGNvbmZpZ1NlcnZpY2U7XG4gICAgdGhpcy5fbG9nZ2luZ1NlcnZpY2UgPSBsb2dnaW5nU2VydmljZTtcbiAgICB0aGlzLnF1ZXVlID0gdW5kZWZpbmVkO1xuICAgIHRoaXMudGhyb3R0bGVFdmVudHMgPSBub29wO1xuICB9XG5cbiAgdmFyIF9wcm90byA9IEFwbVNlcnZlci5wcm90b3R5cGU7XG5cbiAgX3Byb3RvLmluaXQgPSBmdW5jdGlvbiBpbml0KCkge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICB2YXIgcXVldWVMaW1pdCA9IHRoaXMuX2NvbmZpZ1NlcnZpY2UuZ2V0KCdxdWV1ZUxpbWl0Jyk7XG5cbiAgICB2YXIgZmx1c2hJbnRlcnZhbCA9IHRoaXMuX2NvbmZpZ1NlcnZpY2UuZ2V0KCdmbHVzaEludGVydmFsJyk7XG5cbiAgICB2YXIgbGltaXQgPSB0aGlzLl9jb25maWdTZXJ2aWNlLmdldCgnZXZlbnRzTGltaXQnKTtcblxuICAgIHZhciBvbkZsdXNoID0gZnVuY3Rpb24gb25GbHVzaChldmVudHMpIHtcbiAgICAgIHZhciBwcm9taXNlID0gX3RoaXMuc2VuZEV2ZW50cyhldmVudHMpO1xuXG4gICAgICBpZiAocHJvbWlzZSkge1xuICAgICAgICBwcm9taXNlLmNhdGNoKGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgICAgICAgICBfdGhpcy5fbG9nZ2luZ1NlcnZpY2Uud2FybignRmFpbGVkIHNlbmRpbmcgZXZlbnRzIScsIF90aGlzLl9jb25zdHJ1Y3RFcnJvcihyZWFzb24pKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHRoaXMucXVldWUgPSBuZXcgUXVldWUob25GbHVzaCwge1xuICAgICAgcXVldWVMaW1pdDogcXVldWVMaW1pdCxcbiAgICAgIGZsdXNoSW50ZXJ2YWw6IGZsdXNoSW50ZXJ2YWxcbiAgICB9KTtcbiAgICB0aGlzLnRocm90dGxlRXZlbnRzID0gdGhyb3R0bGUodGhpcy5xdWV1ZS5hZGQuYmluZCh0aGlzLnF1ZXVlKSwgZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIF90aGlzLl9sb2dnaW5nU2VydmljZS53YXJuKCdEcm9wcGVkIGV2ZW50cyBkdWUgdG8gdGhyb3R0bGluZyEnKTtcbiAgICB9LCB7XG4gICAgICBsaW1pdDogbGltaXQsXG4gICAgICBpbnRlcnZhbDogVEhST1RUTEVfSU5URVJWQUxcbiAgICB9KTtcblxuICAgIHRoaXMuX2NvbmZpZ1NlcnZpY2Uub2JzZXJ2ZUV2ZW50KFFVRVVFX0ZMVVNILCBmdW5jdGlvbiAoKSB7XG4gICAgICBfdGhpcy5xdWV1ZS5mbHVzaCgpO1xuICAgIH0pO1xuICB9O1xuXG4gIF9wcm90by5fcG9zdEpzb24gPSBmdW5jdGlvbiBfcG9zdEpzb24oZW5kUG9pbnQsIHBheWxvYWQpIHtcbiAgICB2YXIgX3RoaXMyID0gdGhpcztcblxuICAgIHZhciBoZWFkZXJzID0ge1xuICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94LW5kanNvbidcbiAgICB9O1xuXG4gICAgdmFyIGFwbVJlcXVlc3QgPSB0aGlzLl9jb25maWdTZXJ2aWNlLmdldCgnYXBtUmVxdWVzdCcpO1xuXG4gICAgdmFyIHBhcmFtcyA9IHtcbiAgICAgIHBheWxvYWQ6IHBheWxvYWQsXG4gICAgICBoZWFkZXJzOiBoZWFkZXJzLFxuICAgICAgYmVmb3JlU2VuZDogYXBtUmVxdWVzdFxuICAgIH07XG4gICAgcmV0dXJuIGNvbXByZXNzUGF5bG9hZChwYXJhbXMpLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgaWYgKF9fREVWX18pIHtcbiAgICAgICAgX3RoaXMyLl9sb2dnaW5nU2VydmljZS5kZWJ1ZygnQ29tcHJlc3NpbmcgdGhlIHBheWxvYWQgdXNpbmcgQ29tcHJlc3Npb25TdHJlYW0gQVBJIGZhaWxlZCcsIGVycm9yLm1lc3NhZ2UpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcGFyYW1zO1xuICAgIH0pLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgcmV0dXJuIF90aGlzMi5fbWFrZUh0dHBSZXF1ZXN0KCdQT1NUJywgZW5kUG9pbnQsIHJlc3VsdCk7XG4gICAgfSkudGhlbihmdW5jdGlvbiAoX3JlZikge1xuICAgICAgdmFyIHJlc3BvbnNlVGV4dCA9IF9yZWYucmVzcG9uc2VUZXh0O1xuICAgICAgcmV0dXJuIHJlc3BvbnNlVGV4dDtcbiAgICB9KTtcbiAgfTtcblxuICBfcHJvdG8uX2NvbnN0cnVjdEVycm9yID0gZnVuY3Rpb24gX2NvbnN0cnVjdEVycm9yKHJlYXNvbikge1xuICAgIHZhciB1cmwgPSByZWFzb24udXJsLFxuICAgICAgICBzdGF0dXMgPSByZWFzb24uc3RhdHVzLFxuICAgICAgICByZXNwb25zZVRleHQgPSByZWFzb24ucmVzcG9uc2VUZXh0O1xuXG4gICAgaWYgKHR5cGVvZiBzdGF0dXMgPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHJldHVybiByZWFzb247XG4gICAgfVxuXG4gICAgdmFyIG1lc3NhZ2UgPSB1cmwgKyAnIEhUVFAgc3RhdHVzOiAnICsgc3RhdHVzO1xuXG4gICAgaWYgKF9fREVWX18gJiYgcmVzcG9uc2VUZXh0KSB7XG4gICAgICB0cnkge1xuICAgICAgICB2YXIgc2VydmVyRXJyb3JzID0gW107XG4gICAgICAgIHZhciByZXNwb25zZSA9IEpTT04ucGFyc2UocmVzcG9uc2VUZXh0KTtcblxuICAgICAgICBpZiAocmVzcG9uc2UuZXJyb3JzICYmIHJlc3BvbnNlLmVycm9ycy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgcmVzcG9uc2UuZXJyb3JzLmZvckVhY2goZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZlckVycm9ycy5wdXNoKGVyci5tZXNzYWdlKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBtZXNzYWdlICs9ICcgJyArIHNlcnZlckVycm9ycy5qb2luKCcsJyk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgdGhpcy5fbG9nZ2luZ1NlcnZpY2UuZGVidWcoJ0Vycm9yIHBhcnNpbmcgcmVzcG9uc2UgZnJvbSBBUE0gc2VydmVyJywgZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBFcnJvcihtZXNzYWdlKTtcbiAgfTtcblxuICBfcHJvdG8uX21ha2VIdHRwUmVxdWVzdCA9IGZ1bmN0aW9uIF9tYWtlSHR0cFJlcXVlc3QobWV0aG9kLCB1cmwsIF90ZW1wKSB7XG4gICAgdmFyIF9yZWYyID0gX3RlbXAgPT09IHZvaWQgMCA/IHt9IDogX3RlbXAsXG4gICAgICAgIF9yZWYyJHRpbWVvdXQgPSBfcmVmMi50aW1lb3V0LFxuICAgICAgICB0aW1lb3V0ID0gX3JlZjIkdGltZW91dCA9PT0gdm9pZCAwID8gSFRUUF9SRVFVRVNUX1RJTUVPVVQgOiBfcmVmMiR0aW1lb3V0LFxuICAgICAgICBwYXlsb2FkID0gX3JlZjIucGF5bG9hZCxcbiAgICAgICAgaGVhZGVycyA9IF9yZWYyLmhlYWRlcnMsXG4gICAgICAgIGJlZm9yZVNlbmQgPSBfcmVmMi5iZWZvcmVTZW5kO1xuXG4gICAgdmFyIHNlbmRDcmVkZW50aWFscyA9IHRoaXMuX2NvbmZpZ1NlcnZpY2UuZ2V0KCdzZW5kQ3JlZGVudGlhbHMnKTtcblxuICAgIGlmICghYmVmb3JlU2VuZCAmJiBzaG91bGRVc2VGZXRjaFdpdGhLZWVwQWxpdmUobWV0aG9kLCBwYXlsb2FkKSkge1xuICAgICAgcmV0dXJuIHNlbmRGZXRjaFJlcXVlc3QobWV0aG9kLCB1cmwsIHtcbiAgICAgICAga2VlcGFsaXZlOiB0cnVlLFxuICAgICAgICB0aW1lb3V0OiB0aW1lb3V0LFxuICAgICAgICBwYXlsb2FkOiBwYXlsb2FkLFxuICAgICAgICBoZWFkZXJzOiBoZWFkZXJzLFxuICAgICAgICBzZW5kQ3JlZGVudGlhbHM6IHNlbmRDcmVkZW50aWFsc1xuICAgICAgfSkuY2F0Y2goZnVuY3Rpb24gKHJlYXNvbikge1xuICAgICAgICBpZiAocmVhc29uIGluc3RhbmNlb2YgVHlwZUVycm9yKSB7XG4gICAgICAgICAgcmV0dXJuIHNlbmRYSFIobWV0aG9kLCB1cmwsIHtcbiAgICAgICAgICAgIHRpbWVvdXQ6IHRpbWVvdXQsXG4gICAgICAgICAgICBwYXlsb2FkOiBwYXlsb2FkLFxuICAgICAgICAgICAgaGVhZGVyczogaGVhZGVycyxcbiAgICAgICAgICAgIGJlZm9yZVNlbmQ6IGJlZm9yZVNlbmQsXG4gICAgICAgICAgICBzZW5kQ3JlZGVudGlhbHM6IHNlbmRDcmVkZW50aWFsc1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhyb3cgcmVhc29uO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHNlbmRYSFIobWV0aG9kLCB1cmwsIHtcbiAgICAgIHRpbWVvdXQ6IHRpbWVvdXQsXG4gICAgICBwYXlsb2FkOiBwYXlsb2FkLFxuICAgICAgaGVhZGVyczogaGVhZGVycyxcbiAgICAgIGJlZm9yZVNlbmQ6IGJlZm9yZVNlbmQsXG4gICAgICBzZW5kQ3JlZGVudGlhbHM6IHNlbmRDcmVkZW50aWFsc1xuICAgIH0pO1xuICB9O1xuXG4gIF9wcm90by5mZXRjaENvbmZpZyA9IGZ1bmN0aW9uIGZldGNoQ29uZmlnKHNlcnZpY2VOYW1lLCBlbnZpcm9ubWVudCkge1xuICAgIHZhciBfdGhpczMgPSB0aGlzO1xuXG4gICAgdmFyIF90aGlzJGdldEVuZHBvaW50cyA9IHRoaXMuZ2V0RW5kcG9pbnRzKCksXG4gICAgICAgIGNvbmZpZ0VuZHBvaW50ID0gX3RoaXMkZ2V0RW5kcG9pbnRzLmNvbmZpZ0VuZHBvaW50O1xuXG4gICAgaWYgKCFzZXJ2aWNlTmFtZSkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KCdzZXJ2aWNlTmFtZSBpcyByZXF1aXJlZCBmb3IgZmV0Y2hpbmcgY2VudHJhbCBjb25maWcuJyk7XG4gICAgfVxuXG4gICAgY29uZmlnRW5kcG9pbnQgKz0gXCI/c2VydmljZS5uYW1lPVwiICsgc2VydmljZU5hbWU7XG5cbiAgICBpZiAoZW52aXJvbm1lbnQpIHtcbiAgICAgIGNvbmZpZ0VuZHBvaW50ICs9IFwiJnNlcnZpY2UuZW52aXJvbm1lbnQ9XCIgKyBlbnZpcm9ubWVudDtcbiAgICB9XG5cbiAgICB2YXIgbG9jYWxDb25maWcgPSB0aGlzLl9jb25maWdTZXJ2aWNlLmdldExvY2FsQ29uZmlnKCk7XG5cbiAgICBpZiAobG9jYWxDb25maWcpIHtcbiAgICAgIGNvbmZpZ0VuZHBvaW50ICs9IFwiJmlmbm9uZW1hdGNoPVwiICsgbG9jYWxDb25maWcuZXRhZztcbiAgICB9XG5cbiAgICB2YXIgYXBtUmVxdWVzdCA9IHRoaXMuX2NvbmZpZ1NlcnZpY2UuZ2V0KCdhcG1SZXF1ZXN0Jyk7XG5cbiAgICByZXR1cm4gdGhpcy5fbWFrZUh0dHBSZXF1ZXN0KCdHRVQnLCBjb25maWdFbmRwb2ludCwge1xuICAgICAgdGltZW91dDogNTAwMCxcbiAgICAgIGJlZm9yZVNlbmQ6IGFwbVJlcXVlc3RcbiAgICB9KS50aGVuKGZ1bmN0aW9uICh4aHIpIHtcbiAgICAgIHZhciBzdGF0dXMgPSB4aHIuc3RhdHVzLFxuICAgICAgICAgIHJlc3BvbnNlVGV4dCA9IHhoci5yZXNwb25zZVRleHQ7XG5cbiAgICAgIGlmIChzdGF0dXMgPT09IDMwNCkge1xuICAgICAgICByZXR1cm4gbG9jYWxDb25maWc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgcmVtb3RlQ29uZmlnID0gSlNPTi5wYXJzZShyZXNwb25zZVRleHQpO1xuICAgICAgICB2YXIgZXRhZyA9IHhoci5nZXRSZXNwb25zZUhlYWRlcignZXRhZycpO1xuXG4gICAgICAgIGlmIChldGFnKSB7XG4gICAgICAgICAgcmVtb3RlQ29uZmlnLmV0YWcgPSBldGFnLnJlcGxhY2UoL1tcIl0vZywgJycpO1xuXG4gICAgICAgICAgX3RoaXMzLl9jb25maWdTZXJ2aWNlLnNldExvY2FsQ29uZmlnKHJlbW90ZUNvbmZpZywgdHJ1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVtb3RlQ29uZmlnO1xuICAgICAgfVxuICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgICAgIHZhciBlcnJvciA9IF90aGlzMy5fY29uc3RydWN0RXJyb3IocmVhc29uKTtcblxuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KGVycm9yKTtcbiAgICB9KTtcbiAgfTtcblxuICBfcHJvdG8uY3JlYXRlTWV0YURhdGEgPSBmdW5jdGlvbiBjcmVhdGVNZXRhRGF0YSgpIHtcbiAgICB2YXIgY2ZnID0gdGhpcy5fY29uZmlnU2VydmljZTtcbiAgICB2YXIgbWV0YWRhdGEgPSB7XG4gICAgICBzZXJ2aWNlOiB7XG4gICAgICAgIG5hbWU6IGNmZy5nZXQoJ3NlcnZpY2VOYW1lJyksXG4gICAgICAgIHZlcnNpb246IGNmZy5nZXQoJ3NlcnZpY2VWZXJzaW9uJyksXG4gICAgICAgIGFnZW50OiB7XG4gICAgICAgICAgbmFtZTogJ3J1bS1qcycsXG4gICAgICAgICAgdmVyc2lvbjogY2ZnLnZlcnNpb25cbiAgICAgICAgfSxcbiAgICAgICAgbGFuZ3VhZ2U6IHtcbiAgICAgICAgICBuYW1lOiAnamF2YXNjcmlwdCdcbiAgICAgICAgfSxcbiAgICAgICAgZW52aXJvbm1lbnQ6IGNmZy5nZXQoJ2Vudmlyb25tZW50JylcbiAgICAgIH0sXG4gICAgICBsYWJlbHM6IGNmZy5nZXQoJ2NvbnRleHQudGFncycpXG4gICAgfTtcbiAgICByZXR1cm4gdHJ1bmNhdGVNb2RlbChNRVRBREFUQV9NT0RFTCwgbWV0YWRhdGEpO1xuICB9O1xuXG4gIF9wcm90by5hZGRFcnJvciA9IGZ1bmN0aW9uIGFkZEVycm9yKGVycm9yKSB7XG4gICAgdmFyIF90aGlzJHRocm90dGxlRXZlbnRzO1xuXG4gICAgdGhpcy50aHJvdHRsZUV2ZW50cygoX3RoaXMkdGhyb3R0bGVFdmVudHMgPSB7fSwgX3RoaXMkdGhyb3R0bGVFdmVudHNbRVJST1JTXSA9IGVycm9yLCBfdGhpcyR0aHJvdHRsZUV2ZW50cykpO1xuICB9O1xuXG4gIF9wcm90by5hZGRUcmFuc2FjdGlvbiA9IGZ1bmN0aW9uIGFkZFRyYW5zYWN0aW9uKHRyYW5zYWN0aW9uKSB7XG4gICAgdmFyIF90aGlzJHRocm90dGxlRXZlbnRzMjtcblxuICAgIHRoaXMudGhyb3R0bGVFdmVudHMoKF90aGlzJHRocm90dGxlRXZlbnRzMiA9IHt9LCBfdGhpcyR0aHJvdHRsZUV2ZW50czJbVFJBTlNBQ1RJT05TXSA9IHRyYW5zYWN0aW9uLCBfdGhpcyR0aHJvdHRsZUV2ZW50czIpKTtcbiAgfTtcblxuICBfcHJvdG8ubmRqc29uRXJyb3JzID0gZnVuY3Rpb24gbmRqc29uRXJyb3JzKGVycm9ycywgY29tcHJlc3MpIHtcbiAgICB2YXIga2V5ID0gY29tcHJlc3MgPyAnZScgOiAnZXJyb3InO1xuICAgIHJldHVybiBlcnJvcnMubWFwKGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgdmFyIF9OREpTT04kc3RyaW5naWZ5O1xuXG4gICAgICByZXR1cm4gTkRKU09OLnN0cmluZ2lmeSgoX05ESlNPTiRzdHJpbmdpZnkgPSB7fSwgX05ESlNPTiRzdHJpbmdpZnlba2V5XSA9IGNvbXByZXNzID8gY29tcHJlc3NFcnJvcihlcnJvcikgOiBlcnJvciwgX05ESlNPTiRzdHJpbmdpZnkpKTtcbiAgICB9KTtcbiAgfTtcblxuICBfcHJvdG8ubmRqc29uTWV0cmljc2V0cyA9IGZ1bmN0aW9uIG5kanNvbk1ldHJpY3NldHMobWV0cmljc2V0cykge1xuICAgIHJldHVybiBtZXRyaWNzZXRzLm1hcChmdW5jdGlvbiAobWV0cmljc2V0KSB7XG4gICAgICByZXR1cm4gTkRKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgIG1ldHJpY3NldDogbWV0cmljc2V0XG4gICAgICB9KTtcbiAgICB9KS5qb2luKCcnKTtcbiAgfTtcblxuICBfcHJvdG8ubmRqc29uVHJhbnNhY3Rpb25zID0gZnVuY3Rpb24gbmRqc29uVHJhbnNhY3Rpb25zKHRyYW5zYWN0aW9ucywgY29tcHJlc3MpIHtcbiAgICB2YXIgX3RoaXM0ID0gdGhpcztcblxuICAgIHZhciBrZXkgPSBjb21wcmVzcyA/ICd4JyA6ICd0cmFuc2FjdGlvbic7XG4gICAgcmV0dXJuIHRyYW5zYWN0aW9ucy5tYXAoZnVuY3Rpb24gKHRyKSB7XG4gICAgICB2YXIgX05ESlNPTiRzdHJpbmdpZnkyO1xuXG4gICAgICB2YXIgc3BhbnMgPSAnJyxcbiAgICAgICAgICBicmVha2Rvd25zID0gJyc7XG5cbiAgICAgIGlmICghY29tcHJlc3MpIHtcbiAgICAgICAgaWYgKHRyLnNwYW5zKSB7XG4gICAgICAgICAgc3BhbnMgPSB0ci5zcGFucy5tYXAoZnVuY3Rpb24gKHNwYW4pIHtcbiAgICAgICAgICAgIHJldHVybiBOREpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgc3Bhbjogc3BhblxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSkuam9pbignJyk7XG4gICAgICAgICAgZGVsZXRlIHRyLnNwYW5zO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRyLmJyZWFrZG93bikge1xuICAgICAgICAgIGJyZWFrZG93bnMgPSBfdGhpczQubmRqc29uTWV0cmljc2V0cyh0ci5icmVha2Rvd24pO1xuICAgICAgICAgIGRlbGV0ZSB0ci5icmVha2Rvd247XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIE5ESlNPTi5zdHJpbmdpZnkoKF9OREpTT04kc3RyaW5naWZ5MiA9IHt9LCBfTkRKU09OJHN0cmluZ2lmeTJba2V5XSA9IGNvbXByZXNzID8gY29tcHJlc3NUcmFuc2FjdGlvbih0cikgOiB0ciwgX05ESlNPTiRzdHJpbmdpZnkyKSkgKyBzcGFucyArIGJyZWFrZG93bnM7XG4gICAgfSk7XG4gIH07XG5cbiAgX3Byb3RvLnNlbmRFdmVudHMgPSBmdW5jdGlvbiBzZW5kRXZlbnRzKGV2ZW50cykge1xuICAgIHZhciBfcGF5bG9hZCwgX05ESlNPTiRzdHJpbmdpZnkzO1xuXG4gICAgaWYgKGV2ZW50cy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgdHJhbnNhY3Rpb25zID0gW107XG4gICAgdmFyIGVycm9ycyA9IFtdO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBldmVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBldmVudCA9IGV2ZW50c1tpXTtcblxuICAgICAgaWYgKGV2ZW50W1RSQU5TQUNUSU9OU10pIHtcbiAgICAgICAgdHJhbnNhY3Rpb25zLnB1c2goZXZlbnRbVFJBTlNBQ1RJT05TXSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChldmVudFtFUlJPUlNdKSB7XG4gICAgICAgIGVycm9ycy5wdXNoKGV2ZW50W0VSUk9SU10pO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0cmFuc2FjdGlvbnMubGVuZ3RoID09PSAwICYmIGVycm9ycy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgY2ZnID0gdGhpcy5fY29uZmlnU2VydmljZTtcbiAgICB2YXIgcGF5bG9hZCA9IChfcGF5bG9hZCA9IHt9LCBfcGF5bG9hZFtUUkFOU0FDVElPTlNdID0gdHJhbnNhY3Rpb25zLCBfcGF5bG9hZFtFUlJPUlNdID0gZXJyb3JzLCBfcGF5bG9hZCk7XG4gICAgdmFyIGZpbHRlcmVkUGF5bG9hZCA9IGNmZy5hcHBseUZpbHRlcnMocGF5bG9hZCk7XG5cbiAgICBpZiAoIWZpbHRlcmVkUGF5bG9hZCkge1xuICAgICAgdGhpcy5fbG9nZ2luZ1NlcnZpY2Uud2FybignRHJvcHBlZCBwYXlsb2FkIGR1ZSB0byBmaWx0ZXJpbmchJyk7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgYXBpVmVyc2lvbiA9IGNmZy5nZXQoJ2FwaVZlcnNpb24nKTtcbiAgICB2YXIgY29tcHJlc3MgPSBhcGlWZXJzaW9uID4gMjtcbiAgICB2YXIgbmRqc29uID0gW107XG4gICAgdmFyIG1ldGFkYXRhID0gdGhpcy5jcmVhdGVNZXRhRGF0YSgpO1xuICAgIHZhciBtZXRhZGF0YUtleSA9IGNvbXByZXNzID8gJ20nIDogJ21ldGFkYXRhJztcbiAgICBuZGpzb24ucHVzaChOREpTT04uc3RyaW5naWZ5KChfTkRKU09OJHN0cmluZ2lmeTMgPSB7fSwgX05ESlNPTiRzdHJpbmdpZnkzW21ldGFkYXRhS2V5XSA9IGNvbXByZXNzID8gY29tcHJlc3NNZXRhZGF0YShtZXRhZGF0YSkgOiBtZXRhZGF0YSwgX05ESlNPTiRzdHJpbmdpZnkzKSkpO1xuICAgIG5kanNvbiA9IG5kanNvbi5jb25jYXQodGhpcy5uZGpzb25FcnJvcnMoZmlsdGVyZWRQYXlsb2FkW0VSUk9SU10sIGNvbXByZXNzKSwgdGhpcy5uZGpzb25UcmFuc2FjdGlvbnMoZmlsdGVyZWRQYXlsb2FkW1RSQU5TQUNUSU9OU10sIGNvbXByZXNzKSk7XG4gICAgdmFyIG5kanNvblBheWxvYWQgPSBuZGpzb24uam9pbignJyk7XG5cbiAgICB2YXIgX3RoaXMkZ2V0RW5kcG9pbnRzMiA9IHRoaXMuZ2V0RW5kcG9pbnRzKCksXG4gICAgICAgIGludGFrZUVuZHBvaW50ID0gX3RoaXMkZ2V0RW5kcG9pbnRzMi5pbnRha2VFbmRwb2ludDtcblxuICAgIHJldHVybiB0aGlzLl9wb3N0SnNvbihpbnRha2VFbmRwb2ludCwgbmRqc29uUGF5bG9hZCk7XG4gIH07XG5cbiAgX3Byb3RvLmdldEVuZHBvaW50cyA9IGZ1bmN0aW9uIGdldEVuZHBvaW50cygpIHtcbiAgICB2YXIgc2VydmVyVXJsID0gdGhpcy5fY29uZmlnU2VydmljZS5nZXQoJ3NlcnZlclVybCcpO1xuXG4gICAgdmFyIGFwaVZlcnNpb24gPSB0aGlzLl9jb25maWdTZXJ2aWNlLmdldCgnYXBpVmVyc2lvbicpO1xuXG4gICAgdmFyIHNlcnZlclVybFByZWZpeCA9IHRoaXMuX2NvbmZpZ1NlcnZpY2UuZ2V0KCdzZXJ2ZXJVcmxQcmVmaXgnKSB8fCBcIi9pbnRha2UvdlwiICsgYXBpVmVyc2lvbiArIFwiL3J1bS9ldmVudHNcIjtcbiAgICB2YXIgaW50YWtlRW5kcG9pbnQgPSBzZXJ2ZXJVcmwgKyBzZXJ2ZXJVcmxQcmVmaXg7XG4gICAgdmFyIGNvbmZpZ0VuZHBvaW50ID0gc2VydmVyVXJsICsgXCIvY29uZmlnL3YxL3J1bS9hZ2VudHNcIjtcbiAgICByZXR1cm4ge1xuICAgICAgaW50YWtlRW5kcG9pbnQ6IGludGFrZUVuZHBvaW50LFxuICAgICAgY29uZmlnRW5kcG9pbnQ6IGNvbmZpZ0VuZHBvaW50XG4gICAgfTtcbiAgfTtcblxuICByZXR1cm4gQXBtU2VydmVyO1xufSgpO1xuXG5leHBvcnQgZGVmYXVsdCBBcG1TZXJ2ZXI7IiwiaW1wb3J0IHsgUHJvbWlzZSB9IGZyb20gJy4vcG9seWZpbGxzJztcbmltcG9ydCB7IE5BVklHQVRJT05fVElNSU5HX01BUktTLCBDT01QUkVTU0VEX05BVl9USU1JTkdfTUFSS1MgfSBmcm9tICcuLi9wZXJmb3JtYW5jZS1tb25pdG9yaW5nL25hdmlnYXRpb24vbWFya3MnO1xuaW1wb3J0IHsgaXNCZWFjb25JbnNwZWN0aW9uRW5hYmxlZCB9IGZyb20gJy4vdXRpbHMnO1xuXG5mdW5jdGlvbiBjb21wcmVzc1N0YWNrRnJhbWVzKGZyYW1lcykge1xuICByZXR1cm4gZnJhbWVzLm1hcChmdW5jdGlvbiAoZnJhbWUpIHtcbiAgICByZXR1cm4ge1xuICAgICAgYXA6IGZyYW1lLmFic19wYXRoLFxuICAgICAgZjogZnJhbWUuZmlsZW5hbWUsXG4gICAgICBmbjogZnJhbWUuZnVuY3Rpb24sXG4gICAgICBsaTogZnJhbWUubGluZW5vLFxuICAgICAgY286IGZyYW1lLmNvbG5vXG4gICAgfTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGNvbXByZXNzUmVzcG9uc2UocmVzcG9uc2UpIHtcbiAgcmV0dXJuIHtcbiAgICB0czogcmVzcG9uc2UudHJhbnNmZXJfc2l6ZSxcbiAgICBlYnM6IHJlc3BvbnNlLmVuY29kZWRfYm9keV9zaXplLFxuICAgIGRiczogcmVzcG9uc2UuZGVjb2RlZF9ib2R5X3NpemVcbiAgfTtcbn1cblxuZnVuY3Rpb24gY29tcHJlc3NIVFRQKGh0dHApIHtcbiAgdmFyIGNvbXByZXNzZWQgPSB7fTtcbiAgdmFyIG1ldGhvZCA9IGh0dHAubWV0aG9kLFxuICAgICAgc3RhdHVzX2NvZGUgPSBodHRwLnN0YXR1c19jb2RlLFxuICAgICAgdXJsID0gaHR0cC51cmwsXG4gICAgICByZXNwb25zZSA9IGh0dHAucmVzcG9uc2U7XG4gIGNvbXByZXNzZWQudXJsID0gdXJsO1xuXG4gIGlmIChtZXRob2QpIHtcbiAgICBjb21wcmVzc2VkLm10ID0gbWV0aG9kO1xuICB9XG5cbiAgaWYgKHN0YXR1c19jb2RlKSB7XG4gICAgY29tcHJlc3NlZC5zYyA9IHN0YXR1c19jb2RlO1xuICB9XG5cbiAgaWYgKHJlc3BvbnNlKSB7XG4gICAgY29tcHJlc3NlZC5yID0gY29tcHJlc3NSZXNwb25zZShyZXNwb25zZSk7XG4gIH1cblxuICByZXR1cm4gY29tcHJlc3NlZDtcbn1cblxuZnVuY3Rpb24gY29tcHJlc3NDb250ZXh0KGNvbnRleHQpIHtcbiAgaWYgKCFjb250ZXh0KSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICB2YXIgY29tcHJlc3NlZCA9IHt9O1xuICB2YXIgcGFnZSA9IGNvbnRleHQucGFnZSxcbiAgICAgIGh0dHAgPSBjb250ZXh0Lmh0dHAsXG4gICAgICByZXNwb25zZSA9IGNvbnRleHQucmVzcG9uc2UsXG4gICAgICBkZXN0aW5hdGlvbiA9IGNvbnRleHQuZGVzdGluYXRpb24sXG4gICAgICB1c2VyID0gY29udGV4dC51c2VyLFxuICAgICAgY3VzdG9tID0gY29udGV4dC5jdXN0b207XG5cbiAgaWYgKHBhZ2UpIHtcbiAgICBjb21wcmVzc2VkLnAgPSB7XG4gICAgICByZjogcGFnZS5yZWZlcmVyLFxuICAgICAgdXJsOiBwYWdlLnVybFxuICAgIH07XG4gIH1cblxuICBpZiAoaHR0cCkge1xuICAgIGNvbXByZXNzZWQuaCA9IGNvbXByZXNzSFRUUChodHRwKTtcbiAgfVxuXG4gIGlmIChyZXNwb25zZSkge1xuICAgIGNvbXByZXNzZWQuciA9IGNvbXByZXNzUmVzcG9uc2UocmVzcG9uc2UpO1xuICB9XG5cbiAgaWYgKGRlc3RpbmF0aW9uKSB7XG4gICAgdmFyIHNlcnZpY2UgPSBkZXN0aW5hdGlvbi5zZXJ2aWNlO1xuICAgIGNvbXByZXNzZWQuZHQgPSB7XG4gICAgICBzZToge1xuICAgICAgICBuOiBzZXJ2aWNlLm5hbWUsXG4gICAgICAgIHQ6IHNlcnZpY2UudHlwZSxcbiAgICAgICAgcmM6IHNlcnZpY2UucmVzb3VyY2VcbiAgICAgIH0sXG4gICAgICBhZDogZGVzdGluYXRpb24uYWRkcmVzcyxcbiAgICAgIHBvOiBkZXN0aW5hdGlvbi5wb3J0XG4gICAgfTtcbiAgfVxuXG4gIGlmICh1c2VyKSB7XG4gICAgY29tcHJlc3NlZC51ID0ge1xuICAgICAgaWQ6IHVzZXIuaWQsXG4gICAgICB1bjogdXNlci51c2VybmFtZSxcbiAgICAgIGVtOiB1c2VyLmVtYWlsXG4gICAgfTtcbiAgfVxuXG4gIGlmIChjdXN0b20pIHtcbiAgICBjb21wcmVzc2VkLmN1ID0gY3VzdG9tO1xuICB9XG5cbiAgcmV0dXJuIGNvbXByZXNzZWQ7XG59XG5cbmZ1bmN0aW9uIGNvbXByZXNzTWFya3MobWFya3MpIHtcbiAgaWYgKCFtYXJrcykge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgdmFyIGNvbXByZXNzZWROdE1hcmtzID0gY29tcHJlc3NOYXZpZ2F0aW9uVGltaW5nTWFya3MobWFya3MubmF2aWdhdGlvblRpbWluZyk7XG4gIHZhciBjb21wcmVzc2VkID0ge1xuICAgIG50OiBjb21wcmVzc2VkTnRNYXJrcyxcbiAgICBhOiBjb21wcmVzc0FnZW50TWFya3MoY29tcHJlc3NlZE50TWFya3MsIG1hcmtzLmFnZW50KVxuICB9O1xuICByZXR1cm4gY29tcHJlc3NlZDtcbn1cblxuZnVuY3Rpb24gY29tcHJlc3NOYXZpZ2F0aW9uVGltaW5nTWFya3MobnRNYXJrcykge1xuICBpZiAoIW50TWFya3MpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHZhciBjb21wcmVzc2VkID0ge307XG4gIENPTVBSRVNTRURfTkFWX1RJTUlOR19NQVJLUy5mb3JFYWNoKGZ1bmN0aW9uIChtYXJrLCBpbmRleCkge1xuICAgIHZhciBtYXBwaW5nID0gTkFWSUdBVElPTl9USU1JTkdfTUFSS1NbaW5kZXhdO1xuICAgIGNvbXByZXNzZWRbbWFya10gPSBudE1hcmtzW21hcHBpbmddO1xuICB9KTtcbiAgcmV0dXJuIGNvbXByZXNzZWQ7XG59XG5cbmZ1bmN0aW9uIGNvbXByZXNzQWdlbnRNYXJrcyhjb21wcmVzc2VkTnRNYXJrcywgYWdlbnRNYXJrcykge1xuICB2YXIgY29tcHJlc3NlZCA9IHt9O1xuXG4gIGlmIChjb21wcmVzc2VkTnRNYXJrcykge1xuICAgIGNvbXByZXNzZWQgPSB7XG4gICAgICBmYjogY29tcHJlc3NlZE50TWFya3MucnMsXG4gICAgICBkaTogY29tcHJlc3NlZE50TWFya3MuZGksXG4gICAgICBkYzogY29tcHJlc3NlZE50TWFya3MuZGNcbiAgICB9O1xuICB9XG5cbiAgaWYgKGFnZW50TWFya3MpIHtcbiAgICB2YXIgZnAgPSBhZ2VudE1hcmtzLmZpcnN0Q29udGVudGZ1bFBhaW50O1xuICAgIHZhciBscCA9IGFnZW50TWFya3MubGFyZ2VzdENvbnRlbnRmdWxQYWludDtcblxuICAgIGlmIChmcCkge1xuICAgICAgY29tcHJlc3NlZC5mcCA9IGZwO1xuICAgIH1cblxuICAgIGlmIChscCkge1xuICAgICAgY29tcHJlc3NlZC5scCA9IGxwO1xuICAgIH1cbiAgfVxuXG4gIGlmIChPYmplY3Qua2V5cyhjb21wcmVzc2VkKS5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHJldHVybiBjb21wcmVzc2VkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY29tcHJlc3NNZXRhZGF0YShtZXRhZGF0YSkge1xuICB2YXIgc2VydmljZSA9IG1ldGFkYXRhLnNlcnZpY2UsXG4gICAgICBsYWJlbHMgPSBtZXRhZGF0YS5sYWJlbHM7XG4gIHZhciBhZ2VudCA9IHNlcnZpY2UuYWdlbnQsXG4gICAgICBsYW5ndWFnZSA9IHNlcnZpY2UubGFuZ3VhZ2U7XG4gIHJldHVybiB7XG4gICAgc2U6IHtcbiAgICAgIG46IHNlcnZpY2UubmFtZSxcbiAgICAgIHZlOiBzZXJ2aWNlLnZlcnNpb24sXG4gICAgICBhOiB7XG4gICAgICAgIG46IGFnZW50Lm5hbWUsXG4gICAgICAgIHZlOiBhZ2VudC52ZXJzaW9uXG4gICAgICB9LFxuICAgICAgbGE6IHtcbiAgICAgICAgbjogbGFuZ3VhZ2UubmFtZVxuICAgICAgfSxcbiAgICAgIGVuOiBzZXJ2aWNlLmVudmlyb25tZW50XG4gICAgfSxcbiAgICBsOiBsYWJlbHNcbiAgfTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBjb21wcmVzc1RyYW5zYWN0aW9uKHRyYW5zYWN0aW9uKSB7XG4gIHZhciBzcGFucyA9IHRyYW5zYWN0aW9uLnNwYW5zLm1hcChmdW5jdGlvbiAoc3Bhbikge1xuICAgIHZhciBzcGFuRGF0YSA9IHtcbiAgICAgIGlkOiBzcGFuLmlkLFxuICAgICAgbjogc3Bhbi5uYW1lLFxuICAgICAgdDogc3Bhbi50eXBlLFxuICAgICAgczogc3Bhbi5zdGFydCxcbiAgICAgIGQ6IHNwYW4uZHVyYXRpb24sXG4gICAgICBjOiBjb21wcmVzc0NvbnRleHQoc3Bhbi5jb250ZXh0KSxcbiAgICAgIG86IHNwYW4ub3V0Y29tZSxcbiAgICAgIHNyOiBzcGFuLnNhbXBsZV9yYXRlXG4gICAgfTtcblxuICAgIGlmIChzcGFuLnBhcmVudF9pZCAhPT0gdHJhbnNhY3Rpb24uaWQpIHtcbiAgICAgIHNwYW5EYXRhLnBpZCA9IHNwYW4ucGFyZW50X2lkO1xuICAgIH1cblxuICAgIGlmIChzcGFuLnN5bmMgPT09IHRydWUpIHtcbiAgICAgIHNwYW5EYXRhLnN5ID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoc3Bhbi5zdWJ0eXBlKSB7XG4gICAgICBzcGFuRGF0YS5zdSA9IHNwYW4uc3VidHlwZTtcbiAgICB9XG5cbiAgICBpZiAoc3Bhbi5hY3Rpb24pIHtcbiAgICAgIHNwYW5EYXRhLmFjID0gc3Bhbi5hY3Rpb247XG4gICAgfVxuXG4gICAgcmV0dXJuIHNwYW5EYXRhO1xuICB9KTtcbiAgdmFyIHRyID0ge1xuICAgIGlkOiB0cmFuc2FjdGlvbi5pZCxcbiAgICB0aWQ6IHRyYW5zYWN0aW9uLnRyYWNlX2lkLFxuICAgIG46IHRyYW5zYWN0aW9uLm5hbWUsXG4gICAgdDogdHJhbnNhY3Rpb24udHlwZSxcbiAgICBkOiB0cmFuc2FjdGlvbi5kdXJhdGlvbixcbiAgICBjOiBjb21wcmVzc0NvbnRleHQodHJhbnNhY3Rpb24uY29udGV4dCksXG4gICAgazogY29tcHJlc3NNYXJrcyh0cmFuc2FjdGlvbi5tYXJrcyksXG4gICAgbWU6IGNvbXByZXNzTWV0cmljc2V0cyh0cmFuc2FjdGlvbi5icmVha2Rvd24pLFxuICAgIHk6IHNwYW5zLFxuICAgIHljOiB7XG4gICAgICBzZDogc3BhbnMubGVuZ3RoXG4gICAgfSxcbiAgICBzbTogdHJhbnNhY3Rpb24uc2FtcGxlZCxcbiAgICBzcjogdHJhbnNhY3Rpb24uc2FtcGxlX3JhdGUsXG4gICAgbzogdHJhbnNhY3Rpb24ub3V0Y29tZVxuICB9O1xuXG4gIGlmICh0cmFuc2FjdGlvbi5leHBlcmllbmNlKSB7XG4gICAgdmFyIF90cmFuc2FjdGlvbiRleHBlcmllbiA9IHRyYW5zYWN0aW9uLmV4cGVyaWVuY2UsXG4gICAgICAgIGNscyA9IF90cmFuc2FjdGlvbiRleHBlcmllbi5jbHMsXG4gICAgICAgIGZpZCA9IF90cmFuc2FjdGlvbiRleHBlcmllbi5maWQsXG4gICAgICAgIHRidCA9IF90cmFuc2FjdGlvbiRleHBlcmllbi50YnQsXG4gICAgICAgIGxvbmd0YXNrID0gX3RyYW5zYWN0aW9uJGV4cGVyaWVuLmxvbmd0YXNrO1xuICAgIHRyLmV4cCA9IHtcbiAgICAgIGNsczogY2xzLFxuICAgICAgZmlkOiBmaWQsXG4gICAgICB0YnQ6IHRidCxcbiAgICAgIGx0OiBsb25ndGFza1xuICAgIH07XG4gIH1cblxuICBpZiAodHJhbnNhY3Rpb24uc2Vzc2lvbikge1xuICAgIHZhciBfdHJhbnNhY3Rpb24kc2Vzc2lvbiA9IHRyYW5zYWN0aW9uLnNlc3Npb24sXG4gICAgICAgIGlkID0gX3RyYW5zYWN0aW9uJHNlc3Npb24uaWQsXG4gICAgICAgIHNlcXVlbmNlID0gX3RyYW5zYWN0aW9uJHNlc3Npb24uc2VxdWVuY2U7XG4gICAgdHIuc2VzID0ge1xuICAgICAgaWQ6IGlkLFxuICAgICAgc2VxOiBzZXF1ZW5jZVxuICAgIH07XG4gIH1cblxuICByZXR1cm4gdHI7XG59XG5leHBvcnQgZnVuY3Rpb24gY29tcHJlc3NFcnJvcihlcnJvcikge1xuICB2YXIgZXhjZXB0aW9uID0gZXJyb3IuZXhjZXB0aW9uO1xuICB2YXIgY29tcHJlc3NlZCA9IHtcbiAgICBpZDogZXJyb3IuaWQsXG4gICAgY2w6IGVycm9yLmN1bHByaXQsXG4gICAgZXg6IHtcbiAgICAgIG1nOiBleGNlcHRpb24ubWVzc2FnZSxcbiAgICAgIHN0OiBjb21wcmVzc1N0YWNrRnJhbWVzKGV4Y2VwdGlvbi5zdGFja3RyYWNlKSxcbiAgICAgIHQ6IGVycm9yLnR5cGVcbiAgICB9LFxuICAgIGM6IGNvbXByZXNzQ29udGV4dChlcnJvci5jb250ZXh0KVxuICB9O1xuICB2YXIgdHJhbnNhY3Rpb24gPSBlcnJvci50cmFuc2FjdGlvbjtcblxuICBpZiAodHJhbnNhY3Rpb24pIHtcbiAgICBjb21wcmVzc2VkLnRpZCA9IGVycm9yLnRyYWNlX2lkO1xuICAgIGNvbXByZXNzZWQucGlkID0gZXJyb3IucGFyZW50X2lkO1xuICAgIGNvbXByZXNzZWQueGlkID0gZXJyb3IudHJhbnNhY3Rpb25faWQ7XG4gICAgY29tcHJlc3NlZC54ID0ge1xuICAgICAgdDogdHJhbnNhY3Rpb24udHlwZSxcbiAgICAgIHNtOiB0cmFuc2FjdGlvbi5zYW1wbGVkXG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiBjb21wcmVzc2VkO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGNvbXByZXNzTWV0cmljc2V0cyhicmVha2Rvd25zKSB7XG4gIHJldHVybiBicmVha2Rvd25zLm1hcChmdW5jdGlvbiAoX3JlZikge1xuICAgIHZhciBzcGFuID0gX3JlZi5zcGFuLFxuICAgICAgICBzYW1wbGVzID0gX3JlZi5zYW1wbGVzO1xuICAgIHJldHVybiB7XG4gICAgICB5OiB7XG4gICAgICAgIHQ6IHNwYW4udHlwZVxuICAgICAgfSxcbiAgICAgIHNhOiB7XG4gICAgICAgIHlzYzoge1xuICAgICAgICAgIHY6IHNhbXBsZXNbJ3NwYW4uc2VsZl90aW1lLmNvdW50J10udmFsdWVcbiAgICAgICAgfSxcbiAgICAgICAgeXNzOiB7XG4gICAgICAgICAgdjogc2FtcGxlc1snc3Bhbi5zZWxmX3RpbWUuc3VtLnVzJ10udmFsdWVcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gIH0pO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGNvbXByZXNzUGF5bG9hZChwYXJhbXMsIHR5cGUpIHtcbiAgaWYgKHR5cGUgPT09IHZvaWQgMCkge1xuICAgIHR5cGUgPSAnZ3ppcCc7XG4gIH1cblxuICB2YXIgaXNDb21wcmVzc2lvblN0cmVhbVN1cHBvcnRlZCA9IHR5cGVvZiBDb21wcmVzc2lvblN0cmVhbSA9PT0gJ2Z1bmN0aW9uJztcbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlKSB7XG4gICAgaWYgKCFpc0NvbXByZXNzaW9uU3RyZWFtU3VwcG9ydGVkKSB7XG4gICAgICByZXR1cm4gcmVzb2x2ZShwYXJhbXMpO1xuICAgIH1cblxuICAgIGlmIChpc0JlYWNvbkluc3BlY3Rpb25FbmFibGVkKCkpIHtcbiAgICAgIHJldHVybiByZXNvbHZlKHBhcmFtcyk7XG4gICAgfVxuXG4gICAgdmFyIHBheWxvYWQgPSBwYXJhbXMucGF5bG9hZCxcbiAgICAgICAgaGVhZGVycyA9IHBhcmFtcy5oZWFkZXJzLFxuICAgICAgICBiZWZvcmVTZW5kID0gcGFyYW1zLmJlZm9yZVNlbmQ7XG4gICAgdmFyIHBheWxvYWRTdHJlYW0gPSBuZXcgQmxvYihbcGF5bG9hZF0pLnN0cmVhbSgpO1xuICAgIHZhciBjb21wcmVzc2VkU3RyZWFtID0gcGF5bG9hZFN0cmVhbS5waXBlVGhyb3VnaChuZXcgQ29tcHJlc3Npb25TdHJlYW0odHlwZSkpO1xuICAgIHJldHVybiBuZXcgUmVzcG9uc2UoY29tcHJlc3NlZFN0cmVhbSkuYmxvYigpLnRoZW4oZnVuY3Rpb24gKHBheWxvYWQpIHtcbiAgICAgIGhlYWRlcnNbJ0NvbnRlbnQtRW5jb2RpbmcnXSA9IHR5cGU7XG4gICAgICByZXR1cm4gcmVzb2x2ZSh7XG4gICAgICAgIHBheWxvYWQ6IHBheWxvYWQsXG4gICAgICAgIGhlYWRlcnM6IGhlYWRlcnMsXG4gICAgICAgIGJlZm9yZVNlbmQ6IGJlZm9yZVNlbmRcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbn0iLCJmdW5jdGlvbiBfZXh0ZW5kcygpIHsgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9OyByZXR1cm4gX2V4dGVuZHMuYXBwbHkodGhpcywgYXJndW1lbnRzKTsgfVxuXG5pbXBvcnQgeyBnZXRDdXJyZW50U2NyaXB0LCBzZXRMYWJlbCwgbWVyZ2UsIGV4dGVuZCwgaXNVbmRlZmluZWQgfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCBFdmVudEhhbmRsZXIgZnJvbSAnLi9ldmVudC1oYW5kbGVyJztcbmltcG9ydCB7IENPTkZJR19DSEFOR0UsIExPQ0FMX0NPTkZJR19LRVkgfSBmcm9tICcuL2NvbnN0YW50cyc7XG5cbmZ1bmN0aW9uIGdldENvbmZpZ0Zyb21TY3JpcHQoKSB7XG4gIHZhciBzY3JpcHQgPSBnZXRDdXJyZW50U2NyaXB0KCk7XG4gIHZhciBjb25maWcgPSBnZXREYXRhQXR0cmlidXRlc0Zyb21Ob2RlKHNjcmlwdCk7XG4gIHJldHVybiBjb25maWc7XG59XG5cbmZ1bmN0aW9uIGdldERhdGFBdHRyaWJ1dGVzRnJvbU5vZGUobm9kZSkge1xuICBpZiAoIW5vZGUpIHtcbiAgICByZXR1cm4ge307XG4gIH1cblxuICB2YXIgZGF0YUF0dHJzID0ge307XG4gIHZhciBkYXRhUmVnZXggPSAvXmRhdGEtKFtcXHctXSspJC87XG4gIHZhciBhdHRycyA9IG5vZGUuYXR0cmlidXRlcztcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGF0dHJzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGF0dHIgPSBhdHRyc1tpXTtcblxuICAgIGlmIChkYXRhUmVnZXgudGVzdChhdHRyLm5vZGVOYW1lKSkge1xuICAgICAgdmFyIGtleSA9IGF0dHIubm9kZU5hbWUubWF0Y2goZGF0YVJlZ2V4KVsxXTtcbiAgICAgIHZhciBjYW1lbENhc2Vka2V5ID0ga2V5LnNwbGl0KCctJykubWFwKGZ1bmN0aW9uICh2YWx1ZSwgaW5kZXgpIHtcbiAgICAgICAgcmV0dXJuIGluZGV4ID4gMCA/IHZhbHVlLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgdmFsdWUuc3Vic3RyaW5nKDEpIDogdmFsdWU7XG4gICAgICB9KS5qb2luKCcnKTtcbiAgICAgIGRhdGFBdHRyc1tjYW1lbENhc2Vka2V5XSA9IGF0dHIudmFsdWUgfHwgYXR0ci5ub2RlVmFsdWU7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGRhdGFBdHRycztcbn1cblxudmFyIENvbmZpZyA9IGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gQ29uZmlnKCkge1xuICAgIHRoaXMuY29uZmlnID0ge1xuICAgICAgc2VydmljZU5hbWU6ICcnLFxuICAgICAgc2VydmljZVZlcnNpb246ICcnLFxuICAgICAgZW52aXJvbm1lbnQ6ICcnLFxuICAgICAgc2VydmVyVXJsOiAnaHR0cDovL2xvY2FsaG9zdDo4MjAwJyxcbiAgICAgIHNlcnZlclVybFByZWZpeDogJycsXG4gICAgICBhY3RpdmU6IHRydWUsXG4gICAgICBpbnN0cnVtZW50OiB0cnVlLFxuICAgICAgZGlzYWJsZUluc3RydW1lbnRhdGlvbnM6IFtdLFxuICAgICAgbG9nTGV2ZWw6ICd3YXJuJyxcbiAgICAgIGJyZWFrZG93bk1ldHJpY3M6IGZhbHNlLFxuICAgICAgaWdub3JlVHJhbnNhY3Rpb25zOiBbXSxcbiAgICAgIGV2ZW50c0xpbWl0OiA4MCxcbiAgICAgIHF1ZXVlTGltaXQ6IC0xLFxuICAgICAgZmx1c2hJbnRlcnZhbDogNTAwLFxuICAgICAgZGlzdHJpYnV0ZWRUcmFjaW5nOiB0cnVlLFxuICAgICAgZGlzdHJpYnV0ZWRUcmFjaW5nT3JpZ2luczogW10sXG4gICAgICBkaXN0cmlidXRlZFRyYWNpbmdIZWFkZXJOYW1lOiAndHJhY2VwYXJlbnQnLFxuICAgICAgcGFnZUxvYWRUcmFjZUlkOiAnJyxcbiAgICAgIHBhZ2VMb2FkU3BhbklkOiAnJyxcbiAgICAgIHBhZ2VMb2FkU2FtcGxlZDogZmFsc2UsXG4gICAgICBwYWdlTG9hZFRyYW5zYWN0aW9uTmFtZTogJycsXG4gICAgICBwcm9wYWdhdGVUcmFjZXN0YXRlOiBmYWxzZSxcbiAgICAgIHRyYW5zYWN0aW9uU2FtcGxlUmF0ZTogMS4wLFxuICAgICAgY2VudHJhbENvbmZpZzogZmFsc2UsXG4gICAgICBtb25pdG9yTG9uZ3Rhc2tzOiB0cnVlLFxuICAgICAgYXBpVmVyc2lvbjogMixcbiAgICAgIGNvbnRleHQ6IHt9LFxuICAgICAgc2Vzc2lvbjogZmFsc2UsXG4gICAgICBhcG1SZXF1ZXN0OiBudWxsLFxuICAgICAgc2VuZENyZWRlbnRpYWxzOiBmYWxzZVxuICAgIH07XG4gICAgdGhpcy5ldmVudHMgPSBuZXcgRXZlbnRIYW5kbGVyKCk7XG4gICAgdGhpcy5maWx0ZXJzID0gW107XG4gICAgdGhpcy52ZXJzaW9uID0gJyc7XG4gIH1cblxuICB2YXIgX3Byb3RvID0gQ29uZmlnLnByb3RvdHlwZTtcblxuICBfcHJvdG8uaW5pdCA9IGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgdmFyIHNjcmlwdERhdGEgPSBnZXRDb25maWdGcm9tU2NyaXB0KCk7XG4gICAgdGhpcy5zZXRDb25maWcoc2NyaXB0RGF0YSk7XG4gIH07XG5cbiAgX3Byb3RvLnNldFZlcnNpb24gPSBmdW5jdGlvbiBzZXRWZXJzaW9uKHZlcnNpb24pIHtcbiAgICB0aGlzLnZlcnNpb24gPSB2ZXJzaW9uO1xuICB9O1xuXG4gIF9wcm90by5hZGRGaWx0ZXIgPSBmdW5jdGlvbiBhZGRGaWx0ZXIoY2IpIHtcbiAgICBpZiAodHlwZW9mIGNiICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0FyZ3VtZW50IHRvIG11c3QgYmUgZnVuY3Rpb24nKTtcbiAgICB9XG5cbiAgICB0aGlzLmZpbHRlcnMucHVzaChjYik7XG4gIH07XG5cbiAgX3Byb3RvLmFwcGx5RmlsdGVycyA9IGZ1bmN0aW9uIGFwcGx5RmlsdGVycyhkYXRhKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmZpbHRlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGRhdGEgPSB0aGlzLmZpbHRlcnNbaV0oZGF0YSk7XG5cbiAgICAgIGlmICghZGF0YSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGRhdGE7XG4gIH07XG5cbiAgX3Byb3RvLmdldCA9IGZ1bmN0aW9uIGdldChrZXkpIHtcbiAgICByZXR1cm4ga2V5LnNwbGl0KCcuJykucmVkdWNlKGZ1bmN0aW9uIChvYmosIG9iaktleSkge1xuICAgICAgcmV0dXJuIG9iaiAmJiBvYmpbb2JqS2V5XTtcbiAgICB9LCB0aGlzLmNvbmZpZyk7XG4gIH07XG5cbiAgX3Byb3RvLnNldFVzZXJDb250ZXh0ID0gZnVuY3Rpb24gc2V0VXNlckNvbnRleHQodXNlckNvbnRleHQpIHtcbiAgICBpZiAodXNlckNvbnRleHQgPT09IHZvaWQgMCkge1xuICAgICAgdXNlckNvbnRleHQgPSB7fTtcbiAgICB9XG5cbiAgICB2YXIgY29udGV4dCA9IHt9O1xuICAgIHZhciBfdXNlckNvbnRleHQgPSB1c2VyQ29udGV4dCxcbiAgICAgICAgaWQgPSBfdXNlckNvbnRleHQuaWQsXG4gICAgICAgIHVzZXJuYW1lID0gX3VzZXJDb250ZXh0LnVzZXJuYW1lLFxuICAgICAgICBlbWFpbCA9IF91c2VyQ29udGV4dC5lbWFpbDtcblxuICAgIGlmICh0eXBlb2YgaWQgPT09ICdudW1iZXInIHx8IHR5cGVvZiBpZCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGNvbnRleHQuaWQgPSBpZDtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHVzZXJuYW1lID09PSAnc3RyaW5nJykge1xuICAgICAgY29udGV4dC51c2VybmFtZSA9IHVzZXJuYW1lO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgZW1haWwgPT09ICdzdHJpbmcnKSB7XG4gICAgICBjb250ZXh0LmVtYWlsID0gZW1haWw7XG4gICAgfVxuXG4gICAgdGhpcy5jb25maWcuY29udGV4dC51c2VyID0gZXh0ZW5kKHRoaXMuY29uZmlnLmNvbnRleHQudXNlciB8fCB7fSwgY29udGV4dCk7XG4gIH07XG5cbiAgX3Byb3RvLnNldEN1c3RvbUNvbnRleHQgPSBmdW5jdGlvbiBzZXRDdXN0b21Db250ZXh0KGN1c3RvbUNvbnRleHQpIHtcbiAgICBpZiAoY3VzdG9tQ29udGV4dCA9PT0gdm9pZCAwKSB7XG4gICAgICBjdXN0b21Db250ZXh0ID0ge307XG4gICAgfVxuXG4gICAgdGhpcy5jb25maWcuY29udGV4dC5jdXN0b20gPSBleHRlbmQodGhpcy5jb25maWcuY29udGV4dC5jdXN0b20gfHwge30sIGN1c3RvbUNvbnRleHQpO1xuICB9O1xuXG4gIF9wcm90by5hZGRMYWJlbHMgPSBmdW5jdGlvbiBhZGRMYWJlbHModGFncykge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICBpZiAoIXRoaXMuY29uZmlnLmNvbnRleHQudGFncykge1xuICAgICAgdGhpcy5jb25maWcuY29udGV4dC50YWdzID0ge307XG4gICAgfVxuXG4gICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyh0YWdzKTtcbiAgICBrZXlzLmZvckVhY2goZnVuY3Rpb24gKGspIHtcbiAgICAgIHJldHVybiBzZXRMYWJlbChrLCB0YWdzW2tdLCBfdGhpcy5jb25maWcuY29udGV4dC50YWdzKTtcbiAgICB9KTtcbiAgfTtcblxuICBfcHJvdG8uc2V0Q29uZmlnID0gZnVuY3Rpb24gc2V0Q29uZmlnKHByb3BlcnRpZXMpIHtcbiAgICBpZiAocHJvcGVydGllcyA9PT0gdm9pZCAwKSB7XG4gICAgICBwcm9wZXJ0aWVzID0ge307XG4gICAgfVxuXG4gICAgdmFyIF9wcm9wZXJ0aWVzID0gcHJvcGVydGllcyxcbiAgICAgICAgdHJhbnNhY3Rpb25TYW1wbGVSYXRlID0gX3Byb3BlcnRpZXMudHJhbnNhY3Rpb25TYW1wbGVSYXRlLFxuICAgICAgICBzZXJ2ZXJVcmwgPSBfcHJvcGVydGllcy5zZXJ2ZXJVcmw7XG5cbiAgICBpZiAoc2VydmVyVXJsKSB7XG4gICAgICBwcm9wZXJ0aWVzLnNlcnZlclVybCA9IHNlcnZlclVybC5yZXBsYWNlKC9cXC8rJC8sICcnKTtcbiAgICB9XG5cbiAgICBpZiAoIWlzVW5kZWZpbmVkKHRyYW5zYWN0aW9uU2FtcGxlUmF0ZSkpIHtcbiAgICAgIGlmICh0cmFuc2FjdGlvblNhbXBsZVJhdGUgPCAwLjAwMDEgJiYgdHJhbnNhY3Rpb25TYW1wbGVSYXRlID4gMCkge1xuICAgICAgICB0cmFuc2FjdGlvblNhbXBsZVJhdGUgPSAwLjAwMDE7XG4gICAgICB9XG5cbiAgICAgIHByb3BlcnRpZXMudHJhbnNhY3Rpb25TYW1wbGVSYXRlID0gTWF0aC5yb3VuZCh0cmFuc2FjdGlvblNhbXBsZVJhdGUgKiAxMDAwMCkgLyAxMDAwMDtcbiAgICB9XG5cbiAgICBtZXJnZSh0aGlzLmNvbmZpZywgcHJvcGVydGllcyk7XG4gICAgdGhpcy5ldmVudHMuc2VuZChDT05GSUdfQ0hBTkdFLCBbdGhpcy5jb25maWddKTtcbiAgfTtcblxuICBfcHJvdG8udmFsaWRhdGUgPSBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wZXJ0aWVzKSB7XG4gICAgaWYgKHByb3BlcnRpZXMgPT09IHZvaWQgMCkge1xuICAgICAgcHJvcGVydGllcyA9IHt9O1xuICAgIH1cblxuICAgIHZhciByZXF1aXJlZEtleXMgPSBbJ3NlcnZpY2VOYW1lJywgJ3NlcnZlclVybCddO1xuICAgIHZhciBhbGxLZXlzID0gT2JqZWN0LmtleXModGhpcy5jb25maWcpO1xuICAgIHZhciBlcnJvcnMgPSB7XG4gICAgICBtaXNzaW5nOiBbXSxcbiAgICAgIGludmFsaWQ6IFtdLFxuICAgICAgdW5rbm93bjogW11cbiAgICB9O1xuICAgIE9iamVjdC5rZXlzKHByb3BlcnRpZXMpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgaWYgKHJlcXVpcmVkS2V5cy5pbmRleE9mKGtleSkgIT09IC0xICYmICFwcm9wZXJ0aWVzW2tleV0pIHtcbiAgICAgICAgZXJyb3JzLm1pc3NpbmcucHVzaChrZXkpO1xuICAgICAgfVxuXG4gICAgICBpZiAoYWxsS2V5cy5pbmRleE9mKGtleSkgPT09IC0xKSB7XG4gICAgICAgIGVycm9ycy51bmtub3duLnB1c2goa2V5KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmIChwcm9wZXJ0aWVzLnNlcnZpY2VOYW1lICYmICEvXlthLXpBLVowLTkgXy1dKyQvLnRlc3QocHJvcGVydGllcy5zZXJ2aWNlTmFtZSkpIHtcbiAgICAgIGVycm9ycy5pbnZhbGlkLnB1c2goe1xuICAgICAgICBrZXk6ICdzZXJ2aWNlTmFtZScsXG4gICAgICAgIHZhbHVlOiBwcm9wZXJ0aWVzLnNlcnZpY2VOYW1lLFxuICAgICAgICBhbGxvd2VkOiAnYS16LCBBLVosIDAtOSwgXywgLSwgPHNwYWNlPidcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHZhciBzYW1wbGVSYXRlID0gcHJvcGVydGllcy50cmFuc2FjdGlvblNhbXBsZVJhdGU7XG5cbiAgICBpZiAodHlwZW9mIHNhbXBsZVJhdGUgIT09ICd1bmRlZmluZWQnICYmICh0eXBlb2Ygc2FtcGxlUmF0ZSAhPT0gJ251bWJlcicgfHwgaXNOYU4oc2FtcGxlUmF0ZSkgfHwgc2FtcGxlUmF0ZSA8IDAgfHwgc2FtcGxlUmF0ZSA+IDEpKSB7XG4gICAgICBlcnJvcnMuaW52YWxpZC5wdXNoKHtcbiAgICAgICAga2V5OiAndHJhbnNhY3Rpb25TYW1wbGVSYXRlJyxcbiAgICAgICAgdmFsdWU6IHNhbXBsZVJhdGUsXG4gICAgICAgIGFsbG93ZWQ6ICdOdW1iZXIgYmV0d2VlbiAwIGFuZCAxJ1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGVycm9ycztcbiAgfTtcblxuICBfcHJvdG8uZ2V0TG9jYWxDb25maWcgPSBmdW5jdGlvbiBnZXRMb2NhbENvbmZpZygpIHtcbiAgICB2YXIgc3RvcmFnZSA9IHNlc3Npb25TdG9yYWdlO1xuXG4gICAgaWYgKHRoaXMuY29uZmlnLnNlc3Npb24pIHtcbiAgICAgIHN0b3JhZ2UgPSBsb2NhbFN0b3JhZ2U7XG4gICAgfVxuXG4gICAgdmFyIGNvbmZpZyA9IHN0b3JhZ2UuZ2V0SXRlbShMT0NBTF9DT05GSUdfS0VZKTtcblxuICAgIGlmIChjb25maWcpIHtcbiAgICAgIHJldHVybiBKU09OLnBhcnNlKGNvbmZpZyk7XG4gICAgfVxuICB9O1xuXG4gIF9wcm90by5zZXRMb2NhbENvbmZpZyA9IGZ1bmN0aW9uIHNldExvY2FsQ29uZmlnKGNvbmZpZywgbWVyZ2UpIHtcbiAgICBpZiAoY29uZmlnKSB7XG4gICAgICBpZiAobWVyZ2UpIHtcbiAgICAgICAgdmFyIHByZXZDb25maWcgPSB0aGlzLmdldExvY2FsQ29uZmlnKCk7XG4gICAgICAgIGNvbmZpZyA9IF9leHRlbmRzKHt9LCBwcmV2Q29uZmlnLCBjb25maWcpO1xuICAgICAgfVxuXG4gICAgICB2YXIgc3RvcmFnZSA9IHNlc3Npb25TdG9yYWdlO1xuXG4gICAgICBpZiAodGhpcy5jb25maWcuc2Vzc2lvbikge1xuICAgICAgICBzdG9yYWdlID0gbG9jYWxTdG9yYWdlO1xuICAgICAgfVxuXG4gICAgICBzdG9yYWdlLnNldEl0ZW0oTE9DQUxfQ09ORklHX0tFWSwgSlNPTi5zdHJpbmdpZnkoY29uZmlnKSk7XG4gICAgfVxuICB9O1xuXG4gIF9wcm90by5kaXNwYXRjaEV2ZW50ID0gZnVuY3Rpb24gZGlzcGF0Y2hFdmVudChuYW1lLCBhcmdzKSB7XG4gICAgdGhpcy5ldmVudHMuc2VuZChuYW1lLCBhcmdzKTtcbiAgfTtcblxuICBfcHJvdG8ub2JzZXJ2ZUV2ZW50ID0gZnVuY3Rpb24gb2JzZXJ2ZUV2ZW50KG5hbWUsIGZuKSB7XG4gICAgcmV0dXJuIHRoaXMuZXZlbnRzLm9ic2VydmUobmFtZSwgZm4pO1xuICB9O1xuXG4gIHJldHVybiBDb25maWc7XG59KCk7XG5cbmV4cG9ydCBkZWZhdWx0IENvbmZpZzsiLCJ2YXIgU0NIRURVTEUgPSAnc2NoZWR1bGUnO1xudmFyIElOVk9LRSA9ICdpbnZva2UnO1xudmFyIEFERF9FVkVOVF9MSVNURU5FUl9TVFIgPSAnYWRkRXZlbnRMaXN0ZW5lcic7XG52YXIgUkVNT1ZFX0VWRU5UX0xJU1RFTkVSX1NUUiA9ICdyZW1vdmVFdmVudExpc3RlbmVyJztcbnZhciBSRVNPVVJDRV9JTklUSUFUT1JfVFlQRVMgPSBbJ2xpbmsnLCAnY3NzJywgJ3NjcmlwdCcsICdpbWcnLCAneG1saHR0cHJlcXVlc3QnLCAnZmV0Y2gnLCAnYmVhY29uJywgJ2lmcmFtZSddO1xudmFyIFJFVVNBQklMSVRZX1RIUkVTSE9MRCA9IDUwMDA7XG52YXIgTUFYX1NQQU5fRFVSQVRJT04gPSA1ICogNjAgKiAxMDAwO1xudmFyIFBBR0VfTE9BRF9ERUxBWSA9IDEwMDA7XG52YXIgUEFHRV9MT0FEID0gJ3BhZ2UtbG9hZCc7XG52YXIgUk9VVEVfQ0hBTkdFID0gJ3JvdXRlLWNoYW5nZSc7XG52YXIgVFlQRV9DVVNUT00gPSAnY3VzdG9tJztcbnZhciBVU0VSX0lOVEVSQUNUSU9OID0gJ3VzZXItaW50ZXJhY3Rpb24nO1xudmFyIEhUVFBfUkVRVUVTVF9UWVBFID0gJ2h0dHAtcmVxdWVzdCc7XG52YXIgVEVNUE9SQVJZX1RZUEUgPSAndGVtcG9yYXJ5JztcbnZhciBOQU1FX1VOS05PV04gPSAnVW5rbm93bic7XG52YXIgUEFHRV9FWElUID0gJ3BhZ2UtZXhpdCc7XG52YXIgVFJBTlNBQ1RJT05fVFlQRV9PUkRFUiA9IFtQQUdFX0xPQUQsIFJPVVRFX0NIQU5HRSwgVVNFUl9JTlRFUkFDVElPTiwgSFRUUF9SRVFVRVNUX1RZUEUsIFRZUEVfQ1VTVE9NLCBURU1QT1JBUllfVFlQRV07XG52YXIgT1VUQ09NRV9TVUNDRVNTID0gJ3N1Y2Nlc3MnO1xudmFyIE9VVENPTUVfRkFJTFVSRSA9ICdmYWlsdXJlJztcbnZhciBPVVRDT01FX1VOS05PV04gPSAndW5rbm93bic7XG52YXIgVVNFUl9USU1JTkdfVEhSRVNIT0xEID0gNjA7XG52YXIgVFJBTlNBQ1RJT05fU1RBUlQgPSAndHJhbnNhY3Rpb246c3RhcnQnO1xudmFyIFRSQU5TQUNUSU9OX0VORCA9ICd0cmFuc2FjdGlvbjplbmQnO1xudmFyIENPTkZJR19DSEFOR0UgPSAnY29uZmlnOmNoYW5nZSc7XG52YXIgUVVFVUVfRkxVU0ggPSAncXVldWU6Zmx1c2gnO1xudmFyIFFVRVVFX0FERF9UUkFOU0FDVElPTiA9ICdxdWV1ZTphZGRfdHJhbnNhY3Rpb24nO1xudmFyIFRSQU5TQUNUSU9OX0lHTk9SRSA9ICd0cmFuc2FjdGlvbjppZ25vcmUnO1xudmFyIFhNTEhUVFBSRVFVRVNUID0gJ3htbGh0dHByZXF1ZXN0JztcbnZhciBGRVRDSCA9ICdmZXRjaCc7XG52YXIgSElTVE9SWSA9ICdoaXN0b3J5JztcbnZhciBFVkVOVF9UQVJHRVQgPSAnZXZlbnR0YXJnZXQnO1xudmFyIENMSUNLID0gJ2NsaWNrJztcbnZhciBFUlJPUiA9ICdlcnJvcic7XG52YXIgQkVGT1JFX0VWRU5UID0gJzpiZWZvcmUnO1xudmFyIEFGVEVSX0VWRU5UID0gJzphZnRlcic7XG52YXIgTE9DQUxfQ09ORklHX0tFWSA9ICdlbGFzdGljX2FwbV9jb25maWcnO1xudmFyIExPTkdfVEFTSyA9ICdsb25ndGFzayc7XG52YXIgUEFJTlQgPSAncGFpbnQnO1xudmFyIE1FQVNVUkUgPSAnbWVhc3VyZSc7XG52YXIgTkFWSUdBVElPTiA9ICduYXZpZ2F0aW9uJztcbnZhciBSRVNPVVJDRSA9ICdyZXNvdXJjZSc7XG52YXIgRklSU1RfQ09OVEVOVEZVTF9QQUlOVCA9ICdmaXJzdC1jb250ZW50ZnVsLXBhaW50JztcbnZhciBMQVJHRVNUX0NPTlRFTlRGVUxfUEFJTlQgPSAnbGFyZ2VzdC1jb250ZW50ZnVsLXBhaW50JztcbnZhciBGSVJTVF9JTlBVVCA9ICdmaXJzdC1pbnB1dCc7XG52YXIgTEFZT1VUX1NISUZUID0gJ2xheW91dC1zaGlmdCc7XG52YXIgRVZFTlQgPSAnZXZlbnQnO1xudmFyIEVSUk9SUyA9ICdlcnJvcnMnO1xudmFyIFRSQU5TQUNUSU9OUyA9ICd0cmFuc2FjdGlvbnMnO1xudmFyIENPTkZJR19TRVJWSUNFID0gJ0NvbmZpZ1NlcnZpY2UnO1xudmFyIExPR0dJTkdfU0VSVklDRSA9ICdMb2dnaW5nU2VydmljZSc7XG52YXIgVFJBTlNBQ1RJT05fU0VSVklDRSA9ICdUcmFuc2FjdGlvblNlcnZpY2UnO1xudmFyIEFQTV9TRVJWRVIgPSAnQXBtU2VydmVyJztcbnZhciBQRVJGT1JNQU5DRV9NT05JVE9SSU5HID0gJ1BlcmZvcm1hbmNlTW9uaXRvcmluZyc7XG52YXIgRVJST1JfTE9HR0lORyA9ICdFcnJvckxvZ2dpbmcnO1xudmFyIFRSVU5DQVRFRF9UWVBFID0gJy50cnVuY2F0ZWQnO1xudmFyIEtFWVdPUkRfTElNSVQgPSAxMDI0O1xudmFyIFNFU1NJT05fVElNRU9VVCA9IDMwICogNjAwMDA7XG52YXIgSFRUUF9SRVFVRVNUX1RJTUVPVVQgPSAxMDAwMDtcbmV4cG9ydCB7IFNDSEVEVUxFLCBJTlZPS0UsIEFERF9FVkVOVF9MSVNURU5FUl9TVFIsIFJFTU9WRV9FVkVOVF9MSVNURU5FUl9TVFIsIFJFU09VUkNFX0lOSVRJQVRPUl9UWVBFUywgUkVVU0FCSUxJVFlfVEhSRVNIT0xELCBNQVhfU1BBTl9EVVJBVElPTiwgUEFHRV9MT0FEX0RFTEFZLCBQQUdFX0xPQUQsIFJPVVRFX0NIQU5HRSwgTkFNRV9VTktOT1dOLCBQQUdFX0VYSVQsIFRZUEVfQ1VTVE9NLCBVU0VSX1RJTUlOR19USFJFU0hPTEQsIFRSQU5TQUNUSU9OX1NUQVJULCBUUkFOU0FDVElPTl9FTkQsIENPTkZJR19DSEFOR0UsIFFVRVVFX0ZMVVNILCBRVUVVRV9BRERfVFJBTlNBQ1RJT04sIFRSQU5TQUNUSU9OX0lHTk9SRSwgWE1MSFRUUFJFUVVFU1QsIEZFVENILCBISVNUT1JZLCBFVkVOVF9UQVJHRVQsIENMSUNLLCBFUlJPUiwgQkVGT1JFX0VWRU5ULCBBRlRFUl9FVkVOVCwgTE9DQUxfQ09ORklHX0tFWSwgSFRUUF9SRVFVRVNUX1RZUEUsIExPTkdfVEFTSywgUEFJTlQsIE1FQVNVUkUsIE5BVklHQVRJT04sIFJFU09VUkNFLCBGSVJTVF9DT05URU5URlVMX1BBSU5ULCBMQVJHRVNUX0NPTlRFTlRGVUxfUEFJTlQsIEtFWVdPUkRfTElNSVQsIFRFTVBPUkFSWV9UWVBFLCBVU0VSX0lOVEVSQUNUSU9OLCBUUkFOU0FDVElPTl9UWVBFX09SREVSLCBFUlJPUlMsIFRSQU5TQUNUSU9OUywgQ09ORklHX1NFUlZJQ0UsIExPR0dJTkdfU0VSVklDRSwgVFJBTlNBQ1RJT05fU0VSVklDRSwgQVBNX1NFUlZFUiwgUEVSRk9STUFOQ0VfTU9OSVRPUklORywgRVJST1JfTE9HR0lORywgVFJVTkNBVEVEX1RZUEUsIEZJUlNUX0lOUFVULCBMQVlPVVRfU0hJRlQsIEVWRU5ULCBPVVRDT01FX1NVQ0NFU1MsIE9VVENPTUVfRkFJTFVSRSwgT1VUQ09NRV9VTktOT1dOLCBTRVNTSU9OX1RJTUVPVVQsIEhUVFBfUkVRVUVTVF9USU1FT1VUIH07IiwidmFyIF9leGNsdWRlZCA9IFtcInRhZ3NcIl07XG5cbmZ1bmN0aW9uIF9vYmplY3RXaXRob3V0UHJvcGVydGllc0xvb3NlKHNvdXJjZSwgZXhjbHVkZWQpIHsgaWYgKHNvdXJjZSA9PSBudWxsKSByZXR1cm4ge307IHZhciB0YXJnZXQgPSB7fTsgdmFyIHNvdXJjZUtleXMgPSBPYmplY3Qua2V5cyhzb3VyY2UpOyB2YXIga2V5LCBpOyBmb3IgKGkgPSAwOyBpIDwgc291cmNlS2V5cy5sZW5ndGg7IGkrKykgeyBrZXkgPSBzb3VyY2VLZXlzW2ldOyBpZiAoZXhjbHVkZWQuaW5kZXhPZihrZXkpID49IDApIGNvbnRpbnVlOyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IHJldHVybiB0YXJnZXQ7IH1cblxuaW1wb3J0IHsgVXJsIH0gZnJvbSAnLi91cmwnO1xuaW1wb3J0IHsgUEFHRV9MT0FELCBQQUdFX0VYSVQsIE5BVklHQVRJT04gfSBmcm9tICcuL2NvbnN0YW50cyc7XG5pbXBvcnQgeyBnZXRTZXJ2ZXJUaW1pbmdJbmZvLCBQRVJGLCBpc1BlcmZUaW1lbGluZVN1cHBvcnRlZCB9IGZyb20gJy4vdXRpbHMnO1xudmFyIExFRlRfU1FVQVJFX0JSQUNLRVQgPSA5MTtcbnZhciBSSUdIVF9TUVVBUkVfQlJBQ0tFVCA9IDkzO1xudmFyIEVYVEVSTkFMID0gJ2V4dGVybmFsJztcbnZhciBSRVNPVVJDRSA9ICdyZXNvdXJjZSc7XG52YXIgSEFSRF9OQVZJR0FUSU9OID0gJ2hhcmQtbmF2aWdhdGlvbic7XG5cbmZ1bmN0aW9uIGdldFBvcnROdW1iZXIocG9ydCwgcHJvdG9jb2wpIHtcbiAgaWYgKHBvcnQgPT09ICcnKSB7XG4gICAgcG9ydCA9IHByb3RvY29sID09PSAnaHR0cDonID8gJzgwJyA6IHByb3RvY29sID09PSAnaHR0cHM6JyA/ICc0NDMnIDogJyc7XG4gIH1cblxuICByZXR1cm4gcG9ydDtcbn1cblxuZnVuY3Rpb24gZ2V0UmVzcG9uc2VDb250ZXh0KHBlcmZUaW1pbmdFbnRyeSkge1xuICB2YXIgdHJhbnNmZXJTaXplID0gcGVyZlRpbWluZ0VudHJ5LnRyYW5zZmVyU2l6ZSxcbiAgICAgIGVuY29kZWRCb2R5U2l6ZSA9IHBlcmZUaW1pbmdFbnRyeS5lbmNvZGVkQm9keVNpemUsXG4gICAgICBkZWNvZGVkQm9keVNpemUgPSBwZXJmVGltaW5nRW50cnkuZGVjb2RlZEJvZHlTaXplLFxuICAgICAgc2VydmVyVGltaW5nID0gcGVyZlRpbWluZ0VudHJ5LnNlcnZlclRpbWluZztcbiAgdmFyIHJlc3BDb250ZXh0ID0ge1xuICAgIHRyYW5zZmVyX3NpemU6IHRyYW5zZmVyU2l6ZSxcbiAgICBlbmNvZGVkX2JvZHlfc2l6ZTogZW5jb2RlZEJvZHlTaXplLFxuICAgIGRlY29kZWRfYm9keV9zaXplOiBkZWNvZGVkQm9keVNpemVcbiAgfTtcbiAgdmFyIHNlcnZlclRpbWluZ1N0ciA9IGdldFNlcnZlclRpbWluZ0luZm8oc2VydmVyVGltaW5nKTtcblxuICBpZiAoc2VydmVyVGltaW5nU3RyKSB7XG4gICAgcmVzcENvbnRleHQuaGVhZGVycyA9IHtcbiAgICAgICdzZXJ2ZXItdGltaW5nJzogc2VydmVyVGltaW5nU3RyXG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiByZXNwQ29udGV4dDtcbn1cblxuZnVuY3Rpb24gZ2V0RGVzdGluYXRpb24ocGFyc2VkVXJsKSB7XG4gIHZhciBwb3J0ID0gcGFyc2VkVXJsLnBvcnQsXG4gICAgICBwcm90b2NvbCA9IHBhcnNlZFVybC5wcm90b2NvbCxcbiAgICAgIGhvc3RuYW1lID0gcGFyc2VkVXJsLmhvc3RuYW1lO1xuICB2YXIgcG9ydE51bWJlciA9IGdldFBvcnROdW1iZXIocG9ydCwgcHJvdG9jb2wpO1xuICB2YXIgaXB2Nkhvc3RuYW1lID0gaG9zdG5hbWUuY2hhckNvZGVBdCgwKSA9PT0gTEVGVF9TUVVBUkVfQlJBQ0tFVCAmJiBob3N0bmFtZS5jaGFyQ29kZUF0KGhvc3RuYW1lLmxlbmd0aCAtIDEpID09PSBSSUdIVF9TUVVBUkVfQlJBQ0tFVDtcbiAgdmFyIGFkZHJlc3MgPSBob3N0bmFtZTtcblxuICBpZiAoaXB2Nkhvc3RuYW1lKSB7XG4gICAgYWRkcmVzcyA9IGhvc3RuYW1lLnNsaWNlKDEsIC0xKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgc2VydmljZToge1xuICAgICAgcmVzb3VyY2U6IGhvc3RuYW1lICsgJzonICsgcG9ydE51bWJlcixcbiAgICAgIG5hbWU6ICcnLFxuICAgICAgdHlwZTogJydcbiAgICB9LFxuICAgIGFkZHJlc3M6IGFkZHJlc3MsXG4gICAgcG9ydDogTnVtYmVyKHBvcnROdW1iZXIpXG4gIH07XG59XG5cbmZ1bmN0aW9uIGdldFJlc291cmNlQ29udGV4dChkYXRhKSB7XG4gIHZhciBlbnRyeSA9IGRhdGEuZW50cnksXG4gICAgICB1cmwgPSBkYXRhLnVybDtcbiAgdmFyIHBhcnNlZFVybCA9IG5ldyBVcmwodXJsKTtcbiAgdmFyIGRlc3RpbmF0aW9uID0gZ2V0RGVzdGluYXRpb24ocGFyc2VkVXJsKTtcbiAgcmV0dXJuIHtcbiAgICBodHRwOiB7XG4gICAgICB1cmw6IHVybCxcbiAgICAgIHJlc3BvbnNlOiBnZXRSZXNwb25zZUNvbnRleHQoZW50cnkpXG4gICAgfSxcbiAgICBkZXN0aW5hdGlvbjogZGVzdGluYXRpb25cbiAgfTtcbn1cblxuZnVuY3Rpb24gZ2V0RXh0ZXJuYWxDb250ZXh0KGRhdGEpIHtcbiAgdmFyIHVybCA9IGRhdGEudXJsLFxuICAgICAgbWV0aG9kID0gZGF0YS5tZXRob2QsXG4gICAgICB0YXJnZXQgPSBkYXRhLnRhcmdldCxcbiAgICAgIHJlc3BvbnNlID0gZGF0YS5yZXNwb25zZTtcbiAgdmFyIHBhcnNlZFVybCA9IG5ldyBVcmwodXJsKTtcbiAgdmFyIGRlc3RpbmF0aW9uID0gZ2V0RGVzdGluYXRpb24ocGFyc2VkVXJsKTtcbiAgdmFyIGNvbnRleHQgPSB7XG4gICAgaHR0cDoge1xuICAgICAgbWV0aG9kOiBtZXRob2QsXG4gICAgICB1cmw6IHBhcnNlZFVybC5ocmVmXG4gICAgfSxcbiAgICBkZXN0aW5hdGlvbjogZGVzdGluYXRpb25cbiAgfTtcbiAgdmFyIHN0YXR1c0NvZGU7XG5cbiAgaWYgKHRhcmdldCAmJiB0eXBlb2YgdGFyZ2V0LnN0YXR1cyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBzdGF0dXNDb2RlID0gdGFyZ2V0LnN0YXR1cztcbiAgfSBlbHNlIGlmIChyZXNwb25zZSkge1xuICAgIHN0YXR1c0NvZGUgPSByZXNwb25zZS5zdGF0dXM7XG4gIH1cblxuICBjb250ZXh0Lmh0dHAuc3RhdHVzX2NvZGUgPSBzdGF0dXNDb2RlO1xuICByZXR1cm4gY29udGV4dDtcbn1cblxuZnVuY3Rpb24gZ2V0TmF2aWdhdGlvbkNvbnRleHQoZGF0YSkge1xuICB2YXIgdXJsID0gZGF0YS51cmw7XG4gIHZhciBwYXJzZWRVcmwgPSBuZXcgVXJsKHVybCk7XG4gIHZhciBkZXN0aW5hdGlvbiA9IGdldERlc3RpbmF0aW9uKHBhcnNlZFVybCk7XG4gIHJldHVybiB7XG4gICAgZGVzdGluYXRpb246IGRlc3RpbmF0aW9uXG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRQYWdlQ29udGV4dCgpIHtcbiAgcmV0dXJuIHtcbiAgICBwYWdlOiB7XG4gICAgICByZWZlcmVyOiBkb2N1bWVudC5yZWZlcnJlcixcbiAgICAgIHVybDogbG9jYXRpb24uaHJlZlxuICAgIH1cbiAgfTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBhZGRTcGFuQ29udGV4dChzcGFuLCBkYXRhKSB7XG4gIGlmICghZGF0YSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHZhciB0eXBlID0gc3Bhbi50eXBlO1xuICB2YXIgY29udGV4dDtcblxuICBzd2l0Y2ggKHR5cGUpIHtcbiAgICBjYXNlIEVYVEVSTkFMOlxuICAgICAgY29udGV4dCA9IGdldEV4dGVybmFsQ29udGV4dChkYXRhKTtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSBSRVNPVVJDRTpcbiAgICAgIGNvbnRleHQgPSBnZXRSZXNvdXJjZUNvbnRleHQoZGF0YSk7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgSEFSRF9OQVZJR0FUSU9OOlxuICAgICAgY29udGV4dCA9IGdldE5hdmlnYXRpb25Db250ZXh0KGRhdGEpO1xuICAgICAgYnJlYWs7XG4gIH1cblxuICBzcGFuLmFkZENvbnRleHQoY29udGV4dCk7XG59XG5leHBvcnQgZnVuY3Rpb24gYWRkVHJhbnNhY3Rpb25Db250ZXh0KHRyYW5zYWN0aW9uLCBfdGVtcCkge1xuICB2YXIgX3JlZiA9IF90ZW1wID09PSB2b2lkIDAgPyB7fSA6IF90ZW1wLFxuICAgICAgdGFncyA9IF9yZWYudGFncyxcbiAgICAgIGNvbmZpZ0NvbnRleHQgPSBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXNMb29zZShfcmVmLCBfZXhjbHVkZWQpO1xuXG4gIHZhciBwYWdlQ29udGV4dCA9IGdldFBhZ2VDb250ZXh0KCk7XG4gIHZhciByZXNwb25zZUNvbnRleHQgPSB7fTtcblxuICBpZiAodHJhbnNhY3Rpb24udHlwZSA9PT0gUEFHRV9FWElUKSB7XG4gICAgdHJhbnNhY3Rpb24uZW5zdXJlQ29udGV4dCgpO1xuXG4gICAgaWYgKHRyYW5zYWN0aW9uLmNvbnRleHQucGFnZSAmJiB0cmFuc2FjdGlvbi5jb250ZXh0LnBhZ2UudXJsKSB7XG4gICAgICBwYWdlQ29udGV4dC5wYWdlLnVybCA9IHRyYW5zYWN0aW9uLmNvbnRleHQucGFnZS51cmw7XG4gICAgfVxuICB9IGVsc2UgaWYgKHRyYW5zYWN0aW9uLnR5cGUgPT09IFBBR0VfTE9BRCAmJiBpc1BlcmZUaW1lbGluZVN1cHBvcnRlZCgpKSB7XG4gICAgdmFyIGVudHJpZXMgPSBQRVJGLmdldEVudHJpZXNCeVR5cGUoTkFWSUdBVElPTik7XG5cbiAgICBpZiAoZW50cmllcyAmJiBlbnRyaWVzLmxlbmd0aCA+IDApIHtcbiAgICAgIHJlc3BvbnNlQ29udGV4dCA9IHtcbiAgICAgICAgcmVzcG9uc2U6IGdldFJlc3BvbnNlQ29udGV4dChlbnRyaWVzWzBdKVxuICAgICAgfTtcbiAgICB9XG4gIH1cblxuICB0cmFuc2FjdGlvbi5hZGRDb250ZXh0KHBhZ2VDb250ZXh0LCByZXNwb25zZUNvbnRleHQsIGNvbmZpZ0NvbnRleHQpO1xufSIsImltcG9ydCB7IEJFRk9SRV9FVkVOVCwgQUZURVJfRVZFTlQgfSBmcm9tICcuL2NvbnN0YW50cyc7XG5cbnZhciBFdmVudEhhbmRsZXIgPSBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIEV2ZW50SGFuZGxlcigpIHtcbiAgICB0aGlzLm9ic2VydmVycyA9IHt9O1xuICB9XG5cbiAgdmFyIF9wcm90byA9IEV2ZW50SGFuZGxlci5wcm90b3R5cGU7XG5cbiAgX3Byb3RvLm9ic2VydmUgPSBmdW5jdGlvbiBvYnNlcnZlKG5hbWUsIGZuKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIGlmICh0eXBlb2YgZm4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGlmICghdGhpcy5vYnNlcnZlcnNbbmFtZV0pIHtcbiAgICAgICAgdGhpcy5vYnNlcnZlcnNbbmFtZV0gPSBbXTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5vYnNlcnZlcnNbbmFtZV0ucHVzaChmbik7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgaW5kZXggPSBfdGhpcy5vYnNlcnZlcnNbbmFtZV0uaW5kZXhPZihmbik7XG5cbiAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgICAgICBfdGhpcy5vYnNlcnZlcnNbbmFtZV0uc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG4gIH07XG5cbiAgX3Byb3RvLnNlbmRPbmx5ID0gZnVuY3Rpb24gc2VuZE9ubHkobmFtZSwgYXJncykge1xuICAgIHZhciBvYnMgPSB0aGlzLm9ic2VydmVyc1tuYW1lXTtcblxuICAgIGlmIChvYnMpIHtcbiAgICAgIG9icy5mb3JFYWNoKGZ1bmN0aW9uIChmbikge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGZuLmFwcGx5KHVuZGVmaW5lZCwgYXJncyk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coZXJyb3IsIGVycm9yLnN0YWNrKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9O1xuXG4gIF9wcm90by5zZW5kID0gZnVuY3Rpb24gc2VuZChuYW1lLCBhcmdzKSB7XG4gICAgdGhpcy5zZW5kT25seShuYW1lICsgQkVGT1JFX0VWRU5ULCBhcmdzKTtcbiAgICB0aGlzLnNlbmRPbmx5KG5hbWUsIGFyZ3MpO1xuICAgIHRoaXMuc2VuZE9ubHkobmFtZSArIEFGVEVSX0VWRU5ULCBhcmdzKTtcbiAgfTtcblxuICByZXR1cm4gRXZlbnRIYW5kbGVyO1xufSgpO1xuXG5leHBvcnQgZGVmYXVsdCBFdmVudEhhbmRsZXI7IiwiZnVuY3Rpb24gX2V4dGVuZHMoKSB7IF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTsgcmV0dXJuIF9leHRlbmRzLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7IH1cblxuaW1wb3J0IHsgSFRUUF9SRVFVRVNUX1RJTUVPVVQgfSBmcm9tICcuLi9jb25zdGFudHMnO1xuaW1wb3J0IHsgaXNSZXNwb25zZVN1Y2Nlc3NmdWwgfSBmcm9tICcuL3Jlc3BvbnNlLXN0YXR1cyc7XG5leHBvcnQgdmFyIEJZVEVfTElNSVQgPSA2MCAqIDEwMDA7XG5leHBvcnQgZnVuY3Rpb24gc2hvdWxkVXNlRmV0Y2hXaXRoS2VlcEFsaXZlKG1ldGhvZCwgcGF5bG9hZCkge1xuICBpZiAoIWlzRmV0Y2hTdXBwb3J0ZWQoKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHZhciBpc0tlZXBBbGl2ZVN1cHBvcnRlZCA9ICgna2VlcGFsaXZlJyBpbiBuZXcgUmVxdWVzdCgnJykpO1xuXG4gIGlmICghaXNLZWVwQWxpdmVTdXBwb3J0ZWQpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICB2YXIgc2l6ZSA9IGNhbGN1bGF0ZVNpemUocGF5bG9hZCk7XG4gIHJldHVybiBtZXRob2QgPT09ICdQT1NUJyAmJiBzaXplIDwgQllURV9MSU1JVDtcbn1cbmV4cG9ydCBmdW5jdGlvbiBzZW5kRmV0Y2hSZXF1ZXN0KG1ldGhvZCwgdXJsLCBfcmVmKSB7XG4gIHZhciBfcmVmJGtlZXBhbGl2ZSA9IF9yZWYua2VlcGFsaXZlLFxuICAgICAga2VlcGFsaXZlID0gX3JlZiRrZWVwYWxpdmUgPT09IHZvaWQgMCA/IGZhbHNlIDogX3JlZiRrZWVwYWxpdmUsXG4gICAgICBfcmVmJHRpbWVvdXQgPSBfcmVmLnRpbWVvdXQsXG4gICAgICB0aW1lb3V0ID0gX3JlZiR0aW1lb3V0ID09PSB2b2lkIDAgPyBIVFRQX1JFUVVFU1RfVElNRU9VVCA6IF9yZWYkdGltZW91dCxcbiAgICAgIHBheWxvYWQgPSBfcmVmLnBheWxvYWQsXG4gICAgICBoZWFkZXJzID0gX3JlZi5oZWFkZXJzLFxuICAgICAgc2VuZENyZWRlbnRpYWxzID0gX3JlZi5zZW5kQ3JlZGVudGlhbHM7XG4gIHZhciB0aW1lb3V0Q29uZmlnID0ge307XG5cbiAgaWYgKHR5cGVvZiBBYm9ydENvbnRyb2xsZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICB2YXIgY29udHJvbGxlciA9IG5ldyBBYm9ydENvbnRyb2xsZXIoKTtcbiAgICB0aW1lb3V0Q29uZmlnLnNpZ25hbCA9IGNvbnRyb2xsZXIuc2lnbmFsO1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIGNvbnRyb2xsZXIuYWJvcnQoKTtcbiAgICB9LCB0aW1lb3V0KTtcbiAgfVxuXG4gIHZhciBmZXRjaFJlc3BvbnNlO1xuICByZXR1cm4gd2luZG93LmZldGNoKHVybCwgX2V4dGVuZHMoe1xuICAgIGJvZHk6IHBheWxvYWQsXG4gICAgaGVhZGVyczogaGVhZGVycyxcbiAgICBtZXRob2Q6IG1ldGhvZCxcbiAgICBrZWVwYWxpdmU6IGtlZXBhbGl2ZSxcbiAgICBjcmVkZW50aWFsczogc2VuZENyZWRlbnRpYWxzID8gJ2luY2x1ZGUnIDogJ29taXQnXG4gIH0sIHRpbWVvdXRDb25maWcpKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgIGZldGNoUmVzcG9uc2UgPSByZXNwb25zZTtcbiAgICByZXR1cm4gZmV0Y2hSZXNwb25zZS50ZXh0KCk7XG4gIH0pLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlVGV4dCkge1xuICAgIHZhciBib2R5UmVzcG9uc2UgPSB7XG4gICAgICB1cmw6IHVybCxcbiAgICAgIHN0YXR1czogZmV0Y2hSZXNwb25zZS5zdGF0dXMsXG4gICAgICByZXNwb25zZVRleHQ6IHJlc3BvbnNlVGV4dFxuICAgIH07XG5cbiAgICBpZiAoIWlzUmVzcG9uc2VTdWNjZXNzZnVsKGZldGNoUmVzcG9uc2Uuc3RhdHVzKSkge1xuICAgICAgdGhyb3cgYm9keVJlc3BvbnNlO1xuICAgIH1cblxuICAgIHJldHVybiBib2R5UmVzcG9uc2U7XG4gIH0pO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGlzRmV0Y2hTdXBwb3J0ZWQoKSB7XG4gIHJldHVybiB0eXBlb2Ygd2luZG93LmZldGNoID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiB3aW5kb3cuUmVxdWVzdCA9PT0gJ2Z1bmN0aW9uJztcbn1cblxuZnVuY3Rpb24gY2FsY3VsYXRlU2l6ZShwYXlsb2FkKSB7XG4gIGlmICghcGF5bG9hZCkge1xuICAgIHJldHVybiAwO1xuICB9XG5cbiAgaWYgKHBheWxvYWQgaW5zdGFuY2VvZiBCbG9iKSB7XG4gICAgcmV0dXJuIHBheWxvYWQuc2l6ZTtcbiAgfVxuXG4gIHJldHVybiBuZXcgQmxvYihbcGF5bG9hZF0pLnNpemU7XG59IiwiZXhwb3J0IGZ1bmN0aW9uIGlzUmVzcG9uc2VTdWNjZXNzZnVsKHN0YXR1cykge1xuICBpZiAoc3RhdHVzID09PSAwIHx8IHN0YXR1cyA+IDM5OSAmJiBzdGF0dXMgPCA2MDApIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn0iLCJpbXBvcnQgeyBYSFJfSUdOT1JFIH0gZnJvbSAnLi4vcGF0Y2hpbmcvcGF0Y2gtdXRpbHMnO1xuaW1wb3J0IHsgaXNSZXNwb25zZVN1Y2Nlc3NmdWwgfSBmcm9tICcuL3Jlc3BvbnNlLXN0YXR1cyc7XG5pbXBvcnQgeyBQcm9taXNlIH0gZnJvbSAnLi4vcG9seWZpbGxzJztcbmV4cG9ydCBmdW5jdGlvbiBzZW5kWEhSKG1ldGhvZCwgdXJsLCBfcmVmKSB7XG4gIHZhciBfcmVmJHRpbWVvdXQgPSBfcmVmLnRpbWVvdXQsXG4gICAgICB0aW1lb3V0ID0gX3JlZiR0aW1lb3V0ID09PSB2b2lkIDAgPyBIVFRQX1JFUVVFU1RfVElNRU9VVCA6IF9yZWYkdGltZW91dCxcbiAgICAgIHBheWxvYWQgPSBfcmVmLnBheWxvYWQsXG4gICAgICBoZWFkZXJzID0gX3JlZi5oZWFkZXJzLFxuICAgICAgYmVmb3JlU2VuZCA9IF9yZWYuYmVmb3JlU2VuZCxcbiAgICAgIHNlbmRDcmVkZW50aWFscyA9IF9yZWYuc2VuZENyZWRlbnRpYWxzO1xuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgIHZhciB4aHIgPSBuZXcgd2luZG93LlhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgeGhyW1hIUl9JR05PUkVdID0gdHJ1ZTtcbiAgICB4aHIub3BlbihtZXRob2QsIHVybCwgdHJ1ZSk7XG4gICAgeGhyLnRpbWVvdXQgPSB0aW1lb3V0O1xuICAgIHhoci53aXRoQ3JlZGVudGlhbHMgPSBzZW5kQ3JlZGVudGlhbHM7XG5cbiAgICBpZiAoaGVhZGVycykge1xuICAgICAgZm9yICh2YXIgaGVhZGVyIGluIGhlYWRlcnMpIHtcbiAgICAgICAgaWYgKGhlYWRlcnMuaGFzT3duUHJvcGVydHkoaGVhZGVyKSkge1xuICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKGhlYWRlciwgaGVhZGVyc1toZWFkZXJdKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoeGhyLnJlYWR5U3RhdGUgPT09IDQpIHtcbiAgICAgICAgdmFyIHN0YXR1cyA9IHhoci5zdGF0dXMsXG4gICAgICAgICAgICByZXNwb25zZVRleHQgPSB4aHIucmVzcG9uc2VUZXh0O1xuXG4gICAgICAgIGlmIChpc1Jlc3BvbnNlU3VjY2Vzc2Z1bChzdGF0dXMpKSB7XG4gICAgICAgICAgcmVzb2x2ZSh4aHIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlamVjdCh7XG4gICAgICAgICAgICB1cmw6IHVybCxcbiAgICAgICAgICAgIHN0YXR1czogc3RhdHVzLFxuICAgICAgICAgICAgcmVzcG9uc2VUZXh0OiByZXNwb25zZVRleHRcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICB4aHIub25lcnJvciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBzdGF0dXMgPSB4aHIuc3RhdHVzLFxuICAgICAgICAgIHJlc3BvbnNlVGV4dCA9IHhoci5yZXNwb25zZVRleHQ7XG4gICAgICByZWplY3Qoe1xuICAgICAgICB1cmw6IHVybCxcbiAgICAgICAgc3RhdHVzOiBzdGF0dXMsXG4gICAgICAgIHJlc3BvbnNlVGV4dDogcmVzcG9uc2VUZXh0XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgdmFyIGNhblNlbmQgPSB0cnVlO1xuXG4gICAgaWYgKHR5cGVvZiBiZWZvcmVTZW5kID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBjYW5TZW5kID0gYmVmb3JlU2VuZCh7XG4gICAgICAgIHVybDogdXJsLFxuICAgICAgICBtZXRob2Q6IG1ldGhvZCxcbiAgICAgICAgaGVhZGVyczogaGVhZGVycyxcbiAgICAgICAgcGF5bG9hZDogcGF5bG9hZCxcbiAgICAgICAgeGhyOiB4aHJcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChjYW5TZW5kKSB7XG4gICAgICB4aHIuc2VuZChwYXlsb2FkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVqZWN0KHtcbiAgICAgICAgdXJsOiB1cmwsXG4gICAgICAgIHN0YXR1czogMCxcbiAgICAgICAgcmVzcG9uc2VUZXh0OiAnUmVxdWVzdCByZWplY3RlZCBieSB1c2VyIGNvbmZpZ3VyYXRpb24uJ1xuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbn0iLCJpbXBvcnQgeyBYTUxIVFRQUkVRVUVTVCwgRkVUQ0gsIEhJU1RPUlksIFBBR0VfTE9BRCwgRVJST1IsIEVWRU5UX1RBUkdFVCwgQ0xJQ0sgfSBmcm9tICcuL2NvbnN0YW50cyc7XG5leHBvcnQgZnVuY3Rpb24gZ2V0SW5zdHJ1bWVudGF0aW9uRmxhZ3MoaW5zdHJ1bWVudCwgZGlzYWJsZWRJbnN0cnVtZW50YXRpb25zKSB7XG4gIHZhciBfZmxhZ3M7XG5cbiAgdmFyIGZsYWdzID0gKF9mbGFncyA9IHt9LCBfZmxhZ3NbWE1MSFRUUFJFUVVFU1RdID0gZmFsc2UsIF9mbGFnc1tGRVRDSF0gPSBmYWxzZSwgX2ZsYWdzW0hJU1RPUlldID0gZmFsc2UsIF9mbGFnc1tQQUdFX0xPQURdID0gZmFsc2UsIF9mbGFnc1tFUlJPUl0gPSBmYWxzZSwgX2ZsYWdzW0VWRU5UX1RBUkdFVF0gPSBmYWxzZSwgX2ZsYWdzW0NMSUNLXSA9IGZhbHNlLCBfZmxhZ3MpO1xuXG4gIGlmICghaW5zdHJ1bWVudCkge1xuICAgIHJldHVybiBmbGFncztcbiAgfVxuXG4gIE9iamVjdC5rZXlzKGZsYWdzKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICBpZiAoZGlzYWJsZWRJbnN0cnVtZW50YXRpb25zLmluZGV4T2Yoa2V5KSA9PT0gLTEpIHtcbiAgICAgIGZsYWdzW2tleV0gPSB0cnVlO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBmbGFncztcbn0iLCJpbXBvcnQgeyBub29wIH0gZnJvbSAnLi91dGlscyc7XG5cbnZhciBMb2dnaW5nU2VydmljZSA9IGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gTG9nZ2luZ1NlcnZpY2Uoc3BlYykge1xuICAgIGlmIChzcGVjID09PSB2b2lkIDApIHtcbiAgICAgIHNwZWMgPSB7fTtcbiAgICB9XG5cbiAgICB0aGlzLmxldmVscyA9IFsndHJhY2UnLCAnZGVidWcnLCAnaW5mbycsICd3YXJuJywgJ2Vycm9yJ107XG4gICAgdGhpcy5sZXZlbCA9IHNwZWMubGV2ZWwgfHwgJ3dhcm4nO1xuICAgIHRoaXMucHJlZml4ID0gc3BlYy5wcmVmaXggfHwgJyc7XG4gICAgdGhpcy5yZXNldExvZ01ldGhvZHMoKTtcbiAgfVxuXG4gIHZhciBfcHJvdG8gPSBMb2dnaW5nU2VydmljZS5wcm90b3R5cGU7XG5cbiAgX3Byb3RvLnNob3VsZExvZyA9IGZ1bmN0aW9uIHNob3VsZExvZyhsZXZlbCkge1xuICAgIHJldHVybiB0aGlzLmxldmVscy5pbmRleE9mKGxldmVsKSA+PSB0aGlzLmxldmVscy5pbmRleE9mKHRoaXMubGV2ZWwpO1xuICB9O1xuXG4gIF9wcm90by5zZXRMZXZlbCA9IGZ1bmN0aW9uIHNldExldmVsKGxldmVsKSB7XG4gICAgaWYgKGxldmVsID09PSB0aGlzLmxldmVsKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5sZXZlbCA9IGxldmVsO1xuICAgIHRoaXMucmVzZXRMb2dNZXRob2RzKCk7XG4gIH07XG5cbiAgX3Byb3RvLnJlc2V0TG9nTWV0aG9kcyA9IGZ1bmN0aW9uIHJlc2V0TG9nTWV0aG9kcygpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgdGhpcy5sZXZlbHMuZm9yRWFjaChmdW5jdGlvbiAobGV2ZWwpIHtcbiAgICAgIF90aGlzW2xldmVsXSA9IF90aGlzLnNob3VsZExvZyhsZXZlbCkgPyBsb2cgOiBub29wO1xuXG4gICAgICBmdW5jdGlvbiBsb2coKSB7XG4gICAgICAgIHZhciBub3JtYWxpemVkTGV2ZWwgPSBsZXZlbDtcblxuICAgICAgICBpZiAobGV2ZWwgPT09ICd0cmFjZScgfHwgbGV2ZWwgPT09ICdkZWJ1ZycpIHtcbiAgICAgICAgICBub3JtYWxpemVkTGV2ZWwgPSAnaW5mbyc7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgICAgYXJnc1swXSA9IHRoaXMucHJlZml4ICsgYXJnc1swXTtcblxuICAgICAgICBpZiAoY29uc29sZSkge1xuICAgICAgICAgIHZhciByZWFsTWV0aG9kID0gY29uc29sZVtub3JtYWxpemVkTGV2ZWxdIHx8IGNvbnNvbGUubG9nO1xuXG4gICAgICAgICAgaWYgKHR5cGVvZiByZWFsTWV0aG9kID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICByZWFsTWV0aG9kLmFwcGx5KGNvbnNvbGUsIGFyZ3MpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIHJldHVybiBMb2dnaW5nU2VydmljZTtcbn0oKTtcblxuZXhwb3J0IGRlZmF1bHQgTG9nZ2luZ1NlcnZpY2U7IiwidmFyIE5ESlNPTiA9IGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gTkRKU09OKCkge31cblxuICBOREpTT04uc3RyaW5naWZ5ID0gZnVuY3Rpb24gc3RyaW5naWZ5KG9iamVjdCkge1xuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShvYmplY3QpICsgJ1xcbic7XG4gIH07XG5cbiAgcmV0dXJuIE5ESlNPTjtcbn0oKTtcblxuZXhwb3J0IGRlZmF1bHQgTkRKU09OOyIsImltcG9ydCB7IFVTRVJfSU5URVJBQ1RJT04gfSBmcm9tICcuLi9jb25zdGFudHMnO1xudmFyIElOVEVSQUNUSVZFX1NFTEVDVE9SID0gJ2FbZGF0YS10cmFuc2FjdGlvbi1uYW1lXSwgYnV0dG9uW2RhdGEtdHJhbnNhY3Rpb24tbmFtZV0nO1xuZXhwb3J0IGZ1bmN0aW9uIG9ic2VydmVQYWdlQ2xpY2tzKHRyYW5zYWN0aW9uU2VydmljZSkge1xuICB2YXIgY2xpY2tIYW5kbGVyID0gZnVuY3Rpb24gY2xpY2tIYW5kbGVyKGV2ZW50KSB7XG4gICAgaWYgKGV2ZW50LnRhcmdldCBpbnN0YW5jZW9mIEVsZW1lbnQpIHtcbiAgICAgIGNyZWF0ZVVzZXJJbnRlcmFjdGlvblRyYW5zYWN0aW9uKHRyYW5zYWN0aW9uU2VydmljZSwgZXZlbnQudGFyZ2V0KTtcbiAgICB9XG4gIH07XG5cbiAgdmFyIGV2ZW50TmFtZSA9ICdjbGljayc7XG4gIHZhciB1c2VDYXB0dXJlID0gdHJ1ZTtcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBjbGlja0hhbmRsZXIsIHVzZUNhcHR1cmUpO1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgY2xpY2tIYW5kbGVyLCB1c2VDYXB0dXJlKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlVXNlckludGVyYWN0aW9uVHJhbnNhY3Rpb24odHJhbnNhY3Rpb25TZXJ2aWNlLCB0YXJnZXQpIHtcbiAgdmFyIF9nZXRUcmFuc2FjdGlvbk1ldGFkYSA9IGdldFRyYW5zYWN0aW9uTWV0YWRhdGEodGFyZ2V0KSxcbiAgICAgIHRyYW5zYWN0aW9uTmFtZSA9IF9nZXRUcmFuc2FjdGlvbk1ldGFkYS50cmFuc2FjdGlvbk5hbWUsXG4gICAgICBjb250ZXh0ID0gX2dldFRyYW5zYWN0aW9uTWV0YWRhLmNvbnRleHQ7XG5cbiAgdmFyIHRyID0gdHJhbnNhY3Rpb25TZXJ2aWNlLnN0YXJ0VHJhbnNhY3Rpb24oXCJDbGljayAtIFwiICsgdHJhbnNhY3Rpb25OYW1lLCBVU0VSX0lOVEVSQUNUSU9OLCB7XG4gICAgbWFuYWdlZDogdHJ1ZSxcbiAgICBjYW5SZXVzZTogdHJ1ZSxcbiAgICByZXVzZVRocmVzaG9sZDogMzAwXG4gIH0pO1xuXG4gIGlmICh0ciAmJiBjb250ZXh0KSB7XG4gICAgdHIuYWRkQ29udGV4dChjb250ZXh0KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRUcmFuc2FjdGlvbk1ldGFkYXRhKHRhcmdldCkge1xuICB2YXIgbWV0YWRhdGEgPSB7XG4gICAgdHJhbnNhY3Rpb25OYW1lOiBudWxsLFxuICAgIGNvbnRleHQ6IG51bGxcbiAgfTtcbiAgbWV0YWRhdGEudHJhbnNhY3Rpb25OYW1lID0gYnVpbGRUcmFuc2FjdGlvbk5hbWUodGFyZ2V0KTtcbiAgdmFyIGNsYXNzZXMgPSB0YXJnZXQuZ2V0QXR0cmlidXRlKCdjbGFzcycpO1xuXG4gIGlmIChjbGFzc2VzKSB7XG4gICAgbWV0YWRhdGEuY29udGV4dCA9IHtcbiAgICAgIGN1c3RvbToge1xuICAgICAgICBjbGFzc2VzOiBjbGFzc2VzXG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiBtZXRhZGF0YTtcbn1cblxuZnVuY3Rpb24gYnVpbGRUcmFuc2FjdGlvbk5hbWUodGFyZ2V0KSB7XG4gIHZhciBkdE5hbWUgPSBmaW5kQ3VzdG9tVHJhbnNhY3Rpb25OYW1lKHRhcmdldCk7XG5cbiAgaWYgKGR0TmFtZSkge1xuICAgIHJldHVybiBkdE5hbWU7XG4gIH1cblxuICB2YXIgdGFnTmFtZSA9IHRhcmdldC50YWdOYW1lLnRvTG93ZXJDYXNlKCk7XG4gIHZhciBuYW1lID0gdGFyZ2V0LmdldEF0dHJpYnV0ZSgnbmFtZScpO1xuXG4gIGlmICghIW5hbWUpIHtcbiAgICByZXR1cm4gdGFnTmFtZSArIFwiW1xcXCJcIiArIG5hbWUgKyBcIlxcXCJdXCI7XG4gIH1cblxuICByZXR1cm4gdGFnTmFtZTtcbn1cblxuZnVuY3Rpb24gZmluZEN1c3RvbVRyYW5zYWN0aW9uTmFtZSh0YXJnZXQpIHtcbiAgdmFyIHRyQ3VzdG9tTmFtZUF0dHJpYnV0ZSA9ICdkYXRhLXRyYW5zYWN0aW9uLW5hbWUnO1xuICB2YXIgZmFsbGJhY2tOYW1lID0gdGFyZ2V0LmdldEF0dHJpYnV0ZSh0ckN1c3RvbU5hbWVBdHRyaWJ1dGUpO1xuXG4gIGlmICh0YXJnZXQuY2xvc2VzdCkge1xuICAgIHZhciBlbGVtZW50ID0gdGFyZ2V0LmNsb3Nlc3QoSU5URVJBQ1RJVkVfU0VMRUNUT1IpO1xuICAgIHJldHVybiBlbGVtZW50ID8gZWxlbWVudC5nZXRBdHRyaWJ1dGUodHJDdXN0b21OYW1lQXR0cmlidXRlKSA6IGZhbGxiYWNrTmFtZTtcbiAgfVxuXG4gIHJldHVybiBmYWxsYmFja05hbWU7XG59IiwiaW1wb3J0IHsgUVVFVUVfQUREX1RSQU5TQUNUSU9OLCBRVUVVRV9GTFVTSCwgVFJBTlNBQ1RJT05fSUdOT1JFIH0gZnJvbSAnLi4vY29uc3RhbnRzJztcbmltcG9ydCB7IHN0YXRlIH0gZnJvbSAnLi4vLi4vc3RhdGUnO1xuaW1wb3J0IHsgbm93IH0gZnJvbSAnLi4vdXRpbHMnO1xuaW1wb3J0IHsgcmVwb3J0SW5wIH0gZnJvbSAnLi4vLi4vcGVyZm9ybWFuY2UtbW9uaXRvcmluZy9tZXRyaWNzL2lucC9yZXBvcnQnO1xuZXhwb3J0IGZ1bmN0aW9uIG9ic2VydmVQYWdlVmlzaWJpbGl0eShjb25maWdTZXJ2aWNlLCB0cmFuc2FjdGlvblNlcnZpY2UpIHtcbiAgaWYgKGRvY3VtZW50LnZpc2liaWxpdHlTdGF0ZSA9PT0gJ2hpZGRlbicpIHtcbiAgICBzdGF0ZS5sYXN0SGlkZGVuU3RhcnQgPSAwO1xuICB9XG5cbiAgdmFyIHZpc2liaWxpdHlDaGFuZ2VIYW5kbGVyID0gZnVuY3Rpb24gdmlzaWJpbGl0eUNoYW5nZUhhbmRsZXIoKSB7XG4gICAgaWYgKGRvY3VtZW50LnZpc2liaWxpdHlTdGF0ZSA9PT0gJ2hpZGRlbicpIHtcbiAgICAgIG9uUGFnZUhpZGRlbihjb25maWdTZXJ2aWNlLCB0cmFuc2FjdGlvblNlcnZpY2UpO1xuICAgIH1cbiAgfTtcblxuICB2YXIgcGFnZUhpZGVIYW5kbGVyID0gZnVuY3Rpb24gcGFnZUhpZGVIYW5kbGVyKCkge1xuICAgIHJldHVybiBvblBhZ2VIaWRkZW4oY29uZmlnU2VydmljZSwgdHJhbnNhY3Rpb25TZXJ2aWNlKTtcbiAgfTtcblxuICB2YXIgdXNlQ2FwdHVyZSA9IHRydWU7XG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCd2aXNpYmlsaXR5Y2hhbmdlJywgdmlzaWJpbGl0eUNoYW5nZUhhbmRsZXIsIHVzZUNhcHR1cmUpO1xuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncGFnZWhpZGUnLCBwYWdlSGlkZUhhbmRsZXIsIHVzZUNhcHR1cmUpO1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCd2aXNpYmlsaXR5Y2hhbmdlJywgdmlzaWJpbGl0eUNoYW5nZUhhbmRsZXIsIHVzZUNhcHR1cmUpO1xuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdwYWdlaGlkZScsIHBhZ2VIaWRlSGFuZGxlciwgdXNlQ2FwdHVyZSk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIG9uUGFnZUhpZGRlbihjb25maWdTZXJ2aWNlLCB0cmFuc2FjdGlvblNlcnZpY2UpIHtcbiAgdmFyIGlucFRyID0gcmVwb3J0SW5wKHRyYW5zYWN0aW9uU2VydmljZSk7XG5cbiAgaWYgKGlucFRyKSB7XG4gICAgdmFyIHVub2JzZXJ2ZSA9IGNvbmZpZ1NlcnZpY2Uub2JzZXJ2ZUV2ZW50KFFVRVVFX0FERF9UUkFOU0FDVElPTiwgZnVuY3Rpb24gKCkge1xuICAgICAgZW5kTWFuYWdlZFRyYW5zYWN0aW9uKGNvbmZpZ1NlcnZpY2UsIHRyYW5zYWN0aW9uU2VydmljZSk7XG4gICAgICB1bm9ic2VydmUoKTtcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBlbmRNYW5hZ2VkVHJhbnNhY3Rpb24oY29uZmlnU2VydmljZSwgdHJhbnNhY3Rpb25TZXJ2aWNlKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBlbmRNYW5hZ2VkVHJhbnNhY3Rpb24oY29uZmlnU2VydmljZSwgdHJhbnNhY3Rpb25TZXJ2aWNlKSB7XG4gIHZhciB0ciA9IHRyYW5zYWN0aW9uU2VydmljZS5nZXRDdXJyZW50VHJhbnNhY3Rpb24oKTtcblxuICBpZiAodHIpIHtcbiAgICB2YXIgdW5vYnNlcnZlRGlzY2FyZCA9IGNvbmZpZ1NlcnZpY2Uub2JzZXJ2ZUV2ZW50KFRSQU5TQUNUSU9OX0lHTk9SRSwgZnVuY3Rpb24gKCkge1xuICAgICAgc3RhdGUubGFzdEhpZGRlblN0YXJ0ID0gbm93KCk7XG4gICAgICB1bm9ic2VydmVEaXNjYXJkKCk7XG4gICAgICB1bm9ic2VydmVRdWV1ZUFkZCgpO1xuICAgIH0pO1xuICAgIHZhciB1bm9ic2VydmVRdWV1ZUFkZCA9IGNvbmZpZ1NlcnZpY2Uub2JzZXJ2ZUV2ZW50KFFVRVVFX0FERF9UUkFOU0FDVElPTiwgZnVuY3Rpb24gKCkge1xuICAgICAgY29uZmlnU2VydmljZS5kaXNwYXRjaEV2ZW50KFFVRVVFX0ZMVVNIKTtcbiAgICAgIHN0YXRlLmxhc3RIaWRkZW5TdGFydCA9IG5vdygpO1xuICAgICAgdW5vYnNlcnZlUXVldWVBZGQoKTtcbiAgICAgIHVub2JzZXJ2ZURpc2NhcmQoKTtcbiAgICB9KTtcbiAgICB0ci5lbmQoKTtcbiAgfSBlbHNlIHtcbiAgICBjb25maWdTZXJ2aWNlLmRpc3BhdGNoRXZlbnQoUVVFVUVfRkxVU0gpO1xuICAgIHN0YXRlLmxhc3RIaWRkZW5TdGFydCA9IG5vdygpO1xuICB9XG59IiwiaW1wb3J0IHsgUHJvbWlzZSB9IGZyb20gJy4uL3BvbHlmaWxscyc7XG5pbXBvcnQgeyBnbG9iYWxTdGF0ZSB9IGZyb20gJy4vcGF0Y2gtdXRpbHMnO1xuaW1wb3J0IHsgU0NIRURVTEUsIElOVk9LRSwgRkVUQ0ggfSBmcm9tICcuLi9jb25zdGFudHMnO1xuaW1wb3J0IHsgc2NoZWR1bGVNaWNyb1Rhc2sgfSBmcm9tICcuLi91dGlscyc7XG5pbXBvcnQgeyBpc0ZldGNoU3VwcG9ydGVkIH0gZnJvbSAnLi4vaHR0cC9mZXRjaCc7XG5leHBvcnQgZnVuY3Rpb24gcGF0Y2hGZXRjaChjYWxsYmFjaykge1xuICBpZiAoIWlzRmV0Y2hTdXBwb3J0ZWQoKSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNjaGVkdWxlVGFzayh0YXNrKSB7XG4gICAgdGFzay5zdGF0ZSA9IFNDSEVEVUxFO1xuICAgIGNhbGxiYWNrKFNDSEVEVUxFLCB0YXNrKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGludm9rZVRhc2sodGFzaykge1xuICAgIHRhc2suc3RhdGUgPSBJTlZPS0U7XG4gICAgY2FsbGJhY2soSU5WT0tFLCB0YXNrKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGhhbmRsZVJlc3BvbnNlRXJyb3IodGFzaywgZXJyb3IpIHtcbiAgICB0YXNrLmRhdGEuYWJvcnRlZCA9IGlzQWJvcnRFcnJvcihlcnJvcik7XG4gICAgdGFzay5kYXRhLmVycm9yID0gZXJyb3I7XG4gICAgaW52b2tlVGFzayh0YXNrKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlYWRTdHJlYW0oc3RyZWFtLCB0YXNrKSB7XG4gICAgdmFyIHJlYWRlciA9IHN0cmVhbS5nZXRSZWFkZXIoKTtcblxuICAgIHZhciByZWFkID0gZnVuY3Rpb24gcmVhZCgpIHtcbiAgICAgIHJlYWRlci5yZWFkKCkudGhlbihmdW5jdGlvbiAoX3JlZikge1xuICAgICAgICB2YXIgZG9uZSA9IF9yZWYuZG9uZTtcblxuICAgICAgICBpZiAoZG9uZSkge1xuICAgICAgICAgIGludm9rZVRhc2sodGFzayk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVhZCgpO1xuICAgICAgICB9XG4gICAgICB9LCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgaGFuZGxlUmVzcG9uc2VFcnJvcih0YXNrLCBlcnJvcik7XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgcmVhZCgpO1xuICB9XG5cbiAgdmFyIG5hdGl2ZUZldGNoID0gd2luZG93LmZldGNoO1xuXG4gIHdpbmRvdy5mZXRjaCA9IGZ1bmN0aW9uIChpbnB1dCwgaW5pdCkge1xuICAgIHZhciBmZXRjaFNlbGYgPSB0aGlzO1xuICAgIHZhciBhcmdzID0gYXJndW1lbnRzO1xuICAgIHZhciByZXF1ZXN0LCB1cmw7XG4gICAgdmFyIGlzVVJMID0gaW5wdXQgaW5zdGFuY2VvZiBVUkw7XG5cbiAgICBpZiAodHlwZW9mIGlucHV0ID09PSAnc3RyaW5nJyB8fCBpc1VSTCkge1xuICAgICAgcmVxdWVzdCA9IG5ldyBSZXF1ZXN0KGlucHV0LCBpbml0KTtcblxuICAgICAgaWYgKGlzVVJMKSB7XG4gICAgICAgIHVybCA9IHJlcXVlc3QudXJsO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdXJsID0gaW5wdXQ7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChpbnB1dCkge1xuICAgICAgcmVxdWVzdCA9IGlucHV0O1xuICAgICAgdXJsID0gcmVxdWVzdC51cmw7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBuYXRpdmVGZXRjaC5hcHBseShmZXRjaFNlbGYsIGFyZ3MpO1xuICAgIH1cblxuICAgIHZhciB0YXNrID0ge1xuICAgICAgc291cmNlOiBGRVRDSCxcbiAgICAgIHN0YXRlOiAnJyxcbiAgICAgIHR5cGU6ICdtYWNyb1Rhc2snLFxuICAgICAgZGF0YToge1xuICAgICAgICB0YXJnZXQ6IHJlcXVlc3QsXG4gICAgICAgIG1ldGhvZDogcmVxdWVzdC5tZXRob2QsXG4gICAgICAgIHVybDogdXJsLFxuICAgICAgICBhYm9ydGVkOiBmYWxzZVxuICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIGdsb2JhbFN0YXRlLmZldGNoSW5Qcm9ncmVzcyA9IHRydWU7XG4gICAgICBzY2hlZHVsZVRhc2sodGFzayk7XG4gICAgICB2YXIgcHJvbWlzZTtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgcHJvbWlzZSA9IG5hdGl2ZUZldGNoLmFwcGx5KGZldGNoU2VsZiwgW3JlcXVlc3RdKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgIHRhc2suZGF0YS5lcnJvciA9IGVycm9yO1xuICAgICAgICBpbnZva2VUYXNrKHRhc2spO1xuICAgICAgICBnbG9iYWxTdGF0ZS5mZXRjaEluUHJvZ3Jlc3MgPSBmYWxzZTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBwcm9taXNlLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgIHZhciBjbG9uZWRSZXNwb25zZSA9IHJlc3BvbnNlLmNsb25lID8gcmVzcG9uc2UuY2xvbmUoKSA6IHt9O1xuICAgICAgICByZXNvbHZlKHJlc3BvbnNlKTtcbiAgICAgICAgc2NoZWR1bGVNaWNyb1Rhc2soZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHRhc2suZGF0YS5yZXNwb25zZSA9IHJlc3BvbnNlO1xuICAgICAgICAgIHZhciBib2R5ID0gY2xvbmVkUmVzcG9uc2UuYm9keTtcblxuICAgICAgICAgIGlmIChib2R5KSB7XG4gICAgICAgICAgICByZWFkU3RyZWFtKGJvZHksIHRhc2spO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpbnZva2VUYXNrKHRhc2spO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9LCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgc2NoZWR1bGVNaWNyb1Rhc2soZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGhhbmRsZVJlc3BvbnNlRXJyb3IodGFzaywgZXJyb3IpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgICAgZ2xvYmFsU3RhdGUuZmV0Y2hJblByb2dyZXNzID0gZmFsc2U7XG4gICAgfSk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGlzQWJvcnRFcnJvcihlcnJvcikge1xuICByZXR1cm4gZXJyb3IgJiYgZXJyb3IubmFtZSA9PT0gJ0Fib3J0RXJyb3InO1xufSIsImltcG9ydCB7IElOVk9LRSwgSElTVE9SWSB9IGZyb20gJy4uL2NvbnN0YW50cyc7XG5leHBvcnQgZnVuY3Rpb24gcGF0Y2hIaXN0b3J5KGNhbGxiYWNrKSB7XG4gIGlmICghd2luZG93Lmhpc3RvcnkpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICB2YXIgbmF0aXZlUHVzaFN0YXRlID0gaGlzdG9yeS5wdXNoU3RhdGU7XG5cbiAgaWYgKHR5cGVvZiBuYXRpdmVQdXNoU3RhdGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICBoaXN0b3J5LnB1c2hTdGF0ZSA9IGZ1bmN0aW9uIChzdGF0ZSwgdGl0bGUsIHVybCkge1xuICAgICAgdmFyIHRhc2sgPSB7XG4gICAgICAgIHNvdXJjZTogSElTVE9SWSxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIHN0YXRlOiBzdGF0ZSxcbiAgICAgICAgICB0aXRsZTogdGl0bGUsXG4gICAgICAgICAgdXJsOiB1cmxcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIGNhbGxiYWNrKElOVk9LRSwgdGFzayk7XG4gICAgICBuYXRpdmVQdXNoU3RhdGUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9O1xuICB9XG59IiwiaW1wb3J0IHsgcGF0Y2hYTUxIdHRwUmVxdWVzdCB9IGZyb20gJy4veGhyLXBhdGNoJztcbmltcG9ydCB7IHBhdGNoRmV0Y2ggfSBmcm9tICcuL2ZldGNoLXBhdGNoJztcbmltcG9ydCB7IHBhdGNoSGlzdG9yeSB9IGZyb20gJy4vaGlzdG9yeS1wYXRjaCc7XG5pbXBvcnQgRXZlbnRIYW5kbGVyIGZyb20gJy4uL2V2ZW50LWhhbmRsZXInO1xuaW1wb3J0IHsgSElTVE9SWSwgRkVUQ0gsIFhNTEhUVFBSRVFVRVNUIH0gZnJvbSAnLi4vY29uc3RhbnRzJztcbnZhciBwYXRjaEV2ZW50SGFuZGxlciA9IG5ldyBFdmVudEhhbmRsZXIoKTtcbnZhciBhbHJlYWR5UGF0Y2hlZCA9IGZhbHNlO1xuXG5mdW5jdGlvbiBwYXRjaEFsbCgpIHtcbiAgaWYgKCFhbHJlYWR5UGF0Y2hlZCkge1xuICAgIGFscmVhZHlQYXRjaGVkID0gdHJ1ZTtcbiAgICBwYXRjaFhNTEh0dHBSZXF1ZXN0KGZ1bmN0aW9uIChldmVudCwgdGFzaykge1xuICAgICAgcGF0Y2hFdmVudEhhbmRsZXIuc2VuZChYTUxIVFRQUkVRVUVTVCwgW2V2ZW50LCB0YXNrXSk7XG4gICAgfSk7XG4gICAgcGF0Y2hGZXRjaChmdW5jdGlvbiAoZXZlbnQsIHRhc2spIHtcbiAgICAgIHBhdGNoRXZlbnRIYW5kbGVyLnNlbmQoRkVUQ0gsIFtldmVudCwgdGFza10pO1xuICAgIH0pO1xuICAgIHBhdGNoSGlzdG9yeShmdW5jdGlvbiAoZXZlbnQsIHRhc2spIHtcbiAgICAgIHBhdGNoRXZlbnRIYW5kbGVyLnNlbmQoSElTVE9SWSwgW2V2ZW50LCB0YXNrXSk7XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gcGF0Y2hFdmVudEhhbmRsZXI7XG59XG5cbmV4cG9ydCB7IHBhdGNoQWxsLCBwYXRjaEV2ZW50SGFuZGxlciB9OyIsImV4cG9ydCB2YXIgZ2xvYmFsU3RhdGUgPSB7XG4gIGZldGNoSW5Qcm9ncmVzczogZmFsc2Vcbn07XG5leHBvcnQgZnVuY3Rpb24gYXBtU3ltYm9sKG5hbWUpIHtcbiAgcmV0dXJuICdfX2FwbV9zeW1ib2xfXycgKyBuYW1lO1xufVxuXG5mdW5jdGlvbiBpc1Byb3BlcnR5V3JpdGFibGUocHJvcGVydHlEZXNjKSB7XG4gIGlmICghcHJvcGVydHlEZXNjKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBpZiAocHJvcGVydHlEZXNjLndyaXRhYmxlID09PSBmYWxzZSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiAhKHR5cGVvZiBwcm9wZXJ0eURlc2MuZ2V0ID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBwcm9wZXJ0eURlc2Muc2V0ID09PSAndW5kZWZpbmVkJyk7XG59XG5cbmZ1bmN0aW9uIGF0dGFjaE9yaWdpblRvUGF0Y2hlZChwYXRjaGVkLCBvcmlnaW5hbCkge1xuICBwYXRjaGVkW2FwbVN5bWJvbCgnT3JpZ2luYWxEZWxlZ2F0ZScpXSA9IG9yaWdpbmFsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGF0Y2hNZXRob2QodGFyZ2V0LCBuYW1lLCBwYXRjaEZuKSB7XG4gIHZhciBwcm90byA9IHRhcmdldDtcblxuICB3aGlsZSAocHJvdG8gJiYgIXByb3RvLmhhc093blByb3BlcnR5KG5hbWUpKSB7XG4gICAgcHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YocHJvdG8pO1xuICB9XG5cbiAgaWYgKCFwcm90byAmJiB0YXJnZXRbbmFtZV0pIHtcbiAgICBwcm90byA9IHRhcmdldDtcbiAgfVxuXG4gIHZhciBkZWxlZ2F0ZU5hbWUgPSBhcG1TeW1ib2wobmFtZSk7XG4gIHZhciBkZWxlZ2F0ZTtcblxuICBpZiAocHJvdG8gJiYgIShkZWxlZ2F0ZSA9IHByb3RvW2RlbGVnYXRlTmFtZV0pKSB7XG4gICAgZGVsZWdhdGUgPSBwcm90b1tkZWxlZ2F0ZU5hbWVdID0gcHJvdG9bbmFtZV07XG4gICAgdmFyIGRlc2MgPSBwcm90byAmJiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHByb3RvLCBuYW1lKTtcblxuICAgIGlmIChpc1Byb3BlcnR5V3JpdGFibGUoZGVzYykpIHtcbiAgICAgIHZhciBwYXRjaERlbGVnYXRlID0gcGF0Y2hGbihkZWxlZ2F0ZSwgZGVsZWdhdGVOYW1lLCBuYW1lKTtcblxuICAgICAgcHJvdG9bbmFtZV0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBwYXRjaERlbGVnYXRlKHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB9O1xuXG4gICAgICBhdHRhY2hPcmlnaW5Ub1BhdGNoZWQocHJvdG9bbmFtZV0sIGRlbGVnYXRlKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZGVsZWdhdGU7XG59XG5leHBvcnQgdmFyIFhIUl9JR05PUkUgPSBhcG1TeW1ib2woJ3hocklnbm9yZScpO1xuZXhwb3J0IHZhciBYSFJfU1lOQyA9IGFwbVN5bWJvbCgneGhyU3luYycpO1xuZXhwb3J0IHZhciBYSFJfVVJMID0gYXBtU3ltYm9sKCd4aHJVUkwnKTtcbmV4cG9ydCB2YXIgWEhSX01FVEhPRCA9IGFwbVN5bWJvbCgneGhyTWV0aG9kJyk7IiwiaW1wb3J0IHsgcGF0Y2hNZXRob2QsIFhIUl9TWU5DLCBYSFJfVVJMLCBYSFJfTUVUSE9ELCBYSFJfSUdOT1JFIH0gZnJvbSAnLi9wYXRjaC11dGlscyc7XG5pbXBvcnQgeyBTQ0hFRFVMRSwgSU5WT0tFLCBYTUxIVFRQUkVRVUVTVCwgQUREX0VWRU5UX0xJU1RFTkVSX1NUUiB9IGZyb20gJy4uL2NvbnN0YW50cyc7XG5leHBvcnQgZnVuY3Rpb24gcGF0Y2hYTUxIdHRwUmVxdWVzdChjYWxsYmFjaykge1xuICB2YXIgWE1MSHR0cFJlcXVlc3RQcm90b3R5cGUgPSBYTUxIdHRwUmVxdWVzdC5wcm90b3R5cGU7XG5cbiAgaWYgKCFYTUxIdHRwUmVxdWVzdFByb3RvdHlwZSB8fCAhWE1MSHR0cFJlcXVlc3RQcm90b3R5cGVbQUREX0VWRU5UX0xJU1RFTkVSX1NUUl0pIHtcbiAgICByZXR1cm47XG4gIH1cblxuICB2YXIgUkVBRFlfU1RBVEVfQ0hBTkdFID0gJ3JlYWR5c3RhdGVjaGFuZ2UnO1xuICB2YXIgTE9BRCA9ICdsb2FkJztcbiAgdmFyIEVSUk9SID0gJ2Vycm9yJztcbiAgdmFyIFRJTUVPVVQgPSAndGltZW91dCc7XG4gIHZhciBBQk9SVCA9ICdhYm9ydCc7XG5cbiAgZnVuY3Rpb24gaW52b2tlVGFzayh0YXNrLCBzdGF0dXMpIHtcbiAgICBpZiAodGFzay5zdGF0ZSAhPT0gSU5WT0tFKSB7XG4gICAgICB0YXNrLnN0YXRlID0gSU5WT0tFO1xuICAgICAgdGFzay5kYXRhLnN0YXR1cyA9IHN0YXR1cztcbiAgICAgIGNhbGxiYWNrKElOVk9LRSwgdGFzayk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gc2NoZWR1bGVUYXNrKHRhc2spIHtcbiAgICBpZiAodGFzay5zdGF0ZSA9PT0gU0NIRURVTEUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0YXNrLnN0YXRlID0gU0NIRURVTEU7XG4gICAgY2FsbGJhY2soU0NIRURVTEUsIHRhc2spO1xuICAgIHZhciB0YXJnZXQgPSB0YXNrLmRhdGEudGFyZ2V0O1xuXG4gICAgZnVuY3Rpb24gYWRkTGlzdGVuZXIobmFtZSkge1xuICAgICAgdGFyZ2V0W0FERF9FVkVOVF9MSVNURU5FUl9TVFJdKG5hbWUsIGZ1bmN0aW9uIChfcmVmKSB7XG4gICAgICAgIHZhciB0eXBlID0gX3JlZi50eXBlO1xuXG4gICAgICAgIGlmICh0eXBlID09PSBSRUFEWV9TVEFURV9DSEFOR0UpIHtcbiAgICAgICAgICBpZiAodGFyZ2V0LnJlYWR5U3RhdGUgPT09IDQgJiYgdGFyZ2V0LnN0YXR1cyAhPT0gMCkge1xuICAgICAgICAgICAgaW52b2tlVGFzayh0YXNrLCAnc3VjY2VzcycpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgc3RhdHVzID0gdHlwZSA9PT0gTE9BRCA/ICdzdWNjZXNzJyA6IHR5cGU7XG4gICAgICAgICAgaW52b2tlVGFzayh0YXNrLCBzdGF0dXMpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBhZGRMaXN0ZW5lcihSRUFEWV9TVEFURV9DSEFOR0UpO1xuICAgIGFkZExpc3RlbmVyKExPQUQpO1xuICAgIGFkZExpc3RlbmVyKFRJTUVPVVQpO1xuICAgIGFkZExpc3RlbmVyKEVSUk9SKTtcbiAgICBhZGRMaXN0ZW5lcihBQk9SVCk7XG4gIH1cblxuICB2YXIgb3Blbk5hdGl2ZSA9IHBhdGNoTWV0aG9kKFhNTEh0dHBSZXF1ZXN0UHJvdG90eXBlLCAnb3BlbicsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHNlbGYsIGFyZ3MpIHtcbiAgICAgIGlmICghc2VsZltYSFJfSUdOT1JFXSkge1xuICAgICAgICBzZWxmW1hIUl9NRVRIT0RdID0gYXJnc1swXTtcbiAgICAgICAgc2VsZltYSFJfVVJMXSA9IGFyZ3NbMV07XG4gICAgICAgIHNlbGZbWEhSX1NZTkNdID0gYXJnc1syXSA9PT0gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBvcGVuTmF0aXZlLmFwcGx5KHNlbGYsIGFyZ3MpO1xuICAgIH07XG4gIH0pO1xuICB2YXIgc2VuZE5hdGl2ZSA9IHBhdGNoTWV0aG9kKFhNTEh0dHBSZXF1ZXN0UHJvdG90eXBlLCAnc2VuZCcsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHNlbGYsIGFyZ3MpIHtcbiAgICAgIGlmIChzZWxmW1hIUl9JR05PUkVdKSB7XG4gICAgICAgIHJldHVybiBzZW5kTmF0aXZlLmFwcGx5KHNlbGYsIGFyZ3MpO1xuICAgICAgfVxuXG4gICAgICB2YXIgdGFzayA9IHtcbiAgICAgICAgc291cmNlOiBYTUxIVFRQUkVRVUVTVCxcbiAgICAgICAgc3RhdGU6ICcnLFxuICAgICAgICB0eXBlOiAnbWFjcm9UYXNrJyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIHRhcmdldDogc2VsZixcbiAgICAgICAgICBtZXRob2Q6IHNlbGZbWEhSX01FVEhPRF0sXG4gICAgICAgICAgc3luYzogc2VsZltYSFJfU1lOQ10sXG4gICAgICAgICAgdXJsOiBzZWxmW1hIUl9VUkxdLFxuICAgICAgICAgIHN0YXR1czogJydcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgc2NoZWR1bGVUYXNrKHRhc2spO1xuICAgICAgICByZXR1cm4gc2VuZE5hdGl2ZS5hcHBseShzZWxmLCBhcmdzKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgaW52b2tlVGFzayh0YXNrLCBFUlJPUik7XG4gICAgICAgIHRocm93IGU7XG4gICAgICB9XG4gICAgfTtcbiAgfSk7XG59IiwiaW1wb3J0IFByb21pc2VQb2xseWZpbGwgZnJvbSAncHJvbWlzZS1wb2x5ZmlsbCc7XG5pbXBvcnQgeyBpc0Jyb3dzZXIgfSBmcm9tICcuL3V0aWxzJztcbnZhciBsb2NhbCA9IHt9O1xuXG5pZiAoaXNCcm93c2VyKSB7XG4gIGxvY2FsID0gd2luZG93O1xufSBlbHNlIGlmICh0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgbG9jYWwgPSBzZWxmO1xufVxuXG52YXIgUHJvbWlzZSA9ICdQcm9taXNlJyBpbiBsb2NhbCA/IGxvY2FsLlByb21pc2UgOiBQcm9taXNlUG9sbHlmaWxsO1xuZXhwb3J0IHsgUHJvbWlzZSB9OyIsInZhciBRdWV1ZSA9IGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gUXVldWUob25GbHVzaCwgb3B0cykge1xuICAgIGlmIChvcHRzID09PSB2b2lkIDApIHtcbiAgICAgIG9wdHMgPSB7fTtcbiAgICB9XG5cbiAgICB0aGlzLm9uRmx1c2ggPSBvbkZsdXNoO1xuICAgIHRoaXMuaXRlbXMgPSBbXTtcbiAgICB0aGlzLnF1ZXVlTGltaXQgPSBvcHRzLnF1ZXVlTGltaXQgfHwgLTE7XG4gICAgdGhpcy5mbHVzaEludGVydmFsID0gb3B0cy5mbHVzaEludGVydmFsIHx8IDA7XG4gICAgdGhpcy50aW1lb3V0SWQgPSB1bmRlZmluZWQ7XG4gIH1cblxuICB2YXIgX3Byb3RvID0gUXVldWUucHJvdG90eXBlO1xuXG4gIF9wcm90by5fc2V0VGltZXIgPSBmdW5jdGlvbiBfc2V0VGltZXIoKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIHRoaXMudGltZW91dElkID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gX3RoaXMuZmx1c2goKTtcbiAgICB9LCB0aGlzLmZsdXNoSW50ZXJ2YWwpO1xuICB9O1xuXG4gIF9wcm90by5fY2xlYXIgPSBmdW5jdGlvbiBfY2xlYXIoKSB7XG4gICAgaWYgKHR5cGVvZiB0aGlzLnRpbWVvdXRJZCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXRJZCk7XG4gICAgICB0aGlzLnRpbWVvdXRJZCA9IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICB0aGlzLml0ZW1zID0gW107XG4gIH07XG5cbiAgX3Byb3RvLmZsdXNoID0gZnVuY3Rpb24gZmx1c2goKSB7XG4gICAgdGhpcy5vbkZsdXNoKHRoaXMuaXRlbXMpO1xuXG4gICAgdGhpcy5fY2xlYXIoKTtcbiAgfTtcblxuICBfcHJvdG8uYWRkID0gZnVuY3Rpb24gYWRkKGl0ZW0pIHtcbiAgICB0aGlzLml0ZW1zLnB1c2goaXRlbSk7XG5cbiAgICBpZiAodGhpcy5xdWV1ZUxpbWl0ICE9PSAtMSAmJiB0aGlzLml0ZW1zLmxlbmd0aCA+PSB0aGlzLnF1ZXVlTGltaXQpIHtcbiAgICAgIHRoaXMuZmx1c2goKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHR5cGVvZiB0aGlzLnRpbWVvdXRJZCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgdGhpcy5fc2V0VGltZXIoKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIFF1ZXVlO1xufSgpO1xuXG5leHBvcnQgZGVmYXVsdCBRdWV1ZTsiLCJ2YXIgX3NlcnZpY2VDcmVhdG9ycztcblxuaW1wb3J0IEFwbVNlcnZlciBmcm9tICcuL2FwbS1zZXJ2ZXInO1xuaW1wb3J0IENvbmZpZ1NlcnZpY2UgZnJvbSAnLi9jb25maWctc2VydmljZSc7XG5pbXBvcnQgTG9nZ2luZ1NlcnZpY2UgZnJvbSAnLi9sb2dnaW5nLXNlcnZpY2UnO1xuaW1wb3J0IHsgQ09ORklHX0NIQU5HRSwgQ09ORklHX1NFUlZJQ0UsIExPR0dJTkdfU0VSVklDRSwgQVBNX1NFUlZFUiB9IGZyb20gJy4vY29uc3RhbnRzJztcbmltcG9ydCB7IF9fREVWX18gfSBmcm9tICcuLi9zdGF0ZSc7XG52YXIgc2VydmljZUNyZWF0b3JzID0gKF9zZXJ2aWNlQ3JlYXRvcnMgPSB7fSwgX3NlcnZpY2VDcmVhdG9yc1tDT05GSUdfU0VSVklDRV0gPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBuZXcgQ29uZmlnU2VydmljZSgpO1xufSwgX3NlcnZpY2VDcmVhdG9yc1tMT0dHSU5HX1NFUlZJQ0VdID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gbmV3IExvZ2dpbmdTZXJ2aWNlKHtcbiAgICBwcmVmaXg6ICdbRWxhc3RpYyBBUE1dICdcbiAgfSk7XG59LCBfc2VydmljZUNyZWF0b3JzW0FQTV9TRVJWRVJdID0gZnVuY3Rpb24gKGZhY3RvcnkpIHtcbiAgdmFyIF9mYWN0b3J5JGdldFNlcnZpY2UgPSBmYWN0b3J5LmdldFNlcnZpY2UoW0NPTkZJR19TRVJWSUNFLCBMT0dHSU5HX1NFUlZJQ0VdKSxcbiAgICAgIGNvbmZpZ1NlcnZpY2UgPSBfZmFjdG9yeSRnZXRTZXJ2aWNlWzBdLFxuICAgICAgbG9nZ2luZ1NlcnZpY2UgPSBfZmFjdG9yeSRnZXRTZXJ2aWNlWzFdO1xuXG4gIHJldHVybiBuZXcgQXBtU2VydmVyKGNvbmZpZ1NlcnZpY2UsIGxvZ2dpbmdTZXJ2aWNlKTtcbn0sIF9zZXJ2aWNlQ3JlYXRvcnMpO1xuXG52YXIgU2VydmljZUZhY3RvcnkgPSBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIFNlcnZpY2VGYWN0b3J5KCkge1xuICAgIHRoaXMuaW5zdGFuY2VzID0ge307XG4gICAgdGhpcy5pbml0aWFsaXplZCA9IGZhbHNlO1xuICB9XG5cbiAgdmFyIF9wcm90byA9IFNlcnZpY2VGYWN0b3J5LnByb3RvdHlwZTtcblxuICBfcHJvdG8uaW5pdCA9IGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgaWYgKHRoaXMuaW5pdGlhbGl6ZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcbiAgICB2YXIgY29uZmlnU2VydmljZSA9IHRoaXMuZ2V0U2VydmljZShDT05GSUdfU0VSVklDRSk7XG4gICAgY29uZmlnU2VydmljZS5pbml0KCk7XG5cbiAgICB2YXIgX3RoaXMkZ2V0U2VydmljZSA9IHRoaXMuZ2V0U2VydmljZShbTE9HR0lOR19TRVJWSUNFLCBBUE1fU0VSVkVSXSksXG4gICAgICAgIGxvZ2dpbmdTZXJ2aWNlID0gX3RoaXMkZ2V0U2VydmljZVswXSxcbiAgICAgICAgYXBtU2VydmVyID0gX3RoaXMkZ2V0U2VydmljZVsxXTtcblxuICAgIGNvbmZpZ1NlcnZpY2UuZXZlbnRzLm9ic2VydmUoQ09ORklHX0NIQU5HRSwgZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGxvZ0xldmVsID0gY29uZmlnU2VydmljZS5nZXQoJ2xvZ0xldmVsJyk7XG4gICAgICBsb2dnaW5nU2VydmljZS5zZXRMZXZlbChsb2dMZXZlbCk7XG4gICAgfSk7XG4gICAgYXBtU2VydmVyLmluaXQoKTtcbiAgfTtcblxuICBfcHJvdG8uZ2V0U2VydmljZSA9IGZ1bmN0aW9uIGdldFNlcnZpY2UobmFtZSkge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICBpZiAodHlwZW9mIG5hbWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICBpZiAoIXRoaXMuaW5zdGFuY2VzW25hbWVdKSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2VydmljZUNyZWF0b3JzW25hbWVdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgdGhpcy5pbnN0YW5jZXNbbmFtZV0gPSBzZXJ2aWNlQ3JlYXRvcnNbbmFtZV0odGhpcyk7XG4gICAgICAgIH0gZWxzZSBpZiAoX19ERVZfXykge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdDYW5ub3QgZ2V0IHNlcnZpY2UsIE5vIGNyZWF0b3IgZm9yOiAnICsgbmFtZSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuaW5zdGFuY2VzW25hbWVdO1xuICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShuYW1lKSkge1xuICAgICAgcmV0dXJuIG5hbWUubWFwKGZ1bmN0aW9uIChuKSB7XG4gICAgICAgIHJldHVybiBfdGhpcy5nZXRTZXJ2aWNlKG4pO1xuICAgICAgfSk7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiBTZXJ2aWNlRmFjdG9yeTtcbn0oKTtcblxuZXhwb3J0IHsgc2VydmljZUNyZWF0b3JzLCBTZXJ2aWNlRmFjdG9yeSB9OyIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHRocm90dGxlKGZuLCBvblRocm90dGxlLCBvcHRzKSB7XG4gIHZhciBjb250ZXh0ID0gdGhpcztcbiAgdmFyIGxpbWl0ID0gb3B0cy5saW1pdDtcbiAgdmFyIGludGVydmFsID0gb3B0cy5pbnRlcnZhbDtcbiAgdmFyIGNvdW50ZXIgPSAwO1xuICB2YXIgdGltZW91dElkO1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIGNvdW50ZXIrKztcblxuICAgIGlmICh0eXBlb2YgdGltZW91dElkID09PSAndW5kZWZpbmVkJykge1xuICAgICAgdGltZW91dElkID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvdW50ZXIgPSAwO1xuICAgICAgICB0aW1lb3V0SWQgPSB1bmRlZmluZWQ7XG4gICAgICB9LCBpbnRlcnZhbCk7XG4gICAgfVxuXG4gICAgaWYgKGNvdW50ZXIgPiBsaW1pdCAmJiB0eXBlb2Ygb25UaHJvdHRsZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIG9uVGhyb3R0bGUuYXBwbHkoY29udGV4dCwgYXJndW1lbnRzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZuLmFwcGx5KGNvbnRleHQsIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9O1xufSIsImltcG9ydCB7IEtFWVdPUkRfTElNSVQgfSBmcm9tICcuL2NvbnN0YW50cyc7XG52YXIgTUVUQURBVEFfTU9ERUwgPSB7XG4gIHNlcnZpY2U6IHtcbiAgICBuYW1lOiBbS0VZV09SRF9MSU1JVCwgdHJ1ZV0sXG4gICAgdmVyc2lvbjogdHJ1ZSxcbiAgICBhZ2VudDoge1xuICAgICAgdmVyc2lvbjogW0tFWVdPUkRfTElNSVQsIHRydWVdXG4gICAgfSxcbiAgICBlbnZpcm9ubWVudDogdHJ1ZVxuICB9LFxuICBsYWJlbHM6IHtcbiAgICAnKic6IHRydWVcbiAgfVxufTtcbnZhciBSRVNQT05TRV9NT0RFTCA9IHtcbiAgJyonOiB0cnVlLFxuICBoZWFkZXJzOiB7XG4gICAgJyonOiB0cnVlXG4gIH1cbn07XG52YXIgREVTVElOQVRJT05fTU9ERUwgPSB7XG4gIGFkZHJlc3M6IFtLRVlXT1JEX0xJTUlUXSxcbiAgc2VydmljZToge1xuICAgICcqJzogW0tFWVdPUkRfTElNSVQsIHRydWVdXG4gIH1cbn07XG52YXIgQ09OVEVYVF9NT0RFTCA9IHtcbiAgdXNlcjoge1xuICAgIGlkOiB0cnVlLFxuICAgIGVtYWlsOiB0cnVlLFxuICAgIHVzZXJuYW1lOiB0cnVlXG4gIH0sXG4gIHRhZ3M6IHtcbiAgICAnKic6IHRydWVcbiAgfSxcbiAgaHR0cDoge1xuICAgIHJlc3BvbnNlOiBSRVNQT05TRV9NT0RFTFxuICB9LFxuICBkZXN0aW5hdGlvbjogREVTVElOQVRJT05fTU9ERUwsXG4gIHJlc3BvbnNlOiBSRVNQT05TRV9NT0RFTFxufTtcbnZhciBTUEFOX01PREVMID0ge1xuICBuYW1lOiBbS0VZV09SRF9MSU1JVCwgdHJ1ZV0sXG4gIHR5cGU6IFtLRVlXT1JEX0xJTUlULCB0cnVlXSxcbiAgaWQ6IFtLRVlXT1JEX0xJTUlULCB0cnVlXSxcbiAgdHJhY2VfaWQ6IFtLRVlXT1JEX0xJTUlULCB0cnVlXSxcbiAgcGFyZW50X2lkOiBbS0VZV09SRF9MSU1JVCwgdHJ1ZV0sXG4gIHRyYW5zYWN0aW9uX2lkOiBbS0VZV09SRF9MSU1JVCwgdHJ1ZV0sXG4gIHN1YnR5cGU6IHRydWUsXG4gIGFjdGlvbjogdHJ1ZSxcbiAgY29udGV4dDogQ09OVEVYVF9NT0RFTFxufTtcbnZhciBUUkFOU0FDVElPTl9NT0RFTCA9IHtcbiAgbmFtZTogdHJ1ZSxcbiAgcGFyZW50X2lkOiB0cnVlLFxuICB0eXBlOiBbS0VZV09SRF9MSU1JVCwgdHJ1ZV0sXG4gIGlkOiBbS0VZV09SRF9MSU1JVCwgdHJ1ZV0sXG4gIHRyYWNlX2lkOiBbS0VZV09SRF9MSU1JVCwgdHJ1ZV0sXG4gIHNwYW5fY291bnQ6IHtcbiAgICBzdGFydGVkOiBbS0VZV09SRF9MSU1JVCwgdHJ1ZV1cbiAgfSxcbiAgY29udGV4dDogQ09OVEVYVF9NT0RFTFxufTtcbnZhciBFUlJPUl9NT0RFTCA9IHtcbiAgaWQ6IFtLRVlXT1JEX0xJTUlULCB0cnVlXSxcbiAgdHJhY2VfaWQ6IHRydWUsXG4gIHRyYW5zYWN0aW9uX2lkOiB0cnVlLFxuICBwYXJlbnRfaWQ6IHRydWUsXG4gIGN1bHByaXQ6IHRydWUsXG4gIGV4Y2VwdGlvbjoge1xuICAgIHR5cGU6IHRydWVcbiAgfSxcbiAgdHJhbnNhY3Rpb246IHtcbiAgICB0eXBlOiB0cnVlXG4gIH0sXG4gIGNvbnRleHQ6IENPTlRFWFRfTU9ERUxcbn07XG5cbmZ1bmN0aW9uIHRydW5jYXRlKHZhbHVlLCBsaW1pdCwgcmVxdWlyZWQsIHBsYWNlaG9sZGVyKSB7XG4gIGlmIChsaW1pdCA9PT0gdm9pZCAwKSB7XG4gICAgbGltaXQgPSBLRVlXT1JEX0xJTUlUO1xuICB9XG5cbiAgaWYgKHJlcXVpcmVkID09PSB2b2lkIDApIHtcbiAgICByZXF1aXJlZCA9IGZhbHNlO1xuICB9XG5cbiAgaWYgKHBsYWNlaG9sZGVyID09PSB2b2lkIDApIHtcbiAgICBwbGFjZWhvbGRlciA9ICdOL0EnO1xuICB9XG5cbiAgaWYgKHJlcXVpcmVkICYmIGlzRW1wdHkodmFsdWUpKSB7XG4gICAgdmFsdWUgPSBwbGFjZWhvbGRlcjtcbiAgfVxuXG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHZhbHVlLnN1YnN0cmluZygwLCBsaW1pdCk7XG4gIH1cblxuICByZXR1cm4gdmFsdWU7XG59XG5cbmZ1bmN0aW9uIGlzRW1wdHkodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlID09IG51bGwgfHwgdmFsdWUgPT09ICcnIHx8IHR5cGVvZiB2YWx1ZSA9PT0gJ3VuZGVmaW5lZCc7XG59XG5cbmZ1bmN0aW9uIHJlcGxhY2VWYWx1ZSh0YXJnZXQsIGtleSwgY3Vyck1vZGVsKSB7XG4gIHZhciB2YWx1ZSA9IHRydW5jYXRlKHRhcmdldFtrZXldLCBjdXJyTW9kZWxbMF0sIGN1cnJNb2RlbFsxXSk7XG5cbiAgaWYgKGlzRW1wdHkodmFsdWUpKSB7XG4gICAgZGVsZXRlIHRhcmdldFtrZXldO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHRhcmdldFtrZXldID0gdmFsdWU7XG59XG5cbmZ1bmN0aW9uIHRydW5jYXRlTW9kZWwobW9kZWwsIHRhcmdldCwgY2hpbGRUYXJnZXQpIHtcbiAgaWYgKG1vZGVsID09PSB2b2lkIDApIHtcbiAgICBtb2RlbCA9IHt9O1xuICB9XG5cbiAgaWYgKGNoaWxkVGFyZ2V0ID09PSB2b2lkIDApIHtcbiAgICBjaGlsZFRhcmdldCA9IHRhcmdldDtcbiAgfVxuXG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXMobW9kZWwpO1xuICB2YXIgZW1wdHlBcnIgPSBbXTtcblxuICB2YXIgX2xvb3AgPSBmdW5jdGlvbiBfbG9vcChpKSB7XG4gICAgdmFyIGN1cnJLZXkgPSBrZXlzW2ldO1xuICAgIHZhciBjdXJyTW9kZWwgPSBtb2RlbFtjdXJyS2V5XSA9PT0gdHJ1ZSA/IGVtcHR5QXJyIDogbW9kZWxbY3VycktleV07XG5cbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoY3Vyck1vZGVsKSkge1xuICAgICAgdHJ1bmNhdGVNb2RlbChjdXJyTW9kZWwsIHRhcmdldCwgY2hpbGRUYXJnZXRbY3VycktleV0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoY3VycktleSA9PT0gJyonKSB7XG4gICAgICAgIE9iamVjdC5rZXlzKGNoaWxkVGFyZ2V0KS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICByZXR1cm4gcmVwbGFjZVZhbHVlKGNoaWxkVGFyZ2V0LCBrZXksIGN1cnJNb2RlbCk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVwbGFjZVZhbHVlKGNoaWxkVGFyZ2V0LCBjdXJyS2V5LCBjdXJyTW9kZWwpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcbiAgICBfbG9vcChpKTtcbiAgfVxuXG4gIHJldHVybiB0YXJnZXQ7XG59XG5cbmV4cG9ydCB7IHRydW5jYXRlLCB0cnVuY2F0ZU1vZGVsLCBTUEFOX01PREVMLCBUUkFOU0FDVElPTl9NT0RFTCwgRVJST1JfTU9ERUwsIE1FVEFEQVRBX01PREVMLCBSRVNQT05TRV9NT0RFTCB9OyIsImltcG9ydCB7IGlzQnJvd3NlciB9IGZyb20gJy4vdXRpbHMnO1xuXG5mdW5jdGlvbiBpc0RlZmF1bHRQb3J0KHBvcnQsIHByb3RvY29sKSB7XG4gIHN3aXRjaCAocHJvdG9jb2wpIHtcbiAgICBjYXNlICdodHRwOic6XG4gICAgICByZXR1cm4gcG9ydCA9PT0gJzgwJztcblxuICAgIGNhc2UgJ2h0dHBzOic6XG4gICAgICByZXR1cm4gcG9ydCA9PT0gJzQ0Myc7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxudmFyIFJVTEVTID0gW1snIycsICdoYXNoJ10sIFsnPycsICdxdWVyeSddLCBbJy8nLCAncGF0aCddLCBbJ0AnLCAnYXV0aCcsIDFdLCBbTmFOLCAnaG9zdCcsIHVuZGVmaW5lZCwgMV1dO1xudmFyIFBST1RPQ09MX1JFR0VYID0gL14oW2Etel1bYS16MC05ListXSo6KT8oXFwvXFwvKT8oW1xcU1xcc10qKS9pO1xuZXhwb3J0IHZhciBVcmwgPSBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIFVybCh1cmwpIHtcbiAgICB2YXIgX3RoaXMkZXh0cmFjdFByb3RvY29sID0gdGhpcy5leHRyYWN0UHJvdG9jb2wodXJsIHx8ICcnKSxcbiAgICAgICAgcHJvdG9jb2wgPSBfdGhpcyRleHRyYWN0UHJvdG9jb2wucHJvdG9jb2wsXG4gICAgICAgIGFkZHJlc3MgPSBfdGhpcyRleHRyYWN0UHJvdG9jb2wuYWRkcmVzcyxcbiAgICAgICAgc2xhc2hlcyA9IF90aGlzJGV4dHJhY3RQcm90b2NvbC5zbGFzaGVzO1xuXG4gICAgdmFyIHJlbGF0aXZlID0gIXByb3RvY29sICYmICFzbGFzaGVzO1xuICAgIHZhciBsb2NhdGlvbiA9IHRoaXMuZ2V0TG9jYXRpb24oKTtcbiAgICB2YXIgaW5zdHJ1Y3Rpb25zID0gUlVMRVMuc2xpY2UoKTtcbiAgICBhZGRyZXNzID0gYWRkcmVzcy5yZXBsYWNlKCdcXFxcJywgJy8nKTtcblxuICAgIGlmICghc2xhc2hlcykge1xuICAgICAgaW5zdHJ1Y3Rpb25zWzJdID0gW05hTiwgJ3BhdGgnXTtcbiAgICB9XG5cbiAgICB2YXIgaW5kZXg7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGluc3RydWN0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGluc3RydWN0aW9uID0gaW5zdHJ1Y3Rpb25zW2ldO1xuICAgICAgdmFyIHBhcnNlID0gaW5zdHJ1Y3Rpb25bMF07XG4gICAgICB2YXIga2V5ID0gaW5zdHJ1Y3Rpb25bMV07XG5cbiAgICAgIGlmICh0eXBlb2YgcGFyc2UgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGluZGV4ID0gYWRkcmVzcy5pbmRleE9mKHBhcnNlKTtcblxuICAgICAgICBpZiAofmluZGV4KSB7XG4gICAgICAgICAgdmFyIGluc3RMZW5ndGggPSBpbnN0cnVjdGlvblsyXTtcblxuICAgICAgICAgIGlmIChpbnN0TGVuZ3RoKSB7XG4gICAgICAgICAgICB2YXIgbmV3SW5kZXggPSBhZGRyZXNzLmxhc3RJbmRleE9mKHBhcnNlKTtcbiAgICAgICAgICAgIGluZGV4ID0gTWF0aC5tYXgoaW5kZXgsIG5ld0luZGV4KTtcbiAgICAgICAgICAgIHRoaXNba2V5XSA9IGFkZHJlc3Muc2xpY2UoMCwgaW5kZXgpO1xuICAgICAgICAgICAgYWRkcmVzcyA9IGFkZHJlc3Muc2xpY2UoaW5kZXggKyBpbnN0TGVuZ3RoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpc1trZXldID0gYWRkcmVzcy5zbGljZShpbmRleCk7XG4gICAgICAgICAgICBhZGRyZXNzID0gYWRkcmVzcy5zbGljZSgwLCBpbmRleCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzW2tleV0gPSBhZGRyZXNzO1xuICAgICAgICBhZGRyZXNzID0gJyc7XG4gICAgICB9XG5cbiAgICAgIHRoaXNba2V5XSA9IHRoaXNba2V5XSB8fCAocmVsYXRpdmUgJiYgaW5zdHJ1Y3Rpb25bM10gPyBsb2NhdGlvbltrZXldIHx8ICcnIDogJycpO1xuICAgICAgaWYgKGluc3RydWN0aW9uWzNdKSB0aGlzW2tleV0gPSB0aGlzW2tleV0udG9Mb3dlckNhc2UoKTtcbiAgICB9XG5cbiAgICBpZiAocmVsYXRpdmUgJiYgdGhpcy5wYXRoLmNoYXJBdCgwKSAhPT0gJy8nKSB7XG4gICAgICB0aGlzLnBhdGggPSAnLycgKyB0aGlzLnBhdGg7XG4gICAgfVxuXG4gICAgdGhpcy5yZWxhdGl2ZSA9IHJlbGF0aXZlO1xuICAgIHRoaXMucHJvdG9jb2wgPSBwcm90b2NvbCB8fCBsb2NhdGlvbi5wcm90b2NvbDtcbiAgICB0aGlzLmhvc3RuYW1lID0gdGhpcy5ob3N0O1xuICAgIHRoaXMucG9ydCA9ICcnO1xuXG4gICAgaWYgKC86XFxkKyQvLnRlc3QodGhpcy5ob3N0KSkge1xuICAgICAgdmFyIHZhbHVlID0gdGhpcy5ob3N0LnNwbGl0KCc6Jyk7XG4gICAgICB2YXIgcG9ydCA9IHZhbHVlLnBvcCgpO1xuICAgICAgdmFyIGhvc3RuYW1lID0gdmFsdWUuam9pbignOicpO1xuXG4gICAgICBpZiAoaXNEZWZhdWx0UG9ydChwb3J0LCB0aGlzLnByb3RvY29sKSkge1xuICAgICAgICB0aGlzLmhvc3QgPSBob3N0bmFtZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMucG9ydCA9IHBvcnQ7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuaG9zdG5hbWUgPSBob3N0bmFtZTtcbiAgICB9XG5cbiAgICB0aGlzLm9yaWdpbiA9IHRoaXMucHJvdG9jb2wgJiYgdGhpcy5ob3N0ICYmIHRoaXMucHJvdG9jb2wgIT09ICdmaWxlOicgPyB0aGlzLnByb3RvY29sICsgJy8vJyArIHRoaXMuaG9zdCA6ICdudWxsJztcbiAgICB0aGlzLmhyZWYgPSB0aGlzLnRvU3RyaW5nKCk7XG4gIH1cblxuICB2YXIgX3Byb3RvID0gVXJsLnByb3RvdHlwZTtcblxuICBfcHJvdG8udG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICB2YXIgcmVzdWx0ID0gdGhpcy5wcm90b2NvbDtcbiAgICByZXN1bHQgKz0gJy8vJztcblxuICAgIGlmICh0aGlzLmF1dGgpIHtcbiAgICAgIHZhciBSRURBQ1RFRCA9ICdbUkVEQUNURURdJztcbiAgICAgIHZhciB1c2VycGFzcyA9IHRoaXMuYXV0aC5zcGxpdCgnOicpO1xuICAgICAgdmFyIHVzZXJuYW1lID0gdXNlcnBhc3NbMF0gPyBSRURBQ1RFRCA6ICcnO1xuICAgICAgdmFyIHBhc3N3b3JkID0gdXNlcnBhc3NbMV0gPyAnOicgKyBSRURBQ1RFRCA6ICcnO1xuICAgICAgcmVzdWx0ICs9IHVzZXJuYW1lICsgcGFzc3dvcmQgKyAnQCc7XG4gICAgfVxuXG4gICAgcmVzdWx0ICs9IHRoaXMuaG9zdDtcbiAgICByZXN1bHQgKz0gdGhpcy5wYXRoO1xuICAgIHJlc3VsdCArPSB0aGlzLnF1ZXJ5O1xuICAgIHJlc3VsdCArPSB0aGlzLmhhc2g7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICBfcHJvdG8uZ2V0TG9jYXRpb24gPSBmdW5jdGlvbiBnZXRMb2NhdGlvbigpIHtcbiAgICB2YXIgZ2xvYmFsVmFyID0ge307XG5cbiAgICBpZiAoaXNCcm93c2VyKSB7XG4gICAgICBnbG9iYWxWYXIgPSB3aW5kb3c7XG4gICAgfVxuXG4gICAgcmV0dXJuIGdsb2JhbFZhci5sb2NhdGlvbjtcbiAgfTtcblxuICBfcHJvdG8uZXh0cmFjdFByb3RvY29sID0gZnVuY3Rpb24gZXh0cmFjdFByb3RvY29sKHVybCkge1xuICAgIHZhciBtYXRjaCA9IFBST1RPQ09MX1JFR0VYLmV4ZWModXJsKTtcbiAgICByZXR1cm4ge1xuICAgICAgcHJvdG9jb2w6IG1hdGNoWzFdID8gbWF0Y2hbMV0udG9Mb3dlckNhc2UoKSA6ICcnLFxuICAgICAgc2xhc2hlczogISFtYXRjaFsyXSxcbiAgICAgIGFkZHJlc3M6IG1hdGNoWzNdXG4gICAgfTtcbiAgfTtcblxuICByZXR1cm4gVXJsO1xufSgpO1xuZXhwb3J0IGZ1bmN0aW9uIHNsdWdpZnlVcmwodXJsU3RyLCBkZXB0aCkge1xuICBpZiAoZGVwdGggPT09IHZvaWQgMCkge1xuICAgIGRlcHRoID0gMjtcbiAgfVxuXG4gIHZhciBwYXJzZWRVcmwgPSBuZXcgVXJsKHVybFN0cik7XG4gIHZhciBxdWVyeSA9IHBhcnNlZFVybC5xdWVyeSxcbiAgICAgIHBhdGggPSBwYXJzZWRVcmwucGF0aDtcbiAgdmFyIHBhdGhQYXJ0cyA9IHBhdGguc3Vic3RyaW5nKDEpLnNwbGl0KCcvJyk7XG4gIHZhciByZWRhY3RTdHJpbmcgPSAnOmlkJztcbiAgdmFyIHdpbGRjYXJkID0gJyonO1xuICB2YXIgc3BlY2lhbENoYXJzUmVnZXggPSAvXFxXfF8vZztcbiAgdmFyIGRpZ2l0c1JlZ2V4ID0gL1swLTldL2c7XG4gIHZhciBsb3dlckNhc2VSZWdleCA9IC9bYS16XS9nO1xuICB2YXIgdXBwZXJDYXNlUmVnZXggPSAvW0EtWl0vZztcbiAgdmFyIHJlZGFjdGVkUGFydHMgPSBbXTtcbiAgdmFyIHJlZGFjdGVkQmVmb3JlID0gZmFsc2U7XG5cbiAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IHBhdGhQYXJ0cy5sZW5ndGg7IGluZGV4KyspIHtcbiAgICB2YXIgcGFydCA9IHBhdGhQYXJ0c1tpbmRleF07XG5cbiAgICBpZiAocmVkYWN0ZWRCZWZvcmUgfHwgaW5kZXggPiBkZXB0aCAtIDEpIHtcbiAgICAgIGlmIChwYXJ0KSB7XG4gICAgICAgIHJlZGFjdGVkUGFydHMucHVzaCh3aWxkY2FyZCk7XG4gICAgICB9XG5cbiAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHZhciBudW1iZXJPZlNwZWNpYWxDaGFycyA9IChwYXJ0Lm1hdGNoKHNwZWNpYWxDaGFyc1JlZ2V4KSB8fCBbXSkubGVuZ3RoO1xuXG4gICAgaWYgKG51bWJlck9mU3BlY2lhbENoYXJzID49IDIpIHtcbiAgICAgIHJlZGFjdGVkUGFydHMucHVzaChyZWRhY3RTdHJpbmcpO1xuICAgICAgcmVkYWN0ZWRCZWZvcmUgPSB0cnVlO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgdmFyIG51bWJlck9mRGlnaXRzID0gKHBhcnQubWF0Y2goZGlnaXRzUmVnZXgpIHx8IFtdKS5sZW5ndGg7XG5cbiAgICBpZiAobnVtYmVyT2ZEaWdpdHMgPiAzIHx8IHBhcnQubGVuZ3RoID4gMyAmJiBudW1iZXJPZkRpZ2l0cyAvIHBhcnQubGVuZ3RoID49IDAuMykge1xuICAgICAgcmVkYWN0ZWRQYXJ0cy5wdXNoKHJlZGFjdFN0cmluZyk7XG4gICAgICByZWRhY3RlZEJlZm9yZSA9IHRydWU7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICB2YXIgbnVtYmVyb2ZVcHBlckNhc2UgPSAocGFydC5tYXRjaCh1cHBlckNhc2VSZWdleCkgfHwgW10pLmxlbmd0aDtcbiAgICB2YXIgbnVtYmVyb2ZMb3dlckNhc2UgPSAocGFydC5tYXRjaChsb3dlckNhc2VSZWdleCkgfHwgW10pLmxlbmd0aDtcbiAgICB2YXIgbG93ZXJDYXNlUmF0ZSA9IG51bWJlcm9mTG93ZXJDYXNlIC8gcGFydC5sZW5ndGg7XG4gICAgdmFyIHVwcGVyQ2FzZVJhdGUgPSBudW1iZXJvZlVwcGVyQ2FzZSAvIHBhcnQubGVuZ3RoO1xuXG4gICAgaWYgKHBhcnQubGVuZ3RoID4gNSAmJiAodXBwZXJDYXNlUmF0ZSA+IDAuMyAmJiB1cHBlckNhc2VSYXRlIDwgMC42IHx8IGxvd2VyQ2FzZVJhdGUgPiAwLjMgJiYgbG93ZXJDYXNlUmF0ZSA8IDAuNikpIHtcbiAgICAgIHJlZGFjdGVkUGFydHMucHVzaChyZWRhY3RTdHJpbmcpO1xuICAgICAgcmVkYWN0ZWRCZWZvcmUgPSB0cnVlO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgcGFydCAmJiByZWRhY3RlZFBhcnRzLnB1c2gocGFydCk7XG4gIH1cblxuICB2YXIgcmVkYWN0ZWQgPSAnLycgKyAocmVkYWN0ZWRQYXJ0cy5sZW5ndGggPj0gMiA/IHJlZGFjdGVkUGFydHMuam9pbignLycpIDogcmVkYWN0ZWRQYXJ0cy5qb2luKCcnKSkgKyAocXVlcnkgPyAnP3txdWVyeX0nIDogJycpO1xuICByZXR1cm4gcmVkYWN0ZWQ7XG59IiwiaW1wb3J0IHsgUHJvbWlzZSB9IGZyb20gJy4vcG9seWZpbGxzJztcbnZhciBzbGljZSA9IFtdLnNsaWNlO1xudmFyIGlzQnJvd3NlciA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnO1xudmFyIFBFUkYgPSBpc0Jyb3dzZXIgJiYgdHlwZW9mIHBlcmZvcm1hbmNlICE9PSAndW5kZWZpbmVkJyA/IHBlcmZvcm1hbmNlIDoge307XG5cbmZ1bmN0aW9uIGlzQ09SU1N1cHBvcnRlZCgpIHtcbiAgdmFyIHhociA9IG5ldyB3aW5kb3cuWE1MSHR0cFJlcXVlc3QoKTtcbiAgcmV0dXJuICd3aXRoQ3JlZGVudGlhbHMnIGluIHhocjtcbn1cblxudmFyIGJ5dGVUb0hleCA9IFtdO1xuXG5mb3IgKHZhciBpID0gMDsgaSA8IDI1NjsgKytpKSB7XG4gIGJ5dGVUb0hleFtpXSA9IChpICsgMHgxMDApLnRvU3RyaW5nKDE2KS5zdWJzdHIoMSk7XG59XG5cbmZ1bmN0aW9uIGJ5dGVzVG9IZXgoYnVmZmVyKSB7XG4gIHZhciBoZXhPY3RldHMgPSBbXTtcblxuICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgYnVmZmVyLmxlbmd0aDsgX2krKykge1xuICAgIGhleE9jdGV0cy5wdXNoKGJ5dGVUb0hleFtidWZmZXJbX2ldXSk7XG4gIH1cblxuICByZXR1cm4gaGV4T2N0ZXRzLmpvaW4oJycpO1xufVxuXG52YXIgZGVzdGluYXRpb24gPSBuZXcgVWludDhBcnJheSgxNik7XG5cbmZ1bmN0aW9uIHJuZygpIHtcbiAgaWYgKHR5cGVvZiBjcnlwdG8gIT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGNyeXB0by5nZXRSYW5kb21WYWx1ZXMgPT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKGRlc3RpbmF0aW9uKTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgbXNDcnlwdG8gIT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIG1zQ3J5cHRvLmdldFJhbmRvbVZhbHVlcyA9PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIG1zQ3J5cHRvLmdldFJhbmRvbVZhbHVlcyhkZXN0aW5hdGlvbik7XG4gIH1cblxuICByZXR1cm4gZGVzdGluYXRpb247XG59XG5cbmZ1bmN0aW9uIGdlbmVyYXRlUmFuZG9tSWQobGVuZ3RoKSB7XG4gIHZhciBpZCA9IGJ5dGVzVG9IZXgocm5nKCkpO1xuICByZXR1cm4gaWQuc3Vic3RyKDAsIGxlbmd0aCk7XG59XG5cbmZ1bmN0aW9uIGdldER0SGVhZGVyVmFsdWUoc3Bhbikge1xuICB2YXIgZHRWZXJzaW9uID0gJzAwJztcbiAgdmFyIGR0VW5TYW1wbGVkRmxhZ3MgPSAnMDAnO1xuICB2YXIgZHRTYW1wbGVkRmxhZ3MgPSAnMDEnO1xuXG4gIGlmIChzcGFuICYmIHNwYW4udHJhY2VJZCAmJiBzcGFuLmlkICYmIHNwYW4ucGFyZW50SWQpIHtcbiAgICB2YXIgZmxhZ3MgPSBzcGFuLnNhbXBsZWQgPyBkdFNhbXBsZWRGbGFncyA6IGR0VW5TYW1wbGVkRmxhZ3M7XG4gICAgdmFyIGlkID0gc3Bhbi5zYW1wbGVkID8gc3Bhbi5pZCA6IHNwYW4ucGFyZW50SWQ7XG4gICAgcmV0dXJuIGR0VmVyc2lvbiArICctJyArIHNwYW4udHJhY2VJZCArICctJyArIGlkICsgJy0nICsgZmxhZ3M7XG4gIH1cbn1cblxuZnVuY3Rpb24gcGFyc2VEdEhlYWRlclZhbHVlKHZhbHVlKSB7XG4gIHZhciBwYXJzZWQgPSAvXihbXFxkYS1mXXsyfSktKFtcXGRhLWZdezMyfSktKFtcXGRhLWZdezE2fSktKFtcXGRhLWZdezJ9KSQvLmV4ZWModmFsdWUpO1xuXG4gIGlmIChwYXJzZWQpIHtcbiAgICB2YXIgZmxhZ3MgPSBwYXJzZWRbNF07XG4gICAgdmFyIHNhbXBsZWQgPSBmbGFncyAhPT0gJzAwJztcbiAgICByZXR1cm4ge1xuICAgICAgdHJhY2VJZDogcGFyc2VkWzJdLFxuICAgICAgaWQ6IHBhcnNlZFszXSxcbiAgICAgIHNhbXBsZWQ6IHNhbXBsZWRcbiAgICB9O1xuICB9XG59XG5cbmZ1bmN0aW9uIGlzRHRIZWFkZXJWYWxpZChoZWFkZXIpIHtcbiAgcmV0dXJuIC9eW1xcZGEtZl17Mn0tW1xcZGEtZl17MzJ9LVtcXGRhLWZdezE2fS1bXFxkYS1mXXsyfSQvLnRlc3QoaGVhZGVyKSAmJiBoZWFkZXIuc2xpY2UoMywgMzUpICE9PSAnMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAnICYmIGhlYWRlci5zbGljZSgzNiwgNTIpICE9PSAnMDAwMDAwMDAwMDAwMDAwMCc7XG59XG5cbmZ1bmN0aW9uIGdldFRTSGVhZGVyVmFsdWUoX3JlZikge1xuICB2YXIgc2FtcGxlUmF0ZSA9IF9yZWYuc2FtcGxlUmF0ZTtcblxuICBpZiAodHlwZW9mIHNhbXBsZVJhdGUgIT09ICdudW1iZXInIHx8IFN0cmluZyhzYW1wbGVSYXRlKS5sZW5ndGggPiAyNTYpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICB2YXIgTkFNRVNQQUNFID0gJ2VzJztcbiAgdmFyIFNFUEFSQVRPUiA9ICc9JztcbiAgcmV0dXJuIFwiXCIgKyBOQU1FU1BBQ0UgKyBTRVBBUkFUT1IgKyBcInM6XCIgKyBzYW1wbGVSYXRlO1xufVxuXG5mdW5jdGlvbiBzZXRSZXF1ZXN0SGVhZGVyKHRhcmdldCwgbmFtZSwgdmFsdWUpIHtcbiAgaWYgKHR5cGVvZiB0YXJnZXQuc2V0UmVxdWVzdEhlYWRlciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHRhcmdldC5zZXRSZXF1ZXN0SGVhZGVyKG5hbWUsIHZhbHVlKTtcbiAgfSBlbHNlIGlmICh0YXJnZXQuaGVhZGVycyAmJiB0eXBlb2YgdGFyZ2V0LmhlYWRlcnMuYXBwZW5kID09PSAnZnVuY3Rpb24nKSB7XG4gICAgdGFyZ2V0LmhlYWRlcnMuYXBwZW5kKG5hbWUsIHZhbHVlKTtcbiAgfSBlbHNlIHtcbiAgICB0YXJnZXRbbmFtZV0gPSB2YWx1ZTtcbiAgfVxufVxuXG5mdW5jdGlvbiBjaGVja1NhbWVPcmlnaW4oc291cmNlLCB0YXJnZXQpIHtcbiAgdmFyIGlzU2FtZSA9IGZhbHNlO1xuXG4gIGlmICh0eXBlb2YgdGFyZ2V0ID09PSAnc3RyaW5nJykge1xuICAgIGlzU2FtZSA9IHNvdXJjZSA9PT0gdGFyZ2V0O1xuICB9IGVsc2UgaWYgKHRhcmdldCAmJiB0eXBlb2YgdGFyZ2V0LnRlc3QgPT09ICdmdW5jdGlvbicpIHtcbiAgICBpc1NhbWUgPSB0YXJnZXQudGVzdChzb3VyY2UpO1xuICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkodGFyZ2V0KSkge1xuICAgIHRhcmdldC5mb3JFYWNoKGZ1bmN0aW9uICh0KSB7XG4gICAgICBpZiAoIWlzU2FtZSkge1xuICAgICAgICBpc1NhbWUgPSBjaGVja1NhbWVPcmlnaW4oc291cmNlLCB0KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiBpc1NhbWU7XG59XG5cbmZ1bmN0aW9uIGlzUGxhdGZvcm1TdXBwb3J0ZWQoKSB7XG4gIHJldHVybiBpc0Jyb3dzZXIgJiYgdHlwZW9mIFNldCA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgSlNPTi5zdHJpbmdpZnkgPT09ICdmdW5jdGlvbicgJiYgUEVSRiAmJiB0eXBlb2YgUEVSRi5ub3cgPT09ICdmdW5jdGlvbicgJiYgaXNDT1JTU3VwcG9ydGVkKCk7XG59XG5cbmZ1bmN0aW9uIHNldExhYmVsKGtleSwgdmFsdWUsIG9iaikge1xuICBpZiAoIW9iaiB8fCAha2V5KSByZXR1cm47XG4gIHZhciBza2V5ID0gcmVtb3ZlSW52YWxpZENoYXJzKGtleSk7XG4gIHZhciB2YWx1ZVR5cGUgPSB0eXBlb2YgdmFsdWU7XG5cbiAgaWYgKHZhbHVlICE9IHVuZGVmaW5lZCAmJiB2YWx1ZVR5cGUgIT09ICdib29sZWFuJyAmJiB2YWx1ZVR5cGUgIT09ICdudW1iZXInKSB7XG4gICAgdmFsdWUgPSBTdHJpbmcodmFsdWUpO1xuICB9XG5cbiAgb2JqW3NrZXldID0gdmFsdWU7XG4gIHJldHVybiBvYmo7XG59XG5cbmZ1bmN0aW9uIGdldFNlcnZlclRpbWluZ0luZm8oc2VydmVyVGltaW5nRW50cmllcykge1xuICBpZiAoc2VydmVyVGltaW5nRW50cmllcyA9PT0gdm9pZCAwKSB7XG4gICAgc2VydmVyVGltaW5nRW50cmllcyA9IFtdO1xuICB9XG5cbiAgdmFyIHNlcnZlclRpbWluZ0luZm8gPSBbXTtcbiAgdmFyIGVudHJ5U2VwYXJhdG9yID0gJywgJztcbiAgdmFyIHZhbHVlU2VwYXJhdG9yID0gJzsnO1xuXG4gIGZvciAodmFyIF9pMiA9IDA7IF9pMiA8IHNlcnZlclRpbWluZ0VudHJpZXMubGVuZ3RoOyBfaTIrKykge1xuICAgIHZhciBfc2VydmVyVGltaW5nRW50cmllcyQgPSBzZXJ2ZXJUaW1pbmdFbnRyaWVzW19pMl0sXG4gICAgICAgIG5hbWUgPSBfc2VydmVyVGltaW5nRW50cmllcyQubmFtZSxcbiAgICAgICAgZHVyYXRpb24gPSBfc2VydmVyVGltaW5nRW50cmllcyQuZHVyYXRpb24sXG4gICAgICAgIGRlc2NyaXB0aW9uID0gX3NlcnZlclRpbWluZ0VudHJpZXMkLmRlc2NyaXB0aW9uO1xuICAgIHZhciB0aW1pbmdWYWx1ZSA9IG5hbWU7XG5cbiAgICBpZiAoZGVzY3JpcHRpb24pIHtcbiAgICAgIHRpbWluZ1ZhbHVlICs9IHZhbHVlU2VwYXJhdG9yICsgJ2Rlc2M9JyArIGRlc2NyaXB0aW9uO1xuICAgIH1cblxuICAgIGlmIChkdXJhdGlvbikge1xuICAgICAgdGltaW5nVmFsdWUgKz0gdmFsdWVTZXBhcmF0b3IgKyAnZHVyPScgKyBkdXJhdGlvbjtcbiAgICB9XG5cbiAgICBzZXJ2ZXJUaW1pbmdJbmZvLnB1c2godGltaW5nVmFsdWUpO1xuICB9XG5cbiAgcmV0dXJuIHNlcnZlclRpbWluZ0luZm8uam9pbihlbnRyeVNlcGFyYXRvcik7XG59XG5cbmZ1bmN0aW9uIGdldFRpbWVPcmlnaW4oKSB7XG4gIHJldHVybiBQRVJGLnRpbWluZy5mZXRjaFN0YXJ0O1xufVxuXG5mdW5jdGlvbiBzdHJpcFF1ZXJ5U3RyaW5nRnJvbVVybCh1cmwpIHtcbiAgcmV0dXJuIHVybCAmJiB1cmwuc3BsaXQoJz8nKVswXTtcbn1cblxuZnVuY3Rpb24gaXNPYmplY3QodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlICE9PSBudWxsICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCc7XG59XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJztcbn1cblxuZnVuY3Rpb24gYmFzZUV4dGVuZChkc3QsIG9ianMsIGRlZXApIHtcbiAgZm9yICh2YXIgaSA9IDAsIGlpID0gb2Jqcy5sZW5ndGg7IGkgPCBpaTsgKytpKSB7XG4gICAgdmFyIG9iaiA9IG9ianNbaV07XG4gICAgaWYgKCFpc09iamVjdChvYmopICYmICFpc0Z1bmN0aW9uKG9iaikpIGNvbnRpbnVlO1xuICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXMob2JqKTtcblxuICAgIGZvciAodmFyIGogPSAwLCBqaiA9IGtleXMubGVuZ3RoOyBqIDwgamo7IGorKykge1xuICAgICAgdmFyIGtleSA9IGtleXNbal07XG4gICAgICB2YXIgc3JjID0gb2JqW2tleV07XG5cbiAgICAgIGlmIChkZWVwICYmIGlzT2JqZWN0KHNyYykpIHtcbiAgICAgICAgaWYgKCFpc09iamVjdChkc3Rba2V5XSkpIGRzdFtrZXldID0gQXJyYXkuaXNBcnJheShzcmMpID8gW10gOiB7fTtcbiAgICAgICAgYmFzZUV4dGVuZChkc3Rba2V5XSwgW3NyY10sIGZhbHNlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRzdFtrZXldID0gc3JjO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBkc3Q7XG59XG5cbmZ1bmN0aW9uIGdldEVsYXN0aWNTY3JpcHQoKSB7XG4gIGlmICh0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgdmFyIHNjcmlwdHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc2NyaXB0Jyk7XG5cbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IHNjcmlwdHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICB2YXIgc2MgPSBzY3JpcHRzW2ldO1xuXG4gICAgICBpZiAoc2Muc3JjLmluZGV4T2YoJ2VsYXN0aWMnKSA+IDApIHtcbiAgICAgICAgcmV0dXJuIHNjO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRDdXJyZW50U2NyaXB0KCkge1xuICBpZiAodHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJykge1xuICAgIHZhciBjdXJyZW50U2NyaXB0ID0gZG9jdW1lbnQuY3VycmVudFNjcmlwdDtcblxuICAgIGlmICghY3VycmVudFNjcmlwdCkge1xuICAgICAgcmV0dXJuIGdldEVsYXN0aWNTY3JpcHQoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gY3VycmVudFNjcmlwdDtcbiAgfVxufVxuXG5mdW5jdGlvbiBleHRlbmQoZHN0KSB7XG4gIHJldHVybiBiYXNlRXh0ZW5kKGRzdCwgc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpLCBmYWxzZSk7XG59XG5cbmZ1bmN0aW9uIG1lcmdlKGRzdCkge1xuICByZXR1cm4gYmFzZUV4dGVuZChkc3QsIHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSwgdHJ1ZSk7XG59XG5cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKG9iaikge1xuICByZXR1cm4gdHlwZW9mIG9iaiA9PT0gJ3VuZGVmaW5lZCc7XG59XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5mdW5jdGlvbiBmaW5kKGFycmF5LCBwcmVkaWNhdGUsIHRoaXNBcmcpIHtcbiAgaWYgKGFycmF5ID09IG51bGwpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdhcnJheSBpcyBudWxsIG9yIG5vdCBkZWZpbmVkJyk7XG4gIH1cblxuICB2YXIgbyA9IE9iamVjdChhcnJheSk7XG4gIHZhciBsZW4gPSBvLmxlbmd0aCA+Pj4gMDtcblxuICBpZiAodHlwZW9mIHByZWRpY2F0ZSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ3ByZWRpY2F0ZSBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcbiAgfVxuXG4gIHZhciBrID0gMDtcblxuICB3aGlsZSAoayA8IGxlbikge1xuICAgIHZhciBrVmFsdWUgPSBvW2tdO1xuXG4gICAgaWYgKHByZWRpY2F0ZS5jYWxsKHRoaXNBcmcsIGtWYWx1ZSwgaywgbykpIHtcbiAgICAgIHJldHVybiBrVmFsdWU7XG4gICAgfVxuXG4gICAgaysrO1xuICB9XG5cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlSW52YWxpZENoYXJzKGtleSkge1xuICByZXR1cm4ga2V5LnJlcGxhY2UoL1suKlwiXS9nLCAnXycpO1xufVxuXG5mdW5jdGlvbiBnZXRMYXRlc3RTcGFuKHNwYW5zLCB0eXBlRmlsdGVyKSB7XG4gIHZhciBsYXRlc3RTcGFuID0gbnVsbDtcblxuICBmb3IgKHZhciBfaTMgPSAwOyBfaTMgPCBzcGFucy5sZW5ndGg7IF9pMysrKSB7XG4gICAgdmFyIHNwYW4gPSBzcGFuc1tfaTNdO1xuXG4gICAgaWYgKHR5cGVGaWx0ZXIgJiYgdHlwZUZpbHRlcihzcGFuLnR5cGUpICYmICghbGF0ZXN0U3BhbiB8fCBsYXRlc3RTcGFuLl9lbmQgPCBzcGFuLl9lbmQpKSB7XG4gICAgICBsYXRlc3RTcGFuID0gc3BhbjtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbGF0ZXN0U3Bhbjtcbn1cblxuZnVuY3Rpb24gZ2V0TGF0ZXN0Tm9uWEhSU3BhbihzcGFucykge1xuICByZXR1cm4gZ2V0TGF0ZXN0U3BhbihzcGFucywgZnVuY3Rpb24gKHR5cGUpIHtcbiAgICByZXR1cm4gU3RyaW5nKHR5cGUpLmluZGV4T2YoJ2V4dGVybmFsJykgPT09IC0xO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gZ2V0TGF0ZXN0WEhSU3BhbihzcGFucykge1xuICByZXR1cm4gZ2V0TGF0ZXN0U3BhbihzcGFucywgZnVuY3Rpb24gKHR5cGUpIHtcbiAgICByZXR1cm4gU3RyaW5nKHR5cGUpLmluZGV4T2YoJ2V4dGVybmFsJykgIT09IC0xO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gZ2V0RWFybGllc3RTcGFuKHNwYW5zKSB7XG4gIHZhciBlYXJsaWVzdFNwYW4gPSBzcGFuc1swXTtcblxuICBmb3IgKHZhciBfaTQgPSAxOyBfaTQgPCBzcGFucy5sZW5ndGg7IF9pNCsrKSB7XG4gICAgdmFyIHNwYW4gPSBzcGFuc1tfaTRdO1xuXG4gICAgaWYgKGVhcmxpZXN0U3Bhbi5fc3RhcnQgPiBzcGFuLl9zdGFydCkge1xuICAgICAgZWFybGllc3RTcGFuID0gc3BhbjtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZWFybGllc3RTcGFuO1xufVxuXG5mdW5jdGlvbiBub3coKSB7XG4gIHJldHVybiBQRVJGLm5vdygpO1xufVxuXG5mdW5jdGlvbiBnZXRUaW1lKHRpbWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB0aW1lID09PSAnbnVtYmVyJyAmJiB0aW1lID49IDAgPyB0aW1lIDogbm93KCk7XG59XG5cbmZ1bmN0aW9uIGdldER1cmF0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgaWYgKGlzVW5kZWZpbmVkKGVuZCkgfHwgaXNVbmRlZmluZWQoc3RhcnQpKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICByZXR1cm4gcGFyc2VJbnQoZW5kIC0gc3RhcnQpO1xufVxuXG5mdW5jdGlvbiBzY2hlZHVsZU1hY3JvVGFzayhjYWxsYmFjaykge1xuICBzZXRUaW1lb3V0KGNhbGxiYWNrLCAwKTtcbn1cblxuZnVuY3Rpb24gc2NoZWR1bGVNaWNyb1Rhc2soY2FsbGJhY2spIHtcbiAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbihjYWxsYmFjayk7XG59XG5cbmZ1bmN0aW9uIGlzUGVyZlRpbWVsaW5lU3VwcG9ydGVkKCkge1xuICByZXR1cm4gdHlwZW9mIFBFUkYuZ2V0RW50cmllc0J5VHlwZSA9PT0gJ2Z1bmN0aW9uJztcbn1cblxuZnVuY3Rpb24gaXNQZXJmVHlwZVN1cHBvcnRlZCh0eXBlKSB7XG4gIHJldHVybiB0eXBlb2YgUGVyZm9ybWFuY2VPYnNlcnZlciAhPT0gJ3VuZGVmaW5lZCcgJiYgUGVyZm9ybWFuY2VPYnNlcnZlci5zdXBwb3J0ZWRFbnRyeVR5cGVzICYmIFBlcmZvcm1hbmNlT2JzZXJ2ZXIuc3VwcG9ydGVkRW50cnlUeXBlcy5pbmRleE9mKHR5cGUpID49IDA7XG59XG5cbmZ1bmN0aW9uIGlzUGVyZkludGVyYWN0aW9uQ291bnRTdXBwb3J0ZWQoKSB7XG4gIHJldHVybiAnaW50ZXJhY3Rpb25Db3VudCcgaW4gcGVyZm9ybWFuY2U7XG59XG5cbmZ1bmN0aW9uIGlzQmVhY29uSW5zcGVjdGlvbkVuYWJsZWQoKSB7XG4gIHZhciBmbGFnTmFtZSA9ICdfZWxhc3RpY19pbnNwZWN0X2JlYWNvbl8nO1xuXG4gIGlmIChzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKGZsYWdOYW1lKSAhPSBudWxsKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBpZiAoIXdpbmRvdy5VUkwgfHwgIXdpbmRvdy5VUkxTZWFyY2hQYXJhbXMpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICB0cnkge1xuICAgIHZhciBwYXJzZWRVcmwgPSBuZXcgVVJMKHdpbmRvdy5sb2NhdGlvbi5ocmVmKTtcbiAgICB2YXIgaXNGbGFnU2V0ID0gcGFyc2VkVXJsLnNlYXJjaFBhcmFtcy5oYXMoZmxhZ05hbWUpO1xuXG4gICAgaWYgKGlzRmxhZ1NldCkge1xuICAgICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShmbGFnTmFtZSwgdHJ1ZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGlzRmxhZ1NldDtcbiAgfSBjYXRjaCAoZSkge31cblxuICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIGlzUmVkaXJlY3RJbmZvQXZhaWxhYmxlKHRpbWluZykge1xuICByZXR1cm4gdGltaW5nLnJlZGlyZWN0U3RhcnQgPiAwO1xufVxuXG5leHBvcnQgeyBleHRlbmQsIG1lcmdlLCBpc1VuZGVmaW5lZCwgbm9vcCwgYmFzZUV4dGVuZCwgYnl0ZXNUb0hleCwgaXNDT1JTU3VwcG9ydGVkLCBpc09iamVjdCwgaXNGdW5jdGlvbiwgaXNQbGF0Zm9ybVN1cHBvcnRlZCwgaXNEdEhlYWRlclZhbGlkLCBwYXJzZUR0SGVhZGVyVmFsdWUsIGdldFNlcnZlclRpbWluZ0luZm8sIGdldER0SGVhZGVyVmFsdWUsIGdldFRTSGVhZGVyVmFsdWUsIGdldEN1cnJlbnRTY3JpcHQsIGdldEVsYXN0aWNTY3JpcHQsIGdldFRpbWVPcmlnaW4sIGdlbmVyYXRlUmFuZG9tSWQsIGdldEVhcmxpZXN0U3BhbiwgZ2V0TGF0ZXN0Tm9uWEhSU3BhbiwgZ2V0TGF0ZXN0WEhSU3BhbiwgZ2V0RHVyYXRpb24sIGdldFRpbWUsIG5vdywgcm5nLCBjaGVja1NhbWVPcmlnaW4sIHNjaGVkdWxlTWFjcm9UYXNrLCBzY2hlZHVsZU1pY3JvVGFzaywgc2V0TGFiZWwsIHNldFJlcXVlc3RIZWFkZXIsIHN0cmlwUXVlcnlTdHJpbmdGcm9tVXJsLCBmaW5kLCByZW1vdmVJbnZhbGlkQ2hhcnMsIFBFUkYsIGlzUGVyZlRpbWVsaW5lU3VwcG9ydGVkLCBpc0Jyb3dzZXIsIGlzUGVyZlR5cGVTdXBwb3J0ZWQsIGlzUGVyZkludGVyYWN0aW9uQ291bnRTdXBwb3J0ZWQsIGlzQmVhY29uSW5zcGVjdGlvbkVuYWJsZWQsIGlzUmVkaXJlY3RJbmZvQXZhaWxhYmxlIH07IiwidmFyIF9leGNsdWRlZCA9IFtcInRhZ3NcIl07XG5cbmZ1bmN0aW9uIF9vYmplY3RXaXRob3V0UHJvcGVydGllc0xvb3NlKHNvdXJjZSwgZXhjbHVkZWQpIHsgaWYgKHNvdXJjZSA9PSBudWxsKSByZXR1cm4ge307IHZhciB0YXJnZXQgPSB7fTsgdmFyIHNvdXJjZUtleXMgPSBPYmplY3Qua2V5cyhzb3VyY2UpOyB2YXIga2V5LCBpOyBmb3IgKGkgPSAwOyBpIDwgc291cmNlS2V5cy5sZW5ndGg7IGkrKykgeyBrZXkgPSBzb3VyY2VLZXlzW2ldOyBpZiAoZXhjbHVkZWQuaW5kZXhPZihrZXkpID49IDApIGNvbnRpbnVlOyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IHJldHVybiB0YXJnZXQ7IH1cblxuaW1wb3J0IHsgY3JlYXRlU3RhY2tUcmFjZXMsIGZpbHRlckludmFsaWRGcmFtZXMgfSBmcm9tICcuL3N0YWNrLXRyYWNlJztcbmltcG9ydCB7IGdlbmVyYXRlUmFuZG9tSWQsIG1lcmdlLCBleHRlbmQgfSBmcm9tICcuLi9jb21tb24vdXRpbHMnO1xuaW1wb3J0IHsgZ2V0UGFnZUNvbnRleHQgfSBmcm9tICcuLi9jb21tb24vY29udGV4dCc7XG5pbXBvcnQgeyB0cnVuY2F0ZU1vZGVsLCBFUlJPUl9NT0RFTCB9IGZyb20gJy4uL2NvbW1vbi90cnVuY2F0ZSc7XG5pbXBvcnQgc3RhY2tQYXJzZXIgZnJvbSAnZXJyb3Itc3RhY2stcGFyc2VyJztcbnZhciBJR05PUkVfS0VZUyA9IFsnc3RhY2snLCAnbWVzc2FnZSddO1xudmFyIFBST01JU0VfUkVKRUNUSU9OX1BSRUZJWCA9ICdVbmhhbmRsZWQgcHJvbWlzZSByZWplY3Rpb246ICc7XG5cbmZ1bmN0aW9uIGdldEVycm9yUHJvcGVydGllcyhlcnJvcikge1xuICB2YXIgcHJvcGVydHlGb3VuZCA9IGZhbHNlO1xuICB2YXIgcHJvcGVydGllcyA9IHt9O1xuICBPYmplY3Qua2V5cyhlcnJvcikuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgaWYgKElHTk9SRV9LRVlTLmluZGV4T2Yoa2V5KSA+PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIHZhbCA9IGVycm9yW2tleV07XG5cbiAgICBpZiAodmFsID09IG51bGwgfHwgdHlwZW9mIHZhbCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgdmFsID09PSAnb2JqZWN0Jykge1xuICAgICAgaWYgKHR5cGVvZiB2YWwudG9JU09TdHJpbmcgIT09ICdmdW5jdGlvbicpIHJldHVybjtcbiAgICAgIHZhbCA9IHZhbC50b0lTT1N0cmluZygpO1xuICAgIH1cblxuICAgIHByb3BlcnRpZXNba2V5XSA9IHZhbDtcbiAgICBwcm9wZXJ0eUZvdW5kID0gdHJ1ZTtcbiAgfSk7XG5cbiAgaWYgKHByb3BlcnR5Rm91bmQpIHtcbiAgICByZXR1cm4gcHJvcGVydGllcztcbiAgfVxufVxuXG52YXIgRXJyb3JMb2dnaW5nID0gZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBFcnJvckxvZ2dpbmcoYXBtU2VydmVyLCBjb25maWdTZXJ2aWNlLCB0cmFuc2FjdGlvblNlcnZpY2UpIHtcbiAgICB0aGlzLl9hcG1TZXJ2ZXIgPSBhcG1TZXJ2ZXI7XG4gICAgdGhpcy5fY29uZmlnU2VydmljZSA9IGNvbmZpZ1NlcnZpY2U7XG4gICAgdGhpcy5fdHJhbnNhY3Rpb25TZXJ2aWNlID0gdHJhbnNhY3Rpb25TZXJ2aWNlO1xuICB9XG5cbiAgdmFyIF9wcm90byA9IEVycm9yTG9nZ2luZy5wcm90b3R5cGU7XG5cbiAgX3Byb3RvLmNyZWF0ZUVycm9yRGF0YU1vZGVsID0gZnVuY3Rpb24gY3JlYXRlRXJyb3JEYXRhTW9kZWwoZXJyb3JFdmVudCkge1xuICAgIHZhciBmcmFtZXMgPSBjcmVhdGVTdGFja1RyYWNlcyhzdGFja1BhcnNlciwgZXJyb3JFdmVudCk7XG4gICAgdmFyIGZpbHRlcmVkRnJhbWVzID0gZmlsdGVySW52YWxpZEZyYW1lcyhmcmFtZXMpO1xuICAgIHZhciBjdWxwcml0ID0gJyhpbmxpbmUgc2NyaXB0KSc7XG4gICAgdmFyIGxhc3RGcmFtZSA9IGZpbHRlcmVkRnJhbWVzW2ZpbHRlcmVkRnJhbWVzLmxlbmd0aCAtIDFdO1xuXG4gICAgaWYgKGxhc3RGcmFtZSAmJiBsYXN0RnJhbWUuZmlsZW5hbWUpIHtcbiAgICAgIGN1bHByaXQgPSBsYXN0RnJhbWUuZmlsZW5hbWU7XG4gICAgfVxuXG4gICAgdmFyIG1lc3NhZ2UgPSBlcnJvckV2ZW50Lm1lc3NhZ2UsXG4gICAgICAgIGVycm9yID0gZXJyb3JFdmVudC5lcnJvcjtcbiAgICB2YXIgZXJyb3JNZXNzYWdlID0gbWVzc2FnZTtcbiAgICB2YXIgZXJyb3JUeXBlID0gJyc7XG4gICAgdmFyIGVycm9yQ29udGV4dCA9IHt9O1xuXG4gICAgaWYgKGVycm9yICYmIHR5cGVvZiBlcnJvciA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGVycm9yTWVzc2FnZSA9IGVycm9yTWVzc2FnZSB8fCBlcnJvci5tZXNzYWdlO1xuICAgICAgZXJyb3JUeXBlID0gZXJyb3IubmFtZTtcbiAgICAgIHZhciBjdXN0b21Qcm9wZXJ0aWVzID0gZ2V0RXJyb3JQcm9wZXJ0aWVzKGVycm9yKTtcblxuICAgICAgaWYgKGN1c3RvbVByb3BlcnRpZXMpIHtcbiAgICAgICAgZXJyb3JDb250ZXh0LmN1c3RvbSA9IGN1c3RvbVByb3BlcnRpZXM7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCFlcnJvclR5cGUpIHtcbiAgICAgIGlmIChlcnJvck1lc3NhZ2UgJiYgZXJyb3JNZXNzYWdlLmluZGV4T2YoJzonKSA+IC0xKSB7XG4gICAgICAgIGVycm9yVHlwZSA9IGVycm9yTWVzc2FnZS5zcGxpdCgnOicpWzBdO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBjdXJyZW50VHJhbnNhY3Rpb24gPSB0aGlzLl90cmFuc2FjdGlvblNlcnZpY2UuZ2V0Q3VycmVudFRyYW5zYWN0aW9uKCk7XG5cbiAgICB2YXIgdHJhbnNhY3Rpb25Db250ZXh0ID0gY3VycmVudFRyYW5zYWN0aW9uID8gY3VycmVudFRyYW5zYWN0aW9uLmNvbnRleHQgOiB7fTtcblxuICAgIHZhciBfdGhpcyRfY29uZmlnU2VydmljZSQgPSB0aGlzLl9jb25maWdTZXJ2aWNlLmdldCgnY29udGV4dCcpLFxuICAgICAgICB0YWdzID0gX3RoaXMkX2NvbmZpZ1NlcnZpY2UkLnRhZ3MsXG4gICAgICAgIGNvbmZpZ0NvbnRleHQgPSBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXNMb29zZShfdGhpcyRfY29uZmlnU2VydmljZSQsIF9leGNsdWRlZCk7XG5cbiAgICB2YXIgcGFnZUNvbnRleHQgPSBnZXRQYWdlQ29udGV4dCgpO1xuICAgIHZhciBjb250ZXh0ID0gbWVyZ2Uoe30sIHBhZ2VDb250ZXh0LCB0cmFuc2FjdGlvbkNvbnRleHQsIGNvbmZpZ0NvbnRleHQsIGVycm9yQ29udGV4dCk7XG4gICAgdmFyIGVycm9yT2JqZWN0ID0ge1xuICAgICAgaWQ6IGdlbmVyYXRlUmFuZG9tSWQoKSxcbiAgICAgIGN1bHByaXQ6IGN1bHByaXQsXG4gICAgICBleGNlcHRpb246IHtcbiAgICAgICAgbWVzc2FnZTogZXJyb3JNZXNzYWdlLFxuICAgICAgICBzdGFja3RyYWNlOiBmaWx0ZXJlZEZyYW1lcyxcbiAgICAgICAgdHlwZTogZXJyb3JUeXBlXG4gICAgICB9LFxuICAgICAgY29udGV4dDogY29udGV4dFxuICAgIH07XG5cbiAgICBpZiAoY3VycmVudFRyYW5zYWN0aW9uKSB7XG4gICAgICBlcnJvck9iamVjdCA9IGV4dGVuZChlcnJvck9iamVjdCwge1xuICAgICAgICB0cmFjZV9pZDogY3VycmVudFRyYW5zYWN0aW9uLnRyYWNlSWQsXG4gICAgICAgIHBhcmVudF9pZDogY3VycmVudFRyYW5zYWN0aW9uLmlkLFxuICAgICAgICB0cmFuc2FjdGlvbl9pZDogY3VycmVudFRyYW5zYWN0aW9uLmlkLFxuICAgICAgICB0cmFuc2FjdGlvbjoge1xuICAgICAgICAgIHR5cGU6IGN1cnJlbnRUcmFuc2FjdGlvbi50eXBlLFxuICAgICAgICAgIHNhbXBsZWQ6IGN1cnJlbnRUcmFuc2FjdGlvbi5zYW1wbGVkXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVuY2F0ZU1vZGVsKEVSUk9SX01PREVMLCBlcnJvck9iamVjdCk7XG4gIH07XG5cbiAgX3Byb3RvLmxvZ0Vycm9yRXZlbnQgPSBmdW5jdGlvbiBsb2dFcnJvckV2ZW50KGVycm9yRXZlbnQpIHtcbiAgICBpZiAodHlwZW9mIGVycm9yRXZlbnQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGVycm9yT2JqZWN0ID0gdGhpcy5jcmVhdGVFcnJvckRhdGFNb2RlbChlcnJvckV2ZW50KTtcblxuICAgIGlmICh0eXBlb2YgZXJyb3JPYmplY3QuZXhjZXB0aW9uLm1lc3NhZ2UgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5fYXBtU2VydmVyLmFkZEVycm9yKGVycm9yT2JqZWN0KTtcbiAgfTtcblxuICBfcHJvdG8ucmVnaXN0ZXJMaXN0ZW5lcnMgPSBmdW5jdGlvbiByZWdpc3Rlckxpc3RlbmVycygpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgZnVuY3Rpb24gKGVycm9yRXZlbnQpIHtcbiAgICAgIHJldHVybiBfdGhpcy5sb2dFcnJvckV2ZW50KGVycm9yRXZlbnQpO1xuICAgIH0pO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCd1bmhhbmRsZWRyZWplY3Rpb24nLCBmdW5jdGlvbiAocHJvbWlzZVJlamVjdGlvbkV2ZW50KSB7XG4gICAgICByZXR1cm4gX3RoaXMubG9nUHJvbWlzZUV2ZW50KHByb21pc2VSZWplY3Rpb25FdmVudCk7XG4gICAgfSk7XG4gIH07XG5cbiAgX3Byb3RvLmxvZ1Byb21pc2VFdmVudCA9IGZ1bmN0aW9uIGxvZ1Byb21pc2VFdmVudChwcm9taXNlUmVqZWN0aW9uRXZlbnQpIHtcbiAgICB2YXIgcmVhc29uID0gcHJvbWlzZVJlamVjdGlvbkV2ZW50LnJlYXNvbjtcblxuICAgIGlmIChyZWFzb24gPT0gbnVsbCkge1xuICAgICAgcmVhc29uID0gJzxubyByZWFzb24gc3BlY2lmaWVkPic7XG4gICAgfVxuXG4gICAgdmFyIGVycm9yRXZlbnQ7XG5cbiAgICBpZiAodHlwZW9mIHJlYXNvbi5tZXNzYWdlID09PSAnc3RyaW5nJykge1xuICAgICAgdmFyIG5hbWUgPSByZWFzb24ubmFtZSA/IHJlYXNvbi5uYW1lICsgJzogJyA6ICcnO1xuICAgICAgZXJyb3JFdmVudCA9IHtcbiAgICAgICAgZXJyb3I6IHJlYXNvbixcbiAgICAgICAgbWVzc2FnZTogUFJPTUlTRV9SRUpFQ1RJT05fUFJFRklYICsgbmFtZSArIHJlYXNvbi5tZXNzYWdlXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBlcnJvckV2ZW50ID0gdGhpcy5fcGFyc2VSZWplY3RSZWFzb24ocmVhc29uKTtcbiAgICB9XG5cbiAgICB0aGlzLmxvZ0Vycm9yRXZlbnQoZXJyb3JFdmVudCk7XG4gIH07XG5cbiAgX3Byb3RvLmxvZ0Vycm9yID0gZnVuY3Rpb24gbG9nRXJyb3IobWVzc2FnZU9yRXJyb3IpIHtcbiAgICB2YXIgZXJyb3JFdmVudCA9IHt9O1xuXG4gICAgaWYgKHR5cGVvZiBtZXNzYWdlT3JFcnJvciA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGVycm9yRXZlbnQubWVzc2FnZSA9IG1lc3NhZ2VPckVycm9yO1xuICAgIH0gZWxzZSB7XG4gICAgICBlcnJvckV2ZW50LmVycm9yID0gbWVzc2FnZU9yRXJyb3I7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMubG9nRXJyb3JFdmVudChlcnJvckV2ZW50KTtcbiAgfTtcblxuICBfcHJvdG8uX3BhcnNlUmVqZWN0UmVhc29uID0gZnVuY3Rpb24gX3BhcnNlUmVqZWN0UmVhc29uKHJlYXNvbikge1xuICAgIHZhciBlcnJvckV2ZW50ID0ge1xuICAgICAgbWVzc2FnZTogUFJPTUlTRV9SRUpFQ1RJT05fUFJFRklYXG4gICAgfTtcblxuICAgIGlmIChBcnJheS5pc0FycmF5KHJlYXNvbikpIHtcbiAgICAgIGVycm9yRXZlbnQubWVzc2FnZSArPSAnPG9iamVjdD4nO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIHJlYXNvbiA9PT0gJ29iamVjdCcpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGVycm9yRXZlbnQubWVzc2FnZSArPSBKU09OLnN0cmluZ2lmeShyZWFzb24pO1xuICAgICAgICBlcnJvckV2ZW50LmVycm9yID0gcmVhc29uO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgZXJyb3JFdmVudC5tZXNzYWdlICs9ICc8b2JqZWN0Pic7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgcmVhc29uID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBlcnJvckV2ZW50Lm1lc3NhZ2UgKz0gJzxmdW5jdGlvbj4nO1xuICAgIH0gZWxzZSB7XG4gICAgICBlcnJvckV2ZW50Lm1lc3NhZ2UgKz0gcmVhc29uO1xuICAgIH1cblxuICAgIHJldHVybiBlcnJvckV2ZW50O1xuICB9O1xuXG4gIHJldHVybiBFcnJvckxvZ2dpbmc7XG59KCk7XG5cbmV4cG9ydCBkZWZhdWx0IEVycm9yTG9nZ2luZzsiLCJpbXBvcnQgRXJyb3JMb2dnaW5nIGZyb20gJy4vZXJyb3ItbG9nZ2luZyc7XG5pbXBvcnQgeyBDT05GSUdfU0VSVklDRSwgVFJBTlNBQ1RJT05fU0VSVklDRSwgRVJST1JfTE9HR0lORywgQVBNX1NFUlZFUiB9IGZyb20gJy4uL2NvbW1vbi9jb25zdGFudHMnO1xuaW1wb3J0IHsgc2VydmljZUNyZWF0b3JzIH0gZnJvbSAnLi4vY29tbW9uL3NlcnZpY2UtZmFjdG9yeSc7XG5cbmZ1bmN0aW9uIHJlZ2lzdGVyU2VydmljZXMoKSB7XG4gIHNlcnZpY2VDcmVhdG9yc1tFUlJPUl9MT0dHSU5HXSA9IGZ1bmN0aW9uIChzZXJ2aWNlRmFjdG9yeSkge1xuICAgIHZhciBfc2VydmljZUZhY3RvcnkkZ2V0U2UgPSBzZXJ2aWNlRmFjdG9yeS5nZXRTZXJ2aWNlKFtBUE1fU0VSVkVSLCBDT05GSUdfU0VSVklDRSwgVFJBTlNBQ1RJT05fU0VSVklDRV0pLFxuICAgICAgICBhcG1TZXJ2ZXIgPSBfc2VydmljZUZhY3RvcnkkZ2V0U2VbMF0sXG4gICAgICAgIGNvbmZpZ1NlcnZpY2UgPSBfc2VydmljZUZhY3RvcnkkZ2V0U2VbMV0sXG4gICAgICAgIHRyYW5zYWN0aW9uU2VydmljZSA9IF9zZXJ2aWNlRmFjdG9yeSRnZXRTZVsyXTtcblxuICAgIHJldHVybiBuZXcgRXJyb3JMb2dnaW5nKGFwbVNlcnZlciwgY29uZmlnU2VydmljZSwgdHJhbnNhY3Rpb25TZXJ2aWNlKTtcbiAgfTtcbn1cblxuZXhwb3J0IHsgcmVnaXN0ZXJTZXJ2aWNlcyB9OyIsImZ1bmN0aW9uIGZpbGVQYXRoVG9GaWxlTmFtZShmaWxlVXJsKSB7XG4gIHZhciBvcmlnaW4gPSB3aW5kb3cubG9jYXRpb24ub3JpZ2luIHx8IHdpbmRvdy5sb2NhdGlvbi5wcm90b2NvbCArICcvLycgKyB3aW5kb3cubG9jYXRpb24uaG9zdG5hbWUgKyAod2luZG93LmxvY2F0aW9uLnBvcnQgPyAnOicgKyB3aW5kb3cubG9jYXRpb24ucG9ydCA6ICcnKTtcblxuICBpZiAoZmlsZVVybC5pbmRleE9mKG9yaWdpbikgPiAtMSkge1xuICAgIGZpbGVVcmwgPSBmaWxlVXJsLnJlcGxhY2Uob3JpZ2luICsgJy8nLCAnJyk7XG4gIH1cblxuICByZXR1cm4gZmlsZVVybDtcbn1cblxuZnVuY3Rpb24gY2xlYW5GaWxlUGF0aChmaWxlUGF0aCkge1xuICBpZiAoZmlsZVBhdGggPT09IHZvaWQgMCkge1xuICAgIGZpbGVQYXRoID0gJyc7XG4gIH1cblxuICBpZiAoZmlsZVBhdGggPT09ICc8YW5vbnltb3VzPicpIHtcbiAgICBmaWxlUGF0aCA9ICcnO1xuICB9XG5cbiAgcmV0dXJuIGZpbGVQYXRoO1xufVxuXG5mdW5jdGlvbiBpc0ZpbGVJbmxpbmUoZmlsZVVybCkge1xuICBpZiAoZmlsZVVybCkge1xuICAgIHJldHVybiB3aW5kb3cubG9jYXRpb24uaHJlZi5pbmRleE9mKGZpbGVVcmwpID09PSAwO1xuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBub3JtYWxpemVTdGFja0ZyYW1lcyhzdGFja0ZyYW1lcykge1xuICByZXR1cm4gc3RhY2tGcmFtZXMubWFwKGZ1bmN0aW9uIChmcmFtZSkge1xuICAgIGlmIChmcmFtZS5mdW5jdGlvbk5hbWUpIHtcbiAgICAgIGZyYW1lLmZ1bmN0aW9uTmFtZSA9IG5vcm1hbGl6ZUZ1bmN0aW9uTmFtZShmcmFtZS5mdW5jdGlvbk5hbWUpO1xuICAgIH1cblxuICAgIHJldHVybiBmcmFtZTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZUZ1bmN0aW9uTmFtZShmbk5hbWUpIHtcbiAgdmFyIHBhcnRzID0gZm5OYW1lLnNwbGl0KCcvJyk7XG5cbiAgaWYgKHBhcnRzLmxlbmd0aCA+IDEpIHtcbiAgICBmbk5hbWUgPSBbJ09iamVjdCcsIHBhcnRzW3BhcnRzLmxlbmd0aCAtIDFdXS5qb2luKCcuJyk7XG4gIH0gZWxzZSB7XG4gICAgZm5OYW1lID0gcGFydHNbMF07XG4gIH1cblxuICBmbk5hbWUgPSBmbk5hbWUucmVwbGFjZSgvLjwkL2dpLCAnLjxhbm9ueW1vdXM+Jyk7XG4gIGZuTmFtZSA9IGZuTmFtZS5yZXBsYWNlKC9eQW5vbnltb3VzIGZ1bmN0aW9uJC8sICc8YW5vbnltb3VzPicpO1xuICBwYXJ0cyA9IGZuTmFtZS5zcGxpdCgnLicpO1xuXG4gIGlmIChwYXJ0cy5sZW5ndGggPiAxKSB7XG4gICAgZm5OYW1lID0gcGFydHNbcGFydHMubGVuZ3RoIC0gMV07XG4gIH0gZWxzZSB7XG4gICAgZm5OYW1lID0gcGFydHNbMF07XG4gIH1cblxuICByZXR1cm4gZm5OYW1lO1xufVxuXG5mdW5jdGlvbiBpc1ZhbGlkU3RhY2tUcmFjZShzdGFja1RyYWNlcykge1xuICBpZiAoc3RhY2tUcmFjZXMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKHN0YWNrVHJhY2VzLmxlbmd0aCA9PT0gMSkge1xuICAgIHZhciBzdGFja1RyYWNlID0gc3RhY2tUcmFjZXNbMF07XG4gICAgcmV0dXJuICdsaW5lTnVtYmVyJyBpbiBzdGFja1RyYWNlO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVTdGFja1RyYWNlcyhzdGFja1BhcnNlciwgZXJyb3JFdmVudCkge1xuICB2YXIgZXJyb3IgPSBlcnJvckV2ZW50LmVycm9yLFxuICAgICAgZmlsZW5hbWUgPSBlcnJvckV2ZW50LmZpbGVuYW1lLFxuICAgICAgbGluZW5vID0gZXJyb3JFdmVudC5saW5lbm8sXG4gICAgICBjb2xubyA9IGVycm9yRXZlbnQuY29sbm87XG4gIHZhciBzdGFja1RyYWNlcyA9IFtdO1xuXG4gIGlmIChlcnJvcikge1xuICAgIHRyeSB7XG4gICAgICBzdGFja1RyYWNlcyA9IHN0YWNrUGFyc2VyLnBhcnNlKGVycm9yKTtcbiAgICB9IGNhdGNoIChlKSB7fVxuICB9XG5cbiAgaWYgKCFpc1ZhbGlkU3RhY2tUcmFjZShzdGFja1RyYWNlcykpIHtcbiAgICBzdGFja1RyYWNlcyA9IFt7XG4gICAgICBmaWxlTmFtZTogZmlsZW5hbWUsXG4gICAgICBsaW5lTnVtYmVyOiBsaW5lbm8sXG4gICAgICBjb2x1bW5OdW1iZXI6IGNvbG5vXG4gICAgfV07XG4gIH1cblxuICB2YXIgbm9ybWFsaXplZFN0YWNrVHJhY2VzID0gbm9ybWFsaXplU3RhY2tGcmFtZXMoc3RhY2tUcmFjZXMpO1xuICByZXR1cm4gbm9ybWFsaXplZFN0YWNrVHJhY2VzLm1hcChmdW5jdGlvbiAoc3RhY2spIHtcbiAgICB2YXIgZmlsZU5hbWUgPSBzdGFjay5maWxlTmFtZSxcbiAgICAgICAgbGluZU51bWJlciA9IHN0YWNrLmxpbmVOdW1iZXIsXG4gICAgICAgIGNvbHVtbk51bWJlciA9IHN0YWNrLmNvbHVtbk51bWJlcixcbiAgICAgICAgX3N0YWNrJGZ1bmN0aW9uTmFtZSA9IHN0YWNrLmZ1bmN0aW9uTmFtZSxcbiAgICAgICAgZnVuY3Rpb25OYW1lID0gX3N0YWNrJGZ1bmN0aW9uTmFtZSA9PT0gdm9pZCAwID8gJzxhbm9ueW1vdXM+JyA6IF9zdGFjayRmdW5jdGlvbk5hbWU7XG5cbiAgICBpZiAoIWZpbGVOYW1lICYmICFsaW5lTnVtYmVyKSB7XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuXG4gICAgaWYgKCFjb2x1bW5OdW1iZXIgJiYgIWxpbmVOdW1iZXIpIHtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG5cbiAgICB2YXIgZmlsZVBhdGggPSBjbGVhbkZpbGVQYXRoKGZpbGVOYW1lKTtcbiAgICB2YXIgY2xlYW5lZEZpbGVOYW1lID0gZmlsZVBhdGhUb0ZpbGVOYW1lKGZpbGVQYXRoKTtcblxuICAgIGlmIChpc0ZpbGVJbmxpbmUoZmlsZVBhdGgpKSB7XG4gICAgICBjbGVhbmVkRmlsZU5hbWUgPSAnKGlubGluZSBzY3JpcHQpJztcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgYWJzX3BhdGg6IGZpbGVOYW1lLFxuICAgICAgZmlsZW5hbWU6IGNsZWFuZWRGaWxlTmFtZSxcbiAgICAgIGZ1bmN0aW9uOiBmdW5jdGlvbk5hbWUsXG4gICAgICBsaW5lbm86IGxpbmVOdW1iZXIsXG4gICAgICBjb2xubzogY29sdW1uTnVtYmVyXG4gICAgfTtcbiAgfSk7XG59XG5leHBvcnQgZnVuY3Rpb24gZmlsdGVySW52YWxpZEZyYW1lcyhmcmFtZXMpIHtcbiAgcmV0dXJuIGZyYW1lcy5maWx0ZXIoZnVuY3Rpb24gKF9yZWYpIHtcbiAgICB2YXIgZmlsZW5hbWUgPSBfcmVmLmZpbGVuYW1lLFxuICAgICAgICBsaW5lbm8gPSBfcmVmLmxpbmVubztcbiAgICByZXR1cm4gdHlwZW9mIGZpbGVuYW1lICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgbGluZW5vICE9PSAndW5kZWZpbmVkJztcbiAgfSk7XG59IiwiaW1wb3J0IHsgcmVnaXN0ZXJTZXJ2aWNlcyBhcyByZWdpc3RlckVycm9yU2VydmljZXMgfSBmcm9tICcuL2Vycm9yLWxvZ2dpbmcnO1xuaW1wb3J0IHsgcmVnaXN0ZXJTZXJ2aWNlcyBhcyByZWdpc3RlclBlcmZTZXJ2aWNlcywgb2JzZXJ2ZVVzZXJJbnRlcmFjdGlvbnMgfSBmcm9tICcuL3BlcmZvcm1hbmNlLW1vbml0b3JpbmcnO1xuaW1wb3J0IHsgU2VydmljZUZhY3RvcnkgfSBmcm9tICcuL2NvbW1vbi9zZXJ2aWNlLWZhY3RvcnknO1xuaW1wb3J0IHsgaXNQbGF0Zm9ybVN1cHBvcnRlZCwgc2NoZWR1bGVNaWNyb1Rhc2ssIHNjaGVkdWxlTWFjcm9UYXNrLCBpc0Jyb3dzZXIgfSBmcm9tICcuL2NvbW1vbi91dGlscyc7XG5pbXBvcnQgeyBwYXRjaEFsbCwgcGF0Y2hFdmVudEhhbmRsZXIgfSBmcm9tICcuL2NvbW1vbi9wYXRjaGluZyc7XG5pbXBvcnQgeyBvYnNlcnZlUGFnZVZpc2liaWxpdHksIG9ic2VydmVQYWdlQ2xpY2tzIH0gZnJvbSAnLi9jb21tb24vb2JzZXJ2ZXJzJztcbmltcG9ydCB7IFBBR0VfTE9BRF9ERUxBWSwgUEFHRV9MT0FELCBFUlJPUiwgQ09ORklHX1NFUlZJQ0UsIExPR0dJTkdfU0VSVklDRSwgVFJBTlNBQ1RJT05fU0VSVklDRSwgQVBNX1NFUlZFUiwgUEVSRk9STUFOQ0VfTU9OSVRPUklORywgRVJST1JfTE9HR0lORywgRVZFTlRfVEFSR0VULCBDTElDSyB9IGZyb20gJy4vY29tbW9uL2NvbnN0YW50cyc7XG5pbXBvcnQgeyBnZXRJbnN0cnVtZW50YXRpb25GbGFncyB9IGZyb20gJy4vY29tbW9uL2luc3RydW1lbnQnO1xuaW1wb3J0IGFmdGVyRnJhbWUgZnJvbSAnLi9jb21tb24vYWZ0ZXItZnJhbWUnO1xuaW1wb3J0IHsgYm9vdHN0cmFwIH0gZnJvbSAnLi9ib290c3RyYXAnO1xuaW1wb3J0IHsgY3JlYXRlVHJhY2VyIH0gZnJvbSAnLi9vcGVudHJhY2luZyc7XG5cbmZ1bmN0aW9uIGNyZWF0ZVNlcnZpY2VGYWN0b3J5KCkge1xuICByZWdpc3RlclBlcmZTZXJ2aWNlcygpO1xuICByZWdpc3RlckVycm9yU2VydmljZXMoKTtcbiAgdmFyIHNlcnZpY2VGYWN0b3J5ID0gbmV3IFNlcnZpY2VGYWN0b3J5KCk7XG4gIHJldHVybiBzZXJ2aWNlRmFjdG9yeTtcbn1cblxuZXhwb3J0IHsgY3JlYXRlU2VydmljZUZhY3RvcnksIFNlcnZpY2VGYWN0b3J5LCBwYXRjaEFsbCwgcGF0Y2hFdmVudEhhbmRsZXIsIGlzUGxhdGZvcm1TdXBwb3J0ZWQsIGlzQnJvd3NlciwgZ2V0SW5zdHJ1bWVudGF0aW9uRmxhZ3MsIGNyZWF0ZVRyYWNlciwgc2NoZWR1bGVNaWNyb1Rhc2ssIHNjaGVkdWxlTWFjcm9UYXNrLCBhZnRlckZyYW1lLCBFUlJPUiwgUEFHRV9MT0FEX0RFTEFZLCBQQUdFX0xPQUQsIENPTkZJR19TRVJWSUNFLCBMT0dHSU5HX1NFUlZJQ0UsIFRSQU5TQUNUSU9OX1NFUlZJQ0UsIEFQTV9TRVJWRVIsIFBFUkZPUk1BTkNFX01PTklUT1JJTkcsIEVSUk9SX0xPR0dJTkcsIEVWRU5UX1RBUkdFVCwgQ0xJQ0ssIG9ic2VydmVVc2VySW50ZXJhY3Rpb25zLCBib290c3RyYXAsIG9ic2VydmVQYWdlVmlzaWJpbGl0eSwgb2JzZXJ2ZVBhZ2VDbGlja3MgfTsiLCJpbXBvcnQgVHJhY2VyIGZyb20gJy4vdHJhY2VyJztcbmltcG9ydCBTcGFuIGZyb20gJy4vc3Bhbic7XG5pbXBvcnQgeyBUUkFOU0FDVElPTl9TRVJWSUNFLCBMT0dHSU5HX1NFUlZJQ0UsIFBFUkZPUk1BTkNFX01PTklUT1JJTkcsIEVSUk9SX0xPR0dJTkcgfSBmcm9tICcuLi9jb21tb24vY29uc3RhbnRzJztcblxuZnVuY3Rpb24gY3JlYXRlVHJhY2VyKHNlcnZpY2VGYWN0b3J5KSB7XG4gIHZhciBwZXJmb3JtYW5jZU1vbml0b3JpbmcgPSBzZXJ2aWNlRmFjdG9yeS5nZXRTZXJ2aWNlKFBFUkZPUk1BTkNFX01PTklUT1JJTkcpO1xuICB2YXIgdHJhbnNhY3Rpb25TZXJ2aWNlID0gc2VydmljZUZhY3RvcnkuZ2V0U2VydmljZShUUkFOU0FDVElPTl9TRVJWSUNFKTtcbiAgdmFyIGVycm9yTG9nZ2luZyA9IHNlcnZpY2VGYWN0b3J5LmdldFNlcnZpY2UoRVJST1JfTE9HR0lORyk7XG4gIHZhciBsb2dnaW5nU2VydmljZSA9IHNlcnZpY2VGYWN0b3J5LmdldFNlcnZpY2UoTE9HR0lOR19TRVJWSUNFKTtcbiAgcmV0dXJuIG5ldyBUcmFjZXIocGVyZm9ybWFuY2VNb25pdG9yaW5nLCB0cmFuc2FjdGlvblNlcnZpY2UsIGxvZ2dpbmdTZXJ2aWNlLCBlcnJvckxvZ2dpbmcpO1xufVxuXG5leHBvcnQgeyBTcGFuLCBUcmFjZXIsIGNyZWF0ZVRyYWNlciB9OyIsImZ1bmN0aW9uIF9pbmhlcml0c0xvb3NlKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7IHN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcy5wcm90b3R5cGUpOyBzdWJDbGFzcy5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBzdWJDbGFzczsgX3NldFByb3RvdHlwZU9mKHN1YkNsYXNzLCBzdXBlckNsYXNzKTsgfVxuXG5mdW5jdGlvbiBfc2V0UHJvdG90eXBlT2YobywgcCkgeyBfc2V0UHJvdG90eXBlT2YgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHwgZnVuY3Rpb24gX3NldFByb3RvdHlwZU9mKG8sIHApIHsgby5fX3Byb3RvX18gPSBwOyByZXR1cm4gbzsgfTsgcmV0dXJuIF9zZXRQcm90b3R5cGVPZihvLCBwKTsgfVxuXG5pbXBvcnQgeyBTcGFuIGFzIG90U3BhbiB9IGZyb20gJ29wZW50cmFjaW5nL2xpYi9zcGFuJztcbmltcG9ydCB7IGV4dGVuZCwgZ2V0VGltZU9yaWdpbiB9IGZyb20gJy4uL2NvbW1vbi91dGlscyc7XG5pbXBvcnQgVHJhbnNhY3Rpb24gZnJvbSAnLi4vcGVyZm9ybWFuY2UtbW9uaXRvcmluZy90cmFuc2FjdGlvbic7XG5cbnZhciBTcGFuID0gZnVuY3Rpb24gKF9vdFNwYW4pIHtcbiAgX2luaGVyaXRzTG9vc2UoU3BhbiwgX290U3Bhbik7XG5cbiAgZnVuY3Rpb24gU3Bhbih0cmFjZXIsIHNwYW4pIHtcbiAgICB2YXIgX3RoaXM7XG5cbiAgICBfdGhpcyA9IF9vdFNwYW4uY2FsbCh0aGlzKSB8fCB0aGlzO1xuICAgIF90aGlzLl9fdHJhY2VyID0gdHJhY2VyO1xuICAgIF90aGlzLnNwYW4gPSBzcGFuO1xuICAgIF90aGlzLmlzVHJhbnNhY3Rpb24gPSBzcGFuIGluc3RhbmNlb2YgVHJhbnNhY3Rpb247XG4gICAgX3RoaXMuc3BhbkNvbnRleHQgPSB7XG4gICAgICBpZDogc3Bhbi5pZCxcbiAgICAgIHRyYWNlSWQ6IHNwYW4udHJhY2VJZCxcbiAgICAgIHNhbXBsZWQ6IHNwYW4uc2FtcGxlZFxuICAgIH07XG4gICAgcmV0dXJuIF90aGlzO1xuICB9XG5cbiAgdmFyIF9wcm90byA9IFNwYW4ucHJvdG90eXBlO1xuXG4gIF9wcm90by5fY29udGV4dCA9IGZ1bmN0aW9uIF9jb250ZXh0KCkge1xuICAgIHJldHVybiB0aGlzLnNwYW5Db250ZXh0O1xuICB9O1xuXG4gIF9wcm90by5fdHJhY2VyID0gZnVuY3Rpb24gX3RyYWNlcigpIHtcbiAgICByZXR1cm4gdGhpcy5fX3RyYWNlcjtcbiAgfTtcblxuICBfcHJvdG8uX3NldE9wZXJhdGlvbk5hbWUgPSBmdW5jdGlvbiBfc2V0T3BlcmF0aW9uTmFtZShuYW1lKSB7XG4gICAgdGhpcy5zcGFuLm5hbWUgPSBuYW1lO1xuICB9O1xuXG4gIF9wcm90by5fYWRkVGFncyA9IGZ1bmN0aW9uIF9hZGRUYWdzKGtleVZhbHVlUGFpcnMpIHtcbiAgICB2YXIgdGFncyA9IGV4dGVuZCh7fSwga2V5VmFsdWVQYWlycyk7XG5cbiAgICBpZiAodGFncy50eXBlKSB7XG4gICAgICB0aGlzLnNwYW4udHlwZSA9IHRhZ3MudHlwZTtcbiAgICAgIGRlbGV0ZSB0YWdzLnR5cGU7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuaXNUcmFuc2FjdGlvbikge1xuICAgICAgdmFyIHVzZXJJZCA9IHRhZ3NbJ3VzZXIuaWQnXTtcbiAgICAgIHZhciB1c2VybmFtZSA9IHRhZ3NbJ3VzZXIudXNlcm5hbWUnXTtcbiAgICAgIHZhciBlbWFpbCA9IHRhZ3NbJ3VzZXIuZW1haWwnXTtcblxuICAgICAgaWYgKHVzZXJJZCB8fCB1c2VybmFtZSB8fCBlbWFpbCkge1xuICAgICAgICB0aGlzLnNwYW4uYWRkQ29udGV4dCh7XG4gICAgICAgICAgdXNlcjoge1xuICAgICAgICAgICAgaWQ6IHVzZXJJZCxcbiAgICAgICAgICAgIHVzZXJuYW1lOiB1c2VybmFtZSxcbiAgICAgICAgICAgIGVtYWlsOiBlbWFpbFxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGRlbGV0ZSB0YWdzWyd1c2VyLmlkJ107XG4gICAgICAgIGRlbGV0ZSB0YWdzWyd1c2VyLnVzZXJuYW1lJ107XG4gICAgICAgIGRlbGV0ZSB0YWdzWyd1c2VyLmVtYWlsJ107XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5zcGFuLmFkZExhYmVscyh0YWdzKTtcbiAgfTtcblxuICBfcHJvdG8uX2xvZyA9IGZ1bmN0aW9uIF9sb2cobG9nLCB0aW1lc3RhbXApIHtcbiAgICBpZiAobG9nLmV2ZW50ID09PSAnZXJyb3InKSB7XG4gICAgICBpZiAobG9nWydlcnJvci5vYmplY3QnXSkge1xuICAgICAgICB0aGlzLl9fdHJhY2VyLmVycm9yTG9nZ2luZy5sb2dFcnJvcihsb2dbJ2Vycm9yLm9iamVjdCddKTtcbiAgICAgIH0gZWxzZSBpZiAobG9nLm1lc3NhZ2UpIHtcbiAgICAgICAgdGhpcy5fX3RyYWNlci5lcnJvckxvZ2dpbmcubG9nRXJyb3IobG9nLm1lc3NhZ2UpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBfcHJvdG8uX2ZpbmlzaCA9IGZ1bmN0aW9uIF9maW5pc2goZmluaXNoVGltZSkge1xuICAgIHRoaXMuc3Bhbi5lbmQoKTtcblxuICAgIGlmIChmaW5pc2hUaW1lKSB7XG4gICAgICB0aGlzLnNwYW4uX2VuZCA9IGZpbmlzaFRpbWUgLSBnZXRUaW1lT3JpZ2luKCk7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiBTcGFuO1xufShvdFNwYW4pO1xuXG5leHBvcnQgZGVmYXVsdCBTcGFuOyIsImZ1bmN0aW9uIF9pbmhlcml0c0xvb3NlKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7IHN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcy5wcm90b3R5cGUpOyBzdWJDbGFzcy5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBzdWJDbGFzczsgX3NldFByb3RvdHlwZU9mKHN1YkNsYXNzLCBzdXBlckNsYXNzKTsgfVxuXG5mdW5jdGlvbiBfc2V0UHJvdG90eXBlT2YobywgcCkgeyBfc2V0UHJvdG90eXBlT2YgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHwgZnVuY3Rpb24gX3NldFByb3RvdHlwZU9mKG8sIHApIHsgby5fX3Byb3RvX18gPSBwOyByZXR1cm4gbzsgfTsgcmV0dXJuIF9zZXRQcm90b3R5cGVPZihvLCBwKTsgfVxuXG5pbXBvcnQgeyBUcmFjZXIgYXMgb3RUcmFjZXIgfSBmcm9tICdvcGVudHJhY2luZy9saWIvdHJhY2VyJztcbmltcG9ydCB7IFJFRkVSRU5DRV9DSElMRF9PRiwgRk9STUFUX1RFWFRfTUFQLCBGT1JNQVRfSFRUUF9IRUFERVJTLCBGT1JNQVRfQklOQVJZIH0gZnJvbSAnb3BlbnRyYWNpbmcvbGliL2NvbnN0YW50cyc7XG5pbXBvcnQgeyBTcGFuIGFzIE5vb3BTcGFuIH0gZnJvbSAnb3BlbnRyYWNpbmcvbGliL3NwYW4nO1xuaW1wb3J0IHsgZ2V0VGltZU9yaWdpbiwgZmluZCB9IGZyb20gJy4uL2NvbW1vbi91dGlscyc7XG5pbXBvcnQgeyBfX0RFVl9fIH0gZnJvbSAnLi4vc3RhdGUnO1xuaW1wb3J0IFNwYW4gZnJvbSAnLi9zcGFuJztcblxudmFyIFRyYWNlciA9IGZ1bmN0aW9uIChfb3RUcmFjZXIpIHtcbiAgX2luaGVyaXRzTG9vc2UoVHJhY2VyLCBfb3RUcmFjZXIpO1xuXG4gIGZ1bmN0aW9uIFRyYWNlcihwZXJmb3JtYW5jZU1vbml0b3JpbmcsIHRyYW5zYWN0aW9uU2VydmljZSwgbG9nZ2luZ1NlcnZpY2UsIGVycm9yTG9nZ2luZykge1xuICAgIHZhciBfdGhpcztcblxuICAgIF90aGlzID0gX290VHJhY2VyLmNhbGwodGhpcykgfHwgdGhpcztcbiAgICBfdGhpcy5wZXJmb3JtYW5jZU1vbml0b3JpbmcgPSBwZXJmb3JtYW5jZU1vbml0b3Jpbmc7XG4gICAgX3RoaXMudHJhbnNhY3Rpb25TZXJ2aWNlID0gdHJhbnNhY3Rpb25TZXJ2aWNlO1xuICAgIF90aGlzLmxvZ2dpbmdTZXJ2aWNlID0gbG9nZ2luZ1NlcnZpY2U7XG4gICAgX3RoaXMuZXJyb3JMb2dnaW5nID0gZXJyb3JMb2dnaW5nO1xuICAgIHJldHVybiBfdGhpcztcbiAgfVxuXG4gIHZhciBfcHJvdG8gPSBUcmFjZXIucHJvdG90eXBlO1xuXG4gIF9wcm90by5fc3RhcnRTcGFuID0gZnVuY3Rpb24gX3N0YXJ0U3BhbihuYW1lLCBvcHRpb25zKSB7XG4gICAgdmFyIHNwYW5PcHRpb25zID0ge1xuICAgICAgbWFuYWdlZDogdHJ1ZVxuICAgIH07XG5cbiAgICBpZiAob3B0aW9ucykge1xuICAgICAgc3Bhbk9wdGlvbnMudGltZXN0YW1wID0gb3B0aW9ucy5zdGFydFRpbWU7XG5cbiAgICAgIGlmIChvcHRpb25zLmNoaWxkT2YpIHtcbiAgICAgICAgc3Bhbk9wdGlvbnMucGFyZW50SWQgPSBvcHRpb25zLmNoaWxkT2YuaWQ7XG4gICAgICB9IGVsc2UgaWYgKG9wdGlvbnMucmVmZXJlbmNlcyAmJiBvcHRpb25zLnJlZmVyZW5jZXMubGVuZ3RoID4gMCkge1xuICAgICAgICBpZiAob3B0aW9ucy5yZWZlcmVuY2VzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICBpZiAoX19ERVZfXykge1xuICAgICAgICAgICAgdGhpcy5sb2dnaW5nU2VydmljZS5kZWJ1ZygnRWxhc3RpYyBBUE0gT3BlblRyYWNpbmc6IFVuc3VwcG9ydGVkIG51bWJlciBvZiByZWZlcmVuY2VzLCBvbmx5IHRoZSBmaXJzdCBjaGlsZE9mIHJlZmVyZW5jZSB3aWxsIGJlIHJlY29yZGVkLicpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBjaGlsZFJlZiA9IGZpbmQob3B0aW9ucy5yZWZlcmVuY2VzLCBmdW5jdGlvbiAocmVmKSB7XG4gICAgICAgICAgcmV0dXJuIHJlZi50eXBlKCkgPT09IFJFRkVSRU5DRV9DSElMRF9PRjtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKGNoaWxkUmVmKSB7XG4gICAgICAgICAgc3Bhbk9wdGlvbnMucGFyZW50SWQgPSBjaGlsZFJlZi5yZWZlcmVuY2VkQ29udGV4dCgpLmlkO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIHNwYW47XG4gICAgdmFyIGN1cnJlbnRUcmFuc2FjdGlvbiA9IHRoaXMudHJhbnNhY3Rpb25TZXJ2aWNlLmdldEN1cnJlbnRUcmFuc2FjdGlvbigpO1xuXG4gICAgaWYgKGN1cnJlbnRUcmFuc2FjdGlvbikge1xuICAgICAgc3BhbiA9IHRoaXMudHJhbnNhY3Rpb25TZXJ2aWNlLnN0YXJ0U3BhbihuYW1lLCB1bmRlZmluZWQsIHNwYW5PcHRpb25zKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3BhbiA9IHRoaXMudHJhbnNhY3Rpb25TZXJ2aWNlLnN0YXJ0VHJhbnNhY3Rpb24obmFtZSwgdW5kZWZpbmVkLCBzcGFuT3B0aW9ucyk7XG4gICAgfVxuXG4gICAgaWYgKCFzcGFuKSB7XG4gICAgICByZXR1cm4gbmV3IE5vb3BTcGFuKCk7XG4gICAgfVxuXG4gICAgaWYgKHNwYW5PcHRpb25zLnRpbWVzdGFtcCkge1xuICAgICAgc3Bhbi5fc3RhcnQgPSBzcGFuT3B0aW9ucy50aW1lc3RhbXAgLSBnZXRUaW1lT3JpZ2luKCk7XG4gICAgfVxuXG4gICAgdmFyIG90U3BhbiA9IG5ldyBTcGFuKHRoaXMsIHNwYW4pO1xuXG4gICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy50YWdzKSB7XG4gICAgICBvdFNwYW4uYWRkVGFncyhvcHRpb25zLnRhZ3MpO1xuICAgIH1cblxuICAgIHJldHVybiBvdFNwYW47XG4gIH07XG5cbiAgX3Byb3RvLl9pbmplY3QgPSBmdW5jdGlvbiBfaW5qZWN0KHNwYW5Db250ZXh0LCBmb3JtYXQsIGNhcnJpZXIpIHtcbiAgICBzd2l0Y2ggKGZvcm1hdCkge1xuICAgICAgY2FzZSBGT1JNQVRfVEVYVF9NQVA6XG4gICAgICBjYXNlIEZPUk1BVF9IVFRQX0hFQURFUlM6XG4gICAgICAgIHRoaXMucGVyZm9ybWFuY2VNb25pdG9yaW5nLmluamVjdER0SGVhZGVyKHNwYW5Db250ZXh0LCBjYXJyaWVyKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgRk9STUFUX0JJTkFSWTpcbiAgICAgICAgaWYgKF9fREVWX18pIHtcbiAgICAgICAgICB0aGlzLmxvZ2dpbmdTZXJ2aWNlLmRlYnVnKCdFbGFzdGljIEFQTSBPcGVuVHJhY2luZzogYmluYXJ5IGNhcnJpZXIgZm9ybWF0IGlzIG5vdCBzdXBwb3J0ZWQuJyk7XG4gICAgICAgIH1cblxuICAgICAgICBicmVhaztcbiAgICB9XG4gIH07XG5cbiAgX3Byb3RvLl9leHRyYWN0ID0gZnVuY3Rpb24gX2V4dHJhY3QoZm9ybWF0LCBjYXJyaWVyKSB7XG4gICAgdmFyIGN0eDtcblxuICAgIHN3aXRjaCAoZm9ybWF0KSB7XG4gICAgICBjYXNlIEZPUk1BVF9URVhUX01BUDpcbiAgICAgIGNhc2UgRk9STUFUX0hUVFBfSEVBREVSUzpcbiAgICAgICAgY3R4ID0gdGhpcy5wZXJmb3JtYW5jZU1vbml0b3JpbmcuZXh0cmFjdER0SGVhZGVyKGNhcnJpZXIpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBGT1JNQVRfQklOQVJZOlxuICAgICAgICBpZiAoX19ERVZfXykge1xuICAgICAgICAgIHRoaXMubG9nZ2luZ1NlcnZpY2UuZGVidWcoJ0VsYXN0aWMgQVBNIE9wZW5UcmFjaW5nOiBiaW5hcnkgY2FycmllciBmb3JtYXQgaXMgbm90IHN1cHBvcnRlZC4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIGlmICghY3R4KSB7XG4gICAgICBjdHggPSBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiBjdHg7XG4gIH07XG5cbiAgcmV0dXJuIFRyYWNlcjtcbn0ob3RUcmFjZXIpO1xuXG5leHBvcnQgZGVmYXVsdCBUcmFjZXI7IiwiaW1wb3J0IHsgZ2V0RHVyYXRpb24sIFBFUkYgfSBmcm9tICcuLi9jb21tb24vdXRpbHMnO1xuaW1wb3J0IHsgUEFHRV9MT0FELCBUUlVOQ0FURURfVFlQRSB9IGZyb20gJy4uL2NvbW1vbi9jb25zdGFudHMnO1xudmFyIHBhZ2VMb2FkQnJlYWtkb3ducyA9IFtbJ2RvbWFpbkxvb2t1cFN0YXJ0JywgJ2RvbWFpbkxvb2t1cEVuZCcsICdETlMnXSwgWydjb25uZWN0U3RhcnQnLCAnY29ubmVjdEVuZCcsICdUQ1AnXSwgWydyZXF1ZXN0U3RhcnQnLCAncmVzcG9uc2VTdGFydCcsICdSZXF1ZXN0J10sIFsncmVzcG9uc2VTdGFydCcsICdyZXNwb25zZUVuZCcsICdSZXNwb25zZSddLCBbJ2RvbUxvYWRpbmcnLCAnZG9tQ29tcGxldGUnLCAnUHJvY2Vzc2luZyddLCBbJ2xvYWRFdmVudFN0YXJ0JywgJ2xvYWRFdmVudEVuZCcsICdMb2FkJ11dO1xuXG5mdW5jdGlvbiBnZXRWYWx1ZSh2YWx1ZSkge1xuICByZXR1cm4ge1xuICAgIHZhbHVlOiB2YWx1ZVxuICB9O1xufVxuXG5mdW5jdGlvbiBjYWxjdWxhdGVTZWxmVGltZSh0cmFuc2FjdGlvbikge1xuICB2YXIgc3BhbnMgPSB0cmFuc2FjdGlvbi5zcGFucyxcbiAgICAgIF9zdGFydCA9IHRyYW5zYWN0aW9uLl9zdGFydCxcbiAgICAgIF9lbmQgPSB0cmFuc2FjdGlvbi5fZW5kO1xuXG4gIGlmIChzcGFucy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gdHJhbnNhY3Rpb24uZHVyYXRpb24oKTtcbiAgfVxuXG4gIHNwYW5zLnNvcnQoZnVuY3Rpb24gKHNwYW4xLCBzcGFuMikge1xuICAgIHJldHVybiBzcGFuMS5fc3RhcnQgLSBzcGFuMi5fc3RhcnQ7XG4gIH0pO1xuICB2YXIgc3BhbiA9IHNwYW5zWzBdO1xuICB2YXIgc3BhbkVuZCA9IHNwYW4uX2VuZDtcbiAgdmFyIHNwYW5TdGFydCA9IHNwYW4uX3N0YXJ0O1xuICB2YXIgbGFzdENvbnRpbnVvdXNFbmQgPSBzcGFuRW5kO1xuICB2YXIgc2VsZlRpbWUgPSBzcGFuU3RhcnQgLSBfc3RhcnQ7XG5cbiAgZm9yICh2YXIgaSA9IDE7IGkgPCBzcGFucy5sZW5ndGg7IGkrKykge1xuICAgIHNwYW4gPSBzcGFuc1tpXTtcbiAgICBzcGFuU3RhcnQgPSBzcGFuLl9zdGFydDtcbiAgICBzcGFuRW5kID0gc3Bhbi5fZW5kO1xuXG4gICAgaWYgKHNwYW5TdGFydCA+IGxhc3RDb250aW51b3VzRW5kKSB7XG4gICAgICBzZWxmVGltZSArPSBzcGFuU3RhcnQgLSBsYXN0Q29udGludW91c0VuZDtcbiAgICAgIGxhc3RDb250aW51b3VzRW5kID0gc3BhbkVuZDtcbiAgICB9IGVsc2UgaWYgKHNwYW5FbmQgPiBsYXN0Q29udGludW91c0VuZCkge1xuICAgICAgbGFzdENvbnRpbnVvdXNFbmQgPSBzcGFuRW5kO1xuICAgIH1cbiAgfVxuXG4gIGlmIChsYXN0Q29udGludW91c0VuZCA8IF9lbmQpIHtcbiAgICBzZWxmVGltZSArPSBfZW5kIC0gbGFzdENvbnRpbnVvdXNFbmQ7XG4gIH1cblxuICByZXR1cm4gc2VsZlRpbWU7XG59XG5cbmZ1bmN0aW9uIGdyb3VwU3BhbnModHJhbnNhY3Rpb24pIHtcbiAgdmFyIHNwYW5NYXAgPSB7fTtcbiAgdmFyIHRyYW5zYWN0aW9uU2VsZlRpbWUgPSBjYWxjdWxhdGVTZWxmVGltZSh0cmFuc2FjdGlvbik7XG4gIHNwYW5NYXBbJ2FwcCddID0ge1xuICAgIGNvdW50OiAxLFxuICAgIGR1cmF0aW9uOiB0cmFuc2FjdGlvblNlbGZUaW1lXG4gIH07XG4gIHZhciBzcGFucyA9IHRyYW5zYWN0aW9uLnNwYW5zO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3BhbnMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgc3BhbiA9IHNwYW5zW2ldO1xuICAgIHZhciBkdXJhdGlvbiA9IHNwYW4uZHVyYXRpb24oKTtcblxuICAgIGlmIChkdXJhdGlvbiA9PT0gMCB8fCBkdXJhdGlvbiA9PSBudWxsKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICB2YXIgdHlwZSA9IHNwYW4udHlwZSxcbiAgICAgICAgc3VidHlwZSA9IHNwYW4uc3VidHlwZTtcbiAgICB2YXIga2V5ID0gdHlwZS5yZXBsYWNlKFRSVU5DQVRFRF9UWVBFLCAnJyk7XG5cbiAgICBpZiAoc3VidHlwZSkge1xuICAgICAga2V5ICs9ICcuJyArIHN1YnR5cGU7XG4gICAgfVxuXG4gICAgaWYgKCFzcGFuTWFwW2tleV0pIHtcbiAgICAgIHNwYW5NYXBba2V5XSA9IHtcbiAgICAgICAgZHVyYXRpb246IDAsXG4gICAgICAgIGNvdW50OiAwXG4gICAgICB9O1xuICAgIH1cblxuICAgIHNwYW5NYXBba2V5XS5jb3VudCsrO1xuICAgIHNwYW5NYXBba2V5XS5kdXJhdGlvbiArPSBkdXJhdGlvbjtcbiAgfVxuXG4gIHJldHVybiBzcGFuTWFwO1xufVxuXG5mdW5jdGlvbiBnZXRTcGFuQnJlYWtkb3duKHRyYW5zYWN0aW9uRGV0YWlscywgX3JlZikge1xuICB2YXIgZGV0YWlscyA9IF9yZWYuZGV0YWlscyxcbiAgICAgIF9yZWYkY291bnQgPSBfcmVmLmNvdW50LFxuICAgICAgY291bnQgPSBfcmVmJGNvdW50ID09PSB2b2lkIDAgPyAxIDogX3JlZiRjb3VudCxcbiAgICAgIGR1cmF0aW9uID0gX3JlZi5kdXJhdGlvbjtcbiAgcmV0dXJuIHtcbiAgICB0cmFuc2FjdGlvbjogdHJhbnNhY3Rpb25EZXRhaWxzLFxuICAgIHNwYW46IGRldGFpbHMsXG4gICAgc2FtcGxlczoge1xuICAgICAgJ3NwYW4uc2VsZl90aW1lLmNvdW50JzogZ2V0VmFsdWUoY291bnQpLFxuICAgICAgJ3NwYW4uc2VsZl90aW1lLnN1bS51cyc6IGdldFZhbHVlKGR1cmF0aW9uICogMTAwMClcbiAgICB9XG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjYXB0dXJlQnJlYWtkb3duKHRyYW5zYWN0aW9uLCB0aW1pbmdzKSB7XG4gIGlmICh0aW1pbmdzID09PSB2b2lkIDApIHtcbiAgICB0aW1pbmdzID0gUEVSRi50aW1pbmc7XG4gIH1cblxuICB2YXIgYnJlYWtkb3ducyA9IFtdO1xuICB2YXIgbmFtZSA9IHRyYW5zYWN0aW9uLm5hbWUsXG4gICAgICB0eXBlID0gdHJhbnNhY3Rpb24udHlwZSxcbiAgICAgIHNhbXBsZWQgPSB0cmFuc2FjdGlvbi5zYW1wbGVkO1xuICB2YXIgdHJhbnNhY3Rpb25EZXRhaWxzID0ge1xuICAgIG5hbWU6IG5hbWUsXG4gICAgdHlwZTogdHlwZVxuICB9O1xuXG4gIGlmICghc2FtcGxlZCkge1xuICAgIHJldHVybiBicmVha2Rvd25zO1xuICB9XG5cbiAgaWYgKHR5cGUgPT09IFBBR0VfTE9BRCAmJiB0aW1pbmdzKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYWdlTG9hZEJyZWFrZG93bnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBjdXJyZW50ID0gcGFnZUxvYWRCcmVha2Rvd25zW2ldO1xuICAgICAgdmFyIHN0YXJ0ID0gdGltaW5nc1tjdXJyZW50WzBdXTtcbiAgICAgIHZhciBlbmQgPSB0aW1pbmdzW2N1cnJlbnRbMV1dO1xuICAgICAgdmFyIGR1cmF0aW9uID0gZ2V0RHVyYXRpb24oc3RhcnQsIGVuZCk7XG5cbiAgICAgIGlmIChkdXJhdGlvbiA9PT0gMCB8fCBkdXJhdGlvbiA9PSBudWxsKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBicmVha2Rvd25zLnB1c2goZ2V0U3BhbkJyZWFrZG93bih0cmFuc2FjdGlvbkRldGFpbHMsIHtcbiAgICAgICAgZGV0YWlsczoge1xuICAgICAgICAgIHR5cGU6IGN1cnJlbnRbMl1cbiAgICAgICAgfSxcbiAgICAgICAgZHVyYXRpb246IGR1cmF0aW9uXG4gICAgICB9KSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHZhciBzcGFuTWFwID0gZ3JvdXBTcGFucyh0cmFuc2FjdGlvbik7XG4gICAgT2JqZWN0LmtleXMoc3Bhbk1hcCkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICB2YXIgX2tleSRzcGxpdCA9IGtleS5zcGxpdCgnLicpLFxuICAgICAgICAgIHR5cGUgPSBfa2V5JHNwbGl0WzBdLFxuICAgICAgICAgIHN1YnR5cGUgPSBfa2V5JHNwbGl0WzFdO1xuXG4gICAgICB2YXIgX3NwYW5NYXAka2V5ID0gc3Bhbk1hcFtrZXldLFxuICAgICAgICAgIGR1cmF0aW9uID0gX3NwYW5NYXAka2V5LmR1cmF0aW9uLFxuICAgICAgICAgIGNvdW50ID0gX3NwYW5NYXAka2V5LmNvdW50O1xuICAgICAgYnJlYWtkb3ducy5wdXNoKGdldFNwYW5CcmVha2Rvd24odHJhbnNhY3Rpb25EZXRhaWxzLCB7XG4gICAgICAgIGRldGFpbHM6IHtcbiAgICAgICAgICB0eXBlOiB0eXBlLFxuICAgICAgICAgIHN1YnR5cGU6IHN1YnR5cGVcbiAgICAgICAgfSxcbiAgICAgICAgZHVyYXRpb246IGR1cmF0aW9uLFxuICAgICAgICBjb3VudDogY291bnRcbiAgICAgIH0pKTtcbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiBicmVha2Rvd25zO1xufSIsImltcG9ydCBQZXJmb3JtYW5jZU1vbml0b3JpbmcgZnJvbSAnLi9wZXJmb3JtYW5jZS1tb25pdG9yaW5nJztcbmltcG9ydCBUcmFuc2FjdGlvblNlcnZpY2UgZnJvbSAnLi90cmFuc2FjdGlvbi1zZXJ2aWNlJztcbmltcG9ydCB7IEFQTV9TRVJWRVIsIENPTkZJR19TRVJWSUNFLCBMT0dHSU5HX1NFUlZJQ0UsIFRSQU5TQUNUSU9OX1NFUlZJQ0UsIFBFUkZPUk1BTkNFX01PTklUT1JJTkcgfSBmcm9tICcuLi9jb21tb24vY29uc3RhbnRzJztcbmltcG9ydCB7IHNlcnZpY2VDcmVhdG9ycyB9IGZyb20gJy4uL2NvbW1vbi9zZXJ2aWNlLWZhY3RvcnknO1xuaW1wb3J0IHsgb2JzZXJ2ZVVzZXJJbnRlcmFjdGlvbnMgfSBmcm9tICcuL21ldHJpY3MvaW5wL3Byb2Nlc3MnO1xuaW1wb3J0IHsgcmVwb3J0SW5wIH0gZnJvbSAnLi9tZXRyaWNzL2lucC9yZXBvcnQnO1xuXG5mdW5jdGlvbiByZWdpc3RlclNlcnZpY2VzKCkge1xuICBzZXJ2aWNlQ3JlYXRvcnNbVFJBTlNBQ1RJT05fU0VSVklDRV0gPSBmdW5jdGlvbiAoc2VydmljZUZhY3RvcnkpIHtcbiAgICB2YXIgX3NlcnZpY2VGYWN0b3J5JGdldFNlID0gc2VydmljZUZhY3RvcnkuZ2V0U2VydmljZShbTE9HR0lOR19TRVJWSUNFLCBDT05GSUdfU0VSVklDRV0pLFxuICAgICAgICBsb2dnaW5nU2VydmljZSA9IF9zZXJ2aWNlRmFjdG9yeSRnZXRTZVswXSxcbiAgICAgICAgY29uZmlnU2VydmljZSA9IF9zZXJ2aWNlRmFjdG9yeSRnZXRTZVsxXTtcblxuICAgIHJldHVybiBuZXcgVHJhbnNhY3Rpb25TZXJ2aWNlKGxvZ2dpbmdTZXJ2aWNlLCBjb25maWdTZXJ2aWNlKTtcbiAgfTtcblxuICBzZXJ2aWNlQ3JlYXRvcnNbUEVSRk9STUFOQ0VfTU9OSVRPUklOR10gPSBmdW5jdGlvbiAoc2VydmljZUZhY3RvcnkpIHtcbiAgICB2YXIgX3NlcnZpY2VGYWN0b3J5JGdldFNlMiA9IHNlcnZpY2VGYWN0b3J5LmdldFNlcnZpY2UoW0FQTV9TRVJWRVIsIENPTkZJR19TRVJWSUNFLCBMT0dHSU5HX1NFUlZJQ0UsIFRSQU5TQUNUSU9OX1NFUlZJQ0VdKSxcbiAgICAgICAgYXBtU2VydmVyID0gX3NlcnZpY2VGYWN0b3J5JGdldFNlMlswXSxcbiAgICAgICAgY29uZmlnU2VydmljZSA9IF9zZXJ2aWNlRmFjdG9yeSRnZXRTZTJbMV0sXG4gICAgICAgIGxvZ2dpbmdTZXJ2aWNlID0gX3NlcnZpY2VGYWN0b3J5JGdldFNlMlsyXSxcbiAgICAgICAgdHJhbnNhY3Rpb25TZXJ2aWNlID0gX3NlcnZpY2VGYWN0b3J5JGdldFNlMlszXTtcblxuICAgIHJldHVybiBuZXcgUGVyZm9ybWFuY2VNb25pdG9yaW5nKGFwbVNlcnZlciwgY29uZmlnU2VydmljZSwgbG9nZ2luZ1NlcnZpY2UsIHRyYW5zYWN0aW9uU2VydmljZSk7XG4gIH07XG59XG5cbmV4cG9ydCB7IHJlZ2lzdGVyU2VydmljZXMsIG9ic2VydmVVc2VySW50ZXJhY3Rpb25zLCByZXBvcnRJbnAgfTsiLCJpbXBvcnQgeyBFVkVOVCwgRklSU1RfSU5QVVQgfSBmcm9tICcuLi8uLi8uLi9jb21tb24vY29uc3RhbnRzJztcbmltcG9ydCB7IGlzUGVyZkludGVyYWN0aW9uQ291bnRTdXBwb3J0ZWQgfSBmcm9tICcuLi8uLi8uLi9jb21tb24vdXRpbHMnO1xuaW1wb3J0IHsgUGVyZkVudHJ5UmVjb3JkZXIgfSBmcm9tICcuLi9tZXRyaWNzJztcbnZhciBJTlBfVEhSRVNIT0xEID0gNDA7XG52YXIgTUFYX0lOVEVSQUNUSU9OU19UT19DT05TSURFUiA9IDEwO1xuZXhwb3J0IHZhciBpbnBTdGF0ZSA9IHtcbiAgbWluSW50ZXJhY3Rpb25JZDogSW5maW5pdHksXG4gIG1heEludGVyYWN0aW9uSWQ6IDAsXG4gIGludGVyYWN0aW9uQ291bnQ6IDAsXG4gIGxvbmdlc3RJbnRlcmFjdGlvbnM6IFtdXG59O1xuZXhwb3J0IGZ1bmN0aW9uIG9ic2VydmVVc2VySW50ZXJhY3Rpb25zKHJlY29yZGVyKSB7XG4gIGlmIChyZWNvcmRlciA9PT0gdm9pZCAwKSB7XG4gICAgcmVjb3JkZXIgPSBuZXcgUGVyZkVudHJ5UmVjb3JkZXIocHJvY2Vzc1VzZXJJbnRlcmFjdGlvbnMpO1xuICB9XG5cbiAgdmFyIGlzUGVyZkNvdW50U3VwcG9ydGVkID0gaXNQZXJmSW50ZXJhY3Rpb25Db3VudFN1cHBvcnRlZCgpO1xuICB2YXIgZHVyYXRpb25UaHJlc2hvbGQgPSBpc1BlcmZDb3VudFN1cHBvcnRlZCA/IElOUF9USFJFU0hPTEQgOiAxNjtcbiAgcmVjb3JkZXIuc3RhcnQoRVZFTlQsIHtcbiAgICBidWZmZXJlZDogdHJ1ZSxcbiAgICBkdXJhdGlvblRocmVzaG9sZDogZHVyYXRpb25UaHJlc2hvbGRcbiAgfSk7XG5cbiAgaWYgKCFpc1BlcmZDb3VudFN1cHBvcnRlZCkge1xuICAgIHJlY29yZGVyLnN0YXJ0KEZJUlNUX0lOUFVUKTtcbiAgfVxufVxuZXhwb3J0IGZ1bmN0aW9uIHByb2Nlc3NVc2VySW50ZXJhY3Rpb25zKGxpc3QpIHtcbiAgdmFyIGVudHJpZXMgPSBsaXN0LmdldEVudHJpZXMoKTtcbiAgZW50cmllcy5mb3JFYWNoKGZ1bmN0aW9uIChlbnRyeSkge1xuICAgIGlmICghZW50cnkuaW50ZXJhY3Rpb25JZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHVwZGF0ZUludGVyYWN0aW9uQ291bnQoZW50cnkpO1xuXG4gICAgaWYgKGVudHJ5LmR1cmF0aW9uIDwgSU5QX1RIUkVTSE9MRCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHN0b3JlVXNlckludGVyYWN0aW9uKGVudHJ5KTtcbiAgfSk7XG59XG5leHBvcnQgZnVuY3Rpb24gY2FsY3VsYXRlSW5wKCkge1xuICBpZiAoaW5wU3RhdGUubG9uZ2VzdEludGVyYWN0aW9ucy5sZW5ndGggPT09IDApIHtcbiAgICBpZiAoaW50ZXJhY3Rpb25Db3VudCgpID4gMCkge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIGludGVyYWN0aW9uSW5kZXggPSBNYXRoLm1pbihpbnBTdGF0ZS5sb25nZXN0SW50ZXJhY3Rpb25zLmxlbmd0aCAtIDEsIE1hdGguZmxvb3IoaW50ZXJhY3Rpb25Db3VudCgpIC8gNTApKTtcbiAgdmFyIGlucCA9IGlucFN0YXRlLmxvbmdlc3RJbnRlcmFjdGlvbnNbaW50ZXJhY3Rpb25JbmRleF0uZHVyYXRpb247XG4gIHJldHVybiBpbnA7XG59XG5leHBvcnQgZnVuY3Rpb24gaW50ZXJhY3Rpb25Db3VudCgpIHtcbiAgcmV0dXJuIHBlcmZvcm1hbmNlLmludGVyYWN0aW9uQ291bnQgfHwgaW5wU3RhdGUuaW50ZXJhY3Rpb25Db3VudDtcbn1cbmV4cG9ydCBmdW5jdGlvbiByZXN0b3JlSU5QU3RhdGUoKSB7XG4gIGlucFN0YXRlLm1pbkludGVyYWN0aW9uSWQgPSBJbmZpbml0eTtcbiAgaW5wU3RhdGUubWF4SW50ZXJhY3Rpb25JZCA9IDA7XG4gIGlucFN0YXRlLmludGVyYWN0aW9uQ291bnQgPSAwO1xuICBpbnBTdGF0ZS5sb25nZXN0SW50ZXJhY3Rpb25zID0gW107XG59XG5cbmZ1bmN0aW9uIHN0b3JlVXNlckludGVyYWN0aW9uKGVudHJ5KSB7XG4gIHZhciBsZWFzdFNsb3cgPSBpbnBTdGF0ZS5sb25nZXN0SW50ZXJhY3Rpb25zW2lucFN0YXRlLmxvbmdlc3RJbnRlcmFjdGlvbnMubGVuZ3RoIC0gMV07XG5cbiAgaWYgKHR5cGVvZiBsZWFzdFNsb3cgIT09ICd1bmRlZmluZWQnICYmIGVudHJ5LmR1cmF0aW9uIDw9IGxlYXN0U2xvdy5kdXJhdGlvbiAmJiBlbnRyeS5pbnRlcmFjdGlvbklkICE9IGxlYXN0U2xvdy5pZCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHZhciBmaWx0ZXJlZEludGVyYWN0aW9uID0gaW5wU3RhdGUubG9uZ2VzdEludGVyYWN0aW9ucy5maWx0ZXIoZnVuY3Rpb24gKGludGVyYWN0aW9uKSB7XG4gICAgcmV0dXJuIGludGVyYWN0aW9uLmlkID09PSBlbnRyeS5pbnRlcmFjdGlvbklkO1xuICB9KTtcblxuICBpZiAoZmlsdGVyZWRJbnRlcmFjdGlvbi5sZW5ndGggPiAwKSB7XG4gICAgdmFyIGZvdW5kSW50ZXJhY3Rpb24gPSBmaWx0ZXJlZEludGVyYWN0aW9uWzBdO1xuICAgIGZvdW5kSW50ZXJhY3Rpb24uZHVyYXRpb24gPSBNYXRoLm1heChmb3VuZEludGVyYWN0aW9uLmR1cmF0aW9uLCBlbnRyeS5kdXJhdGlvbik7XG4gIH0gZWxzZSB7XG4gICAgaW5wU3RhdGUubG9uZ2VzdEludGVyYWN0aW9ucy5wdXNoKHtcbiAgICAgIGlkOiBlbnRyeS5pbnRlcmFjdGlvbklkLFxuICAgICAgZHVyYXRpb246IGVudHJ5LmR1cmF0aW9uXG4gICAgfSk7XG4gIH1cblxuICBpbnBTdGF0ZS5sb25nZXN0SW50ZXJhY3Rpb25zLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICByZXR1cm4gYi5kdXJhdGlvbiAtIGEuZHVyYXRpb247XG4gIH0pO1xuICBpbnBTdGF0ZS5sb25nZXN0SW50ZXJhY3Rpb25zLnNwbGljZShNQVhfSU5URVJBQ1RJT05TX1RPX0NPTlNJREVSKTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlSW50ZXJhY3Rpb25Db3VudChlbnRyeSkge1xuICBpZiAoaXNQZXJmSW50ZXJhY3Rpb25Db3VudFN1cHBvcnRlZCgpKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaW5wU3RhdGUubWluSW50ZXJhY3Rpb25JZCA9IE1hdGgubWluKGlucFN0YXRlLm1pbkludGVyYWN0aW9uSWQsIGVudHJ5LmludGVyYWN0aW9uSWQpO1xuICBpbnBTdGF0ZS5tYXhJbnRlcmFjdGlvbklkID0gTWF0aC5tYXgoaW5wU3RhdGUubWF4SW50ZXJhY3Rpb25JZCwgZW50cnkuaW50ZXJhY3Rpb25JZCk7XG4gIGlucFN0YXRlLmludGVyYWN0aW9uQ291bnQgPSAoaW5wU3RhdGUubWF4SW50ZXJhY3Rpb25JZCAtIGlucFN0YXRlLm1pbkludGVyYWN0aW9uSWQpIC8gNyArIDE7XG59IiwiaW1wb3J0IHsgY2FsY3VsYXRlSW5wLCByZXN0b3JlSU5QU3RhdGUgfSBmcm9tICcuL3Byb2Nlc3MnO1xuaW1wb3J0IHsgbm93IH0gZnJvbSAnLi4vLi4vLi4vY29tbW9uL3V0aWxzJztcbmltcG9ydCB7IFBBR0VfRVhJVCB9IGZyb20gJy4uLy4uLy4uL2NvbW1vbi9jb25zdGFudHMnO1xuZXhwb3J0IGZ1bmN0aW9uIHJlcG9ydElucCh0cmFuc2FjdGlvblNlcnZpY2UpIHtcbiAgdmFyIGlucCA9IGNhbGN1bGF0ZUlucCgpO1xuXG4gIGlmIChpbnAgPj0gMCkge1xuICAgIHZhciBzdGFydFRpbWUgPSBub3coKTtcbiAgICB2YXIgaW5wVHIgPSB0cmFuc2FjdGlvblNlcnZpY2Uuc3RhcnRUcmFuc2FjdGlvbihQQUdFX0VYSVQsIFBBR0VfRVhJVCwge1xuICAgICAgc3RhcnRUaW1lOiBzdGFydFRpbWVcbiAgICB9KTtcbiAgICB2YXIgbmF2aWdhdGlvbnMgPSBwZXJmb3JtYW5jZS5nZXRFbnRyaWVzQnlUeXBlKCduYXZpZ2F0aW9uJyk7XG5cbiAgICBpZiAobmF2aWdhdGlvbnMubGVuZ3RoID4gMCkge1xuICAgICAgdmFyIGhhcmROYXZpZ2F0aW9uVXJsID0gbmF2aWdhdGlvbnNbMF0ubmFtZTtcbiAgICAgIGlucFRyLmFkZENvbnRleHQoe1xuICAgICAgICBwYWdlOiB7XG4gICAgICAgICAgdXJsOiBoYXJkTmF2aWdhdGlvblVybFxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpbnBUci5hZGRMYWJlbHMoe1xuICAgICAgaW5wX3ZhbHVlOiBpbnBcbiAgICB9KTtcbiAgICB2YXIgZW5kVGltZSA9IHN0YXJ0VGltZSArIGlucCArIDE7XG4gICAgaW5wVHIuZW5kKGVuZFRpbWUpO1xuICAgIHJlc3RvcmVJTlBTdGF0ZSgpO1xuICAgIHJldHVybiBpbnBUcjtcbiAgfVxufSIsImZ1bmN0aW9uIF9leHRlbmRzKCkgeyBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07IHJldHVybiBfZXh0ZW5kcy5hcHBseSh0aGlzLCBhcmd1bWVudHMpOyB9XG5cbmltcG9ydCB7IExPTkdfVEFTSywgTEFSR0VTVF9DT05URU5URlVMX1BBSU5ULCBGSVJTVF9DT05URU5URlVMX1BBSU5ULCBGSVJTVF9JTlBVVCwgTEFZT1VUX1NISUZUIH0gZnJvbSAnLi4vLi4vY29tbW9uL2NvbnN0YW50cyc7XG5pbXBvcnQgeyBub29wLCBQRVJGLCBpc1BlcmZUeXBlU3VwcG9ydGVkLCBpc1JlZGlyZWN0SW5mb0F2YWlsYWJsZSB9IGZyb20gJy4uLy4uL2NvbW1vbi91dGlscyc7XG5pbXBvcnQgU3BhbiBmcm9tICcuLi9zcGFuJztcbmV4cG9ydCB2YXIgbWV0cmljcyA9IHtcbiAgZmlkOiAwLFxuICBmY3A6IDAsXG4gIHRidDoge1xuICAgIHN0YXJ0OiBJbmZpbml0eSxcbiAgICBkdXJhdGlvbjogMFxuICB9LFxuICBjbHM6IHtcbiAgICBzY29yZTogMCxcbiAgICBmaXJzdEVudHJ5VGltZTogTnVtYmVyLk5FR0FUSVZFX0lORklOSVRZLFxuICAgIHByZXZFbnRyeVRpbWU6IE51bWJlci5ORUdBVElWRV9JTkZJTklUWSxcbiAgICBjdXJyZW50U2Vzc2lvblNjb3JlOiAwXG4gIH0sXG4gIGxvbmd0YXNrOiB7XG4gICAgY291bnQ6IDAsXG4gICAgZHVyYXRpb246IDAsXG4gICAgbWF4OiAwXG4gIH1cbn07XG52YXIgTE9OR19UQVNLX1RIUkVTSE9MRCA9IDUwO1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUxvbmdUYXNrU3BhbnMobG9uZ3Rhc2tzLCBhZ2cpIHtcbiAgdmFyIHNwYW5zID0gW107XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsb25ndGFza3MubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgX2xvbmd0YXNrcyRpID0gbG9uZ3Rhc2tzW2ldLFxuICAgICAgICBuYW1lID0gX2xvbmd0YXNrcyRpLm5hbWUsXG4gICAgICAgIHN0YXJ0VGltZSA9IF9sb25ndGFza3MkaS5zdGFydFRpbWUsXG4gICAgICAgIGR1cmF0aW9uID0gX2xvbmd0YXNrcyRpLmR1cmF0aW9uLFxuICAgICAgICBhdHRyaWJ1dGlvbiA9IF9sb25ndGFza3MkaS5hdHRyaWJ1dGlvbjtcbiAgICB2YXIgZW5kID0gc3RhcnRUaW1lICsgZHVyYXRpb247XG4gICAgdmFyIHNwYW4gPSBuZXcgU3BhbihcIkxvbmd0YXNrKFwiICsgbmFtZSArIFwiKVwiLCBMT05HX1RBU0ssIHtcbiAgICAgIHN0YXJ0VGltZTogc3RhcnRUaW1lXG4gICAgfSk7XG4gICAgYWdnLmNvdW50Kys7XG4gICAgYWdnLmR1cmF0aW9uICs9IGR1cmF0aW9uO1xuICAgIGFnZy5tYXggPSBNYXRoLm1heChkdXJhdGlvbiwgYWdnLm1heCk7XG5cbiAgICBpZiAoYXR0cmlidXRpb24ubGVuZ3RoID4gMCkge1xuICAgICAgdmFyIF9hdHRyaWJ1dGlvbiQgPSBhdHRyaWJ1dGlvblswXSxcbiAgICAgICAgICBfbmFtZSA9IF9hdHRyaWJ1dGlvbiQubmFtZSxcbiAgICAgICAgICBjb250YWluZXJUeXBlID0gX2F0dHJpYnV0aW9uJC5jb250YWluZXJUeXBlLFxuICAgICAgICAgIGNvbnRhaW5lck5hbWUgPSBfYXR0cmlidXRpb24kLmNvbnRhaW5lck5hbWUsXG4gICAgICAgICAgY29udGFpbmVySWQgPSBfYXR0cmlidXRpb24kLmNvbnRhaW5lcklkO1xuICAgICAgdmFyIGN1c3RvbUNvbnRleHQgPSB7XG4gICAgICAgIGF0dHJpYnV0aW9uOiBfbmFtZSxcbiAgICAgICAgdHlwZTogY29udGFpbmVyVHlwZVxuICAgICAgfTtcblxuICAgICAgaWYgKGNvbnRhaW5lck5hbWUpIHtcbiAgICAgICAgY3VzdG9tQ29udGV4dC5uYW1lID0gY29udGFpbmVyTmFtZTtcbiAgICAgIH1cblxuICAgICAgaWYgKGNvbnRhaW5lcklkKSB7XG4gICAgICAgIGN1c3RvbUNvbnRleHQuaWQgPSBjb250YWluZXJJZDtcbiAgICAgIH1cblxuICAgICAgc3Bhbi5hZGRDb250ZXh0KHtcbiAgICAgICAgY3VzdG9tOiBjdXN0b21Db250ZXh0XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBzcGFuLmVuZChlbmQpO1xuICAgIHNwYW5zLnB1c2goc3Bhbik7XG4gIH1cblxuICByZXR1cm4gc3BhbnM7XG59XG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlRmlyc3RJbnB1dERlbGF5U3BhbihmaWRFbnRyaWVzKSB7XG4gIHZhciBmaXJzdElucHV0ID0gZmlkRW50cmllc1swXTtcblxuICBpZiAoZmlyc3RJbnB1dCkge1xuICAgIHZhciBzdGFydFRpbWUgPSBmaXJzdElucHV0LnN0YXJ0VGltZSxcbiAgICAgICAgcHJvY2Vzc2luZ1N0YXJ0ID0gZmlyc3RJbnB1dC5wcm9jZXNzaW5nU3RhcnQ7XG4gICAgdmFyIHNwYW4gPSBuZXcgU3BhbignRmlyc3QgSW5wdXQgRGVsYXknLCBGSVJTVF9JTlBVVCwge1xuICAgICAgc3RhcnRUaW1lOiBzdGFydFRpbWVcbiAgICB9KTtcbiAgICBzcGFuLmVuZChwcm9jZXNzaW5nU3RhcnQpO1xuICAgIHJldHVybiBzcGFuO1xuICB9XG59XG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlVG90YWxCbG9ja2luZ1RpbWVTcGFuKHRidE9iamVjdCkge1xuICB2YXIgc3RhcnQgPSB0YnRPYmplY3Quc3RhcnQsXG4gICAgICBkdXJhdGlvbiA9IHRidE9iamVjdC5kdXJhdGlvbjtcbiAgdmFyIHRidFNwYW4gPSBuZXcgU3BhbignVG90YWwgQmxvY2tpbmcgVGltZScsIExPTkdfVEFTSywge1xuICAgIHN0YXJ0VGltZTogc3RhcnRcbiAgfSk7XG4gIHRidFNwYW4uZW5kKHN0YXJ0ICsgZHVyYXRpb24pO1xuICByZXR1cm4gdGJ0U3Bhbjtcbn1cbmV4cG9ydCBmdW5jdGlvbiBjYWxjdWxhdGVUb3RhbEJsb2NraW5nVGltZShsb25ndGFza0VudHJpZXMpIHtcbiAgbG9uZ3Rhc2tFbnRyaWVzLmZvckVhY2goZnVuY3Rpb24gKGVudHJ5KSB7XG4gICAgdmFyIG5hbWUgPSBlbnRyeS5uYW1lLFxuICAgICAgICBzdGFydFRpbWUgPSBlbnRyeS5zdGFydFRpbWUsXG4gICAgICAgIGR1cmF0aW9uID0gZW50cnkuZHVyYXRpb247XG5cbiAgICBpZiAoc3RhcnRUaW1lIDwgbWV0cmljcy5mY3ApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAobmFtZSAhPT0gJ3NlbGYnICYmIG5hbWUuaW5kZXhPZignc2FtZS1vcmlnaW4nKSA9PT0gLTEpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBtZXRyaWNzLnRidC5zdGFydCA9IE1hdGgubWluKG1ldHJpY3MudGJ0LnN0YXJ0LCBzdGFydFRpbWUpO1xuICAgIHZhciBibG9ja2luZ1RpbWUgPSBkdXJhdGlvbiAtIExPTkdfVEFTS19USFJFU0hPTEQ7XG5cbiAgICBpZiAoYmxvY2tpbmdUaW1lID4gMCkge1xuICAgICAgbWV0cmljcy50YnQuZHVyYXRpb24gKz0gYmxvY2tpbmdUaW1lO1xuICAgIH1cbiAgfSk7XG59XG5leHBvcnQgZnVuY3Rpb24gY2FsY3VsYXRlQ3VtdWxhdGl2ZUxheW91dFNoaWZ0KGNsc0VudHJpZXMpIHtcbiAgY2xzRW50cmllcy5mb3JFYWNoKGZ1bmN0aW9uIChlbnRyeSkge1xuICAgIGlmICghZW50cnkuaGFkUmVjZW50SW5wdXQgJiYgZW50cnkudmFsdWUpIHtcbiAgICAgIHZhciBzaG91bGRDcmVhdGVOZXdTZXNzaW9uID0gZW50cnkuc3RhcnRUaW1lIC0gbWV0cmljcy5jbHMuZmlyc3RFbnRyeVRpbWUgPiA1MDAwIHx8IGVudHJ5LnN0YXJ0VGltZSAtIG1ldHJpY3MuY2xzLnByZXZFbnRyeVRpbWUgPiAxMDAwO1xuXG4gICAgICBpZiAoc2hvdWxkQ3JlYXRlTmV3U2Vzc2lvbikge1xuICAgICAgICBtZXRyaWNzLmNscy5maXJzdEVudHJ5VGltZSA9IGVudHJ5LnN0YXJ0VGltZTtcbiAgICAgICAgbWV0cmljcy5jbHMuY3VycmVudFNlc3Npb25TY29yZSA9IDA7XG4gICAgICB9XG5cbiAgICAgIG1ldHJpY3MuY2xzLnByZXZFbnRyeVRpbWUgPSBlbnRyeS5zdGFydFRpbWU7XG4gICAgICBtZXRyaWNzLmNscy5jdXJyZW50U2Vzc2lvblNjb3JlICs9IGVudHJ5LnZhbHVlO1xuICAgICAgbWV0cmljcy5jbHMuc2NvcmUgPSBNYXRoLm1heChtZXRyaWNzLmNscy5zY29yZSwgbWV0cmljcy5jbHMuY3VycmVudFNlc3Npb25TY29yZSk7XG4gICAgfVxuICB9KTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBjYXB0dXJlT2JzZXJ2ZXJFbnRyaWVzKGxpc3QsIF9yZWYpIHtcbiAgdmFyIGlzSGFyZE5hdmlnYXRpb24gPSBfcmVmLmlzSGFyZE5hdmlnYXRpb24sXG4gICAgICB0clN0YXJ0ID0gX3JlZi50clN0YXJ0O1xuICB2YXIgbG9uZ3Rhc2tFbnRyaWVzID0gbGlzdC5nZXRFbnRyaWVzQnlUeXBlKExPTkdfVEFTSykuZmlsdGVyKGZ1bmN0aW9uIChlbnRyeSkge1xuICAgIHJldHVybiBlbnRyeS5zdGFydFRpbWUgPj0gdHJTdGFydDtcbiAgfSk7XG4gIHZhciBsb25nVGFza1NwYW5zID0gY3JlYXRlTG9uZ1Rhc2tTcGFucyhsb25ndGFza0VudHJpZXMsIG1ldHJpY3MubG9uZ3Rhc2spO1xuICB2YXIgcmVzdWx0ID0ge1xuICAgIHNwYW5zOiBsb25nVGFza1NwYW5zLFxuICAgIG1hcmtzOiB7fVxuICB9O1xuXG4gIGlmICghaXNIYXJkTmF2aWdhdGlvbikge1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICB2YXIgbGNwRW50cmllcyA9IGxpc3QuZ2V0RW50cmllc0J5VHlwZShMQVJHRVNUX0NPTlRFTlRGVUxfUEFJTlQpO1xuICB2YXIgbGFzdExjcEVudHJ5ID0gbGNwRW50cmllc1tsY3BFbnRyaWVzLmxlbmd0aCAtIDFdO1xuXG4gIGlmIChsYXN0TGNwRW50cnkpIHtcbiAgICB2YXIgbGNwID0gcGFyc2VJbnQobGFzdExjcEVudHJ5LnN0YXJ0VGltZSk7XG4gICAgbWV0cmljcy5sY3AgPSBsY3A7XG4gICAgcmVzdWx0Lm1hcmtzLmxhcmdlc3RDb250ZW50ZnVsUGFpbnQgPSBsY3A7XG4gIH1cblxuICB2YXIgdGltaW5nID0gUEVSRi50aW1pbmc7XG4gIHZhciB1bmxvYWREaWZmID0gdGltaW5nLmZldGNoU3RhcnQgLSB0aW1pbmcubmF2aWdhdGlvblN0YXJ0O1xuXG4gIGlmIChpc1JlZGlyZWN0SW5mb0F2YWlsYWJsZSh0aW1pbmcpKSB7XG4gICAgdW5sb2FkRGlmZiA9IDA7XG4gIH1cblxuICB2YXIgZmNwRW50cnkgPSBsaXN0LmdldEVudHJpZXNCeU5hbWUoRklSU1RfQ09OVEVOVEZVTF9QQUlOVClbMF07XG5cbiAgaWYgKGZjcEVudHJ5KSB7XG4gICAgdmFyIGZjcCA9IHBhcnNlSW50KHVubG9hZERpZmYgPj0gMCA/IGZjcEVudHJ5LnN0YXJ0VGltZSAtIHVubG9hZERpZmYgOiBmY3BFbnRyeS5zdGFydFRpbWUpO1xuICAgIG1ldHJpY3MuZmNwID0gZmNwO1xuICAgIHJlc3VsdC5tYXJrcy5maXJzdENvbnRlbnRmdWxQYWludCA9IGZjcDtcbiAgfVxuXG4gIHZhciBmaWRFbnRyaWVzID0gbGlzdC5nZXRFbnRyaWVzQnlUeXBlKEZJUlNUX0lOUFVUKTtcbiAgdmFyIGZpZFNwYW4gPSBjcmVhdGVGaXJzdElucHV0RGVsYXlTcGFuKGZpZEVudHJpZXMpO1xuXG4gIGlmIChmaWRTcGFuKSB7XG4gICAgbWV0cmljcy5maWQgPSBmaWRTcGFuLmR1cmF0aW9uKCk7XG4gICAgcmVzdWx0LnNwYW5zLnB1c2goZmlkU3Bhbik7XG4gIH1cblxuICBjYWxjdWxhdGVUb3RhbEJsb2NraW5nVGltZShsb25ndGFza0VudHJpZXMpO1xuICB2YXIgY2xzRW50cmllcyA9IGxpc3QuZ2V0RW50cmllc0J5VHlwZShMQVlPVVRfU0hJRlQpO1xuICBjYWxjdWxhdGVDdW11bGF0aXZlTGF5b3V0U2hpZnQoY2xzRW50cmllcyk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5leHBvcnQgdmFyIFBlcmZFbnRyeVJlY29yZGVyID0gZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBQZXJmRW50cnlSZWNvcmRlcihjYWxsYmFjaykge1xuICAgIHRoaXMucG8gPSB7XG4gICAgICBvYnNlcnZlOiBub29wLFxuICAgICAgZGlzY29ubmVjdDogbm9vcFxuICAgIH07XG5cbiAgICBpZiAod2luZG93LlBlcmZvcm1hbmNlT2JzZXJ2ZXIpIHtcbiAgICAgIHRoaXMucG8gPSBuZXcgUGVyZm9ybWFuY2VPYnNlcnZlcihjYWxsYmFjayk7XG4gICAgfVxuICB9XG5cbiAgdmFyIF9wcm90byA9IFBlcmZFbnRyeVJlY29yZGVyLnByb3RvdHlwZTtcblxuICBfcHJvdG8uc3RhcnQgPSBmdW5jdGlvbiBzdGFydCh0eXBlLCBvcHRpb25zKSB7XG4gICAgaWYgKG9wdGlvbnMgPT09IHZvaWQgMCkge1xuICAgICAgb3B0aW9ucyA9IHtcbiAgICAgICAgYnVmZmVyZWQ6IHRydWVcbiAgICAgIH07XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIGlmICghaXNQZXJmVHlwZVN1cHBvcnRlZCh0eXBlKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHRoaXMucG8ub2JzZXJ2ZShfZXh0ZW5kcyh7XG4gICAgICAgIHR5cGU6IHR5cGVcbiAgICAgIH0sIG9wdGlvbnMpKTtcbiAgICB9IGNhdGNoIChfKSB7fVxuICB9O1xuXG4gIF9wcm90by5zdG9wID0gZnVuY3Rpb24gc3RvcCgpIHtcbiAgICB0aGlzLnBvLmRpc2Nvbm5lY3QoKTtcbiAgfTtcblxuICByZXR1cm4gUGVyZkVudHJ5UmVjb3JkZXI7XG59KCk7IiwiaW1wb3J0IHsgUEVSRiwgaXNQZXJmVGltZWxpbmVTdXBwb3J0ZWQsIGlzUmVkaXJlY3RJbmZvQXZhaWxhYmxlIH0gZnJvbSAnLi4vLi4vY29tbW9uL3V0aWxzJztcbmltcG9ydCB7IFBBR0VfTE9BRCwgUkVTT1VSQ0UsIE1FQVNVUkUgfSBmcm9tICcuLi8uLi9jb21tb24vY29uc3RhbnRzJztcbmltcG9ydCB7IHN0YXRlIH0gZnJvbSAnLi4vLi4vc3RhdGUnO1xuaW1wb3J0IHsgY3JlYXRlTmF2aWdhdGlvblRpbWluZ1NwYW5zIH0gZnJvbSAnLi9uYXZpZ2F0aW9uLXRpbWluZyc7XG5pbXBvcnQgeyBjcmVhdGVVc2VyVGltaW5nU3BhbnMgfSBmcm9tICcuL3VzZXItdGltaW5nJztcbmltcG9ydCB7IGNyZWF0ZVJlc291cmNlVGltaW5nU3BhbnMgfSBmcm9tICcuL3Jlc291cmNlLXRpbWluZyc7XG5pbXBvcnQgeyBnZXRQYWdlTG9hZE1hcmtzIH0gZnJvbSAnLi9tYXJrcyc7XG5cbmZ1bmN0aW9uIGNhcHR1cmVOYXZpZ2F0aW9uKHRyYW5zYWN0aW9uKSB7XG4gIGlmICghdHJhbnNhY3Rpb24uY2FwdHVyZVRpbWluZ3MpIHtcbiAgICBpZiAodHJhbnNhY3Rpb24udHlwZSA9PT0gUEFHRV9MT0FEKSB7XG4gICAgICB0cmFuc2FjdGlvbi5fc3RhcnQgPSAwO1xuICAgIH1cblxuICAgIHJldHVybjtcbiAgfVxuXG4gIHZhciB0ckVuZCA9IHRyYW5zYWN0aW9uLl9lbmQ7XG5cbiAgaWYgKHRyYW5zYWN0aW9uLnR5cGUgPT09IFBBR0VfTE9BRCkge1xuICAgIGlmICh0cmFuc2FjdGlvbi5tYXJrcyAmJiB0cmFuc2FjdGlvbi5tYXJrcy5jdXN0b20pIHtcbiAgICAgIHZhciBjdXN0b21NYXJrcyA9IHRyYW5zYWN0aW9uLm1hcmtzLmN1c3RvbTtcbiAgICAgIE9iamVjdC5rZXlzKGN1c3RvbU1hcmtzKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgY3VzdG9tTWFya3Nba2V5XSArPSB0cmFuc2FjdGlvbi5fc3RhcnQ7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB2YXIgdHJTdGFydCA9IDA7XG4gICAgdHJhbnNhY3Rpb24uX3N0YXJ0ID0gdHJTdGFydDtcbiAgICB2YXIgdGltaW5ncyA9IFBFUkYudGltaW5nO1xuICAgIHZhciBiYXNlVGltZSA9IGlzUmVkaXJlY3RJbmZvQXZhaWxhYmxlKHRpbWluZ3MpID8gdGltaW5ncy5yZWRpcmVjdFN0YXJ0IDogdGltaW5ncy5mZXRjaFN0YXJ0O1xuICAgIGNyZWF0ZU5hdmlnYXRpb25UaW1pbmdTcGFucyh0aW1pbmdzLCBiYXNlVGltZSwgdHJTdGFydCwgdHJFbmQpLmZvckVhY2goZnVuY3Rpb24gKHNwYW4pIHtcbiAgICAgIHNwYW4udHJhY2VJZCA9IHRyYW5zYWN0aW9uLnRyYWNlSWQ7XG4gICAgICBzcGFuLnNhbXBsZWQgPSB0cmFuc2FjdGlvbi5zYW1wbGVkO1xuXG4gICAgICBpZiAoc3Bhbi5wYWdlUmVzcG9uc2UgJiYgdHJhbnNhY3Rpb24ub3B0aW9ucy5wYWdlTG9hZFNwYW5JZCkge1xuICAgICAgICBzcGFuLmlkID0gdHJhbnNhY3Rpb24ub3B0aW9ucy5wYWdlTG9hZFNwYW5JZDtcbiAgICAgIH1cblxuICAgICAgdHJhbnNhY3Rpb24uc3BhbnMucHVzaChzcGFuKTtcbiAgICB9KTtcbiAgICB0cmFuc2FjdGlvbi5hZGRNYXJrcyhnZXRQYWdlTG9hZE1hcmtzKHRpbWluZ3MpKTtcbiAgfVxuXG4gIGlmIChpc1BlcmZUaW1lbGluZVN1cHBvcnRlZCgpKSB7XG4gICAgdmFyIF90clN0YXJ0ID0gdHJhbnNhY3Rpb24uX3N0YXJ0O1xuICAgIHZhciByZXNvdXJjZUVudHJpZXMgPSBQRVJGLmdldEVudHJpZXNCeVR5cGUoUkVTT1VSQ0UpO1xuICAgIGNyZWF0ZVJlc291cmNlVGltaW5nU3BhbnMocmVzb3VyY2VFbnRyaWVzLCBzdGF0ZS5ib290c3RyYXBUaW1lLCBfdHJTdGFydCwgdHJFbmQpLmZvckVhY2goZnVuY3Rpb24gKHNwYW4pIHtcbiAgICAgIHJldHVybiB0cmFuc2FjdGlvbi5zcGFucy5wdXNoKHNwYW4pO1xuICAgIH0pO1xuICAgIHZhciB1c2VyRW50cmllcyA9IFBFUkYuZ2V0RW50cmllc0J5VHlwZShNRUFTVVJFKTtcbiAgICBjcmVhdGVVc2VyVGltaW5nU3BhbnModXNlckVudHJpZXMsIF90clN0YXJ0LCB0ckVuZCkuZm9yRWFjaChmdW5jdGlvbiAoc3Bhbikge1xuICAgICAgcmV0dXJuIHRyYW5zYWN0aW9uLnNwYW5zLnB1c2goc3Bhbik7XG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IHsgY2FwdHVyZU5hdmlnYXRpb24sIGNyZWF0ZU5hdmlnYXRpb25UaW1pbmdTcGFucywgY3JlYXRlUmVzb3VyY2VUaW1pbmdTcGFucywgY3JlYXRlVXNlclRpbWluZ1NwYW5zLCBnZXRQYWdlTG9hZE1hcmtzIH07IiwiaW1wb3J0IHsgaXNSZWRpcmVjdEluZm9BdmFpbGFibGUgfSBmcm9tICcuLi8uLi9jb21tb24vdXRpbHMnO1xudmFyIE5BVklHQVRJT05fVElNSU5HX01BUktTID0gWydmZXRjaFN0YXJ0JywgJ2RvbWFpbkxvb2t1cFN0YXJ0JywgJ2RvbWFpbkxvb2t1cEVuZCcsICdjb25uZWN0U3RhcnQnLCAnY29ubmVjdEVuZCcsICdyZXF1ZXN0U3RhcnQnLCAncmVzcG9uc2VTdGFydCcsICdyZXNwb25zZUVuZCcsICdkb21Mb2FkaW5nJywgJ2RvbUludGVyYWN0aXZlJywgJ2RvbUNvbnRlbnRMb2FkZWRFdmVudFN0YXJ0JywgJ2RvbUNvbnRlbnRMb2FkZWRFdmVudEVuZCcsICdkb21Db21wbGV0ZScsICdsb2FkRXZlbnRTdGFydCcsICdsb2FkRXZlbnRFbmQnXTtcbnZhciBDT01QUkVTU0VEX05BVl9USU1JTkdfTUFSS1MgPSBbJ2ZzJywgJ2xzJywgJ2xlJywgJ2NzJywgJ2NlJywgJ3FzJywgJ3JzJywgJ3JlJywgJ2RsJywgJ2RpJywgJ2RzJywgJ2RlJywgJ2RjJywgJ2VzJywgJ2VlJ107XG5cbmZ1bmN0aW9uIGdldFBhZ2VMb2FkTWFya3ModGltaW5nKSB7XG4gIHZhciBtYXJrcyA9IGdldE5hdmlnYXRpb25UaW1pbmdNYXJrcyh0aW1pbmcpO1xuXG4gIGlmIChtYXJrcyA9PSBudWxsKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIG5hdmlnYXRpb25UaW1pbmc6IG1hcmtzLFxuICAgIGFnZW50OiB7XG4gICAgICB0aW1lVG9GaXJzdEJ5dGU6IG1hcmtzLnJlc3BvbnNlU3RhcnQsXG4gICAgICBkb21JbnRlcmFjdGl2ZTogbWFya3MuZG9tSW50ZXJhY3RpdmUsXG4gICAgICBkb21Db21wbGV0ZTogbWFya3MuZG9tQ29tcGxldGVcbiAgICB9XG4gIH07XG59XG5cbmZ1bmN0aW9uIGdldE5hdmlnYXRpb25UaW1pbmdNYXJrcyh0aW1pbmcpIHtcbiAgdmFyIHJlZGlyZWN0U3RhcnQgPSB0aW1pbmcucmVkaXJlY3RTdGFydCxcbiAgICAgIGZldGNoU3RhcnQgPSB0aW1pbmcuZmV0Y2hTdGFydCxcbiAgICAgIG5hdmlnYXRpb25TdGFydCA9IHRpbWluZy5uYXZpZ2F0aW9uU3RhcnQsXG4gICAgICByZXNwb25zZVN0YXJ0ID0gdGltaW5nLnJlc3BvbnNlU3RhcnQsXG4gICAgICByZXNwb25zZUVuZCA9IHRpbWluZy5yZXNwb25zZUVuZDtcblxuICBpZiAoZmV0Y2hTdGFydCA+PSBuYXZpZ2F0aW9uU3RhcnQgJiYgcmVzcG9uc2VTdGFydCA+PSBmZXRjaFN0YXJ0ICYmIHJlc3BvbnNlRW5kID49IHJlc3BvbnNlU3RhcnQpIHtcbiAgICB2YXIgbWFya3MgPSB7fTtcbiAgICBOQVZJR0FUSU9OX1RJTUlOR19NQVJLUy5mb3JFYWNoKGZ1bmN0aW9uICh0aW1pbmdLZXkpIHtcbiAgICAgIHZhciBtID0gdGltaW5nW3RpbWluZ0tleV07XG5cbiAgICAgIGlmIChtICYmIG0gPj0gZmV0Y2hTdGFydCkge1xuICAgICAgICBpZiAoaXNSZWRpcmVjdEluZm9BdmFpbGFibGUodGltaW5nKSkge1xuICAgICAgICAgIG1hcmtzW3RpbWluZ0tleV0gPSBwYXJzZUludChtIC0gcmVkaXJlY3RTdGFydCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbWFya3NbdGltaW5nS2V5XSA9IHBhcnNlSW50KG0gLSBmZXRjaFN0YXJ0KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBtYXJrcztcbiAgfVxuXG4gIHJldHVybiBudWxsO1xufVxuXG5leHBvcnQgeyBnZXRQYWdlTG9hZE1hcmtzLCBOQVZJR0FUSU9OX1RJTUlOR19NQVJLUywgQ09NUFJFU1NFRF9OQVZfVElNSU5HX01BUktTIH07IiwiaW1wb3J0IHsgc2hvdWxkQ3JlYXRlU3BhbiB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IFNwYW4gZnJvbSAnLi4vc3Bhbic7XG52YXIgZXZlbnRQYWlycyA9IFtbJ3JlZGlyZWN0U3RhcnQnLCAncmVkaXJlY3RFbmQnLCAnUmVkaXJlY3QnXSwgWydkb21haW5Mb29rdXBTdGFydCcsICdkb21haW5Mb29rdXBFbmQnLCAnRG9tYWluIGxvb2t1cCddLCBbJ2Nvbm5lY3RTdGFydCcsICdjb25uZWN0RW5kJywgJ01ha2luZyBhIGNvbm5lY3Rpb24gdG8gdGhlIHNlcnZlciddLCBbJ3JlcXVlc3RTdGFydCcsICdyZXNwb25zZUVuZCcsICdSZXF1ZXN0aW5nIGFuZCByZWNlaXZpbmcgdGhlIGRvY3VtZW50J10sIFsnZG9tTG9hZGluZycsICdkb21JbnRlcmFjdGl2ZScsICdQYXJzaW5nIHRoZSBkb2N1bWVudCwgZXhlY3V0aW5nIHN5bmMuIHNjcmlwdHMnXSwgWydkb21Db250ZW50TG9hZGVkRXZlbnRTdGFydCcsICdkb21Db250ZW50TG9hZGVkRXZlbnRFbmQnLCAnRmlyZSBcIkRPTUNvbnRlbnRMb2FkZWRcIiBldmVudCddLCBbJ2xvYWRFdmVudFN0YXJ0JywgJ2xvYWRFdmVudEVuZCcsICdGaXJlIFwibG9hZFwiIGV2ZW50J11dO1xuXG5mdW5jdGlvbiBjcmVhdGVOYXZpZ2F0aW9uVGltaW5nU3BhbnModGltaW5ncywgYmFzZVRpbWUsIHRyU3RhcnQsIHRyRW5kKSB7XG4gIHZhciBzcGFucyA9IFtdO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgZXZlbnRQYWlycy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBzdGFydCA9IHRpbWluZ3NbZXZlbnRQYWlyc1tpXVswXV07XG4gICAgdmFyIGVuZCA9IHRpbWluZ3NbZXZlbnRQYWlyc1tpXVsxXV07XG5cbiAgICBpZiAoIXNob3VsZENyZWF0ZVNwYW4oc3RhcnQsIGVuZCwgdHJTdGFydCwgdHJFbmQsIGJhc2VUaW1lKSkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgdmFyIHNwYW4gPSBuZXcgU3BhbihldmVudFBhaXJzW2ldWzJdLCAnaGFyZC1uYXZpZ2F0aW9uLmJyb3dzZXItdGltaW5nJyk7XG4gICAgdmFyIGRhdGEgPSBudWxsO1xuXG4gICAgaWYgKGV2ZW50UGFpcnNbaV1bMF0gPT09ICdyZXF1ZXN0U3RhcnQnKSB7XG4gICAgICBzcGFuLnBhZ2VSZXNwb25zZSA9IHRydWU7XG4gICAgICBkYXRhID0ge1xuICAgICAgICB1cmw6IGxvY2F0aW9uLm9yaWdpblxuICAgICAgfTtcbiAgICB9XG5cbiAgICBzcGFuLl9zdGFydCA9IHN0YXJ0IC0gYmFzZVRpbWU7XG4gICAgc3Bhbi5lbmQoZW5kIC0gYmFzZVRpbWUsIGRhdGEpO1xuICAgIHNwYW5zLnB1c2goc3Bhbik7XG4gIH1cblxuICByZXR1cm4gc3BhbnM7XG59XG5cbmV4cG9ydCB7IGNyZWF0ZU5hdmlnYXRpb25UaW1pbmdTcGFucyB9OyIsImltcG9ydCB7IHN0cmlwUXVlcnlTdHJpbmdGcm9tVXJsIH0gZnJvbSAnLi4vLi4vY29tbW9uL3V0aWxzJztcbmltcG9ydCB7IHNob3VsZENyZWF0ZVNwYW4gfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7IFJFU09VUkNFX0lOSVRJQVRPUl9UWVBFUyB9IGZyb20gJy4uLy4uL2NvbW1vbi9jb25zdGFudHMnO1xuaW1wb3J0IFNwYW4gZnJvbSAnLi4vc3Bhbic7XG5cbmZ1bmN0aW9uIGNyZWF0ZVJlc291cmNlVGltaW5nU3BhbihyZXNvdXJjZVRpbWluZ0VudHJ5KSB7XG4gIHZhciBuYW1lID0gcmVzb3VyY2VUaW1pbmdFbnRyeS5uYW1lLFxuICAgICAgaW5pdGlhdG9yVHlwZSA9IHJlc291cmNlVGltaW5nRW50cnkuaW5pdGlhdG9yVHlwZSxcbiAgICAgIHN0YXJ0VGltZSA9IHJlc291cmNlVGltaW5nRW50cnkuc3RhcnRUaW1lLFxuICAgICAgcmVzcG9uc2VFbmQgPSByZXNvdXJjZVRpbWluZ0VudHJ5LnJlc3BvbnNlRW5kO1xuICB2YXIga2luZCA9ICdyZXNvdXJjZSc7XG5cbiAgaWYgKGluaXRpYXRvclR5cGUpIHtcbiAgICBraW5kICs9ICcuJyArIGluaXRpYXRvclR5cGU7XG4gIH1cblxuICB2YXIgc3Bhbk5hbWUgPSBzdHJpcFF1ZXJ5U3RyaW5nRnJvbVVybChuYW1lKTtcbiAgdmFyIHNwYW4gPSBuZXcgU3BhbihzcGFuTmFtZSwga2luZCk7XG4gIHNwYW4uX3N0YXJ0ID0gc3RhcnRUaW1lO1xuICBzcGFuLmVuZChyZXNwb25zZUVuZCwge1xuICAgIHVybDogbmFtZSxcbiAgICBlbnRyeTogcmVzb3VyY2VUaW1pbmdFbnRyeVxuICB9KTtcbiAgcmV0dXJuIHNwYW47XG59XG5cbmZ1bmN0aW9uIGlzQ2FwdHVyZWRCeVBhdGNoaW5nKHJlc291cmNlU3RhcnRUaW1lLCByZXF1ZXN0UGF0Y2hUaW1lKSB7XG4gIHJldHVybiByZXF1ZXN0UGF0Y2hUaW1lICE9IG51bGwgJiYgcmVzb3VyY2VTdGFydFRpbWUgPiByZXF1ZXN0UGF0Y2hUaW1lO1xufVxuXG5mdW5jdGlvbiBpc0ludGFrZUFQSUVuZHBvaW50KHVybCkge1xuICByZXR1cm4gL2ludGFrZVxcL3ZcXGQrXFwvcnVtXFwvZXZlbnRzLy50ZXN0KHVybCk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVJlc291cmNlVGltaW5nU3BhbnMoZW50cmllcywgcmVxdWVzdFBhdGNoVGltZSwgdHJTdGFydCwgdHJFbmQpIHtcbiAgdmFyIHNwYW5zID0gW107XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbnRyaWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIF9lbnRyaWVzJGkgPSBlbnRyaWVzW2ldLFxuICAgICAgICBpbml0aWF0b3JUeXBlID0gX2VudHJpZXMkaS5pbml0aWF0b3JUeXBlLFxuICAgICAgICBuYW1lID0gX2VudHJpZXMkaS5uYW1lLFxuICAgICAgICBzdGFydFRpbWUgPSBfZW50cmllcyRpLnN0YXJ0VGltZSxcbiAgICAgICAgcmVzcG9uc2VFbmQgPSBfZW50cmllcyRpLnJlc3BvbnNlRW5kO1xuXG4gICAgaWYgKFJFU09VUkNFX0lOSVRJQVRPUl9UWVBFUy5pbmRleE9mKGluaXRpYXRvclR5cGUpID09PSAtMSB8fCBuYW1lID09IG51bGwpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGlmICgoaW5pdGlhdG9yVHlwZSA9PT0gJ3htbGh0dHByZXF1ZXN0JyB8fCBpbml0aWF0b3JUeXBlID09PSAnZmV0Y2gnKSAmJiAoaXNJbnRha2VBUElFbmRwb2ludChuYW1lKSB8fCBpc0NhcHR1cmVkQnlQYXRjaGluZyhzdGFydFRpbWUsIHJlcXVlc3RQYXRjaFRpbWUpKSkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgaWYgKHNob3VsZENyZWF0ZVNwYW4oc3RhcnRUaW1lLCByZXNwb25zZUVuZCwgdHJTdGFydCwgdHJFbmQpKSB7XG4gICAgICBzcGFucy5wdXNoKGNyZWF0ZVJlc291cmNlVGltaW5nU3BhbihlbnRyaWVzW2ldKSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHNwYW5zO1xufVxuXG5leHBvcnQgeyBjcmVhdGVSZXNvdXJjZVRpbWluZ1NwYW5zIH07IiwiaW1wb3J0IHsgVVNFUl9USU1JTkdfVEhSRVNIT0xEIH0gZnJvbSAnLi4vLi4vY29tbW9uL2NvbnN0YW50cyc7XG5pbXBvcnQgeyBzaG91bGRDcmVhdGVTcGFuIH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgU3BhbiBmcm9tICcuLi9zcGFuJztcblxuZnVuY3Rpb24gY3JlYXRlVXNlclRpbWluZ1NwYW5zKGVudHJpZXMsIHRyU3RhcnQsIHRyRW5kKSB7XG4gIHZhciB1c2VyVGltaW5nU3BhbnMgPSBbXTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGVudHJpZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgX2VudHJpZXMkaSA9IGVudHJpZXNbaV0sXG4gICAgICAgIG5hbWUgPSBfZW50cmllcyRpLm5hbWUsXG4gICAgICAgIHN0YXJ0VGltZSA9IF9lbnRyaWVzJGkuc3RhcnRUaW1lLFxuICAgICAgICBkdXJhdGlvbiA9IF9lbnRyaWVzJGkuZHVyYXRpb247XG4gICAgdmFyIGVuZCA9IHN0YXJ0VGltZSArIGR1cmF0aW9uO1xuXG4gICAgaWYgKGR1cmF0aW9uIDw9IFVTRVJfVElNSU5HX1RIUkVTSE9MRCB8fCAhc2hvdWxkQ3JlYXRlU3BhbihzdGFydFRpbWUsIGVuZCwgdHJTdGFydCwgdHJFbmQpKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICB2YXIga2luZCA9ICdhcHAnO1xuICAgIHZhciBzcGFuID0gbmV3IFNwYW4obmFtZSwga2luZCk7XG4gICAgc3Bhbi5fc3RhcnQgPSBzdGFydFRpbWU7XG4gICAgc3Bhbi5lbmQoZW5kKTtcbiAgICB1c2VyVGltaW5nU3BhbnMucHVzaChzcGFuKTtcbiAgfVxuXG4gIHJldHVybiB1c2VyVGltaW5nU3BhbnM7XG59XG5cbmV4cG9ydCB7IGNyZWF0ZVVzZXJUaW1pbmdTcGFucyB9OyIsImltcG9ydCB7IE1BWF9TUEFOX0RVUkFUSU9OIH0gZnJvbSAnLi4vLi4vY29tbW9uL2NvbnN0YW50cyc7XG5cbmZ1bmN0aW9uIHNob3VsZENyZWF0ZVNwYW4oc3RhcnQsIGVuZCwgdHJTdGFydCwgdHJFbmQsIGJhc2VUaW1lKSB7XG4gIGlmIChiYXNlVGltZSA9PT0gdm9pZCAwKSB7XG4gICAgYmFzZVRpbWUgPSAwO1xuICB9XG5cbiAgcmV0dXJuIHR5cGVvZiBzdGFydCA9PT0gJ251bWJlcicgJiYgdHlwZW9mIGVuZCA9PT0gJ251bWJlcicgJiYgc3RhcnQgPj0gYmFzZVRpbWUgJiYgZW5kID4gc3RhcnQgJiYgc3RhcnQgLSBiYXNlVGltZSA+PSB0clN0YXJ0ICYmIGVuZCAtIGJhc2VUaW1lIDw9IHRyRW5kICYmIGVuZCAtIHN0YXJ0IDwgTUFYX1NQQU5fRFVSQVRJT04gJiYgc3RhcnQgLSBiYXNlVGltZSA8IE1BWF9TUEFOX0RVUkFUSU9OICYmIGVuZCAtIGJhc2VUaW1lIDwgTUFYX1NQQU5fRFVSQVRJT047XG59XG5cbmV4cG9ydCB7IHNob3VsZENyZWF0ZVNwYW4gfTsiLCJpbXBvcnQgeyBjaGVja1NhbWVPcmlnaW4sIGlzRHRIZWFkZXJWYWxpZCwgcGFyc2VEdEhlYWRlclZhbHVlLCBnZXREdEhlYWRlclZhbHVlLCBnZXRUU0hlYWRlclZhbHVlLCBzdHJpcFF1ZXJ5U3RyaW5nRnJvbVVybCwgc2V0UmVxdWVzdEhlYWRlciB9IGZyb20gJy4uL2NvbW1vbi91dGlscyc7XG5pbXBvcnQgeyBVcmwgfSBmcm9tICcuLi9jb21tb24vdXJsJztcbmltcG9ydCB7IHBhdGNoRXZlbnRIYW5kbGVyIH0gZnJvbSAnLi4vY29tbW9uL3BhdGNoaW5nJztcbmltcG9ydCB7IGdsb2JhbFN0YXRlIH0gZnJvbSAnLi4vY29tbW9uL3BhdGNoaW5nL3BhdGNoLXV0aWxzJztcbmltcG9ydCB7IFNDSEVEVUxFLCBJTlZPS0UsIFRSQU5TQUNUSU9OX0VORCwgQUZURVJfRVZFTlQsIEZFVENILCBISVNUT1JZLCBYTUxIVFRQUkVRVUVTVCwgSFRUUF9SRVFVRVNUX1RZUEUsIE9VVENPTUVfRkFJTFVSRSwgT1VUQ09NRV9TVUNDRVNTLCBPVVRDT01FX1VOS05PV04sIFFVRVVFX0FERF9UUkFOU0FDVElPTiwgVFJBTlNBQ1RJT05fSUdOT1JFIH0gZnJvbSAnLi4vY29tbW9uL2NvbnN0YW50cyc7XG5pbXBvcnQgeyB0cnVuY2F0ZU1vZGVsLCBTUEFOX01PREVMLCBUUkFOU0FDVElPTl9NT0RFTCB9IGZyb20gJy4uL2NvbW1vbi90cnVuY2F0ZSc7XG5pbXBvcnQgeyBfX0RFVl9fIH0gZnJvbSAnLi4vc3RhdGUnO1xudmFyIFNJTUlMQVJfU1BBTl9UT19UUkFOU0FDVElPTl9SQVRJTyA9IDAuMDU7XG52YXIgVFJBTlNBQ1RJT05fRFVSQVRJT05fVEhSRVNIT0xEID0gNjAwMDA7XG5leHBvcnQgZnVuY3Rpb24gZ3JvdXBTbWFsbENvbnRpbnVvdXNseVNpbWlsYXJTcGFucyhvcmlnaW5hbFNwYW5zLCB0cmFuc0R1cmF0aW9uLCB0aHJlc2hvbGQpIHtcbiAgb3JpZ2luYWxTcGFucy5zb3J0KGZ1bmN0aW9uIChzcGFuQSwgc3BhbkIpIHtcbiAgICByZXR1cm4gc3BhbkEuX3N0YXJ0IC0gc3BhbkIuX3N0YXJ0O1xuICB9KTtcbiAgdmFyIHNwYW5zID0gW107XG4gIHZhciBsYXN0Q291bnQgPSAxO1xuICBvcmlnaW5hbFNwYW5zLmZvckVhY2goZnVuY3Rpb24gKHNwYW4sIGluZGV4KSB7XG4gICAgaWYgKHNwYW5zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgc3BhbnMucHVzaChzcGFuKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGxhc3RTcGFuID0gc3BhbnNbc3BhbnMubGVuZ3RoIC0gMV07XG4gICAgICB2YXIgaXNDb250aW51b3VzbHlTaW1pbGFyID0gbGFzdFNwYW4udHlwZSA9PT0gc3Bhbi50eXBlICYmIGxhc3RTcGFuLnN1YnR5cGUgPT09IHNwYW4uc3VidHlwZSAmJiBsYXN0U3Bhbi5hY3Rpb24gPT09IHNwYW4uYWN0aW9uICYmIGxhc3RTcGFuLm5hbWUgPT09IHNwYW4ubmFtZSAmJiBzcGFuLmR1cmF0aW9uKCkgLyB0cmFuc0R1cmF0aW9uIDwgdGhyZXNob2xkICYmIChzcGFuLl9zdGFydCAtIGxhc3RTcGFuLl9lbmQpIC8gdHJhbnNEdXJhdGlvbiA8IHRocmVzaG9sZDtcbiAgICAgIHZhciBpc0xhc3RTcGFuID0gb3JpZ2luYWxTcGFucy5sZW5ndGggPT09IGluZGV4ICsgMTtcblxuICAgICAgaWYgKGlzQ29udGludW91c2x5U2ltaWxhcikge1xuICAgICAgICBsYXN0Q291bnQrKztcbiAgICAgICAgbGFzdFNwYW4uX2VuZCA9IHNwYW4uX2VuZDtcbiAgICAgIH1cblxuICAgICAgaWYgKGxhc3RDb3VudCA+IDEgJiYgKCFpc0NvbnRpbnVvdXNseVNpbWlsYXIgfHwgaXNMYXN0U3BhbikpIHtcbiAgICAgICAgbGFzdFNwYW4ubmFtZSA9IGxhc3RDb3VudCArICd4ICcgKyBsYXN0U3Bhbi5uYW1lO1xuICAgICAgICBsYXN0Q291bnQgPSAxO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWlzQ29udGludW91c2x5U2ltaWxhcikge1xuICAgICAgICBzcGFucy5wdXNoKHNwYW4pO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiBzcGFucztcbn1cbmV4cG9ydCBmdW5jdGlvbiBhZGp1c3RUcmFuc2FjdGlvbih0cmFuc2FjdGlvbikge1xuICBpZiAodHJhbnNhY3Rpb24uc2FtcGxlZCkge1xuICAgIHZhciBmaWx0ZXJkU3BhbnMgPSB0cmFuc2FjdGlvbi5zcGFucy5maWx0ZXIoZnVuY3Rpb24gKHNwYW4pIHtcbiAgICAgIHJldHVybiBzcGFuLmR1cmF0aW9uKCkgPiAwICYmIHNwYW4uX3N0YXJ0ID49IHRyYW5zYWN0aW9uLl9zdGFydCAmJiBzcGFuLl9lbmQgPD0gdHJhbnNhY3Rpb24uX2VuZDtcbiAgICB9KTtcblxuICAgIGlmICh0cmFuc2FjdGlvbi5pc01hbmFnZWQoKSkge1xuICAgICAgdmFyIGR1cmF0aW9uID0gdHJhbnNhY3Rpb24uZHVyYXRpb24oKTtcbiAgICAgIHZhciBzaW1pbGFyU3BhbnMgPSBncm91cFNtYWxsQ29udGludW91c2x5U2ltaWxhclNwYW5zKGZpbHRlcmRTcGFucywgZHVyYXRpb24sIFNJTUlMQVJfU1BBTl9UT19UUkFOU0FDVElPTl9SQVRJTyk7XG4gICAgICB0cmFuc2FjdGlvbi5zcGFucyA9IHNpbWlsYXJTcGFucztcbiAgICB9IGVsc2Uge1xuICAgICAgdHJhbnNhY3Rpb24uc3BhbnMgPSBmaWx0ZXJkU3BhbnM7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHRyYW5zYWN0aW9uLnJlc2V0RmllbGRzKCk7XG4gIH1cblxuICByZXR1cm4gdHJhbnNhY3Rpb247XG59XG5cbnZhciBQZXJmb3JtYW5jZU1vbml0b3JpbmcgPSBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIFBlcmZvcm1hbmNlTW9uaXRvcmluZyhhcG1TZXJ2ZXIsIGNvbmZpZ1NlcnZpY2UsIGxvZ2dpbmdTZXJ2aWNlLCB0cmFuc2FjdGlvblNlcnZpY2UpIHtcbiAgICB0aGlzLl9hcG1TZXJ2ZXIgPSBhcG1TZXJ2ZXI7XG4gICAgdGhpcy5fY29uZmlnU2VydmljZSA9IGNvbmZpZ1NlcnZpY2U7XG4gICAgdGhpcy5fbG9nZ2luU2VydmljZSA9IGxvZ2dpbmdTZXJ2aWNlO1xuICAgIHRoaXMuX3RyYW5zYWN0aW9uU2VydmljZSA9IHRyYW5zYWN0aW9uU2VydmljZTtcbiAgfVxuXG4gIHZhciBfcHJvdG8gPSBQZXJmb3JtYW5jZU1vbml0b3JpbmcucHJvdG90eXBlO1xuXG4gIF9wcm90by5pbml0ID0gZnVuY3Rpb24gaW5pdChmbGFncykge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICBpZiAoZmxhZ3MgPT09IHZvaWQgMCkge1xuICAgICAgZmxhZ3MgPSB7fTtcbiAgICB9XG5cbiAgICB0aGlzLl9jb25maWdTZXJ2aWNlLmV2ZW50cy5vYnNlcnZlKFRSQU5TQUNUSU9OX0VORCArIEFGVEVSX0VWRU5ULCBmdW5jdGlvbiAodHIpIHtcbiAgICAgIHZhciBwYXlsb2FkID0gX3RoaXMuY3JlYXRlVHJhbnNhY3Rpb25QYXlsb2FkKHRyKTtcblxuICAgICAgaWYgKHBheWxvYWQpIHtcbiAgICAgICAgX3RoaXMuX2FwbVNlcnZlci5hZGRUcmFuc2FjdGlvbihwYXlsb2FkKTtcblxuICAgICAgICBfdGhpcy5fY29uZmlnU2VydmljZS5kaXNwYXRjaEV2ZW50KFFVRVVFX0FERF9UUkFOU0FDVElPTik7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAoZmxhZ3NbSElTVE9SWV0pIHtcbiAgICAgIHBhdGNoRXZlbnRIYW5kbGVyLm9ic2VydmUoSElTVE9SWSwgdGhpcy5nZXRIaXN0b3J5U3ViKCkpO1xuICAgIH1cblxuICAgIGlmIChmbGFnc1tYTUxIVFRQUkVRVUVTVF0pIHtcbiAgICAgIHBhdGNoRXZlbnRIYW5kbGVyLm9ic2VydmUoWE1MSFRUUFJFUVVFU1QsIHRoaXMuZ2V0WEhSU3ViKCkpO1xuICAgIH1cblxuICAgIGlmIChmbGFnc1tGRVRDSF0pIHtcbiAgICAgIHBhdGNoRXZlbnRIYW5kbGVyLm9ic2VydmUoRkVUQ0gsIHRoaXMuZ2V0RmV0Y2hTdWIoKSk7XG4gICAgfVxuICB9O1xuXG4gIF9wcm90by5nZXRIaXN0b3J5U3ViID0gZnVuY3Rpb24gZ2V0SGlzdG9yeVN1YigpIHtcbiAgICB2YXIgdHJhbnNhY3Rpb25TZXJ2aWNlID0gdGhpcy5fdHJhbnNhY3Rpb25TZXJ2aWNlO1xuICAgIHJldHVybiBmdW5jdGlvbiAoZXZlbnQsIHRhc2spIHtcbiAgICAgIGlmICh0YXNrLnNvdXJjZSA9PT0gSElTVE9SWSAmJiBldmVudCA9PT0gSU5WT0tFKSB7XG4gICAgICAgIHRyYW5zYWN0aW9uU2VydmljZS5zdGFydFRyYW5zYWN0aW9uKHRhc2suZGF0YS50aXRsZSwgJ3JvdXRlLWNoYW5nZScsIHtcbiAgICAgICAgICBtYW5hZ2VkOiB0cnVlLFxuICAgICAgICAgIGNhblJldXNlOiB0cnVlXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH07XG4gIH07XG5cbiAgX3Byb3RvLmdldFhIUlN1YiA9IGZ1bmN0aW9uIGdldFhIUlN1YigpIHtcbiAgICB2YXIgX3RoaXMyID0gdGhpcztcblxuICAgIHJldHVybiBmdW5jdGlvbiAoZXZlbnQsIHRhc2spIHtcbiAgICAgIGlmICh0YXNrLnNvdXJjZSA9PT0gWE1MSFRUUFJFUVVFU1QgJiYgIWdsb2JhbFN0YXRlLmZldGNoSW5Qcm9ncmVzcykge1xuICAgICAgICBfdGhpczIucHJvY2Vzc0FQSUNhbGxzKGV2ZW50LCB0YXNrKTtcbiAgICAgIH1cbiAgICB9O1xuICB9O1xuXG4gIF9wcm90by5nZXRGZXRjaFN1YiA9IGZ1bmN0aW9uIGdldEZldGNoU3ViKCkge1xuICAgIHZhciBfdGhpczMgPSB0aGlzO1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChldmVudCwgdGFzaykge1xuICAgICAgaWYgKHRhc2suc291cmNlID09PSBGRVRDSCkge1xuICAgICAgICBfdGhpczMucHJvY2Vzc0FQSUNhbGxzKGV2ZW50LCB0YXNrKTtcbiAgICAgIH1cbiAgICB9O1xuICB9O1xuXG4gIF9wcm90by5wcm9jZXNzQVBJQ2FsbHMgPSBmdW5jdGlvbiBwcm9jZXNzQVBJQ2FsbHMoZXZlbnQsIHRhc2spIHtcbiAgICB2YXIgY29uZmlnU2VydmljZSA9IHRoaXMuX2NvbmZpZ1NlcnZpY2U7XG4gICAgdmFyIHRyYW5zYWN0aW9uU2VydmljZSA9IHRoaXMuX3RyYW5zYWN0aW9uU2VydmljZTtcblxuICAgIGlmICh0YXNrLmRhdGEgJiYgdGFzay5kYXRhLnVybCkge1xuICAgICAgdmFyIGVuZHBvaW50cyA9IHRoaXMuX2FwbVNlcnZlci5nZXRFbmRwb2ludHMoKTtcblxuICAgICAgdmFyIGlzT3duRW5kcG9pbnQgPSBPYmplY3Qua2V5cyhlbmRwb2ludHMpLnNvbWUoZnVuY3Rpb24gKGVuZHBvaW50KSB7XG4gICAgICAgIHJldHVybiB0YXNrLmRhdGEudXJsLmluZGV4T2YoZW5kcG9pbnRzW2VuZHBvaW50XSkgIT09IC0xO1xuICAgICAgfSk7XG5cbiAgICAgIGlmIChpc093bkVuZHBvaW50KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoZXZlbnQgPT09IFNDSEVEVUxFICYmIHRhc2suZGF0YSkge1xuICAgICAgdmFyIGRhdGEgPSB0YXNrLmRhdGE7XG4gICAgICB2YXIgcmVxdWVzdFVybCA9IG5ldyBVcmwoZGF0YS51cmwpO1xuICAgICAgdmFyIHNwYW5OYW1lID0gZGF0YS5tZXRob2QgKyAnICcgKyAocmVxdWVzdFVybC5yZWxhdGl2ZSA/IHJlcXVlc3RVcmwucGF0aCA6IHN0cmlwUXVlcnlTdHJpbmdGcm9tVXJsKHJlcXVlc3RVcmwuaHJlZikpO1xuXG4gICAgICBpZiAoIXRyYW5zYWN0aW9uU2VydmljZS5nZXRDdXJyZW50VHJhbnNhY3Rpb24oKSkge1xuICAgICAgICB0cmFuc2FjdGlvblNlcnZpY2Uuc3RhcnRUcmFuc2FjdGlvbihzcGFuTmFtZSwgSFRUUF9SRVFVRVNUX1RZUEUsIHtcbiAgICAgICAgICBtYW5hZ2VkOiB0cnVlXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICB2YXIgc3BhbiA9IHRyYW5zYWN0aW9uU2VydmljZS5zdGFydFNwYW4oc3Bhbk5hbWUsICdleHRlcm5hbC5odHRwJywge1xuICAgICAgICBibG9ja2luZzogdHJ1ZVxuICAgICAgfSk7XG5cbiAgICAgIGlmICghc3Bhbikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciBpc0R0RW5hYmxlZCA9IGNvbmZpZ1NlcnZpY2UuZ2V0KCdkaXN0cmlidXRlZFRyYWNpbmcnKTtcbiAgICAgIHZhciBkdE9yaWdpbnMgPSBjb25maWdTZXJ2aWNlLmdldCgnZGlzdHJpYnV0ZWRUcmFjaW5nT3JpZ2lucycpO1xuICAgICAgdmFyIGN1cnJlbnRVcmwgPSBuZXcgVXJsKHdpbmRvdy5sb2NhdGlvbi5ocmVmKTtcbiAgICAgIHZhciBpc1NhbWVPcmlnaW4gPSBjaGVja1NhbWVPcmlnaW4ocmVxdWVzdFVybC5vcmlnaW4sIGN1cnJlbnRVcmwub3JpZ2luKSB8fCBjaGVja1NhbWVPcmlnaW4ocmVxdWVzdFVybC5vcmlnaW4sIGR0T3JpZ2lucyk7XG4gICAgICB2YXIgdGFyZ2V0ID0gZGF0YS50YXJnZXQ7XG5cbiAgICAgIGlmIChpc0R0RW5hYmxlZCAmJiBpc1NhbWVPcmlnaW4gJiYgdGFyZ2V0KSB7XG4gICAgICAgIHRoaXMuaW5qZWN0RHRIZWFkZXIoc3BhbiwgdGFyZ2V0KTtcbiAgICAgICAgdmFyIHByb3BhZ2F0ZVRyYWNlc3RhdGUgPSBjb25maWdTZXJ2aWNlLmdldCgncHJvcGFnYXRlVHJhY2VzdGF0ZScpO1xuXG4gICAgICAgIGlmIChwcm9wYWdhdGVUcmFjZXN0YXRlKSB7XG4gICAgICAgICAgdGhpcy5pbmplY3RUU0hlYWRlcihzcGFuLCB0YXJnZXQpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKF9fREVWX18pIHtcbiAgICAgICAgdGhpcy5fbG9nZ2luU2VydmljZS5kZWJ1ZyhcIkNvdWxkIG5vdCBpbmplY3QgZGlzdHJpYnV0ZWQgdHJhY2luZyBoZWFkZXIgdG8gdGhlIHJlcXVlc3Qgb3JpZ2luICgnXCIgKyByZXF1ZXN0VXJsLm9yaWdpbiArIFwiJykgZnJvbSB0aGUgY3VycmVudCBvcmlnaW4gKCdcIiArIGN1cnJlbnRVcmwub3JpZ2luICsgXCInKVwiKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGRhdGEuc3luYykge1xuICAgICAgICBzcGFuLnN5bmMgPSBkYXRhLnN5bmM7XG4gICAgICB9XG5cbiAgICAgIGRhdGEuc3BhbiA9IHNwYW47XG4gICAgfSBlbHNlIGlmIChldmVudCA9PT0gSU5WT0tFKSB7XG4gICAgICB2YXIgX2RhdGEgPSB0YXNrLmRhdGE7XG5cbiAgICAgIGlmIChfZGF0YSAmJiBfZGF0YS5zcGFuKSB7XG4gICAgICAgIHZhciBfc3BhbiA9IF9kYXRhLnNwYW4sXG4gICAgICAgICAgICByZXNwb25zZSA9IF9kYXRhLnJlc3BvbnNlLFxuICAgICAgICAgICAgX3RhcmdldCA9IF9kYXRhLnRhcmdldDtcbiAgICAgICAgdmFyIHN0YXR1cztcblxuICAgICAgICBpZiAocmVzcG9uc2UpIHtcbiAgICAgICAgICBzdGF0dXMgPSByZXNwb25zZS5zdGF0dXM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3RhdHVzID0gX3RhcmdldC5zdGF0dXM7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgb3V0Y29tZTtcblxuICAgICAgICBpZiAoX2RhdGEuc3RhdHVzICE9ICdhYm9ydCcgJiYgIV9kYXRhLmFib3J0ZWQpIHtcbiAgICAgICAgICBpZiAoc3RhdHVzID49IDQwMCB8fCBzdGF0dXMgPT0gMCkge1xuICAgICAgICAgICAgb3V0Y29tZSA9IE9VVENPTUVfRkFJTFVSRTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb3V0Y29tZSA9IE9VVENPTUVfU1VDQ0VTUztcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgb3V0Y29tZSA9IE9VVENPTUVfVU5LTk9XTjtcbiAgICAgICAgfVxuXG4gICAgICAgIF9zcGFuLm91dGNvbWUgPSBvdXRjb21lO1xuICAgICAgICB2YXIgdHIgPSB0cmFuc2FjdGlvblNlcnZpY2UuZ2V0Q3VycmVudFRyYW5zYWN0aW9uKCk7XG5cbiAgICAgICAgaWYgKHRyICYmIHRyLnR5cGUgPT09IEhUVFBfUkVRVUVTVF9UWVBFKSB7XG4gICAgICAgICAgdHIub3V0Y29tZSA9IG91dGNvbWU7XG4gICAgICAgIH1cblxuICAgICAgICB0cmFuc2FjdGlvblNlcnZpY2UuZW5kU3Bhbihfc3BhbiwgX2RhdGEpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBfcHJvdG8uaW5qZWN0RHRIZWFkZXIgPSBmdW5jdGlvbiBpbmplY3REdEhlYWRlcihzcGFuLCB0YXJnZXQpIHtcbiAgICB2YXIgaGVhZGVyTmFtZSA9IHRoaXMuX2NvbmZpZ1NlcnZpY2UuZ2V0KCdkaXN0cmlidXRlZFRyYWNpbmdIZWFkZXJOYW1lJyk7XG5cbiAgICB2YXIgaGVhZGVyVmFsdWUgPSBnZXREdEhlYWRlclZhbHVlKHNwYW4pO1xuICAgIHZhciBpc0hlYWRlclZhbGlkID0gaXNEdEhlYWRlclZhbGlkKGhlYWRlclZhbHVlKTtcblxuICAgIGlmIChpc0hlYWRlclZhbGlkICYmIGhlYWRlclZhbHVlICYmIGhlYWRlck5hbWUpIHtcbiAgICAgIHNldFJlcXVlc3RIZWFkZXIodGFyZ2V0LCBoZWFkZXJOYW1lLCBoZWFkZXJWYWx1ZSk7XG4gICAgfVxuICB9O1xuXG4gIF9wcm90by5pbmplY3RUU0hlYWRlciA9IGZ1bmN0aW9uIGluamVjdFRTSGVhZGVyKHNwYW4sIHRhcmdldCkge1xuICAgIHZhciBoZWFkZXJWYWx1ZSA9IGdldFRTSGVhZGVyVmFsdWUoc3Bhbik7XG5cbiAgICBpZiAoaGVhZGVyVmFsdWUpIHtcbiAgICAgIHNldFJlcXVlc3RIZWFkZXIodGFyZ2V0LCAndHJhY2VzdGF0ZScsIGhlYWRlclZhbHVlKTtcbiAgICB9XG4gIH07XG5cbiAgX3Byb3RvLmV4dHJhY3REdEhlYWRlciA9IGZ1bmN0aW9uIGV4dHJhY3REdEhlYWRlcih0YXJnZXQpIHtcbiAgICB2YXIgY29uZmlnU2VydmljZSA9IHRoaXMuX2NvbmZpZ1NlcnZpY2U7XG4gICAgdmFyIGhlYWRlck5hbWUgPSBjb25maWdTZXJ2aWNlLmdldCgnZGlzdHJpYnV0ZWRUcmFjaW5nSGVhZGVyTmFtZScpO1xuXG4gICAgaWYgKHRhcmdldCkge1xuICAgICAgcmV0dXJuIHBhcnNlRHRIZWFkZXJWYWx1ZSh0YXJnZXRbaGVhZGVyTmFtZV0pO1xuICAgIH1cbiAgfTtcblxuICBfcHJvdG8uZmlsdGVyVHJhbnNhY3Rpb24gPSBmdW5jdGlvbiBmaWx0ZXJUcmFuc2FjdGlvbih0cikge1xuICAgIHZhciBkdXJhdGlvbiA9IHRyLmR1cmF0aW9uKCk7XG5cbiAgICBpZiAoIWR1cmF0aW9uKSB7XG4gICAgICBpZiAoX19ERVZfXykge1xuICAgICAgICB2YXIgbWVzc2FnZSA9IFwidHJhbnNhY3Rpb24oXCIgKyB0ci5pZCArIFwiLCBcIiArIHRyLm5hbWUgKyBcIikgd2FzIGRpc2NhcmRlZCEgXCI7XG5cbiAgICAgICAgaWYgKGR1cmF0aW9uID09PSAwKSB7XG4gICAgICAgICAgbWVzc2FnZSArPSBcIlRyYW5zYWN0aW9uIGR1cmF0aW9uIGlzIDBcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBtZXNzYWdlICs9IFwiVHJhbnNhY3Rpb24gd2Fzbid0IGVuZGVkXCI7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9sb2dnaW5TZXJ2aWNlLmRlYnVnKG1lc3NhZ2UpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKHRyLmlzTWFuYWdlZCgpKSB7XG4gICAgICBpZiAoZHVyYXRpb24gPiBUUkFOU0FDVElPTl9EVVJBVElPTl9USFJFU0hPTEQpIHtcbiAgICAgICAgaWYgKF9fREVWX18pIHtcbiAgICAgICAgICB0aGlzLl9sb2dnaW5TZXJ2aWNlLmRlYnVnKFwidHJhbnNhY3Rpb24oXCIgKyB0ci5pZCArIFwiLCBcIiArIHRyLm5hbWUgKyBcIikgd2FzIGRpc2NhcmRlZCEgVHJhbnNhY3Rpb24gZHVyYXRpb24gKFwiICsgZHVyYXRpb24gKyBcIikgaXMgZ3JlYXRlciB0aGFuIG1hbmFnZWQgdHJhbnNhY3Rpb24gdGhyZXNob2xkIChcIiArIFRSQU5TQUNUSU9OX0RVUkFUSU9OX1RIUkVTSE9MRCArIFwiKVwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRyLnNhbXBsZWQgJiYgdHIuc3BhbnMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGlmIChfX0RFVl9fKSB7XG4gICAgICAgICAgdGhpcy5fbG9nZ2luU2VydmljZS5kZWJ1ZyhcInRyYW5zYWN0aW9uKFwiICsgdHIuaWQgKyBcIiwgXCIgKyB0ci5uYW1lICsgXCIpIHdhcyBkaXNjYXJkZWQhIFRyYW5zYWN0aW9uIGRvZXMgbm90IGhhdmUgYW55IHNwYW5zXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG4gIF9wcm90by5jcmVhdGVUcmFuc2FjdGlvbkRhdGFNb2RlbCA9IGZ1bmN0aW9uIGNyZWF0ZVRyYW5zYWN0aW9uRGF0YU1vZGVsKHRyYW5zYWN0aW9uKSB7XG4gICAgdmFyIHRyYW5zYWN0aW9uU3RhcnQgPSB0cmFuc2FjdGlvbi5fc3RhcnQ7XG4gICAgdmFyIHNwYW5zID0gdHJhbnNhY3Rpb24uc3BhbnMubWFwKGZ1bmN0aW9uIChzcGFuKSB7XG4gICAgICB2YXIgc3BhbkRhdGEgPSB7XG4gICAgICAgIGlkOiBzcGFuLmlkLFxuICAgICAgICB0cmFuc2FjdGlvbl9pZDogdHJhbnNhY3Rpb24uaWQsXG4gICAgICAgIHBhcmVudF9pZDogc3Bhbi5wYXJlbnRJZCB8fCB0cmFuc2FjdGlvbi5pZCxcbiAgICAgICAgdHJhY2VfaWQ6IHRyYW5zYWN0aW9uLnRyYWNlSWQsXG4gICAgICAgIG5hbWU6IHNwYW4ubmFtZSxcbiAgICAgICAgdHlwZTogc3Bhbi50eXBlLFxuICAgICAgICBzdWJ0eXBlOiBzcGFuLnN1YnR5cGUsXG4gICAgICAgIGFjdGlvbjogc3Bhbi5hY3Rpb24sXG4gICAgICAgIHN5bmM6IHNwYW4uc3luYyxcbiAgICAgICAgc3RhcnQ6IHBhcnNlSW50KHNwYW4uX3N0YXJ0IC0gdHJhbnNhY3Rpb25TdGFydCksXG4gICAgICAgIGR1cmF0aW9uOiBzcGFuLmR1cmF0aW9uKCksXG4gICAgICAgIGNvbnRleHQ6IHNwYW4uY29udGV4dCxcbiAgICAgICAgb3V0Y29tZTogc3Bhbi5vdXRjb21lLFxuICAgICAgICBzYW1wbGVfcmF0ZTogc3Bhbi5zYW1wbGVSYXRlXG4gICAgICB9O1xuICAgICAgcmV0dXJuIHRydW5jYXRlTW9kZWwoU1BBTl9NT0RFTCwgc3BhbkRhdGEpO1xuICAgIH0pO1xuICAgIHZhciB0cmFuc2FjdGlvbkRhdGEgPSB7XG4gICAgICBpZDogdHJhbnNhY3Rpb24uaWQsXG4gICAgICB0cmFjZV9pZDogdHJhbnNhY3Rpb24udHJhY2VJZCxcbiAgICAgIHNlc3Npb246IHRyYW5zYWN0aW9uLnNlc3Npb24sXG4gICAgICBuYW1lOiB0cmFuc2FjdGlvbi5uYW1lLFxuICAgICAgdHlwZTogdHJhbnNhY3Rpb24udHlwZSxcbiAgICAgIGR1cmF0aW9uOiB0cmFuc2FjdGlvbi5kdXJhdGlvbigpLFxuICAgICAgc3BhbnM6IHNwYW5zLFxuICAgICAgY29udGV4dDogdHJhbnNhY3Rpb24uY29udGV4dCxcbiAgICAgIG1hcmtzOiB0cmFuc2FjdGlvbi5tYXJrcyxcbiAgICAgIGJyZWFrZG93bjogdHJhbnNhY3Rpb24uYnJlYWtkb3duVGltaW5ncyxcbiAgICAgIHNwYW5fY291bnQ6IHtcbiAgICAgICAgc3RhcnRlZDogc3BhbnMubGVuZ3RoXG4gICAgICB9LFxuICAgICAgc2FtcGxlZDogdHJhbnNhY3Rpb24uc2FtcGxlZCxcbiAgICAgIHNhbXBsZV9yYXRlOiB0cmFuc2FjdGlvbi5zYW1wbGVSYXRlLFxuICAgICAgZXhwZXJpZW5jZTogdHJhbnNhY3Rpb24uZXhwZXJpZW5jZSxcbiAgICAgIG91dGNvbWU6IHRyYW5zYWN0aW9uLm91dGNvbWVcbiAgICB9O1xuICAgIHJldHVybiB0cnVuY2F0ZU1vZGVsKFRSQU5TQUNUSU9OX01PREVMLCB0cmFuc2FjdGlvbkRhdGEpO1xuICB9O1xuXG4gIF9wcm90by5jcmVhdGVUcmFuc2FjdGlvblBheWxvYWQgPSBmdW5jdGlvbiBjcmVhdGVUcmFuc2FjdGlvblBheWxvYWQodHJhbnNhY3Rpb24pIHtcbiAgICB2YXIgYWRqdXN0ZWRUcmFuc2FjdGlvbiA9IGFkanVzdFRyYW5zYWN0aW9uKHRyYW5zYWN0aW9uKTtcbiAgICB2YXIgZmlsdGVyZWQgPSB0aGlzLmZpbHRlclRyYW5zYWN0aW9uKGFkanVzdGVkVHJhbnNhY3Rpb24pO1xuXG4gICAgaWYgKGZpbHRlcmVkKSB7XG4gICAgICByZXR1cm4gdGhpcy5jcmVhdGVUcmFuc2FjdGlvbkRhdGFNb2RlbCh0cmFuc2FjdGlvbik7XG4gICAgfVxuXG4gICAgdGhpcy5fY29uZmlnU2VydmljZS5kaXNwYXRjaEV2ZW50KFRSQU5TQUNUSU9OX0lHTk9SRSk7XG4gIH07XG5cbiAgcmV0dXJuIFBlcmZvcm1hbmNlTW9uaXRvcmluZztcbn0oKTtcblxuZXhwb3J0IHsgUGVyZm9ybWFuY2VNb25pdG9yaW5nIGFzIGRlZmF1bHQgfTsiLCJpbXBvcnQgeyBnZW5lcmF0ZVJhbmRvbUlkLCBzZXRMYWJlbCwgbWVyZ2UsIGdldER1cmF0aW9uLCBnZXRUaW1lIH0gZnJvbSAnLi4vY29tbW9uL3V0aWxzJztcbmltcG9ydCB7IE5BTUVfVU5LTk9XTiwgVFlQRV9DVVNUT00gfSBmcm9tICcuLi9jb21tb24vY29uc3RhbnRzJztcblxudmFyIFNwYW5CYXNlID0gZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBTcGFuQmFzZShuYW1lLCB0eXBlLCBvcHRpb25zKSB7XG4gICAgaWYgKG9wdGlvbnMgPT09IHZvaWQgMCkge1xuICAgICAgb3B0aW9ucyA9IHt9O1xuICAgIH1cblxuICAgIGlmICghbmFtZSkge1xuICAgICAgbmFtZSA9IE5BTUVfVU5LTk9XTjtcbiAgICB9XG5cbiAgICBpZiAoIXR5cGUpIHtcbiAgICAgIHR5cGUgPSBUWVBFX0NVU1RPTTtcbiAgICB9XG5cbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIHRoaXMudHlwZSA9IHR5cGU7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICB0aGlzLmlkID0gb3B0aW9ucy5pZCB8fCBnZW5lcmF0ZVJhbmRvbUlkKDE2KTtcbiAgICB0aGlzLnRyYWNlSWQgPSBvcHRpb25zLnRyYWNlSWQ7XG4gICAgdGhpcy5zYW1wbGVkID0gb3B0aW9ucy5zYW1wbGVkO1xuICAgIHRoaXMuc2FtcGxlUmF0ZSA9IG9wdGlvbnMuc2FtcGxlUmF0ZTtcbiAgICB0aGlzLnRpbWVzdGFtcCA9IG9wdGlvbnMudGltZXN0YW1wO1xuICAgIHRoaXMuX3N0YXJ0ID0gZ2V0VGltZShvcHRpb25zLnN0YXJ0VGltZSk7XG4gICAgdGhpcy5fZW5kID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuZW5kZWQgPSBmYWxzZTtcbiAgICB0aGlzLm91dGNvbWUgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5vbkVuZCA9IG9wdGlvbnMub25FbmQ7XG4gIH1cblxuICB2YXIgX3Byb3RvID0gU3BhbkJhc2UucHJvdG90eXBlO1xuXG4gIF9wcm90by5lbnN1cmVDb250ZXh0ID0gZnVuY3Rpb24gZW5zdXJlQ29udGV4dCgpIHtcbiAgICBpZiAoIXRoaXMuY29udGV4dCkge1xuICAgICAgdGhpcy5jb250ZXh0ID0ge307XG4gICAgfVxuICB9O1xuXG4gIF9wcm90by5hZGRMYWJlbHMgPSBmdW5jdGlvbiBhZGRMYWJlbHModGFncykge1xuICAgIHRoaXMuZW5zdXJlQ29udGV4dCgpO1xuICAgIHZhciBjdHggPSB0aGlzLmNvbnRleHQ7XG5cbiAgICBpZiAoIWN0eC50YWdzKSB7XG4gICAgICBjdHgudGFncyA9IHt9O1xuICAgIH1cblxuICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXModGFncyk7XG4gICAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uIChrKSB7XG4gICAgICByZXR1cm4gc2V0TGFiZWwoaywgdGFnc1trXSwgY3R4LnRhZ3MpO1xuICAgIH0pO1xuICB9O1xuXG4gIF9wcm90by5hZGRDb250ZXh0ID0gZnVuY3Rpb24gYWRkQ29udGV4dCgpIHtcbiAgICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgY29udGV4dCA9IG5ldyBBcnJheShfbGVuKSwgX2tleSA9IDA7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICAgIGNvbnRleHRbX2tleV0gPSBhcmd1bWVudHNbX2tleV07XG4gICAgfVxuXG4gICAgaWYgKGNvbnRleHQubGVuZ3RoID09PSAwKSByZXR1cm47XG4gICAgdGhpcy5lbnN1cmVDb250ZXh0KCk7XG4gICAgbWVyZ2UuYXBwbHkodm9pZCAwLCBbdGhpcy5jb250ZXh0XS5jb25jYXQoY29udGV4dCkpO1xuICB9O1xuXG4gIF9wcm90by5lbmQgPSBmdW5jdGlvbiBlbmQoZW5kVGltZSkge1xuICAgIGlmICh0aGlzLmVuZGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5lbmRlZCA9IHRydWU7XG4gICAgdGhpcy5fZW5kID0gZ2V0VGltZShlbmRUaW1lKTtcbiAgICB0aGlzLmNhbGxPbkVuZCgpO1xuICB9O1xuXG4gIF9wcm90by5jYWxsT25FbmQgPSBmdW5jdGlvbiBjYWxsT25FbmQoKSB7XG4gICAgaWYgKHR5cGVvZiB0aGlzLm9uRW5kID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aGlzLm9uRW5kKHRoaXMpO1xuICAgIH1cbiAgfTtcblxuICBfcHJvdG8uZHVyYXRpb24gPSBmdW5jdGlvbiBkdXJhdGlvbigpIHtcbiAgICByZXR1cm4gZ2V0RHVyYXRpb24odGhpcy5fc3RhcnQsIHRoaXMuX2VuZCk7XG4gIH07XG5cbiAgcmV0dXJuIFNwYW5CYXNlO1xufSgpO1xuXG5leHBvcnQgZGVmYXVsdCBTcGFuQmFzZTsiLCJmdW5jdGlvbiBfaW5oZXJpdHNMb29zZShzdWJDbGFzcywgc3VwZXJDbGFzcykgeyBzdWJDbGFzcy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ2xhc3MucHJvdG90eXBlKTsgc3ViQ2xhc3MucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gc3ViQ2xhc3M7IF9zZXRQcm90b3R5cGVPZihzdWJDbGFzcywgc3VwZXJDbGFzcyk7IH1cblxuZnVuY3Rpb24gX3NldFByb3RvdHlwZU9mKG8sIHApIHsgX3NldFByb3RvdHlwZU9mID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8IGZ1bmN0aW9uIF9zZXRQcm90b3R5cGVPZihvLCBwKSB7IG8uX19wcm90b19fID0gcDsgcmV0dXJuIG87IH07IHJldHVybiBfc2V0UHJvdG90eXBlT2YobywgcCk7IH1cblxuaW1wb3J0IFNwYW5CYXNlIGZyb20gJy4vc3Bhbi1iYXNlJztcbmltcG9ydCB7IGFkZFNwYW5Db250ZXh0IH0gZnJvbSAnLi4vY29tbW9uL2NvbnRleHQnO1xuXG52YXIgU3BhbiA9IGZ1bmN0aW9uIChfU3BhbkJhc2UpIHtcbiAgX2luaGVyaXRzTG9vc2UoU3BhbiwgX1NwYW5CYXNlKTtcblxuICBmdW5jdGlvbiBTcGFuKG5hbWUsIHR5cGUsIG9wdGlvbnMpIHtcbiAgICB2YXIgX3RoaXM7XG5cbiAgICBfdGhpcyA9IF9TcGFuQmFzZS5jYWxsKHRoaXMsIG5hbWUsIHR5cGUsIG9wdGlvbnMpIHx8IHRoaXM7XG4gICAgX3RoaXMucGFyZW50SWQgPSBfdGhpcy5vcHRpb25zLnBhcmVudElkO1xuICAgIF90aGlzLnN1YnR5cGUgPSB1bmRlZmluZWQ7XG4gICAgX3RoaXMuYWN0aW9uID0gdW5kZWZpbmVkO1xuXG4gICAgaWYgKF90aGlzLnR5cGUuaW5kZXhPZignLicpICE9PSAtMSkge1xuICAgICAgdmFyIGZpZWxkcyA9IF90aGlzLnR5cGUuc3BsaXQoJy4nLCAzKTtcblxuICAgICAgX3RoaXMudHlwZSA9IGZpZWxkc1swXTtcbiAgICAgIF90aGlzLnN1YnR5cGUgPSBmaWVsZHNbMV07XG4gICAgICBfdGhpcy5hY3Rpb24gPSBmaWVsZHNbMl07XG4gICAgfVxuXG4gICAgX3RoaXMuc3luYyA9IF90aGlzLm9wdGlvbnMuc3luYztcbiAgICByZXR1cm4gX3RoaXM7XG4gIH1cblxuICB2YXIgX3Byb3RvID0gU3Bhbi5wcm90b3R5cGU7XG5cbiAgX3Byb3RvLmVuZCA9IGZ1bmN0aW9uIGVuZChlbmRUaW1lLCBkYXRhKSB7XG4gICAgX1NwYW5CYXNlLnByb3RvdHlwZS5lbmQuY2FsbCh0aGlzLCBlbmRUaW1lKTtcblxuICAgIGFkZFNwYW5Db250ZXh0KHRoaXMsIGRhdGEpO1xuICB9O1xuXG4gIHJldHVybiBTcGFuO1xufShTcGFuQmFzZSk7XG5cbmV4cG9ydCBkZWZhdWx0IFNwYW47IiwiaW1wb3J0IHsgUHJvbWlzZSB9IGZyb20gJy4uL2NvbW1vbi9wb2x5ZmlsbHMnO1xuaW1wb3J0IFRyYW5zYWN0aW9uIGZyb20gJy4vdHJhbnNhY3Rpb24nO1xuaW1wb3J0IHsgUGVyZkVudHJ5UmVjb3JkZXIsIGNhcHR1cmVPYnNlcnZlckVudHJpZXMsIG1ldHJpY3MsIGNyZWF0ZVRvdGFsQmxvY2tpbmdUaW1lU3BhbiB9IGZyb20gJy4vbWV0cmljcy9tZXRyaWNzJztcbmltcG9ydCB7IGV4dGVuZCwgZ2V0RWFybGllc3RTcGFuLCBnZXRMYXRlc3ROb25YSFJTcGFuLCBnZXRMYXRlc3RYSFJTcGFuLCBpc1BlcmZUeXBlU3VwcG9ydGVkLCBnZW5lcmF0ZVJhbmRvbUlkIH0gZnJvbSAnLi4vY29tbW9uL3V0aWxzJztcbmltcG9ydCB7IGNhcHR1cmVOYXZpZ2F0aW9uIH0gZnJvbSAnLi9uYXZpZ2F0aW9uL2NhcHR1cmUtbmF2aWdhdGlvbic7XG5pbXBvcnQgeyBQQUdFX0xPQUQsIE5BTUVfVU5LTk9XTiwgVFJBTlNBQ1RJT05fU1RBUlQsIFRSQU5TQUNUSU9OX0VORCwgVFJBTlNBQ1RJT05fSUdOT1JFLCBURU1QT1JBUllfVFlQRSwgVFJBTlNBQ1RJT05fVFlQRV9PUkRFUiwgTEFSR0VTVF9DT05URU5URlVMX1BBSU5ULCBMT05HX1RBU0ssIFBBSU5ULCBUUlVOQ0FURURfVFlQRSwgRklSU1RfSU5QVVQsIExBWU9VVF9TSElGVCwgU0VTU0lPTl9USU1FT1VULCBQQUdFX0xPQURfREVMQVkgfSBmcm9tICcuLi9jb21tb24vY29uc3RhbnRzJztcbmltcG9ydCB7IGFkZFRyYW5zYWN0aW9uQ29udGV4dCB9IGZyb20gJy4uL2NvbW1vbi9jb250ZXh0JztcbmltcG9ydCB7IF9fREVWX18sIHN0YXRlIH0gZnJvbSAnLi4vc3RhdGUnO1xuaW1wb3J0IHsgc2x1Z2lmeVVybCB9IGZyb20gJy4uL2NvbW1vbi91cmwnO1xuXG52YXIgVHJhbnNhY3Rpb25TZXJ2aWNlID0gZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBUcmFuc2FjdGlvblNlcnZpY2UobG9nZ2VyLCBjb25maWcpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgdGhpcy5fY29uZmlnID0gY29uZmlnO1xuICAgIHRoaXMuX2xvZ2dlciA9IGxvZ2dlcjtcbiAgICB0aGlzLmN1cnJlbnRUcmFuc2FjdGlvbiA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLnJlc3BJbnRlcnZhbElkID0gdW5kZWZpbmVkO1xuICAgIHRoaXMucmVjb3JkZXIgPSBuZXcgUGVyZkVudHJ5UmVjb3JkZXIoZnVuY3Rpb24gKGxpc3QpIHtcbiAgICAgIHZhciB0ciA9IF90aGlzLmdldEN1cnJlbnRUcmFuc2FjdGlvbigpO1xuXG4gICAgICBpZiAodHIgJiYgdHIuY2FwdHVyZVRpbWluZ3MpIHtcbiAgICAgICAgdmFyIF90ciRzcGFucztcblxuICAgICAgICB2YXIgaXNIYXJkTmF2aWdhdGlvbiA9IHRyLnR5cGUgPT09IFBBR0VfTE9BRDtcblxuICAgICAgICB2YXIgX2NhcHR1cmVPYnNlcnZlckVudHJpID0gY2FwdHVyZU9ic2VydmVyRW50cmllcyhsaXN0LCB7XG4gICAgICAgICAgaXNIYXJkTmF2aWdhdGlvbjogaXNIYXJkTmF2aWdhdGlvbixcbiAgICAgICAgICB0clN0YXJ0OiBpc0hhcmROYXZpZ2F0aW9uID8gMCA6IHRyLl9zdGFydFxuICAgICAgICB9KSxcbiAgICAgICAgICAgIHNwYW5zID0gX2NhcHR1cmVPYnNlcnZlckVudHJpLnNwYW5zLFxuICAgICAgICAgICAgbWFya3MgPSBfY2FwdHVyZU9ic2VydmVyRW50cmkubWFya3M7XG5cbiAgICAgICAgKF90ciRzcGFucyA9IHRyLnNwYW5zKS5wdXNoLmFwcGx5KF90ciRzcGFucywgc3BhbnMpO1xuXG4gICAgICAgIHRyLmFkZE1hcmtzKHtcbiAgICAgICAgICBhZ2VudDogbWFya3NcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICB2YXIgX3Byb3RvID0gVHJhbnNhY3Rpb25TZXJ2aWNlLnByb3RvdHlwZTtcblxuICBfcHJvdG8uY3JlYXRlQ3VycmVudFRyYW5zYWN0aW9uID0gZnVuY3Rpb24gY3JlYXRlQ3VycmVudFRyYW5zYWN0aW9uKG5hbWUsIHR5cGUsIG9wdGlvbnMpIHtcbiAgICB2YXIgdHIgPSBuZXcgVHJhbnNhY3Rpb24obmFtZSwgdHlwZSwgb3B0aW9ucyk7XG4gICAgdGhpcy5jdXJyZW50VHJhbnNhY3Rpb24gPSB0cjtcbiAgICByZXR1cm4gdHI7XG4gIH07XG5cbiAgX3Byb3RvLmdldEN1cnJlbnRUcmFuc2FjdGlvbiA9IGZ1bmN0aW9uIGdldEN1cnJlbnRUcmFuc2FjdGlvbigpIHtcbiAgICBpZiAodGhpcy5jdXJyZW50VHJhbnNhY3Rpb24gJiYgIXRoaXMuY3VycmVudFRyYW5zYWN0aW9uLmVuZGVkKSB7XG4gICAgICByZXR1cm4gdGhpcy5jdXJyZW50VHJhbnNhY3Rpb247XG4gICAgfVxuICB9O1xuXG4gIF9wcm90by5jcmVhdGVPcHRpb25zID0gZnVuY3Rpb24gY3JlYXRlT3B0aW9ucyhvcHRpb25zKSB7XG4gICAgdmFyIGNvbmZpZyA9IHRoaXMuX2NvbmZpZy5jb25maWc7XG4gICAgdmFyIHByZXNldE9wdGlvbnMgPSB7XG4gICAgICB0cmFuc2FjdGlvblNhbXBsZVJhdGU6IGNvbmZpZy50cmFuc2FjdGlvblNhbXBsZVJhdGVcbiAgICB9O1xuICAgIHZhciBwZXJmT3B0aW9ucyA9IGV4dGVuZChwcmVzZXRPcHRpb25zLCBvcHRpb25zKTtcblxuICAgIGlmIChwZXJmT3B0aW9ucy5tYW5hZ2VkKSB7XG4gICAgICBwZXJmT3B0aW9ucyA9IGV4dGVuZCh7XG4gICAgICAgIHBhZ2VMb2FkVHJhY2VJZDogY29uZmlnLnBhZ2VMb2FkVHJhY2VJZCxcbiAgICAgICAgcGFnZUxvYWRTYW1wbGVkOiBjb25maWcucGFnZUxvYWRTYW1wbGVkLFxuICAgICAgICBwYWdlTG9hZFNwYW5JZDogY29uZmlnLnBhZ2VMb2FkU3BhbklkLFxuICAgICAgICBwYWdlTG9hZFRyYW5zYWN0aW9uTmFtZTogY29uZmlnLnBhZ2VMb2FkVHJhbnNhY3Rpb25OYW1lXG4gICAgICB9LCBwZXJmT3B0aW9ucyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHBlcmZPcHRpb25zO1xuICB9O1xuXG4gIF9wcm90by5zdGFydE1hbmFnZWRUcmFuc2FjdGlvbiA9IGZ1bmN0aW9uIHN0YXJ0TWFuYWdlZFRyYW5zYWN0aW9uKG5hbWUsIHR5cGUsIHBlcmZPcHRpb25zKSB7XG4gICAgdmFyIHRyID0gdGhpcy5nZXRDdXJyZW50VHJhbnNhY3Rpb24oKTtcbiAgICB2YXIgaXNSZWRlZmluZWQgPSBmYWxzZTtcblxuICAgIGlmICghdHIpIHtcbiAgICAgIHRyID0gdGhpcy5jcmVhdGVDdXJyZW50VHJhbnNhY3Rpb24obmFtZSwgdHlwZSwgcGVyZk9wdGlvbnMpO1xuICAgIH0gZWxzZSBpZiAodHIuY2FuUmV1c2UoKSAmJiBwZXJmT3B0aW9ucy5jYW5SZXVzZSkge1xuICAgICAgdmFyIHJlZGVmaW5lVHlwZSA9IHRyLnR5cGU7XG4gICAgICB2YXIgY3VycmVudFR5cGVPcmRlciA9IFRSQU5TQUNUSU9OX1RZUEVfT1JERVIuaW5kZXhPZih0ci50eXBlKTtcbiAgICAgIHZhciByZWRlZmluZVR5cGVPcmRlciA9IFRSQU5TQUNUSU9OX1RZUEVfT1JERVIuaW5kZXhPZih0eXBlKTtcblxuICAgICAgaWYgKGN1cnJlbnRUeXBlT3JkZXIgPj0gMCAmJiByZWRlZmluZVR5cGVPcmRlciA8IGN1cnJlbnRUeXBlT3JkZXIpIHtcbiAgICAgICAgcmVkZWZpbmVUeXBlID0gdHlwZTtcbiAgICAgIH1cblxuICAgICAgaWYgKF9fREVWX18pIHtcbiAgICAgICAgdGhpcy5fbG9nZ2VyLmRlYnVnKFwicmVkZWZpbmluZyB0cmFuc2FjdGlvbihcIiArIHRyLmlkICsgXCIsIFwiICsgdHIubmFtZSArIFwiLCBcIiArIHRyLnR5cGUgKyBcIilcIiwgJ3RvJywgXCIoXCIgKyAobmFtZSB8fCB0ci5uYW1lKSArIFwiLCBcIiArIHJlZGVmaW5lVHlwZSArIFwiKVwiLCB0cik7XG4gICAgICB9XG5cbiAgICAgIHRyLnJlZGVmaW5lKG5hbWUsIHJlZGVmaW5lVHlwZSwgcGVyZk9wdGlvbnMpO1xuICAgICAgaXNSZWRlZmluZWQgPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoX19ERVZfXykge1xuICAgICAgICB0aGlzLl9sb2dnZXIuZGVidWcoXCJlbmRpbmcgcHJldmlvdXMgdHJhbnNhY3Rpb24oXCIgKyB0ci5pZCArIFwiLCBcIiArIHRyLm5hbWUgKyBcIilcIiwgdHIpO1xuICAgICAgfVxuXG4gICAgICB0ci5lbmQoKTtcbiAgICAgIHRyID0gdGhpcy5jcmVhdGVDdXJyZW50VHJhbnNhY3Rpb24obmFtZSwgdHlwZSwgcGVyZk9wdGlvbnMpO1xuICAgIH1cblxuICAgIGlmICh0ci50eXBlID09PSBQQUdFX0xPQUQpIHtcbiAgICAgIGlmICghaXNSZWRlZmluZWQpIHtcbiAgICAgICAgdGhpcy5yZWNvcmRlci5zdGFydChMQVJHRVNUX0NPTlRFTlRGVUxfUEFJTlQpO1xuICAgICAgICB0aGlzLnJlY29yZGVyLnN0YXJ0KFBBSU5UKTtcbiAgICAgICAgdGhpcy5yZWNvcmRlci5zdGFydChGSVJTVF9JTlBVVCk7XG4gICAgICAgIHRoaXMucmVjb3JkZXIuc3RhcnQoTEFZT1VUX1NISUZUKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHBlcmZPcHRpb25zLnBhZ2VMb2FkVHJhY2VJZCkge1xuICAgICAgICB0ci50cmFjZUlkID0gcGVyZk9wdGlvbnMucGFnZUxvYWRUcmFjZUlkO1xuICAgICAgfVxuXG4gICAgICBpZiAocGVyZk9wdGlvbnMucGFnZUxvYWRTYW1wbGVkKSB7XG4gICAgICAgIHRyLnNhbXBsZWQgPSBwZXJmT3B0aW9ucy5wYWdlTG9hZFNhbXBsZWQ7XG4gICAgICB9XG5cbiAgICAgIGlmICh0ci5uYW1lID09PSBOQU1FX1VOS05PV04gJiYgcGVyZk9wdGlvbnMucGFnZUxvYWRUcmFuc2FjdGlvbk5hbWUpIHtcbiAgICAgICAgdHIubmFtZSA9IHBlcmZPcHRpb25zLnBhZ2VMb2FkVHJhbnNhY3Rpb25OYW1lO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghaXNSZWRlZmluZWQgJiYgdGhpcy5fY29uZmlnLmdldCgnbW9uaXRvckxvbmd0YXNrcycpKSB7XG4gICAgICB0aGlzLnJlY29yZGVyLnN0YXJ0KExPTkdfVEFTSyk7XG4gICAgfVxuXG4gICAgaWYgKHRyLnNhbXBsZWQpIHtcbiAgICAgIHRyLmNhcHR1cmVUaW1pbmdzID0gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHI7XG4gIH07XG5cbiAgX3Byb3RvLnN0YXJ0VHJhbnNhY3Rpb24gPSBmdW5jdGlvbiBzdGFydFRyYW5zYWN0aW9uKG5hbWUsIHR5cGUsIG9wdGlvbnMpIHtcbiAgICB2YXIgX3RoaXMyID0gdGhpcztcblxuICAgIHZhciBwZXJmT3B0aW9ucyA9IHRoaXMuY3JlYXRlT3B0aW9ucyhvcHRpb25zKTtcbiAgICB2YXIgdHI7XG4gICAgdmFyIGZpcmVPbnN0YXJ0SG9vayA9IHRydWU7XG5cbiAgICBpZiAocGVyZk9wdGlvbnMubWFuYWdlZCkge1xuICAgICAgdmFyIGN1cnJlbnQgPSB0aGlzLmN1cnJlbnRUcmFuc2FjdGlvbjtcbiAgICAgIHRyID0gdGhpcy5zdGFydE1hbmFnZWRUcmFuc2FjdGlvbihuYW1lLCB0eXBlLCBwZXJmT3B0aW9ucyk7XG5cbiAgICAgIGlmIChjdXJyZW50ID09PSB0cikge1xuICAgICAgICBmaXJlT25zdGFydEhvb2sgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdHIgPSBuZXcgVHJhbnNhY3Rpb24obmFtZSwgdHlwZSwgcGVyZk9wdGlvbnMpO1xuICAgIH1cblxuICAgIHRyLm9uRW5kID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIF90aGlzMi5oYW5kbGVUcmFuc2FjdGlvbkVuZCh0cik7XG4gICAgfTtcblxuICAgIGlmIChmaXJlT25zdGFydEhvb2spIHtcbiAgICAgIGlmIChfX0RFVl9fKSB7XG4gICAgICAgIHRoaXMuX2xvZ2dlci5kZWJ1ZyhcInN0YXJ0VHJhbnNhY3Rpb24oXCIgKyB0ci5pZCArIFwiLCBcIiArIHRyLm5hbWUgKyBcIiwgXCIgKyB0ci50eXBlICsgXCIpXCIpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9jb25maWcuZXZlbnRzLnNlbmQoVFJBTlNBQ1RJT05fU1RBUlQsIFt0cl0pO1xuICAgIH1cblxuICAgIHJldHVybiB0cjtcbiAgfTtcblxuICBfcHJvdG8uaGFuZGxlVHJhbnNhY3Rpb25FbmQgPSBmdW5jdGlvbiBoYW5kbGVUcmFuc2FjdGlvbkVuZCh0cikge1xuICAgIHZhciBfdGhpczMgPSB0aGlzO1xuXG4gICAgdGhpcy5yZWNvcmRlci5zdG9wKCk7XG4gICAgdmFyIGN1cnJlbnRVcmwgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgbmFtZSA9IHRyLm5hbWUsXG4gICAgICAgICAgdHlwZSA9IHRyLnR5cGU7XG4gICAgICB2YXIgbGFzdEhpZGRlblN0YXJ0ID0gc3RhdGUubGFzdEhpZGRlblN0YXJ0O1xuXG4gICAgICBpZiAobGFzdEhpZGRlblN0YXJ0ID49IHRyLl9zdGFydCkge1xuICAgICAgICBpZiAoX19ERVZfXykge1xuICAgICAgICAgIF90aGlzMy5fbG9nZ2VyLmRlYnVnKFwidHJhbnNhY3Rpb24oXCIgKyB0ci5pZCArIFwiLCBcIiArIG5hbWUgKyBcIiwgXCIgKyB0eXBlICsgXCIpIHdhcyBkaXNjYXJkZWQhIFRoZSBwYWdlIHdhcyBoaWRkZW4gZHVyaW5nIHRoZSB0cmFuc2FjdGlvbiFcIik7XG4gICAgICAgIH1cblxuICAgICAgICBfdGhpczMuX2NvbmZpZy5kaXNwYXRjaEV2ZW50KFRSQU5TQUNUSU9OX0lHTk9SRSk7XG5cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoX3RoaXMzLnNob3VsZElnbm9yZVRyYW5zYWN0aW9uKG5hbWUpIHx8IHR5cGUgPT09IFRFTVBPUkFSWV9UWVBFKSB7XG4gICAgICAgIGlmIChfX0RFVl9fKSB7XG4gICAgICAgICAgX3RoaXMzLl9sb2dnZXIuZGVidWcoXCJ0cmFuc2FjdGlvbihcIiArIHRyLmlkICsgXCIsIFwiICsgbmFtZSArIFwiLCBcIiArIHR5cGUgKyBcIikgaXMgaWdub3JlZFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIF90aGlzMy5fY29uZmlnLmRpc3BhdGNoRXZlbnQoVFJBTlNBQ1RJT05fSUdOT1JFKTtcblxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlID09PSBQQUdFX0xPQUQpIHtcbiAgICAgICAgdmFyIHBhZ2VMb2FkVHJhbnNhY3Rpb25OYW1lID0gX3RoaXMzLl9jb25maWcuZ2V0KCdwYWdlTG9hZFRyYW5zYWN0aW9uTmFtZScpO1xuXG4gICAgICAgIGlmIChuYW1lID09PSBOQU1FX1VOS05PV04gJiYgcGFnZUxvYWRUcmFuc2FjdGlvbk5hbWUpIHtcbiAgICAgICAgICB0ci5uYW1lID0gcGFnZUxvYWRUcmFuc2FjdGlvbk5hbWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHIuY2FwdHVyZVRpbWluZ3MpIHtcbiAgICAgICAgICB2YXIgY2xzID0gbWV0cmljcy5jbHMsXG4gICAgICAgICAgICAgIGZpZCA9IG1ldHJpY3MuZmlkLFxuICAgICAgICAgICAgICB0YnQgPSBtZXRyaWNzLnRidCxcbiAgICAgICAgICAgICAgbG9uZ3Rhc2sgPSBtZXRyaWNzLmxvbmd0YXNrO1xuXG4gICAgICAgICAgaWYgKHRidC5kdXJhdGlvbiA+IDApIHtcbiAgICAgICAgICAgIHRyLnNwYW5zLnB1c2goY3JlYXRlVG90YWxCbG9ja2luZ1RpbWVTcGFuKHRidCkpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRyLmV4cGVyaWVuY2UgPSB7fTtcblxuICAgICAgICAgIGlmIChpc1BlcmZUeXBlU3VwcG9ydGVkKExPTkdfVEFTSykpIHtcbiAgICAgICAgICAgIHRyLmV4cGVyaWVuY2UudGJ0ID0gdGJ0LmR1cmF0aW9uO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChpc1BlcmZUeXBlU3VwcG9ydGVkKExBWU9VVF9TSElGVCkpIHtcbiAgICAgICAgICAgIHRyLmV4cGVyaWVuY2UuY2xzID0gY2xzLnNjb3JlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChmaWQgPiAwKSB7XG4gICAgICAgICAgICB0ci5leHBlcmllbmNlLmZpZCA9IGZpZDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAobG9uZ3Rhc2suY291bnQgPiAwKSB7XG4gICAgICAgICAgICB0ci5leHBlcmllbmNlLmxvbmd0YXNrID0ge1xuICAgICAgICAgICAgICBjb3VudDogbG9uZ3Rhc2suY291bnQsXG4gICAgICAgICAgICAgIHN1bTogbG9uZ3Rhc2suZHVyYXRpb24sXG4gICAgICAgICAgICAgIG1heDogbG9uZ3Rhc2subWF4XG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIF90aGlzMy5zZXRTZXNzaW9uKHRyKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRyLm5hbWUgPT09IE5BTUVfVU5LTk9XTikge1xuICAgICAgICB0ci5uYW1lID0gc2x1Z2lmeVVybChjdXJyZW50VXJsKTtcbiAgICAgIH1cblxuICAgICAgY2FwdHVyZU5hdmlnYXRpb24odHIpO1xuXG4gICAgICBfdGhpczMuYWRqdXN0VHJhbnNhY3Rpb25UaW1lKHRyKTtcblxuICAgICAgdmFyIGJyZWFrZG93bk1ldHJpY3MgPSBfdGhpczMuX2NvbmZpZy5nZXQoJ2JyZWFrZG93bk1ldHJpY3MnKTtcblxuICAgICAgaWYgKGJyZWFrZG93bk1ldHJpY3MpIHtcbiAgICAgICAgdHIuY2FwdHVyZUJyZWFrZG93bigpO1xuICAgICAgfVxuXG4gICAgICB2YXIgY29uZmlnQ29udGV4dCA9IF90aGlzMy5fY29uZmlnLmdldCgnY29udGV4dCcpO1xuXG4gICAgICBhZGRUcmFuc2FjdGlvbkNvbnRleHQodHIsIGNvbmZpZ0NvbnRleHQpO1xuXG4gICAgICBfdGhpczMuX2NvbmZpZy5ldmVudHMuc2VuZChUUkFOU0FDVElPTl9FTkQsIFt0cl0pO1xuXG4gICAgICBpZiAoX19ERVZfXykge1xuICAgICAgICBfdGhpczMuX2xvZ2dlci5kZWJ1ZyhcImVuZCB0cmFuc2FjdGlvbihcIiArIHRyLmlkICsgXCIsIFwiICsgdHIubmFtZSArIFwiLCBcIiArIHRyLnR5cGUgKyBcIilcIiwgdHIpO1xuICAgICAgfVxuICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgIGlmIChfX0RFVl9fKSB7XG4gICAgICAgIF90aGlzMy5fbG9nZ2VyLmRlYnVnKFwiZXJyb3IgZW5kaW5nIHRyYW5zYWN0aW9uKFwiICsgdHIuaWQgKyBcIiwgXCIgKyB0ci5uYW1lICsgXCIpXCIsIGVycik7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgX3Byb3RvLnNldFNlc3Npb24gPSBmdW5jdGlvbiBzZXRTZXNzaW9uKHRyKSB7XG4gICAgdmFyIHNlc3Npb24gPSB0aGlzLl9jb25maWcuZ2V0KCdzZXNzaW9uJyk7XG5cbiAgICBpZiAoc2Vzc2lvbikge1xuICAgICAgaWYgKHR5cGVvZiBzZXNzaW9uID09ICdib29sZWFuJykge1xuICAgICAgICB0ci5zZXNzaW9uID0ge1xuICAgICAgICAgIGlkOiBnZW5lcmF0ZVJhbmRvbUlkKDE2KSxcbiAgICAgICAgICBzZXF1ZW5jZTogMVxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHNlc3Npb24udGltZXN0YW1wICYmIERhdGUubm93KCkgLSBzZXNzaW9uLnRpbWVzdGFtcCA+IFNFU1NJT05fVElNRU9VVCkge1xuICAgICAgICAgIHRyLnNlc3Npb24gPSB7XG4gICAgICAgICAgICBpZDogZ2VuZXJhdGVSYW5kb21JZCgxNiksXG4gICAgICAgICAgICBzZXF1ZW5jZTogMVxuICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdHIuc2Vzc2lvbiA9IHtcbiAgICAgICAgICAgIGlkOiBzZXNzaW9uLmlkLFxuICAgICAgICAgICAgc2VxdWVuY2U6IHNlc3Npb24uc2VxdWVuY2UgPyBzZXNzaW9uLnNlcXVlbmNlICsgMSA6IDFcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHZhciBzZXNzaW9uQ29uZmlnID0ge1xuICAgICAgICBzZXNzaW9uOiB7XG4gICAgICAgICAgaWQ6IHRyLnNlc3Npb24uaWQsXG4gICAgICAgICAgc2VxdWVuY2U6IHRyLnNlc3Npb24uc2VxdWVuY2UsXG4gICAgICAgICAgdGltZXN0YW1wOiBEYXRlLm5vdygpXG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIHRoaXMuX2NvbmZpZy5zZXRDb25maWcoc2Vzc2lvbkNvbmZpZyk7XG5cbiAgICAgIHRoaXMuX2NvbmZpZy5zZXRMb2NhbENvbmZpZyhzZXNzaW9uQ29uZmlnLCB0cnVlKTtcbiAgICB9XG4gIH07XG5cbiAgX3Byb3RvLmFkanVzdFRyYW5zYWN0aW9uVGltZSA9IGZ1bmN0aW9uIGFkanVzdFRyYW5zYWN0aW9uVGltZSh0cmFuc2FjdGlvbikge1xuICAgIHZhciBzcGFucyA9IHRyYW5zYWN0aW9uLnNwYW5zO1xuICAgIHZhciBlYXJsaWVzdFNwYW4gPSBnZXRFYXJsaWVzdFNwYW4oc3BhbnMpO1xuXG4gICAgaWYgKGVhcmxpZXN0U3BhbiAmJiBlYXJsaWVzdFNwYW4uX3N0YXJ0IDwgdHJhbnNhY3Rpb24uX3N0YXJ0KSB7XG4gICAgICB0cmFuc2FjdGlvbi5fc3RhcnQgPSBlYXJsaWVzdFNwYW4uX3N0YXJ0O1xuICAgIH1cblxuICAgIHZhciBsYXRlc3RTcGFuID0gZ2V0TGF0ZXN0Tm9uWEhSU3BhbihzcGFucykgfHwge307XG4gICAgdmFyIGxhdGVzdFNwYW5FbmQgPSBsYXRlc3RTcGFuLl9lbmQgfHwgMDtcblxuICAgIGlmICh0cmFuc2FjdGlvbi50eXBlID09PSBQQUdFX0xPQUQpIHtcbiAgICAgIHZhciB0cmFuc2FjdGlvbkVuZFdpdGhvdXREZWxheSA9IHRyYW5zYWN0aW9uLl9lbmQgLSBQQUdFX0xPQURfREVMQVk7XG4gICAgICB2YXIgbGNwID0gbWV0cmljcy5sY3AgfHwgMDtcbiAgICAgIHZhciBsYXRlc3RYSFJTcGFuID0gZ2V0TGF0ZXN0WEhSU3BhbihzcGFucykgfHwge307XG4gICAgICB2YXIgbGF0ZXN0WEhSU3BhbkVuZCA9IGxhdGVzdFhIUlNwYW4uX2VuZCB8fCAwO1xuICAgICAgdHJhbnNhY3Rpb24uX2VuZCA9IE1hdGgubWF4KGxhdGVzdFNwYW5FbmQsIGxhdGVzdFhIUlNwYW5FbmQsIGxjcCwgdHJhbnNhY3Rpb25FbmRXaXRob3V0RGVsYXkpO1xuICAgIH0gZWxzZSBpZiAobGF0ZXN0U3BhbkVuZCA+IHRyYW5zYWN0aW9uLl9lbmQpIHtcbiAgICAgIHRyYW5zYWN0aW9uLl9lbmQgPSBsYXRlc3RTcGFuRW5kO1xuICAgIH1cblxuICAgIHRoaXMudHJ1bmNhdGVTcGFucyhzcGFucywgdHJhbnNhY3Rpb24uX2VuZCk7XG4gIH07XG5cbiAgX3Byb3RvLnRydW5jYXRlU3BhbnMgPSBmdW5jdGlvbiB0cnVuY2F0ZVNwYW5zKHNwYW5zLCB0cmFuc2FjdGlvbkVuZCkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3BhbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBzcGFuID0gc3BhbnNbaV07XG5cbiAgICAgIGlmIChzcGFuLl9lbmQgPiB0cmFuc2FjdGlvbkVuZCkge1xuICAgICAgICBzcGFuLl9lbmQgPSB0cmFuc2FjdGlvbkVuZDtcbiAgICAgICAgc3Bhbi50eXBlICs9IFRSVU5DQVRFRF9UWVBFO1xuICAgICAgfVxuXG4gICAgICBpZiAoc3Bhbi5fc3RhcnQgPiB0cmFuc2FjdGlvbkVuZCkge1xuICAgICAgICBzcGFuLl9zdGFydCA9IHRyYW5zYWN0aW9uRW5kO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBfcHJvdG8uc2hvdWxkSWdub3JlVHJhbnNhY3Rpb24gPSBmdW5jdGlvbiBzaG91bGRJZ25vcmVUcmFuc2FjdGlvbih0cmFuc2FjdGlvbk5hbWUpIHtcbiAgICB2YXIgaWdub3JlTGlzdCA9IHRoaXMuX2NvbmZpZy5nZXQoJ2lnbm9yZVRyYW5zYWN0aW9ucycpO1xuXG4gICAgaWYgKGlnbm9yZUxpc3QgJiYgaWdub3JlTGlzdC5sZW5ndGgpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaWdub3JlTGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgZWxlbWVudCA9IGlnbm9yZUxpc3RbaV07XG5cbiAgICAgICAgaWYgKHR5cGVvZiBlbGVtZW50LnRlc3QgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICBpZiAoZWxlbWVudC50ZXN0KHRyYW5zYWN0aW9uTmFtZSkpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50ID09PSB0cmFuc2FjdGlvbk5hbWUpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICBfcHJvdG8uc3RhcnRTcGFuID0gZnVuY3Rpb24gc3RhcnRTcGFuKG5hbWUsIHR5cGUsIG9wdGlvbnMpIHtcbiAgICB2YXIgdHIgPSB0aGlzLmdldEN1cnJlbnRUcmFuc2FjdGlvbigpO1xuXG4gICAgaWYgKCF0cikge1xuICAgICAgdHIgPSB0aGlzLmNyZWF0ZUN1cnJlbnRUcmFuc2FjdGlvbih1bmRlZmluZWQsIFRFTVBPUkFSWV9UWVBFLCB0aGlzLmNyZWF0ZU9wdGlvbnMoe1xuICAgICAgICBjYW5SZXVzZTogdHJ1ZSxcbiAgICAgICAgbWFuYWdlZDogdHJ1ZVxuICAgICAgfSkpO1xuICAgIH1cblxuICAgIHZhciBzcGFuID0gdHIuc3RhcnRTcGFuKG5hbWUsIHR5cGUsIG9wdGlvbnMpO1xuXG4gICAgaWYgKF9fREVWX18pIHtcbiAgICAgIHRoaXMuX2xvZ2dlci5kZWJ1ZyhcInN0YXJ0U3BhbihcIiArIG5hbWUgKyBcIiwgXCIgKyBzcGFuLnR5cGUgKyBcIilcIiwgXCJvbiB0cmFuc2FjdGlvbihcIiArIHRyLmlkICsgXCIsIFwiICsgdHIubmFtZSArIFwiKVwiKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc3BhbjtcbiAgfTtcblxuICBfcHJvdG8uZW5kU3BhbiA9IGZ1bmN0aW9uIGVuZFNwYW4oc3BhbiwgY29udGV4dCkge1xuICAgIGlmICghc3Bhbikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChfX0RFVl9fKSB7XG4gICAgICB2YXIgdHIgPSB0aGlzLmdldEN1cnJlbnRUcmFuc2FjdGlvbigpO1xuICAgICAgdHIgJiYgdGhpcy5fbG9nZ2VyLmRlYnVnKFwiZW5kU3BhbihcIiArIHNwYW4ubmFtZSArIFwiLCBcIiArIHNwYW4udHlwZSArIFwiKVwiLCBcIm9uIHRyYW5zYWN0aW9uKFwiICsgdHIuaWQgKyBcIiwgXCIgKyB0ci5uYW1lICsgXCIpXCIpO1xuICAgIH1cblxuICAgIHNwYW4uZW5kKG51bGwsIGNvbnRleHQpO1xuICB9O1xuXG4gIHJldHVybiBUcmFuc2FjdGlvblNlcnZpY2U7XG59KCk7XG5cbmV4cG9ydCBkZWZhdWx0IFRyYW5zYWN0aW9uU2VydmljZTsiLCJmdW5jdGlvbiBfaW5oZXJpdHNMb29zZShzdWJDbGFzcywgc3VwZXJDbGFzcykgeyBzdWJDbGFzcy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ2xhc3MucHJvdG90eXBlKTsgc3ViQ2xhc3MucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gc3ViQ2xhc3M7IF9zZXRQcm90b3R5cGVPZihzdWJDbGFzcywgc3VwZXJDbGFzcyk7IH1cblxuZnVuY3Rpb24gX3NldFByb3RvdHlwZU9mKG8sIHApIHsgX3NldFByb3RvdHlwZU9mID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8IGZ1bmN0aW9uIF9zZXRQcm90b3R5cGVPZihvLCBwKSB7IG8uX19wcm90b19fID0gcDsgcmV0dXJuIG87IH07IHJldHVybiBfc2V0UHJvdG90eXBlT2YobywgcCk7IH1cblxuaW1wb3J0IFNwYW4gZnJvbSAnLi9zcGFuJztcbmltcG9ydCBTcGFuQmFzZSBmcm9tICcuL3NwYW4tYmFzZSc7XG5pbXBvcnQgeyBnZW5lcmF0ZVJhbmRvbUlkLCBtZXJnZSwgbm93LCBnZXRUaW1lLCBleHRlbmQsIHJlbW92ZUludmFsaWRDaGFycyB9IGZyb20gJy4uL2NvbW1vbi91dGlscyc7XG5pbXBvcnQgeyBSRVVTQUJJTElUWV9USFJFU0hPTEQsIFRSVU5DQVRFRF9UWVBFIH0gZnJvbSAnLi4vY29tbW9uL2NvbnN0YW50cyc7XG5pbXBvcnQgeyBjYXB0dXJlQnJlYWtkb3duIGFzIF9jYXB0dXJlQnJlYWtkb3duIH0gZnJvbSAnLi9icmVha2Rvd24nO1xuXG52YXIgVHJhbnNhY3Rpb24gPSBmdW5jdGlvbiAoX1NwYW5CYXNlKSB7XG4gIF9pbmhlcml0c0xvb3NlKFRyYW5zYWN0aW9uLCBfU3BhbkJhc2UpO1xuXG4gIGZ1bmN0aW9uIFRyYW5zYWN0aW9uKG5hbWUsIHR5cGUsIG9wdGlvbnMpIHtcbiAgICB2YXIgX3RoaXM7XG5cbiAgICBfdGhpcyA9IF9TcGFuQmFzZS5jYWxsKHRoaXMsIG5hbWUsIHR5cGUsIG9wdGlvbnMpIHx8IHRoaXM7XG4gICAgX3RoaXMudHJhY2VJZCA9IGdlbmVyYXRlUmFuZG9tSWQoKTtcbiAgICBfdGhpcy5tYXJrcyA9IHVuZGVmaW5lZDtcbiAgICBfdGhpcy5zcGFucyA9IFtdO1xuICAgIF90aGlzLl9hY3RpdmVTcGFucyA9IHt9O1xuICAgIF90aGlzLl9hY3RpdmVUYXNrcyA9IG5ldyBTZXQoKTtcbiAgICBfdGhpcy5ibG9ja2VkID0gZmFsc2U7XG4gICAgX3RoaXMuY2FwdHVyZVRpbWluZ3MgPSBmYWxzZTtcbiAgICBfdGhpcy5icmVha2Rvd25UaW1pbmdzID0gW107XG4gICAgX3RoaXMuc2FtcGxlUmF0ZSA9IF90aGlzLm9wdGlvbnMudHJhbnNhY3Rpb25TYW1wbGVSYXRlO1xuICAgIF90aGlzLnNhbXBsZWQgPSBNYXRoLnJhbmRvbSgpIDw9IF90aGlzLnNhbXBsZVJhdGU7XG4gICAgcmV0dXJuIF90aGlzO1xuICB9XG5cbiAgdmFyIF9wcm90byA9IFRyYW5zYWN0aW9uLnByb3RvdHlwZTtcblxuICBfcHJvdG8uYWRkTWFya3MgPSBmdW5jdGlvbiBhZGRNYXJrcyhvYmopIHtcbiAgICB0aGlzLm1hcmtzID0gbWVyZ2UodGhpcy5tYXJrcyB8fCB7fSwgb2JqKTtcbiAgfTtcblxuICBfcHJvdG8ubWFyayA9IGZ1bmN0aW9uIG1hcmsoa2V5KSB7XG4gICAgdmFyIHNrZXkgPSByZW1vdmVJbnZhbGlkQ2hhcnMoa2V5KTtcblxuICAgIHZhciBtYXJrVGltZSA9IG5vdygpIC0gdGhpcy5fc3RhcnQ7XG5cbiAgICB2YXIgY3VzdG9tID0ge307XG4gICAgY3VzdG9tW3NrZXldID0gbWFya1RpbWU7XG4gICAgdGhpcy5hZGRNYXJrcyh7XG4gICAgICBjdXN0b206IGN1c3RvbVxuICAgIH0pO1xuICB9O1xuXG4gIF9wcm90by5jYW5SZXVzZSA9IGZ1bmN0aW9uIGNhblJldXNlKCkge1xuICAgIHZhciB0aHJlc2hvbGQgPSB0aGlzLm9wdGlvbnMucmV1c2VUaHJlc2hvbGQgfHwgUkVVU0FCSUxJVFlfVEhSRVNIT0xEO1xuICAgIHJldHVybiAhIXRoaXMub3B0aW9ucy5jYW5SZXVzZSAmJiAhdGhpcy5lbmRlZCAmJiBub3coKSAtIHRoaXMuX3N0YXJ0IDwgdGhyZXNob2xkO1xuICB9O1xuXG4gIF9wcm90by5yZWRlZmluZSA9IGZ1bmN0aW9uIHJlZGVmaW5lKG5hbWUsIHR5cGUsIG9wdGlvbnMpIHtcbiAgICBpZiAobmFtZSkge1xuICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICB9XG5cbiAgICBpZiAodHlwZSkge1xuICAgICAgdGhpcy50eXBlID0gdHlwZTtcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucykge1xuICAgICAgdGhpcy5vcHRpb25zLnJldXNlVGhyZXNob2xkID0gb3B0aW9ucy5yZXVzZVRocmVzaG9sZDtcbiAgICAgIGV4dGVuZCh0aGlzLm9wdGlvbnMsIG9wdGlvbnMpO1xuICAgIH1cbiAgfTtcblxuICBfcHJvdG8uc3RhcnRTcGFuID0gZnVuY3Rpb24gc3RhcnRTcGFuKG5hbWUsIHR5cGUsIG9wdGlvbnMpIHtcbiAgICB2YXIgX3RoaXMyID0gdGhpcztcblxuICAgIGlmICh0aGlzLmVuZGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIG9wdHMgPSBleHRlbmQoe30sIG9wdGlvbnMpO1xuXG4gICAgb3B0cy5vbkVuZCA9IGZ1bmN0aW9uICh0cmMpIHtcbiAgICAgIF90aGlzMi5fb25TcGFuRW5kKHRyYyk7XG4gICAgfTtcblxuICAgIG9wdHMudHJhY2VJZCA9IHRoaXMudHJhY2VJZDtcbiAgICBvcHRzLnNhbXBsZWQgPSB0aGlzLnNhbXBsZWQ7XG4gICAgb3B0cy5zYW1wbGVSYXRlID0gdGhpcy5zYW1wbGVSYXRlO1xuXG4gICAgaWYgKCFvcHRzLnBhcmVudElkKSB7XG4gICAgICBvcHRzLnBhcmVudElkID0gdGhpcy5pZDtcbiAgICB9XG5cbiAgICB2YXIgc3BhbiA9IG5ldyBTcGFuKG5hbWUsIHR5cGUsIG9wdHMpO1xuICAgIHRoaXMuX2FjdGl2ZVNwYW5zW3NwYW4uaWRdID0gc3BhbjtcblxuICAgIGlmIChvcHRzLmJsb2NraW5nKSB7XG4gICAgICB0aGlzLmFkZFRhc2soc3Bhbi5pZCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHNwYW47XG4gIH07XG5cbiAgX3Byb3RvLmlzRmluaXNoZWQgPSBmdW5jdGlvbiBpc0ZpbmlzaGVkKCkge1xuICAgIHJldHVybiAhdGhpcy5ibG9ja2VkICYmIHRoaXMuX2FjdGl2ZVRhc2tzLnNpemUgPT09IDA7XG4gIH07XG5cbiAgX3Byb3RvLmRldGVjdEZpbmlzaCA9IGZ1bmN0aW9uIGRldGVjdEZpbmlzaCgpIHtcbiAgICBpZiAodGhpcy5pc0ZpbmlzaGVkKCkpIHRoaXMuZW5kKCk7XG4gIH07XG5cbiAgX3Byb3RvLmVuZCA9IGZ1bmN0aW9uIGVuZChlbmRUaW1lKSB7XG4gICAgaWYgKHRoaXMuZW5kZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmVuZGVkID0gdHJ1ZTtcbiAgICB0aGlzLl9lbmQgPSBnZXRUaW1lKGVuZFRpbWUpO1xuXG4gICAgZm9yICh2YXIgc2lkIGluIHRoaXMuX2FjdGl2ZVNwYW5zKSB7XG4gICAgICB2YXIgc3BhbiA9IHRoaXMuX2FjdGl2ZVNwYW5zW3NpZF07XG4gICAgICBzcGFuLnR5cGUgPSBzcGFuLnR5cGUgKyBUUlVOQ0FURURfVFlQRTtcbiAgICAgIHNwYW4uZW5kKGVuZFRpbWUpO1xuICAgIH1cblxuICAgIHRoaXMuY2FsbE9uRW5kKCk7XG4gIH07XG5cbiAgX3Byb3RvLmNhcHR1cmVCcmVha2Rvd24gPSBmdW5jdGlvbiBjYXB0dXJlQnJlYWtkb3duKCkge1xuICAgIHRoaXMuYnJlYWtkb3duVGltaW5ncyA9IF9jYXB0dXJlQnJlYWtkb3duKHRoaXMpO1xuICB9O1xuXG4gIF9wcm90by5ibG9jayA9IGZ1bmN0aW9uIGJsb2NrKGZsYWcpIHtcbiAgICB0aGlzLmJsb2NrZWQgPSBmbGFnO1xuXG4gICAgaWYgKCF0aGlzLmJsb2NrZWQpIHtcbiAgICAgIHRoaXMuZGV0ZWN0RmluaXNoKCk7XG4gICAgfVxuICB9O1xuXG4gIF9wcm90by5hZGRUYXNrID0gZnVuY3Rpb24gYWRkVGFzayh0YXNrSWQpIHtcbiAgICBpZiAoIXRhc2tJZCkge1xuICAgICAgdGFza0lkID0gJ3Rhc2stJyArIGdlbmVyYXRlUmFuZG9tSWQoMTYpO1xuICAgIH1cblxuICAgIHRoaXMuX2FjdGl2ZVRhc2tzLmFkZCh0YXNrSWQpO1xuXG4gICAgcmV0dXJuIHRhc2tJZDtcbiAgfTtcblxuICBfcHJvdG8ucmVtb3ZlVGFzayA9IGZ1bmN0aW9uIHJlbW92ZVRhc2sodGFza0lkKSB7XG4gICAgdmFyIGRlbGV0ZWQgPSB0aGlzLl9hY3RpdmVUYXNrcy5kZWxldGUodGFza0lkKTtcblxuICAgIGRlbGV0ZWQgJiYgdGhpcy5kZXRlY3RGaW5pc2goKTtcbiAgfTtcblxuICBfcHJvdG8ucmVzZXRGaWVsZHMgPSBmdW5jdGlvbiByZXNldEZpZWxkcygpIHtcbiAgICB0aGlzLnNwYW5zID0gW107XG4gICAgdGhpcy5zYW1wbGVSYXRlID0gMDtcbiAgfTtcblxuICBfcHJvdG8uX29uU3BhbkVuZCA9IGZ1bmN0aW9uIF9vblNwYW5FbmQoc3Bhbikge1xuICAgIHRoaXMuc3BhbnMucHVzaChzcGFuKTtcbiAgICBkZWxldGUgdGhpcy5fYWN0aXZlU3BhbnNbc3Bhbi5pZF07XG4gICAgdGhpcy5yZW1vdmVUYXNrKHNwYW4uaWQpO1xuICB9O1xuXG4gIF9wcm90by5pc01hbmFnZWQgPSBmdW5jdGlvbiBpc01hbmFnZWQoKSB7XG4gICAgcmV0dXJuICEhdGhpcy5vcHRpb25zLm1hbmFnZWQ7XG4gIH07XG5cbiAgcmV0dXJuIFRyYW5zYWN0aW9uO1xufShTcGFuQmFzZSk7XG5cbmV4cG9ydCBkZWZhdWx0IFRyYW5zYWN0aW9uOyIsInZhciBfX0RFVl9fID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJztcblxudmFyIHN0YXRlID0ge1xuICBib290c3RyYXBUaW1lOiBudWxsLFxuICBsYXN0SGlkZGVuU3RhcnQ6IE51bWJlci5NSU5fU0FGRV9JTlRFR0VSXG59O1xuZXhwb3J0IHsgX19ERVZfXywgc3RhdGUgfTsiLCIvKipcbiAqIE1JVCBMaWNlbnNlXG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE3LXByZXNlbnQsIEVsYXN0aWNzZWFyY2ggQlZcbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gKiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4gKiBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4gKiB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4gKiBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbiAqIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbiAqIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiAqIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuICogRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gKiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gKiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuICogT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuICogVEhFIFNPRlRXQVJFLlxuICpcbiAqL1xuXG5pbXBvcnQge1xuICBnZXRJbnN0cnVtZW50YXRpb25GbGFncyxcbiAgUEFHRV9MT0FEX0RFTEFZLFxuICBQQUdFX0xPQUQsXG4gIEVSUk9SLFxuICBDT05GSUdfU0VSVklDRSxcbiAgTE9HR0lOR19TRVJWSUNFLFxuICBUUkFOU0FDVElPTl9TRVJWSUNFLFxuICBQRVJGT1JNQU5DRV9NT05JVE9SSU5HLFxuICBFUlJPUl9MT0dHSU5HLFxuICBBUE1fU0VSVkVSLFxuICBFVkVOVF9UQVJHRVQsXG4gIENMSUNLLFxuICBvYnNlcnZlUGFnZVZpc2liaWxpdHksXG4gIG9ic2VydmVQYWdlQ2xpY2tzLFxuICBvYnNlcnZlVXNlckludGVyYWN0aW9uc1xufSBmcm9tICdAZWxhc3RpYy9hcG0tcnVtLWNvcmUnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFwbUJhc2Uge1xuICBjb25zdHJ1Y3RvcihzZXJ2aWNlRmFjdG9yeSwgZGlzYWJsZSkge1xuICAgIHRoaXMuX2Rpc2FibGUgPSBkaXNhYmxlXG4gICAgdGhpcy5zZXJ2aWNlRmFjdG9yeSA9IHNlcnZpY2VGYWN0b3J5XG4gICAgdGhpcy5faW5pdGlhbGl6ZWQgPSBmYWxzZVxuICB9XG5cbiAgaXNFbmFibGVkKCkge1xuICAgIHJldHVybiAhdGhpcy5fZGlzYWJsZVxuICB9XG5cbiAgaXNBY3RpdmUoKSB7XG4gICAgY29uc3QgY29uZmlnU2VydmljZSA9IHRoaXMuc2VydmljZUZhY3RvcnkuZ2V0U2VydmljZShDT05GSUdfU0VSVklDRSlcbiAgICByZXR1cm4gdGhpcy5pc0VuYWJsZWQoKSAmJiB0aGlzLl9pbml0aWFsaXplZCAmJiBjb25maWdTZXJ2aWNlLmdldCgnYWN0aXZlJylcbiAgfVxuXG4gIGluaXQoY29uZmlnKSB7XG4gICAgaWYgKHRoaXMuaXNFbmFibGVkKCkgJiYgIXRoaXMuX2luaXRpYWxpemVkKSB7XG4gICAgICB0aGlzLl9pbml0aWFsaXplZCA9IHRydWVcbiAgICAgIGNvbnN0IFtcbiAgICAgICAgY29uZmlnU2VydmljZSxcbiAgICAgICAgbG9nZ2luZ1NlcnZpY2UsXG4gICAgICAgIHRyYW5zYWN0aW9uU2VydmljZVxuICAgICAgXSA9IHRoaXMuc2VydmljZUZhY3RvcnkuZ2V0U2VydmljZShbXG4gICAgICAgIENPTkZJR19TRVJWSUNFLFxuICAgICAgICBMT0dHSU5HX1NFUlZJQ0UsXG4gICAgICAgIFRSQU5TQUNUSU9OX1NFUlZJQ0VcbiAgICAgIF0pXG4gICAgICAvKipcbiAgICAgICAqIFNldCBBZ2VudCB2ZXJzaW9uIHRvIGJlIHNlbnQgYXMgcGFydCBvZiBtZXRhZGF0YSB0byB0aGUgQVBNIFNlcnZlclxuICAgICAgICovXG4gICAgICBjb25maWdTZXJ2aWNlLnNldFZlcnNpb24oJzUuMTYuMScpXG4gICAgICB0aGlzLmNvbmZpZyhjb25maWcpXG4gICAgICAvKipcbiAgICAgICAqIFNldCBsZXZlbCBoZXJlIHRvIGFjY291bnQgZm9yIGJvdGggYWN0aXZlIGFuZCBpbmFjdGl2ZSBjYXNlc1xuICAgICAgICovXG4gICAgICBjb25zdCBsb2dMZXZlbCA9IGNvbmZpZ1NlcnZpY2UuZ2V0KCdsb2dMZXZlbCcpXG4gICAgICBsb2dnaW5nU2VydmljZS5zZXRMZXZlbChsb2dMZXZlbClcbiAgICAgIC8qKlxuICAgICAgICogRGVhY3RpdmUgYWdlbnQgd2hlbiB0aGUgYWN0aXZlIGNvbmZpZyBmbGFnIGlzIHNldCB0byBmYWxzZVxuICAgICAgICovXG4gICAgICBjb25zdCBpc0NvbmZpZ0FjdGl2ZSA9IGNvbmZpZ1NlcnZpY2UuZ2V0KCdhY3RpdmUnKVxuICAgICAgaWYgKGlzQ29uZmlnQWN0aXZlKSB7XG4gICAgICAgIHRoaXMuc2VydmljZUZhY3RvcnkuaW5pdCgpXG5cbiAgICAgICAgY29uc3QgZmxhZ3MgPSBnZXRJbnN0cnVtZW50YXRpb25GbGFncyhcbiAgICAgICAgICBjb25maWdTZXJ2aWNlLmdldCgnaW5zdHJ1bWVudCcpLFxuICAgICAgICAgIGNvbmZpZ1NlcnZpY2UuZ2V0KCdkaXNhYmxlSW5zdHJ1bWVudGF0aW9ucycpXG4gICAgICAgIClcblxuICAgICAgICBjb25zdCBwZXJmb3JtYW5jZU1vbml0b3JpbmcgPSB0aGlzLnNlcnZpY2VGYWN0b3J5LmdldFNlcnZpY2UoXG4gICAgICAgICAgUEVSRk9STUFOQ0VfTU9OSVRPUklOR1xuICAgICAgICApXG4gICAgICAgIHBlcmZvcm1hbmNlTW9uaXRvcmluZy5pbml0KGZsYWdzKVxuXG4gICAgICAgIGlmIChmbGFnc1tFUlJPUl0pIHtcbiAgICAgICAgICBjb25zdCBlcnJvckxvZ2dpbmcgPSB0aGlzLnNlcnZpY2VGYWN0b3J5LmdldFNlcnZpY2UoRVJST1JfTE9HR0lORylcbiAgICAgICAgICBlcnJvckxvZ2dpbmcucmVnaXN0ZXJMaXN0ZW5lcnMoKVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbmZpZ1NlcnZpY2UuZ2V0KCdzZXNzaW9uJykpIHtcbiAgICAgICAgICBsZXQgbG9jYWxDb25maWcgPSBjb25maWdTZXJ2aWNlLmdldExvY2FsQ29uZmlnKClcbiAgICAgICAgICBpZiAobG9jYWxDb25maWcgJiYgbG9jYWxDb25maWcuc2Vzc2lvbikge1xuICAgICAgICAgICAgY29uZmlnU2VydmljZS5zZXRDb25maWcoe1xuICAgICAgICAgICAgICBzZXNzaW9uOiBsb2NhbENvbmZpZy5zZXNzaW9uXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHNlbmRQYWdlTG9hZCA9ICgpID0+XG4gICAgICAgICAgZmxhZ3NbUEFHRV9MT0FEXSAmJiB0aGlzLl9zZW5kUGFnZUxvYWRNZXRyaWNzKClcblxuICAgICAgICBpZiAoY29uZmlnU2VydmljZS5nZXQoJ2NlbnRyYWxDb25maWcnKSkge1xuICAgICAgICAgIC8qKlxuICAgICAgICAgICAqIFdhaXRpbmcgZm9yIHRoZSByZW1vdGUgY29uZmlnIGJlZm9yZSBzZW5kaW5nIHRoZSBwYWdlIGxvYWQgdHJhbnNhY3Rpb25cbiAgICAgICAgICAgKi9cbiAgICAgICAgICB0aGlzLmZldGNoQ2VudHJhbENvbmZpZygpLnRoZW4oc2VuZFBhZ2VMb2FkKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNlbmRQYWdlTG9hZCgpXG4gICAgICAgIH1cblxuICAgICAgICBvYnNlcnZlUGFnZVZpc2liaWxpdHkoY29uZmlnU2VydmljZSwgdHJhbnNhY3Rpb25TZXJ2aWNlKVxuICAgICAgICBpZiAoZmxhZ3NbRVZFTlRfVEFSR0VUXSAmJiBmbGFnc1tDTElDS10pIHtcbiAgICAgICAgICBvYnNlcnZlUGFnZUNsaWNrcyh0cmFuc2FjdGlvblNlcnZpY2UpXG4gICAgICAgIH1cbiAgICAgICAgb2JzZXJ2ZVVzZXJJbnRlcmFjdGlvbnMoKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fZGlzYWJsZSA9IHRydWVcbiAgICAgICAgbG9nZ2luZ1NlcnZpY2Uud2FybignUlVNIGFnZW50IGlzIGluYWN0aXZlJylcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIC8qKlxuICAgKiBgZmV0Y2hDZW50cmFsQ29uZmlnYCByZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHdpbGwgYWx3YXlzIHJlc29sdmVcbiAgICogaWYgdGhlIGludGVybmFsIGNvbmZpZyBmZXRjaCBmYWlscyB0aGUgdGhlIHByb21pc2UgcmVzb2x2ZXMgdG8gYHVuZGVmaW5lZGAgb3RoZXJ3aXNlXG4gICAqIGl0IHJlc29sdmVzIHRvIHRoZSBmZXRjaGVkIGNvbmZpZy5cbiAgICovXG4gIGZldGNoQ2VudHJhbENvbmZpZygpIHtcbiAgICBjb25zdCBbXG4gICAgICBhcG1TZXJ2ZXIsXG4gICAgICBsb2dnaW5nU2VydmljZSxcbiAgICAgIGNvbmZpZ1NlcnZpY2VcbiAgICBdID0gdGhpcy5zZXJ2aWNlRmFjdG9yeS5nZXRTZXJ2aWNlKFtcbiAgICAgIEFQTV9TRVJWRVIsXG4gICAgICBMT0dHSU5HX1NFUlZJQ0UsXG4gICAgICBDT05GSUdfU0VSVklDRVxuICAgIF0pXG5cbiAgICByZXR1cm4gYXBtU2VydmVyXG4gICAgICAuZmV0Y2hDb25maWcoXG4gICAgICAgIGNvbmZpZ1NlcnZpY2UuZ2V0KCdzZXJ2aWNlTmFtZScpLFxuICAgICAgICBjb25maWdTZXJ2aWNlLmdldCgnZW52aXJvbm1lbnQnKVxuICAgICAgKVxuICAgICAgLnRoZW4oY29uZmlnID0+IHtcbiAgICAgICAgdmFyIHRyYW5zYWN0aW9uU2FtcGxlUmF0ZSA9IGNvbmZpZ1sndHJhbnNhY3Rpb25fc2FtcGxlX3JhdGUnXVxuICAgICAgICBpZiAodHJhbnNhY3Rpb25TYW1wbGVSYXRlKSB7XG4gICAgICAgICAgdHJhbnNhY3Rpb25TYW1wbGVSYXRlID0gTnVtYmVyKHRyYW5zYWN0aW9uU2FtcGxlUmF0ZSlcbiAgICAgICAgICBjb25zdCBjb25maWcgPSB7IHRyYW5zYWN0aW9uU2FtcGxlUmF0ZSB9XG4gICAgICAgICAgY29uc3QgeyBpbnZhbGlkIH0gPSBjb25maWdTZXJ2aWNlLnZhbGlkYXRlKGNvbmZpZylcbiAgICAgICAgICBpZiAoaW52YWxpZC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIGNvbmZpZ1NlcnZpY2Uuc2V0Q29uZmlnKGNvbmZpZylcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgeyBrZXksIHZhbHVlLCBhbGxvd2VkIH0gPSBpbnZhbGlkWzBdXG4gICAgICAgICAgICBsb2dnaW5nU2VydmljZS53YXJuKFxuICAgICAgICAgICAgICBgaW52YWxpZCB2YWx1ZSBcIiR7dmFsdWV9XCIgZm9yICR7a2V5fS4gQWxsb3dlZDogJHthbGxvd2VkfS5gXG4gICAgICAgICAgICApXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb25maWdcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgICBsb2dnaW5nU2VydmljZS53YXJuKCdmYWlsZWQgZmV0Y2hpbmcgY29uZmlnOicsIGVycm9yKVxuICAgICAgfSlcbiAgfVxuXG4gIF9zZW5kUGFnZUxvYWRNZXRyaWNzKCkge1xuICAgIC8qKlxuICAgICAqIE5hbWUgb2YgdGhlIHRyYW5zYWN0aW9uIGlzIHNldCBpbiB0cmFuc2FjdGlvbiBzZXJ2aWNlIHRvXG4gICAgICogYXZvaWQgZHVwbGljYXRpbmcgdGhlIGxvZ2ljIGF0IG11bHRpcGxlIHBsYWNlc1xuICAgICAqL1xuICAgIGNvbnN0IHRyID0gdGhpcy5zdGFydFRyYW5zYWN0aW9uKHVuZGVmaW5lZCwgUEFHRV9MT0FELCB7XG4gICAgICBtYW5hZ2VkOiB0cnVlLFxuICAgICAgY2FuUmV1c2U6IHRydWVcbiAgICB9KVxuXG4gICAgaWYgKCF0cikge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgdHIuYWRkVGFzayhQQUdFX0xPQUQpXG4gICAgY29uc3Qgc2VuZFBhZ2VMb2FkTWV0cmljcyA9ICgpID0+IHtcbiAgICAgIC8vIFRoZSByZWFzb25zIG9mIHRoaXMgdGltZW91dCBhcmU6XG4gICAgICAvLyAxLiB0byBtYWtlIHN1cmUgUGVyZm9ybWFuY2VUaW1pbmcubG9hZEV2ZW50RW5kIGhhcyBhIHZhbHVlLlxuICAgICAgLy8gMi4gdG8gbWFrZSBzdXJlIHRoZSBhZ2VudCBpbnRlcmNlcHRzIGFsbCB0aGUgTENQIGVudHJpZXMgdHJpZ2dlcmVkIGJ5IHRoZSBicm93c2VyIChhZGRpbmcgYSBkZWxheSBpbiB0aGUgdGltZW91dCkuXG4gICAgICAvLyBUaGUgYnJvd3NlciBtaWdodCBuZWVkIG1vcmUgdGltZSBhZnRlciB0aGUgcGFnZWxvYWQgZXZlbnQgdG8gcmVuZGVyIG90aGVyIGVsZW1lbnRzIChlLmcuIGltYWdlcykuXG4gICAgICAvLyBUaGF0J3MgaW1wb3J0YW50IGJlY2F1c2UgYSBMQ1AgaXMgb25seSB0cmlnZ2VyZWQgd2hlbiB0aGUgcmVsYXRlZCBlbGVtZW50IGlzIGNvbXBsZXRlbHkgcmVuZGVyZWQuXG4gICAgICAvLyBodHRwczovL3czYy5naXRodWIuaW8vbGFyZ2VzdC1jb250ZW50ZnVsLXBhaW50LyNzZWMtYWRkLWxjcC1lbnRyeVxuICAgICAgc2V0VGltZW91dCgoKSA9PiB0ci5yZW1vdmVUYXNrKFBBR0VfTE9BRCksIFBBR0VfTE9BRF9ERUxBWSlcbiAgICB9XG5cbiAgICBpZiAoZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gJ2NvbXBsZXRlJykge1xuICAgICAgc2VuZFBhZ2VMb2FkTWV0cmljcygpXG4gICAgfSBlbHNlIHtcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgc2VuZFBhZ2VMb2FkTWV0cmljcylcbiAgICB9XG4gIH1cblxuICBvYnNlcnZlKG5hbWUsIGZuKSB7XG4gICAgY29uc3QgY29uZmlnU2VydmljZSA9IHRoaXMuc2VydmljZUZhY3RvcnkuZ2V0U2VydmljZShDT05GSUdfU0VSVklDRSlcbiAgICBjb25maWdTZXJ2aWNlLmV2ZW50cy5vYnNlcnZlKG5hbWUsIGZuKVxuICB9XG5cbiAgLyoqXG4gICAqIFdoZW4gdGhlIHJlcXVpcmVkIGNvbmZpZyBrZXlzIGFyZSBpbnZhbGlkLCB0aGUgYWdlbnQgaXMgZGVhY3RpdmF0ZWQgd2l0aFxuICAgKiBsb2dnaW5nIGVycm9yIHRvIHRoZSBjb25zb2xlXG4gICAqXG4gICAqIHZhbGlkYXRpb24gZXJyb3IgZm9ybWF0XG4gICAqIHtcbiAgICogIG1pc3Npbmc6IFsgJ2tleTEnLCAna2V5MiddLFxuICAgKiAgaW52YWxpZDogW3tcbiAgICogICAga2V5OiAnYScsXG4gICAqICAgIHZhbHVlOiAnYWJjZCcsXG4gICAqICAgIGFsbG93ZWQ6ICdzdHJpbmcnXG4gICAqICB9XSxcbiAgICogIHVua25vd246IFsna2V5MycsICdrZXk0J11cbiAgICogfVxuICAgKi9cbiAgY29uZmlnKGNvbmZpZykge1xuICAgIGNvbnN0IFtjb25maWdTZXJ2aWNlLCBsb2dnaW5nU2VydmljZV0gPSB0aGlzLnNlcnZpY2VGYWN0b3J5LmdldFNlcnZpY2UoW1xuICAgICAgQ09ORklHX1NFUlZJQ0UsXG4gICAgICBMT0dHSU5HX1NFUlZJQ0VcbiAgICBdKVxuICAgIGNvbnN0IHsgbWlzc2luZywgaW52YWxpZCwgdW5rbm93biB9ID0gY29uZmlnU2VydmljZS52YWxpZGF0ZShjb25maWcpXG4gICAgaWYgKHVua25vd24ubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3QgbWVzc2FnZSA9XG4gICAgICAgICdVbmtub3duIGNvbmZpZyBvcHRpb25zIGFyZSBzcGVjaWZpZWQgZm9yIFJVTSBhZ2VudDogJyArXG4gICAgICAgIHVua25vd24uam9pbignLCAnKVxuICAgICAgbG9nZ2luZ1NlcnZpY2Uud2FybihtZXNzYWdlKVxuICAgIH1cblxuICAgIGlmIChtaXNzaW5nLmxlbmd0aCA9PT0gMCAmJiBpbnZhbGlkLmxlbmd0aCA9PT0gMCkge1xuICAgICAgY29uZmlnU2VydmljZS5zZXRDb25maWcoY29uZmlnKVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBzZXBhcmF0b3IgPSAnLCAnXG4gICAgICBsZXQgbWVzc2FnZSA9IFwiUlVNIGFnZW50IGlzbid0IGNvcnJlY3RseSBjb25maWd1cmVkLiBcIlxuXG4gICAgICBpZiAobWlzc2luZy5sZW5ndGggPiAwKSB7XG4gICAgICAgIG1lc3NhZ2UgKz0gbWlzc2luZy5qb2luKHNlcGFyYXRvcikgKyAnIGlzIG1pc3NpbmcnXG4gICAgICAgIGlmIChpbnZhbGlkLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBtZXNzYWdlICs9IHNlcGFyYXRvclxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGludmFsaWQuZm9yRWFjaCgoeyBrZXksIHZhbHVlLCBhbGxvd2VkIH0sIGluZGV4KSA9PiB7XG4gICAgICAgIG1lc3NhZ2UgKz1cbiAgICAgICAgICBgJHtrZXl9IFwiJHt2YWx1ZX1cIiBjb250YWlucyBpbnZhbGlkIGNoYXJhY3RlcnMhIChhbGxvd2VkOiAke2FsbG93ZWR9KWAgK1xuICAgICAgICAgIChpbmRleCAhPT0gaW52YWxpZC5sZW5ndGggLSAxID8gc2VwYXJhdG9yIDogJycpXG4gICAgICB9KVxuICAgICAgbG9nZ2luZ1NlcnZpY2UuZXJyb3IobWVzc2FnZSlcbiAgICAgIGNvbmZpZ1NlcnZpY2Uuc2V0Q29uZmlnKHsgYWN0aXZlOiBmYWxzZSB9KVxuICAgIH1cbiAgfVxuXG4gIHNldFVzZXJDb250ZXh0KHVzZXJDb250ZXh0KSB7XG4gICAgdmFyIGNvbmZpZ1NlcnZpY2UgPSB0aGlzLnNlcnZpY2VGYWN0b3J5LmdldFNlcnZpY2UoQ09ORklHX1NFUlZJQ0UpXG4gICAgY29uZmlnU2VydmljZS5zZXRVc2VyQ29udGV4dCh1c2VyQ29udGV4dClcbiAgfVxuXG4gIHNldEN1c3RvbUNvbnRleHQoY3VzdG9tQ29udGV4dCkge1xuICAgIHZhciBjb25maWdTZXJ2aWNlID0gdGhpcy5zZXJ2aWNlRmFjdG9yeS5nZXRTZXJ2aWNlKENPTkZJR19TRVJWSUNFKVxuICAgIGNvbmZpZ1NlcnZpY2Uuc2V0Q3VzdG9tQ29udGV4dChjdXN0b21Db250ZXh0KVxuICB9XG5cbiAgYWRkTGFiZWxzKGxhYmVscykge1xuICAgIHZhciBjb25maWdTZXJ2aWNlID0gdGhpcy5zZXJ2aWNlRmFjdG9yeS5nZXRTZXJ2aWNlKENPTkZJR19TRVJWSUNFKVxuICAgIGNvbmZpZ1NlcnZpY2UuYWRkTGFiZWxzKGxhYmVscylcbiAgfVxuXG4gIC8vIFNob3VsZCBjYWxsIHRoaXMgbWV0aG9kIGJlZm9yZSAnbG9hZCcgZXZlbnQgb24gd2luZG93IGlzIGZpcmVkXG4gIHNldEluaXRpYWxQYWdlTG9hZE5hbWUobmFtZSkge1xuICAgIGNvbnN0IGNvbmZpZ1NlcnZpY2UgPSB0aGlzLnNlcnZpY2VGYWN0b3J5LmdldFNlcnZpY2UoQ09ORklHX1NFUlZJQ0UpXG4gICAgY29uZmlnU2VydmljZS5zZXRDb25maWcoe1xuICAgICAgcGFnZUxvYWRUcmFuc2FjdGlvbk5hbWU6IG5hbWVcbiAgICB9KVxuICB9XG5cbiAgc3RhcnRUcmFuc2FjdGlvbihuYW1lLCB0eXBlLCBvcHRpb25zKSB7XG4gICAgaWYgKHRoaXMuaXNFbmFibGVkKCkpIHtcbiAgICAgIHZhciB0cmFuc2FjdGlvblNlcnZpY2UgPSB0aGlzLnNlcnZpY2VGYWN0b3J5LmdldFNlcnZpY2UoXG4gICAgICAgIFRSQU5TQUNUSU9OX1NFUlZJQ0VcbiAgICAgIClcbiAgICAgIHJldHVybiB0cmFuc2FjdGlvblNlcnZpY2Uuc3RhcnRUcmFuc2FjdGlvbihuYW1lLCB0eXBlLCBvcHRpb25zKVxuICAgIH1cbiAgfVxuXG4gIHN0YXJ0U3BhbihuYW1lLCB0eXBlLCBvcHRpb25zKSB7XG4gICAgaWYgKHRoaXMuaXNFbmFibGVkKCkpIHtcbiAgICAgIHZhciB0cmFuc2FjdGlvblNlcnZpY2UgPSB0aGlzLnNlcnZpY2VGYWN0b3J5LmdldFNlcnZpY2UoXG4gICAgICAgIFRSQU5TQUNUSU9OX1NFUlZJQ0VcbiAgICAgIClcbiAgICAgIHJldHVybiB0cmFuc2FjdGlvblNlcnZpY2Uuc3RhcnRTcGFuKG5hbWUsIHR5cGUsIG9wdGlvbnMpXG4gICAgfVxuICB9XG5cbiAgZ2V0Q3VycmVudFRyYW5zYWN0aW9uKCkge1xuICAgIGlmICh0aGlzLmlzRW5hYmxlZCgpKSB7XG4gICAgICB2YXIgdHJhbnNhY3Rpb25TZXJ2aWNlID0gdGhpcy5zZXJ2aWNlRmFjdG9yeS5nZXRTZXJ2aWNlKFxuICAgICAgICBUUkFOU0FDVElPTl9TRVJWSUNFXG4gICAgICApXG4gICAgICByZXR1cm4gdHJhbnNhY3Rpb25TZXJ2aWNlLmdldEN1cnJlbnRUcmFuc2FjdGlvbigpXG4gICAgfVxuICB9XG5cbiAgY2FwdHVyZUVycm9yKGVycm9yKSB7XG4gICAgaWYgKHRoaXMuaXNFbmFibGVkKCkpIHtcbiAgICAgIHZhciBlcnJvckxvZ2dpbmcgPSB0aGlzLnNlcnZpY2VGYWN0b3J5LmdldFNlcnZpY2UoRVJST1JfTE9HR0lORylcbiAgICAgIHJldHVybiBlcnJvckxvZ2dpbmcubG9nRXJyb3IoZXJyb3IpXG4gICAgfVxuICB9XG5cbiAgYWRkRmlsdGVyKGZuKSB7XG4gICAgdmFyIGNvbmZpZ1NlcnZpY2UgPSB0aGlzLnNlcnZpY2VGYWN0b3J5LmdldFNlcnZpY2UoQ09ORklHX1NFUlZJQ0UpXG4gICAgY29uZmlnU2VydmljZS5hZGRGaWx0ZXIoZm4pXG4gIH1cbn1cbiIsIihmdW5jdGlvbihyb290LCBmYWN0b3J5KSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIC8vIFVuaXZlcnNhbCBNb2R1bGUgRGVmaW5pdGlvbiAoVU1EKSB0byBzdXBwb3J0IEFNRCwgQ29tbW9uSlMvTm9kZS5qcywgUmhpbm8sIGFuZCBicm93c2Vycy5cblxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgICBkZWZpbmUoJ2Vycm9yLXN0YWNrLXBhcnNlcicsIFsnc3RhY2tmcmFtZSddLCBmYWN0b3J5KTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jykge1xuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkocmVxdWlyZSgnc3RhY2tmcmFtZScpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByb290LkVycm9yU3RhY2tQYXJzZXIgPSBmYWN0b3J5KHJvb3QuU3RhY2tGcmFtZSk7XG4gICAgfVxufSh0aGlzLCBmdW5jdGlvbiBFcnJvclN0YWNrUGFyc2VyKFN0YWNrRnJhbWUpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICB2YXIgRklSRUZPWF9TQUZBUklfU1RBQ0tfUkVHRVhQID0gLyhefEApXFxTK1xcOlxcZCsvO1xuICAgIHZhciBDSFJPTUVfSUVfU1RBQ0tfUkVHRVhQID0gL15cXHMqYXQgLiooXFxTK1xcOlxcZCt8XFwobmF0aXZlXFwpKS9tO1xuICAgIHZhciBTQUZBUklfTkFUSVZFX0NPREVfUkVHRVhQID0gL14oZXZhbEApPyhcXFtuYXRpdmUgY29kZVxcXSk/JC87XG5cbiAgICBmdW5jdGlvbiBfbWFwKGFycmF5LCBmbiwgdGhpc0FyZykge1xuICAgICAgICBpZiAodHlwZW9mIEFycmF5LnByb3RvdHlwZS5tYXAgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHJldHVybiBhcnJheS5tYXAoZm4sIHRoaXNBcmcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIG91dHB1dCA9IG5ldyBBcnJheShhcnJheS5sZW5ndGgpO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIG91dHB1dFtpXSA9IGZuLmNhbGwodGhpc0FyZywgYXJyYXlbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9maWx0ZXIoYXJyYXksIGZuLCB0aGlzQXJnKSB7XG4gICAgICAgIGlmICh0eXBlb2YgQXJyYXkucHJvdG90eXBlLmZpbHRlciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgcmV0dXJuIGFycmF5LmZpbHRlcihmbiwgdGhpc0FyZyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgb3V0cHV0ID0gW107XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGZuLmNhbGwodGhpc0FyZywgYXJyYXlbaV0pKSB7XG4gICAgICAgICAgICAgICAgICAgIG91dHB1dC5wdXNoKGFycmF5W2ldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX2luZGV4T2YoYXJyYXksIHRhcmdldCkge1xuICAgICAgICBpZiAodHlwZW9mIEFycmF5LnByb3RvdHlwZS5pbmRleE9mID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICByZXR1cm4gYXJyYXkuaW5kZXhPZih0YXJnZXQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChhcnJheVtpXSA9PT0gdGFyZ2V0KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHaXZlbiBhbiBFcnJvciBvYmplY3QsIGV4dHJhY3QgdGhlIG1vc3QgaW5mb3JtYXRpb24gZnJvbSBpdC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtFcnJvcn0gZXJyb3Igb2JqZWN0XG4gICAgICAgICAqIEByZXR1cm4ge0FycmF5fSBvZiBTdGFja0ZyYW1lc1xuICAgICAgICAgKi9cbiAgICAgICAgcGFyc2U6IGZ1bmN0aW9uIEVycm9yU3RhY2tQYXJzZXIkJHBhcnNlKGVycm9yKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGVycm9yLnN0YWNrdHJhY2UgIT09ICd1bmRlZmluZWQnIHx8IHR5cGVvZiBlcnJvclsnb3BlcmEjc291cmNlbG9jJ10gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VPcGVyYShlcnJvcik7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGVycm9yLnN0YWNrICYmIGVycm9yLnN0YWNrLm1hdGNoKENIUk9NRV9JRV9TVEFDS19SRUdFWFApKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VWOE9ySUUoZXJyb3IpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChlcnJvci5zdGFjaykge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcnNlRkZPclNhZmFyaShlcnJvcik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IHBhcnNlIGdpdmVuIEVycm9yIG9iamVjdCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8vIFNlcGFyYXRlIGxpbmUgYW5kIGNvbHVtbiBudW1iZXJzIGZyb20gYSBzdHJpbmcgb2YgdGhlIGZvcm06IChVUkk6TGluZTpDb2x1bW4pXG4gICAgICAgIGV4dHJhY3RMb2NhdGlvbjogZnVuY3Rpb24gRXJyb3JTdGFja1BhcnNlciQkZXh0cmFjdExvY2F0aW9uKHVybExpa2UpIHtcbiAgICAgICAgICAgIC8vIEZhaWwtZmFzdCBidXQgcmV0dXJuIGxvY2F0aW9ucyBsaWtlIFwiKG5hdGl2ZSlcIlxuICAgICAgICAgICAgaWYgKHVybExpa2UuaW5kZXhPZignOicpID09PSAtMSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBbdXJsTGlrZV07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciByZWdFeHAgPSAvKC4rPykoPzpcXDooXFxkKykpPyg/OlxcOihcXGQrKSk/JC87XG4gICAgICAgICAgICB2YXIgcGFydHMgPSByZWdFeHAuZXhlYyh1cmxMaWtlLnJlcGxhY2UoL1tcXChcXCldL2csICcnKSk7XG4gICAgICAgICAgICByZXR1cm4gW3BhcnRzWzFdLCBwYXJ0c1syXSB8fCB1bmRlZmluZWQsIHBhcnRzWzNdIHx8IHVuZGVmaW5lZF07XG4gICAgICAgIH0sXG5cbiAgICAgICAgcGFyc2VWOE9ySUU6IGZ1bmN0aW9uIEVycm9yU3RhY2tQYXJzZXIkJHBhcnNlVjhPcklFKGVycm9yKSB7XG4gICAgICAgICAgICB2YXIgZmlsdGVyZWQgPSBfZmlsdGVyKGVycm9yLnN0YWNrLnNwbGl0KCdcXG4nKSwgZnVuY3Rpb24obGluZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAhIWxpbmUubWF0Y2goQ0hST01FX0lFX1NUQUNLX1JFR0VYUCk7XG4gICAgICAgICAgICB9LCB0aGlzKTtcblxuICAgICAgICAgICAgcmV0dXJuIF9tYXAoZmlsdGVyZWQsIGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgICAgICAgICAgICBpZiAobGluZS5pbmRleE9mKCcoZXZhbCAnKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFRocm93IGF3YXkgZXZhbCBpbmZvcm1hdGlvbiB1bnRpbCB3ZSBpbXBsZW1lbnQgc3RhY2t0cmFjZS5qcy9zdGFja2ZyYW1lIzhcbiAgICAgICAgICAgICAgICAgICAgbGluZSA9IGxpbmUucmVwbGFjZSgvZXZhbCBjb2RlL2csICdldmFsJykucmVwbGFjZSgvKFxcKGV2YWwgYXQgW15cXCgpXSopfChcXClcXCwuKiQpL2csICcnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIHRva2VucyA9IGxpbmUucmVwbGFjZSgvXlxccysvLCAnJykucmVwbGFjZSgvXFwoZXZhbCBjb2RlL2csICcoJykuc3BsaXQoL1xccysvKS5zbGljZSgxKTtcbiAgICAgICAgICAgICAgICB2YXIgbG9jYXRpb25QYXJ0cyA9IHRoaXMuZXh0cmFjdExvY2F0aW9uKHRva2Vucy5wb3AoKSk7XG4gICAgICAgICAgICAgICAgdmFyIGZ1bmN0aW9uTmFtZSA9IHRva2Vucy5qb2luKCcgJykgfHwgdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIHZhciBmaWxlTmFtZSA9IF9pbmRleE9mKFsnZXZhbCcsICc8YW5vbnltb3VzPiddLCBsb2NhdGlvblBhcnRzWzBdKSA+IC0xID8gdW5kZWZpbmVkIDogbG9jYXRpb25QYXJ0c1swXTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgU3RhY2tGcmFtZShmdW5jdGlvbk5hbWUsIHVuZGVmaW5lZCwgZmlsZU5hbWUsIGxvY2F0aW9uUGFydHNbMV0sIGxvY2F0aW9uUGFydHNbMl0sIGxpbmUpO1xuICAgICAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcGFyc2VGRk9yU2FmYXJpOiBmdW5jdGlvbiBFcnJvclN0YWNrUGFyc2VyJCRwYXJzZUZGT3JTYWZhcmkoZXJyb3IpIHtcbiAgICAgICAgICAgIHZhciBmaWx0ZXJlZCA9IF9maWx0ZXIoZXJyb3Iuc3RhY2suc3BsaXQoJ1xcbicpLCBmdW5jdGlvbihsaW5lKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICFsaW5lLm1hdGNoKFNBRkFSSV9OQVRJVkVfQ09ERV9SRUdFWFApO1xuICAgICAgICAgICAgfSwgdGhpcyk7XG5cbiAgICAgICAgICAgIHJldHVybiBfbWFwKGZpbHRlcmVkLCBmdW5jdGlvbihsaW5lKSB7XG4gICAgICAgICAgICAgICAgLy8gVGhyb3cgYXdheSBldmFsIGluZm9ybWF0aW9uIHVudGlsIHdlIGltcGxlbWVudCBzdGFja3RyYWNlLmpzL3N0YWNrZnJhbWUjOFxuICAgICAgICAgICAgICAgIGlmIChsaW5lLmluZGV4T2YoJyA+IGV2YWwnKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIGxpbmUgPSBsaW5lLnJlcGxhY2UoLyBsaW5lIChcXGQrKSg/OiA+IGV2YWwgbGluZSBcXGQrKSogPiBldmFsXFw6XFxkK1xcOlxcZCsvZywgJzokMScpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChsaW5lLmluZGV4T2YoJ0AnKSA9PT0gLTEgJiYgbGluZS5pbmRleE9mKCc6JykgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFNhZmFyaSBldmFsIGZyYW1lcyBvbmx5IGhhdmUgZnVuY3Rpb24gbmFtZXMgYW5kIG5vdGhpbmcgZWxzZVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFN0YWNrRnJhbWUobGluZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRva2VucyA9IGxpbmUuc3BsaXQoJ0AnKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGxvY2F0aW9uUGFydHMgPSB0aGlzLmV4dHJhY3RMb2NhdGlvbih0b2tlbnMucG9wKCkpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgZnVuY3Rpb25OYW1lID0gdG9rZW5zLmpvaW4oJ0AnKSB8fCB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgU3RhY2tGcmFtZShmdW5jdGlvbk5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBsb2NhdGlvblBhcnRzWzBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgbG9jYXRpb25QYXJ0c1sxXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvY2F0aW9uUGFydHNbMl0sXG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCB0aGlzKTtcbiAgICAgICAgfSxcblxuICAgICAgICBwYXJzZU9wZXJhOiBmdW5jdGlvbiBFcnJvclN0YWNrUGFyc2VyJCRwYXJzZU9wZXJhKGUpIHtcbiAgICAgICAgICAgIGlmICghZS5zdGFja3RyYWNlIHx8IChlLm1lc3NhZ2UuaW5kZXhPZignXFxuJykgPiAtMSAmJlxuICAgICAgICAgICAgICAgIGUubWVzc2FnZS5zcGxpdCgnXFxuJykubGVuZ3RoID4gZS5zdGFja3RyYWNlLnNwbGl0KCdcXG4nKS5sZW5ndGgpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VPcGVyYTkoZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCFlLnN0YWNrKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VPcGVyYTEwKGUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJzZU9wZXJhMTEoZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgcGFyc2VPcGVyYTk6IGZ1bmN0aW9uIEVycm9yU3RhY2tQYXJzZXIkJHBhcnNlT3BlcmE5KGUpIHtcbiAgICAgICAgICAgIHZhciBsaW5lUkUgPSAvTGluZSAoXFxkKykuKnNjcmlwdCAoPzppbiApPyhcXFMrKS9pO1xuICAgICAgICAgICAgdmFyIGxpbmVzID0gZS5tZXNzYWdlLnNwbGl0KCdcXG4nKTtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBbXTtcblxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDIsIGxlbiA9IGxpbmVzLmxlbmd0aDsgaSA8IGxlbjsgaSArPSAyKSB7XG4gICAgICAgICAgICAgICAgdmFyIG1hdGNoID0gbGluZVJFLmV4ZWMobGluZXNbaV0pO1xuICAgICAgICAgICAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaChuZXcgU3RhY2tGcmFtZSh1bmRlZmluZWQsIHVuZGVmaW5lZCwgbWF0Y2hbMl0sIG1hdGNoWzFdLCB1bmRlZmluZWQsIGxpbmVzW2ldKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9LFxuXG4gICAgICAgIHBhcnNlT3BlcmExMDogZnVuY3Rpb24gRXJyb3JTdGFja1BhcnNlciQkcGFyc2VPcGVyYTEwKGUpIHtcbiAgICAgICAgICAgIHZhciBsaW5lUkUgPSAvTGluZSAoXFxkKykuKnNjcmlwdCAoPzppbiApPyhcXFMrKSg/OjogSW4gZnVuY3Rpb24gKFxcUyspKT8kL2k7XG4gICAgICAgICAgICB2YXIgbGluZXMgPSBlLnN0YWNrdHJhY2Uuc3BsaXQoJ1xcbicpO1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gbGluZXMubGVuZ3RoOyBpIDwgbGVuOyBpICs9IDIpIHtcbiAgICAgICAgICAgICAgICB2YXIgbWF0Y2ggPSBsaW5lUkUuZXhlYyhsaW5lc1tpXSk7XG4gICAgICAgICAgICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKFxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFN0YWNrRnJhbWUoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2hbM10gfHwgdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXRjaFsyXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXRjaFsxXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGluZXNbaV1cbiAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gT3BlcmEgMTAuNjUrIEVycm9yLnN0YWNrIHZlcnkgc2ltaWxhciB0byBGRi9TYWZhcmlcbiAgICAgICAgcGFyc2VPcGVyYTExOiBmdW5jdGlvbiBFcnJvclN0YWNrUGFyc2VyJCRwYXJzZU9wZXJhMTEoZXJyb3IpIHtcbiAgICAgICAgICAgIHZhciBmaWx0ZXJlZCA9IF9maWx0ZXIoZXJyb3Iuc3RhY2suc3BsaXQoJ1xcbicpLCBmdW5jdGlvbihsaW5lKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICEhbGluZS5tYXRjaChGSVJFRk9YX1NBRkFSSV9TVEFDS19SRUdFWFApICYmICFsaW5lLm1hdGNoKC9eRXJyb3IgY3JlYXRlZCBhdC8pO1xuICAgICAgICAgICAgfSwgdGhpcyk7XG5cbiAgICAgICAgICAgIHJldHVybiBfbWFwKGZpbHRlcmVkLCBmdW5jdGlvbihsaW5lKSB7XG4gICAgICAgICAgICAgICAgdmFyIHRva2VucyA9IGxpbmUuc3BsaXQoJ0AnKTtcbiAgICAgICAgICAgICAgICB2YXIgbG9jYXRpb25QYXJ0cyA9IHRoaXMuZXh0cmFjdExvY2F0aW9uKHRva2Vucy5wb3AoKSk7XG4gICAgICAgICAgICAgICAgdmFyIGZ1bmN0aW9uQ2FsbCA9ICh0b2tlbnMuc2hpZnQoKSB8fCAnJyk7XG4gICAgICAgICAgICAgICAgdmFyIGZ1bmN0aW9uTmFtZSA9IGZ1bmN0aW9uQ2FsbFxuICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLzxhbm9ueW1vdXMgZnVuY3Rpb24oOiAoXFx3KykpPz4vLCAnJDInKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcKFteXFwpXSpcXCkvZywgJycpIHx8IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICB2YXIgYXJnc1JhdztcbiAgICAgICAgICAgICAgICBpZiAoZnVuY3Rpb25DYWxsLm1hdGNoKC9cXCgoW15cXCldKilcXCkvKSkge1xuICAgICAgICAgICAgICAgICAgICBhcmdzUmF3ID0gZnVuY3Rpb25DYWxsLnJlcGxhY2UoL15bXlxcKF0rXFwoKFteXFwpXSopXFwpJC8sICckMScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgYXJncyA9IChhcmdzUmF3ID09PSB1bmRlZmluZWQgfHwgYXJnc1JhdyA9PT0gJ1thcmd1bWVudHMgbm90IGF2YWlsYWJsZV0nKSA/XG4gICAgICAgICAgICAgICAgICAgIHVuZGVmaW5lZCA6IGFyZ3NSYXcuc3BsaXQoJywnKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFN0YWNrRnJhbWUoXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgYXJncyxcbiAgICAgICAgICAgICAgICAgICAgbG9jYXRpb25QYXJ0c1swXSxcbiAgICAgICAgICAgICAgICAgICAgbG9jYXRpb25QYXJ0c1sxXSxcbiAgICAgICAgICAgICAgICAgICAgbG9jYXRpb25QYXJ0c1syXSxcbiAgICAgICAgICAgICAgICAgICAgbGluZSk7XG4gICAgICAgICAgICB9LCB0aGlzKTtcbiAgICAgICAgfVxuICAgIH07XG59KSk7XG5cbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuLyoqXG4gKiBUaGUgRk9STUFUX0JJTkFSWSBmb3JtYXQgcmVwcmVzZW50cyBTcGFuQ29udGV4dHMgaW4gYW4gb3BhcXVlIGJpbmFyeVxuICogY2Fycmllci5cbiAqXG4gKiBUcmFjZXIuaW5qZWN0KCkgd2lsbCBzZXQgdGhlIGJ1ZmZlciBmaWVsZCB0byBhbiBBcnJheS1saWtlIChBcnJheSxcbiAqIEFycmF5QnVmZmVyLCBvciBUeXBlZEJ1ZmZlcikgb2JqZWN0IGNvbnRhaW5pbmcgdGhlIGluamVjdGVkIGJpbmFyeSBkYXRhLlxuICogQW55IHZhbGlkIE9iamVjdCBjYW4gYmUgdXNlZCBhcyBsb25nIGFzIHRoZSBidWZmZXIgZmllbGQgb2YgdGhlIG9iamVjdFxuICogY2FuIGJlIHNldC5cbiAqXG4gKiBUcmFjZXIuZXh0cmFjdCgpIHdpbGwgbG9vayBmb3IgYGNhcnJpZXIuYnVmZmVyYCwgYW5kIHRoYXQgZmllbGQgaXNcbiAqIGV4cGVjdGVkIHRvIGJlIGFuIEFycmF5LWxpa2Ugb2JqZWN0IChBcnJheSwgQXJyYXlCdWZmZXIsIG9yXG4gKiBUeXBlZEJ1ZmZlcikuXG4gKi9cbmV4cG9ydHMuRk9STUFUX0JJTkFSWSA9ICdiaW5hcnknO1xuLyoqXG4gKiBUaGUgRk9STUFUX1RFWFRfTUFQIGZvcm1hdCByZXByZXNlbnRzIFNwYW5Db250ZXh0cyB1c2luZyBhXG4gKiBzdHJpbmctPnN0cmluZyBtYXAgKGJhY2tlZCBieSBhIEphdmFzY3JpcHQgT2JqZWN0KSBhcyBhIGNhcnJpZXIuXG4gKlxuICogTk9URTogVW5saWtlIEZPUk1BVF9IVFRQX0hFQURFUlMsIEZPUk1BVF9URVhUX01BUCBwbGFjZXMgbm8gcmVzdHJpY3Rpb25zXG4gKiBvbiB0aGUgY2hhcmFjdGVycyB1c2VkIGluIGVpdGhlciB0aGUga2V5cyBvciB0aGUgdmFsdWVzIG9mIHRoZSBtYXBcbiAqIGVudHJpZXMuXG4gKlxuICogVGhlIEZPUk1BVF9URVhUX01BUCBjYXJyaWVyIG1hcCBtYXkgY29udGFpbiB1bnJlbGF0ZWQgZGF0YSAoZS5nLixcbiAqIGFyYml0cmFyeSBnUlBDIG1ldGFkYXRhKTsgYXMgc3VjaCwgdGhlIFRyYWNlciBpbXBsZW1lbnRhdGlvbiBzaG91bGQgdXNlXG4gKiBhIHByZWZpeCBvciBvdGhlciBjb252ZW50aW9uIHRvIGRpc3Rpbmd1aXNoIFRyYWNlci1zcGVjaWZpYyBrZXk6dmFsdWVcbiAqIHBhaXJzLlxuICovXG5leHBvcnRzLkZPUk1BVF9URVhUX01BUCA9ICd0ZXh0X21hcCc7XG4vKipcbiAqIFRoZSBGT1JNQVRfSFRUUF9IRUFERVJTIGZvcm1hdCByZXByZXNlbnRzIFNwYW5Db250ZXh0cyB1c2luZyBhXG4gKiBjaGFyYWN0ZXItcmVzdHJpY3RlZCBzdHJpbmctPnN0cmluZyBtYXAgKGJhY2tlZCBieSBhIEphdmFzY3JpcHQgT2JqZWN0KVxuICogYXMgYSBjYXJyaWVyLlxuICpcbiAqIEtleXMgYW5kIHZhbHVlcyBpbiB0aGUgRk9STUFUX0hUVFBfSEVBREVSUyBjYXJyaWVyIG11c3QgYmUgc3VpdGFibGUgZm9yXG4gKiB1c2UgYXMgSFRUUCBoZWFkZXJzICh3aXRob3V0IG1vZGlmaWNhdGlvbiBvciBmdXJ0aGVyIGVzY2FwaW5nKS4gVGhhdCBpcyxcbiAqIHRoZSBrZXlzIGhhdmUgYSBncmVhdGx5IHJlc3RyaWN0ZWQgY2hhcmFjdGVyIHNldCwgY2FzaW5nIGZvciB0aGUga2V5c1xuICogbWF5IG5vdCBiZSBwcmVzZXJ2ZWQgYnkgdmFyaW91cyBpbnRlcm1lZGlhcmllcywgYW5kIHRoZSB2YWx1ZXMgc2hvdWxkIGJlXG4gKiBVUkwtZXNjYXBlZC5cbiAqXG4gKiBUaGUgRk9STUFUX0hUVFBfSEVBREVSUyBjYXJyaWVyIG1hcCBtYXkgY29udGFpbiB1bnJlbGF0ZWQgZGF0YSAoZS5nLixcbiAqIGFyYml0cmFyeSBIVFRQIGhlYWRlcnMpOyBhcyBzdWNoLCB0aGUgVHJhY2VyIGltcGxlbWVudGF0aW9uIHNob3VsZCB1c2UgYVxuICogcHJlZml4IG9yIG90aGVyIGNvbnZlbnRpb24gdG8gZGlzdGluZ3Vpc2ggVHJhY2VyLXNwZWNpZmljIGtleTp2YWx1ZVxuICogcGFpcnMuXG4gKi9cbmV4cG9ydHMuRk9STUFUX0hUVFBfSEVBREVSUyA9ICdodHRwX2hlYWRlcnMnO1xuLyoqXG4gKiBBIFNwYW4gbWF5IGJlIHRoZSBcImNoaWxkIG9mXCIgYSBwYXJlbnQgU3Bhbi4gSW4gYSDigJxjaGlsZCBvZuKAnSByZWZlcmVuY2UsXG4gKiB0aGUgcGFyZW50IFNwYW4gZGVwZW5kcyBvbiB0aGUgY2hpbGQgU3BhbiBpbiBzb21lIGNhcGFjaXR5LlxuICpcbiAqIFNlZSBtb3JlIGFib3V0IHJlZmVyZW5jZSB0eXBlcyBhdCBodHRwczovL2dpdGh1Yi5jb20vb3BlbnRyYWNpbmcvc3BlY2lmaWNhdGlvblxuICovXG5leHBvcnRzLlJFRkVSRU5DRV9DSElMRF9PRiA9ICdjaGlsZF9vZic7XG4vKipcbiAqIFNvbWUgcGFyZW50IFNwYW5zIGRvIG5vdCBkZXBlbmQgaW4gYW55IHdheSBvbiB0aGUgcmVzdWx0IG9mIHRoZWlyIGNoaWxkXG4gKiBTcGFucy4gSW4gdGhlc2UgY2FzZXMsIHdlIHNheSBtZXJlbHkgdGhhdCB0aGUgY2hpbGQgU3BhbiDigJxmb2xsb3dzIGZyb23igJ1cbiAqIHRoZSBwYXJlbnQgU3BhbiBpbiBhIGNhdXNhbCBzZW5zZS5cbiAqXG4gKiBTZWUgbW9yZSBhYm91dCByZWZlcmVuY2UgdHlwZXMgYXQgaHR0cHM6Ly9naXRodWIuY29tL29wZW50cmFjaW5nL3NwZWNpZmljYXRpb25cbiAqL1xuZXhwb3J0cy5SRUZFUkVOQ0VfRk9MTE9XU19GUk9NID0gJ2ZvbGxvd3NfZnJvbSc7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1jb25zdGFudHMuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgQ29uc3RhbnRzID0gcmVxdWlyZShcIi4vY29uc3RhbnRzXCIpO1xudmFyIHJlZmVyZW5jZV8xID0gcmVxdWlyZShcIi4vcmVmZXJlbmNlXCIpO1xudmFyIHNwYW5fMSA9IHJlcXVpcmUoXCIuL3NwYW5cIik7XG4vKipcbiAqIFJldHVybiBhIG5ldyBSRUZFUkVOQ0VfQ0hJTERfT0YgcmVmZXJlbmNlLlxuICpcbiAqIEBwYXJhbSB7U3BhbkNvbnRleHR9IHNwYW5Db250ZXh0IC0gdGhlIHBhcmVudCBTcGFuQ29udGV4dCBpbnN0YW5jZSB0b1xuICogICAgICAgIHJlZmVyZW5jZS5cbiAqIEByZXR1cm4gYSBSRUZFUkVOQ0VfQ0hJTERfT0YgcmVmZXJlbmNlIHBvaW50aW5nIHRvIGBzcGFuQ29udGV4dGBcbiAqL1xuZnVuY3Rpb24gY2hpbGRPZihzcGFuQ29udGV4dCkge1xuICAgIC8vIEFsbG93IHRoZSB1c2VyIHRvIHBhc3MgYSBTcGFuIGluc3RlYWQgb2YgYSBTcGFuQ29udGV4dFxuICAgIGlmIChzcGFuQ29udGV4dCBpbnN0YW5jZW9mIHNwYW5fMS5kZWZhdWx0KSB7XG4gICAgICAgIHNwYW5Db250ZXh0ID0gc3BhbkNvbnRleHQuY29udGV4dCgpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IHJlZmVyZW5jZV8xLmRlZmF1bHQoQ29uc3RhbnRzLlJFRkVSRU5DRV9DSElMRF9PRiwgc3BhbkNvbnRleHQpO1xufVxuZXhwb3J0cy5jaGlsZE9mID0gY2hpbGRPZjtcbi8qKlxuICogUmV0dXJuIGEgbmV3IFJFRkVSRU5DRV9GT0xMT1dTX0ZST00gcmVmZXJlbmNlLlxuICpcbiAqIEBwYXJhbSB7U3BhbkNvbnRleHR9IHNwYW5Db250ZXh0IC0gdGhlIHBhcmVudCBTcGFuQ29udGV4dCBpbnN0YW5jZSB0b1xuICogICAgICAgIHJlZmVyZW5jZS5cbiAqIEByZXR1cm4gYSBSRUZFUkVOQ0VfRk9MTE9XU19GUk9NIHJlZmVyZW5jZSBwb2ludGluZyB0byBgc3BhbkNvbnRleHRgXG4gKi9cbmZ1bmN0aW9uIGZvbGxvd3NGcm9tKHNwYW5Db250ZXh0KSB7XG4gICAgLy8gQWxsb3cgdGhlIHVzZXIgdG8gcGFzcyBhIFNwYW4gaW5zdGVhZCBvZiBhIFNwYW5Db250ZXh0XG4gICAgaWYgKHNwYW5Db250ZXh0IGluc3RhbmNlb2Ygc3Bhbl8xLmRlZmF1bHQpIHtcbiAgICAgICAgc3BhbkNvbnRleHQgPSBzcGFuQ29udGV4dC5jb250ZXh0KCk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgcmVmZXJlbmNlXzEuZGVmYXVsdChDb25zdGFudHMuUkVGRVJFTkNFX0ZPTExPV1NfRlJPTSwgc3BhbkNvbnRleHQpO1xufVxuZXhwb3J0cy5mb2xsb3dzRnJvbSA9IGZvbGxvd3NGcm9tO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZnVuY3Rpb25zLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIHNwYW5fMSA9IHJlcXVpcmUoXCIuL3NwYW5cIik7XG52YXIgc3Bhbl9jb250ZXh0XzEgPSByZXF1aXJlKFwiLi9zcGFuX2NvbnRleHRcIik7XG52YXIgdHJhY2VyXzEgPSByZXF1aXJlKFwiLi90cmFjZXJcIik7XG5leHBvcnRzLnRyYWNlciA9IG51bGw7XG5leHBvcnRzLnNwYW5Db250ZXh0ID0gbnVsbDtcbmV4cG9ydHMuc3BhbiA9IG51bGw7XG4vLyBEZWZlcnJlZCBpbml0aWFsaXphdGlvbiB0byBhdm9pZCBhIGRlcGVuZGVuY3kgY3ljbGUgd2hlcmUgVHJhY2VyIGRlcGVuZHMgb25cbi8vIFNwYW4gd2hpY2ggZGVwZW5kcyBvbiB0aGUgbm9vcCB0cmFjZXIuXG5mdW5jdGlvbiBpbml0aWFsaXplKCkge1xuICAgIGV4cG9ydHMudHJhY2VyID0gbmV3IHRyYWNlcl8xLmRlZmF1bHQoKTtcbiAgICBleHBvcnRzLnNwYW4gPSBuZXcgc3Bhbl8xLmRlZmF1bHQoKTtcbiAgICBleHBvcnRzLnNwYW5Db250ZXh0ID0gbmV3IHNwYW5fY29udGV4dF8xLmRlZmF1bHQoKTtcbn1cbmV4cG9ydHMuaW5pdGlhbGl6ZSA9IGluaXRpYWxpemU7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1ub29wLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIHNwYW5fMSA9IHJlcXVpcmUoXCIuL3NwYW5cIik7XG4vKipcbiAqIFJlZmVyZW5jZSBwYWlycyBhIHJlZmVyZW5jZSB0eXBlIGNvbnN0YW50IChlLmcuLCBSRUZFUkVOQ0VfQ0hJTERfT0Ygb3JcbiAqIFJFRkVSRU5DRV9GT0xMT1dTX0ZST00pIHdpdGggdGhlIFNwYW5Db250ZXh0IGl0IHBvaW50cyB0by5cbiAqXG4gKiBTZWUgdGhlIGV4cG9ydGVkIGNoaWxkT2YoKSBhbmQgZm9sbG93c0Zyb20oKSBmdW5jdGlvbnMgYXQgdGhlIHBhY2thZ2UgbGV2ZWwuXG4gKi9cbnZhciBSZWZlcmVuY2UgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgLyoqXG4gICAgICogSW5pdGlhbGl6ZSBhIG5ldyBSZWZlcmVuY2UgaW5zdGFuY2UuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdHlwZSAtIHRoZSBSZWZlcmVuY2UgdHlwZSBjb25zdGFudCAoZS5nLixcbiAgICAgKiAgICAgICAgUkVGRVJFTkNFX0NISUxEX09GIG9yIFJFRkVSRU5DRV9GT0xMT1dTX0ZST00pLlxuICAgICAqIEBwYXJhbSB7U3BhbkNvbnRleHR9IHJlZmVyZW5jZWRDb250ZXh0IC0gdGhlIFNwYW5Db250ZXh0IGJlaW5nIHJlZmVycmVkXG4gICAgICogICAgICAgIHRvLiBBcyBhIGNvbnZlbmllbmNlLCBhIFNwYW4gaW5zdGFuY2UgbWF5IGJlIHBhc3NlZCBpbiBpbnN0ZWFkXG4gICAgICogICAgICAgIChpbiB3aGljaCBjYXNlIGl0cyAuY29udGV4dCgpIGlzIHVzZWQgaGVyZSkuXG4gICAgICovXG4gICAgZnVuY3Rpb24gUmVmZXJlbmNlKHR5cGUsIHJlZmVyZW5jZWRDb250ZXh0KSB7XG4gICAgICAgIHRoaXMuX3R5cGUgPSB0eXBlO1xuICAgICAgICB0aGlzLl9yZWZlcmVuY2VkQ29udGV4dCA9IChyZWZlcmVuY2VkQ29udGV4dCBpbnN0YW5jZW9mIHNwYW5fMS5kZWZhdWx0ID9cbiAgICAgICAgICAgIHJlZmVyZW5jZWRDb250ZXh0LmNvbnRleHQoKSA6XG4gICAgICAgICAgICByZWZlcmVuY2VkQ29udGV4dCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEByZXR1cm4ge3N0cmluZ30gVGhlIFJlZmVyZW5jZSB0eXBlIChlLmcuLCBSRUZFUkVOQ0VfQ0hJTERfT0Ygb3JcbiAgICAgKiAgICAgICAgIFJFRkVSRU5DRV9GT0xMT1dTX0ZST00pLlxuICAgICAqL1xuICAgIFJlZmVyZW5jZS5wcm90b3R5cGUudHlwZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3R5cGU7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBAcmV0dXJuIHtTcGFuQ29udGV4dH0gVGhlIFNwYW5Db250ZXh0IGJlaW5nIHJlZmVycmVkIHRvIChlLmcuLCB0aGVcbiAgICAgKiAgICAgICAgIHBhcmVudCBpbiBhIFJFRkVSRU5DRV9DSElMRF9PRiBSZWZlcmVuY2UpLlxuICAgICAqL1xuICAgIFJlZmVyZW5jZS5wcm90b3R5cGUucmVmZXJlbmNlZENvbnRleHQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9yZWZlcmVuY2VkQ29udGV4dDtcbiAgICB9O1xuICAgIHJldHVybiBSZWZlcmVuY2U7XG59KCkpO1xuZXhwb3J0cy5kZWZhdWx0ID0gUmVmZXJlbmNlO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cmVmZXJlbmNlLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIG5vb3AgPSByZXF1aXJlKFwiLi9ub29wXCIpO1xuLyoqXG4gKiBTcGFuIHJlcHJlc2VudHMgYSBsb2dpY2FsIHVuaXQgb2Ygd29yayBhcyBwYXJ0IG9mIGEgYnJvYWRlciBUcmFjZS4gRXhhbXBsZXNcbiAqIG9mIHNwYW4gbWlnaHQgaW5jbHVkZSByZW1vdGUgcHJvY2VkdXJlIGNhbGxzIG9yIGEgaW4tcHJvY2VzcyBmdW5jdGlvbiBjYWxsc1xuICogdG8gc3ViLWNvbXBvbmVudHMuIEEgVHJhY2UgaGFzIGEgc2luZ2xlLCB0b3AtbGV2ZWwgXCJyb290XCIgU3BhbiB0aGF0IGluIHR1cm5cbiAqIG1heSBoYXZlIHplcm8gb3IgbW9yZSBjaGlsZCBTcGFucywgd2hpY2ggaW4gdHVybiBtYXkgaGF2ZSBjaGlsZHJlbi5cbiAqL1xudmFyIFNwYW4gPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gU3BhbigpIHtcbiAgICB9XG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvL1xuICAgIC8vIE9wZW5UcmFjaW5nIEFQSSBtZXRob2RzXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvL1xuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIFNwYW5Db250ZXh0IG9iamVjdCBhc3NvY2lhdGVkIHdpdGggdGhpcyBTcGFuLlxuICAgICAqXG4gICAgICogQHJldHVybiB7U3BhbkNvbnRleHR9XG4gICAgICovXG4gICAgU3Bhbi5wcm90b3R5cGUuY29udGV4dCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbnRleHQoKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIFRyYWNlciBvYmplY3QgdXNlZCB0byBjcmVhdGUgdGhpcyBTcGFuLlxuICAgICAqXG4gICAgICogQHJldHVybiB7VHJhY2VyfVxuICAgICAqL1xuICAgIFNwYW4ucHJvdG90eXBlLnRyYWNlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RyYWNlcigpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogU2V0cyB0aGUgc3RyaW5nIG5hbWUgZm9yIHRoZSBsb2dpY2FsIG9wZXJhdGlvbiB0aGlzIHNwYW4gcmVwcmVzZW50cy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lXG4gICAgICovXG4gICAgU3Bhbi5wcm90b3R5cGUuc2V0T3BlcmF0aW9uTmFtZSA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgIHRoaXMuX3NldE9wZXJhdGlvbk5hbWUobmFtZSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogU2V0cyBhIGtleTp2YWx1ZSBwYWlyIG9uIHRoaXMgU3BhbiB0aGF0IGFsc28gcHJvcGFnYXRlcyB0byBmdXR1cmVcbiAgICAgKiBjaGlsZHJlbiBvZiB0aGUgYXNzb2NpYXRlZCBTcGFuLlxuICAgICAqXG4gICAgICogc2V0QmFnZ2FnZUl0ZW0oKSBlbmFibGVzIHBvd2VyZnVsIGZ1bmN0aW9uYWxpdHkgZ2l2ZW4gYSBmdWxsLXN0YWNrXG4gICAgICogb3BlbnRyYWNpbmcgaW50ZWdyYXRpb24gKGUuZy4sIGFyYml0cmFyeSBhcHBsaWNhdGlvbiBkYXRhIGZyb20gYSB3ZWJcbiAgICAgKiBjbGllbnQgY2FuIG1ha2UgaXQsIHRyYW5zcGFyZW50bHksIGFsbCB0aGUgd2F5IGludG8gdGhlIGRlcHRocyBvZiBhXG4gICAgICogc3RvcmFnZSBzeXN0ZW0pLCBhbmQgd2l0aCBpdCBzb21lIHBvd2VyZnVsIGNvc3RzOiB1c2UgdGhpcyBmZWF0dXJlIHdpdGhcbiAgICAgKiBjYXJlLlxuICAgICAqXG4gICAgICogSU1QT1JUQU5UIE5PVEUgIzE6IHNldEJhZ2dhZ2VJdGVtKCkgd2lsbCBvbmx5IHByb3BhZ2F0ZSBiYWdnYWdlIGl0ZW1zIHRvXG4gICAgICogKmZ1dHVyZSogY2F1c2FsIGRlc2NlbmRhbnRzIG9mIHRoZSBhc3NvY2lhdGVkIFNwYW4uXG4gICAgICpcbiAgICAgKiBJTVBPUlRBTlQgTk9URSAjMjogVXNlIHRoaXMgdGhvdWdodGZ1bGx5IGFuZCB3aXRoIGNhcmUuIEV2ZXJ5IGtleSBhbmRcbiAgICAgKiB2YWx1ZSBpcyBjb3BpZWQgaW50byBldmVyeSBsb2NhbCAqYW5kIHJlbW90ZSogY2hpbGQgb2YgdGhlIGFzc29jaWF0ZWRcbiAgICAgKiBTcGFuLCBhbmQgdGhhdCBjYW4gYWRkIHVwIHRvIGEgbG90IG9mIG5ldHdvcmsgYW5kIGNwdSBvdmVyaGVhZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBrZXlcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWVcbiAgICAgKi9cbiAgICBTcGFuLnByb3RvdHlwZS5zZXRCYWdnYWdlSXRlbSA9IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gICAgICAgIHRoaXMuX3NldEJhZ2dhZ2VJdGVtKGtleSwgdmFsdWUpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIHZhbHVlIGZvciBhIGJhZ2dhZ2UgaXRlbSBnaXZlbiBpdHMga2V5LlxuICAgICAqXG4gICAgICogQHBhcmFtICB7c3RyaW5nfSBrZXlcbiAgICAgKiAgICAgICAgIFRoZSBrZXkgZm9yIHRoZSBnaXZlbiB0cmFjZSBhdHRyaWJ1dGUuXG4gICAgICogQHJldHVybiB7c3RyaW5nfVxuICAgICAqICAgICAgICAgU3RyaW5nIHZhbHVlIGZvciB0aGUgZ2l2ZW4ga2V5LCBvciB1bmRlZmluZWQgaWYgdGhlIGtleSBkb2VzIG5vdFxuICAgICAqICAgICAgICAgY29ycmVzcG9uZCB0byBhIHNldCB0cmFjZSBhdHRyaWJ1dGUuXG4gICAgICovXG4gICAgU3Bhbi5wcm90b3R5cGUuZ2V0QmFnZ2FnZUl0ZW0gPSBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9nZXRCYWdnYWdlSXRlbShrZXkpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogQWRkcyBhIHNpbmdsZSB0YWcgdG8gdGhlIHNwYW4uICBTZWUgYGFkZFRhZ3MoKWAgZm9yIGRldGFpbHMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5XG4gICAgICogQHBhcmFtIHthbnl9IHZhbHVlXG4gICAgICovXG4gICAgU3Bhbi5wcm90b3R5cGUuc2V0VGFnID0gZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgICAgICAgLy8gTk9URTogdGhlIGNhbGwgaXMgbm9ybWFsaXplZCB0byBhIGNhbGwgdG8gX2FkZFRhZ3MoKVxuICAgICAgICB0aGlzLl9hZGRUYWdzKChfYSA9IHt9LCBfYVtrZXldID0gdmFsdWUsIF9hKSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB2YXIgX2E7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBBZGRzIHRoZSBnaXZlbiBrZXkgdmFsdWUgcGFpcnMgdG8gdGhlIHNldCBvZiBzcGFuIHRhZ3MuXG4gICAgICpcbiAgICAgKiBNdWx0aXBsZSBjYWxscyB0byBhZGRUYWdzKCkgcmVzdWx0cyBpbiB0aGUgdGFncyBiZWluZyB0aGUgc3VwZXJzZXQgb2ZcbiAgICAgKiBhbGwgY2FsbHMuXG4gICAgICpcbiAgICAgKiBUaGUgYmVoYXZpb3Igb2Ygc2V0dGluZyB0aGUgc2FtZSBrZXkgbXVsdGlwbGUgdGltZXMgb24gdGhlIHNhbWUgc3BhblxuICAgICAqIGlzIHVuZGVmaW5lZC5cbiAgICAgKlxuICAgICAqIFRoZSBzdXBwb3J0ZWQgdHlwZSBvZiB0aGUgdmFsdWVzIGlzIGltcGxlbWVudGF0aW9uLWRlcGVuZGVudC5cbiAgICAgKiBJbXBsZW1lbnRhdGlvbnMgYXJlIGV4cGVjdGVkIHRvIHNhZmVseSBoYW5kbGUgYWxsIHR5cGVzIG9mIHZhbHVlcyBidXRcbiAgICAgKiBtYXkgY2hvb3NlIHRvIGlnbm9yZSB1bnJlY29nbml6ZWQgLyB1bmhhbmRsZS1hYmxlIHZhbHVlcyAoZS5nLiBvYmplY3RzXG4gICAgICogd2l0aCBjeWNsaWMgcmVmZXJlbmNlcywgZnVuY3Rpb24gb2JqZWN0cykuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtbdHlwZV19IFtkZXNjcmlwdGlvbl1cbiAgICAgKi9cbiAgICBTcGFuLnByb3RvdHlwZS5hZGRUYWdzID0gZnVuY3Rpb24gKGtleVZhbHVlTWFwKSB7XG4gICAgICAgIHRoaXMuX2FkZFRhZ3Moa2V5VmFsdWVNYXApO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEFkZCBhIGxvZyByZWNvcmQgdG8gdGhpcyBTcGFuLCBvcHRpb25hbGx5IGF0IGEgdXNlci1wcm92aWRlZCB0aW1lc3RhbXAuXG4gICAgICpcbiAgICAgKiBGb3IgZXhhbXBsZTpcbiAgICAgKlxuICAgICAqICAgICBzcGFuLmxvZyh7XG4gICAgICogICAgICAgICBzaXplOiBycGMuc2l6ZSgpLCAgLy8gbnVtZXJpYyB2YWx1ZVxuICAgICAqICAgICAgICAgVVJJOiBycGMuVVJJKCksICAvLyBzdHJpbmcgdmFsdWVcbiAgICAgKiAgICAgICAgIHBheWxvYWQ6IHJwYy5wYXlsb2FkKCksICAvLyBPYmplY3QgdmFsdWVcbiAgICAgKiAgICAgICAgIFwia2V5cyBjYW4gYmUgYXJiaXRyYXJ5IHN0cmluZ3NcIjogcnBjLmZvbygpLFxuICAgICAqICAgICB9KTtcbiAgICAgKlxuICAgICAqICAgICBzcGFuLmxvZyh7XG4gICAgICogICAgICAgICBcImVycm9yLmRlc2NyaXB0aW9uXCI6IHNvbWVFcnJvci5kZXNjcmlwdGlvbigpLFxuICAgICAqICAgICB9LCBzb21lRXJyb3IudGltZXN0YW1wTWlsbGlzKCkpO1xuICAgICAqXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGtleVZhbHVlUGFpcnNcbiAgICAgKiAgICAgICAgQW4gb2JqZWN0IG1hcHBpbmcgc3RyaW5nIGtleXMgdG8gYXJiaXRyYXJ5IHZhbHVlIHR5cGVzLiBBbGxcbiAgICAgKiAgICAgICAgVHJhY2VyIGltcGxlbWVudGF0aW9ucyBzaG91bGQgc3VwcG9ydCBib29sLCBzdHJpbmcsIGFuZCBudW1lcmljXG4gICAgICogICAgICAgIHZhbHVlIHR5cGVzLCBhbmQgc29tZSBtYXkgYWxzbyBzdXBwb3J0IE9iamVjdCB2YWx1ZXMuXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHRpbWVzdGFtcFxuICAgICAqICAgICAgICBBbiBvcHRpb25hbCBwYXJhbWV0ZXIgc3BlY2lmeWluZyB0aGUgdGltZXN0YW1wIGluIG1pbGxpc2Vjb25kc1xuICAgICAqICAgICAgICBzaW5jZSB0aGUgVW5peCBlcG9jaC4gRnJhY3Rpb25hbCB2YWx1ZXMgYXJlIGFsbG93ZWQgc28gdGhhdFxuICAgICAqICAgICAgICB0aW1lc3RhbXBzIHdpdGggc3ViLW1pbGxpc2Vjb25kIGFjY3VyYWN5IGNhbiBiZSByZXByZXNlbnRlZC4gSWZcbiAgICAgKiAgICAgICAgbm90IHNwZWNpZmllZCwgdGhlIGltcGxlbWVudGF0aW9uIGlzIGV4cGVjdGVkIHRvIHVzZSBpdHMgbm90aW9uXG4gICAgICogICAgICAgIG9mIHRoZSBjdXJyZW50IHRpbWUgb2YgdGhlIGNhbGwuXG4gICAgICovXG4gICAgU3Bhbi5wcm90b3R5cGUubG9nID0gZnVuY3Rpb24gKGtleVZhbHVlUGFpcnMsIHRpbWVzdGFtcCkge1xuICAgICAgICB0aGlzLl9sb2coa2V5VmFsdWVQYWlycywgdGltZXN0YW1wKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBERVBSRUNBVEVEXG4gICAgICovXG4gICAgU3Bhbi5wcm90b3R5cGUubG9nRXZlbnQgPSBmdW5jdGlvbiAoZXZlbnROYW1lLCBwYXlsb2FkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9sb2coeyBldmVudDogZXZlbnROYW1lLCBwYXlsb2FkOiBwYXlsb2FkIH0pO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogU2V0cyB0aGUgZW5kIHRpbWVzdGFtcCBhbmQgZmluYWxpemVzIFNwYW4gc3RhdGUuXG4gICAgICpcbiAgICAgKiBXaXRoIHRoZSBleGNlcHRpb24gb2YgY2FsbHMgdG8gU3Bhbi5jb250ZXh0KCkgKHdoaWNoIGFyZSBhbHdheXMgYWxsb3dlZCksXG4gICAgICogZmluaXNoKCkgbXVzdCBiZSB0aGUgbGFzdCBjYWxsIG1hZGUgdG8gYW55IHNwYW4gaW5zdGFuY2UsIGFuZCB0byBkb1xuICAgICAqIG90aGVyd2lzZSBsZWFkcyB0byB1bmRlZmluZWQgYmVoYXZpb3IuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gIHtudW1iZXJ9IGZpbmlzaFRpbWVcbiAgICAgKiAgICAgICAgIE9wdGlvbmFsIGZpbmlzaCB0aW1lIGluIG1pbGxpc2Vjb25kcyBhcyBhIFVuaXggdGltZXN0YW1wLiBEZWNpbWFsXG4gICAgICogICAgICAgICB2YWx1ZXMgYXJlIHN1cHBvcnRlZCBmb3IgdGltZXN0YW1wcyB3aXRoIHN1Yi1taWxsaXNlY29uZCBhY2N1cmFjeS5cbiAgICAgKiAgICAgICAgIElmIG5vdCBzcGVjaWZpZWQsIHRoZSBjdXJyZW50IHRpbWUgKGFzIGRlZmluZWQgYnkgdGhlXG4gICAgICogICAgICAgICBpbXBsZW1lbnRhdGlvbikgd2lsbCBiZSB1c2VkLlxuICAgICAqL1xuICAgIFNwYW4ucHJvdG90eXBlLmZpbmlzaCA9IGZ1bmN0aW9uIChmaW5pc2hUaW1lKSB7XG4gICAgICAgIHRoaXMuX2ZpbmlzaChmaW5pc2hUaW1lKTtcbiAgICAgICAgLy8gRG8gbm90IHJldHVybiBgdGhpc2AuIFRoZSBTcGFuIGdlbmVyYWxseSBzaG91bGQgbm90IGJlIHVzZWQgYWZ0ZXIgaXRcbiAgICAgICAgLy8gaXMgZmluaXNoZWQgc28gY2hhaW5pbmcgaXMgbm90IGRlc2lyZWQgaW4gdGhpcyBjb250ZXh0LlxuICAgIH07XG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvL1xuICAgIC8vIERlcml2ZWQgY2xhc3NlcyBjYW4gY2hvb3NlIHRvIGltcGxlbWVudCB0aGUgYmVsb3dcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC8vXG4gICAgLy8gQnkgZGVmYXVsdCByZXR1cm5zIGEgbm8tb3AgU3BhbkNvbnRleHQuXG4gICAgU3Bhbi5wcm90b3R5cGUuX2NvbnRleHQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBub29wLnNwYW5Db250ZXh0O1xuICAgIH07XG4gICAgLy8gQnkgZGVmYXVsdCByZXR1cm5zIGEgbm8tb3AgdHJhY2VyLlxuICAgIC8vXG4gICAgLy8gVGhlIGJhc2UgY2xhc3MgY291bGQgc3RvcmUgdGhlIHRyYWNlciB0aGF0IGNyZWF0ZWQgaXQsIGJ1dCBpdCBkb2VzIG5vdFxuICAgIC8vIGluIG9yZGVyIHRvIGVuc3VyZSB0aGUgbm8tb3Agc3BhbiBpbXBsZW1lbnRhdGlvbiBoYXMgemVybyBtZW1iZXJzLFxuICAgIC8vIHdoaWNoIGFsbG93cyBWOCB0byBhZ2dyZXNzaXZlbHkgb3B0aW1pemUgY2FsbHMgdG8gc3VjaCBvYmplY3RzLlxuICAgIFNwYW4ucHJvdG90eXBlLl90cmFjZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBub29wLnRyYWNlcjtcbiAgICB9O1xuICAgIC8vIEJ5IGRlZmF1bHQgZG9lcyBub3RoaW5nXG4gICAgU3Bhbi5wcm90b3R5cGUuX3NldE9wZXJhdGlvbk5hbWUgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIH07XG4gICAgLy8gQnkgZGVmYXVsdCBkb2VzIG5vdGhpbmdcbiAgICBTcGFuLnByb3RvdHlwZS5fc2V0QmFnZ2FnZUl0ZW0gPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICAgIH07XG4gICAgLy8gQnkgZGVmYXVsdCBkb2VzIG5vdGhpbmdcbiAgICBTcGFuLnByb3RvdHlwZS5fZ2V0QmFnZ2FnZUl0ZW0gPSBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfTtcbiAgICAvLyBCeSBkZWZhdWx0IGRvZXMgbm90aGluZ1xuICAgIC8vXG4gICAgLy8gTk9URTogYm90aCBzZXRUYWcoKSBhbmQgYWRkVGFncygpIG1hcCB0byB0aGlzIGZ1bmN0aW9uLiBrZXlWYWx1ZVBhaXJzXG4gICAgLy8gd2lsbCBhbHdheXMgYmUgYW4gYXNzb2NpYXRpdmUgYXJyYXkuXG4gICAgU3Bhbi5wcm90b3R5cGUuX2FkZFRhZ3MgPSBmdW5jdGlvbiAoa2V5VmFsdWVQYWlycykge1xuICAgIH07XG4gICAgLy8gQnkgZGVmYXVsdCBkb2VzIG5vdGhpbmdcbiAgICBTcGFuLnByb3RvdHlwZS5fbG9nID0gZnVuY3Rpb24gKGtleVZhbHVlUGFpcnMsIHRpbWVzdGFtcCkge1xuICAgIH07XG4gICAgLy8gQnkgZGVmYXVsdCBkb2VzIG5vdGhpbmdcbiAgICAvL1xuICAgIC8vIGZpbmlzaFRpbWUgaXMgZXhwZWN0ZWQgdG8gYmUgZWl0aGVyIGEgbnVtYmVyIG9yIHVuZGVmaW5lZC5cbiAgICBTcGFuLnByb3RvdHlwZS5fZmluaXNoID0gZnVuY3Rpb24gKGZpbmlzaFRpbWUpIHtcbiAgICB9O1xuICAgIHJldHVybiBTcGFuO1xufSgpKTtcbmV4cG9ydHMuU3BhbiA9IFNwYW47XG5leHBvcnRzLmRlZmF1bHQgPSBTcGFuO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c3Bhbi5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbi8qKlxuICogU3BhbkNvbnRleHQgcmVwcmVzZW50cyBTcGFuIHN0YXRlIHRoYXQgbXVzdCBwcm9wYWdhdGUgdG8gZGVzY2VuZGFudCBTcGFuc1xuICogYW5kIGFjcm9zcyBwcm9jZXNzIGJvdW5kYXJpZXMuXG4gKlxuICogU3BhbkNvbnRleHQgaXMgbG9naWNhbGx5IGRpdmlkZWQgaW50byB0d28gcGllY2VzOiB0aGUgdXNlci1sZXZlbCBcIkJhZ2dhZ2VcIlxuICogKHNlZSBzZXRCYWdnYWdlSXRlbSBhbmQgZ2V0QmFnZ2FnZUl0ZW0pIHRoYXQgcHJvcGFnYXRlcyBhY3Jvc3MgU3BhblxuICogYm91bmRhcmllcyBhbmQgYW55IFRyYWNlci1pbXBsZW1lbnRhdGlvbi1zcGVjaWZpYyBmaWVsZHMgdGhhdCBhcmUgbmVlZGVkIHRvXG4gKiBpZGVudGlmeSBvciBvdGhlcndpc2UgY29udGV4dHVhbGl6ZSB0aGUgYXNzb2NpYXRlZCBTcGFuIGluc3RhbmNlIChlLmcuLCBhXG4gKiA8dHJhY2VfaWQsIHNwYW5faWQsIHNhbXBsZWQ+IHR1cGxlKS5cbiAqL1xudmFyIFNwYW5Db250ZXh0ID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFNwYW5Db250ZXh0KCkge1xuICAgIH1cbiAgICByZXR1cm4gU3BhbkNvbnRleHQ7XG59KCkpO1xuZXhwb3J0cy5TcGFuQ29udGV4dCA9IFNwYW5Db250ZXh0O1xuZXhwb3J0cy5kZWZhdWx0ID0gU3BhbkNvbnRleHQ7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1zcGFuX2NvbnRleHQuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgRnVuY3Rpb25zID0gcmVxdWlyZShcIi4vZnVuY3Rpb25zXCIpO1xudmFyIE5vb3AgPSByZXF1aXJlKFwiLi9ub29wXCIpO1xudmFyIHNwYW5fMSA9IHJlcXVpcmUoXCIuL3NwYW5cIik7XG4vKipcbiAqIFRyYWNlciBpcyB0aGUgZW50cnktcG9pbnQgYmV0d2VlbiB0aGUgaW5zdHJ1bWVudGF0aW9uIEFQSSBhbmQgdGhlIHRyYWNpbmdcbiAqIGltcGxlbWVudGF0aW9uLlxuICpcbiAqIFRoZSBkZWZhdWx0IG9iamVjdCBhY3RzIGFzIGEgbm8tb3AgaW1wbGVtZW50YXRpb24uXG4gKlxuICogTm90ZSB0byBpbXBsZW1lbnRhdG9yczogZGVyaXZlZCBjbGFzc2VzIGNhbiBjaG9vc2UgdG8gZGlyZWN0bHkgaW1wbGVtZW50IHRoZVxuICogbWV0aG9kcyBpbiB0aGUgXCJPcGVuVHJhY2luZyBBUEkgbWV0aG9kc1wiIHNlY3Rpb24sIG9yIG9wdGlvbmFsbHkgdGhlIHN1YnNldCBvZlxuICogdW5kZXJzY29yZS1wcmVmaXhlZCBtZXRob2RzIHRvIHBpY2sgdXAgdGhlIGFyZ3VtZW50IGNoZWNraW5nIGFuZCBoYW5kbGluZ1xuICogYXV0b21hdGljYWxseSBmcm9tIHRoZSBiYXNlIGNsYXNzLlxuICovXG52YXIgVHJhY2VyID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFRyYWNlcigpIHtcbiAgICB9XG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvL1xuICAgIC8vIE9wZW5UcmFjaW5nIEFQSSBtZXRob2RzXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvL1xuICAgIC8qKlxuICAgICAqIFN0YXJ0cyBhbmQgcmV0dXJucyBhIG5ldyBTcGFuIHJlcHJlc2VudGluZyBhIGxvZ2ljYWwgdW5pdCBvZiB3b3JrLlxuICAgICAqXG4gICAgICogRm9yIGV4YW1wbGU6XG4gICAgICpcbiAgICAgKiAgICAgLy8gU3RhcnQgYSBuZXcgKHBhcmVudGxlc3MpIHJvb3QgU3BhbjpcbiAgICAgKiAgICAgdmFyIHBhcmVudCA9IFRyYWNlci5zdGFydFNwYW4oJ0RvV29yaycpO1xuICAgICAqXG4gICAgICogICAgIC8vIFN0YXJ0IGEgbmV3IChjaGlsZCkgU3BhbjpcbiAgICAgKiAgICAgdmFyIGNoaWxkID0gVHJhY2VyLnN0YXJ0U3BhbignbG9hZC1mcm9tLWRiJywge1xuICAgICAqICAgICAgICAgY2hpbGRPZjogcGFyZW50LmNvbnRleHQoKSxcbiAgICAgKiAgICAgfSk7XG4gICAgICpcbiAgICAgKiAgICAgLy8gU3RhcnQgYSBuZXcgYXN5bmMgKEZvbGxvd3NGcm9tKSBTcGFuOlxuICAgICAqICAgICB2YXIgY2hpbGQgPSBUcmFjZXIuc3RhcnRTcGFuKCdhc3luYy1jYWNoZS13cml0ZScsIHtcbiAgICAgKiAgICAgICAgIHJlZmVyZW5jZXM6IFtcbiAgICAgKiAgICAgICAgICAgICBvcGVudHJhY2luZy5mb2xsb3dzRnJvbShwYXJlbnQuY29udGV4dCgpKVxuICAgICAqICAgICAgICAgXSxcbiAgICAgKiAgICAgfSk7XG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIHRoZSBuYW1lIG9mIHRoZSBvcGVyYXRpb24gKFJFUVVJUkVEKS5cbiAgICAgKiBAcGFyYW0ge1NwYW5PcHRpb25zfSBbb3B0aW9uc10gLSBvcHRpb25zIGZvciB0aGUgbmV3bHkgY3JlYXRlZCBzcGFuLlxuICAgICAqIEByZXR1cm4ge1NwYW59IC0gYSBuZXcgU3BhbiBvYmplY3QuXG4gICAgICovXG4gICAgVHJhY2VyLnByb3RvdHlwZS5zdGFydFNwYW4gPSBmdW5jdGlvbiAobmFtZSwgb3B0aW9ucykge1xuICAgICAgICBpZiAob3B0aW9ucyA9PT0gdm9pZCAwKSB7IG9wdGlvbnMgPSB7fTsgfVxuICAgICAgICAvLyBDb252ZXJ0IG9wdGlvbnMuY2hpbGRPZiB0byBmaWVsZHMucmVmZXJlbmNlcyBhcyBuZWVkZWQuXG4gICAgICAgIGlmIChvcHRpb25zLmNoaWxkT2YpIHtcbiAgICAgICAgICAgIC8vIENvbnZlcnQgZnJvbSBhIFNwYW4gb3IgYSBTcGFuQ29udGV4dCBpbnRvIGEgUmVmZXJlbmNlLlxuICAgICAgICAgICAgdmFyIGNoaWxkT2YgPSBGdW5jdGlvbnMuY2hpbGRPZihvcHRpb25zLmNoaWxkT2YpO1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMucmVmZXJlbmNlcykge1xuICAgICAgICAgICAgICAgIG9wdGlvbnMucmVmZXJlbmNlcy5wdXNoKGNoaWxkT2YpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgb3B0aW9ucy5yZWZlcmVuY2VzID0gW2NoaWxkT2ZdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZGVsZXRlIChvcHRpb25zLmNoaWxkT2YpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9zdGFydFNwYW4obmFtZSwgb3B0aW9ucyk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBJbmplY3RzIHRoZSBnaXZlbiBTcGFuQ29udGV4dCBpbnN0YW5jZSBmb3IgY3Jvc3MtcHJvY2VzcyBwcm9wYWdhdGlvblxuICAgICAqIHdpdGhpbiBgY2FycmllcmAuIFRoZSBleHBlY3RlZCB0eXBlIG9mIGBjYXJyaWVyYCBkZXBlbmRzIG9uIHRoZSB2YWx1ZSBvZlxuICAgICAqIGBmb3JtYXQuXG4gICAgICpcbiAgICAgKiBPcGVuVHJhY2luZyBkZWZpbmVzIGEgY29tbW9uIHNldCBvZiBgZm9ybWF0YCB2YWx1ZXMgKHNlZVxuICAgICAqIEZPUk1BVF9URVhUX01BUCwgRk9STUFUX0hUVFBfSEVBREVSUywgYW5kIEZPUk1BVF9CSU5BUlkpLCBhbmQgZWFjaCBoYXNcbiAgICAgKiBhbiBleHBlY3RlZCBjYXJyaWVyIHR5cGUuXG4gICAgICpcbiAgICAgKiBDb25zaWRlciB0aGlzIHBzZXVkb2NvZGUgZXhhbXBsZTpcbiAgICAgKlxuICAgICAqICAgICB2YXIgY2xpZW50U3BhbiA9IC4uLjtcbiAgICAgKiAgICAgLi4uXG4gICAgICogICAgIC8vIEluamVjdCBjbGllbnRTcGFuIGludG8gYSB0ZXh0IGNhcnJpZXIuXG4gICAgICogICAgIHZhciBoZWFkZXJzQ2FycmllciA9IHt9O1xuICAgICAqICAgICBUcmFjZXIuaW5qZWN0KGNsaWVudFNwYW4uY29udGV4dCgpLCBUcmFjZXIuRk9STUFUX0hUVFBfSEVBREVSUywgaGVhZGVyc0NhcnJpZXIpO1xuICAgICAqICAgICAvLyBJbmNvcnBvcmF0ZSB0aGUgdGV4dENhcnJpZXIgaW50byB0aGUgb3V0Ym91bmQgSFRUUCByZXF1ZXN0IGhlYWRlclxuICAgICAqICAgICAvLyBtYXAuXG4gICAgICogICAgIE9iamVjdC5hc3NpZ24ob3V0Ym91bmRIVFRQUmVxLmhlYWRlcnMsIGhlYWRlcnNDYXJyaWVyKTtcbiAgICAgKiAgICAgLy8gLi4uIHNlbmQgdGhlIGh0dHBSZXFcbiAgICAgKlxuICAgICAqIEBwYXJhbSAge1NwYW5Db250ZXh0fSBzcGFuQ29udGV4dCAtIHRoZSBTcGFuQ29udGV4dCB0byBpbmplY3QgaW50byB0aGVcbiAgICAgKiAgICAgICAgIGNhcnJpZXIgb2JqZWN0LiBBcyBhIGNvbnZlbmllbmNlLCBhIFNwYW4gaW5zdGFuY2UgbWF5IGJlIHBhc3NlZFxuICAgICAqICAgICAgICAgaW4gaW5zdGVhZCAoaW4gd2hpY2ggY2FzZSBpdHMgLmNvbnRleHQoKSBpcyB1c2VkIGZvciB0aGVcbiAgICAgKiAgICAgICAgIGluamVjdCgpKS5cbiAgICAgKiBAcGFyYW0gIHtzdHJpbmd9IGZvcm1hdCAtIHRoZSBmb3JtYXQgb2YgdGhlIGNhcnJpZXIuXG4gICAgICogQHBhcmFtICB7YW55fSBjYXJyaWVyIC0gc2VlIHRoZSBkb2N1bWVudGF0aW9uIGZvciB0aGUgY2hvc2VuIGBmb3JtYXRgXG4gICAgICogICAgICAgICBmb3IgYSBkZXNjcmlwdGlvbiBvZiB0aGUgY2FycmllciBvYmplY3QuXG4gICAgICovXG4gICAgVHJhY2VyLnByb3RvdHlwZS5pbmplY3QgPSBmdW5jdGlvbiAoc3BhbkNvbnRleHQsIGZvcm1hdCwgY2Fycmllcikge1xuICAgICAgICAvLyBBbGxvdyB0aGUgdXNlciB0byBwYXNzIGEgU3BhbiBpbnN0ZWFkIG9mIGEgU3BhbkNvbnRleHRcbiAgICAgICAgaWYgKHNwYW5Db250ZXh0IGluc3RhbmNlb2Ygc3Bhbl8xLmRlZmF1bHQpIHtcbiAgICAgICAgICAgIHNwYW5Db250ZXh0ID0gc3BhbkNvbnRleHQuY29udGV4dCgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9pbmplY3Qoc3BhbkNvbnRleHQsIGZvcm1hdCwgY2Fycmllcik7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgU3BhbkNvbnRleHQgaW5zdGFuY2UgZXh0cmFjdGVkIGZyb20gYGNhcnJpZXJgIGluIHRoZSBnaXZlblxuICAgICAqIGBmb3JtYXRgLlxuICAgICAqXG4gICAgICogT3BlblRyYWNpbmcgZGVmaW5lcyBhIGNvbW1vbiBzZXQgb2YgYGZvcm1hdGAgdmFsdWVzIChzZWVcbiAgICAgKiBGT1JNQVRfVEVYVF9NQVAsIEZPUk1BVF9IVFRQX0hFQURFUlMsIGFuZCBGT1JNQVRfQklOQVJZKSwgYW5kIGVhY2ggaGFzXG4gICAgICogYW4gZXhwZWN0ZWQgY2FycmllciB0eXBlLlxuICAgICAqXG4gICAgICogQ29uc2lkZXIgdGhpcyBwc2V1ZG9jb2RlIGV4YW1wbGU6XG4gICAgICpcbiAgICAgKiAgICAgLy8gVXNlIHRoZSBpbmJvdW5kIEhUVFAgcmVxdWVzdCdzIGhlYWRlcnMgYXMgYSB0ZXh0IG1hcCBjYXJyaWVyLlxuICAgICAqICAgICB2YXIgaGVhZGVyc0NhcnJpZXIgPSBpbmJvdW5kSFRUUFJlcS5oZWFkZXJzO1xuICAgICAqICAgICB2YXIgd2lyZUN0eCA9IFRyYWNlci5leHRyYWN0KFRyYWNlci5GT1JNQVRfSFRUUF9IRUFERVJTLCBoZWFkZXJzQ2Fycmllcik7XG4gICAgICogICAgIHZhciBzZXJ2ZXJTcGFuID0gVHJhY2VyLnN0YXJ0U3BhbignLi4uJywgeyBjaGlsZE9mIDogd2lyZUN0eCB9KTtcbiAgICAgKlxuICAgICAqIEBwYXJhbSAge3N0cmluZ30gZm9ybWF0IC0gdGhlIGZvcm1hdCBvZiB0aGUgY2Fycmllci5cbiAgICAgKiBAcGFyYW0gIHthbnl9IGNhcnJpZXIgLSB0aGUgdHlwZSBvZiB0aGUgY2FycmllciBvYmplY3QgaXMgZGV0ZXJtaW5lZCBieVxuICAgICAqICAgICAgICAgdGhlIGZvcm1hdC5cbiAgICAgKiBAcmV0dXJuIHtTcGFuQ29udGV4dH1cbiAgICAgKiAgICAgICAgIFRoZSBleHRyYWN0ZWQgU3BhbkNvbnRleHQsIG9yIG51bGwgaWYgbm8gc3VjaCBTcGFuQ29udGV4dCBjb3VsZFxuICAgICAqICAgICAgICAgYmUgZm91bmQgaW4gYGNhcnJpZXJgXG4gICAgICovXG4gICAgVHJhY2VyLnByb3RvdHlwZS5leHRyYWN0ID0gZnVuY3Rpb24gKGZvcm1hdCwgY2Fycmllcikge1xuICAgICAgICByZXR1cm4gdGhpcy5fZXh0cmFjdChmb3JtYXQsIGNhcnJpZXIpO1xuICAgIH07XG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvL1xuICAgIC8vIERlcml2ZWQgY2xhc3NlcyBjYW4gY2hvb3NlIHRvIGltcGxlbWVudCB0aGUgYmVsb3dcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC8vXG4gICAgLy8gTk9URTogdGhlIGlucHV0IHRvIHRoaXMgbWV0aG9kIGlzICphbHdheXMqIGFuIGFzc29jaWF0aXZlIGFycmF5LiBUaGVcbiAgICAvLyBwdWJsaWMtZmFjaW5nIHN0YXJ0U3BhbigpIG1ldGhvZCBub3JtYWxpemVzIHRoZSBhcmd1bWVudHMgc28gdGhhdFxuICAgIC8vIGFsbCBOIGltcGxlbWVudGF0aW9ucyBkbyBub3QgbmVlZCB0byB3b3JyeSBhYm91dCB2YXJpYXRpb25zIGluIHRoZSBjYWxsXG4gICAgLy8gc2lnbmF0dXJlLlxuICAgIC8vXG4gICAgLy8gVGhlIGRlZmF1bHQgYmVoYXZpb3IgcmV0dXJucyBhIG5vLW9wIHNwYW4uXG4gICAgVHJhY2VyLnByb3RvdHlwZS5fc3RhcnRTcGFuID0gZnVuY3Rpb24gKG5hbWUsIGZpZWxkcykge1xuICAgICAgICByZXR1cm4gTm9vcC5zcGFuO1xuICAgIH07XG4gICAgLy8gVGhlIGRlZmF1bHQgYmVoYXZpb3IgaXMgYSBuby1vcC5cbiAgICBUcmFjZXIucHJvdG90eXBlLl9pbmplY3QgPSBmdW5jdGlvbiAoc3BhbkNvbnRleHQsIGZvcm1hdCwgY2Fycmllcikge1xuICAgIH07XG4gICAgLy8gVGhlIGRlZmF1bHQgYmVoYXZpb3IgaXMgdG8gcmV0dXJuIGEgbm8tb3AgU3BhbkNvbnRleHQuXG4gICAgVHJhY2VyLnByb3RvdHlwZS5fZXh0cmFjdCA9IGZ1bmN0aW9uIChmb3JtYXQsIGNhcnJpZXIpIHtcbiAgICAgICAgcmV0dXJuIE5vb3Auc3BhbkNvbnRleHQ7XG4gICAgfTtcbiAgICByZXR1cm4gVHJhY2VyO1xufSgpKTtcbmV4cG9ydHMuVHJhY2VyID0gVHJhY2VyO1xuZXhwb3J0cy5kZWZhdWx0ID0gVHJhY2VyO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dHJhY2VyLmpzLm1hcCIsIi8qKlxuICogQHRoaXMge1Byb21pc2V9XG4gKi9cbmZ1bmN0aW9uIGZpbmFsbHlDb25zdHJ1Y3RvcihjYWxsYmFjaykge1xuICB2YXIgY29uc3RydWN0b3IgPSB0aGlzLmNvbnN0cnVjdG9yO1xuICByZXR1cm4gdGhpcy50aGVuKFxuICAgIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAvLyBAdHMtaWdub3JlXG4gICAgICByZXR1cm4gY29uc3RydWN0b3IucmVzb2x2ZShjYWxsYmFjaygpKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICB9KTtcbiAgICB9LFxuICAgIGZ1bmN0aW9uKHJlYXNvbikge1xuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgcmV0dXJuIGNvbnN0cnVjdG9yLnJlc29sdmUoY2FsbGJhY2soKSkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICByZXR1cm4gY29uc3RydWN0b3IucmVqZWN0KHJlYXNvbik7XG4gICAgICB9KTtcbiAgICB9XG4gICk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZpbmFsbHlDb25zdHJ1Y3RvcjtcbiIsImltcG9ydCBwcm9taXNlRmluYWxseSBmcm9tICcuL2ZpbmFsbHknO1xuXG4vLyBTdG9yZSBzZXRUaW1lb3V0IHJlZmVyZW5jZSBzbyBwcm9taXNlLXBvbHlmaWxsIHdpbGwgYmUgdW5hZmZlY3RlZCBieVxuLy8gb3RoZXIgY29kZSBtb2RpZnlpbmcgc2V0VGltZW91dCAobGlrZSBzaW5vbi51c2VGYWtlVGltZXJzKCkpXG52YXIgc2V0VGltZW91dEZ1bmMgPSBzZXRUaW1lb3V0O1xuXG5mdW5jdGlvbiBpc0FycmF5KHgpIHtcbiAgcmV0dXJuIEJvb2xlYW4oeCAmJiB0eXBlb2YgeC5sZW5ndGggIT09ICd1bmRlZmluZWQnKTtcbn1cblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbi8vIFBvbHlmaWxsIGZvciBGdW5jdGlvbi5wcm90b3R5cGUuYmluZFxuZnVuY3Rpb24gYmluZChmbiwgdGhpc0FyZykge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgZm4uYXBwbHkodGhpc0FyZywgYXJndW1lbnRzKTtcbiAgfTtcbn1cblxuLyoqXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKi9cbmZ1bmN0aW9uIFByb21pc2UoZm4pIHtcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIFByb21pc2UpKVxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1Byb21pc2VzIG11c3QgYmUgY29uc3RydWN0ZWQgdmlhIG5ldycpO1xuICBpZiAodHlwZW9mIGZuICE9PSAnZnVuY3Rpb24nKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdub3QgYSBmdW5jdGlvbicpO1xuICAvKiogQHR5cGUgeyFudW1iZXJ9ICovXG4gIHRoaXMuX3N0YXRlID0gMDtcbiAgLyoqIEB0eXBlIHshYm9vbGVhbn0gKi9cbiAgdGhpcy5faGFuZGxlZCA9IGZhbHNlO1xuICAvKiogQHR5cGUge1Byb21pc2V8dW5kZWZpbmVkfSAqL1xuICB0aGlzLl92YWx1ZSA9IHVuZGVmaW5lZDtcbiAgLyoqIEB0eXBlIHshQXJyYXk8IUZ1bmN0aW9uPn0gKi9cbiAgdGhpcy5fZGVmZXJyZWRzID0gW107XG5cbiAgZG9SZXNvbHZlKGZuLCB0aGlzKTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlKHNlbGYsIGRlZmVycmVkKSB7XG4gIHdoaWxlIChzZWxmLl9zdGF0ZSA9PT0gMykge1xuICAgIHNlbGYgPSBzZWxmLl92YWx1ZTtcbiAgfVxuICBpZiAoc2VsZi5fc3RhdGUgPT09IDApIHtcbiAgICBzZWxmLl9kZWZlcnJlZHMucHVzaChkZWZlcnJlZCk7XG4gICAgcmV0dXJuO1xuICB9XG4gIHNlbGYuX2hhbmRsZWQgPSB0cnVlO1xuICBQcm9taXNlLl9pbW1lZGlhdGVGbihmdW5jdGlvbigpIHtcbiAgICB2YXIgY2IgPSBzZWxmLl9zdGF0ZSA9PT0gMSA/IGRlZmVycmVkLm9uRnVsZmlsbGVkIDogZGVmZXJyZWQub25SZWplY3RlZDtcbiAgICBpZiAoY2IgPT09IG51bGwpIHtcbiAgICAgIChzZWxmLl9zdGF0ZSA9PT0gMSA/IHJlc29sdmUgOiByZWplY3QpKGRlZmVycmVkLnByb21pc2UsIHNlbGYuX3ZhbHVlKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHJldDtcbiAgICB0cnkge1xuICAgICAgcmV0ID0gY2Ioc2VsZi5fdmFsdWUpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJlamVjdChkZWZlcnJlZC5wcm9taXNlLCBlKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgcmVzb2x2ZShkZWZlcnJlZC5wcm9taXNlLCByZXQpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gcmVzb2x2ZShzZWxmLCBuZXdWYWx1ZSkge1xuICB0cnkge1xuICAgIC8vIFByb21pc2UgUmVzb2x1dGlvbiBQcm9jZWR1cmU6IGh0dHBzOi8vZ2l0aHViLmNvbS9wcm9taXNlcy1hcGx1cy9wcm9taXNlcy1zcGVjI3RoZS1wcm9taXNlLXJlc29sdXRpb24tcHJvY2VkdXJlXG4gICAgaWYgKG5ld1ZhbHVlID09PSBzZWxmKVxuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQSBwcm9taXNlIGNhbm5vdCBiZSByZXNvbHZlZCB3aXRoIGl0c2VsZi4nKTtcbiAgICBpZiAoXG4gICAgICBuZXdWYWx1ZSAmJlxuICAgICAgKHR5cGVvZiBuZXdWYWx1ZSA9PT0gJ29iamVjdCcgfHwgdHlwZW9mIG5ld1ZhbHVlID09PSAnZnVuY3Rpb24nKVxuICAgICkge1xuICAgICAgdmFyIHRoZW4gPSBuZXdWYWx1ZS50aGVuO1xuICAgICAgaWYgKG5ld1ZhbHVlIGluc3RhbmNlb2YgUHJvbWlzZSkge1xuICAgICAgICBzZWxmLl9zdGF0ZSA9IDM7XG4gICAgICAgIHNlbGYuX3ZhbHVlID0gbmV3VmFsdWU7XG4gICAgICAgIGZpbmFsZShzZWxmKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdGhlbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBkb1Jlc29sdmUoYmluZCh0aGVuLCBuZXdWYWx1ZSksIHNlbGYpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuICAgIHNlbGYuX3N0YXRlID0gMTtcbiAgICBzZWxmLl92YWx1ZSA9IG5ld1ZhbHVlO1xuICAgIGZpbmFsZShzZWxmKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJlamVjdChzZWxmLCBlKTtcbiAgfVxufVxuXG5mdW5jdGlvbiByZWplY3Qoc2VsZiwgbmV3VmFsdWUpIHtcbiAgc2VsZi5fc3RhdGUgPSAyO1xuICBzZWxmLl92YWx1ZSA9IG5ld1ZhbHVlO1xuICBmaW5hbGUoc2VsZik7XG59XG5cbmZ1bmN0aW9uIGZpbmFsZShzZWxmKSB7XG4gIGlmIChzZWxmLl9zdGF0ZSA9PT0gMiAmJiBzZWxmLl9kZWZlcnJlZHMubGVuZ3RoID09PSAwKSB7XG4gICAgUHJvbWlzZS5faW1tZWRpYXRlRm4oZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoIXNlbGYuX2hhbmRsZWQpIHtcbiAgICAgICAgUHJvbWlzZS5fdW5oYW5kbGVkUmVqZWN0aW9uRm4oc2VsZi5fdmFsdWUpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHNlbGYuX2RlZmVycmVkcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgIGhhbmRsZShzZWxmLCBzZWxmLl9kZWZlcnJlZHNbaV0pO1xuICB9XG4gIHNlbGYuX2RlZmVycmVkcyA9IG51bGw7XG59XG5cbi8qKlxuICogQGNvbnN0cnVjdG9yXG4gKi9cbmZ1bmN0aW9uIEhhbmRsZXIob25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQsIHByb21pc2UpIHtcbiAgdGhpcy5vbkZ1bGZpbGxlZCA9IHR5cGVvZiBvbkZ1bGZpbGxlZCA9PT0gJ2Z1bmN0aW9uJyA/IG9uRnVsZmlsbGVkIDogbnVsbDtcbiAgdGhpcy5vblJlamVjdGVkID0gdHlwZW9mIG9uUmVqZWN0ZWQgPT09ICdmdW5jdGlvbicgPyBvblJlamVjdGVkIDogbnVsbDtcbiAgdGhpcy5wcm9taXNlID0gcHJvbWlzZTtcbn1cblxuLyoqXG4gKiBUYWtlIGEgcG90ZW50aWFsbHkgbWlzYmVoYXZpbmcgcmVzb2x2ZXIgZnVuY3Rpb24gYW5kIG1ha2Ugc3VyZVxuICogb25GdWxmaWxsZWQgYW5kIG9uUmVqZWN0ZWQgYXJlIG9ubHkgY2FsbGVkIG9uY2UuXG4gKlxuICogTWFrZXMgbm8gZ3VhcmFudGVlcyBhYm91dCBhc3luY2hyb255LlxuICovXG5mdW5jdGlvbiBkb1Jlc29sdmUoZm4sIHNlbGYpIHtcbiAgdmFyIGRvbmUgPSBmYWxzZTtcbiAgdHJ5IHtcbiAgICBmbihcbiAgICAgIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIGlmIChkb25lKSByZXR1cm47XG4gICAgICAgIGRvbmUgPSB0cnVlO1xuICAgICAgICByZXNvbHZlKHNlbGYsIHZhbHVlKTtcbiAgICAgIH0sXG4gICAgICBmdW5jdGlvbihyZWFzb24pIHtcbiAgICAgICAgaWYgKGRvbmUpIHJldHVybjtcbiAgICAgICAgZG9uZSA9IHRydWU7XG4gICAgICAgIHJlamVjdChzZWxmLCByZWFzb24pO1xuICAgICAgfVxuICAgICk7XG4gIH0gY2F0Y2ggKGV4KSB7XG4gICAgaWYgKGRvbmUpIHJldHVybjtcbiAgICBkb25lID0gdHJ1ZTtcbiAgICByZWplY3Qoc2VsZiwgZXgpO1xuICB9XG59XG5cblByb21pc2UucHJvdG90eXBlWydjYXRjaCddID0gZnVuY3Rpb24ob25SZWplY3RlZCkge1xuICByZXR1cm4gdGhpcy50aGVuKG51bGwsIG9uUmVqZWN0ZWQpO1xufTtcblxuUHJvbWlzZS5wcm90b3R5cGUudGhlbiA9IGZ1bmN0aW9uKG9uRnVsZmlsbGVkLCBvblJlamVjdGVkKSB7XG4gIC8vIEB0cy1pZ25vcmVcbiAgdmFyIHByb20gPSBuZXcgdGhpcy5jb25zdHJ1Y3Rvcihub29wKTtcblxuICBoYW5kbGUodGhpcywgbmV3IEhhbmRsZXIob25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQsIHByb20pKTtcbiAgcmV0dXJuIHByb207XG59O1xuXG5Qcm9taXNlLnByb3RvdHlwZVsnZmluYWxseSddID0gcHJvbWlzZUZpbmFsbHk7XG5cblByb21pc2UuYWxsID0gZnVuY3Rpb24oYXJyKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICBpZiAoIWlzQXJyYXkoYXJyKSkge1xuICAgICAgcmV0dXJuIHJlamVjdChuZXcgVHlwZUVycm9yKCdQcm9taXNlLmFsbCBhY2NlcHRzIGFuIGFycmF5JykpO1xuICAgIH1cblxuICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJyKTtcbiAgICBpZiAoYXJncy5sZW5ndGggPT09IDApIHJldHVybiByZXNvbHZlKFtdKTtcbiAgICB2YXIgcmVtYWluaW5nID0gYXJncy5sZW5ndGg7XG5cbiAgICBmdW5jdGlvbiByZXMoaSwgdmFsKSB7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAodmFsICYmICh0eXBlb2YgdmFsID09PSAnb2JqZWN0JyB8fCB0eXBlb2YgdmFsID09PSAnZnVuY3Rpb24nKSkge1xuICAgICAgICAgIHZhciB0aGVuID0gdmFsLnRoZW47XG4gICAgICAgICAgaWYgKHR5cGVvZiB0aGVuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB0aGVuLmNhbGwoXG4gICAgICAgICAgICAgIHZhbCxcbiAgICAgICAgICAgICAgZnVuY3Rpb24odmFsKSB7XG4gICAgICAgICAgICAgICAgcmVzKGksIHZhbCk7XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHJlamVjdFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgYXJnc1tpXSA9IHZhbDtcbiAgICAgICAgaWYgKC0tcmVtYWluaW5nID09PSAwKSB7XG4gICAgICAgICAgcmVzb2x2ZShhcmdzKTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZXgpIHtcbiAgICAgICAgcmVqZWN0KGV4KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIHJlcyhpLCBhcmdzW2ldKTtcbiAgICB9XG4gIH0pO1xufTtcblxuUHJvbWlzZS5yZXNvbHZlID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgaWYgKHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUuY29uc3RydWN0b3IgPT09IFByb21pc2UpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSkge1xuICAgIHJlc29sdmUodmFsdWUpO1xuICB9KTtcbn07XG5cblByb21pc2UucmVqZWN0ID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgIHJlamVjdCh2YWx1ZSk7XG4gIH0pO1xufTtcblxuUHJvbWlzZS5yYWNlID0gZnVuY3Rpb24oYXJyKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICBpZiAoIWlzQXJyYXkoYXJyKSkge1xuICAgICAgcmV0dXJuIHJlamVjdChuZXcgVHlwZUVycm9yKCdQcm9taXNlLnJhY2UgYWNjZXB0cyBhbiBhcnJheScpKTtcbiAgICB9XG5cbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gYXJyLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBQcm9taXNlLnJlc29sdmUoYXJyW2ldKS50aGVuKHJlc29sdmUsIHJlamVjdCk7XG4gICAgfVxuICB9KTtcbn07XG5cbi8vIFVzZSBwb2x5ZmlsbCBmb3Igc2V0SW1tZWRpYXRlIGZvciBwZXJmb3JtYW5jZSBnYWluc1xuUHJvbWlzZS5faW1tZWRpYXRlRm4gPVxuICAvLyBAdHMtaWdub3JlXG4gICh0eXBlb2Ygc2V0SW1tZWRpYXRlID09PSAnZnVuY3Rpb24nICYmXG4gICAgZnVuY3Rpb24oZm4pIHtcbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIHNldEltbWVkaWF0ZShmbik7XG4gICAgfSkgfHxcbiAgZnVuY3Rpb24oZm4pIHtcbiAgICBzZXRUaW1lb3V0RnVuYyhmbiwgMCk7XG4gIH07XG5cblByb21pc2UuX3VuaGFuZGxlZFJlamVjdGlvbkZuID0gZnVuY3Rpb24gX3VuaGFuZGxlZFJlamVjdGlvbkZuKGVycikge1xuICBpZiAodHlwZW9mIGNvbnNvbGUgIT09ICd1bmRlZmluZWQnICYmIGNvbnNvbGUpIHtcbiAgICBjb25zb2xlLndhcm4oJ1Bvc3NpYmxlIFVuaGFuZGxlZCBQcm9taXNlIFJlamVjdGlvbjonLCBlcnIpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWNvbnNvbGVcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgUHJvbWlzZTtcbiIsIihmdW5jdGlvbiAocm9vdCwgZmFjdG9yeSkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICAvLyBVbml2ZXJzYWwgTW9kdWxlIERlZmluaXRpb24gKFVNRCkgdG8gc3VwcG9ydCBBTUQsIENvbW1vbkpTL05vZGUuanMsIFJoaW5vLCBhbmQgYnJvd3NlcnMuXG5cbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICAgICAgZGVmaW5lKCdzdGFja2ZyYW1lJywgW10sIGZhY3RvcnkpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJvb3QuU3RhY2tGcmFtZSA9IGZhY3RvcnkoKTtcbiAgICB9XG59KHRoaXMsIGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgZnVuY3Rpb24gX2lzTnVtYmVyKG4pIHtcbiAgICAgICAgcmV0dXJuICFpc05hTihwYXJzZUZsb2F0KG4pKSAmJiBpc0Zpbml0ZShuKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBTdGFja0ZyYW1lKGZ1bmN0aW9uTmFtZSwgYXJncywgZmlsZU5hbWUsIGxpbmVOdW1iZXIsIGNvbHVtbk51bWJlciwgc291cmNlKSB7XG4gICAgICAgIGlmIChmdW5jdGlvbk5hbWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5zZXRGdW5jdGlvbk5hbWUoZnVuY3Rpb25OYW1lKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYXJncyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLnNldEFyZ3MoYXJncyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZpbGVOYW1lICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0RmlsZU5hbWUoZmlsZU5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChsaW5lTnVtYmVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0TGluZU51bWJlcihsaW5lTnVtYmVyKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY29sdW1uTnVtYmVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0Q29sdW1uTnVtYmVyKGNvbHVtbk51bWJlcik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNvdXJjZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLnNldFNvdXJjZShzb3VyY2UpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgU3RhY2tGcmFtZS5wcm90b3R5cGUgPSB7XG4gICAgICAgIGdldEZ1bmN0aW9uTmFtZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZnVuY3Rpb25OYW1lO1xuICAgICAgICB9LFxuICAgICAgICBzZXRGdW5jdGlvbk5hbWU6IGZ1bmN0aW9uICh2KSB7XG4gICAgICAgICAgICB0aGlzLmZ1bmN0aW9uTmFtZSA9IFN0cmluZyh2KTtcbiAgICAgICAgfSxcblxuICAgICAgICBnZXRBcmdzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5hcmdzO1xuICAgICAgICB9LFxuICAgICAgICBzZXRBcmdzOiBmdW5jdGlvbiAodikge1xuICAgICAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2KSAhPT0gJ1tvYmplY3QgQXJyYXldJykge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FyZ3MgbXVzdCBiZSBhbiBBcnJheScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5hcmdzID0gdjtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyBOT1RFOiBQcm9wZXJ0eSBuYW1lIG1heSBiZSBtaXNsZWFkaW5nIGFzIGl0IGluY2x1ZGVzIHRoZSBwYXRoLFxuICAgICAgICAvLyBidXQgaXQgc29tZXdoYXQgbWlycm9ycyBWOCdzIEphdmFTY3JpcHRTdGFja1RyYWNlQXBpXG4gICAgICAgIC8vIGh0dHBzOi8vY29kZS5nb29nbGUuY29tL3Avdjgvd2lraS9KYXZhU2NyaXB0U3RhY2tUcmFjZUFwaSBhbmQgR2Vja28nc1xuICAgICAgICAvLyBodHRwOi8vbXhyLm1vemlsbGEub3JnL21vemlsbGEtY2VudHJhbC9zb3VyY2UveHBjb20vYmFzZS9uc0lFeGNlcHRpb24uaWRsIzE0XG4gICAgICAgIGdldEZpbGVOYW1lOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5maWxlTmFtZTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0RmlsZU5hbWU6IGZ1bmN0aW9uICh2KSB7XG4gICAgICAgICAgICB0aGlzLmZpbGVOYW1lID0gU3RyaW5nKHYpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGdldExpbmVOdW1iZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmxpbmVOdW1iZXI7XG4gICAgICAgIH0sXG4gICAgICAgIHNldExpbmVOdW1iZXI6IGZ1bmN0aW9uICh2KSB7XG4gICAgICAgICAgICBpZiAoIV9pc051bWJlcih2KSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0xpbmUgTnVtYmVyIG11c3QgYmUgYSBOdW1iZXInKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMubGluZU51bWJlciA9IE51bWJlcih2KTtcbiAgICAgICAgfSxcblxuICAgICAgICBnZXRDb2x1bW5OdW1iZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbHVtbk51bWJlcjtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0Q29sdW1uTnVtYmVyOiBmdW5jdGlvbiAodikge1xuICAgICAgICAgICAgaWYgKCFfaXNOdW1iZXIodikpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdDb2x1bW4gTnVtYmVyIG11c3QgYmUgYSBOdW1iZXInKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuY29sdW1uTnVtYmVyID0gTnVtYmVyKHYpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGdldFNvdXJjZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc291cmNlO1xuICAgICAgICB9LFxuICAgICAgICBzZXRTb3VyY2U6IGZ1bmN0aW9uICh2KSB7XG4gICAgICAgICAgICB0aGlzLnNvdXJjZSA9IFN0cmluZyh2KTtcbiAgICAgICAgfSxcblxuICAgICAgICB0b1N0cmluZzogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgZnVuY3Rpb25OYW1lID0gdGhpcy5nZXRGdW5jdGlvbk5hbWUoKSB8fCAne2Fub255bW91c30nO1xuICAgICAgICAgICAgdmFyIGFyZ3MgPSAnKCcgKyAodGhpcy5nZXRBcmdzKCkgfHwgW10pLmpvaW4oJywnKSArICcpJztcbiAgICAgICAgICAgIHZhciBmaWxlTmFtZSA9IHRoaXMuZ2V0RmlsZU5hbWUoKSA/ICgnQCcgKyB0aGlzLmdldEZpbGVOYW1lKCkpIDogJyc7XG4gICAgICAgICAgICB2YXIgbGluZU51bWJlciA9IF9pc051bWJlcih0aGlzLmdldExpbmVOdW1iZXIoKSkgPyAoJzonICsgdGhpcy5nZXRMaW5lTnVtYmVyKCkpIDogJyc7XG4gICAgICAgICAgICB2YXIgY29sdW1uTnVtYmVyID0gX2lzTnVtYmVyKHRoaXMuZ2V0Q29sdW1uTnVtYmVyKCkpID8gKCc6JyArIHRoaXMuZ2V0Q29sdW1uTnVtYmVyKCkpIDogJyc7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb25OYW1lICsgYXJncyArIGZpbGVOYW1lICsgbGluZU51bWJlciArIGNvbHVtbk51bWJlcjtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICByZXR1cm4gU3RhY2tGcmFtZTtcbn0pKTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdGZ1bmN0aW9uKCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuXHRcdGZ1bmN0aW9uKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgZGVmaW5pdGlvbikge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmosIHByb3ApIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApOyB9IiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvKipcbiAqIE1JVCBMaWNlbnNlXG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE3LXByZXNlbnQsIEVsYXN0aWNzZWFyY2ggQlZcbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gKiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4gKiBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4gKiB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4gKiBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbiAqIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbiAqIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiAqIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuICogRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gKiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gKiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuICogT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuICogVEhFIFNPRlRXQVJFLlxuICpcbiAqL1xuXG5pbXBvcnQge1xuICBjcmVhdGVTZXJ2aWNlRmFjdG9yeSxcbiAgYm9vdHN0cmFwLFxuICBpc0Jyb3dzZXJcbn0gZnJvbSAnQGVsYXN0aWMvYXBtLXJ1bS1jb3JlJ1xuaW1wb3J0IEFwbUJhc2UgZnJvbSAnLi9hcG0tYmFzZSdcblxuLyoqXG4gKiBVc2UgYSBzaW5nbGUgaW5zdGFuY2Ugb2YgQXBtQmFzZSBhY3Jvc3MgYWxsIGluc3RhbmNlIG9mIHRoZSBhZ2VudFxuICogaW5jbHVkaW5nIHRoZSBpbnN0YW5jZXMgdXNlZCBpbiBmcmFtZXdvcmsgc3BlY2lmaWMgaW50ZWdyYXRpb25zXG4gKi9cbmZ1bmN0aW9uIGdldEFwbUJhc2UoKSB7XG4gIGlmIChpc0Jyb3dzZXIgJiYgd2luZG93LmVsYXN0aWNBcG0pIHtcbiAgICByZXR1cm4gd2luZG93LmVsYXN0aWNBcG1cbiAgfVxuICBjb25zdCBlbmFibGVkID0gYm9vdHN0cmFwKClcbiAgY29uc3Qgc2VydmljZUZhY3RvcnkgPSBjcmVhdGVTZXJ2aWNlRmFjdG9yeSgpXG4gIGNvbnN0IGFwbUJhc2UgPSBuZXcgQXBtQmFzZShzZXJ2aWNlRmFjdG9yeSwgIWVuYWJsZWQpXG5cbiAgaWYgKGlzQnJvd3Nlcikge1xuICAgIHdpbmRvdy5lbGFzdGljQXBtID0gYXBtQmFzZVxuICB9XG5cbiAgcmV0dXJuIGFwbUJhc2Vcbn1cblxuY29uc3QgYXBtQmFzZSA9IGdldEFwbUJhc2UoKVxuXG5jb25zdCBpbml0ID0gYXBtQmFzZS5pbml0LmJpbmQoYXBtQmFzZSlcblxuZXhwb3J0IGRlZmF1bHQgaW5pdFxuZXhwb3J0IHsgaW5pdCwgYXBtQmFzZSwgQXBtQmFzZSwgYXBtQmFzZSBhcyBhcG0gfVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9