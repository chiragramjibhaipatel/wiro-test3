class EmbroideryConfigurations extends HTMLElement {
  constructor() {
    super();
    this.embroideryCheckbox = this.querySelector('input[name="properties[_has_embroidery]"]');
    this.embroideryNameInput = this.querySelector('input[name="properties[Embroidered Name]"]');
    this.colorOptions = this.querySelectorAll('input[name="properties[Letter Color]"]');
    this.fontOptions = this.querySelectorAll('input[name="properties[Font Style]"]');
    this.configurationContainer = this.querySelector('.embroidery-config-options');
    this.previewElement = this.querySelector('.embroidery-preview');
    this.textPreviewElement = this.querySelector('.embroidery-text-preview');
    this.embroideryCostElement = this.querySelector('[data-embroidery-cost]');
    this.currencySymbolElement = this.querySelector('[data-currency-symbol]');
    
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
    // If embroidery is not checked, hide the text preview
    if (!this.embroideryCheckbox.checked) {
      this.textPreviewElement.classList.add('custom-hidden');
      return;
    }
    this.updateEmbroideryCost();

    
    // Get current selections
    const name = this.embroideryNameInput.value || '';
    
    // If no name is entered, hide the text preview
    if (!name) {
      this.textPreviewElement.classList.add('custom-hidden');
      return;
    }
    
    // Show the text preview
    this.textPreviewElement.classList.remove('custom-hidden');
    
    let selectedColor = '';
    this.colorOptions.forEach(option => {
      if (option.checked) {
        selectedColor = option.value;
      }
    });
    
    let selectedFont = '';
    this.fontOptions.forEach(option => {
      if (option.checked) {
        selectedFont = option.value;
      }
    });
    
    // Reset classes
    this.textPreviewElement.className = 'embroidery-text-preview custom-absolute custom-mb-3 custom-py-2 custom-px-4 custom-z-10 custom-text-2xl';
    
    // Add selected font class
    if (selectedFont) {
      this.textPreviewElement.classList.add(`custom-font-${selectedFont.toLowerCase()}`);
    }
    
    // Add selected color class
    if (selectedColor) {
      this.textPreviewElement.classList.add(`custom-text-${selectedColor.toLowerCase()}`);
    }
    
    // Update preview content
    this.textPreviewElement.textContent = name;
  }

  updateEmbroideryCost() {
    let selectedColor = '';
    this.colorOptions.forEach(option => {
      if (option.checked) {
        selectedColor = option.value;
      }
    });
    const embroideryCost = JSON.parse(this.embroideryCostElement.getAttribute('data-embroidery-cost'));
    const currencySymbol = this.currencySymbolElement.getAttribute('data-currency-symbol');
    let costOfSelectedColor = embroideryCost[selectedColor];
    const currencySymbolMapping = {
      'GBP': '£',
      'USD': '$',
      'EUR': '€',
      'CAD': 'CA$',
      'AUD': 'A$',
      'INR': 'Rs.',
    }
    this.embroideryCostElement.textContent = `+${currencySymbolMapping[currencySymbol]}${costOfSelectedColor}`;
  }
}

customElements.define('embroidery-configurations', EmbroideryConfigurations); 