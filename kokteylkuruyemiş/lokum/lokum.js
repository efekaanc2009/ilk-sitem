// Products are defined at top-level so homepage can aggregate
var LOKUM_PRODUCTS=[
    {id:'lokum-sarma', name:'Sarma Lokum', img:'/lokum/resimler/lokum-sarma.jpeg', price:89.00, type:'karisik', origin:'yerli', index:0, rating:4.2},
    {id:'lokum-gullu', name:'Güllü Lokum', img:'/lokum/resimler/lokum-gullu.jpg', price:79.00, type:'gullu', origin:'yerli', index:1, rating:3.9},
    {id:'lokum-sade', name:'Sade Lokum', img:'/lokum/resimler/lokum-sade.jpg', price:69.00, type:'sade', origin:'yerli', index:2, rating:3.7},
    {id:'lokum-cevizli', name:'Cevizli Lokum', img:'/resimler/fıstıkresimleri/lokum-cevizli.jpg', price:92.50, type:'kuruyemis', origin:'yerli', index:3, rating:4.0},
    {id:'lokum-cikolatali', name:'Çikolatalı Lokum', img:'/resimler/fıstıkresimleri/lokum-cikolatali.webp', price:99.00, type:'cikolatali', origin:'ithal', index:4, rating:4.1},
    {id:'lokum-karisik', name:'Karışık Lokum', img:'/resimler/Kokteyl_p001.webp', price:95.00, type:'karisik', origin:'yerli', index:5, rating:4.3},
    {id:'lokum-damla-sakizli', name:'Damla Sakızlı Lokum', img:'/resimler/Kokteyl_p001.webp', price:98.00, type:'sade', origin:'yerli', index:6, rating:4.0},
    {id:'lokum-kaymakli', name:'Kaymaklı Lokum', img:'/resimler/Kokteyl_p001.webp', price:102.00, type:'sade', origin:'yerli', index:7, rating:4.4},
    {id:'lokum-narli', name:'Narlı Lokum', img:'/resimler/Kokteyl_p001.webp', price:89.00, type:'gullu', origin:'yerli', index:8, rating:3.8},
    {id:'lokum-findikli', name:'Fındıklı Lokum', img:'/resimler/Kokteyl_p001.webp', price:94.00, type:'kuruyemis', origin:'yerli', index:9, rating:4.1},
    {id:'lokum-susamli', name:'Susamlı Lokum', img:'/resimler/Kokteyl_p001.webp', price:88.00, type:'sade', origin:'yerli', index:10, rating:3.6},
    {id:'lokum-kakaolu', name:'Kakaolu Lokum', img:'/resimler/Kokteyl_p001.webp', price:97.00, type:'cikolatali', origin:'yerli', index:12, rating:4.0},
    {id:'lokum-kus', name:'Kuş lokumu', img:'/resimler/Kokteyl_p001.webp', price:97.00, type:'karisik', origin:'yerli', index:13, rating:4.0},
    {id:'lokum-bademli', name:'Bademli lokum', img:'/resimler/Kokteyl_p001.webp', price:97.00, type:'kuruyemis', origin:'yerli', index:14, rating:4.0},
    {id:'lokum-kakaolu', name:'Kakaolu Lokum', img:'/resimler/Kokteyl_p001.webp', price:97.00, type:'cikolatali', origin:'yerli', index:15, rating:4.0}
  
  ];
// Export to homepage with an extra kind field
try{ window.CATALOGS = window.CATALOGS || {}; window.CATALOGS.lokum = LOKUM_PRODUCTS.map(function(p){ var o={}; for(var k in p){o[k]=p[k]} o.kind='lokum'; return o;}); }catch(_){ }

