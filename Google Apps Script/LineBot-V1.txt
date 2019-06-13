var product_name = new Array();
var product_price =[];
var product_fluctuation = [];
var lastRow;
function doGet(e) {
  var url = 'https://docs.google.com/spreadsheets/d/1UA8eFLxRpewzk0Jbz5nzwoaTmWMoCe5MnO7-dDYDgbg/edit#gid=1138949900'
  var name = '資導一旬';
  var SpreadSheet = SpreadsheetApp.openByUrl(url);
  var SheetName = SpreadSheet.getSheetByName(name);
  var lastColumn = SheetName.getLastColumn();
  lastRow = SheetName.getLastRow();
  
  product_name = SheetName.getSheetValues(1,1,lastRow,1);
  
  product_price = SheetName.getSheetValues(1,2,lastRow,2);
   
  product_fluctuation = SheetName.getSheetValues(1,4,lastRow,2);    
      
  //Logger.log(SheetName.getSheetValues(1,1,1,1));
  //Logger.log(SheetName.getSheetValues(2,1,1,1));
  Logger.log(product_fluctuation);
}


function doPost(e) {
  var CHANNEL_ACCESS_TOKEN = 'nxB9UCcxM/QfOTxwV7AA9hU2SvHL1Y88pyoSdfg1XhglB7YIHI98/rvEpeCPGCBzW9SalDFonp+b+WqWW4FwSoiRi8oroNTMhtYq+f05SI/I+HX3WyYRe1Tt0+kCU/EUrzSIrdFgxTC87OZ9vwvAHwdB04t89/1O/w1cDnyilFU=';
  var msg= JSON.parse(e.postData.contents);
  var price;
  var fluctuation; 
  console.log(msg);
  
  // 取出 replayToken 和發送的訊息文字
  var replyToken = msg.events[0].replyToken;
  var userMessage = msg.events[0].message.text;
  var replyText = '';
  if (typeof replyToken === 'undefined') {
    return;
  }
  
  
  doGet();
  
  for(var i=0;i<lastRow;i++){
    n = product_name[i].toString();
    if(userMessage == n){
      price=product_price[i].toString().split(",");
      fluctuation = product_fluctuation[i].toString().split(",");
      replyText = '您選擇的品項為:'+userMessage+'，此品項的這期金額:'+price[0]+'元，上期金額'+price[1]+
      '元，這期價差'+fluctuation[0]+'元，漲幅:'+fluctuation[1]+'%'+'網站連結:http://163.18.43.224/';
      break;
    }else{
      replyText ="請輸入任何項目~"+'資料網站連結:http://163.18.43.224/';
    }
  
  }
  
  
  var url = 'https://api.line.me/v2/bot/message/reply';
  UrlFetchApp.fetch(url, {
      'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
    },
    'method': 'post',
    'payload': JSON.stringify({
      'replyToken': replyToken,
      'messages': [{
        'type': 'text',
        'text': replyText,
      }],
    }),
  });
}
