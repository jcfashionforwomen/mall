let contentTitle = [];
let currentIndex = 0;
const itemsPerPage = 10;
let selectedCategory = "all";

// Console cookie for debugging
console.log(document.cookie);

// 🔧 Get cookie value by name
function getCookieValue(key) {
  const cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    const [k, v] = cookie.trim().split("=");
    if (k === key) return v;
  }
  return null;
}

// ✅ Create individual product card
function dynamicClothingSection(ob) {
  const boxDiv = document.createElement("div");
  boxDiv.id = "box";

  const boxLink = document.createElement("a");
  boxLink.href = "contentDetails.html?" + ob.id; // relative link (avoid `/` if using GitHub Pages)

  const imgTag = document.createElement("img");
  imgTag.src = ob.preview;

  const detailsDiv = document.createElement("div");
  detailsDiv.id = "details";

  const h3 = document.createElement("h3");
  h3.textContent = ob.name;

  const h4 = document.createElement("h4");
  h4.textContent = ob.brand;

  const h2 = document.createElement("h2");
  h2.textContent = "Rs " + ob.price;

  detailsDiv.append(h3, h4, h2);
  boxLink.append(imgTag, detailsDiv);
  boxDiv.appendChild(boxLink);

  return boxDiv;
}

// DOM references
const containerClothing = document.getElementById("containerClothing");
const containerAccessories = document.getElementById("containerAccessories");
const loadMoreBtn = document.getElementById("loadMoreBtn");

// 🔄 Clear product lists
function clearContainers() {
  containerClothing.innerHTML = "";
  containerAccessories.innerHTML = "";
}

// ➕ Render next set of items
function renderNextBatch() {
  const filtered = selectedCategory === "all"
    ? contentTitle
    : contentTitle.filter(item =>
        item.category.toLowerCase().includes(selectedCategory.toLowerCase())
      );

  const end = currentIndex + itemsPerPage;
  const slice = filtered.slice(currentIndex, end);

  slice.forEach(item => {
    const card = dynamicClothingSection(item);
    if (item.isAccessory) {
      containerAccessories.appendChild(card);
    } else {
      containerClothing.appendChild(card);
    }
  });

  currentIndex = end;
  loadMoreBtn.style.display = currentIndex >= filtered.length ? "none" : "block";
}

// 📂 Fill category dropdown
function populateCategories() {
  const dropdown = document.getElementById("categoryDropdown");
  dropdown.innerHTML = "";

  const categories = [...new Set(contentTitle.map(item => item.category.toLowerCase()))];
  categories.unshift("all");

  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    dropdown.appendChild(option);
  });
}

// 📦 Event: Category changed
document.getElementById("categoryDropdown").addEventListener("change", function () {
  selectedCategory = this.value;
  currentIndex = 0;
  clearContainers();
  renderNextBatch();
});

// 📦 Event: Load More button
loadMoreBtn.addEventListener("click", renderNextBatch);

// 🌐 Fetch from API
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
      } catch (err) {
        console.error("❌ JSON Parse Error:", err);
      }
    } else {
      console.error("❌ API Request Failed - Status:", this.status);
    }
  }
};

httpRequest.open(
  "GET",
  "https://6856d9ca1789e182b37f3392.mockapi.io/productsapi/products",
  true
);
httpRequest.send();
