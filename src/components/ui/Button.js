import { jsx as _jsx } from "react/jsx-runtime";
export default function Button({ children, variant = "primary" }) {
    return (_jsx("button", { className: `btn btn-${variant}`, children: children }));
}
