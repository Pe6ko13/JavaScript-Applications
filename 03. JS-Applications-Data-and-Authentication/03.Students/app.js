const url = 'http://localhost:3030/jsonstore/collections/students';
const submitBtn = document.getElementById('submit');
submitBtn.addEventListener('click', addStudent);
const tBodyElement = document.querySelector('tbody');
const studentForm = document.getElementById('form');

async function getStudent() {
    const response = await fetch(url);
    const data = await response.json();
    createStudent(data);
}

async function addStudent(ev) {
    ev.preventDefault();
    const formData = new FormData(studentForm);
    let [firstName, lastName, facultyNumber, inputGrade] = [...formData.values()];
    let grade = Number(inputGrade);

    const student = {
        firstName,
        lastName,
        facultyNumber,
        grade
    };

   if (firstName !== '' && lastName !== '' && facultyNumber !== '' && grade != '' && !Number.isNaN(grade) && grade > 2 && grade <= 6) {
       const response = await fetch(url, {
           method: 'Post',
           headers: {'Content-Type': 'application/json'},
           body: JSON.stringify(student)
       });
       const data = response.json();

       tBodyElement.replaceChildren();
       studentForm.reset();
       getStudent();
   }
}

function createStudent(data) {
    Object.values(data).forEach(student => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${student.firstName}</td>
                        <td>${student.lastName}</td>
                        <td>${student.facultyNumber}</td>
                        <td>${Number(student.grade).toFixed(2)}</td>`;
        tBodyElement.appendChild(tr);
    });
}

getStudent();