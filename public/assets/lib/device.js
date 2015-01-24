window.__device = (function() {

  var flags = {},
      ua = navigator.userAgent,
      root = document.documentElement,
      i;

  function flag(names) {
    if(names) {
      names = names.split(' ');
      for (i = 0; i < names.length; i++) {
        flags[names[i]] = true;
      }
    }
  }

  function classnames() {
    var names = [], name;
    if(!flags.desktop && !flags.tablet) {
      flag('mobile');
    }
    for(name in flags) {
      if (flags.hasOwnProperty(name)) {
        names.push(name);
      }
    }
    root.className += (root.className ? ' ' : '') + names.join(' ');
  }

  //User Agent
  var uaMap = {
    'WebKit/': 'webkit',
    'Trident/': 'msie',
    'Firefox': 'firefox',
    '(iPad': 'ios ipad',
    '(iPhone': 'ios iphone',
    '(iPod': 'ios iphone',
    'Chrome/': 'chrome',
    'CriOS': 'chrome',
    'Android ': 'android',
    'Windows Phone ': 'winphone',
    'Safari/': 'safari',
    'OS 6_': 'ios6',
    'OS 7_': 'ios7',
    'OS 8_': 'ios8',
    'Silk': 'silk',
    'Nokia': 'nokia'
  };

  function UA(uaflag) {
    if(ua.indexOf(uaflag) > -1) {
      return uaMap[uaflag];
    }
  }

  for (var key in uaMap) {
    if(key) {
      var uaValue = UA(key);

      //iOS versions
      if(flags.ios) {
        if( (/(OS )[0-5]/g).test(ua) ) {
          flag('ios<6');
        }
        if( (/(ios)[6-9]/g).test(uaValue) ){
          flag(uaValue);
        }
      }

      if(uaValue) {
        flag(uaValue);
      }
    }
  }

  // Safari
  if (!flags.ios) { delete flags['safari']; }

  // IE
  if (flags.msie) {
    if (parseInt(ua.substr(ua.indexOf('MSIE ') + 5, 2), 10) < 9) { flag('msielt9'); }
    if (parseInt(ua.substr(ua.indexOf('MSIE ') + 5, 2), 10) < 10) { flag('msielt10'); }
  }

  // Blackberry
  var bb = (/RIM/g).test(ua) || (/BB/g).test(ua) || (/Tablet/g).test(ua);
  if(bb) { flag('bb') };

  // Android
  var androids = {
    'eclair': /(Android).[2].[0-1]/g, //not supported
    'froyo': /(Android).[2].[2]/g,
    'gingerbread': /(Android).[2].[3]/g,
    'honeycomb': /(Android).[3].[0-2]/g, //not supported
    'icecream': /(Android).[4].[0]/g,
    'jellybean': /(Android).[4].[1-3]/g,
    'kitkat': /(Android).[4].[4]/g,
    'lollipop': /(Android).[5]/g
  };

  if(flags.android) {
    var exp = /(Android).[0-9].[0-9]/g;
    if ((/Mobile/).test(ua)) {
      flag('mobile');
    }
    if(exp.test(ua)){
      var vers = ua.match(exp)[0];
      if(vers) {
        vers = vers.replace(/ /g, '_');
        for (var key in androids) {
          if( (androids[key]).test(vers) ) {
            flag(key);
          }
        }
      }
    }
  }

  // Navigator
  if (navigator.msPointerEnabled && navigator.msMaxTouchPoints > 1) { flag('touch'); }
  if (navigator.standalone) { flag('standalone'); }
  if (navigator.devicePixelRatio && navigator.devicePixelRatio >= 2) { flag('retina'); }

  // Desktop
  var desktop = !flags.mobile && !flags.android && !flags.ios && !flags.silk && !flags.symbian && !flags.winphone && !flags.bb;
  if(desktop) {
    flag('desktop');
  }

  // Compare Screen Width
  var _w = [screen.width, window.innerWidth, window.outerWidth, document.documentElement.clientWidth];
  var sum_w = 0;
  for (var i=0; i < _w.length; i++) {
    sum_w = sum_w + _w[i];
  }
  var avg_w = sum_w / _w.length;

  /*
    Tablets included:
    - android tablets: Google says these devices will have 'Android' and NOT 'mobile' in their ua (there are exclusions (i.e., samsung galaxy)).
    - google nexus
    - samsung galaxy tab
    - other larger screens
  */
  var mobileUA = (/Mobile/).test(ua);
  var tablet = !flags.mobile && (flags.ios && flags.ipad
               || flags.android //android tablets: Google says these devices will have 'Android' and NOT 'mobile' in their ua (there are exclusions (i.e., samsung galaxy)).
               || (/(Nexus )[6-9]/).test(ua) //google nexus
               || (/(SCH\-)[A-Z][0-9]/).test(ua) //samsung galaxy tab
               || flags.bb && (/PlayBook/).test(ua) //bb playbook
               || flags.silk && (/(KF)\w.../).test(ua)); //kindle tablet
               // Can't use screen width for detection of tablet b/c
               // some phones have pixel width > 960
               // || !flags.desktop && (avg_w > 960); //other larger screens;

  if(tablet) {
    flag('tablet');
  }

  classnames();

  return flags;

})();

// Dev Logging
console.log(JSON.stringify(__device));

/* Unused Flags
  //Screen
  if (screen.width > 1280) { flag('hd'); }
  if (screen.width < 768) { flag('narrow'); }

  //Touch
  el.setAttribute('ontouchstart', 'return;');
  if (typeof el.ontouchstart === 'function') { flag('touch'); }

  //Embedded
  if (window !== window.top) { flag('embedded'); }

  //Fullscreen enabled
  if (document.documentElement.webkitRequestFullscreen || document.fullscreenEnabled || document.mozFullScreenEnabled || document.documentElement.msRequestFullscreen) { flag('fullscreen'); }
*/
