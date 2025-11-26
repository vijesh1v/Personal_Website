// ====== CONFIG ======
const EDIT_TOKEN = "my-secret-token"; // <-- change this to your own token!
const STORAGE_KEY = "personalSiteContent";
const LOGIN_KEY = "personalSiteLoggedIn";

// Random image sets (against original images)
const randomImages = {
  heroImage: [
    "https://res.cloudinary.com/ddoajzjwt/image/upload/v1764180979/IMG20251105123042_cojkcs.png",
    "https://res.cloudinary.com/ddoajzjwt/image/upload/v1764180979/IMG20251006093743_hvmnne.png",
    "https://res.cloudinary.com/ddoajzjwt/image/upload/v1764180979/IMG20251005180953_azobi3.png"
  ],
  project1Image: [
    "https://picsum.photos/seed/p1a/600/400",
    "https://picsum.photos/seed/p1b/600/400",
    "https://picsum.photos/seed/p1c/600/400"
  ],
  project2Image: [
    "https://picsum.photos/seed/p2a/600/400",
    "https://picsum.photos/seed/p2b/600/400",
    "https://picsum.photos/seed/p2c/600/400"
  ],
  project3Image: [
    "https://picsum.photos/seed/p3a/600/400",
    "https://picsum.photos/seed/p3b/600/400",
    "https://picsum.photos/seed/p3c/600/400"
  ],
  gallery1Image: [
    "https://picsum.photos/seed/g1a/400/300",
    "https://picsum.photos/seed/g1b/400/300",
    "https://picsum.photos/seed/g1c/400/300"
  ],
  gallery2Image: [
    "https://picsum.photos/seed/g2a/400/300",
    "https://picsum.photos/seed/g2b/400/300",
    "https://picsum.photos/seed/g2c/400/300"
  ],
  gallery3Image: [
    "https://picsum.photos/seed/g3a/400/300",
    "https://picsum.photos/seed/g3b/400/300",
    "https://picsum.photos/seed/g3c/400/300"
  ],
  gallery4Image: [
    "https://picsum.photos/seed/g4a/400/300",
    "https://picsum.photos/seed/g4b/400/300",
    "https://picsum.photos/seed/g4c/400/300"
  ]
};

// Store original default content in-memory
const defaultContent = {};

// ====== HELPERS ======
function getSavedContent() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (e) {
    console.warn("Failed to parse saved content", e);
    return {};
  }
}

function saveContentToStorage(content) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
}

function isLoggedIn() {
  return localStorage.getItem(LOGIN_KEY) === "true";
}

function setLoggedIn(value) {
  if (value) {
    localStorage.setItem(LOGIN_KEY, "true");
  } else {
    localStorage.removeItem(LOGIN_KEY);
  }
}

// ====== CONTENT HANDLING ======
function initDefaultContent() {
  const textEls = document.querySelectorAll("[data-edit-type='text']");
  const imageEls = document.querySelectorAll("[data-edit-type='image']");

  textEls.forEach((el) => {
    const key = el.dataset.editKey;
    if (!key) return;
    defaultContent[key] = el.innerHTML.trim();
  });

  imageEls.forEach((el) => {
    const parent = el.closest(".editable-image");
    const key = parent?.dataset.editKey;
    if (!key) return;
    defaultContent[key] = el.getAttribute("src");
  });
}

function applyContentFromStorage() {
  const saved = getSavedContent();

  const textEls = document.querySelectorAll("[data-edit-type='text']");
  const imageEls = document.querySelectorAll("[data-edit-type='image']");

  textEls.forEach((el) => {
    const key = el.dataset.editKey;
    if (!key) return;
    if (saved[key] !== undefined) {
      el.innerHTML = saved[key];
    }
  });

  imageEls.forEach((el) => {
    const parent = el.closest(".editable-image");
    const key = parent?.dataset.editKey;
    if (!key) return;
    if (saved[key] !== undefined) {
      el.setAttribute("src", saved[key]);
    }
  });
}

function collectCurrentContent() {
  const content = {};
  const textEls = document.querySelectorAll("[data-edit-type='text']");
  const imageEls = document.querySelectorAll("[data-edit-type='image']");

  textEls.forEach((el) => {
    const key = el.dataset.editKey;
    if (!key) return;
    content[key] = el.innerHTML.trim();
  });

  imageEls.forEach((el) => {
    const parent = el.closest(".editable-image");
    const key = parent?.dataset.editKey;
    if (!key) return;
    content[key] = el.getAttribute("src");
  });

  return content;
}

// ====== EDIT MODE ======
function enterEditMode() {
  document.body.classList.add("edit-mode");

  // Toggle button label
  const loginBtn = document.getElementById("loginBtn");
  if (loginBtn) {
    loginBtn.textContent = "Logout";
  }

  // Make text editable
  const textEls = document.querySelectorAll("[data-edit-type='text']");
  textEls.forEach((el) => {
    el.setAttribute("contenteditable", "true");
  });
}

function exitEditMode() {
  document.body.classList.remove("edit-mode");

  const loginBtn = document.getElementById("loginBtn");
  if (loginBtn) {
    loginBtn.textContent = "Login";
  }

  const textEls = document.querySelectorAll("[data-edit-type='text']");
  textEls.forEach((el) => {
    el.removeAttribute("contenteditable");
  });
}

