
// Click tool danh sách chương để mở danh sách chương
document.addEventListener('DOMContentLoaded', () => {
     const tool_list = document.getElementsByClassName('tool_list')[0];
     tool_list.addEventListener('click', () => {
          const chapter_list = tool_list.getElementsByClassName('tool_list__block')[0];
          if (chapter_list.style.display === "none") {
               chapter_list.style.display = "block";
               const chapter = document.querySelectorAll('.body_info__path a')[2];
               const tool_list__item = document.querySelector('.tool_list__item');
               const items = tool_list__item.querySelectorAll('a');
               const current_item = Array.from(items).find(a => a.textContent.trim() === chapter.textContent);
               current_item.style.backgroundColor = "#e0e0e0";
               current_item.style.color = "black";
               current_item.style.pointerEvents = "none";
               current_item.scrollIntoView({block: 'center'});
          }
          else chapter_list.style.display = "none";
     });
})

// Click tool để đi tới khu vực comment
document.addEventListener('DOMContentLoaded', () => {
     document.getElementsByClassName('tool_comment')[0].addEventListener('click', () => {
          const comment_area = document.getElementsByClassName('comment_title')[0];
          comment_area.scrollIntoView({behavior: 'smooth', block: 'center'});
     })
})

// BÌNH LUẬN : CÁC HÀM XỬ LÝ

// SK1 : Render ra comment

const current_url = window.location.pathname
const itemsPerPage = 5;
let currentPage = 1;
let data = [];
fetch(`${current_url}/comment`)
     .then(response => response.json())
     .then(json => {
          data = json;
          renderPage(currentPage);
     })
     .catch(error => console.error('Error fetching data:', error));

function changePage(page) {
     currentPage = page;
     renderPage(page);
}

