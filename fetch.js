/*
  Product

  Create
  Read
  Update
  Delete

  CRUD

*/
// Assuming you have input fields with ids "emailInput" and "passwordInput"

let form = document.querySelector("#form");

form.addEventListener("submit", ()=> {
    event.preventDefault();
    const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const email = emailInput.value;
const password = passwordInput.value;
console.log(email, password);

console.log("Email:", email);
console.log("Password:", password);

fetch("http://localhost:3000/members")
  .then((response) => response.json())
  .then((data) => {
    console.log("Data from server:", data);
    const user = data.find(member => member.email === email && member.password === password);
    console.log("User found:", user);
    if (!user) {
        alert("Hibás email vagy jelszó");
    } else if (user.role === 'admin') {
        window.open("http://localhost:3000/admin.html", "_self");
        console.log("admin");
    } else {
        window.open("http://localhost:3000/", "_self");
    }
  });

})


