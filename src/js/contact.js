/**
 * Contact Us form: real-time email validation, per-field error messages and
 * a simulated (no backend) send with a brief "Sending…" state.
 */
(function () {
  var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
  var MESSAGE_MIN_LENGTH = 10;

  var form = document.getElementById('contactForm');
  if (!form) return;

  var nameInput = document.getElementById('name');
  var emailInput = document.getElementById('email');
  var topicInput = document.getElementById('topic');
  var messageInput = document.getElementById('message');
  var statusBox = document.getElementById('formStatus');
  var submitBtn = form.querySelector('.send-btn');

  function fieldError(id) {
    return document.getElementById(id + 'Error');
  }

  function setError(id, message) {
    var el = fieldError(id);
    if (el) el.textContent = message || '';
  }

  emailInput.addEventListener('input', function () {
    var value = emailInput.value.trim();
    if (!value || EMAIL_PATTERN.test(value)) setError('email', '');
    else setError('email', 'Invalid email format');
  });

  messageInput.addEventListener('input', function () {
    if (!messageInput.value.trim() || messageInput.value.trim().length >= MESSAGE_MIN_LENGTH) {
      setError('message', '');
    }
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var name = nameInput.value.trim();
    var email = emailInput.value.trim();
    var topic = topicInput.value.trim();
    var message = messageInput.value.trim();
    var valid = true;

    setError('name', '');
    setError('email', '');
    setError('topic', '');
    setError('message', '');

    if (!name) { setError('name', 'Please enter your name.'); valid = false; }
    if (!EMAIL_PATTERN.test(email)) { setError('email', 'Invalid email format'); valid = false; }
    if (!topic) { setError('topic', 'Please enter a topic.'); valid = false; }
    if (!message || message.length < MESSAGE_MIN_LENGTH) {
      setError('message', 'Message must be at least ' + MESSAGE_MIN_LENGTH + ' characters.');
      valid = false;
    }

    if (!valid) {
      statusBox.textContent = 'Please fix the highlighted fields.';
      statusBox.className = 'form-status error';
      statusBox.style.display = 'block';
      return;
    }

    statusBox.textContent = 'Sending…';
    statusBox.className = 'form-status';
    statusBox.style.display = 'block';
    submitBtn.disabled = true;

    setTimeout(function () {
      statusBox.textContent = 'Your message has been sent (demo mode — no email is actually delivered).';
      statusBox.className = 'form-status success';
      submitBtn.disabled = false;
      form.reset();
    }, 500);
  });
})();
