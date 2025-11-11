const box = document.querySelector(".box");
const form = document.querySelector(".form");
const inputs = document.querySelectorAll(".inputs");
const addbtn = document.getElementById("addbtn");

const url = "http://localhost:3600/todos";

const render = (data) => {
  box.innerHTML = data.map(item => `
    <div class="item">
      <h2>${item.title}</h2>
      <p>${item.description}</p>
      <button class="editBtn" data-id="${item.id}">edit</button>
      <button class="deleteBtn" data-id="${item.id}">delete</button>
    </div>
  `).join("");

  // DELETE
  document.querySelectorAll(".deleteBtn").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      try {
        await fetch(`${url}/${id}`, { method: "DELETE" });
        getData();
      } catch (err) {
        console.log("Delete xato:", err);
      }
    });
  });

  // EDIT
  document.querySelectorAll(".editBtn").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      try {
        const res = await fetch(`${url}/${id}`);
        const item = await res.json();

        const newTitle = prompt("New Title", item.title);
        const newDesc = prompt("New Description", item.description);

        if (newTitle !== null && newDesc !== null) {
          await fetch(`${url}/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: newTitle, description: newDesc })
          });
          getData();
        }
      } catch (err) {
        console.log("Edit xato:", err);
      }
    });
  });
};

// GET
const getData = async () => {
  try {
    const res = await fetch(url);
    const data = await res.json();
    render(data);
  } catch (err) {
    console.log("Get xato:", err);
  }
};
getData();

// ADD
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const obj = {};
  inputs.forEach(input => obj[input.name] = input.value);

  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(obj)
    });
    inputs.forEach(input => input.value = "");
    getData();
  } catch (err) {
    console.log("Add xato:", err);
  }
});
