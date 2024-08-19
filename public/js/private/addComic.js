// Ẩn hiện nút reset
document.addEventListener('DOMContentLoaded', () => {
     const reset_button = document.querySelectorAll('.body_comic__item-third button');
     
     reset_button.forEach(item => {
          item.addEventListener('click', function(e) {
               const flag_value = e.target.closest('.body_comic__item-flag').querySelector('span:nth-of-type(2)');
               flag_value.innerHTML = '0';
               item.disabled = true;
               item.style.opacity = 0.8; 
               item.style.cursor = 'not-allowed'
               // Nếu trường bao_loi bằng 0 thì set lại border xanh
               const parent_border_item = e.target.closest('.body_comic__item');
               parent_border_item.style.border = '3px solid var(--green-color)'; 

               // Cập nhật dữ liệu cho bao_loi
               // fetch('/addComic/updateError')
               //      .catch(err => console.log(err));
          });
     });
});

// Xét border cho item
document.addEventListener('DOMContentLoaded', () => {
     const body_comic__item = document.querySelectorAll('.body_comic__item');
     body_comic__item.forEach(item => {
          const error_flag = item.querySelector('.body_comic__item-flag span:nth-of-type(2)');
          if(error_flag.innerHTML === '0') item.style.border = '3px solid var(--green-color)';
          else item.style.border = '3px solid var(--orange-color)';
     });
});

