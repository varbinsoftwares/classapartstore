/* 
 Shop Cart product controllers
 */
ClassApartStore.controller('ShopController', function ($scope, $http, $timeout, $interval, $filter) {
    var globlecart = baseurl + "Api/cartOperation";
    $scope.product_quantity = 1;

    var currencyfilter = $filter('currency');

    $scope.globleCartData = {};//cart data

    //get cart data
    $scope.getCartData = function () {
        $http.get(globlecart).then(function (rdata) {
            $scope.globleCartData = rdata.data;
            $scope.globleCartData['grand_total'] = $scope.globleCartData['total_price'];
        }, function (r) {
        })
    }
    $scope.getCartData();

    //remove cart data
    $scope.removeCart = function (product_id) {
        $http.delete(globlecart + "/" + product_id).then(function (rdata) {
            console.log("asdfsadf");
            $scope.getCartData();
        }, function (r) {
        })
    }

    //update cart
    $scope.updateCart = function (productobj, oper) {
        if (oper == 'sub') {
            if (productobj.quantity == 1) {
            }
            else {
                productobj.quantity = Number(productobj.quantity) - 1;
            }
        }
        if (oper == 'add') {
            if (productobj.quantity > 5) {
            }
            else {
                productobj.quantity = Number(productobj.quantity) + 1;
            }
        }
        console.log(productobj.quantity)
        $http.put(globlecart + "/" + productobj.product_id + "/" + productobj.quantity).then(function (rdata) {
            $scope.getCartData();
        }, function (r) {
        })
    }

    //add cart product
    $scope.addToCart = function (product_id, quantity) {
        var productdict = {
            'product_id': product_id,
            'quantity': quantity,
        }
        var form = new FormData()
        form.append('product_id', product_id);
        form.append('quantity', quantity);
        swal({
            title: 'Adding to Cart',
            onOpen: function () {
                swal.showLoading()
            }
        })
        $http.post(globlecart, form).then(function (rdata) {
            swal.close();
            $scope.getCartData();
            swal({
                title: 'Added To Cart',
                type: 'success',
                html: "<p class='swalproductdetail'><span>" + rdata.data.title + "</span><br>" + "Total Price: " + currencyfilter(rdata.data.total_price, 'Rs.  ') + ", Quantity: " + rdata.data.quantity + "</p>",
                imageUrl: rdata.data.file_name,
                imageWidth: 100,
                timer: 1500,
//                 background: '#fff url(//bit.ly/1Nqn9HU)',
                imageAlt: 'Custom image',
                showConfirmButton: false,
                animation: true

            }).then(
                    function () {
                    },
                    function (dismiss) {
                        if (dismiss === 'timer') {
                        }
                    }
            )
        }, function () {
            swal.close();
            swal({
                title: 'Something Wrong..',
            })
        });
    }

    $scope.avaiblecredits = avaiblecredits;

    $scope.checkOrderTotal = function () {
        if ($scope.globleCartData.used_credit) {
            $scope.globleCartData.grand_total = $scope.globleCartData.total_price - $scope.globleCartData.used_credit;
        }
        else {
            $scope.globleCartData.used_credit = 0;
            $scope.globleCartData.grand_total = $scope.globleCartData.total_price;
            alert("Invalid Credit Entered.")
        }
    }

    //Get Menu data
    var globlemenu = baseurl + "Api/categoryMenu";
    $http.get(globlemenu).then(function (r) {
        $scope.categoriesMenu = r.data;
        console.log(r.data)
    }, function (e) {
    })

    $scope.projectDetailsModel = {'productobj': {}, 'quantity': 1};
    //get product detail model
    $scope.viewShortDetails = function (detailobj) {
        $scope.projectDetailsModel.productobj = detailobj;
    }


    $scope.modelProductQuantity = function () {

        $timeout(function () {
            var quantity = $("#model_quantity").val();
            $scope.projectDetailsModel.quantity = quantity;
        })

    }




})


ClassApartStore.controller('ProductDetails', function ($scope, $http, $timeout, $interval, $filter) {
    $scope.productver = {'quantity': 1};

    $scope.updateCartDetail = function (oper) {
        console.log(oper)
        if (oper == 'sub') {
            if ($scope.productver.quantity == 1) {
            }
            else {
                $scope.productver.quantity = Number($scope.productver.quantity) - 1;
            }
        }
        if (oper == 'add') {
            if ($scope.productver.quantity > 5) {
            }
            else {
                $scope.productver.quantity = Number($scope.productver.quantity) + 1;
            }
        }
    }

    $(function () {
        $(".select2").on('select2:select', function (e) {
            var data = e.params.data;
            var url = baseurl + "Product/ProductDetails/" + data.id + "";
            window.location = url;
        });
    })
})