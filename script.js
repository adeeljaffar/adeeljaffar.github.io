
const WA = "923201047224";
function toggleMenu(){document.querySelector('.nav-links').classList.toggle('open')}
function orderWhatsApp(form){
  const fd = new FormData(form);
  const msg = [
    "Hello Adeel Jaffar! I want to place an order.",
    `Name: ${fd.get('name') || ''}`,
    `Service: ${fd.get('service') || ''}`,
    `Budget: ${fd.get('budget') || ''}`,
    `Details: ${fd.get('details') || ''}`
  ].join("\n");
  window.open(`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`,'_blank');
  return false;
}
function renderReviews(){
  const box = document.getElementById('reviewsList');
  if(!box) return;
  const reviews = JSON.parse(localStorage.getItem('adeelReviews') || '[]');
  if(!reviews.length){
    box.innerHTML = '<div class="empty-reviews">No reviews yet. Be the first to leave a rating ⭐</div>';
    return;
  }
  box.innerHTML = reviews.map(r => {
    const stars = '★'.repeat(Number(r.stars)) + '☆'.repeat(5-Number(r.stars));
    const safeName = String(r.name || 'Anonymous').replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[s]));
    const safeReview = String(r.review || '').replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[s]));
    return `<article class="review-card"><div class="review-stars">${stars}</div><strong>${safeName}</strong><p>${safeReview || 'Great service!'}</p></article>`;
  }).join('');
}

function reviewWhatsApp(form){
  const fd = new FormData(form);
  const stars = fd.get('rating');
  if(!stars){ alert('Please select a star rating first.'); return false; }
  const review = {
    stars: Number(stars),
    name: fd.get('reviewName') || 'Anonymous',
    review: fd.get('review') || '',
    date: new Date().toISOString()
  };
  const reviews = JSON.parse(localStorage.getItem('adeelReviews') || '[]');
  reviews.unshift(review);
  localStorage.setItem('adeelReviews', JSON.stringify(reviews.slice(0, 30)));
  renderReviews();

  const msg = `Adeel Jaffar Video Editor Review\nRating: ${stars}/5\nName: ${review.name}\nReview: ${review.review}`;
  window.open(`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`,'_blank');
  document.getElementById('reviewThanks').textContent = "Your rating is now showing below on this website. WhatsApp is also ready to send your feedback.";
  form.reset();
  return false;
}

document.addEventListener('DOMContentLoaded',()=>{
  renderReviews();
});
