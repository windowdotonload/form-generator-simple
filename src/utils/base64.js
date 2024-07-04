/**
 * name: util.js
 * description: Base64编码
 * author:
 * date: 2021-12-27
 */
let Utils = {
    Base64:{

        // private property
        _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
      
        // public method for encoding
        , encode: function (input) {
          var output = "";
          var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
          var i = 0;
      
          input = Utils.Base64._utf8_encode(input);
      
          while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
      
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
      
            if (isNaN(chr2)) {
              enc3 = enc4 = 64;
            }
            else if (isNaN(chr3)) {
              enc4 = 64;
            }
      
            output = output +
              this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
              this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
          } // Whend 
      
          return output;
        } // End Function encode 
      
      
        // public method for decoding
        , decode: function (input) {
          var output = "";
          var chr1, chr2, chr3;
          var enc1, enc2, enc3, enc4;
          var i = 0;
      
          input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
          while (i < input.length) {
            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));
      
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
      
            output = output + String.fromCharCode(chr1);
      
            if (enc3 != 64) {
              output = output + String.fromCharCode(chr2);
            }
      
            if (enc4 != 64) {
              output = output + String.fromCharCode(chr3);
            }
      
          } // Whend 
      
          output = Utils.Base64._utf8_decode(output);
      
          return output;
        } // End Function decode 
      
      
        // private method for UTF-8 encoding
        , _utf8_encode: function (string) {
          var utftext = "";
          string = string.replace(/\r\n/g, "\n");
      
          for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
      
            if (c < 128) {
              utftext += String.fromCharCode(c);
            }
            else if ((c > 127) && (c < 2048)) {
              utftext += String.fromCharCode((c >> 6) | 192);
              utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
              utftext += String.fromCharCode((c >> 12) | 224);
              utftext += String.fromCharCode(((c >> 6) & 63) | 128);
              utftext += String.fromCharCode((c & 63) | 128);
            }
      
          } // Next n 
      
          return utftext;
        } // End Function _utf8_encode 
      
        // private method for UTF-8 decoding
        , _utf8_decode: function (utftext) {
          var string = "";
          var i = 0;
          var c, c1, c2, c3;
          c = c1 = c2 = 0;
      
          while (i < utftext.length) {
            c = utftext.charCodeAt(i);
      
            if (c < 128) {
              string += String.fromCharCode(c);
              i++;
            }
            else if ((c > 191) && (c < 224)) {
              c2 = utftext.charCodeAt(i + 1);
              string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
              i += 2;
            }
            else {
              c2 = utftext.charCodeAt(i + 1);
              c3 = utftext.charCodeAt(i + 2);
              string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
              i += 3;
            }
      
          } // Whend 
      
          return string;
        } // End Function _utf8_decode 
      
      },
      _uuid() {

        var s = [];
      
        var hexDigits = "0123456789abcdef";
      
        for (var i = 0; i < 36; i++) {
      
          s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
      
        }
      
        s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
      
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
      
        s[8] = s[13] = s[18] = s[23] = "-";
      
        var uuid = s.join("").replace("-","");
      
        return uuid
      },
      translateArrayBufferToBase64(buffer){
        let binaryStr = "";
        const bytes = new Uint8Array(buffer);
        for(let i=0;i<bytes.byteLength;i++){
            binaryStr +=String.fromCharCode(bytes [i]);    
        }
        return window.btoa(binaryStr );
    }
};
export default Utils;