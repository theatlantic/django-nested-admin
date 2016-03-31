'use strict';

var $;

if (typeof window.grp == 'object' && window.grp.jQuery) {
    $ = window.grp.jQuery;
} else if (typeof window.django == 'object' && window.django.jQuery) {
    $ = window.django.jQuery;
} else if (window.jQuery) {
    $ = window.jQuery;
} else {
    throw new Exception('jQuery is required');
}

export default $;
