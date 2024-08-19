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

function capitalizeFirstLetter(str) {
  if (!str) return str; // Kiểm tra nếu chuỗi rỗng hoặc không xác định

  return str.charAt(0).toUpperCase() + str.slice(1);
}

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

function capitalizeWords(str) {
  return str.split(' ').map(word => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }).join(' ');
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

function stringToSlugWithUnderscore(str) {
  let from = "àáãảạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệđùúủũụưừứửữựòóỏõọôồốổỗộơờớởỡợìíỉĩịäëïîöüûñçýỳỹỵỷ",
      to   = "aaaaaaaaaaaaaaaaaeeeeeeeeeeeduuuuuuuuuuuoooooooooooooooooiiiiiaeiiouuncyyyyy";
  for (let i=0, l=from.length ; i < l ; i++) {
    str = str.replace(RegExp(from[i], "gi"), to[i]);
  }
  str = str.toLowerCase()
        .trim()
        .replace(/^[^\w]+|[^\w]+$/g, '')
        .replace(/[^\w\s]/g, '')
        .replace(/[^a-z0-9\-]/g, '_')
        .replace(/-+/g, '_');
  return str;
}

function stringToSlug(str) {
  let from = "àáãảạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệđùúủũụưừứửữựòóỏõọôồốổỗộơờớởỡợìíỉĩịäëïîöüûñçýỳỹỵỷ",
      to   = "aaaaaaaaaaaaaaaaaeeeeeeeeeeeduuuuuuuuuuuoooooooooooooooooiiiiiaeiiouuncyyyyy";
  for (let i=0, l=from.length ; i < l ; i++) {
    str = str.replace(RegExp(from[i], "gi"), to[i]);
  }
  str = str.toLowerCase()
        .trim()
        .replace(/^[^\w]+|[^\w]+$/g, '')
        .replace(/[^\w\s]/g, '')
        .replace(/[^a-z0-9\-]/g, '-')
        .replace(/-+/g, '-');
  return str;
}


module.exports = {
  getTimeSinceLastUpdate, 
  capitalizeFirstLetter,
  formatViewsWithSpace,
  formatViewsNoSpace,
  capitalizeWords,
  changeTimetoDDMMYYYY,
  stringToSlugWithUnderscore,
  stringToSlug,
  google: {
    google_Client_Id: '47329878494-ru5n5t5an4b4l5f9567lmfjsq869l2n7.apps.googleusercontent.com',
    google_Client_Secret: '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',
    google_Redirect_Uri: 'http://localhost:8002/login/signin/auth/google/callback'
  },
  facebook: {
    facebook_Client_Id: '759521546191740',
    facebook_Client_Secret: '683b349367df9fa729d7f15577feed5e',
    facebook_Redirect_Uri: 'http://localhost:8002/login/signin/auth/facebook/callback'
  },
}