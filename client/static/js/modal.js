const modal = document.querySelector('#modal');
const modalHeader = modal.querySelector('h2');
const modalContent = modal.querySelector('article');
const modalExit = modal.querySelector('i a');

const fields = [
    { tag: 'input', attributes: { type: 'text', name: 'title', placeholder: 'Title' } },
    { tag: 'input', attributes: { type: 'text', name: 'yearOfPublication', placeholder: 'Year of Publication' } },
    { tag: 'input', attributes: { type: 'text', name: 'authorName', placeholder: 'Author' } },
    { tag: 'textarea', attributes: { name: 'abstract', placeholder: 'Abstract' } },
    { tag: 'input', attributes: { type: 'submit', value: 'Add Book' } }
]

async function loadModalFor(category, id) {
    modalContent.innerHTML = '';
    modal.style.display = 'block';
    if (id === 'new') {
        renderNewBookForm();
    } else {
        const data = await getItem(category, id);
        category === 'books' ? renderBookModal(data) : renderAuthorModal(data);
    }
}

function renderBookModal(book) {
    modalHeader.textContent = `${book.title} - ${book.yearOfPublication}`;
    const authorLink = createItemLink(book.author);
    const abstract = document.createElement('p');
    abstract.textContent = book.abstract;
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete Book';
    deleteBtn.onclick = () => deleteBook(book.id);
    modalContent.appendChild(authorLink);
    modalContent.appendChild(abstract);
    modalContent.appendChild(deleteBtn);
    modalExit.href = `#books`;
}

function renderAuthorModal(author) {
    modalHeader.textContent = author.name;
    const list = document.createElement('ul');
    const bookLinks = author.books.map(createItemLink);
    bookLinks.forEach(link => {
        const li = document.createElement('li');
        li.appendChild(link);
        list.appendChild(li);
    })
    modalContent.appendChild(list);
    modalExit.href = `#authors`;
}

function renderNewBookForm(){
    modalHeader.textContent = 'Add a Book';
    const form = document.createElement('form');
    fields.forEach(f => {
        const field = document.createElement(f.tag);
        Object.entries(f.attributes).forEach(([a, v]) => field.setAttribute(a, v))
        form.appendChild(field);
    })
    form.onsubmit = postBook;
    modalContent.appendChild(form);
    modalExit.href = `#books`;
}

function createItemLink(data){
    console.log(data);
    const link = document.createElement('a');
    link.href = `#${data.path.substring(1)}`;
    link.textContent = data.name || data.title;
    return link;
}