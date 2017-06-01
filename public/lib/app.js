let count = 0;
let sparkling = 0;
let dusty = 0;
let rancid = 0;

$(() => {
  fetchGarageItems();
});

const fetchGarageItems = () => {
  fetch('api/v1/garage')
  .then((response) => {
    return response.json();
  })
  .then((garageItems) => {
    console.log(garageItems);
    appendItems(garageItems)
  });
};

const appendItems = (garageItems) => {
  garageItems.forEach((garageItem) => {
    const itemNode = $(`<article class="garage-item">${garageItem.name}</article>`)
    updateCouters(garageItem.cleanliness.toLowerCase());
    $('#garage').append(itemNode);
  });
  renderCounters();
};

const updateCouters = (cleanliness) => {
  count++;
  if (cleanliness === 'sparkling') {
    sparkling ++;
  } else if (cleanliness === 'dusty') {
    dusty++;
  } else {
    rancid++;
  }
};

const renderCounters = () => {
  const counterDiv = $(`
    <div class="counter-div">
      <h6>Total Items: ${count}</h6>
      <h6>Sparkling: ${sparkling}</h6>
      <h6>Dusty: ${dusty}</h6>
      <h6>Ranicd: ${rancid}</h6>
    </div>
  `);
  $('body').append(counterDiv);
};

$('.add-item-btn').on('click', () => {
  grabInputValues();
})

const grabInputValues = () => {
  const nameInputVal = $('.name-input').val();
  const reasonInputVal = $('.reason-input').val();
  const cleanlinessInputVal = $('.cleanliness-input').val();
  addNewItem(nameInputVal, reasonInputVal, cleanlinessInputVal);
};

const addNewItem = (name, reason, cleanliness) => {
  fetch('/api/v1/garage/new', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, reason, cleanliness }),
  })
  .then((response) => {
    console.log(response);
    return response.json();
  })
  .then((newItem) => {
    console.log(newItem);
    appendItems(newItem);
  });
};
