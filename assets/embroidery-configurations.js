// Check if the class is already defined
if (!customElements.get('embroidery-configurations')) {
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
      this.productForm = document.querySelector(`form[id="${this.dataset.productFormId}"]`);
      this.addToCartButton = this.productForm ? this.productForm.querySelector('[type="submit"]') : null;
      this.saveConfigButton = this.querySelector('[data-embroidery-save-configuration]');
      this.isCart = this.dataset.isCart === 'true';
      this.embroideryConfigToggle = this.querySelector('.embroidery-config-toggle');
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
      this.embroideryNameInput.addEventListener('input', this.handleNameInput.bind(this));
      
      this.colorOptions.forEach(option => {
        option.addEventListener('change', this.updatePreview.bind(this));
      });
      
      this.fontOptions.forEach(option => {
        option.addEventListener('change', this.updatePreview.bind(this));
      });
      
      // Initial state
      this.toggleEmbroideryOptions();
      this.updatePreview();
      this.validateForm();
    }

    handleNameInput(event) {
      this.updatePreview();
      this.validateForm();
    }

    validateForm() {
      if (this.isCart) {
        if (!this.saveConfigButton) return;

        if (this.embroideryCheckbox.checked && !this.embroideryNameInput.value.trim()) {
          this.saveConfigButton.disabled = true;
          this.saveConfigButton.classList.add('custom-opacity-50', 'custom-cursor-not-allowed');
          this.saveConfigButton.setAttribute('title', 'Please enter an embroidered name');
        } else {
          this.saveConfigButton.disabled = false;
          this.saveConfigButton.classList.remove('custom-opacity-50', 'custom-cursor-not-allowed');
          this.saveConfigButton.removeAttribute('title');
        }
      } else {
        if (!this.addToCartButton) return;

        if (this.embroideryCheckbox.checked && !this.embroideryNameInput.value.trim()) {
          this.addToCartButton.disabled = true;
          this.addToCartButton.setAttribute('title', 'Please enter an embroidered name');
        } else {
          this.addToCartButton.disabled = false;
          this.addToCartButton.removeAttribute('title');
        }
      }
    }
    
    toggleEmbroideryOptions() {
      if (this.embroideryCheckbox.checked) {
        this.configurationContainer.classList.remove('custom-hidden');
        // Make sure form fields are enabled
        this.enableFormFields(true);
        if(this.isCart) {
          this.embroideryConfigToggle.classList.add('custom-bg-gray-100');
        }
      } else {
        this.configurationContainer.classList.add('custom-hidden');
        // Disable form fields to prevent submission
        this.enableFormFields(false);
        if(this.isCart) {
          this.embroideryConfigToggle.classList.remove('custom-bg-gray-100');
        }
      }
      
      this.validateForm();
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

      // Get the clicked element
      const target = event.target;
      
      // If a letter color radio was clicked, update the swatch styling
      if (target && target.name === 'properties[Letter Color]') {
        // Remove shadow from all color swatches
        this.colorOptions.forEach(option => {
          const swatch = option.closest('label').querySelector('span:last-of-type');
          swatch.style.boxShadow = 'none';
        });

        // Add shadow to selected swatch
        const selectedSwatch = target.closest('label').querySelector('span:last-of-type');
        selectedSwatch.style.boxShadow = '0px 0px 0px 2px white, 0px 0px 0px 3px black';
      }

      // If a font radio was clicked, update the font styling
      if (target && target.name === 'properties[Font Style]') {
        // Remove bold from all font options
        this.fontOptions.forEach(option => {
          option.closest('label').querySelector('span').style.fontWeight = 'normal';
          option.closest('label').style.border = '1px solid gray';
        });

        // Add bold to selected font
        const selectedFont = target.closest('label').querySelector('span');
        selectedFont.style.fontWeight = 'bold';
        selectedFont.closest('label').style.border = '1px solid black';
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
      let costOfSelectedColor = parseFloat(embroideryCost[selectedColor]) * Shopify.currency.rate;
      const currencySymbolMapping = {
        'GBP': '£',
        'USD': '$',
        'EUR': '€',
        'CAD': 'CA$',
        'AUD': 'A$',
        'INR': 'Rs.',
      }
      this.embroideryCostElement.textContent = `+${currencySymbolMapping[currencySymbol]}${costOfSelectedColor.toFixed(2)}`;
    }
  }

  customElements.define('embroidery-configurations', EmbroideryConfigurations);
} 