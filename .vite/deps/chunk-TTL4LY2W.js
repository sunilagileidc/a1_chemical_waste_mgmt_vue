import {
  VTooltip
} from "./chunk-STF46YTT.js";
import {
  consoleError,
  isObject
} from "./chunk-LQLLNLBF.js";
import {
  h,
  mergeProps,
  render,
  resolveComponent
} from "./chunk-73HNARDV.js";

// node_modules/vuetify/lib/composables/directiveComponent.js
function useDirectiveComponent(component, props) {
  const concreteComponent = typeof component === "string" ? resolveComponent(component) : component;
  const hook = mountComponent(concreteComponent, props);
  return {
    mounted: hook,
    updated: hook,
    unmounted(el) {
      render(null, el);
    }
  };
}
function mountComponent(component, props) {
  return function(el, binding, vnode) {
    var _a, _b, _c;
    const _props = typeof props === "function" ? props(binding) : props;
    const text = ((_a = binding.value) == null ? void 0 : _a.text) ?? binding.value ?? (_props == null ? void 0 : _props.text);
    const value = isObject(binding.value) ? binding.value : {};
    const children = () => text ?? el.textContent;
    const provides = (vnode.ctx === binding.instance.$ ? (_b = findComponentParent(vnode, binding.instance.$)) == null ? void 0 : _b.provides : (_c = vnode.ctx) == null ? void 0 : _c.provides) ?? binding.instance.$.provides;
    const node = h(component, mergeProps(_props, value), children);
    node.appContext = Object.assign(/* @__PURE__ */ Object.create(null), binding.instance.$.appContext, {
      provides
    });
    render(node, el);
  };
}
function findComponentParent(vnode, root) {
  const stack = /* @__PURE__ */ new Set();
  const walk = (children) => {
    var _a, _b;
    for (const child of children) {
      if (!child) continue;
      if (child === vnode || child.el && vnode.el && child.el === vnode.el) {
        return true;
      }
      stack.add(child);
      let result2;
      if (child.suspense) {
        result2 = walk([child.ssContent]);
      } else if (Array.isArray(child.children)) {
        result2 = walk(child.children);
      } else if ((_a = child.component) == null ? void 0 : _a.vnode) {
        result2 = walk([(_b = child.component) == null ? void 0 : _b.subTree]);
      }
      if (result2) {
        return result2;
      }
      stack.delete(child);
    }
    return false;
  };
  if (!walk([root.subTree])) {
    consoleError("Could not find original vnode, component will not inherit provides");
    return root;
  }
  const result = Array.from(stack).reverse();
  for (const child of result) {
    if (child.component) {
      return child.component;
    }
  }
  return root;
}

// node_modules/vuetify/lib/directives/tooltip/index.js
var Tooltip = useDirectiveComponent(VTooltip, (binding) => {
  var _a;
  const disabled = isObject(binding.value) ? !binding.value.text : ["", false, null].includes(binding.value);
  return {
    activator: disabled ? null : "parent",
    location: (_a = binding.arg) == null ? void 0 : _a.replace("-", " "),
    text: typeof binding.value === "boolean" ? void 0 : binding.value
  };
});
var tooltip_default = Tooltip;

export {
  Tooltip,
  tooltip_default
};
//# sourceMappingURL=chunk-TTL4LY2W.js.map
