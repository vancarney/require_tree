// Generated by CoffeeScript 1.6.2
exports.require_tree = function(uPath) {
  'use strict';
  var appendPackages, b, extend, fs, getPackage, getPwd, initial, packages, parsePath, path, walker, _ns, _root,
    _this = this;

  fs = require('fs');
  path = require('path');
  initial = function(a) {
    return a.splice(0, a.length - 1);
  };
  extend = function(obj) {
    var o, x, _i, _len, _ref;

    _ref = Array.prototype.slice.call(arguments, 1);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      o = _ref[_i];
      if (o != null) {
        for (x in o) {
          obj[x] = o[x];
        }
      }
    }
    return obj;
  };
  _root = initial(b = uPath.split(path.sep)).join(path.sep);
  (packages = {})[_ns = b.pop()] = {};
  parsePath = function(p) {
    return p.replace(new RegExp("^\\.?(\\" + path.sep + ")"), '').split(path.sep);
  };
  getPwd = function(p) {
    return p.replace(new RegExp("^(\\.\\" + path.sep + ")?" + ((parsePath(_root)).join('\\' + path.sep)) + "\\" + path.sep), '');
  };
  appendPackages = function(p) {
    var d, pkg, s, _i, _name, _ref, _ref1;

    pkg = packages;
    for (d = _i = 0, _ref = (s = parsePath(p)).length; 0 <= _ref ? _i < _ref : _i > _ref; d = 0 <= _ref ? ++_i : --_i) {
      if ((_ref1 = pkg[_name = s[d]]) == null) {
        pkg[_name] = {};
      }
      pkg = pkg[s[d]];
    }
    return pkg;
  };
  getPackage = function(p) {
    var d, f, pkg, s, _i, _ref;

    pkg = packages;
    for (d = _i = 0, _ref = (s = parsePath(p)).length; 0 <= _ref ? _i < _ref : _i > _ref; d = 0 <= _ref ? ++_i : --_i) {
      if ((f = pkg[s[d]]) != null) {
        pkg = f;
      } else {
        return null;
      }
    }
    return pkg;
  };
  walker = function(dir) {
    var e, err, file, list, name, o, p, pwd, stat, _i, _len, _results;

    if ((list = fs.readdirSync(dir)).length) {
      _results = [];
      for (_i = 0, _len = list.length; _i < _len; _i++) {
        name = list[_i];
        if (name.match(/^\./)) {
          continue;
        }
        file = path.join(dir, name);
        pwd = getPwd(file);
        try {
          stat = fs.statSync(file);
        } catch (_error) {
          err = _error;
          stat = null;
        }
        if (stat != null ? stat.isDirectory() : void 0) {
          appendPackages(pwd);
          _results.push(walker(file));
        } else {
          if (!path.extname(file).match(/^\.js+(on)?$/)) {
            continue;
          }
          try {
            if (name.match(/^index+/)) {
              o = getPackage(((p = parsePath(pwd)).slice(0, p.length - (p.length > 1 ? 1 : 0))).join(path.sep));
              _results.push(o = extend(o, require(fs.realpathSync("" + (initial(file.split(path.sep)).join(path.sep))))));
            } else {
              o = (o = getPackage(initial(parsePath(pwd)).join(path.sep))) != null ? o : appendPackages(initial(parsePath(pwd)).join(path.sep));
              _results.push(o[name.split('.').shift()] = require(fs.realpathSync("" + file)));
            }
          } catch (_error) {
            e = _error;
            _results.push(console.error("Error requiring " + file + ": " + e.message));
          }
        }
      }
      return _results;
    }
  };
  walker(uPath);
  return packages[_ns];
};