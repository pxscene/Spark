
import EqualizerSVG from "./EqualizerSVG"

px.import({
     scene: 'px:scene.1.js'
   // equSVG: 'root:EqualizerSVG.js'
}).then( function importsAreReady(imports)
{
    var scene = imports.scene;
    var root  = scene.root;

    var bg = scene.create({ t: 'rect', parent: root, fillColor: '#000', x: 0, y: 0, w: scene.w, h: scene.h, interactive: false });

    var blues = [
        { offset:   0, color: "#00b"},
        { offset:  25, color: "#00b"},
        { offset:  50, color: "#44d"},
        { offset:  75, color: "#88e"},
        { offset: 100, color: "#abf"},
    ];

    var greens = [
        { offset:   0, color: "#0b0"},
        { offset:  25, color: "#0b0"},
        { offset:  50, color: "#4d4"},
        { offset:  75, color: "#8e8"},
        { offset: 100, color: "#fff"},
    ];

    var reds = [
        { offset: 100, color: "#b00"},
        { offset:  75, color: "#b00"},
        { offset:  50, color: "#d44"},
        { offset:  25, color: "#e88"},
        { offset:   0, color: "#fab"},
    ];

    var styles =
    [
       // { parent: root, x:   150, y:   2, w: 900, h: 600, t: 300, rows: 10, cols:  20, grid:  5, bg: "#101", zero: 1 },

        { parent: bg, x:   2, y:   2, w: 422, h: 236, t: 300, rows: 10, cols:  20, grid:  5, bg: "#101" },
        { parent: bg, x: 428, y:   2, w: 422, h: 236, t: 300, rows:  5, cols:   9, grid:  6, bg: "#222222" },
        { parent: bg, x: 854, y:   2, w: 422, h: 236, t: 300, rows: 60, cols: 120, grid:  2, bg: "#111" },
        { parent: bg, x:   2, y: 242, w: 422, h: 236, t: 300, rows: 20, cols:  40, grid:  5, bg: "#121" },
        { parent: bg, x: 428, y: 242, w: 422, h: 236, t: 300, rows: 50, cols:  20, grid:  2, bg: "#202220" },
        { parent: bg, x: 854, y: 242, w: 422, h: 236, t: 400, rows: 40, cols:  20, grid:  4, bg: "#101" },
        { parent: bg, x:   2, y: 482, w: 422, h: 236, t: 300, rows: 5,  cols:   8, grid:  5, bg: "#449", stops: blues},
        { parent: bg, x: 428, y: 482, w: 422, h: 236, t: 300, rows: 30, cols:  25, grid:  2, bg: "#595", stops: greens},
        { parent: bg, x: 854, y: 482, w: 422, h: 236, t: 400, rows: 10, cols:   5, grid: 12, bg: "#966", stops: reds },
    ];

    styles.map( (s, i) =>
    {
        var equ = new EqualizerSVG(scene, s);

        equ.ready.then(
            (resolve) =>
            {
                equ.x = s.x;
                equ.y = s.y;

                equ.start();
            },
            (reject) =>
            {
                console.error("SVG >> Create of EqualizerSVG() failed - ", reject);
            }
        );
    })

}).catch( function importFailed(err)
{
    console.error("SVG >> Import failed for index.js: " + err);
});
