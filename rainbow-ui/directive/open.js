export default {
  bind(el, bind) {
    if (!bind.value) return
    // if ((typeof bind.value) == 'string')
    switch (typeof bind.value) {
      case 'string':
        el.onclick = () => {
          window.open(bind.value)
        }
        return;
      case 'object':
        const { path, query } = bind.value;
        const href = this.$router.resolve({ path, query }).href
        window.open(href, '_blank')
        return;
    }
  }
}