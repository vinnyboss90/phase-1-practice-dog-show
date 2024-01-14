document.addEventListener('DOMContentLoaded', () => {
    fetchData();
    attachEditDogListeners();
})

function fetchData(){
    fetch('http://localhost:3000/dogs')
    .then(res => res.json())
    .then(data => {renderDogs(data)/*, editDog(data)*/})
    .catch(error => console.log(error))
}

function renderDogs(dogs){
    let dogsTableBody = document.getElementById('table-body')
    dogs.forEach((dog)=>{
        let newRow = document.createElement('tr')
        newRow.innerHTML = `
            <td>${dog.name}</td>
            <td>${dog.breed}</td>
            <td>${dog.sex}</td>
            <td><button class="edit-dog" data-id="${dog.id}">Edit Dog</button></td>
        `
        dogsTableBody.appendChild(newRow)

        attachEditDogListeners();
    })
}


function attachEditDogListeners(){
    const editButtons = document.querySelectorAll('.edit-dog')
    editButtons.forEach((btn)=>{
        btn.addEventListener('click', ()=>{
            const dogID = btn.getAttribute('data-id')
            populateEditForm(dogID)
        })
    })
}

function populateEditForm(dogID){
    const dogForm = document.getElementById('dog-form');
    const dog = {
        name: dogForm.querySelector('input[name = "name"]'),
        breed: dogForm.querySelector('input[name = "breed"]'),
        sex: dogForm.querySelector('input[name = "sex"]')
    };

    fetch(`http://localhost:3000/dogs/${dogID}`)
    .then(res => res.json())
    .then(data => {
        dog.name.value = data.name;
        dog.breed.value = data.breed;
        dog.sex.value = data.sex

        dogForm.addEventListener('submit', (e)=>{
            e.preventDefault();
            updateDog(dogID, dog.name.value, dog.breed.value, dog.sex.value);
            clearForm(dogForm)
        })
    })
}

function updateDog(id, name, breed, sex){
    const updatedData = {
        name: name,
        breed: breed,
        sex: sex
    };

    fetch(`http://localhost:3000/dogs/${id}`,{
        method: 'PATCH',
        headers :{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
    })
    .then(()=>{
        fetchData();
    })
    .catch(error => console.log(error))
}

function clearForm(form){
    form.reset();
}