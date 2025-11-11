// Products at top-level so homepage can aggregate
var KURUYEMIS_PRODUCTS=[
    // Badem
    {id:'badem-cig',         name:'Çiğ Badem (250 g)',             img:'/resimler/bademresimleri/bademcig.webp',          price:129.90, type:'badem',   origin:'yerli', index:0,  rating:4.3},
    {id:'badem-ici',         name:'Badem İçi (250 g)',             img:'/resimler/bademresimleri/bademici.jpg',           price:155.90, type:'badem',   origin:'ithal', index:1,  rating:4.7},
    {id:'badem-tuzlu',       name:'Tuzlu Badem (250 g)',           img:'/resimler/bademresimleri/bademtuzlu.webp',        price:145.50, type:'badem',   origin:'yerli', index:2,  rating:4.1},
    {id:'badem-kavrulmus',   name:'Kavrulmuş Badem (250 g)',       img:'/resimler/bademresimleri/bademkavurlmuş.jpg',     price:140.00, type:'badem',   origin:'yerli', index:3,  rating:4.4},
    {id:'badem-unu',         name:'Badem Unu (250 g)',     img:'/resimler/bademresimleri/bademunu.webp',          price:450.00, type:'badem',   origin:'ithal', index:4,  rating:4.8},
    // Kaju
    {id:'kaju-cig',          name:'Çiğ Kaju (250 g)',              img:'/resimler/kajuresimleri/kajucig.webp',            price:149.90, type:'kaju',    origin:'ithal', index:5,  rating:4.2},
    {id:'kaju-tuzlu',        name:'Tuzlu Kaju (250 g)',            img:'/resimler/kajuresimleri/tuzlukaju.jpg',           price:154.50, type:'kaju',    origin:'ithal', index:6,  rating:4.0},
    {id:'kaju-kavrulmus',    name:'Kavrulmuş Kaju (250 g)',        img:'/resimler/kajuresimleri/kavrulmuskaju.jpg',       price:159.90, type:'kaju',    origin:'yerli', index:7,  rating:4.5},
    {id:'kaju-ezmesi',       name:'Kaju Ezmesi (250 g)',           img:'/resimler/kajuresimleri/kajuezmesi.jpg',          price:89.90,  type:'kaju',    origin:'yerli', index:8,  rating:3.9},
    // Fıstık
    {id:'antep-fistigi',     name:'Antep Fıstığı (250 g)',         img:'/resimler/fıstıkresimleri/antepfistik.webp',      price:180.00, type:'fistik',  origin:'yerli', index:9,  rating:4.6},
    {id:'fistik-ici-cig',    name:'Fıstık İçi (Çiğ) (250 g)',      img:'/resimler/fıstıkresimleri/antepfistikicicig.png',  price:170.00, type:'fistik',  origin:'ithal', index:10, rating:4.0},
    {id:'fistik-ici-tuzlu',  name:'Tuzlu Fıstık İçi (250 g)',      img:'/resimler/fıstıkresimleri/fistikicituzlu.jpg',     price:175.50, type:'fistik',  origin:'yerli', index:11, rating:4.2},
    {id:'fistik-ici-tuzsuz', name:'Tuzsuz Fıstık İçi (250 g)',     img:'/resimler/fıstıkresimleri/tuzsuzfistikici.jpg',    price:168.25, type:'fistik',  origin:'ithal', index:12, rating:3.8},
    {id:'soslu-fistik',      name:'Soslu Fıstık (250 g)',          img:'/resimler/fıstıkresimleri/soslu-fistik.jpg',      price:119.00, type:'fistik',  origin:'yerli', index:13, rating:3.7},
    {id:'soslu-fistik',      name:'Soslu Mısır (250 g)',          img:'/resimler/fıstıkresimleri/soslu-misir.jpg',      price:139.00, type:'fistik',  origin:'yerli', index:14, rating:3.7},
    // Çekirdek
    {id:'beyaz-cekirdek',    name:'Beyaz Çekirdek (250 g)',        img:'/resimler/cekirdek/beyaz-cekirdek.webp',          price:119.00, type:'cekirdek',origin:'yerli', index:15, rating:3.9},
    {id:'cekirdek-ici',      name:'Çekirdek İçi (250 g)',          img:'/resimler/cekirdek/cekirdek-ici.webp',            price:119.00, type:'cekirdek',origin:'yerli', index:16, rating:4.0},
    {id:'kabak-cekirdegi',   name:'Kabak Çekirdeği (250 g)',       img:'/resimler/cekirdek/kabak-cekirdegi.webp',         price:129.00, type:'cekirdek',origin:'yerli', index:17, rating:4.1},
    {id:'tuzlu-siyah',       name:'Tuzlu Siyah Çekirdek (250 g)',  img:'/resimler/cekirdek/tuzlu-siyah-cekirdek.jpg',      price:109.00, type:'cekirdek',origin:'yerli', index:18, rating:3.6},
    {id:'tuzsuz-cekirdek',   name:'Tuzsuz Çekirdek (250 g)',       img:'/resimler/cekirdek/tuzsuz-cekirdek.jpg',          price:109.00, type:'cekirdek',origin:'yerli', index:19, rating:3.8}
  ];

