const DEFAULTS = {
          facebook: "https://www.facebook.com/share/18dEbL8gtP/",
          whatsapp: "https://wa.me/523535351750",
          instagram: "https://www.instagram.com/barsa_muebles/",
          email: "mailto:barsamuebles@gmail.com"
        };

        function addPhoneField() {
          const container = document.getElementById('phones-container');
          const div = document.createElement('div');
          div.className = 'input-row';
          div.innerHTML = `
      <input type="text" class="form-input phone-input" placeholder="+52 000 000 0000">
      <button class="icon-btn danger" onclick="removePhoneField(this)">
        <i class="fas fa-trash"></i>
      </button>
    `;
          container.appendChild(div);
        }

        function removePhoneField(btn) {
          btn.closest('.input-row').remove();
        }

        function addLocationField() {
          const container = document.getElementById('locations-container');
          const div = document.createElement('div');
          div.className = 'input-row';
          div.innerHTML = `
      <textarea class="form-input location-input" placeholder="Av. Principal #123, Ciudad"></textarea>
      <button class="icon-btn danger" onclick="removeLocationField(this)">
        <i class="fas fa-trash"></i>
      </button>
    `;
          container.appendChild(div);
        }

        function removeLocationField(btn) {
          btn.closest('.input-row').remove();
        }

        function guardarFooter() {
          const facebookValue = document.getElementById('facebook').value.trim() || DEFAULTS.facebook;
          const whatsappValue = document.getElementById('whatsapp').value.trim() || DEFAULTS.whatsapp;
          const instagramValue = document.getElementById('instagram').value.trim() || DEFAULTS.instagram;
          const emailValue = document.getElementById('envelope').value.trim() || DEFAULTS.email;

          const footerData = {
            email: document.getElementById('admin-email').value,
            phones: Array.from(document.querySelectorAll('.phone-input')).map(input => input.value),
            locations: Array.from(document.querySelectorAll('.location-input')).map(textarea => textarea.value),
            socials: {
              facebook: facebookValue,
              whatsapp: whatsappValue,
              instagram: instagramValue,
              email: emailValue
            }
          };

          localStorage.setItem('footerData', JSON.stringify(footerData));
          alert('Configuración guardada exitosamente!');
        }

        function cargarFooter() {
          const data = JSON.parse(localStorage.getItem('footerData'));
          if (!data) return;

          document.getElementById('admin-email').value = data.email || '';

          const phonesContainer = document.getElementById('phones-container');
          phonesContainer.innerHTML = '';
          data.phones.forEach(phone => {
            const div = document.createElement('div');
            div.className = 'input-row';
            div.innerHTML = `
        <input type="text" class="form-input phone-input" value="${phone}">
        <button class="icon-btn danger" onclick="removePhoneField(this)">
          <i class="fas fa-trash"></i>
        </button>
      `;
            phonesContainer.appendChild(div);
          });

          const locationsContainer = document.getElementById('locations-container');
          locationsContainer.innerHTML = '';
          data.locations.forEach(loc => {
            const div = document.createElement('div');
            div.className = 'input-row';
            div.innerHTML = `
        <textarea class="form-input location-input">${loc}</textarea>
        <button class="icon-btn danger" onclick="removeLocationField(this)">
          <i class="fas fa-trash"></i>
        </button>
      `;
            locationsContainer.appendChild(div);
          });

          document.getElementById('facebook').value = data.socials.facebook || DEFAULTS.facebook;
          document.getElementById('whatsapp').value = data.socials.whatsapp || DEFAULTS.whatsapp;
          document.getElementById('instagram').value = data.socials.instagram || DEFAULTS.instagram;
          document.getElementById('envelope').value = data.socials.email || DEFAULTS.email;
        }

        window.onload = cargarFooter;