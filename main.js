const pdfModal = document.getElementById('pdfModal');
const pdfViewerFrame = document.getElementById('pdfViewerFrame');
const pdfViewerImage = document.getElementById('pdfViewerImage');
const pdfModalTitle = document.getElementById('pdfModalTitle');
const pdfDownloadBtn = document.getElementById('pdfDownloadBtn');
const pdfModalClose = document.getElementById('pdfModalClose');

const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];

function openPdfModal(fileUrl, title = 'Document Preview') {
  pdfModalTitle.textContent = title;
  pdfDownloadBtn.href = fileUrl;

  const ext = fileUrl.split('.').pop().split(/[#?]/)[0].toLowerCase();

  if (IMAGE_EXTENSIONS.includes(ext)) {
    // Images: swap to an <img> scaled to fit the modal instead of native size in an iframe
    pdfViewerFrame.src = '';
    pdfViewerFrame.style.display = 'none';
    pdfViewerImage.src = fileUrl;
    pdfViewerImage.style.display = 'block';
  } else {
    // PDFs: use the browser's built-in viewer, forced to fit the page width so it opens un-zoomed
    pdfViewerImage.style.display = 'none';
    pdfViewerImage.src = '';
    pdfViewerFrame.style.display = 'block';
    pdfViewerFrame.src = `${fileUrl}#view=FitH`;
  }

  pdfModal.classList.add('is-open');
  pdfModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden'; // Lock background scrolling
}

function closePdfModal() {
  pdfModal.classList.remove('is-open');
  pdfModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = ''; // Restore scrolling
  pdfViewerFrame.src = ''; // Clear source to stop playback/memory leak
  pdfViewerImage.src = '';
}

// Event Listeners
pdfModalClose.addEventListener('click', closePdfModal);

pdfModal.addEventListener('click', (e) => {
  if (e.target === pdfModal) closePdfModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && pdfModal.classList.contains('is-open')) {
    closePdfModal();
  }
});

// Company profile PDF trigger
document.querySelectorAll('.pdf-dl[data-src], .cred-card[data-src]').forEach(element => {
  // Click handler
  element.addEventListener('click', () => {
    openPdfModal(element.dataset.src, element.dataset.title);
  });
});

// Keyboard accessibility (Enter / Space key)
  element.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openPdfModal(element.dataset.src, element.dataset.title);
    }
  });