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
      var u2=new URL(location.href);u2.searchParams.set('variant',e.target.value);history.replaceState(null,'',u2.toString());
    }
  });
  var g=document.querySelector('[data-gallery]'),dots=document.querySelectorAll('[data-dots] span');
  if(g&&dots.length){g.addEventListener('scroll',function(){var i=Math.round(g.scrollLeft/g.clientWidth);dots.forEach(function(d,k){d.classList.toggle('is-active',k===i)})},{passive:true});}
  var buy=document.querySelector('[data-buy]'),sticky=document.querySelector('[data-sticky-buy]');
  if(buy&&sticky&&'IntersectionObserver' in window){new IntersectionObserver(function(en){var vis=!en[0].isIntersecting&&en[0].boundingClientRect.top<0;sticky.classList.toggle('is-visible',vis);sticky.setAttribute('aria-hidden',vis?'false':'true');sticky.querySelector('button').tabIndex=vis?0:-1;}).observe(buy);}
  document.addEventListener('input',function(e){if(e.target.matches('[data-count]')){var o=document.querySelector('[data-count-out]');if(o)o.textContent=e.target.value.length+'/'+e.target.maxLength;}});
})();
