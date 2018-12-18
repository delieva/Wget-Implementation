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
		.then (res=>res.json()).then(res=>{ alert(res.error)});
});




download.addEventListener('click', (e) => {
	e.preventDefault();
	//setTimeout(()=>{
		for(let i = 0; i < 10; i++){
 			console.log('shittttt');
			fetch('/stop1', {
				method: 'POST',
				headers: {"Content-Type": "application/json"},
				credentials: 'include',
				body: JSON.stringify({
				})
			})
				.then (res=>res.json()).then(res=> {
				if (res.data !== "error") {
					document.getElementById('result').innerHTML = "Downloaded: " + res.data + "%"//, 5)
				}
				else {
					document.getElementById('result').innerHTML = "Error"
				}
			})//	}, 1000)
		}
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