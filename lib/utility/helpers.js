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

Math.get_angle_between_vectors = function (v1, v2) {
    // angle in degrees
    if (v1 === null || v2 === null) {
        return 0;
    }

    //cw or ccw
    var c = v1.x * v2.y - v1.y * v2.x;

    var magnitude_product = Math.sqrt(v1.x * v1.x + v1.y * v1.y) * Math.sqrt(v2.x * v2.x + v2.y * v2.y);
    var dot_product = v1.x * v2.x + v1.y * v2.y;
    var a;

    if (magnitude_product == 0 || dot_product == 0)
        a = 0;

    //beacuse od NaN values
    var a = dot_product / magnitude_product;
    a = a > 1 ? 1 : a;
    a = a < -1 ? -1 : a;

    var angleRad = Math.acos(a);

    //orientation
    angleRad = c < 0 ? -angleRad : angleRad;

    var angleDeg = angleRad * 180 / Math.PI;

    return angleDeg === NaN ? 0 : angleDeg;
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


Object.defineProperty(Object.prototype, "extend", {
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
                if (!this.__proto__.hasOwnProperty(key)) {
                    this.__proto__[key] = source.prototype[key];
                } else if (key === 'initialize') {
                    source.prototype[key].call(this);
                }
            }
        }
    }
});
