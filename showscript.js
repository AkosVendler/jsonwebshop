fetch("http://localhost:3000/products")
  .then((response) => response.json()) 
  .then((data) => {
    let shopsection = document.getElementById("products"); // DOM elem definiálása

    data.forEach((product) => {
      let cardDiv = document.createElement("div");
      cardDiv.classList.add("card");
      cardDiv.style.width = "18rem";
      
      // Kép létrehozása (ha van kép URL a termékben)
      if (product.imageURL) {
        let imgElement = document.createElement("img");
        imgElement.classList.add("card-img-top","img-fluid");
        imgElement.src = product.imageURL;
        imgElement.alt = product.productname;
        cardDiv.appendChild(imgElement);
      }

      let cardBodyDiv = document.createElement("div");
      cardBodyDiv.classList.add("card-body");

      let titleElement = document.createElement("h5");
      titleElement.classList.add("card-title");
      titleElement.textContent = product.productname;
      cardBodyDiv.appendChild(titleElement);

      let descriptionElement = document.createElement("p");
      descriptionElement.classList.add("card-text");
      descriptionElement.textContent = product.description;
      cardBodyDiv.appendChild(descriptionElement);

      let priceElement = document.createElement("h6");
      priceElement.classList.add("card-text");
      priceElement.textContent = `Ár: ${product.price}`;
      cardBodyDiv.appendChild(priceElement);

      let linkElement = document.createElement("a");
      linkElement.classList.add("btn", "btn-primary", "me-2");
      linkElement.setAttribute("data-bs-toggle", "modal");
      linkElement.setAttribute(
        "data-bs-target",
        `#exampleModal_${product.id}`
      );
      linkElement.setAttribute("value", product.id);
      linkElement.setAttribute("onclick", `hozzáad('${product.productname}')`);
      linkElement.textContent = "Kosárba";
      cardBodyDiv.appendChild(linkElement);

      cardDiv.appendChild(cardBodyDiv);

      // Hozzáadjuk a kártyát a dashboard szekcióhoz
      shopsection.appendChild(cardDiv);
    });
});
