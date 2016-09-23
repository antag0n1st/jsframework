Array.matrix = function (m, n, initial) {
    var a, i, j, mat = [];
    for (i = 0; i < m; i += 1) {
        a = [];
        for (j = 0; j < n; j += 1) {
            a[j] = initial;
        }
        mat[i] = a;
    }
    return mat;
};

Math.get_distance = function (p1, p2) {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
};

Math.get_angle = function (p1, p2) {
    // angle in degrees
    if (p1 === null || p2 === null) {
        return 0;
    }
    return Math.atan2(p2.y - p1.y, p2.x - p1.x);
//    var angleDeg = Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
//    return (angleDeg < 0) ? 360 + angleDeg : angleDeg;
};

/*
 * Calculates the angle ABC (in radians) 
 *
 * A first point
 * C second point
 * B center point
 */
Math.get_angle_between_3_points = function (pt1, pt2, pt3) {


    var dx1 = pt1.x - pt2.x;
    var dy1 = pt1.y - pt2.y;
    var dx2 = pt3.x - pt2.x;
    var dy2 = pt3.y - pt2.y;
    var a1 = Math.atan2(dy1, dx1);
    var a2 = Math.atan2(dy2, dx2);
    //var a = parseInt((a2 - a1) * 180 / Math.PI + 360) % 360;
    return a2 - a1;
};

Math.find_angle_between_3_points = function (A, B, C) {
    var AB = Math.sqrt(Math.pow(B.x - A.x, 2) + Math.pow(B.y - A.y, 2));
    var BC = Math.sqrt(Math.pow(B.x - C.x, 2) + Math.pow(B.y - C.y, 2));
    var AC = Math.sqrt(Math.pow(C.x - A.x, 2) + Math.pow(C.y - A.y, 2));
    return Math.acos((BC * BC + AB * AB - AC * AC) / (2 * BC * AB));
};

Math.get_next_point = function (startPoint, distance, angle) {

    return {x: Math.cos(angle * Math.PI / 180) * distance + startPoint.x,
        y: Math.sin(angle * Math.PI / 180) * distance + startPoint.y};

};

Math.is_point_on_segment = function (startPoint, checkPoint, endPoint) {
    return ((endPoint.y - startPoint.y) * (checkPoint.x - startPoint.x)).toFixed(0) === ((checkPoint.y - startPoint.y) * (endPoint.x - startPoint.x)).toFixed(0) &&
            ((startPoint.x > checkPoint.x && checkPoint.x > endPoint.x) || (startPoint.x < checkPoint.x && checkPoint.x < endPoint.x)) &&
            ((startPoint.y >= checkPoint.y && checkPoint.y >= endPoint.y) || (startPoint.y <= checkPoint.y && checkPoint.y <= endPoint.y));

};

function sqr(x) {
    return x * x;
}
function dist2(v, w) {
    return sqr(v.x - w.x) + sqr(v.y - w.y);
}
function distToSegmentSquared(p, v, w) {
    var l2 = dist2(v, w);
    if (l2 === 0)
        return dist2(p, v);
    var t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
    t = Math.max(0, Math.min(1, t));
    return dist2(p, {x: v.x + t * (w.x - v.x),
        y: v.y + t * (w.y - v.y)});
}
function distToSegment(p, v, w) {
    return Math.sqrt(distToSegmentSquared(p, v, w));
}

Math.find_shortest_distance_to_segment = function (point, segment_start, segment_end) {
    return distToSegment(point, segment_start, segment_end);
};

Math.find_perpendicular_point = function (point, line_start, line_end) {

    var k1 = ((line_end.y - line_start.y) * (point.x - line_start.x) - (line_end.x - line_start.x) * (point.y - line_start.y));
    var k2 = (Math.pow(line_end.y - line_start.y, 2) + Math.pow(line_end.x - line_start.x, 2));
    var k = k1 / k2;

    var x = point.x - k * (line_end.y - line_start.y);
    var y = point.y + k * (line_end.x - line_start.x);

    return new V(x, y);
};

Math.insertionSort = function (sortMe, fnc) {

    for (var i = 0, j, tmp; i < sortMe.length; ++i) {
        tmp = sortMe[i];
        for (j = i - 1; j >= 0 && fnc(sortMe[j], tmp); --j) {
            sortMe[j + 1] = sortMe[j];
        }
        sortMe[j + 1] = tmp;
    }
};

Math.bubble_sort = function (a, fnc)
{
    var swapped;
    do {
        swapped = false;
        for (var i = 0; i < a.length - 1; i++) {
            if (fnc(a[i], a[i + 1])) {
                var temp = a[i];
                a[i] = a[i + 1];
                a[i + 1] = temp;
                swapped = true;
            }
        }
    } while (swapped);
};

