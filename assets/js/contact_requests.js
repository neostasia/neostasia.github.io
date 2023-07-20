const maxMessageLength = 2048;

const contactRequestForm = document.getElementById('contact-request-form');
const messageInput = document.getElementById('contact-request-message');
const messageCharCounter = document.getElementById('contact-request-message-char-counter');

messageInput.addEventListener('input', () => {
    const messageValue = messageInput.value;
    messageCharCounter.innerHTML = `${messageValue.length}/${maxMessageLength}`;
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

        if (responseData.success) {
            alert('Query sent successfully!');
            mlistForm.reset();
        } else {
            const errorMessage = responseData.message;
            alert(`Failed to send query. Error: ${errorMessage}`);
        }

    } catch (error) {
        console.error(error);
        alert(`An error occurred: ${error}`);
    }
});