// Export to homepage with kind
try{ window.CATALOGS = window.CATALOGS || {}; window.CATALOGS.kuruyemis = KURUYEMIS_PRODUCTS.map(function(p){ var o={}; for(var k in p){o[k]=p[k]} o.kind='kuruyemis'; return o;}); }catch(_){ }

document.addEventListener("DOMContentLoaded",function(){
  var root=document.querySelector('.kuruyemis-collection');
  if(!root) return;
  var d=document; var grid=root.querySelector('.product-grid');
  var resultsEl=d.getElementById('kuruyemisResults');
  var pagEl=d.getElementById('kuruyemisPagination');
  var sortSel=d.getElementById('sortKuruyemis');
  var PER_PAGE=12; var currentPage=1; var sortMode='popular';
  var searchTerm=(function(){ try{ return (window.LiveSearchTerm||''); }catch(_){ return '' } })();
  function formatPrice(n){try{return n.toLocaleString('tr-TR',{minimumFractionDigits:2,maximumFractionDigits:2})}catch(_){return (Math.round(n*100)/100).toFixed(2)}}

  var filtered=KURUYEMIS_PRODUCTS.slice();

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
      el.innerHTML='<img src="'+p.img+'" alt="'+p.name+'" />\n<div class="info">\n  <h3>'+p.name+'</h3>\n  <div class="rating" style="--rating:'+ (p.rating||4.0) +'">\n    <div class="stars"><div class="stars-fill"></div></div>\n  </div>\n  <p class="price">₺'+formatPrice(p.price)+'</p>\n  <div class="buy-row">\n    <div class="qty-control"><button type="button" class="qty-dec">−</button><input type="number" class="qty-input" min="1" step="1" value="1" /><button type="button" class="qty-inc">+</button></div>\n    <button class="btn-outline add-to-cart">Sepete Ekle</button>\n    <button class="icon-heart add-to-fav" aria-label="Favorilere ekle" title="Favorilere ekle">❤</button>\n  </div>\n</div>';
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
    filtered=KURUYEMIS_PRODUCTS.filter(function(p){
      var tOk=!types.length||types.includes(p.type);
      var oOk=!origins.length||origins.includes(p.origin);
      var prOk=priceOk(p.price,priceSel);
      var txtOk=!term || (String(p.name||'').toLowerCase().indexOf(term)!==-1);
      return tOk&&oOk&&prOk&&txtOk;
    });
    sortProducts(); currentPage=1; render();
  }

  if(sortSel){sortSel.addEventListener('change',function(){sortMode=sortSel.value;sortProducts();currentPage=1;render()})}
  var applyBtn=d.getElementById('applyFiltersKuruyemis'); if(applyBtn){applyBtn.addEventListener('click',applyFilters)}
  var clearBtn=d.getElementById('clearFiltersKuruyemis'); if(clearBtn){clearBtn.addEventListener('click',function(){root.querySelectorAll('input[type="checkbox"],input[type="radio"]').forEach(function(i){i.checked=false}); filtered=KURUYEMIS_PRODUCTS.slice(); sortProducts(); currentPage=1; render();})}

  // live search listener
  document.addEventListener('live-search',function(e){ searchTerm=((e&&e.detail&&e.detail.term)||''); applyFilters(); });

  sortProducts(); render();
});
