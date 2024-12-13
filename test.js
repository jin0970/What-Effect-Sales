let index = 0;
let year = 14;
let data = [];
let timer = null;
const chart = document.getElementById('chart');
const colors = [
    "#D980FA", "#FDA7DF", "#ff7675", "#fab1a0", "#ffbe76",
    "#EAB543", "#b8e994", "#78e08f", "#38ada9", "#60a3bc",
    "#6a89cc", "#9980FA"
];
const categories = [
    "Fish", "Milkshake", "Portions", "Ice_Cream", "Kids_Meal",
    "Burger", "Other", "Chicken", "Beverage", "Fries", "Pizza", "Combo_Meal",
];
let svgLine;

async function getData() {
    const data_source = await d3.json("./ws.json");
    return data_source;
}

async function drawStackChart() {
    const data_source = await getData(); // 获取数据源
    let data = data_source.slice(index, index + year); // 切割数据
    // console.log(data);  // 打印数据，确认数据是否正

    const parseDate = d3.timeParse("%Y-%m-%d");
    const date = d => parseDate(d['date']);

    let dimensions = {
        width: chart.clientWidth * 0.8,  // 使用clientWidth而不是width
        height: chart.clientHeight * 0.7,
        margin: {
            top: 30, right: 50, bottom: 50, left: 20
        }
    }

    dimensions.boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right;
    dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

    const stackData = d3.stack()
        .keys(categories)
        (data.map(d => ({
            date: d.date,
            ...categories.reduce((obj, key) => {
                obj[key] = d[key];
                return obj;
            }, {})
        })));

    const x = d3.scaleTime().domain(d3.extent(data, date))
        .range([dimensions.margin.left, dimensions.width - dimensions.margin.right]);

    const y = d3.scaleLinear()
        .domain([0, d3.max(stackData, d => d3.max(d, d => d[1]))])
        .rangeRound([dimensions.height - dimensions.margin.bottom, dimensions.margin.top]);

    const color = d3.scaleOrdinal()
        .domain(stackData.map(d => d.key))
        .range(colors);

    const area = d3.area()
        .x(d => x(parseDate(d.data['date'])))
        .y0(d => y(d[0]))
        .y1(d => y(d[1]));

    // 创建SVG容器
    const svg = d3.create("svg")
        .attr("id", 'chartSvg')
        .attr('margin-left', '100')
        .attr("width", dimensions.width - 200)
        .attr("height", dimensions.height - 100)
        .attr("viewBox", [0, 0, dimensions.width, dimensions.height])
        .style('position', 'absolute')
        .style('left', '100')
        .style('bottom', '100');
    // 添加透明背景
    svg.append("rect")
        .attr("width", dimensions.width - 200)
        .attr("height", dimensions.height - 100)
        .attr("fill", "transparent"); // 确保鼠标事件有效

    svg.append("g")
        .attr("transform", `translate(${dimensions.margin.left},0)`)
        .style("font-size", "10px")
        .style('font-family', 'fantasy')
        .style('color', 'gray')
        .call(d3.axisLeft(y).ticks(dimensions.height / 80))
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line").clone()
            .attr("x2", dimensions.width - dimensions.margin.left - dimensions.margin.right)
            .attr("stroke-opacity", 0.8))
        .call(g => g.append("text")
            .attr("x", -dimensions.margin.left)
            .attr("y", 20)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .style('color', 'gray')
            .style("font-size", "16px")
            .style('font-family', 'fantasy')
            .text(`↑ SALES`));

    if (!d3.select('.tooltip')) {
        // 创建自定义的 tooltip 元素
        const tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("position", "absolute")
            .style("visibility", "hidden")
            .style("background-color", "rgba(0,0,0,0.75)")  // 背景颜色
            .style("color", "#fff")  // 字体颜色
            .style("padding", "5px")  // 内边距
            .style("border-radius", "5px")  // 边框圆角
            .style("font-size", "12px");  // 字体大小

    }
