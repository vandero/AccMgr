'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ngRoute',
    'myApp.view1',
    'myApp.view2',
    'myApp.version'
])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.otherwise({redirectTo: '/view1'});
    }])

    .controller('AppCtrl', function ($scope) {
        var CLIENT_ID = '929279558954-p46q28jrcmrgn9fhshlc0c2vh2eeh6uv.apps.googleusercontent.com';
        var SCOPES = 'https://www.googleapis.com/auth/drive';


        /**
         * Called when the client library is loaded to start the auth flow.
         */
        function handleClientLoad() {
            window.setTimeout(checkAuth, 1);
        }

        /**
         * Check if the current user has authorized the application.
         */
        function checkAuth() {
            gapi.auth.authorize(
                {'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': true},
                handleAuthResult);
        }

        /**
         * Called when authorization server replies.
         *
         * @param {Object} authResult Authorization result.
         */
        function handleAuthResult(authResult) {
            /*
            var authButton = document.getElementById('authorizeButton');
            var filePicker = document.getElementById('filePicker');
            authButton.style.display = 'none';
            filePicker.style.display = 'none';
            */
            if (authResult && !authResult.error) {
                // Access token has been successfully retrieved, requests can be sent to the API.
                //filePicker.style.display = 'block';
                //filePicker.onchange = uploadFile;
                console.log("Authentication token successfully retrieved")
            } else {
                console.log("Retrying authentication")
                // No access token could be retrieved, show the button to start the authorization flow.
                //authButton.style.display = 'block';
                //authButton.onclick = function() {
                    gapi.auth.authorize(
                        {'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': false},
                        handleAuthResult);
                //};
            }
        }

        $scope.loggedOnUser = "Robin";
    });
