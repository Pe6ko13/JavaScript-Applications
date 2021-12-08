function solve() {
    let nextStopId = 'depot';
    let stopInfoSpan = document.querySelector('#info .info');
    let departButton = document.getElementById('depart');
    let arriveButton = document.getElementById('arrive');

    function depart() {
        
        if (stopInfoSpan.getAttribute('data-next-stop-id') != null) {
            nextStopId = stopInfoSpan.getAttribute('data-next-stop-id');
        }

        fetch(`http://localhost:3030/jsonstore/bus/schedule/${nextStopId}`)
            .then(response => response.json())
            .then(stopInfoData => {
                stopInfoSpan.setAttribute('data-stop-name', stopInfoData.name);
                stopInfoSpan.setAttribute('data-next-stop-id', stopInfoData.next);
                stopInfoSpan.textContent = `Next stop ${stopInfoData.name}`;
                departButton.disabled = true;
                arriveButton.disabled = false;
            })
            .catch(err => {
                stopInfoSpan.textContent = 'Error';
                departButton.disabled = true;
                arriveButton.disabled = true;
            });
    }

    function arrive() {
        let stopName = stopInfoSpan.getAttribute('data-stop-name');
        stopInfoSpan.textContent = `Arriving at ${stopName}`;
        departButton.disabled = false;
        arriveButton.disabled = true;
    }

    return {
        depart,
        arrive
    };
}

let result = solve();


// function solve() {
//     const label = document.querySelector('#info span');
//     const departBtn = document.getElementById('depart');
//     const arrivetBtn = document.getElementById('arrive');
//     let stop = {
//         next: 'depot'
//     };

//     async function depart() {

//         departBtn.disabled = true;

//         const url = `http://localhost:3030/jsonstore/bus/schedule/${stop.next}`;

//         const res = await fetch(url);
//         const data = await res.json();
//         stop = data;

//         label.textContent = `Next stop ${stop.name}`;

//         arrivetBtn.disabled = false;
//     }

//     function arrive() {
//         label.textContent = `Arriving at ${stop.name}`;

//         departBtn.disabled = false;
//         arrivetBtn.disabled = true;
//     }

//     return {
//         depart,
//         arrive
//     };
// }

// let result = solve();