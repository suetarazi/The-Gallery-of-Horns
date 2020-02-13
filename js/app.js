'use strict';

const createdBeasts = [];
const dropdownOptions = [];

function Beast (obj) {
  this.image_url = obj.image_url;
  this.title = obj.title;
  this.description = obj.description;
  this.keyword = obj.keyword;
  this.horns = obj.horns;
  createdBeasts.push(this);
}

Beast.prototype.render = function() {
  //create a template
  const beastTemplate = $('#photo-template').html();
  //make a new <section>
  const $newSection = $('<section></section>');
  //fill the new section:
  $newSection.html(beastTemplate);
  //assign identifying value
  $newSection.attr('data-keyword', this.keyword);
  //h2 assign
  $newSection.find('h2').text(this.title);
  //image assign
  $newSection.find('img').attr('src', this.image_url);
  //p assign
  $newSection.find('p').text(this.description);
  //main append
  $('main').append($newSection);
};

const renderJSON = (page) => {
  let filePath = `data/page-${page}.json`;
  $.ajax(filePath, {method: 'GET', dataType: 'JSON'})
    .then(data => {
      data.forEach(object => {
        new Beast(object).render();
      });
      getUniqueKeywords();
      renderOptions();
    });

  function getUniqueKeywords() {
    createdBeasts.forEach(object => {
      if(dropdownOptions.includes(object.keyword) === false) {
        dropdownOptions.push(object.keyword);
      }
    });
  }
};

function renderOptions() {
  dropdownOptions.forEach(keyword => {
    const $newOption = $('<option></option>');
    $newOption.text(keyword);
    $('#filter').append($newOption);
  });
}

$('#filter').on('change', function() {
  const selectedText = $(this).find('option:selected').text();
  console.log(selectedText);
  $('section').hide();
  $('section').each(index => {
    var $currentSection = $('section')[index];
    console.log($($currentSection));
    console.log($($currentSection).attr('data-keyword'));
    console.log(selectedText);
    if($($currentSection).attr('data-keyword') === selectedText) {
      $($currentSection).show();
    }
  });
});

renderJSON(1);
