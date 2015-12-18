
'use strict';

import {PoiVr} from './modules/poivr/poivr.js';

class App {
    constructor() {
        console.log('Starting App');
        var poiVr = new PoiVr();
        poiVr.setupEnviroment();

        poiVr.createPoiObject({position: [51,10], img: 'img/joker.png'});
        poiVr.createPoiObject({position: [51, 8], img: 'img/joker.png'});
        poiVr.createPoiObject({position: [52,9], img: 'img/joker.png'});
    }
}


var app = new App();