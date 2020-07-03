const pomodoroDefault = 25;
const shortDefault = 5;
const longDefault = 15;

let pomodoroCustom = pomodoroDefault;
let shortCustom = shortDefault;
let longCustom = longDefault;

let timeAmount = pomodoroDefault;
let timeAmountMinutes = timeAmount - 1;
let timeAmountSeconds = timeAmount * 60;
let secondsAmount = 60;

let loopIndex = 0;
let pomodoroCount = 0;

let pomodoroOldValue = pomodoroDefault;
let shortOldValue = shortDefault;
let longOldValue = longDefault;

let activeTimerButton = "loop";

let alarmFinished = false;

let alarmSound = new Audio("sounds/alarm.mp3");

let resizeWindow = () => {
  let browserHeight = 0;

  if (window.innerWidth > 1024) {
    $(".website-container").height("100vh");
  } else {
    $(".website-container").height(window.innerHeight - browserHeight);
  }

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1024) {
      $(".website-container").height("100vh");
    } else {
      $(".website-container").height(window.innerHeight - browserHeight);
    }
  });
};

let resetValues = () => {
  document.getElementById("pomodoro-input").value = pomodoroDefault;
  document.getElementById("short-input").value = shortDefault;
  document.getElementById("long-input").value = longDefault;
  loopIndex = 0;
};

resizeWindow();
resetValues();

let spinnerClick = (direction, fieldName) => {
  $(`.spinner-${direction}-${fieldName}`).click(function () {
    let fieldNumber = parseInt(document.getElementById(`${fieldName}-input`).value);
    if (/^\d+$/.test(document.getElementById("pomodoro-input").value) && fieldNumber > 0) {
      if (direction == "up") {
        fieldNumber++;
      } else if (fieldNumber > 1) {
        fieldNumber--;
      }
      document.getElementById(`${fieldName}-input`).value = fieldNumber;
      oldValue = fieldNumber;
    } else {
      $(".alert-message-window").addClass("info-window-visible");
      document.getElementById(`${fieldName}-input`).value = "";
    }
  });
};

$(".btn-cancel").click(function () {
  $(".custom-timer-window").removeClass("info-window-visible");
  document.getElementById("pomodoro-input").value = pomodoroOldValue;
  document.getElementById("short-input").value = shortOldValue;
  document.getElementById("long-input").value = longOldValue;
});

$(".btn-about").click(function () {
  $(".about-window").addClass("info-window-visible");
});

$(".btn-close").click(function () {
  $(".about-window").removeClass("info-window-visible");
});

$(".btn-timer").click(function () {
  $(".btn-timer").removeClass("btn-clicked");
  $(this).addClass("btn-clicked");
  resetTimer();
  let timerButtonsCount = 4;
  loopIndex = 0;
  for (let i = 1; i <= timerButtonsCount; i++) {
    if ($(this).hasClass(`btn-timer${i}`)) {
      $(".title").removeClass("title-visible");
      $(`.title${i}`).addClass("title-visible");
    }
  }
  switch (true) {
    case $(this).hasClass("btn-timer1"):
      setTimer("pomodoro");
      break;
    case $(this).hasClass("btn-timer2"):
      setTimer("short");
      break;
    case $(this).hasClass("btn-timer3"):
      setTimer("long");
      break;
    case $(this).hasClass("btn-timer4"):
      setTimer("loop");
      break;
  }
});

function setTimer(type) {
  if (type != "loop") {
    $(".timer-minutes").html(document.getElementById(`${type}-input`).value);
    $(".timer-seconds").html("00");
    timeAmount = parseInt(document.getElementById(`${type}-input`).value);
  } else {
    $(".timer-minutes").html(document.getElementById("pomodoro-input").value);
    $(".timer-seconds").html("00");
    timeAmount = parseInt(document.getElementById("pomodoro-input").value);
  }
  activeTimerButton = type;
  timeAmountMinutes = timeAmount - 1;
  timeStart();
}

$(".btn-save").click(function () {
  if (document.getElementById("pomodoro-input").value < 1 || document.getElementById("short-input").value < 1 || document.getElementById("long-input").value < 1) {
    $(".alert-message-window").addClass("info-window-visible");
  } else if (isNaN(document.getElementById("pomodoro-input").value) || isNaN(document.getElementById("short-input").value) || isNaN(document.getElementById("long-input").value)) {
    $(".alert-message-window").addClass("info-window-visible");
  } else {
    $(".custom-timer-window").removeClass("info-window-visible");
    resetTimer();
    setTimer(activeTimerButton);
    pomodoroOldValue = parseInt(document.getElementById("pomodoro-input").value);
    shortOldValue = parseInt(document.getElementById("short-input").value);
    longOldValue = parseInt(document.getElementById("long-input").value);
  }
});

$(".btn-reset").click(function () {
  resetValues();
  $(".timer-minutes").html(pomodoroDefault);
  $(".timer-seconds").html("00");
});

spinnerClick("up", "pomodoro");
spinnerClick("down", "pomodoro");
spinnerClick("up", "short");
spinnerClick("down", "short");
spinnerClick("up", "long");
spinnerClick("down", "long");

$(".btn-custom-timer").click(function () {
  $(".custom-timer-window").addClass("info-window-visible");
});

$(".btn-okey").click(function () {
  $(".alert-message-window").removeClass("info-window-visible");
});

let timeStart = () => {
  if (timeAmount >= 10) {
    $(".timer-minutes").html(timeAmount);
  } else {
    $(".timer-minutes").html("0" + timeAmount);
  }
  $(".timer-seconds").html("00");
};

