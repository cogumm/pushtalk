/*! AeroGear JavaScript Library - v1.3.0-dev - 2013-09-05
* https://github.com/aerogear/aerogear-js
* JBoss, Home of Professional Open Source
* Copyright Red Hat, Inc., and individual contributors
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
* http://www.apache.org/licenses/LICENSE-2.0
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
    The AeroGear namespace provides a way to encapsulate the library's properties and methods away from the global namespace
    @namespace
 */
this.AeroGear = {};

/**
    AeroGear.Core is a base for all of the library modules to extend. It is not to be instantiated and will throw an error when attempted
    @class
    @private
 */
AeroGear.Core = function() {
    // Prevent instantiation of this base class
    if ( this instanceof AeroGear.Core ) {
        throw "Invalid instantiation of base class AeroGear.Core";
    }

    /**
        This function is used by the different parts of AeroGear to add a new Object to its respective collection.
        @name AeroGear.add
        @method
        @param {String|Array|Object} config - This can be a variety of types specifying how to create the object. See the particular constructor for the object calling .add for more info.
        @returns {Object} The object containing the collection that was updated
     */
    this.add = function( config ) {
        var i,
            current,
            collection = this[ this.collectionName ] || {};

        if ( !config ) {
            return this;
        } else if ( typeof config === "string" ) {
            // config is a string so use default adapter type
            collection[ config ] = AeroGear[ this.lib ].adapters[ this.type ]( config );
        } else if ( AeroGear.isArray( config ) ) {
            // config is an array so loop through each item in the array
            for ( i = 0; i < config.length; i++ ) {
                current = config[ i ];

                if ( typeof current === "string" ) {
                    collection[ current ] = AeroGear[ this.lib ].adapters[ this.type ]( current );
                } else {
                    collection[ current.name ] = AeroGear[ this.lib ].adapters[ current.type || this.type ]( current.name, current.settings || {} );
                }
            }
        } else {
            // config is an object so use that signature
            collection[ config.name ] = AeroGear[ this.lib ].adapters[ config.type || this.type ]( config.name, config.settings || {} );
        }

        // reset the collection instance
        this[ this.collectionName ] = collection;

        return this;
    };
    /**
        This function is used internally by pipeline, datamanager, etc. to remove an Object (pipe, store, etc.) from the respective collection.
        @name AeroGear.remove
        @method
        @param {String|String[]|Object[]|Object} config - This can be a variety of types specifying how to remove the object. See the particular constructor for the object calling .remove for more info.
        @returns {Object} The object containing the collection that was updated
     */
    this.remove = function( config ) {
        var i,
            current,
            collection = this[ this.collectionName ] || {};

        if ( typeof config === "string" ) {
            // config is a string so delete that item by name
            delete collection[ config ];
        } else if ( AeroGear.isArray( config ) ) {
            // config is an array so loop through each item in the array
            for ( i = 0; i < config.length; i++ ) {
                current = config[ i ];

                if ( typeof current === "string" ) {
                    delete collection[ current ];
                } else {
                    delete collection[ current.name ];
                }
            }
        } else if ( config ) {
            // config is an object so use that signature
            delete collection[ config.name ];
        }

        // reset the collection instance
        this[ this.collectionName ] = collection;

        return this;
    };
};

/**
    Utility function to test if an object is an Array
    @private
    @method
    @param {Object} obj - This can be any object to test
*/
AeroGear.isArray = function( obj ) {
    return ({}).toString.call( obj ) === "[object Array]";
};

/**
    This callback is executed when an HTTP request completes whether it was successful or not.
    @callback AeroGear~completeCallbackREST
    @param {Object} jqXHR - The jQuery specific XHR object
    @param {String} textStatus - The text status message returned from the server
 */
/**
    This callback is executed when an HTTP error is encountered during a request.
    @callback AeroGear~errorCallbackREST
    @param {Object} jqXHR - The jQuery specific XHR object
    @param {String} textStatus - The text status message returned from the server
    @param {Object} errorThrown - The HTTP error thrown which caused the is callback to be called
 */
/**
    This callback is executed when an HTTP success message is returned during a request.
    @callback AeroGear~successCallbackREST
    @param {Object} data - The data, if any, returned in the response
    @param {String} textStatus - The text status message returned from the server
    @param {Object} jqXHR - The jQuery specific XHR object
 */
/**
    This callback is executed when an error is encountered saving to local or session storage.
    @callback AeroGear~errorCallbackStorage
    @param {Object} errorThrown - The HTTP error thrown which caused the is callback to be called
    @param {Object|Array} data - An object or array of objects representing the data for the failed save attempt.
 */
/**
    This callback is executed when data is successfully saved to session or local storage.
    @callback AeroGear~successCallbackStorage
    @param {Object} data - The updated data object after the new saved data has been added
 */

