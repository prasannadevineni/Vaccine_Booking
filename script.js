const form = document.getElementById("bookingForm");
const bookingList = document.getElementById("bookingList");
const searchInput = document.getElementById("search");

let bookings = JSON.parse(localStorage.getItem("bookings")) || [];

function generateId() {
    return "VAC" + Math.floor(Math.random() * 100000);
}

function render(data = bookings) {
    bookingList.innerHTML = "";

    data.forEach((b, i) => {
        bookingList.innerHTML += `
        <tr>
            <td>${b.id}</td>
            <td>${b.name}</td>
            <td>${b.age}</td>
            <td>${b.idproof}</td>
            <td>${b.center}</td>
            <td>${b.date}</td>
            <td>${b.slot}</td>
            <td>${b.status}</td>
            <td>
                <button class="cert-btn" onclick="printCert(${i})">Download</button>
            </td>
            <td>
                <button class="status-btn" onclick="toggleStatus(${i})">Toggle</button>
                <button class="delete-btn" onclick="deleteBooking(${i})">Delete</button>
            </td>
        </tr>`;
    });
}

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const age = parseInt(document.getElementById("age").value);
    const idproof = document.getElementById("idproof").value;
    const center = document.getElementById("center").value;
    const date = document.getElementById("date").value;
    const slot = document.getElementById("slot").value;

    if (age < 18) {
        alert("Not eligible (Age must be 18+)");
        return;
    }

    if (!center || !slot) {
        alert("Please select center and slot");
        return;
    }

    const booking = {
        id: generateId(),
        name,
        age,
        idproof,
        center,
        date,
        slot,
        status: "Not Vaccinated"
    };

    bookings.push(booking);
    localStorage.setItem("bookings", JSON.stringify(bookings));

    form.reset();
    render();
});

function toggleStatus(i) {
    bookings[i].status =
        bookings[i].status === "Vaccinated"
            ? "Not Vaccinated"
            : "Vaccinated";

    localStorage.setItem("bookings", JSON.stringify(bookings));
    render();
}

function deleteBooking(i) {
    bookings.splice(i, 1);
    localStorage.setItem("bookings", JSON.stringify(bookings));
    render();
}

function clearAll() {
    if (confirm("Delete all records?")) {
        localStorage.clear();
        bookings = [];
        render();
    }
}

function printCert(i) {
    const b = bookings[i];

    const win = window.open("", "", "width=600,height=400");
    win.document.write(`
        <h2>VACCINATION CERTIFICATE</h2>
        <p><b>Name:</b> ${b.name}</p>
        <p><b>Age:</b> ${b.age}</p>
        <p><b>Center:</b> ${b.center}</p>
        <p><b>Date:</b> ${b.date}</p>
        <p><b>Status:</b> ${b.status}</p>
        <br><p>✔ Government Approved</p>
    `);

    win.print();
}

searchInput.addEventListener("input", () => {
    const value = searchInput.value.toLowerCase();

    const filtered = bookings.filter(b =>
        b.name.toLowerCase().includes(value)
    );

    render(filtered);
});

render();
