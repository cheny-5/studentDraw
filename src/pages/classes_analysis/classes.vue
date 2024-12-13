<template>
	<div>
		<el-main class="searchclass">
			<el-form :inline="true" :model="searchform" class="class-form-inline">
				<el-form-item label="年级">
					<el-select v-model="searchform.termYear" placeholder="请选择年级">
						<el-option :label="item" :value="item" v-for="(item, i) in gradelist" :key="i"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="专业">
					<el-select v-model="searchform.major" placeholder="请选择专业">
						<el-option :label="item" :value="item" v-for="(item, i) in majorlist" :key="i"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="班级">
					<el-select v-model="searchform.class_num" placeholder="请选择班级">
						<el-option :label="item" :value="item" v-for="(item, i) in classlist" :key="i"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="onSubmit">查询</el-button>
				</el-form-item>
			</el-form>
		</el-main>
		<el-container class="all">
			<el-main class="all" style="height: auto;width: 400px;">
				<template>
					<el-tabs v-model="activeName" @tab-click="handleClick">
						<el-tab-pane label="概况" name="overview">
							<el-container>
								<el-main>
									<el-row :gutter="8">
										<el-col :span="12">
											<el-card shadow="always">
												<div slot="header" class="clearfix">
													<span>班级总人数</span>
												</div>
												<p style="font-size: 350%;" v-if="searchList.length === 0">无</p>
												<p style="font-size: 350%;" v-else> {{ searchList.length }}</p>

											</el-card>
										</el-col>
										<el-col :span="12">
											<el-card shadow="hover">
												<div slot="header" class="clearfix">
													<span>性别统计</span>
												</div>
												<p style="font-size: 350%;" v-if="searchList.length === 0">无</p>
												<div id="sexcount" v-else style="width: 300px;height: 260px;">性别统计</div>
											</el-card>
										</el-col>
									</el-row>
									<br>
									<el-row :gutter="8">
										<el-col :span="12">
											<el-card shadow="always">
												<div slot="header" class="clearfix">
													<span>民族统计</span>
												</div>
												<p style="font-size: 350%;" v-if="searchList.length === 0">无</p>
												<div id="nationcount" v-else style="width: 300px;height: 260px;">民族统计</div>
											</el-card>
										</el-col>
										<el-col :span="12">
											<el-card shadow="hover">
												<div slot="header" class="clearfix">
													<span>政治面貌</span>
												</div>
												<p style="font-size: 350%;" v-if="searchList.length === 0">无</p>
												<div id="pscount" v-else style="width: 300px;height: 260px;">政治面貌统计</div>
											</el-card>
										</el-col>
									</el-row>
								</el-main>
								<el-main>
									<div id="stuMap" style="width: 500px;height: 350px;"></div>
								</el-main>
							</el-container>
						</el-tab-pane>
						<el-tab-pane label="班级成员" name="members">
							<el-container>
								<el-main>
									<el-table :data="searchList" style="width: 100%" max-height="500">
										<el-table-column fixed prop="studentNo" label="学号" width="150">
										</el-table-column>
										<el-table-column prop="studentName" label="姓名">
										</el-table-column>
										<el-table-column prop="sex" label="性别">
										</el-table-column>
										<el-table-column prop="MZ" label="民族">
										</el-table-column>
										<el-table-column prop="birthday" label="出生日期">
										</el-table-column>
										<el-table-column prop="ZZMM" label="政治面貌">
										</el-table-column>
										<el-table-column prop="address" label="住址">
										</el-table-column>
										<el-table-column prop="phone" label="手机">
										</el-table-column>
										<el-table-column prop="QQ" label="QQ">
										</el-table-column>
										<el-table-column fixed="right" label="操作" width="50">
											<template slot-scope="scope">
												<el-button @click.native.prevent="viewRow(scope.$index, stuList)"
													type="text" size="small">
													描述
												</el-button>
											</template>
										</el-table-column>
									</el-table>

								</el-main>

							</el-container>
							<el-pagination small layout="prev, pager, next" :total="searchList.length">
							</el-pagination>
						</el-tab-pane>
						<el-tab-pane label="成绩" name="score">
							<el-container>
								<el-main>
									<el-table :data="scoreList" style="width: 100%" max-height="500">
										<el-table-column fixed prop="studentno" label="学号" width="150">
										</el-table-column>
										<el-table-column prop="sname" label="姓名">
										</el-table-column>
										<el-table-column prop="cname" label="课程名">
										</el-table-column>
										<el-table-column prop="score" label="分数">
										</el-table-column>
										<el-table-column prop="jd" label="绩点">
										</el-table-column>
										<el-table-column prop="credit" label="总绩点">
										</el-table-column>
									</el-table>
									<el-pagination small layout="prev, pager, next" :total="scoreList.length">
									</el-pagination>
								</el-main>

							</el-container>

						</el-tab-pane>

					</el-tabs>
				</template>
			</el-main>
		</el-container>
	</div>