//     node-uuid/uuid.js
//
//     Copyright (c) 2010 Robert Kieffer
//     Dual licensed under the MIT and GPL licenses.
//     Documentation and details at https://github.com/broofa/node-uuid
(function() {
  var _global = this;

  // Unique ID creation requires a high quality random # generator, but
  // Math.random() does not guarantee "cryptographic quality".  So we feature
  // detect for more robust APIs, normalizing each method to return 128-bits
  // (16 bytes) of random data.
  var mathRNG, nodeRNG, whatwgRNG;

  // Math.random()-based RNG.  All platforms, very fast, unknown quality
  var _rndBytes = new Array(16);
  mathRNG = function() {
    var r, b = _rndBytes, i = 0;

    for (var i = 0, r; i < 16; i++) {
      if ((i & 0x03) == 0) r = Math.random() * 0x100000000;
      b[i] = r >>> ((i & 0x03) << 3) & 0xff;
    }

    return b;
  }

  // WHATWG crypto-based RNG - http://wiki.whatwg.org/wiki/Crypto
  // WebKit only (currently), moderately fast, high quality
  if (_global.crypto && crypto.getRandomValues) {
    var _rnds = new Uint32Array(4);
    whatwgRNG = function() {
      crypto.getRandomValues(_rnds);

      for (var c = 0 ; c < 16; c++) {
        _rndBytes[c] = _rnds[c >> 2] >>> ((c & 0x03) * 8) & 0xff;
      }
      return _rndBytes;
    }
  }

  // Node.js crypto-based RNG - http://nodejs.org/docs/v0.6.2/api/crypto.html
  // Node.js only, moderately fast, high quality
  try {
    var _rb = require('crypto').randomBytes;
    nodeRNG = _rb && function() {
      return _rb(16);
    };
  } catch (e) {}

  // Select RNG with best quality
  var _rng = nodeRNG || whatwgRNG || mathRNG;

  // Buffer class to use
  var BufferClass = typeof(Buffer) == 'function' ? Buffer : Array;

  // Maps for number <-> hex string conversion
  var _byteToHex = [];
  var _hexToByte = {};
  for (var i = 0; i < 256; i++) {
    _byteToHex[i] = (i + 0x100).toString(16).substr(1);
    _hexToByte[_byteToHex[i]] = i;
  }

  // **`parse()` - Parse a UUID into it's component bytes**
  function parse(s, buf, offset) {
    var i = (buf && offset) || 0, ii = 0;

    buf = buf || [];
    s.toLowerCase().replace(/[0-9a-f]{2}/g, function(byte) {
      if (ii < 16) { // Don't overflow!
        buf[i + ii++] = _hexToByte[byte];
      }
    });

    // Zero out remaining bytes if string was short
    while (ii < 16) {
      buf[i + ii++] = 0;
    }

    return buf;
  }

  // **`unparse()` - Convert UUID byte array (ala parse()) into a string**
  function unparse(buf, offset) {
    var i = offset || 0, bth = _byteToHex;
    return  bth[buf[i++]] + bth[buf[i++]] +
            bth[buf[i++]] + bth[buf[i++]] + '-' +
            bth[buf[i++]] + bth[buf[i++]] + '-' +
            bth[buf[i++]] + bth[buf[i++]] + '-' +
            bth[buf[i++]] + bth[buf[i++]] + '-' +
            bth[buf[i++]] + bth[buf[i++]] +
            bth[buf[i++]] + bth[buf[i++]] +
            bth[buf[i++]] + bth[buf[i++]];
  }

  // **`v1()` - Generate time-based UUID**
  //
  // Inspired by https://github.com/LiosK/UUID.js
  // and http://docs.python.org/library/uuid.html

  // random #'s we need to init node and clockseq
  var _seedBytes = _rng();

  // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
  var _nodeId = [
    _seedBytes[0] | 0x01,
    _seedBytes[1], _seedBytes[2], _seedBytes[3], _seedBytes[4], _seedBytes[5]
  ];

  // Per 4.2.2, randomize (14 bit) clockseq
  var _clockseq = (_seedBytes[6] << 8 | _seedBytes[7]) & 0x3fff;

  // Previous uuid creation time
  var _lastMSecs = 0, _lastNSecs = 0;

  // See https://github.com/broofa/node-uuid for API details
  function v1(options, buf, offset) {
    var i = buf && offset || 0;
    var b = buf || [];

    options = options || {};

    var clockseq = options.clockseq != null ? options.clockseq : _clockseq;

    // UUID timestamps are 100 nano-second units since the Gregorian epoch,
    // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
    // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
    // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
    var msecs = options.msecs != null ? options.msecs : new Date().getTime();

    // Per 4.2.1.2, use count of uuid's generated during the current clock
    // cycle to simulate higher resolution clock
    var nsecs = options.nsecs != null ? options.nsecs : _lastNSecs + 1;

    // Time since last uuid creation (in msecs)
    var dt = (msecs - _lastMSecs) + (nsecs - _lastNSecs)/10000;

    // Per 4.2.1.2, Bump clockseq on clock regression
    if (dt < 0 && options.clockseq == null) {
      clockseq = clockseq + 1 & 0x3fff;
    }

    // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
    // time interval
    if ((dt < 0 || msecs > _lastMSecs) && options.nsecs == null) {
      nsecs = 0;
    }

    // Per 4.2.1.2 Throw error if too many uuids are requested
    if (nsecs >= 10000) {
      throw new Error('uuid.v1(): Can\'t create more than 10M uuids/sec');
    }

    _lastMSecs = msecs;
    _lastNSecs = nsecs;
    _clockseq = clockseq;

    // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
    msecs += 12219292800000;

    // `time_low`
    var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
    b[i++] = tl >>> 24 & 0xff;
    b[i++] = tl >>> 16 & 0xff;
    b[i++] = tl >>> 8 & 0xff;
    b[i++] = tl & 0xff;

    // `time_mid`
    var tmh = (msecs / 0x100000000 * 10000) & 0xfffffff;
    b[i++] = tmh >>> 8 & 0xff;
    b[i++] = tmh & 0xff;

    // `time_high_and_version`
    b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
    b[i++] = tmh >>> 16 & 0xff;

    // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
    b[i++] = clockseq >>> 8 | 0x80;

    // `clock_seq_low`
    b[i++] = clockseq & 0xff;

    // `node`
    var node = options.node || _nodeId;
    for (var n = 0; n < 6; n++) {
      b[i + n] = node[n];
    }

    return buf ? buf : unparse(b);
  }

  // **`v4()` - Generate random UUID**

  // See https://github.com/broofa/node-uuid for API details
  function v4(options, buf, offset) {
    // Deprecated - 'format' argument, as supported in v1.2
    var i = buf && offset || 0;

    if (typeof(options) == 'string') {
      buf = options == 'binary' ? new BufferClass(16) : null;
      options = null;
    }
    options = options || {};

    var rnds = options.random || (options.rng || _rng)();

    // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
    rnds[6] = (rnds[6] & 0x0f) | 0x40;
    rnds[8] = (rnds[8] & 0x3f) | 0x80;

    // Copy bytes to buffer, if provided
    if (buf) {
      for (var ii = 0; ii < 16; ii++) {
        buf[i + ii] = rnds[ii];
      }
    }

    return buf || unparse(rnds);
  }

  // Export public API
  var uuid = v4;
  uuid.v1 = v1;
  uuid.v4 = v4;
  uuid.parse = parse;
  uuid.unparse = unparse;
  uuid.BufferClass = BufferClass;

  // Export RNG options
  uuid.mathRNG = mathRNG;
  uuid.nodeRNG = nodeRNG;
  uuid.whatwgRNG = whatwgRNG;

  if (typeof(module) != 'undefined') {
    // Play nice with node.js
    module.exports = uuid;
  } else {
    // Play nice with browsers
    var _previousRoot = _global.uuid;

    // **`noConflict()` - (browser only) to reset global 'uuid' var**
    uuid.noConflict = function() {
      _global.uuid = _previousRoot;
      return uuid;
    }
    _global.uuid = uuid;
  }
}());

