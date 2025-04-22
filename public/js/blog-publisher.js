/**
 * Blog Publisher
 * 
 * This script handles scheduling and publishing blog posts:
 * - Controls blog draft status
 * - Manages publish dates
 * - Provides a convenient interface for scheduling posts
 */

document.addEventListener('DOMContentLoaded', () => {
  console.log('Blog publisher loaded');
  
  initSchedulingInterface();
  initDraftControls();
  initDatePicker();
});

/**
 * Initializes the blog post scheduling interface
 */
function initSchedulingInterface() {
  const schedulingContainer = document.getElementById('blog-scheduling');
  if (!schedulingContainer) return;
  
  // Create the scheduling interface
  const interface = document.createElement('div');
  interface.className = 'bg-white p-5 rounded-lg shadow-md';
  interface.innerHTML = `
    <h3 class="text-xl font-bold mb-4 text-gray-800">Blog Post Scheduling</h3>
    
    <div class="space-y-4">
      <div class="flex items-center">
        <input type="checkbox" id="draft-toggle" class="w-4 h-4 text-blue-600 mr-2">
        <label for="draft-toggle" class="text-gray-700">Save as draft</label>
      </div>
      
      <div class="space-y-2">
        <label for="publish-date" class="block text-gray-700">Publish date:</label>
        <div class="flex space-x-2">
          <input type="date" id="publish-date" class="px-3 py-2 border rounded-md w-full">
          <select id="publish-time" class="px-3 py-2 border rounded-md">
            ${generateTimeOptions()}
          </select>
        </div>
      </div>
      
      <div class="pt-2">
        <button id="schedule-button" class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          Schedule
        </button>
        <button id="publish-now-button" class="ml-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
          Publish Now
        </button>
      </div>
    </div>
    
    <div id="scheduling-feedback" class="mt-4 hidden"></div>
  `;
  
  schedulingContainer.appendChild(interface);
  
  // Add event listeners
  document.getElementById('schedule-button').addEventListener('click', schedulePost);
  document.getElementById('publish-now-button').addEventListener('click', publishNow);
  document.getElementById('draft-toggle').addEventListener('change', toggleDraftStatus);
}

/**
 * Generates time options for the publish time dropdown (hourly increments)
 */
function generateTimeOptions() {
  let options = '';
  for (let i = 0; i < 24; i++) {
    const hour = i.toString().padStart(2, '0');
    options += `<option value="${hour}:00">${hour}:00</option>`;
  }
  return options;
}

/**
 * Toggles the draft status of a blog post
 */
function toggleDraftStatus(event) {
  const isDraft = event.target.checked;
  const feedback = document.getElementById('scheduling-feedback');
  
  feedback.innerHTML = `
    <div class="p-3 rounded ${isDraft ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700'}">
      ${isDraft ? 'Post will be saved as a draft' : 'Post will be published according to schedule'}
    </div>
  `;
  feedback.classList.remove('hidden');
  
  // Save draft status to form data or localStorage
  localStorage.setItem('blog-draft-status', isDraft);
}

/**
 * Schedules a blog post for future publishing
 */
function schedulePost() {
  const publishDate = document.getElementById('publish-date').value;
  const publishTime = document.getElementById('publish-time').value;
  
  if (!publishDate) {
    showFeedback('Please select a publish date', 'error');
    return;
  }
  
  const publishDateTime = new Date(`${publishDate}T${publishTime}`);
  const now = new Date();
  
  if (publishDateTime <= now) {
    showFeedback('Scheduled time must be in the future', 'error');
    return;
  }
  
  // Format the date for display
  const formattedDate = publishDateTime.toLocaleString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  showFeedback(`Post scheduled for ${formattedDate}`, 'success');
  
  // Save scheduling info to form data or localStorage
  localStorage.setItem('blog-publish-date', publishDateTime.toISOString());
}

/**
 * Publishes a blog post immediately
 */
function publishNow() {
  const now = new Date();
  
  // Format the date for display
  const formattedDate = now.toLocaleString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  showFeedback(`Post published on ${formattedDate}`, 'success');
  
  // Set draft status to false
  document.getElementById('draft-toggle').checked = false;
  
  // Save publish date to form data or localStorage
  localStorage.setItem('blog-publish-date', now.toISOString());
  localStorage.setItem('blog-draft-status', false);
}

/**
 * Initializes the date picker with default values
 */
function initDatePicker() {
  const dateInput = document.getElementById('publish-date');
  const timeInput = document.getElementById('publish-time');
  
  if (!dateInput || !timeInput) return;
  
  // Set default date to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  dateInput.value = tomorrow.toISOString().split('T')[0];
  
  // Set default time to current hour
  const now = new Date();
  timeInput.value = `${now.getHours().toString().padStart(2, '0')}:00`;
  
  // Load saved values if they exist
  const savedDate = localStorage.getItem('blog-publish-date');
  if (savedDate) {
    const date = new Date(savedDate);
    dateInput.value = date.toISOString().split('T')[0];
    timeInput.value = `${date.getHours().toString().padStart(2, '0')}:00`;
  }
}

/**
 * Initializes draft status controls
 */
function initDraftControls() {
  const draftToggle = document.getElementById('draft-toggle');
  if (!draftToggle) return;
  
  // Load saved draft status if it exists
  const savedDraftStatus = localStorage.getItem('blog-draft-status');
  if (savedDraftStatus !== null) {
    draftToggle.checked = savedDraftStatus === 'true';
  }
}

/**
 * Shows feedback messages to the user
 */
function showFeedback(message, type) {
  const feedback = document.getElementById('scheduling-feedback');
  if (!feedback) return;
  
  const bgColor = type === 'error' ? 'bg-red-50' : 'bg-green-50';
  const textColor = type === 'error' ? 'text-red-700' : 'text-green-700';
  const icon = type === 'error' ? '⚠️' : '✅';
  
  feedback.innerHTML = `
    <div class="p-3 rounded ${bgColor} ${textColor}">
      ${icon} ${message}
    </div>
  `;
  feedback.classList.remove('hidden');
} 