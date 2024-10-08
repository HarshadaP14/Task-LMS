

const API_URL = "http://localhost:3000/api";

// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', function() {

    // Login functionality
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const username = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;
            
            try {
                const response = await fetch(`${API_URL}/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, password }),
                });
                
                if (!response.ok) {
                    throw new Error('Login failed');
                }
                
                const data = await response.json();
                console.log("data is....",data)
                localStorage.setItem('token', data.token);
                localStorage.setItem('userRole', data.user.role);
                localStorage.setItem('userId', data.user.id); 
                console.log(localStorage.getItem('userId'));

                // Redirect based on user role
                if (data.user.role === 'LIBRARIAN') {
                    window.location.href = 'librarian-dashboard.html';
                } else {
                    window.location.href = 'member-dashboard.html';
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Login failed. Please try again.');
            }
            
        });
    } else {
        console.error('Login form not found');
    }

// signup form
const signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const username = document.getElementById('signupUsername').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const full_name = document.getElementById('signupFullName').value;
        const role = document.getElementById('signupRole').value;

        try {
            const response = await fetch(`${API_URL}/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password, full_name, role }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Signup failed');
            }

            const data = await response.json();
            alert('Signup successful! Please log in.');
            window.location.href = 'index.html'; // Redirect to login page after signup
        } catch (error) {
            console.error('Error:', error);
            alert('Signup failed: ' + error.message);
        }
    });
}


    // Fetch available books when the dashboard loads
    const booksListDiv = document.getElementById('booksList');
    if (booksListDiv) {
        fetchAvailableBooks();
    }

    // Add Book functionality
    const addBookForm = document.getElementById('addBookForm');
    if (addBookForm) {
        addBookForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const title = document.getElementById('bookTitle').value;
            const author = document.getElementById('bookAuthor').value;
            const token = localStorage.getItem('token'); // Ensure you retrieve the token

            try {
                const response = await fetch(`${API_URL}/books`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({ title, author }),
                });

                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

                const data = await response.json();
                alert(data.message);
                fetchAvailableBooks(); // Refresh the book list after adding
                addBookForm.reset();
            } catch (error) {
                console.error('Error adding book:', error);
                alert('Failed to add book: ' + error.message);
            }
        });
    }

    // Update Book functionality
    const updateBookForm = document.getElementById('updateBookForm');
    if (updateBookForm) {
        updateBookForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const id = document.getElementById("updateBookId").value;
            const title = document.getElementById("updateBookTitle").value;
            const author = document.getElementById("updateBookAuthor").value;
            const token = localStorage.getItem('token'); // Ensure you retrieve the token

            try {
                const response = await fetch(`${API_URL}/books/${id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ title, author }),
                });

                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

                const data = await response.json();
                document.getElementById("updateBookMessage").textContent = data.message; // Show success message
                updateBookForm.reset();
                console.log('Add book form reset executed');
                fetchAvailableBooks(); // Refresh the book list after updating
            } catch (error) {
                console.error("Error updating book:", error);
                alert("Failed to update book: " + error.message);
            }
        });
    }

    // Delete Book functionality
    const deleteBookForm = document.getElementById('deleteBookForm');
    if (deleteBookForm) {
        deleteBookForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const id = document.getElementById("deleteBookId").value;
            const token = localStorage.getItem('token'); // Ensure you retrieve the token

            try {
                const response = await fetch(`${API_URL}/books/${id}`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

                const data = await response.json();
                alert(data.message);
                fetchAvailableBooks(); // Refresh the book list after deletion
            } catch (error) {
                console.error("Error deleting book:", error);
                alert("Failed to delete book: " + error.message);
            }
        });
    }

    // Delete Member functionality
    const deleteMemberForm = document.getElementById("deleteMemberForm");
    if (deleteMemberForm) {
        deleteMemberForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const id = document.getElementById("deleteMemberId").value;
            const token = localStorage.getItem('token'); // Ensure you retrieve the token

            try {
                const response = await fetch(`${API_URL}/users/${id}`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

                const data = await response.json();
                alert(data.message);
            } catch (error) {
                console.error("Error deleting member:", error);
                alert("Failed to delete member: " + error.message);
            }
        });
    }
});

// Function to fetch available books
async function fetchAvailableBooks() {
    try {
        const token = localStorage.getItem('token'); // Retrieve the token
        const response = await fetch(`${API_URL}/books`, { // Corrected fetch call
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Include the token
            },
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const books = await response.json();
        const booksListDiv = document.getElementById('booksList');
        if (booksListDiv) {
            booksListDiv.innerHTML = '';

            books.forEach(book => {
                const bookItem = document.createElement('div');
                bookItem.textContent = `${book.id}: ${book.title} by ${book.author} (Status: ${book.status})`;
                booksListDiv.appendChild(bookItem);
            });
        } else {
            console.error("booksList element not found");
        }
    } catch (error) {
        console.error('Error fetching books:', error);
        alert('Failed to fetch books: ' + error.message);
    }
}
