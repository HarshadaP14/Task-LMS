const API_URL = "http://localhost:3000/api";

function showLoading(message) {
  const loadingDiv = document.createElement("div");
  loadingDiv.textContent = message;
  loadingDiv.className = "loading";
  document.body.appendChild(loadingDiv);
}

function hideLoading() {
  const loadingDiv = document.querySelector(".loading");
  if (loadingDiv) {
    loadingDiv.remove();
  }
}

async function fetchAvailableBooks() {
  showLoading("Fetching available books...");
  try {
    const response = await fetch(`${API_URL}/books`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const books = await response.json();
    const booksListDiv = document.getElementById("booksList");
    booksListDiv.innerHTML = "";

    books.forEach((book) => {
      const bookItem = document.createElement("div");
      bookItem.textContent = `${book.id}: ${book.title} by ${book.author} (Status: ${book.status})`;
      booksListDiv.appendChild(bookItem);
    });
  } catch (error) {
    console.error("Error fetching books:", error);
  } finally {
    hideLoading();
  }
}

async function borrowBook(event) {
  event.preventDefault();
  const bookId = document.getElementById("bookId").value;
  const userId = 4; // Assuming this is the correct user ID

  try {
    const response = await fetch(`${API_URL}/borrow`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ bookId, userId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to borrow book");
    }

    const data = await response.json();
    console.log("Book borrowed successfully:", data);
    // Handle successful borrow
  } catch (error) {
    console.error("Error borrowing book:", error.message);
    // Display error to user
  }
}

async function returnBook(event) {
  event.preventDefault();
  const bookId = document.getElementById("returnBookId").value;
  const userId = localStorage.getItem("userId");

  if (!userId) {
    alert("User ID not found. Please log in again.");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/return`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ userId, bookId }),
    });

    const result = await response.json();
    alert(result.message);
    fetchAvailableBooks(); // Refresh the book list
  } catch (error) {
    console.error("Error returning book:", error);
    alert("Failed to return book: " + error.message);
  }
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", () => {
  const borrowBookForm = document.getElementById("borrowBookForm");
  const returnBookForm = document.getElementById("returnBookForm");
  const logoutBtn = document.getElementById("logoutBtn");

  borrowBookForm.addEventListener("submit", borrowBook);
  returnBookForm.addEventListener("submit", returnBook);
  logoutBtn.addEventListener("click", logout);

  fetchAvailableBooks();
});
