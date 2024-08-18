// // Trượt các phần tử trong slider
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function changeSlideItem(slider, slider_items) {
    setInterval(() => {
        slider.appendChild(slider_items[0]);
        slider_items = slider.getElementsByClassName('slider_block__item');
    }, 4000);
    //  let index = 0;
     
    //  setInterval(() => {
    //     //   index = (index + 1) % slider_items.length;
    //     //   const offset = -index * 200;
    //       for(i=0; i < slider_items.length; i++) {
    //         slider_items[i].style.transform = 'translateX(-200px)'; 
    //       }
    //     //   for(i=0; i < slider_items.length; i++) {
    //     //     slider_items[i].style.transform = 'none';
            
    //     //   }
        
    //     //  Di chuyển phần tử đầu tiên đến cuối
    //      slider.appendChild(slider_items[0]);
    
    //     //  Cập nhật danh sách phần tử sau khi di chuyển
    //      slider_items = slider.getElementsByClassName('slider_block__item');

    //  }, 4000);
}

function clickToChangeRightSlideItem(slider, slider_items) {
    slider.appendChild(slider_items[0]);
    slider_items = slider.getElementsByClassName('slider_block__item');
}

function clickToChangeLeftSlideItem(slider, slider_items) {
    slider.prepend(slider_items[slider_items.length - 1]);
    slider_items = slider.getElementsByClassName('slider_block__item');
}
 
 document.addEventListener('DOMContentLoaded', () => {
     let slider = document.getElementsByClassName('slider_block__list')[0];
     let slider_items = document.getElementsByClassName('slider_block__item');
    
     if (slider && slider_items.length > 0) {
        changeSlideItem(slider, slider_items);
     }

     const rightBtnSlider = document.querySelector('.slider_block__buttonRight');
     const leftBtnSlider = document.querySelector('.slider_block__buttonLeft');
     rightBtnSlider.addEventListener('click', () => {
        clickToChangeRightSlideItem(slider, slider_items);
     });

     leftBtnSlider.addEventListener('click', () => {
        clickToChangeLeftSlideItem(slider, slider_items);
     });
 });

// Biến đổi thời điểm cập nhật cho đúng định dạng
// document.addEventListener('DOMContentLoaded', function() {
//     const slider_item = document.querySelectorAll('.slider_block__info span');
//     const body_list_item = document.querySelectorAll('.body_list__info span');
//     slider_item.forEach(item => {
//          item.innerHTML = getTimeSinceLastUpdate(item.innerHTML);

//     })
//     body_list_item.forEach(item => {
//          item.innerHTML = getTimeSinceLastUpdate(item.innerHTML);
//     })
// })

// Biến đổi view cho đúng định dạng
document.addEventListener('DOMContentLoaded', function() {
    const luotxem = document.querySelectorAll('.body_board__view span');
    luotxem.forEach(item => {
         item.innerHTML = formatViewsWithSpace(item.innerHTML)
    })
})







 
