export default function() {
  return {
    tooltip: {
      formatter: '{a} <br/>{b} : {c}%'
    },
    series: [
      {
        name: '任务统计',
        radius: '90%',
        type: 'gauge',
        title: {
          offsetCenter: [0, '-50%'],
          fontSize: 12
        },
        detail: {
          offsetCenter: [6, '40%'],
          formatter: '{rate|{value}}{precent|%}',
          rich: {
            rate: {
              fontSize: 32
            },
            precent: {
              padding: [6, 0],
              verticalAlign: 'bottom',
              fontSize: 12
            }
          }
        },
        axisLine: {
          lineStyle: {
            width: 10
          }
        },
        splitLine: {
          length: 10
        },
        axisTick: {
          length: 3
        },
        axisLabel: {
          show: false,
          distance: 3
        },
        pointer: {
          show: true,
          length: '70%',
          width: 3
        },
        data: [{ value: 0, name: '' }]
      }
    ]
  }
}
