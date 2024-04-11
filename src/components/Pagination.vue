<template>
    <div>
        <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="props.pageSize"
            layout="total, prev, pager, next, jumper"
            :total="props.total"
            @current-change="handleCurrentChange" />
    </div>
</template>

<script setup>
import { ref } from 'vue'
//props接收父组件传递的数据
const props = defineProps(['total', 'pageSize'])

//emit给父组件传递消息
// const emit = defineEmits(['getCurrentPage'])
const currentPage = ref(1)


const handleCurrentChange = (val) => {
    console.log(`current page: ${val}`)
    // emit('getCurrentPage' , val)
}
</script>

<style></style>