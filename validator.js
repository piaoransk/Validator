// Generated by CoffeeScript 1.8.0

/* 
Validator v0.0.1
Licensed under MIT
 */

(function() {
  'use strict';
  var Validator, old, trim;

  Validator = (function() {
    function Validator(element) {
      this.$element = $(element);
    }

    return Validator;

  })();

  trim = function() {
    return this.replace(/^\s+|\s+$/g, '');
  };

  Validator.prototype.result = {};

  Validator.prototype.settings = {
    MAXLENGTH: {},
    MINLENGTH: {},
    ATMOST: {},
    ATLEAST: {},
    REPEAT: {}
  };

  Validator.prototype.validate = function(config, callback) {
    var $input, ATLEAST_PATTERN, ATMOST_PATTERN, MAXLENGTH_PATTERN, MINLENGTH_PATTERN, PATTERNS, i, identifier, index, key, pattern, result, rule, rules, types, _i, _j, _k, _len, _len1, _len2, _ref;
    MAXLENGTH_PATTERN = /maxLength=/i;
    MINLENGTH_PATTERN = /minLength=/i;
    ATMOST_PATTERN = /atMost=/i;
    ATLEAST_PATTERN = /atLeast=/i;
    PATTERNS = [MAXLENGTH_PATTERN, MINLENGTH_PATTERN, ATMOST_PATTERN, ATLEAST_PATTERN];
    for (key in config.msg) {
      if (!(config.msg.hasOwnProperty(key))) {
        continue;
      }
      types = key;
      identifier = "*[data-validator=" + key + "]";
      $input = this.$element.find($(identifier));
      rules = $input.data('rules').split(',');
      for (_i = 0, _len = PATTERNS.length; _i < _len; _i++) {
        pattern = PATTERNS[_i];
        for (i = _j = 0, _len1 = rules.length; _j < _len1; i = ++_j) {
          rule = rules[i];
          if (rule.trim().match(pattern)) {
            index = rule.indexOf('=');
            switch (pattern) {
              case MAXLENGTH_PATTERN:
                this.settings.MAXLENGTH[key] = parseInt(rule.substring(index + 1), 10);
                rules[i] = 'maxLength';
                break;
              case MINLENGTH_PATTERN:
                this.settings.MINLENGTH[key] = parseInt(rule.substring(index + 1), 10);
                rules[i] = 'minLength';
                break;
              case ATMOST_PATTERN:
                this.settings.ATMOST[key] = parseInt(rule.substring(index + 1), 10);
                rules[i] = 'atMost';
                break;
              case ATLEAST_PATTERN:
                this.settings.ATLEAST[key] = parseInt(rule.substring(index + 1), 10);
                rules[i] = 'atLeast';
            }
          }
        }
      }
      for (_k = 0, _len2 = rules.length; _k < _len2; _k++) {
        rule = rules[_k];
        result = this[rule.trim()](key, (_ref = $input.val()) != null ? _ref.trim() : void 0);
        if (!result.pass) {
          return callback({
            pass: false,
            msg: config.msg[key][rule.trim()]
          });
        }
      }
    }
    return callback({
      pass: true
    }, this.result);
  };

  Validator.prototype.notEmpty = function(name, value) {
    var regex, result;
    regex = /^\s+$/;
    result = value.length && !regex.test(value);
    if (result) {
      this.result[name] = value;
      return {
        pass: true
      };
    }
    return {
      pass: false
    };
  };

  Validator.prototype.email = function(name, value) {
    var regex, result;
    regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    result = regex.test(value);
    if (result) {
      this.result[name] = value;
      return {
        pass: true
      };
    }
    return {
      pass: false
    };
  };

  Validator.prototype.phone = function(name, value) {
    var regex, result;
    regex = /^1[3-9]\d{9}$/;
    result = regex.test(value);
    if (result) {
      this.result[name] = value;
      return {
        pass: true
      };
    }
    return {
      pass: false
    };
  };

  Validator.prototype.minLength = function(name, value) {
    var len, minLen;
    len = value.length;
    minLen = parseInt(this.settings.MINLENGTH[name], 10);
    if (len >= minLen) {
      this.result[name] = value;
      return {
        pass: true
      };
    }
    return {
      pass: false
    };
  };

  Validator.prototype.maxLength = function(name, value) {
    var len, maxLen;
    len = value.length;
    maxLen = parseInt(this.settings.MAXLENGTH[name], 10);
    if (len <= maxLen) {
      this.result[name] = value;
      return {
        pass: true
      };
    }
    return {
      pass: false
    };
  };

  Validator.prototype.atLeast = function(name, value) {
    var len, minLen;
    len = $("*[data-validator=" + name + "]:checked").length || $("*[data-validator=" + name + "]:selected").length;
    minLen = this.settings.ATLEAST[name];
    if (len >= minLen) {
      this.result[name] = value;
      return {
        pass: true
      };
    }
    return {
      pass: false
    };
  };

  Validator.prototype.atMost = function(name, value) {
    var len, maxLen;
    len = $("*[data-validator=" + name + "]:checked").length || $("*[data-validator=" + name + "]:selected");
    maxLen = this.settings.ATMOST[name];

    console.log(len, maxLen)
    if (len <= maxLen) {
      this.result[name] = value;
      return {
        pass: true
      };
    }
    return {
      pass: false
    };
  };

  Validator.prototype.int = function(name, value) {
    var result;
    result = !isNaN(value);
    if (result) {
      this.result[name] = value;
      return {
        pass: true
      };
    }
    return {
      pass: false
    };
  };

  old = $.fn.validate;

  $.fn.validate = function(config, callback) {
    return new Validator(this).validate(config, callback);
  };

  $.fn.validate.noConflict = function() {
    $.fn.validate = old;
    return this;
  };

}).call(this);
