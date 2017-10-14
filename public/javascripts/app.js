const app = new Vue({
  el: '#app',
  data: {
    items: [ ]
  },
  methods: {
    loadData () {
      axios.get('/api/v1/server').then((response) => {
        console.log(response.data)
        this.items = response.data
      }).catch((error) => { console.log(error) })
    }
  },
  mounted () {
    this.loadData()

    setInterval(function () {
      this.loadData()
    }.bind(this), 60000)
  }
})
