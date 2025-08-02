// Global variables
let rowCounter = 5; // Starting from 6 since we have 5 pre-filled rows

// Notification system
function showNotification(message, type = 'success') {
  // Remove any existing notifications
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }

  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <span class="notification-message">${message}</span>
    <button class="notification-close" onclick="closeNotification(this)">×</button>
  `;

  // Add to body
  document.body.appendChild(notification);

  // Show notification with animation
  setTimeout(() => {
    notification.classList.add('show');
  }, 100);

  // Auto-hide after 3 seconds
  setTimeout(() => {
    closeNotification(notification.querySelector('.notification-close'));
  }, 3000);
}

function closeNotification(closeBtn) {
  const notification = closeBtn.parentElement;
  notification.classList.remove('show');
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove();
    }
  }, 300);
}

// Add new row function
function addRow() {
  const tableBody = document.getElementById('tableBody');
  rowCounter++;
  
  // Format serial number with leading zero
  const serialNumber = String(rowCounter).padStart(2, '0');
  
  // Create new row
  const newRow = document.createElement('tr');
  newRow.innerHTML = `
    <td><input type="text" class="table-input serial-input" value="${serialNumber}" readonly /></td>
    <td><textarea class="table-input experiment-name" placeholder="Enter experiment name..." rows="1"></textarea></td>
    <td><input type="text" class="table-input page-input" value="" placeholder="e.g., 01-05" /></td>
    <td class="action-column print-hide"><button class="delete-btn" onclick="deleteRow(this)">×</button></td>
  `;
  
  // Add row to table
  tableBody.appendChild(newRow);
  
  // Focus on the experiment name textarea
  const experimentInput = newRow.querySelector('.experiment-name');
  experimentInput.focus();
  
  // Auto-adjust height for the new textarea
  adjustTextareaHeight(experimentInput);
  
  // Show success notification
  showNotification('New row added successfully!', 'success');
}

// Delete row function
function deleteRow(button) {
  const row = button.closest('tr');
  const tableBody = document.getElementById('tableBody');
  
  // Check if there's at least one row remaining
  const remainingRows = tableBody.querySelectorAll('tr').length;
  
  if (remainingRows <= 1) {
    showNotification('Cannot delete the last row!', 'error');
    return;
  }
  
  // Get the experiment name for the notification
  const experimentName = row.querySelector('.experiment-name').value || 'Untitled experiment';
  const shortName = experimentName.length > 30 ? experimentName.substring(0, 30) + '...' : experimentName;
  
  // Remove the row with animation
  row.style.opacity = '0';
  row.style.transform = 'translateX(-20px)';
  
  setTimeout(() => {
    row.remove();
    updateSerialNumbers();
    showNotification(`Row "${shortName}" deleted successfully!`, 'error');
  }, 200);
}

// Update serial numbers after deletion
function updateSerialNumbers() {
  const tableBody = document.getElementById('tableBody');
  const rows = tableBody.querySelectorAll('tr');
  
  rows.forEach((row, index) => {
    const serialInput = row.querySelector('.serial-input');
    const newSerial = String(index + 1).padStart(2, '0');
    serialInput.value = newSerial;
  });
  
  // Update counter
  rowCounter = rows.length;
}

// Print function
function printPage() {
  window.print();
  showNotification('Print dialog opened successfully!', 'success');
}

// Download PDF function
function downloadPDF() {
  const element = document.querySelector('.indexpage-container');
  const opt = {
    margin: 0,
    filename: 'index-page.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 2,
      useCORS: true,
      letterRendering: true,
      allowTaint: true
    },
    jsPDF: { 
      unit: 'mm', 
      format: 'a4', 
      orientation: 'portrait',
      putOnlyUsedFonts: true,
      floatPrecision: 16
    }
  };

  // Show loading notification
  showNotification('Generating PDF... Please wait.', 'info');

  html2pdf().set(opt).from(element).save().then(() => {
    showNotification('PDF downloaded successfully!', 'success');
  }).catch((error) => {
    console.error('PDF generation failed:', error);
    showNotification('Failed to generate PDF. Please try again.', 'error');
  });
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
  // Auto-adjust textarea heights
  function adjustTextareaHeight(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = Math.max(textarea.scrollHeight, 20) + 'px';
  }

  // Make adjustTextareaHeight globally available
  window.adjustTextareaHeight = adjustTextareaHeight;

  // Add event listeners for auto-resize
  document.addEventListener('input', function(e) {
    if (e.target.classList.contains('experiment-name') && e.target.tagName === 'TEXTAREA') {
      adjustTextareaHeight(e.target);
    }
  });

  // Initialize existing textareas and convert inputs to textareas if needed
  document.querySelectorAll('.experiment-name').forEach(element => {
    if (element.tagName === 'INPUT') {
      // Convert input to textarea
      const textarea = document.createElement('textarea');
      textarea.className = element.className;
      textarea.value = element.value;
      textarea.placeholder = element.placeholder || 'Enter experiment name...';
      textarea.rows = 1;
      
      // Replace input with textarea
      element.parentNode.replaceChild(textarea, element);
      adjustTextareaHeight(textarea);
    } else if (element.tagName === 'TEXTAREA') {
      adjustTextareaHeight(element);
    }
  });
  
  console.log('Index page JavaScript loaded successfully!');
});

// Prevent form submission on Enter key and handle navigation
document.addEventListener('keydown', function(e) {
  if (e.key === 'Enter' && e.target.classList.contains('table-input')) {
    e.preventDefault();
    
    // If it's a textarea, allow Shift+Enter for new line
    if (e.target.tagName === 'TEXTAREA' && e.shiftKey) {
      const textarea = e.target;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      textarea.value = textarea.value.substring(0, start) + '\n' + textarea.value.substring(end);
      textarea.selectionStart = textarea.selectionEnd = start + 1;
      adjustTextareaHeight(textarea);
      return;
    }
    
    // Move to next input field
    const inputs = Array.from(document.querySelectorAll('.table-input:not(.serial-input)'));
    const currentIndex = inputs.indexOf(e.target);
    
    if (currentIndex >= 0 && currentIndex < inputs.length - 1) {
      inputs[currentIndex + 1].focus();
    } else if (currentIndex === inputs.length - 1) {
      // If on the last input of the last row, add a new row and focus on it
      addRow();
    }
  }
});
