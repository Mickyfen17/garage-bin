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

const itemLink = (link, id) => {
  link.on('click', () => {
    fetchSingleItem(id);
  });
};

const fetchSingleItem = (id) => {
  fetch(`api/v1/garage/${id}`)
    .then((response) => {
      return response.json();
    })
    .then((returnedItem) => {
      console.log(returnedItem);
      itemDetails(returnedItem);
    });
};

const itemDetails = (item) => {
  const closeBtn = $(`<button class="close-btn">X</button>`);
  const updateBtn = $(`<button class="update-btn">Update</button>`);
  const details = $(`
    <article class="item-details">
      <div class="details-wrapper">
        <h6>${item.name}</h6>
        <p>${item.reason}</p>
        <select class="cleanliness-input" name="Cleanliness">
          <option value="Sparkling">Sparkling</option>
          <option value="Dusty">Dusty</option>
          <option value="Rancid">Rancid</option>
        </select>
      </div>
    </article>
  `);
  closeDetails(closeBtn);
  $('#garage').append(details.append(closeBtn, updateBtn));
}

const closeDetails = (closeBtn) => {
  closeBtn.on('click', () => {
    $('.item-details').remove();
  })
}

const appendItems = (garageItems) => {
  garageItems.forEach((garageItem) => {
    const itemNode = $(`<article class="garage-item">${garageItem.name}</article>`);
    updateCouters(garageItem.cleanliness.toLowerCase());
    itemLink(itemNode, garageItem.id);
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