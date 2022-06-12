const navLinks = document.querySelectorAll('a.navlink');
const main = document.querySelector('main');

window.addEventListener('hashchange', updateContent);

function updateNav(hash) {
    const updateLink = link => {
        link.classList = (link.textContent == '+' && hash.includes('new') || hash.includes(link.textContent)) ? ['navlink', 'current'] : ['navlink']
    };
    navLinks.forEach(updateLink)
}

function updateMain(hash) {
    main.innerHTML = '';
    if (hash) {
        let [category, id] = hash.split('/');
        id ? loadModalFor(category, id) : loadIndexFor(category)
    } else {
        const header = document.createElement('h1');
        header.className = 'title';
        header.textContent = "Welcome to the Reading Room";
        main.appendChild(header);
    }
}

async function loadIndexFor(category){
    modal.style.display = 'none';
    const data = await getAll(category);
    data.forEach(a => renderCard(a, category));
}

function renderCard(data, category){
    let link = document.createElement('a');
    let card = document.createElement('div');
    card.className = 'card';
    link.href = `#${category}/${data.id}` 
    card.textContent = data.name || data.title;
    link.appendChild(card);
    main.appendChild(link);
}

function updateContent(){
    let hash = window.location.hash.substring(1);
    updateNav(hash);
    updateMain(hash);
}