// Generated by CoffeeScript 1.8.0

/* 
Validator v0.0.1
Licensed under MIT
 */

(function() {
  'use strict';
  var factory;

  factory = function($) {
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
      this.isOnParent = (_ref = config.isOnParent) != null ? _ref : true;
      this.errorClass = config.errorClass || 'has-error';
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
            for (_k = 0, _len2 = rules.length; _k < _len2; _k++) {
              rule = rules[_k];
              result = this[rule.trim()](key, $input);
              if (this.isOnParent) {
                $input.parent().removeClass(this.errorClass);
              } else {
                $input.removeClass(this.errorClass);
              }
              if (!result.pass) {
                if (this.isOnParent) {
                  $input.focus().parent().addClass(this.errorClass);
                } else {
                  $input.focus().addClass(this.errorClass);
                }
                return callback({
                  pass: false,
                  msg: config.msg[key][rule.trim()]
                });
              }
            }
            callback({
              pass: true
            }, this.result);
          }
        }
      }
    };
    Validator.prototype.notEmpty = function(name, $input) {
      var regex, result, value, _ref;
      regex = /^\s+$/;
      value = (_ref = $input.val()) != null ? _ref.trim() : void 0;
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
    Validator.prototype.email = function(name, $input) {
      var regex, result, value, _ref;
      regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      value = (_ref = $input.val()) != null ? _ref.trim() : void 0;
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
    Validator.prototype.phone = function(name, $input) {
      var regex, result, value, _ref;
      regex = /^1[3-9]\d{9}$/;
      value = (_ref = $input.val()) != null ? _ref.trim() : void 0;
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
    Validator.prototype.minLength = function(name, $input) {
      var len, minLen, value, _ref;
      value = (_ref = $input.val()) != null ? _ref.trim() : void 0;
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
    Validator.prototype.maxLength = function(name, $input) {
      var len, maxLen, value, _ref;
      value = (_ref = $input.val()) != null ? _ref.trim() : void 0;
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
    Validator.prototype.atLeast = function(name, $input) {
      var detecter, len, list, minLen;
      if ($input.attr('type') === 'checkbox') {
        detecter = ':checked';
      } else {
        detecter = ':selected';
      }
      list = [];
      $input.each(function() {
        if (this.is(detecter)) {
          return list.push(this.val());
        }
      });
      len = list.length;
      minLen = this.settings.ATLEAST[name];
      if (len >= minLen) {
        this.result[name] = list.join(',');
        return {
          pass: true
        };
      }
      return {
        pass: false
      };
    };
    Validator.prototype.atMost = function(name, $input) {
      var detecter, len, list, maxLen;
      if ($input.attr('type') === 'checkbox') {
        detecter = ':checked';
      } else {
        detecter = ':selected';
      }
      list = [];
      $input.each(function() {
        if (this.is(detecter)) {
          return list.push(this.val());
        }
      });
      len = list.length;
      maxLen = this.settings.ATMOST[name];
      if (len <= maxLen) {
        this.result[name] = list.join(',');
        return {
          pass: true
        };
      }
      return {
        pass: false
      };
    };
    Validator.prototype.int = function(name, $input) {
      var result, value, _ref;
      value = (_ref = $input.val()) != null ? _ref.trim() : void 0;
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
    $.fn.validate.constructor = Validator;
    return $.fn.validate.noConflict = function() {
      $.fn.validate = old;
      return this;
    };
  };

  (function(factory) {
    if (typeof define === "function" && define.amd) {
      return define(["jquery"], factory);
    } else if (typeof exports === "object") {
      return factory(require("jquery"));
    } else if (typeof define === "function" && define.cmd) {
      return define(function(require) {
        require("jquery");
        return factory($);
      });
    } else {
      return window.Validator = factory(jQuery);
    }
  })(factory);

}).call(this);
