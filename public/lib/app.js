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

