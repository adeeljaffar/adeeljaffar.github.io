const WA = "923201047224";

// =========================
// SUPABASE CONNECTION
// =========================

const SUPABASE_URL = "https://ntnqynlvdpcuurkcgfqw.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_VVxY5XJkiEn5ojE9UY9uXA_fg9djb70";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);


// =========================
// MOBILE MENU
// =========================

function toggleMenu(){

  const nav = document.querySelector('.nav-links');

  if(nav){
    nav.classList.toggle('open');
  }

}


// =========================
// NORMAL WHATSAPP ORDER
// =========================

function orderWhatsApp(form){

  const fd = new FormData(form);

  const msg = [
    "Hello Adeel Jaffar! I want to place an order.",
    `Name: ${fd.get('name') || ''}`,
    `Service: ${fd.get('service') || ''}`,
    `Budget: ${fd.get('budget') || ''}`,
    `Details: ${fd.get('details') || ''}`
  ].join("\n");

  window.open(
    `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`,
    '_blank'
  );

  return false;
}


// =========================
// LOAD REVIEWS
// =========================

async function renderReviews(){

  const box = document.getElementById('reviewsList');

  if(!box) return;

  box.innerHTML =
    '<div class="empty-reviews">Loading reviews... ⭐</div>';


  const { data, error } = await supabaseClient
    .from('reviews')
    .select('id,name,rating,review,created_at')
    .order('created_at', {
      ascending: false
    })
    .limit(30);


  if(error){

    console.error(
      "Supabase review loading error:",
      error
    );

    box.innerHTML =
      '<div class="empty-reviews">Unable to load reviews.</div>';

    return;
  }


  if(!data || data.length === 0){

    box.innerHTML =
      '<div class="empty-reviews">No reviews yet. Be the first to leave a rating ⭐</div>';

    return;
  }


  box.innerHTML = data.map(function(r){

    const rating =
      Math.min(5, Math.max(1, Number(r.rating) || 1));


    const stars =
      '★'.repeat(rating) +
      '☆'.repeat(5 - rating);


    const safeName =
      String(r.name || 'Anonymous')
      .replace(/[&<>"']/g, function(s){

        return {
          '&':'&amp;',
          '<':'&lt;',
          '>':'&gt;',
          '"':'&quot;',
          "'":'&#039;'
        }[s];

      });


    const safeReview =
      String(r.review || '')
      .replace(/[&<>"']/g, function(s){

        return {
          '&':'&amp;',
          '<':'&lt;',
          '>':'&gt;',
          '"':'&quot;',
          "'":'&#039;'
        }[s];

      });


    return `
      <article class="review-card">

        <div class="review-stars">
          ${stars}
        </div>

        <strong>
          ${safeName}
        </strong>

        <p>
          ${safeReview}
        </p>

      </article>
    `;

  }).join('');

}


// =========================
// SUBMIT REVIEW
// =========================

async function reviewWhatsApp(form){

  const fd = new FormData(form);


  const stars = fd.get('rating');


  if(!stars){

    alert(
      'Please select a star rating first.'
    );

    return false;
  }


  const name =
    String(
      fd.get('reviewName') || 'Anonymous'
    ).trim();


  const review =
    String(
      fd.get('review') || ''
    ).trim();


  if(!review){

    alert(
      'Please write your review.'
    );

    return false;
  }


  // SAVE REVIEW TO SUPABASE

  const { error } = await supabaseClient
    .from('reviews')
    .insert({

      name: name,

      rating: Number(stars),

      review: review

    });


  if(error){

    console.error(
      "Review save error:",
      error
    );

    alert(
      'Your review could not be saved. Please try again.'
    );

    return false;
  }


  // SHOW UPDATED REVIEWS

  await renderReviews();


  // SUCCESS MESSAGE

  const thanks =
    document.getElementById(
      'reviewThanks'
    );


  if(thanks){

    thanks.textContent =
      "Thank you! Your review has been submitted successfully. ⭐";

  }


  // CLEAR FORM

  form.reset();


  // IMPORTANT:
  // NO WHATSAPP HERE

  return false;

}


// =========================
// PAGE LOAD
// =========================

document.addEventListener(
  'DOMContentLoaded',
  function(){

    renderReviews();

  }
);