</template>

<script>
export default {
	data() {
		return {
			searchform: {
				termYear: '',
				class_num: '',
				major: ''
			},

			gradelist: [],
			majorlist: [],
			classlist: [],
			allStudent: [],
			activeName: 'overview',
			searchList: [],
			scoreList: []
		}
	},
	methods: {
		async onSubmit() {
			const res = await this.$http.get(`student/list/?termYear=${this.searchform.termYear}&class_num=${this.searchform.class_num}&major=${this.searchform.major}`)
			if (res.status === 200 && res.data.results.length > 0) {
				this.searchList = res.data.results;

				for (let i = 0; i < this.searchList.length; i++) {
					// "http://192.168.31.212:8000/student/personknowledge/?page=2&studentNo=202201001",
					const res1 = await this.$http.get(`student/personknowledge/?studentno=${this.searchList[i].studentNo}`)
					if (res1.status === 200 && res1.data.results.length > 0) {
						for (let j = 0; j < res1.data.results.length; j++) {
							this.scoreList.push(res1.data.results[j]);

						}
					}

				}
				this.$nextTick(() => {
					this.drawSexCount();
					this.drawNationCount();
					this.drawPsCount();
					this.drawMap(this.searchList)
				});
			} else {
				this.searchList = [];
				this.drawMap(this.searchList)
			}

		},
		handleClick(tab, event) {

		},
		/**
		 * @param {Object} index
		 * @param {Object} rows
		 * 跳转学生画像
		 */
		viewRow(index, rows) {
			let newWindow = window.open("_blank");
			let sno = rows[index]["sno"];
			newWindow.location = "/#/analysis/personal?sno=" + sno;
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
		drawSexCount() {
			let myChart = this.$echarts.init(document.getElementById("sexcount"));
			let option = {
				tooltip: {
					trigger: 'item',
					formatter: '{a} <br/>{b} : {c} ({d}%)'
				},

				series: [{
					name: '性别比例',
					type: 'pie',
					radius: '60%',
					center: ['45%', '35%'],
					data: [{
						value: this.searchList.length > 0 ? this.countOccurrences(this.searchList, 'sex', 'M') : 0,
						name: '男'
					},
					{
						value: this.searchList.length > 0 ? this.countOccurrences(this.searchList, 'sex', 'F') : 0,
						name: '女'
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
		drawNationCount() {
			let myChart = this.$echarts.init(document.getElementById("nationcount"));
			let option = {
				tooltip: {
					trigger: 'item',
					formatter: '{a} <br/>{b} : {c} ({d}%)'
				},

				series: [{
					name: '民族比例',
					type: 'pie',
					radius: '60%',
					center: ['45%', '35%'],
					data: [{
						value: this.searchList.length > 0 ? this.countOccurrences(this.searchList, 'MZ', '汉族') : 0,
						name: '汉族'
					},
					{
						value: this.searchList.length - this.countOccurrences(this.searchList, 'MZ', '汉族'),
						name: '其他民族'
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
		drawPsCount() {
			let myChart = this.$echarts.init(document.getElementById("pscount"));
			let option = {
				tooltip: {
					trigger: 'item',
					formatter: '{a} <br/>{b} : {c} ({d}%)'
				},

				series: [{
					name: '政治面貌',
					type: 'pie',
					radius: '60%',
					center: ['45%', '35%'],
					data: [{
						value: this.searchList.length > 0 ? this.countOccurrences(this.searchList, 'ZZMM', '团员') : 0,
						name: '团员'
					},
					{
						value: this.searchList.length > 0 ? this.countOccurrences(this.searchList, 'ZZMM', '党员') : 0,
						name: '党员'
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
		autoopen(title1, msg) {
			const h = this.$createElement;

			this.$notify({
				title: title1,
				message: h('i', {
					style: 'color: red'
				}, msg)
			});
		},
		drawMap(students) {
			this.$nextTick(() => {
				let myChart = this.$echarts.init(document.getElementById("stuMap"));
				// 统计每个城市的学生数量
				let mapData = [];
				if (students.length > 0) {
					const cityCounts = students.reduce((acc, student) => {
						const city = student.JG;
						acc[city] = (acc[city] || 0) + 1;
						return acc;
					}, {});
					// 转换为地图需要的格式
					mapData = Object.keys(cityCounts).map(city => ({
						name: city,
						value: cityCounts[city]
					}));
				}


				let option = {
					title: {
						text: "学生分布",
						left: "left"
					},
					tooltip: {
						trigger: 'item'
					},
					legend: {
						orient: 'vertical',
						left: 'left',
					},
					visualMap: {
						min: 0,
						max: 2000,
						left: 'left',
						top: 'bottom',
						text: ['高', '低'], // 文本，默认为数值文本
						calculable: true
					},
					toolbox: {
						show: true,
						orient: 'vertical',
						left: 'right',
						top: 'center',
						feature: {
							mark: {
								show: true
							},
							dataView: {
								show: true,
								readOnly: false
							},
							restore: {
								show: true
							},
							saveAsImage: {
								show: true
							}
						}
					},
					series: [{
						type: 'map',
						mapType: 'china',
						roam: false,
						label: {
							normal: {
								show: false
							},
							emphasis: {
								show: true
							}
						},
						data: mapData
					}]
				};

				myChart.setOption(option);
			})
		},
		async getList() {
			try {
				let res = await this.$http.get('student/list/');
				this.allStudent = res.data.results;

				// 使用 Set 自动去重
				this.gradelist = Array.from(new Set(this.allStudent.map(item => item.termYear)));
				// this.majorlist = this.allStudent.map(item => item.major); // 如果需要去重，也可以使用 Set
				// this.classlist = this.allStudent.map(item => item.class_num); // 同上
			} catch (error) {
				console.error('获取学生列表失败:', error);
			}
		},
		async getMajor() {

			const res = await this.$http.get('student/list/?groupByMajor=1')
			if (res.status === 200) {
				console.log(res)
				this.majorlist = res.data
			}
		},
		async getClassCount() {

			const res = await this.$http.get('student/list/?groupByClassNum=1')
			if (res.status === 200) {
				this.classlist = res.data
			}
		},
	},
	mounted() {
		this.getMajor()
		this.getClassCount()
		this.drawMap([]);
		this.getList()
	}
}
</script>

<style scoped="scoped">
.searchclass {
	margin: 10px;
	background-color: #E9EEF3;
	color: #333;
	text-align: center;
	height: 500px;

}

.all {
	margin: 10px;
	background-color: #E9EEF3;
	color: #333;
	text-align: center;
	min-height: 500px;
}

.searchclass {
	height: 80px;
	background-color: #E9EEF3;
	padding: 0;
}

.class-form-inline {
	margin-top: 18px;
}

.el-card {
	width: 300px;
	height: 300px;
	padding: 0;
}
</style>
