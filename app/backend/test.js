function replaceUrl(url, path) {
  return path + "/" + url.split("/")[3];
}

console.log(
  replaceUrl(
    "https://gateway.irys.net/3s6QyQr8kpZMjarAQzkRjBLRUjnBZJPJh9w22peDCFDu",
    "https://devnet.irys.xyz"
  )
);
