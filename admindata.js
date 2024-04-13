let intervalId = setInterval(fetchDataAndRefreshAdminPage, 1000);

function fetchDataAndRefreshAdminPage() {
  Promise.all([
    fetch("http://localhost:3000/orders").then((response) => response.json()),
    fetch("http://localhost:3000/members").then((response) => response.json()),
    fetch("http://localhost:3000/products").then((response) => response.json()),
  ])
    .then(([ordersData, membersData, productsData]) => {
      // Orders számláló frissítése
      let ordersCountElement = document.querySelector(".ordercount");
      ordersCountElement.innerHTML = ordersData.length;

      // Members számláló frissítése
      let membersCountElement = document.querySelector(".membercount");
      membersCountElement.innerHTML = membersData.length - 1;

      // Teljes bevétel számolása és frissítése
      let totalPrice = ordersData.reduce((acc, item) => acc + item.total, 0);
      let totalIncomeElement = document.querySelector(".incomecount");
      totalIncomeElement.innerHTML = totalPrice;

      // Dynamikus kártyák létrehozása a productsData alapján
      let dashboardSection = document.getElementById("products");
      dashboardSection.innerHTML = ""; // Töröljük az előző kártyákat

      let shopsection = document.getElementById("products");
      shopsection.innerHTML = ""; // Töröljük az előző kártyákat

      productsData.forEach((product) => {
        let cardDiv = document.createElement("div");
        cardDiv.classList.add("card");
        cardDiv.style.width = "18rem";
        // Hozzáadjuk az id-t a value attribútumhoz

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
        linkElement.href = "#";
        linkElement.setAttribute("value", product.id);
        linkElement.textContent = "Szerkesztés";
        cardBodyDiv.appendChild(linkElement);

        let deleteElement = document.createElement("a");
        deleteElement.classList.add("btn", "btn-danger");
        deleteElement.setAttribute("value", product.id);
        deleteElement.href = "#";
        deleteElement.textContent = "Törlés";
        cardBodyDiv.appendChild(deleteElement);

        cardDiv.appendChild(cardBodyDiv);

        // Hozzáadjuk a kártyát a dashboard szekcióhoz
        dashboardSection.appendChild(cardDiv);
      });

      // Dinamikus modális ablakok generálása minden termékhez
      productsData.forEach((product) => {
        let modalHtml = `
          <div class="modal fade" id="exampleModal_${product.id}" tabindex="-1" aria-labelledby="exampleModalLabel_${product.id}" aria-hidden="true">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h1 class="modal-title fs-5" id="exampleModalLabel_${product.id}">Épp a ${product.id} elemet szerkeszted</h1>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                <div class="mb-3">
                <label for="exampleFormControlInput1" class="form-label">Termék neve</label>
                <input type="text" id="termeknev" class="form-control" placeholder="termekneve">
              </div>
              <div class="mb-3">
                <label for="exampleFormControlInput1" class="form-label">Termék ára</label>
                <input type="text" id="ar" class="form-control" placeholder="termék ára">
              </div>
              <div class="mb-3">
                <label for="exampleFormControlInput1" class="form-label">Termék leírása</label>
                <input type="text" id="desc" class="form-control" placeholder="Lorem ipsum...">
              </div>
              <div class="mb-3">
                <label for="exampleFormControlInput1" class="form-label">Termék képe(Url)</label>
                <input type="text" id="imgurl" class="form-control" placeholder="https://termekkepe">
              </div>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button type="button" class="btn save-edit btn-primary" value="${product.id}">Save changes</button>
                </div>
              </div>
            </div>
          </div>
        `;

        dashboardSection.insertAdjacentHTML("beforeend", modalHtml);
      });

      let deleteElements = document.querySelectorAll(".btn-danger");
      let editElements = document.querySelectorAll(".save-edit");
      deleteElements.forEach((deleteBtn) => {
        deleteBtn.addEventListener("click", function () {
          // Kilogoljuk az adott gombhoz tartozó termék azonosítóját
          let productId = this.getAttribute("value");
          console.log(productId);
          fetch(`http://localhost:3000/products/${productId}`, {
            method: "DELETE",
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error("Hiba történt a termék törlésekor.");
              }
              return response.json();
            })
            .then((data) => {
              console.log(data);
              alert(`sikeresen törölve lett a ${productId}`);
              fetchDataAndRefreshAdminPage();
            })
            .catch((error) => {
              console.error("Hiba történt a DELETE kérés során:", error);
            });
        });
      });
      editElements.forEach((editBtn) => {
        editBtn.addEventListener("click", function () {
          // Kilogoljuk az adott gombhoz tartozó termék azonosítóját
          let productId = this.getAttribute("value");
          console.log(productId);
          let nev = document.getElementById("termeknev").value;
          let ar = document.getElementById("ar").value;
          let leiras = document.getElementById("desc").value;
          let termekkep = document.getElementById("imgurl").value;
          fetch(`http://localhost:3000/products/${productId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              productname: nev,
              description: leiras,
              imageURL: termekkep,
              price: ar,
            }),
          });
        });
      });
    })
  };
  
  function addNewItem() {
    // create-card gomb eseményfigyelője
    let nev = document.getElementById("newtermeknev").value;
    let ar = document.getElementById("newar").value;
    let leiras = document.getElementById("newdesc").value;
    let termekkep = document.getElementById("newimgurl").value;
  fetch(`http://localhost:3000/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productname: nev,
        description: leiras,
        imageURL: termekkep,
        price: ar,
      }),
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Hiba történt a termék létrehozása során.");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      alert(`Sikeresen létrehozva: ${nev}`);
      // fetchDataAndRefreshAdminPage();
    })
    .catch((error) => {
      console.error("Hiba történt a POST kérés során:", error);
    });
    console.log(nev);
  }

//views

let analytics = document.getElementsByClassName("analytics");
let dashboard = document.getElementsByClassName("dashboard");

//sidenav

document.addEventListener("DOMContentLoaded", function (event) {
  const showNavbar = (toggleId, navId, bodyId, headerId) => {
    const toggle = document.getElementById(toggleId),
      nav = document.getElementById(navId),
      bodypd = document.getElementById(bodyId),
      headerpd = document.getElementById(headerId);

    // Validate that all variables exist
    if (toggle && nav && bodypd && headerpd) {
      toggle.addEventListener("click", () => {
        // show navbar
        nav.classList.toggle("show");
        // change icon
        toggle.classList.toggle("bx-x");
        // add padding to body
        bodypd.classList.toggle("body-pd");
        // add padding to header
        headerpd.classList.toggle("body-pd");
      });
    }
  };

  showNavbar("header-toggle", "nav-bar", "body-pd", "header");

  /*===== LINK ACTIVE =====*/
  const linkColor = document.querySelectorAll(".nav_link");

  function colorLink() {
    if (linkColor) {
      linkColor.forEach((l) => l.classList.remove("active"));
      this.classList.add("active");
    }
  }
  linkColor.forEach((l) => l.addEventListener("click", colorLink));
});

let navItems = document.querySelectorAll(".nav_link");

navItems.forEach((item) => {
  item.addEventListener("click", function () {
    let main = document.getElementById("main");
    let dashboard = document.getElementById("dashboard");
    let analytics = document.getElementById("analytics");
    if (this.getAttribute("value") == "main") {
      dashboard.style.display = "none";
      analytics.style.display = "none";
      main.style.display = "flex";
    } else if (this.getAttribute("value") == "dashboard") {
      dashboard.style.display = "block";
      analytics.style.display = "none";
      main.style.display = "none";
    } else {
      dashboard.style.display = "none";
      analytics.style.display = "block";
      main.style.display = "none";
    }
  });
});
