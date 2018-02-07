const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}


function noteIdEncode(noteId, the) {

	var result = "";

	var r = Math.random();
	for (var count = 0; count < noteId.length; count++) {
		console.log(count, noteId.charAt(count));
		var b = parseInt(noteId.charAt(count));
		var a = b + 17;
		console.log(b, String.fromCharCode(a));
		//产生一个 0~9的随机数
		result = result + String.fromCharCode(a) + Math.floor(Math.random() * 10);
	}

	var base = "QWERTYUIOPSADFGHJKLZXCVBNMabcdefghijklmnopqrstuvwxyz0123456789-";
	var rondom = Math.floor(Math.random() * base.length);
	result = base.charAt(rondom) + result;

	return result;
}

module.exports = {
  formatTime: formatTime,
	noteIdEncode: noteIdEncode
}
