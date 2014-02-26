'use strict';

angular.module('elTrato.anuncios').controller('AnunciosController', ['$scope', '$routeParams', '$rootScope', '$location', 'Global', 'Anuncios', 'Buscar', 'geolocation', '$fileUploader',
    function ($scope, $routeParams, $rootScope, $location, Global, Anuncios, Buscar, geolocation, $fileUploader) {
        $scope.global = Global;

        // Variable para mostrar opciones contraoferta...
        $scope.isCollapsed = true;

        // Texto para popover
        $scope.info = "Al aceptar recibir contraofertas, otros articulos o realizar un trueque te damos la opción de que nos " +
            "digas que te gustaría recibir, de esta manera, agilizamos muchisimo mas el trato que puedas realizar";
        // Fin texto popover

        // apartado geoLocation
        $scope.lat = "0";
        $scope.lng = "0";
        $scope.accuracy = "0";
        $scope.error = "";

        geolocation.getLocation().then(function (data) {
            $scope.alerts = [
                { type: 'success',
                    title: 'Muchisimas gracias!',
                    msg: 'Gracias por activar la geolocalización. Ya puedes disfrutar de todas las ventajas que te ofrece ' +
                        'elTrato.net. Disfrutalo' }
            ];

            $scope.lat = data.coords.latitude;
            $scope.lng = data.coords.longitude;

            $scope.accuracy = data.coords.accuracy;

        });

        $scope.$on('error', function (event, args) {
            console.log(args.title);
            $scope.alerts = [
                { type: args.type, msg: args.geolocationMsg, title: args.title }
            ];
        });
        // End geoLocation

        // apartado Alertas
        $scope.alerts = [
            { type: 'info',
                title: 'Disfruta al maximo de elTrato.net',
                msg: 'Para poder disfrutar al máximo de elTrato.net necesitamos que permitas la geolocalización en tu navegador.' +
                    'Las ventajas seran maximas, automaticamente calcularemos los productos que están cerca de ti y lo mejor de todo' +
                    'es que solo lo tendrás que hacer una vez' }
        ];

        $scope.closeAlert = function (index) {
            $scope.alerts.splice(index, 1);
        };
        // End Alertas

        // Añadir imagenes en array para bd
        var images = new Array();
        var contador = 1;
        $scope.fotoActivo = false;
        $scope.disponible1 = true;
        $scope.disponible2 = true;
        $scope.disponible3 = true;
        $scope.disponible4 = true;
        $scope.disponible5 = true;

        function nuevaImagen(image){
            console.log("Nueva imagen: " + image);
            $scope.$apply(function () {
                if (contador != 6) {
                    if (contador === 1) {
                        $scope.image = image;
                        images.push(image);
                        $scope.disponible1 = false;
                    } else if (contador === 2) {
                        $scope.image2 = image;
                        images.push(image);
                        $scope.disponible2 = false;
                    } else if (contador === 3) {
                        $scope.image3 = image;
                        images.push(image);
                        $scope.disponible3 = false;
                    } else if (contador === 4) {
                        $scope.image4 = image;
                        images.push(image);
                        $scope.disponible4 = false;
                    } else if (contador === 5) {
                        $scope.image5 = image;
                        images.push(image);
                        $scope.disponible5 = false;
                        $scope.fotoActivo = true;
                    }
                    contador++;
                }
            });
        }
        // end push array

        // Create new trato
        $scope.create = function () {

            var anuncio = new Anuncios({
                descripcion: this.descripcion,
                precio: this.precio,
                images: images
            });

            anuncio.$save(function (response) {
                if (!response.errorTag) {
                    $location.path('anuncios/' + response._id);
                } else {
                    $scope.alerts = [
                        { type: 'danger', title: response.title, msg: response.errorTag }
                    ];
                    $scope.model = {precio: response.anuncio.precio};
                    $scope.model = {descripcion: response.anuncio.descripcion};
                }
            });

            this.descripcion = '';
            this.tags = '';
        };
        // end new trato

        // delete trato
        $scope.remove = function (anuncio) {
            if (anuncio) {
                anuncio.$remove();

                for (var i in $scope.anuncios) {
                    if ($scope.anuncios[i] === anuncio) {
                        $scope.anuncios.splice(i, 1);
                    }
                }
            }
            else {
                $scope.anuncio.$remove();
                $location.path('anuncios');
            }
        };
        // end delete

        //update trato
        $scope.update = function () {
            var anuncio = $scope.anuncio;
            if (!anuncio.updated) {
                anuncio.updated = [];
            }
            anuncio.updated.push(new Date().getTime());

            anuncio.$update(function () {
                $location.path('anuncios/' + anuncio._id);
            });
        };
        //end update

        //show all tratos
        $scope.find = function () {
            Anuncios.query(function (anuncios) {
                $scope.anuncios = anuncios;
            });
        };
        // end show all

        //findOne
        $scope.findOne = function () {
            Anuncios.get({
                anuncioId: $routeParams.anuncioId
            }, function (anuncio) {
                $scope.anuncio = anuncio;
            });
        };
        //end findOne

        //Search tratos
        $scope.buscar = function () {
            Buscar.query({
                q: $routeParams.q
            }, function (anuncios) {
                $scope.anuncios = anuncios;
            });
        };
        //end search

        // Creates a uploader
        var uploader = $scope.uploader = $fileUploader.create({
            scope: $scope,
            url: 'http://localhost:3000/upload'
        });

        // ADDING FILTERS

        // Images only
        uploader.filters.push(function(item /*{File|HTMLInputElement}*/) {
            var type = uploader.isHTML5 ? item.type : '/' + item.value.slice(item.value.lastIndexOf('.') + 1);
            type = '|' + type.toLowerCase().slice(type.lastIndexOf('/') + 1) + '|';
            $scope.foto = true;
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        });

        // REGISTER HANDLERS

        uploader.bind('afteraddingfile', function (event, item) {
            // console.info('After adding a file', item);
        });

        uploader.bind('afteraddingall', function (event, items) {
           //    console.info('After adding all files', items);
        });

        uploader.bind('beforeupload', function (event, item) {
            //   console.info('Before upload', item);
        });

        uploader.bind('progress', function (event, item, progress) {
           // console.info('Progress: ' + progress, item);
        });

        uploader.bind('success', function (event, xhr, item, response) {
           // console.info('Success', xhr, item, response);
        });

        uploader.bind('cancel', function (event, xhr, item) {
           // console.info('Cancel', xhr, item);
        });

        uploader.bind('error', function (event, xhr, item, response) {
          //  console.info('Error', xhr, item, response);
        });

        uploader.bind('complete', function (event, xhr, item, response) {
           // console.info('Complete', xhr, item, response);
            console.info('NOMBRE IMAGEN: '+ item.file.name);
            nuevaImagen("/img/uploads/"+ item.file.name);
        });

        uploader.bind('progressall', function (event, progress) {
           // console.info('Total progress: ' + progress);
        });

        uploader.bind('completeall', function (event, items) {
           // console.info('Complete all', items);
        });

        // Item List Arrays
        $scope.items = [];

        // Add a Item to the list
        $scope.addItem = function () {

            $scope.items.push({
                name: $scope.itemName
            });

            // Clear input fields after push
            $scope.itemName = "";

            return false;
        };

    }]);