function getInfo() {
    const stopNameEl = document.getElementById('stopName');
    const timeTableEl = document.getElementById('buses');

    const stopId = document.getElementById('stopId').value;

    const url = `http://localhost:3030/jsonstore/bus/businfo/${stopId}`;

    // try {
    //     timeTableEl.replaceChildren();

    //     const response = await fetch(url);
    //     if (response.status != 200) {
    //         throw new Error('Stop ID not found!');
    //     }

    //     const data = await response.json();

    //     stopNameEl.textContent = data.name;

    //     Object.entries(data.buses).forEach(b => {
    //         const liElement = document.createElement('li');
    //         liElement.textContent = `Bus ${b[0]} arrives in ${b[1]} minutes`;

    //         timeTableEl.appendChild(liElement);
    //     });
    // } catch (error) {
    //     stopNameEl.textContent = 'Error';
    // }

    
    fetch(url)
        .then(response => {
            if (response.status != 200) {
                throw new Error('Stop ID not found!');
            }
            return response.json();
        })
        .then(data => {
            stopNameEl.textContent = data.name;
            timeTableEl.replaceChildren();

            Object.entries(data.buses).forEach(b => {
                const liElement = document.createElement('li');
                liElement.textContent = `Bus ${b[0]} arrives in ${b[1]} minutes`;

                timeTableEl.appendChild(liElement);
            });
            
        })
        .catch(err => {
            stopNameEl.textContent = 'Error';
            timeTableEl.replaceChildren();
        });
}