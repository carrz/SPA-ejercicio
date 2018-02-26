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
            $('.index-content .container').empty();
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
  $('.index-content .container').append(`<a href="">
			<div class="col-lg-3">
				<div class="card">
					<img src="${element.thumbnail}">
					<h6>${element.title}</h6>
					<p>$${element.price}</p>										
				</div>
			</div>
		</a>`)
}
//------EVENTO BARRA DE BÚSQUEDA---------//
$('#search').keydown(function(event) {
  if (event.which == 13) {
    let search = $('#search').val();
    event.preventDefault();
    fetchBySearch(function(response) {
      let data = response.results;
      $('.index-content .container').empty();
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