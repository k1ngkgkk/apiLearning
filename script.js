const background = document.getElementById('background');
const timeElement = document.getElementById("time");
const weatherElement = document.getElementById("weather");

async function getBackground() {
  const url = 'https://api.nasa.gov/planetary/apod?api_key=EoR2q9uPnjqqmINiZScHXv7TiDzHoLDrsb8mO8nr';
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const result = await response.json();
    if (result.media_type !== "image") return null;
    return result.url;
  } catch (error) {
    console.log(error.message);
    return null;
  }
}

async function getWeather(lat, lon) {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m,precipitation_probability&temperature_unit=fahrenheit&wind_speed_unit=mph`;
    const response = await fetch(url);
    const data = await response.json();
    if (data && data.current) {
      const { temperature_2m, wind_speed_10m, precipitation_probability } = data.current;
      weatherElement.innerText = `${precipitation_probability}% ${(temperature_2m -32)/1.8}°F ${wind_speed_10m * 1.609344} KMPH`;
    }
  } catch (error) {
    console.log(error.message);
  }
}

async function getQuote() {
  try {
    const url = 'https://api.allorigins.win/get?url=' + encodeURIComponent('https://zenquotes.io/api/random');
    const response = await fetch(url);
    const wrapper = await response.json();
    const data = JSON.parse(wrapper.contents);
    
    if (data && data[0]) {
      quoteText.innerText = `"${data[0].q}"`;
      quoteAuthor.innerText = `- ${data[0].a}`;
    }
  } catch (error) {
    quoteText.innerText = "Be the change you wish to see.";
    quoteAuthor.innerText = "- Unknown";
    console.log(error.message);
  }
}

window.onload = function () {
  getBackground().then(function (imageUrl) {
    if (imageUrl && background) {
      background.style["background-image"] = `url('${imageUrl}')`;
    }
  });

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      getWeather(position.coords.latitude, position.coords.longitude);
    }, (error) => console.log(error.message));
  }
};

setInterval(() => {
  const dateObject = new Date();
  const utcMs = dateObject.getTime();
  const offsetMs = dateObject.getTimezoneOffset() * 60 * 1000;
  const localMs = utcMs - offsetMs;
  const msToday = localMs % 86400000;

  const hours = Math.floor(msToday / 3600000);
  const minutes = Math.floor((msToday % 3600000) / 60000);
  const seconds = Math.floor((msToday % 60000) / 1000);

  const paddedHours = String(hours).padStart(2, '0');
  const paddedMinutes = String(minutes).padStart(2, '0');
  const paddedSeconds = String(seconds).padStart(2, '0');

  timeElement.innerText = `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
}, 1000);
