(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

'use strict';

var _poivr = require('./modules/poivr/poivr.js');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var App = function App() {
    _classCallCheck(this, App);

    console.log('Starting App');
    var poiVr = new _poivr.PoiVr();
    poiVr.setupEnviroment();

    poiVr.createPoiObject({ position: [51, 10], img: 'img/joker.png' });
    poiVr.createPoiObject({ position: [51, 8], img: 'img/joker.png' });
    poiVr.createPoiObject({ position: [52, 9], img: 'img/joker.png' });
};

var app = new App();

},{"./modules/poivr/poivr.js":2}],2:[function(require,module,exports){

'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
        value: true
});
exports.PoiVr = undefined;

var _poivrObject = require('./poivr.object.js');

var _geoservice = require('../../services/geoservice.js');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PoiVr = exports.PoiVr = (function () {
        function PoiVr() {
                _classCallCheck(this, PoiVr);

                console.log('PoiVr initialized');
                this.poiObjects = [];
                this.geoService = new _geoservice.Geoservice();
        }

        _createClass(PoiVr, [{
                key: 'setupEnviroment',
                value: function setupEnviroment() {
                        var light, spotLight;

                        this.scene = new THREE.Scene();

                        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);
                        this.camera.position.z = 0;
                        this.camera.position.y = 2;

                        this.renderer = new THREE.WebGLRenderer();
                        this.renderer.setSize(window.innerWidth, window.innerHeight);
                        this.renderer.shadowMapType = THREE.PCFSoftShadowMap;
                        this.renderer.shadowMapEnabled = true;
                        this.renderer.setClearColor(0xffffff, 1);
                        document.querySelector('.app').appendChild(this.renderer.domElement);

                        this.controls = new DeviceOrientationController(this.camera, this.renderer.domElement);
                        this.controls.connect();

                        // Lightning

                        light = new THREE.AmbientLight(0x404040); // soft white light
                        this.scene.add(light);

                        spotLight = new THREE.SpotLight(0xffffff);
                        spotLight.position.set(100, 1000, 100);
                        spotLight.castShadow = true;
                        spotLight.shadowMapWidth = 1024;
                        spotLight.shadowMapHeight = 1024;
                        spotLight.shadowCameraNear = 500;
                        spotLight.shadowCameraFar = 4000;
                        spotLight.shadowCameraFov = 30;

                        this.scene.add(spotLight);

                        // Floor
                        var floor = new THREE.Mesh(new THREE.PlaneGeometry(1000, 1000, 1, 1), new THREE.MeshLambertMaterial({ color: 0x0000ff }));
                        floor.material.side = THREE.DoubleSide;
                        floor.rotation.x = 1.5708;
                        floor.receiveShadow = true;
                        this.scene.add(floor);

                        this.render();
                }
        }, {
                key: 'createPoiObject',
                value: function createPoiObject() {
                        var _this = this;

                        var poiData = arguments.length <= 0 || arguments[0] === undefined ? { position: 0, img: '' } : arguments[0];

                        this.geoService.getPosition().then(function (data) {
                                poiData.rotation = _this.geoService.getBearing(data, poiData.position);
                                var poi = new _poivrObject.PoiObject(poiData);
                                _this.scene.add(poi.mesh);
                                _this.poiObjects.push(poi);
                        });
                }
        }, {
                key: 'render',
                value: function render() {
                        var _this2 = this;

                        this.controls.update();
                        requestAnimationFrame(function () {
                                _this2.render();
                        });
                        this.renderer.render(this.scene, this.camera);
                }
        }]);

        return PoiVr;
})();

},{"../../services/geoservice.js":4,"./poivr.object.js":3}],3:[function(require,module,exports){

'use strict';

Object.defineProperty(exports, "__esModule", {
        value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PoiObject = exports.PoiObject = function PoiObject(poiData) {
        var _this = this;

        _classCallCheck(this, PoiObject);

        var geometry, material, texture;

        console.log(poiData);

        geometry = new THREE.BoxGeometry(0.1, 1, 1);
        geometry.applyMatrix(new THREE.Matrix4().makeTranslation(10, 0, 0));

        texture = THREE.ImageUtils.loadTexture(poiData.img, {}, function () {
                _this.mesh.scale.y = texture.image.height / 100;
                _this.mesh.scale.z = texture.image.width / 100;
        });

        material = new THREE.MeshLambertMaterial({ map: texture });

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.castShadow = true;
        this.mesh.rotation.y = poiData.rotation * Math.PI / 180;
        this.mesh.moveUp = true;
        this.mesh.maxY = 4;
};

},{}],4:[function(require,module,exports){

'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Geoservice = exports.Geoservice = (function () {
    function Geoservice() {
        _classCallCheck(this, Geoservice);
    }

    _createClass(Geoservice, [{
        key: 'getPosition',
        value: function getPosition() {
            return new Promise(function (resolve) {
                navigator.geolocation.getCurrentPosition(function (data) {
                    resolve([data.coords.latitude, data.coords.longitude]);
                });
            });
        }
    }, {
        key: 'getBearing',
        value: function getBearing(start, end) {

            var radient, phi1, phi2, lam1, lam2, bearing;

            radient = Math.PI / 180.0;

            phi1 = start[0] * radient;
            phi2 = end[0] * radient;
            lam1 = start[1] * radient;
            lam2 = end[1] * radient;

            bearing = Math.atan2(Math.sin(lam2 - lam1) * Math.cos(phi2), Math.cos(phi1) * Math.sin(phi2) - Math.sin(phi1) * Math.cos(phi2) * Math.cos(lam2 - lam1)) * 180 / Math.PI;

            return (bearing + 360) % 360;
        }
    }]);

    return Geoservice;
})();

},{}]},{},[1])


//# sourceMappingURL=build.js.map
