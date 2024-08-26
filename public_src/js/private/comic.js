document.addEventListener('DOMContentLoaded', () => {
     const ngay_cap_nhat = document.querySelectorAll('.body_chapterList__item-foot-date span');
     ngay_cap_nhat.forEach(item => {
          item.innerHTML = changeTimetoDDMMYYYY(item.innerHTML);
     })
})