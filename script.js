
  
  window.requestAnimFrame = (function () {
    return window.requestAnimationFrame
      || window.webkitRequestAnimationFrame
      || window.mozRequestAnimationFrame
      || window.oRequestAnimationFrame
      || window.msRequestAnimationFrame
      || function (callback, element) {
        window.setTimeout(function () {
          callback(+new Date);
        }, 10);
      };
  })();
  
  function getInternetExplorerVersion()
  // Returns the version of Internet Explorer or a -1
  // (indicating the use of another browser).
  {
    var rv = -1; // Return value assumes failure.
    if (navigator.appName == 'Microsoft Internet Explorer')
    {
      var ua = navigator.userAgent;
      var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
      if (re.exec(ua) != null)
        rv = parseFloat( RegExp.$1 );
    }
    return rv;
  }
  
  // set a classname so we can draw the right sun position
  function setTime() {
    var percentageScrolled = ~~(document.body.scrollTop / document.height * 100);
    var html = document.querySelector("html");
    
    // because we were too lazy to include jquery
    html.classList.remove("time-1pm");
    html.classList.remove("time-2pm");
    html.classList.remove("time-3pm");
    html.classList.remove("time-4pm");
    html.classList.remove("time-5pm");
    html.classList.remove("time-6pm");
    
    if (percentageScrolled < 10)
      html.classList.add("time-1pm");
    else if (percentageScrolled < 20)
      html.classList.add("time-2pm");
    else if (percentageScrolled < 30)
      html.classList.add("time-3pm");
    else if (percentageScrolled < 40)
      html.classList.add("time-4pm");
    else if (percentageScrolled < 50)
      html.classList.add("time-5pm");
    else
      html.classList.add("time-6pm");
  }
  
  // (dirty) generic html for isometric graphics
  function makeIsometricDiv(name) {
    var html = '<div class="'+name+'"><div class="faces"><div class="face top"></div><div class="face left"></div><div class="face right"></div></div><div class="shadow"></div></div>';
    var div = document.createElement("div");
    div.innerHTML = html;
    return div.firstChild;
  }
  
  // make an isometric cloud
  function generateCloud(i, x, y, height) {
    var style = document.styleSheets.item(1);
    var cloud = makeIsometricDiv("cloud");
    cloud.id = "cloud" + i;
    cloud.style.left = x + "px";
    cloud.style.top = y + "px";
    cloud.style.webkitAnimationDelay = ~~(Math.random() * -60) + "s";
    cloud.querySelector(".shadow").style.top = height + "px";
    
    // closer (higher) clouds move faster
    var speed = height > 300 ? ~~Math.max(30, Math.random() * height/10) : 60;
    cloud.style.webkitAnimationDuration = speed + "s";
    
    // closer (higher) clouds are blurrier since we're focused on the distance
    var blur = height > 300 ? ~~(Math.random() * 3) : 0;
    cloud.style.webkitFilter = "blur(" + blur + "px)";
    
    // approximate the angle (Math.tan(30rad)) since the exact number isn't accurate
    // this is probably because rotateX(30deg) + skewX(30deg) !== 30deg
    // also, transitions vary in speed so some clouds will be off by a bit
    var angle = 0.6281;
    
    var deltaY = ~~(x * angle);
    var deltaX = x + 100; // 100 further than left edge of window
    
    if (style.addRule) {
      var keyframes = "0% {opacity:0} 1% {opacity:1} 100% {-webkit-transform:translateX(-"+deltaX+"px) translateY("+deltaY+"px)}";
      style.addRule("@-webkit-keyframes cloudmove"+i, keyframes);
      style.addRule("#cloud"+i, "-webkit-animation:cloudmove"+i+" infinite linear");
    }
    
    cloud.style.webkitTransform = "scale(" + Math.max(1, (Math.random() * 2)) + ")";
    
    return cloud;
  }
  
  // make an isometric sheep
  function generateSheep(i, x, y) {
    var sheep = makeIsometricDiv("sheep");
    sheep.id = "sheep" + i;
    sheep.style.left = x + "px";
    sheep.style.top = y + "px";
    return sheep;
  }
  
  function generateCar(i) {
    var car = makeIsometricDiv("car");
    car.id = "car" + i;
    return car;
  }
  
  function generateClouds(n) {
    var clouds = document.querySelector("#clouds");
    for (var i = 0; i < n; i++) {
      var randomLeft = ~~(Math.random() * window.innerWidth * 2);
      var randomTop = ~~(Math.random() * -100);
      var height = Math.max(200, ~~(Math.random() * 400));
      var cloud = generateCloud(i, randomLeft, randomTop, height);
      
      if (Math.random() < 0.8) {
        cloud.classList.add("high");
        cloud.style.webkitTransform = "scale(" + Math.max(3, (Math.random() * 5)) + ")";
      }
      
      clouds.appendChild(cloud);
    }
  }
  
  function generateCars(n) {
    var cars = document.querySelector("#cars");
    if (!cars) return;
      
    for (var i = 0; i < n; i++) {
      var car = generateCar(i);
      car.style.webkitAnimationDelay = ~~(Math.random() * -60) + "s";
      car.className = "car";
      
      var r = Math.random();
      if (r < 1)
        car.classList.add("yellow");
      if (r < 0.8)
        car.classList.add("red");
      if (r < 0.6)
        car.classList.add("blue");
      if (r < 0.4)
        car.classList.add("green");
      if (r < 0.2)
        car.classList.add("black");
      
      if (Math.random() < 0.5)
        car.classList.add("reverse");
      
      cars.appendChild(car);
    }
    
    // add +1 button to random car
    var allcars = cars.querySelectorAll(".car");
    var randomCar = allcars[~~(Math.random() * (allcars.length - 1))];
    var plusone = '<div class="plusone-button"><div class="g-plusone" data-href="http://flybyconf.nl"></div></div>';
    randomCar.innerHTML += plusone;
  }
  
  // sheeps!?
  function generateSheeps() {
    var blocks = document.querySelectorAll(".block");
    for (var b = 0; b < 2; b++) 
    {
      var block = blocks[b];
      var flock = document.createElement("div");
      var numSheep = Math.max(7, ~~(Math.random() * 15));
      flock.className = "flock";
      
      for (var i = 0; i < numSheep; i++) {
        var sheep = generateSheep(i, ~~(Math.random() * 100), ~~(Math.random() * 100));
        
        sheep.style.webkitAnimation = "sheepwander" + ~~(Math.random() * 3) + " infinite alternate ease-in-out 6s";
        sheep.style.webkitAnimationDelay = ~~(Math.random() * -5) + "s";
        
        flock.appendChild(sheep);
      }
      block.appendChild(flock);
    }
  }
  
  function drawMap() {
    var mapEl = document.getElementById("map");
    if (!mapEl) return;
    var map = new google.maps.Map(mapEl, {
      center: new google.maps.LatLng(52.37415,4.889044),
      zoom: 13,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true,
      scrollwheel: false
    });
    
    var directionsService = new google.maps.DirectionsService();
    var directionsDisplay = new google.maps.DirectionsRenderer({
      preserveViewport: true
    });
    directionsDisplay.setMap(map);
    
    var request = {
      origin: "stationsplein, amsterdam, netherlands",
      destination: "Pazzanistraat 8, Westerpark, Amsterdam, Nederland",
      travelMode: google.maps.DirectionsTravelMode.DRIVING
    };
    directionsService.route(request, function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
        directionsDisplay.getMap().panBy(-50,-82);
      }
    });
  }
  
  if (window.addEventListener) {
    window.addEventListener("load", function load() {
      
      // wait 500ms to animate loading to prevent weird draw glitch
      setTimeout(function() {
        document.querySelector("html").classList.remove("loading");
      }, 500);
      
      // let's do some embarrassing UA sniffing
      var handheld = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
      if (handheld) {
        document.querySelector("html").classList.add("handheld");
      }
      
      var diagonalScrolling = "webkitTransform" in document.body.style;
      if (diagonalScrolling && !handheld)
        document.body.classList.add("diagonal-scrolling");
      
      function tick() {
        var x, y;
        // do some diagonal scrolling
        if (diagonalScrolling) {
          x = -document.body.scrollTop;
          y = -document.body.scrollTop;
          document.body.style.webkitTransform = "translateX(" + x + "px) translateY(" + y + "px)";
        }
        if (!handheld)
          setTime();
        window.requestAnimFrame(tick);
      }
      window.requestAnimFrame(tick);
      
      // add moving isometric elements
      if (!handheld) {
        // dirty set timeout to get the clouds animating on the loading page
        setTimeout(function() {
          generateClouds(21);
        }, 500);
        generateCars(15);
        generateSheeps();
      }
      
      drawMap();
      
    }, false);
  }
  else {
    window.onload = function() {
      var ie = getInternetExplorerVersion();
      if (ie > -1 && ie < 9.0) {
        document.body.className = "no-support";
      }
    }
  }
