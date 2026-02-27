# Web Dev Typing Game

A fun and interactive typing game designed to help users improve their typing speed while learning essential web development concepts.

---

## 📝 Features

- **Typing Practice with Web Dev Knowledge:** Practice typing using curated paragraphs about HTML, CSS, JavaScript, and modern web development best practices.
- **Custom Timer:** Choose from multiple durations (30s, 1m, 2m, 3m) to challenge yourself.
- **Real-time Feedback:** Highlights correct and incorrect characters as you type.
- **Score Tracking:** Calculates Words Per Minute (WPM) and typing accuracy.
- **Responsive UI:** Simple and modern design with dark mode styling.
- **Restart & Back Options:** Restart the game or go back to the home screen anytime.

---

## 💻 Technologies Used

- **HTML5:** Structure and content of the game.
- **CSS3:** Styling with custom dropdowns, typography, and responsive containers.
- **JavaScript (Vanilla):** Game logic, timer, typing detection, and score calculation.

---

## 🚀 How to Run

1. Clone or download the repository.
2. Ensure you have the following files in the same directory:
    - `index.html`
    - `style.css`
    - `script.js`
3. Open `index.html` in a web browser.
4. Select the desired timer and click **Start Game** to begin typing.

---

## 🎮 How to Play

1. On the home screen:
   - Read the introduction and select your preferred duration from the dropdown.
   - Click **Start Game**.
2. On the game screen:
   - Start typing the displayed paragraph.
   - Correct letters are highlighted in white; incorrect letters are highlighted in red.
   - Your WPM and accuracy will be calculated and displayed when time runs out.
3. Use the **Restart** button to start a new game with the same timer.
4. Use the **Back** button to return to the home screen and choose a new duration.

---

## ⚙️ Game Logic Overview

- **Paragraph Generation:** Randomly selects 2–3 web development-related sentences for each round.
- **Typing Feedback:** 
  - Correct characters are highlighted in white.
  - Incorrect characters are highlighted in red.
  - Untyped characters are dimmed.
- **Timer Handling:** 
  - Timer starts on the first key press.
  - Game automatically stops when the timer reaches zero.
  - Supports pause detection if no key is pressed for a short period.
- **Scoring:** 
  - WPM (Words Per Minute) is calculated as `correct characters ÷ 5 ÷ minutes`.
  - Accuracy = `(correct characters ÷ total typed characters) × 100%`.

---

## 🎨 Styling

- Dark theme with monospace font for a classic coding look.
- Custom dropdowns for timer selection with smooth hover effects.
- Highlighted text feedback for typed characters.

---

## 🛠️ Customization

- **Add More Paragraphs:** Extend the `paragraphs` array in `script.js` with additional web development content.
- **Change Theme:** Update `style.css` to modify colors, fonts, and layout.
- **Adjust Timer Options:** Modify the `.options` divs in `index.html` to add or remove time choices.

---

## 📂 File Structure
├── index.html       # Main HTML page
├── style.css        # Styling for home and game screens
└── script.js        # JavaScript game logic


## ✨ Future Improvements

- Add multiple difficulty levels.
- Include sound effects for correct/incorrect typing.
- Store high scores using localStorage.
- Add user authentication for progress tracking.
- Support mobile touch typing.
