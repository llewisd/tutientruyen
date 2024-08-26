function setBorderForItem(){document.querySelectorAll(".body_comic__item").forEach(e=>{"0"===e.querySelector(".body_comic__item-flag span:nth-of-type(2)").innerHTML?e.style.border="3px solid var(--green-color)":e.style.border="3px solid var(--orange-color)"})}function deleteComic(){document.querySelector(".body_comic__list").querySelectorAll(".body_comic__item-delete").forEach(i=>{i.addEventListener("click",function(){let t=document.querySelector(".delete_confirm__block"),e=(t.style.display="block",document.querySelector(".delete_confirm__select button:nth-of-type(1)")),a=t.querySelector(".delete_confirm__select button:nth-of-type(2)");async function o(){try{var e=i.closest(".body_comic__item-content").getAttribute("data-truyen-id"),t=i.closest(".body_comic__item-content").querySelector(".body_comic__item-name a").textContent.trim(),a=await(await fetch(`/addComic/delete?truyen_id=${e}&truyen_name=`+t)).json();console.log(a),a.success?setTimeout(()=>{window.location.href=window.location.href},1e3):console.log("deleteComic - Line 64 (addComic.js) : Fail to delete comic")}catch(e){console.log("deleteComic - Line 64 (addComic.js) : "+e)}}e.addEventListener("click",function(e){t.style.display="none",a.removeEventListener("click",o)}),a.addEventListener("click",o)})})}function handleForUpdateComic(){document.querySelectorAll(".body_comic__item-name div").forEach(e=>{e.addEventListener("click",async function(e){let p=document.querySelector(".addComic_block"),y=p.querySelector("#addComic_popup__form-container");var a=p.querySelector(".addComic_exit div"),o=p.querySelector(".addComic_button button:nth-child(1)");a.addEventListener("click",function(e){p.style.display="none",y.reset();y.querySelector(".addComic_popup__genre-list").innerHTML="";var t=p.querySelector(".addComic_alert__warning"),a=p.querySelector(".addComic_alert__success");t.style.display="none",a.style.display="none",p.querySelector(".addComic_popup__img").innerHTML='<img src="/images/local/anonymous.png" alt="avatar"></img>',y.removeEventListener("submit",d)}),o.addEventListener("click",function(e){p.style.display="none",y.reset();y.querySelector(".addComic_popup__genre-list").innerHTML="";var t=p.querySelector(".addComic_alert__warning"),a=p.querySelector(".addComic_alert__success");t.style.display="none",a.style.display="none",p.querySelector(".addComic_popup__img").innerHTML='<img src="/images/local/anonymous.png" alt="avatar"></img>',y.removeEventListener("submit",d)});let v=e.target.closest(".body_comic__item-content").getAttribute("data-truyen-id");a=await(await fetch("/addComic/update/getComic?truyen_id="+v)).json();if(a.success){y.querySelector(".addComic_popup__name input").value=a.data[0].ten,y.querySelector(".addComic_popup__other-name input").value=a.data[0].ten_khac,y.querySelector(".addComic_popup__img").innerHTML=`<img src="${a.data[0].anh}" alt="avatar">`,y.querySelector(".addComic_popup__author input").value=a.data[0].tac_gia,y.querySelector(".addComic_popup__description textarea").value=a.data[0].mo_ta,y.querySelector(".addComic_popup__status select").value=a.data[0].trang_thai;o=a.data[0].the_loai.sort((e,t)=>e.ten.localeCompare(t.ten));let t=p.querySelector(".addComic_popup__genre-list");o.forEach(e=>{t.insertAdjacentHTML("beforeend",`
                              <div class="addComic_popup__genre-item">
                                   <span>${e.ten}</span>
                                   <input type="hidden" name="genres" value="${e._id}">
                                   <span><i class="fa-solid fa-circle-xmark"></i></span>
                              </div>
                         `),p.querySelector(".addComic_popup__genre-item:last-of-type span:last-of-type").addEventListener("click",function(e){e.target.closest(".addComic_popup__genre-item").remove()})})}else console.log(err);p.querySelector(".addComic_button button:nth-of-type(2)").innerHTML="Cập nhật",p.querySelector(".addComic_popup__observation input").required=!1,p.querySelector(".addComic_popup__genres select").required=!1;e=p.querySelector("#addComic_popup__genre-dropdown");let i=p.querySelector(".addComic_popup__genre-list"),r=(e.addEventListener("change",function(e){let a=e.target.options[e.target.selectedIndex].getAttribute("data-genre-id");var e=`
                         <div class="addComic_popup__genre-item">
                              <span>${e.target.value}</span>
                              <input type="hidden" name="genres" value="${a}">
                              <span><i class="fa-solid fa-circle-xmark"></i></span>
                         </div>
                    `,o=i.querySelectorAll(".addComic_popup__genre-item");if(o.length){let t=!1;o.forEach(e=>{e.querySelector("input").getAttribute("value")===a&&(t=!0)}),t||i.insertAdjacentHTML("beforeend",e)}else i.insertAdjacentHTML("beforeend",e);i.querySelector(".addComic_popup__genre-item:last-of-type span:last-of-type").addEventListener("click",function(e){e.target.closest(".addComic_popup__genre-item").remove()})}),p.querySelector(".addComic_popup__img"));async function d(e){e.preventDefault();var e=y.querySelector(".addComic_popup__name input"),t=y.querySelector(".addComic_popup__observation input"),a=y.querySelector(".addComic_popup__status select"),o=y.querySelectorAll(".addComic_popup__genre-item input"),i=y.querySelector(".addComic_popup__other-name input"),r=y.querySelector(".addComic_popup__description textarea"),d=y.querySelector(".addComic_popup__author input"),c=(i.value.trim()||(i.value="Đang cập nhật"),r.value.trim()||(r.value="Đang cập nhật"),d.value.trim()||(d.value="Đang cập nhật"),new FormData);c.comic_name=e.value,c.other_comic_name=i.value,c.author=d.value,c.mo_ta=r.value,c.status=a.value;let n=[];o.forEach(e=>{n.push(e.value)}),c.genres=n;try{var l=await(await fetch("/addComic/update/folder?truyen_id="+v,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(c)})).json();if(l.success){var s=new FormData;s.append("image",t.files[0]);await(await fetch(`/addComic/update?folderPath=${l.folderPath}&folderName=${l.folderName}&url=${l.url}&truyen_id=`+l.truyen_id,{method:"POST",body:s})).json();var _=p.querySelector(".addComic_alert__warning"),u=p.querySelector(".addComic_alert__success");_.style.display="none",u.style.display="flex",setTimeout(()=>{window.location.href=window.location.href},1e3)}else{let e=p.querySelector(".addComic_alert__warning");var m=p.querySelector(".addComic_alert__success");e.style.display="flex",m.style.display="none",setTimeout(()=>{e.style.display="none"},3e3),console.log("File uploaded fail !")}}catch(e){console.log(e)}}p.querySelector(".addComic_popup__observation input").addEventListener("change",function(e){var t,e=e.target.files[0];e&&((t=new FileReader).onload=function(e){var t=document.createElement("img");t.src=e.target.result,r.innerHTML="",r.appendChild(t)},t.readAsDataURL(e))}),p.style.display="block",y.addEventListener("submit",d)})})}document.addEventListener("DOMContentLoaded",()=>{var e=document.querySelector(".add_btn__footer");let y=document.querySelector(".addComic_block"),v=y.querySelector("#addComic_popup__form-container");e.addEventListener("click",function(e){y.style.display="block";var t=y.querySelector(".addComic_exit div"),a=y.querySelector(".addComic_button button:nth-child(1)");t.addEventListener("click",function(e){y.style.display="none",v.reset();v.querySelector(".addComic_popup__genre-list").innerHTML="";var t=y.querySelector(".addComic_alert__warning"),a=y.querySelector(".addComic_alert__success");t.style.display="none",a.style.display="none",y.querySelector(".addComic_popup__img").innerHTML='<img src="/images/local/anonymous.png" alt="avatar"></img>',v.removeEventListener("submit",r)}),a.addEventListener("click",function(e){y.style.display="none",v.reset();v.querySelector(".addComic_popup__genre-list").innerHTML="";var t=y.querySelector(".addComic_alert__warning"),a=y.querySelector(".addComic_alert__success");t.style.display="none",a.style.display="none",y.querySelector(".addComic_popup__img").innerHTML='<img src="/images/local/anonymous.png" alt="avatar"></img>',v.removeEventListener("submit",r)}),y.querySelector(".addComic_button button:nth-of-type(2)").innerHTML="Tạo",y.querySelector(".addComic_popup__observation input").required=!0,y.querySelector(".addComic_popup__genres select").required=!0;let o=y.querySelector(".addComic_popup__img");y.querySelector(".addComic_popup__observation input").addEventListener("change",function(e){var t,e=e.target.files[0];e&&((t=new FileReader).onload=function(e){var t=document.createElement("img");t.src=e.target.result,o.innerHTML="",o.appendChild(t)},t.readAsDataURL(e))});t=y.querySelector("#addComic_popup__genre-dropdown");let i=y.querySelector(".addComic_popup__genre-list");async function r(e){e.preventDefault();var e=v.querySelector(".addComic_popup__name input"),t=v.querySelector(".addComic_popup__observation input"),a=v.querySelector(".addComic_popup__status select"),o=v.querySelectorAll(".addComic_popup__genre-item input"),i=v.querySelector(".addComic_popup__other-name input"),r=v.querySelector(".addComic_popup__description textarea"),d=v.querySelector(".addComic_popup__author input"),c=(i.value.trim()||(i.value="Đang cập nhật"),r.value.trim()||(r.value="Đang cập nhật"),d.value.trim()||(d.value="Đang cập nhật"),new FormData);c.comic_name=e.value,c.other_comic_name=i.value,c.author=d.value,c.mo_ta=r.value,c.status=a.value;let n=[];o.forEach(e=>{n.push(e.value)}),c.genres=n;try{var l=await(await fetch("/addComic/create/folder",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(c)})).json();if(l.success){var s=new FormData;s.append("image",t.files[0]);var _=await(await fetch(`/addComic/create?folderPath=${l.folderPath}&folderName=${l.folderName}&url=${l.url}&truyen_id=`+l.truyen_id,{method:"POST",body:s})).json(),u=y.querySelector(".addComic_alert__warning"),m=y.querySelector(".addComic_alert__success");u.style.display="none",m.style.display="flex",console.log("File uploaded successfully:",_),setTimeout(()=>{window.location.href=window.location.href},1e3)}else{let e=y.querySelector(".addComic_alert__warning");var p=y.querySelector(".addComic_alert__success");e.style.display="flex",p.style.display="none",setTimeout(()=>{e.style.display="none"},3e3),console.log("File uploaded fail !")}}catch(e){console.log(e)}}t.addEventListener("change",function(e){let a=e.target.options[e.target.selectedIndex].getAttribute("data-genre-id");var e=`
                    <div class="addComic_popup__genre-item">
                         <span>${e.target.value}</span>
                         <input type="hidden" name="genres" value="${a}">
                         <span><i class="fa-solid fa-circle-xmark"></i></span>
                    </div>
               `,o=i.querySelectorAll(".addComic_popup__genre-item");if(o.length){let t=!1;o.forEach(e=>{e.querySelector("input").getAttribute("value")===a&&(t=!0)}),t||i.insertAdjacentHTML("beforeend",e)}else i.insertAdjacentHTML("beforeend",e);i.querySelector(".addComic_popup__genre-item:last-of-type span:last-of-type").addEventListener("click",function(e){e.target.closest(".addComic_popup__genre-item").remove()})}),v.addEventListener("submit",r)})}),document.addEventListener("DOMContentLoaded",()=>{setBorderForItem(),handleForUpdateComic(),deleteComic()}),document.addEventListener("DOMContentLoaded",()=>{var e=document.querySelector(".body_header__search-bar");let a=JSON.parse(dataFromServer),o=document.querySelector(".header_ext__userInfo-name").getAttribute("data-user-quyen");e.addEventListener("input",function(e){var t,e=e.target.value;1<e.length?(t=e,e=(e=a).filter(e=>e.ten.toLowerCase().includes(t.toLowerCase())),document.querySelector(".body_comic__list").innerHTML=e.map(e=>`
               <div class="body_comic__item">
                    <div class="body_comic__item-img">
                         <img src="${e.anh}" alt="avatar">
                    </div>
                    <div class="body_comic__item-content" data-truyen-id="${e._id}">
                         <div class="body_comic__item-first">
                              <div class="body_comic__item-name">
                                   <a href="/addChapter/${e.link}/${e._id}">${e.ten}</a>
                                   <div><i class="fa-solid fa-pen"></i></div>
                              </div>
                              <div class="body_comic__item-first-support">
                                   <div style='display: ${"admin"===o?"block":"none"}' class="body_comic__item-delete">
                                        <i class="fa-regular fa-trash-can"></i>
                                   </div>
                                   <div class="body_comic__item-date">
                                        <i class="fa-regular fa-clock"></i>
                                        <span>${e.cap_nhat?changeTimetoDDMMYYYY(e.cap_nhat):changeTimetoDDMMYYYY(Date.now())}</span>
                                   </div>
                              </div>
                         </div>

                         <div class="body_comic__item-second">
                              <div class="body_comic__item-moreInfo">
                                   <div>Số chương: ${e.chuong||0}</div>
                                   <div> | </div>
                                   <div>Tình trạng:  ${e.trang_thai}</div>
                              </div>
                         </div>

                         <div class="body_comic__item-third">
                              <div class="body_comic__item-error-view">
                                   <div class="body_comic__item-flag">
                                        <i class="fa-solid fa-flag"></i>
                                        <span>Báo lỗi : </span>
                                        <span>${e.bao_loi}</span>
                                   </div>
                                   <div class="body_comic__item-view">
                                        <i class="fa-regular fa-eye"></i>
                                        <span>${e.tong_luot_xem}</span>
                                   </div>
                              </div>
                              <a href="/addChapter/${e.link}/${e._id}" class="body_comic__item-detail">
                                   <i class="fa-solid fa-arrow-right-long"></i>
                              </a>
                         </div>

                    </div>
               </div>
          `).join("")):document.querySelector(".body_comic__list").innerHTML=a.map(e=>`
                    <div class="body_comic__item">
                         <div class="body_comic__item-img">
                              <img src="${e.anh}" alt="avatar">
                         </div>
                         <div class="body_comic__item-content" data-truyen-id="${e._id}">
                              <div class="body_comic__item-first">
                                   <div class="body_comic__item-name">
                                        <a href="/addChapter/${e.link}/${e._id}">${e.ten}</a>
                                        <div><i class="fa-solid fa-pen"></i></div>
                                   </div>
                                   <div class="body_comic__item-first-support">
                                        <div style='display: ${"admin"===o?"block":"none"}' class="body_comic__item-delete">
                                             <i class="fa-regular fa-trash-can"></i>
                                        </div>
                                        <div class="body_comic__item-date">
                                             <i class="fa-regular fa-clock"></i>
                                             <span>${e.cap_nhat?changeTimetoDDMMYYYY(e.cap_nhat):changeTimetoDDMMYYYY(Date.now())}</span>
                                        </div>
                                   </div>
                              </div>
     
                              <div class="body_comic__item-second">
                                   <div class="body_comic__item-moreInfo">
                                        <div>Số chương: ${e.chuong||0}</div>
                                        <div> | </div>
                                        <div>Tình trạng:  ${e.trang_thai}</div>
                                   </div>
                              </div>
     
                              <div class="body_comic__item-third">
                                   <div class="body_comic__item-error-view">
                                        <div class="body_comic__item-flag">
                                             <i class="fa-solid fa-flag"></i>
                                             <span>Báo lỗi : </span>
                                             <span>${e.bao_loi}</span>
                                        </div>
                                        <div class="body_comic__item-view">
                                             <i class="fa-regular fa-eye"></i>
                                             <span>${e.tong_luot_xem}</span>
                                        </div>
                                   </div>
                                   <a href="/addChapter/${e.link}/${e._id}" class="body_comic__item-detail">
                                        <i class="fa-solid fa-arrow-right-long"></i>
                                   </a>
                              </div>
     
                         </div>
                    </div>
               `).join(""),setBorderForItem(),handleForUpdateComic(),deleteComic()})});