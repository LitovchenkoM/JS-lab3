var request = require('request'); //подключение библиотеки
var fs = require('fs'); // Загрузка модуля fs (файловая система)
var now = new Date();

function MName(i) {
    var month = ['January','February','March','April','May','June',
    'July','August','September','October','November','December'];
    return month[i];
}

var d=now.getDate();
var m=MName(now.getMonth());
var y=now.getFullYear();

var s = "<style type='text/css'> .content { margin: 0 auto 30px; width:800px; border: 2px solid gray; padding: 10px;} .date {margin: 0 auto; width:800px; } </style>";
s += "<h2 align='center'>Events IT this week: from  " + d + " " + m + " " + y + " to ";

now.setDate(now.getDate() + 7);
d=now.getDate();
//var m=Name(now.getMonth());
y=now.getFullYear();
s += d + " " + m + " " + y + "</h2>";

request('https://api.meetup.com/2/open_events?&sign=true&lat=40.75&country=us&topic=java,android,hacker,ruby,python&city=new-york&state=ny&category=34&lon=-73.98999786376953&time=,1w&key=4547d1a36616e767f195658726e687e', function (err,res,body) {
	if (err) throw err; // если ошибка выводи ошибку
	var res = (JSON.parse(body))["results"]; // парсим резалт в боди
	for (var item in res) {
		var time = new Date(res[item]["time"]);
		var h = time.getHours();
		if  (time.getMinutes() < 10 )
			var min = "0" + time.getMinutes();
		else min = time.getMinutes();
		d = time.getDate();
		m = MName(time.getMonth())		
		s += "<div class='date'>" + m + " " + d  + "</div><div class='content'><span>" + h +":" + min  + "</span><h2 align='center'>" + (res[item])["name"] + "</h2>";
		if ("venue" in res[item]) {
			s += "<div align='center'>Address: " + ((res[item])["venue"])["address_1"] + "</div>";
			if ("address_2" in (res[item])["venue"])
				s += "<div align='center'>Another address: " + ((res[item])["venue"])["address_2"] + "</div>"; 
		}
		s +="<div align='center'>" + ((res[item])["group"])["name"] + "</div>";
		if ("description" in res[item]){
			s += "<p>" + (res[item])["description"] + "</p>";
		}
		s += "</div>";
	}
	fs.writeFile("meetup.html", s, function (err){
		if (err) console.log(err);
	});
});