function lockedProfile() {
    (async () => {
        let profileRequest = await fetch('http://localhost:3030/jsonstore/advanced/profiles');
        let profiles = await profileRequest.json();

        let templateProf = document.querySelectorAll('.profile').forEach(t => t.remove());
        
        Object.keys(profiles).forEach((key, i) => {
            let prof = profiles[key];
            let htmlProfile = createUserProfile((i + 1), prof.username, prof.age, prof.email);
            document.getElementById('main').appendChild(htmlProfile);
        });
    })();

    function createUserProfile(userIndex, username, age, email) {
        const divProfile = document.createElement('div');
        divProfile.classList.add('profile');

        const img = document.createElement('img');
        img.classList.add('userIcon');
        img.src = './iconProfile2.png';

        const lockedLabel = document.createElement('label');
        lockedLabel.textContent = 'Lock';

        const lockRadioBtn = document.createElement('input');
        lockRadioBtn.type = 'radio';
        lockRadioBtn.name = `user${userIndex}Locked`;
        lockRadioBtn.value = 'lock';
        lockRadioBtn.checked = true;

        const labelUnlock = document.createElement('label');
        labelUnlock.textContent = 'Unlock';

        const unlockRadioBtn = document.createElement('input');
        unlockRadioBtn.type = 'radio';
        unlockRadioBtn.name = `user${userIndex}Locked`;
        unlockRadioBtn.value = 'unlock';

        const brEl = document.createElement('br');
        const hrEl = document.createElement('hr');

        const usernameLabel = document.createElement('label');
        usernameLabel.textContent = 'Username';

        let userNameInput = document.createElement('input');
        userNameInput.name = `user${userIndex}Username`;
        userNameInput.value = username;
        userNameInput.disabled = true;
        userNameInput.readOnly = true;

        const divHidden = document.createElement('div');
        divHidden.id = `user${userIndex}HiddenFields`;

        let hiddenFieldHr = document.createElement('hr');

        const emailLabel = document.createElement('label');
        emailLabel.textContent = 'Email:';

        let emailInput = document.createElement('input');
        emailInput.type = 'email';
        emailInput.name = `user${userIndex}Email`;
        emailInput.value = email;
        emailInput.disabled = true;
        emailInput.readOnly = true;

        const ageLabel = document.createElement('label');
        ageLabel.textContent = 'Age:';

        let ageInput = document.createElement('input');
        ageInput.type = 'email';
        ageInput.name = `user${userIndex}Age`;
        ageInput.value = age;
        ageInput.disabled = true;
        ageInput.readOnly = true;

        const showMoreBtn = document.createElement('button');
        showMoreBtn.textContent = 'Show more';
        showMoreBtn.addEventListener('click', showFunction);

        divHidden.appendChild(hiddenFieldHr);
        divHidden.appendChild(emailLabel);
        divHidden.appendChild(emailInput);
        divHidden.appendChild(ageLabel);
        divHidden.appendChild(ageInput);

        divProfile.appendChild(img);
        divProfile.appendChild(lockedLabel);
        divProfile.appendChild(lockRadioBtn);
        divProfile.appendChild(labelUnlock);
        divProfile.appendChild(unlockRadioBtn);
        divProfile.appendChild(brEl);
        divProfile.appendChild(hrEl);
        divProfile.appendChild(usernameLabel);
        divProfile.appendChild(userNameInput);
        divProfile.appendChild(divHidden);
        divProfile.appendChild(showMoreBtn);

        return divProfile;

        function showFunction(ev) {
            const profileEl = ev.target.parentElement;
            const hiddenDivEl = ev.target.previousElementSibling;
            const lockRadioBtn = profileEl.querySelector('input[value="lock"]');

            if (lockRadioBtn.checked) {
                return;
            }

            ev.target.textContent = ev.target.textContent === 'Show more' ? 'Hide it' : 'Show more';
            hiddenDivEl.style.display = hiddenDivEl.style.display === 'block' ? 'none' : 'block';
        }
    }
}

