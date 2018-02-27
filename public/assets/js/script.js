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
            `<li id="${element.id}" class="subcategory"><a href="#">${element.name}</a></li>`);
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
  $('.index-content .row').append(`
    <div class="col-lg-2 col-md-4 mb-4">
      <a href="">
        <div class="card">
          <img class="card-img-top" src="${element.thumbnail}" alt="">
          <div class="card-body">
            <h6 class="card-title">${element.title}</h6>
            <p class="card-text">$${element.price}</p>
          </div>
        </div>
      </a>
    </div>`
)};


//------EVENTO BARRA DE BÚSQUEDA---------//
$('#search').keydown(function(event) {
  if (event.which == 13) {
    let search = $('#search').val();
    event.preventDefault();
    fetchBySearch(function(response) {
      let data = response.results;
      $('.index-content .row').empty();
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

  // This function is called only once - on page load.
  // It fills up the products list via a handlebars template.
  // It recieves one parameter - the data we took from products.json.
  // function generateAllProductsHTML(data){

  //   var list = $('.all-products .products-list');

  //   var theTemplateScript = $("#products-template").html();
  //   //Compile the template​
  //   var theTemplate = Handlebars.compile (theTemplateScript);
  //   list.append (theTemplate(data));


  //   // Each products has a data-index attribute.
  //   // On click change the url hash to open up a preview for this product only.
  //   // Remember: every hashchange triggers the render function.
  //   list.find('li').on('click', function (e) {
  //     e.preventDefault();

  //     var productIndex = $(this).data('index');

  //     window.location.hash = 'product/' + productIndex;
  //   })
  // }

  //--------------- USO DE page.js ------------------//
  page('/', index)
  page('/search', searchBar)
  page('/cart', cart)
  page('*', notFound)
  page()

  // Page index
  function index() {
    document.querySelector('.index-content').innerHTML = '<!-- Jumbotron Header -->' +
      '<div class="container">' +
        '<div class="row">' +
          '<div class="jumbotron text-center my-4">' +
            '<h1 class="display-3">A Warm Welcome!</h1>' +
            '<p class="lead">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsa, ipsam, eligendi, in quo sunt possimus non incidunt odit vero aliquid similique quaerat nam nobis illo aspernatur vitae fugiat numquam repellat.</p>' +
          '</div>' +
        '</div>' +
      '</div>'
  }

  function searchBar() {
    // renderProducts(element);
    // document.querySelector('.index-content .row').append(`
    //   `);
  }

  // page cart
  function cart() {
    document.querySelector('.index-content .container .row').innerHTML = '<div class="container-fluid">' +
        '<div class="row">' +
          '<div class="card">' +
           ' <div class="card-header bg-dark text-light">' +
               ' <i class="fa fa-shopping-cart" aria-hidden="true"></i>' +
                'Cart' +
               ' <a href="/" class="btn btn-outline-info btn-sm pull-right">Home</a>' +
               ' <div class="clearfix"></div>' +
            '</div>' +
            '<div class="card-body">' +

               ' <div class="row">' +
                    '<div class="col-xs-2 col-md-2">' +
                        '<img class="img-responsive" src="http://placehold.it/120x80" alt="preview">' +
                    '</div>' +
                    '<div class="col-xs-4 col-md-6">' +
                        '<h4 class="product-name"><strong>Product name</strong></h4><h4><small>Product description</small></h4>' +
                    '</div>' +
                    '<div class="col-xs-6 col-md-4 row">' +
                        '<div class="col-xs-6 col-md-6 text-right" style="padding-top: 5px">' +
                            '<h6><strong>25.00 <span class="text-muted">x</span></strong></h6>' +
                        '</div>' +
                        '<div class="col-xs-4 col-md-4">' +
                            '<input type="text" class="form-control input-sm" value="1">' +
                       ' </div>' +
                        '<div class="col-xs-2 col-md-2">' +
                            '<button type="button" class="btn btn-outline-danger btn-xs">' +
                                '<i class="fa fa-trash" aria-hidden="true"></i>' +
                            '</button>' +
                        '</div>' +
                   ' </div>' +
                '</div>' +
                '<hr>' +
               ' <div class="row">' +
                    '<div class="col-xs-2 col-md-2">' +
                        '<img class="img-responsive" src="http://placehold.it/120x80" alt="preview">' +
                    '</div>' +
                    '<div class="col-xs-4 col-md-6">' +
                        '<h4 class="product-name"><strong>Product name</strong></h4><h4><small>Product description</small></h4>' +
                   ' </div>' +
                    '<div class="col-xs-6 col-md-4 row">' +
                        '<div class="col-xs-6 col-md-6 text-right" style="padding-top: 5px">' +
                            '<h6><strong>25.00 <span class="text-muted">x</span></strong></h6>' +
                        '</div>' +
                        '<div class="col-xs-4 col-md-4">' +
                            '<input type="text" class="form-control input-sm" value="1">' +
                        '</div>' +
                       ' <div class="col-xs-2 col-md-2">' +
                            '<button type="button" class="btn btn-outline-danger btn-xs">' +
                                '<i class="fa fa-trash" aria-hidden="true"></i>' +
                            '</button>' +
                        '</div>' +
                    '</div>' +
                '</div>' +

                '<hr>' +
                '<div class="pull-right">' +
                    '<a href="/" class="btn btn-outline-secondary pull-right">Continue shopping</a>' +
                '</div>' +
            '</div>' +
            '<div class="card-footer">' +
                '<a href="{{route("product.home")}}" class="btn btn-success pull-right">Buy All</a>' +
                '<div class="pull-right" style="margin: 5px">' +
                    'Total: <b>$50.00</b>' +
                '</div>' +
            '</div>' +
        '</div>' +
       '</div>' +
      '</div>'
  }

  function notFound() {
    document.querySelector('.index-content .container .row').textContent = 'notFound'
  }