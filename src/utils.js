import { differenceInSeconds } from 'date-fns';
import { toast } from 'react-toastify';
import axios from './axios';
import dayjs from 'dayjs';
import tz from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import duration from 'dayjs/plugin/duration';

dayjs.extend(tz);
dayjs.extend(utc);
dayjs.extend(duration);

toast.configure();
const toastOption = {
  position: toast.POSITION.BOTTOM_RIGHT,
  autoClose: 8000,
};

export const convertHexToRGB = (hex) => {
  // check if it's a rgba
  if (hex.match('rgba')) {
    const triplet = hex.slice(5).split(',').slice(0, -1).join(',');
    return triplet;
  }

  let c;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split('');
    if (c.length === 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = `0x${c.join('')}`;

    return [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',');
  }
};

export function debounce(func, wait, immediate) {
  let timeout;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = null;
      if (!immediate) func.apply(context, args);
    }, wait);
    if (immediate && !timeout) func.apply(context, args);
  };
}

export function isMobile() {
  if (window) {
    return window.matchMedia('(max-width: 767px)').matches;
  }
  return false;
}

export function isMdScreen() {
  if (window) {
    return window.matchMedia('(max-width: 1199px)').matches;
  }
  return false;
}

function currentYPosition(elm) {
  if (!window && !elm) {
    return;
  }
  if (elm) return elm.scrollTop;
  // Firefox, Chrome, Opera, Safari
  if (window.pageYOffset) return window.pageYOffset;
  // Internet Explorer 6 - standards mode
  if (document.documentElement && document.documentElement.scrollTop) return document.documentElement.scrollTop;
  // Internet Explorer 6, 7 and 8
  if (document.body.scrollTop) return document.body.scrollTop;
  return 0;
}

function elmYPosition(elm) {
  let y = elm.offsetTop;
  let node = elm;
  while (node.offsetParent && node.offsetParent !== document.body) {
    node = node.offsetParent;
    y += node.offsetTop;
  }
  return y;
}

export function scrollTo(scrollableElement, elmID) {
  const elm = document.getElementById(elmID);

  if (!elmID || !elm) {
    return;
  }

  const startY = currentYPosition(scrollableElement);
  const stopY = elmYPosition(elm);

  const distance = stopY > startY ? stopY - startY : startY - stopY;
  if (distance < 100) {
    scrollTo(0, stopY);
    return;
  }
  let speed = Math.round(distance / 50);
  if (speed >= 20) speed = 20;
  const step = Math.round(distance / 25);
  let leapY = stopY > startY ? startY + step : startY - step;
  let timer = 0;
  if (stopY > startY) {
    for (let i = startY; i < stopY; i += step) {
      setTimeout(
        (function (leapY) {
          return () => {
            scrollableElement.scrollTo(0, leapY);
          };
        }(leapY)),
        timer * speed,
      );
      leapY += step;
      if (leapY > stopY) leapY = stopY;
      timer++;
    }
    return;
  }
  for (let i = startY; i > stopY; i -= step) {
    setTimeout(
      (function (leapY) {
        return () => {
          scrollableElement.scrollTo(0, leapY);
        };
      }(leapY)),
      timer * speed,
    );
    leapY -= step;
    if (leapY < stopY) leapY = stopY;
    timer++;
  }
  return false;
}

export function getTimeDifference(date) {
  const difference = differenceInSeconds(new Date(), date);

  if (difference < 60) return `${Math.floor(difference)} sec`;
  if (difference < 3600) return `${Math.floor(difference / 60)} min`;
  if (difference < 86400) return `${Math.floor(difference / 3660)} h`;
  if (difference < 86400 * 30) return `${Math.floor(difference / 86400)} d`;
  if (difference < 86400 * 30 * 12) return `${Math.floor(difference / 86400 / 30)} mon`;
  return `${(difference / 86400 / 30 / 12).toFixed(1)} y`;
}

export function generateRandomId() {
  const tempId = Math.random().toString();
  const uid = tempId.substr(2, tempId.length - 1);
  return uid;
}

export function getQueryParam(prop) {
  const params = {};
  const search = decodeURIComponent(
    window.location.href.slice(window.location.href.indexOf('?') + 1),
  );
  const definitions = search.split('&');
  definitions.forEach((val, key) => {
    const parts = val.split('=', 2);
    params[parts[0]] = parts[1];
  });
  return prop && prop in params ? params[prop] : params;
}

export function classList(classes) {
  return Object.entries(classes)
    .filter((entry) => entry[1])
    .map((entry) => entry[0])
    .join(' ');
}

export function resolveResponse(res) {
  const methods = {
    put: 'updated',
    post: 'created',
    delete: 'deleted',
  };
  if (res.config.method !== 'get' && res.status >= 200) {
    let msg = `${axios.scopes[res.config.url]} ${methods[res.config.method]} successfully`;
    if(res.status === 207){

      let joinFailure = res.data.failure[0].resources.map((fail)=>{
        return fail.display_value
      })

      let joinSuccess = res.data.success[0].resources.map((success)=>{
        return success.display_value
      })

      if(res.data.success.length !== 0) msg = `The ${axios.scopes[res.config.url]} ${joinSuccess.join(',')} were ${methods[res.config.method]} but the ${axios.scopes[res.config.url]} ${joinFailure.flat().join(',')} were not`;
      else msg = `${res.data.failure[0].detail}`;
      return toast.warning(msg, toastOption);
    }

    return toast.success(msg, toastOption);
  }
}

export function resolveError(error) {
  console.log(error.response);
  if (typeof error.response.data === 'object' && error.response.data.status_code === undefined && error.response !== undefined) {
    for (const item in error.response.data) {
      if (Array.isArray(error.response.data[item])) {
        for (const str of error.response.data[item]) {
          return toast.error(`${item.toUpperCase()}: ${str}`, toastOption);
        }
      } else {
        for (const key in error.response.data[item]) {
          return toast.error(`${key.toUpperCase()}: ${error.response.data[item][key][0]}`, toastOption);
        }
      }
    }
  }
  if (error.response.status === 404) return toast.error(error.response.data.detail || 'Not found', toastOption);
  if (error.response.status === 403) {
    if (error.response.data.detail.includes('capability')) return toast.warning('You don´t have the permissions required', toastOption);
  } else if (error.response.status === 500) return toast.error('Internal server error, try again later', toastOption);
  else if (error.response.status >= 400) return toast.error(error.response.data.detail, toastOption);
  else return toast.error('Something went wrong!', toastOption);
}

export const npsScoreColors = {
  1: 'text-error',
  2: 'text-error',
  3: 'text-error',
  4: 'text-error',
  5: 'text-error',
  6: 'text-error',
  7: 'text-secondary',
  8: 'text-green',
  9: 'text-green',
  10: 'text-green',
};

export function toISOStringFromTimezone(date, timezone) {
  dayjs.tz.setDefault(timezone);

  const dateFormat = 'YYYY-MM-DD';
  const timeFormat = 'HH:mm';
  const datetimeFormat = `${dateFormat} ${timeFormat}`;
  const time = `${dayjs().format(dateFormat)} ${date.format(timeFormat)}`;

  return dayjs.tz(time, datetimeFormat, timezone).toISOString();
}
