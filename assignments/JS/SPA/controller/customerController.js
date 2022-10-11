// first load data
var customers = [];
refreshCustomersFromArray();
$("#cst-id").text(calculateNextId(customers));

function delCustomer(id) {
  customers = customers.filter((item) => {
    return item.id != id;
  });
  clearAllCustomers();
  refreshCustomersFromArray();
}

function refreshCustomersFromArray() {
  customers.forEach((customer) => {
    $("#cst-container").append(
      ` <div class="col col-lg-4 d-flex justify-content-center customer">
       <div class="card" style="width: 18rem;">
      <img src="./assets/img/portrait.jpg" class="card-img-top" alt="...">
      <div class="card-body">
      <h5 class="card-title">${customer.fname} ${customer.lname}</h5>
        <ul class="list-unstyled">
          <li id="cst-id-txt">${customer.id}</li>
          <li>Age : ${customer.age}</li>
          <li>City : ${customer.city}</li>
        </ul>
        <a href="#" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" id="update-customer" onclick="openCustomerUpdateMenu(event)">Update Cutomer</a>
        <a href="#" class="btn btn-danger" onclick="delCustomer('${customer.id}')">Delete</a>
      </div>
     </div>
     </div>
     `
    );
  });
}

function clearAllCustomers() {
  // remove all existing items
  $(".customer").remove();
}

$(document).ready(function () {
  $("#addNewCustomer").click(() => {
    let customer = {
      id: $("#cst-id").text(),
      fname: $("#cst-fname").val(),
      lname: $("#cst-lastname").val(),
      age: $("#cst-age").val(),
      city: $("#cst-city").val(),
    };
    customers.push(customer);
    clearAllCustomers();
    refreshCustomersFromArray();
    $("#cst-id").text(calculateNextId(customers));
  });
});

function openCustomerUpdateMenu(event) {
  let id = $(event.target).parent().find("ul #cst-id-txt").text();
  let customer = customers.find((element) => {
    return element.id === id;
  });
  console.log(customer);
  $("#up-txt-cst-id").text(customer.id);
  $("#cst-up-id").val(customer.id);
  $("#cst-up-fname").val(customer.fname);
  $("#cst-up-lname").val(customer.lname);
  $("#cst-up-age").val(customer.age);
  customer.city === "Galle"
    ? $("#cst-up-city").val(1)
    : $("#cst-up-city").val(2);
}

function saveNewCustomerData() {
  let newCustomer = {
    id: $("#cst-up-id").val(),
    fname: $("#cst-up-fname").val(),
    lname: $("#cst-up-lname").val(),
    age: $("#cst-up-age").val(),
  };
  $("#cst-up-city").val() === 1
    ? (newCustomer.city = "Galle")
    : (newCustomer.city = "Matara");
  customers = customers.map((cst) => {
    return newCustomer.id === cst.id ? newCustomer : cst;
  });
  clearAllCustomers();
  refreshCustomersFromArray();
}

function validate(event, regex) {
  event.preventDefault();
  if (event.which == 13) {
    // to the next input
    var input = $(event.target).parent(".pass").next().find("input");
    if (input.length == 1) {
      input.focus();
    } else {
      $(event.target)
        .parent(".pass")
        .parent()
        .next()
        .find(".btn-primary")
        .click();
    }
    return;
  }

  let exp = new RegExp(regex, "i");
  if (exp.test(event.target.value)) {
    $(event.target).css("border-color", "green");
  } else {
    // invalid
    $(event.target).css("border-color", "rgb(179, 106, 106)");
  }
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
    return "C-001";
  }
}