function renderPage(page) {
     const start = (page - 1) * itemsPerPage;
     const end = page * itemsPerPage;
     const itemsToShow = data.slice(start, end);
     const totalPages = Math.ceil(data.length / itemsPerPage);
     const comment_list = document.querySelector('.comment_list');
     const user_name = document.querySelector('.header_ext__userInfo-name').textContent.trim();
     const user_quyen = document.querySelector('.header_ext__userInfo-name').getAttribute('data-user-quyen');
     // Render items
     comment_list.innerHTML = itemsToShow.map(item => 
          `<div class="comment_list__item">
                    <div class="comment_list__img">
                         <img src="${item.anh}" alt="avatar" loading="lazy">
                    </div>
                    <div class="comment_list__sidebar">
                         <div class="comment_list__content" data-comment-id="${item._id}">
                              <div class="comment_list__content-head">
                                   <div class="comment_list__content-name">
                                        ${item.ten}
                                   </div>
                                   <div class="comment_list__content-time">
                                        <i class="fa-solid fa-clock"></i>
                                        <span>${getTimeSinceLastUpdate(item.ngay_tao)}</span>
                                   </div>
                              </div>
                              <div class="comment_list__content-body">
                                   ${item.noi_dung.replace(/\r\n|\n/g, '<br>')}
                              </div>
                              <div class="comment_list__content-foot">
                                   <div class="comment_list__content-emotion">
                                        <div>
                                             <i class="fa-regular fa-thumbs-up"></i>
                                             <span>${item.thich}</span>
                                        </div>
                                        <div>
                                             <i class="fa-regular fa-thumbs-down"></i>
                                             <span>${item.ghet}</span>
                                        </div>
                                   </div>
                                   <div class="comment_list__content-response">
                                        <i class="fa-solid fa-reply"></i>
                                        <span>Trả lời</span>
                                   </div>
                                   <div style="display: ${((user_name && user_name === item.ten) || (user_quyen === 'admin')) ? "block": "none"}" class="comment_list__content-delete">
                                        <i class="fa-solid fa-trash"></i>
                                   </div>
                              </div>
                         </div>
                         <div style="display:${item.binh_luan_con.length ? 'block' : 'none'}" class="comment_list__subcomment">
                              <div class="comment_list__notification">
                                   <i class="fa-solid fa-caret-down"></i>
                                   <span>${item.binh_luan_con.length} câu trả lời</span>
                              </div>
                              <div style="display:none" class="comment_list__subcontent">
                              ${ item.binh_luan_con.map(sub_item => `
                                   <div class="comment_list__item">
                                        <div class="comment_list__img">
                                             <img src="${sub_item.taikhoan_id.anh}" alt="avatar" loading="lazy">
                                        </div>
                                        <div class="comment_list__sidebar">
                                             <div class="comment_list__content" data-comment-id="${sub_item._id}">
                                                  <div class="comment_list__content-head">
                                                       <div class="comment_list__content-name">
                                                            ${sub_item.taikhoan_id.ten}
                                                       </div>
                                                       <div class="comment_list__content-time">
                                                            <i class="fa-solid fa-clock"></i>
                                                            <span>${getTimeSinceLastUpdate(sub_item.ngay_tao)}</span>
                                                       </div>
                                                  </div>
                                                  <div class="comment_list__content-body">
                                                       ${sub_item.noi_dung}
                                                  </div>
                                                  <div class="comment_list__content-foot">
                                                       <div class="comment_list__content-emotion">
                                                            <div>
                                                                 <i class="fa-regular fa-thumbs-up"></i>
                                                                 <span>${sub_item.thich}</span>
                                                            </div>
                                                            <div>
                                                                 <i class="fa-regular fa-thumbs-down"></i>
                                                                 <span>${sub_item.ghet}</span>
                                                            </div>
                                                       </div>
                                                       <div style="display: ${(user_name && user_name === sub_item.taikhoan_id.ten) ? "block": "none"}" class="comment_list__content-delete">
                                                            <i class="fa-solid fa-trash"></i>
                                                       </div>
                                                  </div>
                                             </div>
                         
                                        </div>
                                   </div>
                              `).join(' ')}
                              </div>
                         </div>
                    </div>
               </div>`
     ).join(' ');

     const pagination = document.querySelector('.pagination');
     let pagination_temp = '';
     if(currentPage !== 1) {
          pagination_temp += `
               <a href="javascript:void(0)" class="pagination__before" onclick="changePage(${currentPage-1})">
                         <i class="fa-solid fa-arrow-left"></i>
                         <span>TRƯỚC</span>
               </a>     
          `;
     }
     else {
          pagination_temp += `
               <button style="opacity: 0.6; cursor: not-allowed;" class="pagination__before")">
                         <i class="fa-solid fa-arrow-left"></i>
                         <span>TRƯỚC</span>
               </button>     
          `;
     }
     const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
     
     pagination_temp += `
          <div class="pagination__main">
               <span>Trang</span>
               <div class="pagination__select">
                    <span>${currentPage}</span>
                    <i class="fa-solid fa-angle-down fa-2xs"></i>
                    <div style="display: none"  class="pagination__option">
                         ${ 
                              pages.map(item => `
                                   <a href="javascript:void(0)" class="pagination__option-link" onclick="changePage(${item})">
                                        ${item}
                                   </a>
                              `).join(' ')
                         }
                    </div>
               </div>
               <span>/</span>
               <span>${totalPages}</span>
          </div>
     `;
     if(currentPage !== totalPages) {
          pagination_temp += `
               <a href="javascript:void(0)" class="pagination__after" onclick="changePage(${currentPage+1})">
                         <span>SAU</span>
                         <i class="fa-solid fa-arrow-right"></i>
               </a>     
          `;
     }
     else {
          pagination_temp += `
               <button style="opacity: 0.6; cursor: not-allowed;" class="pagination__after">
                         <span>SAU</span>
                         <i class="fa-solid fa-arrow-right"></i>
               </button>     
          `;
     }
     pagination.innerHTML = pagination_temp;
     pagination.querySelector('.pagination .pagination__after').addEventListener('click', function(e) {
          comment_tool.click();
     });
     pagination.querySelector('.pagination .pagination__before').addEventListener('click', function(e) {
          comment_tool.click();
     });

     // Tạo hiệu ứng khi nhấn trả lời comment
     const response_btn = document.querySelectorAll('.comment_list__content-response');
     const user_login = document.querySelector('.header_ext__userInfo');
     const login_block = document.querySelector('.sign_window');
     const comment_form = document.querySelector('.comment_post__textarea-block');
     response_btn.forEach(item => {
          item.addEventListener('click', function(e) {
               if (user_login.style.display === "flex") {
                    const name = e.target.closest('.comment_list__content').querySelector('.comment_list__content-name').textContent;
                    const comment_id = e.target.closest('.comment_list__content').getAttribute('data-comment-id');

                    const textarea_support_block = document.querySelector('.comment_post__textarea-support');
                    textarea_support_block.querySelector('.comment_post__textarea-support span').textContent = name;
                    textarea_support_block.style.display = "block";
                    // Thêm ?response= vào link form
                    let url = new URL(comment_form.action);
                    url.searchParams.set('response', comment_id);
                    comment_form.action = url.href;
                    
                    // Quay về ô nhập
                    document.querySelector('.tool .tool_comment').click();
                    // Thụt văn bản trong ô textarea
                    const textarea_support_style = window.getComputedStyle(textarea_support_block);
                    const totalSpace = Math.round((parseFloat(textarea_support_style.marginLeft) * 2 + parseFloat(textarea_support_style.width))/4.5);
                    let whitespace = ' '.repeat(totalSpace);

                    const textarea_block = document.querySelector('.comment_post__block-input');
                    textarea_block.value = whitespace;
                    textarea_block.focus();

                    // Tắt prompt khi nhấn x 
                    const exit_prompt_btn = textarea_support_block.querySelector('i');
                    exit_prompt_btn.addEventListener('click', function(e) {
                         textarea_support_block.style.display = "none";
                         textarea_block.value = textarea_block.value.trim();
                         // Xóa ?response= vào link form
                         let url = new URL(comment_form.action);
                         url.searchParams.delete('response');
                         comment_form.action = url.href;
                    }) 
               }
               else {
                    login_block.style.display = "block";
               }
          });
     });

     // Hiện dropdown pagination
     const pagination_select = document.querySelector('.pagination__select');
     const pagination_dropdown = pagination_select.querySelector('.pagination__option');
     const comment_tool = document.querySelector('.tool .tool_comment');
     pagination_select.addEventListener('click', () => {
          if (pagination_dropdown.style.display === "none") {
               pagination_dropdown.style.display = "block";
               const page = pagination_select.querySelector('span:nth-child(1)');
               const items = pagination_dropdown.querySelectorAll('a');
               const current_item = Array.from(items).find(a => a.textContent.trim() === page.textContent);
               current_item.style.backgroundColor = "#e0e0e0";
               current_item.style.color = "black";
               current_item.style.pointerEvents = "none";
               current_item.scrollIntoView({block: 'center'}); 
               items.forEach(item => {
                    item.addEventListener('click', function(e) {
                         comment_tool.click();
                    })
               });
          }
          else pagination_dropdown.style.display = "none";
     });

     // Click để tắt / mở comment con
     const comment_notification = document.getElementsByClassName('comment_list__notification');
     for(i = 0; i < comment_notification.length; i++) {
          comment_notification[i].addEventListener('click', e => {
               const subcomment = e.currentTarget.parentNode.getElementsByClassName('comment_list__subcontent')[0];
               if(subcomment.style.display === "none") subcomment.style.display = 'block';
               else subcomment.style.display = "none";
          })
     }

     // Khi nhấn vào thùng rác mở bảng xác nhận xóa
     const delete_confirm__block = document.querySelector('.delete_confirm__block');
     const trash_icon = document.querySelectorAll('.comment_list__content-delete');

     trash_icon.forEach(item => {
          item.addEventListener('click', function(e) {
               delete_confirm__block.style.display = "block";
               // Khi nhấn vào "Hủy" tắt bảng xác nhận xóa
               const cancel_btn = delete_confirm__block.querySelector('.delete_confirm__select button:nth-child(1)');
               cancel_btn.addEventListener('click', function(e) {
                    delete_confirm__block.style.display = "none";
               });
               // Khi nhấn vào "Xóa" thì xóa bình luận
               const comment_id = e.target.closest('.comment_list__content').getAttribute('data-comment-id');
               const delete_btn = delete_confirm__block.querySelector('.delete_confirm__select button:nth-child(2)');
               delete_btn.addEventListener('click', function(e) {
                    const url_temp = window.location.pathname
                    const url = `${url_temp}/comment/delete?comment_id=${comment_id}&current_url=${url_temp}`;
                    window.location.href = url;
               });
          })
     });

}


