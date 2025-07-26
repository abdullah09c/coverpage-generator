// Set current date when page loads
document.addEventListener("DOMContentLoaded", function () {
  const dateInput = document.getElementById("submission-date");
  const today = new Date();
  const formattedDate =
    today.getFullYear() +
    "-" +
    String(today.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(today.getDate()).padStart(2, "0");
  dateInput.value = formattedDate;
});

function printPDF() {
  // Hide the buttons temporarily
  const buttonContainer = document.querySelector(".button-container");
  buttonContainer.style.display = "none";

  // Use the browser's print functionality
  window.print();

  // Show the buttons again after a delay
  setTimeout(() => {
    buttonContainer.style.display = "flex";
  }, 1000);
}

// Auto-resize functionality for name input textareas
function autoResize(textarea) {
  // Reset height to auto to get the actual scroll height
  textarea.style.height = "auto";
  // Set height to scroll height to show all content
  textarea.style.height = textarea.scrollHeight + "px";
}

// Initialize auto-resize for existing textareas and handle future ones
document.addEventListener("DOMContentLoaded", function () {
  const nameInputs = document.querySelectorAll(".name-input");

  nameInputs.forEach((textarea) => {
    // Set initial height
    autoResize(textarea);

    // Add event listener for input changes
    textarea.addEventListener("input", function () {
      autoResize(this);
    });

    // Handle paste events
    textarea.addEventListener("paste", function () {
      setTimeout(() => autoResize(this), 0);
    });
  });
});
