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
    loadItem($("#items-selector"));
  })
);

let regex5 = new Map();
(function () {
  regex5.set("#cname", "[a-z]{3,}\\s[a-z]{3,}");
  regex5.set("#cage", "[0-9]{2}");
})();

function validateOrder1() {
  let validated = true;
  regex5.forEach((value, key) => {
    console.log(value, key);
    let exp = new RegExp(value, "i");
    if (!exp.test($(key).val())) {
      validated = false;
      $(`${key}`).css("border-color", "rgb(179, 106, 106)");
    } else {
      $(`${key}`).css("border-color", "green");
    }
  });
  if (validated) {
    $("#toNextMenu").removeAttr("disabled");
  } else {
    $("#toNextMenu").attr("disabled", true);
  }
}

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

function calDate() {
  let today = new Date();
  today = today.getFullYear() + "/" + today.getMonth() + "/" + today.getDate();
  return today;
}

$(
  $("#printInvoice").click((e) => {
    // if cart is empty cancell the order
    let failed = false;
    if (cart.length == 0) {
      alert("Order failed, possible reasons : \nCart is empty \nretry!");
      failed = true;
    } else {
      cart.forEach((item) => {
        product = findItem(item.id);
        if (product.stock < item.amount) {
          alert("Item " + item.id + " exceeds stock : not enough items...");
          failed = true;
          return;
        } else {
          product.stock -= item.amount;
        }
      });
    }

    if (failed) {
      failed = false;
      e.stopPropagation();
      return;
    }
    // save customer
    saveCustomerFromOrder(tmpCustomer);
    // save order details
    let total = 0;
    cart.forEach((item) => {
      total += item.total;
    });
    orderModelCopy = { ...orderModel };
    orderModelCopy.id = calculateNextId(orders);
    orderModelCopy.customer = tmpCustomer;
    orderModelCopy.items = [...cart];
    orderModelCopy.total = total;
    orderModelCopy.date = calDate();
    orders.push(orderModelCopy);
    // print invoice
    $("#o-id").text(order.id);
    $("#o-total").text(total);
    // add to the order list
    $("#order-list").append(`
    <button type="button" class="list-group-item list-group-item-action" onclick="loadOrderDetails('${orderModelCopy.id}')">${orderModelCopy.id}</button>
  `);
    clearCart();
    cart = [];
    loadItem($("#items-selector"));
    // to printing the bill
    sections[4].addClass("collapse");
    sections[5].removeClass("collapse");
    $("#progress-bar").css("width", "100%");
    $("#progress-bar").css("backgroundColor", "green");
    $("#header").html("SUCCESS");
  })
);

function loadOrderDetails(id) {
  let order = orders.find((order) => {
    return order.id == id;
  });
  clearOrderDetails();
  $("#order-details-1").append(`
    <tr class="order-details-rows">
    <td>${order.date}</td>
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
