// message-box.js - Componente de notificación reutilizable
class MessageBox extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  static get observedAttributes() {
    return ['title', 'type', 'body', 'button-text'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
      this.setupEventListeners();
    }
  }

  render() {
    const title = this.getAttribute('title') || 'Notification';
    const type = this.getAttribute('type') || 'info';
    const body = this.getAttribute('body') || 'This is a notification message.';
    const buttonText = this.hasAttribute('button-text') 
      ? this.getAttribute('button-text') 
      : this.getButtonText(type);


    const styles = `
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .notification-box {
          position: fixed;
          bottom: 30px;
          right: 30px;
          width: 250px;
          height: 250px;
          border-radius: 20px;
          box-shadow: 5px 5px 20px rgba(203, 205, 211, 0.3);
          perspective: 40px;
          transform: translateX(400px) translateY(100px) scale(0.5);
          opacity: 0;
          transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), 
                      opacity 0.4s ease-out;
          z-index: 1000;
        }

        .notification-box.active {
          transform: translateX(0) translateY(0) scale(1);
          opacity: 1;
        }

        .notification-box.exiting {
          transform: translateX(400px) translateY(100px) scale(0.5);
          opacity: 0;
        }

        .success-box {
          background: linear-gradient(to bottom right, #B0DB7D 40%, #99DBB4 100%);
        }

        .error-box {
          background: linear-gradient(to bottom left, #EF8D9C 40%, #FFC39E 100%);
        }

        .info-box {
          background: linear-gradient(to bottom right, #6FB1FC 40%, #8CC0FC 100%);
        }

        .warning-box {
          background: linear-gradient(to bottom left, #FFD166 40%, #FFE4A1 100%);
        }

        h1 {
          font-size: 0.9em;
          font-weight: 100;
          letter-spacing: 3px;
          padding-top: 5px;
          color: #FCFCFC;
          padding-bottom: 5px;
          text-transform: uppercase;
          font-family: "Lato", sans-serif;
        }

        .green {
          color: rgb(77.6086956522, 192.3913043478, 124.5652173913);
        }

        .red {
          color: rgb(232.7230769231, 96.2769230769, 117.1615384615);
        }

        .blue {
          color: rgb(111, 177, 252);
        }

        .yellow {
          color: rgb(255, 209, 102);
        }

        .alert {
          font-weight: 700;
          letter-spacing: 5px;
        }

        p {
          margin-top: -5px;
          font-size: 0.5em;
          font-weight: 100;
          color: rgb(93.5, 93.5, 93.5);
          letter-spacing: 1px;
          font-family: "Lato", sans-serif;
        }

        button, .dot {
          cursor: pointer;
        }

        .dot {
          width: 8px;
          height: 8px;
          background: #FCFCFC;
          border-radius: 50%;
          position: absolute;
          top: 4%;
          right: 6%;
          z-index: 10;
        }
        .dot:hover {
          background: #c9c9c9;
        }

        .two {
          right: 12%;
          opacity: 0.5;
        }

        .face {
          position: absolute;
          width: 22%;
          height: 22%;
          background: #FCFCFC;
          border-radius: 50%;
          border: 1px solid #777777;
          top: 21%;
          left: 37.5%;
          z-index: 2;
          animation: bounce 1s ease-in infinite;
        }

        .face2 {
          position: absolute;
          width: 22%;
          height: 22%;
          background: #FCFCFC;
          border-radius: 50%;
          border: 1px solid #777777;
          top: 21%;
          left: 37.5%;
          z-index: 2;
          animation: roll 3s ease-in-out infinite;
        }

        .face3 {
          position: absolute;
          width: 22%;
          height: 22%;
          background: #FCFCFC;
          border-radius: 50%;
          border: 1px solid #777777;
          top: 21%;
          left: 37.5%;
          z-index: 2;
          animation: bounce 2s ease-in infinite;
        }

        .face4 {
          position: absolute;
          width: 22%;
          height: 22%;
          background: #FCFCFC;
          border-radius: 50%;
          border: 1px solid #777777;
          top: 21%;
          left: 37.5%;
          z-index: 2;
          animation: scale 1.5s ease-in infinite;
        }

        .eye {
          position: absolute;
          width: 5px;
          height: 5px;
          background: #777777;
          border-radius: 50%;
          top: 40%;
          left: 20%;
        }

        .right {
          left: 68%;
        }

        .mouth {
          position: absolute;
          top: 43%;
          left: 41%;
          width: 7px;
          height: 7px;
          border-radius: 50%;
        }

        .happy {
          border: 2px solid;
          border-color: transparent #777777 #777777 transparent;
          transform: rotate(45deg);
        }

        .sad {
          top: 49%;
          border: 2px solid;
          border-color: #777777 transparent transparent #777777;
          transform: rotate(45deg);
        }

        .neutral {
          width: 10px;
          height: 2px;
          background: #777777;
          border-radius: 0;
          top: 45%;
          left: 40%;
        }

        .surprised {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #777777;
          top: 45%;
        }

        .shadow {
          position: absolute;
          width: 21%;
          height: 3%;
          opacity: 0.5;
          background: #777777;
          left: 40%;
          top: 43%;
          border-radius: 50%;
          z-index: 1;
        }

        .scale {
          animation: scale 1s ease-in infinite;
        }

        .move {
          animation: move 3s ease-in-out infinite;
        }

        .message {
          position: absolute;
          width: 100%;
          text-align: center;
          height: 40%;
          top: 47%;
        }

        .button-box {
          position: absolute;
          background: #FCFCFC;
          width: 50%;
          height: 15%;
          border-radius: 20px;
          top: 73%;
          left: 25%;
          outline: 0;
          border: none;
          box-shadow: 2px 2px 10px rgba(119, 119, 119, 0.5);
          transition: all 0.5s ease-in-out;
          font-family: "Lato", sans-serif;
        }
        .button-box:hover {
          background: rgb(239.25, 239.25, 239.25);
          transform: scale(1.05);
          transition: all 0.3s ease-in-out;
        }

        @keyframes bounce {
          50% {
            transform: translateY(-10px);
          }
        }
        @keyframes scale {
          50% {
            transform: scale(0.9);
          }
        }
        @keyframes roll {
          0% {
            transform: rotate(0deg);
            left: 25%;
          }
          50% {
            left: 60%;
            transform: rotate(168deg);
          }
          100% {
            transform: rotate(0deg);
            left: 25%;
          }
        }
        @keyframes move {
          0% {
            left: 25%;
          }
          50% {
            left: 60%;
          }
          100% {
            left: 25%;
          }
        }
      </style>
    `;

    const boxClass = this.getBoxClass(type);
    const faceClass = this.getFaceClass(type);
    const shadowClass = this.getShadowClass(type);
    const buttonClass = this.getButtonClass(type);

    this.shadowRoot.innerHTML = `
      ${styles}
      <div class="notification-box ${boxClass}" aria-live="${type === 'error' ? 'assertive' : 'polite'}" >
        <div class="dot" tabindex="0" ></div>
        <div class="dot two" tabindex="0"></div>
        <div class="${faceClass}">
          <div class="eye"></div>
          <div class="eye right"></div>
          <div class="mouth ${this.getMouthClass(type)}"></div>
        </div>
        <div class="shadow ${shadowClass}"></div>
        <div class="message">
          <h1 class="alert">${title}</h1>
          <p>${body}</p>
        </div>
        <button class="button-box">
          <h1 class="${buttonClass}">${buttonText}</h1>
        </button>
      </div>
    `;
  }

  getBoxClass(type) {
    switch(type) {
      case 'success': return 'success-box';
      case 'error': return 'error-box';
      case 'warning': return 'warning-box';
      default: return 'info-box';
    }
  }

  getFaceClass(type) {
    switch(type) {
      case 'success': return 'face';
      case 'error': return 'face2';
      case 'warning': return 'face4';
      default: return 'face3';
    }
  }

  getShadowClass(type) {
    switch(type) {
      case 'success': return 'scale';
      case 'error': return 'move';
      case 'warning': return 'scale';
      default: return 'scale';
    }
  }

  getButtonClass(type) {
    switch(type) {
      case 'success': return 'green';
      case 'error': return 'red';
      case 'warning': return 'yellow';
      default: return 'blue';
    }
  }

  getMouthClass(type) {
    switch(type) {
      case 'success': return 'happy';
      case 'error': return 'sad';
      case 'warning': return 'neutral';
      default: return 'surprised';
    }
  }

  getButtonText(type) {
    switch(type) {
      case 'success': return 'continue';
      case 'error': return 'try again';
      case 'warning': return 'understand';
      default: return 'ok';
    }
  }

  setupEventListeners() {
    const notification = this.shadowRoot.querySelector('.notification-box');
    const dots = this.shadowRoot.querySelectorAll('.dot');
    const button = this.shadowRoot.querySelector('.button-box');

    setTimeout(() => {
      notification.classList.add('active');
    }, 10);

    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        this.hideNotification();
      });
      
      dot.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          this.hideNotification();
        }
      });
    });

    button.addEventListener('click', () => {
      this.hideNotification();
    });

    setTimeout(() => {
      if (notification.classList.contains('active')) {
        this.hideNotification();
      }
    }, 5000);
  }

  hideNotification() {
    const notification = this.shadowRoot.querySelector('.notification-box');
    notification.classList.remove('active');
    notification.classList.add('exiting');
    
    setTimeout(() => {
      this.remove();
    }, 500);
  }
}

customElements.define('message-box', MessageBox);
