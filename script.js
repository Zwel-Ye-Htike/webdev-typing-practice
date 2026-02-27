const paragraphs = [
    `HTML is the backbone of the web. It structures content using headings, paragraphs, lists, tables, and links.`,
    `Semantic HTML improves accessibility and SEO while making code more readable and maintainable.`,
    `HTML5 introduced new elements like <header>, <footer>, <section>, <article>, <nav>, and <aside>.`,
    `Forms in HTML allow user input and include elements like <input>, <textarea>, <select>, and <button>.`,
    `HTML attributes provide additional information about elements, such as id, class, src, href, and alt.`,
    `CSS is used to style web pages, including fonts, colors, layouts, and animations.`,
    `External CSS allows you to reuse styles across multiple pages using the <link> element.`,
    `CSS specificity determines which styles are applied when multiple rules target the same element.`,
    `Flexbox is a powerful CSS layout system that simplifies alignment and distribution of space.`,
    `CSS Grid provides a two-dimensional layout system for rows and columns.`,
    `Media queries allow responsive design by applying styles based on screen size or device.`,
    `CSS transitions and animations add motion and interactivity to elements without JavaScript.`,
    `JavaScript enables interactivity by manipulating the DOM and handling events.`,
    `Variables in JavaScript store data and can be declared using var, let, or const.`,
    `Functions in JavaScript are reusable blocks of code that perform specific tasks.`,
    `Arrow functions are a concise syntax for writing functions in ES6 and later.`,
    `Objects in JavaScript store key-value pairs and can represent complex data structures.`,
    `Arrays in JavaScript store ordered collections of values and provide many useful methods.`,
    `The DOM represents HTML as a tree structure, allowing JavaScript to manipulate elements dynamically.`,
    `Event listeners in JavaScript respond to user actions like clicks, input, and scrolling.`,
    `JavaScript ES6 modules allow developers to import and export functionality between files.`,
    `Promises in JavaScript handle asynchronous operations and prevent callback hell.`,
    `Async/await syntax simplifies working with promises and asynchronous code.`,
    `Debugging JavaScript can be done using console.log, breakpoints, and browser developer tools.`,
    `Web APIs allow interaction with browser features like geolocation, local storage, and fetch.`,
    `Responsive web design ensures layouts adapt to different devices and screen sizes.`,
    `Fluid layouts use relative units like percentages instead of fixed pixels for flexibility.`,
    `Accessibility ensures websites are usable by all people, including those with disabilities.`,
    `Proper use of semantic HTML, ARIA roles, and keyboard navigation improves accessibility.`,
    `Color contrast and font size are critical for readability and accessibility.`,
    `SEO (Search Engine Optimization) improves search engine rankings using semantic HTML and meta tags.`,
    `Proper heading hierarchy helps both accessibility and SEO.`,
    `Alt attributes for images improve accessibility and SEO.`,
    `Minimizing HTTP requests improves website performance by reducing load times.`,
    `Caching strategies, like service workers and browser cache, improve performance.`,
    `Optimizing images using compression and responsive formats reduces page load.`,
    `Lazy loading images improves performance by loading them only when visible.`,
    `Web fonts should be optimized to reduce render-blocking and improve page speed.`,
    `Progressive Web Apps (PWAs) combine web and native app features for offline use.`,
    `JavaScript frameworks like React, Vue, and Angular help build scalable applications.`,
    `State management libraries like Redux or Vuex manage complex application states.`,
    `Component-based architecture improves maintainability and reusability of code.`,
    `Single Page Applications (SPAs) load content dynamically without full page reloads.`,
    `Version control with Git allows tracking changes and collaboration.`,
    `Clean code practices include modularity, proper naming, and commenting.`,
    `Testing ensures code quality using unit tests, integration tests, and end-to-end tests.`,
    `Browser compatibility requires testing across different browsers and devices.`,
    `Security best practices include input validation, HTTPS, and safe handling of user data.`,
    `Web performance tools like Lighthouse and WebPageTest identify bottlenecks.`,
    `Continuous Integration and Deployment (CI/CD) automate testing and deployment processes.`,
    `Learning modern JavaScript, CSS, and HTML best practices keeps developers up-to-date.`,
    `Understanding web protocols like HTTP, HTTPS, and WebSocket helps build better applications.`,
];