;(function () {

  var
    object = typeof window != 'undefined' ? window : exports,
    chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
    INVALID_CHARACTER_ERR = (function () {
      // fabricate a suitable error object
      try { document.createElement('$'); }
      catch (error) { return error; }}());

  // encoder
  // [https://gist.github.com/999166] by [https://github.com/nignag]
  object.btoa || (
  object.btoa = function (input) {
    for (
      // initialize result and counter
      var block, charCode, idx = 0, map = chars, output = '';
      // if the next input index does not exist:
      //   change the mapping table to "="
      //   check if d has no fractional digits
      input.charAt(idx | 0) || (map = '=', idx % 1);
      // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
      output += map.charAt(63 & block >> 8 - idx % 1 * 8)
    ) {
      charCode = input.charCodeAt(idx += 3/4);
      if (charCode > 0xFF) throw INVALID_CHARACTER_ERR;
      block = block << 8 | charCode;
    }
    return output;
  });

  // decoder
  // [https://gist.github.com/1020396] by [https://github.com/atk]
  object.atob || (
  object.atob = function (input) {
    input = input.replace(/=+$/, '')
    if (input.length % 4 == 1) throw INVALID_CHARACTER_ERR;
    for (
      // initialize result and counters
      var bc = 0, bs, buffer, idx = 0, output = '';
      // get next character
      buffer = input.charAt(idx++);
      // character found in table? initialize bit storage and add its ascii value;
      ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
        // and if not first of each 4 characters,
        // convert the first 8 bits to one ascii character
        bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
    ) {
      // try to find character in table (0-63, not found => -1)
      buffer = chars.indexOf(buffer);
    }
    return output;
  });

}());

