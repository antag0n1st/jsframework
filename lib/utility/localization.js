(function (window, undefined) {

    var _instance = null;

    function Localization() {
        this.initialize();
    }
    
    Localization.prototype.initialize = function () {

        this.text = {};
        this.load();

    };

    Localization.prototype.load = function () {

        var lang = ContentManager.files[Config.lang];

        if (!lang) {
            return;
        }

        var lines = lang.split("\n");

        for (var i = 0; i < lines.length; i++) {

            var line = lines[i];
            var matches = line.match(/"(?:[^"\\]|\\.)*"/g);

            if (matches && matches.length === 2) {
                var key = matches[0].replace(/\"/g, "");

                var value = matches[1].replace(/\\"/g, "secrtquots");
                value = value.replace(/\"/g, "");
                value = value.replace(/secrtquots/g, "\"");
                value = value.replace(/\\n/g, "\n");

                this.text[key] = value;
            }


        }
    };

    Localization.instance = function () {
        if (_instance === null) {
            _instance = new Localization();
        }
        return _instance;
    };

    window.Localization = Localization;

}(window));