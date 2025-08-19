class ClapButton extends HTMLElement {
  constructor() {
    super();
    this._connected = false;
    this._totalClaps = 0;
    this._cachedClapCount = 0;
    this._url = null;
    this._dbReady = false;
  }

  connectedCallback() {
    if (this._connected) return;

    this._url = this.getAttribute('url') || '';
    this.innerHTML = `
      <div class="clap-root">
        <div class="clap-count visually-hidden" aria-live="polite" aria-label="clap count">0</div>
        <button type="button" class="clap-shockwave" aria-label="applaud post">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" aria-hidden="true">
            <g class="flat">
              <path d="M57.0443547 6.86206897C57.6058817 6.46227795 57.7389459 5.67962382 57.3416215 5.11431557 56.9442971 4.54900731 56.1672933 4.41483804 55.6055588 4.81504702L52.4950525 7.030721C51.9335255 7.43051202 51.8004613 8.21316614 52.1977857 8.7784744 52.4404567 9.12371996 52.8251182 9.30825496 53.2153846 9.30825496 53.4640757 9.30825496 53.7152578 9.23343783 53.9338485 9.07753396L57.0443547 6.86206897z"/>
              <path d="M37.1910045 6.68944619C37.7313574 6.14566353 38.4431784 5.8737722 39.155207 5.8737722 39.967916 5.8737722 40.7808327 6.22800418 41.3380002 6.93667712 42.2214969 8.06039707 42.0666359 9.69111808 41.0600392 10.7042842L39.777765 11.9949843C39.5801407 12.1276907 39.3877061 12.2695925 39.2075193 12.430303 39.0619998 11.5985371 38.7167801 10.7954023 38.1668781 10.0961338 37.4907623 9.23636364 36.588375 8.62424242 35.5772114 8.31410658L37.1910045 6.68944619z"/>
              <path d="M49.6070811,36.8942529 L42.4182909,44.1316614 C36.2784454,50.3128527 29.8604313,55.2743992 24.2225349,56.5113898 C24.0512744,56.5492163 23.8901857,56.6217346 23.7511014,56.7293626 L20.5013032,59.2417973 C20.2908084,59.4045977 20.1673015,59.6181154 19.5026647,59.6181154 C18.8380279,59.6181154 13.0160695,55.8303982 10.3595306,53.2846814 C7.96626306,50.9912532 3.77432047,43.9549368 4.44453927,43.0079415 L6.99372621,40.0244514 C6.99469496,40.0233368 7.87570061,33.578962 9.63674317,20.6913271 C9.63674317,19.168652 10.8743859,17.922675 12.3868758,17.922675 C13.8993657,17.922675 15.1368008,19.168652 15.1368008,20.6913271 L15.2667512,25.2522466 C15.2883404,26.0100313 15.907577,26.5034483 16.5519317,26.5034483 C16.8662207,26.5034483 17.1867374,26.3857889 17.4464306,26.1245559 L32.0670972,11.4054336 C32.6074501,10.861442 33.3190635,10.5897597 34.0312997,10.5897597 C34.8440088,10.5897597 35.6569254,10.9439916 36.214093,11.6526646 C37.0975897,12.7763845 36.942521,14.4071055 35.9359243,15.4202717 L25.8641449,25.5598746 C25.3412294,26.0865204 25.3412294,26.9398119 25.8641449,27.4660397 C26.1288202,27.7324974 26.4757006,27.8658307 26.822581,27.8658307 C27.1694614,27.8658307 27.5165494,27.7324974 27.7810172,27.4660397 L40.7291431,14.43093 C41.2692884,13.8869383 41.9811094,13.615256 42.6933456,13.615256 C43.5060547,13.615465 44.3189713,13.969697 44.8761389,14.6783699 C45.7596356,15.8018809 45.6045669,17.4326019 44.5979702,18.445768 L31.7106677,31.4198537 C31.1806943,31.953605 31.1806943,32.8183908 31.7106677,33.3521421 C31.9718141,33.615047 32.31392,33.7464995 32.656441,33.7464995 C32.9985469,33.7464995 33.3408603,33.615047 33.6020067,33.3521421 L43.7346096,23.1515152 C44.2749625,22.6075235 44.9867835,22.3358412 45.6988121,22.3358412 C46.5115212,22.3358412 47.3244378,22.6900731 47.8816054,23.3989551 C48.7651021,24.522466 48.6100334,26.153187 47.6034367,27.1663532 L37.5667397,37.2708464 C37.0245185,37.8165099 37.0245185,38.7017764 37.5667397,39.2474399 C37.8334909,39.5161964 38.161896,39.6422153 38.4900934,39.6422153 C38.8184984,39.6422153 39.1469035,39.5161964 39.3972552,39.2639498 L45.6195133,32.999791 C46.1802099,32.4353187 46.93085,32.1368861 47.678999,32.1368861 C48.2741552,32.1368861 48.8676508,32.3258098 49.361919,32.7197492 C50.682182,33.7717868 50.7639719,35.7297806 49.6070811,36.8942529 Z"/>
            </g>
            <g class="outline">
              <path d="M57.1428763 6.63333333C57.6856856 6.24686869 57.8143144 5.49030303 57.4302341 4.94383838 57.0461538 4.39737374 56.2950502 4.26767677 55.7520401 4.65454545L52.7452174 6.79636364C52.202408 7.18282828 52.0737793 7.93939394 52.4578595 8.48585859 52.6924415 8.81959596 53.0642809 8.9979798 53.4415385 8.9979798 53.6819398 8.9979798 53.9247492 8.92565657 54.1360535 8.77494949L57.1428763 6.63333333z"/>
            </g>
          </svg>
        </button>
      </div>
    `;

    this._rootElement = this.querySelector('.clap-root');
    this._countElement = this.querySelector('.clap-count');
    this._clapButton = this.querySelector('button');

    this._updateRootColor();

    // Wait for db to be ready
    this._waitForDb().then(() => {
      this._fetchInitialClapCount();
      this.classList.remove('loading');
      this._countElement.classList.remove('visually-hidden');
    });

    this._clapButton.addEventListener('click', () => this._handleClap());

    this._connected = true;
  }

  disconnectedCallback() {
    this._clapButton.removeEventListener('click', () => this._handleClap());
  }

  _updateRootColor() {
    const color = this.getAttribute('color') || 'rgb(79,177,186)';
    if (this._rootElement) {
      this._rootElement.style.setProperty('--main-color', color);
    }
  }

  _waitForDb() {
    return new Promise((resolve) => {
      const checkDb = () => {
        if (window.db) {
          this._dbReady = true;
          resolve();
        } else {
          setTimeout(checkDb, 100); // Check every 100ms
        }
      };
      checkDb();
    });
  }

  async _fetchInitialClapCount() {
    if (!this._dbReady) return;
    const cleanUrl = this._url.replace(/^https?:\/\//, '');
    const docRef = window.db.collection('claps').doc(cleanUrl);
    const doc = await docRef.get();
    this._cachedClapCount = doc.exists ? doc.data().claps || 0 : 0;
    this._countElement.innerHTML = this._cachedClapCount.toLocaleString('en');
  }

  async _handleClap() {
    if (!this._dbReady || this._clapButton.hasAttribute('aria-disabled')) return;

    this.classList.add('clapped');
    setTimeout(() => this.classList.remove('clapped'), 500);

    const cleanUrl = this._url.replace(/^https?:\/\//, '');
    const docRef = window.db.collection('claps').doc(cleanUrl);
    await window.db.runTransaction(async (transaction) => {
      const doc = await transaction.get(docRef);
      const newClaps = (doc.exists ? doc.data().claps : 0) + 1;
      transaction.set(docRef, { claps: newClaps });
    });

    this._cachedClapCount += 1;
    this._countElement.innerHTML = this._cachedClapCount.toLocaleString('en');
    this.dispatchEvent(new CustomEvent('clapped', {
      bubbles: true,
      detail: { clapCount: this._cachedClapCount }
    }));

    if (this._cachedClapCount >= 10) {
      this._setClapDisabled();
    }
  }

  _setClapDisabled() {
    this._clapButton.setAttribute('aria-disabled', 'true');
    this._clapButton.setAttribute('title', 'No more claps allowed');
    this._clapButton.setAttribute('aria-description', 'No more claps allowed');
    this.classList.add('clap-limit-exceeded');
  }

  static get observedAttributes() {
    return ['color', 'url'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'color') this._updateRootColor();
    if (name === 'url' && newValue !== oldValue) {
      this._url = newValue;
      this._fetchInitialClapCount();
    }
  }
}

customElements.define('clap-button', ClapButton);

// Optional: Update existing clap-count-home elements
document.querySelectorAll('.clap-count-home').forEach(el => {
  if (!el.querySelector('clap-button')) {
    const url = el.getAttribute('data-url');
    el.innerHTML = `<clap-button url="${url.replace(/^https?:\/\//, '')}" color="rgb(79,177,186)"></clap-button>`;
  }
});