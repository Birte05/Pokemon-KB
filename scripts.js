var pokemonRepository = (function () { //*adds an IIFE to the code
  var $modalContainer = $('#modal-container');
  var pokemonList = [];
  var apiUrl = 'https://pokeapi.co/api/v2/pokemon';
  //add each pokemon with attributes to pokemonList

  function add(pokemon) {
    pokemonList.push(pokemon);
  };

  //pull all pokemon data
  function getAll() {
    return pokemonList;
  };

  //add new listItem for each pokemon object
  function addListItem(pokemon) {
    // var pokemonList = document.querySelector('ul'); // => NodeElement
    // var pokemonList = document.querySelectorAll('ul'); // => NodeList
    var pokemonList = $('ul'); // => jQuerySelection
    //create a new li-item with button for each pokemon
    var listItem = $('<li></li>');
    var button = $('<button></button>');
    //append listItem to unordered list as its child
    pokemonList.append(listItem);
    //append the button to list item as its child
    listItem.append(button);
    //button shows the name of the current pokemon
    button.text(pokemon.name);
    button.addClass('pokemon-name'); // instead of pokemon-name list-button?
    //give button a custom style from styles.css to overwrite default styling
    listItem.addClass('button');
    //give the button a function when it is clicked
    button.on('click', function(event) {
    //calls function showDetails to show attributes from each pokemon
      showDetails(pokemon);
    });
  }

  //Function to load pokemon list from apiURL
  function loadList() {
    return $.ajax(apiUrl, { dataType: 'json' }).then(function (responseJSON) {
      responseJSON.results.forEach(function (item) {
        var pokemon = {
          name: item.name,
          detailsUrl: item.url,
          height: item.height,
        };
        add(pokemon);
      });
      //if promise is rejected, then catch (function(passed parameter) {...}
    }).catch (function (error) {
      console.error(error);
    });
  }

  //function to load details from each pokemon
  function loadDetails(item) {
    var url = item.detailsUrl;
    return $.ajax(url, { dataType: 'json' }).then(function (responseJSON) {
      //adds details to each item
      item.imageUrl = responseJSON.sprites.front_default;
      item.height = responseJSON.height;
      item.types = responseJSON.types; //add object.keys(details.types)?
    }).catch(function (error) {
      console.error(error);
    });
  }

  //function to show details of each pokemon in alert window
  function showDetails(item) {
    loadDetails(item).then(function (){
      showModal(item);
    });
  }

  //adds a modal to display information with close button, title and text
  function showModal(item) {
    var modalContainer = $('#modal-container')
    // Clear all existing modal content
    modalContainer.html('');

    var modal = $('<div></div>');
    modal.addClass('modal');

    // Add the new modal content
    var closeButtonElement = $('<button></button>');
    closeButtonElement.addClass('modal-close');
    closeButtonElement.text('Close');
    closeButtonElement.on('click', hideModal);

    var titleElement = $('<h1></h1>');
    titleElement.text(item.name);

    var contentElement = $('<p></p>');
    contentElement.text('Height: ' + item.height);

    var imgElement = $('<img>');
    imgElement.addClass('modal-img');
    imgElement.attr("src", item.imageUrl);

    modal.append(closeButtonElement);
    modal.append(titleElement);
    modal.append(imgElement);
    modal.append(contentElement);
    modalContainer.append(modal);

    modalContainer.addClass('is-visible');
  }

  function hideModal() {
    var modalContainer = $('#modal-container');
    modalContainer.removeClass('is-visible');
    modalContainer.html("");
  }

  // if modal is open register click on `esc` key and close modal
  window.addEventListener('keydown', (e) => {
    var modalContainer = $('#modal-container')
    if (e.key === 'Escape' && modalContainer.hasClass('is-visible')) {
      hideModal();
    }
  });

  //returns the values which can be used outside of the IIFE
  return {
    add: add,
    getAll: getAll,
    addListItem: addListItem,
    loadList: loadList,
    loadDetails: loadDetails,
    showDetails: showDetails,
  };
})(); //*End of IIFE

pokemonRepository.loadList().then(function() {
  pokemonRepository.getAll().forEach(function(pokemon){
    pokemonRepository.addListItem(pokemon);
  });
})