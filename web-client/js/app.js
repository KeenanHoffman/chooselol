'use strict';

angular.module('heartOfGoldApp', ['ngRoute', 'angular-jwt']).config(function ($httpProvider) {
  $httpProvider.interceptors.push('authInterceptor');
});