/**
    The AeroGear.Notifier namespace provides a messaging API. Through the use of adapters, this library provides common methods like connect, disconnect, subscribe, unsubscribe and publish.
    @status Stable
    @class
    @augments AeroGear.Core
    @param {String|Array|Object} [config] - A configuration for the client(s) being created along with the notifier. If an object or array containing objects is used, the objects can have the following properties:
    @param {String} config.name - the name that the client will later be referenced by
    @param {String} [config.type="vertx"] - the type of client as determined by the adapter used
    @param {Object} [config.settings={}] - the settings to be passed to the adapter
    @returns {Object} The created notifier containing any messaging clients that may have been created
    @example
    // Create an empty notifier
    var notifier = AeroGear.Notifier();

    // Create a single client using the default adapter
    var notifier2 = AeroGear.Notifier( "myNotifier" );

    // Create multiple clients using the default adapter
    var notifier3 = AeroGear.Notifier( [ "someNotifier", "anotherNotifier" ] );

    // Create a default adapter with settings
    var notifier4 = AeroGear.Notifier({
        name: "vertxNotifier",
        type: "vertx",
        settings: { ... }
    });

    // Create a stompws adapter with settings
    var notifier5 = AeroGear.Notifier({
        name: "STOMPNotifier",
        type: "stompws",
        settings: { ... }
    });

    // Create a vertx and stompws adapter with settings
    var notifier6 = AeroGear.Notifier([
        {
            name: "vertxNotifier",
            type: "vertx",
            settings: { ... }
        },
        {
            name: "STOMPNotifier",
            type: "stompws",
            settings: { ... }
        }
    ]);
 */
AeroGear.Notifier = function( config ) {
    // Allow instantiation without using new
    if ( !( this instanceof AeroGear.Notifier ) ) {
        return new AeroGear.Notifier( config );
    }
    // Super Constructor
    AeroGear.Core.call( this );

    this.lib = "Notifier";
    this.type = config ? config.type || "vertx" : "vertx";

    /**
        The name used to reference the collection of notifier client instances created from the adapters
        @memberOf AeroGear.Notifier
        @type Object
        @default modules
     */
    this.collectionName = "clients";

    this.add( config );
};

AeroGear.Notifier.prototype = AeroGear.Core;
AeroGear.Notifier.constructor = AeroGear.Notifier;

/**
    The adapters object is provided so that adapters can be added to the AeroGear.Notifier namespace dynamically and still be accessible to the add method
    @augments AeroGear.Notifier
 */
AeroGear.Notifier.adapters = {};

/**
    A set of constants used to track the state of a client connection.
 */
AeroGear.Notifier.CONNECTING = 0;
AeroGear.Notifier.CONNECTED = 1;
AeroGear.Notifier.DISCONNECTING = 2;
AeroGear.Notifier.DISCONNECTED = 3;

/**
    This adapter allows communication with the AeroGear implementation of the SimplePush server protocol. Most of this functionality will be hidden behind the SimplePush client polyfill but is accessible if necessary.
    @status Experimental
    @constructs AeroGear.Notifier.adapters.SimplePush
    @param {String} clientName - the name used to reference this particular notifier client
    @param {Object} [settings={}] - the settings to be passed to the adapter
    @param {String} [settings.connectURL=""] - defines the URL for connecting to the messaging service
    @param {Boolean} [settings.useNative=false] - Create a WebSocket connection to the Mozilla SimplePush server instead of a SockJS connection to a custom server
    @returns {Object} The created notifier client
 */
