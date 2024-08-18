// Tìm kiếm truyện bằng ô search
let debounceTimer;

function debounceSearch() {
    clearTimeout(debounceTimer); // Xóa bộ đếm thời gian trước đó

    debounceTimer = setTimeout(() => {
        search();
    }, 300); // Đặt thời gian chờ là 300ms (0.3 giây)
}

function search() {
    const query = document.querySelector('.header_ext__search input').value;
    const results = document.getElementsByClassName('header_ext__dropdown')[0];

    if (query.length >= 2) {  // Chỉ tìm kiếm khi người dùng nhập hơn 2 ký tự
        fetch(`/search?q=${query}`)
            .then(response => response.json())
            .then(data => {
               while (results.firstChild) {
                    results.removeChild(results.firstChild);
               };
                if(data.length !== 0) {
                    data.forEach(item => {
                         const block = document.createElement('a');
                         block.className = 'header_ext__dropdown-item';
                         block.href = `/truyen/${item.link}`;

                         block.innerHTML = `
                              <div class="header_ext__dropdown-img">
                                   <img src="${item.anh}" alt="${item.ten}">
                              </div>
                              <div class="header_ext__dropdown-info">
                                   <div class="header_ext__dropdown-info-name">${item.ten}</div>
                                   <div class="header_ext__dropdown-info-chapter">Chương ${item.chuong}</div>
                              </div>
                         `;

                         results.appendChild(block);
                     });
                }
                else {
                    const block = document.createElement('div');
                    block.className = "header_ext__dropdown-none";
                    block.innerHTML = "Không tìm được truyện !";
                    results.appendChild(block)
                }
            });
    }
    else {
     while (results.firstChild) {
          results.removeChild(results.firstChild);
     };
    }
}

document.addEventListener('DOMContentLoaded', function() {
     const searchInput = document.querySelector('.header_ext__search input');
     const results = document.getElementsByClassName('header_ext__dropdown')[0];
     searchInput.addEventListener('focus', function() {
          results.style.display = 'block';
      });
      
      // Ẩn thẻ div khi người dùng nhấp ra ngoài thẻ input và thẻ div
      document.addEventListener('click', function(event) {
          // Kiểm tra nếu nhấp vào bên ngoài thẻ input và thẻ div
          if (!searchInput.contains(event.target) && !results.contains(event.target)) {
              results.style.display = 'none';
          }
      });
});