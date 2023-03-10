
import bot from './assets/y00tbot.svg';
import user from './assets/user1.svg';

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');
const subButton = document.querySelector('.submitButton');


let loadInterval;

function startLoader(element) {
  element.textContent = '';
  loadInterval = setInterval(() => {
    element.textContent += '.';
    if (element.textContent === '....') {
      element.textContent = '';
    }
  }, 300);
}

function typeText(element, text) {
  let index = 0;
  const interval = setInterval(() => {
    if (index < text.length) {
      element.innerHTML += text.charAt(index);
      index += 1;
    } else {
      clearInterval(interval);
      enableButton();
    }
  }, 20);
}

function enableButton() {
  subButton.disabled = false;
  subButton.classList.remove('disabled');
  const floatingImg = document.querySelector('.floating');
  floatingImg.classList.remove('floating');
}

function disableButton() {
  subButton.disabled = true;
  subButton.classList.add('disabled');
}

function generateUniqueId() {
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);
  return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe(isAi, value, uniqueId) {
  return (
    `
    <div class="wrapper ${isAi && 'ai'}">
      <div class="profile">
        <img id="img-${uniqueId}"
          src="${isAi ? bot : user}"
          alt="${isAi ? 'bot' : 'user'}"
        />
      </div>
      <div class="message" id=${uniqueId}>${value}</div>
    </div>
    `
  );
}

const handleSubmit = async (e) => {
  e.preventDefault();

  disableButton();

  const data = new FormData(form);

  // User's chat stripe
  chatContainer.innerHTML += chatStripe(false, data.get('prompt'));

  // Reset form to original state
  form.reset();

  // Bot's chat stripe
  const uniqueId = generateUniqueId();
  chatContainer.innerHTML += chatStripe(true, '', uniqueId);

  chatContainer.scrollTop = chatContainer.scrollHeight;

  const messageDiv = document.getElementById(uniqueId);

  startLoader(messageDiv);

  // Store active AI profile image ID
  const imgId = `img-${uniqueId}`;

  // Get element by said imgId and store as imgDom
  const imgDom = document.getElementById(imgId);
  if (!imgDom) {
   
    console.log('Error: Could not find image element with ID', imgId);
  } else {
    imgDom.classList.add('floating');
  }

  // Fetch data from server -> bot's response
  const response = await fetch('https://y00tiful-mind.onrender.com', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: data.get('prompt'),
    }),
  });

  clearInterval(loadInterval);
  messageDiv.innerHTML = '';

  if (response.ok) {
    const { bot } = await response.json();
    const parsedData = bot.trim();

    // Update message response with parsed data
    typeText(messageDiv, parsedData);
  } else {
    // Define error var if response fails
    const err = await response.text();

    // Update response message with a clean error message to let the user know something went wrong
    typeText(messageDiv, 'Error: Could not fetch response from server');
    console.error('Error:', err);
  }
};

form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e) => {
if(e.keyCode === 13) {
  handleSubmit(e);
} 
})