// SK2 : Yêu cầu đăng nhập khi muốn comment
document.addEventListener('DOMContentLoaded', () => {
     const textarea_item = document.querySelector('.comment_post__block-input');
     const login_block = document.querySelector('.sign_window');
     const user_login = document.querySelector('.header_ext__userInfo');
     textarea_item.addEventListener('click', function(e) {
          if(user_login.style.display === "none") {
               login_block.style.display = "block";
               e.target.blur();
          }
     });
});

// SK3 : Khi chưa nhập comment thì không cho Submit
document.addEventListener('DOMContentLoaded', () => {
     const textarea_item = document.querySelector('.comment_post__block-input');
     const submit_button = document.querySelector('.comment_post__block-btn button');
     textarea_item.addEventListener('input', function(e) {
          if(textarea_item.value.trim() === '') {
               submit_button.disabled = true;
               submit_button.style.opacity = '0.7';
               submit_button.style.cursor = 'not-allowed'
          }
          else {
               submit_button.disabled = false;
               submit_button.style.opacity = '1';
               submit_button.style.cursor = 'pointer'
          }
     });
     textarea_item.addEventListener('blur', function(e) {
          if(textarea_item.value.trim() === '') {
               submit_button.disabled = true;
               submit_button.style.opacity = '0.7';
               submit_button.style.cursor = 'not-allowed'
          }
          else {
               submit_button.disabled = false;
               submit_button.style.opacity = '1';
               submit_button.style.cursor = 'pointer'
          }
     });
});