// Tạo hoặc Hủy truyện
document.addEventListener('DOMContentLoaded', () => {
     const addComic_button = document.querySelector('.add_btn__footer');
     const addComic_block = document.querySelector('.addComic_block');
     const addComic_form = addComic_block.querySelector('#addComic_popup__form-container');
     addComic_button.addEventListener('click', function(e) {
          addComic_block.style.display = "block";

          // Nhấn vào nút exit hay Hủy thì đóng 
          const addComic_exit_btn = addComic_block.querySelector('.addComic_exit div')
          const addComic_cancel_btn = addComic_block.querySelector('.addComic_button button:nth-child(1)');
          addComic_exit_btn.addEventListener('click', function(e) {
               addComic_block.style.display = "none";
               addComic_form.reset();
               // Xóa danh sách thể loại
               const addComic_popup_genre_list = addComic_form.querySelector('.addComic_popup__genre-list');
               addComic_popup_genre_list.innerHTML = "";
               const addComic_alert__warning = addComic_block.querySelector('.addComic_alert__warning');
               const addComic_alert__success = addComic_block.querySelector('.addComic_alert__success');
               addComic_alert__warning.style.display = 'none';
               addComic_alert__success.style.display = 'none';
               // Quay lại ảnh anonymous
               const avatar_div = addComic_block.querySelector('.addComic_popup__img');
               avatar_div.innerHTML = `<img src="/images/local/anonymous.png" alt="avatar"></img>`;
               // Xóa sự kiện submit khỏi form
               addComic_form.removeEventListener('submit', handleCreate);
          });
          addComic_cancel_btn.addEventListener('click', function(e) {
               addComic_block.style.display = "none";
               addComic_form.reset();
               // Xóa danh sách thể loại
               const addComic_popup_genre_list = addComic_form.querySelector('.addComic_popup__genre-list');
               addComic_popup_genre_list.innerHTML = "";
               const addComic_alert__warning = addComic_block.querySelector('.addComic_alert__warning');
               const addComic_alert__success = addComic_block.querySelector('.addComic_alert__success');
               addComic_alert__warning.style.display = 'none';
               addComic_alert__success.style.display = 'none';
               // Quay lại ảnh anonymous
               const avatar_div = addComic_block.querySelector('.addComic_popup__img');
               avatar_div.innerHTML = `<img src="/images/local/anonymous.png" alt="avatar"></img>`;
               // Xóa sự kiện submit khỏi form
               addComic_form.removeEventListener('submit', handleCreate);
          });

          // Thay đổi nút "Cập nhật" thành nút "Tạo"
          const create_button = addComic_block.querySelector('.addComic_button button:nth-of-type(2)');
          create_button.innerHTML = 'Tạo';

          // Thêm required của input ảnh và select genre
          addComic_block.querySelector('.addComic_popup__observation input').required = true;
          addComic_block.querySelector('.addComic_popup__genres select').required = true;

          // Khi tải ảnh lên thì ảnh sẽ được hiển thị trong ô
          const avatar_div = addComic_block.querySelector('.addComic_popup__img');
          const avatar_input = addComic_block.querySelector('.addComic_popup__observation input');
          avatar_input.addEventListener('change', function(event) {
               const file = event.target.files[0]; // Lấy file đầu tiên từ input
               if (file) {
                   const reader = new FileReader(); // Sử dụng FileReader để đọc file
                   reader.onload = function(e) {
                       // Tạo phần tử img và gán src cho nó
                       const img = document.createElement('img');
                       img.src = e.target.result;
                       
                       // Xóa nội dung cũ của div và thêm img vào
                       avatar_div.innerHTML = ''; // Xóa nội dung cũ nếu có
                       avatar_div.appendChild(img); // Thêm ảnh mới vào div
                   };
                   reader.readAsDataURL(file); // Đọc file dưới dạng Data URL
               }
          });

          // Tạo thể loại mỗi khi click vào
          const genre_select = addComic_block.querySelector('#addComic_popup__genre-dropdown');
          const genre_list = addComic_block.querySelector('.addComic_popup__genre-list');
          genre_select.addEventListener('change', function(e) {
               // Lấy phần tử option được chọn
               const selectedOption = e.target.options[e.target.selectedIndex];
               
               // Lấy giá trị của thuộc tính data-genre-id từ option được chọn
               const genreId = selectedOption.getAttribute('data-genre-id');

               const genre_item = `
                    <div class="addComic_popup__genre-item">
                         <span>${e.target.value}</span>
                         <input type="hidden" name="genres" value="${genreId}">
                         <span><i class="fa-solid fa-circle-xmark"></i></span>
                    </div>
               `;
               
               // Kiểm tra xem có trùng thể loại không
               const genre_list_items_dup = genre_list.querySelectorAll('.addComic_popup__genre-item');
               if (!genre_list_items_dup.length) genre_list.insertAdjacentHTML('beforeend', genre_item);
               else {
                    let isExist = false;
                    genre_list_items_dup.forEach(item => {
                         if(item.querySelector('input').getAttribute('value') === genreId) isExist = true;
                    });
                    if(!isExist) genre_list.insertAdjacentHTML('beforeend', genre_item);
               }
               

               // Xóa thể loại khỏi danh sách
               const remove_button = genre_list.querySelector('.addComic_popup__genre-item:last-of-type span:last-of-type');
               remove_button.addEventListener('click', function(e) {
                    e.target.closest('.addComic_popup__genre-item').remove();
               })
          });

          // Cập nhật lại giá trị trống của form khi submit
          async function handleCreate(e) {
               e.preventDefault(); 
               const name_field = addComic_form.querySelector('.addComic_popup__name input');
               const image_field = addComic_form.querySelector('.addComic_popup__observation input');
               const status_field = addComic_form.querySelector('.addComic_popup__status select');
               const genres_field = addComic_form.querySelectorAll('.addComic_popup__genre-item input');
               const other_name_field = addComic_form.querySelector('.addComic_popup__other-name input');
               const descibe_field = addComic_form.querySelector('.addComic_popup__description textarea');
               const author_field = addComic_form.querySelector('.addComic_popup__author input');
               if(!other_name_field.value.trim()) other_name_field.value = "Đang cập nhật";
               if(!descibe_field.value.trim()) descibe_field.value = "Đang cập nhật";
               if(!author_field.value.trim()) author_field.value = "Đang cập nhật";

               const formData = new FormData();
               
               formData.comic_name = name_field.value;
               formData.other_comic_name = other_name_field.value;
               formData.author =  author_field.value;
               formData.mo_ta =  descibe_field.value;
               formData.status =  status_field.value;
               let genres = [];
               genres_field.forEach(item => {genres.push(item.value)});
               formData.genres = genres;

                // Gửi yêu cầu POST để upload ảnh và text
                // Gửi yêu cầu POST để tạo thư mục
               try {
                    const response = await fetch('/addComic/create/folder', {
                         method: 'POST',
                         headers: {
                         'Content-Type': 'application/json'
                         },
                         body: JSON.stringify(formData)
                    });
                    const result = await response.json();
          
                    // Upload file ảnh
                    if (result.success) {
                         // Thư mục đã được tạo thành công, giờ có thể gửi file
                         const fileData = new FormData();
                         fileData.append('image', image_field.files[0]);
             
                         const uploadResponse = await fetch(`/addComic/create?folderPath=${result.folderPath}&folderName=${result.folderName}&url=${result.url}&truyen_id=${result.truyen_id}`, {
                             method: 'POST',
                             body: fileData
                         });
             
                         const uploadResult = await uploadResponse.json();
                         const addComic_alert__warning = addComic_block.querySelector('.addComic_alert__warning');
                         const addComic_alert__success = addComic_block.querySelector('.addComic_alert__success');
                         addComic_alert__warning.style.display = 'none';
                         addComic_alert__success.style.display = 'flex';
                         console.log('File uploaded successfully:', uploadResult);
                         setTimeout(() => {
                              window.location.href = window.location.href;
                         }, 1000);
                    }
                    else {
                         const addComic_alert__warning = addComic_block.querySelector('.addComic_alert__warning');
                         const addComic_alert__success = addComic_block.querySelector('.addComic_alert__success');
                         addComic_alert__warning.style.display = 'flex';
                         addComic_alert__success.style.display = 'none';
                         setTimeout(() => {
                              addComic_alert__warning.style.display = 'none';
                         }, 3000);
                         console.log('File uploaded fail !');
                    }
               }
               catch(err) {
                    console.log(err);
               }

          };
          addComic_form.addEventListener('submit', handleCreate);
     });
});

