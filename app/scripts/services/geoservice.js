
'use strict';

export class Geoservice {
    constructor () {

    }

    getPosition () {
        return new Promise((resolve) => {
            navigator.geolocation.getCurrentPosition((data) => {
                resolve ([data.coords.latitude, data.coords.longitude]);
            });
        });
        
    }

    getBearing (start, end) {

        var radient, phi1, phi2, lam1, lam2, bearing;
      
        radient = Math.PI/180.0;

        phi1= start[0] * radient;
        phi2= end[0] * radient;
        lam1= start[1] * radient;
        lam2= end[1] * radient;
      
        bearing = Math.atan2(Math.sin(lam2 - lam1) * Math.cos(phi2),
          Math.cos(phi1) * Math.sin(phi2) - Math.sin(phi1) * Math.cos(phi2) * Math.cos(lam2 - lam1)
        ) * 180 / Math.PI;

        return (bearing + 360) % 360;
    }
}