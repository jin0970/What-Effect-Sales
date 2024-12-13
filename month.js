var chartDomMonth = document.getElementById('month');
var myChartMonth = echarts.init(chartDomMonth);
var optionM;

const select_cat = document.querySelector('.sale-product');
const select_fac = document.querySelector('.navWeather');
const barcolors = [
    ['#fc5c65','#eb3b5a'],['#fed330','#f7b731'],
    ['#45aaf2','#2d98da']
]
let now_choice = 'Final_Total';
let now_factor = 'avgtp';
let now_color = barcolors[0];

async function drawBarChart() {
    const svgs = chartDomMonth.querySelectorAll('svg');
    svgs.forEach(svg => {
        svg.remove();  // Remove each svg element
    });
    const data = await d3.json("./average_by_month.json");
    const dates = data.map(d => d['year_month']);
    const  barData = data.map(d => d[now_factor]);
    let lineData = data.map(d=>d[now_choice]);
    console.log(dates)
    console.log(barData);
    console.log(lineData);
// optionM
    optionM = {
        title: {
            text: 'Weather&Sales of Different Months',
            left: 'center',
            top: '0',  // Title positioning from the top of the chart (optional)
            textStyle: {
                color: 'gray',  // Title text color (e.g., Tomato red)
                fontStyle: 'italic',  // Font style: 'normal', 'italic', 'oblique'
                fontWeight: 'bold',  // Font weight: 'normal', 'bold', 'bolder', 'lighter'
                fontFamily: 'Lobster',
                fontSize: 24  // Font size
            }
        },
        backgroundColor: 'transparent',
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        xAxis: {
            data: dates,
            axisLine: {
                lineStyle: {
                    color: 'gray'
                }
            },
            axisLabel: {
                rotate: 45,
                fontSize: 12,
                fontWeight: 'bold',
                fontFamily: 'fantasy',
            }
        },
        yAxis: [
            {
                min: function(value) {
                    let minValue = value.min > 0 ? value.min*0.9 : value.max * 0.1;

                    // 保证返回的最小值是 10 的倍数
                    minValue = Math.floor(minValue / 10) * 10;

                    // 如果你希望返回的最小值是 100 的倍数，可以使用下面的代码
                    // minValue = Math.floor(minValue / 100) * 100;

                    return minValue;
                },
                name: '↑SALES',
                nameTextStyle: {
                    color: 'rgba(255, 177, 66,1.0)',  // 标签颜色
                    fontSize: 16,   // 标签字体大小
                    fontFamily: 'fantasy'
                },
                position: 'left',
                type: 'value',
                splitArea: {
                    show: false
                },
                splitLine: {
                    show:false,
                    lineStyle: {
                        color:'gray',
                        type:'dashed'
                    }
                },
                axisLabel: {
                    color: 'gray',  // 标签颜色
                    fontSize: 14,   // 标签字体大小
                    fontFamily: 'fantasy'
                }
            },{
                name: `↑${now_factor.toUpperCase()}`,
                nameTextStyle: {
                    color: now_color[1],  // 标签颜色
                    fontSize: 16,   // 标签字体大小
                    fontFamily: 'fantasy'
                },
                position: 'right',
                type: 'value',
                min: 0,
                splitArea: {
                    show: false
                },
                splitLine: {
                    lineStyle: {
                        color:'gray',
                        type:'dashed'
                    }
                },
                axisLabel: {
                    color: 'gray',  // 标签颜色
                    fontSize: 14,   // 标签字体大小
                    fontFamily: 'fantasy'
                }
            }
        ],
        series: [
            {
                name: 'sales',
                type: 'line',
                smooth: true,
                showAllSymbol: true,
                symbol: 'emptyCircle',
                symbolSize: 15,
                color: 'rgba(255, 177, 66,1.0)',
                data: lineData,
                yAxisIndex: 0 // 绑定到左侧坐标轴
            },
            {
                name: now_factor,
                type: 'bar',
                barWidth: 15,
                itemStyle: {
                    borderRadius: 5,
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {offset: 0, color: now_color[0]},
                        {offset: 1, color: now_color[1]}
                    ])
                },
                data: barData,
                yAxisIndex: 1 // 绑定到右侧坐标轴
            }
        ]
    };

    optionM && myChartMonth.setOption(optionM);
}
drawBarChart(barcolors[1]);
select_cat.addEventListener('change',(event)=>{
    console.log(event.target.value);
    let i = event.target.value;
    if (i !== '-1'){
        now_choice = categories[categories.length - i - 1];
    }else {
        now_choice = 'Final_Total';

    }
    drawBarChart();
})
select_fac.addEventListener('change',(event)=>{
    console.log(event.target.value);
    let i = event.target.value;
    if (i === '0'){
        now_factor = 'avgtp';
    }else if(i === '1'){
        now_factor = 'sun';
    }else{
        now_factor = 'rain';
    }
    now_color = barcolors[i];
    drawBarChart();
})