const homeScreen = document.getElementById('homeScreen');
const gameScreen = document.getElementById('gameScreen');
const startBtn = document.getElementById('startBtn');
const backBtn = document.getElementById('backBtn');
const restartBtn = document.getElementById('restartBtn');
const timeSelectHome = document.getElementById('timeSelectCustom');
const timeSelectGame = document.getElementById('timeSelectGameCustom');
const wordContainer = document.getElementById('wordContainer');
const scoreContainer = document.getElementById('scoreContainer');
const timeDisplay = document.getElementById('time');

let timer = null;
let timerActive = false;
let remainingTime = 60;
// store the selected durations separately from the running timer
let selectedHomeTime = 60;
let selectedGameTime = 60;
let lastKeyTime = null;
let pauseTimeout = 3000;
let currentParagraph = '';
let typedChars = [];
let currentIndex = 0;
let totalTypedChars = 0;
let correctChars = 0;

// Custom dropdown
function setupCustomSelect(id, callback) {
    const select = document.getElementById(id);
    const selected = select.querySelector('.selected');
    const optionsContainer = select.querySelector('.options');
    const options = select.querySelectorAll('.options div');

    selected.addEventListener('click', () => {
        optionsContainer.style.display =
            optionsContainer.style.display === 'flex' ? 'none' : 'flex';
    });

    options.forEach((option) => {
        option.addEventListener('click', () => {
            selected.textContent = option.textContent;
            optionsContainer.style.display = 'none';
            callback(option.getAttribute('data-value'));
        });
    });

    document.addEventListener('click', (e) => {
        if (!select.contains(e.target)) optionsContainer.style.display = 'none';
    });
}

// callbacks now only update the selected value; the running timer
// will be initialized when the round actually starts or restarts
setupCustomSelect('timeSelectCustom', (v) => {
    selectedHomeTime = parseInt(v);
});
setupCustomSelect('timeSelectGameCustom', (v) => {
    selectedGameTime = parseInt(v);
    // update display if the game isn't running yet
    if (!timerActive) {
        timeDisplay.textContent = `Time: ${selectedGameTime}s`;
    }
});

function generateParagraph() {
    let p = '';
    const count = 2 + Math.floor(Math.random() * 2);
    for (let i = 0; i < count; i++) {
        const idx = Math.floor(Math.random() * paragraphs.length);
        p += paragraphs[idx] + ' ';
    }
    return p.trim();
}

// newParagraph performs paragraph generation. When resetScores is true (the default)
// it also clears the typing statistics and the score display, which is what we want
// at the beginning of a round. During the round (when the player finishes a
// paragraph) we call newParagraph(false) so the totals accumulate.
function newParagraph(resetScores = true) {
    if (resetScores) {
        totalTypedChars = 0;
        correctChars = 0;
        scoreContainer.innerHTML = ''; // clear previous score
    }
    currentParagraph = generateParagraph();
    typedChars = [];
    currentIndex = 0;
    updateWordDisplay();
}

function updateWordDisplay() {
    let displayHTML = '';
    for (let i = 0; i < currentParagraph.length; i++) {
        if (i < typedChars.length) {
            displayHTML +=
                typedChars[i] === currentParagraph[i]
                    ? `<span class="correct">${currentParagraph[i]}</span>`
                    : `<span class="wrong">${currentParagraph[i]}</span>`;
        } else {
            displayHTML += `<span class="char">${currentParagraph[i]}</span>`;
        }
    }
    wordContainer.innerHTML = displayHTML;
}

