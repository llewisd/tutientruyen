function isValidEmail(email) {
     const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
     return re.test(String(email).toLowerCase());
}
 


// Chuyển tiếp giữa tab đăng nhập và đăng ký
document.addEventListener('DOMContentLoaded', function() {
     const sign_btns = document.querySelectorAll('.sign_window__tag');
     const signin_block = document.querySelector('.sign_window__block-signin');
     const signup_block = document.querySelector('.sign_window__block-signup');
     const already_account = document.querySelector('.sign_window__block-signup .sign_window__support button:nth-child(1)');
     
     sign_btns.forEach(item => {
          item.addEventListener('click', (e) => {
               const content = e.target.textContent;

               if(content === "Đăng nhập") {
                    sign_btns[1].removeAttribute('style');
                    signup_block.style.display = "none";

                    sign_btns[0].style.borderBottom = "3px solid var(--red-color)";
                    sign_btns[0].style.opacity = "1";
                    signin_block.style.display = "flex";
               }
               else {
                    sign_btns[0].removeAttribute('style');
                    signin_block.style.display = "none";

                    sign_btns[1].style.borderBottom = "3px solid var(--red-color)";
                    sign_btns[1].style.opacity = "1";
                    signup_block.style.display = "flex";
               }
          })
     });
     already_account.addEventListener('click', e => {
          sign_btns[1].removeAttribute('style');
          signup_block.style.display = "none";

          sign_btns[0].style.borderBottom = "3px solid var(--red-color)";
          sign_btns[0].style.opacity = "1";
          signin_block.style.display = "flex";
     })
});

// Khi nhấn nút X thì tắt popup đăng nhập
document.addEventListener('DOMContentLoaded', function() {
     const sign_window = document.querySelector('.sign_window')
     const exit_btn = sign_window.querySelector('.sign_window__tag-block div:nth-child(2) button');
     const signup_form = document.getElementById('sign_window__signup-form');
     const signin_form = document.getElementById('sign_window__signin-form');
     const alert_signin_div = document.querySelectorAll('.sign_window__block-signin .sign_window__alert div');
     const alert_signup_div = document.querySelectorAll('.sign_updow__block-signup .sign_window__alert div');

     exit_btn.addEventListener('click', e => {
          sign_window.style.display = "none";
          signup_form.reset();
          signin_form.reset();
          
          // Reset lại display none cho sign_window__support
          alert_signin_div.forEach(item => {
               item.style.display = "none";
          });
          alert_signup_div.forEach(item => {
               item.style.display = "none";
          });
     });
});

// Khi nhấn vào nút đăng ký/ đăng nhập thì mở cửa sổ popup
document.addEventListener('DOMContentLoaded', function() {
     const sign_btn = document.querySelector('.header_ext__signbutton');
     const sign_window = document.querySelector('.sign_window')
     sign_btn.addEventListener('click', e => {
         sign_window.style.display = "block";
     });
 });

