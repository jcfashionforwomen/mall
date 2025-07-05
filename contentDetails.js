console.clear();

const id = location.search.split('?')[1];
console.log("Product ID:", id);

// ✅ Safely get cookie value by name
function getCookieValue(name) {
  const cookies = document.cookie.split("; ");
  for (const cookie of cookies) {
    const [key, value] = cookie.split("=");
    if (key === name) return value;
  }
  return null;
}

// ✅ Update badge from cookie
const counter = getCookieValue("counter");
if (counter) {
  document.getElementById("badge").innerHTML = counter;
}

// ✅ Convert boolean size array to labels
function getSizes(sizeArray) {
  const sizeLabels = ['S', 'M', 'L', 'XL', 'XXL'];
  return sizeArray
    .map((val, i) => val ? sizeLabels[i] : null)
    .filter(Boolean);
}

// ✅ Render dynamic content
function dynamicContentDetails(ob) {
  const mainContainer = document.createElement('div');
  mainContainer.id = 'containerD';
  document.getElementById('containerProduct').appendChild(mainContainer);

  const imageSectionDiv = document.createElement('div');
  imageSectionDiv.id = 'imageSection';

  const imgTag = document.createElement('img');
  imgTag.id = 'imgDetails';
  imgTag.src = ob.preview;
  imageSectionDiv.appendChild(imgTag);

  const productDetailsDiv = document.createElement('div');
  productDetailsDiv.id = 'productDetails';

  const h1 = document.createElement('h1');
  h1.textContent = ob.name;

  const h4 = document.createElement('h4');
  h4.textContent = ob.brand;

  const h5 = document.createElement('h5');
  const sizes = Array.isArray(ob.size) ? getSizes(ob.size).join(', ') : ob.size;
  h5.textContent = 'Available Sizes: ' + sizes;

  const detailsDiv = document.createElement('div');
  detailsDiv.id = 'details';

  const h3DetailsDiv = document.createElement('h3');
  h3DetailsDiv.textContent = 'Rs ' + ob.price;

  const h3 = document.createElement('h3');
  h3.textContent = 'Description';

  const para = document.createElement('p');
  para.textContent = ob.description;

  const productPreviewDiv = document.createElement('div');
  productPreviewDiv.id = 'productPreview';

  const h3ProductPreviewDiv = document.createElement('h3');
  h3ProductPreviewDiv.textContent = 'Product Preview';
  productPreviewDiv.appendChild(h3ProductPreviewDiv);

  ob.photos.forEach(photo => {
    const imgPreview = document.createElement('img');
    imgPreview.id = 'previewImg';
    imgPreview.src = photo;
    imgPreview.onclick = function () {
      imgTag.src = this.src;
    };
    productPreviewDiv.appendChild(imgPreview);
  });

  const buttonDiv = document.createElement('div');
  buttonDiv.id = 'button';

  // ✅ Message element
  const successMsg = document.createElement('p');
  successMsg.id = 'successMessage';
  successMsg.style.fontWeight = 'bold';
  successMsg.style.marginTop = '10px';

  // ✅ Add to Cart Button
  const addToCartBtn = document.createElement('button');
  addToCartBtn.textContent = 'Add to Cart';
  addToCartBtn.onclick = function () {
    if (!id) {
      console.error('Product ID is undefined');
      successMsg.textContent = "❌ Error adding item to cart!";
      successMsg.style.color = "red";
    } else {
      let order = id;
      let counter = 1;

      const existingItem = getCookieValue("item");
      const existingCounter = getCookieValue("counter");

      if (existingItem && existingCounter) {
        order = existingItem + " " + id;
        counter = parseInt(existingCounter) + 1;
      }

      document.cookie = `item=${order}; path=/`;
      document.cookie = `counter=${counter}; path=/`;
      document.getElementById("badge").innerHTML = counter;

      successMsg.textContent = "✅ Item added successfully!";
      successMsg.style.color = "green";
    }

    setTimeout(() => {
      successMsg.textContent = "";
    }, 3000);
  };
  buttonDiv.appendChild(addToCartBtn);

  // ✅ Meesho Button
  const meeshoBtn = document.createElement('button');
  meeshoBtn.textContent = 'Meesho';
  meeshoBtn.onclick = () => window.open(ob.meesho, '_blank');
  buttonDiv.appendChild(meeshoBtn);

  buttonDiv.appendChild(successMsg);

  // ✅ Assemble all parts
  mainContainer.appendChild(imageSectionDiv);
  mainContainer.appendChild(productDetailsDiv);
  productDetailsDiv.append(h1, h4, h5, detailsDiv, productPreviewDiv, buttonDiv);
  detailsDiv.append(h3DetailsDiv, h3, para);
}

// ✅ Fetch product data
const httpRequest = new XMLHttpRequest();
httpRequest.onreadystatechange = function () {
  if (this.readyState === 4) {
    if (this.status === 200) {
      const product = JSON.parse(this.responseText);
      console.log("Product fetched:", product);
      dynamicContentDetails(product);
    } else {
      console.error("Failed to fetch product details. Status:", this.status);
    }
  }
};

httpRequest.open('GET', `https://6856d9ca1789e182b37f3392.mockapi.io/productsapi/products/${id}`, true);
httpRequest.send();
