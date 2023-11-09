equal = function (a, b, options) {
    if (a == b) {
        return options.fn(this);
    }
    return options.inverse(this);
}

profit= function(a){
    return (a*10/100).toFixed(1)
}


module.exports={equal,profit}