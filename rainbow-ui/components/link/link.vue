<script>
import { renderSlot, renderScopedSlots } from "../../utils";

export default {
  props: {
    href: String,
    id: [String, Number],
    path: String,
    type: String,
    fill: Boolean,
    underline: { type: Boolean, default: true },
    query: {
      type: [Object, Function],
      default: () => ({}),
    },
    plain: Boolean,
    silent: Boolean,
    /**
     * 1.target="_self"
      内容在当前页面显示。
      2.target="_blank"
      内容在新页面显示。
      3.target=“three”
      内容在对应窗口显示
      4.target="_top"
      在当前窗体打开链接，并替换当前的整个窗体(框架页)，清除所有包含的框架
      5.target="_parent"
      在父窗体中打开链接，在窗口与顶级框架中，等同于_self
     */
    target: {
      type: String,
      default: "_blank",
    },
  },
  data() {
    return {};
  },
  watch: {
    href() {},
    hrefs() {},
  },
  created() {
    // console.log(window.location.origin);
  },
  methods: {},
  render() {
    let className = this.type ? `r-link-${this.type}` : "";
    let cName = "r-link";
    if (this.fill) className = `r-link-${this.type}-fill`;
    if (this.fill) cName = "r-link-fill";

    if (this.plain) className = `r-link-${this.type}-plain`;
    if (this.plain) cName = "r-link-plain";

    let _href = this.href;
    (() => {
      if (!this.path) return;
      let _query = this.query;
      if (this.query instanceof Function) _query = this.query();
      const task = this.$router.resolve({
        path: this.path,
        query: { id: this.id, ..._query },
      });
      // console.log(task);
      _href = task.href;
    })();

    let content = renderSlot.call(this, "default", {}, null, _href);

    let attrs = {};

    let click = () => {
      if (!this.silent) return;
      if (this.target === "_self") {
        let _query = this.query;
        if (this.query instanceof Function) _query = this.query();
        this.$router.push({
          path: this.path,
          query: { id: this.id, ..._query },
        });
        return;
      }
      window.open(_href, this.target);
    };

    return (
      <div class="r-link-a">
        {this.$createElement(
          "a",
          {
            class: `${cName}  ${className}  ${
              this.underline ? "" : "underlineNone"
            } `,
            attrs: {
              href: this.silent ? null : _href,
              target: this.silent ? null : this.target,
            },
            on: {
              click: click,
            },
          },
          [content]
        )}
      </div>
    );
  },
};
</script>
<style  lang="scss">
body {
  --primary-color: #3bd5d2;
  --primary-color-hover: #6beeec;
  --primary-color-visited: #31aaa8;
  --primary-color-plain: #caf8f7;

  --success-color: #7ddd18;
  --success-color-hover: #93ff20;
  --success-color-visited: #67b217;
  --success-color-plain: #f3f9e7;

  --warning-color: #e6a23c;
  --warning-color-hover: #fc9700;
  --warning-color-visited: #ce9339;
  --warning-color-plain: #f4e2c7;

  --danger-color: #f85615;
  --danger-color-hover: #ff4900;
  --danger-color-visited: #e34304;
  --danger-color-plain: #ffe7dc;
}

a.r-link-primary {
  &:link {
    color: var(--primary-color);
  }

  color: var(--primary-color);

  &:visited {
    color: var(--primary-color-visited);
  }

  &:hover {
    color: var(--primary-color-hover);
  }
}

a.r-link-primary-fill {
  background-color: var(--primary-color);
  &:link {
    background-color: var(--primary-color);
  }

  &:visited {
    background-color: var(--primary-color-visited);
  }

  &:hover {
    background-color: var(--primary-color-hover);
  }
}

a.r-link-primary-plain {
  color: var(--primary-color);
  border: 1px solid var(--primary-color);
  background: var(--primary-color-plain);

  &:link {
    color: var(--primary-color);
    border: 1px solid var(--primary-color);
    background: var(--primary-color-plain);
  }

  &:visited {
    color: white;
    border: 1px solid var(--primary-color);
    background: var(--primary-color);
  }

  &:hover {
    color: white;
    border: 1px solid var(--primary-color-hover);
    background: var(--primary-color-hover);
  }
}

