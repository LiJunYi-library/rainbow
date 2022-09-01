

function $open(params) {
  let { path, query } = params;
  const toTaskLog = this.$router.resolve({
    path,
    query,
  });
  window.open(toTaskLog.href, '_blank');
}

export default { $open }


