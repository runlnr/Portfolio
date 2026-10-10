/**
 * Archive Dataset for N/P® Visual Artifacts
 */
const SWAG_ARCHIVE = [
  {
    id: 'messi',
    image: 'assets/archives/Messi.webp',
    alt: 'Lionel Messi Specimen',
    width: 1620,
    height: 2025
  },
  {
    id: 'museum',
    image: 'assets/archives/Museum 1 (RT).webp',
    alt: 'Museum Specimen',
    width: 1620,
    height: 2025
  },
  {
    id: 'post',
    image: 'assets/archives/POST.webp',
    alt: 'POST Graphic Specimen',
    width: 1620,
    height: 2025
  },
  {
    id: 'milk',
    image: 'assets/archives/milk.webp',
    alt: 'Milk Packaging Specimen',
    width: 2025,
    height: 2531
  },
  {
    id: 'ptnk',
    image: 'assets/archives/PTNK.webp',
    alt: 'PTNK Heritage Specimen',
    width: 1620,
    height: 2025
  }
];

if (typeof window !== 'undefined') {
  window.SWAG_ARCHIVE = SWAG_ARCHIVE;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SWAG_ARCHIVE;
}
