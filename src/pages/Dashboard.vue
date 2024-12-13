<template>
	<div>

		<el-container>
			<el-main class="num">
				<el-row :gutter="10">
					<el-col :span="8">
						<el-card shadow="hover" style="background-color: #de2e2e;">
							<div>
								<p v-if="studentCount">{{ studentCount }}人</p>
								<p v-else>0人</p>
								<span>在库学生总人数</span>
							</div>
						</el-card>
					</el-col>

					<el-col :span="8">
						<el-card shadow="hover" style="background-color: orangered;">
							<div>
								<p v-if="majorCount">{{ majorCount }}个</p>
								<p v-else>0个</p>
								<span>在库本科专业种类数</span>
							</div>
						</el-card>
					</el-col>

					<el-col :span="8">
						<el-card shadow="hover" style="background-color: dimgrey;">
							<div>
								<p v-if="classCount">{{ classCount }}个</p>
								<p v-else>0个</p>
								<span>在库班级总数</span>
							</div>
						</el-card>
					</el-col>
				</el-row>
			</el-main>
		</el-container>
		<el-container>
			<el-main style="position: relative;" class="chart1">
				<el-tag type="info" effect="dark">学生概览</el-tag>

				<el-tabs v-model="activeName" @tab-click="stuOverView">
					<el-tab-pane label="性别统计" name="sexconunt">

						<div id="sexchart" class="charts" style="width: 600px;height: 350px;">

						</div>
					</el-tab-pane>
					<el-tab-pane label="民族分布" name="nationcount">
						<div id="nationchart" class="charts" style="width: 600px;height: 350px;">

						</div>
					</el-tab-pane>
					<!-- <el-tab-pane label="年级人数统计" name="gradecount">
						<div id="gradecountchart" class="charts" style="width: 600px;height: 350px;">

						</div>
					</el-tab-pane> -->
					<el-tab-pane label="政治面貌分布" name="politicalstatus">
						<div id="politicalstatuschart" class="charts" style="width: 600px;height: 350px;">
						</div>
					</el-tab-pane>
				</el-tabs>
			</el-main>
			<el-main class="chart2">
				<el-tag type="info" effect="dark">在校教师数量</el-tag>
				<el-tabs v-model="tea_activename">
					<el-tab-pane label="年级分布" name="tea_grade_conunt">
						<div id="tea_grade_chart" class="charts" style="width: 600px;height: 350px;">

						</div>
					</el-tab-pane>
				</el-tabs>
			</el-main>
		</el-container>
		<el-container>
			<el-main class="chart3">
				<el-tag type="info" effect="dark" style="margin-bottom:10px">生源地图</el-tag>
				<div id="stuMap" class="charts" style="width: 600px;height: 350px;"></div>
			</el-main>
			<el-main class="chart4">
				<el-tag type="info" effect="dark" style="margin-bottom:10px">出勤率</el-tag>
				<div id="attendence" class="charts" style="width: 600px;height: 350px;"></div>
			</el-main>
		</el-container>
		<el-container>
			<el-main class="chart5" style="height: 80px;line-height: 40px;color: #000;font-weight: 800;">
				统计数据已排除空白数据和无效数据
			</el-main>
		</el-container>
	</div>
</template>

