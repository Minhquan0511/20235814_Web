// DOM elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const productItemsContainer = document.getElementById('product-list');
const addProductBtn = document.getElementById('addProductBtn');
const addProductForm = document.getElementById('addProductForm');
const cancelAddBtn = document.getElementById('cancelAdd');
const errorMsg = document.getElementById('errorMsg');
const newNameInput = document.getElementById('newName');
const newImageInput = document.getElementById('newImage');
const newPriceInput = document.getElementById('newPrice');
const newDescInput = document.getElementById('newDesc');

// Biến lưu trữ danh sách sản phẩm (tải từ LocalStorage)
let products = [];
const STORAGE_KEY = 'abc_bookstore_products';

// --- Hàm tạo cấu trúc HTML cho một sản phẩm ---
function createProductElement(product) {
  const article = document.createElement('article');
  article.className = 'product-item';

  const h3 = document.createElement('h3');
  h3.className = 'product-name';
  h3.textContent = product.name;

  const img = document.createElement('img');
  img.alt = `Bìa ${product.name}`;
  // Dùng URL ảnh nếu có, ngược lại dùng placeholder.
  img.src = product.image || 'no-image.jpeg';

  const pDesc = document.createElement('p');
  pDesc.textContent = product.description || 'Chưa có mô tả.';

  const pPrice = document.createElement('p');
  pPrice.className = 'product-price';
  // Hiển thị giá dưới dạng có phân hàng ngàn (Việt Nam)
  const priceDisplay = Number(product.price).toLocaleString('vi-VN');
  pPrice.innerHTML = `Giá: <span>${priceDisplay}₫</span>`;

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

  return article;
}

// --- Hàm Render (vẽ) lại danh sách sản phẩm ---
function renderProducts() {
  // Xóa nội dung hiện tại (các sản phẩm mẫu trong HTML cũng bị xóa)
  productItemsContainer.innerHTML = ''; 

  if (products.length > 0) {
    products.forEach(product => {
      const productEl = createProductElement(product);
      productItemsContainer.appendChild(productEl);
    });
  } else {
    // Hiển thị thông báo nếu không có sản phẩm nào
    productItemsContainer.innerHTML = '<p>Chưa có sản phẩm nào được thêm.</p>';
  }
  
  // Sau khi render xong, áp dụng lại bộ lọc (nếu có)
  filterProducts(); 
}

// --- Hàm Lưu trữ dữ liệu vào LocalStorage (Bài tập 5) ---
function saveProductsToLocalStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch (e) {
    console.error("Không thể lưu LocalStorage:", e);
  }
}

// --- Hàm lấy dữ liệu sản phẩm mẫu ban đầu từ HTML ---
function getInitialProducts() {
  const initialItems = [];
  const sampleItems = document.querySelectorAll('#product-list .product-item');
  
  sampleItems.forEach(item => {
    const name = item.querySelector('.product-name')?.textContent.trim();
    const imageEl = item.querySelector('img');
    const image = imageEl ? imageEl.src : '';
    const desc = item.querySelector('p:not(.product-price)')?.textContent.trim();
    const priceText = item.querySelector('.product-price span')?.textContent.replace('₫', '').replace(/\./g, '').replace(/,/g, '').trim();
    
    const price = priceText ? parseFloat(priceText) : 0; 
    
    if (name && price > 0) {
      initialItems.push({
        name: name,
        image: image.includes('/') ? image : '', // Chỉ lưu URL ảnh hợp lệ
        price: price,
        description: desc
      });
    }
  });
  
  // Xóa các sản phẩm mẫu khỏi DOM sau khi đã lấy dữ liệu
  sampleItems.forEach(item => item.remove());

  // Nếu không lấy được từ DOM (vì đã xóa ở lần chạy trước), cung cấp dữ liệu mặc định
  if (initialItems.length === 0) {
    return [
      { name: "Tiểu thuyết", image: "", price: 120000, description: "Một câu chuyện cảm động về ký ức và tình người." },
      { name: "Sách học lập trình", image: "", price: 180000, description: "Hướng dẫn dành cho người mới bắt đầu, kèm bài tập thực hành." },
      { name: "Sách thiếu nhi", image: "", price: 90000, description: "Câu chuyện vui nhộn, minh họa màu sắc phù hợp cho trẻ em." }
    ];
  }
  
  return initialItems;
}

