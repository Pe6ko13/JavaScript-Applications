function solution() {
    const mainDiv = document.getElementById('main');

    const url = 'http://localhost:3030/jsonstore/advanced/articles/list';
    fetch(url)
        .then(response => response.json())
        .then(titlesData => {
            titlesData.forEach(t => {
                createCell(t);
            });
        });

        function createCell(obj) {
            const accordDiv = document.createElement('div');
            accordDiv.classList.add('accordion');

            const headDiv = document.createElement('div');
            headDiv.className = 'head';
            accordDiv.appendChild(headDiv);

            const titleSpan = document.createElement('span');
            titleSpan.textContent = `${obj.title}`;
            headDiv.appendChild(titleSpan);

            const moreBtn = document.createElement('button');
            moreBtn.classList.add('button');
            moreBtn.id = `${obj._id}`;
            moreBtn.textContent = 'More';
            headDiv.appendChild(moreBtn);

            const extraDiv = document.createElement('div');
            extraDiv.className = 'extra';
            extraDiv.style.display = 'none';
            accordDiv.appendChild(extraDiv);

            const hiddenText = document.createElement('p');
            extraDiv.appendChild(hiddenText);

            mainDiv.appendChild(accordDiv);

            moreBtn.addEventListener('click', () => {
                if (moreBtn.textContent == 'More') {
                    fetch(`http://localhost:3030/jsonstore/advanced/articles/details/${obj._id}`)
                        .then(response => response.json())
                        .then(data => {
                            hiddenText.textContent = data.content;
                            moreBtn.textContent = 'Less';
                            extraDiv.style.display = 'block';
                        });
                } else {
                    extraDiv.style.display = 'none';
                    moreBtn.textContent = 'More';
                }
            });
        }
}
solution();