(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

module.exports = require('./src');

},{"./src":2}],2:[function(require,module,exports){
'use strict';

var adapters = typeof jasmine.addMatchers === 'function' ?
    require('./jasmine-v2') :
    require('./jasmine-v1');

module.exports = {
    add: addMatchers
};

function addMatchers(matchers) {
    for (var matcherName in matchers) {
        addMatcher(matcherName, matchers[matcherName]);
    }
}

function addMatcher(name, matcher) {
    var adapter = adapters[matcher.length];
    return adapter(name, matcher);
}

},{"./jasmine-v1":3,"./jasmine-v2":4}],3:[function(require,module,exports){
'use strict';

module.exports = {
    1: createFactory(forActual),
    2: createFactory(forActualAndExpected),
    3: createFactory(forActualAndTwoExpected),
    4: createFactory(forKeyAndActualAndTwoExpected)
};

function createFactory(adapter) {
    return function jasmineV1MatcherFactory(name, matcher) {
        var matcherByName = new JasmineV1Matcher(name, adapter, matcher);
        beforeEach(function() {
            this.addMatchers(matcherByName);
        });
        return matcherByName;
    };
}

function JasmineV1Matcher(name, adapter, matcher) {
    this[name] = adapter(name, matcher);
}

function forActual(name, matcher) {
    return function(optionalMessage) {
        return matcher(this.actual, optionalMessage);
    };
}

function forActualAndExpected(name, matcher) {
    return function(expected, optionalMessage) {
        return matcher(expected, this.actual, optionalMessage);
    };
}

function forActualAndTwoExpected(name, matcher) {
    return function(expected1, expected2, optionalMessage) {
        return matcher(expected1, expected2, this.actual, optionalMessage);
    };
}

function forKeyAndActualAndTwoExpected(name, matcher) {
    return function(key, expected1, expected2, optionalMessage) {
        return matcher(key, expected1, expected2, this.actual, optionalMessage);
    };
}

},{}],4:[function(require,module,exports){
'use strict';

var matcherFactory = require('./matcherFactory');
var memberMatcherFactory = require('./memberMatcherFactory');

module.exports = {
    1: createFactory(getAdapter(1)),
    2: createFactory(getAdapter(2)),
    3: createFactory(getAdapter(3)),
    4: createFactory(getAdapter(4))
};

function createFactory(adapter) {
    return function jasmineV2MatcherFactory(name, matcher) {
        var matcherByName = new JasmineV2Matcher(name, adapter, matcher);
        beforeEach(function() {
            jasmine.addMatchers(matcherByName);
        });
        return matcherByName;
    };
}

function JasmineV2Matcher(name, adapter, matcher) {
    this[name] = adapter(name, matcher);
}

function getAdapter(argsCount) {
    return function adapter(name, matcher) {
        var factory = isMemberMatcher(name) ? memberMatcherFactory : matcherFactory;
        return factory[argsCount](name, matcher);
    };
}

function isMemberMatcher(name) {
    return name.search(/^toHave/) !== -1;
}

},{"./matcherFactory":5,"./memberMatcherFactory":6}],5:[function(require,module,exports){
'use strict';

module.exports = {
    1: forActual,
    2: forActualAndExpected,
    3: forActualAndTwoExpected
};

function forActual(name, matcher) {
    return function(util) {
        return {
            compare: function(actual, optionalMessage) {
                var passes = matcher(actual);
                return {
                    pass: passes,
                    message: (
                    optionalMessage ?
                        util.buildFailureMessage(name, passes, actual, optionalMessage) :
                        util.buildFailureMessage(name, passes, actual)
                    )
                };
            }
        };
    };
}

function forActualAndExpected(name, matcher) {
    return function(util) {
        return {
            compare: function(actual, expected, optionalMessage) {
                var passes = matcher(expected, actual);
                return {
                    pass: passes,
                    message: (
                    optionalMessage ?
                        util.buildFailureMessage(name, passes, actual, expected, optionalMessage) :
                        util.buildFailureMessage(name, passes, actual, expected)
                    )
                };
            }
        };
    };
}

function forActualAndTwoExpected(name, matcher) {
    return function(util) {
        return {
            compare: function(actual, expected1, expected2, optionalMessage) {
                var passes = matcher(expected1, expected2, actual);
                return {
                    pass: passes,
                    message: (
                    optionalMessage ?
                        util.buildFailureMessage(name, passes, actual, expected1, expected2, optionalMessage) :
                        util.buildFailureMessage(name, passes, actual, expected1, expected2)
                    )
                };
            }
        };
    };
}

},{}],6:[function(require,module,exports){
'use strict';

module.exports = {
    2: forKeyAndActual,
    3: forKeyAndActualAndExpected,
    4: forKeyAndActualAndTwoExpected
};

function forKeyAndActual(name, matcher) {
    return function(util) {
        return {
            compare: function(actual, key, optionalMessage) {
                var passes = matcher(key, actual);
                var message = name.search(/^toHave/) !== -1 ? key : optionalMessage;
                return {
                    pass: passes,
                    message: (
                        message ?
                        util.buildFailureMessage(name, passes, actual, message) :
                        util.buildFailureMessage(name, passes, actual)
                    )
                };
            }
        };
    };
}

function forKeyAndActualAndExpected(name, matcher) {
    return function(util) {
        return {
            compare: function(actual, key, expected, optionalMessage) {
                var passes = matcher(key, expected, actual);
                var message = (optionalMessage ?
                    util.buildFailureMessage(name, passes, actual, expected, optionalMessage) :
                    util.buildFailureMessage(name, passes, actual, expected)
                );

                return {
                    pass: passes,
                    message: formatErrorMessage(name, message, key)
                };
            }
        };
    };
}

function forKeyAndActualAndTwoExpected(name, matcher) {
    return function(util) {
        return {
            compare: function(actual, key, expected1, expected2, optionalMessage) {
                var passes = matcher(key, expected1, expected2, actual);
                var message = (optionalMessage ?
                    util.buildFailureMessage(name, passes, actual, expected1, expected2, optionalMessage) :
                    util.buildFailureMessage(name, passes, actual, expected1, expected2)
                );

                return {
                    pass: passes,
                    message: formatErrorMessage(name, message, key)
                };
            }
        };
    };
}

function formatErrorMessage(name, message, key) {
    if (name.search(/^toHave/) !== -1) {
        return message
            .replace('Expected', 'Expected member "' + key + '" of')
            .replace(' to have ', ' to be ');
    }
    return message;
}

},{}],7:[function(require,module,exports){
// public
module.exports = {
  asymmetricMatcher: [{
    name: 'after',
    matcher: 'toBeAfter'
  }, {
    name: 'arrayOfBooleans',
    matcher: 'toBeArrayOfBooleans'
  }, {
    name: 'arrayOfNumbers',
    matcher: 'toBeArrayOfNumbers'
  }, {
    name: 'arrayOfObjects',
    matcher: 'toBeArrayOfObjects'
  }, {
    name: 'arrayOfSize',
    matcher: 'toBeArrayOfSize'
  }, {
    name: 'arrayOfStrings',
    matcher: 'toBeArrayOfStrings'
  }, {
    name: 'before',
    matcher: 'toBeBefore'
  }, {
    name: 'calculable',
    matcher: 'toBeCalculable'
  }, {
    name: 'emptyArray',
    matcher: 'toBeEmptyArray'
  }, {
    name: 'emptyObject',
    matcher: 'toBeEmptyObject'
  }, {
    name: 'evenNumber',
    matcher: 'toBeEvenNumber'
  }, {
    name: 'greaterThanOrEqualTo',
    matcher: 'toBeGreaterThanOrEqualTo'
  }, {
    name: 'iso8601',
    matcher: 'toBeIso8601'
  }, {
    name: 'jsonString',
    matcher: 'toBeJsonString'
  }, {
    name: 'lessThanOrEqualTo',
    matcher: 'toBeLessThanOrEqualTo'
  }, {
    name: 'longerThan',
    matcher: 'toBeLongerThan'
  }, {
    name: 'nonEmptyArray',
    matcher: 'toBeNonEmptyArray'
  }, {
    name: 'nonEmptyObject',
    matcher: 'toBeNonEmptyObject'
  }, {
    name: 'nonEmptyString',
    matcher: 'toBeNonEmptyString'
  }, {
    name: 'oddNumber',
    matcher: 'toBeOddNumber'
  }, {
    name: 'sameLengthAs',
    matcher: 'toBeSameLengthAs'
  }, {
    name: 'shorterThan',
    matcher: 'toBeShorterThan'
  }, {
    name: 'whitespace',
    matcher: 'toBeWhitespace'
  }, {
    name: 'wholeNumber',
    matcher: 'toBeWholeNumber'
  }, {
    name: 'withinRange',
    matcher: 'toBeWithinRange'
  }, {
    name: 'endingWith',
    matcher: 'toEndWith'
  }, {
    name: 'startingWith',
    matcher: 'toStartWith'
  }],
  matcher: {
    toBeAfter: require('./toBeAfter'),
    toBeArray: require('./toBeArray'),
    toBeArrayOfBooleans: require('./toBeArrayOfBooleans'),
    toBeArrayOfNumbers: require('./toBeArrayOfNumbers'),
    toBeArrayOfObjects: require('./toBeArrayOfObjects'),
    toBeArrayOfSize: require('./toBeArrayOfSize'),
    toBeArrayOfStrings: require('./toBeArrayOfStrings'),
    toBeBefore: require('./toBeBefore'),
    toBeBoolean: require('./toBeBoolean'),
    toBeCalculable: require('./toBeCalculable'),
    toBeDate: require('./toBeDate'),
    toBeEmptyArray: require('./toBeEmptyArray'),
    toBeEmptyObject: require('./toBeEmptyObject'),
    toBeEmptyString: require('./toBeEmptyString'),
    toBeEvenNumber: require('./toBeEvenNumber'),
    toBeFalse: require('./toBeFalse'),
    toBeFunction: require('./toBeFunction'),
    toBeGreaterThanOrEqualTo: require('./toBeGreaterThanOrEqualTo'),
    toBeHtmlString: require('./toBeHtmlString'),
    toBeIso8601: require('./toBeIso8601'),
    toBeJsonString: require('./toBeJsonString'),
    toBeLessThanOrEqualTo: require('./toBeLessThanOrEqualTo'),
    toBeLongerThan: require('./toBeLongerThan'),
    toBeNonEmptyArray: require('./toBeNonEmptyArray'),
    toBeNonEmptyObject: require('./toBeNonEmptyObject'),
    toBeNonEmptyString: require('./toBeNonEmptyString'),
    toBeNumber: require('./toBeNumber'),
    toBeObject: require('./toBeObject'),
    toBeOddNumber: require('./toBeOddNumber'),
    toBeSameLengthAs: require('./toBeSameLengthAs'),
    toBeShorterThan: require('./toBeShorterThan'),
    toBeString: require('./toBeString'),
    toBeTrue: require('./toBeTrue'),
    toBeWhitespace: require('./toBeWhitespace'),
    toBeWholeNumber: require('./toBeWholeNumber'),
    toBeWithinRange: require('./toBeWithinRange'),
    toEndWith: require('./toEndWith'),
    toHaveArray: require('./toHaveArray'),
    toHaveArrayOfBooleans: require('./toHaveArrayOfBooleans'),
    toHaveArrayOfNumbers: require('./toHaveArrayOfNumbers'),
    toHaveArrayOfObjects: require('./toHaveArrayOfObjects'),
    toHaveArrayOfSize: require('./toHaveArrayOfSize'),
    toHaveArrayOfStrings: require('./toHaveArrayOfStrings'),
    toHaveBoolean: require('./toHaveBoolean'),
    toHaveCalculable: require('./toHaveCalculable'),
    toHaveDate: require('./toHaveDate'),
    toHaveDateAfter: require('./toHaveDateAfter'),
    toHaveDateBefore: require('./toHaveDateBefore'),
    toHaveEmptyArray: require('./toHaveEmptyArray'),
    toHaveEmptyObject: require('./toHaveEmptyObject'),
    toHaveEmptyString: require('./toHaveEmptyString'),
    toHaveEvenNumber: require('./toHaveEvenNumber'),
    toHaveFalse: require('./toHaveFalse'),
    toHaveHtmlString: require('./toHaveHtmlString'),
    toHaveIso8601: require('./toHaveIso8601'),
    toHaveJsonString: require('./toHaveJsonString'),
    toHaveMember: require('./toHaveMember'),
    toHaveMethod: require('./toHaveMethod'),
    toHaveNonEmptyArray: require('./toHaveNonEmptyArray'),
    toHaveNonEmptyObject: require('./toHaveNonEmptyObject'),
    toHaveNonEmptyString: require('./toHaveNonEmptyString'),
    toHaveNumber: require('./toHaveNumber'),
    toHaveNumberWithinRange: require('./toHaveNumberWithinRange'),
    toHaveObject: require('./toHaveObject'),
    toHaveOddNumber: require('./toHaveOddNumber'),
    toHaveString: require('./toHaveString'),
    toHaveStringLongerThan: require('./toHaveStringLongerThan'),
    toHaveStringSameLengthAs: require('./toHaveStringSameLengthAs'),
    toHaveStringShorterThan: require('./toHaveStringShorterThan'),
    toHaveTrue: require('./toHaveTrue'),
    toHaveWhitespaceString: require('./toHaveWhitespaceString'),
    toHaveWholeNumber: require('./toHaveWholeNumber'),
    toStartWith: require('./toStartWith'),
    toThrowAnyError: require('./toThrowAnyError'),
    toThrowErrorOfType: require('./toThrowErrorOfType'),
    toBeJsendSuccessObject: require('./toBeJsendSuccessObject'),
    toBeJsendErrorObject: require('./toBeJsendErrorObject'),
    toBeJsendFailObject: require('./toBeJsendFailObject'),
    toBeJsendObject: require('./toBeJsendObject'),
    toBeJsendSuccessString: require('./toBeJsendSuccessString'),
    toBeJsendErrorString: require('./toBeJsendErrorString'),
    toBeJsendFailString: require('./toBeJsendFailString'),
    toBeJsendString: require('./toBeJsendString')
  }
};

},{"./toBeAfter":15,"./toBeArray":16,"./toBeArrayOfBooleans":17,"./toBeArrayOfNumbers":18,"./toBeArrayOfObjects":19,"./toBeArrayOfSize":20,"./toBeArrayOfStrings":21,"./toBeBefore":22,"./toBeBoolean":23,"./toBeCalculable":24,"./toBeDate":25,"./toBeEmptyArray":26,"./toBeEmptyObject":27,"./toBeEmptyString":28,"./toBeEvenNumber":29,"./toBeFalse":30,"./toBeFunction":31,"./toBeGreaterThanOrEqualTo":32,"./toBeHtmlString":33,"./toBeIso8601":34,"./toBeJsendErrorObject":35,"./toBeJsendErrorString":36,"./toBeJsendFailObject":37,"./toBeJsendFailString":38,"./toBeJsendObject":39,"./toBeJsendString":40,"./toBeJsendSuccessObject":41,"./toBeJsendSuccessString":42,"./toBeJsonString":43,"./toBeLessThanOrEqualTo":44,"./toBeLongerThan":45,"./toBeNonEmptyArray":46,"./toBeNonEmptyObject":47,"./toBeNonEmptyString":48,"./toBeNumber":49,"./toBeObject":50,"./toBeOddNumber":51,"./toBeSameLengthAs":52,"./toBeShorterThan":53,"./toBeString":54,"./toBeTrue":55,"./toBeWhitespace":56,"./toBeWholeNumber":57,"./toBeWithinRange":58,"./toEndWith":59,"./toHaveArray":60,"./toHaveArrayOfBooleans":61,"./toHaveArrayOfNumbers":62,"./toHaveArrayOfObjects":63,"./toHaveArrayOfSize":64,"./toHaveArrayOfStrings":65,"./toHaveBoolean":66,"./toHaveCalculable":67,"./toHaveDate":68,"./toHaveDateAfter":69,"./toHaveDateBefore":70,"./toHaveEmptyArray":71,"./toHaveEmptyObject":72,"./toHaveEmptyString":73,"./toHaveEvenNumber":74,"./toHaveFalse":75,"./toHaveHtmlString":76,"./toHaveIso8601":77,"./toHaveJsonString":78,"./toHaveMember":79,"./toHaveMethod":80,"./toHaveNonEmptyArray":81,"./toHaveNonEmptyObject":82,"./toHaveNonEmptyString":83,"./toHaveNumber":84,"./toHaveNumberWithinRange":85,"./toHaveObject":86,"./toHaveOddNumber":87,"./toHaveString":88,"./toHaveStringLongerThan":89,"./toHaveStringSameLengthAs":90,"./toHaveStringShorterThan":91,"./toHaveTrue":92,"./toHaveWhitespaceString":93,"./toHaveWholeNumber":94,"./toStartWith":95,"./toThrowAnyError":96,"./toThrowErrorOfType":97}],8:[function(require,module,exports){
// modules
var reduce = require('./lib/reduce');
var api = require('./api');

// public
module.exports = reduce(api.asymmetricMatcher, register, {});

// implementation
function register(any, asymMatcher) {
  var matcher = api.matcher[asymMatcher.matcher];
  any[asymMatcher.name] = createFactory(matcher);
  return any;
}

function createFactory(matcher) {
  return function asymmetricMatcherFactory() {
    var args = [].slice.call(arguments);
    return {
      asymmetricMatch: function asymmetricMatcher(actual) {
        var clone = args.slice();
        clone.push(actual);
        return matcher.apply(this, clone);
      }
    };
  };
}

},{"./api":7,"./lib/reduce":14}],9:[function(require,module,exports){
(function (global){
// 3rd party modules
var loader = require('jasmine-matchers-loader');

// modules
var api = require('./api');
var asymmetricMatchers = require('./asymmetricMatchers');

// public
module.exports = api.matcher;

// implementation
loader.add(api.matcher);
global.any = asymmetricMatchers;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./api":7,"./asymmetricMatchers":8,"jasmine-matchers-loader":1}],10:[function(require,module,exports){
// public
module.exports = function every(array, truthTest) {
  for (var i = 0, len = array.length; i < len; i++) {
    if (truthTest(array[i])) {
      return true;
    }
  }
  return false;
};

},{}],11:[function(require,module,exports){
// public
module.exports = function every(array, truthTest) {
  for (var i = 0, len = array.length; i < len; i++) {
    if (!truthTest(array[i])) {
      return false;
    }
  }
  return true;
};

},{}],12:[function(require,module,exports){
// public
module.exports = function is(value, type) {
  return Object.prototype.toString.call(value) === '[object ' + type + ']';
};

},{}],13:[function(require,module,exports){
// modules
var reduce = require('./reduce');

// public
module.exports = function keys(object) {
  return reduce(object, function (keys, value, key) {
    return keys.concat(key);
  }, []);
};

},{"./reduce":14}],14:[function(require,module,exports){
// modules
var is = require('./is');

// public
module.exports = function reduce(collection, fn, memo) {
  if (is(collection, 'Array')) {
    for (var i = 0, len = collection.length; i < len; i++) {
      memo = fn(memo, collection[i], i, collection);
    }
  } else {
    for (var key in collection) {
      if ({}.hasOwnProperty.call(collection, key)) {
        memo = fn(memo, collection[key], key, collection);
      }
    }
  }
  return memo;
};

},{"./is":12}],15:[function(require,module,exports){
// modules
var toBeBefore = require('./toBeBefore');

// public
module.exports = function toBeAfter(otherDate, actual) {
  return toBeBefore(actual, otherDate);
};

},{"./toBeBefore":22}],16:[function(require,module,exports){
// modules
var is = require('./lib/is');

// public
module.exports = function toBeArray(actual) {
  return is(actual, 'Array');
};

},{"./lib/is":12}],17:[function(require,module,exports){
// modules
var every = require('./lib/every');
var toBeArray = require('./toBeArray');
var toBeBoolean = require('./toBeBoolean');

// public
module.exports = function toBeArrayOfBooleans(actual) {
  return toBeArray(actual) && every(actual, toBeBoolean);
};

},{"./lib/every":11,"./toBeArray":16,"./toBeBoolean":23}],18:[function(require,module,exports){
// modules
var every = require('./lib/every');
var toBeArray = require('./toBeArray');
var toBeNumber = require('./toBeNumber');

// public
module.exports = function toBeArrayOfBooleans(actual) {
  return toBeArray(actual) && every(actual, toBeNumber);
};

},{"./lib/every":11,"./toBeArray":16,"./toBeNumber":49}],19:[function(require,module,exports){
// modules
var every = require('./lib/every');
var toBeArray = require('./toBeArray');
var toBeObject = require('./toBeObject');

// public
module.exports = function toBeArrayOfBooleans(actual) {
  return toBeArray(actual) && every(actual, toBeObject);
};

},{"./lib/every":11,"./toBeArray":16,"./toBeObject":50}],20:[function(require,module,exports){
// modules
var toBeArray = require('./toBeArray');

// public
module.exports = function toBeArrayOfSize(size, actual) {
  return toBeArray(actual) && actual.length === size;
};

},{"./toBeArray":16}],21:[function(require,module,exports){
// modules
var every = require('./lib/every');
var toBeArray = require('./toBeArray');
var toBeString = require('./toBeString');

// public
module.exports = function toBeArrayOfStrings(actual) {
  return toBeArray(actual) && every(actual, toBeString);
};

},{"./lib/every":11,"./toBeArray":16,"./toBeString":54}],22:[function(require,module,exports){
// modules
var toBeDate = require('./toBeDate');

// public
module.exports = function toBeBefore(otherDate, actual) {
  return toBeDate(actual) && toBeDate(otherDate) && actual.getTime() < otherDate.getTime();
};

},{"./toBeDate":25}],23:[function(require,module,exports){
// modules
var is = require('./lib/is');

// public
module.exports = function toBeBoolean(actual) {
  return is(actual, 'Boolean');
};

},{"./lib/is":12}],24:[function(require,module,exports){
// public
module.exports = toBeCalculable;

// Assert subject can be used in Mathemetic calculations despite not being a
// Number, for example `"1" * "2" === 2` whereas `"wut?" * 2 === NaN`.
function toBeCalculable(actual) {
  return !isNaN(actual * 2);
}

},{}],25:[function(require,module,exports){
// modules
var is = require('./lib/is');

// public
module.exports = function toBeDate(actual) {
  return is(actual, 'Date');
};

},{"./lib/is":12}],26:[function(require,module,exports){
// modules
var toBeArrayOfSize = require('./toBeArrayOfSize');

// public
module.exports = function toBeEmptyArray(actual) {
  return toBeArrayOfSize(0, actual);
};

},{"./toBeArrayOfSize":20}],27:[function(require,module,exports){
// modules
var is = require('./lib/is');
var keys = require('./lib/keys');

// public
module.exports = function toBeEmptyObject(actual) {
  return is(actual, 'Object') && keys(actual).length === 0;
};

},{"./lib/is":12,"./lib/keys":13}],28:[function(require,module,exports){
// public
module.exports = function toBeEmptyString(actual) {
  return actual === '';
};

},{}],29:[function(require,module,exports){
// modules
var toBeNumber = require('./toBeNumber');

// public
module.exports = function toBeEvenNumber(actual) {
  return toBeNumber(actual) && actual % 2 === 0;
};

},{"./toBeNumber":49}],30:[function(require,module,exports){
// modules
var is = require('./lib/is');

// public
module.exports = function toBeFalse(actual) {
  return actual === false || (is(actual, 'Boolean') && actual.valueOf() === false);
};

},{"./lib/is":12}],31:[function(require,module,exports){
// modules
var is = require('./lib/is');

// public
module.exports = function toBeFunction(actual) {
  return is(actual, 'Function');
};

},{"./lib/is":12}],32:[function(require,module,exports){
// modules
var toBeNumber = require('./toBeNumber');

// public
module.exports = function toBeGreaterThanOrEqualTo(otherNumber, actual) {
  return toBeNumber(actual) && actual >= otherNumber;
};

},{"./toBeNumber":49}],33:[function(require,module,exports){
// modules
var toBeString = require('./toBeString');

// public
module.exports = function toBeHtmlString(actual) {
  // <           start with opening tag "<"
  //  (          start group 1
  //    "[^"]*"  allow string in "double quotes"
  //    |        OR
  //    '[^']*'  allow string in "single quotes"
  //    |        OR
  //    [^'">]   cant contains one single quotes, double quotes and ">"
  //  )          end group 1
  //  *          0 or more
  // >           end with closing tag ">"
  return toBeString(actual) && actual.search(/<("[^"]*"|'[^']*'|[^'">])*>/) !== -1;
};

},{"./toBeString":54}],34:[function(require,module,exports){
// modules
var any = require('./lib/any');
var toBeString = require('./toBeString');

// public
module.exports = toBeIso8601;

// implementation
var patterns = [
  'nnnn-nn-nn',
  'nnnn-nn-nnTnn:nn',
  'nnnn-nn-nnTnn:nn:nn',
  'nnnn-nn-nnTnn:nn:nn.nnn',
  'nnnn-nn-nnTnn:nn:nn.nnnZ'
];

function toBeIso8601(actual) {
  return toBeString(actual) && any(patterns, matches) && new Date(actual).toString() !== 'Invalid Date';

  function matches(pattern) {
    var regex = '^' + expand(pattern) + '$';
    return actual.search(new RegExp(regex)) !== -1;
  }
}

function expand(pattern) {
  return pattern
    .split('-').join('\\-')
    .split('.').join('\\.')
    .split('nnnn').join('([0-9]{4})')
    .split('nnn').join('([0-9]{3})')
    .split('nn').join('([0-9]{2})');
}

},{"./lib/any":10,"./toBeString":54}],35:[function(require,module,exports){
const is = require('./lib/is');

// public
module.exports = function toBeJsendErrorObject(actual) {
  try {
    return is(actual, 'Object') &&
      // Expect status & message props:
      actual.status === 'error' &&
      is(actual.message, 'String') && actual.message.length > 0;
  } catch (err) {
    return false;
  }
};

},{"./lib/is":12}],36:[function(require,module,exports){
const toBeJsendErrorObject = require('./toBeJsendErrorObject');

// public
module.exports = function toBeJsendErrorString(actual) {
  try {
    return toBeJsendErrorObject(JSON.parse(actual));
  } catch (err) {
    return false;
  }
};

},{"./toBeJsendErrorObject":35}],37:[function(require,module,exports){
const is = require('./lib/is');
var keys = require('./lib/keys');

// public
module.exports = function toBeJsendFailObject(actual) {
  try {
    return is(actual, 'Object') &&
      // Expect status & data props:
      // According to the spec, the data for a fail is "an object explaining what went wrong, typically a hash of validation errors".
      // In the spirit of that wording, this expects data to be a non-empty object.
      // More info: https://labs.omniti.com/labs/jsend
      actual.status === 'fail' &&
      is(actual.data, 'Object') &&
      keys(actual).length > 0;
  } catch (err) {
    return false;
  }
};

},{"./lib/is":12,"./lib/keys":13}],38:[function(require,module,exports){
const toBeJsendFailObject = require('./toBeJsendFailObject');

// public
module.exports = function toBeJsendFailString(actual) {
  try {
    return toBeJsendFailObject(JSON.parse(actual));
  } catch (err) {
    return false;
  }
};

},{"./toBeJsendFailObject":37}],39:[function(require,module,exports){
const toBeJsendFailObject = require('./toBeJsendFailObject');
const toBeJsendErrorObject = require('./toBeJsendErrorObject');
const toBeJsendSuccessObject = require('./toBeJsendSuccessObject');

// public
module.exports = function toBeJsendObject(actual) {
  try {
    return Boolean(actual) && Boolean(actual.status) && (toBeJsendSuccessObject(actual) || toBeJsendErrorObject(actual) || toBeJsendFailObject(actual));
  } catch (err) {
    return false;
  }
};

},{"./toBeJsendErrorObject":35,"./toBeJsendFailObject":37,"./toBeJsendSuccessObject":41}],40:[function(require,module,exports){
const toBeJsendObject = require('./toBeJsendObject');

// public
module.exports = function toBeJsendString(actual) {
  try {
    return toBeJsendObject(JSON.parse(actual));
  } catch (err) {
    return false;
  }
};

},{"./toBeJsendObject":39}],41:[function(require,module,exports){
const is = require('./lib/is');

// public
module.exports = function toBeJsendSuccessObject(actual) {
  try {
    return is(actual, 'Object') &&
      // Expect status & data props:
      actual.status === 'success' &&
      (actual.data === null ||
        is(actual.data, 'Object') ||
        is(actual.data, 'Array') ||
        is(actual.data, 'String') ||
        is(actual.data, 'Number') ||
        is(actual.data, 'Boolean')
      );
  } catch (err) {
    return false;
  }
};

},{"./lib/is":12}],42:[function(require,module,exports){
const toBeJsendSuccessObject = require('./toBeJsendSuccessObject');

// public
module.exports = function toBeJsendSuccessString(actual) {
  try {
    return toBeJsendSuccessObject(JSON.parse(actual));
  } catch (err) {
    return false;
  }
};

},{"./toBeJsendSuccessObject":41}],43:[function(require,module,exports){
// public
module.exports = function toBeJsonString(actual) {
  try {
    return JSON.parse(actual) !== null;
  } catch (err) {
    return false;
  }
};

},{}],44:[function(require,module,exports){
// modules
var toBeNumber = require('./toBeNumber');

// public
module.exports = function toBeLessThanOrEqualTo(otherNumber, actual) {
  return toBeNumber(actual) && actual <= otherNumber;
};

},{"./toBeNumber":49}],45:[function(require,module,exports){
// modules
var toBeString = require('./toBeString');

// public
module.exports = function toBeLongerThan(otherString, actual) {
  return toBeString(actual) && toBeString(otherString) && actual.length > otherString.length;
};

},{"./toBeString":54}],46:[function(require,module,exports){
// modules
var is = require('./lib/is');

// public
module.exports = function toBeNonEmptyArray(actual) {
  return is(actual, 'Array') && actual.length > 0;
};

},{"./lib/is":12}],47:[function(require,module,exports){
// modules
var is = require('./lib/is');
var keys = require('./lib/keys');

// public
module.exports = function toBeNonEmptyObject(actual) {
  return is(actual, 'Object') && keys(actual).length > 0;
};

},{"./lib/is":12,"./lib/keys":13}],48:[function(require,module,exports){
// modules
var toBeString = require('./toBeString');

// public
module.exports = function toBeNonEmptyString(actual) {
  return toBeString(actual) && actual.length > 0;
};

},{"./toBeString":54}],49:[function(require,module,exports){
// modules
var is = require('./lib/is');

// public
module.exports = function toBeNumber(actual) {
  return !isNaN(parseFloat(actual)) && !is(actual, 'String');
};

},{"./lib/is":12}],50:[function(require,module,exports){
// modules
var is = require('./lib/is');

// public
module.exports = function toBeObject(actual) {
  return is(actual, 'Object');
};

},{"./lib/is":12}],51:[function(require,module,exports){
// modules
var toBeNumber = require('./toBeNumber');

// public
module.exports = function toBeOddNumber(actual) {
  return toBeNumber(actual) && actual % 2 !== 0;
};

},{"./toBeNumber":49}],52:[function(require,module,exports){
// modules
var toBeString = require('./toBeString');

// public
module.exports = function toBeSameLengthAs(otherString, actual) {
  return toBeString(actual) && toBeString(otherString) && actual.length === otherString.length;
};

},{"./toBeString":54}],53:[function(require,module,exports){
// modules
var toBeString = require('./toBeString');

// public
module.exports = function toBeShorterThan(otherString, actual) {
  return toBeString(actual) && toBeString(otherString) && actual.length < otherString.length;
};

},{"./toBeString":54}],54:[function(require,module,exports){
// modules
var is = require('./lib/is');

// public
module.exports = function toBeString(actual) {
  return is(actual, 'String');
};

},{"./lib/is":12}],55:[function(require,module,exports){
// modules
var is = require('./lib/is');

// public
module.exports = function toBeTrue(actual) {
  return actual === true || (is(actual, 'Boolean') && actual.valueOf() === true);
};

},{"./lib/is":12}],56:[function(require,module,exports){
// modules
var toBeString = require('./toBeString');

// public
module.exports = function toBeWhitespace(actual) {
  return toBeString(actual) && actual.search(/\S/) === -1;
};

},{"./toBeString":54}],57:[function(require,module,exports){
// modules
var toBeNumber = require('./toBeNumber');

// public
module.exports = function toBeWholeNumber(actual) {
  return toBeNumber(actual) && (
        actual === 0 || actual % 1 === 0
    );
};

},{"./toBeNumber":49}],58:[function(require,module,exports){
// modules
var toBeNumber = require('./toBeNumber');

// public
module.exports = function toBeWithinRange(floor, ceiling, actual) {
  return toBeNumber(actual) && actual >= floor && actual <= ceiling;
};

},{"./toBeNumber":49}],59:[function(require,module,exports){
// modules
var toBeNonEmptyString = require('./toBeNonEmptyString');

// public
module.exports = function toEndWith(subString, actual) {
  if (!toBeNonEmptyString(actual) || !toBeNonEmptyString(subString)) {
    return false;
  }
  return actual.slice(actual.length - subString.length, actual.length) === subString;
};

},{"./toBeNonEmptyString":48}],60:[function(require,module,exports){
// modules
var toBeObject = require('./toBeObject');
var toBeArray = require('./toBeArray');

// public
module.exports = function toHaveArray(key, actual) {
  return toBeObject(actual) && toBeArray(actual[key]);
};

},{"./toBeArray":16,"./toBeObject":50}],61:[function(require,module,exports){
// modules
var toBeObject = require('./toBeObject');
var toBeArrayOfBooleans = require('./toBeArrayOfBooleans');

// public
module.exports = function toHaveArrayOfBooleans(key, actual) {
  return toBeObject(actual) && toBeArrayOfBooleans(actual[key]);
};

},{"./toBeArrayOfBooleans":17,"./toBeObject":50}],62:[function(require,module,exports){
// modules
var toBeObject = require('./toBeObject');
var toBeArrayOfNumbers = require('./toBeArrayOfNumbers');

// public
module.exports = function toHaveArrayOfNumbers(key, actual) {
  return toBeObject(actual) && toBeArrayOfNumbers(actual[key]);
};

},{"./toBeArrayOfNumbers":18,"./toBeObject":50}],63:[function(require,module,exports){
// modules
var toBeObject = require('./toBeObject');
var toBeArrayOfObjects = require('./toBeArrayOfObjects');

// public
module.exports = function toHaveArrayOfObjects(key, actual) {
  return toBeObject(actual) && toBeArrayOfObjects(actual[key]);
};

},{"./toBeArrayOfObjects":19,"./toBeObject":50}],64:[function(require,module,exports){
// modules
var toBeObject = require('./toBeObject');
var toBeArrayOfSize = require('./toBeArrayOfSize');

// public
module.exports = function toHaveArrayOfSize(key, size, actual) {
  return toBeObject(actual) && toBeArrayOfSize(size, actual[key]);
};

},{"./toBeArrayOfSize":20,"./toBeObject":50}],65:[function(require,module,exports){
// modules
var toBeObject = require('./toBeObject');
var toBeArrayOfStrings = require('./toBeArrayOfStrings');

// public
module.exports = function toHaveArrayOfStrings(key, actual) {
  return toBeObject(actual) && toBeArrayOfStrings(actual[key]);
};

},{"./toBeArrayOfStrings":21,"./toBeObject":50}],66:[function(require,module,exports){
// modules
var toBeObject = require('./toBeObject');
var toBeBoolean = require('./toBeBoolean');

// public
module.exports = function toHaveBoolean(key, actual) {
  return toBeObject(actual) && toBeBoolean(actual[key]);
};

},{"./toBeBoolean":23,"./toBeObject":50}],67:[function(require,module,exports){
// modules
var toBeObject = require('./toBeObject');
var toBeCalculable = require('./toBeCalculable');

// public
module.exports = function toHaveCalculable(key, actual) {
  return toBeObject(actual) && toBeCalculable(actual[key]);
};

},{"./toBeCalculable":24,"./toBeObject":50}],68:[function(require,module,exports){
// modules
var toBeObject = require('./toBeObject');
var toBeDate = require('./toBeDate');

// public
module.exports = function toHaveDate(key, actual) {
  return toBeObject(actual) && toBeDate(actual[key]);
};

},{"./toBeDate":25,"./toBeObject":50}],69:[function(require,module,exports){
// modules
var toBeObject = require('./toBeObject');
var toBeAfter = require('./toBeAfter');

// public
module.exports = function toHaveDateAfter(key, date, actual) {
  return toBeObject(actual) && toBeAfter(date, actual[key]);
};

},{"./toBeAfter":15,"./toBeObject":50}],70:[function(require,module,exports){
// modules
var toBeObject = require('./toBeObject');
var toBeBefore = require('./toBeBefore');

// public
module.exports = function toHaveDateBefore(key, date, actual) {
  return toBeObject(actual) && toBeBefore(date, actual[key]);
};

},{"./toBeBefore":22,"./toBeObject":50}],71:[function(require,module,exports){
// modules
var toBeObject = require('./toBeObject');
var toBeEmptyArray = require('./toBeEmptyArray');

// public
module.exports = function toHaveEmptyArray(key, actual) {
  return toBeObject(actual) && toBeEmptyArray(actual[key]);
};

},{"./toBeEmptyArray":26,"./toBeObject":50}],72:[function(require,module,exports){
// modules
var toBeObject = require('./toBeObject');
var toBeEmptyObject = require('./toBeEmptyObject');

// public
module.exports = function toHaveEmptyObject(key, actual) {
  return toBeObject(actual) && toBeEmptyObject(actual[key]);
};

},{"./toBeEmptyObject":27,"./toBeObject":50}],73:[function(require,module,exports){
// modules
var toBeObject = require('./toBeObject');
var toBeEmptyString = require('./toBeEmptyString');

// public
module.exports = function toHaveEmptyString(key, actual) {
  return toBeObject(actual) && toBeEmptyString(actual[key]);
};

},{"./toBeEmptyString":28,"./toBeObject":50}],74:[function(require,module,exports){
// modules
var toBeObject = require('./toBeObject');
var toBeEvenNumber = require('./toBeEvenNumber');

// public
module.exports = function toHaveEvenNumber(key, actual) {
  return toBeObject(actual) && toBeEvenNumber(actual[key]);
};

},{"./toBeEvenNumber":29,"./toBeObject":50}],75:[function(require,module,exports){
// modules
var toBeObject = require('./toBeObject');
var toBeFalse = require('./toBeFalse');

// public
module.exports = function toHaveFalse(key, actual) {
  return toBeObject(actual) && toBeFalse(actual[key]);
};

},{"./toBeFalse":30,"./toBeObject":50}],76:[function(require,module,exports){
// modules
var toBeObject = require('./toBeObject');
var toBeHtmlString = require('./toBeHtmlString');

// public
module.exports = function toHaveHtmlString(key, actual) {
  return toBeObject(actual) && toBeHtmlString(actual[key]);
};

},{"./toBeHtmlString":33,"./toBeObject":50}],77:[function(require,module,exports){
// modules
var toBeObject = require('./toBeObject');
var toBeIso8601 = require('./toBeIso8601');

// public
module.exports = toHaveIso8601;

function toHaveIso8601(key, actual) {
  return toBeObject(actual) && toBeIso8601(actual[key]);
}

},{"./toBeIso8601":34,"./toBeObject":50}],78:[function(require,module,exports){
// modules
var toBeObject = require('./toBeObject');
var toBeJsonString = require('./toBeJsonString');

// public
module.exports = function toHaveJsonString(key, actual) {
  return toBeObject(actual) && toBeJsonString(actual[key]);
};

},{"./toBeJsonString":43,"./toBeObject":50}],79:[function(require,module,exports){
// modules
var toBeObject = require('./toBeObject');
var toBeString = require('./toBeString');

// public
module.exports = function toHaveMember(key, actual) {
  return toBeString(key) && toBeObject(actual) && key in actual;
};

},{"./toBeObject":50,"./toBeString":54}],80:[function(require,module,exports){
// modules
var toBeObject = require('./toBeObject');
var toBeFunction = require('./toBeFunction');

// public
module.exports = function toHaveMethod(key, actual) {
  return toBeObject(actual) && toBeFunction(actual[key]);
};

},{"./toBeFunction":31,"./toBeObject":50}],81:[function(require,module,exports){
// modules
var toBeObject = require('./toBeObject');
var toBeNonEmptyArray = require('./toBeNonEmptyArray');

// public
module.exports = function toHaveNonEmptyArray(key, actual) {
  return toBeObject(actual) && toBeNonEmptyArray(actual[key]);
};

},{"./toBeNonEmptyArray":46,"./toBeObject":50}],82:[function(require,module,exports){
// modules
var toBeObject = require('./toBeObject');
var toBeNonEmptyObject = require('./toBeNonEmptyObject');

// public
module.exports = function toHaveNonEmptyObject(key, actual) {
  return toBeObject(actual) && toBeNonEmptyObject(actual[key]);
};

},{"./toBeNonEmptyObject":47,"./toBeObject":50}],83:[function(require,module,exports){
// modules
var toBeObject = require('./toBeObject');
var toBeNonEmptyString = require('./toBeNonEmptyString');

// public
module.exports = function toHaveNonEmptyString(key, actual) {
  return toBeObject(actual) && toBeNonEmptyString(actual[key]);
};

},{"./toBeNonEmptyString":48,"./toBeObject":50}],84:[function(require,module,exports){
// modules
var toBeObject = require('./toBeObject');
var toBeNumber = require('./toBeNumber');

// public
module.exports = function toHaveNumber(key, actual) {
  return toBeObject(actual) && toBeNumber(actual[key]);
};

},{"./toBeNumber":49,"./toBeObject":50}],85:[function(require,module,exports){
// modules
var toBeObject = require('./toBeObject');
var toBeWithinRange = require('./toBeWithinRange');

// public
module.exports = function toHaveNumberWithinRange(key, floor, ceiling, actual) {
  return toBeObject(actual) && toBeWithinRange(floor, ceiling, actual[key]);
};

},{"./toBeObject":50,"./toBeWithinRange":58}],86:[function(require,module,exports){
// modules
var toBeObject = require('./toBeObject');

// public
module.exports = function toHaveObject(key, actual) {
  return toBeObject(actual) && toBeObject(actual[key]);
};

},{"./toBeObject":50}],87:[function(require,module,exports){
var toBeObject = require('./toBeObject');
var toBeOddNumber = require('./toBeOddNumber');

// public
module.exports = function toHaveOddNumber(key, actual) {
  return toBeObject(actual) && toBeOddNumber(actual[key]);
};

},{"./toBeObject":50,"./toBeOddNumber":51}],88:[function(require,module,exports){
// modules
var toBeObject = require('./toBeObject');
var toBeString = require('./toBeString');

// public
module.exports = function toHaveString(key, actual) {
  return toBeObject(actual) && toBeString(actual[key]);
};

},{"./toBeObject":50,"./toBeString":54}],89:[function(require,module,exports){
// modules
var toBeObject = require('./toBeObject');
var toBeLongerThan = require('./toBeLongerThan');

// public
module.exports = function toHaveStringLongerThan(key, other, actual) {
  return toBeObject(actual) && toBeLongerThan(other, actual[key]);
};

},{"./toBeLongerThan":45,"./toBeObject":50}],90:[function(require,module,exports){
// modules
var toBeObject = require('./toBeObject');
var toBeSameLengthAs = require('./toBeSameLengthAs');

// public
module.exports = function toHaveStringSameLengthAs(key, other, actual) {
  return toBeObject(actual) && toBeSameLengthAs(other, actual[key]);
};

},{"./toBeObject":50,"./toBeSameLengthAs":52}],91:[function(require,module,exports){
// modules
var toBeObject = require('./toBeObject');
var toBeShorterThan = require('./toBeShorterThan');

// public
module.exports = function toHaveStringShorterThan(key, other, actual) {
  return toBeObject(actual) && toBeShorterThan(other, actual[key]);
};

},{"./toBeObject":50,"./toBeShorterThan":53}],92:[function(require,module,exports){
// modules
var toBeObject = require('./toBeObject');
var toBeTrue = require('./toBeTrue');

// public
module.exports = function toHaveTrue(key, actual) {
  return toBeObject(actual) && toBeTrue(actual[key]);
};

},{"./toBeObject":50,"./toBeTrue":55}],93:[function(require,module,exports){
// modules
var toBeObject = require('./toBeObject');
var toBeWhitespace = require('./toBeWhitespace');

// public
module.exports = function toHaveWhitespaceString(key, actual) {
  return toBeObject(actual) && toBeWhitespace(actual[key]);
};

},{"./toBeObject":50,"./toBeWhitespace":56}],94:[function(require,module,exports){
// modules
var toBeObject = require('./toBeObject');
var toBeWholeNumber = require('./toBeWholeNumber');

// public
module.exports = function toHaveWholeNumber(key, actual) {
  return toBeObject(actual) && toBeWholeNumber(actual[key]);
};

},{"./toBeObject":50,"./toBeWholeNumber":57}],95:[function(require,module,exports){
// modules
var toBeNonEmptyString = require('./toBeNonEmptyString');

// public
module.exports = function toStartWith(subString, actual) {
  if (!toBeNonEmptyString(actual) || !toBeNonEmptyString(subString)) {
    return false;
  }
  return actual.slice(0, subString.length) === subString;
};

},{"./toBeNonEmptyString":48}],96:[function(require,module,exports){
// public
module.exports = function toThrowAnyError(actual) {
  try {
    actual();
    return false;
  } catch (err) {
    return true;
  }
};

},{}],97:[function(require,module,exports){
// public
module.exports = function toThrowErrorOfType(type, actual) {
  try {
    actual();
    return false;
  } catch (err) {
    return err.name === type;
  }
};

},{}]},{},[9]);
