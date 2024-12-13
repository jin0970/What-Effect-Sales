var chartDom = document.getElementById('weeks');
var myChart = echarts.init(chartDom);
// var myChart = echarts.init(chartDom, 'macarons');
var option;

async function drawBoxChart() {

    const dataset_source = await getData(); // 获取数据源

    const week = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    let mon = [[], [], [], [], [], [], [], [], [], [], [], [], []];
    let tue = [[], [], [], [], [], [], [], [], [], [], [], [], []];
    let wed = [[], [], [], [], [], [], [], [], [], [], [], [], []];
    let thu = [[], [], [], [], [], [], [], [], [], [], [], [], []];
    let fri = [[], [], [], [], [], [], [], [], [], [], [], [], []];
    let sat = [[], [], [], [], [], [], [], [], [], [], [], [], []];
    let sun = [[], [], [], [], [], [], [], [], [], [], [], [], []];
    const allsale = categories.slice();
    allsale.push('Final_Total');

    dataset_source.forEach((d) => {
        switch (d.day) {
            case 'Monday':
                for (let i = 0; i < categories.length; i++) {
                    mon[i].push(d[categories[i]]);
                }
                mon[categories.length].push(d['Final_Total']);
                break;
            case 'Tuesday':
                for (let i = 0; i < categories.length; i++) {
                    tue[i].push(d[categories[i]]);
                }
                tue[categories.length].push(d['Final_Total']);
                break;
            case 'Wednesday':
                for (let i = 0; i < categories.length; i++) {
                    wed[i].push(d[categories[i]]);
                }
                wed[categories.length].push(d['Final_Total']);
                break;
            case 'Thursday':
                for (let i = 0; i < categories.length; i++) {
                    thu[i].push(d[categories[i]]);
                }
                thu[categories.length].push(d['Final_Total']);
                break;
            case 'Friday':
                for (let i = 0; i < categories.length; i++) {
                    fri[i].push(d[categories[i]]);
                }
                fri[categories.length].push(d['Final_Total']);
                break;
            case 'Saturday':
                for (let i = 0; i < categories.length; i++) {
                    sat[i].push(d[categories[i]]);
                }
                sat[categories.length].push(d['Final_Total']);
                break;
            case 'Sunday':
                for (let i = 0; i < categories.length; i++) {
                    sun[i].push(d[categories[i]]);
                }
                sun[categories.length].push(d['Final_Total']);
                break;
            default:
                break;
        }
    })
    console.log(mon)
    option = {
        title: {
            text: 'Sales of Different Weeks',
            left: 'center',
            top: '3%',  // Title positioning from the top of the chart (optional)
            textStyle: {
                color: 'gray',  // Title text color (e.g., Tomato red)
                fontStyle: 'italic',  // Font style: 'normal', 'italic', 'oblique'
                fontWeight: 'bold',  // Font weight: 'normal', 'bold', 'bolder', 'lighter'
                fontFamily: 'Lobster',
                fontSize: 24  // Font size
            }
        },
        dataset: [
            {
                source: mon
            },
            {
                source: tue
            },
            {
                source: wed
            },
            {
                source: thu
            },
            {
                source: fri
            },
            {
                source: sat
            },
            {
                source: sun
            },
            {
                fromDatasetIndex: 0,
                transform: {type: 'boxplot'}
            },
            {
                fromDatasetIndex: 1,
                transform: {type: 'boxplot'}
            },
            {
                fromDatasetIndex: 2,
                transform: {type: 'boxplot'}
            },
            {
                fromDatasetIndex: 3,
                transform: {type: 'boxplot'}
            },
            {
                fromDatasetIndex: 4,
                transform: {type: 'boxplot'}
            },
            {
                fromDatasetIndex: 5,
                transform: {type: 'boxplot'}
            },
            {
                fromDatasetIndex: 6,
                transform: {type: 'boxplot'}
            }
        ],
        legend: {
            top: '10%'
        },
        tooltip: {
            trigger: 'item',
            axisPointer: {
                type: 'shadow'
            }
        },
        grid: {
            left: '10%',
            top: '20%',
            right: '10%',
            bottom: '18%',
            backgroundColor: '#f4f4f4', // 设置背景颜色
            borderColor: '#ccc',  // 设置边框颜色
            borderWidth: 5,    // 设置边框宽度
            shadowColor: 'rgba(0, 0, 0, 0.5)', // 设置阴影颜色
            shadowBlur: 10,    // 设置阴影模糊度
            opacity: 0.8,    // 设置透明度
        },
        graphic: {
            elements: [{
                type: 'rect',
                left: '10%',
                top: '20%',
                shape: {
                    width: '80%',
                    height: '65%'
                },
                style: {
                    fill: 'blue', // 背景色
                }
            }]
        },
        xAxis: {
            type: 'category',
            name: '➔CATEGORY',
            nameTextStyle: {
                color: 'gray',  // 标签颜色
                fontSize: 16,   // 标签字体大小
                fontFamily: 'fantasy'
            },
            boundaryGap: true,
            nameGap: 10,
            splitArea: {
                show: false
            },
            splitLine: {
                show: true,
                lineStyle: {
                    color: 'gray',
                }
            },
            axisLabel: {
                gap: 5,
                rotate: 15,  // 旋转x轴标签45度
                margin: 10,   // 设置标签与坐标轴的距离
                transform: 'translateX(10)',
                formatter: function (value, index) {
                    return allsale[value];  // 其他标签添加单位
                },
                color: 'gray',  // 标签颜色
                fontSize: 14,   // 标签字体大小
                fontFamily: 'fantasy'
            }
        },
        yAxis: {
            name: '↑SALE',
            nameTextStyle: {
                color: 'gray',  // 标签颜色
                fontSize: 16,   // 标签字体大小
                fontFamily: 'fantasy'
            },
            type: 'value',
            min: 0,
            splitArea: {
                show: false
            },
            splitLine: {
                lineStyle: {
                    color: 'gray',
                    type: 'dashed'
                }
            },
            axisLabel: {
                color: 'gray',  // 标签颜色
                fontSize: 14,   // 标签字体大小
                fontFamily: 'fantasy'
            }
        },
        dataZoom: [
            {
                type: 'slider',
                start: 0,
                end: 100,
                bottom: '3%',
                handleIcon: 'M10,10 L20,10 L20,20 L10,20 Z', // 自定义滑块形状为矩形
                handleSize: '80%', // 滑块手柄大小
                handleStyle: {
                    color: '#008080', // 滑块手柄颜色
                    borderColor: '#004040', // 滑块手柄边框颜色
                    borderWidth: 2, // 边框宽度
                    shadowBlur: 4, // 阴影模糊度
                    shadowColor: '#666', // 阴影颜色
                    shadowOffsetX: 0, // X 轴阴影偏移
                    shadowOffsetY: 2 // Y 轴阴影偏移
                },
                textStyle: {
                    color: 'gray', // 范围文本颜色
                    fontSize: 12, // 文本大小
                    fontFamily: 'Arial'
                },
                backgroundColor: '#f0f0f0', // 滑块背景颜色
                fillerColor: 'rgba(0, 128, 128, 0.2)', // 滑块选中区域颜色
                borderColor: '#d3d3d3', // 滑块边框颜色
                dataBackground: {
                    lineStyle: {
                        color: '#008080', // 数据阴影线颜色
                        width: 1
                    },
                    areaStyle: {
                        color: 'rgba(0, 128, 128, 0.1)' // 数据阴影填充颜色
                    }
                }
            },
            {
                type: 'inside',
                start: 0,
                end: 100
            },
        ],
        series: [
            {
                name: 'Monday',
                type: 'boxplot',
                datasetIndex: 7,
                itemStyle: {
                    borderWidth: 2,  // 这里设置边框的宽度
                },
                tooltip: {
                    formatter: function (params) {
                        let data = params.data;
                        if (Array.isArray(data)) {
                            return `Min: ${data[1].toFixed(2)}<br/>Q1: ${data[2].toFixed(2)}<br/>Median: ${data[3].toFixed(2)}<br/>Q3: ${data[4].toFixed(2)}<br/>Max: ${data[5].toFixed(2)}`;
                        }
                        return data;
                    }
                }
            },
            {
                name: 'TuesDay',
                type: 'boxplot',
                datasetIndex: 8,
                itemStyle: {
                    borderWidth: 2,  // 这里设置边框的宽度
                },
                tooltip: {
                    formatter: function (params) {
                        let data = params.data;
                        if (Array.isArray(data)) {
                            return `Min: ${data[1].toFixed(2)}<br/>Q1: ${data[2].toFixed(2)}<br/>Median: ${data[3].toFixed(2)}<br/>Q3: ${data[4].toFixed(2)}<br/>Max: ${data[5].toFixed(2)}`;
                        }
                        return data;
                    }
                }
            },
            {
                name: 'Wednesday',
                type: 'boxplot',
                datasetIndex: 9,
                itemStyle: {
                    borderWidth: 2,  // 这里设置边框的宽度
                },
                tooltip: {
                    formatter: function (params) {
                        let data = params.data;
                        if (Array.isArray(data)) {
                            return `Min: ${data[1].toFixed(2)}<br/>Q1: ${data[2].toFixed(2)}<br/>Median: ${data[3].toFixed(2)}<br/>Q3: ${data[4].toFixed(2)}<br/>Max: ${data[5].toFixed(2)}`;
                        }
                        return data;
                    }
                }
            },
            {
                name: 'Thursday',
                type: 'boxplot',
                datasetIndex: 10,
                itemStyle: {
                    borderWidth: 2,  // 这里设置边框的宽度
                },
                tooltip: {
                    formatter: function (params) {
                        let data = params.data;
                        if (Array.isArray(data)) {
                            return `Min: ${data[1].toFixed(2)}<br/>Q1: ${data[2].toFixed(2)}<br/>Median: ${data[3].toFixed(2)}<br/>Q3: ${data[4].toFixed(2)}<br/>Max: ${data[5].toFixed(2)}`;
                        }
                        return data;
                    }
                }
            },
            {
                name: 'Friday',
                type: 'boxplot',
                datasetIndex: 11,
                itemStyle: {
                    borderWidth: 2,  // 这里设置边框的宽度
                },
                tooltip: {
                    formatter: function (params) {
                        let data = params.data;
                        if (Array.isArray(data)) {
                            return `Min: ${data[1].toFixed(2)}<br/>Q1: ${data[2].toFixed(2)}<br/>Median: ${data[3].toFixed(2)}<br/>Q3: ${data[4].toFixed(2)}<br/>Max: ${data[5].toFixed(2)}`;
                        }
                        return data;
                    }
                }
            },
            {
                name: 'Saturday',
                type: 'boxplot',
                datasetIndex: 12,
                itemStyle: {
                    borderWidth: 2,  // 这里设置边框的宽度
                },
                tooltip: {
                    formatter: function (params) {
                        let data = params.data;
                        if (Array.isArray(data)) {
                            return `Min: ${data[1].toFixed(2)}<br/>Q1: ${data[2].toFixed(2)}<br/>Median: ${data[3].toFixed(2)}<br/>Q3: ${data[4].toFixed(2)}<br/>Max: ${data[5].toFixed(2)}`;
                        }
                        return data;
                    }
                }
            }
            ,
            {
                name: 'Sunday',
                type: 'boxplot',
                datasetIndex: 13,
                itemStyle: {
                    borderWidth: 2,  // 这里设置边框的宽度
                },
                tooltip: {
                    formatter: function (params) {
                        let data = params.data;
                        if (Array.isArray(data)) {
                            return `Min: ${data[1].toFixed(2)}<br/>Q1: ${data[2].toFixed(2)}<br/>Median: ${data[3].toFixed(2)}<br/>Q3: ${data[4].toFixed(2)}<br/>Max: ${data[5].toFixed(2)}`;
                        }
                        return data;
                    }
                }
            }
        ]
    }

    option && myChart.setOption(option);
}

drawBoxChart();
