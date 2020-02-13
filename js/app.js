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
  //h2 assign
  $newSection.find('h2').text(this.title);
  //image assign
  $newSection.find('img').attr('src', this.image_url);
  //p assign
  $newSection.find('p').text(this.description);
  //main append
  $('main').append($newSection);
};

$.ajax('data/page-1.json', {method: 'GET', dataType: 'JSON'})
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

function renderOptions() {
  dropdownOptions.forEach(keyword => {
    const $newOption = $('<option></option>');
    $newOption.text(keyword);
    $('#filter').append($newOption);
  });
}
