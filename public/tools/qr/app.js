        // QR Code Generator App
        class LilQRApp {
            constructor() {
                this.currentType = 'url';
                this.qrTypes = {
                    url: { name: 'URL', primary: true },
                    text: { name: 'Text', primary: true },
                    email: { name: 'Email', primary: true },
                    phone: { name: 'Phone', primary: true },
                    sms: { name: 'SMS', primary: true },
                    wifi: { name: 'WiFi', primary: true },
                    vcard: { name: 'vCard', primary: true },
                    mecard: { name: 'meCard', primary: true },
                    location: { name: 'Location', primary: true },
                    event: { name: 'Event', primary: true },
                    bitcoin: { name: 'Bitcoin', primary: true }
                };
                
                this.init();
            }

            init() {
                this.renderTabs();
                this.renderForm();
                this.attachEventListeners();
                // this.toggleLogoSection(); // Logo section visibility removed
            }

            renderTabs() {
                const tabContainer = document.getElementById('tab-container');
                
                // Render all tabs as primary tabs
                const allTabs = Object.entries(this.qrTypes);
                
                tabContainer.innerHTML = allTabs.map(([key, config]) => 
                    `<button type="button" class="tab-btn ${key === this.currentType ? 'tab-active' : 'tab-inactive'} px-3 py-2 rounded-lg font-medium text-sm transition-colors duration-200" data-type="${key}">
                        ${config.name}
                    </button>`
                ).join('');
            }

            renderForm() {
                const form = document.getElementById('qr-form');
                const utmSection = document.getElementById('utm-section');
                
                // Hide UTM section by default
                utmSection.classList.add('hidden');
                
                // Generate form fields based on current type
                let fields = this.getFieldsForType(this.currentType);
                
                form.innerHTML = fields.map(field => {
                    if (field.type === 'group') {
                        return `
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">${field.label}</label>
                                <div class="flex gap-2">
                                    ${field.fields.map(subField => {
                                        if (subField.type === 'select') {
                                            return `
                                                <select id="${subField.id}" class="${subField.style || 'w-full'} px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" ${subField.required ? 'required' : ''}>
                                                    ${subField.options.map(option => `<option value="${option.value}">${option.label}</option>`).join('')}
                                                </select>
                                            `;
                                        } else if (subField.type === 'textarea') {
                                            return `
                                                <textarea id="${subField.id}" rows="3" class="${subField.style || 'w-full'} px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="${subField.placeholder || ''}" ${subField.required ? 'required' : ''}></textarea>
                                            `;
                                        } else if (subField.type === 'button') {
                                            return `
                                                <button type="button" id="${subField.id}" class="${subField.style || 'px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'}">
                                                    ${subField.text || 'Button'}
                                                </button>
                                            `;
                                        } else {
                                            return `
                                                <input type="${subField.type}" id="${subField.id}" class="${subField.style || 'w-full'} px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="${subField.placeholder || ''}" ${subField.required ? 'required' : ''} ${subField.readonly ? 'readonly' : ''}">
                                            `;
                                        }
                                    }).join('')}
                                </div>
                            </div>
                        `;
                    } else if (field.type === 'select') {
                        return `
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">${field.label}</label>
                                <select id="${field.id}" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" ${field.required ? 'required' : ''}>
                                    ${field.options.map(option => `<option value="${option.value}">${option.label}</option>`).join('')}
                                </select>
                            </div>
                        `;
                    } else if (field.type === 'textarea') {
                        return `
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">${field.label}</label>
                                <textarea id="${field.id}" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="${field.placeholder || ''}" ${field.required ? 'required' : ''}></textarea>
                            </div>
                        `;
                    } else if (field.type === 'button') {
                        return `
                            <div>
                                ${field.label ? `<label class="block text-sm font-medium text-gray-700 mb-1">${field.label}</label>` : ''}
                                <button type="button" id="${field.id}" class="${field.style || 'w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'}">
                                    ${field.text || 'Button'}
                                </button>
                            </div>
                        `;
                    } else {
                        return `
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">${field.label}</label>
                                <input type="${field.type}" id="${field.id}" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="${field.placeholder || ''}" ${field.required ? 'required' : ''} ${field.min ? `min="${field.min}"` : ''} ${field.step ? `step="${field.step}"` : ''}>
                            </div>
                        `;
                    }
                }).join('');

                // Show UTM section for URL-based types
                if (['url'].includes(this.currentType)) {
                    utmSection.classList.remove('hidden');
                }
            }

            getFieldsForType(type) {
                const fieldConfigs = {
                    url: [
                        { type: 'url', id: 'url', label: 'Website URL', placeholder: 'https://example.com', required: true }
                    ],
                    text: [
                        { type: 'textarea', id: 'text', label: 'Text Content', placeholder: 'Enter your text here...', required: true }
                    ],
                    email: [
                        { type: 'email', id: 'email', label: 'Email Address', placeholder: 'someone@example.com', required: true },
                        { type: 'text', id: 'subject', label: 'Subject', placeholder: 'Email subject' },
                        { type: 'textarea', id: 'body', label: 'Message Body', placeholder: 'Email message...' }
                    ],
                    phone: [
                        { type: 'tel', id: 'phone', label: 'Phone Number', placeholder: '+1234567890', required: true }
                    ],
                    sms: [
                        { type: 'tel', id: 'sms-phone', label: 'Phone Number', placeholder: '+1234567890', required: true },
                        { type: 'textarea', id: 'sms-message', label: 'Message', placeholder: 'SMS message...' }
                    ],
                    wifi: [
                        { type: 'text', id: 'wifi-ssid', label: 'Network Name (SSID)', placeholder: 'My WiFi Network', required: true },
                        { type: 'password', id: 'wifi-password', label: 'Password', placeholder: 'WiFi password' },
                        { 
                            type: 'select', 
                            id: 'wifi-security', 
                            label: 'Security Type', 
                            options: [
                                { value: 'WPA', label: 'WPA/WPA2' },
                                { value: 'WEP', label: 'WEP' },
                                { value: 'nopass', label: 'Open (No Password)' }
                            ]
                        },
                        { 
                            type: 'select', 
                            id: 'wifi-hidden', 
                            label: 'Hidden Network', 
                            options: [
                                { value: 'false', label: 'No' },
                                { value: 'true', label: 'Yes' }
                            ]
                        }
                    ],
                    vcard: [
                        { type: 'text', id: 'vcard-firstname', label: 'First Name', placeholder: 'John', required: true },
                        { type: 'text', id: 'vcard-lastname', label: 'Last Name', placeholder: 'Doe' },
                        { type: 'text', id: 'vcard-organization', label: 'Organization', placeholder: 'Company Name' },
                        { type: 'text', id: 'vcard-title', label: 'Job Title', placeholder: 'CEO' },
                        { 
                            type: 'group', 
                            label: 'Phone', 
                            fields: [
                                { type: 'tel', id: 'vcard-phone', placeholder: '+1234567890', style: 'flex-1' },
                                { 
                                    type: 'select', 
                                    id: 'vcard-phone-type', 
                                    options: [
                                        { value: 'CELL', label: 'Mobile' },
                                        { value: 'WORK', label: 'Work' },
                                        { value: 'HOME', label: 'Home' },
                                        { value: 'MAIN', label: 'Main' }
                                    ],
                                    style: 'w-24'
                                }
                            ]
                        },
                        { 
                            type: 'group', 
                            label: 'Email', 
                            fields: [
                                { type: 'email', id: 'vcard-email', placeholder: 'john@example.com', style: 'flex-1' },
                                { 
                                    type: 'select', 
                                    id: 'vcard-email-type', 
                                    options: [
                                        { value: 'HOME', label: 'Home' },
                                        { value: 'WORK', label: 'Work' }
                                    ],
                                    style: 'w-20'
                                }
                            ]
                        },
                        { type: 'url', id: 'vcard-website', label: 'Website', placeholder: 'https://example.com' },
                        { 
                            type: 'group', 
                            label: 'Address', 
                            fields: [
                                { type: 'textarea', id: 'vcard-address', placeholder: '123 Main St, City, State 12345', style: 'flex-1' },
                                { 
                                    type: 'select', 
                                    id: 'vcard-address-type', 
                                    options: [
                                        { value: 'HOME', label: 'Home' },
                                        { value: 'WORK', label: 'Work' }
                                    ],
                                    style: 'w-20'
                                }
                            ]
                        }
                    ],
                    mecard: [
                        { type: 'text', id: 'mecard-name', label: 'Full Name', placeholder: 'John Doe', required: true },
                        { type: 'tel', id: 'mecard-phone', label: 'Phone', placeholder: '+1234567890' },
                        { type: 'email', id: 'mecard-email', label: 'Email', placeholder: 'john@example.com' },
                        { type: 'url', id: 'mecard-website', label: 'Website', placeholder: 'https://example.com' },
                        { type: 'text', id: 'mecard-nickname', label: 'Nickname', placeholder: 'Johnny' }
                    ],
                    location: [
                        { type: 'text', id: 'address', label: 'Address', placeholder: '1600 Amphitheatre Pkwy, Mountain View, CA', required: true },
                        { type: 'button', id: 'geocode-btn', label: '', text: 'Get Coordinates', style: 'w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium' },
                        { 
                            type: 'group', 
                            label: 'Coordinates (Auto-filled)', 
                            fields: [
                                { type: 'number', id: 'latitude', placeholder: 'Latitude', step: 'any', style: 'flex-1', readonly: true },
                                { type: 'number', id: 'longitude', placeholder: 'Longitude', step: 'any', style: 'flex-1', readonly: true }
                            ]
                        }
                    ],
                    event: [
                        { type: 'text', id: 'event-title', label: 'Event Title', placeholder: 'Conference 2025', required: true },
                        { type: 'datetime-local', id: 'event-start', label: 'Start Date & Time', required: true, min: new Date().toISOString().slice(0, 16) },
                        { type: 'datetime-local', id: 'event-end', label: 'End Date & Time', min: new Date().toISOString().slice(0, 16) },
                        { type: 'text', id: 'event-location', label: 'Location', placeholder: 'Convention Center' },
                        { type: 'textarea', id: 'event-description', label: 'Description', placeholder: 'Event details...' }
                    ],
                    bitcoin: [
                        { type: 'text', id: 'bitcoin-address', label: 'Bitcoin Address', placeholder: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', required: true },
                        { type: 'number', id: 'bitcoin-amount', label: 'Amount (BTC)', placeholder: '0.001', step: '0.00000001' },
                        { type: 'text', id: 'bitcoin-label', label: 'Label', placeholder: 'Payment for...' },
                        { type: 'text', id: 'bitcoin-message', label: 'Message', placeholder: 'Thank you!' }
                    ],
                };

                return fieldConfigs[type] || [];
            }

            validateEventDates() {
                // Skip validation if not on event tab
                if (this.currentType !== 'event') {
                    return true;
                }

                const startInput = document.getElementById('event-start');
                const endInput = document.getElementById('event-end');
                
                if (!startInput || !endInput) {
                    return true;
                }

                const startValue = startInput.value;
                const endValue = endInput.value;
                
                // If both values exist, ensure end is after start
                if (startValue && endValue) {
                    const startDate = new Date(startValue);
                    const endDate = new Date(endValue);
                    
                    if (endDate <= startDate) {
                        alert('End date must be after start date');
                        return false;
                    }
                }

                return true;
            }

            async geocodeAddress() {
                const addressInput = document.getElementById('address');
                const latInput = document.getElementById('latitude');
                const lngInput = document.getElementById('longitude');
                const geocodeBtn = document.getElementById('geocode-btn');
                
                const address = addressInput?.value;
                if (!address) {
                    alert('Please enter an address first');
                    return;
                }

                geocodeBtn.textContent = 'Loading...';
                geocodeBtn.disabled = true;

                try {
                    // Use OpenStreetMap Nominatim API (free, no key required)
                    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`);
                    const data = await response.json();
                    
                    if (data && data.length > 0) {
                        const result = data[0];
                        latInput.value = parseFloat(result.lat).toFixed(6);
                        lngInput.value = parseFloat(result.lon).toFixed(6);
                        
                        // Show success feedback
                        geocodeBtn.textContent = 'Found!';
                        geocodeBtn.classList.remove('bg-green-600', 'hover:bg-green-700');
                        geocodeBtn.classList.add('bg-green-500');
                        
                        setTimeout(() => {
                            geocodeBtn.textContent = 'Get Coordinates';
                            geocodeBtn.classList.remove('bg-green-500');
                            geocodeBtn.classList.add('bg-green-600', 'hover:bg-green-700');
                        }, 2000);
                    } else {
                        alert('Address not found. Please try a different address.');
                    }
                } catch (error) {
                    console.error('Geocoding error:', error);
                    alert('Failed to find coordinates. Please try again.');
                } finally {
                    geocodeBtn.disabled = false;
                    if (geocodeBtn.textContent === 'Loading...') {
                        geocodeBtn.textContent = 'Get Coordinates';
                    }
                }
            }

            attachEventListeners() {
                // Tab switching
                document.addEventListener('click', (e) => {
                    if (e.target.classList.contains('tab-btn')) {
                        const newType = e.target.dataset.type;
                        if (newType && newType !== this.currentType) {
                            this.currentType = newType;
                            this.renderTabs();
                            this.renderForm();
                            
                            // Clear the preview when switching tabs
                            document.getElementById('qr-preview').innerHTML = `
                                <div class="text-gray-500">
                                    <svg class="mx-auto h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"/>
                                    </svg>
                                    <p>Click "Generate QR Code" to create preview</p>
                                </div>
                            `;
                            
                        }
                    }
                });


                // Generate button
                document.getElementById('generate-btn').addEventListener('click', () => {
                    // Only validate event dates for event type QR codes
                    if (this.currentType === 'event' && !this.validateEventDates()) {
                        return;
                    }
                    this.generateQR();
                });

                // Event date validation
                document.addEventListener('change', (e) => {
                    if (e.target.id === 'event-start' || e.target.id === 'event-end') {
                        this.validateEventDates();
                    }
                });

                // Geocoding button
                document.addEventListener('click', (e) => {
                    if (e.target.id === 'geocode-btn') {
                        this.geocodeAddress();
                    }
                });

                // Logo upload functionality removed

                // Action buttons
                const resetBtn = document.getElementById('reset-btn');
                const downloadBtn = document.getElementById('download-btn');
                
                if (resetBtn) {
                    resetBtn.addEventListener('click', () => {
                        this.resetForm();
                    });
                }

                if (downloadBtn) {
                    downloadBtn.addEventListener('click', () => {
                        this.downloadQR();
                    });
                } else {
                    console.error('Download button not found');
                }
            }

            toggleLogoSection() {
                // Logo functionality has been removed - this method is kept for compatibility
                return;
            }

            handleLogoUpload(file) {
                // Logo functionality has been removed
                console.log('Logo upload functionality is not available');
            }

            removeLogo() {
                // Logo functionality has been removed
                console.log('Logo removal functionality is not available');
            }

            buildQRData() {
                const type = this.currentType;
                let qrData = '';

                // Helper function to safely get element value
                const getElementValue = (id) => {
                    const element = document.getElementById(id);
                    return element ? element.value.trim() : '';
                };

                switch (type) {
                    case 'url':
                        qrData = this.buildUrlWithUTM(getElementValue('url'));
                        break;
                    
                    case 'text':
                        qrData = getElementValue('text');
                        break;
                    
                    case 'email':
                        const email = getElementValue('email');
                        const subject = getElementValue('subject');
                        const body = getElementValue('body');
                        if (email) {
                            qrData = `mailto:${email}`;
                            const params = [];
                            if (subject && subject.trim()) params.push(`subject=${encodeURIComponent(subject.trim())}`);
                            if (body && body.trim()) params.push(`body=${encodeURIComponent(body.trim())}`);
                            if (params.length > 0) qrData += `?${params.join('&')}`;
                        }
                        break;
                    
                    case 'phone':
                        const phoneNumber = getElementValue('phone');
                        if (phoneNumber) {
                            qrData = `tel:${phoneNumber}`;
                        }
                        break;
                    
                    case 'sms':
                        const smsPhone = getElementValue('sms-phone');
                        const smsMessage = getElementValue('sms-message');
                        if (smsPhone) {
                            qrData = `sms:${smsPhone}`;
                            if (smsMessage) qrData += `?body=${encodeURIComponent(smsMessage)}`;
                        }
                        break;
                    
                    case 'wifi':
                        const ssid = getElementValue('wifi-ssid');
                        const password = getElementValue('wifi-password');
                        const security = getElementValue('wifi-security');
                        const hidden = getElementValue('wifi-hidden');
                        if (ssid) {
                            qrData = `WIFI:T:${security};S:${ssid};P:${password};H:${hidden};;`;
                        }
                        break;
                    
                    case 'vcard':
                        const firstName = getElementValue('vcard-firstname');
                        const lastName = getElementValue('vcard-lastname');
                        const org = getElementValue('vcard-organization');
                        const title = getElementValue('vcard-title');
                        const vcardPhone = getElementValue('vcard-phone');
                        const vcardPhoneType = getElementValue('vcard-phone-type') || 'CELL';
                        const vcardEmail = getElementValue('vcard-email');
                        const vcardEmailType = getElementValue('vcard-email-type') || 'HOME';
                        const website = getElementValue('vcard-website');
                        const address = getElementValue('vcard-address');
                        const addressType = getElementValue('vcard-address-type') || 'HOME';
                        
                        if (firstName || lastName) {
                            qrData = 'BEGIN:VCARD\nVERSION:3.0\n';
                            qrData += `FN:${firstName} ${lastName}\n`;
                            if (org) qrData += `ORG:${org}\n`;
                            if (title) qrData += `TITLE:${title}\n`;
                            if (vcardPhone) qrData += `TEL;TYPE=${vcardPhoneType}:${vcardPhone}\n`;
                            if (vcardEmail) qrData += `EMAIL;TYPE=${vcardEmailType}:${vcardEmail}\n`;
                            if (website) qrData += `URL:${website}\n`;
                            if (address) qrData += `ADR;TYPE=${addressType}:;;${address};;;;\n`;
                            qrData += 'END:VCARD';
                        }
                        break;
                    
                    case 'mecard':
                        const mecardName = getElementValue('mecard-name');
                        const mecardPhone = getElementValue('mecard-phone');
                        const mecardEmail = getElementValue('mecard-email');
                        const mecardWebsite = getElementValue('mecard-website');
                        const mecardNickname = getElementValue('mecard-nickname');
                        
                        if (mecardName) {
                            qrData = `MECARD:N:${mecardName}`;
                            if (mecardPhone) qrData += `;TEL:${mecardPhone}`;
                            if (mecardEmail) qrData += `;EMAIL:${mecardEmail}`;
                            if (mecardWebsite) qrData += `;URL:${mecardWebsite}`;
                            if (mecardNickname) qrData += `;NICKNAME:${mecardNickname}`;
                            qrData += ';;';
                        }
                        break;
                    
                    case 'location':
                        const lat = getElementValue('latitude');
                        const lng = getElementValue('longitude');
                        const query = getElementValue('location-query');
                        if (lat && lng) {
                            if (query) {
                                qrData = `geo:${lat},${lng}?q=${encodeURIComponent(query)}`;
                            } else {
                                qrData = `geo:${lat},${lng}`;
                            }
                        }
                        break;
                    
                    
                    case 'event':
                        const eventTitle = getElementValue('event-title');
                        const eventStart = getElementValue('event-start');
                        const eventEnd = getElementValue('event-end');
                        const eventLocation = getElementValue('event-location');
                        const eventDescription = getElementValue('event-description');
                        
                        if (eventTitle) {
                            qrData = 'BEGIN:VEVENT\n';
                            qrData += `SUMMARY:${eventTitle}\n`;
                            if (eventStart) qrData += `DTSTART:${new Date(eventStart).toISOString().replace(/[-:]/g, '').split('.')[0]}Z\n`;
                            if (eventEnd) qrData += `DTEND:${new Date(eventEnd).toISOString().replace(/[-:]/g, '').split('.')[0]}Z\n`;
                            if (eventLocation) qrData += `LOCATION:${eventLocation}\n`;
                            if (eventDescription) qrData += `DESCRIPTION:${eventDescription}\n`;
                            qrData += 'END:VEVENT';
                        }
                        break;
                    
                    case 'bitcoin':
                        const bitcoinAddress = getElementValue('bitcoin-address');
                        const amount = getElementValue('bitcoin-amount');
                        const label = getElementValue('bitcoin-label');
                        const message = getElementValue('bitcoin-message');
                        
                        if (bitcoinAddress) {
                            qrData = `bitcoin:${bitcoinAddress}`;
                            const btcParams = [];
                            if (amount) btcParams.push(`amount=${amount}`);
                            if (label) btcParams.push(`label=${encodeURIComponent(label)}`);
                            if (message) btcParams.push(`message=${encodeURIComponent(message)}`);
                            if (btcParams.length > 0) qrData += `?${btcParams.join('&')}`;
                        }
                        break;
                    
                }

                return qrData;
            }


            buildUrlWithUTM(baseUrl) {
                if (!baseUrl) return '';
                
                const utmSource = document.getElementById('utm-source')?.value;
                const utmMedium = document.getElementById('utm-medium')?.value;
                const utmCampaign = document.getElementById('utm-campaign')?.value;
                const utmTerm = document.getElementById('utm-term')?.value;
                const utmContent = document.getElementById('utm-content')?.value;
                
                const utmParams = [];
                if (utmSource) utmParams.push(`utm_source=${encodeURIComponent(utmSource)}`);
                if (utmMedium) utmParams.push(`utm_medium=${encodeURIComponent(utmMedium)}`);
                if (utmCampaign) utmParams.push(`utm_campaign=${encodeURIComponent(utmCampaign)}`);
                if (utmTerm) utmParams.push(`utm_term=${encodeURIComponent(utmTerm)}`);
                if (utmContent) utmParams.push(`utm_content=${encodeURIComponent(utmContent)}`);
                
                if (utmParams.length === 0) return baseUrl;
                
                const separator = baseUrl.includes('?') ? '&' : '?';
                return `${baseUrl}${separator}${utmParams.join('&')}`;
            }

            async generateQR() {
                console.log('Starting QR generation...');
                
                try {
                    // QRCode should always be available now
                    if (typeof QRCode === 'undefined') {
                        throw new Error('QRCode generator not available');
                    }
                    console.log('QRCode generator is available');
                    
                    const qrData = this.buildQRData();
                    console.log('QR Data for generation:', qrData, 'Type:', this.currentType);
                    
                    if (!qrData.trim()) {
                        console.log('No QR data provided');
                        document.getElementById('qr-preview').innerHTML = `
                            <div class="text-gray-500">
                                <svg class="mx-auto h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"/>
                                </svg>
                                <p>Enter data to generate QR code</p>
                            </div>
                        `;
                        document.getElementById('download-btn').disabled = true;
                        return;
                    }

                    const marginEl = document.getElementById('margin');
                    const fgColorEl = document.getElementById('fg-color');
                    const bgColorEl = document.getElementById('bg-color');
                    
                    if (!marginEl || !fgColorEl || !bgColorEl) {
                        console.error('Missing customization elements');
                        throw new Error('Missing customization elements');
                    }
                    
                    const options = {
                        width: 300,
                        margin: parseInt(marginEl.value) || 3,
                        color: {
                            dark: fgColorEl.value || '#000000',
                            light: bgColorEl.value || '#FFFFFF'
                        }
                    };

                    console.log('QR generation options:', options);
                    console.log('About to call QRCode.toCanvas...');

                    // Generate QR code canvas
                    console.log('About to create QR code...');
                    
                    // Clear the preview area first
                    const previewEl = document.getElementById('qr-preview');
                    previewEl.innerHTML = '';
                    
                    // Create a temporary div for the QR code generation
                    const tempDiv = document.createElement('div');
                    tempDiv.style.position = 'absolute';
                    tempDiv.style.left = '-9999px';
                    // Safely append to body with null check
                    if (!document.body) {
                        console.error('document.body not available for temp QR generation');
                        return;
                    }
                    document.body.appendChild(tempDiv);
                    
                    // Use the QRCode library to generate into temp div
                    const qr = new QRCode(tempDiv, {
                        text: qrData,
                        width: options.width || 300,
                        height: options.width || 300,
                        colorDark: options.color?.dark || '#000000',
                        colorLight: options.color?.light || '#ffffff',
                        correctLevel: QRCode.CorrectLevel.M
                    });
                    
                    // Wait a moment for QR code to render, then extract canvas
                    setTimeout(() => {
                        try {
                            const generatedCanvas = tempDiv.querySelector('canvas');
                            if (generatedCanvas && qr && qr._oQRCode) {
                                // Get actual module count from the QR code instance
                                const moduleCount = qr._oQRCode.getModuleCount();
                                console.log('QR module count:', moduleCount);
                                
                                // Map margin select values to module units
                                const marginValue = parseInt(marginEl.value) || 2;
                                let marginModules;
                                switch(marginValue) {
                                    case 1: marginModules = 2; break;  // Small
                                    case 2: marginModules = 4; break;  // Medium
                                    case 3: marginModules = 6; break;  // Large
                                    case 4: marginModules = 8; break;  // Extra Large
                                    default: marginModules = 4; break;
                                }
                                
                                // Add quiet zone (margins) to the canvas with accurate module calculation
                                const marginizedCanvas = this.addQuietZoneAccurate(
                                    generatedCanvas, 
                                    marginModules,
                                    moduleCount,
                                    options.color?.light || '#ffffff'
                                );
                                
                                // Display the marginized canvas in preview
                                previewEl.appendChild(marginizedCanvas);
                                
                                // Store reference for download
                                this.currentCanvas = marginizedCanvas;
                                
                                console.log('QR code generated successfully with margins');
                                document.getElementById('download-btn').disabled = false;
                            } else {
                                throw new Error('Failed to generate QR code canvas or get module count');
                            }
                        } catch (error) {
                            console.error('Error adding margins to QR code:', error);
                            // Fallback: just move the original generated QR code
                            const generatedCanvas = tempDiv.querySelector('canvas');
                            if (generatedCanvas) {
                                previewEl.appendChild(generatedCanvas.cloneNode(true));
                                this.currentCanvas = generatedCanvas.cloneNode(true);
                                document.getElementById('download-btn').disabled = false;
                            }
                        } finally {
                            // Clean up temp div
                            if (tempDiv && tempDiv.parentNode) {
                                tempDiv.parentNode.removeChild(tempDiv);
                            }
                        }
                    }, 100);

                } catch (error) {
                    console.error('Error generating QR code:', error);
                    console.error('Error type:', typeof error);
                    console.error('Error name:', error.name);
                    console.error('Error message:', error.message);
                    console.error('Error stack:', error.stack);
                    
                    let errorMessage = 'Unknown error occurred';
                    if (error && error.message) {
                        errorMessage = error.message;
                    } else if (typeof error === 'string') {
                        errorMessage = error;
                    } else {
                        errorMessage = 'QR code generation failed - check if data is valid';
                    }
                    
                    document.getElementById('qr-preview').innerHTML = `
                        <div class="text-red-500">
                            <svg class="mx-auto h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            <p>Error generating QR code</p>
                            <p class="text-sm">${errorMessage}</p>
                            <p class="text-xs text-gray-500 mt-2">Check browser console for details</p>
                        </div>
                    `;
                    document.getElementById('download-btn').disabled = true;
                }
            }

            addQuietZoneAccurate(srcCanvas, marginModules, actualModuleCount, bgColor) {
                // Calculate accurate module size using actual QR module count
                const moduleSize = Math.floor(srcCanvas.width / actualModuleCount);
                const marginPx = marginModules * moduleSize;
                
                // Create a new canvas with margins
                const outCanvas = document.createElement('canvas');
                const outCtx = outCanvas.getContext('2d');
                
                // Size the output canvas to include margins
                outCanvas.width = srcCanvas.width + 2 * marginPx;
                outCanvas.height = srcCanvas.height + 2 * marginPx;
                
                // Fill with background color (quiet zone)
                outCtx.fillStyle = bgColor;
                outCtx.fillRect(0, 0, outCanvas.width, outCanvas.height);
                
                // Draw the original QR code centered in the new canvas
                outCtx.drawImage(srcCanvas, marginPx, marginPx);
                
                console.log('Added accurate quiet zone:', { 
                    srcSize: srcCanvas.width, 
                    moduleCount: actualModuleCount, 
                    moduleSize: moduleSize,
                    marginModules: marginModules,
                    marginPx: marginPx, 
                    finalSize: outCanvas.width 
                });
                return outCanvas;
            }

            // Keep legacy function for fallback
            addQuietZone(srcCanvas, marginModules, bgColor) {
                // Fallback for when module count is not available
                const approximateModules = 25;
                const moduleSize = Math.max(1, Math.floor(srcCanvas.width / approximateModules));
                const marginPx = marginModules * moduleSize;
                
                const outCanvas = document.createElement('canvas');
                const outCtx = outCanvas.getContext('2d');
                
                outCanvas.width = srcCanvas.width + 2 * marginPx;
                outCanvas.height = srcCanvas.height + 2 * marginPx;
                
                outCtx.fillStyle = bgColor;
                outCtx.fillRect(0, 0, outCanvas.width, outCanvas.height);
                outCtx.drawImage(srcCanvas, marginPx, marginPx);
                
                return outCanvas;
            }

            // Build a human-friendly bit of the QR's content to put in the
            // download filename, so a saved QR is identifiable at a glance.
            getDownloadDescriptor() {
                const type = this.currentType;
                const v = (id) => { const el = document.getElementById(id); return el ? el.value.trim() : ''; };
                const clip = (s, n) => (s || '').slice(0, n);
                switch (type) {
                    case 'url': {
                        const u = v('url').replace(/^https?:\/\//i, '').replace(/^www\./i, '');
                        return clip(u, 30);
                    }
                    case 'text': return clip(v('text'), 30);
                    case 'email': return v('email');
                    case 'phone': return v('phone') ? `${v('phone')}-phone` : '';
                    case 'sms': return v('sms-phone') ? `${v('sms-phone')}-sms` : '';
                    case 'wifi': return v('wifi-ssid') ? `${v('wifi-ssid')}-wifi` : '';
                    case 'vcard': {
                        const name = `${v('vcard-firstname')} ${v('vcard-lastname')}`.trim();
                        return name ? `${name}-vcard` : '';
                    }
                    case 'mecard': return v('mecard-name') ? `${v('mecard-name')}-mecard` : '';
                    case 'location': {
                        const q = v('location-query') || [v('latitude'), v('longitude')].filter(Boolean).join(',');
                        return q ? `${q}-location` : '';
                    }
                    case 'event': return v('event-title') ? `${v('event-title')}-event` : '';
                    case 'bitcoin': return v('bitcoin-address') ? `${clip(v('bitcoin-address'), 20)}-bitcoin` : '';
                    default: return '';
                }
            }

            // Keep filename-safe characters only (allow @ . _ - for emails/urls).
            slugifyForFilename(s) {
                return (s || '')
                    .trim()
                    .replace(/[^a-z0-9@._-]+/gi, '-')
                    .replace(/-{2,}/g, '-')
                    .replace(/^[-._]+|[-._]+$/g, '')
                    .slice(0, 60);
            }

            async downloadQR() {
                console.log('Download QR button clicked');
                
                if (!this.currentCanvas) {
                    alert('Please generate a QR code first');
                    return;
                }

                const format = document.getElementById('export-format').value;
                const size = parseInt(document.getElementById('export-size').value);
                const date = new Date().toISOString().split('T')[0];
                const descriptor = this.slugifyForFilename(this.getDownloadDescriptor());
                const filename = descriptor
                    ? `lilQR-${descriptor}.${format}`
                    : `lilQR-${this.qrTypes[this.currentType].name}-${date}.${format}`;

                console.log('Download settings:', { format, size, filename });

                try {
                    let downloadCanvas = this.currentCanvas;
                    
                    // If size is different from current canvas, scale it
                    if (size && size !== this.currentCanvas.width) {
                        console.log('Scaling canvas for download');
                        downloadCanvas = document.createElement('canvas');
                        const ctx = downloadCanvas.getContext('2d');
                        downloadCanvas.width = size;
                        downloadCanvas.height = size;
                        
                        // Use nearest-neighbor scaling for crisp edges
                        ctx.imageSmoothingEnabled = false;
                        ctx.drawImage(this.currentCanvas, 0, 0, size, size);
                    }

                    if (format === 'svg') {
                        console.log('Processing SVG download');
                        const canvasData = downloadCanvas.toDataURL('image/png');
                        const svgString = `<svg width="${downloadCanvas.width}" height="${downloadCanvas.height}" xmlns="http://www.w3.org/2000/svg">
                            <image href="${canvasData}" width="${downloadCanvas.width}" height="${downloadCanvas.height}"/>
                        </svg>`;
                        
                        const blob = new Blob([svgString], { type: 'image/svg+xml' });
                        console.log('SVG blob created, initiating download');
                        this.downloadBlob(blob, filename);
                    } else {
                        console.log('Processing PNG download');
                        if (downloadCanvas.toBlob) {
                            downloadCanvas.toBlob((blob) => {
                                if (blob) {
                                    this.downloadBlob(blob, filename);
                                } else {
                                    this.downloadDataURL(downloadCanvas.toDataURL('image/png'), filename);
                                }
                            }, 'image/png');
                        } else {
                            this.downloadDataURL(downloadCanvas.toDataURL('image/png'), filename);
                        }
                    }
                } catch (error) {
                    console.error('Error downloading QR code:', error);
                    alert('Error downloading QR code: ' + error.message);
                }
            }

            downloadBlob(blob, filename) {
                console.log('downloadBlob called with:', { blobSize: blob.size, filename });
                
                // Mobile-friendly download approach
                const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                console.log('Device detection:', { isMobile, userAgent: navigator.userAgent });
                
                if (isMobile) {
                    console.log('Using mobile download approach');
                    // For mobile devices, open the image in a new window/tab
                    const url = URL.createObjectURL(blob);
                    const newWindow = window.open(url, '_blank');
                    
                    if (newWindow) {
                        console.log('Mobile: Opened new window successfully');
                        // Show instructions to user
                        this.showNotification('Tap and hold the image, then select "Save to Photos" or "Download"');
                        
                        // Clean up after a delay
                        setTimeout(() => {
                            URL.revokeObjectURL(url);
                        }, 10000);
                    } else {
                        console.log('Mobile: Failed to open new window, trying fallback');
                        // Fallback: try the traditional method
                        this.fallbackDownload(blob, filename, url);
                    }
                } else {
                    console.log('Using desktop download approach');
                    // Desktop: use traditional download method
                    const url = URL.createObjectURL(blob);
                    console.log('Created object URL:', url);
                    
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = filename;
                    
                    console.log('Created download link:', { href: a.href, download: a.download });
                    
                    // Add click event handling to ensure it works
                    a.style.display = 'none';
                    document.body.appendChild(a);
                    
                    console.log('About to click download link');
                    // Force click
                    a.click();
                    console.log('Download link clicked');
                    
                    // Clean up
                    setTimeout(() => {
                        if (document.body.contains(a)) {
                            document.body.removeChild(a);
                        }
                        URL.revokeObjectURL(url);
                        console.log('Download cleanup completed');
                    }, 100);
                }
            }
            
            fallbackDownload(blob, filename, url) {
                try {
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = filename;
                    a.target = '_blank';
                    a.style.display = 'none';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    
                    setTimeout(() => {
                        URL.revokeObjectURL(url);
                    }, 100);
                } catch (error) {
                    console.error('Download fallback failed:', error);
                    // Last resort: show the image URL for manual save
                    this.showNotification('Download failed. Opening image in new tab - please save manually.');
                    window.open(url, '_blank');
                }
            }

            
            downloadDataURL(dataURL, filename) {
                try {
                    // Convert dataURL to blob
                    const byteString = atob(dataURL.split(',')[1]);
                    const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
                    const ab = new ArrayBuffer(byteString.length);
                    const ia = new Uint8Array(ab);
                    
                    for (let i = 0; i < byteString.length; i++) {
                        ia[i] = byteString.charCodeAt(i);
                    }
                    
                    const blob = new Blob([ab], { type: mimeString });
                    this.downloadBlob(blob, filename);
                } catch (error) {
                    console.error('DataURL conversion failed:', error);
                    // Last resort: open data URL directly
                    const newWindow = window.open();
                    if (newWindow) {
                        newWindow.document.write(`<img src="${dataURL}" alt="QR Code"/>`);
                        this.showNotification('Right-click the image and select "Save image as..."');
                    }
                }
            }




            showNotification(message) {
                // Create notification element
                const notification = document.createElement('div');
                notification.className = 'fixed top-4 left-4 right-4 md:left-auto md:right-4 md:w-auto bg-blue-500 text-white px-4 py-3 rounded-lg shadow-lg z-50 text-center md:text-left max-w-sm mx-auto md:mx-0';
                notification.textContent = message;
                
                document.body.appendChild(notification);
                
                // Remove after 5 seconds (longer for mobile users to read)
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 5000);
            }

            resetForm() {
                // Reset current type to URL
                this.currentType = 'url';
                
                // Clear logo - functionality removed
                // this.removeLogo();
                
                // Reset colors and settings
                document.getElementById('fg-color').value = '#000000';
                document.getElementById('bg-color').value = '#FFFFFF';
                document.getElementById('margin').value = '2';
                document.getElementById('export-format').value = 'png';
                document.getElementById('export-size').value = '200';
                
                // Clear UTM parameters
                ['utm-source', 'utm-medium', 'utm-campaign', 'utm-term', 'utm-content'].forEach(id => {
                    const element = document.getElementById(id);
                    if (element) element.value = '';
                });
                
                // Re-render everything
                this.renderTabs();
                this.renderForm();
                this.generateQR();
            }
        }

        // Initialize the app when the page loads
        document.addEventListener('DOMContentLoaded', () => {
            new LilQRApp();
        });

        // Service worker functionality removed to prevent blob URL errors
