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

function downloadPDF() {
  // Get the report container element (check both possible containers)
  const reportContainer = document.querySelector('.report-container') || document.querySelector('.experiment-container');
  const buttonContainer = document.querySelector(".button-container");
  const body = document.body;
  
  if (!reportContainer) {
    alert('Report/Experiment container not found!');
    return;
  }

  // Hide buttons during PDF generation
  buttonContainer.style.display = "none";
  
  // Show loading state
  const originalText = document.querySelector('.download-btn').textContent;
  document.querySelector('.download-btn').textContent = 'Generating PDF...';
  document.querySelector('.download-btn').disabled = true;

  // Store original styles
  const originalOverflow = reportContainer.style.overflow;
  const originalHeight = reportContainer.style.height;
  const originalMinHeight = reportContainer.style.minHeight;
  const originalWidth = reportContainer.style.width;
  const originalMargin = reportContainer.style.margin;
  const originalPadding = reportContainer.style.padding;
  const originalBorder = reportContainer.style.border;
  
  // Add PDF mode class for specific styling
  body.classList.add('pdf-mode');
  
  // Temporarily adjust container for PDF generation
  reportContainer.style.overflow = 'visible';
  reportContainer.style.height = '100%';
  reportContainer.style.minHeight = '265mm';
  reportContainer.style.width = '100%';
  reportContainer.style.maxWidth = '190mm';
  reportContainer.style.minWidth = '190mm'
  reportContainer.style.margin = '0';
  reportContainer.style.padding = '0';
  reportContainer.style.border = 'none';
  reportContainer.style.boxSizing = 'border-box';

  // Configure html2pdf options optimized for A4 lab report
  const options = {
    filename: 'lab_report_' + new Date().toISOString().slice(0, 10) + '.pdf',
    image: { 
      type: 'jpeg', 
      quality: 0.98 
    },
    html2canvas: { 
      scale: 1, // Optimal scale for clarity without overflow
      useCORS: true,
      allowTaint: true,
      letterRendering: true,
      logging: false,
      scrollX: 0,
      scrollY: 0,
      windowWidth: 794, // A4 width in pixels (210mm at 96 DPI)
      windowHeight: 1123, // A4 height in pixels (297mm at 96 DPI)
      width: 719, // Content width (190mm at 96 DPI)
      height: 1002, // Content height (277mm at 96 DPI)
      x: 0,
      y: 0
    },
    jsPDF: { 
      unit: 'mm', 
      format: 'a4', 
      orientation: 'portrait',
      compressPDF: true
    },
    pagebreak: { 
      mode: 'avoid-all'
    }
  };

  // Generate PDF from report container only
  html2pdf()
    .set(options)
    .from(reportContainer)
    .toPdf()
    .get('pdf')
    .then(function (pdf) {
      // Check if content fits on one page
      const totalPages = pdf.internal.getNumberOfPages();
      if (totalPages > 1) {
        console.warn('Content spans multiple pages. Total pages:', totalPages);
      }
      return pdf;
    })
    .save()
    .then(() => {
      // Restore original styles
      restoreOriginalStyles();
      console.log('PDF generated successfully');
    })
    .catch((error) => {
      // Restore original styles on error
      restoreOriginalStyles();
      console.error('PDF generation error:', error);
      alert('Error generating PDF: ' + error.message);
    });

  function restoreOriginalStyles() {
    // Remove PDF mode class
    body.classList.remove('pdf-mode');
    
    // Restore container styles
    reportContainer.style.overflow = originalOverflow;
    reportContainer.style.height = originalHeight;
    reportContainer.style.minHeight = originalMinHeight;
    reportContainer.style.width = originalWidth;
    reportContainer.style.margin = originalMargin;
    reportContainer.style.padding = originalPadding;
    reportContainer.style.border = originalBorder;
    reportContainer.style.maxWidth = '';
    reportContainer.style.boxSizing = '';
    
    // Reset button state
    buttonContainer.style.display = "flex";
    document.querySelector('.download-btn').textContent = originalText;
    document.querySelector('.download-btn').disabled = false;
  }
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