//  Gửi Form đăng ký mà không tải lại trang
document.addEventListener('DOMContentLoaded', function() {
     const signup_form = document.getElementById('sign_window__signup-form');
     const alert_div = document.querySelectorAll('.sign_window__block-signup .sign_window__alert div');
     
     const sign_btns = document.querySelectorAll('.sign_window__tag');
     const signin_block = document.querySelector('.sign_window__block-signin');
     const signup_block = document.querySelector('.sign_window__block-signup');

     const signin_email = document.querySelector('.sign_window__block-signin .sign_window__email-block input');
     const signin_password = document.querySelector('.sign_window__block-signin .sign_window__password-block input');

     signup_form.addEventListener('submit', function(event) {
          event.preventDefault();
          const formData = new FormData(event.target);
          const dataInForm = {};
          formData.forEach((value, key) => {
               dataInForm[key] = value;
          });
          fetch('/login/signup', {
               method: 'POST',
               headers: { 
                    'Content-Type': 'application/json;charset=utf-8' 
               }, 
               body: JSON.stringify(dataInForm),
           })
           .then(response => response.json())
           .then(data => {
               if (data.email !== "ok") alert_div[0].style.display = "block"; 
               else alert_div[0].style.display = "none"; 
               if (data.ten !== "ok") alert_div[1].style.display = "block"; 
               else alert_div[1].style.display = "none"; 
               if (data.email === "ok" && data.ten === "ok") {
                    alert_div[2].style.display = "block"; 

                    setTimeout(() => {
                         // Chuyển qua tab đăng nhập
                         sign_btns[1].removeAttribute('style');
                         signup_block.style.display = "none";

                         sign_btns[0].style.borderBottom = "3px solid var(--red-color)";
                         sign_btns[0].style.opacity = "1";
                         signin_block.style.display = "flex";
                         // Xóa dữ liệu trong form
                         signup_form.reset();

                         alert_div[2].style.display = "none";

                         signin_email.value = dataInForm.email;
                         signin_password.value = dataInForm.password;
                    }, 1000);
          
               }
               else alert_div[2].style.display = "none"; 
           })
           .catch(error => console.error('Error:', error));
     });

     // Kiểm tra tên miền email khi đăng ký có đúng định dạng và thực sự tồn tại không
     const email_input = signup_form.querySelector('#signup_email');
     const signup_btn = document.querySelector('.sign_window__block-signup .sign_window__support button:nth-child(2)');

     email_input.addEventListener('blur', function(e) {
          if(email_input.value.trim() !== '') {
               if(!isValidEmail(email_input.value)) {
                    signup_btn.disabled = true;
                    alert_div[3].style.display = "block";
               }
               else {
                    // Kiểm tra xem tên miền có tồn tại
                    const dataInForm = {};
                    dataInForm['email'] = email_input.value;
                    fetch('/login/signup/checkEmailExist', {
                         method: 'POST',
                         headers: { 
                              'Content-Type': 'application/json' 
                         }, 
                         body: JSON.stringify(dataInForm),
                    })
                    .then(response => response.json())
                    .then(data => {
                         if(data.status !== "ok") {
                              signup_btn.disabled = true;
                              alert_div[3].style.display = "block";
                         }
                         else {
                              signup_btn.disabled = false;
                              alert_div[3].style.display = "none";
                         }
                    });
                    
               }
          }
          else {
               signup_btn.disabled = false;
               alert_div[3].style.display = "none";
          }
     });
});

// Kiểm tra thông tin khi đăng nhập
document.addEventListener('DOMContentLoaded', function() {
     const signin_form = document.getElementById('sign_window__signin-form');
     const alert_div = document.querySelectorAll('.sign_window__block-signin .sign_window__alert div');

     const signin_btn = document.querySelector('.sign_window__block-signin .sign_window__support button:nth-child(2)');

     const signin_email = document.querySelector('.sign_window__block-signin .sign_window__email-block input');
     const signin_password = document.querySelector('.sign_window__block-signin .sign_window__password-block input');

     signin_form.addEventListener('submit', function(event) {
          event.preventDefault();
          const formData = new FormData(event.target);
          const dataInForm = {};
          formData.forEach((value, key) => {
               dataInForm[key] = value;
          });
          
          fetch('/login/signin', {
               method: 'POST',
               headers: { 
                    'Content-Type': 'application/json' 
               }, 
               body: JSON.stringify(dataInForm),
           })
           .then(response => response.json())
           .then(data => {
               if (data.email !== "ok") alert_div[3].style.display = "block"; 
               else alert_div[3].style.display = "none"; 
               if (data.password !== "ok") alert_div[1].style.display = "block"; 
               else alert_div[1].style.display = "none"; 
               if (data.email === "ok" && data.password === "ok") {
                    alert_div[2].style.display = "block"; 
                    setTimeout(() => {
                         window.location.href = window.location.pathname;
                    }, 1000);
               }
               else alert_div[2].style.display = "none"; 
           })
           .catch(error => console.error('Error:', error));
     });
});

