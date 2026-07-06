/* ═══════════════════════════════════════════════════════════════
   The Book Club — Script
   Search, scroll reveal, nav toggle
   ═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  /* ── Elements ── */
  const searchInput   = document.getElementById('searchInput');
  const booksGrid     = document.getElementById('booksGrid');
  const searchCount   = document.getElementById('searchCount');
  const nav           = document.querySelector('.nav');
  const navToggle     = document.querySelector('.nav__toggle');
  const navLinks      = document.querySelector('.nav__links');

  /* ── Render books ── */
  function renderBooks(list) {
    if (list.length === 0) {
      booksGrid.innerHTML = `
        <div class="books-empty">
          <div class="books-empty__icon">📚</div>
          <p class="books-empty__text">No books match your search. Try a different title or author.</p>
        </div>`;
      searchCount.textContent = '0 books found';
      return;
    }

    booksGrid.innerHTML = list
      .map(
        (book) => `
        <div class="book-card">
          <div class="book-card__title">${escapeHTML(book.title)}</div>
          <div class="book-card__author">${escapeHTML(book.author)}</div>
        </div>`
      )
      .join('');

    searchCount.textContent = `${list.length} book${list.length !== 1 ? 's' : ''} found`;
  }

  /* ── Search ── */
  function handleSearch() {
    const query = searchInput.value.trim().toLowerCase();

    if (!query) {
      renderBooks(books);
      return;
    }

    const filtered = books.filter(
      (book) =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query)
    );

    renderBooks(filtered);
  }

  searchInput.addEventListener('input', handleSearch);

  // Initial render
  renderBooks(books);

  /* ── Nav scroll shadow ── */
  function onScroll() {
    if (window.scrollY > 10) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Mobile nav toggle ── */
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Close mobile nav on link click
  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  /* ── Scroll Reveal ── */
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  reveals.forEach((el) => observer.observe(el));

  /* ── Smooth scroll for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const y = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });
});

/* ── Utility: Escape HTML ── */
function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
