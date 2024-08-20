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
          console.log(error_flag)
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

function handleForCreate() {
     const chapter_block = document.querySelector('.chapter_block');
     const create_button = document.querySelector('.add_btn__footer');
     create_button.addEventListener('click', function(e) {
          // Hiện popup
          chapter_block.style.display = "block";

          // Tắt popup
          const close_icon = chapter_block.querySelector('.chapter_exit div');
          const cancel_button = chapter_block.querySelector('.chapter_form__button button:nth-of-type(1)');
          close_icon.addEventListener('click', function(e) {
               chapter_block.style.display = "none";
          });

          cancel_button.addEventListener('click', function(e) {
               chapter_block.style.display = "none";
          });

          // Sự kiện thêm ảnh
          const addImage_btn = chapter_block.querySelector('.chapter_form__img-input-btn');
          const image_input = chapter_block.querySelector('#chapter_form__input-img');
          const addImage_preview = chapter_block.querySelector('.chapter_form__img-list');
          let fileArray = [];
          addImage_btn.addEventListener('click', function(e) {
               image_input.value = '';
               image_input.click();
          });
          image_input.addEventListener('change', function(e) {
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
          });

          // Submit
          const chapter_form = chapter_block.querySelector('.chapter_form');
          chapter_form.addEventListener('submit', function(event) {
               event.preventDefault();
           
               const formData = new FormData();
               
               fileArray.forEach(file => {
                   formData.append('images[]', file);
               });
           
               fetch('/upload', {
                   method: 'POST',
                   body: formData,
               })
               .then(response => response.json())
               .then(data => console.log(data))
               .catch(error => console.error(error));
           });

          //  Bấm vào nút preview mở cửa sổ mới cho hình ảnh
          
          const preview_btn = chapter_block.querySelector('.chapter_form__img-view');
          preview_btn.addEventListener('click', function(e) {
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

          });
          
     });
}
document.addEventListener('DOMContentLoaded', () => {
     setBorderForChapterItem();
     handleForCreate();
})