<script>
export default {
	name: "dashboard",
	data() {
		return {
			majorCount: "",
			studentCount: "",
			classCount: "",
			boardlist: [],
			activeName: 'sexconunt',
			tea_activename: 'tea_grade_conunt',

			value: '',
			gradelist: ['全学院'],
			nationseries: [],
			gradeStuSeries: []
		}
	},
	methods: {
		stuOverView(tab, event) {
			// console.log(tab, event);

			switch (tab.name) {
				case "sexconunt":
					this.changeSexChart(0);
					break;
				case "nationcount":
					this.drawNationChart();
					break;
				case "gradecount":
					this.drawGradeNumChart();
					break;
				case "politicalstatus":
					this.drawPoliticalStatusChart();
					break;
			}


			// console.log(tab.name);
		},
		getLastSevenDays() {
			const days = [];
			const today = new Date(); // 获取今天的日期

			for (let i = 0; i < 7; i++) {
				// 复制日期对象，避免修改原日期
				const date = new Date(today);
				date.setDate(today.getDate() - i); // 设置为前 i 天
				// 格式化日期为 "YYYY-MM-DD" 格式
				const formattedDate = date.toISOString().split('T')[0];
				days.push(formattedDate);
			}

			return days.reverse(); // 按从过去到今天的顺序返回
		},
		autoopen(title1, msg) {
			const h = this.$createElement;

			this.$notify({
				title: title1,
				message: h('i', {
					style: 'color: red'
				}, msg)
			});
		},

		changeSexChart(year) {
			this.drawSexChart(year);
		},
		//性别图表
		drawSexChart(title1) {

			let bnum = this.countOccurrences(this.boardlist, "sex", 'M');
			let gnum = this.countOccurrences(this.boardlist, "sex", 'F');

			let myChart = this.$echarts.init(document.getElementById("sexchart"));

			// 指定图表的配置项和数据
			let option = {
				tooltip: {
					trigger: 'item',
					formatter: '{a} <br/>{b}: {c} ({d}%)'
				},
				title: {
					text: title1 + '级性别比例',
					x: 'center'
				},
				legend: {
					orient: 'vertical',
					left: 10,
					data: ['男', '女']
				},
				series: [{
					name: title1 + '级性别比例',
					type: 'pie',
					radius: ['50%', '70%'],
					avoidLabelOverlap: false,
					label: {
						normal: {
							show: false,
							position: 'center'
						},
						emphasis: {
							show: true,
							textStyle: {
								fontSize: '30',
								fontWeight: 'bold'
							}
						}
					},
					labelLine: {
						normal: {
							show: false
						}
					},
					data: [{
						value: bnum,
						name: '男'
					},
					{
						value: gnum,
						name: '女'
					}
					]
				}]
			};
			// 使用刚指定的配置项和数据显示图表。
			myChart.setOption(option);

		},

		/**
		 *	民族图表
		 */
		drawNationChart() {
			let myChart = this.$echarts.init(document.getElementById("nationchart"));



			// 统计民族分布
			let nationCounts = {};
			this.boardlist.forEach(item => {
				let nation = item.MZ;
				if (nation) {
					nationCounts[nation] = (nationCounts[nation] || 0) + 1;
				}
			});

			// 构造数据格式
			let legendData = Object.keys(nationCounts); // 民族名称
			let seriesData = legendData.map(nation => ({
				name: nation,
				value: nationCounts[nation]
			}));

			let option = {
				tooltip: {
					trigger: 'item',
					formatter: '{a} <br/>{b}: {c} ({d}%)'
				},
				title: {
					top: 5,
					left: 'center',
					text: '民族分布',
					borderRadius: [5, 5, 0, 0]
				},
				legend: {
					data: legendData,
					selectedMode: 'single',
					bottom: 0,
					itemGap: 2,
					type: 'scroll' // 设置 legend 滚动轴的出现
				},
				series: [
					{
						name: '民族分布',
						type: 'pie',
						radius: '50%',
						data: seriesData,
						emphasis: {
							itemStyle: {
								shadowBlur: 10,
								shadowOffsetX: 0,
								shadowColor: 'rgba(0, 0, 0, 0.5)'
							}
						}
					}
				]
			};

			myChart.setOption(option);
		},
		/**
		 * 政治面貌统计
		 */
		drawPoliticalStatusChart1() {
			let myChart = this.$echarts.init(document.getElementById("politicalstatuschart"));
			let option = {
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'shadow'
					}
				},
				legend: {
					type: 'scroll',// 设置legend滚动轴的出现
					data: ['党员', '共青团员', '积极分子', '群众', '预备党员']
				},
				grid: {
					left: '3%',
					right: '4%',
					bottom: '3%',
					containLabel: true
				},
				xAxis: {
					type: 'value'
				},
				yAxis: {
					type: 'category',
					data: Object.keys(datalist)
				},
				series: psseries
			};
			myChart.setOption(option);
		},
		drawPoliticalStatusChart() {


			// 统计政治面貌数据
			let politicalStatusCounts = {};
			this.boardlist.forEach(item => {
				let status = item.ZZMM; // 政治面貌
				if (status) {
					politicalStatusCounts[status] = (politicalStatusCounts[status] || 0) + 1;
				}
			});

			// 构造 ECharts 数据
			let categories = Object.keys(politicalStatusCounts); // 政治面貌类别
			let dataValues = categories.map(status => politicalStatusCounts[status]); // 每个类别的数量

			// 构造 option
			let myChart = this.$echarts.init(document.getElementById("politicalstatuschart"));
			let option = {
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'shadow'
					}
				},
				title: {
					text: '政治面貌分布',
					left: 'center'
				},
				legend: {
					type: 'scroll', // 设置 legend 滚动轴的出现
					data: categories
				},
				grid: {
					left: '3%',
					right: '4%',
					bottom: '3%',
					containLabel: true
				},
				xAxis: {
					type: 'value',
					name: '人数',
					nameLocation: 'end'
				},
				yAxis: {
					type: 'category',
					data: categories // 设置 Y 轴类别为政治面貌
				},
				series: [
					{
						name: '政治面貌',
						type: 'bar',
						data: dataValues, // 对应政治面貌数量
						itemStyle: {
							color: '#5470c6'
						}
					}
				]
			};

			myChart.setOption(option);
		},
		geyYear() {
			const year = []
			const y = new Date()
			for (let i = 0; i < 5; i++) {
				let temp = y.getFullYear() - i;
				year.push(temp)
			}
			return year
		},
		/**
		 * 教师年级分布  //TODO 无数据，静态数据演示图
		 */
		drawTeacherGradeChart() {
			//TODO
			let myChart = this.$echarts.init(document.getElementById("tea_grade_chart"));
			let option = {
				tooltip: {
					trigger: 'item',
					formatter: '{a} <br/>{b} : {c} ({d}%)'
				},
				title: {
					text: "在库教师数量(模拟数据)",
					left: "center"
				},
				legend: {
					type: 'scroll',
					orient: 'vertical',
					right: 10,
					top: 20,
					bottom: 20,
					data: this.geyYear()
				},
				series: [{
					name: '在校教师数量',
					type: 'pie',
					radius: '70%',
					center: ['40%', '50%'],
					data: [{
						value: 30,
						name: '2020'
					},
					{
						value: 40,
						name: '2021'
					},
					{
						value: 50,
						name: '2022'
					},
					{
						value: 60,
						name: '2023'
					},
					{
						value: 70,
						name: '2024'
					}
					],
					emphasis: {
						itemStyle: {
							shadowBlur: 10,
							shadowOffsetX: 0,
							shadowColor: 'rgba(0, 0, 0, 0.5)'
						}
					}
				}]
			};
			myChart.setOption(option);
		},

		/**
		 * 	生源地图
		 */
		
		dramStuMap() {
			// 城市与省份映射表
			let regionMap = {
				"北京": "北京",
				"上海": "上海",
				"广州": "广东",
				"深圳": "广东",
				"杭州": "浙江",
				"南京": "江苏",
				"苏州": "江苏",
				"无锡": "江苏",
				"成都": "四川",
				"重庆": "重庆",
				"天津": "天津",
				"武汉": "湖北",
				"长沙": "湖南",
				"西安": "陕西",
				"郑州": "河南",
				"沈阳": "辽宁",
				"大连": "辽宁",
				"青岛": "山东",
				"济南": "山东",
				"福州": "福建",
				"厦门": "福建",
				"昆明": "云南",
				"南昌": "江西",
				"合肥": "安徽",
				"南宁": "广西",
				"哈尔滨": "黑龙江",
				"长春": "吉林",
				"贵阳": "贵州",
				"兰州": "甘肃",
				"太原": "山西",
				"呼和浩特": "内蒙古",
				"海口": "海南",
				"拉萨": "西藏",
				"银川": "宁夏",
				"乌鲁木齐": "新疆"
			};

			// 统计每个地区的学生人数
			let regionCount = {};
			this.boardlist.forEach(item => {
				let region = regionMap[item.JG] || item.JG; // 映射城市到省份
				if (region) {
					regionCount[region] = (regionCount[region] || 0) + 1;
				}
			});

			// 转化为 ECharts 数据格式
			let addrData = Object.keys(regionCount).map(region => ({
				name: region,
				value: regionCount[region]
			}));

			console.log("Processed addrData:", addrData); // 调试输出数据

			// 初始化 ECharts
			let myChart = this.$echarts.init(document.getElementById("stuMap"));

			// 配置 ECharts 选项
			let option = {
				tooltip: {
					trigger: 'item',
					formatter: '{b}: {c}人' // 格式化提示信息
				},
				legend: {
					orient: 'vertical',
					left: 'left',
					data: ['全学院'],
					type: 'scroll'
				},
				visualMap: {
					type: 'piecewise', // 类型为分段型
					top: "bottom",
					right: 10,
					splitNumber: 6,
					itemWidth: 20,
					itemGap: 2,
					pieces: [
						{ gte: 500, label: '500人以上', color: '#c1484e' },
						{ gte: 300, lte: 499, label: '300-499人', color: '#d57b6e' },
						{ gte: 100, lte: 299, label: '100-299人', color: '#df836e' },
						{ gte: 10, lte: 99, label: '10-99人', color: '#df9a7e' },
						{ lte: 9, label: '1-9人', color: '#f5eda5' },
					],
					textStyle: {
						color: '#737373'
					}
				},
				toolbox: {
					show: true,
					orient: 'vertical',
					left: 'right',
					top: 'center',
					feature: {
						mark: { show: true },
						dataView: { show: true, readOnly: false },
						restore: { show: true },
						saveAsImage: { show: true }
					}
				},
				series: [
					{
						name: '全学院',
						type: 'map',
						mapType: 'china',
						roam: false,
						zoom: 1.2,
						label: {
							show: true,
							formatter: '{b}' // 仅显示省份名称
						},
						data: addrData
					}
				]
			};

			// 设置选项
			myChart.setOption(option);
		},
		/**
		 * 到勤率折线图
		 * 暂无数据，仅演示
		 */
		drawAttendChart() {
			//TODO
			let myChart = this.$echarts.init(document.getElementById("attendence"));
			let option = {
				title: {
					text: '近7天学院到勤率(演示数据)',
					subtext: '(单位：%)',
					left: 'center'
				},
				xAxis: {
					type: 'category',
					data: this.getLastSevenDays()
				},
				yAxis: {
					type: 'value',
					min: 80,
					max: 100
				},
				tooltip: {
					trigger: 'axis'
				},
				series: [{
					data: [98, 85, 96, 90, 92, 92, 86],
					type: 'line',
					smooth: true
				}]
			};

			myChart.setOption(option);
		},
		async getMajor() {

			const res = await this.$http.get('student/list/?groupByMajor=1')
			if (res.status === 200) {
				this.majorCount = res.data.length
			}
		},
		async getStudentCount() {

			const res = await this.$http.get('student/list/')
			if (res.status === 200) {
				this.studentCount = res.data.count
			}
		},
		async getClassCount() {

			const res = await this.$http.get('student/list/?groupByClassNum=1')
			if (res.status === 200) {
				this.classCount = res.data.length
			}
		},
		countOccurrences(arr, key, value) {
			if (!Array.isArray(arr)) {
				throw new Error("传入的值必须是数组");
			}

			return arr.reduce((count, obj) => {
				if (obj[key] === value) {
					count++;
				}
				return count;
			}, 0);
		},
		async getBoradList() {
			await this.$http.get("student/list/?page_size=114514")
				.then(({
					data
				}) => {
					this.boardlist = data.results;
					//性别图表显示
					this.changeSexChart('2024');
					this.drawNationChart()
					this.dramStuMap();
				})
				.catch(err => {
					console.log(err);
					this.autoopen('错误', '网络错误,访问超时！');
				});
		}
	},
	mounted() {
		this.getMajor();
		this.getStudentCount()
		this.getClassCount()
		this.getBoradList()
		//数据面板显示

		//教师分布图
		this.drawTeacherGradeChart();
		//生源地图


		this.drawAttendChart();

	}


}
</script>

<style scoped="scoped">
.num,
.el-main {
	margin: 10px;
	background-color: #E9EEF3;
	color: #333;
	text-align: center;
	height: 500px;
	width: 500px;
}

.num {
	height: 210px;

}

.num div {

	height: 165px;
	color: #fff;
}

.num div p {
	font-size: 30px;
}

.num div p>span {
	font-size: 50%;
}

.el-tag {
	text-align: center;
}

.el-select {
	float: right;
	z-index: 10;
}

.charts {
	display: flex;
	margin: auto;
}
</style>
