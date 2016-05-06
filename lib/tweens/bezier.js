(function(window, undefined) {

    function Bezier(mX1, mY1, mX2, mY2) {
        this.initialize(mX1, mY1, mX2, mY2);
    }
    //Bezier.prototype = new ParentClassName();
    //Bezier.prototype.parent_initialize = Bezier.prototype.initialize;    
    Bezier.prototype.initialize = function(mX1, mY1, mX2, mY2) {

        this.mX1 = mX1;
        this.mY1 = mY1;
        this.mX2 = mX2;
        this.mY2 = mY2;
        
    };
    
    Bezier.prototype.A = function(aA1, aA2) {
        return 1.0 - 3.0 * aA2 + 3.0 * aA1;
    };
    
    Bezier.prototype.B = function(aA1, aA2) {
        return 3.0 * aA2 - 6.0 * aA1;
    };
    
    Bezier.prototype.C = function(aA1) {
        return 3.0 * aA1;
    };

    Bezier.prototype.GetSlope = function(aT, aA1, aA2) {
        return 3.0 * this.A(aA1, aA2) * aT * aT + 2.0 * this.B(aA1, aA2) * aT + this.C(aA1);
    };

    Bezier.prototype.CalcBezier = function(aT, aA1, aA2) {
        return ((this.A(aA1, aA2) * aT + this.B(aA1, aA2)) * aT + this.C(aA1)) * aT;
    };

    Bezier.prototype.get = function(aX) {
        if (this.mX1 === this.mY1 && this.mX2 === this.mY2)
            return aX; // linear
        return this.CalcBezier(this.GetTForX(aX),this.mY1, this.mY2);
    };

    Bezier.prototype.GetTForX = function(aX) {
        // Newton raphson iteration
        var aGuessT = aX;
        for (var i = 0; i < 4; ++i) {
            var currentSlope = this.GetSlope(aGuessT, this.mX1, this.mX2);
            if (currentSlope === 0.0)
                return aGuessT;
            var currentX = this.CalcBezier(aGuessT, this.mX1, this.mX2) - aX;
            aGuessT -= currentX / currentSlope;
        }
        return aGuessT;
    };

    window.Bezier = Bezier;

}(window));
