export default class MyApp extends ux.App {
    static _template() {
              return {
                Text1: {type:lng.TextTexture, text:{text:"Hello World \n This is Lightning app \n With Font atlas"}, color:0xff00B74F, x:300, y:300},
                Text2: {type:lng.TextTexture, src:MyApp.getPath("font.png"), color:0xff00B74F, x:0, y:0, h:100, w:100},
               };
    }
}

MyApp.COLORS = {
    BACKGROUND: 0xff282e32
};
