let dataset = [];
let index1 = 0;
let year1 = 365;
const circle = document.getElementById("circle");
let nowCategory = 'Final_Total';
let nowColor = 'gray';


async function drawCircleChart() {

    const csvg = document.querySelector('.circleSvg');
    console.log(csvg)
    if (csvg)
        csvg.remove();

    te = document.querySelectorAll('#circle svg')
    console.log(te)
    const dataset_source = await getData(); // 获取数据源
    let dataset = dataset_source.slice(index1, index1 + year1); // 切割数据
    console.log(dataset);  // 打印数据，确认数据是否正

    let dimensions = {
        width: circle.clientHeight * 0.9,  // 使用clientWidth而不是width
        height: circle.clientHeight * 0.9,
        boundedRadius: circle.clientHeight * 0.3,
        innerRadius: circle.clientHeight * 0.15, // Define inner radius for the ring
        margin: {
            top: 120, right: 120, bottom: 120, left: 120
        }
    }

    const parseDate = d3.timeParse("%Y-%m-%d");
    const dateAccessor = d => parseDate(d['date']);
    const salesAccessor = d => d[nowCategory];
    const tempAccessor = d => d['avgtp'];
    const sunAccessor = d => d['sun'];
    const rainAccessor = d => d['rain'];

    const wrapper = d3.select('#circle')
        .append('svg')
        .attr('class','circleSvg')
        .attr('width', dimensions.width)
        .attr('height', dimensions.height);

    const bounds = wrapper.append('g')
        .attr('height', dimensions.height * 0.8)
        .attr('width', dimensions.width * 0.8)
        .style('transform',
            `translate(${dimensions.margin.left + dimensions.boundedRadius}px,
            ${dimensions.margin.top + dimensions.boundedRadius}px)`);

    const angleScale = d3.scaleTime()
        .domain(d3.extent(dataset, dateAccessor))
        .range([0, Math.PI * 2]);
    const months = d3.timeMonth.range(...angleScale.domain());

    const getCoordinatesForAngle = (angle, offset = 1) => [
        Math.cos(angle - Math.PI / 2) * offset,
        Math.sin(angle - Math.PI / 2) * offset
    ];

    const getXFromdatasetPoint = (d,offset=1.4)=>
        getCoordinatesForAngle(angleScale(dateAccessor(d)),offset)[0]*dimensions.boundedRadius;
    const getYFromdatasetPoint = (d,offset=1.4)=>
        getCoordinatesForAngle(angleScale(dateAccessor(d)),offset)[1]*dimensions.boundedRadius;

    const perihperal = bounds.append("g");

    months.forEach(month => {
        const angle = angleScale(month);
        const [x, y] = getCoordinatesForAngle(angle, dimensions.boundedRadius);
        const [lx, ly] = getCoordinatesForAngle(angle + Math.PI / 12, dimensions.boundedRadius * 0.43);
        perihperal.append('line')
            .attr('x1', 0) // 起点 x
            .attr('y1', 0) // 起点 y
            .attr('x2', x).attr('y2', y)
            .attr('class', 'grid-line')
            .attr('z-index1',10);
        perihperal.append('text')
            .attr('x', lx)
            .attr('y', ly)
            .style('transform', `translate(-10px, 0)`)
            .text(d3.timeFormat('%b')(month))
            .attr('z-index1',10)
            .attr('class', 'tick-label');
        perihperal.append('circle')
            .attr('x', 0)
            .attr('y', 0)
            .attr('r', dimensions.boundedRadius * 0.38)
            .attr('z-index1',10)
            .style('fill', 'rgb(245, 245, 220)');
    });

    const radiusScale = d3.scaleLinear()
        .domain(d3.extent(dataset, salesAccessor))
        .range([dimensions.innerRadius, dimensions.boundedRadius])
        .nice();

    const salesTicks = radiusScale.ticks(5); // Define ticks for the ring chart
    salesTicks.forEach(d => {
        perihperal.append('circle')
            .attr('r', radiusScale(d))
            .text('')
            .attr('class', 'grid-line');
    });

    const gridLabels = salesTicks.map(d=>{
        return perihperal.append('text')
            .attr('y',-radiusScale(d)+15)
            .attr('class','tick-label-sale')
            .html(`${d3.format('.0f')(d)}`)
    })
    // 用于生成路径的函数
    const line = d3.lineRadial()
        .angle(d => angleScale(dateAccessor(d)))  // 使用日期的角度
        .radius(d => radiusScale(salesAccessor(d)));  // 使用 salesAccessor 作为半径

    const arc1 = d3.arc()
        .innerRadius(dimensions.boundedRadius)
        .outerRadius(dimensions.boundedRadius + 20);

    const colorScale = d3.scaleLinear()
        .domain(d3.extent(dataset,tempAccessor))  // Adjust this domain based on your dataset range
        .range(["rgba(116, 185, 255,1.0)", "rgba(255, 118, 117,1.0)"]);  // Start and end colors

    bounds.selectAll('path.bg-arc')
        .data(dataset)
        .enter()
        .append('path')
        .attr('class', 'bg-arc')
        .attr('d', d => {
            const angle = angleScale(dateAccessor(d));
            const [x, y] = getCoordinatesForAngle(angle, radiusScale(salesAccessor(d)));
            // Create an arc for each dataset point
            return arc1({startAngle: angle - Math.PI / 365, endAngle: angle + Math.PI / 365}); // Small slice for each dataset point
        })
        .style('fill', d => colorScale(tempAccessor(d)))  // Color based on `avgtmp` value
        .on('mouseover', function(event, d) {
            console.log(event.target)
            tooltip.innerHTML = `
            <span>Date <br> ${d['date']}</span><br>
            <span>Sales<br> ${salesAccessor(d)}</span><br>
            <span>Average_Temperature<br> ${tempAccessor(d)}℃</span><br>
            <span>Sun_Times<br>${sunAccessor(d)}h</span><br>
            <span>Rainfall<br>  ${rainAccessor(d)}mm</span>
                `;
            d3.select(this)
                .transition()
                .duration(200)
                .style('stroke','#fff')
                .style('stroke-width', 5);  // 更改颜色或样式高亮
        })
        .on('mouseout', function(event, d) {
            // 还原背景色
            d3.select(this)
                .transition()
                .duration(200)
                .style('stroke','transparent')
                .style('stroke-width', 0);  // 更改颜色或样式高亮 // 恢复原始颜色
        });

    // 生成并绘制路径
    const path = bounds.append("path")
        .datum(dataset)  // 将数据绑定到路径元素
        .attr("fill", d => `rgba(${d3.rgb(nowColor).r}, ${d3.rgb(nowColor).g}, ${d3.rgb(nowColor).b}, 0.5)`)
        .attr("stroke", `${nowColor}`)
        .attr("stroke-width", 2)
        .attr('z-index1',-1)
        .attr("d", line);  // 使用 line 函数来生成路径

    const sunScale = d3.scaleSqrt()
        .domain(d3.extent(dataset,sunAccessor))
        .range([0,10]);

    const sunGroup = bounds.append("g");
    const sunOffset = 1.15
    const sunDots = sunGroup.selectAll('circle')
        .data(dataset)
        .join('circle')
        .attr('cx', d => getXFromdatasetPoint(d,sunOffset))
        .attr('cy', d => getYFromdatasetPoint(d,sunOffset))
        .attr('r', d => sunScale(sunAccessor(d)))
        .attr('class','cloud-dot')

    const rainScale = d3.scaleSqrt()
        .domain(d3.extent(dataset,rainAccessor))
        .range([0,20]);

    const rainGroup = bounds.append("g");
    const rainOffset = 1.25
    const rainDots = rainGroup.selectAll('circle')
        .data(dataset)
        .join('circle')
        .attr('cx', d => getXFromdatasetPoint(d,rainOffset))
        .attr('cy', d => getYFromdatasetPoint(d,rainOffset))
        .attr('r', d => rainScale(rainAccessor(d)))
        .attr('class','rain-dot')
// Create tooltip container
    const tooltip = document.querySelector('.tooltip-circle');

    // 定义点数据
    const points = [[
        { x: -100, y: -100 },
        { x: -500, y: -500 },
    ],
    [
        { x: -200, y: -100 },
        { x: -550, y: -450 }

    ],
    [
        { x: -346, y: -156 },
        { x: -550, y: -360 }
    ],
    [
        { x: -400, y: -120 },
        { x: -550, y: -270 }
    ],
    [
        { x: -450, y: -100 },
        { x: -550, y: -200 }

    ]];

    let pointsString = [];
    // 将点转换为字符串
    for (let i = 0; i < 5; i++) {
        pointsString = points[i].map(point => `${point.x},${point.y}`).join(' ');
        // 添加折线
        bounds.append("polyline")
            .attr("points", pointsString) // 设置折线路径
            .attr("stroke", "#000")      // 设置线条颜色
            .attr("stroke-width", 1)    // 设置线条宽度
            .attr("fill", "none");      // 设置填充颜色（无填充）
    }



}
drawCircleChart();  // 重新绘制图表

const radioButtons = document.querySelectorAll('input[name="circleSelect"]');
const yearButtons = document.querySelectorAll('input[name="circleYearSelect"]');
radioButtons.forEach((element) => {
    element.addEventListener('click', (event) => {        // 清除其他 radio 的选中状态
        radioButtons.forEach((radio) => {
            radio.checked = false;
        });
        // 设置当前点击的 radio 为选中状态
        element.checked = true;
        console.log(element.checked);
        console.log(event.target.value);
        let i = event.target.value;
        console.log(i)
        if (i !== '12'){
            nowCategory = categories[i];
            nowColor = colors[colors.length - i - 1];
        }else {
            nowCategory = 'Final_Total';
            nowColor = 'gray';
        }
        drawCircleChart();
    })
})


yearButtons.forEach((element) => {
    element.addEventListener('click', (event) => {        // 清除其他 radio 的选中状态
        yearButtons.forEach((radio) => {
            radio.checked = false;
        });
        // 设置当前点击的 radio 为选中状态
        element.checked = true;
        let i = event.target.value;
        index1 = i==='0'?0:i==='1'?365:365*2;
        drawCircleChart();
    })
})


