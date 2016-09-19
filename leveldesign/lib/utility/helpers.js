Array.matrix = function(m, n, initial) {
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

Math.get_distance = function(p1, p2) {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
};

Math.get_angle = function(p1, p2) {
    // angle in degrees
    if (p1 === null || p2 === null) {
        return 0;
    }
    return Math.atan2(p2.y - p1.y, p2.x - p1.x);
//    var angleDeg = Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
//    return (angleDeg < 0) ? 360 + angleDeg : angleDeg;
};

Math.get_angle_between_vectors = function(v1, v2) {
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

Math.get_next_point = function(startPoint, distance, angle) {

    return {x: Math.cos(angle * Math.PI / 180) * distance + startPoint.x,
        y: Math.sin(angle * Math.PI / 180) * distance + startPoint.y};

};

Math.is_point_on_segment = function(startPoint, checkPoint, endPoint) {
    return ((endPoint.y - startPoint.y) * (checkPoint.x - startPoint.x)).toFixed(0) === ((checkPoint.y - startPoint.y) * (endPoint.x - startPoint.x)).toFixed(0) &&
            ((startPoint.x > checkPoint.x && checkPoint.x > endPoint.x) || (startPoint.x < checkPoint.x && checkPoint.x < endPoint.x)) &&
            ((startPoint.y >= checkPoint.y && checkPoint.y >= endPoint.y) || (startPoint.y <= checkPoint.y && checkPoint.y <= endPoint.y));

};

Math.insertionSort = function(sortMe,fnc) {

    for (var i = 0, j, tmp; i < sortMe.length; ++i) {
        tmp = sortMe[i];
        for (j = i - 1; j >= 0 && fnc(sortMe[j],tmp); --j){
            sortMe[j + 1] = sortMe[j];
        }            
        sortMe[j + 1] = tmp;
    }
};

Math.bubble_sort = function(a, fnc)
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

String.prototype.hashCode = function() {
    if (Array.prototype.reduce) {
        return "hash" + (this.split("").reduce(function(a, b) {
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

Math.degrees_to_radians = function(degrees) {
    return degrees / 180 * Math.PI;
};

Math.radians_to_degrees = function(radians) {
    return radians * 180 / Math.PI;
};

Math.random_float = function(min, max) {
    return min + Math.random() * (max - min);
};

Math.random_int = function(min, max) {
    return Math.floor(min + Math.random() * (max - min + 1));
};

Math.in_range = function(value, min, max) {
    return value >= Math.min(min, max) && value <= Math.max(min, max);
};

Math.normalize = function(value, min, max) {
    return (value - min) / (max - min);
};

Math.lerp = function(norm, min, max) {
    return (max - min) * norm + min;
};

Math.map = function(value, sourceMin, sourceMax, destMin, destMax) {
    return Math.lerp(Math.normalize(value, sourceMin, sourceMax), destMin, destMax);
};

Math.clamp = function(value, min, max) {
    return Math.min(Math.max(value, Math.min(min, max)), Math.max(min, max));
};

Math.round_decimal = function(value, places) {
    var mult = Math.pow(10, places);
    return Math.round(value * mult) / mult;
};


if (typeof(log) == "undefined"){
    function log(msg){
        if(msg instanceof Vector){
            console.log("x: "+msg.x+" y: "+msg.y);
        }else{
            console.log(msg);
        }        
    }
}


String.prototype.ends_with = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

function serialize (obj, prefix) {
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