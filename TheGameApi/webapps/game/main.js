requirejs.config({
    paths: {
        text: '/webapps/libs/require/text',
        durandal: '/webapps/libs/durandal/js',
        plugins: '/webapps/libs/durandal/js/plugins',
        transitions: '/webapps/libs/durandal/js/transitions',
        knockout: '/webapps/libs/knockout-3.0.0',
        jquery: "/webapps/libs/jquery-1.10.2.min",
        jqueryUi: '/webapps/libs/jquery-ui-1.10.3.custom.min',
        jqueryFileDownload: '/webapps/libs/jquery.fileDownload',
        jqueryCookie: '/webapps/libs/jquery.cookie',
        async: '/webapps/libs/require/async',
        goog: '/webapps/libs/require/goog',
        propertyParser: '/webapps/libs/require/propertyParser',
        pubsub: '/webapps/libs/pubsub',
        guidgen: '/webapps/libs/guidgen',
        geojson: '/webapps/libs/GeoJSON',
        viewmodels: 'viewmodels',
        models: 'models',
        services: 'services',
    },
    game: {
        "*": {
            ko: "knockout",
            mapViewModel: 'viewmodels/mapviewmodel',
            notificationViewModel: 'viewmodels/notificationviewmodel',
            toolboxViewModel: 'viewmodels/toolboxviewmodel',
            measureToolViewModel: 'viewmodels/measuretoolviewmodel',
            redLineViewModel: 'viewmodels/redlineviewmodel',
            mapService: 'services/mapservice',
            southContentViewModel: 'viewmodels/southcontentviewmodel',

            //Models
            ilMapSettings: "models/ilmapsettings",
            geojsonutils: 'models/geojsonutils',
            directionUtils: 'models/directionutils',
            userGeoLocation: 'models/usergeolocation',
            mapContainer: "models/mapcontainer",

            //Bindings
            fadeVisible: '/webapps/common/bindings/fadevisible',
            slideVisible: '/webapps/common/bindings/slidevisible',

            //Common
            baseMaker: '/webapps/common/basemaker',
            baseWindowViewModel: '/webapps/common/viewmodels/basewindowviewmodel',
            autoClosingWindowViewModel: '/webapps/common/viewmodels/autoclosingwindowviewmodel',
            ilapi: "/webapps/common/ilapi",
            utils: '/webapps/common/utils',
        }
    }
});

define(['durandal/system', 'durandal/app', 'durandal/viewLocator'], function (system, app, viewLocator) {
    //>>excludeStart("build", true);
    system.debug(true);
    //>>excludeEnd("build");

    app.title = 'The Game';

    app.configurePlugins({
        router: true,
        dialog: true
    });

    app.start().then(function () {
        //Replace 'viewmodels' in the moduleId with 'views' to locate the view.
        //Look for partial views in a 'views' folder in the root.
        //viewLocator.useConvention();
        viewLocator.convertModuleIdToViewId = function (moduleId) {
            return moduleId.replace(/viewmodel/gi, "view");
        };
        //Show the app by setting the root view model for our application with a transition.
        app.setRoot('viewmodels/app');
        $.ajaxSetup({ cache: false });
    });
});
