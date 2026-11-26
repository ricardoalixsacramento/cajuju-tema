(function(){
  var header=document.querySelector('[data-header]');
  if(header){var onS=function(){header.classList.toggle('is-scrolled',window.scrollY>4)};onS();window.addEventListener('scroll',onS,{passive:true});}
  var drawer=document.querySelector('[data-drawer]');var opener=document.querySelector('[data-drawer-open]');
  function setDrawer(open){if(!drawer)return;drawer.classList.toggle('is-open',open);drawer.setAttribute('aria-hidden',open?'false':'true');if(opener)opener.setAttribute('aria-expanded',open?'true':'false');document.body.style.overflow=open?'hidden':'';if(open){var c=drawer.querySelector('[data-drawer-close].icon-btn');if(c)c.focus();}else if(opener){opener.focus();}}
  document.addEventListener('click',function(e){
    if(e.target.closest('[data-drawer-open]')){setDrawer(true);return}
    if(e.target.closest('[data-drawer-close]')){setDrawer(false);return}
    var q=e.target.closest('[data-qty]');
    if(q){var i=q.parentNode.querySelector('input');var v=parseInt(i.value||'1',10)+parseInt(q.dataset.qty,10);i.value=Math.max(1,v);}
  });
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&drawer&&drawer.classList.contains('is-open'))setDrawer(false)});
  document.addEventListener('change',function(e){
    if(e.target.matches('[data-sort]')){var u=new URL(location.href);u.searchParams.set('sort_by',e.target.value);location.href=u.toString();}
    if(e.target.matches('[data-variant]')){
      document.querySelectorAll('[data-price]').forEach(function(p){if(e.target.dataset.price)p.textContent=e.target.dataset.price});
      var l=document.querySelector('[data-size-label]');if(l)l.textContent=e.target.dataset.title;
      showPattern((e.target.dataset.title||'').split(' / ')[0]);
      var u2=new URL(location.href);u2.searchParams.set('variant',e.target.value);history.replaceState(null,'',u2.toString());
    }
  });
  function showPattern(pat){
      document.querySelectorAll('[data-box-pattern]').forEach(function(b){b.hidden=b.dataset.boxPattern!==pat});
      var gal=document.querySelector('[data-gallery]');
      if(gal&&pat){var hit=[].find.call(gal.querySelectorAll('.gallery__item'),function(it){var im=it.querySelector('img');return im&&im.alt.indexOf(pat)>-1});if(hit&&hit!==gal.firstElementChild){gal.insertBefore(hit,gal.firstElementChild);gal.scrollLeft=0;}}
  }
  var chk=document.querySelector('[data-variant]:checked');if(chk&&document.querySelector('[data-box-pattern]'))showPattern((chk.dataset.title||'').split(' / ')[0]);
  var g=document.querySelector('[data-gallery]'),dots=document.querySelectorAll('[data-dots] span');
  if(g&&dots.length){g.addEventListener('scroll',function(){var i=Math.round(g.scrollLeft/g.clientWidth);dots.forEach(function(d,k){d.classList.toggle('is-active',k===i)})},{passive:true});}
  var buy=document.querySelector('[data-buy]'),sticky=document.querySelector('[data-sticky-buy]');
  if(buy&&sticky&&'IntersectionObserver' in window){new IntersectionObserver(function(en){var vis=!en[0].isIntersecting&&en[0].boundingClientRect.top<0;sticky.classList.toggle('is-visible',vis);sticky.setAttribute('aria-hidden',vis?'false':'true');sticky.querySelector('button').tabIndex=vis?0:-1;}).observe(buy);}
  document.addEventListener('input',function(e){if(e.target.matches('[data-count]')){var o=document.querySelector('[data-count-out]');if(o)o.textContent=e.target.value.length+'/'+e.target.maxLength;}});


  /* Produtos com várias opções (padrão + tamanho) */
  var vj=document.querySelector('[data-variants]');
  if(vj){
    var variants=JSON.parse(vj.textContent),idIn=document.querySelector('[data-variant-id]');
    var money=function(c){return '€'+(c/100).toFixed(2).replace('.',',')};
    var sync=function(){
      var sel=[];document.querySelectorAll('[data-opt-index]').forEach(function(fs){var c=fs.querySelector('input:checked');sel[+fs.dataset.optIndex]=c?c.value:null;document.querySelector('[data-opt-label="'+fs.dataset.optIndex+'"]').textContent=c?c.value:''});
      var v=variants.find(function(x){return x.options.every(function(o,i){return o===sel[i]})});
      var btns=document.querySelectorAll('button[type=submit][form=product-form], #product-form button[type=submit]');
      if(v){idIn.value=v.id;document.querySelectorAll('[data-price]').forEach(function(p){p.textContent=money(v.price)});
        btns.forEach(function(b){b.disabled=!v.available;if(b.hasAttribute('data-buy'))b.textContent=v.available?'Adicionar ao carrinho':'Esgotado'});
        var u=new URL(location.href);u.searchParams.set('variant',v.id);history.replaceState(null,'',u.toString());}
      if(sel[0])showPattern(sel[0]);
    };
    document.addEventListener('change',function(e){if(e.target.matches('[data-opt]'))sync()});
    sync();
  }
  /* Adicionar ao carrinho sem sair da página */
  var form=document.getElementById('product-form');
  if(form&&window.fetch){
    form.addEventListener('submit',function(e){
      e.preventDefault();
      var btns=document.querySelectorAll('button[type=submit][form=product-form], #product-form button[type=submit]');
      btns.forEach(function(b){b.classList.add('is-loading')});
      fetch('/cart/add.js',{method:'POST',headers:{'Accept':'application/json'},body:new FormData(form)})
        .then(function(r){return r.json().then(function(j){if(!r.ok)throw j;return j})})
        .then(function(item){return fetch('/cart.js').then(function(r){return r.json()}).then(function(c){showToast(item,c)})})
        .catch(function(err){showToast(null,null,(err&&err.description)||'Não foi possível adicionar. Tenta novamente.')})
        .finally(function(){btns.forEach(function(b){b.classList.remove('is-loading')})});
    });
  }
  function showToast(item,cart,msg){
    var t=document.querySelector('.toast');
    if(!t){t=document.createElement('div');t.className='toast';t.setAttribute('role','status');t.setAttribute('aria-live','polite');document.body.appendChild(t);}
    if(item){
      var img=item.image?'<img src="'+item.image.replace(/(\.\w+)(\?|$)/,'_120x$1$2')+'" alt="">':'';
      var free=50*100-cart.total_price;
      var extra=free>0?'<br><small>Faltam '+(free/100).toFixed(2).replace('.',',')+' € para portes grátis</small>':'<br><small>Tens portes grátis</small>';
      t.innerHTML=img+'<span>Adicionado ao carrinho'+extra+'</span><a href="/cart">Ver carrinho</a>';
      var cnt=document.querySelector('.cart-count');
      var bag=document.querySelector('[data-cart-link]');
      if(!cnt&&bag){cnt=document.createElement('span');cnt.className='cart-count';bag.appendChild(cnt);}
      if(cnt)cnt.textContent=cart.item_count;
    } else { t.innerHTML='<span>'+msg+'</span>'; }
    t.classList.add('is-on'); clearTimeout(t._h); t._h=setTimeout(function(){t.classList.remove('is-on')},5000);
  }
})();
