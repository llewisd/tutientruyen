// Ẩn hiện nút reset
document.addEventListener('DOMContentLoaded', () => {
     const reset_button = document.querySelectorAll('.body_item__error button');
     
     reset_button.forEach(item => {
          const flag_value = item.closest('.body_item__error').querySelector('div span:nth-of-type(2)');
          if(flag_value.innerHTML === '0') {
               item.disabled = true;
               item.style.opacity = 0.8; 
               item.style.pointerEvents = 'none';
          }
          else {
               item.addEventListener('click', function(e) {
                    const flag_value = e.target.closest('.body_item__error').querySelector('div span:nth-of-type(2)');
                    flag_value.innerHTML = '0';
                    item.disabled = true;
                    item.style.opacity = 0.8; 
                    item.style.pointerEvents = 'none';
                    // Nếu trường bao_loi bằng 0 thì set lại border xanh
                    const parent_border_item = e.target.closest('.body_item');
                    parent_border_item.style.border = '1px solid var(--opacity-white-color)'; 

                    // Cập nhật dữ liệu cho bao_loi
                    // fetch('/addComic/updateError')
                    //      .catch(err => console.log(err));
               });
          }
     });
});

// Xét border cho item
function setBorderForChapterItem() {
     const body_chapter__item = document.querySelectorAll('.body_item');
     body_chapter__item.forEach(item => {
          const error_flag = item.querySelector('.body_item__error div span:nth-of-type(2)');
          if(error_flag.innerHTML === '0') item.style.border = '1px solid var(--opacity-white-color)';
          else item.style.border = '1px solid var(--orange-color)';
     });
};

// Khi ấn nút + thì mở popup
function openChapterPopup() {
     const create_button = document.querySelector('.add_btn__footer');
     create_button.addEventListener('click', function(e) {
          const chapter_block = document.querySelector('.chapter_block');
          chapter_block.style.display = "block";
     });
}


// Khi ấn dấu x hay "Hủy" thì đóng popup
function closeChapterPopup() {
     const chapter_block = document.querySelector('.chapter_block');
     const close_icon = chapter_block.querySelector('.chapter_exit div');
     const cancel_button = chapter_block.querySelector('.chapter_form__button button:nth-of-type(1)');
     close_icon.addEventListener('click', function(e) {
          chapter_block.style.display = "none";
     });

     cancel_button.addEventListener('click', function(e) {
          chapter_block.style.display = "none";
     });
}

