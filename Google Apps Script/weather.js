var timeStamp = Utilities.formatDate(new Date(), "GMT+8", "yyyy-MM-dd") //設定日期
var weather_url = 'https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-065?locationName=楠梓區&elementName=AT,T&dataTime='+timeStamp+'T09:00:00&Authorization=CWB-F70EEC26-0DD9-4FF8-B4F3-2E06232AFB14'
var CHANNEL_ACCESS_TOKEN = '+UB0gZAi3s6rKrl6eIatcgSacWmyogWPoD3IVIHUUrkYsVThyddr32jXYGmYAd6prRtJA56pSesdTQqqhQ2NM9Ik5M4DQPbTenzcqk1OR40lvlegDCTf8sSLhmpoZ1mmtTWi1qNv/vV7y36H7Uf8nQdB04t89/1O/w1cDnyilFU='
function doPost(e){
  //接收資訊
  var msg= JSON.parse(e.postData.contents);
  console.log(msg);
  //ReplyToken
  var replyToken = msg.events[0].replyToken;
  var replyText = '請記得每天看我的訊息唷!'
  //接收訊息文字做關鍵字回覆時可以用到
  //var userMessage = msg.events[0].message.text;
  
  ReplyMessage(replyToken,replyText);
}


function getData() {
  
  console.log(weather_url)
  timeStamp = Utilities.formatDate(new Date(), "GMT+8", "yyyy-MM-dd")       //設定日期  
  var response = UrlFetchApp.fetch(weather_url);                            //進行網頁請求
  var data = JSON.parse(response.getContentText());                         //把字串轉換成物件
  var data_location = data.records.locations[0].location[0].locationNam    //取得位置名稱
  var temp_type =  data.records.locations[0].location[0].weatherElement     //要取的資料類型
  var time = temp_type[0].time[0].dataTime                                  //取得資料時間
  var AT_temp = temp_type[0].time[0].elementValue[0].value                  //取得AT(體感溫度)數值
  var T_temp = temp_type[1].time[0].elementValue[0].value                   //取得T(溫度)數值
  var reply=[]
  
  //data = data.records.locations[0].location[0].weatherElement
  console.log(timeStamp)
  //console.log(data)
  reply[0] = "地區:"+data_location
  console.log("地區:"+data_location)
  reply[1] = time
  console.log(time)
  reply[2] = "體感溫度:"+AT_temp+"°C"
  console.log("體感溫度:"+AT_temp+"°C")
  reply[3] = "氣溫:"+T_temp+"°C"
  console.log("氣溫:"+T_temp+"°C")
  
  return reply
}

// 傳送訊息
function PushMessage(ID,msg){
   Logger.log(msg);
   var url = 'https://api.line.me/v2/bot/message/push';
    UrlFetchApp.fetch(url, {
        'headers': {
            'Content-Type': 'application/json; charset=UTF-8',
            'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
        },
        'method': 'post',
        'payload': JSON.stringify({
            'to':  ID,
            'messages': [{
                type:'text',
                text: msg
            }]
        }),
    }); 
}

function push(){
  var userId = "Ue327bcccf2d8107a1f11992ed35cc758"
  //PushMessage(userId,"安安!")
  PushFlexMessage(userId)
}

function push_OnMorning(){
  var userId = "Ue327bcccf2d8107a1f11992ed35cc758"
  var message = getData()
  PushMessage(userId,"早安!")
  for(var j = 0;j<(message.length);j++){
      PushMessage(userId,message[j]);
    }
}

function push_OnNight(){
  var userId = "Ue327bcccf2d8107a1f11992ed35cc758"
  PushMessage(userId,"晚安!")
}

// 每天早上7點執行push_OnMorning和晚上10點執行push_OnNight
function timeSet(){
   ScriptApp.newTrigger('push_OnMorning')
         .timeBased()
         .inTimezone('Asia/Taipei')
         .atHour(7)
         .everyDays(1)
         .create();
   ScriptApp.newTrigger('push_OnNight')
         .timeBased()
         .inTimezone('Asia/Taipei')
         .atHour(22)
         .everyDays(1)
         .create(); 
}

function timeSet2(){
   ScriptApp.newTrigger('push_OnNight')
         .timeBased()
         .inTimezone('Asia/Taipei')
         .everyMinutes(1)
         .create(); 
}

// 刪除trigger
function DeleteTrigger(){
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    Logger.log(triggers[i].getUniqueId());
    ScriptApp.deleteTrigger(triggers[i]);
  }
}

// 回覆訊息
function ReplyMessage(replyToken,replyText){
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