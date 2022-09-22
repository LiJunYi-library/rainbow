import test from './test.vue'

// test.name = 'RTest'


const RTest = {
  install: (app: any, options: any) => {
    app.component('RTest', test)
  }
}

export default RTest;