AeroGear.Notifier.adapters.SimplePush = function( clientName, settings ) {
    // Allow instantiation without using new
    if ( !( this instanceof AeroGear.Notifier.adapters.SimplePush ) ) {
        return new AeroGear.Notifier.adapters.SimplePush( clientName, settings );
    }

    settings = settings || {};

    // Private Instance vars
    var type = "SimplePush",
        name = clientName,
        connectURL = settings.connectURL || "",
        useNative = settings.useNative || false,
        client = null,
        state = AeroGear.Notifier.DISCONNECTED,
        uaid = localStorage.getItem("ag-uaid") || "",
        channels = [];

    // Privileged methods
    /**
        Returns the value of the private settings var
        @private
        @augments AeroGear.Notifier.adapters.SimplePush
     */
    this.getSettings = function() {
        return settings;
    };

    /**
        Returns the value of the private name var
        @private
        @augments AeroGear.Notifier.adapters.SimplePush
     */
    this.getName = function() {
        return name;
    };

    /**
        Returns the value of the private connectURL var
        @private
        @augments AeroGear.Notifier.adapters.SimplePush
     */
    this.getConnectURL = function() {
        return connectURL;
    };

    /**
        Set the value of the private connectURL var
        @private
        @augments AeroGear.Notifier.adapters.SimplePush
        @param {String} url - New connectURL for this client
     */
    this.setConnectURL = function( url ) {
        connectURL = url;
    };

    /**
        Returns the value of the private useNative var
        @private
        @augments AeroGear.Notifier.adapters.SimplePush
     */
    this.getUseNative = function() {
        return useNative;
    };

    /**
        Returns the value of the private client var
        @private
        @augments AeroGear.Notifier.adapters.SimplePush
     */
    this.getClient = function() {
        return client;
    };

    /**
        Sets the value of the private client var
        @private
        @augments AeroGear.Notifier.adapters.SimplePush
     */
    this.setClient = function( newClient ) {
        client = newClient;
    };

    /**
        Returns the value of the private state var
        @private
        @augments vertx
     */
    this.getState = function() {
        return state;
    };

    /**
        Sets the value of the private state var
        @private
        @augments vertx
     */
    this.setState = function( newState ) {
        state = newState;
    };

    /**
        Returns the value of the private uaid var
        @private
        @augments AeroGear.Notifier.adapters.SimplePush
     */
    this.getUAID = function() {
        return uaid;
    };

    /**
        Sets the value of the private uaid var as well as the local store
        @private
        @augments AeroGear.Notifier.adapters.SimplePush
     */
    this.setUAID = function( newUAID ) {
        uaid = newUAID;
        localStorage.setItem( "ag-uaid", newUAID );
    };

    /**
        Returns the value of the private channels var
        @private
        @augments AeroGear.Notifier.adapters.SimplePush
     */
    this.getChannels = function() {
        return channels;
    };

    /**
        Sets the value of the private channels var
        @private
        @augments AeroGear.Notifier.adapters.SimplePush
     */
    this.setChannels = function( newChannels ) {
        channels = newChannels;
    };

    /**
        Processes all incoming messages from the SimplePush server
        @private
        @augments AeroGear.Notifier.adapters.SimplePush
     */
    this.processMessage = function( message ) {
        var channel, updates, currentChannels;
        if ( message.messageType === "register" && message.status === 200 ) {
            channel = {
                channelID: message.channelID,
                version: message.version
            };
            this.setChannels( this.updateChannel( this.getChannels(), channel ) );

            // Trigger registration success callback
            jQuery( navigator.push ).trigger( jQuery.Event( message.channelID + "-success", {
                target: {
                    result: message.pushEndpoint
                }
            }));
        } else if ( message.messageType === "register" ) {
            throw "SimplePushRegistrationError";
        } else if ( message.messageType === "unregister" && message.status === 200 ) {
            currentChannels = this.getChannels();
            this.setChannels( currentChannels.splice( this.findChannelIndex( currentChannels, "channelID", message.channelID ), 1 ) );
        } else if ( message.messageType === "unregister" ) {
            throw "SimplePushUnregistrationError";
        } else if ( message.messageType === "notification" ) {
            updates = message.updates;

            // Notifications could come in a batch so process all
            for ( var i = 0, updateLength = updates.length; i < updateLength; i++ ) {

                // Trigger the push event which apps will create their listeners to respond to when receiving messages
                jQuery( navigator.push ).trigger( jQuery.Event( "push", {
                    message: updates[ i ]
                }));
            }

            // Acknowledge all updates sent in this notification message
            message.messageType = "ack";
            client.send( JSON.stringify( message ) );
        }
    };

    // Utility Functions
    /**
        Find the array index of a particular channel based on a particular field value
        @private
        @augments AeroGear.Notifier.adapters.SimplePush
     */
    this.findChannelIndex = function( channels, filterField, filterValue ) {
        for ( var i = 0; i < channels.length; i++ ) {
            if ( channels[ i ][ filterField ] === filterValue ) {
                return i;
            }
        }
    };

    /**
        Update a channel with new information
        @private
        @augments AeroGear.Notifier.adapters.SimplePush
     */
    this.updateChannel = function( channels, channel ) {
        for( var i = 0; i < channels.length; i++ ) {
            if ( channels[ i ].channelID === channel.channelID ) {
                channels[ i ].version = channel.version;
                channels[ i ].state = channel.state;
                break;
            }
        }

        return channels;
    };

    /**
        Proxies the binding of subscription success handlers
        @private
        @augments AeroGear.Notifier.adapters.SimplePush
     */
    this.bindSubscribeSuccess = function( channelID, request ) {
        jQuery( navigator.push ).off( channelID + "-success" );
        jQuery( navigator.push ).on( channelID + "-success", function( event ) {
            request.onsuccess( event );
        });
    };
};

//Public Methods
/**
    Connect the client to the messaging service
    @param {Object} [options] - Options to pass to the connect method
    @param {String} [options.url] - The URL for the messaging service. This url will override and reset any connectURL specified when the client was created.
    @param {Function} [options.onConnect] - callback to be executed when a connection is established and hello message has been acknowledged
    @param {Function} [options.onConnectError] - callback to be executed when connecting to a service is unsuccessful
    @param {Function} [options.onClose] - callback to be executed when a connection to the server is closed
    @example
    var SPNotifier = AeroGear.Notifier({
        name: "sp",
        type: "SimplePush",
        settings: {
            connectURL: "http://localhost:7777/simplepush"
        }
    }).clients.sp;

    // Use all defaults
    SPNotifier.connect();

    // Custom options
    SPNotifier.connect({
        simplePushServerURL: "http://some.other.domain",
        onConnect: spConnect,
        onClose: spClose
    });
 */
