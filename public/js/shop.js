import { loadProducts, money, renderAuthUI, updateCartCount } from "/js/app.js";

renderAuthUI(); updateCartCount();
document.getElementById("y").textContent = new Date().getFullYear();

const products = await loadProducts();
const grid = document.getElementById("grid");
const countText = document.getElementById("countText");

const q = document.getElementById("q");
const cat = document.getElementById("cat");
const sort = document.getElementById("sort");

const drawer = document.getElementById("drawer");
const backdrop = document.getElementById("backdrop");
document.getElementById("openFilters").addEventListener("click", () => {
  drawer.classList.add("open");
  backdrop.classList.add("open");
});
document.getElementById("closeFilters").addEventListener("click", () => {
  drawer.classList.remove("open");
  backdrop.classList.remove("open");
});
backdrop.addEventListener("click", () => {
  drawer.classList.remove("open");
  backdrop.classList.remove("open");
});

const categories = [...new Set(products.map(p => p.category))].sort();
cat.innerHTML += categories.map(c => `<option value="${c}">${c}</option>`).join("");

function apply(){
  const query = q.value.trim().toLowerCase();
  const c = cat.value;
  const s = sort.value;

  let rows = products.filter(p => {
    const okQ = !query || p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query);
    const okC = !c || p.category === c;
    return okQ && okC;
  });

  if(s === "low") rows.sort((a,b)=>a.price-b.price);
  if(s === "high") rows.sort((a,b)=>b.price-a.price);
  if(s === "az") rows.sort((a,b)=>a.name.localeCompare(b.name));

  countText.textContent = `${rows.length} item(s)`;

  grid.innerHTML = rows.map(p => `
    <a class="card" href="/product.html?id=${encodeURIComponent(p.id)}">
      <div class="cardImg" style="background-image:url('${p.image}')"></div>
      <div class="cardBody">
        <div class="cardTop">
          <div class="cardName">${p.name}</div>
          ${p.badge ? `<span class="badge">${p.badge}</span>` : ``}
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center">
          <div class="muted small">${p.category}</div>
          <div class="price">${money(p.price)}</div>
        </div>
        <div class="cardActions">
          <span class="btn ghost" style="pointer-events:none">View</span>
        </div>
      </div>
    </a>
  `).join("") || `<div class="notice">No products match your filters.</div>`;
}

[q,cat,sort].forEach(el => el.addEventListener("input", apply));
document.getElementById("reset").addEventListener("click", ()=>{
  q.value=""; cat.value=""; sort.value="featured"; apply();
});

apply();
