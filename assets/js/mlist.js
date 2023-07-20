const maxEmailLength = 128;
const maxEmailLengthError = `Email address must be ${maxEmailLength} characters or less`;

const mlistForm = document.getElementById('mlist-form');
const emailInput = document.getElementById('mlist-email');
const emailErrorElement = document.getElementById('mlist-email-length-error');

// Add an event listener to the input field to check its value
emailInput.addEventListener('input', () => {
    const emailValue = emailInput.value;
    if (emailValue.trim() === '') {
        // If the input field is empty, clear the innerHTML
        emailErrorElement.innerHTML = '';
    }
});

mlistForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Check if email length is within rannge
    const emailLength = emailInput.value.length;
    if (emailLength > maxEmailLength) {
        emailErrorElement.innerHTML = maxEmailLengthError;
        return;
    }

    const mlistFormData = new FormData(mlistForm);

    try {
        
        // backend processing
        const response = await fetch('http://127.0.0.1:5000/save_mlist', {
            method: 'POST',
            body: mlistFormData,
        });

        // if (response.ok) {
        //     alert('Query sent successfully!');
        //     mlistForm.reset();
        // } else {
        //     const errorMessage = await response.text();
        //     alert(`Failed to send query. Error: ${errorMessage}`);
        // }

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
