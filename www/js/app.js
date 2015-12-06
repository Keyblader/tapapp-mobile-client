angular.module('starter', ['ionic','ionic.service.core', 'jett.ionic.filter.bar', 'ionic.ion.autoListDivider', 'ngCordova', 'starter.controllers', 'starter.services', 'ngMap'])

.run(function($ionicPlatform) {
	$ionicPlatform.ready(function() {
		// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
		// for form inputs)
		if (window.cordova && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
			cordova.plugins.Keyboard.disableScroll(true);

		}
		if (window.StatusBar) {
			// org.apache.cordova.statusbar required
			StatusBar.styleDefault();
		}
	});
})

.config(function($stateProvider, $urlRouterProvider, $httpProvider) {

	$httpProvider.defaults.useXDomain = true;
	$stateProvider

	.state('app', {
		url: '/app',
		cache : false,
		abstract: true,
		templateUrl: 'templates/menu.html',
		controller: 'AppCtrl'
	})

	.state('app.inicio', {
		url: '/inicio',
		cache : true,
		views: {
			'menuContent': {
				templateUrl: 'templates/inicio.html',
				controller: 'inicioCtrl'
			}
		}
	})

	.state('app.anyadirBar', {
		url: '/anyadirBar',
		cache : true,
		views: {
			'menuContent': {
				templateUrl: 'templates/anyadirBar.html',
				controller: 'anyadirBarCtrl'
			}
		}
	})  
	.state('app.anyadirTapa', {
		url: '/anyadirTapa/:id',
		cache : true,
		views: {
			'menuContent': {
				templateUrl: 'templates/anyadirTapa.html',
				controller: 'anyadirTapaCtrl'
			}
		}
	})  
	.state('app.seleccionarBar', {
		url: '/seleccionarBar',
		cache : true,
		views: {
			'menuContent': {
				templateUrl: 'templates/seleccionarBar.html',
				controller: 'seleccionarBarCtrl'
			}
		}
	})  

	.state('app.anyadirBarPorTapa', {
		url: '/anyadirBarPorTapa',
		cache : true,
		views: {
			'menuContent': {
				templateUrl: 'templates/anyadirBarPorTapa.html',
				controller: 'anyadirBarPorTapaCtrl'
			}
		}
	})      

	.state('app.detalleTapa', {
		url: '/detalleTapa/:id',
		cache : false,
		views: {
			'menuContent': {
				templateUrl: 'templates/detalleTapa.html',
				controller: 'detalleTapaCtrl'
			}
		}
	})
	
	.state('app.detalleBar', {
		url: '/detalleBar/:id',
		cache : true,
		//cache: false,
		views: {
			'menuContent': {
				templateUrl: 'templates/detalleBar.html',
				controller: 'detalleBarCtrl'
			}
		}
	}) 
	
	.state('app.listaBares', {
		url: '/listaBares',
		cache : true,
		views: {
			'menuContent': {
				templateUrl: 'templates/listaBares.html',
				controller: 'listaBaresCtrl'
			}
		}
	}) 
	
	.state('registrarUsuario', {
		url: '/registrarUsuario',
		cache : false,
		templateUrl: 'templates/registrarUsuario.html',
		controller: 'registrarUsuarioCtrl'
	}) 
	
	.state('login', {
		url: '/login',
		cache : false,
		templateUrl: 'templates/login.html',
		controller: 'loginCtrl'
	}) 
		
	;
	
	// si se introduce una url diferente
	$urlRouterProvider.otherwise('/login');
});
