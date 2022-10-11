let cart = [];
let orders = [];
let tmpCustomer;
let tmpItem;

$(
  $("#toNextMenu").click(() => {
    // temperory save customer details
    let [fname, lname] = $("#cname").val().split(" ");
    tmpCustomer = {
      id: $("#cst-id-order-text").text(),
      name: fname,
      name: lname,
      age: $("#cage").val(),
      city: $("#cst-city").val(),
    };
    console.log(tmpCustomer);
  })
);

$(
  $("#addToCart").click(() => {
    let amount = $("#item-card-amount").val();
    let total = amount * tmpItem.price;
    item = {
      id: tmpItem.id,
      name: tmpItem.name,
      amount: amount,
      total: total,
    };
    clearCart();
    findAndUpdateFromCart(item);
    loadAllFromCart();
  })
);

function loadItem(ob) {
  tmpItem = findItem($(ob).val());
  $("#item-card-title").text(tmpItem.name);
  $("#item-card-value").text(tmpItem.price);
  $("#item-card-stock").text(tmpItem.stock);
}

function findItem(id) {
  return (item = items.find((element) => {
    return element.id === id;
  }));
}

function findAndUpdateFromCart(ob) {
  let found = false;
  cart.forEach((item) => {
    if (item.id == ob.id) {
      amount = parseInt(item.amount);
      item.amount = amount + parseInt(ob.amount);
      item.total += ob.total;
      found = true;
      return;
    }
  });
  if (!found) cart.push(ob);
}

function loadAllFromCart() {
  cart.forEach((item) => {
    $("#cart-body").append(`
       <tr class="cart-items">
                 <td>${item.id}</td>
                 <td>${item.name}</td>
                 <td>${item.amount}</td>
                 <td>${item.total}</td>
                 <td><button class="btn btn-outline-danger pt-1" onclick="removeFromCart('${item.id}')">remove</button></td>
         </tr>
     `);
  });
}

function clearCart() {
  $(".cart-items").remove();
}

function removeFromCart(id) {
  cart = cart.filter((item) => {
    return item.id != id;
  });
  clearCart();
  loadAllFromCart();
}

$($("#printInvoice").click(() => {}));
