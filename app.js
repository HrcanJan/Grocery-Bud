// ****** SELECT ITEMS **********
const alert = document.querySelector('.alert');
const form = document.querySelector('.grocery-form');
const submitBtn = document.querySelector('.submit-btn');
const container = document.querySelector('.grocery-container');
const list = document.querySelector('.grocery-list');
const clearBtn = document.querySelector('.clear-btn');
const grocery = document.getElementById('grocery');

// edit option
let editElement;
let editFlag = false;
let editID = "";

// ****** EVENT LISTENERS **********
// submit form
form.addEventListener('submit', (e) => {
    e.preventDefault();
    addItem();
});

// clear item
clearBtn.addEventListener('click', clearItems)

// load items
window.addEventListener('DOMContentLoaded', setupItems);

// ****** FUNCTIONS **********
function addItem(e){
    const value = grocery.value;
    const id = new Date().getTime().toString();

    if(value && !editFlag){
        createListItem(id, value);

        displayAlert("item added to the list", 'success');
        container.classList.add('show-container');

        addToLocalStorage(id, value);
        setBacktoDefault();

    } else if(value && editFlag) {
        editElement.innerHTML = value;
        displayAlert('value changed', 'success');
        editLocalStorage(editID, value);
        setBacktoDefault();

    } else {
        displayAlert("please enter value", "danger");
    }
}

// display alert
function displayAlert(text, action){
    alert.textContent = text;
    alert.classList.add(`alert-${action}`);

    // remove alert
    setTimeout(() => {
        alert.textContent = '';
        alert.classList.remove(`alert-${action}`);
    }, 1000);
}

function clearItems(){
    const items = document.querySelectorAll('.grocery-item');

    if(items.length > 0)
        items.forEach((item) => {
            list.removeChild(item);
        })
    
    container.classList.remove('show-container');
    displayAlert('empty list', 'danger');
    setBacktoDefault();
    localStorage.removeItem('list');
}

// delete
function deleteItem(e){
    const element = e.currentTarget.parentElement.parentElement;
    const id = element.dataset.id;
    list.removeChild(element);

    if(list.children.length === 0)
        container.classList.remove('show-container');
    displayAlert('item removed', 'danger');
    setBacktoDefault();
    removeFromLocalStorage(id);
}

// edit
function editItem(e){
    const element = e.currentTarget.parentElement.parentElement;
    editElement = e.currentTarget.parentElement.previousElementSibling;
    grocery.value = editElement.innerHTML;
    editFlag = true;
    editID = element.dataset.id;
    submitBtn.textContent = "edit";
}

// set back to defualt
function setBacktoDefault(){
    grocery.value = '';
    editFlag = false;
    editID = '';
    submitBtn.textContent = "submit";
}

// ****** LOCAL STORAGE **********
function addToLocalStorage(id, value) {
    const grocery = {id, value}; // {id(name) : id, value(name) : value}
    let items = getLocalStorage();

    items.push(grocery);
    localStorage.setItem('list', JSON.stringify(items));
}

function removeFromLocalStorage(id) {
    let items = getLocalStorage();

    items = items.filter((item) => {
        if(item.id !== id)
            return item
    })
    localStorage.setItem('list', JSON.stringify(items));
}

function editLocalStorage(id, value){
    let items = getLocalStorage();
    items = items.map((item) => {
        if(item.id === id)
            item.value.value;
        return item;
    })
    localStorage.setItem('list', JSON.stringify(items));
}

function getLocalStorage(){
    return localStorage.getItem('list') ? JSON.parse
    (localStorage.getItem('list')) : [];
}

// ****** SETUP ITEMS **********
function setupItems(){
    let items = getLocalStorage();
    if(items.length > 0)
        items.forEach((item) => {
            createListItem(item.id, item.value);
        })

    container.classList.add('show-container');
}

function createListItem(id, value){
    const element = document.createElement('article');
    element.classList.add('grocery-item');
    const attr = document.createAttribute('data-id');
    attr.value = id;
    element.setAttributeNode(attr);
    element.innerHTML = ` <p class="title">${value}</p>
                            <div class="btn-container">
                            <button class="edit-btn" type="button">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="delete-btn" type="button">
                                <i class="fas fa-trash"></i>
                            </button>
                            </div>`;

    const deleteBtn = element.querySelector('.delete-btn');
    const editBtn = element.querySelector('.edit-btn');
    deleteBtn.addEventListener('click', deleteItem);
    editBtn.addEventListener('click', editItem);

    list.appendChild(element);
}