AeroGear.Notifier.adapters.SimplePush.prototype.connect = function( options ) {
    options = options || {};
    this.setState( AeroGear.Notifier.CONNECTING );

    var that = this,
        client = this.getUseNative() ? new WebSocket( options.url || this.getConnectURL() ) : new SockJS( options.url || this.getConnectURL() );

    client.onopen = function() {
        // Immediately send hello message
        client.send( JSON.stringify({
                messageType: "hello",
                uaid: that.getUAID(),
                channelIDs: []
            })
        );
    };

    client.onerror = function( error ) {
        this.setState( AeroGear.Notifier.DISCONNECTED );

        if ( options.onConnectError ) {
            options.onConnectError.apply( this, arguments );
        }
    };

    client.onmessage = function( message ) {
        message = JSON.parse( message.data );

        if ( message.messageType === "hello" ) {
            that.setState( AeroGear.Notifier.CONNECTED );

            if ( message.uaid !== that.getUAID() ) {
                that.setUAID( message.uaid );
            }

            if ( options.onConnect ) {
                options.onConnect( message );
            }

            // Start PING
            that.PING = setInterval( function() {
                client.send('{}');
            }, 30000 );
        } else {
            that.processMessage( message );
        }
    };

    client.onclose = function() {
        that.setState( AeroGear.Notifier.DISCONNECTED );
        clearInterval( that.PING );

        if ( options.onClose ) {
            options.onClose.apply( this, arguments );
        }
    };

    this.setClient( client );
};

/**
    Disconnect the client from the messaging service
    @param {Function} [onDisconnect] - callback to be executed when a connection is terminated
    @example
    var SPNotifier = AeroGear.Notifier({
        name: "sp",
        type: "SimplePush",
        settings: {
            connectURL: "http://localhost:7777/simplepush"
        }
    }).clients.sp;

    // Default
    SPNotifier.disconnect();

    // Pass disconnect callback
    SPNotifier.disconnect(function() {
        console.log("Disconnected");
    });
 */
AeroGear.Notifier.adapters.SimplePush.prototype.disconnect = function( onDisconnect ) {
    var client = this.getClient();

    client.close();
    if ( onDisconnect ) {
        onDisconnect();
    }
};

/**
    Subscribe this client to a new channel
    @param {Object|Array} channels - a channel object or array of channel objects to which this client can subscribe. At a minimum, each channel should contain a requestObject which will eventually contain the subscription success callback and a callback, which is fired when notifications are received. Reused channels may also contain channelID and other metadata.
    @example
    var SPNotifier = AeroGear.Notifier({
        name: "sp",
        type: "SimplePush",
        settings: {
            connectURL: "http://localhost:7777/simplepush"
        }
    }).clients.sp;

    SPNotifier.subscribe({
        requestObject: {},
        callback: function( message ) {
            console.log("Notification Received");
        }
    });
 */
AeroGear.Notifier.adapters.SimplePush.prototype.subscribe = function( channels ) {
    var index, response, channelID,
        processed = false,
        client = this.getClient(),
        currentChannels = this.getChannels();

    channels = AeroGear.isArray( channels ) ? channels : [ channels ];

    for ( var i = 0; i < channels.length; i++ ) {
        channels[ i ].channelID = uuid();
        this.bindSubscribeSuccess( channels[ i ].channelID, channels[ i ].requestObject );
        client.send('{"messageType": "register", "channelID": "' + channels[ i ].channelID + '"}');

        currentChannels.push( channels[ i ] );
    }

    this.setChannels( currentChannels );
};

/**
    Unsubscribe this client from a channel
    @param {Object|Array} channels - a channel object or a set of channel objects to which this client nolonger wishes to subscribe
    @example
    var SPNotifier = AeroGear.Notifier({
        name: "sp",
        type: "SimplePush",
        settings: {
            connectURL: "http://localhost:7777/simplepush"
        }
    }).clients.sp;

    SPNotifier.unsubscribe( channelObject );
 */
AeroGear.Notifier.adapters.SimplePush.prototype.unsubscribe = function( channels ) {
    var client = this.getClient();

    channels = AeroGear.isArray( channels ) ? channels : [ channels ];
    for ( var i = 0; i < channels.length; i++ ) {
        client.send( '{"messageType": "unregister", "channelID": "' + channels[ i ].channelID + '"}');
    }
};

