const form = document.getElementById('mlist-form');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    try {
        const response = await fetch('http://127.0.0.1:5000/save_mlist', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            alert('Query sent successfully!');
            form.reset();
        } else {
            const errorMessage = await response.text();
            alert(`Failed to send query. Error: ${errorMessage}`);
        }
    } catch (error) {
        console.error(error);
        alert(`An error occurred: ${error}`);
    }
});