function tick() {
    remainingTime--;
    timeDisplay.textContent = `Time: ${remainingTime}s`;
    if (remainingTime <= 0) {
        clearInterval(timer);
        timerActive = false;
        document.removeEventListener('keydown', handleTyping);
        // blur whatever element might have focus so space can't restart accidentally
        if (document.activeElement) document.activeElement.blur();

        const minutes = selectedGameTime / 60 || 1;
        const wpm = Math.round(correctChars / 5 / minutes);
        const accuracy =
            totalTypedChars === 0
                ? 0
                : Math.round((correctChars / totalTypedChars) * 100);

        scoreContainer.innerHTML = `⏱ Time's up!<br>WPM: ${wpm}<br>Accuracy: ${accuracy}%`;
    }
}

function checkPause() {
    if (!timerActive) return;
    const now = Date.now();
    if (lastKeyTime && now - lastKeyTime > pauseTimeout) {
        clearInterval(timer);
        timerActive = false;
    }
}
setInterval(checkPause, 500);

startBtn.addEventListener('click', () => {
    homeScreen.style.display = 'none';
    gameScreen.style.display = 'block';
    // initialize timer based on the stored home selection
    remainingTime = selectedHomeTime || 60;
    timeDisplay.textContent = `Time: ${remainingTime}s`;
    timerActive = false;
    lastKeyTime = null;
    // keep the game dropdown in sync with home choice so the time only changes
    // when the user explicitly picks a new option on the game screen
    selectedGameTime = remainingTime;
    const homeLabel = timeSelectHome.querySelector('.selected').textContent;
    timeSelectGame.querySelector('.selected').textContent = homeLabel;
    // ensure no button keeps focus so space won't activate anything unexpectedly
    restartBtn.blur();
    backBtn.blur();
    newParagraph(true);
    document.addEventListener('keydown', handleTyping);
});

backBtn.addEventListener('click', () => {
    if (timerActive) clearInterval(timer);
    timerActive = false;
    gameScreen.style.display = 'none';
    homeScreen.style.display = 'block';
    document.removeEventListener('keydown', handleTyping);
});

restartBtn.addEventListener('click', () => {
    clearInterval(timer);
    timerActive = false;
    // use the stored game selection value
    remainingTime = selectedGameTime || 60;
    timeDisplay.textContent = `Time: ${remainingTime}s`;
    // remove focus to prevent spacebar from triggering the button again
    restartBtn.blur();
    newParagraph(true);
    document.addEventListener('keydown', handleTyping);
});

function handleTyping(e) {
    // ignore key events coming from controls/buttons so the space bar
    // doesn't activate the restart/back buttons while typing
    const targetTag = e.target.tagName;
    if (
        targetTag === 'BUTTON' ||
        targetTag === 'SELECT' ||
        targetTag === 'INPUT' ||
        targetTag === 'TEXTAREA'
    ) {
        return;
    }

    const char = e.key;
    if (char.length === 1) {
        // prevent the spacebar from scrolling or clicking a focused button
        e.preventDefault();
        if (!timerActive) {
            timer = setInterval(tick, 1000);
            timerActive = true;
        }
        lastKeyTime = Date.now();

        typedChars[currentIndex] = char;
        currentIndex++;
        totalTypedChars++;
        if (char === currentParagraph[currentIndex - 1]) correctChars++;
        // if we've reached the end of the paragraph and there's still time,
        // automatically load another one without resetting the scores
        if (currentIndex >= currentParagraph.length && remainingTime > 0) {
            newParagraph(false);
        }
    } else if (char === 'Backspace') {
        if (currentIndex > 0) {
            if (
                typedChars[currentIndex - 1] ===
                currentParagraph[currentIndex - 1]
            )
                correctChars--;
            totalTypedChars--;
            currentIndex--;
            typedChars.pop();
        }
    }
    updateWordDisplay();
}