// Tạo Chapter
function handleForCreate() {
     const chapter_block = document.querySelector('.chapter_block');
     const create_button = document.querySelector('.add_btn__footer');
     const chapter_form = chapter_block.querySelector('.chapter_form');
     create_button.addEventListener('click', function(e) {
          // Hiện popup
          chapter_block.style.display = "block";

          // Tắt popup
          const close_icon = chapter_block.querySelector('.chapter_exit div');
          const cancel_button = chapter_block.querySelector('.chapter_form__button button:nth-of-type(1)');
          
          close_icon.addEventListener('click', function(e) {
               chapter_block.style.display = "none";
               // Xóa form
               chapter_form.reset();
               chapter_form.querySelector('.chapter_form__img-list').innerHTML = '';
               // Xóa sự kiện submit trên form
               chapter_form.removeEventListener('submit', handleChapterCreate);
               // Xóa sự kiện nhấn nút "Thêm ảnh"
               chapter_block.querySelector('.chapter_form__img-input-btn').removeEventListener('click', clickToAddImage);
               // Xóa sự kiện thêm ảnh vào ô input
               chapter_block.querySelector('#chapter_form__input-img').removeEventListener('change', addImageToInput);
               // Xóa sự kiện trên thẻ preview
               chapter_block.querySelector('.chapter_form__img-view').removeEventListener('click', createImageEvent);
          });

          cancel_button.addEventListener('click', function(e) {
               chapter_block.style.display = "none";
               // Xóa form
               chapter_form.reset();
               chapter_form.querySelector('.chapter_form__img-list').innerHTML = '';
               // Xóa sự kiện submit trên form
               chapter_form.removeEventListener('submit', handleChapterCreate);
               // Xóa sự kiện nhấn nút "Thêm ảnh"
               chapter_block.querySelector('.chapter_form__img-input-btn').removeEventListener('click', clickToAddImage);
               // Xóa sự kiện thêm ảnh vào ô input
               chapter_block.querySelector('#chapter_form__input-img').removeEventListener('change', addImageToInput);
               // Xóa sự kiện trên thẻ preview
               chapter_block.querySelector('.chapter_form__img-view').removeEventListener('click', createImageEvent);
          });

          // Sự kiện thêm ảnh
          const addImage_btn = chapter_block.querySelector('.chapter_form__img-input-btn');
          const image_input = chapter_block.querySelector('#chapter_form__input-img');
          const addImage_preview = chapter_block.querySelector('.chapter_form__img-list');
          let fileArray = [];
          function clickToAddImage(e) {
               image_input.value = '';
               image_input.click();
          };
          addImage_btn.addEventListener('click', clickToAddImage);
          image_input.addEventListener('change', addImageToInput);
          function addImageToInput(e) {
               const file = e.target.files[0]; 
               if (!file) return;
               if (!file.type.startsWith('image/')) {
                    alert('Please select an image file');
                    return;
               }

               fileArray.push(file);

               const imgWrapper = createImageWrapper(file);
               addImage_preview.appendChild(imgWrapper);

               function createImageWrapper(file) {
                    const img = document.createElement('img');
                    img.file = file;
                    img.alt = '';
                
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        img.src = e.target.result;
                    };
                    reader.readAsDataURL(file);
                
                    const removeButton = document.createElement('i');
                    removeButton.classList.add('fa-solid', 'fa-circle-xmark');
                    removeButton.style.cursor = 'pointer';
                    removeButton.onclick = () => {
                        addImage_preview.removeChild(imgWrapper);
                        fileArray = fileArray.filter(f => f !== file);
                    };
                
                    const imgWrapper = document.createElement('div');
                    imgWrapper.classList.add('chapter_form__img-item');
                    imgWrapper.appendChild(img);
                
                    const removeDiv = document.createElement('div');
                    removeDiv.appendChild(removeButton);
                
                    imgWrapper.appendChild(removeDiv);
                
                    return imgWrapper;
               }
          };

          // Kiểm tra nhập form
          const chapter_input = chapter_form.querySelector('#chapter_form__input-chuong');
          const first_warning = chapter_block.querySelector('.chapter_form__alert div:nth-of-type(1)');
          const second_warning = chapter_block.querySelector('.chapter_form__alert div:nth-of-type(2)');
          const submit_button = chapter_block.querySelector('.chapter_form__button button:nth-of-type(2)');
          
          chapter_input.addEventListener('input', function(e) {
             const query = chapter_input.value.trim();
             if(query.length >= 1) {
               if(!isNaN(query) && query.trim() !== '') {
                    const body_item__chapter = document.querySelectorAll('.body_item__chapter');
                    let arrayNumber = [];
                    body_item__chapter.forEach(item => {
                         arrayNumber.push(parseFloat(item.textContent.trim().replace('Chương ','')));
                    });
                    if(arrayNumber.includes(parseFloat(query))) {
                         first_warning.style.display = 'none';
                         second_warning.style.display = 'block';
                         submit_button.disabled = true;
                    }
                    else {
                         first_warning.style.display = 'none';
                         second_warning.style.display = 'none';
                         submit_button.disabled = false;
                    }
                  }  
                  else {
                    first_warning.style.display = 'block';
                    second_warning.style.display = 'none';
                    submit_button.disabled = true;
                  }
             }
             else {
                    first_warning.style.display = 'none';
                    second_warning.style.display = 'none';
             }
             
          });
          // Thay thế nút "Cập nhật" thành "Tạo"
          chapter_block.querySelector('.chapter_form__button button:nth-of-type(2)').innerHTML = 'Tạo';

          // Submit
          chapter_form.addEventListener('submit', handleChapterCreate);
          async function handleChapterCreate (event) {
               event.preventDefault();
               const image_container = document.querySelectorAll('.chapter_form__img-item');
               if(image_container.length === 0) return alert('Xin vui lòng thêm ảnh');
               const truyen_link = document.querySelector('.body_name').getAttribute('data-truyen-link');
               const truyen_id = document.querySelector('.body_name').getAttribute('data-truyen-id');
               const truyen_name = document.querySelector('.body_name div').textContent;
               
               const chapter = chapter_form.querySelector('#chapter_form__input-chuong');
               const dataInform = {};
               dataInform.chapter = chapter.value;
               
               try {
                    const response = await fetch(`/addChapter/${truyen_link}/${truyen_id}/create/folder?name=${truyen_name}`, {
                         method: 'POST',
                         headers: {
                              'Content-Type': 'application/json'
                         },
                         body: JSON.stringify(dataInform)
                    });
                    const result = await response.json();

                    if(result.success) {
                         const formData = new FormData();
                         fileArray.forEach(file => {
                             formData.append('images[]', file);
                         });
                         
                         const uploadResponse = await fetch(`/addChapter/${truyen_link}/${truyen_id}/create?folderPath=${result.folderPath}&folderName=${result.folderName}&url=${result.url}&chapter_id=${result.chapter_id}`, {
                              method: 'POST',
                              body: formData
                          });
                          const uploadResult = await uploadResponse.json();
                          if(uploadResult.success === 'ok') {
                              const success_alert = chapter_block.querySelector('.chapter_form__alert div:nth-of-type(3)');
                              success_alert.style.display = "block";
                              setTimeout(() => {
                                   chapter_form.removeEventListener('submit', handleChapterCreate);
                                   window.location.href = window.location.href;
                              }, 1000);
                          }
                          else {
                              console.log('addChapter.js - Line 220 : Update image fail');
                          }
                         
                    }
                    else {
                         console.log('addChapter.js - Line 227 : File uploaded fail !');
                    }
               }
               catch(err) {
                    console.log(err);
               }
               
           };

          //  Bấm vào nút preview mở cửa sổ mới cho hình ảnh
          
          const preview_btn = chapter_block.querySelector('.chapter_form__img-view');
          function createImageEvent(e) {
               const img_container = chapter_block.querySelector('.chapter_form__img-list');
               const image_item = img_container.querySelectorAll('.chapter_form__img-item img');
               // Kích thước cửa sổ mới
               const windowWidth = 600;
               const windowHeight = 400;

               // Tính toán vị trí để căn giữa cửa sổ
               const screenWidth = window.screen.width;
               const screenHeight = window.screen.height;
               const left = (screenWidth / 2) - (windowWidth / 2);
               const top = (screenHeight / 2) - (windowHeight / 2);

               // Mở cửa sổ mới và đặt vị trí
               const newWindow = window.open('', 'Image Gallery', `width=${windowWidth},height=${windowHeight},top=${top},left=${left}`);
               newWindow.document.write(`
                    <html>
                         <head>
                              <title>Preview chapter</title>
                         </head>
                         <body>

                         </body>
                    </html>
               `);
               // Thêm CSS vào cửa sổ mới
               const style = newWindow.document.createElement('style');
               style.innerHTML = `
                    *{
                         margin: 0;
                         padding: 0;
                         box-sizing: border-box;
                    }
                    div {
                         width: 100%;
                    }
                    img {
                         width: 100%;
                         height: 100%;
                         object-fit: cover;
                    }
               `;
               newWindow.document.head.appendChild(style);
               image_item.forEach(img => {
                    const newImg = newWindow.document.createElement('img');
                    newImg.src = img.src;
                    const newDiv = newWindow.document.createElement('div');
                    newDiv.appendChild(newImg);
                    newWindow.document.body.appendChild(newDiv);
               });

          };
          preview_btn.addEventListener('click', createImageEvent);
     });
}

