import Vue from 'vue'

Vue.filter('dictSex', function(value) {
    switch(value){
        case '0':
            return '男';
        case '1':
            return '女';
        case '2':
            return '保密';
        default:
            return ''
    }
})

Vue.filter('dictIdType', function(value) {
    switch(value){
        case '01':
            return '身份证';
        case '99':
            return '其他';
        default:
            return ''
    }
})

Vue.filter('dictInsuranceType', function(value) {
    switch(value){
        case 'D1':
            return '华泰境内"慧程天下"旅游意外险-经典版(成年人)';
        case 'D2':
            return '华泰境内"慧程天下"旅游意外险-经典版(未成年人)';
        case 'D3':
            return '华泰境内"慧程天下"旅游意外险-基础版(成年人)';
        case 'D4':
            return '华泰境内"慧程天下"旅游意外险-基础版(未成年人)';
        default:
            return ''
    }
})