String.prototype.hashCode = function () {
    if (Array.prototype.reduce) {
        return "hash" + (this.split("").reduce(function (a, b) {
            a = ((a << 5) - a) + b.charCodeAt(0);
            return a & a;
        }, 0));
    }
    var hash = 0;
    if (this.length === 0)
        return hash;
    for (var i = 0; i < this.length; i++) {
        var character = this.charCodeAt(i);
        hash = ((hash << 5) - hash) + character;
        hash = hash & hash; // Convert to 32bit integer
    }
    return "hash" + hash;
};

Math.degrees_to_radians = function (degrees) {
    return degrees / 180 * Math.PI;
};

Math.radians_to_degrees = function (radians) {
    return radians * 180 / Math.PI;
};

Math.random_float = function (min, max) {
    return min + Math.random() * (max - min);
};

Math.random_int = function (min, max) {
    return Math.floor(min + Math.random() * (max - min + 1));
};

Math.random_from_array = function (array) {
    var ind = Math.random_int(0, array.length - 1);
    return array[ind];
};

Math.in_range = function (value, min, max) {
    return value >= Math.min(min, max) && value <= Math.max(min, max);
};

Math.normalize = function (value, min, max) {
    return (value - min) / (max - min);
};

Math.lerp = function (norm, min, max) {
    return (max - min) * norm + min;
};

Math.map = function (value, sourceMin, sourceMax, destMin, destMax) {
    return Math.lerp(Math.normalize(value, sourceMin, sourceMax), destMin, destMax);
};

Math.clamp = function (value, min, max) {
    return Math.min(Math.max(value, Math.min(min, max)), Math.max(min, max));
};

Math.round_decimal = function (value, places) {
    var mult = Math.pow(10, places);
    return Math.round(value * mult) / mult;
};


if (typeof (log) == "undefined") {
    function log(msg) {
        if (msg instanceof Vector) {
            console.log("x: " + msg.x + " y: " + msg.y);
        } else {
            console.log(msg);
        }
    }
}


String.prototype.ends_with = function (suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

String.prototype.starts_with = function (str) {
    return this.indexOf(str) === 0;
};

Math.get_line_intersection_with_polygon = function (p1, p2, polygon, result) {

    if (typeof result === 'undefined') {
        result = SAT.pool.get();
    }

    var length = polygon.points.length;
    var p3 = SAT.pool.get();
    var p4 = SAT.pool.get();

    var intersections = [];

    for (var i = 0; i < length; i++) {

        if (i === length - 1) {
            p3.copy(polygon.points[i]);
            p4.copy(polygon.points[0]);
        } else {
            p3.copy(polygon.points[i]);
            p4.copy(polygon.points[i + 1]);
        }
        p3.add(polygon.pos);
        p4.add(polygon.pos);
        var res = SAT.pool.get();

        if (Math.get_line_intersection(p1, p2, p3, p4, true, res)) {

            intersections.push(res);
        }
    }

    var index = -1;
    var distance = 9999999;
    var p = SAT.pool.get();

    for (var i = 0; i < intersections.length; i++) {

        var pp = intersections[i];

        var d = Math.get_distance(p1, pp);
        if (d < distance) {
            distance = d;
            index = i;
            p.copy(pp);
        }
    }

    if (index > -1) {
        result.copy(intersections[index]);
        return true;
    }
};

function timeout(callback, duration, object) {
    var t = new Timer(object, callback, duration);
    t.run();
    return t;
}

Math.get_line_intersection = function (a, b, e, f, asSegment, result) {

    if (typeof asSegment === 'undefined') {
        asSegment = true;
    }
    if (typeof result === 'undefined') {
        result = SAT.pool.get();
    }

    var a1 = b.y - a.y;
    var a2 = f.y - e.y;
    var b1 = a.x - b.x;
    var b2 = e.x - f.x;
    var c1 = (b.x * a.y) - (a.x * b.y);
    var c2 = (f.x * e.y) - (e.x * f.y);
    var denom = (a1 * b2) - (a2 * b1);

    if (denom === 0)
    {
        return null;
    }

    result.x = ((b1 * c2) - (b2 * c1)) / denom;
    result.y = ((a2 * c1) - (a1 * c2)) / denom;

    if (asSegment)
    {
        var uc = ((f.y - e.y) * (b.x - a.x) - (f.x - e.x) * (b.y - a.y));
        var ua = (((f.x - e.x) * (a.y - e.y)) - (f.y - e.y) * (a.x - e.x)) / uc;
        var ub = (((b.x - a.x) * (a.y - e.y)) - ((b.y - a.y) * (a.x - e.x))) / uc;
        if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
            return result;
        } else {
            return null;
        }
    }

    return result;

};