function checkEmailValidate() {
     const alert_div = document.querySelectorAll('.sign_window__block-signin .sign_window__alert div');

     const signin_btn = document.querySelector('.sign_window__block-signin .sign_window__support button:nth-child(2)');

     const signin_email = document.querySelector('.sign_window__block-signin .sign_window__email-block input');
     if(signin_email.value.trim() !== '') {
          if(!isValidEmail(signin_email.value)) {
               signin_btn.disabled = true;
               alert_div[0].style.display = "block";
               alert_div[3].style.display = "none";
          }
          else {
               signin_btn.disabled = false;
               alert_div[0].style.display = "none";
          }
     }
     else {
          signin_btn.disabled = false;
          alert_div[0].style.display = "none";
     }
}

// Click vào avatar để mở bảng chọn "Cài đặt" và "Thoát"
document.addEventListener('DOMContentLoaded', function() {
     const avatar = document.querySelector('.header_ext__userInfo');
     const avatar_dropdown = avatar.querySelector('.header_ext__userInfo-dropdown');

     avatar.addEventListener('click', function(e) {
          if(avatar_dropdown.style.display === "none")  avatar_dropdown.style.display = "block";
          else avatar_dropdown.style.display = "none";
     });
});

// Click vào "Thoát" thì xóa cookie và tải lại trang
document.addEventListener('DOMContentLoaded', function() {
     const exit_btn = document.querySelector('.header_ext__userInfo-dropdown div:nth-child(2)');
     exit_btn.addEventListener('click', function(e) {
          const current_page = window.location.pathname;
          fetch('/login/signout', {
               method: 'GET'
           })
          .then(response => response.json())
          .then(data => {
               window.location.href = current_page;
          })
          .catch(error => {
               console.error('Error:', error);
          });
     });
});

// Mở cửa sổ oauth giữa trình duyệt
// function openCenteredWindow(url, width, height) {
//      // Tính toán vị trí để cửa sổ mở ở giữa màn hình
//      const left = (screen.width - width) / 2;
//      const top = (screen.height - height) / 2;
 
//      // Mở cửa sổ với vị trí đã tính toán
//      window.open(url, 'oauth', `width=${width},height=${height},top=${top},left=${left}`);
// }

// Gắn thêm trang hiện tại khi đăng nhập bằng mạng xã hội
document.addEventListener('DOMContentLoaded', function() {
     const authLink = document.querySelectorAll('.sign_window__social a');
     const returnTo = encodeURIComponent(window.location.pathname);
     authLink[0].href = `/login/signin/auth/google?returnTo=${returnTo}`;
     authLink[1].href = `/login/signin/auth/facebook?returnTo=${returnTo}`;
 });

//  CÁC HÀM XỬ LÝ KHI QUÊN MẬT KHẨU

 // Mở tắt popup quên mật khẩu
document.addEventListener('DOMContentLoaded', function() {
     const forgetpassword_window = document.querySelector('.forgetpassword_block');
     const exit_btn = forgetpassword_window.querySelector('.forgetpassword_popup-exit');
     const forgetpassword_form = forgetpassword_window.querySelector('.forgetpassword_popup-body');
     const alert_forgetpassword_div = forgetpassword_window.querySelectorAll('.forgetpassword_popup-alert div');
     const forgetpassword_btn = document.querySelector('.sign_window__block-signin .sign_window__support button:nth-child(1)');
     // Tắt
     exit_btn.addEventListener('click', function(e) {
          forgetpassword_window.style.display = "none";
          forgetpassword_form.reset();
          
          // Reset lại display none cho sign_window__support
          alert_forgetpassword_div.forEach(item => {
               item.style.display = "none";
          });
     });
     // Mở
     forgetpassword_btn.addEventListener('click', function(e) {
          if(forgetpassword_window.style.display === "none") forgetpassword_window.style.display = "block";
          else forgetpassword_window.style.display = "none";
     });
});

