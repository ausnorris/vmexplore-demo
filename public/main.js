// 1 SELECET ELEMENTS
const buttons = document.querySelectorAll('[data-index]');
const connected = document.querySelector('.connected');

// 2 CHART JS
const ctx = document.querySelector('#myChart').getContext('2d');
// 3 CHART DATA
let chartData = {
    labels : ['Salt Stack', 'Puppet', 'Ansible', 'Chef'],
    datasets: [{
        label:'Config Management Platform',
        data:[0,0,0,0,0,0],
        backgroundColor:[
            'rgba(19, 157, 237,0.2)',
            'rgba(206, 224, 36,0.2)',
            'rgba(255,99,112,0.2)',
            'rgba(10, 166, 10,0.2)',
            'rgba(255,99,92,0.2)',
            'rgba(255,99,82,0.2)',
        ],
        borderColor:[
            'rgba(255,100,132,1)',
        ],
        borderWidth:2
    }]
};
// 4 MY CHART
const myChart = new Chart(ctx, {
    type:'bar',
    data: chartData
});

// 5 ADD BUTTONS EVENT LISTENER
buttons.forEach(b=>{
    // console.log(+b.dataset.index);
    b.onclick = ()=>{
        // console.log(b.dataset.index);
        givePreference(0);
    };
});

// 6 GIVE PREFERENCE
function givePreference (index){
    // console.log(index);
    chartData.datasets[0].data[index] += 1;
    // Update the Chart
    // myChart.update();
    // Disable Buttons
    buttons.forEach(b=> b.disabled = true);
    // Send back the new Data
    ws.send(JSON.stringify({data:chartData.datasets[0].data}));
};

// 7 WEBSOCKET
const ws = new WebSocket('ws://localhost:8080');
// 8 OPEN EVENT
ws.addEventListener('open', ()=>{
    console.log('Connection opened.');
    connected.textContent = 'Connected 🔗';
    connected.classList.add('active');
});
// 9 CLOSE EVENT
ws.addEventListener('close',()=>{
    console.log('Disconnected.');
    connected.textContent = 'Disconnected 💔';
    connected.classList.remove('active');
});
// 10 MESSAGE EVENT
ws.addEventListener('message', e =>{
    let {data} = e;
    let newData = JSON.parse(data);
    // console.log(newData.data);
    // console.log(chartData.datasets[0].data);
    newData.data.forEach((d, index)=>{
        chartData.datasets[0].data[index] = +d;
    });
    // console.log(chartData.datasets[0].data);
    // UPDATE THE CHART
    myChart.update();
    // Confetti 🥳
    myConfetti({
        particleCount: 500,
        spread: 360,
        });
});