// 添加 path 元素并为其设置 tooltip
    svg.append("g")
        .selectAll()
        .data(stackData)
        .join("path")
        .attr('stroke-width', '3')
        .attr("stroke", d => color(d.key))
        .attr("fill", d => color(d.key))
        .attr("fill-opacity", 0.1)
        .attr("d", area);

    svg.append("g")
        .attr("transform", `translate(0,${dimensions.height - dimensions.margin.bottom})`)
        .call(d3.axisBottom(x).tickSizeOuter(0))
        .call(g => g.selectAll(".tick text")
            .attr("text-anchor", "middle")
            .text(d => d3.timeFormat("%Y-%m-%d")(d))
            .attr("transform", "rotate(-30)")
            .attr("dx", "-1.5em")
            .attr("dy", "1em"))
        .on("mouseover", (event, d) => {
            const target = event.target; // 获取鼠标悬停的目标文本元素
            const rect = target.getBoundingClientRect(); // 获取文本元素的矩形信息
            const xPos = rect.left - dimensions.margin.left; // 计算出文本元素的中心 X 坐标

            console.log("Text element position:", xPos);

            // 获取 SVG 容器
            const svg = d3.select("#chartSvg");

            // 如果之前已经绘制了竖线，先删除
            svg.selectAll(".highlight-line").remove();
            // 查找日期匹配的对象
            const targetObject = data_source.find(d => d.date === event.target.innerHTML);
            if (!targetObject) return;
            // 绘制白色竖线
            // svg.append("line")
            //     .attr("class", "highlight-line")
            //     .attr("x1", xPos+1.5) // 起点 X 坐标
            //     .attr("x2", xPos+1.5) // 终点 X 坐标
            //     .attr("y1", dimensions.margin.top) // 起点 Y 坐标
            //     .attr("y2", svg.node().getBoundingClientRect().height - dimensions.margin.bottom) // 终点 Y 坐标，整个 SVG 高度
            //     .attr("stroke", "white")
            //     .attr("stroke-width", 3);

            // console.log("Clicked on:", d);
            // console.log("Clicked on:", event.target);
            event.target.style = "cursor:pointer;font-size:14px;color:#000;transform:rotate(0) translateX(10);";
            // console.log(event.target.innerHTML);


            // console.log(targetObject);

            // 将 targetObject 的内容展示到指定的 div 中
            const infoDisplay = document.querySelector('.tools ul');
            if (targetObject) {
                infoDisplay.innerHTML = `
                <li style="color: #9980FA;"><span style="background-color: #fff;"></span>Combo_Meal&nbsp;${targetObject['Combo_Meal']}</li>
                <li style="color: #6a89cc;"><span style="background-color: #fff;"></span>Pizza&nbsp;${targetObject['Pizza']}</li>
                <li style="color: #60a3bc;"><span style="background-color: #fff;"></span>Fries&nbsp;${targetObject['Fries']}</li>
                <li style="color: #38ada9;"><span style="background-color: #fff;"></span>Beverage&nbsp;${targetObject['Beverage']}</li>
                <li style="color: #78e08f;"><span style="background-color: #fff;"></span>Chicken&nbsp;${targetObject['Chicken']}</li>   
                <li style="color: #b8e994;"><span style="background-color: #fff;"></span>Other&nbsp;${targetObject['Other']}</li>    
                <li style="color: #EAB543;"><span style="background-color: #fff;"></span>Burger&nbsp;${targetObject['Burger']}</li>       
                <li style="color: #ffbe76;"><span style="background-color: #fff;"></span>Kids_Meal&nbsp;${targetObject['Kids_Meal']}</li>
                <li style="color: #fab1a0;"><span style="background-color: #fff;"></span>Ice_Cream&nbsp;${targetObject['Ice_Cream']}</li>
                <li style="color: #ff7675;"><span style="background-color: #fff;"></span>Portions&nbsp;${targetObject['Portions']}</li>
                <li style="color: #FDA7DF;"><span style="background-color: #fff;"></span>Milkshake&nbsp;${targetObject['Milkshake']}</li>
                <li style="color: #D980FA;"><span style="background-color: #fff;"></span>Fish&nbsp;${targetObject['Fish']}</li>
                <li style="color: gray; list-style: none">Total_Sale&nbsp;${targetObject['Final_Total']}</li>
                <li style="color: #000; list-style: none">Date&nbsp;${targetObject['date']}</li>
            `;
            }
        })
        .on("mouseleave", () => {
            // svg.selectAll(".highlight-line").remove();
            // 选择所有刻度文本并修改样式
            svg.selectAll(".tick text")
                .style("font-size", "10px")
                .style('color', 'gray');
        })
        .on('mousemove', (event, d) => {
        })
        .call(g => g.append("text")
            .attr("x", dimensions.width - 20)  // 调整箭头的位置
            .attr("y", 20)
            .attr("fill", "currentColor")  // 设置颜色
            .attr("text-anchor", "start")
            .style("font-size", "16px")     // 调整字体大小
            .text("➔ DATE"));


    // 将生成的svg添加到页面中
    const svgs = chart.querySelectorAll('svg');
    svgs.forEach(svg => {
        if(svg.id !== 'tipSvg' && svg.id !== 'jiantouSvg')
            svg.remove();  // Remove each svg element
    });
    chart.insertBefore(svg.node(), chart.firstChild);
}

