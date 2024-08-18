// Khi nhấn vào thùng rác mở bảng xác nhận xóa
document.addEventListener('DOMContentLoaded', () => {
     const delete_confirm__block = document.querySelector('.delete_confirm__block');
     const trash_icon = document.querySelectorAll('.body_comic__item-delete');
     trash_icon.forEach(item => {
          item.addEventListener('click', function(e) {
               delete_confirm__block.style.display = "block";
               // Khi nhấn vào "Hủy" tắt bảng xác nhận xóa
               const cancel_btn = delete_confirm__block.querySelector('.delete_confirm__select button:nth-child(1)');
               cancel_btn.addEventListener('click', function(e) {
                    delete_confirm__block.style.display = "none";
               });
          });
     });
});

function openDeleteConfirmPopup(delete_icon,data_block,data_attribute,path_to_delete) {
     const delete_confirm__block = document.querySelector('.delete_confirm__block');
     const trash_icon = document.querySelectorAll(delete_icon);
    
     trash_icon.forEach(item => {
          item.addEventListener('click', function(e) {
               delete_confirm__block.style.display = "block";
               // Khi nhấn vào "Hủy" tắt bảng xác nhận xóa
               const cancel_btn = delete_confirm__block.querySelector('.delete_confirm__select button:nth-child(1)');
               cancel_btn.addEventListener('click', function(e) {
                    delete_confirm__block.style.display = "none";
               });
               // Khi nhấn vào "Xóa" thì xóa item
               const comment_id = e.target.closest(data_block).getAttribute(data_attribute);
               const delete_btn = delete_confirm__block.querySelector('.delete_confirm__select button:nth-child(2)');
               delete_btn.addEventListener('click', function(e) {
                    // const url = `${url_temp}/comment/delete?comment_id=${comment_id}&current_url=${url_temp}`;
                    const url = path_to_delete
                    window.location.href = url;
               });
          })
     });
}
