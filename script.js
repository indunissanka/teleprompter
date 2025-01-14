document.addEventListener('DOMContentLoaded', function() {
      const textInput = document.getElementById('textInput');
      const teleprompterText = document.getElementById('teleprompterText');
      const toggleBtn = document.getElementById('toggleBtn');
      const resetBtn = document.getElementById('resetBtn');
      const speedInput = document.getElementById('speed');
      const fontSizeInput = document.getElementById('fontSize');
      const fontFamilySelect = document.getElementById('fontFamily');
      const textAlignSelect = document.getElementById('textAlign');
      const mirrorTextCheckbox = document.getElementById('mirrorText');

      let animationFrameId;
      let startTime;
      let paused = true;
      let currentScroll = 0;

      function updateTeleprompter() {
        const text = textInput.value;
        const lines = text.split('\n');
        let formattedText = '';
        if (lines.length > 0) {
          formattedText += `<span>${lines[0]}</span>`;
          for (let i = 1; i < lines.length; i++) {
            formattedText += `\n${lines[i]}`;
          }
        }
        teleprompterText.innerHTML = formattedText;
        teleprompterText.style.fontSize = `${fontSizeInput.value}px`;
        teleprompterText.style.fontFamily = fontFamilySelect.value;
        teleprompterText.style.textAlign = textAlignSelect.value;
        teleprompterText.style.transform = mirrorTextCheckbox.checked ? 'scaleX(-1)' : 'scaleX(1)';
      }

      function scrollText(timestamp) {
        if (paused) {
          return;
        }

        if (!startTime) {
          startTime = timestamp;
        }

        const progress = timestamp - startTime;
        const speed = parseInt(speedInput.value, 10);
        const scrollAmount = (progress / 1000) * speed;
        currentScroll = scrollAmount;

        teleprompterText.style.transform = mirrorTextCheckbox.checked ? `scaleX(-1) translateY(-${currentScroll}px)` : `scaleX(1) translateY(-${currentScroll}px)`;


        if (teleprompterText.offsetHeight <= currentScroll) {
          currentScroll = 0;
          startTime = null;
        }

        animationFrameId = requestAnimationFrame(scrollText);
      }

      toggleBtn.addEventListener('click', function() {
        if (paused) {
          paused = false;
          startTime = null;
          updateTeleprompter();
          animationFrameId = requestAnimationFrame(scrollText);
          toggleBtn.textContent = 'Pause';
        } else {
          paused = true;
          cancelAnimationFrame(animationFrameId);
          toggleBtn.textContent = 'Start';
        }
      });


      resetBtn.addEventListener('click', function() {
        paused = true;
        cancelAnimationFrame(animationFrameId);
        currentScroll = 0;
        startTime = null;
        teleprompterText.style.transform = mirrorTextCheckbox.checked ? 'scaleX(-1) translateY(0)' : 'scaleX(1) translateY(0)';
        toggleBtn.textContent = 'Start';
      });

      textInput.addEventListener('input', updateTeleprompter);
      fontSizeInput.addEventListener('input', updateTeleprompter);
      fontFamilySelect.addEventListener('change', updateTeleprompter);
      textAlignSelect.addEventListener('change', updateTeleprompter);
      mirrorTextCheckbox.addEventListener('change', updateTeleprompter);
    });
