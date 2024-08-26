// Hàm xử lý thời gian
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

// Hàm để định dạng lượt xem
function formatViewsWithSpace(views) {
     let formatted;
     
     if (views < 1000) {
       formatted = views.toString();
     } else if (views >= 1000 && views < 1_000_000) {
       formatted = (views / 1000).toFixed(1);
       // Nếu số thập phân là 0, loại bỏ phần thập phân
       if (formatted.endsWith('.0')) {
         formatted = formatted.slice(0, -2);
       }
       formatted += ' K';
     } else if (views >= 1_000_000 && views < 1_000_000_000) {
       formatted = (views / 1_000_000).toFixed(1);
       // Nếu số thập phân là 0, loại bỏ phần thập phân
       if (formatted.endsWith('.0')) {
         formatted = formatted.slice(0, -2);
       }
       formatted += ' Tr';
     } else {
       formatted = (views / 1_000_000_000).toFixed(1);
       // Nếu số thập phân là 0, loại bỏ phần thập phân
       if (formatted.endsWith('.0')) {
         formatted = formatted.slice(0, -2);
       }
       formatted += ' B';
     }
   
     return formatted;
}

function formatViewsNoSpace(views) {
  let formatted;
  
  if (views < 1000) {
    formatted = views.toString();
  } else if (views >= 1000 && views < 1_000_000) {
    formatted = (views / 1000).toFixed(1);
    // Nếu số thập phân là 0, loại bỏ phần thập phân
    if (formatted.endsWith('.0')) {
      formatted = formatted.slice(0, -2);
    }
    formatted += 'K';
  } else if (views >= 1_000_000 && views < 1_000_000_000) {
    formatted = (views / 1_000_000).toFixed(1);
    // Nếu số thập phân là 0, loại bỏ phần thập phân
    if (formatted.endsWith('.0')) {
      formatted = formatted.slice(0, -2);
    }
    formatted += 'Tr';
  } else {
    formatted = (views / 1_000_000_000).toFixed(1);
    // Nếu số thập phân là 0, loại bỏ phần thập phân
    if (formatted.endsWith('.0')) {
      formatted = formatted.slice(0, -2);
    }
    formatted += 'B';
  }

  return formatted;
}

function changeTimetoDDMMYYYY(value) {
  const date = new Date(value);

  // Kiểm tra xem đối tượng Date có hợp lệ không
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date string");
  }

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}



