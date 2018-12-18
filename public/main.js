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
		// else {
		// 	document.getElementById('result').innerHTML = "\""+res.name+"\"" + " downloaded. Size: " + res.size
		// }
		
	})
});

download.addEventListener('click', (e) => {
	e.preventDefault();
	//setTimeout(()=>{
	setTimeout(()=>{
		fetch('/stop1', {
			method: 'POST',
			headers: {"Content-Type": "application/json"},
			credentials: 'include',
			body: JSON.stringify({
			})
		})
			.then (res=>res.json()).then(res=> {
			if (!res.data) {
				if(res.size !== undefined){
					let temp_date = new Date();
					let day = temp_date.getDate();
					let month = temp_date.getMonth() + 1;
					let year = temp_date.getYear() - 100 + 2000;
					document.getElementById('result').innerHTML = "\""+res.name+"\"" + " downloaded. Size: " + res.size + 'Kb';
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
			else {
				document.getElementById('result').innerHTML = "Error"
			}
		})}, 1000)
});



// const button = document.getElementById('Pause');
// button.addEventListener('click', (e) => {
// 	e.preventDefault();
// 	console.log('shittttt');
// 	fetch('/stop', {
// 		method: 'POST',
// 		headers: {"Content-Type": "application/json"},
// 		credentials: 'include',
// 		body: JSON.stringify({
// 		})
// 	})
// 		.then((res)=>{console.log(res)})
// });