// Char limits in a higher scope 
let contactRequestInputLimits;

const contactRequestForm = document.getElementById('contact-request-form');

// Get the form elements by their IDs
const contactRequestSubjectInput = document.getElementById('contact-request-subject');
const contactRequestNameInput = document.getElementById('contact-request-name');
const contactRequestEmailInput = document.getElementById('contact-request-email');
const contactRequestMessageInput = document.getElementById('contact-request-message');

const contactRequestMessageCharCounter = document.getElementById('contact-request-message-char-counter');



// Fetch the character_limits.json file
fetch('./backend/config/character_limits.json')
    .then((response) => response.json())
    .then((data) => {
        // Get the character limits for contact_requests
        contactRequestInputLimits = data.contact_requests;

        // Set the maxlength attribute for each input element
        contactRequestSubjectInput.setAttribute('maxlength', contactRequestInputLimits.subject);
        contactRequestNameInput.setAttribute('maxlength', contactRequestInputLimits.name);
        contactRequestEmailInput.setAttribute('maxlength', contactRequestInputLimits.email);
        contactRequestMessageInput.setAttribute('maxlength', contactRequestInputLimits.message);
    })
    .catch((error) => {
            console.error('Error loading character_limits.json:', error);
    });


contactRequestMessageInput.addEventListener('input', () => {
    const messageValue = contactRequestMessageInput.value;
    contactRequestMessageCharCounter.innerHTML = `${messageValue.length}/${contactRequestInputLimits.message}`;
});

contactRequestForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const contactRequestFormData = new FormData(contactRequestForm);

    // Note: The timestamp is now generated in the backend instead
    // const timestamp = Math.floor(Date.now() / 1000); 
    // formData.append('contact-timestamp', timestamp.toString()); 

    // Perform the Fetch POST request to the backend endpoint

    try {

        // backend processing
        const response = await fetch('http://127.0.0.1:5000/save_contact_request', {
            method: 'POST',
            body: contactRequestFormData,
        });

        const responseData = await response.json(); // Parse the JSON response

        if (responseData.status == 'ok') {
            alert('Query sent successfully!');
            contactRequestForm.reset();
        } else if (responseData.status == 'error') {
            const errorMessage = responseData.message;
            alert(`Failed to send query. Error: ${errorMessage}`);
        }

    } catch (error) {
        console.error(error);
        alert(`An error occurred: ${error}`);
    }
});
