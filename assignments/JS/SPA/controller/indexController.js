var buttons = [
  $("#navToItems"),
  $("#navToCustomers"),
  $("#navToOrders"),
  $("#navToHome"),
  $("#navToViewOrderDetails"),
];
var sections = [
  $("#customer"),
  $("#item"),
  $("#order"),
  $("#order1"),
  $("#order2"),
  $("#order3"),
  $("#mainMenu"),
  $("#view-orders"),
];

// to item-form
buttons[0].click(function () {
  load(sections[1]);
  clearAllActive();
  $(this).addClass("active");
});

// to customer-form
buttons[1].click(function () {
  load(sections[0]);
  clearAllActive();
  $(this).addClass("active");
});

//  to order-form
buttons[2].click(function () {
  load(sections[2]);
  $("#header").html(" Step 1 : Fill Customer Details");
  sections[3].removeClass("collapse");
  sections[5].addClass("collapse");
  clearAllActive();
  $(this).addClass("active");
  $("#progress-bar").css("backgroundColor", "#4764f5");
  $("#progress-bar").css("width", "25%");
});

// homepage
buttons[3].click(function () {
  load(sections[6]);
  clearAllActive();
  $(this).addClass("active");
});

// to view orders
buttons[4].click(function () {
  load(sections[7]);
  clearAllActive();
  $(this).addClass("active");
});

$("#toNextMenu").click(() => {
  sections[3].addClass("collapse");
  sections[4].removeClass("collapse");
  $("#progress-bar").css("width", "75%");
  $("#header").html("Step 2 : Add Items to Cart ");
});

$("#toOrder1").click(() => {
  sections[4].addClass("collapse");
  sections[3].removeClass("collapse");
  $("#header").html(" Step 1 : Fill Customer Details");
  $("#progress-bar").css("width", "25%");
});

$("#toHome").click(() => {
  buttons[3].click();
});

// to order-1
$("#reOrder").click(() => {
  buttons[2].click();
  sections[5].addClass("collapse");
  $("#header").html(" Step 1 : Fill Customer Details");
  $("#progress-bar").css("width", "25%");
});

function clearAllActive() {
  buttons.forEach((element) => {
    element.removeClass("active");
  });
}

function load(section) {
  var cls = "collapse";
  // if the given section is collapsed then...
  if (section.hasClass(cls)) {
    sections.forEach((sec) => {
      if (sec != section) {
        if (!sec.hasClass(cls)) {
          sec.addClass(cls);
        }
      }
    });
    // load
    section.removeClass(cls);
  }
}
