// Products at top-level so homepage can aggregate
var COFFEE_PRODUCTS=[
    {id:'kahve-brezilya-cekirdek', name:'Brezilya Kahvesi (Çekirdek)', img:'/resimler/kahve/kahve-brezilya.webp', price:289.00, type:'cekirdek', origin:'ithal', index:0, rating:4.6},
    {id:'kahve-brezilya-filtre',   name:'Brezilya Filtre Kahve',       img:'/resimler/kahve/kahve-brezilya.webp', price:259.00, type:'filtre',   origin:'ithal', index:1, rating:4.3},
    {id:'espresso-italiano',       name:'Espresso Italiano',           img:'/resimler/kahve/kahve-brezilya.webp', price:319.00, type:'espresso', origin:'ithal', index:2, rating:4.8},
    {id:'blend-orta-kavr',         name:'Orta Kavrum Blend',           img:'/resimler/kahve/kahve-brezilya.webp', price:279.50, type:'blend',    origin:'yerli', index:3, rating:4.5},
    {id:'kafeinsiz-cekirdek',      name:'Kafeinsiz Kahve (Çekirdek)',  img:'/resimler/kahve/kahve-brezilya.webp', price:299.90, type:'kafeinsiz',origin:'ithal', index:4, rating:3.9},
    {id:'ogutulmus-filtre',        name:'Öğütülmüş Filtre Kahve',      img:'/resimler/kahve/kahve-brezilya.webp', price:239.90, type:'ogutulmus',origin:'yerli', index:5, rating:4.0},
    {id:'espresso-dark',           name:'Espresso Dark Roast',         img:'/resimler/kahve/kahve-brezilya.webp', price:329.00, type:'espresso', origin:'ithal', index:6, rating:4.7},
    {id:'blend-hafif',             name:'Hafif Kavrum Blend',          img:'/resimler/kahve/kahve-brezilya.webp', price:269.00, type:'blend',    origin:'yerli', index:7, rating:3.8},
    {id:'single-origin-colombia',  name:'Single Origin Colombia',      img:'/resimler/kahve/kahve-brezilya.webp', price:349.00, type:'cekirdek', origin:'ithal', index:8, rating:4.9},
    {id:'single-origin-ethiopia',  name:'Single Origin Ethiopia',      img:'/resimler/kahve/kahve-brezilya.webp', price:359.00, type:'cekirdek', origin:'ithal', index:9, rating:4.7},
    {id:'filtre-yumusak',          name:'Yumuşak İçimli Filtre',       img:'/resimler/kahve/kahve-brezilya.webp', price:229.00, type:'filtre',   origin:'yerli', index:10, rating:3.7},
    {id:'filtre-govdeli',          name:'Gövdesi Yüksek Filtre',       img:'/resimler/kahve/kahve-brezilya.webp', price:289.00, type:'filtre',   origin:'yerli', index:11, rating:4.1},
    {id:'espresso-robusta-blend',  name:'Robusta Espresso Blend',      img:'/resimler/kahve/kahve-brezilya.webp', price:309.00, type:'espresso', origin:'ithal', index:12, rating:3.9},
    {id:'espresso-arabica',        name:'%100 Arabica Espresso',       img:'/resimler/kahve/kahve-brezilya.webp', price:339.00, type:'espresso', origin:'ithal', index:13, rating:4.4},
    {id:'cold-brew-cekirdek',      name:'Cold Brew (Çekirdek)',        img:'/resimler/kahve/kahve-brezilya.webp', price:269.90, type:'cekirdek', origin:'yerli', index:14, rating:4.0},
    {id:'cold-brew-ogutulmus',     name:'Cold Brew (Öğütülmüş)',       img:'/resimler/kahve/kahve-brezilya.webp', price:259.90, type:'ogutulmus',origin:'yerli', index:15, rating:3.8},
    {id:'kafeinsiz-filtre',        name:'Kafeinsiz Filtre',            img:'/resimler/kahve/kahve-brezilya.webp', price:289.90, type:'kafeinsiz',origin:'ithal', index:16, rating:3.5},
    {id:'blend-yoğun',             name:'Yoğun Aromalı Blend',         img:'/resimler/kahve/kahve-brezilya.webp', price:295.00, type:'blend',    origin:'yerli', index:17, rating:4.2},
    {id:'espresso-special',        name:'Espresso Special',            img:'/resimler/kahve/kahve-brezilya.webp', price:345.00, type:'espresso', origin:'ithal', index:18, rating:4.6},
    {id:'house-blend',             name:'House Blend',                 img:'/resimler/kahve/kahve-brezilya.webp', price:279.00, type:'blend',    origin:'yerli', index:19, rating:4.1}
  ];

// Export to homepage with kind
try{ window.CATALOGS = window.CATALOGS || {}; window.CATALOGS.kahve = COFFEE_PRODUCTS.map(function(p){ var o={}; for(var k in p){o[k]=p[k]} o.kind='kahve'; return o;}); }catch(_){ }

document.addEventListener("DOMContentLoaded",function(){
  var root=document.querySelector('.coffee-collection');
  if(!root) return;
  var d=document; var grid=root.querySelector('.product-grid');
  var resultsEl=d.getElementById('coffeeResults');
  var pagEl=d.getElementById('coffeePagination');
  var sortSel=d.getElementById('sortCoffee');
  var PER_PAGE=12; var currentPage=1; var sortMode='popular';
  var searchTerm=(function(){ try{ return (window.LiveSearchTerm||''); }catch(_){ return '' } })();
  function formatPrice(n){try{return n.toLocaleString('tr-TR',{minimumFractionDigits:2,maximumFractionDigits:2})}catch(_){return (Math.round(n*100)/100).toFixed(2)}}

  var filtered=COFFEE_PRODUCTS.slice();

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
      if(p.id==='kahve-brezilya-cekirdek'){
        href='./urunler/kahve-brezilya.html';
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
    filtered=COFFEE_PRODUCTS.filter(function(p){
      var tOk=!types.length||types.includes(p.type);
      var oOk=!origins.length||origins.includes(p.origin);
      var prOk=priceOk(p.price,priceSel);
      var txtOk=!term || (String(p.name||'').toLowerCase().indexOf(term)!==-1);
      return tOk&&oOk&&prOk&&txtOk;
    });
    sortProducts(); currentPage=1; render();
  }

  if(sortSel){sortSel.addEventListener('change',function(){sortMode=sortSel.value;sortProducts();currentPage=1;render()})}
  var applyBtn=d.getElementById('applyFiltersCoffee'); if(applyBtn){applyBtn.addEventListener('click',applyFilters)}
  var clearBtn=d.getElementById('clearFiltersCoffee'); if(clearBtn){clearBtn.addEventListener('click',function(){root.querySelectorAll('input[type="checkbox"],input[type="radio"]').forEach(function(i){i.checked=false}); filtered=COFFEE_PRODUCTS.slice(); sortProducts(); currentPage=1; render();})}

  // live search listener
  document.addEventListener('live-search',function(e){ searchTerm=((e&&e.detail&&e.detail.term)||''); applyFilters(); });

  sortProducts(); render();
});
