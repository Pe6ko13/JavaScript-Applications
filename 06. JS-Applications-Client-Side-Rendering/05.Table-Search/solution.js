import { html, render } from './node_modules/lit-html/lit-html.js';

const studentRow = (student) => html`
<tr class="${student.match ? 'select' : ''}">
   <td>${student.item.firstName} ${student.item.lastName}</th>
   <td>${student.item.email}</th>
   <td>${student.item.course}</th>
</tr>`;

let students;
start();

async function start() {
   const res = await fetch('http://localhost:3030/jsonstore/advanced/table');
   const data = await res.json();
   students = Object.values(data).map(s => ({item: s, match: false}));
   students.forEach(s => s.match = false);

   update();
}

const input = document.getElementById('searchField');
document.querySelector('#searchBtn').addEventListener('click', onClick);

function onClick() {
   const val = input.value;

   for (let st of students) {
      st.match = Object.values(st.item).some(v => val && v.toLocaleLowerCase().includes(val));
   }

   update();
}

function update() {
   render(students.map(studentRow) , document.querySelector('tbody'));
}