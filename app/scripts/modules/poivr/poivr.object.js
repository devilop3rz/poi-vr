
'use strict';

export class PoiObject {
    constructor (poiData) {

        var geometry, material, texture;
        
        console.log(poiData)

        geometry = new THREE.BoxGeometry( 0.1, 1, 1);
        geometry.applyMatrix( new THREE.Matrix4().makeTranslation( 10, 0, 0 ));

        texture = THREE.ImageUtils.loadTexture(poiData.img, {}, () => {
            this.mesh.scale.y = texture.image.height / 100;
            this.mesh.scale.z = texture.image.width / 100;
        });

        material =  new THREE.MeshLambertMaterial({map: texture});

        this.mesh = new THREE.Mesh( geometry, material);
        this.mesh.castShadow = true;
        this.mesh.rotation.y =  poiData.rotation * Math.PI / 180;
        this.mesh.moveUp = true;
        this.mesh.maxY = 4;

    }

}