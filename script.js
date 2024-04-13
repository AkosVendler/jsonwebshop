async function hozzáad(cucc) {
  let db = Number(prompt("Hány darabot szeretne vásárolni?"));

  if (isNaN(db) || db === 0) {
    alert("Hiba, kérlek próbáld újra!");
  } else {
    localStorage.setItem(cucc, db);
    await kos(); // Kosár frissítése hozzáadás után
  }
}

async function kos() {
  try {
    const response = await fetch("http://localhost:3000/products");
    const products = await response.json();

    let list =
      '<tr><th class="tabla-headerr">Termék </th><th class="tabla-headerr">Mennyiség </th><th class="tabla-headerr">Ár </th></tr>\n';
    let ossz = 0;

    for (let i = 0; i < localStorage.length; i++) {
      let key = localStorage.key(i);
      let menny = Number(localStorage.getItem(key));
      let product = products.find((item) => item.productname === key);

      if (product) {
        list += `<tr class=\"tabla-var\">
                              <td class=\"tabla-var\">${
                                product.productname
                              }</td>
                              <td class="tabla-var">
                              <button class="remove-button" id="gombb" onclick="ModifyItem('${key}', prompt('Írjon be egy összeget'), ${menny})">${menny}</button>
                              </td>
                              <td class=\"tabla-var\">${
                                product.price * menny
                              } Ft</td>
                              <td><button class=\"tabla-button\" onclick='töröl(\"${
                                product.productname
                              }\")'>X</button></td>
                          </tr>`;
        ossz += product.price * menny;
      }
    }
    sessionStorage.setItem("osszesen", ossz);
    list += `<tr> <th>Fizetendő </th> <th> </th> <th>${ossz} Ft</th></tr>`;
    document.getElementById("tabla").innerHTML = list;
  } catch (error) {
    console.error("Hiba történt:", error);
  }
}

async function ModifyItem(key, darab) {
  try {
    localStorage.setItem(key, Number(darab));
    await kos(); // Kosár frissítése módosítás után
  } catch (error) {
    console.error("Hiba történt:", error);
  }
}

async function töröl(key) {
  try {
    localStorage.removeItem(key);
    await kos(); // Kosár frissítése törlés után
  } catch (error) {
    console.error("Hiba történt:", error);
  }
}

function termekek() {
  try {
    let dbszam = 0;

    for (let i = 0; i < localStorage.length; i++) {
      let key = localStorage.key(i);
      dbszam += Number(localStorage.getItem(key));
    }
    document.getElementById("darabszam").innerHTML = dbszam;
  } catch (error) {
    console.error("Hiba történt:", error);
  }
}

async function torles() {
  try {
    localStorage.clear();
    await kos(); // Kosár frissítése törlés után
  } catch (error) {
    console.error("Hiba történt:", error);
  }
}
