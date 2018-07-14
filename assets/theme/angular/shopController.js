/* 
 Shop Cart product controllers
 */
ClassApartStore.controller('ShopController', function ($scope, $http, $timeout, $interval, $filter) {


    var searchProducts = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('title'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        remote: {
            url: baseurl + "Api/SearchSuggestApi/" + '%QUERY',
            wildcard: '%QUERY'
        }
    });

    $('#remote .typeahead').typeahead(null, {
        name: 'search-products',
        display: 'title',
        source: searchProducts,
        templates: {
            empty: [
                '<div class="empty-message">',
                "Can't Find!, Try Something Else",
                '</div>'
            ].join('\n'),
            suggestion: Handlebars.compile('<div class="searchholder"><div class="product_image_back serachbox-image" style="background:url(' + imageurlg + '{{file_name}});"></div><strong>{{title}}</strong></div>')
        }
    });


    $('.typeahead').bind('typeahead:open', function () {
        $(".tt-menu").css({"left": $(".search-input").position().left + "px"})
    });


    $('.typeahead').bind('typeahead:select', function (ev, suggestion) {
        window.location = baseurl + "Product/ProductDetails/" + suggestion.id;
    });





    //search data
    $(function () {
//        function log(message) {
//            $("<div>").text(message).prependTo("#log");
//            $("#log").scrollTop(0);
//        }
//
//        $("#searchdata").autocomplete({
//            source: function (request, response) {
//                $.ajax({
//                    url: baseurl + "Api/SearchSuggestApi",
//                    dataType: "jsonp",
//                    data: {
//                        term: request.term
//                    },
//                    success: function (data) {
//                        response(data);
//                    }
//                });
//            },
//            minLength: 2,
//            select: function (event, ui) {
//                console.log(ui.item)
////                log("Selected: " + ui.item.value + " aka " + ui.item.id);
//            }
//        });
    });

    //searchdata 

    var globlecart = baseurl + "Api/cartOperation";
    $scope.product_quantity = 1;

    var currencyfilter = $filter('currency');

    $scope.globleCartData = {};//cart data

    //get cart data
    $scope.getCartData = function () {
        $http.get(globlecart).then(function (rdata) {
            $scope.globleCartData = rdata.data;
            $scope.globleCartData['grand_total'] = $scope.globleCartData['total_price'];
            $(".cartquantity").text($scope.globleCartData.total_quantity);
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

    function equalHeight() {
        $('.products-container').each(function () {
            var mHeight = 0;
            $(this).children('div').children('div').height('auto');
            $(this).children('div').each(function () {
                var itemHeight = $(this).height();
                if (itemHeight > mHeight) {
                    mHeight = itemHeight;
                }
                $(this).children('div').height(mHeight + 'px');
            });
        });
    }

    //Get Menu data
    var globlemenu = baseurl + "Api/categoryMenu";
    $http.get(globlemenu).then(function (r) {
        $scope.categoriesMenu = r.data;
        //Define the maximum height for mobile menu
        $timeout(function () {
            equalHeight(); // Call Equal height function

            $('nav#dropdown').meanmenu({siteLogo: "<a href='/' class='logo-mobile-menu'><img src='img/logo.png' /></a>"});

            var wHeight = $(window).height();
            var mLogoH = $('a.logo-mobile-menu').outerHeight();
            wHeight = wHeight - 50;
            $('.mean-nav > ul').css('height', wHeight + 'px');


            $timeout(function () {
                var mhref = '<a href="#" class="meanmenu-reveal cartopen" style="right: 35px;left: auto;text-align: center;text-indent: 0px;font-size: 18px;"><i class="fa fa-shopping-cart"></i><b class="cartquantity">'+$scope.globleCartData.total_quantity+'</b></a>';
                $(".logo-mobile-menu").after(mhref);

                $(".cartopen").click(function () {
                    $('#mobileModel').modal('show')
                })

            }, 500);

        }, 500);





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