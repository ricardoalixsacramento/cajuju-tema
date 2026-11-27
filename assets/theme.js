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
      if(pat&&window.cajujuGallery)window.cajujuGallery.showAlt(pat);
  }
  var chk=document.querySelector('[data-variant]:checked');if(chk&&document.querySelector('[data-box-pattern]'))showPattern((chk.dataset.title||'').split(' / ')[0]);
  var buy=document.querySelector('[data-buy]'),sticky=document.querySelector('[data-sticky-buy]');
  if(buy&&sticky&&'IntersectionObserver' in window){new IntersectionObserver(function(en){var vis=!en[0].isIntersecting&&en[0].boundingClientRect.top<0;sticky.classList.toggle('is-visible',vis);sticky.setAttribute('aria-hidden',vis?'false':'true');sticky.querySelector('button').tabIndex=vis?0:-1;}).observe(buy);}
  document.addEventListener('input',function(e){if(e.target.matches('[data-count]')){var o=document.querySelector('[data-count-out]');if(o)o.textContent=e.target.value.length+'/'+e.target.maxLength;}});



  /* Galeria de produto: deslizar, miniaturas, lupa e ecrã inteiro */
  (function(){
    var root=document.querySelector('[data-pgal]'); if(!root)return;
    var track=root.querySelector('[data-track]'),slides=[].slice.call(root.querySelectorAll('.pgal__slide[data-slide]')),thumbs=[].slice.call(root.querySelectorAll('[data-thumb]'));
    var stage=root.querySelector('.pgal__stage'),cur=root.querySelector('[data-cur]'),prev=root.querySelector('[data-prev]'),next=root.querySelector('[data-next]');
    var idx=0,n=slides.length; if(!n)return;
    function set(i){idx=i;if(cur)cur.textContent=i+1;thumbs.forEach(function(t,k){var on=k===i;t.classList.toggle('is-active',on);t.setAttribute('aria-selected',on?'true':'false');if(on&&t.scrollIntoView&&t.parentNode.scrollWidth>t.parentNode.clientWidth){t.parentNode.scrollTo({left:t.offsetLeft-t.parentNode.clientWidth/2+t.clientWidth/2,behavior:'smooth'})}});if(prev)prev.disabled=i===0;if(next)next.disabled=i===n-1;}
    function go(i,instant){i=Math.max(0,Math.min(n-1,i));track.scrollTo({left:slides[i].offsetLeft,behavior:instant?'auto':'smooth'});set(i);}
    var t0;track.addEventListener('scroll',function(){clearTimeout(t0);t0=setTimeout(function(){var i=Math.round(track.scrollLeft/track.clientWidth);if(i!==idx)set(i)},60)},{passive:true});
    thumbs.forEach(function(t){t.addEventListener('click',function(){go(+t.dataset.thumb)})});
    if(prev)prev.addEventListener('click',function(){go(idx-1)});if(next)next.addEventListener('click',function(){go(idx+1)});
    track.addEventListener('keydown',function(e){if(e.key==='ArrowRight'){e.preventDefault();go(idx+1)}if(e.key==='ArrowLeft'){e.preventDefault();go(idx-1)}});
    set(0);
    /* lupa ao passar o rato (só com rato) */
    var fine=window.matchMedia('(hover:hover) and (pointer:fine)').matches;
    if(fine){slides.forEach(function(sl){var img=sl.querySelector('img');if(!img)return;
      sl.addEventListener('mouseenter',function(){sl.classList.add('is-zoom');stage.classList.add('is-zooming')});
      sl.addEventListener('mousemove',function(e){var r=sl.getBoundingClientRect();img.style.transformOrigin=((e.clientX-r.left)/r.width*100)+'% '+((e.clientY-r.top)/r.height*100)+'%'});
      sl.addEventListener('mouseleave',function(){sl.classList.remove('is-zoom');stage.classList.remove('is-zooming')});});}
    /* ecrã inteiro */
    var lb=document.querySelector('[data-lb]');
    if(lb){
      var lt=lb.querySelector('[data-lb-track]'),lcur=lb.querySelector('[data-lb-cur]'),li=0,built=false,last;
      function build(){if(built)return;built=true;slides.forEach(function(sl,k){var d=document.createElement('div');d.className='lb__slide';var im=new Image();im.src=sl.dataset.full;im.alt=sl.dataset.alt;im.draggable=false;d.appendChild(im);lt.appendChild(d);zoomable(d,im)});}
      function lgo(i,instant){i=Math.max(0,Math.min(n-1,i));li=i;lt.scrollTo({left:lt.children[i].offsetLeft,behavior:instant?'auto':'smooth'});lcur.textContent=i+1;reset();}
      function reset(){[].forEach.call(lt.children,function(c){c.classList.remove('is-zoom');var im=c.firstChild;im.style.transform='';c._s=1;c._x=0;c._y=0})}
      var lt0;lt.addEventListener('scroll',function(){clearTimeout(lt0);lt0=setTimeout(function(){var i=Math.round(lt.scrollLeft/lt.clientWidth);if(i!==li){li=i;lcur.textContent=i+1;reset()}},80)},{passive:true});
      function open(i){last=document.activeElement;build();lb.hidden=false;document.body.classList.add('lb-open');requestAnimationFrame(function(){lgo(i,true)});lb.querySelector('[data-lb-close]').focus();}
      function close(){lb.hidden=true;document.body.classList.remove('lb-open');reset();go(li,true);if(last)last.focus();}
      root.querySelectorAll('[data-open]').forEach(function(b){b.addEventListener('click',function(){open(+b.dataset.open)})});
      lb.querySelector('[data-lb-close]').addEventListener('click',close);
      var lp=lb.querySelector('[data-lb-prev]'),ln=lb.querySelector('[data-lb-next]');
      if(lp)lp.addEventListener('click',function(){lgo(li-1)});if(ln)ln.addEventListener('click',function(){lgo(li+1)});
      document.addEventListener('keydown',function(e){if(lb.hidden)return;if(e.key==='Escape')close();if(e.key==='ArrowRight')lgo(li+1);if(e.key==='ArrowLeft')lgo(li-1);});
      function zoomable(box,im){
        box._s=1;box._x=0;box._y=0;var drag=null,pts={},pinch=null,lastTap=0;
        function apply(){im.style.transform='translate('+box._x+'px,'+box._y+'px) scale('+box._s+')';box.classList.toggle('is-zoom',box._s>1.01)}
        function clamp(){var r=im.getBoundingClientRect(),w=im.offsetWidth*box._s,h=im.offsetHeight*box._s,mx=Math.max(0,(w-box.clientWidth)/2),my=Math.max(0,(h-box.clientHeight)/2);box._x=Math.max(-mx,Math.min(mx,box._x));box._y=Math.max(-my,Math.min(my,box._y));}
        function toggle(cx,cy){if(box._s>1.01){box._s=1;box._x=0;box._y=0}else{var r=box.getBoundingClientRect();box._s=2.5;box._x=(r.width/2-(cx-r.left))*1.5;box._y=(r.height/2-(cy-r.top))*1.5;clamp()}apply();}
        im.addEventListener('dblclick',function(e){toggle(e.clientX,e.clientY)});
        im.addEventListener('click',function(e){if(window.matchMedia('(pointer:fine)').matches&&box._s<=1.01)toggle(e.clientX,e.clientY)});
        box.addEventListener('pointerdown',function(e){pts[e.pointerId]=e;var ids=Object.keys(pts);
          if(e.pointerType==='touch'){var now=Date.now();if(ids.length===1&&now-lastTap<280){toggle(e.clientX,e.clientY);lastTap=0;return}lastTap=now;}
          if(ids.length===2){var a=pts[ids[0]],b=pts[ids[1]];pinch={d:Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY),s:box._s};}
          else if(box._s>1.01){drag={x:e.clientX,y:e.clientY,ox:box._x,oy:box._y};box.setPointerCapture(e.pointerId);}});
        box.addEventListener('pointermove',function(e){if(!pts[e.pointerId])return;pts[e.pointerId]=e;var ids=Object.keys(pts);
          if(pinch&&ids.length===2){var a=pts[ids[0]],b=pts[ids[1]];box._s=Math.max(1,Math.min(4,pinch.s*Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY)/pinch.d));clamp();apply();e.preventDefault();}
          else if(drag){box._x=drag.ox+(e.clientX-drag.x);box._y=drag.oy+(e.clientY-drag.y);clamp();apply();}});
        function up(e){delete pts[e.pointerId];if(Object.keys(pts).length<2)pinch=null;drag=null;if(box._s<=1.01){box._s=1;box._x=0;box._y=0;apply()}}
        box.addEventListener('pointerup',up);box.addEventListener('pointercancel',up);
        box.addEventListener('wheel',function(e){if(box._s>1.01||e.ctrlKey){e.preventDefault();box._s=Math.max(1,Math.min(4,box._s*(e.deltaY<0?1.12:0.89)));if(box._s<=1.01){box._x=0;box._y=0}clamp();apply();}},{passive:false});
      }
    }
    window.cajujuGallery={go:go,showAlt:function(txt){for(var k=0;k<n;k++){if((slides[k].dataset.alt||'').indexOf(txt)>-1){go(k,true);return}}}};
  })();

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
