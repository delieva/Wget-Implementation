const download = document.getElementById('Start');

download.addEventListener('click', (e) => {
	e.preventDefault();
	console.log(document.getElementById('url').value);
	console.log('shit');
	fetch('/public', {
		method: 'POST',
		headers: {"Content-Type": "application/json"},
		credentials: 'include',
		body: JSON.stringify({
			name: document.getElementById('name').value,
			url: document.getElementById('url').value
		})
	})
		.then (res=>res.json()).then(res=> {
		if (res.error) {
			alert(res.error)
		}
		else {
			if(res.size !== undefined){
				let temp_date = new Date();
				let day = temp_date.getDate();
				let month = temp_date.getMonth() + 1;
				let year = temp_date.getYear() - 100 + 2000;
				document.getElementById('result').innerHTML = "\""+res.name+"\"" + " downloaded," +" size: "+ res.size+"Kb";
				document.getElementById('timeDate').innerHTML = "date: " + day + "." + month + "." + year + "   time: " + temp_date.getHours() + ":" + temp_date.getMinutes() + ":" + temp_date.getSeconds()
			}
			else{

				let temp_date = new Date();
				let day = temp_date.getDate();
				let month = temp_date.getMonth() + 1;
				let year = temp_date.getYear() - 100 + 2000;
				document.getElementById('result').innerHTML = "\""+res.name+"\"" + " downloaded"
				document.getElementById('timeDate').innerHTML = "date: " + day + "." + month + "." + year + "   time: " + temp_date.getHours() + ":" + temp_date.getMinutes() + ":" + temp_date.getSeconds()
			}
		}
		
	})
});
