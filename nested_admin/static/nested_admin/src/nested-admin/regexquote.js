module.exports = function regexQuote(str) {
    return (str+'').replace(/([\.\?\*\+\^\$\[\]\\\(\)\{\}\|\-])/g, '\\$1');
};