timeStart();

var Clock = {
  totalSeconds: 0,
  totalMinutes: 0,
  start: function () {
    var self = this;
    this.interval = setInterval(function () {
      if (timeAmountMinutes == 0 && secondsAmount == 0) {
        Clock.pause();
        Clock.reset();
        if (activeTimerButton != "loop") {
          resetTimer();
        }
        alarmSound.currentTime = 0;
        alarmSound.play();

        if (activeTimerButton == "loop" && loopIndex == 0) {
          $(".title").removeClass("title-visible");
          $(".title2").addClass("title-visible");
          timeAmountMinutes = parseInt(document.getElementById("short-input").value) - 1;
          loopIndex = 1;
          Clock.resume();
        } else if (activeTimerButton == "loop" && loopIndex == 2) {
          $(".title").removeClass("title-visible");
          $(".title1").addClass("title-visible");
          timeAmountMinutes = parseInt(document.getElementById("pomodoro-input").value) - 1;
          loopIndex = 3;
          Clock.resume();
        } else if (activeTimerButton == "loop" && loopIndex == 4) {
          $(".title").removeClass("title-visible");
          $(".title3").addClass("title-visible");
          timeAmountMinutes = parseInt(document.getElementById("long-input").value) - 1;
          loopIndex = 5;
          Clock.resume();
        } else if (loopIndex == 6) {
          setTimer(activeTimerButton);
          resetTimer();
          loopIndex = 0;
          $(".title").removeClass("title-visible");
          $(".title1").addClass("title-visible");
          $(".progress-bar").removeClass("progress-bar-animation");
          $(".progress-bar").removeClass("progress-bar-animation2");
        }
      } else {
        if (secondsAmount == 0) {
          secondsAmount = 60;
          timeAmountMinutes--;
        }

        secondsAmount--;
        self.totalSeconds = secondsAmount;
        self.totalMinutes = timeAmountMinutes;
        if (timeAmountMinutes >= 10) {
          $(".timer-minutes").html(self.totalMinutes);
        } else {
          $(".timer-minutes").html(`0${self.totalMinutes}`);
        }

        if (secondsAmount >= 10) {
          $(".timer-seconds").html(self.totalSeconds);
        } else {
          $(".timer-seconds").html(`0${self.totalSeconds}`);
        }
      }
    }, 1000);
  },

  pause: function () {
    clearInterval(this.interval);
    delete this.interval;
    document.getElementById("progress-bar").style.animationPlayState = "paused";
  },

  resume: function () {
    if (!this.interval) {
      this.start();
      document.getElementById("progress-bar").style.animationPlayState = "running";

      if (loopIndex == 0) {
        $(".progress-bar").addClass("progress-bar-animation");
        if (activeTimerButton == "loop") {
          document.getElementById("progress-bar").style.animationDuration = parseInt(document.getElementById("pomodoro-input").value) * 60 + "s";
        } else {
          document.getElementById("progress-bar").style.animationDuration = parseInt(document.getElementById(`${activeTimerButton}-input`).value) * 60 + "s";
        }
        document.getElementById("progress-bar").style.animationPlayState = "running";
      } else if (loopIndex == 1) {
        $(".progress-bar").removeClass("progress-bar-animation");
        $(".progress-bar").addClass("progress-bar-animation2");
        document.getElementById("progress-bar").style.animationDuration = parseInt(document.getElementById("short-input").value) * 60 + "s";
        document.getElementById("progress-bar").style.animationPlayState = "running";
        loopIndex = 2;
      } else if (loopIndex == 3) {
        $(".progress-bar").removeClass("progress-bar-animation2");
        $(".progress-bar").addClass("progress-bar-animation");
        document.getElementById("progress-bar").style.animationDuration = parseInt(document.getElementById("pomodoro-input").value) * 60 + "s";
        document.getElementById("progress-bar").style.animationPlayState = "running";
        pomodoroCount++;
        console.log(pomodoroCount);
        if (pomodoroCount < 3) {
          loopIndex = 0;
        } else {
          loopIndex = 4;
        }
      } else if (loopIndex == 5) {
        $(".progress-bar").removeClass("progress-bar-animation");
        $(".progress-bar").addClass("progress-bar-animation2");
        document.getElementById("progress-bar").style.animationDuration = parseInt(document.getElementById("long-input").value) * 60 + "s";
        document.getElementById("progress-bar").style.animationPlayState = "running";
        loopIndex = 6;
      }
    }
  },

  reset: function () {
    clearInterval(this.interval);
    secondsAmount = 60;
    $(".progress-bar").removeClass("progress-bar-animation");
    $(".progress-bar").removeClass("progress-bar-animation2");
  }
};

Clock.pause();

buttonClicked = false;

$(".btn-play-pause").click(function () {
  if (buttonClicked == false) {
    Clock.resume();
    $(".icon-pause").addClass("item-visible");
    $(".icon-play").removeClass("item-visible");
    buttonClicked = true;
  } else {
    Clock.pause();
    $(".icon-play").addClass("item-visible");
    $(".icon-pause").removeClass("item-visible");
    buttonClicked = false;
  }
});

function resetTimer() {
  Clock.pause();
  Clock.reset();
  timeStart();
  $(".icon-play").addClass("item-visible");
  $(".icon-pause").removeClass("item-visible");
  buttonClicked = false;
  timeAmountMinutes = timeAmount - 1;
  $(".progress-bar").removeClass("progress-bar-animation");
  pomodoroCount = 0;
}

$(".btn-reset-clock").click(function () {
  resetTimer();
  loopIndex = 0;
});
