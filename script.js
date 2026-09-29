// Personalize the recipient and the optional letter in index.html as well.
const recipient = "Chukki";

const notes = [
  {
    chapter: "A LITTLE APOLOGY & A LOT OF LOVE",
    lines: [`Hey ${recipient},`, "tharaha wenna epa…", "man adarei nee ♡"],
    message: "I know you’re upset with me right now, and I’m so sorry. Please don't stay mad... you know how much I love you. I made this little corner of the universe just to bring that beautiful smile back.",
    image: "bunny.png",
    alt: "A shy little bunny with a pink bow asking for forgiveness",
    caption: "tharaha wenna epa... man adarei nee 🥺♡",
    button: "Listen to me for a moment",
    hint: "I promise, every word comes straight from my heart.",
    progress: "Every little story starts with a heartfelt hello.",
  },
  {
    chapter: "SWEET SURPRISES",
    lines: ["You make", "ordinary days", "a little magic."],
    message: "A message from you. That sweet smile of yours. Somehow, even when we have little misunderstandings, you are always the brightest part of my day.",
    image: "surprise.png",
    alt: "A happy bunny floating with a heart-covered balloon",
    caption: "you give my heart butterflies.",
    button: "Tell me a little more",
    hint: "Warning: it gets a little sweeter from here.",
    progress: "The sweetest surprises usually start with you.",
  },
  {
    chapter: "ENDLESS CUDDLES",
    lines: ["A little closer.", "A little longer.", "You and me."],
    message: "If I could pick my favorite place to be right now, it would be right beside you—giving you the warmest, longest hug until you smile again.",
    image: "cuddles.png",
    alt: "Two little pandas sharing a cuddle beneath a pink heart",
    caption: "saving my favorite hug just for you.",
    button: "And what else?",
    hint: "Warm cuddles, silly jokes, and someone always on your team.",
    progress: "Some things just feel better together.",
  },
  {
    chapter: "ALL THE LITTLE MOMENTS",
    lines: ["Big adventures.", "Little moments.", "All with you."],
    message: "Late-night talks, walks with nowhere to go, and laughing until our stomachs hurt. I never want to lose that with you.",
    image: "love.png",
    alt: "A smiling panda holding a heart, surrounded by little hearts",
    caption: "my favorite daydream has you in it.",
    button: "There’s one more thing…",
    hint: "Okay, deep breath. Here comes the big question.",
    progress: "One little question. A whole heart behind it.",
  },
  {
    chapter: "ONE LITTLE QUESTION",
    lines: [`${recipient},`, "tharaha nathi wela,", "would you be mine?"],
    message: "Through the happy moments, the silly arguments, and everything in between... I really love you. So, can you forgive me and be mine?",
    image: "love.png",
    alt: "A little panda offering you its heart",
    caption: "tharaha wenna epa... will you be mine?",
    hint: "",
    progress: "My favorite next chapter could be us.",
  },
];

const byId = (id) => document.getElementById(id);
const headline = byId("headline");
const sticker = byId("sticker");
const progressSteps = [...byId("progress").children];
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const shyNoButton = byId("shy-no-button");
let step = 0;
let dodgeCount = 0;
let noOffset = { x: 0, y: 0 };
let showingNoReaction = false;
let motionPaused = reducedMotion.matches;
let celebrationTimer;

function setHeadline(lines) {
  headline.replaceChildren();
  lines.forEach((line, index) => {
    if (index > 0) headline.append(document.createElement("br"));
    const text = document.createElement(index === lines.length - 1 ? "em" : "span");
    text.textContent = line;
    headline.append(text);
  });
}

function showActions(active) {
  resetNoPosition();
  ["story", "proposal", "success", "decline"].forEach((name) => {
    byId(`${name}-actions`).hidden = name !== active;
  });
}

function setArtwork(note) {
  showingNoReaction = false;
  sticker.classList.remove("reaction-sticker");
  sticker.src = `assets/${note.image}`;
  sticker.alt = note.alt;
  byId("illustration-caption").textContent = note.caption;
}

function updateNoReactionSource() {
  const source = motionPaused || reducedMotion.matches
    ? "assets/milk-and-mocha-still.png"
    : "assets/milk-and-mocha.gif";
  // Repeated hover attempts should not restart the same animation.
  if (sticker.getAttribute("src") !== source) sticker.src = source;
}

function showNoReaction() {
  showingNoReaction = true;
  sticker.classList.add("reaction-sticker");
  sticker.alt = "Mocha the little brown bear crying and wiping away tears";
  byId("illustration-caption").textContent = "aney tharaha wenna epa... man adarei nee 🥺💔";
  updateNoReactionSource();
}

function reveal(focus = true) {
  if (!reducedMotion.matches && !motionPaused && byId("letter-content").animate) {
    byId("letter-content").animate(
      [{ opacity: 0, transform: "translateY(9px)" }, { opacity: 1, transform: "translateY(0)" }],
      { duration: 350, easing: "ease-out" },
    );
  }
  if (focus) headline.focus({ preventScroll: true });
}

