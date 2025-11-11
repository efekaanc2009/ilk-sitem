document.addEventListener('DOMContentLoaded',function(){
  function favStorageKey(){ try{ if(window.SiteAuth && typeof window.SiteAuth.favKey==='function'){ return window.SiteAuth.favKey(); } }catch(_){ } return 'favorites'; }
  function readFavs(){ var key=favStorageKey(); try{return JSON.parse(localStorage.getItem(key)||'[]')}catch(_){return []} }
  function writeFavs(arr){ var key=favStorageKey(); try{localStorage.setItem(key,JSON.stringify(arr))}catch(_){}}
  function removeFav(id){var arr=readFavs().filter(function(x){return x.id!==id}); writeFavs(arr); return arr}
  function formatPrice(n){try{return n.toLocaleString('tr-TR',{minimumFractionDigits:2,maximumFractionDigits:2})}catch(_){return (Math.round((n||0)*100)/100).toFixed(2)}}

  var grid=document.getElementById('favGrid'); var countEl=document.getElementById('favCount'); if(!grid) return;

  function render(){
    var list=readFavs();
    grid.innerHTML='';
    countEl&&(countEl.textContent=String(list.length));
    if(list.length===0){ grid.innerHTML='<div class="empty">Henüz favori ürününüz yok.</div>'; return; }
    list.forEach(function(p){
      var card=document.createElement('article'); card.className='fav-card';
      card.dataset.id=p.id; card.dataset.price=p.price; card.dataset.name=p.name; card.dataset.img=p.img;
      card.innerHTML='\n<div class="fav-media">\n  <img src="'+p.img+'" alt="'+p.name+'"/>\n  <button class="fav-badge remove-fav" title="Favorilerden kaldır" aria-label="Favorilerden kaldır">❤</button>\n</div>\n<div class="fav-info">\n  <h3>'+p.name+'</h3>\n  <p class="price">₺'+formatPrice(Number(p.price)||0)+'</p>\n  <div class="fav-actions">\n    <button class="btn-primary add-to-cart">Sepete Ekle</button>\n    <button class="btn-outline remove-fav">Favorilerden Kaldır</button>\n  </div>\n</div>';
      grid.appendChild(card);
    });
  }

  // Remove favorite
  document.addEventListener('click',function(e){
    var btn=e.target.closest('.remove-fav'); if(!btn) return;
    var card=btn.closest('.fav-card'); if(!card) return;
    var id=card.dataset.id; removeFav(id); render();
  });

  // Add to cart from favorites
  document.addEventListener('click',function(e){
    var btn=e.target.closest('.fav-card .add-to-cart'); if(!btn) return;
    var card=btn.closest('.fav-card'); if(!card) return;
    var item={ id:card.dataset.id, name:card.dataset.name, img:card.dataset.img, price:Number(card.dataset.price)||0, qty:1 };
    if(window.addToCart) window.addToCart(item);
    if(window.updateBadge) window.updateBadge();
  });

  render();
});
