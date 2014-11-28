'use strict';

angular.module('myApp.view1', ['ngRoute', 'angularFileUpload'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/view1', {
            templateUrl: 'view1/view1.html',
            controller: 'View1Ctrl'
        });
    }])

    .controller('View1Ctrl', function ($scope, FileUploader) {

        var uploader = $scope.uploader = new FileUploader();

        uploader.onAfterAddingFile = function(item) {
            console.log("Item added " + item);
            insertFile(item.file);
            item.cancel();
        };

        /**
         * Insert new file.
         *
         * @param {File} fileData File object to read data from.
         * @param {Function} callback Function to call when the request is complete.
         */
        function insertFile(fileData, callback) {
            var boundary = '-------314159265358979323846';
            var delimiter = "\r\n--" + boundary + "\r\n";
            var close_delim = "\r\n--" + boundary + "--";

            var reader = new FileReader();
            reader.readAsBinaryString(fileData);
            reader.onload = function(e) {
                var contentType = fileData.type || 'application/octet-stream';
                var metadata = {
                    'title': fileData.name,
                    'mimeType': contentType
                };

                var base64Data = btoa(reader.result);
                var multipartRequestBody =
                    delimiter +
                    'Content-Type: application/json\r\n\r\n' +
                    JSON.stringify(metadata) +
                    delimiter +
                    'Content-Type: ' + contentType + '\r\n' +
                    'Content-Transfer-Encoding: base64\r\n' +
                    '\r\n' +
                    base64Data +
                    close_delim;

                var request = gapi.client.request({
                    'path': '/upload/drive/v2/files',
                    'method': 'POST',
                    'params': {'uploadType': 'multipart'},
                    'headers': {
                        'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
                    },
                    'body': multipartRequestBody});
                if (!callback) {
                    callback = function(file) {
                        console.log(file)
                    };
                }
                request.execute(callback);
            }
        }

        $scope.hide = function() {
            return false;
        };

        /**
         * Start the file upload.
         *
         * @param {Object} evt Arguments from the file selector.
         */
        $scope.uploadFile = function($files) {
            console.log("Starting upload");
            alert("hello");
            /*
             gapi.client.load('drive', 'v2', function() {
             //var file = evt.target.files[0];
             insertFile($files[0]);
             });
             */
        };
    });