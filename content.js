let contentTitle = [];
let currentIndex = 0;
const itemsPerPage = 10;
let selectedCategory = "all";

// Wait until all required HTML elements are loaded into the DOM
function waitForElements() {
  const dropdown = document.getElementById("categoryDropdown");
  const loadMoreBtn = document.getElementById("loadMoreBtn");
  const badge = document.getElementById("badge");
  const containerClothing = document.getElementById("containerClothing");
  const containerAccessories = document.getElementById("containerAccessories");

  if (dropdown && loadMoreBtn && badge && containerClothing && containerAccessories) {
    initContent(); // Run main logic
  } else {
    setTimeout(waitForElements, 100); // Retry until loaded
  }
}

function initContent() {
  console.log(document.cookie);

  // Add event listeners after DOM elements are confirmed
  document.getElementById("categoryDropdown").addEventListener("change", function () {
    selectedCategory = this.value;
    currentIndex = 0;
    clearContainers();
    renderNextBatch();
  });

  document.getElementById("loadMoreBtn").addEventListener("click", renderNextBatch);

  // Fetch product data from backend
  let httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = function () {
    if (this.readyState === 4) {
      if (this.status === 200) {
        contentTitle = JSON.parse(this.responseText);

        // Set badge if cookie exists
        if (document.cookie.indexOf(",counter=") >= 0) {
          var counter = document.cookie.split(",")[1].split("=")[1];
          document.getElementById("badge").innerHTML = counter;
        }

        populateCategories();
        renderNextBatch();
      } else {
        console.log("call failed!");
      }
    }
  };

  httpRequest.open(
    "GET",
    "https://6856d9ca1789e182b37f3392.mockapi.io/productsapi/products",
    true
  );
  httpRequest.send();
}

// Dynamically create a product box element
function dynamicClothingSection(ob) {
  let boxDiv = document.createElement("div");
  boxDiv.id = "box";

  let boxLink = document.createElement("a");
  boxLink.href = "/contentDetails.html?" + ob.id;

  let imgTag = document.createElement("img");
  imgTag.src = ob.preview;

  let detailsDiv = document.createElement("div");
  detailsDiv.id = "details";

  let h3 = document.createElement("h3");
  h3.textContent = ob.name;

  let h4 = document.createElement("h4");
  h4.textContent = ob.brand;

  let h2 = document.createElement("h2");
  h2.textContent = "rs " + ob.price;

  boxDiv.appendChild(boxLink);
  boxLink.appendChild(imgTag);
  boxLink.appendChild(detailsDiv);
  detailsDiv.appendChild(h3);
  detailsDiv.appendChild(h4);
  detailsDiv.appendChild(h2);

  return boxDiv;
}

// Clear product containers
function clearContainers() {
  document.getElementById("containerClothing").innerHTML = "";
  document.getElementById("containerAccessories").innerHTML = "";
}

// Render the next batch of products
function renderNextBatch() {
  const filtered = selectedCategory === "all"
    ? contentTitle
    : contentTitle.filter(item =>
        item.category.toLowerCase().includes(selectedCategory.toLowerCase())
      );

  const end = currentIndex + itemsPerPage;
  const slice = filtered.slice(currentIndex, end);

  slice.forEach(item => {
    const element = dynamicClothingSection(item);
    if (item.isAccessory) {
      document.getElementById("containerAccessories").appendChild(element);
    } else {
      document.getElementById("containerClothing").appendChild(element);
    }
  });

  currentIndex = end;

  const loadMoreBtn = document.getElementById("loadMoreBtn");
  loadMoreBtn.style.display = currentIndex >= filtered.length ? "none" : "block";
}

// Fill the category dropdown with unique values
function populateCategories() {
  const dropdown = document.getElementById("categoryDropdown");
  const categories = [...new Set(contentTitle.map(item => item.category.toLowerCase()))];
  categories.unshift("all");

  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    dropdown.appendChild(option);
  });
}

// Start checking once DOM is ready
document.addEventListener("DOMContentLoaded", waitForElements);
