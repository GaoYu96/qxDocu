function socket(url){
  let ws = new WebSocket(url);
  return ws
}
export default socket