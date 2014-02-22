'use strict';

angular.module('elTrato', ['ngCookies', 'ngResource', 'ngRoute', 'ui.bootstrap', 'ui.route', 'elTrato.system', 'elTrato.anuncios',
    'geolocation', 'elTrato.signup', 'elTrato.usuarios']);

angular.module('elTrato.system', ['geolocation']);
angular.module('elTrato.anuncios', []);
angular.module('elTrato.signup', ['ui.map', "ui.event"]);
angular.module('elTrato.usuarios', []);