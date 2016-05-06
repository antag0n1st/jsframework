(function (window, undefined) {

    function Cookies() {
        this.initialize();
    }
    //Cookies.prototype = new ParentClassName();
    //Cookies.prototype.parent_initialize = Cookies.prototype.initialize;    

    Cookies.prototype.initialize = function () {
    };

    Cookies.set = function (key, value, days) {

        days = days ? days : 90;

        var d = new Date();
        d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = key + "=" + JSON.stringify(value) + "; " + expires;
    };

    Cookies.get = function (key) {
        var name = key + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }

            if (c.indexOf(name) === 0) {
                return JSON.parse(c.substring(name.length, c.length));
            }
        }
        return null;
    };

    Cookies.delete = function (key) {
        Cookies.set(key, "", -100);
    };

    window.Cookies = Cookies;

}(window));