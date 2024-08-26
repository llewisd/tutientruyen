// Nút Scroll về đầu trang
document.addEventListener('DOMContentLoaded', () => {
     const scrollBtn = document.querySelector('.tool_scroll');
     scrollBtn.addEventListener('click', () => {
         window.scrollTo({
             top: 0,
             behavior: "smooth"
         });
     });
 
 });