// 自动播放功能
async function autoPlay() {
    const interval = 1000; // 设定每次更新的时间间隔，单位是毫秒
    const data_source = await getData();  // 获取数据源

    timer = setInterval(() => {
        console.log(index, year)
        index++;
        data = data_source.slice(index, index + year); // 更新数据
        if (index + year > data_source.length) {
            index = 0; // 当达到数据源末尾时重新开始
        }
        // d3.select('svg').clear();
        drawStackChart();  // 重新绘制图表
    }, interval);
}

(async function () {
        await drawStackChart();  // 重新绘制图表
        const startDate = document.getElementById('startDate');
        const period = document.getElementById('period');
        const btn_refresh = document.querySelector('.btn-refresh');
        const btn_start = document.querySelector('.btn-start');
        const btn_stop = document.querySelector('.btn-stop');

        btn_refresh.addEventListener('click', () => {
            const newDate = startDate.value;
            const newPeriod = period.value;
            var start = new Date('2021-05-11');
            var end = new Date(newDate);

            // 计算时间差（以毫秒为单位）
            var timeDifference = end - start;

            // 将时间差转换为天数
            var daysDifference = timeDifference / (1000 * 3600 * 24);
            console.log(newPeriod, newDate, daysDifference);

            index = daysDifference;
            year = Number(newPeriod);
            drawStackChart();  // 重新绘制图表
        })
// 给父元素添加事件监听器
        btn_stop.addEventListener("click", () => {
            console.log(timer)
            if (timer)
            clearInterval(timer);  // 清除定时器，停止自动播放
            timer = null;
        });

        btn_start.addEventListener("click", () => {
            console.log(timer)
            if(timer) return;
            autoPlay();  // 重新启动自动播放
            const infoDisplay = document.querySelector('.tools ul');
            infoDisplay.innerHTML = `
                <li style="color: #9980FA;"><span style="background-color: #fff;"></span>Combo_Meal</li>
                <li style="color: #6a89cc;"><span style="background-color: #fff;"></span>Pizza</li>
                <li style="color: #60a3bc;"><span style="background-color: #fff;"></span>Fries</li>
                <li style="color: #38ada9;"><span style="background-color: #fff;"></span>Beverage</li>
                <li style="color: #78e08f;"><span style="background-color: #fff;"></span>Chicken</li>
                <li style="color: #b8e994;"><span style="background-color: #fff;"></span>Other</li>
                <li style="color: #EAB543;"><span style="background-color: #fff;"></span>Burger</li>
                <li style="color: #ffbe76;"><span style="background-color: #fff;"></span>Kids_Meal</li>
                <li style="color: #fab1a0;"><span style="background-color: #fff;"></span>Ice_Cream</li>
                <li style="color: #ff7675;"><span style="background-color: #fff;"></span>Portions</li>
                <li style="color: #FDA7DF;"><span style="background-color: #fff;"></span>Milkshake</li>
                <li style="color: #D980FA;"><span style="background-color: #fff;"></span>Fish</li>
            `;
        });

        autoPlay();


    }
)();
