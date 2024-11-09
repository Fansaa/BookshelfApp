document.addEventListener("DOMContentLoaded", () => {
    const bookForm = document.getElementById("bookForm");
    const incompleteBookList = document.getElementById("incompleteBookList");
    const completeBookList = document.getElementById("completeBookList");
    const searchForm = document.getElementById("searchBook");
    const searchTitleInput = document.getElementById("searchBookTitle");

    // Fungsi untuk mengambil buku dari localStorage
    function getBooks() {
        return JSON.parse(localStorage.getItem("books")) || [];
    }

    // Fungsi untuk menyimpan buku ke localStorage
    function saveBooks(books) {
        localStorage.setItem("books", JSON.stringify(books));
    }

    // Fungsi untuk menambahkan buku
    function addBook(book) {
        const books = getBooks();
        books.push(book);
        saveBooks(books);
        renderBooks();
    }

    // Fungsi untuk merender buku di rak
    function renderBooks() {
        incompleteBookList.innerHTML = "";
        completeBookList.innerHTML = "";
        
        getBooks().forEach(book => {
            const bookElement = document.createElement("div");
            bookElement.setAttribute("data-bookid", book.id);
            bookElement.setAttribute("data-testid", "bookItem");
            bookElement.innerHTML = `
                <h3 data-testid="bookItemTitle">${book.title}</h3>
                <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
                <p data-testid="bookItemYear">Tahun: ${book.year}</p>
                <div>
                    <button data-testid="bookItemIsCompleteButton">${book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca"}</button>
                    <button data-testid="bookItemDeleteButton">Hapus buku</button>
                </div>
            `;

            bookElement.querySelector("[data-testid='bookItemIsCompleteButton']").addEventListener("click", () => toggleBookStatus(book.id));
            bookElement.querySelector("[data-testid='bookItemDeleteButton']").addEventListener("click", () => deleteBook(book.id));

            if (book.isComplete) {
                completeBookList.appendChild(bookElement);
            } else {
                incompleteBookList.appendChild(bookElement);
            }
        });
    }

    // Fungsi untuk mengubah status baca buku
    function toggleBookStatus(bookId) {
        const books = getBooks();
        const book = books.find(book => book.id === bookId);
        if (book) {
            book.isComplete = !book.isComplete;
            saveBooks(books);
            renderBooks();
        }
    }

    // Fungsi untuk menghapus buku
    function deleteBook(bookId) {
        let books = getBooks();
        books = books.filter(book => book.id !== bookId);
        saveBooks(books);
        renderBooks();
    }

    // Event listener untuk menambahkan buku baru dari form
    bookForm.addEventListener("submit", (event) => {
        event.preventDefault();
        
        const title = document.getElementById("bookFormTitle").value;
        const author = document.getElementById("bookFormAuthor").value;
        const year = parseInt(document.getElementById("bookFormYear").value);
        const isComplete = document.getElementById("bookFormIsComplete").checked;
        
        const newBook = {
            id: new Date().getTime().toString(),
            title,
            author,
            year,
            isComplete
        };
        
        addBook(newBook);
        bookForm.reset();
    });

    // Fungsi untuk mencari buku berdasarkan judul
    function searchBooks(title) {
    const books = getBooks();
    return books.filter(book => book.title.toLowerCase().includes(title.toLowerCase()));
    }

    // Event listener untuk pencarian buku
    searchForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const title = searchTitleInput.value;
        renderBooks(searchBooks(title));
    });

    // Fungsi untuk mengedit buku
function editBook(bookId) {
    const books = getBooks();
    const book = books.find(b => b.id === bookId);
    if (book) {
        document.getElementById("bookFormTitle").value = book.title;
        document.getElementById("bookFormAuthor").value = book.author;
        document.getElementById("bookFormYear").value = book.year;
        document.getElementById("bookFormIsComplete").checked = book.isComplete;

        // Update form submission to save changes
        bookForm.onsubmit = (event) => {
            event.preventDefault();
            book.title = document.getElementById("bookFormTitle").value;
            book.author = document.getElementById("bookFormAuthor").value;
            book.year = parseInt(document.getElementById("bookFormYear").value);
            book.isComplete = document.getElementById("bookFormIsComplete").checked;
            saveBooks(books);
            renderBooks();
            bookForm.reset();
            bookForm.onsubmit = addNewBook;
        };
    }
}

// Fungsi tambahan untuk submit form baru
function addNewBook(event) {
    event.preventDefault();
    
    const title = document.getElementById("bookFormTitle").value.trim();
    const author = document.getElementById("bookFormAuthor").value.trim();
    const year = parseInt(document.getElementById("bookFormYear").value);
    const isComplete = document.getElementById("bookFormIsComplete").checked;

    // Validasi input sebelum menambahkan buku
    if (title === "" || author === "" || isNaN(year)) {
        alert("Mohon lengkapi semua field dengan benar.");
        return;
    }

    const newBook = {
        id: new Date().getTime().toString(),
        title,
        author,
        year,
        isComplete
    };

    addBook(newBook);
    bookForm.reset();
}


// Tambahkan event listener untuk setiap tombol Edit Buku di renderBooks
function renderBooks(books = getBooks()) {
    incompleteBookList.innerHTML = "";
    completeBookList.innerHTML = "";

    books.forEach(book => {
        // Pastikan semua properti buku valid
        if (book.title && book.author && !isNaN(book.year)) {
            const bookElement = document.createElement("div");
            bookElement.setAttribute("data-bookid", book.id);
            bookElement.setAttribute("data-testid", "bookItem");
            bookElement.innerHTML = `
                <h3 data-testid="bookItemTitle">${book.title}</h3>
                <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
                <p data-testid="bookItemYear">Tahun: ${book.year}</p>
                <div>
                    <button data-testid="bookItemIsCompleteButton">${book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca"}</button>
                    <button data-testid="bookItemDeleteButton">Hapus buku</button>
                    <button data-testid="bookItemEditButton">Edit buku</button>
                </div>
            `;

            // Tambahkan event listeners untuk tombol
            bookElement.querySelector("[data-testid='bookItemIsCompleteButton']").addEventListener("click", () => toggleBookStatus(book.id));
            bookElement.querySelector("[data-testid='bookItemDeleteButton']").addEventListener("click", () => deleteBook(book.id));
            bookElement.querySelector("[data-testid='bookItemEditButton']").addEventListener("click", () => editBook(book.id));

            if (book.isComplete) {
                completeBookList.appendChild(bookElement);
            } else {
                incompleteBookList.appendChild(bookElement);
            }
        }
    });
}


// Pasang kembali fungsi event listener pada form submit asli
bookForm.onsubmit = addNewBook;

    // Render buku saat halaman dimuat
    renderBooks();
});


