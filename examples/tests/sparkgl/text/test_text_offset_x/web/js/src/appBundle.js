var appBundle = (function () {
    'use strict';

    let def = {
        x: 50,
        y: 50,
        vertical_space: 30,
        text: {
            fontFace: 'RobotoRegular',
            fontSize:  36,
            text:      'Text a little too long so this part won\'t be visible',
            longText:  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            textColor: 0xffff00ff,
            wordWrapWidth: 800,
            maxLines: 2,
        }
    };

    let Defaults = {
        get: function(prop) {
            let val = JSON.parse(JSON.stringify(def));
            if (!prop) {
                return val;
            }
            let keys = prop.split('.');
            for (let i in keys) {
                if (typeof (val[keys[i]]) == 'undefined') {
                    return undefined;
                }
                val = val[keys[i]];
            }
            return val;
        },
        applyToText: function(obj, props) {
            for (let i in props) {
                let prop = props[i];
                if (typeof(def.text[prop]) != 'undefined' && def.text[prop] !== false) {
                    obj.text[prop] = def.text[prop];
                }
            }
            return obj;
        }
    };

    let values = [-150, 0, 150];

    let def$1 = Defaults.get(),
        space = def$1.vertical_space || 30,
        x = def$1.x,
        y = def$1.y,
        template = {}
    ;

    for (let i in values)
    {
        template['Text_1_' + i] = Defaults.applyToText({
            x: x,
            y: y,
            text: {
                text:     def$1.text.text,
                maxLines: 1,
                cutEx:    values[i]
            }
        }, [
            'fontFace',
            'fontSize',
            'textColor'
        ]);

        y += (def$1.text.fontSize || space) + space;
    }


    let max_lines = 3;

    for (let i in values)
    {
        template['Text_2_' + i] = Defaults.applyToText({
            x: x,
            y: y,
            text: {
                text:     def$1.text.longText,
                maxLines: max_lines,
                cutEx:    values[i]
            }
        }, [
            'fontFace',
            'fontSize',
            'textColor',
            'wordWrapWidth'
        ]);

        y += (def$1.text.fontSize || space) * max_lines + space;
    }

    let values$1 = [-50, 0, 50];

    let def$2 = Defaults.get(),
        space$1 = def$2.vertical_space || 30,
        x$1 = def$2.x,
        y$1 = def$2.y,
        template$1 = {}
    ;

    for (let i in values$1)
    {
        template$1['Text_1_' + i] = Defaults.applyToText({
            x: x$1,
            y: y$1,
            text: {
                text:     def$2.text.text,
                maxLines: 1,
                cutEy:    values$1[i]
            }
        }, [
            'fontFace',
            'fontSize',
            'textColor'
        ]);

        y$1 += (def$2.text.fontSize || space$1) + space$1;
    }


    let max_lines$1 = 3;

    for (let i in values$1)
    {
        template$1['Text_2_' + i] = Defaults.applyToText({
            x: x$1,
            y: y$1,
            text: {
                text:     def$2.text.longText,
                maxLines: max_lines$1,
                cutEy:    values$1[i]
            }
        }, [
            'fontFace',
            'fontSize',
            'textColor',
            'wordWrapWidth'
        ]);

        y$1 += (def$2.text.fontSize || space$1) * max_lines$1 + space$1;
    }

    let values$2 = [
        {s: 0, e: 100},
        {s: 100, e: 200},
        {s: 100, e: 0}
    ];

    let def$3 = Defaults.get(),
        space$2 = def$3.vertical_space || 30,
        x$2 = def$3.x,
        y$2 = def$3.y,
        template$2 = {}
    ;

    for (let i in values$2)
    {
        template$2['Text_1_' + i] = Defaults.applyToText({
            x: x$2,
            y: y$2,
            text: {
                text:     def$3.text.text,
                maxLines: 1,
                cutSx:    values$2[i].s,
                cutEx:    values$2[i].e
            }
        }, [
            'fontFace',
            'fontSize',
            'textColor'
        ]);

        y$2 += (def$3.text.fontSize || space$2) + space$2;
    }


    let max_lines$2 = 3;

    for (let i in values$2)
    {
        template$2['Text_2_' + i] = Defaults.applyToText({
            x: x$2,
            y: y$2,
            text: {
                text:     def$3.text.longText,
                maxLines: max_lines$2,
                cutSx:    values$2[i].s,
                cutEx:    values$2[i].e
            }
        }, [
            'fontFace',
            'fontSize',
            'textColor',
            'wordWrapWidth'
        ]);

        y$2 += (def$3.text.fontSize || space$2) * max_lines$2 + space$2;
    }

    let def$4 = Defaults.get(),
        font_size = def$4.text.fontSize || 36
    ;


    let values$3 = [
        {s: font_size / 2, e: 0},
        {s: font_size / 2, e: font_size / 1.1},
        {s: 0, e: font_size / 1.2}
    ];


    let space$3 = def$4.vertical_space || 30,
        x$3 = def$4.x,
        y$3 = def$4.y,
        template$3 = {}
    ;

    for (let i in values$3)
    {
        template$3['Text_1_' + i] = Defaults.applyToText({
            x: x$3,
            y: y$3,
            text: {
                fontSize: font_size,
                text:     def$4.text.text,
                maxLines: 1,
                cutSy:    values$3[i].s,
                cutEy:    values$3[i].e
            }
        }, [
            'fontFace',
            'textColor'
        ]);

        y$3 += font_size + space$3;
    }


    let max_lines$3 = 3;

    for (let i in values$3)
    {
        template$3['Text_2_' + i] = Defaults.applyToText({
            x: x$3,
            y: y$3,
            text: {
                fontSize: font_size,
                text:     def$4.text.longText,
                maxLines: max_lines$3,
                cutSy:    values$3[i].s,
                cutEy:    values$3[i].e
            }
        }, [
            'fontFace',
            'textColor',
            'wordWrapWidth'
        ]);

        y$3 += font_size * max_lines$3 + space$3;
    }

    let values$4 = [-150, 0, 150];

    let def$5 = Defaults.get(),
        space$4 = def$5.vertical_space || 30,
        x$4 = def$5.x,
        y$4 = def$5.y,
        template$4 = {}
    ;

    for (let i in values$4)
    {
        template$4['Text_1_' + i] = Defaults.applyToText({
            x: x$4,
            y: y$4,
            text: {
                text:     def$5.text.text,
                maxLines: 1,
                cutSx:    values$4[i]
            }
        }, [
            'fontFace',
            'fontSize',
            'textColor'
        ]);

        y$4 += (def$5.text.fontSize || space$4) + space$4;
    }


    let max_lines$4 = 3;

    for (let i in values$4)
    {
        template$4['Text_2_' + i] = Defaults.applyToText({
            x: x$4,
            y: y$4,
            text: {
                text:     def$5.text.longText,
                maxLines: max_lines$4,
                cutSx:    values$4[i]
            }
        }, [
            'fontFace',
            'fontSize',
            'textColor',
            'wordWrapWidth'
        ]);

        y$4 += (def$5.text.fontSize || space$4) * max_lines$4 + space$4;
    }

    let def$6 = Defaults.get(),
        font_size$1 = def$6.text.fontSize || 36
    ;


    let values$5 = [
        - font_size$1 / 1.5,
          0,
          font_size$1 / 1.5
    ];


    let space$5 = def$6.vertical_space || 30,
        x$5 = def$6.x,
        y$5 = def$6.y,
        template$5 = {}
    ;

    for (let i in values$5)
    {
        template$5['Text_1_' + i] = Defaults.applyToText({
            x: x$5,
            y: y$5,
            text: {
                fontSize: font_size$1,
                text:     def$6.text.text,
                maxLines: 1,
                cutSy:    values$5[i]
            }
        }, [
            'fontFace',
            'textColor'
        ]);

        y$5 += font_size$1 + space$5;
    }


    let max_lines$5 = 3;

    for (let i in values$5)
    {
        template$5['Text_2_' + i] = Defaults.applyToText({
            x: x$5,
            y: y$5,
            text: {
                fontSize: font_size$1,
                text:     def$6.text.longText,
                maxLines: max_lines$5,
                cutSy:    values$5[i]
            }
        }, [
            'fontFace',
            'textColor',
            'wordWrapWidth'
        ]);

        y$5 += font_size$1 * max_lines$5 + space$5;
    }

    let font_faces = [
        'RobotoBold',
        'RobotoRegular',
        'DancingScriptRegular',
        'XFINITYSansTTMedium',
        'IndieFlower'
    ];

    let def$7 = Defaults.get(),
        x$6 = def$7.x,
        y$6 = def$7.y,
        template$6 = {}
    ;

    for (let i in font_faces)
    {
        template$6['Text_' + i] = Defaults.applyToText({
            x: x$6,
            y: y$6,
            text: {
                fontFace: font_faces[i],
                text:     def$7.text.text
            }
        }, [
            'fontSize',
            'textColor'
        ]);

        y$6 += (def$7.text.fontSize || def$7.vertical_space) + def$7.vertical_space;
    }

    let font_sizes = [6, 8, 10, 16, 30, 50, 100, 150];

    let def$8 = Defaults.get(),
        space$6 = def$8.vertical_space || 30,
        x$7 = def$8.x,
        y$7 = def$8.y,
        template$7 = {}
    ;

    for (let i in font_sizes)
    {
        template$7['Text_' + i] = Defaults.applyToText({
            x: x$7,
            y: y$7,
            text: {
                fontSize: font_sizes[i],
                text:     def$8.text.text,
                maxLines: 1
            }
        }, [
            'fontFace',
            'textColor'
        ]);

        y$7 += font_sizes[i] + (font_sizes[i] > space$6 ? space$6 : font_sizes[i]);
    }

    let font_styles = [
        false, // attribute will not set
        'normal',
        'italic',
        'bold',
        'italic bold'
    ];

    let def$9 = Defaults.get(),
        x$8 = def$9.x,
        y$8 = def$9.y,
        template$8 = {}
    ;

    for (let i in font_styles)
    {
        let tpl = {
            x: x$8,
            y: y$8,
            text: {
                text: def$9.text.text
            }
        };

        if (font_styles[i] !== false)
        {
            tpl.text.fontStyle = font_styles[i];
        }

        template$8['Text_' + i] = Defaults.applyToText(tpl, [
            'fontFace',
            'fontSize',
            'textColor'
        ]);

        y$8 += (def$9.text.fontSize || def$9.vertical_space) + def$9.vertical_space;
    }

    let def$a = Defaults.get(),
        font_size$2 = def$a.text.fontSize || 36
    ;


    let line_heights = [
        0.5 * font_size$2,
          1 * font_size$2,
          2 * font_size$2,
          3 * font_size$2,
          4 * font_size$2
    ];


    let space$7 = def$a.vertical_space || 30,
        x$9 = def$a.x,
        y$9 = def$a.y,
        template$9 = {}
    ;

    for (let i in line_heights)
    {
        template$9['Text_' + i] = Defaults.applyToText({
            x: x$9,
            y: y$9,
            text: {
                fontSize:   font_size$2,
                text:       def$a.text.longText,
                lineHeight: line_heights[i]
            }
        }, [
            'fontFace',
            'textColor',
            'wordWrapWidth',
            'maxLines'
        ]);

        y$9 += (def$a.text.maxLines || 5) * line_heights[i] + space$7;
    }

    let max_lines$6 = [1, 2, 3, 0];

    let def$b = Defaults.get(),
        space$8 = def$b.vertical_space || 30,
        x$a = def$b.x,
        y$a = def$b.y,
        template$a = {}
    ;

    for (let i in max_lines$6)
    {
        template$a['Text_' + i] = Defaults.applyToText({
            x: x$a,
            y: y$a,
            text: {
                text:     def$b.text.longText,
                maxLines: max_lines$6[i]
            }
        }, [
            'fontFace',
            'fontSize',
            'textColor',
            'wordWrapWidth'
        ]);

        y$a += (def$b.text.fontSize || space$8) * max_lines$6[i] + space$8;
    }

    let max_lines_suffix = [
        false, // attribute will not set
        null,  // attribute will set to "null"
        '',
        '...',
        '>>>'
    ];

    let def$c = Defaults.get(),
        space$9 = def$c.vertical_space || 30,
        x$b = def$c.x,
        y$b = def$c.y,
        template$b = {}
    ;

    for (let i in max_lines_suffix)
    {
        let tpl = {
            x: x$b,
            y: y$b,
            text: {
                text: def$c.text.longText
            }
        };

        if (max_lines_suffix[i] !== false)
        {
            tpl.text.maxLinesSuffix = max_lines_suffix[i];
        }

        template$b['Text_' + i] = Defaults.applyToText(tpl, [
            'fontFace',
            'fontSize',
            'textColor',
            'wordWrapWidth',
            'maxLines'
        ]);

        y$b += (def$c.text.fontSize || space$9) * (def$c.text.maxLines || 5) + space$9;
    }

    let offsets = [-50, 0, 50];

    let def$d = Defaults.get(),
        space$a = def$d.vertical_space || 30,
        x$c = def$d.x,
        y$c = def$d.y,
        template$c = {}
    ;

    for (let i in offsets)
    {
        template$c['Text_' + i] = Defaults.applyToText({
            x: x$c,
            y: y$c,
            text: {
                text:    def$d.text.text,
                offsetX: offsets[i]
            }
        }, [
            'fontFace',
            'fontSize',
            'textColor'
        ]);

        y$c += (def$d.text.fontSize || space$a) + space$a;
    }

    let def$e = Defaults.get(),
        font_size$3 = def$e.text.fontSize || 36
    ;


    let offsets$1 = [
        - font_size$3 / 2,
        0,
        2 * font_size$3
    ];


    let space$b = def$e.vertical_space || 30,
        x$d = def$e.x,
        y$d = def$e.y,
        max_lines$7 = 3,
        template$d = {}
    ;

    for (let i in offsets$1)
    {
        template$d['Text_' + i] = Defaults.applyToText({
            x: x$d,
            y: y$d,
            text: {
                fontSize: font_size$3,
                text:     def$e.text.longText,
                maxLines: max_lines$7,
                offsetY:  offsets$1[i]
            }
        }, [
            'fontFace',
            'textColor',
            'wordWrapWidth'
        ]);

        y$d += font_size$3 * max_lines$7 + space$b;
    }

    let paddings = [-50, 0, 50];

    let def$f = Defaults.get(),
        space$c = def$f.vertical_space || 30,
        x$e = def$f.x,
        y$e = def$f.y,
        template$e = {}
    ;

    for (let i in paddings)
    {
        template$e['Text_' + i] = Defaults.applyToText({
            x: x$e,
            y: y$e,
            text: {
                text:        def$f.text.text,
                paddingLeft: paddings[i]
            }
        }, [
            'fontFace',
            'fontSize',
            'textColor'
        ]);

        y$e += (def$f.text.fontSize || space$c) + space$c;
    }

    let paddings$1 = [-50, 0, 50];

    let def$g = Defaults.get(),
        space$d = def$g.vertical_space || 30,
        x$f = def$g.x,
        y$f = def$g.y,
        template$f = {}
    ;

    for (let i in paddings$1)
    {
        template$f['Text_' + i] = Defaults.applyToText({
            x: x$f,
            y: y$f,
            text: {
                text:         def$g.text.text,
                paddingRight: paddings$1[i]
            }
        }, [
            'fontFace',
            'fontSize',
            'textColor'
        ]);

        y$f += (def$g.text.fontSize || space$d) + space$d;
    }

    let text_align = [
        false, // attribute will not set
        'left',
        'center',
        'right'
    ];

    let def$h = Defaults.get(),
        space$e = def$h.vertical_space || 30,
        x$g = def$h.x,
        y$g = def$h.y,
        template$g = {}
    ;

    for (let i in text_align)
    {
        let tpl = {
            x: x$g,
            y: y$g,
            text: {
                text:     def$h.text.text,
                maxLines: 1,
            }
        };

        if (text_align[i] !== false)
        {
            tpl.text.textAlign = text_align[i];
        }

        template$g['Text_1_' + i] = Defaults.applyToText(tpl, [
            'fontFace',
            'fontSize',
            'textColor'
        ]);

        y$g += (def$h.text.fontSize || space$e) + space$e;
    }


    let max_lines$8 = 3;

    for (let i in text_align)
    {
        let tpl = {
            x: x$g,
            y: y$g,
            text: {
                text:     def$h.text.longText,
                maxLines: max_lines$8
            }
        };

        if (text_align[i] !== false)
        {
            tpl.text.textAlign = text_align[i];
        }

        template$g['Text_2_' + i] = Defaults.applyToText(tpl, [
            'fontFace',
            'fontSize',
            'textColor',
            'wordWrapWidth'
        ]);

        y$g += (def$h.text.fontSize || space$e) * max_lines$8 + space$e;
    }

    let values$6 = [
        false, // attribute will not set
        'alphabetic',
        'top',
        'hanging',
        'middle',
        'ideographic',
        'bottom'
    ];

    let def$i = Defaults.get(),
        text = 'Wqfegl',
        font_size$4 = def$i.text.fontSize || 36,
        text_width_with_space = 6 /* quantity of chars */ * (0.69 * font_size$4),
        x$h = def$i.x,
        y$h = def$i.y,
        template$h = {
            TopLine: {
                x: 0, y: y$h, w: 1100, h: 1, rect: true
            },
            BottomLine: {
                x: 0, y: y$h + font_size$4, w: 1100, h: 1, rect: true
            }
        }
    ;

    for (let i in values$6)
    {
        let tpl = {
            x: x$h,
            y: y$h,
            text: {
                fontSize: font_size$4,
                text:     text
            }
        };

        if (values$6[i] !== false)
        {
            tpl.text.textBaseline = values$6[i];
        }

        template$h['Text_' + i] = Defaults.applyToText(tpl, [
            'fontFace',
            'textColor'
        ]);

        x$h += text_width_with_space;
    }

    let text_colors = [
        false,      // attribute will not set
        0xff0000ff,
        0xff00ff00,
        0xffffff00
    ];

    let def$j = Defaults.get(),
        space$f = def$j.vertical_space || 30,
        x$i = def$j.x,
        y$i = def$j.y,
        template$i = {}
    ;

    for (let i in text_colors)
    {
        let tpl = {
            x: x$i,
            y: y$i,
            text: {
                text: def$j.text.text
            }
        };

        if (text_colors[i] !== false)
        {
            tpl.text.textColor = text_colors[i];
        }

        template$i['Text_' + i] = Defaults.applyToText(tpl, [
            'fontFace',
            'fontSize'
        ]);

        y$i += (def$j.text.fontSize || space$f) + space$f;
    }

    let word_wrap_widths = [
        0,
        200,
        400,
        800
    ];

    let def$k = Defaults.get(),
        space$g = def$k.vertical_space || 30,
        x$j = def$k.x,
        y$j = def$k.y,
        template$j = {}
    ;

    for (let i in word_wrap_widths)
    {
        template$j['Text_' + i] = Defaults.applyToText({
            x: x$j,
            y: y$j,
            text: {
                text:          def$k.text.longText,
                wordWrapWidth: word_wrap_widths[i]
            }
        }, [
            'fontFace',
            'fontSize',
            'textColor',
            'maxLines'
        ]);

        y$j += (def$k.text.maxLines || 5) * (def$k.text.fontSize || space$g) + space$g;
    }

    let def$l = Defaults.get(),
        x$k = def$l.x,
        y$k = def$l.y,
        template$k = {}
    ;


    let values$7 = [{
        textAlign: 'left'
    }, {
        textAlign: 'center',
        cutSx: 20,
        cutSy: 60
    }, {
        textAlign: 'right',
        cutSx: 20,
        cutSy: 60,
        cutEx: 220,
        cutEy: 250
    }];


    /*
     * Set common values
     */

    for (let i in values$7)
    {
        values$7[i].text          = def$l.text.longText;
        values$7[i].wordWrapWidth = 400;
        values$7[i].lineHeight    = 60;
        values$7[i].offsetY       = -45;
        values$7[i].paddingLeft   = -15;
        values$7[i].paddingRight  = 500;
    }


    /*
     * Test with maxLines
     */

    for (let i in values$7)
    {
        let tpl = {
            x: x$k,
            y: y$k,
            text: JSON.parse(JSON.stringify(values$7[i]))
        };

        tpl.text.maxLines = 4;

        template$k['Text_1_' + i] = Defaults.applyToText(tpl, [
            'fontFace',
            'fontSize',
            'textColor'
        ]);

        x$k += 450;
    }


    /*
     * Test without maxLines
     */

    x$k  = def$l.x;
    y$k += 300;

    for (let i in values$7)
    {
        let tpl = {
            x: x$k,
            y: y$k,
            text: JSON.parse(JSON.stringify(values$7[i]))
        };

        template$k['Text_2_' + i] = Defaults.applyToText(tpl, [
            'fontFace',
            'fontSize',
            'textColor'
        ]);

        x$k += 450;
    }

    // import test_text_old from './tests/text-old.js';


    let test_template = template$c;


    class MyApp extends ux.App {
        static getFonts() {
            return [
                {family: 'RobotoBold', url: MyApp.getPath('fonts/Roboto-Bold.ttf'), descriptors: {}}
                , {family: 'RobotoBoldItalic', url: MyApp.getPath('fonts/Roboto-BoldItalic.ttf'), descriptors: {}}
                , {family: 'RobotoBlack', url: MyApp.getPath('fonts/Roboto-Black.ttf'), descriptors: {}}
                , {family: 'RobotoItalic', url: MyApp.getPath('fonts/Roboto-Italic.ttf'), descriptors: {}}
                , {family: 'RobotoLight', url: MyApp.getPath('fonts/Roboto-Light.ttf'), descriptors: {}}
                , {family: 'RobotoRegular', url: MyApp.getPath('fonts/Roboto-Regular.ttf'), descriptors: {}}
                , {family: 'DancingScriptRegular', url: MyApp.getPath('fonts/DancingScript-Regular.ttf'), descriptors: {}}
                , {family: 'XFINITYSansTTMedium', url: MyApp.getPath('fonts/XFINITYSansTT-Medium.ttf'), descriptors: {}}
                , {family: 'IndieFlower', url: MyApp.getPath('fonts/IndieFlower.ttf'), descriptors: {}}
            ];
        }

        static _template() {
            return {
                BackgroundImage: {src: MyApp.getPath('bg-grayscale-1080p.png')},
                Test: test_template
            };
        }
    }

    MyApp.COLORS = {
        BACKGROUND: 0xff282e32
    };

    return MyApp;

}());