function getTimeSinceLastUpdate(lastUpdateTimestamp) {
     const now = Date.now();
     const diff = now - new Date(lastUpdateTimestamp);
   
     // Chuyển đổi thời gian chênh lệch từ mili giây sang các đơn vị khác
     const millisecondsInSecond = 1000;
     const secondsInMinute = 60;
     const minutesInHour = 60;
     const hoursInDay = 24;
     const daysInMonth = 30;
     const monthsInYear = 12;
   
     const seconds = Math.floor(diff / millisecondsInSecond);
     const minutes = Math.floor(seconds / secondsInMinute);
     const hours = Math.floor(minutes / minutesInHour);
     const days = Math.floor(hours / hoursInDay);
     const months = Math.floor(days / daysInMonth);
     const years = Math.floor(months / monthsInYear);
   
     if (years > 0) {
       return `${years} năm`;
     } else if (months > 0) {
       return `${months} tháng`;
     } else if (days > 0) {
       return `${days} ngày`;
     } else if (hours > 0) {
       return `${hours} giờ`;
     } else if (minutes > 0) {
       return `${minutes} phút`;
     } else {
       return '1 phút';
     }
}

// Báo lỗi
document.addEventListener('DOMContentLoaded', () => {
     const body_info__flag = document.querySelector('.body_info__flag');
     let isClicked = false;
     const chapterId = body_info__flag.getAttribute('data-chapter-id');
     
     body_info__flag.addEventListener('click', async function(e) {
          // Báo lỗi
          if(!isClicked) {
               isClicked = true;
               body_info__flag.style.color = 'var(--red-color)';
               // Update trường bao_loi Chapter
               const requestToUpdate = await fetch(`${window.location.pathname}/reportError?chapter_id=${chapterId}&increase=ok`)
          }
          // Hủy báo lỗi
          else {
               isClicked = false;
               body_info__flag.style.color = 'var(--opacity-white-color)';
               // Update trường bao_loi Chapter
               const requestToUpdate = await fetch(`${window.location.pathname}/reportError?chapter_id=${chapterId}&increase=nok`)
          }
     });
});


