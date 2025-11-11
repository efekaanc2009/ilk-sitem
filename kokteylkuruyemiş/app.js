document.addEventListener("DOMContentLoaded",function(){var slider=document.querySelector(".slider");if(!slider)return;var slides=Array.from(slider.querySelectorAll(".slide"));var prev=slider.querySelector(".prev");var next=slider.querySelector(".next");var dotsWrap=slider.querySelector(".dots");var index=slides.findIndex(function(s){return s.classList.contains("is-active")});if(index<0)index=0;var timer;var interval=Number(slider.dataset.interval)||5000;var autoplay=slider.dataset.autoplay==="true";function renderDots(){dotsWrap.innerHTML="";slides.forEach(function(_,i){var b=document.createElement("button");b.type="button";b.setAttribute("aria-label",(i+1)+". slayt");b.addEventListener("click",function(){go(i)});dotsWrap.appendChild(b)})}function updateActive(){slides.forEach(function(s,i){s.classList.toggle("is-active",i===index)});Array.from(dotsWrap.children).forEach(function(d,i){d.classList.toggle("is-active",i===index)})}function go(i){index=(i+slides.length)%slides.length;updateActive();resetAutoplay()}function nextSlide(){go(index+1)}function prevSlide(){go(index-1)}function startAutoplay(){if(!autoplay)return;clearInterval(timer);timer=setInterval(nextSlide,interval)}function resetAutoplay(){if(!autoplay)return;clearInterval(timer);timer=setInterval(nextSlide,interval)}renderDots();updateActive();prev.addEventListener("click",prevSlide);next.addEventListener("click",nextSlide);slider.addEventListener("mouseenter",function(){clearInterval(timer)});slider.addEventListener("mouseleave",startAutoplay);startAutoplay();document.querySelectorAll("form.search").forEach(function(f){f.addEventListener("submit",function(e){e.preventDefault()})});document.querySelectorAll(".add-to-cart").forEach(function(btn){btn.addEventListener("click",function(){alert("Sepete eklendi!")})})});

function siteRoot(){
  try{
    var p=window.location.pathname||'';
    var parts=p.split('/').filter(Boolean);
    var isFile=parts.length>0 && /\./.test(parts[parts.length-1]);
    var depth=isFile ? parts.length-1 : parts.length;
    var ups=''; for(var i=0;i<depth;i++){ ups+='../'; }
    return ups;
  }catch(_){ return ''; }
}

