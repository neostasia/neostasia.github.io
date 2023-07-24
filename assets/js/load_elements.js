
// Function to fetch the navbar content and insert it into the container
function loadNavbar() {
fetch("navbar.html")
    .then((response) => response.text())
    .then((data) => {
    document.getElementById("navbar-container").innerHTML = data;
    })
    .catch((error) => {
    console.error("Error loading navbar:", error);
    });
}

// Same process, but for footer
function loadFooter() {
    fetch("footer.html")
        .then((response) => response.text())
        .then((data) => {
        document.getElementById("footer-container").innerHTML = data;
        })
        .catch((error) => {
        console.error("Error loading footer:", error);
        });
    }

// Call the function to load the elements when the page is loaded
window.addEventListener("DOMContentLoaded", loadNavbar);
window.addEventListener("DOMContentLoaded", loadFooter);
    
    