
const API_URL = "http://localhost:3000/api";

// Logout Functionality
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "index.html";
});

// Function to check if token exists
function checkToken() {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Please log in first");
    window.location.href = "index.html";
    return false;
  }
  return token;
}

// Fetch and display books
async function fetchBooks() {
  const token = checkToken();
  if (!token) return;

  try {
    const response = await fetch(`${API_URL}/books`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const books = await response.json();
    displayBooks(books);
  } catch (error) {
    console.error("Error fetching books:", error);
    alert("Failed to fetch books");
  }
}

// Display books in the table
function displayBooks(books) {
  const tableBody = document.querySelector("#booksTable tbody");
  tableBody.innerHTML = "";

  books.forEach((book) => {
    const row = tableBody.insertRow();
    row.innerHTML = `
            <td>${book.id}</td>
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.status}</td>
            <td>
                <button onclick="prepareUpdateBook(${book.id}, '${book.title}', '${book.author}')" class="btn btn-warning btn-sm">Update</button>
                <button onclick="deleteBook(${book.id})" class="btn btn-danger btn-sm">Delete</button>
            </td>
        `;
  });
}

// Add Book Functionality
document.getElementById("addBookForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const token = checkToken();
  if (!token) return;

  const title = document.getElementById("bookTitle").value;
  const author = document.getElementById("bookAuthor").value;

  try {
    const response = await fetch(`${API_URL}/books`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, author }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    alert(data.message);
    fetchBooks();
    document.getElementById("addBookForm").reset();
  } catch (error) {
    console.error("Error adding book:", error);
    alert("Failed to add book: " + error.message);
  }
});

// Prepare Update Book Form
function prepareUpdateBook(id, title, author) {
  document.getElementById("updateBookId").value = id;
  document.getElementById("updateBookTitle").value = title;
  document.getElementById("updateBookAuthor").value = author;
}

// Update Book Functionality
document
  .getElementById("updateBookForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const token = checkToken();

    if (!token) return;

    const id = document.getElementById("updateBookId").value;
    const title = document.getElementById("updateBookTitle").value;
    const author = document.getElementById("updateBookAuthor").value;

    try {
      const response = await fetch(`${API_URL}/books/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, author }),
      });
      const data = await response.json();
      alert(data.message);
      fetchBooks();
      document.getElementById("updateBookForm").reset();
    } catch (error) {
      console.error("Error updating book:", error);
      alert("Failed to update book");
    }
  });

// Delete Book Functionality
async function deleteBook(id) {
  const token = checkToken();
  if (!token) return;

  if (confirm("Are you sure you want to delete this book?")) {
    try {
      const response = await fetch(`${API_URL}/books/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      alert(data.message);
      fetchBooks();
    } catch (error) {
      console.error("Error deleting book:", error);
      alert("Failed to delete book");
    }
  }
}

// Delete Member Functionality
document
  .getElementById("deleteMemberForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const token = checkToken();
    if (!token) return;

    const id = document.getElementById("deleteMemberId").value;
    try {
      const response = await fetch(`${API_URL}/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      alert(data.message);
      document.getElementById("deleteMemberForm").reset();
    } catch (error) {
      console.error("Error deleting member:", error);
      alert("Failed to delete member");
    }
  });

// Fetch books when the page loads
window.onload = fetchBooks;
