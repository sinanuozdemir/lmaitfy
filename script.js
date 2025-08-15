/* Core behavior for LMCTFY */
(function () {
  const queryInput = document.getElementById('query');
  const openBtn = document.getElementById('open-btn');
  const linkBtn = document.getElementById('link-btn');
  const share = document.getElementById('share');
  const shareInput = document.getElementById('share-url');
  const copyBtn = document.getElementById('copy-btn');
  const previewBtn = document.getElementById('preview-btn');
  const shortenBtn = document.getElementById('shorten-btn');
  const tw = document.getElementById('tw-share');
  const rd = document.getElementById('rd-share');
  const fb = document.getElementById('fb-share');
  const ln = document.getElementById('ln-share');

  const LMCTFY_BASE = location.origin + location.pathname.replace(/[^/]*$/, '');
  const CHATGPT_URL = 'https://chat.openai.com/?q=';

  function buildChatGPTUrl(q) {
    return CHATGPT_URL + encodeURIComponent(q);
  }

  function buildShareUrl(q) {
    // The shareable link should open ChatGPT with the prefilled query
    return buildChatGPTUrl(q);
  }

  function buildPageUrl(q) {
    const url = new URL(LMCTFY_BASE, location.origin);
    url.searchParams.set('q', q);
    return url.toString();
  }

  function getQueryFromUrl() {
    const q = new URLSearchParams(location.search).get('q');
    return q || '';
  }

  function setShareTargets(q) {
    const url = buildShareUrl(q);
    shareInput.value = url;
    const text = encodeURIComponent(`Let me ChatGPT that for you: ${q}`);
    const u = encodeURIComponent(url);
    tw.href = `https://twitter.com/intent/tweet?text=${text}&url=${u}`;
    rd.href = `https://www.reddit.com/submit?title=${text}&url=${u}`;
    fb.href = `https://www.facebook.com/sharer/sharer.php?u=${u}`;
    ln.href = `https://www.linkedin.com/sharing/share-offsite/?url=${u}`;
  }

  function toast(message) {
    const tpl = document.getElementById('toast-template');
    const el = tpl.content.firstElementChild.cloneNode(true);
    el.textContent = message;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1600);
  }

  function showShare(q) {
    setShareTargets(q);
    share.classList.remove('hidden');
  }

  function openChat(q) {
    const url = buildChatGPTUrl(q);
    window.open(url, '_blank', 'noopener');
  }

  function handlePrimaryAction() {
    const q = (queryInput.value || '').trim();
    if (!q) {
      toast('Please enter a question.');
      queryInput.focus();
      return;
    }
    openChat(q);
    showShare(q);
    history.replaceState({}, '', buildPageUrl(q));
  }

  // Wire events
  openBtn.addEventListener('click', handlePrimaryAction);
  linkBtn.addEventListener('click', () => {
    const q = (queryInput.value || '').trim();
    if (!q) {
      toast('Please enter a question.');
      queryInput.focus();
      return;
    }
    showShare(q);
    history.replaceState({}, '', buildPageUrl(q));
  });

  queryInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      handlePrimaryAction();
    }
  });

  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(shareInput.value);
      toast('Link copied to clipboard');
    } catch (_) {
      shareInput.select();
      document.execCommand('copy');
      toast('Link copied');
    }
  });

  previewBtn.addEventListener('click', () => {
    const q = (queryInput.value || '').trim();
    if (!q) return;
    openChat(q);
  });

  shortenBtn.addEventListener('click', async () => {
    // Placeholder for URL shortener integration. Keeps UX parity.
    toast('URL shortener not configured.');
  });

  // On load: if there is a q param, populate and show share, but don't auto-open.
  const initial = getQueryFromUrl();
  if (initial) {
    queryInput.value = initial;
    showShare(initial);
  }
})();