// Cập nhật chapter
function handleForUpdate() {
     const chapter_block = document.querySelector('.chapter_block');
     const body_list = document.querySelector('.body_list');
     const update_button = body_list.querySelectorAll('.body_item__icon div:nth-of-type(1)');
     const chapter_form = chapter_block.querySelector('.chapter_form');
     const truyen_link = document.querySelector('.body_name').getAttribute('data-truyen-link');
     const truyen_id = document.querySelector('.body_name').getAttribute('data-truyen-id');
     
     update_button.forEach(item => {
          item.addEventListener('click', async function(e) {
               // Hiện popup
               chapter_block.style.display = 'block';

               // Kiểm tra nhập form
               const chapter_input = chapter_form.querySelector('#chapter_form__input-chuong');
               const first_warning = chapter_block.querySelector('.chapter_form__alert div:nth-of-type(1)');
               const second_warning = chapter_block.querySelector('.chapter_form__alert div:nth-of-type(2)');
               const submit_button = chapter_block.querySelector('.chapter_form__button button:nth-of-type(2)');
               
               chapter_input.addEventListener('input', function(e) {
               const query = chapter_input.value.trim();
               if(query.length >= 1) {
                    if(!isNaN(query) && query.trim() !== '') {
                         const body_item__chapter = document.querySelectorAll('.body_item__chapter');
                         let arrayNumber = [];
                         body_item__chapter.forEach(item => {
                              arrayNumber.push(parseFloat(item.textContent.trim().replace('Chương ','')));
                         });
                         if(arrayNumber.includes(parseFloat(query))) {
                              first_warning.style.display = 'none';
                              second_warning.style.display = 'block';
                              submit_button.disabled = true;
                         }
                         else {
                              first_warning.style.display = 'none';
                              second_warning.style.display = 'none';
                              submit_button.disabled = false;
                         }
                    }  
                    else {
                         first_warning.style.display = 'block';
                         second_warning.style.display = 'none';
                         submit_button.disabled = true;
                    }
               }
               else {
                         first_warning.style.display = 'none';
                         second_warning.style.display = 'none';
               }
               
               });
               
               // Tải nội dung lên form
               const chapter_id = e.target.closest('.body_item').getAttribute('data-chapter-id');
               const get_chapter_data = await fetch(`/addChapter/${truyen_link}/${truyen_id}/update?chapter_id=${chapter_id}`);
               const chapter_data = await get_chapter_data.json();
               
               if(chapter_data.success) {
                    chapter_block.querySelector('#chapter_form__input-chuong').value = chapter_data.data.chuong;
                    // Tải ảnh
                    const baseURL = `${window.location.protocol}//${window.location.host}`;
                    const addImage_btn = chapter_block.querySelector('.chapter_form__img-input-btn');
                    const image_input = chapter_block.querySelector('#chapter_form__input-img');
                    const addImage_preview = chapter_block.querySelector('.chapter_form__img-list');
                    const anh_root = chapter_data.data.truyen.anh_root;
                    let fileArray = [];

                    for(const item of chapter_data.data.anh) {
                         try {
                              const response = await fetch(`${baseURL}/${anh_root}${item.path}`);
                              const blob = await response.blob();
                              const file = new File([blob], item.path.split('/').pop(), { type: blob.type });
                              fileArray.push(file);
                              const imgWrapper = createImageWrapper(file);
                              addImage_preview.appendChild(imgWrapper);
                          } catch (error) {
                              console.error('Error fetching image:', error);
                          }
                    };

                    // Thêm ảnh
                    function clickToAddImage() {
                         image_input.value = '';
                         image_input.click();
                    };
                    addImage_btn.addEventListener('click', clickToAddImage);
                    image_input.addEventListener('change', addImageToInput);
                    function addImageToInput(e) {
                         const file = e.target.files[0]; 
                         if (!file) return;
                         if (!file.type.startsWith('image/')) {
                              alert('Please select an image file');
                              return;
                         }
          
                         fileArray.push(file);
          
                         const imgWrapper = createImageWrapper(file);
                         addImage_preview.appendChild(imgWrapper);
                    };

                    // Thay thế nút "Tạo" thành "Cập nhật"
                    chapter_block.querySelector('.chapter_form__button button:nth-of-type(2)').innerHTML = 'Cập nhật';

                    // Hàm tạo ảnh
                    function createImageWrapper(file) {
                         const img = document.createElement('img');
                         img.file = file;
                         img.alt = '';
                    
                         const reader = new FileReader();
                         reader.onload = (e) => {
                         img.src = e.target.result;
                         };
                         reader.readAsDataURL(file);
                    
                         const removeButton = document.createElement('i');
                         removeButton.classList.add('fa-solid', 'fa-circle-xmark');
                         removeButton.style.cursor = 'pointer';
                         removeButton.onclick = () => {
                              addImage_preview.removeChild(imgWrapper);
                              fileArray = fileArray.filter(f => f !== file);
                         };
                    
                         const imgWrapper = document.createElement('div');
                         imgWrapper.classList.add('chapter_form__img-item');
                         imgWrapper.appendChild(img);
                    
                         const removeDiv = document.createElement('div');
                         removeDiv.appendChild(removeButton);
                    
                         imgWrapper.appendChild(removeDiv);
                    
                         return imgWrapper;
                    }

                    //  Bấm vào nút preview mở cửa sổ mới cho hình ảnh
                    const preview_btn = chapter_block.querySelector('.chapter_form__img-view');
                    function createImageEvent(e) {
                         const img_container = chapter_block.querySelector('.chapter_form__img-list');
                         const image_item = img_container.querySelectorAll('.chapter_form__img-item img');
                         // Kích thước cửa sổ mới
                         const windowWidth = 600;
                         const windowHeight = 400;

                         // Tính toán vị trí để căn giữa cửa sổ
                         const screenWidth = window.screen.width;
                         const screenHeight = window.screen.height;
                         const left = (screenWidth / 2) - (windowWidth / 2);
                         const top = (screenHeight / 2) - (windowHeight / 2);

                         // Mở cửa sổ mới và đặt vị trí
                         const newWindow = window.open('', 'Image Gallery', `width=${windowWidth},height=${windowHeight},top=${top},left=${left}`);
                         newWindow.document.write(`
                              <html>
                                   <head>
                                        <title>Preview chapter</title>
                                   </head>
                                   <body>

                                   </body>
                              </html>
                         `);
                         // Thêm CSS vào cửa sổ mới
                         const style = newWindow.document.createElement('style');
                         style.innerHTML = `
                              *{
                                   margin: 0;
                                   padding: 0;
                                   box-sizing: border-box;
                              }
                              div {
                                   width: 100%;
                              }
                              img {
                                   width: 100%;
                                   height: 100%;
                                   object-fit: cover;
                              }
                         `;
                         newWindow.document.head.appendChild(style);
                         image_item.forEach(img => {
                              const newImg = newWindow.document.createElement('img');
                              newImg.src = img.src;
                              const newDiv = newWindow.document.createElement('div');
                              newDiv.appendChild(newImg);
                              newWindow.document.body.appendChild(newDiv);
                         });

                    };
                    preview_btn.addEventListener('click', createImageEvent);

                    // Tắt popup
                    const close_icon = chapter_block.querySelector('.chapter_exit div');
                    const cancel_button = chapter_block.querySelector('.chapter_form__button button:nth-of-type(1)');
                    
                    close_icon.addEventListener('click', function(e) {
                         chapter_block.style.display = "none";
                         // Xóa form
                         chapter_form.reset();
                         chapter_form.querySelector('.chapter_form__img-list').innerHTML = '';
                         // Xóa sự kiện submit trên form
                         chapter_form.removeEventListener('submit', handleChapterUpdate);
                         // Xóa sự kiện nhấn nút "Thêm ảnh"
                         chapter_block.querySelector('.chapter_form__img-input-btn').removeEventListener('click', clickToAddImage);
                         // Xóa sự kiện thêm ảnh vào ô input
                         chapter_block.querySelector('#chapter_form__input-img').removeEventListener('change', addImageToInput);
                         // Xóa sự kiện trên thẻ preview
                         chapter_block.querySelector('.chapter_form__img-view').removeEventListener('click', createImageEvent);
                    });
          
                    cancel_button.addEventListener('click', function(e) {
                         chapter_block.style.display = "none";
                         // Xóa form
                         chapter_form.reset();
                         chapter_form.querySelector('.chapter_form__img-list').innerHTML = '';
                         // Xóa sự kiện submit trên form
                         chapter_form.removeEventListener('submit', handleChapterUpdate);
                         // Xóa sự kiện nhấn nút "Thêm ảnh"
                         chapter_block.querySelector('.chapter_form__img-input-btn').removeEventListener('click', clickToAddImage);
                         // Xóa sự kiện thêm ảnh vào ô input
                         chapter_block.querySelector('#chapter_form__input-img').removeEventListener('change', addImageToInput);
                         // Xóa sự kiện trên thẻ preview
                         chapter_block.querySelector('.chapter_form__img-view').removeEventListener('click', createImageEvent);
                    });

                    // Submit
                    chapter_form.addEventListener('submit', handleChapterUpdate);
                    async function handleChapterUpdate (event) {
                         event.preventDefault();
                         const image_container = document.querySelectorAll('.chapter_form__img-item');
                         if(image_container.length === 0) return alert('Xin vui lòng thêm ảnh');
                         const truyen_link = document.querySelector('.body_name').getAttribute('data-truyen-link');
                         const truyen_id = document.querySelector('.body_name').getAttribute('data-truyen-id');
                         const truyen_name = document.querySelector('.body_name div').textContent;
                         const chapter_id = item.closest('.body_item').getAttribute('data-chapter-id');
                         const old_chapter = item.closest('.body_item').querySelector('.body_item__chapter').textContent.trim().replace('Chương ','');

                         const chapter = chapter_form.querySelector('#chapter_form__input-chuong');
                         const dataInform = {};
                         dataInform.chapter = chapter.value.trim();
                         
                         try {
                              const response = await fetch(`/addChapter/${truyen_link}/${truyen_id}/update/doc?chapter_id=${chapter_id}&truyen_name=${truyen_name}&old_chapter=${old_chapter}`, {
                                   method: 'POST',
                                   headers: {
                                        'Content-Type': 'application/json'
                                   },
                                   body: JSON.stringify(dataInform)
                              });
                              const result = await response.json();
                              
                              if(result.success) {
                                   const formData = new FormData();
                                   fileArray.forEach(file => {
                                        formData.append('images[]', file);
                                   });
                                   
                                   const uploadResponse = await fetch(`/addChapter/${truyen_link}/${truyen_id}/update/image?folderPath=${result.folderPath}&folderName=${result.folderName}&url=${result.url}&chapter_id=${result.chapter_id}`, {
                                        method: 'POST',
                                        body: formData
                                   });
                                   const uploadResult = await uploadResponse.json();
                                   if(uploadResult.success === 'ok') {
                                        const success_alert = chapter_block.querySelector('.chapter_form__alert div:nth-of-type(3)');
                                        success_alert.style.display = "block";
                                        setTimeout(() => {
                                             chapter_form.removeEventListener('submit', handleChapterUpdate);
                                             window.location.href = window.location.href;
                                        }, 1000);
                                   }
                                   else {
                                        console.log('addChapter.js - Line 220 : Update image fail');
                                   }
                                   
                              }
                              else {
                                   console.log('addChapter.js - Line 227 : File uploaded fail !');
                              }
                         }
                         catch(err) {
                              console.log(err);
                         }
                         
                    };

               }
          });
     })
    
}