function checkEmailValidateInForgetPassword() {
     const alert_div = document.querySelectorAll('.forgetpassword_popup-alert div');

     const forgetpassword_btn = document.querySelector('.forgetpassword_popup-submit-btn button');

     const forgetpassword_email = document.querySelector('.forgetpassword_popup-body input');
     if(forgetpassword_email.value.trim() !== '') {
          if(!isValidEmail(forgetpassword_email.value)) {
               forgetpassword_btn.disabled = true;
               alert_div[0].style.display = "block";
               alert_div[1].style.display = "none";
               alert_div[2].style.display = "none";
               alert_div[3].style.display = "none";
          }
          else {
               forgetpassword_btn.disabled = true;
               alert_div[0].style.display = "none";
               alert_div[1].style.display = "none";
               alert_div[2].style.display = "none";
               alert_div[3].style.display = "none";
          }
     }
     else {
          forgetpassword_btn.disabled = false;
          alert_div[0].style.display = "none";
          alert_div[1].style.display = "none";
          alert_div[2].style.display = "none";
          alert_div[3].style.display = "none";
     }
}

// Kiểm tra email có tồn tại không
document.addEventListener('DOMContentLoaded', function() {
     const form_block = document.querySelector('.forgetpassword_popup-body');
     const email_input = document.querySelector('.forgetpassword_popup-body input');
     const forgetpassword_btn = document.querySelector('.forgetpassword_popup-submit-btn button');
     const alert_div = document.querySelectorAll('.forgetpassword_popup-alert div');
     email_input.addEventListener('blur', function(e) {
          if(email_input.value.trim() !== '') {
               // Kiểm tra xem tên miền có tồn tại
               const dataInForm = {};
               dataInForm['email'] = email_input.value;
               fetch('/login/signup/checkEmailExist', {
                    method: 'POST',
                    headers: { 
                         'Content-Type': 'application/json' 
                    }, 
                    body: JSON.stringify(dataInForm),
               })
               .then(response => response.json())
               .then(data => {
                    if(data.status !== "ok") {
                         forgetpassword_btn.disabled = true;
                         forgetpassword_btn.style.cursor = "default";
                         alert_div[1].style.display = "block";
                    }
                    else {
                         forgetpassword_btn.disabled = false;
                         forgetpassword_btn.style.cursor = "pointer";
                         alert_div[1].style.display = "none";
                    }
               })
               .catch(err => console.log(err));
          }
          else {
               forgetpassword_btn.disabled = false;
               forgetpassword_btn.style.cursor = "pointer";
               alert_div[1].style.display = "none";
               alert_div[2].style.display = "none";
               alert_div[3].style.display = "none";
          }
     });
     // Trong quá trình nhập form thì không được submit
     // email_input.addEventListener('input', function(e) {
     //      forgetpassword_btn.disabled = true;
     // });

     // Gửi dữ liệu sang server để xác thực
     form_block.addEventListener('submit', function(event) {
          event.preventDefault();
          const email_data = email_input.value;
          const dataInForm = {};
          dataInForm["email"] = email_data;
          console.log(email_data);
          fetch('/login/forgetPassword', {
               method: 'POST',
               headers: { 
                    'Content-Type': 'application/json' 
               }, 
               body: JSON.stringify(dataInForm),
           })
           .then(response => response.json())
           .then(data => {
               console.log(data)
               if(data.status === "not exist") {
                    alert_div[0].style.display = "none";
                    alert_div[1].style.display = "none";
                    alert_div[2].style.display = "none";
                    alert_div[3].style.display = "block";
               }
               else if(data.status === "fail") {
                    alert_div[0].style.display = "none";
                    alert_div[1].style.display = "none";
                    alert_div[2].style.display = "block";
                    alert_div[3].style.display = "none";
               }
               else {
                    alert_div[0].style.display = "none";
                    alert_div[1].style.display = "none";
                    alert_div[2].style.display = "block";
                    alert_div[3].style.display = "none";
               }
           })
           .catch(error => console.error('Error:', error));
     });
});