document.addEventListener("DOMContentLoaded",function(){
  var root=document.querySelector('.lokum-collection');
  if(!root) return;
  var d=document; var grid=root.querySelector('.product-grid');
  var resultsEl=d.getElementById('lokumResults');
  var pagEl=d.getElementById('lokumPagination');
  var sortSel=d.getElementById('sortLokum');
  var PER_PAGE=12; var currentPage=1; var sortMode='popular';
  var searchTerm=(function(){ try{ return (window.LiveSearchTerm||''); }catch(_){ return '' } })();
  function formatPrice(n){try{return n.toLocaleString('tr-TR',{minimumFractionDigits:2,maximumFractionDigits:2})}catch(_){return (Math.round(n*100)/100).toFixed(2)}}

  var filtered=LOKUM_PRODUCTS.slice();

  function sortProducts(){
    filtered.sort(function(a,b){
      if(sortMode==='price-asc') return a.price-b.price;
      if(sortMode==='price-desc')return b.price-a.price;
      if(sortMode==='new')       return b.index-a.index; // yeniler öne
      return a.index-b.index; // popüler/sıralı
    });
  }

  function render(){
    grid.innerHTML='';
    var total=filtered.length; if(total===0){resultsEl&&(resultsEl.textContent='0 ürün'); pagEl&&(pagEl.innerHTML=''); return;}
    var totalPages=Math.max(1,Math.ceil(total/PER_PAGE));
    if(currentPage>totalPages) currentPage=totalPages;
    var start=(currentPage-1)*PER_PAGE; var end=Math.min(start+PER_PAGE,total);
    filtered.slice(start,end).forEach(function(p){
      var el=d.createElement('article');
      el.className='product';
      el.dataset.type=p.type; el.dataset.origin=p.origin; el.dataset.price=p.price; el.dataset.index=p.index; el.dataset.id=p.id; el.dataset.name=p.name; el.dataset.img=p.img;
      var href='';
      if(p.id==='lokum-sarma'){
        href='./urunler/lokum-sarma.html';
        try{ el.setAttribute('data-href', href); }catch(_){ }
      }
      var thumb = href
        ? ('<div class="thumb"><img src="'+p.img+'" alt="'+p.name+'" />\n             <a class="quick-link" href="'+href+'" aria-label="'+p.name+' sayfası">Ürünü İncele</a></div>')
        : ('<img src="'+p.img+'" alt="'+p.name+'" />');
      el.innerHTML= thumb + '\n<div class="info">\n  <h3>'+p.name+'</h3>\n  <div class="rating" style="--rating:'+ (p.rating||4.0) +'">\n    <div class="stars"><div class="stars-fill"></div></div>\n  </div>\n  <p class="price">₺'+formatPrice(p.price)+'</p>\n  <div class="buy-row">\n    <div class="qty-control"><button type="button" class="qty-dec">−</button><input type="number" class="qty-input" min="1" step="1" value="1" /><button type="button" class="qty-inc">+</button></div>\n    <button class="btn-outline add-to-cart">Sepete Ekle</button>\n    <button class="icon-heart add-to-fav" aria-label="Favorilere ekle" title="Favorilere ekle">❤</button>\n  </div>\n</div>';
      grid.appendChild(el);
    });
    if(resultsEl){resultsEl.textContent=(start+1)+'–'+end+' / '+total+' ürün'}
    renderPagination(totalPages);
    if(window.ensureQtyControls) window.ensureQtyControls(grid);
  }

  function makePageBtn(label,page,disabled,isActive){var b=d.createElement('button');b.type='button';b.className='page-btn'+(isActive?' is-active':'');b.textContent=label;b.disabled=!!disabled;b.addEventListener('click',function(){if(disabled)return;currentPage=page;render()});return b}
  function renderPagination(totalPages){if(!pagEl)return;pagEl.innerHTML='';
    if(totalPages<=1)return;
    pagEl.appendChild(makePageBtn('‹',Math.max(1,currentPage-1),currentPage===1,false));
    for(var p=1;p<=totalPages;p++){pagEl.appendChild(makePageBtn(String(p),p,false,p===currentPage))}
    pagEl.appendChild(makePageBtn('›',Math.min(totalPages,currentPage+1),currentPage===totalPages,false));
  }

  function getSelected(name){return Array.from(root.querySelectorAll('input[name="'+name+'"]:checked')).map(function(i){return i.value})}
  function priceOk(price,token){if(!token)return true;if(token==='0-100')return price>=0&&price<100;if(token==='100-200')return price>=100&&price<=200;if(token==='200+')return price>200;return true}
  function applyFilters(){
    var types=getSelected('type'); var origins=getSelected('origin'); var priceSel=(root.querySelector('input[name="price"]:checked')||{}).value||'';
    var term=(searchTerm||'').toLowerCase();
    filtered=LOKUM_PRODUCTS.filter(function(p){
      var tOk=!types.length||types.includes(p.type);
      var oOk=!origins.length||origins.includes(p.origin);
      var prOk=priceOk(p.price,priceSel);
      var txtOk=!term || (String(p.name||'').toLowerCase().indexOf(term)!==-1);
      return tOk&&oOk&&prOk&&txtOk;
    });
    sortProducts(); currentPage=1; render();
  }

  if(sortSel){sortSel.addEventListener('change',function(){sortMode=sortSel.value;sortProducts();currentPage=1;render()})}
  var applyBtn=d.getElementById('applyFiltersLokum'); if(applyBtn){applyBtn.addEventListener('click',applyFilters)}
  var clearBtn=d.getElementById('clearFiltersLokum'); if(clearBtn){clearBtn.addEventListener('click',function(){root.querySelectorAll('input[type="checkbox"],input[type="radio"]').forEach(function(i){i.checked=false}); filtered=LOKUM_PRODUCTS.slice(); sortProducts(); currentPage=1; render();})}

  // live search listener
  document.addEventListener('live-search',function(e){ searchTerm=((e&&e.detail&&e.detail.term)||''); applyFilters(); });

  sortProducts(); render();
});
