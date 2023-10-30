
var todoList = [];

function addRecords() {
    const nameInput = document.getElementById('name').value;
    const lnameInput = document.getElementById('lname').value;
    if (nameInput.length === 0 && lnameInput.length === 0) {
        alert('Please enter a valid first name and last name');
    } else {
        const data = { firstName: nameInput, lastName: lnameInput };
        document.getElementById('output').innerHTML = 'Adding...';
        setTimeout(async () => {
            try {
                const newEntry = await postRecordsToServer(data);
                todoList.push(newEntry);
                renderRecords();
            } catch (error) {
                console.log(error);
            }
        }, 2000);
    }
    document.getElementById('name').value = '';
    document.getElementById('lname').value = '';
}

function renderRecords() {
    let todoListHTML = '';
    if (todoList.length === 0) {
        todoListHTML = `<div class="mt-4 text-red-500">No Names Found</div>`;
    } else {
        todoList.forEach(item => {
            todoListHTML += `
                <div class="flex items-center justify-between mt-4">
                    <span class="flex-1">${item.firstName} ${item.lastName}</span>
                    <button onclick="editRecords(${item.id})" class="bg-blue-500 text-white px-3 py-1 rounded-md mr-2">Edit</button>
                    <button onclick="delRecords(${item.id})" class="bg-red-500 text-white px-3 py-1 rounded-md">Delete</button>
                </div>`;
        });
    }
    document.getElementById('output').innerHTML = todoListHTML;
}

function editRecords(id) {
    const item = todoList.find(item => item.id === id);

    if (item) {
        const oldValue = `${item.firstName} ${item.lastName}`;

        document.getElementById("input").innerHTML = `
            <div>
                <input type="text" id="name2" value="${item.firstName}" class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300">
                <input type="text" id="lname2" value="${item.lastName}" class="w-full mt-2 px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300">
                <button onclick="updateForm(${item.id})" class="w-full mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:bg-green-600">Update</button>
                <button onclick="cancelForm()" class="w-full mt-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600">Cancel</button>
            </div>`;

        document.getElementById('name2').value = item.firstName;
        document.getElementById('lname2').value = item.lastName;
    }
}

function cancelForm() {
    resetForm();
}

function resetForm() {
    document.getElementById('input').innerHTML = `
        <div>
            <input type="text" id="name" placeholder="Enter First Name"
                class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300">
            <input type="text" id="lname" placeholder="Enter Last Name"
                class="w-full mt-2 px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300">
            <button onclick="addRecords()" class="w-full mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">
                Add
            </button>
        </div>`;
}

function updateForm(id) {
    document.getElementById('output').innerHTML = 'Updating...'
    const item = todoList.find(item => item.id === id);
    if (item) {
        const newFirstName = document.getElementById('name2').value;
        const newLastName = document.getElementById('lname2').value;
        const updatedEntry = {firstName: newFirstName, lastName: newLastName};
        putRecordsToServer(id, updatedEntry);
        resetForm();
    }
}

async function renderRecordsFromServer(){
    document.getElementById('output').innerHTML = `Loading...`;
    setTimeout(() => {
     fetch('http://localhost:3000/users')
      .then(data => data.json())
      .then(res => {
        todoList = res;
        renderRecords()
    })
    .catch(err => console.error(err));
    }, 2000);
    
}

async function postRecordsToServer(data){
    try{
    const response = await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    const newEntry = await response.json();
    return newEntry.data;
} catch(err){
    console.log('Error adding record', err);
    throw err;
}
}

async function putRecordsToServer(id, data) {
    setTimeout(() => {
        fetch(`http://localhost:3000/users/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(updatedEntry => {
        console.log('Updated Entry:', updatedEntry); // Log the updated entry
        if (updatedEntry.data) {
            const index = todoList.findIndex(item => item.id === id);
            if (index !== -1) {
                todoList[index] = updatedEntry.data; // Assuming the updatedEntry contains the whole object
                renderRecords();
            }
        }
    })
    .catch(error => {
        console.error('Error updating record', error);
    });
    }, 2000);
    
}

function delRecords(id) {
    const confirmed = confirm("Are you sure you want to delete this record?");
    if (confirmed) {
        fetch(`http://localhost:3000/users/${id}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(() => {
            todoList = todoList.filter(item => item.id !== id);
            renderRecords();
        })
        .catch(error => {
            console.error('Error deleting record', error);
        });
    }
}

renderRecordsFromServer();