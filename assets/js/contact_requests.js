const contactRequestForm = document.getElementById('contact-request-form');

contactRequestForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const contactRequestFormData = new FormData(contactRequestForm);

    // Note: The timestamp is now generated in the backend instead
    // const timestamp = Math.floor(Date.now() / 1000); 
    // formData.append('contact-timestamp', timestamp.toString()); 

    // Perform the Fetch POST request to the backend endpoint

    try {
        const response = await fetch('http://127.0.0.1:5000/save_contact_request', {
            method: 'POST',
            body: contactRequestFormData,
        });

        if (response.ok) {
            alert('Query sent successfully!');
            contactRequestForm.reset();
        } else {
            const errorMessage = await response.text();
            alert(`Failed to send query. Error: ${errorMessage}`);
        }
    } catch (error) {
        console.error(error);
        alert(`An error occurred: ${error}`);
    }
});
