const loginBtn = document.getElementById('loginBtn');
const signupLink = document.getElementById('signupLink');
const loginPopup = document.getElementById('loginPopup');
const overlay = document.getElementById('overlay');

//open popup
function openPopup() {
    loginPopup.style.display = 'block';
    overlay.style.display = 'block';
}

// Function to close popup
function closePopup() {
    loginPopup.style.display = 'none';
    overlay.style.display = 'none';
}

//click login button
loginBtn.addEventListener('click', openPopup);

// click signup link button
signupLink.addEventListener('click', openPopup);

// Close the popup
window.addEventListener('click', function(event) {
    if (event.target === overlay) {
        closePopup();
    }
});