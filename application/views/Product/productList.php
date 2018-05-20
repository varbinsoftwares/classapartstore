<?php
$this->load->view('layout/header');
?>


<style>
    .product_image_back {
        background-size: contain!important;
        background-repeat: no-repeat!important;
        height: 200px!important;
        background-position-x: center!important;
        background-position-y: center!important;
    }

    .productblock{
        padding: 10px;
        border: 1px solid rgb(255, 214, 88);
        margin-bottom: 30px;
    }
</style>

<!-- Slider -->
<section class="sub-bnr" data-stellar-background-ratio="0.5">
    <div class="position-center-center">
        <div class="container">
            <h4>Shop page</h4>

            <!-- Breadcrumb -->
            <ol class="breadcrumb">
                <li><a href="#">Home</a></li>

                <?php
                foreach ($categorie_parent as $key => $value) {
                    $title = $value['category_name'];
                    $cid = $value['id'];
                    echo "<li><a href='" . site_url("Product/ProductList/" . $cid) . "'>$title</a></li>";
                }
                ?>
            </ol>
        </div>
    </div>
</section>

<!-- Content -->
<div id="content" ng-controller="ProductController"> 

    <!-- Shop Content -->
    <div class="shop-content pad-t-b-60">
        <div class="container" ng-if="productResults.products.length">
            <div class="row"> 


                <!-- Shop Side Bar -->
                <div class="col-md-3">
                    <div class="side-bar">
                        <div class="search">
                            <form>
                                <input type="text" placeholder="SEARCH">
                                <button type="submit"> <i class="fa fa-search"></i></button>
                            </form>
                        </div>

                        <!-- HEADING -->
                        <div class="heading">
                            <h6>Products Categories</h6>
                            <hr class="dotted">
                        </div>




                        <!-- CATEGORIES -->
                        <ul class="cate">
                            <?php
                            foreach ($categories as $key => $value) {
                                ?>                                   
                                <li><a href="<?php echo site_url("Product/ProductList/" . $value['id']); ?>"><?php echo $value['category_name']; ?></a></li>
                                <?php
                            }
                            ?>                           
                        </ul>

                        <!-- HEADING -->
                        <div class="heading">
                            <h6>Filter by price</h6>
                            <hr class="dotted">
                        </div>
                        <!-- PRICE -->
                        <div class="cost-price-content">
                            <div id="price-range" class="price-range"></div>
                            <span id="price-min" class="price-min">{{productResults.price.minprice}}</span> <span id="price-max" class="price-max">{{productResults.price.maxprice}}</span> <a href="#." class="btn btn-small btn-inverse pull-right" >FILTER</a> 
                        </div>

                        <div ng-repeat="(attrk, attrv) in productResults.attributes" ng-if="attrv.length > 1">
                            <!-- HEADING -->
                            <div class="heading">
                                <h6>{{attrk}}</h6>
                                <hr class="dotted">
                            </div>
                            <!-- COLORE -->
                            <ul class="cate">
                                <li ng-repeat="atv in attrv">
                                    <a href="#.">
                                        <label style="font-weight: 500">
                                            <input type="checkbox"> {{atv.attribute_value}} ({{atv.product_count}})
                                        </label>
                                    </a>

                                    <!--<a href="#."><input type="checkbox">{{atv.attribute_value}} <span>(32) </span></a>-->
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>


                <!-- Main Shop Itesm -->
                <div class="col-md-9"> 
                    <!-- SHOWING INFO -->
                    <div class="showing-info">
                        <p class="pull-left">Showing   1 - 12  of   {{productResults.product_count}} results</p>
                    </div>
                    <div class="row"> 
                        <!-- Item -->
                        <div class="col-sm-4" ng-repeat="product in productResults.products">
                            <div class="productblock">
                                <article class="shop-artical"> 
                                    <div class="product_image_back" style="background: url(<?php echo imageserver; ?>{{product.file_name}})"></div>
                                    <!-- Sale -->
                                    <div class="item-sale" ng-if="product.sale_price > 0">Sale</div>
                                    <div class="item-hover"> 
                                        <a href="#." class="btn" style="    font-size: 9px;" ng-click="addToCart(product.product_id, 1)">add to cart</a> 
                                        <a href="#." class="btn by" style="    font-size: 9px;">BUY NOW</a> 
                                    </div>
                                </article>
                                <div class="info" style="    height: 80px;"> 
                                    <a href="<?php echo site_url("Product/ProductDetails/"); ?>{{product.product_id}}">{{product.title}} </a> 
                                    <span class="price disc">
                                        <span class="line-through" ng-if="product.sale_price > 0">{{product.regular_price|currency:" Rs. "}}</span>
                                        <span>{{product.price|currency:" Rs. "}}</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Pagination -->
                    <ul class="pagination">
                        <li><a href="#.">1</a></li>
                        <li><a href="#.">2</a></li>
                        <li><a href="#.">....</a></li>
                        <li><a href="#.">&gt;</a></li>
                    </ul>
                </div>


            </div>
        </div>



        <div id="content"  ng-if="!productResults.products.length"> 
            <!-- Tesm Text -->
            <section class="error-page text-center pad-t-b-130">
                <div class="container "> 

                    <!-- Heading -->
                    <h1 style="font-size: 40px">No Product Found</h1>
                    <p>Products Will Comming Soon</p>
                    <hr class="dotted">
                    <a href="<?php echo site_url(); ?>" class="btn btn-inverse">BACK TO HOME</a>
                </div>
            </section>
        </div>

    </div>
</div>
<!-- End Content --> 


<script>
    var category_id = <?php echo $category; ?>;
</script>
<!--angular controllers-->
<script src="<?php echo base_url(); ?>assets/theme/angular/productController.js"></script>


<?php
$this->load->view('layout/footer');
?>