function renderStep(focus = true) {
  const note = notes[step];
  const isQuestion = step === notes.length - 1;
  byId("eyebrow").textContent = `${String(step + 1).padStart(2, "0")} — ${note.chapter}`;
  setHeadline(note.lines);
  byId("message").textContent = note.message;
  setArtwork(note);
  showActions(isQuestion ? "proposal" : "story");
  if (!isQuestion) {
    byId("next-button").replaceChildren(document.createTextNode(`${note.button} `));
    const arrow = document.createElement("span");
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = "→";
    byId("next-button").append(arrow);
  }
  byId("action-note").textContent = note.hint;
  byId("progress-caption").textContent = note.progress;
  byId("back-button").disabled = step === 0;
  byId("skip-button").hidden = isQuestion;
  byId("replay-button").hidden = true;
  byId("yes-button").style.setProperty("--extra-love", 0);
  dodgeCount = 0;
  progressSteps.forEach((item, index) => {
    item.classList.toggle("complete", index < step);
    if (index === step) item.setAttribute("aria-current", "step");
    else item.removeAttribute("aria-current");
  });
  reveal(focus);
  // Warm just the next illustration without blocking navigation.
  if (notes[step + 1]) {
    const nextImage = new Image();
    nextImage.src = `assets/${notes[step + 1].image}`;
  }
  if (isQuestion) {
    const reactionImage = new Image();
    reactionImage.src = "assets/milk-and-mocha.gif";
  }
}

function stopConfetti() {
  window.clearTimeout(celebrationTimer);
  byId("confetti").replaceChildren();
}

function celebrate() {
  stopConfetti();
  if (reducedMotion.matches || motionPaused) return;
  const fragment = document.createDocumentFragment();
  const colors = ["#ba526b", "#dfa290", "#c28c9b", "#cba76d"];
  for (let i = 0; i < 48; i += 1) {
    const heart = document.createElement("span");
    heart.className = "confetti-piece";
    heart.textContent = i % 3 === 0 ? "✦" : "♥";
    heart.style.cssText = `--left:${Math.random() * 100}%;--size:${10 + Math.random() * 13}px;--color:${colors[i % colors.length]};--duration:${3 + Math.random() * 2}s;--delay:${Math.random() * 1.1}s;--drift:${Math.random() * 150 - 75}px;--rotation:${Math.random() * 360 - 180}deg;`;
    fragment.append(heart);
  }
  byId("confetti").append(fragment);
  celebrationTimer = window.setTimeout(stopConfetti, 6500);
}

function showEnding(accepted) {
  byId("eyebrow").textContent = accepted ? "YAY! FORGIVEN & IN LOVE ♡" : "STILL ALL MY LOVE FOR YOU";
  setHeadline(accepted ? [`Yay, ${recipient}! ♡`, "Tharaha na neda?", "Man godak adarei!"] : ["Tharaha wenna epa,", recipient + ".", "Man adarei nee."]);
  byId("message").textContent = accepted
    ? "I’m smiling at my screen like a complete fool right now! Thank you for forgiving me and making my heart so happy. Here’s to us, more smiles, and endless love. ♡"
    : "I'm still so sorry for making you upset. No matter what, my love for you hasn't changed one bit. Sending you the warmest hug.";
  setArtwork(accepted
    ? { image: "cuddles.png", alt: "Two happy pandas cuddling", caption: "man oyata godak godak adarei ♡" }
    : { image: "bunny.png", alt: "A sweet bunny with a pink bow", caption: "a little kindness & endless love, always." });
  if (!accepted) showNoReaction();
  showActions(accepted ? "success" : "decline");
  byId("action-note").textContent = accepted ? "P.S. There’s one last note with your name on it." : "Take care of that lovely heart of yours.";
  byId("progress-caption").textContent = accepted ? "And just like that, our sweet story continues." : "Sent with all my love. Please smile again soon.";
  byId("back-button").disabled = true;
  byId("skip-button").hidden = true;
  byId("replay-button").hidden = !accepted;
  progressSteps.forEach((item) => {
    item.removeAttribute("aria-current");
    item.classList.add("complete");
  });
  reveal();
  if (accepted) celebrate();
}

function restart() {
  stopConfetti();
  step = 0;
  renderStep();
}

byId("next-button").addEventListener("click", () => {
  step = Math.min(step + 1, notes.length - 1);
  renderStep();
});
byId("back-button").addEventListener("click", () => {
  step = Math.max(0, step - 1);
  renderStep();
});
byId("skip-button").addEventListener("click", () => {
  step = notes.length - 1;
  renderStep();
});
function resetNoPosition() {
  noOffset = { x: 0, y: 0 };
  shyNoButton.style.removeProperty("--no-x");
  shyNoButton.style.removeProperty("--no-y");
  shyNoButton.classList.remove("is-running");
}

