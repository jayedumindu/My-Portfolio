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
      fname: fname,
      lname: lname,
      age: $("#cage").val(),
      city: $("#order-cst-city").val(),
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

$(
  $("#printInvoice").click(() => {
    // save customer
    saveCustomerFromOrder(tmpCustomer);
    // save order details
    let total = 0;
    cart.forEach((item) => {
      total += item.total;
    });
    let order = {
      id: calculateNextId(orders),
      customer: tmpCustomer,
      items: [...cart],
      total: total,
    };
    orders.push(order);
    // print invoice
    $("#o-id").text(order.id);
    $("#o-total").text(total);
    // add to the order list
    $("#order-list").append(`
    <button type="button" class="list-group-item list-group-item-action" onclick="loadOrderDetails('${order.id}')">${order.id}</button>
  `);
  })
);

function loadOrderDetails(id) {
  let order = orders.find((order) => {
    return order.id == id;
  });
  clearOrderDetails();
  $("#order-details-1").append(`
    <tr class="order-details-rows">
      <td>${order.customer.fname + " " + order.customer.lname}</td>
      <td>${order.customer.id}</td>
      <td>${order.total}</td>
    </tr>
  `);
  order.items.forEach((item) => {
    $("#order-details-2").append(`
 <tr class="order-details-rows">
      <td>${item.id}</td>
      <td>${item.name}</td>
      <td>${item.amount}</td>
      <td>${item.total}</td>
    </tr>
  `);
  });
}

function clearOrderDetails() {
  $(".order-details-rows").remove();
}

function saveCustomerFromOrder(customer) {
  customers.push(customer);
  clearAllCustomers();
  refreshCustomersFromArray();
  $("#cst-id").text(calculateNextId(customers));
  $("#cst-id-order-text").text(calculateNextId(customers));
}

function calculateNextId(arr) {
  if (arr.length > 0) {
    let id = arr[arr.length - 1].id;
    let [pre, frag] = id.split("-");
    let num = parseInt(frag) + 1;
    let count = num.toString().length;
    if (count == 1) {
      return pre + "-00" + num;
    } else if (count == 2) {
      return pre + "-0" + num;
    } else {
      return pre + "-" + num;
    }
  } else {
    return "T-001";
  }
}