// --- Hàm Tải dữ liệu từ LocalStorage hoặc khởi tạo dữ liệu mẫu (Bài tập 5) ---
function loadProducts() {
  const storedData = localStorage.getItem(STORAGE_KEY);
  
  if (storedData) {
    try {
      products = JSON.parse(storedData);
    } catch (e) {
      console.error("Lỗi parse JSON từ LocalStorage, sử dụng dữ liệu mẫu:", e);
      products = getInitialProducts(); 
    }
  } else {
    // Nếu chưa có, sử dụng dữ liệu mẫu
    products = getInitialProducts();
    // Lưu lại ngay lần đầu để chuẩn hóa
    saveProductsToLocalStorage(); 
  }
  
  renderProducts(); // Hiển thị sản phẩm sau khi tải xong
}

// --- Logic tìm kiếm/lọc sản phẩm ---
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


// --- Toggle hiển thị form thêm sản phẩm với hiệu ứng trượt (Bài tập 6) ---
function toggleAddForm(show) {
  const isCurrentlyHidden = addProductForm.classList.contains('show-form') === false;
  let shouldShow;

  if (typeof show === 'boolean') {
    shouldShow = show;
  } else {
    shouldShow = isCurrentlyHidden; // Nếu không truyền show, đảo trạng thái hiện tại
  }

  if (shouldShow) {
    // HIỂN THỊ FORM (Trượt xuống)
    addProductForm.classList.add('show-form');
    addProductForm.style.maxHeight = '0'; 
    addProductForm.setAttribute('aria-hidden', 'false');
    
    // Đặt max-height bằng scrollHeight sau 1 frame để áp dụng transition
    setTimeout(() => {
      addProductForm.style.maxHeight = addProductForm.scrollHeight + "px";
    }, 10);
    
    // khi mở form, xóa lỗi cũ
    errorMsg.textContent = '';
  } else {
    // ẨN FORM (Trượt lên)
    // 1. Đặt max-height về giá trị hiện tại trước khi thu gọn
    addProductForm.style.maxHeight = addProductForm.scrollHeight + "px";

    // 2. Chuyển về 0 sau một thời gian ngắn để kích hoạt transition
    setTimeout(() => {
      addProductForm.style.maxHeight = '0';
      addProductForm.classList.remove('show-form');
      addProductForm.setAttribute('aria-hidden', 'true');
    }, 10);
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

// --- Xử lý submit form thêm sản phẩm ---
addProductForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const name = newNameInput.value.trim();
  const image = newImageInput.value.trim();
  const priceNumber = Number(newPriceInput.value);
  const desc = newDescInput.value.trim();

  // Validate: tên không rỗng, giá là số > 0
  if (!name) {
    errorMsg.textContent = 'Vui lòng nhập tên sản phẩm.';
    newNameInput.focus();
    return;
  }
  if (isNaN(priceNumber) || priceNumber <= 0) {
    errorMsg.textContent = 'Giá phải là số hợp lệ lớn hơn 0.';
    newPriceInput.focus();
    return;
  }

  // Clear error
  errorMsg.textContent = '';

  // Tạo đối tượng sản phẩm mới
  const newProduct = {
    name: name,
    image: image,
    price: priceNumber,
    description: desc,
  };
  
  // 1. Thêm vào mảng dữ liệu
  products.unshift(newProduct); 

  // 2. Lưu mảng dữ liệu đã cập nhật vào LocalStorage
  saveProductsToLocalStorage();
  
  // 3. Cập nhật giao diện (chỉ thêm element mới)
  const productElement = createProductElement(newProduct);
  productItemsContainer.prepend(productElement);

  // 4. Áp dụng filter 
  filterProducts();

  // 5. Reset và ẩn form (sẽ trượt lên mượt mà)
  addProductForm.reset();
  toggleAddForm(false);
});


// --- Khởi tạo: Tải dữ liệu khi trang web được load lần đầu tiên ---
loadProducts();