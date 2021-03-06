let globalOrder = 'asc';

$(() => {
  fetchGarageItems(globalOrder);
});

const fetchGarageItems = (order) => {
  fetch(`api/v1/garage?order=${order}`)
  .then((response) => {
    return response.json();
  })
  .then((garageItems) => {
    $('.garage-item').remove();
    clearCounters();
    appendItems(garageItems)
  });
};

clearCounters = () => {
  $('.total-items-count').text(0);
  $('.sparkling-items-count').text(0);
  $('.dusty-items-count').text(0);
  $('.rancid-items-count').text(0);
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
      itemDetails(returnedItem);
    });
};

const itemDetails = (item) => {
  const closeBtn = $('<button class="close-btn">Close</button>');
  const updateBtn = $('<button class="update-btn">Update</button>');
  const details = $(`
    <article class="item-details">
      <div class="details-wrapper">
        <h6>${item.name}</h6>
        <p>Reason it's in Garage: ${item.reason}</p>
        <p>Cleanliness: ${item.cleanliness}</p>
        <select class="cleanliness-input-details" name="Cleanliness">
          <option value="Sparkling">Sparkling</option>
          <option value="Dusty">Dusty</option>
          <option value="Rancid">Rancid</option>
        </select>
      </div>
    </article>
  `);
  closeDetails(closeBtn);
  updateItem(updateBtn, item.id);
  $('#garage').append(details.append(closeBtn, updateBtn));
};

const closeDetails = (closeBtn) => {
  closeBtn.on('click', () => {
    $('.item-details').remove();
  })
};

const updateItem = (updateBtn, id) => {
  updateBtn.on('click', () => {
    patchItem(id);
  });
};

const patchItem = (id) => {
  const cleanliness = $('.cleanliness-input-details').val();
  fetch(`api/v1/garage/item/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cleanliness }),
  })
  .then((response) => {
    return response.json();
  })
  .then((updatedItem) => {
    $('.item-details').remove();
    fetchGarageItems(globalOrder);
    itemDetails(updatedItem);
  });
};

const appendItems = (garageItems) => {
  garageItems.forEach((garageItem) => {
    const itemNode = $(`<article class="garage-item">${garageItem.name}</article>`);
    const deleteBtn = $('<button class="delete-btn">X</button>');
    updateCouters(garageItem.cleanliness.toLowerCase());
    itemLink(itemNode, garageItem.id);
    deleteItem(deleteBtn, garageItem.id);
    $('#garage').append(itemNode.append(deleteBtn));
  });
};

const deleteItem = (deleteButton, id) => {
  deleteButton.on('click', (e) => {
    e.stopPropagation();
    fetch(`api/v1/garage/item/${id}`, {
      method: 'DELETE',
    })
    .then(() => {
      fetchGarageItems(globalOrder);
    });
  });
}


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
  const inputsHaveValues = checkInputs();

  if (inputsHaveValues) {
    addNewItem(nameInputVal, reasonInputVal, cleanlinessInputVal);
    clearInputs();
  }
};

const clearInputs = () => {
  $(':text').val('');
};

$('.add-item-btn').on('click', () => {
  grabInputValues();
});

$('.sort-btn').on('click', () => {
  const checkedOrder = globalOrder === 'asc' ? globalOrder = 'desc' : globalOrder = 'asc';
  fetchGarageItems(checkedOrder)
});

const checkInputs = () => {
  $('.error').remove();
  let haveVals;
  const error = $('<p class="error">Else enter a value in all fields</p>');
  $('input').each((i, input) => {
    if (!input.value.length) {
      $('.add-item-btn').append(error);
      haveVals = false;
    } else {
      haveVals = true;
    }
  });
  return haveVals;
};

$('.toggle').on('click', () => {
  $('#door').slideToggle();
});