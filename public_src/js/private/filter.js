// Hiện dropdown pagination
document.addEventListener('DOMContentLoaded', function() {
     const pagination = document.querySelector('.pagination__select');
     const pagination_dropdown = pagination.querySelector('.pagination__option');
     pagination.addEventListener('click', () => {
          if (pagination_dropdown.style.display === "none") {
               pagination_dropdown.style.display = "block";
               const page = pagination.querySelector('span:nth-child(1)');
               const items = pagination_dropdown.querySelectorAll('a');
               const current_item = Array.from(items).find(a => a.textContent.trim() === page.textContent);
               current_item.style.backgroundColor = "#e0e0e0";
               current_item.style.color = "black";
               current_item.style.pointerEvents = "none";
               current_item.scrollIntoView({block: 'center'});
          }
          else pagination_dropdown.style.display = "none";
     })
});

// Tìm kiếm khi thẻ select thay đổi giá trị
document.addEventListener('DOMContentLoaded', function() {
     const selectElements = document.querySelectorAll('.body_filter__dropdown');
     const dataObject = {};
     selectElements.forEach(item => {
          const name = item.name; 
          const value = item.value; 

          dataObject[name] = value; 
     })

     // Lắng nghe sự kiện thay đổi trên select
     selectElements.forEach(item => {
          item.addEventListener('change', function(e) {
               dataObject[e.target.name] = e.target.value;
               // Chuyển đối tượng thành chuỗi theo định dạng 'key=value'
               const queryString = new URLSearchParams(dataObject).toString();
               window.location.href = `/filter?${queryString}&page=1`;
          });
     });
})