const themeToggle = document.getElementById("checkbox");
const langToggle = document.getElementById("language-checkbox");
const langLabel = document.querySelector(".lang-label");
const title = document.getElementById("title");

let isJapanese = false;

// Language translations object
const translations = {
  en: {
    title: "XSS Playground",
    subtitle: "This is for educational purposes only. Do NOT use these techniques maliciously.",
    unsafeLabel: "Vulnerable Input (Unsafe):",
    unsafePlaceholder: "Enter some HTML or script...",
    unsafeSubmit: "Test XSS Vulnerability",
    safeLabel: "Sanitized Input (Safe):",
    safePlaceholder: "Try the same input here...",
    safeSubmit: "Test Sanitized Input",
    infoTitle: "How it works:",
    infoText: "The unsafe section directly inserts your input as HTML (innerHTML), while the safe section treats it as plain text (textContent). Try entering: <script>alert('XSS')</script> or <img src=x onerror=alert('XSS')>",
    footer: "Created for cybersecurity learning. Inspect the code to better understand how XSS works.",
    footerCredit: "Created by TTB3AR",
    scriptExecuted: "Script executed",
    scriptError: "Script error: "
  },
  jp: {
    title: "XSS プレイグラウンド",
    subtitle: "これは教育目的のみです。これらの技術を悪意のあることに使用しないでください。",
    unsafeLabel: "脆弱な入力（安全でない）:",
    unsafePlaceholder: "HTMLまたはスクリプトを入力してください...",
    unsafeSubmit: "XSS脆弱性をテスト",
    safeLabel: "サニタイズされた入力（安全）:",
    safePlaceholder: "同じ入力をここで試してください...",
    safeSubmit: "サニタイズされた入力をテスト",
    infoTitle: "動作原理:",
    infoText: "安全でないセクションは入力をHTMLとして直接挿入し（innerHTML）、安全セクションはプレーンテキストとして扱います（textContent）。以下を入力してみてください: <script>alert('XSS')</script> または <img src=x onerror=alert('XSS')>",
    footer: "サイバーセキュリティ学習用に作成。XSSの仕組みを理解するためにコードを調べてください。",
    footerCredit: "TTB3AR制作",
    scriptExecuted: "スクリプトが実行されました",
    scriptError: "スクリプトエラー: "
  }
};

function handleUnsafe() {
  const input = document.getElementById('unsafeInput').value;
  const output = document.getElementById('unsafeOutput');
  const currentLang = document.documentElement.getAttribute('data-language') || 'en';
  
  // Check if input contains script tags and execute them
  if (input.includes('<script>')) {
    const scriptContent = input.match(/<script>(.*?)<\/script>/);
    if (scriptContent && scriptContent[1]) {
      try {
        eval(scriptContent[1]); // This makes the XSS actually work
        // Remove script tags before displaying to prevent double execution
        const displayInput = input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '[SCRIPT EXECUTED]');
        const executedText = translations[currentLang].scriptExecuted;
        output.innerHTML = displayInput + '<br><span style="color: var(--danger);">' + executedText + '</span>';
      } catch (error) {
        const errorText = translations[currentLang].scriptError;
        output.innerHTML = input + '<br><span style="color: var(--danger);">' + errorText + error.message + '</span>';
      }
    }
  } else {
    output.innerHTML = input; // For other HTML tags
  }
}

function handleSafe() {
  const input = document.getElementById('safeInput').value;
  const output = document.getElementById('safeOutput');
  output.textContent = input; // Escapes all HTML/script - safe approach
}

// Local Storage Functions (same as hashing demo)
function saveTheme(theme) {
  try {
    localStorage.setItem('xssPlayground_theme', theme);
  } catch (error) {
    console.warn('Could not save theme preference:', error);
  }
}

function loadTheme() {
  try {
    return localStorage.getItem('xssPlayground_theme') || 'light';
  } catch (error) {
    console.warn('Could not load theme preference:', error);
    return 'light';
  }
}

function saveLanguage(language) {
  try {
    localStorage.setItem('xssPlayground_language', language);
  } catch (error) {
    console.warn('Could not save language preference:', error);
  }
}

function loadLanguage() {
  try {
    return localStorage.getItem('xssPlayground_language') || 'en';
  } catch (error) {
    console.warn('Could not load language preference:', error);
    return 'en';
  }
}

// Theme handling
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  saveTheme(theme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
}

function initializeTheme() {
  const savedTheme = loadTheme();
  setTheme(savedTheme);
  
  // Update the toggle switch to match the saved theme
  themeToggle.checked = (savedTheme === 'dark');
}

// Language handling
function setLanguage(language) {
  document.documentElement.setAttribute('data-language', language);
  isJapanese = (language === 'jp');
  updateUILanguage(language);
  saveLanguage(language);
}

function toggleLanguage() {
  const contentElements = document.querySelectorAll('#title, #subtitle, #unsafe-label, #safe-label, #unsafe-submit, #safe-submit, #info-title, #info-text, #footer-text');
  
  contentElements.forEach(element => {
    element.classList.add('transition-content');
  });
  
  document.body.offsetHeight;
  
  contentElements.forEach(element => {
    element.classList.add('fade-out');
  });
  
  setTimeout(() => {
    const newLanguage = isJapanese ? 'en' : 'jp';
    setLanguage(newLanguage);
    
    langLabel.textContent = isJapanese ? "JP" : "EN";
    
    showLanguageIndicator(newLanguage);
    
    setTimeout(() => {
      contentElements.forEach(element => {
        element.classList.remove('fade-out');
      });
      
      setTimeout(() => {
        contentElements.forEach(element => {
          element.classList.remove('transition-content');
        });
      }, 300);
    }, 50);
  }, 300);
}

