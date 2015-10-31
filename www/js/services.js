angular.module('starter.services', [])

.service('sharedToken', function () {
	var property = 'anonymous';

	return {
		getProperty: function () {
			return property;
		},
		setProperty: function(value) {
			property = value;
		}
	};
});