// DOM elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const productItemsContainer = document.getElementById('product-list');
const addProductBtn = document.getElementById('addProductBtn');
const addProductForm = document.getElementById('addProductForm');
const cancelAddBtn = document.getElementById('cancelAdd');
const errorMsg = document.getElementById('errorMsg');
const newPriceInput = document.getElementById('newPrice');

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
      item.classList.remove('filtered-out');
    } else {
      item.classList.add('filtered-out');
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
  // khi mở form, xóa lỗi cũ
  if (!addProductForm.classList.contains('hidden')) {
    errorMsg.textContent = '';
  }
}
addProductBtn.addEventListener('click', () => toggleAddForm());

// Hủy thêm
if (cancelAddBtn) {
  cancelAddBtn.addEventListener('click', () => {
    toggleAddForm(false);
    addProductForm.reset();
    errorMsg.textContent = '';
  });
}

// Xử lý submit form thêm sản phẩm với validation
addProductForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('newName').value.trim();
  const image = document.getElementById('newImage').value.trim();
  const priceNumber = Number(newPriceInput.value); // sử dụng input[type=number]
  const desc = document.getElementById('newDesc').value.trim();

  // Validate: tên không rỗng, giá là số > 0
  if (!name) {
    errorMsg.textContent = 'Vui lòng nhập tên sản phẩm.';
    document.getElementById('newName').focus();
    return;
  }
  if (isNaN(priceNumber) || priceNumber <= 0) {
    errorMsg.textContent = 'Giá phải là số hợp lệ lớn hơn 0.';
    newPriceInput.focus();
    return;
  }

  // Clear error
  errorMsg.textContent = '';

  // Tạo thẻ article mới theo cấu trúc hiện tại
  const article = document.createElement('article');
  article.className = 'product-item';

  const h3 = document.createElement('h3');
  h3.className = 'product-name';
  h3.textContent = name;

  const img = document.createElement('img');
  img.alt = `Bìa ${name}`;
  img.src = image || `no-image.jpeg`;

  const pDesc = document.createElement('p');
  pDesc.textContent = desc || 'Chưa có mô tả.';

  const pPrice = document.createElement('p');
  pPrice.className = 'product-price';
  // Hiển thị giá dưới dạng có phân hàng ngàn
  pPrice.innerHTML = `Giá: <span>${priceNumber.toLocaleString('vi-VN')}₫</span>`;

  article.appendChild(h3);
  article.appendChild(img);
  article.appendChild(pDesc);
  article.appendChild(pPrice);

  // Đảm bảo item mới có cùng min-height như item mẫu (giữ layout ổn định)
  const sample = document.querySelector('.product-item');
  if (sample) {
    const minH = window.getComputedStyle(sample).minHeight;
    if (minH && minH !== '0px') {
      article.style.minHeight = minH;
    } else {
      article.style.minHeight = '280px';
    }
  } else {
    article.style.minHeight = '280px';
  }

  // Thêm sản phẩm mới lên đầu danh sách
  productItemsContainer.prepend(article);

  // Gọi lại filter để sản phẩm mới tuân thủ bộ lọc hiện tại
  filterProducts();

  // Reset và ẩn form
  addProductForm.reset();
  toggleAddForm(false);
});