(function( AeroGear, $, undefined ) {
    /**
        The SimplePushClient object is used as a sort of polyfill/implementation of the SimplePush spec implemented in Firefox OS and the Firefox browser and provides a mechanism for subscribing to and acting on push notifications in a web application. See https://wiki.mozilla.org/WebAPI/SimplePush
        @status Experimental
        @constructs AeroGear.SimplePushClient
        @param {Object} options - an object used to initialize the connection to the SimplePush server
        @param {Boolean} [options.useNative=false] - if true, the connection will first try to use the Mozilla push network (still in development and not ready for production) before falling back to the SimplePush server specified
        @param {String} [options.simplePushServerURL] - the URL of the SimplePush server. This option is optional but only if you don't want to support browsers that are missing websocket support and you trust the not yet production ready Mozilla push server.
        @param {Function} options.onConnect - a callback to fire when a connection is established with the SimplePush server. This is a deviation from the SimplePush spec as it is not necessary when you using the in browser functionality since the browser establishes the connection before the application is started.
        @param {Function} options.onClose - a callback to fire when a connection to the SimplePush server is closed or lost.
        @returns {Object} The created unified push server client
        @example
        //Create the SimplePushClient object:
        var client = AeroGear.SimplePushClient({
            simplePushServerURL: "https://localhost:7777/simplepush",
            onConnect: myConnectCallback,
            onClose: myCloseCallback
        });
     */
    AeroGear.SimplePushClient = function( options ) {
        // Allow instantiation without using new
        if ( !( this instanceof AeroGear.SimplePushClient ) ) {
            return new AeroGear.SimplePushClient( options );
        }

        this.options = options || {};

        // Check for native push support
        if ( 'push' in navigator && navigator.push !== null && this.options.useNative ) {
            // Browser supports push so let it handle it and trigger the onConnect
            if ( !('setMessageHandler' in navigator) ) {
                navigator.setMessageHandler = navigator.mozSetMessageHandler;
            }
            if ( this.options.onConnect ) {
                this.options.onConnect();
            }
            return;
        }

        if ( !this.options.simplePushServerURL ) {
            // No native push support and no websocket support
            throw "SimplePushConfigurationError";
        }

        if ( this.options.useNative ) {
             if ("WebSocket" in window ) {
                // No native push support but want to use WebSocket, secure required
                if ( this.options.simplePushServerURL.indexOf( "wss" ) !== 0 ) {
                    // Incorrect URL for WebSocket so try SockJS
                    this.options.useNative = false;
                }
            } else {
                // No websocket, no native support but SimplePush server specified so try SockJS connection
                this.options.useNative = false;
            }
        }

        var spClient = this,
            connectOptions = {
                onConnect: function() {
                    /**
                        The window.navigator object
                        @namespace navigator
                     */

                    /**
                        Add the push object to the global navigator object
                        @status Experimental
                        @constructs navigator.push
                     */
                    navigator.push = (function() {
                        return {
                            /**
                                Register a push notification channel with the SimplePush server
                                @function
                                @memberof navigator.push
                                @returns {Object} - The request object where a connection success callback can be registered
                                @example
                                var mailRequest = navigator.push.register();
                             */
                            register: function() {
                                var request = {
                                    onsuccess: function( event ) {}
                                };

                                if ( !spClient.simpleNotifier ) {
                                    throw "SimplePushConnectionError";
                                }

                                spClient.simpleNotifier.subscribe({
                                    requestObject: request,
                                    callback: function( message ) {
                                        $( navigator.push ).trigger({
                                            type: "push",
                                            message: message
                                        });
                                    }
                                });

                                return request;
                            },

                            /**
                                Unregister a push notification channel from the SimplePush server
                                @function
                                @memberof navigator.push
                                @example
                                navigator.push.unregister( mailEndpoint );
                             */
                            unregister: function( endpoint ) {
                                spClient.simpleNotifier.unsubscribe( endpoint );
                            },

                            /**
                                Reestablish the connection with the SimplePush server when closed or lost. This is an addition and not part of the SimplePush spec
                                @function
                                @memberof navigator.push
                                @param {Object} options - an object used to initialize the connection to the SimplePush server
                                @param {String} options.simplePushServerURL - the URL of the SimplePush server
                                @param {Function} options.onConnect - a callback to fire when a connection is established with the SimplePush server. This is a deviation from the SimplePush spec as it is not necessary when you using the in browser functionality since the browser establishes the connection before the application is started.
                                @param {Function} options.onClose - a callback to fire when a connection to the SimplePush server is closed or lost.
                                @example
                                navigator.push.reconnect({
                                    simplePushServerURL: "https://localhost:7777/simplepush",
                                    onConnect: myConnectCallback,
                                    onClose: myCloseCallback
                                });
                             */
                            reconnect: function() {
                                spClient.simpleNotifier.connect( connectOptions );
                            }
                        };
                    })();

                    /**
                        Add the setMessageHandler function to the global navigator object
                        @status Experimental
                        @constructs navigator.setMessageHandler
                        @param {String} messageType - a name or category to give the messages being received and in this implementation, likely 'push'
                        @param {Function} callback - the function to be called when a message of this type is received
                        @example
                        navigator.setMessageHandler( "push", function( message ) {
                            if ( message.channelID === mailEndpoint.channelID ) {
                                console.log("Mail Message Received");
                            }
                        });
                     */
                    navigator.setMessageHandler = function( messageType, callback ) {
                        $( navigator.push ).on( messageType, function( event ) {
                            var message = event.message;
                            callback.call( this, message );
                        });
                    };

                    if ( spClient.options.onConnect ) {
                        spClient.options.onConnect();
                    }
                },
                onClose: function() {
                    spClient.simpleNotifier.disconnect( spClient.options.onClose );
                }
            };

        // Create a Notifier connection to the Push Network
        spClient.simpleNotifier = AeroGear.Notifier({
            name: "agPushNetwork",
            type: "SimplePush",
            settings: {
                connectURL: spClient.options.simplePushServerURL,
                useNative: spClient.options.useNative
            }
        }).clients.agPushNetwork;

        spClient.simpleNotifier.connect( connectOptions );
    };
})( AeroGear, jQuery );

