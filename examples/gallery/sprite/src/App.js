export default class MyApp extends ux.App {
    static _template() {
        const shared = {
            SpriteQuadList1: {
                id: 0,
                type: lng.SpriteQuadList, 
                isSharable: true,
                src: MyApp.getPath("sprite.png"), 
                w:450, 
                h:450
            },
            SpriteQuadList2: {
               id: 1,
               isSharable: true,
               type: lng.SpriteQuadList, 
               src: MyApp.getPath("rockies.jpeg"), 
               w:450, 
               h:450
           },
           SpriteQuadList3: {
              id: 2,
              isSharable: true,
              type: lng.SpriteQuadList, 
              src: MyApp.getPath("font.png"), 
              w:450, 
              h:450
          },
        };
        return {
            ImageTexture1: { type: lng.ImageTexture,
                quadsList: shared.SpriteQuadList1,
                bottom:0.1, left:0.05, top:80, right:60, x:0, y:500},
            ImageTexture2: { type:lng.ImageTexture, 
                quadsList: shared.SpriteQuadList1, 
                bottom:128, left:0.05, top:215, right:84.7, x:0, y:600},
            ImageTexture3: { type:lng.ImageTexture,
                quadsList: shared.SpriteQuadList2, 
                bottom:0.1, left:0.05, top:80, right:60, x:100, y:500},
            ImageTexture4: { type:lng.ImageTexture, 
                quadsList: shared.SpriteQuadList2, 
                bottom:128, left:0.05, top:215, right:84.7, x:100, y:600},
            ImageTexture5: { type:lng.ImageTexture,
                quadsList: shared.SpriteQuadList1, 
                bottom:0.1, left:0.05, top:80, right:60, x:200, y:500},
            ImageTexture6: { type:lng.ImageTexture, 
                quadsList: shared.SpriteQuadList1, 
               bottom:128, left:0.05, top:215, right:84, x:200, y:600},
            ImageTexture7: { type:lng.ImageTexture,
                quadsList: shared.SpriteQuadList3, 
                bottom:0.1, left:0.05, top:80, right:60, x:300, y:500},
            ImageTexture8: { type:lng.ImageTexture, 
                quadsList: shared.SpriteQuadList3, 
                bottom:128, left:0.05, top:215, right:84, x:300, y:6000},
            TextTexture1: { type:lng.TextTexture,
                text:{text:"XYZ"}, color:0xff00B74F, quadsList: shared.SpriteQuadList3, 
                bottom:128, left:0.05, top:215, right:84, x:400, y:500},
            ImageTextureA: { type:lng.ImageTexture, 
                quadsList: shared.SpriteQuadList3, 
                bottom:300, left:300, top:400, right:400, x:0, y:0},
            ImageTextureB: { type:lng.ImageTexture, 
                quadsList: shared.SpriteQuadList3, 
                bottom:300, left:400, top:400, right:500, x:100, y:0},
            ImageTextureC: { type:lng.ImageTexture, 
                quadsList: shared.SpriteQuadList3, 
                bottom:300, left:500, top:400, right:600, x:200, y:0},
            ImageTextureD: { type:lng.ImageTexture, 
                quadsList: shared.SpriteQuadList3, 
                bottom:300, left:600, top:400, right:700, x:300, y:0},
            ImageTextureE: { type:lng.ImageTexture, 
                quadsList: shared.SpriteQuadList3, 
                bottom:300, left:700, top:400, right:800, x:400, y:0},
            ImageTextureF: { type:lng.ImageTexture, 
                quadsList: shared.SpriteQuadList3, 
                bottom:300, left:800, top:400, right:900, x:500, y:0},
            ImageTextureG: { type:lng.ImageTexture, 
                quadsList: shared.SpriteQuadList3, 
                bottom:300, left:900, top:400, right:1000, x:600, y:0},
        };
    }
}

MyApp.COLORS = {
    BACKGROUND: 0xff282e32
};