function initializeLanguage() {
  const savedLanguage = loadLanguage();
  isJapanese = (savedLanguage === 'jp');
  
  // Update the toggle switch to match the saved language
  langToggle.checked = isJapanese;
  langLabel.textContent = isJapanese ? "JP" : "EN";
  
  setLanguage(savedLanguage);
}

function updateUILanguage(language) {
  const texts = translations[language];
  
  document.getElementById('title').textContent = texts.title;
  document.getElementById('subtitle').textContent = texts.subtitle;
  document.getElementById('unsafe-label').textContent = texts.unsafeLabel;
  document.getElementById('unsafeInput').placeholder = texts.unsafePlaceholder;
  document.getElementById('unsafe-submit').textContent = texts.unsafeSubmit;
  document.getElementById('safe-label').textContent = texts.safeLabel;
  document.getElementById('safeInput').placeholder = texts.safePlaceholder;
  document.getElementById('safe-submit').textContent = texts.safeSubmit;
  document.getElementById('info-title').textContent = texts.infoTitle;
  document.getElementById('info-text').textContent = texts.infoText; 
  document.getElementById('footer-text').textContent = texts.footer;
  document.getElementById('footer-credit').textContent = texts.footerCredit;
  document.title = texts.title;
}

function showLanguageIndicator(language) {
  let indicator = document.querySelector('.language-indicator');
  
  if (!indicator) {
    indicator = document.createElement('div');
    indicator.className = 'language-indicator';
    document.body.appendChild(indicator);
  }
  
  indicator.textContent = language === 'en' ? 'English' : '日本語';
  indicator.classList.add('show');
  
  setTimeout(() => {
    indicator.classList.remove('show');
  }, 1500);
}

// Clear output functions
function clearUnsafeOutput() {
  document.getElementById('unsafeOutput').innerHTML = '';
}

function clearSafeOutput() {
  document.getElementById('safeOutput').textContent = '';
}

// Enhanced keyboard support
function handleKeyboardNavigation(event) {
  // ESC key to clear outputs
  if (event.key === 'Escape') {
    clearUnsafeOutput();
    clearSafeOutput();
  }
  
  // Alt + T for theme toggle
  if (event.altKey && event.key.toLowerCase() === 't') {
    event.preventDefault();
    themeToggle.click();
  }
  
  // Alt + L for language toggle
  if (event.altKey && event.key.toLowerCase() === 'l') {
    event.preventDefault();
    langToggle.click();
  }
}

// Enhanced input validation and feedback
function validateInput(inputValue) {
  const currentLang = document.documentElement.getAttribute('data-language') || 'en';
  const messages = {
    en: {
      empty: 'Input cannot be empty',
      tooLong: 'Input too long (max 1000 characters)'
    },
    jp: {
      empty: '入力は空にできません',
      tooLong: '入力が長すぎます（最大1000文字）'
    }
  };
  
  if (!inputValue.trim()) {
    return { valid: false, message: messages[currentLang].empty };
  }
  
  if (inputValue.length > 1000) {
    return { valid: false, message: messages[currentLang].tooLong };
  }
  
  return { valid: true, message: '' };
}

// Enhanced handleUnsafe with validation
function handleUnsafeEnhanced() {
  const input = document.getElementById('unsafeInput').value;
  const output = document.getElementById('unsafeOutput');
  
  const validation = validateInput(input);
  if (!validation.valid) {
    output.innerHTML = `<span style="color: var(--danger);">Error: ${validation.message}</span>`;
    return;
  }
  
  // Add timestamp for better tracking
  const timestamp = new Date().toLocaleTimeString();
  output.innerHTML = `<small style="color: var(--text-color); opacity: 0.7;">Executed at ${timestamp}:</small><br><br>` + input;
}

// Error handling wrapper
function withErrorHandling(fn, fallback) {
  return function(...args) {
    try {
      return fn.apply(this, args);
    } catch (error) {
      console.error('Error in function:', error);
      if (fallback) fallback(error);
    }
  };
}

/**
 * Initialize the application
 */
function init() {
  try {
    // Initialize saved preferences first
    initializeTheme();
    initializeLanguage();
    
    // Set up event listeners with error handling
    if (themeToggle) {
      themeToggle.addEventListener("change", withErrorHandling(toggleTheme));
    }
    
    if (langToggle) {
      langToggle.addEventListener("change", withErrorHandling(toggleLanguage));
    }
    
    // Add keyboard event listeners for better UX
    const unsafeInput = document.getElementById('unsafeInput');
    if (unsafeInput) {
      unsafeInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          handleUnsafe();
        }
      });
    }
    
    const safeInput = document.getElementById('safeInput');
    if (safeInput) {
      safeInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          handleSafe();
        }
      });
    }
    
    // Add global keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardNavigation);
    
    // Add click handlers for buttons (fallback if onclick doesn't work)
    const unsafeButton = document.getElementById('unsafe-submit');
    if (unsafeButton) {
      unsafeButton.addEventListener('click', handleUnsafe);
    }
    
    const safeButton = document.getElementById('safe-submit');
    if (safeButton) {
      safeButton.addEventListener('click', handleSafe);
    }
    
    // Add focus management
    document.addEventListener('DOMContentLoaded', function() {
      const firstInput = document.getElementById('unsafeInput');
      if (firstInput) {
        firstInput.focus();
      }
    });
    
    console.log('XSS Playground initialized successfully');
    
  } catch (error) {
    console.error('Error initializing XSS Playground:', error);
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Export functions for global access (maintaining compatibility with HTML onclick handlers)
window.handleUnsafe = handleUnsafe;
window.handleSafe = handleSafe;
