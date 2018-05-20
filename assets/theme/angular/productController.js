/* 
 Producrt list controllers
 */

ClassApartStore.controller('ProductController', function ($scope, $http, $timeout, $interval) {
    var url = baseurl+"Api/productListApi/" + category_id;
    $scope.productResults = {};
    $http.get(url).then(function (result) {
        $scope.productResults = result.data;
        $timeout(function () {
            $("#price-range").noUiSlider({
                range: {
                    'min': [Number($scope.productResults.price.minprice)],
                    'max': [Number($scope.productResults.price.maxprice)]
                },
                start: [Number($scope.productResults.price.minprice), Number($scope.productResults.price.maxprice)],
                connect: true,
                serialization: {
                    lower: [
                        $.Link({
                            target: $("#price-min")
                        })
                    ],
                    upper: [
                        $.Link({
                            target: $("#price-max")
                        })
                    ],
                    format: {
                        // Set formatting
                        decimals: 2,
                        prefix: '$'
                    }
                }
            })

        }, 1000)
    }, function () {
    });
})
