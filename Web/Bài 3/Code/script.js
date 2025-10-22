// DOM elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const productItemsContainer = document.getElementById('product-list');
const addProductBtn = document.getElementById('addProductBtn');
const addProductForm = document.getElementById('addProductForm');
const cancelAddBtn = document.getElementById('cancelAdd');

// Helper: lọc sản phẩm theo từ khóa (không phân biệt hoa thường)
// Thay vì dùng display = 'none' (loại bỏ khỏi layout), ta thêm lớp .filtered-out
// để ẩn nội dung nhưng vẫn giữ kích thước hộp trong layout
function filterProducts() {
  const q = searchInput.value.trim().toLowerCase();
  const items = document.querySelectorAll('.product-item');
  items.forEach(item => {
    const nameEl = item.querySelector('.product-name');
    const name = nameEl ? nameEl.textContent.toLowerCase() : '';
    if (!q || name.includes(q)) {
      item.style.display = '';
    } else {
      item.style.display = 'none';
    }
  });
}

// Sự kiện: tìm khi gõ (live) và khi nhấn nút Tìm
searchInput.addEventListener('keyup', filterProducts);
searchBtn.addEventListener('click', filterProducts);

// Toggle hiển thị form thêm sản phẩm
function toggleAddForm(show) {
  if (typeof show === 'boolean') {
    addProductForm.classList.toggle('hidden', !show);
    addProductForm.setAttribute('aria-hidden', (!show).toString());
  } else {
    addProductForm.classList.toggle('hidden');
    const hidden = addProductForm.classList.contains('hidden');
    addProductForm.setAttribute('aria-hidden', hidden.toString());
  }
}
addProductBtn.addEventListener('click', () => toggleAddForm());

// Hủy thêm
if (cancelAddBtn) {
  cancelAddBtn.addEventListener('click', () => {
    toggleAddForm(false);
    addProductForm.reset();
  });
}

// Xử lý submit form thêm sản phẩm
addProductForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const name = document.getElementById('newName').value.trim();
  const image = document.getElementById('newImage').value.trim();
  const price = document.getElementById('newPrice').value.trim();
  const desc = document.getElementById('newDesc').value.trim();

  if (!name) {
    alert('Vui lòng nhập tên sản phẩm.');
    return;
  }

  // Tạo thẻ article mới theo cấu trúc hiện tại
  const article = document.createElement('article');
  article.className = 'product-item';

  const h3 = document.createElement('h3');
  h3.className = 'product-name';
  h3.textContent = name;

  const img = document.createElement('img');
  img.alt = `Bìa ${name}`;
  img.src = image || 'no-image.jpeg';

  const pDesc = document.createElement('p');
  pDesc.textContent = desc || 'Chưa có mô tả.';

  const pPrice = document.createElement('p');
  pPrice.className = 'product-price';
  pPrice.innerHTML = `Giá: <span>${price || 'Liên hệ'}</span>`;

  article.appendChild(h3);
  article.appendChild(img);
  article.appendChild(pDesc);
  article.appendChild(pPrice);

  productItemsContainer.appendChild(article);

  // Reset và ẩn form
  addProductForm.reset();
  toggleAddForm(false);
});