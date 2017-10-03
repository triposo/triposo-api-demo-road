export function leadingZero(s) {
  let b = s + "";
  if (b.length < 2) return "0" + b;
  return b;
}

export function monthName(index) {
  return [
    "jan",
    "feb",
    "mar",
    "apr",
    "may",
    "jun",
    "jul",
    "aug",
    "sep",
    "oct",
    "nov",
    "dec"
  ][index];
}

export function apiRequest(query) {
  const url = `/api/v4/${query}`;
  return fetch(url, {
    credentials: "include",
    headers: {
      "X-Triposo-Account": process.env.REACT_APP_TRIPOSO_API_ACCOUNT,
      "X-Triposo-Token": process.env.REACT_APP_TRIPOSO_API_TOKEN
    }
  }).then(
    response => {
      if (response.ok) {
        return response.json();
      } else {
        console.log("Error", response, query);
        return response.text().then(text => Promise.reject(text));
      }
    },
    fail => console.log(fail)
  );
}
