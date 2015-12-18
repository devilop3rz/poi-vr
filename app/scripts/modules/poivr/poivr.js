
'use strict';

import {PoiObject} from './poivr.object.js';
import {Geoservice} from '../../services/geoservice.js';
       
export class PoiVr {

    constructor () {
        console.log('PoiVr initialized');
        this.poiObjects = [];
        this.geoService = new Geoservice();
    }

    setupEnviroment () {
        var light, spotLight;

        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 10000 );
        this.camera.position.z = 0;
        this.camera.position.y = 2;

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.shadowMapType = THREE.PCFSoftShadowMap;
        this.renderer.shadowMapEnabled = true;
        this.renderer.setClearColor( 0xffffff, 1 );
        document.querySelector('.app').appendChild(this.renderer.domElement);

        this.controls = new DeviceOrientationController( this.camera, this.renderer.domElement );
        this.controls.connect();

        // Lightning

        light = new THREE.AmbientLight( 0x404040 ); // soft white light
        this.scene.add( light );

        spotLight = new THREE.SpotLight( 0xffffff );
        spotLight.position.set( 100, 1000, 100 );
        spotLight.castShadow = true;
        spotLight.shadowMapWidth = 1024;
        spotLight.shadowMapHeight = 1024;
        spotLight.shadowCameraNear = 500;
        spotLight.shadowCameraFar = 4000;
        spotLight.shadowCameraFov = 30;

        this.scene.add( spotLight );

        // Floor
        var floor = new THREE.Mesh( new THREE.PlaneGeometry( 1000, 1000, 1, 1 ), new THREE.MeshLambertMaterial( { color: 0x0000ff } ) );
        floor.material.side = THREE.DoubleSide;
        floor.rotation.x = 1.5708;
        floor.receiveShadow = true;
        this.scene.add( floor );

        this.render();
    }

    createPoiObject(poiData = {position:0, img: ''}) {

        this.geoService.getPosition().then((data) => {
            poiData.rotation = this.geoService.getBearing(data, poiData.position);
            var poi = new PoiObject(poiData);
            this.scene.add(poi.mesh);
            this.poiObjects.push(poi);
        });
        
    }

    render () {
        this.controls.update();
        requestAnimationFrame( () =>{
            this.render();
        });
        this.renderer.render( this.scene, this.camera );
    }

}