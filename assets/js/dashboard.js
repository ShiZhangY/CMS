//判断是否带有token
checkLogin()

const initialize = document.querySelector('.initialize')
//发送请求初始化数据
initialize.addEventListener('click', function () {
    axios({
        url: 'init/data',
    }).then(res => {
        console.log(res);
    }).catch(error => {
        console.dir(error);
    })
})

const totalBox = document.querySelector('.total')//人数
const avgSalaryBox = document.querySelector('.avgSalary')//薪资
const avgAgeBox = document.querySelector('.avgAge')//年龄
const proportionBox = document.querySelector('.proportion')//男女比例

//渲染班级概况信息
axios({
    url: "student/overview"
}).then(res => {
    const { total, avgSalary, avgAge, proportion } = res.data.data
    totalBox.innerText = total
    avgSalaryBox.innerText = avgSalary
    avgAgeBox.innerText = avgAge
    proportionBox.innerText = proportion
})


async function getDashboard() {
    const res = await axios({ url: 'student/list' })
    console.log(res);
    //渲染薪资折线图
    renderSalaryChart(res)
}
getDashboard()
//渲染薪资折线图
function renderSalaryChart(res) {
    // 基于准备好的dom，初始化echarts实例
    const myChart = echarts.init(document.querySelector('.panel.line'));
    option = {
        title: {
            text: '薪资 salary'
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['期望薪资', '实际薪资']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: res.data.data.map(a => a.name)
        },
        yAxis: {
            type: 'value'
        },
        dataZoom: [
            {
                type: 'inside',
                start: 0,
                end: 10
            },
            {
                start: 0,
                end: 10
            }
        ],
        series: [
            {
                name: '期望薪资',
                type: 'line',
                stack: 'Total',
                data: res.data.data.map(a => a.salary),
                smooth: true
            },
            {
                name: '实际薪资',
                type: 'line',
                stack: 'Total',
                data: res.data.data.map(a => a.truesalary),
                smooth: true
            },
        ]
    };
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}