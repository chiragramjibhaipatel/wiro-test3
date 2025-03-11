class EmbroideryConfigurations extends HTMLElement {
  constructor() {
    super();
    this.embroideryCheckbox = this.querySelector('input[name="properties[_has_embroidery]"]');
    this.embroideryNameInput = this.querySelector('input[name="properties[embroidered_name]"]');
    this.colorOptions = this.querySelectorAll('input[name="properties[Letter Color]"]');
    this.fontOptions = this.querySelectorAll('input[name="properties[Font Style]"]');
    this.configurationContainer = this.querySelector('.embroidery-config-options');
    this.previewElement = this.querySelector('.embroidery-preview');
    
    this.init();
  }

  init() {
    // Set default selections
    if (this.colorOptions.length > 0) {
      this.colorOptions[0].checked = true;
    }
    
    if (this.fontOptions.length > 0) {
      this.fontOptions[0].checked = true;
    }
    
    // Add event listeners
    this.embroideryCheckbox.addEventListener('change', this.toggleEmbroideryOptions.bind(this));
    this.embroideryNameInput.addEventListener('input', this.updatePreview.bind(this));
    
    this.colorOptions.forEach(option => {
      option.addEventListener('change', this.updatePreview.bind(this));
    });
    
    this.fontOptions.forEach(option => {
      option.addEventListener('change', this.updatePreview.bind(this));
    });
    
    // Initial state
    this.toggleEmbroideryOptions();
    this.updatePreview();
  }
  
  toggleEmbroideryOptions() {
    if (this.embroideryCheckbox.checked) {
      this.configurationContainer.classList.remove('custom-hidden');
      // Make sure form fields are enabled
      this.enableFormFields(true);
    } else {
      this.configurationContainer.classList.add('custom-hidden');
      // Disable form fields to prevent submission
      this.enableFormFields(false);
    }
    
    // Update preview
    this.updatePreview();
  }
  
  enableFormFields(enable) {
    // Enable/disable form fields based on checkbox state
    this.embroideryNameInput.disabled = !enable;
    
    this.colorOptions.forEach(option => {
      option.disabled = !enable;
    });
    
    this.fontOptions.forEach(option => {
      option.disabled = !enable;
    });
  }
  
  updatePreview() {
    // Clear existing classes
    this.previewElement.className = 'embroidery-preview custom-flex custom-justify-center custom-items-center custom-aspect-square custom-bg-gray-200 custom-rounded custom-p-4 custom-text-center';
    
    // If embroidery is not checked, show default preview
    if (!this.embroideryCheckbox.checked) {
      this.previewElement.innerHTML = '<p class="custom-text-gray-500 custom-text-base">Preview</p>';
      return;
    }
    
    // Get current selections
    const name = this.embroideryNameInput.value || 'Name';
    
    let selectedColor = 'White';
    this.colorOptions.forEach(option => {
      if (option.checked) {
        selectedColor = option.value;
      }
    });
    
    let selectedFont = 'Serif';
    this.fontOptions.forEach(option => {
      if (option.checked) {
        selectedFont = option.value;
      }
    });
    
    // Add selected classes to preview
    this.previewElement.classList.add(`font-${selectedFont.toLowerCase()}`);
    this.previewElement.classList.add(`color-${selectedColor.toLowerCase()}`);
    
    // Update preview content
    this.previewElement.innerHTML = `
      <div class="custom-text-2xl custom-font-bold">${name}</div>
    `;
  }
}

customElements.define('embroidery-configurations', EmbroideryConfigurations); 