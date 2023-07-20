const mlistForm = document.getElementById('mlist-form');

mlistForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const mlistFormData = new FormData(mlistForm);

    try {
        const response = await fetch('http://127.0.0.1:5000/save_mlist', {
            method: 'POST',
            body: mlistFormData,
        });

        if (response.ok) {
            alert('Query sent successfully!');
            mlistForm.reset();
        } else {
            const errorMessage = await response.text();
            alert(`Failed to send query. Error: ${errorMessage}`);
        }
    } catch (error) {
        console.error(error);
        alert(`An error occurred: ${error}`);
    }
});
