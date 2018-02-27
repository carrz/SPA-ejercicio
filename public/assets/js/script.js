$(document).ready(function() {})

//-----------CONSULTA API ML PARA CATEGORÍAS/SUBCATEGORIAS------------//
function fetchCategories(callback, error, category) {
  fetch(`https://api.mercadolibre.com/categories/${category}`)
    .then(function(response) {
      return response.json();
    })
    .then((response) => {
      callback(response, category);
    }).catch((error) => {
      errorCallback(error);
    });
}

//---------------RENDERIZA CONTENIDO DE BARRA DE NAVEGACIÓN TRAS CONSULTA A API ML-------------------//
let categoryId = ["MLC1574", "MLC1367", "MLC1276"]
categoryId.forEach(idCategory => {
  fetchCategories(function(response, category) {
    let data = response.children_categories;
    data.forEach(element => {
      $(`#${category}`).append(
        `<li class="col-sm-3"> <ul> <li class="dropdown-header" id="${element.id}"> ${element.name}</li></ul></li>`)
      fetchCategories(function(response, category) {
        let data = response.children_categories;
        data.forEach(element => {
          $(`#${category}`).append(
            `<li id="${element.id}" class="subcategory"><a href="/subcategory/${element.id}">${element.name}</a></li>`);
        })
        $('.subcategory').unbind('click');
        $('.subcategory').on('click', (e) => {
          let idSubcategory = e.currentTarget.id;
          fetchProductsSubcategory(function(response) {
            let data = response.results;
            $('.index-content .container .row').empty();
            data.forEach(element => {
              renderProducts(element);
            })
          }, function(error) {
            console.error(error);
          }, idSubcategory)

        })
      }, function(error) {
        console.log(error);
      }, element.id)
    });
  }, function(error) {
    console.log(error);
  }, idCategory)
})

//-----------CONSULTA API ML PARA DETALLE DE PRODUCTOS EN SUBCATEGORIAS------------//
function fetchProductsSubcategory(callback, errorCallback, category) {
  fetch(`https://api.mercadolibre.com/sites/MLC/search?category=${category}&official_store_id=alloffset=0&limit=20`)
    .then(function(response) {
      return response.json();
    })
    .then(function(response) {
      callback(response);
      console.log(response)
    })
    .catch(function(error) {
      errorCallback(error);
      console.log(error)
    })
}
//-----------RENDERIZA RESULTADOS DE BÚSQUEDAS------------//
function renderProducts(element) {
  $('.index-content .container .row').append(`
    <div class="col-lg-2 col-md-4 mb-4">
      <div class="card">
        <a href="/item">
          <img class="card-img-top" src="${element.thumbnail}" alt="">
          <div class="card-body">
            <h6 class="card-title">${element.title}</h6>
            <p class="card-text">$${element.price}</p>
          </div>
        </a>
        <div class="card-footer">
          <button type="button" class="btn btn-success"><i class="fas fa-cart-plus"></i></button>
        </div>
      </div>
    </div>`
)};