// ====== RANDOM IMAGES ======
function applyRandomImageForKey(key) {
  const options = randomImages[key];
  if (!options || options.length === 0) {
    alert("No random images configured for this image.");
    return;
  }
  const randomUrl = options[Math.floor(Math.random() * options.length)];

  const wrapper = document.querySelector(`.editable-image[data-edit-key="${key}"]`);
  if (!wrapper) return;
  const img = wrapper.querySelector("img[data-edit-type='image']");
  if (!img) return;

  img.setAttribute("src", randomUrl);
}

function revertImageForKey(key) {
  const original = defaultContent[key];
  if (!original) return;

  const wrapper = document.querySelector(`.editable-image[data-edit-key="${key}"]`);
  if (!wrapper) return;
  const img = wrapper.querySelector("img[data-edit-type='image']");
  if (!img) return;

  img.setAttribute("src", original);
}

// ====== LOGIN MODAL ======
function openLoginModal() {
  const modal = document.getElementById("loginModal");
  const tokenInput = document.getElementById("tokenInput");
  const errorEl = document.getElementById("loginError");

  if (modal) {
    modal.style.display = "flex";
  }
  if (tokenInput) {
    tokenInput.value = "";
    tokenInput.focus();
  }
  if (errorEl) {
    errorEl.textContent = "";
  }
}

function closeLoginModal() {
  const modal = document.getElementById("loginModal");
  if (modal) {
    modal.style.display = "none";
  }
}

function handleTokenSubmit() {
  const tokenInput = document.getElementById("tokenInput");
  const errorEl = document.getElementById("loginError");
  const token = tokenInput?.value || "";

  if (token === EDIT_TOKEN) {
    setLoggedIn(true);
    closeLoginModal();
    enterEditMode();
  } else {
    if (errorEl) {
      errorEl.textContent = "Invalid token. Please try again.";
    }
  }
}

// ====== EVENT LISTENERS ======
function setupImageControlEvents() {
  // Change URL
  document.querySelectorAll(".change-url-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const wrapper = btn.closest(".editable-image");
      if (!wrapper) return;
      const key = wrapper.dataset.editKey;
      const img = wrapper.querySelector("img[data-edit-type='image']");
      if (!img || !key) return;

      const current = img.getAttribute("src") || "";
      const newUrl = prompt("Enter image URL:", current);
      if (newUrl) {
        img.setAttribute("src", newUrl.trim());
      }
    });
  });

  // Random
  document.querySelectorAll(".random-image-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const wrapper = btn.closest(".editable-image");
      if (!wrapper) return;
      const key = wrapper.dataset.editKey;
      if (!key) return;

      applyRandomImageForKey(key);
    });
  });

  // Original
  document.querySelectorAll(".revert-image-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const wrapper = btn.closest(".editable-image");
      if (!wrapper) return;
      const key = wrapper.dataset.editKey;
      if (!key) return;

      revertImageForKey(key);
    });
  });
}

function setupGlobalEvents() {
  const loginBtn = document.getElementById("loginBtn");
  const saveBtn = document.getElementById("saveContentBtn");
  const cancelBtn = document.getElementById("cancelContentBtn");
  const closeLoginModalBtn = document.getElementById("closeLoginModal");
  const submitTokenBtn = document.getElementById("submitTokenBtn");
  const tokenInput = document.getElementById("tokenInput");

  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      if (isLoggedIn()) {
        // logout
        setLoggedIn(false);
        exitEditMode();
      } else {
        openLoginModal();
      }
    });
  }

  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      const content = collectCurrentContent();
      saveContentToStorage(content);
      alert("Changes saved!");
    });
  }

  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      // reload from storage (or defaults if none)
      const saved = getSavedContent();
      if (Object.keys(saved).length === 0) {
        // no saved content – reload defaults
        Object.entries(defaultContent).forEach(([key, value]) => {
          const textEl = document.querySelector(
            `[data-edit-type='text'][data-edit-key='${key}']`
          );
          const imgWrapper = document.querySelector(
            `.editable-image[data-edit-key='${key}']`
          );
          if (textEl) textEl.innerHTML = value;
          if (imgWrapper) {
            const img = imgWrapper.querySelector("img[data-edit-type='image']");
            if (img) img.setAttribute("src", value);
          }
        });
      } else {
        applyContentFromStorage();
      }
    });
  }

  if (closeLoginModalBtn) {
    closeLoginModalBtn.addEventListener("click", closeLoginModal);
  }

  if (submitTokenBtn) {
    submitTokenBtn.addEventListener("click", handleTokenSubmit);
  }

  if (tokenInput) {
    tokenInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        handleTokenSubmit();
      }
    });
  }

  // Close modal on background click
  const loginModal = document.getElementById("loginModal");
  if (loginModal) {
    loginModal.addEventListener("click", (e) => {
      if (e.target === loginModal) {
        closeLoginModal();
      }
    });
  }
}

// ====== INIT ======
window.addEventListener("DOMContentLoaded", () => {
  initDefaultContent();
  applyContentFromStorage();
  setupImageControlEvents();
  setupGlobalEvents();

  // Restore login state
  if (isLoggedIn()) {
    enterEditMode();
  } else {
    exitEditMode();
  }
});