document.addEventListener("DOMContentLoaded",function(){
  function initSlider(){
    var slider=document.querySelector(".slider");
    if(!slider)return;
    var slides=Array.from(slider.querySelectorAll(".slide"));
    var prev=slider.querySelector(".prev");
    var next=slider.querySelector(".next");
    var dotsWrap=slider.querySelector(".dots");
    var index=slides.findIndex(function(s){return s.classList.contains("is-active")});
    if(index<0)index=0;
    var timer;var interval=Number(slider.dataset.interval)||5000;var autoplay=slider.dataset.autoplay==="true";
    function renderDots(){dotsWrap.innerHTML="";slides.forEach(function(_,i){var b=document.createElement("button");b.type="button";b.setAttribute("aria-label",(i+1)+". slayt");b.addEventListener("click",function(){go(i)});dotsWrap.appendChild(b)})}

// Header scroll shadow toggle
function initHeaderScroll(){
  var header=document.querySelector('.site-header');
  if(!header) return;
  function apply(){
    if(window.scrollY>2) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }
  apply();
  window.addEventListener('scroll',apply,{passive:true});
}
    function updateActive(){slides.forEach(function(s,i){s.classList.toggle("is-active",i===index)});Array.from(dotsWrap.children).forEach(function(d,i){d.classList.toggle("is-active",i===index)})}
    function go(i){index=(i+slides.length)%slides.length;updateActive();resetAutoplay()}
    function nextSlide(){go(index+1)}
    function prevSlide(){go(index-1)}
    function startAutoplay(){if(!autoplay)return;clearInterval(timer);timer=setInterval(nextSlide,interval)}
    function resetAutoplay(){if(!autoplay)return;clearInterval(timer);timer=setInterval(nextSlide,interval)}
    renderDots();updateActive();
    prev&&prev.addEventListener("click",prevSlide);
    next&&next.addEventListener("click",nextSlide);
    // Make entire slide clickable when data-href is present
    slides.forEach(function(s){
      var href=(s.getAttribute('data-href')||'').trim();
      var btn=s.querySelector('.overlay .btn-primary');
      if(btn){
        // If button has empty or placeholder href, mirror slide link
        var current=(btn.getAttribute('href')||'').trim();
        if(href && href!=='#' && (!current || current==='#')){
          btn.setAttribute('href',href);
        }
        btn.setAttribute('role','button');
        btn.setAttribute('tabindex','0');
      }
      if(href && href!=='#'){
        s.addEventListener('click',function(e){
          var t=e.target;
          // ignore clicks originating from interactive elements
          if(t.closest('a,button,.qty-control')) return;
          window.location.href=href;
        });
      }
    });
    slider.addEventListener("mouseenter",function(){clearInterval(timer)});
    slider.addEventListener("mouseleave",startAutoplay);
    startAutoplay();
  }

  function preventSearch(){document.querySelectorAll("form.search").forEach(function(f){f.addEventListener("submit",function(e){e.preventDefault()})})}
  function initLiveSearch(){
    var input=document.querySelector('form.search input[type="text"], form.search input[type="search"]');
    if(!input) return;
    function emit(){
      var term=(input.value||'').trim().toLowerCase();
      try{ window.LiveSearchTerm=term; }catch(_){ }
      var ev=new CustomEvent('live-search',{detail:{term:term}});
      document.dispatchEvent(ev);
    }
    input.addEventListener('input',emit);
    // emit once on load so pages can sync initial value
    emit();
  }

  function initAddToCart(){
    if(document.body && document.body.hasAttribute('data-no-global-cart')) return;
    if(window.CartAPI) return;
    function cartStorageKey(){
      try{ if(window.SiteAuth && typeof window.SiteAuth.isLoggedIn==='function' && window.SiteAuth.isLoggedIn()){ var em=window.SiteAuth.currentEmail && window.SiteAuth.currentEmail(); if(em) return 'cart:'+em; } }catch(_){ }
      return 'cart:guest';
    }
    function read(){var KEY=cartStorageKey(); try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch(_){return {}}}
    function write(obj){var KEY=cartStorageKey(); try{localStorage.setItem(KEY,JSON.stringify(obj))}catch(_){}}
    function get(){var c=read(); if(!c.items)c.items={}; return c}
    function set(c){write(c)}
    function normalizeId(name,fallback){try{return (name||'').toString().toLowerCase().replace(/[^a-z0-9çğıöşü\s-]/gi,'').trim().replace(/\s+/g,'-')||String(fallback||Date.now())}catch(_){return String(fallback||Date.now())}}
    function totals(){var c=get();var sub=0;var cnt=0;Object.values(c.items).forEach(function(it){var p=Number(it.price)||0;var q=Number(it.qty)||0;sub+=p*q;cnt+=q});return {subtotal:sub,count:cnt}}
    function updateBadge(){var el=document.getElementById('cartCount'); if(el){el.textContent=String(totals().count)}}
    function add(prod,qty){qty=Math.max(1,parseInt(qty,10)||1);var c=get();var id=prod.id||normalizeId(prod.name,prod.slug||prod.idx);var ex=c.items[id];if(ex){ex.qty+=qty}else{c.items[id]={id:id,name:prod.name||'Ürün',price:Number(prod.price)||0,img:prod.img||'',qty:qty}};set(c);updateBadge();return c}
    function update(id,qty){var c=get();if(!c.items[id])return c;qty=parseInt(qty,10)||1;if(qty<=0)delete c.items[id];else c.items[id].qty=qty;set(c);updateBadge();return c}
    function remove(id){var c=get();if(c.items[id]){delete c.items[id];set(c);updateBadge()}return c}
    function clear(){var c=get(); c.items={}; set(c); updateBadge(); return c}
    window.CartAPI={add:add,update:update,remove:remove,clear:clear,get:get,totals:totals,updateBadge:updateBadge};

    function ensureQtyControls(root){
      root=root||document;
      Array.from(root.querySelectorAll('.add-to-cart')).forEach(function(btn){
        var container=btn.closest('.buy-row');
        if(container){
          if(!container.querySelector('.qty-control')){
            var qc=document.createElement('div');
            qc.className='qty-control';
            qc.innerHTML='<button type="button" class="qty-dec">−</button><input type="number" class="qty-input" min="1" step="1" value="1" /><button type="button" class="qty-inc">+</button>';
            container.insertBefore(qc,btn);
          }
          if(!container.querySelector('.add-to-fav')){
            var fav=document.createElement('button');
            fav.className='icon-heart add-to-fav';
            fav.setAttribute('aria-label','Favorilere ekle');
            fav.title='Favorilere ekle';
            fav.textContent='❤';
            container.appendChild(fav);
          }
          return;
        }
        var prev=btn.previousElementSibling;
        if(prev&&prev.classList&&prev.classList.contains('qty-control')) return;
        var wrap=document.createElement('div');
        wrap.className='buy-row';
        var qc2=document.createElement('div');
        qc2.className='qty-control';
        qc2.innerHTML='<button type="button" class="qty-dec">−</button><input type="number" class="qty-input" min="1" step="1" value="1" /><button type="button" class="qty-inc">+</button>';
        btn.parentNode.insertBefore(wrap,btn);
        wrap.appendChild(qc2);
        wrap.appendChild(btn);
        var fav2=document.createElement('button');
        fav2.className='icon-heart add-to-fav';
        fav2.setAttribute('aria-label','Favorilere ekle');
        fav2.title='Favorilere ekle';
        fav2.textContent='❤';
        wrap.appendChild(fav2);
      })
    }
    window.ensureQtyControls=ensureQtyControls;

    document.addEventListener('click',function(e){
      if(e.target.classList.contains('qty-inc')||e.target.classList.contains('qty-dec')){
        var q=e.target.closest('.qty-control');
        if(!q||q.closest('.cart-item')) return; // cart sayfasında global handler çalışmasın
        var input=q.querySelector('.qty-input');
        var v=parseInt(input.value,10)||1;
        v=e.target.classList.contains('qty-inc')?v+1:Math.max(1,v-1);
        input.value=v
      }
    },true);
    document.addEventListener('change',function(e){
      if(e.target.classList.contains('qty-input')){
        var q=e.target.closest('.qty-control');
        if(q&&q.closest('.cart-item')) return; // cart sayfasında global handler çalışmasın
        var v=parseInt(e.target.value,10)||1; e.target.value=Math.max(1,v)
      }
    },true);

    // Add-to-cart capture
    document.addEventListener("click",function(e){var btn=e.target.closest('.add-to-cart');if(!btn)return; e.preventDefault(); e.stopPropagation(); if(e.stopImmediatePropagation) e.stopImmediatePropagation(); var card=btn.closest('.product')||btn.closest('[data-price]'); var name=(card&&(card.dataset.name||(card.querySelector('h3')||{}).textContent)||'Ürün').trim(); var id=card&&(card.dataset.id||''); var price=card?Number(card.dataset.price):NaN; if(!(price>0)){var t=card&&card.querySelector('.price'); if(t){var m=t.textContent.replace(/[^0-9,\.]/g,'').replace(',','.'); var n=parseFloat(m); if(!isNaN(n)) price=n;}} var img=card&&(card.dataset.img||((card.querySelector('img')||{}).src))||''; var qtyWrap=btn.previousElementSibling&&btn.previousElementSibling.classList&&btn.previousElementSibling.classList.contains('qty-control')?btn.previousElementSibling:null; var qty=1; if(qtyWrap){var inp=qtyWrap.querySelector('.qty-input'); qty=Math.max(1,parseInt((inp&&inp.value)||'1',10)||1)} window.CartAPI.add({id:id,name:name,price:price,img:img},qty); },true);

    // Favorites helpers (per-user)
    function favStorageKey(){ try{ if(window.SiteAuth && typeof window.SiteAuth.favKey==='function'){ return window.SiteAuth.favKey(); } }catch(_){ } return 'favorites'; }
    function readFavs(){ var key=favStorageKey(); try{ return JSON.parse(localStorage.getItem(key)||'[]') }catch(_){ return [] } }
    function writeFavs(arr){ var key=favStorageKey(); try{ localStorage.setItem(key, JSON.stringify(arr)) }catch(_){} }
    function addFav(item){var list=readFavs(); if(!list.some(function(x){return x.id===item.id})){list.push(item); writeFavs(list);} return list}

    // Add-to-favorites capture (requires login)
    document.addEventListener("click",function(e){
      var btn=e.target.closest('.add-to-fav'); if(!btn) return; e.preventDefault(); e.stopPropagation();
      var card=btn.closest('.product')||btn.closest('[data-price]'); if(!card) return;
      var info={ id:card.dataset.id||'', name:card.dataset.name||((card.querySelector('h3')||{}).textContent)||'Ürün', price:Number(card.dataset.price)||0, img:card.dataset.img||((card.querySelector('img')||{}).src)||'', type:card.dataset.type||'', origin:card.dataset.origin||'', index: Number(card.dataset.index)||0 };
      addFav(info);
      window.location.href=siteRoot()+'kullanıcı/favoriler.html';
    },true);

    // Cart icon navigates to cart page
    var cartBtn=document.querySelector('.icon-btn[aria-label="Sepet"]'); if(cartBtn){cartBtn.addEventListener('click',function(){window.location.href=siteRoot()+ 'kullanıcı/sepet.html'})}

    // Ensure Favorites icon exists in header and navigate on click
    (function ensureHeaderFavorites(){
      var actions=document.querySelector('.site-header .actions');
      if(!actions) return;
      var favBtn=actions.querySelector('.icon-btn[aria-label="Favoriler"]');
      if(!favBtn){
        favBtn=document.createElement('button');
        favBtn.className='icon-btn';
        favBtn.setAttribute('aria-label','Favoriler');
        favBtn.innerHTML='<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"></path></svg>';
        var before=actions.querySelector('.icon-btn[aria-label="Sepet"]');
        if(before) actions.insertBefore(favBtn,before); else actions.appendChild(favBtn);
      }
      favBtn.addEventListener('click',function(){ window.location.href=siteRoot()+'kullanıcı/favoriler.html'; });
    })();

    // initial injection + observe dynamic lists
    ensureQtyControls(document);
    Array.from(document.querySelectorAll('.product-grid')).forEach(function(grid){var mo=new MutationObserver(function(){ensureQtyControls(grid)});mo.observe(grid,{childList:true,subtree:true})});
    updateBadge();
  }

  function initProductsMenu(){
    var toggle=document.getElementById("productsToggle");
    var menu=document.getElementById("productsMenu");
    if(!toggle||!menu)return;
    // Ensure menu items are consistent across all pages
    try{
      var list=menu.querySelector('.menu-list');
      if(list){
        var root=siteRoot();
        list.innerHTML='\n  <a href="'+root+'kuruyemis/kuruyemis.html" class="menu-link">Kuruyemiş</a>\n  <a href="'+root+'lokum/lokum.html" class="menu-link">Lokum</a>\n  <a href="'+root+'kahve/kahve.html" class="menu-link">Kahve</a>\n';
      }
    }catch(_){/* noop */}
    function close(){menu.classList.remove("is-open");toggle.setAttribute("aria-expanded","false")}
    function positionMenu(){
      var r=toggle.getBoundingClientRect();
      // menu is fixed in CSS; use viewport coords directly
      var top=r.bottom + 6;
      var left=r.left;
      menu.style.top=top+"px";
      menu.style.left=left+"px";
      menu.style.minWidth=r.width+"px";
    }
    function open(){menu.classList.add("is-open");toggle.setAttribute("aria-expanded","true");positionMenu()}
    toggle.addEventListener("click",function(){var openNow=menu.classList.contains("is-open");if(openNow)close();else open()});
    document.addEventListener("click",function(e){if(!menu.classList.contains("is-open"))return;var inside=menu.contains(e.target)||toggle.contains(e.target);if(!inside)close()});
    document.addEventListener("keydown",function(e){if(e.key==="Escape")close()});

    var hoverTimer; var header=document.querySelector('.site-header');
    function scheduleClose(){clearTimeout(hoverTimer); hoverTimer=setTimeout(close,150)}
    function cancelClose(){clearTimeout(hoverTimer)}

    toggle.addEventListener('mouseenter',function(){open()});
    toggle.addEventListener('mouseleave',function(){scheduleClose()});
    menu.addEventListener('mouseenter',function(){cancelClose(); open()});
    menu.addEventListener('mouseleave',function(){scheduleClose()});
    if(header){header.addEventListener('mouseleave',function(){scheduleClose()})}

    function repositionIfOpen(){if(menu.classList.contains('is-open')) positionMenu()}
    window.addEventListener('resize',repositionIfOpen);
    window.addEventListener('scroll',repositionIfOpen,{passive:true});

    toggle.addEventListener('focusin',function(){open()});
    menu.addEventListener('focusout',function(e){var related=e.relatedTarget; if(!menu.contains(related) && !toggle.contains(related)) scheduleClose()});

    Array.from(menu.querySelectorAll('a')).forEach(function(a){a.addEventListener('click',function(){close()})});
  }

  function initPasswordToggles(){
    var ICON_EYE='\n<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
    var ICON_EYE_OFF='\n<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C5 20 1 12 1 12a21.9 21.9 0 0 1 5.06-7.94"></path><path d="M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a21.87 21.87 0 0 1-2.16 3.19"></path><path d="M14.12 14.12a3 3 0 0 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>';
    document.querySelectorAll('.password-field .eye-toggle').forEach(function(btn){
      btn.setAttribute('aria-pressed','false');
      btn.dataset.visible='false';
      if(!btn.innerHTML.trim()) btn.innerHTML=ICON_EYE_OFF;
      btn.addEventListener('click',function(){
        var targets=[];
        var sel=(btn.getAttribute('data-targets')||'').trim();
        if(sel){
          try{targets=Array.from(document.querySelectorAll(sel));}catch(_){targets=[]}
        }
        if(!targets.length){
          var wrap=btn.closest('.password-field');
          if(wrap){var maybe=wrap.querySelector('input[type="password"], input[type="text"]'); if(maybe) targets=[maybe];}
        }
        if(!targets.length) return;
        var isVisible=btn.dataset.visible==='true';
        targets.forEach(function(inp){inp.type=isVisible?'password':'text'});
        btn.dataset.visible=isVisible?'false':'true';
        btn.innerHTML=isVisible?ICON_EYE_OFF:ICON_EYE;
        btn.setAttribute('aria-pressed',btn.dataset.visible);
      })
    })
  }

  function initHomeCollection(){
    var root=document.querySelector('.home-collection');
    if(!root)return;
    var d=document;var grid=root.querySelector('.product-grid');
    var resultsEl=d.getElementById('homeResults');
    var pagEl=d.getElementById('homePagination');
    var sortSel=d.getElementById('sortHome');
    var PER_PAGE=12;var currentPage=1;var sortMode='popular';
    var searchTerm=(function(){ try{ return (window.LiveSearchTerm||''); }catch(_){ return '' } })();
    function formatPrice(n){try{return n.toLocaleString('tr-TR',{minimumFractionDigits:2,maximumFractionDigits:2})}catch(_){return (Math.round(n*100)/100).toFixed(2)}}
    var PRODUCTS=[]; // will be loaded from category files

    function shuffle(arr){for(var i=arr.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=arr[i];arr[i]=arr[j];arr[j]=t}return arr}
    function loadScripts(urls,done){var pending=urls.length; if(!pending){done();return} urls.forEach(function(u){var s=document.createElement('script'); s.src=u; s.onload=function(){if(--pending===0) done()}; s.onerror=function(){if(--pending===0) done()}; document.head.appendChild(s)});}
    function buildProducts(){
      var cat=(window.CATALOGS)||{}; var all=[].concat(cat.kuruyemis||[],cat.kahve||[],cat.lokum||[]);
      // ensure each has kind, type may be category-specific. Randomize initial order each load.
      PRODUCTS=shuffle(all.slice());
      filtered=PRODUCTS.slice();
    }
    var filtered=PRODUCTS.slice();

    function sortProducts(){
      filtered.sort(function(a,b){
        if(sortMode==='price-asc') return a.price-b.price;
        if(sortMode==='price-desc')return b.price-a.price;
        if(sortMode==='new')       return b.index-a.index; // ters, yeniler öne
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
        if(p.id==='lokum-sarma') href=siteRoot()+'lokum/urunler/lokum-sarma.html';
        else if(p.id==='kahve-brezilya-cekirdek') href=siteRoot()+'kahve/urunler/kahve-brezilya.html';
        if(href){ el.setAttribute('data-href', href); }
        var thumb = href
          ? ('<div class="thumb"><img src="'+p.img+'" alt="'+p.name+'" />\n               <a class="quick-link" href="'+href+'" aria-label="'+p.name+' sayfası">Ürünü Gör</a></div>')
          : ('<img src="'+p.img+'" alt="'+p.name+'" />');
        el.innerHTML= thumb + '\n<div class="info">\n  <h3>'+p.name+'</h3>\n  <div class="rating" style="--rating:'+ (p.rating||4.0) +'">\n    <div class="stars"><div class="stars-fill"></div></div>\n  </div>\n  <p class="price">₺'+formatPrice(p.price)+'</p>\n  <div class="buy-row">\n    <div class="qty-control"><button type="button" class="qty-dec">−</button><input type="number" class="qty-input" min="1" step="1" value="1" /><button type="button" class="qty-inc">+</button></div>\n    <button class="btn-outline add-to-cart">Sepete Ekle</button>\n  </div>\n</div>';
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
      filtered=PRODUCTS.filter(function(p){
        var inType = !types.length || types.some(function(t){ return t===p.type || t===p.kind; });
        var inOrigin = !origins.length || origins.includes(p.origin);
        var inPrice = priceOk(p.price,priceSel);
        var inText = !term || (String(p.name||'').toLowerCase().indexOf(term) !== -1);
        return inType && inOrigin && inPrice && inText;
      });
      sortProducts(); currentPage=1; render();
    }

    // Events
    if(sortSel){sortSel.addEventListener('change',function(){sortMode=sortSel.value;sortProducts();currentPage=1;render()})}
    var applyBtn=d.getElementById('applyFiltersHome'); if(applyBtn){applyBtn.addEventListener('click',applyFilters)}
    var clearBtn=d.getElementById('clearFiltersHome'); if(clearBtn){clearBtn.addEventListener('click',function(){root.querySelectorAll('input[type="checkbox"],input[type="radio"]').forEach(function(i){i.checked=false});filtered=PRODUCTS.slice();sortProducts();currentPage=1;render()})}

    // init: ensure catalogs are loaded, then render
    (function init(){
      if(window.CATALOGS && (window.CATALOGS.kuruyemis||window.CATALOGS.kahve||window.CATALOGS.lokum)){
        buildProducts(); sortProducts(); render(); return;
      }
      var rootPath=siteRoot();
      loadScripts([rootPath+'kuruyemis/kuruyemis.js', rootPath+'kahve/kahve.js', rootPath+'lokum/lokum.js'], function(){ buildProducts(); sortProducts(); render(); });
    })();

    // Listen to global live search
    document.addEventListener('live-search',function(e){
      searchTerm=((e&&e.detail&&e.detail.term)||'');
      applyFilters();
    });
  }

  function initCartPage(){
    var list=document.getElementById('cartList');
    var summary=document.getElementById('cartSummary');
    if(!list||!summary||!window.CartAPI) return;
    function format(n){try{return '₺'+n.toLocaleString('tr-TR',{minimumFractionDigits:1,maximumFractionDigits:2})}catch(_){return '₺'+(Math.round(n*100)/100).toFixed(2)}}
    function render(){
      var c=window.CartAPI.get();
      var items=Object.values(c.items);
      if(!items.length){
        list.innerHTML='<div class="empty" style="padding:18px;border:1px solid #e5e7eb;border-radius:12px;background:#fff;color:#6b7280">Sepetiniz boş.</div>';
        summary.innerHTML='<div class="cart-summary"><h3>Sipariş Özeti</h3><div class="row"><span>Ara Toplam</span><span>₺0,00</span></div><div class="row"><span>Kargo</span><span>₺0,00</span></div><div class="row total"><span>Genel Toplam</span><span>₺0,00</span></div><a class="btn-primary" href="'+siteRoot()+'anasayfa.html" style="display:block;margin-top:10px;text-align:center">Alışverişe Devam Et</a></div>';
        var countEl=document.getElementById('cartCount'); if(countEl) countEl.textContent='0';
        return;
      }
      var html='';
      items.forEach(function(it){
        html+= '<article class="cart-item" data-id="'+it.id+'">'
             +   '<img src="'+(it.img||'/resimler/2022-02-12.webp')+'" alt="'+it.name+'"/>'
             +   '<div class="ci-info"><div class="ci-name">'+it.name+'</div><div class="ci-price">'+format(it.price)+'</div></div>'
             +   '<div class="ci-actions">'
             +     '<div class="qty-control"><button type="button" class="qty-dec">−</button><input type="number" class="qty-input" min="1" step="1" value="'+it.qty+'" /><button type="button" class="qty-inc">+</button></div>'
             +     '<button type="button" class="remove">Sil</button>'
             +   '</div>'
             + '</article>';
      });
      list.innerHTML=html;
      var sub=items.reduce(function(s,it){return s+(Number(it.price)||0)*(Number(it.qty)||0)},0);
      var ship=items.length?29.99:0;
      var total=sub+ship;
      summary.innerHTML='<div class="cart-summary">'
        +'<h3>Sipariş Özeti</h3>'
        +'<div class="row"><span>Ara Toplam</span><span>'+format(sub)+'</span></div>'
        +'<div class="row"><span>Kargo</span><span>'+format(ship)+'</span></div>'
        +'<div class="row total"><span>Genel Toplam</span><span>'+format(total)+'</span></div>'
        +'<button class="btn-primary" id="checkoutOpen" type="button" style="display:block;margin-top:10px;width:100%">Hızlı Ödeme</button>'
        +'<a class="btn" href="'+siteRoot()+'anasayfa.html" style="display:block;margin-top:8px;text-align:center">Alışverişe Devam Et</a>'
        +'</div>';
      var countEl=document.getElementById('cartCount'); if(countEl) countEl.textContent=String(items.reduce(function(c,it){return c+(Number(it.qty)||0)},0));
      var openBtn=summary.querySelector('#checkoutOpen'); if(openBtn){openBtn.addEventListener('click',showCheckout)}
    }
    function showCheckout(){
      var c=window.CartAPI.get(); var items=Object.values(c.items);
      var sub=items.reduce(function(s,it){return s+(Number(it.price)||0)*(Number(it.qty)||0)},0);
      var ship=items.length?29.99:0; var total=sub+ship;
      var wrap=document.getElementById('checkoutModal'); if(!wrap){wrap=document.createElement('div'); wrap.id='checkoutModal'; wrap.className='modal-overlay'; document.body.appendChild(wrap)}
      wrap.innerHTML='\n<div class="modal" role="dialog" aria-modal="true" aria-labelledby="checkoutTitle">\n  <button class="modal-close" aria-label="Kapat">×</button>\n  <h2 id="checkoutTitle" class="modal-title">Ödeme Bilgileri</h2>\n  <div class="checkout-head">\n    <div class="secure"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg><span>Güvenli ödeme</span></div>\n    <div class="card-logos">\n      <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa"/>\n      <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard"/>\n      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Troy-logo-sloganli.png/500px-Troy-logo-sloganli.png" alt="Troy"/>\n    </div>\n  </div>\n  <form id="checkoutForm" class="checkout-form">\n    <div class="field"><label>Kart Üzerindeki İsim</label><input required type="text" name="name" /></div>\n    <div class="field"><label>Kart Numarası</label><input required type="text" inputmode="numeric" pattern="[0-9 ]{12,23}" placeholder="1234 5678 9012 3456" name="card" /></div>\n    <div class="two-col">\n      <div class="field"><label>Son Kullanma</label><input required type="text" inputmode="numeric" placeholder="AA/YY" name="exp" /></div>\n      <div class="field"><label>CVV</label><input required type="password" inputmode="numeric" maxlength="4" name="cvv" /></div>\n    </div>\n    <div class="field"><label>E-posta</label><input required type="email" name="email" /></div>\n    <div class="pay-total"><span>Ödenecek Tutar</span><strong>'+format(total)+'</strong></div>\n    <div class="modal-actions">\n      <button type="submit" class="btn-primary full">Ödemeyi Tamamla</button>\n    </div>\n  </form>\n</div>';
      function close(){wrap.classList.remove('is-open')}
      var closeBtn=wrap.querySelector('.modal-close'); if(closeBtn){closeBtn.addEventListener('click',close)}
      wrap.addEventListener('click',function(e){if(e.target===wrap) close()});
      document.addEventListener('keydown',function esc(e){if(e.key==='Escape'){close(); document.removeEventListener('keydown',esc)} });
      var form=wrap.querySelector('#checkoutForm'); if(form){form.addEventListener('submit',function(e){e.preventDefault(); window.CartAPI.clear(); close(); alert('Ödeme başarılı! Siparişiniz alındı.'); window.location.href=siteRoot()+'anasayfa.html';})}
      wrap.classList.add('is-open');
    }
    list.addEventListener('click',function(e){
      var itemEl=e.target.closest('.cart-item'); if(!itemEl) return;
      var id=itemEl.getAttribute('data-id'); if(!id) return;
      if(e.target.classList.contains('qty-inc')){ var inp=itemEl.querySelector('.qty-input'); var v=Math.max(1,(parseInt(inp.value,10)||1)+1); window.CartAPI.update(id,v); render(); }
      if(e.target.classList.contains('qty-dec')){ var inp2=itemEl.querySelector('.qty-input'); var v2=Math.max(1,(parseInt(inp2.value,10)||1)-1); window.CartAPI.update(id,v2); render(); }
      if(e.target.classList.contains('remove')){ window.CartAPI.remove(id); render(); }
    });
    list.addEventListener('change',function(e){
      var itemEl=e.target.closest('.cart-item'); if(!itemEl) return;
      if(e.target.classList.contains('qty-input')){ var id=itemEl.getAttribute('data-id'); var v=Math.max(1,parseInt(e.target.value,10)||1); window.CartAPI.update(id,v); render(); }
    });
    render();
  }

  initSlider();
  preventSearch();
  initLiveSearch();
  initAuth();
  initAddToCart();
  (function ensureQuickLinkStyles(){
    if(document.getElementById('quickLinkStyles')) return;
    var css='.product .thumb{position:relative;display:block}'+
            '.product .thumb img{display:block;width:100%;height:auto;border-radius:12px 12px 0 0}'+
            '.product .thumb .quick-link{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;'+
            'background:rgba(0,0,0,.45);color:#fff;text-decoration:none;font-weight:600;opacity:0;transition:opacity .2s ease;border-radius:12px 12px 0 0}'+
            '.product .thumb:hover .quick-link{opacity:1}'+
            '.slider .slide{pointer-events:none} .slider .slide.is-active{pointer-events:auto}';
    var s=document.createElement('style'); s.id='quickLinkStyles'; s.textContent=css; document.head.appendChild(s);
  })();
  initProductsMenu();
  initPasswordToggles();
  initHomeCollection();
  initAccountPrompt();
  initCartPage();
  initHeaderScroll();
});

// Basit localStorage tabanlı kimlik doğrulama
function initAuth(){
  var USERS_KEY='auth_users';
  var CURRENT_KEY='auth_current';
  var FLAG='auth_logged_in';
  function normEmail(e){try{return (e||'').trim().toLowerCase()}catch(_){return ''}}
  function readUsers(){try{return JSON.parse(localStorage.getItem(USERS_KEY)||'{}')}catch(_){return {}}}
  function writeUsers(o){try{localStorage.setItem(USERS_KEY,JSON.stringify(o))}catch(_){}}
  function isLoggedIn(){return localStorage.getItem(FLAG)==='1' && !!localStorage.getItem(CURRENT_KEY)}
  function currentEmail(){return normEmail(localStorage.getItem(CURRENT_KEY)||'')}
  function currentUser(){var u=readUsers(); var em=currentEmail(); return (em&&u[em])||null}
  function setLoggedIn(email){localStorage.setItem(CURRENT_KEY,normEmail(email)); localStorage.setItem(FLAG,'1')}
  function logout(){localStorage.removeItem(CURRENT_KEY); localStorage.setItem(FLAG,'0'); try{ localStorage.setItem('favorites:guest','[]'); }catch(_){ } try{ if(window.CartAPI && typeof window.CartAPI.clear==='function'){ window.CartAPI.clear(); } }catch(_){ }}
  function register(name,email,pass){email=normEmail(email); var users=readUsers(); if(users[email]) return {ok:false,reason:'exists'}; users[email]={name:name,email:email,password:pass}; writeUsers(users); setLoggedIn(email); return {ok:true}}
  function login(email,pass){email=normEmail(email); var u=readUsers()[email]; if(!u) return {ok:false,reason:'notfound'}; if(String(u.password)!==String(pass)) return {ok:false,reason:'badpass'}; setLoggedIn(email); return {ok:true}}
  function favKey(){try{if(isLoggedIn()){var em=currentEmail(); if(em) return 'favorites:'+em}}catch(_){ } return 'favorites:guest'}
  function handleForms(){
    var form=document.querySelector('form.auth-form'); if(!form) return;
    var isRegister=!!document.getElementById('fullName');
    form.addEventListener('submit',function(e){
      e.preventDefault();
      if(isRegister){
        var name=(document.getElementById('fullName')||{}).value||'';
        var email=(document.getElementById('email')||{}).value||'';
        var p1=(document.getElementById('password')||{}).value||'';
        var p2=(document.getElementById('password2')||{}).value||'';
        if(!name||!email||!p1||!p2){alert('Lütfen tüm alanları doldurun.');return}
        if(p1!==p2){alert('Şifreler aynı olmalı.');return}
        var r=register(name,email,p1); if(!r.ok){alert('Bu e‑posta ile kayıt zaten var.');return}
        window.location.href=siteRoot()+'anasayfa.html';
      }else{
        var email2=(document.getElementById('loginEmail')||{}).value||'';
        var s1=(document.getElementById('loginPassword')||{}).value||'';
        var s2=(document.getElementById('loginPassword2')||{}).value||'';
        if(!email2||!s1||!s2){alert('Lütfen tüm alanları doldurun.');return}
        if(s1!==s2){alert('Şifreler aynı olmalı.');return}
        var r2=login(email2,s1); if(!r2.ok){alert('E‑posta veya şifre hatalı.');return}
        window.location.href=siteRoot()+'anasayfa.html';
      }
    });
  }
  window.SiteAuth={isLoggedIn:isLoggedIn,currentEmail:currentEmail,currentUser:currentUser,favKey:favKey,login:login,logout:logout,register:register};
  handleForms();
}

// Account prompt (first-time)
function initAccountPrompt(){
  var loginFlag='auth_logged_in';
  var accountBtns=document.querySelectorAll('.icon-btn[aria-label="Hesabım"]');
  if(!accountBtns.length) return;

  function ensureModal(){
    var exist=document.getElementById('authPromptModal');
    if(exist) return exist;
    var wrap=document.createElement('div');
    wrap.id='authPromptModal';
    wrap.className='modal-overlay';
    var root=siteRoot();
    wrap.innerHTML='\n<div class="modal" role="dialog" aria-modal="true" aria-labelledby="authPromptTitle">\n  <button class="modal-close" aria-label="Kapat">×</button>\n  <h2 id="authPromptTitle" class="modal-title">Devam etmek için giriş yap ya da üye ol</h2>\n  <p class="modal-text">Hesap işlemlerine erişmek için önce oturum açman gerekiyor.</p>\n  <div class="modal-actions">\n    <a class="btn-primary" href="'+root+'kullanıcı/girisyap.html">Giriş Yap</a>\n    <a class="btn-outline" href="'+root+'kullanıcı/uyeol.html">Üye Ol</a>\n  </div>\n</div>';
    document.body.appendChild(wrap);
    // Close handlers
    function close(){wrap.classList.remove('is-open');}
    wrap.addEventListener('click',function(e){if(e.target===wrap) close()});
    var closeBtn=wrap.querySelector('.modal-close'); if(closeBtn){closeBtn.addEventListener('click',close)}
    document.addEventListener('keydown',function(e){if(wrap.classList.contains('is-open')&&e.key==='Escape') close()});
    return wrap;
  }

  function openIfNotLogged(){
    if(localStorage.getItem(loginFlag)==='1') return; // already logged in, don't open
    var modal=ensureModal();
    modal.classList.add('is-open');
  }

  function goAccount(){
    window.location.href=siteRoot()+'kullanıcı/hesap.html';
  }

  accountBtns.forEach(function(btn){
    btn.addEventListener('click',function(){
      try{
        if(window.SiteAuth && window.SiteAuth.isLoggedIn && window.SiteAuth.isLoggedIn()){
          goAccount();
          return;
        }
      }catch(_){ }
      openIfNotLogged();
    });
  });
}