Object.defineProperty(Array.prototype, "remove_element", {
    // Specify "enumerable" as "false" to prevent function enumeration
    enumerable: false,
    /**
     * Removes all occurence of specified item from array
     * @this Array
     * @param itemToRemove Item to remove from array
     * @returns {Number} Count of removed items
     */
    value: function (itemToRemove) {
        // Count of removed items
        var removeCounter = 0;

        // Iterate every array item
        for (var index = 0; index < this.length; index++) {
            // If current array item equals itemToRemove then
            if (this[index] === itemToRemove) {
                // Remove array item at current index
                this.splice(index, 1);

                // Increment count of removed items
                removeCounter++;

                // Decrement index to iterate current position 
                // one more time, because we just removed item 
                // that occupies it, and next item took it place
                index--;
            }
        }

        // Return count of removed items
        return removeCounter;
    }
});

Object.defineProperty(Array.prototype, "get_random", {
    enumerable: false,
    value: function () {
        return this[Math.random_int(0, this.length - 1)];
    }

});


Object.defineProperty(Object.prototype, "extending", {
    // Specify "enumerable" as "false" to prevent function enumeration
    enumerable: false,
    /**
     * Removes all occurence of specified item from array
     * @this Array
     * @param itemToRemove Item to remove from array
     * @returns {Number} Count of removed items
     */
    value: function (sources) {

        for (var j = 0; j < sources.length; j++) {
            var source = sources[j];
            this._super = source.prototype;
            var s_keys = Object.keys(source.prototype);
            for (var i = 0; i < s_keys.length; i++) {
                var key = s_keys[i];

                if (!(key in this)) {
                    Object.getPrototypeOf(this)[key] = source.prototype[key];
                } else if (key === 'initialize') {
                    source.prototype[key].call(this);
                }

            }
        }
    }
});




var serialize = function (obj, prefix) {
    var str = [];
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
            str.push(typeof v == "object" ?
                    serialize(v, k) :
                    encodeURIComponent(k) + "=" + encodeURIComponent(v));
        }
    }
    return str.join("&");
};

function create_ajax() {
    var xhttp;
    if (window.XMLHttpRequest) {
        xhttp = new XMLHttpRequest();
    } else {
        // code for IE6, IE5
        xhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    return xhttp;
}

function ajax_get(url, callback) {

    var xhttp = create_ajax();

    xhttp.onreadystatechange = function () {

        if (xhttp.readyState === 4) {
            if (xhttp.status === 200) {
                if (callback) {
                    callback(JSON.parse(xhttp.responseText), xhttp);
                }
            } else {
                if (callback) {
                    callback(null, xhttp);
                }
            }
        }
    };

    xhttp.open("GET", url, true);
    xhttp.send();

}

function ajax_post(url, data, callback) {
    var xhttp = create_ajax();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState === 4) {
            if (xhttp.status === 200) {
                if (callback) {
                    callback(JSON.parse(xhttp.responseText), xhttp);
                }
            } else {
                if (callback) {
                    callback(null, xhttp);
                }
            }
        }
    };

    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    var data_string = serialize(data);
    xhttp.send(data_string);

}

function lang(key) {
    var text = Localization.instance().text[key];
    return text ? text : key;
}




function shuffle_array(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function treat_as_UTC(date) {
    var result = new Date(date);
    result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
    return result;
}

function days_between(start_date, end_date) {
    var millisecondsPerDay = 24 * 60 * 60 * 1000;
    return (treat_as_UTC(end_date) - treat_as_UTC(start_date)) / millisecondsPerDay;
}

function create_points_in_space(n, width, height, check_center, distance) {

    var distance_center = 350;
    var distance_between = distance || 250;

    var created = 0;

    var points = [];

    var center = new V(width / 2, height / 2);

    var cycles = 0;

    while (created < n) {

        var is_valid = true;
        var p = new V(Math.random_int(0, width), Math.random_int(0, height));

        cycles++;

        if (cycles > 1000) {
            distance_between--;
        }

        for (var i = 0; i < points.length; i++) {
            var point = points[i];
            if (Math.get_distance(p, point) < distance_between) {
                is_valid = false;
                break;
            }
        }

        if (check_center && Math.get_distance(p, center) < distance_center) {
            is_valid = false;
        }

        if (is_valid) {
            created++;
            points.push(p);
        }

    }

    return points;
}

function get_querystring(name){
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.search);
    if (results === null)
        return "";
    else
        return decodeURIComponent(results[1].replace(/\+/g, " "));
}