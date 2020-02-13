'use strict';

let createdBeasts = [];
let page = 1; 

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
  $('section[id!="photo-template"]').detach(); 
  createdBeasts = [];  
  let filePath = `data/page-${page}.json`;
  $.ajax(filePath, {method: 'GET', dataType: 'JSON'})
    .then(data => {
      data.forEach(object => {
        new Beast(object).render();
      });
      
      renderOptions();
    });

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
  $('#filter option').remove();
  dropdownOptions.forEach(keyword => {
    const $newOption = $('<option></option>');
    $newOption.text(keyword);
    $('#filter').append($newOption);
  });
}

$('#filter').change(function() {
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

$(".pagination").click(function(){
  let page = $(this).attr('data-page');
  renderJSON(page);
});

renderJSON(page);
