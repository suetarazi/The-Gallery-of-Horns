'use strict';

let createdBeasts = [];
let page = 1;
const defaultSort = 'alphabetical';

function Beast (obj) {
  this.image_url = obj.image_url;
  this.title = obj.title;
  this.description = obj.description;
  this.keyword = obj.keyword;
  this.horns = obj.horns;
  createdBeasts.push(this);
}

Beast.prototype.render = function() {
  const source = $('#beast-template').html();
  const template = Handlebars.compile(source);
  const context = {title: this.title, keyword: this.keyword, image_url: this.image_url, description: this.description};
  const newSection = template(context);
  $('main').append(newSection);
};

const renderJSON = (page, sort) => {
  $('section').detach();
  createdBeasts = [];
  let filePath = `data/page-${page}.json`;
  $.ajax(filePath, {method: 'GET', dataType: 'JSON'})
    .then(data => {
      data.forEach(object => {
        new Beast(object);
      });
      sortBeasts(sort);
      createdBeasts.forEach(beast => {
        beast.render();
      });
      renderOptions();
    });
};

const sortBeasts = (sort) => {
  if(sort === 'alphabetical') {
    createdBeasts.sort((a, b) => {
      var aL = a.title.toLowerCase();
      var bL = b.title.toLowerCase();
      if(aL>bL) {
        return 1;
      } else if(aL<bL) {
        return -1;
      } else {
        return 0;
      }
    });
  } else if(sort === 'horns') {
    createdBeasts.sort((a, b) => {
      return (b.horns - a.horns);
    });
  }
};

function getUniqueKeywords() {
  const uniqueKeyWords=[];
  createdBeasts.forEach(object => {
    if(uniqueKeyWords.includes(object.keyword) === false) {
      uniqueKeyWords.push(object.keyword);
    }
  });
  return (uniqueKeyWords);
}

function renderOptions() {
  const dropdownOptions = getUniqueKeywords();
  $('#filter option[value!="default"]').remove();
  dropdownOptions.forEach(keyword => {
    const $newOption = $('<option></option>');
    $newOption.text(keyword);
    $('#filter').append($newOption);
  });
}

$('#filter').change(function() {
  const selectedText = $(this).find('option:selected').text();
  $('section').hide();
  $('section').each(index => {
    var $currentSection = $('section')[index];
    if($($currentSection).attr('data-keyword') === selectedText) {
      $($currentSection).show();
    }
  });
});

$('#sort').change(function() {
  const selected = $(this).find('option:selected').attr('value');
  renderJSON(page, selected);
});

$('.pagination').click(function(){
  let page = $(this).attr('data-page');
  renderJSON(page, defaultSort);
});

renderJSON(page, defaultSort);
