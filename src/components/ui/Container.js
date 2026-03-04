import { jsx as _jsx } from "react/jsx-runtime";
export default function Container({ children, className = "" }) {
    return _jsx("div", { className: `container ${className}`, children: children });
}
