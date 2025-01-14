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
      const textColorInput = document.getElementById('textColor');
      const backgroundColorInput = document.getElementById('backgroundColor');
      const fullScreenBtn = document.getElementById('fullScreenBtn');
      const fullscreenContainer = document.getElementById('fullscreen-container');
      const fullscreenTeleprompterText = document.getElementById('fullscreen-teleprompterText');
      const speedInputFs = document.getElementById('speed-fs');
      const fontSizeInputFs = document.getElementById('fontSize-fs');
      const fontFamilySelectFs = document.getElementById('fontFamily-fs');
      const textAlignSelectFs = document.getElementById('textAlign-fs');
      const mirrorTextCheckboxFs = document.getElementById('mirrorText-fs');
      const textColorInputFs = document.getElementById('textColor-fs');
      const backgroundColorInputFs = document.getElementById('backgroundColor-fs');
      const exitFullScreenBtn = document.getElementById('exitFullScreenBtn');

      let animationFrameId;
      let startTime;
      let paused = true;
      let currentScroll = 0;
      let isFullScreen = false;

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
        teleprompterText.style.color = textColorInput.value;
        teleprompterText.parentElement.style.backgroundColor = backgroundColorInput.value;

        fullscreenTeleprompterText.innerHTML = formattedText;
        fullscreenTeleprompterText.style.fontSize = `${fontSizeInputFs.value}px`;
        fullscreenTeleprompterText.style.fontFamily = fontFamilySelectFs.value;
        fullscreenTeleprompterText.style.textAlign = textAlignSelectFs.value;
        fullscreenTeleprompterText.style.transform = mirrorTextCheckboxFs.checked ? 'scaleX(-1)' : 'scaleX(1)';
        fullscreenTeleprompterText.style.color = textColorInputFs.value;
        fullscreenTeleprompterText.parentElement.style.backgroundColor = backgroundColorInputFs.value;
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

        const scrollAmountFs = (progress / 1000) * parseInt(speedInputFs.value, 10);

        teleprompterText.style.transform = mirrorTextCheckbox.checked ? `scaleX(-1) translateY(-${currentScroll}px)` : `scaleX(1) translateY(-${currentScroll}px)`;
        fullscreenTeleprompterText.style.transform = mirrorTextCheckboxFs.checked ? `scaleX(-1) translateY(-${scrollAmountFs}px)` : `scaleX(1) translateY(-${scrollAmountFs}px)`;


        if (teleprompterText.offsetHeight <= currentScroll) {
          currentScroll = 0;
          startTime = null;
        }

        if (fullscreenTeleprompterText.offsetHeight <= scrollAmountFs) {
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
        fullscreenTeleprompterText.style.transform = mirrorTextCheckboxFs.checked ? 'scaleX(-1) translateY(0)' : 'scaleX(1) translateY(0)';
        toggleBtn.textContent = 'Start';
      });

      fullScreenBtn.addEventListener('click', function() {
         isFullScreen = !isFullScreen;
        if (isFullScreen) {
          fullscreenContainer.classList.add('fullscreen-active');
          document.body.style.overflow = 'hidden';
          updateTeleprompter();
        } else {
          fullscreenContainer.classList.remove('fullscreen-active');
          document.body.style.overflow = '';
        }
      });

      exitFullScreenBtn.addEventListener('click', function() {
        isFullScreen = false;
        fullscreenContainer.classList.remove('fullscreen-active');
        document.body.style.overflow = '';
      });

      textInput.addEventListener('input', updateTeleprompter);
      fontSizeInput.addEventListener('input', updateTeleprompter);
      fontFamilySelect.addEventListener('change', updateTeleprompter);
      textAlignSelect.addEventListener('change', updateTeleprompter);
      mirrorTextCheckbox.addEventListener('change', updateTeleprompter);
      textColorInput.addEventListener('input', updateTeleprompter);
      backgroundColorInput.addEventListener('input', updateTeleprompter);

      speedInputFs.addEventListener('input', updateTeleprompter);
      fontSizeInputFs.addEventListener('input', updateTeleprompter);
      fontFamilySelectFs.addEventListener('change', updateTeleprompter);
      textAlignSelectFs.addEventListener('change', updateTeleprompter);
      mirrorTextCheckboxFs.addEventListener('change', updateTeleprompter);
      textColorInputFs.addEventListener('input', updateTeleprompter);
      backgroundColorInputFs.addEventListener('input', updateTeleprompter);
    });
