document.addEventListener("DOMContentLoaded",()=>{let t=document.getElementsByClassName("tool_list")[0];t.addEventListener("click",()=>{var e=t.getElementsByClassName("tool_list__block")[0];if("none"===e.style.display){e.style.display="block";let t=document.querySelectorAll(".body_info__path a")[2];var n=document.querySelector(".tool_list__item").querySelectorAll("a"),n=Array.from(n).find(e=>e.textContent.trim()===t.textContent);n.style.backgroundColor="#e0e0e0",n.style.color="black",n.style.pointerEvents="none",n.scrollIntoView({block:"center"})}else e.style.display="none"})}),document.addEventListener("DOMContentLoaded",()=>{document.getElementsByClassName("tool_comment")[0].addEventListener("click",()=>{document.getElementsByClassName("comment_title")[0].scrollIntoView({behavior:"smooth",block:"center"})})});let current_url=window.location.pathname,itemsPerPage=5,currentPage=1,data=[];function changePage(e){renderPage(currentPage=e)}function renderPage(e){var t=(e-1)*itemsPerPage,e=e*itemsPerPage,t=data.slice(t,e),e=Math.ceil(data.length/itemsPerPage),n=document.querySelector(".comment_list");let o=document.querySelector(".header_ext__userInfo-name").textContent.trim(),a=document.querySelector(".header_ext__userInfo-name").getAttribute("data-user-quyen");n.innerHTML=t.map(e=>`<div class="comment_list__item">
                    <div class="comment_list__img">
                         <img src="${e.anh}" alt="avatar" loading="lazy">
                    </div>
                    <div class="comment_list__sidebar">
                         <div class="comment_list__content" data-comment-id="${e._id}">
                              <div class="comment_list__content-head">
                                   <div class="comment_list__content-name">
                                        ${e.ten}
                                   </div>
                                   <div class="comment_list__content-time">
                                        <i class="fa-solid fa-clock"></i>
                                        <span>${getTimeSinceLastUpdate(e.ngay_tao)}</span>
                                   </div>
                              </div>
                              <div class="comment_list__content-body">
                                   ${e.noi_dung.replace(/\r\n|\n/g,"<br>")}
                              </div>
                              <div class="comment_list__content-foot">
                                   <div class="comment_list__content-emotion">
                                        <div>
                                             <i class="fa-regular fa-thumbs-up"></i>
                                             <span>${e.thich}</span>
                                        </div>
                                        <div>
                                             <i class="fa-regular fa-thumbs-down"></i>
                                             <span>${e.ghet}</span>
                                        </div>
                                   </div>
                                   <div class="comment_list__content-response">
                                        <i class="fa-solid fa-reply"></i>
                                        <span>Trả lời</span>
                                   </div>
                                   <div style="display: ${o&&o===e.ten||"admin"===a?"block":"none"}" class="comment_list__content-delete">
                                        <i class="fa-solid fa-trash"></i>
                                   </div>
                              </div>
                         </div>
                         <div style="display:${e.binh_luan_con.length?"block":"none"}" class="comment_list__subcomment">
                              <div class="comment_list__notification">
                                   <i class="fa-solid fa-caret-down"></i>
                                   <span>${e.binh_luan_con.length} câu trả lời</span>
                              </div>
                              <div style="display:none" class="comment_list__subcontent">
                              ${e.binh_luan_con.map(e=>`
                                   <div class="comment_list__item">
                                        <div class="comment_list__img">
                                             <img src="${e.taikhoan_id.anh}" alt="avatar" loading="lazy">
                                        </div>
                                        <div class="comment_list__sidebar">
                                             <div class="comment_list__content" data-comment-id="${e._id}">
                                                  <div class="comment_list__content-head">
                                                       <div class="comment_list__content-name">
                                                            ${e.taikhoan_id.ten}
                                                       </div>
                                                       <div class="comment_list__content-time">
                                                            <i class="fa-solid fa-clock"></i>
                                                            <span>${getTimeSinceLastUpdate(e.ngay_tao)}</span>
                                                       </div>
                                                  </div>
                                                  <div class="comment_list__content-body">
                                                       ${e.noi_dung}
                                                  </div>
                                                  <div class="comment_list__content-foot">
                                                       <div class="comment_list__content-emotion">
                                                            <div>
                                                                 <i class="fa-regular fa-thumbs-up"></i>
                                                                 <span>${e.thich}</span>
                                                            </div>
                                                            <div>
                                                                 <i class="fa-regular fa-thumbs-down"></i>
                                                                 <span>${e.ghet}</span>
                                                            </div>
                                                       </div>
                                                       <div style="display: ${o&&o===e.taikhoan_id.ten||"admin"===a?"block":"none"}" class="comment_list__content-delete">
                                                            <i class="fa-solid fa-trash"></i>
                                                       </div>
                                                  </div>
                                             </div>
                         
                                        </div>
                                   </div>
                              `).join(" ")}
                              </div>
                         </div>
                    </div>
               </div>`).join(" ");n=document.querySelector(".pagination");let l="";1!==currentPage?l+=`
               <a href="javascript:void(0)" class="pagination__before" onclick="changePage(${currentPage-1})">
                         <i class="fa-solid fa-arrow-left"></i>
                         <span>TRƯỚC</span>
               </a>     
          `:l+=`
               <button style="opacity: 0.6; cursor: not-allowed;" class="pagination__before")">
                         <i class="fa-solid fa-arrow-left"></i>
                         <span>TRƯỚC</span>
               </button>     
          `;t=Array.from({length:e},(e,t)=>t+1),l+=`
          <div class="pagination__main">
               <span>Trang</span>
               <div class="pagination__select">
                    <span>${currentPage}</span>
                    <i class="fa-solid fa-angle-down fa-2xs"></i>
                    <div style="display: none"  class="pagination__option">
                         ${t.map(e=>`
                                   <a href="javascript:void(0)" class="pagination__option-link" onclick="changePage(${e})">
                                        ${e}
                                   </a>
                              `).join(" ")}
                    </div>
               </div>
               <span>/</span>
               <span>${e}</span>
          </div>
     `,currentPage!==e?l+=`
               <a href="javascript:void(0)" class="pagination__after" onclick="changePage(${currentPage+1})">
                         <span>SAU</span>
                         <i class="fa-solid fa-arrow-right"></i>
               </a>     
          `:l+=`
               <button style="opacity: 0.6; cursor: not-allowed;" class="pagination__after">
                         <span>SAU</span>
                         <i class="fa-solid fa-arrow-right"></i>
               </button>     
          `,n.innerHTML=l,n.querySelector(".pagination .pagination__after").addEventListener("click",function(e){m.click()}),n.querySelector(".pagination .pagination__before").addEventListener("click",function(e){m.click()}),t=document.querySelectorAll(".comment_list__content-response");let c=document.querySelector(".header_ext__userInfo"),s=document.querySelector(".sign_window"),r=document.querySelector(".comment_post__textarea-block"),d=(t.forEach(e=>{e.addEventListener("click",function(e){if("flex"===c.style.display){var t=e.target.closest(".comment_list__content").querySelector(".comment_list__content-name").textContent,e=e.target.closest(".comment_list__content").getAttribute("data-comment-id");let n=document.querySelector(".comment_post__textarea-support");n.querySelector(".comment_post__textarea-support span").textContent=t,n.style.display="block";t=new URL(r.action),e=(t.searchParams.set("response",e),r.action=t.href,document.querySelector(".tool .tool_comment").click(),window.getComputedStyle(n)),t=Math.round((2*parseFloat(e.marginLeft)+parseFloat(e.width))/4.5),e=" ".repeat(t);let o=document.querySelector(".comment_post__block-input");o.value=e,o.focus(),n.querySelector("i").addEventListener("click",function(e){n.style.display="none",o.value=o.value.trim();var t=new URL(r.action);t.searchParams.delete("response"),r.action=t.href})}else s.style.display="block"})}),document.querySelector(".pagination__select")),_=d.querySelector(".pagination__option"),m=document.querySelector(".tool .tool_comment");d.addEventListener("click",()=>{if("none"===_.style.display){_.style.display="block";let t=d.querySelector("span:nth-child(1)");var e=_.querySelectorAll("a"),n=Array.from(e).find(e=>e.textContent.trim()===t.textContent);n.style.backgroundColor="#e0e0e0",n.style.color="black",n.style.pointerEvents="none",n.scrollIntoView({block:"center"}),e.forEach(e=>{e.addEventListener("click",function(e){m.click()})})}else _.style.display="none"});var u=document.getElementsByClassName("comment_list__notification");for(i=0;i<u.length;i++)u[i].addEventListener("click",e=>{e=e.currentTarget.parentNode.getElementsByClassName("comment_list__subcontent")[0];"none"===e.style.display?e.style.display="block":e.style.display="none"});let p=document.querySelector(".delete_confirm__block");document.querySelectorAll(".comment_list__content-delete").forEach(e=>{e.addEventListener("click",function(e){p.style.display="block",p.querySelector(".delete_confirm__select button:nth-child(1)").addEventListener("click",function(e){p.style.display="none"});let n=e.target.closest(".comment_list__content").getAttribute("data-comment-id");p.querySelector(".delete_confirm__select button:nth-child(2)").addEventListener("click",function(e){var t=window.location.pathname,t=`${t}/comment/delete?comment_id=${n}&current_url=`+t;window.location.href=t})})})}function getTimeSinceLastUpdate(e){var e=Date.now()-new Date(e),e=Math.floor(e/1e3),e=Math.floor(e/60),t=Math.floor(e/60),n=Math.floor(t/24),o=Math.floor(n/30),a=Math.floor(o/12);return 0<a?a+" năm":0<o?o+" tháng":0<n?n+" ngày":0<t?t+" giờ":0<e?e+" phút":"1 phút"}fetch(current_url+"/comment").then(e=>e.json()).then(e=>{data=e,renderPage(currentPage)}).catch(e=>console.error("Error fetching data:",e)),document.addEventListener("DOMContentLoaded",()=>{var e=document.querySelector(".comment_post__block-input");let t=document.querySelector(".sign_window"),n=document.querySelector(".header_ext__userInfo");e.addEventListener("click",function(e){"none"===n.style.display&&(t.style.display="block",e.target.blur())})}),document.addEventListener("DOMContentLoaded",()=>{let t=document.querySelector(".comment_post__block-input"),n=document.querySelector(".comment_post__block-btn button");t.addEventListener("input",function(e){""===t.value.trim()?(n.disabled=!0,n.style.opacity="0.7",n.style.cursor="not-allowed"):(n.disabled=!1,n.style.opacity="1",n.style.cursor="pointer")}),t.addEventListener("blur",function(e){""===t.value.trim()?(n.disabled=!0,n.style.opacity="0.7",n.style.cursor="not-allowed"):(n.disabled=!1,n.style.opacity="1",n.style.cursor="pointer")})}),document.addEventListener("DOMContentLoaded",()=>{let t=document.querySelector(".body_info__flag"),n=!1,o=t.getAttribute("data-chapter-id");t.addEventListener("click",async function(e){n?(n=!1,t.style.color="var(--opacity-white-color)",await fetch(`${window.location.pathname}/reportError?chapter_id=${o}&increase=nok`)):(n=!0,t.style.color="var(--red-color)",await fetch(`${window.location.pathname}/reportError?chapter_id=${o}&increase=ok`))})});