// Xóa item
function deleteItem() {
     // Khi nhấn vào thùng rác thì mở xóa
     const delete_confirm__block = document.querySelector('.delete_confirm__block');
     const trash_icon = document.querySelectorAll('.body_item__icon div:nth-of-type(2)');
     const delete_btn = delete_confirm__block.querySelector('.delete_confirm__select button:nth-of-type(2)');
     
     trash_icon.forEach(item => {
          item.addEventListener('click', function(e) {
               delete_confirm__block.style.display = "block";
               // Khi nhấn vào "Hủy" tắt bảng xác nhận xóa
               const cancel_btn = delete_confirm__block.querySelector('.delete_confirm__select button:nth-child(1)');
               cancel_btn.addEventListener('click', function(e) {
                    delete_confirm__block.style.display = "none";
                    // Gỡ các sự kiện ra
                    delete_btn.removeEventListener('click', removeChapter);
               });
               // Khi nhấn nút "Xóa" thì xóa chapter
               delete_btn.addEventListener('click', removeChapter);
               const truyen_link = document.querySelector('.body_name').getAttribute('data-truyen-link');
               const truyen_id = document.querySelector('.body_name').getAttribute('data-truyen-id');
               const truyen_name = document.querySelector('.body_name div').textContent;
               const chapter_id = item.closest('.body_item').getAttribute('data-chapter-id');
               const chapter = item.closest('.body_item__head').querySelector('.body_item__chapter').textContent.trim().replace('Chương ','');
               async function removeChapter(e) {
                    try {
                         const requestToRemove = await fetch(`/addChapter/${truyen_link}/${truyen_id}/delete/${chapter_id}?truyen_name=${truyen_name}&chapter=${chapter}`);
                         const responseData = await requestToRemove.json();
                         
                         if(responseData.success) {
                              // console.log(window.location.href)
                              window.location.href = window.location.href;
                         }
                    }
                    catch(err) {
                         console.log(`addChapter.js - Line 646 : ${err}`);
                    }
               }
          });
     });
}

// Khi bấm vào tên chương thì chuyển sang trang chapter
document.addEventListener('DOMContentLoaded', () => {
     const chapter_name = document.querySelectorAll('.body_item__chapter');
     chapter_name.forEach(item => {
          item.addEventListener('click', function(e) {
               e.target.querySelector('a').click();
          });
     })
});

document.addEventListener('DOMContentLoaded', () => {
     setBorderForChapterItem();
     handleForCreate();
     handleForUpdate();
     deleteItem();
})
