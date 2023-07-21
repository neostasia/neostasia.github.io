// Char limits in a higher scope 
let mailingListInputLimits;
let maxMailingListEmailLengthError;

const mailingListForm = document.getElementById('mailing-list-form');
const emailInput = document.getElementById('mailing-list-email');
const emailStatusElement = document.getElementById('mailing-list-email-status');


// Fetch the character_limits.json file
fetch('./backend/config/character_limits.json')
    .then((response) => response.json())
    .then((data) => {
        // Get the character limits for mailing list
        mailingListInputLimits = data.mailing_list;

        // Set the maxlength attribute for each input element
        // (not necessary for this form)
        // mailingListEmailInput.setAttribute('maxlength', mailingListInputLimits.email);
        maxMailingListEmailLengthError = `Email address must be ${mailingListInputLimits.email} characters or less`;
    })
    .catch((error) => {
        console.error('Error loading character_limits.json:', error);
    });



// Add an event listener to the input field to check its value
emailInput.addEventListener('input', () => {
    const emailValue = emailInput.value;
    if (emailValue.trim() === '') {
        // If the input field is empty, clear the innerHTML
        emailStatusElement.style.color = "white";
        emailStatusElement.innerHTML = '';
    }
});

mailingListForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Check if email length is within rannge
    const emailLength = emailInput.value.length;
    if (emailLength > mailingListInputLimits.email) {
        emailStatusElement.style.color = "red";
        emailStatusElement.innerHTML = maxMailingListEmailLengthError;
        return;
    }

    const mailingListFormData = new FormData(mailingListForm);

    try {
        
        // backend processing
        const response = await fetch('http://127.0.0.1:5000/save_mailing_list', {
            method: 'POST',
            body: mailingListFormData,
        });

        const responseData = await response.json(); // Parse the JSON response

        if (responseData.status == 'ok') {
            // success
            alert('Query sent successfully!');
            mailingListForm.reset();

        } else if (responseData.status == 'already_exists') {
            // email addr already in db
            emailStatusElement.style.color = "white";
            emailStatusElement.innerHTML = `Email address is already signed up`;

        } else if (responseData.status == 'error') {
            // misc error
            const errorMessage = responseData.message;
            emailStatusElement.style.color = "red";
            emailStatusElement.innerHTML = `Failed to send query. Error: ${errorMessage}`;
        }

    } catch (error) {
        console.error(error);
        alert(`An error occurred: ${error}`);
    }
});