function moveNoButton(event) {
  if (byId("proposal-actions").hidden) return;
  showNoReaction();
  if (reducedMotion.matches) return;
  // Finish the note's entrance so all positions use its settled layout.
  byId("letter-content").getAnimations().forEach((animation) => animation.finish());
  dodgeCount += 1;
  byId("yes-button").style.setProperty("--extra-love", Math.min(dodgeCount, 3));
  const button = shyNoButton.getBoundingClientRect();
  const card = document.querySelector(".love-card").getBoundingClientRect();
  const padding = 16;
  const left = Math.max(card.left, 0) + padding;
  let top = Math.max(card.top, 0) + padding;
  const right = Math.min(card.right, document.documentElement.clientWidth) - button.width - padding;
  let bottom = Math.min(card.bottom, window.innerHeight) - button.height - padding;
  if (bottom <= top) {
    top = card.top + padding;
    bottom = card.bottom - button.height - padding;
  }
  if (right < left || bottom < top) return;

  const otherButtons = [...document.querySelectorAll("button")]
    .filter((element) => element !== shyNoButton)
    .map((element) => element.getBoundingClientRect())
    .filter((rect) => rect.width > 0 && rect.height > 0);

  // Sample the visible card, leaving the cursor and other buttons clear.
  const destinations = [];
  for (let row = 0; row < 5; row += 1) {
    for (let column = 0; column < 5; column += 1) {
      const x = left + (right - left) * column / 4;
      const y = top + (bottom - top) * row / 4;
      const nearCursor = event.clientX >= x - 36 && event.clientX <= x + button.width + 36
        && event.clientY >= y - 36 && event.clientY <= y + button.height + 36;
      const overlapsButton = otherButtons.some((rect) => x < rect.right + 12
        && x + button.width > rect.left - 12 && y < rect.bottom + 12 && y + button.height > rect.top - 12);
      if (!nearCursor && !overlapsButton && Math.hypot(x - button.left, y - button.top) > 70) {
        destinations.push({ x, y });
      }
    }
  }
  if (destinations.length === 0) return;
  const destination = destinations[Math.floor(Math.random() * destinations.length)];
  noOffset = {
    x: destination.x - (button.left - noOffset.x),
    y: destination.y - (button.top - noOffset.y),
  };
  shyNoButton.style.setProperty("--no-x", `${noOffset.x}px`);
  shyNoButton.style.setProperty("--no-y", `${noOffset.y}px`);
  shyNoButton.classList.add("is-running");
  byId("action-note").textContent = "";
}

shyNoButton.addEventListener("pointerenter", (event) => {
  if (event.pointerType !== "touch") moveNoButton(event);
});
shyNoButton.addEventListener("click", (event) => {
  // Keyboard activation remains usable; a tap makes the button hop on phones.
  if (event.detail === 0 || reducedMotion.matches) showEnding(false);
  else moveNoButton(event);
});
window.addEventListener("resize", resetNoPosition);
window.addEventListener("scroll", resetNoPosition, { passive: true });
byId("yes-button").addEventListener("click", () => showEnding(true));
byId("no-button")?.addEventListener("click", () => showEnding(false));
byId("replay-button").addEventListener("click", restart);
byId("return-button").addEventListener("click", restart);
byId("note-button").addEventListener("click", () => byId("love-note").showModal());
byId("close-note").addEventListener("click", () => byId("love-note").close());
byId("love-note").addEventListener("click", (event) => {
  if (event.target !== byId("love-note")) return;
  const bounds = byId("love-note").getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) byId("love-note").close();
});

function updateMotion() {
  document.body.classList.toggle("motion-paused", motionPaused);
  byId("motion-toggle").setAttribute("aria-pressed", String(motionPaused));
  byId("motion-label").textContent = motionPaused ? "Hearts paused" : "Pause hearts";
  // Respect the device setting even if the animation toggle is clicked.
  byId("motion-toggle").hidden = reducedMotion.matches;
  if (motionPaused) stopConfetti();
  if (showingNoReaction) updateNoReactionSource();
}
byId("motion-toggle").addEventListener("click", () => {
  motionPaused = !motionPaused;
  updateMotion();
});
reducedMotion.addEventListener("change", () => {
  resetNoPosition();
  motionPaused = reducedMotion.matches;
  updateMotion();
});

const hearts = document.createDocumentFragment();
for (let i = 0; i < 14; i += 1) {
  const heart = document.createElement("span");
  heart.className = "floating-heart";
  heart.textContent = i % 3 === 0 ? "♥" : "♡";
  heart.style.cssText = `left:${(i * 7.3 + 2) % 100}%;font-size:${14 + (i % 4) * 7}px;--duration:${15 + (i % 5) * 3}s;--delay:${-i * 2.7}s;`;
  hearts.append(heart);
}
byId("floating-hearts").append(hearts);
updateMotion();
renderStep(false);