//------EVENTO BARRA DE BÚSQUEDA---------//
$('#search').keydown(function(event) {

  if (event.which == 13) {
    let search = $('#search').val();
    // routing to search page
    page(`/search?=${search}`)
    event.preventDefault();
    fetchBySearch(function(response) {
      let data = response.results;
      $('.index-content .container .row').empty();
      data.forEach(element => {
        renderProducts(element);
      })
    }, function(error) {
      console.error(error);
    }, search)
    $('#search').val('');
  };
});
//-----------CONSULTA API ML PARA BARRA DE BÚSQUEDA------------//
function fetchBySearch(callback, errorCallback, search) {
  fetch(`https://api.mercadolibre.com/sites/MLC/search?q=${search}&offset=0&limit=20`)
    .then(function(response) {
      return response.json();
    })
    .then(function(response) {
      callback(response);
      console.log(response)
    })
    .catch(function(error) {
      errorCallback(error);
      console.log(error)
    })
}

  //--------------- USO DE page.js ------------------//
  // Configuración page.js: Manejar navegacion entre rutas
  // Formato: page('ruta', callback);
  page('/', index)
  // page('/subcategory/${element.id}', subcategory)
  // page('/search', searchBar)
  page('/cart', cart)
  page('/item', item)
  page('*', notFound)
  page()

  // Page index
  function index() {
    $('.index-content').empty();
    $('.index-content').append(`
      <!-- Jumbotron Header -->
      <div class="container">
        <div class="row">
          <div class="jumbotron text-center my-4">
            <h1 class="display-3">A Warm Welcome!</h1>
            <p class="lead">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsa, ipsam, eligendi, in quo sunt possimus non incidunt odit vero aliquid similique quaerat nam nobis illo aspernatur vitae fugiat numquam repellat.</p>
          </div>
        </div>
      </div>`)
  }

  // function subcategory() {}

  // function searchBar() {
    // renderProducts(element);
    // document.querySelector('.index-content .row').append(`
    //   `);
  // }

  // page cart
  function cart() {
    $('.index-content .container .row').empty();
    $('.index-content .container .row').append(`
      <div class="container-fluid">
        <div class="row">
          <div class="card">

            <div class="card-header bg-dark text-light">
              <i class="fa fa-shopping-cart" aria-hidden="true"></i>
              Cart
              <a href="{{route("product.home")}}" class="btn btn-outline-info btn-sm pull-right">Home</a>
              <div class="clearfix"></div>
            </div>

            <div class="card-body">
              <div class="row">
                <div class="col-xs-2 col-md-2">
                  <img class="img-responsive" src="http://placehold.it/120x80" alt="preview">
                </div>

                <div class="col-xs-4 col-md-6">
                  <h4 class="product-name"><strong>Product name</strong></h4><h4><small>Product Description</small></h4>
                </div>

                <div class="col-xs-6 col-md-4 row">
                  <div class="col-xs-6 col-md-6 text-right" style="padding-top: 5px">
                      <h6><strong>25.00 <span class="text-muted">x</span></strong></h6>
                  </div>
                  <div class="col-xs-4 col-md-4">
                    <input type="text" class="form-control input-sm" value="1">
                  </div>
                  <div class="col-xs-2 col-md-2">
                    <button type="button" class="btn btn-outline-danger btn-xs">
                        <i class="fa fa-trash" aria-hidden="true"></i>
                    </button>
                  </div>
                </div>
              </div>
              <hr>

              <div class="row">
                <div class="col-xs-2 col-md-2">
                  <img class="img-responsive" src="http://placehold.it/120x80" alt="preview">
                </div>
                <div class="col-xs-4 col-md-6">
                    <h4 class="product-name"><strong>Product name</strong></h4><h4><small>Product Description</small></h4>
                </div>

                <div class="col-xs-6 col-md-4 row">
                  <div class="col-xs-6 col-md-6 text-right" style="padding-top: 5px">
                    <h6><strong>25.00 <span class="text-muted">x</span></strong></h6>
                  </div>
                  <div class="col-xs-4 col-md-4">
                    <input type="text" class="form-control input-sm" value="1">
                  </div>
                  <div class="col-xs-2 col-md-2">
                    <button type="button" class="btn btn-outline-danger btn-xs">
                      <i class="fa fa-trash" aria-hidden="true"></i>
                    </button>
                  </div>
                </div>
              </div>
              <hr>

              <div class="pull-right">
                <input class="btn btn-outline-secondary pull-right" type="button" value="Continue shopping" onclick="history.back()" />
              </div>
            </div>
            <div class="card-footer">
              <a href="{{route("product.home")}}" class="btn btn-success pull-right">Buy All</a>
              <div class="pull-right" style="margin: 5px">
                Total: <b>$50.00</b>
              </div>
            </div>
          </div>
        </div>
      </div>`)
  }

  // item detail
  function item() {
    $('.index-content .container .row').empty();
    // agregar informacion de un producto
    $('.index-content .container .row').append(`<h2>Nombre del Producto</h2>
      <div class="container">
        <div class="row">
          <!-- Image -->
          <div class="col-12 col-lg-6">
              <div class="card bg-light mb-3">
                  <div class="card-body">
                      <a href="" data-toggle="modal" data-target="#productModal">
                          <img class="img-fluid" src="https://dummyimage.com/800x800/55595c/fff">
                          <p class="text-center">Zoom</p>
                      </a>
                  </div>
              </div>
          </div>

          <!-- Add to cart -->
          <div class="col-12 col-lg-6 add_to_cart_block">
              <div class="card bg-light mb-3">
                  <div class="card-body">
                      <p class="price">99.00 $</p>
                      <p class="price_discounted">149.90 $</p>
                      <form method="get" action="cart.html">
                          <div class="form-group">
                              <label for="colors">Color</label>
                              <select class="custom-select" id="colors">
                                  <option selected="">Select</option>
                                  <option value="1">Blue</option>
                                  <option value="2">Red</option>
                                  <option value="3">Green</option>
                              </select>
                          </div>
                          <div class="form-group">
                              <label>Quantity :</label>
                              <div class="input-group mb-3">
                                  <div class="input-group-prepend">
                                      <button type="button" class="quantity-left-minus btn btn-danger btn-number" data-type="minus" data-field="">
                                          <i class="fa fa-minus"></i>
                                      </button>
                                  </div>
                                  <input type="text" class="form-control" id="quantity" name="quantity" min="1" max="100" value="1">
                                  <div class="input-group-append">
                                      <button type="button" class="quantity-right-plus btn btn-success btn-number" data-type="plus" data-field="">
                                          <i class="fa fa-plus"></i>
                                      </button>
                                  </div>
                              </div>
                          </div>
                          <a href="cart.html" class="btn btn-success btn-lg btn-block text-uppercase">
                              <i class="fa fa-shopping-cart"></i> Add To Cart
                          </a>
                      </form>
                  </div>
              </div>
          </div>
      </div>

      <div class="row">
          <!-- Description -->
          <div class="col-12">
              <div class="card border-light mb-3">
                  <div class="card-header bg-primary text-white text-uppercase"><i class="fa fa-align-justify"></i> Description</div>
                  <div class="card-body">
                      <p class="card-text">
                          Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. Le Lorem Ipsum est le faux texte standard de l'imprimerie depuis les années 1500, quand un peintre anonyme assembla ensemble des morceaux de texte pour réaliser un livre spécimen de polices de texte. Il n'a pas fait que survivre cinq siècles, mais s'est aussi adapté à la bureautique informatique, sans que son contenu n'en soit modifié. Il a été popularisé dans les années 1960 grâce à la vente de feuilles Letraset contenant des passages du Lorem Ipsum, et, plus récemment, par son inclusion dans des applications de mise en page de texte, comme Aldus PageMaker.
                      </p>
                      <p class="card-text">
                          Contrairement à une opinion répandue, le Lorem Ipsum n'est pas simplement du texte aléatoire. Il trouve ses racines dans une oeuvre de la littérature latine classique datant de 45 av. J.-C., le rendant vieux de 2000 ans. Un professeur du Hampden-Sydney College, en Virginie, s'est intéressé à un des mots latins les plus obscurs, consectetur, extrait d'un passage du Lorem Ipsum, et en étudiant tous les usages de ce mot dans la littérature classique, découvrit la source incontestable du Lorem Ipsum. Il provient en fait des sections 1.10.32 et 1.10.33 du "De Finibus Bonorum et Malorum" (Des Suprêmes Biens et des Suprêmes Maux) de Cicéron. Cet ouvrage, très populaire pendant la Renaissance, est un traité sur la théorie de l'éthique. Les premières lignes du Lorem Ipsum, "Lorem ipsum dolor sit amet...", proviennent de la section 1.10.32.
                      </p>
                  </div>
              </div>
          </div>
      </div>
  </div>`);
  }

  // Page not found
  function notFound() {
    $('.index-content .container .row').append('<p>notFound</p>');
  }