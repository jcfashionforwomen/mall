let contentTitle = [];
let currentIndex = 0;
const itemsPerPage = 10;
let selectedCategory = "all";

console.log(document.cookie);

// Helper: Create a product card
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
  h2.textContent = "Rs " + ob.price;

  detailsDiv.append(h3, h4, h2);
  boxLink.append(imgTag, detailsDiv);
  boxDiv.appendChild(boxLink);

  return boxDiv;
}

// Containers
let containerClothing = document.getElementById("containerClothing");
let containerAccessories = document.getElementById("containerAccessories");

// Clear containers before re-render
function clearContainers() {
  containerClothing.innerHTML = "";
  containerAccessories.innerHTML = "";
}

// Load next batch of items
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
      containerAccessories.appendChild(element);
    } else {
      containerClothing.appendChild(element);
    }
  });

  currentIndex = end;

  const loadMoreBtn = document.getElementById("loadMoreBtn");
  loadMoreBtn.style.display = currentIndex >= filtered.length ? "none" : "block";
}

// Populate category dropdown
function populateCategories() {
  const dropdown = document.getElementById("categoryDropdown");
  dropdown.innerHTML = ""; // Clear existing options

  const categories = [...new Set(contentTitle.map(item => item.category.toLowerCase()))];
  categories.unshift("all");

  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    dropdown.appendChild(option);
  });
}

// Parse cookie string to get value by key
function getCookieValue(key) {
  const cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    const [k, v] = cookie.trim().split("=");
    if (k === key) return v;
  }
  return null;
}

// Event Listeners
document.getElementById("categoryDropdown").addEventListener("change", function () {
  selectedCategory = this.value;
  currentIndex = 0;
  clearContainers();
  renderNextBatch();
});

document.getElementById("loadMoreBtn").addEventListener("click", renderNextBatch);

// Fetch data from API
const httpRequest = new XMLHttpRequest();
httpRequest.onreadystatechange = function () {
  if (this.readyState === 4) {
    if (this.status === 200) {
      try {
        contentTitle = JSON.parse(this.responseText);

        const counter = getCookieValue("counter");
        if (counter) {
          document.getElementById("badge").textContent = counter;
        }

        populateCategories();
        renderNextBatch();
      } catch (e) {
        console.error("JSON parse error", e);
      }
    } else {
      console.error("API call failed with status:", this.status);
    }
  }
};

httpRequest.open(
  "GET",
  "https://6856d9ca1789e182b37f3392.mockapi.io/productsapi/products",
  true
);
httpRequest.send();