a.r-link-danger {
  &:link {
    color: var(--danger-color);
  }

  color: var(--danger-color);

  &:visited {
    color: var(--danger-color-visited);
  }

  &:hover {
    color: var(--danger-color-hover);
  }
}

a.r-link-danger-fill {
  background-color: var(--danger-color);
  &:link {
    background-color: var(--danger-color);
  }

  &:visited {
    background-color: var(--danger-color-visited);
  }

  &:hover {
    background-color: var(--danger-color-hover);
  }
}

a.r-link-danger-plain {
  color: var(--danger-color);
  border: 1px solid var(--danger-color);
  background: var(--danger-color-plain);

  &:link {
    color: var(--danger-color);
    border: 1px solid var(--danger-color);
    background: var(--danger-color-plain);
  }

  &:visited {
    color: white;
    border: 1px solid var(--danger-color);
    background: var(--danger-color);
  }

  &:hover {
    color: white;
    border: 1px solid var(--danger-color-hover);
    background: var(--danger-color-hover);
  }
}

a.r-link {
  cursor: pointer;
  text-align: left;
  text-decoration: underline;
  font-size: var(--link-font-size);
}

a.r-link-fill {
  color: white;
  text-decoration: none;
  border-radius: 3px;
  cursor: pointer;
  text-align: left;
  padding: 6px 15px;
  font-size: var(--button-font-size);
  white-space: nowrap;
}

a.r-link-plain {
  text-decoration: none;
  border-radius: 3px;
  cursor: pointer;
  text-align: left;
  padding: 5px 15px;
  font-size: var(--button-font-size);
  white-space: nowrap;
}

.r-link-content {
  display: inline-block;
}

.r-link-a {
  display: inline-block;
  padding: 3px 0;
  text-align: left;
}

a.r-link-success-fill {
  &:link {
    background-color: var(--success-color);
  }
  background-color: var(--success-color);

  &:visited {
    background-color: var(--success-color-visited);
  }

  &:hover {
    background-color: var(--success-color-hover);
  }
}

a.r-link-success {
  &:link {
    color: var(--success-color);
  }

  color: var(--success-color);

  &:visited {
    color: var(--success-color-visited);
  }

  &:hover {
    color: var(--success-color-hover);
  }
}

a.r-link-success-plain {
  color: var(--success-color);
  border: 1px solid var(--success-color);
  background: var(--success-color-plain);

  &:link {
    color: var(--success-color);
    border: 1px solid var(--success-color);
    background: var(--success-color-plain);
  }

  &:visited {
    color: white;
    border: 1px solid var(--success-color);
    background: var(--success-color);
  }

  &:hover {
    color: white;
    border: 1px solid var(--success-color-hover);
    background: var(--success-color-hover);
  }
}



a.r-link-warning {
  &:link {
    color: var(--warning-color);
  }

  color: var(--warning-color);

  &:visited {
    color: var(--warning-color-visited);
  }

  &:hover {
    color: var(--warning-color-hover);
  }
}

a.r-link-warning-fill {
  background-color: var(--warning-color);
  &:link {
    background-color: var(--warning-color);
  }

  &:visited {
    background-color: var(--warning-color-visited);
  }

  &:hover {
    background-color: var(--warning-color-hover);
  }
}

a.r-link-warning-plain {
  color: var(--warning-color);
  border: 1px solid var(--warning-color);
  background: var(--warning-color-plain);

  &:link {
    color: var(--warning-color);
    border: 1px solid var(--warning-color);
    background: var(--warning-color-plain);
  }

  &:visited {
    color: white;
    border: 1px solid var(--warning-color);
    background: var(--warning-color);
  }

  &:hover {
    color: white;
    border: 1px solid var(--warning-color-hover);
    background: var(--warning-color-hover);
  }
}

a.underlineNone {
  text-decoration: none;
}
</style>