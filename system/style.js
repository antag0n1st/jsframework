(function (window, undefined) {

    function Style() {
        throw "can't initialize this class";
    }
    //Style.prototype = new ParentClassName();
    //Style.prototype.parent_initialize = Style.prototype.initialize;    
    Style.initialize = function () {

      

        Style.MULTY_BUTTON = {
            image_normal: 'button_big',
            image_selected: 'button_big',
            label_style: {
                def: {font: "56px gro_bold", fill: "white"},
                red: {
                    font: "56px gro_bold",
                    fill: "#e1001a",
                    stroke: "#ffffff",
                    strokeThickness: 10,
                    dropShadow: true,
                    dropShadowColor: "#7e470d",
                    dropShadowAngle: 0,
                    dropShadowDistance: 8
                },
                blue: {
                    font: "56px gro_bold",
                    fill: "#1794c3",
                    stroke: "#ffffff",
                    strokeThickness: 10,
                    dropShadow: true,
                    dropShadowColor: "#7e470d",
                    dropShadowAngle: 0,
                    dropShadowDistance: 8
                }
            }
        };

        Style.MULTY = {
            def: {font: "56px gro_bold", fill: "white"},
            red: {
                font: "56px gro_bold",
                fill: "#e1001a",
                stroke: "#ffffff",
                strokeThickness: 10,
                dropShadow: true,
                dropShadowColor: "#7e470d",
                dropShadowAngle: 0,
                dropShadowDistance: 8
            },
            blue: {
                font: "56px gro_bold",
                fill: "#1794c3",
                stroke: "#ffffff",
                strokeThickness: 10,
                dropShadow: true,
                dropShadowColor: "#7e470d",
                dropShadowAngle: 0,
                dropShadowDistance: 8
            }
        };

       

        Style.SAMPLE_BUTTON = {
            image_normal: 'button',
            image_selected: 'button',
            font_name: 'arial',
            font_size: 35,
            font_color: "#ffffff",
            shadow_color: "#555555",
            shadow_distance: 3,
            padding: 4
        };

        Style.SAMPLE_LABEL = {
            font_name: 'arial',
            font_size: 60,
            font_color: "#999999",
            shadow_color: "#777777",
            shadow_distance: 3,
            placeholder_color: "#333333",
            padding: 4,
            text_align: Label.TEXT_H_ALIGN_CENTER,
        };
    };

    window.Style = Style;

}(window));