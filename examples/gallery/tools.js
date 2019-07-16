
 class Tools {
    static getTexture (scene, obj) {
        return obj;// scene.createTexture(obj);
    }
    
    static getRoundRect (scene, w, h, radius, strokeWidth, strokeColor, fill, fillColor) {
        var obj = this.createRoundRect(scene, w, h, radius, strokeWidth, strokeColor, fill, fillColor);
        return obj;//getTexture(scene, obj);
    }

    static createRoundRect (scene, w, h, radius, strokeWidth, strokeColor, fill, fillColor) {
        fillColor = fill ? fillColor : "none";
        var boundW = w;
        var boundH = h;
        var data = "data:image/svg,"+'<svg viewBox="0 0 '+boundW+' '+boundH+'" xmlns="http://www.w3.org/2000/svg"><rect width="'+w+'" height="'+h+'" fill="'+fillColor+'" rx="'+radius+'" stroke="'+strokeColor+'" stroke-width="'+strokeWidth+'"/></svg>';
       
        var imgRes = scene.create({ t: "imageResource", url: data });
       
        var obj = scene.create({ t: "image", resource: imgRes, w:w, h:h, parent: scene.root});
    
        return obj;
    }

    static getSvgTexture (scene, url, w, h) {
        var obj = this.createSvg(scene, url, w, h);
        return obj;//getTexture(scene, obj);
    }

    static createSvg (scene, url, w, h) {
        return scene.create({ t: "image", url: url, w:w, h:h, parent: scene.root, stretchX: 1, stretchY: 1 });
    }

    static getShadowRect (scene, w, h, radius = 0, blur = 5, margin = blur * 2) {
        var obj = this.createShadowRect(scene, w, h, radius, blur, margin);
        return obj;//getTexture(scene, obj);
    }

    static createShadowRect (scene, w, h, radius, blur, margin) {
        var boundW = w + margin * 2;
        var boundH = h + margin * 2;
        var data = "data:image/svg,"+
              '<svg viewBox="0 0 '+boundW+' '+boundH+'" xmlns="http://www.w3.org/2000/svg" version="1.1"> \
                    <linearGradient id="rectGradient" gradientUnits="userSpaceOnUse" x1="0%" y1="180%" x2="100%" y2="-60%" gradientTransform="rotate(0)"> \
                    <stop offset="20%" stop-color="#00FF00" stop-opacity="0.5"/> \
                    <stop offset="50%" stop-color="#0000FF" stop-opacity=".8"/> \
                    <stop offset="80%" stop-color="#00FF00" stop-opacity=".5"/> \
                    </linearGradient> \
                    <filter id="rectBlur" x="0" y="0"> \
                    <feGaussianBlur in="SourceGraphic" stdDeviation="'+blur+'" /> \
                    </filter> \
                </defs> \
                <g enable-background="new" > \
                    <rect x="0" y="0" width="'+boundW+'" height="'+boundH+'" fill="url(#rectGradient)"  rx="'+radius+'" stroke-width="'+margin+'" filter="url(#rectBlur)"/> \
                </g> \
                </svg>';
       
        var imgRes = scene.create({ t: "imageResource", url: data });
       
        var obj = scene.create({ t: "image", resource: imgRes, w:boundW, h:boundH, parent: scene.root});
    
        return obj;
    }
    
};
module.exports.Tools = Tools; 