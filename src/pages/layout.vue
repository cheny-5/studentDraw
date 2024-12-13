<template>
	<div>
		<!-- @select="handleSelect" -->
		<el-menu :default-active="activeIndex2" class="el-menu-demo" mode="horizontal" background-color="#222222"
			text-color="#fff" active-text-color="#ffd04b">
			<el-menu-item index="0" style="margin-right: 20px;" @click="link(`/index/dashboard`)"><i
					class="el-icon-s-home"></i>学生画像系统</el-menu-item>
			<!-- <el-submenu index="1" style="float: right;">
				<template slot="title"><i class="el-icon-user-solid"></i>用户</template>
				<el-menu-item index="1-1" style="text-align: center;">退出登录</el-menu-item>
				<el-menu-item index="1-2" style="text-align: center;">返回学生画像系统</el-menu-item>
			</el-submenu> -->
			<el-menu-item index="2" @click="link(`/index/dashboard`)">主页</el-menu-item>
			<el-menu-item index="3" @click="link(`/analysis/personal`)">学生画像</el-menu-item>
			<el-menu-item index="4" @click="link(`/analysis/classes`)">班级画像</el-menu-item>
			<!-- <el-menu-item index="5"  @click="link(`/analysis/teacher`)">教师分析</el-menu-item>
			<el-menu-item index="6" @click="link(`/analysis/group`)">群体分析</el-menu-item> -->
		</el-menu>
		<router-view></router-view>
	</div>
</template>

<script>

export default {
	name: "vlayout",
	data() {
		return {
			activeIndex2: '1'
		}
	},
	methods: {
		link(url) {
			if (this.$route.path !== url) {
				this.$router.push({ path: `${url}` });
			}
		}
	}
}
</script>

<style>
a {
	text-decoration: none;
}
</style>