(function( AeroGear, $, undefined ) {
    /**
        The UnifiedPushClient object is used to perfom register and unregister operations against the AeroGear UnifiedPush server.
        @status Experimental
        @constructs AeroGear.UnifiedPushClient
        @param {String} variantID - the id representing the mobile application variant
        @param {String} variantSecret - the secret for the mobile application variant
        @param {String} pushServerURL - the location of the UnifiedPush server
        @returns {Object} The created unified push server client
        @example
        //Create the UnifiedPush client object:
        var client = AeroGear.UnifiedPushClient(
            "myVariantID",
            "myVariantSecret",
            "http://SERVER:PORT/CONTEXT/rest/registry/device"
        );

        // assemble the metadata for the registration:
        var metadata = {
            deviceToken: "theDeviceToken",
            alias: "some_username",
            category: "email",
            simplePushEndpoint: "http://server.com/simplePushEndpoint"
        };

        // perform the registration against the UnifiedPush server:
        client.registerWithPushServer(metadata);

     */
    AeroGear.UnifiedPushClient = function( variantID, variantSecret, pushServerURL ) {

        // we require all arguments to be present, otherwise it does not work
        if ( !variantID || !variantSecret || !pushServerURL ) {
            throw "UnifiedPushClientException";
        }

        // Allow instantiation without using new
        if ( !( this instanceof AeroGear.UnifiedPushClient ) ) {
            return new AeroGear.UnifiedPushClient( variantID, variantSecret, pushServerURL );
        }

        /**
            Performs a register request against the UnifiedPush Server using the given metadata which represents a client that wants to register with the server.
            @param {Object} metadata - the metadata for the client
            @param {String} metadata.deviceToken - identifies the client within its PushNetwork. On Android this is the registrationID, on iOS this is the deviceToken and on SimplePush this is the channelID of the subscribed channel.
            @param {String} metadata.simplePushEndpoint - the URL of the given SimplePush server/network that is needed in order to trigger a notification to be sent to the SimplePush client.
            @param {String} metadata.alias - Application specific alias to identify users with the system. Common use case would be an email address or a username.
            @param {String} [metadata.category] - In SimplePush this is the name of the registration endpoint. On Hybrid platforms like Apache Cordova this is used for tagging the registered client.
            @param {String} [metadata.operatingSystem] - Useful on Hybrid platforms like Apache Cordova to specifiy the underlying operating system.
            @param {String} [metadata.osVersion] - Useful on Hybrid platforms like Apache Cordova to specify the version of the underlying operating system.
            @param {String} [metadata.deviceType] - Useful on Hybrid platforms like Apache Cordova to specify the type of the used device, like iPad or Android-Phone.
         */
        this.registerWithPushServer = function( metadata ) {
            // we need a deviceToken
            if ( !metadata.deviceToken || !metadata.alias ) {
                throw "UnifiedPushRegistrationException";
            }

            $.ajax({
                contentType: "application/json",
                dataType: "json",
                type: "POST",
                url: pushServerURL,
                headers: {
                    "Authorization": "Basic " + window.btoa(variantID + ":" + variantSecret)
                },
                data: JSON.stringify( metadata )
            });
        };

        /**
            Performs an unregister request against the UnifiedPush Server for the given deviceToken. The deviceToken identifies the client within its PushNetwork. On Android this is the registrationID, on iOS this is the deviceToken and on SimplePush this is the channelID of the subscribed channel.
            @param {String} deviceToken - unique String which identifies the client that is being unregistered. In the case of SimplePush, this is the hashed simplePushEndpoint
         */
        this.unregisterWithPushServer = function( deviceToken ) {
            var uaid = localStorage.getItem( "ag-uaid" );
            if ( uaid ) {
                deviceToken = window.btoa( deviceToken );
            }

            $.ajax({
                contentType: "application/json",
                dataType: "json",
                type: "DELETE",
                url: pushServerURL + "/" + window.deviceToken,
                headers: {
                    "Authorization": "Basic " + window.btoa(variantID + ":" + variantSecret)
                },
                data: JSON.stringify({
                    deviceToken: deviceToken
                })
            });
        };
    };

})( AeroGear, jQuery );
