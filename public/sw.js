self.addEventListener("install", (event) => {
    console.log("Service worker installed");
  });
  
  self.addEventListener("fetch", (event) => {
    console.log("Service worker fetching", event.request.url);
  });
  