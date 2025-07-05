console.clear();

// ✅ Get product ID from URL
const id = new URLSearchParams(location.search).toString();
const productId = id || location.search.slice(1); // Fallback
console.log("Product ID:", productId);

// ✅ Safely get cookie value by name
function getCookieValue(name) {
  const cookies = document.cookie.split("; ");
  for (const cookie of cookies) {
    const [key, value] = cookie.split("=");
    if (key === name) return value;
  }
  return null;
}

// ✅ Update badge count
const counter = getCookieValue("counter");
if (counter && document.getElementById("badge")) {
  document.getElementById("badge").textContent = counter;
}

// ✅ Convert boolean size array to readable sizes
function getSizes(sizeArray) {
  const sizeLabels = ["S", "M", "L", "XL", "XXL"];
  return sizeArray
    .map((val, i) => val ? sizeLabels[i] : null)
    .filter(Boolean)
    .join(", ");
}

// ✅ Render dynamic product detail
function dynamicContentDetails(ob) {
  const container = document.getElementById("containerProduct");

  const mainContainer = document.createElement("div");
  mainContainer.id = "containerD";

  // Image Section
  const imageSection = document.createElement("div");
  imageSection.id = "imageSection";

  const mainImg = document.createElement("img");
  mainImg.id = "imgDetails";
  mainImg.src = ob.preview;
  imageSection.appendChild(mainImg);

  // Details Section
  const productDetails = document.createElement("div");
  productDetails.id = "productDetails";

  const name = document.createElement("h1");
  name.textContent = ob.name;

  const brand = document.createElement("h4");
  brand.textContent = ob.brand;

  const size = document.createElement("h5");
  size.textContent = "Available Sizes: " + (Array.isArray(ob.size) ? getSizes(ob.size) : ob.size);

  const detailsBox = document.createElement("div");
  detailsBox.id = "details";

  const price = document.createElement("h3");
  price.textContent = "Rs " + ob.price;

  const descTitle = document.createElement("h3");
  descTitle.textContent = "Description";

  const description = document.createElement("p");
  description.textContent = ob.description;

  detailsBox.append(price, descTitle, description);

  // Preview Images
  const previewBox = document.createElement("div");
  previewBox.id = "productPreview";

  const previewTitle = document.createElement("h3");
  previewTitle.textContent = "Product Preview";
  previewBox.appendChild(previewTitle);

  ob.photos.forEach(photo => {
    const thumb = document.createElement("img");
    thumb.id = "previewImg";
    thumb.src = photo;
    thumb.onclick = () => {
      mainImg.src = photo;
    };
    previewBox.appendChild(thumb);
  });

  // Buttons
  const buttonBox = document.createElement("div");
  buttonBox.id = "button";

  const successMsg = document.createElement("p");
  successMsg.id = "successMessage";
  successMsg.style.fontWeight = "bold";
  successMsg.style.marginTop = "10px";

  const cartBtn = document.createElement("button");
  cartBtn.textContent = "Add to Cart";
  cartBtn.onclick = () => {
    if (!productId) {
      console.error("Invalid product ID");
      successMsg.textContent = "❌ Error adding item to cart!";
      successMsg.style.color = "red";
    } else {
      let order = productId;
      let count = 1;

      const existingItem = getCookieValue("item");
      const existingCounter = getCookieValue("counter");

      if (existingItem && existingCounter) {
        order = existingItem + " " + productId;
        count = parseInt(existingCounter) + 1;
      }

      document.cookie = `item=${order}; path=/`;
      document.cookie = `counter=${count}; path=/`;

      const badge = document.getElementById("badge");
      if (badge) badge.textContent = count;

      successMsg.textContent = "✅ Item added successfully!";
      successMsg.style.color = "green";
    }

    setTimeout(() => {
      successMsg.textContent = "";
    }, 3000);
  };

  const meeshoBtn = document.createElement("button");
  meeshoBtn.textContent = "Meesho";
  meeshoBtn.onclick = () => window.open(ob.meesho, "_blank");

  buttonBox.append(cartBtn, meeshoBtn, successMsg);

  // Final assembly
  productDetails.append(name, brand, size, detailsBox, previewBox, buttonBox);
  mainContainer.append(imageSection, productDetails);
  container.appendChild(mainContainer);
}

// ✅ Fetch product data
const httpRequest = new XMLHttpRequest();
httpRequest.onreadystatechange = function () {
  if (this.readyState === 4) {
    if (this.status === 200) {
      try {
        const product = JSON.parse(this.responseText);
        console.log("Product fetched:", product);
        dynamicContentDetails(product);
      } catch (e) {
        console.error("JSON parse error", e);
      }
    } else {
      console.error("Failed to fetch product. Status:", this.status);
    }
  }
};

httpRequest.open("GET", `https://6856d9ca1789e182b37f3392.mockapi.io/productsapi/products/${productId}`, true);
httpRequest.send();
