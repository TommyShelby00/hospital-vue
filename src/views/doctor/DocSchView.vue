<template>
    <div class="main_con">
        <div style="text-align: left;">
            <H2>排班日志</H2>
            <el-divider></el-divider>
        </div>

        <el-calendar>
            <template slot="dateCell" slot-scope="{data}">
                {{ data.day.split('-').slice(1).join('-') }}
                <div style="width:100%;" v-for="item in scheduleData" :key="item.date">
                    <el-tag type="success" v-show="item.date === data.day">
                        排班数{{ item.remind }}
                    </el-tag>
                </div>
            </template>
        </el-calendar>
    </div>
</template>

<script>
import { doctorRequest } from '@/network/gateway';
export default {
    name: "PatrolSchedule",
    components: {},
    data() {
        return {
            value: new Date(),
            scheduleData: [],
        };
    },
    mounted() {
        this.queryDoctor()
    },
    methods: {
        queryDoctor() {
            doctorRequest({
                url: '/schedule/doctor',
                method: 'get',
                params: {
                    id: 1,
                }
            }).then(res => {
                this.scheduleData = res.data.data.resources.map(item => ({
                    date: item.date,
                    remind: item.remind
                }));
                console.log(this.scheduleData)
            })
        }
    },
};
</script>
<style scoped>
.el-calendar-day {
    box-sizing: border-box;
    padding: 5px;
    height: 80px;
}
</style>