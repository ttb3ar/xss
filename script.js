// ⚠️ Unsafe handler — intentionally vulnerable
function handleUnsafe() {
  const input = document.getElementById('unsafeInput').value;
  const output = document.getElementById('unsafeOutput');
  output.innerHTML = input; // 🚨 XSS vulnerable!
}

// ✅ Safe handler — uses textContent to avoid XSS
function handleSafe() {
  const input = document.getElementById('safeInput').value;
  const output = document.getElementById('safeOutput');
  output.textContent = input; // ✅ Escapes all HTML/script
}
