$(() => {
  fetchGarageItems();
});

const fetchGarageItems = () => {
  fetch('api/v1/garage')
  .then((response) => {
    return response.json();
  })
  .then((garageItems) => {
    appendItems(garageItems)
  });
};

const updateCouters = (cleanliness) => {
  const totalNum = $('.total-items-count').text()
  $('.total-items-count').text(parseInt(totalNum, 10) +1);
  if (cleanliness === 'sparkling') {
    const sparkNum = $('.sparkling-items-count').text();
    $('.sparkling-items-count').text(parseInt(sparkNum, 10) +1);
  } else if (cleanliness === 'dusty') {
    const dustyNum = $('.dusty-items-count').text()
    $('.dusty-items-count').text(parseInt(dustyNum, 10) +1);
  } else {
    const rancidNum = $('.rancid-items-count').text()
    $('.rancid-items-count').text(parseInt(rancidNum, 10) +1);
  }
};

const appendItems = (garageItems) => {
  garageItems.forEach((garageItem) => {
    const itemNode = $(`<article class="garage-item">${garageItem.name}</article>`)
    updateCouters(garageItem.cleanliness.toLowerCase());
    $('#garage').append(itemNode);
  });
};

const addNewItem = (name, reason, cleanliness) => {
  fetch('/api/v1/garage/new', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, reason, cleanliness }),
  })
  .then((response) => {
    return response.json();
  })
  .then((newItem) => {
    appendItems(newItem);
  });
};

const grabInputValues = () => {
  const nameInputVal = $('.name-input').val();
  const reasonInputVal = $('.reason-input').val();
  const cleanlinessInputVal = $('.cleanliness-input').val();
  addNewItem(nameInputVal, reasonInputVal, cleanlinessInputVal);
};

$('.add-item-btn').on('click', () => {
  grabInputValues();
});

$('.sort-btn').on('click', () => {
  console.log('SORTING');
});