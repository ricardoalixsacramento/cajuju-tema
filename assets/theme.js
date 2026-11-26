document.addEventListener('click',function(e){
  var t=e.target.closest('[data-thumb]');
  if(t){var main=document.querySelector('[data-main-img]');if(main){main.src=t.dataset.src;main.removeAttribute('srcset');}
    document.querySelectorAll('[data-thumb]').forEach(function(b){b.classList.toggle('is-active',b===t)});}
  var q=e.target.closest('[data-qty]');
  if(q){var i=q.parentNode.querySelector('input');var v=parseInt(i.value||'1',10)+parseInt(q.dataset.qty,10);i.value=Math.max(1,v);}
});
document.addEventListener('change',function(e){
  if(e.target.matches('[data-sort]')){var u=new URL(location.href);u.searchParams.set('sort_by',e.target.value);location.href=u.toString();}
  if(e.target.matches('[data-variant]')){var p=document.querySelector('[data-price]');if(p&&e.target.dataset.price)p.textContent=e.target.dataset.price;
    var l=document.querySelector('[data-size-label]');if(l)l.textContent=e.target.dataset.title;}
});