// Chỉnh sửa truyện đã tạo
document.addEventListener('DOMContentLoaded', () => {
     const change_comic_button = document.querySelectorAll('.body_comic__item-name div:nth-of-type(2)');
     change_comic_button.forEach(item => {
          item.addEventListener('click', async function(e) {
               const addComic_block = document.querySelector('.addComic_block');
               const addComic_form = addComic_block.querySelector('#addComic_popup__form-container');

               // Nhấn vào nút exit hay Hủy thì đóng 
               const addComic_exit_btn = addComic_block.querySelector('.addComic_exit div')
               const addComic_cancel_btn = addComic_block.querySelector('.addComic_button button:nth-child(1)');
               addComic_exit_btn.addEventListener('click', function(e) {
                    addComic_block.style.display = "none";
                    addComic_form.reset();
                    // Xóa danh sách thể loại
                    const addComic_popup_genre_list = addComic_form.querySelector('.addComic_popup__genre-list');
                    addComic_popup_genre_list.innerHTML = "";
                    const addComic_alert__warning = addComic_block.querySelector('.addComic_alert__warning');
                    const addComic_alert__success = addComic_block.querySelector('.addComic_alert__success');
                    addComic_alert__warning.style.display = 'none';
                    addComic_alert__success.style.display = 'none';
                    // Quay lại ảnh anonymous
                    const avatar_div = addComic_block.querySelector('.addComic_popup__img');
                    avatar_div.innerHTML = `<img src="/images/local/anonymous.png" alt="avatar"></img>`;
                    // Xóa sự kiện submit khỏi form
                    addComic_form.removeEventListener('submit', handleUpdate);
               });
               addComic_cancel_btn.addEventListener('click', function(e) {
                    addComic_block.style.display = "none";
                    addComic_form.reset();
                    // Xóa danh sách thể loại
                    const addComic_popup_genre_list = addComic_form.querySelector('.addComic_popup__genre-list');
                    addComic_popup_genre_list.innerHTML = "";
                    const addComic_alert__warning = addComic_block.querySelector('.addComic_alert__warning');
                    const addComic_alert__success = addComic_block.querySelector('.addComic_alert__success');
                    addComic_alert__warning.style.display = 'none';
                    addComic_alert__success.style.display = 'none';
                    // Quay lại ảnh anonymous
                    const avatar_div = addComic_block.querySelector('.addComic_popup__img');
                    avatar_div.innerHTML = `<img src="/images/local/anonymous.png" alt="avatar"></img>`;
                    // Xóa sự kiện submit khỏi form
                    addComic_form.removeEventListener('submit', handleUpdate);
               });

               // Thêm nội dung của truyện vào form
               const truyen_id = e.target.closest('.body_comic__item-content').getAttribute('data-truyen-id');
               const comic_created_data = await fetch(`/addComic/update/getComic?truyen_id=${truyen_id}`);
               const result = await comic_created_data.json();
               if (result.success) {
                    addComic_form.querySelector('.addComic_popup__name input').value = result.data[0].ten;
                    addComic_form.querySelector('.addComic_popup__other-name input').value = result.data[0].ten_khac;
                    addComic_form.querySelector('.addComic_popup__img').innerHTML = `<img src="${result.data[0].anh}" alt="avatar">`;
                    addComic_form.querySelector('.addComic_popup__author input').value = result.data[0].tac_gia;
                    addComic_form.querySelector('.addComic_popup__description textarea').value = result.data[0].mo_ta;
                    addComic_form.querySelector('.addComic_popup__status select').value = result.data[0].trang_thai;
                    const genre_comic_list = result.data[0].the_loai.sort((a,b) => a.ten.localeCompare(b.ten));
                    const addComic_popup__genre_list = addComic_block.querySelector('.addComic_popup__genre-list');
                    genre_comic_list.forEach(item => {
                         addComic_popup__genre_list.insertAdjacentHTML('beforeend', `
                              <div class="addComic_popup__genre-item">
                                   <span>${item.ten}</span>
                                   <input type="hidden" name="genres" value="${item._id}">
                                   <span><i class="fa-solid fa-circle-xmark"></i></span>
                              </div>
                         `);
                         // Xóa thể loại khỏi danh sách
                         const remove_button = addComic_block.querySelector('.addComic_popup__genre-item:last-of-type span:last-of-type');
                         remove_button.addEventListener('click', function(e) {
                              e.target.closest('.addComic_popup__genre-item').remove();
                         })
                    });
               }
               else {
                    console.log(err)
               }

               // Thay đổi nút "Tạo" thành nút "Cập nhật"
               const update_button = addComic_block.querySelector('.addComic_button button:nth-of-type(2)');
               update_button.innerHTML = 'Cập nhật';

               // Xóa required của input ảnh và select genre
               addComic_block.querySelector('.addComic_popup__observation input').required = false;
               addComic_block.querySelector('.addComic_popup__genres select').required = false;

               // Tạo thể loại mỗi khi click vào
               const genre_select = addComic_block.querySelector('#addComic_popup__genre-dropdown');
               const genre_list = addComic_block.querySelector('.addComic_popup__genre-list');
               genre_select.addEventListener('change', function(e) {
                    // Lấy phần tử option được chọn
                    const selectedOption = e.target.options[e.target.selectedIndex];
                    
                    // Lấy giá trị của thuộc tính data-genre-id từ option được chọn
                    const genreId = selectedOption.getAttribute('data-genre-id');

                    const genre_item = `
                         <div class="addComic_popup__genre-item">
                              <span>${e.target.value}</span>
                              <input type="hidden" name="genres" value="${genreId}">
                              <span><i class="fa-solid fa-circle-xmark"></i></span>
                         </div>
                    `;
                    
                    // Kiểm tra xem có trùng thể loại không
                    const genre_list_items_dup = genre_list.querySelectorAll('.addComic_popup__genre-item');
                    if (!genre_list_items_dup.length) genre_list.insertAdjacentHTML('beforeend', genre_item);
                    else {
                         let isExist = false;
                         genre_list_items_dup.forEach(item => {
                              if(item.querySelector('input').getAttribute('value') === genreId) isExist = true;
                         });
                         if(!isExist) genre_list.insertAdjacentHTML('beforeend', genre_item);
                    }
                    

                    // Xóa thể loại khỏi danh sách
                    const remove_button = genre_list.querySelector('.addComic_popup__genre-item:last-of-type span:last-of-type');
                    remove_button.addEventListener('click', function(e) {
                         e.target.closest('.addComic_popup__genre-item').remove();
                    })
               });

               // Khi tải ảnh lên thì ảnh sẽ được hiển thị trong ô
               const avatar_div = addComic_block.querySelector('.addComic_popup__img');
               const avatar_input = addComic_block.querySelector('.addComic_popup__observation input');
               avatar_input.addEventListener('change', function(event) {
                    const file = event.target.files[0]; // Lấy file đầu tiên từ input
                    if (file) {
                    const reader = new FileReader(); // Sử dụng FileReader để đọc file
                    reader.onload = function(e) {
                         // Tạo phần tử img và gán src cho nó
                         const img = document.createElement('img');
                         img.src = e.target.result;
                         
                         // Xóa nội dung cũ của div và thêm img vào
                         avatar_div.innerHTML = ''; // Xóa nội dung cũ nếu có
                         avatar_div.appendChild(img); // Thêm ảnh mới vào div
                    };
                    reader.readAsDataURL(file); // Đọc file dưới dạng Data URL
                    }
               });

               // Hiện block
               addComic_block.style.display = "block";

               // Gửi dữ liệu đã cập nhật
               // Cập nhật lại giá trị trống của form khi submit
               async function handleUpdate(e) {
                    e.preventDefault(); 
                    const name_field = addComic_form.querySelector('.addComic_popup__name input');
                    const image_field = addComic_form.querySelector('.addComic_popup__observation input');
                    const status_field = addComic_form.querySelector('.addComic_popup__status select');
                    const genres_field = addComic_form.querySelectorAll('.addComic_popup__genre-item input');
                    const other_name_field = addComic_form.querySelector('.addComic_popup__other-name input');
                    const descibe_field = addComic_form.querySelector('.addComic_popup__description textarea');
                    const author_field = addComic_form.querySelector('.addComic_popup__author input');
                    if(!other_name_field.value.trim()) other_name_field.value = "Đang cập nhật";
                    if(!descibe_field.value.trim()) descibe_field.value = "Đang cập nhật";
                    if(!author_field.value.trim()) author_field.value = "Đang cập nhật";


                    const formData = new FormData();
                    
                    formData.comic_name = name_field.value;
                    formData.other_comic_name = other_name_field.value;
                    formData.author =  author_field.value;
                    formData.mo_ta =  descibe_field.value;
                    formData.status =  status_field.value;
                    let genres = [];
                    genres_field.forEach(item => {genres.push(item.value)});
                    formData.genres = genres;
                   
                    // Gửi yêu cầu POST để tạo thư mục
                    try {
                         const response = await fetch(`/addComic/update/folder?truyen_id=${truyen_id}`, {
                              method: 'POST',
                              headers: {
                              'Content-Type': 'application/json'
                              },
                              body: JSON.stringify(formData)
                         });
                         const result = await response.json();
                         
                         // Upload file ảnh
                         if (result.success) {
                              // Thư mục đã được tạo thành công, giờ có thể gửi file
                              const fileData = new FormData();
                              fileData.append('image', image_field.files[0]);
               
                              const uploadResponse = await fetch(`/addComic/update?folderPath=${result.folderPath}&folderName=${result.folderName}&url=${result.url}&truyen_id=${result.truyen_id}`, {
                                   method: 'POST',
                                   body: fileData
                              });
               
                              const uploadResult = await uploadResponse.json();

                              const addComic_alert__warning = addComic_block.querySelector('.addComic_alert__warning');
                              const addComic_alert__success = addComic_block.querySelector('.addComic_alert__success');
                              addComic_alert__warning.style.display = 'none';
                              addComic_alert__success.style.display = 'flex';
                              setTimeout(() => {
                                   window.location.href = window.location.href;
                              }, 1000);   
                         }
                         else {
                              const addComic_alert__warning = addComic_block.querySelector('.addComic_alert__warning');
                              const addComic_alert__success = addComic_block.querySelector('.addComic_alert__success');
                              addComic_alert__warning.style.display = 'flex';
                              addComic_alert__success.style.display = 'none';
                              setTimeout(() => {
                                   addComic_alert__warning.style.display = 'none';
                              }, 3000);
                              console.log('File uploaded fail !');
                         }
                    }
                    catch(err) {
                         console.log(err);
                    }

               };
               addComic_form.addEventListener('submit', handleUpdate);
          });
     });
});


